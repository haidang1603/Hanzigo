import { VOCABULARY_LIST } from '../../data/chineseData';
import {
  calculateNextSrsReview,
  SRS_QUALITY,
  calculateSrsStats,
  isCardDueForReview,
} from '../../utils/srsEngine';
import { HSK_LEVEL_TARGETS } from './vocabularyConstants';

export function stripPinyinTones(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/gi, 'u')
    .toLowerCase();
}

export function matchesVocabSearchQuery(item, q) {
  if (!q) return true;
  const qNoTone = stripPinyinTones(q);
  return (
    (item.hanzi && item.hanzi.toLowerCase().includes(q)) ||
    (item.pinyin &&
      (item.pinyin.toLowerCase().includes(q) ||
        stripPinyinTones(item.pinyin).includes(qNoTone))) ||
    (item.meaning && item.meaning.toLowerCase().includes(q)) ||
    (item.hanviet && item.hanviet.toLowerCase().includes(q))
  );
}

// Helper chuẩn hóa dữ liệu từ vựng từ mọi nguồn (Local, HSK 3.0 Corpus, CC-CEDICT, Supabase)
export function normalizeVocab(item) {
  if (!item) return null;
  const hanziVal = item.hanzi || item.simplified || item.word || '';
  if (!hanziVal) return null;

  let exampleObj = null;
  if (item.example) {
    if (typeof item.example === 'object' && (item.example.hanzi || item.example.zh)) {
      exampleObj = {
        hanzi: item.example.hanzi || item.example.zh,
        pinyin: item.example.pinyin || '',
        meaning: item.example.meaning || item.example.vi || '',
      };
    } else if (typeof item.example === 'string' && item.example.trim()) {
      exampleObj = {
        hanzi: item.example,
        pinyin: item.examplePinyin || item.example_pinyin || '',
        meaning: item.exampleMeaning || item.example_meaning || '',
      };
    }
  } else if (item.example_hanzi) {
    exampleObj = {
      hanzi: item.example_hanzi,
      pinyin: item.example_pinyin || '',
      meaning: item.example_meaning || '',
    };
  }

  return {
    id: String(item.id || `vocab-${hanziVal}`),
    hanzi: hanziVal,
    traditional: item.traditional || hanziVal,
    pinyin: item.pinyin || item.pinyin_display || item.pinyin_tone || '',
    hanviet: item.hanviet || item.han_viet || '',
    pos: item.pos || '',
    meaning: item.meaning || item.meaningVi || item.meaning_vi || '',
    en: item.en || item.meaningEn || '',
    level:
      item.level ||
      item.hsk ||
      (item.hsk_level
        ? Number(item.hsk_level) >= 7
          ? 'HSK 7-9'
          : `HSK ${item.hsk_level}`
        : 'HSK 1'),
    topic: item.topic || 'Đời sống',
    radical: item.radical || item.decomposition?.radical || '—',
    strokes:
      Number(item.strokes) ||
      Number(item.strokeCount) ||
      Number(item.decomposition?.stroke_count) ||
      hanziVal.length * 6,
    mnemonic:
      item.mnemonic ||
      item.memoryTip ||
      item.personal_mnemonic ||
      'Ghi nhớ cấu trúc bộ thủ và hình tượng của chữ.',
    example: exampleObj,
    isCustom: !!(
      item.isCustom ||
      item.is_custom ||
      (item.example && item.example.is_custom) ||
      (typeof item.topic === 'string' &&
        (item.topic.startsWith('Tự thêm') || item.topic.startsWith('Custom')))
    ),
  };
}

export function buildInitialVocabList(getStoredCustomVocab, getLocalHsk79Flashcards) {
  try {
    const custom = getStoredCustomVocab();
    const normalizedCustom = (Array.isArray(custom) ? custom : [])
      .map(normalizeVocab)
      .filter(Boolean);
    const normalizedStatic = VOCABULARY_LIST.map(normalizeVocab).filter(Boolean);
    const normalizedHsk79 = getLocalHsk79Flashcards()
      .map(normalizeVocab)
      .filter(Boolean);
    const map = new Map();
    normalizedStatic.forEach((item) => map.set(item.hanzi, item));
    normalizedHsk79.forEach((item) => {
      if (!map.has(item.hanzi)) map.set(item.hanzi, item);
    });
    normalizedCustom.forEach((item) => map.set(item.hanzi, item));
    return Array.from(map.values());
  } catch (e) {
    console.error('Error loading vocabulary list:', e);
    return VOCABULARY_LIST.map(normalizeVocab).filter(Boolean);
  }
}

export function computeHskCounts(allVocabList) {
  const counts = {
    'HSK 1': 0,
    'HSK 2': 0,
    'HSK 3': 0,
    'HSK 4': 0,
    'HSK 5': 0,
    'HSK 6': 0,
    'HSK 5-6': 0,
    'HSK 7-9': 0,
  };
  allVocabList.forEach((v) => {
    const lvl = v.level || 'HSK 1';
    if (/^HSK\s+[789]/.test(lvl) || lvl === 'HSK 7-9') {
      counts['HSK 7-9'] = (counts['HSK 7-9'] || 0) + 1;
    } else if (counts[lvl] !== undefined) {
      counts[lvl] = (counts[lvl] || 0) + 1;
    } else {
      counts[lvl] = 1;
    }
  });
  return counts;
}

export function computeVocabSrsStats(allVocabList, srsMap) {
  const cards = allVocabList.map((v) => ({
    ...v,
    ...(srsMap[v.hanzi] || {}),
  }));
  return calculateSrsStats(cards);
}

export function computeHskLevelProgress(allVocabList, rememberedIds, reviewIds, srsMap) {
  const rememberedSet = new Set(rememberedIds);
  const reviewSet = new Set(reviewIds);

  return HSK_LEVEL_TARGETS.map((tier) => {
    const wordsInTier = allVocabList.filter((item) => {
      if (!item) return false;
      if (tier.id === 'HSK 7-9') {
        return item.level === 'HSK 7-9' || /^HSK\s+[789]/.test(item.level || '');
      }
      if (tier.id === 'HSK 6') {
        return item.level === 'HSK 6' || item.level === 'HSK 5-6';
      }
      return item.level === tier.id;
    });

    let mastered = 0;
    let learning = 0;
    let dueToday = 0;

    wordsInTier.forEach((w) => {
      const srsCard = srsMap[w.hanzi];
      if (rememberedSet.has(w.id) || srsCard?.stage === 2) {
        mastered += 1;
      } else if (reviewSet.has(w.id) || srsCard?.stage === 1) {
        learning += 1;
      }
      if (srsCard && isCardDueForReview(srsCard)) {
        dueToday += 1;
      }
    });

    const denominator = Math.max(wordsInTier.length, tier.target);
    const masteredPct = Math.min(100, Math.round((mastered / denominator) * 100));
    const learningPct = Math.min(
      100 - masteredPct,
      Math.round((learning / denominator) * 100)
    );

    return {
      ...tier,
      loadedCount: wordsInTier.length,
      denominator,
      mastered,
      learning,
      dueToday,
      masteredPct,
      learningPct,
    };
  });
}

export function matchesVocabStatusAndLength(
  item,
  {
    corpusMode,
    isPersonalStatusFilter,
    isTopicFiltering,
    q,
    selectedHsk,
    statusFilter,
    hideMastered,
    lengthFilter,
    rememberedIds,
    reviewIds,
    srsMap,
  }
) {
  const matchesSearch =
    corpusMode && !isPersonalStatusFilter && !isTopicFiltering && !q
      ? true
      : matchesVocabSearchQuery(item, q);

  const matchesHsk =
    (corpusMode && !isPersonalStatusFilter && !isTopicFiltering) || selectedHsk === 'all'
      ? true
      : selectedHsk === 'HSK 5-6'
      ? item.level === 'HSK 5-6' || item.level === 'HSK 5' || item.level === 'HSK 6'
      : selectedHsk === 'HSK 7-9'
      ? item.level === 'HSK 7-9' || /^HSK\s+[789]/.test(item.level || '')
      : item.level === selectedHsk;

  let matchesStatus = true;
  const isMasteredCard =
    rememberedIds.includes(item.id) ||
    srsMap[item.hanzi]?.stage === 2 ||
    ((srsMap[item.hanzi]?.repetitions || 0) >= 1 && !reviewIds.includes(item.id));

  if (statusFilter === 'all' && hideMastered) {
    matchesStatus = !isMasteredCard;
  } else if (statusFilter === 'remembered') {
    matchesStatus = isMasteredCard;
  } else if (statusFilter === 'review') {
    matchesStatus = reviewIds.includes(item.id) || srsMap[item.hanzi]?.stage === 1;
  } else if (statusFilter === 'custom') {
    matchesStatus = !!item.isCustom;
  } else if (statusFilter === 'srs_priority') {
    matchesStatus = !isMasteredCard;
  } else if (statusFilter === 'due') {
    matchesStatus = !isMasteredCard && isCardDueForReview(srsMap[item.hanzi] || item);
  } else if (statusFilter === 'leeches') {
    matchesStatus =
      (srsMap[item.hanzi]?.lapseCount || srsMap[item.hanzi]?.lapse_count || 0) >= 3;
  }

  let matchesLength = true;
  if (lengthFilter === 'single') {
    matchesLength = item.hanzi.length === 1;
  } else if (lengthFilter === 'compound') {
    matchesLength = item.hanzi.length > 1;
  }

  return matchesSearch && matchesHsk && matchesStatus && matchesLength;
}

export function sortDueCardsFirst(matched, statusFilter, srsMap) {
  if (statusFilter === 'srs_priority' || statusFilter === 'due' || statusFilter === 'all') {
    return [...matched].sort((a, b) => {
      const aDue = srsMap[a.hanzi] && isCardDueForReview(srsMap[a.hanzi]) ? 1 : 0;
      const bDue = srsMap[b.hanzi] && isCardDueForReview(srsMap[b.hanzi]) ? 1 : 0;
      return bDue - aDue;
    });
  }
  return matched;
}

export function computeSrsPreview(currentCard, srsMap) {
  if (!currentCard) {
    return {
      againLabel: 'Học lại ngay',
      hardLabel: '12 giờ',
      goodLabel: '1 ngày',
      easyLabel: '4 ngày',
    };
  }
  const cur = srsMap[currentCard.hanzi] || {
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.5,
  };
  const reps = cur.repetitions || 0;
  const isNewCard = reps === 0;
  const isSecondRep = reps === 1;
  const hardDays = calculateNextSrsReview(cur, SRS_QUALITY.HARD).intervalDays;
  const goodDays = calculateNextSrsReview(cur, SRS_QUALITY.GOOD).intervalDays;
  const easyDays = calculateNextSrsReview(cur, SRS_QUALITY.EASY).intervalDays;

  return {
    againLabel: 'Học lại ngay',
    hardLabel: isNewCard ? '12 giờ' : isSecondRep ? '4 ngày' : `${hardDays} ngày`,
    goodLabel: `${goodDays} ngày`,
    easyLabel: isNewCard ? '4 ngày' : isSecondRep ? '8 ngày' : `${easyDays} ngày`,
  };
}

export function buildQuizOptions(currentCard, allVocabList, corpusCards) {
  if (!currentCard) return [];
  const correctMeaning = currentCard.meaning;
  const pool = [...allVocabList, ...corpusCards];
  const otherMeanings = pool
    .filter((item) => item && item.id !== currentCard.id && item.meaning !== correctMeaning)
    .map((item) => item.meaning);

  if (otherMeanings.length === 0) return [correctMeaning];

  const charCodeSum = (currentCard.hanzi || '')
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const distractor1 = otherMeanings[charCodeSum % otherMeanings.length];
  const distractor2 = otherMeanings[(charCodeSum + 3) % otherMeanings.length];
  const distractor3 = otherMeanings[(charCodeSum + 7) % otherMeanings.length];

  const uniqueDistractors = Array.from(
    new Set([distractor1, distractor2, distractor3])
  ).filter((m) => m && m !== correctMeaning);

  const position = charCodeSum % (uniqueDistractors.length + 1);
  const result = [...uniqueDistractors];
  result.splice(position, 0, correctMeaning);
  return result;
}

export function exportVocabListToCsv(filteredVocab) {
  if (!filteredVocab || filteredVocab.length === 0) return;

  const headers = [
    'Chữ Hán (Giản thể)',
    'Chữ Phồn thể',
    'Pinyin',
    'Hán-Việt',
    'Từ loại',
    'Nghĩa tiếng Việt',
    'Tiếng Anh (CC-CEDICT)',
    'Cấp độ',
    'Chủ đề',
    'Bộ thủ',
    'Số nét',
    'Chiết tự',
    'Ví dụ',
  ];
  const rows = filteredVocab.map((v) => [
    `"${v.hanzi}"`,
    `"${v.traditional || v.hanzi}"`,
    `"${v.pinyin}"`,
    `"${v.hanviet}"`,
    `"${v.pos || ''}"`,
    `"${(v.meaning || '').replace(/"/g, '""')}"`,
    `"${(v.en || '').replace(/"/g, '""')}"`,
    `"${v.level}"`,
    `"${v.topic}"`,
    `"${v.radical}"`,
    `"${v.strokes}"`,
    `"${(v.mnemonic || '').replace(/"/g, '""')}"`,
    `"${(v.example?.hanzi || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `hanzigo-tu-vung-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
