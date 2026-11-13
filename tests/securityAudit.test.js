import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('vercel.json security headers & SPA rewrites', () => {
  it('defines required security headers, asset caching, and API/SPA rewrites', () => {
    const raw = fs.readFileSync(path.resolve('vercel.json'), 'utf8');
    const config = JSON.parse(raw);

    assert.ok(Array.isArray(config.headers));
    assert.ok(Array.isArray(config.rewrites));

    const globalHeaderRule = config.headers.find((h) => h.source === '/(.*)');
    assert.ok(globalHeaderRule, 'Missing /(.*) header rule');

    const headerMap = Object.fromEntries(
      globalHeaderRule.headers.map((item) => [item.key, item.value])
    );

    assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
    assert.equal(headerMap['X-Frame-Options'], 'SAMEORIGIN');
    assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.equal(
      headerMap['Strict-Transport-Security'],
      'max-age=63072000; includeSubDomains; preload'
    );
    assert.equal(
      headerMap['Permissions-Policy'],
      'camera=(self), microphone=(self), geolocation=()'
    );

    const assetsHeaderRule = config.headers.find((h) => h.source === '/assets/(.*)');
    assert.ok(assetsHeaderRule, 'Missing /assets/(.*) cache header rule');
    assert.equal(
      assetsHeaderRule.headers[0].value,
      'public, max-age=31536000, immutable'
    );

    const spaFallback = config.rewrites.find((r) => r.destination === '/index.html');
    assert.ok(spaFallback, 'Missing SPA /index.html fallback rewrite');
    assert.match(spaFallback.source, /manifest\\\.webmanifest/);
    assert.match(spaFallback.source, /robots\\\.txt/);
    assert.match(spaFallback.source, /sitemap\\\.xml/);
  });
});

describe('Supabase security audit migration', () => {
  it('creates system_error_logs with RLS, enables RLS on Phase 27-36 tables, and hardens SECURITY DEFINER RPCs', () => {
    const sql = fs.readFileSync(
      path.resolve('supabase/migrations/20261114_3701_security_rls_and_telemetry_audit.sql'),
      'utf8'
    );

    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.system_error_logs/);
    assert.match(sql, /ALTER TABLE public\.system_error_logs ENABLE ROW LEVEL SECURITY/);
    assert.match(sql, /p\.role = 'admin'/);
    assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
    assert.match(sql, /SET search_path = public/);
    assert.match(sql, /auth\.uid\(\) IS NULL OR auth\.uid\(\) <> p_user_id/);
    assert.match(sql, /compute_user_hsk_readiness_radar/);
    assert.match(sql, /record_arena_match_result/);
  });
});

