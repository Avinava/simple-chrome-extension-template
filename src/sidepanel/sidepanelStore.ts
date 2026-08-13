import { createStore } from 'zustand/vanilla'
import { BookmarkUtils, HistoryUtils, TabUtils } from '@core/services'

export type SidePanelSection = 'tabs' | 'history' | 'bookmarks'

export interface SidePanelState {
  section: SidePanelSection
  tabs: chrome.tabs.Tab[]
  history: chrome.history.HistoryItem[]
  bookmarks: chrome.bookmarks.BookmarkTreeNode[]
  load: () => Promise<void>
  setSection: (section: SidePanelSection) => void
  openUrl: (url?: string) => Promise<void>
  activateTab: (tabId?: number) => Promise<void>
}

export const sidepanelStore = createStore<SidePanelState>()((set) => ({
  section: 'tabs',
  tabs: [],
  history: [],
  bookmarks: [],
  load: async () => {
    const [tabs, history, bookmarks] = await Promise.all([
      TabUtils.getAllTabs(),
      HistoryUtils.search(),
      BookmarkUtils.getBookmarks(),
    ])
    set({ tabs, history, bookmarks })
  },
  setSection: (section) => set({ section }),
  openUrl: async (url) => {
    if (url) await TabUtils.createTab(url)
  },
  activateTab: async (tabId) => {
    if (tabId != null) await TabUtils.focusTab(tabId)
  },
}))
