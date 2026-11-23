import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  EXAM_SYSTEMS,
  EXAM_MODES,
  HSK_2_0_BLUEPRINTS,
  HSK_3_0_BLUEPRINTS,
  getBlueprint,
  normalizeQuestionForDualSystem,
  assembleDualSystemExam,
  autoGradeObjectiveAnswers,
  gradeSubjectiveSubmission,
  analyzeDualExamAttempt,
  resolveHsk79BandFromScore,
  saveDualExamHistoryRecord,
  getDualExamHistory,
  compareDualExamProgress,
} from '../src/data/hskExamBlueprints.js';
import {
  HSK_EXAMS,
  HSK_QUESTIONS,
  getFullExamById,
  getSanitizedExamForTaking,
} from '../src/data/hskExamsData.js';

function withMockLocalStorage(fn) {
  const orig = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    get length() {
      return store.size;
    },
    key: (i) => Array.from(store.keys())[i] ?? null,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      if (orig === undefined) delete globalThis.localStorage;
      else globalThis.localStorage = orig;
    });
}

describe('Dual-System CBT Exam Center (HSK 2.0 & HSK 3.0)', () => {
  test('1. All 7 HSK 3.0 Blueprints match exact question counts, durations, skill/part allocations, and speaking rules', () => {
    const expected = [
      { level: 'HSK 1', total: 40, mins: 40, listening: 20, reading: 20, writing: 0, translation: 0, speaking: 0, speakingMode: 'none' },
      { level: 'HSK 2', total: 60, mins: 60, listening: 25, reading: 25, writing: 10, translation: 0, speaking: 0, speakingMode: 'none' },
      { level: 'HSK 3', total: 70, mins: 83, listening: 30, reading: 30, writing: 10, translation: 0, speaking: 0, speakingMode: 'separate', sepMins: 15, sepQs: 15 },
      { level: 'HSK 4', total: 70, mins: 85, listening: 32, reading: 32, writing: 6, translation: 0, speaking: 0, speakingMode: 'separate', sepMins: 20, sepQs: 5 },
      { level: 'HSK 5', total: 72, mins: 110, listening: 35, reading: 35, writing: 2, translation: 0, speaking: 0, speakingMode: 'separate', sepMins: 23, sepQs: 5 },
      { level: 'HSK 6', total: 82, mins: 125, listening: 40, reading: 40, writing: 2, translation: 0, speaking: 0, speakingMode: 'separate', sepMins: 23, sepQs: 5 },
      { level: 'HSK 7-9', total: 91, mins: 200, listening: 40, reading: 40, writing: 2, translation: 4, speaking: 5, speakingMode: 'integrated' },
    ];

    for (const row of expected) {
      const bp = HSK_3_0_BLUEPRINTS[row.level];
      assert.ok(bp, `Missing blueprint for ${row.level}`);
      assert.equal(bp.examSystem, EXAM_SYSTEMS.HSK_3_0);
      assert.equal(bp.effectiveDate, '2026-12-13');
      assert.equal(bp.totalQuestions, row.total);
      assert.equal(bp.durationMinutes, row.mins);
      assert.equal(bp.speakingMode, row.speakingMode);
      assert.equal(bp.skills.listening.count, row.listening);
      assert.equal(bp.skills.reading.count, row.reading);
      assert.equal(bp.skills.writing.count, row.writing);
      assert.equal(bp.skills.translation.count, row.translation);
      assert.equal(bp.skills.speaking.count, row.speaking);
      if (row.sepMins) {
        assert.equal(bp.separateSpeakingMinutes, row.sepMins);
      }
      if (row.sepQs) {
        assert.equal(bp.separateSpeakingQuestions, row.sepQs);
      }

      const skillSum =
        bp.skills.listening.count +
        bp.skills.reading.count +
        bp.skills.writing.count +
        bp.skills.translation.count +
        bp.skills.speaking.count;
      assert.equal(skillSum, row.total, `${row.level} skill counts must sum to ${row.total}`);
    }

    // HSK 7-9 exact 5-skill timer & part breakdown verification
    const h79 = HSK_3_0_BLUEPRINTS['HSK 7-9'];
    assert.deepEqual(
      h79.skills.listening.parts.map((p) => p.count),
      [10, 9, 15, 6]
    );
    assert.deepEqual(
      h79.skills.reading.parts.map((p) => p.count),
      [21, 5, 14]
    );
    assert.deepEqual(
      h79.skills.writing.parts.map((p) => p.count),
      [1, 1]
    );
    assert.deepEqual(
      h79.skills.translation.parts.map((p) => p.count),
      [2, 2]
    );
    assert.deepEqual(
      h79.skills.speaking.parts.map((p) => p.count),
      [1, 3, 1]
    );
    const h79MinutesSum =
      h79.skills.listening.durationMinutes +
      h79.skills.reading.durationMinutes +
      h79.skills.writing.durationMinutes +
      h79.skills.translation.durationMinutes +
      h79.skills.speaking.durationMinutes;
    assert.equal(h79MinutesSum, 200);
  });

  test('2. HSK 2.0 and HSK 3.0 remain strictly isolated without mutating existing HSK 2.0 exams/questions', () => {
    assert.equal(Object.keys(HSK_2_0_BLUEPRINTS).length, 6);
    assert.ok(HSK_EXAMS.some((e) => e.id === 'hsk1-mock-01'));
    assert.ok(HSK_EXAMS.some((e) => e.id === 'hsk6-full-101-01'));
    assert.ok(HSK_QUESTIONS.length >= 500);

    const legacyExam = getFullExamById('hsk1-mock-01');
    assert.equal(legacyExam.examSystem, EXAM_SYSTEMS.HSK_2_0);
    assert.equal(legacyExam.max_score, 200);
    assert.equal(legacyExam.questions[0].examSystem, EXAM_SYSTEMS.HSK_2_0);
    assert.ok(['listening', 'reading', 'writing', 'translation', 'speaking'].includes(legacyExam.questions[0].skill));

    const norm = normalizeQuestionForDualSystem({ id: 'q-x', section: 'listening', part_number: 2, question_type: 'multiple_choice' }, EXAM_SYSTEMS.HSK_3_0);
    assert.equal(norm.examSystem, EXAM_SYSTEMS.HSK_3_0);
    assert.equal(norm.skill, 'listening');
    assert.equal(norm.part, 2);
    assert.equal(norm.questionType, 'mcq');
  });

  test('3. Smart Exam Assembler handles full_exam, by_skill, and by_part without filler duplicates & strips answers', () => {
    const fullHsk1 = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 1',
      mode: EXAM_MODES.FULL_EXAM,
    });
    assert.equal(fullHsk1.examSystem, EXAM_SYSTEMS.HSK_3_0);
    assert.equal(fullHsk1.mode, EXAM_MODES.FULL_EXAM);
    assert.ok(fullHsk1.questions.length > 0);
    assert.equal(new Set(fullHsk1.questions.map((q) => q.id)).size, fullHsk1.questions.length, 'No duplicate questions allowed');
    assert.ok(fullHsk1.bankCoverage.coverageLabelVi);

    const bySkillH79 = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 7-9',
      mode: EXAM_MODES.BY_SKILL,
      skill: 'translation',
    });
    assert.equal(bySkillH79.mode, EXAM_MODES.BY_SKILL);
    assert.ok(bySkillH79.questions.every((q) => q.skill === 'translation'));

    const byPartHsk1 = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 1',
      mode: EXAM_MODES.BY_PART,
      skill: 'listening',
      part: 2,
    });
    assert.equal(byPartHsk1.mode, EXAM_MODES.BY_PART);
    assert.ok(byPartHsk1.questions.every((q) => q.skill === 'listening' && Number(q.part) === 2));

    // Anti-cheat sanitization lock
    const sanitized = getSanitizedExamForTaking(fullHsk1.id);
    assert.ok(sanitized);
    for (const q of sanitized.questions) {
      assert.equal(q.correct_option_index, undefined);
      assert.equal(q.correct_order, undefined);
      assert.equal(q.explanation, undefined);
    }
  });

  test('4. Objective Auto-Grader and Subjective Rubric Grader (AI + deterministic fallback) score accurately', async () => {
    const objectiveQuestions = [
      { id: 'o1', skill: 'listening', questionType: 'true_false', correct_option_index: 0, points: 10 },
      { id: 'o2', skill: 'reading', questionType: 'mcq', correct_option_index: 2, points: 10 },
      { id: 'o3', skill: 'reading', questionType: 'fill_blank', accepted_answers: ['图书馆'], points: 10 },
      { id: 'o4', skill: 'writing', questionType: 'reorder', correct_order: ['我', '把', '书', '看完了'], points: 10 },
    ];

    const graded = autoGradeObjectiveAnswers(objectiveQuestions, {
      o1: 0,
      o2: 1, // wrong
      o3: '图书馆',
      o4: ['我', '把', '书', '看完了'],
    });
    assert.equal(graded.totalObjectiveCount, 4);
    assert.equal(graded.correctCount, 3);
    assert.equal(graded.accuracyPct, 75);
    assert.equal(graded.earnedPoints, 30);

    // Offline deterministic rubric fallback
    const offlineSub = await gradeSubjectiveSubmission({
      question: {
        id: 'w1',
        skill: 'writing',
        questionType: 'essay',
        prompt: '写一篇短文',
        writing_criteria: ['虽然', '但是'],
        min_words: 15,
      },
      userAnswer: '虽然学中文有点难，但是只要每天坚持练习，就一定能提高水平。',
      level: 'HSK 5',
      fetchFn: async () => {
        throw new Error('Offline');
      },
    });
    assert.equal(offlineSub.gradingSource, 'deterministic_rubric_fallback');
    assert.ok(offlineSub.overallScore >= 60);

    // Online AI /api/ai/grade integration path
    let capturedUrl = '';
    const onlineSub = await gradeSubjectiveSubmission({
      question: {
        id: 't1',
        skill: 'translation',
        questionType: 'translation',
        sourceText: '人工智能赋能教育。',
        direction: 'zh_to_vi',
        writing_criteria: ['trí tuệ nhân tạo'],
      },
      userAnswer: 'Trí tuệ nhân tạo trao quyền cho giáo dục.',
      level: 'HSK 7-9',
      fetchFn: async (url) => {
        capturedUrl = String(url);
        return {
          ok: true,
          json: async () => ({
            success: true,
            result: { overall_score: 89, accuracy_score: 90, grammar_score: 88, naturalness_score: 89, detailed_feedback_vi: 'Chuẩn xác' },
          }),
        };
      },
    });
    assert.equal(capturedUrl, '/api/ai/grade');
    assert.equal(onlineSub.gradingSource, 'ai_grade');
    assert.equal(onlineSub.overallScore, 89);
  });

  test('5. Result Analytics calculates skill breakdown & HSK 7/8/9 thresholds, and History isolates by userId & examSystem', async () => {
    assert.equal(resolveHsk79BandFromScore(179), 'Chưa đạt HSK 7');
    assert.equal(resolveHsk79BandFromScore(180), 'HSK 7');
    assert.equal(resolveHsk79BandFromScore(210), 'HSK 8');
    assert.equal(resolveHsk79BandFromScore(240), 'HSK 9');

    const bp79 = getBlueprint(EXAM_SYSTEMS.HSK_3_0, 'HSK 7-9');
    const exam = {
      id: 'dual-hsk30-h79',
      title: 'HSK 3.0 HSK 7-9',
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 7-9',
      mode: EXAM_MODES.FULL_EXAM,
      max_score: bp79.maxScore,
      passing_score: bp79.passingScore,
    };
    const questions = [
      { id: 'qL', skill: 'listening', questionType: 'mcq', correct_option_index: 0, points: 100, prompt: 'L1', options: [{ text: 'A' }, { text: 'B' }] },
      { id: 'qR', skill: 'reading', questionType: 'mcq', correct_option_index: 1, points: 100, prompt: 'R1', options: [{ text: 'A' }, { text: 'B' }] },
      { id: 'qW', skill: 'writing', questionType: 'essay', is_subjective: true, points: 100, prompt: 'W1' },
    ];
    const analytics = analyzeDualExamAttempt({
      exam,
      questions,
      userAnswers: { qL: 0, qR: 0, qW: '作文内容' }, // qL right (100), qR wrong (0), qW 85% (85) -> total 185/300 -> HSK 7
      subjectiveGrades: { qW: { overallScore: 85, feedbackVi: 'Tốt' } },
      timeSpentSeconds: 3600,
    });
    assert.equal(analytics.totalScore, 185);
    assert.equal(analytics.certifiedBand, 'HSK 7');
    assert.equal(analytics.skillBreakdown.listening.accuracyPct, 100);
    assert.equal(analytics.skillBreakdown.reading.accuracyPct, 0);
    assert.equal(analytics.wrongQuestions.length, 1);
    assert.ok(analytics.wrongQuestions[0].askAiTutorPrompt.includes('R1'));

    await withMockLocalStorage(async () => {
      const userA = { id: 'student-a' };
      const userB = { id: 'student-b' };

      saveDualExamHistoryRecord({
        user: userA,
        analytics: { ...analytics, examSystem: EXAM_SYSTEMS.HSK_3_0, totalScore: 185, accuracyPct: 67 },
      });
      saveDualExamHistoryRecord({
        user: userA,
        analytics: { ...analytics, examSystem: EXAM_SYSTEMS.HSK_3_0, totalScore: 220, accuracyPct: 80 },
      });
      saveDualExamHistoryRecord({
        user: userA,
        analytics: { examSystem: EXAM_SYSTEMS.HSK_2_0, level: 'HSK 1', mode: EXAM_MODES.FULL_EXAM, totalScore: 170, maxScore: 200, accuracyPct: 85 },
      });
      saveDualExamHistoryRecord({
        user: userB,
        analytics: { examSystem: EXAM_SYSTEMS.HSK_3_0, level: 'HSK 2', mode: EXAM_MODES.FULL_EXAM, totalScore: 250, maxScore: 300, accuracyPct: 83 },
      });

      const histA30 = getDualExamHistory({ user: userA, examSystem: EXAM_SYSTEMS.HSK_3_0 });
      const histA20 = getDualExamHistory({ user: userA, examSystem: EXAM_SYSTEMS.HSK_2_0 });
      const histBAll = getDualExamHistory({ user: userB });

      assert.equal(histA30.length, 2);
      assert.equal(histA20.length, 1);
      assert.equal(histBAll.length, 1);
      assert.equal(histBAll[0].userId, 'student-b');

      const diff = compareDualExamProgress(histA30[1], histA30[0]);
      assert.equal(diff.compatible, true);
      assert.equal(diff.scoreDelta, 35);
    });
  });
});
