-- TASK 29.05: HSK 3.0 (LEVELS 7-9), SPECIALIZED CHINESE & TRANSLATION STUDIO
-- Migration: 20261112_2905_hsk30_translation.sql

-- 1. Table: specialized_domain_packs
CREATE TABLE IF NOT EXISTS public.specialized_domain_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_vi TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  terminology_list JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_specialized_domain_packs_slug
  ON public.specialized_domain_packs (slug);
CREATE INDEX IF NOT EXISTS idx_specialized_domain_packs_terminology
  ON public.specialized_domain_packs USING GIN (terminology_list);

-- 2. Table: translation_drills
CREATE TABLE IF NOT EXISTS public.translation_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction TEXT NOT NULL CHECK (direction IN ('zh_to_vi', 'vi_to_zh')),
  level TEXT NOT NULL CHECK (level IN ('hsk3', 'hsk4', 'hsk5', 'hsk6', 'hsk7_9', 'it_business')),
  domain_slug TEXT NOT NULL,
  source_text TEXT NOT NULL,
  reference_translations TEXT[] NOT NULL DEFAULT '{}'::text[],
  required_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  translation_pitfalls_vi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translation_drills_direction_level
  ON public.translation_drills (direction, level);
CREATE INDEX IF NOT EXISTS idx_translation_drills_domain
  ON public.translation_drills (domain_slug);

-- 3. Table: user_translation_submissions
CREATE TABLE IF NOT EXISTS public.user_translation_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_id UUID REFERENCES public.translation_drills(id) ON DELETE SET NULL,
  user_output TEXT NOT NULL,
  accuracy_score SMALLINT NOT NULL CHECK (accuracy_score BETWEEN 0 AND 100),
  naturalness_score SMALLINT NOT NULL CHECK (naturalness_score BETWEEN 0 AND 100),
  grammar_score SMALLINT NOT NULL CHECK (grammar_score BETWEEN 0 AND 100),
  ai_critique JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_translation_submissions_user_created
  ON public.user_translation_submissions (user_id, created_at DESC);

-- 4. Row-Level Security (RLS)
ALTER TABLE public.specialized_domain_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_translation_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to specialized_domain_packs" ON public.specialized_domain_packs;
CREATE POLICY "Allow read access to specialized_domain_packs"
  ON public.specialized_domain_packs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow read access to translation_drills" ON public.translation_drills;
CREATE POLICY "Allow read access to translation_drills"
  ON public.translation_drills FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can read own translation submissions" ON public.user_translation_submissions;
CREATE POLICY "Users can read own translation submissions"
  ON public.user_translation_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own translation submissions" ON public.user_translation_submissions;
CREATE POLICY "Users can insert own translation submissions"
  ON public.user_translation_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

