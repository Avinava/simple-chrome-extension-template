import { html, render } from '../utils/preact-htm.js'
import { useState, useEffect } from 'preact/hooks'

function SidePanel() {
  const [tabs, setTabs] = useState([])
  const [history, setHistory] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [activeSection, setActiveSection] = useState('tabs')

  useEffect(() => {
    loadTabs()
    loadHistory()
    loadBookmarks()
  }, [])

  const loadTabs = async () => {
    const allTabs = await chrome.tabs.query({})
    setTabs(allTabs)
  }

  const loadHistory = () => {
    chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
      setHistory(historyItems)
    })
  }

  const loadBookmarks = () => {
    chrome.bookmarks.getTree((bookmarkTree) => {
      const flatBookmarks = []
      const traverse = (nodes) => {
        nodes.forEach(node => {
          if (node.url) {
            flatBookmarks.push(node)
          }
          if (node.children) {
            traverse(node.children)
          }
        })
      }
      traverse(bookmarkTree)
      setBookmarks(flatBookmarks.slice(0, 10))
    })
  }

  const switchToTab = (tabId) => {
    chrome.tabs.update(tabId, { active: true })
  }

  const openUrl = (url) => {
    chrome.tabs.create({ url })
  }

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }

  const renderTabs = () => html`
    <div class="section-content">
      <h3>Open Tabs (${tabs.length})</h3>
      <div class="item-list">
        ${tabs.map(tab => html`
          <div key=${tab.id} class="item" onClick=${() => switchToTab(tab.id)}>
            <img src=${tab.favIconUrl || '/icons/icon16.png'} class="favicon" />
            <div class="item-info">
              <div class="item-title">${tab.title}</div>
              <div class="item-url">${formatUrl(tab.url)}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `

  const renderHistory = () => html`
    <div class="section-content">
      <h3>Recent History</h3>
      <div class="item-list">
        ${history.map(item => html`
          <div key=${item.id} class="item" onClick=${() => openUrl(item.url)}>
            <div class="item-info">
              <div class="item-title">${item.title}</div>
              <div class="item-url">${formatUrl(item.url)}</div>
              <div class="item-time">${new Date(item.lastVisitTime).toLocaleString()}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `

  const renderBookmarks = () => html`
    <div class="section-content">
      <h3>Bookmarks</h3>
      <div class="item-list">
        ${bookmarks.map(bookmark => html`
          <div key=${bookmark.id} class="item" onClick=${() => openUrl(bookmark.url)}>
            <div class="item-info">
              <div class="item-title">${bookmark.title}</div>
              <div class="item-url">${formatUrl(bookmark.url)}</div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `

  return html`
    <div class="sidepanel-container">
      <header class="sidepanel-header">
        <img src="/icons/icon32.png" alt="Extension Icon" class="icon" />
        <h1>Extension Panel</h1>
      </header>

      <nav class="sidepanel-nav">
        <button 
          class=${`nav-btn ${activeSection === 'tabs' ? 'active' : ''}`}
          onClick=${() => setActiveSection('tabs')}
        >
          Tabs
        </button>
        <button 
          class=${`nav-btn ${activeSection === 'history' ? 'active' : ''}`}
          onClick=${() => setActiveSection('history')}
        >
          History
        </button>
        <button 
          class=${`nav-btn ${activeSection === 'bookmarks' ? 'active' : ''}`}
          onClick=${() => setActiveSection('bookmarks')}
        >
          Bookmarks
        </button>
      </nav>

      <main class="sidepanel-content">
        ${activeSection === 'tabs' && renderTabs()}
        ${activeSection === 'history' && renderHistory()}
        ${activeSection === 'bookmarks' && renderBookmarks()}
      </main>
    </div>
  `
}

render(html`<${SidePanel} />`, document.getElementById('root'))
