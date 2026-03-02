import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Select, Tag, message, Pagination } from 'antd'
import { 
  FolderIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { projectService, type Project } from '../../services/project.service'

const ProjectList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [total, setTotal] = useState(0)

  const queryStatus = filterStatus === 'all' ? undefined : (filterStatus as Project['status'])

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const result = await projectService.getAll({
        page,
        limit: pageSize,
        status: queryStatus,
        search: searchText || undefined,
      })
      setProjects(result.items)
      setTotal(result.pagination.total)
    } catch (error: unknown) {
      console.error('Load projects error:', error)
      const err = error as { response?: { data?: { message?: string } } }
      message.error(err.response?.data?.message || '加载项目失败')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, queryStatus, searchText])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setPage(1)
      void loadProjects()
    }, 300)
    return () => window.clearTimeout(handle)
  }, [loadProjects, searchText])

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      planning: '规划中',
      active: '进行中',
      completed: '已完成',
      archived: '已归档',
    }
    return statusMap[status] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">项目列表</h1>
          <p className="text-gray-600 mt-1">管理你的所有项目</p>
        </div>
        <button
          onClick={() => navigate('/app/projects/new')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          新建项目
        </button>
      </div>

      <Card loading={loading} className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="搜索项目..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(v) => {
              setFilterStatus(v)
              setPage(1)
            }}
            className="w-full md:w-48"
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'active', label: '进行中' },
              { value: 'planning', label: '规划中' },
              { value: 'completed', label: '已完成' },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate(`/app/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderIcon className="w-6 h-6 text-purple-600" />
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">进度</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span>负责人</span>
                  <span className="font-medium text-gray-900">{project.owner?.name || '-'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>状态</span>
                  <span className="font-medium text-gray-900">{getStatusText(project.status)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag, i) => (
                  <Tag key={i} color="purple" className="m-0">
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  截止 {project.deadline ? new Date(project.deadline).toLocaleDateString('zh-CN') : '-'}
                </span>
                <button
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/app/projects/${project.id}`)
                  }}
                >
                  查看详情 →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            onChange={(nextPage, nextSize) => {
              setPage(nextPage)
              if (nextSize && nextSize !== pageSize) {
                setPageSize(nextSize)
                setPage(1)
              }
            }}
          />
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              没有找到项目
            </h3>
            <p className="text-gray-600 mb-6">
              尝试调整搜索条件或创建新项目
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ProjectList
