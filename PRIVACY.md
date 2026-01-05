# Privacy Policy

**Last updated:** January 2026

## Overview

Copy Current URL is a browser extension that copies the current webpage URL to your clipboard. This privacy policy explains how we handle your data.

**The short version:** We don't collect any data. Everything happens locally on your device.

## Data Collection

**We do NOT collect:**
- Personal information
- Browsing history
- URLs you copy
- Website content
- Usage analytics
- Crash reports
- Any other data

## Data Storage

The extension stores only your preferences locally:
- **Keyboard shortcut configuration** - Your custom key combination
- **Toast notification position** - Your preferred notification location

This data is stored using Chrome's `storage.sync` API, which means:
- It stays on your device and in your Google account (if Chrome sync is enabled)
- It is never sent to us or any third party
- You can clear it anytime by removing the extension

## Data Transmission

**This extension makes zero network requests.**

- No data is sent to external servers
- No analytics or tracking services are used
- No advertisements are displayed
- The extension works completely offline

## Permissions Explained

| Permission | Why We Need It |
|------------|----------------|
| `activeTab` | To read the current page URL when you trigger copy |
| `clipboardWrite` | To write the URL to your clipboard |
| `scripting` | To show the toast notification on the page |
| `storage` | To save your preferences (shortcut & toast position) |

## URL Processing

When you copy a URL:
1. The extension reads `window.location.href` from the current tab
2. Tracking parameters are removed locally (utm_*, fbclid, gclid, etc.)
3. The clean URL is written to your clipboard
4. A notification is displayed
5. **That's it.** The URL is never stored or transmitted.

## Third-Party Services

This extension does not use any third-party services, libraries that phone home, or external APIs.

## Children's Privacy

This extension does not knowingly collect any information from anyone, including children under 13 years of age.

## Changes to This Policy

If we update this privacy policy, we will update the "Last updated" date above. Since we don't collect any data, significant changes are unlikely.

## Open Source

This extension is open source. You can review the complete source code to verify these privacy claims:
- [GitHub Repository](https://github.com/limonkufu/copy-current-url)

## Contact

If you have questions about this privacy policy:
- Open an issue on GitHub

---

**Summary:** Copy Current URL respects your privacy completely. No data collection, no tracking, no network requests. Your URLs stay on your device.
