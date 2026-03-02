import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Tag, Progress, message, Spin } from 'antd'
import type { AxiosError } from 'axios'
import { projectService, type Project } from '../../services/project.service'

const ProjectDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }
    void loadProject(id)
  }, [id])

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true)
      const data = await projectService.getById(projectId)
      setProject(data)
    } catch (error: unknown) {
      console.error('Load project error:', error)
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载项目失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    )
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
    )
  }

  const statusText: Record<string, string> = {
    planning: '计划中',
    active: '进行中',
    completed: '已完成',
    archived: '已归档',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description || '暂无描述'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/app/projects')}>返回</Button>
          <Button type="primary" className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate(`/app/projects/${project.id}/edit`)}>
            编辑项目
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-500 mb-2">状态</div>
            <Tag color={project.status === 'active' ? 'green' : project.status === 'planning' ? 'blue' : project.status === 'completed' ? 'default' : 'purple'}>
              {statusText[project.status] || project.status}
            </Tag>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">进度</div>
            <div className="flex items-center gap-3">
              <Progress percent={project.progress} strokeColor="#7C3AED" trailColor="#E9D5FF" className="flex-1" />
              <span className="text-sm text-gray-700 w-12 text-right">{project.progress}%</span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">开始日期</div>
            <div className="text-gray-900">{project.startDate ? new Date(project.startDate).toLocaleDateString('zh-CN') : '-'}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">截止日期</div>
            <div className="text-gray-900">{project.deadline ? new Date(project.deadline).toLocaleDateString('zh-CN') : '-'}</div>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm text-gray-500 mb-2">标签</div>
            <div className="flex flex-wrap gap-2">
              {(project.tags || []).length ? (
                project.tags?.map((t) => (
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
    </div>
  )
}

export default ProjectDetail
