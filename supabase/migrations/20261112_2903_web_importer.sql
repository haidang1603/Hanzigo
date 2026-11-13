-- =========================================================================
-- MIGRATION: 20261112_2903_web_importer.sql
-- WEB CLIPPER, SMART ARTICLE IMPORTER & AI TEXT SIMPLIFIER (TASK 29.03)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.imported_web_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_url TEXT,
  domain_name TEXT NOT NULL DEFAULT 'custom_input',
  original_title_zh TEXT NOT NULL,
  hsk_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  versions JSONB NOT NULL DEFAULT '{}'::jsonb,
  extracted_key_vocab JSONB NOT NULL DEFAULT '[]'::jsonb,
  converted_article_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_imported_web_user_id ON public.imported_web_contents(user_id);
CREATE INDEX IF NOT EXISTS idx_imported_web_created ON public.imported_web_contents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imported_web_hsk_gin ON public.imported_web_contents USING gin(hsk_distribution);

-- Enable Row Level Security
ALTER TABLE public.imported_web_contents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own imported web articles or public samples" ON public.imported_web_contents;
CREATE POLICY "Users can view own imported web articles or public samples"
  ON public.imported_web_contents
  FOR SELECT
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can insert imported web articles" ON public.imported_web_contents;
CREATE POLICY "Users can insert imported web articles"
  ON public.imported_web_contents
  FOR INSERT
  WITH CHECK (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can update own imported web articles" ON public.imported_web_contents;
CREATE POLICY "Users can update own imported web articles"
  ON public.imported_web_contents
  FOR UPDATE
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  )
  WITH CHECK (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Users can delete own imported web articles" ON public.imported_web_contents;
CREATE POLICY "Users can delete own imported web articles"
  ON public.imported_web_contents
  FOR DELETE
  USING (
    user_id IS NULL OR
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

