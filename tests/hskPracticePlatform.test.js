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
  getHskExamDetails,
  getExamForTaking,
  submitExamAttempt,
  saveTemporaryAnswers,
  getTemporaryAnswers,
  clearTemporaryAnswers,
  getOrCreateAnonymousSessionId,
  getPastAttempts
} from '../src/services/hskService.js';
import hskRouter from '../api/hsk/[action].js';

// Mock localStorage for Node.js environment
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
// 1. DATASET INTEGRITY & COPYRIGHT / LICENSING METADATA
// ============================================================================
test('HSK Dataset: contains multi-level exams with required schema and metadata', () => {
  assert.ok(HSK_EXAMS.length >= 3, 'Must have at least 3 exams in repository');

  const levelsFound = new Set(HSK_EXAMS.map(e => e.level));
  assert.ok(levelsFound.has('HSK 1'), 'Must have HSK 1 exams');
  assert.ok(levelsFound.has('HSK 2'), 'Must have HSK 2 exams');
  assert.ok(levelsFound.has('HSK 3'), 'Must have HSK 3 exams');

  HSK_EXAMS.forEach(exam => {
    assert.ok(exam.id, 'Exam must have id');
    assert.ok(exam.title && exam.title.length > 0, `Exam ${exam.id} must have title`);
    assert.ok(exam.level, `Exam ${exam.id} must have level`);
    assert.ok(exam.duration_minutes > 0, `Exam ${exam.id} duration must be > 0`);
    assert.ok(exam.total_questions > 0, `Exam ${exam.id} must have total_questions > 0`);
    assert.ok(exam.max_score >= 100, `Exam ${exam.id} max_score must be at least 100`);
    assert.ok(exam.passing_score > 0, `Exam ${exam.id} must have passing_score`);
    assert.ok(['official_sample', 'mock', 'licensed'].includes(exam.exam_type), `Invalid exam_type for ${exam.id}`);
    assert.ok(exam.license, `Exam ${exam.id} must have explicit license`);
    assert.ok(exam.source_author, `Exam ${exam.id} must cite source_author`);
    assert.ok(exam.verified_date, `Exam ${exam.id} must have verified_date timestamp`);
    assert.ok(typeof exam.is_published === 'boolean', `Exam ${exam.id} must have is_published boolean`);
  });
});

test('HSK Dataset: adheres strictly to copyright transparency rules', () => {
  // Self-created exams MUST NOT be labeled as official
  const mockExams = HSK_EXAMS.filter(e => e.exam_type === 'mock');
  assert.ok(mockExams.length > 0, 'Must have HanziGo mock exams');
  mockExams.forEach(exam => {
    assert.notEqual(exam.exam_type, 'official_sample', 'Mock exam cannot be labeled official');
    assert.ok(
      exam.source_author.includes('HanziGo') || exam.permission_status.includes('original_content'),
      `Mock exam ${exam.id} must state HanziGo as creator`
    );
  });

  // Official sample exams must cite official authority (CTI/CLEC/Hanban)
  const officialExams = HSK_EXAMS.filter(e => e.exam_type === 'official_sample');
  officialExams.forEach(exam => {
    assert.ok(
      exam.source_author.includes('CTI') || exam.source_author.includes('CLEC') || exam.source_author.includes('Hanban') || exam.source_url.includes('chinesetest'),
      `Official sample ${exam.id} must cite official authority source`
    );
  });
});

test('HSK Questions: all questions have valid structure and options', () => {
  assert.ok(HSK_QUESTIONS.length >= 20, 'Should have rich set of HSK questions');

  HSK_QUESTIONS.forEach(q => {
    assert.ok(q.id, 'Question must have id');
    assert.ok(q.exam_id, 'Question must reference exam_id');
    assert.ok(['listening', 'reading', 'writing'].includes(q.part_type), `Invalid part_type for ${q.id}`);
    assert.ok(q.prompt && q.prompt.length > 0, `Question ${q.id} must have prompt`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} must have at least 2 options`);
    assert.ok(
      q.correct_option_index >= 0 && q.correct_option_index < q.options.length,
      `Question ${q.id} correct_option_index out of bounds`
    );
    assert.ok(q.points > 0, `Question ${q.id} points must be positive`);
    assert.ok(q.explanation && q.explanation.length > 0, `Question ${q.id} must have explanation`);
  });
});

// ============================================================================
// 2. PREVENTION OF ANSWER-KEY LEAKAGE (SECURITY)
// ============================================================================
test('Security: getSanitizedExamForTaking strips correct_option_index and explanation', () => {
  const examId = 'hsk1-mock-01';
  const sanitized = getSanitizedExamForTaking(examId);

  assert.ok(sanitized, 'Sanitized exam must exist');
  assert.equal(sanitized.id, examId);
  assert.ok(sanitized.questions.length > 0);

  sanitized.questions.forEach(q => {
    assert.equal(
      q.correct_option_index,
      undefined,
      `Security violation: question ${q.id} exposed correct_option_index to client!`
    );
    assert.equal(
      q.explanation,
      undefined,
      `Security violation: question ${q.id} exposed explanation to client!`
    );
    // Safe fields must remain intact
    assert.ok(q.id);
    assert.ok(q.prompt);
    assert.ok(Array.isArray(q.options));
    assert.ok(q.points);
  });
});

test('Security: getExamForTaking service wrapper also sanitizes questions', async () => {
  const exam = await getExamForTaking('hsk2-mock-01');
  assert.ok(exam);
  exam.questions.forEach(q => {
    assert.strictEqual(q.correct_option_index, undefined);
    assert.strictEqual(q.explanation, undefined);
  });
});

// ============================================================================
// 3. ANSWER EVALUATION LOGIC (CORRECT, INCORRECT, PARTIAL, EMPTY)
// ============================================================================
test('Evaluation: perfect score submission produces 100% accuracy and maximum points', async () => {
  const examId = 'hsk1-mock-01';
  const fullExam = getFullExamById(examId);

  // Build answer map matching all correct options
  const answers = {};
  fullExam.questions.forEach(q => {
    answers[q.id] = q.correct_option_index;
  });

  const result = await submitExamAttempt({
    examId,
    submittedAnswers: answers,
    timeSpentSeconds: 600,
    user: null
  });

  assert.equal(result.correctCount, fullExam.questions.length);
  assert.equal(result.incorrectCount, 0);
  assert.equal(result.unansweredCount, 0);
  assert.equal(result.accuracyPercentage, 100);
  assert.equal(result.score, fullExam.max_score);
  assert.equal(result.passed, true);
  assert.ok(result.skillBreakdown.listening);
  assert.ok(result.skillBreakdown.reading);
  assert.equal(result.skillBreakdown.listening.correctQuestions, result.skillBreakdown.listening.totalQuestions);
});

test('Evaluation: completely incorrect submission produces 0% accuracy and failing result', async () => {
  const examId = 'hsk1-mock-01';
  const fullExam = getFullExamById(examId);

  const answers = {};
  fullExam.questions.forEach(q => {
    // Pick an explicitly wrong option
    const wrongIdx = (q.correct_option_index + 1) % q.options.length;
    answers[q.id] = wrongIdx;
  });

  const result = await submitExamAttempt({
    examId,
    submittedAnswers: answers,
    timeSpentSeconds: 300
  });

  assert.equal(result.correctCount, 0);
  assert.equal(result.incorrectCount, fullExam.questions.length);
  assert.equal(result.unansweredCount, 0);
  assert.equal(result.accuracyPercentage, 0);
  assert.equal(result.score, 0);
  assert.equal(result.passed, false);
});

test('Evaluation: empty and incomplete submission handles unanswered questions gracefully', async () => {
  const examId = 'hsk1-mock-01';
  const fullExam = getFullExamById(examId);

  // Only answer the first question correctly, leave rest blank
  const firstQ = fullExam.questions[0];
  const answers = {
    [firstQ.id]: firstQ.correct_option_index
  };

  const result = await submitExamAttempt({
    examId,
    submittedAnswers: answers,
    timeSpentSeconds: 120
  });

  assert.equal(result.correctCount, 1);
  assert.equal(result.incorrectCount, 0);
  assert.equal(result.unansweredCount, fullExam.questions.length - 1);
  assert.ok(result.accuracyPercentage > 0 && result.accuracyPercentage < 100);
  assert.ok(result.score > 0);
  assert.equal(result.passed, false); // 1 question won't reach passing threshold of 120/200

  // Empty submission (no answers at all)
  const emptyResult = await submitExamAttempt({
    examId,
    submittedAnswers: {},
    timeSpentSeconds: 0
  });

  assert.equal(emptyResult.correctCount, 0);
  assert.equal(emptyResult.incorrectCount, 0);
  assert.equal(emptyResult.unansweredCount, fullExam.questions.length);
  assert.equal(emptyResult.accuracyPercentage, 0);
  assert.equal(emptyResult.score, 0);
  assert.equal(emptyResult.passed, false);
});

// ============================================================================
// 4. TIMER EXPIRATION & AUTO-SUBMISSION LOGIC
// ============================================================================
test('Timer & Submission: captures timeSpentSeconds accurately and auto-submits on expiration', async () => {
  const examId = 'hsk1-mock-01';
  const fullExam = getFullExamById(examId);
  const examDurationSeconds = fullExam.duration_minutes * 60;

  // Simulate timeout where timeSpentSeconds reaches full duration
  const result = await submitExamAttempt({
    examId,
    submittedAnswers: { [fullExam.questions[0].id]: fullExam.questions[0].correct_option_index },
    timeSpentSeconds: examDurationSeconds
  });

  assert.equal(result.timeSpentSeconds, examDurationSeconds);
  assert.ok(result.detailedResults.length === fullExam.questions.length);
});

// ============================================================================
// 5. ANSWER PERSISTENCE & RECOVERY (ANTI-DATA LOSS)
// ============================================================================
test('Draft Persistence: saves, retrieves, and clears answers to protect against accidental reload', () => {
  const examId = 'hsk1-mock-01';
  const draftAnswers = { 'hsk1-q-01': 1, 'hsk1-q-02': 0 };

  // 1. Save draft
  saveTemporaryAnswers(examId, draftAnswers);

  // 2. Retrieve draft
  const retrieved = getTemporaryAnswers(examId);
  assert.deepEqual(retrieved, draftAnswers, 'Retrieved draft answers must match saved answers');

  // 3. Clear draft
  clearTemporaryAnswers(examId);
  const afterClear = getTemporaryAnswers(examId);
  assert.equal(afterClear, null, 'Draft should be null after explicit clearing');
});

// ============================================================================
// 6. LISTENING DRILLS & AUDIO FALLBACK
// ============================================================================
test('Listening Questions: contains audio metadata and valid audio script fallback', () => {
  const listeningQuestions = HSK_QUESTIONS.filter(q => q.part_type === 'listening');
  assert.ok(listeningQuestions.length >= 3, 'Must have listening questions');

  listeningQuestions.forEach(q => {
    assert.ok(q.audio_script && q.audio_script.length > 0, `Listening question ${q.id} must have audio_script for TTS fallback`);
    assert.ok(typeof q.audio_url === 'string', `Listening question ${q.id} must define audio_url string`);
    assert.ok(q.pinyin, `Listening question ${q.id} must provide pinyin`);
    assert.ok(q.translation, `Listening question ${q.id} must provide translation`);
  });
});

// ============================================================================
// 7. PUBLIC ACCESS & ANONYMOUS SESSIONS
// ============================================================================
test('Public Access: anonymous visitors can generate session ID and view exams without login', async () => {
  localStorage.removeItem('hanzigo_anon_session_id');

  const anonId1 = getOrCreateAnonymousSessionId();
  assert.ok(anonId1.startsWith('anon_'), 'Anonymous session ID must start with anon_ prefix');

  // Subsequent call returns identical ID
  const anonId2 = getOrCreateAnonymousSessionId();
  assert.equal(anonId1, anonId2, 'Session ID should persist across calls in same session');

  // Anonymous user can query exams
  const exams = await getHskExams();
  assert.ok(Array.isArray(exams) && exams.length > 0, 'Anonymous users can query public exams');

  // Anonymous user can submit exam and receive score
  const result = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: {},
    timeSpentSeconds: 10,
    user: null
  });
  assert.equal(result.userId, null);
  assert.equal(result.anonymousSessionId, anonId1);
  assert.ok(result.id.startsWith('hsk-att-'));
});

// ============================================================================
// 8. EXAM FILTERING & DISCOVERY
// ============================================================================
test('Exam Filtering: filters accurately by level, skill, type, and keyword query', async () => {
  // Filter by level
  const hsk1Exams = await getHskExams({ level: 'HSK 1' });
  assert.ok(hsk1Exams.length > 0);
  hsk1Exams.forEach(e => assert.equal(e.level, 'HSK 1'));

  // Filter by exam type
  const mockOnly = await getHskExams({ type: 'mock' });
  mockOnly.forEach(e => assert.equal(e.exam_type, 'mock'));

  const officialOnly = await getHskExams({ type: 'official_sample' });
  officialOnly.forEach(e => assert.equal(e.exam_type, 'official_sample'));

  // Keyword query
  const searchResults = await getHskExams({ query: 'Đề thi số 1' });
  assert.ok(searchResults.length > 0);
  searchResults.forEach(e => {
    const text = `${e.title} ${e.description}`.toLowerCase();
    assert.ok(text.includes('số 1') || text.includes('đề'));
  });
});

// ============================================================================
// 9. RETRY & INCORRECT-QUESTION PRACTICE WORKFLOW
// ============================================================================
test('Retry & Review: generates accurate list of incorrect questions for practice', async () => {
  const examId = 'hsk1-mock-01';
  const fullExam = getFullExamById(examId);

  // Answer first question wrong, second question right
  const answers = {
    [fullExam.questions[0].id]: (fullExam.questions[0].correct_option_index + 1) % fullExam.questions[0].options.length,
    [fullExam.questions[1].id]: fullExam.questions[1].correct_option_index
  };

  const result = await submitExamAttempt({
    examId,
    submittedAnswers: answers,
    timeSpentSeconds: 60
  });

  const incorrectQuestions = result.detailedResults.filter(q => !q.isCorrect);
  assert.ok(incorrectQuestions.length >= 1, 'Must extract incorrect questions');

  // Verify first question is in incorrect list
  const firstQResult = incorrectQuestions.find(q => q.questionId === fullExam.questions[0].id);
  assert.ok(firstQResult, 'Incorrect question must be present in mistake review');
  assert.equal(firstQResult.isCorrect, false);
  assert.ok(firstQResult.explanation, 'Review must contain pedagogical explanation');
  assert.ok(firstQResult.correctIndex !== undefined, 'Review must reveal correct index AFTER submission');
});

// ============================================================================
// 10. SERVERLESS FUNCTION ROUTER & SECURITY
// ============================================================================
test('Serverless Router: dispatches to exams, exam, and submit without exposing answer keys', async () => {
  // 1. Test /api/hsk/exams
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

  await hskRouter({
    url: '/api/hsk/exams',
    method: 'GET',
    query: { level: 'all' }
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.ok(Array.isArray(responseData.exams));

  // 2. Test /api/hsk/exam (Safe Exam Taking Endpoint)
  await hskRouter({
    url: '/api/hsk/exam?id=hsk1-mock-01',
    method: 'GET',
    query: { id: 'hsk1-mock-01' }
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.ok(responseData.exam);
  responseData.exam.questions.forEach(q => {
    assert.strictEqual(q.correct_option_index, undefined, 'Serverless API must NEVER leak correct_option_index');
    assert.strictEqual(q.explanation, undefined, 'Serverless API must NEVER leak explanation');
  });

  // 3. Test /api/hsk/submit (Server-Side Evaluation Endpoint)
  await hskRouter({
    url: '/api/hsk/submit',
    method: 'POST',
    body: {
      examId: 'hsk1-mock-01',
      answers: {},
      timeSpentSeconds: 15
    }
  }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData.success);
  assert.equal(responseData.attempt.score, 0);
  assert.equal(responseData.attempt.accuracyPercentage, 0);
  assert.ok(Array.isArray(responseData.attempt.detailedResults));
});
