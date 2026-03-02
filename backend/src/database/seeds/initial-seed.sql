-- FlowMind 数据库初始化脚本
-- 创建数据库（如果不存在）
-- 注意：需要以 postgres 超级用户身份运行此部分

-- CREATE DATABASE flowmind;
-- \c flowmind;

-- 清理现有数据（开发环境）
TRUNCATE TABLE documents, tasks, projects, users CASCADE;

-- 插入测试用户
INSERT INTO users (id, name, email, password, avatar, role, "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', '张三', 'zhangsan@flowmind.com', '$2b$10$YourHashedPasswordHere1', null, 'admin', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '李四', 'lisi@flowmind.com', '$2b$10$YourHashedPasswordHere2', null, 'user', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', '王五', 'wangwu@flowmind.com', '$2b$10$YourHashedPasswordHere3', null, 'user', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', '赵六', 'zhaoliu@flowmind.com', '$2b$10$YourHashedPasswordHere4', null, 'user', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', '钱七', 'qianqi@flowmind.com', '$2b$10$YourHashedPasswordHere5', null, 'user', NOW(), NOW());

-- 插入测试项目
INSERT INTO projects (id, name, description, status, progress, "startDate", deadline, tags, owner_id, "createdAt", "updatedAt") VALUES
('650e8400-e29b-41d4-a716-446655440001', 'FlowMind 平台', 'AI 驱动的 SDLC 管理平台', 'active', 75, '2026-01-15', '2026-04-15', ARRAY['AI', 'SDLC', 'SaaS'], '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', '电商系统重构', '微服务架构升级', 'active', 45, '2026-02-01', '2026-05-20', ARRAY['微服务', '电商', '重构'], '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', '移动端 App 开发', 'React Native 跨平台应用', 'planning', 15, '2026-03-01', '2026-07-30', ARRAY['移动端', 'React Native'], '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', '数据分析平台', '实时数据可视化系统', 'active', 60, '2026-01-20', '2026-06-15', ARRAY['数据分析', '可视化'], '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440005', '客户管理系统', 'CRM 系统开发', 'completed', 100, '2025-10-01', '2026-02-28', ARRAY['CRM', '企业应用'], '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- 插入测试任务
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, "dueDate", "createdAt", "updatedAt") VALUES
-- FlowMind 平台任务
('750e8400-e29b-41d4-a716-446655440001', '完成用户认证模块', '实现 JWT 认证和权限管理', 'done', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2026-02-15', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', '设计项目管理界面', '完成项目列表和详情页设计', 'in_progress', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2026-03-10', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440003', '实现文档编辑器', '集成富文本编辑器', 'todo', 'medium', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2026-03-25', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440004', 'AI 功能集成', '接入 OpenAI API', 'todo', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '2026-04-05', NOW(), NOW()),

-- 电商系统任务
('750e8400-e29b-41d4-a716-446655440005', '订单服务拆分', '将订单模块独立为微服务', 'in_progress', 'high', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '2026-03-15', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440006', '支付网关集成', '接入第三方支付', 'todo', 'high', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '2026-04-01', NOW(), NOW()),

-- 移动端 App 任务
('750e8400-e29b-41d4-a716-446655440007', '技术选型调研', '评估 React Native vs Flutter', 'done', 'high', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2026-02-20', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440008', '原型设计', '完成主要页面原型', 'in_progress', 'medium', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2026-03-20', NOW(), NOW());

-- 插入测试文档
INSERT INTO documents (id, title, type, content, version, project_id, author_id, "createdAt", "updatedAt") VALUES
('850e8400-e29b-41d4-a716-446655440001', 'FlowMind 产品需求文档', 'prd', '# FlowMind PRD\n\n## 产品概述\nFlowMind 是一个 AI 驱动的软件开发生命周期管理平台...\n\n## 核心功能\n1. 项目管理\n2. 任务跟踪\n3. 文档协作\n4. AI 辅助', '1.0', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440002', 'API 设计文档', 'api', '# FlowMind API 设计\n\n## 认证接口\n- POST /api/auth/login\n- POST /api/auth/register\n\n## 项目接口\n- GET /api/projects\n- POST /api/projects\n- GET /api/projects/:id', '1.2', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440003', '系统架构设计', 'design', '# 系统架构\n\n## 技术栈\n- Frontend: React + TypeScript\n- Backend: NestJS + PostgreSQL\n- Deployment: Docker + K8s', '1.0', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440004', '电商系统需求分析', 'prd', '# 电商系统重构需求\n\n## 目标\n将单体应用拆分为微服务架构\n\n## 服务划分\n1. 用户服务\n2. 商品服务\n3. 订单服务\n4. 支付服务', '1.0', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440005', '测试计划', 'test', '# 测试计划\n\n## 单元测试\n- 覆盖率目标：80%\n\n## 集成测试\n- API 测试\n- 端到端测试', '1.0', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW());

-- 验证数据
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects:', COUNT(*) FROM projects
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM tasks
UNION ALL
SELECT 'Documents:', COUNT(*) FROM documents;
