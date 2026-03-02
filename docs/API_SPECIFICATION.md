# FlowMind API 接口规范

**版本**: v1.0  
**日期**: 2026-03-02  
**基础路径**: `/api/v1`

---

## 1. 认证模块 (Auth)

### 1.1 用户注册
```
POST /api/v1/auth/register
```

**请求体**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "uuid",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": null,
      "role": "user",
      "createdAt": "2026-03-02T10:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 1.2 用户登录
```
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "uuid",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": "https://...",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### 1.3 获取当前用户信息
```
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "name": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://...",
    "role": "user",
    "createdAt": "2026-03-02T10:00:00Z"
  }
}
```

### 1.4 退出登录
```
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

---

## 2. 用户模块 (Users)

### 2.1 更新用户信息
```
PATCH /api/v1/users/:id
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "name": "张三",
  "avatar": "https://..."
}
```

### 2.2 修改密码
```
POST /api/v1/users/:id/change-password
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## 3. 项目模块 (Projects)

### 3.1 获取项目列表
```
GET /api/v1/projects
Authorization: Bearer {token}
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `status`: 状态筛选 (active, planning, completed)
- `search`: 搜索关键词

**响应**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "FlowMind 平台",
        "description": "AI 驱动的 SDLC 管理平台",
        "status": "active",
        "progress": 75,
        "startDate": "2026-01-01",
        "deadline": "2026-04-15",
        "tags": ["AI", "SaaS"],
        "members": [
          {
            "id": "uuid",
            "name": "张三",
            "avatar": "https://...",
            "role": "owner"
          }
        ],
        "tasks": {
          "total": 48,
          "completed": 36
        },
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-03-02T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3
    }
  }
}
```

### 3.2 创建项目
```
POST /api/v1/projects
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "name": "新项目",
  "description": "项目描述",
  "startDate": "2026-03-01",
  "deadline": "2026-06-30",
  "tags": ["Web", "React"]
}
```

### 3.3 获取项目详情
```
GET /api/v1/projects/:id
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "name": "FlowMind 平台",
    "description": "AI 驱动的 SDLC 管理平台",
    "status": "active",
    "progress": 75,
    "startDate": "2026-01-01",
    "deadline": "2026-04-15",
    "tags": ["AI", "SaaS"],
    "owner": {
      "id": "uuid",
      "name": "张三",
      "avatar": "https://..."
    },
    "members": [...],
    "phases": [...],
    "tasks": {...},
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-03-02T10:00:00Z"
  }
}
```

### 3.4 更新项目
```
PATCH /api/v1/projects/:id
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "name": "更新后的项目名",
  "description": "更新后的描述",
  "status": "active",
  "deadline": "2026-05-15"
}
```

### 3.5 删除项目
```
DELETE /api/v1/projects/:id
Authorization: Bearer {token}
```

### 3.6 添加项目成员
```
POST /api/v1/projects/:id/members
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "userId": "uuid",
  "role": "developer"
}
```

### 3.7 移除项目成员
```
DELETE /api/v1/projects/:id/members/:userId
Authorization: Bearer {token}
```

---

## 4. 仪表盘模块 (Dashboard)

### 4.1 获取仪表盘统计
```
GET /api/v1/dashboard/stats
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "totalProjects": 24,
    "activeProjects": 8,
    "completedProjects": 15,
    "delayedProjects": 1,
    "trends": {
      "totalProjects": "+12%",
      "activeProjects": "+3",
      "completedProjects": "+5",
      "delayedProjects": "-2"
    }
  }
}
```

### 4.2 获取最近活动
```
GET /api/v1/dashboard/activities
Authorization: Bearer {token}
```

**查询参数**:
- `limit`: 数量限制 (默认: 10)

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "type": "project_created",
      "user": {
        "id": "uuid",
        "name": "张三",
        "avatar": "https://..."
      },
      "action": "创建了项目",
      "target": "FlowMind 平台",
      "targetId": "uuid",
      "createdAt": "2026-03-02T08:00:00Z"
    }
  ]
}
```

### 4.3 获取项目进度数据
```
GET /api/v1/dashboard/progress
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "burndown": [
      { "date": "2026-03-01", "planned": 100, "actual": 95 },
      { "date": "2026-03-02", "planned": 90, "actual": 85 }
    ]
  }
}
```

---

## 5. 任务模块 (Tasks)

### 5.1 获取任务列表
```
GET /api/v1/projects/:projectId/tasks
Authorization: Bearer {token}
```

**查询参数**:
- `status`: 状态筛选 (todo, in_progress, done)
- `assignee`: 负责人筛选

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "title": "实现用户认证",
      "description": "实现 JWT 认证",
      "status": "in_progress",
      "priority": "high",
      "assignee": {
        "id": "uuid",
        "name": "张三",
        "avatar": "https://..."
      },
      "dueDate": "2026-03-10",
      "createdAt": "2026-03-01T00:00:00Z"
    }
  ]
}
```

### 5.2 创建任务
```
POST /api/v1/projects/:projectId/tasks
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "title": "任务标题",
  "description": "任务描述",
  "priority": "high",
  "assigneeId": "uuid",
  "dueDate": "2026-03-10"
}
```

### 5.3 更新任务
```
PATCH /api/v1/tasks/:id
Authorization: Bearer {token}
```

### 5.4 删除任务
```
DELETE /api/v1/tasks/:id
Authorization: Bearer {token}
```

---

## 6. 文档模块 (Documents)

### 6.1 获取文档列表
```
GET /api/v1/projects/:projectId/documents
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "title": "需求分析文档",
      "type": "prd",
      "content": "...",
      "author": {
        "id": "uuid",
        "name": "张三"
      },
      "version": "1.0",
      "createdAt": "2026-03-01T00:00:00Z",
      "updatedAt": "2026-03-02T10:00:00Z"
    }
  ]
}
```

### 6.2 创建文档
```
POST /api/v1/projects/:projectId/documents
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "title": "文档标题",
  "type": "prd",
  "content": "文档内容"
}
```

### 6.3 更新文档
```
PATCH /api/v1/documents/:id
Authorization: Bearer {token}
```

### 6.4 删除文档
```
DELETE /api/v1/documents/:id
Authorization: Bearer {token}
```

---

## 7. AI 助手模块 (AI)

### 7.1 需求分析对话
```
POST /api/v1/ai/requirement-analysis
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "projectId": "uuid",
  "message": "我想做一个电商购物车",
  "conversationId": "uuid" // 可选，用于多轮对话
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "conversationId": "uuid",
    "reply": "好的，关于电商购物车，我想了解几个问题...",
    "suggestions": [
      "支持多种商品规格吗？",
      "库存扣减时机？"
    ]
  }
}
```

### 7.2 生成 PRD 文档
```
POST /api/v1/ai/generate-prd
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "projectId": "uuid",
  "conversationId": "uuid"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "documentId": "uuid",
    "content": "# 产品需求文档\n\n## 1. 项目概述\n..."
  }
}
```

---

## 8. 通知模块 (Notifications)

### 8.1 获取通知列表
```
GET /api/v1/notifications
Authorization: Bearer {token}
```

**响应**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "type": "task_assigned",
      "title": "新任务分配",
      "content": "张三 给你分配了任务：实现用户认证",
      "read": false,
      "createdAt": "2026-03-02T10:00:00Z"
    }
  ]
}
```

### 8.2 标记通知已读
```
PATCH /api/v1/notifications/:id/read
Authorization: Bearer {token}
```

---

## 9. 文件上传模块 (Upload)

### 9.1 上传文件
```
POST /api/v1/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体**:
```
file: [binary]
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "url": "https://cdn.flowmind.ai/files/xxx.png",
    "filename": "avatar.png",
    "size": 102400,
    "mimeType": "image/png"
  }
}
```

---

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {...}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

### HTTP 状态码
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器错误

---

## 认证方式

所有需要认证的接口都需要在请求头中携带 JWT Token：

```
Authorization: Bearer {token}
```

---

**接口总数**: 40+  
**核心模块**: 9 个  
**认证方式**: JWT

