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

function cleanUrl(url) {
  try {
    const urlObj = new URL(url);

    // Common tracking parameters to remove
    const trackingParams = [
      // Google Analytics / Ads
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
      'gclid', 'gclsrc', 'dclid',
      // Facebook
      'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
      // Microsoft / Bing
      'msclkid',
      // Twitter
      'twclid',
      // TikTok
      'ttclid',
      // Mailchimp
      'mc_cid', 'mc_eid',
      // Hubspot
      'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
      // Adobe
      's_kwcid', 'ef_id',
      // Other common trackers
      'ref', 'ref_src', 'ref_url', 'source', 'affiliate', 'aff_id', 'campaign_id',
      '_ga', '_gl', 'yclid', 'igshid', 'si', 'feature', 'app'
    ];

    trackingParams.forEach(param => urlObj.searchParams.delete(param));

    return urlObj.toString();
  } catch {
    return url;
  }
}

function copyUrlToClipboard() {
  const rawUrl = window.location.href;
  const cleanedUrl = cleanUrl(rawUrl);

  navigator.clipboard.writeText(cleanedUrl).then(() => {
    const wasCleaned = rawUrl !== cleanedUrl;
    showToast(wasCleaned ? 'Clean URL copied!' : 'URL copied!');
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

  // Create icon
  const icon = document.createElement('span');
  icon.innerHTML = isError
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
  icon.style.cssText = 'display: flex; align-items: center;';

  // Create text
  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);

  toast.style.cssText = `
    position: fixed;
    top: ${pos.top};
    right: ${pos.right};
    bottom: ${pos.bottom};
    left: ${pos.left};
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${isError
      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)'
      : 'linear-gradient(135deg, #00c853 0%, #00a844 100%)'};
    color: white;
    padding: 14px 20px;
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
    box-shadow: 0 8px 32px ${isError ? 'rgba(238, 90, 90, 0.35)' : 'rgba(0, 200, 83, 0.35)'},
                0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    opacity: 0;
    transform: ${pos.transformStart} scale(0.95);
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = pos.transformEnd + ' scale(1)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = pos.transformStart + ' scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 2000);
}
