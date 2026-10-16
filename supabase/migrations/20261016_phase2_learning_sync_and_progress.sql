-- =========================================================================
-- HANZIGO MIGRATION: PHASE 2 - LEARNING DATA INTEGRITY, SYNC & CROSS-DEVICE
-- =========================================================================

-- 1. Đảm bảo bảng user_journey_progress có trường lưu chi tiết kết quả bài học (stars, score, completedAt)
ALTER TABLE public.user_journey_progress 
  ADD COLUMN IF NOT EXISTS lesson_details JSONB DEFAULT '{}'::jsonb;

-- 2. Đảm bảo các chỉ mục tối ưu truy vấn tiến độ học tập và chống nhân đôi bản ghi
CREATE INDEX IF NOT EXISTS idx_user_journey_progress_uid 
  ON public.user_journey_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_uid_lid 
  ON public.user_lesson_progress(user_id, lesson_id);

CREATE INDEX IF NOT EXISTS idx_user_vocab_srs_uid_hanzi 
  ON public.user_vocab_srs(user_id, hanzi);

-- 3. Cập nhật và siết chặt chính sách RLS cho các bảng học tập cá nhân
-- 3.1. user_journey_progress
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_journey_select_owner" ON public.user_journey_progress;
CREATE POLICY "user_journey_select_owner" ON public.user_journey_progress
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_journey_insert_owner" ON public.user_journey_progress;
CREATE POLICY "user_journey_insert_owner" ON public.user_journey_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_journey_update_owner" ON public.user_journey_progress;
CREATE POLICY "user_journey_update_owner" ON public.user_journey_progress
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin()) 
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3.2. user_lesson_progress
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_lesson_select_owner" ON public.user_lesson_progress;
CREATE POLICY "user_lesson_select_owner" ON public.user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_lesson_insert_owner" ON public.user_lesson_progress;
CREATE POLICY "user_lesson_insert_owner" ON public.user_lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_lesson_update_owner" ON public.user_lesson_progress;
CREATE POLICY "user_lesson_update_owner" ON public.user_lesson_progress
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin()) 
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3.3. user_vocab_srs
ALTER TABLE public.user_vocab_srs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_vocab_srs_select_owner" ON public.user_vocab_srs;
CREATE POLICY "user_vocab_srs_select_owner" ON public.user_vocab_srs
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_vocab_srs_insert_owner" ON public.user_vocab_srs;
CREATE POLICY "user_vocab_srs_insert_owner" ON public.user_vocab_srs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_vocab_srs_update_owner" ON public.user_vocab_srs;
CREATE POLICY "user_vocab_srs_update_owner" ON public.user_vocab_srs
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin()) 
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 4. Bảng nội dung bài học: Công khai đọc cho mọi người, chỉ Admin/Service Role mới được ghi
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "learning_lessons_read_all" ON public.learning_lessons;
CREATE POLICY "learning_lessons_read_all" ON public.learning_lessons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "learning_lessons_admin_manage" ON public.learning_lessons;
CREATE POLICY "learning_lessons_admin_manage" ON public.learning_lessons
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
