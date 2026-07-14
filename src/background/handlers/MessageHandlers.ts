/**
 * Message router for the background service worker.
 *
 * Instead of one giant `switch`, each domain gets a small async handler that
 * returns `{ handled, response }`. `createMessageRouter` picks the right one by
 * `action`, keeps the channel open for async replies, and turns thrown errors
 * into a `{ success: false }` response. Add a feature by adding a handler and a
 * case — nothing else changes.
 */

import type { ExtensionMessage, CommonResponse } from '@core/types'
import { TabUtils, NotificationUtils } from '@core/services'
import { themeService } from '../services'

export interface HandlerResult {
  handled: boolean
  response?: CommonResponse
}

async function handleMessage(
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender
): Promise<HandlerResult> {
  switch (message.action) {
    case 'themeChanged':
      await themeService.handleThemeChange(message.theme, message.isDark)
      return { handled: true, response: { success: true } }

    case 'ping':
      return { handled: true, response: { success: true, data: 'pong' } }

    case 'getTabInfo': {
      const tab = await TabUtils.getActiveTab()
      return { handled: true, response: { success: !!tab, data: tab ?? undefined } }
    }

    case 'notify':
      await NotificationUtils.show(message.title ?? 'Notification', message.message)
      return { handled: true, response: { success: true } }

    default:
      return { handled: false }
  }
}

export function createMessageRouter() {
  return (
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: CommonResponse) => void
  ): boolean => {
    const action = (message as { action?: string })?.action
    if (!action) {
      sendResponse({ success: false, error: 'No action specified' })
      return false
    }

    handleMessage(message, sender)
      .then((result) => {
        if (result.handled) {
          sendResponse(result.response ?? { success: true })
        } else {
          sendResponse({ success: false, error: `Unknown action: ${action}` })
        }
      })
      .catch((error) => {
        sendResponse({ success: false, error: error instanceof Error ? error.message : 'Error' })
      })

    return true // keep the channel open for the async sendResponse
  }
}

export function registerMessageHandlers(): void {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.warn('MessageHandlers: chrome.runtime not available')
    return
  }
  chrome.runtime.onMessage.addListener(createMessageRouter())
}
