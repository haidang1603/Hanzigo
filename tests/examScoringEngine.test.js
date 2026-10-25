import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHskScoreConfig,
  gradeSingleQuestion,
  calculateHskCbtScore
} from '../src/utils/examScoringEngine.js';

test('HSK Scoring Engine Test Suite', async (t) => {
  await t.test('1. Configuration Scale: HSK 1-2 (200 pts) vs HSK 3-6 (300 pts)', () => {
    const hsk1Config = getHskScoreConfig('HSK 1');
    assert.equal(hsk1Config.maxScore, 200);
    assert.equal(hsk1Config.passingScore, 120);
    assert.deepEqual(hsk1Config.sections.map(s => s.id), ['listening', 'reading']);

    const hsk2Config = getHskScoreConfig('HSK 2');
    assert.equal(hsk2Config.maxScore, 200);
    assert.equal(hsk2Config.passingScore, 120);
    assert.deepEqual(hsk2Config.sections.map(s => s.id), ['listening', 'reading']);

    const hsk3Config = getHskScoreConfig('HSK 3');
    assert.equal(hsk3Config.maxScore, 300);
    assert.equal(hsk3Config.passingScore, 180);
    assert.deepEqual(hsk3Config.sections.map(s => s.id), ['listening', 'reading', 'writing']);

    const hsk4Config = getHskScoreConfig('HSK 4');
    assert.equal(hsk4Config.maxScore, 300);
    assert.equal(hsk4Config.passingScore, 180);
    assert.deepEqual(hsk4Config.sections.map(s => s.id), ['listening', 'reading', 'writing']);

    const hsk5Config = getHskScoreConfig('HSK 5');
    assert.equal(hsk5Config.maxScore, 300);
    assert.equal(hsk5Config.passingScore, 180);
    assert.deepEqual(hsk5Config.sections.map(s => s.id), ['listening', 'reading', 'writing']);

    const hsk6Config = getHskScoreConfig('HSK 6');
    assert.equal(hsk6Config.maxScore, 300);
    assert.equal(hsk6Config.passingScore, 180);
    assert.deepEqual(hsk6Config.sections.map(s => s.id), ['listening', 'reading', 'writing']);
  });

  await t.test('2. Single Question Grading: Diverse CBT Question Types', () => {
    // 2.1 writing_reorder with array of placed words
    const reorderQ = {
      id: 'q-reorder-1',
      question_type: 'writing_reorder',
      scrambledWords: ['我', '去', '北京'],
      correct_sentence: '我去北京',
      correct_order: ['我', '去', '北京'],
      options: [{ text: '我去北京' }, { text: '北京去我' }],
      correct_option_index: 0
    };
    // Answer as array of words
    assert.equal(gradeSingleQuestion(reorderQ, ['我', '去', '北京']).isCorrect, true);
    assert.equal(gradeSingleQuestion(reorderQ, ['北京', '去', '我']).isCorrect, false);
    // Answer as option index
    assert.equal(gradeSingleQuestion(reorderQ, 0).isCorrect, true);
    assert.equal(gradeSingleQuestion(reorderQ, 1).isCorrect, false);
    // Answer as concatenated string
    assert.equal(gradeSingleQuestion(reorderQ, '我去北京').isCorrect, true);

    // 2.2 sentence_order_abc
    const abcQ = {
      id: 'q-abc-1',
      question_type: 'sentence_order_abc',
      answerKey: 'BAC',
      correct_sentence: 'BAC',
      options: [{ text: 'ABC' }, { text: 'BAC' }, { text: 'CAB' }],
      correct_option_index: 1
    };
    assert.equal(gradeSingleQuestion(abcQ, 'BAC').isCorrect, true);
    assert.equal(gradeSingleQuestion(abcQ, 'bac').isCorrect, true); // Case-insensitive
    assert.equal(gradeSingleQuestion(abcQ, 1).isCorrect, true); // Option index 1 is BAC
    assert.equal(gradeSingleQuestion(abcQ, 'ABC').isCorrect, false);
    assert.equal(gradeSingleQuestion(abcQ, 0).isCorrect, false);

    // 2.3 fill_blank
    const fillQ = {
      id: 'q-fill-1',
      question_type: 'fill_blank',
      accepted_answers: ['苹果', '苹果儿'],
      options: [{ text: '苹果' }, { text: '香蕉' }],
      correct_option_index: 0
    };
    assert.equal(gradeSingleQuestion(fillQ, '苹果').isCorrect, true);
    assert.equal(gradeSingleQuestion(fillQ, '  苹果儿  ').isCorrect, true);
    assert.equal(gradeSingleQuestion(fillQ, '香蕉').isCorrect, false);
    assert.equal(gradeSingleQuestion(fillQ, 0).isCorrect, true);

    // 2.4 multiple_choice (listening_mcq / reading_mcq)
    const mcqQ = {
      id: 'q-mcq-1',
      correct_option_index: 2
    };
    assert.equal(gradeSingleQuestion(mcqQ, 2).isCorrect, true);
    assert.equal(gradeSingleQuestion(mcqQ, 0).isCorrect, false);
    assert.equal(gradeSingleQuestion(mcqQ, null).isCorrect, false);
  });

  await t.test('3. Full Exam Calculation: 100% Perfect Score vs 0% Fail', () => {
    const mockHsk3Exam = {
      id: 'mock-test-hsk3',
      level: 'HSK 3',
      questions: [
        { id: 'q1', section: 'listening', correct_option_index: 0 },
        { id: 'q2', section: 'listening', correct_option_index: 1 },
        { id: 'q3', section: 'reading', correct_option_index: 2 },
        { id: 'q4', section: 'reading', correct_option_index: 3 },
        { id: 'q5', section: 'writing', question_type: 'writing_reorder', correct_order: ['A', 'B'] },
        { id: 'q6', section: 'writing', question_type: 'writing_reorder', correct_order: ['C', 'D'] }
      ]
    };

    // 100% Correct
    const perfectAnswers = {
      q1: 0,
      q2: 1,
      q3: 2,
      q4: 3,
      q5: ['A', 'B'],
      q6: ['C', 'D']
    };
    const perfectResult = calculateHskCbtScore(mockHsk3Exam, perfectAnswers);
    assert.equal(perfectResult.totalScore, 300);
    assert.equal(perfectResult.maxScore, 300);
    assert.equal(perfectResult.passed, true);
    assert.equal(perfectResult.eliminatedByZeroScore, false);
    assert.equal(perfectResult.sections.listening.score, 100);
    assert.equal(perfectResult.sections.reading.score, 100);
    assert.equal(perfectResult.sections.writing.score, 100);

    // 0% Correct
    const zeroAnswers = {
      q1: 3,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: ['B', 'A'],
      q6: ['D', 'C']
    };
    const zeroResult = calculateHskCbtScore(mockHsk3Exam, zeroAnswers);
    assert.equal(zeroResult.totalScore, 0);
    assert.equal(zeroResult.passed, false);
    assert.equal(zeroResult.eliminatedByZeroScore, true); // < 40 in all sections
    assert.equal(zeroResult.sections.listening.score, 0);
    assert.equal(zeroResult.sections.reading.score, 0);
    assert.equal(zeroResult.sections.writing.score, 0);
  });

  await t.test('4. HSK Elimination Rule (< 40 points in any section fails)', () => {
    // 5 listening questions, 5 reading questions, 5 writing questions
    const examQuestions = [];
    for (let i = 1; i <= 5; i++) {
      examQuestions.push({ id: `l${i}`, section: 'listening', correct_option_index: 0 });
      examQuestions.push({ id: `r${i}`, section: 'reading', correct_option_index: 0 });
      examQuestions.push({ id: `w${i}`, section: 'writing', correct_option_index: 0 });
    }
    const mockHsk4Exam = {
      id: 'mock-hsk4',
      level: 'HSK 4',
      questions: examQuestions
    };

    // Listening: 5/5 correct = 100
    // Reading: 5/5 correct = 100
    // Writing: 1/5 correct = 20 (< 40 -> ELIMINATED despite totalScore = 220 >= 180)
    const submitted = {};
    for (let i = 1; i <= 5; i++) {
      submitted[`l${i}`] = 0;
      submitted[`r${i}`] = 0;
      submitted[`w${i}`] = (i === 1 ? 0 : 1); // Only 1 correct in writing
    }

    const result = calculateHskCbtScore(mockHsk4Exam, submitted);
    assert.equal(result.sections.listening.score, 100);
    assert.equal(result.sections.reading.score, 100);
    assert.equal(result.sections.writing.score, 20);
    assert.equal(result.totalScore, 220);
    assert.equal(result.eliminatedByZeroScore, true);
    assert.equal(result.passed, false); // Failed because writing < 40
    assert.equal(result.weakestSkill, 'writing');
    assert.equal(result.strongestSkill, 'listening');
  });

  await t.test('5. HSK 1-2: 2-Section 200 Scale and 120 Passing Threshold', () => {
    const hsk1Exam = {
      id: 'mock-hsk1',
      level: 'HSK 1',
      questions: [
        { id: 'l1', section: 'listening', correct_option_index: 0 },
        { id: 'l2', section: 'listening', correct_option_index: 0 },
        { id: 'r1', section: 'reading', correct_option_index: 0 },
        { id: 'r2', section: 'reading', correct_option_index: 0 }
      ]
    };

    // Listening: 2/2 = 100, Reading: 1/2 = 50 -> Total = 150 >= 120 -> PASS
    const passAnswers = { l1: 0, l2: 0, r1: 0, r2: 1 };
    const passResult = calculateHskCbtScore(hsk1Exam, passAnswers);
    assert.equal(passResult.totalScore, 150);
    assert.equal(passResult.maxScore, 200);
    assert.equal(passResult.passingScore, 120);
    assert.equal(passResult.passed, true);
    assert.equal(passResult.eliminatedByZeroScore, false);

    // Listening: 1/2 = 50, Reading: 1/2 = 50 -> Total = 100 < 120 -> FAIL
    const failAnswers = { l1: 0, l2: 1, r1: 0, r2: 1 };
    const failResult = calculateHskCbtScore(hsk1Exam, failAnswers);
    assert.equal(failResult.totalScore, 100);
    assert.equal(failResult.passed, false);
  });
});
