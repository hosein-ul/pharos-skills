# Pharos Skills

**Two production-ready Pharos Network skills for AI agents — bundled in one repo.**

[![Pharos Network](https://img.shields.io/badge/Pharos-Mainnet%201672-6B4FFF?style=flat-square)](https://pharos.xyz)
[![Hackathon](https://img.shields.io/badge/AI%20Agent%20Carnival-Phase%201-00C2A8?style=flat-square)](https://dorahacks.io/hackathon/pharos-phase1/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

This repository ships two complementary Pharos skills that any AI agent (Claude Code, Anvita Flow, Cursor, Windsurf, Cline, Continue, Aider, ChatGPT, Gemini, GitHub Copilot, etc.) can install and call.

| Skill | Purpose | When the agent uses it |
|-------|---------|------------------------|
| [`pharos-tx-guardrail`](./pharos-tx-guardrail) | Pre-execution transaction safety. 6 read-only checks → risk score 0–100 → PROCEED / WARN / BLOCK | Before **every** `cast send` / `forge script --broadcast` |
| [`pharos-rwa-yield-router`](./pharos-rwa-yield-router) | RWA yield scanner. Reads live APY, applies risk multipliers, ranks deployments | Whenever the user asks where to deploy idle USDC / stablecoin capital on Pharos |

The two skills compose: the **yield router** decides *where* capital should go; the **tx guardrail** verifies *that the call is safe* before it is signed.

---

## Install (one repo, both skills)

```bash
# 1. Clone the monorepo
git clone https://github.com/hosein-ul/pharos-skills ~/pharos-skills

# 2. Symlink each skill into your agent's skills directory
#    (example for Claude Code / Pharos Skill Engine)
ln -s ~/pharos-skills/pharos-tx-guardrail        ~/.claude/skills/pharos-tx-guardrail
ln -s ~/pharos-skills/pharos-rwa-yield-router    ~/.claude/skills/pharos-rwa-yield-router
```

Or copy the individual skill folders into wherever your agent reads skills from. Each subdirectory is a self-contained Pharos Skill Engine package (`SKILL.md` + `assets/` + `references/` + `evals/`).

**Universal prompt install instructions and workflow are available on the project site: [pharos-skills site](https://hosein-ul.github.io/pharos-skills/).**

**Tooling & Dependencies:**
The agent automatically self-bootstraps its required dependencies (like Foundry's `cast`, Python, and curl) and sets up a local hot wallet if needed on first run. If you prefer to manually pre-install Foundry, use:

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
cast --version
```

---

## Repository layout

```
pharos-skills/
├── pharos-tx-guardrail/        ← Skill 1: pre-execution safety
│   ├── SKILL.md
│   ├── assets/
│   ├── references/
│   └── evals/
├── pharos-rwa-yield-router/    ← Skill 2: yield intelligence
│   ├── SKILL.md
│   ├── assets/
│   ├── references/
│   └── evals/
└── README.md
```

Each skill keeps its own assets and references — they share no state.

---

## Networks

| Network | Chain ID | RPC | Native |
|---------|----------|-----|--------|
| Pacific Mainnet | 1672 | `https://rpc.pharos.xyz` | PROS |
| Atlantic Testnet | 688689 | `https://atlantic.dplabs-internal.com` | PHRS |

Default for both skills: **mainnet (1672)**.

---

## Hackathon

Built for **Pharos AI Agent Carnival — Phase 1**.

[Hackathon page](https://dorahacks.io/hackathon/pharos-phase1/) · [Pharos Network](https://pharos.xyz)
