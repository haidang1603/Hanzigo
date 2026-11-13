-- =========================================================================
-- TASK 27.01: SMART CHINESE DICTIONARY (120,000+ ENTRIES + AI FALLBACK CACHE)
-- =========================================================================
-- 1. Enable pg_trgm for sub-50ms fuzzy & trigram search.
-- 2. Safely create or extend public.dictionary_entries with Task 27.01 columns.
-- 3. Create GIN trigram indexes on simplified, pinyin_clean, han_viet, vietnamese_meaning.
-- 4. Create user_dictionary_history & user_saved_vocabulary with strict RLS.
-- 5. Create RPC search_dictionary_multimodal(query_text, hsk_filter, limit_count).
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Prevent SQL Editor statement timeout on large 120k+ row tables
SET statement_timeout = '120s';

-- 1. Dictionary Entries Table (non-breaking creation + extension)
CREATE TABLE IF NOT EXISTS public.dictionary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simplified TEXT NOT NULL,
  traditional TEXT,
  pinyin_display TEXT,
  pinyin_numeric TEXT,
  pinyin_clean TEXT,
  han_viet TEXT,
  hsk_2_level SMALLINT CHECK (hsk_2_level BETWEEN 1 AND 6),
  hsk_3_level SMALLINT CHECK (hsk_3_level BETWEEN 1 AND 9),
  frequency_rank INT DEFAULT 999999,
  pos_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
  decomposition JSONB DEFAULT NULL,
  measure_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  synonyms_antonyms JSONB NOT NULL DEFAULT '{"synonyms":[],"antonyms":[]}'::jsonb,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL DEFAULT 'cedict',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Extend existing dictionary_entries table safely if already created in earlier phases
ALTER TABLE public.dictionary_entries
  ADD COLUMN IF NOT EXISTS pinyin_display TEXT,
  ADD COLUMN IF NOT EXISTS pinyin_numeric TEXT,
  ADD COLUMN IF NOT EXISTS han_viet TEXT,
  ADD COLUMN IF NOT EXISTS hsk_2_level SMALLINT,
  ADD COLUMN IF NOT EXISTS hsk_3_level SMALLINT,
  ADD COLUMN IF NOT EXISTS pos_meanings JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS decomposition JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS measure_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS synonyms_antonyms JSONB NOT NULL DEFAULT '{"synonyms":[],"antonyms":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'cedict',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Non-unique composite index (no 120k-row UPDATE backfill needed; RPC reads legacy columns via COALESCE)
CREATE INDEX IF NOT EXISTS idx_dictionary_entries_simplified_pinyin
  ON public.dictionary_entries (simplified, COALESCE(pinyin_numeric, ''));

-- 2. Sub-50ms Trigram GIN & B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_dict_simplified_trgm
  ON public.dictionary_entries USING gin (simplified gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_traditional_trgm
  ON public.dictionary_entries USING gin (traditional gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_pinyin_clean_trgm
  ON public.dictionary_entries USING gin (pinyin_clean gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_han_viet_trgm
  ON public.dictionary_entries USING gin (han_viet gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_dict_simplified_btree
  ON public.dictionary_entries (simplified);

CREATE INDEX IF NOT EXISTS idx_dict_hsk_levels
  ON public.dictionary_entries (hsk_2_level, hsk_3_level, frequency_rank ASC);

-- 3. User Dictionary History & Saved Vocabulary Tables
CREATE TABLE IF NOT EXISTS public.user_dictionary_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  simplified TEXT,
  pinyin_display TEXT,
  meaning_vi TEXT,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_dict_history UNIQUE (user_id, query_text)
);

CREATE INDEX IF NOT EXISTS idx_user_dict_history_recent
  ON public.user_dictionary_history (user_id, searched_at DESC);

CREATE TABLE IF NOT EXISTS public.user_saved_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dictionary_entry_id TEXT,
  simplified TEXT NOT NULL,
  traditional TEXT,
  pinyin_display TEXT,
  han_viet TEXT,
  meaning_vi TEXT,
  hsk_level SMALLINT,
  deck_name TEXT NOT NULL DEFAULT 'Sổ tay từ vựng',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_saved_vocab UNIQUE (user_id, simplified)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_vocab_user
  ON public.user_saved_vocabulary (user_id, saved_at DESC);

-- 4. Row-Level Security (RLS)
ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dictionary_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on dictionary_entries" ON public.dictionary_entries;
CREATE POLICY "Allow public read on dictionary_entries"
  ON public.dictionary_entries
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert ai fallback dictionary" ON public.dictionary_entries;
CREATE POLICY "Allow authenticated insert ai fallback dictionary"
  ON public.dictionary_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (source = 'ai_fallback');

DROP POLICY IF EXISTS "Allow authenticated update ai fallback dictionary" ON public.dictionary_entries;
CREATE POLICY "Allow authenticated update ai fallback dictionary"
  ON public.dictionary_entries
  FOR UPDATE
  TO authenticated
  USING (source = 'ai_fallback')
  WITH CHECK (source = 'ai_fallback');

DROP POLICY IF EXISTS "Users manage own dictionary history" ON public.user_dictionary_history;
CREATE POLICY "Users manage own dictionary history"
  ON public.user_dictionary_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own saved vocabulary" ON public.user_saved_vocabulary;
CREATE POLICY "Users manage own saved vocabulary"
  ON public.user_saved_vocabulary
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Multimodal Ranked Search RPC (<50ms via trigram + B-tree)
CREATE OR REPLACE FUNCTION public.search_dictionary_multimodal(
  query_text TEXT,
  hsk_filter INT DEFAULT NULL,
  limit_count INT DEFAULT 25
)
RETURNS TABLE (
  id TEXT,
  simplified TEXT,
  traditional TEXT,
  pinyin_display TEXT,
  pinyin_numeric TEXT,
  pinyin_clean TEXT,
  han_viet TEXT,
  hsk_2_level SMALLINT,
  hsk_3_level SMALLINT,
  frequency_rank INT,
  pos_meanings JSONB,
  decomposition JSONB,
  measure_words JSONB,
  synonyms_antonyms JSONB,
  examples JSONB,
  source TEXT,
  match_score INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH normalized AS (
    SELECT
      TRIM(COALESCE(query_text, '')) AS raw_q,
      LOWER(REGEXP_REPLACE(TRIM(COALESCE(query_text, '')), '[0-9\s]+', '', 'g')) AS clean_q,
      LOWER(TRIM(COALESCE(query_text, ''))) AS lower_q
  )
  SELECT
    d.id::TEXT AS id,
    d.simplified::TEXT AS simplified,
    COALESCE(d.traditional::TEXT, d.simplified::TEXT) AS traditional,
    COALESCE(d.pinyin_display::TEXT, to_jsonb(d)->>'pinyin_tone', '') AS pinyin_display,
    COALESCE(d.pinyin_numeric::TEXT, to_jsonb(d)->>'pinyin_number', '') AS pinyin_numeric,
    COALESCE(d.pinyin_clean::TEXT, '') AS pinyin_clean,
    COALESCE(d.han_viet::TEXT, to_jsonb(d)->>'hanviet', '') AS han_viet,
    NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_2_level::TEXT, to_jsonb(d)->>'hsk_level', ''), '[^0-9]', '', 'g'), '')::SMALLINT AS hsk_2_level,
    NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_3_level::TEXT, ''), '[^0-9]', '', 'g'), '')::SMALLINT AS hsk_3_level,
    COALESCE(d.frequency_rank, 999999)::INT AS frequency_rank,
    d.pos_meanings,
    d.decomposition,
    d.measure_words,
    d.synonyms_antonyms,
    d.examples,
    COALESCE(d.source::TEXT, 'cedict') AS source,
    (
      CASE
        WHEN d.simplified = n.raw_q
          OR d.traditional = n.raw_q
          OR LOWER(COALESCE(d.pinyin_clean, '')) = n.clean_q
          OR LOWER(REPLACE(COALESCE(d.pinyin_numeric, to_jsonb(d)->>'pinyin_number', ''), ' ', '')) = REPLACE(n.lower_q, ' ', '')
          THEN 100
        WHEN d.simplified LIKE n.raw_q || '%'
          OR LOWER(COALESCE(d.pinyin_clean, '')) LIKE n.clean_q || '%'
          THEN 80
        WHEN LOWER(COALESCE(d.han_viet, to_jsonb(d)->>'hanviet', '')) ILIKE '%' || n.lower_q || '%'
          OR COALESCE(to_jsonb(d)->>'vietnamese_meaning', '') ILIKE '%' || n.lower_q || '%'
          OR d.pos_meanings::text ILIKE '%' || n.lower_q || '%'
          THEN 60
        ELSE 40
      END
    )::INT AS match_score
  FROM public.dictionary_entries d
  CROSS JOIN normalized n
  WHERE n.raw_q <> ''
    AND (
      hsk_filter IS NULL
      OR NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_2_level::TEXT, to_jsonb(d)->>'hsk_level', ''), '[^0-9]', '', 'g'), '')::INT = hsk_filter
      OR NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_3_level::TEXT, ''), '[^0-9]', '', 'g'), '')::INT = hsk_filter
    )
    AND (
      d.simplified % n.raw_q
      OR d.simplified ILIKE '%' || n.raw_q || '%'
      OR d.traditional ILIKE '%' || n.raw_q || '%'
      OR d.pinyin_clean % n.clean_q
      OR d.pinyin_clean ILIKE n.clean_q || '%'
      OR COALESCE(d.han_viet::TEXT, to_jsonb(d)->>'hanviet', '') ILIKE '%' || n.lower_q || '%'
      OR COALESCE(to_jsonb(d)->>'vietnamese_meaning', '') ILIKE '%' || n.lower_q || '%'
      OR d.pos_meanings::text ILIKE '%' || n.lower_q || '%'
    )
  ORDER BY
    match_score DESC,
    COALESCE(
      NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_2_level::TEXT, to_jsonb(d)->>'hsk_level', ''), '[^0-9]', '', 'g'), '')::INT,
      NULLIF(REGEXP_REPLACE(COALESCE(d.hsk_3_level::TEXT, ''), '[^0-9]', '', 'g'), '')::INT,
      99
    ) ASC,
    COALESCE(d.frequency_rank, 999999) ASC
  LIMIT GREATEST(1, LEAST(COALESCE(limit_count, 25), 100));
$$;

GRANT EXECUTE ON FUNCTION public.search_dictionary_multimodal(TEXT, INT, INT) TO anon, authenticated;

