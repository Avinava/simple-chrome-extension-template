/**
 * Message contract for typed communication between extension surfaces.
 *
 * Every message is a plain object discriminated by its `action` string. Add new
 * messages by declaring an interface with a literal `action` and adding it to the
 * `ExtensionMessage` union — handlers and `MessageBus` stay type-safe automatically.
 */

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/** Available theme modes. */
export type ThemeMode = 'light' | 'dark' | 'system'

/** Broadcast when the theme changes, so every open surface can stay in sync. */
export interface ThemeMessage {
  action: 'themeChanged'
  theme: ThemeMode
  isDark: boolean
}

// ---------------------------------------------------------------------------
// Example messages — delete or replace these with your own.
// ---------------------------------------------------------------------------

/** Health-check ping. */
export interface PingMessage {
  action: 'ping'
}

/** Ask the background script for the current active tab. */
export interface GetTabInfoMessage {
  action: 'getTabInfo'
}

/** Ask the background script to show a browser notification. */
export interface NotifyMessage {
  action: 'notify'
  title?: string
  message: string
}

/** Ask a content script to show a short in-page banner. */
export interface ShowBannerMessage {
  action: 'showBanner'
  text: string
}

// ---------------------------------------------------------------------------
// Unions & handler signature
// ---------------------------------------------------------------------------

/** All messages that flow through the extension. */
export type ExtensionMessage =
  ThemeMessage | PingMessage | GetTabInfoMessage | NotifyMessage | ShowBannerMessage

/** Standard response shape returned to every `sendMessage` caller. */
export interface CommonResponse<T = unknown> {
  success: boolean
  error?: string
  data?: T
}

/** Signature for a message handler. Return `true` to keep the channel open for an async response. */
export type MessageHandler<T extends ExtensionMessage = ExtensionMessage, R = CommonResponse> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: R) => void
) => boolean | void
