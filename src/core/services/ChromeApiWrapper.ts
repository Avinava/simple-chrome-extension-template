/**
 * ChromeApiWrapper — small, promisified, null-safe helpers around common
 * Chrome extension APIs. Grouped by concern so surfaces can import just what
 * they need: `TabUtils`, `ScriptUtils`, `RuntimeUtils`, `NotificationUtils`.
 */

/** Helpers for working with tabs. */
export class TabUtils {
  /** The current active tab in the focused window, or `null`. */
  static async getActiveTab(): Promise<chrome.tabs.Tab | null> {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) return null
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      return tab ?? null
    } catch (error) {
      console.error('TabUtils.getActiveTab error:', error)
      return null
    }
  }

  /** A tab by id, or `null`. */
  static async getTab(tabId: number): Promise<chrome.tabs.Tab | null> {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) return null
      return await chrome.tabs.get(tabId)
    } catch (error) {
      console.error('TabUtils.getTab error:', error)
      return null
    }
  }

  /** Whether a URL is an ordinary web page a content script / injection can touch. */
  static isInjectableUrl(url?: string): boolean {
    if (!url) return false
    const restricted = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:',
      'view-source:',
    ]
    return !restricted.some((prefix) => url.startsWith(prefix))
  }

  /** Open a new tab. */
  static async createTab(url: string, active = true): Promise<chrome.tabs.Tab | null> {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) return null
      return await chrome.tabs.create({ url, active })
    } catch (error) {
      console.error('TabUtils.createTab error:', error)
      return null
    }
  }

  /** Activate a tab and focus its window. */
  static async focusTab(tabId: number): Promise<void> {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) return
      const tab = await chrome.tabs.get(tabId)
      if (!tab) return
      await chrome.tabs.update(tabId, { active: true })
      if (tab.windowId) await chrome.windows.update(tab.windowId, { focused: true })
    } catch (error) {
      console.error('TabUtils.focusTab error:', error)
    }
  }
}

/** Helpers for programmatic script injection. */
export class ScriptUtils {
  /** Run a function inside a tab's page context and return its result. */
  static async executeFunction<T, A extends unknown[]>(
    tabId: number,
    func: (...args: A) => T,
    ...args: A
  ): Promise<T | null> {
    try {
      if (typeof chrome === 'undefined' || !chrome.scripting) return null
      const results = await chrome.scripting.executeScript({ target: { tabId }, func, args })
      return (results?.[0]?.result as T) ?? null
    } catch (error) {
      console.error('ScriptUtils.executeFunction error:', error)
      return null
    }
  }
}

/** Helpers for the extension runtime. */
export class RuntimeUtils {
  /** Absolute URL for a packaged resource. */
  static getExtensionUrl(path = ''): string {
    if (typeof chrome === 'undefined' || !chrome.runtime) return path
    return chrome.runtime.getURL(path)
  }

  /** Open the extension's options page. */
  static async openOptionsPage(): Promise<void> {
    try {
      if (typeof chrome === 'undefined' || !chrome.runtime) return
      await chrome.runtime.openOptionsPage()
    } catch (error) {
      console.error('RuntimeUtils.openOptionsPage error:', error)
    }
  }
}

/** Helpers for browser notifications. */
export class NotificationUtils {
  static async show(title: string, message: string, iconPath = 'icons/icon48.png'): Promise<void> {
    try {
      if (typeof chrome === 'undefined' || !chrome.notifications) return
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: RuntimeUtils.getExtensionUrl(iconPath),
        title,
        message,
      })
    } catch (error) {
      console.error('NotificationUtils.show error:', error)
    }
  }
}

/** Resolve after `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
