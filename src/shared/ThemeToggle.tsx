import { html } from '@utils/preact-htm'
import { Sun, Moon, Monitor } from 'lucide'
import { icon } from '@utils/icons'
import { useStore } from '@utils/useStore'
import { themeStore } from './themeStore'
import type { ThemeMode } from '@core/types'

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const
const LABELS: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' }

export interface ThemeToggleProps {
  /** Show the theme name next to the icon. */
  showLabel?: boolean
  className?: string
}

/**
 * A single button that cycles light → dark → system. Reads live theme from the
 * shared `themeStore`, so all instances stay in sync automatically.
 */
export function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const theme = useStore(themeStore, (s) => s.theme)

  return html`
    <button
      class="btn btn-secondary btn-icon theme-toggle ${className}"
      onClick=${() => themeStore.getState().cycleTheme()}
      title=${`Theme: ${LABELS[theme]} (click to cycle)`}
      aria-label="Toggle theme"
    >
      ${icon(ICONS[theme], { size: 16 })} ${showLabel ? html`<span>${LABELS[theme]}</span>` : null}
    </button>
  `
}
