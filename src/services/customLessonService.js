/**
 * =========================================================================
 * HANZI GO — CUSTOM LESSON SERVICE (SUPABASE AUTHORITATIVE ENGINE)
 * =========================================================================
 * Manages Admin-created Custom / Supplementary Lessons in `public.lessons` table.
 * Provides full CRUD, duplicate checks, and zero-loss local storage migration.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Normalize a DB lesson row to frontend schema
 */
export function normalizeCustomLesson(l) {
  if (!l) return null;
  const rawLevel = String(l.level || l.level_id || 'HSK 1');
  let formattedLevel = rawLevel;
  if (/^hsk\s*\d$/i.test(rawLevel)) {
    const num = rawLevel.replace(/\D/g, '');
    formattedLevel = `HSK ${num}`;
  } else if (/^\d$/.test(rawLevel)) {
    formattedLevel = `HSK ${rawLevel}`;
  }

  const levelId = formattedLevel.toLowerCase().replace(/\s+/g, '');

  return {
    id: l.id,
    title: l.title || '',
    level: formattedLevel,
    level_id: levelId,
    levelId: levelId,
    duration: Number(l.duration) || 20,
    xp: Number(l.xp) || 50,
    number: Number(l.number) || 1,
    description: l.description || '',
    grammarPoints: l.grammarPoints || l.grammar_points || '',
    isCustom: true,
    is_custom: true,
    isHidden: Boolean(l.is_hidden || l.isHidden),
    is_hidden: Boolean(l.is_hidden || l.isHidden),
    createdAt: l.created_at ? l.created_at.split('T')[0] : '2026-01-01'
  };
}

/**
 * Fetch Custom Lessons from Supabase DB
 * Filters for custom records (IDs prefixed with `custom-` or `is_custom = true`)
 */
export async function getCustomLessonsFromDb() {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!Array.isArray(data)) return [];

    // Filter items that are custom
    const customItems = data.filter(l => {
      const isCustomId = typeof l.id === 'string' && (l.id.startsWith('custom-') || l.id.startsWith('custom_'));
      const isCustomCol = l.is_custom === true;
      const isCustomNum = Number(l.number) >= 100;
      return isCustomId || isCustomCol || isCustomNum;
    });

    return customItems.map(normalizeCustomLesson);
  } catch (err) {
    console.warn('[customLessonService] getCustomLessonsFromDb notice:', err);
    return [];
  }
}

/**
 * Check if a lesson with the same title already exists
 */
export async function checkLessonDuplicate(title, excludeId = null) {
  if (!isSupabaseConfigured || !supabase || !title) return false;
  try {
    const trimmed = String(title).trim();
    let query = supabase
      .from('lessons')
      .select('id, title')
      .eq('title', trimmed);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);
    if (error) throw error;
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.warn('[customLessonService] checkLessonDuplicate error:', err);
    return false;
  }
}

/**
 * Add single custom lesson to Supabase DB
 */
export async function addCustomLessonToDb(lesson, user = null) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  if (!lesson?.title || !lesson?.title.trim()) {
    throw new Error('Tên bài học là bắt buộc.');
  }

  const trimmedTitle = lesson.title.trim();
  const isDup = await checkLessonDuplicate(trimmedTitle);
  if (isDup) {
    throw new Error(`Bài học "${trimmedTitle}" đã tồn tại trong hệ thống.`);
  }

  // Generate collision-resistant unique ID using Web Crypto UUID or timestamp fallback
  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const lessonId = lesson.id && lesson.id.startsWith('custom-') 
    ? lesson.id 
    : `custom-lesson-${uniqueId}`;

  const payload = {
    id: lessonId,
    level_id: lesson.level || lesson.levelId || 'HSK 1',
    number: Number(lesson.number) || (Math.floor(Date.now() / 1000) % 10000) + 100,
    title: trimmedTitle,
    duration: Number(lesson.duration) || 20,
    xp: Number(lesson.xp) || 50,
    description: lesson.description?.trim() || '',
    is_custom: true,
    is_hidden: Boolean(lesson.isHidden || lesson.is_hidden),
    created_by: (user?.uid || user?.id)?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? (user?.uid || user?.id) : null
  };

  const { data, error } = await supabase
    .from('lessons')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    console.error('[customLessonService] addCustomLessonToDb error:', error);
    throw new Error(error.message || 'Không thể tạo bài học trên máy chủ.');
  }

  return normalizeCustomLesson(data);
}

/**
 * Update custom lesson in Supabase DB
 */
export async function updateCustomLessonInDb(id, lessonData) {
  if (!isSupabaseConfigured || !supabase || !id) {
    throw new Error('Invalid request or missing lesson ID.');
  }

  if (!lessonData?.title || !lessonData?.title.trim()) {
    throw new Error('Tên bài học là bắt buộc.');
  }

  const trimmedTitle = lessonData.title.trim();
  const isDup = await checkLessonDuplicate(trimmedTitle, id);
  if (isDup) {
    throw new Error(`Bài học "${trimmedTitle}" đã trùng với một bài học khác.`);
  }

  const payload = {
    level_id: lessonData.level || lessonData.levelId || 'HSK 1',
    title: trimmedTitle,
    duration: Number(lessonData.duration) || 20,
    xp: Number(lessonData.xp) || 50,
    description: lessonData.description?.trim() || ''
  };

  const { data, error } = await supabase
    .from('lessons')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[customLessonService] updateCustomLessonInDb error:', error);
    throw new Error(error.message || 'Không thể cập nhật bài học trên máy chủ.');
  }

  return normalizeCustomLesson(data);
}

/**
 * Delete custom lesson from Supabase DB
 */
export async function deleteCustomLessonFromDb(id) {
  if (!isSupabaseConfigured || !supabase || !id) {
    throw new Error('Invalid request or missing ID.');
  }

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[customLessonService] deleteCustomLessonFromDb error:', error);
    throw new Error(error.message || 'Không thể xóa bài học khỏi máy chủ.');
  }

  return true;
}

/**
 * Fetch supplementary lessons specifically for learners
 * Enforces is_hidden = false and returns normalized objects
 */
export async function getStudentSupplementaryLessons() {
  const allLessons = await getCustomLessonsFromDb();
  // Defense-in-depth: exclude any hidden items
  return allLessons.filter(l => !l.isHidden && !l.is_hidden);
}

/**
 * Mark a custom/supplementary lesson as completed for learner
 * Awards XP idempotently and synchronizes to journey progress
 */
export async function completeCustomLesson(lesson, user = null) {
  if (!lesson || !lesson.id) {
    throw new Error('Missing lesson object or ID.');
  }

  const { getUserJourneyProgress, saveUserJourneyProgress } = await import('./learningPathService.js');
  const { awardXp } = await import('../utils/gamification.js');

  const progress = getUserJourneyProgress(user);
  const isFirstTime = !progress.completedLessons?.[lesson.id];
  const lessonXp = Number(lesson.xp) || 50;

  // Record completion
  progress.completedLessons = progress.completedLessons || {};
  progress.completedLessons[lesson.id] = {
    score: 100,
    stars: 3,
    isCustom: true,
    completedAt: progress.completedLessons[lesson.id]?.completedAt || new Date().toISOString(),
    lastReviewedAt: new Date().toISOString()
  };

  saveUserJourneyProgress(progress, user);

  let awardedAmount = 0;
  if (isFirstTime) {
    awardedAmount = lessonXp;
    awardXp(lessonXp, user, `custom_lesson_complete_${lesson.id}`);
  } else {
    // Review: award small review XP once per day
    awardedAmount = 10;
    const today = new Date().toISOString().split('T')[0];
    awardXp(10, user, `custom_lesson_review_${lesson.id}_${today}`);
  }

  return {
    success: true,
    isFirstTime,
    xpAwarded: awardedAmount,
    lessonId: lesson.id
  };
}

/**
 * Hardened Migration helper: Read custom lessons from LocalStorage and upload to Supabase DB idempotently
 * Requires authenticated admin user, handles partial failures without data loss, and marks records.
 */
export async function migrateLocalStorageCustomLessons(user = null) {
  const result = {
    totalFound: 0,
    migratedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    errors: []
  };

  // Only proceed if an authenticated admin user is present
  if (!user || (user.role !== 'admin' && !user.isAdmin)) {
    result.errors.push('Admin access required to perform lessons migration.');
    return result;
  }

  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('hanzigo_custom_lessons') : null;
    if (!raw) return result;

    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return result;

    result.totalFound = list.length;

    for (const item of list) {
      if (!item.title || !item.title.trim()) {
        result.skippedCount++;
        continue;
      }

      if (item._migrated || item.isMigrated) {
        result.skippedCount++;
        continue;
      }

      const exists = await checkLessonDuplicate(item.title);
      if (exists) {
        result.skippedCount++;
        item._migrated = true;
        continue;
      }

      try {
        await addCustomLessonToDb(item, user);
        result.migratedCount++;
        item._migrated = true;
      } catch (err) {
        result.failedCount++;
        result.errors.push({ title: item.title, error: err.message });
      }
    }

    // Persist status in localStorage without wiping unmigrated items
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(list));
      if (result.migratedCount > 0) {
        localStorage.setItem('hanzigo_custom_lessons_migrated_at', new Date().toISOString());
      }
    }
  } catch (err) {
    console.warn('[customLessonService] Migration warning:', err);
    result.failedCount++;
    result.errors.push({ fatal: err.message });
  }

  return result;
}
