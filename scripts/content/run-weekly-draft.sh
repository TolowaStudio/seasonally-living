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

DRAFT_OUT_ROOT="${DRAFT_OUT_ROOT:-out/content-drafts/weekly}"
MODEL="${DRAFT_MODEL:-claude-haiku-5-5}"
case "$MODEL" in *opus*|*fable*) echo "refusing $MODEL: unattended runs use Haiku or Sonnet only" >&2; exit 2;; esac

DRY=()
if [ "${1:-}" = "--dry-run" ]; then DRY=(--dry-run); fi

if [ ${#DRY[@]} -eq 0 ]; then
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

timeout 3600 node --experimental-strip-types scripts/content/draft-week.ts --week "$WEEK" --model "$MODEL" --out "$OUT" ${DRY[@]+"${DRY[@]}"}
echo "weekly draft: week=$WEEK out=$OUT"
