## What
Adds `.github/workflows/ci.yml` to seasonally-living, which had no workflow. Without one the merge app reports `checks=nochecks` and never auto-merges (TOL-3005; open PRs #19, #20, #21 are stuck on it).

Job `gates` on `ubuntu-latest` (same runner as aspw-experience and kinetic-blooms): `npm ci`, `npx tsc --noEmit`, `npm run lint`, every `scripts/check-*.ts` (currently `check-brand-content.ts`), `npm run build`. Triggers: PRs and pushes on `main`.

All five steps pass locally on a fresh clone of main.

## Review needs
Workflow files are a sensitive path: this PR needs **two APPROVEs from two different models, neither the builder**.

## Undo
Revert this PR, or delete `.github/workflows/ci.yml`.

Builder: Claude (Sonnet 5.5)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
