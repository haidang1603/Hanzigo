import { VOCABULARY_LIST } from '../data/chineseData.js';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import {
  parseCustomArticleToParagraphs,
  tokenizeChineseText,
  type ReadingParagraph,
} from '../utils/chineseTokenizer.ts';
import { invokeAiPersonalization } from './aiGateway.js';
import { getSavedDeckWords } from './dictionaryService.ts';
import { recordLearningEvent } from './learningDataService.ts';

export interface ComprehensionQuestion {
  id: string;
  question_vi: string;
  question_zh: string;
  options: string[];
  correct_index: number;
  explanation_vi: string;
  evidence_sentence_id: string;
}

export interface ReadingArticle {
  id: string;
  title_zh: string;
  title_vi: string;
  hsk_level: number;
  topic: string;
  word_count: number;
  estimated_minutes: number;
  paragraphs: ReadingParagraph[];
  comprehension_questions: ComprehensionQuestion[];
  is_user_custom: boolean;
}

export interface VocabularyCoverageReport {
  knownPercentage: number;
  knownCount: number;
  totalUniqueWords: number;
  unknownWords: string[];
  recommendationLabel: string;
}

export interface SentenceGrammarAnalysis {
  sentence: string;
  pattern: string;
  explanation_vi: string;
  breakdown: Array<{ segment: string; role: string; note: string }>;
}

const CUSTOM_ARTICLES_KEY = 'hanzigo_reading_studio_custom_v1';
const SESSIONS_KEY = 'hanzigo_reading_studio_sessions_v1';

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

const BUILTIN_ARTICLE_SEEDS: Array<{
  id: string;
  title_zh: string;
  title_vi: string;
  hsk_level: number;
  topic: string;
  estimated_minutes: number;
  sentences: Array<{ id: string; zh: string; vi: string }>;
  questions: ComprehensionQuestion[];
}> = [
  {
    id: 'art-hsk2-daily-study',
    title_zh: '每天早上的学习习惯',
    title_vi: 'Thói quen học tập mỗi buổi sáng',
    hsk_level: 2,
    topic: 'Đời sống & Học tập',
    estimated_minutes: 3,
    sentences: [
      {
        id: 's1',
        zh: '每天早上七点，我喜欢喝一杯热茶，然后开始学习中文。',
        vi: 'Mỗi sáng lúc 7 giờ, tôi thích uống một tách trà nóng rồi bắt đầu học tiếng Trung.',
      },
      {
        id: 's2',
        zh: '虽然汉字很难，但是每天坚持练习二十分钟，进步就会很快。',
        vi: 'Tuy chữ Hán rất khó, nhưng mỗi ngày kiên trì luyện tập 20 phút thì tiến bộ sẽ rất nhanh.',
      },
      {
        id: 's3',
        zh: '周末的时候，我常和朋友去图书馆看书或者练习口语。',
        vi: 'Vào cuối tuần, tôi thường cùng bạn đến thư viện đọc sách hoặc luyện khẩu ngữ.',
      },
    ],
    questions: [
      {
        id: 'q1',
        question_vi: 'Tác giả thường làm gì vào lúc 7 giờ sáng?',
        question_zh: '作者每天早上七点做什么？',
        options: [
          'Đi ngủ thêm 20 phút',
          'Uống một tách trà nóng rồi học tiếng Trung',
          'Đi đến thư viện ngay lập tức',
          'Gọi điện cho bạn bè',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 1 nêu rõ tác giả thích uống một tách trà nóng rồi bắt đầu học tiếng Trung vào 7 giờ sáng.',
        evidence_sentence_id: 's1',
      },
      {
        id: 'q2',
        question_vi: 'Theo tác giả, làm thế nào để tiến bộ nhanh khi học chữ Hán?',
        question_zh: '怎么才能快速进步？',
        options: [
          'Chỉ học vào cuối tuần',
          'Mỗi ngày kiên trì luyện tập 20 phút',
          'Không cần luyện viết chữ',
          'Chỉ nghe nhạc tiếng Trung',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 2 nhấn mạnh: "每天坚持练习二十分钟，进步就会很快".',
        evidence_sentence_id: 's2',
      },
    ],
  },
  {
    id: 'art-hsk4-digital-life',
    title_zh: '无现金支付与现代生活',
    title_vi: 'Thanh toán không tiền mặt và đời sống hiện đại',
    hsk_level: 4,
    topic: 'Xã hội & Công nghệ',
    estimated_minutes: 4,
    sentences: [
      {
        id: 'h4-s1',
        zh: '如今在中国的城市里，人们出门几乎不需要带现金，只需要一部手机就够了。',
        vi: 'Ngày nay tại các thành phố ở Trung Quốc, mọi người ra ngoài hầu như không cần mang tiền mặt, chỉ cần một chiếc điện thoại là đủ.',
      },
      {
        id: 'h4-s2',
        zh: '无论是坐地铁、买早饭，还是在超市购物，大家习惯用二维码扫码付款。',
        vi: 'Dù là đi tàu điện ngầm, mua bữa sáng hay mua sắm ở siêu thị, mọi người đều quen quét mã QR để thanh toán.',
      },
      {
        id: 'h4-s3',
        zh: '这种方便的方式不仅节省时间，而且让日常生活变得越来越高效。',
        vi: 'Phương thức tiện lợi này không chỉ tiết kiệm thời gian mà còn giúp cuộc sống hằng ngày ngày càng hiệu quả hơn.',
      },
    ],
    questions: [
      {
        id: 'h4-q1',
        question_vi: 'Mọi người ở các thành phố Trung Quốc thường thanh toán bằng cách nào?',
        question_zh: '大家习惯怎么付款？',
        options: [
          'Chỉ dùng tiền xu',
          'Quét mã QR bằng điện thoại',
          'Ký séc ngân hàng',
          'Đổi hàng trực tiếp',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 2 nói rõ: "大家习惯用二维码扫码付款".',
        evidence_sentence_id: 'h4-s2',
      },
    ],
  },
  {
    id: 'art-hsk6-reading-habit',
    title_zh: '深度阅读的价值',
    title_vi: 'Giá trị của việc đọc sâu',
    hsk_level: 6,
    topic: 'Văn hóa & Tư duy',
    estimated_minutes: 5,
    sentences: [
      {
        id: 'h6-s1',
        zh: '在信息碎片化的时代，人们每天浏览大量短视频，却越来越难静下心来读完一本书。',
        vi: 'Trong thời đại thông tin phân mảnh, con người mỗi ngày lướt rất nhiều video ngắn nhưng lại ngày càng khó tĩnh tâm đọc trọn một cuốn sách.',
      },
      {
        id: 'h6-s2',
        zh: '其实，深度阅读不仅能够拓宽知识面，更重要的是能锻炼逻辑思维与共情能力。',
        vi: 'Thực ra, đọc sâu không chỉ giúp mở rộng vốn kiến thức mà quan trọng hơn là rèn luyện tư duy logic và năng lực đồng cảm.',
      },
    ],
    questions: [
      {
        id: 'h6-q1',
        question_vi: 'Lợi ích quan trọng nhất của việc đọc sâu được nhắc đến trong bài là gì?',
        question_zh: '深度阅读更重要的是能锻炼什么？',
        options: [
          'Tăng tốc độ lướt mạng xã hội',
          'Rèn luyện tư duy logic và năng lực đồng cảm',
          'Ghi nhớ số điện thoại nhanh hơn',
          'Giảm thời gian ngủ nghỉ',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 2 khẳng định: "更重要的是能锻炼逻辑思维与共情能力".',
        evidence_sentence_id: 'h6-s2',
      },
    ],
  },
  {
    id: 'art-hsk1-weekend-family',
    title_zh: '星期天和家人在一起',
    title_vi: 'Chủ nhật ở nhà cùng gia đình',
    hsk_level: 1,
    topic: 'Gia đình & Đời sống',
    estimated_minutes: 2,
    sentences: [
      {
        id: 'h1-s1',
        zh: '今天是星期天，天气很好，我不去学校。',
        vi: 'Hôm nay là Chủ nhật, thời tiết rất đẹp, tôi không đi học.',
      },
      {
        id: 'h1-s2',
        zh: '上午我和妈妈去水果店买了苹果和西瓜。',
        vi: 'Buổi sáng tôi và mẹ đi cửa hàng hoa quả mua táo và dưa hấu.',
      },
      {
        id: 'h1-s3',
        zh: '中午爸爸做米饭和鱼，我们三个人一起吃饭，都很高兴。',
        vi: 'Buổi trưa bố nấu cơm và cá, ba người chúng tôi cùng ăn cơm, ai cũng rất vui.',
      },
    ],
    questions: [
      {
        id: 'h1-q1',
        question_vi: 'Buổi sáng nhân vật "tôi" và mẹ đã đi đâu?',
        question_zh: '上午“我”和妈妈去了哪里？',
        options: [
          'Đến trường học',
          'Đi cửa hàng hoa quả',
          'Đi bệnh viện',
          'Đi nhà sách',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 2 nêu rõ: "上午我和妈妈去水果店买了苹果和西瓜".',
        evidence_sentence_id: 'h1-s2',
      },
      {
        id: 'h1-q2',
        question_vi: 'Ai là người nấu bữa trưa?',
        question_zh: '中午谁做了饭？',
        options: [
          'Mẹ',
          'Nhân vật "tôi"',
          'Bố',
          'Bạn học',
        ],
        correct_index: 2,
        explanation_vi: 'Câu 3 cho biết: "中午爸爸做米饭和鱼".',
        evidence_sentence_id: 'h1-s3',
      },
    ],
  },
  {
    id: 'art-hsk3-autumn-trip',
    title_zh: '秋天的杭州西湖之旅',
    title_vi: 'Chuyến du lịch Tây Hồ Hàng Châu mùa thu',
    hsk_level: 3,
    topic: 'Du lịch & Văn hóa',
    estimated_minutes: 3,
    sentences: [
      {
        id: 'h3-s1',
        zh: '去年十月，我和姐姐坐高铁去杭州玩了三天。',
        vi: 'Tháng 10 năm ngoái, tôi và chị gái đi tàu cao tốc đến Hàng Châu chơi ba ngày.',
      },
      {
        id: 'h3-s2',
        zh: '秋天的西湖不冷也不热，湖边的桂花开得非常香。',
        vi: 'Tây Hồ vào mùa thu không lạnh cũng không nóng, hoa mộc tê bên hồ nở rất thơm.',
      },
      {
        id: 'h3-s3',
        zh: '我们一边骑自行车看风景，一边拍了很多照片留作纪念。',
        vi: 'Chúng tôi vừa đạp xe ngắm cảnh, vừa chụp rất nhiều ảnh để làm kỷ niệm.',
      },
    ],
    questions: [
      {
        id: 'h3-q1',
        question_vi: 'Hai chị em đã di chuyển đến Hàng Châu bằng phương tiện gì?',
        question_zh: '“我”和姐姐是怎么去杭州的？',
        options: [
          'Đi máy bay',
          'Đi tàu cao tốc',
          'Đi xe khách',
          'Tự lái xe hơi',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 1 nêu rõ: "我和姐姐坐高铁去杭州玩了三天" (坐高铁 = đi tàu cao tốc).',
        evidence_sentence_id: 'h3-s1',
      },
      {
        id: 'h3-q2',
        question_vi: 'Thời tiết ở Tây Hồ vào mùa thu như thế nào?',
        question_zh: '秋天西湖的天气怎么样？',
        options: [
          'Rất lạnh và có tuyết',
          'Nóng bức khó chịu',
          'Mưa to suốt ngày',
          'Không lạnh cũng không nóng',
        ],
        correct_index: 3,
        explanation_vi: 'Câu 2 miêu tả: "秋天的西湖不冷也不热".',
        evidence_sentence_id: 'h3-s2',
      },
    ],
  },
  {
    id: 'art-hsk5-work-life-balance',
    title_zh: '如何在忙碌中保持工作与生活的平衡',
    title_vi: 'Cách giữ cân bằng giữa công việc và cuộc sống khi bận rộn',
    hsk_level: 5,
    topic: 'Sự nghiệp & Tâm lý',
    estimated_minutes: 4,
    sentences: [
      {
        id: 'h5-s1',
        zh: '如今许多年轻人面临着较大的工作压力，经常因为加班而忽略了休息。',
        vi: 'Ngày nay nhiều người trẻ đối mặt với áp lực công việc khá lớn, thường vì tăng ca mà lơ là việc nghỉ ngơi.',
      },
      {
        id: 'h5-s2',
        zh: '事实上，高效的工作并不依赖长时间的消耗，而在于明确任务的轻重缓急。',
        vi: 'Thực tế, làm việc hiệu quả không phụ thuộc vào việc tiêu hao thời gian dài, mà nằm ở chỗ xác định rõ mức độ ưu tiên của nhiệm vụ.',
      },
      {
        id: 'h5-s3',
        zh: '下班后适当运动或陪伴家人，反而能让人精力更充沛，第二天效率更高。',
        vi: 'Sau giờ làm vận động vừa phải hoặc ở bên gia đình ngược lại sẽ giúp tinh thần sung mãn hơn, hôm sau hiệu suất cao hơn.',
      },
    ],
    questions: [
      {
        id: 'h5-q1',
        question_vi: 'Theo tác giả, yếu tố cốt lõi giúp làm việc hiệu quả là gì?',
        question_zh: '作者认为高效工作的关键是什么？',
        options: [
          'Tăng ca càng nhiều càng tốt',
          'Xác định rõ mức độ nặng nhẹ, gấp gáp của nhiệm vụ',
          'Từ bỏ các hoạt động giải trí cuối tuần',
          'Làm nhiều việc cùng một lúc',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 2 giải thích: "而在于明确任务的轻重缓急" (轻重缓急 = mức độ ưu tiên/nặng nhẹ gấp gáp).',
        evidence_sentence_id: 'h5-s2',
      },
      {
        id: 'h5-q2',
        question_vi: 'Việc vận động hoặc ở bên gia đình sau giờ làm mang lại tác dụng gì?',
        question_zh: '下班后运动或陪伴家人有什么好处？',
        options: [
          'Giúp tinh thần sung mãn và hiệu suất ngày hôm sau cao hơn',
          'Giúp giảm lương nhưng tăng ngày nghỉ',
          'Khiến công việc ngày hôm sau nhiều hơn',
          'Không ảnh hưởng gì đến công việc',
        ],
        correct_index: 0,
        explanation_vi: 'Câu 3 nêu rõ: "反而能让人精力更充沛，第二天效率更高".',
        evidence_sentence_id: 'h5-s3',
      },
    ],
  },
  {
    id: 'art-hsk79-urban-ecology',
    title_zh: '海绵城市理念与城市生态韧性建设',
    title_vi: 'Mô hình Thành phố Bọt biển và xây dựng khả năng chống chịu sinh thái đô thị',
    hsk_level: 7,
    topic: 'Đô thị & Môi trường',
    estimated_minutes: 5,
    sentences: [
      {
        id: 'h7-s1',
        zh: '随着极端强降雨事件频发，传统以快速排涝为主的灰色基础设施已难以应对现代城市的内涝风险。',
        vi: 'Cùng với việc các đợt mưa lớn cực đoan xảy ra thường xuyên, hạ tầng xám truyền thống vốn lấy tiêu thoát nước nhanh làm chính đã khó ứng phó với rủi ro ngập úng tại đô thị hiện đại.',
      },
      {
        id: 'h7-s2',
        zh: '海绵城市倡导通过透水铺装、下沉式绿地与人工湿地等自然途径，实现雨水的就地吸纳与净化再利用。',
        vi: 'Thành phố bọt biển đề xuất thông qua các giải pháp tự nhiên như mặt đường thấm nước, mảng xanh trũng và đất ngập nước nhân tạo để hấp thụ, làm sạch và tái sử dụng nước mưa tại chỗ.',
      },
      {
        id: 'h7-s3',
        zh: '这一规划转向不仅缓解了防洪压力，也显著改善了城市微气候与生物多样性。',
        vi: 'Sự chuyển hướng quy hoạch này không chỉ giảm bớt áp lực phòng chống lũ lụt mà còn cải thiện rõ rệt vi khí hậu đô thị và đa dạng sinh học.',
      },
    ],
    questions: [
      {
        id: 'h7-q1',
        question_vi: 'Vì sao hạ tầng thoát nước truyền thống ("hạ tầng xám") ngày càng bộc lộ hạn chế?',
        question_zh: '为什么传统灰色基础设施难以应对内涝风险？',
        options: [
          'Vì chi phí bảo trì quá thấp',
          'Vì các đợt mưa lớn cực đoan xảy ra thường xuyên hơn',
          'Vì người dân không sử dụng nước mưa',
          'Vì thiếu mảng xanh trong nhà ở',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 1 nêu nguyên nhân trực tiếp: "随着极端强降雨事件频发...".',
        evidence_sentence_id: 'h7-s1',
      },
      {
        id: 'h7-q2',
        question_vi: 'Ngoài giảm áp lực chống ngập, mô hình thành phố bọt biển còn mang lại lợi ích nào?',
        question_zh: '海绵城市规划转向还带来了哪些附加效益？',
        options: [
          'Tăng tốc độ xây dựng đường cao tốc',
          'Cải thiện vi khí hậu đô thị và đa dạng sinh học',
          'Loại bỏ hoàn toàn nhu cầu xử lý nước thải công nghiệp',
          'Giảm diện tích công viên công cộng',
        ],
        correct_index: 1,
        explanation_vi: 'Câu 3 khẳng định: "也显著改善了城市微气候与生物多样性".',
        evidence_sentence_id: 'h7-s3',
      },
    ],
  },
];

export function getBuiltInReadingArticles(): ReadingArticle[] {
  return BUILTIN_ARTICLE_SEEDS.map((seed) => {
    let wordCount = 0;
    const sentences = seed.sentences.map((s) => {
      const tokens = tokenizeChineseText(s.zh);
      const contentTokens = tokens.filter((t) => !t.is_punctuation);
      wordCount += contentTokens.length;
      return {
        sentence_id: s.id,
        zh_raw: s.zh,
        pinyin_full: contentTokens
          .map((t) => t.pinyin)
          .filter(Boolean)
          .join(' '),
        vi_translation: s.vi,
        tokens,
      };
    });

    return {
      id: seed.id,
      title_zh: seed.title_zh,
      title_vi: seed.title_vi,
      hsk_level: seed.hsk_level,
      topic: seed.topic,
      word_count: wordCount,
      estimated_minutes: seed.estimated_minutes,
      paragraphs: [{ paragraph_index: 0, sentences }],
      comprehension_questions: seed.questions,
      is_user_custom: false,
    };
  });
}

export async function listReadingArticles(): Promise<ReadingArticle[]> {
  const builtins = getBuiltInReadingArticles();
  const customLocal = safeReadJson<ReadingArticle[]>(CUSTOM_ARTICLES_KEY, []);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reading_articles')
        .select('*')
        .order('hsk_level', { ascending: true })
        .limit(30);
      if (!error && Array.isArray(data) && data.length > 0) {
        const dbArticles = data as ReadingArticle[];
        const dbIds = new Set(dbArticles.map((a) => a.id));
        return [...dbArticles, ...customLocal.filter((c) => !dbIds.has(c.id)), ...builtins.filter((b) => !dbIds.has(b.id))];
      }
    } catch {
      // fallback to local
    }
  }

  return [...customLocal, ...builtins];
}

export async function createCustomReadingArticle(params: {
  titleZh: string;
  titleVi?: string;
  rawText: string;
  hskLevel?: number;
  user?: { id?: string | null } | null;
}): Promise<ReadingArticle> {
  const { paragraphs, wordCount } = parseCustomArticleToParagraphs(params.rawText);
  const article: ReadingArticle = {
    id: `custom-art-${Date.now()}`,
    title_zh: params.titleZh.trim() || 'Bài đọc tùy chỉnh',
    title_vi: params.titleVi?.trim() || 'Văn bản người dùng tự nhập',
    hsk_level: params.hskLevel ?? 4,
    topic: 'Custom Article',
    word_count: wordCount,
    estimated_minutes: Math.max(1, Math.ceil(wordCount / 120)),
    paragraphs,
    comprehension_questions: [],
    is_user_custom: true,
  };

  const existing = safeReadJson<ReadingArticle[]>(CUSTOM_ARTICLES_KEY, []);
  safeWriteJson(CUSTOM_ARTICLES_KEY, [article, ...existing].slice(0, 20));

  if (isSupabaseConfigured && supabase && params.user?.id) {
    try {
      await supabase.from('reading_articles').insert({
        title_zh: article.title_zh,
        title_vi: article.title_vi,
        hsk_level: article.hsk_level,
        topic: article.topic,
        word_count: article.word_count,
        estimated_minutes: article.estimated_minutes,
        paragraphs: article.paragraphs,
        comprehension_questions: [],
        is_user_custom: true,
        created_by: params.user.id,
      });
    } catch {
      // non-fatal
    }
  }

  return article;
}

/**
 * Compute personalized vocabulary coverage against user's known/saved words.
 */
export function calculateVocabularyCoverage(
  article: ReadingArticle,
  user?: { id?: string | null } | null,
  extraKnownWords: string[] = []
): VocabularyCoverageReport {
  const saved = getSavedDeckWords(user);
  const foundationalHsk1 = VOCABULARY_LIST.filter((v) => Number(v.level) === 1).map((v) => v.hanzi);
  const knownSet = new Set<string>([...saved, ...foundationalHsk1, ...extraKnownWords]);

  const uniqueWords = new Set<string>();
  for (const para of article.paragraphs) {
    for (const sent of para.sentences) {
      for (const tok of sent.tokens) {
        if (!tok.is_punctuation && tok.text.trim()) {
          uniqueWords.add(tok.text);
        }
      }
    }
  }

  const totalUniqueWords = uniqueWords.size;
  if (totalUniqueWords === 0) {
    return {
      knownPercentage: 100,
      knownCount: 0,
      totalUniqueWords: 0,
      unknownWords: [],
      recommendationLabel: 'Chưa có dữ liệu từ vựng trong bài.',
    };
  }

  let knownCount = 0;
  const unknownWords: string[] = [];
  for (const w of uniqueWords) {
    if (knownSet.has(w)) {
      knownCount += 1;
    } else {
      unknownWords.push(w);
    }
  }

  const knownPercentage = Math.round((knownCount / totalUniqueWords) * 1000) / 10;
  let recommendationLabel = 'Bạn đã biết ';
  if (knownPercentage >= 85 && knownPercentage <= 95) {
    recommendationLabel = `Bạn đã biết ${knownPercentage}% từ vựng trong bài này (Gợi ý đọc tốt: 85% - 95%)`;
  } else if (knownPercentage > 95) {
    recommendationLabel = `Bạn đã biết ${knownPercentage}% từ vựng trong bài này (Rất vừa sức, có thể nâng cấp độ cao hơn)`;
  } else {
    recommendationLabel = `Bạn đã biết ${knownPercentage}% từ vựng trong bài này (Gợi ý đọc tốt: 85% - 95% — hãy lưu các từ mới khi đọc)`;
  }

  return {
    knownPercentage,
    knownCount,
    totalUniqueWords,
    unknownWords,
    recommendationLabel,
  };
}

export async function analyzeSentenceGrammar(
  sentenceText: string,
  hskLevel = 4,
  user?: { id?: string | null } | null
): Promise<SentenceGrammarAnalysis> {
  try {
    const res = (await invokeAiPersonalization({
      taskType: 'grammar_explanation',
      payload: { sentence: sentenceText, hskLevel },
      user: user ?? null,
    })) as { pattern?: string; explanation?: string } | null;

    if (res?.explanation) {
      const tokens = tokenizeChineseText(sentenceText).filter((t) => !t.is_punctuation);
      return {
        sentence: sentenceText,
        pattern: res.pattern || 'Phân tích cú pháp câu',
        explanation_vi: res.explanation,
        breakdown: tokens.slice(0, 6).map((t) => ({
          segment: t.text,
          role: t.pos || 'Từ vựng',
          note: t.meaning_vi || t.pinyin || 'Thành phần câu',
        })),
      };
    }
  } catch {
    // deterministic fallback below
  }

  if (sentenceText.includes('虽然') && sentenceText.includes('但是')) {
    return {
      sentence: sentenceText,
      pattern: '虽然…但是… (Tuy… nhưng…)',
      explanation_vi: 'Cặp liên từ biểu thị quan hệ chuyển ngoặt: thừa nhận vế trước nhưng nhấn mạnh kết quả/nhận định ở vế sau.',
      breakdown: [
        { segment: '虽然', role: 'Liên từ nhượng bộ', note: 'Mở đầu mệnh đề thừa nhận' },
        { segment: '但是', role: 'Liên từ chuyển ngoặt', note: 'Đưa ra ý chính đối lập' },
      ],
    };
  }
  if (sentenceText.includes('不仅') && sentenceText.includes('而且')) {
    return {
      sentence: sentenceText,
      pattern: '不仅…而且… (Không những… mà còn…)',
      explanation_vi: 'Cấu trúc tăng tiến: vế sau bổ sung thông tin ở mức độ cao hơn hoặc quan trọng hơn vế trước.',
      breakdown: [
        { segment: '不仅', role: 'Liên từ tầng 1', note: 'Nêu yếu tố cơ bản' },
        { segment: '而且', role: 'Liên từ tầng 2', note: 'Nhấn mạnh yếu tố tăng tiến' },
      ],
    };
  }
  if (sentenceText.includes('无论') && sentenceText.includes('都')) {
    return {
      sentence: sentenceText,
      pattern: '无论…都… (Bất kể… đều…)',
      explanation_vi: 'Biểu thị điều kiện không giới hạn: trong mọi trường hợp nêu ra, kết quả ở vế "都" vẫn không đổi.',
      breakdown: [
        { segment: '无论', role: 'Liên từ điều kiện', note: 'Liệt kê các khả năng' },
        { segment: '都', role: 'Phó từ tổng quát', note: 'Khẳng định kết quả chung' },
      ],
    };
  }

  const tokens = tokenizeChineseText(sentenceText).filter((t) => !t.is_punctuation);
  return {
    sentence: sentenceText,
    pattern: 'Cấu trúc Chủ ngữ + Trạng ngữ + Vị ngữ + Tân ngữ',
    explanation_vi: 'Câu trần thuật chuẩn tiếng Trung: thành phần thời gian/địa điểm đứng trước động từ chính để xác định bối cảnh hành động.',
    breakdown: tokens.slice(0, 6).map((t) => ({
      segment: t.text,
      role: t.pos || 'Từ vựng',
      note: t.meaning_vi || t.pinyin || 'Thành phần câu',
    })),
  };
}

export async function recordReadingSession(params: {
  user?: { id?: string | null } | null;
  article: ReadingArticle;
  knownPercentage: number;
  savedVocabCount: number;
  quizScore: number;
}): Promise<void> {
  const { user = null, article, knownPercentage, savedVocabCount, quizScore } = params;
  const sessions = safeReadJson<Array<Record<string, unknown>>>(SESSIONS_KEY, []);
  const entry = {
    id: `rsess-${Date.now()}`,
    article_id: article.id,
    known_words_percentage: knownPercentage,
    saved_vocab_count: savedVocabCount,
    quiz_score: quizScore,
    completed_at: new Date().toISOString(),
  };
  safeWriteJson(SESSIONS_KEY, [entry, ...sessions].slice(0, 50));

  void recordLearningEvent({
    userId: user?.id ?? null,
    sourceModule: 'lesson',
    hskLevel: article.hsk_level,
    skillDomain: 'reading',
    itemId: article.id,
    isCorrect: quizScore >= 60,
    scoreEarned: quizScore,
    scoreMax: 100,
    durationMs: article.estimated_minutes * 60000,
    payload: { knownPercentage, savedVocabCount },
  });

  if (isSupabaseConfigured && supabase && user?.id && !article.is_user_custom) {
    try {
      await supabase.from('user_reading_sessions').insert({
        user_id: user.id,
        article_id: article.id,
        known_words_percentage: knownPercentage,
        saved_vocab_count: savedVocabCount,
        quiz_score: quizScore,
        completed_at: entry.completed_at,
      });
    } catch {
      // non-fatal
    }
  }
}
