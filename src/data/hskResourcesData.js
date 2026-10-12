/**
 * =========================================================================
 * MASTER LEARNING RESOURCES DATASET — HANZIGO RESOURCE HUB (PHASE 4)
 * =========================================================================
 * Thư viện tài nguyên học tiếng Trung miễn phí, toàn diện và có thể tìm kiếm.
 * Phục vụ người học Việt Nam từ sơ cấp đến cao cấp (HSK 1 đến HSK 6 & HSK 7-9).
 *
 * PHÂN LOẠI 9 DANH MỤC HỌC THUẬT (A - I):
 * A. textbooks_courses      : Giáo trình & Khóa học chuẩn
 * B. pinyin_pronunciation   : Ngữ âm & Pinyin
 * C. chinese_characters     : Hán tự & Bộ thủ
 * D. vocabulary             : Từ vựng theo cấp độ & chủ đề
 * E. grammar                : Ngữ pháp & Cú pháp
 * F. listening_speaking     : Nghe & Nói thực chiến
 * G. reading_writing        : Đọc & Viết toàn diện
 * H. hsk_preparation        : Luyện thi HSK & Đề mẫu
 * I. culture_communication  : Văn hóa & Giao tiếp thực tế
 *
 * CHÍNH SÁCH BẢN QUYỀN & LƯU TRỮ MINH BẠCH:
 * - official_published : Đề mẫu và đề cương chính thức CTI/CLEC (chỉ liên kết gốc).
 * - hanzigo_original   : Tài nguyên độc quyền do HanziGo biên soạn (CC BY-NC-SA 4.0).
 * - open_license       : Tài nguyên giáo dục mở (OER, Creative Commons).
 * - free_external      : Tài liệu miễn phí truy cập bên ngoài (chỉ lưu metadata & URL).
 * =========================================================================
 */

export const RESOURCE_ACADEMIC_CATEGORIES = [
  {
    id: 'textbooks_courses',
    code: 'A',
    nameVi: 'Giáo trình & Khóa học',
    nameCn: '教材与课程',
    icon: 'BookOpen',
    description: 'Giáo trình Chuẩn HSK (BLCU), khóa học mở từ các đại học uy tín và đề cương đào tạo quốc tế.'
  },
  {
    id: 'pinyin_pronunciation',
    code: 'B',
    nameVi: 'Ngữ âm & Pinyin',
    nameCn: '语音与拼音',
    icon: 'Mic',
    description: '21 thanh mẫu, 36 vận mẫu, 4 thanh điệu, quy tắc biến điệu và âm thanh bản ngữ chuẩn Bắc Kinh.'
  },
  {
    id: 'chinese_characters',
    code: 'C',
    nameVi: 'Hán tự & Bộ thủ',
    nameCn: '汉字与部首',
    icon: 'PenTool',
    description: '214 bộ thủ Khang Hy, quy tắc bút thuận, chiết tự, vở luyện viết ô Mễ tự/Điền tự chuẩn A4.'
  },
  {
    id: 'vocabulary',
    code: 'D',
    nameVi: 'Từ vựng theo cấp độ & chủ đề',
    nameCn: '分类词汇',
    icon: 'Layers',
    description: 'Từ vựng HSK 1-6 & 3.0, câu ví dụ, âm Hán Việt và bộ flashcard ôn tập thông minh.'
  },
  {
    id: 'grammar',
    code: 'E',
    nameVi: 'Ngữ pháp & Cú pháp',
    nameCn: '语法与句型',
    icon: 'FileText',
    description: 'Công thức câu, cú pháp cốt lõi, so sánh cách dùng từ và phân tích bẫy lỗi sai của người Việt.'
  },
  {
    id: 'listening_speaking',
    code: 'F',
    nameVi: 'Nghe & Nói thực chiến',
    nameCn: '听力与口语',
    icon: 'Headphones',
    description: 'Audio bản ngữ, hội thoại theo ngữ cảnh, bài tập shadowing và 500 câu khẩu ngữ phản xạ.'
  },
  {
    id: 'reading_writing',
    code: 'G',
    nameVi: 'Đọc & Viết toàn diện',
    nameCn: '阅读与写作',
    icon: 'BookCheck',
    description: 'Bài đọc phân cấp, sắp xếp từ thành câu, viết đoạn văn và tiêu chí chấm viết HSK.'
  },
  {
    id: 'hsk_preparation',
    code: 'H',
    nameVi: 'Luyện thi HSK & Đề mẫu',
    nameCn: 'HSK备考与真题',
    icon: 'Award',
    description: 'Đề mẫu chính thức CTI/CLEC, đề cương khảo thí, chiến thuật thi và bộ máy thi thử HanziGo.'
  },
  {
    id: 'culture_communication',
    code: 'I',
    nameVi: 'Văn hóa & Giao tiếp thực tế',
    nameCn: '文化与实用交际',
    icon: 'Globe',
    description: 'Tiếng Trung đời sống, thương mại, du lịch, phong tục lễ tết và ngữ cảnh giao tiếp thực chiến.'
  }
];

export const HSK_RESOURCES = [
  // =========================================================================
  // CATEGORY A: GIÁO TRÌNH & KHÓA HỌC (TEXTBOOKS & COURSES)
  // =========================================================================
  {
    id: 'res-blcu-standard-course-hsk1',
    title: 'Giáo Trình Chuẩn HSK 1 - Standard Course (Đại Học Ngôn Ngữ Bắc Kinh BLCU)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'textbooks_courses',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.blcup.com/',
    source_author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    publisher: 'BLCU Press & Hanban',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Educational Textbook Reference (Fair Use Citation)',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'https://www.hsk.academy/en/hsk_1',
    description: 'Bộ giáo trình chuẩn mực quốc tế dành cho người mới bắt đầu học tiếng Trung từ con số 0. Cung cấp 150 từ vựng cốt lõi, ngữ âm Pinyin và các chủ đề chào hỏi, giới thiệu bản thân.',
    learning_objectives: [
      'Nắm vững 150 từ vựng và 45 điểm ngữ pháp HSK 1',
      'Đọc hiểu và giao tiếp chào hỏi, giới thiệu bản thân, gia đình và giá cả cơ bản',
      'Làm quen định dạng câu hỏi bài thi HSK 1'
    ],
    related_lesson_ids: ['l-101', 'l-102', 'l-103', 'l-104', 'l-105'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['Giáo trình chuẩn', 'BLCU', 'HSK 1', 'Nhập môn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-blcu-standard-course-hsk2',
    title: 'Giáo Trình Chuẩn HSK 2 - Standard Course (Sách Bài Học & Đàm Thoại)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    academic_category: 'textbooks_courses',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.blcup.com/',
    source_author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    publisher: 'BLCU Press & Hanban',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Educational Textbook Reference',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'https://www.hsk.academy/en/hsk_2',
    description: 'Giáo trình chuẩn tiếp nối cấp độ 1, trang bị thêm 150 từ vựng mới (tổng 300 từ) và các cấu trúc đàm thoại quen thuộc: mua sắm, gọi món nhà hàng, thời tiết và phương tiện đi lại.',
    learning_objectives: [
      'Tích lũy 300 từ vựng HSK 2 và các câu so sánh 比',
      'Giao tiếp sinh hoạt hàng ngày không cần dịch nhẩm tiếng Việt',
      'Chuẩn bị thi đỗ HSK 2 với điểm số trên 180/200'
    ],
    related_lesson_ids: ['l-106', 'l-107', 'l-108', 'l-109', 'l-110'],
    related_exam_ids: ['hsk2-mock-01'],
    tags: ['Giáo trình chuẩn', 'BLCU', 'HSK 2', 'Đàm thoại'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-blcu-standard-course-hsk3',
    title: 'Giáo Trình Chuẩn HSK 3 - Standard Course (Trung Cấp 1 Toàn Diện)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    academic_category: 'textbooks_courses',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.blcup.com/',
    source_author: 'Khổng Tử Học Viện & BLCU',
    publisher: 'BLCU Press',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Educational Textbook Reference',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'https://www.hsk.academy/en/hsk_3',
    description: 'Cột mốc chuyển tiếp quan trọng lên trình độ Trung cấp với 600 từ vựng cốt lõi. Giúp người học tự tin du lịch tự túc, đặt phòng khách sạn, làm việc văn phòng cơ bản và thi đậu HSK 3.',
    learning_objectives: [
      'Làm chủ 600 từ vựng và câu chữ 把, câu chữ 被',
      'Độc lập xử lý trọn vẹn chuyến du lịch Trung Quốc 3-5 ngày',
      'Thực hành làm bài viết và sắp xếp từ thành câu'
    ],
    related_lesson_ids: ['l-111', 'l-112', 'l-113', 'l-114', 'l-115'],
    related_exam_ids: ['hsk3-mock-01'],
    tags: ['Giáo trình chuẩn', 'BLCU', 'HSK 3', 'Trung cấp'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-blcu-standard-course-hsk4',
    title: 'Giáo Trình Chuẩn HSK 4 - Standard Course (Tập Thượng & Tập Hạ)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    academic_category: 'textbooks_courses',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.blcup.com/',
    source_author: 'Đại học Ngôn ngữ Bắc Kinh (BLCU)',
    publisher: 'BLCU Press',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Educational Textbook Reference',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'https://www.hsk.academy/en/hsk_4',
    description: 'Giáo trình chuẩn bị năng lực tiếng Trung độc lập với 1200 từ vựng. Thảo luận các chủ đề sâu về xã hội, giáo dục, tâm lý, công nghệ và làm việc công sở.',
    learning_objectives: [
      'Chinh phục 1200 từ vựng và viết câu theo tranh ảnh',
      'Đọc hiểu các bài luận ngắn 300-400 chữ với tốc độ cao',
      'Đủ điều kiện xin học bổng du học đại học tại Trung Quốc'
    ],
    related_lesson_ids: ['l-116', 'l-117', 'l-118', 'l-119', 'l-120'],
    related_exam_ids: ['hsk4-mock-01'],
    tags: ['Giáo trình chuẩn', 'BLCU', 'HSK 4', 'Độc lập'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-pku-coursera-hsk1',
    title: 'Khóa Học Mở Trực Tuyến Chuẩn Bị HSK 1 - Đại Học Bắc Kinh (Peking University)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'textbooks_courses',
    category: 'video',
    skill: 'listening',
    format: 'web_link',
    source_url: 'https://www.coursera.org/learn/hsk-1',
    source_author: 'Peking University (Đại học Bắc Kinh)',
    publisher: 'Coursera & Peking University',
    language_of_instruction: 'Song ngữ Trung - Anh (kèm phụ đề)',
    license_status: 'Coursera Open Courseware (Audit Free)',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Chuỗi bài giảng video chuẩn bị HSK 1 trực quan do các giáo sư Đại học Bắc Kinh biên soạn, tập trung vào ngữ âm, từ vựng sinh hoạt và phản xạ hội thoại.',
    learning_objectives: [
      'Nghe giảng ngữ âm từ các giảng viên hàng đầu Đại học Bắc Kinh',
      'Luyện tập phát âm theo khẩu hình chuẩn',
      'Kiểm tra định kỳ theo từng tuần học'
    ],
    related_lesson_ids: ['l-101', 'l-102'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['Đại học Bắc Kinh', 'Video bài giảng', 'Miễn phí audit'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-clec-chinese-plus-curriculum',
    title: 'Khung Chương Trình Đào Tạo Tiếng Trung Trực Tuyến - CLEC Chinese Plus',
    level: 'All',
    exam_version: 'HSK 3.0-2021',
    academic_category: 'textbooks_courses',
    category: 'document',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.chinese.cn/',
    source_author: 'Trung tâm Hợp tác Giao lưu Ngôn ngữ Trung - Ngoại (CLEC)',
    publisher: 'CLEC / Chinese Plus',
    language_of_instruction: 'Tiếng Trung giản thể',
    license_status: 'Official Educational Guidelines',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Hệ thống chương trình giảng dạy và tài nguyên số chính thức do CLEC quản lý, cung cấp định hướng chuẩn mực về chuẩn năng lực 3 giai đoạn 9 cấp bậc mới.',
    learning_objectives: [
      'Hiểu rõ định hướng giảng dạy tiếng Trung quốc tế hiện đại',
      'Tiếp cận các nguồn học liệu chính thống do CLEC tuyển chọn'
    ],
    related_lesson_ids: ['l-101', 'l-106', 'l-111'],
    related_exam_ids: [],
    tags: ['CLEC', 'Chinese Plus', 'Chương trình chính thức'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY B: NGỮ ÂM & PINYIN (PINYIN & PRONUNCIATION)
  // =========================================================================
  {
    id: 'res-hanzigo-pinyin-chart',
    title: 'Bảng Ngữ Âm Pinyin Toàn Diện: Trọn Bộ 36 Vận Mẫu, 23 Thanh Mẫu & Phát Âm Chuẩn',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'pinyin_pronunciation',
    category: 'vocab_sheet',
    skill: 'listening',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/bang-ngu-am-pinyin-toan-dien',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/bang-ngu-am-pinyin-toan-dien.html',
    description: 'Bảng tra cứu Pinyin tương tác đầy đủ 6 nguyên âm đơn, 13 vận mẫu kép, 16 vận mẫu mũi, 1 vận mẫu uốn lưỡi er và 23 thanh mẫu có tích hợp phát âm bản ngữ và quy tắc biến điệu thanh 3.',
    learning_objectives: [
      'Phát âm chuẩn xác 21 thanh mẫu và 36 vận mẫu tiếng Trung',
      'Phân biệt rõ âm bật hơi p, t, k, q, ch, c với âm không bật hơi',
      'Nắm vững quy tắc biến điệu hai thanh 3 đi liền nhau và biến điệu chữ 不, 一'
    ],
    related_lesson_ids: ['l-101', 'l-102'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['Pinyin', 'Phát âm chuẩn', 'Vận mẫu & Thanh mẫu', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-cti-pronunciation-audio-guide',
    title: 'Tài Liệu Hướng Dẫn Ngữ Âm & Phát Âm Chuẩn Bắc Kinh - CTI Chinesetest',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'pinyin_pronunciation',
    category: 'audio',
    skill: 'listening',
    format: 'audio_mp3',
    source_url: 'http://www.chinesetest.cn/godownload.do',
    source_author: 'CTI (Chinese Testing International)',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung phổ thông',
    license_status: 'Official Public Educational Sample Material',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.chinesetest.cn/godownload.do',
    description: 'Bộ âm thanh mẫu phát âm chuẩn giọng phát thanh viên Bắc Kinh phục vụ kỳ thi đánh giá năng lực ngôn ngữ, bao gồm 4 thanh điệu cao độ chuẩn 5-5, 3-5, 2-1-4, 5-1.',
    learning_objectives: [
      'Luyện tai nghe nhận diện 4 thanh điệu trong môi trường phòng thi',
      'Phân biệt các cặp âm khó: z/zh, c/ch, s/sh, j/q/x'
    ],
    related_lesson_ids: ['l-101'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['CTI', 'Audio phát âm', 'Chuẩn Bắc Kinh'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-mandarin-ac-pinyin-table',
    title: 'Bảng Phối Âm Toàn Bộ Âm Tiết Tiếng Trung - Mandarin.ac.cn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'pinyin_pronunciation',
    category: 'document',
    skill: 'listening',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/resources/',
    source_author: 'Mandarin.ac.cn Open Resources',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource (OER)',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Bảng ma trận phối âm hơn 400 âm tiết khả dụng trong tiếng Hán hiện đại kèm âm thanh nhấp để nghe, hỗ trợ tra cứu các trường hợp đặc biệt như ju, qu, xu (bỏ dấu 2 chấm).',
    learning_objectives: [
      'Tra cứu tức thì bất kỳ âm tiết nào trong hệ thống ngữ âm Pinyin',
      'Ghi nhớ quy tắc viết tắt ui, iu, un và quy tắc lược bỏ dấu ü'
    ],
    related_lesson_ids: ['l-101', 'l-102'],
    related_exam_ids: [],
    tags: ['Mandarin.ac.cn', 'Ma trận phối âm', 'Bảng Pinyin'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-blcu-vietnamese-pronunciation-pitfalls',
    title: 'Cẩm Nang Khắc Phục Lỗi Phát Âm Kinh Điển Cho Người Việt Học Tiếng Trung (BLCU)',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'pinyin_pronunciation',
    category: 'document',
    skill: 'speaking',
    format: 'pdf',
    source_url: 'http://www.blcup.com/',
    source_author: 'GS. BLCU & Chuyên gia Ngôn ngữ học Đối chiếu',
    publisher: 'BLCU Press',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Academic Comparative Linguistics Research',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Nghiên cứu đối chiếu ngữ âm tiếng Hán và tiếng Việt: cảnh báo lỗi đọc thanh 4 thành dấu huyền, lỗi phát âm âm uốn lưỡi zh/ch/sh, và mẹo giữ luồng hơi khi đọc âm bật hơi.',
    learning_objectives: [
      'Sửa dứt điểm thói quen phát âm thanh 4 thành dấu huyền tiếng Việt',
      'Làm chủ khẩu hình uốn lưỡi và cuống họng của các âm khó'
    ],
    related_lesson_ids: ['l-101', 'l-102'],
    related_exam_ids: [],
    tags: ['Lỗi phát âm', 'Đối chiếu Hán-Việt', 'BLCU'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY C: HÁN TỰ & BỘ THỦ (CHINESE CHARACTERS & RADICALS)
  // =========================================================================
  {
    id: 'res-hanzigo-214-radicals',
    title: 'Cẩm Nang 214 Bộ Thủ Chữ Hán Khang Hy Tương Tác: Âm Hán-Việt, Pinyin & Bút Thuận',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'chinese_characters',
    category: 'document',
    skill: 'writing',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/214-bo-thu-chu-han',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Research Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/214-bo-thu-chu-han.html',
    description: 'Bảng tra cứu 214 bộ thủ Khang Hy độc quyền phân theo số nét từ 1 đến 17 nét, đầy đủ âm Hán Việt, phiên âm Pinyin, số nét bút, ý nghĩa tượng hình cổ và các chữ Hán cấu thành phổ biến.',
    learning_objectives: [
      'Nhận diện 50 bộ thủ thường gặp nhất chiếm 75% cấu tạo chữ Hán',
      'Hiểu nguồn gốc tượng hình để ghi nhớ chữ Hán không bị quên',
      'Tra cứu từ điển bằng bộ thủ chuẩn xác'
    ],
    related_lesson_ids: ['l-101', 'l-103', 'l-104'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01'],
    tags: ['214 Bộ thủ', 'Chiết tự', 'Hán tự', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-mizige-sheet',
    title: 'Vở Luyện Viết Chữ Hán Ô Mễ Tự (米字格) Chuẩn A4 Vector In Ấn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'chinese_characters',
    category: 'document',
    skill: 'writing',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/vo-tap-viet-chu-han-a4',
    source_author: 'Ban Thiết Kế Đồ Họa HanziGo',
    publisher: 'HanziGo Publishing Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/vo-tap-viet-chu-han-a4.html',
    description: 'Trang kẻ ô mễ tự 8 hướng chuẩn mực kèm dòng ghi Pinyin, căn lề tối ưu cho máy in A4 để người học in ra giấy luyện nét bút mực, cân đối trọng tâm chữ Hán.',
    learning_objectives: [
      'Luyện viết chữ Hán cân đối vào đúng tâm ô mễ tự',
      'Áp dụng 7 quy tắc bút thuận vàng (ngang trước sổ sau, phẩy trước mác sau)'
    ],
    related_lesson_ids: ['l-101', 'l-102', 'l-103'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Tập viết A4', 'Ô Mễ tự', 'In ấn miễn phí', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-tianzige-sheet',
    title: 'Vở Luyện Viết Chữ Hán Ô Điền Tự (田字格) Chuẩn Khảo Thí Quốc Tế A4',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'chinese_characters',
    category: 'document',
    skill: 'writing',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/vo-luyen-viet-o-dien-tu-tianzige',
    source_author: 'Ban Thiết Kế Đồ Họa HanziGo',
    publisher: 'HanziGo Publishing Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/vo-luyen-viet-o-dien-tu-tianzige.html',
    description: 'Trang kẻ ô điền tự 4 phần đối xứng chuẩn đề thi viết HSK giấy, hỗ trợ in chữ mẫu nét mờ để đồ theo nét bút, giúp nét viết thẳng thớm, ngay ngắn.',
    learning_objectives: [
      'Làm quen mẫu giấy thi viết chính thức của kỳ thi HSK trên giấy',
      'Rèn luyện tốc độ viết tay chữ Hán phục vụ bài thi viết HSK 3 - 6'
    ],
    related_lesson_ids: ['l-104', 'l-105', 'l-111'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Tập viết A4', 'Ô Điền tự', 'Chuẩn phòng thi', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-clec-stroke-order-standard',
    title: 'Quy Chuẩn Quốc Gia Về Thứ Tự Nét Bút & Kết Cấu Chữ Hán Thông Dụng (GF0025-2021)',
    level: 'All',
    exam_version: 'HSK 3.0-2021',
    academic_category: 'chinese_characters',
    category: 'document',
    skill: 'writing',
    format: 'web_link',
    source_url: 'http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/202103/t20210331_523671.html',
    source_author: 'Bộ Giáo dục Trung Quốc & Ủy ban Ngôn ngữ Quốc gia',
    publisher: 'Ministry of Education of PRC',
    language_of_instruction: 'Tiếng Trung giản thể',
    license_status: 'Official National Language Standard',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Văn bản quy định chuẩn xác về số nét, thứ tự nét viết và bộ thủ phân định của 3,000 chữ Hán thường dùng trong hệ thống giáo dục quốc tế HSK mới.',
    learning_objectives: [
      'Tra cứu thứ tự nét bút chính xác không gây tranh cãi của các chữ Hán khó',
      'Nắm bắt kết cấu bao bọc, nửa bao bọc và kết cấu ghép chữ'
    ],
    related_lesson_ids: ['l-101', 'l-105'],
    related_exam_ids: [],
    tags: ['Quy chuẩn quốc gia', 'Bút thuận', 'Bộ Giáo dục Trung Quốc'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY D: TỪ VỰNG THEO CẤP ĐỘ & CHỦ ĐỀ (VOCABULARY)
  // =========================================================================
  {
    id: 'res-cti-official-vocab-list-2015',
    title: 'Danh Mục 5,000 Từ Vựng HSK 1 - 6 Bản Công Bố Chính Thức CTI Chinesetest',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'vocabulary',
    category: 'document',
    skill: 'vocabulary',
    format: 'pdf',
    source_url: 'http://www.chinesetest.cn/godownload.do',
    source_author: 'CTI (Chinese Testing International)',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung & Phiên âm Pinyin',
    license_status: 'Official Public Syllabus Vocabulary',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.chinesetest.cn/godownload.do',
    description: 'Bảng tra cứu từ vựng đầy đủ 6 cấp độ truyền thống: HSK 1 (150 từ), HSK 2 (300 từ), HSK 3 (600 từ), HSK 4 (1200 từ), HSK 5 (2500 từ), HSK 6 (5000 từ).',
    learning_objectives: [
      'Kiểm tra tỷ lệ phủ từ vựng theo từng cấp độ đăng ký thi',
      'Định lượng lộ trình học từ vựng mỗi ngày'
    ],
    related_lesson_ids: ['l-101', 'l-106', 'l-111', 'l-116'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01', 'hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Từ vựng chính thức', '5000 từ', 'CTI Chinesetest'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-clec-hsk30-standards',
    title: 'Tiêu Chuẩn Đẳng Cấp Năng Lực Tiếng Hán Giáo Dục Quốc Tế (Đề Cương HSK 3.0)',
    level: 'All',
    exam_version: 'HSK 3.0-2021',
    academic_category: 'vocabulary',
    category: 'document',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.chinese.cn/',
    source_author: 'Bộ Giáo dục Trung Quốc & CLEC',
    publisher: 'CLEC / Chinese.cn',
    language_of_instruction: 'Tiếng Trung giản thể',
    license_status: 'Official Government Educational Standard',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Văn bản tiêu chuẩn chính thức của kỳ thi HSK 3.0 (3 giai đoạn, 9 cấp bậc), công bố quy chuẩn âm tiết, chữ Hán, từ vựng (11,092 từ) và điểm ngữ pháp cho người học tiếng Trung toàn cầu.',
    learning_objectives: [
      'Nắm bắt danh mục 11,092 từ vựng chuẩn mới HSK 3.0',
      'Đối chiếu sự khác biệt số lượng từ giữa HSK 2.0 và 3.0'
    ],
    related_lesson_ids: ['l-101', 'l-111'],
    related_exam_ids: [],
    tags: ['HSK 3.0', 'Tiêu chuẩn quốc gia', 'Đề cương từ vựng'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-mandarin-ac-topic-flashcards',
    title: 'Bộ Flashcard Từ Vựng Tiếng Trung Phân Theo 25 Chủ Đề Đời Sống - Mandarin.ac.cn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'vocabulary',
    category: 'document',
    skill: 'vocabulary',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/resources/',
    source_author: 'Mandarin.ac.cn Editorial Team',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Thẻ từ vựng chủ đề trực quan: Ẩm thực nhà hàng, Đi lại & Sân bay, Khách sạn & Du lịch, Mua sắm & Thanh toán điện tử, Y tế & Sức khỏe.',
    learning_objectives: [
      'Ghi nhớ từ vựng theo cụm chủ đề liên quan để tăng phản xạ',
      'Ứng dụng ngay vào các tình huống thực tế sinh hoạt'
    ],
    related_lesson_ids: ['l-106', 'l-107', 'l-108'],
    related_exam_ids: ['hsk2-mock-01'],
    tags: ['Flashcard', 'Từ vựng chủ đề', 'Mandarin.ac.cn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-hanviet-etymology',
    title: 'Bảng Quy Tắc Chuyển Âm Hán - Việt & Pinyin: Bí Quyết Đột Phá 3,000 Từ Vựng',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'vocabulary',
    category: 'vocab_sheet',
    skill: 'vocabulary',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/bang-doi-chieu-han-viet',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/bang-doi-chieu-han-viet.html',
    description: 'Quy luật chuyển âm thanh mẫu, vận mẫu và thanh điệu giữa từ Hán Việt và tiếng Trung phổ thông, giúp người học Việt Nam đoán nghĩa và phát âm hàng ngàn từ mới tức thì.',
    learning_objectives: [
      'Nhân đôi vốn từ vựng bằng cách chuyển đổi từ Hán Việt sang Pinyin',
      'Nắm bắt quy tắc chuyển thanh điệu: Dấu sắc/hỏi sang thanh 2 hoặc thanh 1'
    ],
    related_lesson_ids: ['l-103', 'l-105', 'l-111'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Hán Việt', 'Chuyển âm Pinyin', 'Đoán nghĩa từ', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY E: NGỮ PHÁP & CÚ PHÁP (GRAMMAR & SYNTAX)
  // =========================================================================
  {
    id: 'res-allset-grammar-wiki',
    title: 'Chinese Grammar Wiki (AllSet Learning) - Bách Khoa Toàn Thư Ngữ Pháp Toàn Diện',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'grammar',
    category: 'document',
    skill: 'grammar',
    format: 'web_link',
    source_url: 'https://resources.allsetlearning.com/chinese/grammar/',
    source_author: 'John Pasden & AllSet Learning Research Team',
    publisher: 'AllSet Learning',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA 3.0)',
    permission_status: 'linked_only',
    host_type: 'open_license',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Cơ sở dữ liệu ngữ pháp tiếng Trung toàn diện nhất thế giới được xếp theo chuẩn CEFR (A1 - C1) và HSK 1 - 6, kèm công thức cấu trúc, so sánh và hàng chục câu ví dụ cụ thể.',
    learning_objectives: [
      'Tra cứu chi tiết mọi điểm ngữ pháp từ A1 (sơ cấp) đến C1 (cao cấp)',
      'Xem hàng trăm ví dụ thực tế có phân tích ngữ cảnh'
    ],
    related_lesson_ids: ['l-101', 'l-106', 'l-111', 'l-116'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01', 'hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['AllSet Learning', 'Chinese Grammar Wiki', 'Ngữ pháp A1-C1'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-grammar-handbook',
    title: 'Cẩm Nang 30 Cấu Trúc Ngữ Pháp Trọng Tâm HSK 1-3 Kèm Bẫy Lỗi Sai & Âm Thanh',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'grammar',
    category: 'grammar_guide',
    skill: 'grammar',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/so-tay-ngu-phap-hsk-cot-loi',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/so-tay-ngu-phap-hsk-cot-loi.html',
    description: 'Tài liệu độc quyền của HanziGo tổng hợp 30 cấu trúc ngữ pháp xương sống từ HSK 1 đến HSK 3: câu chữ 把/被, câu so sánh 比, câu liên động, bổ ngữ phương hướng/khả năng kèm phân tích bẫy lỗi sai thường gặp của người Việt.',
    learning_objectives: [
      'Nắm chắc 30 công thức ngữ pháp cốt lõi thường xuất hiện trong đề thi',
      'Tránh các bẫy ngữ pháp kinh điển do ảnh hưởng của tiếng mẹ đẻ'
    ],
    related_lesson_ids: ['l-101', 'l-106', 'l-111'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01', 'hsk3-mock-01'],
    tags: ['HanziGo biên soạn', 'Ngữ pháp HSK', 'Bẫy lỗi sai', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hsk-companion-grammar',
    title: 'HSK Companion Grammar Formulas - Tổng Hợp Công Thức Cú Pháp HSK 1 - 4',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'grammar',
    category: 'document',
    skill: 'grammar',
    format: 'web_link',
    source_url: 'https://hskcompanion.org/',
    source_author: 'HSK Companion Open Research Group',
    publisher: 'hskcompanion.org',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Bảng tổng hợp công thức ngữ pháp rút gọn theo dạng toán học (S + V + O, S + 把 + O + V + Kết quả) giúp người học ghi nhớ nhanh trước khi bước vào phòng thi.',
    learning_objectives: [
      'Ghi nhớ cấu trúc ngữ pháp dạng công thức nhanh gọn',
      'Tự kiểm tra bằng các bài tập điền từ và sửa câu sai'
    ],
    related_lesson_ids: ['l-106', 'l-111'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Công thức ngữ pháp', 'HSK Companion', 'Rút gọn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-comparative-grammar-ba-bei',
    title: 'Chuyên Đề Phân Biệt Ngữ Pháp: Câu Chữ 把 (Xử Lý) vs Câu Chữ 被 (Bị Động) & Lỗi Sai',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    academic_category: 'grammar',
    category: 'grammar_guide',
    skill: 'grammar',
    format: 'document',
    source_url: 'https://hanzigo.com/materials/so-tay-ngu-phap-hsk-cot-loi',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/so-tay-ngu-phap-hsk-cot-loi.html',
    description: 'Chuyên đề so sánh chuyên sâu 2 cấu trúc ngữ pháp khó nhất bậc Trung cấp: điều kiện dùng câu chữ 把, vị trí của động từ năng nguyện và bổ ngữ kết quả, cùng 10 ví dụ đối chiếu câu chữ 被.',
    learning_objectives: [
      'Không bao giờ nhầm lẫn trật tự từ trong câu chữ 把 và câu chữ 被',
      'Đạt điểm tối đa phần sắp xếp từ thành câu ở HSK 3 và HSK 4'
    ],
    related_lesson_ids: ['l-112', 'l-113'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Câu chữ 把', 'Câu chữ 被', 'Chuyên đề ngữ pháp', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY F: NGHE & NÓI THỰC CHIẾN (LISTENING & SPEAKING)
  // =========================================================================
  {
    id: 'res-blcu-audio-companion',
    title: 'File Âm Thanh Đi Kèm Giáo Trình Chuẩn HSK - BLCU Press (Audio Companion)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'listening_speaking',
    category: 'audio',
    skill: 'listening',
    format: 'audio_mp3',
    source_url: 'http://www.blcup.com/',
    source_author: 'Beijing Language and Culture University Press (NXB BLCU)',
    publisher: 'BLCU Press',
    language_of_instruction: 'Tiếng Trung phổ thông',
    license_status: 'Educational Textbook Audio Companion',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.blcup.com/Res',
    description: 'File âm thanh phát âm bản ngữ đi kèm giáo trình HSK Standard Course chính khóa để rèn luyện kỹ năng nghe hiểu câu hỏi ngắn và ngữ điệu tự nhiên.',
    learning_objectives: [
      'Luyện nghe hàng ngày với giọng đọc chuẩn của phát thanh viên BLCU',
      'Làm quen tốc độ nói tự nhiên của người bản xứ'
    ],
    related_lesson_ids: ['l-101', 'l-102', 'l-103'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['BLCU', 'Audio nghe', 'Giáo trình chuẩn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-500-phrases',
    title: 'Trọn Bộ 500 Câu Giao Tiếp Phản Xạ Tiếng Trung Thực Chiến Theo 10 Chủ Đề',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'listening_speaking',
    category: 'document',
    skill: 'speaking',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/500-cau-giao-tiep-tieng-trung-phan-xa',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/500-cau-giao-tiep-tieng-trung-phan-xa.html',
    description: 'Tài liệu 500 mẫu câu phản xạ thông dụng chia theo 10 chủ đề sinh hoạt, công việc, mua sắm, du lịch và giao tiếp xã hội kèm nút nghe phát âm từng câu.',
    learning_objectives: [
      'Hình thành phản xạ giao tiếp không cần dịch nhẩm sang tiếng Việt',
      'Ứng dụng ngay 50 câu giao tiếp khẩn cấp khi đi du lịch hoặc công tác'
    ],
    related_lesson_ids: ['l-106', 'l-107', 'l-108'],
    related_exam_ids: ['hsk2-mock-01'],
    tags: ['Giao tiếp thực chiến', '500 câu', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-mandarin-ac-situational-dialogues',
    title: 'Hội Thoại Tình Huống Kèm Bản Ghi Lời (Transcripts) Phân Theo Cấp Độ - Mandarin.ac.cn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'listening_speaking',
    category: 'audio',
    skill: 'listening',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/resources/',
    source_author: 'Mandarin.ac.cn Audio Lab',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Hơn 50 đoạn đối thoại nghe thực tế có kèm phụ đề chữ Hán, Pinyin và bản dịch, cho phép thí sinh luyện kỹ năng nghe hiểu và shadowing nhắc lại theo từng nhịp.',
    learning_objectives: [
      'Luyện tập shadowing (nhại giọng) để có ngữ điệu tự nhiên',
      'Đọc đối chiếu transcript sau khi nghe để phát hiện từ vựng bị nuốt âm'
    ],
    related_lesson_ids: ['l-108', 'l-109'],
    related_exam_ids: ['hsk2-mock-01', 'hsk3-mock-01'],
    tags: ['Hội thoại tình huống', 'Shadowing', 'Transcript'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-pku-spoken-chinese-shadowing',
    title: 'Phòng Thí Nghiệm Khẩu Ngữ & Ngữ Điệu Tự Nhiên - Đại Học Bắc Kinh (Peking University)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    academic_category: 'listening_speaking',
    category: 'video',
    skill: 'speaking',
    format: 'web_link',
    source_url: 'https://www.coursera.org/learn/hsk-3',
    source_author: 'Peking University Spoken Language Department',
    publisher: 'Peking University',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Coursera Open Audit Access',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Chuỗi bài tập luyện nói phản xạ, ngữ điệu nghi vấn, ngữ điệu cảm thán và ngắt nhịp câu trong các tình huống đàm thoại phức tạp.',
    learning_objectives: [
      'Khắc phục tật nói đều đều như đọc văn bản',
      'Nắm bắt các thán từ thường gặp trong văn nói: 啊, 吧, 呢, 嘛'
    ],
    related_lesson_ids: ['l-111', 'l-112'],
    related_exam_ids: ['hsk3-mock-01'],
    tags: ['Đại học Bắc Kinh', 'Khẩu ngữ', 'Shadowing'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY G: ĐỌC & VIẾT TOÀN DIỆN (READING & WRITING)
  // =========================================================================
  {
    id: 'res-mandarin-ac-graded-readers',
    title: 'Tuyển Tập Bài Đọc Hiểu Phân Cấp HSK 1 Đến HSK 4 - Mandarin.ac.cn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'reading_writing',
    category: 'document',
    skill: 'reading',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/resources/',
    source_author: 'Mandarin.ac.cn Graded Reading Series',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Tiếng Trung có Pinyin và từ vựng giải nghĩa',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Tuyển tập các mẩu truyện ngắn, ngụ ngôn, tin tức đơn giản và đời sống sinh viên được biên soạn giới hạn nghiêm ngặt theo lượng từ vựng của từng cấp độ HSK.',
    learning_objectives: [
      'Tăng tốc độ đọc hiểu văn bản chữ Hán không phụ thuộc vào Pinyin',
      'Luyện kỹ năng scan từ khóa và skim ý chính trong bài thi đọc hiểu'
    ],
    related_lesson_ids: ['l-106', 'l-111', 'l-116'],
    related_exam_ids: ['hsk2-mock-01', 'hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Đọc hiểu phân cấp', 'Truyện ngụ ngôn', 'Mandarin.ac.cn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-cti-writing-rubrics-guide',
    title: 'Tiêu Chí Chấm Điểm Bài Viết & Đánh Giá Tự Luận HSK 4 - 6 Chính Thức CTI',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    academic_category: 'reading_writing',
    category: 'document',
    skill: 'writing',
    format: 'pdf',
    source_url: 'http://www.chinesetest.cn/godownload.do',
    source_author: 'CTI Assessment & Examination Board',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung phổ thông',
    license_status: 'Official Public Assessment Guidelines',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.chinesetest.cn/godownload.do',
    description: 'Tài liệu hướng dẫn giám khảo chấm bài viết HSK: Thang điểm 5 bậc cho câu sắp xếp từ, bài viết theo tranh ảnh và bài tóm tắt bài văn 1,000 chữ ở HSK 6.',
    learning_objectives: [
      'Hiểu rõ giám khảo trừ điểm những lỗi nào (sai chính tả, sai ngữ pháp, lạc đề)',
      'Biết cách tự đánh giá bài viết của bản thân theo tiêu chí chính thống'
    ],
    related_lesson_ids: ['l-116', 'l-118'],
    related_exam_ids: ['hsk4-mock-01'],
    tags: ['Tiêu chí chấm viết', 'CTI Chinesetest', 'Rubrics'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-sentence-reorder-bank',
    title: 'Ngân Hàng Bài Tập Sắp Xếp Từ Thành Câu HSK 3 & 4 Có Giải Thích Ngữ Pháp Chi Tiết',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    academic_category: 'reading_writing',
    category: 'practice_exam',
    skill: 'writing',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/so-tay-ngu-phap-hsk-cot-loi',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/so-tay-ngu-phap-hsk-cot-loi.html',
    description: 'Kho bài tập sắp xếp từ thành câu mô phỏng 100% dạng bài viết phần 1 của kỳ thi HSK 3 và HSK 4, kèm đáp án đúng và phân tích vị trí trạng ngữ, định ngữ, bổ ngữ.',
    learning_objectives: [
      'Làm chủ dạng bài sắp xếp từ thành câu thường chiếm 50% điểm phần Viết',
      'Xác định nhanh vị trí của trạng ngữ thời gian, nơi chốn và liên từ'
    ],
    related_lesson_ids: ['l-111', 'l-112', 'l-116'],
    related_exam_ids: ['hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Sắp xếp từ', 'Viết HSK', 'Bài tập thực hành', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-blcu-writing-connectors',
    title: 'Sổ Tay Từ Nối & Liên Từ Logic Nâng Cao Cho Bài Viết Tiếng Trung (BLCU)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    academic_category: 'reading_writing',
    category: 'document',
    skill: 'writing',
    format: 'pdf',
    source_url: 'http://www.blcup.com/',
    source_author: 'Khoa Ngôn ngữ ứng dụng BLCU',
    publisher: 'BLCU Press',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Educational Textbook Reference',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Tổng hợp 50 cặp liên từ và từ nối logic quan trọng: 不仅...而且..., 虽然...但是..., 即使...也..., 随着, 从而 giúp bài viết đoạn văn mạch lạc, chặt chẽ.',
    learning_objectives: [
      'Sử dụng thành thạo liên từ ghép câu để nâng cao band điểm bài viết',
      'Viết đoạn văn tự luận HSK 4 và HSK 5 có tính liên kết chặt chẽ'
    ],
    related_lesson_ids: ['l-116', 'l-117'],
    related_exam_ids: ['hsk4-mock-01'],
    tags: ['Từ nối logic', 'Liên từ', 'Viết nâng cao', 'BLCU'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY H: LUYỆN THI HSK & ĐỀ MẪU (HSK PREPARATION & SAMPLE PAPERS)
  // =========================================================================
  {
    id: 'res-cti-official-sample-hsk1',
    title: 'Đề Thi Mẫu Minh Họa HSK 1 Chuẩn CLEC/CTI (Kèm File Âm Thanh & Đáp Án)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    academic_category: 'hsk_preparation',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'pdf',
    source_url: 'http://www.chinesetest.cn/gosign.do?id=1&lid=0',
    source_author: 'CTI (Chinese Testing International) & CLEC',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung & Phiên âm Pinyin',
    license_status: 'Official Public Educational Sample Material',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.chinesetest.cn/godownload.do',
    description: 'Bộ đề thi mẫu chính thức HSK cấp 1 do Trung tâm Hợp tác Giao lưu Ngôn ngữ Trung - Ngoại (CLEC) phát hành công khai phục vụ thí sinh làm quen cấu trúc đề, biểu mẫu bài làm và thời lượng làm bài.',
    learning_objectives: [
      'Làm quen giao diện và bố cục bài thi HSK 1 chính thức',
      'Căn chỉnh thời gian làm bài 40 phút đúng quy chế'
    ],
    related_lesson_ids: ['l-101', 'l-105'],
    related_exam_ids: ['hsk1-mock-01'],
    tags: ['Đề mẫu chính thức', 'CLEC', 'CTI', 'HSK 1'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-cti-official-sample-hsk2',
    title: 'Đề Thi Mẫu Minh Họa HSK 2 Chuẩn CLEC/CTI (Nghe Hiểu & Đọc Hiểu)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    academic_category: 'hsk_preparation',
    category: 'sample_exam',
    skill: 'mixed',
    format: 'pdf',
    source_url: 'http://www.chinesetest.cn/gosign.do?id=1&lid=0',
    source_author: 'CTI (Chinese Testing International) & CLEC',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung & Phiên âm Pinyin',
    license_status: 'Official Public Educational Sample Material',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: 'http://www.chinesetest.cn/godownload.do',
    description: 'Tài liệu đề thi mẫu chính thức HSK cấp 2 chuẩn hóa quốc tế, bao gồm 35 câu nghe hiểu và 25 câu đọc hiểu.',
    learning_objectives: [
      'Thử sức với 60 câu hỏi chuẩn mực của đề thi HSK 2',
      'Đánh giá năng lực nghe hiểu và đọc hiểu trước kỳ thi thực tế'
    ],
    related_lesson_ids: ['l-106', 'l-110'],
    related_exam_ids: ['hsk2-mock-01'],
    tags: ['Đề mẫu chính thức', 'CLEC', 'CTI', 'HSK 2'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-mandarin-ac-hsk-prep-strategy',
    title: 'Chiến Thuật Phân Bổ Thời Gian & Mẹo Thi Đậu HSK Điểm Cao - Mandarin.ac.cn',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'hsk_preparation',
    category: 'document',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/tests/hsk/hsk-prepare-for-the-chinese-proficiency-test.html',
    source_author: 'Mandarin.ac.cn Exam Prep Committee',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Cẩm nang chiến thuật làm bài thi HSK: Kỹ năng đọc trước câu hỏi phần nghe, mẹo loại trừ đáp án phần đọc hiểu, và chiến lược phân bổ 5 phút cuối để tô phiếu trả lời.',
    learning_objectives: [
      'Nắm bắt chiến lược phân bổ thời gian từng phần thi',
      'Tối ưu hóa điểm số thông qua kỹ năng loại trừ đáp án bẫy'
    ],
    related_lesson_ids: ['l-105', 'l-110', 'l-115'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01', 'hsk3-mock-01'],
    tags: ['Chiến thuật thi', 'Mẹo làm bài', 'Mandarin.ac.cn'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-mock-exam-engine',
    title: 'Bộ Máy Thi Thử Mô Phỏng HSK Trực Tuyến HanziGo (HSK 1 - HSK 4 Đa Dạng)',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'hsk_preparation',
    category: 'practice_exam',
    skill: 'mixed',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/#hsk',
    source_author: 'Ban Học Thuật & Đội Ngũ Công Nghệ HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/#hsk',
    description: 'Hệ thống thi thử HSK hoàn chỉnh trên website HanziGo: Đồng hồ đếm ngược, tự động nộp bài, kiểm soát lượt nghe audio theo quy chế thi, chấm điểm tức thì và phân tích câu sai.',
    learning_objectives: [
      'Trải nghiệm phòng thi mô phỏng chân thực và áp lực thời gian',
      'Xem đáp án, lời giải thích tiếng Việt chi tiết và tự động ghi nhận câu sai vào Sổ tay'
    ],
    related_lesson_ids: ['l-105', 'l-110', 'l-115', 'l-120'],
    related_exam_ids: ['hsk1-mock-01', 'hsk2-mock-01', 'hsk3-mock-01', 'hsk4-mock-01'],
    tags: ['Thi thử online', 'HanziGo Mock Engine', 'Đầy đủ kỹ năng', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-cti-score-lookup-portal',
    title: 'Cổng Tra Cứu Kết Quả & Chứng Chỉ Điểm Thi HSK Quốc Tế Chính Thức',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'hsk_preparation',
    category: 'external_portal',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.chinesetest.cn/queryscore.do',
    source_author: 'CTI (Chinese Testing International)',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung & Tiếng Anh',
    license_status: 'Official Public Service Portal',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Cổng thông tin khảo thí điện tử chính thức của Bộ Giáo dục Trung Quốc để học viên nhập số báo danh (Ticket No.) tra cứu điểm thi và xác thực chứng chỉ HSK hợp lệ toàn cầu.',
    learning_objectives: [
      'Tra cứu điểm thi chính thức sau ngày thi 1 tháng',
      'Tải bản điện tử chứng nhận kết quả thi HSK hợp lệ'
    ],
    related_lesson_ids: [],
    related_exam_ids: [],
    tags: ['Tra cứu điểm', 'Chứng chỉ HSK', 'CTI'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-cti-hsk79-competency-profile',
    title: 'Đề Cương & Bản Đặc Tả Kỳ Thi Cấp Độ Cao HSK 7 - 9 Toàn Cầu (CTI Official)',
    level: 'HSK 7-9',
    exam_version: 'HSK 3.0-2021',
    academic_category: 'hsk_preparation',
    category: 'document',
    skill: 'mixed',
    format: 'web_link',
    source_url: 'http://www.chinesetest.cn/',
    source_author: 'CTI & Ban Chỉ Đạo Khảo Thí HSK 7-9',
    publisher: 'Chinese Testing International',
    language_of_instruction: 'Tiếng Trung phổ thông',
    license_status: 'Official High-level Examination Specification',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Tài liệu hướng dẫn chính thức về cấu trúc bài thi 5 kỹ năng (Nghe, Đọc, Viết, Dịch, Nói), thời lượng 210 phút và thang điểm xếp bậc HSK 7, HSK 8 hoặc HSK 9 áp dụng từ cuối năm 2022.',
    learning_objectives: [
      'Tìm hiểu định dạng bài thi biên dịch và phiên dịch chuyên nghiệp ở HSK 7-9',
      'Nắm bắt tiêu chuẩn năng lực ngôn ngữ mức độ học giả và chuyên gia'
    ],
    related_lesson_ids: [],
    related_exam_ids: [],
    tags: ['HSK 7-9', 'Cao cấp', 'Phiên dịch', 'Đặc tả đề'],
    verified_date: '2026-10-12'
  },

  // =========================================================================
  // CATEGORY I: VĂN HÓA & GIAO TIẾP THỰC TẾ (CULTURE & PRACTICAL COMMUNICATION)
  // =========================================================================
  {
    id: 'res-blcu-business-chinese-etiquette',
    title: 'Cẩm Nang Giao Tiếp & Văn Hóa Ứng Xử Thương Mại Trung Hoa (BLCU)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    academic_category: 'culture_communication',
    category: 'document',
    skill: 'speaking',
    format: 'pdf',
    source_url: 'http://www.blcup.com/',
    source_author: 'Khoa Thương Mại Quốc Tế BLCU',
    publisher: 'BLCU Press',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'Business Educational Textbook Reference',
    permission_status: 'linked_only',
    host_type: 'official_published',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Quy tắc ứng xử trong công sở và đàm phán thương mại: Cách trao danh thiếp bằng hai tay, văn hóa mời rượu trên bàn tiệc, xưng hô cấp bậc và thuật ngữ thương mại.',
    learning_objectives: [
      'Làm chủ nghi thức giao tiếp trên bàn tiệc và đàm phán kinh doanh',
      'Ứng xử đúng phong tục, tạo ấn tượng chuyên nghiệp với đối tác Trung Quốc'
    ],
    related_lesson_ids: ['l-116', 'l-117', 'l-118'],
    related_exam_ids: ['hsk4-mock-01'],
    tags: ['Thương mại', 'Văn hóa công sở', 'Nghi thức', 'BLCU'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-clec-festivals-customs-culture',
    title: 'Phong Tục Lễ Tết Truyền Thống & Văn Hóa Đời Sống Trung Hoa - CLEC Chinese Plus',
    level: 'All',
    exam_version: '2015-Standard',
    academic_category: 'culture_communication',
    category: 'document',
    skill: 'reading',
    format: 'web_link',
    source_url: 'http://www.chinese.cn/',
    source_author: 'Viện Văn hóa & Giáo dục Quốc tế CLEC',
    publisher: 'CLEC / Chinese Plus',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Cultural Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Các bài đọc văn hóa về Tết Nguyên Đán, Tết Trung Thu, Lễ Đoan Ngọ, phong tục lì xì đỏ, ẩm thực bát đại thái hệ và triết lý trà đạo Trung Hoa.',
    learning_objectives: [
      'Mở rộng kiến thức nền văn hóa để hiểu sâu ngữ cảnh của ngôn ngữ',
      'Nắm bắt các câu chúc tụng truyền thống trong dịp lễ tết'
    ],
    related_lesson_ids: ['l-108', 'l-113'],
    related_exam_ids: [],
    tags: ['Lễ tết truyền thống', 'Văn hóa Trung Hoa', 'CLEC'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-hanzigo-travel-emergency-chinese',
    title: 'Sổ Tay Tiếng Trung Du Lịch Bỏ Túi & Tình Huống Khẩn Cấp (Sân Bay, Khách Sạn, Y Tế)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    academic_category: 'culture_communication',
    category: 'document',
    skill: 'speaking',
    format: 'practice_exam',
    source_url: 'https://hanzigo.com/materials/500-cau-giao-tiep-tieng-trung-phan-xa',
    source_author: 'Ban Học Thuật HanziGo',
    publisher: 'HanziGo Language Studio',
    language_of_instruction: 'Song ngữ Trung - Việt',
    license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
    permission_status: 'reproducible',
    host_type: 'hanzigo_original',
    review_status: 'published',
    is_published: true,
    download_url: '/500-cau-giao-tiep-tieng-trung-phan-xa.html',
    description: 'Tài liệu phản xạ cấp tốc khi du lịch Trung Quốc: Hỏi đường, mua vé tàu cao tốc Gaotie, cài đặt thanh toán WeChat Pay/Alipay, và gọi trợ giúp khi bị lạc hoặc ốm.',
    learning_objectives: [
      'Tự tin đi du lịch tự túc Trung Quốc mà không cần phiên dịch viên',
      'Xử lý trôi chảy các sự cố phát sinh tại sân bay và khách sạn'
    ],
    related_lesson_ids: ['l-106', 'l-107', 'l-108'],
    related_exam_ids: ['hsk2-mock-01'],
    tags: ['Du lịch tự túc', 'Khẩn cấp', 'Gaotie & Sân bay', 'HanziGo độc quyền'],
    verified_date: '2026-10-12'
  },
  {
    id: 'res-mandarin-ac-slang-idioms',
    title: 'Từ Điển Thu Nhỏ Từ Lóng Internet & Thành Ngữ Bốn Chữ Thịnh Hành - Mandarin.ac.cn',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    academic_category: 'culture_communication',
    category: 'document',
    skill: 'vocabulary',
    format: 'web_link',
    source_url: 'https://www.mandarin.ac.cn/resources/',
    source_author: 'Mandarin.ac.cn Youth Culture Lab',
    publisher: 'Mandarin.ac.cn',
    language_of_instruction: 'Song ngữ Trung - Anh',
    license_status: 'Open Educational Resource',
    permission_status: 'linked_only',
    host_type: 'free_external',
    review_status: 'published',
    is_published: true,
    download_url: null,
    description: 'Giải mã các từ lóng mạng xã hội Weibo/Douyin được giới trẻ Trung Quốc sử dụng nhiều nhất (YYDS, 躺平, 卷, 破防, 社恐) và 100 thành ngữ 4 chữ biểu tượng.',
    learning_objectives: [
      'Hiểu bài đăng và bình luận trên mạng xã hội Trung Quốc',
      'Giao tiếp tự nhiên và gần gũi với giới trẻ bản xứ'
    ],
    related_lesson_ids: ['l-116', 'l-119'],
    related_exam_ids: ['hsk4-mock-01'],
    tags: ['Từ lóng internet', 'Thành ngữ', 'Weibo & Douyin'],
    verified_date: '2026-10-12'
  }
];

export const HSK_LEARNING_RESOURCES = HSK_RESOURCES;

export const PERMISSION_BADGES = {
  reproducible: { label: 'Tự do trích dẫn', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  linked_only: { label: 'Chỉ dẫn nguồn gốc', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  open_educational: { label: 'Giáo dục mở OER', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  unverified: { label: 'Chưa xác minh bản quyền', color: 'bg-amber-50 text-amber-700 border-amber-200' }
};

export const HOST_TYPE_BADGES = {
  hanzigo_original: { label: '⚡ HanziGo biên soạn', color: 'bg-emerald-50 text-emerald-700' },
  official_published: { label: '🏛️ Khảo thí CTI chính thức', color: 'bg-blue-50 text-blue-700' },
  open_license: { label: '✅ Giáo dục Mở OER', color: 'bg-teal-50 text-teal-700' },
  free_external: { label: '🌐 Liên kết ngoài miễn phí', color: 'bg-slate-50 text-slate-700' }
};

/**
 * Lấy danh sách danh mục học thuật (A - I)
 */
export function getResourceAcademicCategories() {
  return RESOURCE_ACADEMIC_CATEGORIES;
}

/**
 * Lấy toàn bộ danh sách tài nguyên
 */
export function getAllLearningResources() {
  return HSK_RESOURCES;
}
