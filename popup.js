const btn = document.getElementById('toggle');

function updateButton(enabled) {
  btn.textContent = enabled ? 'Feed Hidden' : 'Feed Visible';
  btn.className = enabled ? 'on' : 'off';
}

browser.storage.local.get('enabled').then((result) => {
  const enabled = result.enabled !== false;
  updateButton(enabled);
});

btn.addEventListener('click', () => {
  browser.storage.local.get('enabled').then((result) => {
    const newState = result.enabled === false;
    browser.storage.local.set({ enabled: newState });
    updateButton(newState);
    browser.runtime.sendMessage({ enabled: newState });
  });
});
