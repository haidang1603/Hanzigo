import { lazy } from 'react';

const CHUNK_RELOAD_LOCK_KEY = 'hanzigo_chunk_reload_lock';
const RELOAD_COOLDOWN_MS = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 400;

const routePrefetchers = new Map();
const prefetchedRoutes = new Set();

function normalizeRouteKey(routePath) {
  return String(routePath || '')
    .trim()
    .replace(/^[#/]+/, '')
    .split(/[/?]/)[0]
    .toLowerCase();
}

function isChunkLoadError(error) {
  const message = String(error?.message || error || '');
  return (
    error?.name === 'ChunkLoadError' ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Loading chunk [\d\w-]+ failed/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function registerRoutePrefetcher(routePath, importer) {
  if (typeof importer !== 'function') return;
  const keys = Array.isArray(routePath) ? routePath : [routePath];
  for (const key of keys) {
    const normalized = normalizeRouteKey(key);
    if (normalized) {
      routePrefetchers.set(normalized, importer);
    }
  }
}

export function prefetchRoute(routePath) {
  const normalized = normalizeRouteKey(routePath);
  if (!normalized || prefetchedRoutes.has(normalized)) return;

  const importer = routePrefetchers.get(normalized);
  if (!importer) return;

  prefetchedRoutes.add(normalized);
  Promise.resolve()
    .then(() => importer())
    .catch(() => {
      prefetchedRoutes.delete(normalized);
    });
}

export async function resolveImportWithRetry(importer) {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await importer();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await wait(RETRY_DELAY_MS);
      }
    }
  }

  if (typeof window !== 'undefined' && isChunkLoadError(lastError)) {
    try {
      const lastReloadRaw = window.sessionStorage?.getItem(CHUNK_RELOAD_LOCK_KEY);
      const lastReloadAt = lastReloadRaw ? Number(lastReloadRaw) : 0;
      const now = Date.now();
      if (!lastReloadAt || now - lastReloadAt > RELOAD_COOLDOWN_MS) {
        window.sessionStorage?.setItem(CHUNK_RELOAD_LOCK_KEY, String(now));
        window.location.reload();
        return new Promise(() => {});
      }
    } catch {
      // ignore sessionStorage errors in restricted contexts
    }
  }

  throw lastError;
}

export function lazyWithRetry(importer, routeKeys = null) {
  if (routeKeys) {
    registerRoutePrefetcher(routeKeys, importer);
  }

  return lazy(() => resolveImportWithRetry(importer));
}

export default lazyWithRetry;

