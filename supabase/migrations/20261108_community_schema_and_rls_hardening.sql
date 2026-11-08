-- =========================================================================
-- MIGRATION: 20261108_community_schema_and_rls_hardening.sql
-- HanziGo Phase 24 / Task 24.08A: Community Database Schema Migration & RLS Hardening
-- =========================================================================

-- 1. PRESERVE & EXTEND public.community_posts
-- Do NOT DROP table, preserve existing BIGSERIAL id and all legacy columns (comments, liked_by, likes).
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_solved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Backfill counts from existing legacy columns safely without data loss
UPDATE public.community_posts
SET 
  likes_count = COALESCE(likes, 0),
  comments_count = CASE 
    WHEN comments IS NOT NULL AND jsonb_typeof(comments) = 'array' THEN jsonb_array_length(comments)
    ELSE 0
  END
WHERE likes_count = 0 AND comments_count = 0;

-- Indexes for performant community_posts feed querying
CREATE INDEX IF NOT EXISTS idx_community_posts_status_created 
  ON public.community_posts (status, is_pinned DESC, created_at DESC) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_community_posts_tag 
  ON public.community_posts (tag) 
  WHERE status = 'published' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_community_posts_author_id 
  ON public.community_posts (author_id);

-- 2. CREATE public.community_comments
-- Supports independent comments, pagination, soft-delete, references BIGINT community_posts(id)
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id BIGINT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_created 
  ON public.community_comments (post_id, created_at ASC) 
  WHERE status = 'published' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_community_comments_author_id 
  ON public.community_comments (author_id);

-- 3. CREATE public.community_reactions
-- Unique constraint enforces one reaction per user per post, references BIGINT community_posts(id)
CREATE TABLE IF NOT EXISTS public.community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id BIGINT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_community_reactions_post_user UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id 
  ON public.community_reactions (post_id);

CREATE INDEX IF NOT EXISTS idx_community_reactions_user_id 
  ON public.community_reactions (user_id);

-- 4. CREATE public.community_reports
-- Check constraint enforces that report targets EITHER a post OR a comment (mutually exclusive target)
CREATE TABLE IF NOT EXISTS public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id BIGINT REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'other')),
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_report_target_xor CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_community_reports_status_created 
  ON public.community_reports (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_reports_reporter_id 
  ON public.community_reports (reporter_id);

-- 5. CREATE public.community_moderation_logs
-- Immutable audit log for administrative moderation actions
CREATE TABLE IF NOT EXISTS public.community_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment', 'report')),
  target_id TEXT NOT NULL,
  action VARCHAR(30) NOT NULL CHECK (action IN ('hide', 'restore', 'delete', 'dismiss_report', 'pin', 'unpin')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_mod_logs_created 
  ON public.community_moderation_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_mod_logs_target 
  ON public.community_moderation_logs (target_type, target_id);

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- 6.1. HARDEN RLS ON public.community_posts
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
    (
      -- Normal users can only update content, tag, is_solved on active posts
      (auth.uid() IS NOT NULL AND auth.uid() = author_id)
      AND (status = 'published' OR status IS NULL)
      AND (is_pinned IS NOT TRUE OR public.is_admin())
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "community_posts_delete" ON public.community_posts;
CREATE POLICY "community_posts_delete" ON public.community_posts
  FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = author_id)
    OR public.is_admin()
  );

-- 6.2. HARDEN RLS ON public.community_comments
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

-- 6.3. HARDEN RLS ON public.community_reactions
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

-- 6.4. HARDEN RLS ON public.community_reports
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

-- 6.5. HARDEN RLS ON public.community_moderation_logs
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
    AND auth.uid() = admin_id
  );

-- Moderation logs are immutable: NO UPDATE or DELETE allowed for non-superusers
DROP POLICY IF EXISTS "community_mod_logs_no_update" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_no_update" ON public.community_moderation_logs
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "community_mod_logs_no_delete" ON public.community_moderation_logs;
CREATE POLICY "community_mod_logs_no_delete" ON public.community_moderation_logs
  FOR DELETE
  USING (false);

-- =========================================================================
-- 7. GRANT PERMISSIONS TO authenticated AND anon ROLES
-- =========================================================================
GRANT SELECT ON public.community_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;

GRANT SELECT ON public.community_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;

GRANT SELECT ON public.community_reactions TO anon, authenticated;
GRANT INSERT, DELETE ON public.community_reactions TO authenticated;

GRANT SELECT, INSERT ON public.community_reports TO authenticated;
GRANT UPDATE, DELETE ON public.community_reports TO authenticated; -- Only effectively usable by admins via RLS

GRANT SELECT, INSERT ON public.community_moderation_logs TO authenticated; -- Only usable by admins via RLS

-- =========================================================================
-- 8. REALTIME PUBLICATION REGISTRATION
-- Enroll community tables in supabase_realtime publication safely
-- =========================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;
  END IF;
END $$;

