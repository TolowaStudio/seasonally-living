# TOL-2892: Seasonally Living week-1 market facts (Google ratings, competitors, second homes, DNS)

Status: **research only.** Nothing here was published, posted, deployed, paid for or changed in DNS.
Evidence date: **2026-11-17**. Every number is from a public page and is machine-readable in
[`docs/data/TOL-2892-market-facts.json`](data/TOL-2892-market-facts.json); `scripts/check-market-facts.ts` fails CI if this
page and that file disagree. Numbers move (reviews, ratings), so re-read before quoting them to anyone.

The ticket carried no description or comments that an agent could read (`linear-ro` returns metadata only), and the
earlier attempt left no notes in the repo, in the PR list or in the fleet reports. So the four facts in the title are
treated as the scope: Google ratings, competitor status, second homes, DNS.

## 1. Google ratings and competitor status

Source: Google Maps place pages opened in a browser, no login, no Places API key (the only Places key in Secret
Manager belongs to another venture and was not used). "Open" means the listing is live and not flagged "permanently
closed" or "temporarily closed". All were showing normal hours (closed for the evening on the read date).

| Business | Where | Google stars | Reviews | Listing |
| --- | --- | --- | --- | --- |
| **Seasonally Living by Chim Chimney (us)** | 1407 Maiden Ln, Wenatchee | **3.9** | **99** | open |
| Pool To Spa Services LLC | 160 S Worthen St, Wenatchee | 4.9 | 374 | open |
| Hot Tubs Liquidators (Wenatchee) | 1625 N Wenatchee Ave, Wenatchee | 5.0 | 17 | open |
| Hot Tubs Liquidators (second listing) | pin near Chelan | 4.9 | 19 | open |
| Swim World Chelan | 1754 N Wenatchee Ave, Wenatchee | 4.4 | 19 | open |
| Blue Lagoon Pool and Spa LLC | 3012 Gs Center Rd, Wenatchee (address as shown) | 3.8 | 25 | open |
| Central Washington Water (also sells hot tubs) | 514 S Wenatchee Ave, Wenatchee | 4.8 | 37 | open |
| The Fireplace Guys | 1205 Walnut St, Wenatchee | 4.8 | 52 | open |
| Valley Fireplace and Spa | pin north of Wenatchee (street not read) | 5.0 | 12 | open |
| Sparkling Spas | pin in Leavenworth | 4.8 | 20 | open |
| Chim-Chimney Sweeps (adjacent, see below) | pin in Wenatchee (street not read) | 4.7 | 42 | open |

What this says:

- **We have more Google reviews than every hot tub or fireplace competitor except Pool To Spa Services** (374). Next
  closest is The Fireplace Guys at 52. Review volume is not our problem; the average is.
- **At 3.9 we sit below every competitor but Blue Lagoon (3.8).** Everyone else is 4.4 to 5.0. Most competitors
  have under 40 reviews, so their stars are fragile; Pool To Spa's 4.9 on 374 is the one that is not.
- The visible recent reviews on our listing are good (customer praise for Cam, Kimberly and the install crew, 4 months
  and a year old, and an owner reply a year ago), so someone with owner access has replied before. Whether
  Jeramey or the owners still hold that login is exactly what TOL-2908 needs. The 3.9 is a lifetime average and
  probably carries the older "Chim Chimney" era; I could not read the star distribution or the dated 1-star reviews
  (the histogram bars are not in the page text). A human with the owner login can see them in one click.
- **Hours on Google match the site**: Tuesday to Saturday 10 AM to 4 PM, closed Sunday and Monday, address 1407 Maiden Ln,
  phone (509) 667-8833. That agrees with `src/content/settings.ts`, so TOL-2907's single-hours rule holds on Google too.
  The listing's website link is `https://seasonallyliving.com/`, which today 301-redirects to `www`.
- Google calls us a "Fireplace store". Competitors in the same search are "Hot tub store". If hot tubs and swim spas
  are the money line, the primary category is a TOL-2908 (profile clean-up) change that needs the owner login.
- **Chim-Chimney Sweeps** is a separate Google listing with a different phone, (509) 667-1400. Nothing public shows it
  is our business and it has no website. Do not assume it is ours or call it a competitor; ask Cam and Susan. A second
  listing with "Chim-Chimney" in the name is the same confusion TOL-2907 is trying to remove.
- **Not found on Google Maps:** "Fire & Water" (listed in a BBB directory page for Wenatchee fireplaces). I could not
  tell whether it is closed or just not listed under that name. Marked unknown, not closed.
- Other platforms (search snippets, not opened, so lower confidence): Pool To Spa Services shows 4.9 with about 424
  reviews on Birdeye (all sources combined, so not comparable to Google); the old "Chim Chimney Fireplace, Pool & Spa"
  listing at 1604 N Wenatchee Ave shows 1.0 on one HomeAdvisor review. Yelp (about 1.8) and Birdeye (about 3.1) for us
  are in `docs/TOL-2907-name-protection.md`.

Method limits: one read per page on one day; a browser read of Google Maps is not the Places API and Google can change
what it shows. Brands each competitor carries were not verified and are left out on purpose.

## 2. Second homes (the Seasonal Living segment)

Source: US Census Bureau ACS 2020-2024 five-year estimates, table B25004 line 6 ("for seasonal, recreational, or
occasional use", the Census's own name for second homes, cabins and vacation rentals that sit empty part of the
year) over total housing units (B25002), pulled through Census Reporter on 2026-11-17. The official Census API needs a
key, so this uses the same published tables through a public mirror; anyone can re-check them at data.census.gov.

| Area | Seasonal units (± 90% margin) | Total housing units | Share | Estimate solid? |
| --- | --- | --- | --- | --- |
| Chelan County, WA | 5481 ±414 | 38677 | 14.2% | yes |
| Chelan city | 824 ±170 | 2867 | 28.7% | yes |
| Manson | 313 ±151 | 900 | 34.8% | yes |
| Leavenworth city | 210 ±91 | 1507 | 13.9% | yes |
| Entiat city | 41 ±32 | 612 | 6.7% | no |
| Cashmere city | 63 ±74 | 1350 | 4.7% | no |
| East Wenatchee city | 42 ±66 | 5577 | 0.8% | no |
| Wenatchee city | 0 ±28 | 14682 | 0.0% | no |

"Solid" means the margin of error is under half of the estimate. The one-year 2024 county figure is 3751 ±1077 of 39906
units (9.4%); that margin is too wide to use, so the five-year number is the one to quote.

What this says:

- **About one housing unit in seven in Chelan County is a second home or similar** (roughly 5,100 to 5,900 units).
  The showroom is in Wenatchee, where the Census counts essentially none: the second-home owners live in Chelan,
  Manson and Leavenworth and the lakeshore, 30 to 60 minutes up the valley. That matches the copy already on the site
  (`src/content/areas.ts`: Leavenworth and Chelan pages, seasonal open and close).
- **Chelan and Manson are the dense pockets** (29% and 35% of homes), then Leavenworth (14%). Together with Entiat,
  Cashmere and East Wenatchee these named places hold only about 1,500 of the 5,481. That leaves roughly 4,000
  seasonal units in places this release does not list as named towns (rural Lake Chelan shoreline, Lake Wenatchee and
  Plain, the Stehekin end). This split is subtraction, not a published figure, and carries the margins above.
  Where those owners are is a Jeramey or owners question (which lakeshore routes they already serve).
- This counts **homes, not owners**. Some seasonal units are short-term rentals, which want different offers
  (rental-ready spa packages, TOL-2906's pitch) than owner-occupied second homes. The Census does not split them.
- It does not say how many own a hot tub already. It is a market-size ceiling for the winterize / open-and-close
  service and the "spa for the second home" pitch, not a sales forecast.

## 3. DNS

Source: `dig`, DNS-over-HTTPS (dns.google) and whois/RDAP on 2026-11-17. Read-only; no record was changed.

**seasonallyliving.com** (registrar Tucows, managed through Squarespace; created 2020-05-28, **expires 2027-05-28**)

| Record | Value today |
| --- | --- |
| Nameservers | `dns1-4.p01.nsone.net` and `ns01-04.squarespacedns.com` (Squarespace's own set; whois shows the `p03` pair, a naming difference, not a second provider) |
| Apex A | `198.185.159.144`, `.145`, `198.49.23.144`, `.145` (Squarespace) |
| `www` | CNAME `ext-sq.squarespace.com`. `https://www` is the live site (HTTP 200); apex and `http` 301 to it |
| MX | five Google Workspace records (`aspmx.l.google.com` and `alt1-4`) |
| Apex TXT | **none** |
| SPF | **none** |
| DMARC (`_dmarc`) | **none** |
| DKIM (`google._domainkey`) | **none** (that selector name only; Google can use others) |
| CAA | none |

What this says:

- **Mail from `@seasonallyliving.com` is unauthenticated.** Mail goes through Google but there is no SPF, no DMARC and
  no DKIM at the standard Google selector. Gmail and Yahoo require SPF, DKIM and DMARC from bulk senders, so
  **no outreach send should happen from this domain until these exist** (this is TOL-2896's sender work and sits
  under TOL-2898/2899's blocked send).
- **The cutover is not a one-record change.** The site moves from Squarespace to Cloud Run, but the domain also
  carries live Google mail. Whatever host serves DNS after the move (Squarespace today; Bunny under the stack rules) must
  carry the five MX records, an SPF record, DKIM and DMARC across **before** nameservers change, or mail stops. This
  repo's own note that the DNS cutover "is a separate approved step" stays true.
- I can see only what resolves publicly. Subdomains (verification TXT, `mail`, etc.) cannot be listed from outside; the
  complete zone has to be exported from the Squarespace domain panel. That export is a Jeramey step (login).
- Domain renewals: **seasonallyliving.com expires 2027-05-28**. Auto-renew status is not visible publicly.

**chimchimney.biz** (Namecheap; created **2026-07-17**, expires 2027-07-17): still the Namecheap parking page (302
to `www.chimchimney.biz`), nameservers `dns1/dns2.registrar-servers.com`, forwarding mail records present. Unchanged since
`docs/TOL-2907-name-protection.md`; who registered it is still unknown (privacy-redacted).

**chimchimney.com** (GoDaddy, created 2000-03-22, expires 2027-03-22): nameservers `ns3/ns4.afternic.com`, a
domain-for-sale lander, null MX and `v=spf1 -all`. Not ours as far as anything public shows.

## 4. What an agent could not do, and the exact step for a human

| Step | Who | Exact action | Cost |
| --- | --- | --- | --- |
| Read the Google star histogram, dated 1-star reviews, and who holds owner access | Owner or Jeramey (login) | Open the listing from the Google account that manages it, Profile, Reviews | free |
| Switch primary category to a hot tub store if that is the money line (TOL-2908) | Owner login | Business Profile, Edit profile, Business category | free |
| Export the full Squarespace DNS zone | Jeramey (login) | Squarespace, Domains, seasonallyliving.com, DNS settings, copy every record (screenshot is enough) | free |
| Add SPF, DKIM, DMARC for the sending domain (before any send) | Jeramey (DNS login), after TOL-2896 picks the sender | Records come from TOL-2896's sender; Google Workspace gives its own DKIM key in Admin console, Apps, Gmail, Authenticate email | free |
| Ask Cam or Susan whether Chim-Chimney Sweeps and `chimchimney.biz` are theirs | Jeramey asks | A one-line question | free |

Not done, on purpose: no review reply, profile edit, DNS change, send or post. No Google API key was created.

## Workarounds left

none
