#!/usr/bin/env bash
# ==============================================================================
#  KALI PRISON  —  installer / updater
#  github.com/the-priest/kaliprison
#
#  One-liner:
#    curl -fsSL https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh | bash
#
#  Re-run any time to UPDATE to the latest version.
#
#  Design goals: detect the OS, install only what's actually missing, and never
#  hard-fail. The game is a single self-contained index.html with no runtime
#  deps, so the only thing we truly need is a way to fetch files (you already
#  have curl/wget if you ran the one-liner) and a browser to play it in.
# ==============================================================================

# Deliberately NOT using `set -e`: we want to survive failures and route around
# them. We handle errors explicitly instead.
set -u

REPO_USER="the-priest"
REPO_NAME="kaliprison"
REPO_BRANCH="${KP_BRANCH:-main}"
REPO_URL="https://github.com/${REPO_USER}/${REPO_NAME}.git"
TARBALL_URL="https://github.com/${REPO_USER}/${REPO_NAME}/archive/refs/heads/${REPO_BRANCH}.tar.gz"
RAW_BASE="https://raw.githubusercontent.com/${REPO_USER}/${REPO_NAME}/${REPO_BRANCH}"

INSTALL_DIR="${KP_DIR:-$HOME/.local/share/kaliprison}"
DESKTOP_DIR="$HOME/.local/share/applications"
BIN_DIR="$HOME/.local/bin"

DO_DESKTOP=1
DO_UNINSTALL=0

# ---------- pretty output ----------------------------------------------------
if [ -t 1 ]; then
  G=$'\033[0;32m'; Y=$'\033[0;33m'; R=$'\033[0;31m'; B=$'\033[1m'; D=$'\033[2m'; N=$'\033[0m'
else
  G=""; Y=""; R=""; B=""; D=""; N=""
fi
log()  { printf '%s[*]%s %s\n'  "$G" "$N" "$*"; }
ok()   { printf '%s[+]%s %s\n'  "$G" "$N" "$*"; }
warn() { printf '%s[!]%s %s\n'  "$Y" "$N" "$*" >&2; }
err()  { printf '%s[x]%s %s\n'  "$R" "$N" "$*" >&2; }
die()  { err "$*"; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

banner() {
  printf '%s' "$G$B"
  cat <<'EOF'
   _  __     _ _   ___     _
  | |/ /__ _| (_) | _ \_ _(_)___ ___ _ _
  | ' </ _` | | | |  _/ '_| (_-</ _ \ ' \
  |_|\_\__,_|_|_| |_| |_| |_/__/\___/_||_|
EOF
  printf '%s  github.com/%s/%s%s\n\n' "$D" "$REPO_USER" "$REPO_NAME" "$N"
}

usage() {
  cat <<EOF
Kali Prison installer / updater

Usage:
  install.sh [options]

Options:
  --uninstall      Remove the app, launcher and icon (keeps nothing)
  --no-desktop     Install files only; skip the desktop launcher/icon
  --dir <path>     Install location (default: $INSTALL_DIR)
  --branch <name>  Git branch to track (default: $REPO_BRANCH)
  -h, --help       Show this help

Environment:
  KP_DIR, KP_BRANCH  same as --dir / --branch
EOF
}

# ---------- arg parsing -------------------------------------------------------
while [ "$#" -gt 0 ]; do
  case "$1" in
    --uninstall)  DO_UNINSTALL=1 ;;
    --no-desktop) DO_DESKTOP=0 ;;
    --dir)        INSTALL_DIR="${2:?--dir needs a path}"; shift ;;
    --branch)     REPO_BRANCH="${2:?--branch needs a name}"; shift ;;
    -h|--help)    usage; exit 0 ;;
    *)            warn "ignoring unknown option: $1" ;;
  esac
  shift
done

# ---------- privilege helper --------------------------------------------------
# Returns a command prefix to run something as root, or empty if not possible.
SUDO=""
init_priv() {
  if [ "$(id -u)" = "0" ]; then SUDO=""; return; fi
  if have sudo; then
    if sudo -n true >/dev/null 2>&1; then SUDO="sudo"; else SUDO="sudo"; fi
  elif have doas; then
    SUDO="doas"
  else
    SUDO=""
  fi
}
run_priv() {
  if [ -n "$SUDO" ]; then $SUDO "$@"; else "$@"; fi
}

# ---------- OS / package-manager detection ------------------------------------
OS="unknown"; DISTRO=""; PM=""
detect_os() {
  case "$(uname -s 2>/dev/null)" in
    Linux)  OS="linux" ;;
    Darwin) OS="macos" ;;
    *)      OS="unknown" ;;
  esac
  # Termux (Android)
  if [ -n "${PREFIX:-}" ] && printf '%s' "$PREFIX" | grep -q "com.termux"; then OS="termux"; fi
  [ -d /data/data/com.termux ] && OS="termux"

  if [ -r /etc/os-release ]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    DISTRO="${ID:-}${ID_LIKE:+ $ID_LIKE}"
  fi

  if   [ "$OS" = "termux" ] && have pkg;        then PM="pkg"
  elif have apt-get;                            then PM="apt"
  elif have apt;                                then PM="apt"
  elif have pacman;                             then PM="pacman"
  elif have dnf;                                then PM="dnf"
  elif have yum;                                then PM="yum"
  elif have zypper;                             then PM="zypper"
  elif have apk;                                then PM="apk"
  elif have xbps-install;                       then PM="xbps"
  elif have eopkg;                              then PM="eopkg"
  elif [ "$OS" = "macos" ] && have brew;        then PM="brew"
  else PM=""
  fi
  log "OS: ${OS}${DISTRO:+ ($DISTRO)} | package manager: ${PM:-none detected}"
}

# Install one package, mapping the generic name to this PM. Never aborts.
pkg_install() {
  local generic="$1" name="$1"
  [ -z "$PM" ] && { warn "no package manager; cannot install $generic"; return 1; }
  case "$PM:$generic" in
    *:chromium)
      case "$PM" in
        apt) name="chromium" ;;        # some Debians use chromium-browser
        dnf|yum) name="chromium" ;;
        pacman) name="chromium" ;;
        zypper) name="chromium" ;;
        apk) name="chromium" ;;
        brew) name="--cask chromium" ;;
        pkg) name="" ;;                # no chromium in Termux
      esac ;;
  esac
  [ -z "$name" ] && return 1
  log "installing $generic via $PM ..."
  case "$PM" in
    apt)    run_priv apt-get update -y >/dev/null 2>&1; run_priv apt-get install -y $name ;;
    pacman) run_priv pacman -Sy --noconfirm --needed $name ;;
    dnf)    run_priv dnf install -y $name ;;
    yum)    run_priv yum install -y $name ;;
    zypper) run_priv zypper --non-interactive install $name ;;
    apk)    run_priv apk add --no-progress $name ;;
    xbps)   run_priv xbps-install -Sy $name ;;
    eopkg)  run_priv eopkg -y install $name ;;
    brew)   brew install $name ;;
    pkg)    pkg install -y $name ;;
    *)      return 1 ;;
  esac
}

# Ensure a command exists; try to install it; return 0 only if present after.
ensure_cmd() {
  local cmd="$1" pkgname="${2:-$1}"
  have "$cmd" && return 0
  pkg_install "$pkgname" >/dev/null 2>&1 || true
  have "$cmd"
}

# ---------- downloader --------------------------------------------------------
# Fetch URL -> file. Tries curl, then wget, then python3, then perl.
download() {
  local url="$1" out="$2"
  if have curl; then curl -fsSL "$url" -o "$out" && return 0; fi
  if have wget; then wget -qO "$out" "$url" && return 0; fi
  if have python3; then python3 - "$url" "$out" <<'PY' && return 0
import sys,urllib.request
urllib.request.urlretrieve(sys.argv[1], sys.argv[2])
PY
  fi
  if have perl; then perl -MLWP::Simple -e 'getstore($ARGV[0],$ARGV[1]) or exit 1' "$url" "$out" && return 0; fi
  return 1
}

# ---------- uninstall ---------------------------------------------------------
do_uninstall() {
  log "uninstalling Kali Prison ..."
  rm -rf "$INSTALL_DIR"                         && ok "removed $INSTALL_DIR"      || warn "could not remove $INSTALL_DIR"
  rm -f  "$DESKTOP_DIR/kaliprison.desktop"      && ok "removed launcher"          || true
  rm -f  "$BIN_DIR/kaliprison"                  && ok "removed kaliprison command" || true
  rm -f  "$HOME/Desktop/kaliprison.desktop" 2>/dev/null || true
  have update-desktop-database && update-desktop-database "$DESKTOP_DIR" >/dev/null 2>&1 || true
  ok "done."
  exit 0
}

# ---------- fetch the repo ----------------------------------------------------
# If this script is being run from inside an existing checkout (index.html sits
# next to it), use that. Otherwise clone, or fall back to tarball.
SELF_DIR=""
detect_self_dir() {
  local src="${BASH_SOURCE[0]:-$0}"
  case "$src" in
    bash|sh|-bash|/dev/fd/*|/proc/self/fd/*) SELF_DIR="" ;;   # piped from stdin
    *) SELF_DIR="$(cd "$(dirname "$src")" 2>/dev/null && pwd)" || SELF_DIR="" ;;
  esac
}

fetch_repo() {
  detect_self_dir
  if [ -n "$SELF_DIR" ] && [ -f "$SELF_DIR/index.html" ]; then
    log "using local checkout: $SELF_DIR"
    if [ "$SELF_DIR" != "$INSTALL_DIR" ]; then
      mkdir -p "$INSTALL_DIR"
      cp -rf "$SELF_DIR"/. "$INSTALL_DIR"/ 2>/dev/null || true
    fi
    return 0
  fi

  mkdir -p "$INSTALL_DIR" || die "cannot create $INSTALL_DIR"

  # Path A: git (also handles updates cleanly)
  if ensure_cmd git; then
    if [ -d "$INSTALL_DIR/.git" ]; then
      log "updating existing install (git pull) ..."
      git -C "$INSTALL_DIR" fetch --depth 1 origin "$REPO_BRANCH" >/dev/null 2>&1 \
        && git -C "$INSTALL_DIR" reset --hard "origin/$REPO_BRANCH" >/dev/null 2>&1 \
        && { ok "updated to latest"; return 0; }
      warn "git update failed; will try a fresh fetch"
    fi
    if [ ! -e "$INSTALL_DIR/index.html" ]; then
      log "cloning $REPO_URL ..."
      if git clone --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$INSTALL_DIR" >/dev/null 2>&1; then
        ok "cloned"; return 0
      fi
      # clone into empty-but-existing dir can fail; retry via temp
      local tmp; tmp="$(mktemp -d)"
      if git clone --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$tmp/r" >/dev/null 2>&1; then
        cp -rf "$tmp/r"/. "$INSTALL_DIR"/ 2>/dev/null && { rm -rf "$tmp"; ok "cloned"; return 0; }
      fi
      rm -rf "$tmp"
      warn "git clone failed; falling back to tarball"
    fi
  else
    warn "git unavailable; using tarball download"
  fi

  # Path B: tarball (no git needed — works as long as curl/wget exists)
  local tgz; tgz="$(mktemp)"
  log "downloading tarball ..."
  if download "$TARBALL_URL" "$tgz"; then
    if have tar; then
      local tmp; tmp="$(mktemp -d)"
      if tar -xzf "$tgz" -C "$tmp" >/dev/null 2>&1; then
        local inner; inner="$(find "$tmp" -maxdepth 1 -type d -name "${REPO_NAME}-*" | head -n1)"
        [ -z "$inner" ] && inner="$tmp"
        cp -rf "$inner"/. "$INSTALL_DIR"/ 2>/dev/null
        rm -rf "$tmp" "$tgz"
        [ -f "$INSTALL_DIR/index.html" ] && { ok "installed from tarball"; return 0; }
      fi
      rm -rf "$tmp"
    else
      warn "tar missing; trying raw file download"
    fi
  fi
  rm -f "$tgz"

  # Path C: last resort — pull the essential files one by one (no tar/git)
  log "fetching essential files individually ..."
  mkdir -p "$INSTALL_DIR/assets"
  download "$RAW_BASE/index.html"        "$INSTALL_DIR/index.html"        || true
  download "$RAW_BASE/assets/trapped.svg" "$INSTALL_DIR/assets/trapped.svg" || true
  [ -f "$INSTALL_DIR/index.html" ] && { ok "fetched core files"; return 0; }

  die "could not obtain the game by any method. Check your network or install git/curl/wget."
}

# ---------- browser detection -------------------------------------------------
# Echo a launch command that opens the game as an app window where possible.
HTML_PATH=""
browser_launch_cmd() {
  HTML_PATH="$INSTALL_DIR/index.html"
  local url="file://$HTML_PATH"
  local b
  for b in chromium chromium-browser google-chrome google-chrome-stable \
           brave-browser brave microsoft-edge vivaldi-stable; do
    if have "$b"; then echo "$b --app=$url --class=KaliPrison --user-data-dir=$INSTALL_DIR/.profile"; return 0; fi
  done
  if have flatpak && flatpak info org.chromium.Chromium >/dev/null 2>&1; then
    echo "flatpak run org.chromium.Chromium --app=$url"; return 0
  fi
  if have firefox;            then echo "firefox --new-window $url"; return 0; fi
  if have epiphany;           then echo "epiphany $url"; return 0; fi          # GNOME Web (Phosh)
  if have gnome-www-browser;  then echo "gnome-www-browser $url"; return 0; fi
  if have xdg-open;           then echo "xdg-open $url"; return 0; fi
  if [ "$OS" = "macos" ];     then echo "open $url"; return 0; fi
  if [ "$OS" = "termux" ] && have termux-open; then echo "termux-open $HTML_PATH"; return 0; fi
  echo ""   # nothing found
}

# ---------- desktop integration ----------------------------------------------
deploy_desktop() {
  local launch; launch="$(browser_launch_cmd)"

  # a launcher script in the install dir keeps the .desktop simple and lets us
  # re-evaluate the browser at runtime if the user installs one later
  mkdir -p "$INSTALL_DIR"
  cat > "$INSTALL_DIR/run.sh" <<RUN
#!/usr/bin/env bash
DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
URL="file://\$DIR/index.html"
for b in chromium chromium-browser google-chrome google-chrome-stable brave-browser brave microsoft-edge vivaldi-stable; do
  command -v "\$b" >/dev/null 2>&1 && exec "\$b" --app="\$URL" --class=KaliPrison --user-data-dir="\$DIR/.profile"
done
command -v firefox  >/dev/null 2>&1 && exec firefox --new-window "\$URL"
command -v epiphany >/dev/null 2>&1 && exec epiphany "\$URL"
command -v xdg-open >/dev/null 2>&1 && exec xdg-open "\$URL"
command -v open     >/dev/null 2>&1 && exec open "\$URL"
echo "No browser found. Open this file manually: \$DIR/index.html"
RUN
  chmod +x "$INSTALL_DIR/run.sh" 2>/dev/null || true

  # a `kaliprison` command on PATH
  mkdir -p "$BIN_DIR"
  ln -sf "$INSTALL_DIR/run.sh" "$BIN_DIR/kaliprison" 2>/dev/null || true

  if [ "$OS" = "termux" ]; then
    ok "Termux detected. Launch with:  kaliprison   (or)  termux-open $INSTALL_DIR/index.html"
    return 0
  fi
  if [ "$OS" = "macos" ]; then
    ok "macOS detected. Launch with:  kaliprison   (or) double-click $INSTALL_DIR/index.html"
    return 0
  fi

  # Linux .desktop entry
  mkdir -p "$DESKTOP_DIR"
  cat > "$DESKTOP_DIR/kaliprison.desktop" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Kali Prison
GenericName=Cybersecurity Terminal Game
Comment=Trapped inside AXIOM-KALI — learn Linux and security to escape
Exec=$INSTALL_DIR/run.sh
Icon=$INSTALL_DIR/assets/trapped.svg
Terminal=false
Categories=Education;Game;
Keywords=linux;security;terminal;hacking;kali;ctf;
StartupWMClass=KaliPrison
EOF
  chmod +x "$DESKTOP_DIR/kaliprison.desktop" 2>/dev/null || true
  have update-desktop-database && update-desktop-database "$DESKTOP_DIR" >/dev/null 2>&1 || true

  if [ -z "$launch" ]; then
    warn "no browser detected. Files are installed; open $INSTALL_DIR/index.html in any browser."
    # offer to install chromium as a convenience, but never block on it
    if [ -n "$PM" ]; then
      log "attempting to install a browser (chromium) ..."
      ensure_cmd chromium chromium >/dev/null 2>&1 || ensure_cmd chromium-browser chromium >/dev/null 2>&1 || warn "browser auto-install skipped/failed"
    fi
  fi
  ok "launcher 'Kali Prison' added to your application menu"
}

# ---------- verify ------------------------------------------------------------
verify() {
  [ -f "$INSTALL_DIR/index.html" ] || die "index.html missing after install"
  if grep -q "AXIOM-KALI" "$INSTALL_DIR/index.html" 2>/dev/null; then
    ok "verified game files"
  else
    warn "index.html present but content looks unexpected (continuing)"
  fi
}

# ---------- main --------------------------------------------------------------
main() {
  banner
  init_priv
  detect_os
  [ "$DO_UNINSTALL" = "1" ] && do_uninstall

  fetch_repo
  verify
  [ "$DO_DESKTOP" = "1" ] && deploy_desktop || log "skipping desktop integration (--no-desktop)"

  echo
  ok "Kali Prison is installed at: $INSTALL_DIR"
  echo
  printf '%s  Play it:%s\n' "$B" "$N"
  printf '   • From your app menu:  search "Kali Prison"\n'
  printf '   • From a terminal:     kaliprison\n'
  printf '   • Or open directly:    %s\n' "$INSTALL_DIR/index.html"
  echo
  printf '%s  Update later:%s re-run the one-liner (or this installer) any time — it\n' "$D" "$N"
  printf '   fetches the latest version in place.%s\n' "$N"
  case ":$PATH:" in
    *":$BIN_DIR:"*) : ;;
    *) warn "add ~/.local/bin to PATH to use the 'kaliprison' command:  export PATH=\"\$HOME/.local/bin:\$PATH\"" ;;
  esac
}

main "$@"
