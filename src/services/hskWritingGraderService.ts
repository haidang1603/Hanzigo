import { countChineseSummaryChars, detectDirectQuotes } from '../features/hsk-exam/renderers/hsk6/hsk6StateMachine.ts';

export interface Hsk4SentenceGradeInput {
  questionNumber?: number;
  hskLevel?: 3 | 4;
  targetKeyword: string;
  pictureKeywords: string[];
  pictureDescriptionVi?: string;
  userSentence: string;
}

export interface Hsk4SentenceGradeResult {
  maxScore: 8;
  score: number;
  breakdown: {
    keywordUsed: boolean;
    keywordScore: number; // /3
    pictureMatchScore: number; // /3
    grammarScore: number; // /2
  };
  matchedPictureKeywords: string[];
  feedbackVi: string[];
}

export interface Hsk5EssayGradeResult {
  questionNumber: 99 | 100;
  maxScore: 30;
  score: number;
  charCount: number;
  missingKeywords?: string[];
  coherenceScore: number;
  lengthStatus: 'optimal' | 'too_short' | 'too_long';
  feedbackVi: string[];
}

export interface Hsk6PlotPoint {
  id: string;
  labelVi: string;
  keywords: string[]; // các từ khóa cốt lõi đại diện cho mốc cốt truyện
}

export interface Hsk6SummaryGradeInput {
  title: string;
  summary: string;
  keyPlotPoints: Hsk6PlotPoint[];
}

export interface Hsk6SummaryPenalty {
  code: 'MISSING_TITLE' | 'DIRECT_QUOTE' | 'PERSONAL_OPINION' | 'LENGTH_OUT_OF_RANGE';
  pointsDeducted: number;
  reasonVi: string;
}

export interface Hsk6SummaryGradeResult {
  maxScore: 100;
  score: number;
  rawPlotScore: number;
  charCount: number;
  matchedPlotPoints: string[];
  missedPlotPoints: string[];
  penalties: Hsk6SummaryPenalty[];
  feedbackVi: string[];
}

const COHERENCE_CONNECTORS = [
  '因为',
  '所以',
  '虽然',
  '但是',
  '不过',
  '然而',
  '于是',
  '因此',
  '不仅',
  '而且',
  '首先',
  '然后',
  '最后',
  '终于',
  '后来',
  '为了',
  '如果',
  '只要',
];

const PERSONAL_OPINION_PATTERNS = [
  '我认为',
  '我觉得',
  '在我看来',
  '我个人认为',
  '这个故事告诉我们',
  '这篇故事告诉我们',
  '由此可见',
  '我们应该',
  '我们必须',
  '对我来说',
];

/**
 * HSK 3 & 4 (Câu 96–100): Chấm câu theo từ khóa + bức tranh (thang 8 điểm/câu)
 */
export function gradeHsk4SentenceWriting(
  input: Hsk4SentenceGradeInput
): Hsk4SentenceGradeResult {
  const sentence = (input.userSentence || '').trim();
  const feedbackVi: string[] = [];

  if (!sentence) {
    return {
      maxScore: 8,
      score: 0,
      breakdown: {
        keywordUsed: false,
        keywordScore: 0,
        pictureMatchScore: 0,
        grammarScore: 0,
      },
      matchedPictureKeywords: [],
      feedbackVi: ['Chưa nhập câu trả lời.'],
    };
  }

  // 1. Kiểm tra từ khóa bắt buộc (3 điểm)
  const keywordUsed = input.targetKeyword
    ? sentence.includes(input.targetKeyword.trim())
    : true;
  const keywordScore = keywordUsed ? 3 : 0;
  if (!keywordUsed) {
    feedbackVi.push(`Thiếu từ khóa bắt buộc "${input.targetKeyword}".`);
  }

  // 2. Kiểm tra độ khớp ngữ cảnh bức tranh (3 điểm)
  const matchedPictureKeywords = (input.pictureKeywords || []).filter((kw) =>
    kw && sentence.includes(kw.trim())
  );
  let pictureMatchScore = 0;
  if ((input.pictureKeywords || []).length === 0) {
    pictureMatchScore = 3;
  } else if (matchedPictureKeywords.length >= 2) {
    pictureMatchScore = 3;
  } else if (matchedPictureKeywords.length === 1) {
    pictureMatchScore = 2;
    feedbackVi.push('Câu đã chạm 1 chi tiết trong tranh, nên mô tả thêm hành động/bối cảnh.');
  } else {
    pictureMatchScore = 0;
    feedbackVi.push(
      `Nội dung câu chưa khớp rõ với chi tiết trong tranh (${input.pictureDescriptionVi || input.pictureKeywords.join(', ')}).`
    );
  }

  // 3. Kiểm tra ngữ pháp & độ hoàn chỉnh câu HSK 3-4 (2 điểm)
  const hanziCount = (sentence.match(/[\u4e00-\u9fa5]/g) || []).length;
  const hasEndPunctuation = /[。！？.!?]$/.test(sentence);
  let grammarScore = 0;
  if (hanziCount >= 5 && hasEndPunctuation) {
    grammarScore = 2;
  } else if (hanziCount >= 4) {
    grammarScore = 1;
    if (!hasEndPunctuation) {
      feedbackVi.push('Nhớ kết thúc câu bằng dấu chấm (。) hoặc dấu chấm hỏi/chấm than.');
    }
  } else {
    feedbackVi.push('Câu quá ngắn hoặc chưa thành cấu trúc Chủ - Vị hoàn chỉnh.');
  }

  const score = Math.min(8, keywordScore + pictureMatchScore + grammarScore);
  if (score >= 7 && feedbackVi.length === 0) {
    feedbackVi.push('Câu chuẩn ngữ pháp, dùng đúng từ khóa và sát với bức tranh!');
  }

  return {
    maxScore: 8,
    score,
    breakdown: {
      keywordUsed,
      keywordScore,
      pictureMatchScore,
      grammarScore,
    },
    matchedPictureKeywords,
    feedbackVi,
  };
}

/**
 * HSK 5 Câu 99: Viết đoạn văn 75–90 chữ kết nối 5 từ khóa (thang 30 điểm)
 */
export function gradeHsk5KeywordEssay(params: {
  keywords: string[];
  userEssay: string;
}): Hsk5EssayGradeResult {
  const essay = (params.userEssay || '').trim();
  const charCount = countChineseSummaryChars(essay);
  const feedbackVi: string[] = [];

  const missingKeywords = (params.keywords || []).filter(
    (kw) => kw && !essay.includes(kw.trim())
  );
  const foundCount = Math.max(0, (params.keywords || []).length - missingKeywords.length);
  const keywordPoints = Math.round((foundCount / Math.max(1, params.keywords.length)) * 12);

  if (missingKeywords.length > 0) {
    feedbackVi.push(`Còn thiếu ${missingKeywords.length} từ khóa: ${missingKeywords.join(', ')}.`);
  }

  // Đánh giá tính liên kết mạch lạc (Coherence: tối đa 10đ)
  const connectorHits = COHERENCE_CONNECTORS.filter((c) => essay.includes(c)).length;
  const sentenceCount = essay.split(/[。！？]/).filter((s) => s.trim().length > 0).length;
  let coherenceScore = 0;
  if (connectorHits >= 2 && sentenceCount >= 2 && sentenceCount <= 6) {
    coherenceScore = 10;
  } else if (connectorHits >= 1 && sentenceCount >= 2) {
    coherenceScore = 7;
    feedbackVi.push('Nên dùng thêm 1–2 liên từ (因此, 虽然...但是..., 于是) để đoạn văn mượt mà hơn.');
  } else {
    coherenceScore = 4;
    feedbackVi.push('Đoạn văn rời rạc, tránh ghép 5 câu đơn lẻ không có mạch nối.');
  }

  // Đánh giá độ dài chuẩn 75–90 chữ (tối đa 8đ)
  let lengthStatus: 'optimal' | 'too_short' | 'too_long' = 'optimal';
  let lengthPoints = 8;
  if (charCount < 65) {
    lengthStatus = 'too_short';
    lengthPoints = charCount < 40 ? 2 : 5;
    feedbackVi.push(`Bài viết hơi ngắn (${charCount} chữ). Mục tiêu HSK 5 câu 99 là 75–90 chữ.`);
  } else if (charCount > 105) {
    lengthStatus = 'too_long';
    lengthPoints = 5;
    feedbackVi.push(`Bài viết hơi dài (${charCount} chữ). Nên cô đọng trong khoảng 75–90 chữ.`);
  } else if (charCount < 75 || charCount > 90) {
    lengthPoints = 7;
  }

  const score = Math.min(30, keywordPoints + coherenceScore + lengthPoints);
  if (score >= 26 && feedbackVi.length === 0) {
    feedbackVi.push('Xuất sắc! Dùng đủ 5 từ khóa với mạch văn tự nhiên và độ dài chuẩn.');
  }

  return {
    questionNumber: 99,
    maxScore: 30,
    score,
    charCount,
    missingKeywords,
    coherenceScore,
    lengthStatus,
    feedbackVi,
  };
}

/**
 * HSK 5 Câu 100: Viết đoạn văn dựa trên bức tranh (thang 30 điểm)
 */
export function gradeHsk5PictureEssay(params: {
  pictureElements: string[];
  userEssay: string;
}): Hsk5EssayGradeResult {
  const essay = (params.userEssay || '').trim();
  const charCount = countChineseSummaryChars(essay);
  const feedbackVi: string[] = [];

  const matchedElements = (params.pictureElements || []).filter(
    (el) => el && essay.includes(el.trim())
  );
  const picturePoints =
    params.pictureElements.length === 0
      ? 12
      : Math.round((matchedElements.length / params.pictureElements.length) * 12);

  if (matchedElements.length < Math.ceil((params.pictureElements || []).length / 2)) {
    feedbackVi.push('Cần mô tả rõ hơn bối cảnh và nhân vật/vật thể chính trong tranh.');
  }

  // Suy luận nguyên nhân / kết quả / cảm xúc (tối đa 10đ)
  const reasoningHits = ['因为', '所以', '为了', '结果', '感到', '决定', '通过', '终于'].filter((w) =>
    essay.includes(w)
  ).length;
  const coherenceScore = reasoningHits >= 2 ? 10 : reasoningHits === 1 ? 7 : 4;
  if (reasoningHits === 0) {
    feedbackVi.push('Nên bổ sung suy luận nguyên nhân – kết quả hoặc cảm xúc để bài viết có chiều sâu.');
  }

  let lengthStatus: 'optimal' | 'too_short' | 'too_long' = 'optimal';
  let lengthPoints = 8;
  if (charCount < 65) {
    lengthStatus = 'too_short';
    lengthPoints = charCount < 40 ? 2 : 5;
    feedbackVi.push(`Bài viết hơi ngắn (${charCount} chữ). Nên viết khoảng 75–95 chữ.`);
  } else if (charCount > 110) {
    lengthStatus = 'too_long';
    lengthPoints = 5;
    feedbackVi.push(`Bài viết hơi dài (${charCount} chữ). Nên giữ trong khoảng 75–95 chữ.`);
  }

  const score = Math.min(30, picturePoints + coherenceScore + lengthPoints);
  return {
    questionNumber: 100,
    maxScore: 30,
    score,
    charCount,
    coherenceScore,
    lengthStatus,
    feedbackVi,
  };
}

/**
 * HSK 6 Câu 101: Chấm bài tóm tắt 400 chữ đối chiếu 6 mốc cốt truyện (thang 100 điểm)
 */
export function gradeHsk6SummaryEssay(input: Hsk6SummaryGradeInput): Hsk6SummaryGradeResult {
  const title = (input.title || '').trim();
  const summary = (input.summary || '').trim();
  const charCount = countChineseSummaryChars(summary);
  const feedbackVi: string[] = [];
  const penalties: Hsk6SummaryPenalty[] = [];

  // 1. Đối chiếu 6 mốc cốt truyện (100 điểm gốc)
  const matchedPlotPoints: string[] = [];
  const missedPlotPoints: string[] = [];

  const totalPlots = Math.max(1, input.keyPlotPoints.length);
  for (const plot of input.keyPlotPoints) {
    const hit = plot.keywords.some((kw) => kw && summary.includes(kw.trim()));
    if (hit) {
      matchedPlotPoints.push(plot.labelVi);
    } else {
      missedPlotPoints.push(plot.labelVi);
    }
  }

  const rawPlotScore = Math.round((matchedPlotPoints.length / totalPlots) * 100);
  if (missedPlotPoints.length > 0) {
    feedbackVi.push(`Bị sót ${missedPlotPoints.length} mốc cốt truyện: ${missedPlotPoints.join('; ')}.`);
  }

  // 2. Các khoản trừ điểm theo Rubric chuẩn HSK 6
  if (!title) {
    penalties.push({
      code: 'MISSING_TITLE',
      pointsDeducted: 5,
      reasonVi: 'Thiếu tiêu đề bài viết (-5đ).',
    });
  }

  const directQuotes = detectDirectQuotes(summary);
  if (directQuotes.length > 0) {
    penalties.push({
      code: 'DIRECT_QUOTE',
      pointsDeducted: 10,
      reasonVi: 'Chép câu đối thoại trực tiếp trong ngoặc kép thay vì trần thuật gián tiếp (-10đ).',
    });
  }

  const opinionHit = PERSONAL_OPINION_PATTERNS.find((pat) => summary.includes(pat));
  if (opinionHit) {
    penalties.push({
      code: 'PERSONAL_OPINION',
      pointsDeducted: 10,
      reasonVi: `Thêm ý kiến bình luận cá nhân ("${opinionHit}") không có trong bài gốc (-10đ).`,
    });
  }

  if (charCount < 350 || charCount > 450) {
    const pointsDeducted = charCount < 200 ? 25 : 10;
    penalties.push({
      code: 'LENGTH_OUT_OF_RANGE',
      pointsDeducted,
      reasonVi: `Độ dài (${charCount} chữ) lệch khỏi khung chuẩn 350–450 chữ (-${pointsDeducted}đ).`,
    });
  }

  for (const p of penalties) {
    feedbackVi.push(p.reasonVi);
  }

  const totalPenalty = penalties.reduce((sum, p) => sum + p.pointsDeducted, 0);
  const score = Math.max(0, Math.min(100, rawPlotScore - totalPenalty));

  if (score >= 85 && penalties.length === 0) {
    feedbackVi.push('Bài tóm tắt bám sát 6 mốc cốt truyện, văn phong khách quan và đúng chuẩn HSK 6!');
  }

  return {
    maxScore: 100,
    score,
    rawPlotScore,
    charCount,
    matchedPlotPoints,
    missedPlotPoints,
    penalties,
    feedbackVi,
  };
}

