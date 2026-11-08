-- =========================================================================
-- HANZIGO MIGRATION: 20261108_full_schema_reconciliation.sql
-- Phase 23: Complete Supabase Data & Schema Synchronization
-- =========================================================================

-- 1. EXTEND class_materials & materials WITH STORAGE METADATA COLUMNS
ALTER TABLE IF EXISTS public.class_materials
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'materials',
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Tài liệu lớp học',
  ADD COLUMN IF NOT EXISTS download_url TEXT,
  ADD COLUMN IF NOT EXISTS is_local_storage BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE IF EXISTS public.materials
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'materials',
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. CREATE IDEMPOTENT INDEXES FOR FAST QUERYING & RELATIONSHIPS
CREATE INDEX IF NOT EXISTS idx_materials_storage_lookup 
  ON public.materials(storage_bucket, storage_path);

CREATE INDEX IF NOT EXISTS idx_class_materials_storage_lookup 
  ON public.class_materials(storage_bucket, storage_path);

CREATE INDEX IF NOT EXISTS idx_learning_lessons_chapter 
  ON public.learning_lessons(chapter_id);

CREATE INDEX IF NOT EXISTS idx_learning_lessons_level 
  ON public.learning_lessons(level_id);

CREATE INDEX IF NOT EXISTS idx_learning_boss_chapter 
  ON public.learning_boss_challenges(chapter_id);

CREATE INDEX IF NOT EXISTS idx_hanzi_decompositions_char 
  ON public.hanzi_decompositions(char);

CREATE INDEX IF NOT EXISTS idx_hsk_questions_exam 
  ON public.hsk_questions(exam_id);

CREATE INDEX IF NOT EXISTS idx_hsk_exams_level 
  ON public.hsk_exams(level);

CREATE INDEX IF NOT EXISTS idx_vocabulary_hanzi_level 
  ON public.vocabulary(hanzi, level);

-- 3. ENSURE ROW LEVEL SECURITY (RLS) IS ENABLED ON ALL TABLES
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.class_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_boss_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hanzi_decompositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hsk_exam_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hsk_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hsk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rag_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PUBLIC EDUCATIONAL DATA (READ-ONLY FOR ALL, WRITE RESTRICTED)

-- Learning Levels: Public read
DROP POLICY IF EXISTS "Allow public read access on learning_levels" ON public.learning_levels;
CREATE POLICY "Allow public read access on learning_levels" 
  ON public.learning_levels FOR SELECT USING (true);

-- Learning Chapters: Public read
DROP POLICY IF EXISTS "Allow public read access on learning_chapters" ON public.learning_chapters;
CREATE POLICY "Allow public read access on learning_chapters" 
  ON public.learning_chapters FOR SELECT USING (true);

-- Learning Lessons: Public read
DROP POLICY IF EXISTS "Allow public read access on learning_lessons" ON public.learning_lessons;
CREATE POLICY "Allow public read access on learning_lessons" 
  ON public.learning_lessons FOR SELECT USING (true);

-- Learning Boss Challenges: Public read
DROP POLICY IF EXISTS "Allow public read access on learning_boss_challenges" ON public.learning_boss_challenges;
CREATE POLICY "Allow public read access on learning_boss_challenges" 
  ON public.learning_boss_challenges FOR SELECT USING (true);

-- Hanzi Decompositions: Public read
DROP POLICY IF EXISTS "Allow public read access on hanzi_decompositions" ON public.hanzi_decompositions;
CREATE POLICY "Allow public read access on hanzi_decompositions" 
  ON public.hanzi_decompositions FOR SELECT USING (true);

-- HSK Exam Structures: Public read
DROP POLICY IF EXISTS "Allow public read access on hsk_exam_structures" ON public.hsk_exam_structures;
CREATE POLICY "Allow public read access on hsk_exam_structures" 
  ON public.hsk_exam_structures FOR SELECT USING (true);

-- HSK Exams: Public read for published exams
DROP POLICY IF EXISTS "Allow public read access on hsk_exams" ON public.hsk_exams;
CREATE POLICY "Allow public read access on hsk_exams" 
  ON public.hsk_exams FOR SELECT USING (review_status = 'published');

-- Vocabulary: Public read
DROP POLICY IF EXISTS "Allow public read access on vocabulary" ON public.vocabulary;
CREATE POLICY "Allow public read access on vocabulary" 
  ON public.vocabulary FOR SELECT USING (true);

-- Daily Quotes: Public read for visible quotes
DROP POLICY IF EXISTS "Allow public read access on daily_quotes" ON public.daily_quotes;
CREATE POLICY "Allow public read access on daily_quotes" 
  ON public.daily_quotes FOR SELECT USING (is_hidden = false OR is_hidden IS NULL);

-- Materials: Public read for non-hidden materials
DROP POLICY IF EXISTS "Allow public read access on materials" ON public.materials;
CREATE POLICY "Allow public read access on materials" 
  ON public.materials FOR SELECT USING (is_hidden = false OR is_hidden IS NULL);

-- 5. READING PROGRESS RLS (USERS CAN ONLY READ/WRITE THEIR OWN PROGRESS)
DROP POLICY IF EXISTS "Users can read own reading progress" ON public.reading_progress;
CREATE POLICY "Users can read own reading progress"
  ON public.reading_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reading progress" ON public.reading_progress;
CREATE POLICY "Users can insert own reading progress"
  ON public.reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reading progress" ON public.reading_progress;
CREATE POLICY "Users can update own reading progress"
  ON public.reading_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. AUDIT TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

DROP TRIGGER IF EXISTS trg_class_materials_updated_at ON public.class_materials;
CREATE TRIGGER trg_class_materials_updated_at
  BEFORE UPDATE ON public.class_materials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

