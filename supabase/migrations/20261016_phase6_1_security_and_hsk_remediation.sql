-- =========================================================================
-- HANZIGO MIGRATION: PHASE 6.1 - SECURITY REMEDIATION & IDENTITY BINDING
-- Migration: 20261016_phase6_1_security_and_hsk_remediation.sql
-- Description:
-- 1. SEC-01: Enforces caller identity in atomic_join_live_session (binds p_user_id = auth.uid())
-- 2. SEC-02: Revokes direct SELECT on hsk_questions to prevent answer leakage; secures v_hsk_questions_public
-- 3. SEC-03: Restricts hsk_attempts and hsk_mistakes RLS to prevent cross-account guest access
-- 4. Idempotent & non-destructive: Safe to run repeatedly without data loss.
-- =========================================================================

-- =========================================================================
-- 1. SEC-01: SECURING ATOMIC JOIN LIVE SESSION RPC
-- =========================================================================

CREATE OR REPLACE FUNCTION public.atomic_join_live_session(
  p_session_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'student',
  p_attendance_status TEXT DEFAULT 'present'
)
RETURNS JSONB AS $$
DECLARE
  v_session RECORD;
  v_active_count INT;
  v_participant RECORD;
  v_mic_allowed BOOLEAN := false;
BEGIN
  -- ZERO-TRUST IDENTITY BINDING:
  -- When called directly by an authenticated user, p_user_id MUST match auth.uid().
  -- This prevents malicious callers from spoofing attendance or stealing slots for other users.
  IF auth.role() = 'authenticated' THEN
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tham gia phòng học thay mặt người dùng khác.';
    END IF;
  END IF;

  -- Row-level lock on the session to serialize concurrent joins
  SELECT * INTO v_session
  FROM public.class_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Phòng học trực tuyến không tồn tại.';
  END IF;

  IF v_session.status = 'ended' OR v_session.ended_at IS NOT NULL THEN
    RAISE EXCEPTION 'Phiên học trực tuyến đã kết thúc.';
  END IF;

  -- Verify teacher vs student
  IF v_session.teacher_id = p_user_id THEN
    p_role := 'teacher';
    v_mic_allowed := true;
  ELSE
    p_role := 'student';

    -- Verify active student membership in the classroom
    IF NOT EXISTS (
      SELECT 1 FROM public.class_members
      WHERE classroom_id = v_session.classroom_id
        AND student_id = p_user_id
        AND status = 'active'
    ) THEN
      RAISE EXCEPTION 'Bạn chưa tham gia lớp học này.';
    END IF;

    -- Check active student count excluding teachers and reconnecting user
    SELECT COUNT(*) INTO v_active_count
    FROM public.session_participants
    WHERE session_id = p_session_id
      AND left_at IS NULL
      AND role != 'teacher'
      AND user_id != p_user_id;

    IF v_active_count >= COALESCE(v_session.max_capacity, 50) THEN
      RAISE EXCEPTION 'Phòng học đã đạt sĩ số tối đa (% học viên).', COALESCE(v_session.max_capacity, 50);
    END IF;

    -- Preserve existing mic permission if already granted
    SELECT is_mic_allowed INTO v_mic_allowed
    FROM public.session_participants
    WHERE session_id = p_session_id AND user_id = p_user_id;
    v_mic_allowed := COALESCE(v_mic_allowed, false);
  END IF;

  -- Upsert participant record
  INSERT INTO public.session_participants (
    session_id, user_id, role, joined_at, left_at, is_mic_allowed, attendance_status
  ) VALUES (
    p_session_id, p_user_id, p_role, NOW(), NULL, v_mic_allowed, p_attendance_status
  )
  ON CONFLICT (session_id, user_id) DO UPDATE SET
    left_at = NULL,
    joined_at = NOW(),
    role = EXCLUDED.role,
    attendance_status = EXCLUDED.attendance_status
  RETURNING * INTO v_participant;

  RETURN to_jsonb(v_participant);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Configure execution privileges
REVOKE EXECUTE ON FUNCTION public.atomic_join_live_session(UUID, UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.atomic_join_live_session(UUID, UUID, TEXT, TEXT) TO authenticated, service_role;


-- =========================================================================
-- 2. SEC-02: PREVENTING HSK EXAM ANSWER & EXPLANATION LEAKAGE
-- =========================================================================

-- Recreate sanitized public view with security definer semantics (security_invoker = false)
DROP VIEW IF EXISTS public.v_hsk_questions_public CASCADE;

CREATE VIEW public.v_hsk_questions_public
WITH (security_invoker = false) AS
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

-- Grant access on sanitized view
GRANT SELECT ON public.v_hsk_questions_public TO anon, authenticated, service_role;

-- Revoke direct SELECT on hsk_questions base table to prevent answer scraping
DROP POLICY IF EXISTS "hsk_questions_read_published" ON public.hsk_questions;
DROP POLICY IF EXISTS "hsk_questions_admin_all" ON public.hsk_questions;
DROP POLICY IF EXISTS "hsk_questions_admin_and_service_only" ON public.hsk_questions;

CREATE POLICY "hsk_questions_admin_and_service_only" 
  ON public.hsk_questions 
  FOR ALL 
  USING (public.is_admin());

-- Explicitly revoke table-level SELECT on base table from client roles
REVOKE SELECT ON TABLE public.hsk_questions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hsk_questions TO service_role;


-- =========================================================================
-- 3. SEC-03: PREVENTING CROSS-ACCOUNT GUEST IDOR ON ATTEMPTS & MISTAKES
-- =========================================================================

-- 3.1. hsk_attempts policies
DROP POLICY IF EXISTS "hsk_attempts_select_owner" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_select_owner" 
  ON public.hsk_attempts 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "hsk_attempts_insert_public" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_insert_public" 
  ON public.hsk_attempts 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "hsk_attempts_no_update" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_no_update" 
  ON public.hsk_attempts 
  FOR UPDATE 
  USING (public.is_admin());

DROP POLICY IF EXISTS "hsk_attempts_admin_delete" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_admin_delete" 
  ON public.hsk_attempts 
  FOR DELETE 
  USING (public.is_admin());

-- 3.2. hsk_mistakes policies
DROP POLICY IF EXISTS "hsk_mistakes_select_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_select_owner" 
  ON public.hsk_mistakes 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "hsk_mistakes_insert_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_insert_owner" 
  ON public.hsk_mistakes 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "hsk_mistakes_update_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_update_owner" 
  ON public.hsk_mistakes 
  FOR UPDATE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "hsk_mistakes_delete_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_delete_owner" 
  ON public.hsk_mistakes 
  FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );
