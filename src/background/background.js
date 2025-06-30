// Background service worker for Chrome extension
console.log('Background script loaded')

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details)
  
  // Set default settings
  chrome.storage.sync.set({
    settings: {
      theme: 'dark',
      notifications: true,
      autoSave: true,
      customText: 'Welcome to the Simple Chrome Extension!'
    },
    count: 0
  })

  // Create context menu
  chrome.contextMenus.create({
    id: 'simpleExtension',
    title: 'Simple Extension Action',
    contexts: ['selection', 'page']
  })
})

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'simpleExtension') {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'contextMenuClicked',
      selectionText: info.selectionText,
      pageUrl: info.pageUrl
    })
  }
})

// Message handler for communication between parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message)
  
  switch (message.action) {
    case 'getTabInfo':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] })
      })
      return true // Keep message channel open for async response
      
    case 'notification':
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon48.png',
        title: 'Simple Extension',
        message: message.text || 'Notification from extension'
      })
      break
      
    case 'openSidePanel':
      chrome.sidePanel.open({ windowId: sender.tab.windowId })
      break
      
    default:
      console.log('Unknown action:', message.action)
  }
})

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url)
    
    // You can add logic here to react to page changes
    // For example, check if certain conditions are met and show notifications
  }
})

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Storage changed:', changes, namespace)
  
  // React to settings changes
  if (changes.settings) {
    console.log('Settings updated:', changes.settings.newValue)
  }
})

// Alarm listener (for periodic tasks)
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name)
  
  // Handle different types of alarms
  switch (alarm.name) {
    case 'periodicTask':
      // Perform periodic tasks here
      console.log('Performing periodic task')
      break
  }
})

// Create a periodic alarm (optional)
chrome.alarms.create('periodicTask', {
  periodInMinutes: 60 // Run every hour
})
