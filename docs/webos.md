# WebOS priority — Seasonally Living

**Ordering:** Website design, build, and production launch (this repo + Cloud Run + DNS/redirects) is **Gate 0**. **Campaign 01** (CRM reactivation) runs **after** the new site is live so CTAs resolve to production URLs on the new stack.

**Reference:** Legacy public site — `https://www.seasonallyliving.com/` — use for content parity and redirect mapping, not as the long-term codebase.

**Notion**

- Project hub: [Seasonally Living — Project Hub](https://www.notion.so/Seasonally-Living-Project-Hub-34332e0a5474811d91a9e3e2c925c572)
- Campaign spec (gated): [Campaign 01 runbook](https://www.notion.so/Campaign-01-Runbook-Daily-Scorecard-Operator-Checklist-Hot-Tub-CRM-Reactivation-34332e0a547481a0b52ac07384789ce1)

**WebOS track (typical milestones)**

1. IA + sitemap vs legacy; design approval (visual system + key templates).
2. Build in repo; `/book` + campaign paths wired to real scheduler/form URLs.
3. Content parity pass; SEO basics; analytics.
4. Redirect map + QA; cutover window; production domain on Cloud Run (or agreed host).
5. Mark site launch complete in WebOS → then schedule Campaign 01 against frozen CTAs.

**Build env:** set `NEXT_PUBLIC_SITE_URL` to the stable public URL (production domain) so metadata, `sitemap.xml`, and Open Graph resolve correctly. Add scheduler + form URLs when ready.

**Stitch:** visual system + screen work lives in Stitch; map tokens into `src/styles/stitch-tokens.css` / `--sl-*` variables. See `docs/stitch.md`.
