-- =========================================================================
-- MIGRATION: 20261112_hsk7_9_curriculum_expansion.sql
-- HanziGo Phase 26 / Task 26.06: HSK 7-9 Curriculum Expansion
-- Aligned with Chinese Proficiency Grading Standards (三等九级)
-- =========================================================================

-- 1. ENUM TYPES (IDEMPOTENT)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hsk_advanced_domain') THEN
    CREATE TYPE public.hsk_advanced_domain AS ENUM (
      'academic',
      'business_economics',
      'science_technology',
      'culture_law'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hsk_advanced_entry_type') THEN
    CREATE TYPE public.hsk_advanced_entry_type AS ENUM (
      'vocabulary',
      'chengyu_idiom',
      'classical_pattern',
      'domain_term'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hsk_register_type') THEN
    CREATE TYPE public.hsk_register_type AS ENUM (
      'formal_written',
      'neutral',
      'colloquial',
      'classical'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hsk_connotation_type') THEN
    CREATE TYPE public.hsk_connotation_type AS ENUM (
      'commendatory',
      'derogatory',
      'neutral'
    );
  END IF;
END
$$;

-- 2. TABLE: public.hsk_advanced_vocabulary (5,636 HSK 7-9 Vocabulary, 成语, 文言 & Domain Terms)
CREATE TABLE IF NOT EXISTS public.hsk_advanced_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  meaning_en TEXT DEFAULT '',
  hsk_band INT NOT NULL CHECK (hsk_band BETWEEN 7 AND 9),
  entry_type public.hsk_advanced_entry_type NOT NULL DEFAULT 'vocabulary',
  domain public.hsk_advanced_domain NOT NULL DEFAULT 'academic',
  register_type public.hsk_register_type NOT NULL DEFAULT 'formal_written',
  connotation public.hsk_connotation_type NOT NULL DEFAULT 'neutral',
  collocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  classical_origin TEXT DEFAULT '',
  example_zh TEXT DEFAULT '',
  example_vi TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hsk_adv_vocab_hanzi_band UNIQUE (hanzi, hsk_band)
);

-- 3. TABLE: public.hsk_advanced_grammar (书面语 vs 口语 & Classical-to-Modern Bridges)
CREATE TABLE IF NOT EXISTS public.hsk_advanced_grammar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  hsk_band INT NOT NULL CHECK (hsk_band BETWEEN 7 AND 9),
  domain public.hsk_advanced_domain NOT NULL DEFAULT 'academic',
  formal_written_form TEXT NOT NULL,
  spoken_equivalent TEXT NOT NULL DEFAULT '',
  classical_bridge TEXT DEFAULT '',
  rhetorical_function TEXT DEFAULT '',
  explanation_vi TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLE: public.hsk_advanced_modules (Long-Form 800-1,500 char Thematic Modules)
CREATE TABLE IF NOT EXISTS public.hsk_advanced_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  hsk_band INT NOT NULL CHECK (hsk_band BETWEEN 7 AND 9),
  domain public.hsk_advanced_domain NOT NULL,
  title_zh TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  char_count INT NOT NULL CHECK (char_count >= 500),
  passage_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  discourse_annotations JSONB NOT NULL DEFAULT '[]'::jsonb,
  rhetorical_devices JSONB NOT NULL DEFAULT '[]'::jsonb,
  synonym_comparisons JSONB NOT NULL DEFAULT '[]'::jsonb,
  vocab_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_hsk_adv_vocab_band_domain
  ON public.hsk_advanced_vocabulary (hsk_band, domain, entry_type);

CREATE INDEX IF NOT EXISTS idx_hsk_adv_grammar_band
  ON public.hsk_advanced_grammar (hsk_band, domain);

CREATE INDEX IF NOT EXISTS idx_hsk_adv_modules_band_domain
  ON public.hsk_advanced_modules (hsk_band, domain);

-- 6. ROW LEVEL SECURITY (Public/Authenticated Read, Admin Write)
ALTER TABLE public.hsk_advanced_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_advanced_grammar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_advanced_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hsk_adv_vocab_read_all" ON public.hsk_advanced_vocabulary;
CREATE POLICY "hsk_adv_vocab_read_all" ON public.hsk_advanced_vocabulary
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "hsk_adv_vocab_admin_write" ON public.hsk_advanced_vocabulary;
CREATE POLICY "hsk_adv_vocab_admin_write" ON public.hsk_advanced_vocabulary
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "hsk_adv_grammar_read_all" ON public.hsk_advanced_grammar;
CREATE POLICY "hsk_adv_grammar_read_all" ON public.hsk_advanced_grammar
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "hsk_adv_grammar_admin_write" ON public.hsk_advanced_grammar;
CREATE POLICY "hsk_adv_grammar_admin_write" ON public.hsk_advanced_grammar
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "hsk_adv_modules_read_all" ON public.hsk_advanced_modules;
CREATE POLICY "hsk_adv_modules_read_all" ON public.hsk_advanced_modules
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "hsk_adv_modules_admin_write" ON public.hsk_advanced_modules;
CREATE POLICY "hsk_adv_modules_admin_write" ON public.hsk_advanced_modules
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

