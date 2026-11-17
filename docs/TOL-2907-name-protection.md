# TOL-2907: protect the name (inventory, one public site, BBB replies)

Status: **draft for the owners (Cam and Susan McNeill) and Jeramey. Nothing here is published, posted, deployed or paid for.**
Evidence date: 2026-11-15. Everything below was read from public pages; where a page could not be opened (Yelp blocks
automated visits) it says so.

This is **not a rebrand.** The public name stays **Seasonally Living by Chim Chimney** and the 1979 story stays on every
page that tells it. `scripts/check-name-protection.ts` fails CI if the legal name, the 1979 founding year, the single
hours source, the dropped product lines or the legacy redirects change (section 6).

## 1. What the research got wrong (read this first)

The ticket describes two live sites that disagree. The evidence says something different:

| Ticket said | What is actually there |
| --- | --- |
| A "Chim Chimney" site sells Marquis spas, ATV swim spas, River Pools. | `chimchimney.biz` is **not a site any more.** It is a Namecheap parking page ("has been recently registered with namecheap.com"). RDAP: registered **2026-07-17**, expires 2027-07-17, nameservers `dns1/dns2.registrar-servers.com`. Internet Archive captures of 2024-12-20 and 2025-07-10 show it **301-redirecting to seasonallyliving.com**, so the old domain was already folded into the new name and then lapsed. Its last real content (2018-19 captures) was a blog and Marquis/ORCA/FPX tags. I found no public page anywhere that mentions ATV swim spas or River Pools. |
| `chimchimney.com` is related. | It serves a one-line redirect to `/lander` (a domain-for-sale lander). Not ours as far as anything public shows. |
| BBB: 5 complaints in 3 years. | BBB profile read live on 2026-11-15: **F**, reason **"Failure to have a required competency license"**, **2 licensing alerts**, **"This business has 0 complaints"** (Complaints tab) and "no complaints filed in the last 3 years". Earlier search snippets said 5 in 3 years and 0 closed in 12 months, so older complaints appear to have aged out. The F comes from the license, not from unanswered complaints. |
| Hours differ (10-4 vs 10-5). | They differ **inside the live site**: footer on every page says Tuesday-Saturday 10-4, the `/contact` page says 10:00a-5:00p. The new site says 10am-4pm. |

Consequence: "merge the Chim Chimney site" is already done in practice (the old domain redirected to seasonally
living.com until it lapsed). The real exposure is the **lapsed domain** and the **stale third-party listings**.

## 2. Inventory

### 2a. Live `seasonallyliving.com` (Squarespace, www is canonical)

Page title on every page: "Seasonally Living by Chim Chimney - "Live for the Season"! | Fireplaces, Spas, and Outdoor Living".

| Item | Live site says |
| --- | --- |
| Pages (17 paths linked from the home page) | `/about` (Our Story), `/contact`, `/calspas`, `/calflame`, `/cal-saunas`, `/swim-pro`, `/spas`, `/home-resort`, `/pool-spa-care`, `/construction-design-services`, `/fireplace-stove`, `/fireplacestoves-options`, `/electric-fireplaces`, `/wood-fireplaces`, `/gas-fireplace`, `/hearth-supplies`, `/cart` |
| Brands | Cal Spas hot tubs, Cal Flame (outdoor BBQ islands, built-in grills), Cal Saunas, Swim Pro and Swim Pro X (Cal Spas swim spas), hearth section |
| Hours | Footer: Tuesday-Saturday 10-4, closed Sunday and Monday except by appointment. `/contact`: Tuesday-Saturday 10:00a-5:00p. |
| Contact | (509) 667-8833; fax (509) 888-5694; `hello@seasonallyliving.com` on `/contact`; 1407 Maiden Ln, Wenatchee WA 98801 (next to Home Depot) |
| Stale text | Search-result description (`og:description`) still reads "Marquis Spa Authorized Dealer" and "BBQ grills" while the body sells Cal Spas. Page title contains the typo "Firelplaces". `/about` says the business pours concrete patios, builds gazebos and does landscaping (the owners dropped that, see section 3). |

### 2b. New site (Next.js on Cloud Run, repo `TolowaStudio/seasonally-living`)

Name "Seasonally Living", legal name "Seasonally Living by Chim Chimney", founded 1979, showroom 1995, owners Cam and Susan
McNeill, hours Tuesday-Saturday 10am-4pm (single source: `src/content/settings.ts`), phone (509) 667-8833,
`sales@seasonallyliving.com` (differs from the live site's `hello@`, see section 5), 1407 Maiden Ln. Lines: Cal Spas hot
tubs and swim spas, pre-owned spas, pools installed by the crew, pool and spa care, Stûv, Kuma, Morsø, Napoleon, gas and
electric inserts, venting service. `next.config.ts` already redirects every one of the 17 legacy paths above.

### 2c. `chimchimney.biz` (old Squarespace site, now parked)

Parked, see section 1. Historic paths worth redirecting if the owners get it back: `/about`, `/blog/...`, `/contact`.

### 2d. Third-party listings (seen in search results; not all opened)

| Listing | What it shows | Checked |
| --- | --- | --- |
| BBB | "Chim Chimney Fireplace, Pool & Spa", **1604 N Wenatchee Ave** (old address), F, not accredited, alternate names "Seasonally Living", "Seasonally Living by Chim Chimney", "Stone Masters Inc", categories include Pool Contractors, Hot Tub Dealers, Outdoor Kitchens, Sauna Equipment, Gazebo, Bathtubs | opened, read live |
| Yelp | "Chim-Chimney Fireplace & Spa", 1604 N Wenatchee Ave, about 1.8 stars (34 reviews, July 2026 snippet) | snippet only (Yelp blocked the visit) |
| Birdeye | two profiles, roughly 3.1 stars | snippet only |
| Houzz, Nextdoor, We Love Fire | listed as "Chim Chimney Fireplace, Pool & Spa" | snippet only |
| Google Business Profile | not read; TOL-2908 (needs an owner login) | not checked |

## 3. Proposal: one public site

1. **One public site: `seasonallyliving.com`**, served by the new site once DNS moves (DNS and the Squarespace to Cloud Run
   cutover are not part of this ticket).
2. **Name rule.** Lead with "Seasonally Living". Keep "by Chim Chimney" in the legal name, the footer, the logo alt text and
   the Our Story page. Never describe the move as a rebrand or a new company.
3. **Hours: Tuesday-Saturday 10am-4pm, closed Sunday and Monday (appointments welcome).** It matches the live footer,
   the new site and what the About page states. Treat the `/contact` 10-5 as an error. *Owners confirm.*
4. **Product lines (owners decide).**

| Line | Live SL | New site | Proposal |
| --- | --- | --- | --- |
| Cal Spas hot tubs, Swim Pro and Swim Pro X | yes | yes | keep |
| Pre-owned spas, pools, pool and spa care | partly | yes | keep |
| Stûv, Kuma, Morsø, Napoleon, inserts, venting | hearth section | yes | keep |
| Cal Saunas, Cal Flame, outdoor kitchens | yes | dropped (`next.config.ts` comment: "no longer offered") | drop from the live site and every listing; the redirects already cover the old URLs |
| Patios, gazebos, landscaping, general contracting | `/about` text | not offered | drop the sentence; do not advertise work that needs a contractor license nobody has confirmed |
| Marquis Spas | stale meta text | no | remove unless Cam says they still hold the dealership |
| ATV swim spas, River Pools | not found anywhere | no | ask Cam whether these were ever carried; if not, nothing to do |

5. **Redirect map.** Already live in `next.config.ts` for the 17 legacy Squarespace paths (permanent). If the owners
   regain `chimchimney.biz` (section 5, question 1) and point it at the same Cloud Run service, add a host-based redirect
   so old links and listings land on the right page and the old domain is not left to a stranger again:

   ```ts
   // PROPOSED, NOT APPLIED: only after the owners control chimchimney.biz and DNS points at the service.
   { source: "/blog/:path*", has: [{ type: "host", value: "(www\\.)?chimchimney\\.biz" }], destination: "https://seasonallyliving.com/journal", permanent: true },
   { source: "/:path*", has: [{ type: "host", value: "(www\\.)?chimchimney\\.biz" }], destination: "https://seasonallyliving.com/:path*", permanent: true },
   ```

6. **Listings.** After the owners confirm the three decisions above, update BBB, Yelp, Birdeye, Houzz, Nextdoor and the
   Google profile to one name, one address (1407 Maiden Ln), one phone, one set of hours, one website
   (`seasonallyliving.com`). Claiming profiles needs an owner login (TOL-2908, TOL-2919).

## 4. Draft BBB replies (for Cam to approve and post; do not post as is)

BBB shows **no open complaints today**, so there is nothing to answer line by line and these are **templates**, not replies
to named people. Use one only if a complaint appears, or if Cam remembers the earlier ones and can match them. Rules:
Cam checks the facts first; never name or describe the customer; no blame, no promises Cam cannot keep; always give a
person and a phone number; keep the reply public-safe.

**A. Scheduling or installation delay**

> Thank you for taking the time to write, and I'm sorry the schedule did not go the way we told you it would. That is
> on us to fix. I'm Cam McNeill, the owner. Please call me at (509) 667-8833 or stop by the showroom at 1407 Maiden Ln
> (Tuesday to Saturday, 10 to 4) and we will go through your order together and agree a date we can keep. We have been
> in the valley since 1979 and we want to make this right.

**B. Service or warranty question**

> Thank you for letting us know. We're sorry the repair or warranty visit was not handled the way you expected. I'm
> Cam McNeill, the owner, and I'd like to look at this personally. Please call (509) 667-8833 and ask for me, or stop by
> 1407 Maiden Ln, and we will review what was done, what the manufacturer's warranty covers, and what we can do for you
> from here.

**C. Billing, estimate or refund disagreement**

> Thank you for raising this. We'd like to understand it and settle it fairly. I'm Cam McNeill, the owner. Please call me
> at (509) 667-8833 with your order or invoice number and we will go through the paperwork with you line by line and tell
> you plainly what we can do.

**D. Profile note (for the owners' "business response" box, not a complaint reply)**

> Seasonally Living by Chim Chimney is the family-owned business of Cam and Susan McNeill, in Wenatchee since 1979. Our
> showroom is at 1407 Maiden Ln (next to Home Depot), open Tuesday to Saturday, 10 to 4, and by appointment. Phone (509)
> 667-8833. If we did not meet your expectations, please call us so we can put it right.

**The F will not move because of replies.** BBB gives the rating reason as a missing competency license. Replies help
reputation, not that score.

**L&I lookup (done 2026-11-17, public Washington open data, dataset `m8qx-ubtq`, matched by UBI `601862521`):**

| Registration | Number | Status | Dates |
| --- | --- | --- | --- |
| CHIM CHIMNEY FIREPLACE & SPA (principal Cam A. McNeill) | CHIMCFS990DF | **EXPIRED** | effective 2001-03-06, expired 2024-08-10 |
| SEASONALLY LIVING, 1407B Maiden Lane (same UBI, same principal) | SEASOL*762BW | **ACTIVE**, general contractor | effective 2024-01-18, expires 2028-04-08 |

So the business is licensed today, under the new name. The "F" most likely reads the old Chim Chimney registration
(expired) against a BBB profile that still has the old name and the old address (1604 N Wenatchee Ave). The fix is a
profile correction, not a reply: claim the profile and give BBB the current license number `SEASOL*762BW`, the current
address and the "Seasonally Living by Chim Chimney" name, then ask for the rating to be reviewed. Do not move to a new
name to escape the record. (This is my reading of the data; BBB's own reason text is the only thing that settles it.)

**Do not confuse two businesses.** "CHIM CHIMNEY SWEEPS LLC" (Malaga, UBI 603453854, masonry license active to
2027-11-25) is a different company. Never cite its license, and watch for customers and listings that mix the two.

`scripts/check-lni-license.ts --live` re-reads the register and fails if our UBI has no ACTIVE registration with more
than 90 days left; CI runs only its offline self-test.

## 5. What needs a person (owners and Jeramey; the only parts an agent cannot do)

1. **Who holds `chimchimney.biz` now?** It was registered on 2026-07-17 at Namecheap. If Cam or Susan (or their web
   person) did that, point it at the new site (section 3, item 5). If a stranger holds it, **do not buy it back without
   Jeramey's yes** (money) and do not let anything be built on it that could pass for the business.
2. **Cam confirms three facts:** hours 10-4; Cal Saunas, Cal Flame and outdoor kitchens are gone; whether Marquis, ATV
   swim spas or River Pools were ever carried.
3. **Which email is public:** the live `/contact` page shows `hello@seasonallyliving.com`, the new site uses
   `sales@seasonallyliving.com`. Pick one and make sure it is monitored.
4. **Claim the BBB profile** (free, owner login; the L&I lookup is done, section 4) so the license number, address,
   website and name can be corrected, then ask BBB to review the rating. Paid BBB accreditation only after the grade
   recovers; that is a money call for Jeramey and the owners.
5. **Approve any wording** in section 4 before it goes anywhere public, and Jeramey's OK on anything published.

This ticket blocks TOL-2913 (ads): ads should wait until sections 3 and 5 are settled and the listings agree.

## 6. How this stays true

`scripts/check-name-protection.ts` runs with the other content checks in CI and fails when:

- the legal name stops reading "Seasonally Living by Chim Chimney", or the founding year changes from 1979;
- a showroom hours range appears anywhere in `src/` other than `src/content/settings.ts` (this is what would let a 10-5
  creep back in), or the hours stop being Tuesday-Saturday 10am-4pm;
- public copy offers Cal Saunas, Cal Flame, outdoor kitchens, Marquis, River Pools or ATV swim spas;
- any of the 17 legacy Squarespace paths neither renders nor redirects to a page that renders.

`scripts/check-lni-license.ts` (offline self-test in CI; `--live` by hand or on a schedule) guards the license behind the
BBB "F": it must match our UBI, not a lookalike name, and an ACTIVE registration with under 90 days left fails.

If the owners decide differently in section 3 (say, Marquis is still carried), change `NOT_CARRIED` or the hours in the
script in the same PR as the copy.
