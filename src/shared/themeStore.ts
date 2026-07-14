/**
 * Theme store — light / dark / system, persisted and synced across every
 * open extension surface.
 *
 * Flow: a surface calls `setTheme()` → we persist to `chrome.storage.sync`,
 * apply the class to <html>, and broadcast a `themeChanged` message. The
 * background relays it to every other surface, whose `setupThemeListener`
 * applies the change locally. One click, every window updates.
 */

import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { MessageBus } from '@core/services'
import { StorageService } from '@core/services'
import type { ThemeMode } from '@core/types'

const STORAGE_KEY = 'userTheme'

export interface ThemeState {
  theme: ThemeMode
  isDark: boolean
  setTheme: (theme: ThemeMode) => Promise<void>
  toggleTheme: () => void
  cycleTheme: () => void
  loadTheme: () => Promise<ThemeMode>
  initialize: () => Promise<void>
  calculateIsDark: (theme: ThemeMode) => boolean
  applyTheme: (isDark: boolean) => void
  setupThemeListener: () => void
  getThemeIcon: () => 'sun' | 'moon' | 'monitor'
  getThemeLabel: () => string
}

export const themeStore = createStore<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    theme: 'system',
    isDark: false,

    setTheme: async (theme) => {
      const isDark = get().calculateIsDark(theme)
      set({ theme, isDark })
      get().applyTheme(isDark)
      await StorageService.set(STORAGE_KEY, theme, 'sync')
      // Tell the background, which relays the change to every other surface.
      await MessageBus.send({ action: 'themeChanged', theme, isDark })
    },

    toggleTheme: () => {
      get().setTheme(get().isDark ? 'light' : 'dark')
    },

    cycleTheme: () => {
      const next: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' }
      get().setTheme(next[get().theme])
    },

    loadTheme: async () => {
      const saved = (await StorageService.get<ThemeMode>(STORAGE_KEY, 'sync')) ?? 'system'
      const isDark = get().calculateIsDark(saved)
      set({ theme: saved, isDark })
      get().applyTheme(isDark)
      return saved
    },

    initialize: async () => {
      get().setupThemeListener()
      await get().loadTheme()
    },

    calculateIsDark: (theme) => {
      if (theme === 'dark') return true
      if (theme === 'light') return false
      return (
        typeof window !== 'undefined' &&
        !!window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    },

    applyTheme: (isDark) => {
      if (typeof document === 'undefined') return
      const root = document.documentElement
      root.classList.toggle('dark-mode', isDark)
      root.classList.toggle('light-mode', !isDark)
      root.style.setProperty('--theme-mode', isDark ? 'dark' : 'light')
    },

    setupThemeListener: () => {
      // Theme changes relayed from other surfaces via the background.
      MessageBus.onMessage((message) => {
        if (message.action === 'themeChanged') {
          const { theme, isDark } = message
          if (theme !== get().theme || isDark !== get().isDark) {
            set({ theme, isDark })
            get().applyTheme(isDark)
          }
        }
      })

      // Follow the OS when in `system` mode.
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          if (get().theme === 'system') {
            const isDark = get().calculateIsDark('system')
            set({ isDark })
            get().applyTheme(isDark)
          }
        })
      }
    },

    getThemeIcon: () => {
      switch (get().theme) {
        case 'light':
          return 'sun'
        case 'dark':
          return 'moon'
        default:
          return 'monitor'
      }
    },

    getThemeLabel: () => {
      switch (get().theme) {
        case 'light':
          return 'Light'
        case 'dark':
          return 'Dark'
        default:
          return 'System'
      }
    },
  }))
)

/** Convenience initializer for any surface entry point. */
export function initializeTheme(): Promise<void> {
  return themeStore.getState().initialize()
}
