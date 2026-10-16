-- =========================================================================
-- HANZIGO MIGRATION: PHASE 3 - HSK EXAM CENTER & MISTAKES NOTEBOOK
-- Migration: 20261016_phase3_hsk_exam_center.sql
-- Description: Ensures tables, constraints, anti-cheat view, and RLS policies
--              for HSK exams, questions, attempts, mistakes, and structures.
-- =========================================================================

-- 1. Ensure hsk_exam_structures table exists
CREATE TABLE IF NOT EXISTS public.hsk_exam_structures (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '2015-Standard',
  total_questions INTEGER NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  passing_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  audio_play_count INTEGER DEFAULT 2,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_reference TEXT NOT NULL DEFAULT 'chinesetest.cn',
  source_url TEXT DEFAULT 'http://www.chinesetest.cn/',
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified_transition', 'official_standard')),
  verified_date DATE DEFAULT CURRENT_DATE,
  unverified_fields JSONB DEFAULT '[]'::jsonb,
  notes_vi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_structures_level ON public.hsk_exam_structures(level);
CREATE INDEX IF NOT EXISTS idx_hsk_structures_version ON public.hsk_exam_structures(version);

-- 2. Ensure hsk_exams table exists
CREATE TABLE IF NOT EXISTS public.hsk_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  exam_version TEXT NOT NULL DEFAULT '2015-Standard',
  exam_type TEXT NOT NULL DEFAULT 'mock',
  skill_category TEXT NOT NULL DEFAULT 'mixed',
  duration_minutes INTEGER NOT NULL DEFAULT 40,
  total_questions INTEGER NOT NULL DEFAULT 20,
  passing_score INTEGER NOT NULL DEFAULT 120,
  max_score INTEGER NOT NULL DEFAULT 200,
  description TEXT,
  source_url TEXT,
  source_author TEXT,
  license TEXT DEFAULT 'CC BY-NC-SA 4.0 / HanziGo Educational Content',
  permission_status TEXT NOT NULL DEFAULT 'reproducible',
  review_status TEXT NOT NULL DEFAULT 'published' CHECK (review_status IN ('draft', 'needs_review', 'approved', 'published', 'rejected', 'archived')),
  difficulty_estimate TEXT NOT NULL DEFAULT 'standard',
  audio_play_limit INTEGER DEFAULT 2,
  verified_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_exams_level ON public.hsk_exams(level);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_published ON public.hsk_exams(is_published);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_skill ON public.hsk_exams(skill_category);
CREATE INDEX IF NOT EXISTS idx_hsk_exams_type ON public.hsk_exams(exam_type);

-- 3. Ensure hsk_questions table exists
CREATE TABLE IF NOT EXISTS public.hsk_questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  part_type TEXT NOT NULL,
  part_number INTEGER NOT NULL DEFAULT 1,
  question_number INTEGER NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  prompt TEXT NOT NULL,
  pinyin TEXT,
  translation TEXT,
  audio_url TEXT,
  audio_script TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 5,
  words JSONB DEFAULT '[]'::jsonb,
  correct_order JSONB DEFAULT '[]'::jsonb,
  accepted_answers JSONB DEFAULT '[]'::jsonb,
  writing_criteria JSONB DEFAULT '[]'::jsonb,
  sample_answer TEXT,
  min_words INTEGER DEFAULT 0,
  max_words INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_questions_exam ON public.hsk_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_hsk_questions_number ON public.hsk_questions(exam_id, question_number);

-- 4. Ensure hsk_attempts table exists
CREATE TABLE IF NOT EXISTS public.hsk_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_session_id TEXT,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  exam_mode TEXT NOT NULL DEFAULT 'simulation' CHECK (exam_mode IN ('simulation', 'practice')),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  submitted_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  writing_answers JSONB DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 200,
  accuracy_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  skill_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  detailed_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_attempts_user ON public.hsk_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_session ON public.hsk_attempts(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_hsk_attempts_exam ON public.hsk_attempts(exam_id);

-- 5. Ensure hsk_mistakes table exists with deterministic primary key
CREATE TABLE IF NOT EXISTS public.hsk_mistakes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_session_id TEXT,
  question_id TEXT NOT NULL,
  exam_id TEXT NOT NULL REFERENCES public.hsk_exams(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'HSK 1',
  part_type TEXT NOT NULL DEFAULT 'general',
  category TEXT DEFAULT 'Tổng hợp',
  prompt TEXT NOT NULL,
  pinyin TEXT,
  translation TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_answer_index INTEGER,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  mistake_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review', 'mastered')),
  last_attempt_id TEXT REFERENCES public.hsk_attempts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_user ON public.hsk_mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_session ON public.hsk_mistakes(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_question ON public.hsk_mistakes(question_id);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_status ON public.hsk_mistakes(status);
CREATE INDEX IF NOT EXISTS idx_hsk_mistakes_level ON public.hsk_mistakes(level);

-- Unique index for user mistakes deduplication
CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_user_question 
  ON public.hsk_mistakes(user_id, question_id) 
  WHERE user_id IS NOT NULL;

-- Unique index for guest mistakes deduplication
CREATE UNIQUE INDEX IF NOT EXISTS uq_hsk_mistakes_session_question 
  ON public.hsk_mistakes(anonymous_session_id, question_id) 
  WHERE anonymous_session_id IS NOT NULL AND user_id IS NULL;

-- 6. Anti-Cheat Security View: Sanitized Questions for Taking Exams
DROP VIEW IF EXISTS public.v_hsk_questions_public CASCADE;
CREATE VIEW public.v_hsk_questions_public 
WITH (security_invoker = true) AS
  SELECT 
    id,
    exam_id,
    part_type,
    part_number,
    question_number,
    question_type,
    prompt,
    pinyin,
    translation,
    audio_url,
    audio_script,
    options,
    words,
    writing_criteria,
    min_words,
    max_words,
    points
  FROM public.hsk_questions;

-- 7. Enable RLS and Configure Zero-Trust Policies
ALTER TABLE public.hsk_exam_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_mistakes ENABLE ROW LEVEL SECURITY;

-- 7.1. hsk_exam_structures policies
DROP POLICY IF EXISTS "hsk_exam_structures_public_read" ON public.hsk_exam_structures;
CREATE POLICY "hsk_exam_structures_public_read" ON public.hsk_exam_structures FOR SELECT USING (true);

DROP POLICY IF EXISTS "hsk_exam_structures_admin_all" ON public.hsk_exam_structures;
CREATE POLICY "hsk_exam_structures_admin_all" ON public.hsk_exam_structures FOR ALL USING (public.is_admin());

-- 7.2. hsk_exams policies
DROP POLICY IF EXISTS "hsk_exams_public_read" ON public.hsk_exams;
CREATE POLICY "hsk_exams_public_read" ON public.hsk_exams FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "hsk_exams_admin_all" ON public.hsk_exams;
CREATE POLICY "hsk_exams_admin_all" ON public.hsk_exams FOR ALL USING (public.is_admin());

-- 7.3. hsk_questions policies
DROP POLICY IF EXISTS "hsk_questions_admin_all" ON public.hsk_questions;
CREATE POLICY "hsk_questions_admin_all" ON public.hsk_questions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "hsk_questions_read_published" ON public.hsk_questions;
CREATE POLICY "hsk_questions_read_published" ON public.hsk_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hsk_exams 
    WHERE id = hsk_questions.exam_id AND is_published = true
  ) OR public.is_admin()
);

-- 7.4. hsk_attempts policies
DROP POLICY IF EXISTS "hsk_attempts_insert_public" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_insert_public" ON public.hsk_attempts FOR INSERT WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL) OR
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_attempts_select_owner" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_select_owner" ON public.hsk_attempts FOR SELECT USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_attempts_no_update" ON public.hsk_attempts;
CREATE POLICY "hsk_attempts_no_update" ON public.hsk_attempts FOR UPDATE USING (public.is_admin());

-- 7.5. hsk_mistakes policies
DROP POLICY IF EXISTS "hsk_mistakes_select_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_select_owner" ON public.hsk_mistakes FOR SELECT USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_insert_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_insert_owner" ON public.hsk_mistakes FOR INSERT WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_update_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_update_owner" ON public.hsk_mistakes FOR UPDATE USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);

DROP POLICY IF EXISTS "hsk_mistakes_delete_owner" ON public.hsk_mistakes;
CREATE POLICY "hsk_mistakes_delete_owner" ON public.hsk_mistakes FOR DELETE USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND user_id IS NULL AND anonymous_session_id IS NOT NULL) OR
  public.is_admin()
);
