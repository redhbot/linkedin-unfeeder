const CSS_FILE = 'unfeeder.css';
const MATCH = '*://*.linkedin.com/*';

function applyCSS() {
  browser.tabs.query({ url: MATCH }).then((tabs) => {
    for (const tab of tabs) {
      browser.tabs.insertCSS(tab.id, { file: CSS_FILE, runAt: 'document_start' });
    }
  });
}

function removeCSS() {
  browser.tabs.query({ url: MATCH }).then((tabs) => {
    for (const tab of tabs) {
      browser.tabs.removeCSS(tab.id, { file: CSS_FILE });
    }
  });
}

// On install or startup, inject CSS if enabled
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get('enabled').then((result) => {
    if (result.enabled !== false) applyCSS();
  });
});

// Listen for toggle from popup
browser.runtime.onMessage.addListener((msg) => {
  if (msg.enabled) {
    applyCSS();
  } else {
    removeCSS();
  }
});

// Inject CSS into new LinkedIn tabs
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com')) {
    browser.storage.local.get('enabled').then((result) => {
      if (result.enabled !== false) {
        browser.tabs.insertCSS(tabId, { file: CSS_FILE, runAt: 'document_start' });
      }
    });
  }
});
