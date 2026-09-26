// Comprehensive Chinese Learning Dataset tailored for Vietnamese Learners

export const ROADMAP_LEVELS = [
  {
    id: 'intro',
    code: 'NM',
    level: 'Nhập môn',
    stage: 'Sơ cấp',
    title: 'Phát âm Pinyin & Quy tắc nét bút',
    description: 'Nền tảng vững chắc về 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu chuẩn Bắc Kinh và 8 nét cơ bản chữ Hán.',
    target: 'Đọc chuẩn bất kỳ chữ Hán nào có pinyin và viết đúng quy tắc thuận bút.',
    vocabCount: 60,
    grammarPoints: ['Biến điệu chữ 一 (yī) và 不 (bù)', 'Biến điệu hai thanh 3', 'Quy tắc viết pinyin dấu ngắt âm'],
    skills: ['Phát âm không ngọng', 'Gõ tiếng Trung trên điện thoại/máy tính', 'Nhận diện 20 bộ thủ phổ biến'],
    color: '#45B97C'
  },
  {
    id: 'hsk1',
    code: 'HSK 1',
    level: 'Cơ bản',
    stage: 'Sơ cấp',
    title: 'Giao tiếp hàng ngày & 150 từ vựng',
    description: 'Chào hỏi, giới thiệu bản thân, số đếm, ngày giờ, gia đình, sở thích và các câu giao tiếp sinh hoạt quen thuộc.',
    target: 'Hiểu và sử dụng được các cụm từ, câu đơn giản nhất để giao tiếp trong đời sống.',
    vocabCount: 150,
    grammarPoints: ['Cấu trúc câu chữ 是', 'Câu hỏi đuôi 吗', 'Đại từ nghi vấn 什么, 谁, 哪儿', 'Trợ từ sở hữu 的'],
    skills: ['Tự giới thiệu bản thân trôi chảy', 'Đi chợ mua đồ & thanh toán cơ bản', 'Hỏi và trả lời ngày giờ'],
    color: '#E85D3F'
  },
  {
    id: 'hsk2',
    code: 'HSK 2',
    level: 'Sơ cấp',
    stage: 'Sơ cấp',
    title: 'Sinh hoạt & Mua sắm 300 từ',
    description: 'Mô tả sinh hoạt hàng ngày, ăn uống tại quán ăn, đi lại bằng phương tiện công cộng, hỏi đường và thời tiết.',
    target: 'Giao tiếp đơn giản và trực tiếp trong các tình huống thường nhật quen thuộc.',
    vocabCount: 300,
    grammarPoints: ['Câu so sánh 比', 'Động từ năng nguyện 想, 要, 会', 'Trợ từ trạng thái 了 (hoàn thành)', 'Câu liên động'],
    skills: ['Đi taxi và hỏi đường chi tiết', 'Gọi món tại nhà hàng Trung Hoa', 'Mặc cả và mua sắm cơ bản'],
    color: '#F4B942'
  },
  {
    id: 'hsk3',
    code: 'HSK 3',
    level: 'Trung cấp 1',
    stage: 'Trung cấp',
    title: 'Giao tiếp công việc & Du lịch 600 từ',
    description: 'Hoàn thành các chuyến du lịch tự túc, trao đổi công việc cơ bản, viết email ngắn và giải quyết tình huống phát sinh.',
    target: 'Tự tin du lịch Trung Quốc không cần phiên dịch, giao tiếp công sở căn bản.',
    vocabCount: 600,
    grammarPoints: ['Câu chữ 把', 'Câu chữ 被 (bị động)', 'Cặp liên từ 虽然...但是...', 'Bổ ngữ kết quả & xu hướng'],
    skills: ['Tự đặt vé máy bay & phòng khách sạn', 'Trao đổi thương mại đơn giản trên Taobao/1688', 'Thuyết trình ngắn 3-5 phút'],
    color: '#3B82F6'
  },
  {
    id: 'hsk4',
    code: 'HSK 4',
    level: 'Trung cấp 2',
    stage: 'Trung cấp',
    title: 'Thảo luận chuyên sâu 1200 từ',
    description: 'Bàn luận về các chủ đề văn hóa, kinh tế, xã hội; xem phim không cần phụ đề tiếng Việt và đàm phán hợp đồng sơ cấp.',
    target: 'Đạt chuẩn đầu vào đại học tại Trung Quốc hoặc ứng tuyển công ty đa quốc gia.',
    vocabCount: 1200,
    grammarPoints: ['Liên từ phức hợp', 'Bổ ngữ khả năng', 'Câu phản vấn', 'Cấu trúc nhấn mạnh 是...的'],
    skills: ['Đọc hiểu tin tức tiếng Trung', 'Soạn thảo email thương mại chuyên nghiệp', 'Phỏng vấn xin việc tiếng Trung'],
    color: '#8B5CF6'
  },
  {
    id: 'hsk5-6',
    code: 'HSK 5-6',
    level: 'Cao cấp',
    stage: 'Cao cấp',
    title: 'Làm chủ ngôn ngữ 2500+ từ',
    description: 'Đọc hiểu báo chí tài chính, văn học, thuyết trình kinh doanh, hiểu sâu thành ngữ (Thành ngữ 4 chữ 成语) và đàm phán cấp cao.',
    target: 'Sử dụng tiếng Trung nhuần nhuyễn như người bản xứ, dịch thuật và đàm phán chuyên sâu.',
    vocabCount: 2500,
    grammarPoints: ['Thành ngữ cổ điển', 'Cấu trúc tu từ nâng cao', 'Văn phong văn ngôn & viết học thuật'],
    skills: ['Đàm phán hợp đồng kinh tế lớn', 'Dịch cabin & biên dịch văn bản', 'Thuyết trình trước hội nghị quốc tế'],
    color: '#EC4899'
  }
];

export const VOCABULARY_LIST = [
  // Chào hỏi
  {
    id: 1,
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    hanviet: 'Nhĩ Hảo',
    meaning: 'Xin chào',
    level: 'HSK 1',
    topic: 'Chào hỏi',
    radical: '亻 (Nhân đứng) + 女 (Nữ) + 子 (Tử)',
    strokes: 7,
    mnemonic: 'Người (亻) chào bạn (尔), phụ nữ (女) sinh được con trai (子) là điều tốt lành (好).',
    example: {
      hanzi: '你好！很高兴认识你。',
      pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
      meaning: 'Xin chào! Rất vui được quen biết bạn.'
    }
  },
  {
    id: 2,
    hanzi: '谢谢',
    pinyin: 'xièxie',
    hanviet: 'Tạ Tạ',
    meaning: 'Cảm ơn',
    level: 'HSK 1',
    topic: 'Chào hỏi',
    radical: '讠(Ngôn) + 身 (Thân) + 寸 (Thốn)',
    strokes: 12,
    mnemonic: 'Dùng lời nói (讠) cúi mình (身) biểu thị sự biết ơn dù chỉ một tấc (寸).',
    example: {
      hanzi: '太谢谢你的帮助了！',
      pinyin: 'Tài xièxie nǐ de bāngzhù le!',
      meaning: 'Vô cùng cảm ơn sự giúp đỡ của bạn!'
    }
  },
  {
    id: 3,
    hanzi: '再见',
    pinyin: 'zàijiàn',
    hanviet: 'Tái Kiến',
    meaning: 'Tạm biệt (Hẹn gặp lại)',
    level: 'HSK 1',
    topic: 'Chào hỏi',
    radical: '冂 (Quynh) + 见 (Kiến)',
    strokes: 6,
    mnemonic: 'Tái (再) nghĩa là lần nữa, Kiến (见) nghĩa là gặp mặt. Hẹn lần nữa gặp lại nhau.',
    example: {
      hanzi: '明天见，再见！',
      pinyin: 'Míngtiān jiàn, zàijiàn!',
      meaning: 'Mai gặp nhé, tạm biệt!'
    }
  },
  {
    id: 4,
    hanzi: '不客气',
    pinyin: 'bú kèqi',
    hanviet: 'Bất Khách Khí',
    meaning: 'Đừng khách sáo / Không có gì',
    level: 'HSK 1',
    topic: 'Chào hỏi',
    radical: '不 (Bất) + 宀 (Miên) + 气 (Khí)',
    strokes: 9,
    mnemonic: 'Đã là bạn thân thì không (不) cần giữ lễ nghi khách (客) sáo với nhau.',
    example: {
      hanzi: 'A: 谢谢你！ B: 不客气。',
      pinyin: 'A: Xièxie nǐ! B: Bú kèqi.',
      meaning: 'A: Cảm ơn bạn! B: Không có chi.'
    }
  },

  // Gia đình
  {
    id: 5,
    hanzi: '爸爸',
    pinyin: 'bàba',
    hanviet: 'Ba Ba',
    meaning: 'Bố, cha',
    level: 'HSK 1',
    topic: 'Gia đình',
    radical: '父 (Phụ)',
    strokes: 8,
    mnemonic: 'Bộ phụ (父) ở trên nghĩa là người cha, bộ ba (巴) ở dưới chỉ âm đọc.',
    example: {
      hanzi: '我爸爸是一名医生。',
      pinyin: 'Wǒ bàba shì yì míng yīshēng.',
      meaning: 'Bố tôi là một bác sĩ.'
    }
  },
  {
    id: 6,
    hanzi: '妈妈',
    pinyin: 'māma',
    hanviet: 'Ma Ma',
    meaning: 'Mẹ, má',
    level: 'HSK 1',
    topic: 'Gia đình',
    radical: '女 (Nữ) + 马 (Mã)',
    strokes: 6,
    mnemonic: 'Người phụ nữ (女) vất vả gánh vác việc gia đình như ngựa (马) chính là mẹ.',
    example: {
      hanzi: '我妈妈做菜非常好吃。',
      pinyin: 'Wǒ māma zuò cài fēicháng hǎochī.',
      meaning: 'Mẹ tôi nấu ăn rất ngon.'
    }
  },
  {
    id: 7,
    hanzi: '家',
    pinyin: 'jiā',
    hanviet: 'Gia',
    meaning: 'Nhà, gia đình',
    level: 'HSK 1',
    topic: 'Gia đình',
    radical: '宀 (Mái nhà) + 豕 (Con heo)',
    strokes: 10,
    mnemonic: 'Dưới mái nhà (宀) có nuôi con heo (豕) là ấm no hạnh phúc của gia đình nông thôn.',
    example: {
      hanzi: '我家有四口人。',
      pinyin: 'Wǒ jiā yǒu sì kǒu rén.',
      meaning: 'Nhà tôi có bốn người.'
    }
  },

  // Trường học
  {
    id: 8,
    hanzi: '学习',
    pinyin: 'xuéxí',
    hanviet: 'Học Tập',
    meaning: 'Học tập, học hỏi',
    level: 'HSK 1',
    topic: 'Trường học',
    radical: '子 (Tử) + 习 (Tập)',
    strokes: 8,
    mnemonic: 'Đứa trẻ (子) mở rộng tầm mắt học hỏi kiến thức, rồi luyện tập (习) như chim non đập cánh.',
    example: {
      hanzi: '我很喜欢学习汉语。',
      pinyin: 'Wǒ hěn xǐhuan xuéxí Hànyǔ.',
      meaning: 'Tôi rất thích học tiếng Hán (tiếng Trung).'
    }
  },
  {
    id: 9,
    hanzi: '老师',
    pinyin: 'lǎoshī',
    hanviet: 'Lão Sư',
    meaning: 'Thầy giáo, cô giáo',
    level: 'HSK 1',
    topic: 'Trường học',
    radical: '耂 (Lão) + 巾 (Cân)',
    strokes: 6,
    mnemonic: 'Người cao tuổi (老) giàu kinh nghiệm chỉ dạy cho đoàn học sinh (师).',
    example: {
      hanzi: '王老师对学生很耐心。',
      pinyin: 'Wáng lǎoshī duì xuésheng hěn nàixīn.',
      meaning: 'Thầy Vương rất kiên nhẫn với học sinh.'
    }
  },
  {
    id: 10,
    hanzi: '朋友',
    pinyin: 'péngyou',
    hanviet: 'Bằng Hữu',
    meaning: 'Bạn bè',
    level: 'HSK 1',
    topic: 'Trường học',
    radical: '月 (Nguyệt) + 又 (Hựu)',
    strokes: 8,
    mnemonic: 'Hai vầng trăng (月+月=朋) cùng nhau soi sáng bước đường, chung tay (友) đồng hành.',
    example: {
      hanzi: '我们是好朋友。',
      pinyin: 'Wǒmen shì hǎo péngyou.',
      meaning: 'Chúng tôi là bạn tốt của nhau.'
    }
  },

  // Ăn uống
  {
    id: 11,
    hanzi: '米饭',
    pinyin: 'mǐfàn',
    hanviet: 'Mễ Phạn',
    meaning: 'Cơm trắng',
    level: 'HSK 1',
    topic: 'Ăn uống',
    radical: '米 (Gạo) + 饣(Thực)',
    strokes: 6,
    mnemonic: 'Hạt gạo (米) nấu chín thành bữa ăn (饣= thực) tạo nên bát cơm thơm phức.',
    example: {
      hanzi: '服务员，请给我一碗米饭。',
      pinyin: 'Fúwùyuán, qǐng gěi wǒ yì wǎn mǐfàn.',
      meaning: 'Phục vụ ơi, vui lòng cho tôi một bát cơm.'
    }
  },
  {
    id: 12,
    hanzi: '喝茶',
    pinyin: 'hē chá',
    hanviet: 'Hát Trà',
    meaning: 'Uống trà',
    level: 'HSK 1',
    topic: 'Ăn uống',
    radical: '口 (Miệng) + 艹 (Cỏ)',
    strokes: 12,
    mnemonic: 'Dùng miệng (口) uống thứ nước làm từ lá cây trà (艹).',
    example: {
      hanzi: '中国人非常喜欢喝茶。',
      pinyin: 'Zhōngguórén fēicháng xǐhuan hē chá.',
      meaning: 'Người Trung Quốc vô cùng thích uống trà.'
    }
  },
  {
    id: 13,
    hanzi: '好吃',
    pinyin: 'hǎochī',
    hanviet: 'Hảo Cật',
    meaning: 'Ngon miệng',
    level: 'HSK 1',
    topic: 'Ăn uống',
    radical: '女 (Nữ) + 口 (Khẩu)',
    strokes: 6,
    mnemonic: 'Thức ăn tốt lành (好) đưa vào miệng (口) ăn (吃) cảm thấy thơm ngon.',
    example: {
      hanzi: '北京烤鸭真好吃！',
      pinyin: 'Běijīng kǎoyā zhēn hǎochī!',
      meaning: 'Vịt quay Bắc Kinh thật là ngon!'
    }
  },

  // Mua sắm
  {
    id: 14,
    hanzi: '多少钱',
    pinyin: 'duōshao qián',
    hanviet: 'Đa Thiểu Tiền',
    meaning: 'Bao nhiêu tiền?',
    level: 'HSK 1',
    topic: 'Mua sắm',
    radical: '夕 (Tịch) + 钅(Kim)',
    strokes: 6,
    mnemonic: 'Nhiều (多) hay ít (少), dùng tiền kim loại (钅) để định giá trao đổi.',
    example: {
      hanzi: '老板，这个苹果多少钱一斤？',
      pinyin: 'Lǎobǎn, zhège píngguǒ duōshao qián yì jīn?',
      meaning: 'Chủ quán, táo này bao nhiêu tiền một cân?'
    }
  },
  {
    id: 15,
    hanzi: '便宜',
    pinyin: 'piányi',
    hanviet: 'Tiện Nghi',
    meaning: 'Rẻ, giá hời',
    level: 'HSK 2',
    topic: 'Mua sắm',
    radical: '亻(Nhân) + 宀 (Miên)',
    strokes: 9,
    mnemonic: 'Tiện lợi cho con người (亻), thích hợp (宜) trong túi tiền là đồ rẻ.',
    example: {
      hanzi: '太贵了，能不能便宜一点？',
      pinyin: 'Tài guì le, néng bu néng piányi yìdiǎn?',
      meaning: 'Đắt quá, có thể bớt rẻ một chút được không?'
    }
  },

  // Thời gian
  {
    id: 16,
    hanzi: '现在',
    pinyin: 'xiànzài',
    hanviet: 'Hiện Tại',
    meaning: 'Bây giờ, hiện tại',
    level: 'HSK 1',
    topic: 'Thời gian',
    radical: '王 (Ngọc) + 土 (Thổ)',
    strokes: 8,
    mnemonic: 'Viên ngọc hiện ra (现) ngay tại (在) mặt đất này chính là thời khắc lúc này.',
    example: {
      hanzi: '现在几点了？',
      pinyin: 'Xiànzài jǐ diǎn le?',
      meaning: 'Bây giờ là mấy giờ rồi?'
    }
  },
  {
    id: 17,
    hanzi: '明天',
    pinyin: 'míngtiān',
    hanviet: 'Minh Thiên',
    meaning: 'Ngày mai',
    level: 'HSK 1',
    topic: 'Thời gian',
    radical: '日 (Nhật) + 月 (Nguyệt)',
    strokes: 8,
    mnemonic: 'Mặt trời (日) lặn và trăng (月) mọc lên là sáng mai (明) của ngày mới (天).',
    example: {
      hanzi: '明天下午我们一起去图书馆吧。',
      pinyin: 'Míngtiān xiàwǔ wǒmen yìqǐ qù túshūguǎn ba.',
      meaning: 'Chiều mai chúng ta cùng nhau đi thư viện nhé.'
    }
  },

  // Cảm xúc & Tâm trạng
  {
    id: 18,
    hanzi: '高兴',
    pinyin: 'gāoxìng',
    hanviet: 'Cao Hứng',
    meaning: 'Vui vẻ, phấn khởi',
    level: 'HSK 1',
    topic: 'Cảm xúc',
    radical: '高 (Cao) + 八 (Bát)',
    strokes: 10,
    mnemonic: 'Tâm trạng lên cao vút (高) bộc phát sự hưng phấn (兴).',
    example: {
      hanzi: '今天能见到你，我非常高兴。',
      pinyin: 'Jīntiān néng jiàndào nǐ, wǒ fēicháng gāoxìng.',
      meaning: 'Hôm nay được gặp bạn, tôi vô cùng vui mừng.'
    }
  },
  {
    id: 19,
    hanzi: '喜欢',
    pinyin: 'xǐhuan',
    hanviet: 'Hỷ Hoan',
    meaning: 'Thích, yêu thích',
    level: 'HSK 1',
    topic: 'Cảm xúc',
    radical: '士 (Sĩ) + 口 (Khẩu) + 欠 (Khiếm)',
    strokes: 12,
    mnemonic: 'Miệng (口) luôn cười hớn hở (喜), lòng cảm thấy hoan hỉ (欢) với điều mình yêu thích.',
    example: {
      hanzi: '你喜欢听中国音乐吗？',
      pinyin: 'Nǐ xǐhuan tīng Zhōngguó yīnyuè ma?',
      meaning: 'Bạn có thích nghe nhạc Trung Quốc không?'
    }
  },

  // Công việc
  {
    id: 20,
    hanzi: '工作',
    pinyin: 'gōngzuò',
    hanviet: 'Công Tác',
    meaning: 'Làm việc, công việc',
    level: 'HSK 1',
    topic: 'Công việc',
    radical: '工 (Công) + 亻 (Nhân)',
    strokes: 7,
    mnemonic: 'Người thợ làm công (工) và người lao động (亻) chung sức tạo tác (作).',
    example: {
      hanzi: '你在哪儿工作？',
      pinyin: 'Nǐ zài nǎr gōngzuò?',
      meaning: 'Bạn làm việc ở đâu vậy?'
    }
  },
  {
    id: 21,
    hanzi: '公司',
    pinyin: 'gōngsī',
    hanviet: 'Công Ty',
    meaning: 'Công ty, doanh nghiệp',
    level: 'HSK 2',
    topic: 'Công việc',
    radical: '八 (Bát) + 一 (Nhất)',
    strokes: 6,
    mnemonic: 'Công (公) cộng và Quản lý (司) là nơi tổ chức sản xuất kinh doanh.',
    example: {
      hanzi: '我在一家外贸公司上班。',
      pinyin: 'Wǒ zài yì jiā wàimào gōngsī shàngbān.',
      meaning: 'Tôi làm việc tại một công ty ngoại thương.'
    }
  },

  // Du lịch
  {
    id: 22,
    hanzi: '旅游',
    pinyin: 'lǚyóu',
    hanviet: 'Lữ Du',
    meaning: 'Du lịch, đi chơi xa',
    level: 'HSK 2',
    topic: 'Du lịch',
    radical: '方 (Phương) + 氵 (Thủy)',
    strokes: 10,
    mnemonic: 'Đoàn lữ hành (旅) vượt sông nước (氵) du ngoạn bốn phương.',
    example: {
      hanzi: '今年夏天我想去北京旅游。',
      pinyin: 'Jīnnián xiàtiān wǒ xiǎng qù Běijīng lǚyóu.',
      meaning: 'Mùa hè năm nay tôi muốn đi du lịch Bắc Kinh.'
    }
  },
  {
    id: 23,
    hanzi: '机场',
    pinyin: 'jīchǎng',
    hanviet: 'Cơ Trường',
    meaning: 'Sân bay, phi trường',
    level: 'HSK 2',
    topic: 'Du lịch',
    radical: '木 (Mộc) + 土 (Thổ)',
    strokes: 6,
    mnemonic: 'Máy bay (飞机) đáp xuống một bãi đất rộng (场).',
    example: {
      hanzi: '我现在要去机场接朋友。',
      pinyin: 'Wǒ xiànzài yào qù jīchǎng jiē péngyou.',
      meaning: 'Bây giờ tôi phải đến sân bay đón bạn.'
    }
  },
  {
    id: 24,
    hanzi: '奶茶',
    pinyin: 'nǎichá',
    hanviet: 'Nãi Trà',
    meaning: 'Trà sữa',
    level: 'HSK 1',
    topic: 'Ăn uống',
    radical: '女 (Nữ) + 艹 (Thảo)',
    strokes: 8,
    mnemonic: 'Chữ Nãi (奶 - sữa) có bộ Nữ (女) người mẹ cho con bú, chữ Trà (茶) có bộ Thảo (艹) lá trà.',
    example: {
      hanzi: '你想喝珍珠奶茶还是绿茶？',
      pinyin: 'Nǐ xiǎng hē zhēnzhū nǎichá háishi lǜchá?',
      meaning: 'Bạn muốn uống trà sữa trân châu hay trà xanh?'
    }
  },
  {
    id: 25,
    hanzi: '手机',
    pinyin: 'shǒujī',
    hanviet: 'Thủ Cơ',
    meaning: 'Điện thoại di động',
    level: 'HSK 1',
    topic: 'Công nghệ',
    radical: '手 (Thủ) + 木 (Mộc)',
    strokes: 4,
    mnemonic: 'Chiếc máy (机) nhỏ gọn cầm vừa vặn trong lòng bàn tay (手).',
    example: {
      hanzi: '我的手机在桌子上。',
      pinyin: 'Wǒ de shǒujī zài zhuōzi shang.',
      meaning: 'Điện thoại của tôi ở trên bàn.'
    }
  },
  {
    id: 26,
    hanzi: '微信',
    pinyin: 'Wēixìn',
    hanviet: 'Vi Tín',
    meaning: 'WeChat (Ứng dụng liên lạc & thanh toán phổ biến nhất)',
    level: 'HSK 1',
    topic: 'Công nghệ',
    radical: '彳 (Xích) + 亻(Nhân)',
    strokes: 13,
    mnemonic: 'Vi (微) là vi diệu, nhỏ bé; Tín (信) là tin nhắn, lòng tin. Trao đổi thông tin tức thời.',
    example: {
      hanzi: '我们加个微信吧，以后常联系。',
      pinyin: 'Wǒmen jiā ge Wēixìn ba, yǐhòu cháng liánxì.',
      meaning: 'Chúng ta kết bạn WeChat nhé, sau này thường xuyên liên lạc.'
    }
  },
  {
    id: 27,
    hanzi: '拍照',
    pinyin: 'pāizhào',
    hanviet: 'Phách Chiếu',
    meaning: 'Chụp ảnh, chụp hình',
    level: 'HSK 2',
    topic: 'Du lịch',
    radical: '扌(Thủ) + 灬 (Hỏa)',
    strokes: 8,
    mnemonic: 'Dùng tay (扌) bấm máy phách (拍), ánh sáng lóe lên chiếu sáng (照) ghi lại khoảnh khắc.',
    example: {
      hanzi: '这里的风景太美了，我们拍张照吧！',
      pinyin: 'Zhèlǐ de fēngjǐng tài měi le, wǒmen pāi zhāng zhào ba!',
      meaning: 'Phong cảnh ở đây đẹp quá, chúng mình chụp một tấm ảnh đi!'
    }
  },
  {
    id: 28,
    hanzi: '打折',
    pinyin: 'dǎzhé',
    hanviet: 'Đả Chiết',
    meaning: 'Giảm giá, chiết khấu',
    level: 'HSK 2',
    topic: 'Mua sắm',
    radical: '扌(Thủ) + 斤 (Cân)',
    strokes: 5,
    mnemonic: 'Dùng tay (扌) bẻ gãy (折) bớt một phần giá niêm yết để giảm giá khuyến mãi.',
    example: {
      hanzi: '商场正在打八折，非常划算。',
      pinyin: 'Shāngchǎng zhèngzài dǎ bā zhé, fēicháng huásuàn.',
      meaning: 'Trung tâm thương mại đang giảm giá 20%, rất hời.'
    }
  },
  {
    id: 29,
    hanzi: '加油',
    pinyin: 'jiāyóu',
    hanviet: 'Gia Du',
    meaning: 'Cố lên!, nỗ lực lên (nghĩa đen: thêm dầu)',
    level: 'HSK 1',
    topic: 'Cảm xúc',
    radical: '力 (Lực) + 氵(Thủy)',
    strokes: 5,
    mnemonic: 'Dùng sức lực (力) tăng thêm (加) dòng dầu (油) để động cơ xe chạy nhanh và bền bỉ hơn.',
    example: {
      hanzi: '明天考试，祝你加油！',
      pinyin: 'Míngtiān kǎoshì, zhù nǐ jiāyóu!',
      meaning: 'Ngày mai thi rồi, chúc bạn cố lên nhé!'
    }
  },
  {
    id: 30,
    hanzi: '外卖',
    pinyin: 'wàimài',
    hanviet: 'Ngoại Mại',
    meaning: 'Đồ ăn mang về, đồ ăn giao tận nơi',
    level: 'HSK 2',
    topic: 'Ăn uống',
    radical: '夕 (Tịch) + 十 (Thập)',
    strokes: 5,
    mnemonic: 'Đồ ăn bán (卖) ra bên ngoài (外) cho shipper mang tới tận cửa nhà.',
    example: {
      hanzi: '今天太累了，我们点外卖吧。',
      pinyin: 'Jīntiān tài lèi le, wǒmen diǎn wàimài ba.',
      meaning: 'Hôm nay mệt quá rồi, chúng mình gọi đồ ăn giao về đi.'
    }
  },
  {
    id: 31,
    hanzi: '咖啡',
    pinyin: 'kāfēi',
    hanviet: 'Ca Phê',
    meaning: 'Cà phê',
    level: 'HSK 1',
    topic: 'Ăn uống',
    radical: '口 (Khẩu)',
    strokes: 8,
    mnemonic: 'Cả hai chữ đều có bộ Khẩu (口) miệng uống nước, âm đọc bắt nguồn trực tiếp từ "coffee".',
    example: {
      hanzi: '早上喝一杯热咖啡让人感觉很清醒。',
      pinyin: 'Zǎoshang hē yì bēi rè kāfēi ràng rén gǎnjué hěn qīngxǐng.',
      meaning: 'Buổi sáng uống một ly cà phê nóng giúp tinh thần tỉnh táo.'
    }
  },
  {
    id: 32,
    hanzi: '汉语',
    pinyin: 'Hànyǔ',
    hanviet: 'Hán Ngữ',
    meaning: 'Tiếng Trung, tiếng Hán',
    level: 'HSK 1',
    topic: 'Trường học',
    radical: '氵(Thủy) + 讠(Ngôn)',
    strokes: 5,
    mnemonic: 'Ngôn ngữ (讠) truyền thống của dân tộc Hán (氵+ 又) trải dài bên dòng sông Hán Thủy.',
    example: {
      hanzi: '我觉得学汉语非常有意思。',
      pinyin: 'Wǒ juéde xué Hànyǔ fēicháng yǒu yìsi.',
      meaning: 'Tôi thấy học tiếng Trung vô cùng thú vị.'
    }
  },
  {
    id: 33,
    hanzi: '方便',
    pinyin: 'fāngbiàn',
    hanviet: 'Phương Tiện',
    meaning: 'Thuận tiện, tiện lợi',
    level: 'HSK 2',
    topic: 'Công việc',
    radical: '方 (Phương) + 亻(Nhân)',
    strokes: 4,
    mnemonic: 'Mọi phương hướng (方) đều dễ dàng đi lại, thuận tiện cho con người (亻).',
    example: {
      hanzi: '坐地铁上班非常方便。',
      pinyin: 'Zuò dìtiě shàngbān fēicháng fāngbiàn.',
      meaning: 'Đi tàu điện ngầm đi làm rất thuận tiện.'
    }
  },
  {
    id: 34,
    hanzi: '扫码',
    pinyin: 'sǎomǎ',
    hanviet: 'Tảo Mã',
    meaning: 'Quét mã (QR code thanh toán/truy cập)',
    level: 'HSK 2',
    topic: 'Công nghệ',
    radical: '扌(Thủ) + 石 (Thạch)',
    strokes: 11,
    mnemonic: 'Dùng tay (扌) lia máy quét (扫) nhận diện mã số hình ô đá (石) để thực hiện giao dịch.',
    example: {
      hanzi: '请您扫码付款。',
      pinyin: 'Qǐng nín sǎomǎ fùkuǎn.',
      meaning: 'Xin mời quý khách quét mã QR để thanh toán.'
    }
  },
  {
    id: 35,
    hanzi: '快递',
    pinyin: 'kuàidì',
    hanviet: 'Khoái Đệ',
    meaning: 'Chuyển phát nhanh, đơn hàng ship',
    level: 'HSK 2',
    topic: 'Mua sắm',
    radical: '忄(Tâm) + 辶 (Sước)',
    strokes: 7,
    mnemonic: 'Vận chuyển nhanh chóng (快) chạy bộ (辶) trao tận tay (递) cho khách hàng.',
    example: {
      hanzi: '师傅，我的快递到了吗？',
      pinyin: 'Shīfu, wǒ de kuàidì dào le ma?',
      meaning: 'Anh giao hàng ơi, kiện hàng chuyển phát của tôi đã đến chưa?'
    }
  },
  {
    id: 36,
    hanzi: '出租车',
    pinyin: 'chūzūchē',
    hanviet: 'Xuất Tô Xa',
    meaning: 'Xe taxi',
    level: 'HSK 1',
    topic: 'Du lịch',
    radical: '凵 (Khảm) + 禾 (Hòa) + 车 (Xa)',
    strokes: 5,
    mnemonic: 'Xe (车) cho thuê (租) xuất xưởng (出) phục vụ đón trả khách.',
    example: {
      hanzi: '下雨了，我们打出租车回去吧。',
      pinyin: 'Xiàyǔ le, wǒmen dǎ chūzūchē huíqù ba.',
      meaning: 'Mưa rồi, chúng mình bắt taxi về thôi.'
    }
  },
  {
    id: 37,
    hanzi: '地铁',
    pinyin: 'dìtiě',
    hanviet: 'Địa Thiết',
    meaning: 'Tàu điện ngầm',
    level: 'HSK 2',
    topic: 'Du lịch',
    radical: '土 (Thổ) + 钅(Kim)',
    strokes: 6,
    mnemonic: 'Đoàn tàu bằng sắt thép (铁) chạy nhanh bon bon bên dưới lòng đất (地).',
    example: {
      hanzi: '坐地铁又快又准时，还不会堵车。',
      pinyin: 'Zuò dìtiě yòu kuài yòu zhǔnshí, hái bú huì dǔchē.',
      meaning: 'Đi tàu điện ngầm vừa nhanh vừa đúng giờ, lại không bị kẹt xe.'
    }
  },
  {
    id: 38,
    hanzi: '天气',
    pinyin: 'tiānqì',
    hanviet: 'Thiên Khí',
    meaning: 'Thời tiết',
    level: 'HSK 1',
    topic: 'Đời sống',
    radical: '大 (Đại) + 气 (Khí)',
    strokes: 4,
    mnemonic: 'Bầu trời (天) và luồng không khí (气) biến đổi bốn mùa tạo thành thời tiết.',
    example: {
      hanzi: '今天天气真好，很暖和。',
      pinyin: 'Jīntiān tiānqì zhēn hǎo, hěn nuǎnhuo.',
      meaning: 'Thời tiết hôm nay thật đẹp, rất ấm áp.'
    }
  },
  {
    id: 39,
    hanzi: '下雨',
    pinyin: 'xiàyǔ',
    hanviet: 'Hạ Vũ',
    meaning: 'Trời mưa, mưa rơi',
    level: 'HSK 1',
    topic: 'Đời sống',
    radical: '一 (Nhất) + 雨 (Vũ)',
    strokes: 3,
    mnemonic: 'Những hạt mưa mát lành từ trời cao (雨) rơi xuống (下) mặt đất tưới mát cỏ cây.',
    example: {
      hanzi: '外边下大雨了，出门记得带雨伞。',
      pinyin: 'Wàibian xià dàyǔ le, chūmén jìde dài yǔsǎn.',
      meaning: 'Bên ngoài trời mưa to rồi, ra ngoài nhớ mang theo ô nhé.'
    }
  },
  {
    id: 40,
    hanzi: '迟到',
    pinyin: 'chídào',
    hanviet: 'Trì Đáo',
    meaning: 'Đến muộn, đi trễ',
    level: 'HSK 2',
    topic: 'Trường học',
    radical: '辶 (Sước) + 刂 (Đao)',
    strokes: 7,
    mnemonic: 'Bước chân chần chừ (辶) đi chậm trễ (迟) nên đến (到) trễ hơn giờ quy định.',
    example: {
      hanzi: '对不起老师，因为路上堵车我迟到了。',
      pinyin: 'Duìbuqǐ lǎoshī, yīnwèi lùshang dǔchē wǒ chídào le.',
      meaning: 'Xin lỗi thầy giáo, vì trên đường tắc xe nên em đến muộn.'
    }
  },
  {
    id: 41,
    hanzi: '请假',
    pinyin: 'qǐngjià',
    hanviet: 'Thỉnh Giả',
    meaning: 'Xin nghỉ phép, xin nghỉ',
    level: 'HSK 2',
    topic: 'Công việc',
    radical: '讠(Ngôn) + 亻(Nhân)',
    strokes: 10,
    mnemonic: 'Dùng lời lẽ lễ phép (讠= Ngôn) trình bày (请) để xin kỳ nghỉ (假).',
    example: {
      hanzi: '我身体有点不舒服，想请一天假。',
      pinyin: 'Wǒ shēntǐ yǒudiǎn bù shūfu, xiǎng qǐng yì tiān jià.',
      meaning: 'Cơ thể tôi hơi không khỏe, muốn xin nghỉ phép một ngày.'
    }
  },
  {
    id: 42,
    hanzi: '会议',
    pinyin: 'huìyì',
    hanviet: 'Hội Nghị',
    meaning: 'Cuộc họp, hội nghị',
    level: 'HSK 3',
    topic: 'Công việc',
    radical: '人 (Nhân) + 讠(Ngôn)',
    strokes: 6,
    mnemonic: 'Mọi người hội tụ (会) lại cùng phát biểu ý kiến thảo luận (讠= Ngôn trong 议).',
    example: {
      hanzi: '今天下午三点在二楼开部门会议。',
      pinyin: 'Jīntiān xiàwǔ sān diǎn zài èr lóu kāi bùmén huìyì.',
      meaning: 'Chiều nay 3 giờ họp phòng ban ở tầng hai.'
    }
  },
  {
    id: 43,
    hanzi: '帮忙',
    pinyin: 'bāngmáng',
    hanviet: 'Bang Mang',
    meaning: 'Giúp đỡ, phụ giúp một tay',
    level: 'HSK 2',
    topic: 'Chào hỏi',
    radical: '巾 (Cân) + 忄(Tâm)',
    strokes: 9,
    mnemonic: 'Khi đối phương đang bận rộn (忙), mình tận tâm tương trợ (帮) san sẻ.',
    example: {
      hanzi: '你能帮我一个忙吗？',
      pinyin: 'Nǐ néng bāng wǒ yí ge máng ma?',
      meaning: 'Bạn có thể giúp tôi một tay được không?'
    }
  },
  {
    id: 44,
    hanzi: '舒服',
    pinyin: 'shūfu',
    hanviet: 'Thư Phục',
    meaning: 'Thoải mái, dễ chịu',
    level: 'HSK 2',
    topic: 'Cảm xúc',
    radical: '舌 (Thiệt) + 月 (Nguyệt)',
    strokes: 12,
    mnemonic: 'Lòng thư thái (舒), thân thể phục trang (服) nhẹ nhàng khoan khoái dễ chịu.',
    example: {
      hanzi: '喝了一杯热茶后，感觉舒服多了。',
      pinyin: 'Hē le yì bēi rè chá hòu, gǎnjué shūfu duō le.',
      meaning: 'Sau khi uống một tách trà nóng, cảm thấy dễ chịu hơn rất nhiều.'
    }
  },
  {
    id: 45,
    hanzi: '生病',
    pinyin: 'shēngbìng',
    hanviet: 'Sinh Bệnh',
    meaning: 'Bị bệnh, bị ốm',
    level: 'HSK 2',
    topic: 'Cảm xúc',
    radical: '生 (Sinh) + 疒 (Nạch)',
    strokes: 5,
    mnemonic: 'Sinh ra (生) chứng tật trong người, có bộ nạch (疒) người nằm giường bệnh.',
    example: {
      hanzi: '他生病了，医生让他多喝水多休息。',
      pinyin: 'Tā shēngbìng le, yīshēng ràng tā duō hē shuǐ duō xiūxi.',
      meaning: 'Cậu ấy bị ốm rồi, bác sĩ dặn cậu ấy uống nhiều nước và nghỉ ngơi nhiều.'
    }
  },
  {
    id: 46,
    hanzi: '简单',
    pinyin: 'jiǎndān',
    hanviet: 'Giản Đơn',
    meaning: 'Đơn giản, dễ hiểu',
    level: 'HSK 2',
    topic: 'Trường học',
    radical: '竹 (Trúc) + 十 (Thập)',
    strokes: 13,
    mnemonic: 'Thẻ tre (竹) viết ngắn gọn (简), đơn chiếc (单) không hề rườm rà phức tạp.',
    example: {
      hanzi: '这个语法规则其实非常简单。',
      pinyin: 'Zhège yǔfǎ guīzé qíshí fēicháng jiǎndān.',
      meaning: 'Quy tắc ngữ pháp này thực ra vô cùng đơn giản.'
    }
  },
  {
    id: 47,
    hanzi: '难',
    pinyin: 'nán',
    hanviet: 'Nan',
    meaning: 'Khó, gian nan',
    level: 'HSK 2',
    topic: 'Trường học',
    radical: '又 (Hựu) + 隹 (Chuy)',
    strokes: 10,
    mnemonic: 'Dùng tay (又) bắt con chim đuôi ngắn (隹) đang bay lượn là việc rất khó khăn.',
    example: {
      hanzi: '汉字虽然有点难写，但是学起来很有趣。',
      pinyin: 'Hànzì suīrán yǒudiǎn nán xiě, dànshì xué qǐlái hěn yǒuqù.',
      meaning: 'Chữ Hán tuy hơi khó viết một chút, nhưng học vào lại rất thú vị.'
    }
  },
  {
    id: 48,
    hanzi: '上网',
    pinyin: 'shàngwǎng',
    hanviet: 'Thượng Võng',
    meaning: 'Lên mạng, lướt internet',
    level: 'HSK 2',
    topic: 'Công nghệ',
    radical: '一 (Nhất) + 冂 (Quynh)',
    strokes: 3,
    mnemonic: 'Bước lên (上) mạng lưới (网) mạng internet kết nối toàn cầu.',
    example: {
      hanzi: '我经常上网查中文资料。',
      pinyin: 'Wǒ chīngcháng shàngwǎng chá Zhōngwén zīliào.',
      meaning: 'Tôi thường xuyên lên mạng tra cứu tài liệu tiếng Trung.'
    }
  },
  {
    id: 49,
    hanzi: '密码',
    pinyin: 'mìmǎ',
    hanviet: 'Mật Mã',
    meaning: 'Mật khẩu, passcode',
    level: 'HSK 2',
    topic: 'Công nghệ',
    radical: '宀 (Miên) + 必 (Tất) + 石 (Thạch)',
    strokes: 11,
    mnemonic: 'Ký tự bí mật (密) và các con số mã hóa (码) dùng để bảo vệ tài khoản cá nhân.',
    example: {
      hanzi: '请问店里的WiFi密码是多少？',
      pinyin: 'Qǐngwèn diàn lǐ de WiFi mìmǎ shì duōshao?',
      meaning: 'Xin hỏi mật khẩu WiFi của quán là bao nhiêu vậy?'
    }
  },
  {
    id: 50,
    hanzi: '火锅',
    pinyin: 'huǒguō',
    hanviet: 'Hỏa Oa',
    meaning: 'Món lẩu',
    level: 'HSK 2',
    topic: 'Ăn uống',
    radical: '火 (Hỏa) + 钅(Kim)',
    strokes: 4,
    mnemonic: 'Cái nồi kim loại (钅) nấu trực tiếp trên bếp lửa (火) đỏ hồng nghi ngút khói thơm.',
    example: {
      hanzi: '周末我和朋友们一起去吃四川火锅。',
      pinyin: 'Zhōumò wǒ hé péngyoumen yìqǐ qù chī Sìchuān huǒguō.',
      meaning: 'Cuối tuần tôi cùng bạn bè đi ăn lẩu Tứ Xuyên.'
    }
  },
  {
    id: 51,
    hanzi: '运动',
    pinyin: 'yùndòng',
    hanviet: 'Vận Động',
    meaning: 'Vận động, tập thể thao',
    level: 'HSK 2',
    topic: 'Đời sống',
    radical: '辶 (Sước) + 力 (Lực)',
    strokes: 7,
    mnemonic: 'Vận chuyển đôi chân (辶 trong 运) và dùng sức lực (力 trong 动) để rèn luyện thân thể dẻo dai.',
    example: {
      hanzi: '每天坚持运动半小时对健康很好。',
      pinyin: 'Měitiān jiānchí yùndòng bàn xiǎoshí duì jiànkāng hěn hǎo.',
      meaning: 'Mỗi ngày kiên trì tập thể thao nửa tiếng rất tốt cho sức khỏe.'
    }
  }
];

export const TOPIC_FILTERS = [
  'Tất cả',
  'Chào hỏi',
  'Gia đình',
  'Trường học',
  'Ăn uống',
  'Mua sắm',
  'Thời gian',
  'Cảm xúc',
  'Công việc',
  'Du lịch',
  'Công nghệ',
  'Đời sống'
];

export const LESSONS_DATA = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'Chào hỏi cơ bản (问好)',
    subtitle: 'Nắm chắc cách chào hỏi, cảm ơn và tạm biệt chuẩn phát âm Bắc Kinh.',
    level: 'HSK 1',
    durationMinutes: 15,
    xpReward: 50,
    vocabList: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', hanviet: 'Nhĩ hảo', meaning: 'Xin chào', example: '你好，我是李华。' },
      { hanzi: '您好', pinyin: 'nín hǎo', hanviet: 'Nâm hảo', meaning: 'Chào ông/bà (kính ngữ)', example: '老师，您好！' },
      { hanzi: '谢谢', pinyin: 'xièxie', hanviet: 'Tạ tạ', meaning: 'Cảm ơn', example: '谢谢你的礼物。' },
      { hanzi: '不客气', pinyin: 'bú kèqi', hanviet: 'Bất khách khí', meaning: 'Không có chi', example: 'A: 谢谢！B: 不客气。' },
      { hanzi: '再见', pinyin: 'zàijiàn', hanviet: 'Tái kiến', meaning: 'Tạm biệt', example: '老师，再见！' }
    ],
    grammar: {
      title: 'Biến điệu thanh 3 trong 你好 (nǐ hǎo)',
      explanation: 'Khi hai âm tiết mang thanh 3 đi liền nhau, âm tiết thứ nhất sẽ biến điệu phát âm thành thanh 2. Vì vậy, "nǐ hǎo" trên thực tế sẽ được phát âm là "ní hǎo". Đây là quy tắc cực kỳ quan trọng giúp câu nói mềm mại và tự nhiên như người bản xứ.',
      examples: [
        { hanzi: '你好', read: 'nǐ hǎo ➔ đọc thành [ní hǎo]', meaning: 'Xin chào' },
        { hanzi: '您可以', read: 'kěyǐ ➔ đọc thành [kéyǐ]', meaning: 'Có thể' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Khi gặp người lớn tuổi hoặc thầy cô giáo, bạn nên dùng từ nào để thể hiện sự tôn trọng?',
        options: ['你好 (nǐ hǎo)', '您好 (nín hǎo)', '再见 (zàijiàn)', '不客气 (bú kèqi)'],
        correctIndex: 1,
        explanation: '您 (nín) là đại từ ngôi thứ hai số ít trang trọng (có thêm bộ Tâm 心 ở dưới chữ 你), dùng để xưng hô kính trọng với người lớn, thầy cô, đối tác.'
      },
      {
        id: 'q2',
        type: 'listening',
        question: 'Nghe đoạn audio sau và chọn nghĩa tiếng Việt chính xác:',
        audioText: '谢谢你！',
        options: ['Tạm biệt bạn!', 'Cảm ơn bạn!', 'Xin hỏi tên bạn?', 'Bạn có khỏe không?'],
        correctIndex: 1,
        explanation: '谢谢 (xièxie) nghĩa là cảm ơn, 谢谢你 (xièxie nǐ) là "cảm ơn bạn".'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp các từ sau thành câu hoàn chỉnh mang nghĩa "Thầy giáo, xin chào thầy!":',
        words: ['您好', '老师', '！'],
        correctOrder: ['老师', '您好', '！'],
        explanation: 'Trong tiếng Trung, danh xưng (thầy cô, chức vụ) thường được đặt ở đầu câu trước lời chào.'
      }
    ]
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Giới thiệu bản thân (自我介绍)',
    subtitle: 'Nói tên, quốc tịch người Việt Nam và làm quen với bạn mới.',
    level: 'HSK 1',
    durationMinutes: 18,
    xpReward: 60,
    vocabList: [
      { hanzi: '我', pinyin: 'wǒ', hanviet: 'Ngã', meaning: 'Tôi, mình', example: '我是学生。' },
      { hanzi: '是', pinyin: 'shì', hanviet: 'Thị', meaning: 'Là', example: '他是中国人。' },
      { hanzi: '越南人', pinyin: 'Yuènán rén', hanviet: 'Việt Nam nhân', meaning: 'Người Việt Nam', example: '我们都是越南人。' },
      { hanzi: '叫', pinyin: 'jiào', hanviet: 'Khiếu', meaning: 'Tên là, gọi là', example: '我叫明。' },
      { hanzi: '很高兴', pinyin: 'hěn gāoxìng', hanviet: 'Hẳn cao hứng', meaning: 'Rất vui', example: '认识你很高兴。' }
    ],
    grammar: {
      title: 'Cấu trúc câu khẳng định chữ 是 (shì - Là)',
      explanation: 'Chữ 是 tương tự như động từ "to be" trong tiếng Anh hoặc "là" trong tiếng Việt: Chủ ngữ + 是 + Danh từ.',
      examples: [
        { hanzi: '我是越南人。', read: 'Wǒ shì Yuènán rén.', meaning: 'Tôi là người Việt Nam.' },
        { hanzi: '他是我的老师。', read: 'Tā shì wǒ de lǎoshī.', meaning: 'Thầy ấy là giáo viên của tôi.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Câu nào sau đây dịch đúng câu: "Tôi là người Việt Nam"?',
        options: [
          '我叫越南人。 (Wǒ jiào Yuènán rén.)',
          '我是越南人。 (Wǒ shì Yuènán rén.)',
          '我有越南人。 (Wǒ yǒu Yuènán rén.)',
          '我去越南人。 (Wǒ qù Yuènán rén.)'
        ],
        correctIndex: 1,
        explanation: 'Sử dụng cấu trúc: Chủ ngữ (我) + 是 + Danh từ (越南人).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '很高兴认识你！',
        question: 'Nghe và xác định câu này thường được nói vào thời điểm nào?',
        options: [
          'Khi lần đầu tiên gặp gỡ và làm quen',
          'Khi muốn nhờ người khác giúp đỡ',
          'Khi bước vào cửa hàng mua đồ',
          'Khi chuẩn bị đi ngủ'
        ],
        correctIndex: 0,
        explanation: '很高兴认识你 (hěn gāoxìng rènshi nǐ) nghĩa là "Rất vui được làm quen với bạn".'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Ghép câu: "Tôi tên là Lý Hoa."',
        words: ['李华', '我', '叫', '。'],
        correctOrder: ['我', '叫', '李华', '。'],
        explanation: 'Cấu trúc giới thiệu tên: 我 + 叫 + [Tên riêng].'
      }
    ]
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Số đếm và tuổi (数字与年龄)',
    subtitle: 'Nắm vững quy tắc đếm từ 1 đến 100 và hỏi tuổi đối phương.',
    level: 'HSK 1',
    durationMinutes: 15,
    xpReward: 50,
    vocabList: [
      { hanzi: '一', pinyin: 'yī', hanviet: 'Nhất', meaning: 'Số 1', example: '一个人。' },
      { hanzi: '十', pinyin: 'shí', hanviet: 'Thập', meaning: 'Số 10', example: '十块钱。' },
      { hanzi: '百', pinyin: 'bǎi', hanviet: 'Bách', meaning: 'Trăm', example: '一百。' },
      { hanzi: '岁', pinyin: 'suì', hanviet: 'Tuế', meaning: 'Tuổi', example: '我二十岁。' },
      { hanzi: '多大', pinyin: 'duō dà', hanviet: 'Đa đại', meaning: 'Bao nhiêu tuổi', example: '你多大了？' }
    ],
    grammar: {
      title: 'Cách hỏi tuổi trong tiếng Trung',
      explanation: 'Để hỏi tuổi người cùng trang lứa hoặc trẻ tuổi: "你多大了？" (Nǐ duō dà le?). Nếu hỏi trẻ em dưới 10 tuổi: "你几岁了？" (Nǐ jǐ suì le?). Nếu hỏi người lớn tuổi kính trọng: "您多大年纪了？".',
      examples: [
        { hanzi: '你今年多大？', read: 'Nǐ jīnnián duō dà?', meaning: 'Năm nay bạn bao nhiêu tuổi?' },
        { hanzi: '我今年二十五岁。', read: 'Wǒ jīnnián èrshíwǔ suì.', meaning: 'Năm nay tôi 25 tuổi.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Số 48 trong tiếng Trung được viết và đọc như thế nào?',
        options: ['十四 (shísì)', '四十八 (sìshíbā)', '八十四 (bāshísì)', '四八 (sìbā)'],
        correctIndex: 1,
        explanation: 'Số 48 gồm 4 chục (四 + 十) và 8 đơn vị (八) => 四十八 (sìshíbā).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '我今年二十岁。',
        question: 'Người nói trong câu bao nhiêu tuổi?',
        options: ['12 tuổi', '20 tuổi', '22 tuổi', '30 tuổi'],
        correctIndex: 1,
        explanation: '二十岁 (èrshí suì) là 20 tuổi.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Năm nay bạn bao nhiêu tuổi?"',
        words: ['今年', '你', '多大', '了', '？'],
        correctOrder: ['你', '今年', '多大', '了', '？'],
        explanation: 'Trật tự câu: Chủ ngữ (你) + Trạng từ thời gian (今年) + Từ để hỏi (多大) + 了 + ?'
      }
    ]
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Gia đình và người thân (家庭成员)',
    subtitle: 'Kể về các thành viên trong gia đình và nghề nghiệp của họ.',
    level: 'HSK 1',
    durationMinutes: 20,
    xpReward: 60,
    vocabList: [
      { hanzi: '爸爸', pinyin: 'bàba', hanviet: 'Ba ba', meaning: 'Bố', example: '我爸爸是医生。' },
      { hanzi: '妈妈', pinyin: 'māma', hanviet: 'Ma ma', meaning: 'Mẹ', example: '我妈妈在学校工作。' },
      { hanzi: '哥哥', pinyin: 'gēge', hanviet: 'Ca ca', meaning: 'Anh trai', example: '我有一个哥哥。' },
      { hanzi: '妹妹', pinyin: 'mèimei', hanviet: 'Muội muội', meaning: 'Em gái', example: '妹妹很喜欢看书。' },
      { hanzi: '有', pinyin: 'yǒu', hanviet: 'Hữu', meaning: 'Có', example: '你家有几口人？' }
    ],
    grammar: {
      title: 'Lượng từ 口 (kǒu) dùng cho nhân khẩu gia đình',
      explanation: 'Khi đếm số lượng người trong gia đình, người Trung Quốc dùng lượng từ 口 (kǒu - nghĩa gốc là miệng ăn): Gia đình có + số lượng + 口人.',
      examples: [
        { hanzi: '我家有四口人。', read: 'Wǒ jiā yǒu sì kǒu rén.', meaning: 'Nhà tôi có 4 người.' },
        { hanzi: '你家有几口人？', read: 'Nǐ jiā yǒu jǐ kǒu rén?', meaning: 'Nhà bạn có mấy người?' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Lượng từ nào dùng để đếm thành viên trong gia đình?',
        options: ['个 (gè)', '只 (zhī)', '口 (kǒu)', '张 (zhāng)'],
        correctIndex: 2,
        explanation: 'Dùng 口 (kǒu) trong cụm từ cố định: ...口人 (nhân khẩu).'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '我有一个哥哥和一个妹妹。',
        question: 'Người nói có những người thân nào?',
        options: ['1 anh trai và 1 em trai', '1 anh trai và 1 em gái', '1 chị gái và 1 em gái', '2 em gái'],
        correctIndex: 1,
        explanation: '哥哥 (gēge) là anh trai, 妹妹 (mèimei) là em gái.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Nhà tôi có năm người."',
        words: ['我家', '有', '五', '口人', '。'],
        correctOrder: ['我家', '有', '五', '口人', '。'],
        explanation: '我家 (nhà tôi) + 有 (có) + 五口人 (5 người).'
      }
    ]
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Thời gian & Lịch trình (时间与日常)',
    subtitle: 'Nói giờ giấc, ngày trong tuần và sắp xếp lịch hẹn.',
    level: 'HSK 1',
    durationMinutes: 18,
    xpReward: 55,
    vocabList: [
      { hanzi: '现在', pinyin: 'xiànzài', hanviet: 'Hiện tại', meaning: 'Bây giờ', example: '现在几点？' },
      { hanzi: '点', pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Giờ (thời điểm)', example: '八点三十分。' },
      { hanzi: '分', pinyin: 'fēn', hanviet: 'Phân', meaning: 'Phút', example: '差五分九点。' },
      { hanzi: '今天', pinyin: 'jīntiān', hanviet: 'Kim thiên', meaning: 'Hôm nay', example: '今天星期几？' },
      { hanzi: '星期', pinyin: 'xīngqī', hanviet: 'Tinh kỳ', meaning: 'Thứ, tuần', example: '星期一 (thứ Hai).' }
    ],
    grammar: {
      title: 'Quy tắc nói thời gian: Lớn trước, nhỏ sau',
      explanation: 'Trong tiếng Trung, đơn vị thời gian lớn luôn đứng trước đơn vị thời gian nhỏ: Năm -> Tháng -> Ngày -> Buổi -> Giờ -> Phút.',
      examples: [
        { hanzi: '今天上午八点', read: 'Jīntiān shàngwǔ bā diǎn', meaning: '8 giờ sáng hôm nay' },
        { hanzi: '星期天下午三点半', read: 'Xīngqītiān xiàwǔ sān diǎn bàn', meaning: '3 giờ rưỡi chiều Chủ nhật' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Trong tiếng Trung, "Thứ Tư" được nói như thế nào?',
        options: ['星期四 (xīngqīsì)', '星期三 (xīngqīsān)', '星期五 (xīngqīwǔ)', '星期二 (xīngqī’èr)'],
        correctIndex: 1,
        explanation: 'Tiếng Trung bắt đầu từ Thứ Hai là 星期一 (xīngqīyī), Thứ Ba là 星期二, Thứ Tư là 星期三!'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '现在是下午两点十分。',
        question: 'Thời gian được nhắc đến là mấy giờ?',
        options: ['2 giờ 10 phút sáng', '2 giờ 10 phút chiều', '10 giờ 2 phút sáng', '12 giờ 10 phút trưa'],
        correctIndex: 1,
        explanation: '下午 (xiàwǔ) là buổi chiều, 两点十分 (liǎng diǎn shí fēn) là 2 giờ 10 phút.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu hỏi: "Bây giờ là mấy giờ rồi?"',
        words: ['几点', '现在', '了', '？'],
        correctOrder: ['现在', '几点', '了', '？'],
        explanation: '现在 (bây giờ) + 几点 (mấy giờ) + 了 (rồi) + ?'
      }
    ]
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Gọi món tại nhà hàng (在餐厅点菜)',
    subtitle: 'Tự tin gọi món ăn Trung Hoa, xin trà đá và thanh toán hóa đơn.',
    level: 'HSK 1',
    durationMinutes: 20,
    xpReward: 65,
    vocabList: [
      { hanzi: '服务员', pinyin: 'fúwùyuán', hanviet: 'Phục vụ viên', meaning: 'Người phục vụ', example: '服务员，请点菜！' },
      { hanzi: '菜单', pinyin: 'càidān', hanviet: 'Thái đơn', meaning: 'Thực đơn, menu', example: '请给我看一下菜单。' },
      { hanzi: '饺子', pinyin: 'jiǎozi', hanviet: 'Giảo tử', meaning: 'Bánh sủi cảo', example: '我要一盘饺子。' },
      { hanzi: '买单', pinyin: 'mǎidān', hanviet: 'Mãi đơn', meaning: 'Thanh toán, tính tiền', example: '服务员，买单！' },
      { hanzi: '多少钱', pinyin: 'duōshao qián', hanviet: 'Đa thiểu tiền', meaning: 'Bao nhiêu tiền', example: '一共多少钱？' }
    ],
    grammar: {
      title: 'Động từ năng nguyện 要 (yào) khi gọi món',
      explanation: 'Khi gọi món trong nhà hàng, ta dùng "我要 + tên món" (Tôi muốn / Cho tôi món...) rất tự nhiên và lịch sự.',
      examples: [
        { hanzi: '我要一碗牛肉面。', read: 'Wǒ yào yì wǎn niúròumiàn.', meaning: 'Cho tôi một bát mì bò.' },
        { hanzi: '我们要两瓶啤酒。', read: 'Wǒmen yào liǎng píng píjiǔ.', meaning: 'Chúng tôi muốn 2 chai bia.' }
      ]
    },
    quizzes: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Khi muốn gọi nhân viên tính tiền, người Trung Quốc thường nói:',
        options: ['服务员，点菜！', '服务员，买单！', '服务员，再见！', '服务员，你好！'],
        correctIndex: 1,
        explanation: '买单 (mǎidān) nghĩa là thanh toán hóa đơn.'
      },
      {
        id: 'q2',
        type: 'listening',
        audioText: '请给我一杯热茶，谢谢。',
        question: 'Khách hàng đang gọi thức uống gì?',
        options: ['Một cốc cà phê', 'Một cốc bia lạnh', 'Một cốc trà nóng', 'Một chai nước ngọt'],
        correctIndex: 2,
        explanation: '热茶 (rè chá) là trà nóng.'
      },
      {
        id: 'q3',
        type: 'reorder',
        question: 'Sắp xếp câu: "Tất cả hết bao nhiêu tiền?"',
        words: ['一共', '多少钱', '？'],
        correctOrder: ['一共', '多少钱', '？'],
        explanation: '一共 (tổng cộng) + 多少钱 (bao nhiêu tiền) + ?'
      }
    ]
  }
];

export const PINYIN_DATA = {
  initials: [
    { sound: 'b', vietGuide: 'Đọc gần như "p" trong tiếng Việt, không bật hơi', example: 'bā (八 - Tám)' },
    { sound: 'p', vietGuide: 'Bật hơi mạnh, môi mím rồi bật luồng hơi ra', example: 'píng (苹 - Táo)' },
    { sound: 'm', vietGuide: 'Đọc giống "m" tiếng Việt', example: 'mā (妈 - Mẹ)' },
    { sound: 'f', vietGuide: 'Đọc giống "ph" tiếng Việt', example: 'fēi (飞 - Bay)' },
    { sound: 'd', vietGuide: 'Đọc gần như "t" tiếng Việt, không bật hơi', example: 'dà (大 - To lớn)' },
    { sound: 't', vietGuide: 'Bật hơi mạnh, đọc giống "th" tiếng Việt', example: 'tā (他 - Anh ấy)' },
    { sound: 'n', vietGuide: 'Đọc giống "n" tiếng Việt', example: 'nǐ (你 - Bạn)' },
    { sound: 'l', vietGuide: 'Đọc giống "l" tiếng Việt', example: 'lǎo (老 - Già/Thầy)' },
    { sound: 'g', vietGuide: 'Đọc giống "c/k" tiếng Việt không bật hơi', example: 'gē (哥 - Anh trai)' },
    { sound: 'k', vietGuide: 'Bật hơi mạnh trong cuống họng giống "kh"', example: 'kàn (看 - Nhìn/Xem)' },
    { sound: 'h', vietGuide: 'Hơi lai giữa "h" và "kh" tiếng Việt', example: 'hǎo (好 - Tốt/Hay)' },
    { sound: 'j', vietGuide: 'Mặt lưỡi áp ngạc cứng, giống "ch" nhẹ', example: 'jiào (叫 - Kêu/Tên)' },
    { sound: 'q', vietGuide: 'Bật hơi mạnh từ mặt lưỡi, âm tắc xát', example: 'qù (去 - Đi)' },
    { sound: 'x', vietGuide: 'Mặt lưỡi nâng nhẹ, giống "x" tiếng Việt', example: 'xiè (谢 - Cảm ơn)' },
    { sound: 'zh', vietGuide: 'Đầu lưỡi uốn lên vòm miệng, không bật hơi (như "tr")', example: 'zhōng (中 - Giữa)' },
    { sound: 'ch', vietGuide: 'Uốn lưỡi và BẬT HƠI mạnh, đầu lưỡi thụt nhẹ', example: 'chī (吃 - Ăn)' },
    { sound: 'sh', vietGuide: 'Uốn lưỡi thổi luồng hơi ra, giống "s" nặng miền Nam', example: 'shì (是 - Là)' },
    { sound: 'r', vietGuide: 'Uốn lưỡi rung nhẹ, gần giống "r" tiếng Việt', example: 'rén (人 - Người)' },
    { sound: 'z', vietGuide: 'Đầu lưỡi thẳng chạm răng trên, không bật hơi', example: 'zài (在 - Ở)' },
    { sound: 'c', vietGuide: 'Đầu lưỡi thẳng và BẬT HƠI mạnh', example: 'cài (菜 - Món ăn)' },
    { sound: 's', vietGuide: 'Đầu lưỡi thẳng xát nhẹ qua kẽ răng, như "x"', example: 'sì (四 - Bốn)' }
  ],
  finals: [
    { sound: 'a', vietGuide: 'Đọc như "a" tròn miệng', example: 'bà' },
    { sound: 'o', vietGuide: 'Đọc hơi lai giữa "ô" và "ua"', example: 'bō' },
    { sound: 'e', vietGuide: 'Đọc gần như "ơ" hoặc "ưa"', example: 'gē' },
    { sound: 'i', vietGuide: 'Đọc như "i" (với zh, ch, sh, z, c, s đọc là "ư")', example: 'nǐ / shì' },
    { sound: 'u', vietGuide: 'Đọc như "u" tiếng Việt tròn môi', example: 'bù' },
    { sound: 'ü', vietGuide: 'Tròn môi huýt sáo đọc "uy", không dẹt mép', example: 'lǜ (绿 - Xanh)' },
    { sound: 'ai', vietGuide: 'Đọc như "ai"', example: 'bái' },
    { sound: 'ei', vietGuide: 'Đọc như "ây"', example: 'běi' },
    { sound: 'ao', vietGuide: 'Đọc như "ao"', example: 'gāo' },
    { sound: 'ou', vietGuide: 'Đọc như "âu"', example: 'dōu' },
    { sound: 'an', vietGuide: 'Đọc như "an"', example: 'sān' },
    { sound: 'en', vietGuide: 'Đọc như "ơn/ân"', example: 'hěn' },
    { sound: 'ang', vietGuide: 'Đọc như "ang"', example: 'bāng' },
    { sound: 'eng', vietGuide: 'Đọc như "âng"', example: 'péng' },
    { sound: 'ong', vietGuide: 'Đọc như "ung/oong"', example: 'zhōng' }
  ],
  tones: [
    {
      tone: 1,
      name: 'Thanh 1 (Âm Bình)',
      mark: 'ā',
      pitch: '55 - Cao Bằng',
      description: 'Âm vực giữ nguyên ở mức cao độ 5, đều đặn, không lên không xuống, ngân vang nhẹ.',
      example: 'mā (妈 - Mẹ)',
      tip: 'Tưởng tượng như đang ngân một nốt nhạc cao và thẳng giọng.'
    },
    {
      tone: 2,
      name: 'Thanh 2 (Dương Bình)',
      mark: 'á',
      pitch: '35 - Đi Lên',
      description: 'Bắt đầu từ mức trung bình 3 rồi vút lên mức 5, tương tự dấu sắc trong tiếng Việt.',
      example: 'má (麻 - Cây gai)',
      tip: 'Đọc giống như khi bạn ngạc nhiên hỏi: "Hả?", "Gì cơ?".'
    },
    {
      tone: 3,
      name: 'Thanh 3 (Thượng Thanh)',
      mark: 'ǎ',
      pitch: '214 - Xuống Rồi Lên',
      description: 'Hạ giọng xuống thật sâu mức 1 rồi vòng ngược lên mức 4.',
      example: 'mǎ (马 - Ngựa)',
      tip: 'Gần giống dấu hỏi hoặc dấu ngã tiếng Việt nhưng cần nhấn sâu giọng xuống cổ họng trước.'
    },
    {
      tone: 4,
      name: 'Thanh 4 (Khứ Thanh)',
      mark: 'à',
      pitch: '51 - Rơi Dứt Khoát',
      description: 'Rơi thẳng từ mức cao nhất 5 tụt xuống mức 1 thật dứt khoát, mạnh mẽ.',
      example: 'mà (骂 - Mắng mỏ)',
      tip: 'Phát âm dứt khoát như khi bạn ra lệnh: "Dừng!", không kéo dài âm đuôi.'
    }
  ]
};

export const CHARACTERS_WRITING = [
  {
    char: '你',
    pinyin: 'nǐ',
    hanviet: 'Nhĩ',
    meaning: 'Bạn, anh, chị (ngôi thứ 2)',
    strokesCount: 7,
    radical: '亻 (Nhân đứng)',
    strokeOrder: ['Phẩy (丿)', 'Sổ (丨)', 'Phẩy (丿)', 'Ngang móc (乛)', 'Sổ móc (亅)', 'Phẩy (丿)', 'Chấm (丶)'],
    components: '亻 (Người) + 尔 (Bạn/Ngươi)',
    mnemonic: 'Chỉ người đối diện (亻) đang cùng ta trò chuyện.',
    tip: 'Nét sổ của bộ nhân đứng thẳng, nét sổ móc ở bên phải nằm cân đối giữa ô.'
  },
  {
    char: '好',
    pinyin: 'hǎo',
    hanviet: 'Hảo',
    meaning: 'Tốt, lành, đẹp',
    strokesCount: 6,
    radical: '女 (Nữ)',
    strokeOrder: ['Phẩy gập (𡿨)', 'Phẩy (丿)', 'Ngang (一)', 'Ngang gập móc (𠃌)', 'Sổ cong móc (乚)', 'Ngang (一)'],
    components: '女 (Phụ nữ) + 子 (Con trai)',
    mnemonic: 'Người phụ nữ sinh được con trai nếp tẻ vẹn toàn là điều tuyệt vời nhất (好).',
    tip: 'Nét ngang của bộ Nữ 女 biến thành nét hất khi ghép chữ, không vươn quá sang phải.'
  },
  {
    char: '学',
    pinyin: 'xué',
    hanviet: 'Học',
    meaning: 'Học tập, bắt chước',
    strokesCount: 8,
    radical: '子 (Tử)',
    strokeOrder: ['Chấm (丶)', 'Chấm (丶)', 'Phẩy (丿)', 'Chấm (丶)', 'Ngang móc (乛)', 'Ngang gập móc (𠃌)', 'Sổ cong móc (乚)', 'Ngang (一)'],
    components: 'Mái trường che chở cho đứa trẻ (子) tiếp thu tri thức.',
    mnemonic: 'Đứa trẻ ngồi dưới mái trường tiếp thu 3 giọt kiến thức từ thầy cô.',
    tip: '3 chấm ở phần đầu viết nhỏ gọn, mái nhà ôm trọn phần đầu của chữ 子.'
  },
  {
    char: '习',
    pinyin: 'xí',
    hanviet: 'Tập',
    meaning: 'Thực hành, rèn luyện',
    strokesCount: 3,
    radical: '乙 (Ất)',
    strokeOrder: ['Ngang gập móc (𠃌)', 'Chấm (丶)', 'Hất (㇀)'],
    components: 'Hình ảnh cánh chim non đang tập đập cánh bay.',
    mnemonic: 'Học thì phải tập luyện liên tục như cánh chim non tập bay.',
    tip: 'Nét ngang gập móc mở rộng góc, nét chấm bên trong đặt ở góc trên.'
  },
  {
    char: '爱',
    pinyin: 'ài',
    hanviet: 'Ái',
    meaning: 'Yêu thương',
    strokesCount: 10,
    radical: '爫 (Trảo)',
    strokeOrder: ['Phẩy (丿)', 'Chấm (丶)', 'Chấm (丶)', 'Phẩy (丿)', 'Ngang móc (乛)', 'Ngang (一)', 'Phẩy (丿)', 'Ngang phẩy (㇇)', 'Mác (乀)'],
    components: 'Bàn tay vuốt ve, trân trọng một tình cảm sâu sắc trong lòng bạn bè.',
    mnemonic: 'Dành tình cảm nâng niu và bảo bọc cho người mình thương mến.',
    tip: 'Nét mác cuối cùng viết thoải, vững chãi làm chân đỡ cho toàn bộ chữ.'
  },
  {
    char: '中',
    pinyin: 'zhōng',
    hanviet: 'Trung',
    meaning: 'Ở giữa, trung tâm',
    strokesCount: 4,
    radical: '丨 (Sổ)',
    strokeOrder: ['Sổ (丨)', 'Ngang gập (𠃍)', 'Ngang (一)', 'Sổ thẳng giữa (丨)'],
    components: 'Hình chữ nhật tượng trưng vùng đất, nét sổ thẳng đâm xuyên chính giữa.',
    mnemonic: 'Một nét sổ thẳng vạch đúng trọng tâm chính giữa.',
    tip: 'Nét sổ cuối cùng phải đâm xuyên chính tâm, thẳng tắp từ trên xuống dưới.'
  }
];

export const CONVERSATIONS_DATA = [
  {
    id: 'conv-1',
    title: 'Làm quen & Kết bạn',
    scenario: 'Bạn gặp một người bạn Trung Quốc tại một buổi giao lưu văn hóa sinh viên.',
    aiName: 'Tiểu Hàm (小涵)',
    aiRole: 'Sinh viên Đại học Bắc Kinh',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23E85D3F"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">涵</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '你好！我叫小涵，很高兴认识你。你叫什么名字？',
        pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎohán, hěn gāoxìng rènshi nǐ. Nǐ jiào shénme míngzi?',
        meaning: 'Xin chào! Mình tên là Tiểu Hàm, rất vui được làm quen với bạn. Bạn tên là gì thế?'
      },
      {
        speaker: 'user',
        hanzi: '你好，小涵！我叫明，我是越南人。',
        pinyin: 'Nǐ hǎo, Xiǎohán! Wǒ jiào Míng, wǒ shì Yuènán rén.',
        meaning: 'Chào Tiểu Hàm! Mình tên là Minh, mình là người Việt Nam.'
      },
      {
        speaker: 'ai',
        hanzi: '哇，你是越南人啊！你的汉语说得真好。你学汉语多长时间了？',
        pinyin: 'Wa, nǐ shì Yuènán rén a! Nǐ de Hànyǔ shuō de zhēn hǎo. Nǐ xué Hànyǔ duō cháng shíjiān le?',
        meaning: 'Oa, bạn là người Việt Nam à! Tiếng Trung của bạn nói hay thật đấy. Bạn đã học tiếng Trung được bao lâu rồi?'
      },
      {
        speaker: 'user',
        hanzi: '谢谢你的夸奖！我刚学了三个月，还在努力学习呢。',
        pinyin: 'Xièxie nǐ de kuājiǎng! Wǒ gāng xué le sān gè yuè, hái zài nǔlì xuéxí ne.',
        meaning: 'Cảm ơn lời khen của bạn! Mình mới học được 3 tháng, vẫn đang nỗ lực học đây.'
      },
      {
        speaker: 'ai',
        hanzi: '太棒了！我们可以加个微信吗？以后一起练习中文！',
        pinyin: 'Tài bàng le! Wǒmen kěyǐ jiā gè Wēixìn ma? Yǐhòu yìqǐ liànxí Zhōngwén!',
        meaning: 'Tuyệt vời quá! Chúng mình có thể kết bạn WeChat được không? Sau này cùng nhau luyện tiếng Trung nhé!'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '好啊，我的微信号是...',
        pinyin: 'Hǎo a, wǒ de Wēixìn hào shì...',
        meaning: 'Được chứ, số WeChat của mình là...'
      },
      {
        hanzi: '没问题，很高兴和你成为朋友！',
        pinyin: 'Méi wèntí, hěn gāoxìng hé nǐ chéngwéi péngyou!',
        meaning: 'Không vấn đề gì, rất vui được làm bạn với bạn!'
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Tại nhà hàng (点餐)',
    scenario: 'Bạn bước vào một nhà hàng món ăn Tứ Xuyên và chuẩn bị gọi món.',
    aiName: 'Phục vụ Trương (张服务员)',
    aiRole: 'Nhân viên nhà hàng',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23F4B942"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23243447" dominant-baseline="middle" text-anchor="middle">张</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '欢迎光临！请问您几位？这边请坐。',
        pinyin: 'Huānyíng guānglín! Qǐngwèn nín jǐ wèi? Zhè biān qǐng zuò.',
        meaning: 'Kính chào quý khách! Xin hỏi quý khách đi mấy người ạ? Mời ngồi phía bên này.'
      },
      {
        speaker: 'user',
        hanzi: '两位。请给我们看一眼菜单。',
        pinyin: 'Liǎng wèi. Qǐng gěi wǒmen kàn yì yǎn càidān.',
        meaning: 'Hai người. Làm ơn cho chúng tôi xem thực đơn một lát.'
      },
      {
        speaker: 'ai',
        hanzi: '这是我们的菜单。今天我们的麻婆豆腐和水煮牛肉非常受欢迎。',
        pinyin: 'Zhè shì wǒmen de càidān. Jīntiān wǒmen de mápó dòufu hé shuǐzhǔ niúròu fēicháng shòu huānyíng.',
        meaning: 'Đây là thực đơn của quán. Hôm nay món đậu phụ Ma Bà và thịt bò cay Tứ Xuyên rất được ưa chuộng đấy ạ.'
      },
      {
        speaker: 'user',
        hanzi: '好的，请给我们一份麻婆豆腐，少放点辣椒，再来两碗米饭。',
        pinyin: 'Hǎo de, qǐng gěi wǒmen yí fèn mápó dòufu, shǎo fàng diǎn làjiāo, zài lái liǎng wǎn mǐfàn.',
        meaning: 'Được rồi, cho chúng tôi một suất đậu phụ Ma Bà, ít ớt thôi nhé, và thêm hai bát cơm trắng.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '服务员，请给我们两杯温水。',
        pinyin: 'Fúwùyuán, qǐng gěi wǒmen liǎng bēi wēn shuǐ.',
        meaning: 'Phục vụ ơi, cho chúng tôi hai cốc nước ấm.'
      },
      {
        hanzi: '好的，先这些，谢谢！',
        pinyin: 'Hǎo de, xiān zhèxiē, xièxie!',
        meaning: 'Được rồi, trước mắt cứ bấy nhiêu đã, cảm ơn bạn!'
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Hỏi đường đi tàu điện ngầm',
    scenario: 'Bạn đang ở Thượng Hải và cần tìm trạm tàu điện ngầm gần nhất.',
    aiName: 'Bác Vương (王大伯)',
    aiRole: 'Cư dân Thượng Hải nhiệt tình',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2345B97C"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">王</text></svg>',
    dialogue: [
      {
        speaker: 'user',
        hanzi: '您好，打扰一下，请问最近的地铁站在哪里？',
        pinyin: 'Nǐn hǎo, dǎrǎo yíxià, qǐngwèn zuìjìn de dìtiězhan zài nǎlǐ?',
        meaning: 'Chào bác, xin làm phiền một chút, cho cháu hỏi ga tàu điện ngầm gần nhất ở đâu ạ?'
      },
      {
        speaker: 'ai',
        hanzi: '哦，地铁站啊！你往前直走，过两个红绿灯向右拐，就能看到2号线入口了。',
        pinyin: 'Ó, dìtiězhàn a! Nǐ wǎng qián zhí zǒu, guò liǎng gè hónglǜdēng xiàng yòu guǎi, jiù néng kàndào èr hào xiàn rùkǒu le.',
        meaning: 'Ồ, ga tàu điện ngầm à! Cháu cứ đi thẳng phía trước, qua 2 cột đèn xanh đỏ rồi rẽ phải là thấy lối vào tuyến số 2 ngay.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '走过去大概需要几分钟？',
        pinyin: 'Zǒu guòqù dàgài xūyào jǐ fēnzhōng?',
        meaning: 'Đi bộ qua đó mất khoảng mấy phút ạ?'
      },
      {
        hanzi: '太感谢您了，祝您生活愉快！',
        pinyin: 'Tài gǎnxiè nín le, zhù nín shēnghuó yúkuài!',
        meaning: 'Cháu vô cùng cảm ơn bác, chúc bác một ngày vui vẻ ạ!'
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Mua sắm & Trả giá (砍价)',
    scenario: 'Bạn đang chọn mua một chiếc áo khoác tại chợ đầu mối thời trang Quảng Châu.',
    aiName: 'Chị Lý Chủ Shop (李老板)',
    aiRole: 'Chủ cửa hàng quần áo',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23EC4899"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">李</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '帅哥/美女，来看一下新款外套！质量非常好，你穿肯定好看。',
        pinyin: 'Shuàigē/Měinǚ, lái kàn yíxià xīnkuǎn wàitào! Zhìliàng fēicháng hǎo, nǐ chuān kěndìng hǎokàn.',
        meaning: 'Soái ca/mỹ nữ ơi, vào xem mẫu áo khoác mới này! Chất lượng tốt lắm, bạn mặc đảm bảo đẹp.'
      },
      {
        speaker: 'user',
        hanzi: '老板，这件黑色外套多少钱一件？',
        pinyin: 'Lǎobǎn, zhè jiàn hēisè wàitào duōshao qián yí jiàn?',
        meaning: 'Chị chủ ơi, chiếc áo khoác đen này giá bao nhiêu tiền một chiếc thế?'
      },
      {
        speaker: 'ai',
        hanzi: '这件原价两百块，今天看你合眼缘，给你优惠一百六十块。',
        pinyin: 'Zhè jiàn yuánjià liǎng bǎi kuài, jīntiān kàn nǐ hé yǎnyuán, gěi nǐ yōuhuì yì bǎi liùshí kuài.',
        meaning: 'Chiếc này giá gốc 200 tệ, hôm nay thấy bạn có duyên, giảm giá ưu đãi cho bạn 160 tệ.'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '一百块怎么样？如果可以我就买两件。',
        pinyin: 'Yì bǎi kuài zěnmeyàng? Rúguǒ kěyǐ wǒ jiù mǎi liǎng jiàn.',
        meaning: '100 tệ được không chị? Nếu được em mua luôn 2 chiếc.'
      },
      {
        hanzi: '能不能便宜一点？我真心想买。',
        pinyin: 'Néng bu néng piányi yìdiǎn? Wǒ zhēnxīn xiǎng mǎi.',
        meaning: 'Có thể bớt thêm một chút được không? Em thật lòng muốn mua.'
      }
    ]
  },
  {
    id: 'conv-free',
    title: 'Trò chuyện tự do cùng Tiểu Hàm (自由对话)',
    scenario: 'Không gian mở để bạn thoải mái trò chuyện bất kỳ chủ đề nào bằng tiếng Trung.',
    aiName: 'Tiểu Hàm (小涵 AI)',
    aiRole: 'Gia sư AI đồng hành thông minh',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366F1"/><text x="50%" y="54%" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">AI</text></svg>',
    dialogue: [
      {
        speaker: 'ai',
        hanzi: '你好！我是你的中文AI伙伴小涵。今天过得怎么样？你想聊些什么话题呢？',
        pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén AI huǒbàn Xiǎohán. Jīntiān guò de zěnmeyàng? Nǐ xiǎng liáo xiē shénme huàtí ne?',
        meaning: 'Chào bạn! Mình là Tiểu Hàm - người bạn AI tiếng Trung của bạn. Hôm nay bạn thế nào? Bạn muốn trò chuyện về chủ đề gì nào?'
      }
    ],
    suggestedReplies: [
      {
        hanzi: '今天天气很好，我刚下班。',
        pinyin: 'Jīntiān tiānqì hěn hǎo, wǒ gāng xiàbān.',
        meaning: 'Hôm nay thời tiết rất đẹp, mình vừa tan ca làm.'
      },
      {
        hanzi: '我想跟你练习一下中文自我介绍。',
        pinyin: 'Wǒ xiǎng gēn nǐ liànxí yíxià Zhōngwén zìwǒ jièshào.',
        meaning: 'Mình muốn cùng bạn luyện tập bài tự giới thiệu bản thân bằng tiếng Trung.'
      },
      {
        hanzi: '中国有什么好玩的旅游景点吗？',
        pinyin: 'Zhōngguó yǒu shénme hǎowán de lǚyóu jǐngdiǎn ma?',
        meaning: 'Trung Quốc có địa điểm du lịch nào thú vị để đi chơi không?'
      }
    ]
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 'system-welcome',
    author: 'Ban Quản Trị HanziGo',
    avatar: null,
    initial: 'HZ',
    level: 'BQT',
    time: 'Ghim đầu trang',
    tag: '#KinhNghiemHoc',
    content: 'Chào mừng các bạn học viên đến với Không gian Cộng đồng HanziGo! 🌟 Đây là nơi giao lưu học hỏi, giải đáp thắc mắc ngữ pháp, tìm bạn cùng luyện phản xạ khẩu ngữ và tham gia các thử thách học tập. Hãy đăng câu hỏi hoặc cảm nhận học tập đầu tiên của bạn ở khung phía trên nhé! 🇨🇳🇻🇳✨',
    likes: 1,
    liked: false,
    saved: false,
    isPinned: true,
    comments: [
      {
        id: 'c1',
        author: 'Trợ lý học tập HanziGo',
        content: 'Mẹo nhỏ: Bạn có thể chọn thẻ chủ đề #HoiDapNguPhap hoặc #TimBanLuyenNoi để mọi người dễ dàng tìm thấy bài viết của bạn hơn!',
        time: 'Vừa xong'
      }
    ]
  }
];

export const USER_ACHIEVEMENTS = [
  {
    id: 'first-step',
    name: 'Khởi đầu Hanzi',
    desc: 'Hoàn thành bài học tương tác đầu tiên',
    icon: '🌱',
    unlocked: false,
    date: null
  },
  {
    id: 'streak-7',
    name: 'Chuỗi 7 Ngày Rực Lửa',
    desc: 'Học liên tiếp 7 ngày không gián đoạn',
    icon: '🔥',
    unlocked: false,
    date: null
  },
  {
    id: 'pinyin-master',
    name: 'Bậc thầy Pinyin',
    desc: 'Phát âm chuẩn 100% bảng thanh điệu',
    icon: '🗣️',
    unlocked: false,
    date: null
  },
  {
    id: 'vocab-100',
    name: 'Kỵ sĩ Từ Vựng',
    desc: 'Ghi nhớ vững chắc 100 từ vựng HSK 1',
    icon: '📚',
    unlocked: false,
    date: null
  },
  {
    id: 'calligraphy',
    name: 'Nét Chữ Phượng Múa',
    desc: 'Luyện viết 20 chữ Hán đạt điểm > 90',
    icon: '🖌️',
    unlocked: false,
    date: null
  },
  {
    id: 'conversation-star',
    name: 'Ngôi sao Hội thoại',
    desc: 'Hoàn thành 5 màn đối thoại cùng AI Tiểu Hàm',
    icon: '💬',
    unlocked: false,
    date: null
  },
  {
    id: 'hsk1-pass',
    name: 'Chinh phục HSK 1',
    desc: 'Vượt qua bài thi thử HSK 1 với điểm số > 180',
    icon: '🏆',
    unlocked: false,
    date: null
  },
  {
    id: 'night-owl',
    name: 'Cú Đêm Chăm Học',
    desc: 'Học tập sau 22h đêm trong 3 ngày liên tiếp',
    icon: '🌙',
    unlocked: false,
    date: null
  }
];
