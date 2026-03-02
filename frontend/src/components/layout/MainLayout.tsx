import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

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
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索项目、文档..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium">张</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">张三</div>
                <div className="text-xs text-gray-500">管理员</div>
              </div>
            </div>
          </div>
        </Header>
        
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
