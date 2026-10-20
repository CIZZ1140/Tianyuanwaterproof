# Tianyuan independent-site audit — 2026-10-20

## Scope and method

- Audited the 69 indexable URLs in the production sitemap and the local 404 page.
- Compared a fresh 70-page Astro build with the live site. Parsed titles, meta descriptions, H1s, canonicals, robots directives, JSON-LD, internal links, image references, and download links.
- Checked the 69 sitemap URLs in a 390 × 844 browser viewport for document-level horizontal overflow and H1 count. This is a browser-width check, not a test on every physical phone.
- Checked 144 unique asset and PDF references from rendered pages, including `srcset` candidates; local PDF paths were checked against the generated files.
- Inspected the contact-form validation and AJAX script order without sending a test inquiry to Formspree.

## Fixed

1. The JS polymer-cement coating page referenced a nonexistent `js-polymer-cement-coating-v2-640.webp` in both its mobile image preload and `srcset`. The original image remains valid; mobile now uses it directly until a 640px derivative is uploaded.
2. Eleven product pages outside the previous 16-page optimization batch still displayed the generic buyer-facing note “Confirm configuration-dependent values in the applicable TDS.” Removed the note from the shared product template. Specification rows and download/contact actions remain.
3. Astro's static checker previously reported 34 errors. Added types to the inquiry script and product/category mappings, and excluded the unused, UTF-16 root-level `clean_slug.astro` draft from the checker. The checker now reports zero errors. The form's submission behavior and page layouts were not changed.
4. WhatsApp conversion clicks could be queued while the lazy Google tag had not yet loaded. A WhatsApp click now starts loading the tag before queuing the Ads and GA4 events. This improves delivery for quick clicks; the recorded conversion still needs confirmation in the connected Ads/analytics account.

## Checks passed

- Fresh production build: 70 pages generated.
- Sitemap: 69 indexable URLs; `robots.txt` and sitemap endpoints return 200.
- Retired `/categories/asphalt-membranes/` returns a real 308 to `/categories/bitumen-membranes/`.
- All 69 sitemap URLs: one H1 each and no document-level horizontal overflow at 390px.
- No missing or duplicated title or meta description, and no malformed JSON-LD in the generated pages.
- No broken internal href or missing local image path in the generated pages.
- All referenced remote assets returned 200 except the one missing JS 640px derivative fixed above.
- The contact page's country-code validator is registered before the AJAX submit handler in the generated document. An end-to-end inquiry was not sent.

## Remaining decisions and limitations

- **Response-time claims conflict.** The contact form says “within 1 hour during business days”; the AJAX success message says “within 1 business day”; homepage data says “24/7 Quick Response”; the SBS page says “within 2 working hours”; a market blog promises a quotation within 24 hours. Confirm the actual service level before unifying these buyer-facing claims.
- **Two placeholder gallery images remain:** metal-roof coating and pre-applied HDPE membrane. The metal-roof image was intentionally deferred pending a supplied replacement. Both require product-accurate imagery before removal or replacement.
- The site makes broad certification and factory-capacity claims. This audit verified rendering, not the underlying certificates, current production capacity, or every historical product parameter. These require factory documentation before factual changes.
- Formspree delivery, Turnstile completion, actual phone-browser behavior, GSC indexing and recorded Google Ads conversions were not verified by a live test submission or account-data review.

## Deployment

The first two fixes were pushed as `eaf6f6a` and Vercel reported success. The static-check cleanup and this audit report are part of a follow-up commit; record its Vercel status in the task report after pushing.
