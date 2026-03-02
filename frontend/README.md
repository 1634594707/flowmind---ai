# FlowMind Frontend

FlowMind 前端应用，基于 React + TypeScript + Vite + Ant Design + TailwindCSS 构建。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5
- **样式**: TailwindCSS
- **图标**: Heroicons
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP 客户端**: Axios

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
│   ├── common/      # 通用组件
│   ├── layout/      # 布局组件
│   └── business/    # 业务组件
├── pages/           # 页面
│   ├── auth/        # 认证页面
│   ├── dashboard/   # 仪表盘
│   ├── projects/    # 项目管理
│   └── ...
├── router/          # 路由配置
├── services/        # API 服务
├── stores/          # 状态管理
├── hooks/           # 自定义 Hooks
├── types/           # 类型定义
├── utils/           # 工具函数
├── constants/       # 常量
├── App.tsx          # 根组件
└── main.tsx         # 入口文件
```

## 设计系统

本项目遵循 FlowMind 设计系统规范，详见：

- [前端设计规范](../docs/FRONTEND_DESIGN.md)
- [组件库文档](../docs/COMPONENT_LIBRARY.md)
- [设计快速参考](../docs/DESIGN_QUICK_REFERENCE.md)

## 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=FlowMind
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT
