import test from 'node:test';
import assert from 'node:assert/strict';

import { VOCABULARY_LIST, normalizeVocabHskLevel } from '../src/data/chineseData.js';
import { HSK_EXAMS, getFullExamById } from '../src/data/hskExamsData.js';
import { getHskExams, getExamForTaking } from '../src/services/hskService.js';
import { fetchHsk30FlashcardBatch } from '../src/services/hsk30FlashcardDeckService.js';
import {
  HSK_7_TO_9_PAPER_CATALOG,
  getHsk7to9PaperNormalizedSummary,
} from '../src/features/hsk-exam/data/hsk7to9SampleExamPaper.js';

test('Phase 38.02 — VOCABULARY_LIST has zero duplicate hanzi, zero missing hanviet/pinyin/meaning, and zero truncated topics', () => {
  const seenHanzi = new Map();
  const seenIds = new Set();

  for (const item of VOCABULARY_LIST) {
    assert.ok(item.id !== undefined && item.id !== null, 'Every vocab item must have id');
    assert.ok(!seenIds.has(item.id), `Duplicate vocab id: ${item.id}`);
    seenIds.add(item.id);

    assert.ok(item.hanzi && item.hanzi.trim().length > 0, `Vocab id=${item.id} missing hanzi`);
    assert.ok(
      !seenHanzi.has(item.hanzi),
      `Duplicate hanzi "${item.hanzi}" at id=${seenHanzi.get(item.hanzi)} and id=${item.id}`
    );
    seenHanzi.set(item.hanzi, item.id);

    assert.ok(item.pinyin && item.pinyin.trim().length > 0, `Vocab "${item.hanzi}" (id=${item.id}) has empty pinyin`);
    assert.ok(item.hanviet && item.hanviet.trim().length > 0, `Vocab "${item.hanzi}" (id=${item.id}) missing hanviet`);
    assert.ok(item.meaning && item.meaning.trim().length > 0, `Vocab "${item.hanzi}" (id=${item.id}) missing meaning`);

    const topic = String(item.topic || '');
    const openParens = (topic.match(/\(/g) || []).length;
    const closeParens = (topic.match(/\)/g) || []).length;
    assert.equal(openParens, closeParens, `Truncated/unbalanced topic on "${item.hanzi}" (id=${item.id}): ${topic}`);
  }

  // Verify previously corrupted entries 715..731 have real word-level pinyin and meaning
  const item715 = VOCABULARY_LIST.find((v) => v.id === 715);
  assert.equal(item715?.pinyin, 'jiéshí');
  assert.equal(item715?.hanviet, 'Kết thức');

  // Verify HSK 5-6 canonical mapping helper
  assert.equal(normalizeVocabHskLevel('HSK 5-6'), 'HSK 5');
  assert.equal(normalizeVocabHskLevel('HSK 4'), 'HSK 4');
});

test('Phase 38.02 — Published CBT exams must have > 0 questions and hsk1-official-ref-01 is unpublished', async () => {
  const publishedExams = HSK_EXAMS.filter((e) => e.is_published);
  assert.ok(publishedExams.length >= 29, `Expected >= 29 published exams, got ${publishedExams.length}`);

  for (const exam of publishedExams) {
    const full = getFullExamById(exam.id);
    assert.ok(full && Array.isArray(full.questions) && full.questions.length > 0, `Published exam "${exam.id}" has 0 questions`);
  }

  const listed = await getHskExams();
  assert.ok(!listed.some((e) => e.id === 'hsk1-official-ref-01'), 'Empty reference exam hsk1-official-ref-01 must not appear in getHskExams()');

  await assert.rejects(
    async () => getExamForTaking('hsk1-official-ref-01'),
    /đang được biên soạn nội dung hoặc là tài liệu tham chiếu ngoại bộ/
  );
});

test('Phase 38.02 — HSK 7-9 flashcard pool avoids overwriting VOCABULARY_LIST and HSK 7-9 exam summary normalizes to 300 pts', async () => {
  const baseHanziSet = new Set(VOCABULARY_LIST.map((v) => v.hanzi));
  const hsk79Batch = await fetchHsk30FlashcardBatch({ hskBand: 'HSK 7-9', page: 1, pageSize: 500 });
  const overlaps = hsk79Batch.entries.filter((e) => baseHanziSet.has(e.hanzi));
  assert.equal(overlaps.length, 0, `HSK 7-9 deck should not overlap VOCABULARY_LIST, found ${overlaps.length}`);

  for (const meta of HSK_7_TO_9_PAPER_CATALOG) {
    const summary = getHsk7to9PaperNormalizedSummary(meta.paperCode);
    assert.equal(summary.sectionCount, 5);
    assert.equal(summary.totalTasks, 11);
    assert.equal(summary.totalMaxScore, 300);
  }
});
