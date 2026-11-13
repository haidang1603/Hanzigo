-- ============================================================================
-- Migration 41: Classroom HSK Assignments & Live Whiteboard Schema
-- Task 33.01: Assignments, Submissions, Whiteboard Snapshots, RLS & Analytics RPC
-- PostgreSQL 15+ | Idempotent
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLE: public.classroom_hsk_assignments
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.classroom_hsk_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  assignment_type TEXT NOT NULL CHECK (
    assignment_type IN ('hsk_mock_exam', 'reading_article', 'vocab_deck_srs', 'hanzi_writing_drill')
  ),
  target_resource_id TEXT NOT NULL,
  hsk_level SMALLINT NOT NULL DEFAULT 3 CHECK (hsk_level BETWEEN 1 AND 9),
  due_at TIMESTAMPTZ,
  allow_late_submission BOOLEAN NOT NULL DEFAULT TRUE,
  max_attempts SMALLINT NOT NULL DEFAULT 1 CHECK (max_attempts >= 1),
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classroom_hsk_assignments_classroom
  ON public.classroom_hsk_assignments (classroom_id, published, due_at);

CREATE INDEX IF NOT EXISTS idx_classroom_hsk_assignments_teacher
  ON public.classroom_hsk_assignments (teacher_id, created_at DESC);

-- ============================================================================
-- 2. TABLE: public.classroom_assignment_submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.classroom_assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.classroom_hsk_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  hsk_attempt_id UUID,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (
    status IN ('assigned', 'in_progress', 'submitted', 'graded')
  ),
  total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  max_score SMALLINT NOT NULL DEFAULT 300 CHECK (max_score > 0),
  accuracy_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (accuracy_pct >= 0 AND accuracy_pct <= 100),
  wrong_question_numbers INT[] NOT NULL DEFAULT '{}'::INT[],
  weak_vocab_words TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  weak_grammar_codes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  teacher_feedback TEXT,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_classroom_assignment_student UNIQUE (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_classroom_submissions_assignment_status
  ON public.classroom_assignment_submissions (assignment_id, status);

CREATE INDEX IF NOT EXISTS idx_classroom_submissions_student
  ON public.classroom_assignment_submissions (student_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_classroom_submissions_weak_vocab_gin
  ON public.classroom_assignment_submissions USING GIN (weak_vocab_words);

-- ============================================================================
-- 3. TABLE: public.live_whiteboard_snapshots
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.live_whiteboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by UUID,
  character_zh TEXT,
  board_state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_whiteboard_snapshots_classroom
  ON public.live_whiteboard_snapshots (classroom_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_live_whiteboard_snapshots_session
  ON public.live_whiteboard_snapshots (session_id, created_at DESC);

-- ============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.classroom_hsk_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_whiteboard_snapshots ENABLE ROW LEVEL SECURITY;

-- 4.1 classroom_hsk_assignments
DROP POLICY IF EXISTS "classroom_assignments_teacher_admin_all" ON public.classroom_hsk_assignments;
CREATE POLICY "classroom_assignments_teacher_admin_all"
  ON public.classroom_hsk_assignments
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_id AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "classroom_assignments_student_select" ON public.classroom_hsk_assignments;
CREATE POLICY "classroom_assignments_student_select"
  ON public.classroom_hsk_assignments
  FOR SELECT
  TO authenticated
  USING (
    published = TRUE
    AND EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.classroom_id = classroom_hsk_assignments.classroom_id
        AND cm.student_id = auth.uid()
        AND cm.status = 'active'
    )
  );

-- 4.2 classroom_assignment_submissions
DROP POLICY IF EXISTS "classroom_submissions_teacher_admin_all" ON public.classroom_assignment_submissions;
CREATE POLICY "classroom_submissions_teacher_admin_all"
  ON public.classroom_assignment_submissions
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.classroom_hsk_assignments a
      JOIN public.classrooms c ON c.id = a.classroom_id
      WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.classroom_hsk_assignments a
      JOIN public.classrooms c ON c.id = a.classroom_id
      WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "classroom_submissions_student_own" ON public.classroom_assignment_submissions;
CREATE POLICY "classroom_submissions_student_own"
  ON public.classroom_assignment_submissions
  FOR ALL
  TO authenticated
  USING (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.classroom_hsk_assignments a
      JOIN public.class_members cm ON cm.classroom_id = a.classroom_id
      WHERE a.id = assignment_id
        AND cm.student_id = auth.uid()
        AND cm.status = 'active'
    )
  )
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.classroom_hsk_assignments a
      JOIN public.class_members cm ON cm.classroom_id = a.classroom_id
      WHERE a.id = assignment_id
        AND cm.student_id = auth.uid()
        AND cm.status = 'active'
    )
  );

-- 4.3 live_whiteboard_snapshots
DROP POLICY IF EXISTS "live_whiteboard_teacher_admin_all" ON public.live_whiteboard_snapshots;
CREATE POLICY "live_whiteboard_teacher_admin_all"
  ON public.live_whiteboard_snapshots
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_id AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "live_whiteboard_student_select" ON public.live_whiteboard_snapshots;
CREATE POLICY "live_whiteboard_student_select"
  ON public.live_whiteboard_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.classroom_id = live_whiteboard_snapshots.classroom_id
        AND cm.student_id = auth.uid()
        AND cm.status = 'active'
    )
  );

-- ============================================================================
-- 5. RPC: public.get_classroom_assignment_analytics(p_assignment_id UUID)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_classroom_assignment_analytics(
  p_assignment_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_classroom_id UUID;
  v_total_students INT := 0;
  v_submitted_count INT := 0;
  v_avg_score NUMERIC(6,2) := 0;
  v_pass_rate_pct NUMERIC(5,2) := 0;
  v_top_missed JSONB := '[]'::jsonb;
  v_top_weak_vocab JSONB := '[]'::jsonb;
BEGIN
  SELECT classroom_id
  INTO v_classroom_id
  FROM public.classroom_hsk_assignments
  WHERE id = p_assignment_id;

  IF v_classroom_id IS NULL THEN
    RETURN jsonb_build_object(
      'assignment_id', p_assignment_id,
      'total_students', 0,
      'submitted_count', 0,
      'avg_score', 0,
      'pass_rate_pct', 0,
      'top_missed_questions', '[]'::jsonb,
      'top_weak_vocab', '[]'::jsonb
    );
  END IF;

  SELECT COUNT(*)::int
  INTO v_total_students
  FROM public.class_members
  WHERE classroom_id = v_classroom_id
    AND status = 'active';

  SELECT
    COUNT(*) FILTER (WHERE status IN ('submitted', 'graded'))::int,
    COALESCE(ROUND(AVG(total_score) FILTER (WHERE status IN ('submitted', 'graded')), 2), 0),
    COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE status IN ('submitted', 'graded') AND accuracy_pct >= 60)::numeric
          / NULLIF(COUNT(*) FILTER (WHERE status IN ('submitted', 'graded')), 0)) * 100,
        2
      ),
      0
    )
  INTO v_submitted_count, v_avg_score, v_pass_rate_pct
  FROM public.classroom_assignment_submissions
  WHERE assignment_id = p_assignment_id;

  v_total_students := GREATEST(v_total_students, v_submitted_count);

  SELECT COALESCE(jsonb_agg(to_jsonb(mq)), '[]'::jsonb)
  INTO v_top_missed
  FROM (
    SELECT
      q_num AS question_number,
      COUNT(*)::int AS miss_count,
      ROUND((COUNT(*)::numeric / GREATEST(v_submitted_count, 1)) * 100, 1) AS miss_rate_pct
    FROM public.classroom_assignment_submissions s,
         LATERAL unnest(s.wrong_question_numbers) AS q_num
    WHERE s.assignment_id = p_assignment_id
      AND s.status IN ('submitted', 'graded')
    GROUP BY q_num
    ORDER BY miss_count DESC, q_num ASC
    LIMIT 5
  ) mq;

  SELECT COALESCE(jsonb_agg(to_jsonb(wv)), '[]'::jsonb)
  INTO v_top_weak_vocab
  FROM (
    SELECT
      word,
      COUNT(*)::int AS occurrence_count
    FROM public.classroom_assignment_submissions s,
         LATERAL unnest(s.weak_vocab_words) AS word
    WHERE s.assignment_id = p_assignment_id
      AND s.status IN ('submitted', 'graded')
      AND TRIM(word) <> ''
    GROUP BY word
    ORDER BY occurrence_count DESC, word ASC
    LIMIT 10
  ) wv;

  RETURN jsonb_build_object(
    'assignment_id', p_assignment_id,
    'classroom_id', v_classroom_id,
    'total_students', v_total_students,
    'submitted_count', v_submitted_count,
    'avg_score', v_avg_score,
    'pass_rate_pct', v_pass_rate_pct,
    'top_missed_questions', v_top_missed,
    'top_weak_vocab', v_top_weak_vocab
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_classroom_assignment_analytics(UUID)
  TO authenticated, service_role;

