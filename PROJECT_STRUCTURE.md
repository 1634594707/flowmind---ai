# FlowMind 项目文件结构

```
FlowMind/
├── .github/                          # GitHub 配置
│   └── workflows/
│       ├── ci.yml                    # CI/CD 流水线
│       └── deploy.yml                # 部署配置
│
├── frontend/                         # 前端项目
│   ├── public/                       # 静态资源
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                   # 资源文件
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │       └── global.css
│   │   ├── components/               # 通用组件
│   │   │   ├── common/               # 基础组件
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   └── Loading/
│   │   │   ├── layout/               # 布局组件
│   │   │   │   ├── Header/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Footer/
│   │   │   │   └── MainLayout/
│   │   │   └── business/             # 业务组件
│   │   │       ├── ProjectCard/
│   │   │       ├── AIChat/
│   │   │       └── DocumentEditor/
│   │   ├── pages/                    # 页面
│   │   │   ├── auth/                 # 认证相关
│   │   │   │   ├── Login/
│   │   │   │   ├── Register/
│   │   │   │   └── ForgotPassword/
│   │   │   ├── dashboard/            # 仪表盘
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── projects/             # 项目管理
│   │   │   │   ├── ProjectList/
│   │   │   │   ├── ProjectDetail/
│   │   │   │   ├── ProjectCreate/
│   │   │   │   └── ProjectSettings/
│   │   │   ├── documents/            # 文档管理
│   │   │   │   ├── DocumentList/
│   │   │   │   ├── DocumentEditor/
│   │   │   │   └── DocumentHistory/
│   │   │   ├── ai/                   # AI 助手
│   │   │   │   ├── RequirementAnalysis/
│   │   │   │   └── DesignAssistant/
│   │   │   └── settings/             # 设置
│   │   │       ├── Profile/
│   │   │       └── Organization/
│   │   ├── services/                 # API 服务
│   │   │   ├── api/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── documents.ts
│   │   │   │   └── ai.ts
│   │   │   └── http.ts               # HTTP 客户端
│   │   ├── stores/                   # 状态管理
│   │   │   ├── authStore.ts
│   │   │   ├── projectStore.ts
│   │   │   └── uiStore.ts
│   │   ├── hooks/                    # 自定义 Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   └── useAI.ts
│   │   ├── types/                    # 类型定义
│   │   │   ├── auth.ts
│   │   │   ├── project.ts
│   │   │   ├── document.ts
│   │   │   └── common.ts
│   │   ├── utils/                    # 工具函数
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── storage.ts
│   │   ├── constants/                # 常量
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   ├── router/                   # 路由配置
│   │   │   └── index.tsx
│   │   ├── App.tsx                   # 根组件
│   │   ├── main.tsx                  # 入口文件
│   │   └── vite-env.d.ts
│   ├── .env.example                  # 环境变量示例
│   ├── .eslintrc.cjs                 # ESLint 配置
│   ├── .prettierrc                   # Prettier 配置
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── backend/                          # 后端项目
│   ├── src/
│   │   ├── modules/                  # 功能模块
│   │   │   ├── auth/                 # 认证模块
│   │   │   │   ├── dto/
│   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   └── register.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── guards/
│   │   │   │   │   └── jwt-auth.guard.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── users/                # 用户模块
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── projects/             # 项目模块
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-project.dto.ts
│   │   │   │   │   └── update-project.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── project.entity.ts
│   │   │   │   │   ├── project-member.entity.ts
│   │   │   │   │   └── phase.entity.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   └── projects.module.ts
│   │   │   ├── documents/            # 文档模块
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── document.entity.ts
│   │   │   │   │   └── document-version.entity.ts
│   │   │   │   ├── documents.controller.ts
│   │   │   │   ├── documents.service.ts
│   │   │   │   └── documents.module.ts
│   │   │   ├── ai/                   # AI 模块
│   │   │   │   ├── dto/
│   │   │   │   ├── agents/
│   │   │   │   │   ├── requirement.agent.ts
│   │   │   │   │   └── design.agent.ts
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   └── ai.module.ts
│   │   │   └── organizations/        # 组织模块
│   │   │       ├── dto/
│   │   │       ├── entities/
│   │   │       ├── organizations.controller.ts
│   │   │       ├── organizations.service.ts
│   │   │       └── organizations.module.ts
│   │   ├── common/                   # 公共模块
│   │   │   ├── decorators/           # 装饰器
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── filters/              # 异常过滤器
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── guards/               # 守卫
│   │   │   │   └── roles.guard.ts
│   │   │   ├── interceptors/         # 拦截器
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/                # 管道
│   │   │   │   └── validation.pipe.ts
│   │   │   └── interfaces/           # 接口
│   │   │       └── response.interface.ts
│   │   ├── config/                   # 配置
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── openai.config.ts
│   │   ├── database/                 # 数据库
│   │   │   ├── migrations/           # 迁移文件
│   │   │   └── seeds/                # 种子数据
│   │   ├── app.module.ts             # 根模块
│   │   └── main.ts                   # 入口文件
│   ├── test/                         # 测试
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── docker/                           # Docker 配置
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf
│
├── docs/                             # 文档
│   ├── api/                          # API 文档
│   ├── guides/                       # 使用指南
│   └── architecture/                 # 架构文档
│
├── scripts/                          # 脚本
│   ├── init-project.js               # 项目初始化
│   ├── generate-module.js            # 模块生成
│   └── db-backup.sh                  # 数据库备份
│
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json                      # 根 package.json
├── README.md
├── ARCHITECTURE.md
├── PROJECT_PLAN.md
└── IMPLEMENTATION_ROADMAP.md
```

## 说明

### 前端结构
- **components/**: 按功能分为 common（通用）、layout（布局）、business（业务）
- **pages/**: 按功能模块组织页面
- **services/**: API 调用封装
- **stores/**: Zustand 状态管理
- **hooks/**: 自定义 React Hooks
- **types/**: TypeScript 类型定义

### 后端结构
- **modules/**: 按业务模块组织（auth、users、projects 等）
- **common/**: 公共功能（装饰器、过滤器、守卫等）
- **config/**: 配置文件
- **database/**: 数据库迁移和种子数据

### 命名规范
- 文件名：kebab-case（如 `user-profile.tsx`）
- 组件名：PascalCase（如 `UserProfile`）
- 函数/变量：camelCase（如 `getUserProfile`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
