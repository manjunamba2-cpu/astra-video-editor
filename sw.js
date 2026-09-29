const CACHE_NAME = 'astra-editor-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './astra_icon_512.png'
];

// Cache layout assets inside device memory
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve the web application immediately from cache if working offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});