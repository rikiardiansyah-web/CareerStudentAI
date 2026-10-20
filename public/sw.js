// CAREERSTUDENT AI — Progressive Web App Service Worker
const CACHE_VERSION = 'v1.0.1';
const STATIC_CACHE = `career-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `career-dynamic-${CACHE_VERSION}`;

// Pre-cached App Shell files
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/logo-cs.jpg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

// Install: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Multi-strategy caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests originating from our domain
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // Strategy A: Cache-First for static assets (fast, tolerates stale)
  if (url.pathname.match(/\.(css|js|png|jpg|svg|woff2|ico)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy B: Network-First for HTML navigation routes (fresh, falls back to offline.html)
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy C: Stale-While-Revalidate for taxonomy and reference data
  if (url.pathname.startsWith('/api/career') || url.pathname.startsWith('/api/skillgap')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// Strategy Implementations
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Asset unavailable offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}
