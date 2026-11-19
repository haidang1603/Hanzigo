-- =========================================================================
-- MIGRATION: 20261119_3806_security_hardening.sql
-- Phase 38 / Task 38.06: Security & Access Control Hardening
--
-- Hardens remaining SECURITY DEFINER functions from Phases 27-30:
--   1. public.sync_word_multidimensional_mastery(UUID, TEXT, TEXT, NUMERIC)
--   2. public.trg_fn_sync_word_multidimensional_mastery()
--   3. public.update_vocab_dimension_score(UUID, TEXT, TEXT, SMALLINT)
-- Adds `SET search_path = public, pg_temp`, enforces caller ownership (`auth.uid()`
-- or `public.is_admin()`), and restricts EXECUTE permissions.
--
-- IMPORTANT: DO NOT RUN AUTOMATICALLY ON PRODUCTION WITHOUT REVIEW.
-- =========================================================================

-- 1. Harden sync_word_multidimensional_mastery
CREATE OR REPLACE FUNCTION public.sync_word_multidimensional_mastery(
  p_user_id UUID,
  p_target_entity TEXT,
  p_tool_source TEXT,
  p_score NUMERIC DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clamped_score SMALLINT;
BEGIN
  IF p_user_id IS NULL OR p_target_entity IS NULL OR LENGTH(TRIM(p_target_entity)) = 0 THEN
    RETURN;
  END IF;

  -- Enforce caller ownership when invoked via RPC by an authenticated client
  IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: cannot modify another user mastery record';
  END IF;

  v_clamped_score := LEAST(100, GREATEST(0, COALESCE(ROUND(p_score), 80)))::SMALLINT;

  IF p_tool_source IN ('writing', 'hanzi_writer') THEN
    UPDATE public.user_vocab_items
    SET
      writing_mastery = GREATEST(writing_mastery, v_clamped_score),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND simplified = p_target_entity;
  ELSIF p_tool_source = 'pronunciation' THEN
    UPDATE public.user_vocab_items
    SET
      pronunciation_mastery = GREATEST(pronunciation_mastery, v_clamped_score),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND simplified = p_target_entity;
  ELSIF p_tool_source = 'vocab' THEN
    UPDATE public.user_vocab_items
    SET
      meaning_mastery = GREATEST(meaning_mastery, v_clamped_score),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND simplified = p_target_entity;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_word_multidimensional_mastery(UUID, TEXT, TEXT, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_word_multidimensional_mastery(UUID, TEXT, TEXT, NUMERIC) TO authenticated, service_role;

-- 2. Harden trigger function trg_fn_sync_word_multidimensional_mastery
CREATE OR REPLACE FUNCTION public.trg_fn_sync_word_multidimensional_mastery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.sync_word_multidimensional_mastery(
    NEW.user_id,
    NEW.target_entity,
    NEW.tool_source,
    NEW.score
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trg_fn_sync_word_multidimensional_mastery() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trg_fn_sync_word_multidimensional_mastery() TO service_role;

-- 3. Harden update_vocab_dimension_score
CREATE OR REPLACE FUNCTION public.update_vocab_dimension_score(
  p_user_id UUID,
  p_simplified TEXT,
  p_dimension TEXT, -- 'meaning' | 'writing' | 'pronunciation'
  p_score SMALLINT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clamped SMALLINT := LEAST(100, GREATEST(0, COALESCE(p_score, 0)));
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Forbidden: cannot update another user vocab dimension score';
  END IF;

  IF p_dimension = 'meaning' THEN
    UPDATE public.user_vocab_items
    SET meaning_mastery = v_clamped, last_reviewed_at = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id AND simplified = p_simplified;
  ELSIF p_dimension = 'writing' THEN
    UPDATE public.user_vocab_items
    SET writing_mastery = v_clamped, last_reviewed_at = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id AND simplified = p_simplified;
  ELSIF p_dimension = 'pronunciation' THEN
    UPDATE public.user_vocab_items
    SET pronunciation_mastery = v_clamped, last_reviewed_at = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id AND simplified = p_simplified;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.update_vocab_dimension_score(UUID, TEXT, TEXT, SMALLINT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_vocab_dimension_score(UUID, TEXT, TEXT, SMALLINT) TO authenticated, service_role;

-- =========================================================================
-- ROLLBACK GUIDE (Manual only if reverting Task 38.06):
--   Re-run the original function definitions in:
--   - `supabase/migrations/20261112_2708_unified_ecosystem.sql`
--   - `supabase/migrations/20261113_master_seed_and_reconciliation_p27_29_30.sql`
-- =========================================================================
