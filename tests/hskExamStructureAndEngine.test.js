import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK_OFFICIAL_VERSIONS,
  HSK_STRUCTURE_DEFINITIONS,
  getHskStructure,
  getAllHskLevels
} from '../src/data/hskStructureData.js';

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
  getAudioPlayLimit,
  submitExamAttempt,
  saveTemporaryAnswers,
  getTemporaryAnswers,
  getTemporaryExamSession,
  clearTemporaryAnswers,
  getOrCreateAnonymousSessionId,
  getAttemptResult
} from '../src/services/hskService.js';

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
// 1. OFFICIAL HSK STRUCTURE & SYSTEM SPECIFICATION VALIDATION
// ============================================================================
test('HSK Official Versions: includes verified 2015-Standard and HSK 3.0 with official portal references', () => {
  assert.ok(Array.isArray(HSK_OFFICIAL_VERSIONS), 'HSK_OFFICIAL_VERSIONS must be an array');
  assert.ok(HSK_OFFICIAL_VERSIONS.length >= 2, 'Must define at least 2 versions');

  const v2015 = HSK_OFFICIAL_VERSIONS.find(v => v.id === '2015-Standard');
  assert.ok(v2015, '2015-Standard version must exist');
  assert.equal(v2015.status, 'active_official');
  assert.ok(v2015.officialPortal.includes('chinesetest.cn'));

  const v30 = HSK_OFFICIAL_VERSIONS.find(v => v.id === 'HSK 3.0-2021');
  assert.ok(v30, 'HSK 3.0-2021 version must exist');
  assert.equal(v30.status, 'partially_implemented');
  assert.ok(v30.officialPortal.includes('chinesetest.cn'));
});

test('HSK Levels 1 to 6 & 7-9: verified structures match official CTI guidelines', () => {
  const levels = getAllHskLevels();
  assert.equal(levels.length, 7, 'Must define HSK 1 to 6 and HSK 7-9 (7 levels)');

  const keys = ['hsk-1', 'hsk-2', 'hsk-3', 'hsk-4', 'hsk-5', 'hsk-6', 'hsk-7-9'];
  keys.forEach(k => {
    assert.ok(HSK_STRUCTURE_DEFINITIONS[k], `Definition for ${k} must exist`);
  });

  // HSK 1 Verification
  const hsk1 = getHskStructure('hsk-1', '2015-Standard');
  assert.equal(hsk1.totalQuestions, 40);
  assert.equal(hsk1.totalDurationMinutes, 40);
  assert.equal(hsk1.maxScore, 200);
  assert.equal(hsk1.passingScore, 120);
  assert.equal(hsk1.audioPlayCount, 2);
  assert.equal(hsk1.hasPinyin, true);
  const hsk1ActiveSections = hsk1.sections.filter(s => s.questionCount > 0);
  assert.equal(hsk1ActiveSections.length, 2, 'HSK 1 has 2 active sections: listening, reading');
  assert.equal(hsk1ActiveSections[0].questionCount, 20);
  assert.equal(hsk1ActiveSections[1].questionCount, 20);

  // HSK 2 Verification
  const hsk2 = getHskStructure('hsk-2', '2015-Standard');
  assert.equal(hsk2.totalQuestions, 60);
  assert.equal(hsk2.totalDurationMinutes, 55);
  assert.equal(hsk2.maxScore, 200);
  assert.equal(hsk2.passingScore, 120);
  assert.equal(hsk2.audioPlayCount, 2);
  assert.equal(hsk2.hasPinyin, true);
  const hsk2ActiveSections = hsk2.sections.filter(s => s.questionCount > 0);
  assert.equal(hsk2ActiveSections.length, 2, 'HSK 2 has 2 active sections: listening, reading');
  assert.equal(hsk2ActiveSections[0].questionCount, 35);
  assert.equal(hsk2ActiveSections[1].questionCount, 25);

  // HSK 3 Verification
  const hsk3 = getHskStructure('hsk-3', '2015-Standard');
  assert.equal(hsk3.totalQuestions, 80);
  assert.equal(hsk3.totalDurationMinutes, 90);
  assert.equal(hsk3.maxScore, 300);
  assert.equal(hsk3.passingScore, 180);
  assert.equal(hsk3.audioPlayCount, 2);
  assert.equal(hsk3.hasPinyin, false);
  assert.equal(hsk3.sections.length, 3, 'HSK 3 has 3 sections: listening, reading, writing');
  assert.equal(hsk3.sections[0].questionCount, 40);
  assert.equal(hsk3.sections[1].questionCount, 30);
  assert.equal(hsk3.sections[2].questionCount, 10);

  // HSK 4 Verification
  const hsk4 = getHskStructure('hsk-4', '2015-Standard');
  assert.equal(hsk4.totalQuestions, 100);
  assert.equal(hsk4.totalDurationMinutes, 105);
  assert.equal(hsk4.maxScore, 300);
  assert.equal(hsk4.passingScore, 180);
  assert.equal(hsk4.audioPlayCount, 1, 'HSK 4 listening plays audio only 1 time');
  assert.equal(hsk4.sections.length, 3);
  assert.equal(hsk4.sections[0].questionCount, 45);
  assert.equal(hsk4.sections[1].questionCount, 40);
  assert.equal(hsk4.sections[2].questionCount, 15);

  // HSK 5 Verification
  const hsk5 = getHskStructure('hsk-5', '2015-Standard');
  assert.equal(hsk5.totalQuestions, 100);
  assert.equal(hsk5.totalDurationMinutes, 125);
  assert.equal(hsk5.maxScore, 300);
  assert.equal(hsk5.passingScore, 180);
  assert.equal(hsk5.audioPlayCount, 1);
  assert.equal(hsk5.sections.length, 3);

  // HSK 6 Verification
  const hsk6 = getHskStructure('hsk-6', '2015-Standard');
  assert.equal(hsk6.totalQuestions, 101);
  assert.equal(hsk6.totalDurationMinutes, 140);
  assert.equal(hsk6.maxScore, 300);
  assert.equal(hsk6.passingScore, 180);
  assert.equal(hsk6.audioPlayCount, 1);
  assert.equal(hsk6.sections[2].questionCount, 1, 'HSK 6 writing is 1 composition task');

  // HSK 7-9 Verification
  const hsk79 = getHskStructure('hsk-7-9', '2015-Standard');
  assert.equal(hsk79.level, 'HSK 7–9');
  assert.equal(hsk79.sections.length, 5, 'HSK 7-9 tests 5 components: listening, reading, writing, translation, speaking');
  assert.equal(hsk79.totalDurationMinutes, 210);
});

test('HSK 3.0 status: marks unverified parameters clearly without fake assumptions', () => {
  const hsk1_30 = getHskStructure('hsk-1', 'HSK 3.0-2021');
  assert.equal(hsk1_30.isOfficial, false, 'HSK 1 under 3.0 is not yet universally deployed at exam centers');
  assert.equal(hsk1_30.verificationStatus, 'unverified_transition');
  assert.ok(hsk1_30.unverifiedNotice.includes('Chưa xác minh'), 'Must include explicit unverified notice');
  assert.equal(hsk1_30.vocabularyRequirement, 500, 'HSK 3.0 level 1 requires 500 words under GF0025-2021');
});

// ============================================================================
// 2. AUDIO PLAY RULES & EXAM MODES
// ============================================================================
test('Audio Play Engine: enforces official repetition rules in simulation mode and unlimited in practice mode', () => {
  // HSK 1 and 2: 2 plays allowed in simulation
  assert.equal(getAudioPlayLimit('HSK 1', 'simulation'), 2);
  assert.equal(getAudioPlayLimit('HSK 2', 'simulation'), 2);

  // HSK 3, 4, 5, 6: 1 play allowed in simulation
  assert.equal(getAudioPlayLimit('HSK 3', 'simulation'), 1);
  assert.equal(getAudioPlayLimit('HSK 4', 'simulation'), 1);
  assert.equal(getAudioPlayLimit('HSK 5', 'simulation'), 1);
  assert.equal(getAudioPlayLimit('HSK 6', 'simulation'), 1);

  // Practice mode: always Infinity (unrestricted replay for review)
  assert.equal(getAudioPlayLimit('HSK 1', 'practice'), Infinity);
  assert.equal(getAudioPlayLimit('HSK 4', 'practice'), Infinity);
  assert.equal(getAudioPlayLimit('HSK 6', 'practice'), Infinity);
});

// ============================================================================
// 3. SECURITY & LEAK PREVENTION (SANITIZATION)
// ============================================================================
test('Exam Sanitization: strips all sensitive answer keys, correct order, sample answers, and explanations', () => {
  const sanitized = getSanitizedExamForTaking('hsk4-mock-01');
  assert.ok(sanitized, 'Sanitized exam must be returned');
  assert.ok(sanitized.questions.length > 0);

  sanitized.questions.forEach(q => {
    assert.strictEqual(q.correct_option_index, undefined, 'Must not expose correct_option_index');
    assert.strictEqual(q.correct_order, undefined, 'Must not expose correct_order');
    assert.strictEqual(q.correct_sentence, undefined, 'Must not expose correct_sentence');
    assert.strictEqual(q.accepted_answers, undefined, 'Must not expose accepted_answers');
    assert.strictEqual(q.sample_answer, undefined, 'Must not expose sample_answer');
    assert.strictEqual(q.explanation, undefined, 'Must not expose explanation');
    // Questions must still have options and prompt
    assert.ok(Array.isArray(q.options));
    assert.ok(typeof q.prompt === 'string');
  });
});

// ============================================================================
// 4. SCORING ENGINE ACROSS MULTI-FORMAT QUESTIONS
// ============================================================================
test('Scoring Engine: accurately grades multiple-choice and true-false questions', async () => {
  const exam = getFullExamById('hsk1-mock-01');
  assert.ok(exam);

  // Submit all correct
  const correctAnswers = {};
  exam.questions.forEach(q => {
    correctAnswers[q.id] = q.correct_option_index;
  });

  const result = await submitExamAttempt(exam.id, correctAnswers, 600, null, 'simulation');
  assert.equal(result.correctCount, exam.questions.length);
  assert.equal(result.incorrectCount, 0);
  assert.equal(result.unansweredCount, 0);
  assert.equal(result.accuracyPercentage, 100);
  assert.equal(result.passed, true);
  assert.ok(result.disclaimer.includes('không thay thế chứng chỉ'));
});

test('Scoring Engine: supports sentence reordering (reorder_sentence)', async () => {
  const exam = getFullExamById('hsk3-mock-01');
  assert.ok(exam);

  const reorderQ = exam.questions.find(q => q.question_type === 'reorder_sentence');
  assert.ok(reorderQ, 'HSK 3 exam must contain a reorder_sentence question');
  assert.ok(Array.isArray(reorderQ.correct_order));

  // Case 1: Submit correct reorder as array of words
  const answersCase1 = {
    [reorderQ.id]: reorderQ.correct_order
  };
  const result1 = await submitExamAttempt(exam.id, answersCase1, 300, null, 'practice');
  const scoredQ1 = result1.detailedResults.find(r => r.questionId === reorderQ.id);
  assert.equal(scoredQ1.isCorrect, true, 'Correct word order array must be graded as true');
  assert.equal(scoredQ1.pointsAwarded, reorderQ.points);

  // Case 2: Submit incorrect reorder
  const answersCase2 = {
    [reorderQ.id]: [...reorderQ.correct_order].reverse()
  };
  const result2 = await submitExamAttempt(exam.id, answersCase2, 300, null, 'practice');
  const scoredQ2 = result2.detailedResults.find(r => r.questionId === reorderQ.id);
  assert.equal(scoredQ2.isCorrect, false, 'Reversed word order must be graded as false');
  assert.equal(scoredQ2.pointsAwarded, 0);
});

test('Scoring Engine: supports fill-in-the-blank (fill_blank)', async () => {
  const exam = getFullExamById('hsk3-mock-01');
  const fillQ = exam.questions.find(q => q.question_type === 'fill_blank');
  assert.ok(fillQ, 'HSK 3 exam must contain a fill_blank question');

  // Submit accepted text
  const acceptedWord = fillQ.accepted_answers[0];
  const answersCase = {
    [fillQ.id]: acceptedWord
  };
  const result = await submitExamAttempt(exam.id, answersCase, 300, null, 'practice');
  const scoredQ = result.detailedResults.find(r => r.questionId === fillQ.id);
  assert.equal(scoredQ.isCorrect, true);
  assert.equal(scoredQ.pointsAwarded, fillQ.points);
});

test('Scoring Engine: subjective free writing is preserved with self-assessment criteria without naive auto-grading', async () => {
  const exam = getFullExamById('hsk4-mock-01');
  const freeWritingQ = exam.questions.find(q => q.question_type === 'free_writing');
  assert.ok(freeWritingQ, 'HSK 4 exam must contain a free_writing question');
  assert.ok(freeWritingQ.is_subjective, 'Question must be flagged is_subjective');
  assert.ok(freeWritingQ.writing_criteria.length > 0, 'Must have rubrics / criteria');

  const userEssay = '今天天气非常好，我们一起去公园看花。';
  const answers = {
    [freeWritingQ.id]: userEssay
  };

  const result = await submitExamAttempt(exam.id, answers, 900, null, 'simulation');
  const scoredQ = result.detailedResults.find(r => r.questionId === freeWritingQ.id);

  assert.equal(scoredQ.isSubjective, true);
  assert.equal(scoredQ.needsSelfAssessment, true);
  assert.equal(scoredQ.isCorrect, null, 'Free writing must not be marked false/true automatically');
  assert.equal(scoredQ.earnedPoints, 0, 'Free writing points must not be guessed without human review');
  assert.equal(scoredQ.userAnswer, userEssay);
  assert.ok(scoredQ.writingCriteria.length >= 2, 'Rubrics must be present in results');
  assert.ok(scoredQ.sampleAnswer.length > 0, 'Sample answer must be present for learner comparison');

  // Accuracy should be computed only on objective questions
  assert.equal(result.subjectiveCount, 1);
});

// ============================================================================
// 5. SESSION & DRAFT PERSISTENCE (EXAM RECOVERY)
// ============================================================================
test('Draft Persistence: saves, retrieves full session state, and clears upon submission', async () => {
  const examId = 'hsk2-mock-01';
  clearTemporaryAnswers(examId);

  // Initially empty
  assert.strictEqual(getTemporaryAnswers(examId), null);
  assert.strictEqual(getTemporaryExamSession(examId), null);

  // Save session
  const draftAnswers = { 'hsk2-q01': 0, 'hsk2-q02': 1 };
  const extra = {
    flaggedQuestionIds: ['hsk2-q02'],
    examMode: 'practice',
    currentIdx: 1
  };

  saveTemporaryAnswers(examId, draftAnswers, extra);

  // Retrieve backward-compatible answers map
  const retrievedAnswers = getTemporaryAnswers(examId);
  assert.deepEqual(retrievedAnswers, draftAnswers);

  // Retrieve full session
  const session = getTemporaryExamSession(examId);
  assert.ok(session);
  assert.deepEqual(session.answers, draftAnswers);
  assert.deepEqual(session.flaggedQuestionIds, ['hsk2-q02']);
  assert.equal(session.examMode, 'practice');
  assert.equal(session.currentIdx, 1);

  // Submitting attempt automatically clears draft
  await submitExamAttempt(examId, draftAnswers, 300, null, 'practice');
  assert.strictEqual(getTemporaryAnswers(examId), null);
  assert.strictEqual(getTemporaryExamSession(examId), null);
});

test('Guest / Anonymous User Support: can take exams and generate session ID without login', () => {
  const anonId = getOrCreateAnonymousSessionId();
  assert.ok(anonId && anonId.startsWith('anon_'), 'Anonymous ID must be created');
  const anonId2 = getOrCreateAnonymousSessionId();
  assert.equal(anonId, anonId2, 'Subsequent calls reuse existing anonymous ID');
});
