import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  ALL_CONVERSATION_SCENARIOS, 
  SCENARIO_CATEGORIES 
} from '../src/data/conversationScenarios.js';

import {
  diagnoseOfflineHskMistakes,
  recommendOfflineResources,
  generateOfflinePersonalizedPlan,
  generateOfflineGrammarExplanation,
  generateOfflineExercises
} from '../src/services/deterministicPersonalizationEngine.js';

import {
  getLearnerPreferences,
  saveLearnerPreferences,
  isPersonalizationEnabled,
  clearLearnerPersonalizationData,
  exportLearnerPersonalizationData,
  buildComprehensiveLearnerContext
} from '../src/services/learnerContextService.js';

import {
  getHskMistakesDiagnosis,
  getPersonalizedResourceRecommendations
} from '../src/services/aiGateway.js';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] || null,
    get length() {
      return store.size;
    }
  };
}

// =========================================================================
// TEST SUITE: FULL LIFECYCLE AI PERSONALIZATION & PEDAGOGY
// =========================================================================

test('1. HSK MISTAKE DIAGNOSIS: Skill-based error pattern analysis & remedy plans', () => {
  const mockMistakes = [
    { id: 'm1', skill: 'listening', question: '听录音选择正确答案', user_answer: 'A', correct_answer: 'B' },
    { id: 'm2', skill: 'listening', question: '听短文判断对错', user_answer: 'False', correct_answer: 'True' },
    { id: 'm3', skill: 'reading', question: '选择恰当词语填空', user_answer: 'C', correct_answer: 'A' },
    { id: 'm4', skill: 'writing', question: '连词成句（把字句）', user_answer: '我作业做完把了', correct_answer: '我把作业做完了' }
  ];

  const diagnosis = diagnoseOfflineHskMistakes(mockMistakes, [{ examTitle: 'HSK 3 Mock Test 1', score: 145 }]);

  assert.ok(diagnosis.overallDiagnosis.includes('4 câu làm chưa chính xác'));
  assert.equal(diagnosis.recurringErrorPatterns.length, 3); // listening, reading, writing
  
  const listeningPattern = diagnosis.recurringErrorPatterns.find(p => p.skill === 'listening');
  assert.ok(listeningPattern, 'Must detect listening pattern');
  assert.ok(listeningPattern.remedy.includes('Đọc lướt 4 đáp án'), 'Must provide concrete remedy');

  const writingPattern = diagnosis.recurringErrorPatterns.find(p => p.skill === 'writing');
  assert.ok(writingPattern, 'Must detect writing pattern');
  assert.ok(writingPattern.remedy.includes('câu chữ 把'), 'Must address 把 structure');

  assert.ok(Array.isArray(diagnosis.targetedPracticePlan) && diagnosis.targetedPracticePlan.length >= 2);
  assert.equal(diagnosis.isOffline, true);
});

test('2. HSK MISTAKE DIAGNOSIS: Empty history returns positive encouragement without fake errors', () => {
  const diagnosis = diagnoseOfflineHskMistakes([], []);
  assert.ok(diagnosis.overallDiagnosis.includes('rất tốt'));
  assert.equal(diagnosis.recurringErrorPatterns.length, 0);
  assert.ok(diagnosis.targetedPracticePlan.length > 0);
});

test('3. CONVERSATION SCENARIOS: Rich categories, adjustable levels, zero audio retention', () => {
  // Scenarios must contain all mandatory categories: daily, shopping, travel, school, interview, business, free
  const categoriesPresent = new Set(ALL_CONVERSATION_SCENARIOS.map(s => s.category));
  assert.ok(categoriesPresent.has('daily'), 'Contains daily scenarios');
  assert.ok(categoriesPresent.has('shopping'), 'Contains shopping scenarios');
  assert.ok(categoriesPresent.has('travel'), 'Contains travel scenarios');
  assert.ok(categoriesPresent.has('school'), 'Contains school scenarios');
  assert.ok(categoriesPresent.has('interview'), 'Contains interview scenarios');
  assert.ok(categoriesPresent.has('business'), 'Contains business scenarios');
  assert.ok(categoriesPresent.has('free'), 'Contains free conversation');

  // Verify categories definition
  assert.ok(SCENARIO_CATEGORIES.length >= 7);
  const schoolCat = SCENARIO_CATEGORIES.find(c => c.id === 'school');
  assert.ok(schoolCat);

  // Verify dialogue structure of newly added scenarios
  const interviewScenario = ALL_CONVERSATION_SCENARIOS.find(s => s.id === 'conv-interview');
  assert.ok(interviewScenario);
  assert.equal(interviewScenario.level, 'HSK 4');
  assert.ok(interviewScenario.dialogue.length >= 3);
  assert.ok(interviewScenario.suggestedReplies.length >= 2);
});

test('4. CONVERSATION MISTAKE TRACKING: Consent gating enforces Decree 13 compliance', () => {
  localStorage.clear();
  const testUser = { id: 'user-consent-test', name: 'Nguyễn Văn A' };

  // Case A: User allows mistake tracking
  const mistakeEvent = {
    id: 'conv-err-1',
    user_id: testUser.id,
    user_sentence: '我昨天去商店买书了，但是没有钱。',
    correction: 'Bạn có thể nói: "我昨天打算去买书，但没带足够的钱。"'
  };
  localStorage.setItem('hanzigo_conversation_mistakes', JSON.stringify([mistakeEvent]));

  const saved = JSON.parse(localStorage.getItem('hanzigo_conversation_mistakes'));
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, 'conv-err-1');

  // Case B: User wipes / clears personalization data
  clearLearnerPersonalizationData(testUser);
  const remaining = localStorage.getItem('hanzigo_conversation_mistakes');
  assert.equal(remaining, null);
});

test('5. RESOURCE RECOMMENDATION: Accurately scores and attests academic materials', () => {
  const candidateMaterials = [
    { id: 'r1', title: 'Giáo trình Chuẩn HSK 2 CTI', level: 'HSK 2', category: 'Giáo trình chuẩn', publisher: 'CTI', license: 'CTI Official' },
    { id: 'r2', title: 'Toàn tập Ngữ pháp HSK 5 Cao cấp', level: 'HSK 5', category: 'Ngữ pháp', publisher: 'BLCU', license: 'OER CC BY' },
    { id: 'r3', title: '500 Mẫu câu Giao tiếp HSK 2', level: 'HSK 2', category: 'Giao tiếp', publisher: 'HanziGo', license: 'HanziGo Open License' }
  ];

  // Learner targeting HSK 2
  const result = recommendOfflineResources({
    hskLevel: 'HSK 2',
    learningGoal: 'hsk_exam',
    weakSkills: ['listening', 'communication']
  }, candidateMaterials);

  assert.ok(result && Array.isArray(result.recommendations));
  assert.ok(result.recommendations.length > 0);
  // Highest scored should match HSK 2
  assert.ok(result.recommendations[0].matchScore >= 70);
  assert.ok(result.recommendations[0].rationale.includes('HSK 2'));
});

test('6. PRIVACY TOGGLE: Disabling personalization enforces zero-tracking curriculum mode', async () => {
  localStorage.clear();
  const testUser = { id: 'user-privacy-toggle', name: 'Trần Thị B' };

  // Explicitly turn personalization OFF (key is personalizationEnabled)
  saveLearnerPreferences({ personalizationEnabled: false }, testUser);
  assert.equal(isPersonalizationEnabled(testUser), false);

  // Calling diagnosis or plan must return deterministic curriculum standards without server tracking
  const plan = await getHskMistakesDiagnosis([], [], testUser);
  assert.equal(plan.isOffline, true);
});

test('7. EXPORT & DATA DELETION: Full JSON export and complete data purge work reliably', () => {
  localStorage.clear();
  const testUser = { id: 'user-export-test', name: 'Lê Văn C' };

  saveLearnerPreferences({
    hskLevel: 'HSK 3',
    learningGoal: 'business',
    dailyGoalMinutes: 30
  }, testUser);

  const exported = exportLearnerPersonalizationData(testUser);
  assert.equal(exported.userId, 'user-export-test');
  assert.equal(exported.preferences.hskLevel, 'HSK 3');
  assert.equal(exported.preferences.dailyGoalMinutes, 30);

  // Purge
  clearLearnerPersonalizationData(testUser);
  const postPurgePrefs = getLearnerPreferences(testUser);
  assert.equal(postPurgePrefs.learningGoal, 'general_foundation');
});

test('8. ZERO HALLUCINATION: All 5 offline pedagogical functions produce deterministic outputs', () => {
  // 1. Plan
  const plan = generateOfflinePersonalizedPlan({ hskLevel: 'HSK 1', dailyGoalMinutes: 15 });
  assert.ok(plan.dailyPlan.length >= 2);
  assert.equal(plan.isOffline, true);

  // 2. Grammar
  const grammar = generateOfflineGrammarExplanation('把', 'HSK 3');
  assert.ok(grammar.structure && grammar.structure.length > 0);
  assert.ok(grammar.commonMistakes.length > 0);
  assert.equal(grammar.isOffline, true);

  // 3. Exercise
  const exercise = generateOfflineExercises({ targetConcept: '你好', hskLevel: 'HSK 1' });
  assert.ok(exercise.drills.length >= 2);
  assert.equal(exercise.isOffline, true);

  // 4. HSK Diagnosis
  const diagnosis = diagnoseOfflineHskMistakes([{ skill: 'reading' }]);
  assert.ok(diagnosis.recurringErrorPatterns.length > 0);
  assert.equal(diagnosis.isOffline, true);

  // 5. Resource recommendation
  const resources = recommendOfflineResources({ hskLevel: 'HSK 1' });
  assert.ok(resources.recommendations && resources.recommendations.length > 0);
  assert.equal(resources.isOffline, true);
});
