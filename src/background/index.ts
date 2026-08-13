/**
 * Background service worker — the extension's entry point.
 *
 * `initialize()` wires the three concerns up front: theme relay, the message
 * router, and keyboard commands, plus install/context-menu lifecycle. Keep this
 * file thin: real work lives in `services/` and `handlers/`.
 */

import { themeService } from './services'
import { registerMessageHandlers } from './handlers/MessageHandlers'
import { registerCommandHandlers } from './handlers/CommandHandlers'
import { StorageService, MessageBus } from '@core/services'

const CONTEXT_MENU_ID = 'template-action'

async function initialize(): Promise<void> {
  await themeService.initialize()
  registerMessageHandlers()
  registerCommandHandlers()
  registerLifecycle()
  console.log('Extension background initialized')
}

function registerLifecycle(): void {
  if (typeof chrome === 'undefined' || !chrome.runtime) return

  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      // Seed default settings on first install.
      await StorageService.set(
        'settings',
        { notifications: true, autoSave: true, customText: '' },
        'sync'
      )
    }

    if (chrome.contextMenus) {
      chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: 'Template action',
        contexts: ['selection', 'page'],
      })
    }
  })

  // Relay context-menu clicks to the active tab's content script.
  chrome.contextMenus?.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID && tab?.id) {
      MessageBus.sendToTab(tab.id, {
        action: 'showBanner',
        text: info.selectionText
          ? `Selected: ${info.selectionText.slice(0, 60)}`
          : 'Context menu clicked',
      })
    }
  })

  // Let clicking the toolbar icon open the side panel.
  chrome.sidePanel?.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {})
}

initialize()

export { initialize }
