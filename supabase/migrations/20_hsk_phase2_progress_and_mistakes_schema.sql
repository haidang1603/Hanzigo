-- =========================================================================
-- MIGRATION 20: HSK PHASE 2 LEARNING PROGRESS, HISTORY & MISTAKES NOTEBOOK
-- =========================================================================
-- Quản lý sổ tay câu hỏi sai (mistakes notebook), hỗ trợ lưu trữ trạng thái
-- ôn tập (needs_review / mastered), số lần làm sai, và phân quyền RLS an toàn.
-- =========================================================================

-- 1. Bảng sổ tay câu hỏi làm sai (hsk_mistakes)
CREATE TABLE IF NOT EXISTS public.hsk_mistakes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable cho khách vãng lai
  anonymous_session_id TEXT, -- Định danh phiên ẩn danh
  question_id TEXT NOT NULL,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'HSK 1',
  part_type TEXT NOT NULL DEFAULT 'general', -- 'listening', 'reading', 'writing', 'grammar', 'vocabulary'
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

-- Chỉ mục tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_user ON public.hsk_mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_session ON public.hsk_mistakes(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_question ON public.hsk_mistakes(question_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_status ON public.hsk_mistakes(status);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_level ON public.hsk_mistakes(level);

-- Chỉ mục đảm bảo loại trừ trùng lặp (Deduplication) theo người dùng hoặc session
CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_user_question 
  ON public.hsk_mistakes(user_id, question_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_session_question 
  ON public.hsk_mistakes(anonymous_session_id, question_id) 
  WHERE anonymous_session_id IS NOT NULL AND user_id IS NULL;

-- 2. Bật Row Level Security (RLS)
ALTER TABLE public.hsk_mistakes ENABLE ROW LEVEL SECURITY;

-- 3. Chính sách RLS cho hsk_mistakes
-- Người dùng đã đăng nhập chỉ xem câu sai của chính mình; khách vãng lai xem theo anonymous_session_id
CREATE POLICY "hsk_mistakes_select_owner" ON public.hsk_mistakes
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
    OR
    public.is_admin()
  );

-- Thêm câu sai vào sổ tay
CREATE POLICY "hsk_mistakes_insert_owner" ON public.hsk_mistakes
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
    OR
    public.is_admin()
  );

-- Cập nhật trạng thái câu sai (đánh dấu đã hiểu / cần ôn lại)
CREATE POLICY "hsk_mistakes_update_owner" ON public.hsk_mistakes
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
    OR
    public.is_admin()
  );

-- Xóa câu sai khỏi sổ tay
CREATE POLICY "hsk_mistakes_delete_owner" ON public.hsk_mistakes
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
    OR
    public.is_admin()
  );
