# Contributing

Use Node.js 22 or newer and install dependencies with `npm ci`. Keep changes
small, follow [AGENTS.md](AGENTS.md), and run the full local check before
opening a pull request:

```bash
npm run typecheck && npm test && npm run format:check && npm run lint
```

Build the extension with `npm run build` and manually exercise any surface you
changed by loading `dist/` unpacked at `chrome://extensions`.
