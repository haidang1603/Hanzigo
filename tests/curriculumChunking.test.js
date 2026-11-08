import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getHSKLevels,
  getHSKLessons,
  getHSKLessonDetail,
  preloadHSKLesson,
  clearCurriculumCache,
  normalizeLevelNumber,
  getLevelFromLessonId
} from '../src/services/curriculumService.js';

import {
  CURRICULUM_60_LESSONS,
  CURRICULUM_ALL_LESSONS,
  CURRICULUM_HSK4_6_LESSONS,
  getCurriculumLessonById
} from '../src/data/curriculumLessons.js';

import { HSK_1_LESSONS } from '../src/data/curriculum/hsk1Lessons.js';
import { HSK_2_LESSONS } from '../src/data/curriculum/hsk2Lessons.js';
import { HSK_3_LESSONS } from '../src/data/curriculum/hsk3Lessons.js';
import { HSK_4_LESSONS } from '../src/data/curriculum/hsk4Lessons.js';
import { HSK_5_LESSONS } from '../src/data/curriculum/hsk5Lessons.js';
import { HSK_6_LESSONS } from '../src/data/curriculum/hsk6Lessons.js';

// =========================================================================
// NHÓM A — LEVEL DEFINITION & RESOLVER VALIDATION
// =========================================================================

test('A1. getHSKLevels returns exactly 6 standard HSK levels', () => {
  const levels = getHSKLevels();
  assert.equal(levels.length, 6, 'Must define 6 levels for HSK 1 to HSK 6');
  
  levels.forEach((lvl, idx) => {
    const expectedNum = idx + 1;
    assert.equal(lvl.levelNumber, expectedNum, `Level at index ${idx} must have levelNumber ${expectedNum}`);
    assert.equal(lvl.id, `lvl-${expectedNum}`, `Level id must match lvl-${expectedNum}`);
    assert.equal(lvl.name, `HSK ${expectedNum}`, `Level name must match HSK ${expectedNum}`);
    assert.equal(lvl.totalLessons, 20, `Level ${expectedNum} must specify 20 total lessons`);
    assert.ok(lvl.title && lvl.title.length > 0, `Level ${expectedNum} must have title`);
  });
});

test('A2. normalizeLevelNumber & getLevelFromLessonId parse valid inputs accurately', () => {
  assert.equal(normalizeLevelNumber(1), 1);
  assert.equal(normalizeLevelNumber('1'), 1);
  assert.equal(normalizeLevelNumber('lvl-2'), 2);
  assert.equal(normalizeLevelNumber('HSK 3'), 3);
  assert.equal(normalizeLevelNumber('level 4'), 4);
  assert.equal(normalizeLevelNumber('lvl-5'), 5);
  assert.equal(normalizeLevelNumber('6'), 6);
  assert.equal(normalizeLevelNumber('invalid'), 1, 'Fallback to 1 on unrecognized input');

  assert.equal(getLevelFromLessonId('l-101'), 1);
  assert.equal(getLevelFromLessonId('l-220'), 2);
  assert.equal(getLevelFromLessonId('l-315'), 3);
  assert.equal(getLevelFromLessonId('l-408'), 4);
  assert.equal(getLevelFromLessonId('l-519'), 5);
  assert.equal(getLevelFromLessonId('l-620'), 6);
  assert.equal(getLevelFromLessonId('invalid-id'), 1, 'Fallback to 1 on invalid lessonId');
});

// =========================================================================
// NHÓM B — GRANULAR CHUNKING & LEVEL ISOLATION
// =========================================================================

test('B1. Individual chunk modules load exactly 20 lessons each with contiguous IDs', () => {
  const chunks = [
    { num: 1, list: HSK_1_LESSONS, start: 101, end: 120 },
    { num: 2, list: HSK_2_LESSONS, start: 201, end: 220 },
    { num: 3, list: HSK_3_LESSONS, start: 301, end: 320 },
    { num: 4, list: HSK_4_LESSONS, start: 401, end: 420 },
    { num: 5, list: HSK_5_LESSONS, start: 501, end: 520 },
    { num: 6, list: HSK_6_LESSONS, start: 601, end: 620 }
  ];

  chunks.forEach(({ num, list, start, end }) => {
    assert.equal(list.length, 20, `HSK ${num} chunk must contain exactly 20 lessons`);
    assert.equal(list[0].id, `l-${start}`, `HSK ${num} first lesson must be l-${start}`);
    assert.equal(list[list.length - 1].id, `l-${end}`, `HSK ${num} last lesson must be l-${end}`);

    // Verify all IDs are unique within the level
    const ids = new Set(list.map(l => l.id));
    assert.equal(ids.size, 20, `HSK ${num} lessons must all have unique IDs`);
  });
});

test('B2. Level Isolation: No lesson ID overlaps between different levels', () => {
  const allChunkSets = [
    new Set(HSK_1_LESSONS.map(l => l.id)),
    new Set(HSK_2_LESSONS.map(l => l.id)),
    new Set(HSK_3_LESSONS.map(l => l.id)),
    new Set(HSK_4_LESSONS.map(l => l.id)),
    new Set(HSK_5_LESSONS.map(l => l.id)),
    new Set(HSK_6_LESSONS.map(l => l.id))
  ];

  for (let i = 0; i < allChunkSets.length; i++) {
    for (let j = i + 1; j < allChunkSets.length; j++) {
      for (const id of allChunkSets[i]) {
        assert.ok(!allChunkSets[j].has(id), `Collision detected: ${id} exists in both HSK ${i+1} and HSK ${j+1}`);
      }
    }
  }
});

// =========================================================================
// NHÓM C — ASYNC CURRICULUM SERVICE & IN-MEMORY CACHING
// =========================================================================

test('C1. getHSKLessons dynamically loads 20 lessons for every level', async () => {
  for (let lvl = 1; lvl <= 6; lvl++) {
    const lessons = await getHSKLessons(lvl);
    assert.ok(Array.isArray(lessons), `HSK ${lvl} must return an array`);
    assert.equal(lessons.length, 20, `HSK ${lvl} must contain exactly 20 lessons`);
    assert.ok(lessons.every(l => l.id.startsWith(`l-${lvl}`)), `All lessons in HSK ${lvl} must have l-${lvl} prefix`);
  }
});

test('C2. In-Memory caching returns exact reference on repeated calls without re-fetching', async () => {
  const firstCall = await getHSKLessons(2);
  const secondCall = await getHSKLessons(2);
  assert.strictEqual(firstCall, secondCall, 'Subsequent getHSKLessons call must return cached reference');

  const stringCall = await getHSKLessons('lvl-2');
  assert.strictEqual(stringCall, firstCall, 'Normalized string call must return same cached reference');
});

test('C3. clearCurriculumCache clears cache and re-populates HSK 1 default baseline', async () => {
  await getHSKLessons(3);
  clearCurriculumCache();
  // HSK 1 remains fast-path cached
  const hsk1 = await getHSKLessons(1);
  assert.equal(hsk1.length, 20, 'HSK 1 must remain available after cache reset');
});

// =========================================================================
// NHÓM D — DETAIL RETRIEVAL & PEDAGOGICAL 9-STEP INTEGRITY
// =========================================================================

test('D1. getHSKLessonDetail retrieves complete 9-step lessons across all levels', async () => {
  const sampleLessons = ['l-101', 'l-205', 'l-310', 'l-415', 'l-501', 'l-620'];

  for (const lessonId of sampleLessons) {
    const lesson = await getHSKLessonDetail(lessonId);
    assert.ok(lesson, `Lesson ${lessonId} must be found`);
    assert.equal(lesson.id, lessonId, `Lesson ID must match requested ${lessonId}`);

    // Verify metadata
    assert.ok(lesson.title, `Lesson ${lessonId} must have title`);
    assert.ok(lesson.chapterId, `Lesson ${lessonId} must have chapterId`);
    assert.ok(lesson.durationMinutes > 0, `Lesson ${lessonId} must have positive duration`);
    assert.ok(lesson.xpReward > 0, `Lesson ${lessonId} must have positive xpReward`);

    // Verify 9 pedagogical steps
    assert.ok(lesson.step1_learn, `Lesson ${lessonId} missing step1_learn`);
    assert.ok(Array.isArray(lesson.step2_vocabulary) && lesson.step2_vocabulary.length > 0, `Lesson ${lessonId} missing step2_vocabulary`);
    assert.ok(Array.isArray(lesson.step3_hanzi) && lesson.step3_hanzi.length > 0, `Lesson ${lessonId} missing step3_hanzi`);
    assert.ok(lesson.step4_grammar, `Lesson ${lessonId} missing step4_grammar`);
    assert.ok(lesson.step5_listening, `Lesson ${lessonId} missing step5_listening`);
    assert.ok(lesson.step6_speaking, `Lesson ${lessonId} missing step6_speaking`);
    assert.ok(lesson.step7_writing, `Lesson ${lessonId} missing step7_writing`);
    assert.ok(Array.isArray(lesson.step8_quiz) && lesson.step8_quiz.length > 0, `Lesson ${lessonId} missing step8_quiz`);
    assert.ok(lesson.step9_challenge, `Lesson ${lessonId} missing step9_challenge`);
  }
});

test('D2. preloadHSKLesson executes without throwing errors', () => {
  assert.doesNotThrow(() => {
    preloadHSKLesson('l-102');
    preloadHSKLesson('l-305');
    preloadHSKLesson('l-619');
    preloadHSKLesson(null);
  });
});

// =========================================================================
// NHÓM E — BACKWARD COMPATIBILITY & LEGACY RE-EXPORTS
// =========================================================================

test('E1. CURRICULUM_60_LESSONS maintains exactly 60 lessons for HSK 1 to 3', () => {
  assert.equal(CURRICULUM_60_LESSONS.length, 60, 'CURRICULUM_60_LESSONS must have 60 lessons');
  const hsk1Count = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-1')).length;
  const hsk2Count = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-2')).length;
  const hsk3Count = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-3')).length;

  assert.equal(hsk1Count, 20, 'HSK 1 must have 20 lessons');
  assert.equal(hsk2Count, 20, 'HSK 2 must have 20 lessons');
  assert.equal(hsk3Count, 20, 'HSK 3 must have 20 lessons');
});

test('E2. CURRICULUM_HSK4_6_LESSONS maintains exactly 60 lessons for HSK 4 to 6', () => {
  assert.equal(CURRICULUM_HSK4_6_LESSONS.length, 60, 'CURRICULUM_HSK4_6_LESSONS must have 60 lessons');
  const hsk4Count = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-4')).length;
  const hsk5Count = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-5')).length;
  const hsk6Count = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-6')).length;

  assert.equal(hsk4Count, 20, 'HSK 4 must have 20 lessons');
  assert.equal(hsk5Count, 20, 'HSK 5 must have 20 lessons');
  assert.equal(hsk6Count, 20, 'HSK 6 must have 20 lessons');
});

test('E3. CURRICULUM_ALL_LESSONS maintains all 120 lessons without regression', () => {
  assert.equal(CURRICULUM_ALL_LESSONS.length, 120, 'CURRICULUM_ALL_LESSONS must contain all 120 lessons');
  
  // Test getCurriculumLessonById across all levels
  assert.ok(getCurriculumLessonById('l-101'));
  assert.ok(getCurriculumLessonById('l-210'));
  assert.ok(getCurriculumLessonById('l-315'));
  assert.ok(getCurriculumLessonById('l-405'));
  assert.ok(getCurriculumLessonById('l-510'));
  assert.ok(getCurriculumLessonById('l-620'));
  assert.equal(getCurriculumLessonById('l-999'), null);
});
