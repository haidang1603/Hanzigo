import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK6_ERROR_TAXONOMY,
  HSK6_READING_DURATION_SECONDS,
  HSK6_WRITING_DURATION_SECONDS,
  SAMPLE_HSK6_FAULTY_QUESTIONS,
  SAMPLE_HSK6_SUMMARY_PASSAGE,
  createInitialSummaryState,
  computePhaseRemainingSeconds,
  normalizeSummaryPhaseState,
  transitionToWritingPhase,
  transitionToSubmittedPhase,
  loadPersistedSummaryState,
  clearPersistedSummaryState,
  countChineseSummaryChars,
  detectDirectQuotes,
} from '../src/features/hsk-exam/renderers/hsk6/hsk6StateMachine.ts';

test('HSK6_ERROR_TAXONOMY defines all 8 classic HSK 6 faulty sentence categories', () => {
  const keys = Object.keys(HSK6_ERROR_TAXONOMY);
  assert.equal(keys.length, 8);
  assert.ok(keys.includes('搭配不当'));
  assert.ok(keys.includes('成分残缺或赘余'));
  assert.ok(keys.includes('语序不当'));
  assert.ok(keys.includes('结构混乱/句式杂糅'));
  assert.ok(keys.includes('表意不明/歧义'));
  assert.ok(keys.includes('不合逻辑'));
});

test('Two-phase state machine enforces 10-min reading and 35-min writing anti-cheat transitions on reload', () => {
  const t0 = 1_700_000_000_000;
  const initial = createInitialSummaryState('attempt-1', t0);
  assert.equal(initial.phase, 'READING_ONLY');
  assert.equal(computePhaseRemainingSeconds(initial, t0), HSK6_READING_DURATION_SECONDS);
  assert.equal(computePhaseRemainingSeconds(initial, t0 + 120_000), 480);

  // Simulate F5 reload after 11 minutes (660s): should auto-transition to WRITING_ONLY with 34 min left
  const after11Min = normalizeSummaryPhaseState(initial, t0 + 660_000);
  assert.equal(after11Min.phase, 'WRITING_ONLY');
  assert.equal(after11Min.phase_started_at, t0 + HSK6_READING_DURATION_SECONDS * 1000);
  assert.equal(
    computePhaseRemainingSeconds(after11Min, t0 + 660_000),
    HSK6_WRITING_DURATION_SECONDS - 60
  );

  // Simulate reload after 46 minutes: should auto-transition to SUBMITTED
  const after46Min = normalizeSummaryPhaseState(initial, t0 + 46 * 60_000);
  assert.equal(after46Min.phase, 'SUBMITTED');
  assert.equal(computePhaseRemainingSeconds(after46Min, t0 + 46 * 60_000), 0);
});

test('Early advance and persistence keep phase state across reloads', () => {
  const storageKey = 'test_hsk6_summary_key';
  clearPersistedSummaryState(storageKey);

  const t0 = 1_700_000_000_000;
  const loaded1 = loadPersistedSummaryState(storageKey, 'a1', t0);
  assert.equal(loaded1.phase, 'READING_ONLY');

  const writing = transitionToWritingPhase(loaded1, t0 + 180_000);
  assert.equal(writing.phase, 'WRITING_ONLY');
  assert.equal(writing.reading_ended_at, t0 + 180_000);

  const submitted = transitionToSubmittedPhase(writing, t0 + 500_000);
  assert.equal(submitted.phase, 'SUBMITTED');
  clearPersistedSummaryState(storageKey);
});

test('countChineseSummaryChars and detectDirectQuotes validate 缩写 rules', () => {
  const sampleChars = countChineseSummaryChars(SAMPLE_HSK6_SUMMARY_PASSAGE.paragraphs.join(''));
  assert.ok(sampleChars > 700);

  assert.equal(countChineseSummaryChars('时间医生\n 陈伯 住在 江南。'), 11);

  const quotes = detectDirectQuotes('陈伯笑着说：“我不修，谁来修呢？”');
  assert.ok(quotes.length > 0);
  assert.deepEqual(detectDirectQuotes('陈伯笑着表示如果自己不修就没有人修了。'), []);
});

test('SAMPLE_HSK6_FAULTY_QUESTIONS include correction segments and taxonomy metadata', () => {
  assert.ok(SAMPLE_HSK6_FAULTY_QUESTIONS.length >= 3);
  for (const q of SAMPLE_HSK6_FAULTY_QUESTIONS) {
    assert.ok(HSK6_ERROR_TAXONOMY[q.error_type]);
    assert.ok(q.correction_segments.some((s) => s.kind === 'delete' || s.kind === 'insert'));
  }
});

