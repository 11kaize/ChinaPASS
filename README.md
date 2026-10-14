# ChinaHand

ChinaHand now includes a **native iPhone/Android app demo** with an iOS-inspired interface and bring-your-own-key AI chat. Run the interactive demo in Expo Go with `npm run demo` (`npm run mobile` for development). The project is in the design and demo iteration phase. See [mobile setup and API configuration](mobile/README.md), [native design notes](docs/13-原生应用设计与验证.md), and the [expanded English project introduction](docs/14-ChinaHand-project-introduction.md).

## Earlier web and desktop demo

ChinaHand helps visitors handle practical moments in China with eleven travel guides, 96 Chinese phrase cards, an offline English-to-Chinese phrase lookup, a pre-flight checklist, FAQs, a personal address card, and cards you write yourself. It runs as a static website, an offline-capable installable web app, or a desktop app packaged with Electron.

## Run the web demo

Open `demo/index.html` in a browser, or serve the `demo/` directory over HTTP:

```bash
cd demo
python3 -m http.server 4173
```

Then open `http://localhost:4173`. The service worker and installable PWA features require HTTP or HTTPS. Directly opening the HTML file still works for the core phrase cards.

## Use ChinaHand

- Work through seven pre-flight items before you fly — passport and visa, connectivity, opening the app once so it can be cached, payment setup, your hotel address saved in Chinese, maps, and emergency contacts.
- Follow nine travel guides in arrival order — customs, SIM, payment, taxi, hotel, metro, train, food, emergencies — each with a "Do it now" panel, steps, a backup plan, common mistakes and official sources. The panel sits directly under the task statement and hands you off in one tap: official first (12306, Alipay, DiDi, Amap, China Mobile), then an English-friendly alternative (Trip.com and friends) where registration or a Chinese-only interface would otherwise stop you. Each link is badged Official, English-friendly or Chinese only, and says what it costs you.
- Look up the airport and rail station names for six cities — which one is on your ticket, and which one people usually get wrong.
- Browse two additional short guides on entry documents and offline preparation.
- Save a Chinese destination name, address, and optional phone number for a full-screen help card; clear these details on a shared device.
- Show any of 96 Chinese cards full screen, with the Chinese line large enough to hand to someone nearby. The interface runs in English, 中文, 日本語 and 한국어.
- Type what you want to say in English and get Chinese back. 207 sentences across 13 situations — allergy and dietary warnings, ordering, taxis, hotels, asking directions, medical, payment, documents — all written and checked by hand, with fill-in slots so "I am allergic to ___" alone covers 15 allergens. It searches offline, ranks the closest matches first, and opens any result as the same full-screen card. Nothing is machine-translated: if your sentence is not in the bank it says so, and offers to turn what you typed into a card of your own rather than inventing Chinese.
- Star any card — built in or your own — with ☆ while it is open, then reorder the ones you starred from the top of your list.
- Write your own card when none of the 96 is the sentence you need: paste the Chinese from an order, a chat or a translation app, add an English note for yourself, and hand it over full screen. You supply the Chinese; there is no machine translation.
- Detect your city offline, or pick it manually, to produce a "please take me here" card.
- Tick off steps as you work through each guide. Pre-flight checklist state and preferences stay in local browser storage.
- Browse seven FAQs, or use the 110, 120, 119 and 122 dial links.
- Install the PWA from a supported browser for a standalone window and offline shell cache.

The Chinese line on a card is the sentence you show to a Chinese speaker, so it is never translated. Switching the interface language changes only the gloss printed underneath it and the surrounding interface.

ChinaHand does not book, pay, dispatch or translate anything itself, and nothing here is a transaction — there is no backend and no provider API. What it does is hand you off: every guide, the city pages and the emergency page link straight to the service that owns the job, in a new tab, badged Official, English-friendly or Chinese only, so you know what you are opening before you tap. Phone calls, payment setup, translation, map downloads and rail bookings are all completed on the provider's own site or app, under their terms. Emergency numbers are dial links, and whether a call can be placed depends on the device and the network.

Those links need an internet connection. The app shell and all its content work offline; the hand-off links do not, and the panel says so.

## Build a desktop app

The optional Electron shell loads the local static demo and can create Windows, macOS and Linux packages. See [DESKTOP.md](DESKTOP.md) for setup and build commands. It needs Node.js 22.12 or newer and npm dependencies installed from the repository root.

## Project notes

- [Product overview](docs/01-项目概述.md)
- [Feature design](docs/03-功能设计.md)
- [Content and interface structure](docs/04-页面结构与用户流程.md)
- [Technical plan](docs/06-技术方案.md)
- [PWA files](demo/manifest.webmanifest)

The content is static and contains no backend or analytics. Help-card details, cards you write, favourites and their order, checklist state, and display preferences remain on the current device. The phrase lookup sends nothing anywhere and does not even record what you searched for — the query lives in memory only, and disappears when you leave the page. City and new short-guide details are currently in English; the homepage, address card, and original task interface retain four-language support. Emergency numbers are provided as dial links, and whether a call can be placed depends on the device and network.
