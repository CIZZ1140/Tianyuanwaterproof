# P0 SEO 批次核对记录

日期：2026-10-13。基线：9b1a41c。范围：现有 60 个已跟踪文件的未提交改动。

## 核对结论

- 原始 diff：3378 增 / 2712 删；忽略行尾空白：821 增 / 155 删。部分内容文件有混合行尾，不能把大段行尾差异误认为正文重写。
- 39 个内容文件中，38 个只涉及 title、seoTitle、description 或 meta_description；金属屋面涂料页还增加 FAQ 和正文。
- 其余 21 文件涉及元数据、结构化数据、链接、模板和脚本；其中产品 schema、安装指南正文属于独立改造。
- 未跟踪的既有报告、audit 等不纳入 SEO 批次，不删除、不覆盖。本次新增的本记录独立保留。

## 验证

- npm run build：通过，70 页面。INDEXNOW_ENABLED=0，69 个 sitemap URL 未向外部提交。
- 构建 HTML：全部标题 <=60 字符；69 个可索引页描述 <=160 字符。404 描述 193 字符，但 robots=noindex, follow。标题、描述、canonical 均存在；JSON-LD 全部可以解析。这里只验证 JSON 语法，不代表外部富媒体资格或全部声明已获证实。
- SBS：标题 54 字符，描述 151 字符，og:type=product。
- 13 个博客文章标题均 <=60。basement/foundation 文章使用自动省略号；其他长标题由 seoTitle 处理。原评审的“8 个博客长标题”已不反映当前输出。
- astro check：工作区 80 errors；隔离的 HEAD 文件检查 70 errors。既有错误包括表单元素类型、产品模板隐式 any 和根目录 clean_slug.astro 临时模板路径。
- 产品 schema 从 z.any() 收紧到 object().passthrough() 后，未显式声明的 order、image、shortTitle 等字段被推断为 unknown，产生新增类型错误。建议将产品 schema 改造留待另行处理，SEO 提交只纳入博客 seoTitle 字段；保留工作区原始 schema 改动。
- HEAD 基线检查在系统临时目录进行，使用已有 node_modules，不改工作区源码。

## 逐文件清单

“建议”尚待用户逐项讨论确定，不是已暂存的内容。哈希为核对时工作区文件 SHA-256，用于后续防止覆盖新改动。

| 文件 | 分类与具体范围 | 工作区 SHA-256 |
|---|---|---|
| `indexnow_push.js` | 配套：从构建 sitemap 获取 URL；IndexNow 改为显式启用；本次未向外部提交 URL | `308218363cd24c78c05965c0faded00c1148fc0796035cec71ff9d4dceae27cc` |
| `src/content/blog/2026-bitumen-membrane-market-price-index.md` | SEO：description、seoTitle | `0045946a59543961a466a8eedc9d755874eb6b381ce7a585a95ba537dc9f4717` |
| `src/content/blog/2026-global-sbs-membrane-market-analysis.md` | SEO：description、seoTitle | `c5a4ea3b622d5413870be23d91a24d6a48fab648c2692c5fdb351131300a629d` |
| `src/content/blog/3mm-vs-4mm-sbs-waterproofing-membrane.md` | SEO：description、seoTitle | `310274e5df63477c90961d492e54a9b18f80f9cabab24d41dab0deb9de370e62` |
| `src/content/blog/bubbles-in-sbs-membrane-torch-application-guide.md` | SEO：description | `87dbd9a14c4508ffbe7d04d39fe52d16f4aced591e1aa6f4999aee86514f5409` |
| `src/content/blog/how-many-rolls-of-sbs-membrane-fit-in-a-container.md` | SEO：description | `426a6f9aac9a55e233c8ea7fc46aaa7cca7e42f076e2e85399160728b80d3b3f` |
| `src/content/blog/how-to-read-sbs-membrane-tds.md` | SEO：description | `edfc4cc591cd515455569f5142fcf800ff51f98c1bde6e8e0f8632da44b0e59d` |
| `src/content/blog/py-g-pyg-sbs-membrane-reinforcement-guide.md` | SEO：seoTitle | `b8f871453fff7938b6c383b838a0d85b68da6ccc202cc0905bf2dbbb568e9417` |
| `src/content/blog/sbs-membrane-basement-foundation-waterproofing.md` | SEO：description | `6c254e31e43e662458c04797b4bb9375d9a1c692b5a136cc18ace9fb5067f337` |
| `src/content/blog/sbs-vs-app-modified-bitumen-membranes.md` | SEO：description、seoTitle | `4503c3ff937946298bf7f017ac779161209c7f72e5f49cad415ae2d8c1867e5b` |
| `src/content/blog/self-adhesive-vs-torch-applied-membrane-comparison.md` | SEO：description、seoTitle | `f8db0c176e49a57e8ea3edb94a26169c47f5bb93da1641e6d3d861a4d329e13c` |
| `src/content/blog/tpo-walkway-pad-selection-guide.md` | SEO：description | `42e3b50cad1785bf28bce446fe23357c42f1323db43d2fe6d89e6ca75eda28c8` |
| `src/content/blog/tunnel-waterproofing-membrane-selection.md` | SEO：description、seoTitle | `50b7129468588c9a2488c82a6ad30b2ccd5ed4064eb1d62ebcc95c05da981730` |
| `src/content/config.ts` | 混合：博客 seoTitle 支持；产品 schema 收紧。建议本轮只纳入 seoTitle，产品 schema 另行处理 | `624e2f9d07d72fda9923afc18bd5961134f2778e50fc7f67f1ddc7855551ed97` |
| `src/content/products/3-tab-asphalt-shingles-wholesale.md` | SEO：meta_description | `e578bf8d63aecda961f79971ddf4005683b47f083301b456f4b86e9acb4fdd3e` |
| `src/content/products/app-modified-bitumen-waterproofing-membrane-manufacturer.md` | SEO：title、meta_description | `636d08d9f2811fa0f54003bc1d79642c1f4c3579a916c0ee0587453cddce3e2b` |
| `src/content/products/artistic-asphalt-shingles-supplier.md` | SEO：meta_description | `0a686eb98f1588c1fd5253b5ebed94e8f0f0b7da3d27f2f64bdb060b61ff88c1` |
| `src/content/products/asphalt-roofing-felt-manufacturer.md` | SEO：title、meta_description | `1dcfe9f0e3ed495a582aec465ace0fa5f7f34f14891c371087dacb0cfe655f99` |
| `src/content/products/butyl-waterproof-sealing-tape-supplier.md` | SEO：meta_description | `31f0147f356deec451957250d3df7594695a645d578a4b993688e2758afd803c` |
| `src/content/products/epdm-waterproofing-membrane-wholesale.md` | SEO：title | `85ef7edfd5dfc32ceedc2314a9e81eaea7a11a595a07feb47cf715c844685a65` |
| `src/content/products/epoxy-floor-coating-manufacturer.md` | SEO：meta_description | `2c13813902da85797b34f5bfc6bc83da359d7d3d608c266aeac0a7ee027d9d4f` |
| `src/content/products/geotextile-fabric-manufacturer.md` | SEO：meta_description | `5976ba0b4d32e0dd14e61d71bed449586b3ede5a4a404a31ae7fe48635db6865` |
| `src/content/products/hdpe-geomembrane-liner-manufacturer.md` | SEO：meta_description | `76322b854935bc9f1a2f0066d85350930f816949b60c1581d2adbe851c7bcc86` |
| `src/content/products/laminated-asphalt-shingles-manufacturer.md` | SEO：meta_description | `1b0edfa01ff241f530eed3856f4d2fef7e2c6095dc0b61abf06e125e79929dc1` |
| `src/content/products/metal-roof-steel-structure-waterproof-coating.md` | 混合：meta_description；新增 6 条 FAQ 和完整正文。建议只纳入元描述，FAQ/正文另行确认 | `6bf09f8fd4eb5d5b220c2118b50552bfa709ad7fe105c91d0eef8cf2d49cbd2e` |
| `src/content/products/non-curing-rubber-asphalt-waterproof-coating.md` | SEO：title、meta_description | `a7d57166a76c36f44cf876453a674283bceb55c02b04320851686bfcfb87e2e8` |
| `src/content/products/polymer-cement-js-waterproof-coating-factory.md` | SEO：title、meta_description | `a23ef923ec226ee46f1282575dde9f77dd8b89f8fd413eb4e1151655acc31ff3` |
| `src/content/products/polymer-modified-asphalt-waterproof-coating.md` | SEO：title、meta_description | `5c3d36b4986e3b924de13a55c581c009d7c81624709657fe5c8dc1872cf988a6` |
| `src/content/products/polyurethane-waterproof-coating-factory.md` | SEO：title、meta_description | `8cbfd6adeccbdd90cdf1285d352657394d67f904292813f630a6aa2fcb8bf805` |
| `src/content/products/pp-pe-composite-membrane-factory.md` | SEO：title、meta_description | `616f40abf1a099f8b065ef593915886299187d0407a143b8281416c25bd28362` |
| `src/content/products/pre-applied-hdpe-membrane-supplier.md` | SEO：title、meta_description | `c03aabfe08310593709d16e488603bbf85b569e9ed7f6b219bcf8c193defd6da` |
| `src/content/products/pvc-waterproofing-membrane-manufacturer.md` | SEO：title、meta_description | `3715222d8fca3117dd9b3230b4ce7c9884214f341c964499ba5f0a03b4dd4d87` |
| `src/content/products/sbs-bitumen-waterproofing-membrane-manufacturer.md` | SEO：title、meta_description | `6c4dcae7656ce7376dfda67689986c89ff48cf7b6c179c1f4beca8e9d254a64c` |
| `src/content/products/self-adhesive-bitumen-tape-wholesale.md` | SEO：meta_description | `cb86d4e6bc0dc76ea8d02a7c336ad36a5c68717eb87ed94cff9f08e3656117ae` |
| `src/content/products/self-adhesive-bitumen-waterproofing-membrane-wholesale.md` | SEO：title、meta_description | `6f9cac202b61febcc6f57b5989201dfc57c450d6462019fa2da7ac379c5d8d1a` |
| `src/content/products/spray-polyurea-waterproofing-coating.md` | SEO：meta_description | `9b4f2074f0a5cbff60da47f04bb64ff41dcc9f30d0a452125f203cab0a1aec38` |
| `src/content/products/spraying-quick-setting-rubber-asphalt-waterproof-coating.md` | SEO：title、meta_description | `c11857364c4cb3da3f7639f934dfafae77ea3bfcca50fd8df67277d5adda4484` |
| `src/content/products/tpe-joint-lap-tape-reinforcement.md` | SEO：meta_description | `01e84614c3287fb20514f570b7a9cc457d9354b9a7cf2973219ba5e674a2b54b` |
| `src/content/products/tpo-walkway-pad-manufacturer.md` | SEO：title、meta_description | `8bb1e87db921bcebcae8347d395ff88165fb1a0d9ec111c137ef260aa48bec24` |
| `src/content/products/tpo-waterproofing-membrane-manufacturer.md` | SEO：title | `abf92aa6dfb81bd13360bc1abed6927c506cacb3363a33dfc5764e9955baad4c` |
| `src/data/applications.ts` | SEO：7 个应用页描述补充或缩短 | `7bbd2830e195a6829b4627101265031a03a856a2cd28e1130c5bf81273a1f855` |
| `src/data/site.ts` | 配套：导航增加分类入口、标签改名；纠正瓦片链接；补产品入口和配图 | `4e3e7b293a5c129ef9ca390110dd4a821a604a161212da3e1b56d4f51d2ec89f` |
| `src/layouts/Layout.astro` | SEO：robots/ogType/head slot；移除重复主域名连接提示 | `85da38d0dced7c0e2bf430fadbfa2cc87772410238d26f16115fc3c0d259edee` |
| `src/pages/404.astro` | SEO：通过 robots prop 输出 noindex, follow | `e9c821bb3fd41db7e88fa2a990f4c1765ba7bd94d31af7fd97e46496fb5a0ab7` |
| `src/pages/about.astro` | 混合：标题描述缩短；factory/certifications 锚点及滚动间距修正 | `6a6782407824abf416fe388104b404458a7518f577aa58fead52e05d363a0277` |
| `src/pages/applications/[slug].astro` | SEO：标题描述、OG、WebPage/BreadcrumbList/ItemList | `4e3fecd3bb685011864372b5d1dbc135a0b46644c53296ac2138a39e6f18b718` |
| `src/pages/applications/index.astro` | 混合：标题、OG、结构化数据；容器宽度样式调整 | `c25b402d11feb1fb93ae9320be3801866e36f21343e812a7c9703e9759daeefe` |
| `src/pages/blog/[...slug].astro` | SEO：seoTitle 优先；品牌后缀按长度省略；必要时按词截断 | `df50f54a49cfcc138b6b2cc385a88772e8be963f2d511f91c6d1c25a435c53be` |
| `src/pages/blog/index.astro` | SEO：标题描述、OG、Blog/BreadcrumbList | `00b7033f04250d3d13209a1e0ca6b806b742559edeb287d147c8062e0d5944ff` |
| `src/pages/blog/page/[page].astro` | SEO：分页标题、独立描述、OG、Blog/BreadcrumbList | `0f94841603d9ecb6e543a4134dd0b037b0ee685cbc669f0673832419f3d0e1ee` |
| `src/pages/categories/[category].astro` | 配套：标题描述、OG、结构化数据；分类图及预加载回退至真实产品图 | `b5da707bf76e659c31f029d3eeee4c569c35fb2556bc291b20929afe5105315a` |
| `src/pages/categories/index.astro` | SEO：OG、CollectionPage/BreadcrumbList/ItemList | `298dee0e41d9922da6e19d3dd43c9c624648c5594accf185a9d271c2d33a5240` |
| `src/pages/contact.astro` | SEO：描述、OG、Organization/ContactPage/BreadcrumbList | `94fad63314d9d2b9f1677f67e447914b7d05abeb7adfad4b98e76f1b10edce4f` |
| `src/pages/index.astro` | SEO：首页标题描述缩短 | `1ac634da160d2f6d6b1a1fe54c94a72e6d9b486e224c949f4ea8d6b247bb779d` |
| `src/pages/products/[slug].astro` | SEO：传入 ogType=product | `b085009ad75d135b2be95fb1b1973abf29fe2504d7f89f9ea3b94a2f19d18486` |
| `src/pages/products/index.astro` | SEO：产品目录标题缩短 | `591e86d4866be0a2f2823d396ddc12f0ea7bca43d2931cbca1704b27eddc8828` |
| `src/pages/projects/index.astro` | 配套：描述、OG、结构化数据；原有卡片内容提为数据数组 | `53d623e9fbbea8b2e4f5f124743b2f7569562fff58661214897ab644b0745d94` |
| `src/pages/sitemap.astro` | 配套：删除不存在的下载中心入口；修正 certifications 锚点 | `80898073e0c2a89f8ea8b99b6fdb51d3e7dadf36a41eca91dceb45ed69553d8a` |
| `src/pages/technical/index.astro` | SEO：OG、TechArticle/BreadcrumbList | `3784aefd7e0983e7e6341c2836b9b52b7c49864a28e5bea52748d046bec4a338` |
| `src/pages/technical/installation-guide.astro` | 混合：描述、OG、结构化数据；页面由占位内容扩充为 5 类系统安装指导。建议正文扩充独立确认 | `ef198ddd2fc1d79655a8f53d54ac7548c73cabc0b5ee4654180cebf46968ce3d` |

## 后续 P0 与外部步骤

- TDS：本地文件 2 页，第 2 页存在内部发布指令。待讨论替换文字和保留的参考数据说明；尚未修改 PDF。
- SBS 安装手册：本地文件确认 12 页。待逐项确认 href 与 pages 更新；尚未修改产品 frontmatter。
- 部署、R2 对应对象覆盖、Cloudflare 缓存清理和线上下载复核待执行前确认实际发布链路。本地构建通过不等同于已上线。
- 厂方当前产品报告、批次质量文件和新标准符合性仍需人工核实；清理内部指令不代表技术数据已经获批准。

## 已确认的最终实施与提交范围

以下结果替代前文“建议”和待处理状态；前文保留为初次核对记录。

- 用户逐项确认了提交范围、TDS 替换文字与修订号、安装手册链接和页数。
- SEO 批次原有 60 文件均按确认范围纳入；5 个文件只纳入局部：config.ts 仅博客 seoTitle；金属屋面页仅 meta_description；安装指南仅描述/OG；about 仅元数据/factory 锚点；应用列表仅 SEO/JSON-LD。
- 产品 schema 改造、金属屋面 FAQ 与正文、安装指南正文与依赖该正文的 HowTo，以及 about/应用列表样式改动均保留在工作区。对工作区没有执行 reset、checkout 或批量覆盖。
- 博客详情页使用已经过滤 draft 的 visibleArticles 按 slug 查找，替代旧 getEntryBySlug 的重复读取，消除类型推断错误。修复前后全部 16 个博客 HTML 输出逐字节一致。
- 更新 TDS 2 页：内部指令替换为客户索取检测报告/批次质量文件的说明；两页 Rev. 02 | Oct 2026；技术表格、来源与免责声明保留。字体做子集嵌入，文件 430081 字节。文本差异严格匹配预期；Poppler 两页渲染目视检查通过。
- SBS 安装手册 href 填 /docs/sbs-membrane-installation-manual.pdf；pages 从 3 改为 12；手册 PDF 文件本身未修改。
- 实际待提交版本在隔离目录构建通过，70 页；69 sitemap URL，IndexNow 关闭。全部标题 <=60；全部可索引页描述 <=160；元数据/canonical 无缺失；JSON-LD JSON 解析通过。安装手册链接与 Download 按钮正确；构建目录的两份 PDF 与源文件逐字节一致。
- HEAD 类型检查 70 errors；最终待提交版本 34 errors，无新增诊断。剩余为基线已有问题，本次并未声称全量类型检查通过。
- 提交范围：60 个原批次文件的选定内容 + 1 个 TDS PDF + 本核对记录，共 62 文件。其他未跟踪文件均不纳入。

## 提交前外部步骤说明

1. 确认部署入口、生产分支及执行本次提交的发布；本地提交不会自动证明生产已更新。仓库有 Vercel 配置，public/docs 会随静态构建复制到 dist/docs。配置中没有 docs 到 R2 的显式重写，需由维护者确认实际线上请求是否还有 Cloudflare/R2 层。
2. 如果线上 TDS 另由 R2 提供，覆盖正确 bucket/key 的对应对象；不可仅凭 img 域名或旧脚本推断目标。
3. 按实际缓存链路清理 TDS PDF 和 SBS 产品页缓存；核对下载到的 TDS 为 2 页/Rev.02/Oct2026 且无内部指令，手册为 12 页，按钮直达手册。
4. 厂方人工核对当前产品检测报告、批次质量文件及新标准符合性。此次文本清理仍保留参考 TDS 定位，不代表厂方技术批准。
5. 推送、部署、R2 写入和 Cloudflare 清缓存均尚未执行。P1 参数/认证断言与 P2 模板事项留待另行讨论。
