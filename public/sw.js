const CACHE_NAME = 'splitly-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/logo-32.png',
  '/logo-64.png',
  '/logo-128.png',
  '/logo-192.png',
  '/logo-512.png',
];

// Install Event - Pre-cache core app shell & activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - Clean up stale caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Offline-first caching for assets & resilient navigation fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests, external extensions, or analytics trackers
  if (
    request.method !== 'GET' ||
    !request.url.startsWith('http') ||
    request.url.includes('googletagmanager.com') ||
    request.url.includes('google-analytics.com')
  ) {
    return;
  }

  // Navigation requests (HTML pages / Pull-to-Refresh)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            cache.put('/', networkResponse.clone());
            cache.put('/index.html', networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Offline fallback logic for navigation / pull-to-refresh
          const cachedRequest = await caches.match(request);
          if (cachedRequest) return cachedRequest;

          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;

          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;

          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/html' }),
          });
        }
      })()
    );
    return;
  }

  // Assets & JS/CSS/Image requests (Cache-First with Network Fallback & Revalidation)
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        // Revalidate in background if online
        fetch(request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, networkResponse);
            }
          })
          .catch(() => {});

        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        // Fallback for missing images/assets
        return new Response('', { status: 404, statusText: 'Not Found' });
      }
    })()
  );
});

// Message Listener - Skip Waiting when instructed by UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
