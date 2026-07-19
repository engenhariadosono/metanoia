// METANOIA — service worker (offline-first do app shell)
// Estratégia: precache do shell; network-first nas navegações (fresco online,
// cache no offline); cache-first nos assets estáticos; nunca cacheia /api.
const CACHE = "metanoia-v2";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/apple-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // deixa POST do Mentor ir sempre à rede
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // só mesmo domínio
  if (url.pathname.startsWith("/api/")) return; // nunca cacheia API

  // Navegações (páginas): network-first, cai pro cache/shell no offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Assets estáticos: cache-first, popula o cache ao buscar
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});

// Lembrete diário (periodicSync, best-effort em PWA instalado no Android)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "metanoia-daily") {
    event.waitUntil(
      self.registration.showNotification("METANOIA — encare seu desafio", {
        body: "Um desafio de coragem te espera hoje. ⚔️",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "metanoia-daily",
      })
    );
  }
});

// Toque na notificação: foca uma aba aberta ou abre o app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const c of list) {
          if (c.url.startsWith(self.location.origin) && "focus" in c) {
            return c.focus();
          }
        }
        return self.clients.openWindow("/");
      })
  );
});
