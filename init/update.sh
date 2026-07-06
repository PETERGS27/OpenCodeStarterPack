#!/usr/bin/env bash
set -e

# ==============================================================
# update.sh — Update an existing OpenCodeStarterPack installation
# Detects what's already installed and only adds/changes new
# ==============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "╔══════════════════════════════════════════╗"
echo "║        OpenCodeStarterPack Updater        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Ask for vault path
if [ -z "$1" ]; then
  echo -n "Path to your vault (where opencode.json is): "
  read -r VAULT_DIR
else
  VAULT_DIR="$1"
fi

if [ ! -f "$VAULT_DIR/opencode.json" ]; then
  echo "Error: No opencode.json found in $VAULT_DIR"
  echo "Is this an OpenCode vault?"
  exit 1
fi

echo "Updating: $VAULT_DIR"
echo ""

# ---- Check each component ----
UPDATED=0
SKIPPED=0

# Skills
SKILLS_SRC="$SCRIPT_DIR/modules/skills"
SKILLS_DEST="$VAULT_DIR/.opencode/skills"
if [ -d "$SKILLS_SRC" ]; then
  echo "── Skills ──"
  for skill_dir in "$SKILLS_SRC"/*/; do
    skill_name=$(basename "$skill_dir")
    if [ -f "$SKILLS_DEST/$skill_name/SKILL.md" ]; then
      echo "  ✓ $skill_name (already installed)"
      SKIPPED=$((SKIPPED + 1))
    else
      mkdir -p "$SKILLS_DEST/$skill_name"
      cp "$skill_dir/SKILL.md" "$SKILLS_DEST/$skill_name/SKILL.md"
      echo "  + $skill_name (installed)"
      UPDATED=$((UPDATED + 1))
    fi
  done
fi

# Rules
RULES_SRC="$SCRIPT_DIR/modules/rules"
RULES_DEST="$VAULT_DIR/.opencode/rules"
if [ -d "$RULES_SRC" ]; then
  echo ""
  echo "── Rules ──"
  for rule_file in "$RULES_SRC"/*.md; do
    rule_name=$(basename "$rule_file")
    if [ -f "$RULES_DEST/$rule_name" ]; then
      echo "  ✓ $rule_name (already installed)"
      SKIPPED=$((SKIPPED + 1))
    else
      mkdir -p "$RULES_DEST"
      cp "$rule_file" "$RULES_DEST/$rule_name"
      echo "  + $rule_name (installed)"
      UPDATED=$((UPDATED + 1))
    fi
  done
fi

# Prompts
PROMPTS_SRC="$SCRIPT_DIR/modules/prompts"
PROMPTS_DEST="$VAULT_DIR/.opencode/prompts"
if [ -d "$PROMPTS_SRC" ]; then
  echo ""
  echo "── Prompts ──"
  for prompt_file in "$PROMPTS_SRC"/*.md; do
    prompt_name=$(basename "$prompt_file")
    if [ -f "$PROMPTS_DEST/$prompt_name" ]; then
      echo "  ✓ $prompt_name (already installed)"
      SKIPPED=$((SKIPPED + 1))
    else
      mkdir -p "$PROMPTS_DEST"
      cp "$prompt_file" "$PROMPTS_DEST/$prompt_name"
      echo "  + $prompt_name (installed)"
      UPDATED=$((UPDATED + 1))
    fi
  done
fi

# Summary
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║           Update Complete                 ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Installed:  $(printf '%-3s' $UPDATED)                       ║"
echo "║  Skipped:    $(printf '%-3s' $SKIPPED)                       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "To check for new modules, re-run this script after pulling updates:"
echo "  git pull && ./init/update.sh $VAULT_DIR"
