# Repository instructions

Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing code.

## Rules

1. Components never call `chrome.*`. Put behavior in a vanilla Zustand store,
   then use a generic service from `src/core/services`.
2. Add cross-context messages to `src/core/types/messages.ts` and handle them
   in the background router. Do not add ad-hoc runtime listeners.
3. Keep `src/core` generic and product-agnostic; use design tokens from
   `src/shared/theme.css` for styling.
4. The `@core`, `@shared`, and `@utils` aliases are defined in `tsconfig.json`,
   `vite.config.js`, and `vitest.config.ts`; update all three together.
5. A new extension surface needs a manifest entry. CRX derives its build entry
   from that manifest—do not add Rollup inputs manually.
6. Colocate unit tests with source files as `*.test.ts`.
7. Treat manifest permissions as product scope: remove demo permissions and
   narrow host matches before a published extension requests access.

## Verification

Run `npm run typecheck`, `npm test`, `npm run format:check`, `npm run lint`,
and `npm run build`. For UI or Chrome API changes, load `dist/` unpacked and
exercise the affected flow.
