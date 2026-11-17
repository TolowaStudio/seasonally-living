#!/bin/bash
# Weekly draft run (TOL-3371). DRAFT ONLY: writes JSON + preview.md under $DRAFT_OUT_ROOT/<week>/.
# Never touches Sanity, Facebook, Instagram or Google. Meant for a Mini's launchd on Sunday evening.
#
#   scripts/content/run-weekly-draft.sh            # real run (needs the Anthropic key, see below)
#   scripts/content/run-weekly-draft.sh --dry-run  # prints the first prompt, no API call, no cost
#
# Key: read from GCP secret motion-anthropic-api-key (project tolowa-studio) into a mode-600 temp file,
# handed over as ANTHROPIC_API_KEY_FILE, and removed on exit. It is never echoed. Model: the script
# default (claude-haiku-5-5). Unattended rules: 60 minutes max, no Opus or Fable.
set -euo pipefail
cd "$(dirname "$0")/../.."

# launchd and cron start with PATH=/usr/bin:/bin:/usr/sbin:/sbin, which has no node or gcloud (both live
# under Homebrew), so the first scheduled run died with "node: command not found" (exit 127). Add the usual
# Homebrew and mise locations, then fail with a message that names the missing tool.
export PATH="/opt/homebrew/bin:/opt/homebrew/opt/node@22/bin:/usr/local/bin:$HOME/.local/share/mise/shims:$PATH"
need() { command -v "$1" >/dev/null 2>&1 || { echo "weekly draft: '$1' not found on PATH ($PATH); install it or fix the launchd PATH" >&2; exit 3; }; }
need node; need perl
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 22 ]; then echo "weekly draft: node $NODE_MAJOR found, 22 or newer is needed (--experimental-strip-types)" >&2; exit 3; fi

DRAFT_OUT_ROOT="${DRAFT_OUT_ROOT:-out/content-drafts/weekly}"
MODEL="${DRAFT_MODEL:-claude-haiku-5-5}"
case "$MODEL" in *opus*|*fable*) echo "refusing $MODEL: unattended runs use Haiku or Sonnet only" >&2; exit 2;; esac

DRY=()
if [ "${1:-}" = "--dry-run" ]; then DRY=(--dry-run); fi

if [ ${#DRY[@]} -eq 0 ]; then
  need gcloud
  KEYFILE="$(mktemp)"; chmod 600 "$KEYFILE"
  trap 'rm -f "$KEYFILE"' EXIT
  gcloud secrets versions access latest --secret=motion-anthropic-api-key --project=tolowa-studio | tr -d '\n' > "$KEYFILE"
  export ANTHROPIC_API_KEY_FILE="$KEYFILE"
fi

# Sunday evening: draft-week.ts defaults to the coming Monday, so the output folder is named for it.
WEEK="$(node --experimental-strip-types -e '
const d=new Date(); d.setDate(d.getDate()+((8-d.getDay())%7||7));
console.log(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)')"
OUT="$DRAFT_OUT_ROOT/$WEEK"
mkdir -p "$OUT"

# 60-minute cap. GNU `timeout` is not on stock macOS; perl is, and SIGALRM survives exec.
perl -e 'alarm 3600; exec @ARGV' -- node --experimental-strip-types scripts/content/draft-week.ts --week "$WEEK" --model "$MODEL" --out "$OUT" ${DRY[@]+"${DRY[@]}"}
echo "weekly draft: week=$WEEK out=$OUT"
