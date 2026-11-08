-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C.1 / TASK 24.08C.1A
-- COMMUNITY LEGACY MIGRATION INTEGRITY & SECURITY DEFINER HARDENING
-- File: supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql
-- =========================================================================

-- Wrap migration within explicit transaction block for atomic execution
BEGIN;

-- -------------------------------------------------------------------------
-- 1. SCHEMA EXTENSION: MIGRATION MANIFEST & SOURCE IDENTITY
-- -------------------------------------------------------------------------
-- Migration Manifest table to track exact records created or updated by this migration,
-- enabling surgical, non-destructive rollbacks without affecting pre-existing or future user comments.
CREATE TABLE IF NOT EXISTS public.community_migration_manifest (
  migration_id TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERTED' or 'UPDATED'
  PRIMARY KEY (migration_id, record_id)
);

-- Ensure all possible columns across old & new schema versions exist
ALTER TABLE public.community_migration_manifest 
  ADD COLUMN IF NOT EXISTS table_name TEXT DEFAULT 'community_comments',
  ADD COLUMN IF NOT EXISTS post_id BIGINT,
  ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
  ADD COLUMN IF NOT EXISTS before_state JSONB,
  ADD COLUMN IF NOT EXISTS created_state JSONB,
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Safe backfill & defaults:
-- Ensure table_name is never null and has safe default 'community_comments'
UPDATE public.community_migration_manifest 
SET table_name = 'community_comments' 
WHERE table_name IS NULL;

ALTER TABLE public.community_migration_manifest 
  ALTER COLUMN table_name SET DEFAULT 'community_comments';

-- Ensure applied_at has default NOW() and is backfilled if created_at exists
UPDATE public.community_migration_manifest
SET applied_at = COALESCE(applied_at, created_at, NOW())
WHERE applied_at IS NULL;

ALTER TABLE public.community_migration_manifest
  ALTER COLUMN applied_at SET DEFAULT NOW();

-- Preflight validation to guarantee manifest schema readiness before any data operations
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
    RAISE EXCEPTION 'Preflight verification failed: community_migration_manifest is missing columns: %', v_missing_cols;
  END IF;
END;
$$;

-- Add legacy_source_id to prevent deduplication collision based solely on content
ALTER TABLE public.community_comments 
  ADD COLUMN IF NOT EXISTS legacy_source_id TEXT,
  ADD COLUMN IF NOT EXISTS legacy_author_name TEXT;

-- Enforce uniqueness of legacy source id per post
CREATE UNIQUE INDEX IF NOT EXISTS uq_community_comments_legacy_source 
  ON public.community_comments (post_id, legacy_source_id) 
  WHERE legacy_source_id IS NOT NULL;

-- -------------------------------------------------------------------------
-- 2. SCHEMA EXTENSION: FEED COMPOUND INDEX FOR 3-TUPLE CURSOR PAGINATION
-- -------------------------------------------------------------------------
-- Supports ORDER BY is_pinned DESC, created_at DESC, id DESC with index scan
CREATE INDEX IF NOT EXISTS idx_community_posts_feed_compound 
  ON public.community_posts (is_pinned DESC, created_at DESC, id DESC) 
  WHERE deleted_at IS NULL AND status <> 'hidden';

-- -------------------------------------------------------------------------
-- 3. SECURITY DEFINER HARDENING: ELIMINATE CURRENT_USER AMBIGUITY
-- -------------------------------------------------------------------------
-- CRITICAL SECURITY FIX (Task 24.08C.1A):
-- Never rely on `current_user` inside a SECURITY DEFINER function to verify admin status!
-- In PostgreSQL, `current_user` inside SECURITY DEFINER resolves to the function owner,
-- which could allow untrusted execution contexts to bypass security checks.
-- We strictly verify:
-- 1. Service role JWT (auth.role() = 'service_role' OR request.jwt.claims ->> 'role' = 'service_role')
-- 2. Valid authenticated Admin profile via public.is_admin() (checked against active profile)
-- 3. Dedicated transaction-scoped migration setting `hanzigo.internal_migration_session`
--    which can ONLY be set within trusted superuser migration transactions.
CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_service_role BOOLEAN;
  v_is_admin BOOLEAN;
  v_is_migration_session BOOLEAN;
BEGIN
  -- 1. Strict JWT service role detection
  v_is_service_role := (
    auth.role() = 'service_role' 
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );

  -- 2. Database admin role check (via profiles table, blocked from non-active / blocked admins)
  v_is_admin := public.is_admin();

  -- 3. Transaction-local migration session (only available when explicitly configured in SQL migration block)
  v_is_migration_session := (
    current_setting('hanzigo.internal_migration_session', true) = 'true'
    AND (
      SESSION_USER IN ('postgres', 'supabase_admin')
      OR v_is_service_role
    )
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      -- Student must not impersonate another author
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.';
      END IF;
      NEW.author_id := auth.uid();
      NEW.status := 'published';
      NEW.deleted_at := NULL;
      NEW.created_at := NOW();
      -- Clients cannot forge legacy source identity
      NEW.legacy_source_id := NULL;
      NEW.legacy_author_name := NULL;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT (v_is_service_role OR v_is_admin OR v_is_migration_session) THEN
      -- Author immutable
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể thay đổi tác giả bình luận.';
      END IF;

      -- Post association immutable
      IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển bình luận sang bài viết khác.';
      END IF;

      -- Creation timestamp immutable
      IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi thời gian đăng bình luận.';
      END IF;

      -- Moderation status immutable by regular authors
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền đổi trạng thái bình luận.';
      END IF;

      -- Soft delete timestamp immutable by direct update
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bình luận.';
      END IF;

      -- Legacy fields immutable by clients
      NEW.legacy_source_id := OLD.legacy_source_id;
      NEW.legacy_author_name := OLD.legacy_author_name;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------------------
-- 4. PRIVILEGED MIGRATION SESSION ACTIVATION (TRANSACTION-LOCAL)
-- -------------------------------------------------------------------------
-- Enable internal migration token for this transaction only (resets on COMMIT/ROLLBACK)
SELECT set_config('hanzigo.internal_migration_session', 'true', true);

-- -------------------------------------------------------------------------
-- 5. DATA CORRECTION: PRECISE RECORD IDENTIFICATION & VERIFICATION
-- -------------------------------------------------------------------------
-- Verify preconditions using verified primary key UUIDs from production database.
-- Post 7 UUID: 'd76d4034-25c9-4d67-a601-9fa5cb777b2f'
-- Post 3 UUID: '22eb72d5-38ef-4a2d-9454-e4121bce91b7'
-- Preconditions:
-- 1. UUID must exist and belong to the correct post_id.
-- 2. Target legacy_source_id must not be in use by any other comment on the same post.
-- If any precondition fails, RAISE EXCEPTION and rollback entire transaction.
DO $$
DECLARE
  v_p7_uuid CONSTANT UUID := 'd76d4034-25c9-4d67-a601-9fa5cb777b2f';
  v_p3_uuid CONSTANT UUID := '22eb72d5-38ef-4a2d-9454-e4121bce91b7';
  v_p7_actual_post_id BIGINT;
  v_p3_actual_post_id BIGINT;
  v_collision_count INT;
  v_p7_before_state JSONB;
  v_p3_before_state JSONB;
BEGIN
  -- 1. Verify Post 7 comment by primary key UUID
  SELECT post_id INTO v_p7_actual_post_id
  FROM public.community_comments
  WHERE id = v_p7_uuid;

  IF v_p7_actual_post_id IS NULL THEN
    RAISE EXCEPTION 'Precondition failed: Verified comment UUID % for Post 7 does not exist', v_p7_uuid;
  END IF;

  IF v_p7_actual_post_id <> 7 THEN
    RAISE EXCEPTION 'Precondition failed: Comment UUID % belongs to post_id %, expected 7', v_p7_uuid, v_p7_actual_post_id;
  END IF;

  -- Verify target source ID 'comment-1791666635196' is not taken by another record on Post 7
  SELECT COUNT(*) INTO v_collision_count
  FROM public.community_comments
  WHERE post_id = 7 AND legacy_source_id = 'comment-1791666635196' AND id <> v_p7_uuid;

  IF v_collision_count > 0 THEN
    RAISE EXCEPTION 'Precondition failed: legacy_source_id comment-1791666635196 is already used by another record on Post 7';
  END IF;

  -- 2. Verify Post 3 comment by primary key UUID
  SELECT post_id INTO v_p3_actual_post_id
  FROM public.community_comments
  WHERE id = v_p3_uuid;

  IF v_p3_actual_post_id IS NULL THEN
    RAISE EXCEPTION 'Precondition failed: Verified comment UUID % for Post 3 does not exist', v_p3_uuid;
  END IF;

  IF v_p3_actual_post_id <> 3 THEN
    RAISE EXCEPTION 'Precondition failed: Comment UUID % belongs to post_id %, expected 3', v_p3_uuid, v_p3_actual_post_id;
  END IF;

  -- Verify target source ID 'c1' is not taken by another record on Post 3
  SELECT COUNT(*) INTO v_collision_count
  FROM public.community_comments
  WHERE post_id = 3 AND legacy_source_id = 'c1' AND id <> v_p3_uuid;

  IF v_collision_count > 0 THEN
    RAISE EXCEPTION 'Precondition failed: legacy_source_id c1 is already used by another record on Post 3';
  END IF;

  -- 3. CAPTURE PRE-MIGRATION SNAPSHOT BEFORE ANY UPDATE OCCURS
  -- Capture full original row state for Post 7 (all 9 core columns)
  SELECT jsonb_build_object(
    'author_id', author_id,
    'post_id', post_id,
    'content', content,
    'status', status,
    'deleted_at', deleted_at,
    'legacy_source_id', legacy_source_id,
    'legacy_author_name', legacy_author_name,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_p7_before_state
  FROM public.community_comments
  WHERE id = v_p7_uuid;

  -- Capture full original row state for Post 3 (all 9 core columns)
  SELECT jsonb_build_object(
    'author_id', author_id,
    'post_id', post_id,
    'content', content,
    'status', status,
    'deleted_at', deleted_at,
    'legacy_source_id', legacy_source_id,
    'legacy_author_name', legacy_author_name,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_p3_before_state
  FROM public.community_comments
  WHERE id = v_p3_uuid;

  -- 4. RECORD MANIFEST SNAPSHOT BEFORE UPDATE (DO NOTHING on re-run preserves initial pre-migration state)
  INSERT INTO public.community_migration_manifest (
    migration_id,
    table_name,
    record_id,
    action,
    post_id,
    legacy_source_id,
    before_state,
    created_state
  )
  VALUES 
    ('20261108_community_legacy_integrity', 'community_comments', v_p7_uuid, 'UPDATED', 7, 'comment-1791666635196', v_p7_before_state, NULL),
    ('20261108_community_legacy_integrity', 'community_comments', v_p3_uuid, 'UPDATED', 3, 'c1', v_p3_before_state, NULL)
  ON CONFLICT (migration_id, record_id) DO NOTHING;

  -- 5. PERFORM PRECISE UPDATES
  UPDATE public.community_comments
  SET 
    author_id = NULL,
    legacy_source_id = 'comment-1791666635196',
    legacy_author_name = 'Alibaba và 36 tên Thanh Hoá'
  WHERE id = v_p7_uuid;

  UPDATE public.community_comments
  SET 
    author_id = NULL,
    legacy_source_id = 'c1',
    legacy_author_name = 'Nguyễn Văn Minh'
  WHERE id = v_p3_uuid;
END;
$$;

-- -------------------------------------------------------------------------
-- 6. SOURCE ID COLLISION PRECHECK & IDEMPOTENT BACKFILL
-- -------------------------------------------------------------------------
-- Step 6.1: Collision precheck across all posts in JSONB comments.
-- Detects if any single post contains duplicate source IDs in its comments array.
-- If duplicates exist, logs detailed post_id, source_id, count and rolls back.
DO $$
DECLARE
  v_dup RECORD;
BEGIN
  FOR v_dup IN (
    SELECT 
      p.id AS post_id,
      COALESCE(NULLIF(TRIM(elem->>'id'), ''), 'idx_' || ord::text) AS source_id,
      COUNT(*) AS occurrence_count
    FROM public.community_posts p,
    jsonb_array_elements(
      CASE 
        WHEN jsonb_typeof(p.comments) = 'array' THEN p.comments 
        ELSE '[]'::jsonb 
      END
    ) WITH ORDINALITY AS arr(elem, ord)
    WHERE elem->>'content' IS NOT NULL AND TRIM(elem->>'content') <> ''
    GROUP BY p.id, COALESCE(NULLIF(TRIM(elem->>'id'), ''), 'idx_' || ord::text)
    HAVING COUNT(*) > 1
  ) LOOP
    RAISE EXCEPTION 'Source collision detected in community_posts: post_id=%, legacy_source_id=%, occurrences=%', 
      v_dup.post_id, v_dup.source_id, v_dup.occurrence_count;
  END LOOP;
END;
$$;

-- Step 6.2: Idempotent backfill with stable source identity & zero name-mapping.
-- Uses NULLIF(TRIM(elem->>'id'), '') with deterministic ordinal fallback 'idx_' || ord::text.
-- ON CONFLICT matches partial unique index uq_community_comments_legacy_source.
-- Records all newly inserted comments in community_migration_manifest for rollback isolation.
WITH inserted_comments AS (
  INSERT INTO public.community_comments (
    post_id,
    author_id,
    content,
    status,
    legacy_source_id,
    legacy_author_name,
    created_at,
    updated_at
  )
  SELECT
    p.id AS post_id,
    -- Strictly require valid UUID format from source; never map by display name!
    CASE 
      WHEN (elem->>'user_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = (elem->>'user_id')::uuid)
      THEN (elem->>'user_id')::uuid
      WHEN (elem->>'author_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = (elem->>'author_id')::uuid)
      THEN (elem->>'author_id')::uuid
      ELSE NULL
    END AS author_id,
    TRIM(elem->>'content') AS content,
    'published' AS status,
    COALESCE(NULLIF(TRIM(elem->>'id'), ''), 'idx_' || ord::text) AS legacy_source_id,
    COALESCE(NULLIF(TRIM(elem->>'author'), ''), NULLIF(TRIM(elem->>'author_name'), ''), 'Học viên HanziGo') AS legacy_author_name,
    COALESCE(
      CASE 
        WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
        WHEN (elem->>'created_at') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'created_at')::timestamptz
        ELSE p.created_at
      END,
      NOW()
    ) AS created_at,
    COALESCE(
      CASE 
        WHEN (elem->>'time') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'time')::timestamptz
        WHEN (elem->>'created_at') ~ '^\d{4}-\d{2}-\d{2}' THEN (elem->>'created_at')::timestamptz
        ELSE p.created_at
      END,
      NOW()
    ) AS updated_at
  FROM public.community_posts p,
  jsonb_array_elements(
    CASE 
      WHEN jsonb_typeof(p.comments) = 'array' THEN p.comments 
      ELSE '[]'::jsonb 
    END
  ) WITH ORDINALITY AS arr(elem, ord)
  WHERE elem->>'content' IS NOT NULL 
    AND TRIM(elem->>'content') <> ''
  ON CONFLICT (post_id, legacy_source_id) WHERE legacy_source_id IS NOT NULL DO NOTHING
  RETURNING id, post_id, author_id, content, status, legacy_source_id, legacy_author_name, created_at, updated_at
)
INSERT INTO public.community_migration_manifest (
  migration_id,
  table_name,
  record_id,
  action,
  post_id,
  legacy_source_id,
  before_state,
  created_state
)
SELECT 
  '20261108_community_legacy_integrity',
  'community_comments',
  id,
  'INSERTED',
  post_id,
  legacy_source_id,
  NULL,
  jsonb_build_object(
    'author_id', author_id,
    'post_id', post_id,
    'content', content,
    'status', status,
    'deleted_at', NULL,
    'legacy_source_id', legacy_source_id,
    'legacy_author_name', legacy_author_name,
    'created_at', created_at,
    'updated_at', updated_at
  )
FROM inserted_comments
ON CONFLICT (migration_id, record_id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 7. STRICT REACTION MIGRATION: UUID ONLY (NO DISPLAY NAME MAPPING)
-- -------------------------------------------------------------------------
-- Only migrate if the item in liked_by is a valid UUID matching an existing profile.
-- Display names or unattributed strings are strictly left in the legacy baseline.
INSERT INTO public.community_reactions (
  post_id,
  user_id,
  reaction_type,
  created_at
)
SELECT
  p.id AS post_id,
  pr.id AS user_id,
  'like' AS reaction_type,
  COALESCE(p.created_at, NOW()) AS created_at
FROM public.community_posts p,
jsonb_array_elements_text(
  CASE 
    WHEN jsonb_typeof(p.liked_by) = 'array' THEN p.liked_by 
    ELSE '[]'::jsonb 
  END
) AS val
JOIN public.profiles pr ON pr.id::text = val
WHERE val ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
ON CONFLICT (post_id, user_id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 8. DETERMINISTIC COUNTER RECONCILIATION VIA INTERNAL TOKEN
-- -------------------------------------------------------------------------
-- Use the secure internal counter token (hanzigo.internal_counter_sync)
-- to reconcile counters without disabling database integrity triggers!
DO $$
DECLARE
  v_post RECORD;
  v_comm_count BIGINT;
  v_rx_count BIGINT;
  v_likes_count INT;
BEGIN
  FOR v_post IN SELECT id, likes FROM public.community_posts LOOP
    -- Compute published comments
    SELECT COUNT(*) INTO v_comm_count
    FROM public.community_comments
    WHERE post_id = v_post.id AND status = 'published' AND deleted_at IS NULL;

    -- Compute reactions
    SELECT COUNT(*) INTO v_rx_count
    FROM public.community_reactions
    WHERE post_id = v_post.id;

    -- likes_count = reactions + legacy unattributed likes baseline
    v_likes_count := v_rx_count + GREATEST(0, COALESCE(v_post.likes, 0) - v_rx_count);

    -- Perform atomic update with single-use internal counter token
    PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
    UPDATE public.community_posts
    SET 
      comments_count = v_comm_count,
      likes_count = v_likes_count
    WHERE id = v_post.id;
  END LOOP;
END;
$$;

-- Reset migration token
SELECT set_config('hanzigo.internal_migration_session', '', true);

-- -------------------------------------------------------------------------
-- 9. HARDENED TELEMETRY AUDIT FUNCTION (SECURITY INVOKER & SERVICE_ROLE ONLY)
-- -------------------------------------------------------------------------
-- Security Hardening (Task 24.08C.1A.2):
-- Use SECURITY INVOKER to eliminate current_user ownership ambiguity.
-- In-place update preserving function dependencies and signature without DROP CASCADE.
-- Restrict audit telemetry execution strictly to service_role.
-- Authenticated students, anonymous callers, and regular admins via PostgREST are DENIED.
CREATE OR REPLACE FUNCTION public.audit_community_post_counters()
RETURNS TABLE (
  post_id BIGINT,
  author_name TEXT,
  stored_likes_count INT,
  actual_reactions_count BIGINT,
  legacy_likes_baseline BIGINT,
  new_reaction_count BIGINT,
  likes_diff BIGINT,
  stored_comments_count INT,
  actual_published_comments_count BIGINT,
  legacy_comments_baseline BIGINT,
  comments_diff BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
#variable_conflict use_column
DECLARE
  v_jwt_role TEXT;
BEGIN
  -- Extract JWT role if invoked via PostgREST/HTTP
  v_jwt_role := COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  );

  -- 1. If invoked via HTTP / PostgREST (where JWT context is populated),
  -- strictly allow ONLY 'service_role'. Deny authenticated, anon, and active admins with authenticated JWT.
  IF v_jwt_role IS NOT NULL THEN
    IF v_jwt_role <> 'service_role' THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Service Role mới có quyền truy cập công cụ đối soát.'
        USING ERRCODE = '42501';
    END IF;
  ELSE
    -- 2. If invoked via direct SQL (e.g. psql / SQL Editor where JWT settings are NULL),
    -- strictly verify that the database SESSION_USER is postgres or supabase_admin.
    -- (We check SESSION_USER, never current_user, preventing any privilege confusion).
    IF SESSION_USER NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Superuser hoặc Service Role mới có quyền truy cập công cụ đối soát.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN QUERY
  SELECT
    p.id AS post_id,
    p.author_name,
    p.likes_count AS stored_likes_count,
    COALESCE(r.reaction_cnt, 0) AS actual_reactions_count,
    GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0))::bigint AS legacy_likes_baseline,
    COALESCE(r.reaction_cnt, 0) AS new_reaction_count,
    (p.likes_count - (
      GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0)) + COALESCE(r.reaction_cnt, 0)
    ))::bigint AS likes_diff,
    p.comments_count AS stored_comments_count,
    COALESCE(c.comment_cnt, 0) AS actual_published_comments_count,
    (CASE WHEN jsonb_typeof(p.comments) = 'array' THEN jsonb_array_length(p.comments) ELSE 0 END)::bigint AS legacy_comments_baseline,
    (p.comments_count - COALESCE(c.comment_cnt, 0))::bigint AS comments_diff
  FROM public.community_posts p
  LEFT JOIN (
    SELECT cr.post_id AS rx_post_id, COUNT(*) AS reaction_cnt
    FROM public.community_reactions cr
    GROUP BY cr.post_id
  ) r ON r.rx_post_id = p.id
  LEFT JOIN (
    SELECT cc.post_id AS cm_post_id, COUNT(*) AS comment_cnt
    FROM public.community_comments cc
    WHERE cc.status = 'published' AND cc.deleted_at IS NULL
    GROUP BY cc.post_id
  ) c ON c.cm_post_id = p.id
  ORDER BY p.id ASC;
END;
$$;

-- Revoke all execute rights from PUBLIC and authenticated students
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM anon;

-- Grant EXECUTE strictly to service_role
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO service_role;

-- Complete transaction cleanly
COMMIT;

