# FlowMind AI 辅助开发指南

## 🎯 目标

使用 AI 工具（如 Cursor、GitHub Copilot、Kiro）最大化开发效率，减少重复劳动。

---

## 📦 阶段一：智能项目脚手架生成

### 1.1 前端项目初始化

**使用 AI 提示词**：
```
创建一个 React 18 + TypeScript + Vite 项目，包含：
- Ant Design 5.0 UI 组件库
- TailwindCSS 配置
- Zustand 状态管理
- React Query 数据请求
- React Router v6 路由
- ESLint + Prettier 代码规范
- 完整的 tsconfig.json 配置
- 基础的目录结构：
  - src/components (通用组件)
  - src/pages (页面)
  - src/services (API 服务)
  - src/stores (状态管理)
  - src/types (类型定义)
  - src/utils (工具函数)
```

### 1.2 后端项目初始化

**使用 AI 提示词**：
```
创建一个 NestJS 10 项目，包含：
- PostgreSQL + TypeORM 数据库配置
- Redis 缓存配置
- JWT 认证模块
- 全局异常过滤器
- 请求日志中间件
- Swagger API 文档
- 环境变量配置（.env）
- Docker Compose 配置（PostgreSQL + Redis）
- 基础的模块结构：
  - auth (认证授权)
  - users (用户管理)
  - projects (项目管理)
  - common (公共模块)
```

---

## 🏗️ 阶段二：核心功能模块开发

### 2.1 数据模型设计（AI 辅助）

**提示词模板**：
```
基于以下需求设计数据库模型：

需求：用户可以创建项目，项目包含多个阶段，每个阶段有不同的交付物

请生成：
1. TypeORM Entity 定义
2. 数据库迁移文件
3. 表关系说明（一对多、多对多）
4. 索引建议
5. 示例查询代码
```

### 2.2 API 接口开发（AI 辅助）

**提示词模板**：
```
为项目管理模块创建 RESTful API：

功能需求：
- 创建项目（POST /api/projects）
- 获取项目列表（GET /api/projects）
- 获取项目详情（GET /api/projects/:id）
- 更新项目（PATCH /api/projects/:id）
- 删除项目（DELETE /api/projects/:id）

请生成：
1. NestJS Controller
2. Service 业务逻辑
3. DTO 数据验证
4. Swagger 文档注解
5. 单元测试用例
```

### 2.3 前端页面开发（AI 辅助）

**提示词模板**：
```
创建项目列表页面：

UI 要求：
- 使用 Ant Design Table 组件
- 支持搜索、筛选、分页
- 操作列：编辑、删除、查看详情
- 响应式布局

技术栈：
- React 18 + TypeScript
- React Query 数据请求
- Zustand 状态管理

请生成：
1. 页面组件代码
2. API 请求 hooks
3. 类型定义
4. 样式文件（TailwindCSS）
```

---

## 🤖 阶段三：AI 功能集成

### 3.1 OpenAI API 集成

**提示词**：
```
创建一个 AI 服务模块，用于需求分析：

功能：
- 封装 OpenAI API 调用
- 支持流式响应
- 错误重试机制
- Token 使用统计
- 对话历史管理

技术栈：
- NestJS
- openai npm 包
- Redis 缓存对话历史

请生成完整的服务代码和使用示例
```

### 3.2 需求分析 Agent

**提示词**：
```
创建一个需求分析 AI Agent：

功能流程：
1. 接收用户输入的项目描述
2. 通过多轮对话澄清需求细节
3. 生成结构化的 PRD 文档

Prompt 设计：
- System Prompt：定义 Agent 角色和任务
- Few-shot Examples：提供示例对话
- 输出格式：Markdown 格式的 PRD

请生成：
1. Prompt 模板
2. 对话管理逻辑
3. PRD 生成函数
```

---

## 🔧 阶段四：开发效率工具

### 4.1 代码生成脚本

创建 CLI 工具快速生成模板代码：

```bash
# 生成 CRUD 模块
npm run generate:module -- --name=requirement

# 生成 React 页面
npm run generate:page -- --name=ProjectList

# 生成 API 接口
npm run generate:api -- --resource=project
```

**AI 提示词**：
```
创建一个 Node.js CLI 工具，用于生成 NestJS CRUD 模块：

功能：
- 根据模块名生成 Controller、Service、Entity、DTO
- 自动注册到 AppModule
- 生成基础的单元测试

使用 Commander.js 和 Inquirer.js
```

### 4.2 自动化测试生成

**提示词**：
```
为以下 API 接口生成完整的单元测试：

[粘贴你的 Controller 代码]

要求：
- 使用 Jest + Supertest
- 覆盖所有 HTTP 方法
- Mock 数据库和外部服务
- 测试成功和失败场景
```

---

## 📊 阶段五：AI 辅助代码审查

### 5.1 代码质量检查

**提示词模板**：
```
审查以下代码，检查：
1. 安全漏洞（SQL 注入、XSS）
2. 性能问题（N+1 查询、内存泄漏）
3. 代码规范（命名、注释）
4. 最佳实践（错误处理、类型安全）

[粘贴代码]

请给出具体的改进建议和修改后的代码
```

### 5.2 重构建议

**提示词**：
```
这段代码功能正常但可读性差，请重构：

[粘贴代码]

要求：
- 提取重复逻辑
- 使用设计模式
- 添加类型注解
- 改进命名
```

---

## 🎨 阶段六：UI/UX 开发

### 6.1 组件库开发

**提示词**：
```
创建一个通用的卡片组件：

功能：
- 支持标题、内容、操作按钮
- 支持加载状态
- 支持空状态
- 响应式布局

技术栈：
- React + TypeScript
- TailwindCSS
- Storybook 文档

请生成组件代码和 Storybook 故事
```

### 6.2 页面布局

**提示词**：
```
创建一个管理后台布局：

布局结构：
- 顶部导航栏（Logo、用户菜单）
- 左侧菜单栏（可折叠）
- 主内容区域
- 面包屑导航

使用 Ant Design Layout 组件
```

---

## 🚀 阶段七：部署与运维

### 7.1 Docker 配置

**提示词**：
```
创建完整的 Docker 部署方案：

服务：
- 前端（Nginx）
- 后端（Node.js）
- PostgreSQL
- Redis

要求：
- 多阶段构建优化镜像大小
- 健康检查配置
- 环境变量管理
- Docker Compose 编排

请生成所有 Dockerfile 和 docker-compose.yml
```

### 7.2 CI/CD 配置

**提示词**：
```
创建 GitHub Actions 工作流：

流程：
1. 代码检查（ESLint、TypeScript）
2. 单元测试
3. 构建 Docker 镜像
4. 推送到容器仓库
5. 部署到测试环境

请生成 .github/workflows/ci.yml
```

---

## 💡 AI 使用最佳实践

### ✅ DO（推荐做法）

1. **明确的上下文**：提供完整的技术栈和需求描述
2. **分步骤提问**：复杂功能拆分成多个小任务
3. **提供示例**：给出期望的输入输出示例
4. **迭代优化**：先生成基础版本，再逐步优化
5. **代码审查**：AI 生成的代码需要人工审查

### ❌ DON'T（避免做法）

1. **过于宽泛**：不要问"帮我做一个项目管理系统"
2. **盲目信任**：不要直接使用未测试的代码
3. **忽略安全**：AI 可能生成有安全漏洞的代码
4. **过度依赖**：核心业务逻辑需要人工设计

---

## 🔄 迭代开发流程

```
1. 需求分析（AI 辅助）
   ↓
2. 数据模型设计（AI 生成初稿）
   ↓
3. API 接口开发（AI 生成模板）
   ↓
4. 前端页面开发（AI 生成组件）
   ↓
5. 集成测试（AI 生成测试用例）
   ↓
6. 代码审查（AI 辅助检查）
   ↓
7. 部署上线（AI 生成配置）
```

---

## 📚 推荐工具

- **Cursor**：AI 代码编辑器，支持上下文感知
- **GitHub Copilot**：代码补全和生成
- **ChatGPT/Claude**：架构设计和问题解决
- **v0.dev**：快速生成 React 组件
- **Vercel AI SDK**：AI 功能集成

---

## 🎯 下一步行动

1. 使用 AI 生成项目脚手架
2. 创建核心数据模型
3. 实现第一个完整的 CRUD 功能
4. 集成 OpenAI API
5. 开发简单的 AI 需求助手

**记住**：AI 是助手，不是替代品。关键决策和架构设计仍需人工把控。
