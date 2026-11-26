import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getUserMistakeEntries,
  recordMistakeEntry,
  syncMistakeNotebookFromAttempt,
  markMistakeResolved,
  buildMistakeReviewExam,
  purgeAllMistakeNotebooksFromStorage,
} from '../src/services/mistakeNotebookService.js';
import {
  EXAM_SYSTEMS,
  EXAM_MODES,
  assembleDualSystemExam,
  gradeSubjectiveSubmission,
} from '../src/data/hskExamBlueprints.js';
import { ensureAllFullStandardExamsLoaded } from '../src/data/hsk30/index.js';
import { scorePronunciationWithAi } from '../src/services/aiPronunciationService.js';
import { lookupChineseTokenLocal, segmentChineseForLookup } from '../src/utils/localVocabLookup.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(idx) {
      return Array.from(store.keys())[idx] ?? null;
    },
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      store.set(String(k), String(v));
    },
    removeItem(k) {
      store.delete(String(k));
    },
    clear() {
      store.clear();
    },
  };
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = createMemoryStorage();
}

test('1. Mistake Notebook Lifecycle: user isolation, review generation & auto-resolve on correct retry', () => {
  purgeAllMistakeNotebooksFromStorage();
  const userA = { id: 'user-a-001' };
  const userB = { id: 'user-b-002' };

  const q1 = {
    id: 'q-mist-1',
    part_type: 'reading',
    question_type: 'multiple_choice',
    prompt: '他在图书馆看书。',
    options: [{ text: 'A. Đọc sách' }, { text: 'B. Ngủ' }, { text: 'C. Nấu ăn' }],
    correct_option_index: 0,
    explanation: '看书 là đọc sách.',
    points: 10,
  };
  const q2 = {
    id: 'q-mist-2',
    part_type: 'listening',
    question_type: 'multiple_choice',
    prompt: '听对话选答案',
    options: [{ text: 'A. 10点' }, { text: 'B. 12点' }, { text: 'C. 8点' }],
    correct_option_index: 1,
    points: 10,
  };

  recordMistakeEntry({ user: userA, question: q1, userAnswer: 1, level: 'HSK 2', mode: 'practice' });
  recordMistakeEntry({ user: userA, question: q2, userAnswer: 0, level: 'HSK 2', mode: 'simulation' });

  // Strict user isolation
  assert.equal(getUserMistakeEntries(userA).length, 2);
  assert.equal(getUserMistakeEntries(userB).length, 0);

  // Build focused review exam for User A
  const reviewExam = buildMistakeReviewExam(userA);
  assert.ok(reviewExam);
  assert.equal(reviewExam.isMistakeReview, true);
  assert.equal(reviewExam.questions.length, 2);
  assert.equal(getUserMistakeEntries(userB).length, 0);

  // Submitting correct answer for q1 in review session automatically resolves q1
  const syncRes = syncMistakeNotebookFromAttempt({
    user: userA,
    exam: reviewExam,
    attempt: {
      examId: reviewExam.id,
      examLevel: 'HSK 2',
      detailedResults: [
        { questionId: 'q-mist-1', partType: 'reading', isCorrect: true },
        { questionId: 'q-mist-2', partType: 'listening', isCorrect: false, prompt: q2.prompt, options: q2.options, correctIndex: 1 },
      ],
    },
  });
  assert.equal(syncRes.resolvedCount, 1);
  assert.equal(syncRes.remainingCount, 1);
  assert.equal(getUserMistakeEntries(userA)[0].questionId, 'q-mist-2');

  // Explicit resolution in Learning Mode removes q2 cleanly
  assert.equal(markMistakeResolved({ user: userA, questionId: 'q-mist-2' }), true);
  assert.equal(getUserMistakeEntries(userA).length, 0);

  // Logout cleanup purges all mistake notebooks
  recordMistakeEntry({ user: userB, question: q1, userAnswer: 2, level: 'HSK 1' });
  assert.equal(getUserMistakeEntries(userB).length, 1);
  purgeAllMistakeNotebooksFromStorage();
  assert.equal(getUserMistakeEntries(userB).length, 0);
});

test('2. 5-Skill Filter & Empty Guard: filters all 5 skills cleanly and handles unsupported combos safely', async () => {
  await ensureAllFullStandardExamsLoaded();

  for (const sk of ['listening', 'reading', 'writing']) {
    const hsk2Exam = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_2_0,
      level: 'HSK 3',
      mode: EXAM_MODES.BY_SKILL,
      skill: sk,
    });
    assert.ok(hsk2Exam.questions.length > 0, `HSK 2.0 Level 3 skill ${sk} must have questions`);
    assert.ok(
      hsk2Exam.questions.every((q) => (q.skill || q.part_type) === sk),
      `HSK 2.0 skill ${sk} returned mismatched skill questions`
    );
  }

  for (const sk of ['listening', 'reading', 'writing', 'translation', 'speaking']) {
    const hsk79Exam = assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: 'HSK 7-9',
      mode: EXAM_MODES.BY_SKILL,
      skill: sk,
    });
    assert.ok(hsk79Exam.questions.length > 0, `HSK 3.0 Level 7-9 skill ${sk} must have questions`);
    assert.ok(
      hsk79Exam.questions.every((q) => (q.skill || q.part_type) === sk),
      `HSK 3.0 skill ${sk} returned mismatched skill questions`
    );
  }

  // Unsupported combination: HSK 1 + translation -> safe empty questions + emptyReasonVi (no fallback bleed!)
  const emptyCombo = assembleDualSystemExam({
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 1',
    mode: EXAM_MODES.BY_SKILL,
    skill: 'translation',
  });
  assert.equal(emptyCombo.questions.length, 0);
  assert.ok(emptyCombo.bankCoverage?.emptyReasonVi?.length > 10);
});

test('3. Auth & Offline Fallback Guard: /api/ai/grade and /api/ai/pronunciation handle 200, 401 & network errors smoothly', async () => {
  // 3a. Successful backend AI response for Translation
  const okRes = await gradeSubjectiveSubmission({
    question: { id: 'q-tr-1', skill: 'translation', questionType: 'translation', prompt: '你好世界', writing_criteria: ['你好'] },
    userAnswer: 'Xin chào thế giới',
    level: 'HSK 7-9',
    fetchFn: async (url, init) => {
      assert.equal(url, '/api/ai/grade');
      assert.equal(JSON.parse(init.body).type, 'translation');
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          result: { overall_score: 91, detailed_feedback_vi: 'Dịch sát nghĩa.' },
        }),
      };
    },
  });
  assert.equal(okRes.overallScore, 91);
  assert.equal(okRes.gradingSource, 'ai_grade');
  assert.equal(okRes.authRequired, false);

  // 3b. 401 unauthorized falls back cleanly with authRequired=true & friendly fallbackNotice
  const unauthRes = await gradeSubjectiveSubmission({
    question: { id: 'q-wr-1', skill: 'writing', questionType: 'essay', prompt: '写短文', min_words: 10 },
    userAnswer: '今天天气很好，我去公园散步。',
    level: 'HSK 5',
    fetchFn: async () => ({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) }),
  });
  assert.equal(unauthRes.authRequired, true);
  assert.ok(unauthRes.fallbackNotice.length > 10);
  assert.ok(Number.isFinite(unauthRes.overallScore));

  // 3c. Speaking /api/ai/pronunciation 401 graceful fallback
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) });
  try {
    const speakRes = await scorePronunciationWithAi({
      targetHanzi: '你好',
      targetPinyin: 'nǐ hǎo',
      spokenTranscript: '你好',
      audioDurationMs: 900,
    });
    assert.equal(speakRes.isAiEvaluated, false);
    assert.equal(speakRes.authRequired, true);
    assert.ok(speakRes.fallbackNotice.length > 10);
    assert.ok(speakRes.overall >= 60);
  } finally {
    globalThis.fetch = origFetch;
  }
});

test('4. Click-to-Lookup & Segmentation: segments compound HSK words and resolves local Pinyin & Vietnamese meaning', () => {
  const tokens = segmentChineseForLookup('我喜欢去图书馆学习。');
  const hanziWords = tokens.filter((t) => t.isHanzi).map((t) => t.text);
  assert.ok(hanziWords.includes('喜欢'), `Expected '喜欢' compound token, got ${hanziWords.join(', ')}`);
  assert.ok(hanziWords.includes('学习'), `Expected '学习' compound token, got ${hanziWords.join(', ')}`);

  const entry = lookupChineseTokenLocal('喜欢');
  assert.equal(entry.found, true);
  assert.match(entry.pinyin, /xǐhuan|xǐ huan/i);
  assert.ok(entry.meaning.length > 0);
});
