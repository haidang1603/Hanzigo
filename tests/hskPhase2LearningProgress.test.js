import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HSK_EXAMS,
  HSK_QUESTIONS,
  getFullExamById,
  getSanitizedExamForTaking
} from '../src/data/hskExamsData.js';
import {
  getHskExams,
  submitExamAttempt,
  getUserExamHistory,
  compareExamAttempts,
  recordMistakesFromAttempt,
  getMistakeNotebook,
  updateMistakeStatus,
  removeMistakeItem,
  getMistakePracticeExam,
  generateStudyAnalytics,
  generateStudyRecommendations,
  mergeLocalAttemptsToUser,
  getOrCreateAnonymousSessionId
} from '../src/services/hskService.js';
import hskRouter from '../api/hsk/[action].js';

// Setup mock localStorage for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

// ============================================================================
// 1. EXAM HISTORY: SAVING, RETRIEVING, ANONYMOUS & AUTHENTICATED ISOLATION
// ============================================================================
test('History: saves and retrieves exam history accurately for anonymous and authenticated users', async () => {
  localStorage.clear();

  // Anonymous user submits an exam
  const anonAttempt = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'hsk1-q-01': 1 },
    timeSpentSeconds: 450,
    user: null
  });

  assert.ok(anonAttempt.id);
  assert.equal(anonAttempt.userId, null);
  assert.ok(anonAttempt.anonymousSessionId);

  // Retrieve history for anonymous visitor
  const anonHistory = await getUserExamHistory({ user: null });
  assert.equal(anonHistory.length, 1);
  assert.equal(anonHistory[0].id, anonAttempt.id);
  assert.equal(anonHistory[0].examId, 'hsk1-mock-01');

  // Authenticated User A submits an exam
  const userA = { id: 'usr-alice-123' };
  const authAttemptA = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'hsk1-q-01': 1, 'hsk1-q-02': 0 },
    timeSpentSeconds: 600,
    user: userA
  });

  assert.equal(authAttemptA.userId, 'usr-alice-123');

  // User A retrieves history -> should include userA attempt
  const historyA = await getUserExamHistory({ user: userA });
  assert.ok(historyA.some(a => a.id === authAttemptA.id));

  // User B (different account) MUST NOT see User A's private attempts
  const userB = { id: 'usr-bob-999' };
  const historyB = await getUserExamHistory({ user: userB });
  const leakedAlice = historyB.some(a => a.userId === 'usr-alice-123');
  assert.equal(leakedAlice, false, 'Security violation: User B must not access User A private attempts!');
});

// ============================================================================
// 2. ATTEMPT COMPARISON: COMPATIBILITY, DELTA CALCULATION & INCOMPATIBLE GUARDS
// ============================================================================
test('Comparison: accurately compares 2 compatible attempts and calculates deltas', () => {
  const attempt1 = {
    id: 'att-1',
    examId: 'hsk1-mock-01',
    examTitle: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 1',
    examLevel: 'HSK 1',
    score: 120,
    maxScore: 200,
    accuracyPercentage: 60.0,
    correctCount: 12,
    totalQuestions: 20,
    timeSpentSeconds: 1800,
    skillBreakdown: {
      listening: { name: 'Nghe hiểu', earnedPoints: 60, maxPoints: 100, correctQuestions: 6, totalQuestions: 10 },
      reading: { name: 'Đọc hiểu', earnedPoints: 60, maxPoints: 100, correctQuestions: 6, totalQuestions: 10 }
    },
    createdAt: '2026-10-10T10:00:00Z'
  };

  const attempt2 = {
    id: 'att-2',
    examId: 'hsk1-mock-01',
    examTitle: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 1',
    examLevel: 'HSK 1',
    score: 160,
    maxScore: 200,
    accuracyPercentage: 80.0,
    correctCount: 16,
    totalQuestions: 20,
    timeSpentSeconds: 1500,
    skillBreakdown: {
      listening: { name: 'Nghe hiểu', earnedPoints: 80, maxPoints: 100, correctQuestions: 8, totalQuestions: 10 },
      reading: { name: 'Đọc hiểu', earnedPoints: 80, maxPoints: 100, correctQuestions: 8, totalQuestions: 10 }
    },
    createdAt: '2026-10-12T10:00:00Z'
  };

  const comparison = compareExamAttempts(attempt1, attempt2);

  assert.equal(comparison.compatible, true);
  assert.equal(comparison.metrics.scoreDelta, 40, 'Score improved by +40');
  assert.equal(comparison.metrics.accuracyDelta, 20.0, 'Accuracy improved by +20%');
  assert.equal(comparison.metrics.timeDeltaSeconds, -300, 'Time saved: 300 seconds faster');
  assert.equal(comparison.metrics.correctDelta, 4);
  assert.equal(comparison.metrics.improved, true);

  // Verify skill deltas
  assert.ok(comparison.skillsDelta.listening);
  assert.equal(comparison.skillsDelta.listening.pointsDelta, 20);
});

test('Comparison: strictly rejects incompatible exam attempts', () => {
  const attemptHSK1 = {
    id: 'att-1',
    examId: 'hsk1-mock-01',
    maxScore: 200,
    score: 140,
    accuracyPercentage: 70
  };

  const attemptHSK2 = {
    id: 'att-2',
    examId: 'hsk2-mock-01', // Different exam ID!
    maxScore: 200,
    score: 150,
    accuracyPercentage: 75
  };

  const diffExamRes = compareExamAttempts(attemptHSK1, attemptHSK2);
  assert.equal(diffExamRes.compatible, false, 'Cannot compare attempts from different exams');
  assert.ok(diffExamRes.reason);

  const attemptScale300 = {
    id: 'att-3',
    examId: 'hsk1-mock-01',
    maxScore: 300, // Different scale!
    score: 210,
    accuracyPercentage: 70
  };

  const diffScaleRes = compareExamAttempts(attemptHSK1, attemptScale300);
  assert.equal(diffScaleRes.compatible, false, 'Cannot compare attempts with different max score scales');
});

// ============================================================================
// 3. MISTAKE NOTEBOOK: RECORDING, DEDUPLICATION, STATUS UPDATE & REMOVAL
// ============================================================================
test('Mistake Notebook: records mistakes and avoids duplicate items when same question is answered incorrectly again', () => {
  localStorage.clear();

  const user = { id: 'usr-learner-1' };
  const mockAttempt1 = {
    id: 'att-m1',
    examId: 'hsk1-mock-01',
    examTitle: 'Đề Thi Thử HSK 1 Số 1',
    examLevel: 'HSK 1',
    userId: user.id,
    detailedResults: [
      {
        questionId: 'hsk1-q-01',
        prompt: '你好',
        pinyin: 'nǐ hǎo',
        translation: 'Xin chào',
        options: [{ text: 'A' }, { text: 'B' }],
        selectedIndex: 0,
        correctIndex: 1,
        isCorrect: false,
        explanation: 'Lời giải chi tiết câu 1',
        partType: 'listening'
      },
      {
        questionId: 'hsk1-q-02',
        prompt: '谢谢',
        selectedIndex: 1,
        correctIndex: 1,
        isCorrect: true // Correct question MUST NOT be in mistake notebook
      }
    ]
  };

  // 1. Record first attempt
  recordMistakesFromAttempt(mockAttempt1, user);

  // Retrieve mistakes
  const mistakes1 = JSON.parse(localStorage.getItem('hanzigo_hsk_mistakes') || '[]');
  assert.equal(mistakes1.length, 1, 'Only incorrect question should be recorded');
  assert.equal(mistakes1[0].questionId, 'hsk1-q-01');
  assert.equal(mistakes1[0].mistakeCount, 1);
  assert.equal(mistakes1[0].status, 'needs_review');

  // 2. Second attempt: User answers question hsk1-q-01 wrong AGAIN
  const mockAttempt2 = {
    id: 'att-m2',
    examId: 'hsk1-mock-01',
    examTitle: 'Đề Thi Thử HSK 1 Số 1',
    examLevel: 'HSK 1',
    userId: user.id,
    detailedResults: [
      {
        questionId: 'hsk1-q-01', // Same question!
        prompt: '你好',
        selectedIndex: 0,
        correctIndex: 1,
        isCorrect: false
      }
    ]
  };

  recordMistakesFromAttempt(mockAttempt2, user);

  // Verify deduplication: still 1 item, but mistakeCount is incremented to 2!
  const mistakes2 = JSON.parse(localStorage.getItem('hanzigo_hsk_mistakes') || '[]');
  assert.equal(mistakes2.length, 1, 'Must NOT create duplicate item in mistake notebook!');
  assert.equal(mistakes2[0].questionId, 'hsk1-q-01');
  assert.equal(mistakes2[0].mistakeCount, 2, 'Mistake count must increment to 2');
});

test('Mistake Notebook: supports toggling status between needs_review and mastered, and item removal', async () => {
  localStorage.clear();

  const user = { id: 'usr-learner-2' };
  const mockAttempt = {
    id: 'att-m3',
    examId: 'hsk1-mock-01',
    examLevel: 'HSK 1',
    userId: user.id,
    detailedResults: [
      {
        questionId: 'hsk1-q-05',
        prompt: '再见',
        selectedIndex: 0,
        correctIndex: 1,
        isCorrect: false,
        partType: 'reading'
      }
    ]
  };

  recordMistakesFromAttempt(mockAttempt, user);

  let list = await getMistakeNotebook({ user });
  assert.equal(list.length, 1);
  const mistakeId = list[0].id;
  assert.equal(list[0].status, 'needs_review');

  // 1. Mark as mastered ('Đã hiểu')
  await updateMistakeStatus(mistakeId, 'mastered', user);
  let updatedList = await getMistakeNotebook({ user });
  assert.equal(updatedList[0].status, 'mastered');

  // 2. Mark back as needs_review ('Cần ôn lại')
  await updateMistakeStatus(mistakeId, 'needs_review', user);
  updatedList = await getMistakeNotebook({ user });
  assert.equal(updatedList[0].status, 'needs_review');

  // 3. Remove item from notebook ('Xóa')
  await removeMistakeItem(mistakeId, user);
  const afterRemove = await getMistakeNotebook({ user });
  assert.equal(afterRemove.length, 0);
});

// ============================================================================
// 4. MISTAKE PRACTICE EXAM GENERATION
// ============================================================================
test('Mistake Practice: generates clean practice exam without exposing answer keys', async () => {
  localStorage.clear();
  const user = { id: 'usr-learner-3' };

  recordMistakesFromAttempt({
    id: 'att-mst-test',
    examId: 'hsk1-mock-01',
    examLevel: 'HSK 1',
    userId: user.id,
    detailedResults: [
      {
        questionId: 'q-wrong-1',
        prompt: '苹果',
        options: [{ text: 'Quả táo' }, { text: 'Quả lê' }],
        selectedIndex: 1,
        correctIndex: 0,
        isCorrect: false,
        explanation: '苹果 là quả táo'
      }
    ]
  }, user);

  const practiceExam = await getMistakePracticeExam({ user });
  assert.ok(practiceExam);
  assert.equal(practiceExam.total_questions, 1);
  assert.equal(practiceExam.questions.length, 1);

  // Security check: correct option index & explanation must NOT be exposed in practice exam
  const q = practiceExam.questions[0];
  assert.strictEqual(q.correct_option_index, undefined);
  assert.strictEqual(q.explanation, undefined);
  assert.equal(q.prompt, '苹果');
});

// ============================================================================
// 5. LEARNING ANALYTICS: DATA STATUS (NO_DATA, INSUFFICIENT, MEASURED)
// ============================================================================
test('Analytics: distinguishes cleanly between no_data, insufficient, and measured performance', () => {
  // Case 1: 0 attempts -> no_data
  const noDataAnalytics = generateStudyAnalytics([], []);
  assert.equal(noDataAnalytics.dataStatus, 'no_data');
  assert.equal(noDataAnalytics.totalExams, 0);
  assert.equal(noDataAnalytics.overallAccuracy, 0);

  // Case 2: 1 or 2 attempts (< 3) -> insufficient data
  const twoAttempts = [
    { examLevel: 'HSK 1', totalQuestions: 20, correctCount: 16, score: 160, timeSpentSeconds: 1200, passed: true },
    { examLevel: 'HSK 1', totalQuestions: 20, correctCount: 14, score: 140, timeSpentSeconds: 1100, passed: true }
  ];
  const insufficientAnalytics = generateStudyAnalytics(twoAttempts, []);
  assert.equal(insufficientAnalytics.dataStatus, 'insufficient');
  assert.equal(insufficientAnalytics.totalExams, 2);
  assert.ok(insufficientAnalytics.message.includes('2/3 đề thi'));

  // Case 3: 3 or more attempts (>= 3) -> measured performance
  const threeAttempts = [
    ...twoAttempts,
    { examLevel: 'HSK 1', totalQuestions: 20, correctCount: 18, score: 180, timeSpentSeconds: 1000, passed: true }
  ];
  const measuredAnalytics = generateStudyAnalytics(threeAttempts, []);
  assert.equal(measuredAnalytics.dataStatus, 'measured');
  assert.equal(measuredAnalytics.totalExams, 3);
  assert.equal(measuredAnalytics.overallAccuracy, 80.0); // 48/60 = 80%
  assert.equal(measuredAnalytics.passRate, 100);
});

// ============================================================================
// 6. DETERMINISTIC STUDY RECOMMENDATIONS (REUSING HANZIGO MODULES)
// ============================================================================
test('Recommendations: generates accurate deterministic suggestions without runtime AI API', () => {
  // Scenario 1: User has low listening accuracy (<65%)
  const weakListeningAnalytics = {
    totalExams: 3,
    overallAccuracy: 70,
    skillsAccuracy: {
      listening: { accuracy: 50.0, total: 15, correct: 7 },
      reading: { accuracy: 85.0, total: 15, correct: 13 }
    }
  };

  const unmasteredMistakes = [
    { id: 'm1', status: 'needs_review', category: 'Nghe hiểu' },
    { id: 'm2', status: 'needs_review', category: 'Nghe hiểu' }
  ];

  const recs = generateStudyRecommendations(weakListeningAnalytics, unmasteredMistakes);

  // Must recommend mistake notebook review
  const mistakeRec = recs.find(r => r.id === 'rec_mistakes');
  assert.ok(mistakeRec, 'Must recommend mistake notebook when unmastered items exist');
  assert.equal(mistakeRec.targetTab, 'hsk');

  // Must recommend pronunciation / listening drills
  const listeningRec = recs.find(r => r.id === 'rec_listening');
  assert.ok(listeningRec, 'Must recommend listening & pronunciation practice');
  assert.equal(listeningRec.targetTab, 'pronunciation');

  // Scenario 2: High performing user (overall >= 80% on >= 2 exams)
  const strongAnalytics = {
    totalExams: 3,
    overallAccuracy: 88,
    skillsAccuracy: {
      listening: { accuracy: 85, total: 15 },
      reading: { accuracy: 90, total: 15 }
    }
  };

  const levelUpRecs = generateStudyRecommendations(strongAnalytics, []);
  const levelUpRec = levelUpRecs.find(r => r.id === 'rec_level_up');
  assert.ok(levelUpRec, 'Must recommend advancing to next level roadmap');
  assert.equal(levelUpRec.targetTab, 'roadmap');
});

// ============================================================================
// 7. ANONYMOUS MERGE & ACCOUNT OPT-IN SYNC
// ============================================================================
test('Account Sync: validates and merges anonymous local attempts to user without data corruption', async () => {
  localStorage.clear();

  // Create an unauthenticated local attempt
  localStorage.setItem('hanzigo_hsk_attempts', JSON.stringify([
    {
      id: 'att-anon-merge-1',
      examId: 'hsk1-mock-01',
      userId: null,
      score: 150,
      maxScore: 200,
      createdAt: new Date().toISOString()
    }
  ]));

  localStorage.setItem('hanzigo_hsk_mistakes', JSON.stringify([
    {
      id: 'mst-anon-merge-1',
      questionId: 'q-101',
      userId: null,
      mistakeCount: 1,
      status: 'needs_review'
    }
  ]));

  // Execute explicit merge
  const targetUserId = 'usr-charlie-777';
  const mergeResult = await mergeLocalAttemptsToUser(targetUserId);

  assert.equal(mergeResult.success, true);
  assert.equal(mergeResult.mergedCount, 1);

  // Verify merged data in storage now carries the target userId
  const mergedAttempts = JSON.parse(localStorage.getItem('hanzigo_hsk_attempts'));
  assert.equal(mergedAttempts[0].userId, targetUserId);

  const mergedMistakes = JSON.parse(localStorage.getItem('hanzigo_hsk_mistakes'));
  assert.equal(mergedMistakes[0].userId, targetUserId);
});

// ============================================================================
// 8. SERVERLESS ROUTER DISPATCHING (PHASE 2 ENDPOINTS)
// ============================================================================
test('Serverless Router: dispatches history, mistakes, and analytics endpoints correctly', async () => {
  let statusCode = 0;
  let responseData = null;
  const mockRes = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseData = data; return data; }
      };
    }
  };

  // 1. History endpoint
  await hskRouter({
    url: '/api/hsk/history',
    method: 'GET',
    query: {}
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.ok(Array.isArray(responseData.history));

  // 2. Mistakes endpoint
  await hskRouter({
    url: '/api/hsk/mistakes',
    method: 'GET',
    query: { status: 'all' }
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.ok(Array.isArray(responseData.mistakes));

  // 3. Analytics endpoint
  await hskRouter({
    url: '/api/hsk/analytics',
    method: 'GET',
    query: {}
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.ok(responseData.analytics);
  assert.ok(Array.isArray(responseData.recommendations));
});
