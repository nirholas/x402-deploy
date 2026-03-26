# Sperax x402 Facilitator

x402 payment facilitator by [SperaxOS](https://sperax.io) — verifies and settles EIP-3009 USDC micropayments.

## Facilitator Endpoint

```
https://x402.sperax.io
```

## Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Base | 8453 | ✅ |
| Base Sepolia | 84532 | ✅ |

## Supported Assets

- **USDC** via EIP-3009 `transferWithAuthorization`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/verify` | Verify a payment payload |
| POST | `/settle` | Verify and settle on-chain |
| GET | `/supported` | List supported payment kinds |
| GET | `/health` | Health check |
| GET | `/info` | Facilitator info |

## Usage with x402-deploy

When deploying a paid API with `x402-deploy`, point to the Sperax facilitator:

```ts
{
  facilitatorUrl: "https://x402.sperax.io"
}
```

## Source Code

Full implementation: [github.com/nirholas/x402-facilitator](https://github.com/nirholas/x402-facilitator)

## About SperaxOS

SperaxOS is an AI Agent Workspace where agents can autonomously pay for premium APIs and trade with other agents using x402 micropayments.

- Website: [sperax.io](https://sperax.io)
- App: [chat.sperax.io](https://chat.sperax.io)
