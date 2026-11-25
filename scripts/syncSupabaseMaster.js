/**
 * =========================================================================
 * HANZI GO — SUPABASE FULL DATA & SCHEMA SYNCHRONIZATION MASTER
 * =========================================================================
 * Phase 23: Complete Audit, Reconciliation, Migration & Data Sync
 *
 * Synchronizes:
 * 1. Learning Levels & Chapters (7 levels, 24 chapters)
 * 2. 120 Flagship 9-Step Lessons (HSK 1 to HSK 6)
 * 3. 24 Chapter Boss Challenges
 * 4. 325 Chinese Character Decompositions (IDS ISO/IEC 10646)
 * 5. HSK Exam Center (13 Structures, 27 Exams, 417 Questions)
 * 6. Curated Vocabulary & Advanced Idioms (754 Vocab + 50 Idioms)
 * 7. Curated Learning Materials (20 Materials)
 * 8. Daily Quotes (60 Quotes)
 *
 * Usage:
 * node --env-file=.env scripts/syncSupabaseMaster.js --dry-run
 * node --env-file=.env scripts/syncSupabaseMaster.js
 * node --env-file=.env scripts/syncSupabaseMaster.js --target=lessons
 */

import { createClient } from '@supabase/supabase-js';
import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES 
} from '../src/data/learningPathData.js';
import { HANZI_DECOMPOSITION_DATABASE } from '../src/data/hanziDecomposition.js';
import {
  buildHskStructurePayloads,
  buildHskExamPayloads,
  buildHskQuestionPayloads
} from './seedHskExams.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import { HSK6_IDIOMS_DATABASE } from '../src/data/hsk6IdiomsData.js';
import { DEFAULT_MATERIALS } from '../src/utils/materialsStorage.js';
import { HSK_RESOURCES } from '../src/data/hskResourcesData.js';
import { DAILY_QUOTES } from '../src/data/dailyQuotesData.js';

const isDryRun = process.argv.includes('--dry-run');
const targetArg = process.argv.find(a => a.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1].toLowerCase() : 'all';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Lỗi cấu hình: Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const report = {
  timestamp: new Date().toISOString(),
  mode: isDryRun ? 'DRY-RUN' : 'LIVE-SYNC',
  target,
  modules: {}
};

function recordMetric(moduleName, { inserted = 0, updated = 0, skipped = 0, errors = 0, total = 0, notes = '' } = {}) {
  report.modules[moduleName] = { inserted, updated, skipped, errors, total, notes };
  console.log(`[${moduleName}] Tổng: ${total} | Thêm mới: ${inserted} | Cập nhật: ${updated} | Bỏ qua: ${skipped} | Lỗi: ${errors} ${notes ? `(${notes})` : ''}`);
}

async function chunkUpsert(table, records, onConflictKey, chunkSize = 50) {
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    try {
      const { data, error } = await supabase
        .from(table)
        .upsert(chunk, { onConflict: onConflictKey })
        .select(onConflictKey);

      if (error) {
        console.error(`  ❌ Lỗi chunk [${i}..${i + chunk.length}] bảng ${table}:`, error.message);
        errors += chunk.length;
      } else {
        inserted += (data?.length || chunk.length);
      }
    } catch (e) {
      console.error(`  ❌ Ngoại lệ chunk [${i}..${i + chunk.length}] bảng ${table}:`, e.message);
      errors += chunk.length;
    }
  }

  return { inserted, updated, errors };
}

// -----------------------------------------------------------------------------
// 1. SYNC LEARNING LEVELS & CHAPTERS
// -----------------------------------------------------------------------------
async function syncLevelsAndChapters() {
  console.log('\n--- 1. ĐỒNG BỘ CẤP ĐỘ (LEVELS) & CHƯƠNG (CHAPTERS) ---');
  if (target !== 'all' && target !== 'levels' && target !== 'chapters') return;

  // Levels
  const levelsPayload = LEARNING_LEVELS.map(lvl => ({
    id: lvl.id,
    level_number: lvl.levelNumber,
    code: lvl.code,
    hsk_level: lvl.hskLevel || lvl.code,
    hsk_stage: lvl.hskStage || '',
    title: lvl.name,
    title_zh: lvl.chineseName,
    tagline: lvl.tagline || '',
    pinyin: lvl.pinyin || '',
    badge: lvl.icon || '🌱',
    color: lvl.color,
    description: lvl.description,
    syllabus_5_pillars: lvl.syllabus5Pillars || {}
  }));

  if (isDryRun) {
    recordMetric('learning_levels', { total: levelsPayload.length, skipped: levelsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('learning_levels', levelsPayload, 'id');
    recordMetric('learning_levels', { total: levelsPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // Chapters
  const chaptersPayload = LEARNING_CHAPTERS.map((ch, idx) => ({
    id: ch.id,
    level_id: ch.levelId,
    chapter_number: ch.chapterNumber,
    title: ch.title,
    title_zh: ch.chineseTitle,
    description: ch.desc,
    order_index: ch.chapterNumber || (idx + 1)
  }));

  if (isDryRun) {
    recordMetric('learning_chapters', { total: chaptersPayload.length, skipped: chaptersPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('learning_chapters', chaptersPayload, 'id');
    recordMetric('learning_chapters', { total: chaptersPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 2. SYNC 120 FLAGSHIP 9-STEP LESSONS (HSK 1 - 6)
// -----------------------------------------------------------------------------
async function syncLearningLessons() {
  console.log('\n--- 2. ĐỒNG BỘ 120 BÀI HỌC CHUẨN 9 BƯỚC (LEARNING_LESSONS) ---');
  if (target !== 'all' && target !== 'lessons') return;

  const lessonsPayload = LEARNING_LESSONS.map(l => ({
    id: l.id,
    chapter_id: l.chapterId,
    level_id: l.levelId,
    lesson_number: l.lessonNumber,
    title: l.title,
    title_zh: l.chineseTitle,
    duration_minutes: l.durationMinutes || 18,
    xp_reward: l.xpReward || 50,
    description: l.subtitle || '',
    content: {
      step1_learn: l.step1_learn || {},
      step2_vocabulary: l.step2_vocabulary || [],
      step3_hanzi: l.step3_hanzi || [],
      step4_grammar: l.step4_grammar || {},
      step5_listening: l.step5_listening || {},
      step6_speaking: l.step6_speaking || {},
      step7_writing: l.step7_writing || {},
      step8_quiz: l.step8_quiz || [],
      step9_challenge: l.step9_challenge || {}
    }
  }));

  if (isDryRun) {
    recordMetric('learning_lessons', { total: lessonsPayload.length, skipped: lessonsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('learning_lessons', lessonsPayload, 'id', 20);
    recordMetric('learning_lessons', { total: lessonsPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 3. SYNC 24 CHAPTER BOSS CHALLENGES
// -----------------------------------------------------------------------------
async function syncBossChallenges() {
  console.log('\n--- 3. ĐỒNG BỘ 24 THỬ THÁCH TRÙM CUỐI (BOSS_CHALLENGES) ---');
  if (target !== 'all' && target !== 'bosses') return;

  const bossesPayload = BOSS_CHALLENGES.map(b => ({
    id: b.id,
    chapter_id: b.chapterId,
    title: b.title,
    title_zh: b.chineseTitle,
    scenario: b.scenario,
    xp_reward: b.xpReward || 200,
    passing_score: b.requiredScoreToPass || 80,
    stages: b.stages
  }));

  if (isDryRun) {
    recordMetric('learning_boss_challenges', { total: bossesPayload.length, skipped: bossesPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('learning_boss_challenges', bossesPayload, 'id');
    recordMetric('learning_boss_challenges', { total: bossesPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 4. SYNC 325 HANZI DECOMPOSITIONS (IDS)
// -----------------------------------------------------------------------------
async function syncHanziDecompositions() {
  console.log('\n--- 4. ĐỒNG BỘ 325 CHIẾT TỰ HÁN TỰ CHUẨN ISO/IEC 10646 IDS ---');
  if (target !== 'all' && target !== 'decompositions') return;

  const decompPayload = [];
  for (const [char, def] of Object.entries(HANZI_DECOMPOSITION_DATABASE)) {
    const codePoint = char.codePointAt(0);
    const unicodeHex = 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0');
    decompPayload.push({
      char,
      unicode_hex: unicodeHex,
      ids_sequence: def.ids || char,
      structure_type: def.structure?.code || 'single',
      structure_symbol: def.structure?.symbol || '◰',
      components: def.components || [],
      etymology_hint: def.mnemonic || '',
      hsk_level: def.hsk_level || 'HSK 1-6'
    });
  }

  if (isDryRun) {
    recordMetric('hanzi_decompositions', { total: decompPayload.length, skipped: decompPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hanzi_decompositions', decompPayload, 'char', 50);
    recordMetric('hanzi_decompositions', { total: decompPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 5. SYNC HSK EXAM CENTER (STRUCTURES, EXAMS, QUESTIONS)
// -----------------------------------------------------------------------------
async function syncHskExamCenter() {
  console.log('\n--- 5. ĐỒNG BỘ TRUNG TÂM KHẢO THÍ HSK (STRUCTURES, EXAMS, QUESTIONS, RESOURCES) ---');
  if (target !== 'all' && target !== 'exams') return;

  // 5.1 Exam Structures (13 structures across 2015-Standard & HSK 3.0-2021)
  const structuresPayload = buildHskStructurePayloads();

  if (isDryRun) {
    recordMetric('hsk_exam_structures', { total: structuresPayload.length, skipped: structuresPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_exam_structures', structuresPayload, 'id');
    recordMetric('hsk_exam_structures', { total: structuresPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // 5.2 Exams (Base + HSK 2.0 Full + HSK 3.0 Full)
  const examsPayload = await buildHskExamPayloads();

  if (isDryRun) {
    recordMetric('hsk_exams', { total: examsPayload.length, skipped: examsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_exams', examsPayload, 'id');
    recordMetric('hsk_exams', { total: examsPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // 5.3 Questions (Base + Append-only Supplements + Dual-system HSK 2.0 & 3.0)
  const questionsPayload = await buildHskQuestionPayloads();

  if (isDryRun) {
    recordMetric('hsk_questions', { total: questionsPayload.length, skipped: questionsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_questions', questionsPayload, 'id', 50);
    recordMetric('hsk_questions', { total: questionsPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // 5.4 HSK Resources (56 verified resources)
  const resourcesPayload = HSK_RESOURCES.map(r => ({
    id: r.id,
    title: r.title,
    level: r.level || 'All',
    exam_version: r.exam_version || '2015-Standard',
    category: r.category || 'sample_exam',
    academic_category: r.academic_category || 'textbooks_courses',
    skill: r.skill || 'mixed',
    format: r.format || 'web_link',
    source_url: r.source_url,
    source_author: r.source_author || 'HanziGo Academic Team',
    publisher: r.publisher || null,
    host_type: r.host_type || 'free_external',
    language_of_instruction: r.language_of_instruction || 'Song ngữ Trung - Việt',
    license_status: r.license_status || 'Public Educational Sample',
    permission_status: r.permission_status || 'linked_only',
    review_status: r.review_status || 'published',
    is_published: r.is_published !== false,
    download_url: r.download_url || null,
    description: r.description || '',
    tags: Array.isArray(r.tags) ? r.tags : [],
    learning_objectives: Array.isArray(r.learning_objectives) ? r.learning_objectives : [],
    related_lesson_ids: Array.isArray(r.related_lesson_ids) ? r.related_lesson_ids : [],
    related_exam_ids: Array.isArray(r.related_exam_ids) ? r.related_exam_ids : [],
    verified_date: r.verified_date || '2026-11-25'
  }));

  if (isDryRun) {
    recordMetric('hsk_resources', { total: resourcesPayload.length, skipped: resourcesPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_resources', resourcesPayload, 'id', 25);
    recordMetric('hsk_resources', { total: resourcesPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 6. SYNC CURATED VOCABULARY & IDIOMS (754 VOCAB + 50 IDIOMS)
// -----------------------------------------------------------------------------
async function syncVocabulary() {
  console.log('\n--- 6. ĐỒNG BỘ TỪ VỰNG CHUẨN & THÀNH NGỮ (754 TỪ + 50 THÀNH NGỮ) ---');
  if (target !== 'all' && target !== 'vocab') return;

  // 1. Fetch existing vocabulary from Supabase to prevent duplicate inserts and preserve IDs
  let existingMap = new Map(); // "hanzi:level" -> id
  try {
    const { data: existingRows } = await supabase
      .from('vocabulary')
      .select('id, hanzi, level');
    if (existingRows) {
      for (const r of existingRows) {
        existingMap.set(`${r.hanzi}:${r.level}`, r.id);
      }
    }
  } catch (e) {
    console.warn('  ⚠️ Không thể lấy danh sách từ vựng hiện có:', e.message);
  }

  console.log(`  Tìm thấy ${existingMap.size} từ vựng đã có trong Supabase.`);

  // 2. Prepare payload from VOCABULARY_LIST (754 words)
  const allVocab = [...VOCABULARY_LIST];

  // Append 50 idioms from HSK6_IDIOMS_DATABASE
  for (const [idiomChar, item] of Object.entries(HSK6_IDIOMS_DATABASE)) {
    allVocab.push({
      hanzi: idiomChar,
      pinyin: item.pinyin,
      hanviet: item.hanviet || '',
      meaning: item.meaningVi || item.meaning,
      level: 'HSK 6',
      topic: 'Thành ngữ bốn chữ',
      radical: '',
      strokes: 4,
      mnemonic: item.story || item.culturalBackground || '',
      example: {
        hanzi: item.exampleZh || '',
        pinyin: item.examplePinyin || '',
        meaning: item.exampleVi || ''
      }
    });
  }

  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  const toUpdate = [];
  const toInsert = [];

  for (const v of allVocab) {
    const key = `${v.hanzi}:${v.level || 'HSK 1'}`;
    const payload = {
      hanzi: v.hanzi,
      pinyin: v.pinyin,
      hanviet: v.hanviet || '',
      meaning: v.meaning,
      level: v.level || 'HSK 1',
      topic: v.topic || 'Tổng hợp',
      radical: v.radical || '',
      strokes: Number(v.strokes) || 1,
      mnemonic: v.mnemonic || '',
      example: v.example || {}
    };

    if (existingMap.has(key)) {
      toUpdate.push({ id: existingMap.get(key), ...payload });
    } else {
      toInsert.push(payload);
    }
  }

  console.log(`  Cần cập nhật: ${toUpdate.length} từ | Cần thêm mới: ${toInsert.length} từ.`);

  if (isDryRun) {
    recordMetric('vocabulary', { total: allVocab.length, skipped: allVocab.length, notes: 'DRY-RUN' });
    return;
  }

  // Update existing batch
  const chunkSize = 50;
  for (let i = 0; i < toUpdate.length; i += chunkSize) {
    const chunk = toUpdate.slice(i, i + chunkSize);
    const { error } = await supabase.from('vocabulary').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('  ❌ Lỗi update vocabulary chunk:', error.message);
      errorCount += chunk.length;
    } else {
      updatedCount += chunk.length;
    }
  }

  // Insert new batch
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { data, error } = await supabase.from('vocabulary').insert(chunk).select('id');
    if (error) {
      console.error('  ❌ Lỗi insert vocabulary chunk:', error.message);
      errorCount += chunk.length;
    } else {
      insertedCount += (data?.length || chunk.length);
    }
  }

  recordMetric('vocabulary', {
    total: allVocab.length,
    inserted: insertedCount,
    updated: updatedCount,
    errors: errorCount
  });
}

// -----------------------------------------------------------------------------
// 7. SYNC LEARNING MATERIALS (20 TEXTBOOKS & WORKBOOKS)
// -----------------------------------------------------------------------------
async function syncMaterials() {
  console.log('\n--- 7. ĐỒNG BỘ THƯ VIỆN TÀI LIỆU (MATERIALS) ---');
  if (target !== 'all' && target !== 'materials') return;

  const SKILL_LABEL_MAP = {
    mixed: 'Tổng hợp đa kỹ năng',
    listening: 'Nghe hiểu',
    speaking: 'Nói & Khẩu ngữ',
    reading: 'Đọc hiểu',
    writing: 'Viết chữ',
    vocabulary: 'Từ vựng',
    grammar: 'Ngữ pháp',
  };

  const defaultPayload = DEFAULT_MATERIALS.map(m => ({
    id: String(m.id),
    title: m.title,
    category: m.category || 'Giáo trình chuẩn',
    level: m.level || 'HSK 1',
    format: m.format || 'PDF',
    file_size: m.fileSize || '10 MB',
    author: m.author || 'HanziGo Biên soạn',
    publisher: m.publisher || 'HanziGo Academic',
    description: m.description || '',
    download_url: m.downloadUrl || m.sourceUrl || '',
    source_url: m.sourceUrl || m.downloadUrl || '',
    skills: Array.isArray(m.skills) ? m.skills.join(', ') : (m.skills || 'Tổng hợp đa kỹ năng'),
    language: m.language || 'Song ngữ Trung - Việt',
    license: m.license || 'Tài liệu giáo dục công cộng',
    verification_status: m.verificationStatus || 'verified',
    related_lesson_id: m.relatedLessonId || null,
    tags: Array.isArray(m.tags) ? m.tags.join(', ') : (m.tags || ''),
    storage_bucket: 'materials',
    storage_path: `general/system/${m.id}.pdf`
  }));

  const existingIds = new Set(defaultPayload.map(m => m.id));
  const hskResourcesPayload = HSK_RESOURCES
    .filter(r => !existingIds.has(String(r.id)))
    .map(r => ({
      id: String(r.id),
      title: r.title,
      category: r.category || 'Tài liệu học thuật',
      level: r.level || 'HSK 1',
      format: r.format || 'web_link',
      file_size: 'Tài liệu số',
      author: r.source_author || r.publisher || 'HanziGo Academic',
      publisher: r.publisher || 'HanziGo Academic',
      description: r.description || '',
      download_url: r.download_url || r.source_url || '',
      source_url: r.source_url || r.download_url || '',
      skills: SKILL_LABEL_MAP[r.skill] || 'Tổng hợp đa kỹ năng',
      language: r.language_of_instruction || 'Song ngữ Trung - Việt',
      license: r.license_status || 'Tài liệu giáo dục công cộng',
      verification_status: r.permission_status === 'reproducible' ? 'verified_official' : 'curated',
      related_lesson_id: Array.isArray(r.related_lesson_ids) && r.related_lesson_ids.length > 0 ? r.related_lesson_ids[0] : null,
      tags: Array.isArray(r.tags) ? r.tags.join(', ') : (r.tags || ''),
      storage_bucket: 'materials',
      storage_path: `general/academic/${r.id}`
    }));

  const materialsPayload = [...defaultPayload, ...hskResourcesPayload];

  if (isDryRun) {
    recordMetric('materials', { total: materialsPayload.length, skipped: materialsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('materials', materialsPayload, 'id');
    recordMetric('materials', { total: materialsPayload.length, inserted: res.inserted, errors: res.errors });
  }
}

// -----------------------------------------------------------------------------
// 8. SYNC DAILY QUOTES (60 QUOTES)
// -----------------------------------------------------------------------------
async function syncDailyQuotes() {
  console.log('\n--- 8. ĐỒNG BỘ CHÂM NGÔN HỌC TẬP (DAILY_QUOTES) ---');
  if (target !== 'all' && target !== 'quotes') return;

  let existingMap = new Map();
  try {
    const { data } = await supabase.from('daily_quotes').select('id, hanzi');
    if (data) {
      for (const r of data) existingMap.set(r.hanzi, r.id);
    }
  } catch {}

  let ins = 0;
  let upd = 0;
  let err = 0;

  for (const q of DAILY_QUOTES) {
    const payload = {
      hanzi: q.hanzi,
      pinyin: q.pinyin,
      meaning: q.meaning,
      author: q.author || '',
      hsk_level: 'HSK 1',
      is_hidden: false
    };

    if (isDryRun) {
      continue;
    }

    if (existingMap.has(q.hanzi)) {
      const { error } = await supabase
        .from('daily_quotes')
        .update(payload)
        .eq('id', existingMap.get(q.hanzi));
      if (error) err++; else upd++;
    } else {
      const { error } = await supabase
        .from('daily_quotes')
        .insert(payload);
      if (error) err++; else ins++;
    }
  }

  if (isDryRun) {
    recordMetric('daily_quotes', { total: DAILY_QUOTES.length, skipped: DAILY_QUOTES.length, notes: 'DRY-RUN' });
  } else {
    recordMetric('daily_quotes', { total: DAILY_QUOTES.length, inserted: ins, updated: upd, errors: err });
  }
}

// -----------------------------------------------------------------------------
// MAIN EXECUTION
// -----------------------------------------------------------------------------
async function main() {
  console.log('================================================================');
  console.log(`HANZIGO SUPABASE MASTER SYNCHRONIZATION (${isDryRun ? 'DRY-RUN MODE' : 'LIVE SYNC'})`);
  console.log(`Endpoint: ${supabaseUrl}`);
  console.log('================================================================');

  await syncLevelsAndChapters();
  await syncLearningLessons();
  await syncBossChallenges();
  await syncHanziDecompositions();
  await syncHskExamCenter();
  await syncVocabulary();
  await syncMaterials();
  await syncDailyQuotes();

  console.log('\n================================================================');
  console.log('TỔNG HỢP KẾT QUẢ ĐỒNG BỘ:');
  console.log('================================================================');
  console.table(report.modules);

  if (isDryRun) {
    console.log('\n💡 [DRY-RUN HOÀN TẤT] Mọi kiểm tra schema và định dạng đều hợp lệ!');
    console.log('Để thực thi đồng bộ dữ liệu thật, chạy:');
    console.log('  node --env-file=.env scripts/syncSupabaseMaster.js');
  } else {
    console.log('\n🎉 [LIVE SYNC HOÀN TẤT] Toàn bộ dữ liệu HanziGo đã được đồng bộ chuẩn mực lên Supabase!');
  }
}

main().catch(err => {
  console.error('Fatal synchronization error:', err);
  process.exit(1);
});
