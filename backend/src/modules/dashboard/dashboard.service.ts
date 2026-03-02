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
      delayedProjects: stats.delayed,
      trends: {
        totalProjects: '+12%',
        activeProjects: '+3',
        completedProjects: '+5',
        delayedProjects: '-2',
      },
    };
  }

  async getActivities(userId: string) {
    // TODO: 实现真实的活动记录
    return [
      {
        id: '1',
        type: 'project_created',
        user: {
          id: userId,
          name: '张三',
          avatar: null,
        },
        action: '创建了项目',
        target: 'FlowMind 平台',
        targetId: '1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'task_completed',
        user: {
          id: userId,
          name: '李四',
          avatar: null,
        },
        action: '完成了任务',
        target: '需求分析文档',
        targetId: '2',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}
