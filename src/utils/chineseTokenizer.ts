import { VOCABULARY_LIST } from '../data/chineseData.js';

export interface ReadingToken {
  text: string;
  pinyin: string;
  han_viet?: string;
  hsk_level?: number;
  pos?: string;
  meaning_vi?: string;
  is_punctuation: boolean;
}

export interface ReadingSentence {
  sentence_id: string;
  zh_raw: string;
  pinyin_full: string;
  vi_translation: string;
  audio_start_ms?: number;
  audio_end_ms?: number;
  tokens: ReadingToken[];
}

export interface ReadingParagraph {
  paragraph_index: number;
  sentences: ReadingSentence[];
}

const HANZI_REGEX = /[\u4e00-\u9fa5]/;
const PUNCTUATION_REGEX = /^[，。！？、；：“”‘’（）《》【】—…,.!?;:"'()[\]\s]+$/;

type VocabDictEntry = {
  hanzi: string;
  pinyin: string;
  hanviet?: string;
  level?: number;
  part_of_speech?: string;
  meaning?: string;
};

// Common characters and compound words to supplement standard vocabulary lists
const SUPPLEMENTAL_VOCAB: VocabDictEntry[] = [
  { hanzi: '换乘', pinyin: 'huànchéng', hanviet: 'Hoán thừa', level: 3, meaning: 'Chuyển tuyến (tàu, xe)' },
  { hanzi: '换', pinyin: 'huàn', hanviet: 'Hoán', level: 3, meaning: 'Đổi, thay đổi' },
  { hanzi: '乘', pinyin: 'chéng', hanviet: 'Thừa', level: 4, meaning: 'Đi (xe, tàu)' },
  { hanzi: '一号线', pinyin: 'yī hào xiàn', hanviet: 'Nhất hiệu tuyến', level: 3, meaning: 'Tuyến số 1' },
  { hanzi: '线', pinyin: 'xiàn', hanviet: 'Tuyến', level: 3, meaning: 'Tuyến đường, dây' },
  { hanzi: '号', pinyin: 'hào', hanviet: 'Hiệu', level: 1, meaning: 'Số, ngày' },
  { hanzi: '出口', pinyin: 'chūkǒu', hanviet: 'Xuất khẩu', level: 3, meaning: 'Cửa ra' },
  { hanzi: '通往', pinyin: 'tōng wǎng', hanviet: 'Thông vãng', level: 4, meaning: 'Dẫn tới, thông tới' },
  { hanzi: '王府井', pinyin: 'wángfǔjǐng', hanviet: 'Vương Phủ Tỉnh', level: 3, meaning: 'Vương Phủ Tỉnh (Bắc Kinh)' },
  { hanzi: '步行街', pinyin: 'bùxíngjiē', hanviet: 'Bộ hành nhai', level: 3, meaning: 'Phố đi bộ' },
  { hanzi: '注意', pinyin: 'zhùyì', hanviet: 'Chú ý', level: 3, meaning: 'Chú ý' },
  { hanzi: '安全', pinyin: 'ānquán', hanviet: 'An toàn', level: 3, meaning: 'An toàn' },
  { hanzi: '保管', pinyin: 'bǎoguǎn', hanviet: 'Bảo quản', level: 4, meaning: 'Bảo quản' },
  { hanzi: '随身', pinyin: 'suíshēn', hanviet: 'Tùy thân', level: 4, meaning: 'Mang theo bên mình' },
  { hanzi: '行李', pinyin: 'xíngli', hanviet: 'Hành lý', level: 3, meaning: 'Hành lý' },
  { hanzi: '往前走', pinyin: 'wǎng qián zǒu', hanviet: 'Vãng tiền tẩu', level: 2, meaning: 'Đi thẳng phía trước' },
  { hanzi: '往', pinyin: 'wǎng', hanviet: 'Vãng', level: 2, meaning: 'Hướng về, đi về' },
  { hanzi: '前', pinyin: 'qián', hanviet: 'Tiền', level: 1, meaning: 'Phía trước' },
  { hanzi: '走', pinyin: 'zǒu', hanviet: 'Tẩu', level: 1, meaning: 'Đi' },
  { hanzi: '请', pinyin: 'qǐng', hanviet: 'Thỉnh', level: 1, meaning: 'Xin mời, vui lòng' },
  { hanzi: '站', pinyin: 'zhàn', hanviet: 'Trạm', level: 2, meaning: 'Trạm, ga tàu' },
  { hanzi: '地铁', pinyin: 'dìtiě', hanviet: 'Địa thiết', level: 2, meaning: 'Tàu điện ngầm' },
  { hanzi: '名胜古迹', pinyin: 'míngshèng gǔjì', hanviet: 'Danh thắng cổ tích', level: 5, meaning: 'Danh lam thắng cảnh' },
  { hanzi: '参观', pinyin: 'cānguān', hanviet: 'Tham quan', level: 3, meaning: 'Tham quan' },
  { hanzi: '故宫', pinyin: 'gùgōng', hanviet: 'Cố Cung', level: 3, meaning: 'Cố Cung' },
  { hanzi: '天安门', pinyin: 'tiān\'ānmén', hanviet: 'Thiên An Môn', level: 3, meaning: 'Thiên An Môn' },
  { hanzi: '广场', pinyin: 'guǎngchǎng', hanviet: 'Quảng trường', level: 3, meaning: 'Quảng trường' },
  { hanzi: '风景', pinyin: 'fēngjǐng', hanviet: 'Phong cảnh', level: 4, meaning: 'Phong cảnh' },
  { hanzi: '美丽', pinyin: 'měilì', hanviet: 'Mỹ lệ', level: 4, meaning: 'Xinh đẹp' },
  { hanzi: '游客', pinyin: 'yóukè', hanviet: 'Du khách', level: 4, meaning: 'Du khách' },
  { hanzi: '照片', pinyin: 'zhàopiàn', hanviet: 'Chiếu phiến', level: 2, meaning: 'Bức ảnh' },
  { hanzi: '长城', pinyin: 'chángchéng', hanviet: 'Trường Thành', level: 3, meaning: 'Trường Thành' },
  { hanzi: '万里长城', pinyin: 'wànlǐ chángchéng', hanviet: 'Vạn Lý Trường Thành', level: 3, meaning: 'Vạn Lý Trường Thành' },
  { hanzi: '特色', pinyin: 'tèsè', hanviet: 'Đặc sắc', level: 4, meaning: 'Đặc sắc' },
  { hanzi: '招牌', pinyin: 'zhāopái', hanviet: 'Chiêu bài', level: 4, meaning: 'Biển hiệu, món tủ' },
  { hanzi: '宫保鸡丁', pinyin: 'gōngbǎo jīdīng', hanviet: 'Cung Bảo kê đinh', level: 3, meaning: 'Gà Cung Bảo' },
  { hanzi: '麻婆豆腐', pinyin: 'mápó dòufu', hanviet: 'Ma Bà đậu phụ', level: 3, meaning: 'Đậu phụ Ma Bà' },
  { hanzi: '水煮牛肉', pinyin: 'shuǐzhǔ niúròu', hanviet: 'Thủy chử ngưu nhục', level: 4, meaning: 'Bò nấu cay Tứ Xuyên' },
  { hanzi: '米饭', pinyin: 'mǐfàn', hanviet: 'Mễ phạn', level: 1, meaning: 'Cơm trắng' },
];

let cachedVocabMap: Map<string, VocabDictEntry> | null = null;

function getVocabMap(): Map<string, VocabDictEntry> {
  if (cachedVocabMap) return cachedVocabMap;
  const map = new Map<string, VocabDictEntry>();
  for (const item of VOCABULARY_LIST) {
    if (item?.hanzi && !map.has(item.hanzi)) {
      map.set(item.hanzi, {
        hanzi: item.hanzi,
        pinyin: item.pinyin || '',
        hanviet: item.hanviet || '',
        level: Number(item.level) || undefined,
        part_of_speech: item.part_of_speech || '',
        meaning: item.meaning || '',
      });
    }
  }
  for (const supp of SUPPLEMENTAL_VOCAB) {
    if (!map.has(supp.hanzi)) {
      map.set(supp.hanzi, supp);
    }
  }
  cachedVocabMap = map;
  return map;
}

function segmentWithIntl(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
    return Array.from(segmenter.segment(text)).map((s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Hybrid Chinese word tokenizer combining:
 * 1. Maximum Matching (forward longest match, max length 4) against the core dictionary.
 * 2. Intl.Segmenter('zh-CN', { granularity: 'word' }) fallback for unindexed compounds.
 */
export function tokenizeChineseText(
  text: string,
  extraEntries?: Map<string, VocabDictEntry>
): ReadingToken[] {
  const raw = (text || '').trim();
  if (!raw) return [];

  const vocabMap = getVocabMap();
  const lookup = (w: string): VocabDictEntry | undefined =>
    extraEntries?.get(w) ?? vocabMap.get(w);

  const chars = Array.from(raw);
  const tokens: ReadingToken[] = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    // Punctuation or whitespace
    if (PUNCTUATION_REGEX.test(ch) || !HANZI_REGEX.test(ch)) {
      if (ch.trim()) {
        tokens.push({
          text: ch,
          pinyin: '',
          is_punctuation: PUNCTUATION_REGEX.test(ch),
        });
      }
      i += 1;
      continue;
    }

    // Try Maximum Matching (length 4 -> 2) first for known multi-char words
    let matchedWord: string | null = null;
    let matchedEntry: VocabDictEntry | undefined;
    const maxLen = Math.min(4, chars.length - i);

    for (let len = maxLen; len >= 2; len -= 1) {
      const candidate = chars.slice(i, i + len).join('');
      const hit = lookup(candidate);
      if (hit) {
        matchedWord = candidate;
        matchedEntry = hit;
        break;
      }
    }

    if (matchedWord && matchedEntry) {
      tokens.push({
        text: matchedWord,
        pinyin: matchedEntry.pinyin,
        han_viet: matchedEntry.hanviet,
        hsk_level: matchedEntry.level,
        pos: matchedEntry.part_of_speech,
        meaning_vi: matchedEntry.meaning,
        is_punctuation: false,
      });
      i += Array.from(matchedWord).length;
      continue;
    }

    // Collect contiguous Hanzi span up to next punctuation or known multi-char word,
    // then refine with Intl.Segmenter('zh-CN')
    let j = i + 1;
    while (j < chars.length && HANZI_REGEX.test(chars[j])) {
      // Stop if a known 2+ char word starts at j
      let startsKnownCompound = false;
      for (let len = Math.min(4, chars.length - j); len >= 2; len -= 1) {
        if (lookup(chars.slice(j, j + len).join(''))) {
          startsKnownCompound = true;
          break;
        }
      }
      if (startsKnownCompound) break;
      j += 1;
    }

    const span = chars.slice(i, j).join('');
    const intlSegments = segmentWithIntl(span);

    for (const seg of intlSegments) {
      if (!seg.trim()) continue;
      const entry = lookup(seg);
      const charFallback =
        !entry && Array.from(seg).length === 1
          ? lookup(seg)
          : entry;
      const composedPinyin =
        charFallback?.pinyin ||
        Array.from(seg)
          .map((c) => lookup(c)?.pinyin || '')
          .filter(Boolean)
          .join(' ');

      tokens.push({
        text: seg,
        pinyin: composedPinyin,
        han_viet: charFallback?.hanviet,
        hsk_level: charFallback?.level,
        pos: charFallback?.part_of_speech,
        meaning_vi: charFallback?.meaning,
        is_punctuation: PUNCTUATION_REGEX.test(seg),
      });
    }

    i = j;
  }

  return tokens;
}

/**
 * Split raw Chinese text into paragraphs and tokenized sentences for Custom Article mode.
 */
export function parseCustomArticleToParagraphs(rawText: string): {
  paragraphs: ReadingParagraph[];
  wordCount: number;
} {
  const rawParagraphs = (rawText || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  let wordCount = 0;
  const paragraphs: ReadingParagraph[] = rawParagraphs.map((pText, pIdx) => {
    const rawSentences = pText
      .split(/(?<=[。！？!?；;])/)
      .map((s) => s.trim())
      .filter(Boolean);

    const sentences: ReadingSentence[] = rawSentences.map((sText, sIdx) => {
      const tokens = tokenizeChineseText(sText);
      const contentTokens = tokens.filter((t) => !t.is_punctuation);
      wordCount += contentTokens.length;

      return {
        sentence_id: `p${pIdx + 1}-s${sIdx + 1}`,
        zh_raw: sText,
        pinyin_full: contentTokens
          .map((t) => t.pinyin)
          .filter(Boolean)
          .join(' '),
        vi_translation: 'Bản dịch tự động cho bài đọc tùy chỉnh (nhấn từng từ để xem nghĩa chi tiết).',
        tokens,
      };
    });

    return {
      paragraph_index: pIdx,
      sentences,
    };
  });

  return { paragraphs, wordCount };
}
