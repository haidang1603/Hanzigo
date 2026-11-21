// HanziGo Service Worker — Task 39.06 (Security-Hardened Static Cache)
const CACHE_NAME = 'hanzigo-static-v39-06';
const APP_SHELL_URLS = ['/', '/manifest.webmanifest', '/hanzigo-logo.svg', '/favicon.svg'];

function isExcludedFromCache(url) {
  const { pathname, hostname, origin } = url;
  // Never cache API routes, auth endpoints, or third-party dynamic services (Supabase, LiveKit, AI/TTS)
  if (pathname.startsWith('/api/')) return true;
  if (
    hostname.includes('supabase.co') ||
    hostname.includes('supabase.in') ||
    hostname.includes('livekit.') ||
    hostname.includes('googleapis.com')
  ) {
    return true;
  }
  if (origin !== self.location.origin) {
    return true;
  }
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/rest/') ||
    pathname.startsWith('/storage/')
  ) {
    return true;
  }
  return false;
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/assets/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.webmanifest')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((oldKey) => caches.delete(oldKey))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Strictly bypass cache for API, Auth, Supabase, and external dynamic origins
  if (isExcludedFromCache(url)) {
    return;
  }

  // Navigation requests: Network-first with offline app-shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  // Immutable hashed /assets/* & static icons: Cache-first with background refresh
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        });
      })
    );
  }
});
