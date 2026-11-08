-- =========================================================================
-- HANZIGO — PHASE 25 / TASK 25.03
-- MIGRATION: 20261108_cloud_migration_harmonization_and_integrity_v25.sql
-- Cloud Migration Harmonization, Database Integrity & RPC Security Consolidation
-- =========================================================================

-- 1. PATCH & HARDEN: audit_community_post_counters()
-- Resolves PostgreSQL ambiguous column reference (42702) via #variable_conflict use_column
-- and explicit subquery aliases. Restricts execution strictly to service_role.
-- =========================================================================

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

REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM anon;
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO service_role;


-- =========================================================================
-- 2. HARMONIZE & LAND: audit_community_reports_snapshot_status()
-- Provides reporting telemetry on content moderation reports & snapshot health
-- =========================================================================

CREATE OR REPLACE FUNCTION public.audit_community_reports_snapshot_status()
RETURNS TABLE (
  total_reports BIGINT,
  reports_with_post_fk BIGINT,
  reports_with_comment_fk BIGINT,
  reports_with_snapshot BIGINT,
  reports_missing_snapshot BIGINT,
  reports_target_type_mismatch BIGINT,
  reports_both_fks_present BIGINT,
  reports_orphan_no_snapshot BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    COUNT(*) AS total_reports,
    COUNT(*) FILTER (WHERE post_id IS NOT NULL) AS reports_with_post_fk,
    COUNT(*) FILTER (WHERE comment_id IS NOT NULL) AS reports_with_comment_fk,
    COUNT(*) FILTER (WHERE target_id IS NOT NULL AND length(trim(target_id)) > 0) AS reports_with_snapshot,
    COUNT(*) FILTER (WHERE target_id IS NULL OR length(trim(target_id)) = 0) AS reports_missing_snapshot,
    COUNT(*) FILTER (WHERE (post_id IS NOT NULL AND target_type <> 'post') OR (comment_id IS NOT NULL AND target_type <> 'comment')) AS reports_target_type_mismatch,
    COUNT(*) FILTER (WHERE post_id IS NOT NULL AND comment_id IS NOT NULL) AS reports_both_fks_present,
    COUNT(*) FILTER (WHERE post_id IS NULL AND comment_id IS NULL AND (target_id IS NULL OR length(trim(target_id)) = 0)) AS reports_orphan_no_snapshot
  FROM public.community_reports;
$$;

REVOKE EXECUTE ON FUNCTION public.audit_community_reports_snapshot_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_community_reports_snapshot_status() TO authenticated, service_role;


-- =========================================================================
-- 3. VERIFY & HARDEN REPORT SNAPSHOT TRIGGER: sync_community_report_target_snapshot()
-- Automatically snapshots post/comment state on report insertion
-- =========================================================================

CREATE OR REPLACE FUNCTION public.sync_community_report_target_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- 1. Sync Post report snapshot if post_id is provided
  IF NEW.post_id IS NOT NULL THEN
    NEW.target_type := 'post';
    NEW.target_id := NEW.post_id::text;
    
    -- Capture snapshot if empty
    IF NEW.target_snapshot IS NULL OR NEW.target_snapshot = '{}'::jsonb THEN
      SELECT jsonb_build_object(
        'id', p.id,
        'author_name', p.author_name,
        'author_level', p.author_level,
        'title', p.title,
        'content', p.content,
        'status', p.status,
        'created_at', p.created_at
      ) INTO NEW.target_snapshot
      FROM public.community_posts p
      WHERE p.id = NEW.post_id;
    END IF;
  
  -- 2. Sync Comment report snapshot if comment_id is provided
  ELSIF NEW.comment_id IS NOT NULL THEN
    NEW.target_type := 'comment';
    NEW.target_id := NEW.comment_id::text;
    
    -- Capture snapshot if empty
    IF NEW.target_snapshot IS NULL OR NEW.target_snapshot = '{}'::jsonb THEN
      SELECT jsonb_build_object(
        'id', c.id,
        'post_id', c.post_id,
        'author_id', c.author_id,
        'content', c.content,
        'status', c.status,
        'created_at', c.created_at
      ) INTO NEW.target_snapshot
      FROM public.community_comments c
      WHERE c.id = NEW.comment_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_report_target_snapshot ON public.community_reports;
CREATE TRIGGER trg_sync_community_report_target_snapshot
  BEFORE INSERT ON public.community_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_community_report_target_snapshot();


-- =========================================================================
-- 4. PERFORMANCE & FOREIGN KEY INDEXES CONSOLIDATION
-- Ensures high query performance across all 55 public tables
-- =========================================================================

-- Community Indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON public.community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_status ON public.community_comments(status);
CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id ON public.community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_user_id ON public.community_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON public.community_reports(status);
CREATE INDEX IF NOT EXISTS idx_community_reports_reporter ON public.community_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_post_id ON public.community_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_comment_id ON public.community_reports(comment_id);

-- Study Partners Indexes
CREATE INDEX IF NOT EXISTS idx_study_partners_active ON public.study_partners(is_active);
CREATE INDEX IF NOT EXISTS idx_study_partners_user_id ON public.study_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_study_partners_target_level ON public.study_partners(target_level);

-- Materials & Reading Progress Indexes
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_material ON public.reading_progress(user_id, material_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_updated_at ON public.reading_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_level ON public.materials(level);

-- RAG Chunks & Vector Indexes
CREATE INDEX IF NOT EXISTS idx_rag_chunks_source_id ON public.rag_knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_hsk_level ON public.rag_knowledge_chunks(hsk_level);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_review_status ON public.rag_knowledge_chunks(review_status);

-- Curriculum & Learning Indexes
CREATE INDEX IF NOT EXISTS idx_learning_lessons_chapter_id ON public.learning_lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_lessons_level_id ON public.learning_lessons(level_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_progress_user_id ON public.user_journey_progress(user_id);

-- HSK Exam Center Indexes
CREATE INDEX IF NOT EXISTS idx_hsk_questions_exam_id ON public.hsk_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_user_id ON public.hsk_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_exam_id ON public.hsk_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_user_id ON public.hsk_mistakes(user_id);


-- =========================================================================
-- 5. REALTIME PUBLICATION VERIFICATION
-- Ensure critical interactive tables are registered in supabase_realtime
-- =========================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_posts') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_comments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_reactions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'study_partners') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.study_partners;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

