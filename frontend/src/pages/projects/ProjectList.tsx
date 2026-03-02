import { useState } from 'react'
import { Card, Input, Select, Tag } from 'antd'
import { 
  FolderIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

const ProjectList = () => {
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const projects = [
    {
      id: '1',
      name: 'FlowMind 平台',
      description: 'AI 驱动的 SDLC 管理平台',
      status: 'active',
      statusText: '进行中',
      progress: 75,
      members: 5,
      tasks: { total: 48, completed: 36 },
      deadline: '2026-04-15',
      tags: ['AI', 'SaaS', '企业级'],
    },
    {
      id: '2',
      name: '电商系统重构',
      description: '微服务架构升级',
      status: 'active',
      statusText: '进行中',
      progress: 45,
      members: 8,
      tasks: { total: 64, completed: 29 },
      deadline: '2026-05-20',
      tags: ['微服务', '重构'],
    },
    {
      id: '3',
      name: '移动端 App',
      description: 'React Native 跨平台应用',
      status: 'planning',
      statusText: '规划中',
      progress: 15,
      members: 3,
      tasks: { total: 32, completed: 5 },
      deadline: '2026-06-30',
      tags: ['移动端', 'React Native'],
    },
    {
      id: '4',
      name: '数据分析平台',
      description: '实时数据可视化系统',
      status: 'completed',
      statusText: '已完成',
      progress: 100,
      members: 6,
      tasks: { total: 56, completed: 56 },
      deadline: '2026-02-28',
      tags: ['数据', '可视化'],
    },
  ]

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(searchText.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchText.toLowerCase())
    const matchStatus = filterStatus === 'all' || project.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">项目列表</h1>
          <p className="text-gray-600 mt-1">管理你的所有项目</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
          <PlusIcon className="w-5 h-5" />
          新建项目
        </button>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
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
            onChange={setFilterStatus}
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
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
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
                  {project.statusText}
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
                  <span>任务</span>
                  <span className="font-medium text-gray-900">
                    {project.tasks.completed}/{project.tasks.total}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>成员</span>
                  <span className="font-medium text-gray-900">{project.members}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <Tag key={i} color="purple" className="m-0">
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  截止 {project.deadline}
                </span>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  查看详情 →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
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
