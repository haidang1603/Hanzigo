import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SNAPSHOT_VERSION,
  MAX_LOCAL_SNAPSHOT_ATTEMPTS,
  buildQuestionAnswerSnapshot,
  buildAttemptAnswerSnapshots,
  compactAttemptsForLocalStorage,
  resolveReviewItemsFromAttempt,
} from '../src/utils/examAttemptSnapshot.js';
import submitHandler from '../api/_handlers/hsk/submit.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

test('1. Zero Index Drift: review from answerSnapshots remains 100% accurate after bank options are reordered', () => {
  const bankQuestions = [
    {
      id: 'q-drift-01',
      question_number: 1,
      part_type: 'reading',
      part_number: 1,
      question_type: 'multiple_choice',
      prompt: '请选择正确答案：他每天早上___跑步。',
      options: [
        { text: 'A. 都去公园' },
        { text: 'B. 正在睡觉' },
        { text: 'C. 昨天吃饭' },
        { text: 'D. 明天看书' },
      ],
      correct_option_index: 0,
      explanation: 'Đáp án A phù hợp với thói quen hàng ngày (每天早上).',
      points: 10,
    },
  ];

  // Learner selects index 1 (wrong answer: B. 正在睡觉)
  const answers = { 'q-drift-01': 1 };
  const detailedResults = [
    {
      questionId: 'q-drift-01',
      questionNumber: 1,
      userAnswer: 1,
      isCorrect: false,
      pointsAwarded: 0,
    },
  ];

  const answerSnapshots = buildAttemptAnswerSnapshots(bankQuestions, {
    answers,
    detailedResults,
  });

  const frozenAttempt = {
    id: 'att-drift-test',
    examId: 'hsk1-mock-01',
    score: 0,
    maxScore: 10,
    answerSnapshots,
    detailedResults: [],
  };

  // Simulate future bank reorder: reverse options & change correct_option_index to 3
  bankQuestions[0].options.reverse();
  bankQuestions[0].correct_option_index = 3;
  bankQuestions[0].explanation = 'Đáp án D sau khi đảo lại kho đề.';

  // Review must still reflect the exact frozen state at submission time
  const reviewItems = resolveReviewItemsFromAttempt(frozenAttempt);
  assert.equal(reviewItems.length, 1);
  assert.equal(reviewItems[0].fromImmutableSnapshot, true);
  assert.equal(reviewItems[0].selectedIndex, 1);
  assert.equal(reviewItems[0].selectedText, 'B. 正在睡觉');
  assert.equal(reviewItems[0].correctIndex, 0);
  assert.equal(reviewItems[0].correctText, 'A. 都去公园');
  assert.equal(reviewItems[0].isCorrect, false);
  assert.equal(reviewItems[0].options[0].text, 'A. 都去公园');
  assert.equal(reviewItems[0].options[1].text, 'B. 正在睡觉');
  assert.match(reviewItems[0].explanation, /Đáp án A/);
});

test('2. Server-Authoritative Guard: /api/hsk/submit ignores spoofed client isCorrect/correctText/answerSnapshots', async () => {
  const req = {
    method: 'POST',
    headers: {},
    body: {
      examId: 'hsk1-mock-01',
      // q-hsk1-01-01 is true_false with correct_option_index = 0; client sends wrong index 1
      answers: { 'q-hsk1-01-01': 1 },
      timeSpentSeconds: 120,
      anonymousSessionId: 'anon-snap-guard-test',
      examMode: 'simulation',
      attemptId: `hsk-att-guard-${Date.now()}`,
      // Spoofed client fields that server MUST ignore:
      isCorrect: true,
      correctText: 'FAKE_CORRECT_TEXT',
      scoreAwarded: 200,
      answerSnapshots: [
        {
          snapshotVersion: 1,
          questionId: 'q-hsk1-01-01',
          isCorrect: true,
          correctText: 'SPOOFED',
        },
      ],
    },
  };
  const res = createMockRes();

  await submitHandler(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body?.success, true);

  const attempt = res.body.attempt;
  assert.ok(Array.isArray(attempt.answerSnapshots), 'Server must generate answerSnapshots');
  assert.ok(attempt.answerSnapshots.length > 0);

  const q1Snap = attempt.answerSnapshots.find((s) => s.questionId === 'q-hsk1-01-01');
  assert.ok(q1Snap, 'Expected snapshot for q-hsk1-01-01');
  assert.equal(q1Snap.snapshotVersion, SNAPSHOT_VERSION);
  assert.equal(q1Snap.selectedIndex, 1);
  assert.equal(q1Snap.correctIndex, 0);
  assert.equal(q1Snap.isCorrect, false, 'Server must not trust spoofed isCorrect: true');
  assert.notEqual(q1Snap.correctText, 'SPOOFED');
  assert.notEqual(q1Snap.correctText, 'FAKE_CORRECT_TEXT');
  assert.ok(q1Snap.correctText.length > 0);
});

test('3. Subjective Snapshot: freezes submittedText, scoreAwarded, gradingSource, feedbackVi and strips base64', () => {
  const essayQ = {
    id: 'q-sub-essay',
    skill: 'writing',
    part: 2,
    questionType: 'essay',
    prompt: '请写一篇关于环境保护的短文 data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==',
    sampleAnswer: '保护环境是每个人的责任。',
    points: 20,
  };
  const transQ = {
    id: 'q-sub-trans',
    skill: 'translation',
    part: 1,
    questionType: 'translation',
    prompt: '请将下列句子翻译成中文。',
    sampleAnswer: '科技发展改变了生活方式。',
    points: 15,
  };
  const speakQ = {
    id: 'q-sub-speak',
    skill: 'speaking',
    part: 1,
    questionType: 'speaking',
    prompt: '请口头回答问题。',
    points: 10,
  };

  const essaySnap = buildQuestionAnswerSnapshot(essayQ, {
    userAnswer: '我们应该从节约用水做起，保护地球家园。',
    subjectiveGrade: {
      overallScore: 85,
      source: 'ai_rubric',
      feedbackVi: 'Bố cục rõ ràng, dùng từ chuẩn HSK 5.',
    },
  });
  assert.equal(essaySnap.snapshotVersion, 1);
  assert.equal(essaySnap.questionType, 'essay');
  assert.equal(essaySnap.submittedText, '我们应该从节约用水做起，保护地球家园。');
  assert.equal(essaySnap.scoreAwarded, 17);
  assert.equal(essaySnap.maxScore, 20);
  assert.equal(essaySnap.gradingSource, 'ai_rubric');
  assert.equal(essaySnap.feedbackVi, 'Bố cục rõ ràng, dùng từ chuẩn HSK 5.');
  assert.ok(!essaySnap.promptSnapshot.includes('base64,'), 'Must strip inline base64 data URI');

  const transSnap = buildQuestionAnswerSnapshot(transQ, {
    userAnswer: '科技发展改变了我们的生活。',
    subjectiveGrade: { overallScore: 70, source: 'deterministic_fallback', feedbackVi: 'Đạt yêu cầu.' },
  });
  assert.equal(transSnap.questionType, 'translation');
  assert.equal(transSnap.gradingSource, 'deterministic_fallback');
  assert.equal(transSnap.scoreAwarded, 10.5);

  const speakSnap = buildQuestionAnswerSnapshot(speakQ, {
    userAnswer: '',
  });
  assert.equal(speakSnap.questionType, 'speaking');
  assert.equal(speakSnap.gradingSource, 'skipped');
  assert.equal(speakSnap.submittedText, '');
});

test('4. Legacy Compatibility: attempts without answerSnapshots fall back cleanly to detailedResults', () => {
  const legacyAttempt = {
    id: 'hsk-att-legacy-01',
    examId: 'hsk1-mock-01',
    score: 160,
    maxScore: 200,
    passed: true,
    answerSnapshots: null,
    detailedResults: [
      {
        questionId: 'q-legacy-1',
        questionNumber: 1,
        prompt: '你好',
        options: [{ text: 'Xin chào' }, { text: 'Tạm biệt' }],
        selectedIndex: 0,
        correctIndex: 0,
        isCorrect: true,
        explanation: '你好 nghĩa là Xin chào.',
      },
    ],
  };

  const reviewItems = resolveReviewItemsFromAttempt(legacyAttempt);
  assert.equal(reviewItems.length, 1);
  assert.equal(reviewItems[0].questionId, 'q-legacy-1');
  assert.equal(reviewItems[0].isCorrect, true);
  assert.equal(reviewItems[0].fromImmutableSnapshot, undefined);

  assert.deepEqual(resolveReviewItemsFromAttempt(null), []);
  assert.deepEqual(resolveReviewItemsFromAttempt({}), []);
});

test('5. Storage Quota Cap: prunes old answerSnapshots beyond cap while preserving totals and skillBreakdown', () => {
  const attempts = Array.from({ length: 20 }, (_, i) => ({
    id: `att-${i + 1}`,
    examId: 'dual-hsk_3_0-hsk1-full_exam',
    examSystem: 'hsk_3_0',
    practiceMode: 'exam',
    score: 180 - i,
    maxScore: 200,
    passed: true,
    skillBreakdown: { listening: { correctQuestions: 10, totalQuestions: 10 } },
    answerSnapshots: [{ snapshotVersion: 1, questionId: `q-${i}`, isCorrect: true }],
    detailedResults: [{ questionId: `q-${i}`, isCorrect: true }],
  }));

  const compacted = compactAttemptsForLocalStorage(attempts, {
    maxSnapshotAttempts: MAX_LOCAL_SNAPSHOT_ATTEMPTS,
    maxTotalAttempts: 30,
  });

  assert.equal(compacted.length, 20);
  for (let i = 0; i < MAX_LOCAL_SNAPSHOT_ATTEMPTS; i += 1) {
    assert.ok(Array.isArray(compacted[i].answerSnapshots), `Recent attempt #${i} must keep answerSnapshots`);
    assert.equal(compacted[i].snapshotsPruned, undefined);
  }
  for (let i = MAX_LOCAL_SNAPSHOT_ATTEMPTS; i < compacted.length; i += 1) {
    assert.equal(compacted[i].answerSnapshots, undefined, `Older attempt #${i} must prune answerSnapshots`);
    assert.equal(compacted[i].detailedResults, undefined, `Older attempt #${i} must prune detailedResults`);
    assert.equal(compacted[i].snapshotsPruned, true);
    assert.equal(compacted[i].score, 180 - i, 'Total score must be preserved after pruning');
    assert.deepEqual(
      compacted[i].skillBreakdown,
      { listening: { correctQuestions: 10, totalQuestions: 10 } },
      'skillBreakdown must be preserved after pruning'
    );
  }
});
