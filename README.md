# Simple Chrome Extension Template

An **opinionated** Manifest V3 Chrome extension template. It pairs a lightweight
UI stack (Preact + HTM) with a small, typed architecture — a reusable service
layer, a message router, shared state, and a theming system — so your extension
starts with structure instead of a blank `switch` statement.

## ✨ What's in the box

- **Preact + HTM** — a ~4KB React-like UI with no JSX build step
- **TypeScript** — strict config, transpiled natively by Vite (no extra loader)
- **Vite + `@crxjs/vite-plugin`** — fast builds and HMR; the manifest drives the build
- **Zustand** — vanilla stores that work in any surface, bridged to Preact with a tiny `useStore` hook
- **Typed messaging** — a `MessageBus` + background router replace ad-hoc `chrome.runtime.onMessage` handlers
- **Chrome API wrappers** — promisified, null-safe helpers (`StorageService`, `TabUtils`, …)
- **Theming** — a design-token CSS system with light / dark / system, synced across every surface
- **Lucide icons** — tree-shaken SVG icons rendered straight into HTM
- **Tooling** — ESLint, Prettier, Vitest (+ happy-dom), path aliases, and typecheck wired up

## 📁 Project structure

```
src/
  core/              # Generic, product-agnostic infrastructure (depends only on Chrome APIs)
    services/        # MessageBus, StorageService, ChromeApiWrapper
    types/           # Message contract (ExtensionMessage union, MessageHandler)
    utils/           # generateId, ...
  background/         # Service worker
    index.ts         # initialize() — wires services, handlers, lifecycle
    handlers/        # MessageHandlers (router), CommandHandlers (shortcuts)
    services/        # ThemeService (relays theme across surfaces)
  content/            # Content script
  popup/              # Toolbar popup   (popup.tsx + popupStore.ts)
  options/            # Options page (options.tsx + optionsStore.ts)
  sidepanel/          # Side panel (sidepanel.tsx + sidepanelStore.ts)
  shared/             # Cross-surface UI: theme.css, themeStore.ts, ThemeToggle.tsx
  utils/              # useStore (zustand→Preact), icons (lucide), preact-htm
icons/                # Extension icons (16/32/48/128)
```

## 🚀 Quick start

```bash
npm install
npm run dev          # Vite dev server with HMR
```

Then load the extension:

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. **Load unpacked** → select the `dist/` folder (`npm run build` first for a production build)

## 🛠️ Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` (console/debugger stripped) |
| `npm run build:watch` | Rebuild on change |
| `npm run preview` | Preview the production build |
| `npm run clean` | Remove `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run format:all` | Format all supported files |
| `npm run lint` | Lint TypeScript and Preact code |
| `npm run zip` | Build and package `extension.zip` |

## 🧭 How it fits together

- **A surface never calls `chrome.*` directly.** It reads state from a Zustand
  store and calls actions; the store uses `StorageService` / `MessageBus`.
- **The background is a router.** `createMessageRouter` dispatches each message
  by its `action` to a small async handler — add a feature by adding a case, not
  by growing a `switch`.
- **Theme is shared.** Any surface calls `themeStore.setTheme()`; the background
  relays the change to every other open surface so they update together.

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full picture and the conventions
to follow when extending it.

## 🎯 What the demo does

The starter ships a working example of every layer: a popup counter persisted via
`StorageService`, an options settings form, a side panel listing tabs / history /
bookmarks, a content-script floating button that asks the background to show a
notification, a right-click context-menu that shows an in-page banner, a keyboard
command (`Ctrl/Cmd+Shift+Y`), and a theme toggle that syncs across all of them.
Strip out what you don't need — the infrastructure underneath is the point.

## 🔧 Customizing

- **Identity:** edit `name` / `description` in `package.json`; the build injects
  the `version` into the manifest automatically. Edit the rest in `src/manifest.json`.
- **Icons:** replace the PNGs in `icons/`.
- **Design:** change the tokens at the top of `src/shared/theme.css` — every
  surface follows them.
- **Messages:** add a message to `src/core/types/messages.ts` and a case to the
  background router.
- **Permissions:** the included content-script demo runs on web pages so it can
  show the floating button and receive context-menu messages. Before publishing,
  narrow `content_scripts[].matches` and `host_permissions` in
  `src/manifest.json` to the sites your extension actually needs, or remove the
  demo entirely. Do not ship `<all_urls>` as a default for a product extension.

## 📄 License

MIT — see [LICENSE](LICENSE).
