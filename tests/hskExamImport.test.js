import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  HSK_DEFAULT_META,
  validateHskPaperImportPayload,
  importFullHskPaperToRepository,
  listImportedHskPapers,
  getImportedHskPaperWithQuestions,
  generateSampleHskPaperPayload,
} from '../src/services/hskExamImportService.ts';

test('HSK_DEFAULT_META defines standard counts and durations for HSK 1-6', () => {
  assert.equal(HSK_DEFAULT_META[1].totalQ, 40);
  assert.equal(HSK_DEFAULT_META[4].totalQ, 100);
  assert.equal(HSK_DEFAULT_META[4].duration, 100);
  assert.equal(HSK_DEFAULT_META[6].totalQ, 101);
});

test('validateHskPaperImportPayload validates valid sample and catches missing fields', () => {
  const sample = generateSampleHskPaperPayload(4);
  const ok = validateHskPaperImportPayload(sample);
  assert.equal(ok.valid, true);
  assert.equal(ok.stats.paperCode, 'H41008');
  assert.equal(ok.stats.totalGroups, 3);
  assert.equal(ok.stats.totalSubQuestions, 3);

  const invalid = validateHskPaperImportPayload({
    ...sample,
    paper_code: '',
    hsk_level: 9,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 2);
});

test('importFullHskPaperToRepository upserts paper and replaces questions idempotently', async () => {
  const sample = generateSampleHskPaperPayload(4);
  const res1 = await importFullHskPaperToRepository(sample);
  assert.equal(res1.paper.paper_code, 'H41008');
  assert.equal(res1.paper.total_questions, 100);
  assert.equal(res1.insertedGroupsCount, 3);

  // Re-importing same paper_code updates without duplicating questions
  const res2 = await importFullHskPaperToRepository({
    ...sample,
    title_vi: 'Đề thi chuẩn HSK 4 - H41008 (Cập nhật)',
  });
  assert.equal(res2.paper.title_vi, 'Đề thi chuẩn HSK 4 - H41008 (Cập nhật)');

  const papers = await listImportedHskPapers();
  assert.equal(papers.filter((p) => p.paper_code === 'H41008').length, 1);

  const detail = await getImportedHskPaperWithQuestions('H41008');
  assert.ok(detail.paper);
  assert.equal(detail.questions.length, 3);
});

test('SQL migration 20261113_hsk_exam_papers_and_question_bank.sql defines tables, FKs, and RLS', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261113_hsk_exam_papers_and_question_bank.sql'
  );
  assert.ok(fs.existsSync(migrationPath));
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.hsk_exam_papers/i);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.hsk_question_bank/i);
  assert.match(sql, /REFERENCES public\.hsk_exam_papers\(paper_code\)/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});

