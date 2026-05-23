const CACHE_NAME = "ppccc-app-shell-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/events.generated.json",
  "/app.webmanifest",
  "/icons/icon.svg",
  "/icons/maskable-icon.svg",
  "/icons/apple-touch-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname === "/api/app/events") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/events.generated.json"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => {
      return caches.match(event.request).then((cached) => cached || caches.match("/index.html"));
    })
  );
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() || {};
  event.waitUntil(
    self.registration.showNotification(payload.title || "Palo Pinto Cowboy Church", {
      body: payload.body || "You have a new church app notification.",
      icon: "/icons/icon.svg",
      badge: "/icons/maskable-icon.svg",
      data: { url: payload.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const client = clientList.find((item) => item.url.includes(self.location.origin));
      if (client) return client.focus();
      return clients.openWindow(url);
    })
  );
});
