// =========================================================================
// HANZIGO COMPREHENSIVE LEARNING PATH DATASET
// 6 Levels | 24 Chapters | Pedagogical 9-Step Lessons | Boss Challenges
// =========================================================================

export const LEARNING_LEVELS = [
  {
    id: 'lvl-1',
    levelNumber: 1,
    code: 'HSK 1',
    hskLevel: 'HSK 1',
    hskStage: 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)',
    name: 'Khởi đầu & Nền tảng',
    chineseName: '中文启程',
    tagline: 'Xây dựng nền móng phát âm & giao tiếp sơ khởi',
    description: 'Nắm vững Pinyin, 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu, quy tắc biến điệu, Hán tự cơ bản và mẫu câu chào hỏi làm quen.',
    color: '#45B97C',
    lightColor: '#EBF8F2',
    darkBg: '#162B21',
    icon: '🌱',
    targetAudience: 'Người mới bắt đầu từ con số 0 hoặc cần chuẩn hóa phát âm',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 1600,
    syllabus5Pillars: {
      tasks: [
        'Chào hỏi, cảm ơn, xin lỗi và tạm biệt lịch sự',
        'Giới thiệu bản thân: họ tên, quốc tịch, tuổi tác, nghề nghiệp',
        'Đếm số 1-100, hỏi giá tiền và mua sắm đồ uống cơ bản',
        'Nói về gia đình, người thân và lượng từ 口 (kǒu)',
        'Hỏi và trả lời ngày tháng, thứ trong tuần, giờ giấc'
      ],
      topics: ['Ngữ âm Pinyin', 'Chào hỏi & Xưng hô', 'Bản thân & Gia đình', 'Số đếm & Mua sắm', 'Thời gian & Lịch sinh hoạt'],
      vocabularyTarget: 500,
      grammarTarget: 48,
      hanziTarget: 300,
      skillsFocus: {
        listening: 'Nhận diện câu đơn giản, phân biệt âm tiết và thanh điệu',
        speaking: 'Giới thiệu bản thân và trả lời câu hỏi trực tiếp',
        reading: 'Đọc hiểu câu ngắn có Pinyin và biển báo quen thuộc',
        writing: 'Viết đúng thứ tự nét bút các chữ Hán căn bản'
      }
    }
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    code: 'HSK 2',
    hskLevel: 'HSK 2',
    hskStage: 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)',
    name: 'Sinh hoạt & Tình huống quen thuộc',
    chineseName: '日常中文',
    tagline: 'Xử lý trôi chảy các tình huống sinh hoạt thường nhật',
    description: 'Mở rộng vốn từ vựng sinh hoạt: Ăn uống tại nhà hàng, đi lại, hỏi đường, mua sắm mặc cả, thời tiết và khám sức khỏe cơ bản.',
    color: '#F4B942',
    lightColor: '#FEF8EA',
    darkBg: '#2E230B',
    icon: '🌿',
    targetAudience: 'Người học bắt đầu phản xạ trực tiếp, không dịch từng chữ trong đầu',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 1800,
    syllabus5Pillars: {
      tasks: [
        'Gọi món tại quán ăn Trung Hoa và yêu cầu khẩu vị (ít cay, không hành)',
        'Hỏi đường và chỉ đường (Đông Tây Nam Bắc, rẽ trái/phải, đi thẳng)',
        'Mua sắm, hỏi size, màu sắc và thanh toán qua WeChat/Alipay',
        'So sánh thời tiết hôm nay và hôm qua với câu chữ 比',
        'Miêu tả triệu chứng sức khỏe đơn giản khi đi khám bệnh'
      ],
      topics: ['Nhà hàng & Ẩm thực', 'Phương tiện & Đi lại', 'Thời tiết & Bốn mùa', 'Mua sắm & Giá cả', 'Sức khỏe & Khám bệnh'],
      vocabularyTarget: 1272,
      grammarTarget: 96,
      hanziTarget: 600,
      skillsFocus: {
        listening: 'Nghe hiểu đoạn đối thoại ngắn 2-3 lượt lời trong sinh hoạt',
        speaking: 'Giao tiếp tình huống không cần dịch nhẩm sang tiếng Việt',
        reading: 'Đọc hiểu mẩu thông báo, thực đơn món ăn, tin nhắn ngắn',
        writing: 'Viết câu đơn hoàn chỉnh với trợ từ và lượng từ phù hợp'
      }
    }
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    code: 'HSK 3',
    hskLevel: 'HSK 3',
    hskStage: 'Stage 1: HSK 1–3 (Sơ cấp & Giao tiếp)',
    name: 'Giao tiếp thực tế & Kể chuyện',
    chineseName: '真实交流',
    tagline: 'Mốc chuyển mình: Thực hiện các nhiệm vụ giao tiếp độc lập',
    description: 'Theo chuẩn HSK 3.0: Nghe, Đọc, Viết toàn diện. Hội thoại dài, kể lại câu chuyện, đưa ra ý kiến cá nhân và viết đoạn văn mạch lạc.',
    color: '#3B82F6',
    lightColor: '#EFF6FF',
    darkBg: '#13233D',
    icon: '🌳',
    targetAudience: 'Tự tin du lịch tự túc, học tập và làm việc cơ bản tại Trung Quốc',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2000,
    syllabus5Pillars: {
      tasks: [
        'Tự xử lý trọn vẹn chuyến du lịch Trung Quốc 3 ngày (Sân bay -> Khách sạn -> Ăn uống -> Đi lại -> Mua sắm)',
        'Sử dụng thành thạo câu chữ 把 và câu bị động chữ 被',
        'Kể lại một trải nghiệm du lịch hoặc hoạt động cuối tuần',
        'Trình bày ý kiến và giải thích nguyên nhân bằng liên từ 因为...所以...',
        'Viết đoạn văn ngắn 80-100 chữ đúng ngữ pháp và chấm câu'
      ],
      topics: ['Du lịch tự túc', 'Trường học & Thi cử', 'Công việc văn phòng', 'Giao thông công cộng', 'Giải trí & Sở thích'],
      vocabularyTarget: 2245,
      grammarTarget: 144,
      hanziTarget: 900,
      skillsFocus: {
        listening: 'Nghe hiểu hội thoại dài và nắm bắt chi tiết then chốt',
        speaking: 'Phản xạ kể chuyện và đối đáp tự nhiên trong phỏng vấn ngắn',
        reading: 'Đọc hiểu mẩu tin tức ngắn, câu chuyện ngụ ngôn, hướng dẫn sử dụng',
        writing: 'Viết đoạn văn kết nối các câu bằng liên từ logic'
      }
    }
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    code: 'HSK 4',
    hskLevel: 'HSK 4',
    hskStage: 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)',
    name: 'Sử dụng tiếng Trung độc lập',
    chineseName: '独立应用',
    tagline: 'Thảo luận đa chủ đề và giao tiếp tự nhiên với người bản xứ',
    description: 'Thảo luận sâu về giáo dục, công việc, công nghệ số, môi trường, cảm xúc và xã hội; tăng tốc độ đọc và nghe hiểu chuyên đề.',
    color: '#E85D3F',
    lightColor: '#FDEEEB',
    darkBg: '#2D1E1B',
    icon: '🔥',
    targetAudience: 'Ứng tuyển công ty Trung Quốc, du học đại học và giao tiếp công sở',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2200,
    syllabus5Pillars: {
      tasks: [
        'Tham gia phỏng vấn xin việc và trình bày thế mạnh, kinh nghiệm cá nhân',
        'Viết CV tiếng Trung và soạn thảo email trao đổi công việc',
        'Thảo luận về lối sống số: WeChat Pay, mua sắm online Taobao/1688',
        'Bày tỏ quan điểm cá nhân về vấn đề xã hội và môi trường',
        'Thuyết trình ngắn 2-3 phút về một đề tài quan tâm'
      ],
      topics: ['Giáo dục & Nghề nghiệp', 'Khoa học công nghệ', 'Môi trường sống', 'Xã hội hiện đại', 'Tâm lý & Cảm xúc'],
      vocabularyTarget: 3245,
      grammarTarget: 216,
      hanziTarget: 1200,
      skillsFocus: {
        listening: 'Nghe hiểu bài giảng ngắn, phỏng vấn truyền thanh và tin tức phổ thông',
        speaking: 'Thuyết trình mạch lạc, phản biện và trao đổi chuyên môn',
        reading: 'Đọc hiểu bài luận, văn bản xã hội và phân tích cấu trúc câu phức',
        writing: 'Viết bài luận ngắn 150-200 chữ có luận điểm và dẫn chứng rõ ràng'
      }
    }
  },
  {
    id: 'lvl-5',
    levelNumber: 5,
    code: 'HSK 5',
    hskLevel: 'HSK 5',
    hskStage: 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)',
    name: 'Thành thạo & Tiếp nhận thông tin gốc',
    chineseName: '流利自如',
    tagline: 'Tiếng Trung trở thành công cụ tiếp nhận thông tin thực thụ',
    description: 'Đọc báo, xem phim, nghe podcast, làm quen giải thích hoàn toàn bằng tiếng Trung (🇨🇳 → 🇨🇳) và thành ngữ quen thuộc.',
    color: '#8B5CF6',
    lightColor: '#F5F3FF',
    darkBg: '#231B38',
    icon: '🚀',
    targetAudience: 'Làm việc chuyên nghiệp tại doanh nghiệp đa quốc gia, du học thạc sĩ',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2400,
    syllabus5Pillars: {
      tasks: [
        'Đọc hiểu báo chí Nhân Dân Nhật Báo, Tân Hoa Xã không cần tra từ điển',
        'Xem phim và video tài liệu không cần phụ đề tiếng Việt',
        'Hiểu các câu nói lóng (slang), trào lưu mạng Douyin/Weibo',
        'Sử dụng thành ngữ 4 chữ chính xác vào bài viết và giao tiếp',
        'Viết bài văn nghị luận 250-400 chữ với phong cách văn bản chuẩn mực'
      ],
      topics: ['Tin tức & Thời sự', 'Kinh tế & Thị trường', 'Văn hóa & Lịch sử', 'Nghệ thuật & Điện ảnh', 'Công nghệ số'],
      vocabularyTarget: 4316,
      grammarTarget: 288,
      hanziTarget: 1500,
      skillsFocus: {
        listening: 'Nghe hiểu tin tức truyền hình, tọa đàm bàn tròn và phim ảnh',
        speaking: 'Phát biểu ý kiến trang trọng và sử dụng thành ngữ tự nhiên',
        reading: 'Đọc báo chí, tác phẩm văn học ngắn với tốc độ nhanh',
        writing: 'Viết văn phong thư từ thương mại và báo cáo tổng kết'
      }
    }
  },
  {
    id: 'lvl-6',
    levelNumber: 6,
    code: 'HSK 6',
    hskLevel: 'HSK 6',
    hskStage: 'Stage 2: HSK 4–6 (Trung cấp & Độc lập)',
    name: 'Nâng cao & Bút pháp học thuật',
    chineseName: '精深高阶',
    tagline: 'Hiểu sâu và diễn đạt tinh tế trong mọi bối cảnh trừu tượng',
    description: 'Chinh phục HSK 6: Đàm phán thương mại quốc tế, tranh luận học thuật, phân tích tác phẩm văn học, collocation và bút pháp cổ điển.',
    color: '#E11D48',
    lightColor: '#FFF1F2',
    darkBg: '#36131B',
    icon: '🐉',
    targetAudience: 'Chuyên gia, dịch giả, nghiên cứu sinh và đàm phán cấp cao',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 2600,
    syllabus5Pillars: {
      tasks: [
        'Đàm phán hợp đồng kinh tế và soạn thảo biên bản điều khoản pháp lý',
        'Tranh luận và bảo vệ luận điểm trong hội thảo học thuật',
        'Tóm tắt văn bản dài 1000 chữ thành bài tóm lược súc tích 400 chữ',
        'Vận dụng linh hoạt các cặp từ đồng nghĩa, phản nghĩa và ngữ thái tinh tế',
        'Cảm thụ văn phong cổ phong và thành ngữ điển cố Trung Hoa'
      ],
      topics: ['Học thuật chuyên sâu', 'Thương mại quốc tế', 'Triết học & Nhân văn', 'Luật pháp & Ngoại giao'],
      vocabularyTarget: 5456,
      grammarTarget: 360,
      hanziTarget: 1800,
      skillsFocus: {
        listening: 'Nắm bắt các thông điệp ẩn ý, châm biếm và thuật ngữ chuyên ngành',
        speaking: 'Diễn thuyết trước công chúng và ứng biến linh hoạt',
        reading: 'Đọc hiểu báo cáo khoa học, văn kiện pháp lý và tác phẩm cổ văn',
        writing: 'Soạn thảo luận án, báo cáo tài chính và thư từ ngoại giao'
      }
    }
  },
  {
    id: 'lvl-7',
    levelNumber: 7,
    code: 'HSK 7-9',
    hskLevel: 'HSK 7-9',
    hskStage: 'Stage 3: HSK 7–9 (Cao cấp & Bậc thầy)',
    name: 'Chinese Master & Phiên dịch',
    chineseName: '中文大师',
    tagline: 'Đỉnh cao HSK 3.0: Nghe, Nói, Đọc, Viết và Dịch thuật chuyên nghiệp',
    description: 'Kiến trúc HSK 7-9 chuẩn mới: Đánh giá toàn diện 5 kỹ năng Nghe - Nói - Đọc - Viết - Dịch (Biên dịch & Phiên dịch đồng thời).',
    color: '#0D9488',
    lightColor: '#F0FDFA',
    darkBg: '#132E2B',
    icon: '👑',
    targetAudience: 'Chuyên gia ngôn ngữ, dịch cabin, nhà ngoại giao và giảng viên cao cấp',
    totalChapters: 4,
    totalLessons: 20,
    xpTotalReward: 3000,
    syllabus5Pillars: {
      tasks: [
        'Biên dịch tài liệu chính luận, pháp luật, kỹ thuật Trung - Việt 2 chiều',
        'Thực hành phiên dịch nối tiếp (consecutive) và mô phỏng dịch cabin',
        'Phân tích tư liệu Hán ngữ cổ đại và đối sánh văn hóa Đông Á',
        'Viết bài nghiên cứu chuyên môn đạt chuẩn học thuật quốc tế'
      ],
      topics: ['Ngoại giao & Chính sách', 'Biên phiên dịch chuyên nghiệp', 'Cổ thư & Điển tích', 'Nghiên cứu ngôn ngữ ứng dụng'],
      vocabularyTarget: 11092,
      grammarTarget: 572,
      hanziTarget: 3000,
      skillsFocus: {
        listening: 'Hiểu các phương ngôn, khẩu âm vùng miền và phát biểu chính trị',
        speaking: 'Hùng biện ngoại giao và đàm phán hiệp định đa phương',
        reading: 'Phân tích văn bản cổ Hán văn và tài liệu nguyên bản',
        writing: 'Viết bài nghiên cứu khoa học và văn kiện ngoại giao',
        translation: 'Biên dịch chính xác và phiên dịch phản xạ tức thì'
      }
    }
  }
];

export const LEARNING_CHAPTERS = [
  // --- LEVEL 1 (Modules 1.1 - 1.4 | Chapters 1-4) ---
  {
    id: 'ch-1',
    levelId: 'lvl-1',
    chapterNumber: 1,
    moduleCode: '1.1',
    unitTitle: 'Ngữ âm Pinyin cơ bản & Nét chữ Hán',
    title: 'Pinyin & 4 Thanh điệu căn bản',
    chineseTitle: '拼音与四声',
    desc: 'Làm quen hệ thống ngữ âm: Thanh mẫu b, p, m, f, d, t, n, l, 4 thanh điệu chuẩn Bắc Kinh và 8 nét cơ bản.',
    prerequisite: 'Không có (Bắt đầu từ con số 0)',
    reviewLessonId: 'l-105',
    relatedMaterialIds: ['mat-1', 'mat-7', 'mat-8'],
    lessonIds: ['l-101', 'l-102', 'l-103', 'l-104', 'l-105'],
    bossId: 'boss-ch-1'
  },
  {
    id: 'ch-2',
    levelId: 'lvl-1',
    chapterNumber: 2,
    moduleCode: '1.2',
    unitTitle: 'Giao tiếp mở đầu, Họ tên & Tuổi tác',
    title: 'Chào hỏi, Bản thân & Xưng hô',
    chineseTitle: '问好与自我介绍',
    desc: 'Chào hỏi lịch sự, cảm ơn, tạm biệt, câu chữ 是, hỏi tên tuổi, quốc tịch và số đếm 1-99.',
    prerequisite: 'Module 1.1: Ngữ âm Pinyin & Thuận bút Chữ Hán',
    reviewLessonId: 'l-110',
    relatedMaterialIds: ['mat-1', 'mat-7'],
    lessonIds: ['l-106', 'l-107', 'l-108', 'l-109', 'l-110'],
    bossId: 'boss-ch-2'
  },
  {
    id: 'ch-3',
    levelId: 'lvl-1',
    chapterNumber: 3,
    moduleCode: '1.3',
    unitTitle: 'Đời sống thường nhật, Lịch trình & Địa điểm',
    title: 'Gia đình, Thời gian & Nơi chốn',
    chineseTitle: '家庭、时间与处所',
    desc: 'Nói về gia đình với 有/没有, thứ ngày tháng năm, giờ giấc, địa điểm 在/去 và mua sắm sơ cấp.',
    prerequisite: 'Module 1.2: Chào hỏi, Bản thân & Xưng hô',
    reviewLessonId: 'l-115',
    relatedMaterialIds: ['mat-1', 'mat-5'],
    lessonIds: ['l-111', 'l-112', 'l-113', 'l-114', 'l-115'],
    bossId: 'boss-ch-3'
  },
  {
    id: 'ch-4',
    levelId: 'lvl-1',
    chapterNumber: 4,
    moduleCode: '1.4',
    unitTitle: 'Sở thích cá nhân & Checkpoint HSK 1',
    title: 'Thói quen, Sở thích & Tổng kết HSK 1',
    chineseTitle: '爱好习惯与HSK 1总评',
    desc: 'Đồ ăn thức uống, năng nguyện động từ 会/想, thời tiết, tổng ôn tập từ vựng ngữ pháp và Checkpoint HSK 1.',
    prerequisite: 'Module 1.3: Gia đình, Thời gian & Nơi chốn',
    reviewLessonId: 'l-120',
    relatedMaterialIds: ['mat-1', 'mat-6'],
    lessonIds: ['l-116', 'l-117', 'l-118', 'l-119', 'l-120'],
    bossId: 'boss-ch-4'
  },

  // --- LEVEL 2 (Modules 2.1 - 2.4 | Chapters 5-8) ---
  {
    id: 'ch-5',
    levelId: 'lvl-2',
    chapterNumber: 5,
    moduleCode: '2.1',
    unitTitle: 'Giao thông công cộng & Chỉ đường thực tế',
    title: 'Lịch trình, Phương tiện & Đi lại',
    chineseTitle: '日程交通与出行',
    desc: 'Giờ giấc chi tiết (差, 刻), phương tiện công cộng, khoảng cách với 离 và hỏi chỉ đường với 往.',
    prerequisite: 'Hoàn thành Cấp độ 1 (HSK 1 - Module 1.4)',
    reviewLessonId: 'l-205',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-201', 'l-202', 'l-203', 'l-204', 'l-205'],
    bossId: 'boss-ch-5'
  },
  {
    id: 'ch-6',
    levelId: 'lvl-2',
    chapterNumber: 6,
    moduleCode: '2.2',
    unitTitle: 'Ẩm thực Trung Hoa & Kỹ năng mặc cả',
    title: 'Ẩm thực, Nhà hàng & Mua sắm',
    chineseTitle: '餐饮美食与购物',
    desc: 'Đi nhà hàng gọi món, dặn dò khẩu vị (ít cay, không rau mùi), mua sắm quần áo và thanh toán mặc cả.',
    prerequisite: 'Module 2.1: Lịch trình, Phương tiện & Đi lại',
    reviewLessonId: 'l-210',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-206', 'l-207', 'l-208', 'l-209', 'l-210'],
    bossId: 'boss-ch-6'
  },
  {
    id: 'ch-7',
    levelId: 'lvl-2',
    chapterNumber: 7,
    moduleCode: '2.3',
    unitTitle: 'Bốn mùa khí hậu, Câu so sánh & Sức khỏe',
    title: 'Thời tiết, So sánh & Sức khỏe',
    chineseTitle: '气候比较与健康',
    desc: 'Hiện tượng thời tiết bốn mùa, câu so sánh chữ 比, so sánh 更/最, khám bệnh và xin nghỉ phép.',
    prerequisite: 'Module 2.2: Ẩm thực, Nhà hàng & Mua sắm',
    reviewLessonId: 'l-215',
    relatedMaterialIds: ['mat-2', 'mat-5'],
    lessonIds: ['l-211', 'l-212', 'l-213', 'l-214', 'l-215'],
    bossId: 'boss-ch-7'
  },
  {
    id: 'ch-8',
    levelId: 'lvl-2',
    chapterNumber: 8,
    moduleCode: '2.4',
    unitTitle: 'Trợ từ động thái & Checkpoint HSK 2',
    title: 'Trạng thái, Cảm xúc & Tổng kết HSK 2',
    chineseTitle: '动态助词与HSK 2总评',
    desc: 'Trợ từ động thái 着 duy trì trạng thái, 过 trải nghiệm quá khứ, liên từ 因为...所以..., ôn tập và Checkpoint HSK 2.',
    prerequisite: 'Module 2.3: Thời tiết, So sánh & Sức khỏe',
    reviewLessonId: 'l-220',
    relatedMaterialIds: ['mat-2', 'mat-6'],
    lessonIds: ['l-216', 'l-217', 'l-218', 'l-219', 'l-220'],
    bossId: 'boss-ch-8'
  },

  // --- LEVEL 3 (Modules 3.1 - 3.4 | Chapters 9-12) ---
  {
    id: 'ch-9',
    levelId: 'lvl-3',
    chapterNumber: 9,
    moduleCode: '3.1',
    unitTitle: 'Du lịch tự túc & Bổ ngữ xu hướng',
    title: 'Du lịch, Khách sạn & Giao tiếp Độc lập',
    chineseTitle: '自由行酒店与趋向补语',
    desc: 'Đặt phòng khách sạn, thủ tục sân bay, bổ ngữ xu hướng đơn 来/去 và bổ ngữ xu hướng kép.',
    prerequisite: 'Hoàn thành Cấp độ 2 (HSK 2 - Module 2.4)',
    reviewLessonId: 'l-305',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-301', 'l-302', 'l-303', 'l-304', 'l-305'],
    bossId: 'boss-ch-9'
  },
  {
    id: 'ch-10',
    levelId: 'lvl-3',
    chapterNumber: 10,
    moduleCode: '3.2',
    unitTitle: 'Bổ ngữ kết quả, Câu chữ 把 & Câu chữ 被',
    title: 'Bổ ngữ Kết quả & Ngữ pháp Cốt lõi',
    chineseTitle: '结果可能补语与把被字句',
    desc: 'Bổ ngữ kết quả, bổ ngữ khả năng, cấu trúc linh hồn: Câu chữ 把 căn bản và nâng cao, câu bị động chữ 被.',
    prerequisite: 'Module 3.1: Du lịch, Khách sạn & Giao tiếp Độc lập',
    reviewLessonId: 'l-310',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-306', 'l-307', 'l-308', 'l-309', 'l-310'],
    bossId: 'boss-ch-10'
  },
  {
    id: 'ch-11',
    levelId: 'lvl-3',
    chapterNumber: 11,
    moduleCode: '3.3',
    unitTitle: 'Công sở, Trường học & Trợ từ kết cấu 的/地/得',
    title: 'Công việc, Học tập & Giao tế Xã hội',
    chineseTitle: '职场学业与结构助词',
    desc: 'Môi trường công sở văn phòng, trường đại học thi cử, cảm xúc tính cách và phân biệt triệt để 3 chữ Đích 的, 地, 得.',
    prerequisite: 'Module 3.2: Bổ ngữ Kết quả & Ngữ pháp Cốt lõi',
    reviewLessonId: 'l-315',
    relatedMaterialIds: ['mat-3', 'mat-5'],
    lessonIds: ['l-311', 'l-312', 'l-313', 'l-314', 'l-315'],
    bossId: 'boss-ch-11'
  },
  {
    id: 'ch-12',
    levelId: 'lvl-3',
    chapterNumber: 12,
    moduleCode: '3.4',
    unitTitle: 'Thành ngữ, Kể chuyện & Đại Khảo Hạch HSK 3',
    title: 'Thành ngữ, Văn hóa & Tổng kết HSK 3',
    chineseTitle: '成语叙事与HSK 3终极挑战',
    desc: 'Thành ngữ 4 chữ thông dụng, kỹ năng kể chuyện với liên từ kết nối, đọc hiểu phân cấp, tổng ôn tập và Đại Khảo Hạch HSK 3.',
    prerequisite: 'Module 3.3: Công việc, Học tập & Giao tế Xã hội',
    reviewLessonId: 'l-320',
    relatedMaterialIds: ['mat-3', 'mat-6'],
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
// CURRICULUM 60 PEDAGOGICAL LESSONS (LEVELS 1 - 3: 60 COMPLETE LESSONS)
// Strictly follows docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
// =========================================================================
import { CURRICULUM_60_LESSONS } from './curriculumLessons.js';
export const LEARNING_LESSONS = CURRICULUM_60_LESSONS;

// =========================================================================
// 12 BOSS CHALLENGES (INTERACTIVE MULTI-STAGE SCENARIO COMBAT)
// =========================================================================
export const BOSS_CHALLENGES = [
{
  "id": "boss-ch-1",
  "chapterId": "ch-1",
  "title": "Đại Chiến Phát Âm: Cuộc Gặp Đầu Tiên Tại Bắc Kinh",
  "chineseTitle": "语音初战：北京初遇",
  "bossName": "Thầy Vương (王老师) — Chuyên gia Ngữ âm Bắc Kinh",
  "bossAvatar": "👨‍🏫",
  "scenario": "Bạn vừa đặt chân tới Bắc Kinh và gặp Thầy Vương tại sảnh đón sinh viên quốc tế. Thầy sẽ kiểm tra phản xạ chào hỏi, phân biệt thanh điệu và kính ngữ của bạn!",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "你好！欢迎来到北京！请问你是新来的留学生吗？",
      "bossPinyin": "Nǐ hǎo! Huānyíng lái dào Běijīng! Qǐngwèn nǐ shì xīn lái de liúxuéshēng ma?",
      "bossMeaning": "Xin chào! Chào mừng bạn đến Bắc Kinh! Xin hỏi bạn có phải là du học sinh mới đến không?",
      "prompt": "Hãy đáp lại lời chào của Thầy Vương một cách lễ phép nhất:",
      "options": [
        {
          "text": "老师您好！我是新来的学生，谢谢您！",
          "pinyin": "Lǎoshī nín hǎo! Wǒ shì xīn lái de xuésheng, xièxie nín!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Rất tuyệt vời! Bạn đã sử dụng kính ngữ 您好 và lời cảm ơn đúng chuẩn."
        },
        {
          "text": "你好，我不去。",
          "pinyin": "Nǐ hǎo, wǒ bú qù.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Câu trả lời không phù hợp với tình huống chào đón."
        },
        {
          "text": "再见！",
          "pinyin": "Zàijiàn!",
          "isCorrect": false,
          "score": 0,
          "feedback": "Vừa gặp thầy mà đã nói tạm biệt là chưa đúng ngữ cảnh!"
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "坐了这么久的飞机，你累不累？要喝点水吗？",
      "bossPinyin": "Zuò le zhème jiǔ de fēijī, nǐ lèi bu lèi? Yào hē diǎn shuǐ ma?",
      "bossMeaning": "Ngồi máy bay lâu như vậy, bạn có mệt không? Có muốn uống chút nước không?",
      "prompt": "Hãy trả lời rằng bạn không mệt và cảm ơn thầy:",
      "options": [
        {
          "text": "我不累，谢谢老师！我喝水。",
          "pinyin": "Wǒ bú lèi, xièxie lǎoshī! Wǒ hē shuǐ.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xuất sắc! Câu trả lời kết hợp hoàn hảo phủ định 不累 và động từ 喝水."
        },
        {
          "text": "爸爸很忙。",
          "pinyin": "Bàba hěn máng.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề hoàn toàn rồi bạn ơi!"
        },
        {
          "text": "八个妈妈。",
          "pinyin": "Bā gè māma.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Coi chừng nhầm lẫn từ vựng nhé!"
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "很好！你的发音很准！我们现在去学校吧。",
      "bossPinyin": "Hěn hǎo! Nǐ de fāyīn hěn zhǔn! Wǒmen xiànzài qù xuéxiào ba.",
      "bossMeaning": "Rất tốt! Phát âm của em rất chuẩn! Bây giờ chúng ta cùng đến trường nhé.",
      "prompt": "Đáp lại sự khen ngợi của Thầy Vương một cách khiêm tốn:",
      "options": [
        {
          "text": "谢谢老师，您太客气了！好的，我们走吧。",
          "pinyin": "Xièxie lǎoshī, nín tài kèqi le! Hǎo de, wǒmen zǒu ba.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Cực kỳ tinh tế và khiêm nhường theo đúng văn hóa Trung Hoa."
        },
        {
          "text": "我不客气！",
          "pinyin": "Wǒ bú kèqi!",
          "isCorrect": false,
          "score": 5,
          "feedback": "不客气 chỉ dùng khi người khác cảm ơn bạn thôi nhé."
        },
        {
          "text": "你是谁？",
          "pinyin": "Nǐ shì shéi?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Câu hỏi này hơi thiếu tế nhị trong tình huống này."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "到了学校，明天的开学典礼再见！",
      "bossPinyin": "Dào le xuéxiào, míngtiān de kāixué diǎnlǐ zàijiàn!",
      "bossMeaning": "Đến trường rồi, hẹn gặp em tại lễ khai giảng ngày mai nhé!",
      "prompt": "Nói lời tạm biệt lễ phép với Thầy Vương:",
      "options": [
        {
          "text": "老师辛苦了，明天见！老师再见！",
          "pinyin": "Lǎoshī xīnkǔ le, míngtiān jiàn! Lǎoshī zàijiàn!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Hoàn hảo 100%! Bạn đã chinh phục trọn vẹn Boss Chapter 1!"
        },
        {
          "text": "你好！",
          "pinyin": "Nǐ hǎo!",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lúc chia tay không nên nói 你好."
        },
        {
          "text": "不喝茶。",
          "pinyin": "Bù hē chá.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Không liên quan đến lời chào tạm biệt."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-2",
  "chapterId": "ch-2",
  "title": "Thử Thách Quán Trà Sữa Sanlitun: Đánh Vần & Tự Giới Thiệu",
  "chineseTitle": "奶茶店初次相识挑战",
  "bossName": "Cô chủ Tiểu Mai (小梅) — Quán Trà Sữa Sanlitun",
  "bossAvatar": "🧋",
  "scenario": "Bạn bước vào quán trà sữa nổi tiếng ở Bắc Kinh và gặp cô chủ Tiểu Mai. Bạn cần tự giới thiệu bản thân, quốc tịch, tuổi tác và giao tiếp tự nhiên!",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "你好！欢迎光临！你是第一次来北京吗？你叫什么名字？",
      "bossPinyin": "Nǐ hǎo! Huānyíng guānglín! Nǐ shì dì yī cì lái Běijīng ma? Nǐ jiào shénme míngzi?",
      "bossMeaning": "Xin chào! Kính chào quý khách! Bạn lần đầu đến Bắc Kinh à? Bạn tên là gì?",
      "prompt": "Chào cô chủ và giới thiệu họ tên của bạn:",
      "options": [
        {
          "text": "你好！我是第一次来，我叫安，很高兴认识你！",
          "pinyin": "Nǐ hǎo! Wǒ shì dì yī cì lái, wǒ jiào Ān, hěn gāoxìng rènshi nǐ!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Rất tự tin và thân thiện!"
        },
        {
          "text": "这是什么？",
          "pinyin": "Zhè shì shénme?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa trả lời câu hỏi tên của cô chủ."
        },
        {
          "text": "我不好。",
          "pinyin": "Wǒ bù hǎo.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Không phù hợp ngữ cảnh làm quen."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "你的汉语说得真好！你是哪国人？今年多大了？",
      "bossPinyin": "Nǐ de Hànyǔ shuō de zhēn hǎo! Nǐ shì nǎ guó rén? Jīnnián duō dà le?",
      "bossMeaning": "Tiếng Trung của bạn nói hay quá! Bạn là người nước nào? Năm nay bao nhiêu tuổi rồi?",
      "prompt": "Nói rõ quốc tịch Việt Nam và số tuổi của bạn:",
      "options": [
        {
          "text": "我是越南人，今年二十岁，在北京学汉语。",
          "pinyin": "Wǒ shì Yuènán rén, jīnnián èrshí suì, zài Běijīng xué Hànyǔ.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xuất sắc! Câu trả lời đầy đủ thông tin chuẩn ngữ pháp."
        },
        {
          "text": "他是中国人。",
          "pinyin": "Tā shì Zhōngguó rén.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Nhầm lẫn đại từ nhân xưng rồi."
        },
        {
          "text": "我有五本书。",
          "pinyin": "Wǒ yǒu wǔ běn shū.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề hoàn toàn."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "原来是越南留学生！你想喝点什么奶茶？",
      "bossPinyin": "Yuánlái shì Yuènán liúxuéshēng! Nǐ xiǎng hē diǎn shénme nǎichá?",
      "bossMeaning": "Hóa ra là du học sinh Việt Nam! Bạn muốn uống trà sữa gì nào?",
      "prompt": "Gọi một ly trà sữa và cảm ơn cô chủ:",
      "options": [
        {
          "text": "请给我一杯珍珠奶茶，谢谢！",
          "pinyin": "Qǐng gěi wǒ yì bēi zhēnzhū nǎichá, xièxie!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chuẩn xác và tự nhiên!"
        },
        {
          "text": "我不喜欢吃米饭。",
          "pinyin": "Wǒ bù xǐhuan chī mǐfàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đang ở quán trà sữa mà lại nói cơm."
        },
        {
          "text": "再见！",
          "pinyin": "Zàijiàn!",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa gọi đồ mà đã tạm biệt!"
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "好的，这是你的奶茶！欢迎常来做客，认识你很高兴！",
      "bossPinyin": "Hǎo de, zhè shì nǐ de nǎichá! Huānyíng cháng lái zuòkè, rènshi nǐ hěn gāoxìng!",
      "bossMeaning": "Được rồi, đây là trà sữa của bạn! Hoan nghênh bạn thường xuyên ghé chơi, rất vui được quen bạn!",
      "prompt": "Đáp lại lời tạm biệt một cách lịch thiệp nhất:",
      "options": [
        {
          "text": "谢谢小梅姐！认识你我也很高兴，明天见！",
          "pinyin": "Xièxie Xiǎoméi jiě! Rènshi nǐ wǒ yě hěn gāoxìng, míngtiān jiàn!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Hoàn hảo! Bạn đã vượt qua Boss Chapter 2 một cách thuyết phục!"
        },
        {
          "text": "不客气！",
          "pinyin": "Bú kèqi!",
          "isCorrect": false,
          "score": 5,
          "feedback": "Người ta đưa đồ cho mình thì mình phải cảm ơn chứ!"
        },
        {
          "text": "你是老师吗？",
          "pinyin": "Nǐ shì lǎoshī ma?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc quẻ rồi bạn ơi!"
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-3",
  "chapterId": "ch-3",
  "title": "Đại Chiến Mua Sắm & Lịch Trình: Chợ Hoa Quả Triều Dương",
  "chineseTitle": "朝阳水果市场采购与议价",
  "bossName": "Bác Trương (张大爷) — Chủ Sạp Hoa Quả Triều Dương",
  "bossAvatar": "🍎",
  "scenario": "Bạn đến chợ hoa quả truyền thống Bắc Kinh để mua táo và hỏi thăm lịch trình, ngày giờ và hỏi giá cả đồ vật.",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "小伙子，今天十月九号，红富士苹果刚到，新鲜得很！你想买几斤？",
      "bossPinyin": "Xiǎohuǒzi, jīntiān shí yuè jiǔ hào, hóngfùshì píngguǒ gāng dào, xīnxiān de hěn! Nǐ xiǎng mǎi jǐ jīn?",
      "bossMeaning": "Chàng trai trẻ ơi, hôm nay ngày 9 tháng 10, táo tươi vừa về ngon lắm! Cháu muốn mua mấy cân?",
      "prompt": "Hỏi giá táo bao nhiêu tiền một cân:",
      "options": [
        {
          "text": "大爷好，请问这个苹果多少钱一斤？",
          "pinyin": "Dàye hǎo, qǐngwèn zhège píngguǒ duōshao qián yì jīn?",
          "isCorrect": true,
          "score": 25,
          "feedback": "Rất lễ phép và đúng trọng tâm hỏi giá!"
        },
        {
          "text": "我不有钱。",
          "pinyin": "Wǒ bù yǒu qián.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Sai ngữ pháp! Phủ định của 有 phải là 没有."
        },
        {
          "text": "几点睡觉？",
          "pinyin": "Jǐ diǎn shuìjiào?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề hoàn toàn."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "十五块钱一斤，很甜的！",
      "bossPinyin": "Shíwǔ kuài qián yì jīn, hěn tián de!",
      "bossMeaning": "15 tệ một cân cháu ơi, ngọt lắm!",
      "prompt": "Bày tỏ cảm thán đắt quá và mặc cả:",
      "options": [
        {
          "text": "太贵了！大爷，便宜一点儿可以吗？十块钱一斤行不行？",
          "pinyin": "Tài guì le! Dàye, piányi yìdiǎnr kěyǐ ma? Shí kuài qián yì jīn xíng bu xíng?",
          "isCorrect": true,
          "score": 25,
          "feedback": "Sử dụng cấu trúc 太贵了 và 便宜一点儿 cực kỳ chuẩn!"
        },
        {
          "text": "太好了！",
          "pinyin": "Tài hǎo le!",
          "isCorrect": false,
          "score": 0,
          "feedback": "Bác bán đắt mà lại khen tốt quá là mất tiền oan đấy!"
        },
        {
          "text": "明天见。",
          "pinyin": "Míngtiān jiàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Bỏ đi vội vàng quá."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "行行行，看你汉语说得好，十块就十块！你家里有几口人？买两斤够吃吗？",
      "bossPinyin": "Xíng xíng xíng, kàn nǐ Hànyǔ shuō de hǎo, shí kuài jiù shí kuài! Nǐ jiā lǐ yǒu jǐ kǒu rén? Mǎi liǎng jīn gòu chī ma?",
      "bossMeaning": "Được được, thấy cháu nói tiếng Trung giỏi, 10 tệ thì 10 tệ! Nhà cháu có mấy người? Mua 2 cân đủ ăn không?",
      "prompt": "Trả lời số người trong nhà bằng lượng từ 口:",
      "options": [
        {
          "text": "我家有四口人，买两斤正好，谢谢大爷！",
          "pinyin": "Wǒ jiā yǒu sì kǒu rén, mǎi liǎng jīn zhènghǎo, xièxie dàye!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chính xác lượng từ 口 rén và trả lời đầy đủ!"
        },
        {
          "text": "我家有四个。",
          "pinyin": "Wǒ jiā yǒu sì gè.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Nói người trong nhà nên dùng 口 rén."
        },
        {
          "text": "在学校吃饭。",
          "pinyin": "Zài xuéxiào chīfàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa trả lời câu hỏi số người."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "一共二十块钱，你现在怎么付钱？",
      "bossPinyin": "Yígòng èrshí kuài qián, nǐ xiànzài zěnme fù qián?",
      "bossMeaning": "Tổng cộng 20 tệ, cháu trả tiền thế nào?",
      "prompt": "Nói bạn quét mã trả tiền bằng WeChat:",
      "options": [
        {
          "text": "大爷，我扫您的微信二维码付钱，二十块付好了！",
          "pinyin": "Dàye, wǒ sǎo nín de Wēixìn èrwéimǎ fù qián, èrshí kuài fù hǎo le!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xuất sắc! Chinh phục trọn vẹn Boss Chapter 3!"
        },
        {
          "text": "我没有钱再见。",
          "pinyin": "Wǒ méiyǒu qián zàijiàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Mua đồ mà không trả tiền là không được nha!"
        },
        {
          "text": "昨天星期五。",
          "pinyin": "Zuótiān xīngqīwǔ.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề rồi."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-4",
  "chapterId": "ch-4",
  "title": "Hội Đồng Khảo Thí CTI: Tốt Nghiệp HSK 1 Toàn Diện",
  "chineseTitle": "HSK 1级全真结业答辩考",
  "bossName": "Giám khảo Trương (张考官) — Trưởng ban Khảo thí CTI",
  "bossAvatar": "🎓",
  "scenario": "Bạn bước vào phòng sát hạch cuối cùng của Level 1. Giám khảo Trương sẽ kiểm tra toàn diện 150 từ vựng và năng lực phản xạ tiếng Trung của bạn!",
  "xpReward": 250,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "考生你好，欢迎参加HSK 1级结业口语测试。首先请用中文简单介绍你的爱好：你喜欢吃什么、喝什么？",
      "bossPinyin": "Kǎoshēng nǐ hǎo, huānyíng cānjiā HSK yī jí jiéyè kǒuyǔ cèshì. Shǒuxiān qǐng yòng Zhōngwén jiǎndān jièshào nǐ de àihào: nǐ xǐhuan chī shénme, hē shénme?",
      "bossMeaning": "Chào thí sinh, mời em giới thiệu sở thích: Em thích ăn gì, uống gì?",
      "prompt": "Trả lời bằng cấu trúc 喜欢吃/喝:",
      "options": [
        {
          "text": "老师好，我喜欢吃米饭和中国菜，喜欢喝中国绿茶。",
          "pinyin": "Lǎoshī hǎo, wǒ xǐhuan chī mǐfàn hé Zhōngguó cài, xǐhuan hē Zhōngguó lǜchá.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Rất chuẩn mực và lưu loát!"
        },
        {
          "text": "我不喜欢。",
          "pinyin": "Wǒ bù xǐhuan.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Quá ngắn ngủi và thiếu thông tin."
        },
        {
          "text": "明天几点？",
          "pinyin": "Míngtiān jǐ diǎn?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Không đúng trọng tâm câu hỏi."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "很好。请问你会说汉语、会写汉字吗？你为什么想学汉语？",
      "bossPinyin": "Hěn hǎo. Qǐngwèn nǐ huì shuō Hànyǔ, huì xiě hànzì ma? Nǐ wèishénme xiǎng xué Hànyǔ?",
      "bossMeaning": "Rất tốt. Em biết nói tiếng Trung, biết viết chữ Hán không? Vì sao em muốn học tiếng Trung?",
      "prompt": "Dùng năng nguyện động từ 会 và 想 để trả lời:",
      "options": [
        {
          "text": "我会说汉语，也会写一些汉字。我想学汉语是因为我想去北京大学读书。",
          "pinyin": "Wǒ huì shuō Hànyǔ, yě huì xiě yìxiē hànzì. Wǒ xiǎng xué Hànyǔ shì yīnwèi wǒ xiǎng qù Běijīng Dàxué dúshū.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Vận dụng 会 và 想 hoàn hảo, nêu rõ mục tiêu cao đẹp!"
        },
        {
          "text": "我不会也不想。",
          "pinyin": "Wǒ bú huì yě bù xiǎng.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Thái độ chưa tích cực trong kỳ thi."
        },
        {
          "text": "昨天天气很好。",
          "pinyin": "Zuótiān tiānqì hěn hǎo.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "外面现在下雨了吗？今天天气怎么样？",
      "bossPinyin": "Wàimiàn xiànzài xià yǔ le ma? Jīntiān tiānqì zěnmeyàng?",
      "bossMeaning": "Bên ngoài trời mưa chưa? Hôm nay thời tiết thế nào?",
      "prompt": "Miêu tả thời tiết hiện tại:",
      "options": [
        {
          "text": "外面没下雨，今天天气很好，不冷也不热，很舒服。",
          "pinyin": "Wàimiàn méi xià yǔ, jīntiān tiānqì hěn hǎo, bù lěng yě bú rè, hěn shūfu.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Vận dụng 不冷也不热 rất sinh động và đúng chuẩn HSK 1!"
        },
        {
          "text": "太贵了。",
          "pinyin": "Tài guì le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Thời tiết không liên quan đến đắt rẻ."
        },
        {
          "text": "我有四个哥哥。",
          "pinyin": "Wǒ yǒu sì gè gēge.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "回答非常出色！恭喜你全面通过HSK 1级考核，正式迈入Level 2！请发表你的结业感言：",
      "bossPinyin": "Huídá fēicháng chūsè! Gōngxǐ nǐ quánmiàn tōngguò HSK yī jí kǎohé, zhèngshì màirù Level 2! Qǐng fābiǎo nǐ de jiéyè gǎnyán:",
      "bossMeaning": "Trả lời rất xuất sắc! Chúc mừng em vượt qua kỳ thi HSK 1, chính thức bước vào Level 2! Mời em phát biểu cảm nghĩ tốt nghiệp:",
      "prompt": "Đọc to lời cảm ơn và quyết tâm học tiếp:",
      "options": [
        {
          "text": "谢谢张考官！在HanziGo学习非常快乐，接下来我会更加努力征服HSK 2级！",
          "pinyin": "Xièxie Zhāng kǎoguān! Zài HanziGo xuéxí fēicháng kuàilè, jiēxiàlai wǒ huì gèngjiā nǔlì zhēngfú HSK èr jí!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Tuyệt vời! Bạn đã xuất sắc tốt nghiệp Level 1 (HSK 1) với số điểm tuyệt đối!"
        },
        {
          "text": "我走啦，再见！",
          "pinyin": "Wǒ zǒu la, zàijiàn!",
          "isCorrect": false,
          "score": 5,
          "feedback": "Hơi vội vàng khi phát biểu tốt nghiệp."
        },
        {
          "text": "我不想学了。",
          "pinyin": "Wǒ bù xiǎng xué le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đừng nản lòng nhé!"
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-5",
  "chapterId": "ch-5",
  "title": "Bác Tài Lão Luyện: Bắt Taxi & Chỉ Đường Phố Cổ",
  "chineseTitle": "老北京的士问路与出行大考验",
  "bossName": "Bác tài Lão Lý (李师傅) — Tài xế Taxi Phố Cổ Bắc Kinh",
  "bossAvatar": "🚕",
  "scenario": "Bạn cần bắt taxi đi từ khách sạn tới ga tàu điện ngầm để kịp giờ hẹn. Bạn phải chỉ đường, hỏi thời gian và trao đổi lộ trình bằng tiếng Trung bản xứ!",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "小同志，上车！请问你要去哪儿？",
      "bossPinyin": "Xiǎo tóngzhì, shàngchē! Qǐngwèn nǐ yào qù nǎr?",
      "bossMeaning": "Đồng chí nhỏ ơi lên xe! Xin hỏi cháu muốn đi đâu?",
      "prompt": "Chào bác tài và nói rõ điểm đến:",
      "options": [
        {
          "text": "师傅您好！我去西单地铁站，请问大概需要多长时间？",
          "pinyin": "Shīfu nín hǎo! Wǒ qù Xīdān dìtiězhàn, qǐngwèn dàgài xūyào duō cháng shíjiān?",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xưng hô 师傅 cực kỳ thân thiện và hỏi thời gian chuẩn xác!"
        },
        {
          "text": "我骑自行车。",
          "pinyin": "Wǒ qí zìxíngchē.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đang ngồi trên taxi mà lại bảo đi xe đạp."
        },
        {
          "text": "这里是哪里？",
          "pinyin": "Zhèlǐ shì nǎlǐ?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa nói điểm đến cho bác tài."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "现在差十分八点，路上有点儿堵，大概需要二十分钟。西单地铁站离这里有五公里呢！",
      "bossPinyin": "Xiànzài chà shí fēn bā diǎn, lùshang yǒudiǎnr dǔ, dàgài xūyào èrshí fēnzhōng. Xīdān dìtiězhàn lí zhèlǐ yǒu wǔ gōnglǐ ne!",
      "bossMeaning": "Bây giờ 8 giờ kém 10, trên đường hơi kẹt, khoảng 20 phút tới. Ga Tây Đơn cách đây 5 km đấy!",
      "prompt": "Nói bạn có cuộc hẹn lúc 8 giờ rưỡi nên nhờ bác tài đi nhanh một chút:",
      "options": [
        {
          "text": "师傅，我八点半在地铁站有约会，麻烦您开快一点儿，谢谢！",
          "pinyin": "Shīfu, wǒ bā diǎn bàn zài dìtiězhàn yǒu yuēhuì, máfan nín kāi kuài yìdiǎnr, xièxie!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Diễn đạt giờ giấc và nhờ vả lịch sự 10 điểm!"
        },
        {
          "text": "我不去了。",
          "pinyin": "Wǒ bú qù le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Hủy chuyến giữa đường là không nên nhé."
        },
        {
          "text": "昨天星期天。",
          "pinyin": "Zuótiān xīngqītiān.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "前面快到路口了，左拐还是往前走？",
      "bossPinyin": "Qiánmiàn kuài dào lùkǒu le, zuǒ guǎi háishì wǎng qián zǒu?",
      "bossMeaning": "Phía trước sắp đến ngã tư rồi, rẽ trái hay đi thẳng cháu?",
      "prompt": "Chỉ đường: Đến ngã rẽ đèn xanh đỏ thì rẽ phải:",
      "options": [
        {
          "text": "师傅，到前面的红绿灯路口往右拐，然后往前走两百米。",
          "pinyin": "Shīfu, dào qiánmiàn de hónglǜdēng lùkǒu wǎng yòu guǎi, ránhòu wǎng qián zǒu liǎng bǎi mǐ.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chỉ đường siêu chuẩn với 往右拐 và 往前走!"
        },
        {
          "text": "拐左。",
          "pinyin": "Guǎi zuǒ.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Phải nói 往左拐 mới đúng ngữ pháp."
        },
        {
          "text": "太贵了。",
          "pinyin": "Tài guì le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đang hỏi đường chứ chưa tính tiền."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "好嘞，地铁站到了！一共二十五块钱，你拿好发票！",
      "bossPinyin": "Hǎo lei, dìtiězhàn dào le! Yígòng èrshíwǔ kuài qián, nǐ ná hǎo fāpiào!",
      "bossMeaning": "Được rồi, ga tàu điện tới rồi! Tổng cộng 25 tệ, cháu cầm lấy hóa đơn nhé!",
      "prompt": "Cảm ơn và nói bạn quét mã trả tiền:",
      "options": [
        {
          "text": "谢谢李师傅！正好八点一刻，我扫微信付您二十五块，再见！",
          "pinyin": "Xièxie Lǐ shīfu! Zhènghǎo bā diǎn yí kè, wǒ sǎo Wēixìn fù nín èrshíwǔ kuài, zàijiàn!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Hoàn hảo 100%! Bạn đã chinh phục trọn vẹn Boss Chapter 5!"
        },
        {
          "text": "我没钱。",
          "pinyin": "Wǒ méi qián.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đi taxi không trả tiền là vi phạm quy định."
        },
        {
          "text": "你叫什么名字？",
          "pinyin": "Nǐ jiào shénme míngzi?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đến nơi rồi không cần hỏi tên nữa."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-6",
  "chapterId": "ch-6",
  "title": "Bếp Trưởng Toàn Tụ Đức: Thử Thách Ẩm Thực & Mặc Cả",
  "chineseTitle": "全聚德烤鸭店与夜市点单大对决",
  "bossName": "Bếp trưởng Vương (王大厨) — Tiệm Vịt Quay Toàn Tụ Đức",
  "bossAvatar": "👨‍🍳",
  "scenario": "Bạn bước vào nhà hàng vịt quay danh tiếng tại Bắc Kinh. Bếp trưởng sẽ kiểm tra khả năng gọi món, yêu cầu khẩu vị và mặc cả mua quà lưu niệm của bạn!",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "欢迎光临全聚德！您几位？想吃点什么特色菜？",
      "bossPinyin": "Huānyíng guānglín Quánjùdé! Nín jǐ wèi? Xiǎng chī diǎn shénme tèsè cài?",
      "bossMeaning": "Chào mừng đến Toàn Tụ Đức! Quý khách đi mấy người? Muốn ăn món đặc sản gì?",
      "prompt": "Nêu số người và gọi một phần vịt quay Bắc Kinh:",
      "options": [
        {
          "text": "服务员好，我们两位，请给我们来一份北京烤鸭和一盘饺子！",
          "pinyin": "Fúwùyuán hǎo, wǒmen liǎng wèi, qǐng gěi wǒmen lái yí fèn Běijīng kǎoyā hé yì pán jiǎozi!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Gọi món cực chuẩn với lượng từ 份 và 盘!"
        },
        {
          "text": "我不吃东西。",
          "pinyin": "Wǒ bù chī dōngxi.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Vào nhà hàng lại bảo không ăn đồ gì."
        },
        {
          "text": "两点开会。",
          "pinyin": "Liǎng diǎn kāihuì.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "好的！您二位吃不吃辣？有什么口味上的特别要求吗？",
      "bossPinyin": "Hǎo de! Nín èr wèi chī bu chī là? Yǒu shénme kǒuwèi shàng de tèbié yāoqiú ma?",
      "bossMeaning": "Được ạ! Hai vị có ăn cay không? Có yêu cầu khẩu vị đặc biệt gì không ạ?",
      "prompt": "Dặn dò nhà bếp không bỏ ớt và cho ít muối:",
      "options": [
        {
          "text": "我们不太能吃辣，请不要放辣椒，菜里少放一点儿盐，谢谢！",
          "pinyin": "Wǒmen bú tài néng chī là, qǐng bú yào fàng làjiāo, cài lǐ shǎo fàng yìdiǎnr yán, xièxie!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Mẫu câu dặn dò khẩu vị 不要放辣椒 và 少放盐 xuất sắc!"
        },
        {
          "text": "多放辣椒！",
          "pinyin": "Duō fàng làjiāo.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Nếu không ăn cay được thì đừng dặn cho nhiều ớt nhé."
        },
        {
          "text": "天气很热。",
          "pinyin": "Tiānqì hěn rè.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "用完餐后，旁边专柜有纪念T恤，这件红色的要一百八十块，您想带一件吗？",
      "bossPinyin": "Yòng wán cān hòu, pángbiān zhuānguì yǒu jìniàn T-xù, zhè jiàn hóngsè de yào yì bǎi bāshí kuài, nín xiǎng dài yí jiàn ma?",
      "bossMeaning": "Dùng bữa xong quầy bên cạnh có áo thun lưu niệm, chiếc màu đỏ này 180 tệ, bạn muốn lấy một chiếc không?",
      "prompt": "Hỏi xem có được thử không và xin bớt giá một chút:",
      "options": [
        {
          "text": "请问我可以试一下吗？如果我买，可以便宜一点儿打个折吗？",
          "pinyin": "Qǐngwèn wǒ kěyǐ shì yíxià ma? Rúguǒ wǒ mǎi, kěyǐ piányi yìdiǎnr dǎ ge zhé ma?",
          "isCorrect": true,
          "score": 25,
          "feedback": "Vừa lịch sự hỏi thử 试一下 vừa mặc cả khéo léo 打折!"
        },
        {
          "text": "太难看了不买。",
          "pinyin": "Tài nánkàn le bù mǎi.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Khen chê hơi gay gắt."
        },
        {
          "text": "在火车站。",
          "pinyin": "Zài huǒchēzhàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "没问题，给您打八折，饭钱加衣服一共两百块！",
      "bossPinyin": "Méi wèntí, gěi nín dǎ bā zhé, fànqián jiā yīfu yígòng liǎng bǎi kuài!",
      "bossMeaning": "Không vấn đề, giảm 20% cho bạn, tiền cơm cộng áo tổng cộng 200 tệ!",
      "prompt": "Đồng ý giá và thanh toán quét mã qua Alipay:",
      "options": [
        {
          "text": "太好了，谢谢老板！两百块我用支付宝扫码付钱。",
          "pinyin": "Tài hǎo le, xièxie lǎobǎn! Liǎng bǎi kuài wǒ yòng Zhīfùbǎo sǎo mǎ fù qián.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Đỉnh cao thực chiến! Chinh phục trọn vẹn Boss Chapter 6!"
        },
        {
          "text": "明天再给钱。",
          "pinyin": "Míngtiān zài gěi qián.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Ăn xong phải trả tiền ngay."
        },
        {
          "text": "谁是服务员？",
          "pinyin": "Shéi shì fúwùyuán?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-7",
  "chapterId": "ch-7",
  "title": "Bác Sĩ Bệnh Viện Hữu Nghị: Khám Bệnh & So Sánh Thời Tiết",
  "chineseTitle": "北京友谊医院就诊与健康大闯关",
  "bossName": "Bác sĩ Triệu (赵医生) — Bệnh Viện Hữu Nghị Bắc Kinh",
  "bossAvatar": "🩺",
  "scenario": "Do thời tiết giao mùa Bắc Kinh lạnh đột ngột, bạn bị cảm sốt và đến bệnh viện gặp Bác sĩ Triệu để thăm khám và xin giấy nghỉ phép.",
  "xpReward": 200,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "你好，请坐。外面今天降温刮大风，我看你脸色不太好，哪里不舒服？",
      "bossPinyin": "Nǐ hǎo, qǐng zuò. Wàimiàn jīntiān jiàngwēn guā dà fēng, wǒ kàn nǐ liǎnsè bú tài hǎo, nǎlǐ bù shūfu?",
      "bossMeaning": "Chào bạn, mời ngồi. Bên ngoài hôm nay hạ nhiệt gió to, tôi thấy sắc mặt bạn không tốt lắm, khó chịu ở đâu?",
      "prompt": "Miêu tả triệu chứng sốt và đau đầu:",
      "options": [
        {
          "text": "赵医生好，我头很疼，昨天晚上发烧三十八度八，今天浑身没力气。",
          "pinyin": "Zhào yīshēng hǎo, wǒ tóu hěn téng, zuótiān wǎnshang fāshāo sānshíbā dù bā, jīntiān húnshēn méi lìqi.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Khai báo triệu chứng rõ ràng: 头疼, 发烧!"
        },
        {
          "text": "我要去买苹果。",
          "pinyin": "Wǒ yào qù mǎi píngguǒ.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Vào viện khám bệnh không nói mua táo."
        },
        {
          "text": "今天比昨天热。",
          "pinyin": "Jīntiān bǐ zuótiān rè.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Sai thực tế thời tiết."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "确实是重感冒了。北京现在的冬天比你们南方冷得多，你出门穿得太少了！",
      "bossPinyin": "Quèshí shì zhòng gǎnmào le. Běijīng xiànzài de dōngtiān bǐ nǐmen nánfāng lěng de duō, nǐ chūmén chuān de tài shǎo le!",
      "bossMeaning": "Đúng là cảm nặng rồi. Mùa đông Bắc Kinh bây giờ lạnh hơn phương nam nhiều lắm, cháu ra ngoài mặc ít quá!",
      "prompt": "Thừa nhận thời tiết hôm nay lạnh hơn hôm qua nhiều:",
      "options": [
        {
          "text": "是的，今天比昨天冷多了，而且外面还下雪了，我最怕冷。",
          "pinyin": "Shì de, jīntiān bǐ zuótiān lěng duō le, érqiě wàimiàn hái xià xuě le, wǒ zuì pà lěng.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Dùng câu chữ 比 (比昨天冷多了) và 最 pà lěng cực kỳ chuẩn mực!"
        },
        {
          "text": "今天比昨天很冷。",
          "pinyin": "Jīntiān bǐ zuótiān hěn lěng.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Sai ngữ pháp! Câu chữ 比 tuyệt đối không dùng 很."
        },
        {
          "text": "我不喜欢喝茶。",
          "pinyin": "Wǒ bù xǐhuan hē chá.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "我给你开三天的感冒药和退烧药。记得一天吃三次，饭后吃，一定要多喝温水！",
      "bossPinyin": "Wǒ gěi nǐ kāi sān tiān de gǎnmàoyào hé tuìshāoyào. Jìde yì tiān chī sān cì, fànhòu chī, yídìng yào duō hē wēnshuǐ!",
      "bossMeaning": "Bác sĩ kê đơn thuốc 3 ngày. Nhớ mỗi ngày uống 3 lần sau ăn, nhất định phải uống nhiều nước ấm!",
      "prompt": "Cảm ơn bác sĩ và nhắc lại cách uống thuốc:",
      "options": [
        {
          "text": "谢谢赵医生，我记住了：一天吃三次药，饭后吃，而且会多喝水多休息。",
          "pinyin": "Xièxie Zhào yīshēng, wǒ jì zhù le: yì tiān chī sān cì yào, fànhòu chī, érqiě huì duō hē shuǐ duō xiūxi.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Dùng chuẩn động từ 吃药 (không dùng 喝药) và 多喝水!"
        },
        {
          "text": "我每天喝三次药。",
          "pinyin": "Wǒ měitiān hē sān cì yào.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Tiếng Trung nói 吃药 chứ không nói 喝药 nha."
        },
        {
          "text": "几点退房？",
          "pinyin": "Jǐ diǎn tuìfáng?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "我再给你开一张三天的病假条，你给学校老师请假，好好在宿舍睡两天！",
      "bossPinyin": "Wǒ zài gěi nǐ kāi yì zhāng sān tiān de bìngjiàtiáo, nǐ gěi xuéxiào lǎoshī qǐngjià, hǎohao zài sùshè shuì liǎng tiān!",
      "bossMeaning": "Bác sĩ viết thêm cho cháu giấy nghỉ ốm 3 ngày để xin phép thầy cô nghỉ ngơi!",
      "prompt": "Nhận giấy xin nghỉ phép và cảm ơn bác sĩ:",
      "options": [
        {
          "text": "太感谢您了赵医生！有了请假条我就可以安心休息了，谢谢您！",
          "pinyin": "Tài gǎnxiè nín le Zhào yīshēng! Yǒu le qǐngjiàtiáo wǒ jiù kěyǐ ānxīn xiūxi le, xièxie nín!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Tuyệt đối hoàn hảo! Chinh phục trọn vẹn Boss Chapter 7!"
        },
        {
          "text": "再见不送。",
          "pinyin": "Zàijiàn bú sòng.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Thiếu lịch sự."
        },
        {
          "text": "多少钱一斤？",
          "pinyin": "Duōshao qián yì jīn?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Khám bệnh chứ không phải mua rau."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-8",
  "chapterId": "ch-8",
  "title": "Hội Đồng Khảo Thí CTI: Đại Sát Hạch Tốt Nghiệp HSK 2",
  "chineseTitle": "HSK 2级全真阶段终极答辩大考",
  "bossName": "Giám khảo Lâm (林考官) — Ban Khảo thí Quốc tế CTI",
  "bossAvatar": "🎖️",
  "scenario": "Đại kỳ thi sát hạch cuối cùng của Level 2. Giám khảo Lâm sẽ kiểm tra toàn diện năng lực phản xạ 300 từ vựng và các trợ từ động thái 着, 过, liên từ 因为...所以... của bạn!",
  "xpReward": 250,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "考生你好，欢迎参加HSK 2级结业综合面试。首先请问：你去过哪些中国城市？吃过什么中国特色美食？",
      "bossPinyin": "Kǎoshēng nǐ hǎo, huānyíng cānjiā HSK èr jí jiéyè zōnghé miànshì. Shǒuxiān qǐngwèn: nǐ qù guo nǎxiē Zhōngguó chéngshì? Chī guo shénme Zhōngguó tèsè měishí?",
      "bossMeaning": "Chào thí sinh, mời em trả lời: Em từng đi những thành phố nào của Trung Quốc? Đã từng ăn đặc sản gì?",
      "prompt": "Trả lời bằng trợ từ kinh nghiệm 过:",
      "options": [
        {
          "text": "老师好，我去过北京和上海，吃过北京烤鸭和四川火锅，感觉特别美味！",
          "pinyin": "Lǎoshī hǎo, wǒ qù guo Běijīng hé Shànghǎi, chī guo Běijīng kǎoyā hé Sìchuān huǒguō, gǎnjué tèbié měiwèi!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Vận dụng trợ từ 过 cực kỳ trôi chảy và tự nhiên!"
        },
        {
          "text": "我去了北京。",
          "pinyin": "Wǒ qù le Běijīng.",
          "isCorrect": false,
          "score": 10,
          "feedback": "Hỏi kinh nghiệm nên dùng 过 sẽ hay hơn."
        },
        {
          "text": "我不有去过。",
          "pinyin": "Wǒ bù yǒu qù guo.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Sai ngữ pháp! Phủ định của 过 là 没去过."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "很好。请你看看窗外：现在的天气和环境状态是什么样的？请用包含'着'的句子描述。",
      "bossPinyin": "Hěn hǎo. Qǐng nǐ kànkan chuāngwài: xiànzài de tiānqì hé huánjìng zhuàngtài shì shénmeyàng de? Qǐng yòng bāohán 'zhe' de jùzi miáoshù.",
      "bossMeaning": "Rất tốt. Hãy nhìn ra ngoài cửa sổ miêu tả trạng thái bằng câu có trợ từ '着':",
      "prompt": "Miêu tả trạng thái với trợ từ 着:",
      "options": [
        {
          "text": "外面下着雪，教室的门开着，操场上正站着几个正在打雪仗的同学。",
          "pinyin": "Wàimiàn xià zhe xuě, jiàoshì de mén kāi zhe, cāochǎng shàng zhèng zhàn zhe jǐ gè zhèngzài dǎ xuězhàng de tóngxué.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xuất sắc! Kết hợp 3 trạng thái duy trì 下着, 开着, 站着 đỉnh cao!"
        },
        {
          "text": "门开。",
          "pinyin": "Mén kāi.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa có trợ từ 着."
        },
        {
          "text": "昨天我买衣服了。",
          "pinyin": "Zuótiān wǒ mǎi yīfu le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "最后一道题：为什么说'学汉语虽然难，但是很有用'？请用关联词阐述你的理由。",
      "bossPinyin": "Zuìhòu yí dào tí: wèishénme shuō 'xué Hànyǔ suīrán nán, dànshì hěn yǒuyòng'? Qǐng yòng guānliáncí chǎnshù nǐ de lǐyóu.",
      "bossMeaning": "Câu hỏi cuối: Vì sao nói học tiếng Trung tuy khó nhưng rất hữu ích? Dùng liên từ giải thích:",
      "prompt": "Dùng cặp liên từ 因为...所以... hoặc 虽然...但是...:",
      "options": [
        {
          "text": "因为学会了汉语，我就可以自己去中国自由行，而且能交到很多中国朋友，所以一切努力都值得！",
          "pinyin": "Yīnwèi xuéhuì le Hànyǔ, wǒ jiù kěyǐ zìjǐ qù Zhōngguó zìyóuxíng, érqiě néng jiāo dào hěn duō Zhōngguó péngyou, suǒyǐ yíqiè nǔlì dōu zhídé!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Lập luận logic chặt chẽ với 因为...所以..., thể hiện tư duy ngôn ngữ độc lập!"
        },
        {
          "text": "因为难所以难。",
          "pinyin": "Yīnwèi nán suǒyǐ nán.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Câu trả lời quá sơ sài."
        },
        {
          "text": "今天比昨天冷。",
          "pinyin": "Jīntiān bǐ zuótiān lěng.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "太精彩了！你的回答完全达到了HSK 2级最高等级标准，我代表考委会正式宣布：你已成功通过Level 2，荣获HSK 2级通关认证！",
      "bossPinyin": "Tài jīngcǎi le! Nǐ de huídá wánquán dádào le HSK èr jí zuìgāo děngjí biāozhǔn, wǒ dàibiǎo kǎowěihuì zhèngshì xuānbù: nǐ yǐ chénggōng tōngguò Level 2, rónghuò HSK èr jí tōngguān rènzhèng!",
      "bossMeaning": "Quá xuất sắc! Em đã chính thức vượt qua Level 2, nhận chứng chỉ tốt nghiệp HSK 2!",
      "prompt": "Phát biểu tuyên thệ tiến lên Level 3:",
      "options": [
        {
          "text": "感谢林考官！完成Level 2只是新起点，接下来我要全力以赴征服HSK 3级独立交流大关！",
          "pinyin": "Gǎnxiè Lín kǎoguān! Wánchéng Level 2 zhǐshì xīn qǐdiǎn, jiēxiàlai wǒ yào quánlìyǐfù zhēngfú HSK sān jí dúlì jiāoliú dàguān!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Đỉnh cao phong thái học giả! Bạn đã chính thức tốt nghiệp Level 2 (HSK 2) xuất sắc!"
        },
        {
          "text": "太好了我不用学了。",
          "pinyin": "Tài hǎo le wǒ bú yòng xué le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đừng dừng lại khi đang trên đà bứt phá nhé!"
        },
        {
          "text": "再见师傅。",
          "pinyin": "Zàijiàn shīfu.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Khảo quan chứ không phải tài xế taxi nha."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-9",
  "chapterId": "ch-9",
  "title": "Tổng Quản Sân Bay & Lễ Tân Bốn Mùa: Thử Thách Du Lịch Độc Lập",
  "chineseTitle": "首都机场与四季酒店自由行生存挑战",
  "bossName": "Quản lý Phương (方经理) — Khách Sạn Bốn Mùa Bắc Kinh",
  "bossAvatar": "🏨",
  "scenario": "Bạn một mình hạ cánh tại sân bay Thủ Đô và tới làm thủ tục tại khách sạn cao cấp. Bạn phải vận dụng bổ ngữ xu hướng, xử lý hành lý và check-in tự chủ 100%!",
  "xpReward": 250,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "先生/女士您好，欢迎来到四季酒店。请问您有预订吗？请出示您的证件。",
      "bossPinyin": "Xiānsheng/Nǚshì nín hǎo, huānyíng lái dào Sìjì Jiǔdiàn. Qǐngwèn nín yǒu yùdìng ma? Qǐng chūshì nín de zhèngjiàn.",
      "bossMeaning": "Kính chào quý khách đến khách sạn Bốn Mùa. Quý khách có đặt trước không? Xin xuất trình giấy tờ:",
      "prompt": "Báo đã đặt phòng trên mạng và lấy hộ chiếu ra:",
      "options": [
        {
          "text": "方经理您好，我已经在网上预订了一间大床房，我已经把护照拿出来了，请您过目。",
          "pinyin": "Fāng jīnglǐ nín hǎo, wǒ yǐjīng zài wǎngshang yùdìng le yì jiān dàchuángfáng, wǒ yǐjīng bǎ hùzhào ná chūlái le, qǐng nín guòmù.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Kết hợp câu chữ 把 và bổ ngữ xu hướng 拿出来了 cực kỳ tao nhã!"
        },
        {
          "text": "我要住在这里。",
          "pinyin": "Wǒ yào zhù zài zhèlǐ.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Chưa đưa giấy tờ và thông tin đặt phòng."
        },
        {
          "text": "我是服务员。",
          "pinyin": "Wǒ shì fúwùyuán.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Nhầm lẫn vai trò rồi."
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "查到了，预订两晚。我们需要收五百元现金押金，退房时会全部退还给您。",
      "bossPinyin": "Chá dào le, yùdìng liǎng wǎn. Wǒmen xūyào shōu wǔ bǎi yuán xiànjīn yājīn, tuìfáng shí huì quánbù tuìhuán gěi nín.",
      "bossMeaning": "Đã tra thấy, đặt 2 đêm. Chúng tôi cần thu 500 tệ tiền cọc, khi trả phòng sẽ hoàn lại đủ.",
      "prompt": "Đồng ý nộp tiền cọc và hỏi giờ trả phòng:",
      "options": [
        {
          "text": "没问题，这是五百块押金。请问后天中午几点之前需要办理退房？",
          "pinyin": "Méi wèntí, zhè shì wǔ bǎi kuài yājīn. Qǐngwèn hòutiān zhōngwǔ jǐ diǎn zhīqián xūyào bànlǐ tuìfáng?",
          "isCorrect": true,
          "score": 25,
          "feedback": "Giao tiếp chuẩn xác với 押金 và 办理退房!"
        },
        {
          "text": "我不给押金。",
          "pinyin": "Wǒ bù gěi yājīn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Quy định khách sạn phải có tiền cọc phòng."
        },
        {
          "text": "明天几点下雨？",
          "pinyin": "Míngtiān jǐ diǎn xià yǔ?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "中午十二点前退房即可。您的房间在八楼808，请问需要服务生帮您把行李拿上去吗？",
      "bossPinyin": "Zhōngwǔ shí'èr diǎn qián tuìfáng jíkě. Nín de fángjiān zài bā lóu bā líng bā, qǐngwèn xūyào fúwùshēng bāng nín bǎ xíngli ná shàngqù ma?",
      "bossMeaning": "Trước 12 giờ trưa ạ. Phòng ở tầng 8, có cần nhân viên mang hành lý lên trên đó giúp không?",
      "prompt": "Tự tin nói tự mình xách hành lý lên được:",
      "options": [
        {
          "text": "不用麻烦了，我自己把行李拿上去就行，非常感谢您的热情服务！",
          "pinyin": "Bú yòng máfan le, wǒ zìjǐ bǎ xíngli ná shàngqù jiù xíng, fēicháng gǎnxiè nín de rèqíng fúwù!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Dùng 把行李拿上去 và thể hiện tính tự lập cao!"
        },
        {
          "text": "行李拿下来。",
          "pinyin": "Xíngli ná xiàlái.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đang ở dưới sảnh phải mang LÊN (拿上去)."
        },
        {
          "text": "我跑出来。",
          "pinyin": "Wǒ pǎo chūlái.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Sai ngữ cảnh."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "这是您的房卡和早餐券！您一个人自由行汉语这么流利，真令人佩服，祝您入住愉快！",
      "bossPinyin": "Zhè shì nín de fángkǎ hé zǎocānquàn! Nín yí gè rén zìyóuxíng Hànyǔ zhème liúlì, zhēn lìng rén pèifú, zhù nín rùzhù yúkuài!",
      "bossMeaning": "Đây là thẻ phòng và phiếu ăn sáng! Chúc quý khách kỳ nghỉ tuyệt vời!",
      "prompt": "Cảm ơn và chúc quản lý làm việc tốt:",
      "options": [
        {
          "text": "谢谢方经理！我先进房间休息去了，祝您工作顺利，再见！",
          "pinyin": "Xièxie Fāng jīnglǐ! Wǒ xiān jìn fángjiān xiūxi qù le, zhù nín gōngzuò shùnlì, zàijiàn!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Xuất sắc vượt qua Boss Chapter 9 - Tự do du lịch không rào cản!"
        },
        {
          "text": "不客气。",
          "pinyin": "Bú kèqi.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Phải nói lời cảm ơn."
        },
        {
          "text": "你是哪国人？",
          "pinyin": "Nǐ shì nǎ guó rén?",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-10",
  "chapterId": "ch-10",
  "title": "Đại Sư Ngữ Pháp: Đại Chiến Cú Pháp Bổ Ngữ, Chữ 把 & Chữ 被",
  "chineseTitle": "全能句法大对决：把字句、被字句与补语阵法",
  "bossName": "Giáo sư Tiền (钱教授) — Viện Nghiên cứu Ngôn ngữ Bắc Kinh",
  "bossAvatar": "🧙‍♂️",
  "scenario": "Bạn đối đầu với Giáo sư Tiền trong trận chiến ngữ pháp hóc búa nhất: Bổ ngữ kết quả, bổ ngữ khả năng, câu chữ 把 nâng cao và câu bị động chữ 被!",
  "xpReward": 250,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "第一阵法：请听题！把句子'我做完了练习'转换为最地道的'把'字句，并说明理由！",
      "bossPinyin": "Dì yī zhènfǎ: qǐng tīng tí! Bǎ jùzi 'wǒ zuò wán le liànxí' zhuǎnhuàn wéi zuì dìdao de 'bǎ' zì jù, bìng shuōmíng lǐyóu!",
      "bossMeaning": "Ải 1: Chuyển câu 'Tôi làm xong bài tập rồi' sang câu chữ 把 chuẩn nhất:",
      "prompt": "Chọn câu chuyển đổi hoàn hảo nhất:",
      "options": [
        {
          "text": "我把练习做完了！因为练习是确定的宾语，做完了表示动作产生的结果。",
          "pinyin": "Wǒ bǎ liànxí zuò wán le! Yīnwèi liànxí shì quèdìng de bīnyǔ, zuò wán le biǎoshì dòngzuò chǎnshēng de jiéguǒ.",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chuẩn xác 100%! Cú pháp S + 把 + O + V + Bổ ngữ kết quả!"
        },
        {
          "text": "我把做完了练习。",
          "pinyin": "Wǒ bǎ zuò wán le liànxí.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Sai trật tự từ nghiêm trọng!"
        },
        {
          "text": "练习把我做完了。",
          "pinyin": "Liànxí bǎ wǒ zuò wán le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Bài tập không thể tác động làm xong con người được!"
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "第二阵法：'这本书太深奥了，我看不懂。' 这里的'看不懂'是什么补语？它的肯定形式是什么？",
      "bossPinyin": "Dì èr zhènfǎ: 'zhè běn shū tài shēn'ào le, wǒ kàn bu dǒng.' Zhèlǐ de 'kàn bu dǒng' shì shénme bǔyǔ? Tā de kěndìng xíngshì shì shénme?",
      "bossMeaning": "Ải 2: '看不懂' là bổ ngữ gì và dạng khẳng định của nó là gì?",
      "prompt": "Phân tích bổ ngữ khả năng:",
      "options": [
        {
          "text": "这是可能补语的否定形式，表示没有理解的能力；肯定形式是'看得懂'！",
          "pinyin": "Zhè shì kěnéng bǔyǔ de fǒudìng xíngshì, biǎoshì méiyǒu lǐjiě de nénglì; kěndìng xíngshì shì 'kàn de dǒng'!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Kiến thức ngữ pháp uyên bác và vững như bàn thạch!"
        },
        {
          "text": "这是结果补语，肯定形式是看懂了。",
          "pinyin": "Zhè shì jiéguǒ bǔyǔ, kěndìng xíngshì shì kàn dǒng le.",
          "isCorrect": false,
          "score": 10,
          "feedback": "Có chữ 不 chen vào giữa là Bổ ngữ khả năng (可能补语)."
        },
        {
          "text": "是程度补语。",
          "pinyin": "Shì chéngdù bǔyǔ.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Nhầm loại bổ ngữ rồi."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "第三阵法：请将主动句'大风刮倒了路边的大树'改为'被'字句！",
      "bossPinyin": "Dì sān zhènfǎ: qǐng jiāng zhǔdòng jù 'dà fēng guā dǎo le lùbiān de dà shù' gǎi wéi 'bèi' zì jù!",
      "bossMeaning": "Ải 3: Đổi câu 'Gió to thổi đổ cây to ven đường' sang câu bị động chữ 被:",
      "prompt": "Chuyển sang câu chữ 被:",
      "options": [
        {
          "text": "路边的大树被大风刮倒了！",
          "pinyin": "Lùbiān de dà shù bèi dà fēng guā dǎo le!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chính xác tuyệt đối! Vật chịu tác động (大树) + 被 + Tác nhân (大风) + V (刮倒了)!"
        },
        {
          "text": "大风被大树刮倒了。",
          "pinyin": "Dà fēng bèi dà shù guā dǎo le.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Ngược logic hoàn toàn rồi!"
        },
        {
          "text": "大树大风被刮倒。",
          "pinyin": "Dà shù dà fēng bèi guā dǎo.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Cú pháp lộn xộn."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "终极一关：如何用一句话同时展现'把'字句与复合趋向补语的精妙结合？",
      "bossPinyin": "Zhōngjí yì guān: rúhé yòng yí jù huà tóngshí zhǎnxiàn 'bǎ' zì jù yǔ fùhé qūxiàng bǔyǔ de jīngmiào jiéhé?",
      "bossMeaning": "Ải cuối: Đặt một câu kết hợp hoàn hảo cả câu chữ 把 và bổ ngữ xu hướng kép:",
      "prompt": "Đưa ra câu đỉnh cao cú pháp:",
      "options": [
        {
          "text": "请你把桌子上的笔记本电脑拿出来，把作业本交上去！",
          "pinyin": "Qǐng nǐ bǎ zhuōzi shàng de bǐjìběn diànnǎo ná chūlái, bǎ zuòyèběn jiāo shàngqù!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Đỉnh cao tuyệt đỉnh! Cả hai vế đều kết hợp 把 + Bổ ngữ xu hướng kép (拿出来 & 交上去)! BẠN ĐÃ ĐÁNH BẠI GIÁO SƯ TIỀN!"
        },
        {
          "text": "我把书看。",
          "pinyin": "Wǒ bǎ shū kàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Động từ cô độc là lỗi cấm kỵ!"
        },
        {
          "text": "今天比昨天冷。",
          "pinyin": "Jīntiān bǐ zuótiān lěng.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Đây là câu so sánh chữ 比."
        }
      ]
    }
  ]
},

{
  "id": "boss-ch-11",
  "chapterId": "ch-11",
  "title": "Phỏng Vấn & Cuộc Họp Công Sở: Chinh Phục Giám Đốc Trương",
  "chineseTitle": "跨国企业商务面试与职场沟通大冲关",
  "bossName": "Giám đốc Trương (张总) — Tổng Giám đốc Doanh nghiệp Đa quốc gia",
  "bossAvatar": "💼",
  "scenario": "Bạn tham gia buổi phỏng vấn và họp dự án cùng Tổng Giám đốc Trương. Bạn phải phân biệt 3 chữ Đích, trình bày kế hoạch làm việc và thái độ giải quyết vấn đề chuyên nghiệp!",
  "xpReward": 250,
  "requiredScoreToPass": 80,
  "stages": [
    {
      "stageNumber": 1,
      "bossDialogue": "请进！请坐。我看过你的简历，你的汉语学得非常认真。请谈谈你在工作中遇到难题时，如何解决问题？",
      "bossPinyin": "Qǐng jìn! Qǐng zuò. Wǒ kàn guo nǐ de jiǎnlì, nǐ de Hànyǔ xué de fēicháng rènzhēn. Qǐng tántan nǐ zài gōngzuò zhōng yù dào nántí shí, rúhé jiějué wèntí?",
      "bossMeaning": "Mời vào, mời ngồi. Tôi đã xem CV, tiếng Trung của bạn học rất nghiêm túc. Khi gặp khó khăn bạn giải quyết thế nào?",
      "prompt": "Trả lời bằng thái độ trách nhiệm và tinh thần đồng đội:",
      "options": [
        {
          "text": "张总好，遇到问题时，我首先会认真分析原因，然后和同事们一起讨论，最后制定详细计划按时解决！",
          "pinyin": "Zhāng zǒng hǎo, yù dào wèntí shí, wǒ shǒuxiān huì rènzhēn fēnxī yuányīn, ránhòu hé tóngshìmen yìqǐ tǎolùn, zuìhòu zhìdìng xiángxì jìhuà ànshí jiějué!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Phong thái chuyên nghiệp đỉnh cao kết hợp 首先 -> 然后 -> 最后!"
        },
        {
          "text": "我不知道怎么办。",
          "pinyin": "Wǒ bù zhīdào zěnme bàn.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Thiếu chủ động trong công việc."
        },
        {
          "text": "我请假回家睡觉。",
          "pinyin": "Wǒ qǐngjià huí jiā shuìjiào.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Bị loại ngay từ vòng phỏng vấn!"
        }
      ]
    },
    {
      "stageNumber": 2,
      "bossDialogue": "回答很有条理！我们下午两点有一个重要会议，需要你向大家汇报。请准确使用'的、地、得'造一个工作汇报句。",
      "bossPinyin": "Huídá hěn yǒu tiáolǐ! Wǒmen xiàwǔ liǎng diǎn yǒu yí gè zhòngyào huìyì, xūyào nǐ xiàng dàjiā huìbào. Qǐng zhǔnquè shǐyòng 'de, de, de' zào yí gè gōngzuò huìbào jù.",
      "bossMeaning": "Trả lời rất có mạch lạc! Chiều nay họp dự án, mời bạn đặt một câu dùng chuẩn cả 3 chữ 的, 地, 得:",
      "prompt": "Vận dụng tam giác 3 chữ Đích trong công việc:",
      "options": [
        {
          "text": "我们团队认真的态度（的）让我们努力地执行计划（地），而且把项目完成得非常出色（得）！",
          "pinyin": "Wǒmen tuánduì rènzhēn de tàidu ràng wǒmen nǔlì de zhíxíng jìhuà, érqiě bǎ xiàngmù wánchéng de fēicháng chūsè!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chuẩn xác tuyệt đối! 的 + Danh từ, 地 + Động từ, Động từ + 得 + Mức độ!"
        },
        {
          "text": "认真的做好的写得。",
          "pinyin": "Rènzhēn de zuò hǎo de xiě de.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Ghép chữ vô nghĩa."
        },
        {
          "text": "昨天很热。",
          "pinyin": "Zuótiān hěn rè.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Lạc đề."
        }
      ]
    },
    {
      "stageNumber": 3,
      "bossDialogue": "非常出色！作为外籍员工，你如何看待我们公司的企业文化和团队协作？",
      "bossPinyin": "Fēicháng chūsè! Zuòwéi wàijí yuángōng, nǐ rúhé kàndài wǒmen gōngsī de qǐyè wénhuà hé tuánduì xiézuò?",
      "bossMeaning": "Rất xuất sắc! Là nhân viên người nước ngoài, bạn nhìn nhận văn hóa công ty và làm việc nhóm thế nào?",
      "prompt": "Vận dụng thành ngữ 入乡随俗 và thái độ nhiệt tình:",
      "options": [
        {
          "text": "我认为首先要学会入乡随俗，尊重大家的沟通习惯；同时我对工作充满热情，愿意一心一意为团队做贡献！",
          "pinyin": "Wǒ rènwéi shǒuxiān yào xuéhuì rù xiāng suí sú, zūnzhòng dàjiā de gōutōng xíguàn; tóngshí wǒ duì gōngzuò chōngmǎn rèqíng, yuànyì yìxīnyíyì wèi tuánduì zuò gòngxiàn!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Vận dụng cả 入乡随俗, 热情 và 一心一意, giám khảo nào cũng muốn tuyển ngay!"
        },
        {
          "text": "我马马虎虎吧。",
          "pinyin": "Wǒ mǎmǎhūhū ba.",
          "isCorrect": false,
          "score": 5,
          "feedback": "Không nên tự nhận làm việc qua loa trong phỏng vấn."
        },
        {
          "text": "我很贵。",
          "pinyin": "Wǒ hěn guì.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Diễn đạt sai ngữ pháp."
        }
      ]
    },
    {
      "stageNumber": 4,
      "bossDialogue": "太优秀了！你不仅汉语功底扎实，而且具备了极强的跨文化沟通能力。恭喜你，你被我们公司正式录取了！",
      "bossPinyin": "Tài yōuxiù le! Nǐ bùjǐn Hànyǔ gōngdǐ zhāshi, érqiě jùbèi le jí qiáng de kuà wénhuà gōutōng nénglì. Gōngxǐ nǐ, nǐ bèi wǒmen gōngsī zhèngshì lùqǔ le!",
      "bossMeaning": "Quá xuất sắc! Bạn đã chính thức được công ty chúng tôi tuyển dụng!",
      "prompt": "Đáp lại lời chúc mừng và bày tỏ lòng cảm ơn:",
      "options": [
        {
          "text": "非常感谢张总的信任！我一定努力工作，认真完成每一个任务，绝不辜负您的期望！",
          "pinyin": "Fēicháng gǎnxiè Zhāng zǒng de xìnrèn! Wǒ yídìng nǔlì gōngzuò, rènzhēn wánchéng měi yí gè rènwu, jué bù gūfù nín de qīwàng!",
          "isCorrect": true,
          "score": 25,
          "feedback": "Chúc mừng bạn đã xuất sắc vượt qua Boss Chapter 11 - Sẵn sàng bước vào Đại Boss Tối Thượng!"
        },
        {
          "text": "好的我走啦。",
          "pinyin": "Hǎo de wǒ zǒu la.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Hơi cụt lủn."
        },
        {
          "text": "没有钱。",
          "pinyin": "Méiyǒu qián.",
          "isCorrect": false,
          "score": 0,
          "feedback": "Không phù hợp."
        }
      ]
    }
  ]
},

// Boss Chapter 12 / HSK 3 Boss Exam: "Chuyến Du Lịch Tự Túc 3 Ngày Tại Trung Quốc"
  {
    id: 'boss-ch-12',
    aliasId: 'boss-hsk-3',
    chapterId: 'ch-12',
    title: 'Đại Khảo Hạch HSK 3: Sinh Tồn Du Lịch Tự Túc 3 Ngày Tại Trung Quốc',
    chineseTitle: 'HSK 3大考：中国三日游全境实战',
    bossName: 'Hệ Thống Khảo Hạch Du Lịch Bản Xứ (Bắc Kinh - Thượng Hải)',
    bossAvatar: '🇨🇳',
    scenario: 'Bạn bắt đầu chuyến du lịch Trung Quốc 3 ngày một mình. Bạn phải tự mình vượt qua 5 ải sinh tồn liên hoàn: ✈️ Sân bay ➔ 🏨 Khách sạn ➔ 🍜 Nhà hàng ➔ 🚇 Tàu điện ngầm ➔ 🛍️ Mua sắm mà không dùng tiếng Anh hay Google Dịch!',
    xpReward: 300,
    requiredScoreToPass: 80,
    stages: [
      {
        stageNumber: 1,
        stageIcon: '✈️',
        stageTitle: 'Trạm 1: Sân bay quốc tế Thủ đô Bắc Kinh (北京首都国际机场)',
        bossDialogue: '您好，请出示您的护照和入境卡。请问您来中国做什么？计划停留几天？',
        bossPinyin: 'Nín hǎo, qǐng chūshì nín de hùzhào hé rùjìng kǎ. Qǐngwèn nín lái Zhōngguó zuò shénme? Jìhuà tíngliú jǐ tiān?',
        bossMeaning: 'Xin chào, vui lòng xuất trình hộ chiếu và tờ khai nhập cảnh. Xin hỏi bạn đến Trung Quốc làm gì? Dự định ở lại mấy ngày?',
        prompt: 'Trả lời hải quan một cách tự tin rằng bạn đi du lịch và ở lại 3 ngày:',
        options: [
          { 
            text: '您好！我是来旅游的，计划停留三天。这是我的护照和酒店预订单。', 
            pinyin: 'Nín hǎo! Wǒ shì lái lǚyóu de, jìhuà tíngliú sān tiān. Zhè shì wǒ de hùzhào hé jiǔdiàn yùdìng dān.', 
            isCorrect: true, 
            score: 20, 
            feedback: 'Xuất sắc! Câu trả lời mạch lạc, lễ phép và cung cấp giấy tờ kịp thời khiến nhân viên hải quan lập tức đóng dấu thông quan!' 
          },
          { 
            text: '我不认识你，我要回家。', 
            pinyin: 'Wǒ bú rènshi nǐ, wǒ yào huí jiā.', 
            isCorrect: false, 
            score: 0, 
            feedback: 'Câu này sẽ khiến hải quan nghi ngờ và giữ bạn lại thẩm vấn đấy!' 
          },
          { 
            text: '多少钱一杯？', 
            pinyin: 'Duōshao qián yì bēi?', 
            isCorrect: false, 
            score: 0, 
            feedback: 'Lạc đề, đây là quầy nhập cảnh không phải quán cà phê!' 
          }
        ]
      },
      {
        stageNumber: 2,
        stageIcon: '🏨',
        stageTitle: 'Trạm 2: Quầy lễ tân khách sạn (酒店前台办理入住)',
        bossDialogue: '欢迎光临！请问有预订吗？我们需要登记您的证件并收取押金。',
        bossPinyin: 'Huānyíng guānglín! Qǐngwèn yǒu yùdìng ma? Wǒmen xūyào dēngjì nín de zhèngjiàn bìng shōuqǔ yājīn.',
        bossMeaning: 'Kính chào quý khách! Xin hỏi quý khách có đặt phòng trước không? Chúng tôi cần đăng ký giấy tờ và thu tiền đặt cọc.',
        prompt: 'Báo tên đặt phòng, xin phòng tầng cao yên tĩnh và hỏi mật khẩu Wi-Fi:',
        options: [
          { 
            text: '您好，我预订了一间大床房。请问有高一点、安静一点的房间吗？还有WiFi密码是多少？', 
            pinyin: 'Nín hǎo, wǒ yùdìng le yì jiān dàchuáng fáng. Qǐngwèn yǒu gāo yìdiǎn, ānjìng yìdiǎn de fángjiān ma? Hái yǒu WiFi mìmǎ shì duōshao?', 
            isCorrect: true, 
            score: 20, 
            feedback: 'Rất ấn tượng! Sử dụng cấu trúc so sánh chữ 一点 (cao hơn một chút, yên tĩnh hơn một chút) cực kỳ tự nhiên.' 
          },
          { 
            text: '明天见！', 
            pinyin: 'Míngtiān jiàn!', 
            isCorrect: false, 
            score: 0, 
            feedback: 'Vừa tới khách sạn chưa check-in mà đã chào tạm biệt?' 
          }
        ]
      },
      {
        stageNumber: 3,
        stageIcon: '🍜',
        stageTitle: 'Trạm 3: Nhà hàng ẩm thực truyền thống (老字号餐厅点菜)',
        bossDialogue: '您好几位？今天有招牌烤鸭和水煮牛肉，您看想吃点什么？',
        bossPinyin: 'Nín hǎo jǐ wèi? Jīntiān yǒu zhāopái kǎoyā hé shuǐzhǔ niúròu, nín kàn xiǎng chī diǎn shénme?',
        bossMeaning: 'Dạ xin hỏi mấy vị? Hôm nay có món vịt quay đặc sản và thịt bò cay, quý khách muốn dùng gì ạ?',
        prompt: 'Gọi nửa con vịt quay, 1 bát canh, yêu cầu không cho ớt cay và thêm 1 ấm trà nóng:',
        options: [
          { 
            text: '服务员，请来半只烤鸭、一碗青菜汤。我不能吃辣，请不要放辣椒！再来一壶热茶，谢谢！', 
            pinyin: 'Fúwùyuán, qǐng lái bàn zhī kǎoyā, yì wǎn qīngcài tāng. Wǒ bù néng chī là, qǐng bú yào fàng làjiāo! Zài lái yì hú rè chá, xièxie!', 
            isCorrect: true, 
            score: 20, 
            feedback: 'Tuyệt đỉnh! Dùng chuẩn các lượng từ 半只 (nửa con), 一碗 (một bát), 一壶 (một ấm) và cấu trúc dặn dò 不要放辣椒.' 
          },
          { 
            text: '我不吃，我要看书。', 
            pinyin: 'Wǒ bù chī, wǒ yào kàn shū.', 
            isCorrect: false, 
            score: 0, 
            feedback: 'Vào quán ăn lại bảo muốn đọc sách thì nhân viên bối rối lắm đấy!' 
          }
        ]
      },
      {
        stageNumber: 4,
        stageIcon: '🚇',
        stageTitle: 'Trạm 4: Ga tàu điện ngầm (地铁站买票与问路)',
        bossDialogue: '请问你要去哪里？自动售票机只收微信、支付宝或现金硬币。',
        bossPinyin: 'Qǐngwèn nǐ yào qù nǎlǐ? Zìdòng shòupiàojī zhǐ shōu Wēixìn, Zhīfùbǎo huò xiànjīn yìngbì.',
        bossMeaning: 'Xin hỏi bạn muốn đi đâu? Máy bán vé tự động chỉ nhận WeChat, Alipay hoặc tiền xu mặt.',
        prompt: 'Hỏi nhân viên cách đổi tuyến tàu điện ngầm đi Vạn Lý Trường Thành:',
        options: [
          { 
            text: '请问去八达岭长城应该坐几号线？需要在哪里换乘？', 
            pinyin: 'Qǐngwèn qù Bādálǐng Chángchéng yīnggāi zuò jǐ hào xiàn? Xūyào zài nǎlǐ huànchéng?', 
            isCorrect: true, 
            score: 20, 
            feedback: 'Chính xác 100%! Cụm từ 几号线 (tuyến số mấy) và 换乘 (chuyển tuyến) chứng tỏ bạn đã làm chủ HSK 3 giao tiếp!' 
          },
          { 
            text: '我不去学校。', 
            pinyin: 'Wǒ bú qù xuéxiào.', 
            isCorrect: false, 
            score: 0, 
            feedback: 'Chưa giải quyết được vấn đề tìm tuyến đường.' 
          }
        ]
      },
      {
        stageNumber: 5,
        stageIcon: '🛍️',
        stageTitle: 'Trạm 5: Phố đi bộ Vương Phủ Tỉnh mua quà lưu niệm (王府井步行街购物)',
        bossDialogue: '这个中国结和丝绸围巾做工都很精细！您想要哪一个？一共一百八十块。',
        bossPinyin: 'Zhè ge Zhōngguójié hé sīchóu wéijīn zuògōng dōu hěn jīngxì! Nín xiǎng yào nǎ yí gè? Yígòng yì bǎi bāshí kuài.',
        bossMeaning: 'Nút thắt may mắn Trung Hoa và khăn lụa này làm rất tinh xảo! Bạn muốn lấy cái nào? Tổng cộng 180 tệ ạ.',
        prompt: 'Hỏi xem nếu mua cả hai món thì có thể bớt giá chút không và quét mã trả tiền:',
        options: [
          { 
            text: '老板，如果这两个我都买，可以便宜一点吗？一百五十块可以吗？我扫码付钱！', 
            pinyin: 'Lǎobǎn, rúguǒ zhè liǎng gè wǒ dōu mǎi, kěyǐ piányi yìdiǎn ma? Yì bǎi wǔshí kuài kěyǐ ma? Wǒ sǎo mǎ fù qián!', 
            isCorrect: true, 
            score: 20, 
            feedback: 'Đỉnh cao giao tiếp bản xứ! Vừa lịch sự vừa mặc cả thành công và thanh toán thần tốc. BẠN ĐÃ XUẤT SẮC CHINH PHỤC HSK 3 BOSS EXAM!' 
          },
          { 
            text: '太贵了，不买了！再见！', 
            pinyin: 'Tài guì le, bù mǎi le! Zàijiàn!', 
            isCorrect: false, 
            score: 5, 
            feedback: 'Bỏ đi vội vàng quá, chưa thử tài thương lượng bằng tiếng Trung!' 
          }
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
