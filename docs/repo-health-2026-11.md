# Repo health pass — November 2026

Docs-only health check. No site code touched. Run against `main`
(`511ca88`, 2026-05-05) with Node v22.23.4 / npm 10.9.9.

## `npm ci && npm run build && npm run lint`

| Step | Result |
|---|---|
| `npm ci` | Clean install, 359 packages, 3m. Reports 20 vulnerabilities (see audit below). |
| `npm run build` (`next build`) | **Pass.** Compiles in ~20s, TypeScript check ~10s, all 11 routes prerender as static (`○`): `/`, `/_not-found`, `/book`, `/campaign/crm-reactivation`, `/contact`, `/fireplaces`, `/hot-tubs`, `/outdoor-kitchens`, `/robots.txt`, `/showroom`, `/sitemap.xml`. |
| `npm run lint` (`eslint`) | **Pass.** No warnings or errors. |

Site builds clean today; the risk here is dependency drift, not broken code.

## `npm audit` summary

20 vulnerabilities: 1 low, 10 moderate, 8 high, 1 critical — all in
`devDependencies`/transitive build tooling (eslint toolchain, Next's own
`postcss`/`sharp`/`next` version pin, `js-yaml`, `nanoid`, `browserslist`,
`brace-expansion`, `zod`, `source-map-js`, `@babel/core`, `@humanfs/node`).
None are runtime-reachable from this static site's own code — they come in
through `eslint-config-next` → `typescript-eslint` and Next's bundled deps.

- `npm audit fix` resolves most of these without breaking changes.
- The critical one (`next` <16.4.0, GHSA-8h8q-6873-q5fj and ~25 other
  advisories bundled under the same range) and the `postcss`/`sharp` highs
  only clear via `npm audit fix --force`, which bumps `next` to `16.4.6` —
  outside the `16.2.3` currently pinned in `package.json`. That's a real
  version bump, not a patch; it needs its own PR with a build/visual check,
  not a docs-only change.

## Outdated dependencies (`npm outdated`)

| Package | Current | Wanted | Latest |
|---|---|---|---|
| next | 16.2.3 | 16.2.3 | **16.4.6** |
| eslint-config-next | 16.2.3 | 16.2.3 | **16.4.6** |
| react / react-dom | 19.2.4 | 19.2.4 | 19.3.1 |
| @types/react / @types/react-dom | 19.2.14 / 19.2.3 | 19.3.0 | 19.3.0 |
| tailwindcss / @tailwindcss/postcss | 4.2.2 | 4.3.5 | 4.3.5 |
| eslint | 9.39.4 | 9.39.5 | 10.14.0 |
| @types/node | 20.19.39 | 20.19.43 | 26.6.6 |
| typescript | 5.9.3 | 5.9.3 | 7.0.2 |

`next`/`eslint-config-next` are the only packages stuck below even their own
"wanted" range — everything else is a routine minor/patch bump. No `engines`
field or `.nvmrc` pins a Node version; CI (if added) and local dev could
silently drift onto a different Node major.

## Vercel config (`vercel.json`, `.vercel/project.json`)

```json
{ "framework": "nextjs", "scope": "tolowastudio" }
```

- Project is linked (`.vercel/project.json` committed intentionally per
  `.gitignore` comment, so `vercel deploy` works post-clone):
  `projectId: prj_1z2mJB2sriBduMBEoZgEh62FfPWa`,
  `orgId: team_VXgn8H1ps59Gt0dAIPFrn2JG`.
- `.env.example` documents `NEXT_PUBLIC_SITE_URL` as Production-only, left
  unset for Preview so `VERCEL_URL` covers PR previews — consistent with
  `docs/webos.md`'s note on the same variable.
- **Deploy target is ambiguous.** `main` is wired for Vercel, but an
  unmerged branch `migrate/cloudflare-pages` (last pushed 2026-08-18,
  commit `4435072`, "build: add Cloud Run Dockerfile, migrate off
  Cloudflare Pages") adds a `Dockerfile`/`nginx.conf` and claims it's
  "Deployed and verified live at
  `https://seasonally-living-895468771800.us-west1.run.app`." That branch
  was never merged to `main` and `vercel.json`/`.vercel/project.json` still
  point at Vercel. Three months later it's unclear which target is actually
  current for this site — that ambiguity, not Cloudflare itself, is the
  finding (the branch name is legacy; the diff is a Cloud Run migration,
  and Cloud Run is the standing runtime target for Tolowa projects).

## Missing CI

No `.github/workflows` directory — confirmed, nothing runs `npm ci`, the
build, or lint on PRs or pushes to `main`. Combined with push-to-`main`
triggering a Vercel redeploy, a broken build only surfaces after it's live.

## Recommended next 3 tickets

1. **Add CI**: a GitHub Actions workflow running `npm ci && npm run build
   && npm run lint` on PRs against `main` (and on push, for visibility).
   This alone would have caught nothing today — build and lint are clean —
   but it's the only thing standing between the next broken commit and a
   live redeploy.
2. **Resolve the deploy-target ambiguity**: decide whether `main` ships via
   Vercel (current `vercel.json`) or the unmerged Cloud Run branch is the
   real target, close out `migrate/cloudflare-pages` one way or the other,
   and delete it if superseded. Three months stale is long enough that
   someone could ship against the wrong assumption.
3. **Dependency maintenance pass**: `npm audit fix` for the non-breaking
   fixes, then a separate PR to bump `next`/`eslint-config-next` to
   `16.4.6` (clears the critical + two high advisories) with a build and a
   manual check of the 8 routes above. Low urgency — this is a
   showroom/marketing site with no auth or user data — but worth doing
   before the gap widens further.
