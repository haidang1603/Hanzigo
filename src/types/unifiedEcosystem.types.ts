export type UnifiedToolTab = 'dictionary' | 'grammar' | 'writing' | 'pronunciation';

export interface SourceContextPayload {
  source_type: 'reading' | 'listening' | 'dictionary' | 'grammar' | 'selection' | 'video' | 'ocr';
  source_id?: string;
  sentence_zh: string;
  sentence_pinyin?: string;
  sentence_vi?: string;
}

export interface DictionaryPosMeaning {
  pos: string;
  definitions_vi: string[];
  definitions_en?: string[];
  collocations?: Array<{
    word: string;
    pinyin: string;
    meaning_vi: string;
  }>;
}

export interface DictionaryDecomposition {
  radical?: string;
  stroke_count?: number;
  structure_type?: string;
  components?: Array<{
    char: string;
    pinyin?: string;
    meaning_vi?: string;
  }>;
  mnemonic_vi?: string;
}

export interface DictionaryEntryRow {
  id: string;
  simplified: string;
  traditional: string;
  pinyin_display: string;
  pinyin_numeric: string;
  pinyin_clean: string;
  han_viet: string;
  hsk_2_level?: number | null;
  hsk_3_level?: number | null;
  frequency_rank?: number | null;
  pos_meanings: DictionaryPosMeaning[];
  decomposition?: DictionaryDecomposition | null;
  measure_words?: Array<{
    simplified: string;
    pinyin: string;
    usage_note?: string;
  }>;
  synonyms_antonyms?: Record<string, unknown>;
  examples?: Array<{
    hanzi: string;
    pinyin: string;
    vi: string;
    hsk_level?: number;
  }>;
}

export interface GrammarFormulaToken {
  role: 'S' | 'V' | 'O' | 'Keyword' | 'Complement' | 'Particle';
  label_zh: string;
  label_vi: string;
}

export interface GrammarCommonMistake {
  wrong_zh: string;
  right_zh: string;
  reason_vi: string;
}

export interface GrammarPointRow {
  id: string;
  code: string;
  hsk_level: number;
  category?: string;
  title_vi: string;
  pattern_display: string;
  formula_tokens?: GrammarFormulaToken[];
  explanation_vi: string;
  common_mistakes?: GrammarCommonMistake[];
  common_mistakes_vi?: string | null;
  examples?: Array<{
    hanzi: string;
    pinyin: string;
    vi: string;
    highlight?: string;
  }>;
  practice_items?: Array<Record<string, unknown>>;
}

export interface UserVocabItemRow {
  id: string;
  user_id: string;
  deck_id?: string | null;
  simplified: string;
  pinyin: string;
  han_viet?: string | null;
  meaning_vi: string;
  hsk_level?: number | null;
  source_context?: SourceContextPayload[];
  meaning_mastery: number;
  writing_mastery: number;
  pronunciation_mastery: number;
  overall_mastery?: number;
  created_at?: string;
  updated_at?: string;
}

