-- =========================================================================
-- MIGRATION 19: FREE HSK PRACTICE PLATFORM SCHEMA
-- =========================================================================
-- Bảng quản lý đề thi thử, câu hỏi, phiên làm bài (attempts) và chính sách RLS
-- Hỗ trợ cả người dùng vãng lai (anonymous visitors) và người dùng đã đăng nhập.
-- =========================================================================

-- 1. Bảng đề thi HSK (hsk_exams)
CREATE TABLE IF NOT EXISTS public.hsk_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL, -- HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6
  exam_version TEXT NOT NULL DEFAULT '2015-Standard',
  exam_type TEXT NOT NULL DEFAULT 'mock', -- 'mock' (HanziGo biên soạn), 'official_sample' (Đề minh họa chính thức), 'licensed_external' (Tài liệu mở có phép)
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
  verified_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Chỉ mục tìm kiếm đề thi
CREATE INDEX IF NOT EXISTS idx_hsk_exams_level ON public.hsk_exams(level);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_published ON public.hsk_exams(is_published);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_skill ON public.hsk_exams(skill_category);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_type ON public.hsk_exams(exam_type);

-- 2. Bảng câu hỏi (hsk_questions)
CREATE TABLE IF NOT EXISTS public.hsk_questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  part_type TEXT NOT NULL, -- 'listening', 'reading', 'writing', 'grammar', 'vocabulary'
  part_number INTEGER NOT NULL DEFAULT 1,
  question_number INTEGER NOT NULL,
  prompt TEXT NOT NULL, -- Nội dung đề bài (Chữ Hán)
  pinyin TEXT, -- Phiên âm Pinyin
  translation TEXT, -- Nghĩa tiếng Việt
  audio_url TEXT, -- File âm thanh (nếu có)
  audio_script TEXT, -- Lời thoại phát thanh (dùng cho Web Speech TTS hoặc hiển thị sau khi nộp)
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Mảng các phương án: [{ text, pinyin, translation }]
  correct_option_index INTEGER NOT NULL, -- BẢO MẬT: Không được để lộ cho client trước khi nộp
  explanation TEXT, -- Lời giải thích chi tiết tiếng Việt
  points INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_questions_exam ON public.hsk_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_hsk_questions_number ON public.hsk_questions(exam_id, question_number);

-- 3. Bảng lượt làm bài (hsk_attempts)
CREATE TABLE IF NOT EXISTS public.hsk_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable cho khách vãng lai
  anonymous_session_id TEXT, -- Định danh phiên ẩn danh lưu ở localStorage
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  submitted_answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- { [questionId]: selectedOptionIndex }
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

-- 4. Bật Row Level Security (RLS)
ALTER TABLE public.hsk_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_attempts ENABLE ROW LEVEL SECURITY;

-- 5. Chính sách RLS cho hsk_exams
-- Công chúng & Học viên xem được đề thi đã công khai
CREATE POLICY "hsk_exams_public_read" ON public.hsk_exams
  FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Chỉ Admin được thêm, sửa, xóa đề thi
CREATE POLICY "hsk_exams_admin_all" ON public.hsk_exams
  FOR ALL
  USING (public.is_admin());

-- 6. Chính sách RLS cho hsk_questions
-- Để ngăn chặn lộ đáp án qua direct Supabase query từ browser,
-- chỉ admin được query trực tiếp toàn bộ bảng hsk_questions.
-- Khách vãng lai và học viên truy xuất câu hỏi thông qua API hoặc View bảo mật đã bóc đáp án.
CREATE POLICY "hsk_questions_admin_all" ON public.hsk_questions
  FOR ALL
  USING (public.is_admin());

-- Tạo VIEW bảo mật dành riêng cho client lấy câu hỏi làm bài (ĐÃ TƯỚC BỎ correct_option_index & explanation)
CREATE OR REPLACE VIEW public.v_hsk_questions_public AS
  SELECT 
    id,
    exam_id,
    part_type,
    part_number,
    question_number,
    prompt,
    pinyin,
    translation,
    audio_url,
    audio_script,
    options,
    points
  FROM public.hsk_questions;

-- 7. Chính sách RLS cho hsk_attempts
-- Cho phép bất kỳ ai (kể cả khách vãng lai) gửi bài làm vào bảng attempts
CREATE POLICY "hsk_attempts_insert_public" ON public.hsk_attempts
  FOR INSERT
  WITH CHECK (true);

-- Người dùng đã đăng nhập xem được bài làm của mình; khách vãng lai xem qua anonymous_session_id
CREATE POLICY "hsk_attempts_select_owner" ON public.hsk_attempts
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
    OR
    public.is_admin()
  );

-- Bài thi đã nộp là bản ghi bất biến (immutable audit record), không ai được sửa điểm
CREATE POLICY "hsk_attempts_no_update" ON public.hsk_attempts
  FOR UPDATE
  USING (public.is_admin());
