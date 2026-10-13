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
  longest_streak INT DEFAULT 1,
  last_study_date DATE,
  is_leaderboard_hidden BOOLEAN DEFAULT false,
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
  source_url TEXT,
  publisher TEXT,
  skills TEXT DEFAULT 'Tổng hợp đa kỹ năng',
  language TEXT DEFAULT 'Song ngữ Trung - Việt',
  license TEXT DEFAULT 'Tài liệu giáo dục công cộng',
  verification_status TEXT DEFAULT 'verified',
  related_lesson_id TEXT,
  verification_notes TEXT,
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
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc ON public.profiles(xp DESC);
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
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_owner_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_owner_or_admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
CREATE POLICY "profiles_delete_admin_only" ON public.profiles FOR DELETE USING (public.is_admin());

-- 5.2 Content (Public read for unhidden, Admin manage)
DROP POLICY IF EXISTS "materials_select_public" ON public.materials;
CREATE POLICY "materials_select_public" ON public.materials FOR SELECT USING (is_hidden = false OR public.is_admin());

DROP POLICY IF EXISTS "materials_admin_insert" ON public.materials;
CREATE POLICY "materials_admin_insert" ON public.materials FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "materials_admin_update" ON public.materials;
CREATE POLICY "materials_admin_update" ON public.materials FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "materials_admin_delete" ON public.materials;
CREATE POLICY "materials_admin_delete" ON public.materials FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "lessons_select_public" ON public.lessons;
CREATE POLICY "lessons_select_public" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "lessons_admin_insert" ON public.lessons;
CREATE POLICY "lessons_admin_insert" ON public.lessons FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lessons_admin_update" ON public.lessons;
CREATE POLICY "lessons_admin_update" ON public.lessons FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lessons_admin_delete" ON public.lessons;
CREATE POLICY "lessons_admin_delete" ON public.lessons FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "vocabulary_select_public" ON public.vocabulary;
CREATE POLICY "vocabulary_select_public" ON public.vocabulary FOR SELECT USING (true);

DROP POLICY IF EXISTS "vocabulary_admin_insert" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_insert" ON public.vocabulary FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "vocabulary_admin_update" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_update" ON public.vocabulary FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "vocabulary_admin_delete" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_delete" ON public.vocabulary FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "writing_select_public" ON public.writing_characters;
CREATE POLICY "writing_select_public" ON public.writing_characters FOR SELECT USING (true);

DROP POLICY IF EXISTS "writing_admin_insert" ON public.writing_characters;
CREATE POLICY "writing_admin_insert" ON public.writing_characters FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "writing_admin_update" ON public.writing_characters;
CREATE POLICY "writing_admin_update" ON public.writing_characters FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "writing_admin_delete" ON public.writing_characters;
CREATE POLICY "writing_admin_delete" ON public.writing_characters FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "pronunciation_select_public" ON public.pronunciation_items;
CREATE POLICY "pronunciation_select_public" ON public.pronunciation_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "pronunciation_admin_insert" ON public.pronunciation_items;
CREATE POLICY "pronunciation_admin_insert" ON public.pronunciation_items FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "pronunciation_admin_update" ON public.pronunciation_items;
CREATE POLICY "pronunciation_admin_update" ON public.pronunciation_items FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "pronunciation_admin_delete" ON public.pronunciation_items;
CREATE POLICY "pronunciation_admin_delete" ON public.pronunciation_items FOR DELETE USING (public.is_admin());

-- 5.3 Student Progress & Logs
DROP POLICY IF EXISTS "user_vocab_srs_owner_all" ON public.user_vocab_srs;
CREATE POLICY "user_vocab_srs_owner_all" ON public.user_vocab_srs FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_lesson_progress_owner_all" ON public.user_lesson_progress;
CREATE POLICY "user_lesson_progress_owner_all" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_study_logs_owner_all" ON public.user_study_logs;
CREATE POLICY "user_study_logs_owner_all" ON public.user_study_logs FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "ai_conversations_owner_all" ON public.ai_conversations;
CREATE POLICY "ai_conversations_owner_all" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "ai_messages_owner_all" ON public.ai_messages;
CREATE POLICY "ai_messages_owner_all" ON public.ai_messages FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_saved_materials_owner_all" ON public.user_saved_materials;
CREATE POLICY "user_saved_materials_owner_all" ON public.user_saved_materials FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 5.4 Community
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

-- Policies cá nhân hóa cho học viên
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

-- Index tăng tốc truy vấn lộ trình
CREATE INDEX IF NOT EXISTS idx_chapters_level ON public.learning_chapters(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.learning_lessons(chapter_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_user_journey_uid ON public.user_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_uid_date ON public.user_daily_missions(user_id, mission_date);

-- =========================================================================
-- 8. TEACHER MODE & CLASSROOM MVP SYSTEM
-- =========================================================================

-- 8.1. Kiểm tra quyền Teacher an toàn trên database (Migration 12 Hardened)
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin') AND status != 'blocked'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated, service_role, anon;

-- 8.2. classrooms: Quản lý lớp học
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  hsk_level TEXT DEFAULT 'HSK 1',
  class_code TEXT NOT NULL UNIQUE,
  max_students INT DEFAULT 30 CHECK (max_students >= 1),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.3. class_members: Thành viên học viên
CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  CONSTRAINT uq_class_member_pair UNIQUE (classroom_id, student_id)
);

-- 8.4. assignments: Bài tập giao cho lớp
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'Vocabulary',
  content_id TEXT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  due_date TIMESTAMPTZ NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.5. assignment_submissions: Bài nộp và chấm điểm
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
  submission_data JSONB DEFAULT '{}'::jsonb,
  score NUMERIC(5,2) NULL,
  feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ NULL,
  graded_by UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT uq_assignment_student_submission UNIQUE (assignment_id, student_id)
);

-- 8.6. class_announcements: Bảng tin thông báo
CREATE TABLE IF NOT EXISTS public.class_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.7. class_materials: Tài liệu học tập riêng của lớp
CREATE TABLE IF NOT EXISTS public.class_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher ON public.classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_code ON public.classrooms(class_code);
CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assign ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);

-- RPC Function: Tham gia lớp học bằng code
-- RPC Function: Tra cứu lớp học bằng mã (Migration 10)
CREATE OR REPLACE FUNCTION public.lookup_classroom_by_code(p_class_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_clean_code TEXT;
  v_without_prefix TEXT;
  v_classroom RECORD;
  v_student_count INT;
BEGIN
  IF p_class_code IS NULL OR TRIM(p_class_code) = '' THEN
    RETURN NULL;
  END IF;

  v_clean_code := UPPER(REGEXP_REPLACE(TRIM(p_class_code), '\s+', '', 'g'));
  v_without_prefix := REGEXP_REPLACE(v_clean_code, '^HZG-?', '');

  SELECT c.*, p.name AS teacher_name, p.avatar AS teacher_avatar
  INTO v_classroom
  FROM public.classrooms c
  LEFT JOIN public.profiles p ON p.id = c.teacher_id
  WHERE (
    UPPER(REGEXP_REPLACE(c.class_code, '\s+', '', 'g')) = v_clean_code
    OR UPPER(REGEXP_REPLACE(c.class_code, '\s+', '', 'g')) = 'HZG-' || v_without_prefix
    OR UPPER(REGEXP_REPLACE(REGEXP_REPLACE(c.class_code, '\s+', '', 'g'), '^HZG-?', '')) = v_without_prefix
  )
  AND c.status = 'active'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*) INTO v_student_count
  FROM public.class_members
  WHERE classroom_id = v_classroom.id AND status = 'active';

  RETURN jsonb_build_object(
    'id', v_classroom.id,
    'name', v_classroom.name,
    'description', v_classroom.description,
    'hsk_level', v_classroom.hsk_level,
    'class_code', v_classroom.class_code,
    'max_students', v_classroom.max_students,
    'status', v_classroom.status,
    'teacher_name', COALESCE(v_classroom.teacher_name, 'Giáo viên HanziGo'),
    'teacher_avatar', v_classroom.teacher_avatar,
    'student_count', v_student_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.lookup_classroom_by_code(TEXT) TO authenticated, anon, service_role;

-- RPC Function: Tham gia lớp học bằng code (Migration 10 Hardened)
CREATE OR REPLACE FUNCTION public.join_class_by_code(p_class_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_uid UUID;
  v_user_role TEXT;
  v_user_status TEXT;
  v_classroom RECORD;
  v_clean_code TEXT;
  v_without_prefix TEXT;
  v_student_count INT;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Chưa xác thực: Vui lòng đăng nhập trước khi tham gia lớp học.';
  END IF;

  SELECT role, status INTO v_user_role, v_user_status
  FROM public.profiles
  WHERE id = v_uid;

  IF v_user_status = 'blocked' THEN
    RAISE EXCEPTION 'Tài khoản của bạn đang bị khóa, không thể tham gia lớp học.';
  END IF;

  v_clean_code := UPPER(REGEXP_REPLACE(TRIM(p_class_code), '\s+', '', 'g'));
  v_without_prefix := REGEXP_REPLACE(v_clean_code, '^HZG-?', '');

  SELECT * INTO v_classroom
  FROM public.classrooms
  WHERE (
    UPPER(REGEXP_REPLACE(class_code, '\s+', '', 'g')) = v_clean_code
    OR UPPER(REGEXP_REPLACE(class_code, '\s+', '', 'g')) = 'HZG-' || v_without_prefix
    OR UPPER(REGEXP_REPLACE(REGEXP_REPLACE(class_code, '\s+', '', 'g'), '^HZG-?', '')) = v_without_prefix
  )
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mã lớp không hợp lệ hoặc không tồn tại.';
  END IF;

  IF v_classroom.status != 'active' THEN
    RAISE EXCEPTION 'Lớp học hiện tại đã đóng hoặc lưu trữ, không tiếp nhận học viên mới.';
  END IF;

  IF v_classroom.teacher_id = v_uid THEN
    RAISE EXCEPTION 'Bạn là giáo viên phụ trách lớp này, không cần tham gia dưới vai trò học viên.';
  END IF;

  SELECT COUNT(*) INTO v_student_count
  FROM public.class_members
  WHERE classroom_id = v_classroom.id AND status = 'active';

  IF v_student_count >= v_classroom.max_students THEN
    RAISE EXCEPTION 'Lớp học đã đạt sĩ số tối đa (% học viên). Vui lòng liên hệ giáo viên.', v_classroom.max_students;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.class_members
    WHERE classroom_id = v_classroom.id AND student_id = v_uid AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Bạn đã là thành viên của lớp học này.';
  END IF;

  INSERT INTO public.class_members (classroom_id, student_id, status, joined_at)
  VALUES (v_classroom.id, v_uid, 'active', NOW())
  ON CONFLICT (classroom_id, student_id)
  DO UPDATE SET status = 'active', joined_at = NOW();

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Tham gia lớp học thành công!',
    'classroom_id', v_classroom.id,
    'name', v_classroom.name,
    'hsk_level', v_classroom.hsk_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.join_class_by_code(TEXT) TO authenticated, anon, service_role;

-- RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_materials ENABLE ROW LEVEL SECURITY;

-- Helper functions with SECURITY DEFINER to break mutual RLS recursion
CREATE OR REPLACE FUNCTION public.is_classroom_member(
  p_classroom_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members
    WHERE classroom_id = p_classroom_id
      AND student_id = p_user_id
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_classroom_teacher(
  p_classroom_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = p_classroom_id
      AND teacher_id = p_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_classroom_member(UUID, UUID) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.is_classroom_teacher(UUID, UUID) TO authenticated, service_role, anon;

DROP POLICY IF EXISTS "classrooms_select_policy" ON public.classrooms;
CREATE POLICY "classrooms_select_policy" ON public.classrooms
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_member(id, auth.uid())
  );

-- Chỉ tài khoản đã có role 'teacher' hoặc 'admin' mới được phép tạo lớp học (Migration 12)
DROP POLICY IF EXISTS "classrooms_insert_policy" ON public.classrooms;
CREATE POLICY "classrooms_insert_policy" ON public.classrooms
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND role IN ('teacher', 'admin') 
        AND status != 'blocked'
    )
  );

DROP POLICY IF EXISTS "classrooms_update_policy" ON public.classrooms;
CREATE POLICY "classrooms_update_policy" ON public.classrooms
  FOR UPDATE USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "classrooms_delete_policy" ON public.classrooms;
CREATE POLICY "classrooms_delete_policy" ON public.classrooms
  FOR DELETE USING (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "class_members_select_policy" ON public.class_members;
CREATE POLICY "class_members_select_policy" ON public.class_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
    OR public.is_classroom_member(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_insert_policy" ON public.class_members;
CREATE POLICY "class_members_insert_policy" ON public.class_members
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_update_policy" ON public.class_members;
CREATE POLICY "class_members_update_policy" ON public.class_members
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "class_members_delete_policy" ON public.class_members;
CREATE POLICY "class_members_delete_policy" ON public.class_members
  FOR DELETE USING (
    public.is_admin()
    OR public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "assignments_select_policy" ON public.assignments;
CREATE POLICY "assignments_select_policy" ON public.assignments
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR (
      published = true
      AND public.is_classroom_member(classroom_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "assignments_insert_policy" ON public.assignments;
CREATE POLICY "assignments_insert_policy" ON public.assignments
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND (public.is_teacher() OR public.is_admin())
    AND public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "assignments_update_policy" ON public.assignments;
CREATE POLICY "assignments_update_policy" ON public.assignments
  FOR UPDATE USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "assignments_delete_policy" ON public.assignments;
CREATE POLICY "assignments_delete_policy" ON public.assignments
  FOR DELETE USING (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "submissions_select_policy" ON public.assignment_submissions;
CREATE POLICY "submissions_select_policy" ON public.assignment_submissions
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
        AND (c.teacher_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "submissions_insert_policy" ON public.assignment_submissions;
CREATE POLICY "submissions_insert_policy" ON public.assignment_submissions
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.class_members m ON a.classroom_id = m.classroom_id
      WHERE a.id = assignment_submissions.assignment_id
        AND m.student_id = auth.uid()
        AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS "submissions_update_policy" ON public.assignment_submissions;
CREATE POLICY "submissions_update_policy" ON public.assignment_submissions
  FOR UPDATE USING (
    student_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classrooms c ON a.classroom_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
        AND (c.teacher_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "announcements_select_policy" ON public.class_announcements;
CREATE POLICY "announcements_select_policy" ON public.class_announcements
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_members.classroom_id = class_announcements.classroom_id
        AND class_members.student_id = auth.uid()
        AND class_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "announcements_manage_policy" ON public.class_announcements;
CREATE POLICY "announcements_manage_policy" ON public.class_announcements
  FOR ALL USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

DROP POLICY IF EXISTS "class_materials_select_policy" ON public.class_materials;
CREATE POLICY "class_materials_select_policy" ON public.class_materials
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_members.classroom_id = class_materials.classroom_id
        AND class_members.student_id = auth.uid()
        AND class_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "class_materials_manage_policy" ON public.class_materials;
CREATE POLICY "class_materials_manage_policy" ON public.class_materials
  FOR ALL USING (
    teacher_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    teacher_id = auth.uid() OR public.is_admin()
  );

-- =========================================================================
-- 7. LIVE CLASSROOM SESSIONS, PARTICIPANTS, AND CHAT
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ NULL,
  status TEXT DEFAULT 'live' CHECK (status IN ('scheduled', 'live', 'ended')),
  is_locked BOOLEAN DEFAULT false,
  is_chat_muted BOOLEAN DEFAULT false,
  max_capacity INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_classroom ON public.class_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON public.class_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.class_sessions(status);

CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ NULL,
  total_duration_seconds INT DEFAULT 0,
  mic_enabled BOOLEAN DEFAULT false,
  camera_enabled BOOLEAN DEFAULT false,
  hand_raised BOOLEAN DEFAULT false,
  hand_raised_at TIMESTAMPTZ NULL,
  is_mic_allowed BOOLEAN DEFAULT false,
  attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'late', 'absent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_session_user_pair UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_part_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_part_user ON public.session_participants(user_id);

CREATE TABLE IF NOT EXISTS public.session_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'student')),
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON public.session_chat_messages(session_id);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for class_sessions
DROP POLICY IF EXISTS "Members can view class sessions" ON public.class_sessions;
CREATE POLICY "Members can view class sessions"
  ON public.class_sessions FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    public.is_classroom_member(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "Teacher can create session" ON public.class_sessions;
CREATE POLICY "Teacher can create session"
  ON public.class_sessions FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid() AND
    public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "Teacher can update session" ON public.class_sessions;
CREATE POLICY "Teacher can update session"
  ON public.class_sessions FOR UPDATE
  USING (teacher_id = auth.uid());

-- Policies for session_participants
DROP POLICY IF EXISTS "Session members can view participants" ON public.session_participants;
CREATE POLICY "Session members can view participants"
  ON public.session_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Authorized users can join session" ON public.session_participants;
CREATE POLICY "Authorized users can join session"
  ON public.session_participants FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Users or Teacher can update participant" ON public.session_participants;
CREATE POLICY "Users or Teacher can update participant"
  ON public.session_participants FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  );

-- Trigger: Prevent participant self privilege escalation (Migration 15)
CREATE OR REPLACE FUNCTION public.prevent_participant_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_is_teacher BOOLEAN := false;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    v_is_teacher := public.is_admin() OR EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = OLD.session_id AND s.teacher_id = auth.uid()
    );
  END IF;

  IF NOT v_is_teacher THEN
    IF (NEW.is_mic_allowed IS DISTINCT FROM OLD.is_mic_allowed) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ giáo viên phụ trách phòng mới có quyền cấp quyền Micro.';
    END IF;
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự thay đổi vai trò trong phòng học.';
    END IF;
    IF (NEW.attendance_status IS DISTINCT FROM OLD.attendance_status) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự sửa trạng thái điểm danh.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_participant_privilege_escalation ON public.session_participants;
CREATE TRIGGER trg_prevent_participant_privilege_escalation
  BEFORE UPDATE ON public.session_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_participant_privilege_escalation();

-- Policies for session_chat_messages
DROP POLICY IF EXISTS "Participants can view chat messages" ON public.session_chat_messages;
CREATE POLICY "Participants can view chat messages"
  ON public.session_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Participants can send chat message" ON public.session_chat_messages;
CREATE POLICY "Participants can send chat message"
  ON public.session_chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        (
          s.is_chat_muted = false AND
          public.is_classroom_member(s.classroom_id, auth.uid())
        )
      )
    )
  );

DROP POLICY IF EXISTS "Teacher can delete chat message" ON public.session_chat_messages;
CREATE POLICY "Teacher can delete chat message"
  ON public.session_chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
  );

-- =========================================================================
-- 9. AUDIT LOGGING & ANTI-TAMPERING CONTROLS (PRODUCTION SECURITY HARDENING)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'CLASSROOM',
  severity TEXT NOT NULL DEFAULT 'INFO',
  actor_id TEXT NOT NULL,
  target_id TEXT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON public.audit_logs (category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR actor_id = 'anonymous' OR public.is_admin()
  );

DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_teacher() 
      AND (
        actor_id = auth.uid()::text
        OR target_id IN (
          SELECT id::text FROM public.classrooms WHERE teacher_id = auth.uid()
        )
      )
    )
  );

-- Trigger: Prevent students from altering scores on assignment_submissions
CREATE OR REPLACE FUNCTION public.prevent_student_self_grading()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.score IS DISTINCT FROM OLD.score 
      OR NEW.graded_at IS DISTINCT FROM OLD.graded_at 
      OR NEW.graded_by IS DISTINCT FROM OLD.graded_by
      OR NEW.feedback IS DISTINCT FROM OLD.feedback) THEN
    
    IF auth.uid() IS NOT NULL AND NOT (
      public.is_admin() OR EXISTS (
        SELECT 1 
        FROM public.assignments a
        JOIN public.classrooms c ON a.classroom_id = c.id
        WHERE a.id = NEW.assignment_id 
          AND c.teacher_id = auth.uid()
      )
    ) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự chấm điểm hoặc chỉnh sửa điểm bài nộp.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_student_self_grading ON public.assignment_submissions;
CREATE TRIGGER trg_prevent_student_self_grading
  BEFORE UPDATE ON public.assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_student_self_grading();

-- =========================================================================
-- 10. SUPABASE REALTIME REPLICATION CONFIGURATION
-- =========================================================================

-- Set REPLICA IDENTITY FULL to ensure UPDATE and DELETE events include old record values
ALTER TABLE public.class_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.session_participants REPLICA IDENTITY FULL;
ALTER TABLE public.session_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.study_partners REPLICA IDENTITY FULL;
ALTER TABLE public.classrooms REPLICA IDENTITY FULL;
ALTER TABLE public.class_members REPLICA IDENTITY FULL;
ALTER TABLE public.assignments REPLICA IDENTITY FULL;
ALTER TABLE public.assignment_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.class_announcements REPLICA IDENTITY FULL;
ALTER TABLE public.class_materials REPLICA IDENTITY FULL;

-- Ensure tables are published to supabase_realtime
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.class_sessions; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.session_chat_messages; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.study_partners; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.classrooms; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.class_members; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.assignment_submissions; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.class_announcements; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.class_materials; EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- =========================================================================
-- 11. HSK PRACTICE PLATFORM, MOCK EXAM ENGINE & FREE LEARNING RESOURCE LIBRARY
-- (Tích hợp hoàn chỉnh: Cấu trúc đề thi, Câu hỏi, Lượt thi, Sổ câu sai & Thư viện OER)
-- =========================================================================

-- 11.1. hsk_exam_structures: Cấu trúc đề thi HSK chính thức đa phiên bản
CREATE TABLE IF NOT EXISTS public.hsk_exam_structures (
  id TEXT PRIMARY KEY, -- e.g. 'hsk-1-2015', 'hsk-3-2015', 'hsk-7-9-2021'
  level TEXT NOT NULL, -- 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'
  version TEXT NOT NULL DEFAULT '2015-Standard', -- '2015-Standard', 'HSK 3.0-2021'
  level_name_vi TEXT NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 200,
  passing_score INTEGER NOT NULL DEFAULT 120,
  vocabulary_requirement INTEGER NOT NULL,
  character_requirement INTEGER,
  has_pinyin BOOLEAN NOT NULL DEFAULT true,
  audio_play_count INTEGER NOT NULL DEFAULT 2,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_reference TEXT NOT NULL DEFAULT 'chinesetest.cn',
  source_url TEXT DEFAULT 'http://www.chinesetest.cn/',
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified_transition', 'official_standard')),
  verified_date DATE DEFAULT CURRENT_DATE,
  unverified_fields JSONB DEFAULT '[]'::jsonb,
  notes_vi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_structures_level ON public.hsk_exam_structures(level);
CREATE INDEX IF NOT EXISTS idx_hsk_structures_version ON public.hsk_exam_structures(version);

-- 11.2. hsk_exams: Bảng đề thi HSK (Đề mô phỏng, Đề mẫu CTI)
CREATE TABLE IF NOT EXISTS public.hsk_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL, -- HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6
  exam_version TEXT NOT NULL DEFAULT '2015-Standard',
  exam_type TEXT NOT NULL DEFAULT 'mock', -- 'mock', 'official_sample', 'licensed_external'
  skill_category TEXT NOT NULL DEFAULT 'mixed', -- 'listening', 'reading', 'writing', 'grammar', 'mixed'
  duration_minutes INTEGER NOT NULL DEFAULT 40,
  total_questions INTEGER NOT NULL DEFAULT 20,
  passing_score INTEGER NOT NULL DEFAULT 120, -- HSK 1-2: 120/200, HSK 3-6: 180/300
  max_score INTEGER NOT NULL DEFAULT 200, -- HSK 1-2: 200, HSK 3-6: 300
  description TEXT,
  source_url TEXT,
  source_author TEXT,
  license TEXT DEFAULT 'CC BY-NC-SA 4.0 / HanziGo Educational Content',
  permission_status TEXT NOT NULL DEFAULT 'reproducible', -- 'reproducible', 'linked_only', 'original_content'
  review_status TEXT NOT NULL DEFAULT 'published' CHECK (review_status IN ('draft', 'needs_review', 'approved', 'published', 'rejected', 'archived')),
  difficulty_estimate TEXT NOT NULL DEFAULT 'standard',
  audio_play_limit INTEGER DEFAULT 2,
  verified_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_exams_level ON public.hsk_exams(level);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_published ON public.hsk_exams(is_published);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_skill ON public.hsk_exams(skill_category);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_type ON public.hsk_exams(exam_type);

-- 11.3. hsk_questions: Bảng câu hỏi chi tiết đa dạng
CREATE TABLE IF NOT EXISTS public.hsk_questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  part_type TEXT NOT NULL, -- 'listening', 'reading', 'writing', 'grammar', 'vocabulary'
  part_number INTEGER NOT NULL DEFAULT 1,
  question_number INTEGER NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  prompt TEXT NOT NULL, -- Nội dung đề bài (Chữ Hán)
  pinyin TEXT, -- Phiên âm Pinyin
  translation TEXT, -- Nghĩa tiếng Việt
  audio_url TEXT, -- File âm thanh (nếu có)
  audio_script TEXT, -- Lời thoại phát thanh
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Phương án lựa chọn
  correct_option_index INTEGER NOT NULL, -- BẢO MẬT: Không lộ cho client trước khi nộp
  explanation TEXT, -- Lời giải chi tiết
  points INTEGER NOT NULL DEFAULT 5,
  words JSONB DEFAULT '[]'::jsonb,
  correct_order JSONB DEFAULT '[]'::jsonb,
  accepted_answers JSONB DEFAULT '[]'::jsonb,
  writing_criteria JSONB DEFAULT '[]'::jsonb,
  sample_answer TEXT,
  min_words INTEGER DEFAULT 0,
  max_words INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_questions_exam ON public.hsk_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_hsk_questions_number ON public.hsk_questions(exam_id, question_number);

-- 11.4. hsk_attempts: Lượt làm bài thi thử (Học viên & Khách vãng lai)
CREATE TABLE IF NOT EXISTS public.hsk_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable cho khách vãng lai
  anonymous_session_id TEXT, -- Định danh phiên ẩn danh
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  exam_mode TEXT NOT NULL DEFAULT 'simulation' CHECK (exam_mode IN ('simulation', 'practice')),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  submitted_answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- { [questionId]: selectedOptionIndex }
  writing_answers JSONB DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 200,
  accuracy_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  skill_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  detailed_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_attempts_user ON public.hsk_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_session ON public.hsk_attempts(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_exam ON public.hsk_attempts(exam_id);

-- 11.5. hsk_mistakes: Sổ tay câu hỏi sai (Mistakes Notebook)
CREATE TABLE IF NOT EXISTS public.hsk_mistakes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_session_id TEXT,
  question_id TEXT NOT NULL,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'HSK 1',
  part_type TEXT NOT NULL DEFAULT 'general',
  category TEXT DEFAULT 'Tổng hợp',
  prompt TEXT NOT NULL,
  pinyin TEXT,
  translation TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_answer_index INTEGER,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  mistake_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review', 'mastered')),
  last_attempt_id TEXT REFERENCES public.hsk_attempts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_user ON public.hsk_mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_session ON public.hsk_mistakes(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_question ON public.hsk_mistakes(question_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_status ON public.hsk_mistakes(status);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_level ON public.hsk_mistakes(level);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_user_question 
  ON public.hsk_mistakes(user_id, question_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_session_question 
  ON public.hsk_mistakes(anonymous_session_id, question_id) 
  WHERE anonymous_session_id IS NOT NULL AND user_id IS NULL;

-- 11.6. hsk_resources: Thư viện tài nguyên học tập tiếng Trung miễn phí
CREATE TABLE IF NOT EXISTS public.hsk_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'All', -- 'HSK 1' -> 'HSK 6', 'HSK 7-9', 'All'
  exam_version TEXT NOT NULL DEFAULT '2015-Standard',
  category TEXT NOT NULL DEFAULT 'sample_exam',
  academic_category TEXT NOT NULL DEFAULT 'textbooks_courses' CHECK (academic_category IN (
    'textbooks_courses',       -- A. Giáo trình & Khóa học
    'pinyin_pronunciation',    -- B. Ngữ âm & Pinyin
    'chinese_characters',      -- C. Hán tự & Bộ thủ
    'vocabulary',              -- D. Từ vựng theo cấp độ & chủ đề
    'grammar',                 -- E. Ngữ pháp & Cú pháp
    'listening_speaking',      -- F. Nghe & Nói
    'reading_writing',         -- G. Đọc & Viết
    'hsk_preparation',         -- H. Luyện thi HSK & Đề mẫu
    'culture_communication'    -- I. Văn hóa & Giao tiếp thực tế
  )),
  skill TEXT NOT NULL DEFAULT 'mixed',
  format TEXT NOT NULL DEFAULT 'web_link',
  source_url TEXT NOT NULL,
  source_author TEXT NOT NULL,
  publisher TEXT,
  host_type TEXT NOT NULL DEFAULT 'free_external' CHECK (host_type IN ('hanzigo_original', 'official_published', 'open_license', 'free_external')),
  language_of_instruction TEXT NOT NULL DEFAULT 'Song ngữ Trung - Việt',
  license_status TEXT NOT NULL DEFAULT 'Public Educational Sample',
  permission_status TEXT NOT NULL DEFAULT 'reproducible' CHECK (permission_status IN ('reproducible', 'linked_only', 'unverified')),
  review_status TEXT NOT NULL DEFAULT 'published' CHECK (review_status IN ('draft', 'needs_review', 'approved', 'published', 'rejected', 'archived')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  download_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  learning_objectives TEXT[] DEFAULT '{}'::text[],
  related_lesson_ids TEXT[] DEFAULT '{}'::text[],
  related_exam_ids TEXT[] DEFAULT '{}'::text[],
  verified_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_resources_level ON public.hsk_resources(level);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_category ON public.hsk_resources(category);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_academic_cat ON public.hsk_resources(academic_category);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_host_type ON public.hsk_resources(host_type);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_language ON public.hsk_resources(language_of_instruction);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_exam_version ON public.hsk_resources(exam_version);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_skill ON public.hsk_resources(skill);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_published ON public.hsk_resources(is_published);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_status ON public.hsk_resources(review_status);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_related_lessons ON public.hsk_resources USING GIN(related_lesson_ids);
CREATE INDEX IF NOT EXISTS idx_hsk_resources_related_exams ON public.hsk_resources USING GIN(related_exam_ids);

-- 11.7. hsk_reports: Báo cáo lỗi & khiếu nại chất lượng từ học viên
CREATE TABLE IF NOT EXISTS public.hsk_reports (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES public.hsk_resources(id) ON DELETE SET NULL,
  exam_id TEXT REFERENCES public.hsk_exams(id) ON DELETE SET NULL,
  question_id TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('broken_link', 'audio_error', 'answer_discrepancy', 'typo', 'copyright_concern')),
  description TEXT NOT NULL,
  reporter_email TEXT,
  admin_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_reports_status ON public.hsk_reports(status);
CREATE INDEX IF NOT EXISTS idx_hsk_reports_type ON public.hsk_reports(report_type);

-- 11.8. VIEW bảo mật cho client (TƯỚC BỎ TOÀN BỘ ĐÁP ÁN: correct_option_index, correct_order, accepted_answers, sample_answer, explanation)
DROP VIEW IF EXISTS public.v_hsk_questions_public;
CREATE VIEW public.v_hsk_questions_public 
WITH (security_invoker = true) AS
  SELECT 
    id,
    exam_id,
    part_type,
    part_number,
    question_number,
    question_type,
    prompt,
    pinyin,
    translation,
    audio_url,
    audio_script,
    options,
    words,
    writing_criteria,
    min_words,
    max_words,
    points
  FROM public.hsk_questions;

-- 11.9. Bật Row Level Security & Thiết lập Policies
ALTER TABLE public.hsk_exam_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_reports ENABLE ROW LEVEL SECURITY;

-- hsk_exam_structures Policies
DROP POLICY IF EXISTS "hsk_exam_structures_public_read" ON public.hsk_exam_structures;
CREATE POLICY "hsk_exam_structures_public_read" ON public.hsk_exam_structures FOR SELECT USING (true);

DROP POLICY IF EXISTS "hsk_exam_structures_admin_all" ON public.hsk_exam_structures;
CREATE POLICY "hsk_exam_structures_admin_all" ON public.hsk_exam_structures FOR ALL USING (public.is_admin());

-- hsk_exams Policies
DROP POLICY IF EXISTS "hsk_exams_public_read" ON public.hsk_exams;
CREATE POLICY "hsk_exams_public_read" ON public.hsk_exams FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "hsk_exams_admin_all" ON public.hsk_exams;
CREATE POLICY "hsk_exams_admin_all" ON public.hsk_exams FOR ALL USING (public.is_admin());

-- hsk_questions Policies (Chỉ admin toàn quyền; client đọc câu hỏi bài thi qua VIEW v_hsk_questions_public)
DROP POLICY IF EXISTS "hsk_questions_admin_all" ON public.hsk_questions;
CREATE POLICY "hsk_questions_admin_all" ON public.hsk_questions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "hsk_questions_read_published" ON public.hsk_questions;
CREATE POLICY "hsk_questions_read_published" ON public.hsk_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hsk_exams 
    WHERE id = hsk_questions.exam_id AND is_published = true
  ) OR public.is_admin()
);

-- hsk_attempts Policies
DROP POLICY IF EXISTS "hsk_attempts_insert_public" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_insert_public" ON public.hsk_attempts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "hsk_attempts_select_owner" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_select_owner" ON public.hsk_attempts FOR SELECT USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_attempts_no_update" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_no_update" ON public.hsk_attempts FOR UPDATE USING (public.is_admin());

-- hsk_mistakes Policies
DROP POLICY IF EXISTS "hsk_mistakes_select_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_select_owner" ON public.hsk_mistakes FOR SELECT USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_insert_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_insert_owner" ON public.hsk_mistakes FOR INSERT WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_update_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_update_owner" ON public.hsk_mistakes FOR UPDATE USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_delete_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_delete_owner" ON public.hsk_mistakes FOR DELETE USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

-- hsk_resources Policies
DROP POLICY IF EXISTS "Public can view published learning resources" ON public.hsk_resources;
CREATE POLICY "Public can view published learning resources" ON public.hsk_resources FOR SELECT USING (
  (is_published = true AND review_status = 'published') OR
  public.is_admin()
);

DROP POLICY IF EXISTS "Admins full access on learning resources" ON public.hsk_resources;
CREATE POLICY "Admins full access on learning resources" ON public.hsk_resources FOR ALL USING (
  public.is_admin() OR 
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
);

-- hsk_reports Policies
DROP POLICY IF EXISTS "hsk_reports_public_insert" ON public.hsk_reports;
CREATE POLICY "hsk_reports_public_insert" ON public.hsk_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "hsk_reports_admin_all" ON public.hsk_reports;
CREATE POLICY "hsk_reports_admin_all" ON public.hsk_reports FOR ALL USING (public.is_admin());

-- 11.10. Realtime Replication cho bảng HSK
ALTER TABLE public.hsk_attempts REPLICA IDENTITY FULL;
ALTER TABLE public.hsk_mistakes REPLICA IDENTITY FULL;
ALTER TABLE public.hsk_reports REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.hsk_attempts; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.hsk_mistakes; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.hsk_reports; EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- =========================================================================
-- 12. RAG KNOWLEDGE DATASET PIPELINE & AI TUTOR FOUNDATION
-- =========================================================================

-- 12.1. rag_knowledge_sources: Nguồn tri thức và giấy phép bản quyền
CREATE TABLE IF NOT EXISTS public.rag_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('dictionary', 'grammar', 'curriculum', 'hsk_standard', 'dialogue', 'academic_paper')),
  hsk_level TEXT DEFAULT 'All',
  author TEXT,
  publisher TEXT,
  source_url TEXT,
  license_identifier TEXT NOT NULL,
  attribution TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  retrieval_date TIMESTAMPTZ DEFAULT NOW(),
  checksum TEXT,
  review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('curated_verified', 'pending_review', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  record_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12.2. rag_knowledge_chunks: Đoạn tri thức chi tiết (Idempotent by chunk_key)
CREATE TABLE IF NOT EXISTS public.rag_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES public.rag_knowledge_sources(id) ON DELETE CASCADE,
  chunk_key TEXT UNIQUE NOT NULL,
  chunk_type TEXT NOT NULL CHECK (chunk_type IN ('vocab_entry', 'grammar_pattern', 'example_sentence', 'dialogue_context', 'culture_note')),
  hsk_level TEXT DEFAULT 'HSK 1',
  topic TEXT,
  simplified TEXT NOT NULL,
  traditional TEXT,
  pinyin TEXT,
  pinyin_numbered TEXT,
  vietnamese_meaning TEXT NOT NULL,
  pedagogical_notes TEXT,
  grammar_pattern TEXT,
  example_sentences JSONB DEFAULT '[]'::jsonb,
  license_identifier TEXT NOT NULL,
  attribution TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (review_status IN ('curated_verified', 'pending_review', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12.3. rag_ingestion_audit_logs: Lịch sử kiểm toán nhập tri thức
CREATE TABLE IF NOT EXISTS public.rag_ingestion_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id TEXT NOT NULL,
  source_key TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('dry_run', 'import', 'rollback', 'deduplicate')),
  total_records INT DEFAULT 0,
  imported_records INT DEFAULT 0,
  updated_records INT DEFAULT 0,
  skipped_duplicates INT DEFAULT 0,
  invalid_records INT DEFAULT 0,
  checksum TEXT,
  error_details JSONB DEFAULT '[]'::jsonb,
  executed_by TEXT DEFAULT 'system_importer',
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục
CREATE INDEX IF NOT EXISTS idx_rag_chunks_source ON public.rag_knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_type_hsk ON public.rag_knowledge_chunks(chunk_type, hsk_level);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_simplified ON public.rag_knowledge_chunks(simplified);
CREATE INDEX IF NOT EXISTS idx_rag_sources_key ON public.rag_knowledge_sources(source_key);
CREATE INDEX IF NOT EXISTS idx_rag_audit_batch ON public.rag_ingestion_audit_logs(batch_id);

-- RLS Policies
ALTER TABLE public.rag_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_ingestion_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rag_sources_read_verified" ON public.rag_knowledge_sources;
CREATE POLICY "rag_sources_read_verified" ON public.rag_knowledge_sources
  FOR SELECT USING ((is_verified = true AND review_status = 'curated_verified' AND is_active = true) OR public.is_admin());

DROP POLICY IF EXISTS "rag_sources_admin_all" ON public.rag_knowledge_sources;
CREATE POLICY "rag_sources_admin_all" ON public.rag_knowledge_sources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "rag_chunks_read_verified" ON public.rag_knowledge_chunks;
CREATE POLICY "rag_chunks_read_verified" ON public.rag_knowledge_chunks
  FOR SELECT USING ((is_verified = true AND review_status = 'curated_verified') OR public.is_admin());

DROP POLICY IF EXISTS "rag_chunks_admin_all" ON public.rag_knowledge_chunks;
CREATE POLICY "rag_chunks_admin_all" ON public.rag_knowledge_chunks
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "rag_audit_admin_all" ON public.rag_ingestion_audit_logs;
CREATE POLICY "rag_audit_admin_all" ON public.rag_ingestion_audit_logs
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());




