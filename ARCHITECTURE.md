# Architecture

This template is organized into layers so that generic infrastructure stays
separate from surface-specific UI. The goal: you can grow the extension by
adding features, not by editing one giant file.

## Layers

```
core        →  generic infrastructure; depends only on Chrome APIs
background  →  privileged orchestration (service worker)
surfaces    →  popup / options / sidepanel — each a self-contained mini-app
content     →  scripts injected into web pages
shared      →  cross-surface UI (theme system)
utils       →  small framework glue (useStore, icons, preact-htm)
```

**Dependency direction:** surfaces and `content` depend on `core`, `shared`, and
`utils`. `core` depends on nothing but the Chrome APIs. Nothing depends on a
surface. Keep it that way.

## Core (`src/core`)

The reusable heart of the template.

- **`services/MessageBus`** — typed `send` / `sendToTab` / `onMessage` /
  `broadcast`. Wraps `chrome.runtime` / `chrome.tabs` messaging in promises that
  always resolve with a `CommonResponse` (never throw) and guards a missing
  `chrome` runtime so it is unit-testable.
- **`services/StorageService`** — promisified, typed access to `chrome.storage`
  across `local` / `session` / `sync`, with safe fallbacks.
- **`services/ChromeApiWrapper`** — `TabUtils`, `HistoryUtils`, `BookmarkUtils`,
  `ScriptUtils`, `RuntimeUtils`, `SidePanelUtils`, `NotificationUtils`, `sleep`.
- **`types/messages`** — the message contract. Every message is discriminated by
  a literal `action` and unioned into `ExtensionMessage`. This is the single
  source of truth both the router and `MessageBus` are typed against.
- **`utils`** — small pure helpers (`generateId`).

Import from the barrel: `import { MessageBus, StorageService } from '@core/services'`.

## Messaging

One contract, one router.

1. A surface (or its store) calls `MessageBus.send({ action: '...' })`.
2. The background's `createMessageRouter` (in `background/handlers/MessageHandlers.ts`)
   dispatches by `action` to a small async handler that returns
   `{ handled, response }` and replies via `sendResponse`.
3. To add a message: declare its interface in `core/types/messages.ts`, add it to
   the `ExtensionMessage` union, and add a `case` to the router. Types flow
   everywhere automatically.

Keyboard shortcuts follow the same shape in `handlers/CommandHandlers.ts`,
dispatching `chrome.commands` by name.

## State (Zustand)

Each surface owns a **vanilla Zustand store** (`createStore` +
`subscribeWithSelector`) — see `popup/popupStore.ts` for the reference. Rules:

- **All logic lives in store actions**, including async `chrome.*` calls (through
  the core services). Components stay presentational.
- Components read state with the `useStore(store, selector)` hook
  (`utils/useStore.ts`), which subscribes on mount and cleans up on unmount.
- Actions from `store.getState()` are stable — call them directly from handlers.

## Theming

`shared/theme.css` is the design system: CSS custom properties for color,
spacing, radius, typography, shadows, and z-index. Every surface `@import`s it and
styles itself with `var(--token)` — never hardcoded values.

`shared/themeStore.ts` manages `light | dark | system`, persists to
`chrome.storage.sync`, toggles the `.dark-mode` / `.light-mode` class on `<html>`,
and broadcasts changes. The background's `ThemeService` relays a change to every
other open surface, whose `setupThemeListener` applies it — so one toggle updates
every window. `ThemeToggle.tsx` is a drop-in control.

## UI (Preact + HTM)

No JSX build step: components return `html\`...\`` tagged templates and are
mounted with `render(html\`<${App} />\`, root)`. Icons come from `lucide` as
tree-shaken named imports, rendered to VNodes by `utils/icons.ts`.

## Conventions

- **Never call `chrome.*` from a component** — go through a store + core service.
- **Add a message, not a special case** — extend the contract and the router.
- **Style with tokens** — extend `theme.css` rather than hardcoding values.
- **Keep `core` generic** — no product-specific logic belongs there.
- **Path aliases** (`@core`, `@shared`, `@utils`) are defined in three places
  that must stay in sync: `tsconfig.json`, `vite.config.js`, `vitest.config.ts`.
