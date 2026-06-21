# YouTube Screenshot Capture

A Chrome extension to capture and save screenshots from YouTube videos at any playback position, with one click.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-red?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Features

- **One-click capture** — grab the exact frame currently shown in the video
- **Live preview** — see the screenshot inside the popup before saving
- **Download** — saves as a named file: `Video Title_1m23s.png`
- **Copy to clipboard** — paste directly into docs, chats, or design tools
- **PNG & JPEG support** — choose lossless PNG or compressed JPEG with quality control
- **Timestamp badge** — shows the video position of every captured frame
- **Dark UI** — matches YouTube's native look and feel

---

## Screenshots

| Popup UI | Captured Frame Preview |
|---|---|
| ![Popup](https://placehold.co/340x300/0f0f0f/ff0000?text=Popup+UI) | ![Preview](https://placehold.co/340x300/1a1a1a/ffffff?text=Frame+Preview) |

---

## Installation

### Load unpacked (Developer Mode)

1. Download or clone this repository
   ```bash
   git clone https://github.com/ChanukyaV/youtube-screenshot-capture.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** using the toggle in the top-right corner
4. Click **Load unpacked**
5. Select the `youtube-screenshot-capture` folder
6. The extension icon will appear in your Chrome toolbar

---

## Usage

1. Open any video on [YouTube](https://www.youtube.com)
2. Play or pause the video at the frame you want to capture
3. Click the extension icon in the toolbar
4. Click **Capture Frame**
5. Use **Download** to save the image or **Copy** to copy it to your clipboard

### Format Options

| Format | Best For |
|--------|----------|
| PNG | High quality, lossless — ideal for text, diagrams, or archiving |
| JPEG | Smaller file size — ideal for sharing or embedding |

---

## File Structure

```
youtube-screenshot-capture/
├── manifest.json      # Chrome extension configuration (Manifest V3)
├── content.js         # Injected into YouTube — captures video frame via canvas
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic: capture, preview, download, clipboard
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Permissions

| Permission | Reason |
|------------|--------|
| `activeTab` | Access the current YouTube tab to read the video element |
| `scripting` | Inject the content script to capture the frame |
| `downloads` | Save the screenshot file to your local machine |

---

## How It Works

1. The **content script** (`content.js`) listens for a capture request from the popup
2. It finds the `<video>` element on the page and draws the current frame onto an offscreen `<canvas>`
3. The canvas is converted to a data URL (PNG or JPEG)
4. The **popup** (`popup.js`) receives the data URL, displays a preview, and lets you download or copy it

---

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Google Chrome | ✅ |
| Microsoft Edge | ✅ (Chromium-based) |
| Brave | ✅ (Chromium-based) |
| Firefox | ❌ (uses different extension API) |

---

## License

MIT — free to use, modify, and distribute.
