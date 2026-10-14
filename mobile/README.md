# ChinaHand native mobile demo

ChinaHand is now a React Native application for iPhone and Android. Screens render with native views, native text inputs and native navigation. There is no WebView, embedded website, or browser requirement in the mobile application.

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

## What changed

- Native launch screen and welcome screen with language selection.
- Five tabs: Today, Guides, Cards, AI and Settings.
- Task-oriented home, expandable guide steps with completion memory, preparation checklist, FAQs and airport/station notes.
- 9 guides, 96 Chinese communication cards and 207 offline phrases imported from the existing content files.
- Large full-screen Chinese cards, bookmarks with reordering, template blanks and user-written cards.
- Personal destination card saved only on the device.
- 21 service actions across the nine guides retain official, English-friendly, Chinese-only and call labels, with account/language notes. Airport and station names open Amap search.
- Emergency numbers open the system phone interface.
- System, light and dark appearance; accessible control labels, large targets and reduced-motion support.
- English and Chinese UI. Japanese and Korean guide translations and card glosses are retained; some new UI labels fall back to English, with a notice in Settings.
- All guide/card content is packaged with the app. AI requires network access. Nothing in the app books tickets, makes payments or dispatches emergency services.

## Bring your own API key

Open **AI → Connect a model**. Choose the provider, enter your own API key, review the endpoint and consent to sending your messages. Optionally test the connection, then tap **Connect for this session**. A test sends a short request and may consume provider credit. Keys must have access to the selected model.

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

The API key, provider configuration, configuration form drafts and conversations exist only in JavaScript memory. The app has no backend, account, telemetry, conversation storage, Keychain storage or SecureStore storage. Restarting the process removes the session. **Disconnect & clear chat** immediately clears the application session and cancels its active request. Backgrounding the application cancels an active generation.

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
