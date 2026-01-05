const DEFAULT_SHORTCUT = {
  key: 'c',
  ctrlKey: false,
  shiftKey: true,
  altKey: false,
  metaKey: true
};
const DEFAULT_TOAST_POSITION = 'top-right';

let currentShortcut = { ...DEFAULT_SHORTCUT };
let currentToastPosition = DEFAULT_TOAST_POSITION;

// Load settings from storage
chrome.storage.sync.get(['shortcut', 'toastPosition'], (result) => {
  if (result.shortcut) {
    currentShortcut = result.shortcut;
  }
  if (result.toastPosition) {
    currentToastPosition = result.toastPosition;
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.shortcut) {
      currentShortcut = changes.shortcut.newValue || DEFAULT_SHORTCUT;
    }
    if (changes.toastPosition) {
      currentToastPosition = changes.toastPosition.newValue || DEFAULT_TOAST_POSITION;
    }
  }
});

// Listen for keyboard shortcut
document.addEventListener('keydown', (e) => {
  const matches =
    e.key.toLowerCase() === currentShortcut.key &&
    e.ctrlKey === currentShortcut.ctrlKey &&
    e.shiftKey === currentShortcut.shiftKey &&
    e.altKey === currentShortcut.altKey &&
    e.metaKey === currentShortcut.metaKey;

  if (matches) {
    e.preventDefault();
    e.stopPropagation();
    copyUrlToClipboard();
  }
}, true);

function copyUrlToClipboard() {
  const url = window.location.href;

  navigator.clipboard.writeText(url).then(() => {
    showToast('URL copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy URL', true);
  });
}

function getPositionStyles(position) {
  const positions = {
    'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto', transformStart: 'translateY(-10px)', transformEnd: 'translateY(0)' },
    'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto', transformStart: 'translateY(-10px)', transformEnd: 'translateY(0)' },
    'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto', transformStart: 'translateY(10px)', transformEnd: 'translateY(0)' },
    'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto', transformStart: 'translateY(10px)', transformEnd: 'translateY(0)' }
  };
  return positions[position] || positions['top-right'];
}

function showToast(message, isError = false) {
  const existingToast = document.getElementById('copy-url-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const pos = getPositionStyles(currentToastPosition);

  const toast = document.createElement('div');
  toast.id = 'copy-url-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: ${pos.top};
    right: ${pos.right};
    bottom: ${pos.bottom};
    left: ${pos.left};
    background: ${isError ? '#e74c3c' : '#2ecc71'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2147483647;
    opacity: 0;
    transform: ${pos.transformStart};
    transition: opacity 0.3s, transform 0.3s;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = pos.transformEnd;
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = pos.transformStart;
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
