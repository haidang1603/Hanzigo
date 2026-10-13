-- =========================================================================
-- HANZIGO - FIX SUPABASE DATABASE SECURITY LINTER WARNINGS
-- =========================================================================
-- 1. Sửa cảnh báo "user_metadata" trên bảng public.hsk_resources:
--    Thay thế việc đọc user_metadata bằng hàm public.is_admin() an toàn.
--
-- 2. Sửa cảnh báo "SECURITY DEFINER" trên View public.v_hsk_questions_public:
--    Thiết lập rõ ràng security_invoker = true theo khuyến nghị của Supabase.
-- =========================================================================

-- 1. Khắc phục bảng public.hsk_resources
DROP POLICY IF EXISTS "Admins full access on learning resources" ON public.hsk_resources;

CREATE POLICY "Admins full access on learning resources" 
ON public.hsk_resources 
FOR ALL 
USING (
  public.is_admin() OR 
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
);

-- 2. Khắc phục View public.v_hsk_questions_public
-- Tái tạo view với thuộc tính WITH (security_invoker = true)
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

-- Cấp quyền đọc câu hỏi cho học viên trên các bài thi đã xuất bản
DROP POLICY IF EXISTS "hsk_questions_read_published" ON public.hsk_questions;

CREATE POLICY "hsk_questions_read_published" 
ON public.hsk_questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.hsk_exams 
    WHERE id = hsk_questions.exam_id AND is_published = true
  ) OR public.is_admin()
);
