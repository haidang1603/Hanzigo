export const CANONICAL_SITE_ORIGIN = 'https://www.hanzigo.io.vn';

// Featured Exclusive Interactive Tools in HanziGo
export const FEATURED_EXCLUSIVE_TOOLS = [
  {
    id: 'feat-pinyin',
    title: 'Cẩm Nang Ngữ Âm Pinyin & Quy Tắc Biến Điệu',
    badge: '🎵 Phát âm & Ngữ âm',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
    description: 'Bảng tra chuẩn 21 Thanh mẫu, 36 Vận mẫu, 4 Thanh điệu và 5 quy tắc biến điệu vàng kèm phát âm chuẩn Bắc Kinh.',
    url: '/bang-ngu-am-pinyin-toan-dien.html',
    actionText: 'Học ngữ âm ngay',
    type: 'interactive'
  },
  {
    id: 'feat-grammar',
    title: 'Sổ Tay 30 Cấu Trúc Ngữ Pháp HSK 1–3 Cốt Lõi',
    badge: '📚 Cú pháp & Ngữ pháp',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    description: 'Công thức câu chữ 把, chữ 被, câu so sánh 比, phân biệt 不 vs 没 và bảng cảnh báo lỗi sai kinh điển của người Việt.',
    url: '/so-tay-ngu-phap-hsk-cot-loi.html',
    actionText: 'Xem sổ tay ngữ pháp',
    type: 'guide'
  },
  {
    id: 'feat-phrases',
    title: '500 Câu Giao Tiếp Tiếng Trung Phản Xạ Hàng Ngày',
    badge: '🗣️ Khẩu ngữ & Giao tiếp',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    description: 'Mẫu câu đàm thoại thực chiến theo ngữ cảnh: Mua sắm, Nhà hàng, Sân bay, Hỏi đường, Khách sạn & Công sở có audio.',
    url: '/500-cau-giao-tiep-tieng-trung-phan-xa.html',
    actionText: 'Luyện giao tiếp ngay',
    type: 'interactive'
  },
  {
    id: 'feat-mizige',
    title: 'Vở Luyện Viết Ô Mễ Tự (米字格) Chuẩn A4',
    badge: '✍️ In ấn & Luyện viết',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    description: 'Trang kẻ ô mễ tự 8 hướng chuẩn kèm dòng pinyin. Tối ưu in A4 vector nét căng hoặc xuất file PDF để tập viết chữ Hán bằng bút mực.',
    url: '/vo-tap-viet-chu-han-a4.html',
    actionText: 'Mở & In A4 ngay',
    type: 'print'
  },
  {
    id: 'feat-tianzige',
    title: 'Vở Luyện Viết Ô Điền Tự (田字格) Chuẩn A4',
    badge: '✍️ In ấn & Luyện viết',
    badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    description: 'Trang kẻ ô điền tự 4 phần đối xứng kèm dòng pinyin. Tùy chọn in chữ mẫu nét mờ đồ theo nét viết.',
    url: '/vo-luyen-viet-o-dien-tu-tianzige.html',
    actionText: 'In Ô Điền Tự A4',
    type: 'print'
  },
  {
    id: 'feat-radicals',
    title: 'Cẩm Nang 214 Bộ Thủ Khang Hy Tương Tác',
    badge: '📖 Chiết tự & Tra cứu',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'Bảng tra cứu 214 bộ thủ đầy đủ âm Hán-Việt, Pinyin, số nét bút, ý nghĩa tượng hình cổ và danh sách chữ Hán cấu thành tiêu biểu.',
    url: '/214-bo-thu-chu-han.html',
    actionText: 'Tra cứu bộ thủ',
    type: 'interactive'
  },
  {
    id: 'feat-hanviet',
    title: 'Bảng Quy Tắc Chuyển Âm Hán - Việt & Pinyin',
    badge: '🔄 Bí quyết ghi nhớ',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    description: 'Bí quyết ghi nhớ từ vựng siêu tốc dựa trên sự tương đồng ngữ âm lịch sử giữa tiếng Việt và tiếng Hán, chuyển đổi thanh mẫu & vận mẫu.',
    url: '/bang-doi-chieu-han-viet.html',
    actionText: 'Xem bảng quy tắc',
    type: 'guide'
  }
];

// Curated HSK Starter Packs for rapid level-based browsing
export const CURATED_LEVEL_BUNDLES = [
  {
    id: 'bundle-hsk1',
    level: 'HSK 1',
    title: 'HSK 1 Nhập Môn Vững Vàng',
    subtitle: 'HSK 2.0 (150 từ) • HSK 3.0 (500 từ)',
    color: '#45B97C',
    bgLight: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: '🌱',
    stats: 'HSK 2.0: 150 từ • HSK 3.0: 500 từ',
    recommendDocId: 'mat-1'
  },
  {
    id: 'bundle-hsk2',
    level: 'HSK 2',
    title: 'HSK 2 Đàm Thoại Đời Sống',
    subtitle: '300 từ vựng & 500 câu khẩu ngữ',
    color: '#D97706',
    bgLight: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: '💬',
    stats: '300 từ • Giao tiếp mua sắm',
    recommendDocId: 'mat-2'
  },
  {
    id: 'bundle-hsk3',
    level: 'HSK 3',
    title: 'HSK 3 Trung Cấp Toàn Diện',
    subtitle: '600 từ vựng & 100 ngữ pháp',
    color: '#E85D3F',
    bgLight: 'from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800',
    icon: '🚀',
    stats: '600 từ • Đề thi CTI chuẩn',
    recommendDocId: 'mat-3'
  },
  {
    id: 'bundle-hsk4',
    level: 'HSK 4',
    title: 'HSK 4 Nâng Cao & Thành Ngữ',
    subtitle: '1200+ từ & Ngữ pháp AllSet Wiki',
    color: '#8B5CF6',
    bgLight: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: '🎓',
    stats: '1200+ từ • Thành ngữ 4 chữ',
    recommendDocId: 'mat-5'
  }
];

// Rich interactive excerpts for Preview Studio Modal
export const SAMPLE_EXCERPTS = {
  'mat-1': {
    type: 'vocab_table',
    title: 'Trích đoạn Từ vựng Cốt lõi HSK 1 (Bài 1 - 3)',
    subtitle: 'Chuẩn Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    items: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', hanViet: 'Nhĩ Hảo', meaning: 'Xin chào', example: '你好！很高兴认识你。' },
      { hanzi: '谢谢', pinyin: 'xièxie', hanViet: 'Tạ Tạ', meaning: 'Cảm ơn', example: '谢谢你的帮助！' },
      { hanzi: '再见', pinyin: 'zàijiàn', hanViet: 'Tái Kiến', meaning: 'Tạm biệt', example: '明天见，再见！' },
      { hanzi: '学习', pinyin: 'xuéxí', hanViet: 'Học Tập', meaning: 'Học hỏi, học tập', example: '我们在学习汉语。' },
      { hanzi: '中国', pinyin: 'zhōngguó', hanViet: 'Trung Quốc', meaning: 'Nước Trung Quốc', example: '我喜欢中国文化。' }
    ]
  },
  'mat-2': {
    type: 'dialogue',
    title: 'Trích đoạn Đàm thoại Thực tế HSK 2 (Đi chợ & Mua sắm)',
    subtitle: 'Giao tiếp hàng ngày giọng bản xứ',
    lines: [
      { speaker: '顾客 (Khách)', hanzi: '服务员，这个苹果一斤多少钱？', pinyin: 'Fúwùyuán, zhè ge píngguǒ yì jīn duōshao qián?', viet: 'Phục vụ ơi, một cân táo này bao nhiêu tiền thế?' },
      { speaker: '店员 (Nhân viên)', hanzi: '五块钱一斤，很甜很好吃。', pinyin: 'Wǔ kuài qián yì jīn, hěn tián hěn hǎochī.', viet: 'Năm tệ một cân, rất ngọt và ngon lắm.' },
      { speaker: '顾客 (Khách)', hanzi: '太贵了，便宜一点儿吧！四块怎么样？', pinyin: 'Tài guì le, piányi yìdiǎnr ba! Sì kuài zěnmeyàng?', viet: 'Đắt quá, rẻ bớt chút đi! Bốn tệ được không?' },
      { speaker: '店员 (Nhân viên)', hanzi: '行，买两斤算你八块。', pinyin: 'Xíng, mǎi liǎng jīn suàn nǐ bā kuài.', viet: 'Được rồi, mua hai cân tính bạn tám tệ.' }
    ]
  },
  'mat-3': {
    type: 'vocab_table',
    title: 'Trích đoạn Từ vựng Trọng tâm HSK 3 (Công việc & Du lịch)',
    subtitle: 'Mở rộng vốn từ trung cấp',
    items: [
      { hanzi: '打算', pinyin: 'dǎsuàn', hanViet: 'Đả Toán', meaning: 'Dự định, kế hoạch', example: '你周末有什么打算？' },
      { hanzi: '满意', pinyin: 'mǎnyì', hanViet: 'Mãn Ý', meaning: 'Hài lòng, vừa ý', example: '我对这次旅行很满意。' },
      { hanzi: '环境', pinyin: 'huánjìng', hanViet: 'Hoàn Cảnh', meaning: 'Môi trường, không gian', example: '这里的环境非常安静。' },
      { hanzi: '经常', pinyin: 'jīngcháng', hanViet: 'Kinh Thường', meaning: 'Thường xuyên', example: '他经常去图书馆借书。' },
      { hanzi: '解决', pinyin: 'jiějué', hanViet: 'Giải Quyết', meaning: 'Giải quyết vấn đề', example: '我们已经解决了这个问题。' }
    ]
  },
  'mat-4': {
    type: 'radicals',
    title: 'Trích đoạn 5 Bộ Thủ Căn Bản Tiêu Biểu Nhất',
    subtitle: 'Gốc rễ tạo chữ tượng hình',
    items: [
      { radical: '亻', name: 'Nhân đứng (人)', strokes: 2, meaning: 'Liên quan đến con người', examples: '你, 他, 们, 休, 伴' },
      { radical: '氵', name: 'Ba chấm thủy (水)', strokes: 3, meaning: 'Liên quan đến nước, chất lỏng', examples: '江, 河, 海, 洗, 渴' },
      { radical: '口', name: 'Khẩu (Miệng)', strokes: 3, meaning: 'Liên quan đến ăn uống, lời nói', examples: '吃, 喝, 叫, 听, 问' },
      { radical: '木', name: 'Mộc (Cây cối)', strokes: 4, meaning: 'Liên quan đến gỗ, cây cối, rừng', examples: '林, 森, 桌, 椅, 本' },
      { radical: '忄', name: 'Tâm đứng (心)', strokes: 3, meaning: 'Liên quan đến tâm tư, cảm xúc', examples: '快, 慢, 怕, 忆, 懂' }
    ]
  },
  'mat-5': {
    type: 'grammar',
    title: 'Trích đoạn Bách Khoa Ngữ Pháp: Cấu Trúc Câu Chữ 把 (Bǎ)',
    subtitle: 'Chinese Grammar Wiki chuẩn AllSet',
    formula: 'Chủ ngữ (S) + 把 + Tân ngữ (O) + Động từ (V) + Thành phần khác (了/bổ ngữ)',
    explanation: 'Dùng để nhấn mạnh sự tác động làm thay đổi vị trí, trạng thái hoặc kết quả của tân ngữ.',
    examples: [
      { correct: '我把作业做完了。 (Wǒ bǎ zuòyè zuò wán le.)', viet: 'Tôi đã làm xong bài tập rồi.', note: 'Tân ngữ "bài tập" chịu tác động và hoàn thành.' },
      { correct: '请把门关上。 (Qǐng bǎ mén guān shàng.)', viet: 'Làm ơn đóng cửa lại.', note: 'Tân ngữ "cửa" thay đổi trạng thái đóng.' },
      { incorrect: '我把作业做。 ❌ (Sai: Thiếu thành phần bổ ngữ hoặc 了 sau động từ)', viet: 'Câu chữ 把 bắt buộc phải có thành phần kết quả sau động từ.' }
    ]
  },
  'mat-6': {
    type: 'quiz',
    title: 'Trích đoạn Câu hỏi Đọc hiểu Mẫu Đề Thi CTI HSK 3',
    subtitle: 'Mô phỏng đề thi thật CTI Hanban',
    question: '阅读理解: "喂，你到哪儿了？大家都在等你呢。"',
    pinyin: 'Wèi, nǐ dào nǎr le? Dàjiā dōu zài děng nǐ ne.',
    translation: 'A lô, cậu đến đâu rồi? Mọi người đều đang đợi cậu đấy.',
    options: [
      { text: 'A. 我在出租车上，马上就到！ (Tôi đang trên taxi, tới liền!)', correct: true },
      { text: 'B. 明天下午见吧。 (Hẹn chiều mai gặp nhé.)', correct: false },
      { text: 'C. 这个苹果太贵了。 (Táo này đắt quá.)', correct: false }
    ],
    explanation: 'Đáp án A phù hợp nhất với ngữ cảnh trả lời qua điện thoại khi được hỏi vị trí đang di chuyển.'
  },
  'mat-8': {
    type: 'cognate',
    title: 'Trích đoạn Quy Tắc Chuyển Phụ Âm Đầu Hán - Việt Sang Pinyin',
    subtitle: 'Bí quyết ghi nhớ từ vựng siêu tốc',
    rules: [
      { viInitial: 'Âm B trong tiếng Việt', zhInitial: 'Âm b / p trong Pinyin', example: 'Bảo (bǎo 宝), Bất (bù 不), Binh (bīng 兵), Biến (biàn 变)' },
      { viInitial: 'Âm C/K trong tiếng Việt', zhInitial: 'Âm j / q / g / k', example: 'Kim (jīn 金), Cung (gōng 宫), Quốc (guó 国), Cảm (gǎn 感)' },
      { viInitial: 'Âm Đ/T trong tiếng Việt', zhInitial: 'Âm d / t trong Pinyin', example: 'Địa (dì 地), Đại (dà 大), Thông (tōng 通), Thiên (tiān 天)' },
      { viInitial: 'Âm H trong tiếng Việt', zhInitial: 'Âm h / x trong Pinyin', example: 'Học (xué 学), Hảo (hǎo 好), Hoa (huā 花), Hạnh (xìng 幸)' }
    ]
  },
  'mat-9': {
    type: 'mizige',
    title: 'Mô Phỏng Vở Kẻ Ô Mễ Tự (米字格) Chuẩn A4 Khang Hy',
    subtitle: 'Vĩnh tự bát pháp (永字八法)',
    character: '永',
    pinyin: 'yǒng (Vĩnh - vĩnh cửu)',
    note: 'Chữ "Vĩnh" (永) chứa trọn vẹn 8 nét bút cơ bản trong thư pháp chữ Hán: Điểm (chấm), Hoành (ngang), Thụ (sổ thẳng), Câu (móc), Đề (hất), Phiệt (phẩy dài), Đoản phiệt (phẩy ngắn), Nại (mác).'
  },
  'mat-10': {
    type: 'idioms',
    title: 'Trích đoạn Tuyển tập Thành Ngữ 4 Chữ (成语) Kinh Điển',
    subtitle: 'Thành ngữ thông dụng trong giao tiếp và phim ảnh',
    items: [
      { idiom: '一心一意', pinyin: 'yì xīn yí yì', viet: 'Một lòng một dạ', meaning: 'Toàn tâm toàn ý làm một việc.' },
      { idiom: '马到成功', pinyin: 'mǎ dào chéng gōng', viet: 'Mã đáo thành công', meaning: 'Chúc việc gì cũng thành công ngay từ đầu.' },
      { idiom: '入乡随俗', pinyin: 'rù xiāng suí sú', viet: 'Nhập gia tùy tục', meaning: 'Đến nơi nào thì theo phong tục nơi ấy.' },
      { idiom: '半途而废', pinyin: 'bàn tú ér fèi', viet: 'Bỏ dở nửa chừng', meaning: 'Làm việc thiếu kiên nhẫn, bỏ cuộc giữa chừng.' }
    ]
  }
};

// Quick suggestions for rapid material addition
export const QUICK_MATERIAL_SUGGESTIONS = [
  {
    title: '500 Mẫu Câu Giao Tiếp Khẩu Ngữ Tiếng Trung Đời Sống Hàng Ngày',
    category: 'Thành ngữ & Giao tiếp',
    level: 'HSK 2',
    skills: ['Nói & Khẩu ngữ', 'Nghe hiểu', 'Giao tiếp'],
    format: 'PDF + MP3',
    fileSize: '500 mẫu câu thực tế',
    author: 'HanziGo Biên soạn',
    publisher: 'Ban Đào tạo HanziGo',
    language: 'Song ngữ Trung - Việt',
    license: 'Tài liệu Giáo dục Mở HanziGo',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 2.1 (Bài 201 - 204)',
    verificationNotes: 'Tổng hợp mẫu câu sinh hoạt gia đình, mua sắm, chào hỏi hàng ngày chuẩn khẩu ngữ.',
    downloadUrl: '/500-cau-giao-tiep-tieng-trung-phan-xa.html',
    sourceUrl: '/500-cau-giao-tiep-tieng-trung-phan-xa.html',
    description: 'Tuyển tập 500 câu khẩu ngữ ngắn gọn, thông dụng nhất dùng khi đi chợ, gọi món, đi taxi, làm quen, chúc tụng và xử lý tình huống giao tiếp thường ngày.',
    tags: 'Giao tiếp, Khẩu ngữ, HSK 2, Đàm thoại'
  },
  {
    title: 'Sổ Tay 100 Cấu Trúc Ngữ Pháp Tiếng Trung Trọng Tâm HSK 3 - 4',
    category: 'Ngữ pháp chuyên sâu',
    level: 'HSK 3',
    skills: ['Ngữ pháp', 'Đọc hiểu'],
    format: 'Bách khoa Ngữ pháp',
    fileSize: '100 cấu trúc ngữ pháp',
    author: 'Khoa Ngôn ngữ BLCU',
    publisher: 'AllSet Chinese Grammar Wiki',
    language: 'Song ngữ Trung - Việt',
    license: 'Creative Commons CC BY-NC-SA 3.0',
    verificationStatus: 'verified_oer',
    relatedLessonId: 'Module 3.1 - 3.4 (Bài 301 - 320)',
    verificationNotes: 'Bách khoa toàn thư ngữ pháp tiếng Trung chuẩn học thuật quốc tế.',
    downloadUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points',
    sourceUrl: 'https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points',
    description: 'Tổng hợp chi tiết các mẫu câu liên từ, phó từ chỉ mức độ, câu chữ 把, câu chữ 被, bổ ngữ xu hướng kép và cách phân biệt các cặp từ đồng nghĩa.',
    tags: 'Ngữ pháp, HSK 3, Luyện thi, Cấu trúc câu'
  },
  {
    title: 'Bộ Đề Thi Thử HSK 2 Đầy Đủ Đọc Hiểu & Nghe Kèm Đáp Án Chi Tiết',
    category: 'Đề thi HSK',
    level: 'HSK 2',
    skills: ['Luyện thi HSK', 'Nghe hiểu', 'Đọc hiểu'],
    format: 'Đề thi Chính thức',
    fileSize: '5 bộ đề thi chuẩn',
    author: 'CTI Chinesetest',
    publisher: 'Chinese Testing International',
    language: 'Tiếng Trung Giản thể',
    license: 'Đề thi Khảo thí Hanban / CTI',
    verificationStatus: 'verified_official',
    relatedLessonId: 'Module 2.4 (Bài 220)',
    verificationNotes: 'Đề thi mô phỏng 100% định dạng thi chuẩn hóa của Khổng Tử Học Viện.',
    downloadUrl: 'https://www.chinesetest.cn/godownload.do',
    sourceUrl: 'https://www.chinesetest.cn/godownload.do',
    description: 'Trọn bộ 5 đề thi thử mô phỏng 100% cấu trúc đề thi thật của Hanban / CTI. Có file nghe giọng Bắc Kinh chuẩn và bảng giải thích đáp án chi tiết từng câu.',
    tags: 'Đề thi, HSK 2, Có đáp án, File nghe MP3'
  }
];

export const SKILL_LABEL_MAP = {
  mixed: 'Tổng hợp đa kỹ năng',
  listening: 'Nghe hiểu',
  speaking: 'Nói & Khẩu ngữ',
  reading: 'Đọc hiểu',
  writing: 'Viết chữ',
  vocabulary: 'Từ vựng',
  grammar: 'Ngữ pháp',
};

export const ACADEMIC_CATEGORY_ICONS = {
  textbooks_courses: '📖',
  pinyin_pronunciation: '🎙️',
  chinese_characters: '✍️',
  vocabulary: '🗂️',
  grammar: '📑',
  listening_speaking: '🎧',
  reading_writing: '📝',
  hsk_preparation: '🏆',
  culture_communication: '🌏',
};

export const FORMAT_FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pdf', label: '📄 Sách / PDF' },
  { id: 'audio', label: '🎧 File Audio MP3' },
  { id: 'interactive', label: '💻 Tương tác / Web' },
  { id: 'print', label: '🖨️ In ấn A4' },
];
