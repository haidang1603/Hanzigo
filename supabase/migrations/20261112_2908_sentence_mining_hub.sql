-- TASK 29.08: UNIFIED IMMERSION HUB & SENTENCE MINING PIPELINE (i+1)
-- Migration: 20261112_2908_sentence_mining_hub.sql

CREATE TABLE IF NOT EXISTS public.mined_sentence_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_word TEXT NOT NULL,
  target_vocab_item_id UUID NULL,
  sentence_zh TEXT NOT NULL,
  sentence_pinyin TEXT NOT NULL DEFAULT '',
  sentence_vi TEXT NOT NULL DEFAULT '',
  media_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  comprehensibility_ratio NUMERIC(5,2) NOT NULL DEFAULT 100.00 CHECK (comprehensibility_ratio BETWEEN 0 AND 100),
  is_i_plus_one BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mined_sentence_cards_user_created
  ON public.mined_sentence_cards (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mined_sentence_cards_target_word
  ON public.mined_sentence_cards (target_word);
CREATE INDEX IF NOT EXISTS idx_mined_sentence_cards_i_plus_one
  ON public.mined_sentence_cards (user_id, is_i_plus_one);
CREATE INDEX IF NOT EXISTS idx_mined_sentence_cards_media_context
  ON public.mined_sentence_cards USING GIN (media_context);

-- Row-Level Security (RLS)
ALTER TABLE public.mined_sentence_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own mined_sentence_cards" ON public.mined_sentence_cards;
CREATE POLICY "Users can manage own mined_sentence_cards"
  ON public.mined_sentence_cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

