# x402-deploy examples

1-click deployment and monetization for MCP servers and APIs with x402 payments

## Example 1

```bash
# Install globally
npm install -g @nirholas/x402-deploy

# Navigate to your API/MCP server
cd my-awesome-api

# Initialize (detects project automatically)
x402-deploy init

# Deploy (creates wallet, deploys, registers)
x402-deploy deploy

# Watch earnings
x402-deploy dashboard
```

## Example 2

```text
┌─────────────────────────────────────┐
│   Your API (unchanged)              │
│   ↓                                 │
│   x402 Gateway (automatic)          │
│   ↓                                 │
│   Payment Verification              │
│   ↓                                 │
│   Analytics & Rate Limiting         │
│   ↓                                 │
│   Deployed to Cloud                 │
└─────────────────────────────────────┘
```

## Example 3

```bash
x402-deploy dashboard
```

## Example 4

```text
╔═══════════════════════════════════════════╗
║   Earnings Summary                        ║
╠═══════════════════════════════════════════╣
║  Today:     $12.45  (1,245 calls)         ║
║  This Week: $87.32  (8,732 calls)         ║
║  All Time:  $1,547  (154,718 calls)       ║
╚═══════════════════════════════════════════╝
```

## Example 5

```bash
x402-deploy init              # Initialize project
x402-deploy deploy            # Deploy to cloud
x402-deploy deploy --dry-run  # Preview deployment
x402-deploy dashboard         # Live earnings dashboard
x402-deploy pricing           # Manage pricing
x402-deploy status            # Check deployment status
x402-deploy logs              # View deployment logs
x402-deploy withdraw          # Withdraw earnings
x402-deploy export --csv      # Export analytics
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/x402-deploy#readme).
