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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<{ code: number; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    const response = await api.get<{ code: number; data: RecentActivity[] }>('/dashboard/activities');
    return response.data.data;
  },
};
