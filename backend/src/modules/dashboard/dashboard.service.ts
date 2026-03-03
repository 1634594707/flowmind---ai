import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class DashboardService {
  constructor(
    private projectsService: ProjectsService,
    private documentsService: DocumentsService,
  ) {}

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

  async getProjectOverviews(userId: string, limit = 5) {
    const projectsResult = await this.projectsService.findAll(
      {
        page: 1,
        limit,
        status: 'active',
      } as any,
      userId,
    );

    const items = await Promise.all(
      (projectsResult.items || []).map(async (project) => {
        const documents = await this.documentsService.findAllForUser(userId, project.id);
        const recentDocuments = (documents || []).slice(0, 3).map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          updatedAt: d.updatedAt,
        }));

        const prdDocs = (documents || []).filter((d) => (d.type || '').toLowerCase() === 'prd');
        const primaryPrd = prdDocs.find((d) => !!(d as any).isPrimary) || null;
        const latestPrd = prdDocs.length ? prdDocs[0] : null;
        const prdForDisplay = primaryPrd || latestPrd;

        const nextActionHint = (() => {
          if (!prdForDisplay) {
            return '生成并冻结主PRD';
          }

          if (primaryPrd && (primaryPrd as any).status !== 'FROZEN') {
            return '冻结主PRD以推进项目';
          }

          const stage = project.stage || 'requirements';
          if (stage === 'requirements') return '推进到设计阶段';
          if (stage === 'design') return '补齐设计/接口文档并推进开发';
          if (stage === 'development') return '同步开发进度并准备联调';
          if (stage === 'testing') return '完善测试用例并推进发布';
          if (stage === 'release') return '发布检查与上线';
          return '更新项目推进';
        })();

        return {
          project,
          prd: {
            exists: !!prdForDisplay,
            updatedAt: prdForDisplay?.updatedAt || null,
          },
          recentDocuments,
          nextActionHint,
        };
      }),
    );

    return { items };
  }
}
