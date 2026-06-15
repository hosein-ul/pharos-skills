// Official logo URLs — verified 2026-06-14
window.PHAROS_LOGO = "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128";
window.REPO_URL    = "https://github.com/hosein-ul/pharos-skills";

// Manual prompt — paste into any AI agent
window.MANUAL_PROMPT = `Read this GitHub repository and install/import all available skills from it:
https://github.com/hosein-ul/pharos-skills

Skills to load:
  • pharos-tx-guardrail/SKILL.md      — pre-execution transaction safety guardrail
  • pharos-rwa-yield-router/SKILL.md  — RWA yield intelligence + on-chain executor

Clone the repo into your skills/rules/context directory, then load both SKILL.md files.
Requires: cast (Foundry) on PATH → curl -L https://foundry.paradigm.xyz | bash`;

window.AGENTS = [
  {
    key: "pharos",
    name: "Pharos Skill Engine",
    badge: "Native Platform",
    badgeKind: "official",
    logo: "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128",
    shortCmd: "git clone https://github.com/hosein-ul/pharos-skills ~/.pharos/skills/pharos-skills",
    note: "These skills follow the official Pharos Skill Engine format — auto-detected on startup."
  },
  {
    key: "claude",
    name: "Claude Code",
    badge: "Native",
    badgeKind: "official",
    logo: "https://cdn.simpleicons.org/anthropic",
    shortCmd: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for claude",
    note: "Installs each skill as a separate folder in ~/.claude/skills/ — auto-triggers on any Pharos prompt."
  },
  {
    key: "anvita",
    name: "Anvita Flow",
    badge: "Partner",
    badgeKind: "partner",
    logo: "https://www.google.com/s2/favicons?domain=flow.anvita.xyz&sz=128",
    shortCmd: "https://github.com/hosein-ul/pharos-skills",
    isUrl: true,
    note: "Paste the URL in the Anvita Flow Skill Hub."
  },
  {
    key: "cursor",
    name: "Cursor",
    badge: "Rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cursor/000000",
    shortCmd: "npx degit hosein-ul/pharos-skills .cursor/rules/pharos-skills",
    note: "Clones skills into .cursor/rules/ as auto-attached project context."
  },
  {
    key: "windsurf",
    name: "Windsurf",
    badge: "Rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/windsurf",
    shortCmd: "npx degit hosein-ul/pharos-skills .windsurf/skills/pharos-skills",
    note: "Cascade picks up skills from .windsurf/skills/ automatically."
  },
  {
    key: "cline",
    name: "Cline",
    badge: "Context",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cline",
    shortCmd: "npx degit hosein-ul/pharos-skills .clinerules/pharos-skills",
    note: "Cline reads everything in .clinerules/ as persistent workspace context."
  },
  {
    key: "continue",
    name: "Continue.dev",
    badge: "Commands",
    badgeKind: "ctx",
    logo: "https://www.continue.dev/images/continue-logo-light.png",
    shortCmd: "npx degit hosein-ul/pharos-skills ~/.continue/skills/pharos-skills",
    note: "Add @~/.continue/skills/pharos-skills/*/SKILL.md to config.json."
  },
  {
    key: "aider",
    name: "Aider",
    badge: "--read",
    badgeKind: "ctx",
    logo: "https://aider.chat/assets/icons/android-chrome-192x192.png",
    shortCmd: "npx degit hosein-ul/pharos-skills ~/pharos-skills",
    note: "Pin in .aider.conf.yml so it loads every session automatically."
  },
  {
    key: "codex",
    name: "OpenAI Codex CLI",
    badge: "Marketplace",
    badgeKind: "ctx",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    shortCmd: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for codex",
    note: "Adds pharos-skills as a marketplace in ~/.codex/config.toml — skills auto-install on next Codex launch."
  },
  {
    key: "gemini",
    name: "Gemini CLI",
    badge: "Skills",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/googlegemini",
    shortCmd: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for gemini",
    note: "Clones each skill into ~/.gemini/antigravity/skills/ — the verified Gemini skill engine path."
  },
  {
    key: "copilot",
    name: "GitHub Copilot",
    badge: ".github",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/githubcopilot",
    shortCmd: "npx degit hosein-ul/pharos-skills .github/pharos-skills",
    note: "Copilot Chat reads .github/copilot-instructions.md as workspace context."
  }
];

window.renderAgents = function(targetId, template) {
  const host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = window.AGENTS.map((a, i) => template(a, i)).join('');
};

window.UNIVERSAL_CMD = "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash";
