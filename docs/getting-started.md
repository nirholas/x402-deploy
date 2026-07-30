# Getting started with x402-deploy

1-click deployment and monetization for MCP servers and APIs with x402 payments

## Install

```bash
npm install -g @nirholas/x402-deploy
```

## Verify the install

Clone the repository and run its checks to confirm everything works on your machine:

```bash
git clone https://github.com/nirholas/x402-deploy.git
cd x402-deploy
```

Available commands:

| Command | Runs |
|---|---|
| `npm run build` | `tsup` |
| `npm run dev` | `tsup --watch` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `eslint src/` |
| `npm run test` | `vitest run` |

## Next steps

- [Examples](./examples.md) shows runnable snippets.
- The [README](https://github.com/nirholas/x402-deploy#readme) is the complete reference.
- Found a problem? [Open an issue](https://github.com/nirholas/x402-deploy/issues).
