#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  KALI PRISON — installer / updater
#  - Fresh install: clones (or downloads) the repo
#  - Update: pulls the latest and BLOWS AWAY the cached app profile so the new
#    version actually shows (this is the #1 reason "updates don't appear")
#  - Registers a desktop icon that opens the game in its OWN app window (no tabs)
#  Run again any time to update. Usage: bash install.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

REPO="https://github.com/the-priest/kaliprison"
ARCHIVE="https://github.com/the-priest/kaliprison/archive/refs/heads/main.tar.gz"
DIR="kaliprison"
GREEN='\033[0;32m'; DIM='\033[2;32m'; RED='\033[0;31m'; YEL='\033[0;33m'; NC='\033[0m'; BOLD='\033[1m'

banner() {
cat << 'BANNER'

  ██╗  ██╗ █████╗ ██╗     ██╗    ██████╗ ██████╗ ██╗███████╗ ██████╗ ███╗   ██╗
  ██║ ██╔╝██╔══██╗██║     ██║    ██╔══██╗██╔══██╗██║██╔════╝██╔═══██╗████╗  ██║
  █████╔╝ ███████║██║     ██║    ██████╔╝██████╔╝██║███████╗██║   ██║██╔██╗ ██║
  ██╔═██╗ ██╔══██║██║     ██║    ██╔═══╝ ██╔══██╗██║╚════██║██║   ██║██║╚██╗██║
  ██║  ██╗██║  ██║███████╗██║    ██║     ██║  ██║██║███████║╚██████╔╝██║ ╚████║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝

BANNER
}

banner
printf "${GREEN}${BOLD}INSTALLER / UPDATER${NC}\n"
printf "${DIM}──────────────────────────────────────────${NC}\n\n"

OS="$(uname -s 2>/dev/null || echo Unknown)"

# ── get or update the repo ───────────────────────────────
if [[ -d "$DIR" ]]; then
  printf "${GREEN}◇${NC} Existing install at ${BOLD}./$DIR${NC} — updating\n"
  if [[ -d "$DIR/.git" ]]; then
    (cd "$DIR" && git pull --ff-only --quiet 2>/dev/null) && printf "${GREEN}✓${NC} Pulled latest via git\n" \
      || printf "${YEL}!${NC} git pull failed (local changes?) — keeping your files\n"
  else
    printf "${DIM}  no git repo — re-downloading archive…${NC}\n"
    if command -v curl &>/dev/null; then curl -L --silent "$ARCHIVE" -o /tmp/kp.tgz
    elif command -v wget &>/dev/null; then wget -q "$ARCHIVE" -O /tmp/kp.tgz; fi
    if [[ -f /tmp/kp.tgz ]]; then
      tar xzf /tmp/kp.tgz && rm -rf "$DIR" && mv kaliprison-main "$DIR" && rm -f /tmp/kp.tgz
      printf "${GREEN}✓${NC} Re-downloaded latest\n"
    fi
  fi
else
  printf "${GREEN}◇${NC} Installing Kali Prison…\n"
  if command -v git &>/dev/null; then
    git clone --depth 1 --quiet "$REPO.git" "$DIR" && printf "${GREEN}✓${NC} Cloned via git\n"
  elif command -v curl &>/dev/null; then
    curl -L --silent "$ARCHIVE" -o /tmp/kp.tgz && tar xzf /tmp/kp.tgz && mv kaliprison-main "$DIR" && rm -f /tmp/kp.tgz
    printf "${GREEN}✓${NC} Downloaded\n"
  elif command -v wget &>/dev/null; then
    wget -q "$ARCHIVE" -O /tmp/kp.tgz && tar xzf /tmp/kp.tgz && mv kaliprison-main "$DIR" && rm -f /tmp/kp.tgz
    printf "${GREEN}✓${NC} Downloaded\n"
  else
    printf "${RED}✗${NC} Need git, curl, or wget.\n"; exit 1
  fi
fi

INSTALL_DIR="$(cd "$DIR" && pwd)"

if [[ ! -f "$INSTALL_DIR/index.html" ]]; then
  printf "${RED}✗${NC} index.html missing in $INSTALL_DIR\n"; exit 1
fi

# ── THE FIX: nuke the cached app profile so the updated game actually loads ──
if [[ -d "$INSTALL_DIR/.profile" ]]; then
  rm -rf "$INSTALL_DIR/.profile"
  printf "${GREEN}✓${NC} Cleared cached app profile (forces the new version to load)\n"
fi

chmod +x "$INSTALL_DIR/run.sh" 2>/dev/null || true

# ── register the desktop icon (Linux) ────────────────────
if [[ "$OS" == "Linux" ]]; then
  APPS_DIR="$HOME/.local/share/applications"
  mkdir -p "$APPS_DIR"
  DESKTOP_OUT="$APPS_DIR/kaliprison.desktop"

  # pick an icon: prefer the PNG, fall back to the SVG
  ICON="$INSTALL_DIR/assets/icon.png"
  [[ -f "$ICON" ]] || ICON="$INSTALL_DIR/assets/trapped.svg"

  sed -e "s#__INSTALL_DIR__#$INSTALL_DIR#g" \
      -e "s#Icon=.*#Icon=$ICON#" \
      "$INSTALL_DIR/kaliprison.desktop" > "$DESKTOP_OUT"
  chmod +x "$DESKTOP_OUT"

  # also drop a copy on the Desktop if one exists
  if [[ -d "$HOME/Desktop" ]]; then
    cp "$DESKTOP_OUT" "$HOME/Desktop/kaliprison.desktop" 2>/dev/null || true
    chmod +x "$HOME/Desktop/kaliprison.desktop" 2>/dev/null || true
    # mark trusted on GNOME/Cinnamon so it doesn't show the "untrusted" placeholder
    gio set "$HOME/Desktop/kaliprison.desktop" metadata::trusted true 2>/dev/null || true
  fi

  update-desktop-database "$APPS_DIR" 2>/dev/null || true
  printf "${GREEN}✓${NC} Desktop icon installed (Applications menu + Desktop)\n"
  printf "${DIM}  It opens the game in its OWN window — no browser tabs.${NC}\n"
fi

printf "\n${DIM}──────────────────────────────────────────${NC}\n"
printf "${GREEN}${BOLD}DONE.${NC}\n\n"
printf "Launch it any of these ways:\n"
printf "  ${BOLD}•${NC} Click the ${BOLD}Kali Prison${NC} icon (Applications menu or Desktop)\n"
printf "  ${BOLD}•${NC} Run:  ${BOLD}bash $INSTALL_DIR/run.sh${NC}\n\n"
printf "${YEL}If you ever update and still see the old version:${NC}\n"
printf "  just run ${BOLD}bash install.sh${NC} again — it clears the cache for you.\n\n"

# launch it now
bash "$INSTALL_DIR/run.sh" 2>/dev/null || true
exit 0
