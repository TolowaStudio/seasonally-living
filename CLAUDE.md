# seasonally-living

## Project
Showroom/retail website for Seasonally Living — an outdoor living product business (fireplaces, hot tubs, outdoor kitchens). Next.js 16 marketing + showroom site.

## Deploy
- Platform: Vercel (scope: tolowastudio)
- Framework: Next.js 16
- Git: github.com/jerameyjames/seasonally-living
- Production: seasonally-living.com (or TBD — confirm in Vercel dashboard)

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
- Add @vercel/analytics or Umami for traffic tracking
- Wire contact form to email (Resend) or CRM
- Add Sentry for error monitoring when site goes live
