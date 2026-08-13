# Copilot / AI development guide

Guidance for AI assistants and contributors working in this repository. Read
[`ARCHITECTURE.md`](../ARCHITECTURE.md) first — it is the source of truth for how
the code is organized.

## Stack

Manifest V3 Chrome extension. Preact + HTM (no JSX), TypeScript, Vite +
`@crxjs/vite-plugin`, Zustand (vanilla), Vitest. UI icons from `lucide`.

## Repo map

- `src/core/` — generic infrastructure (`MessageBus`, `StorageService`,
  `ChromeApiWrapper`, message types). Depends only on Chrome APIs. Keep it
  product-agnostic.
- `src/background/` — service worker: `index.ts` bootstrap, `handlers/` (message
  + command routers), `services/` (e.g. `ThemeService`).
- `src/content/` — content scripts.
- `src/popup/`, `src/options/`, `src/sidepanel/` — surfaces; each pairs a
  `*.tsx` entry with an optional Zustand store.
- `src/shared/` — cross-surface UI: `theme.css`, `themeStore.ts`, `ThemeToggle.tsx`.
- `src/utils/` — `useStore` (zustand→Preact), `icons` (lucide), `preact-htm`.

## Conventions (follow these)

- **Never call `chrome.*` from a component.** Go through a Zustand store action,
  and have the store use a core service (`StorageService`, `MessageBus`,
  `TabUtils`, …).
- **Messaging:** add a message by declaring an interface with a literal `action`
  in `core/types/messages.ts`, adding it to the `ExtensionMessage` union, and
  adding a `case` to `background/handlers/MessageHandlers.ts`. Do not hand-roll
  `chrome.runtime.onMessage` listeners.
- **State:** all logic (including async Chrome calls) lives in store actions;
  components read via `useStore(store, selector)` and stay presentational.
- **Styling:** use the design tokens in `shared/theme.css` (`var(--token)`).
  Extend the token set rather than hardcoding colors/spacing.
- **Icons:** import named icons from `lucide` and render with `icon()` from
  `@utils/icons` so they stay tree-shaken.
- **Types:** prefer `import type`; keep `core/types` the single source of truth
  for cross-surface shapes.
- **Aliases:** `@core`, `@background`, `@content`, `@popup`, `@options`,
  `@sidepanel`, `@shared`, `@utils`. Defined in `tsconfig.json`,
  `vite.config.js`, and `vitest.config.ts` — update all three together.

## Before you finish

- `npm run typecheck` — no errors.
- `npm test` — green (tests are colocated as `*.test.ts`).
- `npm run format` — Prettier clean.
- If you added a surface, wire its HTML entry into `vite.config.js` `input` and
  `src/manifest.json`.
