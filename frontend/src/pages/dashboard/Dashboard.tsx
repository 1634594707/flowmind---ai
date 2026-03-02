import { Card, Progress, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface ProjectType {
  id: string
  name: string
  description: string
  status: 'active' | 'planning' | 'completed'
  statusText: string
  progress: number
  members: { name: string; avatar: string }[]
  deadline: string
}

const Dashboard = () => {
  const stats = [
    {
      title: '总项目',
      value: '24',
      change: '+12%',
      trend: 'up' as const,
      icon: FolderIcon,
      color: 'blue',
    },
    {
      title: '进行中',
      value: '8',
      change: '+3',
      trend: 'up' as const,
      icon: PlayIcon,
      color: 'purple',
    },
    {
      title: '已完成',
      value: '15',
      change: '+5',
      trend: 'up' as const,
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      title: '延期项目',
      value: '1',
      change: '-2',
      trend: 'down' as const,
      icon: ExclamationTriangleIcon,
      color: 'orange',
    },
  ]

  const projects: ProjectType[] = [
    {
      id: '1',
      name: 'FlowMind 平台',
      description: 'AI 驱动的 SDLC 管理平台',
      status: 'active',
      statusText: '进行中',
      progress: 75,
      members: [
        { name: '张三', avatar: '' },
        { name: '李四', avatar: '' },
        { name: '王五', avatar: '' },
      ],
      deadline: '2026-04-15',
    },
    {
      id: '2',
      name: '电商系统重构',
      description: '微服务架构升级',
      status: 'active',
      statusText: '进行中',
      progress: 45,
      members: [
        { name: '赵六', avatar: '' },
        { name: '钱七', avatar: '' },
      ],
      deadline: '2026-05-20',
    },
  ]

  const columns: ColumnsType<ProjectType> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center cursor-pointer">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <FolderIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'planning' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {record.statusText}
        </span>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="flex items-center gap-2">
          <Progress 
            percent={progress} 
            strokeColor="#7C3AED"
            trailColor="#E9D5FF"
            size="small"
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[3rem]">{progress}%</span>
        </div>
      ),
    },
    {
      title: '成员',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member: any, i: number) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs text-purple-600 font-medium"
            >
              {member.name[0]}
            </div>
          ))}
          {members.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
              +{members.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => (
        <span className="text-sm text-gray-500">{deadline}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <div className="flex gap-2">
          <button className="text-purple-600 hover:text-purple-900 text-sm font-medium cursor-pointer">
            查看
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium cursor-pointer">
            编辑
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-600 mt-1">欢迎回来，这是你的项目概览</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
          <PlusIcon className="w-5 h-5" />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card 
          title="项目进度" 
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="h-64 flex items-center justify-center text-gray-400">
            燃尽图占位
          </div>
        </Card>
        
        <Card 
          title="最近活动" 
          className="rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            {[
              { user: '张三', action: '创建了项目', target: 'FlowMind 平台', time: '2 小时前' },
              { user: '李四', action: '完成了任务', target: '需求分析文档', time: '5 小时前' },
              { user: '王五', action: '更新了', target: 'API 设计文档', time: '1 天前' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs text-purple-600 font-medium flex-shrink-0">
                  {activity.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium text-purple-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card 
        title="我的项目" 
        className="rounded-xl border border-gray-200 shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
}

export default Dashboard
