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

  private buildPrdMarkdown(session: RequirementSession, messages: RequirementMessage[]): string {
    const userMessages = messages.filter((m) => m.role === 'user');

    const highlights = userMessages.slice(0, 8).map((m, i) => `- ${i + 1}. ${m.content.trim()}`);

    const rawConversation = messages
      .map((m) => {
        const speaker = m.role === 'user' ? '用户' : m.role === 'assistant' ? 'AI' : '系统';
        return `**${speaker}**：${m.content.trim()}`;
      })
      .join('\n\n');

    return [
      `# ${session.title}`,
      '',
      '## 1. 背景与目标',
      session.summary ? session.summary : '（待补充）',
      '',
      '## 2. 需求要点（来自访谈）',
      highlights.length ? highlights.join('\n') : '- （暂无）',
      '',
      '## 3. 用户故事',
      '- 作为【用户】，我希望【目标】，以便【价值】。',
      '',
      '## 4. 功能范围',
      '### 4.1 核心功能',
      '- （待补充）',
      '',
      '### 4.2 非功能性需求',
      '- 性能：',
      '- 可用性：',
      '- 安全：',
      '',
      '## 5. 交互与界面草案',
      '- （待补充）',
      '',
      '## 6. 数据与埋点',
      '- （待补充）',
      '',
      '## 7. 风险与开放问题',
      '- （待补充）',
      '',
      '---',
      '',
      '## 附录：访谈记录',
      rawConversation.length ? rawConversation : '（暂无）',
      '',
    ].join('\n');
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
