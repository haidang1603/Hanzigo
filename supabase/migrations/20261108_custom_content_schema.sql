-- =========================================================================
-- MIGRATION: 20261108_custom_content_schema.sql
-- HanziGo Phase 24 / Task 24.06: Custom Vocabulary & Lessons Supabase Integration
-- =========================================================================

-- 1. EXTEND public.vocabulary SCHEMA FOR ADMIN CUSTOM VOCABULARY MANAGEMENT
ALTER TABLE public.vocabulary
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for performant querying and filtering
CREATE INDEX IF NOT EXISTS idx_vocabulary_is_custom ON public.vocabulary(is_custom);
CREATE INDEX IF NOT EXISTS idx_vocabulary_is_hidden ON public.vocabulary(is_hidden);
CREATE INDEX IF NOT EXISTS idx_vocabulary_created_by ON public.vocabulary(created_by);
CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON public.vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_created_at ON public.vocabulary(created_at DESC);

-- 2. EXTEND public.lessons SCHEMA FOR ADMIN CUSTOM LESSONS MANAGEMENT
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for lessons
CREATE INDEX IF NOT EXISTS idx_lessons_is_custom ON public.lessons(is_custom);
CREATE INDEX IF NOT EXISTS idx_lessons_is_hidden ON public.lessons(is_hidden);
CREATE INDEX IF NOT EXISTS idx_lessons_created_by ON public.lessons(created_by);
CREATE INDEX IF NOT EXISTS idx_lessons_level_id ON public.lessons(level_id);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at DESC);

-- 3. HARDEN ROW LEVEL SECURITY (RLS) POLICIES FOR public.vocabulary
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vocabulary_select_public" ON public.vocabulary;
CREATE POLICY "vocabulary_select_public" ON public.vocabulary
  FOR SELECT
  USING ((is_hidden = false) OR public.is_admin());

DROP POLICY IF EXISTS "vocabulary_admin_insert" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_insert" ON public.vocabulary
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "vocabulary_admin_update" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_update" ON public.vocabulary
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "vocabulary_admin_delete" ON public.vocabulary;
CREATE POLICY "vocabulary_admin_delete" ON public.vocabulary
  FOR DELETE
  USING (public.is_admin());

-- 4. HARDEN ROW LEVEL SECURITY (RLS) POLICIES FOR public.lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons_select_public" ON public.lessons;
CREATE POLICY "lessons_select_public" ON public.lessons
  FOR SELECT
  USING ((is_hidden = false) OR public.is_admin());

DROP POLICY IF EXISTS "lessons_admin_insert" ON public.lessons;
CREATE POLICY "lessons_admin_insert" ON public.lessons
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lessons_admin_update" ON public.lessons;
CREATE POLICY "lessons_admin_update" ON public.lessons
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lessons_admin_delete" ON public.lessons;
CREATE POLICY "lessons_admin_delete" ON public.lessons
  FOR DELETE
  USING (public.is_admin());

-- 5. REALTIME PUBLICATION ENROLLMENT FOR CUSTOM CONTENT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'vocabulary'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vocabulary;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'lessons'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'materials'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Publication might not exist in standalone unit test environments
  NULL;
END $$;

