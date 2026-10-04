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
  evaluatePlacementTest,
  getDailyMissions,
  claimDailyMission,
  getSkillMastery,
  getPersonalizedRecommendation
} from '../src/services/learningPathService.js';

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

test('Learning Path: Curriculum structure validation (HSK 1 to HSK 7-9 with 5-Pillar Syllabus)', () => {
  const levels = getAllLevels();
  assert.ok(levels.length >= 6, 'Should define at least 6 HSK levels');

  assert.equal(levels[0].hskLevel, 'HSK 1');
  assert.equal(levels[1].hskLevel, 'HSK 2');
  assert.equal(levels[2].hskLevel, 'HSK 3');
  assert.equal(levels[3].hskLevel, 'HSK 4');
  assert.equal(levels[4].hskLevel, 'HSK 5');
  assert.equal(levels[5].hskLevel, 'HSK 6');

  // Verify 5-pillar syllabus exists on levels
  levels.forEach(lvl => {
    assert.ok(lvl.syllabus5Pillars, `Level ${lvl.hskLevel} must define 5-pillar syllabus`);
    assert.ok(Array.isArray(lvl.syllabus5Pillars.tasks), 'Must define tasks');
    assert.ok(Array.isArray(lvl.syllabus5Pillars.topics), 'Must define topics');
    assert.ok(lvl.syllabus5Pillars.vocabularyTarget > 0, 'Must define vocabulary target');
    assert.ok(lvl.syllabus5Pillars.grammarTarget > 0, 'Must define grammar target');
    assert.ok(lvl.syllabus5Pillars.hanziTarget > 0, 'Must define hanzi target');
  });

  const chapters = getAllChapters();
  assert.equal(chapters.length, 24, 'Should define 24 core chapters');
});

test('Learning Path: Lesson 9-step schema completeness', () => {
  const lesson1 = getLessonById('l-101');
  assert.ok(lesson1, 'Lesson 1-1 should exist');

  // Verify all 9 steps exist on flagship lesson
  assert.ok(lesson1.step1_learn, 'Step 1 (Learn) must exist');
  assert.ok(lesson1.step2_vocabulary, 'Step 2 (Vocabulary) must exist');
  assert.ok(lesson1.step3_hanzi, 'Step 3 (Hanzi) must exist');
  assert.ok(lesson1.step4_grammar, 'Step 4 (Grammar) must exist');
  assert.ok(lesson1.step5_listening, 'Step 5 (Listening) must exist');
  assert.ok(lesson1.step6_speaking, 'Step 6 (Speaking) must exist');
  assert.ok(lesson1.step7_writing, 'Step 7 (Writing) must exist');
  assert.ok(lesson1.step8_quiz, 'Step 8 (Quiz) must exist');
  assert.ok(lesson1.step9_challenge, 'Step 9 (Challenge) must exist');
});

test('Learning Path: Node progression and unlock rules', () => {
  const mockUser = { uid: 'test_learner_999' };
  localStorage.clear();

  // Fresh user: lesson 1-1 is available
  const initialProgress = {
    completedLessons: {},
    completedBosses: {},
    unlockedLevelNumber: 1,
    activeLessonId: 'l-101'
  };

  const status1 = getLessonNodeStatus('l-101', initialProgress);
  assert.equal(status1, 'in_progress', 'Initial active lesson should be in_progress or available');

  const status2 = getLessonNodeStatus('l-102', initialProgress);
  assert.equal(status2, 'locked', 'Lesson 1-2 must be locked before 1-1 is completed');

  // Complete lesson 1-1
  const { progress } = completeLesson('l-101', 95, mockUser);
  assert.ok(progress.completedLessons['l-101'], 'Lesson 1-1 must be marked completed');
  assert.equal(progress.completedLessons['l-101'].stars, 3, 'Score 95 gets 3 stars');

  // Now lesson 1-2 is unlocked
  const updatedStatus2 = getLessonNodeStatus('l-102', progress);
  assert.ok(updatedStatus2 === 'available' || updatedStatus2 === 'in_progress', 'Lesson 1-2 must be unlocked now');
});

test('Learning Path: Boss challenge unlock criteria and HSK 3 5-stage simulation', () => {
  const chapter1Id = 'ch-1';
  const ch1Lessons = getLessonsByChapter(chapter1Id);

  const incompleteProgress = { completedLessons: {} };
  assert.equal(isBossUnlocked(chapter1Id, incompleteProgress), false, 'Boss must be locked if lessons incomplete');

  const completedMap = {};
  ch1Lessons.forEach(l => {
    completedMap[l.id] = { score: 100, stars: 3 };
  });

  const completeProg = { completedLessons: completedMap };
  assert.equal(isBossUnlocked(chapter1Id, completeProg), true, 'Boss must be unlocked when all chapter lessons are complete');

  // Verify HSK 3 Boss Challenge (3-day China travel)
  const hsk3Boss = getBossChallengeById('boss-hsk-3');
  assert.ok(hsk3Boss, 'HSK 3 boss challenge must exist');
  assert.equal(hsk3Boss.stages.length, 5, 'HSK 3 boss challenge must have 5 stages (Airport, Hotel, Restaurant, Metro, Shopping)');
});

test('Learning Path: Placement test diagnostic evaluation', () => {
  localStorage.clear();
  const mockUser = { uid: 'placement_user_1' };

  // All 10 answers correct -> Level 4
  const perfectAnswers = {
    'pt-1': 0, 'pt-2': 1, 'pt-3': 1, 'pt-4': 2, 'pt-5': 0,
    'pt-6': 1, 'pt-7': 1, 'pt-8': 1, 'pt-9': 0, 'pt-10': 0
  };
  const highResult = evaluatePlacementTest(perfectAnswers, 'hsk3', mockUser);
  assert.equal(highResult.recommendedLevel, 4, '10/10 correct should recommend Level 4');

  // Low score (0/10) -> Level 1
  const zeroAnswers = { 'pt-1': 3, 'pt-2': 3, 'pt-3': 3 };
  const lowResult = evaluatePlacementTest(zeroAnswers, 'zero', mockUser);
  assert.equal(lowResult.recommendedLevel, 1, 'Low score should recommend Level 1');
});

test('Learning Path: Daily Missions and Streak Rewards', () => {
  localStorage.clear();
  const mockUser = { uid: 'mission_user_1' };

  const missions = getDailyMissions(mockUser);
  assert.equal(missions.length, 5, 'Must generate 5 daily missions');

  // Claim uncompleted should not award
  const failClaim = claimDailyMission('m-1', mockUser);
  assert.equal(failClaim.xpAwarded, 0, 'Uncompleted mission cannot be claimed');
});

test('Learning Path: Skill mastery radar & personalized advice', () => {
  const mastery = getSkillMastery();
  assert.ok(mastery.listening >= 0, 'Listening score must exist');
  assert.ok(mastery.speaking >= 0, 'Speaking score must exist');

  const recommendation = getPersonalizedRecommendation();
  assert.ok(recommendation.weakestSkill, 'Must identify weakest skill');
  assert.ok(recommendation.recommendedTab, 'Must recommend practice tab');
});
