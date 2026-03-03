import api from './api';

export interface RequirementSession {
  id: string;
  projectId: string;
  ownerId: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  messages?: RequirementMessage[];
  lastMessage?: RequirementMessage;
}

export interface RequirementMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface CreateRequirementSessionDto {
  projectId: string;
  title: string;
  summary?: string;
}

export interface AddRequirementMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeneratePrdDto {
  documentTitle?: string;
}

export interface GenerateDesignDto {
  projectId: string;
  sourceDocumentId?: string;
  context?: string;
  documentTitle?: string;
}

export interface GenerateDesignResult {
  document: {
    id: string;
    title: string;
    type: string;
    content: string;
    version: string;
    projectId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
  };
  content: string;
}

export interface GeneratePrdResult {
  session: RequirementSession;
  document: {
    id: string;
    title: string;
    type: string;
    content: string;
    version: string;
    projectId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
  };
  content: string;
}

export interface ChatRequirementResult {
  sessionId: string;
  userMessage: RequirementMessage;
  assistantMessage: RequirementMessage;
}

export const aiService = {
  async listRequirementSessions(projectId: string): Promise<RequirementSession[]> {
    const response = await api.get<{ code: number; data: RequirementSession[] }>(
      '/ai/requirement/sessions',
      {
        params: { projectId },
      },
    );
    return response.data.data;
  },

  async createRequirementSession(dto: CreateRequirementSessionDto): Promise<RequirementSession> {
    const response = await api.post<{ code: number; data: RequirementSession }>(
      '/ai/requirement/sessions',
      dto,
    );
    return response.data.data;
  },

  async getRequirementSession(id: string): Promise<RequirementSession> {
    const response = await api.get<{ code: number; data: RequirementSession }>(
      `/ai/requirement/sessions/${id}`,
    );
    return response.data.data;
  },

  async addRequirementMessage(sessionId: string, dto: AddRequirementMessageDto): Promise<RequirementMessage> {
    const response = await api.post<{ code: number; data: RequirementMessage }>(
      `/ai/requirement/sessions/${sessionId}/messages`,
      dto,
    );
    return response.data.data;
  },

  async chat(sessionId: string, content: string): Promise<ChatRequirementResult> {
    const response = await api.post<{ code: number; data: ChatRequirementResult }>(
      `/ai/requirement/sessions/${sessionId}/chat`,
      { content },
    );
    return response.data.data;
  },

  async generatePrd(sessionId: string, dto: GeneratePrdDto): Promise<GeneratePrdResult> {
    const response = await api.post<{ code: number; data: GeneratePrdResult }>(
      `/ai/requirement/sessions/${sessionId}/generate-prd`,
      dto,
    );
    return response.data.data;
  },

  async generateArchitecture(dto: GenerateDesignDto): Promise<GenerateDesignResult> {
    const response = await api.post<{ code: number; data: GenerateDesignResult }>(
      '/ai/design/architecture',
      dto,
    );
    return response.data.data;
  },

  async generateApiSpec(dto: GenerateDesignDto): Promise<GenerateDesignResult> {
    const response = await api.post<{ code: number; data: GenerateDesignResult }>(
      '/ai/design/api-spec',
      dto,
    );
    return response.data.data;
  },

  async generateDatabaseDesign(dto: GenerateDesignDto): Promise<GenerateDesignResult> {
    const response = await api.post<{ code: number; data: GenerateDesignResult }>(
      '/ai/design/database',
      dto,
    );
    return response.data.data;
  },

  async generateTechStack(dto: GenerateDesignDto): Promise<GenerateDesignResult> {
    const response = await api.post<{ code: number; data: GenerateDesignResult }>(
      '/ai/design/tech-stack',
      dto,
    );
    return response.data.data;
  },
};
