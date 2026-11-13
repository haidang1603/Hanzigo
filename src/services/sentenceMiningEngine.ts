import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { VOCABULARY_LIST } from '../data/chineseData.js';
import { tokenizeChineseText } from '../utils/chineseTokenizer.ts';
import { getSavedDeckWords, saveWordToDeck, type DictionaryEntry } from './dictionaryService.ts';
import { listVocabItems } from './vocabWorkspaceService.ts';
import { getBuiltInVideos } from './videoStudioService.ts';
import { listImportedWebArticles } from './articleImporterService.ts';
import { listReadingArticles } from './readingStudioService.ts';
import { listOcrDocuments } from './ocrScannerService.ts';
import { CURATED_TEXTBOOK_UNITS, CURATED_TEXTBOOK_SERIES } from './textbookCompanionService.ts';

export type ImmersionSourceModule = 'video' | 'ocr' | 'article' | 'story' | 'textbook';

export interface MediaContext {
  source_module: ImmersionSourceModule;
  source_id: string;
  source_title: string;
  video_id?: string;
  start_ms?: number;
  end_ms?: number;
  snapshot_image_url?: string;
  audio_clip_url?: string;
}

export interface MinedSentenceCard {
  id: string;
  user_id?: string | null;
  target_word: string;
  target_vocab_item_id?: string | null;
  sentence_zh: string;
  sentence_pinyin: string;
  sentence_vi: string;
  media_context: MediaContext;
  comprehensibility_ratio: number;
  is_i_plus_one: boolean;
  created_at: string;
}

export interface SentenceTokenLite {
  text: string;
  pinyin?: string;
  meaning_vi?: string;
  hsk_level?: number;
  is_punctuation?: boolean;
}

export interface CandidateImmersionSentence {
  sentence_zh: string;
  sentence_pinyin: string;
  sentence_vi: string;
  tokens: SentenceTokenLite[];
  media_context: MediaContext;
}

export interface AnalyzedSentenceResult {
  candidate: CandidateImmersionSentence;
  unknown_words: string[];
  known_count: number;
  total_content_words: number;
  comprehensibility_ratio: number;
  is_i_plus_one: boolean;
  target_word: string | null;
  target_pinyin?: string;
  target_meaning_vi?: string;
}

export interface RecommendedImmersionChannel {
  source_module: ImmersionSourceModule;
  source_id: string;
  title: string;
  subtitle: string;
  coverage_pct: number;
  i_plus_one_count: number;
  total_sentences: number;
  target_route_tab: string;
}

const LOCAL_MINED_CARDS_KEY = 'hanzigo_mined_sentence_cards_v1';

// ---------------------------------------------------------------------------
// Known Words Resolution (Task 27.06 SRS + HSK 1-2 Core Baseline)
// ---------------------------------------------------------------------------

export async function getUserKnownWordsSet(
  user?: { id?: string | null } | null
): Promise<Set<string>> {
  const known = new Set<string>();

  // 1. User's saved deck words & SRS workspace items
  const saved = getSavedDeckWords(user);
  for (const w of saved) {
    if (w) known.add(w.trim());
  }

  try {
    const items = await listVocabItems(user);
    for (const item of items) {
      if (item.hanzi) known.add(item.hanzi.trim());
    }
  } catch {
    // ignore
  }

  // 2. Include HSK 1-2 foundational words as baseline known words (i)
  // so learners immediately experience realistic i+1 recommendations
  for (const v of VOCABULARY_LIST) {
    const match = String(v?.level || '').match(/(\d+)/);
    const lvl = match ? Number(match[1]) : 99;
    if (v?.hanzi && lvl <= 2) {
      known.add(v.hanzi.trim());
    }
  }

  return known;
}

// ---------------------------------------------------------------------------
// Core i+1 Sentence Miner Algorithm
// ---------------------------------------------------------------------------

export function analyzeSentenceComprehensibility(
  candidate: CandidateImmersionSentence,
  knownWordsSet: Set<string>
): AnalyzedSentenceResult {
  const contentTokens = (candidate.tokens || []).filter(
    (t) => !t.is_punctuation && /[\u4e00-\u9fa5]/.test(t.text)
  );

  const uniqueUnknowns: string[] = [];
  const unknownSet = new Set<string>();
  let knownCount = 0;

  for (const tok of contentTokens) {
    const word = tok.text.trim();
    if (knownWordsSet.has(word)) {
      knownCount += 1;
    } else if (!unknownSet.has(word)) {
      unknownSet.add(word);
      uniqueUnknowns.push(word);
    }
  }

  const total = contentTokens.length;
  const ratio = total > 0 ? Number(((knownCount / total) * 100).toFixed(2)) : 0;
  const isLengthOptimal = total >= 3 && total <= 25;
  const isIPlusOne = isLengthOptimal && uniqueUnknowns.length === 1;
  const targetWord = isIPlusOne ? uniqueUnknowns[0] : uniqueUnknowns[0] || null;
  const targetToken = targetWord
    ? contentTokens.find((t) => t.text.trim() === targetWord)
    : undefined;

  return {
    candidate,
    unknown_words: uniqueUnknowns,
    known_count: knownCount,
    total_content_words: total,
    comprehensibility_ratio: ratio,
    is_i_plus_one: isIPlusOne,
    target_word: targetWord,
    target_pinyin: targetToken?.pinyin,
    target_meaning_vi: targetToken?.meaning_vi,
  };
}

/**
 * Filter optimal i+1 Golden Sentences (5..25 tokens, exactly 1 unknown word)
 */
export function findOptimalIPlusOneSentences(
  candidates: CandidateImmersionSentence[],
  knownWordsSet: Set<string>
): AnalyzedSentenceResult[] {
  const results: AnalyzedSentenceResult[] = [];

  for (const cand of candidates) {
    const analyzed = analyzeSentenceComprehensibility(cand, knownWordsSet);
    if (analyzed.is_i_plus_one && analyzed.total_content_words >= 4 && analyzed.total_content_words <= 25) {
      results.push(analyzed);
    }
  }

  return results.sort((a, b) => b.comprehensibility_ratio - a.comprehensibility_ratio);
}

// ---------------------------------------------------------------------------
// Cross-Module Ecosystem Scanner (Videos, OCR, Web Articles, Stories, Textbooks)
// ---------------------------------------------------------------------------

export async function scanEcosystemForImmersionRecommendations(
  user?: { id?: string | null } | null
): Promise<{
  knownWordsCount: number;
  recommendedChannels: RecommendedImmersionChannel[];
  goldenQueue: AnalyzedSentenceResult[];
}> {
  const knownSet = await getUserKnownWordsSet(user);
  const allCandidates: CandidateImmersionSentence[] = [];
  const channels: RecommendedImmersionChannel[] = [];

  // 1. Videos (29.01)
  const videos = getBuiltInVideos();
  for (const video of videos) {
    const videoCandidates: CandidateImmersionSentence[] = video.subtitles.map((cue) => ({
      sentence_zh: cue.zh_raw,
      sentence_pinyin: cue.pinyin_full,
      sentence_vi: cue.vi_translation,
      tokens: cue.tokens,
      media_context: {
        source_module: 'video',
        source_id: video.id,
        source_title: video.title_vi,
        video_id: video.external_video_id,
        start_ms: cue.start_ms,
        end_ms: cue.end_ms,
        snapshot_image_url: video.thumbnail_url,
      },
    }));
    allCandidates.push(...videoCandidates);

    const analyzed = videoCandidates.map((c) => analyzeSentenceComprehensibility(c, knownSet));
    const avgCov =
      analyzed.length > 0
        ? Math.round(analyzed.reduce((s, a) => s + a.comprehensibility_ratio, 0) / analyzed.length)
        : 0;
    const iPlusOneCount = analyzed.filter((a) => a.is_i_plus_one).length;

    channels.push({
      source_module: 'video',
      source_id: video.id,
      title: `${video.title_zh} — ${video.title_vi}`,
      subtitle: `Video Studio · HSK ${video.hsk_level}`,
      coverage_pct: avgCov,
      i_plus_one_count: iPlusOneCount,
      total_sentences: videoCandidates.length,
      target_route_tab: 'practice',
    });
  }

  // 2. Imported Web Articles (29.03)
  const webArticles = await listImportedWebArticles(user?.id);
  for (const art of webArticles.slice(0, 4)) {
    const artCandidates: CandidateImmersionSentence[] = [];
    for (const para of art.versions.original || []) {
      for (const sent of para.sentences || []) {
        artCandidates.push({
          sentence_zh: sent.zh_raw,
          sentence_pinyin: sent.pinyin_full,
          sentence_vi: sent.vi_translation,
          tokens: sent.tokens,
          media_context: {
            source_module: 'article',
            source_id: art.id,
            source_title: art.original_title_zh,
          },
        });
      }
    }
    allCandidates.push(...artCandidates);

    const analyzed = artCandidates.map((c) => analyzeSentenceComprehensibility(c, knownSet));
    const avgCov =
      analyzed.length > 0
        ? Math.round(analyzed.reduce((s, a) => s + a.comprehensibility_ratio, 0) / analyzed.length)
        : 0;
    channels.push({
      source_module: 'article',
      source_id: art.id,
      title: art.original_title_zh,
      subtitle: `Web Clipper · ${art.domain_name}`,
      coverage_pct: avgCov,
      i_plus_one_count: analyzed.filter((a) => a.is_i_plus_one).length,
      total_sentences: artCandidates.length,
      target_route_tab: 'reader',
    });
  }

  // 3. Reading Studio Stories (27.04 / 29.06)
  try {
    const stories = await listReadingArticles();
    for (const st of stories.slice(0, 3)) {
      const storyCandidates: CandidateImmersionSentence[] = [];
      for (const para of st.content_paragraphs || []) {
        for (const sent of para.sentences || []) {
          storyCandidates.push({
            sentence_zh: sent.zh_raw,
            sentence_pinyin: sent.pinyin_full,
            sentence_vi: sent.vi_translation,
            tokens: sent.tokens,
            media_context: {
              source_module: 'story',
              source_id: st.id,
              source_title: st.title_vi || st.title_zh,
            },
          });
        }
      }
      allCandidates.push(...storyCandidates);

      const analyzed = storyCandidates.map((c) => analyzeSentenceComprehensibility(c, knownSet));
      const avgCov =
        analyzed.length > 0
          ? Math.round(analyzed.reduce((s, a) => s + a.comprehensibility_ratio, 0) / analyzed.length)
          : 0;
      channels.push({
        source_module: 'story',
        source_id: st.id,
        title: `${st.title_zh} (${st.title_vi})`,
        subtitle: `Reading Studio · HSK ${st.hsk_level}`,
        coverage_pct: avgCov,
        i_plus_one_count: analyzed.filter((a) => a.is_i_plus_one).length,
        total_sentences: storyCandidates.length,
        target_route_tab: 'reader',
      });
    }
  } catch {
    // ignore if unavailable
  }

  // 4. OCR Documents (29.02)
  try {
    const ocrDocs = await listOcrDocuments(user);
    for (const doc of ocrDocs.slice(0, 2)) {
      for (const blk of doc.ocr_blocks) {
        allCandidates.push({
          sentence_zh: blk.text_zh,
          sentence_pinyin: blk.pinyin,
          sentence_vi: blk.translation_vi,
          tokens: blk.tokens,
          media_context: {
            source_module: 'ocr',
            source_id: doc.id,
            source_title: doc.title,
            snapshot_image_url: doc.image_url,
          },
        });
      }
    }
  } catch {
    // ignore
  }

  // 5. Textbooks (29.07)
  for (const unit of CURATED_TEXTBOOK_UNITS.slice(0, 3)) {
    const series = CURATED_TEXTBOOK_SERIES.find((s) => s.id === unit.series_id);
    const unitCandidates: CandidateImmersionSentence[] = unit.reading_dialogue.map((line) => ({
      sentence_zh: line.zh,
      sentence_pinyin: line.pinyin,
      sentence_vi: line.vi,
      tokens: tokenizeChineseText(line.zh),
      media_context: {
        source_module: 'textbook',
        source_id: unit.id,
        source_title: `${series?.title_zh || 'Giáo trình'} Q${unit.volume_number}·B${unit.unit_number}`,
      },
    }));
    allCandidates.push(...unitCandidates);
  }

  const goldenQueue = findOptimalIPlusOneSentences(allCandidates, knownSet);

  // Sort channels prioritizing sweet spot 85%-96% coverage & highest i+1 yield
  const sortedChannels = channels.sort((a, b) => {
    const aSweet = a.coverage_pct >= 80 && a.coverage_pct <= 96 ? 1 : 0;
    const bSweet = b.coverage_pct >= 80 && b.coverage_pct <= 96 ? 1 : 0;
    if (aSweet !== bSweet) return bSweet - aSweet;
    return b.i_plus_one_count - a.i_plus_one_count;
  });

  return {
    knownWordsCount: knownSet.size,
    recommendedChannels: sortedChannels,
    goldenQueue,
  };
}

// ---------------------------------------------------------------------------
// One-Click Multimedia Card Generator & Persistence
// ---------------------------------------------------------------------------

let memoryMinedCards: MinedSentenceCard[] = [];

function readLocalMinedCards(): MinedSentenceCard[] {
  try {
    if (typeof localStorage === 'undefined') {
      return memoryMinedCards;
    }
    const raw = localStorage.getItem(LOCAL_MINED_CARDS_KEY);
    return raw ? (JSON.parse(raw) as MinedSentenceCard[]) : memoryMinedCards;
  } catch {
    return memoryMinedCards;
  }
}

function writeLocalMinedCards(cards: MinedSentenceCard[]): void {
  const sliced = cards.slice(0, 100);
  memoryMinedCards = sliced;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_MINED_CARDS_KEY, JSON.stringify(sliced));
    }
  } catch {
    // ignore
  }
}

export async function listMinedSentenceCards(
  user?: { id?: string | null } | null
): Promise<MinedSentenceCard[]> {
  const local = readLocalMinedCards();
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return local;
  }
  try {
    const { data, error } = await supabase
      .from('mined_sentence_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as MinedSentenceCard[];
    }
  } catch {
    // fallback
  }
  return local;
}

export async function mineSentenceToMultimediaCard(params: {
  analyzed: AnalyzedSentenceResult;
  user?: { id?: string | null } | null;
}): Promise<MinedSentenceCard> {
  const { analyzed, user } = params;
  const targetWord = analyzed.target_word || analyzed.unknown_words[0] || '';

  const card: MinedSentenceCard = {
    id: `mine-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    user_id: user?.id || null,
    target_word: targetWord,
    target_vocab_item_id: null,
    sentence_zh: analyzed.candidate.sentence_zh,
    sentence_pinyin: analyzed.candidate.sentence_pinyin,
    sentence_vi: analyzed.candidate.sentence_vi,
    media_context: analyzed.candidate.media_context,
    comprehensibility_ratio: analyzed.comprehensibility_ratio,
    is_i_plus_one: analyzed.is_i_plus_one,
    created_at: new Date().toISOString(),
  };

  // Persist to local storage
  const existing = readLocalMinedCards();
  const deduped = existing.filter(
    (c) => !(c.sentence_zh === card.sentence_zh && c.target_word === card.target_word)
  );
  writeLocalMinedCards([card, ...deduped]);

  // Also save target_word into user's SRS Vocabulary Deck
  if (targetWord) {
    const dictEntry: DictionaryEntry = {
      id: `mined-${targetWord}`,
      simplified: targetWord,
      traditional: targetWord,
      pinyin: analyzed.target_pinyin || '',
      pinyin_numbered: analyzed.target_pinyin || '',
      hsk_level: 4,
      meanings_vi: [analyzed.target_meaning_vi || `Từ khóa học từ: ${analyzed.candidate.media_context.source_title}`],
      examples: [
        {
          zh: card.sentence_zh,
          pinyin: card.sentence_pinyin,
          vi: card.sentence_vi,
        },
      ],
    };
    await saveWordToDeck(dictEntry, user);
  }

  // Persist to Supabase if authenticated
  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      const { data, error } = await supabase
        .from('mined_sentence_cards')
        .insert({
          user_id: user.id,
          target_word: card.target_word,
          sentence_zh: card.sentence_zh,
          sentence_pinyin: card.sentence_pinyin,
          sentence_vi: card.sentence_vi,
          media_context: card.media_context,
          comprehensibility_ratio: card.comprehensibility_ratio,
          is_i_plus_one: card.is_i_plus_one,
        })
        .select()
        .single();

      if (!error && data) {
        card.id = String(data.id);
      }
    } catch {
      // keep local copy
    }
  }

  return card;
}
