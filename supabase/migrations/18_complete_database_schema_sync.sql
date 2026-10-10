-- =========================================================================
-- HANZI GO - MIGRATION 18: TOÀN DIỆN LƯỢC ĐỒ DATABASE SUPABASE (MASTER SYNC)
-- Mô tả: File tổng hợp kiểm tra và bổ sung TOÀN BỘ các bảng, các cột còn thiếu
-- trên Supabase. Chạy an toàn nhiều lần (Idempotent), bảo toàn 100% dữ liệu cũ.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. BẢNG PROFILES (Học viên, Giáo viên, Quản trị viên)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT DEFAULT 'HSK 1 - Sơ cấp',
  avatar TEXT,
  bio TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  streak INT DEFAULT 1,
  xp INT DEFAULT 50,
  words_learned INT DEFAULT 0,
  longest_streak INT DEFAULT 1,
  last_study_date DATE,
  is_leaderboard_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Đảm bảo toàn bộ các cột bổ sung tồn tại nếu bảng đã được tạo trước đó
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS words_learned INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_study_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_leaderboard_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill giá trị mặc định cho cột bị NULL
UPDATE public.profiles SET streak = 1 WHERE streak IS NULL;
UPDATE public.profiles SET xp = 50 WHERE xp IS NULL;
UPDATE public.profiles SET words_learned = 0 WHERE words_learned IS NULL;
UPDATE public.profiles SET longest_streak = GREATEST(streak, 1) WHERE longest_streak IS NULL;
UPDATE public.profiles SET is_leaderboard_hidden = false WHERE is_leaderboard_hidden IS NULL;
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;
UPDATE public.profiles SET status = 'active' WHERE status IS NULL;

-- =========================================================================
-- 2. BẢNG MATERIALS & LESSONS (Tài liệu, Giáo trình, Bài học HSK)
-- =========================================================================
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

ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT 'Tổng hợp đa kỹ năng';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Song ngữ Trung - Việt';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'Tài liệu giáo dục công cộng';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS related_lesson_id TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS downloads_count INT DEFAULT 0;

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

-- =========================================================================
-- 3. BẢNG TỪ ĐIỂN, CHỮ HÁN, PHÁT ÂM (Vocabulary, Writing, Pronunciation)
-- =========================================================================
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
  audio_url TEXT,
  example TEXT DEFAULT '',
  example_sentence TEXT,
  example_pinyin TEXT,
  example_meaning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS example_sentence TEXT;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS example_pinyin TEXT;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS example_meaning TEXT;

CREATE TABLE IF NOT EXISTS public.writing_characters (
  id BIGSERIAL PRIMARY KEY,
  hanzi TEXT,
  char TEXT,
  pinyin TEXT NOT NULL,
  hanviet TEXT DEFAULT '',
  meaning TEXT NOT NULL,
  level TEXT DEFAULT 'HSK 1',
  strokes INT DEFAULT 1,
  stroke_order JSONB DEFAULT '[]'::jsonb,
  components JSONB DEFAULT '[]'::jsonb,
  sample_word TEXT DEFAULT '',
  type TEXT DEFAULT 'standard',
  tips TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS char TEXT;
ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS sample_word TEXT DEFAULT '';
ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'standard';
ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS stroke_order JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS components JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.writing_characters ADD COLUMN IF NOT EXISTS tips TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS public.pronunciation_items (
  id BIGSERIAL PRIMARY KEY,
  char TEXT,
  pinyin TEXT NOT NULL,
  hanviet TEXT DEFAULT '',
  meaning TEXT DEFAULT '',
  tone INT DEFAULT 1,
  type TEXT DEFAULT 'initial',
  level TEXT DEFAULT 'HSK 1',
  difficulty TEXT DEFAULT 'easy',
  audio_url TEXT,
  example_words JSONB DEFAULT '[]'::jsonb,
  sample_word TEXT DEFAULT '',
  sample_pinyin TEXT DEFAULT '',
  sample_meaning TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS char TEXT;
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'easy';
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS example_words JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS sample_word TEXT DEFAULT '';
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS sample_pinyin TEXT DEFAULT '';
ALTER TABLE public.pronunciation_items ADD COLUMN IF NOT EXISTS sample_meaning TEXT DEFAULT '';

-- =========================================================================
-- 4. TIẾN ĐỘ HỌC TẬP CHUẨN HÓA (SRS, Lessons, Study Logs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_vocab_srs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocab_id BIGINT NULL,
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  meaning TEXT,
  level TEXT DEFAULT 'HSK 1',
  stage INT DEFAULT 1,
  repetitions INT DEFAULT 0,
  interval_days INT DEFAULT 1,
  ease_factor NUMERIC(4,2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_vocab_hanzi UNIQUE (user_id, hanzi)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INT DEFAULT 100,
  xp_earned INT DEFAULT 50,
  CONSTRAINT uq_user_lesson_progress UNIQUE (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.user_study_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  item_ref TEXT DEFAULT '',
  xp_awarded INT DEFAULT 0,
  study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- =========================================================================
-- 5. LỚP HỌC & GIẢNG DẠY (Classrooms, Members, Assignments, Submissions)
-- =========================================================================
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

ALTER TABLE public.classrooms ADD COLUMN IF NOT EXISTS hsk_level TEXT DEFAULT 'HSK 1';
ALTER TABLE public.classrooms ADD COLUMN IF NOT EXISTS max_students INT DEFAULT 30;
ALTER TABLE public.classrooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.classrooms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  CONSTRAINT uq_class_member_pair UNIQUE (classroom_id, student_id)
);

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

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'Vocabulary';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS content_id TEXT NULL;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ NULL;

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

ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS submission_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS score NUMERIC(5,2) NULL;
ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS feedback TEXT DEFAULT '';
ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ NULL;
ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS graded_by UUID NULL;

CREATE TABLE IF NOT EXISTS public.class_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.class_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 6. LIVE CLASSROOM (Sessions, Participants, Realtime Chat, Teaching Tools)
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
  active_tool TEXT DEFAULT 'hanzi',
  teaching_state JSONB DEFAULT '{}'::jsonb,
  session_history JSONB DEFAULT '{}'::jsonb,
  lesson_summary JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS is_chat_muted BOOLEAN DEFAULT false;
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS max_capacity INT DEFAULT 50;
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS active_tool TEXT DEFAULT 'hanzi';
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS teaching_state JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS session_history JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.class_sessions ADD COLUMN IF NOT EXISTS lesson_summary JSONB DEFAULT '{}'::jsonb;

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

ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS total_duration_seconds INT DEFAULT 0;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS mic_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS camera_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS hand_raised BOOLEAN DEFAULT false;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS hand_raised_at TIMESTAMPTZ NULL;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS is_mic_allowed BOOLEAN DEFAULT false;
ALTER TABLE public.session_participants ADD COLUMN IF NOT EXISTS attendance_status TEXT DEFAULT 'present';

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

-- =========================================================================
-- 7. AUDIT LOGS, CỘNG ĐỒNG & BẠN HỌC (Audit, Community, Study Partners)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  actor_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_id TEXT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Học viên HanziGo',
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT,
  target_level TEXT DEFAULT 'HSK 2',
  daily_time TEXT DEFAULT '20:00 - 21:00',
  contact TEXT,
  intro TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 8. TỐI ƯU INDEX CHO HIỆU NĂNG CAO (Production Indexes)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_streak_desc ON public.profiles(streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard ON public.profiles(status, is_leaderboard_hidden, xp DESC);

CREATE INDEX IF NOT EXISTS idx_classrooms_teacher ON public.classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_code ON public.classrooms(class_code);
CREATE INDEX IF NOT EXISTS idx_class_members_class ON public.class_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON public.class_members(student_id);

CREATE INDEX IF NOT EXISTS idx_sessions_classroom ON public.class_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.class_sessions(status);
CREATE INDEX IF NOT EXISTS idx_part_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_part_user ON public.session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_part_hand_raised ON public.session_participants(session_id, hand_raised);
CREATE INDEX IF NOT EXISTS idx_chat_session ON public.session_chat_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_srs_user_review ON public.user_vocab_srs(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- =========================================================================
-- 9. KÍCH HOẠT REALTIME CHO CÁC BẢNG TRỰC TIẾP (Supabase Publications)
-- =========================================================================
DO $$
BEGIN
  -- Thêm các bảng vào supabase_realtime publication nếu chưa có (bỏ qua nếu đã có hoặc không có quyền)
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_sessions;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_chat_messages;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_announcements;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_members;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- =========================================================================
-- 10. THÔNG BÁO HOÀN TẤT VÀ KIỂM TRA BẢNG CỐT LÕI
-- =========================================================================
SELECT table_name, column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
ORDER BY ordinal_position;
