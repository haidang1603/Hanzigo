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
  getAdaptiveSignals,
  recordAdaptiveMistake,
  markAdaptiveItemMastered,
  setAdaptiveNavigationTarget,
  consumeAdaptiveNavigationTarget,
  buildAdaptiveReviewQueue,
} = await import('../src/services/adaptiveLearningService.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Adaptive Learning Engine', () => {
  const testUser = { id: 'learner_adaptive_1' };

  beforeEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
  });

  it('recordAdaptiveMistake logs mistakes, increments errorCount, and sets needs_review', () => {
    const first = recordAdaptiveMistake({
      user: testUser,
      source: 'grammar',
      skill: 'grammar',
      level: 'HSK 2',
      targetRef: 'grammar_2_0',
      title: 'Cấu trúc 比 (so sánh)',
      detail: 'Chọn sai trật tự câu so sánh',
    });

    assert.ok(first);
    assert.equal(first.errorCount, 1);
    assert.equal(first.status, 'needs_review');

    const second = recordAdaptiveMistake({
      user: testUser,
      source: 'grammar',
      skill: 'grammar',
      level: 'HSK 2',
      targetRef: 'grammar_2_0',
      title: 'Cấu trúc 比 (so sánh)',
    });

    assert.equal(second.errorCount, 2);
    assert.equal(second.status, 'needs_review');
    assert.equal(getAdaptiveSignals(testUser).length, 1);
  });

  it('markAdaptiveItemMastered resolves item and removes it from buildAdaptiveReviewQueue', async () => {
    recordAdaptiveMistake({
      user: testUser,
      source: 'listening',
      skill: 'listening',
      level: 'HSK 1',
      targetRef: 'listening_1_1',
      title: 'Nghe hiểu bài 2',
    });

    let result = await buildAdaptiveReviewQueue(testUser);
    assert.equal(result.totalPendingCount, 1);
    assert.equal(result.skillGapSummary.listening, 1);

    const marked = markAdaptiveItemMastered({
      user: testUser,
      source: 'listening',
      targetRef: 'listening_1_1',
    });
    assert.equal(marked, true);

    result = await buildAdaptiveReviewQueue(testUser);
    assert.equal(result.totalPendingCount, 0);
    assert.equal(result.hasAnyGaps, false);
  });

  it('buildAdaptiveReviewQueue aggregates pronunciation history fallback, SRS review, and sorts by priority', async () => {
    // 1. Direct adaptive mistake (errorCount = 3 -> high priority)
    for (let i = 0; i < 3; i += 1) {
      recordAdaptiveMistake({
        user: testUser,
        source: 'grammar',
        skill: 'grammar',
        level: 'HSK 3',
        targetRef: 'grammar_3_2',
        title: 'Câu chữ 把',
      });
    }

    // 2. Pronunciation history fallback (< 65 score)
    global.localStorage.setItem(
      `hanzigo_pronounce_history_${testUser.id}`,
      JSON.stringify([
        {
          target: '谢谢',
          pinyin: 'xièxie',
          meaning: 'cảm ơn',
          overall: 52,
          toneScore: 48,
          timestamp: new Date().toISOString(),
        },
        {
          target: '你好',
          pinyin: 'nǐ hǎo',
          meaning: 'xin chào',
          overall: 88,
          toneScore: 90,
          timestamp: new Date().toISOString(),
        },
      ])
    );

    // 3. SRS vocabulary review fallback
    global.localStorage.setItem(
      `hanzigo_vocab_review_${testUser.id}`,
      JSON.stringify(['v1'])
    );

    const result = await buildAdaptiveReviewQueue(testUser);
    assert.ok(result.totalPendingCount >= 2);
    assert.equal(result.hasAnyGaps, true);
    assert.equal(result.skillGapSummary.grammar, 1);
    assert.equal(result.skillGapSummary.pronunciation, 1);

    // Highest errorCount item should appear first
    assert.equal(result.queue[0].source, 'grammar');
    assert.equal(result.queue[0].targetRef, 'grammar_3_2');
    assert.ok(result.queue[0].priorityScore >= result.queue[1].priorityScore);

    // Passing pronunciation (88 >= 65) must NOT appear in queue
    const hasNiHao = result.queue.some((q) => q.targetRef === '你好');
    assert.equal(hasNiHao, false);
  });

  it('setAdaptiveNavigationTarget & consumeAdaptiveNavigationTarget work as one-shot deep-links', () => {
    setAdaptiveNavigationTarget({
      targetTab: 'practice',
      source: 'grammar',
      levelNum: 2,
      targetRef: 'grammar_2_1',
    });

    // Wrong tab does not consume
    assert.equal(consumeAdaptiveNavigationTarget('pronunciation'), null);

    // Matching tab consumes once
    const consumed = consumeAdaptiveNavigationTarget('practice');
    assert.ok(consumed);
    assert.equal(consumed.levelNum, 2);
    assert.equal(consumed.targetRef, 'grammar_2_1');

    // Second read returns null
    assert.equal(consumeAdaptiveNavigationTarget('practice'), null);
  });

  it('UI pages and widget integrate adaptive learning hooks', () => {
    const practiceSrc = fs.readFileSync(path.join(projectRoot, 'src/pages/PracticePage.jsx'), 'utf8');
    const pronounceSrc = fs.readFileSync(path.join(projectRoot, 'src/pages/PronunciationPage.jsx'), 'utf8');
    const widgetSrc = fs.readFileSync(
      path.join(projectRoot, 'src/components/learning/AiLearningCoachWidget.jsx'),
      'utf8'
    );

    assert.match(practiceSrc, /consumeAdaptiveNavigationTarget/);
    assert.match(practiceSrc, /recordAdaptiveMistake/);
    assert.match(practiceSrc, /markAdaptiveItemMastered/);

    assert.match(pronounceSrc, /recordAdaptiveMistake/);
    assert.match(pronounceSrc, /markAdaptiveItemMastered/);

    assert.match(widgetSrc, /buildAdaptiveReviewQueue/);
    assert.match(widgetSrc, /setAdaptiveNavigationTarget/);
    assert.match(widgetSrc, /Hàng đợi Ôn tập Thích ứng/);
  });
});
