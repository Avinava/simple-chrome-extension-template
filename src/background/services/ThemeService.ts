/**
 * ThemeService — relays theme changes across surfaces.
 *
 * A surface persists its own choice, then messages the background; the
 * background fans the change out to every other open extension page so they
 * all update together.
 */

import { MessageBus } from '@core/services'
import type { ThemeMode } from '@core/types'

class ThemeService {
  async initialize(): Promise<void> {
    // Nothing to warm up today — kept so the bootstrap has a uniform shape and
    // a place to hook future work (e.g. applying a default on install).
  }

  async handleThemeChange(theme: ThemeMode, isDark: boolean): Promise<void> {
    await MessageBus.broadcast({ action: 'themeChanged', theme, isDark })
  }
}

export const themeService = new ThemeService()
