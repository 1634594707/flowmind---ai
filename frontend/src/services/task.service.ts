import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assigneeId?: string;
  sourceDocumentId?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId: string;
  assigneeId?: string;
  sourceDocumentId?: string;
  dueDate?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface DecomposeTasksDto {
  projectId: string;
  sourceDocumentId?: string;
  context?: string;
}

export interface GetTasksQuery {
  projectId?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assigneeId?: string;
  sourceDocumentId?: string;
}

export const taskService = {
  async getAll(query?: GetTasksQuery): Promise<Task[]> {
    const response = await api.get<{ code: number; data: Task[] }>('/tasks', {
      params: query,
    });
    return response.data.data;
  },

  async getByProject(projectId: string): Promise<Task[]> {
    return this.getAll({ projectId });
  },

  async getById(id: string): Promise<Task> {
    const response = await api.get<{ code: number; data: Task }>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<{ code: number; message: string; data: Task }>('/tasks', data);
    return response.data.data;
  },

  async decompose(data: DecomposeTasksDto): Promise<Task[]> {
    const response = await api.post<{ code: number; message: string; data: Task[] }>('/tasks/decompose', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.patch<{ code: number; message: string; data: Task }>(`/tasks/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete<{ code: number; message: string }>(`/tasks/${id}`);
  },
};
