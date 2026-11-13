import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { saveWordToDeck, type DictionaryEntry } from './dictionaryService.ts';

export interface DomainTerminologyItem {
  simplified: string;
  pinyin: string;
  han_viet: string;
  meaning_vi: string;
  english_equiv: string;
  sample_sentence_zh: string;
  sample_sentence_vi: string;
}

export interface SpecializedDomainPack {
  id: string;
  slug: string;
  title_vi: string;
  description_vi: string;
  terminology_list: DomainTerminologyItem[];
}

export type TranslationDirection = 'zh_to_vi' | 'vi_to_zh';
export type TranslationLevel = 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6' | 'hsk7_9' | 'it_business';

export interface RequiredKeywordItem {
  word_or_pattern: string;
  pinyin: string;
  hint_vi: string;
}

export interface TranslationDrill {
  id: string;
  direction: TranslationDirection;
  level: TranslationLevel;
  domain_slug: string;
  source_text: string;
  reference_translations: string[];
  required_keywords: RequiredKeywordItem[];
  translation_pitfalls_vi: string;
}

export interface TokenDiffItem {
  text: string;
  status: 'match' | 'missing' | 'error' | 'extra';
  note?: string;
}

export interface TranslationCritique {
  overall_score: number;
  accuracy_score: number; // Fidelity 40%
  grammar_score: number; // Grammar 30%
  naturalness_score: number; // Register/Collocation 30%
  corrected_version: string;
  superior_native_version: string;
  token_diffs: TokenDiffItem[];
  detailed_feedback_vi: string;
}

export interface UserTranslationSubmission {
  id: string;
  user_id?: string | null;
  drill_id: string;
  user_output: string;
  accuracy_score: number;
  naturalness_score: number;
  grammar_score: number;
  ai_critique: TranslationCritique;
  created_at: string;
}

const LOCAL_SUBMISSIONS_KEY = 'hanzigo_translation_submissions_v1';

// ---------------------------------------------------------------------------
// Curated Specialized Domain Packs (HSK 3.0 & Industry Tracks)
// ---------------------------------------------------------------------------

export const CURATED_DOMAIN_PACKS: SpecializedDomainPack[] = [
  {
    id: 'pack-it-software',
    slug: 'it-software',
    title_vi: 'Tiếng Trung cho Kỹ sư CNTT & Phần mềm',
    description_vi:
      'Thuật ngữ Backend, Frontend, Database, API, Microservices và giao tiếp họp Agile/Scrum hàng ngày bằng tiếng Trung.',
    terminology_list: [
      {
        simplified: '数据库',
        pinyin: 'shùjùkù',
        han_viet: 'Số dữ khố',
        meaning_vi: 'Cơ sở dữ liệu',
        english_equiv: 'Database',
        sample_sentence_zh: '我们需要优化数据库的索引查询性能。',
        sample_sentence_vi: 'Chúng ta cần tối ưu hóa hiệu năng truy vấn chỉ mục của cơ sở dữ liệu.',
      },
      {
        simplified: '后端接口',
        pinyin: 'hòuduān jiēkǒu',
        han_viet: 'Hậu đoan tiếp khẩu',
        meaning_vi: 'API phía Backend',
        english_equiv: 'Backend API',
        sample_sentence_zh: '前端已经调通了登录的后端接口。',
        sample_sentence_vi: 'Phía Frontend đã gọi thông API đăng nhập từ Backend rồi.',
      },
      {
        simplified: '敏捷开发',
        pinyin: 'mǐnjié kāifā',
        han_viet: 'Mẫn tiệp khai phát',
        meaning_vi: 'Phát triển phần mềm linh hoạt (Agile)',
        english_equiv: 'Agile Development',
        sample_sentence_zh: '我们团队采用敏捷开发模式，每天早上开站会。',
        sample_sentence_vi: 'Đội ngũ chúng tôi áp dụng mô hình Agile, mỗi sáng đều họp Stand-up.',
      },
      {
        simplified: '代码评审',
        pinyin: 'dàimǎ píngshěn',
        han_viet: 'Đại mã bình thẩm',
        meaning_vi: 'Đánh giá / Duyệt mã nguồn',
        english_equiv: 'Code Review',
        sample_sentence_zh: '提交合并请求之前，必须先通过代码评审。',
        sample_sentence_vi: 'Trước khi gửi Merge Request, bắt buộc phải vượt qua bước Code Review.',
      },
      {
        simplified: '部署上线',
        pinyin: 'bùshǔ shàngxiàn',
        han_viet: 'Bộ thử thượng tuyến',
        meaning_vi: 'Triển khai lên môi trường Production',
        english_equiv: 'Deploy to Production',
        sample_sentence_zh: '今晚十点整进行新版本的部署上线。',
        sample_sentence_vi: 'Đúng 10 giờ tối nay sẽ tiến hành deploy phiên bản mới lên production.',
      },
      {
        simplified: '微服务架构',
        pinyin: 'wēifúwù jiàgòu',
        han_viet: 'Vi phục vụ giá cấu',
        meaning_vi: 'Kiến trúc Microservices',
        english_equiv: 'Microservices Architecture',
        sample_sentence_zh: '为了提高系统扩展性，我们迁移到了微服务架构。',
        sample_sentence_vi: 'Để tăng khả năng mở rộng hệ thống, chúng tôi đã chuyển sang kiến trúc Microservices.',
      },
      {
        simplified: '缓存',
        pinyin: 'huǎncún',
        han_viet: 'Hoãn tồn',
        meaning_vi: 'Bộ nhớ đệm',
        english_equiv: 'Cache',
        sample_sentence_zh: '使用Redis缓存可以大幅减轻数据库压力。',
        sample_sentence_vi: 'Sử dụng bộ nhớ đệm Redis có thể giảm tải đáng kể áp lực cho cơ sở dữ liệu.',
      },
    ],
  },
  {
    id: 'pack-ecommerce-logistics',
    slug: 'ecommerce-logistics',
    title_vi: 'Thương mại Điện tử & Logistics Xuất Nhập Khẩu',
    description_vi:
      'Từ vựng chuyên sâu cho đàm phán thương mại Trung - Việt, thông quan, kho ngoại quan và vận hành TMĐT.',
    terminology_list: [
      {
        simplified: '清关',
        pinyin: 'qīngguān',
        han_viet: 'Thanh quan',
        meaning_vi: 'Thông quan, làm thủ tục hải quan',
        english_equiv: 'Customs Clearance',
        sample_sentence_zh: '这批货物预计明天上午完成清关手续。',
        sample_sentence_vi: 'Lô hàng này dự kiến sáng mai sẽ hoàn tất thủ tục thông quan.',
      },
      {
        simplified: '供应链',
        pinyin: 'gōngyìngliàn',
        han_viet: 'Cung ứng liên',
        meaning_vi: 'Chuỗi cung ứng',
        english_equiv: 'Supply Chain',
        sample_sentence_zh: '稳定的供应链是跨境电商成功的关键。',
        sample_sentence_vi: 'Chuỗi cung ứng ổn định là chìa khóa thành công của TMĐT xuyên biên giới.',
      },
      {
        simplified: '保税仓',
        pinyin: 'bǎoshuìcāng',
        han_viet: 'Bảo thuế thương',
        meaning_vi: 'Kho ngoại quan',
        english_equiv: 'Bonded Warehouse',
        sample_sentence_zh: '商品先存入保税仓，客户下单后直接发货。',
        sample_sentence_vi: 'Hàng hóa được lưu sẵn tại kho ngoại quan, khách đặt đơn xong sẽ giao trực tiếp.',
      },
      {
        simplified: '提单',
        pinyin: 'tídān',
        han_viet: 'Đề đơn',
        meaning_vi: 'Vận đơn đường biển / hàng không',
        english_equiv: 'Bill of Lading (B/L)',
        sample_sentence_zh: '收到尾款后，我们会立刻寄出正本提单。',
        sample_sentence_vi: 'Sau khi nhận đủ tiền thanh toán cuối, chúng tôi sẽ gửi ngay vận đơn gốc.',
      },
      {
        simplified: '直播带货',
        pinyin: 'zhíbò dàihuò',
        han_viet: 'Trực bá đới hóa',
        meaning_vi: 'Livestream bán hàng',
        english_equiv: 'Livestream E-commerce',
        sample_sentence_zh: '如今很多品牌通过直播带货来提升销量。',
        sample_sentence_vi: 'Ngày nay rất nhiều thương hiệu tăng doanh số thông qua livestream bán hàng.',
      },
    ],
  },
  {
    id: 'pack-tourism-hospitality',
    slug: 'tourism-hospitality',
    title_vi: 'Du lịch, Khách sạn & Dẫn đoàn Quốc tế',
    description_vi:
      'Thuật ngữ nghiệp vụ khách sạn, đặt vé, lịch trình tour và xử lý tình huống cho hướng dẫn viên tiếng Trung.',
    terminology_list: [
      {
        simplified: '办理入住',
        pinyin: 'bànlǐ rùzhù',
        han_viet: 'Biện lý nhập trụ',
        meaning_vi: 'Làm thủ tục nhận phòng (Check-in)',
        english_equiv: 'Check-in',
        sample_sentence_zh: '请出示您的护照，我帮您办理入住手续。',
        sample_sentence_vi: 'Xin vui lòng xuất trình hộ chiếu, tôi sẽ giúp quý khách làm thủ tục nhận phòng.',
      },
      {
        simplified: '行程安排',
        pinyin: 'xíngchéng ānpái',
        han_viet: 'Hành trình an bài',
        meaning_vi: 'Lịch trình tour / Sắp xếp chuyến đi',
        english_equiv: 'Itinerary',
        sample_sentence_zh: '这是我们五天四晚的详细行程安排。',
        sample_sentence_vi: 'Đây là lịch trình chi tiết 5 ngày 4 đêm của chúng ta.',
      },
      {
        simplified: '名胜古迹',
        pinyin: 'míngshèng gǔjì',
        han_viet: 'Danh thắng cổ tích',
        meaning_vi: 'Danh lam thắng cảnh & di tích lịch sử',
        english_equiv: 'Places of Historic Interest',
        sample_sentence_zh: '河内有许多历史悠久的名胜古迹。',
        sample_sentence_vi: 'Hà Nội có rất nhiều danh lam thắng cảnh lịch sử lâu đời.',
      },
    ],
  },
  {
    id: 'pack-hsk79-academic',
    slug: 'hsk-7-9-academic',
    title_vi: 'HSK 3.0 Cao cấp (Cấp 7–9) & Học thuật',
    description_vi:
      'Từ vựng học thuật, chính luận, nghiên cứu khoa học và kinh tế vĩ mô theo chuẩn HSK 3.0 cấp 7–9.',
    terminology_list: [
      {
        simplified: '可持续发展',
        pinyin: 'kě chíxù fāzhǎn',
        han_viet: 'Khả trì tục phát triển',
        meaning_vi: 'Phát triển bền vững',
        english_equiv: 'Sustainable Development',
        sample_sentence_zh: '推动绿色能源转型是实现可持续发展的必由之路。',
        sample_sentence_vi: 'Thúc đẩy chuyển đổi năng lượng xanh là con đường tất yếu để đạt được phát triển bền vững.',
      },
      {
        simplified: '数字化转型',
        pinyin: 'shùzìhuà zhuǎnxíng',
        han_viet: 'Số tự hóa chuyển hình',
        meaning_vi: 'Chuyển đổi số',
        english_equiv: 'Digital Transformation',
        sample_sentence_zh: '传统制造业正在加速推进数字化转型。',
        sample_sentence_vi: 'Ngành sản xuất truyền thống đang đẩy nhanh tiến trình chuyển đổi số.',
      },
      {
        simplified: '实证研究',
        pinyin: 'shízhèng yánjiū',
        han_viet: 'Thực chứng nghiên cứu',
        meaning_vi: 'Nghiên cứu thực nghiệm',
        english_equiv: 'Empirical Research',
        sample_sentence_zh: '该论文通过大量实证研究验证了这一假设。',
        sample_sentence_vi: 'Bài luận văn này đã kiểm chứng giả thuyết trên thông qua nhiều nghiên cứu thực nghiệm.',
      },
      {
        simplified: '相辅相成',
        pinyin: 'xiāngfǔ-xiāngchéng',
        han_viet: 'Tương phụ tương thành',
        meaning_vi: 'Bổ trợ và hoàn thiện lẫn nhau',
        english_equiv: 'Complement each other',
        sample_sentence_zh: '经济发展与环境保护应当相辅相成，不可偏废。',
        sample_sentence_vi: 'Phát triển kinh tế và bảo vệ môi trường cần bổ trợ lẫn nhau, không thể xem nhẹ bên nào.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Curated Translation Drills (Zh <-> Vi)
// ---------------------------------------------------------------------------

export const CURATED_TRANSLATION_DRILLS: TranslationDrill[] = [
  {
    id: 'drill-vi2zh-it-1',
    direction: 'vi_to_zh',
    level: 'it_business',
    domain_slug: 'it-software',
    source_text: 'Trước khi deploy phiên bản mới lên production, đội ngũ kỹ thuật cần hoàn tất bước Code Review và tối ưu hóa cơ sở dữ liệu.',
    reference_translations: [
      '在将新版本部署上线之前，技术团队需要完成代码评审并优化数据库。',
      '把新版本部署上线前，技术团队要先完成代码评审并优化数据库。',
    ],
    required_keywords: [
      { word_or_pattern: '部署上线', pinyin: 'bùshǔ shàngxiàn', hint_vi: 'Deploy lên production' },
      { word_or_pattern: '代码评审', pinyin: 'dàimǎ píngshěn', hint_vi: 'Code Review' },
      { word_or_pattern: '数据库', pinyin: 'shùjùkù', hint_vi: 'Cơ sở dữ liệu' },
      { word_or_pattern: '在...之前', pinyin: 'zài... zhīqián', hint_vi: 'Cấu trúc "Trước khi..." đặt ở đầu câu' },
    ],
    translation_pitfalls_vi:
      'Lưu ý: Mệnh đề chỉ thời gian "Trước khi..." (在...之前) trong tiếng Trung phải đặt TRƯỚC chủ ngữ hoặc ngay sau chủ ngữ, không đặt cuối câu như tiếng Việt. Định ngữ "phiên bản mới" (新版本) đứng trước động từ qua giới từ 把/将.',
  },
  {
    id: 'drill-vi2zh-hsk5-1',
    direction: 'vi_to_zh',
    level: 'hsk5',
    domain_slug: 'ecommerce-logistics',
    source_text: 'Bởi vì lô hàng này chưa hoàn tất thủ tục thông quan nên chúng tôi tạm thời chưa thể giao hàng cho khách hàng.',
    reference_translations: [
      '由于这批货物尚未完成清关手续，我们暂时无法向客户发货。',
      '因为这批货还没有办完清关手续，所以我们暂时不能给客户发货。',
    ],
    required_keywords: [
      { word_or_pattern: '清关', pinyin: 'qīngguān', hint_vi: 'Thông quan' },
      { word_or_pattern: '由于 / 因为', pinyin: 'yóuyú / yīnwèi', hint_vi: 'Bởi vì' },
      { word_or_pattern: '暂时', pinyin: 'zànshí', hint_vi: 'Tạm thời' },
    ],
    translation_pitfalls_vi:
      'Lưu ý: Trạng từ "tạm thời" (暂时) phải đứng trước động từ năng nguyện (无法 / 不能). Cụm "giao hàng cho khách" theo trật tự tiếng Trung là 给客户发货 hoặc 向客户发货 (Giới từ + Đối tượng + Động từ).',
  },
  {
    id: 'drill-vi2zh-hsk79-1',
    direction: 'vi_to_zh',
    level: 'hsk7_9',
    domain_slug: 'hsk-7-9-academic',
    source_text: 'Chuyển đổi số và phát triển bền vững bổ trợ lẫn nhau, giúp doanh nghiệp nâng cao năng lực cạnh tranh lâu dài.',
    reference_translations: [
      '数字化转型与可持续发展相辅相成，有助于企业提升长期竞争力。',
      '数字化转型和可持续发展相辅相成，帮助企业提高长期竞争力。',
    ],
    required_keywords: [
      { word_or_pattern: '数字化转型', pinyin: 'shùzìhuà zhuǎnxíng', hint_vi: 'Chuyển đổi số' },
      { word_or_pattern: '可持续发展', pinyin: 'kě chíxù fāzhǎn', hint_vi: 'Phát triển bền vững' },
      { word_or_pattern: '相辅相成', pinyin: 'xiāngfǔ-xiāngchéng', hint_vi: 'Bổ trợ lẫn nhau' },
    ],
    translation_pitfalls_vi:
      'Tránh dịch word-by-word thành *帮助企业提高竞争能力长期 (sai vị trí định ngữ!). Định ngữ "lâu dài" (长期) phải đặt TRƯỚC trung tâm ngữ "năng lực cạnh tranh" (竞争力).',
  },
  {
    id: 'drill-zh2vi-hsk79-1',
    direction: 'zh_to_vi',
    level: 'hsk7_9',
    domain_slug: 'hsk-7-9-academic',
    source_text: '该实证研究表明，人工智能技术的大规模应用不仅重构了传统的劳动力市场，也对高等教育提出了全新的要求。',
    reference_translations: [
      'Nghiên cứu thực nghiệm này cho thấy việc ứng dụng quy mô lớn công nghệ trí tuệ nhân tạo không chỉ tái cấu trúc thị trường lao động truyền thống mà còn đặt ra những yêu cầu hoàn toàn mới đối với giáo dục đại học.',
    ],
    required_keywords: [
      { word_or_pattern: '实证研究', pinyin: 'shízhèng yánjiū', hint_vi: 'Nghiên cứu thực nghiệm' },
      { word_or_pattern: '不仅...也...', pinyin: 'bùjǐn... yě...', hint_vi: 'Không chỉ... mà còn...' },
      { word_or_pattern: '重构', pinyin: 'chónggòu', hint_vi: 'Tái cấu trúc' },
    ],
    translation_pitfalls_vi:
      'Lưu ý cụm danh từ dài có nhiều tầng 的: "人工智能技术的大规模应用" phải dịch ngược từ trung tâm ngữ 应用 (việc ứng dụng) ➔ quy mô lớn ➔ công nghệ trí tuệ nhân tạo.',
  },
  {
    id: 'drill-zh2vi-it-1',
    direction: 'zh_to_vi',
    level: 'it_business',
    domain_slug: 'it-software',
    source_text: '为了减轻核心数据库的并发压力，架构师决定将高频访问的热点数据放入Redis缓存中。',
    reference_translations: [
      'Để giảm tải áp lực đồng thời cho cơ sở dữ liệu lõi, kiến trúc sư hệ thống đã quyết định đưa dữ liệu nóng được truy cập tần suất cao vào bộ nhớ đệm Redis.',
    ],
    required_keywords: [
      { word_or_pattern: '并发压力', pinyin: 'bìngfā yālì', hint_vi: 'Áp lực đồng thời (Concurrency)' },
      { word_or_pattern: '热点数据', pinyin: 'rèdiǎn shùjù', hint_vi: 'Dữ liệu nóng (Hot data)' },
      { word_or_pattern: '缓存', pinyin: 'huǎncún', hint_vi: 'Bộ nhớ đệm (Cache)' },
    ],
    translation_pitfalls_vi:
      'Chú ý cấu trúc câu chữ 将 (tương đương 把): 将 [tân ngữ dài] 放入 [nơi chốn] 中 ➔ đưa [dữ liệu...] vào trong [bộ nhớ đệm...].',
  },
];

// ---------------------------------------------------------------------------
// Data Fetching Helpers
// ---------------------------------------------------------------------------

export async function listSpecializedDomainPacks(): Promise<SpecializedDomainPack[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CURATED_DOMAIN_PACKS;
  }
  try {
    const { data, error } = await supabase
      .from('specialized_domain_packs')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as SpecializedDomainPack[];
      const remoteSlugs = new Set(remote.map((r) => r.slug));
      return [...remote, ...CURATED_DOMAIN_PACKS.filter((p) => !remoteSlugs.has(p.slug))];
    }
  } catch {
    // fallback
  }
  return CURATED_DOMAIN_PACKS;
}

export async function listTranslationDrills(): Promise<TranslationDrill[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CURATED_TRANSLATION_DRILLS;
  }
  try {
    const { data, error } = await supabase
      .from('translation_drills')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as TranslationDrill[];
      const remoteIds = new Set(remote.map((r) => r.id));
      return [...remote, ...CURATED_TRANSLATION_DRILLS.filter((d) => !remoteIds.has(d.id))];
    }
  } catch {
    // fallback
  }
  return CURATED_TRANSLATION_DRILLS;
}

// ---------------------------------------------------------------------------
// 3-Axis AI Translation Evaluator (Fidelity 40% + Grammar 30% + Naturalness 30%)
// ---------------------------------------------------------------------------

function normalizeTextForComparison(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[，。！？、；：“”‘’（）,.!?;:"'()\s]+/g, ' ')
    .trim();
}

export function evaluateTranslationSubmission(
  drill: TranslationDrill,
  userOutput: string
): TranslationCritique {
  const cleanOutput = (userOutput || '').trim();
  const primaryRef = drill.reference_translations[0] || '';

  if (!cleanOutput) {
    return {
      overall_score: 0,
      accuracy_score: 0,
      grammar_score: 0,
      naturalness_score: 0,
      corrected_version: primaryRef,
      superior_native_version: drill.reference_translations[1] || primaryRef,
      token_diffs: [{ text: '(Chưa nhập bản dịch)', status: 'missing' }],
      detailed_feedback_vi: 'Vui lòng nhập bản dịch của bạn trước khi chấm điểm.',
    };
  }

  // 1. Fidelity Score (40% weight): Keyword & reference overlap
  let keywordMatches = 0;
  const missingKeywords: string[] = [];

  for (const kw of drill.required_keywords) {
    const alternatives = kw.word_or_pattern.split('/').map((s) => s.trim());
    // Strip ellipsis like "在...之前" -> check if core tokens exist
    const matched = alternatives.some((alt) => {
      if (alt.includes('...')) {
        const parts = alt.split('...').map((p) => p.trim()).filter(Boolean);
        return parts.every((p) => cleanOutput.includes(p));
      }
      if (drill.direction === 'zh_to_vi') {
        return normalizeTextForComparison(cleanOutput).includes(
          normalizeTextForComparison(kw.hint_vi.split('(')[0])
        );
      }
      return cleanOutput.includes(alt);
    });

    if (matched) {
      keywordMatches += 1;
    } else {
      missingKeywords.push(kw.word_or_pattern);
    }
  }

  const kwRatio =
    drill.required_keywords.length > 0 ? keywordMatches / drill.required_keywords.length : 1;

  // Compute character/word overlap against reference
  const refNorm = normalizeTextForComparison(primaryRef);
  const outNorm = normalizeTextForComparison(cleanOutput);
  const refTokens = drill.direction === 'vi_to_zh' ? Array.from(refNorm.replace(/\s+/g, '')) : refNorm.split(' ');
  const outTokens = drill.direction === 'vi_to_zh' ? Array.from(outNorm.replace(/\s+/g, '')) : outNorm.split(' ');

  const refSet = new Set(refTokens.filter(Boolean));
  let overlapCount = 0;
  for (const tok of outTokens) {
    if (refSet.has(tok)) overlapCount += 1;
  }
  const overlapRatio = refTokens.length > 0 ? Math.min(1, overlapCount / Math.max(1, refTokens.length * 0.85)) : 0;

  const accuracyScore = Math.round(Math.min(100, (kwRatio * 0.65 + overlapRatio * 0.35) * 100));

  // 2. Grammar & Structure Score (30% weight)
  let grammarScore = 88;
  const grammarIssues: string[] = [];

  if (drill.direction === 'vi_to_zh') {
    const hanziCount = (cleanOutput.match(/[\u4e00-\u9fa5]/g) || []).length;
    if (hanziCount < 4) {
      grammarScore -= 45;
      grammarIssues.push('Bản dịch sang tiếng Trung cần sử dụng chữ Hán hoàn chỉnh.');
    }
    // Check common Vietnamese word-order pitfall: putting 之前/以后 at wrong place or missing 的
    if (drill.source_text.toLowerCase().includes('trước khi') && cleanOutput.endsWith('之前。')) {
      grammarScore -= 18;
      grammarIssues.push('Cụm thời gian "之前" nên đặt ở đầu câu hoặc trước động từ chính thay vì cuối câu.');
    }
    if (cleanOutput.includes('增加水平') || cleanOutput.includes('看书报') || cleanOutput.includes('做问题')) {
      grammarScore -= 20;
      grammarIssues.push('Phát hiện lỗi kết hợp từ dịch sát nghĩa tiếng Việt (VD: *增加水平 / *做问题).');
    }
    if (cleanOutput.length < primaryRef.length * 0.45) {
      grammarScore -= 20;
      grammarIssues.push('Câu dịch quá ngắn, có thể bị thiếu thành phần vị ngữ hoặc tân ngữ.');
    }
  } else {
    if (outTokens.length < refTokens.length * 0.45) {
      grammarScore -= 22;
      grammarIssues.push('Câu dịch tiếng Việt chưa truyền tải đủ các vế câu phức.');
    }
  }
  grammarScore = Math.max(20, Math.min(100, grammarScore));

  // 3. Naturalness & Register Score (30% weight)
  let naturalnessScore = Math.round(
    Math.min(100, (overlapRatio * 0.55 + kwRatio * 0.45) * 100 + (grammarIssues.length === 0 ? 10 : -10))
  );
  naturalnessScore = Math.max(25, Math.min(100, naturalnessScore));

  const overallScore = Math.round(
    accuracyScore * 0.4 + grammarScore * 0.3 + naturalnessScore * 0.3
  );

  // Build token diffs for visual highlighting
  const tokenDiffs: TokenDiffItem[] = [];
  if (drill.direction === 'vi_to_zh') {
    const outChars = Array.from(cleanOutput);
    for (const ch of outChars) {
      if (/[\s，。！？、]/.test(ch)) {
        tokenDiffs.push({ text: ch, status: 'match' });
      } else if (refSet.has(ch)) {
        tokenDiffs.push({ text: ch, status: 'match' });
      } else {
        tokenDiffs.push({
          text: ch,
          status: 'extra',
          note: 'Từ diễn đạt khác với bản chuẩn',
        });
      }
    }
  } else {
    for (const word of cleanOutput.split(/\s+/)) {
      const norm = normalizeTextForComparison(word);
      if (refSet.has(norm)) {
        tokenDiffs.push({ text: word, status: 'match' });
      } else {
        tokenDiffs.push({ text: word, status: 'extra', note: 'Cách diễn đạt thay thế' });
      }
    }
  }

  for (const mk of missingKeywords) {
    tokenDiffs.push({
      text: `[Thiếu: ${mk}]`,
      status: 'missing',
      note: 'Từ khóa hoặc cấu trúc trọng tâm bị bỏ sót',
    });
  }

  const feedbackParts: string[] = [];
  if (missingKeywords.length === 0 && grammarIssues.length === 0) {
    feedbackParts.push('Xuất sắc! Bạn đã nắm bắt đầy đủ từ khóa chuyên ngành và giữ đúng trật tự ngữ pháp.');
  } else {
    if (missingKeywords.length > 0) {
      feedbackParts.push(`Cần bổ sung từ khóa/cấu trúc quan trọng: ${missingKeywords.join(', ')}.`);
    }
    if (grammarIssues.length > 0) {
      feedbackParts.push(grammarIssues.join(' '));
    }
  }
  feedbackParts.push(`Mẹo bản xứ: ${drill.translation_pitfalls_vi}`);

  return {
    overall_score: overallScore,
    accuracy_score: accuracyScore,
    grammar_score: grammarScore,
    naturalness_score: naturalnessScore,
    corrected_version: primaryRef,
    superior_native_version: drill.reference_translations[1] || primaryRef,
    token_diffs: tokenDiffs,
    detailed_feedback_vi: feedbackParts.join(' '),
  };
}

/**
 * Persist user's translation submission to Supabase or localStorage
 */
export async function submitTranslationAttempt(params: {
  drill: TranslationDrill;
  userOutput: string;
  user?: { id?: string | null } | null;
}): Promise<UserTranslationSubmission> {
  const { drill, userOutput, user } = params;
  const critique = evaluateTranslationSubmission(drill, userOutput);

  const submission: UserTranslationSubmission = {
    id: `sub-${Date.now()}`,
    user_id: user?.id || null,
    drill_id: drill.id,
    user_output: userOutput,
    accuracy_score: critique.accuracy_score,
    naturalness_score: critique.naturalness_score,
    grammar_score: critique.grammar_score,
    ai_critique: critique,
    created_at: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    const existing = raw ? (JSON.parse(raw) as UserTranslationSubmission[]) : [];
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify([submission, ...existing].slice(0, 30)));
  } catch {
    // ignore storage errors
  }

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_translation_submissions').insert({
        user_id: user.id,
        drill_id: drill.id,
        user_output: userOutput,
        accuracy_score: critique.accuracy_score,
        naturalness_score: critique.naturalness_score,
        grammar_score: critique.grammar_score,
        ai_critique: critique,
      });
    } catch {
      // keep local copy
    }
  }

  return submission;
}

/**
 * Save a specialized domain term into user's SRS Vocabulary Deck
 */
export async function saveDomainTermToSRS(
  term: DomainTerminologyItem,
  user?: { id?: string | null } | null
): Promise<void> {
  const entry: DictionaryEntry = {
    id: `domain-term-${term.simplified}`,
    simplified: term.simplified,
    traditional: term.simplified,
    pinyin: term.pinyin,
    pinyin_numbered: term.pinyin,
    hsk_level: 7,
    han_viet: term.han_viet,
    pos: 'Thuật ngữ chuyên ngành',
    meanings_vi: [`${term.meaning_vi} (${term.english_equiv})`],
    examples: [
      {
        zh: term.sample_sentence_zh,
        pinyin: '',
        vi: term.sample_sentence_vi,
      },
    ],
  };

  await saveWordToDeck(entry, user);
}

