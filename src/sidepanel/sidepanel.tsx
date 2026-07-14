import { html, render } from '@utils/preact-htm'
import { useState, useEffect } from 'preact/hooks'
import { TabUtils } from '@core/services'
import { ThemeToggle } from '@shared/ThemeToggle'
import { initializeTheme } from '@shared/themeStore'

type Section = 'tabs' | 'history' | 'bookmarks'

function hostname(url = ''): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function SidePanel() {
  const [section, setSection] = useState<Section>('tabs')
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([])
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])

  useEffect(() => {
    chrome.tabs?.query({}).then(setTabs)
    chrome.history?.search({ text: '', maxResults: 15 }, setHistory)
    chrome.bookmarks?.getTree((tree) => {
      const flat: chrome.bookmarks.BookmarkTreeNode[] = []
      const walk = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
        for (const node of nodes) {
          if (node.url) flat.push(node)
          if (node.children) walk(node.children)
        }
      }
      walk(tree)
      setBookmarks(flat.slice(0, 15))
    })
  }, [])

  const openUrl = (url?: string) => url && TabUtils.createTab(url)
  const activateTab = (id?: number) => id != null && chrome.tabs.update(id, { active: true })

  const list = html`
    <div class="item-list">
      ${
        section === 'tabs' &&
        tabs.map(
          (tab) => html`
            <div class="item" key=${tab.id} onClick=${() => activateTab(tab.id)}>
              <img class="favicon" src=${tab.favIconUrl || '/icons/icon16.png'} alt="" />
              <div class="item-info">
                <div class="item-title">${tab.title}</div>
                <div class="item-url">${hostname(tab.url)}</div>
              </div>
            </div>
          `
        )
      }
      ${
        section === 'history' &&
        history.map(
          (item) => html`
            <div class="item" key=${item.id} onClick=${() => openUrl(item.url)}>
              <div class="item-info">
                <div class="item-title">${item.title || hostname(item.url)}</div>
                <div class="item-url">${hostname(item.url)}</div>
              </div>
            </div>
          `
        )
      }
      ${
        section === 'bookmarks' &&
        bookmarks.map(
          (bm) => html`
            <div class="item" key=${bm.id} onClick=${() => openUrl(bm.url)}>
              <div class="item-info">
                <div class="item-title">${bm.title}</div>
                <div class="item-url">${hostname(bm.url)}</div>
              </div>
            </div>
          `
        )
      }
    </div>
  `

  return html`
    <div class="sidepanel">
      <header class="surface-header">
        <img src="/icons/icon32.png" alt="" class="icon" />
        <h1>Extension Panel</h1>
        <span class="spacer"></span>
        <${ThemeToggle} />
      </header>

      <nav class="nav">
        ${(['tabs', 'history', 'bookmarks'] as Section[]).map(
          (s) => html`
            <button class="nav-btn ${section === s ? 'active' : ''}" onClick=${() => setSection(s)}>
              ${s[0].toUpperCase() + s.slice(1)}
            </button>
          `
        )}
      </nav>

      <main class="sidepanel-content">${list}</main>
    </div>
  `
}

initializeTheme()
render(html`<${SidePanel} />`, document.getElementById('root')!)
