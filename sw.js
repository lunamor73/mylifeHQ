// mylifeHQ Service Worker
// Bump CACHE_NAME whenever you push an update — forces all saved PWAs to refresh
const CACHE_NAME = 'mylifehq-20261124-transcribe';
// Libraries are pinned to exact versions, so they live in their own cache that survives app updates
const LIB_CACHE = 'mylifehq-lib-v1';
const CORE_FILES = [
  './mylifeHQoraculum.html',
  './mylifeHQmundus.html',
  './whisper-worker.js',
];
// v3.34: also keep the sync library and home-screen icon, so the app opens with no signal
const EXTRA_FILES = [
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js',
  './captain-icon.png',
];
// Weak signal: wait this long for the network, then open from the copy on the phone
const NET_TIMEOUT_MS = 3500;

// ── Install: pre-cache core files and take over immediately ──────────────────
self.addEventListener('install', e => {
  self.skipWaiting(); // don't wait for old SW to die
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(CORE_FILES).then(() =>
        caches.open(LIB_CACHE).then(lib =>
          Promise.all(EXTRA_FILES.map(u => (u.startsWith('http') ? lib : cache).add(u).catch(() => {})))
        )
      )
    )
  );
});

// ── Activate: wipe old caches, claim all open tabs ───────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        // Only clear this app's old copies; keep the library cache and the
        // transcriber's model cache (transformers-cache) between updates
        keys.filter(k => k.startsWith('mylifehq-') && k !== CACHE_NAME && k !== LIB_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function putInCache(req, res, cacheName) {
  if (res && res.ok) {
    const clone = res.clone();
    caches.open(cacheName || CACHE_NAME).then(cache => cache.put(req, clone));
  }
  return res;
}

// Network first, but give up after NET_TIMEOUT_MS when there's a saved copy
function networkWithTimeout(req) {
  return new Promise(resolve => {
    let settled = false;
    const finish = r => { if (!settled && r) { settled = true; resolve(r); } };
    const fromCache = () => caches.match(req, { ignoreSearch: true });
    const timer = setTimeout(() => { fromCache().then(finish); }, NET_TIMEOUT_MS);
    fetch(req.clone())
      .then(res => { clearTimeout(timer); finish(putInCache(req, res)); })
      .catch(() => {
        clearTimeout(timer);
        fromCache().then(hit => finish(hit || Response.error()));
      });
  });
}

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Live sync and sign-in traffic goes straight through, never cached.
  // So do the transcriber's model files: Transformers.js keeps those itself.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('firebaseapp.com')) return;
  if (url.hostname === 'huggingface.co' || url.hostname.endsWith('.huggingface.co') || url.hostname.endsWith('.hf.co')) return;

  // Pinned libraries (Firebase, Transformers.js and its runtime) never change
  // at a given version: phone copy first, kept across app updates
  const pinnedLib = (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) ||
                    (url.hostname === 'cdn.jsdelivr.net' && /@\d+\.\d+\.\d+/.test(url.pathname));
  if (pinnedLib) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => putInCache(req, res, LIB_CACHE)))
    );
    return;
  }

  // Everything else (the app itself, tide and moon data): network first, phone copy as fallback
  e.respondWith(networkWithTimeout(req));
});
