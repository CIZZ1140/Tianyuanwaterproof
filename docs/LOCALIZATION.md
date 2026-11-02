# Full-page Thai and Vietnamese localization

English is the only layout/content source. Thai `/th/` and Vietnamese `/vi/` each
have 26 pages: home, catalog, about, contact, four categories and 18 products.
Polymer membranes, geosynthetics, roofing accessories, application pages and
articles outside this manifest keep their existing English destinations.

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

- `full-th.json` and `full-vi.json`: checked-in full-copy dictionaries.
- `full-overrides.json`: curated UI/terminology and technical translations.
- `scripts/finalize-localization.mjs`: applies those overrides and terminology fixes.
- `scripts/extract-localization.mjs`: collects current English strings from `dist`.
- `scripts/translate-full-pages.py`: optional offline, resumable machine-translation
  preparation using Google's translation service. It sends public page text only;
  protects numbers, units and identifiers; never runs in production. This requires
  Python and requests only when refreshing dictionaries, not for deployment.

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
`node scripts/verify-full-localization.mjs`. The parity check covers all 52 pages:
module IDs, layout classes, source image sets, table/row counts, technical numbers
and measurement units, interaction scripts, canonical/alternate URLs, supported
links and inquiry locale fields. `reports/full-localization/validation.json`
records the result. Browser QA additionally covers desktop/mobile home/product
layouts, gallery switching, catalog filtering, cross-language links and inquiry
preselection without submitting a production message.

Every language URL has its own canonical and reciprocal en/th/vi/x-default links.
The sitemap remains 122 URLs. Keep the existing Formspree endpoint, Turnstile,
field names and option values compatible with the English inquiry flow.
