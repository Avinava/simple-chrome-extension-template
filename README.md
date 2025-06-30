# Simple Chrome Extension Template

A modern, lightweight Chrome extension template built with **Preact**, **HTM**, and **Vite**. This boilerplate provides a complete foundation for building Chrome extensions with a modern development experience.

## 🚀 Features

- **Modern Stack**: Built with Preact (3KB React alternative) and HTM (JSX alternative)
- **Fast Development**: Powered by Vite for lightning-fast builds and HMR
- **Complete Extension Structure**: Includes popup, options page, side panel, background script, and content script
- **Storage Integration**: Examples of using Chrome storage API
- **Beautiful UI**: Modern gradient design with smooth animations
- **Cross-browser Compatible**: Manifest V3 compliant
- **TypeScript Ready**: Easy to convert to TypeScript if needed

## 📁 Project Structure

```
src/
├── manifest.json          # Extension manifest
├── popup/                 # Extension popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/               # Options page
│   ├── options.html
│   ├── options.js
│   └── options.css
├── sidepanel/             # Side panel (Chrome 114+)
│   ├── sidepanel.html
│   ├── sidepanel.js
│   └── sidepanel.css
├── background/            # Background service worker
│   └── background.js
├── content/               # Content script
│   └── content.js
└── utils/                 # Shared utilities
    └── preact-htm.js
icons/                     # Extension icons
├── icon16.png
├── icon32.png
├── icon48.png
└── icon128.png
```

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <this-repo>
cd simple-chrome-extension-template
npm install
```

### 2. Add Icons

Create or add your extension icons in the `icons/` directory:
- `icon16.png` (16x16)
- `icon32.png` (32x32) 
- `icon48.png` (48x48)
- `icon128.png` (128x128)

### 3. Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build and watch for changes
npm run build:watch
```

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder

## 📚 What's Included

### Popup (`src/popup/`)
- Counter example with Chrome storage
- Current tab information display
- Buttons to open options and side panel
- Modern UI with smooth animations

### Options Page (`src/options/`)
- Settings management with Chrome storage
- Theme selection, notifications toggle
- Custom text input with auto-save
- Responsive design for different screen sizes

### Side Panel (`src/sidepanel/`)
- Tab management interface
- Browsing history display
- Bookmarks quick access
- Tabbed navigation between sections

### Background Script (`src/background/`)
- Service worker setup
- Context menu integration
- Message passing between components
- Storage change listeners
- Periodic task scheduling with alarms

### Content Script (`src/content/`)
- Floating action button on web pages
- Message handling from background script
- DOM manipulation examples
- CSS injection with animations

## 🔧 Customization

### Updating Extension Details

Edit `src/manifest.json`:
```json
{
  "name": "Your Extension Name",
  "description": "Your extension description",
  "version": "1.0.0"
}
```

### Modifying Permissions

Add or remove permissions in `src/manifest.json`:
```json
{
  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "notifications"
  ]
}
```

### Styling

Each component has its own CSS file with a modern gradient theme. Colors use CSS custom properties for easy theming:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-gradient: linear-gradient(135deg, #ff6b6b, #ee5a24);
}
```

### Adding New Components

1. Create a new directory in `src/`
2. Add HTML, JS, and CSS files
3. Update `vite.config.js` to include the new entry point
4. Update `manifest.json` if needed

## 🎯 Examples Included

- **Storage API**: Saving and retrieving user preferences
- **Tabs API**: Managing browser tabs and getting tab information
- **History API**: Accessing browsing history
- **Bookmarks API**: Reading user bookmarks
- **Notifications API**: Showing system notifications
- **Context Menus**: Right-click menu integration
- **Message Passing**: Communication between extension components
- **Content Script Injection**: Modifying web pages

## 🚢 Building for Production

```bash
npm run build
```

This creates a `dist/` folder with your extension ready for:
- Chrome Web Store upload
- Manual installation
- Distribution to users

## 📖 Chrome Extension APIs Used

- `chrome.storage` - Data persistence
- `chrome.tabs` - Tab management
- `chrome.history` - Browse history
- `chrome.bookmarks` - Bookmark access
- `chrome.notifications` - System notifications
- `chrome.contextMenus` - Right-click menus
- `chrome.runtime` - Extension lifecycle
- `chrome.sidePanel` - Side panel API (Chrome 114+)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Getting Started Tips

1. **Start Small**: Begin by modifying the popup to understand the structure
2. **Use the Examples**: Each component includes practical examples you can build upon
3. **Check the Console**: Both extension and webpage consoles show helpful debug information
4. **Read the Comments**: Code includes helpful comments explaining Chrome API usage
5. **Test Thoroughly**: Test your extension on different websites and scenarios

## 🔗 Useful Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Preact Documentation](https://preactjs.com/)
- [HTM Documentation](https://github.com/developit/htm)
- [Vite Documentation](https://vitejs.dev/)

Happy coding! 🎉