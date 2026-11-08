-- =========================================================================
-- HANZIGO COMMUNITY PLATFORM — PHASE 24 / TASK 24.08C
-- LEGACY DATA MIGRATION: JSONB COMMENTS & LIKES TO RELATIONAL TABLES
-- File: supabase/migrations/20261108_community_legacy_data_migration.sql
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. PRE-MIGRATION SAFETY CHECK & AUDIT
-- -------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') THEN
    RAISE EXCEPTION 'Bảng public.community_posts không tồn tại. Không thể tiến hành migration.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') THEN
    RAISE EXCEPTION 'Bảng public.community_comments không tồn tại. Vui lòng chạy migration 24.08A trước.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_reactions') THEN
    RAISE EXCEPTION 'Bảng public.community_reactions không tồn tại. Vui lòng chạy migration 24.08A trước.';
  END IF;
END $$;

-- -------------------------------------------------------------------------
-- 2. TEMPORARILY SUSPEND COUNTER TRIGGERS TO PREVENT DOUBLE-COUNTING
-- -------------------------------------------------------------------------
ALTER TABLE public.community_comments DISABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts DISABLE TRIGGER trg_enforce_community_post_integrity;

-- -------------------------------------------------------------------------
-- 3. MIGRATE LEGACY JSONB COMMENTS TO public.community_comments
-- -------------------------------------------------------------------------
-- Extract each element from community_posts.comments (if valid JSON array).
-- Match author name with public.profiles(name).
-- If no profile found, author_id is set to NULL (supported by nullable schema).
-- Prevent duplicate insertion by checking (post_id, content).
INSERT INTO public.community_comments (
  post_id,
  author_id,
  content,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS post_id,
  (
    SELECT pr.id 
    FROM public.profiles pr 
    WHERE pr.name = TRIM(elem->>'author') 
       OR pr.name = TRIM(elem->>'author_name')
    ORDER BY pr.created_at ASC 
    LIMIT 1
  ) AS author_id,
  TRIM(elem->>'content') AS content,
  'published' AS status,
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
) AS elem
WHERE elem->>'content' IS NOT NULL 
  AND TRIM(elem->>'content') <> ''
  AND NOT EXISTS (
    SELECT 1 
    FROM public.community_comments c 
    WHERE c.post_id = p.id 
      AND c.content = TRIM(elem->>'content')
  );

-- -------------------------------------------------------------------------
-- 4. MIGRATE LEGACY LIKED_BY USERS TO public.community_reactions
-- -------------------------------------------------------------------------
-- Extract user identifiers from community_posts.liked_by (if valid JSON array).
-- Match valid UUID or name to public.profiles(name).
-- Ensure idempotent insert with ON CONFLICT (post_id, user_id) DO NOTHING.
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
JOIN public.profiles pr ON (pr.id::text = val OR pr.name = val)
ON CONFLICT (post_id, user_id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 5. RECONCILE COUNTERS DETERMINISTICALLY (NO DOUBLE-COUNTING)
-- -------------------------------------------------------------------------
-- Update comments_count strictly to reflect total published comments
UPDATE public.community_posts p
SET comments_count = (
  SELECT COUNT(*)
  FROM public.community_comments c
  WHERE c.post_id = p.id 
    AND c.status = 'published' 
    AND c.deleted_at IS NULL
);

-- Update likes_count preserving legacy baseline unattributed likes:
-- likes_count = actual_reactions_count + legacy_unattributed_likes
-- legacy_unattributed_likes = GREATEST(0, COALESCE(p.likes, 0) - migrated_reactions_count)
UPDATE public.community_posts p
SET likes_count = (
  SELECT COUNT(*)
  FROM public.community_reactions r
  WHERE r.post_id = p.id
) + GREATEST(
  0,
  COALESCE(p.likes, 0) - (
    SELECT COUNT(*)
    FROM public.community_reactions r2
    WHERE r2.post_id = p.id
  )
);

-- -------------------------------------------------------------------------
-- 6. UPDATE POST INTEGRITY TRIGGER FUNCTION & RE-ENABLE TRIGGERS
-- -------------------------------------------------------------------------
-- Align column references with public.profiles (name, avatar, role)
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

  -- INSERT LOGIC
  IF TG_OP = 'INSERT' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS NOT NULL AND NEW.author_id <> auth.uid() THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tạo bài viết dưới danh nghĩa người dùng khác.';
      END IF;

      NEW.author_id := auth.uid();

      IF auth.uid() IS NOT NULL THEN
        SELECT name, avatar, role INTO v_author_profile
        FROM public.profiles
        WHERE id = auth.uid();

        IF FOUND THEN
          NEW.author_name := COALESCE(v_author_profile.name, NEW.author_name, 'Học viên HanziGo');
          NEW.author_avatar := COALESCE(v_author_profile.avatar, NEW.author_avatar);
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

  -- UPDATE LOGIC
  IF TG_OP = 'UPDATE' THEN
    IF NOT v_is_admin THEN
      IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể chuyển quyền sở hữu tác giả bài viết.';
      END IF;

      IF (NEW.author_name IS DISTINCT FROM OLD.author_name) OR
         (NEW.author_avatar IS DISTINCT FROM OLD.author_avatar) OR
         (NEW.author_level IS DISTINCT FROM OLD.author_level) THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi trực tiếp thông tin tác giả trên bài viết.';
      END IF;

      IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể sửa đổi thời gian tạo bài viết.';
      END IF;

      IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền thay đổi trạng thái kiểm duyệt bài viết.';
      END IF;

      IF NEW.is_pinned IS DISTINCT FROM OLD.is_pinned THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ quản trị viên mới có quyền ghim bài viết.';
      END IF;

      IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
        RAISE EXCEPTION 'Quyền hạn bị từ chối: Không thể tự ý sửa đổi mốc thời gian xóa bài viết.';
      END IF;

      IF (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR 
         (NEW.comments_count IS DISTINCT FROM OLD.comments_count) OR
         (NEW.likes IS DISTINCT FROM OLD.likes) OR
         (NEW.liked_by IS DISTINCT FROM OLD.liked_by) OR
         (NEW.comments IS DISTINCT FROM OLD.comments) THEN
        IF current_setting('hanzigo.internal_counter_sync', true) = 'true' THEN
          PERFORM set_config('hanzigo.internal_counter_sync', '', true);
        ELSE
          RAISE EXCEPTION 'Quyền hạn bị từ chối: Số lượt thích và bình luận chỉ được cập nhật qua tương tác hợp lệ.';
        END IF;
      END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

ALTER TABLE public.community_comments ENABLE TRIGGER trg_sync_community_post_comments_count;
ALTER TABLE public.community_posts ENABLE TRIGGER trg_enforce_community_post_integrity;

-- -------------------------------------------------------------------------
-- 7. REFRESH TELEMETRY FUNCTION: audit_community_post_counters()
-- -------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.audit_community_post_counters();

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
    GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0))::bigint AS legacy_likes_baseline,
    COALESCE(r.reaction_cnt, 0) AS new_reaction_count,
    (p.likes_count - (
      GREATEST(0, COALESCE(p.likes, 0) - COALESCE(r.reaction_cnt, 0)) + COALESCE(r.reaction_cnt, 0)
    ))::bigint AS likes_diff,
    p.comments_count AS stored_comments_count,
    COALESCE(c.comment_cnt, 0) AS actual_published_comments_count,
    COALESCE(c.comment_cnt, 0)::bigint AS legacy_comments_baseline,
    (p.comments_count - COALESCE(c.comment_cnt, 0))::bigint AS comments_diff
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
