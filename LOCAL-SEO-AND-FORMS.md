# Local discovery and quote flow · September 9, 2026

Owner confirmed hours: **Monday–Sunday, 8 AM–8 PM**. Keep Google Business Profile in sync; its previously observed public listing had a different schedule.

## Published features

- `lansdale-lawn-care.html`: unique local service content, titles, description, canonical URL and Service structured data. No invented Lansdale testimonials or project locations.
- `service-areas.html`: all 12 confirmed communities and nearby areas, linked to service requests.
- Home and Services link visibly to Lansdale; sitewide footer links make both new pages discoverable. Sitemap includes both.
- Google profile linked using the observed business identifier `7540364938997628904`; phone and website matched the owner-supplied profile. Homepage Organization includes the alternate business name and sameAs. No copied star count, stale aggregate rating or fabricated reviews.
- Quote flow: project, full property address, contact, final review. Property size and frequency are required; uncertainty is allowed. Full address, map link and all job details go to the existing recipient.
- Three optional photo inputs; JPEG/PNG/WebP only and 8 MB combined client limit. Native multipart POST preserves the existing FormSubmit email and autoresponse flow. Native form remains available without JavaScript; client file restrictions are convenience checks, not server-side verification.
- Gallery filters distinguish real projects by visible work type from stock autumn inspiration. Existing photos preserved, with more descriptive alternative text. Lightbox navigation follows the selected filter.
- Existing mobile call/quote controls retained and checked; quote page avoids an overlapping WhatsApp button.

## Analytics status

No Google Analytics ID or reporting account was supplied. **Centralized measurement is not active.** `local-upgrade.js` emits a `dataLayer` event and `ariana:analytics` CustomEvent for call, email, WhatsApp, quote starts, steps, submission attempts, gallery filters and Google-profile clicks. A phone-link click is not a completed phone call; a submission attempt is not confirmed delivery. Do not count a direct visit to thanks.html as a verified lead.

Connect these events to the owner's chosen analytics property before reporting real totals. Do not collect names, emails, phones, full addresses, uploaded filenames or query strings in analytics. No persistent visitor IDs, cookies or new tracking vendor are installed by this update.

## Before/after status

No same-property before/after pair has been confirmed. The slider styling and handler are prepared, but **no before/after claim is displayed**. Once the owner identifies both photos, add a `data-project-compare` section containing `.compare-stage`, the after image, `.compare-front` before image and a labeled `input[type=range]` from 0 to 100. Confirm chronology, same property, permission to publish and the caption before activating. Do not pair unrelated finished jobs or stock photos.

## Verification and operational limits

Local browser checks: required fields block incomplete steps, full address validation, known service/town prefill, review output, address reconfirmation after edits, optional photo selection and combined size rejection, gallery filters/lightbox, mobile widths and console errors. Live email delivery and autoresponse require a real owner-approved submission and completion of provider verification; no test emails were sent.

Schema, sitemap, canonical URLs, one H1 per page, IDs, hours and local links checked. Keep the existing `CNAME`, seasonal theme, business contact and GitHub Pages deployment.

References: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [FormSubmit documentation](https://formsubmit.co/documentation). Search positions are not guaranteed; request indexing and review performance in the owner's Search Console after publishing.
