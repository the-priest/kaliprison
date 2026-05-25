#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  KALI PRISON — app launcher
#  Opens the game in its OWN standalone window (no browser tabs, no URL bar),
#  using a Chromium-family browser in --app mode. Falls back to a normal
#  browser if none is found. Always loads the CURRENT file (no stale cache).
#  Usage: bash run.sh   (or just double-click it / the desktop icon)
# ─────────────────────────────────────────────────────────────────────────────
set -e

# resolve the real directory of THIS script, even via symlink/desktop icon
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
HERE="$(cd -P "$(dirname "$SOURCE")" && pwd)"
GAME="$HERE/index.html"

if [[ ! -f "$GAME" ]]; then
  echo "index.html not found next to run.sh. Build it first:"
  echo "  cd build && npm install && npm run build"
  exit 1
fi

# file:// URL to the game
URL="file://$GAME"

# dedicated profile dir so the app window is separate from your normal browsing
PROFILE="$HERE/.profile"
mkdir -p "$PROFILE"

# app-mode flags: standalone window, no tabs/omnibox, disabled cache so updates always show
APPFLAGS=(
  "--app=$URL"
  "--user-data-dir=$PROFILE"
  "--no-first-run"
  "--no-default-browser-check"
  "--disable-application-cache"
  "--disk-cache-size=1"
  "--window-size=1100,760"
  "--class=KaliPrison"
  "--name=KaliPrison"
  "--disable-brave-update"
  "--disable-features=BraveRewards,BraveWallet,BraveVPN,BraveAds,Translate"
)

# find a Chromium-family browser (covers Chrome, Chromium, Brave, Edge, Vivaldi)
CHROME=""
for c in \
  brave-browser brave brave-browser-stable \
  google-chrome-stable google-chrome chromium chromium-browser \
  microsoft-edge-stable vivaldi-stable \
  /usr/bin/brave-browser /snap/bin/brave /usr/bin/google-chrome /usr/bin/chromium /snap/bin/chromium ; do
  if command -v "$c" &>/dev/null; then CHROME="$c"; break; fi
done
# Flatpak Brave (common on Mint): use it if no native binary was found
if [[ -z "$CHROME" ]] && command -v flatpak &>/dev/null && flatpak info com.brave.Browser &>/dev/null; then
  CHROME="flatpak run com.brave.Browser"
fi

if [[ -n "$CHROME" ]]; then
  echo "Launching Kali Prison as a standalone app via: $CHROME"
  # detach so the terminal/icon doesn't stay tied to it
  # shellcheck disable=SC2086  (CHROME may be "flatpak run com.brave.Browser" — intentional word split)
  nohup $CHROME "${APPFLAGS[@]}" >/dev/null 2>&1 &
  disown 2>/dev/null || true
  exit 0
fi

# Firefox fallback — can't do a true app window, but open a clean dedicated window
if command -v firefox &>/dev/null; then
  echo "No Chromium-family browser found. Opening in a Firefox window."
  echo "(For a true app-style window with no tabs, install Chromium: sudo apt install chromium)"
  nohup firefox --new-window "$URL" >/dev/null 2>&1 &
  disown 2>/dev/null || true
  exit 0
fi

# last resort — default handler (will be a tab)
echo "No Chromium or Firefox found. Opening with the system default (may be a browser tab)."
( xdg-open "$URL" 2>/dev/null || open "$URL" 2>/dev/null || sensible-browser "$URL" 2>/dev/null ) &
exit 0
