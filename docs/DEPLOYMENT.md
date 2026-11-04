# Documentation Site Deployment

The documentation at [https://x402-deploy.modelcontextprotocol.name](https://x402-deploy.modelcontextprotocol.name) is the static `docs/` folder hosted on Cloudflare Pages.

| Item | Value |
|------|-------|
| Host | Cloudflare Pages, project `x402-deploy` |
| Production URL | `https://x402-deploy.modelcontextprotocol.name` |
| Headers | `docs/_headers` (security headers; `.md` files served as readable text) |
| DNS | Proxied CNAME in the `modelcontextprotocol.name` zone to `x402-deploy.pages.dev` |

## Deploy

Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then from the repository root:

```bash
npx wrangler@4 pages deploy docs --project-name=x402-deploy --branch=main
```

Deploys are manual. GitHub Actions is not used for this site.

## Verify

```bash
curl -sI https://x402-deploy.modelcontextprotocol.name | head -1   # HTTP/2 200
```

## Rollback

Cloudflare dashboard → Workers & Pages → x402-deploy → Deployments → pick an earlier production deployment → Rollback.

## Website and dashboard

`website/` and `dashboard-web/` are static pages on separate Cloudflare Pages projects:

```bash
npx wrangler@4 pages deploy website --project-name=x402-deploy-web --branch=main
npx wrangler@4 pages deploy dashboard-web --project-name=x402-deploy-dashboard --branch=main
```

They are served at `https://x402-deploy-web.modelcontextprotocol.name` and `https://x402-deploy-dashboard.modelcontextprotocol.name`. Each folder carries its own `_headers` file.

## Facilitator

`x402-facilitator/` settles payments on-chain and needs a funded `FACILITATOR_PRIVATE_KEY`, so it is not hosted centrally. Build the `Dockerfile` and run it where you hold that key.
