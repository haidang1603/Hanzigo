-- =========================================================================
-- MIGRATION: 20261112_student_analytics_rpc.sql
-- HanziGo Phase 26 / Task 26.02: Student Analytics Dashboard RPCs & Views
-- Consumes learning_telemetry_events & user_mistake_records from Task 26.01
-- =========================================================================

-- 1. SECURE DAILY SUMMARY VIEW (respects caller RLS via security_invoker)
CREATE OR REPLACE VIEW public.student_telemetry_daily_summary
WITH (security_invoker = true) AS
SELECT
  user_id,
  DATE(created_at AT TIME ZONE 'UTC') AS activity_date,
  SUM(duration_ms)::BIGINT AS total_duration_ms,
  COUNT(*)::INT AS items_reviewed,
  COUNT(*) FILTER (WHERE is_correct = true)::INT AS correct_count,
  ROUND(
    (COUNT(*) FILTER (WHERE is_correct = true)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    1
  ) AS accuracy_rate
FROM public.learning_telemetry_events
GROUP BY user_id, DATE(created_at AT TIME ZONE 'UTC');

-- 2. RPC: get_student_skill_radar(p_user_id UUID, p_hsk_level INT)
-- Returns normalized proficiency (0-100) across Listening, Reading, Writing,
-- Vocabulary, Grammar, and Character Strokes.
CREATE OR REPLACE FUNCTION public.get_student_skill_radar(
  p_user_id UUID,
  p_hsk_level INT DEFAULT 1
)
RETURNS TABLE (
  skill_key TEXT,
  skill_label TEXT,
  proficiency NUMERIC,
  target_benchmark NUMERIC,
  attempts_count INT,
  last_practiced_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := COALESCE(p_user_id, auth.uid());
  v_hsk INT := GREATEST(1, LEAST(9, COALESCE(p_hsk_level, 1)));
  v_benchmark NUMERIC := CASE
    WHEN v_hsk <= 2 THEN 75
    WHEN v_hsk <= 4 THEN 80
    ELSE 85
  END;
BEGIN
  IF auth.uid() IS NOT NULL AND v_uid IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: cannot inspect another user telemetry';
  END IF;

  RETURN QUERY
  WITH canonical_skills AS (
    SELECT * FROM (VALUES
      ('listening',    'Nghe hiểu'),
      ('reading',      'Đọc hiểu'),
      ('writing',      'Viết & Dịch'),
      ('vocabulary',   'Từ vựng'),
      ('grammar',      'Ngữ pháp'),
      ('stroke_order', 'Nét chữ Hán')
    ) AS s(skill_key, skill_label)
  ),
  mapped_events AS (
    SELECT
      CASE
        WHEN e.skill_domain IN ('writing', 'translation') THEN 'writing'
        WHEN e.skill_domain = 'speaking' THEN 'listening'
        ELSE e.skill_domain::TEXT
      END AS norm_skill,
      CASE
        WHEN e.score_max > 0 THEN LEAST(100, GREATEST(0, (e.score_earned / e.score_max) * 100))
        WHEN e.is_correct THEN 100
        ELSE 0
      END AS norm_score,
      e.created_at
    FROM public.learning_telemetry_events e
    WHERE e.user_id = v_uid
      AND e.hsk_level = v_hsk
  ),
  aggregated AS (
    SELECT
      norm_skill,
      ROUND(AVG(norm_score), 1) AS avg_score,
      COUNT(*)::INT AS cnt,
      MAX(created_at) AS last_at
    FROM mapped_events
    GROUP BY norm_skill
  )
  SELECT
    cs.skill_key,
    cs.skill_label,
    COALESCE(agg.avg_score, 0)::NUMERIC AS proficiency,
    v_benchmark AS target_benchmark,
    COALESCE(agg.cnt, 0)::INT AS attempts_count,
    agg.last_at AS last_practiced_at
  FROM canonical_skills cs
  LEFT JOIN aggregated agg ON agg.norm_skill = cs.skill_key;
END;
$$;

-- 3. RPC: get_study_activity_heatmap(p_user_id UUID, p_days INT)
-- Returns daily study time (duration_ms), items reviewed, and accuracy rate
-- over the last 90 / 180 days.
CREATE OR REPLACE FUNCTION public.get_study_activity_heatmap(
  p_user_id UUID,
  p_days INT DEFAULT 90
)
RETURNS TABLE (
  activity_date DATE,
  total_duration_ms BIGINT,
  items_reviewed INT,
  correct_count INT,
  accuracy_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := COALESCE(p_user_id, auth.uid());
  v_days INT := GREATEST(1, LEAST(365, COALESCE(p_days, 90)));
  v_start_date DATE := (NOW() AT TIME ZONE 'UTC')::DATE - (v_days - 1);
  v_end_date DATE := (NOW() AT TIME ZONE 'UTC')::DATE;
BEGIN
  IF auth.uid() IS NOT NULL AND v_uid IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: cannot inspect another user heatmap';
  END IF;

  RETURN QUERY
  WITH day_series AS (
    SELECT generate_series(v_start_date, v_end_date, INTERVAL '1 day')::DATE AS d
  ),
  daily_agg AS (
    SELECT
      DATE(e.created_at AT TIME ZONE 'UTC') AS d,
      SUM(e.duration_ms)::BIGINT AS total_ms,
      COUNT(*)::INT AS total_items,
      COUNT(*) FILTER (WHERE e.is_correct = true)::INT AS ok_items
    FROM public.learning_telemetry_events e
    WHERE e.user_id = v_uid
      AND DATE(e.created_at AT TIME ZONE 'UTC') >= v_start_date
    GROUP BY DATE(e.created_at AT TIME ZONE 'UTC')
  )
  SELECT
    ds.d AS activity_date,
    COALESCE(da.total_ms, 0)::BIGINT AS total_duration_ms,
    COALESCE(da.total_items, 0)::INT AS items_reviewed,
    COALESCE(da.ok_items, 0)::INT AS correct_count,
    CASE
      WHEN COALESCE(da.total_items, 0) > 0
        THEN ROUND((da.ok_items::NUMERIC / da.total_items) * 100, 1)
      ELSE 0
    END AS accuracy_rate
  FROM day_series ds
  LEFT JOIN daily_agg da ON da.d = ds.d
  ORDER BY ds.d ASC;
END;
$$;

-- 4. RPC: get_top_error_patterns(p_user_id UUID, p_limit INT)
-- Aggregates user_mistake_records by error_category with resolution trends.
CREATE OR REPLACE FUNCTION public.get_top_error_patterns(
  p_user_id UUID,
  p_limit INT DEFAULT 7
)
RETURNS TABLE (
  error_category public.learning_error_category,
  total_occurrences BIGINT,
  active_count INT,
  reviewing_count INT,
  mastered_count INT,
  resolution_rate NUMERIC,
  last_mistake_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := COALESCE(p_user_id, auth.uid());
  v_limit INT := GREATEST(1, LEAST(20, COALESCE(p_limit, 7)));
BEGIN
  IF auth.uid() IS NOT NULL AND v_uid IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: cannot inspect another user mistake patterns';
  END IF;

  RETURN QUERY
  SELECT
    m.error_category,
    SUM(m.occurrence_count)::BIGINT AS total_occurrences,
    COUNT(*) FILTER (WHERE m.resolved_status = 'active')::INT AS active_count,
    COUNT(*) FILTER (WHERE m.resolved_status = 'reviewing')::INT AS reviewing_count,
    COUNT(*) FILTER (WHERE m.resolved_status = 'mastered')::INT AS mastered_count,
    ROUND(
      (COUNT(*) FILTER (WHERE m.resolved_status = 'mastered')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
      1
    ) AS resolution_rate,
    MAX(m.last_mistake_at) AS last_mistake_at
  FROM public.user_mistake_records m
  WHERE m.user_id = v_uid
  GROUP BY m.error_category
  ORDER BY active_count DESC, total_occurrences DESC
  LIMIT v_limit;
END;
$$;

