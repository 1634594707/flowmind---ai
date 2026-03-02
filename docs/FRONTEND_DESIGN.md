# FlowMind 前端设计规范

**版本**: v1.0  
**日期**: 2026-03-02  
**设计系统**: 基于 ui-ux-pro-max 生成

---

## 1. 设计理念

FlowMind 是一个 AI 驱动的 SDLC 管理平台，设计风格应体现：

- **专业性**: 面向软件开发团队的企业级工具
- **现代感**: 采用 Glassmorphism 风格，展现技术前沿感
- **智能化**: 通过视觉设计传达 AI 辅助的核心价值
- **高效性**: 清晰的信息层次，减少认知负担
- **协作性**: 强调团队协作的视觉元素

---

## 2. 色彩系统

### 2.1 主色调

| 角色 | 颜色值 | CSS 变量 | 使用场景 |
|------|--------|----------|---------|
| **主色** | `#7C3AED` | `--color-primary` | 品牌色、主要按钮、重要标识 |
| **辅助色** | `#A78BFA` | `--color-secondary` | 次要按钮、标签、辅助信息 |
| **强调色** | `#F97316` | `--color-cta` | CTA 按钮、重要提示、行动号召 |
| **背景色** | `#FAF5FF` | `--color-background` | 页面背景、卡片背景 |
| **文本色** | `#4C1D95` | `--color-text` | 主要文本内容 |

### 2.2 语义色彩

```css
/* 成功 */
--color-success: #10B981;
--color-success-light: #D1FAE5;

/* 警告 */
--color-warning: #F59E0B;
--color-warning-light: #FEF3C7;

/* 错误 */
--color-error: #EF4444;
--color-error-light: #FEE2E2;

/* 信息 */
--color-info: #3B82F6;
--color-info-light: #DBEAFE;
```

### 2.3 中性色阶

```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### 2.4 色彩使用原则

- **对比度**: 文本与背景对比度至少 4.5:1（WCAG AA 标准）
- **一致性**: 同类操作使用相同颜色
- **层次感**: 通过颜色深浅区分信息重要性
- **情感化**: 紫色传达创新与智能，橙色传达行动与活力

---

## 3. 字体系统

### 3.1 字体家族

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;
```

### 3.2 字体尺寸

| 级别 | 尺寸 | 行高 | 用途 |
|------|------|------|------|
| `text-xs` | 12px / 0.75rem | 16px | 辅助文本、标签 |
| `text-sm` | 14px / 0.875rem | 20px | 次要文本、说明 |
| `text-base` | 16px / 1rem | 24px | 正文内容 |
| `text-lg` | 18px / 1.125rem | 28px | 强调文本 |
| `text-xl` | 20px / 1.25rem | 28px | 小标题 |
| `text-2xl` | 24px / 1.5rem | 32px | 卡片标题 |
| `text-3xl` | 30px / 1.875rem | 36px | 页面标题 |
| `text-4xl` | 36px / 2.25rem | 40px | 大标题 |
| `text-5xl` | 48px / 3rem | 1 | Hero 标题 |

### 3.3 字重

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 4. 间距系统

### 4.1 间距标准

| Token | 值 | Tailwind | 使用场景 |
|-------|-----|----------|---------|
| `--space-xs` | 4px | `p-1` | 紧密间距 |
| `--space-sm` | 8px | `p-2` | 图标间距 |
| `--space-md` | 16px | `p-4` | 标准内边距 |
| `--space-lg` | 24px | `p-6` | 区块内边距 |
| `--space-xl` | 32px | `p-8` | 大间距 |
| `--space-2xl` | 48px | `p-12` | 区块外边距 |
| `--space-3xl` | 64px | `p-16` | Hero 区域 |

### 4.2 布局网格

```css
/* 容器最大宽度 */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* 标准内容宽度 */
--content-width: 1200px;
```

---

## 5. 阴影系统

### 5.1 阴影层级

```css
/* 微阴影 - 轻微悬浮 */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);

/* 小阴影 - 卡片、按钮 */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

/* 中阴影 - 悬浮卡片 */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

/* 大阴影 - 模态框、下拉菜单 */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* 超大阴影 - Hero 图片、重要元素 */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);

/* 2XL 阴影 - 全屏模态 */
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### 5.2 Glassmorphism 效果

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-md);
}

.glass-card-strong {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-lg);
}
```

---

## 6. 组件规范

### 6.1 按钮

#### 主要按钮 (Primary)

```tsx
<button className="
  bg-orange-500 hover:bg-orange-600
  text-white font-semibold
  px-6 py-3 rounded-lg
  transition-all duration-200
  shadow-md hover:shadow-lg
  hover:-translate-y-0.5
  cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
">
  开始使用
</button>
```

#### 次要按钮 (Secondary)

```tsx
<button className="
  bg-transparent hover:bg-purple-50
  text-purple-600 font-semibold
  px-6 py-3 rounded-lg
  border-2 border-purple-600
  transition-all duration-200
  cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
">
  了解更多
</button>
```

#### 文本按钮 (Text)

```tsx
<button className="
  text-purple-600 hover:text-purple-700
  font-medium
  px-4 py-2
  transition-colors duration-200
  cursor-pointer
  focus:outline-none focus:underline
">
  查看详情 →
</button>
```

### 6.2 卡片

#### 标准卡片

```tsx
<div className="
  bg-purple-50/50 backdrop-blur-sm
  rounded-xl p-6
  border border-purple-100
  shadow-md hover:shadow-lg
  transition-all duration-200
  hover:-translate-y-1
  cursor-pointer
">
  <h3 className="text-xl font-semibold text-purple-900 mb-2">
    卡片标题
  </h3>
  <p className="text-gray-600">
    卡片内容描述
  </p>
</div>
```

#### Glassmorphism 卡片

```tsx
<div className="
  bg-white/70 backdrop-blur-lg
  rounded-2xl p-8
  border border-white/20
  shadow-xl
  transition-all duration-300
  hover:shadow-2xl
  cursor-pointer
">
  {/* 内容 */}
</div>
```

### 6.3 输入框

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    项目名称
  </label>
  <input
    type="text"
    className="
      w-full px-4 py-3
      border border-gray-300 rounded-lg
      focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
      transition-all duration-200
      outline-none
    "
    placeholder="输入项目名称"
  />
</div>
```

### 6.4 模态框

```tsx
{/* 遮罩层 */}
<div className="
  fixed inset-0 z-50
  bg-black/50 backdrop-blur-sm
  flex items-center justify-center
  p-4
">
  {/* 模态框 */}
  <div className="
    bg-white rounded-2xl
    p-8 max-w-lg w-full
    shadow-2xl
    transform transition-all duration-300
  ">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      模态框标题
    </h2>
    <p className="text-gray-600 mb-6">
      模态框内容
    </p>
    <div className="flex gap-3 justify-end">
      <button className="btn-secondary">取消</button>
      <button className="btn-primary">确认</button>
    </div>
  </div>
</div>
```

---

## 7. 页面布局

### 7.1 导航栏

```tsx
<nav className="
  fixed top-4 left-4 right-4 z-50
  bg-white/80 backdrop-blur-lg
  rounded-2xl px-6 py-4
  border border-white/20
  shadow-lg
">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="FlowMind" className="h-8" />
      <span className="text-xl font-bold text-purple-900">FlowMind</span>
    </div>
    
    {/* 导航链接 */}
    <div className="hidden md:flex items-center gap-8">
      <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
        功能
      </a>
      <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
        定价
      </a>
      <a href="#docs" className="text-gray-700 hover:text-purple-600 transition-colors">
        文档
      </a>
    </div>
    
    {/* CTA */}
    <div className="flex items-center gap-3">
      <button className="btn-secondary">登录</button>
      <button className="btn-primary">免费试用</button>
    </div>
  </div>
</nav>
```

### 7.2 Hero 区域

```tsx
<section className="
  min-h-screen pt-32 pb-20
  bg-gradient-to-br from-purple-50 via-white to-orange-50
">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center max-w-4xl mx-auto">
      {/* 标签 */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
        AI 驱动的项目管理
      </div>
      
      {/* 主标题 */}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        像 GPS 导航一样
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
          做软件项目
        </span>
      </h1>
      
      {/* 副标题 */}
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        FlowMind 通过 AI 智能助手，帮助团队提升 50% 开发效率，
        减少 30% 项目延期率
      </p>
      
      {/* CTA 按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="btn-primary text-lg px-8 py-4">
          免费开始 →
        </button>
        <button className="btn-secondary text-lg px-8 py-4">
          观看演示
        </button>
      </div>
      
      {/* 社会证明 */}
      <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-600">500+</span>
          <span>团队使用</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-600">4.9/5</span>
          <span>用户评分</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 7.3 功能展示区

```tsx
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    {/* 区块标题 */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        核心功能
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        从需求到部署，AI 全程辅助
      </p>
    </div>
    
    {/* 功能卡片网格 */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.id} className="glass-card group">
          {/* 图标 */}
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <feature.icon className="w-6 h-6 text-purple-600" />
          </div>
          
          {/* 标题 */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          
          {/* 描述 */}
          <p className="text-gray-600 mb-4">
            {feature.description}
          </p>
          
          {/* 链接 */}
          <a href={feature.link} className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1">
            了解更多 →
          </a>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 8. 图标系统

### 8.1 图标库选择

**主要图标库**: [Heroicons](https://heroicons.com/)  
**备选图标库**: [Lucide Icons](https://lucide.dev/)  
**品牌图标**: [Simple Icons](https://simpleicons.org/)

### 8.2 图标使用规范

```tsx
import { SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

// 标准尺寸
<SparklesIcon className="w-6 h-6 text-purple-600" />

// 小尺寸
<SparklesIcon className="w-4 h-4 text-gray-500" />

// 大尺寸
<RocketLaunchIcon className="w-8 h-8 text-orange-500" />
```

### 8.3 禁止使用

❌ **不要使用 Emoji 作为 UI 图标**

```tsx
// ❌ 错误
<span>🚀</span>

// ✅ 正确
<RocketLaunchIcon className="w-6 h-6" />
```

---

## 9. 动画与过渡

### 9.1 过渡时长

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### 9.2 缓动函数

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 9.3 常用动画

```tsx
// 悬浮效果
className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"

// 淡入淡出
className="transition-opacity duration-300"

// 缩放
className="transition-transform duration-200 hover:scale-105"

// 颜色过渡
className="transition-colors duration-200"
```

### 9.4 减少动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. 响应式设计

### 10.1 断点系统

```css
/* Tailwind 默认断点 */
--breakpoint-sm: 640px;   /* 手机横屏 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 笔记本 */
--breakpoint-xl: 1280px;  /* 桌面 */
--breakpoint-2xl: 1536px; /* 大屏 */
```

### 10.2 移动优先

```tsx
// ✅ 正确：移动优先
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
```

### 10.3 测试设备

必须在以下尺寸测试：
- 📱 375px (iPhone SE)
- 📱 390px (iPhone 12/13/14)
- 📱 428px (iPhone 14 Pro Max)
- 📱 768px (iPad)
- 💻 1024px (iPad Pro / 小笔记本)
- 💻 1440px (标准桌面)
- 🖥️ 1920px (大屏)

---

## 11. 无障碍设计 (A11y)

### 11.1 键盘导航

```tsx
// 确保所有交互元素可通过键盘访问
<button
  className="..."
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  点击我
</button>
```

### 11.2 焦点状态

```tsx
// 所有交互元素必须有清晰的焦点状态
className="
  focus:outline-none
  focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
"
```

### 11.3 语义化 HTML

```tsx
// ✅ 正确
<nav>
  <ul>
    <li><a href="#features">功能</a></li>
  </ul>
</nav>

// ❌ 错误
<div>
  <div>
    <div onClick={...}>功能</div>
  </div>
</div>
```

### 11.4 ARIA 标签

```tsx
<button
  aria-label="关闭模态框"
  aria-pressed={isActive}
>
  <XMarkIcon className="w-6 h-6" />
</button>
```

---

## 12. 性能优化

### 12.1 图片优化

```tsx
// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="FlowMind Dashboard"
  width={1200}
  height={800}
  priority
  placeholder="blur"
/>
```

### 12.2 代码分割

```tsx
// 懒加载非关键组件
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 12.3 避免布局偏移

```tsx
// 为图片和动态内容预留空间
<div className="aspect-video bg-gray-100">
  <img src="..." alt="..." className="w-full h-full object-cover" />
</div>
```

---

## 13. 暗色模式（未来支持）

虽然当前版本不默认支持暗色模式，但预留了扩展能力：

```css
/* 预留暗色模式变量 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1F2937;
    --color-text: #F9FAFB;
    --color-primary: #A78BFA;
  }
}
```

---

## 14. 交付前检查清单

在交付任何前端代码前，必须确认：

### 视觉质量
- [ ] 无 Emoji 作为图标（使用 SVG）
- [ ] 所有图标来自统一图标集（Heroicons/Lucide）
- [ ] 品牌 Logo 正确（来自 Simple Icons）
- [ ] 悬浮状态不引起布局偏移
- [ ] 直接使用主题色（bg-primary）而非 var() 包装

### 交互体验
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] 悬浮状态提供清晰视觉反馈
- [ ] 过渡动画流畅（150-300ms）
- [ ] 键盘导航焦点状态可见

### 明暗模式
- [ ] 浅色模式文本对比度充足（4.5:1 最低）
- [ ] 玻璃/透明元素在浅色模式下可见
- [ ] 边框在两种模式下都可见
- [ ] 交付前测试两种模式

### 布局响应
- [ ] 浮动元素与边缘有适当间距
- [ ] 内容不被固定导航栏遮挡
- [ ] 在 375px、768px、1024px、1440px 响应正常
- [ ] 移动端无横向滚动

### 无障碍
- [ ] 所有图片有 alt 文本
- [ ] 表单输入有标签
- [ ] 颜色不是唯一指示器
- [ ] 尊重 `prefers-reduced-motion`

---

## 15. 开发工具配置

### 15.1 Tailwind 配置

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        cta: '#F97316',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

### 15.2 ESLint 规则

```json
{
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error"
  }
}
```

---

## 16. 参考资源

### 设计工具
- [Figma 设计稿](https://figma.com/flowmind) (待创建)
- [Storybook 组件库](http://localhost:6006) (待搭建)

### 设计系统
- [设计系统主文件](../design-system/flowmind/MASTER.md)
- [页面特定覆盖](../design-system/flowmind/pages/)

### 外部资源
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Heroicons 图标库](https://heroicons.com/)
- [Ant Design 组件库](https://ant.design/)
- [WCAG 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

**文档维护**  
v1.0 (2026-03-02): 初始版本，基于 ui-ux-pro-max 设计系统生成
