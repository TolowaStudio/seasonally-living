#!/bin/bash
# Installs (or removes) the Sunday weekly-draft launchd job (TOL-3371). The template has two kinds of
# placeholder (user home, checkout path); doing that by hand is how a job ends up pointing at nothing.
# Run it ON THE MINI that should draft (never a laptop: unattended runs stay off the laptop).
#
#   scripts/content/install-weekly-schedule.sh              # print the rendered plist, change nothing
#   scripts/content/install-weekly-schedule.sh --install    # write ~/Library/LaunchAgents/... and load it
#   scripts/content/install-weekly-schedule.sh --uninstall  # unload and delete it
#   --no-load   with --install or --uninstall: touch the file only, never launchctl (used by the check)
#
# Draft only: the job runs run-weekly-draft.sh, which never touches Sanity, Facebook, Instagram or Google.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
LABEL="com.tolowa.seasonally-living.draft-week"
TEMPLATE="$REPO/automation/launchd/$LABEL.plist"
DEST_DIR="${LAUNCH_AGENTS_DIR:-$HOME/Library/LaunchAgents}"
DEST="$DEST_DIR/$LABEL.plist"

MODE="print"; LOAD=1
for a in "$@"; do case "$a" in
  --install) MODE="install";; --uninstall) MODE="uninstall";; --no-load) LOAD=0;;
  *) echo "usage: $0 [--install [--no-load] | --uninstall]" >&2; exit 2;;
esac; done

render() {
  # Longest placeholder first. '|' as the sed delimiter because the values are paths.
  sed -e "s|/Users/REPLACE_ME/repos/seasonally-living|$REPO|g" -e "s|/Users/REPLACE_ME|$HOME|g" "$TEMPLATE"
}

case "$MODE" in
  print) render ;;
  install)
    [ -f "$REPO/scripts/content/run-weekly-draft.sh" ] || { echo "missing run-weekly-draft.sh under $REPO" >&2; exit 3; }
    mkdir -p "$DEST_DIR" "$HOME/Library/Logs"
    render > "$DEST.tmp"
    if grep -q REPLACE_ME "$DEST.tmp"; then rm -f "$DEST.tmp"; echo "placeholder left in the rendered plist" >&2; exit 3; fi
    if command -v plutil >/dev/null 2>&1; then plutil -lint "$DEST.tmp" >/dev/null || { rm -f "$DEST.tmp"; echo "rendered plist is invalid" >&2; exit 3; }; fi
    mv "$DEST.tmp" "$DEST"
    if [ "$LOAD" -eq 1 ]; then
      launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
      launchctl bootstrap "gui/$(id -u)" "$DEST"
    fi
    echo "installed $DEST (Sundays 18:00 machine time). Undo: $0 --uninstall" ;;
  uninstall)
    if [ "$LOAD" -eq 1 ]; then launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true; fi
    rm -f "$DEST"; echo "removed $DEST" ;;
esac
