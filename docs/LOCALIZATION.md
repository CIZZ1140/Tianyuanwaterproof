# Full-page Thai, Vietnamese and Spanish localization

English is the only layout/content source. Thai `/th/`, Vietnamese `/vi/` and Spanish `/es/` each
have all 70 published English pages: 26 product details, category/catalog pages,
applications, projects, blog articles and pagination, technical resources,
contact/about, policies and the sitemap. `src/i18n/page-paths.json` is the full
manifest. The build rejects a newly published English page missing from it.

## Rendering contract

`src/i18n/localize-html.mjs`, registered last in `astro.config.mjs`, runs after
Astro renders the English pages. It parses each corresponding English document
and emits its localized counterpart, retaining layout classes, module IDs,
images/srcsets, tables/rows, data attributes and interaction scripts. It replaces
visible copy, accessibility labels, metadata and structured-data text; adjusts
canonical/OG URLs, supported internal links and language switchers; and adds
locale-specific inquiry messages and a hidden Language field. No client-side
translation service is loaded. The old simplified buyer-guide template is gone.

The locale catch-all registers routes and sitemap entries; it is not a separate
design. Use `npm run build` then `npm run preview` to inspect localized pages.
The English development server alone does not run the post-build localization.

## Translation sources

- `full-th.json`, `full-vi.json` and `full-es.json`: checked-in full-copy dictionaries.
- `full-overrides.json`: curated UI/terminology and technical translations.
- `scripts/finalize-localization.mjs`: applies those overrides and terminology fixes.
- `scripts/extract-localization.mjs`: collects current English strings from `dist`.
- `scripts/translate-full-pages.py`: optional offline, resumable machine-translation
  preparation using Google's translation service. It sends public page text only;
  protects numbers, units and identifiers; never runs in production. This requires
  Python and requests only when refreshing dictionaries, not for deployment.
- `scripts/apply-translation-review.py`: applies saved Microsoft Translator
  browser review results during preparation. The expansion's initial offline
  machine drafts were replaced through the normal translation UI and curated
  overrides. Review caches and model files are not deployment dependencies.
- `scripts/audit-localization.mjs`: checks webpage and PDF dictionaries for
  missing strings, numeric/sign/unit parity and unintended writing systems.
- `scripts/localize-downloads.py`: builds Thai/Vietnamese/Spanish reading editions of all
  five first-party PDF resources. Full translated text appears first, followed
  by the complete unchanged English source appendix including original diagrams,
  tables and photographs. `pdf-th.json` / `pdf-vi.json` / `pdf-es.json` hold their translated copy.
  Original English downloads remain available; localized pages link to
  `/docs/th/`, `/docs/vi/` or `/docs/es/`. Third-party reference PDFs retain their source URLs.
  Product photography, packaging print and original certificates are unchanged.

Initial full-copy translation is machine-assisted, with targeted terminology and
technical corrections. Native-language technical proofreading is still pending;
do not represent this as certified translation.

Builds fail on missing strings rather than silently publishing mixed-language
pages. For English content edits, render English output with the localization
integration temporarily disabled if needed, extract new strings, translate and
review them, finalize dictionaries, restore the integration, and build again.
Never remove modules or technical rows to work around missing translations.

## Verification

Run `npx astro check`, `npx astro build` and
`node scripts/verify-full-localization.mjs`. The parity check covers all 210 localized pages:
module IDs, layout classes, source image sets, table/row counts, technical numbers
and measurement units, interaction scripts, canonical/alternate URLs, supported
links and inquiry locale fields. `reports/full-localization/validation.json`
records the result. Browser QA additionally covers desktop/mobile home/product
layouts, gallery switching, catalog filtering, cross-language links and inquiry
preselection without submitting a production message.

Every language URL has its own canonical and reciprocal en/th/vi/es/x-default links.
The sitemap contains 280 URLs (70 per language). Keep the existing Formspree endpoint, Turnstile,
field names and option values compatible with the English inquiry flow.

Spanish uses broadly understood Latin American purchasing terminology (cotización), with generic `es` language targeting. The Spanish flag identifies the language picker; it does not restrict search targeting to Spain. Original English layout and technical data remain the source.
