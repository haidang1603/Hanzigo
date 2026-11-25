-- =========================================================================
-- HANZI GO - P1 SECURITY HARDENING: LOCK SECURITY DEFINER SEARCH_PATH
-- =========================================================================
-- Prevents search_path hijacking on SECURITY DEFINER functions defined in
-- 20261112_2708_unified_ecosystem.sql and 20261113_master_seed_and_reconciliation_p27_29_30.sql.

ALTER FUNCTION public.sync_word_multidimensional_mastery(UUID, TEXT, TEXT, NUMERIC)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.trg_fn_sync_word_multidimensional_mastery()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_vocab_dimension_score(UUID, TEXT, TEXT, SMALLINT)
  SET search_path = public, pg_temp;
