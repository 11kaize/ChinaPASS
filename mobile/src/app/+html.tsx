import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";

// Desktop review surface only. The iPhone app continues to render native views.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>ChinaHand · iPhone interaction preview</title>
        <ScrollViewStyleReset />
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; background: #dce5df; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          #preview-stage { min-height: 100dvh; display: flex; align-items: center; justify-content: center; gap: 64px; padding: 36px; }
          #preview-intro { width: 300px; color: #18382a; }
          #preview-intro p { line-height: 1.7; color: #53665a; }
          #preview-intro h1 { font-size: 42px; letter-spacing: -1.6px; margin: 20px 0; }
          #preview-intro small { display: block; line-height: 1.7; }
          #phone { width: 393px; height: min(852px, calc(100dvh - 72px)); min-height: 570px; display: flex; flex-direction: column; overflow: hidden; border: 8px solid #1a211d; border-radius: 52px; background: #f3f5f4; box-shadow: 0 28px 70px #18382a30, 0 0 0 2px #647369; position: relative; }
          #preview-status { height: 45px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 25px; color: #19251f; font-size: 13px; font-weight: 650; }
          #preview-status::after { content: ''; position: absolute; width: 105px; height: 26px; background: #111714; border-radius: 20px; top: 7px; left: calc(50% - 52.5px); }
          #phone[data-theme="dark"] { background:#101813; }
          #phone[data-theme="dark"] #preview-status { color:#f2f6f3; }
          #root { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; }
          #home-indicator { position: absolute; bottom: 5px; left: calc(50% - 52px); height: 4px; width: 104px; border-radius: 5px; background: #68766b; pointer-events: none; z-index: 100; }
          @media(max-width: 850px) { #preview-intro { display:none; } #preview-stage { padding: 16px; } #phone { height: calc(100dvh - 32px); } }
          @media(max-width: 440px) { #preview-stage { padding:0; } #phone { width:100%; height:100dvh; min-height:0; border:0; border-radius:0; box-shadow:none; } }
          @media(prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
        `}</style>
      </head>
      <body>
        <main id="preview-stage">
          <aside id="preview-intro">
            <small>CHINAHAND / INTERACTIVE DEMO</small>
            <h1>A hand with<br />everyday life.</h1>
            <p>Explore the iPhone layout, practical guides, Chinese help cards and your personal AI companion.</p>
            {process.env.EXPO_PUBLIC_LEGACY_DEMO_URL && <p><a href={process.env.EXPO_PUBLIC_LEGACY_DEMO_URL} style={{ color: "#165645" }}>Earlier web demo · 原版功能</a></p>}
            <small>API Key stays in memory only. Reloading or closing clears it.</small>
            <small>iPhone 布局交互预览 · 可点击操作<br />复用原生应用代码，非 Apple iOS 模拟器。<br />iPhone 真机：Expo Go 扫描终端二维码。</small>
          </aside>
          <section id="phone" aria-label="ChinaHand iPhone layout preview">
            <div id="preview-status" aria-hidden="true"><span>9:41</span><span>5G · 100%</span></div>
            {children}
            <div id="home-indicator" />
          </section>
        </main>
      </body>
    </html>
  );
}
