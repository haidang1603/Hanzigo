-- =========================================================================
-- HANZIGO - SUPABASE MIGRATION SCRIPT (COPY & PASTE VÀO SQL EDITOR SUPABASE)
-- =========================================================================
-- Hướng dẫn:
-- 1. Truy cập https://supabase.com/dashboard/project/woszblniatdvijwdkmpm/sql
-- 2. Dán toàn bộ nội dung file này vào và bấm [ RUN ] (Chạy)
-- 3. Sau khi chạy xong, gõ lệnh terminal: npm run db:seed:learning để nạp dữ liệu!
-- =========================================================================

-- 1. Đảm bảo các cột bổ sung cho bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;

-- 2. Bảng cộng đồng & bạn học (nếu chưa có)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Học viên HanziGo',
  author_avatar TEXT,
  author_level TEXT DEFAULT 'HSK 1',
  content TEXT NOT NULL,
  tag TEXT DEFAULT '#HoiDapNguPhap',
  likes INT DEFAULT 0,
  liked_by JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_partners (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  target_level TEXT DEFAULT 'HSK 2',
  daily_time TEXT DEFAULT 'Tối 20h - 21h',
  contact TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG DỮ LIỆU LEARNING PATH & GAMIFICATION SYSTEM
-- 3.1. learning_levels: 6 Level chuẩn EdTech
CREATE TABLE IF NOT EXISTS public.learning_levels (
  id TEXT PRIMARY KEY,
  level_number INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  pinyin TEXT DEFAULT '',
  badge TEXT DEFAULT '🌱',
  color TEXT DEFAULT 'emerald',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. learning_chapters: 24 Chapter
CREATE TABLE IF NOT EXISTS public.learning_chapters (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL REFERENCES public.learning_levels(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description TEXT DEFAULT '',
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3. learning_lessons: Bài học 9 bước chuẩn sư phạm
CREATE TABLE IF NOT EXISTS public.learning_lessons (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL REFERENCES public.learning_levels(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  xp_reward INT DEFAULT 50,
  description TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4. learning_boss_challenges: Thử thách Boss trận chiến cuối mỗi Chapter
CREATE TABLE IF NOT EXISTS public.learning_boss_challenges (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL UNIQUE REFERENCES public.learning_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  scenario TEXT NOT NULL,
  xp_reward INT DEFAULT 200,
  passing_score INT DEFAULT 70,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5. user_journey_progress: Lưu tiến độ node-by-node của từng học viên
CREATE TABLE IF NOT EXISTS public.user_journey_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_bosses TEXT[] DEFAULT ARRAY[]::TEXT[],
  unlocked_levels INT DEFAULT 1,
  active_lesson_id TEXT DEFAULT 'l-101',
  streak_count INT DEFAULT 1,
  last_study_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_journey UNIQUE (user_id)
);

-- 3.6. user_skill_mastery: Điểm thông thạo 7 kỹ năng
CREATE TABLE IF NOT EXISTS public.user_skill_mastery (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listening INT DEFAULT 40,
  speaking INT DEFAULT 35,
  reading INT DEFAULT 50,
  writing INT DEFAULT 30,
  vocabulary INT DEFAULT 45,
  hanzi INT DEFAULT 38,
  grammar INT DEFAULT 42,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_skills UNIQUE (user_id)
);

-- 3.7. user_daily_missions: Nhiệm vụ ngày & tiến độ thực hiện
CREATE TABLE IF NOT EXISTS public.user_daily_missions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_date DATE DEFAULT CURRENT_DATE,
  missions JSONB NOT NULL DEFAULT '[]'::jsonb,
  all_completed BOOLEAN DEFAULT FALSE,
  claimed_bonus BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_daily_missions UNIQUE (user_id, mission_date)
);

-- 4. BẬT BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_boss_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;

-- 5. CHÍNH SÁCH BẢO MẬT (POLICIES)
-- Community & Partners
DROP POLICY IF EXISTS "community_posts_select" ON public.community_posts;
CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_posts_insert" ON public.community_posts;
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "community_posts_update" ON public.community_posts;
CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
DROP POLICY IF EXISTS "community_posts_delete" ON public.community_posts;
CREATE POLICY "community_posts_delete" ON public.community_posts FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

DROP POLICY IF EXISTS "study_partners_select" ON public.study_partners;
CREATE POLICY "study_partners_select" ON public.study_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "study_partners_insert" ON public.study_partners;
CREATE POLICY "study_partners_insert" ON public.study_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "study_partners_update" ON public.study_partners;
CREATE POLICY "study_partners_update" ON public.study_partners FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "study_partners_delete" ON public.study_partners;
CREATE POLICY "study_partners_delete" ON public.study_partners FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Learning Content
DROP POLICY IF EXISTS "learning_levels_select" ON public.learning_levels;
CREATE POLICY "learning_levels_select" ON public.learning_levels FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_levels_admin" ON public.learning_levels;
CREATE POLICY "learning_levels_admin" ON public.learning_levels FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_chapters_select" ON public.learning_chapters;
CREATE POLICY "learning_chapters_select" ON public.learning_chapters FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_chapters_admin" ON public.learning_chapters;
CREATE POLICY "learning_chapters_admin" ON public.learning_chapters FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_lessons_select" ON public.learning_lessons;
CREATE POLICY "learning_lessons_select" ON public.learning_lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_lessons_admin" ON public.learning_lessons;
CREATE POLICY "learning_lessons_admin" ON public.learning_lessons FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "learning_boss_select" ON public.learning_boss_challenges;
CREATE POLICY "learning_boss_select" ON public.learning_boss_challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "learning_boss_admin" ON public.learning_boss_challenges;
CREATE POLICY "learning_boss_admin" ON public.learning_boss_challenges FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- User Journey & Stats
DROP POLICY IF EXISTS "user_journey_owner" ON public.user_journey_progress;
CREATE POLICY "user_journey_owner" ON public.user_journey_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_skills_owner" ON public.user_skill_mastery;
CREATE POLICY "user_skills_owner" ON public.user_skill_mastery FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_daily_missions_owner" ON public.user_daily_missions;
CREATE POLICY "user_daily_missions_owner" ON public.user_daily_missions FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 6. INDEX HIỆU NĂNG TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_chapters_level ON public.learning_chapters(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.learning_lessons(chapter_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_user_journey_uid ON public.user_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_uid_date ON public.user_daily_missions(user_id, mission_date);

-- Hoàn tất!
SELECT '🎉 Chúc mừng! Cập nhật Database Supabase thành công 100%!' AS result;
