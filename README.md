# ChinaPASS

ChinaPASS helps visitors handle practical moments in China with eight step-by-step travel guides, 82 bilingual phrases, FAQs, saved cards and an arrival checklist. It runs as a static website, an offline-capable installable web app, or a desktop app packaged with Electron.

## Run the web demo

Open `demo/index.html` in a browser, or serve the `demo/` directory over HTTP:

```bash
cd demo
python3 -m http.server 4173
```

Then open `http://localhost:4173`. The service worker and installable PWA features require HTTP or HTTPS. Directly opening the HTML file still works for the core phrase cards.

## Use ChinaPASS

- Search eight travel guides and 82 bilingual phrases, then show Chinese cards full screen.
- Save guide-step progress, favorite phrases and mark off a five-item arrival checklist. These stay in local browser storage.
- Browse seven FAQs, open the urgent-help phrase cards, or use 110, 120, 119 and 122 dial links.
- Install the PWA from a supported browser for a standalone window and offline shell cache.
- Use `Ctrl/Cmd + K` to focus phrase search. In a phrase card, use the arrow keys to navigate and Escape to close.

Phone calls, payment setup, translation, map downloads and rail bookings are handled by their respective providers. ChinaPASS offers preparation prompts and communication phrases, not real-time travel booking or emergency dispatch.

## Build a desktop app

The optional Electron shell loads the local static demo and can create Windows, macOS and Linux packages. See [DESKTOP.md](DESKTOP.md) for setup and build commands. It needs Node.js 22.12 or newer and npm dependencies installed from the repository root.

## Project notes

- [Product overview](docs/01-项目概述.md)
- [Feature design](docs/03-功能设计.md)
- [Content and interface structure](docs/04-页面结构与用户流程.md)
- [Technical plan](docs/06-技术方案.md)
- [PWA files](demo/manifest.webmanifest)

The content is static and contains no backend or analytics. Checklist, saved phrase and display preferences remain on the current device. Emergency numbers are provided as dial links, and whether a call can be placed depends on the device and network.
