# 天元防水独立站：产品中心（列表页）代码工程化规范

本规范定义了“产品中心/列表页”的技术实现标准。GPT 生成代码时必须确保其逻辑符合 Astro 的静态生成机制及 B2B 站点的分类导向需求。

---

## 一、 页面架构契约 (Page Layout Structure)

页面必须采用 **“侧边栏 + 内容区”** 的双栏结构：

1.  **容器**: `max-w-7xl mx-auto px-4`。
2.  **侧边栏 (Sidebar - Left, 3 Cols)**: 
    -   必须包含 `Product Overview` 标题。
    -   分类列表使用 `nav` 元素，当前激活分类需有 `bg-slate-100` 或 `text-brand` 高亮。
    -   父子分类需体现层级缩进。
3.  **主内容区 (Main Content - Right, 9 Cols)**:
    -   **页头**: 显示当前分类名及产品总数 `All Products (Count)`。
    -   **排序**: 右侧放置 `Sort by` 下拉菜单。
    -   **网格**: 使用 `grid-cols-1` (Mobile) -> `grid-cols-2` (Tablet) -> `grid-cols-3` (Desktop)。
    -   **分页**: 底部居中放置 `Pagination` 组件。

---

## 二、 数据读取与过滤规范 (Data & Logic)

GPT 编写代码时必须使用以下 Astro 数据获取模式：

```typescript
// 示例：获取产品并按分类过滤
const allProducts = await getCollection('products');
const { category } = Astro.params;

// 过滤逻辑：如果 URL 中有 category，则只显示该分类产品
const filteredProducts = category 
  ? allProducts.filter(p => p.data.category === category)
  : allProducts;

const totalCount = filteredProducts.length;
```

---

## 三、 产品卡片规范 (Product Card UI)

每个产品卡片必须包含以下元素，且样式需统一：

-   **容器**: `group` 类（用于悬停效果）、`bg-white`、`rounded-2xl`、`border border-slate-100`、`shadow-sm`。
-   **图片区**: `aspect-[4/3]` 比例，`overflow-hidden`，悬停时图片微放 (`group-hover:scale-105`)。
-   **分类标签**: 图片上方或标题上方显示分类名，字号 `text-[10px]`，`uppercase`，颜色 `text-slate-400`。
-   **标题**: `text-slate-900`，`font-bold`，限制最多 2 行 (`line-clamp-2`)。
-   **操作区**: 底部显示 `Product Specs ->` 链接，颜色为 `text-brand`，悬停时有位移效果。

---

## 四、 交互与响应式规范 (UX & Responsive)

1.  **响应式切换**:
    -   在 `lg` 断点以下，左侧 `Sidebar` 必须隐藏，或转化为顶部的 `Horizontal Scroll`（横向滚动）分类条。
    -   标题区 `Product Center` 在移动端需居中。
2.  **空状态处理**:
    -   若分类下无产品，需显示 `No products found in this category`，并提供 `View All Products` 按钮。
3.  **性能**:
    -   图片必须使用 `loading="lazy"`。
    -   分类切换链接必须使用标准的 `<a>` 标签以支持 SEO 爬取。

---

## 五、 样式变量契约 (Tailwind Tokens)

-   **分类激活态**: `text-brand font-bold border-l-4 border-brand`。
-   **分页按钮**: `rounded-lg w-10 h-10 border border-slate-200 flex items-center justify-center`。
-   **排序下拉框**: `bg-slate-50 border-none rounded-xl px-4 py-2 text-sm`。
