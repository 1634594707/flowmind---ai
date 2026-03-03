import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Select, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { AxiosError } from 'axios'
import { LoadingBlock, PageHeader } from '@/components/ui'
import { projectService, type Project } from '@/services/project.service'
import { taskService, type Task } from '@/services/task.service'
import {
  integrationsGithubService,
  type GithubProjectBinding,
  type GithubRepo,
} from '@/services/integrations-github.service'

const ProjectTasks = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  const [githubLoading, setGithubLoading] = useState(false)
  const [githubBinding, setGithubBinding] = useState<GithubProjectBinding | null>(null)
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string | undefined>(undefined)

  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | Task['priority']>('all')

  const queryStatus = filterStatus === 'all' ? undefined : filterStatus
  const queryPriority = filterPriority === 'all' ? undefined : filterPriority

  const load = useCallback(async () => {
    if (!id) {
      return
    }

    try {
      setLoading(true)

      const [projectData, taskList] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ projectId: id, status: queryStatus, priority: queryPriority }),
      ])

      setProject(projectData)
      setTasks(taskList)
    } catch (error: unknown) {
      console.error('Load project tasks error:', error)
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载任务失败')
    } finally {
      setLoading(false)
    }
  }, [id, queryPriority, queryStatus])

  const loadGithub = useCallback(async () => {
    if (!id) {
      return
    }
    try {
      setGithubLoading(true)
      const binding = await integrationsGithubService.getBinding(id)
      setGithubBinding(binding)

      try {
        const repos = await integrationsGithubService.listRepos()
        setGithubRepos(repos)
      } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>
        const msg = err.response?.data?.message || ''

        if (msg.toLowerCase().includes('not connected')) {
          setGithubRepos([])
        } else {
          throw error
        }
      }

      setSelectedRepo(binding?.fullName || undefined)
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '加载 GitHub 仓库失败')
    } finally {
      setGithubLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!id) {
      return
    }
    const params = new URLSearchParams(window.location.search)
    const connected = params.get('github')
    if (connected === 'connected') {
      params.delete('github')
      const next = window.location.pathname + (params.toString() ? `?${params.toString()}` : '')
      window.history.replaceState({}, '', next)
    }
    void loadGithub()
  }, [id, loadGithub])

  const statusMeta = useMemo(() => {
    return {
      todo: { text: '待办', color: 'default' as const },
      in_progress: { text: '进行中', color: 'blue' as const },
      done: { text: '已完成', color: 'green' as const },
    }
  }, [])

  const priorityMeta = useMemo(() => {
    return {
      low: { text: '低', color: 'default' as const },
      medium: { text: '中', color: 'orange' as const },
      high: { text: '高', color: 'red' as const },
    }
  }, [])

  const columns: ColumnsType<Task> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (value: string) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: Task['status']) => {
        const meta = statusMeta[value] || { text: value, color: 'default' as const }
        return <Tag color={meta.color}>{meta.text}</Tag>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (value: Task['priority']) => {
        const meta = priorityMeta[value] || { text: value, color: 'default' as const }
        return <Tag color={meta.color}>{meta.text}</Tag>
      },
    },
    {
      title: '负责人',
      dataIndex: ['assignee', 'name'],
      key: 'assignee',
      width: 160,
      render: (_: unknown, record) => record.assignee?.name || '-',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 140,
      render: (value?: string) => (value ? new Date(value).toLocaleDateString('zh-CN') : '-'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (value: string) => (value ? new Date(value).toLocaleString('zh-CN') : '-'),
    },
  ]

  if (loading) {
    return <LoadingBlock className="flex items-center justify-center py-16" />
  }

  if (!id || !project) {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={`任务 - ${project.name}`}
        subtitle="按项目查看任务并进行筛选"
        right={
          <>
            <Button onClick={() => navigate(`/app/projects/${id}`)}>返回项目</Button>
            <Button
              type="primary"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => message.info('创建任务 UI 将在下一步补齐')}
            >
              新建任务
            </Button>
          </>
        }
      />

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">GitHub 集成</div>
            <div className="text-sm text-gray-600 mt-1">
              {githubBinding?.fullName ? `已绑定仓库：${githubBinding.fullName}` : '尚未绑定仓库'}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <Button
              loading={githubLoading}
              onClick={async () => {
                try {
                  const url = await integrationsGithubService.getConnectUrl(id)
                  window.location.href = url
                } catch (error: unknown) {
                  const err = error as AxiosError<{ message?: string }>
                  message.error(err.response?.data?.message || '无法发起 GitHub 授权')
                }
              }}
            >
              连接 GitHub
            </Button>

            {!!githubRepos.length && (
              <>
                <Select
                  value={selectedRepo}
                  onChange={(v) => setSelectedRepo(v)}
                  placeholder="选择仓库"
                  className="w-full md:w-80"
                  loading={githubLoading}
                  options={githubRepos.map((r) => ({
                    value: r.fullName,
                    label: r.private ? `${r.fullName} (private)` : r.fullName,
                  }))}
                />

                <Button
                  type="primary"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!selectedRepo}
                  loading={githubLoading}
                  onClick={async () => {
                    if (!id || !selectedRepo) {
                      return
                    }
                    try {
                      setGithubLoading(true)
                      const bound = await integrationsGithubService.bindRepo(id, selectedRepo)
                      setGithubBinding(bound)
                      message.success('仓库绑定成功')
                    } catch (error: unknown) {
                      const err = error as AxiosError<{ message?: string }>
                      message.error(err.response?.data?.message || '绑定失败')
                    } finally {
                      setGithubLoading(false)
                    }
                  }}
                >
                  绑定到项目
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select
            value={filterStatus}
            onChange={(v) => setFilterStatus(v)}
            className="w-full md:w-48"
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'todo', label: '待办' },
              { value: 'in_progress', label: '进行中' },
              { value: 'done', label: '已完成' },
            ]}
          />

          <Select
            value={filterPriority}
            onChange={(v) => setFilterPriority(v)}
            className="w-full md:w-48"
            options={[
              { value: 'all', label: '全部优先级' },
              { value: 'high', label: '高' },
              { value: 'medium', label: '中' },
              { value: 'low', label: '低' },
            ]}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={tasks}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default ProjectTasks
