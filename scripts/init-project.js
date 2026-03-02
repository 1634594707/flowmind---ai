#!/usr/bin/env node

/**
 * FlowMind 项目初始化脚本
 * 自动创建前后端项目结构
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  log(`执行: ${command}`, 'blue');
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`错误: ${error.message}`, 'red');
    return false;
  }
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ 创建目录: ${dirPath}`, 'green');
  }
}

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  log(`✓ 创建文件: ${filePath}`, 'green');
}

// 主函数
async function initProject() {
  log('\n🚀 FlowMind 项目初始化开始...\n', 'blue');

  // 1. 创建项目根目录结构
  log('📁 创建项目目录结构...', 'yellow');
  const directories = [
    'frontend',
    'backend',
    'docs',
    'scripts',
    'docker'
  ];

  directories.forEach(dir => createDirectory(dir));

  // 2. 初始化前端项目
  log('\n📦 初始化前端项目...', 'yellow');
  if (!fs.existsSync('frontend/package.json')) {
    execCommand('npm create vite@latest frontend -- --template react-ts', '.');
  }

  // 3. 初始化后端项目
  log('\n📦 初始化后端项目...', 'yellow');
  if (!fs.existsSync('backend/package.json')) {
    execCommand('npx @nestjs/cli new backend --skip-git', '.');
  }

  // 4. 创建 Docker 配置
  log('\n🐳 创建 Docker 配置...', 'yellow');
  createDockerFiles();

  // 5. 创建环境变量模板
  log('\n⚙️  创建环境变量模板...', 'yellow');
  createEnvFiles();

  // 6. 创建开发脚本
  log('\n📝 创建开发脚本...', 'yellow');
  createDevScripts();

  log('\n✅ 项目初始化完成！', 'green');
  log('\n下一步操作：', 'blue');
  log('1. cd frontend && npm install', 'yellow');
  log('2. cd backend && npm install', 'yellow');
  log('3. docker-compose up -d  # 启动数据库', 'yellow');
  log('4. npm run dev  # 启动开发服务器\n', 'yellow');
}

function createDockerFiles() {
  // docker-compose.yml
  const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: flowmind-postgres
    environment:
      POSTGRES_DB: flowmind
      POSTGRES_USER: flowmind
      POSTGRES_PASSWORD: flowmind123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U flowmind"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: flowmind-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
`;

  createFile('docker-compose.yml', dockerCompose);

  // Frontend Dockerfile
  const frontendDockerfile = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;

  createFile('docker/Dockerfile.frontend', frontendDockerfile);

  // Backend Dockerfile
  const backendDockerfile = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
`;

  createFile('docker/Dockerfile.backend', backendDockerfile);
}

function createEnvFiles() {
  // Backend .env.example
  const backendEnv = `# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=flowmind
DATABASE_PASSWORD=flowmind123
DATABASE_NAME=flowmind

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4

# Server
PORT=3000
NODE_ENV=development
`;

  createFile('backend/.env.example', backendEnv);

  // Frontend .env.example
  const frontendEnv = `VITE_API_URL=http://localhost:3000
VITE_APP_NAME=FlowMind
`;

  createFile('frontend/.env.example', frontendEnv);
}

function createDevScripts() {
  // package.json scripts
  const packageJson = {
    name: "flowmind",
    version: "1.0.0",
    description: "AI-driven SDLC management platform",
    scripts: {
      "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
      "dev:frontend": "cd frontend && npm run dev",
      "dev:backend": "cd backend && npm run start:dev",
      "build": "npm run build:frontend && npm run build:backend",
      "build:frontend": "cd frontend && npm run build",
      "build:backend": "cd backend && npm run build",
      "docker:up": "docker-compose up -d",
      "docker:down": "docker-compose down",
      "db:migrate": "cd backend && npm run migration:run",
      "db:seed": "cd backend && npm run seed:run"
    },
    devDependencies: {
      "concurrently": "^8.2.2"
    }
  };

  createFile('package.json', JSON.stringify(packageJson, null, 2));
}

// 运行初始化
initProject().catch(error => {
  log(`\n❌ 初始化失败: ${error.message}`, 'red');
  process.exit(1);
});
