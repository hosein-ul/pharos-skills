// Verified official logo URLs (sources documented 2026-06-14).
// - cdn.simpleicons.org → verified brand-icon library
// - vendor CDN URLs → scraped from each vendor's own marketing site
// - Wikipedia commons → CC-licensed brand mark
// - Google s2 favicon service → falls back to each domain's own favicon

window.PHAROS_LOGO_H  = "https://cdn.prod.website-files.com/67dbfb55a03319f79c3c7c12/689c97bdd110fcee4f9612cd_logo_colored_h.png";
window.PHAROS_LOGO_SQ = "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128";

window.AGENTS = [
  {
    key: "pharos",
    name: "Pharos Skill Engine",
    badge: "Official runtime",
    badgeKind: "official",
    logo: "https://www.google.com/s2/favicons?domain=pharos.xyz&sz=128",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills ~/.pharos/skills/pharos-skills",
    note: "Skill Engine auto-detects both SKILL.md entry points and registers the guardrail + yield router as separate capabilities."
  },
  {
    key: "claude",
    name: "Claude Code",
    badge: "Native skills",
    badgeKind: "official",
    logo: "https://cdn.simpleicons.org/anthropic",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills /tmp/ps && \\\n  ln -s /tmp/ps/pharos-tx-guardrail     ~/.claude/skills/pharos-tx-guardrail && \\\n  ln -s /tmp/ps/pharos-rwa-yield-router ~/.claude/skills/pharos-rwa-yield-router",
    note: "Claude Code reads each SKILL.md frontmatter and auto-triggers on Pharos-related prompts."
  },
  {
    key: "anvita",
    name: "Anvita Flow",
    badge: "Pharos partner",
    badgeKind: "partner",
    logo: "https://www.google.com/s2/favicons?domain=flow.anvita.xyz&sz=128",
    cmd: "# In Skill Hub, paste this URL:\nhttps://github.com/hosein-ul/pharos-skills",
    note: "Anvita Flow ingests Pharos Skill Engine packages directly from a repo URL."
  },
  {
    key: "cursor",
    name: "Cursor",
    badge: "Project rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cursor/000000",
    cmd: "mkdir -p .cursor/rules && \\\n  curl -L https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/pharos-tx-guardrail/SKILL.md \\\n       -o .cursor/rules/pharos-tx-guardrail.mdc && \\\n  curl -L https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/pharos-rwa-yield-router/SKILL.md \\\n       -o .cursor/rules/pharos-rwa-yield-router.mdc",
    note: "Both SKILL.md files become auto-attached project rules in Cursor."
  },
  {
    key: "windsurf",
    name: "Windsurf",
    badge: "Workspace rules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/windsurf",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills .windsurf/skills && \\\n  cat .windsurf/skills/pharos-tx-guardrail/SKILL.md \\\n      .windsurf/skills/pharos-rwa-yield-router/SKILL.md >> .windsurfrules",
    note: "Cascade picks up both skill entry points automatically."
  },
  {
    key: "cline",
    name: "Cline",
    badge: ".clinerules",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/cline",
    cmd: "mkdir -p .clinerules && \\\n  git clone https://github.com/hosein-ul/pharos-skills .clinerules/pharos-skills",
    note: "Cline reads everything in .clinerules/ as persistent workspace context."
  },
  {
    key: "continue",
    name: "Continue.dev",
    badge: "Custom commands",
    badgeKind: "ctx",
    logo: "https://www.continue.dev/images/continue-logo-light.png",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills ~/.continue/skills/pharos\n# then in ~/.continue/config.json:\n\"customCommands\": [\n  { \"name\": \"pharos-guard\", \"prompt\": \"@~/.continue/skills/pharos/pharos-tx-guardrail/SKILL.md\" },\n  { \"name\": \"pharos-yield\", \"prompt\": \"@~/.continue/skills/pharos/pharos-rwa-yield-router/SKILL.md\" }\n]",
    note: "Exposes /pharos-guard and /pharos-yield slash commands."
  },
  {
    key: "aider",
    name: "Aider",
    badge: "--read flag",
    badgeKind: "ctx",
    logo: "https://aider.chat/assets/icons/android-chrome-192x192.png",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills ~/pharos-skills\naider --read ~/pharos-skills/pharos-tx-guardrail/SKILL.md \\\n      --read ~/pharos-skills/pharos-rwa-yield-router/SKILL.md",
    note: "Pin them via .aider.conf.yml for an entire project session."
  },
  {
    key: "chatgpt",
    name: "ChatGPT (Custom GPT)",
    badge: "File upload",
    badgeKind: "ctx",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    cmd: "# 1. Create a new Custom GPT\n# 2. Knowledge → upload both SKILL.md + references/\n# 3. Instructions:\n\"On any Pharos-related question, consult the uploaded SKILL.md files first.\"",
    note: "Or paste the raw GitHub URLs into chat — GPT-5 with browsing follows them."
  },
  {
    key: "gemini",
    name: "Gemini CLI",
    badge: "Extensions",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/googlegemini",
    cmd: "git clone https://github.com/hosein-ul/pharos-skills ~/.gemini/extensions/pharos-skills",
    note: "Gemini CLI auto-loads everything in ~/.gemini/extensions/."
  },
  {
    key: "copilot",
    name: "GitHub Copilot",
    badge: ".github instructions",
    badgeKind: "ctx",
    logo: "https://cdn.simpleicons.org/githubcopilot",
    cmd: "mkdir -p .github && \\\n  curl -L https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/pharos-tx-guardrail/SKILL.md \\\n       > .github/copilot-instructions.md && \\\n  curl -L https://raw.githubusercontent.com/hosein-ul/pharos-skills/main/pharos-rwa-yield-router/SKILL.md \\\n       >> .github/copilot-instructions.md",
    note: "Copilot Chat reads .github/copilot-instructions.md as workspace context every prompt."
  }
];

// Universal renderer — each design supplies its own template and target.
window.renderAgents = function(targetId, template) {
  const host = document.getElementById(targetId);
  if (!host) return;
  host.innerHTML = window.AGENTS.map((a, i) => template(a, i)).join('');
};
