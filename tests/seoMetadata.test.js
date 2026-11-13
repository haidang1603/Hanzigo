import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  SITE_ORIGIN,
  ROUTE_SEO_CONFIG,
  getRouteSeoMeta,
  buildGlobalJsonLdSchemas,
} from '../src/core/seo/routeSeoConfig.js';

describe('SEO Route Config & JSON-LD', () => {
  it('defines metadata for at least 23 HanziGo routes with valid Vietnamese titles & canonical URLs', () => {
    const keys = Object.keys(ROUTE_SEO_CONFIG);
    assert.ok(keys.length >= 23, `Expected >= 23 routes, got ${keys.length}`);

    for (const key of keys) {
      const meta = getRouteSeoMeta(key);
      assert.ok(meta.title.includes('HanziGo'), `Missing HanziGo brand in title for ${key}`);
      assert.ok(meta.description.length > 20, `Description too short for ${key}`);
      assert.ok(meta.canonicalUrl.startsWith(SITE_ORIGIN), `Invalid canonical URL for ${key}`);
      assert.equal(meta.ogLocale, 'vi_VN');
      assert.equal(meta.twitterCard, 'summary_large_image');
    }
  });

  it('returns exact expected metadata for HSK exam practice and legal pages', () => {
    const hsk = getRouteSeoMeta('hsk');
    assert.equal(hsk.title, 'Thi Thử HSK 1-6 & HSKK Chuẩn CTI Trực Tuyến | HanziGo');
    assert.equal(hsk.canonicalUrl, `${SITE_ORIGIN}/hsk-practice`);
    assert.equal(hsk.robots, 'index, follow');

    for (const legal of ['privacy', 'terms', 'cookies', 'refund', 'storage-preferences']) {
      const meta = getRouteSeoMeta(legal);
      assert.equal(meta.robots, 'index, follow');
    }

    for (const hidden of ['admin', 'teacher', 'reset-password', 'profile']) {
      const meta = getRouteSeoMeta(hidden);
      assert.equal(meta.robots, 'noindex, nofollow');
    }
  });

  it('builds Schema.org JSON-LD graph with WebApplication, EducationalOrganization, and Courses', () => {
    const schemas = buildGlobalJsonLdSchemas();
    const types = schemas.map((item) => item['@type']);

    assert.ok(types.includes('WebApplication'));
    assert.ok(types.includes('EducationalOrganization'));
    assert.equal(types.filter((t) => t === 'Course').length, 2);
  });
});

describe('robots.txt & sitemap.xml', () => {
  it('configures robots.txt with Googlebot/Bingbot rules and disallows internal paths', () => {
    const robots = fs.readFileSync(path.resolve('public/robots.txt'), 'utf8');
    assert.match(robots, /User-agent:\s*Googlebot/);
    assert.match(robots, /User-agent:\s*Bingbot/);
    assert.match(robots, /Allow:\s*\/roadmap/);
    assert.match(robots, /Allow:\s*\/hsk-practice/);
    assert.match(robots, /Disallow:\s*\/admin/);
    assert.match(robots, /Disallow:\s*\/api\//);
    assert.match(robots, /Disallow:\s*\/reset-password/);
    assert.match(robots, /Sitemap:\s*https:\/\/hanzigo-xi\.vercel\.app\/sitemap\.xml/);
  });

  it('configures sitemap.xml with public URLs and lastmod 2026-11-13', () => {
    const sitemap = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf8');
    assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
    assert.match(sitemap, /<loc>https:\/\/hanzigo-xi\.vercel\.app\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/hanzigo-xi\.vercel\.app\/hsk-practice<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/hanzigo-xi\.vercel\.app\/privacy-policy<\/loc>/);
    assert.match(sitemap, /<lastmod>2026-11-13<\/lastmod>/);
  });
});

