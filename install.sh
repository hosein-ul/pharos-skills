#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Pharos Skills — Universal Installer
#  github.com/hosein-ul/pharos-skills
#
#  Usage (auto-detect all installed agents):
#    curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash
#
#  Usage (specific agent):
#    curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for claude
#    curl -fsSL ... | bash -s -- --for cursor
#    curl -fsSL ... | bash -s -- --for windsurf
#    curl -fsSL ... | bash -s -- --for cline
#    curl -fsSL ... | bash -s -- --for continue
#    curl -fsSL ... | bash -s -- --for aider
#    curl -fsSL ... | bash -s -- --for gemini
#    curl -fsSL ... | bash -s -- --for copilot
#    curl -fsSL ... | bash -s -- --for pharos
# ─────────────────────────────────────────────────────────────

set -e

REPO="https://github.com/hosein-ul/pharos-skills"
RAW="https://raw.githubusercontent.com/hosein-ul/pharos-skills/main"
SKILLS=(
  "pharos-tx-guardrail"
  "pharos-rwa-yield-router"
)

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
RESET='\033[0m'
BOLD='\033[1m'

banner() {
  echo ""
  echo -e "${CYAN}${BOLD}  ██████  ██   ██  █████  ██████   ██████  ███████${RESET}"
  echo -e "${CYAN}${BOLD}  ██   ██ ██   ██ ██   ██ ██   ██ ██    ██ ██${RESET}"
  echo -e "${CYAN}${BOLD}  ██████  ███████ ███████ ██████  ██    ██ ███████${RESET}"
  echo -e "${CYAN}${BOLD}  ██      ██   ██ ██   ██ ██   ██ ██    ██      ██${RESET}"
  echo -e "${CYAN}${BOLD}  ██      ██   ██ ██   ██ ██   ██  ██████  ███████  skills${RESET}"
  echo ""
  echo -e "  ${DIM}Universal Installer · v0.3 · github.com/hosein-ul/pharos-skills${RESET}"
  echo ""
}

ok()   { echo -e "  ${GREEN}✓${RESET}  $1"; }
info() { echo -e "  ${CYAN}→${RESET}  $1"; }
warn() { echo -e "  ${YELLOW}!${RESET}  $1"; }
skip() { echo -e "  ${DIM}–  $1${RESET}"; }
fail() { echo -e "  ${RED}✗${RESET}  $1"; }

# ── clone helper ──────────────────────────────────────────────
clone_into() {
  local dest="$1"
  if [ -d "$dest" ]; then
    warn "Already installed at $dest — skipping (run with --update to refresh)"
    return
  fi
  mkdir -p "$(dirname "$dest")"
  git clone --depth 1 --quiet "$REPO" "$dest" 2>/dev/null
  ok "Cloned to $dest"
}

# ── degit helper (no git history) ────────────────────────────
degit_skill() {
  local skill="$1" dest="$2"
  if [ -d "$dest" ]; then
    warn "Already installed at $dest"
    return
  fi
  mkdir -p "$(dirname "$dest")"
  if command -v npx &>/dev/null; then
    npx --yes degit "hosein-ul/pharos-skills/$skill" "$dest" --quiet 2>/dev/null
    ok "$skill → $dest"
  else
    git clone --depth 1 --quiet --filter=blob:none --sparse "$REPO" "$dest" 2>/dev/null
    git -C "$dest" sparse-checkout set "$skill" 2>/dev/null
    ok "$skill → $dest (git sparse)"
  fi
}

# ── append SKILL.md to a file ─────────────────────────────────
append_skill_md() {
  local dest="$1"
  mkdir -p "$(dirname "$dest")"
  for skill in "${SKILLS[@]}"; do
    echo "" >> "$dest"
    echo "# === $skill ===" >> "$dest"
    curl -fsSL "$RAW/$skill/SKILL.md" >> "$dest" 2>/dev/null
  done
  ok "Appended SKILL.md files → $dest"
}

# ════════════════════════════════════════════════════════════
# Agent-specific installers
# ════════════════════════════════════════════════════════════

install_pharos() {
  echo -e "\n  ${BOLD}Pharos Skill Engine${RESET}"
  clone_into "$HOME/.pharos/skills/pharos-skills"
}

install_claude() {
  echo -e "\n  ${BOLD}Claude Code${RESET}"
  clone_into "$HOME/.claude/skills/pharos-skills"
}

install_anvita() {
  echo -e "\n  ${BOLD}Anvita Flow${RESET}"
  info "Submit this URL in your Anvita Flow Skill Hub:"
  echo -e "  ${CYAN}  $REPO${RESET}"
}

install_cursor() {
  echo -e "\n  ${BOLD}Cursor${RESET}"
  mkdir -p .cursor/rules
  for skill in "${SKILLS[@]}"; do
    local out=".cursor/rules/${skill}.mdc"
    if [ -f "$out" ]; then warn "$out already exists"; continue; fi
    curl -fsSL "$RAW/$skill/SKILL.md" -o "$out" 2>/dev/null
    ok "$skill → $out"
  done
}

install_windsurf() {
  echo -e "\n  ${BOLD}Windsurf${RESET}"
  clone_into ".windsurf/skills/pharos-skills"
  append_skill_md ".windsurfrules"
}

install_cline() {
  echo -e "\n  ${BOLD}Cline${RESET}"
  clone_into ".clinerules/pharos-skills"
}

install_continue() {
  echo -e "\n  ${BOLD}Continue.dev${RESET}"
  clone_into "$HOME/.continue/skills/pharos-skills"
  local cfg="$HOME/.continue/config.json"
  if [ -f "$cfg" ] && command -v node &>/dev/null; then
    node -e "
      const fs = require('fs');
      const c = JSON.parse(fs.readFileSync('$cfg','utf8'));
      c.customCommands = c.customCommands || [];
      const cmds = [
        { name: 'pharos-guard', description: 'Pharos TX Guardrail', prompt: '@~/.continue/skills/pharos-skills/pharos-tx-guardrail/SKILL.md' },
        { name: 'pharos-yield', description: 'Pharos Yield Router', prompt: '@~/.continue/skills/pharos-skills/pharos-rwa-yield-router/SKILL.md' }
      ];
      cmds.forEach(cmd => { if (!c.customCommands.find(x => x.name === cmd.name)) c.customCommands.push(cmd); });
      fs.writeFileSync('$cfg', JSON.stringify(c, null, 2));
    " 2>/dev/null && ok "/pharos-guard and /pharos-yield added to config.json" || warn "Add custom commands to ~/.continue/config.json manually"
  else
    info "Add to ~/.continue/config.json → customCommands (see README)"
  fi
}

install_aider() {
  echo -e "\n  ${BOLD}Aider${RESET}"
  clone_into "$HOME/pharos-skills"
  local conf="$HOME/.aider.conf.yml"
  if [ ! -f "$conf" ]; then touch "$conf"; fi
  if ! grep -q "pharos-tx-guardrail" "$conf" 2>/dev/null; then
    cat >> "$conf" <<EOF

read:
  - ~/pharos-skills/pharos-tx-guardrail/SKILL.md
  - ~/pharos-skills/pharos-rwa-yield-router/SKILL.md
EOF
    ok "Added to ~/.aider.conf.yml"
  else
    skip "Already in ~/.aider.conf.yml"
  fi
}

install_codex() {
  echo -e "\n  ${BOLD}OpenAI Codex CLI${RESET}"
  local dir="$HOME/.codex"
  clone_into "$dir/pharos-skills"
  local inst="$dir/instructions.md"
  if [ ! -f "$inst" ] || ! grep -q "pharos" "$inst" 2>/dev/null; then
    echo "" >> "$inst"
    curl -fsSL "$RAW/pharos-tx-guardrail/SKILL.md"      >> "$inst" 2>/dev/null
    curl -fsSL "$RAW/pharos-rwa-yield-router/SKILL.md"  >> "$inst" 2>/dev/null
    ok "Appended → $inst"
  else
    skip "Already in $inst"
  fi
}

install_gemini() {
  echo -e "\n  ${BOLD}Gemini CLI${RESET}"
  clone_into "$HOME/.gemini/extensions/pharos-skills"
}

install_copilot() {
  echo -e "\n  ${BOLD}GitHub Copilot${RESET}"
  mkdir -p .github
  local out=".github/copilot-instructions.md"
  if [ -f "$out" ]; then
    warn "$out already exists — appending"
  fi
  for skill in "${SKILLS[@]}"; do
    echo "" >> "$out"
    curl -fsSL "$RAW/$skill/SKILL.md" >> "$out" 2>/dev/null
  done
  ok "→ $out"
}

install_hermes() {
  echo -e "\n  ${BOLD}Hermes / Local LLM (Ollama)${RESET}"
  local dir="$HOME/.ollama/pharos-skills"
  clone_into "$dir"
  local sys="$dir/system-prompt.md"
  cat > "$sys" <<'EOF'
You have two Pharos Network skills available.
EOF
  for skill in "${SKILLS[@]}"; do
    echo "" >> "$sys"
    cat "$dir/$skill/SKILL.md" >> "$sys" 2>/dev/null || \
      curl -fsSL "$RAW/$skill/SKILL.md" >> "$sys" 2>/dev/null
  done
  ok "System prompt → $sys"
  info "Use: ollama run hermes3 --system \"\$(cat $sys)\""
}

# ════════════════════════════════════════════════════════════
# Auto-detect installed agents
# ════════════════════════════════════════════════════════════

autodetect_and_install() {
  local found=0

  if [ -d "$HOME/.pharos" ] || command -v pharos-skill &>/dev/null 2>&1; then
    install_pharos; found=$((found+1))
  fi
  if [ -d "$HOME/.claude" ] || command -v claude &>/dev/null 2>&1; then
    install_claude; found=$((found+1))
  fi
  if [ -d "$HOME/.cursor" ] || find / -name "cursor" -type f -maxdepth 8 2>/dev/null | head -1 | grep -q cursor; then
    install_cursor; found=$((found+1))
  fi
  if [ -d "$HOME/.codeium" ] || command -v windsurf &>/dev/null 2>&1; then
    install_windsurf; found=$((found+1))
  fi
  if [ -f ".clinerules" ] || [ -d ".clinerules" ]; then
    install_cline; found=$((found+1))
  fi
  if [ -f "$HOME/.continue/config.json" ] || command -v continue &>/dev/null 2>&1; then
    install_continue; found=$((found+1))
  fi
  if command -v aider &>/dev/null 2>&1; then
    install_aider; found=$((found+1))
  fi
  if command -v codex &>/dev/null 2>&1; then
    install_codex; found=$((found+1))
  fi
  if command -v gemini &>/dev/null 2>&1; then
    install_gemini; found=$((found+1))
  fi
  if command -v ollama &>/dev/null 2>&1; then
    install_hermes; found=$((found+1))
  fi
  # Copilot: if .github exists or gh CLI present
  if [ -d ".github" ] || command -v gh &>/dev/null 2>&1; then
    install_copilot; found=$((found+1))
  fi

  if [ "$found" -eq 0 ]; then
    warn "No AI agents detected automatically."
    echo ""
    echo -e "  Run with ${CYAN}--for <agent>${RESET} to install manually:"
    echo -e "  ${DIM}  claude · cursor · windsurf · cline · continue · aider · codex · gemini · copilot · hermes · pharos${RESET}"
  fi
  return $found
}

# ════════════════════════════════════════════════════════════
# Main
# ════════════════════════════════════════════════════════════

banner

FOR=""
UPDATE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --for) FOR="$2"; shift 2;;
    --update) UPDATE=true; shift;;
    *) shift;;
  esac
done

if [ -n "$FOR" ]; then
  case "$FOR" in
    pharos)   install_pharos   ;;
    claude)   install_claude   ;;
    anvita)   install_anvita   ;;
    cursor)   install_cursor   ;;
    windsurf) install_windsurf ;;
    cline)    install_cline    ;;
    continue) install_continue ;;
    aider)    install_aider    ;;
    codex)    install_codex    ;;
    gemini)   install_gemini   ;;
    copilot)  install_copilot  ;;
    hermes)   install_hermes   ;;
    all)
      install_pharos; install_claude; install_cursor
      install_windsurf; install_cline; install_continue
      install_aider; install_codex; install_gemini
      install_copilot; install_hermes
      ;;
    *)
      fail "Unknown agent: $FOR"
      echo -e "  Available: ${DIM}pharos claude anvita cursor windsurf cline continue aider codex gemini copilot hermes all${RESET}"
      exit 1
      ;;
  esac
else
  info "Auto-detecting installed agents..."
  autodetect_and_install
fi

echo ""
echo -e "  ${GREEN}${BOLD}Done.${RESET} ${DIM}Pharos Skills installed.${RESET}"
echo ""
echo -e "  ${DIM}Repo:    $REPO${RESET}"
echo -e "  ${DIM}Support: github.com/hosein-ul/pharos-skills/issues${RESET}"
echo ""
