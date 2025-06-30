import { html, render } from '../utils/preact-htm.js'
import { useState, useEffect } from 'preact/hooks'

function Popup() {
  const [count, setCount] = useState(0)
  const [currentTab, setCurrentTab] = useState(null)

  useEffect(() => {
    // Load saved count from storage
    chrome.storage.sync.get(['count'], (result) => {
      if (result.count) {
        setCount(result.count)
      }
    })

    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentTab(tabs[0])
    })
  }, [])

  const incrementCount = () => {
    const newCount = count + 1
    setCount(newCount)
    chrome.storage.sync.set({ count: newCount })
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  const openSidePanel = async () => {
    try {
      // Get the current window
      const currentWindow = await chrome.windows.getCurrent()
      chrome.sidePanel.open({ windowId: currentWindow.id })
    } catch (error) {
      console.error('Failed to open side panel:', error)
    }
  }

  return html`
    <div class="popup-container">
      <header class="popup-header">
        <img src="/icons/icon48.png" alt="Extension Icon" class="icon" />
        <h1>Simple Extension</h1>
      </header>
      
      <main class="popup-content">
        <div class="counter-section">
          <h2>Counter: ${count}</h2>
          <button onClick=${incrementCount} class="btn btn-primary">
            Increment Count
          </button>
        </div>
        
        ${currentTab && html`
          <div class="tab-info">
            <h3>Current Tab:</h3>
            <p class="tab-title">${currentTab.title}</p>
            <p class="tab-url">${currentTab.url}</p>
          </div>
        `}
        
        <div class="actions">
          <button onClick=${openOptions} class="btn btn-secondary">
            Open Options
          </button>
          <button onClick=${openSidePanel} class="btn btn-secondary">
            Open Side Panel
          </button>
        </div>
      </main>
    </div>
  `
}

render(html`<${Popup} />`, document.getElementById('root'))
