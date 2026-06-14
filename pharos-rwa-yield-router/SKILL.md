---
name: pharos-rwa-yield-router
description: >
  Scans all yield-bearing protocols on Pharos Pacific Mainnet (chain 1672), ranks them by
  risk-adjusted APY, and — when the user confirms — executes the deposit directly on-chain.
  Covers: R25 Axil Consumer Credit Vaults (7-day and 6-month, ERC-4626), Zona USDC supply
  (Aave V3 fork), Faroswap LP yield, Morpho Blue, TermMax, AquaFlux, Faroo liquid staking.
  Two modes:
    SCAN mode  — read-only APY scan + ranked recommendation (no wallet required).
    EXECUTE mode — approve USDC + deposit into chosen vault + confirm position on-chain.
  EXECUTE mode always runs pharos-tx-guardrail checks before any cast send.
  Also reads live token prices from Chainlink Push Engine oracles.
  Invoke for: "where should I put my USDC?", "best yield on Pharos?", "deposit 5000 USDC into
  R25 Axil", "put my USDC into Zona", "what's the APY on Pharos?", "invest in R25 consumer
  credit vault", "compare yield protocols", "how much would I earn in 90 days?", "execute
  deposit into R25 Axil", "withdraw from Zona", or any capital deployment on Pharos.
version: 0.4.0
requires:
  anyBins:
    - cast
---

# Pharos RWA Yield Intelligence Router (v0.3.0)

Scans Pharos's yield ecosystem and returns a ranked, risk-adjusted comparison so agents can
recommend optimal capital deployment. All data is read live from on-chain — no stale estimates,
no fabricated APYs. **The skill is HONEST about what's working today** — Pharos mainnet is
new, and not all listed protocols have active markets yet.

## What Changed in v0.3.0

Following deep activity verification (2026-06-13):
- **Reality check**: most "deployed" Pharos protocols have zero on-chain activity
- **R25 Axil**: LIVE — verified $847K USDC TVL on the 7-day vault
- **Zona**: LIVE — Aave V3 reserves are active, USDC supply rate is readable
- **Morpho Blue**: deployed but ZERO CreateMarket events — no active markets yet
- **TermMax**: deployed but ZERO factory events — no vaults exist yet
- **AquaFlux**: deployed but ABI for APY view functions not in public docs
- **Native PROS staking**: precompile not at standard slots (0x1000/0x1001/0x0800)
- **Faroo**: mainnet "coming soon"; testnet stPROS works

## What Changed in v0.2.0

- **Removed ELFi** — not deployed on Pharos at all (Arbitrum & Base only)
- **Removed fake Morpho address** — canonical `0xBBBB...` is NOT used; Pharos has a distinct
  Morpho deployment at `0x18573fA1...`
- **Default network → `mainnet`** — capital lives there

## Prerequisites

1. **Install Foundry**:
   ```bash
   which cast || (curl -L https://foundry.paradigm.xyz | bash && foundryup)
   ```
2. **Network config** — read `assets/networks.json`. Default: `mainnet` (chain 1672).
3. **Protocol catalog** — read `assets/protocols.json` (already verified via eth_getCode).
4. **Full ecosystem registry** — `assets/ecosystem.json` (cross-reference for context).
5. No private key required — read-only skill.

## Pharos Mainnet Protocols — Honest Status

| Protocol | Asset Class | Risk Mult | Status | Agent Can Read? |
|----------|-------------|-----------|--------|-----------------|
| **R25 — Axil 7-day** | private_credit | 0.60 | ✅ ACTIVE ($847K TVL) | ✅ Yes — full ERC-4626 |
| **R25 — Axil 6-month** | private_credit | 0.60 | ✅ ACTIVE | ✅ Yes — full ERC-4626 |
| **Zona** | real_estate | 0.80 | ✅ ACTIVE | ✅ Yes — Aave V3 standard |
| **Faroo (testnet)** | native_staking | 0.50 | ✅ ACTIVE (testnet only) | ✅ Yes — ERC-4626 |
| **Faroswap** | lp_yield | 0.65 | ✅ ACTIVE | 🟡 Swap quotes via DODO API |
| **Morpho Blue** | crypto_lending | 0.70 | ⏳ Deployed, NO markets | ❌ Nothing to read yet |
| **TermMax** | investment_grade | 0.85 | ⏳ Deployed, NO vaults | ❌ Nothing to read yet |
| **AquaFlux** | real_estate | 0.80 | ⏳ Deployed, ABI gap | ❌ ABI not in public docs |
| **Native PROS Staking** | native_staking | 0.50 | 🟡 Active, no precompile addr | ❌ Need Pharos staking docs |
| Faroo (mainnet) | native_staking | 0.50 | ⏳ Coming Soon | ❌ Empty config |

Full per-protocol detail in `assets/protocols.json`.

## Capability Index

| User Need | Mode | Capability | Reference |
|-----------|------|-----------|-----------|
| "Best APY on Pharos?" / scan | SCAN | Read all protocols, rank by risk-adjusted APY | → `references/yield-scan.md#full-scan` |
| Get live token price in USD | SCAN | Chainlink Push Engine `latestAnswer()` | → `references/yield-scan.md#price-lookup` |
| Read R25 Axil vault APY | SCAN | ERC-4626 `previewRedeem()` snapshot diff | → `references/yield-scan.md#r25-apy` |
| Read Zona supply APY | SCAN | Aave V3 `getReserveData()` → liquidityRate | → `references/yield-scan.md#zona-apy` |
| Compare RWA strategies for $X | SCAN | Apply risk filter + project return | → `references/yield-scan.md#full-scan` |
| Read Morpho / TermMax APY | SCAN | When markets exist | → `references/yield-scan.md#morpho-apy` |
| **Deposit USDC into R25 Axil** | **EXECUTE** | approve USDC + deposit ERC-4626 | → `references/execute.md#r25-deposit` |
| **Withdraw from R25 Axil** | **EXECUTE** | redeem shares + claim after queue | → `references/execute.md#r25-withdraw` |
| **Supply USDC to Zona** | **EXECUTE** | approve + Aave V3 supply() | → `references/execute.md#zona-supply` |
| **Withdraw USDC from Zona** | **EXECUTE** | Aave V3 withdraw() | → `references/execute.md#zona-withdraw` |
| **Swap tokens via Faroswap** | **EXECUTE** | approve + DODO sellBase/sellQuote | → `references/execute.md#faroswap-swap` |
| **Multi-protocol allocation** | **EXECUTE** | Split capital across protocols | → `references/execute.md#multi-allocator` |
| **Confirm portfolio positions** | **EXECUTE** | balanceOf + convertToAssets on each vault | → `references/execute.md#confirm-position` |

## Output Format

```
🔍 Pharos Yield Scan — <TIMESTAMP> (block <BLOCK>, mainnet 1672)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVE PROTOCOLS (live data):
Rank  Protocol              Class            APY    Risk-Adj  TVL      Min   Lockup
 #1   R25 Axil 7d           private credit   8.5%   5.10%     $847K    $1    7d queue
 #2   R25 Axil 6m           private credit   11.2%  6.72%     ...      $1    180d
 #3   Zona USDC supply      real estate      3.6%   2.88%     $620K    $1    none
 #4   Faroo stPROS (test)   native staking   N/A    —         testnet  —     —

DEPLOYED BUT NOT YET ACTIVE:
  • Morpho Blue — 0 markets created yet
  • TermMax — 0 vaults created yet
  • AquaFlux — ABI not publicly documented yet
  • Native PROS staking — precompile address not published yet
  • Faroo (mainnet) — "Coming Soon" per app config
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ Best for <AMOUNT> <ASSET>: <PROTOCOL> @ <RISK_ADJ_APY>%
   Reasoning: <one sentence>
   Projected <DAYS>d return: ~<RETURN> <ASSET>
   ⚠️ Lockup: <describe>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: block <BLOCK> | 4 protocols scanned | 5 not yet active
```

**Always show both sections** — users need to know the full landscape, including what's coming.

## Decision Flow

### SCAN mode (read-only)
1. Extract from user: **amount**, **asset**, **risk tolerance**, **time horizon**.
2. Run the scan against mainnet (chain 1672).
3. Apply risk filter:
   - `conservative` → investment_grade, native_staking only
   - `balanced` → above + crypto_lending, real_estate
   - `aggressive` → all classes including private_credit
4. Filter by min deposit and lockup matching user's needs.
5. Rank by risk-adjusted APY.
6. Present the table + top recommendation + projected return.
7. Ask: **"Do you want me to execute this deposit?"**

### EXECUTE mode (on-chain write)
1. User confirms deposit intent with amount and protocol.
2. Disclose lockup terms — get explicit user acknowledgement.
3. Check USDC balance — if insufficient, stop and advise bridge/buy.
4. **Run `pharos-tx-guardrail` on approve calldata** → must score < 70.
5. Execute approve with exact amount (NEVER MAX_UINT256).
6. **Run `pharos-tx-guardrail` on deposit calldata** → must score < 70.
7. Execute deposit.
8. Confirm: read balanceOf + convertToAssets → report shares and USDC value.

## Critical Rules

- **EXECUTE mode requires explicit user confirmation before any cast send.**
- Never approve MAX_UINT256 — always use exact deposit amount.
- Always run `pharos-tx-guardrail` before every cast send; block if score ≥ 70.
- If a protocol's read fails, mark "data unavailable" — never fabricate APY.
- Always show block number for data freshness.
- R25 vaults have lockup — disclose BEFORE asking for confirmation.
- Faroo on mainnet is "coming soon"; do not attempt deposit.

## References

- Full protocol catalog & status: `assets/protocols.json`
- Complete Pharos ecosystem context: `assets/ecosystem.json`
- Risk model methodology: `references/risk-model.md`
- Read commands (APY scan): `references/yield-scan.md`
- Write commands (deposit/withdraw/swap): `references/execute.md`
