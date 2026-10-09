import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  getAllLevels, 
  getAllChapters, 
  getChaptersByLevel, 
  getLessonsByChapter, 
  getLessonById,
  getLessonNodeStatus, 
  isBossUnlocked, 
  completeLesson, 
  completeBossChallenge,
  getBossChallengeById,
  getBossChallengeByChapter,
  getUserJourneyProgress,
  saveUserJourneyProgress,
  syncUserJourneyProgressFromCloud,
  getResumeLesson,
  getLessonMaterials,
  getChapterMaterials
} from '../src/services/learningPathService.js';

import { LEARNING_LESSONS, BOSS_CHALLENGES, LEARNING_CHAPTERS } from '../src/data/learningPathData.js';
import { getStoredMaterials } from '../src/utils/materialsStorage.js';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

test('1. CURRICULUM INTEGRITY: All 60 Lessons are authentic with complete 9-step schema', () => {
  assert.equal(LEARNING_LESSONS.length, 60, 'Must have exactly 60 fully authored lessons for Levels 1-3');

  const lessonIds = new Set();
  LEARNING_LESSONS.forEach((lesson) => {
    // Unique ID
    assert.ok(lesson.id, 'Lesson must have an id');
    assert.ok(!lessonIds.has(lesson.id), `Lesson id must be unique: duplicate ${lesson.id}`);
    lessonIds.add(lesson.id);

    // Required pedagogical metadata
    assert.ok(lesson.title, `Lesson ${lesson.id} must have a title`);
    assert.ok(lesson.chineseTitle, `Lesson ${lesson.id} must have a chineseTitle`);
    assert.ok(lesson.objective, `Lesson ${lesson.id} must define concrete objective`);
    assert.ok(lesson.prerequisite, `Lesson ${lesson.id} must define prerequisite`);
    assert.ok(lesson.completionCriteria, `Lesson ${lesson.id} must define completionCriteria`);
    assert.ok(lesson.durationMinutes > 0, `Lesson ${lesson.id} must define durationMinutes`);
    assert.ok(lesson.xpReward > 0, `Lesson ${lesson.id} must define xpReward`);

    // 9 Pedagogical Steps completeness
    assert.ok(lesson.step1_learn, `Lesson ${lesson.id} must have step1_learn`);
    assert.ok(lesson.step1_learn.topic, `Lesson ${lesson.id} step1_learn must have topic`);
    assert.ok(lesson.step1_learn.summary, `Lesson ${lesson.id} step1_learn must have summary`);

    assert.ok(Array.isArray(lesson.step2_vocabulary), `Lesson ${lesson.id} must have step2_vocabulary array`);
    assert.ok(lesson.step2_vocabulary.length >= 2, `Lesson ${lesson.id} step2_vocabulary must have at least 2 words`);
    lesson.step2_vocabulary.forEach(v => {
      assert.ok(v.hanzi, `Vocab in ${lesson.id} must have hanzi`);
      assert.ok(v.pinyin, `Vocab in ${lesson.id} must have pinyin`);
      assert.ok(v.meaning, `Vocab in ${lesson.id} must have meaning`);
    });

    assert.ok(Array.isArray(lesson.step3_hanzi), `Lesson ${lesson.id} must have step3_hanzi array`);
    assert.ok(lesson.step3_hanzi.length >= 1, `Lesson ${lesson.id} step3_hanzi must have at least 1 character`);

    assert.ok(lesson.step4_grammar, `Lesson ${lesson.id} must have step4_grammar`);
    assert.ok(lesson.step4_grammar.title, `Lesson ${lesson.id} step4_grammar must have title`);
    assert.ok(lesson.step4_grammar.formula, `Lesson ${lesson.id} step4_grammar must have formula`);

    assert.ok(lesson.step5_listening, `Lesson ${lesson.id} must have step5_listening`);
    assert.ok(Array.isArray(lesson.step5_listening.dialogue), `Lesson ${lesson.id} step5_listening must have dialogue`);

    assert.ok(lesson.step6_speaking, `Lesson ${lesson.id} must have step6_speaking`);
    assert.ok(lesson.step6_speaking.targetSentence, `Lesson ${lesson.id} step6_speaking must have targetSentence`);

    assert.ok(lesson.step7_writing, `Lesson ${lesson.id} must have step7_writing`);
    assert.ok(Array.isArray(lesson.step7_writing.words), `Lesson ${lesson.id} step7_writing must have words`);

    assert.ok(Array.isArray(lesson.step8_quiz), `Lesson ${lesson.id} must have step8_quiz`);
    assert.ok(lesson.step8_quiz.length >= 2, `Lesson ${lesson.id} step8_quiz must have at least 2 questions`);
    lesson.step8_quiz.forEach(q => {
      assert.ok(q.question, `Quiz question in ${lesson.id} must have text`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Quiz question in ${lesson.id} must have options`);
      assert.ok(typeof q.correctIndex === 'number', `Quiz question in ${lesson.id} must have correctIndex`);
      assert.ok(q.explanation, `Quiz question in ${lesson.id} must have explanation`);
    });

    assert.ok(lesson.step9_challenge, `Lesson ${lesson.id} must have step9_challenge`);
    assert.ok(lesson.step9_challenge.title, `Lesson ${lesson.id} step9_challenge must have title`);
  });
});

test('2. PEDAGOGICAL HIERARCHY: Level -> Module -> Unit -> Lesson mapping', () => {
  const chapters = getAllChapters();
  assert.ok(chapters.length >= 12, 'Must define at least 12 curriculum chapters');

  // Verify all 12 chapters have Module code, Unit title, prerequisite, reviewLessonId
  for (let i = 0; i < 12; i++) {
    const ch = chapters[i];
    assert.ok(ch.moduleCode, `Chapter ${ch.id} must have moduleCode`);
    assert.ok(ch.unitTitle, `Chapter ${ch.id} must have unitTitle`);
    assert.ok(ch.prerequisite, `Chapter ${ch.id} must have prerequisite`);
    assert.ok(ch.reviewLessonId, `Chapter ${ch.id} must have reviewLessonId`);
    assert.ok(Array.isArray(ch.lessonIds), `Chapter ${ch.id} must have lessonIds`);
    assert.equal(ch.lessonIds.length, 5, `Chapter ${ch.id} must have exactly 5 lessons`);
    assert.ok(ch.bossId, `Chapter ${ch.id} must link to a bossId`);
  }

  // Check Level 1 chapters: 1.1, 1.2, 1.3, 1.4
  assert.equal(chapters[0].moduleCode, '1.1');
  assert.equal(chapters[1].moduleCode, '1.2');
  assert.equal(chapters[2].moduleCode, '1.3');
  assert.equal(chapters[3].moduleCode, '1.4');

  // Check Level 2 chapters: 2.1, 2.2, 2.3, 2.4
  assert.equal(chapters[4].moduleCode, '2.1');
  assert.equal(chapters[5].moduleCode, '2.2');
  assert.equal(chapters[6].moduleCode, '2.3');
  assert.equal(chapters[7].moduleCode, '2.4');

  // Check Level 3 chapters: 3.1, 3.2, 3.3, 3.4
  assert.equal(chapters[8].moduleCode, '3.1');
  assert.equal(chapters[9].moduleCode, '3.2');
  assert.equal(chapters[10].moduleCode, '3.3');
  assert.equal(chapters[11].moduleCode, '3.4');
});

test('3. BOSS CHALLENGE COMPLETENESS: All 12 Chapters have full multi-stage scenarios', () => {
  assert.equal(BOSS_CHALLENGES.length, 12, 'Must have exactly 12 authentic Boss Challenges');

  for (let i = 1; i <= 12; i++) {
    const bossId = `boss-ch-${i}`;
    const boss = getBossChallengeById(bossId);
    assert.ok(boss, `Boss ${bossId} must exist`);
    assert.ok(boss.bossName, `Boss ${bossId} must have bossName`);
    assert.ok(boss.bossAvatar, `Boss ${bossId} must have bossAvatar`);
    assert.ok(boss.scenario, `Boss ${bossId} must have scenario`);
    assert.ok(Array.isArray(boss.stages), `Boss ${bossId} must have stages`);
    assert.ok(boss.stages.length >= 4, `Boss ${bossId} must have at least 4 stages`);

    boss.stages.forEach((stg, sIdx) => {
      assert.ok(stg.bossDialogue, `Boss ${bossId} stage ${sIdx + 1} must have bossDialogue`);
      assert.ok(stg.bossMeaning, `Boss ${bossId} stage ${sIdx + 1} must have bossMeaning`);
      assert.ok(stg.prompt, `Boss ${bossId} stage ${sIdx + 1} must have prompt`);
      assert.ok(Array.isArray(stg.options), `Boss ${bossId} stage ${sIdx + 1} must have options`);
      const hasCorrect = stg.options.some(o => o.isCorrect);
      assert.ok(hasCorrect, `Boss ${bossId} stage ${sIdx + 1} must have a correct option`);
    });
  }
});

test('4. PASSING CRITERIA ENFORCEMENT: Lessons require >= 70% to pass and advance', () => {
  const testUser = { uid: 'passing_criteria_tester' };
  localStorage.clear();

  // 1. Score < 70% -> Fails, 0 stars, not marked complete
  const failResult = completeLesson('l-101', 65, testUser);
  assert.equal(failResult.success, false, 'Score 65% must not succeed');
  assert.equal(failResult.passed, false, 'Score 65% must be marked not passed');
  assert.equal(failResult.stars, 0, 'Score < 70% must give 0 stars');

  const progressAfterFail = getUserJourneyProgress(testUser);
  assert.ok(!progressAfterFail.completedLessons['l-101'], 'Failed lesson must NOT be marked complete in progress');
  assert.equal(getLessonNodeStatus('l-102', progressAfterFail), 'locked', 'Next lesson must remain locked after failure');

  // 2. Score 70-79% -> 1 star (completed)
  const pass1Result = completeLesson('l-101', 75, testUser);
  assert.equal(pass1Result.success, true, 'Score 75% passes');
  assert.equal(pass1Result.stars, 1, 'Score 75% awards 1 star');
  const prog1 = getUserJourneyProgress(testUser);
  assert.equal(getLessonNodeStatus('l-101', prog1), 'completed', 'Status should be completed (1 star)');

  // 3. Score 80-89% -> 2 stars (completed)
  const pass2Result = completeLesson('l-102', 85, testUser);
  assert.equal(pass2Result.success, true, 'Score 85% passes');
  assert.equal(pass2Result.stars, 2, 'Score 85% awards 2 stars');
  const prog2 = getUserJourneyProgress(testUser);
  assert.equal(getLessonNodeStatus('l-102', prog2), 'completed', 'Status should be completed (2 stars)');

  // 4. Score >= 90% -> 3 stars (mastered)
  const pass3Result = completeLesson('l-103', 95, testUser);
  assert.equal(pass3Result.success, true, 'Score 95% passes');
  assert.equal(pass3Result.stars, 3, 'Score 95% awards 3 stars');
  const prog3 = getUserJourneyProgress(testUser);
  assert.equal(getLessonNodeStatus('l-103', prog3), 'mastered', 'Status should be mastered (3 stars)');
});

test('5. STRICT PREREQUISITE ENGINE: Lesson N requires N-1; Boss requires all 5 lessons; Module requires Boss', () => {
  const testUser = { uid: 'prereq_tester_strict' };
  localStorage.clear();

  let prog = {
    completedLessons: {},
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-101'
  };

  // Node l-101 is available or in_progress
  assert.ok(['available', 'in_progress'].includes(getLessonNodeStatus('l-101', prog)));

  // Nodes l-102 through l-105 are strictly locked
  assert.equal(getLessonNodeStatus('l-102', prog), 'locked');
  assert.equal(getLessonNodeStatus('l-103', prog), 'locked');
  assert.equal(getLessonNodeStatus('l-104', prog), 'locked');
  assert.equal(getLessonNodeStatus('l-105', prog), 'locked');

  // Chapter 1 Boss is locked
  assert.equal(isBossUnlocked('ch-1', prog), false);

  // Complete l-101
  completeLesson('l-101', 90, testUser);
  prog = getUserJourneyProgress(testUser);
  assert.ok(['available', 'in_progress'].includes(getLessonNodeStatus('l-102', prog)));
  assert.equal(getLessonNodeStatus('l-103', prog), 'locked');

  // Complete l-102, l-103, l-104
  completeLesson('l-102', 90, testUser);
  completeLesson('l-103', 90, testUser);
  completeLesson('l-104', 90, testUser);
  prog = getUserJourneyProgress(testUser);

  // Boss still locked before l-105 is complete
  assert.equal(isBossUnlocked('ch-1', prog), false);

  // Complete l-105 (all 5 lessons complete)
  completeLesson('l-105', 90, testUser);
  prog = getUserJourneyProgress(testUser);

  // Boss Chapter 1 is now unlocked!
  assert.equal(isBossUnlocked('ch-1', prog), true);

  // But Chapter 2 (Module 1.2) first lesson (l-106) must remain LOCKED until Boss 1 is beaten!
  assert.equal(getLessonNodeStatus('l-106', prog), 'locked', 'Lesson l-106 must remain locked until Boss Chapter 1 is beaten');

  // Beat Boss Chapter 1
  completeBossChallenge('boss-ch-1', 90, testUser);
  prog = getUserJourneyProgress(testUser);

  // Now Chapter 2 first lesson (l-106) is unlocked!
  assert.ok(['available', 'in_progress'].includes(getLessonNodeStatus('l-106', prog)), 'Lesson l-106 must unlock once Boss 1 is beaten');
});

test('6. RESUME LESSON ENGINE: getResumeLesson resolves active in-progress node', () => {
  localStorage.clear();
  const testUser = { uid: 'resume_tester' };

  // Initial state -> returns lesson 1-1 (l-101)
  const initialProg = getUserJourneyProgress(testUser);
  const resume1 = getResumeLesson(initialProg);
  assert.ok(resume1.lesson, 'Must return resume lesson');
  assert.equal(resume1.lesson.id, 'l-101');
  assert.equal(resume1.chapter.id, 'ch-1');
  assert.equal(resume1.level.id, 'lvl-1');

  // Advance to lesson 1-2
  completeLesson('l-101', 100, testUser);
  const prog2 = getUserJourneyProgress(testUser);
  const resume2 = getResumeLesson(prog2);
  assert.equal(resume2.lesson.id, 'l-102', 'Must resume from next unlocked lesson l-102');
});

test('7. MATERIALS LINKAGE ENGINE: Correctly associates lessons & chapters to verified repository materials', () => {
  // Test lesson materials
  const matL101 = getLessonMaterials('l-101');
  assert.ok(Array.isArray(matL101), 'Must return array of materials');
  assert.ok(matL101.length > 0, 'Lesson l-101 must link to verified materials');
  const mat1Exists = matL101.some(m => m.id === 'mat-1');
  assert.ok(mat1Exists, 'Lesson l-101 must link to BLCU Standard Course HSK 1 (mat-1)');

  // Test chapter materials
  const ch1Mats = getChapterMaterials('ch-1');
  assert.ok(Array.isArray(ch1Mats), 'Must return array of chapter materials');
  assert.ok(ch1Mats.length >= 2, 'Chapter 1 must link to multiple verified materials');
  assert.ok(ch1Mats.some(m => m.id === 'mat-1'));

  // Test Level 2 chapter materials (should include HSK 2 BLCU Standard Course mat-2)
  const ch5Mats = getChapterMaterials('ch-5');
  assert.ok(ch5Mats.some(m => m.id === 'mat-2'), 'Chapter 5 must link to mat-2 (HSK 2 Standard Course)');

  // Test Level 3 chapter materials (should include HSK 3 BLCU Standard Course mat-3)
  const ch9Mats = getChapterMaterials('ch-9');
  assert.ok(ch9Mats.some(m => m.id === 'mat-3'), 'Chapter 9 must link to mat-3 (HSK 3 Standard Course)');
});

test('8. BACKWARD COMPATIBILITY & NON-DESTRUCTIVE STORAGE: Preserves user progress without overwriting', async () => {
  localStorage.clear();
  const testUser = { uid: 'non_destructive_user' };

  // Existing progress with completed lessons
  const initialData = {
    completedLessons: {
      'l-101': { score: 95, stars: 3, completedAt: '2026-03-01T10:00:00Z' },
      'l-102': { score: 85, stars: 2, completedAt: '2026-03-02T10:00:00Z' }
    },
    completedBosses: {
      'boss-ch-1': { score: 90, completedAt: '2026-03-03T10:00:00Z' }
    },
    unlockedLevelNumber: 2,
    activeLessonId: 'l-103'
  };

  saveUserJourneyProgress(initialData, testUser);

  // Read back
  const readBack = getUserJourneyProgress(testUser);
  assert.equal(readBack.completedLessons['l-101'].score, 95);
  assert.equal(readBack.completedLessons['l-102'].stars, 2);
  assert.equal(readBack.completedBosses['boss-ch-1'].score, 90);
  assert.equal(readBack.unlockedLevelNumber, 2);
  assert.equal(readBack.activeLessonId, 'l-103');

  // Complete a new lesson without overwriting previous ones
  completeLesson('l-103', 100, testUser);
  const updated = getUserJourneyProgress(testUser);
  assert.equal(updated.completedLessons['l-101'].score, 95, 'l-101 must be preserved');
  assert.equal(updated.completedLessons['l-102'].score, 85, 'l-102 must be preserved');
  assert.equal(updated.completedLessons['l-103'].score, 100, 'l-103 must be newly completed');
  assert.equal(updated.completedBosses['boss-ch-1'].score, 90, 'boss-ch-1 must be preserved');
});
