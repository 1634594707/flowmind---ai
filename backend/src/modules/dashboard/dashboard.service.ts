import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DashboardService {
  constructor(private projectsService: ProjectsService) {}

  async getStats(userId: string) {
    const stats = await this.projectsService.getStats(userId);
    
    return {
      totalProjects: stats.total,
      activeProjects: stats.active,
      completedProjects: stats.completed,
      overdueProjects: stats.delayed,
      totalTasks: 0, // TODO: 从 TasksService 获取
      completedTasks: 0, // TODO: 从 TasksService 获取
      totalDocuments: 0, // TODO: 从 DocumentsService 获取
    };
  }

  async getActivities(userId: string) {
    // TODO: 实现真实的活动记录
    return [
      {
        id: '1',
        type: 'project' as const,
        action: '创建了项目',
        user: {
          id: userId,
          name: '张三',
        },
        target: 'FlowMind 平台',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'task' as const,
        action: '完成了任务',
        user: {
          id: userId,
          name: '李四',
        },
        target: '需求分析文档',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'document' as const,
        action: '更新了',
        user: {
          id: userId,
          name: '王五',
        },
        target: 'API 设计文档',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}
