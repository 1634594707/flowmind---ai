# FlowMind 快速启动指南

## 📋 前置要求

确保你的系统已安装：

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** >= 24.0.0
- **Docker Compose** >= 2.20.0

检查版本：
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🚀 快速启动（3 步）

### 1️⃣ 安装根依赖

```bash
npm install
```

### 2️⃣ 启动数据库

```bash
npm run docker:up
```

这将启动 PostgreSQL 和 Redis 容器。

### 3️⃣ 初始化前后端项目

接下来我们将分别初始化前端和后端项目。

---

## 📦 前端项目初始化

### 创建 Vite + React 项目

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

选择：
- Framework: **React**
- Variant: **TypeScript**

### 安装依赖

```bash
npm install
npm install antd zustand @tanstack/react-query axios react-router-dom
npm install -D tailwindcss postcss autoprefixer @types/node
```

### 配置 TailwindCSS

```bash
npx tailwindcss init -p
```

### 启动开发服务器

```bash
npm run dev
```

前端将运行在 http://localhost:5173

---

## 🔧 后端项目初始化

### 创建 NestJS 项目

```bash
cd backend
npx @nestjs/cli new . --skip-git
```

选择包管理器：**npm**

### 安装依赖

```bash
npm install @nestjs/typeorm @nestjs/jwt @nestjs/passport @nestjs/config
npm install typeorm pg redis passport passport-jwt bcrypt class-validator class-transformer
npm install openai
npm install -D @types/passport-jwt @types/bcrypt
```

### 启动开发服务器

```bash
npm run start:dev
```

后端将运行在 http://localhost:3000

---

## 🔄 同时启动前后端

在项目根目录：

```bash
npm run dev
```

这将同时启动前端和后端开发服务器。

---

## 🗄️ 数据库管理

### 查看数据库日志

```bash
npm run docker:logs
```

### 连接到 PostgreSQL

```bash
docker exec -it flowmind-postgres psql -U flowmind -d flowmind
```

### 连接到 Redis

```bash
docker exec -it flowmind-redis redis-cli
```

### 停止数据库

```bash
npm run docker:down
```

---

## 📝 环境变量配置

### 后端环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，填入必要配置：

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=flowmind
DATABASE_PASSWORD=flowmind123
DATABASE_NAME=flowmind

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

### 前端环境变量

```bash
cd frontend
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=FlowMind
```

---

## ✅ 验证安装

### 检查后端健康状态

```bash
curl http://localhost:3000/health
```

应该返回：`{"status":"ok"}`

### 检查前端

打开浏览器访问：http://localhost:5173

---

## 🐛 常见问题

### 端口被占用

如果端口 3000 或 5173 被占用，可以修改：

**后端**：修改 `backend/.env` 中的 `PORT`
**前端**：修改 `frontend/vite.config.ts` 中的 `server.port`

### Docker 容器启动失败

```bash
# 清理所有容器和卷
docker-compose down -v

# 重新启动
docker-compose up -d
```

### 数据库连接失败

确保 Docker 容器正在运行：

```bash
docker ps
```

应该看到 `flowmind-postgres` 和 `flowmind-redis` 容器。

---

## 📚 下一步

1. 查看 [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) 了解开发计划
2. 查看 [AI_DEVELOPMENT_GUIDE.md](AI_DEVELOPMENT_GUIDE.md) 学习如何使用 AI 辅助开发
3. 查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解项目结构

---

## 🎯 开发流程

```
1. 创建功能分支
   git checkout -b feature/your-feature

2. 开发功能
   npm run dev

3. 运行测试
   npm run test

4. 代码格式化
   npm run format

5. 提交代码
   git add .
   git commit -m "feat: your feature"

6. 推送到远程
   git push origin feature/your-feature
```

---

**祝你开发愉快！** 🚀
