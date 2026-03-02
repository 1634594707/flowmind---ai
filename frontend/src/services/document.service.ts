import api from './api';

export interface Document {
  id: string;
  title: string;
  type: 'prd' | 'design' | 'api' | 'test' | 'general';
  content: string;
  version: string;
  projectId: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  type: string;
  content: string;
  version?: string;
  projectId: string;
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {}

export const documentService = {
  async getAll(): Promise<Document[]> {
    const response = await api.get<{ code: number; data: Document[] }>('/documents');
    return response.data.data;
  },

  async getByProject(projectId: string): Promise<Document[]> {
    const response = await api.get<{ code: number; data: Document[] }>(`/documents?projectId=${projectId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Document> {
    const response = await api.get<{ code: number; data: Document }>(`/documents/${id}`);
    return response.data.data;
  },

  async create(data: CreateDocumentDto): Promise<Document> {
    const response = await api.post<{ code: number; message: string; data: Document }>('/documents', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateDocumentDto): Promise<Document> {
    const response = await api.patch<{ code: number; message: string; data: Document }>(`/documents/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete<{ code: number; message: string }>(`/documents/${id}`);
  },
};
