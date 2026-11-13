-- =========================================================================
-- MIGRATION: 20261112_learning_data_foundation.sql
-- HanziGo Phase 26 / Task 26.01: Learning Data Foundation
-- Standardizes learning telemetry, skill metrics & granular error taxonomy
-- =========================================================================

-- 1. ENUM TYPES (IDEMPOTENT)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_source_module') THEN
    CREATE TYPE public.learning_source_module AS ENUM (
      'lesson',
      'srs_review',
      'hanzi_writer',
      'cbt_mock_exam',
      'writing_eval'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_skill_domain') THEN
    CREATE TYPE public.learning_skill_domain AS ENUM (
      'listening',
      'reading',
      'writing',
      'translation',
      'speaking',
      'vocabulary',
      'grammar',
      'stroke_order'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_error_category') THEN
    CREATE TYPE public.learning_error_category AS ENUM (
      'tone_confusion',
      'radical_stroke_error',
      'synonym_nuance',
      'word_order_syntax',
      'listening_homophone',
      'reading_inference',
      'translation_omission'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'learning_resolved_status') THEN
    CREATE TYPE public.learning_resolved_status AS ENUM (
      'active',
      'reviewing',
      'mastered'
    );
  END IF;
END
$$;

-- 2. TABLE: public.learning_telemetry_events
CREATE TABLE IF NOT EXISTS public.learning_telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  source_module public.learning_source_module NOT NULL,
  hsk_level INT NOT NULL CHECK (hsk_level >= 1 AND hsk_level <= 9),
  skill_domain public.learning_skill_domain NOT NULL,
  item_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score_earned NUMERIC NOT NULL DEFAULT 0,
  score_max NUMERIC NOT NULL DEFAULT 1,
  duration_ms INT NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLE: public.user_mistake_records (Error Taxonomy & Mistake Notebook)
CREATE TABLE IF NOT EXISTS public.user_mistake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  error_category public.learning_error_category NOT NULL,
  hsk_level INT NOT NULL CHECK (hsk_level >= 1 AND hsk_level <= 9),
  target_entity_id TEXT NOT NULL,
  user_answer JSONB NOT NULL DEFAULT '{}'::jsonb,
  expected_answer JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurrence_count INT NOT NULL DEFAULT 1 CHECK (occurrence_count >= 1),
  resolved_status public.learning_resolved_status NOT NULL DEFAULT 'active',
  last_mistake_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_mistake_entity UNIQUE (user_id, error_category, target_entity_id)
);

-- 4. COMPOSITE INDEXES
CREATE INDEX IF NOT EXISTS idx_learning_telemetry_user_created
  ON public.learning_telemetry_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_telemetry_user_module_skill
  ON public.learning_telemetry_events (user_id, source_module, skill_domain);

CREATE INDEX IF NOT EXISTS idx_user_mistake_records_user_cat_status
  ON public.user_mistake_records (user_id, error_category, resolved_status);

CREATE INDEX IF NOT EXISTS idx_user_mistake_records_user_recent
  ON public.user_mistake_records (user_id, last_mistake_at DESC);

-- 5. ATOMIC UPSERT RPC FOR MISTAKE RECORDS (INCREMENTS occurrence_count ON CONFLICT)
CREATE OR REPLACE FUNCTION public.upsert_user_mistake_record(
  p_error_category public.learning_error_category,
  p_hsk_level INT,
  p_target_entity_id TEXT,
  p_user_answer JSONB DEFAULT '{}'::jsonb,
  p_expected_answer JSONB DEFAULT '{}'::jsonb,
  p_last_mistake_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS public.user_mistake_records
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_result public.user_mistake_records;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.user_mistake_records (
    user_id,
    error_category,
    hsk_level,
    target_entity_id,
    user_answer,
    expected_answer,
    occurrence_count,
    resolved_status,
    last_mistake_at,
    updated_at
  )
  VALUES (
    v_uid,
    p_error_category,
    GREATEST(1, LEAST(9, COALESCE(p_hsk_level, 1))),
    p_target_entity_id,
    COALESCE(p_user_answer, '{}'::jsonb),
    COALESCE(p_expected_answer, '{}'::jsonb),
    1,
    'active',
    COALESCE(p_last_mistake_at, NOW()),
    NOW()
  )
  ON CONFLICT (user_id, error_category, target_entity_id)
  DO UPDATE SET
    hsk_level = EXCLUDED.hsk_level,
    user_answer = EXCLUDED.user_answer,
    expected_answer = EXCLUDED.expected_answer,
    occurrence_count = public.user_mistake_records.occurrence_count + 1,
    resolved_status = 'active',
    last_mistake_at = GREATEST(public.user_mistake_records.last_mistake_at, EXCLUDED.last_mistake_at),
    updated_at = NOW()
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.learning_telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistake_records ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES RESTRICTING READ/WRITE TO auth.uid() = user_id

-- learning_telemetry_events policies
DROP POLICY IF EXISTS "learning_telemetry_select_own" ON public.learning_telemetry_events;
CREATE POLICY "learning_telemetry_select_own" ON public.learning_telemetry_events
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "learning_telemetry_insert_own" ON public.learning_telemetry_events;
CREATE POLICY "learning_telemetry_insert_own" ON public.learning_telemetry_events
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "learning_telemetry_update_own" ON public.learning_telemetry_events;
CREATE POLICY "learning_telemetry_update_own" ON public.learning_telemetry_events
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "learning_telemetry_delete_own" ON public.learning_telemetry_events;
CREATE POLICY "learning_telemetry_delete_own" ON public.learning_telemetry_events
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- user_mistake_records policies
DROP POLICY IF EXISTS "user_mistake_records_select_own" ON public.user_mistake_records;
CREATE POLICY "user_mistake_records_select_own" ON public.user_mistake_records
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_mistake_records_insert_own" ON public.user_mistake_records;
CREATE POLICY "user_mistake_records_insert_own" ON public.user_mistake_records
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_mistake_records_update_own" ON public.user_mistake_records;
CREATE POLICY "user_mistake_records_update_own" ON public.user_mistake_records
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_mistake_records_delete_own" ON public.user_mistake_records;
CREATE POLICY "user_mistake_records_delete_own" ON public.user_mistake_records
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

