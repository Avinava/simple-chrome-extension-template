# CLAUDE.md

Project guidance for Claude Code and other AI assistants. The full engineering
conventions live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
and [`ARCHITECTURE.md`](ARCHITECTURE.md) — read those first.

## TL;DR

- Manifest V3 extension: Preact + HTM, TypeScript, Vite + `@crxjs/vite-plugin`,
  Zustand, Vitest.
- Layered: `core` (generic infra) → `background` (router) → surfaces
  (popup/options/sidepanel) → `content`; `shared` holds the theme system.

## Golden rules

1. Components never touch `chrome.*` — use a Zustand store action + a core
   service.
2. Add messages to `core/types/messages.ts` and a case in the background router;
   don't add loose `onMessage` listeners.
3. Style with tokens from `shared/theme.css`.
4. Keep `src/core` generic and product-agnostic.

## Commands

```bash
npm run dev          # dev server + HMR
npm run build        # production build → dist/
npm run typecheck    # tsc --noEmit
npm test             # vitest run
npm run format       # prettier --write
```

## Verifying a change

Build, load `dist/` unpacked at `chrome://extensions`, and exercise the surface
you touched. Prefer driving the real extension over trusting types alone.
