/**
 * =========================================================================
 * HANZIGO — UNIFIED SMART LEARNING TELEMETRY & ADAPTIVE ENGINE
 * =========================================================================
 * Tổng hợp 4 nguồn tín hiệu học tập thật (Zero Mock Data):
 *   1. Tiến độ lộ trình 180 bài & SRS (dueToday, lapse_count >= 2, retention)
 *   2. Năng lực 5 kỹ năng từ answerSnapshots (HSK 2.0 & HSK 3.0, Exam vs Learning)
 *   3. Sổ lỗi sai (listening_dialogue, reading_cloze, reorder, pinyin_tone, writing_rubric)
 *   4. Nhịp độ học 7 ngày & Streak chuẩn múi giờ Asia/Ho_Chi_Minh
 *
 * Tính HSK Readiness minh bạch, cung cấp Rule-Based Fallback 100% offline/401/503,
 * lọc PII + giới hạn kích thước payload AI, cache theo progress-hash, và bảo vệ HITL.
 * =========================================================================
 */

import {
  STORAGE_SRS_STATE,
  STORAGE_REVIEW,
  calculateNextSrsReview,
  isCardDueForReview,
} from '../utils/srsEngine.js';
import {
  getTelemetryLocalHistory,
  filterRealUserVocabItems,
  clearTelemetryLocalState,
  TELEMETRY_BUFFER_KEY,
  TELEMETRY_HISTORY_KEY,
  ROADMAP_PROGRESS_STORAGE_KEY,
  VOCAB_ITEMS_STORAGE_KEY,
} from '../core/telemetry/learningTelemetryService.js';
import { getClientAuthHeaders, supabase, isSupabaseConfigured } from '../supabase/config.js';

export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const TOTAL_ROADMAP_LESSONS = 180;
export const SMART_COACH_CACHE_PREFIX = 'hanzigo_smart_coach_cache_v1_';
export const SMART_COACH_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 giờ
export const MAX_AI_TELEMETRY_PAYLOAD_CHARS = 2800;

export const FIVE_SKILL_META = Object.freeze([
  { key: 'listening', labelVi: 'Nghe hiểu', targetRoute: 'hsk' },
  { key: 'speaking', labelVi: 'Khẩu ngữ (Nói)', targetRoute: 'pronunciation' },
  { key: 'reading', labelVi: 'Đọc hiểu', targetRoute: 'reader' },
  { key: 'writing', labelVi: 'Viết chữ Hán', targetRoute: 'writing' },
  { key: 'translation', labelVi: 'Dịch thuật', targetRoute: 'hsk' },
]);

export const MISTAKE_CLUSTER_META = Object.freeze({
  listening_dialogue: {
    key: 'listening_dialogue',
    labelVi: 'Nghe hội thoại & bẫy ngữ cảnh',
    targetRoute: 'hsk',
    targetHash: '#hsk/mistakes',
  },
  reading_cloze: {
    key: 'reading_cloze',
    labelVi: 'Đọc hiểu & điền khuyết từ vựng',
    targetRoute: 'hsk',
    targetHash: '#hsk/mistakes',
  },
  reorder: {
    key: 'reorder',
    labelVi: 'Sắp xếp trật tự câu / đoạn',
    targetRoute: 'hsk',
    targetHash: '#hsk/mistakes',
  },
  pinyin_tone: {
    key: 'pinyin_tone',
    labelVi: 'Thanh điệu & phát âm Pinyin',
    targetRoute: 'pronunciation',
    targetHash: '#pronunciation',
  },
  writing_rubric: {
    key: 'writing_rubric',
    labelVi: 'Viết tự luận & dịch thuật',
    targetRoute: 'writing',
    targetHash: '#writing',
  },
});

const HSK_VOCAB_QUOTAS = Object.freeze({
  1: 150,
  2: 300,
  3: 600,
  4: 1200,
  5: 2500,
  6: 5000,
  7: 6000,
  8: 6000,
  9: 6000,
});

function getSafeStorage() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {}
  return null;
}

function safeReadJson(key, fallback) {
  const storage = getSafeStorage();
  if (!storage || !key) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  const storage = getSafeStorage();
  if (!storage || !key) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // QuotaExceededError fail-open
    return false;
  }
}

export function resolveTelemetryUserId(user = null) {
  if (!user) return 'guest';
  if (typeof user === 'string') return user.trim() || 'guest';
  return String(user.id || user.uid || 'guest').trim() || 'guest';
}

function scopedKey(baseKey, user = null) {
  return `${baseKey}_${resolveTelemetryUserId(user)}`;
}

export function parseTargetHskNumber(levelInput = 'HSK 1') {
  const clean = String(levelInput || 'HSK 1').replace(/–/g, '-');
  if (clean.includes('7-9') || clean.includes('7–9')) return 7;
  const m = clean.match(/(\d+)/);
  const num = m ? Number(m[1]) : 1;
  return Number.isFinite(num) ? Math.min(9, Math.max(1, Math.round(num))) : 1;
}

/**
 * Chuẩn hóa mọi thời điểm sang ngày lịch YYYY-MM-DD tại múi giờ Asia/Ho_Chi_Minh (UTC+7).
 */
export function getVietnamDateKey(dateInput = new Date()) {
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    return dateInput.trim();
  }
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) {
    return getVietnamDateKey(new Date());
  }
  try {
    const formatted = new Intl.DateTimeFormat('en-CA', {
      timeZone: VIETNAM_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      return formatted;
    }
  } catch {}
  return new Date(d.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function shiftDateKey(dateKey, deltaDays) {
  const [y, m, d] = String(dateKey).split('-').map(Number);
  const utc = Date.UTC(y, (m || 1) - 1, (d || 1) + deltaDays);
  return new Date(utc).toISOString().slice(0, 10);
}

function diffDateKeys(olderKey, newerKey) {
  const [y1, m1, d1] = String(olderKey).split('-').map(Number);
  const [y2, m2, d2] = String(newerKey).split('-').map(Number);
  const t1 = Date.UTC(y1, (m1 || 1) - 1, d1 || 1);
  const t2 = Date.UTC(y2, (m2 || 1) - 1, d2 || 1);
  return Math.round((t2 - t1) / 86400000);
}

/**
 * Tính chuỗi ngày học (streak) và nhịp độ 7 ngày gần nhất theo múi giờ Asia/Ho_Chi_Minh.
 */
export function computeVietnamStudyCadence({
  studyMinutesMap = {},
  events = [],
  attempts = [],
  activityDates = [],
  now = new Date(),
} = {}) {
  const todayVn = getVietnamDateKey(now);
  const minutesByDate = {};
  const eventsByDate = {};
  const activeDates = new Set();

  if (studyMinutesMap && typeof studyMinutesMap === 'object') {
    for (const [rawKey, rawMins] of Object.entries(studyMinutesMap)) {
      const mins = Number(rawMins) || 0;
      if (mins <= 0) continue;
      const vnKey = getVietnamDateKey(rawKey);
      minutesByDate[vnKey] = Math.round(((minutesByDate[vnKey] || 0) + mins) * 10) / 10;
      activeDates.add(vnKey);
    }
  }

  for (const ev of Array.isArray(events) ? events : []) {
    if (!ev?.created_at) continue;
    const vnKey = getVietnamDateKey(ev.created_at);
    eventsByDate[vnKey] = (eventsByDate[vnKey] || 0) + 1;
    activeDates.add(vnKey);
    const latMs = Number(ev.latency_ms);
    const estMins = Number.isFinite(latMs) && latMs > 0 ? Math.min(latMs, 120000) / 60000 : 0.25;
    if (!studyMinutesMap[vnKey]) {
      minutesByDate[vnKey] = Math.round(((minutesByDate[vnKey] || 0) + estMins) * 10) / 10;
    }
  }

  for (const att of Array.isArray(attempts) ? attempts : []) {
    const ts = att?.createdAt || att?.submittedAt || att?.created_at;
    if (!ts) continue;
    const vnKey = getVietnamDateKey(ts);
    activeDates.add(vnKey);
    const spentMins = Number(att?.timeSpentSeconds || 0) > 0 ? Number(att.timeSpentSeconds) / 60 : 5;
    if (!studyMinutesMap[vnKey]) {
      minutesByDate[vnKey] = Math.round(((minutesByDate[vnKey] || 0) + spentMins) * 10) / 10;
    }
  }

  for (const dt of Array.isArray(activityDates) ? activityDates : []) {
    if (!dt) continue;
    activeDates.add(getVietnamDateKey(dt));
  }

  // Rolling 7-day cadence ending today (VN time)
  const last7Days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const dateKey = shiftDateKey(todayVn, -offset);
    const mins = Math.round((Number(minutesByDate[dateKey]) || 0) * 10) / 10;
    const evCount = eventsByDate[dateKey] || 0;
    last7Days.push({
      dateKey,
      label: offset === 0 ? 'Nay' : `${dateKey.slice(8, 10)}/${dateKey.slice(5, 7)}`,
      minutes: mins,
      eventsCount: evCount,
      isActive: activeDates.has(dateKey),
      isToday: offset === 0,
    });
  }

  // Streak calculation anchored on VN calendar days (allows today to be pending if yesterday was active)
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const checkKey = shiftDateKey(todayVn, -offset);
    if (activeDates.has(checkKey)) {
      streak += 1;
    } else if (offset > 0) {
      break;
    }
  }

  const totalMinutes7d = Math.round(last7Days.reduce((s, d) => s + d.minutes, 0) * 10) / 10;
  const activeDays7d = last7Days.filter((d) => d.isActive).length;

  let daysInactive = 0;
  if (activeDates.size > 0) {
    const latestActive = Array.from(activeDates).sort().pop();
    daysInactive = Math.max(0, diffDateKeys(latestActive, todayVn));
  }

  return {
    timezone: VIETNAM_TIMEZONE,
    todayDateKey: todayVn,
    streak,
    totalMinutes7d,
    activeDays7d,
    daysInactive,
    last7Days,
  };
}

function normalizeSkillBucket(rawSkill = '') {
  const s = String(rawSkill || '').toLowerCase().trim();
  if (s.includes('listen')) return 'listening';
  if (s.includes('speak') || s.includes('hskk') || s.includes('pronun')) return 'speaking';
  if (s.includes('translat')) return 'translation';
  if (s.includes('writ') || s.includes('essay')) return 'writing';
  return 'reading';
}

function resolveSnapshotScorePct(snap = {}) {
  const qType = String(snap.questionType || snap.question_type || '').toLowerCase();
  const isSubj =
    qType === 'essay' ||
    qType === 'translation' ||
    qType === 'speaking' ||
    qType === 'free_writing' ||
    qType === 'essay_summary';

  if (isSubj || typeof snap.scoreAwarded === 'number') {
    if (snap.gradingSource === 'skipped') return null;
    const maxScore = Number(snap.maxScore || 10);
    const awarded = Number(snap.scoreAwarded ?? 0);
    if (maxScore <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((awarded / maxScore) * 100)));
  }

  return snap.isCorrect ? 100 : 0;
}

function normalizeExamSystem(rawSystem = '', examLevel = '') {
  const s = String(rawSystem || '').toLowerCase();
  if (s.includes('3_0') || s.includes('3.0')) return 'hsk_3_0';
  if (s.includes('2_0') || s.includes('2.0')) return 'hsk_2_0';
  if (String(examLevel || '').includes('7-9') || String(examLevel || '').includes('7–9')) {
    return 'hsk_3_0';
  }
  return 'hsk_2_0';
}

function normalizePracticeMode(attempt = {}) {
  const raw = String(attempt.practiceMode || attempt.examMode || '').toLowerCase();
  if (raw === 'learning' || raw === 'learning_mode' || raw === 'practice') return 'learning';
  return 'exam';
}

function loadCombinedUserAttempts(user = null) {
  const rawHskAttempts = safeReadJson(scopedKey('hanzigo_hsk_attempts', user), []);
  const dualAttempts = safeReadJson(scopedKey('hanzigo_dual_exam_history', user), []);
  const merged = [];
  const seen = new Set();

  for (const att of [...(Array.isArray(dualAttempts) ? dualAttempts : []), ...(Array.isArray(rawHskAttempts) ? rawHskAttempts : [])]) {
    if (!att || typeof att !== 'object') continue;
    const dedupeKey = String(att.id || `${att.examId || ''}_${att.createdAt || ''}`);
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    merged.push(att);
  }

  merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return merged;
}

function buildFiveSkillMetrics({ attempts = [], pronounceHistory = [], examSystem = 'all' }) {
  const filteredAttempts =
    examSystem === 'all'
      ? attempts
      : attempts.filter((a) => normalizeExamSystem(a.examSystem, a.examLevel || a.level) === examSystem);

  const buckets = {};
  for (const meta of FIVE_SKILL_META) {
    buckets[meta.key] = {
      overallSum: 0,
      overallCount: 0,
      examSum: 0,
      examCount: 0,
      learningSum: 0,
      learningCount: 0,
      hsk20Count: 0,
      hsk30Count: 0,
    };
  }

  for (const att of filteredAttempts) {
    const sys = normalizeExamSystem(att.examSystem, att.examLevel || att.level);
    const mode = normalizePracticeMode(att);
    const snapshots =
      Array.isArray(att.answerSnapshots) && att.answerSnapshots.length > 0
        ? att.answerSnapshots
        : Array.isArray(att.detailedResults)
          ? att.detailedResults
          : [];

    if (snapshots.length > 0) {
      for (const item of snapshots) {
        const sk = normalizeSkillBucket(item.skill || item.partType || item.part_type);
        const pct = resolveSnapshotScorePct(item);
        if (pct === null) continue;
        const b = buckets[sk];
        b.overallSum += pct;
        b.overallCount += 1;
        if (mode === 'learning') {
          b.learningSum += pct;
          b.learningCount += 1;
        } else {
          b.examSum += pct;
          b.examCount += 1;
        }
        if (sys === 'hsk_3_0') b.hsk30Count += 1;
        else b.hsk20Count += 1;
      }
    } else if (att.skillBreakdown && typeof att.skillBreakdown === 'object') {
      for (const [rawSk, info] of Object.entries(att.skillBreakdown)) {
        const sk = normalizeSkillBucket(rawSk);
        const pct = Number(info?.accuracyPct ?? info?.percentage ?? 0);
        const count = Number(info?.totalQuestions ?? info?.total ?? 0);
        if (count <= 0) continue;
        const b = buckets[sk];
        b.overallSum += pct;
        b.overallCount += 1;
        if (mode === 'learning') {
          b.learningSum += pct;
          b.learningCount += 1;
        } else {
          b.examSum += pct;
          b.examCount += 1;
        }
      }
    }
  }

  // Real microphone pronunciation sessions also feed Speaking when present
  const micList = Array.isArray(pronounceHistory) ? pronounceHistory : [];
  let micSessionsCount = 0;
  for (const p of micList) {
    const score = Number(p?.overall ?? p?.score ?? p?.fluencyScore);
    if (!Number.isFinite(score) || score < 0) continue;
    const clamped = Math.min(100, Math.max(0, Math.round(score)));
    const b = buckets.speaking;
    b.overallSum += clamped;
    b.overallCount += 1;
    b.learningSum += clamped;
    b.learningCount += 1;
    micSessionsCount += 1;
  }

  const skillsMap = {};
  const list = FIVE_SKILL_META.map((meta) => {
    const b = buckets[meta.key];
    const hasData = b.overallCount > 0;
    const overallPct = hasData ? Math.round(b.overallSum / b.overallCount) : 0;
    const examPct = b.examCount > 0 ? Math.round(b.examSum / b.examCount) : null;
    const learningPct = b.learningCount > 0 ? Math.round(b.learningSum / b.learningCount) : null;

    const item = {
      skill: meta.key,
      labelVi: meta.labelVi,
      targetRoute: meta.targetRoute,
      hasData,
      overallPct,
      examPct,
      learningPct,
      totalItems: b.overallCount,
      examItems: b.examCount,
      learningItems: b.learningCount,
      ...(meta.key === 'speaking' ? { micSessionsCount } : {}),
    };
    skillsMap[meta.key] = item;
    return item;
  });

  const activeSkills = list.filter((s) => s.hasData);
  const sortedAsc = [...activeSkills].sort((a, b) => a.overallPct - b.overallPct);

  return {
    examSystemFilter: examSystem,
    skills: skillsMap,
    list,
    hasAnySkillData: activeSkills.length > 0,
    weakestSkill: sortedAsc[0] || null,
    strongestSkill: sortedAsc.length > 0 ? sortedAsc[sortedAsc.length - 1] : null,
  };
}

function classifyMistakeBucket(entry = {}) {
  const source = String(entry.source || entry.sourceMode || '').toLowerCase();
  const qType = String(entry.questionType || entry.question_type || '').toLowerCase();
  const skill = normalizeSkillBucket(entry.skill || entry.partType || entry.part_type);

  if (source === 'pronunciation' || qType === 'pinyin_tone' || qType === 'tone') {
    return 'pinyin_tone';
  }
  if (qType.includes('reorder') || qType.includes('sentence_order')) {
    return 'reorder';
  }
  if (skill === 'listening') {
    return 'listening_dialogue';
  }
  if (
    skill === 'writing' ||
    skill === 'translation' ||
    qType === 'essay' ||
    qType === 'free_writing' ||
    qType === 'essay_summary' ||
    qType === 'translation'
  ) {
    return 'writing_rubric';
  }
  return 'reading_cloze';
}

function buildMistakeClusterSummary(user = null, pronounceHistory = [], examSystem = 'all') {
  const rawNotebook = safeReadJson(scopedKey('hanzigo_mistake_notebook_v1', user), []);
  const notebookEntries = (Array.isArray(rawNotebook) ? rawNotebook : []).filter(
    (item) => item && item.questionId && (examSystem === 'all' || !item.examSystem || item.examSystem === examSystem)
  );
  const legacyHskMistakes = safeReadJson(scopedKey('hanzigo_hsk_mistakes', user), []);

  const activeItems = [];
  const seenIds = new Set();
  let resolvedMistakesCount = 0;

  for (const item of Array.isArray(notebookEntries) ? notebookEntries : []) {
    if (!item?.questionId) continue;
    seenIds.add(item.questionId);
    activeItems.push(item);
  }

  for (const item of Array.isArray(legacyHskMistakes) ? legacyHskMistakes : []) {
    if (!item) continue;
    if (item.status === 'mastered' || item.resolved === true) {
      resolvedMistakesCount += 1;
      continue;
    }
    const qid = item.questionId || item.id;
    if (!qid || seenIds.has(qid)) continue;
    seenIds.add(qid);
    activeItems.push(item);
  }

  for (const p of Array.isArray(pronounceHistory) ? pronounceHistory : []) {
    const score = Number(p?.overall ?? p?.score ?? 100);
    if (Number.isFinite(score) && score < 70) {
      activeItems.push({
        questionId: `pron-${p.targetHanzi || p.createdAt || activeItems.length}`,
        source: 'pronunciation',
        questionType: 'pinyin_tone',
        skill: 'speaking',
        prompt: p.targetHanzi || 'Thanh điệu',
        wrongCount: 1,
      });
    }
  }

  const clusterCounts = {};
  for (const key of Object.keys(MISTAKE_CLUSTER_META)) {
    clusterCounts[key] = {
      ...MISTAKE_CLUSTER_META[key],
      count: 0,
      totalWrongCount: 0,
      samplePrompts: [],
    };
  }

  for (const item of activeItems) {
    const bucketKey = classifyMistakeBucket(item);
    const bucket = clusterCounts[bucketKey];
    bucket.count += 1;
    bucket.totalWrongCount += Math.max(1, Number(item.wrongCount || item.mistakeCount || 1));
    if (item.prompt && bucket.samplePrompts.length < 3) {
      bucket.samplePrompts.push(String(item.prompt).slice(0, 80));
    }
  }

  const clusters = Object.values(clusterCounts)
    .filter((c) => c.count > 0)
    .sort((a, b) => b.totalWrongCount - a.totalWrongCount || b.count - a.count);

  return {
    activeMistakesCount: activeItems.length,
    resolvedMistakesCount,
    clusters,
    topCluster: clusters[0] || null,
  };
}

function buildRoadmapAndSrsSummary(user = null, targetHskNum = 1) {
  const legacyCompleted = safeReadJson(scopedKey('hanzigo_completed_lessons', user), []);
  const roadmapState = safeReadJson(scopedKey(ROADMAP_PROGRESS_STORAGE_KEY, user), {});
  const completedSet = new Set();

  for (const id of Array.isArray(legacyCompleted) ? legacyCompleted : []) {
    if (id !== null && id !== undefined && String(id).trim() !== '') {
      completedSet.add(String(id).trim());
    }
  }
  for (const id of Array.isArray(roadmapState?.completedLessons) ? roadmapState.completedLessons : []) {
    if (id !== null && id !== undefined && String(id).trim() !== '') {
      completedSet.add(String(id).trim());
    }
  }

  const completedCount = Math.min(TOTAL_ROADMAP_LESSONS, completedSet.size);
  const completionPct = Math.min(100, Math.round((completedCount / TOTAL_ROADMAP_LESSONS) * 100));

  const srsMap = safeReadJson(scopedKey(STORAGE_SRS_STATE, user), {});
  const reviewIds = safeReadJson(scopedKey('hanzigo_vocab_review', user), []);
  const rememberedIds = safeReadJson(scopedKey('hanzigo_vocab_remembered', user), []);
  const workspaceItems = filterRealUserVocabItems(
    safeReadJson(scopedKey(VOCAB_ITEMS_STORAGE_KEY, user), [])
  );

  const cardByKey = new Map();
  if (srsMap && typeof srsMap === 'object') {
    for (const [key, rawCard] of Object.entries(srsMap)) {
      if (!rawCard || typeof rawCard !== 'object') continue;
      cardByKey.set(String(key), {
        id: String(rawCard.id || key),
        hanzi: rawCard.hanzi || rawCard.simplified || String(key),
        pinyin: rawCard.pinyin || '',
        meaning: rawCard.meaning || rawCard.meaning_vi || '',
        hskLevel: rawCard.hskLevel || `HSK ${targetHskNum}`,
        repetitions: Number(rawCard.repetitions ?? rawCard.repetition ?? 0),
        lapseCount: Number(rawCard.lapse_count ?? rawCard.lapseCount ?? rawCard.lapses ?? 0),
        easeFactor: Number(rawCard.easeFactor ?? rawCard.ease_factor ?? 2.5),
        intervalDays: Number(rawCard.intervalDays ?? rawCard.interval_days ?? 0),
        nextReviewAt: rawCard.nextReviewAt || rawCard.next_review_at || null,
      });
    }
  }

  for (const w of workspaceItems) {
    const key = String(w.id || w.simplified || '');
    if (!key || cardByKey.has(key)) continue;
    cardByKey.set(key, {
      id: key,
      hanzi: w.simplified || w.hanzi || key,
      pinyin: w.pinyin || '',
      meaning: w.meaning_vi || w.meaning || '',
      hskLevel: w.hskLevel || `HSK ${targetHskNum}`,
      repetitions: Number(w.repetitions || 0),
      lapseCount: Number(w.lapses ?? w.lapse_count ?? 0),
      easeFactor: Number(w.ease_factor ?? 2.5),
      intervalDays: Number(w.interval_days ?? 0),
      nextReviewAt: w.next_review_at || null,
    });
  }

  for (const id of Array.isArray(reviewIds) ? reviewIds : []) {
    const key = String(id);
    if (!key || cardByKey.has(key)) continue;
    cardByKey.set(key, {
      id: key,
      hanzi: key,
      pinyin: '',
      meaning: 'Từ cần ôn tập',
      hskLevel: `HSK ${targetHskNum}`,
      repetitions: 1,
      lapseCount: 0,
      easeFactor: 2.0,
      intervalDays: 1,
      nextReviewAt: new Date(0).toISOString(),
    });
  }

  const cards = Array.from(cardByKey.values());
  const dueCards = cards.filter((c) => isCardDueForReview(c));
  const dueToday = dueCards.length;
  const masteredCount = cards.filter((c) => c.repetitions >= 4 && c.intervalDays >= 15).length;

  const learnedIdSet = new Set([
    ...(Array.isArray(rememberedIds) ? rememberedIds.map(String) : []),
    ...cards.filter((c) => c.repetitions > 0).map((c) => c.id),
  ]);
  const learnedCount = learnedIdSet.size;

  const leechWords = cards
    .filter((c) => c.lapseCount >= 2 || (c.repetitions > 0 && c.easeFactor <= 1.5))
    .sort((a, b) => b.lapseCount - a.lapseCount || a.easeFactor - b.easeFactor)
    .slice(0, 10);

  const reviewedCards = cards.filter((c) => c.repetitions > 0 || c.lapseCount > 0);
  const retentionPct =
    reviewedCards.length > 0
      ? Math.round(
          (reviewedCards.filter((c) => c.lapseCount === 0).length / reviewedCards.length) * 100
        )
      : learnedCount > 0
        ? 100
        : 0;

  return {
    completedCount,
    totalLessons: TOTAL_ROADMAP_LESSONS,
    completionPct,
    dueToday,
    masteredCount,
    learnedCount,
    retentionPct,
    leechCount: leechWords.length,
    leechWords,
  };
}

/**
 * Công thức HSK Readiness minh bạch, hoàn toàn xác định (0–100%).
 */
export function computeHskReadiness({
  targetHskLevel = 1,
  examSystem = 'all',
  roadmapAndSrs,
  fiveSkills,
  examAttempts = [],
  mistakeClusters,
  cadence,
}) {
  const hasAnyRealData =
    roadmapAndSrs.completedCount > 0 ||
    roadmapAndSrs.learnedCount > 0 ||
    roadmapAndSrs.dueToday > 0 ||
    examAttempts.length > 0 ||
    mistakeClusters.activeMistakesCount > 0 ||
    cadence.totalMinutes7d > 0 ||
    fiveSkills.hasAnySkillData;

  if (!hasAnyRealData) {
    return {
      score: 0,
      hasData: false,
      isColdStart: true,
      targetHskLevel,
      factors: {
        vocabCoveragePct: 0,
        recentExamAvgPct: 0,
        mistakeResolutionPct: 0,
      },
      pullDownFactors: [
        {
          key: 'cold_start',
          labelVi: 'Chưa có dữ liệu thực hành',
          valuePct: 0,
          reasonVi: 'Tài khoản chưa có bài học, thẻ SRS hay bài thi thử nào.',
          actionLabel: 'Làm bài kiểm tra xếp lớp / Ôn 5 từ đầu tiên',
          targetRoute: 'roadmap',
        },
      ],
    };
  }

  const vocabQuota = HSK_VOCAB_QUOTAS[targetHskLevel] || 150;
  const vocabQuotaPct = Math.min(100, Math.round((roadmapAndSrs.learnedCount / vocabQuota) * 100));
  const bandLessonsPct = Math.min(100, Math.round((roadmapAndSrs.completedCount / 20) * 100));
  const vocabCoveragePct = Math.min(100, Math.round(vocabQuotaPct * 0.6 + bandLessonsPct * 0.4));

  const systemFiltered =
    examSystem === 'all'
      ? examAttempts
      : examAttempts.filter((a) => normalizeExamSystem(a.examSystem, a.examLevel || a.level) === examSystem);
  const examModeOnly = systemFiltered.filter((a) => normalizePracticeMode(a) === 'exam');
  const recentThree = (examModeOnly.length > 0 ? examModeOnly : systemFiltered).slice(0, 3);

  const recentExamAvgPct =
    recentThree.length > 0
      ? Math.round(
          recentThree.reduce((sum, a) => {
            const maxS = Number(a.maxScore || 0);
            const rawS = Number(a.totalScore ?? a.score ?? 0);
            const pct =
              maxS > 0
                ? Math.min(100, Math.max(0, (rawS / maxS) * 100))
                : Number(a.accuracyPct ?? a.accuracyPercentage ?? 0);
            return sum + pct;
          }, 0) / recentThree.length
        )
      : 0;

  const totalMistakes = mistakeClusters.activeMistakesCount + mistakeClusters.resolvedMistakesCount;
  const mistakeClearPct =
    totalMistakes > 0
      ? Math.round((mistakeClusters.resolvedMistakesCount / totalMistakes) * 100)
      : 100;
  const srsHealthPct = roadmapAndSrs.learnedCount > 0 ? roadmapAndSrs.retentionPct : mistakeClearPct;
  const mistakeResolutionPct =
    totalMistakes > 0
      ? Math.round(mistakeClearPct * 0.65 + srsHealthPct * 0.35)
      : Math.round(srsHealthPct);

  // Trọng số minh bạch: 35% Từ vựng & Lộ trình + 45% 3 bài thi gần nhất + 20% Khắc phục lỗi & SRS
  const score = Math.min(
    100,
    Math.max(
      0,
      Math.round(vocabCoveragePct * 0.35 + recentExamAvgPct * 0.45 + mistakeResolutionPct * 0.2)
    )
  );

  const pullDownFactors = [];
  if (recentThree.length === 0) {
    pullDownFactors.push({
      key: 'no_recent_exam',
      labelVi: 'Điểm thi thử CBT (45% trọng số)',
      valuePct: 0,
      reasonVi: 'Chưa có bài thi thử CBT nào để đo sức bền phòng thi.',
      actionLabel: `Thi thử HSK ${targetHskLevel}`,
      targetRoute: 'hsk',
    });
  } else if (recentExamAvgPct < 70) {
    pullDownFactors.push({
      key: 'low_recent_exam',
      labelVi: 'Trung bình 3 đề gần nhất (45%)',
      valuePct: recentExamAvgPct,
      reasonVi: `Trung bình ${recentThree.length} bài thi gần nhất đạt ${recentExamAvgPct}% (cần >= 70%).`,
      actionLabel: 'Luyện lại đề thi thử',
      targetRoute: 'hsk',
    });
  }

  if (vocabCoveragePct < 70) {
    pullDownFactors.push({
      key: 'vocab_coverage',
      labelVi: 'Độ phủ từ vựng & lộ trình (35%)',
      valuePct: vocabCoveragePct,
      reasonVi: `Mới phủ ${roadmapAndSrs.learnedCount}/${vocabQuota} từ & ${roadmapAndSrs.completedCount}/180 bài.`,
      actionLabel: 'Học bài tiếp theo',
      targetRoute: 'roadmap',
    });
  }

  if (mistakeResolutionPct < 70) {
    pullDownFactors.push({
      key: 'mistake_resolution',
      labelVi: 'Khắc phục lỗi sai & trí nhớ SRS (20%)',
      valuePct: mistakeResolutionPct,
      reasonVi: `Còn ${mistakeClusters.activeMistakesCount} câu sai chưa ôn lại và ${roadmapAndSrs.leechCount} từ hay quên.`,
      actionLabel: 'Sửa câu sai ngay',
      targetRoute: 'hsk',
    });
  }

  if (fiveSkills.weakestSkill && fiveSkills.weakestSkill.overallPct < 65) {
    pullDownFactors.push({
      key: `weak_${fiveSkills.weakestSkill.skill}`,
      labelVi: `Kỹ năng yếu: ${fiveSkills.weakestSkill.labelVi}`,
      valuePct: fiveSkills.weakestSkill.overallPct,
      reasonVi: `Kỹ năng ${fiveSkills.weakestSkill.labelVi} mới đạt ${fiveSkills.weakestSkill.overallPct}%.`,
      actionLabel: `Luyện ${fiveSkills.weakestSkill.labelVi}`,
      targetRoute: fiveSkills.weakestSkill.targetRoute,
    });
  }

  pullDownFactors.sort((a, b) => a.valuePct - b.valuePct);

  return {
    score,
    hasData: true,
    isColdStart: false,
    targetHskLevel,
    recentExamCount: recentThree.length,
    factors: {
      vocabCoveragePct,
      recentExamAvgPct,
      mistakeResolutionPct,
    },
    pullDownFactors,
  };
}

/**
 * Tổng hợp đầy đủ Telemetry cá nhân hóa cho 1 người học (cô lập theo userId).
 */
export function buildSmartLearningSnapshot(
  user = null,
  { examSystem = 'all', targetHskLevel = null, now = new Date() } = {}
) {
  const userId = resolveTelemetryUserId(user);
  const isGuest = userId === 'guest';
  const prefs = safeReadJson(scopedKey('hanzigo_learner_preferences', user), {});
  const resolvedTargetHsk = targetHskLevel
    ? parseTargetHskNumber(targetHskLevel)
    : parseTargetHskNumber(prefs?.targetHskLevel || user?.hskLevel || user?.level || 'HSK 1');

  const pronounceHistory = safeReadJson(scopedKey('hanzigo_pronounce_history', user), []);
  const studyMinutesMap = safeReadJson(scopedKey('hanzigo_daily_study_minutes', user), {});
  const telemetryEvents = getTelemetryLocalHistory(user);
  const attempts = loadCombinedUserAttempts(user);

  const roadmapAndSrs = buildRoadmapAndSrsSummary(user, resolvedTargetHsk);
  const fiveSkills = buildFiveSkillMetrics({
    attempts,
    pronounceHistory,
    examSystem,
  });
  const mistakeClusters = buildMistakeClusterSummary(user, pronounceHistory, examSystem);
  const cadence = computeVietnamStudyCadence({
    studyMinutesMap,
    events: telemetryEvents,
    attempts,
    now,
  });

  const readiness = computeHskReadiness({
    targetHskLevel: resolvedTargetHsk,
    examSystem,
    roadmapAndSrs,
    fiveSkills,
    examAttempts: attempts,
    mistakeClusters,
    cadence,
  });

  return {
    userId,
    isGuest,
    examSystem,
    targetHskLevel: resolvedTargetHsk,
    roadmapAndSrs,
    fiveSkills,
    mistakeClusters,
    cadence,
    readiness,
    examAttemptsCount: attempts.length,
    generatedAt: new Date(now).toISOString(),
  };
}

/**
 * Lọc bỏ hoàn toàn PII (email, SĐT, họ tên, token, API key) phía client trước khi gửi AI.
 */
export function redactClientPii(value) {
  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
      .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[REDACTED_JWT]')
      .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[REDACTED_API_KEY]')
      .replace(/\bsk-[0-9A-Za-z_-]{16,}\b/g, '[REDACTED_API_KEY]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]')
      .replace(/(?:\+84|0)(?:[\s.-]?\d){8,10}\b/g, '[REDACTED_PHONE]');
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactClientPii(item));
  }

  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (/^(email|phone|phone_?number|full_?name|name|user_?name|password|token|access_token|refresh_token|api_?key|secret)$/i.test(k)) {
        continue;
      }
      out[k] = redactClientPii(v);
    }
    return out;
  }

  return value;
}

/**
 * Nén Telemetry thành bản tóm tắt cấu trúc gọn + bọc redactClientPii + ép trần ký tự.
 */
export function buildCompactAiTelemetryPayload(
  snapshot,
  { maxChars = MAX_AI_TELEMETRY_PAYLOAD_CHARS } = {}
) {
  const safeSnap = snapshot || {};
  const payload = redactClientPii({
    targetHskLevel: `HSK ${safeSnap.targetHskLevel || 1}`,
    examSystem: safeSnap.examSystem || 'all',
    readinessScore: Number(safeSnap.readiness?.score || 0),
    isColdStart: Boolean(safeSnap.readiness?.isColdStart),
    pullDownFactors: (safeSnap.readiness?.pullDownFactors || []).slice(0, 3).map((f) => ({
      key: f.key,
      labelVi: f.labelVi,
      valuePct: f.valuePct,
    })),
    roadmapCompleted: Number(safeSnap.roadmapAndSrs?.completedCount || 0),
    srsDueToday: Number(safeSnap.roadmapAndSrs?.dueToday || 0),
    srsRetentionPct: Number(safeSnap.roadmapAndSrs?.retentionPct || 0),
    topLeechWords: (safeSnap.roadmapAndSrs?.leechWords || []).slice(0, 5).map((w) => ({
      hanzi: String(w.hanzi || '').slice(0, 20),
      pinyin: String(w.pinyin || '').slice(0, 40),
      meaning: String(w.meaning || '').slice(0, 60),
      lapses: Number(w.lapseCount || 0),
    })),
    fiveSkills: (safeSnap.fiveSkills?.list || []).map((s) => ({
      skill: s.skill,
      overallPct: s.hasData ? s.overallPct : null,
      examPct: s.examPct,
      learningPct: s.learningPct,
    })),
    weakestSkill: safeSnap.fiveSkills?.weakestSkill?.skill || null,
    mistakeClusters: (safeSnap.mistakeClusters?.clusters || []).slice(0, 3).map((c) => ({
      key: c.key,
      count: c.count,
      totalWrongCount: c.totalWrongCount,
    })),
    streakVn: Number(safeSnap.cadence?.streak || 0),
    minutes7d: Number(safeSnap.cadence?.totalMinutes7d || 0),
  });

  let serialized = JSON.stringify(payload);
  if (serialized.length > maxChars && Array.isArray(payload.topLeechWords)) {
    payload.topLeechWords = payload.topLeechWords.slice(0, 2);
    serialized = JSON.stringify(payload);
  }
  if (serialized.length > maxChars && Array.isArray(payload.pullDownFactors)) {
    payload.pullDownFactors = payload.pullDownFactors.slice(0, 1);
    serialized = JSON.stringify(payload);
  }
  if (serialized.length > maxChars && Array.isArray(payload.mistakeClusters)) {
    payload.mistakeClusters = payload.mistakeClusters.slice(0, 1);
  }
  return payload;
}

/**
 * Rule-Based Adaptive Engine:
 * Luôn sinh 3–4 nhiệm vụ ưu tiên + đề xuất HITL từ dữ liệu thật khi offline / guest / 401 / 503.
 */
export function buildRuleBasedAdaptivePlan(snapshot, { user = null } = {}) {
  const s = snapshot || buildSmartLearningSnapshot(user);
  const { targetHskLevel, roadmapAndSrs, fiveSkills, mistakeClusters, cadence, readiness } = s;

  const dailyPlan = [];

  if (readiness.isColdStart) {
    dailyPlan.push(
      {
        id: 'task-placement',
        priority: 1,
        category: 'placement',
        title: `Làm bài kiểm tra xếp lớp HSK ${targetHskLevel}`,
        reason: 'Chưa có dữ liệu học tập thực tế; cần 1 phiên đo chuẩn để định vị năng lực.',
        durationMinutes: 5,
        targetRoute: 'hsk',
        targetHash: '#hsk',
        actionLabel: 'Làm bài kiểm tra',
      },
      {
        id: 'task-starter-vocab',
        priority: 2,
        category: 'srs',
        title: 'Ôn 5 thẻ từ vựng nền tảng đầu tiên',
        reason: 'Kích hoạt sổ ghi nhớ SM-2 để AI theo dõi đường cong trí nhớ của bạn.',
        durationMinutes: 4,
        targetRoute: 'vocabulary',
        targetHash: '#vocabulary',
        actionLabel: 'Ôn 5 từ đầu tiên',
      },
      {
        id: 'task-starter-lesson',
        priority: 3,
        category: 'roadmap',
        title: 'Học Bài #1 trên Lộ trình 180 bài',
        reason: 'Xây nền phát âm Pinyin, thanh điệu và từ vựng giao tiếp cốt lõi.',
        durationMinutes: 6,
        targetRoute: 'roadmap',
        targetHash: '#roadmap',
        actionLabel: 'Vào Lộ trình',
      }
    );
  } else {
    if (roadmapAndSrs.dueToday > 0 || roadmapAndSrs.leechCount > 0) {
      const countLabel = roadmapAndSrs.dueToday > 0 ? roadmapAndSrs.dueToday : roadmapAndSrs.leechCount;
      const sampleWords = roadmapAndSrs.leechWords.slice(0, 3).map((w) => w.hanzi).join(' · ');
      dailyPlan.push({
        id: 'task-srs-due',
        priority: 1,
        category: 'srs',
        title: `Ôn ${countLabel} từ SRS đến hạn${roadmapAndSrs.leechCount > 0 ? ` (${roadmapAndSrs.leechCount} từ hay quên)` : ''}`,
        reason: sampleWords
          ? `Ưu tiên cứu các từ dễ rơi trí nhớ: ${sampleWords}.`
          : 'Các thẻ SM-2 đã đến điểm rơi trí nhớ hôm nay.',
        durationMinutes: 5,
        targetRoute: 'vocabulary',
        targetHash: '#vocabulary',
        actionLabel: 'Ôn SRS ngay',
      });
    }

    if (mistakeClusters.activeMistakesCount > 0 && mistakeClusters.topCluster) {
      const top = mistakeClusters.topCluster;
      dailyPlan.push({
        id: 'task-fix-mistakes',
        priority: dailyPlan.length + 1,
        category: 'mistakes',
        title: `Sửa ${Math.min(5, top.count)} câu sai: ${top.labelVi}`,
        reason: `Nhóm lỗi này đang lặp lại ${top.totalWrongCount} lượt và kéo điểm sẵn sàng xuống.`,
        durationMinutes: 6,
        targetRoute: top.targetRoute,
        targetHash: top.targetHash,
        actionLabel: 'Sửa câu sai',
      });
    }

    if (fiveSkills.weakestSkill) {
      const w = fiveSkills.weakestSkill;
      dailyPlan.push({
        id: 'task-weak-skill',
        priority: dailyPlan.length + 1,
        category: w.skill,
        title: `Củng cố kỹ năng ${w.labelVi} (${w.overallPct}%)`,
        reason: `Đây là kỹ năng có điểm trung bình thấp nhất trong 5 kỹ năng từ bài làm gần đây.`,
        durationMinutes: 6,
        targetRoute: w.targetRoute,
        targetHash: `#${w.targetRoute}`,
        actionLabel: `Luyện ${w.labelVi}`,
      });
    }

    if (dailyPlan.length < 3) {
      dailyPlan.push({
        id: 'task-next-roadmap',
        priority: dailyPlan.length + 1,
        category: 'roadmap',
        title: `Học tiếp bài mới HSK ${targetHskLevel} (${roadmapAndSrs.completedCount}/${TOTAL_ROADMAP_LESSONS})`,
        reason: 'Duy trì tiến độ đều đặn để tăng độ phủ từ vựng và ngữ pháp.',
        durationMinutes: 8,
        targetRoute: 'roadmap',
        targetHash: '#roadmap',
        actionLabel: 'Học bài mới',
      });
    }

    if (dailyPlan.length < 4 && (readiness.recentExamCount === 0 || readiness.factors.recentExamAvgPct < 75)) {
      dailyPlan.push({
        id: 'task-cbt-drill',
        priority: dailyPlan.length + 1,
        category: 'exam',
        title: `Luyện đề theo kỹ năng HSK ${targetHskLevel}`,
        reason:
          readiness.recentExamCount === 0
            ? 'Chưa có bài thi thử CBT nào để tính điểm thực chiến.'
            : `Điểm thi thử gần nhất đạt ${readiness.factors.recentExamAvgPct}%, cần rèn thêm tốc độ.`,
        durationMinutes: 10,
        targetRoute: 'hsk',
        targetHash: '#hsk',
        actionLabel: 'Vào phòng thi',
      });
    }

    if (dailyPlan.length < 3) {
      dailyPlan.push({
        id: 'task-pronunciation-warmup',
        priority: dailyPlan.length + 1,
        category: 'speaking',
        title: `Luyện phát âm & thanh điệu HSK ${targetHskLevel}`,
        reason: 'Củng cố phản xạ nghe – nói và chuẩn hóa 4 thanh điệu hàng ngày.',
        durationMinutes: 4,
        targetRoute: 'pronunciation',
        targetHash: '#pronunciation',
        actionLabel: 'Luyện phát âm',
      });
    }

    if (dailyPlan.length < 3) {
      dailyPlan.push({
        id: 'task-writing-practice',
        priority: dailyPlan.length + 1,
        category: 'writing',
        title: `Luyện viết Hán tự & đọc hiểu HSK ${targetHskLevel}`,
        reason: 'Tăng trí nhớ mặt chữ và thứ tự nét qua luyện viết tương tác.',
        durationMinutes: 5,
        targetRoute: 'writing',
        targetHash: '#writing',
        actionLabel: 'Luyện viết chữ',
      });
    }
  }

  // HITL Proposals: NEVER mutate SRS or preferences until user confirms explicitly
  const pending_confirmations = [];
  const candidateLeech = roadmapAndSrs.leechWords[0] || null;
  if (candidateLeech && candidateLeech.hanzi) {
    pending_confirmations.push({
      id: `hitl-srs-${candidateLeech.hanzi}`,
      actionType: 'save_vocab_to_srs',
      label: `Đưa "${candidateLeech.hanzi}" (${candidateLeech.pinyin || 'ôn sâu'}) vào sổ ôn cấp bách SRS`,
      reason: `Từ này đã quên ${candidateLeech.lapseCount} lần, nên ôn tăng cường theo chu kỳ ngắn.`,
      requiresConfirmation: true,
      status: 'pending',
      payload: {
        hanzi: candidateLeech.hanzi,
        pinyin: candidateLeech.pinyin || '',
        meaning: candidateLeech.meaning || 'Từ cần củng cố',
        hskLevel: `HSK ${targetHskLevel}`,
      },
    });
  } else if (mistakeClusters.topCluster?.samplePrompts?.[0]) {
    const sampleHanziMatch = mistakeClusters.topCluster.samplePrompts[0].match(/[\u4e00-\u9fa5]{1,4}/);
    if (sampleHanziMatch) {
      pending_confirmations.push({
        id: `hitl-srs-${sampleHanziMatch[0]}`,
        actionType: 'save_vocab_to_srs',
        label: `Lưu cụm "${sampleHanziMatch[0]}" từ câu sai vào sổ SRS`,
        reason: `Xuất hiện trong nhóm lỗi "${mistakeClusters.topCluster.labelVi}".`,
        requiresConfirmation: true,
        status: 'pending',
        payload: {
          hanzi: sampleHanziMatch[0],
          pinyin: '',
          meaning: 'Cụm từ trích từ Sổ lỗi sai',
          hskLevel: `HSK ${targetHskLevel}`,
        },
      });
    }
  }

  if (readiness.score >= 85 && targetHskLevel < 9) {
    const nextLevel = targetHskLevel >= 6 ? 'HSK 7-9' : `HSK ${targetHskLevel + 1}`;
    pending_confirmations.push({
      id: `hitl-level-${nextLevel}`,
      actionType: 'update_target_hsk',
      label: `Nâng mục tiêu lên ${nextLevel}`,
      reason: `Độ sẵn sàng HSK ${targetHskLevel} đã đạt ${readiness.score}% (>= 85%).`,
      requiresConfirmation: true,
      status: 'pending',
      payload: {
        targetHskLevel: nextLevel,
      },
    });
  }

  const weakestSkillNote = fiveSkills.weakestSkill
    ? `Kỹ năng cần ưu tiên nhất: ${fiveSkills.weakestSkill.labelVi} (${fiveSkills.weakestSkill.overallPct}%).`
    : 'Chưa có bài làm chấm theo 5 kỹ năng — hãy làm 1 bài luyện tập hoặc thi thử để hệ thống đo chuẩn.';

  const coachInsight = readiness.isColdStart
    ? `Chào mừng bạn! Hệ thống đang ở trạng thái 0% dữ liệu thật. Hoàn thành bài kiểm tra xếp lớp hoặc ôn 5 từ đầu tiên để kích hoạt lộ trình cá nhân hóa.`
    : `Độ sẵn sàng HSK ${targetHskLevel} đạt ${readiness.score}% (chuỗi ${cadence.streak} ngày giờ VN, ${roadmapAndSrs.dueToday} thẻ SRS đến hạn, ${mistakeClusters.activeMistakesCount} lỗi đang mở). ${weakestSkillNote}`;

  return {
    source: 'rule_based_fallback',
    greeting: readiness.isColdStart
      ? `Khởi động lộ trình HSK ${targetHskLevel}`
      : `Cố vấn học tập thông minh · HSK ${targetHskLevel}`,
    coachInsight,
    weakestSkillNote,
    dailyPlan: dailyPlan.slice(0, 4),
    pending_confirmations,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * HITL Guard: Chỉ thực thi thay đổi SRS hoặc mục tiêu HSK khi có xác nhận tường minh (`confirmed === true`).
 */
export function applyConfirmedHitlProposal(proposal, user = null, { confirmed = false } = {}) {
  if (!confirmed || !proposal || proposal.requiresConfirmation !== true) {
    return {
      applied: false,
      reason: 'explicit_confirmation_required',
    };
  }

  const uid = resolveTelemetryUserId(user);
  const payload = proposal.payload || {};

  if (proposal.actionType === 'save_vocab_to_srs') {
    const hanzi = String(payload.hanzi || '').trim();
    if (!hanzi) {
      return { applied: false, reason: 'invalid_hanzi' };
    }

    const srsKey = `${STORAGE_SRS_STATE}_${uid}`;
    const reviewKey = `${STORAGE_REVIEW}_${uid}`;
    const currentMap = safeReadJson(srsKey, {});
    const cardId = `hitl_${hanzi}`;
    const existing = currentMap[cardId] || { id: cardId, hanzi, repetitions: 0, lapse_count: 1 };
    const updatedCard = {
      ...existing,
      ...calculateNextSrsReview(existing, 1),
      id: cardId,
      hanzi,
      pinyin: String(payload.pinyin || existing.pinyin || ''),
      meaning: String(payload.meaning || existing.meaning || 'Từ cần củng cố'),
      hskLevel: String(payload.hskLevel || 'HSK 1'),
      nextReviewAt: new Date().toISOString(),
      next_review_at: new Date().toISOString(),
      sourceContext: 'ai_coach_hitl',
    };

    const nextMap = { ...currentMap, [cardId]: updatedCard };
    safeWriteJson(srsKey, nextMap);

    const reviewList = safeReadJson(reviewKey, []);
    if (Array.isArray(reviewList) && !reviewList.includes(cardId)) {
      safeWriteJson(reviewKey, [cardId, ...reviewList].slice(0, 200));
    }

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hanzigo_gamification_updated', { detail: { type: 'SRS_HITL_APPLIED' } }));
      }
    } catch {}

    return {
      applied: true,
      actionType: 'save_vocab_to_srs',
      savedId: cardId,
    };
  }

  if (proposal.actionType === 'update_target_hsk') {
    const targetHskLevel = String(payload.targetHskLevel || '').trim();
    if (!targetHskLevel) return { applied: false, reason: 'invalid_level' };
    const prefKey = scopedKey('hanzigo_learner_preferences', user);
    const currentPrefs = safeReadJson(prefKey, {});
    const updatedPrefs = { ...currentPrefs, targetHskLevel };
    safeWriteJson(prefKey, updatedPrefs);
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hanzigo_preferences_updated', { detail: updatedPrefs }));
      }
    } catch {}
    return {
      applied: true,
      actionType: 'update_target_hsk',
      targetHskLevel,
    };
  }

  return { applied: false, reason: 'unsupported_action_type' };
}

export function buildSmartTelemetryProgressHash(snapshot) {
  const s = snapshot || {};
  return [
    s.cadence?.todayDateKey || getVietnamDateKey(),
    s.targetHskLevel || 1,
    s.examSystem || 'all',
    s.readiness?.score || 0,
    s.roadmapAndSrs?.completedCount || 0,
    s.roadmapAndSrs?.dueToday || 0,
    s.mistakeClusters?.activeMistakesCount || 0,
    s.examAttemptsCount || 0,
  ].join('|');
}

function normalizePendingConfirmations(list = []) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && typeof item === 'object' && item.actionType)
    .map((item, idx) => ({
      id: item.id || `hitl-${idx + 1}`,
      actionType: item.actionType,
      label: String(item.label || 'Xác nhận đề xuất từ Lão Sư AI'),
      reason: String(item.reason || ''),
      requiresConfirmation: true,
      status: item.status === 'applied' || item.status === 'dismissed' ? item.status : 'pending',
      payload: item.payload && typeof item.payload === 'object' ? item.payload : {},
    }));
}

/**
 * Lấy kế hoạch thích ứng thông minh: ưu tiên Cache theo ngày/progress-hash -> /api/ai/coach -> Fallback deterministic.
 */
export async function fetchSmartCoachWithCacheAndFallback(
  user = null,
  snapshot = null,
  { forceRefresh = false, fetchImpl = null } = {}
) {
  const resolvedSnap = snapshot || buildSmartLearningSnapshot(user);
  const uid = resolveTelemetryUserId(user);
  const progressHash = buildSmartTelemetryProgressHash(resolvedSnap);
  const cacheKey = `${SMART_COACH_CACHE_PREFIX}${uid}`;

  if (!forceRefresh) {
    const cached = safeReadJson(cacheKey, null);
    if (
      cached &&
      cached.hash === progressHash &&
      typeof cached.cachedAt === 'number' &&
      Date.now() - cached.cachedAt < SMART_COACH_CACHE_TTL_MS &&
      cached.data?.dailyPlan?.length > 0
    ) {
      return {
        ...cached.data,
        fromCache: true,
      };
    }
  }

  const fallbackPlan = buildRuleBasedAdaptivePlan(resolvedSnap, { user });

  if (resolvedSnap.isGuest || !user?.id) {
    return {
      ...fallbackPlan,
      fromCache: false,
      fallbackReason: 'guest_mode',
    };
  }

  const activeFetch = fetchImpl || (typeof fetch === 'function' ? fetch : null);
  if (!activeFetch) {
    return {
      ...fallbackPlan,
      fromCache: false,
      fallbackReason: 'fetch_unavailable',
    };
  }

  let headers = {};
  try {
    headers = await getClientAuthHeaders(user);
  } catch {}

  if (!headers?.Authorization) {
    return {
      ...fallbackPlan,
      fromCache: false,
      fallbackReason: 'unauthenticated',
    };
  }

  const compactPayload = buildCompactAiTelemetryPayload(resolvedSnap);

  try {
    const res = await activeFetch('/api/ai/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        action: 'generate_smart_adaptive_plan',
        payload: compactPayload,
      }),
    });

    if (!res || !res.ok) {
      return {
        ...fallbackPlan,
        fromCache: false,
        fallbackReason: `http_${res?.status || 'error'}`,
      };
    }

    const json = await res.json();
    if (!json || !Array.isArray(json.dailyPlan) || json.dailyPlan.length === 0) {
      return {
        ...fallbackPlan,
        fromCache: false,
        fallbackReason: 'invalid_ai_shape',
      };
    }

    const result = {
      source: json.source || 'ai_coach',
      greeting: json.greeting || fallbackPlan.greeting,
      coachInsight: json.coachInsight || json.summary || fallbackPlan.coachInsight,
      weakestSkillNote: json.weakestSkillNote || fallbackPlan.weakestSkillNote,
      dailyPlan: json.dailyPlan.slice(0, 4).map((t, idx) => ({
        id: t.id || `ai-task-${idx + 1}`,
        priority: Number(t.priority || idx + 1),
        category: t.category || 'practice',
        title: String(t.title || 'Nhiệm vụ luyện tập'),
        reason: String(t.reason || 'Được cá nhân hóa từ dữ liệu học tập gần đây.'),
        durationMinutes: Number(t.durationMinutes || 5),
        targetRoute: t.targetRoute || t.route || 'roadmap',
        targetHash: t.targetHash || `#${t.targetRoute || t.route || 'roadmap'}`,
        actionLabel: String(t.actionLabel || 'Bắt đầu ngay'),
      })),
      pending_confirmations:
        Array.isArray(json.pending_confirmations) && json.pending_confirmations.length > 0
          ? normalizePendingConfirmations(json.pending_confirmations)
          : fallbackPlan.pending_confirmations,
      generatedAt: json.generatedAt || new Date().toISOString(),
    };

    safeWriteJson(cacheKey, {
      hash: progressHash,
      cachedAt: Date.now(),
      data: result,
    });

    return {
      ...result,
      fromCache: false,
    };
  } catch {
    return {
      ...fallbackPlan,
      fromCache: false,
      fallbackReason: 'network_error',
    };
  }
}

/**
 * Đồng bộ bất đồng bộ bản tóm tắt telemetry lên Supabase (nếu đã đăng nhập & cấu hình).
 */
export async function syncSmartTelemetrySnapshotAsync(user = null, snapshot = null) {
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return { synced: false, reason: 'offline_or_guest' };
  }
  const resolved = snapshot || buildSmartLearningSnapshot(user);
  const compact = buildCompactAiTelemetryPayload(resolved);
  try {
    const { error } = await supabase
      .from('user_learning_profiles')
      .upsert(
        {
          user_id: user.id,
          target_hsk_level: `HSK ${resolved.targetHskLevel}`,
          telemetry_summary: compact,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    if (error) return { synced: false, reason: error.message };
    return { synced: true };
  } catch (err) {
    return { synced: false, reason: err?.message || 'sync_failed' };
  }
}

/**
 * Dọn sạch toàn bộ cache telemetry và AI Coach khi người học đăng xuất.
 */
export function purgeSmartTelemetryCachesForLogout(user = null) {
  clearTelemetryLocalState(user);
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (
        k &&
        (k.startsWith(SMART_COACH_CACHE_PREFIX) ||
          k.startsWith('hanzigo_ai_coach_cache_') ||
          k.startsWith(`${TELEMETRY_BUFFER_KEY}`) ||
          k.startsWith(`${TELEMETRY_HISTORY_KEY}`))
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => storage.removeItem(k));
  } catch {}
}
