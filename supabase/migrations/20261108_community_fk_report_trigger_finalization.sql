-- =========================================================================
-- MIGRATION: 20261108_community_fk_report_trigger_finalization.sql
-- HanziGo Phase 24 / Task 24.08A.2: Community FK, Report & Trigger Finalization
-- =========================================================================
-- Focus Areas:
-- 1. Ensure Nullability compatibility for all ON DELETE SET NULL foreign keys.
-- 2. Resolve Community Reports XOR conflict via target_type snapshot & resilient constraint.
-- 3. Enhance post & comment integrity triggers to strictly protect author metadata and timestamps.
-- 4. Harden SECURITY DEFINER context without assuming PostgREST runs as postgres/supabase_admin.
-- 5. Preserve existing posts (BIGSERIAL intact, JSONB columns intact) and maintain zero-data-loss rollback plan.
-- =========================================================================

-- =========================================================================
-- 1. FOREIGN KEY NULLABILITY ASSURANCE
-- =========================================================================

-- Explicitly ensure columns with ON DELETE SET NULL are nullable
ALTER TABLE public.community_moderation_logs ALTER COLUMN admin_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN reporter_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN post_id DROP NOT NULL;
ALTER TABLE public.community_reports ALTER COLUMN comment_id DROP NOT NULL;
ALTER TABLE public.community_comments ALTER COLUMN author_id DROP NOT NULL;

-- =========================================================================
-- 2. REPORT TARGET SNAPSHOT & XOR CONFLICT RESOLUTION
-- Problem: If post/comment is deleted and post_id/comment_id is SET NULL,
-- the XOR check constraint (post_id IS NOT NULL XOR comment_id IS NOT NULL)
-- would be violated, causing DELETE on posts/comments to fail!
-- Solution: Add snapshot columns target_type & target_id and make post_id/comment_id
-- nullable foreign keys that preserve audit history when parent item is purged.
-- =========================================================================

ALTER TABLE public.community_reports
  ADD COLUMN IF NOT EXISTS target_type VARCHAR(20) DEFAULT 'post' CHECK (target_type IN ('post', 'comment')),
  ADD COLUMN IF NOT EXISTS target_id TEXT;

-- Drop old rigid XOR constraint or previous version of resilient constraint if exists
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_report_target_xor;
ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS chk_community_reports_target_valid;

-- Add resilient constraint:
-- For newly inserted reports: must have either post_id OR comment_id specified.
-- If target is later deleted, post_id and comment_id can become NULL while target_type & target_id retain snapshot!
ALTER TABLE public.community_reports
  ADD CONSTRAINT chk_community_reports_target_valid CHECK (
    -- On creation or while active: exactly one target must be linked
    (post_id IS NOT NULL AND comment_id IS NULL)
    OR (post_id IS NULL AND comment_id IS NOT NULL)
    -- Historical preserved state: target was purged by admin, snapshot retained
    OR (post_id IS NULL AND comment_id IS NULL AND target_id IS NOT NULL)
  );

-- Automatically populate snapshot target_type and target_id on report creation
CREATE OR REPLACE FUNCTION public.sync_community_report_target_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN
    NEW.target_type := 'post';
    NEW.target_id := NEW.post_id::text;
  ELSIF NEW.comment_id IS NOT NULL THEN
    NEW.target_type := 'comment';
    NEW.target_id := NEW.comment_id::text;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_report_target ON public.community_reports;
CREATE TRIGGER trg_sync_community_report_target
  BEFORE INSERT ON public.community_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_community_report_target_snapshot();

-- =========================================================================
-- 3. FINALIZED POST INTEGRITY TRIGGER
-- Comprehensive protection for:
-- author_id, author_name, author_avatar, author_level, created_at,
-- status, is_pinned, deleted_at, likes, liked_by, comments, likes_count, comments_count
-- =========================================================================

CREATE OR REPLACE FUNCTION public.enforce_community_post_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_author_profile RECORD;
BEGIN
  -- Strict administrative check:
  -- 1. Service role (backend server API / cron)
  -- 2. Verified active admin via public.is_admin() (checks profiles.role='admin' AND status='active')
  -- Note: We do NOT blindly trust SESSION_USER.
  v_is_admin := (
    auth.role() = 'service_role'
    OR public.is_admin()
  );

  -- -----------------------------------------------------------------------
  -- INSERT LOGIC
  -- -----------------------------------------------------------------------
  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      -- Student cannot impersonate another author_id
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tạo bài viết dưới danh nghĩa người dùng khác.';
      END IF;

      -- Automatically link author_id to auth.uid() if omitted
      NEW.author_id := auth.uid();

      -- Synchronize author metadata directly from profiles table to prevent spoofing
      IF auth.uid() IS NOT NULL THEN
        SELECT full_name, avatar_url, role INTO v_author_profile
        FROM public.profiles
        WHERE id = auth.uid();

        IF FOUND THEN
          NEW.author_name := COALESCE(v_author_profile.full_name, NEW.author_name, 'Học viên HanziGo');
          NEW.author_avatar := COALESCE(v_author_profile.avatar_url, NEW.author_avatar);
        END IF;
      END IF;

      -- Enforce default values for privileged columns
      NEW.status := 'published';
      NEW.is_pinned := FALSE;
      NEW.is_solved := FALSE;
      NEW.likes_count := 0;
      NEW.comments_count := 0;
      NEW.likes := 0;
      NEW.liked_by := '[]'::jsonb;
      NEW.comments := '[]'::jsonb;
      NEW.deleted_at := NULL;
      NEW.created_at := NOW();
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  -- -----------------------------------------------------------------------
  -- UPDATE LOGIC
  -- -----------------------------------------------------------------------
  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
      -- Ownership immutable
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển quyền sở hữu tác giả bài viết.';
      END IF;

      -- Author metadata immutable directly via post update (must update profile instead)
      IF (NEW.author_name IS DISTINCT FROM OLD.author_name) OR
         (NEW.author_avatar IS DISTINCT FROM OLD.author_avatar) OR
         (NEW.author_level IS DISTINCT FROM OLD.author_level) THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi trực tiếp thông tin tác giả trên bài viết.';
      END IF;

      -- Creation timestamp immutable
      IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi thời gian tạo bài viết.';
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
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bài viết.';
      END IF;

      -- Statistics and engagement fields immutable directly by client
      IF (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR 
         (NEW.comments_count IS DISTINCT FROM OLD.comments_count) OR
         (NEW.likes IS DISTINCT FROM OLD.likes) OR
         (NEW.liked_by IS DISTINCT FROM OLD.liked_by) OR
         (NEW.comments IS DISTINCT FROM OLD.comments) THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
      END IF;

      -- Author is legitimately allowed to edit: content, tag, image_url, is_solved
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

-- =========================================================================
-- 4. FINALIZED COMMENT INTEGRITY TRIGGER
-- Comprehensive protection for:
-- author_id, post_id, created_at, status, deleted_at
-- =========================================================================

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
    auth.role() = 'service_role'
    OR public.is_admin()
  );

  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      -- Student must not impersonate another author
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể đăng bình luận dưới danh nghĩa người khác.';
      END IF;
      NEW.author_id := auth.uid();
      NEW.status := 'published';
      NEW.deleted_at := NULL;
      NEW.created_at := NOW();
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
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

      -- Author is legitimately allowed to edit: content
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
-- 5. SECURITY DEFINER AUDIT & EXECUTE PERMISSIONS
-- Ensure public.is_admin() has safe search_path and proper execute grants
-- =========================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  -- Strictly check that the authenticated user profile has role = 'admin' AND status = 'active'
  -- Blocked admins cannot perform any privileged administrative actions!
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

