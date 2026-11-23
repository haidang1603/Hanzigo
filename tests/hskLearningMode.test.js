import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  PRACTICE_MODES,
  EXAM_SYSTEMS,
  EXAM_MODES,
  getDefaultShowPinyinForLevel,
  resolveQuestionPinyin,
  getVietnameseInstructionForQuestion,
  evaluateLearningQuestionFeedback,
  saveDualExamHistoryRecord,
  getDualExamHistory,
  assembleDualSystemExam,
} from '../src/data/hskExamBlueprints.js';
import { loadHsk30ExamByLevel } from '../src/data/hsk30/index.js';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

describe('HSK Learning Mode & Exam Mode Separation Suite', () => {
  test('1. Generates accurate Vietnamese instructions for all HSK skills and questionTypes', () => {
    const cases = [
      { q: { skill: 'listening', questionType: 'true_false' }, expectSub: 'Đúng (对) hoặc Sai (错)' },
      { q: { skill: 'listening', questionType: 'mcq' }, expectSub: 'Nghe đoạn hội thoại' },
      { q: { skill: 'reading', questionType: 'fill_blank' }, expectSub: 'chỗ trống' },
      { q: { skill: 'reading', questionType: 'reorder' }, expectSub: 'Sắp xếp thứ tự' },
      { q: { skill: 'reading', questionType: 'mcq' }, expectSub: 'Đọc ngữ liệu tiếng Trung' },
      { q: { skill: 'writing', questionType: 'reorder' }, expectSub: 'Sắp xếp các từ' },
      { q: { skill: 'writing', questionType: 'fill_blank' }, expectSub: 'Viết chữ Hán' },
      { q: { skill: 'writing', questionType: 'essay' }, expectSub: 'Viết câu hoặc đoạn văn' },
      { q: { skill: 'translation', questionType: 'translation' }, expectSub: 'Dịch đoạn văn' },
      { q: { skill: 'speaking', questionType: 'speaking' }, expectSub: 'trình bày câu trả lời' },
    ];

    for (const c of cases) {
      const instruction = getVietnameseInstructionForQuestion(c.q);
      assert.ok(instruction.includes(c.expectSub), `Expected "${c.expectSub}" in "${instruction}"`);
    }
  });

  test('2. Pinyin default toggle behavior: ON for HSK 1-2, OFF for HSK 3-9, and lightweight dict fallback', () => {
    assert.equal(getDefaultShowPinyinForLevel('HSK 1'), true);
    assert.equal(getDefaultShowPinyinForLevel('HSK 2'), true);
    assert.equal(getDefaultShowPinyinForLevel('HSK 3'), false);
    assert.equal(getDefaultShowPinyinForLevel('HSK 6'), false);
    assert.equal(getDefaultShowPinyinForLevel('HSK 7-9'), false);

    assert.equal(resolveQuestionPinyin({ prompt: '你好', pinyin: 'nǐ hǎo' }), 'nǐ hǎo');
    const fallbackPinyin = resolveQuestionPinyin({ prompt: '我喜欢学习汉语' });
    assert.ok(fallbackPinyin.length >= 6, 'Dictionary helper should resolve Pinyin for common Chinese characters');
  });

  test('3. Instant Learning Feedback returns full 4-part review in learning_mode and strictly blocks in exam_mode', async () => {
    await loadHsk30ExamByLevel('hsk1');
    const exam = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 1',
      mode: EXAM_MODES.FULL_EXAM,
    });
    const firstMcq = exam.questions.find((q) => q.questionType === 'mcq');
    assert.ok(firstMcq, 'Need an MCQ question in HSK 1');

    // Exam mode must strictly block instant answer disclosure
    const blocked = evaluateLearningQuestionFeedback({
      examId: exam.id,
      questionId: firstMcq.id,
      userAnswer: firstMcq.correct_option_index,
      practiceMode: PRACTICE_MODES.EXAM,
      fullExam: exam,
    });
    assert.equal(blocked.blocked, true);
    assert.equal(blocked.correctAnswerText, undefined);
    assert.equal(blocked.explanationVi, undefined);

    // Learning mode returns exact feedback after answering
    const okFeedback = evaluateLearningQuestionFeedback({
      examId: exam.id,
      questionId: firstMcq.id,
      userAnswer: firstMcq.correct_option_index,
      practiceMode: PRACTICE_MODES.LEARNING,
      fullExam: exam,
    });
    assert.equal(okFeedback.blocked, false);
    assert.equal(okFeedback.found, true);
    assert.equal(okFeedback.isCorrect, true);
    assert.ok(okFeedback.correctAnswerText.length > 0);
    assert.ok(okFeedback.explanationVi.length > 5);
    assert.ok(okFeedback.askAiTutorPrompt.includes('Hãy giải thích'));

    const wrongIdx = (firstMcq.correct_option_index + 1) % firstMcq.options.length;
    const wrongFeedback = evaluateLearningQuestionFeedback({
      examId: exam.id,
      questionId: firstMcq.id,
      userAnswer: wrongIdx,
      practiceMode: PRACTICE_MODES.LEARNING,
      fullExam: exam,
    });
    assert.equal(wrongFeedback.isCorrect, false);
  });

  test('4. Dual exam history strictly separates learning_mode records from official exam_mode records', () => {
    const testUser = { id: 'learning-mode-user-test' };
    localStorage.clear();

    saveDualExamHistoryRecord({
      user: testUser,
      analytics: {
        examSystem: EXAM_SYSTEMS.HSK_3_0,
        level: 'HSK 3',
        mode: EXAM_MODES.FULL_EXAM,
        practiceMode: 'learning',
        examId: 'dual-hsk_3_0-hsk3-full_exam',
        examTitle: 'HSK 3 Learning',
        totalScore: 260,
        maxScore: 300,
        accuracyPct: 87,
        passed: true,
      },
    });

    saveDualExamHistoryRecord({
      user: testUser,
      analytics: {
        examSystem: EXAM_SYSTEMS.HSK_3_0,
        level: 'HSK 3',
        mode: EXAM_MODES.FULL_EXAM,
        practiceMode: 'exam',
        examId: 'dual-hsk_3_0-hsk3-full_exam',
        examTitle: 'HSK 3 CBT Exam',
        totalScore: 215,
        maxScore: 300,
        accuracyPct: 72,
        passed: true,
      },
    });

    const examOnly = getDualExamHistory({ user: testUser, practiceMode: 'exam' });
    const learningOnly = getDualExamHistory({ user: testUser, practiceMode: 'learning' });

    assert.equal(examOnly.length, 1);
    assert.equal(examOnly[0].totalScore, 215);
    assert.equal(examOnly[0].practiceMode, 'exam');

    assert.equal(learningOnly.length, 1);
    assert.equal(learningOnly[0].totalScore, 260);
    assert.equal(learningOnly[0].practiceMode, 'learning');
  });
});
