# FlowMind 项目文件结构

```
FlowMind/
├── frontend/                         # 前端项目
│   ├── public/                       # 静态资源
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/               # 组件
│   │   │   └── layout/
│   │   │       └── MainLayout.tsx
│   │   ├── pages/                    # 页面（以 .tsx 文件为主）
│   │   │   ├── ai/
│   │   │   │   └── RequirementAnalysis.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── documents/
│   │   │   │   └── Documents.tsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   ├── ProjectDetail.tsx
│   │   │   │   └── ProjectEdit.tsx
│   │   │   └── settings/
│   │   │       └── Settings.tsx
│   │   ├── router/
│   │   │   └── index.tsx
│   │   ├── services/                 # API 封装
│   │   │   ├── api.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── document.service.ts
│   │   │   ├── project.service.ts
│   │   │   └── task.service.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
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
│   │   │   │   │   ├── query-projects.dto.ts
│   │   │   │   │   └── update-project.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── project.entity.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   └── projects.module.ts
│   │   │   ├── documents/            # 文档模块
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── document.entity.ts
│   │   │   │   ├── documents.controller.ts
│   │   │   │   ├── documents.service.ts
│   │   │   │   └── documents.module.ts
│   │   │   ├── ai/                   # AI 模块
│   │   │   │   ├── dto/
│   │   │   │   ├── entities/
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── llm.service.ts
│   │   │   │   └── ai.module.ts
│   │   │   ├── common/                   # 公共模块
│   │   │   │   ├── decorators/           # 装饰器
│   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   └── roles.decorator.ts
│   │   │   │   ├── filters/              # 异常过滤器
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   ├── guards/               # 守卫
│   │   │   │   │   └── roles.guard.ts
│   │   │   │   ├── interceptors/         # 拦截器
│   │   │   │   │   ├── logging.interceptor.ts
│   │   │   │   │   └── transform.interceptor.ts
│   │   │   │   ├── pipes/                # 管道
│   │   │   │   │   └── validation.pipe.ts
│   │   │   │   └── interfaces/           # 接口
│   │   │   │       └── response.interface.ts
│   │   │   ├── config/                   # 配置
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── redis.config.ts
│   │   │   │   ├── jwt.config.ts
│   │   │   │   └── openai.config.ts
│   │   │   ├── database/                 # 数据库
│   │   │   │   ├── migrations/           # 迁移文件
│   │   │   │   └── seeds/                # 种子数据
│   │   │   ├── app.module.ts             # 根模块
│   │   │   └── main.ts                   # 入口文件
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
├── docs/                             # 文档（当前目录为空，后续可补充）
│
├── scripts/                          # 脚本
│   ├── init-project.js               # 项目初始化
│
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json                      # 根 package.json
├── README.md
├── PROJECT_PLAN.md
└── PROJECT_STRUCTURE.md
```

## 说明

### 前端结构
- **components/**: 目前以 `layout` 为主（主布局与侧边栏）
- **pages/**: 按模块分组，以 `.tsx` 文件为主
- **services/**: API 调用封装

### 后端结构
- **modules/**: 按业务模块组织（auth、users、projects、documents、ai 等）
- **ai 模块关键文件**:
  - `backend/src/modules/ai/llm.service.ts`: DeepSeek 调用封装
  - `backend/src/modules/ai/ai.service.ts`: 会话/消息/PRD 生成与缓存
  - `backend/src/modules/ai/ai.controller.ts`: 会话列表与 chat 接口
- **documents 模块**:
  - `backend/src/modules/documents/documents.service.ts`: 按用户/项目过滤

### 命名规范
- 文件名：kebab-case（如 `user-profile.tsx`）
- 组件名：PascalCase（如 `UserProfile`）
- 函数/变量：camelCase（如 `getUserProfile`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
