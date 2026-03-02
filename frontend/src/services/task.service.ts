import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assigneeId?: string;
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
  dueDate?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await api.get<{ code: number; data: Task[] }>('/tasks');
    return response.data.data;
  },

  async getByProject(projectId: string): Promise<Task[]> {
    const response = await api.get<{ code: number; data: Task[] }>(`/tasks?projectId=${projectId}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await api.get<{ code: number; data: Task }>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<{ code: number; message: string; data: Task }>('/tasks', data);
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
