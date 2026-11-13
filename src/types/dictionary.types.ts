export type SearchInputType =
  | 'hanzi'
  | 'pinyin_numeric'
  | 'pinyin_clean'
  | 'han_viet'
  | 'vietnamese';

export type PosTag =
  | 'v'
  | 'n'
  | 'adj'
  | 'mw'
  | 'adv'
  | 'prep'
  | 'conj'
  | 'pron'
  | 'num'
  | 'idiom'
  | 'other';

export interface CollocationItem {
  word: string;
  pinyin: string;
  meaning_vi: string;
}

export interface PosMeaningItem {
  pos: PosTag;
  definitions_vi: string[];
  definitions_en: string[];
  collocations: CollocationItem[];
}

export type StructureType =
  | '左右'
  | '上下'
  | '内外'
  | '独体'
  | '品字'
  | '半包围'
  | '좌우'
  | '상하'
  | '내외';

export interface DecompositionComponent {
  char: string;
  pinyin: string;
  meaning_vi: string;
}

export interface CharacterDecomposition {
  radical: string;
  radical_meaning_vi: string;
  stroke_count: number;
  structure_type: StructureType;
  components: DecompositionComponent[];
  mnemonic_vi: string;
}

export interface MeasureWordItem {
  simplified: string;
  pinyin: string;
  usage_note: string;
}

export interface SynonymItem {
  word: string;
  diff_note_vi: string;
}

export interface SynonymsAntonyms {
  synonyms: SynonymItem[];
  antonyms: string[];
}

export interface DictionaryExample {
  hanzi: string;
  pinyin: string;
  vi: string;
  hsk_level: number;
  audio_url?: string;
}

export interface DictionaryEntry {
  id: string;
  simplified: string;
  traditional: string;
  pinyin_display: string;
  pinyin_numeric: string;
  pinyin_clean: string;
  han_viet: string;
  hsk_2_level: number | null;
  hsk_3_level: number | null;
  frequency_rank: number;
  pos_meanings: PosMeaningItem[];
  decomposition: CharacterDecomposition | null;
  measure_words: MeasureWordItem[];
  synonyms_antonyms: SynonymsAntonyms;
  examples: DictionaryExample[];
  source?: 'local' | 'cedict' | 'ai_fallback';
  match_score?: number;
}

export interface SentenceTokenResult {
  token: string;
  entry: DictionaryEntry | null;
  isKnown: boolean;
}

export interface DictionarySearchResult {
  query: string;
  inputType: SearchInputType;
  entries: DictionaryEntry[];
  sentenceTokens: SentenceTokenResult[];
  latencyMs: number;
  usedAiFallback: boolean;
}

export interface DictionaryHistoryItem {
  query_text: string;
  simplified?: string;
  pinyin_display?: string;
  meaning_vi?: string;
  searched_at: string;
}

