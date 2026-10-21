# Live inquiry verification — 2026-10-21

Test identifier: `TY-INQUIRY-20261021-A`. One live test submission, explicitly marked internal/non-commercial. Reply email used the site's public sales address; phone was a clearly disclosed dummy number. No source code or deployment changes.

## Verified

- Entered the live SBS product page and clicked Get Factory Quote.
- Contact URL carried category, product, quote intent and source path. Category was selected correctly. Captured submitted payload confirmed all four context fields reached Formspree.
- Empty required fields blocked submission. A filled form without a selected country code was blocked with “Please select your country code”. Selecting +86 cleared that warning.
- Submitted using a 390 × 844 browser viewport override (desktop Chrome, not a physical phone). Button became disabled during sending; success replaced the form without navigating away.
- One Formspree POST returned HTTP 200 and JSON `ok: true`. Honeypot remained empty and a nonempty Turnstile response was included. This confirms acceptance of this submission, not that server-side anti-abuse configuration rejects invalid tokens.
- GA4 `form_submit_success` request to measurement ID `G-4BD10P0X1Q` included category/product/intent/source and received HTTP 204. This is collection-endpoint evidence, not report/Ads attribution confirmation.
- Google Ads automatic `form_submit` traffic was observed; it must not be treated as proof of a configured successful-inquiry conversion.

## Findings / pending

- `Full Phone` was empty in the submitted payload. `Phone` and `Selected Code` were populated separately; the contact script never populates the combined field.
- Formspree dashboard redirects to login. Inbox delivery and spam placement remain unverified pending owner login/access. Test sender name: TIANYUAN WEBSITE TEST 20261021; subject: New B2B Inquiry.
- The currently signed-in Analytics landing resource advertises a different measurement ID (`G-BDT1VH8QYF`). It cannot validate the site's measurement stream; do not infer the site's data is absent from that resource's empty dashboard.
- Existing response promises still differ (form: 1 hour on business days; success: 1 business day).
- Screenshot at `inquiry-test-2026-10-21/success-mobile.jpg` records the success card at desktop size after the mobile test; filename does not imply a mobile screenshot. Browser viewport restored after testing.

End-to-end status: browser → Formspree acceptance verified; receiving inbox and correct analytics report remain pending. No claim of complete inbox-to-report validation.
