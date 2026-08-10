// sw.js – Basic offline cache for E&C Driver Map

const CACHE_NAME = 'ec-driver-map-v1';
const ASSETS = [
  './',
  './index.html',
  './icon2.png',
  // You can add more files here (e.g., CSS, JS) if they are local
  // but the main app loads everything from CDN (Firebase, Maps) – those are cached by the browser.
];

// Install event – cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate – clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch – serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request))
  );
});
