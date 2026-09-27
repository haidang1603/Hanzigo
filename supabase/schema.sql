-- =========================================================================
-- HANZI GO - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- Phiên bản hoàn chỉnh: Hỗ trợ Auth, Phân quyền (RBAC), Lộ trình, Từ vựng,
-- Bút thuận, Luyện âm, Kho tài liệu, Cộng đồng & Đồng bộ học tập cá nhân.
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABLE: profiles (Thông tin hồ sơ học viên & quản trị viên)
-- =========================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
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

-- Tự động bổ sung các cột nếu bảng profiles đã tồn tại
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;

-- =========================================================================
-- 2. TABLE: users_learning_data (Dữ liệu học tập chi tiết từng học viên)
-- =========================================================================
CREATE TABLE IF NOT EXISTS users_learning_data (
  uid UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  streak INT DEFAULT 1,
  xp INT DEFAULT 50,
  vocab_remembered JSONB DEFAULT '[]'::jsonb,
  vocab_review JSONB DEFAULT '[]'::jsonb,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  custom_vocab JSONB DEFAULT '[]'::jsonb,
  custom_lessons JSONB DEFAULT '[]'::jsonb,
  pronounce_history JSONB DEFAULT '[]'::jsonb,
  custom_writing_chars JSONB DEFAULT '[]'::jsonb,
  chat_history JSONB DEFAULT '{}'::jsonb,
  custom_materials JSONB DEFAULT '[]'::jsonb,
  saved_materials JSONB DEFAULT '[]'::jsonb,
  daily_goal INT DEFAULT 15,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. TABLE: materials (Kho tài liệu, giáo trình, sách ngữ pháp, đề thi HSK)
-- =========================================================================
CREATE TABLE IF NOT EXISTS materials (
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

-- Bổ sung cột nếu bảng materials đã tồn tại
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS downloads_count INT DEFAULT 0;

-- =========================================================================
-- 4. TABLE: lessons (Danh mục bài học lộ trình HSK)
-- =========================================================================
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL, -- 'intro', 'hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5-6'
  number INT NOT NULL,
  title TEXT NOT NULL,
  duration INT DEFAULT 20,
  xp INT DEFAULT 50,
  description TEXT DEFAULT '',
  grammar_points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 5. TABLE: vocabulary (Từ điển HSK & Từ vựng thông dụng)
-- =========================================================================
CREATE TABLE IF NOT EXISTS vocabulary (
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

-- =========================================================================
-- 6. TABLE: writing_characters (Thư viện chữ Hán tập viết & bút thuận)
-- =========================================================================
CREATE TABLE IF NOT EXISTS writing_characters (
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

-- =========================================================================
-- 7. TABLE: pronunciation_items (Thanh mẫu, vận mẫu, thanh điệu & mẫu câu)
-- =========================================================================
CREATE TABLE IF NOT EXISTS pronunciation_items (
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

-- =========================================================================
-- 8. TABLE: community_posts (Bảng tin cộng đồng, trao đổi ngữ pháp)
-- =========================================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id BIGSERIAL PRIMARY KEY,
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

-- =========================================================================
-- 9. TABLE: study_partners (Ghép đôi bạn học cùng tiến)
-- =========================================================================
CREATE TABLE IF NOT EXISTS study_partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_level TEXT DEFAULT 'HSK 2',
  daily_time TEXT DEFAULT 'Tối 20h - 21h',
  contact TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES & PERFORMANCE OPTIMIZATION
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_level ON materials(level);
CREATE INDEX IF NOT EXISTS idx_lessons_level_id ON lessons(level_id);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocab_hanzi ON vocabulary(hanzi);
CREATE INDEX IF NOT EXISTS idx_writing_hanzi ON writing_characters(hanzi);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON study_partners(created_at DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_partners ENABLE ROW LEVEL SECURITY;

-- Bỏ các policy cũ nếu có để tránh trùng lặp
DROP POLICY IF EXISTS "Public read profiles" ON profiles;
DROP POLICY IF EXISTS "Public write profiles" ON profiles;
DROP POLICY IF EXISTS "Public read learning data" ON users_learning_data;
DROP POLICY IF EXISTS "Public write learning data" ON users_learning_data;
DROP POLICY IF EXISTS "Public read materials" ON materials;
DROP POLICY IF EXISTS "Public write materials" ON materials;
DROP POLICY IF EXISTS "Public read lessons" ON lessons;
DROP POLICY IF EXISTS "Public write lessons" ON lessons;
DROP POLICY IF EXISTS "Public read vocabulary" ON vocabulary;
DROP POLICY IF EXISTS "Public write vocabulary" ON vocabulary;
DROP POLICY IF EXISTS "Public read writing_characters" ON writing_characters;
DROP POLICY IF EXISTS "Public write writing_characters" ON writing_characters;
DROP POLICY IF EXISTS "Public read pronunciation_items" ON pronunciation_items;
DROP POLICY IF EXISTS "Public write pronunciation_items" ON pronunciation_items;
DROP POLICY IF EXISTS "Public read community posts" ON community_posts;
DROP POLICY IF EXISTS "Public write community posts" ON community_posts;
DROP POLICY IF EXISTS "Public read study partners" ON study_partners;
DROP POLICY IF EXISTS "Public write study partners" ON study_partners;

-- 1. Profiles Policies
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON profiles FOR ALL USING (true);

-- 2. Learning Data Policies
CREATE POLICY "Public read learning data" ON users_learning_data FOR SELECT USING (true);
CREATE POLICY "Public write learning data" ON users_learning_data FOR ALL USING (true);

-- 3. Educational Content Policies
CREATE POLICY "Public read materials" ON materials FOR SELECT USING (true);
CREATE POLICY "Public write materials" ON materials FOR ALL USING (true);

CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public write lessons" ON lessons FOR ALL USING (true);

CREATE POLICY "Public read vocabulary" ON vocabulary FOR SELECT USING (true);
CREATE POLICY "Public write vocabulary" ON vocabulary FOR ALL USING (true);

CREATE POLICY "Public read writing_characters" ON writing_characters FOR SELECT USING (true);
CREATE POLICY "Public write writing_characters" ON writing_characters FOR ALL USING (true);

CREATE POLICY "Public read pronunciation_items" ON pronunciation_items FOR SELECT USING (true);
CREATE POLICY "Public write pronunciation_items" ON pronunciation_items FOR ALL USING (true);

-- 4. Community & Study Partners Policies
CREATE POLICY "Public read community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public write community posts" ON community_posts FOR ALL USING (true);

CREATE POLICY "Public read study partners" ON study_partners FOR SELECT USING (true);
CREATE POLICY "Public write study partners" ON study_partners FOR ALL USING (true);

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (WHEN USER SIGNS UP IN SUPABASE AUTH)
-- =========================================================================
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
    CASE WHEN new.email IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com') THEN 'admin' ELSE 'student' END,
    'active',
    1,
    50,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    role = CASE WHEN EXCLUDED.email IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com') THEN 'admin' ELSE profiles.role END,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Gán quyền Admin vĩnh viễn cho tài khoản quản trị chính thức
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN ('lehaidang16032006@gmail.com', 'admin@hanzigo.com');

