import { supabase, isSupabaseConfigured } from '../../supabase/config.js';
import { getUserStorageKey } from '../../utils/gamification.js';

export const STORAGE_PREFS_KEY = 'hanzigo_storage_preferences_v1';
export const SYNC_QUEUE_KEY = 'hanzigo_sync_queue_v1';
export const FAILED_SYNC_QUEUE_KEY = 'hanzigo_sync_failed_v1';
export const LAST_SYNC_KEY = 'hanzigo_last_sync_at_v1';
export const MAX_SYNC_RETRIES = 5;

export function getScopedSyncQueueKey(user = null) {
  return getUserStorageKey(SYNC_QUEUE_KEY, user);
}

export function getScopedFailedSyncKey(user = null) {
  return getUserStorageKey(FAILED_SYNC_QUEUE_KEY, user);
}

export function getScopedLastSyncKey(user = null) {
  return getUserStorageKey(LAST_SYNC_KEY, user);
}

export function getFailedSyncItems(user = null) {
  const storage = getSafeStorage('localStorage');
  if (!storage) return [];
  try {
    const raw = storage.getItem(getScopedFailedSyncKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const DEFAULT_STORAGE_PREFERENCES = {
  essential: true,
  functional: true,
  local_learning: true,
  analytics: false,
  consent_given_at: null,
};

function hasWindow() {
  return typeof window !== 'undefined';
}

function getSafeStorage(kind = 'localStorage') {
  if (!hasWindow()) return null;
  try {
    return window[kind] || null;
  } catch {
    return null;
  }
}

function dispatchSyncEvent(name, detail = {}) {
  if (!hasWindow() || typeof window.dispatchEvent !== 'function') return;
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {
    // Ignore CustomEvent failures in restricted runtimes
  }
}

export function getStoragePreferences() {
  const storage = getSafeStorage('localStorage');
  if (!storage) return { ...DEFAULT_STORAGE_PREFERENCES };

  try {
    const raw = storage.getItem(STORAGE_PREFS_KEY);
    if (!raw) return { ...DEFAULT_STORAGE_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      functional: typeof parsed.functional === 'boolean' ? parsed.functional : true,
      local_learning:
        typeof parsed.local_learning === 'boolean' ? parsed.local_learning : true,
      analytics: typeof parsed.analytics === 'boolean' ? parsed.analytics : false,
      consent_given_at: parsed.consent_given_at || null,
    };
  } catch {
    return { ...DEFAULT_STORAGE_PREFERENCES };
  }
}

export function saveStoragePreferences(partialPrefs = {}) {
  const current = getStoragePreferences();
  const next = {
    essential: true,
    functional:
      typeof partialPrefs.functional === 'boolean'
        ? partialPrefs.functional
        : current.functional,
    local_learning:
      typeof partialPrefs.local_learning === 'boolean'
        ? partialPrefs.local_learning
        : current.local_learning,
    analytics:
      typeof partialPrefs.analytics === 'boolean'
        ? partialPrefs.analytics
        : current.analytics,
    consent_given_at:
      partialPrefs.consent_given_at !== undefined
        ? partialPrefs.consent_given_at
        : current.consent_given_at || new Date().toISOString(),
  };

  const storage = getSafeStorage('localStorage');
  if (storage) {
    try {
      storage.setItem(STORAGE_PREFS_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }

  dispatchSyncEvent('hanzigo:storage-prefs-updated', next);
  return next;
}

export function acceptEssentialOnlyPreferences() {
  return saveStoragePreferences({
    essential: true,
    functional: false,
    local_learning: true,
    analytics: false,
    consent_given_at: new Date().toISOString(),
  });
}

export function acceptAllStoragePreferences() {
  return saveStoragePreferences({
    essential: true,
    functional: true,
    local_learning: true,
    analytics: true,
    consent_given_at: new Date().toISOString(),
  });
}

export function classifyStorageKey(key) {
  const lower = String(key || '').toLowerCase();

  if (
    lower.includes('sb-') ||
    lower.includes('auth') ||
    lower.includes('rbac') ||
    lower === STORAGE_PREFS_KEY
  ) {
    return 'essential';
  }

  if (
    lower.includes('theme') ||
    lower.includes('ui_') ||
    lower.includes('reader_settings') ||
    lower.includes('audio_speed') ||
    lower.includes('font_size') ||
    lower.includes('pinyin_mode') ||
    lower.includes('sidebar_collapsed') ||
    lower.includes('active_tab')
  ) {
    return 'functional';
  }

  if (lower.includes('analytics') || lower.includes('telemetry') || lower.includes('metrics')) {
    return 'analytics';
  }

  if (
    lower.includes(SYNC_QUEUE_KEY) ||
    lower.includes('hsk_exam_draft_') ||
    lower.includes('srs_offline_') ||
    lower.includes('vocab_draft_') ||
    lower.includes('writing_history_')
  ) {
    return 'local_learning';
  }

  return 'local_learning';
}

function measureStorageGroup(storage) {
  if (!storage) {
    return {
      totalBytes: 0,
      entries: [],
    };
  }

  const entries = [];
  let totalBytes = 0;

  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key) continue;
    const val = storage.getItem(key) || '';
    const bytes = (key.length + val.length) * 2;
    totalBytes += bytes;
    entries.push({ key, bytes, category: classifyStorageKey(key) });
  }

  return { totalBytes, entries };
}

export async function inspectBrowserStorage() {
  const localStats = measureStorageGroup(getSafeStorage('localStorage'));
  const sessionStats = measureStorageGroup(getSafeStorage('sessionStorage'));

  const categories = {
    essential: { keyCount: 0, bytes: 0, keys: [] },
    functional: { keyCount: 0, bytes: 0, keys: [] },
    local_learning: { keyCount: 0, bytes: 0, keys: [] },
    analytics: { keyCount: 0, bytes: 0, keys: [] },
  };

  for (const entry of localStats.entries) {
    const bucket = categories[entry.category] || categories.local_learning;
    bucket.keyCount += 1;
    bucket.bytes += entry.bytes;
    bucket.keys.push(entry.key);
  }

  let quotaBytes = 0;
  let usageBytes = localStats.totalBytes + sessionStats.totalBytes;

  if (hasWindow() && navigator.storage && typeof navigator.storage.estimate === 'function') {
    try {
      const estimate = await navigator.storage.estimate();
      quotaBytes = Number(estimate.quota || 0);
      usageBytes = Math.max(usageBytes, Number(estimate.usage || 0));
    } catch {
      // Fallback to calculated localStorage + sessionStorage bytes
    }
  }

  const indexedDbEstimatedBytes = Math.max(
    0,
    usageBytes - localStats.totalBytes - sessionStats.totalBytes
  );

  return {
    quotaBytes,
    usageBytes,
    indexedDbEstimatedBytes,
    localStorageBytes: localStats.totalBytes,
    sessionStorageBytes: sessionStats.totalBytes,
    totalKeys: localStats.entries.length,
    categories,
  };
}

export function getPendingSyncItems(user = null) {
  const storage = getSafeStorage('localStorage');
  if (!storage) return [];

  try {
    const raw = storage.getItem(getScopedSyncQueueKey(user));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLastSyncAt(user = null) {
  const storage = getSafeStorage('localStorage');
  if (!storage) return null;
  return storage.getItem(getScopedLastSyncKey(user)) || null;
}

export function enqueueOfflineMutation(
  { type, table, action = 'upsert', payload, onConflict = null, idempotencyKey = null },
  user = null
) {
  const prefs = getStoragePreferences();
  if (!prefs.local_learning) {
    return { queued: false, reason: 'local_learning_disabled' };
  }

  const targetUser = user || (payload?.user_id ? { id: payload.user_id } : null);
  const queueKey = getScopedSyncQueueKey(targetUser);
  const queue = getPendingSyncItems(targetUser);
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const entry = {
    id,
    type: type || 'mutation',
    table,
    action,
    payload,
    ...(onConflict ? { onConflict } : {}),
    ...(idempotencyKey ? { idempotencyKey } : {}),
    createdAt: new Date().toISOString(),
  };

  let nextQueue;
  if (idempotencyKey) {
    const existingIdx = queue.findIndex((item) => item?.idempotencyKey === idempotencyKey);
    if (existingIdx >= 0) {
      nextQueue = [...queue];
      nextQueue[existingIdx] = { ...queue[existingIdx], ...entry, id: queue[existingIdx].id };
    } else {
      nextQueue = [...queue, entry];
    }
  } else {
    nextQueue = [...queue, entry];
  }

  const storage = getSafeStorage('localStorage');
  if (storage) {
    try {
      storage.setItem(queueKey, JSON.stringify(nextQueue));
    } catch {
      return { queued: false, reason: 'storage_quota_exceeded' };
    }
  }

  dispatchSyncEvent('hanzigo:sync-updated', { pendingCount: nextQueue.length });
  return { queued: true, item: entry, pendingCount: nextQueue.length };
}

export async function flushOfflineQueueToSupabase(supabaseClient = supabase, user = null, options = {}) {
  const { maxRetries = MAX_SYNC_RETRIES, ignoreBackoff = false, nowMs = Date.now() } = options;
  const queueKey = getScopedSyncQueueKey(user);
  const failedKey = getScopedFailedSyncKey(user);
  const lastSyncKey = getScopedLastSyncKey(user);
  const queue = getPendingSyncItems(user);
  if (queue.length === 0) {
    return { syncedCount: 0, failedCount: 0, quarantinedCount: 0, remainingCount: 0, errors: [] };
  }

  if (hasWindow() && navigator.onLine === false) {
    return {
      syncedCount: 0,
      failedCount: queue.length,
      quarantinedCount: 0,
      remainingCount: queue.length,
      errors: ['Thiết bị đang ngoại tuyến (Offline).'],
    };
  }

  const client = supabaseClient;
  if (!client || (client === supabase && !isSupabaseConfigured())) {
    return {
      syncedCount: 0,
      failedCount: queue.length,
      quarantinedCount: 0,
      remainingCount: queue.length,
      errors: ['Supabase chưa được cấu hình.'],
    };
  }

  const remaining = [];
  const quarantined = [];
  const errors = [];
  let syncedCount = 0;

  for (const item of queue) {
    if (!ignoreBackoff && typeof item.nextRetryAt === 'number' && nowMs < item.nextRetryAt) {
      remaining.push(item);
      continue;
    }

    const currentRetries = Number(item.retryCount || 0);
    if (currentRetries >= maxRetries) {
      quarantined.push({
        ...item,
        status: 'failed_max_retries',
        failedAt: new Date(nowMs).toISOString(),
      });
      continue;
    }

    let failureMsg = null;
    try {
      const tableRef = client.from(item.table);
      let result;
      if (item.action === 'insert') {
        result = await tableRef.insert(item.payload);
      } else if (item.onConflict) {
        result = await tableRef.upsert(item.payload, { onConflict: item.onConflict });
      } else {
        result = await tableRef.upsert(item.payload);
      }

      if (result?.error) {
        failureMsg = `${item.table}: ${result.error.message}`;
      } else {
        syncedCount += 1;
      }
    } catch (err) {
      failureMsg = `${item.table}: ${err?.message || 'Unknown sync error'}`;
    }

    if (failureMsg) {
      errors.push(failureMsg);
      const nextRetryCount = currentRetries + 1;
      if (nextRetryCount >= maxRetries) {
        quarantined.push({
          ...item,
          retryCount: nextRetryCount,
          status: 'failed_max_retries',
          lastError: failureMsg,
          failedAt: new Date(nowMs).toISOString(),
        });
      } else {
        const backoffMs = Math.min(60000, 1000 * 2 ** (nextRetryCount - 1));
        remaining.push({
          ...item,
          retryCount: nextRetryCount,
          lastError: failureMsg,
          nextRetryAt: nowMs + backoffMs,
        });
      }
    }
  }

  const storage = getSafeStorage('localStorage');
  if (storage) {
    try {
      storage.setItem(queueKey, JSON.stringify(remaining));
      if (quarantined.length > 0) {
        const existingFailed = getFailedSyncItems(user);
        const mergedFailed = [...quarantined, ...existingFailed].slice(0, 50);
        storage.setItem(failedKey, JSON.stringify(mergedFailed));
      }
      if (syncedCount > 0) {
        storage.setItem(lastSyncKey, new Date(nowMs).toISOString());
      }
    } catch {
      // Ignore storage write failure
    }
  }

  dispatchSyncEvent('hanzigo:sync-updated', {
    syncedCount,
    remainingCount: remaining.length,
    quarantinedCount: quarantined.length,
  });

  return {
    syncedCount,
    failedCount: remaining.length + quarantined.length,
    quarantinedCount: quarantined.length,
    remainingCount: remaining.length,
    errors,
  };
}

export function clearStorageByCategory(category, { force = false } = {}) {
  if (category === 'essential') {
    return {
      cleared: false,
      blocked: true,
      reason: 'essential_protected',
      removedCount: 0,
      removedBytes: 0,
    };
  }

  const storage = getSafeStorage('localStorage');
  if (!storage) {
    return { cleared: true, removedCount: 0, removedBytes: 0 };
  }

  const { entries } = measureStorageGroup(storage);
  const targets = entries.filter((entry) => entry.category === category);

  if (category === 'local_learning' && !force) {
    const pendingItems = getPendingSyncItems();
    const hasExamDrafts = targets.some((entry) =>
      entry.key.toLowerCase().includes('hsk_exam_draft_')
    );
    if (pendingItems.length > 0 || hasExamDrafts) {
      return {
        cleared: false,
        requiresConfirmation: true,
        pendingCount: pendingItems.length,
        hasExamDrafts,
        reason: 'unsynced_learning_data',
        removedCount: 0,
        removedBytes: 0,
      };
    }
  }

  let removedBytes = 0;
  for (const item of targets) {
    storage.removeItem(item.key);
    removedBytes += item.bytes;
  }

  if (category === 'local_learning') {
    storage.removeItem(LAST_SYNC_KEY);
    dispatchSyncEvent('hanzigo:sync-updated', { pendingCount: 0 });
  }

  return {
    cleared: true,
    removedCount: targets.length,
    removedBytes,
  };
}

export async function exportUserLearningSnapshot(supabaseClient = supabase, activeUser = null) {
  const prefs = getStoragePreferences();
  const storageSummary = await inspectBrowserStorage();
  const pendingSync = getPendingSyncItems(activeUser);
  const storage = getSafeStorage('localStorage');

  let userInfo = activeUser?.id ? { id: activeUser.id, email: activeUser.email || null } : null;
  const cloudData = {
    user_vocab_items: [],
    hsk_attempts: [],
  };

  if (supabaseClient && (supabaseClient !== supabase || isSupabaseConfigured())) {
    try {
      const authRes = await supabaseClient.auth.getUser();
      const user = authRes?.data?.user || null;
      if (user) {
        userInfo = { id: user.id, email: user.email || null };
        const [vocabRes, attemptsRes] = await Promise.all([
          supabaseClient.from('user_vocab_items').select('*').eq('user_id', user.id),
          supabaseClient.from('hsk_attempts').select('*').eq('user_id', user.id),
        ]);
        if (Array.isArray(vocabRes?.data)) cloudData.user_vocab_items = vocabRes.data;
        if (Array.isArray(attemptsRes?.data)) cloudData.hsk_attempts = attemptsRes.data;
      }
    } catch {
      // Export local snapshot gracefully even if cloud fetch fails
    }
  }

  const scopedSuffix = userInfo?.id ? `_${userInfo.id}` : '_guest';
  const localLearningData = {};
  if (storage) {
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (!key) continue;
      if (classifyStorageKey(key) === 'essential' && key !== STORAGE_PREFS_KEY) {
        continue;
      }
      if (key !== STORAGE_PREFS_KEY && !key.endsWith(scopedSuffix)) {
        continue;
      }
      const rawVal = storage.getItem(key);
      try {
        localLearningData[key] = rawVal ? JSON.parse(rawVal) : rawVal;
      } catch {
        localLearningData[key] = rawVal;
      }
    }
  }

  return {
    exported_at: new Date().toISOString(),
    app: 'HanziGo',
    version: '1.0',
    user: userInfo,
    preferences: prefs,
    pending_sync_items: pendingSync,
    storage_summary: storageSummary,
    local_storage: localLearningData,
    cloud_data: cloudData,
  };
}

