# FlowMind-AI 快速启动指南

## 环境要求

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- pnpm 或 yarn

## 一、安装依赖

```bash
# 根目录安装
pnpm install

# 前端依赖
cd frontend
pnpm install

# 后端依赖
cd ../backend
pnpm install
```

## 二、配置环境变量

### 后端配置 (`backend/.env`)

```env
# 数据库
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=flowmind

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key_here

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# GitHub OAuth (可选)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### 前端配置 (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

## 三、数据库初始化

```bash
cd backend

# 创建数据库
psql -U postgres -c "CREATE DATABASE flowmind;"

# 运行迁移（如果有）
pnpm run migration:run

# 运行种子数据（可选）
pnpm run seed
```

## 四、启动服务

### 方式 1：分别启动（推荐开发）

```bash
# 终端 1 - 启动后端
cd backend
pnpm run start:dev

# 终端 2 - 启动前端
cd frontend
pnpm run dev
```

### 方式 2：Docker Compose（推荐生产）

```bash
# 根目录
docker-compose up -d
```

## 五、访问应用

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000/api
- API 文档：http://localhost:3000/api-docs (如果启用了 Swagger)

## 六、核心功能使用流程

### 1. 注册/登录

访问 http://localhost:5173/register 注册账号

### 2. 创建项目

- 进入"项目列表"
- 点击"新建项目"
- 填写项目名称、描述、选择 SDLC 模板（推荐"敏捷"）

### 3. AI 需求分析

- 进入"AI 需求分析"
- 选择项目，创建会话
- 与 AI 多轮对话澄清需求
- 点击"生成 PRD"（支持流式输出）

### 4. 设计助手

- 进入"设计助手"
- 选择项目和参考文档（PRD）
- 选择能力：架构设计/API 定义/数据库设计/技术选型
- 点击"生成并保存"

### 5. 任务拆解

- 在"设计助手"页面，点击"拆解并创建任务"
- 或在"任务管理"页面手动创建任务
- 支持状态切换、编辑、删除

### 6. GitHub 集成（可选）

- 在"任务管理"页面，点击"连接 GitHub"
- 授权后选择仓库并绑定到项目
- 后续可以同步 commit 与任务关联

### 7. 文档管理

- 进入"文档"页面
- 查看所有 AI 生成的文档
- 支持编辑、冻结/解冻 PRD、设置主 PRD
- 支持导出 Word/PDF

### 8. 项目详情

- 查看项目进度、阶段、标签
- 查看项目活动流（Timeline）
- 手动推进阶段（或 PRD 冻结时自动推进）

## 七、常见问题

### Q1: TypeScript 报错"找不到模块"

**A:** 这是 VS Code 的 TS 语言服务器问题，不影响运行。解决方法：

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "TypeScript: Restart TS Server"
3. 或者关闭并重新打开文件

### Q2: AI 生成失败

**A:** 检查 `DEEPSEEK_API_KEY` 是否配置正确，确保有足够的 API 额度。

### Q3: GitHub 授权失败

**A:** 确保 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`BACKEND_URL`、`FRONTEND_URL` 配置正确。

### Q4: 数据库连接失败

**A:** 确保 PostgreSQL 服务已启动，数据库已创建，连接信息正确。

### Q5: Redis 连接失败

**A:** 确保 Redis 服务已启动，或在开发环境中暂时禁用 Redis 缓存。

## 八、开发建议

### 代码规范

- 使用 ESLint + Prettier 格式化代码
- 遵循 TypeScript 严格模式
- 组件命名使用 PascalCase，文件名与组件名一致

### Git 工作流

- 功能分支：`feature/xxx`
- 修复分支：`fix/xxx`
- 提交信息：`feat: xxx` / `fix: xxx` / `docs: xxx`

### 测试

- 单元测试：`npm run test`
- E2E 测试：`npm run test:e2e`
- 覆盖率：`npm run test:cov`

---

**祝开发顺利！** 🚀
