/**
 * =========================================================================
 * HSK 3.0 & HSK 2.0 FULL EXPANSION LAZY LOADER (DYNAMIC IMPORT)
 * =========================================================================
 * Nạp bất đồng bộ từng bậc đề thi chuẩn HSK 3.0 & phần bổ sung HSK 2.0 qua import() để:
 * - Giữ dung lượng entry index.js <= 160 KB gzip và data-hsk-core <= 180 KB gzip
 * - Tự động đăng ký ngân hàng 485 câu HSK 3.0 + 125 câu bổ sung HSK 2.0 vào Exam Assembler
 * =========================================================================
 */

import {
  EXAM_SYSTEMS,
  EXAM_MODES,
  assembleDualSystemExam,
  registerHsk30LevelBank,
  registerHsk20ExpansionQuestions,
} from '../hskExamBlueprints.js';

const LOADED_BANKS = new Map();
const IN_FLIGHT_LOADS = new Map();
let loadedHsk20Expansion = null;
let inFlightHsk20Expansion = null;

export const HSK30_LEVEL_KEYS = Object.freeze([
  'hsk1',
  'hsk2',
  'hsk3',
  'hsk4',
  'hsk5',
  'hsk6',
  'hsk7-9',
]);

export function resolveHsk30LevelKey(levelInput = 'HSK 1') {
  const clean = String(levelInput || 'hsk1')
    .replace(/–/g, '-')
    .trim()
    .toLowerCase();

  if (clean === '7-9' || clean === '7' || clean === '8' || clean === '9' || clean.includes('7-9') || clean.includes('7to9')) {
    return 'hsk7-9';
  }
  const match = clean.match(/([1-6])/);
  if (match) {
    return `hsk${match[1]}`;
  }
  return 'hsk1';
}

async function importLevelModule(canonicalKey) {
  switch (canonicalKey) {
    case 'hsk1': {
      const mod = await import('./hsk30Level1.js');
      return {
        levelKey: 'hsk1',
        level: 'HSK 1',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL1_EXAM,
        questions: mod.HSK30_LEVEL1_QUESTIONS,
        speakingTasks: [],
      };
    }
    case 'hsk2': {
      const mod = await import('./hsk30Level2.js');
      return {
        levelKey: 'hsk2',
        level: 'HSK 2',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL2_EXAM,
        questions: mod.HSK30_LEVEL2_QUESTIONS,
        speakingTasks: [],
      };
    }
    case 'hsk3': {
      const mod = await import('./hsk30Level3.js');
      return {
        levelKey: 'hsk3',
        level: 'HSK 3',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL3_EXAM,
        questions: mod.HSK30_LEVEL3_QUESTIONS,
        speakingTasks: mod.HSK30_LEVEL3_SPEAKING_TASKS || [],
      };
    }
    case 'hsk4': {
      const mod = await import('./hsk30Level4.js');
      return {
        levelKey: 'hsk4',
        level: 'HSK 4',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL4_EXAM,
        questions: mod.HSK30_LEVEL4_QUESTIONS,
        speakingTasks: mod.HSK30_LEVEL4_SPEAKING_TASKS || [],
      };
    }
    case 'hsk5': {
      const mod = await import('./hsk30Level5.js');
      return {
        levelKey: 'hsk5',
        level: 'HSK 5',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL5_EXAM,
        questions: mod.HSK30_LEVEL5_QUESTIONS,
        speakingTasks: mod.HSK30_LEVEL5_SPEAKING_TASKS || [],
      };
    }
    case 'hsk6': {
      const mod = await import('./hsk30Level6.js');
      return {
        levelKey: 'hsk6',
        level: 'HSK 6',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL6_EXAM,
        questions: mod.HSK30_LEVEL6_QUESTIONS,
        speakingTasks: mod.HSK30_LEVEL6_SPEAKING_TASKS || [],
      };
    }
    case 'hsk7-9': {
      const mod = await import('./hsk30Level7to9.js');
      return {
        levelKey: 'hsk7-9',
        level: 'HSK 7-9',
        examSystem: 'hsk_3_0',
        metadata: mod.HSK30_LEVEL7TO9_EXAM,
        questions: mod.HSK30_LEVEL7TO9_QUESTIONS,
        speakingTasks: [],
      };
    }
    default:
      throw new Error(`Unsupported HSK 3.0 level key: ${canonicalKey}`);
  }
}

export function getCachedHsk30Bank(levelInput = 'HSK 1') {
  const canonicalKey = resolveHsk30LevelKey(levelInput);
  return LOADED_BANKS.get(canonicalKey) || null;
}

/**
 * Nạp động 1 đề chuẩn HSK 3.0 theo cấp độ (hsk1..hsk6, hsk7-9).
 * Sau khi nạp xong sẽ tự động đăng ký vào Dual-System Blueprint Assembler.
 */
export async function loadHsk30ExamByLevel(levelKey = 'hsk1') {
  const canonicalKey = resolveHsk30LevelKey(levelKey);
  if (LOADED_BANKS.has(canonicalKey)) {
    const cached = LOADED_BANKS.get(canonicalKey);
    registerHsk30LevelBank(cached.level, cached);
    return cached;
  }

  if (IN_FLIGHT_LOADS.has(canonicalKey)) {
    return IN_FLIGHT_LOADS.get(canonicalKey);
  }

  const promise = importLevelModule(canonicalKey)
    .then((bank) => {
      LOADED_BANKS.set(canonicalKey, bank);
      registerHsk30LevelBank(bank.level, bank);
      return bank;
    })
    .finally(() => {
      IN_FLIGHT_LOADS.delete(canonicalKey);
    });

  IN_FLIGHT_LOADS.set(canonicalKey, promise);
  return promise;
}

/**
 * Nạp toàn bộ 7 bậc HSK 3.0 (485 câu chính + 24 nhiệm vụ Nói riêng HSK 3–6).
 */
export async function loadAllHsk30Exams() {
  const results = await Promise.all(HSK30_LEVEL_KEYS.map((key) => loadHsk30ExamByLevel(key)));
  return results;
}

/**
 * Nạp động 125 câu hỏi bổ sung giúp HSK 2.0 (HSK 3, HSK 4, HSK 5) đạt đủ 100% số câu chuẩn (80, 100, 100).
 */
export async function loadHsk20FullExpansion() {
  if (loadedHsk20Expansion) {
    registerHsk20ExpansionQuestions(loadedHsk20Expansion);
    return loadedHsk20Expansion;
  }
  if (inFlightHsk20Expansion) {
    return inFlightHsk20Expansion;
  }

  inFlightHsk20Expansion = import('./hsk20FullExpansion.js')
    .then((mod) => {
      loadedHsk20Expansion = mod.HSK20_FULL_EXPANSION_QUESTIONS || [];
      registerHsk20ExpansionQuestions(loadedHsk20Expansion);
      return loadedHsk20Expansion;
    })
    .finally(() => {
      inFlightHsk20Expansion = null;
    });

  return inFlightHsk20Expansion;
}

/**
 * Đảm bảo toàn bộ 13 bộ đề chuẩn đầy đủ 100% số câu (7 bậc HSK 3.0 + 6 cấp HSK 2.0)
 * được nạp động và đăng ký sẵn vào DYNAMIC_EXAMS để hiển thị trong Kho Đề Thi.
 */
export async function ensureAllFullStandardExamsLoaded() {
  await Promise.all([loadAllHsk30Exams(), loadHsk20FullExpansion()]);

  const hsk30Levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'];
  const hsk20Levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];

  const hsk30Exams = hsk30Levels.map((lvl) =>
    assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_3_0,
      level: lvl,
      mode: EXAM_MODES.FULL_EXAM,
    })
  );

  const hsk20FullExams = hsk20Levels.map((lvl) =>
    assembleDualSystemExam({
      examSystem: EXAM_SYSTEMS.HSK_2_0,
      level: lvl,
      mode: EXAM_MODES.FULL_EXAM,
    })
  );

  return { hsk30Exams, hsk20FullExams };
}
