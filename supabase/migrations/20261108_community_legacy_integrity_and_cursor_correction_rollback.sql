-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1A.3
-- MIGRATION MANIFEST SNAPSHOT & POST-MIGRATION DATA PRESERVATION ROLLBACK
-- (FINAL ACCEPTANCE FIX: NULL RESTORATION, FULL SNAPSHOT VALIDATION & CONCURRENCY SAFETY)
-- File: supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction_rollback.sql
-- =========================================================================

-- Wrap rollback in atomic transaction
BEGIN;

-- 1. Activate internal migration token for this rollback transaction
SELECT set_config('hanzigo.internal_migration_session', 'true', true);

-- -------------------------------------------------------------------------
-- 1.1. SCHEMA GUARANTEE & MANIFEST COMPATIBILITY PREFLIGHT
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_migration_manifest (
  migration_id TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  PRIMARY KEY (migration_id, record_id)
);

ALTER TABLE public.community_migration_manifest 
  ADD COLUMN IF NOT EXISTS table_name TEXT DEFAULT 'community_comments',
  ADD COLUMN IF NOT EXISTS post_id BIGINT,
  ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
  ADD COLUMN IF NOT EXISTS before_state JSONB,
  ADD COLUMN IF NOT EXISTS created_state JSONB,
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Safe backfill & defaults:
UPDATE public.community_migration_manifest 
SET table_name = 'community_comments' 
WHERE table_name IS NULL;

ALTER TABLE public.community_migration_manifest 
  ALTER COLUMN table_name SET DEFAULT 'community_comments';

UPDATE public.community_migration_manifest
SET applied_at = COALESCE(applied_at, created_at, NOW())
WHERE applied_at IS NULL;

ALTER TABLE public.community_migration_manifest
  ALTER COLUMN applied_at SET DEFAULT NOW();

-- Preflight validation to guarantee manifest schema readiness
DO $$
DECLARE
  v_missing_cols TEXT;
BEGIN
  SELECT string_agg(required_col, ', ')
  INTO v_missing_cols
  FROM (
    VALUES ('migration_id'), ('record_id'), ('table_name'), ('action'),
           ('post_id'), ('legacy_source_id'), ('before_state'), ('created_state'),
           ('applied_at')
  ) AS req(required_col)
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'community_migration_manifest' 
      AND column_name = req.required_col
  );

  IF v_missing_cols IS NOT NULL THEN
    RAISE EXCEPTION 'Rollback preflight verification failed: community_migration_manifest is missing columns: %', v_missing_cols;
  END IF;
END;
$$;

-- -------------------------------------------------------------------------
-- 2. CONCURRENCY-SAFE VALIDATION & ATOMIC ROLLBACK EXECUTION
-- -------------------------------------------------------------------------
DO $$
DECLARE
  v_rec RECORD;
  v_curr RECORD;
  v_has_reports BOOLEAN;
  v_has_mod_logs BOOLEAN;
  v_manifest_count INT;
  v_expected_delete_count INT := 0;
  v_actual_delete_count INT := 0;
BEGIN
  -- 2.1. Check if manifest records exist for this migration
  SELECT COUNT(*) INTO v_manifest_count
  FROM public.community_migration_manifest
  WHERE migration_id = '20261108_community_legacy_integrity';

  IF v_manifest_count = 0 THEN
    RAISE NOTICE 'Rollback skipped: No manifest records found for migration 20261108_community_legacy_integrity';
    RETURN;
  END IF;

  -- 2.2. CONCURRENCY SAFETY: Acquire row-level exclusive locks (FOR UPDATE)
  -- on ALL target records tracked by this migration before performing any checks!
  -- This blocks any concurrent transaction from updating, deleting, or reporting
  -- target comments during the rollback transaction window.
  PERFORM 1 FROM public.community_comments
  WHERE id IN (
    SELECT record_id FROM public.community_migration_manifest
    WHERE migration_id = '20261108_community_legacy_integrity'
  )
  FOR UPDATE;

  -- 2.3. FULL 9-FIELD VALIDATION OF INSERTED RECORDS
  -- Compares live database row with initial created_state snapshot.
  -- If ANY field differs or referencing data exists, strictly ABORT rollback!
  FOR v_rec IN 
    SELECT record_id, post_id, created_state 
    FROM public.community_migration_manifest 
    WHERE migration_id = '20261108_community_legacy_integrity' AND action = 'INSERTED'
  LOOP
    SELECT * INTO v_curr FROM public.community_comments WHERE id = v_rec.record_id;

    -- If comment still exists in table, perform exhaustive verification
    IF v_curr.id IS NOT NULL THEN
      IF v_rec.created_state IS NOT NULL THEN
        -- 1. author_id
        IF v_curr.author_id IS DISTINCT FROM (NULLIF(v_rec.created_state->>'author_id', ''))::uuid THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field author_id mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'author_id', v_curr.author_id;
        END IF;

        -- 2. post_id
        IF v_curr.post_id IS DISTINCT FROM (v_rec.created_state->>'post_id')::bigint THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field post_id mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'post_id', v_curr.post_id;
        END IF;

        -- 3. content
        IF v_curr.content IS DISTINCT FROM (v_rec.created_state->>'content') THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field content mismatched. Refusing to delete.', 
            v_rec.record_id, v_rec.post_id;
        END IF;

        -- 4. status
        IF v_curr.status IS DISTINCT FROM (v_rec.created_state->>'status') THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field status mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'status', v_curr.status;
        END IF;

        -- 5. deleted_at
        IF v_curr.deleted_at IS DISTINCT FROM (NULLIF(v_rec.created_state->>'deleted_at', ''))::timestamptz THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field deleted_at mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'deleted_at', v_curr.deleted_at;
        END IF;

        -- 6. legacy_source_id
        IF v_curr.legacy_source_id IS DISTINCT FROM (v_rec.created_state->>'legacy_source_id') THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field legacy_source_id mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'legacy_source_id', v_curr.legacy_source_id;
        END IF;

        -- 7. legacy_author_name
        IF v_curr.legacy_author_name IS DISTINCT FROM (v_rec.created_state->>'legacy_author_name') THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field legacy_author_name mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'legacy_author_name', v_curr.legacy_author_name;
        END IF;

        -- 8. created_at
        IF v_curr.created_at IS DISTINCT FROM (v_rec.created_state->>'created_at')::timestamptz THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field created_at mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'created_at', v_curr.created_at;
        END IF;

        -- 9. updated_at
        IF v_curr.updated_at IS DISTINCT FROM (v_rec.created_state->>'updated_at')::timestamptz THEN
          RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % field updated_at mismatched (expected: %, actual: %). Refusing to delete.', 
            v_rec.record_id, v_rec.post_id, v_rec.created_state->>'updated_at', v_curr.updated_at;
        END IF;
      END IF;

      -- Check referencing reports in community_reports
      SELECT EXISTS (
        SELECT 1 FROM public.community_reports
        WHERE comment_id = v_rec.record_id 
           OR (target_type = 'comment' AND target_id = v_rec.record_id::text)
      ) INTO v_has_reports;

      IF v_has_reports THEN
        RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % has associated reports in community_reports. Refusing to delete.', 
          v_rec.record_id, v_rec.post_id;
      END IF;

      -- Check referencing moderation logs in community_moderation_logs
      SELECT EXISTS (
        SELECT 1 FROM public.community_moderation_logs
        WHERE target_type = 'comment' AND target_id = v_rec.record_id::text
      ) INTO v_has_mod_logs;

      IF v_has_mod_logs THEN
        RAISE EXCEPTION 'ROLLBACK ABORTED: Comment % on post % has associated logs in community_moderation_logs. Refusing to delete.', 
          v_rec.record_id, v_rec.post_id;
      END IF;

      v_expected_delete_count := v_expected_delete_count + 1;
    END IF;
  END LOOP;

  -- 2.4. REVERT UPDATED RECORDS TO EXACT PRE-MIGRATION SNAPSHOT (before_state)
  -- Accurately distinguishes:
  -- 1) Key absent in JSON: retains current column value c.field
  -- 2) Key is JSON null: restores exact SQL NULL
  -- 3) Key is empty string '': preserves exact empty string '' for text fields without collapsing to NULL!
  -- 4) Key is typed value: casts safely to UUID, BIGINT, TIMESTAMPTZ, or TEXT
  UPDATE public.community_comments c
  SET 
    author_id = CASE 
      WHEN NOT (m.before_state ? 'author_id') THEN c.author_id
      WHEN m.before_state->'author_id' = 'null'::jsonb OR m.before_state->>'author_id' IS NULL OR m.before_state->>'author_id' = '' THEN NULL
      ELSE (m.before_state->>'author_id')::uuid 
    END,
    legacy_source_id = CASE 
      WHEN NOT (m.before_state ? 'legacy_source_id') THEN c.legacy_source_id
      WHEN m.before_state->'legacy_source_id' = 'null'::jsonb OR m.before_state->>'legacy_source_id' IS NULL THEN NULL
      ELSE m.before_state->>'legacy_source_id' 
    END,
    legacy_author_name = CASE 
      WHEN NOT (m.before_state ? 'legacy_author_name') THEN c.legacy_author_name
      WHEN m.before_state->'legacy_author_name' = 'null'::jsonb OR m.before_state->>'legacy_author_name' IS NULL THEN NULL
      ELSE m.before_state->>'legacy_author_name' 
    END,
    post_id = CASE 
      WHEN NOT (m.before_state ? 'post_id') THEN c.post_id
      WHEN m.before_state->'post_id' = 'null'::jsonb OR m.before_state->>'post_id' IS NULL OR m.before_state->>'post_id' = '' THEN NULL
      ELSE (m.before_state->>'post_id')::bigint 
    END,
    content = CASE 
      WHEN NOT (m.before_state ? 'content') THEN c.content
      WHEN m.before_state->'content' = 'null'::jsonb OR m.before_state->>'content' IS NULL THEN NULL
      ELSE m.before_state->>'content' 
    END,
    status = CASE 
      WHEN NOT (m.before_state ? 'status') THEN c.status
      WHEN m.before_state->'status' = 'null'::jsonb OR m.before_state->>'status' IS NULL THEN NULL
      ELSE m.before_state->>'status' 
    END,
    deleted_at = CASE 
      WHEN NOT (m.before_state ? 'deleted_at') THEN c.deleted_at
      WHEN m.before_state->'deleted_at' = 'null'::jsonb OR m.before_state->>'deleted_at' IS NULL OR m.before_state->>'deleted_at' = '' THEN NULL
      ELSE (m.before_state->>'deleted_at')::timestamptz 
    END,
    created_at = CASE 
      WHEN NOT (m.before_state ? 'created_at') THEN c.created_at
      WHEN m.before_state->'created_at' = 'null'::jsonb OR m.before_state->>'created_at' IS NULL OR m.before_state->>'created_at' = '' THEN NULL
      ELSE (m.before_state->>'created_at')::timestamptz 
    END,
    updated_at = CASE 
      WHEN NOT (m.before_state ? 'updated_at') THEN c.updated_at
      WHEN m.before_state->'updated_at' = 'null'::jsonb OR m.before_state->>'updated_at' IS NULL OR m.before_state->>'updated_at' = '' THEN NULL
      ELSE (m.before_state->>'updated_at')::timestamptz 
    END
  FROM public.community_migration_manifest m
  WHERE c.id = m.record_id
    AND m.migration_id = '20261108_community_legacy_integrity'
    AND m.action = 'UPDATED';

  -- 2.5. DELETE VERIFIED INSERTED RECORDS WITH CONCURRENCY COUNT CHECK
  DELETE FROM public.community_comments
  WHERE id IN (
    SELECT record_id 
    FROM public.community_migration_manifest 
    WHERE migration_id = '20261108_community_legacy_integrity' AND action = 'INSERTED'
  );

  GET DIAGNOSTICS v_actual_delete_count = ROW_COUNT;

  IF v_actual_delete_count <> v_expected_delete_count THEN
    RAISE EXCEPTION 'Concurrency violation: Expected to delete % comments, but % rows were deleted. Aborting rollback.',
      v_expected_delete_count, v_actual_delete_count;
  END IF;
END;
$$;

-- -------------------------------------------------------------------------
-- 3. RECONCILE POST COUNTERS ATOMICALLY
-- -------------------------------------------------------------------------
DO $$
DECLARE
  v_post RECORD;
  v_comm_count BIGINT;
  v_rx_count BIGINT;
  v_likes_count INT;
BEGIN
  FOR v_post IN SELECT id, likes FROM public.community_posts LOOP
    -- Compute published comments count
    SELECT COUNT(*) INTO v_comm_count
    FROM public.community_comments
    WHERE post_id = v_post.id AND status = 'published' AND deleted_at IS NULL;

    -- Compute reactions count
    SELECT COUNT(*) INTO v_rx_count
    FROM public.community_reactions
    WHERE post_id = v_post.id;

    -- likes_count = reactions + legacy unattributed baseline
    v_likes_count := v_rx_count + GREATEST(0, COALESCE(v_post.likes, 0) - v_rx_count);

    PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
    UPDATE public.community_posts
    SET 
      comments_count = v_comm_count,
      likes_count = v_likes_count
    WHERE id = v_post.id;
  END LOOP;
END;
$$;

-- -------------------------------------------------------------------------
-- 4. CLEAN UP MIGRATION MANIFEST RECORDS
-- -------------------------------------------------------------------------
DELETE FROM public.community_migration_manifest 
WHERE migration_id = '20261108_community_legacy_integrity';

-- 5. Reset transaction configuration
SELECT set_config('hanzigo.internal_migration_session', '', true);

-- Commit atomic rollback
COMMIT;
