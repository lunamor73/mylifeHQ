// mylifeHQ Service Worker
// Bump CACHE_NAME whenever you push an update — forces all saved PWAs to refresh
const CACHE_NAME = 'mylifehq-20260828-wisdomlegend';
const CORE_FILES = [
  './mylifeHQoraculum.html',
  './mylifeHQmundus.html',
];

// ── Install: pre-cache core files and take over immediately ──────────────────
self.addEventListener('install', e => {
  self.skipWaiting(); // don't wait for old SW to die
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES))
  );
});

// ── Activate: wipe old caches, claim all open tabs ───────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network first, cache fallback ─────────────────────────────────────
// HTML always fetched fresh; assets served from cache if network fails
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request.clone())
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
