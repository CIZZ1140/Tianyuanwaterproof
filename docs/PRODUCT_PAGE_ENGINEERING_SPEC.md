# 天元防水独立站：产品详情页代码工程化规范 (B2B Standard)

本规范定义了在 `Astro` 框架下开发产品详情页的技术标准。GPT 在生成代码时必须严格遵守本契约，以确保代码的健壮性、SEO 友好度及 UI 一致性。

---

## 一、 数据结构契约 (Data Frontmatter Schema)

产品数据必须遵循以下 YAML 结构，代码逻辑应基于这些字段进行解构：

```yaml
# 核心信息
title: string           # 产品全名
sku: string             # 产品唯一编码
priceTiers:             # B2B 阶梯定价 (必填)
  - range: "100-500"
    price: "$4.50"
  - range: "501-1000"
    price: "$4.20"
  - range: ">1000"
    price: "$3.90"

# B2B 属性
moq: string             # 最小起订量 (e.g. "500 SQM")
leadTime: string        # 交期 (e.g. "15 Days")
shipping: string        # 运输条款 (e.g. "FOB Qingdao")

# 多媒体与规格
mainImage: string       # 主图路径
gallery: string[]       # 轮播图路径数组
variations:             # 规格变体 (可选)
  - name: "Color"
    options: ["Grey", "Black", "Green"]
  - name: "Thickness"
    options: ["3mm", "4mm"]
```

---

## 二、 页面组件树规范 (Component Architecture)

代码必须按照以下模块化顺序编写（自上而下）：

1.  **`<Breadcrumbs />`**: `Home > Category > Product Name`。
2.  **`<ProductHero />` (Grid: 12 Cols)**:
    -   **Left (6 Cols)**: `MediaGallery`（主图 + 缩略图轮播）。
    -   **Right (6 Cols)**: 
        -   `Header`: 标题、评分、询盘数。
        -   `PricingPanel`: **阶梯价表格 (Price Table)** —— 必须使用 `grid` 或 `table` 展示 range 与 price。
        -   `Attributes`: 展示 MOQ、Lead Time、Shipping。
        -   `VariationSelector`: 规格选择器（点击效果需用原生 JS 处理）。
        -   `ActionButtons`: "Contact Supplier" (Primary) 与 "Chat Now" (Secondary)。
3.  **`<TabsContent />`**:
    -   固定标签：`Overview`, `Specification`, `Company Profile`, `Shipping & Payment`。
4.  **`<InquirySticky />`**: 移动端吸底的询盘按钮。

---

## 三、 样式与 UI 规范 (Tailwind CSS)

-   **容器限制**: 最大宽度 `max-w-7xl`，水平居中 `mx-auto`。
-   **价格高亮**: 价格文字使用 `text-brand` (品牌蓝) 或 `text-accent` (强调橘)，字号不小于 `text-2xl`。
-   **阶梯价表格样式**: 
    -   背景色: `bg-slate-50`。
    -   分割线: `border-slate-200`。
    -   高亮态: 当前量级对应的价格需有 `border-brand` 边框。
-   **按钮规范**: 
    -   主按钮: `bg-brand text-white font-bold rounded-full px-8 py-4`。
    -   次按钮: `border border-brand text-brand hover:bg-blue-50`。

---

## 四、 交互行为规范 (Logic & Scripts)

1.  **图片切换**: 
    -   缩略图必须带有 `onmouseover` 或 `onclick` 事件，通过 ID 选中主图 `img` 元素并修改 `src`。
2.  **Tab 切换**: 
    -   使用 `data-tab-target` 属性。
    -   脚本需确保切换时隐藏所有内容块并移除激活状态样式。
3.  **询盘传参**: 
    -   点击按钮必须自动将 `entry.data.title` 和 `entry.data.sku` 填入询盘表单的隐藏域中。

---

## 五、 禁止行为 (Strictly Forbidden)

-   ❌ **禁止** 使用第三方轮播库（如 Swiper），除非明确要求。必须使用 CSS Snap 或 原生 JS 实现。
-   ❌ **禁止** 将样式写在 `<style>` 标签中，必须全部使用 Tailwind Utility Classes。
-   ❌ **禁止** 硬编码产品信息，所有内容必须从 `Astro.props` 获取。
