-- TASK 29.07: TEXTBOOK CURRICULUM COMPANION
-- Migration: 20261112_2907_textbook_companion.sql

-- 1. Table: textbook_series
CREATE TABLE IF NOT EXISTS public.textbook_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_slug TEXT NOT NULL UNIQUE,
  title_vi TEXT NOT NULL,
  publisher TEXT NOT NULL,
  total_volumes SMALLINT NOT NULL DEFAULT 6 CHECK (total_volumes BETWEEN 1 AND 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_textbook_series_slug ON public.textbook_series (series_slug);

-- 2. Table: textbook_units
CREATE TABLE IF NOT EXISTS public.textbook_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES public.textbook_series(id) ON DELETE CASCADE,
  volume_number SMALLINT NOT NULL CHECK (volume_number >= 1),
  unit_number SMALLINT NOT NULL CHECK (unit_number >= 1),
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  unit_vocab_list JSONB NOT NULL DEFAULT '[]'::jsonb,
  unit_grammar_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  unit_reading_article_id UUID NULL,
  unit_listening_track_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (series_id, volume_number, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_textbook_units_series_vol ON public.textbook_units (series_id, volume_number, unit_number);
CREATE INDEX IF NOT EXISTS idx_textbook_units_vocab ON public.textbook_units USING GIN (unit_vocab_list);

-- 3. Table: user_textbook_enrollments
CREATE TABLE IF NOT EXISTS public.user_textbook_enrollments (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  series_id UUID NOT NULL REFERENCES public.textbook_series(id) ON DELETE CASCADE,
  current_volume SMALLINT NOT NULL DEFAULT 1,
  current_unit SMALLINT NOT NULL DEFAULT 1,
  completed_unit_ids UUID[] NOT NULL DEFAULT '{}'::uuid[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, series_id)
);

CREATE INDEX IF NOT EXISTS idx_user_textbook_enrollments_user ON public.user_textbook_enrollments (user_id);

-- 4. Row-Level Security (RLS)
ALTER TABLE public.textbook_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbook_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_textbook_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to textbook_series" ON public.textbook_series;
CREATE POLICY "Allow read access to textbook_series"
  ON public.textbook_series FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow read access to textbook_units" ON public.textbook_units;
CREATE POLICY "Allow read access to textbook_units"
  ON public.textbook_units FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage own textbook enrollments" ON public.user_textbook_enrollments;
CREATE POLICY "Users can manage own textbook enrollments"
  ON public.user_textbook_enrollments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

