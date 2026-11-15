# Ads tracking and campaign landing pages (TOL-3346)

Everything is off until an env var is set. With none set: no tag script, no third-party request, no consent banner.
(Verified: with no env, `/lp/*` requests only localhost and `res.cloudinary.com` for images.)

## Switch-flip checklist (after Jeramey approves TOL-2913)
1. Create GA4, Google Ads and Meta accounts yourself (not done by this work).
2. Set the `NEXT_PUBLIC_*` values from `.env.example` as Docker **build args** (they are inlined at build), rebuild, deploy.
3. In Google Ads, create conversion actions (Lead = primary, Call = primary, others secondary/observation) and put each label in the matching `NEXT_PUBLIC_GOOGLE_ADS_LABEL_*`.
4. In GA4, mark the six events below as key events.
5. Optional: set `META_CAPI_TOKEN` (GCP Secret Manager) and wire `sendMetaLead` into `/api/lead`.

## Loading and consent
- Google (GA4, Ads): `gtag.js` loads `afterInteractive` in Consent Mode v2, default **denied** (override with `NEXT_PUBLIC_CONSENT_DEFAULT=granted`), `ads_data_redaction` and `url_passthrough` on. Choosing Accept sends `consent update`.
- Meta Pixel and PostHog have no consent mode, so they load only after Accept.
- The banner (`src/components/Tracking.tsx`) shows only when a tag is enabled and no choice is stored (`localStorage["sl-consent"]`).

## Events (`src/lib/track.ts` → `trackConversion(name, props)`)
| Event | Fires when | Meta event |
| --- | --- | --- |
| `lead_submitted` | visit / consult form accepted (props: `interest`) | Lead |
| `preowned_inquiry` | pre-owned spa inquiry, or the sell / trade-in form (`interest=pre-owned-supply`), accepted | Lead |
| `newsletter_signup` | monthly note form accepted | Subscribe |
| `call_click` | click on any `a[href^="tel:"]` | Contact |
| `directions_click` | click on a Google/Apple Maps link | FindLocation |
| `booking_started` | click on a booking CTA (`#book`, `/visit#book`) or first focus in the booking form | custom `BookingStarted` |

Links can add `data-track-area="..."` (it is sent as `area`). Form events currently come from a DOM observer in
`Tracking.tsx` because LeadForm/NoteForm (TOL-2922) do not call `trackConversion`. TODO: replace with direct calls
after TOL-2922 merges; `trackConversion` returns the event id to send to `/api/lead` for Meta CAPI de-duplication.

## Meta Conversions API
`src/lib/meta-capi.ts` exports `sendMetaLead({ eventId, email, phone, sourceUrl, userAgent, clientIp, fbp, fbc, interest })`.
SHA-256 hashes email/phone, 3 s timeout, never throws, no-ops unless `META_CAPI_TOKEN` and `NEXT_PUBLIC_META_PIXEL_ID` are set.
Not called yet. Client side, `getMetaBrowserIds()` returns `_fbp`/`_fbc` to include in the lead payload.

## Landing pages
`/lp/<slug>`: `hot-tubs-wenatchee`, `pre-owned-hot-tubs`, `gas-inserts-burn-ban`, `stuv-wood-stoves`,
`pool-planning-2027`, `swim-spas`. `noindex` (meta and `X-Robots-Tag`), not in the sitemap, own minimal header (logo,
phone), no site nav/footer (`SiteChrome`). Content: code defaults in `src/content/landing.ts`; a Sanity `landingPage`
document with id `landingPage-<slug>` overrides any field. The Studio schema must be deployed (and docs created in the
Studio) before editors can change them; until then the code defaults render. UTMs and `gclid` ride along in the
lead's `source` field (page path + query string).
