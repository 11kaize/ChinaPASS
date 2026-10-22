# ChinaHand native mobile demo

ChinaHand is now a React Native application for iPhone and Android. Screens render with native views, native text inputs and native navigation. The iPhone and Android applications use native views, without a WebView. A separate desktop browser preview reuses the React Native components for reviewing the iPhone layout; this is not an Apple iOS simulator.

## Windows, macOS and Linux

Install Node.js 22.13 or newer (current LTS recommended). Windows does not need Bash or WSL. From the repository root, run `npm run demo:ios` to open the desktop iPhone layout preview and start the same LAN server for Expo Go. On Windows you can instead double-click `Start-ChinaHand.cmd`. On Linux run `./Start-ChinaHand.sh`. Both launchers automatically check dependencies, choose an available port and open the preview in the default browser. Keep the terminal open while using the demo. Dependencies are installed automatically on the first run. Allow Node.js through Windows Firewall on your private Wi-Fi network if you want a phone to connect.

`npm run demo` starts the mobile QR-code demo; `npm run mobile` starts native development mode. Windows and Linux can serve both iPhone and Android phones. The actual Apple iOS Simulator requires macOS and Xcode; on a configured Mac, use `npm run ios` inside `mobile/`. The desktop preview does not emulate iOS system APIs, and browser CORS restrictions can prevent direct provider calls; validate real AI connections on your phone.

## Run on your phone

From the repository root:

```bash
npm run demo
```

Install the current Expo Go app on your phone. Scan the terminal's QR code using the iPhone camera or Expo Go on Android. The phone and computer should be on the same network. The launcher uses the bundled Codex Node runtime when available; otherwise use Node.js 22.13 or newer.

For live editing, use `npm run mobile` from the repository root. `npm run demo` uses minified production JavaScript inside Expo Go; it does not build an APK. Reload the project in Expo Go after restarting this preview server. The floating Expo Go Tools button belongs to the host app and can be dragged away from controls.

Optional native development with your own SDK installation:

```bash
cd mobile
npm ci
npm run android
# On a Mac with Xcode:
npm run ios
```

`npm run build:apk` generates the native Android project with Expo and builds an APK with embedded JavaScript and content. It does not need Metro after installation. The demo uses the template's development signing key; distribute a separately signed build for production. Generated Android/iOS projects, signing keys and build output are ignored by Git. Never place real provider keys in app configuration or environment files.

iPhone Expo Go can run the application from this Linux computer. An independently signed iOS installation requires Apple signing and a Mac/Xcode or an authorized EAS build. `eas.json` includes development, preview and production profiles; no cloud build or store submission happens automatically.

## iOS materials and motion

The floating tab bar and top bar use native Liquid Glass when the iOS runtime supports it, otherwise native BlurView on older iOS. The desktop preview uses a CSS backdrop blur approximation. Android uses a readable solid material fallback. Preparation panels use the same material. Navigation content uses a short spring transition; controls use spring press feedback. System Reduce Motion and Reduce Transparency preferences are respected. Actual native iOS material rendering must be reviewed on an iPhone or Mac simulator.

## What changed

- Native launch screen and welcome screen with language selection.
- Five tabs: Home, Community, Cards, AI and Me. The complete guide directory remains accessible from the home launcher.
- Task-oriented home, expandable guide steps with completion memory, preparation checklist, FAQs and airport/station notes.
- 15 arrival ports with Chinese display cards, manual city association and a first-day/later arrival flow. Opening a guide marks the current task; it does not mark its steps completed. All 8 written city guides are available. Missing city notes are stated explicitly.
- 9 guides, 96 Chinese communication cards and 207 offline phrases imported from the existing content files.
- Large full-screen Chinese cards, bookmarks with reordering, template blanks and user-written cards.
- Personal destination card saved only on the device.
- 21 service actions across the nine guides retain official, English-friendly, Chinese-only and call labels, with account/language notes. Airport and station names open Amap search.
- Emergency numbers open the system phone interface.
- System, light and dark appearance; accessible control labels, large targets and reduced-motion support.
- English and Chinese UI. Japanese and Korean guide translations and card glosses are retained; some new UI labels fall back to English, with a notice in Me → Preferences & privacy.
- All guide/card content is packaged with the app. AI requires network access. Nothing in the app books tickets, makes payments or dispatches emergency services.

## Bring your own API key

Open **AI → Connect a model**. Choose the provider, enter your own API key, review the endpoint and consent to sending your messages. Optionally test the connection, then tap **Connect for this session**. DeepSeek testing checks authentication and the model list without generation. Other providers send a short generation request and may consume provider credit. Keys must have access to the selected model.

| Provider | Model IDs | API protocol / base URL |
| --- | --- | --- |
| DeepSeek 4.1 Flash | `deepseek-flash` | Chat Completions, `https://api.deepseek.com` |
| Qwen 3.8 | `qwen3.8-flash`, `qwen3.8-max` | OpenAI-compatible Chat Completions, region-specific Model Studio endpoint |
| GPT-6.1 Sol | `gpt-6.1-sol` | Responses, `https://api.openai.com/v1` |

For Qwen, choose Beijing, Singapore or Virginia according to the region where your key was created. For Beijing and Singapore, entering a workspace ID switches to the recommended workspace-specific domain. The UI also supports the documented legacy DashScope domains. API keys are not interchangeable across regions. The advanced fields allow editing the model ID or HTTPS base URL. Enter a base URL, not a full `/chat/completions` or `/responses` route.

Official model documentation rechecked on 2026-10-14:

- [DeepSeek first call and model alias](https://api-docs.deepseek.com/)
- [DeepSeek Chat Completions schema](https://api-docs.deepseek.com/api/create-chat-completion/)
- [Qwen recommended models](https://www.alibabacloud.com/help/en/model-studio/models)
- [Qwen endpoints, regions and OpenAI compatibility](https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope)
- [GPT-6.1 Sol model and supported APIs](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
- [OpenAI streaming events](https://developers.openai.com/api/docs/guides/streaming-responses)

### Session privacy

The API key, provider configuration, configuration form drafts and conversations exist only in JavaScript memory. The app has no backend, telemetry, conversation storage, Keychain storage or SecureStore storage. Separate local demo accounts and community data never receive the API configuration. Restarting the process removes the session. **Disconnect & clear chat** immediately clears the application session and cancels its active request. Leaving the application for the background clears the API key, provider configuration, chat and any mounted configuration form draft, and cancels active generation or connection testing. The browser preview also clears on page exit and back/forward cache restoration. Returning requires entering your key again. No API configuration is written to AsyncStorage, localStorage, sessionStorage, files, Keychain or SecureStore.

General preferences, checklist/guide progress, bookmarks, user-written cards and destination details use one explicit AsyncStorage whitelist. Android device backups are disabled. The persistence projection excludes API configuration, keys and conversations even if unknown fields are accidentally merged into preferences. Provider policies still apply to the messages sent directly to them. OpenAI requests explicitly use `store: false` and do not create stored Conversations objects.

The AI receives ChinaHand's purpose and capabilities, matching bundled guides and official source links, FAQs, selected language and, if enabled, manually chosen city, journey stage, checklist/guide progress, platform, connectivity, device date and timezone. It does not automatically receive the personal address card, passport, payment information, GPS coordinates, custom cards or API key. **What the assistant knows** previews the context; **Share trip context** switches personal trip/device context off.

Answers stream as they arrive. Stop, timeout, offline failures, authentication failures, quota/access errors, interrupted streams and empty answers are handled explicitly. Failed or unfinished assistant turns are not replayed as complete answers. The app does not provide the model with live web search. Offline replies are deterministic examples from bundled guides, always labeled as examples; they never imply a model was called.

## Content and development

```bash
npm run sync-content  # import the existing, editable project content
npm run check         # TypeScript, ESLint, targeted adapter/privacy tests
npx expo-doctor       # Expo dependency/config compatibility
npm run export:native # Android and iOS Hermes bundles
```

`scripts/sync-content.mjs` reads `demo/data.js`, `scene-i18n.js`, `explore.js` and `phrases.js`. The imported JSON is committed so the installed app works completely offline. The original source cards and project notes remain editable. Update the source first, then sync.

The earlier README said 480 phrase entries; the actual source contains 207. The native app and documentation use the measured count.

See [design and verification notes](../docs/13-原生应用设计与验证.md) for the visual decisions and validation record.

## 2026-10-21 iteration

The current demo adds a crystal-blue material system, colorful launcher, a single Transport hub, local account and membership flows, community photos/videos, search, saved posts and a weighted recent hot list. Refer to [the full feature matrix](../docs/18-2026-10-21-community-membership.md). Local accounts use salted password digests only for demo matching; this is not production authentication. Do not use real passwords. Account entitlements are simulated on device; there is no live billing or shared backend.

A trusted app-page directory and keyword retrieval supplement guide retrieval. Each provider gets the directory before answering. For eligible memberships, an explicit `[[chinahand:page-id]]` returned by the model becomes an allowlisted button after the answer completes. A plain user query never directly inserts a navigation button. Unknown IDs are discarded. User stories, email, password digests and media are excluded from model context.

Browser attachments use IndexedDB blobs and short-lived object URLs; native attachments are copied to the app document directory. Clearing local data removes the community demo and its attachments as well as the existing preferences. API keys still clear on refresh and are never included in either persistence store.

## Offline communication tools (2026-10-22)

**Cards → Open two-way talk** lets a visitor choose a bundled phrase, show Chinese, and ask the other person to select a preset bilingual reply or enter a CNY amount. Replies are fixed phrases, not live translation; amounts never initiate payment. Non-template Chinese cards and saved destination cards can open this board directly.

**Me → Places** opens the address wallet: save up to 30 destinations, edit them, select a default, or import a bundled airport/station name. Existing single-address data remains available. Any destination can open a full-screen Chinese address card. The default also works with existing card templates. Places are stored only on this device and are not automatically shared with AI.

Open a card and use **Edit template** to save your own copy; custom cards offer **Edit my card**, **Save changes** and **Save a new copy**. The editor also creates new cards and preserves fillable template blanks.

The optional **Free Chinese–English translation** panel uses MyMemory without an API key. Each request requires fresh consent, sends only the current source text and language direction, and returns a preview for manual application. Its current anonymous allowance is 5,000 characters/day and 500 UTF-8 bytes/request. The provider may retain text: use non-sensitive short phrases only. See [official limits](https://mymemory.translated.net/doc/usagelimits.php) and [service terms/privacy](https://mymemory.translated.net/terms-and-conditions). AI provider keys and chat state are never used for this feature.

Deleting a local community story now removes its attachments before removing the post. If cleanup fails, the story remains and can be retried. Unpublished attachments have best-effort cleanup when leaving the editor.

See the [static feature audit and next suggestions](../docs/22-2026-10-22-static-feature-audit.md).

## Built-in demo artwork

The browser demo embeds ten phone-sized WebP illustrations in its JavaScript bundle (`src/artwork.web.ts`). They are decoded during startup and reused across routes and appearance changes, so pages do not fetch large PNG files separately. The first visit still downloads the application bundle; this is not an offline-install guarantee.

Original PNG artwork is retained for editing and native app packaging. Native screens use `src/artwork.ts`, which references local bundled assets. App icons and splash configuration keep their platform-compatible original files. User-uploaded community attachments continue to use the device media store and are not included in this artwork bundle.

To regenerate after changing original artwork:

```sh
npm run assets:prepare
```

This uses Sharp as a development dependency to produce `assets/optimized/*.webp`, a size manifest and both platform registries. `npm run demo:build` from the repository root regenerates these automatically. Checked-in generated files let the Windows/Linux demo launchers start without running image conversion each time.
