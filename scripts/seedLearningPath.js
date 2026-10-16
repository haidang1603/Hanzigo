import { createClient } from '@supabase/supabase-js';
import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES 
} from '../src/data/learningPathData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Lỗi cấu hình: Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY.');
  process.exit(1);
}

const isProductionEnv = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
if (isProductionEnv && process.env.CONFIRM_PRODUCTION_SEED !== 'true') {
  console.error('⛔ CẢNH BÁO AN TOÀN: Đang chạy trong môi trường Production. Cần biến CONFIRM_PRODUCTION_SEED=true để xác nhận.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedLearningPath() {
  console.log('🚀 Bắt đầu cập nhật dữ liệu Learning Path lên Supabase...');

  // 1. Seed Learning Levels (HSK 1 đến HSK 7-9)
  console.log(`📦 1. Đang nạp ${LEARNING_LEVELS.length} Cấp độ HSK 3.0...`);
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

  const { error: lvlErr } = await supabase
    .from('learning_levels')
    .upsert(levelsPayload, { onConflict: 'id' });

  if (lvlErr) {
    console.warn('⚠️ Cảnh báo nạp levels (có thể bảng chưa được tạo trong SQL Editor):', lvlErr.message);
  } else {
    console.log(`✅ Đã nạp thành công ${levelsPayload.length} Cấp độ HSK!`);
  }

  // 2. Seed Learning Chapters (24 Chapters)
  console.log(`📦 2. Đang nạp ${LEARNING_CHAPTERS.length} Chapters...`);
  const chaptersPayload = LEARNING_CHAPTERS.map((ch, idx) => ({
    id: ch.id,
    level_id: ch.levelId,
    chapter_number: ch.chapterNumber,
    title: ch.title,
    title_zh: ch.chineseTitle,
    description: ch.desc,
    order_index: ch.chapterNumber || (idx + 1)
  }));

  const { error: chErr } = await supabase
    .from('learning_chapters')
    .upsert(chaptersPayload, { onConflict: 'id' });

  if (chErr) {
    console.warn('⚠️ Cảnh báo nạp chapters:', chErr.message);
  } else {
    console.log(`✅ Đã nạp thành công ${chaptersPayload.length} Chapters!`);
  }

  // 3. Seed Flagship Lessons (9 steps)
  console.log(`📦 3. Đang nạp ${LEARNING_LESSONS.length} Bài học chuẩn 9 bước...`);
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
      step1_learn: l.step1_learn,
      step2_vocabulary: l.step2_vocabulary,
      step3_hanzi: l.step3_hanzi,
      step4_grammar: l.step4_grammar,
      step5_listening: l.step5_listening,
      step6_speaking: l.step6_speaking,
      step7_writing: l.step7_writing,
      step8_quiz: l.step8_quiz,
      step9_challenge: l.step9_challenge
    }
  }));

  const { error: lErr } = await supabase
    .from('learning_lessons')
    .upsert(lessonsPayload, { onConflict: 'id' });

  if (lErr) {
    console.warn('⚠️ Cảnh báo nạp lessons:', lErr.message);
  } else {
    console.log(`✅ Đã nạp thành công ${lessonsPayload.length} Bài học chuẩn 9 bước!`);
  }

  // 4. Seed Boss Challenges
  console.log(`📦 4. Đang nạp ${BOSS_CHALLENGES.length} Boss Challenges...`);
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

  const { error: bErr } = await supabase
    .from('learning_boss_challenges')
    .upsert(bossesPayload, { onConflict: 'id' });

  if (bErr) {
    console.warn('⚠️ Cảnh báo nạp boss challenges:', bErr.message);
  } else {
    console.log(`✅ Đã nạp thành công ${bossesPayload.length} Boss Challenges!`);
  }

  console.log('🎉 Hoàn tất kiểm tra và đồng bộ dữ liệu Learning Path!');
}

seedLearningPath().catch(console.error);
