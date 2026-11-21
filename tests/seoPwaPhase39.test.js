import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SITE_ORIGIN,
  getRouteSeoMeta,
  buildGlobalJsonLdSchemas,
} from '../src/core/seo/routeSeoConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readRel(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

test('Task 39.06 (1): index.html includes canonical, OG, Twitter Card, manifest, theme-color & apple-touch-icon', () => {
  const html = readRel('index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/hanzigo-xi\.vercel\.app\/"\s*\/>/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:description"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/hanzigo-xi\.vercel\.app\/og-image\.png"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest"\s*\/>/);
  assert.match(html, /<meta name="theme-color" content="#E85D3F"\s*\/>/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/icons\/icon-192\.png"\s*\/>/);
});

test('Task 39.06 (2): Dynamic route SEO & JSON-LD reflect HSK 1-9 product reality', () => {
  for (const route of ['home', 'roadmap', 'vocabulary', 'hsk', 'materials', 'privacy', 'terms']) {
    const meta = getRouteSeoMeta(route);
    assert.ok(meta.title.includes('HanziGo'));
    assert.ok(meta.canonicalUrl.startsWith(SITE_ORIGIN));
    assert.equal(meta.robots, 'index, follow');
  }

  const schemas = buildGlobalJsonLdSchemas();
  const jsonText = JSON.stringify(schemas);
  assert.ok(jsonText.includes('HSK 1–9') || jsonText.includes('HSK 7–9'));
  assert.equal(schemas.some((s) => s['@type'] === 'WebApplication'), true);
  assert.equal(schemas.some((s) => s['@type'] === 'EducationalOrganization'), true);
  assert.equal(schemas.filter((s) => s['@type'] === 'Course').length, 2);
});

test('Task 39.06 (3): robots.txt & sitemap.xml are valid and protect private routes', () => {
  const robots = readRel('public/robots.txt');
  assert.match(robots, /Sitemap:\s*https:\/\/hanzigo-xi\.vercel\.app\/sitemap\.xml/);
  assert.match(robots, /Disallow:\s*\/api\//);
  assert.match(robots, /Disallow:\s*\/admin/);
  assert.match(robots, /Disallow:\s*\/teacher/);

  const sitemap = readRel('public/sitemap.xml');
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.doesNotMatch(sitemap, /localhost/);
  assert.doesNotMatch(sitemap, /\/admin/);
});

test('Task 39.06 (4): manifest.webmanifest is complete and all referenced icons & OG images exist in public/', () => {
  const manifest = JSON.parse(readRel('public/manifest.webmanifest'));
  assert.ok(manifest.name);
  assert.ok(manifest.short_name);
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.theme_color);
  assert.ok(manifest.background_color);
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);

  for (const icon of manifest.icons) {
    const relIconPath = path.join('public', icon.src.replace(/^\//, ''));
    assert.equal(fs.existsSync(path.join(ROOT, relIconPath)), true, `Missing icon ${relIconPath}`);
  }
  for (const pngRel of ['public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/og-image.png']) {
    const full = path.join(ROOT, pngRel);
    assert.equal(fs.existsSync(full), true, `Missing PNG asset ${pngRel}`);
    assert.ok(fs.statSync(full).size > 1000, `PNG asset ${pngRel} looks empty`);
  }
  assert.equal(fs.existsSync(path.join(ROOT, 'public/hanzigo-logo.svg')), true);
});

test('Task 39.06 (5): Service Worker public/sw.js strictly excludes /api/, Supabase, and Auth from caching', () => {
  const swSrc = readRel('public/sw.js');
  assert.match(swSrc, /pathname\.startsWith\('\/api\/'\)/);
  assert.match(swSrc, /supabase\.co/);
  assert.match(swSrc, /pathname\.startsWith\('\/auth\/'\)/);
  assert.match(swSrc, /request\.method !== 'GET'/);
  assert.match(swSrc, /caches\.delete/);

  const mainSrc = readRel('src/main.jsx');
  assert.match(mainSrc, /serviceWorker\.register\('\/sw\.js'\)/);
});
