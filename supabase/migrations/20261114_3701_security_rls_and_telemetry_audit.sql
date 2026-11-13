-- ============================================================================
-- TASK 37.03: Security Audit, Telemetry Logs, RLS Enforcement & RPC Hardening
-- ============================================================================

-- 1. Create public.system_error_logs for sanitized client telemetry (Privacy Policy 1.2 & 1.5)
CREATE TABLE IF NOT EXISTS public.system_error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
    stack_summary TEXT NOT NULL DEFAULT '' CHECK (char_length(stack_summary) <= 1200),
    route_path TEXT NOT NULL DEFAULT '/' CHECK (char_length(route_path) <= 500),
    user_agent TEXT NOT NULL DEFAULT '' CHECK (char_length(user_agent) <= 500),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (octet_length(metadata::text) <= 4096),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_error_logs_created_at
    ON public.system_error_logs (created_at DESC);

ALTER TABLE public.system_error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "system_error_logs_insert_any" ON public.system_error_logs;
CREATE POLICY "system_error_logs_insert_any"
    ON public.system_error_logs
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        (user_id IS NULL OR user_id = auth.uid())
        AND char_length(message) BETWEEN 1 AND 500
        AND octet_length(metadata::text) <= 4096
    );

DROP POLICY IF EXISTS "system_error_logs_admin_select" ON public.system_error_logs;
CREATE POLICY "system_error_logs_admin_select"
    ON public.system_error_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.profiles p
            WHERE p.id = auth.uid()
              AND p.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "system_error_logs_admin_delete" ON public.system_error_logs;
CREATE POLICY "system_error_logs_admin_delete"
    ON public.system_error_logs
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.profiles p
            WHERE p.id = auth.uid()
              AND p.role = 'admin'
        )
    );

GRANT INSERT ON public.system_error_logs TO anon, authenticated;
GRANT SELECT, DELETE ON public.system_error_logs TO authenticated;

-- 2. Ensure ROW LEVEL SECURITY is enabled on all Phase 27-36 user & learning tables
DO $$
DECLARE
    v_table TEXT;
    v_phase_tables TEXT[] := ARRAY[
        'user_vocab_items',
        'vocab_review_logs',
        'user_writing_attempts',
        'user_pronunciation_attempts',
        'user_reading_progress',
        'user_listening_progress',
        'user_video_progress',
        'user_ocr_scans',
        'user_web_imports',
        'user_chengyu_progress',
        'user_translation_attempts',
        'user_textbook_progress',
        'user_sentence_mining_cards',
        'hsk_exam_attempts',
        'hsk_exam_answers',
        'tts_audio_cache_registry',
        'classroom_hsk_assignments',
        'classroom_assignment_submissions',
        'classroom_whiteboard_snapshots',
        'ai_learner_memory_profiles',
        'ai_learner_mistake_embeddings',
        'arena_matches',
        'arena_match_participants',
        'system_error_logs'
    ];
BEGIN
    FOREACH v_table IN ARRAY v_phase_tables LOOP
        IF to_regclass(format('public.%I', v_table)) IS NOT NULL THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_table);
        END IF;
    END LOOP;
END;
$$;

-- 3. Harden SECURITY DEFINER RPCs: enforce SET search_path = public and strict auth.uid() checks
CREATE OR REPLACE FUNCTION public.update_vocab_dimension_score(
    p_user_id UUID,
    p_simplified TEXT,
    p_dimension TEXT, -- 'meaning' | 'writing' | 'pronunciation'
    p_score SMALLINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clamped_score SMALLINT := GREATEST(0, LEAST(100, COALESCE(p_score, 0)));
BEGIN
    IF auth.role() <> 'service_role' THEN
        IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
            RAISE EXCEPTION 'forbidden: cannot modify another user mastery score'
                USING ERRCODE = '42501';
        END IF;
    END IF;

    IF p_dimension = 'meaning' THEN
        UPDATE public.user_vocab_items
        SET meaning_mastery = v_clamped_score, last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    ELSIF p_dimension = 'writing' THEN
        UPDATE public.user_vocab_items
        SET writing_mastery = GREATEST(writing_mastery, v_clamped_score), last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    ELSIF p_dimension = 'pronunciation' THEN
        UPDATE public.user_vocab_items
        SET pronunciation_mastery = GREATEST(pronunciation_mastery, v_clamped_score), last_reviewed_at = NOW()
        WHERE user_id = p_user_id AND simplified = p_simplified;
    END IF;
END;
$$;

-- Enforce SET search_path = public on all target SECURITY DEFINER functions if present
DO $$
DECLARE
    v_fn RECORD;
BEGIN
    FOR v_fn IN
        SELECT
            n.nspname AS schema_name,
            p.proname AS func_name,
            pg_get_function_identity_arguments(p.oid) AS func_args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname IN (
              'update_vocab_dimension_score',
              'increment_tts_cache_hit',
              'get_classroom_assignment_analytics',
              'get_user_adaptive_ai_context',
              'compute_user_hsk_readiness_radar',
              'record_arena_match_result'
          )
    LOOP
        EXECUTE format(
            'ALTER FUNCTION %I.%I(%s) SET search_path = public',
            v_fn.schema_name,
            v_fn.func_name,
            v_fn.func_args
        );
    END LOOP;
END;
$$;

