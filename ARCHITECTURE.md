# FlowMind 技术架构文档

**版本**: v1.0  
**日期**: 2026-03-02  
**维护者**: 技术团队

---

## 1. 系统架构概览

### 1.1 架构设计原则

- **微服务化**: 核心业务模块独立部署，支持独立扩展
- **事件驱动**: 使用消息队列解耦服务间通信
- **云原生**: 基于 Kubernetes 容器化部署
- **AI First**: AI 能力作为核心基础设施层
- **安全优先**: 数据加密、权限控制、审计日志全覆盖

### 1.2 技术栈总览

```yaml
前端技术栈:
  框架: React 18 + TypeScript 5.0
  构建工具: Vite 5.0
  UI组件: Ant Design 5.0 + TailwindCSS 3.4
  状态管理: Zustand 4.0 + React Query 5.0
  可视化: ReactFlow 11.0 + Mermaid 10.0
  
后端技术栈:
  业务服务: Node.js 20 LTS + NestJS 10.0
  AI服务: Python 3.11 + FastAPI 0.110
  API网关: Kong Gateway 3.5
  
数据存储:
  关系数据库: PostgreSQL 15 + pgvector
  缓存: Redis 7.2
  消息队列: Apache Kafka 3.6
  搜索引擎: Elasticsearch 8.12
  对象存储: MinIO / AWS S3
  
AI技术栈:
  LLM编排: LangChain 0.1 + LlamaIndex 0.10
  向量数据库: PostgreSQL pgvector
  模型服务: OpenAI API / DeepSeek / 本地部署
  
基础设施:
  容器编排: Kubernetes 1.29
  服务网格: Istio 1.20
  监控: Prometheus + Grafana
  日志: ELK Stack
  CI/CD: GitHub Actions / GitLab CI
```

---

## 2. 服务架构设计

### 2.1 服务拆分

```
flowmind-platform/
├── api-gateway/              # API网关服务
├── auth-service/             # 认证授权服务
├── project-service/          # 项目管理服务
├── workflow-service/         # 工作流引擎服务
├── document-service/         # 文档管理服务
├── ai-orchestrator/          # AI编排服务
│   ├── requirement-agent/    # 需求分析Agent
│   ├── design-agent/         # 设计生成Agent
│   ├── code-agent/           # 代码辅助Agent
│   └── qa-agent/             # 测试生成Agent
├── integration-service/      # 第三方集成服务
├── notification-service/     # 通知服务
└── analytics-service/        # 数据分析服务
```

### 2.2 服务通信模式

**同步通信** (REST/gRPC):
- 用户请求处理
- 服务间查询操作
- 实时数据获取

**异步通信** (Kafka):
- 事件通知
- 数据同步
- 长时间运行任务

---

## 3. 数据架构

### 3.1 数据库设计

**核心表结构**:

```sql
-- 用户与组织
users, organizations, teams, team_members

-- 项目管理
projects, project_members, sdlc_templates, phases

-- 需求管理
requirements, requirement_versions, requirement_comments

-- 交付物管理
deliverables, deliverable_versions, deliverable_reviews

-- 工作流
workflow_definitions, workflow_executions, workflow_tasks

-- AI交互
ai_conversations, ai_suggestions, ai_feedback

-- 知识图谱
knowledge_nodes, knowledge_edges, knowledge_embeddings

-- 审计日志
audit_logs, user_activities
```

### 3.2 数据分片策略

- **按组织分片**: 不同组织数据物理隔离
- **按时间归档**: 历史项目数据定期归档
- **读写分离**: 主库写入，从库查询

---

## 4. AI 系统架构

### 4.1 AI 服务层次

```
┌─────────────────────────────────────────┐
│         应用层 (Application)             │
│  项目向导 | 需求分析 | 设计助手 | 代码审查  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         编排层 (Orchestration)           │
│  LangChain | Agent协作 | 工作流调度      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         模型层 (Model)                   │
│  GPT-4 | Claude | DeepSeek | 微调模型   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         数据层 (Data)                    │
│  向量库 | 知识库 | 项目上下文 | 模板库    │
└─────────────────────────────────────────┘
```

### 4.2 RAG 实现方案

**向量化策略**:
- 文档分块: 500-1000 tokens/chunk
- 嵌入模型: text-embedding-3-large
- 相似度检索: cosine similarity
- 混合检索: 向量检索 + 关键词检索

**上下文构建**:
```python
context = {
    "project_info": "项目基本信息",
    "current_phase": "当前阶段状态",
    "recent_activities": "最近操作历史",
    "related_docs": "相关文档片段",
    "domain_knowledge": "领域知识库",
    "similar_cases": "相似案例"
}
```

---

## 5. 安全架构

### 5.1 认证与授权

**认证方式**:
- JWT Token (短期访问令牌)
- Refresh Token (长期刷新令牌)
- OAuth 2.0 (第三方登录)
- SSO (企业单点登录)

**权限模型** (RBAC + ABAC):
```yaml
角色定义:
  - 系统管理员: 全局配置管理
  - 组织管理员: 组织内资源管理
  - 项目经理: 项目全权限
  - 开发者: 开发相关权限
  - 测试人员: 测试相关权限
  - 访客: 只读权限

资源权限:
  - 项目: create, read, update, delete, archive
  - 文档: create, read, update, delete, share
  - 代码: read, commit, review, merge
```

### 5.2 数据安全

- **传输加密**: TLS 1.3
- **存储加密**: AES-256
- **敏感数据**: 字段级加密
- **密钥管理**: HashiCorp Vault
- **审计日志**: 所有操作可追溯

---

## 6. 性能优化

### 6.1 缓存策略

**多级缓存**:
```
浏览器缓存 (静态资源)
    ↓
CDN缓存 (全球加速)
    ↓
Redis缓存 (热点数据)
    ↓
数据库查询缓存
```

**缓存失效策略**:
- 用户信息: 30分钟 TTL
- 项目配置: 实时更新 (事件驱动)
- 文档内容: 版本号控制
- AI生成结果: 24小时 TTL

### 6.2 数据库优化

- **索引优化**: 覆盖索引、复合索引
- **查询优化**: 避免 N+1 查询
- **连接池**: 动态调整连接数
- **分页查询**: 游标分页替代 offset

---

## 7. 可观测性

### 7.1 监控指标

**业务指标**:
- 项目创建数、活跃项目数
- AI 调用次数、成功率
- 用户活跃度、留存率

**技术指标**:
- API 响应时间 (P50/P95/P99)
- 服务可用性 (SLA 99.9%)
- 数据库连接数、慢查询
- 消息队列积压

### 7.2 告警策略

```yaml
告警级别:
  P0 (紧急): 服务不可用、数据丢失
  P1 (严重): 核心功能异常、性能严重下降
  P2 (警告): 非核心功能异常、资源使用率高
  P3 (提示): 潜在风险、优化建议

通知渠道:
  - 钉钉/飞书机器人
  - 邮件
  - 短信 (P0/P1)
  - PagerDuty (值班系统)
```

---

## 8. 部署架构

### 8.1 Kubernetes 部署

```yaml
命名空间划分:
  - flowmind-prod: 生产环境
  - flowmind-staging: 预发布环境
  - flowmind-dev: 开发环境

资源配置:
  api-gateway:
    replicas: 3
    cpu: 500m
    memory: 1Gi
  
  project-service:
    replicas: 5
    cpu: 1000m
    memory: 2Gi
  
  ai-orchestrator:
    replicas: 3
    cpu: 2000m
    memory: 4Gi
```

### 8.2 灰度发布策略

- **金丝雀发布**: 5% → 25% → 50% → 100%
- **蓝绿部署**: 关键服务零停机切换
- **功能开关**: 新功能可动态开启/关闭

---

## 9. 灾难恢复

### 9.1 备份策略

- **数据库**: 每日全量备份 + 实时增量备份
- **对象存储**: 跨区域复制
- **配置文件**: Git 版本控制
- **备份保留**: 30天内可恢复任意时间点

### 9.2 故障恢复

**RTO (恢复时间目标)**: < 1小时  
**RPO (恢复点目标)**: < 5分钟

**故障演练**:
- 每季度进行灾难恢复演练
- 模拟数据库故障、服务宕机、网络中断

---

## 10. 技术债务管理

### 10.1 代码质量

- **单元测试覆盖率**: > 70%
- **代码审查**: 所有 PR 必须经过审查
- **静态代码扫描**: SonarQube 每日扫描
- **依赖安全**: Dependabot 自动更新

### 10.2 重构计划

**Q2 2026**:
- 工作流引擎迁移至 Temporal
- 向量数据库独立部署

**Q3 2026**:
- 微服务拆分优化
- 性能压测与优化

---

## 附录

### A. API 设计规范

- RESTful 风格
- 版本控制: `/api/v1/`
- 统一响应格式
- 错误码标准化

### B. 开发规范

- Git Flow 分支管理
- Conventional Commits 提交规范
- ESLint + Prettier 代码格式化
- TypeScript 严格模式

### C. 参考资料

- [Kubernetes 最佳实践](https://kubernetes.io/docs/concepts/)
- [微服务设计模式](https://microservices.io/patterns/)
- [LangChain 文档](https://python.langchain.com/)
