-- Task 27.06: Vocabulary Workspace (Decks, Contexts & Multi-Dimensional SRS)
CREATE TABLE IF NOT EXISTS public.vocab_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color_hex TEXT NOT NULL DEFAULT '#10b981',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_vocab_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL REFERENCES public.vocab_decks(id) ON DELETE CASCADE,
  dictionary_entry_id UUID NULL,
  simplified TEXT NOT NULL,
  pinyin TEXT NOT NULL DEFAULT '',
  han_viet TEXT NOT NULL DEFAULT '',
  meaning_vi TEXT NOT NULL DEFAULT '',
  hsk_level SMALLINT NOT NULL DEFAULT 1 CHECK (hsk_level BETWEEN 1 AND 9),
  personal_mnemonic TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  source_context JSONB NOT NULL DEFAULT '[]'::jsonb,
  srs_state TEXT NOT NULL DEFAULT 'new' CHECK (srs_state IN ('new', 'learning', 'review', 'relearning')),
  stability REAL NOT NULL DEFAULT 0,
  difficulty REAL NOT NULL DEFAULT 5.0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INT NOT NULL DEFAULT 0,
  repetitions INT NOT NULL DEFAULT 0,
  lapses INT NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ NULL,
  meaning_mastery SMALLINT NOT NULL DEFAULT 0 CHECK (meaning_mastery BETWEEN 0 AND 100),
  writing_mastery SMALLINT NOT NULL DEFAULT 0 CHECK (writing_mastery BETWEEN 0 AND 100),
  pronunciation_mastery SMALLINT NOT NULL DEFAULT 0 CHECK (pronunciation_mastery BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, simplified)
);

CREATE INDEX IF NOT EXISTS idx_vocab_decks_user
  ON public.vocab_decks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_vocab_items_next_review
  ON public.user_vocab_items (user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_user_vocab_items_deck
  ON public.user_vocab_items (deck_id, srs_state);

CREATE INDEX IF NOT EXISTS idx_user_vocab_items_tags_gin
  ON public.user_vocab_items USING GIN (tags);

ALTER TABLE public.vocab_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocab_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vocab_decks_own_all" ON public.vocab_decks;
CREATE POLICY "vocab_decks_own_all"
  ON public.vocab_decks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_vocab_items_own_all" ON public.user_vocab_items;
CREATE POLICY "user_vocab_items_own_all"
  ON public.user_vocab_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

