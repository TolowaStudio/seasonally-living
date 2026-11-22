# seasonally-living

## Project
Showroom/retail website for Seasonally Living — an outdoor living product business (fireplaces, hot tubs, outdoor kitchens). Next.js 16 marketing + showroom site.

## Deploy
- Platform: Google Cloud Run (`Dockerfile`, project tolowa-studio, us-west1). Vercel is retired (TOL-655)
- Framework: Next.js 16
- Git: github.com/tolowa-studio/seasonally-living
- Production: www.seasonallyliving.com (currently Squarespace; DNS cutover to Cloud Run is a separate approved step)

## Local dev
```bash
npm ci
npm run dev  # → http://localhost:3000
```

## Stack
- Next.js 16 (App Router)
- No CMS yet — content hardcoded in components
- No analytics yet

## Routes
| Path | Purpose |
|---|---|
| `/` | Homepage |
| `/fireplaces` | Fireplace products |
| `/hot-tubs` | Hot tub products |
| `/outdoor-kitchens` | Outdoor kitchen products |
| `/showroom` | Showroom page |
| `/contact` | Contact form |
| `/book` | Booking page |
| `/campaign` | Campaign/promo page |

## Next steps (MOTION upgrade)
- Add Sanity CMS for product content management
- Add Umami for traffic tracking
- Wire contact form to email (Resend) or CRM
- Add Sentry for error monitoring when site goes live

## Agent PRs: `Builder:` line and `Refs TS-n`

Agents that open a PR here (Claude, T3 or any other) follow the Shop rules in parent TS-2743 (TOL-3813):

- **Every agent PR body has a `Builder: <model>` line** naming the model that wrote the code, e.g. `Builder: Composer 2.5`. Reviewers who are not the builder are chosen from this line; without it the PR is held and nobody reviews it.
- **A PR that does not finish its ticket says `Refs TS-<n> (does not close it)`**, never `Closes`/`Fixes`/`Resolves`. Plane closes a ticket on merge from any closing word, so a closing word on a partial step closes the ticket early.
- **This public site is held for release.** Agent PRs here are never merged by an agent and never auto-merged. Only Jeramey releases them. Do not remove a `hold` label or run `tolowa-merge` on them.
