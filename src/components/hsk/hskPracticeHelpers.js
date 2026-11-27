import { HSK_7_TO_9_CODES, SHUFFLE_PREF_STORAGE_KEY } from './hskPracticeConstants.js';

export function readShufflePreference() {
  try {
    const saved = localStorage.getItem(SHUFFLE_PREF_STORAGE_KEY);
    if (saved === 'false') return false;
    if (saved === 'true') return true;
  } catch {}
  return true;
}

export function parseHskExamUrlParamsImpl() {
  if (typeof window === 'undefined') {
    return { level: 4, paperCode: null, autoStartHsk79: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  let rawLevel = searchParams.get('level');
  let rawPaper = searchParams.get('paper');

  if (window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.split('?')[1];
    const hashParams = new URLSearchParams(hashQuery);
    if (!rawLevel) rawLevel = hashParams.get('level');
    if (!rawPaper) rawPaper = hashParams.get('paper');
  }

  const normalizedPaper = rawPaper ? rawPaper.trim().toUpperCase() : null;
  const parsedLevel = Number(rawLevel);

  const isHsk79Paper = normalizedPaper && HSK_7_TO_9_CODES.has(normalizedPaper);
  const isHsk79Level = Number.isFinite(parsedLevel) && parsedLevel >= 7 && parsedLevel <= 9;

  return {
    level: isHsk79Level
      ? parsedLevel
      : isHsk79Paper
      ? 7
      : Number.isFinite(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 6
      ? parsedLevel
      : 4,
    paperCode: isHsk79Paper
      ? normalizedPaper
      : isHsk79Level
      ? `H7900${parsedLevel - 6}`
      : normalizedPaper,
    autoStartHsk79: Boolean(isHsk79Paper),
  };
}

export function formatExamTime(secs) {
  const safeSecs = Math.max(0, Number(secs) || 0);
  const m = Math.floor(safeSecs / 60);
  const s = safeSecs % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export function isSentenceReorderQuestion(q) {
  if (!q) return false;
  return (
    q.question_type === 'writing_reorder' ||
    q.question_type === 'reorder_sentence' ||
    (q.part_type === 'writing' &&
      q.question_type !== 'essay' &&
      q.question_type !== 'essay_summary' &&
      q.question_type !== 'free_writing' &&
      q.question_type !== 'translation' &&
      q.question_type !== 'speaking' &&
      ((Array.isArray(q.scrambledWords) && q.scrambledWords.length > 0) ||
        (Array.isArray(q.words) && q.words.length > 0)))
  );
}

export function isSubjectiveQuestion(q) {
  if (!q) return false;
  return (
    Boolean(q.isSubjective) ||
    q.question_type === 'essay' ||
    q.question_type === 'essay_summary' ||
    q.question_type === 'free_writing' ||
    q.question_type === 'translation' ||
    q.question_type === 'speaking'
  );
}

export function formatWritingCriterion(crit) {
  return typeof crit === 'string' ? crit : (crit?.name || '');
}

export function shouldShowMcqReviewOptions(q) {
  return Boolean(
    q &&
      !q.isSubjective &&
      q.questionType !== 'essay_summary' &&
      q.questionType !== 'free_writing' &&
      Array.isArray(q.options) &&
      q.options.length > 0
  );
}
