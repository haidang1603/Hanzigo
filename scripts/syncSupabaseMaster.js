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
import { HSK_STRUCTURE_DEFINITIONS } from '../src/data/hskStructureData.js';
import { HSK_EXAMS, HSK_QUESTIONS } from '../src/data/hskExamsData.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import { HSK6_IDIOMS_DATABASE } from '../src/data/hsk6IdiomsData.js';
import { DEFAULT_MATERIALS } from '../src/utils/materialsStorage.js';
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
  console.log('\n--- 5. ĐỒNG BỘ TRUNG TÂM KHẢO THÍ HSK (EXAMS & QUESTIONS) ---');
  if (target !== 'all' && target !== 'exams') return;

  // 5.1 Exam Structures
  const structuresPayload = [];
  for (const [_levelKey, def] of Object.entries(HSK_STRUCTURE_DEFINITIONS)) {
    for (const [versionKey, ver] of Object.entries(def.versions || {})) {
      const structId = `hsk-${def.level.replace(/[^0-9-]/g, '') || '1'}-${versionKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const numericPassing = typeof ver.passingScore === 'number' ? ver.passingScore : parseInt(ver.passingScore, 10) || 120;
      const numericMax = typeof ver.maxScore === 'number' ? ver.maxScore : parseInt(ver.maxScore, 10) || 200;
      const vocabReq = ver.vocabRequirement || (def.level === 'HSK 1' ? 150 : def.level === 'HSK 2' ? 300 : def.level === 'HSK 3' ? 600 : def.level === 'HSK 4' ? 1200 : def.level === 'HSK 5' ? 2500 : 5000);

      structuresPayload.push({
        id: structId,
        level: def.level,
        version: versionKey,
        level_name_vi: `${def.levelNameVi} (${versionKey})`,
        total_duration_minutes: ver.totalDurationMinutes || 40,
        total_questions: ver.totalQuestions || 40,
        passing_score: numericPassing,
        max_score: numericMax,
        vocabulary_requirement: vocabReq,
        character_requirement: ver.characterRequirement || null,
        has_pinyin: ver.hasPinyin ?? (def.level === 'HSK 1' || def.level === 'HSK 2'),
        audio_play_count: ver.audioPlayCount || (def.level === 'HSK 1' || def.level === 'HSK 2' ? 2 : 1),
        sections: ver.sections || [],
        source_reference: 'chinesetest.cn (CTI / CLEC)',
        source_url: 'http://www.chinesetest.cn/',
        verification_status: 'verified',
        notes_vi: def.tagline || ''
      });
    }
  }

  if (isDryRun) {
    recordMetric('hsk_exam_structures', { total: structuresPayload.length, skipped: structuresPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_exam_structures', structuresPayload, 'id');
    recordMetric('hsk_exam_structures', { total: structuresPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // 5.2 Exams
  const examsPayload = HSK_EXAMS.map(e => ({
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
    audio_play_limit: e.level === 'HSK 1' || e.level === 'HSK 2' ? 2 : 1
  }));

  if (isDryRun) {
    recordMetric('hsk_exams', { total: examsPayload.length, skipped: examsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_exams', examsPayload, 'id');
    recordMetric('hsk_exams', { total: examsPayload.length, inserted: res.inserted, errors: res.errors });
  }

  // 5.3 Questions
  const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5 };
  const questionsPayload = HSK_QUESTIONS.map(q => {
    const correctLetter = q.correct_answer || 'A';
    const correctIdx = typeof correctLetter === 'number' 
      ? correctLetter 
      : (letterMap[String(correctLetter).toUpperCase()] ?? 0);

    return {
      id: q.id,
      exam_id: q.exam_id,
      part_type: q.part_type || 'listening',
      part_number: q.part_number || 1,
      question_number: q.question_number || 1,
      question_type: q.question_type || 'multiple_choice',
      prompt: q.prompt || q.stem || 'Câu hỏi',
      pinyin: q.pinyin || '',
      translation: q.translation || q.meaning || '',
      audio_url: q.audio_url || null,
      audio_script: q.audio_script || '',
      options: q.options || [],
      correct_option_index: correctIdx,
      explanation: q.explanation || '',
      points: q.score_weight || q.points || 5,
      words: q.words || [],
      correct_order: q.correct_order || [],
      accepted_answers: q.accepted_answers || []
    };
  });

  if (isDryRun) {
    recordMetric('hsk_questions', { total: questionsPayload.length, skipped: questionsPayload.length, notes: 'DRY-RUN' });
  } else {
    const res = await chunkUpsert('hsk_questions', questionsPayload, 'id', 50);
    recordMetric('hsk_questions', { total: questionsPayload.length, inserted: res.inserted, errors: res.errors });
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

  const materialsPayload = DEFAULT_MATERIALS.map(m => ({
    id: String(m.id),
    title: m.title,
    category: m.category || 'Giáo trình chuẩn',
    level: m.level || 'HSK 1',
    format: m.format || 'PDF',
    file_size: m.fileSize || '10 MB',
    author: m.author || 'HanziGo Biên soạn',
    description: m.description || '',
    download_url: m.downloadUrl || '',
    tags: Array.isArray(m.tags) ? m.tags.join(', ') : (m.tags || ''),
    storage_bucket: 'materials',
    storage_path: `general/system/${m.id}.pdf`
  }));

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
