/**
 * PRACTICE LEVEL DATA — HANZIGO
 * Hệ thống bài tập luyện tập phân chia theo 4 mức độ sư phạm chuẩn HSK & CEFR
 */

export const HSK_LEVELS_METADATA = [
  { id: 'all', code: 'ALL', label: 'Tất cả HSK', count: 455, color: '#243447', desc: 'Toàn bộ 455 từ vựng kèm câu ví dụ từ giáo án và tài liệu tổng hợp' },
  { id: 'HSK 1', code: 'HSK 1', label: 'HSK 1 (Nền tảng)', count: 161, color: '#45B97C', desc: '161 từ cốt lõi, phiên âm Pinyin, số đếm, gia đình & chào hỏi' },
  { id: 'HSK 2', code: 'HSK 2', label: 'HSK 2 (Sinh hoạt)', count: 142, color: '#F4B942', desc: '142 từ giao tiếp hàng ngày, mua sắm, phương tiện & ăn uống' },
  { id: 'HSK 3', code: 'HSK 3', label: 'HSK 3 (Trung cấp)', count: 137, color: '#E85D3F', desc: '137 từ du lịch tự túc, công sở, câu chữ 把/被 & liên từ' },
  { id: 'HSK 4', code: 'HSK 4', label: 'HSK 4 (Công sở)', count: 10, color: '#3B82F6', desc: '10 từ ngữ thương mại, đàm phán, kỹ năng lưu loát & phỏng vấn' },
  { id: 'HSK 5-6', code: 'HSK 5-6', label: 'HSK 5-6 (Thành ngữ)', count: 5, color: '#8B5CF6', desc: '5 thành ngữ 4 chữ (成语), danh ngôn & chiều sâu văn hóa' }
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
      listeningCount: 6,
      grammarCount: 5
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
      listeningCount: 6,
      grammarCount: 5
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
      listeningCount: 6,
      grammarCount: 5
    }
  },
  {
    id: 'level-4',
    code: 'LV4',
    hskLevel: 'HSK 4+',
    level: 4,
    name: 'Mức độ 4: HSK 4+ & Thành ngữ — Thử thách Bậc thầy',
    subtitle: 'Thành ngữ 4 chữ (成语), HSK 4 công sở & Câu líu lưỡi',
    difficulty: 'challenge',
    badge: '🔴 HSK 4+ (Master)',
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
      wordsCount: 15,
      pronounceItems: 8,
      listeningCount: 6,
      grammarCount: 5
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
  // Mức 1
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

  // Mức 2
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

  // Mức 3
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

  // Mức 4
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
  }
];

// Bài tập ghép câu ngữ pháp phân cấp
export const GRAMMAR_DRILLS_BY_LEVEL = [
  // Mức 1
  {
    id: 'gram-l1-01',
    level: 1,
    title: 'Câu khẳng định chữ 是 (Là)',
    meaning: 'Tôi là giáo viên.',
    tokens: ['我', '是', '老师'],
    correctTokens: ['我', '是', '老师'],
    explanation: 'Cấu trúc cơ bản: Chủ ngữ + 是 + Tân ngữ.'
  },
  {
    id: 'gram-l1-02',
    level: 1,
    title: 'Câu hỏi nghi vấn với 吗',
    meaning: 'Bạn là người Trung Quốc phải không?',
    tokens: ['吗', '你', '是', '中国人'],
    correctTokens: ['你', '是', '中国人', '吗'],
    explanation: 'Trợ từ nghi vấn 吗 luôn đứng ở cuối câu hỏi Yes/No.'
  },

  // Mức 2
  {
    id: 'gram-l2-01',
    level: 2,
    title: 'Động từ năng nguyện 想 (Muốn)',
    meaning: 'Tôi muốn uống trà sữa.',
    tokens: ['喝', '我', '奶茶', '想'],
    correctTokens: ['我', '想', '喝', '奶茶'],
    explanation: 'Động từ năng nguyện (想) đứng trước động từ chính (喝).'
  },
  {
    id: 'gram-l2-02',
    level: 2,
    title: 'Câu hỏi số lượng 多少',
    meaning: 'Chiếc áo này bao nhiêu tiền?',
    tokens: ['多少钱', '衣服', '这件'],
    correctTokens: ['这件', '衣服', '多少钱'],
    explanation: 'Lượng từ đi liền với danh từ: 这件衣服 + Đại từ nghi vấn 多少钱.'
  },

  // Mức 3
  {
    id: 'gram-l3-01',
    level: 3,
    title: 'Câu chữ 把 (Tác động sự vật)',
    meaning: 'Hãy mở máy điều hòa ra.',
    tokens: ['打开', '把', '空调', '请'],
    correctTokens: ['请', '把', '空调', '打开'],
    explanation: 'Cấu trúc câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác.'
  },
  {
    id: 'gram-l3-02',
    level: 3,
    title: 'Cặp liên từ 虽然...但是...',
    meaning: 'Tuy rất mệt nhưng rất vui.',
    tokens: ['很累', '虽然', '但是', '很高兴'],
    correctTokens: ['虽然', '很累', '但是', '很高兴'],
    explanation: 'Cấu trúc mặc dù... nhưng... liên kết hai vế đối lập.'
  },

  // Mức 4
  {
    id: 'gram-l4-01',
    level: 4,
    title: 'Câu điều kiện 只要...就...',
    meaning: 'Chỉ cần chăm chỉ thì sẽ thành công.',
    tokens: ['就', '只要', '努力', '会成功'],
    correctTokens: ['只要', '努力', '就', '会成功'],
    explanation: '只要 A 就 B: Chỉ cần A thì sẽ B (điều kiện đủ).'
  }
];
