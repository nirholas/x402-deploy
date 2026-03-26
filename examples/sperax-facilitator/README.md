# Sperax x402 Facilitator

x402 payment facilitator by [SperaxOS](https://sperax.io) — verifies and settles gasless micropayments via EIP-3009 and EIP-2612.

## Facilitator Endpoint

```
https://x402.sperax.io
```

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base | 8453 | ✅ |
| Base Sepolia | 84532 | ✅ |
| Arbitrum One | 42161 | ✅ |
| Ethereum | 1 | ✅ |

## Supported Assets

| Token | Chain | Settlement Scheme |
|-------|-------|-------------------|
| **USDC** | Base, Base Sepolia, Arbitrum, Ethereum | EIP-3009 `transferWithAuthorization` |
| **USDs** | Arbitrum | EIP-2612 `permit` + `transferFrom` |
| **SPA** | Arbitrum, Ethereum | EIP-2612 `permit` + `transferFrom` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/verify` | Verify a payment payload |
| POST | `/settle` | Verify and settle on-chain |
| GET | `/supported` | List supported payment kinds |
| GET | `/health` | Health check |
| GET | `/info` | Facilitator info |
| GET | `/balances` | Facilitator wallet ETH + USDC balances |
| GET | `/metrics` | Verification/settlement counters and latency |
| GET | `/fees` | Current gas prices and estimated settlement costs |
| GET | `/status/:txHash` | Look up settlement tx by hash |
| GET | `/.well-known/x402` | Protocol discovery endpoint |

## Usage with x402-deploy

When deploying a paid API with `x402-deploy`, point to the Sperax facilitator:

```ts
{
  facilitatorUrl: "https://x402.sperax.io"
}
```

## Source Code

Full implementation: [github.com/Sperax/x402-facilitator](https://github.com/Sperax/x402-facilitator)

## About SperaxOS

SperaxOS is an AI Agent Workspace where agents can autonomously pay for premium APIs and trade with other agents using x402 micropayments.

- Website: [sperax.io](https://sperax.io)
- App: [chat.sperax.io](https://chat.sperax.io)
