import { html, render } from '@utils/preact-htm'
import { useEffect } from 'preact/hooks'
import { ThemeToggle } from '@shared/ThemeToggle'
import { initializeTheme } from '@shared/themeStore'
import { useStore } from '@utils/useStore'
import { sidepanelStore, type SidePanelSection } from './sidepanelStore'

function hostname(url = ''): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function SidePanel() {
  const section = useStore(sidepanelStore, (state) => state.section)
  const tabs = useStore(sidepanelStore, (state) => state.tabs)
  const history = useStore(sidepanelStore, (state) => state.history)
  const bookmarks = useStore(sidepanelStore, (state) => state.bookmarks)
  const { load, setSection, openUrl, activateTab } = sidepanelStore.getState()

  useEffect(() => {
    load()
  }, [load])

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
        ${(['tabs', 'history', 'bookmarks'] as SidePanelSection[]).map(
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
