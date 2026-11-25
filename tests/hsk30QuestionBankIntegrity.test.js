import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ensureAllExamSupplementsLoaded } from '../src/data/examSupplements/index.js';
import { HSK30_LEVEL2_QUESTIONS } from '../src/data/hsk30/hsk30Level2.js';

import {
  loadHsk30ExamByLevel,
  loadAllHsk30Exams,
  loadHsk20FullExpansion,
  ensureAllFullStandardExamsLoaded,
} from '../src/data/hsk30/index.js';
import {
  EXAM_SYSTEMS,
  EXAM_MODES,
  assembleDualSystemExam,
  autoGradeObjectiveAnswers,
} from '../src/data/hskExamBlueprints.js';
import { HSK_EXAMS, HSK_QUESTIONS, getSanitizedExamForTaking } from '../src/data/hskExamsData.js';
import { getHskExams, getHskExamDetails, getExamForTaking } from '../src/services/hskService.js';

const FORBIDDEN_PLACEHOLDERS = [
  'TODO',
  'placeholder',
  'Câu hỏi mẫu số',
  'Lorem ipsum',
  'đang cập nhật',
  'Từ khóa trọng tâm thuộc chủ đề',
  'Thuật ngữ trọng tâm cấp HSK',
  'HÁN VIỆT CHUẨN',
];

const FORBIDDEN_OPTION_PLACEHOLDERS = /^([A-D]\.\s*)?(Đáp án [A-D]|Option [A-D])$/i;

const EXPECTED_SPECS = [
  {
    levelKey: 'hsk1',
    blueprintLevel: 'HSK 1',
    total: 40,
    mins: 40,
    speakingTasks: 0,
    requiresPinyin: true,
    skills: {
      listening: { total: 20, parts: { 1: 5, 2: 5, 3: 5, 4: 5 } },
      reading: { total: 20, parts: { 1: 5, 2: 5, 3: 5, 4: 5 } },
    },
  },
  {
    levelKey: 'hsk2',
    blueprintLevel: 'HSK 2',
    total: 60,
    mins: 60,
    speakingTasks: 0,
    skills: {
      listening: { total: 25, parts: { 1: 6, 2: 6, 3: 7, 4: 6 } },
      reading: { total: 25, parts: { 1: 6, 2: 6, 3: 7, 4: 6 } },
      writing: { total: 10, parts: { 1: 5, 2: 5 } },
    },
  },
  {
    levelKey: 'hsk3',
    blueprintLevel: 'HSK 3',
    total: 70,
    mins: 83,
    speakingTasks: 15,
    skills: {
      listening: { total: 30, parts: { 1: 10, 2: 10, 3: 10 } },
      reading: { total: 30, parts: { 1: 10, 2: 10, 3: 10 } },
      writing: { total: 10, parts: { 1: 5, 2: 5 } },
    },
  },
  {
    levelKey: 'hsk4',
    blueprintLevel: 'HSK 4',
    total: 70,
    mins: 85,
    speakingTasks: 5,
    skills: {
      listening: { total: 32, parts: { 1: 10, 2: 12, 3: 10 } },
      reading: { total: 32, parts: { 1: 10, 2: 10, 3: 12 } },
      writing: { total: 6, parts: { 1: 5, 2: 1 } },
    },
  },
  {
    levelKey: 'hsk5',
    blueprintLevel: 'HSK 5',
    total: 72,
    mins: 110,
    speakingTasks: 5,
    skills: {
      listening: { total: 35, parts: { 1: 15, 2: 20 } },
      reading: { total: 35, parts: { 1: 15, 2: 10, 3: 10 } },
      writing: { total: 2, parts: { 1: 1, 2: 1 } },
    },
  },
  {
    levelKey: 'hsk6',
    blueprintLevel: 'HSK 6',
    total: 82,
    mins: 125,
    speakingTasks: 5,
    skills: {
      listening: { total: 40, parts: { 1: 15, 2: 15, 3: 10 } },
      reading: { total: 40, parts: { 1: 10, 2: 10, 3: 10, 4: 10 } },
      writing: { total: 2, parts: { 1: 1, 2: 1 } },
    },
  },
  {
    levelKey: 'hsk7-9',
    blueprintLevel: 'HSK 7-9',
    total: 91,
    mins: 200,
    speakingTasks: 0,
    skills: {
      listening: { total: 40, parts: { 1: 10, 2: 9, 3: 15, 4: 6 } },
      reading: { total: 40, parts: { 1: 21, 2: 5, 3: 14 } },
      writing: { total: 2, parts: { 1: 1, 2: 1 } },
      translation: { total: 4, parts: { 1: 2, 2: 2 } },
      speaking: { total: 5, parts: { 1: 1, 2: 3, 3: 1 } },
    },
  },
];

describe('HSK 3.0 Complete 485-Question Bank Integrity Suite', () => {
  test('1. Exact counts (485 main questions + 30 speaking tasks HSK 3-6) and CTI 2026 format distributions', async () => {
    const banks = await loadAllHsk30Exams();
    assert.equal(banks.length, 7);

    const totalMain = banks.reduce((sum, b) => sum + b.questions.length, 0);
    const totalSpeakingTasks = banks.reduce((sum, b) => sum + (b.speakingTasks?.length || 0), 0);
    assert.equal(totalMain, 485, `Expected 485 total questions, got ${totalMain}`);
    assert.equal(totalSpeakingTasks, 30, `Expected 30 separate speaking tasks across HSK 3-6 (15+5+5+5), got ${totalSpeakingTasks}`);

    const h1 = banks.find((b) => b.levelKey === 'hsk1');
    assert.equal(h1.questions.filter((q) => q.skill === 'listening' && q.questionType === 'true_false').length, 0);

    const h5 = banks.find((b) => b.levelKey === 'hsk5');
    assert.ok(h5.questions.some((q) => q.skill === 'reading' && q.part === 2 && q.prompt.includes('段落排序')));
    assert.equal(h5.questions.find((q) => q.id === 'hsk30-l5-wri-p1-01')?.min_words, 100);
    assert.equal(h5.questions.find((q) => q.id === 'hsk30-l5-wri-p2-01')?.min_words, 200);

    const h6 = banks.find((b) => b.levelKey === 'hsk6');
    assert.equal(h6.questions.filter((q) => q.skill === 'reading' && q.prompt.includes('语病')).length, 0);
    assert.equal(h6.questions.find((q) => q.id === 'hsk30-l6-wri-p1-01')?.min_words, 150);
    assert.equal(h6.questions.find((q) => q.id === 'hsk30-l6-wri-p2-01')?.min_words, 300);

    for (const spec of EXPECTED_SPECS) {
      const bank = banks.find((b) => b.levelKey === spec.levelKey);
      assert.ok(bank, `Missing bank for ${spec.levelKey}`);
      assert.equal(bank.questions.length, spec.total, `${spec.levelKey} total count mismatch`);
      assert.equal(bank.metadata.durationMinutes, spec.mins, `${spec.levelKey} duration mismatch`);
      assert.equal(bank.speakingTasks.length, spec.speakingTasks, `${spec.levelKey} speakingTasks mismatch`);

      for (const [skillName, skillSpec] of Object.entries(spec.skills)) {
        const skillQs = bank.questions.filter((q) => q.skill === skillName);
        assert.equal(skillQs.length, skillSpec.total, `${spec.levelKey} ${skillName} count mismatch`);
        for (const [partNum, partCount] of Object.entries(skillSpec.parts)) {
          const partQs = skillQs.filter((q) => Number(q.part) === Number(partNum));
          assert.equal(partQs.length, partCount, `${spec.levelKey} ${skillName} P${partNum} count mismatch`);
        }
      }
    }
  });

  test('2. Zero duplicates, zero synthetic placeholders, and 100% valid schema per questionType', async () => {
    const banks = await loadAllHsk30Exams();
    const globalIds = new Set();

    for (const spec of EXPECTED_SPECS) {
      const bank = banks.find((b) => b.levelKey === spec.levelKey);
      const levelPrompts = new Set();
      const allItems = [...bank.questions, ...(bank.speakingTasks || [])];

      for (const q of allItems) {
        assert.ok(q.id && typeof q.id === 'string', 'Missing question id');
        assert.ok(!globalIds.has(q.id), `Duplicate global ID: ${q.id}`);
        globalIds.add(q.id);

        assert.equal(q.examSystem, 'hsk_3_0');
        assert.equal(q.level, spec.levelKey);

        const cleanPrompt = String(q.prompt || '').trim();
        assert.ok(cleanPrompt.length >= 8, `Prompt too short on ${q.id}`);
        assert.ok(!levelPrompts.has(cleanPrompt), `Duplicate prompt in ${spec.levelKey}: ${q.id}`);
        levelPrompts.add(cleanPrompt);

        assert.ok(String(q.explanationVi || '').trim().length >= 8, `Missing explanationVi on ${q.id}`);

        const serialized = JSON.stringify(q);
        for (const forbidden of FORBIDDEN_PLACEHOLDERS) {
          assert.ok(!serialized.includes(forbidden), `Forbidden placeholder "${forbidden}" found in ${q.id}`);
        }
        if (Array.isArray(q.options)) {
          for (const opt of q.options) {
            const optText = typeof opt === 'string' ? opt : opt?.text || '';
            assert.ok(!FORBIDDEN_OPTION_PLACEHOLDERS.test(optText.trim()), `Placeholder option "${optText}" in ${q.id}`);
          }
        }

        if (spec.requiresPinyin) {
          assert.ok(String(q.pinyin || '').trim().length >= 4, `HSK 1 question ${q.id} must have pinyin`);
        }

        if (q.skill === 'listening') {
          const cjkChars = (String(q.audioText || '').match(/[\u4e00-\u9fa5]/g) || []).length;
          assert.ok(cjkChars >= 4, `Listening question ${q.id} must have Chinese audioText`);
        }

        if (q.questionType === 'mcq' || q.questionType === 'true_false') {
          assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Missing options on ${q.id}`);
          assert.equal(typeof q.correctIndex, 'number', `Missing correctIndex on ${q.id}`);
          assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Out-of-range correctIndex on ${q.id}`);
        } else if (q.questionType === 'fill_blank' || q.questionType === 'reorder') {
          assert.ok(String(q.expectedAnswer || '').trim().length >= 1, `Missing expectedAnswer on ${q.id}`);
          assert.ok(Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length >= 1, `Missing acceptedAnswers on ${q.id}`);
        } else if (q.questionType === 'essay' || q.questionType === 'translation' || q.questionType === 'speaking') {
          assert.ok(String(q.sampleAnswer || '').trim().length >= 20, `Missing sampleAnswer on ${q.id}`);
          assert.ok(Array.isArray(q.rubric) && q.rubric.length >= 2, `Missing rubric on ${q.id}`);
        }
      }
    }
  });

  test('3. Dynamic loader registers 100% full-coverage exams into Assembler without breaking HSK 2.0 or sanitization', async () => {
    for (const spec of EXPECTED_SPECS) {
      await loadHsk30ExamByLevel(spec.levelKey);
      const assembled = assembleDualSystemExam({
        examSystem: EXAM_SYSTEMS.HSK_3_0,
        level: spec.blueprintLevel,
        mode: EXAM_MODES.FULL_EXAM,
      });

      assert.equal(assembled.questions.length, spec.total, `${spec.blueprintLevel} assembled count mismatch`);
      assert.equal(assembled.bankCoverage.blueprintTotalQuestions, spec.total);
      assert.equal(assembled.bankCoverage.assembledQuestionsCount, spec.total);
      assert.equal(assembled.bankCoverage.coverageRatio, 1, `${spec.blueprintLevel} coverageRatio must be 1`);
      assert.equal(assembled.bankCoverage.isCondensedBank, false, `${spec.blueprintLevel} should not be condensed`);

      // Sanitization lock check
      const sanitized = getSanitizedExamForTaking(assembled.id);
      assert.ok(sanitized);
      assert.equal(sanitized.questions.length, spec.total);
      for (const q of sanitized.questions) {
        assert.equal(q.correctIndex, undefined);
        assert.equal(q.correct_option_index, undefined);
        assert.equal(q.expectedAnswer, undefined);
        assert.equal(q.acceptedAnswers, undefined);
        assert.equal(q.accepted_answers, undefined);
        assert.equal(q.sampleAnswer, undefined);
        assert.equal(q.sample_answer, undefined);
        assert.equal(q.explanationVi, undefined);
        assert.equal(q.explanation, undefined);
      }

      // Auto-grader compatibility on full exam objective subset
      const objectiveSample = assembled.questions.filter((q) => ['mcq', 'true_false'].includes(q.questionType)).slice(0, 3);
      const mockAnswers = Object.fromEntries(objectiveSample.map((q) => [q.id, q.correct_option_index]));
      const graded = autoGradeObjectiveAnswers(objectiveSample, mockAnswers);
      assert.equal(graded.correctCount, objectiveSample.length);
    }

    // HSK 2.0 preservation check
    assert.ok(HSK_EXAMS.some((e) => e.id === 'hsk1-mock-01'));
    assert.ok(HSK_EXAMS.some((e) => e.id === 'hsk6-full-101-01'));
    assert.ok(HSK_QUESTIONS.length >= 500);
  });

  test('4. HSK 2.0 full expansion (125 questions) & getHskExams repository cover 100% of all levels in HSK 2.0 & 3.0', async () => {
    const exp = await loadHsk20FullExpansion();
    assert.equal(exp.length, 125, `Expected 125 HSK 2.0 expansion questions, got ${exp.length}`);

    const seenIds = new Set(HSK_QUESTIONS.map((q) => q.id));
    const seenPrompts = new Set();
    for (const q of exp) {
      assert.ok(!seenIds.has(q.id), `Duplicate ID with base bank: ${q.id}`);
      seenIds.add(q.id);
      const p = String(q.prompt || '').trim();
      assert.ok(p.length >= 10 && !seenPrompts.has(p), `Duplicate or short prompt on ${q.id}`);
      seenPrompts.add(p);
      assert.ok(String(q.explanation || '').trim().length >= 8, `Missing explanation on ${q.id}`);
      if (q.skill === 'listening') {
        const cjk = (String(q.audio_script || '').match(/[\u4e00-\u9fa5]/g) || []).length;
        assert.ok(cjk >= 6, `Listening question ${q.id} missing Chinese audio_script`);
      }
      assert.ok(Array.isArray(q.options) && q.options.length === 4);
      assert.equal(typeof q.correct_option_index, 'number');
    }

    await ensureAllFullStandardExamsLoaded();

    const hsk20Targets = [
      { level: 'HSK 1', count: 40 },
      { level: 'HSK 2', count: 60 },
      { level: 'HSK 3', count: 80 },
      { level: 'HSK 4', count: 100 },
      { level: 'HSK 5', count: 100 },
      { level: 'HSK 6', count: 101 },
    ];
    for (const row of hsk20Targets) {
      const assembled = assembleDualSystemExam({
        examSystem: EXAM_SYSTEMS.HSK_2_0,
        level: row.level,
        mode: EXAM_MODES.FULL_EXAM,
      });
      assert.equal(assembled.questions.length, row.count, `HSK 2.0 ${row.level} must have ${row.count} questions`);
      assert.equal(assembled.bankCoverage.coverageRatio, 1);
      assert.equal(assembled.bankCoverage.isCondensedBank, false);
    }

    const catalog = await getHskExams();
    assert.equal(catalog.length, 19, `Default exam catalog should contain 19 full-count exams (7 HSK 3.0 + 6 dual HSK 2.0 + 6 primary HSK 2.0), got ${catalog.length}`);
    assert.ok(catalog.every((e) => e.total_questions >= 40), 'No partial/incomplete mock exams allowed in default catalog');
    assert.ok(catalog.some((e) => e.id === 'hsk2-mock-01' && e.total_questions === 60));
    assert.ok(catalog.some((e) => e.id === 'hsk5-mock-01' && e.total_questions === 100));
    assert.ok(catalog.some((e) => e.id === 'dual-hsk_3_0-hsk79-full_exam' && e.total_questions === 91));
    assert.ok(catalog.some((e) => e.id === 'dual-hsk_2_0-hsk5-full_exam' && e.total_questions === 100));

    const hsk79Filtered = await getHskExams({ level: 'HSK 7–9' });
    assert.ok(hsk79Filtered.some((e) => e.id === 'dual-hsk_3_0-hsk79-full_exam'));

    const details = await getHskExamDetails('dual-hsk_2_0-hsk5-full_exam');
    assert.ok(details && details.partsSummary.total === 100);

    const taking = await getExamForTaking('dual-hsk_3_0-hsk4-full_exam');
    assert.ok(taking && taking.questions.length === 70);
    assert.equal(taking.questions[0].correctIndex, undefined);
    assert.equal(taking.questions[0].correct_option_index, undefined);
  });

  test('5. Content Audit Regression: zero numbered pinyin in prompts, 60/60 HSK 3.0 L2 pinyin, canonical hanzigo.io.vn domains', async () => {
    // 5.1 Zero raw numbered pinyin in HSK 3.0 & supplement prompts
    const numberedPinyinRe = /\([a-zA-Z]{1,6}[1-5]\)/;
    const banks = await loadAllHsk30Exams();
    for (const bank of banks) {
      for (const q of [...bank.questions, ...(bank.speakingTasks || [])]) {
        assert.ok(
          !numberedPinyinRe.test(String(q.prompt || '')),
          `Raw numbered pinyin found in HSK 3.0 prompt (${q.id}): ${q.prompt}`
        );
      }
    }
    const supplements = await ensureAllExamSupplementsLoaded();
    for (const exam of Object.values(supplements || {})) {
      for (const q of exam.questions || []) {
        assert.ok(
          !numberedPinyinRe.test(String(q.prompt || '')),
          `Raw numbered pinyin found in supplement prompt (${q.id}): ${q.prompt}`
        );
      }
    }

    // 5.2 All 60 HSK 3.0 Level 2 questions must have explicit tone-marked pinyin
    assert.equal(HSK30_LEVEL2_QUESTIONS.length, 60);
    for (const q of HSK30_LEVEL2_QUESTIONS) {
      const py = String(q.pinyin || '').trim();
      assert.ok(py.length >= 3, `HSK 3.0 Level 2 question ${q.id} is missing explicit pinyin`);
      assert.ok(!/[a-zA-Z][1-5]\b/.test(py), `HSK 3.0 Level 2 pinyin ${q.id} must use tone marks, not numbers: ${py}`);
    }

    // 5.3 Canonical domain enforcement (no legacy hanzigo.com or hanzigo-xi.vercel.app)
    const filesToCheck = [
      'src/components/certificate/CertificateGeneratorModal.jsx',
      'src/components/dictionary/WorksheetGeneratorModal.jsx',
      'src/data/hskExamsData.js',
      'src/data/hskMockExamsExpanded.js',
      'src/data/hsk6FullExamData.js',
      'src/data/hskResourcesData.js',
    ];
    for (const relPath of filesToCheck) {
      const src = fs.readFileSync(path.resolve(relPath), 'utf8');
      assert.ok(!src.includes('hanzigo-xi.vercel.app'), `Legacy vercel.app URL remains in ${relPath}`);
      assert.ok(!src.includes('https://hanzigo.com/'), `Legacy hanzigo.com URL remains in ${relPath}`);
    }
  });
});
