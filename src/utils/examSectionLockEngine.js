/**
 * =========================================================================
 * HANZI GO — CTI SECTION TIMER LOCK ENGINE (HSK 2.0 & HSK 3.0)
 * =========================================================================
 * Quản lý vòng đời khóa cứng từng phân môn theo chuẩn phòng thi máy CTI:
 * - 'locked_completed': Phân môn đã kết thúc / hết giờ — khóa cứng không cho quay lại
 * - 'active': Phân môn đang làm bài — chỉ mở tương tác cho các câu trong phần này
 * - 'locked_upcoming': Phân môn kế tiếp chưa mở khóa
 *
 * Chế độ 'learning_mode' (practice) tắt khóa cứng (strictSectionLock = false)
 * để người học tự do chuyển tab ôn tập.
 */

export const SECTION_STATES = Object.freeze({
  LOCKED_COMPLETED: 'locked_completed',
  ACTIVE: 'active',
  LOCKED_UPCOMING: 'locked_upcoming',
});

export const SKILL_ORDER = Object.freeze([
  'listening',
  'reading',
  'writing',
  'translation',
  'speaking',
]);

export const SKILL_LABELS_VI = Object.freeze({
  listening: 'Nghe hiểu',
  reading: 'Đọc hiểu',
  writing: 'Viết',
  translation: 'Dịch thuật',
  speaking: 'Khẩu ngữ (Nói)',
});

export const SKILL_TITLES_ZH = Object.freeze({
  listening: '听力',
  reading: '阅读',
  writing: '书写',
  translation: '翻译',
  speaking: '口语',
});

export const CTI_SECTION_MINUTES_TABLE = Object.freeze({
  hsk_2_0: Object.freeze({
    'HSK 1': Object.freeze({ listening: 15, reading: 25 }),
    'HSK 2': Object.freeze({ listening: 25, reading: 30 }),
    'HSK 3': Object.freeze({ listening: 35, reading: 35, writing: 20 }),
    'HSK 4': Object.freeze({ listening: 30, reading: 40, writing: 35 }),
    'HSK 5': Object.freeze({ listening: 30, reading: 45, writing: 50 }),
    'HSK 6': Object.freeze({ listening: 35, reading: 50, writing: 55 }),
  }),
  hsk_3_0: Object.freeze({
    'HSK 1': Object.freeze({ listening: 15, reading: 25 }),
    'HSK 2': Object.freeze({ listening: 20, reading: 28, writing: 12 }),
    'HSK 3': Object.freeze({ listening: 28, reading: 37, writing: 18 }),
    'HSK 4': Object.freeze({ listening: 23, reading: 34, writing: 28 }),
    'HSK 5': Object.freeze({ listening: 28, reading: 39, writing: 43 }),
    'HSK 6': Object.freeze({ listening: 33, reading: 44, writing: 48 }),
    'HSK 7-9': Object.freeze({
      listening: 30,
      reading: 60,
      writing: 55,
      translation: 30,
      speaking: 25,
    }),
  }),
});

function normalizeSkillKey(rawSkill) {
  const clean = String(rawSkill || 'reading').toLowerCase().trim();
  if (SKILL_ORDER.includes(clean)) return clean;
  if (clean.includes('listen')) return 'listening';
  if (clean.includes('writ')) return 'writing';
  if (clean.includes('trans')) return 'translation';
  if (clean.includes('speak')) return 'speaking';
  return 'reading';
}

function normalizeLevelKey(rawLevel) {
  const s = String(rawLevel || '').replace(/–/g, '-').trim().toUpperCase();
  if (s.includes('7') || s.includes('8') || s.includes('9')) return 'HSK 7-9';
  const match = s.match(/([1-6])/);
  return match ? `HSK ${match[1]}` : 'HSK 1';
}

function resolveExamSystemKey(exam, blueprint) {
  const sys = String(exam?.examSystem || exam?.exam_system || blueprint?.examSystem || '').toLowerCase();
  if (sys.includes('3_0') || sys.includes('3.0')) return 'hsk_3_0';
  if (String(exam?.id || '').includes('hsk30') || normalizeLevelKey(exam?.level) === 'HSK 7-9') {
    return 'hsk_3_0';
  }
  return 'hsk_2_0';
}

/**
 * Xây dựng lịch phân môn & định mức thời gian (tính theo giây) sao cho
 * tổng durationSeconds của mọi phân môn khớp tuyệt đối với duration_minutes * 60.
 */
export function buildExamSectionSchedule({ exam = {}, questions = [], blueprint = null } = {}) {
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const grouped = new Map();

  safeQuestions.forEach((q, idx) => {
    const skill = normalizeSkillKey(q?.part_type || q?.skill || q?.section || 'reading');
    if (!grouped.has(skill)) {
      grouped.set(skill, {
        key: skill,
        skill,
        labelVi: SKILL_LABELS_VI[skill] || skill,
        labelZh: SKILL_TITLES_ZH[skill] || '',
        questionIndexes: [],
        questionIds: [],
      });
    }
    const entry = grouped.get(skill);
    entry.questionIndexes.push(idx);
    if (q?.id) entry.questionIds.push(q.id);
  });

  const orderedSections = SKILL_ORDER
    .filter((skill) => grouped.has(skill))
    .map((skill) => grouped.get(skill));

  if (orderedSections.length === 0) {
    return [];
  }

  const rawMinutes = Number(
    exam?.duration_minutes ?? exam?.durationMinutes ?? blueprint?.durationMinutes ?? 40
  );
  const totalDurationSeconds = Math.max(60, Math.round((Number.isFinite(rawMinutes) && rawMinutes > 0 ? rawMinutes : 40) * 60));

  if (orderedSections.length === 1) {
    return [{
      ...orderedSections[0],
      firstIdx: orderedSections[0].questionIndexes[0] ?? 0,
      durationSeconds: totalDurationSeconds,
    }];
  }

  const sysKey = resolveExamSystemKey(exam, blueprint);
  const levelKey = normalizeLevelKey(exam?.level || blueprint?.level || 'HSK 1');
  const tableRow = CTI_SECTION_MINUTES_TABLE[sysKey]?.[levelKey] || null;

  const rawWeights = orderedSections.map((sec) => {
    const fromTable = tableRow && typeof tableRow[sec.skill] === 'number' ? tableRow[sec.skill] : 0;
    const fromBlueprint = blueprint?.skills?.[sec.skill]?.durationMinutes || 0;
    const weight = fromTable || fromBlueprint || Math.max(1, sec.questionIndexes.length);
    return Math.max(1, weight);
  });

  const weightSum = rawWeights.reduce((acc, w) => acc + w, 0) || 1;
  let allocated = 0;

  return orderedSections.map((sec, idx) => {
    const isLast = idx === orderedSections.length - 1;
    const durationSeconds = isLast
      ? Math.max(1, totalDurationSeconds - allocated)
      : Math.max(1, Math.round((totalDurationSeconds * rawWeights[idx]) / weightSum));
    if (!isLast) allocated += durationSeconds;
    return {
      ...sec,
      firstIdx: sec.questionIndexes[0] ?? 0,
      durationSeconds,
    };
  });
}

function hydrateSectionLockDraft(sections, restoredDraft, strictSectionLock) {
  const durations = sections.map((s) => Math.max(1, Number(s?.durationSeconds || 60)));
  const count = sections.length;

  if (!restoredDraft || typeof restoredDraft !== 'object' || count === 0) {
    return {
      strictSectionLock: Boolean(strictSectionLock),
      activeSectionIndex: 0,
      lockedSections: [],
      sectionRemainingSeconds: [...durations],
      sectionDurations: durations,
      isFinished: false,
    };
  }

  const rawActive = Number(restoredDraft.activeSectionIndex);
  const activeSectionIndex = Number.isInteger(rawActive) && rawActive >= 0 && rawActive < count ? rawActive : 0;

  const lockedSet = new Set(
    Array.isArray(restoredDraft.lockedSections)
      ? restoredDraft.lockedSections.filter((i) => Number.isInteger(i) && i >= 0 && i < count)
      : []
  );

  // Bảo vệ chống F5 mở khóa lại các phần trước phần đang làm
  for (let i = 0; i < activeSectionIndex; i += 1) {
    lockedSet.add(i);
  }
  lockedSet.delete(activeSectionIndex);

  const savedRem = Array.isArray(restoredDraft.sectionRemainingSeconds)
    ? restoredDraft.sectionRemainingSeconds
    : [];

  const sectionRemainingSeconds = durations.map((maxSec, i) => {
    if (lockedSet.has(i)) return 0;
    const v = Number(savedRem[i]);
    if (Number.isFinite(v) && v >= 0) {
      return Math.min(maxSec, Math.round(v));
    }
    return maxSec;
  });

  return {
    strictSectionLock: Boolean(strictSectionLock),
    activeSectionIndex,
    lockedSections: Array.from(lockedSet).sort((a, b) => a - b),
    sectionRemainingSeconds,
    sectionDurations: durations,
    isFinished: lockedSet.size >= count,
  };
}

export function createSectionLockState({
  sections = [],
  strictSectionLock = true,
  restoredDraft = null,
} = {}) {
  return hydrateSectionLockDraft(sections, restoredDraft, strictSectionLock);
}

export function getSectionStatus(state, sectionIndex) {
  if (!state) return SECTION_STATES.ACTIVE;
  if (Array.isArray(state.lockedSections) && state.lockedSections.includes(sectionIndex)) {
    return SECTION_STATES.LOCKED_COMPLETED;
  }
  if (sectionIndex === state.activeSectionIndex) {
    return SECTION_STATES.ACTIVE;
  }
  if (sectionIndex < state.activeSectionIndex && state.strictSectionLock) {
    return SECTION_STATES.LOCKED_COMPLETED;
  }
  return state.strictSectionLock ? SECTION_STATES.LOCKED_UPCOMING : SECTION_STATES.ACTIVE;
}

export function canAccessSection(state, sectionIndex) {
  if (!state || !state.strictSectionLock) return true;
  if (state.isFinished) return false;
  if (Array.isArray(state.lockedSections) && state.lockedSections.includes(sectionIndex)) {
    return false;
  }
  return sectionIndex === state.activeSectionIndex;
}

export function canAccessQuestionIndex(state, sections = [], questionIndex = 0) {
  if (!state || !state.strictSectionLock) return true;
  if (state.isFinished) return false;
  const activeSec = sections[state.activeSectionIndex];
  if (!activeSec || !Array.isArray(activeSec.questionIndexes)) return false;
  return activeSec.questionIndexes.includes(questionIndex);
}

function advanceSectionInternal(state) {
  const count = state.sectionDurations.length;
  const prevIdx = state.activeSectionIndex;
  const lockedSet = new Set(state.lockedSections || []);
  lockedSet.add(prevIdx);

  const nextRemaining = [...state.sectionRemainingSeconds];
  nextRemaining[prevIdx] = 0;

  let nextIdx = -1;
  for (let i = prevIdx + 1; i < count; i += 1) {
    if (!lockedSet.has(i)) {
      nextIdx = i;
      break;
    }
  }

  if (nextIdx === -1) {
    return {
      nextState: {
        ...state,
        lockedSections: Array.from(lockedSet).sort((a, b) => a - b),
        sectionRemainingSeconds: nextRemaining,
        isFinished: true,
      },
      sectionAdvanced: false,
      previousSectionIndex: prevIdx,
      autoSubmit: true,
    };
  }

  return {
    nextState: {
      ...state,
      activeSectionIndex: nextIdx,
      lockedSections: Array.from(lockedSet).sort((a, b) => a - b),
      sectionRemainingSeconds: nextRemaining,
      isFinished: false,
    },
    sectionAdvanced: true,
    previousSectionIndex: prevIdx,
    autoSubmit: false,
  };
}

export function tickSectionTimer(state, deltaSeconds = 1) {
  if (!state || state.isFinished || !state.strictSectionLock) {
    return { nextState: state, sectionAdvanced: false, previousSectionIndex: state?.activeSectionIndex ?? 0, autoSubmit: false };
  }
  const idx = state.activeSectionIndex;
  const cur = Number(state.sectionRemainingSeconds[idx] ?? 0);
  const nextVal = Math.max(0, cur - Math.max(0, Number(deltaSeconds) || 0));

  if (nextVal <= 0) {
    return advanceSectionInternal(state);
  }

  const nextRemaining = [...state.sectionRemainingSeconds];
  nextRemaining[idx] = nextVal;
  return {
    nextState: {
      ...state,
      sectionRemainingSeconds: nextRemaining,
    },
    sectionAdvanced: false,
    previousSectionIndex: idx,
    autoSubmit: false,
  };
}

export function finishCurrentSectionEarly(state) {
  if (!state || state.isFinished) {
    return { nextState: state, sectionAdvanced: false, previousSectionIndex: state?.activeSectionIndex ?? 0, autoSubmit: true };
  }
  return advanceSectionInternal(state);
}

export function getActiveSectionRemainingSeconds(state) {
  if (!state || state.isFinished) return 0;
  return Math.max(0, Number(state.sectionRemainingSeconds?.[state.activeSectionIndex] ?? 0));
}

export function getTotalRemainingSeconds(state) {
  if (!state || !Array.isArray(state.sectionRemainingSeconds)) return 0;
  const locked = new Set(state.lockedSections || []);
  return state.sectionRemainingSeconds.reduce((sum, sec, idx) => (locked.has(idx) ? sum : sum + Math.max(0, sec)), 0);
}

export function isSectionTimeLow(state, thresholdSeconds = 120) {
  const activeRem = getActiveSectionRemainingSeconds(state);
  return activeRem > 0 && activeRem <= thresholdSeconds;
}

export function serializeSectionLockDraft(state) {
  if (!state) return {};
  return {
    activeSectionIndex: state.activeSectionIndex,
    lockedSections: Array.isArray(state.lockedSections) ? state.lockedSections : [],
    sectionRemainingSeconds: Array.isArray(state.sectionRemainingSeconds)
      ? state.sectionRemainingSeconds
      : [],
  };
}
