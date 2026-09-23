# ChinaPASS

ChinaPASS helps visitors handle practical moments in China with nine step-by-step travel guides, 96 bilingual phrase cards, a pre-flight checklist, FAQs and an arrival checklist. It runs as a static website, an offline-capable installable web app, or a desktop app packaged with Electron.

## Run the web demo

Open `demo/index.html` in a browser, or serve the `demo/` directory over HTTP:

```bash
cd demo
python3 -m http.server 4173
```

Then open `http://localhost:4173`. The service worker and installable PWA features require HTTP or HTTPS. Directly opening the HTML file still works for the core phrase cards.

## Use ChinaPASS

- Work through seven pre-flight items before you fly — passport and visa, connectivity, opening the app once so it can be cached, payment setup, your hotel address saved in Chinese, maps, and emergency contacts.
- Follow nine travel guides in arrival order — customs, SIM, payment, taxi, hotel, metro, train, food, emergencies — each with steps, a backup plan, common mistakes and official sources.
- Show any of 96 Chinese cards full screen, with the Chinese line large enough to hand to someone nearby. The interface runs in English, 中文, 日本語 and 한국어.
- Detect your city offline, or pick it manually, to produce a "please take me here" card.
- Tick off steps as you work through each guide. Pre-flight checklist state and preferences stay in local browser storage.
- Browse seven FAQs, or use the 110, 120, 119 and 122 dial links.
- Install the PWA from a supported browser for a standalone window and offline shell cache.

The Chinese line on a card is the sentence you show to a Chinese speaker, so it is never translated. Switching the interface language changes only the gloss printed underneath it and the surrounding interface.

Phone calls, payment setup, translation, map downloads and rail bookings are handled by their respective providers. ChinaPASS offers preparation prompts and communication phrases, not real-time travel booking or emergency dispatch.

## Build a desktop app

The optional Electron shell loads the local static demo and can create Windows, macOS and Linux packages. See [DESKTOP.md](DESKTOP.md) for setup and build commands. It needs Node.js 22.12 or newer and npm dependencies installed from the repository root.

## Project notes

- [Product overview](docs/01-项目概述.md)
- [Feature design](docs/03-功能设计.md)
- [Content and interface structure](docs/04-页面结构与用户流程.md)
- [Technical plan](docs/06-技术方案.md)
- [PWA files](demo/manifest.webmanifest)

The content is static and contains no backend or analytics. Checklist state and display preferences remain on the current device. Emergency numbers are provided as dial links, and whether a call can be placed depends on the device and network.
