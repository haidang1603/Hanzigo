import test from 'node:test';
import assert from 'node:assert/strict';

import {
  shuffleSessionQuestions,
  remapSelectedAnswerToOriginal,
  remapAnswersToOriginalIndices,
  remapFeedbackForShuffledQuestion,
  remapExplanationLettersSinglePass,
  isQuestionEligibleForOptionShuffle,
} from '../src/utils/examOptionShuffler.js';

function buildSampleQuestions() {
  return [
    {
      id: 'q-dyn-01',
      type: 'mcq',
      question_type: 'multiple_choice',
      prompt: '请选择正确答案：',
      options: ['A. 苹果', 'B. 香蕉', 'C. 西瓜', 'D. 葡萄'],
      optionsPinyin: ['píngguǒ', 'xiāngjiāo', 'xīguā', 'pútáo'],
      optionsTranslation: ['Táo', 'Chuối', 'Dưa hấu', 'Nho'],
      optionImages: ['/img/apple.png', '/img/banana.png', '/img/melon.png', '/img/grape.png'],
      correctIndex: 0,
      correct_option_index: 0,
      correctAnswer: 'A',
      explanationVi: 'Đáp án A đúng, loại B vì khác loại quả, phương án C và (D) sai ngữ cảnh.',
    },
    {
      id: 'q-dyn-02',
      type: 'mcq',
      prompt: '听对话，选择正确答案：',
      options: [
        { id: 'A', text: 'A. 图书馆', pinyin: 'túshūguǎn', translation: 'Thư viện' },
        { id: 'B', text: 'B. 医院', pinyin: 'yīyuàn', translation: 'Bệnh viện' },
        { id: 'C', text: 'C. 超市', pinyin: 'chāoshì', translation: 'Siêu thị' },
        { id: 'D', text: 'D. 公园', pinyin: 'gōngyuán', translation: 'Công viên' },
      ],
      correctIndex: 2,
      correct_option_index: 2,
      explanation: 'Chọn C vì nhân vật nhắc đến việc đi mua rau ở siêu thị.',
    },
    {
      id: 'q-dyn-03',
      type: 'mcq',
      prompt: '选择正确词语：',
      options: ['A. 认真', 'B. 仔细', 'C. 耐心'],
      optionsPinyin: ['rènzhēn', 'zǐxì', 'nàixīn'],
      correctIndex: 1,
      correct_option_index: 1,
      explanationVi: 'Phương án B chính xác nhất trong ngữ cảnh này.',
    },
    {
      id: 'q-dyn-04',
      type: 'mcq',
      prompt: '下面哪个句子没有语病？',
      options: ['A. 句子一', 'B. 句子二', 'C. 句子三', 'D. 句子四'],
      correctIndex: 3,
      correct_option_index: 3,
      explanationVi: 'Câu D chuẩn xác. Câu A thiếu chủ ngữ, loại B và C.',
    },
  ];
}

test('1. Immutability: shuffleSessionQuestions never mutates original questions or nested arrays', () => {
  const original = buildSampleQuestions();
  const snapshot = JSON.parse(JSON.stringify(original));

  const shuffled = shuffleSessionQuestions(original, {
    enabled: true,
    sessionSeed: 'exam-immut-seed-001',
  });

  assert.deepEqual(original, snapshot, 'Original questions array or nested properties were mutated');
  assert.notEqual(shuffled, original);
  assert.notEqual(shuffled[0], original[0]);
  assert.notEqual(shuffled[0].options, original[0].options);
  assert.notEqual(shuffled[0].optionsPinyin, original[0].optionsPinyin);
});

test('2. Determinism & Variety: same sessionSeed is identical, different seeds vary, enabled=false preserves order', () => {
  const original = buildSampleQuestions();

  const runA1 = shuffleSessionQuestions(original, { enabled: true, sessionSeed: 'hsk4-seed-alpha' });
  const runA2 = shuffleSessionQuestions(original, { enabled: true, sessionSeed: 'hsk4-seed-alpha' });
  const runB = shuffleSessionQuestions(original, { enabled: true, sessionSeed: 'hsk4-seed-beta-999' });
  const disabled = shuffleSessionQuestions(original, { enabled: false, sessionSeed: 'hsk4-seed-alpha' });

  assert.deepEqual(runA1, runA2, 'Same sessionSeed must produce identical option order');

  const sigA = runA1.map((q) => q._optionOriginalIndices.join(',')).join('|');
  const sigB = runB.map((q) => q._optionOriginalIndices.join(',')).join('|');
  assert.notEqual(sigA, sigB, 'Different sessionSeeds should produce different option permutations');

  assert.deepEqual(
    disabled.map((q) => q.options),
    original.map((q) => q.options),
    'When enabled=false, option order must remain unchanged'
  );
  assert.equal(disabled[0]._optionOriginalIndices, undefined);
});

test('3. Parallel Sync: options, optionsPinyin, optionsTranslation, optionImages & correctIndex stay aligned', () => {
  const original = buildSampleQuestions();
  const shuffled = shuffleSessionQuestions(original, {
    enabled: true,
    sessionSeed: 'parallel-sync-seed-42',
  });

  shuffled.forEach((sq, idx) => {
    const oq = original[idx];
    assert.ok(Array.isArray(sq._optionOriginalIndices), `Missing _optionOriginalIndices on ${sq.id}`);
    assert.equal(sq.correctIndex, sq.correct_option_index);

    const stripLabel = (val) =>
      (typeof val === 'string' ? val : val.text).replace(/^[A-D]\.\s*/, '').trim();

    assert.equal(
      stripLabel(sq.options[sq.correctIndex]),
      stripLabel(oq.options[oq.correctIndex]),
      `Correct option text drifted on ${sq.id}`
    );

    if (Array.isArray(oq.optionsPinyin)) {
      assert.equal(sq.optionsPinyin[sq.correctIndex], oq.optionsPinyin[oq.correctIndex]);
    }
    if (Array.isArray(oq.optionsTranslation)) {
      assert.equal(sq.optionsTranslation[sq.correctIndex], oq.optionsTranslation[oq.correctIndex]);
    }
    if (Array.isArray(oq.optionImages)) {
      assert.equal(sq.optionImages[sq.correctIndex], oq.optionImages[oq.correctIndex]);
    }
    if (typeof oq.correctAnswer === 'string') {
      assert.equal(sq.correctAnswer, String.fromCharCode(65 + sq.correctIndex));
    }

    sq.options.forEach((opt, optIdx) => {
      const expectedLetter = String.fromCharCode(65 + optIdx);
      const rawText = typeof opt === 'string' ? opt : opt.text;
      assert.ok(rawText.startsWith(`${expectedLetter}. `), `Option prefix not synced: ${rawText}`);
      if (opt && typeof opt === 'object' && opt.id) {
        assert.equal(opt.id, expectedLetter);
      }
    });
  });
});

test('4. Explanation Single-Pass Sync: cyclic A->B->C->D->A remaps without cascading overwrites', () => {
  // Cyclic shift: old 0(A)->1(B), 1(B)->2(C), 2(C)->3(D), 3(D)->0(A)
  const oldToNew = [1, 2, 3, 0];
  const src =
    'Đáp án A đúng, loại B vì thiếu chủ ngữ, phương án C sai chính tả, (D) sai ngữ nghĩa -> A.';
  const expected =
    'Đáp án B đúng, loại C vì thiếu chủ ngữ, phương án D sai chính tả, (A) sai ngữ nghĩa -> B.';

  const actual = remapExplanationLettersSinglePass(src, oldToNew, false);
  assert.equal(actual, expected);

  // Also verify via full shuffleSessionQuestions
  const original = buildSampleQuestions();
  const shuffled = shuffleSessionQuestions(original, {
    enabled: true,
    sessionSeed: 'exp-sync-seed-77',
  });
  const q0 = shuffled[0];
  const expectedLetter = String.fromCharCode(65 + q0.correctIndex);
  assert.match(q0.explanationVi, new RegExp(`Đáp án ${expectedLetter} đúng`));
});

test('5. Exclusion Guard: skips true_false, reorder, fill_blank, essay, position-dependent & HSK6 blank-insertion', () => {
  const excludedQuestions = [
    {
      id: 'q-tf',
      type: 'true_false',
      options: ['✓ Đúng', '✗ Sai'],
      correctIndex: 0,
    },
    {
      id: 'q-reorder',
      type: 'reorder',
      options: ['A. 我', 'B. 喜欢', 'C. 学习'],
      correctIndex: 0,
    },
    {
      id: 'q-essay',
      type: 'essay',
      options: ['A. 1', 'B. 2', 'C. 3'],
      correctIndex: 0,
    },
    {
      id: 'q-pos-vi',
      type: 'mcq',
      options: ['A. 选项一', 'B. 选项二', 'C. Cả A và B đều đúng', 'D. Không có đáp án nào'],
      correctIndex: 2,
    },
    {
      id: 'q-pos-zh',
      type: 'mcq',
      options: ['A. 选项一', 'B. 选项二', 'C. 以上都正确', 'D. 选项四'],
      correctIndex: 2,
    },
    {
      id: 'q-hsk6-full-071',
      type: 'mcq',
      options: ['A. 句子A', 'B. 句子B', 'C. 句子C', 'D. 句子D'],
      correctIndex: 1,
    },
  ];

  for (const q of excludedQuestions) {
    assert.equal(isQuestionEligibleForOptionShuffle(q), false, `Expected ${q.id} to be excluded`);
  }

  const output = shuffleSessionQuestions(excludedQuestions, {
    enabled: true,
    sessionSeed: 'exclude-test-seed-123',
  });

  output.forEach((q, i) => {
    assert.deepEqual(q.options, excludedQuestions[i].options);
    assert.equal(q.correctIndex, excludedQuestions[i].correctIndex);
    assert.equal(q._optionOriginalIndices, undefined);
  });
});

test('6. Server Payload Remapping & Learning Mode Feedback Sync', () => {
  const original = buildSampleQuestions();
  const shuffled = shuffleSessionQuestions(original, {
    enabled: true,
    sessionSeed: 'server-remap-seed-2026',
  });

  // Learner selects the correct shuffled index on every question
  const learnerAnswers = {};
  for (const sq of shuffled) {
    learnerAnswers[sq.id] = sq.correctIndex;
  }
  learnerAnswers['q-essay-free'] = '这是一篇作文。';

  const remappedForServer = remapAnswersToOriginalIndices(shuffled, learnerAnswers);

  shuffled.forEach((sq, i) => {
    const oq = original[i];
    assert.equal(
      remapSelectedAnswerToOriginal(sq, sq.correctIndex),
      oq.correctIndex,
      `Single answer remap failed for ${sq.id}`
    );
    assert.equal(
      remappedForServer[sq.id],
      oq.correctIndex,
      `Batch payload remap failed for ${sq.id}`
    );
  });
  assert.equal(remappedForServer['q-essay-free'], '这是一篇作文。');

  // Learning mode feedback remapping from original question to shuffled session
  const sq0 = shuffled[0];
  const oq0 = original[0];
  const rawFeedback = {
    blocked: false,
    found: true,
    isCorrect: true,
    correctIndex: oq0.correctIndex,
    correctAnswerText: oq0.options[oq0.correctIndex],
    explanationVi: oq0.explanationVi,
  };
  const syncedFb = remapFeedbackForShuffledQuestion(rawFeedback, sq0);
  assert.equal(syncedFb.correctIndex, sq0.correctIndex);
  assert.equal(syncedFb.correctAnswerText, sq0.options[sq0.correctIndex]);
  assert.match(
    syncedFb.explanationVi,
    new RegExp(`Đáp án ${String.fromCharCode(65 + sq0.correctIndex)} đúng`)
  );
});
