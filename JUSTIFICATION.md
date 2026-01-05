# Chrome Web Store Privacy Practices Justification

This document contains all required justifications for the Chrome Web Store submission.

---

## Single Purpose Description

**What does your extension do?**

> Copy Current URL copies the current webpage URL to the clipboard when the user presses a keyboard shortcut or clicks the toolbar icon. It automatically removes tracking parameters (like utm_source, fbclid, gclid) to provide clean, shareable URLs.

---

## Permission Justifications

### activeTab

**Why do you need this permission?**

> The activeTab permission is required to read the URL of the current tab when the user triggers the copy action (via keyboard shortcut or toolbar icon click). This permission is only activated when the user explicitly invokes the extension. Without this permission, the extension cannot access the current page URL to copy it to the clipboard.

---

### clipboardWrite

**Why do you need this permission?**

> The clipboardWrite permission is required to write the copied URL to the user's system clipboard. This is the core functionality of the extension - copying URLs to the clipboard so users can paste them elsewhere. Without this permission, the extension cannot perform its primary function.

---

### scripting

**Why do you need this permission?**

> The scripting permission is required to inject a small script that displays a toast notification on the page confirming the URL was copied. This provides essential visual feedback to the user. The injected script only creates a temporary DOM element for the notification and removes it after 2 seconds. No data is read from the page.

---

### storage

**Why do you need this permission?**

> The storage permission is required to save user preferences, specifically:
> - Custom keyboard shortcut configuration
> - Toast notification position preference (top-right, top-left, bottom-right, bottom-left)
>
> Settings are stored locally using chrome.storage.sync so they persist across browser sessions and sync across the user's Chrome browsers. No personal data or browsing history is stored.

---

### Host Permissions (content_scripts with <all_urls>)

**Why do you need access to all URLs?**

> The extension uses a content script with <all_urls> match pattern to listen for the user's custom keyboard shortcut on any webpage. This is necessary because:
> 1. Chrome's commands API has limited shortcut options and conflicts with existing browser shortcuts
> 2. Users need the ability to customize their keyboard shortcut
> 3. The shortcut must work on any website the user visits
>
> The content script only:
> - Listens for the configured keyboard shortcut
> - Reads the current page URL (window.location.href) when triggered
> - Displays a toast notification
>
> It does not read page content, collect data, or transmit any information.

---

### Remote Code

**Does your extension execute remote code?**

> No. This extension does not load or execute any remote code. All JavaScript code is bundled within the extension package. The extension makes no network requests and works entirely offline.

---

## Data Usage Compliance

### Data Collection

This extension does **NOT** collect, transmit, or sell any user data including:
- ❌ Personally identifiable information
- ❌ Health information
- ❌ Financial and payment information
- ❌ Authentication information
- ❌ Personal communications
- ❌ Location data
- ❌ Web history
- ❌ User activity (clicks, mouse position, scroll, keystrokes)
- ❌ Website content

### Data Usage

- The extension only accesses the current tab URL when explicitly triggered by the user
- URLs are copied to the local clipboard only - never transmitted anywhere
- User preferences (shortcut, toast position) are stored locally in chrome.storage.sync
- No analytics, tracking, or telemetry is implemented
- No network requests are made

### Certification Statement

> I certify that this extension's data usage complies with the Chrome Web Store Developer Program Policies. The extension does not collect, transmit, or sell user data. All functionality operates locally on the user's device.

---

## Privacy Policy

Since this extension does not collect any user data, a detailed privacy policy is not required. However, a simple statement is provided:

> **Privacy Policy**: Copy Current URL does not collect, store, or transmit any personal data or browsing information. The extension operates entirely locally on your device. User preferences (keyboard shortcut and notification position) are stored in Chrome's local storage and synced via your Google account if Chrome sync is enabled. No data is sent to external servers.

---

## Contact Information

For questions or concerns about this extension's privacy practices:
- GitHub Issues: [repository URL]
- Email: [your email]
