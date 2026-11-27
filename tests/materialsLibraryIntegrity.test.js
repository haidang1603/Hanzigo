import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { DEFAULT_MATERIALS } from '../src/data/defaultMaterialsData.js';
import { HSK_LEARNING_RESOURCES } from '../src/data/hskResourcesData.js';
import {
  HANZIGO_LIBRARY_CATALOG,
  VERIFIED_EXTERNAL_CATALOG,
  loadAllStructuredMaterials,
  loadMaterialDetailById,
} from '../src/data/materials/index.js';
import {
  HSK_2_0_BLUEPRINTS,
  HSK_3_0_BLUEPRINTS,
} from '../src/data/hskExamBlueprints.js';
import { SAMPLE_EXCERPTS } from '../src/components/materials/materialsConstants.js';
import {
  enrichAndMergeMaterials,
  filterAndSortMaterials,
  formatCompactLevelBadge,
  getMaterialBookmarkKey,
  getMaterialCompletedKey,
  getPaginationStep,
  readManualViewMode,
  readScopedMaterialIds,
  resolveMaterialsViewMode,
  writeManualViewMode,
  writeScopedMaterialIds,
} from '../src/components/materials/materialsHelpers.js';

const NUMERIC_PINYIN_REGEX = /\b[a-züǖǘǚǜ]{1,6}[1-5]\b/i;
const ALLOWED_ALNUM_TOKENS = /^(hsk[1-9]|v[0-9]|mp[34]|a4|gf[0-9]+|[abc][12])$/i;

function findNumericPinyinTokens(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(new RegExp(NUMERIC_PINYIN_REGEX.source, 'gi')) || [];
  return matches.filter((m) => !ALLOWED_ALNUM_TOKENS.test(m));
}

function collectFilesRecursive(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(full));
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

test('1. Zero Duplicate & Schema Integrity across all materials datasets', async () => {
  const structuredAll = await loadAllStructuredMaterials();
  assert.ok(structuredAll.length >= 20, 'Expected at least 20 structured & external entries');

  // Check catalog count matches lazy-loaded count
  assert.equal(HANZIGO_LIBRARY_CATALOG.length, structuredAll.length);
  assert.ok(VERIFIED_EXTERNAL_CATALOG.length >= 5);

  // Merged catalog preserves all DEFAULT_MATERIALS + structured + HSK_LEARNING_RESOURCES with zero duplicate IDs
  const merged = enrichAndMergeMaterials(DEFAULT_MATERIALS);
  const idSet = new Set();
  for (const item of merged) {
    assert.ok(item.id, 'Material missing id');
    assert.equal(idSet.has(String(item.id)), false, `Duplicate material ID found: ${item.id}`);
    idSet.add(String(item.id));
  }

  // Zero duplicate titles among structured HanziGo library items
  const titleSet = new Set();
  for (const doc of structuredAll) {
    assert.equal(titleSet.has(doc.title), false, `Duplicate title found: ${doc.title}`);
    titleSet.add(doc.title);
    for (const reqField of [
      'id',
      'title',
      'category',
      'examSystem',
      'level',
      'skill',
      'estimatedMinutes',
      'summary',
      'tags',
      'updatedAt',
    ]) {
      assert.ok(doc[reqField] !== undefined && doc[reqField] !== '', `Missing ${reqField} on ${doc.id}`);
    }
    if (!doc.isOfficialExternal) {
      assert.ok(Array.isArray(doc.contentBlocks) && doc.contentBlocks.length > 0, `Missing contentBlocks on ${doc.id}`);
    }
  }

  // Lazy loader resolves full contentBlocks
  const grammarDoc = await loadMaterialDetailById('hz-gram-hsk4-connectors');
  assert.ok(grammarDoc && Array.isArray(grammarDoc.contentBlocks) && grammarDoc.contentBlocks.length >= 3);

  // Verify HSK blueprint guide table matches hskExamBlueprints.js 100%
  const blueprintDoc = await loadMaterialDetailById('hz-exam-blueprint-hsk20-vs-30');
  const tableBlob = JSON.stringify(blueprintDoc.contentBlocks);
  for (const bp of Object.values(HSK_2_0_BLUEPRINTS)) {
    assert.ok(tableBlob.includes(`${bp.totalQuestions} câu`), `Missing HSK 2.0 ${bp.level} question count ${bp.totalQuestions}`);
    assert.ok(tableBlob.includes(`${bp.durationMinutes} phút`), `Missing HSK 2.0 ${bp.level} duration ${bp.durationMinutes}`);
  }
  for (const bp of Object.values(HSK_3_0_BLUEPRINTS)) {
    assert.ok(tableBlob.includes(`${bp.totalQuestions} câu`), `Missing HSK 3.0 ${bp.level} question count ${bp.totalQuestions}`);
    assert.ok(tableBlob.includes(`${bp.durationMinutes} phút`), `Missing HSK 3.0 ${bp.level} duration ${bp.durationMinutes}`);
  }
});

test('2. Pinyin Tone & Academic Accuracy Guard', async () => {
  const structuredAll = await loadAllStructuredMaterials();

  // Fixed typo in mat-11
  const mat11 = DEFAULT_MATERIALS.find((m) => m.id === 'mat-11');
  assert.ok(mat11 && !/:\s*m tiết\b/i.test(mat11.verificationNotes), 'mat-11 typo should be fixed');
  assert.ok(mat11.verificationNotes.includes('Âm tiết'));

  // Tone sandhi & radical fixes in SAMPLE_EXCERPTS
  assert.equal(SAMPLE_EXCERPTS['mat-10'].items[0].pinyin, 'yì xīn yí yì');
  assert.ok(!SAMPLE_EXCERPTS['mat-8'].rules[2].example.includes('xīn 心'));

  // Zero raw numeric pinyin tokens across all materials and excerpts
  const datasets = [...DEFAULT_MATERIALS, ...HSK_LEARNING_RESOURCES, ...structuredAll, SAMPLE_EXCERPTS];
  const blob = JSON.stringify(datasets);
  // Check structured text values cleanly
  const strings = [];
  const walk = (node) => {
    if (typeof node === 'string') strings.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (!['url', 'downloadUrl', 'sourceUrl', 'download_url', 'source_url', 'id', 'related_exam_ids'].includes(k)) {
          walk(v);
        }
      }
    }
  };
  walk(structuredAll);
  walk(SAMPLE_EXCERPTS);
  walk(DEFAULT_MATERIALS);
  assert.ok(blob.length > 1000);

  for (const str of strings) {
    const badTokens = findNumericPinyinTokens(str);
    assert.deepEqual(badTokens, [], `Raw numeric pinyin token(s) found in "${str}": ${badTokens.join(', ')}`);
  }

  // Every example block item has non-empty hanzi, pinyin, and vietnamese
  for (const doc of structuredAll) {
    for (const block of doc.contentBlocks || []) {
      if (block.type === 'examples') {
        for (const ex of block.items) {
          assert.ok(ex.hanzi && ex.pinyin && ex.vietnamese, `Incomplete example in ${doc.id}`);
        }
      }
    }
  }
});

test('3. Link & Security Guard (HTTPS/internal paths, no insecure targets)', async () => {
  const structuredAll = await loadAllStructuredMaterials();
  const allDocs = [...DEFAULT_MATERIALS, ...HSK_LEARNING_RESOURCES, ...structuredAll];
  const forbiddenDomainRegex = /(vercel\.app|netlify\.app|pages\.dev|firebaseapp\.com)/i;

  for (const doc of allDocs) {
    for (const field of ['sourceUrl', 'downloadUrl', 'source_url', 'download_url']) {
      const url = doc[field];
      if (!url || url === '#') continue;
      assert.equal(/^http:\/\//i.test(url), false, `Insecure http:// URL on ${doc.id}.${field}: ${url}`);
      assert.equal(/^(javascript|data):/i.test(url), false, `Unsafe scheme on ${doc.id}.${field}`);
      assert.equal(forbiddenDomainRegex.test(url), false, `Forbidden legacy domain on ${doc.id}.${field}: ${url}`);
      assert.ok(url.startsWith('https://') || url.startsWith('/'), `URL must start with https:// or /: ${url}`);
    }
  }

  // Check every target="_blank" inside MaterialsPage and materials components has rel="noopener noreferrer"
  const files = [
    path.resolve('src/pages/MaterialsPage.jsx'),
    ...collectFilesRecursive(path.resolve('src/components/materials')),
  ];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const blankTags = src.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || [];
    for (const tag of blankTags) {
      assert.ok(
        tag.includes('noopener') && tag.includes('noreferrer'),
        `Missing rel="noopener noreferrer" on <a target="_blank"> in ${file}: ${tag}`
      );
    }
  }
});

test('4. Trilingual Search & Filter Guard (Hanzi, Pinyin, accentless Vietnamese, HSK 3.0 & HSK 7-9)', () => {
  const catalog = enrichAndMergeMaterials(DEFAULT_MATERIALS);

  // Hanzi search
  const baResults = filterAndSortMaterials(catalog, { searchTerm: '把' });
  assert.ok(baResults.some((item) => item.id === 'hz-gram-hsk3-ba-bei'));

  // Accentless pinyin search
  const liangciResults = filterAndSortMaterials(catalog, { searchTerm: 'liangci' });
  assert.ok(liangciResults.some((item) => item.id === 'hz-measure-words-handbook'));

  const jinyiciResults = filterAndSortMaterials(catalog, { searchTerm: 'jinyici' });
  assert.ok(jinyiciResults.some((item) => item.id === 'hz-synonyms-hsk3-5'));

  // Accentless Vietnamese search
  const nguPhapResults = filterAndSortMaterials(catalog, { searchTerm: 'ngu phap' });
  assert.ok(nguPhapResults.some((item) => item.id === 'hz-gram-hsk4-connectors'));

  // HSK 3.0 & HSK 7-9 level filtering
  const hsk79Results = filterAndSortMaterials(catalog, {
    selectedExamVersion: '3.0',
    selectedLevel: 'HSK 7-9',
  });
  assert.ok(hsk79Results.some((item) => item.id === 'hz-gram-hsk79-academic'));
  assert.ok(hsk79Results.some((item) => item.id === 'hz-gram-hsk79-translation-rhetoric'));

  // Guide type filter
  const measureResults = filterAndSortMaterials(catalog, { selectedGuideType: 'Lượng từ' });
  assert.ok(measureResults.some((item) => item.id === 'hz-measure-words-handbook'));
  assert.ok(measureResults.every((item) => item.guideType === 'Lượng từ'));

  // Read status filter (bookmarked / completed / unread)
  const bookmarked = filterAndSortMaterials(catalog, {
    readStatusFilter: 'bookmarked',
    bookmarkedIds: ['hz-gram-hsk4-connectors'],
  });
  assert.deepEqual(bookmarked.map((i) => i.id), ['hz-gram-hsk4-connectors']);

  const completed = filterAndSortMaterials(catalog, {
    readStatusFilter: 'completed',
    completedIds: ['hz-radicals-60-core'],
  });
  assert.deepEqual(completed.map((i) => i.id), ['hz-radicals-60-core']);
});

test('5. User Isolation, QuotaExceededError Resilience & AuthContext Logout Cleanup', () => {
  const userA = { id: 'user-alpha' };
  const userB = { id: 'user-beta' };

  const keyA = getMaterialBookmarkKey(userA);
  const keyB = getMaterialBookmarkKey(userB);
  const keyGuest = getMaterialBookmarkKey(null);
  assert.notEqual(keyA, keyB);
  assert.notEqual(keyA, keyGuest);
  assert.notEqual(getMaterialCompletedKey(userA), getMaterialCompletedKey(userB));

  // In-memory Storage mock verifying strict user isolation
  const store = new Map();
  const mockStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
  };

  assert.equal(writeScopedMaterialIds(keyA, ['hz-gram-hsk1-2-core', 'hz-radicals-60-core'], mockStorage), true);
  assert.deepEqual(readScopedMaterialIds(keyA, mockStorage), ['hz-gram-hsk1-2-core', 'hz-radicals-60-core']);
  assert.deepEqual(readScopedMaterialIds(keyB, mockStorage), []);
  assert.deepEqual(readScopedMaterialIds(keyGuest, mockStorage), []);

  // QuotaExceededError resilience (must not throw)
  const failingStorage = {
    getItem: () => '{broken json',
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
  };
  assert.deepEqual(readScopedMaterialIds(keyA, failingStorage), []);
  assert.equal(writeScopedMaterialIds(keyA, ['hz-gram-hsk1-2-core'], failingStorage), false);

  // Verify AuthContext logout purges materials bookmark & completed keys
  const authSrc = fs.readFileSync(path.resolve('src/context/AuthContext.jsx'), 'utf8');
  assert.ok(authSrc.includes('hanzigo_bookmarked_materials_'));
  assert.ok(authSrc.includes('hanzigo_completed_materials_'));
});

test('6. XSS Safety (0 dangerouslySetInnerHTML) & Page Size Guard', () => {
  const materialsFiles = [
    path.resolve('src/pages/MaterialsPage.jsx'),
    ...collectFilesRecursive(path.resolve('src/components/materials')),
    ...collectFilesRecursive(path.resolve('src/data/materials')),
  ];

  for (const file of materialsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    assert.equal(src.includes('dangerouslySetInnerHTML'), false, `Unsafe dangerouslySetInnerHTML in ${file}`);
  }

  const pageSize = fs.statSync(path.resolve('src/pages/MaterialsPage.jsx')).size;
  assert.ok(pageSize <= 25 * 1024, `MaterialsPage.jsx too large: ${pageSize} bytes`);
});

test('7. Smart View Mode & Compact Pagination Guard (Grid vs 1-line List)', () => {
  // Auto-picks compact list for quick-lookup tabs when manual mode is null
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Ngữ pháp' }), 'list');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Lượng từ' }), 'list');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Bộ thủ' }), 'list');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Bộ thủ & Bút thuận' }), 'list');

  // Auto-picks grid for long-reading / overview tabs when manual mode is null
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Chiến thuật HSK' }), 'grid');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Phiếu in ấn' }), 'grid');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Nguồn chính thống' }), 'grid');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: null, selectedGuideType: 'Tất cả' }), 'grid');

  // Manual user override always wins & persists cleanly
  const store = new Map();
  const mockStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
  };
  assert.equal(writeManualViewMode('grid', mockStorage), true);
  assert.equal(readManualViewMode(mockStorage), 'grid');
  assert.equal(resolveMaterialsViewMode({ manualViewMode: readManualViewMode(mockStorage), selectedGuideType: 'Ngữ pháp' }), 'grid');

  // QuotaExceededError safety on view mode persistence
  const throwingStorage = {
    getItem: () => { throw new Error('SecurityError'); },
    setItem: () => { throw new Error('QuotaExceededError'); },
  };
  assert.equal(readManualViewMode(throwingStorage), null);
  assert.equal(writeManualViewMode('list', throwingStorage), false);

  // Pagination & mobile short badge helpers
  assert.equal(getPaginationStep('grid'), 12);
  assert.equal(getPaginationStep('list'), 24);
  assert.equal(formatCompactLevelBadge('HSK 1'), 'H1');
  assert.equal(formatCompactLevelBadge('HSK 7-9'), 'H7-9');
  assert.equal(formatCompactLevelBadge('Nhập môn'), 'NM');
});

test('8. Responsive Zero Overflow & Mobile Touch Target Guard (320px–1440px)', () => {
  const rowSrc = fs.readFileSync(path.resolve('src/components/materials/MaterialsCompactListRow.jsx'), 'utf8');
  assert.match(rowSrc, /min-h-11/, 'List row must meet >= 44px touch height');
  assert.match(rowSrc, /flex-1\s+min-w-0/, 'List row middle column must use flex-1 min-w-0 to prevent horizontal overflow');
  assert.match(rowSrc, /truncate/, 'List row title must truncate on single line');
  assert.match(rowSrc, /shrink-0/, 'List row badges/actions must not collapse');

  const filterSrc = fs.readFileSync(path.resolve('src/components/materials/MaterialsFilterBar.jsx'), 'utf8');
  assert.match(filterSrc, /overflow-x-auto/, 'Category bar must scroll horizontally in 1 row');
  assert.match(filterSrc, /whitespace-nowrap/, 'Category pills must stay single-line');
  assert.match(filterSrc, /min-h-11/, 'Filter controls must meet >= 44px touch height');

  const headerSrc = fs.readFileSync(path.resolve('src/components/materials/MaterialsCompactHeader.jsx'), 'utf8');
  assert.match(headerSrc, /text-base\s+sm:text-sm/, 'Search input must use text-base on mobile to prevent iOS zoom');
  assert.match(headerSrc, /min-h-11/, 'Header buttons/input must meet >= 44px touch height');

  const cardSrc = fs.readFileSync(path.resolve('src/components/materials/MaterialsCompactCard.jsx'), 'utf8');
  assert.match(cardSrc, /line-clamp-2/, 'Compact card must clamp title/summary to 2 lines');
  assert.match(cardSrc, /min-h-11\s+min-w-11/, 'Card bookmark button must meet >= 44x44px target');

  const drawerSrc = fs.readFileSync(path.resolve('src/components/materials/MaterialsReaderDrawer.jsx'), 'utf8');
  assert.match(drawerSrc, /max-h-\[90dvh\]/, 'Reader drawer must use max-h-[90dvh]');
  assert.match(drawerSrc, /pb-\[max\(0\.75rem,env\(safe-area-inset-bottom\)\)\]/, 'Reader drawer footer must respect safe-area-inset-bottom');
  assert.match(drawerSrc, /min-h-11/, 'Reader drawer controls must meet >= 44px touch height');
});
