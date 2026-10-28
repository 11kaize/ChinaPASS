import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";

// Desktop review surface only. The iPhone app continues to render native views.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>ChinaBuddy · iPhone interaction preview</title>
        <ScrollViewStyleReset />
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; background: #e4effb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          #preview-stage { min-height: 100dvh; display: flex; align-items: center; justify-content: center; gap: 64px; padding: 36px; }
          #preview-intro { width: 300px; color: #183658; }
          #preview-intro p { line-height: 1.7; color: #536981; }
          #preview-intro h1 { font-size: 42px; letter-spacing: -1.6px; margin: 20px 0; }
          #preview-intro small { display: block; line-height: 1.7; }
          #phone { width: 393px; height: min(852px, calc(100dvh - 72px)); min-height: 570px; display: flex; flex-direction: column; overflow: hidden; border: 8px solid #1a211d; border-radius: 52px; background: #eff5fc; box-shadow: 0 28px 70px #18365830, 0 0 0 2px #647369; position: relative; }
          #preview-status { height: 45px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 25px; color: #19251f; font-size: 13px; font-weight: 650; }
          #preview-status::after { content: ''; position: absolute; width: 105px; height: 26px; background: #111714; border-radius: 20px; top: 7px; left: calc(50% - 52.5px); }
          #phone[data-theme="dark"] { background:#0b1425; }
          #phone[data-theme="dark"] #preview-status { color:#f2f6f3; }
          #root { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
          #home-indicator { position: absolute; bottom: 5px; left: calc(50% - 52px); height: 4px; width: 104px; border-radius: 5px; background: #68766b; pointer-events: none; z-index: 100; }
          @media(max-width: 850px) { #preview-intro { display:none; } #preview-stage { padding: 16px; } #phone { height: calc(100dvh - 32px); } }
          @media(max-width: 440px) { #preview-stage { padding:0; } #phone { width:100%; height:100dvh; min-height:0; border:0; border-radius:0; box-shadow:none; } }
          @keyframes gateway-breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.86; } }
          #auth-gateway-mark { animation: gateway-breathe 5.2s ease-in-out infinite; }
          @media(prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; } }
        `}</style>
      </head>
      <body>
        <main id="preview-stage">
          <aside id="preview-intro">
            <small data-preview-copy="eyebrow">
              CHINABUDDY / INTERACTIVE DEMO
            </small>
            <h1 data-preview-copy="headline">A buddy for everyday life.</h1>
            <p data-preview-copy="summary">
              Explore the phone layout, practical guides, Chinese help cards and
              your personal AI companion.
            </p>
            {process.env.EXPO_PUBLIC_LEGACY_DEMO_URL && (
              <p>
                <a
                  data-preview-copy="legacy"
                  href={process.env.EXPO_PUBLIC_LEGACY_DEMO_URL}
                  style={{ color: "#246BEB" }}
                >
                  Earlier web demo
                </a>
              </p>
            )}
            <small data-preview-copy="privacy">
              API keys stay in memory only. Reloading or closing clears them.
            </small>
            <small data-preview-copy="native">
              Interactive iPhone layout preview, using the native app’s code.
              This is not an Apple iOS simulator. To try it on an iPhone, scan
              the terminal QR code with Expo Go.
            </small>
          </aside>
          <section id="phone" aria-label="ChinaBuddy iPhone layout preview">
            <div id="preview-status" aria-hidden="true">
              <span>9:41</span>
              <span>5G · 100%</span>
            </div>
            {children}
            <div id="home-indicator" />
          </section>
        </main>
      </body>
    </html>
  );
}
