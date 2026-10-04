-- =========================================================================
-- MIGRATION 01: Core Entities & Base Tables
-- Description: Khởi tạo các bảng gốc: profiles, materials, lessons, 
-- vocabulary, writing_characters, pronunciation_items, community_posts, study_partners
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles
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

-- 2. materials (Giáo trình, sách tham khảo, đề thi)
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

-- 3. lessons (Lộ trình bài học HSK)
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

-- 4. vocabulary (Từ điển & kho từ HSK)
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

-- 5. writing_characters (Thư viện chữ Hán và bút thuận)
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

-- 6. pronunciation_items (Thanh mẫu, vận mẫu, thanh điệu)
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

-- 7. community_posts (Diễn đàn & hỏi đáp)
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

-- 8. study_partners (Ghép bạn học)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_level ON public.materials(level);
CREATE INDEX IF NOT EXISTS idx_lessons_level_id ON public.lessons(level_id);
CREATE INDEX IF NOT EXISTS idx_vocab_level ON public.vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocab_hanzi ON public.vocabulary(hanzi);
CREATE INDEX IF NOT EXISTS idx_writing_hanzi ON public.writing_characters(hanzi);
CREATE INDEX IF NOT EXISTS idx_community_created_at ON public.community_posts(created_at DESC);

-- Đảm bảo tương thích nếu bảng đã được tạo trước đó
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
