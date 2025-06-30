// Content script that runs on web pages
console.log('Content script loaded')

// Create a floating button for demonstration
function createFloatingButton() {
  const button = document.createElement('div')
  button.id = 'simple-extension-button'
  button.innerHTML = '🚀'
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)'
  })
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)'
  })
  
  button.addEventListener('click', () => {
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'notification',
      text: `Extension button clicked on ${window.location.hostname}!`
    })
    
    // Add some visual feedback
    button.style.transform = 'scale(0.9)'
    setTimeout(() => {
      button.style.transform = 'scale(1)'
    }, 150)
  })
  
  document.body.appendChild(button)
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message)
  
  switch (message.action) {
    case 'contextMenuClicked':
      handleContextMenuClick(message)
      break
      
    case 'highlightElements':
      highlightElements(message.selector)
      break
      
    default:
      console.log('Unknown action:', message.action)
  }
})

// Handle context menu clicks
function handleContextMenuClick(message) {
  // Create a temporary notification element
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
  `
  
  notification.textContent = message.selectionText 
    ? `Selected: "${message.selectionText.substring(0, 50)}..."`
    : `Context menu clicked on ${window.location.hostname}`
  
  document.body.appendChild(notification)
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Function to highlight elements (example utility)
function highlightElements(selector) {
  const elements = document.querySelectorAll(selector)
  elements.forEach(element => {
    element.style.outline = '2px solid #ff6b6b'
    element.style.outlineOffset = '2px'
    
    // Remove highlight after 2 seconds
    setTimeout(() => {
      element.style.outline = ''
      element.style.outlineOffset = ''
    }, 2000)
  })
}

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)

// Initialize the content script
function init() {
  // Only create the floating button if it doesn't exist
  if (!document.getElementById('simple-extension-button')) {
    createFloatingButton()
  }
  
  console.log('Simple Extension content script initialized on:', window.location.hostname)
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
