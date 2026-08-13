# Contributing

Thanks for improving the template. Keep changes useful for a broad range of
extension authors and avoid adding a dependency unless it simplifies the
starter materially.

## Setup

Use Node.js 22.18 or newer.

```bash
git clone https://github.com/Avinava/simple-chrome-extension-template.git
cd simple-chrome-extension-template
npm ci
```

Read [AGENTS.md](AGENTS.md) before coding; it defines the architecture and
verification rules.

## Change process

1. Create a focused branch and make the smallest complete change.
2. Add or update colocated tests for changed behavior.
3. Keep user-facing documentation and the changelog accurate.
4. Build `dist/` and manually test any changed extension flow in Chrome.
5. Open a pull request using the provided template.

Run the full check before submitting:

```bash
npm run typecheck && npm test && npm run format:check && npm run lint && npm run build
```

## Pull-request expectations

Explain the user impact, include relevant verification, and call out manifest
or permission changes explicitly. Do not commit generated `dist/`, local
extension state, credentials, or environment files.
