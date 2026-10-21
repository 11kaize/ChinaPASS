# ChinaHand

ChinaHand now includes a **native iPhone/Android app demo** with an iOS-inspired interface and bring-your-own-key AI chat. Run the interactive demo in Expo Go with `npm run demo` (`npm run mobile` for development). The project is in the design and demo iteration phase. See [mobile setup and API configuration](mobile/README.md), [native design notes](docs/13-原生应用设计与验证.md), and the [expanded English project introduction](docs/14-ChinaHand-project-introduction.md).

## Online mobile demo

Open [ChinaHand Demo](https://11kaize.github.io/ChinaPASS/demo/). GitHub Pages now opens the iPhone interaction preview built from the native app code. It includes Home, Community, Cards, AI and Me, plus the full guide directory, arrival ports, preparation, FAQs, city information, emergency contacts and custom help cards. API configuration, keys and conversations live only in memory: **refreshing or closing the page clears them**. General display preferences and saved help cards remain on your device.

The [earlier web demo](https://11kaize.github.io/ChinaPASS/demo/legacy.html) retains browser city detection, ranked offline phrase lookup and installable PWA functionality. The newer preview uses manual city selection and is not an Apple Simulator. Native Expo Go usage remains available.

Run `npm run demo:build` after changing native code or source content, then commit `demo/app/` together with those changes. This synchronizes content, exports all guide routes, applies `/ChinaPASS/demo/app` as the Pages base path and creates directory index files so deep links work after refresh. `.nojekyll` preserves Expo assets. Existing main-branch Pages deployment publishes the committed output. A different hosting path can be supplied with `CHINAHAND_WEB_BASE_URL`.

## Membership and community demo

The homepage now has two rows of colorful mini-app shortcuts, including one **Transport** entrance for taxis, metro and trains. Me contains local demo sign-in/registration, preferences and membership upgrades: **Plus $9/month**, **Pro $89/year**. The configurable demonstration AI allowance is 20 / 500 / 2,000 questions per calendar month for Free / Plus / Pro. Plus and Pro enable model-triggered in-app navigation buttons and silver / multicolor display-name treatments. Your own provider key is still required; it remains memory-only.

Community supports searchable stories, help requests, sample editor picks, likes, saves, replies and up to six image/video attachments (30 MB each). The hot list ranks up to ten posts using the last seven days of activity: likes ×1, saves ×3, replies ×2 with a 72-hour half-life. Demonstration engagement is labeled.

Accounts, membership, stories and attachments are **on-device demo functionality**. There is no real charge, public posting, shared user directory or server-enforced entitlement. Use made-up details for registration. See [the feature and verification notes](docs/18-2026-10-21-community-membership.md).

## Desktop iPhone layout preview / Windows

Run `npm run demo:ios`, or double-click `Start-ChinaHand.cmd` on Windows after installing Node.js 22.13 or newer. On Linux run `./Start-ChinaHand.sh`. Launchers check dependencies, pick an available port and open the demo automatically. This opens a clickable iPhone layout preview and serves the native app for iPhone/Android Expo Go. No Bash or WSL is needed. It is an interaction preview, not the Apple iOS Simulator; that simulator requires a Mac with Xcode.

## Earlier web and desktop demo

ChinaHand helps visitors handle practical moments in China with eleven travel guides, 96 Chinese phrase cards, an offline English-to-Chinese phrase lookup, a pre-flight checklist, FAQs, a personal address card, and cards you write yourself. The interface is four screens behind a bottom tab bar — landing, steps, guides, tools — so nothing is piled onto one page. It runs as a static website, an offline-capable installable web app, or a desktop app packaged with Electron.


## Run the web demo

Open `demo/legacy.html` in a browser, or serve the `demo/` directory over HTTP:

```bash
cd demo
python3 -m http.server 4173
```

Then open `http://localhost:4173/legacy.html`. The service worker and installable PWA features require HTTP or HTTPS. Directly opening the HTML file still works for the core phrase cards.

## Use ChinaHand

- Start by saying which port you landed at. Fifteen entry ports across air, sea and rail, each labelled with its Chinese name — the part you show to a driver, and the part that still works when nothing else loads. Picking one repeats that Chinese name large, and for nine of the fifteen also lists that city's airports and rail stations, so the name on your ticket is not the name you were expecting. Where that guide is not written yet, the page says so rather than showing an empty panel.
- Follow the arrival route one step at a time: customs, SIM, payment, taxi, hotel on landing day, then metro, train and food once you have settled in. Tapping a step opens it and marks where you are, so you never set your own progress. The 110, 120, 119 and 122 dial links stay on the landing screen, and a permanent SOS slot in the tab bar reaches the emergency card from anywhere else.
- Work through seven pre-flight items before you fly — passport and visa, connectivity, opening the app once so it can be cached, payment setup, your hotel address saved in Chinese, maps, and emergency contacts.
- Follow nine travel guides in arrival order — customs, SIM, payment, taxi, hotel, metro, train, food, emergencies — each with a "Do it now" panel, steps, a backup plan, common mistakes and official sources. The panel sits directly under the task statement and hands you off in one tap: official first (12306, Alipay, DiDi, Amap, China Mobile), then an English-friendly alternative (Trip.com and friends) where registration or a Chinese-only interface would otherwise stop you. Each link is badged Official, English-friendly or Chinese only, and says what it costs you.
- Look up the airport and rail station names for eight cities — which one is on your ticket, and which one people usually get wrong.
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

ChinaHand does not book, pay, dispatch or translate anything itself, and nothing here is a transaction — the earlier demo has no backend or provider API; the new AI tab calls the user-configured provider directly. What it does is hand you off: every guide, the city pages and the emergency page link straight to the service that owns the job, in a new tab, badged Official, English-friendly or Chinese only, so you know what you are opening before you tap. Phone calls, payment setup, translation, map downloads and rail bookings are all completed on the provider's own site or app, under their terms. Emergency numbers are dial links, and whether a call can be placed depends on the device and the network.

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
