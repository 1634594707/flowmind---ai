import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequirementSession } from './entities/requirement-session.entity';
import { RequirementMessage } from './entities/requirement-message.entity';
import { CreateRequirementSessionDto } from './dto/create-requirement-session.dto';
import { AddRequirementMessageDto } from './dto/add-requirement-message.dto';
import { GeneratePrdDto } from './dto/generate-prd.dto';
import { GenerateArchitectureDto } from './dto/generate-architecture.dto';
import { GenerateApiSpecDto } from './dto/generate-api-spec.dto';
import { GenerateDatabaseDesignDto } from './dto/generate-database-design.dto';
import { GenerateTechStackDto } from './dto/generate-tech-stack.dto';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';
import { LlmService, type LlmChatMessage } from './llm.service';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(RequirementSession)
    private sessionsRepository: Repository<RequirementSession>,
    @InjectRepository(RequirementMessage)
    private messagesRepository: Repository<RequirementMessage>,
    private projectsService: ProjectsService,
    private documentsService: DocumentsService,
    private llmService: LlmService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getSessionsListCacheKey(userId: string, projectId: string) {
    return `ai:sessions:list:${userId}:${projectId}`;
  }

  private async buildDesignInput(
    userId: string,
    projectId: string,
    opts: { sourceDocumentId?: string; context?: string },
  ): Promise<string> {
    const blocks: string[] = [];

    await this.projectsService.findOneForUser(projectId, userId);

    if (opts.sourceDocumentId) {
      const doc = await this.documentsService.findOneForUser(opts.sourceDocumentId, userId);
      blocks.push(`## 参考文档：${doc.title}`);
      blocks.push(doc.content || '');
    }

    if (opts.context) {
      blocks.push('## 补充上下文');
      blocks.push(opts.context);
    }

    return blocks.join('\n\n').trim();
  }

  async generateArchitecture(dto: GenerateArchitectureDto, userId: string) {
    const input = await this.buildDesignInput(userId, dto.projectId, {
      sourceDocumentId: dto.sourceDocumentId,
      context: dto.context,
    });

    const prompt = [
      '你是资深架构师。请基于输入内容输出一份“架构设计建议”（Markdown）。',
      '要求：',
      '- 给出整体架构（模块划分、边界、职责）。',
      '- 给出关键技术选型建议（前端/后端/数据库/缓存/消息队列等），并说明理由。',
      '- 给出关键接口/数据流说明。',
      '- 识别风险点与改进建议。',
      '- 尽量可落地、条理清晰。',
      '输出必须为 Markdown，不要输出与内容无关的解释。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];

    const content = await this.llmService.chat(llmMessages, { temperature: 0.2 });
    const document = await this.documentsService.create({
      title: dto.documentTitle || '架构设计建议',
      type: 'design',
      content,
      version: '1.0',
      projectId: dto.projectId,
      authorId: userId,
    });

    return { document, content };
  }

  async generateTechStack(dto: GenerateTechStackDto, userId: string) {
    const input = await this.buildDesignInput(userId, dto.projectId, {
      sourceDocumentId: dto.sourceDocumentId,
      context: dto.context,
    });

    const prompt = [
      '你是资深技术负责人。请基于输入内容生成“技术选型推荐”（Markdown）。',
      '要求：',
      '- 从前端、后端、数据库、缓存、消息队列、搜索、对象存储、监控告警、CI/CD、部署形态等维度给出推荐。',
      '- 每个选型给出 2-3 个候选方案，并给出推荐方案与理由（成本、团队能力、可维护性、性能、扩展性）。',
      '- 给出风险点与替代方案。',
      '- 给出最小可行版本（MVP）与后续演进路径。',
      '- 输出必须为 Markdown，不要输出与内容无关的解释。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];

    const content = await this.llmService.chat(llmMessages, { temperature: 0.2 });
    const document = await this.documentsService.create({
      title: dto.documentTitle || '技术选型推荐',
      type: 'design',
      content,
      version: '1.0',
      projectId: dto.projectId,
      authorId: userId,
    });

    return { document, content };
  }

  async generateApiSpec(dto: GenerateApiSpecDto, userId: string) {
    const input = await this.buildDesignInput(userId, dto.projectId, {
      sourceDocumentId: dto.sourceDocumentId,
      context: dto.context,
    });

    const prompt = [
      '你是资深后端工程师与 API 设计专家。请基于输入内容生成“API 接口定义”（Markdown）。',
      '要求：',
      '- 输出接口清单（按资源/模块分组）。',
      '- 每个接口包含：HTTP 方法、路径、用途说明、请求参数（path/query/body）、响应结构、错误码。',
      '- 给出统一的鉴权方式与通用响应结构约定（如 code/message/data）。',
      '- 如有分页、排序、过滤等需求请明确字段。',
      '- 输出必须为 Markdown，不要输出与内容无关的解释。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];

    const content = await this.llmService.chat(llmMessages, { temperature: 0.2 });
    const document = await this.documentsService.create({
      title: dto.documentTitle || 'API 接口定义',
      type: 'api',
      content,
      version: '1.0',
      projectId: dto.projectId,
      authorId: userId,
    });

    return { document, content };
  }

  async generateDatabaseDesign(dto: GenerateDatabaseDesignDto, userId: string) {
    const input = await this.buildDesignInput(userId, dto.projectId, {
      sourceDocumentId: dto.sourceDocumentId,
      context: dto.context,
    });

    const prompt = [
      '你是资深数据库工程师。请基于输入内容生成“数据库设计建议”（Markdown）。',
      '要求：',
      '- 输出表清单（含用途），每张表给出字段（类型/是否必填/默认值）、主键、索引建议。',
      '- 明确表之间关系（1-1/1-N/N-N）以及外键字段。',
      '- 给出约束（唯一性、枚举值、软删除字段等）建议。',
      '- 给出查询性能与扩展性建议（索引、分区、读写分离等，按需要）。',
      '- 输出必须为 Markdown，不要输出与内容无关的解释。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];

    const content = await this.llmService.chat(llmMessages, { temperature: 0.2 });
    const document = await this.documentsService.create({
      title: dto.documentTitle || '数据库设计建议',
      type: 'design',
      content,
      version: '1.0',
      projectId: dto.projectId,
      authorId: userId,
    });

    return { document, content };
  }

  private getSessionDetailCacheKey(userId: string, sessionId: string) {
    return `ai:sessions:detail:${userId}:${sessionId}`;
  }

  private async invalidateSessionsCache(userId: string, projectId: string, sessionId?: string) {
    await this.cacheManager.del(this.getSessionsListCacheKey(userId, projectId));
    if (sessionId) {
      await this.cacheManager.del(this.getSessionDetailCacheKey(userId, sessionId));
    }
  }

  async createRequirementSession(dto: CreateRequirementSessionDto, userId: string) {
    await this.projectsService.findOneForUser(dto.projectId, userId);

    const session = this.sessionsRepository.create({
      projectId: dto.projectId,
      ownerId: userId,
      title: dto.title,
      summary: dto.summary,
    });

    const saved = (await this.sessionsRepository.save(session)) as unknown as RequirementSession;
    await this.invalidateSessionsCache(userId, dto.projectId);
    return saved;
  }

  async addRequirementMessage(sessionId: string, dto: AddRequirementMessageDto, userId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId, ownerId: userId },
    });

    if (!session) {
      throw new NotFoundException('Requirement session not found');
    }

    const message = this.messagesRepository.create({
      sessionId: session.id,
      role: dto.role,
      content: dto.content,
    });

    const saved = (await this.messagesRepository.save(message)) as unknown as RequirementMessage;
    await this.invalidateSessionsCache(userId, session.projectId, session.id);
    return saved;
  }

  async getRequirementSession(sessionId: string, userId: string) {
    const cached = await this.cacheManager.get<RequirementSession>(
      this.getSessionDetailCacheKey(userId, sessionId),
    );
    if (cached) {
      return cached;
    }

    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId, ownerId: userId },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } as any },
    });

    if (!session) {
      throw new NotFoundException('Requirement session not found');
    }

    await this.cacheManager.set(this.getSessionDetailCacheKey(userId, sessionId), session, 15_000);
    return session;
  }

  async listRequirementSessionsByProject(projectId: string, userId: string) {
    await this.projectsService.findOneForUser(projectId, userId);

    const listCacheKey = this.getSessionsListCacheKey(userId, projectId);
    const cached = await this.cacheManager.get<RequirementSession[]>(listCacheKey);
    if (cached) {
      return cached;
    }

    const qb = this.sessionsRepository.createQueryBuilder('session');

    qb.where('session.projectId = :projectId', { projectId })
      .andWhere('session.ownerId = :ownerId', { ownerId: userId })
      .leftJoinAndMapOne(
        'session.lastMessage',
        RequirementMessage,
        'lastMessage',
        `lastMessage.id = (
          SELECT m.id
          FROM requirement_messages m
          WHERE m.session_id = session.id
          ORDER BY m."createdAt" DESC
          LIMIT 1
        )`,
      )
      .orderBy('session.updatedAt', 'DESC');

    const sessions = await qb.getMany();
    await this.cacheManager.set(listCacheKey, sessions, 20_000);
    return sessions;
  }

  private buildChatMessages(
    session: RequirementSession,
    messages: RequirementMessage[],
  ): LlmChatMessage[] {
    const systemPrompt = [
      '你是资深产品经理与需求分析助手。',
      '目标：通过对话澄清需求，追问关键缺失信息，输出结构化的需求要点。',
      '规则：',
      '- 回复尽量简洁，优先提问与澄清。',
      '- 如果信息不足，提出 3-6 个具体问题。',
      '- 不要编造业务事实。',
    ].join('\n');

    const context: LlmChatMessage[] = [{ role: 'system', content: systemPrompt }];

    if (session.title) {
      context.push({ role: 'system', content: `会话标题：${session.title}` });
    }
    if (session.summary) {
      context.push({ role: 'system', content: `背景/目标：${session.summary}` });
    }

    for (const m of messages) {
      context.push({ role: m.role, content: m.content } as LlmChatMessage);
    }

    return context;
  }

  async chat(sessionId: string, content: string, userId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId, ownerId: userId },
    });

    if (!session) {
      throw new NotFoundException('Requirement session not found');
    }

    const userMsg = this.messagesRepository.create({
      sessionId: session.id,
      role: 'user',
      content,
    });
    const savedUserMsg = (await this.messagesRepository.save(
      userMsg,
    )) as unknown as RequirementMessage;

    const history = await this.messagesRepository.find({
      where: { sessionId: session.id },
      order: { createdAt: 'ASC' },
    });

    const llmMessages = this.buildChatMessages(session, history);
    const assistantContent = await this.llmService.chat(llmMessages, { temperature: 0.4 });

    const assistantMsg = this.messagesRepository.create({
      sessionId: session.id,
      role: 'assistant',
      content: assistantContent,
    });
    const savedAssistantMsg = (await this.messagesRepository.save(
      assistantMsg,
    )) as unknown as RequirementMessage;

    await this.invalidateSessionsCache(userId, session.projectId, session.id);

    return {
      sessionId: session.id,
      userMessage: savedUserMsg,
      assistantMessage: savedAssistantMsg,
    };
  }

  async generatePrd(sessionId: string, dto: GeneratePrdDto, userId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId, ownerId: userId },
    });

    if (!session) {
      throw new NotFoundException('Requirement session not found');
    }

    const messages = await this.messagesRepository.find({
      where: { sessionId: session.id },
      order: { createdAt: 'ASC' },
    });

    const prdPrompt = [
      '请基于下面的需求访谈对话，生成一份 PRD（Markdown）。',
      '要求：',
      '- 使用清晰的章节结构（背景/目标、范围、用户故事、功能需求、非功能性、数据、里程碑、风险与开放问题）。',
      '- 对于信息不足的部分，请用“（待确认）”标注，并在“开放问题”中列出需要进一步澄清的问题。',
      '- 输出必须为 Markdown，且不要包含与 PRD 无关的解释。',
    ].join('\n');

    const llmMessages: LlmChatMessage[] = [
      { role: 'system', content: prdPrompt },
      { role: 'system', content: `会话标题：${session.title}` },
      ...(session.summary
        ? [{ role: 'system' as const, content: `背景/目标：${session.summary}` }]
        : []),
      ...messages.map((m) => ({ role: m.role, content: m.content }) as LlmChatMessage),
    ];

    const content = await this.llmService.chat(llmMessages, { temperature: 0.2 });

    const document = await this.documentsService.create({
      title: dto.documentTitle || `${session.title} - PRD`,
      type: 'prd',
      content,
      version: '1.0',
      projectId: session.projectId,
      authorId: userId,
    });

    return {
      session,
      document,
      content,
    };
  }
}
