import { getUserStorageKey } from '../utils/gamification.js';
import { getMistakeNotebook } from './hskService.js';
import { VOCABULARY_LIST } from '../data/chineseData.js';

/**
 * =========================================================================
 * HANZI GO — ADAPTIVE LEARNING ENGINE (PHASE 26)
 * =========================================================================
 * Kết nối dữ liệu lỗi sai thực tế từ 4 nguồn học tập cốt lõi:
 * 1. CBT Exam Mistakes (Đề thi thử HSK - Sổ tay câu sai)
 * 2. Grammar & Listening Drills (Luyện tập cấu trúc câu & Nghe hiểu)
 * 3. Pronunciation Lab (Phát âm & Thanh điệu đạt < 65 điểm)
 * 4. SRS Vocabulary (Từ vựng cần củng cố / đến hạn ôn tập)
 *
 * NGUYÊN TẮC:
 * - Zero-Fabrication: Chỉ đề xuất từ lỗi sai & thẻ ôn tập có thật.
 * - Deterministic Ranking: Ưu tiên theo tần suất sai, độ gần đây & tính cấp thiết.
 * - Closed-Loop Mastery: Tự động gỡ khỏi hàng đợi khi người học làm đúng lại.
 */

const ADAPTIVE_SIGNALS_KEY = 'hanzigo_adaptive_signals';
const ADAPTIVE_NAV_TARGET_KEY = 'hanzigo_adaptive_nav_target';

function safeReadJson(key, fallback = []) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('adaptiveLearningService storage write error:', err);
  }
}

/**
 * Lấy toàn bộ tín hiệu lỗi sai thích ứng của người dùng
 */
export function getAdaptiveSignals(user = null) {
  const key = getUserStorageKey(ADAPTIVE_SIGNALS_KEY, user);
  const items = safeReadJson(key, []);
  return Array.isArray(items) ? items : [];
}

/**
 * Lưu tín hiệu lỗi sai khi học viên làm sai bài tập Grammar, Listening, hoặc Pronunciation
 */
export function recordAdaptiveMistake({
  user = null,
  source,
  skill,
  level = 'HSK 1',
  targetRef,
  title,
  detail = '',
  lastScore = null
}) {
  if (!source || !targetRef) return null;

  const key = getUserStorageKey(ADAPTIVE_SIGNALS_KEY, user);
  const signals = getAdaptiveSignals(user);
  const signalId = `${source}_${targetRef}`;
  const nowIso = new Date().toISOString();

  const existingIdx = signals.findIndex(s => s.id === signalId);
  let updatedItem;

  if (existingIdx >= 0) {
    const existing = signals[existingIdx];
    updatedItem = {
      ...existing,
      title: title || existing.title,
      detail: detail || existing.detail,
      level: level || existing.level,
      lastScore: lastScore !== null ? lastScore : existing.lastScore,
      errorCount: (existing.errorCount || 1) + 1,
      status: 'needs_review',
      lastMistakeAt: nowIso,
      masteredAt: null
    };
    signals[existingIdx] = updatedItem;
  } else {
    updatedItem = {
      id: signalId,
      source,
      skill: skill || source,
      level,
      targetRef: String(targetRef),
      title: title || `Nội dung ${targetRef}`,
      detail,
      lastScore,
      errorCount: 1,
      status: 'needs_review',
      lastMistakeAt: nowIso,
      masteredAt: null
    };
    signals.unshift(updatedItem);
  }

  safeWriteJson(key, signals.slice(0, 150));
  return updatedItem;
}

/**
 * Đánh dấu một mục đã được khắc phục (khi người học trả lời đúng hoặc phát âm >= 80đ)
 */
export function markAdaptiveItemMastered({ user = null, source, targetRef }) {
  if (!source || !targetRef) return false;

  const key = getUserStorageKey(ADAPTIVE_SIGNALS_KEY, user);
  const signals = getAdaptiveSignals(user);
  const signalId = `${source}_${targetRef}`;
  const idx = signals.findIndex(s => s.id === signalId);

  if (idx < 0) return false;

  signals[idx] = {
    ...signals[idx],
    status: 'mastered',
    masteredAt: new Date().toISOString()
  };

  safeWriteJson(key, signals);
  return true;
}

/**
 * Lưu mục tiêu điều hướng thích ứng (deep-link sang đúng bài tập/cấp độ khi bấm "Ôn ngay")
 */
export function setAdaptiveNavigationTarget(target) {
  if (typeof sessionStorage === 'undefined' || !target) return;
  try {
    sessionStorage.setItem(ADAPTIVE_NAV_TARGET_KEY, JSON.stringify({
      ...target,
      createdAt: Date.now()
    }));
  } catch {}
}

/**
 * Đọc và xóa mục tiêu điều hướng thích ứng (one-shot consumption)
 */
export function consumeAdaptiveNavigationTarget(expectedTab = null) {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADAPTIVE_NAV_TARGET_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || Date.now() - (parsed.createdAt || 0) > 60000) {
      sessionStorage.removeItem(ADAPTIVE_NAV_TARGET_KEY);
      return null;
    }
    if (expectedTab && parsed.targetTab !== expectedTab) {
      return null;
    }
    sessionStorage.removeItem(ADAPTIVE_NAV_TARGET_KEY);
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Tính điểm ưu tiên xác định cho mỗi mục trong hàng đợi ôn tập thích ứng
 */
function calculatePriorityScore(item) {
  const errorWeight = Math.min(item.errorCount || 1, 5) * 20;
  const sourceWeight = item.source === 'cbt' ? 25 : item.source === 'srs' ? 18 : 15;
  let recencyBonus = 5;
  if (item.lastMistakeAt) {
    const hoursAgo = (Date.now() - new Date(item.lastMistakeAt).getTime()) / 3600000;
    if (hoursAgo <= 24) recencyBonus = 20;
    else if (hoursAgo <= 72) recencyBonus = 12;
  }
  return errorWeight + sourceWeight + recencyBonus;
}

/**
 * Xây dựng Hàng đợi Ôn tập Thích ứng hợp nhất từ 4 nguồn:
 * 1. Adaptive Signals (Grammar, Listening, Pronunciation logged mistakes)
 * 2. Pronunciation History fallback (< 65 điểm chưa được cải thiện)
 * 3. CBT Exam Mistake Notebook (hsk_mistakes)
 * 4. SRS Vocabulary Review List (hanzigo_vocab_review)
 */
export async function buildAdaptiveReviewQueue(user = null) {
  const queue = [];
  const seenIds = new Set();

  // 1. Tín hiệu lỗi sai từ Practice (Grammar, Listening, Pronunciation)
  const storedSignals = getAdaptiveSignals(user);
  const activeSignals = storedSignals.filter(s => s.status === 'needs_review');

  activeSignals.forEach(sig => {
    const targetTab = sig.source === 'pronunciation' ? 'pronunciation' : 'practice';
    const levelNum = parseInt(String(sig.level || '1').replace(/\D/g, ''), 10) || 1;
    const item = {
      id: sig.id,
      source: sig.source,
      skill: sig.skill,
      level: sig.level || `HSK ${levelNum}`,
      levelNum,
      targetRef: sig.targetRef,
      title: sig.title,
      detail: sig.detail || `Sai ${sig.errorCount} lần`,
      errorCount: sig.errorCount || 1,
      lastScore: sig.lastScore,
      lastMistakeAt: sig.lastMistakeAt,
      targetTab,
      ctaLabel: sig.source === 'pronunciation' ? 'Luyện phát âm lại' : 'Ôn lại câu này'
    };
    item.priorityScore = calculatePriorityScore(item);
    item.priority = item.priorityScore >= 60 ? 'high' : 'medium';
    queue.push(item);
    seenIds.add(item.id);
  });

  // 2. Quét lịch sử Phát âm (< 65đ mà chưa có lần đạt >= 80đ sau đó)
  try {
    const pKey = getUserStorageKey('hanzigo_pronounce_history', user);
    const pHistory = safeReadJson(pKey, []);
    if (Array.isArray(pHistory) && pHistory.length > 0) {
      const latestByTarget = new Map();
      // pHistory được lưu mới nhất ở đầu mảng
      pHistory.forEach(entry => {
        if (entry?.target && !latestByTarget.has(entry.target)) {
          latestByTarget.set(entry.target, entry);
        }
      });

      latestByTarget.forEach((entry, target) => {
        const sigId = `pronunciation_${target}`;
        const masteredExplicitly = storedSignals.some(s => s.id === sigId && s.status === 'mastered');
        if (!seenIds.has(sigId) && !masteredExplicitly && typeof entry.overall === 'number' && entry.overall < 65) {
          const item = {
            id: sigId,
            source: 'pronunciation',
            skill: 'pronunciation',
            level: 'Phát âm',
            levelNum: 1,
            targetRef: target,
            title: `Phát âm: ${target} ${entry.pinyin ? `(${entry.pinyin})` : ''}`,
            detail: `Lần gần nhất đạt ${entry.overall}/100đ (Thanh điệu: ${entry.toneScore ?? '--'}đ)`,
            errorCount: 1,
            lastScore: entry.overall,
            lastMistakeAt: null,
            targetTab: 'pronunciation',
            ctaLabel: 'Sửa phát âm'
          };
          item.priorityScore = calculatePriorityScore(item);
          item.priority = item.overall < 50 ? 'high' : 'medium';
          queue.push(item);
          seenIds.add(sigId);
        }
      });
    }
  } catch {}

  // 3. Sổ tay câu sai CBT Exam (hskService)
  try {
    const hskMistakes = await getMistakeNotebook({ user }).catch(() => []);
    const activeHskMistakes = (hskMistakes || []).filter(m => m.status === 'needs_review');
    activeHskMistakes.slice(0, 15).forEach(m => {
      const sigId = `cbt_${m.questionId || m.id}`;
      if (!seenIds.has(sigId)) {
        const partLabel = m.partType === 'listening' ? 'Nghe hiểu' : m.partType === 'writing' ? 'Viết' : 'Đọc hiểu';
        const item = {
          id: sigId,
          source: 'cbt',
          skill: m.partType || 'reading',
          level: m.hskLevel || 'HSK',
          levelNum: parseInt(String(m.hskLevel || '1').replace(/\D/g, ''), 10) || 1,
          targetRef: m.questionId || m.id,
          title: m.questionText ? `CBT ${m.hskLevel || ''}: ${m.questionText.slice(0, 48)}...` : `Câu sai CBT ${m.hskLevel || ''} (${partLabel})`,
          detail: `Sai ${m.mistakeCount || 1} lần trong đề thi thử (${partLabel})`,
          errorCount: m.mistakeCount || 1,
          lastScore: null,
          lastMistakeAt: m.lastMistakeAt || m.createdAt || null,
          targetTab: 'exam-center',
          ctaLabel: 'Mở Sổ tay câu sai'
        };
        item.priorityScore = calculatePriorityScore(item);
        item.priority = item.errorCount >= 2 ? 'high' : 'medium';
        queue.push(item);
        seenIds.add(sigId);
      }
    });
  } catch {}

  // 4. Từ vựng SRS cần ôn tập (hanzigo_vocab_review)
  try {
    const revKey = getUserStorageKey('hanzigo_vocab_review', user);
    const revIds = safeReadJson(revKey, []);
    if (Array.isArray(revIds) && revIds.length > 0) {
      revIds.slice(0, 15).forEach(vocabId => {
        const sigId = `srs_${vocabId}`;
        if (!seenIds.has(sigId)) {
          const vocab = VOCABULARY_LIST.find(v => v.id === vocabId);
          const item = {
            id: sigId,
            source: 'srs',
            skill: 'vocabulary',
            level: vocab?.level || 'HSK 1',
            levelNum: parseInt(String(vocab?.level || '1').replace(/\D/g, ''), 10) || 1,
            targetRef: String(vocabId),
            title: vocab ? `Từ vựng SRS: ${vocab.hanzi} (${vocab.pinyin})` : `Từ vựng #${vocabId}`,
            detail: vocab ? `Nghĩa: ${vocab.meaning} • Đánh dấu cần ôn lại` : 'Từ vựng đến hạn ôn tập SRS',
            errorCount: 1,
            lastScore: null,
            lastMistakeAt: null,
            targetTab: 'vocabulary',
            ctaLabel: 'Ôn Flashcard'
          };
          item.priorityScore = calculatePriorityScore(item);
          item.priority = 'medium';
          queue.push(item);
          seenIds.add(sigId);
        }
      });
    }
  } catch {}

  // Sắp xếp theo điểm ưu tiên giảm dần
  queue.sort((a, b) => b.priorityScore - a.priorityScore);

  // Tổng hợp số lượng lỗ hổng theo từng kỹ năng/nguồn
  const skillGapSummary = {
    cbt: queue.filter(i => i.source === 'cbt').length,
    grammar: queue.filter(i => i.source === 'grammar').length,
    listening: queue.filter(i => i.source === 'listening').length,
    pronunciation: queue.filter(i => i.source === 'pronunciation').length,
    srs: queue.filter(i => i.source === 'srs').length
  };

  const totalPendingCount = queue.length;
  const estimatedMinutes = totalPendingCount > 0 ? Math.min(30, Math.max(3, totalPendingCount * 2)) : 0;

  return {
    queue,
    skillGapSummary,
    totalPendingCount,
    estimatedMinutes,
    hasAnyGaps: totalPendingCount > 0
  };
}

