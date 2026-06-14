# Execute — Deposit & Withdraw Reference (v0.4.0)

On-chain write commands for deploying capital into Pharos yield protocols.

> **Safety rule (MANDATORY):** Before executing ANY `cast send` in this file,
> the agent MUST run `pharos-tx-guardrail` on the calldata and confirm score < 70 (PROCEED/WARN).
> Never bypass the guardrail for deposit or withdrawal operations.

> **Setup**:
> ```bash
> RPC=$(jq -r '.networks[] | select(.name=="mainnet") | .rpcUrl' assets/networks.json)
> WALLET=<user_wallet_address>
> PRIVATE_KEY=<from_env_or_user_prompt>   # never hardcode
> ```

---

## Table of Contents
1. [Full Execute Flow](#full-execute-flow)
2. [R25 Axil — Deposit](#r25-deposit)
3. [R25 Axil — Withdraw](#r25-withdraw)
4. [Zona — Supply USDC](#zona-supply)
5. [Zona — Withdraw USDC](#zona-withdraw)
6. [Faroswap — Swap](#faroswap-swap)
7. [Multi-Protocol Allocator](#multi-allocator)
8. [Confirm Position](#confirm-position)

---

## Full Execute Flow

```
1. User: "deposit 5000 USDC into best Pharos yield"
          ↓
2. [yield-router scan]   → ranks protocols → picks R25 Axil 7-day
          ↓
3. [guardrail check]     → simulate approve → simulate deposit → score?
          ↓ score < 70
4. [execute]             → cast send approve → cast send deposit
          ↓
5. [confirm]             → cast call balanceOf → cast call convertToAssets
          ↓
6. [report]              → "Deposited 5000 USDC. Received 4987.3 vault shares (~$5000.00)"
```

---

## R25 Axil — Deposit ✅ LIVE

ERC-4626 interface. Two steps: approve USDC → deposit into vault.

```bash
VAULT_7D="0x1c2bc8b553d9a7e61f7531a3a4bf2162f4569268"   # 7-day lockup
VAULT_6M="0xee26bb0989691735c997dfdc49a4a607f75e190b"   # 180-day lockup
USDC="0xE0BE08c77f415F577A1B3A9aD7a1Df1479564ec8"       # USDC on Pharos mainnet
AMOUNT_USDC=<amount_in_raw_units>  # e.g. 5000000000 for 5000 USDC (6 decimals)
```

### Step 1 — Check current USDC balance

```bash
cast call $USDC "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC
```

If `balance < AMOUNT_USDC` → abort and tell user to bridge more USDC first.

### Step 2 — Check existing allowance

```bash
cast call $USDC "allowance(address,address)(uint256)" $WALLET $VAULT_7D --rpc-url $RPC
```

If `allowance >= AMOUNT_USDC` → skip step 3 (no re-approve needed).

### Step 3 — Approve (GUARDRAIL FIRST)

```bash
# GUARDRAIL CHECK — run pharos-tx-guardrail on this calldata first
# calldata: approve(address,uint256) → selector 0x095ea7b3
# Use EXACT amount — never MAX_UINT256

cast send $USDC \
  "approve(address,uint256)" \
  $VAULT_7D $AMOUNT_USDC \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

### Step 4 — Deposit (GUARDRAIL FIRST)

```bash
# ERC-4626 deposit(uint256 assets, address receiver)
cast send $VAULT_7D \
  "deposit(uint256,address)" \
  $AMOUNT_USDC $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

Returns `shares` (uint256) — save this for confirmation.

### Step 5 — Confirm deposit

```bash
# Shares held
SHARES=$(cast call $VAULT_7D "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC)

# USDC value of those shares
cast call $VAULT_7D "convertToAssets(uint256)(uint256)" $SHARES --rpc-url $RPC
# Result / 1e6 = current USDC value
```

### Lockup disclosure (MANDATORY before executing)

Tell the user BEFORE executing:
- **VAULT_7D**: "There is a 7-day withdrawal queue. Your USDC will be locked for at least 7 days after requesting withdrawal."
- **VAULT_6M**: "There is a 180-day lockup. Your USDC will be locked for 6 months."

If user says "I need funds within X days" → only recommend if X > lockup.

---

## R25 Axil — Withdraw ✅

### Step 1 — Initiate withdrawal request

```bash
# ERC-4626 redeem(uint256 shares, address receiver, address owner)
SHARES=<amount_to_redeem>

cast send $VAULT_7D \
  "redeem(uint256,address,address)" \
  $SHARES $WALLET $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

### Step 2 — Queue check

After initiating, the withdrawal enters a queue.
```bash
# Check pending withdrawals (7-day vault tracks queue)
cast call $VAULT_7D "pendingWithdrawals(address)(uint256)" $WALLET --rpc-url $RPC
```

### Step 3 — Claim (after lockup period)

```bash
# Once queue period passes, claim USDC
cast send $VAULT_7D \
  "claimWithdrawal(address)" \
  $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

---

## Zona — Supply USDC ✅ (Aave V3)

```bash
POOL="0xda464e68208A3083Eb65FE5c522a72AeD1C1372a"
USDC="0xE0BE08c77f415F577A1B3A9aD7a1Df1479564ec8"
AMOUNT=<raw_usdc>
```

### Step 1 — Approve USDC to Zona Pool

```bash
# GUARDRAIL FIRST — use exact amount, not MAX_UINT256
cast send $USDC \
  "approve(address,uint256)" \
  $POOL $AMOUNT \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

### Step 2 — Supply (deposit)

```bash
# Aave V3 supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)
cast send $POOL \
  "supply(address,uint256,address,uint16)" \
  $USDC $AMOUNT $WALLET 0 \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

User receives aUSDC tokens (aToken) representing their position. No lockup — can withdraw anytime.

### Confirm

```bash
# Get aToken address
ATOKEN=$(cast call $POOL \
  "getReserveData(address)((uint256,uint128,uint128,uint128,uint128,uint128,uint40,uint16,address,address,address,address,uint128,uint128,uint128))" \
  $USDC --rpc-url $RPC | grep -oE '0x[a-fA-F0-9]{40}' | sed -n '1p')

# aToken balance (grows over time with yield)
cast call $ATOKEN "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC
```

---

## Zona — Withdraw USDC ✅

```bash
# Aave V3 withdraw(address asset, uint256 amount, address to)
# Use type(uint256).max to withdraw everything
cast send $POOL \
  "withdraw(address,uint256,address)" \
  $USDC 115792089237316195423570985008687907853269984665640564039457584007913129639935 $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

Or specific amount:
```bash
cast send $POOL \
  "withdraw(address,uint256,address)" \
  $USDC $AMOUNT $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

---

## Faroswap — Swap ✅ (DODO Router)

```bash
FAROSWAP_ROUTER="0xA5cA5Fbe34e444F366B373170541ec6902b0F75c"
WPHRS="0x838800b758277CC111B2d48Ab01e5E164f8E9471"
```

### Get quote first (read-only)

```bash
# DODO-fork: querySellBase(address trader, uint256 payBaseAmount)
cast call $FAROSWAP_ROUTER \
  "querySellBase(address,uint256)(uint256,uint256)" \
  $WALLET $AMOUNT_IN \
  --rpc-url $RPC
# Returns: receiveQuoteAmount, mtFeeAmount
```

### Execute swap

```bash
# Approve token first (GUARDRAIL required)
cast send $TOKEN_IN "approve(address,uint256)" $FAROSWAP_ROUTER $AMOUNT_IN \
  --rpc-url $RPC --private-key $PRIVATE_KEY

# Swap: sellBase(address to)  — DODO pattern
cast send $FAROSWAP_ROUTER \
  "sellBase(address)" \
  $WALLET \
  --rpc-url $RPC \
  --private-key $PRIVATE_KEY
```

---

## Multi-Protocol Allocator

Agent allocates capital across multiple protocols based on yield-router ranking.

```
Example: 5000 USDC, balanced risk
  → 50% (2500 USDC) → R25 Axil 7-day   @ 5.10% risk-adj
  → 30% (1500 USDC) → Zona supply       @ 2.88% risk-adj
  → 20% (1000 USDC) → R25 Axil 6-month @ 6.72% risk-adj (longer lockup)

Execute:
  1. approve + deposit 2500 USDC → VAULT_7D
  2. approve + supply  1500 USDC → POOL (Zona)
  3. approve + deposit 1000 USDC → VAULT_6M
  (each step goes through guardrail separately)
```

---

## Confirm Position

After all deposits, summarize:

```bash
# R25 Axil 7d position
SHARES_7D=$(cast call $VAULT_7D "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC)
VALUE_7D=$(cast call $VAULT_7D "convertToAssets(uint256)(uint256)" $SHARES_7D --rpc-url $RPC)

# R25 Axil 6m position
SHARES_6M=$(cast call $VAULT_6M "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC)
VALUE_6M=$(cast call $VAULT_6M "convertToAssets(uint256)(uint256)" $SHARES_6M --rpc-url $RPC)

# Zona aUSDC position
cast call $ATOKEN "balanceOf(address)(uint256)" $WALLET --rpc-url $RPC
```

Output format:
```
✅ Pharos Portfolio — block <N>
────────────────────────────────────────────────
Position          Shares / aTokens   Current Value   APY
R25 Axil 7-day   4987.3 shares      5000.12 USDC    8.5%
Zona USDC         1500.0 aUSDC      1501.42 USDC    3.6%
R25 Axil 6-month  998.1 shares      1000.00 USDC    11.2%
────────────────────────────────────────────────
Total                                7501.54 USDC
Blended APY                         6.84%
```
