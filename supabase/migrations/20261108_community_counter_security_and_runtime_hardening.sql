-- =========================================================================
-- MIGRATION: 20261108_community_counter_security_and_runtime_hardening.sql
-- HanziGo Phase 24 / Task 24.08B.1: Community Counter Security Hardening & Runtime Verification
-- =========================================================================
-- Focus Areas:
-- 1. Threat model hardening: Single-Use Token Pattern for hanzigo.internal_counter_sync.
-- 2. Consume and immediately reset flag inside trigger to eliminate multi-statement transaction reuse.
-- 3. Hardened toggle_community_post_reaction returning post_id as string (Phase E contract).
-- 4. Hardened comment counter trigger with safe flag scoping.
-- 5. Full telemetry function audit_community_post_counters() distinguishing legacy baseline and new activity.
-- =========================================================================

-- =========================================================================
-- 1. HARDENED POST INTEGRITY TRIGGER (SINGLE-USE INTERNAL TOKEN)
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
  v_is_admin := (
    auth.role() = 'service_role'
    OR public.is_admin()
  );

  -- -----------------------------------------------------------------------
  -- INSERT LOGIC
  -- -----------------------------------------------------------------------
  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tạo bài viết dưới danh nghĩa người dùng khác.';
      END IF;

      NEW.author_id := auth.uid();

      IF auth.uid() IS NOT NULL THEN
        SELECT full_name, avatar_url, role INTO v_author_profile
        FROM public.profiles
        WHERE id = auth.uid();

        IF FOUND THEN
          NEW.author_name := COALESCE(v_author_profile.full_name, NEW.author_name, 'Học viên HanziGo');
          NEW.author_avatar := COALESCE(v_author_profile.avatar_url, NEW.author_avatar);
        END IF;
      END IF;

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

      -- Author metadata immutable directly via post update
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
        -- Verify internal single-use token
        IF current_setting('hanzigo.internal_counter_sync', true) = 'true' THEN
          -- Single-use token: consume and reset immediately to prevent transaction reuse
          PERFORM set_config('hanzigo.internal_counter_sync', '', true);
        ELSE
          RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
        END IF;
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
-- 2. HARDENED ATOMIC REACTION RPC
-- Returns post_id as string (Phase E contract), handles strict token lifecycle
-- =========================================================================

CREATE OR REPLACE FUNCTION public.toggle_community_post_reaction(
  p_post_id BIGINT,
  p_reaction_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_post RECORD;
  v_existing_reaction RECORD;
  v_action TEXT;
  v_user_reaction TEXT;
  v_new_likes_count INT;
BEGIN
  -- 1. Authentication check: strict auth.uid()
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Chưa đăng nhập: Thao tác tương tác yêu cầu đăng nhập tài khoản.' USING ERRCODE = '42501';
  END IF;

  -- 2. Parameter validation
  IF p_post_id IS NULL THEN
    RAISE EXCEPTION 'Tham số không hợp lệ: Thiếu post_id.' USING ERRCODE = '22023';
  END IF;

  IF p_reaction_type IS NULL OR p_reaction_type NOT IN ('like', 'heart', 'clap', 'bulb') THEN
    RAISE EXCEPTION 'Loại tương tác không hợp lệ: Chỉ chấp nhận like, heart, clap, bulb.' USING ERRCODE = '22023';
  END IF;

  -- 3. Row lock on post to guarantee serialization under concurrency
  SELECT id, status, deleted_at, likes_count
  INTO v_post
  FROM public.community_posts
  WHERE id = p_post_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bài viết không tồn tại.' USING ERRCODE = 'P0002';
  END IF;

  IF v_post.deleted_at IS NOT NULL OR v_post.status <> 'published' THEN
    RAISE EXCEPTION 'Bài viết đã bị xóa hoặc không cho phép tương tác.' USING ERRCODE = '22000';
  END IF;

  -- 4. Check existing reaction
  SELECT id, reaction_type
  INTO v_existing_reaction
  FROM public.community_reactions
  WHERE post_id = p_post_id AND user_id = v_user_id;

  -- 5. Business logic execution
  IF NOT FOUND THEN
    -- Case A: No previous reaction -> INSERT
    INSERT INTO public.community_reactions (post_id, user_id, reaction_type)
    VALUES (p_post_id, v_user_id, p_reaction_type);

    -- Enable single-use internal counter sync token
    PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);

    UPDATE public.community_posts
    SET likes_count = COALESCE(likes_count, 0) + 1,
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING likes_count INTO v_new_likes_count;

    -- Ensure token is cleared
    PERFORM set_config('hanzigo.internal_counter_sync', '', true);

    v_action := 'added';
    v_user_reaction := p_reaction_type;

  ELSIF v_existing_reaction.reaction_type = p_reaction_type THEN
    -- Case B: Same reaction type -> DELETE (Toggle off)
    DELETE FROM public.community_reactions
    WHERE id = v_existing_reaction.id;

    -- Enable single-use internal counter sync token
    PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);

    UPDATE public.community_posts
    SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1),
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING likes_count INTO v_new_likes_count;

    -- Ensure token is cleared
    PERFORM set_config('hanzigo.internal_counter_sync', '', true);

    v_action := 'removed';
    v_user_reaction := NULL;

  ELSE
    -- Case C: Different reaction type -> UPDATE
    UPDATE public.community_reactions
    SET reaction_type = p_reaction_type,
        created_at = NOW()
    WHERE id = v_existing_reaction.id;

    -- Total count does not change
    v_new_likes_count := v_post.likes_count;
    v_action := 'updated';
    v_user_reaction := p_reaction_type;
  END IF;

  -- 6. Return response contract with post_id as string (Phase E contract)
  RETURN jsonb_build_object(
    'success', true,
    'action', v_action,
    'post_id', p_post_id::text,
    'user_reaction', v_user_reaction,
    'likes_count', v_new_likes_count
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.toggle_community_post_reaction(BIGINT, TEXT) TO authenticated, service_role;

-- =========================================================================
-- 3. HARDENED COMMENT COUNTER TRIGGER
-- =========================================================================

CREATE OR REPLACE FUNCTION public.sync_community_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_old_valid BOOLEAN;
  v_new_valid BOOLEAN;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_new_valid := (NEW.status = 'published' AND NEW.deleted_at IS NULL);
    IF v_new_valid THEN
      PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
      UPDATE public.community_posts
      SET comments_count = COALESCE(comments_count, 0) + 1
      WHERE id = NEW.post_id;
      PERFORM set_config('hanzigo.internal_counter_sync', '', true);
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_old_valid := (OLD.status = 'published' AND OLD.deleted_at IS NULL);
    IF v_old_valid THEN
      PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
      UPDATE public.community_posts
      SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1)
      WHERE id = OLD.post_id;
      PERFORM set_config('hanzigo.internal_counter_sync', '', true);
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old_valid := (OLD.status = 'published' AND OLD.deleted_at IS NULL);
    v_new_valid := (NEW.status = 'published' AND NEW.deleted_at IS NULL);

    IF NEW.post_id IS DISTINCT FROM OLD.post_id THEN
      IF v_old_valid THEN
        PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
        UPDATE public.community_posts
        SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1)
        WHERE id = OLD.post_id;
        PERFORM set_config('hanzigo.internal_counter_sync', '', true);
      END IF;
      IF v_new_valid THEN
        PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
        UPDATE public.community_posts
        SET comments_count = COALESCE(comments_count, 0) + 1
        WHERE id = NEW.post_id;
        PERFORM set_config('hanzigo.internal_counter_sync', '', true);
      END IF;
    ELSE
      IF (NOT v_old_valid) AND v_new_valid THEN
        PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
        UPDATE public.community_posts
        SET comments_count = COALESCE(comments_count, 0) + 1
        WHERE id = NEW.post_id;
        PERFORM set_config('hanzigo.internal_counter_sync', '', true);
      ELSIF v_old_valid AND (NOT v_new_valid) THEN
        PERFORM set_config('hanzigo.internal_counter_sync', 'true', true);
        UPDATE public.community_posts
        SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1)
        WHERE id = NEW.post_id;
        PERFORM set_config('hanzigo.internal_counter_sync', '', true);
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_post_comments_count ON public.community_comments;
CREATE TRIGGER trg_sync_community_post_comments_count
  AFTER INSERT OR UPDATE OR DELETE ON public.community_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_community_post_comments_count();

-- =========================================================================
-- 4. HARDENED COUNTER AUDIT TELEMETRY FUNCTION
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
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    p.id AS post_id,
    p.author_name,
    p.likes_count AS stored_likes_count,
    COALESCE(r.reaction_cnt, 0) AS actual_reactions_count,
    COALESCE(p.likes, 0)::bigint AS legacy_likes_baseline,
    COALESCE(r.reaction_cnt, 0) AS new_reaction_count,
    (p.likes_count - (COALESCE(p.likes, 0) + COALESCE(r.reaction_cnt, 0)))::bigint AS likes_diff,
    p.comments_count AS stored_comments_count,
    COALESCE(c.comment_cnt, 0) AS actual_published_comments_count,
    (CASE WHEN jsonb_typeof(p.comments) = 'array' THEN jsonb_array_length(p.comments) ELSE 0 END)::bigint AS legacy_comments_baseline,
    (p.comments_count - (CASE WHEN jsonb_typeof(p.comments) = 'array' THEN jsonb_array_length(p.comments) ELSE 0 END + COALESCE(c.comment_cnt, 0)))::bigint AS comments_diff
  FROM public.community_posts p
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS reaction_cnt
    FROM public.community_reactions
    GROUP BY post_id
  ) r ON r.post_id = p.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS comment_cnt
    FROM public.community_comments
    WHERE status = 'published' AND deleted_at IS NULL
    GROUP BY post_id
  ) c ON c.post_id = p.id
  ORDER BY p.id ASC;
$$;

REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO authenticated, service_role;

