#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Pharos Skills — Universal Installer (v2.0)
#  github.com/hosein-ul/pharos-skills
#
#  Usage (auto-detect all installed agents):
#    curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash
#
#  Usage (specific agent):
#    ... | bash -s -- --for claude
#    ... | bash -s -- --for cursor
#    ... | bash -s -- --for windsurf
#    ... | bash -s -- --for cline
#    ... | bash -s -- --for continue
#    ... | bash -s -- --for aider
#    ... | bash -s -- --for codex
#    ... | bash -s -- --for gemini
#    ... | bash -s -- --for copilot
#    ... | bash -s -- --for anvita
#
#  Paths verified 2026-06-14 against live installs.
# ─────────────────────────────────────────────────────────────

set -e

REPO="https://github.com/hosein-ul/pharos-skills"
RAW="https://raw.githubusercontent.com/hosein-ul/pharos-skills/main"
SKILLS=("pharos-tx-guardrail" "pharos-rwa-yield-router")

# colours
GR='\033[0;32m'; CY='\033[0;36m'; YE='\033[1;33m'
RE='\033[0;31m'; DI='\033[2m'; RS='\033[0m'; BO='\033[1m'

banner() {
  printf "\n${CY}${BO}  ██████  ██   ██  █████  ██████   ██████  ███████  skills${RS}\n"
  printf "  ${DI}v2.0 · github.com/hosein-ul/pharos-skills${RS}\n\n"
}
ok()   { printf "  ${GR}✓${RS}  $1\n"; }
info() { printf "  ${CY}→${RS}  $1\n"; }
warn() { printf "  ${YE}!${RS}  $1\n"; }
skip() { printf "  ${DI}–  $1${RS}\n"; }
fail() { printf "  ${RE}✗${RS}  $1\n"; }

# ── clone one skill from a sparse monorepo ─────────────────
clone_skill() {
  local skill="$1" dest="$2"
  if [ -d "$dest" ]; then
    warn "Already installed: $dest"; return
  fi
  local tmp; tmp=$(mktemp -d)
  git clone --depth 1 --filter=blob:none --sparse --quiet "$REPO" "$tmp" 2>/dev/null
  git -C "$tmp" sparse-checkout set "$skill" --quiet 2>/dev/null
  mkdir -p "$(dirname "$dest")"
  mv "$tmp/$skill" "$dest"
  rm -rf "$tmp"
  ok "$skill → $dest"
}

# ── fetch SKILL.md via curl ────────────────────────────────
fetch_skill_md() {
  local skill="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -f "$dest" ]; then warn "Already exists: $dest"; return; fi
  curl -fsSL "$RAW/$skill/SKILL.md" -o "$dest" 2>/dev/null
  ok "$skill/SKILL.md → $dest"
}

# ── append SKILL.md content to a file ──────────────────────
append_to() {
  local dest="$1"
  mkdir -p "$(dirname "$dest")"
  for skill in "${SKILLS[@]}"; do
    printf "\n\n# === %s ===\n" "$skill" >> "$dest"
    curl -fsSL "$RAW/$skill/SKILL.md" >> "$dest" 2>/dev/null
  done
  ok "Appended both SKILL.md → $dest"
}

# ═══════════════════════════════════════════════════════════
# Agent installers  (paths verified from live installs)
# ═══════════════════════════════════════════════════════════

install_claude() {
  # Verified: ~/.claude/skills/<skill-name>/SKILL.md  (one dir per skill, flat)
  printf "\n  ${BO}Claude Code${RS}\n"
  for skill in "${SKILLS[@]}"; do
    clone_skill "$skill" "$HOME/.claude/skills/$skill"
  done
}

install_anvita() {
  printf "\n  ${BO}Anvita Flow${RS}\n"
  info "Paste this URL in your Anvita Flow Skill Hub:"
  printf "    ${CY}%s${RS}\n" "$REPO"
}

install_cursor() {
  # Verified: .cursor/rules/<name>.mdc  (project-local, .mdc extension required)
  printf "\n  ${BO}Cursor${RS}\n"
  mkdir -p .cursor/rules
  for skill in "${SKILLS[@]}"; do
    fetch_skill_md "$skill" ".cursor/rules/${skill}.mdc"
  done
}

install_windsurf() {
  # Windsurf reads .windsurfrules in project root
  # Also supports ~/.codeium/windsurf/memories/ for user-level context
  printf "\n  ${BO}Windsurf${RS}\n"
  local dest=".windsurfrules"
  if ! grep -q "pharos-tx-guardrail" "$dest" 2>/dev/null; then
    append_to "$dest"
  else
    skip "Already in .windsurfrules"
  fi
}

install_cline() {
  # Cline reads all files under .clinerules/ as workspace context
  printf "\n  ${BO}Cline${RS}\n"
  for skill in "${SKILLS[@]}"; do
    fetch_skill_md "$skill" ".clinerules/${skill}.md"
  done
}

install_continue() {
  # Continue.dev: ~/.continue/config.json  +  custom commands pointing to SKILL.md files
  printf "\n  ${BO}Continue.dev${RS}\n"
  mkdir -p "$HOME/.continue/skills"
  for skill in "${SKILLS[@]}"; do
    clone_skill "$skill" "$HOME/.continue/skills/$skill"
  done
  local cfg="$HOME/.continue/config.json"
  if [ -f "$cfg" ] && command -v node &>/dev/null; then
    node -e "
      const fs = require('fs');
      const c = JSON.parse(fs.readFileSync('$cfg','utf8'));
      c.customCommands = c.customCommands || [];
      const cmds = [
        { name:'pharos-guard', description:'Pharos TX Guardrail',
          prompt:'@~/.continue/skills/pharos-tx-guardrail/SKILL.md' },
        { name:'pharos-yield', description:'Pharos Yield Router',
          prompt:'@~/.continue/skills/pharos-rwa-yield-router/SKILL.md' }
      ];
      cmds.forEach(cmd => {
        if (!c.customCommands.find(x => x.name===cmd.name)) c.customCommands.push(cmd);
      });
      fs.writeFileSync('$cfg', JSON.stringify(c, null, 2));
    " 2>/dev/null && ok "/pharos-guard + /pharos-yield added to config.json" \
                 || warn "Manually add custom commands to ~/.continue/config.json"
  else
    info "Add @~/.continue/skills/*/SKILL.md as customCommands in ~/.continue/config.json"
  fi
}

install_aider() {
  # Aider: ~/.aider.conf.yml  read: key (global) or .aider.conf.yml per project
  printf "\n  ${BO}Aider${RS}\n"
  mkdir -p "$HOME/pharos-skills"
  for skill in "${SKILLS[@]}"; do
    clone_skill "$skill" "$HOME/pharos-skills/$skill"
  done
  local cfg="$HOME/.aider.conf.yml"
  [ -f "$cfg" ] || touch "$cfg"
  if ! grep -q "pharos-tx-guardrail" "$cfg" 2>/dev/null; then
    printf "\nread:\n  - ~/pharos-skills/pharos-tx-guardrail/SKILL.md\n  - ~/pharos-skills/pharos-rwa-yield-router/SKILL.md\n" >> "$cfg"
    ok "Added to ~/.aider.conf.yml — active in every session"
  else
    skip "Already in ~/.aider.conf.yml"
  fi
}

install_codex() {
  # OpenAI Codex CLI: marketplace system in ~/.codex/config.toml
  # Verified: onchainos-skills and uniswap-ai both use this pattern.
  # Skills land in ~/.codex/skills/pharos-skills__<skill-name>/
  printf "\n  ${BO}OpenAI Codex CLI${RS}\n"
  local cfg="$HOME/.codex/config.toml"
  if [ ! -f "$cfg" ]; then
    fail "~/.codex/config.toml not found — is Codex CLI installed?"; return
  fi
  if grep -q "pharos-skills" "$cfg" 2>/dev/null; then
    skip "pharos-skills marketplace already registered in config.toml"; return
  fi
  cat >> "$cfg" << 'TOML'

[marketplaces.pharos-skills]
source_type = "git"
source = "https://github.com/hosein-ul/pharos-skills.git"
TOML
  ok "Added [marketplaces.pharos-skills] to ~/.codex/config.toml"
  info "Restart Codex CLI — skills will install automatically on next launch"
  info "Skills will appear as: pharos-skills__pharos-tx-guardrail + pharos-skills__pharos-rwa-yield-router"
}

install_gemini() {
  # Google Gemini CLI (antigravity): ~/.gemini/antigravity/skills/<skill-name>/
  # Verified: pharos-skill-engine and circle-skills use this exact path.
  printf "\n  ${BO}Gemini CLI${RS}\n"
  local base="$HOME/.gemini/antigravity/skills"
  if [ ! -d "$HOME/.gemini/antigravity" ]; then
    fail "~/.gemini/antigravity not found — is Gemini CLI installed?"; return
  fi
  for skill in "${SKILLS[@]}"; do
    clone_skill "$skill" "$base/$skill"
  done
}

install_copilot() {
  # GitHub Copilot: .github/copilot-instructions.md (workspace-level)
  # Documented at docs.github.com/en/copilot/customizing-copilot/adding-repository-instructions
  printf "\n  ${BO}GitHub Copilot${RS}\n"
  local dest=".github/copilot-instructions.md"
  mkdir -p .github
  if grep -q "pharos-tx-guardrail" "$dest" 2>/dev/null; then
    skip "Already in $dest"; return
  fi
  append_to "$dest"
}

# ═══════════════════════════════════════════════════════════
# Auto-detect
# ═══════════════════════════════════════════════════════════
autodetect_and_install() {
  local found=0
  [ -d "$HOME/.claude/skills" ] && { install_claude; found=$((found+1)); }
  [ -d "$HOME/.codex" ] && { install_codex; found=$((found+1)); }
  [ -d "$HOME/.gemini/antigravity" ] && { install_gemini; found=$((found+1)); }
  [ -d "$HOME/.cursor" ] && { install_cursor; found=$((found+1)); }
  [ -d "$HOME/.codeium" ] && { install_windsurf; found=$((found+1)); }
  command -v aider &>/dev/null && { install_aider; found=$((found+1)); }
  [ -d "$HOME/.continue" ] && { install_continue; found=$((found+1)); }
  [ -d ".clinerules" ] || [ -f ".clinerules" ] && { install_cline; found=$((found+1)); }
  [ -d ".github" ] || command -v gh &>/dev/null && { install_copilot; found=$((found+1)); }
  if [ "$found" -eq 0 ]; then
    warn "No AI agents detected."
    printf "  Run: ${CY}curl ... | bash -s -- --for <agent>${RS}\n"
    printf "  Agents: ${DI}claude codex gemini cursor windsurf cline continue aider copilot anvita${RS}\n"
  fi
}

# ═══════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════
banner

FOR=""
while [[ $# -gt 0 ]]; do
  case "$1" in --for) FOR="$2"; shift 2;; *) shift;; esac
done

if [ -n "$FOR" ]; then
  case "$FOR" in
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
    all)
      install_claude; install_codex; install_gemini
      install_cursor; install_windsurf; install_cline
      install_continue; install_aider; install_copilot
      ;;
    *)
      fail "Unknown agent: $FOR"
      printf "  Available: ${DI}claude codex gemini cursor windsurf cline continue aider copilot anvita all${RS}\n"
      exit 1 ;;
  esac
else
  info "Auto-detecting installed agents..."
  autodetect_and_install
fi

printf "\n  ${GR}${BO}Done.${RS}\n"
printf "  ${DI}Repo: $REPO${RS}\n\n"
