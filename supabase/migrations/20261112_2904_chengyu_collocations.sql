-- TASK 29.04: CHENGYU & COLLOCATION EXPLORER
-- Migration: 20261112_2904_chengyu_collocations.sql

-- 1. Table: chengyu_entries (4-character Chinese Idioms with Classical Breakdown & Sentiment)
CREATE TABLE IF NOT EXISTS public.chengyu_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chengyu CHAR(4) NOT NULL UNIQUE,
  pinyin TEXT NOT NULL,
  han_viet TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'general',
  literal_meaning_vi TEXT NOT NULL,
  figurative_meaning_vi TEXT NOT NULL,
  vietnamese_equivalent_idiom TEXT,
  char_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  origin_story_vi TEXT NOT NULL,
  sentiment_polarity TEXT NOT NULL CHECK (
    sentiment_polarity IN ('positive_褒义', 'neutral_中性', 'negative_贬义')
  ),
  syntactic_function TEXT[] NOT NULL DEFAULT '{}'::text[],
  hsk_level SMALLINT NOT NULL DEFAULT 5 CHECK (hsk_level BETWEEN 1 AND 9),
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast pattern matching, sentiment & topic filtering
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_chengyu ON public.chengyu_entries (chengyu);
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_sentiment ON public.chengyu_entries (sentiment_polarity);
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_topic ON public.chengyu_entries (topic);
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_hsk ON public.chengyu_entries (hsk_level);
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_syntactic ON public.chengyu_entries USING GIN (syntactic_function);
CREATE INDEX IF NOT EXISTS idx_chengyu_entries_char_breakdown ON public.chengyu_entries USING GIN (char_breakdown);

-- 2. Table: word_collocation_hubs (Fixed Chinese Collocations & Vietnamese Error Warnings)
CREATE TABLE IF NOT EXISTS public.word_collocation_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  core_word TEXT NOT NULL UNIQUE,
  pinyin TEXT NOT NULL,
  meaning_vi TEXT NOT NULL DEFAULT '',
  pos TEXT NOT NULL,
  hsk_level SMALLINT NOT NULL DEFAULT 3 CHECK (hsk_level BETWEEN 1 AND 9),
  collocation_patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_word_collocation_hubs_core_word ON public.word_collocation_hubs (core_word);
CREATE INDEX IF NOT EXISTS idx_word_collocation_hubs_hsk ON public.word_collocation_hubs (hsk_level);
CREATE INDEX IF NOT EXISTS idx_word_collocation_hubs_patterns ON public.word_collocation_hubs USING GIN (collocation_patterns);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.chengyu_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_collocation_hubs ENABLE ROW LEVEL SECURITY;

-- Public & authenticated read access for curriculum reference tables
DROP POLICY IF EXISTS "Allow read access to chengyu_entries" ON public.chengyu_entries;
CREATE POLICY "Allow read access to chengyu_entries"
  ON public.chengyu_entries FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow read access to word_collocation_hubs" ON public.word_collocation_hubs;
CREATE POLICY "Allow read access to word_collocation_hubs"
  ON public.word_collocation_hubs FOR SELECT
  USING (true);

