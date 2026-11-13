import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import viteConfig from '../vite.config.js';
import {
  resolveImportWithRetry,
  registerRoutePrefetcher,
  prefetchRoute,
} from '../src/core/routing/lazyWithRetry.js';

test('Test 1: Vite manualChunks routes vendor & feature paths deterministically', () => {
  const manualChunks = viteConfig?.build?.rollupOptions?.output?.manualChunks;
  assert.equal(typeof manualChunks, 'function', 'manualChunks must be a function');

  assert.equal(
    manualChunks('/app/node_modules/livekit-client/dist/livekit-client.esm.mjs'),
    'vendor-livekit'
  );
  assert.equal(
    manualChunks('/app/node_modules/hanzi-writer/dist/hanzi-writer.min.js'),
    'vendor-hanzi'
  );
  assert.equal(
    manualChunks('/app/node_modules/@supabase/supabase-js/dist/module/index.js'),
    'vendor-supabase'
  );
  assert.equal(
    manualChunks('/app/node_modules/lucide-react/dist/esm/lucide-react.js'),
    'vendor-icons'
  );
  assert.equal(
    manualChunks('/app/node_modules/react-dom/client.js'),
    'vendor-react-core'
  );
  assert.equal(
    manualChunks('/app/src/features/hsk-exam/HskExamEngine.jsx'),
    'feature-hsk-exam-engine'
  );
  assert.equal(
    manualChunks('/app/src/features/hskk-exam/HskkRecorder.jsx'),
    'feature-hsk-exam-engine'
  );
});

test('Test 2: lazyWithRetry recovers from transient failures and prefetchRoute deduplicates calls', async () => {
  let attempts = 0;
  const flakyImporter = async () => {
    attempts += 1;
    if (attempts === 1) {
      throw new Error('Temporary network glitch');
    }
    return { default: () => 'LoadedComponent' };
  };

  const resolved = await resolveImportWithRetry(flakyImporter);
  assert.equal(attempts, 2);
  assert.equal(typeof resolved.default, 'function');
  assert.equal(resolved.default(), 'LoadedComponent');

  let prefetchCalls = 0;
  const routeKey = `test-prefetch-route-${Date.now()}`;
  registerRoutePrefetcher(routeKey, async () => {
    prefetchCalls += 1;
    return { default: () => 'Prefetched' };
  });

  prefetchRoute(routeKey);
  prefetchRoute(routeKey);
  prefetchRoute(`/${routeKey}`);
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(prefetchCalls, 1, 'prefetchRoute must deduplicate repeated hovers');
});

test('Test 3: SQL migrations are non-empty, safe, and cover all Phase 27-34 core tables', () => {
  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
  assert.equal(fs.existsSync(migrationsDir), true);

  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  assert.equal(sqlFiles.length > 0, true, 'Must have SQL migration files');

  let combinedSql = '';
  for (const file of sqlFiles) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    assert.equal(content.trim().length > 0, true, `Migration ${file} must not be empty`);

    // Ensure no unsafe bare DROP TABLE without IF EXISTS
    const unsafeDrop = /\bDROP\s+TABLE\s+(?!IF\s+EXISTS\b)/i.test(content);
    assert.equal(unsafeDrop, false, `Unsafe DROP TABLE without IF EXISTS in ${file}`);
    combinedSql += `\n${content}`;
  }

  const requiredTables = [
    'dictionary_entries',
    'grammar_points',
    'reading_articles',
    'listening_tracks',
    'user_vocab_items',
    'hsk_question_bank',
    'tts_audio_cache_registry',
    'classroom_hsk_assignments',
    'ai_roleplay_sessions',
  ];

  for (const tableName of requiredTables) {
    const regex = new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(?:public\\.)?${tableName}\\b`, 'i');
    assert.match(combinedSql, regex, `Missing core table definition: ${tableName}`);
  }
});

test('Test 4: Vercel Serverless entrypoints stay within Hobby limit (<= 12) and resolve all handlers', () => {
  const apiDir = path.resolve(process.cwd(), 'api');
  const entrypoints = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        entrypoints.push(fullPath);
      }
    }
  }

  walk(apiDir);
  assert.equal(
    entrypoints.length <= 12,
    true,
    `Vercel Hobby plan allows <= 12 Serverless Functions, found ${entrypoints.length}`
  );

  for (const entryFile of entrypoints) {
    const code = fs.readFileSync(entryFile, 'utf8');
    const importMatches = [...code.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)];
    for (const match of importMatches) {
      const relImport = match[1];
      const resolvedTarget = path.resolve(path.dirname(entryFile), relImport);
      assert.equal(
        fs.existsSync(resolvedTarget),
        true,
        `Missing handler target ${relImport} referenced by ${path.relative(process.cwd(), entryFile)}`
      );
    }
  }
});

test('Test 5: All 5 legal & preference pages exist, expose official contact/domain, and are registered in App.jsx', () => {
  const appSource = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf8');
  const legalPages = [
    { file: 'PrivacyPolicyPage.jsx', route: 'privacy', requireContact: true },
    { file: 'TermsOfServicePage.jsx', route: 'terms', requireContact: true },
    { file: 'CookiePolicyPage.jsx', route: 'cookies', requireContact: true },
    { file: 'RefundPolicyPage.jsx', route: 'refund', requireContact: true },
    { file: 'StoragePreferencesPage.jsx', route: 'storage-preferences', requireContact: false },
  ];

  for (const page of legalPages) {
    const pagePath = path.resolve(process.cwd(), 'src/pages', page.file);
    assert.equal(fs.existsSync(pagePath), true, `Missing legal page: ${page.file}`);

    const content = fs.readFileSync(pagePath, 'utf8');
    assert.match(content, /hanzigo/i, `${page.file} missing HanziGo brand reference`);
    if (page.requireContact) {
      assert.match(content, /lehaidang16032006@gmail\.com/, `${page.file} missing official email`);
    }

    assert.equal(
      appSource.includes(page.file.replace('.jsx', '')),
      true,
      `${page.file} must be imported in App.jsx`
    );
    assert.equal(
      appSource.includes(`'${page.route}'`),
      true,
      `Route '${page.route}' must be wired in App.jsx`
    );
  }
});
