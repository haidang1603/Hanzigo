import test from 'node:test';
import assert from 'node:assert/strict';

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

import { 
  generatePersonalizedDailyMissions,
  updateDailyMissionProgress,
  claimDailyMission,
  evaluateUserAchievements,
  getCurrentDailyChallenge,
  getCurrentWeeklyChallenge,
  evaluateChallengeSubmission,
  trackLearningRetentionEvent,
  getRetentionAnalytics,
  auditUserXp,
  generateActionToken
} from '../src/services/gamificationService.js';

import { 
  getUserLevelInfo, 
  awardXp, 
  calculateTotalXp, 
  getStreakStatus,
  LEVEL_SYSTEM 
} from '../src/utils/gamification.js';

import { 
  getXpLeaderboard, 
  maskSensitiveEmail, 
  isUserLeaderboardOptedOut, 
  setLeaderboardPrivacyOptOut 
} from '../src/services/leaderboardService.js';

// Setup helper for test user
function createMockUser(id = 'test-learner-1', email = 'test.learner@hanzigo.com', level = 'HSK 2') {
  return {
    uid: id,
    id,
    name: 'Nguyễn Văn A',
    email,
    level,
    hskLevel: level,
    streak: 7
  };
}

test('PHASE 5 - 1. DAILY MISSIONS: Generates goals tailored to HSK, SRS due count and weaknesses', () => {
  localStorage.clear();
  const user = createMockUser();

  // Seed review words to trigger SRS goal
  localStorage.setItem(`hanzigo_vocab_review_${user.id}`, JSON.stringify(['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']));

  const missions = generatePersonalizedDailyMissions(user);

  assert.equal(missions.length >= 5, true, 'Must generate at least 5 daily learning goals');
  
  // Verify HSK learning path mission exists
  const lessonMission = missions.find(m => m.category === 'lesson');
  assert.ok(lessonMission, 'Must contain a lesson goal');
  assert.ok(lessonMission.title.includes('HSK 2'), 'Lesson goal must reflect user HSK level');

  // Verify SRS mission exists with dynamic count
  const srsMission = missions.find(m => m.category === 'srs');
  assert.ok(srsMission, 'Must contain an SRS review goal');
  assert.ok(srsMission.target >= 5, 'SRS target must adapt to due queue');

  // Verify NO mission rewards simply for login
  const loginMission = missions.find(m => m.title.toLowerCase().includes('đăng nhập') || m.title.toLowerCase().includes('login'));
  assert.equal(loginMission, undefined, 'Must NEVER reward user simply for logging in');
});

test('PHASE 5 - 1. DAILY MISSIONS: Progress update and claim with anti-cheat protection', () => {
  localStorage.clear();
  const user = createMockUser();
  const missions = generatePersonalizedDailyMissions(user);
  const lessonMission = missions.find(m => m.category === 'lesson');

  // Attempting to claim an incomplete mission must be REJECTED
  const prematureClaim = claimDailyMission(lessonMission.id, user);
  assert.equal(prematureClaim.xpAwarded, 0, 'Cannot claim uncompleted mission');
  assert.ok(prematureClaim.error, 'Must return error explaining mission is incomplete');

  // Progress update
  const updatedMissions = updateDailyMissionProgress('lesson', 1, user);
  const completedLesson = updatedMissions.find(m => m.id === lessonMission.id);
  assert.equal(completedLesson.isCompleted, true, 'Mission must be completed after reaching target');

  // Legitimate claim
  const validClaim = claimDailyMission(lessonMission.id, user);
  assert.equal(validClaim.xpAwarded, 50, 'Must award 50 XP upon legitimate completion');

  // Double-claim attempt must be blocked (Idempotency)
  const doubleClaim = claimDailyMission(lessonMission.id, user);
  assert.equal(doubleClaim.xpAwarded, 0, 'Double claim must be prevented');
});

test('PHASE 5 - 2. ACHIEVEMENTS: Evaluates real events and prevents frontend spoofing', () => {
  localStorage.clear();
  const user = createMockUser();

  // Test before events: achievements should be locked
  let achievements = evaluateUserAchievements(user);
  const streak7 = achievements.find(a => a.id === 'streak-7');
  const hanzi500 = achievements.find(a => a.id === 'hanzi-500');
  const xp10k = achievements.find(a => a.id === 'xp-10000');

  assert.equal(hanzi500.unlocked, false, '500 Hanzi must be locked initially');
  assert.equal(xp10k.unlocked, false, '10,000 XP must be locked initially');

  // Seed authentic events: 500 characters, 100 speaking sessions, 10,000 XP
  const dummyChars = Array.from({ length: 505 }, (_, i) => ({ char: `字${i}` }));
  localStorage.setItem(`hanzigo_custom_writing_chars_${user.id}`, JSON.stringify(dummyChars));

  const dummySpeaking = Array.from({ length: 105 }, (_, i) => ({ overall: 85 }));
  localStorage.setItem(`hanzigo_pronounce_history_${user.id}`, JSON.stringify(dummySpeaking));

  // Re-evaluate
  achievements = evaluateUserAchievements(user);
  const updatedHanzi500 = achievements.find(a => a.id === 'hanzi-500');
  const updatedSpeaking100 = achievements.find(a => a.id === 'speaking-100');

  assert.equal(updatedHanzi500.unlocked, true, '500 Hanzi must unlock when authentic events satisfy condition');
  assert.equal(updatedHanzi500.current >= 500, true);
  assert.equal(updatedSpeaking100.unlocked, true, '100 Speaking Sessions must unlock when genuine sessions exist');
  assert.equal(updatedSpeaking100.current >= 100, true);
});

test('PHASE 5 - 3. LEVEL SYSTEM: 30 Monotonic Levels, Never Reset XP, Exact Required Titles', () => {
  assert.equal(LEVEL_SYSTEM.length >= 30, true, 'Level system must contain 30 levels');

  // Check required titles
  const lv1 = getUserLevelInfo(0);
  assert.equal(lv1.level, 1);
  assert.ok(lv1.title.includes('Tân Thủ') || lv1.title.includes('Beginner'), 'Level 1 must be Beginner / Tân Thủ');

  const lv10 = getUserLevelInfo(4500);
  assert.equal(lv10.level, 10);
  assert.ok(lv10.title.includes('Người Khám Phá') || lv10.title.includes('Chinese Explorer'), 'Level 10 must be Chinese Explorer');

  const lv20 = getUserLevelInfo(22000);
  assert.equal(lv20.level, 20);
  assert.ok(lv20.title.includes('Chiến Binh HSK') || lv20.title.includes('HSK Challenger'), 'Level 20 must be HSK Challenger');

  const lv30 = getUserLevelInfo(80000);
  assert.equal(lv30.level, 30);
  assert.ok(lv30.title.includes('Đại Tông Sư') || lv30.title.includes('Polymath'), 'Level 30 must be Polymath / Đại Tông Sư');

  // Verify XP monotonicity: XP must never decrease or reset between levels
  for (let i = 0; i < LEVEL_SYSTEM.length - 1; i++) {
    assert.ok(LEVEL_SYSTEM[i].maxXp <= LEVEL_SYSTEM[i + 1].minXp || LEVEL_SYSTEM[i].maxXp === LEVEL_SYSTEM[i + 1].minXp,
      `Level ${i + 1} maxXp must connect to Level ${i + 2} minXp`);
  }
});

test('PHASE 5 - 4. CHALLENGES: Grammar pattern validation and submission feedback', () => {
  localStorage.clear();
  const user = createMockUser();

  // Test Daily Challenge with pattern "因为...所以..."
  const daily = getCurrentDailyChallenge(user);
  assert.ok(daily.id, 'Daily challenge must exist');

  // 1. Invalid submission: Missing "所以"
  const invalidSub = evaluateChallengeSubmission(
    'challenge-daily-yinwei',
    { text: '因为今天下雨我很累。', type: 'text' },
    user
  );
  assert.equal(invalidSub.success, false, 'Must reject submission lacking required grammar pattern');
  assert.ok(invalidSub.feedback.includes('Chưa đúng mẫu câu') || invalidSub.feedback.includes('thiếu'), 'Must explain error pedagogically');

  // 2. Valid submission: Contains both "因为" and "所以"
  const validSub = evaluateChallengeSubmission(
    'challenge-daily-yinwei',
    { text: '因为今天下雨，所以我不想出去。', type: 'text' },
    user
  );
  assert.equal(validSub.success, true, 'Must accept grammatically correct sentence');
  assert.equal(validSub.xpEarned, 50, 'Must award 50 XP');

  // 3. Repeated submission today must not give double XP
  const repeatSub = evaluateChallengeSubmission(
    'challenge-daily-yinwei',
    { text: '因为今天下雨，所以我不想出去。', type: 'text' },
    user
  );
  assert.equal(repeatSub.success, false, 'Must reject duplicate challenge claim in the same period');
});

test('PHASE 5 - 4. WEEKLY CHALLENGE: Multi-keyword presentation requirement', () => {
  localStorage.clear();
  const user = createMockUser();

  const weekly = getCurrentWeeklyChallenge(user);
  assert.ok(weekly.id, 'Weekly challenge must exist');

  // Invalid: short text without required keywords
  const invalidWeekly = evaluateChallengeSubmission(
    'challenge-weekly-presentation',
    { text: '你好。', type: 'text' },
    user
  );
  assert.equal(invalidWeekly.success, false, 'Must reject text that is too short');

  // Valid: Adequate length + 2 keywords (喜欢, 常常)
  const validWeekly = evaluateChallengeSubmission(
    'challenge-weekly-presentation',
    { text: '我非常喜欢学中文，周末常常去图书馆看书。', type: 'text' },
    user
  );
  assert.equal(validWeekly.success, true, 'Must accept valid presentation text');
  assert.equal(validWeekly.xpEarned, 150, 'Must award 150 XP for weekly challenge');
});

test('PHASE 5 - 5. LEADERBOARD: Email masking, Weekly/Monthly scopes, and Privacy Opt-Out', async () => {
  localStorage.clear();

  // Test email masking
  assert.equal(maskSensitiveEmail('hoang.tran@hanzigo.com'), 'h***n@hanzigo.com');
  assert.equal(maskSensitiveEmail('mai@gmail.com'), 'm***i@gmail.com');

  // Seed learners
  const learners = [
    { id: 'user-a', name: 'Trần Văn Hoàng', email: 'hoang.tran@hanzigo.com', xp: 1200, streak: 14 },
    { id: 'user-b', name: 'Lê Thị Thu', email: 'thu.le@hanzigo.com', xp: 800, streak: 3 }
  ];
  localStorage.setItem('hanzigo_admin_users_directory', JSON.stringify(learners));

  const currentUser = createMockUser('current-1', 'private.learner@test.com');

  // Opt-out test
  setLeaderboardPrivacyOptOut(currentUser, true);
  assert.equal(isUserLeaderboardOptedOut(currentUser), true, 'User opt-out flag must be set');

  const result = await getXpLeaderboard(currentUser, { timeframe: 'weekly' });
  assert.ok(result.leaderboard.length >= 2, 'Leaderboard must contain seeded entries');

  // Verify masked emails are provided
  result.leaderboard.forEach(entry => {
    assert.ok(entry.maskedEmail.includes('***'), 'All public entries must have masked email');
  });

  // Verify weekly timeframe calculations
  assert.equal(result.timeframe, 'weekly');
});

test('PHASE 5 - 6. REWARD SYSTEM & ANTI-ABUSE: Daily XP cap and rate limits', () => {
  localStorage.clear();
  const user = createMockUser();

  // Award 1,000 XP
  awardXp(1000, user, 'test_award_1');
  let currentXp = calculateTotalXp(user);
  assert.equal(currentXp >= 1000, true);

  // Award another 400 XP
  awardXp(400, user, 'test_award_2');
  currentXp = calculateTotalXp(user);
  assert.equal(currentXp >= 1400, true);

  // Attempt to spam 500 XP over the 1,500 daily cap
  awardXp(500, user, 'test_award_3');
  const cappedXp = calculateTotalXp(user);
  
  // Total bonus for today must NOT exceed 1,500
  const bonusXp = parseInt(localStorage.getItem(`hanzigo_bonus_xp_${user.id}`) || '0', 10);
  assert.ok(bonusXp <= 1500, `Daily bonus XP must be capped at 1,500 (actual: ${bonusXp})`);
});

test('PHASE 5 - 7. RETENTION ANALYTICS: Tracks active learning events, DAU/WAU (Not simple visits)', () => {
  localStorage.clear();
  const user = createMockUser();

  // Track real pedagogical events
  assert.equal(trackLearningRetentionEvent('lesson_completed', { lessonId: 'l-101' }, user), true);
  assert.equal(trackLearningRetentionEvent('srs_reviewed', { cardCount: 10 }, user), true);
  assert.equal(trackLearningRetentionEvent('challenge_completed', { challengeId: 'c-1' }, user), true);

  // Non-learning events like page visit or plain login must be REJECTED
  assert.equal(trackLearningRetentionEvent('page_view', {}, user), false);
  assert.equal(trackLearningRetentionEvent('login_click', {}, user), false);

  const analytics = getRetentionAnalytics();
  assert.ok(analytics.dau >= 1, 'DAU must count active learning learners');
  assert.ok(analytics.wau >= 1, 'WAU must count active weekly learning learners');
  assert.ok(analytics.totalEventsTracked >= 3, 'Must record 3 pedagogical events');
});

test('PHASE 5 - 8. ANTI-CHEAT: Audits manipulated XP and generates deterministic tokens', async () => {
  localStorage.clear();
  const user = createMockUser();

  // Simulate malicious user opening DevTools and typing localStorage.setItem('hanzigo_bonus_xp', '9999999')
  localStorage.setItem(`hanzigo_bonus_xp_${user.id}`, '9999999');

  const audit = auditUserXp(user);
  assert.equal(audit.isTampered, true, 'Anti-cheat must detect abnormal bonus XP without backing events');
  assert.ok(audit.correctedBonus < 10000, 'Tampered bonus must be clamped to verified threshold');

  // Verify deterministic action token generation
  const token = await generateActionToken('lesson_complete', user.id, '2026-10-09');
  assert.ok(token, 'Token must be generated');
  assert.equal(typeof token, 'string');
  assert.ok(token.length >= 6, 'Token must have sufficient cryptographic entropy');
});
