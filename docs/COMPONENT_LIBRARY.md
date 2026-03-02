# FlowMind 组件库文档

**版本**: v1.0  
**日期**: 2026-03-02  
**技术栈**: React + TypeScript + TailwindCSS

---

## 1. 组件库概览

FlowMind 组件库基于 Ant Design 5.0，结合 TailwindCSS 自定义样式，提供一套完整的 UI 组件系统。

### 1.1 设计原则

- **一致性**: 所有组件遵循统一的设计语言
- **可复用**: 组件高度模块化，易于复用
- **可访问**: 符合 WCAG AA 标准
- **响应式**: 适配所有设备尺寸
- **可定制**: 支持主题定制

### 1.2 组件分类

```
基础组件 (Basics)
├── Button 按钮
├── Icon 图标
├── Typography 排版
└── Link 链接

表单组件 (Forms)
├── Input 输入框
├── Select 选择器
├── Checkbox 复选框
├── Radio 单选框
├── Switch 开关
├── DatePicker 日期选择
└── Upload 上传

数据展示 (Data Display)
├── Card 卡片
├── Table 表格
├── Tag 标签
├── Badge 徽标
├── Avatar 头像
├── Progress 进度条
└── Statistic 统计数值

反馈组件 (Feedback)
├── Alert 警告提示
├── Message 全局提示
├── Modal 模态框
├── Notification 通知
├── Popconfirm 气泡确认
└── Skeleton 骨架屏

导航组件 (Navigation)
├── Menu 菜单
├── Breadcrumb 面包屑
├── Pagination 分页
└── Steps 步骤条

布局组件 (Layout)
├── Layout 布局
├── Grid 栅格
├── Space 间距
└── Divider 分割线
```

---

## 2. 基础组件

### 2.1 Button 按钮

#### 主要按钮 (Primary)
```tsx
import { Button } from 'antd'

<Button 
  type="primary"
  size="large"
  className="bg-orange-500 hover:bg-orange-600 border-none shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
>
  主要按钮
</Button>
```

#### 次要按钮 (Secondary)
```tsx
<Button 
  type="default"
  size="large"
  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all duration-200"
>
  次要按钮
</Button>
```

#### 文本按钮 (Text)
```tsx
<Button 
  type="text"
  className="text-purple-600 hover:text-purple-700 transition-colors duration-200"
>
  文本按钮
</Button>
```

#### 图标按钮
```tsx
import { PlusIcon } from '@heroicons/react/24/outline'

<Button 
  type="primary"
  icon={<PlusIcon className="w-5 h-5" />}
  className="bg-orange-500 hover:bg-orange-600"
>
  新建项目
</Button>
```

#### 加载状态
```tsx
<Button 
  type="primary"
  loading
  className="bg-orange-500"
>
  加载中
</Button>
```

#### 禁用状态
```tsx
<Button 
  type="primary"
  disabled
  className="bg-gray-300 cursor-not-allowed"
>
  禁用按钮
</Button>
```

---

### 2.2 Icon 图标

使用 Heroicons 作为主要图标库：

```tsx
import {
  SparklesIcon,
  RocketLaunchIcon,
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

// 实心图标
import {
  SparklesIcon as SparklesIconSolid,
} from '@heroicons/react/24/solid'

// 使用示例
<SparklesIcon className="w-6 h-6 text-purple-600" />
<RocketLaunchIcon className="w-5 h-5 text-orange-500" />
```

#### 图标尺寸规范
```tsx
// 小图标 (16px)
<Icon className="w-4 h-4" />

// 标准图标 (20px)
<Icon className="w-5 h-5" />

// 中等图标 (24px)
<Icon className="w-6 h-6" />

// 大图标 (32px)
<Icon className="w-8 h-8" />
```

---

## 3. 表单组件

### 3.1 Input 输入框

#### 基础输入框
```tsx
import { Input } from 'antd'

<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    项目名称
  </label>
  <Input
    placeholder="输入项目名称"
    className="px-4 py-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
  />
</div>
```

#### 带图标的输入框
```tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

<Input
  prefix={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
  placeholder="搜索项目..."
  className="px-4 py-3 rounded-lg"
/>
```

#### 文本域
```tsx
import { Input } from 'antd'
const { TextArea } = Input

<TextArea
  rows={4}
  placeholder="输入项目描述"
  className="rounded-lg border-gray-300 focus:border-purple-500"
/>
```

---

### 3.2 Select 选择器

```tsx
import { Select } from 'antd'

<Select
  placeholder="选择项目类型"
  className="w-full"
  size="large"
  options={[
    { value: 'web', label: 'Web 应用' },
    { value: 'mobile', label: '移动应用' },
    { value: 'api', label: 'API 服务' },
  ]}
/>
```

---

## 4. 数据展示组件

### 4.1 Card 卡片

#### 标准卡片
```tsx
import { Card } from 'antd'

<Card
  className="rounded-xl border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
  bodyStyle={{ padding: '24px' }}
>
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    卡片标题
  </h3>
  <p className="text-gray-600">
    卡片内容描述
  </p>
</Card>
```

#### Glassmorphism 卡片
```tsx
<div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    玻璃态卡片
  </h3>
  <p className="text-gray-600">
    现代感十足的玻璃态效果
  </p>
</div>
```

#### 统计卡片
```tsx
<Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
      <FolderIcon className="w-6 h-6 text-purple-600" />
    </div>
    <span className="text-sm font-medium text-green-600">+12%</span>
  </div>
  <h3 className="text-gray-600 text-sm mb-1">总项目</h3>
  <p className="text-3xl font-bold text-gray-900">24</p>
</Card>
```

---

### 4.2 Table 表格

```tsx
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface ProjectType {
  id: string
  name: string
  status: string
  progress: number
  members: number
  deadline: string
}

const columns: ColumnsType<ProjectType> = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="flex items-center">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <FolderIcon className="w-5 h-5 text-purple-600" />
        </div>
        <span className="font-medium text-gray-900">{text}</span>
      </div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        status === 'active' ? 'bg-green-100 text-green-800' :
        status === 'planning' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    ),
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    render: (progress) => (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
          <div 
            className="bg-purple-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
    ),
  },
]

<Table
  columns={columns}
  dataSource={projects}
  className="rounded-xl overflow-hidden border border-gray-200"
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 个项目`,
  }}
/>
```

---

### 4.3 Tag 标签

```tsx
import { Tag } from 'antd'

// 状态标签
<Tag color="success">已完成</Tag>
<Tag color="processing">进行中</Tag>
<Tag color="warning">待处理</Tag>
<Tag color="error">已延期</Tag>

// 自定义样式标签
<span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
  AI 生成
</span>
```

---

### 4.4 Progress 进度条

```tsx
import { Progress } from 'antd'

// 线性进度条
<Progress 
  percent={75} 
  strokeColor="#7C3AED"
  trailColor="#E9D5FF"
/>

// 圆形进度条
<Progress 
  type="circle" 
  percent={75}
  strokeColor="#7C3AED"
  width={80}
/>

// 仪表盘进度
<Progress 
  type="dashboard" 
  percent={75}
  strokeColor="#7C3AED"
/>
```

---

## 5. 反馈组件

### 5.1 Modal 模态框

```tsx
import { Modal } from 'antd'
import { useState } from 'react'

const [isModalOpen, setIsModalOpen] = useState(false)

<Modal
  title="创建新项目"
  open={isModalOpen}
  onOk={() => setIsModalOpen(false)}
  onCancel={() => setIsModalOpen(false)}
  okText="创建"
  cancelText="取消"
  className="rounded-2xl"
  okButtonProps={{
    className: 'bg-orange-500 hover:bg-orange-600 border-none'
  }}
>
  <div className="py-4">
    <p className="text-gray-600 mb-4">
      请输入项目基本信息
    </p>
    {/* 表单内容 */}
  </div>
</Modal>
```

---

### 5.2 Message 全局提示

```tsx
import { message } from 'antd'

// 成功提示
message.success('项目创建成功！')

// 错误提示
message.error('操作失败，请重试')

// 警告提示
message.warning('请先保存当前更改')

// 信息提示
message.info('正在处理中...')

// 加载提示
message.loading('加载中...', 2.5)
```

---

### 5.3 Alert 警告提示

```tsx
import { Alert } from 'antd'

// 成功提示
<Alert
  message="操作成功"
  description="项目已成功创建并保存"
  type="success"
  showIcon
  closable
  className="rounded-lg mb-4"
/>

// 错误提示
<Alert
  message="操作失败"
  description="无法连接到服务器，请检查网络连接"
  type="error"
  showIcon
  closable
  className="rounded-lg mb-4"
/>

// 警告提示
<Alert
  message="注意"
  description="该操作不可撤销，请谨慎操作"
  type="warning"
  showIcon
  className="rounded-lg mb-4"
/>
```

---

### 5.4 Skeleton 骨架屏

```tsx
import { Skeleton } from 'antd'

// 基础骨架屏
<Skeleton active />

// 自定义骨架屏
<div className="space-y-4">
  <Skeleton.Input active className="w-full h-12" />
  <Skeleton.Button active className="w-32" />
  <Skeleton paragraph={{ rows: 4 }} active />
</div>

// 卡片骨架屏
<Card>
  <Skeleton active avatar paragraph={{ rows: 3 }} />
</Card>
```

---

## 6. 导航组件

### 6.1 Menu 菜单

```tsx
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const items: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: <HomeIcon className="w-5 h-5" />,
    label: '仪表盘',
  },
  {
    key: 'projects',
    icon: <FolderIcon className="w-5 h-5" />,
    label: '项目',
  },
  {
    key: 'documents',
    icon: <DocumentTextIcon className="w-5 h-5" />,
    label: '文档',
  },
  {
    key: 'settings',
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    label: '设置',
  },
]

<Menu
  mode="inline"
  defaultSelectedKeys={['dashboard']}
  items={items}
  className="border-none"
/>
```

---

### 6.2 Breadcrumb 面包屑

```tsx
import { Breadcrumb } from 'antd'
import { HomeIcon } from '@heroicons/react/24/outline'

<Breadcrumb
  items={[
    {
      title: <HomeIcon className="w-4 h-4" />,
    },
    {
      title: '项目',
    },
    {
      title: 'FlowMind',
    },
    {
      title: '需求分析',
    },
  ]}
  className="text-gray-600"
/>
```

---

## 7. 布局组件

### 7.1 Layout 布局

```tsx
import { Layout } from 'antd'
const { Header, Sider, Content } = Layout

<Layout className="min-h-screen">
  {/* 侧边栏 */}
  <Sider
    width={256}
    className="bg-white border-r border-gray-200"
  >
    <div className="p-6">
      <img src="/logo.svg" alt="FlowMind" className="h-8" />
    </div>
    <Menu />
  </Sider>
  
  <Layout>
    {/* 顶部导航 */}
    <Header className="bg-white border-b border-gray-200 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">仪表盘</h1>
        <div className="flex items-center gap-4">
          {/* 搜索、通知、用户菜单 */}
        </div>
      </div>
    </Header>
    
    {/* 主内容区 */}
    <Content className="p-6 bg-gray-50">
      {/* 页面内容 */}
    </Content>
  </Layout>
</Layout>
```

---

## 8. 自定义组件

### 8.1 EmptyState 空状态

```tsx
interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <Button 
          type="primary"
          onClick={action.onClick}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// 使用示例
<EmptyState
  icon={FolderIcon}
  title="还没有项目"
  description="创建你的第一个项目开始使用 FlowMind"
  action={{
    label: '创建项目',
    onClick: () => setIsModalOpen(true),
  }}
/>
```

---

### 8.2 StatCard 统计卡片

```tsx
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red'
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }
  
  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
  )
}
```

---

## 9. 主题配置

### 9.1 Ant Design 主题定制

```tsx
// theme.config.ts
import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#7C3AED',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    borderRadius: 8,
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
      fontSize: 16,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 44,
      fontSize: 16,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
}

export default theme
```

### 9.2 应用主题

```tsx
// App.tsx
import { ConfigProvider } from 'antd'
import theme from './theme.config'

function App() {
  return (
    <ConfigProvider theme={theme}>
      {/* 应用内容 */}
    </ConfigProvider>
  )
}
```

---

## 10. 使用指南

### 10.1 安装依赖

```bash
npm install antd @heroicons/react
```

### 10.2 导入样式

```tsx
// main.tsx
import 'antd/dist/reset.css'
import './index.css' // Tailwind CSS
```

### 10.3 按需导入

```tsx
// 推荐：按需导入组件
import { Button, Card, Table } from 'antd'

// 避免：全量导入
import * as antd from 'antd'
```

---

**文档维护**  
v1.0 (2026-03-02): 初始版本
