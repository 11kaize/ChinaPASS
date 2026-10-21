# ChinaHand demo — 2026-10-21

## Navigation and visual design

- Home uses two rows of mini-app entrances. Taxi, Metro and Train live under Transport; their guides and external service links remain available.
- The five tabs are Today, Community, Cards, AI and Me. Guides remains accessible from Home. Me links to Preferences, retaining language, appearance, accessibility, API and local-data settings.
- The original 中 mark now has a blue background. Day mode uses the Shanghai morning and airport artworks. Dark mode switches to newly generated night skyline, night airport and night restaurant illustrations. Uploaded community media retains its original appearance.
- Plus is indicated by a silver display name; Pro by a colored display name. No separate membership badges appear beside names or in the home header. Package names and prices remain on the upgrade screen.
- Frosted surfaces, reduced motion and reduced transparency fallbacks are retained. Native iOS glass is conditional on platform support; browser previews approximate the material.

## Membership demo

| Tier | Demo price | Monthly AI questions | AI page buttons | Name |
| --- | --- | --- | --- | --- |
| Free | $0 | 20 | No | Standard |
| Plus | $9/month | 500 | Yes | Silver |
| Pro | $89/year | 2,000 | Yes | Colored |

Upgrades are local demonstrations: no money is charged, no payment processor is connected, and entitlements are not server verified. Provider API costs are separate. Questions reserve allowance before dispatch; failed and cancelled requests are refunded. Offline examples do not consume allowance. Limits are device-local and are not suitable for enforcing paid production access.

Login and registration use local demo accounts with salted password digests. Use fictitious email addresses and demo passwords. These accounts are not a production authentication system and do not sync between devices.

## Community

- Discover, Help nearby, Editor's picks, Saved and Mine views; keyword search across post title, body, city and author.
- Local publishing, likes, saves and replies. Posts support up to six image/video attachments, limited to 30 MB each.
- Web attachments are held in IndexedDB; native attachments use the app document directory. Clearing local data removes accounts, local posts and attachments.
- Seeded examples and sample engagement are explicitly marked DEMO. Featured examples are seeded; no moderator interface is included.
- Top 10 ranks available posts using the last seven days of activity: likes ×1, saves ×3, replies ×2, with a 72-hour half-life. Fewer than ten eligible posts yields a shorter list.
- This is an on-device community demonstration, not a public social network or live nearby service.

## AI context and routing

The assistant receives trusted project information, the allowlisted app page directory, selected trip context and relevant page matches before answering. Eligible plans can display navigation buttons when a completed model response contains `[[chinahand:page-id]]`. Unknown IDs are removed; arbitrary model-generated URLs are not executed. Buttons are not synthesized simply because a user question contains a keyword.

API credentials stay in React memory. Neither local account persistence nor community persistence receives the API configuration. Refresh, page exit or disconnect clears the connection; there is no API-key autofill from storage. Local community/account data is separately persistent by design.

The current iteration verifies context construction and navigation marker parsing with automated cases. It does not claim a live paid model call or production billing integration.

## Verification record

- TypeScript, Expo lint and 26 automated cases passed before the final night artwork changes; the same check is run again for the final export.
- iOS and Android JavaScript exports succeeded. This is compilation evidence; no native iOS simulator is available on this Linux host.
- Browser interaction verified registration, Pro upgrade, transport navigation, community search, like/save/reply, publishing image and video attachments, refresh persistence and video playback.
- Day/night layouts, name-only membership styling and exported routes are checked before publication. Screenshots are under `docs/screenshots/2026-10-21/`.

Relevant implementation: `mobile/src/domain/`, `product-state.tsx`, `identity.tsx`, `local-media.ts`, `local-media.web.ts`, and the screens under `mobile/src/app/`.

## Motion refinement

Page content no longer resets its vertical position and springs on every focus. Native screens use a single navigator transition (280 ms for the iOS simple push); native tabs switch without a second page animation. The browser uses one cancellable transform animation: 160 ms for tabs and 240 ms for other Page screens, without fading the glass materials. Its button feedback uses CSS transitions; native button feedback uses the native animation driver and does not block list interaction work.

Reduce Motion uses one shared system subscription rather than a subscription and async preference read per button. Preference changes cancel web page motion. The login mark uses CSS animation on the web; its native animation stops on blur and is non-interactive. The web reduced-motion stylesheet also limits animation iterations, preventing decorative loops from becoming rapid flicker.

TypeScript and Expo lint passed for this refinement. Browser checks covered entering Transport, returning Home and consecutive Cards/Community/Me/Home tab changes; both native platform exports succeeded. No physical-device frame-rate measurement was performed on this Linux host.
