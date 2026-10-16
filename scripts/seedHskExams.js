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
        version: versionKey,
        total_questions: ver.totalQuestions || 0,
        total_duration_minutes: ver.totalDurationMinutes || 0,
        passing_score: numericPassing,
        max_score: numericMax,
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

async function seedExams() {
  console.log('\n--- 2. SEEDING HSK EXAMS ---');
  const examsToSeed = HSK_EXAMS.map(e => ({
    id: e.id,
    title: e.title,
    level: e.level,
    exam_version: e.exam_version || '2015-Standard',
    exam_type: e.exam_type || 'mock',
    skill_category: e.skill_category || 'mixed',
    duration_minutes: e.duration_minutes || 40,
    total_questions: e.total_questions || 20,
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
  }));

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

async function seedQuestions() {
  console.log('\n--- 3. SEEDING HSK QUESTIONS ---');
  const questionsToSeed = HSK_QUESTIONS.map(q => ({
    id: q.id,
    exam_id: q.exam_id,
    part_type: q.part_type || 'reading',
    part_number: q.part_number || 1,
    question_number: q.question_number,
    question_type: q.question_type || 'multiple_choice',
    prompt: q.prompt,
    pinyin: q.pinyin || '',
    translation: q.translation || '',
    audio_url: q.audio_url || '',
    audio_script: q.audio_script || '',
    options: q.options || [],
    correct_option_index: q.correct_option_index !== undefined ? q.correct_option_index : 0,
    explanation: q.explanation || 'Chưa có lời giải chi tiết.',
    points: q.points || 5,
    words: q.words || [],
    correct_order: q.correct_order || [],
    accepted_answers: q.accepted_answers || [],
    writing_criteria: q.writing_criteria || [],
    sample_answer: q.sample_answer || '',
    min_words: q.min_words || 0,
    max_words: q.max_words || 0
  }));

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
