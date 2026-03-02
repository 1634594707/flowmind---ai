import api from './api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  progress: number;
  startDate?: string;
  deadline?: string;
  tags?: string[];
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  deadline?: string;
  tags?: string[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  progress?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectListResponse {
  items: Project[];
  pagination: Pagination;
}

export interface GetProjectsQuery {
  page?: number;
  limit?: number;
  status?: 'planning' | 'active' | 'completed' | 'archived';
  search?: string;
}

export const projectService = {
  async getAll(query?: GetProjectsQuery): Promise<ProjectListResponse> {
    const response = await api.get<{ code: number; data: ProjectListResponse }>('/projects', {
      params: query,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await api.get<{ code: number; data: Project }>(`/projects/${id}`);
    return response.data.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await api.post<{ code: number; data: Project }>('/projects', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await api.patch<{ code: number; data: Project }>(`/projects/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
