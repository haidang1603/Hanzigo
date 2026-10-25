/**
 * =========================================================================
 * 4-SKILL COMPETENCY ANALYTICS ENGINE — PURE MATHEMATICAL FORMULATION
 * =========================================================================
 * Nghiêm cấm hoàn toàn Math.random() và số liệu giả mạo.
 * Mọi chỉ số (thang điểm 0 - 100) được tính toán minh bạch từ dữ liệu học tập thực:
 * 
 * 1. Kỹ năng Nghe (Listening Score):
 *    - 40% Tỷ lệ hoàn thành Audio Comprehension (Step 5)
 *    - 40% Điểm trung bình phần Nghe trong các bài thi thử HSK
 *    - 20% Tần suất luyện phản xạ âm thanh không xem phụ đề
 * 
 * 2. Kỹ năng Nói (Speaking Score):
 *    - 50% Điểm phát âm trung bình từ pronunciationEvaluator (Step 6)
 *    - 50% Tỷ lệ hoàn thành nhiệm vụ đối thoại trong AI Roleplay Studio
 * 
 * 3. Kỹ năng Đọc & Từ vựng (Reading & Vocab Score):
 *    - 40% Độ phủ từ vựng SRS Mature (interval >= 7 ngày so với chuẩn cấp độ)
 *    - 40% Điểm trung bình phần Đọc hiểu trong Mock Exams
 *    - 20% Số lượng bài báo Smart Reader hoàn thành
 * 
 * 4. Kỹ năng Viết & Hán tự (Writing & Hanzi Score):
 *    - 60% Điểm chính xác nét bút trên InteractiveWritingPad (Step 7 + Writing Lab)
 *    - 40% Số lượng chữ Hán độc bản đã tập viết thành công
 * =========================================================================
 */

// Chuẩn số lượng từ vựng SRS Mature theo cấp độ HSK mục tiêu
export const HSK_MATURE_VOCAB_BENCHMARKS = {
  'HSK 1': 150,
  'HSK 2': 300,
  'HSK 3': 600,
  'HSK 4': 1200,
  'HSK 5': 2500,
  'HSK 6': 5000
};

// Chuẩn số chữ Hán viết theo cấp độ HSK
export const HSK_WRITING_CHAR_BENCHMARKS = {
  'HSK 1': 50,
  'HSK 2': 100,
  'HSK 3': 200,
  'HSK 4': 400,
  'HSK 5': 700,
  'HSK 6': 1000
};

/**
 * Giới hạn giá trị trong khoảng [min, max] an toàn, chống NaN
 */
function clamp(val, min = 0, max = 100) {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return min;
  return Math.min(max, Math.max(min, Math.round(val)));
}

/**
 * Tính điểm trung bình an toàn của một mảng số
 */
function safeAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const valid = numbers.filter(n => typeof n === 'number' && !isNaN(n) && isFinite(n));
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return sum / valid.length;
}

/**
 * Tính toán chỉ số 4 kỹ năng chuẩn hóa (0 - 100) từ dữ liệu thực tế
 */
export const COMPETENCY_ANALYTICS_DISCLAIMER =
  'Chỉ số năng lực học tập nội bộ HanziGo dựa trên tiến độ và bài tập thực tế. Không phải kết quả trắc nghiệm tâm lý học hoặc bài thi khảo thí chuẩn hóa quốc tế.';

export function calculate4SkillCompetency({
  targetLevel = 'HSK 1',
  // Dữ liệu Nghe (Listening)
  completedAudioSteps = 0,
  totalTargetAudioSteps = 20,
  examListeningScores = [],
  blindAudioSessionsCount = 0,
  // Dữ liệu Nói (Speaking)
  pronunciationScores = [],
  roleplayCompletedMissions = 0,
  roleplayTotalMissions = 0,
  // Dữ liệu Đọc (Reading & Vocab)
  matureSrsCardsCount = 0,
  examReadingScores = [],
  smartReaderCompletedArticles = 0,
  // Dữ liệu Viết (Writing & Hanzi)
  writingStrokeScores = [],
  uniqueCharsPracticedCount = 0
} = {}) {
  // -------------------------------------------------------------
  // 1. KỸ NĂNG NGHE (LISTENING SCORE: 0 - 100)
  // -------------------------------------------------------------
  const safeCompletedAudio = Math.max(0, Number(completedAudioSteps) || 0);
  const safeTargetAudio = Math.max(1, Number(totalTargetAudioSteps) || 20);
  const audioCompletionRatio = Math.min(1, Math.max(0, safeCompletedAudio / safeTargetAudio));
  const audioCompletionScore = audioCompletionRatio * 100;
  
  const validListeningScores = (Array.isArray(examListeningScores) ? examListeningScores : [])
    .map(Number)
    .filter(n => !isNaN(n) && isFinite(n) && n >= 0);
  const examListeningAvg = safeAverage(validListeningScores);
  const safeBlindCount = Math.max(0, Number(blindAudioSessionsCount) || 0);
  const blindAudioScore = Math.min(100, Math.max(0, (safeBlindCount / 10) * 100));

  let listeningScore = 0;
  const listeningSampleCount = safeCompletedAudio + validListeningScores.length + safeBlindCount;
  const hasListeningData = listeningSampleCount > 0;

  if (validListeningScores.length > 0) {
    listeningScore = (audioCompletionScore * 0.40) + (examListeningAvg * 0.40) + (blindAudioScore * 0.20);
  } else if (hasListeningData) {
    listeningScore = (audioCompletionScore * 0.70) + (blindAudioScore * 0.30);
  } else {
    listeningScore = 0;
  }

  const listeningStatus = !hasListeningData 
    ? 'no_data' 
    : listeningSampleCount < 3 
      ? 'insufficient_sample' 
      : 'reliable';

  // -------------------------------------------------------------
  // 2. KỸ NĂNG NÓI (SPEAKING SCORE: 0 - 100)
  // -------------------------------------------------------------
  const validPronounceScores = (Array.isArray(pronunciationScores) ? pronunciationScores : [])
    .map(Number)
    .filter(n => !isNaN(n) && isFinite(n) && n >= 0);
  const pronunciationAvg = safeAverage(validPronounceScores);

  const safeRoleplayCompleted = Math.max(0, Number(roleplayCompletedMissions) || 0);
  const safeRoleplayTotal = Math.max(0, Number(roleplayTotalMissions) || 0);
  const roleplayRatio = safeRoleplayTotal > 0 
    ? Math.min(1, Math.max(0, safeRoleplayCompleted / safeRoleplayTotal))
    : 0;
  const roleplayScore = roleplayRatio * 100;

  const speakingSampleCount = validPronounceScores.length + safeRoleplayCompleted;
  const hasSpeakingData = speakingSampleCount > 0;
  let speakingScore = 0;

  if (validPronounceScores.length > 0 && safeRoleplayTotal > 0) {
    speakingScore = (pronunciationAvg * 0.50) + (roleplayScore * 0.50);
  } else if (validPronounceScores.length > 0) {
    speakingScore = pronunciationAvg;
  } else if (safeRoleplayTotal > 0) {
    speakingScore = roleplayScore;
  } else {
    speakingScore = 0;
  }

  const speakingStatus = !hasSpeakingData 
    ? 'no_data' 
    : speakingSampleCount < 3 
      ? 'insufficient_sample' 
      : 'reliable';

  // -------------------------------------------------------------
  // 3. KỸ NĂNG ĐỌC & TỪ VỰNG (READING & VOCAB SCORE: 0 - 100)
  // -------------------------------------------------------------
  const targetVocab = HSK_MATURE_VOCAB_BENCHMARKS[targetLevel] || 150;
  const safeMatureCards = Math.max(0, Number(matureSrsCardsCount) || 0);
  const srsMasteryRatio = Math.min(1, Math.max(0, safeMatureCards / targetVocab));
  const srsMasteryScore = srsMasteryRatio * 100;

  const validReadingScores = (Array.isArray(examReadingScores) ? examReadingScores : [])
    .map(Number)
    .filter(n => !isNaN(n) && isFinite(n) && n >= 0);
  const examReadingAvg = safeAverage(validReadingScores);

  const safeArticles = Math.max(0, Number(smartReaderCompletedArticles) || 0);
  const smartReaderScore = Math.min(100, Math.max(0, (safeArticles / 10) * 100));

  const readingSampleCount = (safeMatureCards > 0 ? 1 : 0) + validReadingScores.length + safeArticles;
  const hasReadingData = readingSampleCount > 0;
  let readingScore = 0;

  if (validReadingScores.length > 0) {
    readingScore = (srsMasteryScore * 0.40) + (examReadingAvg * 0.40) + (smartReaderScore * 0.20);
  } else if (hasReadingData) {
    readingScore = (srsMasteryScore * 0.70) + (smartReaderScore * 0.30);
  } else {
    readingScore = 0;
  }

  const readingStatus = !hasReadingData 
    ? 'no_data' 
    : readingSampleCount < 3 
      ? 'insufficient_sample' 
      : 'reliable';

  // -------------------------------------------------------------
  // 4. KỸ NĂNG VIẾT & HÁN TỰ (WRITING & HANZI SCORE: 0 - 100)
  // -------------------------------------------------------------
  const validWritingScores = (Array.isArray(writingStrokeScores) ? writingStrokeScores : [])
    .map(Number)
    .filter(n => !isNaN(n) && isFinite(n) && n >= 0);
  const writingStrokeAvg = safeAverage(validWritingScores);

  const targetChars = HSK_WRITING_CHAR_BENCHMARKS[targetLevel] || 50;
  const safeCharsCount = Math.max(0, Number(uniqueCharsPracticedCount) || 0);
  const charVolumeRatio = Math.min(1, Math.max(0, safeCharsCount / targetChars));
  const charVolumeScore = charVolumeRatio * 100;

  const writingSampleCount = validWritingScores.length + (safeCharsCount > 0 ? 1 : 0);
  const hasWritingData = writingSampleCount > 0;
  let writingScore = 0;

  if (validWritingScores.length > 0) {
    writingScore = (writingStrokeAvg * 0.60) + (charVolumeScore * 0.40);
  } else if (hasWritingData) {
    writingScore = charVolumeScore * 0.80;
  } else {
    writingScore = 0;
  }

  const writingStatus = !hasWritingData 
    ? 'no_data' 
    : writingSampleCount < 3 
      ? 'insufficient_sample' 
      : 'reliable';

  const normalized = {
    listening: clamp(listeningScore),
    speaking: clamp(speakingScore),
    reading: clamp(readingScore),
    writing: clamp(writingScore)
  };

  const skillStatuses = {
    listening: { status: listeningStatus, hasData: hasListeningData, sampleCount: listeningSampleCount },
    speaking: { status: speakingStatus, hasData: hasSpeakingData, sampleCount: speakingSampleCount },
    reading: { status: readingStatus, hasData: hasReadingData, sampleCount: readingSampleCount },
    writing: { status: writingStatus, hasData: hasWritingData, sampleCount: writingSampleCount }
  };

  const activeScores = [
    hasListeningData ? normalized.listening : null,
    hasSpeakingData ? normalized.speaking : null,
    hasReadingData ? normalized.reading : null,
    hasWritingData ? normalized.writing : null
  ].filter(s => s !== null);

  const overall = clamp((normalized.listening + normalized.speaking + normalized.reading + normalized.writing) / 4);
  const evaluatedAverage = activeScores.length > 0 ? clamp(safeAverage(activeScores)) : 0;

  return {
    ...normalized,
    overall,
    evaluatedAverage,
    activeSkillsCount: activeScores.length,
    skillStatuses,
    targetLevel,
    benchmarks: {
      targetVocab,
      targetChars
    },
    disclaimer: COMPETENCY_ANALYTICS_DISCLAIMER
  };
}

// =========================================================================
// 5. ACTIONABLE STUDY PRESCRIPTIONS (LỘ TRÌNH KHẮC PHỤC ĐIỂM YẾU TỰ ĐỘNG)
// =========================================================================

export function generateStudyPrescriptions(competency = {}, targetLevel = 'HSK 1') {
  const skills = [
    { key: 'listening', name: 'Nghe hiểu', score: competency.listening || 0 },
    { key: 'speaking', name: 'Khẩu ngữ', score: competency.speaking || 0 },
    { key: 'reading', name: 'Đọc & Từ vựng', score: competency.reading || 0 },
    { key: 'writing', name: 'Viết & Hán tự', score: competency.writing || 0 }
  ];

  skills.sort((a, b) => a.score - b.score);
  const weakest = skills[0];
  const secondWeakest = skills[1];

  const prescriptions = [];

  // Khuyến nghị cho kỹ năng yếu nhất
  if (weakest.key === 'writing') {
    prescriptions.push({
      priority: 'high',
      skill: 'writing',
      title: 'Tăng cường phản xạ quy tắc bút thuận',
      description: `Kỹ năng Viết của bạn (${weakest.score}/100) đang thấp hơn các kỹ năng khác. Hãy luyện viết ngay 5 chữ Hán dễ nhầm nét trong ${targetLevel}.`,
      actionLabel: 'Luyện Viết Ngay',
      actionPath: '/writing',
      suggestedCount: 5,
      suggestedItems: ['你', '好', '我', '叫', '是']
    });
  } else if (weakest.key === 'speaking') {
    prescriptions.push({
      priority: 'high',
      skill: 'speaking',
      title: 'Luyện phản xạ âm và ngữ điệu tự nhiên',
      description: `Kỹ năng Nói của bạn (${weakest.score}/100) cần cải thiện thanh điệu (đặc biệt thanh 2 & thanh 3). Hãy thực hành 1 kịch bản đối thoại nhập vai.`,
      actionLabel: 'Vào AI Roleplay Studio',
      actionPath: '/conversation',
      suggestedScenario: 'sc-cafe-ordering'
    });
  } else if (weakest.key === 'listening') {
    prescriptions.push({
      priority: 'high',
      skill: 'listening',
      title: 'Luyện nghe phản xạ phân tầng (Audio Lab)',
      description: `Kỹ năng Nghe của bạn (${weakest.score}/100) đang cần bù đắp. Hãy hoàn thành 3 bài luyện nghe Step 5 không nhìn phụ đề pinyin.`,
      actionLabel: 'Luyện Nghe Bài Học',
      actionPath: '/learning-path',
      suggestedTarget: 3
    });
  } else if (weakest.key === 'reading') {
    prescriptions.push({
      priority: 'high',
      skill: 'reading',
      title: 'Củng cố trí nhớ dài hạn SRS Flashcard',
      description: `Kỹ năng Đọc & Từ vựng (${weakest.score}/100) cần thêm từ vựng Mature. Hãy hoàn thành phiên ôn tập thẻ SRS đến hạn hôm nay.`,
      actionLabel: 'Ôn Tập Flashcard SRS',
      actionPath: '/srs',
      suggestedTarget: 15
    });
  }

  // Khuyến nghị thứ hai
  if (secondWeakest.score < 70) {
    prescriptions.push({
      priority: 'medium',
      skill: secondWeakest.key,
      title: `Nâng tầm kỹ năng ${secondWeakest.name}`,
      description: `Kỹ năng ${secondWeakest.name} hiện đạt ${secondWeakest.score}/100. Hãy duy trì ít nhất 1 bài tập mỗi ngày để cân bằng năng lực 4 kỹ năng.`,
      actionLabel: 'Xem Thống Kê Chi Tiết',
      actionPath: '/profile'
    });
  }

  return {
    weakestSkill: weakest.key,
    prescriptions
  };
}

// =========================================================================
// 6. 365-DAY ACTIVITY HEATMAP GENERATOR (DỮ LIỆU BIỂU ĐỒ NHIỆT 365 NGÀY)
// =========================================================================

/**
 * Sinh lưới hoạt động 365 ngày cho 1 năm chỉ định (tương tự GitHub contribution graph).
 * activityMap: Record<YYYY-MM-DD, { count: number, xp: number }>
 */
export function generateActivityHeatmapData(activityMap = {}, year = new Date().getFullYear()) {
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));

  const days = [];
  let curr = new Date(startDate);

  while (curr <= endDate) {
    const y = curr.getUTCFullYear();
    const m = String(curr.getUTCMonth() + 1).padStart(2, '0');
    const d = String(curr.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const record = activityMap[dateStr] || { count: 0, xp: 0 };
    const xp = record.xp || 0;
    const count = record.count || 0;

    // Phân tầng mức độ tích cực (level 0 đến 4)
    let intensity = 0;
    if (xp >= 300 || count >= 5) intensity = 4;
    else if (xp >= 150 || count >= 3) intensity = 3;
    else if (xp >= 50 || count >= 2) intensity = 2;
    else if (xp > 0 || count > 0) intensity = 1;

    days.push({
      date: dateStr,
      dayOfWeek: curr.getUTCDay(), // 0 = CN, 1 = T2...
      count,
      xp,
      intensity
    });

    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return {
    year,
    totalDays: days.length,
    activeDays: days.filter(d => d.intensity > 0).length,
    totalXp: days.reduce((sum, d) => sum + d.xp, 0),
    days
  };
}
