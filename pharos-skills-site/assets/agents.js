// Official logo URLs — verified 2026-06-14
// All install paths verified from official documentation:
// - Claude Code:    ~/.claude/skills/<skill>/SKILL.md
// - Hermes Agent:   ~/.hermes/skills/<category>/<skill>/   (hermes-agent.nousresearch.com docs)
// - OpenClaw:       ~/.openclaw/skills/<skill>/            (docs.openclaw.ai)
// - Codex CLI:      ~/.codex/config.toml marketplace      (live confirmed)
// - Gemini CLI:     ~/.gemini/antigravity/skills/<skill>/ (live confirmed)
// - Cursor:         .cursor/rules/<name>.mdc              (cursor.com docs)
// - Windsurf:       .windsurfrules  OR  ~/.codeium/windsurf/memories/global_rules.md
// - Cline:          .clinerules/<name>.md                 (docs.cline.bot)
// - Continue:       ~/.continue/config.json customCommands
// - Aider:          ~/.aider.conf.yml read:
// - Copilot:        .github/copilot-instructions.md

window.PHAROS_LOGO = "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128";
window.REPO_URL    = "https://github.com/hosein-ul/pharos-skills";

window.MANUAL_PROMPT = `Read this GitHub repository and install/import all available skills from it:
https://github.com/hosein-ul/pharos-skills

Skills to load:
  • pharos-tx-guardrail/SKILL.md      — pre-execution transaction safety guardrail
  • pharos-rwa-yield-router/SKILL.md  — RWA yield intelligence + on-chain executor

Clone the repo into your skills/rules/context directory, then load both SKILL.md files.
Requires: cast (Foundry) on PATH → curl -L https://foundry.paradigm.xyz | bash`;

const ONELINER = (agent) =>
  `curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for ${agent}`;

window.AGENTS = [
  {
    key: "claude",
    name: "Claude Code",
    badge: "Native skills",
    badgeKind: "official",
    logo: "https://cdn.simpleicons.org/anthropic",
    shortCmd: ONELINER("claude"),
    note: "Installs each skill as a separate folder in ~/.claude/skills/. Auto-triggers on Pharos prompts."
  },
  {
    key: "hermes",
    name: "Hermes Agent",
    badge: "Native skills",
    badgeKind: "official",
    logo: "https://hermes-agent.nousresearch.com/icon.png",
    shortCmd: "hermes skills install https://github.com/hosein-ul/pharos-skills",
    note: "Hermes Agent by Nous Research reads SKILL.md natively. CLI installs into ~/.hermes/skills/."
  },
  {
    key: "openclaw",
    name: "OpenClaw",
    badge: "Native skills",
    badgeKind: "official",
    logo: "https://avatars.githubusercontent.com/u/252820863?s=128",
    shortCmd: "openclaw skills install https://github.com/hosein-ul/pharos-skills",
    note: "OpenClaw reads the exact same SKILL.md format as Claude Code. Installs into ~/.openclaw/skills/."
  },
  {
    key: "codex",
    name: "OpenAI Codex CLI",
    badge: "Marketplace",
    badgeKind: "official",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    shortCmd: ONELINER("codex"),
    note: "Adds pharos-skills as a marketplace in ~/.codex/config.toml — skills auto-install on next Codex launch."
  },
  {
    key: "gemini",
    name: "Gemini CLI",
    badge: "Skills",
    badgeKind: "official",
    logo: "https://cdn.simpleicons.org/googlegemini",
    shortCmd: ONELINER("gemini"),
    note: "Installs into ~/.gemini/antigravity/skills/ — verified path used by Pharos Skill Engine on Gemini."
  },
  {
    key: "anvita",
    name: "Anvita Flow",
    badge: "Pharos partner",
    badgeKind: "partner",
    logo: "https://www.google.com/s2/favicons?domain=flow.anvita.xyz&sz=128",
    shortCmd: "https://github.com/hosein-ul/pharos-skills",
    isUrl: true,
    note: "Paste the repo URL into the Anvita Flow Skill Hub."
  },
  {
    key: "cursor",
    name: "Cursor",
    badge: "Project rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cursor/000000",
    shortCmd: ONELINER("cursor"),
    note: "Drops both SKILL.md as .mdc files into .cursor/rules/ — auto-attached project rules."
  },
  {
    key: "windsurf",
    name: "Windsurf",
    badge: ".windsurfrules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/windsurf",
    shortCmd: ONELINER("windsurf"),
    note: "Appends both SKILL.md to .windsurfrules in the project root — Cascade reads it every prompt."
  },
  {
    key: "cline",
    name: "Cline",
    badge: ".clinerules/",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cline",
    shortCmd: ONELINER("cline"),
    note: "Drops both SKILL.md into .clinerules/ — Cline combines all .md files there as persistent rules."
  },
  {
    key: "continue",
    name: "Continue.dev",
    badge: "Custom commands",
    badgeKind: "ctx",
    logo: "https://www.continue.dev/images/continue-logo-light.png",
    shortCmd: ONELINER("continue"),
    note: "Clones skills + patches ~/.continue/config.json to expose /pharos-guard and /pharos-yield."
  },
  {
    key: "aider",
    name: "Aider",
    badge: ".aider.conf.yml",
    badgeKind: "ctx",
    logo: "https://aider.chat/assets/icons/android-chrome-192x192.png",
    shortCmd: ONELINER("aider"),
    note: "Clones skills and adds read: entries to ~/.aider.conf.yml — loads in every Aider session."
  },
  {
    key: "copilot",
    name: "GitHub Copilot",
    badge: ".github",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/githubcopilot",
    shortCmd: ONELINER("copilot"),
    note: "Appends both SKILL.md to .github/copilot-instructions.md — workspace context every prompt."
  }
];

window.renderAgents = function(targetId, template) {
  const host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = window.AGENTS.map((a, i) => template(a, i)).join('');
};

window.UNIVERSAL_CMD = "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash";
