import { createStore } from 'zustand/vanilla'
import { StorageService } from '@core/services'

export interface Settings {
  notifications: boolean
  autoSave: boolean
  customText: string
}

const SETTINGS_KEY = 'settings'
export const DEFAULT_SETTINGS: Settings = { notifications: true, autoSave: true, customText: '' }

export interface OptionsState {
  settings: Settings
  saved: boolean
  load: () => Promise<void>
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  save: () => Promise<void>
  reset: () => Promise<void>
}

export const optionsStore = createStore<OptionsState>()((set, get) => ({
  settings: DEFAULT_SETTINGS,
  saved: false,
  load: async () => {
    const stored = await StorageService.get<Settings>(SETTINGS_KEY, 'sync')
    set({ settings: { ...DEFAULT_SETTINGS, ...stored } })
  },
  update: (key, value) => set({ settings: { ...get().settings, [key]: value }, saved: false }),
  save: async () => {
    await StorageService.set(SETTINGS_KEY, get().settings, 'sync')
    set({ saved: true })
  },
  reset: async () => {
    await StorageService.set(SETTINGS_KEY, DEFAULT_SETTINGS, 'sync')
    set({ settings: DEFAULT_SETTINGS, saved: true })
  },
}))
