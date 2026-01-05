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
let isRecording = false;

const shortcutDisplay = document.getElementById('shortcut-display');
const toastPositionSelect = document.getElementById('toast-position');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const status = document.getElementById('status');
const chromeShortcutsLink = document.getElementById('chrome-shortcuts');

function formatShortcut(shortcut) {
  const parts = [];
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Win');
  if (shortcut.key) parts.push(shortcut.key.toUpperCase());
  return parts.join(' + ') || 'Not set';
}

function loadSettings() {
  chrome.storage.sync.get(['shortcut', 'toastPosition'], (result) => {
    if (result.shortcut) {
      currentShortcut = result.shortcut;
    }
    shortcutDisplay.value = formatShortcut(currentShortcut);

    if (result.toastPosition) {
      currentToastPosition = result.toastPosition;
    }
    toastPositionSelect.value = currentToastPosition;
  });
}

function saveSettings() {
  currentToastPosition = toastPositionSelect.value;
  chrome.storage.sync.set({
    shortcut: currentShortcut,
    toastPosition: currentToastPosition
  }, () => {
    showStatus('Settings saved!', 'success');
  });
}

function showStatus(message, type) {
  status.textContent = message;
  status.className = type;
  setTimeout(() => {
    status.className = '';
  }, 3000);
}

shortcutDisplay.addEventListener('click', () => {
  isRecording = true;
  shortcutDisplay.classList.add('recording');
  shortcutDisplay.value = 'Press your shortcut...';
});

shortcutDisplay.addEventListener('blur', () => {
  if (isRecording) {
    isRecording = false;
    shortcutDisplay.classList.remove('recording');
    shortcutDisplay.value = formatShortcut(currentShortcut);
  }
});

shortcutDisplay.addEventListener('keydown', (e) => {
  if (!isRecording) return;

  e.preventDefault();
  e.stopPropagation();

  // Ignore lone modifier keys
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
    return;
  }

  // Require at least one modifier
  if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    showStatus('Please use at least one modifier key (Ctrl, Shift, Alt, Cmd)', 'error');
    return;
  }

  currentShortcut = {
    key: e.key.toLowerCase(),
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey
  };

  isRecording = false;
  shortcutDisplay.classList.remove('recording');
  shortcutDisplay.value = formatShortcut(currentShortcut);
});

saveBtn.addEventListener('click', saveSettings);

resetBtn.addEventListener('click', () => {
  currentShortcut = { ...DEFAULT_SHORTCUT };
  currentToastPosition = DEFAULT_TOAST_POSITION;
  shortcutDisplay.value = formatShortcut(currentShortcut);
  toastPositionSelect.value = currentToastPosition;
  saveSettings();
});

chromeShortcutsLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

// Load saved settings on startup
loadSettings();
