# FlowMind - AI 驱动的智能软件开发生命周期管理平台

<div align="center">

![FlowMind Logo](https://via.placeholder.com/200x200?text=FlowMind)

**像 GPS 导航一样做软件项目——知道你在哪里，该往哪走，如何到达**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0--alpha-orange.svg)](https://github.com/flowmind/flowmind)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[English](README_EN.md) | 简体中文

</div>

---

## 📖 项目简介

FlowMind 是一个面向中小互联网团队的 **AI 驱动全流程 SDLC 管理平台**，通过智能流程引擎和 AI 助手，帮助团队：

- ✅ **减少 50% 的工具切换成本** - 从需求到部署，一个平台完成

---

## 核心特性

### 1. 智能项目向导
通过 AI 对话式访谈，快速创建项目并生成定制化 SDLC 流程模板。

```
AI: "你想解决什么业务问题？"
用户: "做一个电商购物车"
...
自动生成：项目结构 + 技术选型 + 风险清单
```

### 2. AI 需求分析助手
- 多轮对话澄清需求细节
- 自动生成结构化 PRD 文档
- 需求变更影响分析
- 需求与代码双向追踪

### 3. 流程引擎与导航
- 内置标准 SDLC 模板（敏捷/瀑布/混合）
- 强制检查点确保关键步骤不遗漏
- 实时进度可视化（甘特图 + 燃尽图）
- 智能识别瓶颈并推荐优化方案

### 4. AI 设计助手
- 架构设计建议（微服务/单体/Serverless）
- API 接口自动生成（RESTful/GraphQL）
- 数据库设计（ER 图 + SQL DDL）
- 技术栈智能推荐

### 5. 开发工作区
- 任务自动拆解与分配
- 代码提交关联需求
- 智能代码审查
- Git 集成增强

### 6. 质量保障中心
- 测试用例自动生成
- 自动化测试脚本生成
- 缺陷智能分析与根因定位
- 测试报告自动生成

### 7. DevOps 集成
- CI/CD 流水线配置生成
- 一键部署与环境管理
- 发布检查清单
- 智能运维监控

### 8. 知识图谱
- 项目全生命周期时间线
- 需求-设计-代码关联追踪
- 自动项目复盘报告
- 自然语言知识检索

---

## 技术架构

```
┌─────────────────────────────────────────────┐
│          用户交互层 (Presentation)           │
│   Web应用 | 移动端 | IDE插件 | 机器人        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           AI智能层 (AI Agent Layer)          │
│  流程导航引擎 | 多Agent协作 | RAG检索增强    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         核心服务层 (Core Services)           │
│  项目管理 | 文档中心 | 工作流引擎 | 知识图谱  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│            数据层 (Data Layer)               │
│  PostgreSQL | Redis | Elasticsearch | MinIO │
└─────────────────────────────────────────────┘
```

**技术栈**:
- 前端: React 18 + TypeScript + Vite + Ant Design
- 后端: NestJS + FastAPI
- 数据库: PostgreSQL 15 + Redis 7
- AI: LangChain + OpenAI API / DeepSeek
- 基础设施: Kubernetes + Docker

详细架构请查看 [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 快速开始

### 环境要求

- Node.js >= 20.0
- Python >= 3.11
- PostgreSQL >= 15
- Redis >= 7
- Docker & Docker Compose

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/flowmind/flowmind.git
cd flowmind

# 2. 安装依赖
npm install
cd backend && pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要配置

# 4. 启动数据库
docker-compose up -d postgres redis

# 5. 数据库迁移
npm run db:migrate

# 6. 启动开发服务器
npm run dev          # 前端 (http://localhost:5173)
npm run dev:backend  # 后端 (http://localhost:3000)
```

#### 可选配置：DeepSeek（LLM 推理）

后端通过 OpenAI 兼容接口调用 DeepSeek，需要在 `backend/.env` 配置：

```env
DEEPSEEK_API_KEY=你的key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

#### 可选配置：Redis 缓存

后端已接入缓存模块：

- 若未配置 `REDIS_URL`：自动使用**内存缓存**（开发环境可用）
- 若配置了 `REDIS_URL`：使用 **Redis 缓存**

示例：

```env
REDIS_URL=redis://localhost:6379
```

### Docker 部署

```bash
# 一键启动所有服务
docker-compose up -d

# 访问应用
open http://localhost:8080
```

---

## 📚 文档

- [产品需求文档 (PRD)](design.md)
- [技术架构文档](ARCHITECTURE.md)
- [项目实施计划](PROJECT_PLAN.md)
- [API 文档](docs/API.md) (开发中)
- [用户手册](docs/USER_GUIDE.md) (开发中)
- [开发者指南](docs/DEVELOPER_GUIDE.md) (开发中)

---

## 🗺️ 开发路线图

### ✅ Phase 1: MVP (2026 Q1)
- [x] 基础架构搭建
- [x] 用户认证系统
- [ ] 项目管理核心功能
- [ ] AI 需求分析助手
- [ ] PRD 文档生成

### 🚧 Phase 2: Beta (2026 Q2)
- [ ] 设计助手模块
- [ ] 开发协作功能
- [ ] GitHub/GitLab 集成
- [ ] RAG 架构实现
- [ ] 商业化准备

### 📅 Phase 3: V1.0 (2026 Q3)
- [ ] 测试管理模块
- [ ] DevOps 集成
- [ ] 知识图谱
- [ ] 企业级特性

### 🔮 Phase 4: V2.0 (2026 Q4)
- [ ] 多 Agent 协作系统
- [ ] 预测性项目管理
- [ ] 自动化代码生成
- [ ] 开放平台与插件市场

详细计划请查看 [PROJECT_PLAN.md](PROJECT_PLAN.md)

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！

### 贡献方式

- 🐛 提交 Bug 报告
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ⭐ Star 项目支持我们

### 开发流程

```bash
# 1. Fork 项目
# 2. 创建特性分支
git checkout -b feature/amazing-feature

# 3. 提交更改
git commit -m 'feat: add amazing feature'

# 4. 推送到分支
git push origin feature/amazing-feature

# 5. 提交 Pull Request
```

请遵循 [贡献指南](CONTRIBUTING.md) 和 [行为准则](CODE_OF_CONDUCT.md)

---

## 📊 项目状态

![GitHub stars](https://img.shields.io/github/stars/flowmind/flowmind?style=social)
![GitHub forks](https://img.shields.io/github/forks/flowmind/flowmind?style=social)
![GitHub issues](https://img.shields.io/github/issues/flowmind/flowmind)
![GitHub pull requests](https://img.shields.io/github/issues-pr/flowmind/flowmind)

---

## 🏆 致谢

感谢以下开源项目的启发：

- [MetaGPT](https://github.com/geekan/MetaGPT) - 多智能体协作框架
- [LangChain](https://github.com/langchain-ai/langchain) - LLM 应用开发框架
- [Temporal](https://github.com/temporalio/temporal) - 工作流引擎
- [Ant Design](https://github.com/ant-design/ant-design) - 企业级 UI 组件库

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 📞 联系我们

- 官网: https://flowmind.ai (开发中)
- 邮箱: contact@flowmind.ai
- 微信群: 扫描下方二维码加入

<div align="center">

![WeChat QR Code](https://via.placeholder.com/200x200?text=WeChat+QR)

**加入 FlowMind 社区，一起打造更智能的开发工具！**

</div>

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flowmind/flowmind&type=Date)](https://star-history.com/#flowmind/flowmind&Date)

---

<div align="center">

Made with ❤️ by FlowMind Team

[官网](https://flowmind.ai) · [文档](https://docs.flowmind.ai) · [博客](https://blog.flowmind.ai)

</div>
