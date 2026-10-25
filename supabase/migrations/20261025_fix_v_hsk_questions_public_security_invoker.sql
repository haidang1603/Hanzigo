-- =========================================================================
-- HANZIGO — MIGRATION: RESOLVE SUPABASE LINTER VIEW SECURITY DEFINER WARNING
-- =========================================================================
-- Entity: public.v_hsk_questions_public
-- Issue: View defined with SECURITY DEFINER (security_invoker = false)
-- Resolution:
--   1. Recreate v_hsk_questions_public WITH (security_invoker = true).
--   2. Enforce Column-Level Security (CLS) on public.hsk_questions so that
--      anon & authenticated can only read safe fields (excluding correct_option_index,
--      explanation, correct_order, accepted_answers).
--   3. Apply Row Level Security (RLS) policy restricting reads to published exams only.
-- =========================================================================

-- 1. Recreate the sanitized view with security_invoker = true
DROP VIEW IF EXISTS public.v_hsk_questions_public CASCADE;

CREATE VIEW public.v_hsk_questions_public
WITH (security_invoker = true) AS
  SELECT 
    q.id,
    q.exam_id,
    q.part_type,
    q.part_number,
    q.question_number,
    q.question_type,
    q.prompt,
    q.pinyin,
    q.translation,
    q.audio_url,
    q.audio_script,
    q.options,
    q.words,
    q.writing_criteria,
    q.min_words,
    q.max_words,
    q.points
  FROM public.hsk_questions q
  JOIN public.hsk_exams e ON e.id = q.exam_id
  WHERE e.is_published = true;

-- Grant access on sanitized view to client roles
GRANT SELECT ON public.v_hsk_questions_public TO anon, authenticated, service_role;

-- 2. Column-Level Grant: Grant SELECT ONLY on safe columns to anon & authenticated
-- (Precludes any scraping of correct_option_index, explanation, correct_order, accepted_answers)
REVOKE ALL ON TABLE public.hsk_questions FROM anon, authenticated;

GRANT SELECT (
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
) ON TABLE public.hsk_questions TO anon, authenticated;

-- Service role retains full access
GRANT ALL ON TABLE public.hsk_questions TO service_role;

-- 3. Row Level Security Policy on hsk_questions for published exams
ALTER TABLE public.hsk_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hsk_questions_read_published" ON public.hsk_questions;
CREATE POLICY "hsk_questions_read_published" 
  ON public.hsk_questions 
  FOR SELECT 
  TO anon, authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.hsk_exams e 
      WHERE e.id = hsk_questions.exam_id AND e.is_published = true
    )
  );

-- Admins retain full CRUD via is_admin()
DROP POLICY IF EXISTS "hsk_questions_admin_all" ON public.hsk_questions;
CREATE POLICY "hsk_questions_admin_all" 
  ON public.hsk_questions 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
