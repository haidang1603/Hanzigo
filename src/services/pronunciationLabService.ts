import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { recordLearningEvent } from './learningDataService.ts';
import {
  applyMandarinToneSandhi,
  generateReferencePitchContour,
} from '../utils/toneSandhiEngine.ts';

export type PronunciationCategory =
  | 'initials_finals'
  | 'tone_pairs'
  | 'tone_sandhi'
  | 'minimal_pairs'
  | 'sentence_shadowing';

export type SyllableErrorType =
  | 'wrong_tone'
  | 'missing_aspiration'
  | 'retroflex_error';

export interface PronunciationDrill {
  id: string;
  category: PronunciationCategory;
  hsk_level: number;
  hanzi: string;
  pinyin_underlying: string;
  pinyin_surface: string;
  meaning_vi: string;
  phonetic_focus: string;
  articulation_tip_vi: string;
  reference_pitch_contour: number[];
}

export interface SyllableDiagnostic {
  char: string;
  pinyin_surface: string;
  expected_tone: number;
  detected_tone: number;
  score: number;
  error_type?: SyllableErrorType;
  diagnostic_vi: string;
}

export interface PronunciationAttemptResult {
  overall_score: number;
  initial_final_score: number;
  tone_score: number;
  fluency_score: number;
  syllable_breakdown: SyllableDiagnostic[];
  reference_contour: number[];
  user_contour: number[];
}

const ATTEMPTS_STORAGE_KEY = 'hanzigo_pronunciation_lab_attempts_v1';

function buildDrill(params: {
  id: string;
  category: PronunciationCategory;
  hsk_level: number;
  hanzi: string;
  pinyin_underlying: string;
  meaning_vi: string;
  phonetic_focus: string;
  articulation_tip_vi: string;
}): PronunciationDrill {
  const sandhi = applyMandarinToneSandhi(params.hanzi, params.pinyin_underlying);
  const surfaceTones = sandhi.syllables.map((s) => s.surfaceTone);
  return {
    ...params,
    pinyin_surface: sandhi.surfacePinyin,
    reference_pitch_contour: generateReferencePitchContour(surfaceTones),
  };
}

const BUILT_IN_DRILLS: PronunciationDrill[] = [
  buildDrill({
    id: 'drill-sandhi-nihao',
    category: 'tone_sandhi',
    hsk_level: 1,
    hanzi: '你好',
    pinyin_underlying: 'nǐ hǎo',
    meaning_vi: 'Xin chào',
    phonetic_focus: 'Biến điệu 3 + 3 → 2 + 3',
    articulation_tip_vi: 'Chữ 你 đọc vút lên thành thanh 2 (ní), chữ 好 giữ thanh 3 trầm.',
  }),
  buildDrill({
    id: 'drill-sandhi-bushi',
    category: 'tone_sandhi',
    hsk_level: 1,
    hanzi: '不是',
    pinyin_underlying: 'bù shì',
    meaning_vi: 'Không phải',
    phonetic_focus: 'Biến điệu 不 trước thanh 4',
    articulation_tip_vi: '不 (bù) đứng trước thanh 4 (shì) phải đọc thành thanh 2 (bú shì), âm sh uốn lưỡi.',
  }),
  buildDrill({
    id: 'drill-sandhi-yiding',
    category: 'tone_sandhi',
    hsk_level: 2,
    hanzi: '一定',
    pinyin_underlying: 'yī dìng',
    meaning_vi: 'Nhất định',
    phonetic_focus: 'Biến điệu 一 trước thanh 4',
    articulation_tip_vi: '一 (yī) đứng trước thanh 4 (dìng) đọc vút lên thành thanh 2 (yí dìng).',
  }),
  buildDrill({
    id: 'drill-sandhi-yiban',
    category: 'tone_sandhi',
    hsk_level: 3,
    hanzi: '一般',
    pinyin_underlying: 'yī bān',
    meaning_vi: 'Thông thường, bình thường',
    phonetic_focus: 'Biến điệu 一 trước thanh 1',
    articulation_tip_vi: '一 (yī) đứng trước thanh 1 (bān) hạ xuống thành thanh 4 (yì bān).',
  }),
  buildDrill({
    id: 'drill-initials-qiche',
    category: 'initials_finals',
    hsk_level: 2,
    hanzi: '汽车',
    pinyin_underlying: 'qì chē',
    meaning_vi: 'Xe ô tô',
    phonetic_focus: 'Âm bật hơi q & ch uốn lưỡi',
    articulation_tip_vi: 'Âm q đặt mặt lưỡi chạm ngạc cứng và bật hơi mạnh; âm ch uốn đầu lưỡi về phía sau.',
  }),
  buildDrill({
    id: 'drill-minimal-zhidao',
    category: 'minimal_pairs',
    hsk_level: 2,
    hanzi: '知道',
    pinyin_underlying: 'zhī dào',
    meaning_vi: 'Biết',
    phonetic_focus: 'zh (uốn lưỡi) vs z (thẳng lưỡi)',
    articulation_tip_vi: 'Đầu lưỡi cong chạm phần trước ngạc cứng khi phát âm zhī, tránh đọc bẹt thành zī.',
  }),
  buildDrill({
    id: 'drill-shadowing-henhao',
    category: 'sentence_shadowing',
    hsk_level: 2,
    hanzi: '我很好',
    pinyin_underlying: 'wǒ hěn hǎo',
    meaning_vi: 'Tôi rất khỏe',
    phonetic_focus: 'Chuỗi 3 thanh 3 liên tiếp',
    articulation_tip_vi: 'Theo cấu trúc 1+2, đọc nửa thanh 3 ở 我, biến 很 thành thanh 2 (hén), giữ 好 thanh 3.',
  }),
];

export function getBuiltInPronunciationDrills(): PronunciationDrill[] {
  return BUILT_IN_DRILLS;
}

export async function listPronunciationDrills(): Promise<PronunciationDrill[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BUILT_IN_DRILLS;
  }

  try {
    const { data, error } = await supabase
      .from('pronunciation_drills')
      .select('*')
      .order('hsk_level', { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) {
      return BUILT_IN_DRILLS;
    }

    return data.map((row) => ({
      id: String(row.id),
      category: (row.category as PronunciationCategory) || 'tone_sandhi',
      hsk_level: Number(row.hsk_level || 1),
      hanzi: String(row.hanzi),
      pinyin_underlying: String(row.pinyin_underlying),
      pinyin_surface: String(row.pinyin_surface),
      meaning_vi: String(row.meaning_vi || ''),
      phonetic_focus: String(row.phonetic_focus || ''),
      articulation_tip_vi: String(row.articulation_tip_vi || ''),
      reference_pitch_contour: Array.isArray(row.reference_pitch_contour)
        ? (row.reference_pitch_contour as number[])
        : [],
    }));
  } catch {
    return BUILT_IN_DRILLS;
  }
}

function classifyToneFromSlice(slice: number[]): number {
  if (slice.length === 0) return 5;
  const start = slice[0];
  const end = slice[slice.length - 1];
  const minVal = Math.min(...slice);
  const maxVal = Math.max(...slice);
  const delta = end - start;
  const range = maxVal - minVal;

  if (range < 14 && start >= 68) return 1; // 55 high flat
  if (minVal <= 30 && start - minVal >= 12) return 3; // 214 dipping
  if (delta >= 18) return 2; // 35 rising
  if (delta <= -22) return 4; // 51 falling
  if (minVal <= 36 || (start <= 50 && end <= 65)) return 3; // half-3rd
  return 5;
}

function buildArticulationDiagnostic(
  char: string,
  pinyinSurface: string,
  expectedTone: number,
  detectedTone: number,
  score: number
): { error_type?: SyllableErrorType; diagnostic_vi: string } {
  if (score >= 85 && expectedTone === detectedTone) {
    return {
      diagnostic_vi: `Chữ "${char}" (${pinyinSurface}): Cao độ thanh ${expectedTone} chuẩn xác.`,
    };
  }

  const lower = pinyinSurface.toLowerCase();
  if (expectedTone !== detectedTone) {
    return {
      error_type: 'wrong_tone',
      diagnostic_vi: `Bạn vừa đọc thanh ${detectedTone} thay vì thanh ${expectedTone} cho "${char}" (${pinyinSurface}). Hãy điều chỉnh cao độ theo đường nét đứt.`,
    };
  }

  if (/^(p|t|k|q|c|ch)/.test(lower)) {
    return {
      error_type: 'missing_aspiration',
      diagnostic_vi: `Âm bật hơi đầu "${lower[0]}" trong "${pinyinSurface}" cần đẩy luồng hơi mạnh hơn.`,
    };
  }

  if (/^(zh|ch|sh|r)/.test(lower)) {
    return {
      error_type: 'retroflex_error',
      diagnostic_vi: `Âm uốn lưỡi "${lower.slice(0, 2)}" trong "${pinyinSurface}" cần cong đầu lưỡi chạm ngạc cứng.`,
    };
  }

  return {
    error_type: 'wrong_tone',
    diagnostic_vi: `Độ ổn định cao độ của "${char}" (${pinyinSurface}) cần giữ đều hơn ở cuối âm tiết.`,
  };
}

function resampleArray(input: number[], targetLen: number): number[] {
  if (input.length === 0) return Array(targetLen).fill(50);
  if (input.length === targetLen) return input;
  const out: number[] = [];
  for (let i = 0; i < targetLen; i += 1) {
    const pos = (i / Math.max(1, targetLen - 1)) * (input.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.min(input.length - 1, lo + 1);
    const frac = pos - lo;
    out.push(Math.round(input[lo] * (1 - frac) + input[hi] * frac));
  }
  return out;
}

export function evaluatePronunciationAttempt(params: {
  drill: PronunciationDrill;
  userContour: number[];
}): PronunciationAttemptResult {
  const { drill, userContour } = params;
  const sandhi = applyMandarinToneSandhi(drill.hanzi, drill.pinyin_underlying);
  const syllables = sandhi.syllables;
  const reference =
    drill.reference_pitch_contour.length > 0
      ? drill.reference_pitch_contour
      : generateReferencePitchContour(syllables.map((s) => s.surfaceTone));

  const resampledUser = resampleArray(userContour, reference.length);
  const sliceLen = Math.max(1, Math.floor(reference.length / Math.max(1, syllables.length)));

  const breakdown: SyllableDiagnostic[] = syllables.map((syl, idx) => {
    const start = idx * sliceLen;
    const end = idx === syllables.length - 1 ? reference.length : start + sliceLen;
    const refSlice = reference.slice(start, end);
    const usrSlice = resampledUser.slice(start, end);

    const meanAbsDiff =
      usrSlice.reduce((acc, v, k) => acc + Math.abs(v - (refSlice[k] ?? 50)), 0) /
      Math.max(1, usrSlice.length);

    const detectedTone = classifyToneFromSlice(usrSlice);
    const tonePenalty = detectedTone === syl.surfaceTone ? 0 : 24;
    const rawScore = Math.max(20, Math.min(100, Math.round(100 - meanAbsDiff * 1.15 - tonePenalty)));

    const diag = buildArticulationDiagnostic(
      syl.char,
      syl.surfacePinyin,
      syl.surfaceTone,
      detectedTone,
      rawScore
    );

    return {
      char: syl.char,
      pinyin_surface: syl.surfacePinyin,
      expected_tone: syl.surfaceTone,
      detected_tone: detectedTone,
      score: rawScore,
      error_type: diag.error_type,
      diagnostic_vi: diag.diagnostic_vi,
    };
  });

  const toneScore = Math.round(
    breakdown.reduce((acc, s) => acc + s.score, 0) / Math.max(1, breakdown.length)
  );

  // Đo độ trôi chảy thực tế từ độ mượt cao độ (ít giật cục giữa các khung F0) & độ phủ thời lượng thu âm
  let avgFrameJump = 0;
  if (resampledUser.length > 1) {
    let jumpSum = 0;
    for (let i = 1; i < resampledUser.length; i += 1) {
      jumpSum += Math.abs(resampledUser[i] - resampledUser[i - 1]);
    }
    avgFrameJump = jumpSum / (resampledUser.length - 1);
  }
  const smoothnessScore = Math.max(30, Math.min(100, Math.round(100 - avgFrameJump * 2.2)));
  const coverageRatio = Math.min(1, userContour.length / Math.max(6, reference.length * 0.5));
  const fluencyScore = Math.max(
    25,
    Math.min(100, Math.round(smoothnessScore * 0.65 + coverageRatio * 35))
  );

  // Độ ổn định khớp đường bao âm tiết (thay cho công thức suy diễn tuyến tính từ toneScore)
  const initialFinalScore = Math.max(
    20,
    Math.min(100, Math.round(toneScore * 0.7 + smoothnessScore * 0.3))
  );
  const overallScore = Math.round(toneScore * 0.6 + fluencyScore * 0.25 + initialFinalScore * 0.15);

  return {
    overall_score: overallScore,
    initial_final_score: initialFinalScore,
    tone_score: toneScore,
    fluency_score: fluencyScore,
    syllable_breakdown: breakdown,
    reference_contour: reference,
    user_contour: resampledUser,
  };
}

export async function savePronunciationAttempt(params: {
  user?: { id?: string | null } | null;
  drill: PronunciationDrill;
  result: PronunciationAttemptResult;
}): Promise<void> {
  const { user = null, drill, result } = params;

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
      list.unshift({
        drillId: drill.id,
        hanzi: drill.hanzi,
        overallScore: result.overall_score,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    }
  } catch {
    // ignore storage errors
  }

  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'pronunciation',
    hskLevel: drill.hsk_level,
    skillDomain: 'pronunciation',
    itemId: drill.hanzi,
    isCorrect: result.overall_score >= 75,
    scoreEarned: result.overall_score,
    scoreMax: 100,
    durationMs: 4000,
    payload: {
      toneScore: result.tone_score,
      category: drill.category,
    },
  });

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_pronunciation_attempts').insert({
        user_id: user.id,
        drill_id: null,
        target_text: drill.hanzi,
        overall_score: result.overall_score,
        initial_final_score: result.initial_final_score,
        tone_score: result.tone_score,
        fluency_score: result.fluency_score,
        syllable_breakdown: result.syllable_breakdown,
      });
    } catch {
      // ignore remote error
    }
  }
}
