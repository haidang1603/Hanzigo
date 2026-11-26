-- =========================================================================
-- HANZI GO — IMMUTABLE HSK ATTEMPT ANSWER SNAPSHOTS (ADDITIVE MIGRATION)
-- =========================================================================
-- Date: 2026-11-27
-- Purpose:
--   Add nullable JSONB column `answer_snapshots` to `public.hsk_attempts`
--   so every submitted exam attempt freezes compact immutable snapshots
--   (SNAPSHOT_VERSION = 1) of selected/correct options, subjective text,
--   and explanations. Existing rows remain 100% intact (DEFAULT NULL).

ALTER TABLE public.hsk_attempts
  ADD COLUMN IF NOT EXISTS answer_snapshots JSONB DEFAULT NULL;

COMMENT ON COLUMN public.hsk_attempts.answer_snapshots IS
  'Immutable per-question snapshot array (snapshotVersion=1) frozen server-side at submission time to prevent review drift when hsk_questions options are reordered.';
