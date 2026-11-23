import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK_EXAMS,
  HSK_QUESTIONS,
  getFullExamById,
  getSanitizedExamForTaking,
} from '../src/data/hskExamsData.js';
import {
  SUPPLEMENTED_EXAM_IDS,
  loadSupplementQuestionsForExam,
  ensureExamSupplementLoaded,
  ensureAllExamSupplementsLoaded,
} from '../src/data/examSupplements/index.js';
import { ensureAllFullStandardExamsLoaded, loadAllHsk30Exams } from '../src/data/hsk30/index.js';
import { getHskExamDetails, getExamForTaking } from '../src/services/hskService.js';

const FORBIDDEN_PLACEHOLDERS = [
  'TODO',
  'placeholder',
  'Câu hỏi mẫu số',
  'Lorem ipsum',
  'đang cập nhật',
  'Từ khóa trọng tâm thuộc chủ đề',
  'Thuật ngữ trọng tâm cấp HSK',
];

const EXPECTED_HSK20_PRIMARY_EXAMS = [
  { id: 'hsk1-mock-01', level: 'HSK 1', baseCount: 40, delta: 0, target: 40, skills: { listening: 20, reading: 20 } },
  { id: 'hsk2-mock-01', level: 'HSK 2', baseCount: 35, delta: 25, target: 60, skills: { listening: 35, reading: 25 } },
  { id: 'hsk3-mock-01', level: 'HSK 3', baseCount: 30, delta: 50, target: 80, skills: { listening: 40, reading: 30, writing: 10 } },
  { id: 'hsk4-mock-01', level: 'HSK 4', baseCount: 30, delta: 70, target: 100, skills: { listening: 45, reading: 40, writing: 15 } },
  { id: 'hsk5-mock-01', level: 'HSK 5', baseCount: 15, delta: 85, target: 100, skills: { listening: 45, reading: 45, writing: 10 } },
  { id: 'hsk6-full-101-01', level: 'HSK 6', baseCount: 101, delta: 0, target: 101, skills: { listening: 50, reading: 50, writing: 1 } },
];

const EXPECTED_HSK30_FULL_EXAMS = [
  { id: 'dual-hsk_3_0-hsk1-full_exam', target: 40, skills: { listening: 20, reading: 20 } },
  { id: 'dual-hsk_3_0-hsk2-full_exam', target: 60, skills: { listening: 25, reading: 25, writing: 10 } },
  { id: 'dual-hsk_3_0-hsk3-full_exam', target: 70, skills: { listening: 30, reading: 30, writing: 10 } },
  { id: 'dual-hsk_3_0-hsk4-full_exam', target: 70, skills: { listening: 32, reading: 32, writing: 6 } },
  { id: 'dual-hsk_3_0-hsk5-full_exam', target: 72, skills: { listening: 35, reading: 35, writing: 2 } },
  { id: 'dual-hsk_3_0-hsk6-full_exam', target: 82, skills: { listening: 40, reading: 40, writing: 2 } },
  { id: 'dual-hsk_3_0-hsk79-full_exam', target: 91, skills: { listening: 40, reading: 40, writing: 2, translation: 4, speaking: 5 } },
];

describe('HSK Exam Completeness & Append-Only Supplement Suite (Zero-Regression)', () => {
  test('1. No-Deletion Guard: 100% of legacy HSK_EXAMS and HSK_QUESTIONS remain intact and untouched', async () => {
    const legacyExamIdsSnapshot = HSK_EXAMS.map((e) => e.id);
    const legacyQuestionCountBefore = HSK_QUESTIONS.length;

    assert.ok(legacyExamIdsSnapshot.length >= 29, 'All legacy exams must remain present');
    assert.ok(legacyQuestionCountBefore >= 500, 'All legacy questions must remain present');

    for (const row of EXPECTED_HSK20_PRIMARY_EXAMS) {
      const baseQs = HSK_QUESTIONS.filter((q) => q.exam_id === row.id);
      assert.equal(baseQs.length, row.baseCount, `Base question count for ${row.id} must remain ${row.baseCount}`);

      if (SUPPLEMENTED_EXAM_IDS.includes(row.id)) {
        const merged = await ensureExamSupplementLoaded(row.id);
        assert.ok(merged, `Failed to merge supplement for ${row.id}`);
        // Original questions must stay at exact indices 0..baseCount-1 with identical IDs
        for (let i = 0; i < baseQs.length; i++) {
          assert.equal(merged.questions[i].id, baseQs[i].id, `Original question #${i} in ${row.id} must not be altered or reordered`);
        }
      }
    }

    assert.equal(HSK_QUESTIONS.length, legacyQuestionCountBefore, 'Supplement loading must never mutate base HSK_QUESTIONS array');
  });

  test('2. Exact Count Check: All primary HSK 2.0 exams and all 7 HSK 3.0 exams reach 100% target counts per skill', async () => {
    await ensureAllExamSupplementsLoaded();
    await ensureAllFullStandardExamsLoaded();

    for (const row of EXPECTED_HSK20_PRIMARY_EXAMS) {
      const details = await getHskExamDetails(row.id);
      assert.ok(details, `Missing exam details for ${row.id}`);
      assert.equal(details.partsSummary.total, row.target, `${row.id} total must be ${row.target}`);

      const full = getFullExamById(row.id);
      assert.equal(full.questions.length, row.target, `${row.id} full questions count must be ${row.target}`);

      for (const [skillName, expectedCount] of Object.entries(row.skills)) {
        const actual = full.questions.filter((q) => (q.skill || q.part_type) === skillName).length;
        assert.equal(actual, expectedCount, `${row.id} ${skillName} count must be ${expectedCount}, got ${actual}`);
      }

      // Verify sanitized taking path returns exact count and strips answers
      const sanitized = await getExamForTaking(row.id);
      assert.equal(sanitized.questions.length, row.target, `Sanitized ${row.id} must have ${row.target} questions`);
      for (const q of sanitized.questions) {
        assert.equal(q.correct_option_index, undefined);
        assert.equal(q.correctIndex, undefined);
        assert.equal(q.explanation, undefined);
        assert.equal(q.explanationVi, undefined);
      }
    }

    for (const row of EXPECTED_HSK30_FULL_EXAMS) {
      const full = getFullExamById(row.id);
      assert.ok(full, `Missing HSK 3.0 full exam ${row.id}`);
      assert.equal(full.questions.length, row.target, `${row.id} total must be ${row.target}`);
      for (const [skillName, expectedCount] of Object.entries(row.skills)) {
        const actual = full.questions.filter((q) => (q.skill || q.part_type) === skillName).length;
        assert.equal(actual, expectedCount, `${row.id} ${skillName} count must be ${expectedCount}`);
      }
    }

    const hsk30Banks = await loadAllHsk30Exams();
    const speakingSum = hsk30Banks.reduce((sum, b) => sum + (b.speakingTasks?.length || 0), 0);
    assert.equal(speakingSum, 30, 'HSK 3-6 separate speaking tasks must total 30 (15+5+5+5)');
  });

  test('3. Zero-Duplicate, Anti-Placeholder & Schema Check across all 230 appended supplementary questions', async () => {
    const globalSupIds = new Set(HSK_QUESTIONS.map((q) => q.id));
    let totalAppended = 0;

    for (const examId of SUPPLEMENTED_EXAM_IDS) {
      const supQs = await loadSupplementQuestionsForExam(examId);
      totalAppended += supQs.length;

      const basePrompts = new Set(
        HSK_QUESTIONS.filter((q) => q.exam_id === examId).map((q) => String(q.prompt || '').trim())
      );
      const localPrompts = new Set();

      for (const q of supQs) {
        assert.ok(q.id && q.id.includes('-sup-'), `Supplement ID must carry -sup- suffix: ${q.id}`);
        assert.ok(!globalSupIds.has(q.id), `Duplicate ID detected: ${q.id}`);
        globalSupIds.add(q.id);

        assert.equal(q.exam_id, examId);
        const prompt = String(q.prompt || '').trim();
        assert.ok(prompt.length >= 10, `Prompt too short on ${q.id}`);
        assert.ok(!basePrompts.has(prompt), `Supplement prompt duplicates base question in ${examId}: ${q.id}`);
        assert.ok(!localPrompts.has(prompt), `Duplicate supplement prompt in ${examId}: ${q.id}`);
        localPrompts.add(prompt);

        const serialized = JSON.stringify(q);
        for (const bad of FORBIDDEN_PLACEHOLDERS) {
          assert.ok(!serialized.includes(bad), `Forbidden placeholder "${bad}" found in ${q.id}`);
        }

        assert.ok(String(q.explanationVi || '').trim().length >= 8, `Missing explanationVi on ${q.id}`);

        if (q.skill === 'listening') {
          const cjk = (String(q.audioText || '').match(/[\u4e00-\u9fa5]/g) || []).length;
          assert.ok(cjk >= 6, `Listening question ${q.id} must include Chinese audioText`);
        }

        if (q.questionType === 'mcq' || q.questionType === 'true_false') {
          assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Missing options on ${q.id}`);
          assert.equal(typeof q.correctIndex, 'number', `Missing correctIndex on ${q.id}`);
          assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Out-of-range correctIndex on ${q.id}`);
        } else if (q.questionType === 'fill_blank' || q.questionType === 'reorder') {
          assert.ok(String(q.expectedAnswer || '').trim().length >= 1, `Missing expectedAnswer on ${q.id}`);
          assert.ok(Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length >= 1, `Missing acceptedAnswers on ${q.id}`);
        } else if (q.questionType === 'essay' || q.questionType === 'translation' || q.questionType === 'speaking') {
          assert.ok(String(q.sampleAnswer || '').trim().length >= 15, `Missing sampleAnswer on ${q.id}`);
          assert.ok(Array.isArray(q.rubric) && q.rubric.length >= 2, `Missing rubric on ${q.id}`);
        }
      }

      // Sanitization lock check directly via getSanitizedExamForTaking
      const san = getSanitizedExamForTaking(examId);
      assert.ok(san && san.questions.length > supQs.length);
    }

    assert.equal(totalAppended, 230, `Expected exactly 230 supplementary questions (25+50+70+85), got ${totalAppended}`);
  });
});
