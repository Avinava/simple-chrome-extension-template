# Working in this repository

This file is the source of truth for contributors and coding agents. Read
[the architecture guide](docs/architecture.md) and the relevant guide in
`docs/` before changing a feature.

## Non-negotiable boundaries

1. **Keep components presentational.** Preact components do not call
   `chrome.*`; a surface store owns behavior and calls a core service.
2. **Keep `core` generic.** `src/core` may depend on Chrome APIs, but never on
   a product feature or UI surface.
3. **Use the message contract.** Add cross-context messages to
   `src/core/types/messages.ts`, then handle them in the background router.
   Do not register one-off `chrome.runtime.onMessage` listeners.
4. **Use semantic design tokens.** Extend `src/shared/theme.css` before adding
   a raw visual value. Read [the design-system guide](docs/design-system.md).
5. **Treat permissions as product scope.** Before publishing, remove unused
   demo capabilities and restrict the manifest host matches to required sites.

## Conventions

- UI surfaces use vanilla Zustand stores and the `useStore` bridge.
- Add source tests next to the code as `*.test.ts`.
- Use `import type` for type-only imports.
- `@core`, `@shared`, and `@utils` are configured in `tsconfig.json`,
  `vite.config.js`, and `vitest.config.ts`; update all three together.
- A new extension surface needs a manifest entry. CRX derives its build entry
  from the manifest—do not configure Rollup inputs manually.

## Completion checklist

Run the following before handing work off:

```bash
npm run typecheck
npm test
npm run format:check
npm run lint
npm run build
```

For a UI, manifest, or Chrome API change, load `dist/` at
`chrome://extensions` and exercise the changed flow. Use Node.js 22.18 or newer.
