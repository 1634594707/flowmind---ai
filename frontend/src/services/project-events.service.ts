import api from './api';

export interface ProjectEvent {
  id: string;
  projectId: string;
  type: string;
  source: string;
  payload?: Record<string, unknown> | null;
  actorId?: string | null;
  createdAt: string;
}

const EVENT_LABELS: Record<string, string> = {
  'stage.transition': '阶段推进',
  'prd.frozen': 'PRD 已冻结',
  'prd.unfrozen': 'PRD 已解冻',
  'prd.set_primary': '设置主 PRD',
  'document.created': '文档已创建',
  'document.updated': '文档已更新',
  'task.created': '任务已创建',
  'task.updated': '任务已更新',
  'task.decomposed': 'AI 拆解任务',
  'ai.prd_generated': 'AI 生成 PRD',
  'ai.design_generated': 'AI 生成设计文档',
};

export const getEventLabel = (type: string): string => EVENT_LABELS[type] ?? type;

export const projectEventsService = {
  async getRecent(projectId: string, limit = 20): Promise<ProjectEvent[]> {
    const response = await api.get<{ code: number; data: ProjectEvent[] }>(
      `/projects/${projectId}/events`,
      { params: { limit } }
    );
    return response.data.data;
  },
};
