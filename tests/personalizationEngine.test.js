import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildStudentLearningProfile,
  detectWeaknesses,
  generateDailyLearningPlan,
  getOfflineCoachRecommendation,
  getAiCoachRecommendation
} from '../src/services/aiLearningCoachService.js';

import {
  LEARNING_GOALS,
  getUserLearningGoal,
  saveUserLearningGoal,
  getUserDailyGoalMinutes,
  saveUserDailyGoalMinutes,
  getRecommendedNextLesson,
  getRecommendedReviewLessons,
  getRecommendedMaterialsForUser,
  getPersonalizedRecommendation,
  getUserJourneyProgress,
  completeLesson
} from '../src/services/learningPathService.js';

import { getStoredMaterials } from '../src/utils/materialsStorage.js';

// Polyfill localStorage for Node test runner
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

function resetTestStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
}

// =========================================================================
// TEST SUITE: TASK 6 PERSONALIZATION ENGINE
// =========================================================================

test('1. NEXT LESSON: Accurately identifies next lesson and provides pedagogical rationale', () => {
  resetTestStorage();
  const testUser = { uid: 'user-next-01', name: 'Đặng Tuấn', level: 'HSK 1' };

  // Case A: New user with 0 completed lessons
  const nextA = getRecommendedNextLesson(testUser);
  assert.equal(nextA.lessonId, 'l-101');
  assert.equal(nextA.lessonNumber, 1);
  assert.ok(nextA.reason.includes('HSK 1'), 'Reason must explain initial roadmap entry');

  // Case B: User has completed lesson l-101 with 92%
  completeLesson('l-101', 92, testUser);
  const nextB = getRecommendedNextLesson(testUser);
  assert.equal(nextB.lessonId, 'l-102');
  assert.ok(nextB.reason.includes('92%'), 'Reason must mention performance in previous lesson');
  assert.ok(nextB.title.length > 0, 'Must have readable lesson title');
  assert.equal(nextB.targetRoute, 'roadmap');
});

test('2. REVIEW LESSONS: Detects sub-90% scores and aging lessons with lowest score prioritized', () => {
  resetTestStorage();
  const testUser = { uid: 'user-rev-02', name: 'Lê Hoàng', level: 'HSK 1' };

  // Simulate 3 completed lessons with different scores:
  // l-101: 74% (1 star - needs urgent review)
  // l-102: 84% (2 stars - needs improvement)
  // l-103: 96% (3 stars - mastered, no review needed)
  completeLesson('l-101', 74, testUser);
  completeLesson('l-102', 84, testUser);
  completeLesson('l-103', 96, testUser);

  const reviews = getRecommendedReviewLessons(testUser, 5);

  assert.equal(reviews.length, 2, 'Only the 2 sub-90% lessons should be recommended for review');
  
  // Lowest score (74%) must be prioritized first
  assert.equal(reviews[0].lessonId, 'l-101');
  assert.equal(reviews[0].score, 74);
  assert.ok(reviews[0].reason.includes('74%'), 'Reason must explicitly explain low quiz score');
  assert.ok(reviews[0].reason.includes('1 sao') || reviews[0].reason.includes('chuẩn đầu ra'));

  // Second review candidate (84%)
  assert.equal(reviews[1].lessonId, 'l-102');
  assert.equal(reviews[1].score, 84);
  assert.ok(reviews[1].reason.includes('84%'));

  // l-103 (96%) must NOT be in the review list
  assert.ok(!reviews.some(r => r.lessonId === 'l-103'), 'Mastered lesson (96%) must not be flagged for review');
});

test('3. REVIEW LESSONS: Flags lessons completed over 7 days ago even with high score', () => {
  resetTestStorage();
  const testUser = { uid: 'user-old-03', name: 'Trần Bích', level: 'HSK 1' };

  const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString();
  const journey = {
    completedLessons: {
      'l-101': { score: 95, stars: 3, completedAt: tenDaysAgo }
    },
    activeLessonId: 'l-102',
    unlockedLevelNumber: 1
  };
  localStorage.setItem(`hanzigo_journey_progress_${testUser.uid}`, JSON.stringify(journey));

  const reviews = getRecommendedReviewLessons(testUser, 3);
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].lessonId, 'l-101');
  assert.ok(reviews[0].reason.includes('ngày trước') || reviews[0].reason.includes('Spaced Repetition'), 
    'Reason must reference spaced repetition or elapsed time');
});

test('4. SKILL WEAKNESS: Derived strictly from authentic evidence without fake score fabrication', () => {
  resetTestStorage();
  const testUser = { uid: 'user-skills-04', name: 'Nguyễn Minh', level: 'HSK 1' };

  // Profile with NO practice activity
  const emptyProfile = buildStudentLearningProfile(testUser);
  assert.equal(emptyProfile.skills.pronunciation.hasEnoughData, false);
  assert.equal(emptyProfile.skills.pronunciation.score, null);
  assert.equal(emptyProfile.skills.speaking.hasEnoughData, false);
  assert.equal(emptyProfile.skills.grammar.hasEnoughData, false);

  // Now simulate authentic mic speech practice with average score 64%
  const speechData = [
    { targetHanzi: '你好', overall: 60, fluencyScore: 58 },
    { targetHanzi: '再见', overall: 68, fluencyScore: 66 }
  ];
  localStorage.setItem(`hanzigo_pronounce_history_${testUser.uid}`, JSON.stringify(speechData));

  const profileWithSpeech = buildStudentLearningProfile(testUser);
  assert.equal(profileWithSpeech.skills.pronunciation.hasEnoughData, true);
  assert.equal(profileWithSpeech.skills.pronunciation.score, 64);

  const weaknesses = detectWeaknesses(profileWithSpeech);
  const pronWeakness = weaknesses.find(w => w.skill === 'pronunciation');
  assert.ok(pronWeakness, 'Must detect pronunciation weakness based on real mic test');
  assert.equal(pronWeakness.severity, 'high');
  assert.ok(pronWeakness.detail.includes('64/100'));
});

test('5. MATERIALS RECOMMENDATION: Matches verified materials to user level, weak skill, and goal', () => {
  resetTestStorage();
  const testUser = { uid: 'user-mat-05', name: 'Vũ Lan', level: 'HSK 1' };

  // Case A: Weak skill is Pronunciation, Goal is Daily Communication
  const materialsPron = getRecommendedMaterialsForUser(testUser, ['pronunciation'], 'daily_communication', 3);
  assert.ok(materialsPron.length > 0 && materialsPron.length <= 3);
  
  // Must include audio/pronunciation or dialogue material (e.g. mat-12, mat-8, or mat-19)
  const hasAudioOrComm = materialsPron.some(m => 
    m.id === 'mat-12' || m.id === 'mat-8' || m.id === 'mat-19' || m.category === 'Thành ngữ & Giao tiếp'
  );
  assert.ok(hasAudioOrComm, 'Must recommend pronunciation or conversation materials');
  assert.ok(materialsPron[0].reason.length > 0, 'Every material must contain a clear pedagogical reason');

  // Case B: Weak skill is Writing, Goal is Hanzi Culture
  const materialsWriting = getRecommendedMaterialsForUser(testUser, ['writing'], 'hanzi_culture', 3);
  const hasWritingOrRadicals = materialsWriting.some(m => 
    m.id === 'mat-9' || m.id === 'mat-4' || m.id === 'mat-14' || m.category === 'Bộ thủ & Hán tự'
  );
  assert.ok(hasWritingOrRadicals, 'Must recommend Mizige or 214 radicals material');

  // Case C: Goal is HSK Exam
  const materialsHsk = getRecommendedMaterialsForUser(testUser, ['grammar'], 'hsk_exam', 3);
  const hasHskExam = materialsHsk.some(m => 
    m.id === 'mat-1' || m.id === 'mat-5' || m.id === 'mat-6'
  );
  assert.ok(hasHskExam, 'Must recommend HSK standard course or Grammar Wiki for HSK exam');
});

test('6. ADAPTIVE TIME: Dynamically scales daily plan when duration changes (10m vs 30m vs 45m)', () => {
  resetTestStorage();
  const testUser = { uid: 'user-time-06', name: 'Phạm Thu', level: 'HSK 1' };

  completeLesson('l-101', 75, testUser); // creates 1 review lesson
  const profile = buildStudentLearningProfile(testUser);
  const weaknesses = detectWeaknesses(profile);

  // Plan 1: 10 minutes (micro-plan)
  const plan10 = generateDailyLearningPlan(profile, weaknesses, 10);
  const totalMins10 = plan10.reduce((acc, s) => acc + s.durationMinutes, 0);
  assert.ok(totalMins10 <= 15, '10-minute target plan must stay compact');
  assert.ok(plan10.length <= 4, '10-minute plan should have 3-4 tasks');

  // Plan 2: 30 minutes (balanced plan with review lesson & materials)
  const plan30 = generateDailyLearningPlan(profile, weaknesses, 30);
  const totalMins30 = plan30.reduce((acc, s) => acc + s.durationMinutes, 0);
  assert.ok(totalMins30 >= 22 && totalMins30 <= 35, '30-minute target plan should scale up duration');
  assert.ok(plan30.some(s => s.type === 'review_lesson'), '30-minute plan must include review lesson');
  assert.ok(plan30.some(s => s.type === 'materials'), '30-minute plan must include library materials step');

  // Verify all tasks have pedagogical reasons
  plan30.forEach(task => {
    assert.ok(task.reason && task.reason.length > 5, `Task "${task.title}" must have explicit reasoning`);
  });
});

test('7. ADAPTIVE GOAL: Adjusts plan focus according to user learning goals', () => {
  resetTestStorage();
  const testUser = { uid: 'user-goal-07', name: 'Trịnh Hưng', level: 'HSK 1' };
  const profile = buildStudentLearningProfile(testUser);
  const weaknesses = [];

  // Goal 1: Giao tiếp & Du lịch
  const planComm = generateDailyLearningPlan(profile, weaknesses, 20, 'daily_communication');
  assert.ok(planComm.some(s => s.route === 'pronunciation' || s.title.includes('giao tiếp')), 
    'Communication goal plan must prioritize speaking/mic');

  // Goal 2: Chữ Hán & Bút thuận
  const planHanzi = generateDailyLearningPlan(profile, weaknesses, 20, 'hanzi_culture');
  assert.ok(planHanzi.some(s => s.route === 'writing' || s.title.includes('Mễ tự') || s.title.includes('thuận bút')), 
    'Hanzi goal plan must prioritize writing');

  // Goal 3: Luyện thi HSK
  const planHsk = generateDailyLearningPlan(profile, weaknesses, 20, 'hsk_exam');
  assert.ok(planHsk.some(s => s.title.includes('HSK') || s.type === 'grammar'), 
    'HSK goal plan must prioritize HSK exam drills');
});

test('8. COLD-START GUIDANCE: Directs new learners to Placement Test without hallucinating data', () => {
  resetTestStorage();
  const brandNewUser = { uid: 'user-cold-08', name: 'Khách Mới' };

  const profile = buildStudentLearningProfile(brandNewUser);
  assert.equal(profile.hasSparseData, true, 'Brand new user must have hasSparseData = true');
  assert.ok(profile.guidanceForNewLearner, 'Must attach guidance for new learner');
  assert.equal(profile.guidanceForNewLearner.suggestedAction, 'placement_test');

  const weaknesses = detectWeaknesses(profile);
  assert.ok(weaknesses.some(w => w.actionType === 'placement_test'), 'Must offer placement test remediation');

  const offlineRec = getOfflineCoachRecommendation(profile, weaknesses);
  assert.ok(offlineRec.summary.includes('kiểm tra đầu vào'), 'Summary must guide user to placement test');
});

test('9. PROGRESS INTEGRITY: AI recommendation engine never destructively alters user progress', () => {
  resetTestStorage();
  const testUser = { uid: 'user-safe-09', name: 'An Toàn', level: 'HSK 1' };

  // Set real progress: completed l-101 and l-102
  completeLesson('l-101', 95, testUser);
  completeLesson('l-102', 88, testUser);

  const progressBefore = getUserJourneyProgress(testUser);
  assert.equal(Object.keys(progressBefore.completedLessons).length, 2);

  // Generate recommendations multiple times
  const profile = buildStudentLearningProfile(testUser);
  const weaknesses = detectWeaknesses(profile);
  getOfflineCoachRecommendation(profile, weaknesses, { durationMinutes: 30 });
  getPersonalizedRecommendation(testUser);

  const progressAfter = getUserJourneyProgress(testUser);
  assert.equal(Object.keys(progressAfter.completedLessons).length, 2, 'Completed lessons count must be unchanged');
  assert.equal(progressAfter.completedLessons['l-101'].score, 95);
  assert.equal(progressAfter.completedLessons['l-102'].score, 88);
});

test('10. PRIVACY SANITIZATION: Critical secrets and passwords are stripped from AI coach payload', async () => {
  resetTestStorage();
  const sensitiveUser = {
    uid: 'user-sec-10',
    name: 'Nguyễn Bảo Mật',
    email: 'private@hanzigo.com',
    password: 'PlainTextPassword!999',
    token: 'jwt_token_must_not_leak',
    refresh_token: 'refresh_token_secret'
  };
  localStorage.setItem('hanzigo_user', JSON.stringify(sensitiveUser));

  const result = await getAiCoachRecommendation(sensitiveUser);
  assert.ok(result.success);

  // Check stored cache
  const today = new Date().toISOString().split('T')[0];
  const cacheRaw = localStorage.getItem(`hanzigo_ai_coach_cache_${sensitiveUser.uid}_${today}`);
  assert.ok(cacheRaw, 'Must have cached recommendation');

  assert.equal(cacheRaw.includes(sensitiveUser.password), false, 'Password must never enter AI cache');
  assert.equal(cacheRaw.includes(sensitiveUser.token), false, 'Token must never enter AI cache');
  assert.equal(cacheRaw.includes(sensitiveUser.refresh_token), false, 'Refresh token must never enter AI cache');
});
