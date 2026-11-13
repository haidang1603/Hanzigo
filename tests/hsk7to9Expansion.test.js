import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

global.localStorage = createMemoryStorage();
global.sessionStorage = createMemoryStorage();

const {
  HSK_7_9_STANDARD_SPEC,
  HSK_7_9_VOCABULARY,
  HSK_7_9_GRAMMAR,
  HSK_7_9_SYNONYM_GROUPS,
  HSK_7_9_MODULES,
  lookupHsk7to9OrCedict,
  exportHskAdvancedItemToSrs,
} = await import('../src/data/hsk7to9CurriculumData.ts');

const { getStoredRetentionCards } = await import(
  '../src/services/srsRetentionService.ts'
);
const { getPendingLearningEvents, configureLearningDataService } = await import(
  '../src/services/learningDataService.ts'
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.06: HSK 7-9 Curriculum Expansion', () => {
  const user = { id: '11111111-1111-4111-8111-111111111111' };

  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
    configureLearningDataService({ flushDebounceMs: 60000 });
  });

  it('aligns with official HSK 7-9 standard (5,636 words) across all 4 domains', () => {
    assert.equal(HSK_7_9_STANDARD_SPEC.targetAdvancedVocabCount, 5636);
    assert.equal(HSK_7_9_STANDARD_SPEC.domains.length, 4);

    const entryTypes = new Set(HSK_7_9_VOCABULARY.map((v) => v.entryType));
    assert.ok(entryTypes.has('chengyu_idiom'));
    assert.ok(entryTypes.has('classical_pattern'));
    assert.ok(entryTypes.has('domain_term'));
  });

  it('provides long-form HSK 7-9 modules across Academic, Business, and Cultural domains', () => {
    const domains = HSK_7_9_MODULES.map((m) => m.domain);
    assert.ok(domains.includes('academic'));
    assert.ok(domains.includes('business_economics'));
    assert.ok(domains.includes('culture_law'));

    HSK_7_9_MODULES.forEach((mod) => {
      assert.ok(mod.charCount >= 800, `Expected >= 800 chars for ${mod.id}`);
      assert.ok(mod.paragraphs.length >= 3);
      mod.paragraphs.forEach((p) => {
        assert.ok(p.zh.length > 50);
        assert.ok(p.vi.length > 50);
      });
      assert.ok(mod.rhetoricalDevices.length >= 1);
    });

    assert.ok(HSK_7_9_GRAMMAR.length >= 3);
    assert.ok(HSK_7_9_SYNONYM_GROUPS.length >= 2);
  });

  it('supports instant HSK 7-9 / CC-CEDICT lookup and one-click SRS deck export with telemetry', async () => {
    const hit = await lookupHsk7to9OrCedict('相辅相成');
    assert.ok(hit);
    assert.equal(hit.source, 'hsk_7_9_domain');
    assert.equal(hit.hskBand, 7);
    assert.equal(hit.connotationLabelZh, '褒义');

    const targetVocab = HSK_7_9_VOCABULARY[0];
    const exported = await exportHskAdvancedItemToSrs(targetVocab, user);
    assert.equal(exported.exported, true);

    // 1. Legacy SRS review list compatibility
    const reviewRaw = global.localStorage.getItem(`hanzigo_vocab_review_${user.id}`);
    assert.ok(reviewRaw);
    assert.ok(JSON.parse(reviewRaw).includes(targetVocab.id));

    // 2. Task 26.03 SRS Retention metadata compatibility
    const retentionCards = getStoredRetentionCards(user);
    assert.ok(retentionCards[targetVocab.id]);
    assert.equal(retentionCards[targetVocab.id].hskLevel, 7);

    // 3. Task 26.01 Telemetry tracking compatibility
    const events = getPendingLearningEvents();
    assert.ok(
      events.some(
        (e) =>
          e.source_module === 'lesson' &&
          e.hsk_level === 7 &&
          e.item_id === targetVocab.id
      )
    );
  });

  it('SQL migration and UI components implement HSK 7-9 schema and Band Switcher', () => {
    const sql = fs.readFileSync(
      path.join(projectRoot, 'supabase/migrations/20261112_hsk7_9_curriculum_expansion.sql'),
      'utf8'
    );
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.hsk_advanced_vocabulary/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.hsk_advanced_grammar/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.hsk_advanced_modules/);

    const advUi = fs.readFileSync(
      path.join(projectRoot, 'src/features/curriculum/HskAdvancedModule.tsx'),
      'utf8'
    );
    assert.match(advUi, /Register & Nuance Comparison Cards/);
    assert.match(advUi, /Export to SRS Deck/);

    const roadmapUi = fs.readFileSync(
      path.join(projectRoot, 'src/pages/RoadmapPage.jsx'),
      'utf8'
    );
    assert.match(roadmapUi, /Foundation-Intermediate \(HSK 1–6\)/);
    assert.match(roadmapUi, /Advanced Professional Band \(HSK 7–9/);
  });
});

