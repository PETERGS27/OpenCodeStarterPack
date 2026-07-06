#!/usr/bin/env bash
set -e

# ==============================================================
# apply.sh — Apply selected modules to a target vault directory
# Used by install.sh and update.sh
# ==============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRESET="full"
TARGET_DIR=""
NON_INTERACTIVE=false
GENERATE_START=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --preset)  PRESET="$2"; shift 2 ;;
    --dir)     TARGET_DIR="$2"; shift 2 ;;
    --non-interactive) NON_INTERACTIVE=true; shift ;;
    --generate-start) GENERATE_START=true; shift ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

if [ -z "$TARGET_DIR" ]; then
  echo "Error: --dir is required"
  exit 1
fi

# ---- Source preset ----
PRESET_FILE="$SCRIPT_DIR/presets/$PRESET.json"
if [ ! -f "$PRESET_FILE" ]; then
  echo "Error: preset '$PRESET' not found"
  exit 1
fi

# ---- Create vault structure ----
echo "Creating vault structure..."
mkdir -p "$TARGET_DIR"/{INBOX/{AI_READED,RAW},DESKTOP,FILES,INDEXES,".opencode/skills","CACHE/AI"}

# ---- Create .opencode/.gitignore ----
if [ ! -f "$TARGET_DIR/.opencode/.gitignore" ]; then
  cat > "$TARGET_DIR/.opencode/.gitignore" << 'EOF'
node_modules
package.json
package-lock.json
bun.lock
.gitignore
EOF
  echo "  Created .opencode/.gitignore"
fi

# ---- Copy skills ----
SKILLS_DIR="$SCRIPT_DIR/modules/skills"
if [ -d "$SKILLS_DIR" ]; then
  for skill_dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    mkdir -p "$TARGET_DIR/.opencode/skills/$skill_name"
    if [ -f "$skill_dir/SKILL.md" ]; then
      cp "$skill_dir/SKILL.md" "$TARGET_DIR/.opencode/skills/$skill_name/SKILL.md"
      echo "  Skill: $skill_name"
    fi
  done
fi

# ---- Copy rules ----
if [ -f "$SCRIPT_DIR/modules/rules/vault-rules.md" ]; then
  cp "$SCRIPT_DIR/modules/rules/vault-rules.md" "$TARGET_DIR/.opencode/rules/vault-rules.md"
  echo "  Rules: vault-rules.md"
fi

# ---- Generate start.sh (quick launch) ----
if [ "$GENERATE_START" = true ] && [ ! -f "$TARGET_DIR/start.sh" ]; then
  BYTESTASH_DIR="${HOME}/Documents/Docker/Bytestash"
  cat > "$TARGET_DIR/start.sh" << 'SHEOF'
#!/bin/bash
set -e

BYTESTASH_DIR="$([ -n "$BYTESTASH_DIR" ] && echo "$BYTESTASH_DIR" || echo "${HOME}/Documents/Docker/Bytestash")"
VAULT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo "Stopping Bytestash..."
  (cd "$BYTESTASH_DIR" && docker compose down 2>/dev/null || true)
  echo "Done."
}

trap cleanup EXIT

echo "Starting Bytestash..."
(cd "$BYTESTASH_DIR" && docker compose up -d)

echo "Waiting for Bytestash to be ready..."
sleep 3

echo "Opening Bytestash in Obsidian..."
if command -v open &>/dev/null; then
  open "obsidian://web-open?url=http://localhost:7654/" 2>/dev/null || echo "  (could not open Bytestash in Obsidian)"
fi

echo "Starting OpenCode..."
cd "$VAULT_DIR"
opencode
SHEOF
  chmod +x "$TARGET_DIR/start.sh"
  echo "  Generated: start.sh (quick launch)"
  echo "  ⚠  Requires Obsidian Surfing plugin for ByteStash integration"
fi

# ---- Generate README if not exists ----
if [ ! -f "$TARGET_DIR/README.md" ]; then
  cat > "$TARGET_DIR/README.md" << 'EOF'
# Vault

Obsidian vault powered by OpenCodeStarterPack.

## Structure
- `DESKTOP/` — active notes
- `FILES/` — organized materials by topic
- `INDEXES/` — topic indexes and reading list
- `INBOX/` — incoming content (AI_READED, RAW)
- `CACHE/AI/` — meta-files
EOF
  echo "  Created README.md"
fi

echo ""
echo "Apply complete: $TARGET_DIR"
