chrome.commands.onCommand.addListener(async (command) => {
  if (command === "copy-url") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.url) {
      const { toastPosition = 'top-right' } = await chrome.storage.sync.get(['toastPosition']);

      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: copyUrlToClipboard,
          args: [tab.url, toastPosition]
        });
      } catch (error) {
        // Script injection failed (e.g., on chrome:// pages)
      }
    }
  }
});

// Handle toolbar icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.url) {
    const { toastPosition = 'top-right' } = await chrome.storage.sync.get(['toastPosition']);

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyUrlToClipboard,
        args: [tab.url, toastPosition]
      });
    } catch (error) {
      // Script injection failed (e.g., on chrome:// pages)
    }
  }
});

function copyUrlToClipboard(url, toastPosition = 'top-right') {
  function cleanUrl(rawUrl) {
    try {
      const urlObj = new URL(rawUrl);
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
        'gclid', 'gclsrc', 'dclid', 'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
        'msclkid', 'twclid', 'ttclid', 'mc_cid', 'mc_eid',
        'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
        's_kwcid', 'ef_id', 'ref', 'ref_src', 'ref_url', 'source', 'affiliate', 'aff_id', 'campaign_id',
        '_ga', '_gl', 'yclid', 'igshid', 'si', 'feature', 'app'
      ];
      trackingParams.forEach(param => urlObj.searchParams.delete(param));
      return urlObj.toString();
    } catch {
      return rawUrl;
    }
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
    const existingToast = document.getElementById("copy-url-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const pos = getPositionStyles(toastPosition);

    const toast = document.createElement("div");
    toast.id = "copy-url-toast";

    const icon = document.createElement("span");
    icon.innerHTML = isError
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    icon.style.cssText = "display: flex; align-items: center;";

    const text = document.createElement("span");
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
      toast.style.opacity = "1";
      toast.style.transform = pos.transformEnd + " scale(1)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = pos.transformStart + " scale(0.95)";
      setTimeout(() => toast.remove(), 250);
    }, 2000);
  }

  const cleanedUrl = cleanUrl(url);
  const wasCleaned = url !== cleanedUrl;

  navigator.clipboard.writeText(cleanedUrl).then(() => {
    showToast(wasCleaned ? "Clean URL copied!" : "URL copied!");
  }).catch(() => {
    showToast("Failed to copy URL", true);
  });
}
