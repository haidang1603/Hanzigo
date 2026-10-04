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

  // 1. Seed Learning Levels (6 Levels)
  console.log('📦 1. Đang nạp 6 Levels...');
  const levelsPayload = LEARNING_LEVELS.map(lvl => ({
    id: lvl.id,
    level_number: lvl.number,
    title: lvl.title,
    title_zh: lvl.titleZh,
    pinyin: lvl.pinyin,
    badge: lvl.badge,
    color: lvl.color,
    description: lvl.desc
  }));

  const { error: lvlErr } = await supabase
    .from('learning_levels')
    .upsert(levelsPayload, { onConflict: 'id' });

  if (lvlErr) {
    console.warn('⚠️ Cảnh báo nạp levels (có thể bảng chưa được tạo trong SQL Editor):', lvlErr.message);
  } else {
    console.log(`✅ Đã nạp thành công ${levelsPayload.length} Levels!`);
  }

  // 2. Seed Learning Chapters (24 Chapters)
  console.log('📦 2. Đang nạp 24 Chapters...');
  const chaptersPayload = LEARNING_CHAPTERS.map(ch => ({
    id: ch.id,
    level_id: ch.levelId,
    chapter_number: ch.number,
    title: ch.title,
    title_zh: ch.titleZh,
    description: ch.desc,
    order_index: ch.order
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
  console.log('📦 3. Đang nạp Bài học mẫu chuẩn 9 bước...');
  const lessonsPayload = LEARNING_LESSONS.map(l => ({
    id: l.id,
    chapter_id: l.chapterId,
    level_id: l.levelId,
    lesson_number: l.number,
    title: l.title,
    title_zh: l.titleZh,
    duration_minutes: l.duration,
    xp_reward: l.xp,
    description: l.description,
    content: l.steps
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
  console.log('📦 4. Đang nạp Boss Challenges...');
  const bossesPayload = BOSS_CHALLENGES.map(b => ({
    id: b.id,
    chapter_id: b.chapterId,
    title: b.title,
    title_zh: b.titleZh,
    scenario: b.scenario,
    xp_reward: b.xp,
    passing_score: b.passingScore,
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
