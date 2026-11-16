import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  getLessonById,
  getUserJourneyProgress,
  completeLesson,
  getLessonNodeStatus,
} from '../src/services/learningPathService.js';
import { LEARNING_LESSONS } from '../src/data/learningPathData.js';
import {
  saveWordToDeck,
  getSavedDeckWords,
} from '../src/services/dictionaryService.ts';
import {
  getExamForTaking,
  saveTemporaryAnswers,
  getTemporaryExamSession,
  submitExamAttempt,
  getMistakeNotebook,
} from '../src/services/hskService.js';
import { calculateHskCbtScore } from '../src/utils/examScoringEngine.js';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

test('Loop 1: Roadmap <-> Lesson resolves all 120 lessons and syncs hanzigo_roadmap_120_progress_v1 immediately on Quiz >= 75%', () => {
  localStorage.clear();

  // Check sequential IDs 1..120, lesson-1..lesson-120, and native IDs l-101..l-620
  assert.equal(LEARNING_LESSONS.length, 120);
  for (let i = 1; i <= 120; i += 1) {
    const expected = LEARNING_LESSONS[i - 1];
    assert.equal(getLessonById(String(i))?.id, expected.id);
    assert.equal(getLessonById(`lesson-${i}`)?.id, expected.id);
    assert.equal(getLessonById(expected.id)?.id, expected.id);
  }

  // Simulate passing Quiz (>= 75%) in InteractiveLessonPlayer on lesson 1
  const res = completeLesson('l-101', 75, null);
  assert.equal(res.passed, true);

  const rawRoadmap120 = localStorage.getItem('hanzigo_roadmap_120_progress_v1');
  assert.ok(rawRoadmap120, 'hanzigo_roadmap_120_progress_v1 must be written synchronously');
  const parsedRoadmap120 = JSON.parse(rawRoadmap120);
  assert.ok(parsedRoadmap120.completedLessons['l-101'], 'l-101 should be marked completed in hanzigo_roadmap_120_progress_v1');
  assert.equal(parsedRoadmap120.completedLessons['l-101'].score, 75);

  const progress = getUserJourneyProgress(null);
  assert.equal(getLessonNodeStatus('l-101', progress), 'completed');
  assert.equal(getLessonNodeStatus('l-102', progress), 'in_progress');
});

test('Loop 1: URL routing in App.jsx & LessonPage.jsx preserves /lesson?id=... parameter', () => {
  const appSrc = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
  const lessonPageSrc = fs.readFileSync(path.resolve('src/pages/LessonPage.jsx'), 'utf8');

  assert.ok(appSrc.includes("path === 'lesson'"));
  assert.ok(appSrc.includes('searchLessonId'));
  assert.ok(lessonPageSrc.includes("hashParams.get('id') || searchParams.get('id')"));
});

test('Loop 2: Selection bar mobile clamping + touch support and guest duplicate-safe saveWordToDeck', async () => {
  localStorage.clear();

  const barSrc = fs.readFileSync(
    path.resolve('src/features/unified-ecosystem/GlobalTextSelectionActionBar.tsx'),
    'utf8'
  );
  assert.ok(barSrc.includes("document.addEventListener('touchend'"));
  assert.ok(barSrc.includes('window.innerHeight - 64'));
  assert.ok(barSrc.includes('max-w-[calc(100vw-24px)]'));

  const ctxSrc = fs.readFileSync(
    path.resolve('src/core/ecosystem/UnifiedToolsContext.tsx'),
    'utf8'
  );
  assert.ok(ctxSrc.includes('persistLocalFallback'));

  const sampleEntry = {
    id: 'dict-jianchi',
    simplified: '坚持',
    traditional: '堅持',
    pinyin_display: 'jiān chí',
    pinyin_numeric: 'jian1 chi2',
    pinyin_clean: 'jianchi',
    han_viet: 'KIÊN TRÌ',
    hsk_2_level: 4,
    hsk_3_level: 3,
    frequency_rank: 620,
    pos_meanings: [{ pos: 'v', definitions_vi: ['kiên trì'] }],
  };

  // First save in guest mode
  const r1 = await saveWordToDeck(sampleEntry, null);
  assert.equal(r1.saved, true);
  // Second save of the same existing word must deduplicate
  const r2 = await saveWordToDeck(sampleEntry, null);
  assert.equal(r2.totalSaved, r1.totalSaved);
  assert.equal(getSavedDeckWords(null).filter((w) => w === '坚持').length, 1);
});

test('Loop 3: HSK CBT auto-save with timer restore, 200/300 scoring, and mistake notebook review', async () => {
  localStorage.clear();

  const exam = await getExamForTaking('hsk1-mock-01');
  assert.ok(exam.questions.length > 0);

  // Simulate user answering Q1 and saving draft with remaining time 1845s before F5 reload
  const q1 = exam.questions[0];
  saveTemporaryAnswers(
    exam.id,
    { [q1.id]: 0 },
    { flaggedQuestionIds: [q1.id], examMode: 'simulation', currentIdx: 2, timeLeft: 1845, timeSpentSeconds: 555 }
  );

  const restored = getTemporaryExamSession(exam.id);
  assert.equal(restored.answers[q1.id], 0);
  assert.equal(restored.timeLeft, 1845);
  assert.equal(restored.timeSpentSeconds, 555);

  // Submit attempt and verify 200/300 scale scoring + section counts + mistakes
  const attempt = await submitExamAttempt({
    examId: exam.id,
    submittedAnswers: { [q1.id]: 0 },
    timeSpentSeconds: 555,
    user: null,
    examMode: 'simulation',
  });

  assert.equal(attempt.maxScore, 200);
  assert.ok(attempt.sectionsBreakdown);
  for (const sec of Object.values(attempt.sectionsBreakdown)) {
    assert.equal(typeof sec.correct, 'number');
    assert.equal(typeof sec.total, 'number');
  }

  // Verify score engine supports 300 scale for HSK 3-6
  const hsk4Score = calculateHskCbtScore({
    level: 'HSK 4',
    questions: [
      { id: 'l1', section: 'listening', correct_option_index: 0, points: 10 },
      { id: 'r1', section: 'reading', correct_option_index: 1, points: 10 },
      { id: 'w1', section: 'writing', correct_option_index: 0, points: 10 },
    ],
  }, { l1: 0, r1: 1, w1: 0 }, 120);
  assert.equal(hsk4Score.maxScore, 300);
  assert.equal(hsk4Score.totalScore, 300);
  assert.equal(hsk4Score.passed, true);

  // Verify mistake notebook recorded incorrect/unanswered items after submit
  const mistakes = await getMistakeNotebook({ user: null });
  assert.ok(mistakes.length > 0);
});
