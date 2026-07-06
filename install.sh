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
  if [ "$NON_INTERACTIVE" = false ]; then
    echo ""
    echo "Node.js is required for the interactive setup wizard."
    echo -n "Would you like to install Node.js? [Y/n]: "
    read -r INSTALL_NODE
    if [[ "$INSTALL_NODE" =~ ^[Yy]?$ ]]; then
      case "$OS" in
        macos)
          if command -v brew &>/dev/null; then
            brew install node
          else
            err "Homebrew not found. Install Node.js manually: https://nodejs.org"
            exit 1
          fi
          ;;
        linux)
          if command -v apt-get &>/dev/null; then
            sudo apt-get update && sudo apt-get install -y nodejs npm
          else
            err "Unsupported package manager. Install Node.js manually: https://nodejs.org"
            exit 1
          fi
          ;;
        windows)
          warn "Install Node.js from: https://nodejs.org"
          exit 1
          ;;
      esac
      HAS_NODE=true
      log "Node.js installed successfully"
    fi
  fi
fi

# ---- Run wizard if Node.js is available ----
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

# ---- Fallback: bash-only mode ----
info "Running in bash-only mode..."

# Set defaults
if [ -z "$PRESET" ]; then
  if [ "$NON_INTERACTIVE" = true ]; then
    PRESET="minimal"
  else
    echo ""
    echo "Select a preset:"
    echo "  1) minimal — vault + rules + meta only"
    echo "  2) study — for students (research, web-extract, vault tools)"
    echo "  3) full — everything (skills, MCP, prompts)"
    echo -n "Choice [1/2/3] (default: 3): "
    read -r PRESET_CHOICE
    case "$PRESET_CHOICE" in
      1) PRESET="minimal" ;;
      2) PRESET="study" ;;
      *) PRESET="full" ;;
    esac
  fi
fi

if [ -z "$TARGET_DIR" ]; then
  if [ "$NON_INTERACTIVE" = true ]; then
    TARGET_DIR="$PWD/opencode-vault"
  else
    echo -n "Target directory for vault [default: $PWD/opencode-vault]: "
    read -r TARGET_DIR_INPUT
    TARGET_DIR="${TARGET_DIR_INPUT:-$PWD/opencode-vault}"
  fi
fi

log "Preset: $PRESET"
log "Target: $TARGET_DIR"

# Check if running from local repo
if [ -f "$SCRIPT_DIR/package.json" ]; then
  log "Applying from local repo..."
  bash "$SCRIPT_DIR/init/apply.sh" --preset "$PRESET" --dir "$TARGET_DIR" --non-interactive
else
  err "bash-only mode requires the full repository. Install via:"
  echo "  git clone https://github.com/PETERGS27/OpenCodeStarterPack.git"
  exit 1
fi

log "Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Open Obsidian → Settings → Local REST API → enable → copy token"
echo "  2. Edit $TARGET_DIR/opencode.json → paste token"
echo "  3. Run: cd $TARGET_DIR && opencode"
echo ""
