// =========================================================================
// HANZIGO COMPREHENSIVE LEARNING PATH DATASET
// 6 Levels | 24 Chapters | Pedagogical 9-Step Lessons | Boss Challenges
// =========================================================================

export const LEARNING_LEVELS = [
  {
    id: 'lvl-1',
    levelNumber: 1,
    code: 'LVL 1',
    name: 'Khởi động',
    chineseName: '中文启程',
    tagline: 'Bắt đầu hành trình tiếng Trung',
    description: 'Làm quen tiếng Trung, Pinyin, 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu, thanh nhẹ, biến điệu và nét chữ Hán cơ bản.',
    color: '#45B97C',
    lightColor: '#EBF8F2',
    darkBg: '#162B21',
    icon: '🌱',
    targetAudience: 'Người chưa biết gì hoặc muốn chuẩn hóa phát âm',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 1600
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    code: 'LVL 2',
    name: 'Sinh tồn',
    chineseName: '日常中文',
    tagline: 'Tiếng Trung đời thường',
    description: 'Giao tiếp sinh hoạt cơ bản: Chào hỏi, giới thiệu bản thân, số đếm, mua sắm, gọi món, thời gian, đi lại và hỏi đường.',
    color: '#F4B942',
    lightColor: '#FEF8EA',
    darkBg: '#2E230B',
    icon: '🌿',
    targetAudience: 'Có thể tự tin xử lý mọi tình huống sinh hoạt hàng ngày',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 1800
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    code: 'LVL 3',
    name: 'Nền tảng',
    chineseName: '中文基础',
    tagline: 'Nền tảng tiếng Trung',
    description: 'Từ vựng cốt lõi, ngữ pháp, lượng từ, so sánh, phủ định, câu chữ 把, bị động chữ 被, giúp người học tự tạo câu độc lập.',
    color: '#3B82F6',
    lightColor: '#EFF6FF',
    darkBg: '#13233D',
    icon: '🌳',
    targetAudience: 'Nắm chắc ngữ pháp để tự ghép câu thay vì học vẹt mẫu câu',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2000
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    code: 'LVL 4',
    name: 'Giao tiếp',
    chineseName: '真实交流',
    tagline: 'Giao tiếp thực tế',
    description: 'Listening, Speaking, Shadowing, phản xạ hội thoại: Đi du lịch, đặt phòng khách sạn, gọi điện thoại, mua sắm online Taobao/1688.',
    color: '#E85D3F',
    lightColor: '#FDEEEB',
    darkBg: '#2D1E1B',
    icon: '🎤',
    targetAudience: 'Tăng tốc độ phản xạ nghe nói tự nhiên không cần dịch nhẩm',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2200
  },
  {
    id: 'lvl-5',
    levelNumber: 5,
    code: 'LVL 5',
    name: 'Đời sống Trung Quốc',
    chineseName: '中国生活',
    tagline: 'Cuộc sống Trung Quốc',
    description: 'Văn hóa, mạng xã hội Douyin/Weibo, ẩm thực 8 đại trường phái, internet slang, thành ngữ quen thuộc, giao tiếp chuẩn bản xứ.',
    color: '#8B5CF6',
    lightColor: '#F5F3FF',
    darkBg: '#231B38',
    icon: '🌏',
    targetAudience: 'Hiểu cách người bản xứ nói chuyện trong đời thực và trên mạng',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2400
  },
  {
    id: 'lvl-6',
    levelNumber: 6,
    code: 'LVL 6',
    name: 'Chinese Master',
    chineseName: '中文大师',
    tagline: 'Bậc thầy tiếng Trung',
    description: 'Thành ngữ kinh điển, đàm phán thương mại, phỏng vấn xin việc, đọc báo tài chính, chinh phục HSK 4-6 chuyên sâu.',
    color: '#E11D48',
    lightColor: '#FFF1F2',
    darkBg: '#36131B',
    icon: '🐉',
    targetAudience: 'Sử dụng tiếng Trung thành thạo trong học thuật và công việc',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2600
  }
];

export const LEARNING_CHAPTERS = [
  // --- LEVEL 1 (Chapters 1-4) ---
  {
    id: 'ch-1',
    levelId: 'lvl-1',
    chapterNumber: 1,
    title: 'Pinyin & 4 Thanh điệu căn bản',
    chineseTitle: '拼音与四声',
    desc: 'Làm quen hệ thống ngữ âm: Thanh mẫu b, p, m, f, d, t, n, l và 4 cao độ thanh điệu chuẩn Bắc Kinh.',
    lessonIds: ['l-101', 'l-102', 'l-103', 'l-104', 'l-105'],
    bossId: 'boss-ch-1'
  },
  {
    id: 'ch-2',
    levelId: 'lvl-1',
    chapterNumber: 2,
    title: 'Vận mẫu & Âm uốn lưỡi Er',
    chineseTitle: '韵母与儿化音',
    desc: 'Bảng vận mẫu đơn (a, o, e, i, u, ü), vận mẫu kép (ai, ei, ao, ou) và âm uốn lưỡi tạo ngữ điệu bản ngữ.',
    lessonIds: ['l-106', 'l-107', 'l-108', 'l-109', 'l-110'],
    bossId: 'boss-ch-2'
  },
  {
    id: 'ch-3',
    levelId: 'lvl-1',
    chapterNumber: 3,
    title: 'Quy tắc biến điệu quan trọng',
    chineseTitle: '变调规则',
    desc: 'Nắm chắc bí kíp biến điệu hai thanh 3, biến điệu chữ 不 (bù), 一 (yī) và quy tắc thanh nhẹ.',
    lessonIds: ['l-111', 'l-112', 'l-113', 'l-114', 'l-115'],
    bossId: 'boss-ch-3'
  },
  {
    id: 'ch-4',
    levelId: 'lvl-1',
    chapterNumber: 4,
    title: 'Nét chữ Hán & 20 Bộ thủ thần thánh',
    chineseTitle: '汉字笔画与部首',
    desc: '8 nét cơ bản, 7 quy tắc thuận bút chữ Hán và 20 bộ thủ phổ biến nhất giúp đoán nhanh ý nghĩa.',
    lessonIds: ['l-116', 'l-117', 'l-118', 'l-119', 'l-120'],
    bossId: 'boss-ch-4'
  },

  // --- LEVEL 2 (Chapters 5-8) ---
  {
    id: 'ch-5',
    levelId: 'lvl-2',
    chapterNumber: 5,
    title: 'Chào hỏi & Giới thiệu bản thân',
    chineseTitle: '问好与自我介绍',
    desc: 'Làm quen bạn bè, chào hỏi lịch sự, xưng hô tên tuổi, quốc tịch và nghề nghiệp.',
    lessonIds: ['l-201', 'l-202', 'l-203', 'l-204', 'l-205'],
    bossId: 'boss-ch-5'
  },
  {
    id: 'ch-6',
    levelId: 'lvl-2',
    chapterNumber: 6,
    title: 'Con số, Mua sắm & Hỏi giá',
    chineseTitle: '数字、购物与询价',
    desc: 'Đếm số 1-100, hỏi giá tiền (多少钱), mua hoa quả và kỹ năng mặc cả cơ bản.',
    lessonIds: ['l-206', 'l-207', 'l-208', 'l-209', 'l-210'],
    bossId: 'boss-ch-6'
  },
  {
    id: 'ch-7',
    levelId: 'lvl-2',
    chapterNumber: 7,
    title: 'Ăn uống & Gọi món nhà hàng',
    chineseTitle: '餐饮与餐厅点菜',
    desc: 'Đọc thực đơn, gọi món quen thuộc, yêu cầu khẩu vị (ít cay, không rau mùi) và thanh toán.',
    lessonIds: ['l-211', 'l-212', 'l-213', 'l-214', 'l-215'],
    bossId: 'boss-ch-7'
  },
  {
    id: 'ch-8',
    levelId: 'lvl-2',
    chapterNumber: 8,
    title: 'Đi lại & Hỏi đường',
    chineseTitle: '交通与问路',
    desc: 'Phương hướng đông tây nam bắc, rẽ trái phải, đi thẳng, đi xe bus và bắt taxi.',
    lessonIds: ['l-216', 'l-217', 'l-218', 'l-219', 'l-220'],
    bossId: 'boss-ch-8'
  },

  // --- LEVEL 3 (Chapters 9-12) ---
  {
    id: 'ch-9',
    levelId: 'lvl-3',
    chapterNumber: 9,
    title: 'Lượng từ & Cấu trúc số lượng',
    chineseTitle: '量词与数量结构',
    desc: 'Lượng từ quen thuộc: 个, 本, 支, 杯, 张, 件 và cách kết hợp đúng chuẩn.',
    lessonIds: ['l-301', 'l-302', 'l-303', 'l-304', 'l-305'],
    bossId: 'boss-ch-9'
  },
  {
    id: 'ch-10',
    levelId: 'lvl-3',
    chapterNumber: 10,
    title: 'Thời gian, Ngày tháng & Lịch trình',
    chineseTitle: '时间、日期与日程',
    desc: 'Diễn đạt giờ phút, ngày tháng năm, thứ trong tuần và sắp xếp lịch hẹn.',
    lessonIds: ['l-306', 'l-307', 'l-308', 'l-309', 'l-310'],
    bossId: 'boss-ch-10'
  },
  {
    id: 'ch-11',
    levelId: 'lvl-3',
    chapterNumber: 11,
    title: 'Câu so sánh chữ 比 & Phủ định đa dạng',
    chineseTitle: '比较句与否定表达',
    desc: 'So sánh hơn, so sánh bằng, 不 vs 没 và cách biểu đạt mức độ.',
    lessonIds: ['l-311', 'l-312', 'l-313', 'l-314', 'l-315'],
    bossId: 'boss-ch-11'
  },
  {
    id: 'ch-12',
    levelId: 'lvl-3',
    chapterNumber: 12,
    title: 'Câu ghép & Liên từ logic',
    chineseTitle: '复句与关联词',
    desc: 'Bởi vì...cho nên..., Mặc dù...nhưng..., Không những...mà còn...',
    lessonIds: ['l-316', 'l-317', 'l-318', 'l-319', 'l-320'],
    bossId: 'boss-ch-12'
  },

  // --- LEVEL 4 (Chapters 13-16) ---
  {
    id: 'ch-13',
    levelId: 'lvl-4',
    chapterNumber: 13,
    title: 'Gặp gỡ, Kết bạn & Đàm thoại phản xạ',
    chineseTitle: '社交交友与即时对话',
    desc: 'Trò chuyện sở thích, hẹn đi xem phim, đi cà phê và giữ liên lạc qua WeChat.',
    lessonIds: ['l-401', 'l-402', 'l-403', 'l-404', 'l-405'],
    bossId: 'boss-ch-13'
  },
  {
    id: 'ch-14',
    levelId: 'lvl-4',
    chapterNumber: 14,
    title: 'Du lịch tự túc & Khách sạn',
    chineseTitle: '自由行与酒店入住',
    desc: 'Đặt phòng online, check-in khách sạn, đổi ngoại tệ và hỏi tiện ích dịch vụ.',
    lessonIds: ['l-406', 'l-407', 'l-408', 'l-409', 'l-410'],
    bossId: 'boss-ch-14'
  },
  {
    id: 'ch-15',
    levelId: 'lvl-4',
    chapterNumber: 15,
    title: 'Điện thoại & Đặt lịch công việc',
    chineseTitle: '商务通话与预约',
    desc: 'Mẫu câu nghe gọi điện thoại, để lại tin nhắn, xác nhận giờ họp đối tác.',
    lessonIds: ['l-411', 'l-412', 'l-413', 'l-414', 'l-415'],
    bossId: 'boss-ch-15'
  },
  {
    id: 'ch-16',
    levelId: 'lvl-4',
    chapterNumber: 16,
    title: 'Thương mại số Taobao & WeChat Pay',
    chineseTitle: '网购与移动支付',
    desc: 'Nhắn tin với chủ shop 客服, hỏi mã vận đơn, áp mã giảm giá và đổi trả hàng.',
    lessonIds: ['l-416', 'l-417', 'l-418', 'l-419', 'l-420'],
    bossId: 'boss-ch-16'
  },

  // --- LEVEL 5 (Chapters 17-20) ---
  {
    id: 'ch-17',
    levelId: 'lvl-5',
    chapterNumber: 17,
    title: 'Ẩm thực 8 trường phái & Trà đạo',
    chineseTitle: '八大菜系与茶文化',
    desc: 'Khám phá văn hóa ẩm thực Tứ Xuyên, Quảng Đông, văn hóa uống trà và nghi thức bàn ăn.',
    lessonIds: ['l-501', 'l-502', 'l-503', 'l-504', 'l-505'],
    bossId: 'boss-ch-17'
  },
  {
    id: 'ch-18',
    levelId: 'lvl-5',
    chapterNumber: 18,
    title: 'Ngôn ngữ mạng & Douyin Slang',
    chineseTitle: '网络流行语与短视频',
    desc: 'Các từ lóng cực hot: 666, YYDS, 种草, 躺平 và cách bình luận video tự nhiên.',
    lessonIds: ['l-506', 'l-507', 'l-508', 'l-509', 'l-510'],
    bossId: 'boss-ch-18'
  },
  {
    id: 'ch-19',
    levelId: 'lvl-5',
    chapterNumber: 19,
    title: 'Lễ hội truyền thống & Phong tục',
    chineseTitle: '传统节日与民俗',
    desc: 'Tết Nguyên Đán, Trung Thu, Tết Đoan Ngọ, phong bao lì xì và chúc Tết đúng nghi lễ.',
    lessonIds: ['l-511', 'l-512', 'l-513', 'l-514', 'l-515'],
    bossId: 'boss-ch-19'
  },
  {
    id: 'ch-20',
    levelId: 'lvl-5',
    chapterNumber: 20,
    title: 'Xử lý tình huống y tế & Bệnh viện',
    chineseTitle: '医院看病与应急',
    desc: 'Đăng ký sổ khám bệnh, miêu tả triệu chứng dị ứng, cảm sốt, mua thuốc tại quầy.',
    lessonIds: ['l-516', 'l-517', 'l-518', 'l-519', 'l-520'],
    bossId: 'boss-ch-20'
  },

  // --- LEVEL 6 (Chapters 21-24) ---
  {
    id: 'ch-21',
    levelId: 'lvl-6',
    chapterNumber: 21,
    title: 'Thành ngữ 4 chữ kinh điển (成语)',
    chineseTitle: '经典成语与典故',
    desc: 'Nắm chắc 50 thành ngữ 4 chữ thông dụng trong văn nói trang trọng và bài thi HSK.',
    lessonIds: ['l-601', 'l-602', 'l-603', 'l-604', 'l-605'],
    bossId: 'boss-ch-21'
  },
  {
    id: 'ch-22',
    levelId: 'lvl-6',
    chapterNumber: 22,
    title: 'Phỏng vấn xin việc & Viết CV',
    chineseTitle: '面试与中文简历',
    desc: 'Giới thiệu kỹ năng chuyên môn, kinh nghiệm thực tập, đàm phán mức lương và phúc lợi.',
    lessonIds: ['l-606', 'l-607', 'l-608', 'l-609', 'l-610'],
    bossId: 'boss-ch-22'
  },
  {
    id: 'ch-23',
    levelId: 'lvl-6',
    chapterNumber: 23,
    title: 'Đàm phán thương mại & Hợp đồng',
    chineseTitle: '商务谈判与合同',
    desc: 'Điều khoản giao hàng, thỏa thuận thanh toán LC/T/T và biên bản ghi nhớ hợp tác.',
    lessonIds: ['l-611', 'l-612', 'l-613', 'l-614', 'l-615'],
    bossId: 'boss-ch-23'
  },
  {
    id: 'ch-24',
    levelId: 'lvl-6',
    chapterNumber: 24,
    title: 'Đọc báo tài chính & Chinh phục HSK Cao cấp',
    chineseTitle: '财经新闻与高级表达',
    desc: 'Đọc báo Nhân Dân, Tân Hoa Xã, thảo luận kinh tế số và chiến lược đạt điểm cao HSK 5-6.',
    lessonIds: ['l-616', 'l-617', 'l-618', 'l-619', 'l-620'],
    bossId: 'boss-ch-24'
  }
];

// =========================================================================
// FLAGSHIP LESSONS (Full 9-Step Pedagogical Architecture)
// =========================================================================
export const LEARNING_LESSONS = [
  // --- LESSON 1-1 (ID: l-101) ---
  {
    id: 'l-101',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 1,
    title: 'Thanh mẫu b, p, m, f & 4 Thanh điệu',
    chineseTitle: '声母与四声',
    subtitle: 'Nắm vững 4 âm môi và 4 cao độ thanh điệu - nền móng của phát âm chuẩn.',
    durationMinutes: 18,
    xpReward: 50,
    tags: ['Phát âm', 'Pinyin', 'Thanh điệu'],

    // STEP 1: 📖 LEARN
    step1_learn: {
      topic: '4 Thanh điệu trong tiếng Trung (四声)',
      summary: 'Tiếng Trung là ngôn ngữ có thanh điệu. Một âm tiết khi đổi thanh điệu sẽ mang nghĩa hoàn toàn khác nhau.',
      toneGuide: [
        { tone: 1, name: 'Thanh 1 (Âm bình)', pitch: '5-5', symbol: 'ā', desc: 'Cao và phẳng, giữ đều hơi', example: 'mā (Mẹ)' },
        { tone: 2, name: 'Thanh 2 (Dương bình)', pitch: '3-5', symbol: 'á', desc: 'Từ vừa lên cao, giống dấu sắc tiếng Việt', example: 'má (Cây gai)' },
        { tone: 3, name: 'Thanh 3 (Thượng thanh)', pitch: '2-1-4', symbol: 'ǎ', desc: 'Hạ thấp rồi hơi vút lên', example: 'mǎ (Ngựa)' },
        { tone: 4, name: 'Thanh 4 (Khứ thanh)', pitch: '5-1', symbol: 'à', desc: 'Từ cao rơi dứt khoát xuống thấp, ngắn mạnh', example: 'mà (Mắng)' }
      ],
      initialsGuide: [
        { char: 'b', read: 'Giống chữ [P] nhẹ tiếng Việt, không bật hơi', example: 'bā (Số 8)' },
        { char: 'p', read: 'Bật hơi mạnh luồng gió từ môi (bật bung hơi)', example: 'pà (Sợ)' },
        { char: 'm', read: 'Giống chữ [M] tiếng Việt', example: 'mā (Mẹ)' },
        { char: 'f', read: 'Giống chữ [Ph] tiếng Việt', example: 'fā (Phát ra)' }
      ],
      audioDemoText: 'bā pá mǎ mà'
    },

    // STEP 2: 🧠 VOCABULARY
    step2_vocabulary: [
      {
        id: 'v-101-1',
        hanzi: '八',
        pinyin: 'bā',
        hanviet: 'Bát',
        meaning: 'Số 8',
        audioText: '八',
        radical: '八 (Bát)',
        example: {
          hanzi: '我有八本书。',
          pinyin: 'Wǒ yǒu bā běn shū.',
          meaning: 'Tôi có tám quyển sách.'
        }
      },
      {
        id: 'v-101-2',
        hanzi: '爸爸',
        pinyin: 'bàba',
        hanviet: 'Ba ba',
        meaning: 'Bố, ba',
        audioText: '爸爸',
        radical: '父 (Phụ)',
        example: {
          hanzi: '爸爸喜欢喝茶。',
          pinyin: 'Bàba xǐhuan hē chá.',
          meaning: 'Bố thích uống trà.'
        }
      },
      {
        id: 'v-101-3',
        hanzi: '妈妈',
        pinyin: 'māma',
        hanviet: 'Ma ma',
        meaning: 'Mẹ, má',
        audioText: '妈妈',
        radical: '女 (Nữ)',
        example: {
          hanzi: '妈妈爱我。',
          pinyin: 'Māma ài wǒ.',
          meaning: 'Mẹ yêu tôi.'
        }
      },
      {
        id: 'v-101-4',
        hanzi: '不',
        pinyin: 'bù',
        hanviet: 'Bất',
        meaning: 'Không (phủ định)',
        audioText: '不',
        radical: '一 (Nhất)',
        example: {
          hanzi: '我不去。',
          pinyin: 'Wǒ bú qù.',
          meaning: 'Tôi không đi.'
        }
      }
    ],

    // STEP 3: 🀄 HANZI
    step3_hanzi: [
      {
        hanzi: '八',
        pinyin: 'bā',
        meaning: 'Số 8',
        strokesCount: 2,
        strokeOrderText: 'Phẩy trước (丿), mác sau (乀)',
        components: 'Tách rời nhau, không chạm đỉnh',
        mnemonic: 'Hình ảnh hai bàn tay xòe ra tạo thành số 8 may mắn.'
      },
      {
        hanzi: '不',
        pinyin: 'bù',
        meaning: 'Không',
        strokesCount: 4,
        strokeOrderText: 'Ngang (一) -> Phẩy (丿) -> Sổ (丨) -> Chấm (丶)',
        components: 'Chữ 一 ở trên, phía dưới là ba nét tỏa ra',
        mnemonic: 'Hình ảnh con chim bay vút lên trời cao không bao giờ quay lại.'
      }
    ],

    // STEP 4: 📚 GRAMMAR
    step4_grammar: {
      formula: 'Chủ ngữ + 不 (bù) + Động từ / Tính từ',
      title: 'Phủ định đơn giản với chữ 不 (bù)',
      explanation: 'Trong tiếng Trung, chữ 不 (bù) đứng trước động từ hoặc tính từ để tạo thành câu phủ định "không làm gì" hoặc "không như thế nào".',
      examples: [
        { hanzi: '我不吃。', pinyin: 'Wǒ bù chī.', meaning: 'Tôi không ăn.' },
        { hanzi: '他不累。', pinyin: 'Tā bú lèi.', meaning: 'Anh ấy không mệt.' },
        { hanzi: '今天不冷。', pinyin: 'Jīntiān bù lěng.', meaning: 'Hôm nay không lạnh.' }
      ],
      commonMistake: {
        wrong: '我吃不。',
        correct: '我不吃。',
        explanation: 'Từ phủ định 不 phải luôn đứng TRƯỚC động từ, không được đặt ở cuối câu như tiếng Việt "Tôi ăn không".'
      }
    },

    // STEP 5: 🎧 LISTENING
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '爸爸，你累吗？', pinyin: 'Bàba, nǐ lèi ma?', meaning: 'Bố ơi, bố mệt không?' },
        { speaker: 'B', hanzi: '我不累，谢谢你！', pinyin: 'Wǒ bú lèi, xièxie nǐ!', meaning: 'Bố không mệt, cảm ơn con!' }
      ],
      audioText: '爸爸，你累吗？我不累，谢谢你！',
      question: 'Trong đoạn đối thoại, người bố trả lời thế nào?',
      options: ['Bố rất mệt', 'Bố không mệt', 'Bố muốn đi ngủ', 'Bố đang bận'],
      correctIndex: 1,
      explanation: 'Người bố nói "我不累" (Wǒ bú lèi) nghĩa là "Bố không mệt".'
    },

    // STEP 6: 🗣️ SPEAKING
    step6_speaking: {
      prompt: 'A: 你累吗？ (Nǐ lèi ma? - Bạn có mệt không?)',
      targetSentence: '我不累。',
      targetPinyin: 'Wǒ bú lèi.',
      targetMeaning: 'Tôi không mệt.',
      hint: 'Hãy nhấn micro và trả lời rõ ràng: "Wǒ bú lèi".'
    },

    // STEP 7: ✍️ WRITING
    step7_writing: {
      prompt: 'Ghép các từ sau thành câu hoàn chỉnh có nghĩa: "Bố tôi không mệt."',
      words: ['累', '爸爸', '我', '不'],
      correctOrder: ['我', '爸爸', '不', '累'],
      explanation: 'Thứ tự đúng: 我 (Tôi) + 爸爸 (Bố) + 不 (Không) + 累 (Mệt).'
    },

    // STEP 8: 🎯 QUIZ
    step8_quiz: [
      {
        id: 'q-101-1',
        type: 'multiple-choice',
        question: 'Thanh mẫu "p" trong Pinyin phát âm như thế nào?',
        options: [
          'Giống chữ "P" bình thường không bật hơi',
          'Bật luồng hơi mạnh từ hai môi ra ngoài',
          'Phát âm giống chữ "B"',
          'Phát âm giống chữ "M"'
        ],
        correctIndex: 1,
        explanation: 'Âm "p" là âm bật hơi (bật bung luồng gió mạnh từ khoang miệng).'
      },
      {
        id: 'q-101-2',
        type: 'listening',
        audioText: 'māma',
        question: 'Nghe đoạn âm thanh sau và chọn chữ Hán tương ứng:',
        options: ['爸爸', '妈妈', '八', '不'],
        correctIndex: 1,
        explanation: 'Âm thanh đọc là "māma" tương ứng chữ Hán 妈妈 (Mẹ).'
      },
      {
        id: 'q-101-3',
        type: 'fill-in',
        question: 'Điền từ phủ định thích hợp vào chỗ trống: 我 ___ 累。(Tôi không mệt)',
        options: ['不', '八', '爸', '妈'],
        correctIndex: 0,
        explanation: 'Chữ 不 (bù) đứng trước tính từ 累 (mệt) để mang nghĩa phủ định.'
      }
    ],

    // STEP 9: 🔥 REAL-WORLD CHALLENGE
    step9_challenge: {
      title: 'Thử thách phát âm 4 thanh điệu chuẩn xác',
      taskDesc: 'Đọc to 4 thanh điệu của âm "ma" liên tiếp: mā - má - mǎ - mà trong vòng 10 giây.',
      xpReward: 50,
      badge: 'Bậc Thầy Thanh Điệu Sơ Cấp'
    }
  },

  // --- LESSON 1-2 (ID: l-102) ---
  {
    id: 'l-102',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 2,
    title: 'Thanh mẫu d, t, n, l & Lời chào cơ bản',
    chineseTitle: '声母与基本问好',
    subtitle: 'Học nhóm âm đầu lưỡi và cách nói câu chào kinh điển "你好" (Nǐ hǎo).',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['Chào hỏi', 'Phát âm', 'Nền tảng'],

    step1_learn: {
      topic: 'Nhóm thanh mẫu đầu lưỡi: d, t, n, l',
      summary: 'Nhóm âm này phát âm bằng cách đặt đầu lưỡi chạm vào lợi trên.',
      initialsGuide: [
        { char: 'd', read: 'Đọc giống chữ [T] tiếng Việt (không bật hơi)', example: 'dà (To lớn)' },
        { char: 't', read: 'Đọc giống chữ [Th] tiếng Việt (bật hơi mạnh)', example: 'tā (Anh ấy)' },
        { char: 'n', read: 'Đọc giống chữ [N] tiếng Việt', example: 'nǐ (Bạn)' },
        { char: 'l', read: 'Đọc giống chữ [L] tiếng Việt', example: 'lǎo (Già, kỳ cựu)' }
      ],
      toneGuide: [
        { tone: 1, name: 'Lời chào 你好', desc: '你 (nǐ - thanh 3) + 好 (hǎo - thanh 3) -> Biến điệu thành [ní hǎo].', example: '你好！' }
      ],
      audioDemoText: 'dà tā nǐ lǎo'
    },

    step2_vocabulary: [
      {
        id: 'v-102-1',
        hanzi: '你',
        pinyin: 'nǐ',
        hanviet: 'Nhĩ',
        meaning: 'Bạn, anh, chị (ngôi thứ 2)',
        audioText: '你',
        radical: '亻 (Nhân đứng)',
        example: {
          hanzi: '你好吗？',
          pinyin: 'Nǐ hǎo ma?',
          meaning: 'Bạn khỏe không?'
        }
      },
      {
        id: 'v-102-2',
        hanzi: '好',
        pinyin: 'hǎo',
        hanviet: 'Hảo',
        meaning: 'Tốt, đẹp, khỏe',
        audioText: '好',
        radical: '女 (Nữ)',
        example: {
          hanzi: '这本书很好。',
          pinyin: 'Zhè běn shū hěn hǎo.',
          meaning: 'Quyển sách này rất hay.'
        }
      },
      {
        id: 'v-102-3',
        hanzi: '大',
        pinyin: 'dà',
        hanviet: 'Đại',
        meaning: 'To, lớn',
        audioText: '大',
        radical: '大 (Đại)',
        example: {
          hanzi: '学校很大。',
          pinyin: 'Xuéxiào hěn dà.',
          meaning: 'Trường học rất to.'
        }
      },
      {
        id: 'v-102-4',
        hanzi: '他',
        pinyin: 'tā',
        hanviet: 'Tha',
        meaning: 'Anh ấy, cậu ấy (ngôi thứ 3 nam)',
        audioText: '他',
        radical: '亻 (Nhân đứng)',
        example: {
          hanzi: '他是我的朋友。',
          pinyin: 'Tā shì wǒ de péngyou.',
          meaning: 'Anh ấy là bạn của tôi.'
        }
      }
    ],

    step3_hanzi: [
      {
        hanzi: '好',
        pinyin: 'hǎo',
        meaning: 'Tốt, đẹp',
        strokesCount: 6,
        strokeOrderText: 'Nét chữ 女 bên trái trước, nét chữ 子 bên phải sau',
        components: 'Bộ Nữ (女) kết hợp với bộ Tử (子 - con trai)',
        mnemonic: 'Người phụ nữ (女) sinh được con (子) là điều tốt lành, vẹn tròn (好).'
      },
      {
        hanzi: '大',
        pinyin: 'dà',
        meaning: 'To, lớn',
        strokesCount: 3,
        strokeOrderText: 'Ngang (一) -> Phẩy (丿) -> Mác (乀)',
        components: 'Bộ Đại (大)',
        mnemonic: 'Hình ảnh một người dang rộng hai tay và hai chân để thể hiện sự to lớn.'
      }
    ],

    step4_grammar: {
      formula: '你 (Nǐ) + 好 (Hǎo) = Xin chào!',
      title: 'Biến điệu hai thanh 3 trong 你好',
      explanation: 'Khi hai thanh 3 đứng liền kề nhau, thanh 3 thứ nhất bắt buộc biến âm thành thanh 2. Vì vậy "nǐ hǎo" luôn được phát âm là "ní hǎo".',
      examples: [
        { hanzi: '你好！', pinyin: 'Ní hǎo!', meaning: 'Xin chào bạn!' },
        { hanzi: '你好吗？', pinyin: 'Ní hǎo ma?', meaning: 'Bạn có khỏe không?' }
      ],
      commonMistake: {
        wrong: 'Đọc rời rạc [nỉ - hảo]',
        correct: 'Đọc lướt mượt mà [ní hǎo]',
        explanation: 'Giữ phát âm mềm mại giúp giọng bạn không bị gắt và chuẩn tự nhiên.'
      }
    },

    step5_listening: {
      dialogue: [
        { speaker: 'Li Hua', hanzi: '你好！', pinyin: 'Nǐ hǎo!', meaning: 'Xin chào!' },
        { speaker: 'Wang Lei', hanzi: '你好！你忙吗？', pinyin: 'Nǐ hǎo! Nǐ máng ma?', meaning: 'Chào bạn! Bạn bận không?' },
        { speaker: 'Li Hua', hanzi: '我不忙。', pinyin: 'Wǒ bù máng.', meaning: 'Tôi không bận.' }
      ],
      audioText: '你好！你好！你忙吗？我不忙。',
      question: 'Li Hua có bận rộn không?',
      options: ['Rất bận', 'Không bận', 'Đang đi học', 'Đang ăn cơm'],
      correctIndex: 1,
      explanation: 'Li Hua trả lời rõ ràng: "我不忙" (Wǒ bù máng - Tôi không bận).'
    },

    step6_speaking: {
      prompt: 'Bạn gặp một người bạn Trung Quốc lần đầu. Hãy chào họ!',
      targetSentence: '你好！',
      targetPinyin: 'Nǐ hǎo!',
      targetMeaning: 'Xin chào bạn!',
      hint: 'Nói to vào mic: "Nǐ hǎo" (nhớ đọc âm ní hǎo).'
    },

    step7_writing: {
      prompt: 'Ghép câu hoàn chỉnh mang nghĩa: "Anh ấy rất tốt."',
      words: ['好', '很', '他'],
      correctOrder: ['他', '很', '好'],
      explanation: 'Thứ tự: 他 (Anh ấy) + 很 (Rất) + 好 (Tốt).'
    },

    step8_quiz: [
      {
        id: 'q-102-1',
        type: 'multiple-choice',
        question: 'Chữ "好" (hǎo) được cấu tạo từ hai bộ phận nào?',
        options: ['Nhân (亻) và Mộc (木)', 'Nữ (女) và Tử (子)', 'Khẩu (口) và Nhật (日)', 'Thủy (氵) và Hỏa (火)'],
        correctIndex: 1,
        explanation: 'Chữ 好 gồm bên trái là bộ Nữ (女) và bên phải là bộ Tử (子).'
      },
      {
        id: 'q-102-2',
        type: 'listening',
        audioText: 'Nǐ hǎo!',
        question: 'Nghe audio và cho biết ý nghĩa của câu chào:',
        options: ['Tạm biệt!', 'Xin chào!', 'Cảm ơn!', 'Xin lỗi!'],
        correctIndex: 1,
        explanation: '你好 (Nǐ hǎo) là lời chào thông dụng nhất.'
      },
      {
        id: 'q-102-3',
        type: 'reorder',
        question: 'Sắp xếp thành câu: "Bố bạn có khỏe không?"',
        words: ['吗', '好', '爸爸', '你'],
        correctOrder: ['你', '爸爸', '好', '吗'],
        explanation: 'Thứ tự: 你爸爸 (Bố của bạn) + 好 (Khỏe) + 吗 (Không).'
      }
    ],

    step9_challenge: {
      title: 'Tự tin chào hỏi người bạn bản ngữ',
      taskDesc: 'Nói câu chào "你好！" và tự đánh giá độ lưu loát thanh điệu.',
      xpReward: 50,
      badge: 'Chào Hỏi Thân Thiện'
    }
  },

  // --- LESSON 1-3 (ID: l-103) ---
  {
    id: 'l-103',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 3,
    title: 'Thanh mẫu g, k, h & Câu hỏi đuôi 吗',
    chineseTitle: '声母与疑问句',
    subtitle: 'Khám phá nhóm âm cuống lưỡi g, k, h và trợ từ nghi vấn 吗 để hỏi mọi thứ.',
    durationMinutes: 18,
    xpReward: 50,
    tags: ['Ngữ pháp', 'Câu hỏi', 'Phát âm'],

    step1_learn: {
      topic: 'Âm cuống lưỡi g, k, h & Trợ từ hỏi 吗 (ma)',
      summary: 'Chỉ cần thêm chữ 吗 (ma) vào cuối câu khẳng định, bạn đã tạo ngay một câu hỏi Yes/No cực dễ dàng!',
      initialsGuide: [
        { char: 'g', read: 'Đọc như chữ [C / K] tiếng Việt (không bật hơi)', example: 'gēge (Anh trai)' },
        { char: 'k', read: 'Bật hơi mạnh từ sâu trong cuống họng [Kh-kh]', example: 'kěyǐ (Có thể)' },
        { char: 'h', read: 'Nằm giữa âm [H] và [Kh] tiếng Việt, phát từ cuống họng', example: 'hǎo (Tốt)' }
      ],
      toneGuide: [
        { tone: 0, name: 'Thanh nhẹ (轻声)', desc: 'Đọc nhẹ, ngắn và dứt khoát không có dấu', example: 'ma, ba, de' }
      ],
      audioDemoText: 'gēge kěyǐ hǎo ma'
    },

    step2_vocabulary: [
      {
        id: 'v-103-1',
        hanzi: '哥哥',
        pinyin: 'gēge',
        hanviet: 'Ca ca',
        meaning: 'Anh trai',
        audioText: '哥哥',
        radical: '口 (Khẩu)',
        example: { hanzi: '我哥哥很高。', pinyin: 'Wǒ gēge hěn gāo.', meaning: 'Anh trai tôi rất cao.' }
      },
      {
        id: 'v-103-2',
        hanzi: '喝',
        pinyin: 'hē',
        hanviet: 'Hát',
        meaning: 'Uống',
        audioText: '喝',
        radical: '口 (Khẩu)',
        example: { hanzi: '喝水。', pinyin: 'Hē shuǐ.', meaning: 'Uống nước.' }
      },
      {
        id: 'v-103-3',
        hanzi: '吗',
        pinyin: 'ma',
        hanviet: 'Ma',
        meaning: '...không? (trợ từ nghi vấn)',
        audioText: '吗',
        radical: '口 (Khẩu)',
        example: { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', meaning: 'Bạn khỏe không?' }
      },
      {
        id: 'v-103-4',
        hanzi: '很',
        pinyin: 'hěn',
        hanviet: 'Hẩn',
        meaning: 'Rất',
        audioText: '很',
        radical: '彳 (Xích)',
        example: { hanzi: '很好。', pinyin: 'Hěn hǎo.', meaning: 'Rất tốt / Rất khỏe.' }
      }
    ],

    step3_hanzi: [
      {
        hanzi: '吗',
        pinyin: 'ma',
        meaning: 'Trợ từ hỏi',
        strokesCount: 6,
        strokeOrderText: 'Bộ Khẩu (口) bên trái trước, chữ Mã (马) bên phải sau',
        components: 'Bộ Khẩu (口) + Chữ Mã (马)',
        mnemonic: 'Mở miệng (口) hỏi chuyện con ngựa (马).'
      },
      {
        hanzi: '喝',
        pinyin: 'hē',
        meaning: 'Uống',
        strokesCount: 12,
        strokeOrderText: 'Bộ Khẩu (口) bên trái, chữ Hạt (曷) bên phải',
        components: 'Bộ Khẩu (miệng)',
        mnemonic: 'Uống nước thì cần phải dùng miệng (口).'
      }
    ],

    step4_grammar: {
      formula: 'Câu trần thuật + 吗 (ma) ?',
      title: 'Cách đặt câu hỏi Yes/No với chữ 吗',
      explanation: 'Không cần đổi vị trí từ ngữ trong câu! Chỉ việc giữ nguyên câu trần thuật và gắn thêm chữ 吗 vào đuôi câu.',
      examples: [
        { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', meaning: 'Bạn khỏe không?' },
        { hanzi: '你喝水吗？', pinyin: 'Nǐ hē shuǐ ma?', meaning: 'Bạn uống nước không?' },
        { hanzi: '他来吗？', pinyin: 'Tā lái ma?', meaning: 'Anh ấy có đến không?' }
      ],
      commonMistake: {
        wrong: '吗你喝？',
        correct: '你喝吗？',
        explanation: 'Trợ từ 吗 luôn luôn đứng ở cuối cùng của câu hỏi.'
      }
    },

    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你好，你喝茶吗？', pinyin: 'Nǐ hǎo, nǐ hē chá ma?', meaning: 'Chào bạn, bạn uống trà không?' },
        { speaker: 'B', hanzi: '我不喝茶，我喝水。', pinyin: 'Wǒ bù hē chá, wǒ hē shuǐ.', meaning: 'Tôi không uống trà, tôi uống nước.' }
      ],
      audioText: '你好，你喝茶吗？我不喝茶，我喝水。',
      question: 'Người B muốn uống món đồ uống nào?',
      options: ['Uống trà', 'Uống nước lọc', 'Uống cà phê', 'Không uống gì'],
      correctIndex: 1,
      explanation: 'Người B nói: "我喝水" (Wǒ hē shuǐ - Tôi uống nước).'
    },

    step6_speaking: {
      prompt: 'Bạn bè hỏi bạn có muốn uống nước không. Hãy đáp: "Tôi uống nước."',
      targetSentence: '我喝水。',
      targetPinyin: 'Wǒ hē shuǐ.',
      targetMeaning: 'Tôi uống nước.',
      hint: 'Nói: "Wǒ hē shuǐ".'
    },

    step7_writing: {
      prompt: 'Sắp xếp các từ thành câu: "Anh trai bạn có khỏe không?"',
      words: ['好', '你', '哥哥', '吗'],
      correctOrder: ['你', '哥哥', '好', '吗'],
      explanation: 'Thứ tự: 你哥哥 (Anh trai bạn) + 好 (Khỏe) + 吗 (Không).'
    },

    step8_quiz: [
      {
        id: 'q-103-1',
        type: 'multiple-choice',
        question: 'Chữ 吗 (ma) mang thanh điệu nào?',
        options: ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh nhẹ (không dấu)'],
        correctIndex: 3,
        explanation: '吗 là trợ từ mang thanh nhẹ (khinh thanh).'
      },
      {
        id: 'q-103-2',
        type: 'listening',
        audioText: 'Nǐ hē ma?',
        question: 'Câu hỏi trong audio có ý nghĩa gì?',
        options: ['Bạn đi không?', 'Bạn uống không?', 'Bạn mệt không?', 'Bạn ăn không?'],
        correctIndex: 1,
        explanation: '喝 (hē) là uống, 你喝吗 là "Bạn uống không?".'
      }
    ],

    step9_challenge: {
      title: 'Hỏi thăm 3 câu hỏi với chữ 吗',
      taskDesc: 'Tự đặt 3 câu hỏi ngắn với chữ 吗 (Ví dụ: 你好吗? 你累吗? 你喝吗?).',
      xpReward: 50,
      badge: 'Bậc Thầy Nghi Vấn'
    }
  },

  // --- LESSON 1-4 (ID: l-104) ---
  {
    id: 'l-104',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 4,
    title: 'Lời cảm ơn 谢谢 & Đáp lại 不客气',
    chineseTitle: '表达感谢与客气',
    subtitle: 'Cách nói lời cảm ơn, đáp lễ lịch sự và xưng hô tôn kính với chữ 您 (Nín).',
    durationMinutes: 18,
    xpReward: 50,
    tags: ['Giao tiếp', 'Lịch sự', 'Văn hóa'],

    step1_learn: {
      topic: 'Văn hóa cảm ơn & Kính ngữ 您 (nín)',
      summary: 'Trong tiếng Trung, khi nói chuyện với người lớn tuổi, thầy cô hoặc đối tác quan trọng, ta dùng kính ngữ 您 thay cho 你.',
      initialsGuide: [
        { char: 'xièxie', read: 'Âm x đọc uốn nhẹ đầu lưỡi sát chân răng, đọc lướt thanh nhẹ ở âm sau: xiè-xie' },
        { char: 'bú kèqi', read: 'kè là bật hơi, qi đọc thanh nhẹ: Không có gì / Đừng khách sáo' }
      ],
      toneGuide: [
        { tone: 1, name: 'Chữ 您 (nín)', desc: 'Có thêm bộ Tâm (心) ở dưới chữ 你, thể hiện sự kính trọng từ tận đáy lòng.' }
      ],
      audioDemoText: 'xièxie nǐ, bú kèqi, nín hǎo'
    },

    step2_vocabulary: [
      {
        id: 'v-104-1',
        hanzi: '谢谢',
        pinyin: 'xièxie',
        hanviet: 'Tạ tạ',
        meaning: 'Cảm ơn',
        audioText: '谢谢',
        radical: '讠 (Ngôn)',
        example: { hanzi: '谢谢你！', pinyin: 'Xièxie nǐ!', meaning: 'Cảm ơn bạn!' }
      },
      {
        id: 'v-104-2',
        hanzi: '不客气',
        pinyin: 'bú kèqi',
        hanviet: 'Bất khách khí',
        meaning: 'Đừng khách sáo / Không có chi',
        audioText: '不客气',
        radical: '宀 (Miên)',
        example: { hanzi: 'A: 谢谢！ B: 不客气。', pinyin: 'A: Xièxie! B: Bú kèqi.', meaning: 'A: Cảm ơn! B: Không có chi.' }
      },
      {
        id: 'v-104-3',
        hanzi: '您',
        pinyin: 'nín',
        hanviet: 'Nâm',
        meaning: 'Ông/bà/thầy (ngôi thứ 2 kính trọng)',
        audioText: '您',
        radical: '心 (Tâm)',
        example: { hanzi: '老师，您好！', pinyin: 'Lǎoshī, nín hǎo!', meaning: 'Em chào thầy ạ!' }
      },
      {
        id: 'v-104-4',
        hanzi: '再见',
        pinyin: 'zàijiàn',
        hanviet: 'Tái kiến',
        meaning: 'Tạm biệt / Hẹn gặp lại',
        audioText: '再见',
        radical: '见 (Kiến)',
        example: { hanzi: '明天再见！', pinyin: 'Míngtiān zàijiàn!', meaning: 'Ngày mai gặp lại nhé!' }
      }
    ],

    step3_hanzi: [
      {
        hanzi: '您',
        pinyin: 'nín',
        meaning: 'Ngài, ông (kính ngữ)',
        strokesCount: 11,
        strokeOrderText: 'Viết chữ 你 ở trên, sau đó viết bộ Tâm (心) ở dưới',
        components: 'Chữ 你 (bạn) + Bộ Tâm 心 (trái tim)',
        mnemonic: 'Đặt bạn (你) ở trong trái tim (心) chính là sự tôn kính tối cao (您).'
      },
      {
        hanzi: '见',
        pinyin: 'jiàn',
        meaning: 'Gặp, thấy',
        strokesCount: 4,
        strokeOrderText: 'Sổ -> Ngang gập -> Phẩy -> Sổ cong móc',
        components: 'Bộ Kiến (见)',
        mnemonic: 'Hình ảnh đôi mắt to và đôi chân đi tìm để gặp gỡ.'
      }
    ],

    step4_grammar: {
      formula: 'Đối thoại cảm ơn: 谢谢！ ➔ 不客气！',
      title: 'Cặp đối thoại xã giao kinh điển',
      explanation: 'Khi ai đó giúp đỡ hoặc nói lời cảm ơn "谢谢", câu đáp lại tự nhiên và lịch thiệp nhất của người bản xứ là "不客气" (Bú kèqi).',
      examples: [
        { hanzi: '谢谢您的帮助！', pinyin: 'Xièxie nín de bāngzhù!', meaning: 'Cảm ơn sự giúp đỡ của ngài!' },
        { hanzi: '不客气，这是我应该做的。', pinyin: 'Bú kèqi, zhè shì wǒ yīnggāi zuò de.', meaning: 'Không có chi, đây là việc tôi nên làm.' }
      ],
      commonMistake: {
        wrong: 'Dùng 你 với người lớn tuổi trong lần đầu gặp gỡ',
        correct: 'Dùng 您 để thể hiện sự lễ phép và văn minh',
        explanation: 'Người Trung Quốc rất coi trọng kính ngữ 您 đối với người lớn tuổi.'
      }
    },

    step5_listening: {
      dialogue: [
        { speaker: 'Học sinh', hanzi: '老师，谢谢您！', pinyin: 'Lǎoshī, xièxie nín!', meaning: 'Thưa thầy, em cảm ơn thầy ạ!' },
        { speaker: 'Thầy giáo', hanzi: '不客气！再见！', pinyin: 'Bú kèqi! Zàijiàn!', meaning: 'Không có chi em! Tạm biệt nhé!' },
        { speaker: 'Học sinh', hanzi: '老师再见！', pinyin: 'Lǎoshī zàijiàn!', meaning: 'Em chào thầy ạ!' }
      ],
      audioText: '老师，谢谢您！不客气！再见！老师再见！',
      question: 'Cuộc trò chuyện diễn ra giữa ai với ai?',
      options: ['Hai người bạn học', 'Thầy giáo và học sinh', 'Bố và con gái', 'Khách hàng và nhân viên'],
      correctIndex: 1,
      explanation: 'Trong bài có từ 老师 (Thầy giáo) và học sinh xưng hô kính ngữ 您.'
    },

    step6_speaking: {
      prompt: 'Thầy giáo vừa giúp bạn sửa bài. Hãy nói lời cảm ơn thầy bằng kính ngữ!',
      targetSentence: '谢谢您，老师！',
      targetPinyin: 'Xièxie nín, lǎoshī!',
      targetMeaning: 'Em cảm ơn thầy ạ!',
      hint: 'Nói vào mic: "Xièxie nín, lǎoshī!".'
    },

    step7_writing: {
      prompt: 'Ghép câu hoàn chỉnh: "Cảm ơn bạn, ngày mai gặp lại."',
      words: ['再见', '谢谢', '明天', '你'],
      correctOrder: ['谢谢', '你', '明天', '再见'],
      explanation: 'Thứ tự: 谢谢你 (Cảm ơn bạn) + 明天再见 (Ngày mai gặp lại).'
    },

    step8_quiz: [
      {
        id: 'q-104-1',
        type: 'multiple-choice',
        question: 'Khi ai đó nói "谢谢" (Xièxie), bạn nên đáp lại bằng câu nào?',
        options: ['再见 (Zàijiàn)', '不客气 (Bú kèqi)', '你好 (Nǐ hǎo)', '不累 (Bú lèi)'],
        correctIndex: 1,
        explanation: 'Đáp lại lời cảm ơn là 不客气 (Không có chi).'
      },
      {
        id: 'q-104-2',
        type: 'listening',
        audioText: 'zàijiàn',
        question: 'Từ trong audio mang ý nghĩa gì?',
        options: ['Xin chào', 'Tạm biệt', 'Xin lỗi', 'Cảm ơn'],
        correctIndex: 1,
        explanation: '再见 (zàijiàn) mang nghĩa Tạm biệt.'
      }
    ],

    step9_challenge: {
      title: 'Đóng vai đối thoại lịch sự',
      taskDesc: 'Nói trọn vẹn cặp câu: "谢谢您！" ➔ "不客气，再见！".',
      xpReward: 50,
      badge: 'Đại Sứ Lịch Thiệp'
    }
  },

  // --- LESSON 1-5 (ID: l-105) ---
  {
    id: 'l-105',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 5,
    title: 'Ôn tập tổng hợp & Chuẩn bị đấu Boss',
    chineseTitle: '复习与迎战Boss',
    subtitle: 'Hệ thống hóa toàn bộ thanh mẫu, thanh điệu và đối thoại chào hỏi của Chapter 1.',
    durationMinutes: 20,
    xpReward: 60,
    tags: ['Tổng kết', 'Ôn tập', 'Chuẩn bị Boss'],

    step1_learn: {
      topic: 'Bản đồ kiến thức Chapter 1',
      summary: 'Chúc mừng bạn đã hoàn thành 4 bài học đầu tiên! Hãy cùng tổng ôn lại để chuẩn bị đối đầu với Boss Chapter 1.',
      initialsGuide: [
        { char: 'Thanh mẫu', read: 'b, p, m, f (âm môi) | d, t, n, l (âm đầu lưỡi) | g, k, h (âm cuống lưỡi)' },
        { char: 'Thanh điệu', read: 'Thanh 1 (ngang cao), Thanh 2 (lên dốc), Thanh 3 (uốn lượn), Thanh 4 (dứt khoát)' }
      ],
      toneGuide: [
        { tone: 1, name: 'Quy tắc vàng', desc: 'Nǐ + Hǎo -> Ní Hǎo | 不 (bù) + thanh 4 -> Bú (bú lèi, bú kèqi).' }
      ],
      audioDemoText: 'b p m f d t n l g k h, nǐ hǎo, xièxie, bú kèqi, zàijiàn'
    },

    step2_vocabulary: [
      {
        id: 'v-105-1',
        hanzi: '我们',
        pinyin: 'wǒmen',
        hanviet: 'Ngã môn',
        meaning: 'Chúng tôi, chúng ta',
        audioText: '我们',
        radical: '亻 (Nhân đứng)',
        example: { hanzi: '我们都是好朋友。', pinyin: 'Wǒmen dōu shì hǎo péngyou.', meaning: 'Chúng tôi đều là bạn tốt.' }
      },
      {
        id: 'v-105-2',
        hanzi: '老师',
        pinyin: 'lǎoshī',
        hanviet: 'Lão sư',
        meaning: 'Thầy giáo, cô giáo',
        audioText: '老师',
        radical: '耂 (Lão)',
        example: { hanzi: '老师好！', pinyin: 'Lǎoshī hǎo!', meaning: 'Em chào thầy cô ạ!' }
      },
      {
        id: 'v-105-3',
        hanzi: '学生',
        pinyin: 'xuésheng',
        hanviet: 'Học sinh',
        meaning: 'Học sinh, sinh viên',
        audioText: '学生',
        radical: '子 (Tử)',
        example: { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Tôi là học sinh.' }
      }
    ],

    step3_hanzi: [
      {
        hanzi: '学',
        pinyin: 'xué',
        meaning: 'Học',
        strokesCount: 8,
        strokeOrderText: '3 nét chấm phẩy ở trên -> Nắp nhà (冖) -> Chữ Tử (子)',
        components: 'Trẻ em (子) học tập dưới mái nhà (冖)',
        mnemonic: 'Hình ảnh em nhỏ học tập chăm chỉ dưới mái trường.'
      }
    ],

    step4_grammar: {
      formula: 'Tổng kết: Chào hỏi + Hỏi thăm + Cảm ơn + Tạm biệt',
      title: 'Mạch hội thoại đời sống hoàn chỉnh',
      explanation: 'Học cách ghép nối toàn bộ các câu đơn lẻ thành một chuỗi đàm thoại liền mạch tự nhiên.',
      examples: [
        { hanzi: 'A: 老师好！ B: 你好！你累吗？', pinyin: 'A: Lǎoshī hǎo! B: Nǐ hǎo! Nǐ lèi ma?', meaning: 'A: Em chào thầy! B: Chào em! Em mệt không?' },
        { hanzi: 'A: 我不累，谢谢老师！ B: 不客气，再见！', pinyin: 'A: Wǒ bú lèi, xièxie lǎoshī! B: Bú kèqi, zàijiàn!', meaning: 'A: Dạ em không mệt, cảm ơn thầy! B: Không có gì, tạm biệt em!' }
      ]
    },

    step5_listening: {
      dialogue: [
        { speaker: 'Thầy Trương', hanzi: '同学们好！', pinyin: 'Tóngxuémen hǎo!', meaning: 'Chào các em học sinh!' },
        { speaker: 'Cả lớp', hanzi: '老师好！', pinyin: 'Lǎoshī hǎo!', meaning: 'Chúng em chào thầy ạ!' },
        { speaker: 'Thầy Trương', hanzi: '今天你们累吗？', pinyin: 'Jīntiān nǐmen lèi ma?', meaning: 'Hôm nay các em có mệt không?' },
        { speaker: 'Cả lớp', hanzi: '我们不累！', pinyin: 'Wǒmen bú lèi!', meaning: 'Dạ chúng em không mệt ạ!' }
      ],
      audioText: '同学们好！老师好！今天你们累吗？我们不累！',
      question: 'Cả lớp trả lời thầy giáo như thế nào?',
      options: ['Chúng em rất mệt', 'Chúng em không mệt', 'Chúng em muốn nghỉ', 'Chúng em đang đói'],
      correctIndex: 1,
      explanation: 'Học sinh đồng thanh nói: "我们不累" (Chúng em không mệt).'
    },

    step6_speaking: {
      prompt: 'Bạn gặp lại thầy giáo cũ. Hãy chào thầy và nói thầy đừng khách sáo.',
      targetSentence: '老师您好，不客气！',
      targetPinyin: 'Lǎoshī nín hǎo, bú kèqi!',
      targetMeaning: 'Em chào thầy ạ, không có chi ạ!',
      hint: 'Nói: "Lǎoshī nín hǎo, bú kèqi!".'
    },

    step7_writing: {
      prompt: 'Ghép câu: "Chúng tôi đều là học sinh."',
      words: ['都是', '学生', '我们'],
      correctOrder: ['我们', '都是', '学生'],
      explanation: 'Thứ tự: 我们 (Chúng tôi) + 都是 (Đều là) + 学生 (Học sinh).'
    },

    step8_quiz: [
      {
        id: 'q-105-1',
        type: 'multiple-choice',
        question: 'Từ "爸爸" (bố) có thanh điệu thế nào?',
        options: ['Thanh 4 + Thanh nhẹ', 'Thanh 1 + Thanh 1', 'Thanh 3 + Thanh 3', 'Thanh 2 + Thanh 4'],
        correctIndex: 0,
        explanation: '爸爸 đọc là bà-ba (âm thứ hai là thanh nhẹ).'
      },
      {
        id: 'q-105-2',
        type: 'reorder',
        question: 'Sắp xếp câu: "Tôi không uống trà."',
        words: ['茶', '不', '我', '喝'],
        correctOrder: ['我', '不', '喝', '茶'],
        explanation: 'Thứ tự: 我 (Tôi) + 不 (Không) + 喝 (Uống) + 茶 (Trà).'
      }
    ],

    step9_challenge: {
      title: 'Sẵn sàng hạ gục Boss Chapter 1',
      taskDesc: 'Đạt điểm tối đa quiz tổng kết để mở khóa trận chiến Boss Challenge!',
      xpReward: 60,
      badge: 'Sẵn Sàng Khiêu Chiến'
    }
  }
];

// =========================================================================
// BOSS CHALLENGES (End-of-Chapter Scenario Simulations)
// =========================================================================
export const BOSS_CHALLENGES = [
  {
    id: 'boss-ch-1',
    chapterId: 'ch-1',
    title: 'Đại Chiến Phát Âm: Cuộc Gặp Đầu Tiên Tại Bắc Kinh',
    chineseTitle: '语音初战：北京初遇',
    bossName: 'Thầy Vương (王老师) — Chuyên gia Ngữ âm Bắc Kinh',
    bossAvatar: '👨‍🏫',
    scenario: 'Bạn vừa đặt chân tới Bắc Kinh và gặp Thầy Vương tại sảnh đón sinh viên quốc tế. Thầy sẽ kiểm tra phản xạ chào hỏi, phân biệt thanh điệu và kính ngữ của bạn!',
    xpReward: 200,
    requiredScoreToPass: 80,
    stages: [
      {
        stageNumber: 1,
        bossDialogue: '你好！欢迎来到北京！请问你是新来的留学生吗？',
        bossPinyin: 'Nǐ hǎo! Huānyíng lái dào Běijīng! Qǐngwèn nǐ shì xīn lái de liúxuéshēng ma?',
        bossMeaning: 'Xin chào! Chào mừng bạn đến Bắc Kinh! Xin hỏi bạn có phải là du học sinh mới đến không?',
        prompt: 'Hãy đáp lại lời chào của Thầy Vương một cách lễ phép nhất:',
        options: [
          { text: '老师您好！我是新来的学生，谢谢您！', pinyin: 'Lǎoshī nín hǎo! Wǒ shì xīn lái de xuésheng, xièxie nín!', isCorrect: true, score: 25, feedback: 'Rất tuyệt vời! Bạn đã sử dụng kính ngữ 您好 và lời cảm ơn đúng chuẩn.' },
          { text: '你好，我不去。', pinyin: 'Nǐ hǎo, wǒ bú qù.', isCorrect: false, score: 0, feedback: 'Câu trả lời không phù hợp với tình huống chào đón.' },
          { text: '再见！', pinyin: 'Zàijiàn!', isCorrect: false, score: 0, feedback: 'Vừa gặp thầy mà đã nói tạm biệt là chưa đúng ngữ cảnh!' }
        ]
      },
      {
        stageNumber: 2,
        bossDialogue: '坐了这么久的飞机，你累不累？要喝点水吗？',
        bossPinyin: 'Zuò le zhème jiǔ de fēijī, nǐ lèi bu lèi? Yào hē diǎn shuǐ ma?',
        bossMeaning: 'Ngồi máy bay lâu như vậy, bạn có mệt không? Có muốn uống chút nước không?',
        prompt: 'Hãy trả lời rằng bạn không mệt và cảm ơn thầy:',
        options: [
          { text: '我不累，谢谢老师！我喝水。', pinyin: 'Wǒ bú lèi, xièxie lǎoshī! Wǒ hē shuǐ.', isCorrect: true, score: 25, feedback: 'Xuất sắc! Câu trả lời kết hợp hoàn hảo phủ định 不累 và động từ 喝水.' },
          { text: '爸爸很忙。', pinyin: 'Bàba hěn máng.', isCorrect: false, score: 0, feedback: 'Lạc đề hoàn toàn rồi bạn ơi!' },
          { text: '八个妈妈。', pinyin: 'Bā gè māma.', isCorrect: false, score: 0, feedback: 'Coi chừng nhầm lẫn từ vựng nhé!' }
        ]
      },
      {
        stageNumber: 3,
        bossDialogue: '很好！你的发音很准！我们现在去学校吧。',
        bossPinyin: 'Hěn hǎo! Nǐ de fāyīn hěn zhǔn! Wǒmen xiànzài qù xuéxiào ba.',
        bossMeaning: 'Rất tốt! Phát âm của em rất chuẩn! Bây giờ chúng ta cùng đến trường nhé.',
        prompt: 'Đáp lại sự khen ngợi của Thầy Vương một cách khiêm tốn:',
        options: [
          { text: '谢谢老师，您太客气了！好的，我们走吧。', pinyin: 'Xièxie lǎoshī, nín tài kèqi le! Hǎo de, wǒmen zǒu ba.', isCorrect: true, score: 25, feedback: 'Cực kỳ tinh tế và khiêm nhường theo đúng văn hóa Trung Hoa.' },
          { text: '我不客气！', pinyin: 'Wǒ bú kèqi!', isCorrect: false, score: 5, feedback: '不客气 chỉ dùng khi người khác cảm ơn bạn thôi nhé.' },
          { text: '你是谁？', pinyin: 'Nǐ shì shéi?', isCorrect: false, score: 0, feedback: 'Câu hỏi này hơi thiếu tế nhị trong tình huống này.' }
        ]
      },
      {
        stageNumber: 4,
        bossDialogue: '到了学校，明天的开学典礼再见！',
        bossPinyin: 'Dào le xuéxiào, míngtiān de kāixué diǎnlǐ zàijiàn!',
        bossMeaning: 'Đến trường rồi, hẹn gặp em tại lễ khai giảng ngày mai nhé!',
        prompt: 'Nói lời tạm biệt lễ phép với Thầy Vương:',
        options: [
          { text: '老师辛苦了，明天见！老师再见！', pinyin: 'Lǎoshī xīnkǔ le, míngtiān jiàn! Lǎoshī zàijiàn!', isCorrect: true, score: 25, feedback: 'Hoàn hảo 100%! Bạn đã chinh phục trọn vẹn Boss Chapter 1!' },
          { text: '你好！', pinyin: 'Nǐ hǎo!', isCorrect: false, score: 0, feedback: 'Lúc chia tay không nên nói 你好.' },
          { text: '不喝茶。', pinyin: 'Bù hē chá.', isCorrect: false, score: 0, feedback: 'Không liên quan đến lời chào tạm biệt.' }
        ]
      }
    ]
  },

  // Boss Chapter 2: Vận mẫu & Âm uốn lưỡi
  {
    id: 'boss-ch-2',
    chapterId: 'ch-2',
    title: 'Thử Thách Quán Trà Sữa: Đánh Vần & Gọi Đồ Bản Ngữ',
    chineseTitle: '奶茶店挑战',
    bossName: 'Cô chủ Tiểu Mai (小梅) — Quán Trà Sữa Sanlitun',
    bossAvatar: '🧋',
    scenario: 'Bạn bước vào quán trà sữa nổi tiếng ở Bắc Kinh và cần giao tiếp bằng tiếng Trung tự nhiên để gọi món và hỏi kích thước ly.',
    xpReward: 200,
    requiredScoreToPass: 80,
    stages: [
      {
        stageNumber: 1,
        bossDialogue: '你好！欢迎光临，请问你想喝什么茶？',
        bossPinyin: 'Nǐ hǎo! Huānyíng guānglín, qǐngwèn nǐ xiǎng hē shénme chá?',
        bossMeaning: 'Xin chào quý khách! Xin hỏi bạn muốn uống trà gì ạ?',
        prompt: 'Chọn câu gọi trà sữa trân châu chuẩn xác:',
        options: [
          { text: '你好，我要一杯珍珠奶茶。', pinyin: 'Nǐ hǎo, wǒ yào yì bēi zhēnzhū nǎichá.', isCorrect: true, score: 25, feedback: 'Rất chuẩn xác!' },
          { text: '我不喝水。', pinyin: 'Wǒ bù hē shuǐ.', isCorrect: false, score: 0, feedback: 'Chưa gọi được món trà sữa rồi.' },
          { text: '老师再见。', pinyin: 'Lǎoshī zàijiàn.', isCorrect: false, score: 0, feedback: 'Sai ngữ cảnh.' }
        ]
      },
      {
        stageNumber: 2,
        bossDialogue: '好的，请问是大杯还是中杯？甜度和冰块怎么选？',
        bossPinyin: 'Hǎo de, qǐngwèn shì dà bēi háishi zhōng bēi? Tiándù hé bīngkuài zěnme xuǎn?',
        bossMeaning: 'Dạ được, ly lớn hay ly vừa ạ? Độ ngọt và đá chọn thế nào ạ?',
        prompt: 'Chọn ly lớn, ít đường (nửa đường) và ít đá:',
        options: [
          { text: '大杯，半糖，少冰，谢谢！', pinyin: 'Dà bēi, bàn táng, shǎo bīng, xièxie!', isCorrect: true, score: 25, feedback: 'Chuyên nghiệp như dân bản xứ!' },
          { text: '我不吃。', pinyin: 'Wǒ bù chī.', isCorrect: false, score: 0, feedback: 'Sai từ.' }
        ]
      },
      {
        stageNumber: 3,
        bossDialogue: '一共二十块钱，您怎么支付？微信还是支付宝？',
        bossPinyin: 'Yígòng èrshí kuài qián, nín zěnme zhīfù? Wēixìn háishi Zhīfùbǎo?',
        bossMeaning: 'Tổng cộng 20 tệ ạ, bạn thanh toán thế nào? WeChat hay Alipay?',
        prompt: 'Nói rằng bạn thanh toán bằng WeChat Pay:',
        options: [
          { text: '我用微信支付，我扫您的二维码。', pinyin: 'Wǒ yòng Wēixìn zhīfù, wǒ sǎo nín de èrwéimǎ.', isCorrect: true, score: 25, feedback: 'Chuẩn thói quen thanh toán không tiền mặt tại Trung Quốc!' },
          { text: '再见！', pinyin: 'Zàijiàn!', isCorrect: false, score: 0, feedback: 'Chưa trả tiền mà đã tạm biệt là không được nha!' }
        ]
      },
      {
        stageNumber: 4,
        bossDialogue: '扫码成功！您的奶茶做好了，请拿好，欢迎下次光临！',
        bossPinyin: 'Sǎo mǎ chénggōng! Nín de nǎichá zuò hǎo le, qǐng ná hǎo, huānyíng xià cì guānglín!',
        bossMeaning: 'Thanh toán thành công! Trà sữa của bạn xong rồi, xin mời nhận và hẹn gặp lại!',
        prompt: 'Nhận trà sữa và cảm ơn cô chủ quán:',
        options: [
          { text: '好的，太感谢了！再见！', pinyin: 'Hǎo de, tài gǎnxiè le! Zàijiàn!', isCorrect: true, score: 25, feedback: 'Thắng lợi rực rỡ! Bạn đã vượt qua Boss Chapter 2!' },
          { text: '我是学生。', pinyin: 'Wǒ shì xuésheng.', isCorrect: false, score: 0, feedback: 'Không đúng tình huống.' }
        ]
      }
    ]
  }
];

// =========================================================================
// PLACEMENT TEST DATASET (10-Question Diagnostic Assessment)
// =========================================================================
export const PLACEMENT_QUESTIONS = [
  {
    id: 'pt-1',
    skill: 'Pinyin',
    level: 'LVL 1',
    question: 'Trong Pinyin, hai thanh 3 đi liền nhau (ví dụ: 你好 nǐ hǎo) sẽ được biến điệu thế nào?',
    options: [
      'Âm tiết thứ nhất biến thành thanh 2 (đọc là ní hǎo)',
      'Âm tiết thứ hai biến thành thanh 1',
      'Cả hai âm đều biến thành thanh 4',
      'Giữ nguyên thanh 3 không thay đổi'
    ],
    correctIndex: 0
  },
  {
    id: 'pt-2',
    skill: 'Vocabulary',
    level: 'LVL 1',
    question: 'Chữ Hán nào sau đây có nghĩa là "Mẹ" (māma)?',
    options: ['爸爸', '妈妈', '哥哥', '姐姐'],
    correctIndex: 1
  },
  {
    id: 'pt-3',
    skill: 'Grammar',
    level: 'LVL 2',
    question: 'Chọn câu phủ định đúng ngữ pháp tiếng Trung mang nghĩa: "Tôi không ăn cơm."',
    options: ['我吃不饭。', '我不吃饭。', '我不饭吃。', '饭吃我不。'],
    correctIndex: 1
  },
  {
    id: 'pt-4',
    skill: 'Hanzi',
    level: 'LVL 2',
    question: 'Bộ thủ "亻" (Nhân đứng) trong các chữ 你, 他, 们 thường liên quan đến điều gì?',
    options: ['Nước và dòng sông', 'Cây cối và gỗ', 'Con người', 'Lửa và nhiệt độ'],
    correctIndex: 2
  },
  {
    id: 'pt-5',
    skill: 'Listening',
    level: 'LVL 2',
    audioText: 'Zhège duōshao qián?',
    question: 'Câu hỏi trong audio "这个多少钱？" mang nghĩa gì?',
    options: ['Cái này bao nhiêu tiền?', 'Cái này ở đâu?', 'Cái này là của ai?', 'Cái này ngon không?'],
    correctIndex: 0
  },
  {
    id: 'pt-6',
    skill: 'Grammar',
    level: 'LVL 3',
    question: 'Điền lượng từ phù hợp cho sách vở: 我买了两 ___ 书。',
    options: ['个 (gè)', '本 (běn)', '支 (zhī)', '张 (zhāng)'],
    correctIndex: 1
  },
  {
    id: 'pt-7',
    skill: 'Grammar',
    level: 'LVL 3',
    question: 'Chọn câu so sánh chữ 比 đúng nghĩa: "Hôm nay lạnh hơn hôm qua."',
    options: [
      '今天昨天比冷。',
      '今天比昨天冷。',
      '冷今天比昨天。',
      '今天比冷昨天。'
    ],
    correctIndex: 1
  },
  {
    id: 'pt-8',
    skill: 'Speaking',
    level: 'LVL 4',
    question: 'Khi muốn lịch sự nhờ vả hoặc hỏi đường người lạ, ta nên bắt đầu bằng từ nào?',
    options: ['对不起 (Duìbuqǐ)', '请问 (Qǐngwèn)', '没关系 (Méi guānxi)', '好久不见 (Hǎojiǔ bú jiàn)'],
    correctIndex: 1
  },
  {
    id: 'pt-9',
    skill: 'Vocabulary',
    level: 'LVL 5',
    question: 'Từ lóng internet "YYDS" thường dùng của giới trẻ Trung Quốc có nghĩa là gì?',
    options: [
      'Vĩnh viễn là thần (Mãi đỉnh / Tuyệt vời nhất)',
      'Một ngày một đêm',
      'Yêu bạn suốt đời',
      'Đi ngủ sớm nhé'
    ],
    correctIndex: 0
  },
  {
    id: 'pt-10',
    skill: 'Reading',
    level: 'LVL 6',
    question: 'Thành ngữ "一举两得" (Nhất cử lưỡng tiện) tương đương với thành ngữ nào trong tiếng Việt?',
    options: [
      'Một mũi tên trúng hai đích',
      'Đứng núi này trông núi nọ',
      'Nước chảy đá mòn',
      'Có công mài sắt có ngày nên kim'
    ],
    correctIndex: 0
  }
];

// =========================================================================
// DAILY MISSIONS TEMPLATE
// =========================================================================
export const DEFAULT_DAILY_MISSIONS = [
  { id: 'm-1', title: 'Học 1 bài học mới trong Lộ trình', xp: 50, icon: '📖', target: 1, current: 0, isCompleted: false, category: 'lesson' },
  { id: 'm-2', title: 'Hoàn thành 1 bài luyện nghe hội thoại', xp: 20, icon: '🎧', target: 1, current: 0, isCompleted: false, category: 'listening' },
  { id: 'm-3', title: 'Luyện nói phản xạ với microphone 3 lần', xp: 30, icon: '🗣️', target: 3, current: 0, isCompleted: false, category: 'speaking' },
  { id: 'm-4', title: 'Đạt điểm tuyệt đối trong 1 bài Quiz', xp: 20, icon: '🎯', target: 1, current: 0, isCompleted: false, category: 'quiz' },
  { id: 'm-5', title: 'Ôn tập 5 từ vựng Spaced Repetition (SRS)', xp: 20, icon: '🧠', target: 5, current: 0, isCompleted: false, category: 'srs' }
];
