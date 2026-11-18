# Make the Sanity dataset private before staff enter pre-owned costs (TOL-3348)

**Status:** code is ready (this PR). The dataset is still public. The flip is a Jeramey-only step because it
changes the live Sanity project, needs a login only he has, and may change the Sanity bill.

## Why

`studio/schemas.ts` has an "Intake (staff only)" group on `preOwnedSpa`: `acquisitionCost`, `reconCost`,
`intakeNotes`, `source`, `receivedDate`, `reconChecklist`. The public site never selects them, but the
`production` dataset (project `83r23z7t`) is public, so anyone can read them straight from the Sanity API.

Checked 2026-11-17, read-only, no token: `GET https://83r23z7t.api.sanity.io/v2025-01-01/data/query/production`
returned HTTP 200, and a count query showed 0 `preOwnedSpa` documents with any cost or notes field set.
**Nothing has leaked. Staff must not enter a cost until step 4 below passes.**

## What the code does now (this PR)

- One shared read client, `src/lib/sanity-client.ts`, used by `src/lib/sanity.ts` and `src/lib/journal.ts`.
  It sends `SANITY_READ_TOKEN` when that env var is set and sends nothing when it is not. So this change is safe
  to merge and deploy **before** the flip: with no token it behaves exactly as today.
- A 401/403 from Sanity is now logged with the cause ("dataset looks private and SANITY_READ_TOKEN is not set").
  Every read falls back to code defaults, so without that hint a private dataset with no token would look like
  "the site shows old copy" and the pre-owned gallery would silently go empty.
- `scripts/check-sanity-access.ts` (runs in CI with the other `scripts/check-*.ts`) fails if the token is not
  passed, if a second Sanity client appears, if the token env name becomes `NEXT_PUBLIC_*`, or if the public
  pre-owned query starts selecting a staff-only field.
- Not affected by the flip: images are Cloudinary IDs, not Sanity assets, so no image URL needs a token.
  The n8n social workflow already sends a Header Auth token (`automation/README.md`) and the approve route
  already sends `SANITY_WRITE_TOKEN`, so both keep working on a private dataset.

## Jeramey-only steps (in this order)

0. **Check the Sanity plan first.** Private datasets may need a paid Sanity plan (not confirmed from here:
   look at sanity.io/manage > project `83r23z7t` > Plan). If it bills monthly, that is a money decision
   to approve. **Free alternative that needs no flip:** keep costs out of Sanity entirely (spreadsheet or the
   CRM) and delete the intake cost fields from the schema in a follow-up PR.
1. **Create a read token.** sanity.io/manage > project `83r23z7t` > API > Tokens > Add API token, role
   **Viewer**, name `seasonally-living-site-read`. Copy it once.
2. **Store it** in GCP Secret Manager project `tolowa-studio` as `seasonally-living-sanity-read-token`
   (pipe with `printf`, never `echo`).
3. **Wire it into Cloud Run and deploy** the revision of this PR with `SANITY_READ_TOKEN` taken from that
   secret (`--set-secrets SANITY_READ_TOKEN=seasonally-living-sanity-read-token:latest`). Confirm the live site
   still shows Sanity-edited content before going further.
4. **Flip and prove it**:
   ```
   npx sanity@latest dataset visibility set production private    # run from studio/, logged in
   curl -s -o /dev/null -w '%{http_code}\n' "https://83r23z7t.api.sanity.io/v2025-01-01/data/query/production?query=count(*)"
   ```
   The curl must now print `401` (it printed `200` before). Then reload the live `/pre-owned` and `/journal`
   pages: they must still render real content. If they show defaults, the token is not reaching the server;
   the Cloud Run logs will say `dataset looks private and SANITY_READ_TOKEN is not set`.
5. **Undo, if the site breaks:** `npx sanity@latest dataset visibility set production public`.
6. Tell staff they can enter costs. Do the same for the Studio users: private dataset reads need a logged-in
   Sanity member, which editors already are.

## Left after the flip

- Anything else that queries the dataset anonymously (a script on someone's laptop, a Looker or n8n flow
  without a token) will start getting 401. In this repo that is nothing; `scripts/seed-*.ts` and
  `scripts/content/import-drafts.ts` already require `SANITY_TOKEN`.
- The Docker image builds without the runtime secret, so after the flip the build-time prerender uses code
  defaults and the live pages pick up Sanity content on the next 60-second revalidate. Not a bug; expect it.
- Confirm the CLI syntax with `npx sanity@latest dataset visibility --help` before running step 4.
