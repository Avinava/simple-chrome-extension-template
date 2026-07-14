/**
 * Keyboard-command router. Mirrors the message router, but for the
 * `chrome.commands` API (shortcuts declared under `commands` in the manifest).
 * Add a command by declaring it in the manifest and adding a case here.
 */

import { NotificationUtils, TabUtils } from '@core/services'

export type CommandName = 'show-notification'

export async function handleCommand(command: CommandName): Promise<void> {
  switch (command) {
    case 'show-notification': {
      const tab = await TabUtils.getActiveTab()
      await NotificationUtils.show(
        'Keyboard shortcut',
        tab?.title ? `Active tab: ${tab.title}` : 'Shortcut triggered'
      )
      break
    }
    default:
      console.warn(`Unknown command: ${command}`)
  }
}

export function registerCommandHandlers(): void {
  if (typeof chrome === 'undefined' || !chrome.commands) {
    console.warn('CommandHandlers: chrome.commands not available')
    return
  }
  chrome.commands.onCommand.addListener((command) => {
    handleCommand(command as CommandName)
  })
}
