import {
  evaluatePronunciationAttempt,
  type PronunciationAttemptResult,
} from '../../services/pronunciationLabService.ts';

export type HskkLevel = 'beginner' | 'intermediate' | 'advanced';
export type HskkTaskType = 'listen_and_repeat' | 'picture_description' | 'argumentative_question';

export interface HskkQuestion {
  id: string;
  level: HskkLevel;
  partLabel: string;
  taskType: HskkTaskType;
  promptZh: string;
  promptPinyin?: string;
  promptVi: string;
  expectedKeywords?: string[];
  recordDurationSeconds: number;
  imageHint?: string;
}

export interface HskkEvaluationResult {
  questionId: string;
  taskType: HskkTaskType;
  transcript: string;
  score: number; // 0..100
  pronunciationDetail?: PronunciationAttemptResult;
  feedbackVi: string;
}

export const HSKK_LEVEL_META: Record<
  HskkLevel,
  { title: string; subtitle: string; badgeClass: string }
> = {
  beginner: {
    title: 'HSKK Sơ cấp (初级)',
    subtitle: 'Nghe lặp lại câu · Nghe trả lời nhanh · Trả lời câu hỏi ngắn',
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  intermediate: {
    title: 'HSKK Trung cấp (中级)',
    subtitle: 'Nghe lặp lại · Mô tả tranh (看图说话) · Trả lời câu hỏi',
    badgeClass: 'bg-sky-100 text-sky-800',
  },
  advanced: {
    title: 'HSKK Cao cấp (高级)',
    subtitle: 'Nghe lặp lại đoạn dài · Đọc thành tiếng · Nghị luận chuyên sâu',
    badgeClass: 'bg-indigo-100 text-indigo-800',
  },
};

export const HSKK_SAMPLE_QUESTIONS: Record<HskkLevel, HskkQuestion[]> = {
  beginner: [
    {
      id: 'hskk-b-1',
      level: 'beginner',
      partLabel: 'Phần 1: Nghe và lặp lại (听后重复)',
      taskType: 'listen_and_repeat',
      promptZh: '今天天气真不错，我们一起去公园散步吧。',
      promptPinyin: 'Jīntiān tiānqì zhēn bùcuò, wǒmen yìqǐ qù gōngyuán sànbù ba.',
      promptVi: 'Thời tiết hôm nay thật đẹp, chúng ta cùng đi công viên tản bộ nhé.',
      recordDurationSeconds: 10,
    },
    {
      id: 'hskk-b-2',
      level: 'beginner',
      partLabel: 'Phần 3: Trả lời câu hỏi (回答问题)',
      taskType: 'argumentative_question',
      promptZh: '你周末一般喜欢做什么？为什么？',
      promptPinyin: 'Nǐ zhōumò yìbān xǐhuan zuò shénme? Wèishénme?',
      promptVi: 'Cuối tuần bạn thường thích làm gì? Tại sao?',
      expectedKeywords: ['周末', '喜欢', '因为', '朋友', '休息'],
      recordDurationSeconds: 20,
    },
  ],
  intermediate: [
    {
      id: 'hskk-i-1',
      level: 'intermediate',
      partLabel: 'Phần 1: Nghe và lặp lại (听后重复)',
      taskType: 'listen_and_repeat',
      promptZh: '虽然学习汉语的过程中会遇到困难，但只要坚持就一定能成功。',
      promptPinyin: 'Suīrán xuéxí Hànyǔ de guòchéng zhōng huì yùdào kùnnan, dàn zhǐyào jiānchí jiù yídìng néng chénggōng.',
      promptVi: 'Tuy trong quá trình học tiếng Trung sẽ gặp khó khăn, chỉ cần kiên trì nhất định sẽ thành công.',
      recordDurationSeconds: 12,
    },
    {
      id: 'hskk-i-2',
      level: 'intermediate',
      partLabel: 'Phần 2: Mô tả tranh (看图说话)',
      taskType: 'picture_description',
      promptZh: '请结合图片内容，用汉语描述图中人物正在做什么。',
      promptVi: 'Tranh: Một gia đình 3 người đang cùng nấu bữa tối vui vẻ trong gian bếp ấm cúng.',
      imageHint: 'Gia đình cùng chuẩn bị bữa tối trong bếp (做饭, 厨房, 开心, 家庭)',
      expectedKeywords: ['厨房', '做饭', '开心', '一起', '家庭'],
      recordDurationSeconds: 30,
    },
  ],
  advanced: [
    {
      id: 'hskk-a-1',
      level: 'advanced',
      partLabel: 'Phần 1: Nghe và lặp lại đoạn văn (听后复述)',
      taskType: 'listen_and_repeat',
      promptZh: '真正的成长并不是没有遇到过挫折，而是在经历风雨后依然保持热爱生活的勇气。',
      promptPinyin: 'Zhēnzhèng de chéngzhǎng bìng bùshì méiyǒu yùdào guo cuòzhé, érshì zài jīnglì fēngyǔ hòu yīrán bǎochí rèài shēnghuó de yǒngqì.',
      promptVi: 'Sự trưởng thành thực sự không phải là chưa từng gặp trắc trở, mà là vẫn giữ được dũng khí yêu đời sau giông bão.',
      recordDurationSeconds: 15,
    },
    {
      id: 'hskk-a-2',
      level: 'advanced',
      partLabel: 'Phần 3: Nghị luận quan điểm (回答问题)',
      taskType: 'argumentative_question',
      promptZh: '有人认为人工智能会取代很多传统职业，你怎么看？',
      promptPinyin: 'Yǒurén rènwéi réngōng zhìnéng huì qǔdài hěnduō chuántǒng zhíyè, nǐ zěnme kàn?',
      promptVi: 'Có người cho rằng AI sẽ thay thế nhiều nghề truyền thống, bạn nghĩ sao?',
      expectedKeywords: ['人工智能', '效率', '取代', '创造', '认为'],
      recordDurationSeconds: 45,
    },
  ],
};

/**
 * Phát âm thanh "Beep" báo hiệu bắt đầu thu âm qua Web Audio API
 */
export function playBeepTone(frequency = 880, durationMs = 220): void {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // ignore audio context errors in restricted environments
  }
}

/**
 * Chấm điểm phần thi nói HSKK kết nối Pronunciation Lab (27.07) & Rubric AI
 */
export function gradeHskkSpeakingResponse(
  question: HskkQuestion,
  transcript: string,
  userContour?: number[]
): HskkEvaluationResult {
  const clean = (transcript || '').trim();
  if (!clean) {
    return {
      questionId: question.id,
      taskType: question.taskType,
      transcript: '',
      score: 0,
      feedbackVi: 'Chưa ghi nhận được giọng nói hoặc văn bản trả lời.',
    };
  }

  if (question.taskType === 'listen_and_repeat') {
    const targetChars = (question.promptZh.match(/[\u4e00-\u9fa5]/g) || []);
    const spokenChars = (clean.match(/[\u4e00-\u9fa5]/g) || []);
    const matchedCount = targetChars.filter((ch) => spokenChars.includes(ch)).length;
    const hanziMatchPct =
      targetChars.length > 0 ? Math.round((matchedCount / targetChars.length) * 100) : 100;

    const contourLen = Math.max(12, targetChars.length * 4);
    const effectiveContour =
      userContour && userContour.length > 0
        ? userContour
        : Array.from({ length: contourLen }, (_, i) =>
            hanziMatchPct >= 80 ? 3 + Math.sin(i * 0.5) * 1.2 : 2.5
          );

    const pronResult = evaluatePronunciationAttempt({
      drill: {
        id: question.id,
        category: 'sentence',
        hsk_level: question.level === 'beginner' ? 2 : question.level === 'intermediate' ? 4 : 6,
        hanzi: question.promptZh,
        pinyin_underlying: question.promptPinyin || '',
        pinyin_surface: question.promptPinyin || '',
        meaning_vi: question.promptVi,
        reference_pitch_contour: [],
        focus_points: [],
      },
      userContour: effectiveContour,
    });

    const toneWeight = userContour && userContour.length > 0 ? 0.5 : 0.15;
    const combinedScore = Math.round(
      hanziMatchPct * (1 - toneWeight) + pronResult.tone_score * toneWeight
    );
    return {
      questionId: question.id,
      taskType: question.taskType,
      transcript: clean,
      score: combinedScore,
      pronunciationDetail: pronResult,
      feedbackVi: `Độ chuẩn tổng thể: ${combinedScore}/100 (Thanh điệu: ${pronResult.tone_score}%, Khớp chữ Hán: ${hanziMatchPct}%).`,
    };
  }

  // Mô tả tranh & Nghị luận
  const hanziCount = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  const kws = question.expectedKeywords || [];
  const matchedKws = kws.filter((k) => clean.includes(k));
  const kwScore = kws.length > 0 ? Math.round((matchedKws.length / kws.length) * 50) : 40;
  const fluencyScore = Math.min(50, Math.round((hanziCount / 35) * 50));
  const score = Math.min(100, kwScore + fluencyScore);

  return {
    questionId: question.id,
    taskType: question.taskType,
    transcript: clean,
    score,
    feedbackVi: `Khớp ${matchedKws.length}/${kws.length} ý trọng tâm (${hanziCount} âm tiết tiếng Trung). ${
      score >= 75
        ? 'Diễn đạt tự nhiên, đủ ý!'
        : 'Nên mở rộng thêm ví dụ và liên từ (因为, 所以, 首先, 此外) để đạt điểm cao.'
    }`,
  };
}
