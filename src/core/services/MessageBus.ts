/**
 * MessageBus — centralized, typed message passing between extension surfaces.
 *
 * Every method guards against a missing `chrome` runtime so this module can be
 * unit-tested outside the extension, and resolves (never rejects) with a
 * `CommonResponse` so callers can handle failures without try/catch everywhere.
 */

import type { ExtensionMessage, CommonResponse } from '../types/messages'

export class MessageBus {
  /** Send a message to the background script / other surfaces. */
  static async send<T extends ExtensionMessage>(message: T): Promise<CommonResponse> {
    try {
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.warn('MessageBus: chrome.runtime not available')
        return { success: false, error: 'chrome.runtime not available' }
      }

      return await new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message })
          } else {
            resolve(response ?? { success: true })
          }
        })
      })
    } catch (error) {
      return { success: false, error: errorMessage(error) }
    }
  }

  /** Send a message to a specific tab's content script. */
  static async sendToTab<T extends ExtensionMessage>(
    tabId: number,
    message: T
  ): Promise<CommonResponse> {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        console.warn('MessageBus: chrome.tabs not available')
        return { success: false, error: 'chrome.tabs not available' }
      }

      return await new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message })
          } else {
            resolve(response ?? { success: true })
          }
        })
      })
    } catch (error) {
      return { success: false, error: errorMessage(error) }
    }
  }

  /**
   * Register a message listener.
   * @returns a cleanup function that removes the listener.
   */
  static onMessage(
    handler: (
      message: ExtensionMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: CommonResponse) => void
    ) => boolean | void
  ): () => void {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.warn('MessageBus: cannot register listener, chrome.runtime not available')
      return () => {}
    }

    const wrapped = (
      message: unknown,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: CommonResponse) => void
    ) => handler(message as ExtensionMessage, sender, sendResponse)

    chrome.runtime.onMessage.addListener(wrapped)
    return () => chrome.runtime.onMessage.removeListener(wrapped)
  }

  /**
   * Broadcast a message to every other open extension page (popup, options,
   * side panel). Uses `chrome.runtime.sendMessage`, which reaches extension
   * pages regardless of whether they are hosted in a tab — unlike
   * `chrome.tabs.query`, which never returns the popup or side panel. The
   * sender does not receive its own broadcast, and content scripts are not
   * targeted (message them explicitly with `sendToTab`).
   */
  static async broadcast<T extends ExtensionMessage>(message: T): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.warn('MessageBus: cannot broadcast, chrome.runtime not available')
      return
    }

    try {
      await chrome.runtime.sendMessage(message)
    } catch {
      // No other extension page is listening — expected, not an error.
    }
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}
