import { html, render } from '@utils/preact-htm'
import { useState, useEffect } from 'preact/hooks'
import { StorageService } from '@core/services'
import { ThemeToggle } from '@shared/ThemeToggle'
import { initializeTheme } from '@shared/themeStore'

interface Settings {
  notifications: boolean
  autoSave: boolean
  customText: string
}

const DEFAULTS: Settings = { notifications: true, autoSave: true, customText: '' }
const SETTINGS_KEY = 'settings'

function Options() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    StorageService.get<Settings>(SETTINGS_KEY, 'sync').then((stored) => {
      if (stored) setSettings({ ...DEFAULTS, ...stored })
    })
  }, [])

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const save = async () => {
    await StorageService.set(SETTINGS_KEY, settings, 'sync')
    setSaved(true)
  }

  const reset = async () => {
    setSettings(DEFAULTS)
    await StorageService.set(SETTINGS_KEY, DEFAULTS, 'sync')
    setSaved(true)
  }

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
