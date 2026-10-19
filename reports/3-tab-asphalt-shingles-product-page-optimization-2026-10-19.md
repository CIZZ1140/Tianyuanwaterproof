# 3-Tab 沥青瓦详情页优化记录（2026-10-19）

目标页：`/products/3-tab-asphalt-shingles-wholesale/`。本记录供内部运营和采购复核；来源和核实边界不展示在买家详情页。

## 本次具体改动

| 项目 | 原页 | 新页 | 目的与取舍 |
| --- | --- | --- | --- |
| SEO Title | `Classic 3-Tab Asphalt Shingles` | `3-Tab Asphalt Shingles \| 1000 × 333 mm Roof Tiles` | 把核心品类和搜索中的尺寸需求放进标题；精准流量更强，但标题更长，Google 可能截断或改写。 |
| H1 | `3-Tab Asphalt Shingles` | `3-Tab Asphalt Shingles` | 原主标题已准确，保留可减少不必要的波动；不把 wholesale、factory 等词堆叠在 H1。 |
| Meta description | `Factory-direct 3-tab asphalt roofing shingles with fiberglass carrier and mineral surface. Cold installation, wholesale pricing and OEM support.` | `Source 3-tab asphalt shingles in 1000 × 333 mm strips. Compare 2.6 mm thickness, 21-piece bundles, 3.1 m² coverage and project indices; request a bulk quote.` | 让搜索摘要直接回答买家看重的尺寸、厚度、装箱、覆盖与询盘动作；取消没有标价支撑的“wholesale pricing”。搜索引擎可能选用其他摘要。 |
| 首屏 | 泛化的“经济耐用”、过期标准标签和卷材式卡片 | 单层三片式、1000 × 333 mm、21 片／约 3.1 m² 三个卡片；保留报价、WhatsApp、索取 TDS | 首屏先解决产品辨型和采购量计算。特定规格更有筛选力，但不同供货型号需要重新核对。 |
| 快速规格 | GB/T 20474-2006、2.6–3.0 mm、25–28 kg／捆、宽泛用途 | 八项结构／尺寸／厚度／暴露面积／捆装／现行标准参考／屋面系统；2.6±0.1 mm、21 片、约 3.1 m²、27±1 kg | 便于与 RFQ 对比；把现行标准名称与当前批次符合性分开。 |
| 技术表 | 600 N/50 mm、-10°C、Class F、Class A 以及“典型值待确认”混在五列表 | 仅此页采用四列表“Specification / Unit / Condition or Basis / Project Index”；列 10 项物理和性能指标 | 买家仍看得到数字，但不会把别家或旧手册指标误读成天元批次实测、风级或防火认证。性能数值须由当前报价型号的 TDS／报告确认。 |
| 正文和模块 | 公建、医院、所有气候、30 年式措辞、隔声等未证实优势 | 围绕单层 3-tab 与 laminated 差异、覆盖面积与损耗、屋面系统、颜色样板、报询盘所需信息重写概览、四组应用／优势、施工和 FAQ | 内容服务采购与项目设计，减少同品类模板雷同；不再使用“所有项目都适合”的话术。 |
| 下载和物流 | 两个 `#` 假 PDF，2000–2500 m²／柜、27–28 吨／柜 | 删除假下载和未经供应方案确认的装柜承诺；保留真实索取 TDS 与出口报价入口 | 避免无法下载和物流误导。 |
| 图片 | 800 × 800、约 188 KB 的 WebP 三片式产品主图，加一张 `/placeholder.webp` | 保留单张真实主图、删除占位副图、更新图片说明 | 主图能显示条形与三片式轮廓，当前质量可用；如要展示颜色／施工／包装，需要实际供货照片或用户认可的设计图。无新增 R2 上传。 |
| 框架和 URL | 统一 Astro 产品详情框架；现有 URL | 框架与 URL 保持，模板只对本页补三张首屏卡与四列表格 | 不影响其他产品页布局，不引入重定向。 |

## 厂方资料、参数采用方式与风险

- `C:\Users\CIZZ\Desktop\Catalog\Tianyuan Catalog 2026.pdf` 第 6 页的“三维彩色改性沥青防水卷材”是不同的自粘装饰卷材，并非本页三片式沥青瓦；其数字未移入本页。
- `C:\Users\CIZZ\Desktop\潍坊天元防水材料\catalog\E-catalogues.pdf` PDF 第 9 页（印刷页 11–12）有 DONGSHENG 品牌“Plane asphalt shingles”旧表：纵／横拉伸 500／400 N/50 mm、90°C 无滑移流淌滴落、10°C 弯折无裂纹、撕裂 ≥9 N、钉拔出 ≥75 N。该页同时混有其他金属瓦文案，不能当作天元当期 TDS；仅把可识别的平面沥青瓦数字列为采购比较指标。没有把旧手册的 30 年保修、环保、屋顶坡度等宣称移用。
- `C:\Users\CIZZ\Desktop\潍坊天元防水材料\catalog\天元英文图册\tianyuan catalog.pdf` 未找到该产品独立技术表。三份资料都没有可核实的当前天元批次检测结果。
- [国家标准信息平台](https://std.samr.gov.cn/gb/search/gbDetailed?id=DAESz9OjbGc%3D&mode=p)显示 GB/T 20474-2015 现行，并全部替代 2006 版。因此页面以 2015 版作询盘标准参考，而未声称已完成该标准检测或认证。
- 1000 × 333 mm、2.6±0.1 mm、21 片／约 3.1 m²、27±1 kg，由下列多家国内同类产品交叉核对，作为本次采购规格方案；实际天元供应配置、颜色、暴露长度、每捆重量及报告需要人工确认。每片约 0.148 m² 与 21 片约 3.1 m²一致；148 mm 暴露是对应覆盖计算的近似值，不是所有安装系统的通用要求。
- **特别风险：**页面的 ≥500／≥400 N/50 mm、90°C、10°C、≥9 N、≥75 N 是历史目录中的选型指标，并非天元当前产品的测试结论；本页没有 Class A、Class F、抗藻、保修期限或寿命的归属宣称。

## 多渠道同类产品调研

**国内同行独立站 4 家：**

1. [河北 Sinostar 3 Tab Shingle](https://www.hbsinostar.com/roofing-sheet/asphalt-shingles/3-tab-shingle.html)：1000 × 333 mm、21 片、0.148 m²／片及现行标准写法；没有移用其 CE／SGS、30 年保修。
2. [Sangobuild 3 Tab Asphalt Shingle](https://www.sangobuild.com/asphalt-shingle/3-tab-asphalt-shingle.html)：1000±3 × 333±3 mm、2.6±0.1 mm、21 片／3.1 m²、27±1 kg，也用于核查买家关心的性能字段；没有移用其温度范围和品牌检测值。
3. [SKW Roof 3 Tab](https://skwroof.com/asphalt-shingles/3-tab-shingles/)：单层定位、21 片／3.1 m²、约 28 kg 和颜色展示方式；没有移用其 30 年、风速或防火话术。
4. [Cailin 沥青瓦目录的 3-Tab 页](https://fr.cailinroofing.com/uploads/Cailin-Asphalt-Shingle-Catalog4.pdf)：1000±3 × 333±3 mm、2.6±0.1 mm、27±1 kg、21 片／3.1 m²；没有借用其每柜装量。

**国际知名同行 3 家：**

1. [GAF Royal Sovereign](https://www.gaf.com/en-us/roofing-materials/residential-roofing-materials/shingles/royal-sovereign)：观察其尺寸／暴露／每平方用量、标准与认证的分层展示；其 Class A／F/H 为 GAF 特定产品，不属于本页。
2. [Owens Corning Supreme 数据表](https://champion.owenscorning.com/downloaddmsassets/2147485351.pdf)：参考三片式产品技术文件的字段层级和施工资料入口；其英制规格没有转换后套用。
3. [IKO Marathon Plus AR 产品及 TDS](https://www.iko.com/na/product/marathon-plus-ar-traditional-3-tab-shingles/)：1000 × 336 mm、143 mm 暴露、21 片／3.0 m²，证明“同为三片式”也可能覆盖不同，故本页明确暴露条件；未借用其等级、保修、抗藻宣称。

**国际区域／中型同行 3 家：**

1. [TAMKO Elite Glass-Seal](https://www.tamko.com/elite-glass-seal)及[官方数据表](https://www.tamko.com/docs/default-source/data-sheets/TAMKO-3-tab-elite-glass-seal-data-sheet-%28joplin%29.pdf)：参考玻纤胎、沥青涂层和矿物粒料的结构表达，以及品牌评级需要完整文件支持。
2. [Malarkey Dura-Seal AR 技术表](https://www.malarkeyroofing.com/product_detail/dura-seal)：参考 1000 × 337 mm、143 mm 暴露及产品／系统条件的区分；聚合物配方和产品评级均未借用。
3. [Atlas GlassMaster 产品资料](https://www.atlasroofing.com/img/Literature/Technical_Bulletin-Asphalt_Shingle_Product_Evaluation_Report.pdf)：观察三片式玻纤沥青瓦与屋面基层、垫层、固定方式一起提交的评估框架；该资料较旧，仅供布局研究，未用于本页参数。

**专业技术资料及电商：**上述 GAF、IKO、TAMKO、Malarkey 的官方 TDS／数据页用于识别产品规格、屋面系统和评级的边界；国家标准信息平台用于核对标准状态。[Alibaba 国际站同类供应页](https://www.alibaba.com/product-detail/China-Manufacturer-Tejas-Asfalticas-Windproof-Roof_1601378183694.html)与[中国制造网三片式产品页](https://mingchen01.en.made-in-china.com/product/LFhaYcbHHSGt/China-Classic-3-Tab-Asphalt-Roof-Shingles-Affordable-Reliable.html)用于观察采购询问的颜色、包装、数量、目的港字段。Alibaba 示例甚至把包装写作“2 pcs／bundle”，显示电商字段可能错误；其价格、评分、评论、证书和质保未复制。行业知识用于校验 21 × 0.148 ≈ 3.1、屋面面积与订购面积不相同，以及抗风／防火需要看成套屋面构造。

## SEO / SEM 的做法、优缺点和影响

1. **关键词与 URL。** 旧 URL 和 canonical 保持，避免迁移成本。Title 加入 `3-Tab Asphalt Shingles` 与 `1000 × 333 mm`；H1 保留核心产品词；Meta、首屏、规格、正文及图片说明自然覆盖 `3 tab shingle dimensions`、`fiberglass asphalt shingles`、`21 pieces per bundle`、`3.1 m² coverage`、`bulk quote`。优点是买家从搜索结果到落地页看到同一规格；代价是广义屋面知识查询可能匹配减少，且搜索引擎可改写标题或摘要。
2. **站内区分。** 本页强调平整、规则的单层三片式轮廓和捆装覆盖；相关入口引导看 laminated 与 artistic。避免将同组不同瓦型写成相同优势。站内相关推荐更符合在三种外观中选型的买家路径。
3. **询盘与广告落地。** 保留报价、WhatsApp、TDS 三个行动入口，不加假价格或评分。面向 `3 tab asphalt shingles supplier`、`3 tab roofing shingles wholesale`、`1000x333 asphalt shingles` 等高意向词可先小预算试投；排除维修教程、二手／零售、单纯“瓦寿命”等低意向查询。优点是 RFQ 可包含面积、颜色、包装、目的港和技术文件要求；缺点是覆盖范围较窄，需要后续以有效询盘而非 CTR 单独评价。本轮没有修改 Google Ads 账户、文案、出价或预算。
4. **当前可见数据。** 天元 GSC 以本 URL 精确筛选 2026-07-17 至 2026-10-16：15 次展示、0 点击、CTR 0%、平均排名 23.3；可见查询包括 `3 tab asphalt shingle`、`3 tab shingle dimensions` 和 `3 tab roof tiles`。样本非常少，不能从中推断改版后排名或询盘改善。后续看同 URL 的查询、展示、点击、有效线索和报价转化。现有 B2B Product JSON-LD 保持无虚构价格与评论。

## 验证和仍需人工确认的外部步骤

- `npx astro build` 成功生成 70 个静态页面；`git diff --check` 通过。构建仍出现本地 Astro 内容缓存对本 slug 的 duplicate id 提示，但输出路径只有一份且预览标题、参数和四列表格正确；需在后续缓存清理或 CI 干净构建关注是否复现。
- 本地预览：<http://127.0.0.1:4327/products/3-tab-asphalt-shingles-wholesale/>。已核对首屏、规格、表格、相关产品、询价和主图；主图为现有 R2 WebP，800 × 800、约 188 KB，无新图上传。
- 报价和项目提交前，人工从当前供货方取得：型号专属 TDS／检测报告，五项旧目录性能指标及测试方法的适用性、GB/T 20474-2015 项目符合性、实际片型／厚度／颜色／每捆片数／重量／覆盖、包装和柜装计划，以及目的地需要的风／火等级和完整屋面系统文件。
- 图片阶段已删除灰色占位副图，保留现有主图。后续若提供实际颜色板、整屋安装、包装照片，再讨论排序、授权与 WebP／R2 更新。
