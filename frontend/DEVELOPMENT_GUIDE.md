# FlowMind 前端开发指南

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 3. 构建生产版本

```bash
npm run build
```

## 已完成的功能

### ✅ 页面

1. **首页 (Landing Page)** - `/`
   - Hero 区域
   - 功能展示
   - CTA 区域
   - 页脚

2. **登录页** - `/login`
   - 邮箱密码登录
   - OAuth 登录 (GitHub, Google)
   - 记住我功能
   - 忘记密码链接

3. **注册页** - `/register`
   - 用户注册表单
   - 密码确认
   - 玻璃态卡片设计

4. **仪表盘** - `/app/dashboard`
   - 统计卡片 (总项目、进行中、已完成、延期)
   - 项目进度图表
   - 最近活动时间线
   - 项目列表表格

5. **项目列表** - `/app/projects`
   - 项目卡片网格
   - 搜索和筛选
   - 项目状态标签
   - 进度条显示

### ✅ 组件

1. **布局组件**
   - MainLayout: 主布局 (侧边栏 + 顶部导航)
   - 浮动导航栏 (Landing Page)

2. **通用组件**
   - 按钮 (主要、次要、文本)
   - 卡片 (标准、玻璃态)
   - 输入框
   - 表格
   - 标签

### ✅ 设计系统

- 色彩系统 (紫色主题 + 橙色强调)
- 字体系统 (Poppins + Open Sans)
- 间距系统
- 阴影系统
- Glassmorphism 效果
- 响应式设计

## 技术栈

- **React 18**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Ant Design 5**: UI 组件库
- **TailwindCSS**: 样式框架
- **Heroicons**: 图标库
- **React Router v6**: 路由管理
- **Zustand**: 状态管理 (待集成)
- **Axios**: HTTP 客户端 (待集成)

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   │   └── layout/      # 布局组件
│   │       └── MainLayout.tsx
│   ├── pages/           # 页面
│   │   ├── landing/     # 首页
│   │   ├── auth/        # 认证页面
│   │   ├── dashboard/   # 仪表盘
│   │   └── projects/    # 项目管理
│   ├── router/          # 路由配置
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 待开发功能

### 🚧 后续开发

1. **API 集成**
   - 创建 HTTP 客户端
   - 实现认证 API
   - 实现项目管理 API
   - 实现文档管理 API

2. **状态管理**
   - 配置 Zustand
   - 创建 authStore
   - 创建 projectStore
   - 创建 uiStore

3. **更多页面**
   - 项目详情页
   - 需求分析页
   - 设计助手页
   - 任务管理页
   - 文档中心页
   - 设置页

4. **更多组件**
   - AI 聊天组件
   - 文档编辑器
   - 甘特图
   - 燃尽图
   - 文件上传
   - 富文本编辑器

5. **功能增强**
   - 暗色模式
   - 国际化 (i18n)
   - 权限管理
   - 实时通知
   - WebSocket 集成

## 开发规范

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React Hooks 最佳实践
- 使用 TypeScript 严格模式

### 组件规范

```tsx
// 组件模板
import { FC } from 'react'

interface ComponentProps {
  title: string
  // ...
}

const Component: FC<ComponentProps> = ({ title }) => {
  return (
    <div className="...">
      {title}
    </div>
  )
}

export default Component
```

### 样式规范

- 优先使用 TailwindCSS 工具类
- 复杂样式使用 CSS Modules
- 遵循设计系统规范
- 确保响应式设计

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 设计系统参考

- [前端设计规范](../docs/FRONTEND_DESIGN.md)
- [页面设计方案](../docs/PAGE_DESIGNS.md)
- [组件库文档](../docs/COMPONENT_LIBRARY.md)
- [设计快速参考](../docs/DESIGN_QUICK_REFERENCE.md)
- [设计系统主文件](../design-system/flowmind/MASTER.md)

## 常见问题

### 1. 如何添加新页面？

1. 在 `src/pages/` 创建页面组件
2. 在 `src/router/index.tsx` 添加路由
3. 在侧边栏菜单添加导航项

### 2. 如何使用设计系统？

参考 [设计快速参考](../docs/DESIGN_QUICK_REFERENCE.md)，复制粘贴常用组件代码。

### 3. 如何调试？

- 使用 React DevTools
- 使用 Chrome DevTools
- 查看控制台日志
- 使用 Vite 的 HMR 功能

## 性能优化

- 使用 React.lazy 进行代码分割
- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化性能
- 图片使用懒加载
- 使用 Vite 的构建优化

## 部署

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
npm run build
npm run preview
```

### Docker 部署

```bash
docker build -f ../docker/Dockerfile.frontend -t flowmind-frontend .
docker run -p 8080:80 flowmind-frontend
```

## 联系方式

如有问题，请联系开发团队或提交 Issue。

---

**最后更新**: 2026-03-02
