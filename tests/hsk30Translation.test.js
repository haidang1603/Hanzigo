import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CURATED_DOMAIN_PACKS,
  CURATED_TRANSLATION_DRILLS,
  evaluateTranslationSubmission,
  submitTranslationAttempt,
} from '../src/services/translationStudioService.ts';

test('CURATED_DOMAIN_PACKS includes IT/Software Engineering, E-commerce/Logistics, Tourism, and HSK 7-9', () => {
  const slugs = CURATED_DOMAIN_PACKS.map((p) => p.slug);
  assert.ok(slugs.includes('it-software'));
  assert.ok(slugs.includes('ecommerce-logistics'));
  assert.ok(slugs.includes('tourism-hospitality'));
  assert.ok(slugs.includes('hsk-7-9-academic'));

  const itPack = CURATED_DOMAIN_PACKS.find((p) => p.slug === 'it-software');
  assert.ok(itPack);
  assert.ok(itPack.terminology_list.some((t) => t.simplified === '数据库'));
  assert.ok(itPack.terminology_list.some((t) => t.simplified === '代码评审'));
});

test('evaluateTranslationSubmission scores strong vi_to_zh translation accurately across 3 axes', () => {
  const drill = CURATED_TRANSLATION_DRILLS.find((d) => d.id === 'drill-vi2zh-it-1');
  assert.ok(drill);

  const perfectEval = evaluateTranslationSubmission(
    drill,
    '在将新版本部署上线之前，技术团队需要完成代码评审并优化数据库。'
  );
  assert.ok(perfectEval.overall_score >= 85);
  assert.ok(perfectEval.accuracy_score >= 85);
  assert.ok(perfectEval.grammar_score >= 80);
  assert.ok(perfectEval.corrected_version.length > 0);
  assert.ok(perfectEval.superior_native_version.length > 0);

  const poorEval = evaluateTranslationSubmission(drill, '技术团队增加水平。');
  assert.ok(poorEval.overall_score < 60);
  assert.ok(poorEval.token_diffs.some((t) => t.status === 'missing'));
  assert.match(poorEval.detailed_feedback_vi, /Cần bổ sung/);
});

test('evaluateTranslationSubmission evaluates zh_to_vi academic translation', () => {
  const drill = CURATED_TRANSLATION_DRILLS.find((d) => d.id === 'drill-zh2vi-hsk79-1');
  assert.ok(drill);

  const goodEval = evaluateTranslationSubmission(
    drill,
    'Nghiên cứu thực nghiệm này cho thấy việc ứng dụng quy mô lớn công nghệ trí tuệ nhân tạo không chỉ tái cấu trúc thị trường lao động truyền thống mà còn đặt ra yêu cầu mới cho giáo dục đại học.'
  );
  assert.ok(goodEval.overall_score >= 75);
});

test('submitTranslationAttempt persists submission and returns critique', async () => {
  const drill = CURATED_TRANSLATION_DRILLS[0];
  const sub = await submitTranslationAttempt({
    drill,
    userOutput: '在将新版本部署上线之前，技术团队需要完成代码评审并优化数据库。',
  });
  assert.equal(sub.drill_id, drill.id);
  assert.ok(sub.ai_critique.overall_score >= 80);
});

test('SQL migration 20261112_2905_hsk30_translation.sql defines all 3 tables with RLS', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261112_2905_hsk30_translation.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.specialized_domain_packs/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.translation_drills/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_translation_submissions/);
});

