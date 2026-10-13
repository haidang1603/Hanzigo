/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE: UNICODE & PHONETIC NORMALIZER
 * =========================================================================
 * Chuẩn hóa ngữ âm và văn bản:
 * - Chuẩn hóa Unicode NFC toàn diện cho Tiếng Trung & Tiếng Việt có dấu.
 * - Chuyển đổi hai chiều Pinyin có số thanh điệu (ni3 hao3) <-> Pinyin có dấu thanh điệu (nǐ hǎo).
 * - Xử lý đặc thù ü (v / u: / ü) như trong lǜ (lu:4 / lv4) và nü (nv3 / nü3).
 * - Phát hiện và bảo vệ dấu thanh Tiếng Việt, chống thoái hóa font/mojibake.
 * =========================================================================
 */

// Bảng thanh điệu nguyên âm Pinyin (thanh 1, 2, 3, 4, 5/nhẹ)
const PINYIN_TONE_MARKS = {
  a: ['ā', 'á', 'ǎ', 'à', 'a'],
  o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
  e: ['ē', 'é', 'ě', 'è', 'e'],
  i: ['ī', 'í', 'ǐ', 'ì', 'i'],
  u: ['ū', 'ú', 'ǔ', 'ù', 'u'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'] // CC-CEDICT thường dùng 'u:' hoặc 'v' biểu thị 'ü'
};

const PINYIN_REVERSE_MAP = {};
for (const [vowel, accentedList] of Object.entries(PINYIN_TONE_MARKS)) {
  accentedList.forEach((acc, idx) => {
    if (idx < 4) {
      PINYIN_REVERSE_MAP[acc] = { vowel: vowel === 'v' ? 'ü' : vowel, tone: idx + 1 };
    }
  });
}
// Chữ hoa
PINYIN_REVERSE_MAP['Ā'] = { vowel: 'a', tone: 1 };
PINYIN_REVERSE_MAP['Á'] = { vowel: 'a', tone: 2 };
PINYIN_REVERSE_MAP['Ǎ'] = { vowel: 'a', tone: 3 };
PINYIN_REVERSE_MAP['À'] = { vowel: 'a', tone: 4 };
PINYIN_REVERSE_MAP['Ō'] = { vowel: 'o', tone: 1 };
PINYIN_REVERSE_MAP['Ó'] = { vowel: 'o', tone: 2 };
PINYIN_REVERSE_MAP['Ǒ'] = { vowel: 'o', tone: 3 };
PINYIN_REVERSE_MAP['Ò'] = { vowel: 'o', tone: 4 };
PINYIN_REVERSE_MAP['Ē'] = { vowel: 'e', tone: 1 };
PINYIN_REVERSE_MAP['É'] = { vowel: 'e', tone: 2 };
PINYIN_REVERSE_MAP['Ě'] = { vowel: 'e', tone: 3 };
PINYIN_REVERSE_MAP['È'] = { vowel: 'e', tone: 4 };

/**
 * Chuẩn hóa chuỗi văn bản về Unicode chuẩn NFC, gỡ bỏ khoảng trắng thừa
 * @param {string} text 
 * @returns {string}
 */
export function normalizeUnicodeNfc(text) {
  if (typeof text !== 'string') return '';
  return text.normalize('NFC').trim();
}

/**
 * Chuyển một âm tiết Pinyin dạng số thành dạng có dấu thanh
 * Ví dụ: "ni3" -> "nǐ", "hao3" -> "hǎo", "lv4" -> "lǜ", "zhong1" -> "zhōng"
 * @param {string} syllable 
 * @returns {string}
 */
export function convertNumberedSyllableToAccented(syllable) {
  if (!syllable || typeof syllable !== 'string') return '';
  const clean = syllable.trim();
  const match = clean.match(/^([a-zA-ZüÜ:]+)([1-5])?$/);
  if (!match) return clean;

  const isCapitalized = /^[A-Z]/.test(match[1]);
  let base = match[1].toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü');
  const tone = match[2] ? parseInt(match[2], 10) : 5;

  let accented = base;
  if (tone !== 5 && tone !== 0 && match[2]) {
    const toneIdx = tone - 1;

    // Quy tắc đặt dấu thanh Pinyin:
    // 1. Nếu có 'a' hoặc 'e', dấu thanh đặt trên 'a' hoặc 'e'
    // 2. Nếu có 'ou', đặt trên 'o'
    // 3. Nếu không, đặt trên nguyên âm cuối cùng
    if (base.includes('a')) {
      accented = base.replace('a', PINYIN_TONE_MARKS.a[toneIdx]);
    } else if (base.includes('e')) {
      accented = base.replace('e', PINYIN_TONE_MARKS.e[toneIdx]);
    } else if (base.includes('ou')) {
      accented = base.replace('o', PINYIN_TONE_MARKS.o[toneIdx]);
    } else {
      // Tìm nguyên âm xuất hiện sau cùng
      for (let i = base.length - 1; i >= 0; i--) {
        const char = base[i];
        if (['o', 'i', 'u', 'ü'].includes(char)) {
          accented = base.slice(0, i) + PINYIN_TONE_MARKS[char][toneIdx] + base.slice(i + 1);
          break;
        }
      }
    }
  }

  if (isCapitalized && accented.length > 0) {
    return accented.charAt(0).toUpperCase() + accented.slice(1);
  }

  return accented;
}

/**
 * Chuyển chuỗi Pinyin có số thành Pinyin có dấu chuẩn
 * Ví dụ: "ni3 hao3" -> "nǐ hǎo", "Zhong1 guo2" -> "Zhōng guó"
 * @param {string} pinyinNumbered 
 * @returns {string}
 */
export function convertNumberedPinyinToAccented(pinyinNumbered) {
  if (!pinyinNumbered || typeof pinyinNumbered !== 'string') return '';
  const syllables = normalizeUnicodeNfc(pinyinNumbered).split(/\s+/);
  return syllables.map(convertNumberedSyllableToAccented).join(' ');
}

/**
 * Kiểm tra tính hợp lệ của văn bản Tiếng Việt có dấu (không chứa ký tự hỏng / mojibake)
 * @param {string} text 
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateVietnameseText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, reason: 'Nội dung tiếng Việt trống.' };
  }
  const clean = normalizeUnicodeNfc(text);
  if (clean.includes('\uFFFD') || clean.includes('???')) {
    return { valid: false, reason: 'Phát hiện ký tự lỗi encoding hoặc dấu hỏi mất dữ liệu (Mojibake).' };
  }
  return { valid: true };
}

/**
 * Kiểm tra xem chuỗi có chứa chữ Hán hợp lệ (Unicode CJK Unified Ideographs)
 * @param {string} text 
 * @returns {boolean}
 */
export function containsChineseCharacters(text) {
  if (!text || typeof text !== 'string') return false;
  return /[\u4e00-\u9fa5]/.test(text);
}

const PINYIN_TONE_STRIP_MAP = {
  'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
  'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
  'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
  'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
  'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
  'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü',
  'ü': 'ü',
  'Ā': 'a', 'Á': 'a', 'Ǎ': 'a', 'À': 'a',
  'Ē': 'e', 'É': 'e', 'Ě': 'e', 'È': 'e',
  'Ī': 'i', 'Í': 'i', 'Ǐ': 'i', 'Ì': 'i',
  'Ō': 'o', 'Ó': 'o', 'Ǒ': 'o', 'Ò': 'o',
  'Ū': 'u', 'Ú': 'u', 'Ǔ': 'u', 'Ù': 'u',
  'Ǖ': 'ü', 'Ǘ': 'ü', 'Ǚ': 'ü', 'Ǜ': 'ü',
  'Ü': 'ü'
};

/**
 * Loại bỏ dấu thanh điệu Pinyin (giữ nguyên nguyên âm cơ bản a, e, i, o, u, ü)
 * @param {string} pinyinText 
 * @returns {string}
 */
export function stripPinyinTones(pinyinText) {
  if (!pinyinText || typeof pinyinText !== 'string') return '';
  const clean = normalizeUnicodeNfc(pinyinText);
  let res = '';
  for (const char of clean) {
    res += PINYIN_TONE_STRIP_MAP[char] || char;
  }
  return res.toLowerCase();
}

/**
 * Sinh các biến thể Pinyin (có dấu, không dấu, viết liền, thay thế ü -> v/u)
 * Phục vụ tìm kiếm dung sai cho học viên khi gõ Pinyin không dấu hoặc viết liền.
 * Ví dụ: "lǜ sè" -> ["lǜ sè", "lü se", "lüse", "lv se", "lvse", "lu se", "luse"]
 *        "nǐ hǎo" -> ["nǐ hǎo", "ni hao", "nihao"]
 *        "xièxie" -> ["xièxie", "xiexie"]
 * @param {string} rawPinyin 
 * @returns {string[]}
 */
export function generatePinyinVariants(rawPinyin) {
  if (!rawPinyin || typeof rawPinyin !== 'string') return [];
  const clean = normalizeUnicodeNfc(rawPinyin).toLowerCase().trim();
  if (!clean) return [];

  const variants = new Set();
  variants.add(clean);

  // Dạng không dấu
  const toneFree = stripPinyinTones(clean);
  variants.add(toneFree);

  // Dạng không dấu viết liền (bỏ khoảng trắng)
  const compact = toneFree.replace(/\s+/g, '');
  if (compact) variants.add(compact);

  // Dạng thay thế ü -> v và ü -> u
  if (toneFree.includes('ü')) {
    const vSpaced = toneFree.replace(/ü/g, 'v');
    variants.add(vSpaced);
    variants.add(vSpaced.replace(/\s+/g, ''));

    const uSpaced = toneFree.replace(/ü/g, 'u');
    variants.add(uSpaced);
    variants.add(uSpaced.replace(/\s+/g, ''));
  }

  return Array.from(variants);
}
