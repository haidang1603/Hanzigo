-- =========================================================================
-- HANZI GO - ADMIN DASHBOARD SUMMARY RPC (ADDITIVE MIGRATION)
-- =========================================================================
-- SECURITY DEFINER + SET search_path = public, pg_temp
-- Strictly enforces Admin authorization at database level.

CREATE OR REPLACE FUNCTION public.admin_get_dashboard_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_total_users BIGINT := 0;
  v_active_learners_7d BIGINT := 0;
  v_total_hsk_attempts BIGINT := 0;
  v_hsk20_attempts BIGINT := 0;
  v_hsk30_attempts BIGINT := 0;
  v_community_posts BIGINT := 0;
  v_open_reports BIGINT := 0;
  v_client_errors_24h BIGINT := 0;
  v_materials_count BIGINT := 0;
  v_hsk20_questions BIGINT := 0;
  v_hsk30_questions BIGINT := 0;
  v_hsk15_total_questions BIGINT := 0;
  v_hsk15_image_questions BIGINT := 0;
BEGIN
  IF NOT (auth.role() = 'service_role' OR public.is_admin()) THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Quản trị viên mới có quyền truy cập.'
      USING ERRCODE = '42501';
  END IF;

  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  SELECT COUNT(*) INTO v_active_learners_7d
  FROM public.profiles
  WHERE updated_at >= (NOW() - INTERVAL '7 days');

  SELECT
    COUNT(*),
    COUNT(*) FILTER (
      WHERE COALESCE(e.exam_version, '') ILIKE '%3.0%'
         OR a.exam_id ILIKE '%hsk30%'
         OR COALESCE(e.level, '') LIKE '%7%'
    ),
    COUNT(*) FILTER (
      WHERE NOT (
        COALESCE(e.exam_version, '') ILIKE '%3.0%'
        OR a.exam_id ILIKE '%hsk30%'
        OR COALESCE(e.level, '') LIKE '%7%'
      )
    )
  INTO v_total_hsk_attempts, v_hsk30_attempts, v_hsk20_attempts
  FROM public.hsk_attempts a
  LEFT JOIN public.hsk_exams e ON e.id = a.exam_id;

  SELECT COUNT(*) INTO v_community_posts
  FROM public.community_posts
  WHERE COALESCE(status, 'published') <> 'deleted';

  SELECT COUNT(*) INTO v_open_reports
  FROM public.community_reports
  WHERE status IN ('pending', 'reviewing');

  SELECT COUNT(*) INTO v_materials_count
  FROM public.materials;

  SELECT
    COUNT(*) FILTER (
      WHERE NOT (
        COALESCE(e.exam_version, '') ILIKE '%3.0%'
        OR e.id ILIKE '%hsk30%'
        OR COALESCE(e.level, '') LIKE '%7%'
      )
    ),
    COUNT(*) FILTER (
      WHERE COALESCE(e.exam_version, '') ILIKE '%3.0%'
         OR e.id ILIKE '%hsk30%'
         OR COALESCE(e.level, '') LIKE '%7%'
    ),
    COUNT(*) FILTER (WHERE COALESCE(e.level, '') ~* 'HSK\s*[1-5](\D|$)'),
    COUNT(*) FILTER (
      WHERE COALESCE(e.level, '') ~* 'HSK\s*[1-5](\D|$)'
        AND q.image_url IS NOT NULL
    )
  INTO v_hsk20_questions, v_hsk30_questions, v_hsk15_total_questions, v_hsk15_image_questions
  FROM public.hsk_questions q
  JOIN public.hsk_exams e ON e.id = q.exam_id;

  IF to_regclass('public.client_error_logs') IS NOT NULL THEN
    SELECT COUNT(*) INTO v_client_errors_24h
    FROM public.client_error_logs
    WHERE created_at >= (NOW() - INTERVAL '24 hours');
  END IF;

  RETURN jsonb_build_object(
    'totalUsers', COALESCE(v_total_users, 0),
    'activeLearners7d', COALESCE(v_active_learners_7d, 0),
    'totalHskAttempts', COALESCE(v_total_hsk_attempts, 0),
    'hsk20Attempts', COALESCE(v_hsk20_attempts, 0),
    'hsk30Attempts', COALESCE(v_hsk30_attempts, 0),
    'communityPostsCount', COALESCE(v_community_posts, 0),
    'openReportsCount', COALESCE(v_open_reports, 0),
    'clientErrors24h', COALESCE(v_client_errors_24h, 0),
    'materialsCount', COALESCE(v_materials_count, 0),
    'hsk20QuestionsCount', COALESCE(v_hsk20_questions, 0),
    'hsk30QuestionsCount', COALESCE(v_hsk30_questions, 0),
    'hsk15TotalQuestions', COALESCE(v_hsk15_total_questions, 0),
    'hsk15ImageQuestions', COALESCE(v_hsk15_image_questions, 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_dashboard_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_dashboard_summary() TO authenticated, service_role;
