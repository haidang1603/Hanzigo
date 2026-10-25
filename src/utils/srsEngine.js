/**
 * =========================================================================
 * HANZI GO - SUPERMEMO 2 (SM-2) SPACED REPETITION ENGINE (PHASE 10)
 * =========================================================================
 * Thuật toán tính toán chu kỳ lặp lại ngắt quãng khoa học giúp học viên
 * ghi nhớ chữ Hán và từ vựng dài hạn với số lần ôn tập tối ưu nhất.
 * Hỗ trợ 4 mức đánh giá trực quan (Again, Hard, Good, Easy), phát hiện
 * từ hay quên (Leeches), tự động thu thập điểm yếu (Weakness Capture),
 * và đồng bộ 2 chiều Offline/Cloud (Last-Write-Wins).
 */

import { getUserStorageKey } from './gamification.js';

export const SRS_QUALITY = {
  FORGOT: 1,    // Hoàn toàn quên / Sai (Again - q=1)
  AGAIN: 1,     // Quên / Làm sai
  HARD: 3,      // Nhớ nhưng rất khó khăn (Hard - q=3)
  GOOD: 4,      // Nhớ chính xác sau suy nghĩ (Good - q=4)
  EASY: 5       // Rất dễ dàng, phản xạ tức thì (Easy - q=5)
};

export const SRS_STAGES = {
  LEARNING: 0,  // Đang học mới (n = 0)
  REVIEW: 1,    // Đang trong chu kỳ lặp lại ngắt quãng (n >= 1)
  MASTERED: 2   // Đã thuần thục (ghi nhớ bền vững: n >= 4 & interval >= 15)
};

export const STORAGE_SRS_STATE = 'hanzigo_vocab_srs_state';
export const STORAGE_REVIEW = 'hanzigo_vocab_review';

/**
 * Tính toán trạng thái SRS tiếp theo của thẻ từ vựng theo thuật toán SM-2 chuẩn
 * 
 * @param {Object} currentCard - Trạng thái hiện tại của thẻ
 * @param {number} quality - Đánh giá chất lượng nhớ (1: Again, 3: Hard, 4: Good, 5: Easy)
 * @returns {Object} Trạng thái cập nhật mới (hỗ trợ cả camelCase và snake_case)
 */
export function calculateNextSrsReview(currentCard = {}, quality = SRS_QUALITY.GOOD) {
  // Chuẩn hóa điểm chất lượng q trong khoảng [1, 5]
  let q = Number(quality);
  if (isNaN(q) || q < 1) q = 1;
  if (q > 5) q = 5;

  const currentRepetitions = currentCard.repetitions ?? currentCard.repetition ?? 0;
  const currentInterval = currentCard.intervalDays ?? currentCard.interval_days ?? 1;
  const currentEaseFactor = Number(currentCard.easeFactor ?? currentCard.ease_factor) || 2.50;
  const currentLapseCount = currentCard.lapseCount ?? currentCard.lapse_count ?? 0;

  let newRepetitions = currentRepetitions;
  let newInterval = 1;
  let newEaseFactor = currentEaseFactor;
  let newLapseCount = currentLapseCount;

  if (q < 3) {
    // Thất bại / Quên (Again - q=1 hoặc q=2):
    // Reset số lần lặp liên tiếp, bắt đầu lại từ ngày hôm sau, ghi nhận lapse
    newRepetitions = 0;
    newInterval = 1;
    newLapseCount += 1;
  } else {
    // Thành công (Hard q=3, Good q=4, Easy q=5):
    // Mở rộng khoảng cách ôn tập theo chu kỳ SM-2 chuẩn
    if (newRepetitions === 0) {
      newInterval = 1; // Lần 1: Ôn lại sau 1 ngày
    } else if (newRepetitions === 1) {
      newInterval = 6; // Lần 2: Ôn lại sau 6 ngày
    } else {
      // Lần 3 trở đi: I = round(I_prev * EF)
      const baseInterval = Math.round(currentInterval * currentEaseFactor);
      if (q === 5) {
        // Đánh giá Easy (q=5): Thưởng thêm 30% khoảng cách ngày
        newInterval = Math.max(baseInterval + 1, Math.round(baseInterval * 1.30));
      } else {
        newInterval = baseInterval;
      }
    }
    newRepetitions += 1;
  }

  // Điều chỉnh hệ số Ease Factor theo công thức chuẩn SM-2:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // Ease Factor tối thiểu không được dưới 1.30 để tránh kẹt trong chu kỳ quá ngắn
  if (newEaseFactor < 1.30) {
    newEaseFactor = 1.30;
  }

  // Làm tròn Ease Factor 2 chữ số thập phân
  newEaseFactor = Math.round(newEaseFactor * 100) / 100;

  // Xác định giai đoạn thành thạo
  let stage = SRS_STAGES.LEARNING;
  if (newRepetitions >= 4 && newInterval >= 15) {
    stage = SRS_STAGES.MASTERED;
  } else if (newRepetitions >= 1) {
    stage = SRS_STAGES.REVIEW;
  }

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  const context = currentCard.sourceContext || currentCard.source_context || 'review';

  return {
    // camelCase properties (frontend standard)
    repetitions: newRepetitions,
    intervalDays: newInterval,
    easeFactor: newEaseFactor,
    stage,
    lapseCount: newLapseCount,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewDate.toISOString(),
    sourceContext: context,

    // snake_case properties (Supabase PostgreSQL schema mapping)
    repetition: newRepetitions,
    interval_days: newInterval,
    ease_factor: newEaseFactor,
    lapse_count: newLapseCount,
    last_reviewed_at: now.toISOString(),
    next_review_at: nextReviewDate.toISOString(),
    source_context: context,
    updated_at: now.toISOString()
  };
}

/**
 * Kiểm tra xem thẻ từ vựng đã đến hạn cần ôn tập hay chưa
 */
export function isCardDueForReview(card) {
  if (!card) return true;
  const reviewTimeStr = card.nextReviewAt || card.next_review_at;
  if (!reviewTimeStr) return true;
  return new Date(reviewTimeStr).getTime() <= Date.now();
}

/**
 * Lọc danh sách từ vựng cần ôn tập hôm nay
 */
export function getDueReviewCards(cardsList = []) {
  if (!Array.isArray(cardsList)) return [];
  const now = Date.now();
  return cardsList.filter(card => {
    const reviewTimeStr = card.nextReviewAt || card.next_review_at;
    if (!reviewTimeStr) return true;
    return new Date(reviewTimeStr).getTime() <= now;
  });
}

/**
 * Tính toán số liệu thống kê toàn diện về hệ thống SRS
 * (Due, New, Review, Mastered, Leeches và dự báo 7 ngày tới)
 */
export function calculateSrsStats(cardsList = []) {
  if (!Array.isArray(cardsList)) {
    return {
      totalCount: 0,
      dueCount: 0,
      newCount: 0,
      reviewCount: 0,
      masteredCount: 0,
      leechCount: 0,
      forecast7Days: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  let dueCount = 0;
  let newCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;
  let leechCount = 0;
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const forecast7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now + i * dayMs);
    return {
      dayOffset: i,
      count: 0,
      dayLabel: i === 0 ? 'H.nay' : daysOfWeek[d.getDay()],
      isToday: i === 0
    };
  });

  cardsList.forEach(card => {
    const repetitions = card.repetitions ?? card.repetition ?? 0;
    const lapses = card.lapseCount ?? card.lapse_count ?? 0;
    const stage = card.stage ?? 0;
    const reviewTimeStr = card.nextReviewAt || card.next_review_at;
    const reviewTime = reviewTimeStr ? new Date(reviewTimeStr).getTime() : now;

    // Leeches: Thẻ hay quên (quên >= 3 lần)
    if (lapses >= 3) {
      leechCount++;
    }

    if (repetitions === 0 && lapses === 0) {
      newCount++;
    } else if (stage === SRS_STAGES.MASTERED || repetitions >= 5) {
      masteredCount++;
    } else {
      reviewCount++;
    }

    // Due check
    if (reviewTime <= now) {
      dueCount++;
      forecast7Days[0].count++;
    } else {
      const diffDays = Math.floor((reviewTime - now) / dayMs);
      if (diffDays >= 0 && diffDays < 7) {
        forecast7Days[diffDays].count++;
      }
    }
  });

  return {
    totalCount: cardsList.length,
    dueCount,
    newCount,
    reviewCount,
    masteredCount,
    leechCount,
    forecast7Days
  };
}

/**
 * Tự động thu thập điểm yếu (Adaptive Weakness Capture)
 * Đẩy từ vựng học viên làm sai trong Quiz, Mock Exams hoặc Luyện viết vào hàng đợi SRS
 * 
 * @param {Object|string} wordData - Dữ liệu từ hoặc chữ Hán
 * @param {string} sourceContext - 'quiz_mistake' | 'writing_mistake' | 'exam_mistake'
 * @param {Object} user - Thông tin người dùng hiện tại
 * @returns {Object} Thẻ SRS đã cập nhật
 */
export function captureWeakVocabulary(wordData, sourceContext = 'quiz_mistake', user = null) {
  if (!wordData) return null;

  const hanzi = typeof wordData === 'string' ? wordData.trim() : (wordData.hanzi || wordData.char || '').trim();
  if (!hanzi) return null;

  const srsKey = getUserStorageKey(STORAGE_SRS_STATE, user);
  const reviewKey = getUserStorageKey(STORAGE_REVIEW, user);

  let srsMap = {};
  try {
    const raw = localStorage.getItem(srsKey);
    if (raw) srsMap = JSON.parse(raw);
  } catch {}

  const now = new Date();
  const existingCard = srsMap[hanzi];
  let updatedCard;

  if (existingCard) {
    // Đã có trong bộ SRS: Đặt lại chu kỳ về 1 ngày, giảm nhẹ ease factor, tăng lapse
    const currentEF = Number(existingCard.easeFactor ?? existingCard.ease_factor) || 2.50;
    const newEF = Math.max(1.30, Math.round((currentEF - 0.15) * 100) / 100);
    const newLapses = (existingCard.lapseCount ?? existingCard.lapse_count ?? 0) + 1;

    updatedCard = {
      ...existingCard,
      repetitions: 0,
      repetition: 0,
      intervalDays: 1,
      interval_days: 1,
      easeFactor: newEF,
      ease_factor: newEF,
      stage: SRS_STAGES.LEARNING,
      lapseCount: newLapses,
      lapse_count: newLapses,
      sourceContext,
      source_context: sourceContext,
      nextReviewAt: now.toISOString(),
      next_review_at: now.toISOString(),
      updatedAt: now.toISOString(),
      updated_at: now.toISOString()
    };
  } else {
    // Chưa có: Tạo thẻ mới với trạng thái cần ôn tập khẩn cấp ngay hôm nay
    const pinyin = typeof wordData === 'object' ? (wordData.pinyin || '') : '';
    const meaning = typeof wordData === 'object' ? (wordData.meaning || wordData.meaning_vi || '') : '';
    const hanviet = typeof wordData === 'object' ? (wordData.hanviet || '') : '';
    const level = typeof wordData === 'object' ? (wordData.level || wordData.hsk_level || 'HSK 1') : 'HSK 1';

    updatedCard = {
      hanzi,
      pinyin,
      meaning,
      hanviet,
      level,
      repetitions: 0,
      repetition: 0,
      intervalDays: 1,
      interval_days: 1,
      easeFactor: 2.35, // Khởi đầu thấp hơn 2.50 vì là lỗi sai
      ease_factor: 2.35,
      stage: SRS_STAGES.LEARNING,
      lapseCount: 1,
      lapse_count: 1,
      sourceContext,
      source_context: sourceContext,
      nextReviewAt: now.toISOString(),
      next_review_at: now.toISOString(),
      lastReviewedAt: null,
      last_reviewed_at: null,
      updatedAt: now.toISOString(),
      updated_at: now.toISOString()
    };
  }

  // 1. Cập nhật localStorage srsMap
  srsMap[hanzi] = updatedCard;
  try {
    localStorage.setItem(srsKey, JSON.stringify(srsMap));
  } catch {}

  // 2. Thêm vào danh sách reviewIds
  try {
    const rawReview = localStorage.getItem(reviewKey);
    const reviewList = rawReview ? JSON.parse(rawReview) : [];
    if (!reviewList.includes(hanzi) && !reviewList.includes(`vocab-${hanzi}`)) {
      reviewList.push(hanzi);
      localStorage.setItem(reviewKey, JSON.stringify(reviewList));
    }
  } catch {}

  // 3. Dispatch sự kiện thông báo toàn ứng dụng
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('hanzigo_srs_updated', {
        detail: { hanzi, sourceContext, card: updatedCard }
      }));
      window.dispatchEvent(new CustomEvent('hanzigo_vocab_saved', {
        detail: { hanzi, source: sourceContext }
      }));
    } catch {}
  }

  return updatedCard;
}

/**
 * Hợp nhất (Merge) thẻ SRS giữa LocalStorage và Cloud Supabase theo chiến lược Last-Write-Wins
 * 
 * @param {Object} localCardsMap - Bản đồ thẻ SRS từ client { [hanzi]: card }
 * @param {Array} remoteCardsList - Danh sách thẻ SRS từ bảng user_srs_cards
 * @returns {Object} Bản đồ thẻ sau khi hợp nhất hoàn chỉnh
 */
export function mergeSrsCardsLastWriteWins(localCardsMap = {}, remoteCardsList = []) {
  const merged = { ...localCardsMap };

  if (!Array.isArray(remoteCardsList)) return merged;

  remoteCardsList.forEach(remote => {
    const hanzi = remote.hanzi;
    if (!hanzi) return;

    const local = merged[hanzi];
    if (!local) {
      // Chỉ có ở Cloud: nhận vào Local
      merged[hanzi] = {
        hanzi: remote.hanzi,
        pinyin: remote.pinyin || '',
        meaning: remote.meaning_vi || remote.meaning || '',
        hanviet: remote.hanviet || '',
        level: remote.hsk_level ? `HSK ${remote.hsk_level}` : 'HSK 1',
        repetitions: remote.repetition ?? 0,
        repetition: remote.repetition ?? 0,
        intervalDays: remote.interval_days ?? 1,
        interval_days: remote.interval_days ?? 1,
        easeFactor: Number(remote.ease_factor) || 2.50,
        ease_factor: Number(remote.ease_factor) || 2.50,
        lapseCount: remote.lapse_count ?? 0,
        lapse_count: remote.lapse_count ?? 0,
        stage: remote.repetition >= 4 && remote.interval_days >= 15 ? SRS_STAGES.MASTERED : remote.repetition >= 1 ? SRS_STAGES.REVIEW : SRS_STAGES.LEARNING,
        nextReviewAt: remote.next_review_at || new Date().toISOString(),
        next_review_at: remote.next_review_at || new Date().toISOString(),
        lastReviewedAt: remote.last_reviewed_at || null,
        last_reviewed_at: remote.last_reviewed_at || null,
        sourceContext: remote.source_context || 'lesson',
        source_context: remote.source_context || 'lesson',
        updatedAt: remote.updated_at || new Date().toISOString(),
        updated_at: remote.updated_at || new Date().toISOString()
      };
      return;
    }

    // Cả hai cùng có: So sánh updated_at / last_reviewed_at để chọn bản mới nhất (Last-Write-Wins)
    const remoteTime = new Date(remote.updated_at || remote.last_reviewed_at || 0).getTime();
    const localTime = new Date(local.updatedAt || local.updated_at || local.lastReviewedAt || 0).getTime();

    if (remoteTime >= localTime) {
      merged[hanzi] = {
        ...local,
        repetitions: remote.repetition ?? local.repetitions,
        repetition: remote.repetition ?? local.repetition,
        intervalDays: remote.interval_days ?? local.intervalDays,
        interval_days: remote.interval_days ?? local.interval_days,
        easeFactor: Number(remote.ease_factor) || local.easeFactor,
        ease_factor: Number(remote.ease_factor) || local.ease_factor,
        lapseCount: remote.lapse_count ?? local.lapseCount,
        lapse_count: remote.lapse_count ?? local.lapse_count,
        nextReviewAt: remote.next_review_at || local.nextReviewAt,
        next_review_at: remote.next_review_at || local.next_review_at,
        lastReviewedAt: remote.last_reviewed_at || local.lastReviewedAt,
        last_reviewed_at: remote.last_reviewed_at || local.last_reviewed_at,
        sourceContext: remote.source_context || local.sourceContext,
        source_context: remote.source_context || local.source_context,
        updatedAt: remote.updated_at || local.updatedAt,
        updated_at: remote.updated_at || local.updated_at
      };
    }
  });

  return merged;
}
