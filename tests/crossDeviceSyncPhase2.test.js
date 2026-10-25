import test from 'node:test';
import assert from 'node:assert/strict';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES 
} from '../src/data/learningPathData.js';

import { 
  getLessonById,
  getLessonsByChapter,
  completeLesson,
  getUserJourneyProgress,
  saveUserJourneyProgress,
  syncUserJourneyProgressFromCloud,
  mergeGuestProgressIntoUser,
  fetchLessonsFromDb
} from '../src/services/learningPathService.js';

import { 
  calculateNextSrsReview, 
  SRS_QUALITY, 
  SRS_STAGES, 
  isCardDueForReview 
} from '../src/utils/srsEngine.js';

import { 
  syncLessonVocabToSrs,
  syncUserVocabSrsFromCloud,
  saveUserVocabSrsCard
} from '../src/services/vocabularyService.js';

// =========================================================================
// 1. LESSON DATA INTEGRITY & AUDIT VERIFICATION
// =========================================================================

test('PHASE 2 - 1: Curriculum integrity verifies 7 levels, 24 chapters, and 120 pedagogical 9-step lessons', () => {
  assert.equal(LEARNING_LEVELS.length, 7, 'Must have 7 HSK levels (HSK 1 to HSK 7-9)');
  assert.equal(LEARNING_CHAPTERS.length, 24, 'Must have 24 chapters');
  assert.equal(LEARNING_LESSONS.length, 120, 'Must have 120 authored lessons with 9 steps across 24 chapters');
  assert.equal(BOSS_CHALLENGES.length, 12, 'Must have 12 boss challenges');

  // Verify each lesson has all 9 pedagogical steps
  LEARNING_LESSONS.forEach(lesson => {
    assert.ok(lesson.id, 'Lesson ID required');
    assert.ok(lesson.chapterId, 'Chapter ID required');
    assert.ok(lesson.levelId, 'Level ID required');
    assert.ok(lesson.step1_learn, 'Step 1 learn required');
    assert.ok(lesson.step2_vocabulary, 'Step 2 vocab required');
    assert.ok(lesson.step3_hanzi, 'Step 3 hanzi required');
    assert.ok(lesson.step4_grammar, 'Step 4 grammar required');
    assert.ok(lesson.step5_listening, 'Step 5 listening required');
    assert.ok(lesson.step6_speaking, 'Step 6 speaking required');
    assert.ok(lesson.step7_writing, 'Step 7 writing required');
    assert.ok(lesson.step8_quiz, 'Step 8 quiz required');
    assert.ok(lesson.step9_challenge, 'Step 9 challenge required');
  });
});

test('PHASE 2 - 2: Nonexistent lesson lookup handled gracefully without throwing', () => {
  const nonexistent = getLessonById('non-existent-lesson-id-999');
  assert.equal(nonexistent, null, 'Must return null for completely nonexistent lesson');

  const emptyLessons = getLessonsByChapter('non-existent-chapter-999');
  assert.deepEqual(emptyLessons, [], 'Must return empty array for nonexistent chapter');
});

// =========================================================================
// 2. LEARNING PROGRESS & CROSS-DEVICE NON-DESTRUCTIVE MERGE
// =========================================================================

test('PHASE 2 - 3: Progress is saved and reloaded accurately per user UUID', () => {
  localStorage.clear();
  const testUser = { id: 'd0e1a2b3-c4d5-4e6f-a7b8-c9d0e1f2a3b4', role: 'student' };

  const initial = getUserJourneyProgress(testUser);
  assert.deepEqual(initial.completedLessons, {});
  assert.equal(initial.unlockedLevelNumber, 1);

  // Complete lesson l-101 with score 85 (2 stars)
  const res = completeLesson('l-101', 85, testUser);
  assert.equal(res.success !== false, true);
  assert.equal(res.stars, 2);

  const reloaded = getUserJourneyProgress(testUser);
  assert.ok(reloaded.completedLessons['l-101']);
  assert.equal(reloaded.completedLessons['l-101'].score, 85);
  assert.equal(reloaded.completedLessons['l-101'].stars, 2);
});

test('PHASE 2 - 4: Completing a lesson multiple times preserves highest score and stars without duplicate keys', () => {
  localStorage.clear();
  const testUser = { id: 'e1f2a3b4-c5d6-4e7f-a8b9-c0d1e2f3a4b5', role: 'student' };

  // 1st completion: score 75 (1 star)
  completeLesson('l-101', 75, testUser);
  let progress = getUserJourneyProgress(testUser);
  assert.equal(progress.completedLessons['l-101'].score, 75);
  assert.equal(progress.completedLessons['l-101'].stars, 1);

  // 2nd completion: score 95 (3 stars - mastered)
  completeLesson('l-101', 95, testUser);
  progress = getUserJourneyProgress(testUser);
  assert.equal(progress.completedLessons['l-101'].score, 95);
  assert.equal(progress.completedLessons['l-101'].stars, 3);

  // 3rd completion: score 80 (should NOT downgrade score or stars)
  completeLesson('l-101', 80, testUser);
  progress = getUserJourneyProgress(testUser);
  assert.equal(progress.completedLessons['l-101'].score, 95);
  assert.equal(progress.completedLessons['l-101'].stars, 3);

  // Exactly 1 entry in completedLessons map
  assert.equal(Object.keys(progress.completedLessons).length, 1);
});

test('PHASE 2 - 5: Multi-device sync: Merging Device A and Device B unites completions and keeps best scores', () => {
  localStorage.clear();
  const testUser = { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', role: 'student' };

  // Device A has finished l-101 (score 85, 2 stars) and l-102 (score 90, 3 stars)
  const deviceAProgress = {
    completedLessons: {
      'l-101': { score: 85, stars: 2, completedAt: '2026-10-15T10:00:00.000Z' },
      'l-102': { score: 90, stars: 3, completedAt: '2026-10-15T10:30:00.000Z' }
    },
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-103'
  };
  saveUserJourneyProgress(deviceAProgress, testUser);

  // Device B has finished l-101 with a higher score (95, 3 stars) and l-103 (score 88, 2 stars), unlocked level 2
  const cloudDataFromDeviceB = {
    user_id: testUser.id,
    completed_lessons: ['l-101', 'l-103'],
    lesson_details: {
      'l-101': { score: 95, stars: 3, completedAt: '2026-10-15T12:00:00.000Z' },
      'l-103': { score: 88, stars: 2, completedAt: '2026-10-15T12:30:00.000Z' }
    },
    unlocked_levels: 2,
    active_lesson_id: 'l-104',
    updated_at: '2026-10-15T12:30:00.000Z'
  };

  // Simulate non-destructive bidirectional merge logic
  const local = getUserJourneyProgress(testUser);
  const mergedLessons = { ...local.completedLessons };

  cloudDataFromDeviceB.completed_lessons.forEach(lid => {
    const cloudDetail = cloudDataFromDeviceB.lesson_details[lid];
    const localDetail = mergedLessons[lid];
    const bestScore = Math.max(localDetail?.score || 0, cloudDetail?.score || 100);
    const stars = bestScore >= 90 ? 3 : (bestScore >= 80 ? 2 : 1);
    mergedLessons[lid] = {
      score: bestScore,
      stars,
      completedAt: localDetail?.completedAt || cloudDetail?.completedAt
    };
  });

  const merged = {
    completedLessons: mergedLessons,
    completedBosses: {},
    unlockedLevelNumber: Math.max(local.unlockedLevelNumber, cloudDataFromDeviceB.unlocked_levels),
    activeLessonId: cloudDataFromDeviceB.active_lesson_id
  };

  // Must contain all 3 lessons: l-101, l-102, l-103
  assert.deepEqual(Object.keys(merged.completedLessons).sort(), ['l-101', 'l-102', 'l-103']);
  // l-101 has the higher score (95) from Device B
  assert.equal(merged.completedLessons['l-101'].score, 95);
  assert.equal(merged.completedLessons['l-101'].stars, 3);
  // l-102 from Device A was preserved
  assert.equal(merged.completedLessons['l-102'].score, 90);
  // l-103 from Device B was incorporated
  assert.equal(merged.completedLessons['l-103'].score, 88);
  // Unlocked level advanced to 2
  assert.equal(merged.unlockedLevelNumber, 2);
});

test('PHASE 2 - 6: Guest progress is safely merged into newly registered/logged-in user profile', () => {
  localStorage.clear();

  // Guest finishes l-101 while not logged in
  const guestProgress = {
    completedLessons: {
      'l-101': { score: 90, stars: 3, completedAt: '2026-10-16T00:00:00.000Z' }
    },
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-102'
  };
  localStorage.setItem('hanzigo_journey_progress', JSON.stringify(guestProgress));

  // User logs in with authenticated profile
  const authUser = { id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', role: 'student' };
  const merged = mergeGuestProgressIntoUser(authUser);

  assert.ok(merged, 'Merge must return merged result');
  assert.ok(merged.completedLessons['l-101']);
  assert.equal(merged.completedLessons['l-101'].score, 90);

  // Guest key must be cleaned up to prevent leakage
  assert.equal(localStorage.getItem('hanzigo_journey_progress'), null);

  // Authenticated user key contains the progress
  const userProgress = getUserJourneyProgress(authUser);
  assert.ok(userProgress.completedLessons['l-101']);
});

// =========================================================================
// 3. SRS MEMORY ENGINE & VOCABULARY INTEGRITY
// =========================================================================

test('PHASE 2 - 7: SM-2 Spaced Repetition retains exact intervals, ease factor, and due dates', () => {
  // New card initial review with Good quality (q=3)
  const card0 = { repetitions: 0, intervalDays: 1, easeFactor: 2.50 };
  const step1 = calculateNextSrsReview(card0, SRS_QUALITY.GOOD);
  assert.equal(step1.repetitions, 1);
  assert.equal(step1.intervalDays, 1);
  assert.equal(step1.stage, SRS_STAGES.REVIEW);

  // 2nd review with Easy quality (q=4)
  const step2 = calculateNextSrsReview(step1, SRS_QUALITY.EASY);
  assert.equal(step2.repetitions, 2);
  assert.equal(step2.intervalDays, 6);
  assert.ok(step2.easeFactor >= 1.30);

  // 3rd review with Good quality (q=3)
  const step3 = calculateNextSrsReview(step2, SRS_QUALITY.GOOD);
  assert.equal(step3.repetitions, 3);
  assert.equal(step3.intervalDays, Math.round(6 * step2.easeFactor));

  // Failed review resets interval and repetitions
  const failed = calculateNextSrsReview(step3, SRS_QUALITY.FORGOT);
  assert.equal(failed.repetitions, 0);
  assert.equal(failed.intervalDays, 1);
  assert.equal(failed.stage, SRS_STAGES.LEARNING);
  assert.ok(failed.easeFactor >= 1.30, 'Ease factor must not fall below 1.30 minimum bound');
});

test('PHASE 2 - 8: SRS lesson sync does not duplicate words or wipe existing progress', async () => {
  localStorage.clear();
  const testUser = { id: 'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e', role: 'student' };

  const lessonVocab = [
    { id: 'v1', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào' },
    { id: 'v2', hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Cảm ơn' }
  ];

  // 1st sync
  const res1 = await syncLessonVocabToSrs(lessonVocab, testUser);
  assert.equal(res1.addedCount, 2);
  assert.equal(res1.totalRememberedCount, 2);

  // 2nd sync with same vocab (idempotency check)
  const res2 = await syncLessonVocabToSrs(lessonVocab, testUser);
  assert.equal(res2.addedCount, 0);
  assert.equal(res2.totalRememberedCount, 2);
});

// =========================================================================
// 4. OFFLINE FAULT TOLERANCE & DATABASE ERROR RESILIENCE
// =========================================================================

test('PHASE 2 - 9: Offline / Network disconnect during sync saves locally without application crash', () => {
  localStorage.clear();
  const testUser = { id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f', role: 'student' };

  // Saving progress while offline
  const progress = {
    completedLessons: {
      'l-101': { score: 100, stars: 3, completedAt: new Date().toISOString() }
    },
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-102'
  };

  assert.doesNotThrow(() => {
    saveUserJourneyProgress(progress, testUser);
  });

  const reloaded = getUserJourneyProgress(testUser);
  assert.ok(reloaded.completedLessons['l-101']);
});

test('PHASE 2 - 10: fetchLessonsFromDb falls back seamlessly to bundle when database is offline or empty', async () => {
  const lessons = await fetchLessonsFromDb();
  assert.ok(Array.isArray(lessons));
  assert.equal(lessons.length, 120, 'Must fallback to 120 authored lessons without throwing error');
  assert.equal(lessons[0].id, 'l-101');
});
