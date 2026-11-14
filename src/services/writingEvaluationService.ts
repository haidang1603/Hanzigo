/**
 * =========================================================================
 * HANZIGO — HSK WRITING & TRANSLATION EVALUATION (TASK 26.05)
 * =========================================================================
 * Automated, rubric-aligned grading for HSK 4-6 constructed-response tasks:
 *   - HSK 4: 连词成句 (Reorder) & 看图用词造句 (Picture + Keyword Sentence)
 *   - HSK 5: 结合词汇写80字短文 (5 Mandatory Words) & 看图写80字短文
 *   - HSK 6: 缩写 (10m Reading ~1000 chars -> 35m Objective Summary ~400 chars)
 *
 * Integrates with Task 26.01 (`recordLearningEvent` -> `learning_telemetry_events`
 * & `user_mistake_records`).
 * =========================================================================
 */

import {
  recordLearningEvent,
  type ErrorCategory,
  type NormalizedLearningEvent,
  type UserMistakeRecord,
} from './learningDataService.ts';

export type HskWritingTaskType =
  | 'hsk4_reorder'
  | 'hsk4_picture_keyword'
  | 'hsk5_keywords_essay'
  | 'hsk5_picture_essay'
  | 'hsk6_summary';

export interface HskWritingTaskPrompt {
  id: string;
  taskType: HskWritingTaskType;
  hskLevel: 4 | 5 | 6;
  title: string;
  instructionVi: string;
  promptText: string;
  mandatoryKeywords: string[];
  targetMinChars: number;
  targetMaxChars: number;
  passageText?: string; // Used for HSK 6 缩写 reading phase
}

export interface WritingEvaluationDimensions {
  task_fulfillment: number; // 0..25
  grammar_accuracy: number; // 0..25
  vocabulary_richness: number; // 0..25
  coherence_cohesion: number; // 0..25
}

export interface InlineCorrection {
  id: string;
  original_span: string;
  corrected_span: string;
  error_category: ErrorCategory;
  explanation_vi: string;
  hsk_grammar_point: string;
}

export interface ModelRewrites {
  band_pass: string;
  high_scoring_native: string;
}

export interface DeterministicPreCheckResult {
  cjkCharCount: number;
  totalCharCount: number;
  withinLengthRange: boolean;
  usedKeywords: string[];
  missingKeywords: string[];
  subjectiveMarkersFound: string[];
  hasSentenceEndPunctuation: boolean;
  detectedIssues: InlineCorrection[];
}

export interface WritingEvaluationResult {
  taskId: string;
  taskType: HskWritingTaskType;
  hskLevel: 4 | 5 | 6;
  overall_score: number; // 0..100
  official_hsk_writing_score: number; // 0..100 sub-score scale
  dimensions: WritingEvaluationDimensions;
  inline_corrections: InlineCorrection[];
  model_rewrites: ModelRewrites;
  precheck: DeterministicPreCheckResult;
  evaluationSource: 'ai_gateway' | 'deterministic_rubric';
  telemetryEvent?: NormalizedLearningEvent;
  mistakeRecordsCreated?: UserMistakeRecord[];
}

export interface WritingEvaluationInput {
  user?: { id?: string | null } | null;
  task: HskWritingTaskPrompt;
  responseText: string;
  durationMs?: number;
  aiRawResponse?: unknown; // Optional injected or fetched AI JSON response
}

const SUBJECTIVE_MARKERS_HSK6 = [
  '我认为',
  '我觉得',
  '在我看来',
  '对我来说',
  '我个人觉得',
  '我相信',
];

const DISCOURSE_MARKERS = [
  '因为',
  '所以',
  '虽然',
  '但是',
  '不过',
  '然而',
  '首先',
  '其次',
  '最后',
  '因此',
  '不仅',
  '而且',
  '于是',
  '后来',
];

export const HSK_WRITING_PROMPTS: HskWritingTaskPrompt[] = [
  {
    id: 'w_hsk4_reorder_1',
    taskType: 'hsk4_reorder',
    hskLevel: 4,
    title: 'HSK 4 · 连词成句 (Sắp xếp từ thành câu)',
    instructionVi: 'Sắp xếp các từ sau thành một câu tiếng Trung hoàn chỉnh, đúng ngữ pháp.',
    promptText: '把 / 桌子上的 / 请 / 拿给我 / 那本词典',
    mandatoryKeywords: ['把', '桌子上的', '请', '拿给我', '那本词典'],
    targetMinChars: 10,
    targetMaxChars: 24,
  },
  {
    id: 'w_hsk4_pic_1',
    taskType: 'hsk4_picture_keyword',
    hskLevel: 4,
    title: 'HSK 4 · 看图用词造句 (Đặt câu theo từ khóa & ngữ cảnh)',
    instructionVi: 'Viết 1 câu hoàn chỉnh miêu tả tình huống hai người bạn đang ôn bài trong thư viện có sử dụng từ khóa "认真".',
    promptText: 'Từ khóa bắt buộc: 认真 (Chăm chú / Nghiêm túc). Ngữ cảnh: Hai sinh viên đang đọc sách ở thư viện.',
    mandatoryKeywords: ['认真'],
    targetMinChars: 8,
    targetMaxChars: 40,
  },
  {
    id: 'w_hsk5_kw_1',
    taskType: 'hsk5_keywords_essay',
    hskLevel: 5,
    title: 'HSK 5 · 结合词汇写80字短文 (Đoạn văn ~80 chữ với 5 từ bắt buộc)',
    instructionVi: 'Viết đoạn văn khoảng 80 chữ Hán sử dụng đầy đủ 5 từ vựng bắt buộc dưới đây.',
    promptText: 'Từ vựng bắt buộc: 坚持 (kiên trì), 经验 (kinh nghiệm), 鼓励 (khích lệ), 克服 (khắc phục), 收获 (thu hoạch).',
    mandatoryKeywords: ['坚持', '经验', '鼓励', '克服', '收获'],
    targetMinChars: 60,
    targetMaxChars: 120,
  },
  {
    id: 'w_hsk5_pic_1',
    taskType: 'hsk5_picture_essay',
    hskLevel: 5,
    title: 'HSK 5 · 看图写80字短文 (Viết đoạn văn ~80 chữ theo tranh)',
    instructionVi: 'Quan sát bối cảnh nhân viên văn phòng làm việc khuya và nhận được tách trà ấm từ đồng nghiệp; viết đoạn văn khoảng 80 chữ.',
    promptText: 'Bối cảnh: Trời tối muộn tại văn phòng, đồng nghiệp mang trà nóng đến động viên bạn hoàn thành dự án.',
    mandatoryKeywords: [],
    targetMinChars: 60,
    targetMaxChars: 120,
  },
  {
    id: 'w_hsk6_sum_1',
    taskType: 'hsk6_summary',
    hskLevel: 6,
    title: 'HSK 6 · 缩写 (Tóm tắt ~400 chữ sau 10 phút đọc)',
    instructionVi: 'Đọc kỹ đoạn văn trong 10 phút, sau đó ẩn văn bản và tóm tắt lại cốt truyện chính trong khoảng 400 chữ (không thêm bình luận chủ quan).',
    promptText: 'Nhấn "Bắt đầu đọc 10:00" để đọc bài, sau đó chuyển sang pha viết 35:00.',
    mandatoryKeywords: ['林先生', '旧书店', '笔记本'],
    targetMinChars: 280,
    targetMaxChars: 500,
    passageText:
      '在一条安静的老街尽头，林先生经营着一家已经开了三十年的旧书店。书店不大，木质书架从地面一直延伸到天花板，空气中总是弥漫着淡淡的纸墨香气。随着电子阅读的普及，来光顾实体书店的年轻人越来越少，书店的营业额逐年下降。邻居们都劝林先生把店面租出去改做咖啡馆，但林先生始终舍不得那些陪伴了自己半辈子的旧书。一天傍晚，一位名叫小周的大学生走进书店，想寻找一本二十年前出版的建筑设计手册。林先生戴上老花镜，在角落的高架上翻找了半个小时，终于找到了那本略微泛黄的书。小周激动地翻看时，突然从书页间滑落出一本蓝色封面的旧笔记本。两人打开一看，里面密密麻麻记录着一位老建筑师当年修复古桥的心得与手绘草图，扉页上还留着一个早已搬迁的联系方式。小周认出那是自己已故祖父的笔迹——原来祖父年轻时曾在这里买书，却不慎把最珍贵的研究笔记夹在了书里。林先生没有丝毫犹豫，决定将笔记本无偿归还给小周一家。消息传开后，当地媒体报道了这个温暖的故事，许多市民和建筑系学生慕名而来。小周也主动利用周末帮书店整理目录、建立线上书单。渐渐地，老书店重新焕发了生机，成为街区里最受欢迎的文化角落。',
  },
];

export function countChineseCharacters(text: string): number {
  const matches = String(text || '').match(/[\u4e00-\u9fff]/g);
  return matches ? matches.length : 0;
}

/**
 * Deterministic pre-checks executed prior to/alongside AI rubric grading:
 * - CJK character count compliance
 * - Mandatory keyword usage (HSK 4/5/6)
 * - HSK 6 subjective opinion marker detection
 * - Rule-based 病句 (word order, 把/被, aspect particles, punctuation) checks
 */
export function runDeterministicPreChecks(
  task: HskWritingTaskPrompt,
  responseText: string
): DeterministicPreCheckResult {
  const text = String(responseText || '').trim();
  const cjkCharCount = countChineseCharacters(text);
  const totalCharCount = text.length;
  const withinLengthRange =
    cjkCharCount >= task.targetMinChars && cjkCharCount <= task.targetMaxChars;

  const usedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const kw of task.mandatoryKeywords) {
    if (text.includes(kw)) {
      usedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const subjectiveMarkersFound =
    task.taskType === 'hsk6_summary'
      ? SUBJECTIVE_MARKERS_HSK6.filter((marker) => text.includes(marker))
      : [];

  const hasSentenceEndPunctuation = /[。！？]$/.test(text);
  const detectedIssues: InlineCorrection[] = [];

  // 1. Subjective commentary in HSK 6 缩写
  if (subjectiveMarkersFound.length > 0) {
    detectedIssues.push({
      id: `pre_subj_${Date.now()}`,
      original_span: subjectiveMarkersFound[0],
      corrected_span: '(Lược bỏ đại từ chủ quan, tường thuật khách quan)',
      error_category: 'translation_omission',
      explanation_vi:
        'Bài tóm tắt HSK 6 (缩写) tuyệt đối không dùng lời bình luận chủ quan như "我认为/我觉得". Hãy giữ giọng văn khách quan của tác giả.',
      hsk_grammar_point: 'HSK 6 缩写 · 客观叙述原则',
    });
  }

  // 2. Common aspect particle collision: 了 + 过 or 着 + 了 directly adjacent
  const particleMatch = text.match(/([了过着])\1|了过|过着了/);
  if (particleMatch) {
    detectedIssues.push({
      id: `pre_aspect_${Date.now()}`,
      original_span: particleMatch[0],
      corrected_span: particleMatch[0][0],
      error_category: 'word_order_syntax',
      explanation_vi:
        'Không ghép chồng các trợ từ động thái 了/过/着 liền nhau. Chỉ giữ lại trợ từ phù hợp với thì của hành động.',
      hsk_grammar_point: '动态助词 (了/过/着) 误用',
    });
  }

  // 3. 把 construction check: "把" followed immediately by punctuation or end of sentence
  const baIncomplete = text.match(/把[^，。！？]{0,1}[，。！？]/);
  if (baIncomplete) {
    detectedIssues.push({
      id: `pre_ba_${Date.now()}`,
      original_span: baIncomplete[0],
      corrected_span: '把 + [Tân ngữ] + [Động từ] + [Thành phần khác]',
      error_category: 'word_order_syntax',
      explanation_vi:
        'Câu chữ 把 bắt buộc phải có tân ngữ xác định đứng sau 把 và động từ phía sau phải kèm thành phần bổ ngữ/trợ từ (了, 到, 给...).',
      hsk_grammar_point: '把字句结构',
    });
  }

  // 4. Missing sentence-ending punctuation
  if (cjkCharCount >= 4 && !hasSentenceEndPunctuation) {
    detectedIssues.push({
      id: `pre_punct_${Date.now()}`,
      original_span: text.slice(-4),
      corrected_span: `${text.slice(-4)}。`,
      error_category: 'word_order_syntax',
      explanation_vi: 'Câu hoặc đoạn văn tiếng Trung cần kết thúc bằng dấu câu chuẩn (。/！/？).',
      hsk_grammar_point: '中文标点符号规范',
    });
  }

  return {
    cjkCharCount,
    totalCharCount,
    withinLengthRange,
    usedKeywords,
    missingKeywords,
    subjectiveMarkersFound,
    hasSentenceEndPunctuation,
    detectedIssues,
  };
}

function clampDim(val: unknown, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(25, Math.max(0, Math.round(num)));
}

function normalizeErrorCategory(raw: unknown): ErrorCategory {
  const val = String(raw || '').trim();
  const valid: ErrorCategory[] = [
    'tone_confusion',
    'radical_stroke_error',
    'synonym_nuance',
    'word_order_syntax',
    'listening_homophone',
    'reading_inference',
    'translation_omission',
  ];
  return valid.includes(val as ErrorCategory)
    ? (val as ErrorCategory)
    : 'word_order_syntax';
}

function computeDeterministicRubric(
  task: HskWritingTaskPrompt,
  responseText: string,
  precheck: DeterministicPreCheckResult
): Omit<WritingEvaluationResult, 'taskId' | 'taskType' | 'hskLevel' | 'precheck' | 'evaluationSource'> {
  const text = responseText.trim();
  if (precheck.cjkCharCount === 0) {
    return {
      overall_score: 0,
      official_hsk_writing_score: 0,
      dimensions: {
        task_fulfillment: 0,
        grammar_accuracy: 0,
        vocabulary_richness: 0,
        coherence_cohesion: 0,
      },
      inline_corrections: precheck.detectedIssues,
      model_rewrites: {
        band_pass: 'Vui lòng nhập nội dung tiếng Trung để nhận bài mẫu đối chiếu.',
        high_scoring_native: 'Vui lòng nhập nội dung tiếng Trung để nhận bài mẫu nâng cao.',
      },
    };
  }

  // 1. Task fulfillment (0..25)
  let taskFulfillment = 18;
  if (!precheck.withinLengthRange) {
    const ratio =
      precheck.cjkCharCount < task.targetMinChars
        ? precheck.cjkCharCount / Math.max(1, task.targetMinChars)
        : task.targetMaxChars / Math.max(1, precheck.cjkCharCount);
    taskFulfillment = Math.max(6, Math.round(18 * Math.min(1, ratio)));
  } else {
    taskFulfillment = 22;
  }
  if (task.mandatoryKeywords.length > 0) {
    const kwRatio =
      precheck.usedKeywords.length / task.mandatoryKeywords.length;
    taskFulfillment = Math.min(
      25,
      Math.max(4, Math.round(taskFulfillment * (0.4 + 0.6 * kwRatio)))
    );
  }
  if (precheck.subjectiveMarkersFound.length > 0) {
    taskFulfillment = Math.max(5, taskFulfillment - 6);
  }

  // 2. Grammar accuracy (0..25)
  const grammarPenalty = Math.min(15, precheck.detectedIssues.length * 4);
  const grammarAccuracy = Math.max(8, 22 - grammarPenalty);

  // 3. Vocabulary richness (0..25)
  const uniqueChars = new Set(Array.from(text.match(/[\u4e00-\u9fff]/g) ?? [])).size;
  const lexicalRatio = precheck.cjkCharCount > 0 ? uniqueChars / precheck.cjkCharCount : 0;
  const vocabRichness = Math.min(
    24,
    Math.max(10, Math.round(14 + lexicalRatio * 10))
  );

  // 4. Coherence & cohesion (0..25)
  const discourseHits = DISCOURSE_MARKERS.filter((m) => text.includes(m)).length;
  const hasComma = /[，、]/.test(text);
  const coherenceCohesion = Math.min(
    24,
    Math.max(
      9,
      14 +
        Math.min(6, discourseHits * 2) +
        (hasComma ? 2 : 0) +
        (precheck.hasSentenceEndPunctuation ? 2 : 0)
    )
  );

  const overall =
    taskFulfillment + grammarAccuracy + vocabRichness + coherenceCohesion;

  const bandPassRewrite =
    task.taskType === 'hsk4_reorder'
      ? '请把桌子上的那本词典拿给我。'
      : precheck.missingKeywords.length > 0
      ? `（Gợi ý bổ sung đầy đủ từ khóa: ${precheck.missingKeywords.join('、')}）${text}${precheck.hasSentenceEndPunctuation ? '' : '。'}`
      : `${text}${precheck.hasSentenceEndPunctuation ? '' : '。'}`;

  const highNativeRewrite =
    task.taskType === 'hsk4_reorder'
      ? '麻烦您把桌子上的那本词典递给我，谢谢！'
      : task.taskType === 'hsk5_keywords_essay'
      ? '在学习汉语的过程中，我遇到了不少困难。幸运的是，老师和朋友一直鼓励我坚持下去。通过不断积累经验、克服语法和词汇上的挑战，我终于收获了明显的进步和自信。'
      : task.taskType === 'hsk6_summary'
      ? '林先生经营三十年的旧书店因电子阅读冲击而生意冷清，但他舍不得放弃。一天，大学生小周在店里买旧书时，意外发现书中夹着已故祖父的建筑笔记。林先生毫不犹豫地将笔记无偿归还。媒体报道后，书店重新吸引了众多读者，小周也主动帮忙整理书单，使老书店重现生机。'
      : bandPassRewrite;

  return {
    overall_score: overall,
    official_hsk_writing_score: overall,
    dimensions: {
      task_fulfillment: taskFulfillment,
      grammar_accuracy: grammarAccuracy,
      vocabulary_richness: vocabRichness,
      coherence_cohesion: coherenceCohesion,
    },
    inline_corrections: precheck.detectedIssues,
    model_rewrites: {
      band_pass: bandPassRewrite,
      high_scoring_native: highNativeRewrite,
    },
  };
}

/**
 * Resilient JSON parser for AI rubric grading responses.
 * Falls back cleanly to deterministic rubric scoring if JSON is malformed or missing.
 */
export function parseWritingEvaluationResponse(
  rawResponse: unknown,
  task: HskWritingTaskPrompt,
  responseText: string,
  precheck: DeterministicPreCheckResult
): Omit<WritingEvaluationResult, 'taskId' | 'taskType' | 'hskLevel' | 'precheck'> {
  const fallback = computeDeterministicRubric(task, responseText, precheck);

  if (!rawResponse) {
    return { ...fallback, evaluationSource: 'deterministic_rubric' };
  }

  let parsed: Record<string, unknown> | null = null;
  if (typeof rawResponse === 'object' && !Array.isArray(rawResponse)) {
    parsed = rawResponse as Record<string, unknown>;
  } else if (typeof rawResponse === 'string') {
    const cleaned = rawResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      const candidate = JSON.parse(cleaned);
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        parsed = candidate as Record<string, unknown>;
      }
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
        } catch {
          parsed = null;
        }
      }
    }
  }

  if (!parsed || typeof parsed.dimensions !== 'object' || !parsed.dimensions) {
    return { ...fallback, evaluationSource: 'deterministic_rubric' };
  }

  const rawDims = parsed.dimensions as Record<string, unknown>;
  const dimensions: WritingEvaluationDimensions = {
    task_fulfillment: clampDim(
      rawDims.task_fulfillment,
      fallback.dimensions.task_fulfillment
    ),
    grammar_accuracy: clampDim(
      rawDims.grammar_accuracy,
      fallback.dimensions.grammar_accuracy
    ),
    vocabulary_richness: clampDim(
      rawDims.vocabulary_richness,
      fallback.dimensions.vocabulary_richness
    ),
    coherence_cohesion: clampDim(
      rawDims.coherence_cohesion,
      fallback.dimensions.coherence_cohesion
    ),
  };

  // Enforce deterministic penalties for missing mandatory keywords or HSK 6 subjective opinion
  if (precheck.missingKeywords.length > 0) {
    dimensions.task_fulfillment = Math.min(
      dimensions.task_fulfillment,
      Math.max(5, 25 - precheck.missingKeywords.length * 4)
    );
  }
  if (precheck.subjectiveMarkersFound.length > 0) {
    dimensions.task_fulfillment = Math.max(0, dimensions.task_fulfillment - 5);
  }

  const overall =
    dimensions.task_fulfillment +
    dimensions.grammar_accuracy +
    dimensions.vocabulary_richness +
    dimensions.coherence_cohesion;

  const aiCorrections: InlineCorrection[] = Array.isArray(parsed.inline_corrections)
    ? parsed.inline_corrections
        .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
        .map((c, idx) => ({
          id: `ai_corr_${idx}_${Date.now()}`,
          original_span: String(c.original_span ?? ''),
          corrected_span: String(c.corrected_span ?? ''),
          error_category: normalizeErrorCategory(c.error_category),
          explanation_vi: String(c.explanation_vi ?? 'Cần điều chỉnh diễn đạt tự nhiên hơn.'),
          hsk_grammar_point: String(c.hsk_grammar_point ?? `HSK ${task.hskLevel} Grammar`),
        }))
    : [];

  // Merge AI corrections + deterministic precheck issues (deduped by original_span)
  const seenSpans = new Set(aiCorrections.map((c) => c.original_span));
  const mergedCorrections = [
    ...aiCorrections,
    ...precheck.detectedIssues.filter((d) => !seenSpans.has(d.original_span)),
  ];

  const rawRewrites = (parsed.model_rewrites ?? {}) as Record<string, unknown>;
  const model_rewrites: ModelRewrites = {
    band_pass:
      typeof rawRewrites.band_pass === 'string' && rawRewrites.band_pass.trim()
        ? rawRewrites.band_pass.trim()
        : fallback.model_rewrites.band_pass,
    high_scoring_native:
      typeof rawRewrites.high_scoring_native === 'string' &&
      rawRewrites.high_scoring_native.trim()
        ? rawRewrites.high_scoring_native.trim()
        : fallback.model_rewrites.high_scoring_native,
  };

  return {
    overall_score: overall,
    official_hsk_writing_score: overall,
    dimensions,
    inline_corrections: mergedCorrections,
    model_rewrites,
    evaluationSource: 'ai_gateway',
  };
}

/**
 * Push a single inline correction into Task 26.01 `user_mistake_records`
 * and telemetry pipeline.
 */
export async function addCorrectionToMistakeNotebook(params: {
  user?: { id?: string | null } | null;
  task: HskWritingTaskPrompt;
  correction: InlineCorrection;
}): Promise<UserMistakeRecord | null> {
  const res = await recordLearningEvent({
    userId: params.user?.id ?? null,
    sourceModule: 'writing_eval',
    hskLevel: params.task.hskLevel,
    skillDomain: params.task.taskType === 'hsk6_summary' ? 'translation' : 'writing',
    itemId: `${params.task.id}_${params.correction.hsk_grammar_point}`,
    isCorrect: false,
    scoreEarned: 0,
    scoreMax: 1,
    userAnswer: params.correction.original_span,
    expectedAnswer: params.correction.corrected_span,
    payload: {
      targetEntityId: `${params.task.id}:${params.correction.hsk_grammar_point}`,
      errorHint: params.correction.error_category,
      explanationVi: params.correction.explanation_vi,
      missingKeywords:
        params.correction.error_category === 'translation_omission'
          ? [params.correction.corrected_span]
          : undefined,
    },
  });

  return res.mistakeRecord;
}

/**
 * Full multi-dimensional evaluation pipeline:
 * 1. Runs deterministic length/keyword/HSK6-objectivity/病句 pre-checks.
 * 2. Parses AI rubric response (with resilient deterministic fallback).
 * 3. Logs normalized `writing_eval` event to `learning_telemetry_events` &
 *    auto-pushes inline corrections to `user_mistake_records`.
 */
export async function evaluateHskWriting(
  input: WritingEvaluationInput
): Promise<WritingEvaluationResult> {
  const precheck = runDeterministicPreChecks(input.task, input.responseText);

  let aiRaw = input.aiRawResponse;
  if (aiRaw === undefined && input.responseText.trim() && typeof fetch !== 'undefined') {
    try {
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'writing',
          task: input.task,
          responseText: input.responseText,
        }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload?.success && payload?.result) {
          aiRaw = payload.result;
        }
      }
    } catch {
      // Fallback gracefully to deterministic rubric
    }
  }

  const graded = parseWritingEvaluationResponse(
    aiRaw,
    input.task,
    input.responseText,
    precheck
  );

  const isPassing = graded.overall_score >= 60;
  const telemetryRes = await recordLearningEvent({
    userId: input.user?.id ?? null,
    sourceModule: 'writing_eval',
    hskLevel: input.task.hskLevel,
    skillDomain: 'writing',
    itemId: input.task.id,
    isCorrect: isPassing,
    scoreEarned: graded.overall_score,
    scoreMax: 100,
    durationMs: input.durationMs ?? 0,
    userAnswer: input.responseText,
    expectedAnswer: graded.model_rewrites.band_pass,
    payload: {
      taskType: input.task.taskType,
      cjkCharCount: precheck.cjkCharCount,
      missingKeywords: precheck.missingKeywords,
      dimensions: graded.dimensions,
    },
  });

  const mistakeRecordsCreated: UserMistakeRecord[] = [];
  if (telemetryRes.mistakeRecord) {
    mistakeRecordsCreated.push(telemetryRes.mistakeRecord);
  }

  for (const corr of graded.inline_corrections) {
    const rec = await addCorrectionToMistakeNotebook({
      user: input.user,
      task: input.task,
      correction: corr,
    });
    if (rec) mistakeRecordsCreated.push(rec);
  }

  return {
    taskId: input.task.id,
    taskType: input.task.taskType,
    hskLevel: input.task.hskLevel,
    ...graded,
    precheck,
    telemetryEvent: telemetryRes.event,
    mistakeRecordsCreated,
  };
}

