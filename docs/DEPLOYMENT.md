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
