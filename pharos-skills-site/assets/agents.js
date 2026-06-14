// Official logo URLs — all verified 2026-06-14
// cdn.simpleicons.org → brand icon library
// vendor CDNs / Wikipedia → official sources

window.PHAROS_LOGO = "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128";
window.INSTALL_URL = "https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh";
window.REPO_URL    = "https://github.com/hosein-ul/pharos-skills";

window.AGENTS = [
  {
    key: "pharos",
    name: "Pharos Skill Engine",
    badge: "Official runtime",
    badgeKind: "official",
    logo: "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for pharos",
    detail: "git clone https://github.com/hosein-ul/pharos-skills ~/.pharos/skills/pharos-skills",
    note: "Skill Engine auto-detects both SKILL.md entry points and registers the guardrail + yield router as separate capabilities."
  },
  {
    key: "claude",
    name: "Claude Code",
    badge: "Native skills",
    badgeKind: "official",
    logo: "https://cdn.simpleicons.org/anthropic",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for claude",
    detail: "git clone https://github.com/hosein-ul/pharos-skills ~/.claude/skills/pharos-skills",
    note: "Claude Code reads each SKILL.md frontmatter and auto-triggers on Pharos-related prompts."
  },
  {
    key: "anvita",
    name: "Anvita Flow",
    badge: "Pharos partner",
    badgeKind: "partner",
    logo: "https://www.google.com/s2/favicons?domain=flow.anvita.xyz&sz=128",
    oneliner: "https://github.com/hosein-ul/pharos-skills",
    detail: "# Paste this URL in Anvita Flow Skill Hub\nhttps://github.com/hosein-ul/pharos-skills",
    note: "Paste the repo URL in Anvita Flow's Skill Hub — it ingests Pharos Skill Engine packages directly.",
    isUrl: true
  },
  {
    key: "cursor",
    name: "Cursor",
    badge: "Project rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cursor/000000",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for cursor",
    detail: "# Drops both SKILL.md files into .cursor/rules/ as .mdc auto-attached rules",
    note: "Drops both SKILL.md files into .cursor/rules/ as auto-attached project rules."
  },
  {
    key: "windsurf",
    name: "Windsurf",
    badge: "Workspace rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/windsurf",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for windsurf",
    detail: "# Clones into .windsurf/skills/ and appends both SKILL.md to .windsurfrules",
    note: "Clones into .windsurf/skills/ and appends both SKILL.md to .windsurfrules — Cascade picks them up automatically."
  },
  {
    key: "cline",
    name: "Cline",
    badge: ".clinerules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cline",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for cline",
    detail: "# Clones repo into .clinerules/pharos-skills — Cline reads it as persistent workspace context",
    note: "Clones the repo into .clinerules/pharos-skills — Cline reads everything in .clinerules/ as persistent context."
  },
  {
    key: "continue",
    name: "Continue.dev",
    badge: "Custom commands",
    badgeKind: "ctx",
    logo: "https://www.continue.dev/images/continue-logo-light.png",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for continue",
    detail: "# Clones + patches ~/.continue/config.json with /pharos-guard and /pharos-yield commands",
    note: "Clones skills + auto-patches ~/.continue/config.json to expose /pharos-guard and /pharos-yield slash commands."
  },
  {
    key: "aider",
    name: "Aider",
    badge: ".aider.conf.yml",
    badgeKind: "ctx",
    logo: "https://aider.chat/assets/icons/android-chrome-192x192.png",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for aider",
    detail: "# Clones + appends read: entries to ~/.aider.conf.yml — active in every session",
    note: "Clones skills and pins them via ~/.aider.conf.yml so they load in every Aider session automatically."
  },
  {
    key: "codex",
    name: "OpenAI Codex CLI",
    badge: "Instructions",
    badgeKind: "ctx",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for codex",
    detail: "# Clones + appends both SKILL.md to ~/.codex/instructions.md",
    note: "Clones skills and appends both SKILL.md to ~/.codex/instructions.md — Codex CLI picks it up on next run."
  },
  {
    key: "gemini",
    name: "Gemini CLI",
    badge: "Extensions",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/googlegemini",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for gemini",
    detail: "# Clones into ~/.gemini/extensions/pharos-skills — Gemini CLI auto-loads it",
    note: "Clones into ~/.gemini/extensions/pharos-skills — Gemini CLI auto-loads every extension in that directory."
  },
  {
    key: "hermes",
    name: "Hermes / Local LLM",
    badge: "Ollama system prompt",
    badgeKind: "ctx",
    logo: "https://www.google.com/s2/favicons?domain=ollama.com&sz=128",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for hermes",
    detail: "# Builds ~/.ollama/pharos-skills/system-prompt.md\n# Then: ollama run hermes3 --system \"$(cat ~/.ollama/pharos-skills/system-prompt.md)\"",
    note: "Builds a ready-to-use system prompt at ~/.ollama/pharos-skills/system-prompt.md — works with Hermes 3, LLaMA, Mistral, or any Ollama model."
  },
  {
    key: "copilot",
    name: "GitHub Copilot",
    badge: ".github instructions",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/githubcopilot",
    oneliner: "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash -s -- --for copilot",
    detail: "# Appends both SKILL.md to .github/copilot-instructions.md",
    note: "Appends both SKILL.md files to .github/copilot-instructions.md — Copilot Chat reads it as workspace context on every prompt."
  }
];

// Renderer — each design supplies its own template
window.renderAgents = function(targetId, template) {
  const host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = window.AGENTS.map((a, i) => template(a, i)).join('');
};

// Universal one-liner (auto-detect)
window.UNIVERSAL_CMD = "curl -fsSL https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/install.sh | bash";
