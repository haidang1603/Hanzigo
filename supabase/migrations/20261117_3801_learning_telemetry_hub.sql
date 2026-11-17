-- ============================================================================
-- TASK 38.01: Learning Telemetry Hub & Real-Time Adaptive Analytics RPC
-- ============================================================================

-- 1. Create public.user_learning_telemetry_events
CREATE TABLE IF NOT EXISTS public.user_learning_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'vocab_review',
            'hanzi_stroke_quiz',
            'grammar_drill',
            'listening_ab_loop',
            'reading_lookup',
            'cbt_question_answer',
            'ai_roleplay_turn',
            'translation_3tier'
        )
    ),
    hsk_level SMALLINT NOT NULL DEFAULT 1 CHECK (hsk_level BETWEEN 1 AND 9),
    lesson_id SMALLINT CHECK (lesson_id IS NULL OR (lesson_id BETWEEN 1 AND 180)),
    target_key TEXT NOT NULL CHECK (char_length(target_key) BETWEEN 1 AND 200),
    is_correct BOOLEAN NOT NULL DEFAULT TRUE,
    score_pct NUMERIC(5, 2) CHECK (score_pct IS NULL OR (score_pct >= 0 AND score_pct <= 100)),
    latency_ms INT CHECK (latency_ms IS NULL OR latency_ms >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (octet_length(metadata::text) <= 8192),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_learning_telemetry_user_created
    ON public.user_learning_telemetry_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_learning_telemetry_type
    ON public.user_learning_telemetry_events (user_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_learning_telemetry_target
    ON public.user_learning_telemetry_events (user_id, target_key);

-- 2. Enable Row Level Security & Policies
ALTER TABLE public.user_learning_telemetry_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_learning_telemetry_select_own" ON public.user_learning_telemetry_events;
CREATE POLICY "user_learning_telemetry_select_own"
    ON public.user_learning_telemetry_events
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_learning_telemetry_insert_own" ON public.user_learning_telemetry_events;
CREATE POLICY "user_learning_telemetry_insert_own"
    ON public.user_learning_telemetry_events
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_learning_telemetry_delete_own" ON public.user_learning_telemetry_events;
CREATE POLICY "user_learning_telemetry_delete_own"
    ON public.user_learning_telemetry_events
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

GRANT SELECT, INSERT, DELETE ON public.user_learning_telemetry_events TO authenticated;

-- 3. Single-query Telemetry Dashboard Summary RPC
CREATE OR REPLACE FUNCTION public.get_user_telemetry_dashboard_summary(
    p_user_id UUID,
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

    -- Streak, 7d active minutes & 7d event count
    WITH active_dates AS (
        SELECT DISTINCT DATE(created_at AT TIME ZONE 'UTC') AS d
        FROM public.user_learning_telemetry_events
        WHERE user_id = v_uid
          AND created_at >= v_since
    ),
    numbered_dates AS (
        SELECT
            d,
            (CURRENT_DATE - d) AS diff_days,
            ROW_NUMBER() OVER (ORDER BY d DESC) - 1 AS rn
        FROM active_dates
        WHERE d <= CURRENT_DATE
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

    -- Retention rate (%) from vocab_review telemetry (fallback to user_vocab_items)
    SELECT
        COALESCE(
            ROUND(
                (COUNT(*) FILTER (WHERE is_correct = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
                1
            ),
            0
        )
    INTO v_retention_rate_pct
    FROM public.user_learning_telemetry_events
    WHERE user_id = v_uid
      AND event_type = 'vocab_review'
      AND created_at >= v_since;

    IF v_retention_rate_pct = 0 AND to_regclass('public.user_vocab_items') IS NOT NULL THEN
        SELECT
            COALESCE(
                ROUND(
                    (COUNT(*) FILTER (WHERE COALESCE(lapses, 0) = 0 AND COALESCE(repetitions, 0) > 0)::NUMERIC
                    / NULLIF(COUNT(*) FILTER (WHERE COALESCE(repetitions, 0) > 0), 0)) * 100,
                    1
                ),
                0
            )
        INTO v_retention_rate_pct
        FROM public.user_vocab_items
        WHERE user_id = v_uid;
    END IF;

    -- Average response latency (ms) by skill
    SELECT jsonb_build_object(
        'listening', COALESCE(ROUND(AVG(latency_ms) FILTER (WHERE event_type IN ('listening_ab_loop', 'ai_roleplay_turn'))), 0),
        'reading', COALESCE(ROUND(AVG(latency_ms) FILTER (WHERE event_type IN ('reading_lookup', 'cbt_question_answer'))), 0),
        'grammar', COALESCE(ROUND(AVG(latency_ms) FILTER (WHERE event_type = 'grammar_drill')), 0),
        'writing', COALESCE(ROUND(AVG(latency_ms) FILTER (WHERE event_type IN ('hanzi_stroke_quiz', 'translation_3tier'))), 0),
        'overall', COALESCE(ROUND(AVG(latency_ms)), 0)
    )
    INTO v_avg_latency
    FROM public.user_learning_telemetry_events
    WHERE user_id = v_uid
      AND created_at >= v_since
      AND latency_ms IS NOT NULL;

    -- Top 5 cognitive bottlenecks (highest error rate + latency)
    SELECT COALESCE(jsonb_agg(row_to_json(b)), '[]'::jsonb)
    INTO v_bottlenecks
    FROM (
        SELECT
            target_key,
            MAX(event_type) AS event_type,
            MAX(hsk_level) AS hsk_level,
            COUNT(*)::INT AS attempts,
            COUNT(*) FILTER (WHERE is_correct = FALSE)::INT AS mistakes,
            ROUND(
                (COUNT(*) FILTER (WHERE is_correct = FALSE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
                1
            ) AS error_rate_pct,
            COALESCE(ROUND(AVG(latency_ms)), 0)::INT AS avg_latency_ms
        FROM public.user_learning_telemetry_events
        WHERE user_id = v_uid
          AND created_at >= v_since
        GROUP BY target_key
        HAVING COUNT(*) FILTER (WHERE is_correct = FALSE) > 0 OR COALESCE(AVG(latency_ms), 0) > 15000
        ORDER BY
            (COUNT(*) FILTER (WHERE is_correct = FALSE)::NUMERIC / NULLIF(COUNT(*), 0)) DESC,
            COALESCE(AVG(latency_ms), 0) DESC
        LIMIT 5
    ) b;

    -- 7-day SRS forecast from user_vocab_items
    IF to_regclass('public.user_vocab_items') IS NOT NULL THEN
        SELECT COALESCE(jsonb_agg(row_to_json(f) ORDER BY f.day_offset), '[]'::jsonb)
        INTO v_srs_forecast
        FROM (
            SELECT
                gs.day_offset,
                (CURRENT_DATE + gs.day_offset)::TEXT AS forecast_date,
                COALESCE(COUNT(v.id), 0)::INT AS due_count
            FROM generate_series(0, 6) AS gs(day_offset)
            LEFT JOIN public.user_vocab_items v
                ON v.user_id = v_uid
                AND DATE(v.next_review_at AT TIME ZONE 'UTC') = (CURRENT_DATE + gs.day_offset)
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
