# Google Ads conversion preparation — 2026-10-21

- Live WhatsApp floating-button click sent the existing Ads label `AW-18274384476/Uzg7CK6yxewcENz084lE`; a Google first-party conversion endpoint responded HTTP 200. GA4 whatsapp_click received HTTP 204. No WhatsApp message sent. This proves tag transport, not attribution or verification-status clearance. Ads remained paused.
- Created `Website Inquiry Success`, manual website conversion, label `AW-18274384476/N8N1CIzj36QdENz084lE`, counting once, 90-day click window. Initially SECONDARY and excluded from account goals to stage deployment without adding a second primary form conversion.
- The creation wizard defaults to different conversion values with USD 1 fallback; application code supplies no monetary value. This is a configured fallback, not actual revenue or an estimated lead value.
- Local Layout helper now sends this Ads event only for FormAjax's form_submit_success. Existing FormAjax emits that event after an HTTP-success submission response; failed submissions and button clicks do not use this label.
- Build succeeded (71 pages); Astro check: 0 errors, 0 warnings, 39 hints. Not committed, pushed, deployed or live-tested with the new label.

## Required rollout steps

1. Obtain separate commit and push authorizations under the operations handbook, publish the local success hook, and verify a labeled test submission against the deployed code.
2. Promote Website Inquiry Success to primary and demote legacy auto-detected `表單` to secondary as one coordinated switch. Until that switch the old form conversion remains primary. Secondary events can appear in All conversions; do not sum old and new as unique leads.
3. Recheck WhatsApp verification and enhanced-conversion warnings separately. Do not import a second GA4 WhatsApp primary conversion on top of the existing direct Ads label.

Evidence: inquiry-test-2026-10-21/ads-success-created.jpg. GA4 key events were configured earlier; no Ads/GA4 account link was created.
