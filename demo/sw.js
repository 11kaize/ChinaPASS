/* ChinaPASS's local shell. Bump this version when shipping new offline content. */
const CACHE_PREFIX = "chinapass-shell-";
const CACHE_NAME = CACHE_PREFIX + "2026-09-23-11";
const SCOPE = self.registration.scope;
const SHELL_FILES = [
  "./",
  "index.html",
  "styles.css",
  "data.js",
  "explore.js",
  "explore-ui.js",
  "app.js",
  "hero-rail.png",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png"
];
const SHELL_URLS = new Set(SHELL_FILES.map((file) => new URL(file, SCOPE).href));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(Array.from(SHELL_URLS)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.search || !SHELL_URLS.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request, { cache: "no-cache" });
      if (response.ok) event.waitUntil(cache.put(url.href, response.clone()));
      return response;
    } catch (_) {
      return (await cache.match(url.href)) || Response.error();
    }
  })());
});
