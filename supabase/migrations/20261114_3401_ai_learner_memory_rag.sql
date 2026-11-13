-- ============================================================================
-- Migration 40: AI Learner Memory, Adaptive Context & Hybrid Knowledge RAG
-- Task 34.01: Roleplay Sessions + Adaptive AI Context RPC + Hybrid RAG RPC
-- PostgreSQL 15+ | Idempotent
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. TABLE: public.ai_roleplay_sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_roleplay_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_slug TEXT NOT NULL,
  hsk_level SMALLINT NOT NULL DEFAULT 3 CHECK (hsk_level BETWEEN 1 AND 9),
  target_vocab_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_grammar_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  mission_completion_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (mission_completion_pct >= 0 AND mission_completion_pct <= 100),
  fluency_score SMALLINT CHECK (fluency_score BETWEEN 0 AND 100),
  grammar_accuracy_score SMALLINT CHECK (grammar_accuracy_score BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_roleplay_sessions_user_status
  ON public.ai_roleplay_sessions (user_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_roleplay_sessions_scenario
  ON public.ai_roleplay_sessions (scenario_slug, hsk_level);

-- Row-Level Security for ai_roleplay_sessions
ALTER TABLE public.ai_roleplay_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_roleplay_sessions_own_all" ON public.ai_roleplay_sessions;
CREATE POLICY "ai_roleplay_sessions_own_all"
  ON public.ai_roleplay_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ai_roleplay_sessions_service_role_all" ON public.ai_roleplay_sessions;
CREATE POLICY "ai_roleplay_sessions_service_role_all"
  ON public.ai_roleplay_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 2. RPC: public.get_user_adaptive_ai_context(p_user_id UUID, p_hsk_level SMALLINT)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_adaptive_ai_context(
  p_user_id UUID,
  p_hsk_level SMALLINT DEFAULT 4
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_safe_level SMALLINT := GREATEST(1, LEAST(9, COALESCE(p_hsk_level, 4)));
  v_due_vocab JSONB := '[]'::jsonb;
  v_weak_grammar JSONB := '[]'::jsonb;
  v_problematic_hanzi JSONB := '[]'::jsonb;
BEGIN
  -- A. Due & leech vocabulary (up to 6 from user_vocab_items, fallback 5 from dictionary_entries)
  IF p_user_id IS NOT NULL AND to_regclass('public.user_vocab_items') IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
    INTO v_due_vocab
    FROM (
      SELECT
        simplified,
        pinyin,
        han_viet,
        meaning_vi,
        hsk_level,
        lapses,
        ROUND((meaning_mastery + writing_mastery + pronunciation_mastery) / 3.0, 1) AS overall_mastery,
        (next_review_at <= NOW()) AS is_due
      FROM public.user_vocab_items
      WHERE user_id = p_user_id
        AND hsk_level <= v_safe_level
      ORDER BY
        (CASE WHEN next_review_at <= NOW() THEN 0 ELSE 1 END) ASC,
        (CASE WHEN lapses >= 2 OR ((meaning_mastery + writing_mastery + pronunciation_mastery) / 3.0) < 60 THEN 0 ELSE 1 END) ASC,
        lapses DESC,
        overall_mastery ASC,
        next_review_at ASC
      LIMIT 6
    ) t;
  END IF;

  IF jsonb_array_length(v_due_vocab) = 0 AND to_regclass('public.dictionary_entries') IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(d)), '[]'::jsonb)
    INTO v_due_vocab
    FROM (
      SELECT
        simplified,
        pinyin_display AS pinyin,
        han_viet,
        COALESCE(pos_meanings->0->'definitions'->>0, '') AS meaning_vi,
        COALESCE(hsk_3_level, hsk_2_level, 1) AS hsk_level,
        0 AS lapses,
        0::numeric AS overall_mastery,
        true AS is_due
      FROM public.dictionary_entries
      WHERE COALESCE(hsk_3_level, hsk_2_level, 1) <= v_safe_level
      ORDER BY frequency_rank ASC NULLS LAST
      LIMIT 5
    ) d;
  END IF;

  -- B. Weak grammar points (up to 3)
  IF p_user_id IS NOT NULL AND to_regclass('public.user_grammar_progress') IS NOT NULL AND to_regclass('public.grammar_points') IS NOT NULL THEN
    BEGIN
      EXECUTE $sql$
        SELECT COALESCE(jsonb_agg(to_jsonb(g)), '[]'::jsonb)
        FROM (
          SELECT
            gp.code,
            gp.pattern_display,
            gp.title_vi,
            gp.common_mistakes,
            gp.hsk_level
          FROM public.user_grammar_progress ugp
          JOIN public.grammar_points gp ON gp.code = ugp.grammar_code
          WHERE ugp.user_id = $1
            AND gp.hsk_level <= $2
          ORDER BY COALESCE(ugp.accuracy_pct, 0) ASC, COALESCE(ugp.mistake_count, 0) DESC
          LIMIT 3
        ) g
      $sql$
      INTO v_weak_grammar
      USING p_user_id, v_safe_level;
    EXCEPTION WHEN OTHERS THEN
      v_weak_grammar := '[]'::jsonb;
    END;
  END IF;

  IF jsonb_array_length(v_weak_grammar) = 0 AND p_user_id IS NOT NULL AND to_regclass('public.hsk_attempts') IS NOT NULL AND to_regclass('public.grammar_points') IS NOT NULL THEN
    BEGIN
      EXECUTE $sql$
        WITH recent_weak_codes AS (
          SELECT DISTINCT jsonb_array_elements_text(
            CASE
              WHEN jsonb_typeof(weak_grammar_codes) = 'array' THEN weak_grammar_codes
              ELSE '[]'::jsonb
            END
          ) AS grammar_code
          FROM public.hsk_attempts
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 10
        )
        SELECT COALESCE(jsonb_agg(to_jsonb(g)), '[]'::jsonb)
        FROM (
          SELECT
            gp.code,
            gp.pattern_display,
            gp.title_vi,
            gp.common_mistakes,
            gp.hsk_level
          FROM public.grammar_points gp
          JOIN recent_weak_codes rw ON rw.grammar_code = gp.code
          WHERE gp.hsk_level <= $2
          LIMIT 3
        ) g
      $sql$
      INTO v_weak_grammar
      USING p_user_id, v_safe_level;
    EXCEPTION WHEN OTHERS THEN
      v_weak_grammar := '[]'::jsonb;
    END;
  END IF;

  IF jsonb_array_length(v_weak_grammar) = 0 AND to_regclass('public.grammar_points') IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(g)), '[]'::jsonb)
    INTO v_weak_grammar
    FROM (
      SELECT
        code,
        pattern_display,
        title_vi,
        common_mistakes,
        hsk_level
      FROM public.grammar_points
      WHERE hsk_level <= v_safe_level
      ORDER BY hsk_level DESC, created_at ASC
      LIMIT 3
    ) g;
  END IF;

  -- C. Problematic Hanzi characters (up to 5)
  IF p_user_id IS NOT NULL AND to_regclass('public.hanzi_character_mastery') IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(h)), '[]'::jsonb)
    INTO v_problematic_hanzi
    FROM (
      SELECT
        character,
        total_attempts,
        avg_accuracy,
        mastery_tier,
        problematic_strokes
      FROM public.hanzi_character_mastery
      WHERE user_id = p_user_id
      ORDER BY avg_accuracy ASC, total_attempts DESC
      LIMIT 5
    ) h;
  END IF;

  IF jsonb_array_length(v_problematic_hanzi) = 0 AND p_user_id IS NOT NULL AND to_regclass('public.hanzi_writing_logs') IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(h)), '[]'::jsonb)
    INTO v_problematic_hanzi
    FROM (
      SELECT
        character,
        COUNT(*)::int AS total_attempts,
        ROUND(AVG(accuracy_score), 2) AS avg_accuracy,
        SUM(mistake_count)::int AS total_mistakes
      FROM public.hanzi_writing_logs
      WHERE user_id = p_user_id
      GROUP BY character
      ORDER BY AVG(accuracy_score) ASC, SUM(mistake_count) DESC
      LIMIT 5
    ) h;
  END IF;

  RETURN jsonb_build_object(
    'user_id', p_user_id,
    'hsk_level', v_safe_level,
    'due_and_leech_vocab', COALESCE(v_due_vocab, '[]'::jsonb),
    'weak_grammar_points', COALESCE(v_weak_grammar, '[]'::jsonb),
    'problematic_hanzi', COALESCE(v_problematic_hanzi, '[]'::jsonb),
    'generated_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_adaptive_ai_context(UUID, SMALLINT)
  TO authenticated, service_role;

-- ============================================================================
-- 3. RPC: public.search_knowledge_rag_hybrid(p_query TEXT, p_hsk_level SMALLINT, p_limit INT)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.search_knowledge_rag_hybrid(
  p_query TEXT,
  p_hsk_level SMALLINT DEFAULT 6,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  source_type TEXT,
  source_id TEXT,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  hsk_level SMALLINT,
  score REAL,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_query TEXT := TRIM(COALESCE(p_query, ''));
  v_safe_level SMALLINT := GREATEST(1, LEAST(9, COALESCE(p_hsk_level, 6)));
  v_safe_limit INT := GREATEST(1, LEAST(25, COALESCE(p_limit, 5)));
BEGIN
  IF v_query = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH combined AS (
    -- 1. Grammar points
    SELECT
      'grammar'::TEXT AS source_type,
      gp.code::TEXT AS source_id,
      gp.pattern_display::TEXT AS title,
      gp.title_vi::TEXT AS subtitle,
      LEFT(COALESCE(gp.explanation_vi, ''), 400)::TEXT AS content,
      gp.hsk_level::SMALLINT AS hsk_level,
      GREATEST(
        similarity(gp.pattern_display, v_query),
        similarity(gp.title_vi, v_query),
        similarity(gp.code, v_query),
        CASE
          WHEN gp.pattern_display ILIKE '%' || v_query || '%'
            OR gp.title_vi ILIKE '%' || v_query || '%'
            OR gp.explanation_vi ILIKE '%' || v_query || '%'
          THEN 0.72::REAL
          ELSE 0.0::REAL
        END
      )::REAL AS score,
      jsonb_build_object(
        'code', gp.code,
        'category', gp.category,
        'common_mistakes', gp.common_mistakes
      ) AS metadata
    FROM public.grammar_points gp
    WHERE gp.hsk_level <= v_safe_level
      AND (
        gp.pattern_display % v_query
        OR gp.title_vi % v_query
        OR gp.pattern_display ILIKE '%' || v_query || '%'
        OR gp.title_vi ILIKE '%' || v_query || '%'
        OR gp.explanation_vi ILIKE '%' || v_query || '%'
      )

    UNION ALL

    -- 2. Dictionary entries
    SELECT
      'dictionary'::TEXT AS source_type,
      de.id::TEXT AS source_id,
      de.simplified::TEXT AS title,
      CONCAT_WS(' · ', de.pinyin_display, de.han_viet)::TEXT AS subtitle,
      LEFT(COALESCE(de.pos_meanings::TEXT, ''), 400)::TEXT AS content,
      COALESCE(de.hsk_3_level, de.hsk_2_level, 1)::SMALLINT AS hsk_level,
      GREATEST(
        similarity(de.simplified, v_query),
        similarity(de.pinyin_clean, v_query),
        similarity(de.han_viet, v_query),
        CASE
          WHEN de.simplified = v_query THEN 1.0::REAL
          WHEN de.simplified ILIKE '%' || v_query || '%'
            OR de.pinyin_clean ILIKE '%' || v_query || '%'
            OR de.han_viet ILIKE '%' || v_query || '%'
          THEN 0.75::REAL
          ELSE 0.0::REAL
        END
      )::REAL AS score,
      jsonb_build_object(
        'traditional', de.traditional,
        'pinyin', de.pinyin_display,
        'han_viet', de.han_viet,
        'pos_meanings', de.pos_meanings
      ) AS metadata
    FROM public.dictionary_entries de
    WHERE COALESCE(de.hsk_3_level, de.hsk_2_level, 1) <= v_safe_level
      AND (
        de.simplified % v_query
        OR de.pinyin_clean % v_query
        OR de.han_viet % v_query
        OR de.simplified ILIKE '%' || v_query || '%'
        OR de.pinyin_clean ILIKE '%' || v_query || '%'
        OR de.han_viet ILIKE '%' || v_query || '%'
      )

    UNION ALL

    -- 3. Chengyu entries
    SELECT
      'chengyu'::TEXT AS source_type,
      ce.chengyu::TEXT AS source_id,
      ce.chengyu::TEXT AS title,
      CONCAT_WS(' · ', ce.pinyin, ce.han_viet)::TEXT AS subtitle,
      LEFT(COALESCE(ce.figurative_meaning_vi, ce.literal_meaning_vi, ''), 400)::TEXT AS content,
      COALESCE(ce.hsk_level, 6)::SMALLINT AS hsk_level,
      GREATEST(
        similarity(ce.chengyu, v_query),
        similarity(ce.han_viet, v_query),
        similarity(ce.figurative_meaning_vi, v_query),
        CASE
          WHEN ce.chengyu ILIKE '%' || v_query || '%'
            OR ce.han_viet ILIKE '%' || v_query || '%'
            OR ce.figurative_meaning_vi ILIKE '%' || v_query || '%'
          THEN 0.70::REAL
          ELSE 0.0::REAL
        END
      )::REAL AS score,
      jsonb_build_object(
        'vietnamese_equivalent', ce.vietnamese_equivalent_idiom,
        'sentiment_polarity', ce.sentiment_polarity
      ) AS metadata
    FROM public.chengyu_entries ce
    WHERE COALESCE(ce.hsk_level, 6) <= v_safe_level
      AND (
        ce.chengyu % v_query
        OR ce.han_viet % v_query
        OR ce.chengyu ILIKE '%' || v_query || '%'
        OR ce.han_viet ILIKE '%' || v_query || '%'
        OR ce.figurative_meaning_vi ILIKE '%' || v_query || '%'
      )

    UNION ALL

    -- 4. HSK Question Bank
    SELECT
      'hsk_question'::TEXT AS source_type,
      hq.id::TEXT AS source_id,
      CONCAT(hq.paper_code, ' · ', hq.section, ' #', hq.question_number_start)::TEXT AS title,
      hq.question_type::TEXT AS subtitle,
      LEFT(COALESCE(hq.stimulus_payload::TEXT, ''), 400)::TEXT AS content,
      hq.hsk_level::SMALLINT AS hsk_level,
      GREATEST(
        similarity(hq.stimulus_payload::TEXT, v_query),
        CASE
          WHEN v_query = ANY(hq.target_vocab)
            OR v_query = ANY(hq.target_grammar_codes)
            OR hq.stimulus_payload::TEXT ILIKE '%' || v_query || '%'
          THEN 0.68::REAL
          ELSE 0.0::REAL
        END
      )::REAL AS score,
      jsonb_build_object(
        'paper_code', hq.paper_code,
        'section', hq.section,
        'target_vocab', hq.target_vocab,
        'target_grammar_codes', hq.target_grammar_codes
      ) AS metadata
    FROM public.hsk_question_bank hq
    WHERE hq.hsk_level <= v_safe_level
      AND (
        v_query = ANY(hq.target_vocab)
        OR v_query = ANY(hq.target_grammar_codes)
        OR hq.stimulus_payload::TEXT ILIKE '%' || v_query || '%'
      )
  )
  SELECT
    c.source_type,
    c.source_id,
    c.title,
    c.subtitle,
    c.content,
    c.hsk_level,
    c.score,
    c.metadata
  FROM combined c
  WHERE c.score > 0
  ORDER BY c.score DESC, c.hsk_level ASC
  LIMIT v_safe_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_knowledge_rag_hybrid(TEXT, SMALLINT, INT)
  TO anon, authenticated, service_role;

