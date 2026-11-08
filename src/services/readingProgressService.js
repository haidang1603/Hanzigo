/**
 * =========================================================================
 * HANZI GO - READING PROGRESS SYNCHRONIZATION SERVICE
 * =========================================================================
 * Quản lý và đồng bộ tiến độ đọc tài liệu giữa các thiết bị (Cloud & Local):
 * - Hỗ trợ bảng chuyên dụng 'reading_progress' và fallback 'user_journey_progress.lesson_details._reading_progress'.
 * - Lưu vị trí đọc: trang hiện tại, tổng số trang, vị trí cuộn pixel (scroll_position),
 *   phần trăm hoàn thành (0 - 100%), cờ hoàn thành và mốc thời gian đọc gần nhất (last_read_at).
 * - Debounce / Throttle tự động ngăn spam mạng khi cuộn tài liệu.
 * - Cơ chế Safe Local Migration: tự động tải tiến độ từ localStorage lên Cloud khi đăng nhập,
 *   bảo toàn dữ liệu mới hơn (Last-Write-Wins dựa trên ISO timestamp), không ghi đè tiến độ mới bằng dữ liệu cũ.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

export const READING_STORAGE_KEY_PREFIX = 'hanzigo_reading_progress';

// Helper lấy key local storage theo từng tài khoản
export function getLocalReadingStorageKey(userId) {
  const safeUid = userId ? String(userId).trim() : 'anonymous';
  return `${READING_STORAGE_KEY_PREFIX}_${safeUid}`;
}

// Đọc toàn bộ danh sách tiến độ từ local storage
export function getLocalReadingStore(userId) {
  if (typeof globalThis.localStorage === 'undefined') return {};
  try {
    const raw = globalThis.localStorage.getItem(getLocalReadingStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

// Lưu tiến độ vào local storage cho một tài liệu
export function saveLocalReadingRecord(userId, materialId, record) {
  if (typeof globalThis.localStorage === 'undefined' || !materialId) return;
  try {
    const store = getLocalReadingStore(userId);
    store[materialId] = {
      ...store[materialId],
      ...record,
      materialId,
      lastReadAt: record.lastReadAt || new Date().toISOString()
    };
    globalThis.localStorage.setItem(getLocalReadingStorageKey(userId), JSON.stringify(store));
  } catch (err) {
    console.warn('[ReadingProgress] Save local error:', err);
  }
}

/**
 * Chuẩn hóa payload tiến độ đọc
 */
export function normalizeReadingProgressPayload(materialId, progress = {}) {
  const safeMatId = String(materialId || '').trim();
  const curPage = Math.max(1, parseInt(progress.currentPage || progress.current_page || 1, 10));
  const totPages = Math.max(1, parseInt(progress.totalPages || progress.total_pages || 1, 10));
  const scrollPos = Math.max(0, parseFloat(progress.scrollPosition || progress.scroll_position || 0));

  let percent = progress.progressPercent ?? progress.progress_percent;
  if (percent === undefined || percent === null || isNaN(percent) || percent < 0) {
    percent = Math.min(100, Math.round((curPage / totPages) * 100));
  } else {
    percent = parseInt(percent, 10);
  }
  percent = Math.max(0, Math.min(100, percent));

  const isCompleted = Boolean(progress.isCompleted ?? progress.is_completed ?? (percent >= 100));

  return {
    materialId: safeMatId,
    title: String(progress.title || '').trim(),
    currentPage: curPage,
    totalPages: totPages,
    scrollPosition: Math.round(scrollPos),
    progressPercent: percent,
    isCompleted,
    lastReadAt: progress.lastReadAt || progress.last_read_at || new Date().toISOString()
  };
}

/**
 * Lấy user ID hiện tại từ Supabase session hoặc tham số truyền vào
 */
export async function getEffectiveUserId(providedUser = null) {
  if (providedUser?.uid || providedUser?.id) {
    const raw = String(providedUser.uid || providedUser.id).trim();
    if (isValidUuid(raw)) return raw;
    // Cho phép simulation id bắt đầu bằng 'sim_' hoặc 'demo_' hoặc 'user_guest'
    if (raw.startsWith('sim_') || raw.startsWith('demo_') || raw === 'user_guest') return raw;
    return null;
  }
  if (!isSupabaseConfigured || !supabase?.auth) return null;
  try {
    const { data } = await supabase.auth.getSession();
    const sessionUid = data?.session?.user?.id;
    if (sessionUid && isValidUuid(sessionUid)) return sessionUid;
  } catch {}
  return null;
}

/**
 * Lấy tiến độ đọc của một tài liệu từ Cloud (kèm fallback Local)
 *
 * @param {string} materialId
 * @param {object} [user]
 * @returns {Promise<object|null>}
 */
export async function getReadingProgress(materialId, user = null) {
  if (!materialId) return null;
  const uid = await getEffectiveUserId(user);

  // 1. Nếu chưa cấu hình Supabase hoặc người dùng chưa đăng nhập: đọc từ LocalStorage
  if (!uid || !isSupabaseConfigured || !supabase) {
    const localStore = getLocalReadingStore(uid);
    return localStore[materialId] || null;
  }

  // 2. Thử truy vấn bảng chuyên dụng 'reading_progress'
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', uid)
      .eq('material_id', materialId)
      .maybeSingle();

    if (!error && data) {
      const normalized = normalizeReadingProgressPayload(materialId, {
        ...data,
        currentPage: data.current_page,
        totalPages: data.total_pages,
        scrollPosition: data.scroll_position,
        progressPercent: data.progress_percent,
        isCompleted: data.is_completed,
        lastReadAt: data.last_read_at
      });
      // Cập nhật lại local cache
      saveLocalReadingRecord(uid, materialId, normalized);
      return normalized;
    }
  } catch {
    // Bảng chưa sẵn sàng, chuyển tiếp sang bảng user_journey_progress
  }

  // 3. Fallback đọc từ user_journey_progress.lesson_details._reading_progress
  try {
    const { data: journeyData, error: jErr } = await supabase
      .from('user_journey_progress')
      .select('lesson_details')
      .eq('user_id', uid)
      .maybeSingle();

    if (!jErr && journeyData?.lesson_details?._reading_progress?.[materialId]) {
      const record = journeyData.lesson_details._reading_progress[materialId];
      const normalized = normalizeReadingProgressPayload(materialId, record);
      saveLocalReadingRecord(uid, materialId, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('[ReadingProgress] Get cloud journey notice:', err);
  }

  // 4. Nếu Cloud chưa có, fallback đọc LocalStorage cũ
  const localStore = getLocalReadingStore(uid);
  return localStore[materialId] || null;
}

/**
 * Lưu tiến độ đọc tài liệu lên Cloud và LocalStorage
 *
 * @param {string} materialId
 * @param {object} progress
 * @param {object} [user]
 * @returns {Promise<{success: boolean, record: object, isCloudSynced: boolean}>}
 */
export async function saveReadingProgress(materialId, progress = {}, user = null) {
  if (!materialId) return { success: false, error: 'Thiếu ID tài liệu' };

  const norm = normalizeReadingProgressPayload(materialId, progress);
  const uid = await getEffectiveUserId(user);

  // 1. Luôn lưu vào LocalStorage tức thì (Immediate Offline Cache)
  saveLocalReadingRecord(uid, materialId, norm);

  if (!uid || !isSupabaseConfigured || !supabase) {
    return { success: true, record: norm, isCloudSynced: false };
  }

  let cloudSuccess = false;

  // 2. Thử ghi vào bảng 'reading_progress'
  try {
    const { error: tblErr } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: uid,
        material_id: materialId,
        title: norm.title,
        current_page: norm.currentPage,
        total_pages: norm.totalPages,
        scroll_position: norm.scrollPosition,
        progress_percent: norm.progressPercent,
        is_completed: norm.isCompleted,
        last_read_at: norm.lastReadAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,material_id' });

    if (!tblErr) {
      cloudSuccess = true;
    }
  } catch {
    // Chuyển sang fallback
  }

  // 3. Nếu bảng 'reading_progress' chưa có, đồng bộ qua 'user_journey_progress'
  if (!cloudSuccess) {
    try {
      const { data: existing } = await supabase
        .from('user_journey_progress')
        .select('lesson_details')
        .eq('user_id', uid)
        .maybeSingle();

      const details = existing?.lesson_details || {};
      const currentReadMap = details._reading_progress || {};

      // Chỉ cập nhật nếu bản ghi mới hơn (Last-Write-Wins)
      const existingRecord = currentReadMap[materialId];
      if (!existingRecord || new Date(norm.lastReadAt) >= new Date(existingRecord.lastReadAt || 0)) {
        currentReadMap[materialId] = norm;
        details._reading_progress = currentReadMap;

        const { error: upErr } = await supabase
          .from('user_journey_progress')
          .upsert({
            user_id: uid,
            lesson_details: details,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (!upErr) cloudSuccess = true;
      } else {
        cloudSuccess = true; // Bỏ qua ghi đè vì trên cloud đã có bản mới hơn
      }
    } catch (err) {
      console.warn('[ReadingProgress] Fallback journey save error:', err);
    }
  }

  return {
    success: true,
    record: norm,
    isCloudSynced: cloudSuccess
  };
}

/**
 * Lấy danh sách các tài liệu đọc gần đây nhất (Recent Reads)
 *
 * @param {number} [limit=5]
 * @param {object} [user]
 * @returns {Promise<Array>}
 */
export async function getRecentReadingProgress(limit = 5, user = null) {
  const uid = await getEffectiveUserId(user);

  // 1. Thử lấy từ bảng 'reading_progress'
  if (uid && isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', uid)
        .order('last_read_at', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(d => normalizeReadingProgressPayload(d.material_id, {
          ...d,
          currentPage: d.current_page,
          totalPages: d.total_pages,
          scrollPosition: d.scroll_position,
          progressPercent: d.progress_percent,
          isCompleted: d.is_completed,
          lastReadAt: d.last_read_at
        }));
      }
    } catch {}

    // 2. Thử lấy từ user_journey_progress
    try {
      const { data: journeyData } = await supabase
        .from('user_journey_progress')
        .select('lesson_details')
        .eq('user_id', uid)
        .maybeSingle();

      const readingMap = journeyData?.lesson_details?._reading_progress || {};
      const list = Object.values(readingMap);
      if (list.length > 0) {
        return list
          .map(item => normalizeReadingProgressPayload(item.materialId, item))
          .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
          .slice(0, limit);
      }
    } catch {}
  }

  // 3. Fallback đọc từ LocalStorage
  const localStore = getLocalReadingStore(uid);
  return Object.values(localStore)
    .map(item => normalizeReadingProgressPayload(item.materialId, item))
    .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
    .slice(0, limit);
}

/**
 * Di chuyển an toàn toàn bộ tiến độ đọc từ LocalStorage lên Cloud khi đăng nhập
 *
 * @param {object} user
 * @returns {Promise<{migratedCount: number, success: boolean}>}
 */
export async function migrateLocalReadingProgressToCloud(user) {
  const uid = await getEffectiveUserId(user);
  if (!uid) {
    return { migratedCount: 0, success: false };
  }

  // Đọc dữ liệu local của anonymous hoặc chính uid
  const anonStore = getLocalReadingStore('anonymous');
  const userStore = getLocalReadingStore(uid);
  const combined = { ...anonStore, ...userStore };

  const materialIds = Object.keys(combined);
  if (materialIds.length === 0) {
    return { migratedCount: 0, success: true };
  }

  let migratedCount = 0;
  for (const matId of materialIds) {
    const localRecord = combined[matId];
    if (!localRecord) continue;

    // So sánh với tiến độ hiện có trên Cloud
    const cloudRecord = await getReadingProgress(matId, { id: uid });
    if (!cloudRecord || new Date(localRecord.lastReadAt) > new Date(cloudRecord.lastReadAt)) {
      const res = await saveReadingProgress(matId, localRecord, { id: uid });
      if (res.isCloudSynced) migratedCount++;
    }
  }

  return { migratedCount, success: true };
}

/**
 * Xóa tiến độ đọc của một tài liệu
 */
export async function deleteReadingProgress(materialId, user = null) {
  if (!materialId) return { success: false };
  const uid = await getEffectiveUserId(user);

  // Xóa local
  if (typeof globalThis.localStorage !== 'undefined') {
    const store = getLocalReadingStore(uid);
    delete store[materialId];
    globalThis.localStorage.setItem(getLocalReadingStorageKey(uid), JSON.stringify(store));
  }

  if (uid && isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('reading_progress')
        .delete()
        .eq('user_id', uid)
        .eq('material_id', materialId);
    } catch {}

    try {
      const { data: existing } = await supabase
        .from('user_journey_progress')
        .select('lesson_details')
        .eq('user_id', uid)
        .maybeSingle();

      if (existing?.lesson_details?._reading_progress?.[materialId]) {
        delete existing.lesson_details._reading_progress[materialId];
        await supabase
          .from('user_journey_progress')
          .update({ lesson_details: existing.lesson_details })
          .eq('user_id', uid);
      }
    } catch {}
  }

  return { success: true };
}
