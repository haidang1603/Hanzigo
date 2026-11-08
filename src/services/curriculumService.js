/**
 * =========================================================================
 * HANZI GO - CURRICULUM SERVICE (ON-DEMAND CHUNKING & SMART CACHE)
 * =========================================================================
 * Quản lý tải dữ liệu chương trình học HSK 1–6 theo cơ chế Dynamic Import:
 * - Lazy load chỉ nạp cấp độ HSK khi người dùng truy cập bài học tương ứng.
 * - In-Memory Cache lưu trữ các cấp độ đã nạp, tránh tải lại dư thừa.
 * - Preload thông minh: hỗ trợ nạp ngầm bài học tiếp theo hoặc cấp độ kế tiếp.
 * - Bảo toàn 100% ID bài học (l-101 đến l-620), ID từ vựng và cấu trúc 9 bước sư phạm.
 */

import { HSK_1_LESSONS } from '../data/curriculum/hsk1Lessons.js';

// In-Memory Module Cache: lưu trữ các mảng bài học theo level
const levelCache = new Map();
// Cache sẵn HSK 1 vì là cấp độ nhập môn cơ bản
levelCache.set(1, HSK_1_LESSONS);
levelCache.set('lvl-1', HSK_1_LESSONS);
levelCache.set('HSK 1', HSK_1_LESSONS);

// Map dynamic import loaders cho HSK 2 -> 6
const LEVEL_LOADERS = {
  1: () => Promise.resolve({ default: HSK_1_LESSONS }),
  2: () => import('../data/curriculum/hsk2Lessons.js'),
  3: () => import('../data/curriculum/hsk3Lessons.js'),
  4: () => import('../data/curriculum/hsk4Lessons.js'),
  5: () => import('../data/curriculum/hsk5Lessons.js'),
  6: () => import('../data/curriculum/hsk6Lessons.js'),
};

/**
 * Chuẩn hóa cấp độ đầu vào thành số 1..6
 */
export function normalizeLevelNumber(levelInput) {
  if (typeof levelInput === 'number') {
    return Math.max(1, Math.min(6, levelInput));
  }
  const str = String(levelInput || '').toLowerCase().trim();
  if (str.includes('1') || str === 'lvl-1') return 1;
  if (str.includes('2') || str === 'lvl-2') return 2;
  if (str.includes('3') || str === 'lvl-3') return 3;
  if (str.includes('4') || str === 'lvl-4') return 4;
  if (str.includes('5') || str === 'lvl-5') return 5;
  if (str.includes('6') || str === 'lvl-6') return 6;
  return 1;
}

/**
 * Tự động xác định level từ lessonId (vd: 'l-105' -> 1, 'l-420' -> 4)
 */
export function getLevelFromLessonId(lessonId) {
  if (!lessonId || typeof lessonId !== 'string') return 1;
  const match = lessonId.match(/^l-([1-6])\d{2}$/);
  if (match) return parseInt(match[1], 10);
  return 1;
}

/**
 * Lấy danh sách 6 cấp độ HSK chuẩn
 */
export function getHSKLevels() {
  return [
    { id: 'lvl-1', levelNumber: 1, name: 'HSK 1', title: 'Nhập môn & Nền tảng phát âm', totalLessons: 20 },
    { id: 'lvl-2', levelNumber: 2, name: 'HSK 2', title: 'Sơ cấp & Giao tiếp đời sống', totalLessons: 20 },
    { id: 'lvl-3', levelNumber: 3, name: 'HSK 3', title: 'Trung cấp 1 & Đàm thoại độc lập', totalLessons: 20 },
    { id: 'lvl-4', levelNumber: 4, name: 'HSK 4', title: 'Trung cấp 2 & Công sở thương mại', totalLessons: 20 },
    { id: 'lvl-5', levelNumber: 5, name: 'HSK 5', title: 'Cao cấp 1 & Học thuật chuyên sâu', totalLessons: 20 },
    { id: 'lvl-6', levelNumber: 6, name: 'HSK 6', title: 'Cao cấp 2 & Thành ngữ văn chương', totalLessons: 20 }
  ];
}

/**
 * Tải danh sách bài học của một cấp độ (bất đồng bộ với Caching)
 *
 * @param {number|string} levelInput - Ví dụ: 1, 'lvl-2', 'HSK 3'
 * @returns {Promise<Array>} Mảng 20 bài học của cấp độ tương ứng
 */
export async function getHSKLessons(levelInput) {
  const lvlNum = normalizeLevelNumber(levelInput);
  if (levelCache.has(lvlNum)) {
    return levelCache.get(lvlNum);
  }

  const loader = LEVEL_LOADERS[lvlNum];
  if (!loader) {
    return levelCache.get(1);
  }

  try {
    const mod = await loader();
    const lessons = mod.default || mod[`HSK_${lvlNum}_LESSONS`] || [];
    levelCache.set(lvlNum, lessons);
    levelCache.set(`lvl-${lvlNum}`, lessons);
    levelCache.set(`HSK ${lvlNum}`, lessons);
    return lessons;
  } catch (err) {
    console.error(`[CurriculumService] Failed to load HSK ${lvlNum}:`, err);
    return levelCache.get(1) || [];
  }
}

/**
 * Tải chi tiết một bài học theo ID (Lazy load chính xác cấp độ chứa bài học)
 *
 * @param {string} lessonId - Ví dụ: 'l-101', 'l-405'
 * @returns {Promise<object|null>} Đối tượng bài học chi tiết 9 bước
 */
export async function getHSKLessonDetail(lessonId) {
  if (!lessonId) return null;
  const lvlNum = getLevelFromLessonId(lessonId);
  const lessons = await getHSKLessons(lvlNum);
  return lessons.find(l => l.id === lessonId) || null;
}

/**
 * Nạp trước (Preload) một bài học hoặc cấp độ tiếp theo vào cache ngầm
 *
 * @param {string} lessonId - ID bài học tiếp theo cần nạp trước
 */
export function preloadHSKLesson(lessonId) {
  if (!lessonId) return;
  const lvlNum = getLevelFromLessonId(lessonId);
  if (!levelCache.has(lvlNum)) {
    getHSKLessons(lvlNum).catch(() => {});
  }
}

/**
 * Xóa cache cấp độ để làm mới dữ liệu nếu cần thiết
 */
export function clearCurriculumCache() {
  levelCache.clear();
  levelCache.set(1, HSK_1_LESSONS);
  levelCache.set('lvl-1', HSK_1_LESSONS);
  levelCache.set('HSK 1', HSK_1_LESSONS);
}

