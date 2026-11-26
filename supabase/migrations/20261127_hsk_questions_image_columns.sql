-- =========================================================================
-- HANZIGO: ADDITIVE IMAGE ASSET COLUMNS FOR public.hsk_questions
-- =========================================================================
-- Hỗ trợ đồng bộ đường dẫn tranh ảnh cục bộ (/images/hsk/...) từ kho đề
-- sang Supabase, cập nhật VIEW công khai v_hsk_questions_public và mở quyền
-- Column-Level SELECT cho anon & authenticated (giữ nguyên ẩn đáp án).

ALTER TABLE public.hsk_questions
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS image_alt TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS option_images JSONB DEFAULT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hsk_questions_image_url_local_check'
  ) THEN
    ALTER TABLE public.hsk_questions
      ADD CONSTRAINT hsk_questions_image_url_local_check
      CHECK (image_url IS NULL OR image_url LIKE '/images/hsk/%');
  END IF;
END $$;

CREATE OR REPLACE VIEW public.v_hsk_questions_public
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
    q.points,
    q.image_url,
    q.image_alt,
    q.option_images
  FROM public.hsk_questions q
  JOIN public.hsk_exams e ON e.id = q.exam_id
  WHERE e.is_published = true;

GRANT SELECT (image_url, image_alt, option_images)
  ON TABLE public.hsk_questions TO anon, authenticated;

GRANT SELECT ON public.v_hsk_questions_public TO anon, authenticated, service_role;
