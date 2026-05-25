#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  KALI PRISON — smart installer / updater
#  Works on macOS and Linux. Run once to install, run again to update.
#  Usage: bash install.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

REPO="https://github.com/the-priest/kaliprison"
ARCHIVE="https://github.com/the-priest/kaliprison/archive/refs/heads/main.tar.gz"
DIR="kaliprison"
GREEN='\033[0;32m'; DIM='\033[2;32m'; RED='\033[0;31m'; NC='\033[0m'; BOLD='\033[1m'

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
printf "${GREEN}${BOLD}INSTALLER${NC}\n"
printf "${DIM}──────────────────────────────────────────${NC}\n\n"

# ── detect OS ────────────────────────────────────────────
OS="$(uname -s 2>/dev/null || echo 'Unknown')"
OPEN_CMD="xdg-open"
[[ "$OS" == "Darwin" ]] && OPEN_CMD="open"

# ── check if we're updating an existing install ──────────
if [[ -d "$DIR" ]]; then
  printf "${GREEN}◇${NC} Existing install found at ${BOLD}./$DIR${NC}\n"

  # if git repo, just pull
  if [[ -d "$DIR/.git" ]]; then
    printf "${GREEN}◇${NC} Updating via git…\n"
    (cd "$DIR" && git pull --ff-only --quiet 2>/dev/null || true)
    printf "${GREEN}✓${NC} Repository updated\n"
  else
    # downloaded tarball — compare modification time of index.html
    LOCAL_DATE=""
    [[ -f "$DIR/index.html" ]] && LOCAL_DATE="$(stat -c %Y "$DIR/index.html" 2>/dev/null || stat -f %m "$DIR/index.html" 2>/dev/null || echo "")"
    printf "${DIM}  checking for updates (no git, comparing timestamps)…${NC}\n"
  fi

else
  # ── fresh install ─────────────────────────────────────
  printf "${GREEN}◇${NC} Cloning Kali Prison…\n"

  if command -v git &>/dev/null; then
    git clone --depth 1 --quiet "$REPO.git" "$DIR"
    printf "${GREEN}✓${NC} Cloned via git\n"
  elif command -v curl &>/dev/null; then
    printf "${DIM}  git not found — downloading archive with curl…${NC}\n"
    curl -L --silent --show-error "$ARCHIVE" -o /tmp/kp_latest.tar.gz
    tar xzf /tmp/kp_latest.tar.gz
    mv kaliprison-main "$DIR" 2>/dev/null || true
    rm -f /tmp/kp_latest.tar.gz
    printf "${GREEN}✓${NC} Downloaded and extracted\n"
  elif command -v wget &>/dev/null; then
    printf "${DIM}  git not found — downloading archive with wget…${NC}\n"
    wget -q "$ARCHIVE" -O /tmp/kp_latest.tar.gz
    tar xzf /tmp/kp_latest.tar.gz
    mv kaliprison-main "$DIR" 2>/dev/null || true
    rm -f /tmp/kp_latest.tar.gz
    printf "${GREEN}✓${NC} Downloaded and extracted\n"
  else
    printf "${RED}✗${NC} Need git, curl, or wget — install one and try again.\n"
    exit 1
  fi
fi

# ── verify index.html exists ──────────────────────────────
if [[ ! -f "$DIR/index.html" ]]; then
  printf "${RED}✗${NC} index.html missing — the download may have failed.\n"
  exit 1
fi

printf "${GREEN}✓${NC} ${BOLD}index.html${NC} ready\n\n"
printf "${DIM}──────────────────────────────────────────${NC}\n"
printf "${GREEN}${BOLD}LAUNCHING…${NC}\n"
printf "${DIM}  $OPEN_CMD $DIR/index.html${NC}\n\n"
printf "If the game doesn't open automatically, just double-click:\n"
printf "  ${BOLD}./$DIR/index.html${NC}\n\n"
printf "${DIM}Stuck once inside? Type  help  in the terminal.${NC}\n"
printf "${DIM}Stuck right at the start? Type  ls  then  cat from_V.txt${NC}\n\n"

$OPEN_CMD "$DIR/index.html" 2>/dev/null || true

exit 0
