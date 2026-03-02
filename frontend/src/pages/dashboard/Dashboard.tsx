import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Progress, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { projectService, type Project } from '../../services/project.service'
import { dashboardService, type DashboardStats } from '../../services/dashboard.service'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, projectsData] = await Promise.all([
        dashboardService.getStats(),
        projectService.getAll(),
      ])
      setStats(statsData)
      setProjects(projectsData.filter(p => p.status === 'active').slice(0, 5))
    } catch (error) {
      message.error('加载数据失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = stats ? [
    {
      title: '总项目',
      value: stats.totalProjects.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: FolderIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: '进行中',
      value: stats.activeProjects.toString(),
      change: '+3',
      trend: 'up' as const,
      icon: PlayIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
    {
      title: '已完成',
      value: stats.completedProjects.toString(),
      change: '+5',
      trend: 'up' as const,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      title: '延期项目',
      value: stats.overdueProjects.toString(),
      change: stats.overdueProjects > 0 ? `+${stats.overdueProjects}` : '0',
      trend: stats.overdueProjects > 0 ? 'up' as const : 'down' as const,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
    },
  ] : []

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      planning: '计划中',
      active: '进行中',
      completed: '已完成',
      archived: '已归档',
    }
    return statusMap[status] || status
  }

  const columns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center cursor-pointer group" onClick={() => navigate(`/app/projects/${record.id}`)}>
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <FolderIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">{text}</div>
            <div className="text-sm text-gray-500 mt-0.5">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
          status === 'planning' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          status === 'completed' ? 'bg-gray-50 text-gray-700 border border-gray-200' :
          'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {getStatusText(status)}
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
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-semibold shadow-sm">
            {owner?.name?.[0] || '?'}
          </div>
          <span className="text-sm text-gray-700">{owner?.name || '未分配'}</span>
        </div>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => (
        <span className="text-sm text-gray-500">
          {deadline ? new Date(deadline).toLocaleDateString('zh-CN') : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/app/projects/${record.id}`)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            查看
          </button>
          <button 
            onClick={() => navigate(`/app/projects/${record.id}/edit`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
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
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-600 mt-2 text-base">欢迎回来，这是你的项目概览</p>
        </div>
        <button 
          onClick={() => navigate('/app/projects/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => (
          <Card 
            key={index}
            loading={loading}
            className={`rounded-2xl border ${stat.borderColor} shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card 
        title="我的项目" 
        className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="dashboard-table"
        />
      </Card>
    </div>
  )
}

export default Dashboard
