# FlowMind Backend

FlowMind 后端 API 服务，基于 NestJS + TypeORM + PostgreSQL 构建。

## 技术栈

- **框架**: NestJS 10
- **数据库**: PostgreSQL 15
- **ORM**: TypeORM
- **认证**: JWT + Passport
- **验证**: class-validator
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息。

### 3. 启动数据库

使用 Docker 启动 PostgreSQL：

```bash
docker run --name flowmind-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=flowmind \
  -p 5432:5432 \
  -d postgres:15
```

### 4. 运行数据库迁移

```bash
npm run migration:run
```

### 5. 启动开发服务器

```bash
npm run start:dev
```

访问 http://localhost:3000/api/v1

## 可用脚本

```bash
# 开发
npm run start:dev      # 启动开发服务器（热重载）
npm run start:debug    # 启动调试模式

# 构建
npm run build          # 构建生产版本
npm run start:prod     # 启动生产服务器

# 测试
npm run test           # 运行单元测试
npm run test:watch     # 监听模式运行测试
npm run test:cov       # 生成测试覆盖率报告
npm run test:e2e       # 运行端到端测试

# 代码质量
npm run lint           # 代码检查
npm run format         # 代码格式化

# 数据库
npm run migration:generate  # 生成迁移文件
npm run migration:run       # 运行迁移
npm run migration:revert    # 回滚迁移
```

## 项目结构

```
src/
├── modules/              # 业务模块
│   ├── auth/            # 认证模块
│   │   ├── dto/         # 数据传输对象
│   │   ├── guards/      # 守卫
│   │   ├── strategies/  # 认证策略
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/           # 用户模块
│   ├── projects/        # 项目模块
│   ├── tasks/           # 任务模块
│   ├── documents/       # 文档模块
│   └── dashboard/       # 仪表盘模块
├── common/              # 公共模块
│   ├── decorators/      # 装饰器
│   ├── filters/         # 异常过滤器
│   ├── guards/          # 守卫
│   ├── interceptors/    # 拦截器
│   └── pipes/           # 管道
├── config/              # 配置
├── app.module.ts        # 根模块
└── main.ts              # 入口文件
```

## API 文档

详细的 API 文档请查看 [API_SPECIFICATION.md](../docs/API_SPECIFICATION.md)

### 核心接口

#### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息
- `POST /api/v1/auth/logout` - 退出登录

#### 项目
- `GET /api/v1/projects` - 获取项目列表
- `POST /api/v1/projects` - 创建项目
- `GET /api/v1/projects/:id` - 获取项目详情
- `PATCH /api/v1/projects/:id` - 更新项目
- `DELETE /api/v1/projects/:id` - 删除项目

#### 仪表盘
- `GET /api/v1/dashboard/stats` - 获取统计数据
- `GET /api/v1/dashboard/activities` - 获取最近活动

## 数据库设计

### 核心表

- `users` - 用户表
- `projects` - 项目表
- `tasks` - 任务表
- `documents` - 文档表

### 关系

- User 1:N Project (一个用户可以拥有多个项目)
- Project 1:N Task (一个项目包含多个任务)
- Project 1:N Document (一个项目包含多个文档)
- User 1:N Task (一个用户可以被分配多个任务)

## 认证机制

使用 JWT (JSON Web Token) 进行身份认证：

1. 用户登录后获得 JWT Token
2. 后续请求在 Header 中携带 Token
3. 服务器验证 Token 有效性

```
Authorization: Bearer {token}
```

## 开发规范

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 NestJS 最佳实践

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -f ../docker/Dockerfile.backend -t flowmind-backend .

# 运行容器
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=your_password \
  flowmind-backend
```

### 生产环境

1. 设置环境变量
2. 构建项目: `npm run build`
3. 运行迁移: `npm run migration:run`
4. 启动服务: `npm run start:prod`

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确。

### 2. JWT Token 无效

确保 `JWT_SECRET` 在开发和生产环境中保持一致。

### 3. 端口被占用

修改 `.env` 文件中的 `PORT` 配置。

## License

MIT
