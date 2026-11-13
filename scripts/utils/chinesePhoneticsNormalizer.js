/**
 * =========================================================================
 * HANZIGO — CHINESE PHONETICS & HAN-VIET NORMALIZER (TASK 32.04)
 * =========================================================================
 * 1. Bidirectional Pinyin converter:
 *    - pinyin_numeric ("nu:3 li4" / "nv3 li4", "jian1 chi2")
 *    - pinyin_display / pinyin_tone ("nǚ lì", "jiān chí")
 *    - pinyin_clean ("nuli", "jianchi")
 * 2. Sino-Vietnamese (Hán-Việt) character & compound word resolver.
 */

const TONE_MARKS = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  A: ['A', 'Ā', 'Á', 'Ǎ', 'À', 'A'],
  E: ['E', 'Ē', 'É', 'Ě', 'È', 'E'],
  I: ['I', 'Ī', 'Í', 'Ǐ', 'Ì', 'I'],
  O: ['O', 'Ō', 'Ó', 'Ǒ', 'Ò', 'O'],
  U: ['U', 'Ū', 'Ú', 'Ǔ', 'Ù', 'U'],
  Ü: ['Ü', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü'],
};

const TONE_CHAR_TO_BASE = new Map();
for (const [base, forms] of Object.entries(TONE_MARKS)) {
  forms.forEach((ch, toneIdx) => {
    if (toneIdx >= 1 && toneIdx <= 4) {
      TONE_CHAR_TO_BASE.set(ch, { base, tone: toneIdx });
    }
  });
}

function applyToneToSyllable(rawSyllable, tone) {
  let syllable = rawSyllable.replace(/u:/g, 'ü').replace(/U:/g, 'Ü');
  // Convert 'v' to 'ü' only when used as vowel in pinyin (e.g. nv, lv, nve, lve)
  syllable = syllable.replace(/([nlNL])v/g, (_, c) => `${c}ü`);
  syllable = syllable.replace(/([nlNL])V/g, (_, c) => `${c}Ü`);

  if (!tone || tone < 1 || tone > 4) {
    return syllable;
  }

  const lower = syllable.toLowerCase();
  let targetIndex = -1;

  if (lower.includes('a')) {
    targetIndex = lower.indexOf('a');
  } else if (lower.includes('e')) {
    targetIndex = lower.indexOf('e');
  } else if (lower.includes('ou')) {
    targetIndex = lower.indexOf('o');
  } else {
    for (let i = lower.length - 1; i >= 0; i -= 1) {
      if ('iouü'.includes(lower[i])) {
        targetIndex = i;
        break;
      }
    }
  }

  if (targetIndex === -1) return syllable;

  const targetChar = syllable[targetIndex];
  const forms = TONE_MARKS[targetChar];
  if (!forms) return syllable;

  return `${syllable.slice(0, targetIndex)}${forms[tone]}${syllable.slice(targetIndex + 1)}`;
}

/**
 * Convert numeric pinyin (e.g. "nu:3 li4", "nv3 li4", "jian1 chi2")
 * to tone-marked pinyin ("nǚ lì", "jiān chí").
 */
export function numericToTone(input = '') {
  const raw = String(input || '').trim();
  if (!raw) return '';

  return raw
    .split(/\s+/)
    .map((token) =>
      token.replace(/([a-zA-ZüÜ:]+)([1-5])?/g, (full, letters, toneDigit) => {
        if (!toneDigit) {
          return applyToneToSyllable(letters, 0);
        }
        return applyToneToSyllable(letters, Number.parseInt(toneDigit, 10));
      })
    )
    .join(' ');
}

/**
 * Convert tone-marked pinyin (e.g. "nǚ lì", "jiān chí")
 * to numeric pinyin ("nv3 li4", "jian1 chi2" or "nu:3 li4" if umlautStyle === 'u:').
 */
export function toneToNumeric(input = '', { umlautStyle = 'v' } = {}) {
  const raw = String(input || '').trim();
  if (!raw) return '';

  const umlautReplacement = umlautStyle === 'u:' ? 'u:' : 'v';

  return raw
    .split(/\s+/)
    .map((token) => {
      let tone = 0;
      let out = '';

      for (const ch of token) {
        const mapped = TONE_CHAR_TO_BASE.get(ch);
        if (mapped) {
          tone = mapped.tone;
          out += mapped.base;
        } else {
          out += ch;
        }
      }

      out = out
        .replace(/ü/g, umlautReplacement)
        .replace(/Ü/g, umlautStyle === 'u:' ? 'U:' : 'V');

      if (/^[a-zA-Z:]+$/.test(out)) {
        return tone >= 1 && tone <= 4 ? `${out}${tone}` : `${out}5`;
      }
      return out;
    })
    .join(' ');
}

/**
 * Strip tone marks, tone numbers, umlauts, and whitespace for fast pg_trgm search.
 */
export function toPinyinClean(input = '') {
  const numeric = toneToNumeric(input, { umlautStyle: 'v' });
  return numeric
    .toLowerCase()
    .replace(/u:/g, 'u')
    .replace(/([nl])v/g, '$1u')
    .replace(/[1-5]/g, '')
    .replace(/[^a-z]/g, '');
}

export const numericToTonePinyin = numericToTone;
export const stripPinyinTones = toPinyinClean;

/**
 * Given numeric OR tone-marked pinyin, produce all canonical formats.
 */
export function normalizePinyinTriple(input = '') {
  const trimmed = String(input || '').trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return {
      pinyin_display: '',
      pinyin_tone: '',
      pinyin_numeric: '',
      pinyin_clean: '',
    };
  }

  const hasNumericDigits = /[1-5]/.test(trimmed);
  const pinyin_display = hasNumericDigits ? numericToTone(trimmed) : trimmed;
  const pinyin_numeric = hasNumericDigits
    ? trimmed.replace(/u:/gi, 'v')
    : toneToNumeric(trimmed, { umlautStyle: 'v' });
  const pinyin_clean = toPinyinClean(pinyin_display);

  return {
    pinyin_display,
    pinyin_tone: pinyin_display,
    pinyin_numeric,
    pinyin_clean,
  };
}

/**
 * Core single-character Han-Viet dictionary (expandable via registerHanVietEntries).
 */
const HAN_VIET_CHAR_MAP = new Map(
  Object.entries({
    我: 'NGÃ', 你: 'NHĨ', 您: 'NẪM', 他: 'THA', 她: 'THA', 它: 'THA', 们: 'MÔN',
    好: 'HẢO', 吗: 'MA', 呢: 'NI', 吧: 'BA', 的: 'ĐÍCH', 了: 'LIỄU', 是: 'THỊ',
    不: 'BẤT', 没: 'MỘT', 有: 'HỮU', 在: 'TẠI', 和: 'HÒA', 与: 'DỮ', 也: 'DÃ',
    都: 'ĐÔ', 很: 'HẬN', 太: 'THÁI', 最: 'TỐI', 更: 'CÁNH', 就: 'TỰU', 才: 'TÀI',
    学: 'HỌC', 习: 'TẬP', 汉: 'HÁN', 语: 'NGỮ', 中: 'TRUNG', 文: 'VĂN', 国: 'QUỐC',
    人: 'NHÂN', 大: 'ĐẠI', 小: 'TIỂU', 多: 'ĐA', 少: 'THIỂU', 上: 'THƯỢNG', 下: 'HẠ',
    前: 'TIỀN', 后: 'HẬU', 左: 'TẢ', 右: 'HỮU', 里: 'LÝ', 外: 'NGOẠI', 内: 'NỘI',
    天: 'THIÊN', 地: 'ĐỊA', 日: 'NHẬT', 月: 'NGUYỆT', 年: 'NIÊN', 时: 'THỜI', 分: 'PHÂN',
    今: 'KIM', 明: 'MINH', 昨: 'TẠC', 早: 'TẢO', 晚: 'VÃN', 午: 'NGỌ', 点: 'ĐIỂM',
    一: 'NHẤT', 二: 'NHỊ', 三: 'TAM', 四: 'TỨ', 五: 'NGŨ', 六: 'LỤC', 七: 'THẤT',
    八: 'BÁT', 九: 'CỬU', 十: 'THẬP', 百: 'BÁCH', 千: 'THIÊN', 万: 'VẠN', 亿: 'ỨC',
    数: 'THỐ', 据: 'CỨ', 库: 'KHỐ', 坚: 'KIÊN', 持: 'TRÌ', 努: 'NỖ', 力: 'LỰC',
    工: 'CÔNG', 作: 'TÁC', 业: 'NGHIỆP', 生: 'SINH', 活: 'HOẠT', 动: 'ĐỘNG',
    老: 'LÃO', 师: 'SƯ', 同: 'ĐỒNG', 朋: 'BẰNG', 友: 'HỮU', 家: 'GIA', 校: 'HIỆU',
    书: 'THƯ', 本: 'BẢN', 字: 'TỰ', 词: 'TỪ', 句: 'CÚ', 话: 'THOẠI', 读: 'ĐỘC',
    写: 'TẢ', 听: 'THÍNH', 说: 'THUYẾT', 看: 'KHÁN', 见: 'KIẾN', 吃: 'NGẬT', 喝: 'HÁT',
    茶: 'TRÀ', 水: 'THỦY', 饭: 'PHẠN', 菜: 'THÁI', 米: 'MỄ', 果: 'QUẢ', 酒: 'TỬU',
    去: 'KHỨ', 来: 'LAI', 回: 'HỒI', 到: 'ĐÁO', 走: 'TẨU', 跑: 'BÀO', 飞: 'PHI',
    车: 'XA', 机: 'CƠ', 路: 'LỘ', 门: 'MÔN', 房: 'PHÒNG', 间: 'GIAN', 桌: 'TRÁC',
    电: 'ĐIỆN', 脑: 'NÃO', 网: 'VÕNG', 络: 'LẠC', 信: 'TÍN', 息: 'TỨC', 技: 'KỸ',
    术: 'THUẬT', 科: 'KHOA', 研: 'NGHIÊN', 究: 'CỨU', 发: 'PHÁT', 展: 'TRIỂN', 进: 'TIẾN',
    步: 'BỘ', 提: 'ĐỀ', 高: 'CAO', 低: 'ĐÊ', 新: 'TÂN', 旧: 'CỰU', 长: 'TRƯỜNG',
    短: 'ĐOẢN', 快: 'KHOÁI', 慢: 'MẠN', 难: 'NAN', 易: 'DỊ', 简: 'GIẢN', 单: 'ĐƠN',
    繁: 'PHỒN', 体: 'THỂ', 系: 'HỆ', 统: 'THỐNG', 管: 'QUẢN', 理: 'LÝ', 设: 'THIẾT',
    计: 'KẾ', 软: 'NHUYỄN', 件: 'KIỆN', 程: 'TRÌNH', 序: 'TỰ', 运: 'VẬN', 行: 'HÀNH',
    问: 'VẤN', 题: 'ĐỀ', 答: 'ĐÁP', 案: 'ÁN', 考: 'KHẢO', 试: 'THÍ', 成: 'THÀNH',
    绩: 'TÍCH', 经: 'KINH', 济: 'TẾ', 社: 'XÃ', 会: 'HỘI', 政: 'CHÍNH', 治: 'TRỊ',
    历: 'LỊCH', 史: 'SỬ', 环: 'HOÀN', 境: 'CẢNH', 保: 'BẢO', 护: 'HỘ', 健: 'KIỆN',
    康: 'KHANG', 医: 'Y', 院: 'VIỆN', 病: 'BỆNH', 药: 'DƯỢC', 心: 'TÂM', 情: 'TÌNH',
    爱: 'ÁI', 喜: 'HỶ', 欢: 'HOAN', 谢: 'TẠ', 对: 'ĐỐI', 起: 'KHỞI', 关: 'QUAN',
    开: 'KHAI', 始: 'THỦY', 结: 'KẾT', 束: 'THÚC', 帮: 'BANG', 助: 'TRỢ', 希: 'HY',
    望: 'VỌNG', 感: 'CẢM', 觉: 'GIÁC', 认: 'NHẬN', 识: 'THỨC', 知: 'TRI', 道: 'ĐẠO',
    想: 'TƯỞNG', 要: 'YẾU', 需: 'NHU', 可: 'KHẢ', 以: 'DĨ', 能: 'NĂNG',
    应: 'ƯNG', 该: 'CAI', 必: 'TẤT', 须: 'TU', 常: 'THƯỜNG', 现: 'HIỆN',
    过: 'QUÁ', 未: 'VỊ', 将: 'TƯƠNG', 实: 'THỰC', 际: 'TẾ', 代: 'ĐẠI',
    化: 'HÓA', 标: 'TIÊU', 准: 'CHUẨN', 质: 'CHẤT', 量: 'LƯỢNG', 价: 'GIÁ', 格: 'CÁCH',
    钱: 'TIỀN', 买: 'MÃI', 卖: 'MẠI', 商: 'THƯƠNG', 品: 'PHẨM', 场: 'TRƯỜNG', 市: 'THỊ',
    公: 'CÔNG', 司: 'TI', 企: 'XÍ', 领: 'LÃNH', 导: 'ĐẠO', 员: 'VIÊN', 客: 'KHÁCH',
    服: 'PHỤC', 务: 'VỤ', 音: 'ÂM', 乐: 'NHẠC', 影: 'ẢNH', 画: 'HỌA', 色: 'SẮC',
    红: 'HỒNG', 黄: 'HOÀNG', 蓝: 'LAM', 绿: 'LỤC', 白: 'BẠCH', 黑: 'HẮC', 金: 'KIM',
    银: 'NGÂN', 山: 'SƠN', 河: 'HÀ', 海: 'HẢI', 风: 'PHONG', 雨: 'VŨ', 雪: 'TUYẾT',
    春: 'XUÂN', 夏: 'HẠ', 秋: 'THU', 冬: 'ĐÔNG', 北: 'BẮC', 京: 'KINH', 越: 'VIỆT',
    南: 'NAM', 东: 'ĐÔNG', 西: 'TÂY', 城: 'THÀNH', 村: 'THÔN', 世: 'THẾ', 界: 'GIỚI',
    全: 'TOÀN', 部: 'BỘ', 析: 'TÍCH', 总: 'TỔNG', 规: 'QUY', 则: 'TẮC',
    法: 'PHÁP', 律: 'LUẬT', 权: 'QUYỀN', 利: 'LỢI', 义: 'NGHĨA', 责: 'TRÁCH', 任: 'NHIỆM',
    安: 'AN', 稳: 'ỔN', 定: 'ĐỊNH', 改: 'CẢI', 革: 'CÁCH', 创: 'SÁNG',
    造: 'TẠO', 建: 'KIẾN', 筑: 'TRÚC', 交: 'GIAO', 通: 'THÔNG', 旅: 'LỮ', 游: 'DU',
    艺: 'NGHỆ', 教: 'GIÁO', 育: 'DỤC', 培: 'BỒI',
    训: 'HUẤN', 练: 'LUYỆN', 复: 'PHỤC', 预: 'DỰ', 备: 'BỊ', 记: 'KÝ', 忆: 'ỨC',
  })
);

/**
 * Register additional character -> Han-Viet readings at runtime (e.g. from seed datasets).
 */
export function registerHanVietReadings(entries = []) {
  for (const item of entries) {
    if (!item?.hanzi || !item?.hanviet) continue;
    const chars = Array.from(String(item.hanzi).trim());
    const syllables = String(item.hanviet).trim().split(/\s+/);
    if (chars.length === 1 && syllables.length === 1) {
      HAN_VIET_CHAR_MAP.set(chars[0], syllables[0].toUpperCase());
    } else if (chars.length === syllables.length) {
      chars.forEach((ch, idx) => {
        if (!HAN_VIET_CHAR_MAP.has(ch)) {
          HAN_VIET_CHAR_MAP.set(ch, syllables[idx].toUpperCase());
        }
      });
    }
  }
}

/**
 * Resolve uppercase Sino-Vietnamese reading for a single or compound Chinese word.
 * Falls back to `fallbackReading` if any character is not in the lookup table.
 */
export function resolveHanVietReading(word = '', fallbackReading = '') {
  const cleanWord = String(word || '').trim();
  if (!cleanWord) return String(fallbackReading || '').trim().toUpperCase();

  if (fallbackReading && String(fallbackReading).trim()) {
    return String(fallbackReading).trim().toUpperCase();
  }

  const chars = Array.from(cleanWord).filter((ch) => /[\u4e00-\u9fa5]/.test(ch));
  if (chars.length === 0) return '';

  const mapped = [];
  for (const ch of chars) {
    const reading = HAN_VIET_CHAR_MAP.get(ch);
    if (reading) {
      mapped.push(reading);
    }
  }

  if (mapped.length === chars.length) {
    return mapped.join(' ');
  }

  return mapped.length > 0 ? mapped.join(' ') : 'HÁN TỰ';
}
