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
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: ${pos.top};
      right: ${pos.right};
      bottom: ${pos.bottom};
      left: ${pos.left};
      background: ${isError ? "#e74c3c" : "#2ecc71"};
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
      toast.style.opacity = "1";
      toast.style.transform = pos.transformEnd;
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = pos.transformStart;
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  navigator.clipboard.writeText(url).then(() => {
    showToast("URL copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy URL", true);
  });
}
