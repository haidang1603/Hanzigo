-- =========================================================================
-- HANZI GO - CANONICAL SUPABASE POSTGRESQL DATABASE SCHEMA (v2.0 PRODUCTION)
-- Phiên bản hoàn chỉnh: Auth, RBAC, RLS Chặt chẽ, Thuật toán SRS SM-2,
-- Tiến độ học tập chuẩn hóa, Quản lý tài liệu & Quản trị hệ thống.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. BẢNG DỮ LIỆU CỐT LÕI
-- =========================================================================

-- 1.1. profiles: Hồ sơ học viên & quản trị viên
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'HSK 1 - Sơ cấp',
  avatar TEXT,
  bio TEXT,
  role TEXT DEFAULT 'student', -- 'admin', 'moderator', 'student'
  status TEXT DEFAULT 'active', -- 'active', 'blocked'
  streak INT DEFAULT 1,
  xp INT DEFAULT 50,
  words_learned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2. materials: Kho tài liệu & giáo trình
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Giáo trình chuẩn',
  level TEXT DEFAULT 'HSK 1',
  format TEXT DEFAULT 'PDF',
  file_size TEXT DEFAULT '10 MB',
  author TEXT DEFAULT 'HanziGo Biên soạn',
  description TEXT DEFAULT '',
  download_url TEXT NOT NULL,
  tags TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  downloads_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3. lessons: Lộ trình bài học HSK
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL,
  number INT NOT NULL,
  title TEXT NOT NULL,
  duration INT DEFAULT 20,
  xp INT DEFAULT 50,
  description TEXT DEFAULT '',
  grammar_points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4. vocabulary: Từ điển HSK
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id BIGSERIAL PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  hanviet TEXT DEFAULT '',
  meaning TEXT NOT NULL,
  level TEXT DEFAULT 'HSK 1',
  topic TEXT DEFAULT 'Tổng hợp',
  radical TEXT DEFAULT '',
  strokes INT DEFAULT 1,
  mnemonic TEXT DEFAULT '',
  example JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5. writing_characters: Thư viện tập viết & bút thuận
CREATE TABLE IF NOT EXISTS public.writing_characters (
  id BIGSERIAL PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  hanviet TEXT DEFAULT '',
  meaning TEXT NOT NULL,
  level TEXT DEFAULT 'HSK 1',
  strokes INT DEFAULT 1,
  stroke_order JSONB DEFAULT '[]'::jsonb,
  components TEXT DEFAULT '',
  tips TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.6. pronunciation_items: Luyện phát âm
CREATE TABLE IF NOT EXISTS public.pronunciation_items (
  id BIGSERIAL PRIMARY KEY,
  char TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  hanviet TEXT DEFAULT '',
  meaning TEXT DEFAULT '',
  tone INT DEFAULT 1,
  type TEXT DEFAULT 'Thanh mẫu',
  level TEXT DEFAULT 'Nhập môn',
  sample_word TEXT DEFAULT '',
  sample_pinyin TEXT DEFAULT '',
  sample_meaning TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.7. community_posts: Bảng tin cộng đồng
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

-- 1.8. study_partners: Ghép cặp học tập
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

-- =========================================================================
-- ĐẢM BẢO CÁC CỘT BỔ SUNG TỒN TẠI (DÀNH CHO TRƯỜNG HỢP BẢNG ĐÃ ĐƯỢC TẠO TỪ TRƯỚC)
-- =========================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;

ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Học viên HanziGo';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_level TEXT DEFAULT 'HSK 1';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT '#HoiDapNguPhap';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS liked_by JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS qr_image TEXT;

-- =========================================================================
-- 2. BẢNG TIẾN ĐỘ HỌC TẬP CHUẨN HÓA (SRS, BÀI HỌC, AI CHAT)
-- =========================================================================

-- 2.1. user_vocab_srs: Tiến độ từ vựng theo thuật toán Spaced Repetition (SM-2)
CREATE TABLE IF NOT EXISTS public.user_vocab_srs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocab_id BIGINT,
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  level TEXT DEFAULT 'HSK 1',
  stage INT DEFAULT 0,              -- 0: Học mới, 1: Đang ôn, 2: Thuần thục
  repetitions INT DEFAULT 0,        -- Số lần ôn liên tiếp đúng
  interval_days INT DEFAULT 1,      -- Khoảng cách ngày ôn
  ease_factor NUMERIC(4,2) DEFAULT 2.50, -- Hệ số SM-2 (tối thiểu 1.30)
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_vocab UNIQUE (user_id, hanzi)
);

-- 2.2. user_lesson_progress: Tiến độ hoàn thành bài học
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INT DEFAULT 100,
  xp_earned INT DEFAULT 50,
  CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- 2.3. user_study_logs: Lịch sử hoạt động học tập (Audit trail & Chống gian lận XP)
CREATE TABLE IF NOT EXISTS public.user_study_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'vocab_srs', 'lesson_complete', 'pronounce_practice', 'writing_practice', 'ai_chat'
  item_ref TEXT,
  xp_awarded INT DEFAULT 0,
  study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4. ai_conversations: Phiên đàm thoại với AI Tutor
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT,
  title TEXT NOT NULL DEFAULT 'Hội thoại tiếng Trung',
  hsk_level TEXT DEFAULT 'HSK 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5. ai_messages: Tin nhắn trong hội thoại AI
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  grammar_analysis TEXT,
  correction TEXT,
  vocab_suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6. user_saved_materials: Tài liệu đã lưu
CREATE TABLE IF NOT EXISTS public.user_saved_materials (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_material UNIQUE (user_id, material_id)
);

-- =========================================================================
-- 3. CHỈ MỤC TỐI ƯU HIỆU NĂNG (INDEXES)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_level ON public.materials(level);
CREATE INDEX IF NOT EXISTS idx_lessons_level_id ON public.lessons(level_id);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON public.vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocab_hanzi ON public.vocabulary(hanzi);
CREATE INDEX IF NOT EXISTS idx_writing_hanzi ON public.writing_characters(hanzi);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_vocab_srs_user_review ON public.user_vocab_srs(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_vocab_srs_stage ON public.user_vocab_srs(user_id, stage);
CREATE INDEX IF NOT EXISTS idx_user_lesson_user ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_logs_user_date ON public.user_study_logs(user_id, study_date);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at ASC);

-- =========================================================================
-- 4. HÀM BẢO MẬT & TRIGGER BẢO VỆ PHÂN QUYỀN
-- =========================================================================

-- Kiểm tra quyền Admin an toàn trên database
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Chặn người dùng tự nâng quyền (role) hoặc gỡ chặn (status)
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) THEN
    -- Chỉ chặn khi là yêu cầu từ client web (auth.uid() khác NULL) và không phải Admin
    -- Thao tác trực tiếp từ Supabase SQL Editor / Backend migration (auth.uid() IS NULL) được phép
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Quản trị viên (Admin) mới có thể sửa đổi vai trò hoặc trạng thái.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- Trigger tự động tạo profile khi người dùng đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, level, avatar, role, status, streak, xp, words_learned)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(new.raw_user_meta_data->>'level', 'HSK 1 - Sơ cấp'),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    'student',
    'active',
    1,
    50,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocab_srs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_materials ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_owner_or_admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_delete_admin_only" ON public.profiles FOR DELETE USING (public.is_admin());

-- 5.2 Content (Public read, Admin manage)
CREATE POLICY "materials_select_public" ON public.materials FOR SELECT USING (true);
CREATE POLICY "materials_admin_insert" ON public.materials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_update" ON public.materials FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_delete" ON public.materials FOR DELETE USING (public.is_admin());

CREATE POLICY "lessons_select_public" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "lessons_admin_insert" ON public.lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "lessons_admin_update" ON public.lessons FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "lessons_admin_delete" ON public.lessons FOR DELETE USING (public.is_admin());

CREATE POLICY "vocabulary_select_public" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "vocabulary_admin_insert" ON public.vocabulary FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "vocabulary_admin_update" ON public.vocabulary FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "vocabulary_admin_delete" ON public.vocabulary FOR DELETE USING (public.is_admin());

CREATE POLICY "writing_select_public" ON public.writing_characters FOR SELECT USING (true);
CREATE POLICY "writing_admin_insert" ON public.writing_characters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "writing_admin_update" ON public.writing_characters FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "writing_admin_delete" ON public.writing_characters FOR DELETE USING (public.is_admin());

CREATE POLICY "pronunciation_select_public" ON public.pronunciation_items FOR SELECT USING (true);
CREATE POLICY "pronunciation_admin_insert" ON public.pronunciation_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "pronunciation_admin_update" ON public.pronunciation_items FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pronunciation_admin_delete" ON public.pronunciation_items FOR DELETE USING (public.is_admin());

-- 5.3 Student Progress & Logs
CREATE POLICY "user_vocab_srs_owner_all" ON public.user_vocab_srs FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_lesson_progress_owner_all" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_study_logs_owner_all" ON public.user_study_logs FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "ai_conversations_owner_all" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "ai_messages_owner_all" ON public.ai_messages FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_saved_materials_owner_all" ON public.user_saved_materials FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 5.4 Community
CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());
CREATE POLICY "community_posts_delete" ON public.community_posts FOR DELETE USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "study_partners_select" ON public.study_partners FOR SELECT USING (true);
CREATE POLICY "study_partners_insert" ON public.study_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "study_partners_update" ON public.study_partners FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "study_partners_delete" ON public.study_partners FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- =========================================================================
-- 6. HÀM RPC CHO QUẢN TRỊ VIÊN
-- =========================================================================

-- Xóa user an toàn qua Server-side RPC
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thực thi thao tác xóa người dùng.';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Không thể tự xóa tài khoản quản trị đang đăng nhập.';
  END IF;

  DELETE FROM public.user_vocab_srs WHERE user_id = target_user_id;
  DELETE FROM public.user_lesson_progress WHERE user_id = target_user_id;
  DELETE FROM public.user_study_logs WHERE user_id = target_user_id;
  DELETE FROM public.ai_conversations WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Đã xóa người dùng thành công.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sửa quyền / trạng thái user an toàn qua Server-side RPC
CREATE OR REPLACE FUNCTION public.admin_update_user_status(target_user_id UUID, new_role TEXT, new_status TEXT)
RETURNS JSONB AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Chỉ có Admin mới có quyền thay đổi role hoặc status của người dùng.';
  END IF;

  UPDATE public.profiles
  SET 
    role = COALESCE(new_role, role),
    status = COALESCE(new_status, status),
    updated_at = NOW()
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Cập nhật thành công.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 7. LEARNING PATH & GAMIFICATION SYSTEM (HSK 1 đến HSK 7-9, 24 Chapters, Boss Battles)
-- =========================================================================

-- 7.1. learning_levels: Định nghĩa 7 Cấp độ HSK 3.0
CREATE TABLE IF NOT EXISTS public.learning_levels (
  id TEXT PRIMARY KEY,
  level_number INT NOT NULL UNIQUE,
  code TEXT NOT NULL DEFAULT 'HSK 1',
  hsk_level TEXT DEFAULT 'HSK 1',
  hsk_stage TEXT DEFAULT 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)',
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  pinyin TEXT DEFAULT '',
  badge TEXT DEFAULT '🌱',
  color TEXT DEFAULT '#45B97C',
  description TEXT DEFAULT '',
  syllabus_5_pillars JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Đảm bảo các cột HSK 3.0 tồn tại nếu bảng đã được tạo trước đó
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS code TEXT DEFAULT 'HSK 1';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS hsk_level TEXT DEFAULT 'HSK 1';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS hsk_stage TEXT DEFAULT 'Stage 1: HSK 1–3';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '';
ALTER TABLE public.learning_levels ADD COLUMN IF NOT EXISTS syllabus_5_pillars JSONB DEFAULT '{}'::jsonb;

-- 7.2. learning_chapters: Định nghĩa 24 Chapter
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

-- 7.3. learning_lessons: Chi tiết bài học 9 bước (Learn, Vocab, Hanzi, Grammar, Listening, Speaking, Writing, Quiz, Challenge)
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

-- 7.4. learning_boss_challenges: Thử thách Boss cuối mỗi Chapter
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

-- 7.5. user_journey_progress: Lưu tiến độ node-by-node của từng học viên
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

-- 7.6. user_skill_mastery: Điểm thông thạo 7 kỹ năng (Radar chart)
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

-- 7.7. user_daily_missions: Nhiệm vụ hàng ngày & tiến độ thực hiện
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

-- Bật RLS
ALTER TABLE public.learning_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_boss_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;

-- Policies đọc công khai cho tài liệu lộ trình
CREATE POLICY "learning_levels_select" ON public.learning_levels FOR SELECT USING (true);
CREATE POLICY "learning_levels_admin" ON public.learning_levels FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "learning_chapters_select" ON public.learning_chapters FOR SELECT USING (true);
CREATE POLICY "learning_chapters_admin" ON public.learning_chapters FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "learning_lessons_select" ON public.learning_lessons FOR SELECT USING (true);
CREATE POLICY "learning_lessons_admin" ON public.learning_lessons FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "learning_boss_select" ON public.learning_boss_challenges FOR SELECT USING (true);
CREATE POLICY "learning_boss_admin" ON public.learning_boss_challenges FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policies cá nhân hóa cho học viên
CREATE POLICY "user_journey_owner" ON public.user_journey_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_skills_owner" ON public.user_skill_mastery FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_daily_missions_owner" ON public.user_daily_missions FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Index tăng tốc truy vấn lộ trình
CREATE INDEX IF NOT EXISTS idx_chapters_level ON public.learning_chapters(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.learning_lessons(chapter_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_user_journey_uid ON public.user_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_uid_date ON public.user_daily_missions(user_id, mission_date);

