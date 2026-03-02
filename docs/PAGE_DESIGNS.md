# FlowMind 页面设计方案

**版本**: v1.0  
**日期**: 2026-03-02  
**基于**: ui-ux-pro-max 设计系统

---

## 1. 页面架构总览

FlowMind 平台包含以下核心页面：

### 1.1 公开页面
- **首页 (Landing Page)**: 产品介绍、功能展示、定价
- **登录页 (Login)**: 用户登录、OAuth 登录
- **注册页 (Register)**: 用户注册、邮箱验证

### 1.2 应用页面
- **仪表盘 (Dashboard)**: 项目概览、数据统计
- **项目列表 (Projects)**: 所有项目管理
- **项目详情 (Project Detail)**: 单个项目管理
- **需求分析 (Requirements)**: AI 需求澄清、PRD 生成
- **设计助手 (Design)**: 架构设计、API 设计
- **任务管理 (Tasks)**: 开发任务、进度跟踪
- **文档中心 (Documents)**: 文档管理、版本控制
- **设置 (Settings)**: 用户设置、团队管理

---

## 2. 首页设计 (Landing Page)

### 2.1 设计目标
- 快速传达产品价值（3 秒内）
- 引导用户注册试用
- 建立专业可信形象

### 2.2 页面结构

```
┌─────────────────────────────────────┐
│  浮动导航栏 (Floating Nav)           │
├─────────────────────────────────────┤
│  Hero 区域                           │
│  - 主标题 + 副标题                   │
│  - CTA 按钮（免费试用 + 观看演示）    │
│  - 社会证明（用户数、评分）           │
│  - Hero 图片/动画                    │
├─────────────────────────────────────┤
│  社会证明区                          │
│  - 合作伙伴 Logo                     │
│  - 用户评价                          │
├─────────────────────────────────────┤
│  核心功能展示（3x2 网格）             │
│  - AI 需求分析                       │
│  - 智能项目向导                      │
│  - 设计助手                          │
│  - 开发协作                          │
│  - 测试管理                          │
│  - DevOps 集成                       │
├─────────────────────────────────────┤
│  工作流程展示                        │
│  - 步骤 1: 创建项目                  │
│  - 步骤 2: AI 需求分析               │
│  - 步骤 3: 自动生成文档              │
│  - 步骤 4: 团队协作开发              │
├─────────────────────────────────────┤
│  定价方案（3 列）                    │
│  - 免费版                            │
│  - 专业版（推荐）                    │
│  - 企业版                            │
├─────────────────────────────────────┤
│  FAQ 常见问题                        │
├─────────────────────────────────────┤
│  最终 CTA                            │
│  - 大标题 + 按钮                     │
├─────────────────────────────────────┤
│  页脚                                │
└─────────────────────────────────────┘
```

### 2.3 关键组件

#### Hero 区域

```tsx
<section className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-purple-50 via-white to-orange-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center max-w-4xl mx-auto">
      {/* AI 标签 */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        AI 驱动的项目管理
      </div>
      
      {/* 主标题 */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
        像 GPS 导航一样
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
          做软件项目
        </span>
      </h1>
      
      {/* 副标题 */}
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
        FlowMind 通过 AI 智能助手，帮助团队提升 <strong className="text-purple-600">50%</strong> 开发效率，
        减少 <strong className="text-orange-500">30%</strong> 项目延期率
      </p>
      
      {/* CTA 按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
          免费开始 →
        </button>
        <button className="bg-transparent hover:bg-purple-50 text-purple-600 font-semibold px-8 py-4 rounded-lg text-lg border-2 border-purple-600 transition-all duration-200 cursor-pointer">
          观看演示
        </button>
      </div>
      
      {/* 社会证明 */}
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-purple-600">500+</span>
          <span>团队使用</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-purple-600">4.9/5</span>
          <span>用户评分</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-purple-600">10K+</span>
          <span>项目完成</span>
        </div>
      </div>
    </div>
    
    {/* Hero 图片 */}
    <div className="mt-16 relative">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
        <img 
          src="/images/dashboard-preview.png" 
          alt="FlowMind Dashboard Preview" 
          className="w-full rounded-lg"
        />
      </div>
      {/* 装饰元素 */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
    </div>
  </div>
</section>
```

#### 功能卡片
```tsx
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        核心功能
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        从需求到部署，AI 全程辅助
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          icon: SparklesIcon,
          title: 'AI 需求分析',
          description: '通过对话式访谈，自动生成结构化 PRD 文档',
          color: 'purple'
        },
        {
          icon: RocketLaunchIcon,
          title: '智能项目向导',
          description: '快速创建项目，自动推荐最佳 SDLC 流程',
          color: 'blue'
        },
        {
          icon: CubeIcon,
          title: '设计助手',
          description: '架构设计建议、API 接口自动生成',
          color: 'orange'
        },
        // ... 更多功能
      ].map((feature, index) => (
        <div 
          key={index}
          className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
        >
          <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 3. 登录页设计 (Login Page)

### 3.1 设计目标
- 简洁快速的登录流程
- 支持多种登录方式
- 安全可信的视觉呈现

### 3.2 页面布局

```
┌──────────────────────────────────────┐
│  左侧：品牌展示区（50%）              │
│  - Logo + 标语                        │
│  - 产品特点列表                       │
│  - 背景渐变 + 装饰图形                │
│                                       │
│  右侧：登录表单区（50%）              │
│  - 欢迎标题                           │
│  - 邮箱输入框                         │
│  - 密码输入框                         │
│  - 记住我 + 忘记密码                  │
│  - 登录按钮                           │
│  - 分隔线                             │
│  - OAuth 登录（GitHub, Google）       │
│  - 注册链接                           │
└──────────────────────────────────────┘
```

### 3.3 关键组件

```tsx
<div className="min-h-screen flex">
  {/* 左侧品牌区 */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-orange-500 p-12 flex-col justify-between relative overflow-hidden">
    {/* 装饰背景 */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
    </div>
    
    {/* Logo */}
    <div className="relative z-10">
      <div className="flex items-center gap-3 text-white">
        <img src="/logo-white.svg" alt="FlowMind" className="h-10" />
        <span className="text-2xl font-bold">FlowMind</span>
      </div>
    </div>
    
    {/* 特点列表 */}
    <div className="relative z-10 space-y-6">
      <h2 className="text-4xl font-bold text-white mb-8">
        像 GPS 导航一样<br />做软件项目
      </h2>
      {[
        { icon: CheckCircleIcon, text: '提升 50% 开发效率' },
        { icon: CheckCircleIcon, text: '减少 30% 项目延期' },
        { icon: CheckCircleIcon, text: 'AI 全程辅助' },
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-3 text-white">
          <item.icon className="w-6 h-6" />
          <span className="text-lg">{item.text}</span>
        </div>
      ))}
    </div>
    
    {/* 用户评价 */}
    <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <p className="text-white mb-4">
        "FlowMind 让我们的项目管理效率提升了一倍，AI 助手太好用了！"
      </p>
      <div className="flex items-center gap-3">
        <img src="/avatars/user1.jpg" alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <div className="text-white font-medium">张三</div>
          <div className="text-white/70 text-sm">某科技公司 CTO</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* 右侧登录表单 */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
    <div className="w-full max-w-md">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          欢迎回来
        </h1>
        <p className="text-gray-600">
          登录到你的 FlowMind 账户
        </p>
      </div>
      
      {/* 登录表单 */}
      <form className="space-y-6">
        {/* 邮箱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
            placeholder="your@email.com"
          />
        </div>
        
        {/* 密码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
            placeholder="••••••••"
          />
        </div>
        
        {/* 记住我 + 忘记密码 */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
            <span className="text-sm text-gray-600">记住我</span>
          </label>
          <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            忘记密码？
          </a>
        </div>
        
        {/* 登录按钮 */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          登录
        </button>
      </form>
      
      {/* 分隔线 */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500">或使用以下方式登录</span>
        </div>
      </div>
      
      {/* OAuth 登录 */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" />
          <span className="font-medium text-gray-700">GitHub</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700">Google</span>
        </button>
      </div>
      
      {/* 注册链接 */}
      <p className="mt-8 text-center text-sm text-gray-600">
        还没有账户？
        <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium ml-1">
          立即注册
        </a>
      </p>
    </div>
  </div>
</div>
```

---

## 4. 仪表盘设计 (Dashboard)

### 4.1 设计目标
- 快速了解项目整体状态
- 数据可视化清晰直观
- 快速访问常用功能

### 4.2 页面布局

```
┌─────────────────────────────────────────────────────┐
│  顶部导航栏                                          │
│  Logo | 搜索 | 通知 | 用户头像                      │
├──────┬──────────────────────────────────────────────┤
│      │  页面标题 + 快速操作                         │
│      │  "仪表盘" | [+ 新建项目] [导出报告]          │
│ 侧   ├──────────────────────────────────────────────┤
│ 边   │  统计卡片区（4 列）                          │
│ 栏   │  [总项目] [进行中] [已完成] [延期项目]       │
│      ├──────────────────────────────────────────────┤
│ 项   │  主要内容区（2 列）                          │
│ 目   │  ┌─────────────────┬─────────────────────┐  │
│ 列   │  │ 项目进度图表    │ 最近活动            │  │
│ 表   │  │ (燃尽图)        │ (时间线)            │  │
│      │  └─────────────────┴─────────────────────┘  │
│ 团   ├──────────────────────────────────────────────┤
│ 队   │  项目列表（表格）                            │
│      │  项目名 | 状态 | 进度 | 成员 | 截止日期      │
│ 设   │                                              │
│ 置   │                                              │
└──────┴──────────────────────────────────────────────┘
```

### 4.3 关键组件

#### 统计卡片
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {[
    {
      title: '总项目',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FolderIcon,
      color: 'blue'
    },
    {
      title: '进行中',
      value: '8',
      change: '+3',
      trend: 'up',
      icon: PlayIcon,
      color: 'purple'
    },
    {
      title: '已完成',
      value: '15',
      change: '+5',
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: '延期项目',
      value: '1',
      change: '-2',
      trend: 'down',
      icon: ExclamationTriangleIcon,
      color: 'orange'
    },
  ].map((stat, index) => (
    <div 
      key={index}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
    </div>
  ))}
</div>
```

#### 项目列表表格
```tsx
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">我的项目</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            项目名称
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            状态
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            进度
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            成员
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            截止日期
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            操作
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {projects.map((project) => (
          <tr key={project.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FolderIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.description}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.statusText}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{project.progress}%</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, i) => (
                  <img 
                    key={i}
                    src={member.avatar} 
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
                {project.members.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {project.deadline}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-purple-600 hover:text-purple-900 mr-3">查看</button>
              <button className="text-gray-600 hover:text-gray-900">编辑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

## 5. 响应式适配

### 5.1 移动端适配（< 768px）

- 侧边栏折叠为汉堡菜单
- 统计卡片单列显示
- 表格转为卡片列表
- 导航栏简化

### 5.2 平板适配（768px - 1024px）

- 侧边栏可折叠
- 统计卡片 2 列显示
- 表格保持，可横向滚动

### 5.3 桌面适配（> 1024px）

- 完整布局
- 统计卡片 4 列显示
- 表格完整显示

---

## 6. 交互细节

### 6.1 加载状态

```tsx
// 骨架屏
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// 加载指示器
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
</div>
```

### 6.2 空状态

```tsx
<div className="text-center py-12">
  <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    还没有项目
  </h3>
  <p className="text-gray-600 mb-6">
    创建你的第一个项目开始使用 FlowMind
  </p>
  <button className="btn-primary">
    创建项目
  </button>
</div>
```

### 6.3 错误状态

```tsx
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="flex items-start">
    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
    <div>
      <h3 className="text-sm font-medium text-red-800 mb-1">
        加载失败
      </h3>
      <p className="text-sm text-red-700">
        无法加载项目数据，请稍后重试
      </p>
      <button className="text-sm text-red-600 hover:text-red-800 font-medium mt-2">
        重试
      </button>
    </div>
  </div>
</div>
```

---

## 7. 设计资源

### 7.1 设计文件
- Figma 设计稿：待创建
- 组件库 Storybook：待搭建

### 7.2 参考链接
- [设计系统主文件](../design-system/flowmind/MASTER.md)
- [前端设计规范](./FRONTEND_DESIGN.md)
- [页面特定设计](../design-system/flowmind/pages/)

---

**文档维护**  
v1.0 (2026-03-02): 初始版本
