#!/usr/bin/env bash
set -e

# ==============================================================
# OpenCodeStarterPack — install.sh
# Entry point for curl | bash, git clone, and Homebrew installs
# ==============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="https://raw.githubusercontent.com/PETERGS27/OpenCodeStarterPack/main"

PRESET=""
TARGET_DIR=""
NON_INTERACTIVE=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }

# ---- Parse args ----
while [[ $# -gt 0 ]]; do
  case $1 in
    --preset)        PRESET="$2"; shift 2 ;;
    --dir)           TARGET_DIR="$2"; shift 2 ;;
    --non-interactive) NON_INTERACTIVE=true; shift ;;
    --help|-h)       echo "Usage: install.sh [--preset <name>] [--dir <path>] [--non-interactive]"; exit 0 ;;
    *)               err "Unknown option: $1"; exit 1 ;;
  esac
done

# ---- Welcome ----
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       OpenCodeStarterPack v1.0.0         ║"
echo "║   One-command starter kit for OpenCode    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ---- OS detection ----
OS="unknown"
case "$(uname -s)" in
  Darwin*)  OS="macos" ;;
  Linux*)   OS="linux" ;;
  MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
esac
info "Detected OS: $OS"

# ---- Check for Node.js ----
HAS_NODE=false
if command -v node &>/dev/null; then
  HAS_NODE=true
  NODE_VERSION=$(node --version)
  info "Node.js found: $NODE_VERSION"
else
  warn "Node.js is not installed"
  echo ""
  echo "The interactive setup wizard needs Node.js to guide you through"
  echo "choosing the right components for your needs."
  echo ""
  if [ "$NON_INTERACTIVE" = false ]; then
    echo -n "Would you like to install Node.js now? [Y/n]: "
    read -r INSTALL_NODE
    if [[ "$INSTALL_NODE" =~ ^[Yy]?$ ]]; then
      case "$OS" in
        macos)
          if command -v brew &>/dev/null; then
            brew install node
          else
            err "Could not find Homebrew."
            echo "Install Node.js from: https://nodejs.org (download the LTS version)"
            echo "Then run this command again."
            exit 1
          fi
          ;;
        linux)
          echo "Installing Node.js via apt (may ask for sudo password)..."
          sudo apt-get update -qq && sudo apt-get install -y -qq nodejs npm
          echo ""
          ;;
        windows)
          err "On Windows, install Node.js from: https://nodejs.org"
          echo "Then run this command again."
          exit 1
          ;;
      esac
      HAS_NODE=true
      log "Node.js installed successfully"
    fi
  fi
fi

# ---- Run wizard if Node.js is available (interactive mode) ----
if [ "$HAS_NODE" = true ] && [ "$NON_INTERACTIVE" = false ]; then
  # Check if running from local repo or from curl
  if [ -f "$SCRIPT_DIR/package.json" ]; then
    # Running from local clone
    log "Starting interactive wizard..."
    cd "$SCRIPT_DIR"
    if [ ! -d "node_modules" ]; then
      npm install --no-audit --no-fund --loglevel=error
    fi
    node src/wizard.js ${PRESET:+--preset "$PRESET"} ${TARGET_DIR:+--dir "$TARGET_DIR"}
  else
    # Running from curl — fetch wizard and run
    warn "Downloading OpenCodeStarterPack..."
    TEMP_DIR=$(mktemp -d)
    curl -fsSL "$REPO_URL/src/wizard.js" -o "$TEMP_DIR/wizard.js"
    curl -fsSL "$REPO_URL/package.json" -o "$TEMP_DIR/package.json"
    cd "$TEMP_DIR"
    npm install --no-audit --no-fund --loglevel=error
    node wizard.js ${PRESET:+--preset "$PRESET"} ${TARGET_DIR:+--dir "$TARGET_DIR"}
    rm -rf "$TEMP_DIR"
  fi
  exit 0
fi

# ---- Fallback: bash-only mode (no Node.js or non-interactive) ----
if [ "$HAS_NODE" = false ]; then
  warn "Node.js is not available."
  echo ""
  echo "  You can still use this package in two ways:"
  echo ""
  echo "  Option 1 (recommended): Install Node.js and use the interactive wizard"
  echo "    npx opencode-starter-pack"
  echo ""
  echo "  Option 2: Install from GitHub repo (advanced)"
  echo "    git clone https://github.com/PETERGS27/OpenCodeStarterPack.git"
  echo "    cd OpenCodeStarterPack"
  echo "    ./install.sh"
  echo ""
  if [ "$NON_INTERACTIVE" = false ]; then
    echo -n "Open https://nodejs.org in your browser? [Y/n]: "
    read -r OPEN_NODE
    if [[ "$OPEN_NODE" =~ ^[Yy]?$ ]]; then
      case "$OS" in
        macos) open "https://nodejs.org" 2>/dev/null || true ;;
        linux) xdg-open "https://nodejs.org" 2>/dev/null || true ;;
        windows) start "https://nodejs.org" 2>/dev/null || true ;;
      esac
    fi
  fi
  echo ""
  echo "After installing Node.js, run: npx opencode-starter-pack"
  exit 0
fi

# ---- Non-interactive mode ----
info "Running in non-interactive mode..."

if [ -z "$PRESET" ]; then
  PRESET="minimal"
fi

if [ -z "$TARGET_DIR" ]; then
  TARGET_DIR="$PWD/opencode-vault"
fi

log "Preset: $PRESET"
log "Target: $TARGET_DIR"

# Try to download repo as tarball if not in local repo
if [ ! -f "$SCRIPT_DIR/package.json" ]; then
  info "Downloading OpenCodeStarterPack..."
  TEMP_DIR=$(mktemp -d)
  curl -fsSL "https://github.com/PETERGS27/OpenCodeStarterPack/archive/refs/heads/main.tar.gz" -o "$TEMP_DIR/repo.tar.gz"
  tar -xzf "$TEMP_DIR/repo.tar.gz" -C "$TEMP_DIR"
  SCRIPT_DIR="$TEMP_DIR/OpenCodeStarterPack-main"
fi

log "Applying..."
bash "$SCRIPT_DIR/init/apply.sh" --preset "$PRESET" --dir "$TARGET_DIR" --non-interactive

log "Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Open Obsidian → Open vault folder → select: $TARGET_DIR"
echo "  2. Install the Local REST API plugin in Obsidian:"
echo "     Settings → Community Plugins → Browse → 'Local REST API'"
echo "  3. Enable it → copy the token → edit opencode.json → paste it"
echo "  4. Run: cd $TARGET_DIR && opencode"
echo "  5. Connect to AI provider: /connect in opencode TUI"
echo ""
