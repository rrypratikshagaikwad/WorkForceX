const CACHE_NAME = "workforcex-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// FETCH (NETWORK FIRST – SAFE FOR ATTENDANCE)
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // ❌ DO NOT CACHE API CALLS
  if (event.request.url.includes("/check-in") ||
      event.request.url.includes("/check-out") ||
      event.request.url.includes("/attendance") ||
      event.request.url.includes("/face")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
