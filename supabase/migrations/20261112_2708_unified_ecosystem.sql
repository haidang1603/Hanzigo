-- Task 27.08: Unified Learning Tools Ecosystem & Multidimensional Mastery Sync
ALTER TABLE public.user_vocab_items
  ADD COLUMN IF NOT EXISTS overall_mastery SMALLINT NOT NULL DEFAULT 0 CHECK (overall_mastery BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS is_true_mastered BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.unified_learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_source TEXT NOT NULL CHECK (
    tool_source IN ('dictionary', 'grammar', 'writing', 'reading', 'listening', 'vocab', 'pronunciation')
  ),
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'lookup',
      'save_vocab',
      'write_char',
      'pronounce_drill',
      'complete_article',
      'complete_listening',
      'grammar_quiz'
    )
  ),
  target_entity TEXT NOT NULL,
  score NUMERIC(5,2) NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unified_learning_events_user_created
  ON public.unified_learning_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_unified_learning_events_target
  ON public.unified_learning_events (user_id, target_entity);

ALTER TABLE public.unified_learning_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "unified_learning_events_own" ON public.unified_learning_events;
CREATE POLICY "unified_learning_events_own"
  ON public.unified_learning_events
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RPC: Synchronize multidimensional mastery:
-- Overall Mastery = 0.4 * Meaning SRS + 0.3 * Writing Mastery + 0.3 * Pronunciation Mastery
CREATE OR REPLACE FUNCTION public.sync_word_multidimensional_mastery(
  p_user_id UUID,
  p_target_entity TEXT,
  p_tool_source TEXT,
  p_score NUMERIC DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clamped_score SMALLINT;
BEGIN
  IF p_user_id IS NULL OR p_target_entity IS NULL OR length(trim(p_target_entity)) = 0 THEN
    RETURN;
  END IF;

  v_clamped_score := LEAST(100, GREATEST(0, COALESCE(ROUND(p_score)::SMALLINT, 0)));

  IF p_tool_source = 'writing' AND p_score IS NOT NULL THEN
    UPDATE public.user_vocab_items
    SET
      writing_mastery = GREATEST(writing_mastery, v_clamped_score),
      overall_mastery = ROUND(0.4 * meaning_mastery + 0.3 * GREATEST(writing_mastery, v_clamped_score) + 0.3 * pronunciation_mastery)::SMALLINT,
      is_true_mastered = (meaning_mastery >= 80 AND GREATEST(writing_mastery, v_clamped_score) >= 80 AND pronunciation_mastery >= 80),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND (simplified = p_target_entity OR simplified LIKE '%' || p_target_entity || '%');
  ELSIF p_tool_source = 'pronunciation' AND p_score IS NOT NULL THEN
    UPDATE public.user_vocab_items
    SET
      pronunciation_mastery = GREATEST(pronunciation_mastery, v_clamped_score),
      overall_mastery = ROUND(0.4 * meaning_mastery + 0.3 * writing_mastery + 0.3 * GREATEST(pronunciation_mastery, v_clamped_score))::SMALLINT,
      is_true_mastered = (meaning_mastery >= 80 AND writing_mastery >= 80 AND GREATEST(pronunciation_mastery, v_clamped_score) >= 80),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND simplified = p_target_entity;
  ELSE
    UPDATE public.user_vocab_items
    SET
      overall_mastery = ROUND(0.4 * meaning_mastery + 0.3 * writing_mastery + 0.3 * pronunciation_mastery)::SMALLINT,
      is_true_mastered = (meaning_mastery >= 80 AND writing_mastery >= 80 AND pronunciation_mastery >= 80),
      updated_at = NOW()
    WHERE user_id = p_user_id
      AND simplified = p_target_entity;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_fn_sync_word_multidimensional_mastery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.sync_word_multidimensional_mastery(
    NEW.user_id,
    NEW.target_entity,
    NEW.tool_source,
    NEW.score
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_word_multidimensional_mastery ON public.unified_learning_events;
CREATE TRIGGER trg_sync_word_multidimensional_mastery
  AFTER INSERT ON public.unified_learning_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_fn_sync_word_multidimensional_mastery();

