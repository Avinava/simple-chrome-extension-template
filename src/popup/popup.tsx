import { html, render } from '@utils/preact-htm'
import { useEffect } from 'preact/hooks'
import { Plus, Settings, PanelRight } from 'lucide'
import { icon } from '@utils/icons'
import { useStore } from '@utils/useStore'
import { ThemeToggle } from '@shared/ThemeToggle'
import { initializeTheme } from '@shared/themeStore'
import { popupStore } from './popupStore'

function Popup() {
  const state = useStore(popupStore)
  const actions = popupStore.getState()
  const { load } = actions

  useEffect(() => {
    load()
  }, [load])

  return html`
    <div class="popup card">
      <header class="surface-header">
        <img src="/icons/icon48.png" alt="" class="icon" />
        <h1>Simple Extension</h1>
        <span class="spacer"></span>
        <${ThemeToggle} />
      </header>

      <section class="counter card">
        <div class="counter-value">${state.count}</div>
        <button class="btn btn-primary" onClick=${actions.increment}>
          ${icon(Plus, { size: 16 })} Increment
        </button>
      </section>

      ${
        state.currentTab &&
        html`
          <section class="tab-info">
            <div class="form-label">Current tab</div>
            <div class="item-title">${state.currentTab.title}</div>
            <div class="item-url">${state.currentTab.url}</div>
          </section>
        `
      }

      <div class="stack">
        <button class="btn btn-secondary" onClick=${actions.openOptions}>
          ${icon(Settings, { size: 16 })} Open Options
        </button>
        <button class="btn btn-secondary" onClick=${actions.openSidePanel}>
          ${icon(PanelRight, { size: 16 })} Open Side Panel
        </button>
      </div>
    </div>
  `
}

initializeTheme()
render(html`<${Popup} />`, document.getElementById('root')!)
