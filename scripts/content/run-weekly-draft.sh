#!/bin/bash
# Weekly draft run (TOL-3371, TS-4129). DRAFT ONLY: writes JSON + preview.md under $DRAFT_OUT_ROOT/<week>/.
# Never touches Sanity, Facebook, Instagram or Google. Meant for a Mini's launchd on Sunday evening.
#
#   scripts/content/run-weekly-draft.sh            # real run (Claude Max → Neon → Composer subscriptions)
#   scripts/content/run-weekly-draft.sh --dry-run  # prints the first prompt, no model call, no cost
#
# Model: default claude-haiku-5-5 (Haiku on Claude Max). Unattended rules: 60 minutes max, no Opus or Fable.
# No GCP secret and no paid Anthropic API key (TS-4129).
set -euo pipefail
cd "$(dirname "$0")/../.."

# launchd and cron start with PATH=/usr/bin:/bin:/usr/sbin:/sbin, which has no node (Homebrew / mise).
export PATH="/opt/homebrew/bin:/opt/homebrew/opt/node@22/bin:/usr/local/bin:$HOME/.local/share/mise/shims:$HOME/.local/bin:$PATH"
need() { command -v "$1" >/dev/null 2>&1 || { echo "weekly draft: '$1' not found on PATH ($PATH); install it or fix the launchd PATH" >&2; exit 3; }; }
need node; need perl
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 22 ]; then echo "weekly draft: node $NODE_MAJOR found, 22 or newer is needed (--experimental-strip-types)" >&2; exit 3; fi

DRAFT_OUT_ROOT="${DRAFT_OUT_ROOT:-out/content-drafts/weekly}"
MODEL="${DRAFT_MODEL:-claude-haiku-5-5}"
case "$MODEL" in *opus*|*fable*) echo "refusing $MODEL: unattended runs use Haiku or Sonnet only" >&2; exit 2;; esac

DRY=()
if [ "${1:-}" = "--dry-run" ]; then DRY=(--dry-run); fi

# Sunday evening: draft-week.ts defaults to the coming Monday, so the output folder is named for it.
WEEK="$(node --experimental-strip-types -e '
const d=new Date(); d.setDate(d.getDate()+((8-d.getDay())%7||7));
console.log(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)')"
OUT="$DRAFT_OUT_ROOT/$WEEK"
mkdir -p "$OUT"

# 60-minute cap. GNU `timeout` is not on stock macOS; perl is, and SIGALRM survives exec.
perl -e 'alarm 3600; exec @ARGV' -- node --experimental-strip-types scripts/content/draft-week.ts --week "$WEEK" --model "$MODEL" --out "$OUT" ${DRY[@]+"${DRY[@]}"}
echo "weekly draft: week=$WEEK out=$OUT"