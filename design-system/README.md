# FlowMind 设计系统

本目录包含 FlowMind 项目的完整设计系统，使用 [ui-ux-pro-max](../.kiro/steering/ui-ux-pro-max/) 工具生成。

---

## 📁 目录结构

```
design-system/
└── flowmind/
    ├── MASTER.md           # 全局设计规则（主文件）
    └── pages/              # 页面特定设计覆盖
        ├── dashboard.md    # 仪表盘页面设计
        └── login.md        # 登录页面设计
```

---

## 🎯 使用规则

### 层级覆盖原则

设计系统采用 **Master + Overrides** 模式：

1. **优先查找页面特定设计**  
   构建特定页面时，首先检查 `pages/[page-name].md`

2. **回退到全局设计**  
   如果页面特定文件不存在，使用 `MASTER.md` 中的全局规则

3. **覆盖规则**  
   页面特定设计会 **覆盖** Master 文件中的相同规则

### 示例

```tsx
// 构建仪表盘页面
// 1. 检查 pages/dashboard.md ✅ 存在
// 2. 使用 dashboard.md 中的规则（数据密集型仪表盘风格）
// 3. dashboard.md 中未定义的规则，回退到 MASTER.md

// 构建设置页面
// 1. 检查 pages/settings.md ❌ 不存在
// 2. 直接使用 MASTER.md 中的全局规则
```

---

## 📖 核心设计要素

### 色彩系统
- **主色**: `#7C3AED` (紫色) - 品牌色、创新感
- **辅助色**: `#A78BFA` (浅紫) - 次要元素
- **强调色**: `#F97316` (橙色) - CTA、行动号召
- **背景色**: `#FAF5FF` (浅紫背景)
- **文本色**: `#4C1D95` (深紫)

### 字体系统
- **标题字体**: Poppins (现代、专业)
- **正文字体**: Open Sans (清晰、易读)
- **代码字体**: Fira Code (等宽、连字)

### 设计风格
- **主风格**: Glassmorphism (玻璃态)
- **特点**: 毛玻璃效果、透明度、景深
- **适用**: 现代 SaaS、企业级应用

### 页面模式
- **通用模式**: Portfolio Grid
- **仪表盘**: Data-Dense Dashboard (数据密集型)
- **登录页**: Exaggerated Minimalism (极简主义)

---

## 🚀 快速开始

### 1. 查看设计系统

```bash
# 查看全局设计规则
cat design-system/flowmind/MASTER.md

# 查看仪表盘特定设计
cat design-system/flowmind/pages/dashboard.md

# 查看登录页特定设计
cat design-system/flowmind/pages/login.md
```

### 2. 生成新页面设计

```bash
# 为新页面生成特定设计
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "your page keywords" \
  --design-system \
  --persist \
  -p "FlowMind" \
  --page "page-name"
```

### 3. 应用到代码

参考以下文档将设计系统应用到实际代码：

- [前端设计规范](../docs/FRONTEND_DESIGN.md) - 完整设计规范
- [页面设计方案](../docs/PAGE_DESIGNS.md) - 具体页面实现
- [组件库文档](../docs/COMPONENT_LIBRARY.md) - 可复用组件
- [快速参考](../docs/DESIGN_QUICK_REFERENCE.md) - 速查手册

---

## 📋 设计检查清单

在实现任何页面前，确保：

### 视觉质量
- [ ] 使用 SVG 图标（Heroicons/Lucide），不使用 Emoji
- [ ] 所有图标来自统一图标集
- [ ] 悬浮状态不引起布局偏移
- [ ] 直接使用主题色类名（如 `bg-purple-600`）

### 交互体验
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] 悬浮状态有清晰视觉反馈
- [ ] 过渡动画流畅（150-300ms）
- [ ] 键盘导航焦点状态可见

### 响应式
- [ ] 浮动元素与边缘有适当间距
- [ ] 内容不被固定导航栏遮挡
- [ ] 在 375px、768px、1024px、1440px 测试通过
- [ ] 移动端无横向滚动

### 无障碍
- [ ] 所有图片有 alt 文本
- [ ] 表单输入有标签
- [ ] 颜色不是唯一指示器
- [ ] 尊重 `prefers-reduced-motion`

### 对比度
- [ ] 浅色模式文本对比度 ≥ 4.5:1
- [ ] 玻璃/透明元素在浅色模式下可见
- [ ] 边框在浅色模式下可见

---

## 🔄 更新设计系统

### 更新全局设计

```bash
# 重新生成主设计系统
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "SaaS project management AI-driven professional modern" \
  --design-system \
  --persist \
  -p "FlowMind"
```

### 添加新页面设计

```bash
# 为新页面生成设计
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "page specific keywords" \
  --design-system \
  --persist \
  -p "FlowMind" \
  --page "new-page-name"
```

### 获取详细设计建议

```bash
# 获取 UX 指南
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "animation accessibility navigation" \
  --domain ux

# 获取技术栈最佳实践
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "component state performance" \
  --stack react

# 获取色彩方案
python .kiro/steering/ui-ux-pro-max/scripts/search.py \
  "saas dashboard" \
  --domain color
```

---

## 📚 相关文档

### 设计文档
- [MASTER.md](./flowmind/MASTER.md) - 全局设计规则
- [前端设计规范](../docs/FRONTEND_DESIGN.md) - 完整设计规范
- [页面设计方案](../docs/PAGE_DESIGNS.md) - 页面实现方案
- [组件库文档](../docs/COMPONENT_LIBRARY.md) - 组件使用指南
- [快速参考](../docs/DESIGN_QUICK_REFERENCE.md) - 设计速查

### 工具文档
- [ui-ux-pro-max 使用指南](../.kiro/steering/ui-ux-pro-max/SKILL.md)

### 项目文档
- [项目架构](../ARCHITECTURE.md)
- [项目计划](../PROJECT_PLAN.md)
- [项目状态](../PROJECT_STATUS.md)

---

## 🎨 设计原则

### 1. 一致性优先
所有页面遵循统一的设计语言，确保用户体验连贯。

### 2. 性能至上
- 避免过度动画
- 优化图片加载
- 减少不必要的重渲染

### 3. 无障碍第一
- 键盘导航支持
- 屏幕阅读器友好
- 充足的颜色对比度

### 4. 移动优先
- 响应式设计
- 触摸友好的交互
- 适配小屏幕

### 5. 渐进增强
- 基础功能优先
- 逐步添加高级特性
- 优雅降级

---

## 🤝 贡献指南

### 修改设计系统

1. 使用 ui-ux-pro-max 工具重新生成
2. 手动编辑 MASTER.md 或页面特定文件
3. 更新相关文档
4. 提交 PR 并说明修改原因

### 添加新页面设计

1. 使用工具生成页面特定设计
2. 在 `pages/` 目录下创建新文件
3. 更新本 README 文档
4. 在页面设计方案文档中添加实现指南

---

## 📞 支持

如有设计相关问题：

1. 查看 [快速参考](../docs/DESIGN_QUICK_REFERENCE.md)
2. 查看 [前端设计规范](../docs/FRONTEND_DESIGN.md)
3. 查看 [ui-ux-pro-max 文档](../.kiro/steering/ui-ux-pro-max/SKILL.md)
4. 提交 GitHub Issue

---

**设计系统 v1.0** - 生成于 2026-03-02
