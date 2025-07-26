self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("webcam-cache").then(cache =>
      cache.addAll([
        "/",
        "/index.html",
        "/bilder/westen.jpg",
        "/bilder/sueden.jpg",
        "/icon-192.png",
        "/icon-512.png",
        "/manifest.json"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});

