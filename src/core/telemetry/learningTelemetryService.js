import { supabase, isSupabaseConfigured } from '../../supabase/config.js';
import { getStoragePreferences } from '../sync/OfflineSyncManager.js';
import { getUserStorageKey, getLocalDateString } from '../../utils/gamification.js';

export const TELEMETRY_BUFFER_KEY = 'hanzigo_telemetry_buffer_v1';
export const TELEMETRY_HISTORY_KEY = 'hanzigo_telemetry_history_v1';
export const ROADMAP_PROGRESS_STORAGE_KEY = 'hanzigo_roadmap_120_progress_v1';
export const VOCAB_ITEMS_STORAGE_KEY = 'hanzigo_vocab_workspace_items_v1';

export const BATCH_FLUSH_SIZE = 10;
export const BATCH_FLUSH_INTERVAL_MS = 15000;
const MAX_LOCAL_HISTORY_EVENTS = 500;

export const ALLOWED_TELEMETRY_EVENT_TYPES = [
  'vocab_review',
  'hanzi_stroke_quiz',
  'grammar_drill',
  'listening_ab_loop',
  'reading_lookup',
  'cbt_question_answer',
  'ai_roleplay_turn',
  'translation_3tier',
];

let memoryBuffer = [];
let memoryHistory = [];
let loadedStorageScope = null;
let flushTimerId = null;
let isFlushing = false;

function getScopedTelemetryKeys(user = null) {
  return {
    bufferKey: getUserStorageKey(TELEMETRY_BUFFER_KEY, user),
    historyKey: getUserStorageKey(TELEMETRY_HISTORY_KEY, user),
    roadmapKey: getUserStorageKey(ROADMAP_PROGRESS_STORAGE_KEY, user),
    vocabKey: getUserStorageKey(VOCAB_ITEMS_STORAGE_KEY, user),
  };
}

function getSafeLocalStorage() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Ignore storage access errors in restricted environments
  }
  return null;
}

function readJsonStorage(key, fallback) {
  const storage = getSafeLocalStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  const storage = getSafeLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function canPersistTelemetryLocally() {
  try {
    const prefs = getStoragePreferences();
    return Boolean(prefs.local_learning || prefs.analytics);
  } catch {
    return true;
  }
}

function canSyncTelemetryRemotely() {
  try {
    const prefs = getStoragePreferences();
    return Boolean(prefs.local_learning || prefs.analytics);
  } catch {
    return false;
  }
}

function normalizeEventType(rawType) {
  const type = String(rawType || '').trim();
  if (ALLOWED_TELEMETRY_EVENT_TYPES.includes(type)) return type;
  return 'vocab_review';
}

function normalizeTelemetryEvent(payload = {}) {
  const hskRaw = Number(payload.hsk_level ?? payload.hskLevel ?? 1);
  const hsk_level = Number.isFinite(hskRaw) ? Math.min(9, Math.max(1, Math.round(hskRaw))) : 1;

  const lessonRaw = payload.lesson_id ?? payload.lessonId ?? null;
  const parsedLesson = lessonRaw === null || lessonRaw === undefined ? null : Number(lessonRaw);
  const lesson_id =
    parsedLesson !== null && Number.isFinite(parsedLesson) && parsedLesson >= 1 && parsedLesson <= 180
      ? Math.round(parsedLesson)
      : null;

  const latencyRaw = payload.latency_ms ?? payload.latencyMs ?? null;
  const parsedLatency = latencyRaw === null || latencyRaw === undefined ? null : Number(latencyRaw);
  const latency_ms =
    parsedLatency !== null && Number.isFinite(parsedLatency) && parsedLatency >= 0
      ? Math.round(parsedLatency)
      : null;

  const scoreRaw = payload.score_pct ?? payload.scorePct ?? null;
  const parsedScore = scoreRaw === null || scoreRaw === undefined ? null : Number(scoreRaw);
  const score_pct =
    parsedScore !== null && Number.isFinite(parsedScore)
      ? Math.min(100, Math.max(0, Math.round(parsedScore * 100) / 100))
      : null;

  const target_key = String(payload.target_key ?? payload.targetKey ?? 'unknown').trim().slice(0, 200) || 'unknown';

  return {
    event_type: normalizeEventType(payload.event_type ?? payload.eventType),
    hsk_level,
    lesson_id,
    target_key,
    is_correct: payload.is_correct !== undefined ? Boolean(payload.is_correct) : payload.isCorrect !== undefined ? Boolean(payload.isCorrect) : true,
    score_pct,
    latency_ms,
    metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
    created_at: payload.created_at || new Date().toISOString(),
  };
}

function ensureBufferLoaded(user = null) {
  const { bufferKey, historyKey } = getScopedTelemetryKeys(user);
  if (loadedStorageScope !== bufferKey) {
    memoryBuffer = [];
    memoryHistory = [];
    loadedStorageScope = bufferKey;
  }
  if (memoryBuffer.length === 0 && canPersistTelemetryLocally()) {
    const stored = readJsonStorage(bufferKey, []);
    if (Array.isArray(stored) && stored.length > 0) {
      memoryBuffer = stored;
    }
  }
  if (memoryHistory.length === 0 && canPersistTelemetryLocally()) {
    const storedHist = readJsonStorage(historyKey, []);
    if (Array.isArray(storedHist) && storedHist.length > 0) {
      memoryHistory = storedHist;
    }
  }
}

function scheduleBatchFlush(user = null) {
  if (flushTimerId !== null) return;
  flushTimerId = setTimeout(() => {
    flushTimerId = null;
    void flushTelemetryBuffer(user);
  }, BATCH_FLUSH_INTERVAL_MS);

  if (typeof flushTimerId === 'object' && typeof flushTimerId.unref === 'function') {
    flushTimerId.unref();
  }
}

export function getTelemetryBuffer(user = null) {
  ensureBufferLoaded(user);
  return [...memoryBuffer];
}

export function getTelemetryLocalHistory(user = null) {
  ensureBufferLoaded(user);
  return [...memoryHistory];
}

export function clearTelemetryLocalState(user = null) {
  memoryBuffer = [];
  memoryHistory = [];
  loadedStorageScope = null;
  if (flushTimerId !== null) {
    clearTimeout(flushTimerId);
    flushTimerId = null;
  }
  const storage = getSafeLocalStorage();
  if (storage) {
    try {
      const { bufferKey, historyKey } = getScopedTelemetryKeys(user);
      storage.removeItem(bufferKey);
      storage.removeItem(historyKey);
      storage.removeItem(TELEMETRY_BUFFER_KEY);
      storage.removeItem(TELEMETRY_HISTORY_KEY);
    } catch {
      // ignore
    }
  }
}

export async function flushTelemetryBuffer(user = null) {
  ensureBufferLoaded(user);
  if (isFlushing || memoryBuffer.length === 0) {
    return { flushed: 0, remaining: memoryBuffer.length };
  }

  const userId = user?.id || null;
  if (!isSupabaseConfigured || !supabase || !userId || !canSyncTelemetryRemotely()) {
    return { flushed: 0, remaining: memoryBuffer.length, offline: true };
  }

  isFlushing = true;
  const batch = memoryBuffer.slice(0, 50);
  try {
    const rows = batch.map((ev) => ({
      user_id: userId,
      event_type: ev.event_type,
      hsk_level: ev.hsk_level,
      lesson_id: ev.lesson_id,
      target_key: ev.target_key,
      is_correct: ev.is_correct,
      score_pct: ev.score_pct,
      latency_ms: ev.latency_ms,
      metadata: ev.metadata || {},
      created_at: ev.created_at,
    }));

    const { error } = await supabase
      .from('user_learning_telemetry_events')
      .insert(rows);

    if (error) {
      return { flushed: 0, remaining: memoryBuffer.length, error: error.message };
    }

    memoryBuffer = memoryBuffer.slice(batch.length);
    if (canPersistTelemetryLocally()) {
      const { bufferKey } = getScopedTelemetryKeys(user);
      writeJsonStorage(bufferKey, memoryBuffer);
    }
    return { flushed: batch.length, remaining: memoryBuffer.length };
  } catch (err) {
    return { flushed: 0, remaining: memoryBuffer.length, error: err?.message || 'flush_failed' };
  } finally {
    isFlushing = false;
  }
}

/**
 * Non-blocking batch telemetry tracker.
 * Queues events in memory + localStorage (respecting OfflineSyncManager flags),
 * flushes automatically every 10 events, every 15s, or when flushNow is true.
 */
export function trackLearningEvent(eventPayload = {}, options = {}) {
  const user = options.user || eventPayload.user || null;
  ensureBufferLoaded(user);
  const normalized = normalizeTelemetryEvent(eventPayload);

  memoryBuffer.push(normalized);
  memoryHistory.push(normalized);
  if (memoryHistory.length > MAX_LOCAL_HISTORY_EVENTS) {
    memoryHistory = memoryHistory.slice(memoryHistory.length - MAX_LOCAL_HISTORY_EVENTS);
  }

  if (canPersistTelemetryLocally()) {
    const { bufferKey, historyKey } = getScopedTelemetryKeys(user);
    writeJsonStorage(bufferKey, memoryBuffer);
    writeJsonStorage(historyKey, memoryHistory);
  }

  if (eventPayload.flushNow === true || memoryBuffer.length >= BATCH_FLUSH_SIZE) {
    void flushTelemetryBuffer(user);
  } else {
    scheduleBatchFlush(user);
  }

  return normalized;
}

function classifySkillFromEventType(eventType) {
  switch (eventType) {
    case 'listening_ab_loop':
    case 'ai_roleplay_turn':
      return 'listening';
    case 'reading_lookup':
    case 'cbt_question_answer':
      return 'reading';
    case 'grammar_drill':
      return 'grammar';
    case 'hanzi_stroke_quiz':
    case 'translation_3tier':
      return 'writing';
    default:
      return null;
  }
}

function averageOrZero(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round(sum / values.length);
}

function formatIsoDate(date) {
  return getLocalDateString(date);
}

function getVietnamCalendarKey(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return getLocalDateString(new Date());
  try {
    const formatted = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) return formatted;
  } catch {}
  const shifted = new Date(d.getTime() + 7 * 3600 * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shiftCalendarKey(dateKey, deltaDays) {
  const [y, m, day] = String(dateKey).split('-').map(Number);
  return getLocalDateString(new Date(y, (m || 1) - 1, (day || 1) + deltaDays));
}

function buildSrsForecast7Days(vocabItems = [], now = new Date()) {
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const counts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate() + i);
    const iso = formatIsoDate(d);
    return {
      day_offset: i,
      forecast_date: iso,
      label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : `${iso.slice(8, 10)}/${iso.slice(5, 7)}`,
      due_count: 0,
    };
  });

  for (const item of vocabItems) {
    if (!item?.next_review_at) continue;
    const dueDate = new Date(item.next_review_at);
    if (Number.isNaN(dueDate.getTime())) continue;
    const dueLocal = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const diffDays = Math.round((dueLocal.getTime() - todayLocal.getTime()) / 86400000);
    if (diffDays <= 0) {
      counts[0].due_count += 1;
    } else if (diffDays < 7) {
      counts[diffDays].due_count += 1;
    }
  }

  return counts;
}

function buildTriDimensionalMastery(vocabItems = []) {
  if (!Array.isArray(vocabItems) || vocabItems.length === 0) {
    return {
      meaningPct: 0,
      writingPct: 0,
      pronunciationPct: 0,
      weakestDimension: 'writing',
      imbalanceNote: 'Chưa có dữ liệu sổ từ — hãy lưu hoặc ôn từ vựng đầu tiên để kích hoạt phân tích 3 chiều.',
    };
  }

  let meaningSum = 0;
  let writingSum = 0;
  let pronunciationSum = 0;

  for (const item of vocabItems) {
    const fallbackMastery = Math.min(100, Math.max(20, Number(item.mastery_level || 1) * 20));
    meaningSum += Number.isFinite(Number(item.meaning_mastery)) ? Number(item.meaning_mastery) : fallbackMastery;
    writingSum += Number.isFinite(Number(item.writing_mastery)) ? Number(item.writing_mastery) : Math.max(15, fallbackMastery - 15);
    pronunciationSum += Number.isFinite(Number(item.pronunciation_mastery)) ? Number(item.pronunciation_mastery) : Math.max(20, fallbackMastery - 10);
  }

  const n = vocabItems.length;
  const meaningPct = Math.round(meaningSum / n);
  const writingPct = Math.round(writingSum / n);
  const pronunciationPct = Math.round(pronunciationSum / n);

  const dims = [
    { key: 'meaning', label: 'Nhận diện Nghĩa', pct: meaningPct },
    { key: 'writing', label: 'Bút thuận Chữ Hán', pct: writingPct },
    { key: 'pronunciation', label: 'Chuẩn Thanh điệu', pct: pronunciationPct },
  ].sort((a, b) => a.pct - b.pct);

  const weakest = dims[0];
  const strongest = dims[dims.length - 1];
  const gap = strongest.pct - weakest.pct;

  const imbalanceNote =
    gap >= 15
      ? `Bạn ${strongest.label.toLowerCase()} tốt (${strongest.pct}%) nhưng ${weakest.label.toLowerCase()} đang chậm hơn (${weakest.pct}%).`
      : `Cân bằng 3 chiều khá đồng đều (Chênh lệch ${gap}%). Tiếp tục củng cố ${weakest.label.toLowerCase()}.`;

  return {
    meaningPct,
    writingPct,
    pronunciationPct,
    weakestDimension: weakest.key,
    imbalanceNote,
  };
}

function buildHsk9Heatmap(roadmapProgress = {}) {
  const completedSet = new Set();
  const rawCompleted = roadmapProgress?.completedLessons || roadmapProgress?.completed || [];
  if (Array.isArray(rawCompleted)) {
    for (const id of rawCompleted) {
      const n = Number(id);
      if (Number.isFinite(n) && n >= 1 && n <= 180) {
        completedSet.add(Math.round(n));
      }
    }
  }

  return Array.from({ length: 9 }, (_, idx) => {
    const level = idx + 1;
    const startLesson = idx * 20 + 1;
    const endLesson = level * 20;
    let completedCount = 0;
    for (let id = startLesson; id <= endLesson; id += 1) {
      if (completedSet.has(id)) completedCount += 1;
    }
    const pct = Math.round((completedCount / 20) * 100);
    return {
      level,
      label: `HSK ${level}`,
      startLesson,
      endLesson,
      completedCount,
      totalLessons: 20,
      pct,
    };
  });
}

export function filterRealUserVocabItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    const id = String(item?.id || '');
    return id !== '' && !/^vitem-\d+$/i.test(id) && !/^starter-\d+$/i.test(id);
  });
}

/**
 * Computes full local telemetry snapshot for Guest Mode, Offline Mode, or Instant UI hydration.
 * Safe when localStorage is empty or unavailable.
 */
export function computeLocalTelemetrySnapshot({
  events = null,
  vocabItems = null,
  roadmapProgress = null,
  days = 14,
  user = null,
} = {}) {
  ensureBufferLoaded(user);

  const { vocabKey, roadmapKey } = getScopedTelemetryKeys(user);
  const sourceEvents = Array.isArray(events) ? events : memoryHistory;
  const rawVocab = Array.isArray(vocabItems)
    ? vocabItems
    : readJsonStorage(vocabKey, []);
  const resolvedVocab = filterRealUserVocabItems(rawVocab);
  const resolvedRoadmap = roadmapProgress && typeof roadmapProgress === 'object'
    ? roadmapProgress
    : readJsonStorage(roadmapKey, {});

  const now = new Date();
  const windowCutoff = now.getTime() - days * 86400000;
  const sevenDayCutoff = now.getTime() - 7 * 86400000;

  const recentEvents = sourceEvents.filter((ev) => {
    const ts = new Date(ev?.created_at || 0).getTime();
    return Number.isFinite(ts) && ts >= windowCutoff;
  });

  const events7d = recentEvents.filter((ev) => new Date(ev.created_at).getTime() >= sevenDayCutoff);

  // Streak days (normalized to Asia/Ho_Chi_Minh)
  const activeDaySet = new Set(
    recentEvents.map((ev) => (ev?.created_at ? getVietnamCalendarKey(ev.created_at) : '')).filter(Boolean)
  );
  let streakDays = 0;
  const todayVnKey = getVietnamCalendarKey(now);
  for (let offset = 0; offset < days; offset += 1) {
    const checkIso = shiftCalendarKey(todayVnKey, -offset);
    if (activeDaySet.has(checkIso)) {
      streakDays += 1;
    } else if (offset > 0) {
      break;
    }
  }

  // Total active minutes 7d
  const totalMs7d = events7d.reduce((acc, ev) => {
    const lat = Number(ev.latency_ms);
    return acc + (Number.isFinite(lat) && lat > 0 ? Math.min(lat, 120000) : 8000);
  }, 0);
  const total_active_minutes_7d = Math.round((totalMs7d / 60000) * 10) / 10;

  // Retention rate (%)
  const vocabReviewEvents = recentEvents.filter((ev) => ev.event_type === 'vocab_review');
  let retention_rate_pct = 0;
  if (vocabReviewEvents.length > 0) {
    const correctCount = vocabReviewEvents.filter((ev) => ev.is_correct !== false).length;
    retention_rate_pct = Math.round((correctCount / vocabReviewEvents.length) * 1000) / 10;
  } else if (resolvedVocab.length > 0) {
    const reviewed = resolvedVocab.filter((v) => Number(v.repetitions || 0) > 0);
    if (reviewed.length > 0) {
      const retained = reviewed.filter((v) => Number(v.lapses || 0) === 0);
      retention_rate_pct = Math.round((retained.length / reviewed.length) * 1000) / 10;
    }
  }

  // Avg response latency by skill
  const buckets = { listening: [], reading: [], grammar: [], writing: [], overall: [] };
  for (const ev of recentEvents) {
    const lat = Number(ev.latency_ms);
    if (!Number.isFinite(lat) || lat <= 0) continue;
    buckets.overall.push(lat);
    const skill = classifySkillFromEventType(ev.event_type);
    if (skill && buckets[skill]) {
      buckets[skill].push(lat);
    }
  }
  const avg_response_latency_ms = {
    listening: averageOrZero(buckets.listening),
    reading: averageOrZero(buckets.reading),
    grammar: averageOrZero(buckets.grammar),
    writing: averageOrZero(buckets.writing),
    overall: averageOrZero(buckets.overall),
  };

  // Top 5 cognitive bottlenecks
  const byTarget = new Map();
  for (const ev of recentEvents) {
    const key = String(ev.target_key || '').trim();
    if (!key) continue;
    const entry = byTarget.get(key) || {
      target_key: key,
      event_type: ev.event_type,
      hsk_level: ev.hsk_level || 1,
      attempts: 0,
      mistakes: 0,
      latencies: [],
    };
    entry.attempts += 1;
    if (ev.is_correct === false) entry.mistakes += 1;
    if (Number.isFinite(Number(ev.latency_ms)) && Number(ev.latency_ms) > 0) {
      entry.latencies.push(Number(ev.latency_ms));
    }
    byTarget.set(key, entry);
  }

  const top_cognitive_bottlenecks = Array.from(byTarget.values())
    .map((entry) => {
      const errorRate = entry.attempts > 0 ? Math.round((entry.mistakes / entry.attempts) * 1000) / 10 : 0;
      const avgLat = averageOrZero(entry.latencies);
      return {
        target_key: entry.target_key,
        event_type: entry.event_type,
        hsk_level: entry.hsk_level,
        attempts: entry.attempts,
        mistakes: entry.mistakes,
        error_rate_pct: errorRate,
        avg_latency_ms: avgLat,
      };
    })
    .filter((item) => item.mistakes > 0 || item.avg_latency_ms > 15000)
    .sort((a, b) => b.error_rate_pct - a.error_rate_pct || b.avg_latency_ms - a.avg_latency_ms)
    .slice(0, 5);

  return {
    source: 'local_snapshot',
    window_days: days,
    study_streak_days: streakDays,
    total_active_minutes_7d,
    events_count_7d: events7d.length,
    retention_rate_pct,
    avg_response_latency_ms,
    top_cognitive_bottlenecks,
    srs_forecast_7d: buildSrsForecast7Days(resolvedVocab, now),
    triDimensionalMastery: buildTriDimensionalMastery(resolvedVocab),
    hskHeatmap: buildHsk9Heatmap(resolvedRoadmap),
  };
}

export async function fetchTelemetryDashboardSummary(user = null, days = 14) {
  const localSnapshot = computeLocalTelemetrySnapshot({ days, user });

  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return localSnapshot;
  }

  try {
    const { data, error } = await supabase.rpc('get_user_telemetry_dashboard_summary', {
      p_user_id: user.id,
      p_days: days,
    });

    if (error || !data || typeof data !== 'object') {
      return localSnapshot;
    }

    return {
      ...localSnapshot,
      source: 'supabase_rpc',
      study_streak_days: Math.max(localSnapshot.study_streak_days, Number(data.study_streak_days || 0)),
      total_active_minutes_7d: Math.max(localSnapshot.total_active_minutes_7d, Number(data.total_active_minutes_7d || 0)),
      events_count_7d: Math.max(localSnapshot.events_count_7d, Number(data.events_count_7d || 0)),
      retention_rate_pct: Number(data.retention_rate_pct || localSnapshot.retention_rate_pct || 0),
      avg_response_latency_ms: {
        listening: Number(data.avg_response_latency_ms?.listening || localSnapshot.avg_response_latency_ms.listening || 0),
        reading: Number(data.avg_response_latency_ms?.reading || localSnapshot.avg_response_latency_ms.reading || 0),
        grammar: Number(data.avg_response_latency_ms?.grammar || localSnapshot.avg_response_latency_ms.grammar || 0),
        writing: Number(data.avg_response_latency_ms?.writing || localSnapshot.avg_response_latency_ms.writing || 0),
        overall: Number(data.avg_response_latency_ms?.overall || localSnapshot.avg_response_latency_ms.overall || 0),
      },
      top_cognitive_bottlenecks:
        Array.isArray(data.top_cognitive_bottlenecks) && data.top_cognitive_bottlenecks.length > 0
          ? data.top_cognitive_bottlenecks
          : localSnapshot.top_cognitive_bottlenecks,
      srs_forecast_7d:
        Array.isArray(data.srs_forecast_7d) && data.srs_forecast_7d.length === 7
          ? data.srs_forecast_7d.map((row, idx) => ({
            ...row,
            label: localSnapshot.srs_forecast_7d[idx]?.label || row.forecast_date,
          }))
          : localSnapshot.srs_forecast_7d,
    };
  } catch {
    return localSnapshot;
  }
}
