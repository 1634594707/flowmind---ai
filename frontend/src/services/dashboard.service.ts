import api from './api';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalDocuments: number;
}

export interface RecentActivity {
  id: string;
  type: 'project' | 'task' | 'document';
  action: string;
  user: {
    id: string;
    name: string;
  };
  target: string;
  timestamp: string;
}

export interface DashboardProjectOverview {
  project: {
    id: string;
    name: string;
    description?: string;
    status: 'planning' | 'active' | 'completed' | 'archived';
    progress: number;
    stage?: string;
    owner?: {
      id: string;
      name: string;
      email: string;
    };
    deadline?: string;
  };
  prd: {
    exists: boolean;
    updatedAt: string | null;
  };
  recentDocuments: Array<{
    id: string;
    title: string;
    type: string;
    updatedAt: string;
  }>;
  nextActionHint: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<{ code: number; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    const response = await api.get<{ code: number; data: RecentActivity[] }>('/dashboard/activities');
    return response.data.data;
  },

  async getProjectOverviews(): Promise<{ items: DashboardProjectOverview[] }> {
    const response = await api.get<{ code: number; data: { items: DashboardProjectOverview[] } }>(
      '/dashboard/projects',
    );
    return response.data.data;
  },
};
