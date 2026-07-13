# PVC 产品页优化 — 背景信息补充

## 1. 当前 SEO 阶段（关键）

- 页面刚被 Google 索引，GSC 数据显示：
  - 最近一周展示量：73（上周：2，涨了 3,550%）
  - 点击次数：0
  - 平均排名：43.7（上周：70，在快速爬升中）
  - 展示量覆盖率：美国 20、英国 15、印度 7
- **还没进入前三页，CTR 必然为 0**，当前目标不是转化率，而是**把排名推进前 20**
- 因此现阶段需要：关键词密度高、内容深度大、语义覆盖广，不能过度精简

## 2. 流量来源关键词（GSC 真实数据）

排名共抓到了 16 个查询词，展示量前 10：
1. pvc membranes — 7 展示
2. pvc waterproofing membrane specifications — 5 展示
3. pvc membrane — 4 展示
4. pvc waterproofing membrane — 3 展示
5. pvc waterproofing — 3 展示
6. pvc roof waterproofing — 2 展示
7. pvc water resistant factory — 2 展示
8. polyvinyl chloride waterproof manufacturer — 2 展示
9. pvc water resistant manufacturer — 2 展示
10. pvc waterproofing system — 1 展示

**关键信号**："specifications"、"factory"、"manufacturer"、"roof"、"system" 是搜索用户的真实意图词。

## 3. 商业模式

- **天元防水（Tianyuan Waterproof）**，品牌名 TY-SHIELD™
- 工厂位于山东潍坊，中国防水材料产业集群
- 纯 B2B 出口：面向全球防水材料经销商、工程承包商、项目采购方
- 目标市场：美国、英国、欧洲、中东、东南亚
- 提供 OEM 贴牌、定制规格、FOB/EXW 报价

## 4. 技术栈限制

- Astro 静态站点生成器，Vercel 托管
- 产品页统一模板 `src/pages/products/[slug].astro`，所有产品共享
- 每个产品是一个 Markdown 文件 + YAML frontmatter，结构固定：
  - title, hero_description, hero_tags, gallery, spec_table
  - quick_facts, applications, features, technical_data
  - application_guide, packaging, loading_data, downloads
  - related_products, faqs
  - Markdown body 内容区（支持 H2/H3/列表/链接等）
- **模板的 H2 标题是写死的**（如 "Quick Specifications"、"Product Overview"、"Technical Specifications"），改一个会影响所有 25 个产品页
- 无法轻易添加新的 UI 区块（如对照表），除非在 frontmatter 里定义新字段 + 改模板

## 5. 已完成的最优化

上一轮刚做的改动：
- Title 从 "PVC Membrane for Tunnel & Underground Waterproofing" 扩展为 "PVC Waterproofing Membrane Manufacturer & Supplier | Factory Direct Specifications"
- Hero Description 扩展覆盖 roofing/tunnels/underground/systems/manufacturer/specifications
- Body 新增 3 个 H2 段落："PVC Waterproofing Membrane Specifications"、"PVC Roof Waterproofing Systems"、"Manufacturer Supply & Factory Advantages"
- FAQ 从 3 条扩到 7 条
- 模板 H2 从 "Technical Data" 改为 "Technical Specifications"，并添加了 id 锚点

## 6. 已知待修复问题（来自你的指南）

- **Roofing system 描述有事实错误**：将 "机械固定" 和 "热风焊接" 描述为互斥关系，实际上机械固定是 attachment method，热风焊接是 seam method，两者是结合使用的
- **"GB12952-2011 Certified" 措辞**：标准 ≠ 认证，应改为 "Applicable Standard: GB 12952-2011"
- **JSON-LD 里 lowPrice: "0"**：语义上表示免费，如果无公开定价应不包含 offer
- **部分声明需要限定范围**：如 "Root Resistant" 不是所有型号都具备、"50-Year Durability" 应区分地上/地下

## 7. 产品页技术架构参考

模板共享字段清单（所有产品页统一结构）：
```
Hero → Quick Specs → Product Overview (body + Quick Facts) → Applications
→ Key Benefits → Technical Specifications → Installation Guide
→ Packaging & OEM → Downloads + Related Products → FAQ → Bottom CTA
```

body 内容区（Markdown）可以自由添加 H2/H3/段落/列表/表格，这是**唯一可以灵活增改的区**。
新增 UI 区块需要同时改 frontmatter 和模板，成本较高。

## 8. 期望输出

基于以上背景，请重新评估你的建议，重点关注：
1. 哪些建议适合当前 SEO 爬升阶段（排名 43 → 前 20）？
2. 哪些技术修正必须立即做（事实错误 / 合规风险）？
3. 哪些增量内容可以在 Markdown body 区实现（不碰模板）？
4. 是否需要拆分为 P0（立即）/ P1（本迭代）/ P2（Blog 集群）三个优先级？
