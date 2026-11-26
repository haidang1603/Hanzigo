import test from 'node:test';
import assert from 'node:assert/strict';

import { HSK_EXAMS, getFullExamById } from '../src/data/hskExamsData.js';
import { ensureAllExamSupplementsLoaded } from '../src/data/examSupplements/index.js';
import { ensureAllFullStandardExamsLoaded } from '../src/data/hsk30/index.js';
import { HSK_7_TO_9_EXAM_PAPER } from '../src/features/hsk-exam/data/hsk7to9SampleExamPaper.js';

const NON_MCQ_TYPES = new Set([
  'true_false',
  'reorder',
  'fill_blank',
  'free_writing',
  'essay_summary',
  'translation',
  'speaking',
]);

function isExcludedPositionMcq(q) {
  return /^q-hsk6-full-07\d$/.test(q.id) || q.id === 'q-hsk6-full-080';
}

function getOptText(o) {
  if (typeof o === 'string') return o;
  if (o && typeof o === 'object') return String(o.text ?? o.label ?? o.value ?? '');
  return '';
}

function getCorrectIndex(q) {
  if (typeof q.correct_option_index === 'number') return q.correct_option_index;
  if (typeof q.correctIndex === 'number') return q.correctIndex;
  if (typeof q.correctAnswer === 'number') return q.correctAnswer;
  return -1;
}

function isEligibleMcq(q) {
  if (!q || !Array.isArray(q.options)) return false;
  if (q.options.length !== 3 && q.options.length !== 4) return false;
  if (NON_MCQ_TYPES.has(String(q.type || '').toLowerCase())) return false;
  if (isExcludedPositionMcq(q)) return false;
  return true;
}

function isSentenceOrderQuestion(q) {
  return Array.isArray(q.options) && q.options.some((o) => /^[A-C]\s*-\s*[A-C]/.test(getOptText(o).trim()));
}

function maxConsecutiveStreak(indices) {
  let max = 0;
  let cur = 0;
  let prev = -1;
  for (const idx of indices) {
    if (idx === prev) cur++;
    else {
      cur = 1;
      prev = idx;
    }
    if (cur > max) max = cur;
  }
  return max;
}

async function loadAllExamBundles() {
  await ensureAllExamSupplementsLoaded();
  const { hsk30Exams = [], hsk20FullExams = [] } = await ensureAllFullStandardExamsLoaded();
  const byId = new Map();

  for (const ex of HSK_EXAMS) {
    const full = getFullExamById(ex.id);
    if (full) byId.set(full.id, full);
  }
  for (const ex of [...hsk20FullExams, ...hsk30Exams]) {
    if (ex) byId.set(ex.id, ex);
  }
  return [...byId.values()];
}

test('HSK 2.0 & 3.0 Exam Bank: Answer distribution balance and anti-streak <= 2', async () => {
  const exams = await loadAllExamBundles();
  assert.ok(exams.length >= 25, 'Expected full catalog of standalone & dual-system HSK exams');

  for (const exam of exams) {
    const mcqsAll = (exam.questions || []).filter((q) => Array.isArray(q.options) && q.options.length >= 3 && !NON_MCQ_TYPES.has(String(q.type || '').toLowerCase()));
    const allIndices = mcqsAll.map(getCorrectIndex);
    assert.ok(
      maxConsecutiveStreak(allIndices) <= 2,
      `Exam ${exam.id} has consecutive MCQ streak > 2 (${maxConsecutiveStreak(allIndices)})`
    );

    const k4 = (exam.questions || []).filter((q) => isEligibleMcq(q) && q.options.length === 4);
    if (k4.length >= 20) {
      const counts = [0, 0, 0, 0];
      for (const q of k4) counts[getCorrectIndex(q)]++;
      for (let i = 0; i < 4; i++) {
        const ratio = counts[i] / k4.length;
        assert.ok(
          ratio >= 0.18 && ratio <= 0.32,
          `Exam ${exam.id} 4-option letter ${'ABCD'[i]} out of [18%, 32%]: ${(ratio * 100).toFixed(1)}% (${counts.join('/')})`
        );
      }
      assert.ok(maxConsecutiveStreak(k4.map(getCorrectIndex)) <= 2, `Exam ${exam.id} K4 streak > 2`);
    }

    const k3 = (exam.questions || []).filter((q) => isEligibleMcq(q) && q.options.length === 3);
    if (k3.length >= 9) {
      const counts = [0, 0, 0];
      for (const q of k3) counts[getCorrectIndex(q)]++;
      for (let i = 0; i < 3; i++) {
        const ratio = counts[i] / k3.length;
        assert.ok(
          ratio >= 0.25 && ratio <= 0.42,
          `Exam ${exam.id} 3-option letter ${'ABC'[i]} out of [25%, 42%]: ${(ratio * 100).toFixed(1)}% (${counts.join('/')})`
        );
      }
      assert.ok(maxConsecutiveStreak(k3.map(getCorrectIndex)) <= 2, `Exam ${exam.id} K3 streak > 2`);
    }

    const tfs = (exam.questions || []).filter(
      (q) =>
        Array.isArray(q.options) &&
        q.options.length === 2 &&
        (String(q.type || '').toLowerCase() === 'true_false' ||
          /(?:Đúng|Sai|一致|不一致|对|错)/i.test(getOptText(q.options[0]))) &&
        !['reorder', 'fill_blank', 'free_writing', 'essay_summary', 'translation', 'speaking'].includes(
          String(q.type || '').toLowerCase()
        )
    );
    if (tfs.length >= 4) {
      const c0 = tfs.filter((q) => getCorrectIndex(q) === 0).length;
      const c1 = tfs.length - c0;
      const maxRatio = Math.max(c0, c1) / tfs.length;
      assert.ok(
        maxRatio <= 0.7,
        `Exam ${exam.id} true/false balance ${c0}/${c1} exceeds 70/30`
      );
    }
  }

  const paperMcqs = HSK_7_TO_9_EXAM_PAPER.sections.flatMap((s) => s.questions || []);
  const paperIndices = paperMcqs.map((q) => q.correctIndex);
  assert.ok(maxConsecutiveStreak(paperIndices) <= 2, 'HSK 7-9 sample paper has streak > 2');
});

test('HSK Exam Bank: Parallel option sync, uniqueness, explanation letter consistency & Pinyin quality', async () => {
  const exams = await loadAllExamBundles();
  const seen = new Map();
  for (const exam of exams) {
    for (const q of exam.questions || []) {
      if (!seen.has(q.id)) seen.set(q.id, { q, exam });
    }
  }

  assert.ok(seen.size >= 1350, `Expected >= 1350 unique questions, found ${seen.size}`);

  for (const [id, { q, exam }] of seen.entries()) {
    if (Array.isArray(q.options) && q.options.length >= 2) {
      const idx = getCorrectIndex(q);
      assert.ok(
        Number.isInteger(idx) && idx >= 0 && idx < q.options.length,
        `Invalid correctIndex on ${id}: ${idx}`
      );

      if (Array.isArray(q.optionsPinyin)) {
        assert.equal(q.optionsPinyin.length, q.options.length, `optionsPinyin length mismatch on ${id}`);
      }
      if (Array.isArray(q.optionsTranslation)) {
        assert.equal(q.optionsTranslation.length, q.options.length, `optionsTranslation length mismatch on ${id}`);
      }
      if (Array.isArray(q.optionImages)) {
        assert.equal(q.optionImages.length, q.options.length, `optionImages length mismatch on ${id}`);
      }

      const normalizedOpts = q.options.map((o) =>
        getOptText(o)
          .replace(/^[A-E]\.\s*/, '')
          .trim()
      );
      assert.equal(
        new Set(normalizedOpts).size,
        normalizedOpts.length,
        `Duplicate options detected on ${id}`
      );

      if (!isExcludedPositionMcq(q)) {
        q.options.forEach((o, i) => {
          const raw = getOptText(o);
          const m = raw.match(/^([A-D])\.\s/);
          if (m) {
            assert.equal(m[1], 'ABCD'[i], `Option label prefix mismatch on ${id}: ${raw}`);
          }
          if (o && typeof o === 'object' && o.id && /^[A-D]$/.test(o.id)) {
            assert.equal(o.id, 'ABCD'[i], `Option object id mismatch on ${id}: ${o.id}`);
          }
        });
      }

      if (isEligibleMcq(q)) {
        const exp = q.explanation || q.explanationVi || '';
        const expectedLetter = 'ABCD'[idx];
        const explicitMatch =
          exp.match(/(?:Đáp án(?:\s+chính\s+xác|\s+đúng)?(?:\s+là)?|Chọn(?:\s+phương\s+án)?|[Pp]hương\s+án)\s+([A-D])(?![\p{L}\p{N}])/u) ||
          (!isSentenceOrderQuestion(q) ? exp.match(/->\s*([A-D])(?![\p{L}\p{N}])/u) : null) ||
          exp.match(/^\s*([A-D])\s+(?:hoàn toàn|chuẩn xác|chính xác)/u);
        if (explicitMatch) {
          assert.equal(
            explicitMatch[1],
            expectedLetter,
            `Explanation letter mismatch on ${id} (correct=${expectedLetter}, explanation="${exp}")`
          );
        }
      }
    }

    const levelNum = Number(exam.level || 0);
    const checkRawTonePinyin = levelNum === 1 || levelNum === 2 || /^hsk30-l[12]-/.test(id);
    if (checkRawTonePinyin) {
      if (q.pinyin) {
        assert.notEqual(String(q.pinyin).trim(), '...', `Truncated prompt pinyin "..." on ${id}`);
        assert.ok(!/\b[a-züv]+[1-5]\b/i.test(q.pinyin), `Raw numeric pinyin in ${id}: ${q.pinyin}`);
      }
      for (const opt of q.options || []) {
        if (opt && typeof opt === 'object' && opt.pinyin) {
          assert.notEqual(String(opt.pinyin).trim(), '...', `Truncated option pinyin "..." on ${id}`);
          assert.ok(!/\b[a-züv]+[1-5]\b/i.test(opt.pinyin), `Raw numeric pinyin in option on ${id}: ${opt.pinyin}`);
        }
      }
    }
  }

  for (const sec of HSK_7_TO_9_EXAM_PAPER.sections) {
    for (const q of sec.questions || []) {
      const expected = 'ABCD'[q.correctIndex];
      const exp = q.explanationVi || '';
      const m = exp.match(/(?:Đáp án|Câu)\s+([A-D])(?![\p{L}\p{N}])/u);
      if (m) assert.equal(m[1], expected, `HSK 7-9 paper ${q.id} explanation mismatch`);
      q.options.forEach((o, i) => assert.ok(o.startsWith(`${'ABCD'[i]}. `), `HSK 7-9 paper ${q.id} label mismatch`));
    }
  }
});
