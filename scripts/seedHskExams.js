/**
 * =========================================================================
 * HANZI GO - HSK EXAM & STRUCTURE SEED SCRIPT (IDEMPOTENT)
 * =========================================================================
 * Script nạp dữ liệu chuẩn mực cho Trung tâm khảo thí HSK:
 * 1. Cấu trúc chuẩn HSK (2015-Standard & HSK 3.0-2021) vào `hsk_exam_structures`
 * 2. Danh mục 7 bộ đề thi chuẩn vào `hsk_exams`
 * 3. 37 câu hỏi chi tiết vào `hsk_questions`
 *
 * Chạy:
 * node --env-file=.env scripts/seedHskExams.js
 * node --env-file=.env scripts/seedHskExams.js --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import { HSK_EXAMS, HSK_QUESTIONS } from '../src/data/hskExamsData.js';
import { HSK_STRUCTURE_DEFINITIONS, HSK_OFFICIAL_VERSIONS } from '../src/data/hskStructureData.js';
import { ensureAllFullStandardExamsLoaded } from '../src/data/hsk30/index.js';
import { ensureAllExamSupplementsLoaded, SUPPLEMENTED_TARGET_TOTALS } from '../src/data/examSupplements/index.js';

const isDryRun = process.argv.includes('--dry-run');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Lỗi: Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function seedStructures() {
  console.log('\n--- 1. SEEDING HSK EXAM STRUCTURES ---');
  const structuresToSeed = [];

  for (const [levelKey, def] of Object.entries(HSK_STRUCTURE_DEFINITIONS)) {
    for (const [versionKey, ver] of Object.entries(def.versions || {})) {
      const structId = `struct-${levelKey}-${versionKey.toLowerCase()}`;
      const numericPassing = typeof ver.passingScore === 'number' ? ver.passingScore : parseInt(ver.passingScore, 10) || 0;
      const numericMax = typeof ver.maxScore === 'number' ? ver.maxScore : parseInt(ver.maxScore, 10) || 0;
      structuresToSeed.push({
        id: structId,
        level: def.level,
        level_name_vi: def.levelNameVi || def.level,
        version: versionKey,
        total_questions: ver.totalQuestions || 0,
        total_duration_minutes: ver.totalDurationMinutes || 0,
        passing_score: numericPassing,
        max_score: numericMax,
        vocabulary_requirement: ver.vocabularyRequirement ?? def.vocabularyRequirement ?? 0,
        character_requirement: ver.characterRequirement ?? def.characterRequirement ?? null,
        has_pinyin: ver.hasPinyin ?? def.hasPinyin ?? (def.level === 'HSK 1' || def.level === 'HSK 2'),
        audio_play_count: ver.audioPlayCount || 1,
        sections: ver.sections || [],
        source_reference: 'chinesetest.cn (CTI / CLEC)',
        source_url: 'http://www.chinesetest.cn/',
        verification_status: ver.verificationStatus || 'verified',
        verified_date: ver.verifiedDate || '2026-10-12',
        unverified_fields: ver.unverifiedFields || [],
        notes_vi: `${def.levelNameVi} — ${def.tagline || ''}`
      });
    }
  }

  console.log(`Tìm thấy ${structuresToSeed.length} cấu trúc HSK cần nạp.`);
  if (isDryRun) {
    console.log('[DRY-RUN] Bỏ qua thao tác ghi hsk_exam_structures.');
    return;
  }

  const { error } = await supabase
    .from('hsk_exam_structures')
    .upsert(structuresToSeed, { onConflict: 'id' });

  if (error) {
    console.error('❌ Lỗi seed hsk_exam_structures:', error.message);
  } else {
    console.log(`✅ Đã nạp thành công ${structuresToSeed.length} cấu trúc vào hsk_exam_structures.`);
  }
}

function normalizeExamRow(e, totalOverride) {
  return {
    id: e.id,
    title: e.title,
    level: e.level,
    exam_version: e.exam_version || (e.examSystem === 'hsk_3_0' ? 'HSK 3.0-2021' : '2015-Standard'),
    exam_type: e.exam_type || 'mock',
    skill_category: e.skill_category || 'mixed',
    duration_minutes: e.duration_minutes || 40,
    total_questions: totalOverride ?? e.total_questions ?? 20,
    passing_score: e.passing_score || 120,
    max_score: e.max_score || 200,
    description: e.description || '',
    source_url: e.source_url || 'http://www.chinesetest.cn/',
    source_author: e.source_author || 'HanziGo Academic Team',
    license: e.license || 'CC BY-NC-SA 4.0 / HanziGo Educational Content',
    permission_status: e.permission_status || 'reproducible',
    review_status: 'published',
    difficulty_estimate: 'standard',
    audio_play_limit: e.level === 'HSK 1' || e.level === 'HSK 2' ? 2 : 1,
    verified_date: e.verified_date || '2026-10-12',
    is_published: true
  };
}

async function seedExams() {
  console.log('\n--- 2. SEEDING HSK EXAMS ---');
  const { hsk30Exams = [], hsk20FullExams = [] } = await ensureAllFullStandardExamsLoaded();
  const examMap = new Map();

  for (const e of HSK_EXAMS) {
    examMap.set(e.id, normalizeExamRow(e, SUPPLEMENTED_TARGET_TOTALS[e.id]));
  }
  for (const e of [...hsk30Exams, ...hsk20FullExams]) {
    const qCount = Array.isArray(e.questions) ? e.questions.length : e.total_questions;
    examMap.set(e.id, normalizeExamRow(e, qCount));
  }

  const examsToSeed = Array.from(examMap.values());

  console.log(`Tìm thấy ${examsToSeed.length} bộ đề HSK cần nạp.`);
  if (isDryRun) {
    console.log('[DRY-RUN] Bỏ qua thao tác ghi hsk_exams.');
    return;
  }

  const { error } = await supabase
    .from('hsk_exams')
    .upsert(examsToSeed, { onConflict: 'id' });

  if (error) {
    console.error('❌ Lỗi seed hsk_exams:', error.message);
  } else {
    console.log(`✅ Đã nạp thành công ${examsToSeed.length} đề thi vào hsk_exams.`);
  }
}

function normalizeQuestionRow(q, overrideId, overrideExamId, fallbackQuestionNumber) {
  const rawOptions = Array.isArray(q.options) ? q.options : [];
  const options = rawOptions.map(opt => (typeof opt === 'string' ? { text: opt } : opt));
  return {
    id: overrideId || q.id,
    exam_id: overrideExamId || q.exam_id,
    part_type: q.part_type || q.skill || 'reading',
    part_number: Number(q.part_number || q.part || 1),
    question_number: Number(q.question_number || fallbackQuestionNumber || 1),
    question_type: q.question_type || q.questionType || 'multiple_choice',
    prompt: q.prompt || q.audio_script || q.audioText || 'Câu hỏi HSK',
    pinyin: q.pinyin || '',
    translation: q.translation || q.translationVi || '',
    audio_url: q.audio_url || '',
    audio_script: q.audio_script || q.audioText || '',
    options,
    correct_option_index: q.correct_option_index !== undefined
      ? q.correct_option_index
      : (q.correctIndex !== undefined ? q.correctIndex : 0),
    explanation: q.explanation || q.explanationVi || 'Đáp án chuẩn HSK.',
    points: q.points || 5,
    words: q.words || [],
    correct_order: q.correct_order || [],
    accepted_answers: q.accepted_answers || [],
    writing_criteria: q.writing_criteria || q.rubric || [],
    sample_answer: q.sample_answer || q.sampleAnswer || '',
    min_words: q.min_words || 0,
    max_words: q.max_words || 0
  };
}

async function seedQuestions() {
  console.log('\n--- 3. SEEDING HSK QUESTIONS ---');
  const questionMap = new Map();

  // 1. Base HSK_QUESTIONS (preserve original IDs)
  for (let i = 0; i < HSK_QUESTIONS.length; i++) {
    const q = HSK_QUESTIONS[i];
    questionMap.set(q.id, normalizeQuestionRow(q, q.id, q.exam_id, i + 1));
  }

  // 2. Append-only supplementary questions (-sup-*)
  const supplementedExams = await ensureAllExamSupplementsLoaded();
  for (const exam of Object.values(supplementedExams || {})) {
    const qs = Array.isArray(exam?.questions) ? exam.questions : [];
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (!questionMap.has(q.id)) {
        questionMap.set(q.id, normalizeQuestionRow(q, q.id, exam.id, i + 1));
      }
    }
  }

  // 3. Dual-system HSK 3.0 & HSK 2.0 Full Exams (scoped IDs so base HSK_QUESTIONS exam_id is never overwritten)
  const { hsk30Exams = [], hsk20FullExams = [] } = await ensureAllFullStandardExamsLoaded();
  for (const exam of [...hsk30Exams, ...hsk20FullExams]) {
    const qs = Array.isArray(exam?.questions) ? exam.questions : [];
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const scopedId = `${exam.id}__${q.id}`;
      questionMap.set(scopedId, normalizeQuestionRow(q, scopedId, exam.id, i + 1));
    }
  }

  const questionsToSeed = Array.from(questionMap.values());

  console.log(`Tìm thấy ${questionsToSeed.length} câu hỏi HSK cần nạp.`);
  if (isDryRun) {
    console.log('[DRY-RUN] Bỏ qua thao tác ghi hsk_questions.');
    return;
  }

  // Seed theo batch 20 câu để an toàn
  const batchSize = 20;
  let totalInserted = 0;
  for (let i = 0; i < questionsToSeed.length; i += batchSize) {
    const batch = questionsToSeed.slice(i, i + batchSize);
    const { error } = await supabase
      .from('hsk_questions')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Lỗi batch [${i}..${i + batch.length}]:`, error.message);
    } else {
      totalInserted += batch.length;
    }
  }

  console.log(`✅ Đã nạp thành công ${totalInserted} / ${questionsToSeed.length} câu hỏi vào hsk_questions.`);
}

async function run() {
  console.log('🚀 Bắt đầu tiến trình nạp dữ liệu HSK Exam Center...');
  console.log(`Chế độ: ${isDryRun ? 'DRY-RUN (Xem trước)' : 'COMMIT (Ghi thực tế)'}`);
  try {
    await seedStructures();
    await seedExams();
    await seedQuestions();
    console.log('\n🎉 TIẾN TRÌNH SEED HSK HOÀN TẤT!');
  } catch (err) {
    console.error('❌ Lỗi ngoại lệ trong quá trình seed:', err);
    process.exit(1);
  }
}

run();
