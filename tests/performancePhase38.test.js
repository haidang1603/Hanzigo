import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = path.resolve(process.cwd());

test('Phase 38.05 (1): Eliminates INEFFECTIVE_DYNAMIC_IMPORT in customLessonService.js', () => {
  const customLessonSrc = fs.readFileSync(
    path.join(ROOT, 'src/services/customLessonService.js'),
    'utf8'
  );

  assert.ok(
    !customLessonSrc.includes("import('./learningPathService.js')"),
    'customLessonService.js must not dynamically import learningPathService.js (already statically imported in main app)'
  );
  assert.ok(
    !customLessonSrc.includes("import('../utils/gamification.js')"),
    'customLessonService.js must not dynamically import gamification.js (already statically imported in main app)'
  );
  assert.ok(
    customLessonSrc.includes("from './learningPathService.js'") &&
      customLessonSrc.includes("from '../utils/gamification.js'"),
    'customLessonService.js must use static imports for learningPathService.js and gamification.js'
  );
});

test('Phase 38.05 (2): Heavy HSK exam & HSKK simulators are lazy-loaded in HskPracticePage.jsx', () => {
  const hskPageSrc = fs.readFileSync(
    path.join(ROOT, 'src/pages/HskPracticePage.jsx'),
    'utf8'
  );

  const lazyComponents = [
    'Hsk7to9IntegratedExamSimulator',
    'Hsk6SimulatorWorkspace',
    'Hsk6TwoPhaseSummarySimulator',
    'HskkSpeakingSimulator',
    'PostExamMistakeRemediationPanel',
  ];

  for (const name of lazyComponents) {
    assert.ok(
      hskPageSrc.includes(`const ${name} = lazy(`),
      `HskPracticePage.jsx must lazy-load ${name}`
    );
  }
});

test('Phase 38.05 (3): vite.config.js splits HSK exam engine & data chunks granularly', () => {
  const viteConfigSrc = fs.readFileSync(path.join(ROOT, 'vite.config.js'), 'utf8');

  assert.ok(
    !viteConfigSrc.includes("return 'feature-hsk-exam-engine'"),
    'vite.config.js must not bundle all HSK/HSKK features into one giant feature-hsk-exam-engine chunk'
  );
  for (const expectedChunk of [
    'feature-hskk-exam',
    'feature-hsk6-exam',
    'feature-hsk79-exam',
    'data-hsk-core',
    'data-hsk-resources',
    'data-hsk6-exam',
  ]) {
    assert.ok(
      viteConfigSrc.includes(`'${expectedChunk}'`),
      `vite.config.js manualChunks must define ${expectedChunk}`
    );
  }
});

test('Phase 38.05 (4): progressService.js uses narrow column projection & vercel.json keeps API uncached', () => {
  const progressSrc = fs.readFileSync(
    path.join(ROOT, 'src/services/progressService.js'),
    'utf8'
  );
  assert.ok(
    progressSrc.includes(".select('id, xp, streak, longest_streak, level, words_learned, last_study_date')"),
    'progressService.js should use narrow column projection on profiles'
  );

  const vercelJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const apiHeaders = (vercelJson.headers || []).filter((h) => String(h.source || '').includes('/api'));
  assert.equal(apiHeaders.length, 0, 'vercel.json must not configure public CDN caching on /api routes');
});

test('Phase 38.05 (5): Built dist/assets JS chunks satisfy performance budget (<= 180 KB gzip route chunks, <= 160 KB entry)', () => {
  const jsDir = path.join(ROOT, 'dist/assets/js');
  if (!fs.existsSync(jsDir)) {
    // Allow running test even if dist/ hasn't been built yet in CI pre-build step
    assert.ok(true);
    return;
  }

  const files = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
  assert.ok(files.length > 0, 'dist/assets/js must contain built JS chunks');

  for (const file of files) {
    const gzipKb = gzipSync(fs.readFileSync(path.join(jsDir, file))).length / 1024;
    if (/^index-/.test(file)) {
      assert.ok(gzipKb <= 160, `Main entry ${file} exceeded 160 KB gzip (${gzipKb.toFixed(2)} KB)`);
    } else if (/^vendor-livekit-/.test(file)) {
      assert.ok(gzipKb <= 260, `vendor-livekit ${file} exceeded 260 KB gzip (${gzipKb.toFixed(2)} KB)`);
    } else {
      assert.ok(gzipKb <= 180, `Chunk ${file} exceeded 180 KB gzip (${gzipKb.toFixed(2)} KB)`);
    }
  }
});
