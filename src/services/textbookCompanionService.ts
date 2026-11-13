import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { saveWordToDeck, type DictionaryEntry } from './dictionaryService.ts';
import { createVocabDeck, type VocabDeck } from './vocabWorkspaceService.ts';

export interface TextbookSeries {
  id: string;
  series_slug: 'hsk-standard-course' | 'han-ngu-6-quyen' | 'boya-chinese' | 'msutong';
  title_vi: string;
  title_zh: string;
  publisher: string;
  total_volumes: number;
  description_vi: string;
}

export interface TextbookUnitVocabItem {
  order: number;
  simplified: string;
  pinyin: string;
  pos: string;
  meaning_vi: string;
  dictionary_entry_id?: string;
}

export interface TextbookUnitGrammarItem {
  id: string;
  pattern: string;
  pinyin: string;
  explanation_vi: string;
  example_zh: string;
  example_pinyin: string;
  example_vi: string;
}

export interface TextbookUnitDialogueLine {
  speaker: string;
  zh: string;
  pinyin: string;
  vi: string;
}

export interface TextbookUnitQuizQuestion {
  id: string;
  question_vi: string;
  options: string[];
  correct_index: number;
  explanation_vi: string;
}

export interface TextbookUnit {
  id: string;
  series_id: string;
  volume_number: number;
  unit_number: number;
  title_zh: string;
  title_vi: string;
  unit_vocab_list: TextbookUnitVocabItem[];
  unit_grammar_ids: string[];
  unit_reading_article_id?: string | null;
  unit_listening_track_id?: string | null;
  grammar_points: TextbookUnitGrammarItem[];
  reading_dialogue: TextbookUnitDialogueLine[];
  unit_quiz: TextbookUnitQuizQuestion[];
}

export interface UserTextbookEnrollment {
  user_id?: string | null;
  series_id: string;
  current_volume: number;
  current_unit: number;
  completed_unit_ids: string[];
  updated_at: string;
}

export interface SyncWorkspaceResult {
  deck: VocabDeck;
  syncedWordsCount: number;
  writingChars: string[];
  readingArticleId: string | null;
  listeningTrackId: string | null;
  grammarIds: string[];
}

const LOCAL_ENROLLMENTS_KEY = 'hanzigo_textbook_enrollments_v1';

// ---------------------------------------------------------------------------
// Curated Textbook Series & Units
// ---------------------------------------------------------------------------

export const CURATED_TEXTBOOK_SERIES: TextbookSeries[] = [
  {
    id: 'tb-hsk-standard',
    series_slug: 'hsk-standard-course',
    title_vi: 'HSK Standard Course (Giáo trình Chuẩn HSK)',
    title_zh: 'HSK标准教程',
    publisher: 'Beijing Language & Culture University Press',
    total_volumes: 6,
    description_vi:
      'Bộ giáo trình chuẩn quốc tế kết hợp thi cử và giao tiếp, bám sát đề thi HSK từ cấp 1 đến cấp 6.',
  },
  {
    id: 'tb-han-ngu-6',
    series_slug: 'han-ngu-6-quyen',
    title_vi: 'Giáo trình Hán Ngữ 6 quyển',
    title_zh: '汉语教程',
    publisher: 'ĐH Ngôn ngữ Bắc Kinh (BLCU)',
    total_volumes: 6,
    description_vi:
      'Bộ giáo trình kinh điển tại các trường đại học Việt Nam, nền tảng ngữ âm, chữ Hán và ngữ pháp bài bản.',
  },
  {
    id: 'tb-boya',
    series_slug: 'boya-chinese',
    title_vi: 'Boya Chinese (Bác Nhã Hán Ngữ)',
    title_zh: '博雅汉语',
    publisher: 'Peking University Press',
    total_volumes: 4,
    description_vi:
      'Giáo trình chuyên sâu về văn hóa, từ vựng phong phú và luyện đọc – viết tốc độ cao của ĐH Bắc Kinh.',
  },
  {
    id: 'tb-msutong',
    series_slug: 'msutong',
    title_vi: 'Phát triển Hán Ngữ (Msutong / 发展汉语)',
    title_zh: '发展汉语',
    publisher: 'BLCU Press',
    total_volumes: 4,
    description_vi:
      'Giáo trình hiện đại chú trọng kỹ năng giao tiếp thực tế, phản xạ nghe nói và ngôn ngữ đời sống đương đại.',
  },
];

export const CURATED_TEXTBOOK_UNITS: TextbookUnit[] = [
  // 1. HSK Standard Course 3 - Unit 5
  {
    id: 'unit-hsk3-5',
    series_id: 'tb-hsk-standard',
    volume_number: 3,
    unit_number: 5,
    title_zh: '我最近越来越胖了',
    title_vi: 'Gần đây tôi càng ngày càng béo rồi',
    unit_grammar_ids: ['gram-yuelaiyue', 'gram-le-change'],
    unit_reading_article_id: 'art-hsk3-5',
    unit_listening_track_id: 'track-hsk3-5',
    unit_vocab_list: [
      { order: 1, simplified: '发烧', pinyin: 'fāshāo', pos: 'Động từ', meaning_vi: 'Bị sốt' },
      { order: 2, simplified: '照顾', pinyin: 'zhàogù', pos: 'Động từ', meaning_vi: 'Chăm sóc' },
      { order: 3, simplified: '感冒', pinyin: 'gǎnmào', pos: 'Động từ / Danh từ', meaning_vi: 'Cảm cúm' },
      { order: 4, simplified: '季节', pinyin: 'jìjié', pos: 'Danh từ', meaning_vi: 'Mùa' },
      { order: 5, simplified: '当然', pinyin: 'dāngrán', pos: 'Phó từ', meaning_vi: 'Đương nhiên, tất nhiên' },
      { order: 6, simplified: '胖', pinyin: 'pàng', pos: 'Tính từ', meaning_vi: 'Béo, mập' },
      { order: 7, simplified: '瘦', pinyin: 'shòu', pos: 'Tính từ', meaning_vi: 'Gầy, ốm' },
      { order: 8, simplified: '其实', pinyin: 'qíshí', pos: 'Phó từ', meaning_vi: 'Thật ra, kỳ thực' },
    ],
    grammar_points: [
      {
        id: 'gram-yuelaiyue',
        pattern: '越来越 + Adj / Động từ tâm lý',
        pinyin: 'yuè lái yuè + Adj',
        explanation_vi:
          'Biểu thị sự biến đổi mức độ tăng tiến dần theo thời gian ("càng ngày càng..."). Không dùng phó từ mức độ 很 đứng trước tính từ.',
        example_zh: '我最近越来越胖了，必须开始锻炼身体。',
        example_pinyin: 'Wǒ zuìjìn yuèláiyuè pàng le, bìxū kāishǐ duànliàn shēntǐ.',
        example_vi: 'Gần đây tôi càng ngày càng béo rồi, phải bắt đầu tập thể dục thôi.',
      },
      {
        id: 'gram-le-change',
        pattern: 'S + Adj / V + 了',
        pinyin: 'S + Adj + le',
        explanation_vi:
          'Trợ từ ngữ khí 了 đặt cuối câu biểu thị sự thay đổi trạng thái mới xuất hiện.',
        example_zh: '天气冷了，注意别感冒。',
        example_pinyin: 'Tiānqì lěng le, zhùyì bié gǎnmào.',
        example_vi: 'Trời lạnh rồi đấy, chú ý đừng để bị cảm.',
      },
    ],
    reading_dialogue: [
      {
        speaker: '小丽 (Tiểu Lệ)',
        zh: '我听说你身体不舒服，怎么了？',
        pinyin: 'Wǒ tīngshuō nǐ shēntǐ bù shūfu, zěnme le?',
        vi: 'Tôi nghe nói bạn không khỏe trong người, sao thế?',
      },
      {
        speaker: '小刚 (Tiểu Cương)',
        zh: '前几天有点儿发烧，现在好多了。医生说这个季节很容易感冒。',
        pinyin: 'Qián jǐ tiān yǒudiǎnr fāshāo, xiànzài hǎo duō le. Yīshēng shuō zhège jìjié hěn róngyì gǎnmào.',
        vi: 'Mấy hôm trước hơi bị sốt, giờ đỡ nhiều rồi. Bác sĩ nói mùa này rất dễ bị cảm.',
      },
      {
        speaker: '小丽 (Tiểu Lệ)',
        zh: '你一定要好好照顾自己，多喝水，多休息。',
        pinyin: 'Nǐ yīdìng yào hǎohāo zhàogù zìjǐ, duō hē shuǐ, duō xiūxi.',
        vi: 'Bạn nhất định phải chăm sóc bản thân thật tốt, uống nhiều nước và nghỉ ngơi nhiều vào.',
      },
    ],
    unit_quiz: [
      {
        id: 'q-hsk3-5-1',
        question_vi: 'Câu nào dưới đây dùng đúng cấu trúc "越来越"?',
        options: [
          '他的汉语越来越很好了。',
          '他的汉语越来越流利了。',
          '他的汉语很越来越流利。',
        ],
        correct_index: 1,
        explanation_vi: 'Không đặt phó từ mức độ 很 trước hoặc sau 越来越.',
      },
      {
        id: 'q-hsk3-5-2',
        question_vi: 'Từ "其实" (qíshí) có nghĩa phù hợp nhất là gì?',
        options: ['Đương nhiên', 'Thật ra, kỳ thực', 'Đặc biệt là'],
        correct_index: 1,
        explanation_vi: '其实 dùng để chuyển ý, làm rõ sự thật phía sau ("thật ra").',
      },
    ],
  },

  // 2. HSK Standard Course 3 - Unit 6
  {
    id: 'unit-hsk3-6',
    series_id: 'tb-hsk-standard',
    volume_number: 3,
    unit_number: 6,
    title_zh: '怎么突然找不到了',
    title_vi: 'Sao tự nhiên lại không tìm thấy nữa',
    unit_grammar_ids: ['gram-potential-comp'],
    unit_reading_article_id: 'art-hsk3-6',
    unit_listening_track_id: 'track-hsk3-6',
    unit_vocab_list: [
      { order: 1, simplified: '眼镜', pinyin: 'yǎnjìng', pos: 'Danh từ', meaning_vi: 'Kính mắt' },
      { order: 2, simplified: '突然', pinyin: 'tūrán', pos: 'Phó từ / Tính từ', meaning_vi: 'Đột nhiên, bỗng nhiên' },
      { order: 3, simplified: '离开', pinyin: 'líkāi', pos: 'Động từ', meaning_vi: 'Rời khỏi' },
      { order: 4, simplified: '清楚', pinyin: 'qīngchu', pos: 'Tính từ', meaning_vi: 'Rõ ràng' },
      { order: 5, simplified: '刚才', pinyin: 'gāngcái', pos: 'Danh từ', meaning_vi: 'Vừa nãy' },
      { order: 6, simplified: '帮忙', pinyin: 'bāngmáng', pos: 'Động từ ly hợp', meaning_vi: 'Giúp đỡ' },
    ],
    grammar_points: [
      {
        id: 'gram-potential-comp',
        pattern: 'Động từ + 得 / 不 + Bổ ngữ kết quả (找不到 / 看得清楚)',
        pinyin: 'V + de / bu + Complement',
        explanation_vi:
          'Bổ ngữ khả năng biểu thị có thể thực hiện hoặc không thể thực hiện được một kết quả nào đó.',
        example_zh: '我的眼镜怎么突然找不到了？',
        example_pinyin: 'Wǒ de yǎnjìng zěnme tūrán zhǎo bú dào le?',
        example_vi: 'Kính mắt của tôi sao tự nhiên lại không tìm thấy nữa rồi?',
      },
    ],
    reading_dialogue: [
      {
        speaker: '周明 (Chu Minh)',
        zh: '你看见我的眼镜了吗？怎么突然找不到了？',
        pinyin: 'Nǐ kànjiàn wǒ de yǎnjìng le ma? Zěnme tūrán zhǎo bú dào le?',
        vi: 'Bạn có thấy kính mắt của tôi đâu không? Sao tự nhiên lại tìm không thấy nữa?',
      },
      {
        speaker: '周太太 (Vợ)',
        zh: '别急，刚才你离开桌子的时候，是不是放在书包里了？',
        pinyin: 'Bié jí, gāngcái nǐ líkāi zhuōzi de shíhou, shì bu shì fàng zài shūbāo lǐ le?',
        vi: 'Đừng vội, vừa nãy lúc anh rời khỏi bàn, có phải đã cất vào trong cặp sách rồi không?',
      },
    ],
    unit_quiz: [
      {
        id: 'q-hsk3-6-1',
        question_vi: 'Dạng phủ định của "看得见" (nhìn thấy được) là gì?',
        options: ['不看得见', '看不见', '没看得见'],
        correct_index: 1,
        explanation_vi: 'Bổ ngữ khả năng phủ định bằng cách thay 得 thành 不 ở giữa: 看不见.',
      },
    ],
  },

  // 3. Giáo trình Hán Ngữ 6 quyển - Quyển 1 Bài 9
  {
    id: 'unit-hn1-9',
    series_id: 'tb-han-ngu-6',
    volume_number: 1,
    unit_number: 9,
    title_zh: '我换人民币',
    title_vi: 'Tôi đổi Nhân dân tệ',
    unit_grammar_ids: ['gram-hn1-9-baidong'],
    unit_vocab_list: [
      { order: 1, simplified: '换', pinyin: 'huàn', pos: 'Động từ', meaning_vi: 'Đổi, thay' },
      { order: 2, simplified: '人民币', pinyin: 'Rénmínbì', pos: 'Danh từ', meaning_vi: 'Nhân dân tệ' },
      { order: 3, simplified: '美元', pinyin: 'Měiyuán', pos: 'Danh từ', meaning_vi: 'Đô la Mỹ' },
      { order: 4, simplified: '营业员', pinyin: 'yíngyèyuán', pos: 'Danh từ', meaning_vi: 'Nhân viên giao dịch' },
      { order: 5, simplified: '等', pinyin: 'děng', pos: 'Động từ', meaning_vi: 'Đợi, chờ' },
      { order: 6, simplified: '一会儿', pinyin: 'yīhuìr', pos: 'Danh từ', meaning_vi: 'Một lát, một chốc' },
    ],
    grammar_points: [
      {
        id: 'gram-hn1-9-baidong',
        pattern: 'Động từ + 一会儿 (请等一会儿)',
        pinyin: 'V + yīhuìr',
        explanation_vi: 'Đứng sau động từ để biểu thị hành động diễn ra trong khoảng thời gian ngắn.',
        example_zh: '先生，请您等一会儿，我给您数钱。',
        example_pinyin: 'Xiānsheng, qǐng nín děng yīhuìr, wǒ gěi nín shǔ qián.',
        example_vi: 'Thưa ông, xin ông đợi một lát, tôi đếm tiền cho ông.',
      },
    ],
    reading_dialogue: [
      {
        speaker: '玛丽 (Mary)',
        zh: '小姐，我换钱。请问今天美元换人民币的汇率是多少？',
        pinyin: 'Xiǎojiě, wǒ huàn qián. Qǐngwèn jīntiān Měiyuán huàn Rénmínbì de huìlǜ shì duōshao?',
        vi: 'Cô ơi, tôi đổi tiền. Xin hỏi hôm nay tỷ giá USD sang Nhân dân tệ là bao nhiêu?',
      },
      {
        speaker: '营业员 (Giao dịch viên)',
        zh: '您换多少钱？请等一会儿，我帮您查一下。',
        pinyin: 'Nín huàn duōshao qián? Qǐng děng yīhuìr, wǒ bāng nín chá yīxià.',
        vi: 'Ngài muốn đổi bao nhiêu tiền? Xin đợi một lát, tôi kiểm tra giúp ngài.',
      },
    ],
    unit_quiz: [
      {
        id: 'q-hn1-9-1',
        question_vi: 'Cách hỏi "Tôi muốn đổi Nhân dân tệ" đúng nhất là:',
        options: ['我换人民币。', '人民币换我。', '我买人民币。'],
        correct_index: 0,
        explanation_vi: 'Đổi tiền dùng động từ 换 + tên tiền tệ.',
      },
    ],
  },

  // 4. Boya Chinese - Volume 2 Unit 3
  {
    id: 'unit-boya2-3',
    series_id: 'tb-boya',
    volume_number: 2,
    unit_number: 3,
    title_zh: '我的业余爱好',
    title_vi: 'Sở thích ngoài giờ của tôi',
    unit_grammar_ids: ['gram-boya-duiyu'],
    unit_vocab_list: [
      { order: 1, simplified: '业余', pinyin: 'yèyú', pos: 'Tính từ', meaning_vi: 'Ngoài giờ, nghiệp dư' },
      { order: 2, simplified: '爱好', pinyin: 'àihào', pos: 'Danh từ / Động từ', meaning_vi: 'Sở thích, yêu thích' },
      { order: 3, simplified: '书法', pinyin: 'shūfǎ', pos: 'Danh từ', meaning_vi: 'Thư pháp' },
      { order: 4, simplified: '欣赏', pinyin: 'xīnshǎng', pos: 'Động từ', meaning_vi: 'Thưởng thức, đánh giá cao' },
      { order: 5, simplified: '丰富', pinyin: 'fēngfù', pos: 'Tính từ / Động từ', meaning_vi: 'Phong phú, làm phong phú' },
    ],
    grammar_points: [
      {
        id: 'gram-boya-duiyu',
        pattern: '对 + Đối tượng + 感兴趣',
        pinyin: 'duì ... gǎn xìngqù',
        explanation_vi: 'Biểu thị có hứng thú, quan tâm đối với một lĩnh vực hoặc sự vật nào đó.',
        example_zh: '我对中国传统书法非常感兴趣。',
        example_pinyin: 'Wǒ duì Zhōngguó chuántǒng shūfǎ fēicháng gǎn xìngqù.',
        example_vi: 'Tôi vô cùng hứng thú với thư pháp truyền thống Trung Quốc.',
      },
    ],
    reading_dialogue: [
      {
        speaker: '大卫 (David)',
        zh: '周末你平时有什么业余爱好？我最近对中国书法特别感兴趣。',
        pinyin: 'Zhōumò nǐ píngshí yǒu shénme yèyú àihào? Wǒ zuìjìn duì Zhōngguó shūfǎ tèbié gǎn xìngqù.',
        vi: 'Cuối tuần bạn thường có sở thích ngoài giờ gì? Gần đây tôi đặc biệt hứng thú với thư pháp Trung Hoa.',
      },
      {
        speaker: '林娜 (Lâm Na)',
        zh: '太好了！练习书法不仅能培养耐心，还能丰富业余生活。',
        pinyin: 'Tài hǎo le! Liànxí shūfǎ bùjǐn néng péiyǎng nàixīn, hái néng fēngfù yèyú shēnghuó.',
        vi: 'Tuyệt quá! Luyện thư pháp không chỉ rèn tính kiên nhẫn mà còn làm phong phú đời sống tinh thần.',
      },
    ],
    unit_quiz: [
      {
        id: 'q-boya2-3-1',
        question_vi: 'Chọn giới từ đúng: "他___中国文化很感兴趣。"',
        options: ['对', '把', '被'],
        correct_index: 0,
        explanation_vi: 'Cấu trúc cố định: 对 + A + 感兴趣.',
      },
    ],
  },

  // 5. Msutong - Volume 3 Unit 2
  {
    id: 'unit-msutong3-2',
    series_id: 'tb-msutong',
    volume_number: 3,
    unit_number: 2,
    title_zh: '入乡随俗的礼仪',
    title_vi: 'Lễ nghi nhập gia tùy tục',
    unit_grammar_ids: ['gram-msutong-suiran'],
    unit_vocab_list: [
      { order: 1, simplified: '礼仪', pinyin: 'lǐyí', pos: 'Danh từ', meaning_vi: 'Lễ nghi, phép tắc' },
      { order: 2, simplified: '习惯', pinyin: 'xíguàn', pos: 'Danh từ / Động từ', meaning_vi: 'Thói quen, quen với' },
      { order: 3, simplified: '尊重', pinyin: 'zūnzhòng', pos: 'Động từ', meaning_vi: 'Tôn trọng' },
      { order: 4, simplified: '文化差异', pinyin: 'wénhuà chāyì', pos: 'Cụm danh từ', meaning_vi: 'Khác biệt văn hóa' },
    ],
    grammar_points: [
      {
        id: 'gram-msutong-suiran',
        pattern: '虽然...但是... (Mặc dù... nhưng...)',
        pinyin: 'suīrán ... dànshì ...',
        explanation_vi: 'Cặp liên từ biểu thị quan hệ nhượng bộ – chuyển ngoặt.',
        example_zh: '虽然各地有文化差异，但是尊重彼此是最重要的。',
        example_pinyin: 'Suīrán gèdì yǒu wénhuà chāyì, dànshì zūnzhòng bǐcǐ shì zuì zhòngyào de.',
        example_vi: 'Mặc dù mỗi nơi có khác biệt văn hóa, nhưng tôn trọng lẫn nhau là điều quan trọng nhất.',
      },
    ],
    reading_dialogue: [
      {
        speaker: '陈老师 (Thầy Trần)',
        zh: '来到一个新的国家，了解当地礼仪和入乡随俗非常重要。',
        pinyin: 'Láidào yīgè xīn de guójiā, liǎojiě dāngdì lǐyí hé rùxiāng-suísú fēicháng zhòngyào.',
        vi: 'Khi đến một đất nước mới, việc tìm hiểu lễ nghi địa phương và nhập gia tùy tục rất quan trọng.',
      },
    ],
    unit_quiz: [
      {
        id: 'q-msutong3-2-1',
        question_vi: 'Từ "尊重" (zūnzhòng) có nghĩa là gì?',
        options: ['Tôn trọng', 'Tranh luận', 'Lịch sự'],
        correct_index: 0,
        explanation_vi: '尊重 là động từ mang nghĩa tôn trọng, kính trọng.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Data Loading & Ecosystem Sync
// ---------------------------------------------------------------------------

export async function listTextbookSeries(): Promise<TextbookSeries[]> {
  if (!isSupabaseConfigured || !supabase) {
    return CURATED_TEXTBOOK_SERIES;
  }
  try {
    const { data, error } = await supabase
      .from('textbook_series')
      .select('*')
      .order('title_vi', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as TextbookSeries[];
      const remoteSlugs = new Set(remote.map((r) => r.series_slug));
      return [...remote, ...CURATED_TEXTBOOK_SERIES.filter((s) => !remoteSlugs.has(s.series_slug))];
    }
  } catch {
    // fallback
  }
  return CURATED_TEXTBOOK_SERIES;
}

export async function listUnitsForSeries(seriesId: string): Promise<TextbookUnit[]> {
  const localUnits = CURATED_TEXTBOOK_UNITS.filter((u) => u.series_id === seriesId);
  if (!isSupabaseConfigured || !supabase) {
    return localUnits;
  }
  try {
    const { data, error } = await supabase
      .from('textbook_units')
      .select('*')
      .eq('series_id', seriesId)
      .order('volume_number', { ascending: true })
      .order('unit_number', { ascending: true });

    if (!error && data && data.length > 0) {
      const remote = data as TextbookUnit[];
      const remoteIds = new Set(remote.map((r) => r.id));
      return [...remote, ...localUnits.filter((u) => !remoteIds.has(u.id))];
    }
  } catch {
    // fallback
  }
  return localUnits;
}

export function extractUniqueHanziFromUnit(unit: TextbookUnit): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of unit.unit_vocab_list) {
    for (const ch of Array.from(item.simplified)) {
      if (/[\u4e00-\u9fa5]/.test(ch) && !seen.has(ch)) {
        seen.add(ch);
        result.push(ch);
      }
    }
  }
  return result;
}

function readLocalEnrollments(): UserTextbookEnrollment[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    return raw ? (JSON.parse(raw) as UserTextbookEnrollment[]) : [];
  } catch {
    return [];
  }
}

function writeLocalEnrollments(list: UserTextbookEnrollment[]): void {
  try {
    localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export async function getUserTextbookEnrollments(
  user?: { id?: string | null } | null
): Promise<UserTextbookEnrollment[]> {
  const local = readLocalEnrollments();
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return local;
  }
  try {
    const { data, error } = await supabase
      .from('user_textbook_enrollments')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data && data.length > 0) {
      return data as UserTextbookEnrollment[];
    }
  } catch {
    // fallback
  }
  return local;
}

/**
 * 1-Click Sync Textbook Unit into Vocabulary Workspace, Writing Studio, Grammar, Reading & Listening
 */
export async function syncTextbookUnitToWorkspace(
  series: TextbookSeries,
  unit: TextbookUnit,
  user?: { id?: string | null } | null
): Promise<SyncWorkspaceResult> {
  const deckName = `${series.title_zh} ${unit.volume_number} - Bài ${unit.unit_number}`;
  const deck = await createVocabDeck(
    {
      name: deckName,
      description: `${series.title_vi} · ${unit.title_zh} (${unit.title_vi})`,
      color_hex: '#059669',
    },
    user
  );

  for (const vocab of unit.unit_vocab_list) {
    const dictEntry: DictionaryEntry = {
      id: vocab.dictionary_entry_id || `tb-${unit.id}-${vocab.order}`,
      simplified: vocab.simplified,
      traditional: vocab.simplified,
      pinyin: vocab.pinyin,
      pinyin_numbered: vocab.pinyin,
      hsk_level: Math.min(9, Math.max(1, unit.volume_number)),
      pos: vocab.pos,
      meanings_vi: [vocab.meaning_vi],
      examples: [],
    };
    await saveWordToDeck(dictEntry, user);
  }

  // Update enrollment
  const existing = readLocalEnrollments();
  const idx = existing.findIndex((e) => e.series_id === series.id);
  const nextEnrollment: UserTextbookEnrollment = {
    user_id: user?.id || null,
    series_id: series.id,
    current_volume: unit.volume_number,
    current_unit: unit.unit_number,
    completed_unit_ids: idx >= 0 ? existing[idx].completed_unit_ids : [],
    updated_at: new Date().toISOString(),
  };

  if (idx >= 0) {
    existing[idx] = nextEnrollment;
  } else {
    existing.push(nextEnrollment);
  }
  writeLocalEnrollments(existing);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_textbook_enrollments').upsert({
        user_id: user.id,
        series_id: series.id,
        current_volume: unit.volume_number,
        current_unit: unit.unit_number,
        completed_unit_ids: nextEnrollment.completed_unit_ids,
        updated_at: nextEnrollment.updated_at,
      });
    } catch {
      // keep local
    }
  }

  return {
    deck,
    syncedWordsCount: unit.unit_vocab_list.length,
    writingChars: extractUniqueHanziFromUnit(unit),
    readingArticleId: unit.unit_reading_article_id || null,
    listeningTrackId: unit.unit_listening_track_id || null,
    grammarIds: unit.unit_grammar_ids || [],
  };
}

export async function markTextbookUnitCompleted(
  seriesId: string,
  unitId: string,
  user?: { id?: string | null } | null
): Promise<UserTextbookEnrollment> {
  const existing = readLocalEnrollments();
  const idx = existing.findIndex((e) => e.series_id === seriesId);
  const currentCompleted = idx >= 0 ? existing[idx].completed_unit_ids : [];
  const nextCompleted = Array.from(new Set([...currentCompleted, unitId]));

  const updated: UserTextbookEnrollment = {
    user_id: user?.id || null,
    series_id: seriesId,
    current_volume: idx >= 0 ? existing[idx].current_volume : 1,
    current_unit: idx >= 0 ? existing[idx].current_unit : 1,
    completed_unit_ids: nextCompleted,
    updated_at: new Date().toISOString(),
  };

  if (idx >= 0) {
    existing[idx] = updated;
  } else {
    existing.push(updated);
  }
  writeLocalEnrollments(existing);

  if (isSupabaseConfigured && supabase && user?.id) {
    try {
      await supabase.from('user_textbook_enrollments').upsert({
        user_id: user.id,
        series_id: seriesId,
        current_volume: updated.current_volume,
        current_unit: updated.current_unit,
        completed_unit_ids: updated.completed_unit_ids,
        updated_at: updated.updated_at,
      });
    } catch {
      // ignore
    }
  }

  return updated;
}

