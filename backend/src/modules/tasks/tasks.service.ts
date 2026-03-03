import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';
import { LlmService, type LlmChatMessage } from '../ai/llm.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { DecomposeTasksDto } from './dto/decompose-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private projectsService: ProjectsService,
    private documentsService: DocumentsService,
    private llmService: LlmService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId?: string): Promise<Task> {
    if (userId && createTaskDto?.projectId) {
      await this.projectsService.findOneForUser(createTaskDto.projectId, userId);
    }
    if (userId && createTaskDto?.sourceDocumentId) {
      await this.documentsService.findOneForUser(createTaskDto.sourceDocumentId, userId);
    }
    const task = this.tasksRepository.create(createTaskDto);
    return (await this.tasksRepository.save(task)) as unknown as Task;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findAllForUser(userId: string, query: QueryTasksDto = {}): Promise<Task[]> {
    const qb = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .where('project.ownerId = :userId', { userId });

    if (query.projectId) {
      await this.projectsService.findOneForUser(query.projectId, userId);
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }
    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }
    if (query.assigneeId) {
      qb.andWhere('task.assigneeId = :assigneeId', { assigneeId: query.assigneeId });
    }
    if (query.sourceDocumentId) {
      qb.andWhere('task.sourceDocumentId = :sourceDocumentId', { sourceDocumentId: query.sourceDocumentId });
    }

    return qb.orderBy('task.updatedAt', 'DESC').getMany();
  }

  private extractFirstJsonBlock(text: string): string {
    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) {
      return fenced[1].trim();
    }
    const objOrArray = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (objOrArray?.[1]) {
      return objOrArray[1].trim();
    }
    return text.trim();
  }

  async decomposeAndCreateTasks(
    dto: DecomposeTasksDto,
    userId: string,
  ): Promise<Task[]> {
    if (!dto.projectId) {
      throw new BadRequestException('projectId is required');
    }
    if (!dto.sourceDocumentId && !dto.context) {
      throw new BadRequestException('sourceDocumentId or context is required');
    }

    await this.projectsService.findOneForUser(dto.projectId, userId);

    const blocks: string[] = [];
    if (dto.sourceDocumentId) {
      const doc = await this.documentsService.findOneForUser(dto.sourceDocumentId, userId);
      blocks.push(`## 参考文档：${doc.title}`);
      blocks.push(doc.content || '');
    }
    if (dto.context) {
      blocks.push('## 补充上下文');
      blocks.push(dto.context);
    }
    const input = blocks.join('\n\n').trim();

    const prompt = [
      '你是资深项目经理与交付负责人。请将输入内容拆解为可执行的任务列表。',
      '输出要求：',
      '- 只输出 JSON，不要额外解释。',
      '- JSON 必须是数组，每个元素包含：title, description(可选), priority(可选: low|medium|high), status(可选: todo|in_progress|done)。',
      '- title 不超过 200 字。',
      '- 任务粒度：1-3 天可完成；避免过大任务。',
      '- 如果信息不足，仍给出合理假设下的任务拆解。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];

    const raw = await this.llmService.chat(llmMessages, { temperature: 0.2 });
    const jsonText = this.extractFirstJsonBlock(raw);

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new BadRequestException('LLM output is not valid JSON');
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('LLM output JSON must be an array');
    }

    const normalized = parsed
      .map((t: any) => {
        const title = String(t?.title || '').trim();
        if (!title) {
          return null;
        }
        const description = t?.description == null ? undefined : String(t.description);
        const status = ['todo', 'in_progress', 'done'].includes(t?.status) ? t.status : 'todo';
        const priority = ['low', 'medium', 'high'].includes(t?.priority) ? t.priority : 'medium';
        return {
          title: title.slice(0, 200),
          description,
          status,
          priority,
          projectId: dto.projectId,
          sourceDocumentId: dto.sourceDocumentId,
        } as Partial<Task>;
      })
      .filter(Boolean) as Array<Partial<Task>>;

    if (normalized.length === 0) {
      throw new BadRequestException('No tasks generated');
    }

    const entities = this.tasksRepository.create(normalized as any);
    return (await this.tasksRepository.save(entities as any)) as unknown as Task[];
  }

  async findOne(id: string): Promise<Task> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  async findOneForUser(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .where('task.id = :id', { id })
      .andWhere('project.ownerId = :userId', { userId })
      .getOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async updateForUser(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    await this.findOneForUser(id, userId);
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOneForUser(id, userId);
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async removeForUser(id: string, userId: string): Promise<void> {
    await this.findOneForUser(id, userId);
    await this.tasksRepository.delete(id);
  }
}
