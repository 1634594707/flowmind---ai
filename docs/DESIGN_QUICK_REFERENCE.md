# FlowMind 设计系统快速参考

**版本**: v1.0  
**日期**: 2026-03-02

---

## 🎨 色彩速查

### 主色调
```css
--color-primary: #7C3AED;    /* 紫色 - 品牌主色 */
--color-secondary: #A78BFA;  /* 浅紫 - 辅助色 */
--color-cta: #F97316;        /* 橙色 - 行动号召 */
--color-background: #FAF5FF; /* 浅紫背景 */
--color-text: #4C1D95;       /* 深紫文本 */
```

### Tailwind 类名
```tsx
// 主色
bg-purple-600 text-purple-600 border-purple-600

// 辅助色
bg-purple-400 text-purple-400

// 强调色
bg-orange-500 text-orange-500

// 背景
bg-purple-50

// 文本
text-purple-900
```

---

## 📝 字体速查

### 字体家族
```css
font-heading: 'Poppins'    /* 标题 */
font-body: 'Open Sans'     /* 正文 */
```

### 字体尺寸
```tsx
text-xs    // 12px - 标签
text-sm    // 14px - 次要文本
text-base  // 16px - 正文
text-lg    // 18px - 强调
text-xl    // 20px - 小标题
text-2xl   // 24px - 卡片标题
text-3xl   // 30px - 页面标题
text-4xl   // 36px - 大标题
text-5xl   // 48px - Hero 标题
```

### 字重
```tsx
font-light    // 300
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

---

## 📏 间距速查

```tsx
p-1   // 4px
p-2   // 8px
p-4   // 16px - 标准内边距
p-6   // 24px - 区块内边距
p-8   // 32px - 大间距
p-12  // 48px - 区块外边距
p-16  // 64px - Hero 区域
```

---

## 🎭 阴影速查

```tsx
shadow-sm  // 微阴影
shadow-md  // 卡片、按钮
shadow-lg  // 悬浮卡片
shadow-xl  // 模态框
shadow-2xl // 全屏模态
```

---

## 🔘 按钮速查

### 主要按钮
```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
  主要按钮
</button>
```

### 次要按钮
```tsx
<button className="bg-transparent hover:bg-purple-50 text-purple-600 font-semibold px-6 py-3 rounded-lg border-2 border-purple-600 transition-all duration-200 cursor-pointer">
  次要按钮
</button>
```

### 文本按钮
```tsx
<button className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 transition-colors duration-200 cursor-pointer">
  文本按钮
</button>
```

---

## 🃏 卡片速查

### 标准卡片
```tsx
<div className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
  {/* 内容 */}
</div>
```

### Glassmorphism 卡片
```tsx
<div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer">
  {/* 内容 */}
</div>
```

---

## 📝 输入框速查

```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 outline-none"
  placeholder="输入内容"
/>
```

---

## 🏷️ 标签速查

```tsx
// 状态标签
<span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
  已完成
</span>

<span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
  进行中
</span>

<span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
  待处理
</span>

<span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
  已延期
</span>
```

---

## 🎬 动画速查

### 过渡时长
```tsx
duration-150  // 快速
duration-200  // 标准
duration-300  // 慢速
```

### 常用动画
```tsx
// 悬浮效果
hover:-translate-y-1 hover:shadow-lg

// 缩放
hover:scale-105

// 淡入淡出
transition-opacity

// 颜色过渡
transition-colors
```

---

## 📱 响应式断点

```tsx
// 移动端优先
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
```

### 断点值
```
sm:  640px  // 手机横屏
md:  768px  // 平板
lg:  1024px // 笔记本
xl:  1280px // 桌面
2xl: 1536px // 大屏
```

---

## ♿ 无障碍速查

### 焦点状态
```tsx
focus:outline-none
focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
```

### 键盘导航
```tsx
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
```

### 减少动画
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚫 禁止使用

### ❌ Emoji 作为图标
```tsx
// ❌ 错误
<span>🚀</span>

// ✅ 正确
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
<RocketLaunchIcon className="w-6 h-6" />
```

### ❌ 缺少 cursor-pointer
```tsx
// ❌ 错误
<div onClick={...}>点击我</div>

// ✅ 正确
<div onClick={...} className="cursor-pointer">点击我</div>
```

### ❌ 布局偏移的悬浮效果
```tsx
// ❌ 错误
hover:scale-110  // 会导致布局偏移

// ✅ 正确
hover:-translate-y-1  // 不影响布局
```

---

## 📦 常用图标

```tsx
import {
  // 通用
  SparklesIcon,        // AI/智能
  RocketLaunchIcon,    // 启动/快速
  CubeIcon,            // 模块/组件
  
  // 状态
  CheckCircleIcon,     // 成功/完成
  ExclamationTriangleIcon, // 警告
  XCircleIcon,         // 错误
  
  // 导航
  HomeIcon,            // 首页
  FolderIcon,          // 项目/文件夹
  DocumentTextIcon,    // 文档
  Cog6ToothIcon,       // 设置
  
  // 操作
  PlusIcon,            // 添加
  PencilIcon,          // 编辑
  TrashIcon,           // 删除
  MagnifyingGlassIcon, // 搜索
  
  // 用户
  UserIcon,            // 用户
  UserGroupIcon,       // 团队
  BellIcon,            // 通知
} from '@heroicons/react/24/outline'
```

---

## 🎯 快速复制模板

### Hero 区域
```tsx
<section className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-purple-50 via-white to-orange-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        你的标题
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        你的副标题
      </p>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg">
        开始使用
      </button>
    </div>
  </div>
</section>
```

### 功能卡片网格
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
      <SparklesIcon className="w-6 h-6 text-purple-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      功能标题
    </h3>
    <p className="text-gray-600">
      功能描述
    </p>
  </div>
</div>
```

### 统计卡片
```tsx
<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
      <FolderIcon className="w-6 h-6 text-purple-600" />
    </div>
    <span className="text-sm font-medium text-green-600">+12%</span>
  </div>
  <h3 className="text-gray-600 text-sm mb-1">总项目</h3>
  <p className="text-3xl font-bold text-gray-900">24</p>
</div>
```

---

## 📚 完整文档链接

- [设计系统主文件](../design-system/flowmind/MASTER.md)
- [前端设计规范](./FRONTEND_DESIGN.md)
- [页面设计方案](./PAGE_DESIGNS.md)
- [组件库文档](./COMPONENT_LIBRARY.md)

---

**快速参考 v1.0** - 2026-03-02
