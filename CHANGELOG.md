# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI, Dependabot, ESLint, EditorConfig, contributor/security guidance, and a
  vendor-neutral `AGENTS.md` instruction source.
- Stores for the options page and side panel, plus history, bookmark, and side
  panel core service helpers.
- Background message-router coverage, including notification failure handling.

### Changed

- Refreshed the Vite, CRX, TypeScript, UI, test, formatting, and type packages.
- Made all surfaces follow the store-and-service architecture and made the
  notifications setting take effect.
- Removed obsolete build configuration, unused aliases and permissions, and the
  dead environment-file example.
- Made context-menu setup idempotent and enabled side-panel opening from the
  toolbar action.

## [2.0.0] - 2026-07-14

A ground-up upgrade from a minimal starter into an opinionated, typed template.

### Added

- **TypeScript** across the codebase (`tsconfig.json`, `npm run typecheck`), transpiled natively by Vite.
- **Core infrastructure layer** (`src/core`): `MessageBus` (typed messaging), `StorageService` (promisified `chrome.storage`), `ChromeApiWrapper` (`TabUtils`/`ScriptUtils`/`RuntimeUtils`/`NotificationUtils`), a message contract (`ExtensionMessage` union + `MessageHandler`), and `generateId`.
- **Background message router** (`createMessageRouter`) and command router, replacing ad-hoc `chrome.runtime.onMessage` switches.
- **Zustand** state management with a reference store (`popupStore`) and a `useStore` hook that bridges vanilla stores into Preact.
- **Theming system**: a design-token stylesheet (`shared/theme.css`), a `themeStore` (light/dark/system, persisted and synced across surfaces), a `ThemeService` relay, and a `ThemeToggle` component.
- **Lucide icons** rendered into HTM via a small `icon()` helper.
- **Tooling**: Prettier config, Vitest + happy-dom with example tests, path aliases (`@core`, `@shared`, …), and a production console/debugger strip.
- **Docs**: `ARCHITECTURE.md` and AI/contributor guides (`.github/copilot-instructions.md`, `CLAUDE.md`).

### Changed

- Every surface (popup, options, side panel, content, background) migrated to TypeScript and rewired to go through the core services instead of calling `chrome.*` directly.
- Surface styling now consumes shared design tokens instead of per-file hardcoded gradients.
- The manifest `version` is now injected from `package.json` at build time (single source of truth).
- Manifest permissions aligned with the APIs actually used (`tabs`, `notifications`, `history`, `bookmarks`).

[Unreleased]: https://github.com/Avinava/simple-chrome-extension-template/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Avinava/simple-chrome-extension-template/releases/tag/v2.0.0

## [1.0.0] - 2025-06-30

### Added

- Initial release: popup, options, side panel, background service worker, and content script built with Preact, HTM, and Vite.
- Chrome storage integration, context menus, notifications, and a floating action button.
- Manifest V3 structure with development and build scripts.
