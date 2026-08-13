/**
 * Reference Zustand store for the popup surface.
 *
 * This is the pattern to copy for new surfaces: all state and *all* logic
 * (including async Chrome calls) live in the store; components just read state
 * via `useStore` and call actions. Persist through `StorageService`, talk to
 * the background through `MessageBus` — never reach for `chrome.*` in a
 * component.
 */

import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { StorageService, TabUtils, RuntimeUtils } from '@core/services'

const COUNT_KEY = 'count'

export interface PopupState {
  count: number
  currentTab: chrome.tabs.Tab | null
  load: () => Promise<void>
  increment: () => Promise<void>
  openOptions: () => void
  openSidePanel: () => Promise<void>
}

export const popupStore = createStore<PopupState>()(
  subscribeWithSelector((set, get) => ({
    count: 0,
    currentTab: null,

    load: async () => {
      const [count, currentTab] = await Promise.all([
        StorageService.get<number>(COUNT_KEY, 'sync'),
        TabUtils.getActiveTab(),
      ])
      set({ count: count ?? 0, currentTab })
    },

    increment: async () => {
      const count = get().count + 1
      set({ count })
      await StorageService.set(COUNT_KEY, count, 'sync')
    },

    openOptions: () => {
      RuntimeUtils.openOptionsPage()
    },

    openSidePanel: async () => {
      try {
        const win = await chrome.windows.getCurrent()
        if (win.id != null) await chrome.sidePanel.open({ windowId: win.id })
      } catch (error) {
        console.error('Failed to open side panel:', error)
      }
    },
  }))
)
