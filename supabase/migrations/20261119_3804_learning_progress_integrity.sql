-- =========================================================================
-- MIGRATION: 20261119_3804_learning_progress_integrity.sql
-- Phase 38 / Task 38.04: Learning Progress Integrity & UTC+7 Standardization
--
-- Backward-compatible migration:
--   1. Adds `lapse_count` column to `public.user_vocab_srs` (IF NOT EXISTS).
--   2. Standardizes analytics & telemetry date grouping to `Asia/Ho_Chi_Minh` (UTC+7).
--
-- IMPORTANT: DO NOT RUN AUTOMATICALLY ON PRODUCTION WITHOUT REVIEW.
-- =========================================================================

-- 1. Preserve SRS lapse_count in user_vocab_srs (DQ-HIGH-04)
ALTER TABLE public.user_vocab_srs
  ADD COLUMN IF NOT EXISTS lapse_count INT NOT NULL DEFAULT 0;

-- 2. Standardize student_telemetry_daily_summary to Asia/Ho_Chi_Minh (DQ-HIGH-05)
CREATE OR REPLACE VIEW public.student_telemetry_daily_summary
WITH (security_invoker = true) AS
SELECT
  user_id,
  DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS activity_date,
  SUM(duration_ms)::BIGINT AS total_duration_ms,
  COUNT(*)::INT AS items_reviewed,
  COUNT(*) FILTER (WHERE is_correct = true)::INT AS correct_count,
  ROUND(
    (COUNT(*) FILTER (WHERE is_correct = true)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    1
  ) AS accuracy_rate
FROM public.learning_telemetry_events
GROUP BY user_id, DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh');

-- 3. Standardize get_student_activity_heatmap to Asia/Ho_Chi_Minh (DQ-HIGH-05)
CREATE OR REPLACE FUNCTION public.get_student_activity_heatmap(
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
  v_today_vn DATE := (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
  v_start_date DATE := v_today_vn - (v_days - 1);
  v_end_date DATE := v_today_vn;
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
      DATE(e.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS d,
      SUM(e.duration_ms)::BIGINT AS total_ms,
      COUNT(*)::INT AS total_items,
      COUNT(*) FILTER (WHERE e.is_correct = true)::INT AS ok_items
    FROM public.learning_telemetry_events e
    WHERE e.user_id = v_uid
      AND DATE(e.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') >= v_start_date
    GROUP BY DATE(e.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
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

-- 4. Standardize get_user_telemetry_dashboard_summary to Asia/Ho_Chi_Minh (DQ-HIGH-05)
CREATE OR REPLACE FUNCTION public.get_user_telemetry_dashboard_summary(
    p_user_id UUID DEFAULT NULL,
    p_days INT DEFAULT 14
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := COALESCE(p_user_id, auth.uid());
    v_days INT := GREATEST(1, LEAST(90, COALESCE(p_days, 14)));
    v_today_vn DATE := (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
    v_since TIMESTAMPTZ := NOW() - make_interval(days => v_days);
    v_since_7d TIMESTAMPTZ := NOW() - INTERVAL '7 days';
    v_streak_days INT := 0;
    v_active_minutes_7d NUMERIC := 0;
    v_events_count_7d INT := 0;
    v_retention_rate_pct NUMERIC := 0;
    v_avg_latency JSONB := '{}'::jsonb;
    v_bottlenecks JSONB := '[]'::jsonb;
    v_srs_forecast JSONB := '[]'::jsonb;
BEGIN
    IF auth.uid() IS NOT NULL AND v_uid IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'Forbidden: cannot inspect another user telemetry dashboard';
    END IF;

    -- Streak, 7d active minutes & 7d event count (UTC+7 / Asia/Ho_Chi_Minh)
    WITH active_dates AS (
        SELECT DISTINCT DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS d
        FROM public.user_learning_telemetry_events
        WHERE user_id = v_uid
          AND created_at >= v_since
    ),
    numbered_dates AS (
        SELECT
            d,
            (v_today_vn - d) AS diff_days,
            ROW_NUMBER() OVER (ORDER BY d DESC) - 1 AS rn
        FROM active_dates
        WHERE d <= v_today_vn
    )
    SELECT
        COALESCE(COUNT(*) FILTER (WHERE diff_days = rn OR diff_days = rn + 1), 0)::INT
    INTO v_streak_days
    FROM numbered_dates;

    SELECT
        COALESCE(COUNT(*), 0)::INT,
        COALESCE(
            ROUND(
                SUM(LEAST(COALESCE(latency_ms, 8000), 120000)) / 60000.0,
                1
            ),
            0
        )
    INTO v_events_count_7d, v_active_minutes_7d
    FROM public.user_learning_telemetry_events
    WHERE user_id = v_uid
      AND created_at >= v_since_7d;

    -- Retention rate across window
    SELECT
        COALESCE(
            ROUND(
                (COUNT(*) FILTER (WHERE is_correct = true)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
                1
            ),
            0
        )
    INTO v_retention_rate_pct
    FROM public.user_learning_telemetry_events
    WHERE user_id = v_uid
      AND created_at >= v_since;

    -- Average latency per module
    SELECT COALESCE(jsonb_object_agg(t.event_type, t.avg_ms), '{}'::jsonb)
    INTO v_avg_latency
    FROM (
        SELECT
            event_type,
            ROUND(AVG(COALESCE(latency_ms, 0)))::INT AS avg_ms
        FROM public.user_learning_telemetry_events
        WHERE user_id = v_uid
          AND created_at >= v_since
          AND latency_ms IS NOT NULL
        GROUP BY event_type
    ) t;

    -- Top cognitive bottlenecks
    SELECT COALESCE(jsonb_agg(row_to_json(b)), '[]'::jsonb)
    INTO v_bottlenecks
    FROM (
        SELECT
            item_id,
            event_type,
            COUNT(*) FILTER (WHERE is_correct = false)::INT AS error_count,
            COUNT(*)::INT AS total_attempts,
            ROUND(AVG(COALESCE(latency_ms, 0)))::INT AS avg_latency_ms
        FROM public.user_learning_telemetry_events
        WHERE user_id = v_uid
          AND created_at >= v_since
          AND item_id IS NOT NULL
        GROUP BY item_id, event_type
        HAVING COUNT(*) FILTER (WHERE is_correct = false) > 0
        ORDER BY error_count DESC, avg_latency_ms DESC
        LIMIT 8
    ) b;

    -- 7-day SRS forecast from user_vocab_items (UTC+7 / Asia/Ho_Chi_Minh)
    IF to_regclass('public.user_vocab_items') IS NOT NULL THEN
        SELECT COALESCE(jsonb_agg(row_to_json(f) ORDER BY f.day_offset), '[]'::jsonb)
        INTO v_srs_forecast
        FROM (
            SELECT
                gs.day_offset,
                (v_today_vn + gs.day_offset)::TEXT AS forecast_date,
                COALESCE(COUNT(v.id), 0)::INT AS due_count
            FROM generate_series(0, 6) AS gs(day_offset)
            LEFT JOIN public.user_vocab_items v
                ON v.user_id = v_uid
                AND DATE(v.next_review_at AT TIME ZONE 'Asia/Ho_Chi_Minh') = (v_today_vn + gs.day_offset)
            GROUP BY gs.day_offset
        ) f;
    END IF;

    RETURN jsonb_build_object(
        'user_id', v_uid,
        'window_days', v_days,
        'study_streak_days', v_streak_days,
        'total_active_minutes_7d', v_active_minutes_7d,
        'events_count_7d', v_events_count_7d,
        'retention_rate_pct', v_retention_rate_pct,
        'avg_response_latency_ms', v_avg_latency,
        'top_cognitive_bottlenecks', v_bottlenecks,
        'srs_forecast_7d', v_srs_forecast,
        'generated_at', NOW()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_telemetry_dashboard_summary(UUID, INT) TO authenticated;

-- =========================================================================
-- ROLLBACK GUIDE (Manual only if reverting Task 38.04):
--   1. Re-run `supabase/migrations/20261112_student_analytics_rpc.sql` and
--      `supabase/migrations/20261117_3801_learning_telemetry_hub.sql` to restore
--      UTC-based view & RPC definitions.
--   2. Optionally drop `lapse_count` (WARNING: drops column data):
--      ALTER TABLE public.user_vocab_srs DROP COLUMN IF EXISTS lapse_count;
-- =========================================================================
