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
  SOURCE_MODULES,
  ERROR_CATEGORIES,
  normalizeLearningEvent,
  classifyLearningError,
  recordLearningEvent,
  getPendingLearningEvents,
  getLocalMistakeRecords,
  updateMistakeResolvedStatus,
  configureLearningDataService,
} = await import('../src/services/learningDataService.ts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Task 26.01: Learning Data Foundation', () => {
  const validUserId = '11111111-1111-4111-8111-111111111111';

  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
    configureLearningDataService({ flushDebounceMs: 60000 });
  });

  it('normalizes events from all 5 source_module types', () => {
    const cases = [
      { sourceModule: 'lesson', hskLevel: 'HSK 2', itemId: 'lesson_2_1', expectedSkill: 'reading', isCorrect: true },
      { sourceModule: 'srs_review', hskLevel: 3, itemId: 'vocab_301', expectedSkill: 'vocabulary', isCorrect: false },
      { sourceModule: 'hanzi_writer', hskLevel: 1, itemId: 'char_好', expectedSkill: 'stroke_order', isCorrect: false },
      { sourceModule: 'cbt_mock_exam', hskLevel: 4, itemId: 'hsk4_q12', expectedSkill: 'reading', scoreEarned: 1, scoreMax: 1 },
      { sourceModule: 'writing_eval', hskLevel: 12, itemId: 'essay_5', expectedSkill: 'writing', scoreEarned: 8, scoreMax: 10 },
    ];

    assert.equal(SOURCE_MODULES.length, 5);

    cases.forEach((tc) => {
      const normalized = normalizeLearningEvent({
        userId: validUserId,
        sourceModule: tc.sourceModule,
        hskLevel: tc.hskLevel,
        itemId: tc.itemId,
        isCorrect: tc.isCorrect,
        scoreEarned: tc.scoreEarned,
        scoreMax: tc.scoreMax,
        durationMs: -50,
      });

      assert.equal(normalized.source_module, tc.sourceModule);
      assert.equal(normalized.skill_domain, tc.expectedSkill);
      assert.equal(normalized.item_id, tc.itemId);
      assert.ok(normalized.hsk_level >= 1 && normalized.hsk_level <= 9);
      assert.equal(normalized.duration_ms, 0);
      assert.ok(normalized.session_id);
      assert.ok(normalized.created_at);
    });

    assert.throws(() =>
      normalizeLearningEvent({ sourceModule: 'unknown_mod', itemId: 'x' })
    );
    assert.throws(() =>
      normalizeLearningEvent({ sourceModule: 'lesson', itemId: '   ' })
    );
  });

  it('classifies errors accurately into all 7 error_category types', () => {
    assert.equal(ERROR_CATEGORIES.length, 7);

    // 1. radical_stroke_error
    const strokeErr = classifyLearningError({
      sourceModule: 'hanzi_writer',
      hskLevel: 1,
      itemId: 'char_谢',
      isCorrect: false,
      userAnswer: { totalMistakes: 3 },
      expectedAnswer: { character: '谢', strokes: 12 },
      payload: { strokeMistakes: 3 },
    });
    assert.equal(strokeErr?.error_category, 'radical_stroke_error');

    // 2. tone_confusion
    const toneErr = classifyLearningError({
      sourceModule: 'srs_review',
      skillDomain: 'vocabulary',
      hskLevel: 1,
      itemId: 'vocab_ma',
      isCorrect: false,
      userAnswer: 'mǎ',
      expectedAnswer: 'mā',
    });
    assert.equal(toneErr?.error_category, 'tone_confusion');

    // 3. listening_homophone
    const listeningErr = classifyLearningError({
      sourceModule: 'cbt_mock_exam',
      skillDomain: 'listening',
      hskLevel: 2,
      itemId: 'hsk2_l_05',
      isCorrect: false,
      userAnswer: '知道',
      expectedAnswer: '迟到',
      payload: { isHomophone: true },
    });
    assert.equal(listeningErr?.error_category, 'listening_homophone');

    // 4. word_order_syntax
    const orderErr = classifyLearningError({
      sourceModule: 'lesson',
      skillDomain: 'reading',
      hskLevel: 3,
      itemId: 'grammar_ba_1',
      isCorrect: false,
      userAnswer: '我 书 把 看了',
      expectedAnswer: '我 把 书 看了',
    });
    assert.equal(orderErr?.error_category, 'word_order_syntax');

    // 5. translation_omission
    const translationErr = classifyLearningError({
      sourceModule: 'writing_eval',
      skillDomain: 'translation',
      hskLevel: 4,
      itemId: 'trans_4_02',
      isCorrect: false,
      userAnswer: 'Tôi đi Bắc Kinh.',
      expectedAnswer: 'Ngày mai tôi đi Bắc Kinh bằng tàu cao tốc.',
      payload: { missingKeywords: ['ngày mai', 'tàu cao tốc'] },
    });
    assert.equal(translationErr?.error_category, 'translation_omission');

    // 6. synonym_nuance
    const synonymErr = classifyLearningError({
      sourceModule: 'srs_review',
      skillDomain: 'vocabulary',
      hskLevel: 4,
      itemId: 'vocab_gangcai',
      isCorrect: false,
      userAnswer: '刚才',
      expectedAnswer: '刚刚',
      payload: { isSynonymTrap: true },
    });
    assert.equal(synonymErr?.error_category, 'synonym_nuance');

    // 7. reading_inference
    const readingErr = classifyLearningError({
      sourceModule: 'cbt_mock_exam',
      skillDomain: 'reading',
      hskLevel: 5,
      itemId: 'hsk5_r_18',
      isCorrect: false,
      userAnswer: 'B',
      expectedAnswer: 'D',
    });
    assert.equal(readingErr?.error_category, 'reading_inference');

    // Correct answer -> null
    const noErr = classifyLearningError({
      sourceModule: 'cbt_mock_exam',
      skillDomain: 'reading',
      hskLevel: 5,
      itemId: 'hsk5_r_19',
      isCorrect: true,
    });
    assert.equal(noErr, null);
  });

  it('queues events offline, increments occurrence_count on repeat mistakes, and updates resolved_status', async () => {
    const first = await recordLearningEvent({
      userId: validUserId,
      sourceModule: 'hanzi_writer',
      hskLevel: 2,
      itemId: 'char_问',
      isCorrect: false,
      payload: { strokeMistakes: 2 },
    });

    assert.equal(first.queuedOffline, true);
    assert.ok(first.mistakeRecord);
    assert.equal(first.mistakeRecord.occurrence_count, 1);
    assert.equal(first.mistakeRecord.resolved_status, 'active');

    const second = await recordLearningEvent({
      userId: validUserId,
      sourceModule: 'hanzi_writer',
      hskLevel: 2,
      itemId: 'char_问',
      isCorrect: false,
      payload: { strokeMistakes: 1 },
    });

    assert.equal(second.mistakeRecord?.occurrence_count, 2);
    assert.equal(getPendingLearningEvents().length, 2);
    assert.equal(getLocalMistakeRecords(validUserId).length, 1);

    const updated = await updateMistakeResolvedStatus(
      'char_问',
      'radical_stroke_error',
      'mastered',
      validUserId
    );
    assert.equal(updated, true);
    assert.equal(getLocalMistakeRecords(validUserId)[0].resolved_status, 'mastered');
  });

  it('migration SQL defines required tables, enums, composite indexes, and RLS policies', () => {
    const sqlPath = path.join(
      projectRoot,
      'supabase/migrations/20261112_learning_data_foundation.sql'
    );
    const sql = fs.readFileSync(sqlPath, 'utf8');

    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.learning_telemetry_events/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_mistake_records/);
    assert.match(sql, /CREATE TYPE public\.learning_source_module AS ENUM/);
    assert.match(sql, /CREATE TYPE public\.learning_skill_domain AS ENUM/);
    assert.match(sql, /CREATE TYPE public\.learning_error_category AS ENUM/);
    assert.match(sql, /CREATE TYPE public\.learning_resolved_status AS ENUM/);
    assert.match(sql, /ON public\.learning_telemetry_events \(user_id, created_at DESC\)/);
    assert.match(sql, /ON public\.user_mistake_records \(user_id, error_category, resolved_status\)/);
    assert.match(sql, /auth\.uid\(\) = user_id/);
    assert.match(sql, /upsert_user_mistake_record/);
  });
});

