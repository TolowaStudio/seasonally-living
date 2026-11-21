#!/bin/bash
# End-to-end video draft pipeline (TS-3293): optional transcribe → caption cleanup → optional draft copy.
# Posting is dry-run unless you pass --post-send (needs Meta token and Jeramey go-ahead).
#
#   scripts/content/run-video-pipeline.sh <video.mp4> [--skip-transcribe] [--srt file] [--draft] [--post-send]
#
# Videos stay on disk under out/content-drafts/video/ (copy your masters there for bookkeeping).
set -euo pipefail
cd "$(dirname "$0")/../.."

VIDEO="${1:-}"
if [ -z "$VIDEO" ] || [ ! -f "$VIDEO" ]; then
  echo "usage: scripts/content/run-video-pipeline.sh <video.mp4> [--skip-transcribe] [--srt file] [--draft] [--post-send]" >&2
  exit 2
fi
shift || true

SKIP_TRANSCRIBE=0
SRT=""
DRAFT=0
POST_SEND=0
while [ $# -gt 0 ]; do
  case "$1" in
    --skip-transcribe) SKIP_TRANSCRIBE=1; shift ;;
    --srt) SRT="$2"; shift 2 ;;
    --draft) DRAFT=1; shift ;;
    --post-send) POST_SEND=1; shift ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
done

STEM="$(basename "$VIDEO" | sed 's/\.[^.]*$//')"
CAP_DIR="out/content-drafts/captions"
mkdir -p "$CAP_DIR" out/content-drafts/transcripts out/content-drafts/video

if [ "$SKIP_TRANSCRIBE" -eq 0 ] && [ -z "$SRT" ]; then
  scripts/content/transcribe-video.sh "$VIDEO"
  SRT="out/content-drafts/transcripts/$STEM.srt"
fi
[ -n "$SRT" ] || { echo "run-video-pipeline: pass --srt or allow transcribe" >&2; exit 2; }
[ -f "$SRT" ] || { echo "run-video-pipeline: missing $SRT" >&2; exit 2; }

node --experimental-strip-types scripts/content/caption-video.ts "$SRT" --video "$VIDEO" --out "$CAP_DIR" --name "$STEM"

TXT="$CAP_DIR/$STEM.transcript.txt"
if [ "$DRAFT" -eq 1 ]; then
  if [ -z "${ANTHROPIC_API_KEY:-}${ANTHROPIC_API_KEY_FILE:-}" ]; then
    echo "run-video-pipeline: --draft needs ANTHROPIC_API_KEY or ANTHROPIC_API_KEY_FILE" >&2
    exit 3
  fi
  node --experimental-strip-types scripts/content/draft-from-transcript.ts "$TXT" --line local
fi

JSON="$(ls -1 out/content-drafts/transcripts/*"$STEM"*.json 2>/dev/null | head -1 || true)"
POST_ARGS=(--video "$VIDEO" --srt "$CAP_DIR/$STEM.srt")
if [ -n "$JSON" ] && [ -f "$JSON" ]; then POST_ARGS+=(--draft-json "$JSON"); fi
if [ "$POST_SEND" -eq 1 ]; then POST_ARGS+=(--send); else POST_ARGS+=(--dry-run); fi
node --experimental-strip-types scripts/content/post-video.ts "${POST_ARGS[@]}"