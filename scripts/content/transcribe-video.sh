#!/bin/bash
# Speech-to-text for a shop video (Whisper or whisper.cpp). No upload, no API keys in the repo.
#
#   scripts/content/transcribe-video.sh <video.mp4> [--out dir] [--model small] [--force]
#
# Writes <stem>.srt (and siblings) under out/content-drafts/transcripts/ by default. Then run
# scripts/content/caption-video.ts on the SRT.
#
# Tool: set WHISPER_CMD to your binary (default: whisper from `pip install openai-whisper`).
set -euo pipefail
cd "$(dirname "$0")/../.."

VIDEO="${1:-}"
if [ -z "$VIDEO" ] || [ ! -f "$VIDEO" ]; then
  echo "usage: scripts/content/transcribe-video.sh <video.mp4> [--out dir] [--model small]" >&2
  exit 2
fi
shift || true

OUT="out/content-drafts/transcripts"
MODEL="small"
FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --out) OUT="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
done

WHISPER="${WHISPER_CMD:-whisper}"
if ! command -v "$WHISPER" >/dev/null 2>&1; then
  echo "transcribe-video: '$WHISPER' not found. Install openai-whisper or set WHISPER_CMD." >&2
  exit 3
fi

mkdir -p "$OUT"
STEM="$(basename "$VIDEO" | sed 's/\.[^.]*$//')"
TMP="$OUT/.transcribe-$$"
mkdir -p "$TMP"
trap 'rm -rf "$TMP"' EXIT

# whisper writes outputs next to the input copy; keep the source video outside out/ if you prefer.
cp "$VIDEO" "$TMP/source.mp4"
"$WHISPER" "$TMP/source.mp4" --model "$MODEL" --output_format srt --output_dir "$TMP" --language en

SRT="$TMP/source.srt"
if [ ! -f "$SRT" ]; then
  echo "transcribe-video: expected $SRT from whisper" >&2
  exit 1
fi

DEST_SRT="$OUT/$STEM.srt"
if [ -e "$DEST_SRT" ] && [ "$FORCE" -eq 0 ]; then
  echo "transcribe-video: $DEST_SRT exists; delete it or pass --force" >&2
  exit 1
fi
mv "$SRT" "$DEST_SRT"
echo "transcribe-video: $DEST_SRT"
echo "Next: node --experimental-strip-types scripts/content/caption-video.ts \"$DEST_SRT\" --video \"$VIDEO\" --out out/content-drafts/captions --name $STEM"