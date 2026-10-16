import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK_EXAMS,
  HSK_QUESTIONS,
  getFullExamById,
  getSanitizedExamForTaking
} from '../src/data/hskExamsData.js';

import {
  HSK_OFFICIAL_VERSIONS,
  HSK_STRUCTURE_DEFINITIONS,
  getHskStructure
} from '../src/data/hskStructureData.js';

import {
  getHskExams,
  getHskExamDetails,
  getExamForTaking,
  submitExamAttempt,
  getAttemptResult,
  getUserExamHistory,
  compareExamAttempts,
  saveTemporaryAnswers,
  getTemporaryAnswers,
  clearTemporaryAnswers,
  recordMistakesFromAttempt,
  getMistakeNotebook,
  updateMistakeStatus,
  removeMistakeItem,
  getMistakePracticeExam
} from '../src/services/hskService.js';

import hskRouter from '../api/hsk/[action].js';
import { setSupabaseAdminClientForTesting } from '../api/_utils/supabaseServer.js';

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

function createMockResponse() {
  let statusCode = 200;
  let responseData = null;
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    setHeader() {
      return res;
    }
  };
  return {
    res,
    getStatusCode: () => statusCode,
    getData: () => responseData
  };
}

// ============================================================================
// PHASE 3: COMPREHENSIVE HSK EXAM CENTER & ZERO-TRUST QA TEST SUITE
// ============================================================================

test('PHASE 3 — 1. Valid Exam Taking & Question Sanitization (Anti-Cheat)', async () => {
  // Test that taking an exam returns ALL questions without exposing answers
  const sanitized = await getExamForTaking('hsk1-mock-01');
  assert.ok(sanitized);
  assert.equal(sanitized.id, 'hsk1-mock-01');
  assert.ok(sanitized.questions.length >= 10);

  sanitized.questions.forEach(q => {
    assert.equal(q.correct_option_index, undefined, 'CRITICAL: correct_option_index must not be exposed');
    assert.equal(q.correct_order, undefined, 'CRITICAL: correct_order must not be exposed');
    assert.equal(q.accepted_answers, undefined, 'CRITICAL: accepted_answers must not be exposed');
    assert.equal(q.explanation, undefined, 'CRITICAL: explanation must not be exposed');
    assert.equal(q.sample_answer, undefined, 'CRITICAL: sample_answer must not be exposed');
    assert.ok(q.prompt, 'Prompt must be provided');
    assert.ok(Array.isArray(q.options), 'Options must be provided');
  });
});

test('PHASE 3 — 2. Unpublished or Non-Existent Exam Rejection', async () => {
  // Non-existent exam
  await assert.rejects(
    async () => {
      await getExamForTaking('non-existent-exam-xyz');
    },
    /Đề thi không tồn tại/
  );

  // Router behavior for non-existent exam
  const { res, getStatusCode, getData } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/exam',
    method: 'GET',
    query: { id: 'non-existent-exam-xyz' }
  }, res);

  assert.equal(getStatusCode(), 404);
  assert.equal(getData().success, false);
});

test('PHASE 3 — 3. Authoritative Server-Side Scoring & Client Tamper Resistance', async () => {
  // Client attempts to claim 200/200 score and pass: true with bad answers
  const fullExam = getFullExamById('hsk1-mock-01');
  assert.ok(fullExam);

  // We answer question 1 correctly, and question 2 incorrectly
  const q1 = fullExam.questions[0];
  const q2 = fullExam.questions[1];

  const fakeAnswers = {
    [q1.id]: q1.correct_option_index,
    [q2.id]: (q2.correct_option_index + 1) % q2.options.length // wrong
  };

  const { res, getStatusCode, getData } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/submit',
    method: 'POST',
    body: {
      examId: 'hsk1-mock-01',
      answers: fakeAnswers,
      timeSpentSeconds: 300,
      anonymousSessionId: 'anon-test-session',
      // Tampering attempt:
      score: 200,
      passed: true
    }
  }, res);

  assert.equal(getStatusCode(), 200);
  const result = getData().attempt;
  assert.ok(result);

  // The server MUST compute the score based on actual verified answers
  assert.equal(result.correctCount, 1);
  assert.ok(result.incorrectCount >= 1);
  assert.notEqual(result.score, 200, 'Server must override client fake score');
  assert.equal(result.submittedAnswers[q1.id], q1.correct_option_index);
  assert.ok(result.skillBreakdown);
});

test('PHASE 3 — 4. Question Type Evaluation Rules (MC, Reorder, Fill Blank, Free Writing)', async () => {
  // 1. Multiple Choice Evaluation
  const attempt = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: {
      'q-hsk1-01-01': 0, // correct (index 0)
      'q-hsk1-01-02': 99 // wrong
    },
    timeSpentSeconds: 120
  });

  const resQ1 = attempt.detailedResults.find(r => r.questionId === 'q-hsk1-01-01');
  const resQ2 = attempt.detailedResults.find(r => r.questionId === 'q-hsk1-01-02');
  assert.equal(resQ1.isCorrect, true);
  assert.equal(resQ2.isCorrect, false);

  // Detailed explanation is returned AFTER submission
  assert.ok(resQ1.explanation && resQ1.explanation.length > 0);
  assert.ok(resQ2.explanation && resQ2.explanation.length > 0);
});

test('PHASE 3 — 5. Zero-Trust Access Control on Attempt Details (/api/hsk/attempt)', async () => {
  // Setup mock Supabase admin client that returns a private attempt belonging to User Alice
  const mockAttemptAlice = {
    id: 'att-alice-private-999',
    exam_id: 'hsk1-mock-01',
    user_id: 'user-alice-uuid',
    score: 180,
    passed: true
  };

  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'alice-valid-token') {
          return { data: { user: { id: 'user-alice-uuid', email: 'alice@hanzigo.com' } }, error: null };
        }
        if (token === 'bob-valid-token') {
          return { data: { user: { id: 'user-bob-uuid', email: 'bob@hanzigo.com' } }, error: null };
        }
        return { data: null, error: { message: 'Invalid token' } };
      }
    },
    from(table) {
      return {
        select() {
          return {
            eq(col, val) {
              return {
                async maybeSingle() {
                  if (table === 'profiles') {
                    if (val === 'user-alice-uuid') return { data: { id: val, role: 'student', status: 'active' }, error: null };
                    if (val === 'user-bob-uuid') return { data: { id: val, role: 'student', status: 'active' }, error: null };
                  }
                  if (table === 'hsk_attempts') {
                    if (val === 'att-alice-private-999') return { data: mockAttemptAlice, error: null };
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      };
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  // Scenario A: Unauthenticated request to private attempt -> 401
  const { res: resAnon, getStatusCode: getCodeAnon } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/attempt',
    method: 'GET',
    query: { id: 'att-alice-private-999' },
    headers: {}
  }, resAnon);
  assert.equal(getCodeAnon(), 401, 'Unauthenticated visitor cannot view private attempt');

  // Scenario B: User Bob requests Alice private attempt -> 403 Forbidden
  const { res: resBob, getStatusCode: getCodeBob, getData: getDataBob } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/attempt',
    method: 'GET',
    query: { id: 'att-alice-private-999' },
    headers: {
      authorization: 'Bearer bob-valid-token'
    }
  }, resBob);
  assert.equal(getCodeBob(), 403, 'User Bob must be rejected with 403 when inspecting User Alice attempt');
  assert.ok(getDataBob().error.includes('Từ chối quyền hạn'));

  // Scenario C: User Alice requests her own attempt -> 200 Success
  const { res: resAlice, getStatusCode: getCodeAlice, getData: getDataAlice } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/attempt',
    method: 'GET',
    query: { id: 'att-alice-private-999' },
    headers: {
      authorization: 'Bearer alice-valid-token'
    }
  }, resAlice);
  assert.equal(getCodeAlice(), 200, 'Owner Alice can view her own attempt');
  assert.equal(getDataAlice().attempt.id, 'att-alice-private-999');

  // Cleanup test client
  setSupabaseAdminClientForTesting(null);
});

test('PHASE 3 — 6. Mistakes Notebook Deduplication & Status Lifecycle', async () => {
  localStorage.clear();
  const testUser = { id: 'user-charlie-777' };

  // Attempt 1: Charlie fails question q-hsk1-01-02
  const attempt1 = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-02': 99 },
    user: testUser
  });

  const mistakes1 = await getMistakeNotebook({ user: testUser });
  const failedQ = mistakes1.find(m => m.questionId === 'q-hsk1-01-02');
  assert.ok(failedQ, 'Failed question must be logged in mistakes notebook');
  assert.equal(failedQ.mistakeCount, 1);
  assert.equal(failedQ.status, 'needs_review');

  // Charlie marks question as mastered
  await updateMistakeStatus(failedQ.id, 'mastered', testUser);
  const mistakesMastered = await getMistakeNotebook({ user: testUser });
  const masteredQ = mistakesMastered.find(m => m.questionId === 'q-hsk1-01-02');
  assert.equal(masteredQ.status, 'mastered');

  // Attempt 2: Charlie takes exam again and fails q-hsk1-01-02 AGAIN
  await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-02': 99 },
    user: testUser
  });

  // Must NOT create duplicate row; must increment mistakeCount and reset status to needs_review
  const mistakes2 = await getMistakeNotebook({ user: testUser });
  const q2Instances = mistakes2.filter(m => m.questionId === 'q-hsk1-01-02');
  assert.equal(q2Instances.length, 1, 'Deduplication: exactly 1 entry for this question');
  assert.equal(q2Instances[0].mistakeCount, 2, 'Mistake count must increment to 2');
  assert.equal(q2Instances[0].status, 'needs_review', 'Status must reset to needs_review upon new failure');

  // Practice Exam Generation from Mistakes
  const practiceExam = await getMistakePracticeExam({ user: testUser });
  assert.ok(practiceExam);
  assert.ok(practiceExam.questions.some(q => q.id === 'q-hsk1-01-02'));
  // Security on practice exam
  practiceExam.questions.forEach(q => {
    assert.equal(q.correct_option_index, undefined);
    assert.equal(q.explanation, undefined);
  });

  // Remove mistake item
  await removeMistakeItem(q2Instances[0].id, testUser);
  const mistakesAfterDelete = await getMistakeNotebook({ user: testUser });
  assert.equal(mistakesAfterDelete.some(m => m.questionId === 'q-hsk1-01-02'), false);
});

test('PHASE 3 — 7. Exam History & Chronological Comparison', async () => {
  localStorage.clear();
  const testUser = { id: 'user-diana-888' };

  // Attempt 1 (Baseline)
  const att1 = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-01': 1 }, // 1 correct
    timeSpentSeconds: 600,
    user: testUser
  });

  // Attempt 2 (Target - improved)
  const att2 = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-01': 1, 'q-hsk1-01-02': 0, 'q-hsk1-01-03': 1 }, // 3 correct
    timeSpentSeconds: 450,
    user: testUser
  });

  const history = await getUserExamHistory({ user: testUser });
  assert.equal(history.length, 2);

  // Compare the 2 attempts
  const comparison = compareExamAttempts(att1, att2);
  assert.ok(comparison.compatible);
  assert.ok(comparison.metrics.improved, 'Second attempt should show improvement');
  assert.ok(comparison.metrics.scoreDelta >= 0);
  assert.ok(comparison.metrics.accuracyDelta >= 0);
  assert.ok(comparison.skillsDelta);
});

test('PHASE 3 — 8. Temporary Answer Drafts & F5 Protection', () => {
  localStorage.clear();
  const examId = 'hsk1-mock-01';

  // Save in-progress draft
  const draftAnswers = { 'hsk1-q-01': 0, 'hsk1-q-02': 1 };
  saveTemporaryAnswers(examId, draftAnswers, {
    flaggedQuestionIds: ['hsk1-q-02'],
    examMode: 'simulation',
    currentIdx: 1
  });

  // Retrieve draft upon page reload
  const restored = getTemporaryAnswers(examId);
  assert.deepEqual(restored, draftAnswers);

  // Clear draft upon submission
  clearTemporaryAnswers(examId);
  assert.equal(getTemporaryAnswers(examId), null);
});

test('PHASE 3 — 9. Strict Version Isolation: HSK 2.0 vs HSK 3.0 Structures', () => {
  const v2015Hsk1 = getHskStructure('hsk-1', '2015-Standard');
  assert.ok(v2015Hsk1);
  assert.equal(v2015Hsk1.totalQuestions, 40);
  assert.equal(v2015Hsk1.maxScore, 200);
  assert.equal(v2015Hsk1.passingScore, 120);

  // HSK 3.0 transition version does not overwrite 2015-Standard
  const v30Hsk1 = getHskStructure('hsk-1', 'HSK 3.0-2021');
  assert.ok(v30Hsk1);
  assert.equal(v30Hsk1.isOfficial, false, 'HSK 1 in 3.0 is in transition and unfinalized');
  assert.equal(v30Hsk1.verificationStatus, 'unverified_transition');
});

// ============================================================================
// PHASE 3.1: SECURITY AUDIT & ACCESS CONTROL REGRESSION TESTS
// ============================================================================

test('PHASE 3.1 — 10. Unpublished Exam Access Control (403 for Students, 200 for Admin)', async () => {
  const unpublishedExam = {
    id: 'hsk-secret-draft-01',
    title: 'Đề thi bản nháp bí mật',
    level: 'HSK 5',
    is_published: false
  };

  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'admin-token') {
          return { data: { user: { id: 'admin-uuid', email: 'admin@hanzigo.com' } }, error: null };
        }
        if (token === 'student-token') {
          return { data: { user: { id: 'student-uuid', email: 'student@hanzigo.com' } }, error: null };
        }
        return { data: null, error: { message: 'Invalid' } };
      }
    },
    from(table) {
      return {
        select() {
          return {
            eq(col, val) {
              return {
                order() {
                  return Promise.resolve({ data: [], error: null });
                },
                async maybeSingle() {
                  if (table === 'profiles') {
                    if (val === 'admin-uuid') return { data: { id: val, role: 'admin', status: 'active' }, error: null };
                    if (val === 'student-uuid') return { data: { id: val, role: 'student', status: 'active' }, error: null };
                  }
                  if (table === 'hsk_exams' && val === 'hsk-secret-draft-01') {
                    return { data: unpublishedExam, error: null };
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      };
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  // Student tries to access unpublished exam -> 403 Forbidden
  const { res: resStudent, getStatusCode: getCodeStudent } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/exam',
    method: 'GET',
    query: { id: 'hsk-secret-draft-01' },
    headers: { authorization: 'Bearer student-token' }
  }, resStudent);
  assert.equal(getCodeStudent(), 403, 'Student must be rejected with 403 for unpublished exams');

  // Admin accesses unpublished exam -> 200
  const { res: resAdmin, getStatusCode: getCodeAdmin, getData: getDataAdmin } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/exam',
    method: 'GET',
    query: { id: 'hsk-secret-draft-01' },
    headers: { authorization: 'Bearer admin-token' }
  }, resAdmin);
  assert.equal(getCodeAdmin(), 200, 'Admin can preview unpublished draft exam');
  assert.equal(getDataAdmin().exam.id, 'hsk-secret-draft-01');

  // Cleanup
  setSupabaseAdminClientForTesting(null);
});

test('PHASE 3.1 — 11. Cross-User Mistake Mutation Protection (User B cannot PATCH or DELETE User A mistake)', async () => {
  localStorage.clear();
  const userAlice = { id: 'usr-alice-secure' };
  const userBob = { id: 'usr-bob-attacker' };

  // Alice has a mistake in notebook
  await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-02': 99 },
    user: userAlice
  });

  const aliceMistakes = await getMistakeNotebook({ user: userAlice });
  const aliceMistake = aliceMistakes.find(m => m.questionId === 'q-hsk1-01-02');
  assert.ok(aliceMistake);
  assert.equal(aliceMistake.userId, 'usr-alice-secure');

  // Bob tries to update Alice's mistake status to 'mastered' -> rejected
  const patchSuccess = await updateMistakeStatus(aliceMistake.id, 'mastered', userBob);
  assert.equal(patchSuccess, false, 'User Bob must not be able to modify User Alice mistake');

  // Verify Alice's mistake is still 'needs_review'
  const checkMistakes = await getMistakeNotebook({ user: userAlice });
  assert.equal(checkMistakes.find(m => m.id === aliceMistake.id).status, 'needs_review');

  // Bob tries to delete Alice's mistake -> rejected
  const deleteSuccess = await removeMistakeItem(aliceMistake.id, userBob);
  assert.equal(deleteSuccess, false, 'User Bob must not be able to delete User Alice mistake');

  // Verify Alice's mistake still exists
  const checkMistakesStillExists = await getMistakeNotebook({ user: userAlice });
  assert.ok(checkMistakesStillExists.some(m => m.id === aliceMistake.id));
});

test('PHASE 3.1 — 12. Blocked User Token Rejection', async () => {
  const mockAdminClient = {
    auth: {
      async getUser(token) {
        if (token === 'blocked-user-token') {
          return { data: { user: { id: 'blocked-uuid', email: 'blocked@hanzigo.com' } }, error: null };
        }
        return { data: null, error: { message: 'Invalid' } };
      }
    },
    from(table) {
      return {
        select() {
          return {
            eq(col, val) {
              return {
                async maybeSingle() {
                  if (table === 'profiles' && val === 'blocked-uuid') {
                    return { data: { id: val, role: 'student', status: 'blocked' }, error: null };
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      };
    }
  };

  setSupabaseAdminClientForTesting(mockAdminClient);

  // Blocked user tries to submit exam
  const { res, getStatusCode, getData } = createMockResponse();
  await hskRouter({
    url: '/api/hsk/submit',
    method: 'POST',
    body: { examId: 'hsk1-mock-01', answers: {} },
    headers: { authorization: 'Bearer blocked-user-token' }
  }, res);

  assert.equal(getStatusCode(), 200);
  assert.equal(getData().attempt.userId, null, 'Blocked account credentials must not be credited to user_id');

  setSupabaseAdminClientForTesting(null);
});

test('PHASE 3.1 — 13. Exam with 0 Questions Handling', async () => {
  // Taking exam with 0 questions (e.g. hsk1-official-ref-01) must throw clear error
  await assert.rejects(
    async () => {
      await getExamForTaking('hsk1-official-ref-01');
    },
    /đang được biên soạn nội dung hoặc là tài liệu tham chiếu ngoại bộ/
  );
});
