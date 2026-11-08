/**
 * PRACTICE LEVEL DATA — HANZIGO
 * Hệ thống bài tập luyện tập phân chia theo 4 mức độ sư phạm chuẩn HSK & CEFR
 */

export const HSK_LEVELS_METADATA = [
  { id: 'all', code: 'ALL', label: 'Tất cả HSK', count: 850, color: '#243447', desc: 'Toàn bộ 850+ từ vựng kèm câu ví dụ từ giáo án và tài liệu tổng hợp' },
  { id: 'HSK 1', code: 'HSK 1', label: 'HSK 1 (Nền tảng)', count: 161, color: '#45B97C', desc: '161 từ cốt lõi, phiên âm Pinyin, số đếm, gia đình & chào hỏi' },
  { id: 'HSK 2', code: 'HSK 2', label: 'HSK 2 (Sinh hoạt)', count: 142, color: '#F4B942', desc: '142 từ giao tiếp hàng ngày, mua sắm, phương tiện & ăn uống' },
  { id: 'HSK 3', code: 'HSK 3', label: 'HSK 3 (Trung cấp)', count: 137, color: '#E85D3F', desc: '137 từ du lịch tự túc, công sở, câu chữ 把/被 & liên từ' },
  { id: 'HSK 4', code: 'HSK 4', label: 'HSK 4 (Công sở)', count: 140, color: '#3B82F6', desc: '140+ từ ngữ thương mại, đàm phán, kỹ năng lưu loát & phỏng vấn' },
  { id: 'HSK 5', code: 'HSK 5', label: 'HSK 5 (Học thuật)', count: 120, color: '#0284C7', desc: '120+ từ ngữ văn phong viết, cấu trúc nhượng bộ & nghị luận' },
  { id: 'HSK 6', code: 'HSK 6', label: 'HSK 6 (Thành ngữ)', count: 150, color: '#8B5CF6', desc: '150+ từ vựng cao cấp, thành ngữ 4 chữ (成语) & văn hóa chuyên sâu' },
  { id: 'HSK 5-6', code: 'HSK 5-6', label: 'HSK 5-6 (Thành ngữ & Cao cấp)', count: 270, color: '#8B5CF6', desc: '270+ từ vựng cao cấp, học thuật, thành ngữ 4 chữ (成语) & chiều sâu văn hóa' }
];

export const PRACTICE_LEVELS = [
  {
    id: 'level-1',
    code: 'LV1',
    hskLevel: 'HSK 1',
    level: 1,
    name: 'Mức độ 1: HSK 1 — Khởi động & Nền tảng',
    subtitle: 'Nhập môn Pinyin, 4 thanh điệu & 161 từ vựng HSK 1 chuẩn',
    difficulty: 'easy',
    badge: '🟢 HSK 1 (Dễ)',
    color: '#45B97C',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderLight: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    description: 'Dành cho người mới bắt đầu: Làm quen với phiên âm Pinyin, chuẩn hóa 4 thanh điệu, từ đơn 1–2 âm tiết và 161 từ vựng HSK 1 với câu ví dụ chuẩn.',
    targetOutcomes: [
      'Phát âm chuẩn 4 thanh điệu không bị ngọng',
      'Nắm vững 161 từ vựng và câu ví dụ HSK 1',
      'Nhận diện các nét bút cơ bản (ngang, sổ, phẩy, mác)'
    ],
    stats: {
      wordsCount: 161,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  },
  {
    id: 'level-2',
    code: 'LV2',
    hskLevel: 'HSK 2',
    level: 2,
    name: 'Mức độ 2: HSK 2 — Tăng tốc & Sinh hoạt',
    subtitle: 'Biến điệu thanh 3, cụm từ & 142 từ vựng HSK 2 thực chiến',
    difficulty: 'medium',
    badge: '🟡 HSK 2 (Vừa)',
    color: '#F4B942',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    borderLight: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
    description: 'Nâng cao độ chính xác: Nắm vững quy tắc biến điệu hai thanh 3, biến điệu chữ 一 và 不, 142 từ vựng sinh hoạt hàng ngày, mua sắm và hỏi đường.',
    targetOutcomes: [
      'Thành thạo biến điệu hai thanh 3 (ní hǎo) và biến điệu 一 / 不',
      'Phản xạ nói câu ghép 4–6 chữ trôi chảy theo ngữ cảnh',
      'Làm chủ 142 từ vựng HSK 2 kèm câu ví dụ sinh hoạt'
    ],
    stats: {
      wordsCount: 142,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  },
  {
    id: 'level-3',
    code: 'LV3',
    hskLevel: 'HSK 3',
    level: 3,
    name: 'Mức độ 3: HSK 3 — Chinh phục & Bứt phá',
    subtitle: 'Mẫu câu phức hợp, Du lịch & 137 từ vựng HSK 3 độc lập',
    difficulty: 'hard',
    badge: '🟠 HSK 3 (Khó)',
    color: '#E85D3F',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    borderLight: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
    description: 'Mở rộng vốn diễn đạt: Câu chữ 把, câu chữ 被, liên từ 虽然...但是..., hội thoại công sở, đặt phòng khách sạn và 137 từ vựng HSK 3 thực tế.',
    targetOutcomes: [
      'Nắm vững ngữ điệu câu dài và ngắt nghỉ tự nhiên',
      'Sử dụng chính xác các cấu trúc câu phức trọng điểm HSK 3',
      'Thành thạo 137 từ vựng HSK 3 kèm phân tích chiết tự'
    ],
    stats: {
      wordsCount: 137,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  },
  {
    id: 'level-4',
    code: 'LV4',
    hskLevel: 'HSK 4',
    level: 4,
    name: 'Mức độ 4: HSK 4 & Thành ngữ — Thử thách Bậc thầy',
    subtitle: 'Thành ngữ 4 chữ (成语), HSK 4 công sở & Câu líu lưỡi',
    difficulty: 'challenge',
    badge: '🔴 HSK 4 (Master)',
    color: '#8B5CF6',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    borderLight: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    description: 'Thử thách cực hạn: Phân biệt các cặp âm uốn lưỡi zh/ch/sh vs z/c/s, câu líu lưỡi kinh điển (绕口令), thành ngữ 4 chữ (成语) và từ vựng HSK 4 công sở.',
    targetOutcomes: [
      'Làm chủ âm uốn lưỡi cuốn họng và thanh nhẹ phức tạp',
      'Đọc câu líu lưỡi chuẩn xác không vấp váp',
      'Làm chủ kho thành ngữ 4 chữ và từ vựng chuyên sâu'
    ],
    stats: {
      wordsCount: 140,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  },
  {
    id: 'level-5',
    code: 'LV5',
    hskLevel: 'HSK 5',
    level: 5,
    name: 'Mức độ 5: HSK 5 — Cao cấp & Học thuật',
    subtitle: 'Văn phong viết, Cấu trúc nhượng bộ & Đàm thoại chuyên sâu',
    difficulty: 'advanced',
    badge: '🔵 HSK 5 (Cao cấp)',
    color: '#0284C7',
    bgLight: 'bg-sky-50 dark:bg-sky-950/30',
    borderLight: 'border-sky-200 dark:border-sky-800',
    textColor: 'text-sky-700 dark:text-sky-300',
    description: 'Chinh phục trình độ cao cấp: Cấu trúc câu phức nhiều tầng, liên kết logic chặt chẽ, câu chữ 把 mở rộng, từ ngữ văn phong viết và thảo luận học thuật/công sở.',
    targetOutcomes: [
      'Nắm vững các cặp liên từ phức tạp và cấu trúc nhượng bộ',
      'Hiểu và suy luận thông tin trong các bài nghe dài thực tế',
      'Ứng dụng ngữ pháp văn viết chính xác và lưu loát'
    ],
    stats: {
      wordsCount: 114,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  },
  {
    id: 'level-6',
    code: 'LV6',
    hskLevel: 'HSK 6',
    level: 6,
    name: 'Mức độ 6: HSK 6 — Tinh hoa & Chuyên gia',
    subtitle: 'Thành ngữ điển cố, Lập luận triết học & Diễn thuyết vĩ mô',
    difficulty: 'master',
    badge: '🟣 HSK 6 (Bậc thầy)',
    color: '#7C3AED',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderLight: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    description: 'Đỉnh cao Hán ngữ học thuật: Cấu trúc tu từ cổ văn hiện đại, thành ngữ 4 chữ uyên bác, phân tích sắc thái biểu cảm, diễn thuyết kinh tế và đàm phán quốc tế.',
    targetOutcomes: [
      'Làm chủ thành ngữ điển cố và quán dụng ngữ cao cấp',
      'Phân tích được thái độ, lập trường và hàm ý ngầm của người nói',
      'Sử dụng các cấu trúc văn ngôn trong ngữ cảnh chính luận hiện đại'
    ],
    stats: {
      wordsCount: 110,
      pronounceItems: 8,
      listeningCount: 10,
      grammarCount: 10
    }
  }
];

// Kho bài tập luyện phát âm phân chia chi tiết theo 4 mức độ
export const PRONUNCIATION_ITEMS_BY_LEVEL = [
  // =================== MỨC 1: CƠ BẢN (DỄ) ===================
  {
    id: 'pr-l1-01',
    level: 1,
    difficulty: 'easy',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào',
    category: 'Từ đơn & Chào hỏi',
    tip: 'Hai thanh 3 đi liền nhau, chữ 你 (nǐ) biến điệu thành thanh 2: ní hǎo.'
  },
  {
    id: 'pr-l1-02',
    level: 1,
    difficulty: 'easy',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    meaning: 'Cảm ơn',
    category: 'Từ đơn & Cảm ơn',
    tip: 'Âm "x" mặt lưỡi phẳng nhẹ, âm thứ hai đọc khinh thanh (thanh nhẹ).'
  },
  {
    id: 'pr-l1-03',
    level: 1,
    difficulty: 'easy',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    meaning: 'Tạm biệt',
    category: 'Từ đơn & Tạm biệt',
    tip: 'Âm "z" đầu lưỡi thẳng không bật hơi, hai thanh 4 dứt khoát dốc từ cao xuống thấp.'
  },
  {
    id: 'pr-l1-04',
    level: 1,
    difficulty: 'easy',
    hanzi: '妈妈',
    pinyin: 'māma',
    meaning: 'Mẹ',
    category: 'Gia đình',
    tip: 'Âm "mā" giữ thanh 1 cao và bằng phẳng, chữ thứ hai đọc nhẹ nhàng.'
  },
  {
    id: 'pr-l1-05',
    level: 1,
    difficulty: 'easy',
    hanzi: '中国',
    pinyin: 'Zhōngguó',
    meaning: 'Trung Quốc',
    category: 'Địa danh',
    tip: '"zh" uốn lưỡi không bật hơi thanh 1, "guó" nâng giọng từ giữa lên cao thanh 2.'
  },
  {
    id: 'pr-l1-06',
    level: 1,
    difficulty: 'easy',
    hanzi: '老师',
    pinyin: 'lǎoshī',
    meaning: 'Thầy / Cô giáo',
    category: 'Nghề nghiệp',
    tip: '"lǎo" hạ sâu rồi lên thanh 3, "shī" uốn lưỡi giữ thanh 1 cao phẳng.'
  },
  {
    id: 'pr-l1-07',
    level: 1,
    difficulty: 'easy',
    hanzi: '学生',
    pinyin: 'xuésheng',
    meaning: 'Học sinh',
    category: 'Học tập',
    tip: '"xué" tròn môi thanh 2, "sheng" thanh nhẹ lướt êm.'
  },
  {
    id: 'pr-l1-08',
    level: 1,
    difficulty: 'easy',
    hanzi: '苹果',
    pinyin: 'píngguǒ',
    meaning: 'Quả táo',
    category: 'Hoa quả',
    tip: '"píng" bật hơi mạnh môi trên dưới, "guǒ" tròn môi thanh 3.'
  },

  // =================== MỨC 2: SƠ CẤP (VỪA) ===================
  {
    id: 'pr-l2-01',
    level: 2,
    difficulty: 'medium',
    hanzi: '对不起',
    pinyin: 'duìbuqǐ',
    meaning: 'Xin lỗi',
    category: 'Giao tiếp hàng ngày',
    tip: 'Âm "d" không bật hơi như chữ "t" tiếng Việt, "qǐ" bật hơi từ mặt lưỡi.'
  },
  {
    id: 'pr-l2-02',
    level: 2,
    difficulty: 'medium',
    hanzi: '没关系',
    pinyin: 'méi guānxi',
    meaning: 'Không có sao / Đừng bận tâm',
    category: 'Giao tiếp hàng ngày',
    tip: '"méi" thanh 2, "guān" thanh 1 âm cuống họng, "xi" đọc thanh nhẹ.'
  },
  {
    id: 'pr-l2-03',
    level: 2,
    difficulty: 'medium',
    hanzi: '多少钱',
    pinyin: 'duōshao qián',
    meaning: 'Bao nhiêu tiền?',
    category: 'Mua sắm',
    tip: '"duō" thanh 1, "shao" khinh thanh, "qián" bật hơi thanh 2 rõ ràng.'
  },
  {
    id: 'pr-l2-04',
    level: 2,
    difficulty: 'medium',
    hanzi: '我想喝奶茶',
    pinyin: 'Wǒ xiǎng hē nǎichá',
    meaning: 'Tôi muốn uống trà sữa',
    category: 'Ăn uống & Sở thích',
    tip: '"wǒ xiǎng" biến điệu hai thanh 3 thành "wó xiǎng", "chá" bật hơi uốn lưỡi.'
  },
  {
    id: 'pr-l2-05',
    level: 2,
    difficulty: 'medium',
    hanzi: '不客气',
    pinyin: 'bú kèqi',
    meaning: 'Đừng khách sáo / Không có gì',
    category: 'Lịch sự',
    tip: 'Chữ 不 (bù) đứng trước thanh 4 (kè) biến điệu thành thanh 2: bú kèqi.'
  },
  {
    id: 'pr-l2-06',
    level: 2,
    difficulty: 'medium',
    hanzi: '一定要',
    pinyin: 'yídìng yào',
    meaning: 'Nhất định phải',
    category: 'Phó từ & Biến điệu 一',
    tip: 'Chữ 一 (yī) đứng trước thanh 4 (dìng) biến điệu thành thanh 2: yí dìng.'
  },
  {
    id: 'pr-l2-07',
    level: 2,
    difficulty: 'medium',
    hanzi: '请问去医院怎么走？',
    pinyin: 'Qǐngwèn qù yīyuàn zěnme zǒu?',
    meaning: 'Xin hỏi đi bệnh viện thế nào?',
    category: 'Hỏi đường',
    tip: '"qǐng" bật hơi thanh 3, "wèn" thanh 4 dứt khoát, "zǒu" đầu lưỡi thẳng.'
  },
  {
    id: 'pr-l2-08',
    level: 2,
    difficulty: 'medium',
    hanzi: '今天天气真好',
    pinyin: 'Jīntiān tiānqì zhēn hǎo',
    meaning: 'Hôm nay thời tiết thật đẹp',
    category: 'Thời tiết',
    tip: '"jīn tiān" thanh 1 liên tục bằng phẳng, "zhēn" uốn lưỡi.'
  },

  // =================== MỨC 3: TRUNG CẤP (KHÓ) ===================
  {
    id: 'pr-l3-01',
    level: 3,
    difficulty: 'hard',
    hanzi: '我是越南人，很高兴认识你',
    pinyin: 'Wǒ shì Yuènán rén, hěn gāoxìng rènshi nǐ',
    meaning: 'Tôi là người Việt Nam, rất vui được làm quen với bạn',
    category: 'Giới thiệu bản thân',
    tip: 'Chú ý uốn lưỡi chuẩn âm "shì" và "rén", ngắt nhẹ sau dấu phẩy.'
  },
  {
    id: 'pr-l3-02',
    level: 3,
    difficulty: 'hard',
    hanzi: '这件衣服有点贵，可以便宜一点吗？',
    pinyin: 'Zhè jiàn yīfu yǒudiǎn guì, kěyǐ piányi yìdiǎn ma?',
    meaning: 'Chiếc áo này hơi đắt, có thể bớt chút được không?',
    category: 'Mặc cả mua sắm',
    tip: '"piányi" là từ đặc biệt phát âm thanh 2 + khinh thanh, "yìdiǎn" biến điệu 一 thanh 4.'
  },
  {
    id: 'pr-l3-03',
    level: 3,
    difficulty: 'hard',
    hanzi: '听不懂，请您再说一遍',
    pinyin: 'Tīng bù dǒng, qǐng nín zài shuō yí biàn',
    meaning: 'Tôi nghe không hiểu, xin bạn nhắc lại một lần nữa',
    category: 'Giao tiếp khẩn cấp',
    tip: '"tīng" thanh 1, "nín" xưng hô kính trọng thanh 2, "yí biàn" biến điệu chữ 一.'
  },
  {
    id: 'pr-l3-04',
    level: 3,
    difficulty: 'hard',
    hanzi: '虽然汉语很难，但是很有意思',
    pinyin: 'Suīrán Hànyǔ hěn nán, dànshì hěn yǒu yìsi',
    meaning: 'Tuy rằng tiếng Trung khó, nhưng rất thú vị',
    category: 'Cấu trúc mặc dù... nhưng...',
    tip: 'Luyện cấu trúc liên từ suīrán... dànshì... với ngữ điệu so sánh tự nhiên.'
  },
  {
    id: 'pr-l3-05',
    level: 3,
    difficulty: 'hard',
    hanzi: '麻烦你把空调打开',
    pinyin: 'Máfan nǐ bǎ kōngtiáo dǎkāi',
    meaning: 'Phiền bạn bật máy điều hòa giúp tôi',
    category: 'Câu chữ 把',
    tip: 'Câu chữ 把 biểu đạt tác động xử lý sự vật, "máfan" khinh thanh ở âm fan.'
  },
  {
    id: 'pr-l3-06',
    level: 3,
    difficulty: 'hard',
    hanzi: '我们可以加个微信吗？',
    pinyin: 'Wǒmen kěyǐ jiā ge Wēixìn ma?',
    meaning: 'Chúng mình có thể kết bạn WeChat được không?',
    category: 'Kết nối bạn bè',
    tip: '"jiā" giữ thanh 1 cao phẳng, "Wēixìn" nhấn trọng âm ở chữ xìn.'
  },
  {
    id: 'pr-l3-07',
    level: 3,
    difficulty: 'hard',
    hanzi: '祝你一路顺风，万事如意！',
    pinyin: 'Zhù nǐ yílù shùnfēng, wànshì rúyì!',
    meaning: 'Chúc bạn thượng lộ bình an, vạn sự như ý!',
    category: 'Lời chúc tụng',
    tip: 'Thanh 4 ở chữ zhù, lù, shùn, wàn, shì, yì cần dứt khoát hào sảng.'
  },
  {
    id: 'pr-l3-08',
    level: 3,
    difficulty: 'hard',
    hanzi: '明天下午三点我们在咖啡馆见面',
    pinyin: 'Míngtiān xiàwǔ sān diǎn wǒmen zài kāfēiguǎn jiànmiàn',
    meaning: 'Chiều mai 3 giờ chúng ta gặp nhau ở quán cà phê nhé',
    category: 'Hẹn hò thời gian & địa điểm',
    tip: 'Chú ý trật tự thời gian trước địa điểm trong câu tiếng Trung.'
  },

  // =================== MỨC 4: THỬ THÁCH (MASTER) ===================
  {
    id: 'pr-l4-01',
    level: 4,
    difficulty: 'challenge',
    hanzi: '四是四，十是十，十四是十四，四十是四十',
    pinyin: 'Sì shì sì, shí shì shí, shísì shì shísì, sìshí shì sìshí',
    meaning: 'Bốn là bốn, mười là mười, mười bốn là mười bốn, bốn mươi là bốn mươi',
    category: 'Câu líu lưỡi (绕口令)',
    tip: 'Thử thách kinh điển phân biệt âm đầu lưỡi "s" (thẳng lưỡi) và âm uốn lưỡi "sh" (cong lưỡi).'
  },
  {
    id: 'pr-l4-02',
    level: 4,
    difficulty: 'challenge',
    hanzi: '吃葡萄不吐葡萄皮，不吃葡萄倒吐葡萄皮',
    pinyin: 'Chī pútáo bù tǔ pútáo pí, bù chī pútáo dào tǔ pútáo pí',
    meaning: 'Ăn nho không nhả vỏ nho, không ăn nho lại nhả vỏ nho',
    category: 'Câu líu lưỡi (绕口令)',
    tip: 'Luyện âm bật hơi "ch", "p", "t" liên tiếp với tốc độ nhanh dần.'
  },
  {
    id: 'pr-l4-03',
    level: 4,
    difficulty: 'challenge',
    hanzi: '只要功夫深，铁杵磨成针',
    pinyin: 'Zhǐyào gōngfu shēn, tiěchǔ mó chéng zhēn',
    meaning: 'Có công mài sắt, có ngày nên kim',
    category: 'Tục ngữ & Châm ngôn',
    tip: 'Nhịp điệu 5 chữ đối ngẫu truyền thống, chữ "chǔ" thanh 3, "zhēn" thanh 1 uốn lưỡi.'
  },
  {
    id: 'pr-l4-04',
    level: 4,
    difficulty: 'challenge',
    hanzi: '一心一意',
    pinyin: 'yì xīn yí yì',
    meaning: 'Toàn tâm toàn ý / Một lòng một dạ',
    category: 'Thành ngữ 4 chữ (成语)',
    tip: 'Thử thách quy tắc biến điệu hai chữ 一: chữ đầu đứng trước thanh 1 thành "yì", chữ thứ hai đứng trước thanh 4 thành "yí".'
  },
  {
    id: 'pr-l4-05',
    level: 4,
    difficulty: 'challenge',
    hanzi: '入乡随俗',
    pinyin: 'rù xiāng suí sú',
    meaning: 'Nhập gia tùy tục',
    category: 'Thành ngữ 4 chữ (成语)',
    tip: '"rù" thanh 4 uốn lưỡi, "xiāng" thanh 1 phẳng, "suí sú" thanh 2 liên tiếp.'
  },
  {
    id: 'pr-l4-06',
    level: 4,
    difficulty: 'challenge',
    hanzi: '马到成功',
    pinyin: 'mǎ dào chéng gōng',
    meaning: 'Mã đáo thành công',
    category: 'Thành ngữ 4 chữ (成语)',
    tip: '"mǎ" thanh 3 sâu, "dào" dứt khoát, "chéng gōng" âm cuống họng ngân vang.'
  },
  {
    id: 'pr-l4-07',
    level: 4,
    difficulty: 'challenge',
    hanzi: '千里之行，始于足下',
    pinyin: 'Qiānlǐ zhī xíng, shǐ yú zú xià',
    meaning: 'Chuyến đi ngàn dặm bắt đầu từ một bước chân',
    category: 'Danh ngôn Lão Tử',
    tip: 'Đòi hỏi sự trầm tĩnh và nhả âm từng từ đầy đặn, chuẩn xác.'
  },
  {
    id: 'pr-l4-08',
    level: 4,
    difficulty: 'challenge',
    hanzi: '化干戈为玉帛',
    pinyin: 'Huà gāngē wéi yùbó',
    meaning: 'Biến chiến tranh thành hòa bình / Giảng hòa kết bạn',
    category: 'Thành ngữ cao cấp',
    tip: 'Phát âm chuẩn âm "huà" trơn tru và "bó" thanh 2 dứt khoát.'
  }
];

// Bài tập luyện nghe tương tác phân cấp
export const LISTENING_DRILLS_BY_LEVEL = [
  // Mức 1 (HSK 1 - Khởi động & Nền tảng)
  {
    id: 'list-l1-01',
    level: 1,
    audioText: 'nǐ hǎo',
    hanzi: '你好',
    question: 'Nghe và chọn câu tiếng Việt tương ứng:',
    options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'],
    correctIndex: 0,
    explanation: '你好 (nǐ hǎo) nghĩa là "Xin chào".'
  },
  {
    id: 'list-l1-02',
    level: 1,
    audioText: 'xièxie',
    hanzi: '谢谢',
    question: 'Nghe và chọn chữ Hán chính xác:',
    options: ['不客气', '谢谢', '对不起', '再见'],
    correctIndex: 1,
    explanation: '谢谢 (xièxie) nghĩa là "Cảm ơn".'
  },
  {
    id: 'list-l1-03',
    level: 1,
    audioText: 'Zhōngguó',
    hanzi: '中国',
    question: 'Nghe và chọn phiên âm Pinyin đúng:',
    options: ['Zhōngwén', 'Zhōngguó', 'Měiguó', 'Yuènán'],
    correctIndex: 1,
    explanation: '中国 (Zhōngguó) nghĩa là "Trung Quốc".'
  },
  {
    id: 'list-l1-04',
    level: 1,
    audioText: 'duìbuqǐ',
    hanzi: '对不起',
    question: 'Nghe và chọn câu đáp lại phù hợp trong tiếng Trung:',
    options: ['没关系', '不用谢', '再见', '你好'],
    correctIndex: 0,
    explanation: '对不起 (Xin lỗi) thường được đáp lại bằng 没关系 (Không sao đâu).'
  },
  {
    id: 'list-l1-05',
    level: 1,
    audioText: 'wǒ de lǎoshī',
    hanzi: '我的老师',
    question: 'Nghe và chọn ý nghĩa tiếng Việt chính xác:',
    options: ['Học sinh của tôi', 'Giáo viên của tôi', 'Bạn học của tôi', 'Bố mẹ của tôi'],
    correctIndex: 1,
    explanation: '我的老师 (wǒ de lǎoshī) nghĩa là "Giáo viên của tôi".'
  },
  {
    id: 'list-l1-06',
    level: 1,
    audioText: 'jīntiān xīngqītiān',
    hanzi: '今天星期天',
    question: 'Nghe và xác định hôm nay là thứ mấy:',
    options: ['Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Tư'],
    correctIndex: 1,
    explanation: '星期天 (xīngqītiān) nghĩa là "Chủ Nhật".'
  },
  {
    id: 'list-l1-07',
    level: 1,
    audioText: 'hē shuǐ',
    hanzi: '喝水',
    question: 'Nghe và chọn hành động được nhắc tới:',
    options: ['Ăn cơm', 'Uống nước', 'Ngủ', 'Đi bộ'],
    correctIndex: 1,
    explanation: '喝水 (hē shuǐ) nghĩa là "Uống nước".'
  },
  {
    id: 'list-l1-08',
    level: 1,
    audioText: 'tā zài yīyuàn',
    hanzi: '他在医院',
    question: 'Nghe và xác định người đó đang ở đâu:',
    options: ['Trường học', 'Bệnh viện', 'Sân bay', 'Cửa hàng'],
    correctIndex: 1,
    explanation: '医院 (yīyuàn) nghĩa là "Bệnh viện".'
  },
  {
    id: 'list-l1-09',
    level: 1,
    audioText: 'sān gè píngguǒ',
    hanzi: '三个苹果',
    question: 'Nghe số lượng và đồ vật được nhắc tới:',
    options: ['3 quả táo', '4 quả chuối', '3 ly trà', '5 bát cơm'],
    correctIndex: 0,
    explanation: '三个苹果 (sān gè píngguǒ) nghĩa là "3 quả táo".'
  },
  {
    id: 'list-l1-10',
    level: 1,
    audioText: 'wǒ hěn xǐhuan tā',
    hanzi: '我很喜欢他',
    question: 'Nghe và chọn cảm xúc của người nói:',
    options: ['Rất ghét anh ấy', 'Rất thích anh ấy', 'Không biết anh ấy', 'Sợ anh ấy'],
    correctIndex: 1,
    explanation: '我很喜欢他 (wǒ hěn xǐhuan tā) nghĩa là "Tôi rất thích anh ấy".'
  },

  // Mức 2 (HSK 2 - Tăng tốc & Sinh hoạt)
  {
    id: 'list-l2-01',
    level: 2,
    audioText: 'duōshao qián',
    hanzi: '多少钱',
    question: 'Nghe câu hỏi và chọn tình huống sử dụng:',
    options: ['Hỏi giờ', 'Hỏi giá tiền', 'Hỏi đường', 'Hỏi tên'],
    correctIndex: 1,
    explanation: '多少钱 (duōshao qián) là câu hỏi "Bao nhiêu tiền?".'
  },
  {
    id: 'list-l2-02',
    level: 2,
    audioText: 'bú kèqi',
    hanzi: '不客气',
    question: 'Câu này thường được dùng để đáp lại câu nào?',
    options: ['你好', '再见', '谢谢', '没关系'],
    correctIndex: 2,
    explanation: '不客气 (bú kèqi) nghĩa là "Đừng khách sáo", dùng đáp lại 谢谢 (Cảm ơn).'
  },
  {
    id: 'list-l2-03',
    level: 2,
    audioText: 'zuǒbian de fángjiān',
    hanzi: '左边的房间',
    question: 'Nghe và chọn phương hướng căn phòng:',
    options: ['Căn phòng bên phải', 'Căn phòng bên trái', 'Căn phòng phía trước', 'Căn phòng phía sau'],
    correctIndex: 1,
    explanation: '左边 (zuǒbian) nghĩa là "bên trái".'
  },
  {
    id: 'list-l2-04',
    level: 2,
    audioText: 'yìqǐ qù kàn diànyǐng ba',
    hanzi: '一起去看电影吧',
    question: 'Người nói đang rủ đối phương làm gì?',
    options: ['Đi siêu thị', 'Cùng đi xem phim', 'Về nhà ăn cơm', 'Đi tập thể thao'],
    correctIndex: 1,
    explanation: '看电影 (kàn diànyǐng) nghĩa là "xem phim".'
  },
  {
    id: 'list-l2-05',
    level: 2,
    audioText: 'wǒ zuò huǒchē qù shànghǎi',
    hanzi: '我坐火车去上海',
    question: 'Người nói di chuyển bằng phương tiện gì?',
    options: ['Máy bay', 'Tàu hỏa', 'Xe buýt', 'Tàu điện ngầm'],
    correctIndex: 1,
    explanation: '火车 (huǒchē) nghĩa là "tàu hỏa".'
  },
  {
    id: 'list-l2-06',
    level: 2,
    audioText: 'tā zài gōngsī gōngzuò le sān nián',
    hanzi: '她在公司工作了三年',
    question: 'Cô ấy đã làm việc ở công ty bao lâu?',
    options: ['3 tháng', '3 năm', '3 tuần', '13 năm'],
    correctIndex: 1,
    explanation: '三年 (sān nián) nghĩa là "3 năm".'
  },
  {
    id: 'list-l2-07',
    level: 2,
    audioText: 'míngtiān tiānqì bǐ jīntiān hǎo',
    hanzi: '明天天气比今天好',
    question: 'Theo câu nói, thời tiết ngày mai như thế nào?',
    options: ['Lạnh hơn hôm nay', 'Tốt hơn hôm nay', 'Có mưa to', 'Xấu hơn hôm nay'],
    correctIndex: 1,
    explanation: '比今天好 nghĩa là "tốt hơn hôm nay".'
  },
  {
    id: 'list-l2-08',
    level: 2,
    audioText: 'qǐng gěi wǒ yì bēi kāfēi',
    hanzi: '请给我一杯咖啡',
    question: 'Người nói yêu cầu món đồ uống nào?',
    options: ['Một ly trà sữa', 'Một ly cà phê', 'Một cốc nước ngọt', 'Một bình trà nóng'],
    correctIndex: 1,
    explanation: '一杯咖啡 (yì bēi kāfēi) nghĩa là "một ly cà phê".'
  },
  {
    id: 'list-l2-09',
    level: 2,
    audioText: 'tā chàng gē chàng de fēicháng hǎo',
    hanzi: '她唱歌唱得非常好',
    question: 'Lời nhận xét về khả năng ca hát của cô ấy là gì?',
    options: ['Hát rất dở', 'Hát vô cùng hay', 'Không biết hát', 'Chỉ hát lúc rảnh'],
    correctIndex: 1,
    explanation: '唱得非常好 nghĩa là "hát vô cùng hay/xuất sắc".'
  },
  {
    id: 'list-l2-10',
    level: 2,
    audioText: 'chūzūchē yǐjīng dào ménkǒu le',
    hanzi: '出租车已经到门口了',
    question: 'Phương tiện nào đã đến trước cửa?',
    options: ['Xe đạp', 'Xe taxi', 'Xe máy', 'Xe buýt'],
    correctIndex: 1,
    explanation: '出租车 (chūzūchē) nghĩa là "xe taxi".'
  },

  // Mức 3 (HSK 3 - Chinh phục & Bứt phá)
  {
    id: 'list-l3-01',
    level: 3,
    audioText: 'kěyǐ piányi yìdiǎn ma',
    hanzi: '可以便宜一点吗？',
    question: 'Người nói đang có ý định gì?',
    options: ['Hỏi đường đi chợ', 'Mặc cả bớt giá', 'Khen đồ đẹp', 'Muốn đổi trả hàng'],
    correctIndex: 1,
    explanation: '可以便宜一点吗 nghĩa là "Có thể rẻ hơn một chút được không?" (mặc cả).'
  },
  {
    id: 'list-l3-02',
    level: 3,
    audioText: 'suīrán hěn nán dànshì hěn yǒu yìsi',
    hanzi: '虽然很难但是很有意思',
    question: 'Cặp liên từ trong câu biểu thị mối quan hệ gì?',
    options: ['Nguyên nhân - kết quả', 'Tương phản - đối lập', 'Tăng tiến', 'Giả thiết'],
    correctIndex: 1,
    explanation: '虽然...但是... biểu thị mối quan hệ tương phản (tuy... nhưng...).'
  },
  {
    id: 'list-l3-03',
    level: 3,
    audioText: 'bǎ hùzhào fàng jìn bāobāo lǐ',
    hanzi: '把护照放进包包里',
    question: 'Người nói yêu cầu cất vật dụng gì vào túi xách?',
    options: ['Điện thoại', 'Hộ chiếu', 'Ví tiền', 'Chìa khóa'],
    correctIndex: 1,
    explanation: '护照 (hùzhào) nghĩa là "hộ chiếu".'
  },
  {
    id: 'list-l3-04',
    level: 3,
    audioText: 'chúle xīngqītiān yǐwài wǒ měitiān dōu jiānchí yùndòng',
    hanzi: '除了星期天以外我每天都坚持运动',
    question: 'Người nói không tập thể dục vào ngày nào?',
    options: ['Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Sáu'],
    correctIndex: 1,
    explanation: '除了星期天以外 nghĩa là "ngoại trừ ngày Chủ Nhật ra".'
  },
  {
    id: 'list-l3-05',
    level: 3,
    audioText: 'huānyíng guānglín qǐngwèn nín yǒu yùdìng ma',
    hanzi: '欢迎光临，请问您有预订吗？',
    question: 'Tình huống giao tiếp này diễn ra ở đâu?',
    options: ['Rạp chiếu phim', 'Khách sạn hoặc nhà hàng', 'Trạm xe buýt', 'Bệnh viện'],
    correctIndex: 1,
    explanation: '欢迎光临，请问您有预订吗？ thường dùng trong tiếp đón khách sạn, nhà hàng.'
  },
  {
    id: 'list-l3-06',
    level: 3,
    audioText: 'bèi dàyǔ lín shī le yīfu',
    hanzi: '被大雨淋湿了衣服',
    question: 'Nguyên nhân quần áo bị ướt là gì?',
    options: ['Làm đổ nước canh', 'Bị cơn mưa to làm ướt', 'Rơi xuống hồ bơi', 'Giặt đồ chưa khô'],
    correctIndex: 1,
    explanation: '被大雨淋湿 nghĩa là "bị cơn mưa to làm ướt sũng".'
  },
  {
    id: 'list-l3-07',
    level: 3,
    audioText: 'tā yuè lái yuè xǐhuan zhōngguó shūfǎ',
    hanzi: '他越来越喜欢中国书法',
    question: 'Mức độ yêu thích của anh ấy đối với thư pháp Trung Quốc như thế nào?',
    options: ['Ngày càng thích hơn', 'Ngày càng chán nản', 'Đã bỏ cuộc', 'Chưa từng học'],
    correctIndex: 0,
    explanation: '越来越喜欢 nghĩa là "ngày càng yêu thích hơn".'
  },
  {
    id: 'list-l3-08',
    level: 3,
    audioText: 'zhè fèn wénjiàn xūyào jīnglǐ qiānzì',
    hanzi: '这份文件需要经理签字',
    question: 'Văn kiện này cần điều gì để hoàn tất?',
    options: ['Gửi qua email', 'Chữ ký của giám đốc', 'In thành 5 bản', 'Dịch sang tiếng Anh'],
    correctIndex: 1,
    explanation: '经理签字 (jīnglǐ qiānzì) nghĩa là "giám đốc ký tên".'
  },
  {
    id: 'list-l3-09',
    level: 3,
    audioText: 'zhè jiā fàndiàn de kǎoyā fēicháng dìdao',
    hanzi: '这家饭店的烤鸭非常地道',
    question: 'Món vịt quay của nhà hàng được khen ngợi điều gì?',
    options: ['Giá rất rẻ', 'Rất chuẩn vị truyền thống', 'Được phục vụ nhanh', 'Trông bắt mắt'],
    correctIndex: 1,
    explanation: '地道 (dìdao) nghĩa là "chính tông, chuẩn vị truyền thống".'
  },
  {
    id: 'list-l3-10',
    level: 3,
    audioText: 'yīnwèi dǔchē suǒyǐ chídào le shí fēnzhōng',
    hanzi: '因为堵车所以迟到了十分钟',
    question: 'Lý do bị trễ 10 phút là gì?',
    options: ['Dậy muộn', 'Tắc đường kẹt xe', 'Hỏng xe giữa đường', 'Đi nhầm ga tàu'],
    correctIndex: 1,
    explanation: '堵车 (dǔchē) nghĩa là "kẹt xe / tắc đường".'
  },

  // Mức 4 (HSK 4 - Thử thách Bậc thầy & Công sở)
  {
    id: 'list-l4-01',
    level: 4,
    audioText: 'sì shì sì shí shì shí',
    hanzi: '四是四，十是十',
    question: 'Câu này nhằm rèn luyện kỹ năng phát âm nào?',
    options: ['Phân biệt âm đầu lưỡi "s" và âm uốn lưỡi "sh"', 'Phân biệt vận mẫu "an" và "ang"', 'Luyện biến điệu hai thanh 3', 'Phân biệt thanh 1 và thanh 4'],
    correctIndex: 0,
    explanation: 'Đây là câu líu lưỡi kinh điển để phân biệt âm s và sh.'
  },
  {
    id: 'list-l4-02',
    level: 4,
    audioText: 'yì xīn yí yì',
    hanzi: '一心一意',
    question: 'Thành ngữ này có ý nghĩa tương đương câu tiếng Việt nào?',
    options: ['Đứng núi này trông núi nọ', 'Ba chìm bảy nổi', 'Một lòng một dạ / Toàn tâm toàn ý', 'Trăm nghe không bằng một thấy'],
    correctIndex: 2,
    explanation: '一心一意 (yì xīn yí yì) nghĩa là toàn tâm toàn ý, một lòng một dạ.'
  },
  {
    id: 'list-l4-03',
    level: 4,
    audioText: 'bùjǐn néng tígāo kǒuyǔ érqiě néng jiéjiāo péngyou',
    hanzi: '不仅能提高口语，而且能结交朋友',
    question: 'Lợi ích kép được nhắc đến là gì?',
    options: ['Kiếm được tiền và tiết kiệm thời gian', 'Vừa nâng cao khẩu ngữ vừa kết bạn', 'Được đi du lịch và mua sắm', 'Được thăng chức và tăng lương'],
    correctIndex: 1,
    explanation: '不仅...而且... nêu hai lợi ích: nâng cao khẩu ngữ và kết bạn bè mới.'
  },
  {
    id: 'list-l4-04',
    level: 4,
    audioText: 'wúlùn tiānqì rúhé bǐsài dōu jiāng rúqī jǔxíng',
    hanzi: '无论天气如何，比赛都将如期举行',
    question: 'Trận đấu sẽ diễn ra như thế nào?',
    options: ['Bị hủy bỏ nếu có mưa', 'Vẫn diễn ra đúng kế hoạch bất kể thời tiết', 'Hoãn lại sang tuần sau', 'Chuyển địa điểm thi đấu vào trong nhà'],
    correctIndex: 1,
    explanation: '如期举行 (rúqī jǔxíng) nghĩa là diễn ra đúng kỳ hạn/kế hoạch.'
  },
  {
    id: 'list-l4-05',
    level: 4,
    audioText: 'tā jīlěi le fēngfù de shìchǎng yíngxiāo jīngyàn',
    hanzi: '他积累了丰富的市场营销经验',
    question: 'Anh ấy đã tích lũy được điều gì quý báu?',
    options: ['Vốn đầu tư ban đầu', 'Kinh nghiệm phong phú về tiếp thị thị trường', 'Bằng cấp thạc sĩ', 'Mối quan hệ chính khách'],
    correctIndex: 1,
    explanation: '市场营销经验 (shìchǎng yíngxiāo jīngyàn) nghĩa là kinh nghiệm tiếp thị thị trường.'
  },
  {
    id: 'list-l4-06',
    level: 4,
    audioText: 'duìyú zhè cì hézuò wǒmen chōngmǎn xìnxīn',
    hanzi: '对于这次合作，我们充满信心',
    question: 'Thái độ của đối tác đối với lần hợp tác này là gì?',
    options: ['Rất hoài nghi', 'Tràn đầy tự tin', 'Muốn đàm phán lại giá', 'Chờ đợi kết quả năm sau'],
    correctIndex: 1,
    explanation: '充满信心 (chōngmǎn xìnxīn) nghĩa là "tràn đầy lòng tự tin".'
  },
  {
    id: 'list-l4-07',
    level: 4,
    audioText: 'jìrán nǐ yǐjīng juédìng le jiù yǒnggǎn de qù zuò ba',
    hanzi: '既然你已经决定了，就勇敢地去做吧',
    question: 'Người nói đưa ra lời khuyên gì cho đối phương?',
    options: ['Hãy suy nghĩ lại thật kỹ', 'Hãy dũng cảm thực hiện vì đã quyết định', 'Hãy hỏi ý kiến bố mẹ', 'Nên chờ thêm cơ hội tốt hơn'],
    correctIndex: 1,
    explanation: '勇敢地去做 nghĩa là hãy dũng cảm bắt tay vào hành động.'
  },
  {
    id: 'list-l4-08',
    level: 4,
    audioText: 'lián xiǎoxuéshēng dōu zhīdào de chángshí nǐ jūrán bù dǒng',
    hanzi: '连小学生都知道的常识，你居然不懂',
    question: 'Ý ngầm trong câu nói biểu thị sắc thái cảm xúc gì?',
    options: ['Khen ngợi học sinh tiểu học', 'Ngạc nhiên và chê trách vì thiếu kiến thức thường thức cơ bản', 'Đồng cảm với người nghe', 'Khuyên học sinh đọc nhiều sách'],
    correctIndex: 1,
    explanation: '居然不懂 biểu thị sự sửng sốt và chê trách khi đối phương không biết điều sơ đẳng.'
  },
  {
    id: 'list-l4-09',
    level: 4,
    audioText: 'bùguǎn zěnmeyàng wǒmen dōu yīnggāi zūnzhòng tārén de xuǎnzé',
    hanzi: '不管怎么样，我们都应该尊重他人的选择',
    question: 'Nguyên tắc sống được nhấn mạnh trong câu là gì?',
    options: ['Phải tự quyết định một mình', 'Nên tôn trọng sự lựa chọn của người khác', 'Phải làm theo số đông', 'Không được tin ai'],
    correctIndex: 1,
    explanation: '尊重他人的选择 nghĩa là "tôn trọng sự lựa chọn của người khác".'
  },
  {
    id: 'list-l4-10',
    level: 4,
    audioText: 'rènzhēn fùzé de tàidu shì huòdé chénggōng de guānjiàn',
    hanzi: '认真负责的态度是获得成功的关键',
    question: 'Yếu tố mấu chốt để thành công theo câu nói là gì?',
    options: ['Gia đình giàu có', 'Thái độ nghiêm túc và có trách nhiệm', 'May mắn ngẫu nhiên', 'Ngoại hình thu hút'],
    correctIndex: 1,
    explanation: '认真负责的态度 (thái độ nghiêm túc, có trách nhiệm) là chìa khóa đạt được thành công.'
  },

  // Mức 5 (HSK 5 - Cao cấp & Học thuật)
  {
    id: 'list-l5-01',
    level: 5,
    audioText: '在本次面试中，我们更看重应聘者面对突发问题的抗压能力以及团队协作精神，而不仅仅是专业技能的高低。',
    hanzi: '在本次面试中，我们更看重应聘者面对突发问题的抗压能力以及团队协作精神，而不仅仅是专业技能的高低。',
    pinyin: 'Zài běncì miànshì zhōng, wǒmen gèng kànzhòng yìngpìnzhě miànduì tūfā wèntí de kàngyā nénglì yǐjí tuánduì xiézuò jīngshén, ér bù jǐnjǐn shì zhuānyè jìnéng de gāodī.',
    translation: 'Trong buổi phỏng vấn lần này, chúng tôi coi trọng khả năng chịu áp lực trước các vấn đề phát sinh và tinh thần hợp tác nhóm của ứng viên hơn là chỉ đơn thuần xét đến kỹ năng chuyên môn.',
    question: 'Theo người nói, tiêu chí quan trọng nhất khi tuyển dụng là gì?',
    options: ['Bằng cấp học thuật cao', 'Kỹ năng chịu áp lực và làm việc nhóm', 'Kinh nghiệm quản lý lâu năm', 'Khả năng làm việc độc lập'],
    correctIndex: 1,
    explanation: 'Người nói nhấn mạnh: "更看重应聘者面对突发问题的抗压能力以及团队协作精神" (coi trọng khả năng chịu áp lực và tinh thần đồng đội).',
    topic: 'Phỏng vấn tuyển dụng',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-02',
    level: 5,
    audioText: '随着数字技术的迅猛发展，传统制造业正在经历前所未有的产业升级与智能化改造。',
    hanzi: '随着数字技术的迅猛发展，传统制造业正在经历前所未有的产业升级与智能化改造。',
    pinyin: 'Suízhe shùzì jìshù de xùnměng fāzhǎn, chuántǒng zhìzàoyè zhèngzài jīnglì qiánsuǒwèiyǒu de chǎnyè shēngjí yǔ zhìnénghuà gǎizào.',
    translation: 'Cùng với sự phát triển nhanh chóng của công nghệ số, ngành chế tạo truyền thống đang trải qua đợt nâng cấp công nghiệp và cải tạo thông minh chưa từng có.',
    question: 'Ngành chế tạo truyền thống đang diễn ra xu hướng nào?',
    options: ['Cắt giảm nhân lực thủ công', 'Nâng cấp công nghiệp và ứng dụng thông minh', 'Chuyển đổi hoàn toàn sang bán lẻ', 'Ngừng sản xuất các mặt hàng cũ'],
    correctIndex: 1,
    explanation: 'Đoạn nghe nêu rõ "正在经历前所未有的产业升级与智能化改造" (nâng cấp công nghiệp và cải tạo thông minh).',
    topic: 'Kinh tế & Công nghệ',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-03',
    level: 5,
    audioText: '各位旅客请注意，由于大雾天气导致能见度不足，飞往上海的MU518次航班将推迟两小时起飞，敬请谅解。',
    hanzi: '各位旅客请注意，由于大雾天气导致能见度不足，飞往上海的MU518次航班将推迟两小时起飞，敬请谅解。',
    pinyin: 'Gèwèi lǚkè qǐng zhùyì, yóuyú dàwù tiānqì dǎozhì néngjiàndù bùzú, fēiwǎng Shànghǎi de MU518 cì hángbān jiāng tuīchí liǎng xiǎoshí qǐfēi, jìngqǐng liàngjiě.',
    translation: 'Quý hành khách xin lưu ý, do thời tiết sương mù dày đặc làm tầm nhìn hạn chế, chuyến bay MU518 đi Thượng Hải sẽ bị hoãn khởi hành 2 giờ, mong quý khách thông cảm.',
    question: 'Nguyên nhân chuyến bay bị hoãn cất cánh là gì?',
    options: ['Máy bay gặp sự cố động cơ', 'Thời tiết sương mù tầm nhìn kém', 'Đường băng đang sửa chữa', 'Hành khách lên máy bay trễ'],
    correctIndex: 1,
    explanation: 'Thông báo nêu rõ: "由于大雾天气导致能见度不足" (do sương mù lớn dẫn đến tầm nhìn không đủ).',
    topic: 'Thông báo sân bay',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-04',
    level: 5,
    audioText: '导演认为这场戏的重点在于眼神交流，演员不需要过多的肢体动作，只要通过微表情表达内心的挣扎即可。',
    hanzi: '导演认为这场戏的重点在于眼神交流，演员不需要过多的肢体动作，只要通过微表情表达内心的挣扎即可。',
    pinyin: 'Dǎoyǎn rènwéi zhè chǎng xì de zhòngdiǎn zàiyú yǎnshén jiāoliú, yǎnyuán bù xūyào guòduō de zhītǐ dòngzuò, zhǐyào tōngguò wēi biǎoqíng biǎodá nèixīn de zhēngzhá jíkě.',
    translation: 'Đạo diễn cho rằng trọng tâm của phân cảnh này nằm ở ánh mắt giao tiếp, diễn viên không cần quá nhiều động tác cơ thể, chỉ cần thông qua biểu cảm nhỏ thể hiện sự giằng xé nội tâm là được.',
    question: 'Đạo diễn yêu cầu diễn viên thể hiện nhân vật bằng cách nào?',
    options: ['Thực hiện nhiều động tác hình thể mạnh mẽ', 'Thông qua ánh mắt và vi biểu cảm trên khuôn mặt', 'Nói lời thoại thật to và truyền cảm', 'Giữ im lặng và đứng yên một chỗ'],
    correctIndex: 1,
    explanation: 'Đoạn văn nêu: "重点在于眼神交流...通过微表情表达内心的挣扎" (trọng tâm ở ánh mắt và biểu cảm tinh tế).',
    topic: 'Nghệ thuật biểu diễn',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-05',
    level: 5,
    audioText: '长时间熬夜不仅会降低人体的免疫力，还会显著损害记忆力与专注度，建议职场青年保持规律的作息时间。',
    hanzi: '长时间熬夜不仅会降低人体的免疫力，还会显著损害记忆力与专注度，建议职场青年保持规律的作息时间。',
    pinyin: 'Cháng shíjiān áoyè bùjǐn huì jiàngdī réntǐ de miǎnyìlì, hái huì xiǎnzhù sǔnhài jìyìlì yǔ zhuānzhùdù, jiànyì zhíchǎng qīngnián bǎochí guīlǜ de zuòxī shíjiān.',
    translation: 'Thức khuya trong thời gian dài không chỉ làm giảm khả năng miễn dịch của cơ thể mà còn tổn hại rõ rệt đến trí nhớ và sự tập trung; khuyến nghị người trẻ giữ nếp sinh hoạt điều độ.',
    question: 'Tác hại của việc thức khuya thường xuyên được nhắc tới là gì?',
    options: ['Gây tăng cân nhanh chóng', 'Giảm miễn dịch và suy giảm trí nhớ', 'Dễ gây đau dạ dày mãn tính', 'Làm giảm thị lực nghiêm trọng'],
    correctIndex: 1,
    explanation: 'Nội dung nói: "降低人体的免疫力，还会显著损害记忆力与专注度" (giảm miễn dịch, tổn hại trí nhớ và tập trung).',
    topic: 'Sức khỏe & Đời sống',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-06',
    level: 5,
    audioText: '对历史文化街区的修缮，必须遵循保护第一、修旧如旧的原则，绝不能为了商业开发而破坏古建筑的历史原貌。',
    hanzi: '对历史文化街区的修缮，必须遵循保护第一、修旧如旧的原则，绝不能为了商业开发而破坏古建筑的历史原貌。',
    pinyin: 'Duì lìshǐ wénhuà jiēqū de xiūshàn, bìxū zūnxún bǎohù dì-yī, xiū jiù rú jiù de yuánzé, jué bù néng wèile shāngyè kāifā ér pòhuài gǔ jiànzhù de lìshǐ yuánmào.',
    translation: 'Việc tu sửa các khu phố văn hóa lịch sử phải tuân thủ nguyên tắc bảo tồn là trên hết, tu bổ phục hồi như cũ, tuyệt đối không được vì phát triển thương mại mà phá hủy diện mạo lịch sử của các công trình cổ.',
    question: 'Nguyên tắc cốt lõi khi tu bổ di tích lịch sử là gì?',
    options: ['Xây dựng lại hoàn toàn mới', 'Bảo tồn diện mạo nguyên bản lịch sử', 'Tập trung tối đa vào tiện ích mua sắm', 'Phá bỏ các gian nhà gỗ cũ'],
    correctIndex: 1,
    explanation: '"保护第一、修旧如旧" nghĩa là bảo tồn là số một, trùng tu giữ nguyên nét cổ xưa, không vì thương mại mà phá hủy nguyên mạo.',
    topic: 'Bảo tồn di sản',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-07',
    level: 5,
    audioText: '在移动互联网时代，保护个人隐私信息刻不容缓。用户应当定期更换复杂密码，切勿轻易在陌生网页透露身份信息。',
    hanzi: '在移动互联网时代，保护个人隐私信息刻不容缓。用户应当定期更换复杂密码，切勿轻易在陌生网页透露身份信息。',
    pinyin: 'Zài yídòng hùliánwǎng shídài, bǎohù gèrén yǐnsī xìnxī kèbùrónghuǎn. Yònghù yīngdāng dìngqī gēnghuàn fùzá mìmǎ, qièwù qīngyì zài mòshēng wǎngyè tòulù shēnfèn xìnxī.',
    translation: 'Trong kỷ nguyên Internet di động, bảo vệ quyền riêng tư là điều cấp bách. Người dùng cần định kỳ thay đổi mật khẩu phức tạp, tuyệt đối không tùy tiện tiết lộ thông tin cá nhân trên trang web lạ.',
    question: 'Người dùng được khuyên làm gì để bảo vệ thông tin cá nhân?',
    options: ['Không sử dụng điện thoại thông minh', 'Đổi mật khẩu định kỳ và cảnh giác với trang web lạ', 'Chia sẻ thông tin công khai để tránh bị giả mạo', 'Chỉ dùng một mật khẩu cho mọi tài khoản'],
    correctIndex: 1,
    explanation: 'Lời khuyên: "定期更换复杂密码，切勿轻易在陌生网页透露身份信息" (đổi mật khẩu phức tạp định kỳ và không để lộ thông tin).',
    topic: 'An toàn mạng',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-08',
    level: 5,
    audioText: '经董事会审议决定，公司下季度将压缩百分之十五的非核心业务预算，集中优质资金攻坚关键核心技术的研发。',
    hanzi: '经董事会审议决定，公司下季度将压缩百分之十五的非核心业务预算，集中优质资金攻坚关键核心技术的研发。',
    pinyin: 'Jīng dǒngshìhuì shěnyì juédìng, gōngsī xià jìdù jiāng yāsuō bǎifēn zhī shíwǔ de fēi héxīn yèwù yùsuàn, jízhōng yōuzhì zījīn gōngjiān guānjiàn héxīn jìshù de yánfā.',
    translation: 'Theo quyết định của Hội đồng quản trị, quý tới công ty sẽ cắt giảm 15% ngân sách các mảng kinh doanh không cốt lõi để tập trung nguồn vốn chất lượng cao vào nghiên cứu phát triển công nghệ then chốt.',
    question: 'Mục đích chính của việc cắt giảm ngân sách là gì?',
    options: ['Chi trả cổ tức cho cổ đông', 'Tập trung nghiên cứu công nghệ then chốt', 'Tuyển thêm nhân viên kinh doanh', 'Mở rộng văn phòng đại diện'],
    correctIndex: 1,
    explanation: '"集中优质资金攻坚关键核心技术的研发" (dồn vốn chất lượng cho R&D công nghệ then chốt).',
    topic: 'Quản trị doanh nghiệp',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-09',
    level: 5,
    audioText: '这次航天成就标志着我国在深空探测领域迈出了里程碑式的一步，为后续建立常态化月球科研基地奠定了基础。',
    hanzi: '这次航天成就标志着我国在深空探测领域迈出了里程碑式的一步，为后续建立常态化月球科研基地奠定了基础。',
    pinyin: 'Zhè cì hángtiān chéngjiù biāozhì zhe wǒguó zài shēnkōng tàncè lǐngyù màichū le lǐchéngbēi shì de yí bù, wèi hòuxù jiànlì chángtàihuà yuèqiú kēyán jīdì diàndìng le jīchǔ.',
    translation: 'Thành tựu hàng không vũ trụ lần này đánh dấu bước tiến mang tính cột mốc trong lĩnh vực thám hiểm không gian sâu, đặt nền tảng cho việc thiết lập trạm nghiên cứu khoa học thường nhật trên Mặt Trăng sau này.',
    question: 'Thành tựu vũ trụ này có ý nghĩa quan trọng như thế nào?',
    options: ['Tìm thấy nguồn nước trên sao Hỏa', 'Đặt nền tảng xây dựng trạm nghiên cứu Mặt Trăng', 'Rút ngắn thời gian bay vào vũ trụ', 'Giảm một nửa chi phí phóng tên lửa'],
    correctIndex: 1,
    explanation: '"为后续建立常态化月球科研基地奠定了基础" (nền tảng xây dựng trạm nghiên cứu Mặt Trăng).',
    topic: 'Khoa học vũ trụ',
    difficulty: 'advanced'
  },
  {
    id: 'list-l5-10',
    level: 5,
    audioText: '经过长达三轮的艰难磋商，双方终于在产品原产地认证与关税配额方面达成一致，签署了长期独家代理合作协议。',
    hanzi: '经过长达三轮的艰难磋商，双方终于在产品原产地认证与关税配额方面达成一致，签署了长期独家代理合作协议。',
    pinyin: 'Jīngguò chángdá sān lún de jiānnán cuōshāng, shuāngfāng zhōngyú zài chǎnpǐn yuánchǎndì rènzhèng yǔ guānshuì pèié fāngmiàn dáchéng yízhì, qiānshǔ le chángqī dújiā dàilǐ hézuò xiéyì.',
    translation: 'Trải qua ba vòng đàm phán cam go, hai bên cuối cùng đã đạt được đồng thuận về chứng nhận xuất xứ sản phẩm cùng hạn ngạch thuế quan, chính thức ký kết thỏa thuận hợp tác đại lý độc quyền dài hạn.',
    question: 'Hai bên đã ký kết loại hợp đồng nào?',
    options: ['Hợp đồng thuê mặt bằng thương mại', 'Thỏa thuận đại lý độc quyền dài hạn', 'Hợp đồng mua bán thiết bị máy móc', 'Biên bản thanh lý hợp tác đầu tư'],
    correctIndex: 1,
    explanation: '"签署了长期独家代理合作协议" (ký thỏa thuận hợp tác đại lý độc quyền dài hạn).',
    topic: 'Thương mại quốc tế',
    difficulty: 'advanced'
  },

  // Mức 6 (HSK 6 - Tinh hoa & Chuyên gia)
  {
    id: 'list-l6-01',
    level: 6,
    audioText: '在宏观经济调控中，央行审慎权衡逆周期调节与防范系统性金融风险之间的动态平衡，避免采取大水漫灌式的激进举措。',
    hanzi: '在宏观经济调控中，央行审慎权衡逆周期调节与防范系统性金融风险之间的动态平衡，避免采取大水漫灌式的激进举措。',
    pinyin: 'Zài hóngguān jīngjì tiáokòng zhōng, yāngháng shěnshèn quánhéng nìzhōuqī tiáojié yǔ fángfàn xìtǒngxìng jīnróng fēngxiǎn zhījiān de dòngtài pínghéng, bìmiǎn cǎiqǔ dàshuǐ mànguàn shì de jījìn jǔcuò.',
    translation: 'Trong điều hành kinh tế vĩ mô, ngân hàng trung ương thận trọng cân nhắc thế cân bằng động giữa điều tiết ngược chu kỳ và phòng ngừa rủi ro tài chính mang tính hệ thống, tránh áp dụng các biện pháp cấp tiến bơm tiền ồ ạt.',
    question: 'Quan điểm điều hành kinh tế vĩ mô của ngân hàng trung ương là gì?',
    options: ['Bơm tiền ồ ạt kích thích tăng trưởng ngắn hạn', 'Cân bằng thận trọng và kiểm soát rủi ro hệ thống', 'Ngừng hoàn toàn việc can thiệp vào thị trường tiền tệ', 'Chỉ ưu tiên giải cứu các tập đoàn bất động sản lớn'],
    correctIndex: 1,
    explanation: '"审慎权衡...避免采取大水漫灌式的激进举措" thể hiện định hướng điều hành thận trọng, coi trọng cân bằng và an toàn hệ thống.',
    topic: 'Kinh tế học vĩ mô',
    difficulty: 'master'
  },
  {
    id: 'list-l6-02',
    level: 6,
    audioText: '语言不仅是人类交际的工具，更是思维结构的投射与文化认同的载体。消亡一种方言，无异于湮灭了一段不可复刻的精神历史。',
    hanzi: '语言不仅是人类交际的工具，更是思维结构的投射与文化认同的载体。消亡一种方言，无异于湮灭了一段不可复刻的精神历史。',
    pinyin: 'Yǔyán bùjǐn shì rénlèi jiāojì de gōngjù, gèng shì sīwéi jiégòu de tóushè yǔ wénhuà rèntóng de zàitǐ. Xiāowáng yì zhǒng fāngyán, wúyì yú yānmiè le yí duàn bùkě fùkè de jīngshén lìshǐ.',
    translation: 'Ngôn ngữ không chỉ là công cụ giao tiếp của con người, mà còn là sự phản chiếu cấu trúc tư duy và là cội nguồn của bản sắc văn hóa. Sự biến mất của một phương ngữ cũng đồng nghĩa với việc xóa sổ một giai đoạn lịch sử tinh thần không thể tái tạo.',
    question: 'Tác giả có thái độ như thế nào đối với sự mai một của các phương ngữ?',
    options: ['Thờ ơ vì cho rằng đó là quy luật đào thải tự nhiên', 'Xót xa và cảnh báo tổn thất to lớn về văn hóa tinh thần', 'Hoan nghênh vì giúp thống nhất chữ viết và phát âm', 'Đề xuất thay thế tất cả phương ngữ bằng tiếng phổ thông'],
    correctIndex: 1,
    explanation: '"无异于湮灭了一段不可复刻的精神历史" thể hiện sự cảnh báo sâu sắc về mất mát văn hóa không thể đảo ngược khi ngôn ngữ biến mất.',
    topic: 'Ngôn ngữ học & Triết học',
    difficulty: 'master'
  },
  {
    id: 'list-l6-03',
    level: 6,
    audioText: '生态系统的退化往往具有滞后性与不可逆性，倘若仅仅在灾难显现后才被动应对，人类必将付出难以承受的生态代价。',
    hanzi: '生态系统的退化往往具有滞后性与不可逆性，倘若仅仅在灾难显现后才被动应对，人类必将付出难以承受的生态代价。',
    pinyin: 'Shēngtài xìtǒng de tuìhuà wǎngwǎng jùyǒu zhìhòuxìng yǔ bùkě nìxìng, tǎngruò jǐnjǐn zài zāinàn xiǎnxiàn hòu cái bèidòng yìngduì, rénlèi bìjiāng fùchū nǎnyǐ chéngshòu de shēngtài dàijià.',
    translation: 'Sự suy thoái của hệ sinh thái thường có tính chất trễ và không thể đảo ngược; nếu chỉ đợi sau khi thảm họa hiển hiện mới ứng phó bị động thì nhân loại chắc chắn sẽ phải trả một cái giá sinh thái khôn lường.',
    question: 'Đoạn văn muốn gửi gắm thông điệp cảnh tỉnh nào?',
    options: ['Cần chủ động phòng ngừa suy thoái môi trường trước khi quá muộn', 'Hệ sinh thái tự có khả năng phục hồi nhanh chóng', 'Nên tập trung khắc phục hậu quả thiên tai hơn là dự báo', 'Khai thác tài nguyên thiên nhiên là ưu tiên hàng đầu'],
    correctIndex: 0,
    explanation: 'Tính "滞后性与不可逆性" (trễ và không thể đảo ngược) đòi hỏi phải hành động ngăn chặn từ trước, không thể bị động.',
    topic: 'Bảo vệ sinh thái',
    difficulty: 'master'
  },
  {
    id: 'list-l6-04',
    level: 6,
    audioText: '尽管生成式算法在临床影像诊断中展现出惊人的准确率，但在涉及伦理决策和责任界定时，人类医生的临床直觉与同理心依旧不可替代。',
    hanzi: '尽管生成式算法在临床影像诊断中展现出惊人的准确率，但在涉及伦理决策和责任界定时，人类医生的临床直觉与同理心依旧不可替代。',
    pinyin: 'Jǐnguǎn shēngchéngshì suànfǎ zài línchuáng yǐngxiàng zhěnduàn zhōng zhǎnxiàn chū jīngrén de zhǔnquèlǜ, dàn zài shèjí lúnlǐ juécè yǔ zérèn jièdìng shí, rénlèi yīshēng de línchuáng zhíjué yǔ tónglǐxīn yījiù bùkě tìdài.',
    translation: 'Mặc dù thuật toán sinh học thể hiện độ chính xác đáng kinh ngạc trong chẩn đoán hình ảnh lâm sàng, song khi đề cập đến quyết định đạo đức và quy kết trách nhiệm, trực giác lâm sàng cùng lòng thấu cảm của bác sĩ con người vẫn là yếu tố không thể thay thế.',
    question: 'Điểm nào của bác sĩ con người mà trí tuệ nhân tạo hiện tại chưa thể thay thế?',
    options: ['Tốc độ phân tích hàng triệu tấm phim chụp', 'Khả năng quyết định đạo đức và lòng thấu cảm', 'Độ bền bỉ khi làm việc liên tục nhiều ngày', 'Khả năng ghi nhớ toàn bộ phác đồ điều trị thế giới'],
    correctIndex: 1,
    explanation: '"伦理决策和责任界定时，人类医生的临床直觉与同理心依旧不可替代" (quyết định y đức và sự đồng cảm là bất khả thay thế).',
    topic: 'Y tế & Trí tuệ nhân tạo',
    difficulty: 'master'
  },
  {
    id: 'list-l6-05',
    level: 6,
    audioText: '双方代表团本着相互尊重、互利共赢的崇高精神，签署了关于知识产权跨境保护与争端解决机制的联合公报。',
    hanzi: '双方代表团本着相互尊重、互利共赢的崇高精神，签署了关于知识产权跨境保护与争端解决机制的联合公报。',
    pinyin: 'Shuāngfāng dàibiǎotuán běnzhe xiānghù zūnzhòng, hùlì gòngyíng de chónggāo jīngshén, qiānshǔ le guānyú zhīshi chǎnquán kuàjìng bǎohù yǔ zhēngduān jiějué jīzhì de liánhé gōngbào.',
    translation: 'Phái đoàn hai bên trên tinh thần cao đẹp tôn trọng lẫn nhau, cùng có lợi đã ký kết bản thông cáo chung liên quan đến bảo hộ sở hữu trí tuệ xuyên biên giới và cơ chế giải quyết tranh chấp.',
    question: 'Bản thông cáo chung tập trung vào nội dung nào?',
    options: ['Bảo hộ sở hữu trí tuệ và giải quyết tranh chấp', 'Miễn trừ hoàn toàn visa du lịch giữa hai nước', 'Thành lập liên minh quân sự khu vực', 'Chuyển giao toàn bộ công nghệ lõi độc quyền'],
    correctIndex: 0,
    explanation: 'Nội dung thông cáo: "关于知识产权跨境保护与争端解决机制" (bảo hộ quyền SHTT và cơ chế xử lý bất đồng).',
    topic: 'Ngoại giao & Pháp lý',
    difficulty: 'master'
  },
  {
    id: 'list-l6-06',
    level: 6,
    audioText: '近期出土的西周青铜重器不仅铭文字数繁复，其记载的册命礼仪与土地分封制度更填补了传世典籍记载的关键空白。',
    hanzi: '近期出土的西周青铜重器不仅铭文字数繁复，其记载的册命礼仪与土地分封制度更填补了传世典籍记载的关键空白。',
    pinyin: 'Jìnqī chūtǔ de Xīzhōu qīngtóng zhòngqì bùjǐn míngwén zìshù fánfù, qí jìzǎi de cèmìng lǐyí yǔ tǔdì fēnfēng zhìdù gèng tiánbǔ le chuánshì diǎnjí jìzǎi de guānjiàn kòngbái.',
    translation: 'Vật phẩm đồng quý giá thời Tây Chu mới khai quật gần đây không chỉ có số lượng minh văn phong phú mà nghi lễ sắc phong cùng chế độ phân phong ruộng đất được ghi lại trong đó còn bù đắp khoảng trống then chốt trong các thư tịch cổ lưu truyền.',
    question: 'Giá trị học thuật quan trọng nhất của cổ vật đồng thau này là gì?',
    options: ['Có giá trị định giá thương mại hàng triệu đô la', 'Bổ khuyết tư liệu lịch sử về nghi lễ sắc phong và phân phong đất đai', 'Được đúc bằng hợp kim vàng ròng nguyên khối', 'Chứng minh kỹ thuật in ấn đã xuất hiện từ thời Tây Chu'],
    correctIndex: 1,
    explanation: '"填补了传世典籍记载的关键空白" (bù đắp khoảng trống tư liệu cổ về lễ sắc phong và đất đai).',
    topic: 'Khảo cổ & Lịch sử học',
    difficulty: 'master'
  },
  {
    id: 'list-l6-07',
    level: 6,
    audioText: '面对资本市场的剧烈震荡，理性的投资人应当摒弃追涨杀跌的情绪化博弈，立足于标的资产的内在价值与长期现金流折现。',
    hanzi: '面对资本市场的剧烈震荡，理性的投资人应当摒弃追涨杀跌的情绪化博弈，立足于标的资产的内在价值与长期现金流折现。',
    pinyin: 'Miànduì zīběn shìchǎng de jùliè zhèndàng, lǐxìng de tóuzīrén yīngdāng bǐngqì zhuīzhǎng shādiē de qíngxùhuà bóyì, lìzú yú biāodì zīchǎn de nèizài jiàzhí yǔ chángqī xiànjīnliú zhéxiàn.',
    translation: 'Trước những biến động dữ dội của thị trường vốn, nhà đầu tư lý trí cần từ bỏ tâm lý cờ bạc theo cảm xúc mua đỉnh bán đáy, mà phải dựa trên giá trị nội tại của tài sản cơ sở và chiết khấu dòng tiền dài hạn.',
    question: 'Tác giả khuyên nhà đầu tư nên hành động thế nào trước biến động thị trường?',
    options: ['Bán tống bán tháo tài sản khi thị trường vừa giảm', 'Đầu tư dựa trên giá trị nội tại và dòng tiền dài hạn', 'Vay mượn tối đa để mua lướt sóng ngắn hạn', 'Rút toàn bộ tiền gửi tiết kiệm ngân hàng'],
    correctIndex: 1,
    explanation: '"摒弃追涨杀跌...立足于标的资产的内在价值与长期现金流折现" (từ bỏ lướt sóng theo cảm xúc, chú trọng giá trị nội tại).',
    topic: 'Thị trường tài chính',
    difficulty: 'master'
  },
  {
    id: 'list-l6-08',
    level: 6,
    audioText: '汉语语音演变史清晰地表明，入声韵尾在北方官话中的弱化与消失，是导致现代普通话声调格局形成的重要驱动力之一。',
    hanzi: '汉语语音演变史清晰地表明，入声韵尾在北方官话中的弱化与消失，是导致现代普通话声调格局形成的重要驱动力之一。',
    pinyin: 'Hànyǔ yǔyīn yǎnbiàn shǐ qīngxī de biǎomíng, rùshēng yùnwěi zài běifāng guānhuà zhōng de ruòhuà yǔ xiāoshī, shì dǎozhì xiàndài pǔtōnghuà shēngdiào géjú xíngchéng de zhòngyào qūdònglì zhī yī.',
    translation: 'Lịch sử tiến hóa ngữ âm tiếng Hán chỉ ra rõ ràng rằng: sự suy yếu và biến mất của âm đuôi nhập thanh trong Quan thoại miền Bắc là một trong những động lực then chốt định hình diện mạo thanh điệu tiếng Phổ thông hiện đại.',
    question: 'Hiện tượng ngữ âm nào ảnh hưởng lớn đến hệ thống thanh điệu tiếng Phổ thông?',
    options: ['Sự phong phú của các phụ âm đầu', 'Sự tiêu biến của âm đuôi nhập thanh trong quan thoại phía Bắc', 'Việc vay mượn từ vựng từ phương Tây', 'Quy tắc viết phiên âm Pinyin bằng chữ cái Latin'],
    correctIndex: 1,
    explanation: '"入声韵尾在北方官话中的弱化与消失" (sự suy yếu và tiêu biến của âm đuôi nhập thanh).',
    topic: 'Ngữ âm học lịch sử',
    difficulty: 'master'
  },
  {
    id: 'list-l6-09',
    level: 6,
    audioText: '认知心理学实验证实，沉没成本谬误常常使决策者在面临明知亏损的项目时，依旧难以决断断臂求生，从而酿成更惨烈的败局。',
    hanzi: '认知心理学实验证实，沉没成本谬误常常使决策者在面临明知亏损的项目时，依旧难以决断断臂求生，从而酿成更惨烈的败局。',
    pinyin: 'Rènzhī xīnlǐxué shíyàn zhèngshí, chénmò chéngběn miùwù chángcháng shǐ juécèzhě zài miànlín míngzhī kuīsǔn de xiàngmù shí, yījiù nǎnyǐ juéduàn duànbì qiúshēng, cóng’ér niàngchéng gèng cǎnliè de bàijú.',
    translation: 'Thực nghiệm tâm lý học nhận thức chứng thực: ảo tưởng chi phí chìm thường khiến người ra quyết định dù biết rõ dự án thua lỗ nhưng vẫn khó dứt khoát cắt lỗ cứu sinh, từ đó dẫn đến thất bại thảm hại hơn.',
    question: 'Hệ quả tiêu cực của "ảo tưởng chi phí chìm" (沉没成本谬误) là gì?',
    options: ['Giúp tiết kiệm tối đa ngân sách đầu tư ban đầu', 'Khiến người ta do dự không dám cắt lỗ, dẫn đến tổn thất nặng hơn', 'Thúc đẩy đưa ra các sáng kiến mang tính đột phá', 'Nâng cao sự tin tưởng giữa các đối tác kinh doanh'],
    correctIndex: 1,
    explanation: '"难以决断断臂求生，从而酿成更惨烈的败局" (khó lòng dứt khoát dừng lỗ khiến hậu quả thảm hại hơn).',
    topic: 'Tâm lý học hành vi',
    difficulty: 'master'
  },
  {
    id: 'list-l6-10',
    level: 6,
    audioText: '北京传统四合院建筑的精髓在于内敛沉稳与秩序井然，它将伦理秩序、家族情感与人与自然的和谐共生融汇为无声的砖石诗篇。',
    hanzi: '北京传统四合院建筑的精髓在于内敛沉稳与秩序井然，它将伦理秩序、家族情感与人与自然的和谐共生融汇为无声的砖石诗篇。',
    pinyin: 'Běijīng chuántǒng sìhéyuàn jiànzhù de jīngsuǐ zàiyú nèiliǎn chénwěn yǔ zhìxù jǐngrán, tā jiāng lúnlǐ zhìxù, jiāzú qínggǎn yǔ rén yǔ zìrán de héxié gòngshēng rónghuì wéi wúshēng de zhuānshí shīpiān.',
    translation: 'Tinh hoa kiến trúc Tứ hợp viện truyền thống Bắc Kinh nằm ở sự hướng nội trầm tĩnh và trật tự ngăn nắp; nó hòa quyện trật tự luân lý, tình cảm gia tộc và sự cộng sinh hòa hợp giữa con người với thiên nhiên thành bài thơ gạch đá không lời.',
    question: 'Giá trị cốt lõi nào được kết tinh trong kiến trúc Tứ hợp viện Bắc Kinh?',
    options: ['Sự xa hoa lộng lẫy phô trương thanh thế bên ngoài', 'Sự hài hòa giữa luân lý, tình cảm gia đình và thiên nhiên', 'Khả năng chống động đất và bão lũ hiện đại bậc nhất', 'Thiết kế phục vụ các hoạt động thương mại sầm uất'],
    correctIndex: 1,
    explanation: '"将伦理秩序、家族情感与人与自然的和谐共生融汇..." (kết hợp trật tự lễ giáo, tình cảm gia đình và thiên nhiên).',
    topic: 'Kiến trúc & Triết lý văn hóa',
    difficulty: 'master'
  }
];

// Bài tập ghép câu ngữ pháp phân cấp
export const GRAMMAR_DRILLS_BY_LEVEL = [
  // Mức 1 (HSK 1 - Khởi động & Nền tảng)
  {
    id: 'gram-l1-01',
    level: 1,
    title: 'Câu khẳng định chữ 是 (Là)',
    meaning: 'Tôi là giáo viên.',
    tokens: ['我', '是', '老师'],
    correctTokens: ['我', '是', '老师'],
    explanation: 'Cấu trúc cơ bản: Chủ ngữ + 是 + Tân ngữ.',
    topic: 'Câu chữ 是',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-02',
    level: 1,
    title: 'Câu hỏi nghi vấn với trợ từ 吗',
    meaning: 'Bạn là người Trung Quốc phải không?',
    tokens: ['吗', '你', '是', '中国人'],
    correctTokens: ['你', '是', '中国人', '吗'],
    explanation: 'Trợ từ nghi vấn 吗 luôn đứng ở cuối câu hỏi Yes/No.',
    topic: 'Câu hỏi nghi vấn 吗',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-03',
    level: 1,
    title: 'Định ngữ với trợ từ 的 (Sở hữu)',
    meaning: 'Đây là sách của tôi.',
    tokens: ['书。', '这', '我的', '是'],
    correctTokens: ['这', '是', '我的', '书。'],
    explanation: 'Cấu trúc định ngữ: Định ngữ (我的) + 的 + Trung tâm ngữ (书).',
    topic: 'Trợ từ kết cấu 的',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-04',
    level: 1,
    title: 'Câu vị ngữ tính từ với phó từ 很',
    meaning: 'Hôm nay thời tiết rất tốt.',
    tokens: ['很好。', '今天', '天气'],
    correctTokens: ['今天', '天气', '很好。'],
    explanation: 'Trong câu vị ngữ tính từ, phó từ 很 thường đứng trước tính từ tạo thành vị ngữ hoàn chỉnh.',
    topic: 'Phó từ mức độ 很',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-05',
    level: 1,
    title: 'Giới từ / Động từ 在 chỉ nơi chốn',
    meaning: 'Anh ấy đang ở trường học.',
    tokens: ['学校。', '在', '他'],
    correctTokens: ['他', '在', '学校。'],
    explanation: 'Cấu trúc vị trí cơ bản: Chủ ngữ + 在 + Địa điểm.',
    topic: 'Động từ/Giới từ 在',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-06',
    level: 1,
    title: 'Câu hỏi với đại từ nghi vấn 什么 (Cái gì)',
    meaning: 'Bạn tên là gì?',
    tokens: ['名字？', '叫', '你', '什么'],
    correctTokens: ['你', '叫', '什么', '名字？'],
    explanation: 'Trật tự từ trong câu hỏi tiếng Trung giữ nguyên như câu khẳng định: S + 叫 + 什么 + 名字.',
    topic: 'Đại từ nghi vấn 什么',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-07',
    level: 1,
    title: 'Số từ + Lượng từ 个 + Danh từ',
    meaning: 'Tôi có ba người bạn Trung Quốc.',
    tokens: ['中国朋友。', '有', '我', '三个'],
    correctTokens: ['我', '有', '三个', '中国朋友。'],
    explanation: 'Giữa số từ và danh từ bắt buộc phải có lượng từ tương ứng (三个 + 朋友).',
    topic: 'Lượng từ 个',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-08',
    level: 1,
    title: 'Phó từ phủ định 不 (Không)',
    meaning: 'Tôi không thích uống trà.',
    tokens: ['喝茶。', '不', '我', '喜欢'],
    correctTokens: ['我', '不', '喜欢', '喝茶。'],
    explanation: 'Phó từ phủ định 不 đứng trước động từ hoặc tính từ biểu thị sự phủ định.',
    topic: 'Phó từ phủ định 不',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-09',
    level: 1,
    title: 'Phó từ liên kết 也 (Cũng)',
    meaning: 'Cô ấy cũng là sinh viên đại học.',
    tokens: ['也是', '大学生。', '她'],
    correctTokens: ['她', '也是', '大学生。'],
    explanation: 'Phó từ 也 luôn đứng trước động từ hoặc tính từ, không đứng đầu câu.',
    topic: 'Phó từ 也',
    difficulty: 'easy'
  },
  {
    id: 'gram-l1-10',
    level: 1,
    title: 'Động từ năng nguyện 会 (Biết qua học hỏi)',
    meaning: 'Tôi biết nói một chút tiếng Trung.',
    tokens: ['说', '会', '我', '一点儿汉语。'],
    correctTokens: ['我', '会', '说', '一点儿汉语。'],
    explanation: 'Động từ năng nguyện 会 đứng trước động từ chính biểu thị khả năng qua rèn luyện.',
    topic: 'Động từ năng nguyện 会',
    difficulty: 'easy'
  },

  // Mức 2 (HSK 2 - Tăng tốc & Sinh hoạt)
  {
    id: 'gram-l2-01',
    level: 2,
    title: 'Động từ năng nguyện 想 (Muốn)',
    meaning: 'Tôi muốn uống trà sữa.',
    tokens: ['喝', '我', '奶茶', '想'],
    correctTokens: ['我', '想', '喝', '奶茶'],
    explanation: 'Động từ năng nguyện (想) đứng trước động từ chính (喝).',
    topic: 'Động từ năng nguyện 想',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-02',
    level: 2,
    title: 'Câu hỏi số lượng 多少',
    meaning: 'Chiếc áo này bao nhiêu tiền?',
    tokens: ['多少钱', '衣服', '这件'],
    correctTokens: ['这件', '衣服', '多少钱'],
    explanation: 'Lượng từ đi liền với danh từ: 这件衣服 + Đại từ nghi vấn 多少钱.',
    topic: 'Đại từ nghi vấn 多少',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-03',
    level: 2,
    title: 'Cấu trúc câu so sánh chữ 比 (Hơn)',
    meaning: 'Hôm nay trời lạnh hơn hôm qua.',
    tokens: ['比', '昨天', '冷。', '今天'],
    correctTokens: ['今天', '比', '昨天', '冷。'],
    explanation: 'Cấu trúc so sánh cơ bản: A + 比 + B + Tính từ.',
    topic: 'Câu chữ 比',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-04',
    level: 2,
    title: 'Trợ từ động thái 了 (Hoàn thành hành động)',
    meaning: 'Tôi đã mua một cuốn sách mới.',
    tokens: ['一本', '买了', '我', '新书。'],
    correctTokens: ['我', '买了', '一本', '新书。'],
    explanation: 'Trợ từ 了 đứng ngay sau động từ biểu thị hành động đã hoàn tất.',
    topic: 'Trợ từ động thái 了',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-05',
    level: 2,
    title: 'Kết cấu giới từ Từ... đến... (从...到...)',
    meaning: 'Từ nhà tôi đến công ty rất gần.',
    tokens: ['到', '我家', '很近。', '公司', '从'],
    correctTokens: ['从', '我家', '到', '公司', '很近。'],
    explanation: '从 [Điểm A] 到 [Điểm B] biểu thị phạm vi cự ly không gian hoặc mốc thời gian.',
    topic: 'Giới từ 从...到...',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-06',
    level: 2,
    title: 'Cặp liên từ Vì... nên... (因为...所以...)',
    meaning: 'Vì trời mưa nên tôi không đi đá bóng.',
    tokens: ['下雨，', '所以我', '没去踢足球。', '因为'],
    correctTokens: ['因为', '下雨，', '所以我', '没去踢足球。'],
    explanation: '因为 nêu nguyên nhân, 所以 nêu kết quả tương ứng.',
    topic: 'Liên từ 因为...所以...',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-07',
    level: 2,
    title: 'Bổ ngữ trạng thái với trợ từ 得',
    meaning: 'Anh ấy chạy rất nhanh.',
    tokens: ['跑得', '很快。', '他'],
    correctTokens: ['他', '跑得', '很快。'],
    explanation: 'Cấu trúc bổ ngữ trạng thái: Động từ + 得 + Cụm tính từ/Trạng ngữ.',
    topic: 'Bổ ngữ trạng thái 得',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-08',
    level: 2,
    title: 'Trợ từ kinh nghiệm 过 (Từng trải nghiệm)',
    meaning: 'Tôi đã từng đến Bắc Kinh.',
    tokens: ['去过', '北京。', '我'],
    correctTokens: ['我', '去过', '北京。'],
    explanation: 'Động từ + 过 biểu thị hành động hoặc trải nghiệm từng diễn ra trong quá khứ.',
    topic: 'Trợ từ động thái 过',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-09',
    level: 2,
    title: 'Phó từ chỉ tiến hành 正在...呢 (Đang...)',
    meaning: 'Bố đang đọc báo trong phòng.',
    tokens: ['看报纸呢。', '正在', '在房间', '爸爸'],
    correctTokens: ['爸爸', '正在', '在房间', '看报纸呢。'],
    explanation: '正在 + Động từ + 呢 biểu thị hành động đang tiếp diễn tại thời điểm nói.',
    topic: 'Cấu trúc 正在...呢',
    difficulty: 'medium'
  },
  {
    id: 'gram-l2-10',
    level: 2,
    title: 'Câu cầu khiến lịch sự với 请 / 不要',
    meaning: 'Xin mọi người đừng nói chuyện ồn ào.',
    tokens: ['大声说话。', '请大家', '不要'],
    correctTokens: ['请大家', '不要', '大声说话。'],
    explanation: '请 + Đối tượng + 不要 + Động từ: Câu mệnh lệnh lịch sự trong giao tiếp công cộng.',
    topic: 'Câu cầu khiến 请/不要',
    difficulty: 'medium'
  },

  // Mức 3 (HSK 3 - Chinh phục & Bứt phá)
  {
    id: 'gram-l3-01',
    level: 3,
    title: 'Câu chữ 把 (Tác động sự vật)',
    meaning: 'Hãy mở máy điều hòa ra.',
    tokens: ['打开', '把', '空调', '请'],
    correctTokens: ['请', '把', '空调', '打开'],
    explanation: 'Cấu trúc câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác.',
    topic: 'Câu chữ 把',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-02',
    level: 3,
    title: 'Cặp liên từ 虽然...但是... (Tuy... nhưng...)',
    meaning: 'Tuy rất mệt nhưng rất vui.',
    tokens: ['很累', '虽然', '但是', '很高兴'],
    correctTokens: ['虽然', '很累', '但是', '很高兴'],
    explanation: 'Cấu trúc mặc dù... nhưng... liên kết hai vế tương phản đối lập.',
    topic: 'Liên từ 虽然...但是...',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-03',
    level: 3,
    title: 'Cấu trúc câu bị động chữ 被',
    meaning: 'Chiếc bánh ngọt đã bị em trai ăn mất rồi.',
    tokens: ['弟弟', '蛋糕', '吃了。', '被'],
    correctTokens: ['蛋糕', '被', '弟弟', '吃了。'],
    explanation: 'Cấu trúc câu bị động: Tân ngữ chịu tác động + 被 + Tác nhân + Động từ + Thành phần khác.',
    topic: 'Câu chữ 被',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-04',
    level: 3,
    title: 'Cấu trúc tăng tiến tương quan 越...越...',
    meaning: 'Tiếng Trung càng học càng cảm thấy thú vị.',
    tokens: ['越觉得', '越学', '汉语', '有意思。'],
    correctTokens: ['汉语', '越学', '越觉得', '有意思。'],
    explanation: '越 A 越 B biểu thị mức độ của B tăng tiến theo sự phát triển của điều kiện A.',
    topic: 'Cấu trúc 越...越...',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-05',
    level: 3,
    title: 'Bổ ngữ xu hướng kép (Động từ + 起来 / 出来 / 下去)',
    meaning: 'Mặt trời từ hướng đông mọc lên rồi.',
    tokens: ['升起来了。', '太阳', '从东方'],
    correctTokens: ['太阳', '从东方', '升起来了。'],
    explanation: 'Bổ ngữ xu hướng kép kết hợp động từ chỉ hướng và 来/去.',
    topic: 'Bổ ngữ xu hướng kép',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-06',
    level: 3,
    title: 'Cấu trúc loại trừ và bổ sung: 除了...以外',
    meaning: 'Ngoài táo ra, anh ấy còn thích ăn chuối.',
    tokens: ['以外，', '他还', '除了', '苹果', '喜欢吃香蕉。'],
    correctTokens: ['除了', '苹果', '以外，', '他还', '喜欢吃香蕉。'],
    explanation: '除了...以外 + 还/也 biểu thị ngoài phần kể trước thì còn bổ sung thêm thành phần khác.',
    topic: 'Cấu trúc 除了...以外',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-07',
    level: 3,
    title: 'Cấu trúc hành động đồng thời: 一边...一边...',
    meaning: 'Chúng tôi vừa uống cà phê vừa trò chuyện vui vẻ.',
    tokens: ['一边', '喝咖啡，', '我们', '一边', '愉快地聊天。'],
    correctTokens: ['我们', '一边', '喝咖啡，', '一边', '愉快地聊天。'],
    explanation: '一边 A 一边 B biểu thị cùng một chủ thể thực hiện đồng thời hai hành vi.',
    topic: 'Cấu trúc 一边...一边...',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-08',
    level: 3,
    title: 'Cấu trúc câu phản vấn: 不是...吗？',
    meaning: 'Chẳng phải bạn đã đồng ý rồi sao?',
    tokens: ['答应了吗？', '你', '不是', '已经'],
    correctTokens: ['你', '不是', '已经', '答应了吗？'],
    explanation: 'Cấu trúc 不是...吗 dùng để khẳng định mạnh mẽ hoặc nhắc nhở về điều hiển nhiên.',
    topic: 'Câu phản vấn 不是...吗',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-09',
    level: 3,
    title: 'Liên từ song hành tính chất: 又...又...',
    meaning: 'Căn phòng này vừa rộng rãi lại vừa sạch sẽ.',
    tokens: ['这个房间', '又干净。', '又大'],
    correctTokens: ['这个房间', '又大', '又干净。'],
    explanation: '又 A 又 B dùng để kết hợp hai tính chất có cùng chiều hướng biểu cảm.',
    topic: 'Liên từ 又...又...',
    difficulty: 'hard'
  },
  {
    id: 'gram-l3-10',
    level: 3,
    title: 'Trợ từ trạng ngữ 地 (Chỉ phương thức hành động)',
    meaning: 'Các học sinh chăm chú lắng nghe cô giáo giảng bài.',
    tokens: ['认真地', '听老师讲课。', '同学们'],
    correctTokens: ['同学们', '认真地', '听老师讲课。'],
    explanation: 'Tính từ/Cụm từ + 地 đứng trước động từ miêu tả thái độ, cách thức hành động.',
    topic: 'Trợ từ trạng ngữ 地',
    difficulty: 'hard'
  },

  // Mức 4 (HSK 4 - Thử thách Bậc thầy & Công sở)
  {
    id: 'gram-l4-01',
    level: 4,
    title: 'Câu điều kiện 只要...就...',
    meaning: 'Chỉ cần chăm chỉ thì sẽ thành công.',
    tokens: ['就', '只要', '努力', '会成功'],
    correctTokens: ['只要', '努力', '就', '会成功'],
    explanation: '只要 A 就 B: Chỉ cần A thì sẽ B (điều kiện đủ).',
    topic: 'Điều kiện đủ 只要...就...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-02',
    level: 4,
    title: 'Cặp liên từ tăng tiến: 不仅...而且...',
    meaning: 'Anh ấy không những nói tiếng Trung lưu loát mà còn biết viết thư pháp.',
    tokens: ['不仅', '流利，', '汉语说得', '他', '而且', '会写书法。'],
    correctTokens: ['他', '不仅', '汉语说得', '流利，', '而且', '会写书法。'],
    explanation: '不仅 A 而且 B biểu thị mối quan hệ tăng tiến về trình độ hoặc phạm vi giữa hai vế câu.',
    topic: 'Liên từ tăng tiến 不仅...而且...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-03',
    level: 4,
    title: 'Cấu trúc điều kiện toàn thể: 无论...都...',
    meaning: 'Bất luận gặp phải khó khăn gì, chúng tôi đều kiên trì đến cùng.',
    tokens: ['无论', '坚持到底。', '遇到什么困难，', '我们', '都'],
    correctTokens: ['无论', '遇到什么困难，', '我们', '都', '坚持到底。'],
    explanation: '无论 đi kèm đại từ nghi vấn (什么/怎么) ở vế trước, vế sau dùng 都 biểu thị kết quả không đổi.',
    topic: 'Điều kiện toàn thể 无论...都...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-04',
    level: 4,
    title: 'Cấu trúc nhấn mạnh trường hợp cực đoan: 连...都/也...',
    meaning: 'Bài toán đơn giản thế này ngay cả đứa trẻ cũng biết làm.',
    tokens: ['小孩子', '都会做。', '连', '这么简单的问题，'],
    correctTokens: ['这么简单的问题，', '连', '小孩子', '都会做。'],
    explanation: '连 + Đối tượng cực đoan + 都/也 + Vị ngữ: Đưa ra ví dụ tối thiểu để nhấn mạnh điều hiển nhiên.',
    topic: 'Cấu trúc nhấn mạnh 连...都...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-05',
    level: 4,
    title: 'Giới từ chỉ phạm vi đối tượng: 对于 (Đối với)',
    meaning: 'Đối với phương án mới này, mọi người đều rất tán thành.',
    tokens: ['大家', '这个新方案，', '都表示赞成。', '对于'],
    correctTokens: ['对于', '这个新方案，', '大家', '都表示赞成。'],
    explanation: '对于 nêu ra sự vật, hiện tượng làm đối tượng được xem xét hoặc có thái độ tương ứng.',
    topic: 'Giới từ 对于',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-06',
    level: 4,
    title: 'Bổ ngữ khả năng phủ định (Động từ + 不 + Bổ ngữ)',
    meaning: 'Nhiều bài tập như vậy một tiếng đồng hồ làm sao xong được.',
    tokens: ['做不完。', '这么多作业，', '一个小时'],
    correctTokens: ['这么多作业，', '一个小时', '做不完。'],
    explanation: 'Cấu trúc phủ định của bổ ngữ khả năng: Động từ + 不 + Bổ ngữ kết quả/xu hướng (做不完 = không thể làm xong).',
    topic: 'Bổ ngữ khả năng',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-07',
    level: 4,
    title: 'Cấu trúc nguyên nhân suy luận: 既然...就...',
    meaning: 'Đã hứa với người khác thì phải giữ lời.',
    tokens: ['答应了别人，', '既然', '就应该', '遵守诺言。'],
    correctTokens: ['既然', '答应了别人，', '就应该', '遵守诺言。'],
    explanation: '既然 nêu hiện thực đã thành tiền đề, 就 dẫn ra kết luận hoặc kiến nghị hợp logic.',
    topic: 'Liên từ 既然...就...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-08',
    level: 4,
    title: 'Phó từ truy vấn ngọn ngành: 究竟 (Rốt cuộc)',
    meaning: 'Rốt cuộc là ai đã phát hiện ra bí mật này?',
    tokens: ['发现了', '究竟', '是谁', '这个秘密？'],
    correctTokens: ['究竟', '是谁', '发现了', '这个秘密？'],
    explanation: 'Phó từ 究竟 dùng trong câu hỏi để nhấn mạnh sự truy cứu đến cùng bản chất sự việc.',
    topic: 'Phó từ 究竟',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-09',
    level: 4,
    title: 'Cấu trúc lựa chọn loại suy: 不是...就是...',
    meaning: 'Cuối tuần anh ấy không phải ở nhà đọc sách thì là đi leo núi.',
    tokens: ['在家里看书，', '周末他', '不是', '就是', '去爬山。'],
    correctTokens: ['周末他', '不是', '在家里看书，', '就是', '去爬山。'],
    explanation: '不是 A 就是 B loại trừ các phương án khác, chỉ ra một trong hai khả năng chắc chắn xảy ra.',
    topic: 'Cấu trúc 不是...就是...',
    difficulty: 'challenge'
  },
  {
    id: 'gram-l4-10',
    level: 4,
    title: 'Phó từ biểu thị sự bất ngờ ngoài dự liệu: 居然 (Lại có thể)',
    meaning: 'Anh ấy thế mà lại đỗ vào trường đại học danh tiếng nhất.',
    tokens: ['考上了', '他', '居然', '最好的大学。'],
    correctTokens: ['他', '居然', '考上了', '最好的大学。'],
    explanation: 'Phó từ 居然 đứng trước vị ngữ biểu thị sự việc diễn ra bất ngờ, ngoài mong đợi.',
    topic: 'Phó từ 居然',
    difficulty: 'challenge'
  },

  // Mức 5 (HSK 5 - Cao cấp & Học thuật)
  {
    id: 'gram-l5-01',
    level: 5,
    title: 'Cấu trúc giả thiết nhượng bộ: 哪怕...也...',
    meaning: 'Dù công việc có bận rộn hơn nữa, anh ấy cũng kiên trì đọc sách mỗi ngày.',
    tokens: ['坚持', '哪怕', '工作', '也', '他', '每天', '再忙，', '读书。'],
    correctTokens: ['哪怕', '工作', '再忙，', '他', '也', '坚持', '每天', '读书。'],
    explanation: 'Cấu trúc 哪怕...也...: 哪怕 đứng đầu vế câu giả thiết nhượng bộ, 也 đứng trước vị ngữ biểu thị kết quả không đổi.',
    topic: 'Giả thiết nhượng bộ',
    difficulty: 'advanced',
    whyWrong: '哪怕 không thể đứng sau vị ngữ, và 也 phải đi liền trước động từ 坚持.'
  },
  {
    id: 'gram-l5-02',
    level: 5,
    title: 'Cấu trúc tăng tiến tương phản: 不仅不...反而...',
    meaning: 'Thuốc này chẳng những không hạ sốt, trái lại nhiệt độ cơ thể còn tăng cao hơn.',
    tokens: ['反而', '没退烧，', '不仅', '这个药', '升得', '体温', '更高了。'],
    correctTokens: ['这个药', '不仅', '没退烧，', '反而', '体温', '升得', '更高了。'],
    explanation: 'Cấu trúc 不仅不/没...反而...: Biểu thị sự việc phát triển ngược lại với mong đợi theo hướng tăng tiến.',
    topic: 'Liên từ tăng tiến',
    difficulty: 'advanced',
    whyWrong: '不仅 đứng trước vế phủ định đầu tiên, 反而 đứng ở đầu vế thứ hai chỉ sự tương phản bất ngờ.'
  },
  {
    id: 'gram-l5-03',
    level: 5,
    title: 'Giới từ phong cách văn viết: 鉴于 (Xét thấy)',
    meaning: 'Xét thấy tình hình thị trường gần đây không ổn định, chúng tôi quyết định tạm hoãn đầu tư.',
    tokens: ['市场', '决定', '鉴于', '暂缓', '近期', '我们', '不稳定，', '投资。'],
    correctTokens: ['鉴于', '近期', '市场', '不稳定，', '我们', '决定', '暂缓', '投资。'],
    explanation: '鉴于 là giới từ trang trọng đặt ở đầu câu để nêu căn cứ, lý do trước khi đưa ra quyết định.',
    topic: 'Giới từ văn ngôn',
    difficulty: 'advanced',
    whyWrong: '鉴于 đứng trước mệnh đề lý do 近期市场不稳定, không thể xen vào giữa tân ngữ.'
  },
  {
    id: 'gram-l5-04',
    level: 5,
    title: 'Câu chữ 把 nâng cao: 把...转化为... (Biến thành)',
    meaning: 'Chúng ta cần biến áp lực công việc thành động lực tiến lên.',
    tokens: ['转化为', '工作压力', '要', '我们', '前进的', '把', '动力。'],
    correctTokens: ['我们', '要', '把', '工作压力', '转化为', '前进的', '动力。'],
    explanation: 'Cấu trúc câu chữ 把 với bổ ngữ kết quả trừu tượng: S + 把 + Tân ngữ + Động từ + 为/成 + Tân ngữ mới.',
    topic: 'Câu chữ 把 mở rộng',
    difficulty: 'advanced',
    whyWrong: 'Động từ năng nguyện 要 phải đứng trước 把, bổ ngữ 转化为 đứng sau tân ngữ được tác động.'
  },
  {
    id: 'gram-l5-05',
    level: 5,
    title: 'Cặp liên từ nhượng bộ: 固然...但... (Cố nhiên... nhưng...)',
    meaning: 'Tiền bạc cố nhiên quan trọng, nhưng sức khỏe mới là điều quý giá nhất.',
    tokens: ['但', '最宝贵的。', '金钱', '固然', '健康', '才是', '重要，'],
    correctTokens: ['金钱', '固然', '重要，', '但', '健康', '才是', '最宝贵的。'],
    explanation: 'Cấu trúc 固然...但...: Thừa nhận thực tế vế thứ nhất là đúng, nhưng nhấn mạnh trọng tâm ở vế thứ hai.',
    topic: 'Liên từ lập luận',
    difficulty: 'advanced',
    whyWrong: '固然 đứng ngay sau chủ ngữ vế một, 但 đứng đầu vế thứ hai để chuyển ý.'
  },
  {
    id: 'gram-l5-06',
    level: 5,
    title: 'Cấu trúc điều kiện duy nhất: 唯有...才... (Chỉ có... mới...)',
    meaning: 'Chỉ có không ngừng học tập và đổi mới, doanh nghiệp mới có thể phát triển bền vững.',
    tokens: ['企业', '唯有', '才能', '发展。', '学习', '不断', '持续', '创新，'],
    correctTokens: ['唯有', '不断', '学习', '创新，', '企业', '才能', '持续', '发展。'],
    explanation: '唯有...才... là cách diễn đạt trang trọng của 只有...才..., chỉ điều kiện tất yếu duy nhất.',
    topic: 'Câu điều kiện duy nhất',
    difficulty: 'advanced',
    whyWrong: '唯有 đứng đầu câu trước điều kiện tiên quyết 不断学习创新, 才能 đứng trước vị ngữ vế chính.'
  },
  {
    id: 'gram-l5-07',
    level: 5,
    title: 'Câu bị động văn viết: 被...所... (Được... bởi...)',
    meaning: 'Kế hoạch này đã nhận được sự đồng thuận và ủng hộ rộng rãi của nhân viên.',
    tokens: ['广大', '这个方案', '所', '认可', '被', '员工', '和', '支持。'],
    correctTokens: ['这个方案', '被', '广大', '员工', '所', '认可', '和', '支持。'],
    explanation: 'Cấu trúc 被...所...: Trợ từ 所 đặt trước động từ nhằm tăng tính trang trọng trong văn viết chính luận.',
    topic: 'Câu bị động văn viết',
    difficulty: 'advanced',
    whyWrong: '所 phải đứng ngay trước các động từ kép 认可和支持, không đứng trước danh từ tác nhân.'
  },
  {
    id: 'gram-l5-08',
    level: 5,
    title: 'Cấu trúc điều kiện loại trừ: 除非...否则... (Trừ phi... nếu không...)',
    meaning: 'Trừ phi hai bên cùng nhượng bộ, nếu không cuộc đàm phán rất khó đạt được thỏa thuận.',
    tokens: ['否则', '谈判', '协议。', '双方', '很难', '除非', '各退一步，', '达成'],
    correctTokens: ['除非', '双方', '各退一步，', '否则', '谈判', '很难', '达成', '协议。'],
    explanation: '除非...否则...: Nêu điều kiện duy nhất ở vế đầu, vế sau nêu hậu quả tiêu cực nếu điều kiện không thỏa mãn.',
    topic: 'Điều kiện giả định',
    difficulty: 'advanced',
    whyWrong: '除非 đứng đầu vế điều kiện, 否则 đứng đầu vế hậu quả tiêu cực.'
  },
  {
    id: 'gram-l5-09',
    level: 5,
    title: 'Cấu trúc giải thích nguyên nhân: 之所以...是因为...',
    meaning: 'Dự án sở dĩ thành công là vì các thành viên phối hợp chặt chẽ.',
    tokens: ['是因为', '项目', '合作。', '之所以', '成功，', '紧密', '队员们'],
    correctTokens: ['项目', '之所以', '成功，', '是因为', '队员们', '紧密', '合作。'],
    explanation: 'Cấu trúc 之所以...是因为...: Nêu kết quả đã xảy ra trước, sau đó giải thích nguyên nhân trọng tâm.',
    topic: 'Nguyên nhân kết quả đảo',
    difficulty: 'advanced',
    whyWrong: '之所以 đi sau chủ ngữ kết quả 项目, 是因为 đứng đầu phân câu giải thích nguyên nhân.'
  },
  {
    id: 'gram-l5-10',
    level: 5,
    title: 'Trợ từ kết cấu công văn: 予以 + Động từ 2 âm tiết',
    meaning: 'Đối với đề xuất hợp lý của khách hàng, công ty chúng tôi sẽ kịp thời tiếp thu và xử lý.',
    tokens: ['合理', '我司', '采纳。', '对于', '及时', '客户的', '建议，', '予以', '将'],
    correctTokens: ['对于', '客户的', '合理', '建议，', '我司', '将', '及时', '予以', '采纳。'],
    explanation: 'Trợ từ 予以 đi kèm động từ hai âm tiết biểu thị thực hiện hành động trang trọng (予以采纳, 予以支持).',
    topic: 'Ngữ pháp công văn chính thức',
    difficulty: 'advanced',
    whyWrong: '予以 phải đứng sát trước động từ hai âm tiết 采纳, phó từ 将及时 đứng trước trợ từ.'
  },

  // Mức 6 (HSK 6 - Tinh hoa & Chuyên gia)
  {
    id: 'gram-l6-01',
    level: 6,
    title: 'Cấu trúc lập luận tương phản song trùng: 固然...终究...',
    meaning: 'Khoa học công nghệ dù tiên tiến, rốt cuộc cũng không thể thay thế hoàn toàn tình cảm con người.',
    tokens: ['终究', '先进，', '取代', '科技', '固然', '情感。', '无法', '人类的', '完全'],
    correctTokens: ['科技', '固然', '先进，', '终究', '无法', '完全', '取代', '人类的', '情感。'],
    explanation: 'Cấu trúc 固然...终究...: Nhượng bộ tiền đề nhưng khẳng định bản chất cốt lõi cuối cùng không thể thay đổi.',
    topic: 'Lập luận tương phản triết học',
    difficulty: 'master',
    whyWrong: '固然 đứng sau chủ ngữ vế 1, 终究 đứng đầu vế vị ngữ khẳng định bản chất sau cùng.'
  },
  {
    id: 'gram-l6-02',
    level: 6,
    title: 'Cấu trúc lựa chọn tu từ: 与其...不如...',
    meaning: 'Thay vì mù quáng theo đuổi danh lợi, chi bằng tĩnh tâm làm tốt công việc chuyên môn hiện tại.',
    tokens: ['不如', '盲目', '工作。', '与其', '当下的', '追逐', '做好', '名利，', '踏实'],
    correctTokens: ['与其', '盲目', '追逐', '名利，', '不如', '踏实', '做好', '当下的', '工作。'],
    explanation: '与其 A 不如 B: So sánh hai hành động và dứt khoát chọn phương án B là tốt hơn.',
    topic: 'Cấu trúc tu từ lựa chọn',
    difficulty: 'master',
    whyWrong: '与其 đứng trước hành vi bị phủ định A, 不如 đứng trước hành vi được khuyến khích B.'
  },
  {
    id: 'gram-l6-03',
    level: 6,
    title: 'Cụm từ cố định chính luận: 毋庸置疑 (Không còn nghi ngờ gì nữa)',
    meaning: 'Bảo vệ môi trường sinh thái hiển nhiên là sứ mệnh chung của toàn nhân loại.',
    tokens: ['毋庸置疑', '生态', '全人类', '保护', '共同的', '环境', '是', '使命。'],
    correctTokens: ['保护', '生态', '环境', '毋庸置疑', '是', '全人类', '共同的', '使命。'],
    explanation: '毋庸置疑 đóng vai trò trạng ngữ hoặc thành phần chêm xen khẳng định tính chân lý không thể bàn cãi.',
    topic: 'Cụm từ chính luận cao cấp',
    difficulty: 'master',
    whyWrong: '毋庸置疑 bổ nghĩa cho phán đoán 是, đứng trước liên từ phán đoán.'
  },
  {
    id: 'gram-l6-04',
    level: 6,
    title: 'Cấu trúc quyết tâm bắt buộc: 非...不可',
    meaning: 'Muốn thúc đẩy kinh tế xanh phát triển, ngành công nghiệp buộc phải cải cách triệt để.',
    tokens: ['非', '绿色', '改革', '要', '不可。', '经济，', '彻底', '推进', '工业'],
    correctTokens: ['要', '推进', '绿色', '经济，', '工业', '非', '彻底', '改革', '不可。'],
    explanation: '非...不可: Biểu thị tính tất yếu bắt buộc hoặc ý chí kiên định phải thực hiện bằng được.',
    topic: 'Cấu trúc khẳng định mạnh mẽ',
    difficulty: 'master',
    whyWrong: '非 đứng trước động từ hành động 彻底改革, 不可 đứng ở cuối phân câu.'
  },
  {
    id: 'gram-l6-05',
    level: 6,
    title: 'Liên từ tăng tiến học thuật: 乃至 (Thậm chí / Cho đến)',
    meaning: 'Chính sách này ảnh hưởng sâu rộng đến thị trường trong nước, thậm chí toàn bộ chuỗi cung ứng toàn cầu.',
    tokens: ['国内', '影响', '全球', '这项', '乃至', '政策', '产业链。', '市场', '深刻'],
    correctTokens: ['这项', '政策', '深刻', '影响', '国内', '市场', '乃至', '全球', '产业链。'],
    explanation: '乃至 là liên từ văn viết biểu thị quan hệ tăng tiến từ phạm vi hẹp đến phạm vi rộng hơn.',
    topic: 'Liên từ học thuật',
    difficulty: 'master',
    whyWrong: '乃至 nối giữa đối tượng thứ nhất 国内市场 và đối tượng tăng tiến quy mô lớn hơn 全球产业链.'
  },
  {
    id: 'gram-l6-06',
    level: 6,
    title: 'Cấu trúc phủ định tuyệt đối: 无不 (Không ai không / Đều)',
    meaning: 'Những kiệt tác nghệ thuật cổ điển trưng bày ở đây đều khiến du khách phải thán phục.',
    tokens: ['艺术', '叹为', '杰作', '展出的', '观止。', '令人', '经典', '无不'],
    correctTokens: ['展出的', '经典', '艺术', '杰作', '无不', '令人', '叹为', '观止。'],
    explanation: '无不 là hai từ phủ định đi liền tạo thành ý nghĩa khẳng định tuyệt đối (không ai/cái nào là không...).',
    topic: 'Phủ định kép văn ngôn',
    difficulty: 'master',
    whyWrong: '无不 đứng trước động từ kiêm ngữ 令人, sau đó là thành ngữ 叹为观止.'
  },
  {
    id: 'gram-l6-07',
    level: 6,
    title: 'Cấu trúc nguyên nhân hệ quả trang trọng: 因...而...',
    meaning: 'Nhiều di sản văn hóa phi vật thể vì thiếu người kế thừa mà đứng trước nguy cơ biến mất.',
    tokens: ['而', '非遗', '濒临', '因', '许多', '消失。', '文化', '缺乏', '继承人'],
    correctTokens: ['许多', '非遗', '文化', '因', '缺乏', '继承人', '而', '濒临', '消失。'],
    explanation: 'Cấu trúc 因...而...: Giới từ 因 nêu nguyên nhân trực tiếp, liên từ 而 dẫn ra kết quả tương ứng.',
    topic: 'Cấu trúc nhân quả văn viết',
    difficulty: 'master',
    whyWrong: '因 đứng trước cụm nguyên nhân 缺乏继承人, 而 đứng trước cụm vị ngữ kết quả 濒临消失.'
  },
  {
    id: 'gram-l6-08',
    level: 6,
    title: 'Phó từ phản vấn tu từ: 何尝 (Đâu phải / Nào có)',
    meaning: 'Các nhà thám hiểm đâu phải không hiểu những nguy hiểm to lớn khi bước vào rừng nguyên sinh.',
    tokens: ['进入', '探险家们', '不知', '巨大', '何尝', '原始', '危险。', '森林的'],
    correctTokens: ['探险家们', '何尝', '不知', '进入', '原始', '森林的', '巨大', '危险。'],
    explanation: '何尝 mang nghĩa phản vấn phủ định của phủ định (đâu phải là không biết, thực ra rất rõ).',
    topic: 'Phó từ phản vấn tu từ',
    difficulty: 'master',
    whyWrong: '何尝 đứng trước vị ngữ phủ định 不知 để tạo hiệu quả tu từ phản vấn.'
  },
  {
    id: 'gram-l6-09',
    level: 6,
    title: 'Cấu trúc hiệu đính nhận định: 与其说...倒不如说...',
    meaning: 'Nói đây là một thất bại, chi bằng nói đây là một trải nghiệm khám phá vô cùng quý báu.',
    tokens: ['这是一次', '宝贵的', '失败，', '与其说', '经历。', '探索', '倒不如说', '这是一次'],
    correctTokens: ['与其说', '这是一次', '失败，', '倒不如说', '这是一次', '宝贵的', '探索', '经历。'],
    explanation: '与其说 A 倒不如说 B: Dùng để đính chính, điều chỉnh lại cách gọi hoặc nhận định cho chuẩn xác hơn.',
    topic: 'Cấu trúc hiệu đính nhận thức',
    difficulty: 'master',
    whyWrong: '与其说 đứng trước định nghĩa ban đầu 失败, 倒不如说 đứng trước định nghĩa sâu sắc hơn.'
  },
  {
    id: 'gram-l6-10',
    level: 6,
    title: 'Cấu trúc vị ngữ song hành: 兼具...与...',
    meaning: 'Công trình kiến trúc này kết hợp hài hòa giữa nét thẩm mỹ truyền thống phương Đông và công năng hiện đại.',
    tokens: ['美学', '兼具', '现代', '该', '功能。', '东方', '建筑', '与', '传统', '实用'],
    correctTokens: ['该', '建筑', '兼具', '东方', '传统', '美学', '与', '现代', '实用', '功能。'],
    explanation: '兼具 X 与 Y: Động từ 兼具 mang hai tân ngữ song song biểu thị đồng thời sở hữu cả hai đặc tính quý.',
    topic: 'Cấu trúc vị ngữ song hành',
    difficulty: 'master',
    whyWrong: '兼具 đứng trước đặc tính thứ nhất 东方传统美学, liên từ 与 nối với đặc tính thứ hai 现代实用功能.'
  }
];
