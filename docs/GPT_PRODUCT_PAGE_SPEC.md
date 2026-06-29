# 天元防水独立站：产品详情页代码规范 (v1.0)

本规范旨在确保 GPT 生成的 `Astro` 代码能够直接运行，并与天元独立站现有架构及设计风格（UI/UX）保持 100% 一致。

---

## 1. 技术栈与环境 (Technology Stack)
- **框架**: Astro (Static Generation)
- **样式**: Tailwind CSS (JIT mode)
- **交互**: Vanilla JS (原生 JavaScript)。**禁止引入 React, Vue 或 Alpine.js**。
- **图标**: 使用 SVG 路径（内联）或 Lucide 图标的 SVG 形式。
- **图片优化**: 优先从 `src/assets/images/optimized/` 读取 WebP 图片，若不存在则降级使用 `/public/images/`。

---

## 2. 视觉一致性 (Visual Identity)
必须使用 `tailwind.config.mjs` 中定义的颜色：
- **主色 (Brand Blue)**: `text-brand`, `bg-brand`, `border-brand` (#005bd8)
- **深色 (Navy Blue)**: `bg-navy`, `text-navy` (#06284c)
- **边框线**: `border-line` (#dbe7f5)
- **强调色**: `text-accent` (#ff7a1a)
- **圆角规范**: 卡片使用 `rounded-3xl` 或 `rounded-2xl`，按钮使用 `rounded-xl`。

---

## 3. 数据 Schema (Frontmatter)
生成的 Astro 模板需适配以下 Markdown 属性：
```yaml
title: "Product Title"
description: "Brief marketing description"
category: "asphalt-membranes"
image: "/images/main-product.webp"
gallery: 
  - "/images/thumb1.webp"
  - "/images/thumb2.webp"
specs:
  - label: "Material"
    value: "SBS Modified Bitumen"
  - label: "Thickness"
    value: "3mm / 4mm"
priceRange: "$2.5 - $4.8 / SQM"
minOrder: "1000 SQM"
```

---

## 4. 关键 UI 组件逻辑 (Component Logic)

### A. 图片库 (Gallery Interface)
- **左侧**: 主图区 + 下方 4-5 个缩略图。
- **交互**: 点击缩略图，主图区 `<img>` 的 `src` 实时替换。

### B. 询盘与转化 (Conversion)
- **Inquiry 按钮**: 锚点指向底部的 `#inquiry` 或弹出侧边栏，背景色为 `bg-brand`。
- **WhatsApp 按钮**: 固定显示 `8615263640998` 的联系链接，背景色为绿色 `bg-green-600`。
- **Formspree ID**: `mzdqdpwd`。

### C. 标签页切换 (Tabs System)
- **结构**: Description | Specification | Case Studies | FAQ。
- **逻辑**: 使用 `data-tab` 属性和原生 JS 的 `classList.toggle('hidden')` 实现切换。
- **内容**: 
  - `Description`: 渲染 Markdown 的 `<Content />`。
  - `Specification`: 渲染 `specs` 数组。

### D. 侧边栏 (Sidebar)
- 包含 "Hot Products" 模块，展示从 `products` collection 中随机选取的 3-4 个产品。

---

## 5. 提示词建议 (Prompt Example)
"Rewrite the product detail page (`src/pages/products/[slug].astro`) following the specs in `docs/GPT_PRODUCT_PAGE_SPEC.md`. Ensure the layout matches the high-end B2B style: Breadcrumbs at top, 2-column hero (Gallery left, Pricing/Specs/CTA right), and a Tabbed content area below with a sidebar."
