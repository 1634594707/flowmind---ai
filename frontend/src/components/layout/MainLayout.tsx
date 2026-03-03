import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Drawer, List, Button, Dropdown, message } from 'antd'
import type { AxiosError } from 'axios'
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { authService, User } from '../../services/auth.service'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; description?: string; createdAt: string }>
  >([
    {
      id: '1',
      title: '欢迎使用 FlowMind',
      description: '你可以在这里查看项目更新与系统消息。',
      createdAt: new Date().toISOString(),
    },
  ])

  useEffect(() => {
    const refresh = () => setCurrentUser(authService.getCurrentUser())
    refresh()
    window.addEventListener('auth:userUpdated', refresh)
    return () => window.removeEventListener('auth:userUpdated', refresh)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      message.success('已退出登录')
      navigate('/login')
    } catch (error: unknown) {
      console.error('Logout error:', error)
      const err = error as AxiosError<{ message?: string }>
      message.error(err.response?.data?.message || '退出失败，请稍后重试')
    }
  }

  const menuItems = [
    {
      key: '/app/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      label: '仪表盘',
    },
    {
      key: '/app/projects',
      icon: <FolderIcon className="w-5 h-5" />,
      label: '项目',
    },
    {
      key: '/app/ai/requirement',
      icon: <SparklesIcon className="w-5 h-5" />,
      label: 'AI 需求分析',
    },
    {
      key: '/app/ai/design',
      icon: <SparklesIcon className="w-5 h-5" />,
      label: '设计助手',
    },
    {
      key: '/app/documents',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      label: '文档',
    },
    {
      key: '/app/settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      label: '设置',
    },
  ]

  return (
    <>
      <Layout className="min-h-screen">
        <Sider
          width={256}
          className="bg-white border-r border-gray-200"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg"></div>
              <span className="text-xl font-bold text-purple-900">FlowMind</span>
            </div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none"
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        
        <Layout>
          <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-6 flex-1">
              <form 
                className="relative flex-1 max-w-xl"
                onSubmit={(e) => e.preventDefault()}
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索项目、文档..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-200 text-sm"
                  onChange={(e) => {
                    // 搜索逻辑将在这里实现
                    console.log('搜索:', e.target.value)
                  }}
                />
              </form>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => setNotificationsOpen(true)}
              >
                <BellIcon className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
              </button>

              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: 'settings',
                      label: '个人设置',
                      onClick: () => navigate('/app/settings'),
                    },
                    {
                      key: 'logout',
                      label: '退出登录',
                      onClick: handleLogout,
                    },
                  ],
                }}
              >
                <div className="flex items-center gap-3 pl-3 ml-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg pr-3 py-1.5 transition-colors duration-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {(currentUser?.name || '').slice(0, 1) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{currentUser?.name || '未登录'}</div>
                    <div className="text-xs text-gray-500">{currentUser?.role || ''}</div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </Header>
          
          <Content className="p-6 bg-gray-50">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Drawer
        title="通知"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        width={420}
        extra={
          <div className="flex gap-2">
            <Button
              size="small"
              onClick={() => setNotifications([])}
              disabled={notifications.length === 0}
            >
              清空
            </Button>
            <Button size="small" type="primary" onClick={() => setNotificationsOpen(false)}>
              关闭
            </Button>
          </div>
        }
      >
        <List
          dataSource={notifications}
          locale={{ emptyText: '暂无通知' }}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              <div className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString('zh-CN')}
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  )
}

export default MainLayout
