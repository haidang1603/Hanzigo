import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

/**
 * Fetch Vocabulary from Database
 */
export async function getVocabularyFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('id', { ascending: true })
      .limit(5000);
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getVocabulary notice:', err);
    return null;
  }
}

/**
 * Add single vocabulary item (Admin or authorized)
 */
export async function addVocabularyToDb(vocab) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .insert([vocab])
      .select('id')
      .single();
    if (error) throw error;
    return data?.id;
  } catch (err) {
    console.warn('Supabase addVocabulary error:', err);
    return null;
  }
}

/**
 * Fetch SRS Progress for specific user from `user_vocab_srs` table
 */
export async function getUserVocabSrsProgress(userId) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(userId)) return [];
  try {
    const { data, error } = await supabase
      .from('user_vocab_srs')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Could not fetch user vocab SRS:', err);
    return [];
  }
}

/**
 * Upsert SRS review state for a character
 */
export async function saveUserVocabSrsCard(userId, srsCard) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(userId) || !srsCard?.hanzi) return false;

  try {
    const payload = {
      user_id: userId,
      hanzi: srsCard.hanzi,
      pinyin: srsCard.pinyin || '',
      meaning: srsCard.meaning || '',
      level: srsCard.level || 'HSK 1',
      stage: srsCard.stage ?? 0,
      repetitions: srsCard.repetitions ?? 0,
      interval_days: srsCard.intervalDays ?? 1,
      ease_factor: srsCard.easeFactor ?? 2.50,
      next_review_at: srsCard.nextReviewAt || new Date().toISOString(),
      last_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_vocab_srs')
      .upsert(payload, { onConflict: 'user_id,hanzi' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not save user vocab SRS card:', err);
    return false;
  }
}

/**
 * Fetch Chinese Writing / Stroke Order Characters
 */
export async function getWritingCharactersFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('writing_characters')
      .select('*')
      .order('id', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return (data || []).map(w => ({
      char: w.hanzi,
      pinyin: w.pinyin,
      hanviet: w.hanviet,
      meaning: w.meaning,
      strokesCount: w.strokes,
      strokeOrder: w.stroke_order,
      components: w.components,
      tip: w.tips
    }));
  } catch (err) {
    console.warn('Supabase getWritingCharacters notice:', err);
    return null;
  }
}

/**
 * Fetch Pronunciation items (Initials, Finals, Tones)
 */
export async function getPronunciationItemsFromDb() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pronunciation_items')
      .select('*')
      .order('id', { ascending: true })
      .limit(1000);
    if (error) throw error;
    return (data || []).map(p => ({
      id: String(p.id),
      hanzi: p.char,
      pinyin: p.pinyin,
      meaning: p.meaning,
      category: p.type || p.level || 'HSK 1',
      tip: p.sample_word || ''
    }));
  } catch (err) {
    console.warn('Supabase getPronunciationItems notice:', err);
    return null;
  }
}

/**
 * Add custom pronunciation item
 */
export async function addPronunciationItemToDb(item) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pronunciation_items')
      .insert([{
        char: item.hanzi,
        pinyin: item.pinyin,
        meaning: item.meaning,
        level: item.category || 'Tự thêm',
        type: item.category || 'Tự thêm',
        sample_word: item.tip || ''
      }])
      .select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.warn('Supabase addPronunciationItem error:', err);
    return null;
  }
}
