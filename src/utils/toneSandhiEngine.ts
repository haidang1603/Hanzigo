export interface SandhiSyllable {
  char: string;
  underlyingTone: number;
  surfaceTone: number;
  underlyingPinyin: string;
  surfacePinyin: string;
  sandhiApplied: boolean;
  sandhiRule?: string;
}

export interface ToneSandhiResult {
  hanzi: string;
  underlyingPinyin: string;
  surfacePinyin: string;
  hasSandhi: boolean;
  syllables: SandhiSyllable[];
}

const TONE_MARKS: Record<string, { base: string; tone: number }> = {
  ā: { base: 'a', tone: 1 }, á: { base: 'a', tone: 2 }, ǎ: { base: 'a', tone: 3 }, à: { base: 'a', tone: 4 },
  ē: { base: 'e', tone: 1 }, é: { base: 'e', tone: 2 }, ě: { base: 'e', tone: 3 }, è: { base: 'e', tone: 4 },
  ī: { base: 'i', tone: 1 }, í: { base: 'i', tone: 2 }, ǐ: { base: 'i', tone: 3 }, ì: { base: 'i', tone: 4 },
  ō: { base: 'o', tone: 1 }, ó: { base: 'o', tone: 2 }, ǒ: { base: 'o', tone: 3 }, ò: { base: 'o', tone: 4 },
  ū: { base: 'u', tone: 1 }, ú: { base: 'u', tone: 2 }, ǔ: { base: 'u', tone: 3 }, ù: { base: 'u', tone: 4 },
  ǖ: { base: 'ü', tone: 1 }, ǘ: { base: 'ü', tone: 2 }, ǚ: { base: 'ü', tone: 3 }, ǜ: { base: 'ü', tone: 4 },
};

const VOWEL_TONE_MAP: Record<string, [string, string, string, string, string]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

function detectToneAndStrip(syllable: string): { plain: string; tone: number } {
  const numMatch = syllable.match(/([1-5])$/);
  if (numMatch) {
    return {
      plain: syllable.slice(0, -1),
      tone: Number(numMatch[1]),
    };
  }

  let detectedTone = 5;
  let plain = '';
  for (const ch of syllable) {
    const lower = ch.toLowerCase();
    const mapped = TONE_MARKS[lower];
    if (mapped) {
      detectedTone = mapped.tone;
      plain += ch === lower ? mapped.base : mapped.base.toUpperCase();
    } else {
      plain += ch;
    }
  }
  return { plain, tone: detectedTone };
}

function applyToneMark(plainSyllable: string, tone: number): string {
  if (tone < 1 || tone > 4) return plainSyllable;
  const lower = plainSyllable.toLowerCase();

  // Standard Pinyin tone placement: a/e first, then ou -> o, else last vowel
  let targetIdx = -1;
  if (lower.includes('a')) targetIdx = lower.indexOf('a');
  else if (lower.includes('e')) targetIdx = lower.indexOf('e');
  else if (lower.includes('ou')) targetIdx = lower.indexOf('o');
  else {
    for (let i = lower.length - 1; i >= 0; i -= 1) {
      if ('iouü'.includes(lower[i])) {
        targetIdx = i;
        break;
      }
    }
  }

  if (targetIdx === -1) return plainSyllable;
  const vowel = lower[targetIdx];
  const table = VOWEL_TONE_MAP[vowel];
  if (!table) return plainSyllable;

  const marked = table[tone];
  const isUpper = plainSyllable[targetIdx] !== lower[targetIdx];
  const finalChar = isUpper ? marked.toUpperCase() : marked;
  return plainSyllable.slice(0, targetIdx) + finalChar + plainSyllable.slice(targetIdx + 1);
}

/**
 * Apply Mandarin Tone Sandhi rules to produce both Underlying and Surface tones:
 * 1. 3 + 3 -> 2 + 3
 * 2. 3 + 3 + 3 -> 2 + 2 + 3 (or 3 + 2 + 3 for known [1+2] structure)
 * 3. 一 (yī): yí (tone 2) before tone 4; yì (tone 4) before tones 1, 2, 3
 * 4. 不 (bù): bú (tone 2) before tone 4
 */
export function applyMandarinToneSandhi(
  hanzi: string,
  underlyingPinyin: string
): ToneSandhiResult {
  const chars = Array.from((hanzi || '').replace(/[，。！？、；：“”‘’（）\s]/g, ''));
  const rawSyllables = (underlyingPinyin || '')
    .replace(/[，。！？、；：“”‘’（）,.!?;:"'()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const count = Math.min(chars.length, rawSyllables.length);
  const parsed = Array.from({ length: count }, (_, idx) => {
    const { plain, tone } = detectToneAndStrip(rawSyllables[idx]);
    return {
      char: chars[idx],
      underlyingPinyin: rawSyllables[idx],
      plain,
      underlyingTone: tone,
      surfaceTone: tone,
      sandhiApplied: false,
      sandhiRule: undefined as string | undefined,
    };
  });

  // Rule 1 & 2: Consecutive 3rd tones
  let i = 0;
  while (i < parsed.length) {
    if (parsed[i].underlyingTone !== 3) {
      i += 1;
      continue;
    }

    let j = i;
    while (j < parsed.length && parsed[j].underlyingTone === 3) {
      j += 1;
    }
    const runLen = j - i;

    if (runLen === 2) {
      parsed[i].surfaceTone = 2;
      parsed[i].sandhiApplied = true;
      parsed[i].sandhiRule = 'Biến điệu 3 + 3 → 2 + 3';
    } else if (runLen >= 3) {
      // Special [1 + 2] grouping heuristic for common phrases like 我很好 / 很勇敢
      const isOnePlusTwo = runLen === 3 && (parsed[i].char === '我' || parsed[i].char === '你');
      if (isOnePlusTwo) {
        parsed[i + 1].surfaceTone = 2;
        parsed[i + 1].sandhiApplied = true;
        parsed[i + 1].sandhiRule = 'Biến điệu 3 + 3 + 3 (nhóm 1+2) → 3 + 2 + 3';
      } else {
        for (let k = i; k < j - 1; k += 1) {
          parsed[k].surfaceTone = 2;
          parsed[k].sandhiApplied = true;
          parsed[k].sandhiRule = 'Biến điệu chuỗi thanh 3 → 2 + ... + 3';
        }
      }
    }

    i = j;
  }

  // Rule 3 & 4: 一 (yī) and 不 (bù)
  for (let k = 0; k < parsed.length - 1; k += 1) {
    const curr = parsed[k];
    const next = parsed[k + 1];

    if (curr.char === '不') {
      if (next.underlyingTone === 4) {
        curr.surfaceTone = 2;
        curr.sandhiApplied = true;
        curr.sandhiRule = 'Biến điệu 不 trước thanh 4 → bú (thanh 2)';
      }
    } else if (curr.char === '一') {
      if (next.underlyingTone === 4) {
        curr.surfaceTone = 2;
        curr.sandhiApplied = true;
        curr.sandhiRule = 'Biến điệu 一 trước thanh 4 → yí (thanh 2)';
      } else if ([1, 2, 3].includes(next.underlyingTone)) {
        curr.surfaceTone = 4;
        curr.sandhiApplied = true;
        curr.sandhiRule = 'Biến điệu 一 trước thanh 1/2/3 → yì (thanh 4)';
      }
    }
  }

  const syllables: SandhiSyllable[] = parsed.map((p) => ({
    char: p.char,
    underlyingTone: p.underlyingTone,
    surfaceTone: p.surfaceTone,
    underlyingPinyin: p.underlyingPinyin,
    surfacePinyin: p.sandhiApplied
      ? applyToneMark(p.plain, p.surfaceTone)
      : p.underlyingPinyin,
    sandhiApplied: p.sandhiApplied,
    sandhiRule: p.sandhiRule,
  }));

  return {
    hanzi,
    underlyingPinyin,
    surfacePinyin: syllables.map((s) => s.surfacePinyin).join(' '),
    hasSandhi: syllables.some((s) => s.sandhiApplied),
    syllables,
  };
}

/**
 * Generate normalized [0..100] Chao pitch contour points for a sequence of tones.
 */
export function generateReferencePitchContour(
  tones: number[],
  pointsPerSyllable = 12
): number[] {
  const contour: number[] = [];

  tones.forEach((tone, idx) => {
    const isFinal = idx === tones.length - 1;
    for (let s = 0; s < pointsPerSyllable; s += 1) {
      const t = s / Math.max(1, pointsPerSyllable - 1);
      let val = 50;

      if (tone === 1) {
        // 55: steady high
        val = 88;
      } else if (tone === 2) {
        // 35: rising
        val = 48 + t * 40;
      } else if (tone === 3) {
        // 214 if final, half-3rd 21 if non-final
        if (isFinal) {
          val = t < 0.45 ? 38 - (t / 0.45) * 22 : 16 + ((t - 0.45) / 0.55) * 46;
        } else {
          val = 38 - t * 20;
        }
      } else if (tone === 4) {
        // 51: sharp falling
        val = 90 - t * 74;
      } else {
        // Neutral tone: short mid-low
        val = 46 - t * 8;
      }

      contour.push(Math.round(val));
    }
  });

  return contour;
}

