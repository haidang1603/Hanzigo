import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK6_ERROR_TAXONOMY,
  HSK6_READING_DURATION_SECONDS,
  HSK6_WRITING_DURATION_SECONDS,
  HSK6_SUMMARY_PASSAGES,
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
import { getFullExamById, getSanitizedExamForTaking } from '../src/data/hskExamsData.js';
import {
  HSKK_FULL_EXAMS,
  HSKK_OFFICIAL_SPEC,
  HSKK_SAMPLE_QUESTIONS,
  gradeHskkSpeakingResponse,
} from '../src/features/hskk-exam/hskkEngine.ts';

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

test('SAMPLE_HSK6_FAULTY_QUESTIONS has full 10 items (51-60) and HSK6_SUMMARY_PASSAGES has 3 full passages', () => {
  assert.equal(SAMPLE_HSK6_FAULTY_QUESTIONS.length, 10);
  const qNums = SAMPLE_HSK6_FAULTY_QUESTIONS.map((q) => q.question_number);
  assert.deepEqual(qNums, [51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);

  const errorTypesCovered = new Set(SAMPLE_HSK6_FAULTY_QUESTIONS.map((q) => q.error_type));
  assert.equal(errorTypesCovered.size, 8, 'All 8 official HSK 6 error categories must be covered');

  for (const q of SAMPLE_HSK6_FAULTY_QUESTIONS) {
    assert.ok(HSK6_ERROR_TAXONOMY[q.error_type]);
    assert.ok(q.correction_segments.some((s) => s.kind === 'delete' || s.kind === 'insert'));
  }

  assert.equal(HSK6_SUMMARY_PASSAGES.length, 3);
  for (const p of HSK6_SUMMARY_PASSAGES) {
    assert.ok(countChineseSummaryChars(p.paragraphs.join('')) >= 900);
  }
});

test('Full 101-question HSK 6 mock exam matches official CTI 50+50+1 structure and sanitizes answers', () => {
  const full = getFullExamById('hsk6-full-101-01');
  assert.ok(full);
  assert.equal(full.duration_minutes, 140);
  assert.equal(full.total_questions, 101);
  assert.equal(full.questions.length, 101);
  assert.equal(full.questions.filter((q) => q.part_type === 'listening').length, 50);
  assert.equal(full.questions.filter((q) => q.part_type === 'reading').length, 50);
  assert.equal(full.questions.filter((q) => q.part_type === 'writing').length, 1);

  const sanitized = getSanitizedExamForTaking('hsk6-full-101-01');
  assert.ok(sanitized);
  assert.equal(sanitized.questions.length, 101);
  const q101 = sanitized.questions.find((q) => q.question_number === 101);
  assert.equal(q101.question_type, 'essay_summary');
  assert.ok(Array.isArray(q101.summary_passage_paragraphs) && q101.summary_passage_paragraphs.length >= 6);
  assert.equal(q101.sample_answer, undefined);
});

test('HSKK Full Exams match official counts (27/14/6), cover all 3 parts per level, and support real F0 pitch', () => {
  assert.equal(HSKK_FULL_EXAMS.beginner.length, HSKK_OFFICIAL_SPEC.beginner.totalQuestions);
  assert.equal(HSKK_FULL_EXAMS.intermediate.length, HSKK_OFFICIAL_SPEC.intermediate.totalQuestions);
  assert.equal(HSKK_FULL_EXAMS.advanced.length, HSKK_OFFICIAL_SPEC.advanced.totalQuestions);

  (['beginner', 'intermediate', 'advanced']).forEach((lvl) => {
    const sampleParts = new Set(HSKK_SAMPLE_QUESTIONS[lvl].map((q) => q.partNumber));
    assert.deepEqual([...sampleParts].sort(), [1, 2, 3], `Quick sample for ${lvl} must cover parts 1, 2, 3`);
  });

  const readAloudQ = HSKK_FULL_EXAMS.advanced.find((q) => q.taskType === 'read_aloud');
  assert.ok(readAloudQ);
  const res = gradeHskkSpeakingResponse(readAloudQ, readAloudQ.promptZh, [3.2, 3.5, 4.1, 2.8, 3.0]);
  assert.equal(res.usedRealPitch, true);
  assert.ok(res.score > 50);
});

