import { createClient } from '@supabase/supabase-js';
import { 
  LEARNING_LEVELS, 
  LEARNING_CHAPTERS, 
  LEARNING_LESSONS, 
  BOSS_CHALLENGES 
} from '../src/data/learningPathData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://woszblniatdvijwdkmpm.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc3pibG5pYXRkdmlqd2RrbXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzEwMTcsImV4cCI6MjEwNjA0NzAxN30.qpSGtdIgGG55MXsLJGbMS3KOLz6W_ZsC16r-6XixMXY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
