-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08D
-- COMMUNITY REPORTS & MODERATION SYSTEM HARDENING & RPC
-- File: supabase/migrations/20261108_community_moderation_and_reports.sql
-- =========================================================================

BEGIN;

-- -------------------------------------------------------------------------
-- 1. CONSTRAINTS UPDATE: SUPPORT FULL MODERATION LIFECYCLE
-- -------------------------------------------------------------------------

-- 1.1. Relax community_reports status to support 'reviewing'
ALTER TABLE public.community_reports 
  DROP CONSTRAINT IF EXISTS community_reports_status_check,
  DROP CONSTRAINT IF EXISTS chk_community_reports_status;

ALTER TABLE public.community_reports 
  ADD CONSTRAINT chk_community_reports_status 
  CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed'));

-- 1.2. Support extended violation reasons (misinformation)
ALTER TABLE public.community_reports 
  DROP CONSTRAINT IF EXISTS community_reports_reason_check,
  DROP CONSTRAINT IF EXISTS chk_community_reports_reason;

ALTER TABLE public.community_reports 
  ADD CONSTRAINT chk_community_reports_reason 
  CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'misinformation', 'other'));

-- 1.3. Support extended moderation actions in community_moderation_logs
ALTER TABLE public.community_moderation_logs 
  DROP CONSTRAINT IF EXISTS community_moderation_logs_action_check,
  DROP CONSTRAINT IF EXISTS chk_community_moderation_logs_action;

ALTER TABLE public.community_moderation_logs 
  ADD CONSTRAINT chk_community_moderation_logs_action 
  CHECK (action IN ('hide', 'restore', 'delete', 'dismiss_report', 'review_report', 'resolve_report', 'pin', 'unpin'));

-- 1.4. Anti-abuse: Prevent concurrent duplicate pending reports from the same user for the same target
CREATE UNIQUE INDEX IF NOT EXISTS uq_community_reports_active 
  ON public.community_reports (reporter_id, target_type, target_id) 
  WHERE status IN ('pending', 'reviewing') AND reporter_id IS NOT NULL;

-- -------------------------------------------------------------------------
-- 2. ATOMIC MODERATION RPC: moderate_community_content
-- -------------------------------------------------------------------------
-- Verifies public.is_admin() or service_role at database level.
-- Performs content mutation, report status resolution, and audit log in one atomic transaction.
CREATE OR REPLACE FUNCTION public.moderate_community_content(
  p_action TEXT,
  p_target_type TEXT,
  p_target_id TEXT,
  p_reason TEXT DEFAULT NULL,
  p_report_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_admin_id UUID;
  v_post_id BIGINT;
  v_comment_id UUID;
  v_report_record RECORD;
BEGIN
  -- 1. Strict Administrator Authorization Verification
  v_is_admin := (
    auth.role() = 'service_role'
    OR public.is_admin()
  );

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ Quản trị viên mới có quyền thực hiện thao tác kiểm duyệt.'
      USING ERRCODE = '42501';
  END IF;

  v_admin_id := auth.uid();

  -- 2. Validate action and target_type
  IF p_action NOT IN ('hide', 'restore', 'delete', 'dismiss_report', 'review_report', 'resolve_report', 'pin', 'unpin') THEN
    RAISE EXCEPTION 'Hành động kiểm duyệt không hợp lệ: %', p_action;
  END IF;

  IF p_target_type NOT IN ('post', 'comment', 'report') THEN
    RAISE EXCEPTION 'Loại mục tiêu không hợp lệ: %', p_target_type;
  END IF;

  IF p_target_id IS NULL OR length(trim(p_target_id)) = 0 THEN
    RAISE EXCEPTION 'Mã định danh mục tiêu không được để trống.';
  END IF;

  -- 3. Execute Content Mutation based on Action
  IF p_action = 'hide' THEN
    IF p_target_type = 'post' THEN
      v_post_id := p_target_id::bigint;
      UPDATE public.community_posts
      SET status = 'hidden', updated_at = NOW()
      WHERE id = v_post_id;
    ELSIF p_target_type = 'comment' THEN
      v_comment_id := p_target_id::uuid;
      UPDATE public.community_comments
      SET status = 'hidden', updated_at = NOW()
      WHERE id = v_comment_id;
    END IF;

    -- If triggered from a report resolution, mark report resolved
    IF p_report_id IS NOT NULL THEN
      UPDATE public.community_reports
      SET status = 'resolved', resolved_by = v_admin_id, resolved_at = NOW()
      WHERE id = p_report_id;
    END IF;

  ELSIF p_action = 'restore' THEN
    IF p_target_type = 'post' THEN
      v_post_id := p_target_id::bigint;
      UPDATE public.community_posts
      SET status = 'published', updated_at = NOW()
      WHERE id = v_post_id;
    ELSIF p_target_type = 'comment' THEN
      v_comment_id := p_target_id::uuid;
      UPDATE public.community_comments
      SET status = 'published', updated_at = NOW()
      WHERE id = v_comment_id;
    END IF;

  ELSIF p_action = 'delete' THEN
    IF p_target_type = 'post' THEN
      v_post_id := p_target_id::bigint;
      UPDATE public.community_posts
      SET deleted_at = NOW(), status = 'hidden', updated_at = NOW()
      WHERE id = v_post_id;
    ELSIF p_target_type = 'comment' THEN
      v_comment_id := p_target_id::uuid;
      UPDATE public.community_comments
      SET deleted_at = NOW(), status = 'hidden', updated_at = NOW()
      WHERE id = v_comment_id;
    END IF;

    IF p_report_id IS NOT NULL THEN
      UPDATE public.community_reports
      SET status = 'resolved', resolved_by = v_admin_id, resolved_at = NOW()
      WHERE id = p_report_id;
    END IF;

  ELSIF p_action = 'pin' THEN
    IF p_target_type = 'post' THEN
      UPDATE public.community_posts SET is_pinned = true, updated_at = NOW() WHERE id = p_target_id::bigint;
    END IF;

  ELSIF p_action = 'unpin' THEN
    IF p_target_type = 'post' THEN
      UPDATE public.community_posts SET is_pinned = false, updated_at = NOW() WHERE id = p_target_id::bigint;
    END IF;

  ELSIF p_action = 'review_report' THEN
    UPDATE public.community_reports
    SET status = 'reviewing', resolved_by = v_admin_id
    WHERE id = p_target_id::uuid;

  ELSIF p_action = 'resolve_report' THEN
    UPDATE public.community_reports
    SET status = 'resolved', resolved_by = v_admin_id, resolved_at = NOW()
    WHERE id = p_target_id::uuid;

  ELSIF p_action = 'dismiss_report' THEN
    UPDATE public.community_reports
    SET status = 'dismissed', resolved_by = v_admin_id, resolved_at = NOW()
    WHERE id = p_target_id::uuid;
  END IF;

  -- 4. Record Immutable Audit Log
  INSERT INTO public.community_moderation_logs (
    admin_id,
    target_type,
    target_id,
    action,
    reason,
    created_at
  )
  VALUES (
    v_admin_id,
    p_target_type,
    p_target_id,
    p_action,
    p_reason,
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'action', p_action,
    'target_type', p_target_type,
    'target_id', p_target_id,
    'admin_id', v_admin_id,
    'timestamp', NOW()
  );
END;
$$;

-- Secure execution permissions
REVOKE EXECUTE ON FUNCTION public.moderate_community_content(TEXT, TEXT, TEXT, TEXT, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.moderate_community_content(TEXT, TEXT, TEXT, TEXT, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.moderate_community_content(TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated, service_role;

COMMIT;

