/**
 * =========================================================================
 * HANZI GO — CUSTOM VOCABULARY SERVICE (SUPABASE AUTHORITATIVE ENGINE)
 * =========================================================================
 * Manages Admin-created Custom Vocabulary in `public.vocabulary` table.
 * Provides full CRUD, duplicate prevention, and zero-loss local storage migration.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Normalize a DB vocabulary row to frontend schema
 */
export function normalizeCustomVocab(v) {
  if (!v) return null;
  const ex = (typeof v.example === 'object' && v.example !== null) ? v.example : {};
  const rawExampleStr = typeof v.example === 'string' ? v.example : '';
  const rawLevelStr = String(v.level || v.hsk || 'HSK 1');
  const hskKey = rawLevelStr.toLowerCase().startsWith('hsk') 
    ? rawLevelStr.toLowerCase().replace(/\s+/g, '') 
    : `hsk${rawLevelStr.replace(/\D/g, '') || '1'}`;

  const exampleSentence = v.example_sentence || ex.sentence || ex.hanzi || rawExampleStr || '';
  const examplePinyin = v.example_pinyin || ex.pinyin || v.examplePinyin || '';
  const exampleMeaning = v.example_meaning || ex.meaning || ex.translation || v.exampleMeaning || '';
  const mnemonic = v.mnemonic || v.memoryTip || '';

  return {
    id: v.id,
    hanzi: v.hanzi || '',
    pinyin: v.pinyin || '',
    hanviet: v.hanviet || '',
    meaning: v.meaning || '',
    level: rawLevelStr,
    hsk: hskKey,
    topic: v.topic || 'Tự thêm',
    radical: v.radical || '',
    strokes: v.strokes || 1,
    mnemonic: mnemonic,
    memoryTip: mnemonic,
    example: exampleSentence,
    exampleSentence: exampleSentence,
    examplePinyin: examplePinyin,
    exampleMeaning: exampleMeaning,
    isCustom: true,
    is_custom: true,
    isHidden: Boolean(v.is_hidden || v.isHidden),
    is_hidden: Boolean(v.is_hidden || v.isHidden),
    createdAt: v.created_at ? v.created_at.split('T')[0] : '2026-01-01'
  };
}

/**
 * Fetch Custom Vocabulary from Supabase DB
 * Checks both native `is_custom` column and JSONB `example->>is_custom` metadata
 */
export async function getCustomVocabularyFromDb() {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    // 1. Try querying via JSONB filter or select all and filter
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    if (!Array.isArray(data)) return [];

    // Filter items that are custom
    const customItems = data.filter(v => {
      const isCustomCol = v.is_custom === true;
      const isCustomJson = v.example && (v.example.is_custom === true || v.example.is_custom === 'true' || v.example.isCustom === true);
      const isCustomTopic = typeof v.topic === 'string' && (v.topic.startsWith('Tự thêm') || v.topic.startsWith('Custom'));
      return isCustomCol || isCustomJson || isCustomTopic;
    });

    return customItems.map(normalizeCustomVocab);
  } catch (err) {
    console.warn('[customVocabularyService] getCustomVocabularyFromDb notice:', err);
    return [];
  }
}

/**
 * Check if a word already exists in Supabase vocabulary table
 */
export async function checkVocabularyDuplicate(hanzi, excludeId = null) {
  if (!isSupabaseConfigured || !supabase || !hanzi) return false;
  try {
    const trimmed = String(hanzi).trim();
    let query = supabase
      .from('vocabulary')
      .select('id, hanzi')
      .eq('hanzi', trimmed);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);
    if (error) throw error;
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.warn('[customVocabularyService] checkVocabularyDuplicate error:', err);
    return false;
  }
}

/**
 * Add single custom vocabulary item to Supabase DB
 */
export async function addCustomVocabularyToDb(vocab) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  if (!vocab?.hanzi || !vocab?.meaning) {
    throw new Error('Chữ Hán và ý nghĩa tiếng Việt là bắt buộc.');
  }

  const trimmedHanzi = vocab.hanzi.trim();
  const isDup = await checkVocabularyDuplicate(trimmedHanzi);
  if (isDup) {
    throw new Error(`Từ vựng "${trimmedHanzi}" đã tồn tại trong hệ thống.`);
  }

  const hskStr = vocab.level || (vocab.hsk ? vocab.hsk.toUpperCase() : 'HSK 1');
  const payload = {
    hanzi: trimmedHanzi,
    pinyin: vocab.pinyin?.trim() || '',
    hanviet: vocab.hanviet?.trim() || '',
    meaning: vocab.meaning.trim(),
    level: hskStr.startsWith('HSK') ? hskStr : `HSK ${hskStr}`,
    topic: vocab.topic?.trim() || 'Tự thêm',
    mnemonic: vocab.memoryTip?.trim() || '',
    example_sentence: vocab.example?.trim() || '',
    example_pinyin: vocab.examplePinyin?.trim() || '',
    example_meaning: vocab.exampleMeaning?.trim() || '',
    example: {
      sentence: vocab.example?.trim() || '',
      pinyin: vocab.examplePinyin?.trim() || '',
      meaning: vocab.exampleMeaning?.trim() || '',
      is_custom: true,
      isCustom: true
    }
  };

  const { data, error } = await supabase
    .from('vocabulary')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    console.error('[customVocabularyService] addCustomVocabularyToDb error:', error);
    throw new Error(error.message || 'Không thể lưu từ vựng lên máy chủ.');
  }

  return normalizeCustomVocab(data);
}

/**
 * Update custom vocabulary item in Supabase DB
 */
export async function updateCustomVocabularyInDb(id, vocabData) {
  if (!isSupabaseConfigured || !supabase || !id) {
    throw new Error('Invalid request or Supabase client unconfigured.');
  }

  if (!vocabData?.hanzi || !vocabData?.meaning) {
    throw new Error('Chữ Hán và ý nghĩa tiếng Việt là bắt buộc.');
  }

  const trimmedHanzi = vocabData.hanzi.trim();
  const isDup = await checkVocabularyDuplicate(trimmedHanzi, id);
  if (isDup) {
    throw new Error(`Từ vựng "${trimmedHanzi}" đã tồn tại ở một mục khác.`);
  }

  const hskStr = vocabData.level || (vocabData.hsk ? vocabData.hsk.toUpperCase() : 'HSK 1');
  const payload = {
    hanzi: trimmedHanzi,
    pinyin: vocabData.pinyin?.trim() || '',
    hanviet: vocabData.hanviet?.trim() || '',
    meaning: vocabData.meaning.trim(),
    level: hskStr.startsWith('HSK') ? hskStr : `HSK ${hskStr}`,
    topic: vocabData.topic?.trim() || 'Tự thêm',
    mnemonic: vocabData.memoryTip?.trim() || '',
    example_sentence: vocabData.example?.trim() || '',
    example_pinyin: vocabData.examplePinyin?.trim() || '',
    example_meaning: vocabData.exampleMeaning?.trim() || '',
    example: {
      sentence: vocabData.example?.trim() || '',
      pinyin: vocabData.examplePinyin?.trim() || '',
      meaning: vocabData.exampleMeaning?.trim() || '',
      is_custom: true,
      isCustom: true
    }
  };

  const { data, error } = await supabase
    .from('vocabulary')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[customVocabularyService] updateCustomVocabularyInDb error:', error);
    throw new Error(error.message || 'Không thể cập nhật từ vựng trên máy chủ.');
  }

  return normalizeCustomVocab(data);
}

/**
 * Delete custom vocabulary item from Supabase DB
 */
export async function deleteCustomVocabularyFromDb(id) {
  if (!isSupabaseConfigured || !supabase || !id) {
    throw new Error('Invalid request or missing ID.');
  }

  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[customVocabularyService] deleteCustomVocabularyFromDb error:', error);
    throw new Error(error.message || 'Không thể xóa từ vựng khỏi máy chủ.');
  }

  return true;
}

/**
 * Hardened Migration helper: Read custom vocab from LocalStorage and upload to Supabase DB idempotently
 * Requires authenticated admin user, handles partial failures without data loss, and marks records.
 */
export async function migrateLocalStorageCustomVocab(user = null) {
  const result = {
    totalFound: 0,
    migratedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    errors: []
  };

  // Only proceed if an authenticated admin user is present
  if (!user || (user.role !== 'admin' && !user.isAdmin)) {
    result.errors.push('Admin access required to perform vocabulary migration.');
    return result;
  }

  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('hanzigo_custom_vocab') : null;
    if (!raw) return result;

    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return result;

    result.totalFound = list.length;

    for (const item of list) {
      if (!item.hanzi || !item.meaning) {
        result.skippedCount++;
        continue;
      }

      if (item._migrated || item.isMigrated) {
        result.skippedCount++;
        continue;
      }

      const exists = await checkVocabularyDuplicate(item.hanzi);
      if (exists) {
        result.skippedCount++;
        item._migrated = true;
        continue;
      }

      try {
        await addCustomVocabularyToDb(item, user);
        result.migratedCount++;
        item._migrated = true;
      } catch (err) {
        result.failedCount++;
        result.errors.push({ hanzi: item.hanzi, error: err.message });
      }
    }

    // Persist status in localStorage without wiping unmigrated items
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(list));
      if (result.migratedCount > 0) {
        localStorage.setItem('hanzigo_custom_vocab_migrated_at', new Date().toISOString());
      }
    }
  } catch (err) {
    console.warn('[customVocabularyService] Migration warning:', err);
    result.failedCount++;
    result.errors.push({ fatal: err.message });
  }

  return result;
}
