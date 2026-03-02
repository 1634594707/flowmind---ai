import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Project } from '../../modules/projects/entities/project.entity';
import { Task } from '../../modules/tasks/entities/task.entity';
import { Document } from '../../modules/documents/entities/document.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 开始数据库种子数据初始化...');

  // 清理现有数据（按依赖顺序）
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  
  try {
    await queryRunner.query('TRUNCATE TABLE documents CASCADE');
    await queryRunner.query('TRUNCATE TABLE tasks CASCADE');
    await queryRunner.query('TRUNCATE TABLE projects CASCADE');
    await queryRunner.query('TRUNCATE TABLE users CASCADE');
    console.log('✅ 清理现有数据完成');
  } finally {
    await queryRunner.release();
  }

  // 创建用户
  const userRepository = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await userRepository.save([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: '张三',
      email: 'zhangsan@flowmind.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: '李四',
      email: 'lisi@flowmind.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: '王五',
      email: 'wangwu@flowmind.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: '赵六',
      email: 'zhaoliu@flowmind.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: '钱七',
      email: 'qianqi@flowmind.com',
      password: hashedPassword,
      role: 'user',
    },
  ]);
  console.log(`✅ 创建 ${users.length} 个用户`);

  // 创建项目
  const projectRepository = dataSource.getRepository(Project);
  const projects = await projectRepository.save([
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'FlowMind 平台',
      description: 'AI 驱动的 SDLC 管理平台',
      status: 'active',
      progress: 75,
      startDate: new Date('2026-01-15'),
      deadline: new Date('2026-04-15'),
      tags: ['AI', 'SDLC', 'SaaS'],
      ownerId: users[0].id,
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: '电商系统重构',
      description: '微服务架构升级',
      status: 'active',
      progress: 45,
      startDate: new Date('2026-02-01'),
      deadline: new Date('2026-05-20'),
      tags: ['微服务', '电商', '重构'],
      ownerId: users[0].id,
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: '移动端 App 开发',
      description: 'React Native 跨平台应用',
      status: 'planning',
      progress: 15,
      startDate: new Date('2026-03-01'),
      deadline: new Date('2026-07-30'),
      tags: ['移动端', 'React Native'],
      ownerId: users[1].id,
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440004',
      name: '数据分析平台',
      description: '实时数据可视化系统',
      status: 'active',
      progress: 60,
      startDate: new Date('2026-01-20'),
      deadline: new Date('2026-06-15'),
      tags: ['数据分析', '可视化'],
      ownerId: users[2].id,
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440005',
      name: '客户管理系统',
      description: 'CRM 系统开发',
      status: 'completed',
      progress: 100,
      startDate: new Date('2025-10-01'),
      deadline: new Date('2026-02-28'),
      tags: ['CRM', '企业应用'],
      ownerId: users[0].id,
    },
  ]);
  console.log(`✅ 创建 ${projects.length} 个项目`);

  // 创建任务
  const taskRepository = dataSource.getRepository(Task);
  const tasks = await taskRepository.save([
    {
      title: '完成用户认证模块',
      description: '实现 JWT 认证和权限管理',
      status: 'done',
      priority: 'high',
      projectId: projects[0].id,
      assigneeId: users[1].id,
      dueDate: new Date('2026-02-15'),
    },
    {
      title: '设计项目管理界面',
      description: '完成项目列表和详情页设计',
      status: 'in_progress',
      priority: 'high',
      projectId: projects[0].id,
      assigneeId: users[2].id,
      dueDate: new Date('2026-03-10'),
    },
    {
      title: '实现文档编辑器',
      description: '集成富文本编辑器',
      status: 'todo',
      priority: 'medium',
      projectId: projects[0].id,
      assigneeId: users[1].id,
      dueDate: new Date('2026-03-25'),
    },
    {
      title: 'AI 功能集成',
      description: '接入 OpenAI API',
      status: 'todo',
      priority: 'high',
      projectId: projects[0].id,
      assigneeId: users[3].id,
      dueDate: new Date('2026-04-05'),
    },
    {
      title: '订单服务拆分',
      description: '将订单模块独立为微服务',
      status: 'in_progress',
      priority: 'high',
      projectId: projects[1].id,
      assigneeId: users[3].id,
      dueDate: new Date('2026-03-15'),
    },
    {
      title: '支付网关集成',
      description: '接入第三方支付',
      status: 'todo',
      priority: 'high',
      projectId: projects[1].id,
      assigneeId: users[4].id,
      dueDate: new Date('2026-04-01'),
    },
    {
      title: '技术选型调研',
      description: '评估 React Native vs Flutter',
      status: 'done',
      priority: 'high',
      projectId: projects[2].id,
      assigneeId: users[1].id,
      dueDate: new Date('2026-02-20'),
    },
    {
      title: '原型设计',
      description: '完成主要页面原型',
      status: 'in_progress',
      priority: 'medium',
      projectId: projects[2].id,
      assigneeId: users[2].id,
      dueDate: new Date('2026-03-20'),
    },
  ]);
  console.log(`✅ 创建 ${tasks.length} 个任务`);

  // 创建文档
  const documentRepository = dataSource.getRepository(Document);
  const documents = await documentRepository.save([
    {
      title: 'FlowMind 产品需求文档',
      type: 'prd',
      content: `# FlowMind PRD

## 产品概述
FlowMind 是一个 AI 驱动的软件开发生命周期管理平台...

## 核心功能
1. 项目管理
2. 任务跟踪
3. 文档协作
4. AI 辅助`,
      version: '1.0',
      projectId: projects[0].id,
      authorId: users[0].id,
    },
    {
      title: 'API 设计文档',
      type: 'api',
      content: `# FlowMind API 设计

## 认证接口
- POST /api/auth/login
- POST /api/auth/register

## 项目接口
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id`,
      version: '1.2',
      projectId: projects[0].id,
      authorId: users[1].id,
    },
    {
      title: '系统架构设计',
      type: 'design',
      content: `# 系统架构

## 技术栈
- Frontend: React + TypeScript
- Backend: NestJS + PostgreSQL
- Deployment: Docker + K8s`,
      version: '1.0',
      projectId: projects[0].id,
      authorId: users[0].id,
    },
    {
      title: '电商系统需求分析',
      type: 'prd',
      content: `# 电商系统重构需求

## 目标
将单体应用拆分为微服务架构

## 服务划分
1. 用户服务
2. 商品服务
3. 订单服务
4. 支付服务`,
      version: '1.0',
      projectId: projects[1].id,
      authorId: users[3].id,
    },
    {
      title: '测试计划',
      type: 'test',
      content: `# 测试计划

## 单元测试
- 覆盖率目标：80%

## 集成测试
- API 测试
- 端到端测试`,
      version: '1.0',
      projectId: projects[0].id,
      authorId: users[2].id,
    },
  ]);
  console.log(`✅ 创建 ${documents.length} 个文档`);

  console.log('🎉 数据库种子数据初始化完成！');
  console.log('\n📊 数据统计：');
  console.log(`   用户: ${users.length}`);
  console.log(`   项目: ${projects.length}`);
  console.log(`   任务: ${tasks.length}`);
  console.log(`   文档: ${documents.length}`);
  console.log('\n🔑 测试账号：');
  console.log('   邮箱: zhangsan@flowmind.com');
  console.log('   密码: password123');
}
