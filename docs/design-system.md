# Design system

The shared design system lives in [`src/shared/theme.css`](../src/shared/theme.css).
It gives the popup, options page, and side panel one visual language without a
component-library dependency.

## Tokens

Use CSS custom properties rather than hardcoded values. The token groups are:

| Group | Examples | Use |
| --- | --- | --- |
| Brand and status | `--color-primary`, `--color-success`, `--color-error` | Actions and feedback |
| Surfaces and text | `--bg-primary`, `--text-secondary`, `--border-primary` | Layout and hierarchy |
| Spacing and radius | `--spacing-md`, `--radius-lg` | Consistent rhythm and shape |
| Typography | `--font-size-sm`, `--font-weight-semibold` | Readable UI hierarchy |
| Elevation and motion | `--shadow-md`, `--transition-fast`, `--focus-ring` | Interaction feedback |
| Layering | `--z-dropdown` through `--z-tooltip` | Overlays and transient UI |

For example:

```css
.status-card {
  padding: var(--spacing-xl);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}
```

## Theme behavior

`themeStore` supports `light`, `dark`, and `system` modes. The selected mode is
stored in `chrome.storage.sync`, applied to the document root, and relayed by
the background worker to other open extension surfaces. System mode follows OS
preference changes while it is selected.

Theme precedence is:

1. Light tokens on `:root`.
2. Dark tokens from `prefers-color-scheme` when no explicit choice exists.
3. `.light-mode` or `.dark-mode` on `<html>` when the user chose a mode.

## Shared primitives

The stylesheet includes small, intentionally generic primitives such as
`.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.stack`, and
`.surface-header`. Reuse them before adding a surface-specific equivalent.

When a new primitive is broadly useful, add it to `theme.css`; otherwise keep
the styling next to its surface. All interactive controls need a visible
keyboard focus state and should use the existing focus-ring token.

## Extending the palette

Add a semantic token first, then consume it. For example, use
`--color-info` rather than a raw blue value in a new feature. Define both its
light and dark behavior if the token represents a surface, text, border, or
overlay. Brand and status colors can remain shared when they retain adequate
contrast in both themes.
