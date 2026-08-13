import { html, render } from '@utils/preact-htm'
import { useEffect } from 'preact/hooks'
import { ThemeToggle } from '@shared/ThemeToggle'
import { initializeTheme } from '@shared/themeStore'
import { useStore } from '@utils/useStore'
import { optionsStore } from './optionsStore'

function Options() {
  const settings = useStore(optionsStore, (state) => state.settings)
  const saved = useStore(optionsStore, (state) => state.saved)
  const { load, update, save, reset } = optionsStore.getState()

  useEffect(() => {
    load()
  }, [load])

  return html`
    <div class="options">
      <header class="surface-header">
        <img src="/icons/icon48.png" alt="" class="icon" />
        <h1>Extension Options</h1>
        <span class="spacer"></span>
        <${ThemeToggle} showLabel=${true} />
      </header>

      <section class="card stack">
        <h2>Notifications</h2>
        <label class="checkbox-row">
          <input
            type="checkbox"
            checked=${settings.notifications}
            onChange=${(e: Event) =>
              update('notifications', (e.target as HTMLInputElement).checked)}
          />
          Enable notifications
        </label>
      </section>

      <section class="card stack">
        <h2>Behavior</h2>
        <label class="checkbox-row">
          <input
            type="checkbox"
            checked=${settings.autoSave}
            onChange=${(e: Event) => update('autoSave', (e.target as HTMLInputElement).checked)}
          />
          Auto-save changes
        </label>
      </section>

      <section class="card stack">
        <h2>Custom message</h2>
        <textarea
          class="form-control"
          placeholder="Enter a custom message..."
          value=${settings.customText}
          onInput=${(e: Event) => update('customText', (e.target as HTMLTextAreaElement).value)}
        ></textarea>
      </section>

      <div class="row">
        <button class="btn btn-primary" onClick=${save}>Save Settings</button>
        <button class="btn btn-secondary" onClick=${reset}>Reset to Default</button>
        ${saved && html`<span class="badge">Saved</span>`}
      </div>
    </div>
  `
}

initializeTheme()
render(html`<${Options} />`, document.getElementById('root')!)
