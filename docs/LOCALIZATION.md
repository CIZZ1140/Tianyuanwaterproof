# Thai and Vietnamese launch

English stays at `/`; Thai uses `/th/`, Vietnamese `/vi/`. No automatic language redirects.

## Scope

Each language has 26 static pages: home, products, about, contact, four categories and 18 product buyer guides. The supported categories are bitumen membranes, asphalt shingles, waterproof tapes and waterproof coatings. Polymer sheet membranes, geosynthetics, roofing accessories and blogs remain English in this first release. English technical references are explicitly labeled on the localized product pages.

## Content and routing

- `src/i18n/ui.json`: navigation, page and inquiry copy, category descriptions.
- `src/i18n/products.json`: curated product descriptions, uses, checks and selected specifications. These are localized buyer guides, not a paragraph-for-paragraph copy of the English long-form pages. Images and category identity come from the English product collection.
- `src/i18n/routes.mjs`: the single manifest for published language paths and language alternatives.
- `src/pages/[locale]/[...path].astro`: shared static templates; no separate template copy per language.

Update both languages and verify technical terms when English product configurations change. Preserve values, units, standard IDs and product names. Native-language technical review is useful for future terminology refinement; this release has not been certified by a native translator.

## Search and navigation

Every published language page has a self-referencing canonical and reciprocal en/th/vi/x-default alternatives in HTML and the XML sitemap. English pages without a localized counterpart do not advertise nonexistent alternatives. Their language menu clearly links to a language homepage. Language switching on translated products preserves the product path.

The XML sitemap contains 122 URLs after launch (70 original + 52 localized). Being listed does not guarantee indexing.

## Inquiry flow

The localized forms use the existing Formspree endpoint and Turnstile protection, with localized success/error messages. A product inquiry carries the product slug, language and source path. Field labels are localized; submitted field names remain compatible with the business inbox. Never send production test inquiries without an appropriate reason. Browser validation and product preselection were checked without sending a message.

## Validation

Run `astro check` and `astro build`. Check built locale page counts, language tags, H1s, local links, self canonicals, reciprocal alternatives and sitemap coverage. Check English, Thai and Vietnamese headers at mobile and desktop widths; check the mobile language menu and the product-to-inquiry selection. Launch evidence is recorded under `reports/th-vi-launch-2026-11-02/` in the original workspace.
