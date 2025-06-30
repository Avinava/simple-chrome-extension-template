import { html, render } from '../utils/preact-htm.js'
import { useState, useEffect } from 'preact/hooks'

function Options() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    customText: ''
  })

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings({ ...settings, ...result.settings })
      }
    })
  }, [])

  const saveSettings = () => {
    chrome.storage.sync.set({ settings })
    alert('Settings saved!')
  }

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'dark',
      notifications: true,
      autoSave: true,
      customText: ''
    }
    setSettings(defaultSettings)
    chrome.storage.sync.set({ settings: defaultSettings })
  }

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  return html`
    <div class="options-container">
      <header class="options-header">
        <img src="/icons/icon48.png" alt="Extension Icon" class="icon" />
        <h1>Extension Options</h1>
      </header>

      <main class="options-content">
        <section class="settings-section">
          <h2>Appearance</h2>
          <div class="setting-item">
            <label for="theme">Theme:</label>
            <select 
              id="theme" 
              value=${settings.theme} 
              onChange=${(e) => updateSetting('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </section>

        <section class="settings-section">
          <h2>Notifications</h2>
          <div class="setting-item">
            <label for="notifications">
              <input 
                type="checkbox" 
                id="notifications"
                checked=${settings.notifications}
                onChange=${(e) => updateSetting('notifications', e.target.checked)}
              />
              Enable notifications
            </label>
          </div>
        </section>

        <section class="settings-section">
          <h2>Behavior</h2>
          <div class="setting-item">
            <label for="autoSave">
              <input 
                type="checkbox" 
                id="autoSave"
                checked=${settings.autoSave}
                onChange=${(e) => updateSetting('autoSave', e.target.checked)}
              />
              Auto-save changes
            </label>
          </div>
        </section>

        <section class="settings-section">
          <h2>Custom Text</h2>
          <div class="setting-item">
            <label for="customText">Custom message:</label>
            <textarea 
              id="customText"
              value=${settings.customText}
              onInput=${(e) => updateSetting('customText', e.target.value)}
              placeholder="Enter your custom message here..."
            ></textarea>
          </div>
        </section>

        <div class="actions">
          <button onClick=${saveSettings} class="btn btn-primary">
            Save Settings
          </button>
          <button onClick=${resetSettings} class="btn btn-secondary">
            Reset to Default
          </button>
        </div>
      </main>
    </div>
  `
}

render(html`<${Options} />`, document.getElementById('root'))
