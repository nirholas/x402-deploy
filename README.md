# x402-deploy 

<!-- three.ws:badges -->
[![GitHub stars](https://img.shields.io/github/stars/nirholas/x402-deploy?style=flat&logo=github)](https://github.com/nirholas/x402-deploy/stargazers) [![Last commit](https://img.shields.io/github/last-commit/nirholas/x402-deploy?style=flat)](https://github.com/nirholas/x402-deploy/commits) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/nirholas/x402-deploy/pulls) [![AI agent friendly](https://img.shields.io/badge/AI%20agents-AGENTS.md%20%2B%20llms.txt-6d5dfc?style=flat)](https://github.com/nirholas/x402-deploy/blob/HEAD/AGENTS.md)
<!-- /three.ws:badges -->

 
> 1-click deployment for monetized APIs & MCP servers

Turn any API or MCP server into a paid service in **5 minutes**. No code changes required.

---
## 🌎 Related Projects

- **[x402-deploy](https://github.com/nirholas/x402-deploy)**: this repository. The hosted dashboard and site demos are offline while hosting is being migrated, so no live URL is published here yet.
- **[Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)**: the project x402-deploy originally grew out of.

---

## ✨ Features

- **💰 Instant Monetization** - Charge per API call with crypto (USDC on Base)
- **🥳 1-Click Deploy** - Railway, Fly.io, Vercel, or Docker
- **📊 Live Dashboard** - Real-time earnings and analytics
- **🔍 Auto-Discovery** - Automatic listing on x402scan.com
- **🛡️ Zero Trust** - Payment verification before API access
- **🎨 Beautiful CLI** - Stunning terminal UI with live updates

---

## 🐎 Quick Start

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

**That's it!** Your API is now live and earning money. 💸

---

## 📦 What Gets Deployed?

x402-deploy wraps your existing API with a payment gateway:

```
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

---

## 💡 Use Cases

- **MCP Servers** - Monetize Claude Desktop tools
- **AI APIs** - Charge for GPT wrappers, embeddings
- **Trading Bots** - Sell API access to strategies
- **Data APIs** - Weather, crypto prices, analytics
- **Web Services** - Any REST/HTTP API

---

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration](docs/configuration.md)
- [Deployment Platforms](docs/deployment.md)
- [Pricing Strategies](docs/pricing.md)
- [Dashboard Guide](docs/dashboard.md)
- [API Reference](docs/api.md)

---

## 🎯 Supported Platforms

| Platform | Status | Deploy Time | Free Tier |
|----------|--------|-------------|-----------|
| Railway | ✅ | ~2 min | $5/month |
| Fly.io | ✅ | ~3 min | Yes |
| Vercel | ✅ | ~1 min | Yes |
| Docker | ✅ | ~30 sec | Self-hosted |

---

## 🏗️ Project Types

Automatically detects and configures:

- ✅ MCP Servers (`@modelcontextprotocol/sdk`)
- ✅ Express APIs
- ✅ Fastify
- ✅ FastAPI (Python)
- ✅ Next.js
- ✅ Generic Node.js/Python

---

## 💰 Pricing Models

```json
{
  "pricing": {
    "model": "per-call",
    "default": { "price": "$0.01" },
    "routes": {
      "GET /api/*": "$0.0001",
      "POST /api/trade": "$0.10",
      "GET /api/free": "$0"
    }
  }
}
```

---

## 📊 Dashboard

Beautiful terminal dashboard with live updates:

```bash
x402-deploy dashboard
```

```
╔═══════════════════════════════════════════╗
║   Earnings Summary                        ║
╠═══════════════════════════════════════════╣
║  Today:     $12.45  (1,245 calls)         ║
║  This Week: $87.32  (8,732 calls)         ║
║  All Time:  $1,547  (154,718 calls)       ║
╚═══════════════════════════════════════════╝
```

---

## 🔧 CLI Commands

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

---

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

All rights reserved. See [LICENSE](LICENSE).

---

## 🌟 Star History
(Original Repo, Universal Crypto MCP)
[![Star History Chart](https://api.star-history.com/svg?repos=nirholas/universal-crypto-mcp&type=Date)](https://star-history.com/#nirholas/universal-crypto-mcp&Date)

---

As with most of my repos, I spend a lot of time building then find something interesting or have a need for something and i start on the next. I hope this at the very least is a good resource you can use to monetize your APIs and MCP Servers. What I truly hope to build is a community of developers, I love shipping alone but i wouldn't mind collaborating here and there. Please, always feel free to PR and throw an issue down. I am waiting. 

## Documentation

Full documentation site: **https://nirholas.github.io/x402-deploy/**

- [Getting started](docs/getting-started.md) covers install and first run.
- [Examples](docs/examples.md) has copy-paste snippets.

<!-- three.ws:growth -->
## Support the project

If x402-deploy saves you time, **[star it on GitHub](https://github.com/nirholas/x402-deploy)**. Stars are how other developers and AI agents find the repositories worth trusting, and they cost you one click.

Know someone who would use it? [Post on X](https://twitter.com/intent/tweet?text=x402-deploy%3A%20Turn%20any%20API%20or%20MCP%20server%20into%20a%20paid%20service%20with%20x402&url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fx402-deploy) · [Share on Bluesky](https://bsky.app/intent/compose?text=x402-deploy%3A%20Turn%20any%20API%20or%20MCP%20server%20into%20a%20paid%20service%20with%20x402%20https%3A%2F%2Fgithub.com%2Fnirholas%2Fx402-deploy) · [Share on LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fx402-deploy) · [Submit to Hacker News](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fnirholas%2Fx402-deploy&t=x402-deploy%3A%20Turn%20any%20API%20or%20MCP%20server%20into%20a%20paid%20service%20with%20x402) · [Share on Reddit](https://www.reddit.com/submit?url=https%3A%2F%2Fgithub.com%2Fnirholas%2Fx402-deploy&title=x402-deploy%3A%20Turn%20any%20API%20or%20MCP%20server%20into%20a%20paid%20service%20with%20x402)

## Built for AI agents too

Coding agents and LLM tooling can read this repo directly: [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), [llms-full.txt](./llms-full.txt). Point an agent at `https://github.com/nirholas/x402-deploy` and it has the context it needs.

## More from the same author

- [All repositories by nirholas](https://github.com/nirholas/nirholas#readme): the full catalog, grouped by topic
- [three.ws](https://three.ws): the platform for 3D AI agents with Solana wallets, a skill marketplace and x402 payments
- Questions or ideas: [open an issue](https://github.com/nirholas/x402-deploy/issues) or [start a discussion](https://github.com/nirholas/x402-deploy/discussions)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=nirholas/x402-deploy)](https://github.com/nirholas/x402-deploy/graphs/contributors)

<!-- /three.ws:growth -->
