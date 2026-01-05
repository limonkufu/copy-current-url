# Copy Current URL

A lightweight Chrome extension that copies the current page URL to your clipboard with a single keyboard shortcut — automatically removing tracking parameters for clean, shareable links.

## Features

- **One-key copying** — Press `Cmd+Shift+C` (Mac) or `Ctrl+Shift+C` (Windows/Linux) to instantly copy the URL
- **Click to copy** — Click the toolbar icon as an alternative
- **Auto-clean URLs** — Automatically strips tracking parameters (UTM, fbclid, gclid, etc.)
- **Customizable shortcut** — Set your own preferred keyboard combination
- **Toast notifications** — Visual confirmation with customizable position
- **Privacy-focused** — No data collection, works entirely offline
- **Synced settings** — Your preferences sync across Chrome browsers

## Tracking Parameters Removed

The extension automatically removes these common tracking parameters:

| Source | Parameters |
|--------|------------|
| Google Analytics | `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id` |
| Google Ads | `gclid`, `gclsrc`, `dclid`, `_ga`, `_gl` |
| Facebook | `fbclid`, `fb_action_ids`, `fb_action_types`, `fb_source`, `fb_ref` |
| Microsoft/Bing | `msclkid` |
| Twitter | `twclid` |
| TikTok | `ttclid` |
| Mailchimp | `mc_cid`, `mc_eid` |
| HubSpot | `hsa_acc`, `hsa_cam`, `hsa_grp`, `hsa_ad`, `hsa_src`, `hsa_tgt`, `hsa_kw`, `hsa_mt`, `hsa_net`, `hsa_ver` |
| Adobe | `s_kwcid`, `ef_id` |
| Other | `ref`, `ref_src`, `ref_url`, `source`, `affiliate`, `aff_id`, `campaign_id`, `yclid`, `igshid`, `si`, `feature`, `app` |

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store page](#) (coming soon)
2. Click "Add to Chrome"

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder

## Usage

### Copy URL
- Press `Cmd+Shift+C` (Mac) or `Ctrl+Shift+C` (Windows/Linux)
- Or click the extension icon in your toolbar

### Customize Settings
1. Right-click the extension icon → "Options"
2. Or go to `chrome://extensions/` → Copy Current URL → "Details" → "Extension options"

**Available settings:**
- **Keyboard shortcut** — Click the input field and press your preferred key combination
- **Toast position** — Choose where notifications appear (top-right, top-left, bottom-right, bottom-left)

## File Structure

```
copy-current-url/
├── manifest.json      # Extension configuration
├── background.js      # Service worker for toolbar click & commands
├── content.js         # Keyboard listener & toast display
├── options.html       # Settings page UI
├── options.js         # Settings page logic
├── build.sh           # Build script for packaging
└── icons/
    ├── icon.svg       # Source icon
    ├── icon16.png     # Toolbar icon
    ├── icon48.png     # Extensions page icon
    └── icon128.png    # Web Store icon
```

## Building

Run the build script to create a distributable zip:

```bash
./build.sh
```

This will:
- Validate all required files
- Check manifest.json syntax
- Create `dist/copy-current-url-v{version}.zip`

## Permissions

- `activeTab` — Access the current tab's URL when triggered
- `clipboardWrite` — Write the URL to clipboard
- `scripting` — Inject toast notification into pages
- `storage` — Save user preferences

## Privacy

This extension:
- Does **not** collect any data
- Does **not** make any network requests
- Works entirely offline
- Only accesses the URL when you trigger the copy action

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
