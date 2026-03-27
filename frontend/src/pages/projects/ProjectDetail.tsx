import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Tag, Progress, message, Timeline } from 'antd';
import type { AxiosError } from 'axios';
import { projectService, type Project } from '../../services/project.service';
import {
  projectEventsService,
  type ProjectEvent,
  getEventLabel,
} from '../../services/project-events.service';
import { LoadingBlock, PageHeader } from '@/components/ui';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    void loadProject(id);
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const data = await projectService.getById(projectId);
      setProject(data);
    } catch (error: unknown) {
      console.error('Load project error:', error);
      const err = error as AxiosError<{ message?: string }>;
      message.error(err.response?.data?.message || '加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (projectId: string) => {
    try {
      setEventsLoading(true);
      const data = await projectEventsService.getRecent(projectId, 20);
      setEvents(data);
    } catch {
      // 活动流加载失败不阻断主流程
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (id && project) {
      void loadEvents(id);
    }
  }, [id, project]);

  if (loading) {
    return <LoadingBlock className="flex items-center justify-center py-16" />;
  }

  if (!project) {
    return (
      <div className="py-12">
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-600">项目不存在或已被删除</div>
          <div className="mt-4">
            <Button onClick={() => navigate('/app/projects')}>返回项目列表</Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusText: Record<string, string> = {
    planning: '计划中',
    active: '进行中',
    completed: '已完成',
    archived: '已归档',
  };

  const stageText: Record<string, string> = {
    requirements: '需求',
    design: '设计',
    development: '开发',
    testing: '测试',
    release: '发布',
  };

  const agileStages = ['requirements', 'design', 'development', 'testing', 'release'];
  const currentStage = project?.stage || 'requirements';
  const nextStage = (() => {
    const idx = agileStages.indexOf(currentStage);
    if (idx < 0) {
      return '';
    }
    return idx >= agileStages.length - 1 ? '' : agileStages[idx + 1];
  })();

  const handleAdvanceStage = async () => {
    if (!project) {
      return;
    }
    try {
      setTransitioning(true);
      const updated = await projectService.transitionStage(project.id);
      setProject(updated);
      message.success('阶段已推进');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      message.error(err.response?.data?.message || '阶段推进失败');
    } finally {
      setTransitioning(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        subtitle={project.description || '暂无描述'}
        right={
          <>
            <Button onClick={() => navigate('/app/projects')}>返回</Button>
            <Button onClick={() => navigate(`/app/projects/${project.id}/tasks`)}>任务</Button>
            <Button
              type="primary"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate(`/app/projects/${project.id}/edit`)}
            >
              编辑项目
            </Button>
          </>
        }
      />

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-500 mb-2">状态</div>
            <Tag
              color={
                project.status === 'active'
                  ? 'green'
                  : project.status === 'planning'
                    ? 'blue'
                    : project.status === 'completed'
                      ? 'default'
                      : 'purple'
              }
            >
              {statusText[project.status] || project.status}
            </Tag>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">阶段 (Agile)</div>
            <div className="flex items-center justify-between gap-3">
              <Tag color="purple">{stageText[currentStage] || currentStage}</Tag>
              <Button
                type="primary"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={!nextStage}
                loading={transitioning}
                onClick={() => void handleAdvanceStage()}
              >
                {nextStage ? `推进到：${stageText[nextStage] || nextStage}` : '已到最终阶段'}
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">进度</div>
            <div className="flex items-center gap-3">
              <Progress
                percent={project.progress}
                strokeColor="#7C3AED"
                trailColor="#E9D5FF"
                className="flex-1"
              />
              <span className="text-sm text-gray-700 w-12 text-right">{project.progress}%</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">开始日期</div>
            <div className="text-gray-900">
              {project.startDate ? new Date(project.startDate).toLocaleDateString('zh-CN') : '-'}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">截止日期</div>
            <div className="text-gray-900">
              {project.deadline ? new Date(project.deadline).toLocaleDateString('zh-CN') : '-'}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm text-gray-500 mb-2">标签</div>
            <div className="flex flex-wrap gap-2">
              {(project.tags || []).length ? (
                project.tags?.map(t => (
                  <Tag key={t} color="purple">
                    {t}
                  </Tag>
                ))
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="项目活动" className="rounded-xl border border-gray-200 shadow-sm">
        {eventsLoading ? (
          <LoadingBlock />
        ) : events.length === 0 ? (
          <div className="text-gray-500 text-sm">暂无活动记录</div>
        ) : (
          <Timeline
            items={events.map(e => ({
              key: e.id,
              color: e.type.startsWith('ai.')
                ? 'purple'
                : e.type.startsWith('prd.')
                  ? 'orange'
                  : 'blue',
              children: (
                <div>
                  <div className="text-sm font-medium text-gray-900">{getEventLabel(e.type)}</div>
                  {e.payload && Object.keys(e.payload).length > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {Object.entries(e.payload)
                        .slice(0, 3)
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(' · ')}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(e.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  );
};

export default ProjectDetail;
