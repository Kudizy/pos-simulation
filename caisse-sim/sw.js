/* Service worker — network-first pour le HTML (évite stale index après redeploy) */
const CACHE = "kudizy-caisse-sim-next-v3";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll([
          "./manifest.webmanifest",
          "./icons/icon-192.png",
          "./icons/icon-512.png",
          "./icons/kudizy-pos-app-icon.svg",
          "./icons/apple-touch-icon.png",
        ])
      )
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const isNav = e.request.mode === "navigate" || e.request.destination === "document";
  const isNextAsset = url.pathname.includes("/_next/");

  // HTML / navigation : réseau d’abord (sinon vieil index → chunks 404)
  if (isNav) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then((c) => c || caches.match("./")))
    );
    return;
  }

  // Assets hashed Next : cache-first OK
  if (isNextAsset) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return res;
          })
      )
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
