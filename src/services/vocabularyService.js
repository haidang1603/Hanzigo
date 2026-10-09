import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';
import { getUserStorageKey } from '../utils/gamification.js';

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
 * Synchronize words learned in a lesson into user's remembered list & SRS queue
 * Prevents duplicates and maintains consistency between local & cloud storage.
 */
export async function syncLessonVocabToSrs(vocabList = [], user = null) {
  if (!Array.isArray(vocabList) || vocabList.length === 0) return { addedCount: 0 };

  let existingRemembered = [];
  const remKey = getUserStorageKey('hanzigo_vocab_remembered', user);
  try {
    const raw = localStorage.getItem(remKey) || (user ? null : localStorage.getItem('hanzigo_vocab_remembered'));
    if (raw) existingRemembered = JSON.parse(raw) || [];
  } catch {}

  const srsKey = getUserStorageKey('hanzigo_vocab_srs_state', user);
  let srsMap = {};
  try {
    const rawSrs = localStorage.getItem(srsKey) || (user ? null : localStorage.getItem('hanzigo_vocab_srs_state'));
    if (rawSrs) srsMap = JSON.parse(rawSrs) || {};
  } catch {}

  let addedCount = 0;
  const updatedRemembered = [...existingRemembered];
  const tomorrowIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  for (const item of vocabList) {
    const wordId = item.id || item.hanzi;
    const hanzi = item.hanzi || item.char;
    if (!hanzi) continue;

    // 1. Add to remembered words if not present
    if (!updatedRemembered.includes(wordId)) {
      updatedRemembered.push(wordId);
      addedCount++;
    }

    // 2. Initialize or update SRS card state
    if (!srsMap[hanzi]) {
      srsMap[hanzi] = {
        repetitions: 1,
        intervalDays: 1,
        easeFactor: 2.50,
        stage: 1,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: tomorrowIso
      };

      // Sync to cloud if user has uuid
      if (user?.uid) {
        saveUserVocabSrsCard(user.uid, {
          hanzi,
          pinyin: item.pinyin || '',
          meaning: item.meaning || '',
          level: item.level || 'HSK 1',
          stage: 1,
          repetitions: 1,
          intervalDays: 1,
          easeFactor: 2.50,
          nextReviewAt: tomorrowIso
        }).catch(() => {});
      }
    }
  }

  // Save back to local storage
  try {
    localStorage.setItem(remKey, JSON.stringify(updatedRemembered));
    localStorage.setItem(srsKey, JSON.stringify(srsMap));
  } catch {}

  return { addedCount, totalRememberedCount: updatedRemembered.length };
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
