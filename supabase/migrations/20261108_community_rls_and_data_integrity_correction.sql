-- =========================================================================
-- MIGRATION: 20261108_community_rls_and_data_integrity_correction.sql
-- HanziGo Phase 24 / Task 24.08A.1: Community RLS & Data Integrity Correction
-- =========================================================================
-- Goals:
-- 1. Protect sensitive columns against unauthorized modification via column-level REVOKE + Trigger Enforcement.
-- 2. Prevent cascade deletion of moderation audit trail and reports (SET NULL instead of CASCADE).
-- 3. Enforce immutability and restrict moderation logs creation to administrative / server context.
-- 4. Harden community reports submission and resolution flow.
-- 5. Safe backfill and integrity checks for likes_count, comments_count, reaction_type, and comment content.
-- 6. Preserve all existing community_posts (BIGSERIAL id intact, JSONB comments/liked_by preserved).
-- =========================================================================

-- =========================================================================
-- 1. DATA INTEGRITY CONSTRAINTS & EXTENSIONS
-- =========================================================================

-- Ensure reaction_type on community_reactions is constrained to supported values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_community_reactions_type' AND conrelid = 'public.community_reactions'::regclass
  ) THEN
    ALTER TABLE public.community_reactions 
      ADD CONSTRAINT chk_community_reactions_type CHECK (reaction_type IN ('like', 'heart', 'clap', 'bulb'));
  END IF;
END $$;

-- Ensure comment content is non-empty after trimming and length-bounded
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_community_comments_content' AND conrelid = 'public.community_comments'::regclass
  ) THEN
    ALTER TABLE public.community_comments 
      ADD CONSTRAINT chk_community_comments_content CHECK (
        length(trim(content)) > 0 AND length(content) <= 3000
      );
  END IF;
END $$;

-- Ensure likes_count and comments_count are strictly non-negative
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_community_posts_counts' AND conrelid = 'public.community_posts'::regclass
  ) THEN
    ALTER TABLE public.community_posts 
      ADD CONSTRAINT chk_community_posts_counts CHECK (
        likes_count >= 0 AND comments_count >= 0 AND COALESCE(likes, 0) >= 0
      );
  END IF;
END $$;

-- =========================================================================
-- 2. SAFE BACKFILL FOR likes_count & comments_count
-- Handled safely: SQL NULL, JSON null, or non-array scalar won't cause failure
-- =========================================================================
UPDATE public.community_posts
SET 
  likes_count = GREATEST(COALESCE(likes, 0), 0),
  comments_count = CASE 
    WHEN comments IS NOT NULL 
         AND jsonb_typeof(comments) = 'array' 
      THEN jsonb_array_length(comments)
    ELSE 0
  END
WHERE likes_count = 0 AND comments_count = 0;

-- =========================================================================
-- 3. AUDIT PRESERVATION: PREVENT DELETION CASCADE ON AUDIT/REPORTS
-- Retain moderation logs and reports when a profile is deleted.
-- =========================================================================

-- 3.1. community_moderation_logs: admin_id ON DELETE SET NULL
DO $$
BEGIN
  -- Drop cascade FK if present
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_moderation_logs_admin_id_fkey' AND conrelid = 'public.community_moderation_logs'::regclass
  ) THEN
    ALTER TABLE public.community_moderation_logs DROP CONSTRAINT community_moderation_logs_admin_id_fkey;
  END IF;

  -- Recreate as SET NULL, make admin_id nullable so log record persists forever
  ALTER TABLE public.community_moderation_logs ALTER COLUMN admin_id DROP NOT NULL;
  ALTER TABLE public.community_moderation_logs 
    ADD CONSTRAINT community_moderation_logs_admin_id_fkey 
    FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
END $$;

-- 3.2. community_reports: reporter_id & resolved_by ON DELETE SET NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_reports_reporter_id_fkey' AND conrelid = 'public.community_reports'::regclass
  ) THEN
    ALTER TABLE public.community_reports DROP CONSTRAINT community_reports_reporter_id_fkey;
  END IF;

  ALTER TABLE public.community_reports ALTER COLUMN reporter_id DROP NOT NULL;
  ALTER TABLE public.community_reports 
    ADD CONSTRAINT community_reports_reporter_id_fkey 
    FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
END $$;

-- 3.3. community_reports: post_id and comment_id ON DELETE SET NULL (preserve report record if post/comment is purged)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_reports_post_id_fkey' AND conrelid = 'public.community_reports'::regclass
  ) THEN
    ALTER TABLE public.community_reports DROP CONSTRAINT community_reports_post_id_fkey;
  END IF;

  ALTER TABLE public.community_reports 
    ADD CONSTRAINT community_reports_post_id_fkey 
    FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE SET NULL;

  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_reports_comment_id_fkey' AND conrelid = 'public.community_reports'::regclass
  ) THEN
    ALTER TABLE public.community_reports DROP CONSTRAINT community_reports_comment_id_fkey;
  END IF;

  ALTER TABLE public.community_reports 
    ADD CONSTRAINT community_reports_comment_id_fkey 
    FOREIGN KEY (comment_id) REFERENCES public.community_comments(id) ON DELETE SET NULL;
END $$;

-- 3.4. community_comments: author_id ON DELETE SET NULL (retains discussion context even if user deletes account)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'community_comments_author_id_fkey' AND conrelid = 'public.community_comments'::regclass
  ) THEN
    ALTER TABLE public.community_comments DROP CONSTRAINT community_comments_author_id_fkey;
  END IF;

  ALTER TABLE public.community_comments ALTER COLUMN author_id DROP NOT NULL;
  ALTER TABLE public.community_comments 
    ADD CONSTRAINT community_comments_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
END $$;

-- =========================================================================
-- 4. COLUMN-LEVEL DEFENSE-IN-DEPTH TRIGGER ENFORCEMENT
-- Blocks students from directly modifying sensitive fields:
-- author_id, likes, liked_by, likes_count, comments_count, is_pinned, status, deleted_at
-- =========================================================================

CREATE OR REPLACE FUNCTION public.enforce_community_post_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Determine administrative context
  v_is_admin := (
    (SESSION_USER IN ('postgres', 'supabase_admin') AND current_setting('request.jwt.claims', true) IS NULL)
    OR auth.role() = 'service_role'
    OR public.is_admin()
  );

  -- 1. On INSERT: regular users cannot inject privileged status or stats
  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      -- Must not impersonate another author
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tạo bài viết dưới danh nghĩa người dùng khác.';
      END IF;
      -- Force default values for privileged columns
      NEW.status := 'published';
      NEW.is_pinned := FALSE;
      NEW.likes_count := 0;
      NEW.comments_count := 0;
      NEW.likes := 0;
      NEW.liked_by := '[]'::jsonb;
      NEW.comments := '[]'::jsonb;
      NEW.deleted_at := NULL;
    END IF;
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  -- 2. On UPDATE: regular users cannot alter ownership, moderation, or statistics fields
  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
      -- Ownership immutable
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển quyền sở hữu tác giả bài viết.';
      END IF;
      -- Moderation status immutable by regular authors
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền thay đổi trạng thái kiểm duyệt bài viết.';
      END IF;
      -- Pinned flag immutable by regular authors
      IF NEW.is_pinned IS DISTINCT FROM OLD.is_pinned THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền ghim bài viết.';
      END IF;
      -- Soft-delete timestamp immutable by direct update (use DELETE verb instead)
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa.';
      END IF;
      -- Statistics fields must not be altered directly by client update
      IF (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR 
         (NEW.comments_count IS DISTINCT FROM OLD.comments_count) OR
         (NEW.likes IS DISTINCT FROM OLD.likes) OR
         (NEW.liked_by IS DISTINCT FROM OLD.liked_by) OR
         (NEW.comments IS DISTINCT FROM OLD.comments) THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
      END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_community_post_integrity ON public.community_posts;
CREATE TRIGGER trg_enforce_community_post_integrity
  BEFORE INSERT OR UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_community_post_integrity();

-- 4.2. Integrity trigger for community_comments
CREATE OR REPLACE FUNCTION public.enforce_community_comment_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  v_is_admin := (
    (SESSION_USER IN ('postgres', 'supabase_admin') AND current_setting('request.jwt.claims', true) IS NULL)
    OR auth.role() = 'service_role'
    OR public.is_admin()
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.';
      END IF;
      NEW.status := 'published';
      NEW.deleted_at := NULL;
    END IF;
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể thay đổi tác giả bình luận.';
      END IF;
      IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển bình luận sang bài viết khác.';
      END IF;
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền đổi trạng thái bình luận.';
      END IF;
      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa.';
      END IF;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_community_comment_integrity ON public.community_comments;
CREATE TRIGGER trg_enforce_community_comment_integrity
  BEFORE INSERT OR UPDATE ON public.community_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_community_comment_integrity();

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES HARMONIZATION
-- =========================================================================

-- 5.1. community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_posts_select" ON public.community_posts;
CREATE POLICY "community_posts_select" ON public.community_posts
  FOR SELECT
  USING (
    (status = 'published' AND deleted_at IS NULL)
    OR (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_posts_insert" ON public.community_posts;
CREATE POLICY "community_posts_insert" ON public.community_posts
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (author_id IS NULL OR author_id = auth.uid())
  );

DROP POLICY IF EXISTS "community_posts_update" ON public.community_posts;
CREATE POLICY "community_posts_update" ON public.community_posts
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_posts_delete" ON public.community_posts;
CREATE POLICY "community_posts_delete" ON public.community_posts
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

-- 5.2. community_comments
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_comments_select" ON public.community_comments;
CREATE POLICY "community_comments_select" ON public.community_comments
  FOR SELECT
  USING (
    (status = 'published' AND deleted_at IS NULL)
    OR (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_comments_insert" ON public.community_comments;
CREATE POLICY "community_comments_insert" ON public.community_comments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = author_id
  );

DROP POLICY IF EXISTS "community_comments_update" ON public.community_comments;
CREATE POLICY "community_comments_update" ON public.community_comments
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_comments_delete" ON public.community_comments;
CREATE POLICY "community_comments_delete" ON public.community_comments
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

-- 5.3. community_reactions
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_reactions_select" ON public.community_reactions;
CREATE POLICY "community_reactions_select" ON public.community_reactions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "community_reactions_insert" ON public.community_reactions;
CREATE POLICY "community_reactions_insert" ON public.community_reactions
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

DROP POLICY IF EXISTS "community_reactions_delete" ON public.community_reactions;
CREATE POLICY "community_reactions_delete" ON public.community_reactions
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (auth.uid() = user_id OR public.is_admin())
  );

-- 5.4. community_reports
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_reports_select" ON public.community_reports;
CREATE POLICY "community_reports_select" ON public.community_reports
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = reporter_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_reports_insert" ON public.community_reports;
CREATE POLICY "community_reports_insert" ON public.community_reports
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = reporter_id
    AND status = 'pending'
    AND resolved_by IS NULL
    AND resolved_at IS NULL
  );

DROP POLICY IF EXISTS "community_reports_update" ON public.community_reports;
CREATE POLICY "community_reports_update" ON public.community_reports
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "community_reports_delete" ON public.community_reports;
CREATE POLICY "community_reports_delete" ON public.community_reports
  FOR DELETE
  USING (public.is_admin());

-- 5.5. community_moderation_logs (STRICT IMMUTABILITY)
ALTER TABLE public.community_moderation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_mod_logs_select" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_select" ON public.community_moderation_logs
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "community_mod_logs_insert" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_insert" ON public.community_moderation_logs
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    AND (admin_id IS NULL OR auth.uid() = admin_id)
  );

DROP POLICY IF EXISTS "community_mod_logs_no_update" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_no_update" ON public.community_moderation_logs
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "community_mod_logs_no_delete" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_no_delete" ON public.community_moderation_logs
  FOR DELETE
  USING (false);

-- =========================================================================
-- 6. PERMISSIONS & GRANTS
-- =========================================================================
GRANT SELECT ON public.community_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;

GRANT SELECT ON public.community_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;

GRANT SELECT ON public.community_reactions TO anon, authenticated;
GRANT INSERT, DELETE ON public.community_reactions TO authenticated;

GRANT SELECT, INSERT ON public.community_reports TO authenticated;
GRANT UPDATE, DELETE ON public.community_reports TO authenticated; -- Effectively admin-only via RLS

GRANT SELECT, INSERT ON public.community_moderation_logs TO authenticated; -- Effectively admin-only via RLS
REVOKE UPDATE, DELETE ON public.community_moderation_logs FROM anon, authenticated;

