---
name: monetize-with-x402-deploy
description: Wrap an existing API or MCP server with x402 pay-per-call pricing using the @nirholas/x402-deploy CLI, test it locally, and deploy it to Railway, Fly.io, Vercel or Docker. Use when the user wants to charge for an API or MCP server with x402 payments.
---

# x402-deploy

`@nirholas/x402-deploy` (npm, 0.1.3) adds an x402 payment gateway in front of an Express, Fastify, Next.js, FastAPI, generic Node or Python API, or an MCP server (`@modelcontextprotocol/sdk`). Bins: `x402-deploy` and `x402`. Run it from the root of the project to monetize.

```bash
npx -y -p @nirholas/x402-deploy x402-deploy init       # or: npm install -g @nirholas/x402-deploy
```

## Safety: money and credentials

- `init` takes a receiving `payment.wallet` address (public address only). Never ask for or handle a private key or seed phrase.
- `deploy` publishes a public service on a paid provider and (unless `--no-discovery`) registers it with x402scan. `withdraw` moves earnings. Show the user the plan (project, provider, network, wallet, pricing) and get an explicit yes before running either. Run `deploy --dry-run` first.
- Provider tokens are read from the user's shell environment: `RAILWAY_TOKEN`, `FLY_API_TOKEN` (and `FLY_ORG`), `VERCEL_TOKEN` (and `VERCEL_TEAM_ID`). Dashboard calls use `X402_API_KEY`. Tell the user to export them; never write them to files.

## Workflow

1. `x402-deploy init` (flags: `-y/--yes`, `--wallet <address>`, `--network <network>` such as `eip155:8453` for Base, `--template <name>`). It writes `x402.config.json`.
2. Edit pricing in that file or run `x402-deploy pricing --route "GET /api/*" --price '$0.001'`; also `--list`, `--remove <route>`, `-i/--interactive`.
3. `x402-deploy test --port 3402` runs the gateway locally; the discovery document is served at `/.well-known/x402`.
4. `x402-deploy simulate -r <route> -c <calls> -p <payers>` projects revenue; `x402-deploy benchmark -u http://localhost:3402 -n 100 -c 10` load-tests.
5. `x402-deploy doctor [--fix]` diagnoses config problems.
6. `x402-deploy deploy --dry-run`, then `x402-deploy deploy -p railway|fly|vercel|docker [--env <name>]`.
7. After deploy: `status`, `logs [-f] [-n 100]`, `dashboard [--period day|week|month|all] [--json]`, `analytics [-r route] [-e json|csv]`, `watch`, `withdraw`.

Other commands: `export`, `import`, `compare`, `completions`, `migrate --from stripe|paypal|razorpay|square`, and `marketplace list|view|search|publish|categories|review`.

## Config shape (`x402.config.json`)

Top-level keys include `name`, `project` (type, language, entryPoint, buildCommand, startCommand), `payment` (`wallet`, `network`, `token`, `facilitator`), `pricing` (`model: "per-call"`, `default.price`, `routes` map of `"METHOD /path"` to a price like `"$0.01"`, `"$0"` for free), `deploy` (provider, region, port, environment), `discovery`, `dashboard`. Validation uses the schema in `src/types/config.ts`; `deploy` fails with the Zod error when the file is invalid and requires `payment.wallet`.

Full docs live in the repo's `docs/` (configuration, deployment, pricing, dashboard, api).
