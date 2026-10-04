/**
 * =========================================================================
 * HANZI GO - SUPERMEMO 2 (SM-2) SPACED REPETITION ENGINE
 * =========================================================================
 * Thuật toán tính toán chu kỳ lặp lại ngắt quãng khoa học giúp học viên
 * ghi nhớ chữ Hán và từ vựng dài hạn với số lần ôn tập tối ưu nhất.
 */

export const SRS_QUALITY = {
  FORGOT: 1,    // Hoàn toàn quên / Sai
  HARD: 2,      // Nhớ nhưng rất khó khăn
  GOOD: 3,      // Nhớ chính xác sau khi suy nghĩ
  EASY: 4       // Rất dễ dàng, phản xạ tức thì
};

export const SRS_STAGES = {
  LEARNING: 0,  // Đang học mới
  REVIEW: 1,    // Đang trong chu kỳ lặp lại ngắt quãng
  MASTERED: 2   // Đã thuần thục (ghi nhớ bền vững)
};

/**
 * Tính toán trạng thái SRS tiếp theo của thẻ từ vựng theo thuật toán SM-2
 * 
 * @param {Object} currentCard - Trạng thái hiện tại của thẻ
 * @param {number} currentCard.repetitions - Số lần nhớ liên tiếp
 * @param {number} currentCard.intervalDays - Khoảng cách ngày ôn hiện tại
 * @param {number} currentCard.easeFactor - Hệ số dễ/khó (mặc định 2.50)
 * @param {number} quality - Đánh giá chất lượng nhớ (1: Quên, 2: Khó, 3: Tốt, 4: Dễ)
 * @returns {Object} Trạng thái cập nhật mới
 */
export function calculateNextSrsReview(currentCard = {}, quality = SRS_QUALITY.GOOD) {
  const q = Math.max(1, Math.min(5, quality));
  const currentRepetitions = currentCard.repetitions || 0;
  const currentInterval = currentCard.intervalDays || 1;
  const currentEaseFactor = currentCard.easeFactor || 2.50;

  let newRepetitions = currentRepetitions;
  let newInterval = 1;
  let newEaseFactor = currentEaseFactor;

  if (q < 3) {
    // Thất bại / Quên: Reset số lần lặp, bắt đầu lại từ ngày hôm sau
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Thành công: Mở rộng khoảng cách ôn tập theo chu kỳ SM-2
    if (newRepetitions === 0) {
      newInterval = 1; // Ôn lại sau 1 ngày
    } else if (newRepetitions === 1) {
      newInterval = 6; // Ôn lại sau 6 ngày
    } else {
      newInterval = Math.round(currentInterval * currentEaseFactor);
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

  return {
    repetitions: newRepetitions,
    intervalDays: newInterval,
    easeFactor: newEaseFactor,
    stage,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewDate.toISOString()
  };
}

/**
 * Kiểm tra xem thẻ từ vựng đã đến hạn cần ôn tập hay chưa
 */
export function isCardDueForReview(card) {
  if (!card) return true;
  if (!card.nextReviewAt) return true;
  return new Date(card.nextReviewAt).getTime() <= Date.now();
}

/**
 * Lọc danh sách từ vựng cần ôn tập hôm nay
 */
export function getDueReviewCards(cardsList = []) {
  if (!Array.isArray(cardsList)) return [];
  const now = Date.now();
  return cardsList.filter(card => {
    if (!card.nextReviewAt) return true;
    return new Date(card.nextReviewAt).getTime() <= now;
  });
}
