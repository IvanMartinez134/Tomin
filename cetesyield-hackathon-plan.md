# CetesYield — Hackathon Project Plan

> Earn CETES-grade yields on your pesos — no brokerage, no crypto knowledge required.

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Architecture Overview](#architecture-overview)
- [User Flow](#user-flow)
- [Core Components](#core-components)
  - [Smart Accounts](#1-smart-accounts-stellar-passkey-wallets)
  - [On-Ramp (MXN → Stellar)](#2-on-ramp-mxn--stellar)
  - [Yield Engine (Blend + DeFindex)](#3-yield-engine-blend--defindex)
  - [Off-Ramp (Stellar → MXN)](#4-off-ramp-stellar--mxn)
- [Technical Architecture Deep Dive](#technical-architecture-deep-dive)
  - [Smart Wallet Internals](#how-stellar-smart-wallets-work)
  - [secp256r1 Bridge](#the-secp256r1-problem--solution)
  - [Account Creation Flow](#account-creation-flow)
  - [Transaction Signing](#transaction-signing-invisible-to-user)
  - [DeFindex Vault Architecture](#defindex-vault-architecture)
  - [Share Price Appreciation](#share-price-appreciation-how-users-earn)
  - [Blend Protocol Integration](#blend-protocol-integration)
  - [CETES-Backed Lending Model](#why-cetes-backed-lending-works)
  - [DeFindex ↔ Blend Contract Calls](#defindex--blend-interaction-contract-calls)
  - [Full Transaction Lifecycle](#full-transaction-lifecycle)
  - [Contract Interaction Map](#contract-interaction-map)
- [Tech Stack](#tech-stack)
- [Hackathon Scope (MVP)](#hackathon-scope-mvp)
- [Implementation Details](#implementation-details)
- [Demo Script](#demo-script)
- [Differentiation](#differentiation)
- [SCF Future Path](#scf-future-path)
- [Name Options](#name-options)

---

## The Problem

Most Mexicans don't have access to CETES (government bonds yielding ~10–11% APY) because:

- You need a brokerage account (SAT registration, CURP, complex onboarding)
- Minimum investment barriers exist on some platforms
- Financial literacy gap — people keep savings in 0% checking accounts or under the mattress
- ~60% of Mexican adults are underbanked

Meanwhile, Blend protocol on Stellar offers equivalent or better yields on tokenized fixed-income instruments, but crypto is intimidating.

---

## The Solution

A dead-simple mobile-first web app where a user in Mexico can:

1. **Sign up** with just their phone number
2. **Deposit MXN** via SPEI (Mexico's instant payment rail) or convenience store (OXXO)
3. **Pick a yield strategy** ("Safe" = CETES-equivalent, "Balanced" = blended)
4. **Earn yield** — Blend/DeFindex does the work under the hood
5. **Withdraw to MXN** anytime back to their bank or debit card

Zero mention of blockchain, wallets, or tokens in the UI.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER LAYER (Mobile-first PWA)                │
│                                                                     │
│   ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐ │
│   │  Sign Up  │  │  Deposit MXN │  │  Dashboard │  │  Withdraw   │ │
│   │  (phone)  │  │  (SPEI/OXXO) │  │  (yields)  │  │  (to bank)  │ │
│   └─────┬────┘  └──────┬───────┘  └─────┬──────┘  └──────┬──────┘ │
│         │               │                │                 │        │
└─────────┼───────────────┼────────────────┼─────────────────┼────────┘
          │               │                │                 │
┌─────────┼───────────────┼────────────────┼─────────────────┼────────┐
│         ▼               ▼                ▼                 ▼        │
│                    BACKEND API (Node.js / Next.js)                   │
│                                                                     │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│   │  Auth        │  │  Yield       │  │  Transaction Engine      │  │
│   │  (OTP/phone) │  │  Calculator  │  │  (deposit/withdraw queue)│  │
│   └─────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
└──────────────┬──────────────────┬───────────────────┬───────────────┘
               │                  │                   │
       ┌───────▼───────┐  ┌──────▼────────┐  ┌───────▼──────────┐
       │   ON-RAMP      │  │  STELLAR       │  │   OFF-RAMP       │
       │                │  │  NETWORK        │  │                  │
       │ ┌────────────┐ │  │                │  │ ┌──────────────┐ │
       │ │ SPEI via    │ │  │ ┌────────────┐│  │ │ SPEI payout  │ │
       │ │ MoneyClick  │ │  │ │ Smart      ││  │ │ via          │ │
       │ │ or Conekta  │ │  │ │ Account    ││  │ │ MoneyClick   │ │
       │ └──────┬─────┘ │  │ │ (per user) ││  │ └──────▲───────┘ │
       │        │       │  │ └─────┬──────┘│  │        │         │
       │ ┌──────▼─────┐ │  │       │       │  │ ┌──────┴───────┐ │
       │ │ MXN → USDC  │ │  │ ┌─────▼─────┐│  │ │ USDC → MXN   │ │
       │ │ (anchor)    │ │  │ │ DeFindex  ││  │ │ (anchor)     │ │
       │ └────────────┘ │  │ │ Vault     ││  │ └──────────────┘ │
       └───────────────┘  │ └─────┬─────┘│  └──────────────────┘
                           │       │      │
                           │ ┌─────▼─────┐│
                           │ │  Blend     ││
                           │ │  Protocol  ││
                           │ │            ││
                           │ │ ┌────────┐ ││
                           │ │ │ CETES  │ ││
                           │ │ │ Pool   │ ││
                           │ │ └────────┘ ││
                           │ └────────────┘│
                           └───────────────┘
```

---

## User Flow

```
  User opens app
       │
       ▼
  ┌─────────────┐    OTP      ┌──────────────┐
  │ Enter phone ├────────────►│ Verify code  │
  └─────────────┘             └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │ Smart Account │◄── Created invisibly
                              │ provisioned   │    on Stellar via
                              └──────┬───────┘    passkey/WebAuthn
                                     │
                              ┌──────▼───────┐
                              │ "How much do │
                              │  you want to │
                              │  deposit?"   │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                                  ▼
            ┌──────────────┐                  ┌──────────────┐
            │  SPEI transfer│                  │  OXXO cash   │
            │  (instant)    │                  │  (barcode)   │
            └──────┬───────┘                  └──────┬───────┘
                   │                                  │
                   └────────────┬─────────────────────┘
                                ▼
                    ┌───────────────────┐
                    │ MXN received →    │
                    │ Convert to USDC   │
                    │ via anchor        │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ Deposit USDC into │
                    │ DeFindex vault    │
                    │ (Blend CETES pool)│
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ Dashboard shows:  │
                    │ $5,000 MXN        │
                    │ Earning 10.2% APY │
                    │ ≈ $1.40/day       │
                    └───────────────────┘
```

---

## Core Components

### 1. Smart Accounts (Stellar Passkey Wallets)

Each user gets a **Stellar smart account** created at signup. The user never sees it.

- **Passkey-based signing** — user authenticates with fingerprint/Face ID, which signs Stellar transactions under the hood
- **No seed phrase, no wallet UI** — the smart account is controlled by the passkey stored on their device
- **Account abstraction** — the backend sponsors transaction fees so the user never needs XLM

### 2. On-Ramp (MXN → Stellar)

| Method | Provider Options | Speed | Limits |
|--------|-----------------|-------|--------|
| SPEI transfer | MoneyClick, Settle Network, or custom anchor | ~30 seconds | Up to $50k MXN |
| OXXO deposit | Conekta / OpenPay | 1–2 hours | Up to $10k MXN |
| Debit card | Conekta | Instant | Up to $20k MXN |

Flow: MXN → USDC (or MXN stablecoin if available) → deposited to user's smart account.

### 3. Yield Engine (Blend + DeFindex)

Two strategies presented in plain language:

| Strategy | UI Name | Under the Hood | Target APY |
|----------|---------|----------------|------------|
| Conservative | "Seguro" (Safe) | DeFindex vault → Blend CETES pool | 9–11% |
| Balanced | "Crecimiento" (Growth) | Blended DeFindex vault (CETES + lending) | 12–15% |

- **DeFindex** manages vault allocation and rebalancing
- **Blend** provides the lending pools backed by tokenized CETES/fixed-income
- User sees: "Your money is earning X%" — no mention of vaults, pools, or tokens

### 4. Off-Ramp (Stellar → MXN)

- User hits "Withdraw" → picks amount → picks destination (CLABE for SPEI, or debit card)
- Backend redeems from DeFindex vault → converts USDC → MXN → sends SPEI payout
- Target: same-day settlement

---

## Technical Architecture Deep Dive

### How Stellar Smart Wallets Work

```
┌─────────────────────────────────────────────────────┐
│                   USER'S DEVICE                      │
│                                                      │
│  ┌────────────┐    ┌─────────────────────────────┐  │
│  │ Fingerprint│    │  WebAuthn / Passkey          │  │
│  │ or FaceID  ├───►│                              │  │
│  └────────────┘    │  - Generates secp256r1 key   │  │
│                    │  - Stored in secure enclave   │  │
│                    │  - Signs challenges natively  │  │
│                    └──────────┬──────────────────┘  │
│                               │                      │
└───────────────────────────────┼──────────────────────┘
                                │ signed challenge
                                ▼
┌───────────────────────────────────────────────────────┐
│                 STELLAR NETWORK                        │
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │         User's Smart Account                  │     │
│  │                                               │     │
│  │  Signers:                                     │     │
│  │  ┌─────────────────────────────────────────┐  │     │
│  │  │ 1. Passkey public key (secp256r1)       │  │     │
│  │  │    weight: 1    threshold: low           │  │     │
│  │  ├─────────────────────────────────────────┤  │     │
│  │  │ 2. Backend deployer key (ed25519)       │  │     │
│  │  │    weight: 1    threshold: low           │  │     │
│  │  │    (used only for account setup,         │  │     │
│  │  │     removed after passkey registered)    │  │     │
│  │  ├─────────────────────────────────────────┤  │     │
│  │  │ 3. Factory contract (for recovery)      │  │     │
│  │  │    weight: 1    (optional)               │  │     │
│  │  └─────────────────────────────────────────┘  │     │
│  │                                               │     │
│  │  Custom Contract Logic:                       │     │
│  │  - __check_auth() validates secp256r1 sigs   │     │
│  │  - Signature verification via WebAuthn        │     │
│  │  - Session keys for pre-approved actions      │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
└───────────────────────────────────────────────────────┘
```

### The secp256r1 Problem & Solution

Stellar natively uses **ed25519** keys. Passkeys use **secp256r1** (P-256). The smart wallet contract bridges this gap:

```
Standard Stellar Account:
  User signs tx with ed25519 → network verifies natively ✓

Smart Wallet Account:
  User signs challenge with secp256r1 (passkey)
       │
       ▼
  Smart wallet contract receives invocation
       │
       ▼
  __check_auth() is called by Soroban runtime
       │
       ▼
  Contract verifies secp256r1 signature
  using env.crypto().secp256r1_verify()     ← Soroban host function
       │
       ▼
  If valid → authorize the transaction ✓
```

### Account Creation Flow

```
  User taps "Sign Up" → enters phone → receives OTP
       │
       ▼
  ┌─────────────────────────────────────────┐
  │ Frontend calls navigator.credentials    │
  │   .create() → device creates passkey    │
  │                                         │
  │ Returns:                                │
  │   - credentialId (stored in our DB)     │
  │   - publicKey (secp256r1, goes on-chain)│
  └────────────────┬────────────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────────────┐
  │ Backend: Deploy smart wallet contract   │
  │                                         │
  │ 1. Call factory.deploy(                 │
  │      id: unique_user_id,               │
  │      pk: passkey_public_key,           │
  │      signers: [passkey_pk]             │
  │    )                                    │
  │                                         │
  │ 2. Factory deploys wallet contract      │
  │    with user's passkey as signer        │
  │                                         │
  │ 3. Fund account with minimum XLM       │
  │    (platform sponsors this)             │
  │                                         │
  │ 4. Add USDC trustline                   │
  └────────────────┬────────────────────────┘
                   │
                   ▼
  User now has a funded Stellar smart account
  controlled by their fingerprint.
  They see: "Account ready! Deposit to start earning."
```

### Transaction Signing (Invisible to User)

Every time the user does something that requires an on-chain action:

```
  User taps "Deposit $5,000 MXN into Seguro"
       │
       ▼
  Backend builds Soroban transaction:
    smart_wallet.invoke(
      fn: "deposit_to_defindex",
      args: [vault_address, usdc_amount]
    )
       │
       ▼
  Frontend receives tx → calls navigator.credentials.get()
       │
       ▼
  Device prompts biometric (fingerprint/face)
       │
       ▼
  Passkey signs the challenge → returns authenticatorData + signature
       │
       ▼
  Frontend attaches signature to transaction envelope
       │
       ▼
  Submit to Stellar → Soroban invokes __check_auth()
       │
       ▼
  Smart wallet contract verifies secp256r1 sig → authorizes ✓
       │
       ▼
  DeFindex deposit executes atomically
```

**What the user experiences**: tap button → fingerprint → "Done! Your money is earning 10.2%"

---

### DeFindex Vault Architecture

DeFindex is a **vault protocol** — it manages pooled capital and allocates it across strategies.

```
┌────────────────────────────────────────────────────────────┐
│                    DeFindex Vault                            │
│                    "CetesYield Seguro"                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Vault Contract (Soroban)                                │ │
│  │                                                         │ │
│  │  State:                                                 │ │
│  │  ┌───────────────────────────────────────────────┐     │ │
│  │  │ total_shares: 1,000,000                        │     │ │
│  │  │ total_assets: 1,050,000 USDC (includes yield)  │     │ │
│  │  │ deposit_token: USDC                             │     │ │
│  │  │ share_token: dfCETES (vault receipt token)      │     │ │
│  │  └───────────────────────────────────────────────┘     │ │
│  │                                                         │ │
│  │  Strategies (allocation targets):                       │ │
│  │  ┌─────────────────────┬────────────┬───────────────┐  │ │
│  │  │ Strategy             │ Allocation │ Current Value │  │ │
│  │  ├─────────────────────┼────────────┼───────────────┤  │ │
│  │  │ Blend CETES Pool    │    80%     │  840,000 USDC │  │ │
│  │  │ Blend Lending Pool  │    20%     │  210,000 USDC │  │ │
│  │  └─────────────────────┴────────────┴───────────────┘  │ │
│  │                                                         │ │
│  │  Functions:                                             │ │
│  │  - deposit(amount) → mint shares                       │ │
│  │  - withdraw(shares) → burn shares, return assets       │ │
│  │  - rebalance() → shift between strategies              │ │
│  │  - harvest() → collect yield, compound                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────┬──────────────────────┬────────────────────┘
                   │ 80%                  │ 20%
                   ▼                      ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ Blend CETES Pool │   │ Blend USDC       │
        │ (fixed income)   │   │ Lending Pool     │
        └──────────────────┘   └──────────────────┘
```

### Deposit Flow Through DeFindex

```
  User deposits 10,000 USDC
       │
       ▼
  ┌─────────────────────────────────────────┐
  │ vault.deposit(                           │
  │   amounts: [10000_0000000],   // 7 dec  │
  │   min_shares: 9500_0000000,   // slip   │
  │   from: user_smart_wallet               │
  │ )                                        │
  └─────────────────┬───────────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────────┐
  │ 1. Transfer 10,000 USDC from user       │
  │    smart wallet → vault contract        │
  │                                          │
  │ 2. Calculate shares:                     │
  │    shares = (deposit * total_shares)     │
  │              / total_assets              │
  │    shares = (10000 * 1000000) / 1050000  │
  │    shares ≈ 9,523.81 dfCETES            │
  │                                          │
  │ 3. Mint 9,523.81 dfCETES to user        │
  │                                          │
  │ 4. Allocate deposited USDC:             │
  │    - 8,000 USDC → Blend CETES strategy  │
  │    - 2,000 USDC → Blend lending strategy│
  └─────────────────────────────────────────┘
```

### Share Price Appreciation (How Users Earn)

```
  Day 0:  1 dfCETES = 1.0000 USDC  (initial)
          │
  Day 30: Blend pools have accrued interest
          vault.harvest() is called
          │
          ▼
          Blend CETES pool:  840,000 → 847,000 USDC  (+7,000)
          Blend lending pool: 210,000 → 212,100 USDC  (+2,100)
          │
          Total assets: 1,059,100 USDC
          Total shares: 1,009,523.81
          │
          1 dfCETES = 1,059,100 / 1,009,523.81 = 1.0491 USDC
          │
          User's 9,523.81 shares now worth:
          9,523.81 × 1.0491 = 9,991.17 USDC
          │
          ≈ $491 yield on $10,000 in 30 days → ~10.2% APY ✓
```

---

### Blend Protocol Integration

Blend is the **lending protocol** where capital actually earns yield.

#### Pool Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Blend Lending Pool                          │
│              "CETES Fixed Income"                        │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Pool Contract                      │  │
│  │                                                     │  │
│  │  Reserves:                                          │  │
│  │  ┌───────────┬────────────┬──────────┬───────────┐ │  │
│  │  │ Asset      │ Supplied   │ Borrowed │ Rate      │ │  │
│  │  ├───────────┼────────────┼──────────┼───────────┤ │  │
│  │  │ USDC      │ 5,000,000  │ 4,200,000│ 10.5%    │ │  │
│  │  │ XLM       │ 2,000,000  │ 1,400,000│  8.2%    │ │  │
│  │  └───────────┴────────────┴──────────┴───────────┘ │  │
│  │                                                     │  │
│  │  Collateral (what borrowers post):                  │  │
│  │  ┌───────────────────────────────────────────────┐ │  │
│  │  │ Tokenized CETES (MBonos)     $6,000,000       │ │  │
│  │  │ Tokenized Mexican T-Bills    $2,500,000       │ │  │
│  │  │ Other RWA collateral         $1,200,000       │ │  │
│  │  └───────────────────────────────────────────────┘ │  │
│  │                                                     │  │
│  │  Interest Rate Model:                               │  │
│  │  ┌─────────────────────────────────────────┐       │  │
│  │  │         Rate                             │       │  │
│  │  │    15%  │            ╱                   │       │  │
│  │  │         │          ╱                     │       │  │
│  │  │    10%  │ ───────╱─── ← target zone     │       │  │
│  │  │         │      ╱                         │       │  │
│  │  │     5%  │    ╱                           │       │  │
│  │  │         │──╱                             │       │  │
│  │  │     0%  └────────────────────────────    │       │  │
│  │  │         0%    50%    80%   95%  100%     │       │  │
│  │  │              Utilization Rate             │       │  │
│  │  └─────────────────────────────────────────┘       │  │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Why CETES-Backed Lending Works

```
  Traditional CETES:
    Investor → buys CETES from Mexican govt → earns ~10-11% → redeems at maturity

  Blend CETES Pool:
    1. RWA issuer tokenizes CETES on Stellar
       (Mexican govt bond → token on-chain)
                │
                ▼
    2. Borrowers post tokenized CETES as collateral
       to borrow USDC from the Blend pool
                │
                ▼
    3. Lenders (our users via DeFindex) supply USDC
       and earn interest paid by borrowers
                │
                ▼
    4. Borrowers pay ~10-12% interest because
       they're leveraging CETES yield
       (borrow USDC at 10%, deploy for 12% → net 2%)
                │
                ▼
    5. Our users earn the ~10% supply rate
       which mirrors CETES yield ← THIS IS THE PRODUCT
```

### DeFindex ↔ Blend Interaction (Contract Calls)

```
  DeFindex Strategy Contract (adapter between vault and Blend)
       │
       │ deposit()
       ▼
  ┌─────────────────────────────────────────────────┐
  │ blend_strategy.deposit(amount):                  │
  │                                                   │
  │   1. pool_client.supply(                          │
  │        from: strategy_contract,                   │
  │        asset: USDC_address,                       │
  │        amount: 8000_0000000                       │
  │      )                                            │
  │                                                   │
  │   2. Blend pool mints bUSDC (supply token)        │
  │      to strategy contract                         │
  │                                                   │
  │   3. bUSDC balance increases over time            │
  │      as interest accrues (rebasing)               │
  │                                                   │
  └─────────────────────────────────────────────────┘

  DeFindex calls harvest():
       │
       ▼
  ┌─────────────────────────────────────────────────┐
  │ blend_strategy.harvest():                        │
  │                                                   │
  │   1. current = pool_client.get_supply_balance(    │
  │        strategy_contract, USDC                    │
  │      )                                            │
  │                                                   │
  │   2. profit = current - last_recorded_balance     │
  │                                                   │
  │   3. Report profit back to DeFindex vault         │
  │      (vault updates share price)                  │
  │                                                   │
  └─────────────────────────────────────────────────┘
```

---

### Full Transaction Lifecycle

End-to-end: user deposits MXN → earns yield → withdraws MXN.

```
 DEPOSIT                          YIELD                         WITHDRAW
 ──────                          ─────                         ────────

 User: "Deposit               Blend pool accrues            User: "Withdraw
  $10,000 MXN"                interest daily                 $5,000 MXN"
      │                            │                              │
      ▼                            ▼                              ▼
 SPEI transfer              bUSDC balance of              Smart wallet
 MXN → platform             DeFindex strategy             signs withdraw
      │                     grows automatically                  │
      ▼                            │                              ▼
 Anchor converts                   ▼                        DeFindex vault:
 MXN → 500 USDC            DeFindex vault                  burn shares →
 (at ~20 MXN/USD)          calls harvest()                 withdraw from
      │                            │                        Blend strategy
      ▼                            ▼                              │
 USDC sent to               Vault share price                    ▼
 user smart wallet          increases:                     250 USDC returned
      │                     1.000 → 1.049                  to smart wallet
      ▼                            │                              │
 Smart wallet signs                ▼                              ▼
 DeFindex deposit            User dashboard:               Anchor converts
 (biometric)                 "$10,491 MXN"                 USDC → MXN
      │                     "+491 earned"                        │
      ▼                                                          ▼
 DeFindex vault:                                           SPEI payout
 mint 500 dfCETES                                          $5,000 MXN
 allocate to Blend                                         → user's bank
      │
      ▼
 Blend pool:
 supply 400 USDC (80%)
 to CETES pool
 supply 100 USDC (20%)
 to lending pool
```

---

### Contract Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTRACT INTERACTION MAP                       │
│                                                                   │
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                       │
│  │ Smart Wallet │         │ Smart Wallet │      ... per user     │
│  │ Factory      │────────►│ (User A)     │                       │
│  │              │         │              │                       │
│  │ deploy()     │         │ __check_auth │                       │
│  └──────────────┘         └──────┬───────┘                       │
│                                  │                                │
│                    ┌─────────────┼───────────────┐               │
│                    │ approve()   │ deposit()     │ withdraw()    │
│                    ▼             ▼               ▼               │
│             ┌────────────┐  ┌────────────────────────┐          │
│             │ USDC Token │  │   DeFindex Vault       │          │
│             │            │  │   "CetesYield Seguro"  │          │
│             │ transfer() │  │                        │          │
│             │ approve()  │  │   deposit()            │          │
│             │ balance()  │  │   withdraw()           │          │
│             └────────────┘  │   rebalance()          │          │
│                             │   harvest()            │          │
│                             └───────┬───────┬────────┘          │
│                                     │       │                    │
│                          ┌──────────┘       └──────────┐        │
│                          ▼                              ▼        │
│                  ┌───────────────┐             ┌────────────────┐│
│                  │ Blend Strategy│             │ Blend Strategy ││
│                  │ (CETES)      │             │ (Lending)      ││
│                  │              │             │                ││
│                  │ deposit()    │             │ deposit()      ││
│                  │ withdraw()   │             │ withdraw()     ││
│                  │ harvest()    │             │ harvest()      ││
│                  └──────┬──────┘             └───────┬────────┘│
│                         │                            │          │
│                         ▼                            ▼          │
│                  ┌───────────────┐           ┌──────────────┐   │
│                  │ Blend Pool    │           │ Blend Pool   │   │
│                  │ (CETES)      │           │ (General)    │   │
│                  │              │           │              │   │
│                  │ supply()     │           │ supply()     │   │
│                  │ withdraw()   │           │ withdraw()   │   │
│                  └──────────────┘           └──────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js PWA (mobile-first) | Installable, fast, works offline |
| Auth | Phone OTP + WebAuthn/Passkeys | No passwords, biometric signing |
| Backend | Next.js API routes + Bull queue | Simple, handles async deposit/withdraw |
| Smart Accounts | Stellar SDK + sep-smart-wallet | Invisible wallet per user |
| On/Off Ramp | MoneyClick or Settle Network API | MXN <> USDC via SPEI |
| Yield | DeFindex SDK + Blend pools | Vault management + lending |
| Database | PostgreSQL (Supabase) | User records, tx history |
| Hosting | Vercel | Zero-ops for hackathon |

---

## Hackathon Scope (MVP)

### Build (Functional)

- [ ] Phone OTP signup flow
- [ ] Smart account creation (passkey-based)
- [ ] Dashboard UI showing balance + yield accrued
- [ ] DeFindex vault deposit (USDC → Blend CETES pool)
- [ ] DeFindex vault withdrawal
- [ ] Yield calculation display (real-time from on-chain data)

### Mock / Simulate

- [ ] SPEI on-ramp (use testnet USDC faucet instead — show the SPEI UI but fund with test tokens)
- [ ] SPEI off-ramp (show the flow, log the payout intent)
- [ ] OXXO barcode generation (show a static mockup)
- [ ] KYC/compliance (out of scope for hackathon)

---

## Implementation Details

### Smart Wallet SDK Usage

```typescript
// Create wallet for new user
import { SmartWalletFactory } from '@stellar/smart-wallet-sdk';

const factory = new SmartWalletFactory(FACTORY_CONTRACT_ID);
const wallet = await factory.deploy({
  passkey_public_key: userPasskeyPk,  // from WebAuthn registration
  initial_funding: '5',               // 5 XLM for reserves
});

// Sign a DeFindex deposit via passkey
const tx = new TransactionBuilder(account)
  .addOperation(
    vault.deposit({
      amounts: [parseUnits('500', 7)],  // 500 USDC
      min_shares: parseUnits('475', 7), // 5% slippage
      from: wallet.address,
    })
  )
  .build();

// User sees fingerprint prompt, signs secp256r1 challenge
const signed = await wallet.sign(tx);  // triggers WebAuthn
await server.submitTransaction(signed);
```

### DeFindex Vault Interaction

```typescript
import { DeFindexVault } from 'defindex-sdk';

const vault = new DeFindexVault(VAULT_CONTRACT_ID);

// Read current share price
const sharePrice = await vault.getSharePrice();
// → 1.0491 USDC per dfCETES

// Read user's position
const shares = await vault.getShares(userWalletAddress);
const value = shares * sharePrice;
// → user's total value in USDC
```

### Display in MXN (Frontend)

```typescript
// Backend fetches USD/MXN rate from Banxico API
const mxnRate = await fetch('https://api.banxico.org.mx/...');

// Frontend shows everything in pesos
const displayBalance = usdcValue * mxnRate;  // 500 USDC × 20.1 = $10,050 MXN
const displayYield = yieldUSDC * mxnRate;    // 24.5 USDC × 20.1 = $492.45 MXN
```

---

## Demo Script

**3-minute pitch:**

1. "Maria is a teacher in Guadalajara. She has $10,000 MXN in savings earning 0%."
2. She opens the app → signs up with phone number → fingerprint
3. She "deposits" $10,000 MXN (simulated SPEI)
4. She picks "Seguro" strategy → money flows to Blend
5. Dashboard shows yield accruing in real time
6. She withdraws $2,000 MXN → SPEI payout shown
7. "Maria now earns what was only available to people with brokerage accounts."

---

## Differentiation

| Angle | Detail |
|-------|--------|
| **Geo-targeted** | Built for Mexico — SPEI, OXXO, MXN-denominated, Spanish-first |
| **Real yield, real assets** | CETES are Mexican government bonds — not degen farming |
| **Zero crypto UX** | No wallets, no seed phrases, no gas fees, no token names |
| **Smart accounts** | Stellar account abstraction = seamless signing |
| **SCF-ready** | Built on Stellar ecosystem (Blend, DeFindex, anchors) — natural SCF candidate |

---

## SCF Future Path

This project is designed to become an SCF submission after hackathon validation:

| Phase | Timeline | SCF Track |
|-------|----------|-----------|
| Hackathon MVP | Now | — |
| Beta with real SPEI integration | +2 months | Integration Track |
| Mainnet launch Mexico | +4 months | Open Track |
| Expand to LATAM (BRL, COP) | +8 months | Open Track |

**Tranche plan for future SCF submission:**

- **T1**: Working MVP with testnet + 100 beta users
- **T2**: Mainnet with real SPEI on/off ramp + 1,000 users
- **T3**: $1M MXN TVL + second market (Colombia or Brazil)

---

## Name Options

- **CetesYield** — direct, says what it does
- **Rinde** — Spanish for "yields" / "it pays off"
- **Ahorro+** — "Savings+" in Spanish
- **Bondi** — playful take on "bonds"
