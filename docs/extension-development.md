# Extension development guide

Use this guide when turning the starter into a product extension. It covers the
places where a browser extension differs most from a conventional web app.

## Start by reducing the demo

The repository demonstrates a popup, options page, side panel, content script,
context menu, command, notification, and theme synchronization. Keep only what
your product needs. In particular, remove unused permissions, commands, and
content-script matches before release.

The supplied `<all_urls>` match exists only to make the content-script example
immediately visible. Replace it with the narrowest HTTPS domains possible, or
remove the content script and `host_permissions` entirely.

## Put work in the right context

| Need | Place it |
| --- | --- |
| Rendering and user interaction | A popup, options, or side-panel component |
| Surface state and async behavior | That surface's Zustand store |
| Generic browser operation | A helper in `src/core/services` |
| Cross-context coordination | Typed message + background router handler |
| Page DOM access | Content script |
| Lifecycle, commands, or privileged orchestration | Background service worker |

## Storage and messaging

Use `StorageService` instead of direct storage calls so code remains typed and
testable. Use sync storage for small user preferences and choose local or
session storage deliberately for product data.

Messages are request/response operations. Always return a meaningful failure
when a requested action cannot run—for example, a denied notification must not
be reported as successful. Do not pass unvalidated page-originated data into a
privileged Chrome API.

## Test and release

Unit-test logic near the source that owns it. Then test the built extension in
Chrome: load `dist/` unpacked, reload after a rebuild, exercise changed
permissions and lifecycle behavior, and inspect the service-worker console.

Use the checklist in [AGENTS.md](../AGENTS.md) before opening a pull request.
