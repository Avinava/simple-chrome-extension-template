/**
 * Content script — runs in the page. Demonstrates both directions of
 * messaging: a floating button that asks the background to show a notification
 * (page → background), and an in-page banner shown on request (background →
 * page, e.g. from the context menu).
 */

import { MessageBus } from '@core/services'
import type { ExtensionMessage } from '@core/types'

const BUTTON_ID = 'simple-extension-button'

function createFloatingButton(): void {
  if (document.getElementById(BUTTON_ID)) return

  const button = document.createElement('button')
  button.id = BUTTON_ID
  button.textContent = '🚀'
  button.setAttribute('aria-label', 'Simple Extension')
  Object.assign(button.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: '2147483000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  } satisfies Partial<CSSStyleDeclaration>)

  button.addEventListener('click', () => {
    MessageBus.send({
      action: 'notify',
      title: 'Simple Extension',
      message: `Button clicked on ${window.location.hostname}`,
    })
  })

  document.body.appendChild(button)
}

function showBanner(text: string): void {
  const banner = document.createElement('div')
  banner.textContent = text
  Object.assign(banner.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 20px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    zIndex: '2147483000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  } satisfies Partial<CSSStyleDeclaration>)

  document.body.appendChild(banner)
  setTimeout(() => banner.remove(), 3000)
}

MessageBus.onMessage((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.action === 'showBanner') {
    showBanner(message.text)
    sendResponse({ success: true })
  }
})

function init(): void {
  createFloatingButton()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
