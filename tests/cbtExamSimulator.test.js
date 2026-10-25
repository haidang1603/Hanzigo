import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HSK_EXAMS,
  getFullExamById,
  getSanitizedExamForTaking
} from '../src/data/hskExamsData.js';
import {
  saveTemporaryAnswers,
  getTemporaryAnswers,
  getTemporaryExamSession,
  clearTemporaryAnswers
} from '../src/services/hskService.js';

test('HSK CBT Exam Simulator & Data Integrity Test Suite', async (t) => {
  const allExams = HSK_EXAMS;

  await t.test('1. Multi-Exam Coverage: At least 3 Sets per Level (HSK 1 to HSK 6)', () => {
    const levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];

    levels.forEach(lvl => {
      const examsInLevel = allExams.filter(e => e.level === lvl);
      assert.ok(
        examsInLevel.length >= 3,
        `Expected ${lvl} to have at least 3 mock exam sets, found ${examsInLevel.length}`
      );

      // Verify each set has distinct ID and title
      const ids = examsInLevel.map(e => e.id);
      const uniqueIds = new Set(ids);
      assert.equal(ids.length, uniqueIds.size, `Duplicate exam IDs found in ${lvl}`);
    });
  });

  await t.test('2. International Standard CBT Structure: 200 pts (HSK 1-2) & 300 pts (HSK 3-6)', () => {
    const fullCbtExams = allExams.filter(e => e.id.includes('mock') && (e.skill_category === 'mixed' || e.skill_category === 'all' || !e.skill_category));
    assert.equal(fullCbtExams.length, 18, `Expected exactly 18 full CBT mock exams (3 per level for HSK 1-6), found ${fullCbtExams.length}`);

    fullCbtExams.forEach(exam => {
      const details = getFullExamById(exam.id);
      assert.ok(details, `Could not get details for exam ${exam.id}`);

      const lvlNum = parseInt((exam.level || 'HSK 1').replace(/\D/g, '') || '1');

      if (lvlNum <= 2) {
        // HSK 1 - 2: 2 sections (Listening + Reading), max 200, passing 120
        assert.equal(details.max_score, 200, `Exam ${exam.id} must have max_score = 200`);
        assert.equal(details.passing_score, 120, `Exam ${exam.id} must have passing_score = 120`);

        const hasListening = details.questions.some(q => (q.section || q.part_type) === 'listening');
        const hasReading = details.questions.some(q => (q.section || q.part_type) === 'reading');
        assert.ok(hasListening, `Exam ${exam.id} must include listening questions`);
        assert.ok(hasReading, `Exam ${exam.id} must include reading questions`);
      } else {
        // HSK 3 - 6: 3 sections (Listening + Reading + Writing), max 300, passing 180
        assert.equal(details.max_score, 300, `Exam ${exam.id} must have max_score = 300`);
        assert.equal(details.passing_score, 180, `Exam ${exam.id} must have passing_score = 180`);

        const hasListening = details.questions.some(q => (q.section || q.part_type) === 'listening');
        const hasReading = details.questions.some(q => (q.section || q.part_type) === 'reading');
        const hasWriting = details.questions.some(q => (q.section || q.part_type) === 'writing');
        assert.ok(hasListening, `Exam ${exam.id} must include listening questions`);
        assert.ok(hasReading, `Exam ${exam.id} must include reading questions`);
        assert.ok(hasWriting, `Exam ${exam.id} must include writing questions`);
      }
    });
  });

  await t.test('3. Question Pedagogical Rigor: Explanations, Audio Scripts & Scrambled Words', () => {
    allExams.forEach(exam => {
      const details = getFullExamById(exam.id);

      details.questions.forEach((q, idx) => {
        const sec = q.section || q.part_type || 'reading';
        const qType = q.question_type || q.questionType;

        // Prompt
        assert.ok(q.prompt && q.prompt.trim().length > 0, `Question ${q.id} in ${exam.id} missing prompt`);

        // Pedagogical explanation in Vietnamese
        assert.ok(
          q.explanation && q.explanation.trim().length > 5,
          `Question ${q.id} in ${exam.id} missing Vietnamese explanation`
        );

        // Listening checks
        if (sec === 'listening') {
          assert.equal(typeof q.audio_url, 'string', `Listening question ${q.id} must have audio_url string`);
          assert.ok(
            q.audio_script && q.audio_script.trim().length > 0,
            `Listening question ${q.id} missing audio_script`
          );
        }

        // Writing reorder checks
        if (qType === 'writing_reorder' || qType === 'reorder_sentence') {
          const words = q.scrambledWords || q.words;
          assert.ok(Array.isArray(words) && words.length >= 3, `Reorder question ${q.id} must have scrambledWords`);
          assert.ok(
            q.correct_sentence || q.correct_order || q.correct_option_index !== undefined,
            `Reorder question ${q.id} missing answer definition`
          );
        }

        // Sentence order ABC checks
        if (qType === 'sentence_order_abc') {
          assert.ok(q.propositions && q.propositions.A && q.propositions.B && q.propositions.C, `ABC question ${q.id} missing propositions`);
          assert.ok(q.answerKey || q.correct_order_abc || q.correct_option_index !== undefined, `ABC question ${q.id} missing answer key`);
        }
      });
    });
  });

  await t.test('4. Security & CBT Exam Sanitization', () => {
    const testExamId = 'hsk3-mock-02';
    const sanitized = getSanitizedExamForTaking(testExamId);
    assert.ok(sanitized, 'Sanitized exam must exist');

    sanitized.questions.forEach(sq => {
      // Answers and explanations MUST be undefined for client security
      assert.equal(sq.correct_option_index, undefined, `Sanitized ${sq.id} leaked correct_option_index`);
      assert.equal(sq.correct_order, undefined, `Sanitized ${sq.id} leaked correct_order`);
      assert.equal(sq.correct_sentence, undefined, `Sanitized ${sq.id} leaked correct_sentence`);
      assert.equal(sq.accepted_answers, undefined, `Sanitized ${sq.id} leaked accepted_answers`);
      assert.equal(sq.sample_answer, undefined, `Sanitized ${sq.id} leaked sample_answer`);
      assert.equal(sq.explanation, undefined, `Sanitized ${sq.id} leaked explanation`);

      // Interactive attributes MUST be preserved
      assert.ok(sq.section || sq.part_type, `Sanitized ${sq.id} missing section`);
      if (sq.question_type === 'writing_reorder' || sq.question_type === 'reorder_sentence') {
        assert.ok(Array.isArray(sq.scrambledWords || sq.words), `Sanitized ${sq.id} missing words`);
      }
    });
  });

  await t.test('5. Session Persistence & Auto-Save Recovery', () => {
    // Mock localStorage in Node test environment
    const storageMock = {};
    global.localStorage = {
      getItem: (key) => storageMock[key] || null,
      setItem: (key, val) => { storageMock[key] = String(val); },
      removeItem: (key) => { delete storageMock[key]; }
    };

    const examId = 'hsk4-mock-01';
    const testAnswers = { 'q-hsk4-01-01': 1, 'q-hsk4-01-05': ['把', '书', '给我'] };
    const metadata = { flaggedQuestionIds: ['q-hsk4-01-01'], examMode: 'simulation', currentIdx: 2 };

    saveTemporaryAnswers(examId, testAnswers, metadata);

    // Retrieve answers
    const restoredAnswers = getTemporaryAnswers(examId);
    assert.deepEqual(restoredAnswers, testAnswers);

    // Retrieve complete session
    const session = getTemporaryExamSession(examId);
    assert.deepEqual(session.answers, testAnswers);
    assert.deepEqual(session.flaggedQuestionIds, ['q-hsk4-01-01']);
    assert.equal(session.examMode, 'simulation');
    assert.equal(session.currentIdx, 2);

    // Clear session
    clearTemporaryAnswers(examId);
    assert.equal(getTemporaryAnswers(examId), null);
    assert.equal(getTemporaryExamSession(examId), null);
  });
});
