-- =========================================================================
-- HSK EXAM PAPERS & QUESTION BANK REPOSITORY
-- Supports structured full-paper import (Listening / Reading / Writing)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.hsk_exam_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_code TEXT NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 6),
  paper_type TEXT NOT NULL CHECK (paper_type IN ('official_past_paper', 'ai_simulated', 'sectional_drill')),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  max_score INT NOT NULL CHECK (max_score > 0),
  passing_score INT NOT NULL CHECK (passing_score > 0 AND passing_score <= max_score),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hsk_question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_code TEXT NOT NULL REFERENCES public.hsk_exam_papers(paper_code) ON DELETE CASCADE,
  hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 6),
  section TEXT NOT NULL CHECK (section IN ('listening', 'reading', 'writing')),
  part_number SMALLINT NOT NULL CHECK (part_number >= 1),
  question_number_start INT NOT NULL CHECK (question_number_start >= 1),
  question_number_end INT NOT NULL CHECK (question_number_end >= question_number_start),
  question_type TEXT NOT NULL,
  stimulus_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  sub_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_vocab TEXT[] NOT NULL DEFAULT '{}',
  target_grammar_codes TEXT[] NOT NULL DEFAULT '{}',
  difficulty SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 9),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hsk_exam_papers_level_type
  ON public.hsk_exam_papers (hsk_level, paper_type, is_published);

CREATE INDEX IF NOT EXISTS idx_hsk_question_bank_paper_section
  ON public.hsk_question_bank (paper_code, section, part_number, question_number_start);

CREATE INDEX IF NOT EXISTS idx_hsk_question_bank_vocab_gin
  ON public.hsk_question_bank USING GIN (target_vocab);

ALTER TABLE public.hsk_exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_question_bank ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published hsk_exam_papers" ON public.hsk_exam_papers;
CREATE POLICY "Public can read published hsk_exam_papers"
  ON public.hsk_exam_papers
  FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins and teachers can manage hsk_exam_papers" ON public.hsk_exam_papers;
CREATE POLICY "Admins and teachers can manage hsk_exam_papers"
  ON public.hsk_exam_papers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')
    )
  );

DROP POLICY IF EXISTS "Public can read published hsk_question_bank" ON public.hsk_question_bank;
CREATE POLICY "Public can read published hsk_question_bank"
  ON public.hsk_question_bank
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hsk_exam_papers ep
      WHERE ep.paper_code = hsk_question_bank.paper_code AND ep.is_published = true
    )
  );

DROP POLICY IF EXISTS "Admins and teachers can manage hsk_question_bank" ON public.hsk_question_bank;
CREATE POLICY "Admins and teachers can manage hsk_question_bank"
  ON public.hsk_question_bank
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')
    )
  );

