/**
 * =========================================================================
 * HSK MOCK EXAMS EXPANDED DATASET (ĐỀ THI SỐ 2 & SỐ 3 CHO HSK 1 ĐẾN HSK 6)
 * =========================================================================
 * Mở rộng bộ ngân hàng đề thi chuẩn CBT với đầy đủ cấu trúc:
 * - HSK 1 & HSK 2: 2 phần (Nghe hiểu - Listening, Đọc hiểu - Reading) - 200 điểm
 * - HSK 3 đến HSK 6: 3 phần (Nghe hiểu - Listening, Đọc hiểu - Reading, Viết - Writing) - 300 điểm
 * Hỗ trợ câu hỏi Nghe có AudioScript, Đọc hiểu ABC, và Sắp xếp từ thành câu (writing_reorder).
 * =========================================================================
 */

export const EXPANDED_MOCK_EXAMS = [
  // ==========================================
  // HSK 1: ĐỀ SỐ 2 & ĐỀ SỐ 3
  // ==========================================
  {
    id: 'hsk1-mock-02',
    title: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 2 (Học Tập & Trường Học)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 40,
    total_questions: 30,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử HSK 1 Đề số 2 chủ đề Trường lớp, thầy cô và lớp học: 5 câu Nghe hiểu hội thoại + 5 câu Đọc hiểu từ vựng ghép câu. Thang điểm 200, điểm chuẩn đạt 120.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk1-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk1-mock-03',
    title: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 3 (Gia Đình & Bạn Bè)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 40,
    total_questions: 10,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử HSK 1 Đề số 3 chủ đề Quan hệ gia đình, bạn bè và sinh hoạt hằng ngày: 5 câu Nghe hiểu + 5 câu Đọc hiểu nối tranh. Thang điểm 200, đạt khi >= 120.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk1-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },

  // ==========================================
  // HSK 2: ĐỀ SỐ 2 & ĐỀ SỐ 3
  // ==========================================
  {
    id: 'hsk2-mock-02',
    title: 'Đề Thi Thử HSK 2 Chuẩn Mẫu Số 2 (Giao Thông & Đi Lại)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 55,
    total_questions: 10,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử HSK 2 Đề số 2 chủ đề Đi lại, phương tiện công cộng, hỏi đường và thời tiết: 5 câu Nghe + 5 câu Đọc. Thang điểm 200, đạt khi >= 120.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk2-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk2-mock-03',
    title: 'Đề Thi Thử HSK 2 Chuẩn Mẫu Số 3 (Mua Sắm & Ăn Uống)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 55,
    total_questions: 10,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử HSK 2 Đề số 3 chủ đề Ăn uống tại nhà hàng, mua sắm hoa quả và trả giá: 5 câu Nghe + 5 câu Đọc. Thang điểm 200, đạt khi >= 120.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk2-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },

  // ==========================================
  // HSK 3: ĐỀ SỐ 2 & ĐỀ SỐ 3 (3 PHẦN: NGHE - ĐỌC - VIẾT)
  // ==========================================
  {
    id: 'hsk3-mock-02',
    title: 'Đề Thi Thử HSK 3 Chuẩn Mẫu Số 2 (Công Việc & Công Sở)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 85,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 3 Đề số 2 chủ đề Môi trường làm việc và giao tiếp văn phòng: 3 câu Nghe hiểu + 3 câu Đọc hiểu + 3 câu Viết sắp xếp từ thành câu. Thang điểm 300, đạt khi >= 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk3-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk3-mock-03',
    title: 'Đề Thi Thử HSK 3 Chuẩn Mẫu Số 3 (Du Lịch & Sức Khỏe)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 85,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 3 Đề số 3 chủ đề Đặt vé du lịch, khách sạn và khám bệnh: 3 câu Nghe + 3 câu Đọc + 3 câu Viết xếp câu ngữ pháp câu chữ 把/被. Thang điểm 300, đạt khi >= 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk3-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },

  // ==========================================
  // HSK 4: ĐỀ SỐ 2 & ĐỀ SỐ 3 (3 PHẦN: NGHE - ĐỌC - VIẾT)
  // ==========================================
  {
    id: 'hsk4-mock-02',
    title: 'Đề Thi Thử HSK 4 Chuẩn Mẫu Số 2 (Xã Hội & Tâm Lý Học)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 105,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 4 Đề số 2: Nghe chỉ phát 1 lần, Đọc hiểu sắp xếp mệnh đề ABC và Viết sắp xếp trật tự câu chữ 把/比/连. Thang điểm 300, điểm chuẩn 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk4-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk4-mock-03',
    title: 'Đề Thi Thử HSK 4 Chuẩn Mẫu Số 3 (Khoa Học Công Nghệ & Môi Trường)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 105,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 4 Đề số 3: Đoạn văn báo chí về tái chế rác và công nghệ số. Đầy đủ 3 phần Nghe, Đọc ABC, Viết xếp câu. Thang điểm 300, đạt khi >= 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk4-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },

  // ==========================================
  // HSK 5: ĐỀ SỐ 2 & ĐỀ SỐ 3 (3 PHẦN: NGHE - ĐỌC - VIẾT)
  // ==========================================
  {
    id: 'hsk5-mock-02',
    title: 'Đề Thi Thử HSK 5 Chuẩn Mẫu Số 2 (Kinh Tế Thương Mại & Đàm Phán)',
    level: 'HSK 5',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 125,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 5 Đề số 2 chuyên sâu Kinh tế, ký kết hợp đồng và đầu tư: 3 câu Nghe bài phát biểu + 3 câu Đọc luận điểm + 3 câu Viết hoàn chỉnh câu phức. Thang điểm 300, điểm chuẩn 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk5-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk5-mock-03',
    title: 'Đề Thi Thử HSK 5 Chuẩn Mẫu Số 3 (Văn Hóa Cổ Điển & Triết Học)',
    level: 'HSK 5',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 125,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 5 Đề số 3: Tác phẩm thư pháp, trà đạo và triết học Nho gia. Đầy đủ 3 phần Nghe, Đọc, Viết. Thang điểm 300, đạt khi >= 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk5-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },

  // ==========================================
  // HSK 6: ĐỀ SỐ 2 & ĐỀ SỐ 3 (3 PHẦN: NGHE - ĐỌC - VIẾT)
  // ==========================================
  {
    id: 'hsk6-mock-02',
    title: 'Đề Thi Thử HSK 6 Đỉnh Phong Số 2 (Phân Tích Bệnh Cú & Phóng Sự)',
    level: 'HSK 6',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 140,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 6 Đề số 2 cấp độ cao cấp: Nghe phỏng vấn chuyên gia, Đọc hiểu chọn câu sai ngữ pháp (病句) và Viết tái lập cấu trúc câu văn học thuật. Thang điểm 300, điểm chuẩn 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk6-02',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk6-mock-03',
    title: 'Đề Thi Thử HSK 6 Đỉnh Phong Số 3 (Luận Thuyết Khoa Học & Báo Chí)',
    level: 'HSK 6',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 140,
    total_questions: 9,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 6 Đề số 3: Chủ đề thám hiểm không gian và biến đổi khí hậu toàn cầu. Đầy đủ 3 phần Nghe, Đọc và Viết. Thang điểm 300, đạt khi >= 180.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk6-03',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  }
];

export const EXPANDED_MOCK_QUESTIONS = [
  // =========================================================================
  // 1. HSK 1 MOCK 02 (10 câu: 5 Nghe + 5 Đọc)
  // =========================================================================
  {
    id: 'q-hsk1-02-01',
    exam_id: 'hsk1-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'listening_mcq',
    prompt: '听录音，判断与听到的内容是否一致：[李老师在学校。]',
    pinyin: 'Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Lǐ lǎoshī zài xuéxiào.]',
    translation: 'Nghe đoạn ghi âm, phán đoán đúng sai với nội dung: "Thầy Lý đang ở trường."',
    audio_url: '',
    audio_script: '李老师今天在学校上课。',
    options: [
      { text: '✓ Đúng (一致)', pinyin: 'Yízhì', translation: 'Khớp nội dung' },
      { text: '✗ Sai (不一致)', pinyin: 'Bù yízhì', translation: 'Không khớp nội dung' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại: "李老师今天在学校上课。" (Hôm nay thầy Lý dạy học ở trường). Hoàn toàn khớp với nội dung đề bài.',
    points: 20,
    relatedVocab: ['老师', '学校', '今天']
  },
  {
    id: 'q-hsk1-02-02',
    exam_id: 'hsk1-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：他在做什么？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Tā zài zuò shénme?',
    translation: 'Nghe hội thoại, chọn đáp án đúng: Anh ấy đang làm gì?',
    audio_url: '',
    audio_script: '女：大卫在房间里吗？男：不在，他在外面看书呢。问：大卫在做什么？',
    options: [
      { text: '看书 (Kàn shū)', pinyin: 'Kàn shū', translation: 'Đọc sách' },
      { text: '睡觉 (Shuì jiào)', pinyin: 'Shuì jiào', translation: 'Ngủ' },
      { text: '吃饭 (Chī fàn)', pinyin: 'Chī fàn', translation: 'Ăn cơm' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói: "他在外面看书呢" (Anh ấy đang ở bên ngoài đọc sách). Đáp án A là chính xác.',
    points: 20,
    relatedVocab: ['看书', '房间', '外面']
  },
  {
    id: 'q-hsk1-02-03',
    exam_id: 'hsk1-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 3,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：今天星期几？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Jīntiān xīngqī jǐ?',
    translation: 'Nghe hội thoại, chọn đáp án đúng: Hôm nay thứ mấy?',
    audio_url: '',
    audio_script: '女：昨天是星期三吗？男：不是，今天是星期三。问：今天星期几？',
    options: [
      { text: '星期二 (Xīngqī\'èr)', pinyin: 'Xīngqī\'èr', translation: 'Thứ Ba' },
      { text: '星期三 (Xīngqīsān)', pinyin: 'Xīngqīsān', translation: 'Thứ Tư' },
      { text: '星期四 (Xīngqīsì)', pinyin: 'Xīngqīsì', translation: 'Thứ Năm' }
    ],
    correct_option_index: 1,
    explanation: 'Người nam khẳng định: "今天是星期三" (Hôm nay là thứ Tư). Do đó đáp án là B.',
    points: 20,
    relatedVocab: ['今天', '昨天', '星期三']
  },
  {
    id: 'q-hsk1-02-04',
    exam_id: 'hsk1-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 4,
    question_type: 'listening_mcq',
    prompt: '听录音，选出对应的物品：',
    pinyin: 'Tīng lùyīn, xuǎn chū duìyìng de wùpǐn:',
    translation: 'Nghe đoạn ghi âm, chọn đồ vật tương ứng:',
    audio_url: '',
    audio_script: '桌子上有一个苹果和一个杯子。',
    options: [
      { text: '杯子 (Bēizi)', pinyin: 'Bēizi', translation: 'Cái cốc / ly' },
      { text: '椅子 (Yǐzi)', pinyin: 'Yǐzi', translation: 'Cái ghế' },
      { text: '电脑 (Diànnǎo)', pinyin: 'Diànnǎo', translation: 'Máy tính' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn ghi âm nhắc đến "杯子" (cốc, ly). Phương án đúng là A.',
    points: 20,
    relatedVocab: ['桌子', '苹果', '杯子']
  },
  {
    id: 'q-hsk1-02-05',
    exam_id: 'hsk1-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 5,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：谁想去中国？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Shéi xiǎng qù Zhōngguó?',
    translation: 'Nghe hội thoại, chọn đáp án đúng: Ai muốn đi Trung Quốc?',
    audio_url: '',
    audio_script: '男：你想去中国学汉语吗？女：想，我很想去北京。问：女的想做什么？',
    options: [
      { text: '去中国 (Qù Zhōngguó)', pinyin: 'Qù Zhōngguó', translation: 'Đi Trung Quốc' },
      { text: '买衣服 (Mǎi yīfu)', pinyin: 'Mǎi yīfu', translation: 'Mua quần áo' },
      { text: '回家 (Huí jiā)', pinyin: 'Huí jiā', translation: 'Về nhà' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ trả lời "想，我很想去北京" (Muốn, tôi rất muốn đi Bắc Kinh/Trung Quốc). Đáp án A là chính xác.',
    points: 20,
    relatedVocab: ['中国', '汉语', '北京']
  },

  // PHẦN ĐỌC HSK 1 - ĐỀ 2 (5 câu)
  {
    id: 'q-hsk1-02-06',
    exam_id: 'hsk1-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 6,
    question_type: 'reading_mcq',
    prompt: '看句子，选出最合适的词语填空：桌子上有两______书。',
    pinyin: 'Zhuōzi shang yǒu liǎng ______ shū.',
    translation: 'Chọn lượng từ phù hợp điền vào chỗ trống: Trên bàn có hai quyển sách.',
    options: [
      { text: '本 (Běn)', pinyin: 'Běn', translation: 'Quyển, cuốn (lượng từ của sách)' },
      { text: '个 (Gè)', pinyin: 'Gè', translation: 'Cái (lượng từ chung)' },
      { text: '只 (Zhī)', pinyin: 'Zhī', translation: 'Con (lượng từ động vật)' }
    ],
    correct_option_index: 0,
    explanation: 'Lượng từ đi cùng với sách (书 - shū) trong tiếng Hán là "本" (běn). Ví dụ: 两本书.',
    points: 20,
    relatedVocab: ['书', '本', '桌子']
  },
  {
    id: 'q-hsk1-02-07',
    exam_id: 'hsk1-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 7,
    question_type: 'reading_mcq',
    prompt: '看句子，选词填空：我不会说汉语，我______在学习。',
    pinyin: 'Wǒ bú huì shuō Hànyǔ, wǒ ______ zài xuéxí.',
    translation: 'Chọn phó từ phù hợp: Tôi chưa biết nói tiếng Trung, tôi đang học tập.',
    options: [
      { text: '现 (Xiàn)', pinyin: 'Xiàn', translation: 'Hiện' },
      { text: '正 (Zhèng)', pinyin: 'Zhèng', translation: 'Đang (chỉ hành động diễn tiến)' },
      { text: '没 (Méi)', pinyin: 'Méi', translation: 'Không / Chưa' }
    ],
    correct_option_index: 1,
    explanation: 'Cấu trúc biểu thị hành động đang diễn ra: "正在 + Động từ" hoặc "正/在 + Động từ". Ở đây "正在学习" (đang học tập) là chuẩn xác nhất.',
    points: 20,
    relatedVocab: ['汉语', '学习', '正在']
  },
  {
    id: 'q-hsk1-02-08',
    exam_id: 'hsk1-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 8,
    question_type: 'reading_mcq',
    prompt: '看对话，选择答句：A: "谢谢你帮助我！" -> B: "______"',
    pinyin: 'A: "Xièxie nǐ bāngzhù wǒ!" -> B: "______"',
    translation: 'Chọn câu đáp lại lời cảm ơn: "Cảm ơn bạn đã giúp tôi!"',
    options: [
      { text: '不客气 (Bú kèqi)', pinyin: 'Bú kèqi', translation: 'Không có gì / Đừng khách sáo' },
      { text: '对不起 (Duìbuqǐ)', pinyin: 'Duìbuqǐ', translation: 'Xin lỗi' },
      { text: '没关系 (Méi guānxi)', pinyin: 'Méi guānxi', translation: 'Không sao đâu (đáp lại xin lỗi)' }
    ],
    correct_option_index: 0,
    explanation: 'Đáp lại lời cảm ơn "谢谢" chuẩn nhất là "不客气" (Đừng khách sáo). "没关系" dùng để đáp lại lời xin lỗi "对不起".',
    points: 20,
    relatedVocab: ['谢谢', '不客气', '对不起']
  },
  {
    id: 'q-hsk1-02-09',
    exam_id: 'hsk1-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 9,
    question_type: 'reading_mcq',
    prompt: '读句子，选择正确的意思：现在是下午四点三十分。',
    pinyin: 'Xiànzài shì xiàwǔ sì diǎn sānshí fēn.',
    translation: 'Bây giờ là 4 giờ 30 phút chiều.',
    options: [
      { text: 'Bây giờ là 4 rưỡi chiều (4:30 PM)', pinyin: '4:30 PM', translation: 'Khớp hoàn toàn' },
      { text: 'Bây giờ là 3 giờ 40 phút chiều', pinyin: '3:40 PM', translation: 'Sai số giờ' },
      { text: 'Bây giờ là 4 giờ sáng', pinyin: '4:00 AM', translation: 'Sai buổi trong ngày' }
    ],
    correct_option_index: 0,
    explanation: '下午 (xiàwǔ - buổi chiều), 四点 (sì diǎn - 4 giờ), 三十分 (sānshí fēn - 30 phút). Câu mang nghĩa "4 giờ 30 phút chiều".',
    points: 20,
    relatedVocab: ['现在', '下午', '点']
  },
  {
    id: 'q-hsk1-02-10',
    exam_id: 'hsk1-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 10,
    question_type: 'reading_mcq',
    prompt: '选出与句意相符的问句：他叫李月，是中国人。',
    pinyin: 'Tā jiào Lǐ Yuè, shì Zhōngguó rén.',
    translation: 'Chọn câu hỏi phù hợp với câu trả lời: "Anh ấy tên Lý Nguyệt, là người Trung Quốc."',
    options: [
      { text: '他是哪国人？(Tā shì nǎ guó rén?)', pinyin: 'Tā shì nǎ guó rén?', translation: 'Anh ấy là người nước nào?' },
      { text: '他多大了？(Tā duō dà le?)', pinyin: 'Tā duō dà le?', translation: 'Anh ấy bao nhiêu tuổi rồi?' },
      { text: '他在哪儿？(Tā zài nǎr?)', pinyin: 'Tā zài nǎr?', translation: 'Anh ấy ở đâu?' }
    ],
    correct_option_index: 0,
    explanation: 'Câu trả lời giới thiệu quốc tịch "是中国人" (là người Trung Quốc), do đó câu hỏi phù hợp nhất là "他是哪国人？".',
    points: 20,
    relatedVocab: ['中国', '人', '哪国人']
  },

  // =========================================================================
  // 2. HSK 2 MOCK 02 (10 câu: 5 Nghe + 5 Đọc)
  // =========================================================================
  {
    id: 'q-hsk2-02-01',
    exam_id: 'hsk2-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'listening_mcq',
    prompt: '听录音，判断与听到的内容是否一致：[他每天早上都跑步。]',
    pinyin: 'Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Tā měitiān zǎoshang dōu pǎobù.]',
    translation: 'Nghe đoạn ghi âm, phán đoán đúng sai: "Anh ấy mỗi sáng đều chạy bộ."',
    audio_url: '',
    audio_script: '为了健康，他每天早上都去公园跑步。',
    options: [
      { text: '✓ Đúng (一致)', pinyin: 'Yízhì', translation: 'Nội dung khớp' },
      { text: '✗ Sai (不一致)', pinyin: 'Bù yízhì', translation: 'Nội dung không khớp' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại: "他每天早上都去公园跑步" (Mỗi sáng anh ấy đều đến công viên chạy bộ). Khớp hoàn toàn với nội dung.',
    points: 20,
    relatedVocab: ['跑步', '早上', '健康']
  },
  {
    id: 'q-hsk2-02-02',
    exam_id: 'hsk2-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：他们怎么去机场？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Tāmen zěnme qù jīchǎng?',
    translation: 'Họ đi đến sân bay bằng phương tiện gì?',
    audio_url: '',
    audio_script: '男：时间不早了，我们坐出租车去机场吧。女：好的，我现在叫车。问：他们怎么去机场？',
    options: [
      { text: '坐出租车 (Zuò chūzūchē)', pinyin: 'Zuò chūzūchē', translation: 'Đi taxi' },
      { text: '坐地铁 (Zuò dìtiě)', pinyin: 'Zuò dìtiě', translation: 'Đi tàu điện ngầm' },
      { text: '走路 (Zǒu lù)', pinyin: 'Zǒu lù', translation: 'Đi bộ' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam đề nghị: "我们坐出租车去机场吧" (Chúng ta đi taxi ra sân bay đi) và người nữ đồng ý.',
    points: 20,
    relatedVocab: ['出租车', '机场', '时间']
  },
  {
    id: 'q-hsk2-02-03',
    exam_id: 'hsk2-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 3,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：今天天气怎么样？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Jīntiān tiānqì zěnmeyàng?',
    translation: 'Thời tiết hôm nay như thế nào?',
    audio_url: '',
    audio_script: '女：外面阴天了，可能要下雨，你带伞了吗？男：带了，在我包里。问：今天天气可能怎么样？',
    options: [
      { text: '要下雨 (Yào xiàyǔ)', pinyin: 'Yào xiàyǔ', translation: 'Sắp mưa' },
      { text: '很晴朗 (Hěn qínglǎng)', pinyin: 'Hěn qínglǎng', translation: 'Rất nắng ráo' },
      { text: '刮大风 (Guā dàfēng)', pinyin: 'Guā dàfēng', translation: 'Gió to' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ nói "外面阴天了，可能要下雨" (Bên ngoài trời âm u rồi, có thể sắp mưa). Đáp án A chính xác.',
    points: 20,
    relatedVocab: ['天气', '下雨', '阴天']
  },
  {
    id: 'q-hsk2-02-04',
    exam_id: 'hsk2-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 4,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：这件衣服多少钱？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Zhè jiàn yīfu duōshao qián?',
    translation: 'Chiếc áo này giá bao nhiêu tiền?',
    audio_url: '',
    audio_script: '男：这件黑色的衣服两百块，太贵了。女：那件白色的便宜一点儿，一百五十块。问：白色的衣服多少钱？',
    options: [
      { text: '150块 (Yìbǎi wǔshí kuài)', pinyin: 'Yìbǎi wǔshí kuài', translation: '150 tệ' },
      { text: '200块 (Liǎngbǎi kuài)', pinyin: 'Liǎngbǎi kuài', translation: '200 tệ' },
      { text: '100块 (Yìbǎi kuài)', pinyin: 'Yìbǎi kuài', translation: '100 tệ' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ nói chiếc áo màu trắng (白色的) giá 150 tệ (一百五十块). Câu hỏi hỏi về chiếc áo màu trắng, nên đáp án là A.',
    points: 20,
    relatedVocab: ['衣服', '便宜', '贵']
  },
  {
    id: 'q-hsk2-02-05',
    exam_id: 'hsk2-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 5,
    question_type: 'listening_mcq',
    prompt: '听录音，选出正确的行动：',
    pinyin: 'Tīng lùyīn, xuǎn chū zhèngquè de xíngdòng:',
    translation: 'Nghe đoạn ghi âm, chọn hành động tương ứng:',
    audio_url: '',
    audio_script: '医生说，吃完药后要多喝水，好好休息。',
    options: [
      { text: '多喝水、休息 (Hē shuǐ, xiūxi)', pinyin: 'Hē shuǐ, xiūxi', translation: 'Uống nhiều nước và nghỉ ngơi' },
      { text: '去上班 (Qù shàngbān)', pinyin: 'Qù shàngbān', translation: 'Đi làm việc' },
      { text: '去旅游 (Qù lǚyóu)', pinyin: 'Qù lǚyóu', translation: 'Đi du lịch' }
    ],
    correct_option_index: 0,
    explanation: 'Bác sĩ dặn "多喝水，好好休息" (uống nhiều nước, nghỉ ngơi thật tốt). Phương án đúng là A.',
    points: 20,
    relatedVocab: ['医生', '吃药', '休息']
  },

  // PHẦN ĐỌC HSK 2 - ĐỀ 2 (5 câu)
  {
    id: 'q-hsk2-02-06',
    exam_id: 'hsk2-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 6,
    question_type: 'reading_mcq',
    prompt: '选词填空：虽然今天很冷，______他还是穿得很少。',
    pinyin: 'Suīrán jīntiān hěn lěng, ______ tā háishì chuān de hěn shǎo.',
    translation: 'Chọn liên từ thích hợp: Tuy rằng hôm nay rất lạnh, nhưng anh ấy vẫn mặc rất ít.',
    options: [
      { text: '但是 (Dànshì)', pinyin: 'Dànshì', translation: 'Nhưng mà' },
      { text: '因为 (Yīnwèi)', pinyin: 'Yīnwèi', translation: 'Bởi vì' },
      { text: '所以 (Suǒyǐ)', pinyin: 'Suǒyǐ', translation: 'Cho nên' }
    ],
    correct_option_index: 0,
    explanation: 'Cặp liên từ chỉ sự nhượng bộ trong ngữ pháp HSK 2: "虽然......但是/可是......" (Tuy rằng... nhưng mà...).',
    points: 20,
    relatedVocab: ['虽然', '但是', '冷']
  },
  {
    id: 'q-hsk2-02-07',
    exam_id: 'hsk2-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 7,
    question_type: 'reading_mcq',
    prompt: '选词填空：我已经学了一年汉语了，能看懂一些______的书。',
    pinyin: 'Wǒ yǐjīng xué le yì nián Hànyǔ le, néng kàndǒng yìxiē ______ de shū.',
    translation: 'Chọn tính từ thích hợp: Tôi đã học tiếng Trung được 1 năm rồi, có thể đọc hiểu một số cuốn sách đơn giản.',
    options: [
      { text: '简单 (Jiǎndān)', pinyin: 'Jiǎndān', translation: 'Đơn giản' },
      { text: '便宜 (Piányi)', pinyin: 'Piányi', translation: 'Rẻ tiền' },
      { text: '忙 (Máng)', pinyin: 'Máng', translation: 'Bận rộn' }
    ],
    correct_option_index: 0,
    explanation: '"简单" (jiǎndān - đơn giản) bổ nghĩa cho "书" (sách đơn giản).',
    points: 20,
    relatedVocab: ['简单', '已经', '懂']
  },
  {
    id: 'q-hsk2-02-08',
    exam_id: 'hsk2-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 8,
    question_type: 'reading_mcq',
    prompt: '阅读短文判断：我家离公司很近，每天走路十分钟就到了。问：公司离家远吗？',
    pinyin: 'Wǒ jiā lí gōngsī hěn jìn, měitiān zǒulù shí fēnzhōng jiù dào le. Wèn: Gōngsī lí jiā yuǎn ma?',
    translation: 'Nhà tôi cách công ty rất gần, mỗi ngày đi bộ 10 phút là tới. Hỏi: Công ty cách nhà có xa không?',
    options: [
      { text: '不远，很近 (Bù yuǎn, hěn jìn)', pinyin: 'Bù yuǎn, hěn jìn', translation: 'Không xa, rất gần' },
      { text: '非常远 (Fēicháng yuǎn)', pinyin: 'Fēicháng yuǎn', translation: 'Rất xa' },
      { text: '不知道 (Bù zhīdào)', pinyin: 'Bù zhīdào', translation: 'Không biết' }
    ],
    correct_option_index: 0,
    explanation: 'Trong bài nêu rõ "离公司很近" (cách công ty rất gần), nên đáp án là A.',
    points: 20,
    relatedVocab: ['离', '近', '远']
  },
  {
    id: 'q-hsk2-02-09',
    exam_id: 'hsk2-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 9,
    question_type: 'reading_mcq',
    prompt: '选词填空：哥哥比我大两岁，他跑步跑得比我______。',
    pinyin: 'Gēge bǐ wǒ dà liǎng suì, tā pǎobù pǎo de bǐ wǒ ______.',
    translation: 'Anh trai lớn hơn tôi 2 tuổi, anh ấy chạy bộ nhanh hơn tôi.',
    options: [
      { text: '快 (Kuài)', pinyin: 'Kuài', translation: 'Nhanh' },
      { text: '慢 (Màn)', pinyin: 'Màn', translation: 'Chậm' },
      { text: '高 (Gāo)', pinyin: 'Gāo', translation: 'Cao' }
    ],
    correct_option_index: 0,
    explanation: 'Trong câu so sánh chữ 比 kết hợp bổ ngữ trình độ: "跑得比我快" (chạy nhanh hơn tôi).',
    points: 20,
    relatedVocab: ['比', '快', '跑步']
  },
  {
    id: 'q-hsk2-02-10',
    exam_id: 'hsk2-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 10,
    question_type: 'reading_mcq',
    prompt: '看问句选择合适的回应：你认识新来的张经理吗？',
    pinyin: 'Nǐ rènshi xīn lái de Zhāng jīnglǐ ma?',
    translation: 'Bạn có quen biết giám đốc Trương mới đến không?',
    options: [
      { text: '认识，他以前在上海工作。(Rènshi, tā yǐqián zài Shànghǎi gōngzuò.)', pinyin: 'Rènshi, tā yǐqián zài Shànghǎi gōngzuò.', translation: 'Quen chứ, anh ấy trước đây làm việc ở Thượng Hải.' },
      { text: '我不吃鱼。(Wǒ bù chī yú.)', pinyin: 'Wǒ bù chī yú.', translation: 'Tôi không ăn cá (không liên quan)' },
      { text: '明天下午三点。(Míngtiān xiàwǔ sān diǎn.)', pinyin: 'Míngtiān xiàwǔ sān diǎn.', translation: '3 giờ chiều mai (không liên quan)' }
    ],
    correct_option_index: 0,
    explanation: 'Câu hỏi hỏi về việc quen biết người (认识...吗), câu trả lời phù hợp nhất là "认识，他以前在上海工作".',
    points: 20,
    relatedVocab: ['经理', '认识', '以前']
  },

  // =========================================================================
  // 3. HSK 3 MOCK 02 (9 câu: 3 Nghe + 3 Đọc + 3 Viết)
  // =========================================================================
  // PHẦN NGHE HSK 3
  {
    id: 'q-hsk3-02-01',
    exam_id: 'hsk3-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：会议什么时候开始？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Huìyì shénme shíhou kāishǐ?',
    translation: 'Cuộc họp khi nào bắt đầu?',
    audio_url: '',
    audio_script: '女：小李，总经理说明天的会议改到下午两点半了。男：好的，我马上通知大家。问：会议什么时候开始？',
    options: [
      { text: '下午 2:30 (Xiàwǔ liǎng diǎn bàn)', pinyin: 'Xiàwǔ liǎng diǎn bàn', translation: '2 giờ 30 phút chiều' },
      { text: '上午 10:00 (Shàngwǔ shí diǎn)', pinyin: 'Shàngwǔ shí diǎn', translation: '10 giờ sáng' },
      { text: '下午 3:00 (Xiàwǔ sān diǎn)', pinyin: 'Xiàwǔ sān diǎn', translation: '3 giờ chiều' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại: "改到下午两点半了" (chuyển sang 2 giờ rưỡi chiều). Đáp án đúng là A.',
    points: 33,
    relatedVocab: ['会议', '通知', '马上']
  },
  {
    id: 'q-hsk3-02-02',
    exam_id: 'hsk3-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：男的需要女的帮什么忙？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Nán de xūyào nǚ de bāng shénme máng?',
    translation: 'Người nam cần người nữ giúp việc gì?',
    audio_url: '',
    audio_script: '男：这篇新闻报道有很多生词，你能帮我翻译一下吗？女：没问题，我忙完手头的事就帮你看看。问：男的想请女的做什么？',
    options: [
      { text: '翻译文章 (Fānyì wénzhāng)', pinyin: 'Fānyì wénzhāng', translation: 'Dịch bài viết' },
      { text: '买报纸 (Mǎi bàozhǐ)', pinyin: 'Mǎi bàozhǐ', translation: 'Mua báo' },
      { text: '打扫办公室 (Dǎsǎo bàngōngshì)', pinyin: 'Dǎsǎo bàngōngshì', translation: 'Dọn dẹp văn phòng' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nhờ: "你能帮我翻译一下吗？" (Bạn có thể giúp tôi dịch một chút không?). Đáp án A là chính xác.',
    points: 33,
    relatedVocab: ['翻译', '新闻', '生词']
  },
  {
    id: 'q-hsk3-02-03',
    exam_id: 'hsk3-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 3,
    question_type: 'listening_mcq',
    prompt: '听短文，判断正误：[他打算换一份离家近的工作。]',
    pinyin: 'Tīng duǎnwén, pànduàn zhèngwù: [Tā dǎsuàn huàn yí fèn lí jiā jìn de gōngzuò.]',
    translation: 'Nghe đoạn văn, phán đoán đúng sai: "Anh ấy dự định đổi một công việc gần nhà hơn."',
    audio_url: '',
    audio_script: '虽然现在的工作收入不错，但是每天坐车要花两个多小时，太累了。所以我打算下个月换一份离家近点儿的工作。',
    options: [
      { text: '✓ Đúng (正确)', pinyin: 'Zhèngquè', translation: 'Khớp nội dung' },
      { text: '✗ Sai (错误)', pinyin: 'Cuòwù', translation: 'Không khớp nội dung' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn kết luận: "所以我打算下个月换一份离家近点儿的工作" (Vì vậy tôi dự định tháng sau đổi công việc gần nhà hơn một chút). Hoàn toàn đúng.',
    points: 34,
    relatedVocab: ['打算', '换工作', '收入']
  },

  // PHẦN ĐỌC HSK 3
  {
    id: 'q-hsk3-02-04',
    exam_id: 'hsk3-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'reading_mcq',
    prompt: '阅读短文，选择正确答案：\n\n经理对这次的活动策划很满意，特别是关于如何吸引年轻顾客的想法，他觉得非常有创意。',
    pinyin: 'Jīnglǐ duì zhè cì de huódòng cèhuà hěn mǎnyì, tèbié shì guānyú rúhé xīyǐn niánqīng gùkè de xiǎngfǎ, tā juéde fēicháng yǒu chuàngyì.',
    translation: 'Giám đốc rất hài lòng với kế hoạch sự kiện lần này, đặc biệt là ý tưởng thu hút khách hàng trẻ tuổi, ông ấy cảm thấy rất sáng tạo.',
    options: [
      { text: '经理很满意这个策划 (Jīnglǐ hěn mǎnyì zhège cèhuà)', pinyin: 'Jīnglǐ hěn mǎnyì zhège cèhuà', translation: 'Giám đốc rất hài lòng với kế hoạch này' },
      { text: '年轻顾客不喜欢这个活动 (Niánqīng gùkè bù xǐhuan zhège huódòng)', pinyin: 'Niánqīng gùkè bù xǐhuan zhège huódòng', translation: 'Khách hàng trẻ không thích sự kiện' },
      { text: '策划完全没有新想法 (Cèhuà wánquán méiyǒu xīn xiǎngfǎ)', pinyin: 'Cèhuà wánquán méiyǒu xīn xiǎngfǎ', translation: 'Kế hoạch không có ý tưởng mới' }
    ],
    correct_option_index: 0,
    explanation: 'Câu đầu tiên nêu rõ: "经理对这次的活动策划很满意" (Giám đốc rất hài lòng với kế hoạch hoạt động lần này). Đáp án A là chính xác.',
    points: 33,
    relatedVocab: ['满意', '特别是', '顾客']
  },
  {
    id: 'q-hsk3-02-05',
    exam_id: 'hsk3-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 5,
    question_type: 'reading_mcq',
    prompt: '选词填空：遇到困难的时候，我们______冷静，不能着急。',
    pinyin: 'Yùdào kùnnan de shíhou, wǒmen ______ lěngjìng, bù néng zháojí.',
    translation: 'Khi gặp khó khăn, chúng ta cần phải bình tĩnh, không được sốt ruột.',
    options: [
      { text: '必须 (Bìxū)', pinyin: 'Bìxū', translation: 'Bắt buộc / Cần phải' },
      { text: '突然 (Tūrán)', pinyin: 'Tūrán', translation: 'Đột nhiên' },
      { text: '其实 (Qíshí)', pinyin: 'Qíshí', translation: 'Kỳ thực / Thật ra' }
    ],
    correct_option_index: 0,
    explanation: '"必须" (bìxū - cần phải, bắt buộc) biểu thị yêu cầu về hành động và thái độ khi xử lý tình huống: "必须冷静" (phải bình tĩnh).',
    points: 33,
    relatedVocab: ['必须', '冷静', '着急']
  },
  {
    id: 'q-hsk3-02-06',
    exam_id: 'hsk3-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 6,
    question_type: 'reading_mcq',
    prompt: '选词填空：这张地图非常有用，______它，我们很顺利地找到了宾馆。',
    pinyin: 'Zhè zhāng dìtú fēicháng yǒuyòng, ______ tā, wǒmen hěn shùnlì de zhǎodào le bīnguǎn.',
    translation: 'Tấm bản đồ này rất hữu dụng, nhờ có nó, chúng tôi đã tìm thấy khách sạn rất thuận lợi.',
    options: [
      { text: '多亏 (Duōkuī)', pinyin: 'Duōkuī', translation: 'Nhờ có / May mà có' },
      { text: '除了 (Chúle)', pinyin: 'Chúle', translation: 'Ngoài ra' },
      { text: '关于 (Guānyú)', pinyin: 'Guānyú', translation: 'Về vấn đề' }
    ],
    correct_option_index: 0,
    explanation: '"多亏" (duōkuī - may nhờ có) biểu thị sự biết ơn hoặc nguyên nhân thuận lợi dẫn đến kết quả tốt đẹp.',
    points: 34,
    relatedVocab: ['多亏', '顺利', '宾馆']
  },

  // PHẦN VIẾT HSK 3 (Word-Order Sentence Builder)
  {
    id: 'q-hsk3-02-07',
    exam_id: 'hsk3-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 7,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：将词语排列成一句通顺的话（Sắp xếp từ thành câu）：',
    pinyin: 'Shūxiě: Jiāng cíyǔ páiliè chéng yí jù tōngshùn de huà:',
    translation: 'Phần Viết: Sắp xếp các từ ngữ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    words: ['请', '护照', '把', '给我'],
    scrambledWords: ['请', '护照', '把', '给我'],
    correct_order: ['请', '把', '护照', '给我'],
    answerKey: ['请', '把', '护照', '给我'],
    correct_sentence: '请把护照给我。',
    options: [
      { text: '请把护照给我。', pinyin: 'Qǐng bǎ hùzhào gěi wǒ.', translation: 'Xin hãy đưa hộ chiếu cho tôi.' },
      { text: '护照请把我给。', pinyin: 'Hùzhào qǐng bǎ wǒ gěi.', translation: 'Sai trật tự vị trí từ' },
      { text: '请给我把护照。', pinyin: 'Qǐng gěi wǒ bǎ hùzhào.', translation: 'Sai cấu trúc chữ 把' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc câu chữ 把 dạng mệnh lệnh: 请 + 把 + Tân ngữ (护照) + Động từ (给) + Tân ngữ gián tiếp (我).',
    points: 33,
    relatedVocab: ['把', '护照', '给']
  },
  {
    id: 'q-hsk3-02-08',
    exam_id: 'hsk3-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 8,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：将词语排列成通顺的句子：',
    pinyin: 'Shūxiě: Jiāng cíyǔ páiliè chéng tōngshùn de jùzi:',
    translation: 'Phần Viết: Sắp xếp các từ ngữ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    words: ['那本书', '借走了', '被', '李明'],
    scrambledWords: ['那本书', '借走了', '被', '李明'],
    correct_order: ['那本书', '被', '李明', '借走了'],
    answerKey: ['那本书', '被', '李明', '借走了'],
    correct_sentence: '那本书被李明借走了。',
    options: [
      { text: '那本书被李明借走了。', pinyin: 'Nà běn shū bèi Lǐ Míng jiè zǒu le.', translation: 'Quyển sách đó bị Lý Minh mượn đi rồi.' },
      { text: '李明被那本书借走了。', pinyin: 'Lǐ Míng bèi nà běn shū jiè zǒu le.', translation: 'Sai đối tượng chịu tác động' },
      { text: '那本书借走了被李明。', pinyin: 'Nà běn shū jiè zǒu le bèi Lǐ Míng.', translation: 'Sai vị trí giới từ 被' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc câu bị động chữ 被: Chủ ngữ tiếp nhận (那本书) + 被 + Tác nhân (李明) + Động từ (借) + Thành phần khác (走了).',
    points: 33,
    relatedVocab: ['被', '借', '书']
  },
  {
    id: 'q-hsk3-02-09',
    exam_id: 'hsk3-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 9,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：将词语排列成通顺的句子：',
    pinyin: 'Shūxiě: Jiāng cíyǔ páiliè chéng tōngshùn de jùzi:',
    translation: 'Phần Viết: Sắp xếp các từ ngữ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    words: ['越来越', '汉语水平', '他的', '高了'],
    scrambledWords: ['越来越', '汉语水平', '他的', '高了'],
    correct_order: ['他的', '汉语水平', '越来越', '高了'],
    answerKey: ['他的', '汉语水平', '越来越', '高了'],
    correct_sentence: '他的汉语水平越来越高了。',
    options: [
      { text: '他的汉语水平越来越高了。', pinyin: 'Tā de Hànyǔ shuǐpíng yuè lái yuè gāo le.', translation: 'Trình độ tiếng Trung của anh ấy ngày càng cao rồi.' },
      { text: '越来越高了他的汉语水平。', pinyin: 'Yuè lái yuè gāo le tā de Hànyǔ shuǐpíng.', translation: 'Sai đảo trật tự chủ ngữ' },
      { text: '他的越来越汉语水平高了。', pinyin: 'Tā de yuè lái yuè Hànyǔ shuǐpíng gāo le.', translation: 'Đặt sai vị trí phó từ 越来越' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc ngữ pháp HSK 3: Chủ ngữ (他的汉语水平) + 越来越 + Tính từ (高) + 了.',
    points: 34,
    relatedVocab: ['水平', '越来越', '汉语']
  },

  // =========================================================================
  // 4. HSK 4 MOCK 02 (9 câu: 3 Nghe + 3 Đọc + 3 Viết)
  // =========================================================================
  {
    id: 'q-hsk4-02-01',
    exam_id: 'hsk4-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：男的为什么感到吃惊？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Nán de wèishénme gǎndào chījīng?',
    translation: 'Tại sao người nam lại cảm thấy kinh ngạc?',
    audio_url: '',
    audio_script: '女：小王这次不仅通过了HSK四级考试，还考了满分呢！男：真没想到！他平时看起来不怎么爱看书，真是让人吃惊。问：男的为什么感到吃惊？',
    options: [
      { text: '小王考了满分 (Xiǎo Wáng kǎo le mǎnfēn)', pinyin: 'Xiǎo Wáng kǎo le mǎnfēn', translation: 'Tiểu Vương đạt điểm tối đa' },
      { text: '考试推迟了 (Kǎoshì tuīchí le)', pinyin: 'Kǎoshì tuīchí le', translation: 'Kỳ thi bị hoãn' },
      { text: '小王没有参加考试 (Xiǎo Wáng méiyǒu cānjiā kǎoshì)', pinyin: 'Xiǎo Wáng méiyǒu cānjiā kǎoshì', translation: 'Tiểu Vương không đi thi' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ nói Tiểu Vương không những đỗ mà còn được điểm tuyệt đối (考了满分), người nam thốt lên kinh ngạc "真没想到... 真是让人吃惊".',
    points: 33,
    relatedVocab: ['吃惊', '满分', '不仅']
  },
  {
    id: 'q-hsk4-02-02',
    exam_id: 'hsk4-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'listening_mcq',
    prompt: '听短文，选择正确答案：说话人认为成功最重要的是什么？',
    pinyin: 'Tīng duǎnwén, xuǎnzé zhèngquè dá\'àn: Shuōhuàrén rènwéi chénggōng zuì zhòngyào de shì shénme?',
    translation: 'Người nói cho rằng điều quan trọng nhất của thành công là gì?',
    audio_url: '',
    audio_script: '很多人以为成功靠的是运气或者聪明，其实最关键的是坚持。只要你认定了一个目标，不怕失败，一直走下去，就一定能看到希望。问：说话人认为成功的关键是什么？',
    options: [
      { text: '坚持 (Jiānchí)', pinyin: 'Jiānchí', translation: 'Sự kiên trì' },
      { text: '运气 (Yùnqi)', pinyin: 'Yùnqi', translation: 'May mắn' },
      { text: '聪明 (Cōngmíng)', pinyin: 'Cōngmíng', translation: 'Thông minh' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn nêu rõ: "其实最关键的是坚持" (Thực ra mấu chốt nhất chính là sự kiên trì). Do đó đáp án A là đúng.',
    points: 33,
    relatedVocab: ['坚持', '关键', '成功']
  },
  {
    id: 'q-hsk4-02-03',
    exam_id: 'hsk4-mock-02',
    part_type: 'listening',
    section: 'listening',
    part_number: 1,
    question_number: 3,
    question_type: 'listening_mcq',
    prompt: '听对话，选择正确答案：他们现在在商量什么？',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn: Tāmen xiànzài zài shāngliang shénme?',
    translation: 'Họ đang bàn bạc việc gì?',
    audio_url: '',
    audio_script: '男：下周要去拜访客户，礼品买茶叶合适还是买水果合适？女：客户是南方人，喜欢喝茶，我们还是送上好的龙井茶吧。问：他们正在商量什么？',
    options: [
      { text: '给客户送什么礼品 (Gěi kèhù sòng shénme lǐpǐn)', pinyin: 'Gěi kèhù sòng shénme lǐpǐn', translation: 'Tặng quà gì cho khách hàng' },
      { text: '什么时候出发 (Shénme shíhou chūfā)', pinyin: 'Shénme shíhou chūfā', translation: 'Khi nào xuất phát' },
      { text: '如何制作龙井茶 (Rúhé zhìzuò Lóngjǐng chá)', pinyin: 'Rúhé zhìzuò Lóngjǐng chá', translation: 'Cách làm trà Long Tỉnh' }
    ],
    correct_option_index: 0,
    explanation: 'Họ đang bàn luận nên mua trà hay hoa quả để làm quà biếu khách hàng (礼品买茶叶合适还是买水果合适).',
    points: 34,
    relatedVocab: ['礼品', '客户', '合适']
  },

  // PHẦN ĐỌC HSK 4 (Sắp xếp câu A - B - C)
  {
    id: 'q-hsk4-02-04',
    exam_id: 'hsk4-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'sentence_order_abc',
    propositions: {
      A: '另外，它还能帮你认识更多志同道合的朋友。',
      B: '跑步不仅能锻炼身体、减轻压力。',
      C: '所以很多人都喜欢这项运动。'
    },
    prompt: '阅读第二部分：排列顺序（Hãy sắp xếp các câu sau theo trình tự logic）：\nA. 另外，它还能帮你认识更多志同道合的朋友。\nB. 跑步不仅能锻炼身体、减轻压力。\nC. 所以很多人都喜欢这项运动。',
    pinyin: 'Páiliè shùnxù: A. Lìngwài, tā hái néng... B. Pǎobù bùjǐn... C. Suǒyǐ...',
    translation: 'Sắp xếp 3 câu theo thứ tự logic: A. Ngoài ra, nó còn... B. Chạy bộ không những... C. Cho nên nhiều người...',
    answerKey: 'BAC',
    correct_order_abc: 'BAC',
    options: [
      { text: 'B - A - C', pinyin: 'B - A - C', translation: 'Trình tự chuẩn logic' },
      { text: 'A - B - C', pinyin: 'A - B - C', translation: 'Sai vị trí mở đầu' },
      { text: 'C - B - A', pinyin: 'C - B - A', translation: 'Sai quan hệ kết quả' }
    ],
    correct_option_index: 0,
    explanation: 'Câu B giới thiệu chủ đề và lợi ích đầu tiên "不仅能...". Câu A bổ sung thêm lợi ích thứ hai "另外，还能...". Câu C đưa ra kết luận "所以...". Trình tự đúng là B-A-C.',
    points: 33,
    relatedVocab: ['不仅', '另外', '所以']
  },
  {
    id: 'q-hsk4-02-05',
    exam_id: 'hsk4-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 5,
    question_type: 'sentence_order_abc',
    propositions: {
      A: '科学研究表明，睡眠不足会影响大脑的反应速度。',
      B: '因此，每天保持充足的睡眠非常必要。',
      C: '甚至还会导致情绪不稳定和记忆力下降。'
    },
    prompt: '阅读第二部分：排列顺序：\nA. 科学研究表明，睡眠不足会影响大脑的反应速度。\nB. 因此，每天保持充足的睡眠非常必要。\nC. 甚至还会导致情绪不稳定和记忆力下降。',
    pinyin: 'Páiliè shùnxù: A. Kēxué yánjiū biǎomíng... B. Yīncǐ... C. Shènzhì hái huì...',
    translation: 'Sắp xếp 3 câu theo logic: A. Nghiên cứu khoa học chỉ ra thiếu ngủ ảnh hưởng... B. Do đó cần ngủ đủ... C. Thậm chí còn dẫn tới cảm xúc bất ổn...',
    answerKey: 'ACB',
    correct_order_abc: 'ACB',
    options: [
      { text: 'A - C - B', pinyin: 'A - C - B', translation: 'Trình tự chuẩn xác' },
      { text: 'B - A - C', pinyin: 'B - A - C', translation: 'Đưa kết luận lên đầu không hợp ngữ cảnh' },
      { text: 'C - A - B', pinyin: 'C - A - B', translation: 'Sai vị trí liên từ thậm chí 甚至' }
    ],
    correct_option_index: 0,
    explanation: 'Câu A nêu tác hại đầu tiên của việc thiếu ngủ. Câu C dùng "甚至还会..." để nâng mức tác hại trầm trọng hơn. Câu B dùng "因此..." để kết luận giải pháp. Trình tự đúng là A-C-B.',
    points: 33,
    relatedVocab: ['表明', '甚至', '因此']
  },
  {
    id: 'q-hsk4-02-06',
    exam_id: 'hsk4-mock-02',
    part_type: 'reading',
    section: 'reading',
    part_number: 2,
    question_number: 6,
    question_type: 'reading_mcq',
    prompt: '阅读短文，选择正确答案：\n\n有的人无论遇到什么事情，总能看到好的一面；而有的人却总是抱怨。其实，生活就像一面镜子，你对它笑，它就对你笑。这段话主要告诉我们：',
    pinyin: 'Zhè duàn huà zhǔyào gàosu wǒmen: 生活就像一面镜子...',
    translation: 'Đoạn văn này chủ yếu muốn khuyên chúng ta điều gì?',
    options: [
      { text: '要有积极乐观的生活态度 (Yào yǒu jījí lèguān de shēnghuó tàidù)', pinyin: 'Yào yǒu jījí lèguān de shēnghuó tàidù', translation: 'Cần có thái độ sống tích cực, lạc quan' },
      { text: '买镜子要注意质量 (Mǎi jìngzi yào zhùyì zhìliàng)', pinyin: 'Mǎi jìngzi yào zhùyì zhìliàng', translation: 'Mua gương phải chú ý chất lượng' },
      { text: '要学会多批评别人 (Yào xuéhuì duō pīpíng biérén)', pinyin: 'Yào xuéhuì duō pīpíng biérén', translation: 'Phải học cách phê bình người khác' }
    ],
    correct_option_index: 0,
    explanation: 'Hình ảnh ẩn dụ "生活就像一面镜子，你对它笑，它就对你笑" nhằm khuyên con người giữ thái độ lạc quan, tích cực trước mọi hoàn cảnh.',
    points: 34,
    relatedVocab: ['无论', '态度', '积极']
  },

  // PHẦN VIẾT HSK 4 (writing_reorder)
  {
    id: 'q-hsk4-02-07',
    exam_id: 'hsk4-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 7,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：排列词语成句：',
    pinyin: 'Shūxiě: Páiliè cíyǔ chéng jù:',
    translation: 'Phần Viết: Sắp xếp các từ ngữ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    words: ['连', '都', '三岁小孩', '知道这个道理'],
    scrambledWords: ['连', '都', '三岁小孩', '知道这个道理'],
    correct_order: ['连', '三岁小孩', '都', '知道这个道理'],
    answerKey: ['连', '三岁小孩', '都', '知道这个道理'],
    correct_sentence: '连三岁小孩都知道这个道理。',
    options: [
      { text: '连三岁小孩都知道这个道理。', pinyin: 'Lián sān suì xiǎohái dōu zhīdào zhège dàolǐ.', translation: 'Ngay cả đứa trẻ ba tuổi cũng biết đạo lý này.' },
      { text: '三岁小孩连知道这个道理都。', pinyin: 'Sān suì xiǎohái lián zhīdào zhège dàolǐ dōu.', translation: 'Sai cấu trúc chữ 连...都...' },
      { text: '连这个道理三岁小孩都知。', pinyin: 'Lián zhège dàolǐ sān suì xiǎohái dōu zhī.', translation: 'Sai trật tự nhấn mạnh' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc nhấn mạnh HSK 4: "连 + Danh từ/Mệnh đề nhấn mạnh + 都/也 + Vị ngữ": 连三岁小孩都知道这个道理。',
    points: 33,
    relatedVocab: ['连', '道理', '小孩']
  },
  {
    id: 'q-hsk4-02-08',
    exam_id: 'hsk4-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 8,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：排列词语成句：',
    pinyin: 'Shūxiě: Páiliè cíyǔ chéng jù:',
    translation: 'Phần Viết: Sắp xếp các cụm từ sau thành câu hoàn chỉnh:',
    words: ['把', '整理得', '干干净净', '她', '房间'],
    scrambledWords: ['把', '整理得', '干干净净', '她', '房间'],
    correct_order: ['她', '把', '房间', '整理得', '干干净净'],
    answerKey: ['她', '把', '房间', '整理得', '干干净净'],
    correct_sentence: '她把房间整理得干干净净。',
    options: [
      { text: '她把房间整理得干干净净。', pinyin: 'Tā bǎ fángjiān zhěnglǐ de gāngānjìngjìng.', translation: 'Cô ấy dọn dẹp căn phòng sạch bong kin kít.' },
      { text: '她房间把整理得干干净净。', pinyin: 'Tā fángjiān bǎ zhěnglǐ de gāngānjìngjìng.', translation: 'Đặt sai vị trí chữ 把' },
      { text: '房间把她整理得干干净净。', pinyin: 'Fángjiān bǎ tā zhěnglǐ de gāngānjìngjìng.', translation: 'Đảo ngược chủ ngữ tân ngữ' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc câu chữ 把 kết hợp bổ ngữ trạng thái: Chủ ngữ (她) + 把 + Tân ngữ (房间) + Động từ (整理) + 得 + Tính từ lặp (干干净净)。',
    points: 33,
    relatedVocab: ['整理', '干净', '房间']
  },
  {
    id: 'q-hsk4-02-09',
    exam_id: 'hsk4-mock-02',
    part_type: 'writing',
    section: 'writing',
    part_number: 3,
    question_number: 9,
    question_type: 'writing_reorder',
    prompt: '书写第一部分：排列词语成句：',
    pinyin: 'Shūxiě: Páiliè cíyǔ chéng jù:',
    translation: 'Phần Viết: Sắp xếp các từ sau thành câu so sánh hoàn chỉnh:',
    words: ['今年冬天的气温', '高得多', '比', '去年'],
    scrambledWords: ['今年冬天的气温', '高得多', '比', '去年'],
    correct_order: ['今年冬天的气温', '比', '去年', '高得多'],
    answerKey: ['今年冬天的气温', '比', '去年', '高得多'],
    correct_sentence: '今年冬天的气温比去年高得多。',
    options: [
      { text: '今年冬天的气温比去年高得多。', pinyin: 'Jīnnián dōngtiān de qìwēn bǐ qùnián gāo de duō.', translation: 'Nhiệt độ mùa đông năm nay cao hơn năm ngoái nhiều.' },
      { text: '今年冬天的气温高得多比去年。', pinyin: 'Jīnnián dōngtiān de qìwēn gāo de duō bǐ qùnián.', translation: 'Đặt sai vị trí cụm so sánh 比' },
      { text: '去年比今年冬天的气温高得多。', pinyin: 'Qùnián bǐ jīnnián dōngtiān de qìwēn gāo de duō.', translation: 'Nghịch nghĩa so sánh' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc câu so sánh chữ 比 có sai biệt lớn: A (今年冬天的气温) + 比 + B (去年) + Tính từ (高) + 得多/多了。',
    points: 34,
    relatedVocab: ['气温', '比', '冬天']
  },

  {
    "id": "q-hsk1-03-01",
    "exam_id": "hsk1-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听录音，判断听到的问候语：",
    "pinyin": "Tīng lùyīn, pànduàn tīngdào de wènhòuyǔ:",
    "translation": "Nghe đoạn ghi âm, xác định câu chào bạn nghe được:",
    "audio_url": "",
    "audio_script": "很高兴认识你。",
    "options": [
      {
        "text": "很高兴认识你。",
        "pinyin": "Hěn gāoxìng rènshi nǐ.",
        "translation": "Rất vui được quen biết bạn."
      },
      {
        "text": "谢谢你。",
        "pinyin": "Xièxie nǐ.",
        "translation": "Cảm ơn bạn."
      },
      {
        "text": "对不起。",
        "pinyin": "Duìbuqǐ.",
        "translation": "Xin lỗi."
      }
    ],
    "correct_option_index": 0,
    "explanation": "Băng ghi âm phát câu \"很高兴认识你\" (Rất vui được làm quen với bạn). Phương án A chính xác.",
    "points": 50,
    "relatedVocab": [
      "高兴",
      "认识",
      "你"
    ]
  },

  {
    "id": "q-hsk1-03-02",
    "exam_id": "hsk1-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听对话，选择正确的时间：",
    "pinyin": "Tīng duìhuà, xuǎnzé zhèngquè de shíjiān:",
    "translation": "Nghe hội thoại, chọn thời gian chính xác:",
    "audio_url": "",
    "audio_script": "男：现在几点了？ 女：现在八点三十分。",
    "options": [
      {
        "text": "8:30",
        "pinyin": "bā diǎn sānshí fēn",
        "translation": "8 giờ 30 phút"
      },
      {
        "text": "7:30",
        "pinyin": "qī diǎn sānshí fēn",
        "translation": "7 giờ 30 phút"
      },
      {
        "text": "9:00",
        "pinyin": "jiǔ diǎn",
        "translation": "9 giờ đúng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Nhân vật nữ nói rõ \"八点三十分\" (8 giờ 30 phút). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "现在",
      "点",
      "分"
    ]
  },

  {
    "id": "q-hsk1-03-03",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "选择正确的量词填空：我买了三______苹果。",
    "pinyin": "Xuǎnzé zhèngquè de liàngcí tiánkòng: Wǒ mǎi le sān ______ píngguǒ.",
    "translation": "Chọn lượng từ phù hợp điền vào chỗ trống: Tôi đã mua ba quả táo.",
    "options": [
      {
        "text": "个",
        "pinyin": "gè",
        "translation": "cái, quả (lượng từ phổ biến)"
      },
      {
        "text": "本",
        "pinyin": "běn",
        "translation": "quyển, cuốn (cho sách vở)"
      },
      {
        "text": "位",
        "pinyin": "wèi",
        "translation": "vị, ngài (chỉ người trang trọng)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Lượng từ đi kèm với hoa quả như táo (苹果) là \"个\". \"本\" dùng cho sách vở, \"位\" dùng chỉ người lịch sự.",
    "points": 50,
    "relatedVocab": [
      "苹果",
      "买",
      "个"
    ]
  },

  {
    "id": "q-hsk1-03-04",
    "exam_id": "hsk1-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "选择正确的代词：______是我的汉语老师。",
    "pinyin": "Xuǎnzé zhèngquè de dàicí: ______ shì wǒ de Hànyǔ lǎoshī.",
    "translation": "Chọn đại từ phù hợp: Cô ấy là giáo viên tiếng Trung của tôi.",
    "options": [
      {
        "text": "她",
        "pinyin": "tā",
        "translation": "cô ấy, bà ấy"
      },
      {
        "text": "什么",
        "pinyin": "shénme",
        "translation": "cái gì"
      },
      {
        "text": "哪儿",
        "pinyin": "nǎr",
        "translation": "ở đâu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Vị trí đầu câu cần một đại từ nhân xưng làm chủ ngữ: \"她\" (Cô ấy/Bà ấy). Câu hoàn chỉnh: 她是我的汉语老师。",
    "points": 50,
    "relatedVocab": [
      "老师",
      "汉语",
      "她"
    ]
  },

  {
    "id": "q-hsk2-03-01",
    "exam_id": "hsk2-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听对话，选择男人的交通方式：",
    "pinyin": "Tīng duìhuà, xuǎnzé nánrén de jiāotōng fāngshì:",
    "translation": "Nghe hội thoại, chọn phương tiện giao thông của người đàn ông:",
    "audio_url": "",
    "audio_script": "女：你怎么去公司？ 男：今天天气很好，我骑自行车去。",
    "options": [
      {
        "text": "骑自行车",
        "pinyin": "qí zìxíngchē",
        "translation": "Đi xe đạp"
      },
      {
        "text": "坐公共汽车",
        "pinyin": "zuò gōnggòng qìchē",
        "translation": "Đi xe buýt"
      },
      {
        "text": "坐出租车",
        "pinyin": "zuò chūzūchē",
        "translation": "Đi taxi"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nam nói: \"我骑自行车去\" (Tôi đi xe đạp đi làm). Phương án A chính xác.",
    "points": 50,
    "relatedVocab": [
      "自行车",
      "骑",
      "公司"
    ]
  },

  {
    "id": "q-hsk2-03-02",
    "exam_id": "hsk2-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听对话，选择女人想买的颜色：",
    "pinyin": "Tīng duìhuà, xuǎnzé nǚrén xiǎng mǎi de yánsè:",
    "translation": "Nghe hội thoại, chọn màu sắc người phụ nữ muốn mua:",
    "audio_url": "",
    "audio_script": "男：这件黑色的衣服怎么样？ 女：有点儿贵，我想看看那件白色的。",
    "options": [
      {
        "text": "白色",
        "pinyin": "báisè",
        "translation": "Màu trắng"
      },
      {
        "text": "黑色",
        "pinyin": "hēisè",
        "translation": "Màu đen"
      },
      {
        "text": "红色",
        "pinyin": "hóngsè",
        "translation": "Màu đỏ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ trả lời áo màu đen hơi đắt và nói: \"我想看看那件白色的\" (Tôi muốn xem chiếc màu trắng kia). Đáp án là màu trắng (白色).",
    "points": 50,
    "relatedVocab": [
      "白色",
      "黑色",
      "颜色"
    ]
  },

  {
    "id": "q-hsk2-03-03",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "读句子选词填空：外面下大雨了，你别忘了带______。",
    "pinyin": "Dú jùzi xuǎn cí tiánkòng: Wàimiàn xià dàyǔ le, nǐ bié wàng le dài ______.",
    "translation": "Đọc câu và chọn từ điền vào chỗ trống: Ngoài trời mưa to rồi, bạn đừng quên mang ô.",
    "options": [
      {
        "text": "雨伞",
        "pinyin": "yǔsǎn",
        "translation": "cái ô, chiếc dù"
      },
      {
        "text": "手表",
        "pinyin": "shǒubiǎo",
        "translation": "đồng hồ đeo tay"
      },
      {
        "text": "报纸",
        "pinyin": "bàozhǐ",
        "translation": "tờ báo"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Ngữ cảnh trời mưa (下大雨) nên vật dụng cần mang theo để che mưa là chiếc ô (雨伞).",
    "points": 50,
    "relatedVocab": [
      "雨伞",
      "外面",
      "下雨"
    ]
  },

  {
    "id": "q-hsk2-03-04",
    "exam_id": "hsk2-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "选择正确的助词：哥哥比弟弟跑______快。",
    "pinyin": "Xuǎnzé zhèngquè de zhùcí: Gēge bǐ dìdi pǎo ______ kuài.",
    "translation": "Chọn trợ từ đúng: Anh trai chạy nhanh hơn em trai.",
    "options": [
      {
        "text": "得",
        "pinyin": "de",
        "translation": "trợ từ bổ ngữ trạng thái"
      },
      {
        "text": "的",
        "pinyin": "de",
        "translation": "trợ từ định ngữ sở hữu"
      },
      {
        "text": "地",
        "pinyin": "de",
        "translation": "trợ từ trạng ngữ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Sau động từ \"跑\" và trước tính từ miêu tả trình độ \"快\" bắt buộc dùng trợ từ kết cấu \"得\" để tạo bổ ngữ trạng thái (跑得快).",
    "points": 50,
    "relatedVocab": [
      "比",
      "得",
      "快"
    ]
  },

  {
    "id": "q-hsk3-03-01",
    "exam_id": "hsk3-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听对话，选择对话发生的地点：",
    "pinyin": "Tīng duìhuà, xuǎnzé duìhuà fāshēng de dìdiǎn:",
    "translation": "Nghe hội thoại, chọn địa điểm xảy ra cuộc đối thoại:",
    "audio_url": "",
    "audio_script": "男：先生，请问您想喝点儿什么？咖啡还是绿茶？ 女：给我一杯温水就可以了，顺便把菜单拿给我看看。",
    "options": [
      {
        "text": "餐厅/咖啡厅",
        "pinyin": "cāntīng / kāfēitīng",
        "translation": "Nhà hàng / Quán cà phê"
      },
      {
        "text": "图书馆",
        "pinyin": "túshūguǎn",
        "translation": "Thư viện"
      },
      {
        "text": "火车站",
        "pinyin": "huǒchēzhàn",
        "translation": "Nhà ga xe lửa"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Từ khóa \"咖啡\" (cà phê), \"绿茶\" (trà xanh), \"菜单\" (thực đơn) chỉ ra bối cảnh diễn ra tại nhà hàng hoặc quán cà phê.",
    "points": 50,
    "relatedVocab": [
      "菜单",
      "饮料",
      "咖啡"
    ]
  },

  {
    "id": "q-hsk3-03-02",
    "exam_id": "hsk3-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听短文，判断男人的身体状况：",
    "pinyin": "Tīng duǎnwén, pànduàn nánrén de shēntǐ zhuàngkuàng:",
    "translation": "Nghe đoạn văn ngắn, đánh giá tình trạng sức khỏe của người đàn ông:",
    "audio_url": "",
    "audio_script": "大夫说我感冒虽然不严重，但最近工作太累，必须按时吃药，多喝热水并休息两天。",
    "options": [
      {
        "text": "需要按时吃药多休息",
        "pinyin": "Xūyào ànshí chīyào duō xiūxi",
        "translation": "Cần uống thuốc đúng giờ và nghỉ ngơi nhiều"
      },
      {
        "text": "生病非常严重需要住院",
        "pinyin": "Shēngbìng fēicháng yánzhòng xūyào zhùyuàn",
        "translation": "Bệnh rất nặng cần nhập viện"
      },
      {
        "text": "身体完全没有生病",
        "pinyin": "Shēntǐ wánquán méiyǒu shēngbìng",
        "translation": "Hoàn toàn không có bệnh"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Bác sĩ dặn dò: \"必须按时吃药，多喝热水并休息两天\" (Phải uống thuốc đúng giờ, uống nhiều nước ấm và nghỉ ngơi 2 ngày). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "感冒",
      "按时",
      "休息"
    ]
  },

  {
    "id": "q-hsk3-03-03",
    "exam_id": "hsk3-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "阅读句子并选词填空：虽然遇到很多困难，但他______没有放弃学习汉语的计划。",
    "pinyin": "Dú jùzi bìng xuǎn cí tiánkòng: Suīrán yùdào hěn duō kùnnán, dàn tā ______ méiyǒu fàngqì xuéxí Hànyǔ de jìhuà.",
    "translation": "Đọc câu và chọn từ điền vào chỗ trống: Tuy gặp nhiều khó khăn, nhưng anh ấy vẫn không từ bỏ kế hoạch học tiếng Trung.",
    "options": [
      {
        "text": "依然",
        "pinyin": "yīrán",
        "translation": "vẫn như cũ, y nguyên"
      },
      {
        "text": "突然",
        "pinyin": "tūrán",
        "translation": "đột nhiên"
      },
      {
        "text": "或者",
        "pinyin": "huòzhě",
        "translation": "hoặc là"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cặp liên từ nhượng bộ \"虽然...但...依然...\" (Tuy... nhưng vẫn...). \"依然\" mang sắc thái kiên trì, không thay đổi.",
    "points": 50,
    "relatedVocab": [
      "依然",
      "放弃",
      "困难"
    ]
  },

  {
    "id": "q-hsk3-03-04",
    "exam_id": "hsk3-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "读短文选择主旨：运动不仅能让人身体健康，更能让人心情愉快。所以每天哪怕只散步半小时，也是很有好处的。",
    "pinyin": "Dú duǎnwén xuǎnzé zhǔzhǐ:",
    "translation": "Đọc đoạn văn và chọn ý chính: Thể thao không chỉ giúp cơ thể khỏe mạnh, mà còn làm tâm trạng vui vẻ. Cho nên mỗi ngày dù chỉ đi bộ nửa giờ cũng rất có ích.",
    "options": [
      {
        "text": "每天坚持运动对身心都有益处",
        "pinyin": "Měitiān jiānchí yùndòng duì shēnxīn dōu yǒu yìchu",
        "translation": "Kiên trì vận động mỗi ngày có ích cho cả thể chất lẫn tinh thần"
      },
      {
        "text": "散步是最累的运动方式",
        "pinyin": "Sànbù shì zuì lèi de yùndòng fāngshì",
        "translation": "Đi bộ là phương thức vận động mệt nhất"
      },
      {
        "text": "身体健康不需要运动",
        "pinyin": "Shēntǐ jiànkāng bù xūyào yùndòng",
        "translation": "Khỏe mạnh không cần thể thao"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn nhấn mạnh lợi ích của việc vận động mỗi ngày (哪怕只散步半小时，也是很有好处的). Phương án A tóm tắt trọn vẹn chủ đề.",
    "points": 50,
    "relatedVocab": [
      "坚持",
      "益处",
      "散步"
    ]
  },

  {
    "id": "q-hsk3-03-05",
    "exam_id": "hsk3-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các từ ngữ sau thành câu hoàn chỉnh:",
    "words": [
      "请",
      "把",
      "那本词典",
      "给我",
      "递过来"
    ],
    "scrambledWords": [
      "请",
      "把",
      "那本词典",
      "给我",
      "递过来"
    ],
    "correct_order": [
      "请",
      "把",
      "那本词典",
      "递过来",
      "给我"
    ],
    "answerKey": [
      "请",
      "把",
      "那本词典",
      "递过来",
      "给我"
    ],
    "correct_sentence": "请把那本词典递过来给我。",
    "options": [
      {
        "text": "请把那本词典递过来给我。",
        "pinyin": "Qǐng bǎ nà běn cídiǎn dì guòlái gěi wǒ.",
        "translation": "Làm ơn đưa quyển từ điển kia sang cho tôi."
      },
      {
        "text": "请那本词典把递过来给我。",
        "pinyin": "Qǐng nà běn cídiǎn bǎ dì guòlái gěi wǒ.",
        "translation": "Sai vị trí giới từ 把"
      },
      {
        "text": "把那本词典递过来请给我。",
        "pinyin": "Bǎ nà běn cídiǎn dì guòlái qǐng gěi wǒ.",
        "translation": "Đặt từ kính ngữ 请 sai vị trí"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu cầu khiến chữ 把: 请 + 把 + Tân ngữ (那本词典) + Động từ kèm hướng (递过来) + Đối tượng (给我)。",
    "points": 50,
    "relatedVocab": [
      "词典",
      "递",
      "把"
    ]
  },

  {
    "id": "q-hsk3-03-06",
    "exam_id": "hsk3-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các từ sau thành câu chỉ năng lực:",
    "words": [
      "他",
      "能够",
      "听懂",
      "完全",
      "中文广播"
    ],
    "scrambledWords": [
      "他",
      "能够",
      "听懂",
      "完全",
      "中文广播"
    ],
    "correct_order": [
      "他",
      "完全",
      "能够",
      "听懂",
      "中文广播"
    ],
    "answerKey": [
      "他",
      "完全",
      "能够",
      "听懂",
      "中文广播"
    ],
    "correct_sentence": "他完全能够听懂中文广播。",
    "options": [
      {
        "text": "他完全能够听懂中文广播。",
        "pinyin": "Tā wánquán nénggòu tīngdǒng Zhōngwén guǎngbō.",
        "translation": "Anh ấy hoàn toàn có thể nghe hiểu đài phát thanh tiếng Trung."
      },
      {
        "text": "他能够听懂完全中文广播。",
        "pinyin": "Tā nénggòu tīngdǒng wánquán Zhōngwén guǎngbō.",
        "translation": "Phó từ 完全 đặt sai sau động từ"
      },
      {
        "text": "中文广播完全能够听懂他。",
        "pinyin": "Zhōngwén guǎngbō wánquán nénggòu tīngdǒng tā.",
        "translation": "Đảo ngược chủ thể và đối tượng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Trật tự câu: Chủ ngữ (他) + Phó từ mức độ (完全) + Động từ năng nguyện (能够) + Động từ kết quả (听懂) + Tân ngữ (中文广播)。",
    "points": 50,
    "relatedVocab": [
      "能够",
      "听懂",
      "广播"
    ]
  },

  {
    "id": "q-hsk4-03-01",
    "exam_id": "hsk4-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听对话，选择两人商量的事情：",
    "pinyin": "Tīng duìhuà, xuǎnzé liǎngrén shāngliang de shìqing:",
    "translation": "Nghe hội thoại, chọn sự việc hai người đang bàn bạc:",
    "audio_url": "",
    "audio_script": "男：这次市场调查报告，你打算什么时候提交？ 女：我还需要整理一部分问卷数据，预计周五下午开会前交给经理。",
    "options": [
      {
        "text": "提交市场调查报告的时间",
        "pinyin": "Tíjiāo shìchǎng diàochá bàogào de shíjiān",
        "translation": "Thời gian nộp báo cáo khảo sát thị trường"
      },
      {
        "text": "招聘新员工面试",
        "pinyin": "Zhāopìn xīn yuángōng miànshì",
        "translation": "Phỏng vấn tuyển nhân viên mới"
      },
      {
        "text": "取消周五的部门会议",
        "pinyin": "Qǔxiāo zhōuwǔ de bùmén huìyì",
        "translation": "Hủy cuộc họp phòng ban thứ Sáu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hai nhân vật thảo luận về \"市场调查报告什么时候提交\" (Thời điểm nộp báo cáo khảo sát thị trường). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "调查",
      "报告",
      "预计"
    ]
  },

  {
    "id": "q-hsk4-03-02",
    "exam_id": "hsk4-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听对话，判断女人的态度：",
    "pinyin": "Tīng duìhuà, pànduàn nǚrén de tàidù:",
    "translation": "Nghe hội thoại, nhận định thái độ của người phụ nữ:",
    "audio_url": "",
    "audio_script": "男：遇到挫折别太难过，总结经验下次一定能成功。 女：谢谢你的鼓励，我不会灰心的，明天重新开始！",
    "options": [
      {
        "text": "乐观坚强，不轻言放弃",
        "pinyin": "Lèguān jiānqiáng, bù qīng yán fàngqì",
        "translation": "Lạc quan kiên cường, không dễ dàng bỏ cuộc"
      },
      {
        "text": "极度沮丧，打算彻底放弃",
        "pinyin": "Jídù jǔsàng, dǎsuàn chèdǐ fàngqì",
        "translation": "Vô cùng chán nản, định từ bỏ hoàn toàn"
      },
      {
        "text": "抱怨他人不负责任",
        "pinyin": "Bàoyuàn tārén bù fù zérèn",
        "translation": "Phàn nàn người khác vô trách nhiệm"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Người nữ trả lời: \"我不会灰心的，明天重新开始\" (Tôi sẽ không nản lòng đâu, ngày mai làm lại từ đầu), thể hiện tinh thần lạc quan, kiên định. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "鼓励",
      "灰心",
      "态度"
    ]
  },

  {
    "id": "q-hsk4-03-03",
    "exam_id": "hsk4-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "sentence_order_abc",
    "propositions": {
      "A": "只要我们每天坚持阅读和交流，",
      "B": "语言能力的提升并不是一朝一夕的事情，",
      "C": "就一定能够取得令人惊喜的进步。"
    },
    "prompt": "阅读第二部分：排列顺序（Hãy sắp xếp các câu sau theo trình tự logic）：\nA. 只要我们每天坚持阅读和交流，\nB. 语言能力的提升并不是一朝一夕的事情，\nC. 就一定能够取得令人惊喜的进步。",
    "pinyin": "Páiliè shùnxù: A. Zhǐyào wǒmen měitiān... B. Yǔyán nénglì de tíshēng... C. Jiù yídìng nénggòu...",
    "translation": "Sắp xếp câu: B nêu tiền đề ngôn ngữ cần thời gian. A đưa điều kiện \"只要...\". C đưa kết quả \"就...\". Trật tự đúng là B-A-C.",
    "answerKey": "BAC",
    "correct_order_abc": "BAC",
    "options": [
      {
        "text": "B - A - C",
        "pinyin": "B - A - C",
        "translation": "Trình tự logic chuẩn"
      },
      {
        "text": "A - B - C",
        "pinyin": "A - B - C",
        "translation": "Đặt điều kiện trước mở đề"
      },
      {
        "text": "C - A - B",
        "pinyin": "C - A - B",
        "translation": "Sai vị trí hệ quả 就"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu B mở đầu nêu thực tế khách quan. Cặp liên từ điều kiện \"只要 (A) ... 就 (C) ...\". Trình tự đúng: B-A-C.",
    "points": 50,
    "relatedVocab": [
      "坚持",
      "交流",
      "只要"
    ]
  },

  {
    "id": "q-hsk4-03-04",
    "exam_id": "hsk4-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "阅读短文选择最符合文意的选项：真正的友谊不是天天形影不离，而是在你需要帮助的时候，对方能毫不犹豫地伸出援助之手。",
    "pinyin": "Dú duǎnwén xuǎnzé zuì fúhé wényì de xuǎnxiàng:",
    "translation": "Đọc đoạn văn và chọn phương án chuẩn xác: Tình bạn chân chính không phải ngày ngày dính lấy nhau, mà là khi bạn cần giúp đỡ, đối phương không do dự đưa tay tương trợ.",
    "options": [
      {
        "text": "患难时刻见真情才是真正的友谊",
        "pinyin": "Huànnàn shíkè jiàn zhēnqíng cái shì zhēnzhèng de yǒuyì",
        "translation": "Lúc hoạn nạn mới thấy chân tình chính là tình bạn thực sự"
      },
      {
        "text": "好朋友必须天天在一起吃饭",
        "pinyin": "Hǎo péngyou bìxū tiāntiān zài yìqǐ chīfàn",
        "translation": "Bạn tốt bắt buộc ngày nào cũng ăn cùng nhau"
      },
      {
        "text": "友谊不需要互相帮助",
        "pinyin": "Yǒuyì bù xūyào hùxiāng bāngzhù",
        "translation": "Tình bạn không cần tương trợ lẫn nhau"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn định nghĩa tình bạn đích thực qua việc sẵn lòng tương trợ khi gặp khó khăn. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "友谊",
      "犹豫",
      "援助"
    ]
  },

  {
    "id": "q-hsk4-03-05",
    "exam_id": "hsk4-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các cụm từ sau thành câu chữ 被 chuẩn xác:",
    "words": [
      "那个小偷",
      "被",
      "抓住了",
      "当场",
      "警察"
    ],
    "scrambledWords": [
      "那个小偷",
      "被",
      "抓住了",
      "当场",
      "警察"
    ],
    "correct_order": [
      "那个小偷",
      "被",
      "警察",
      "当场",
      "抓住了"
    ],
    "answerKey": [
      "那个小偷",
      "被",
      "警察",
      "当场",
      "抓住了"
    ],
    "correct_sentence": "那个小偷被警察当场抓住了。",
    "options": [
      {
        "text": "那个小偷被警察当场抓住了。",
        "pinyin": "Nàge xiǎotōu bèi jǐngchá dāngchǎng zhuāzhù le.",
        "translation": "Tên trộm đó đã bị cảnh sát bắt giữ ngay tại trận."
      },
      {
        "text": "警察被那个小偷当场抓住了。",
        "pinyin": "Jǐngchá bèi nàge xiǎotōu dāngchǎng zhuāzhù le.",
        "translation": "Đảo ngược chủ thể bị động"
      },
      {
        "text": "那个小偷当场被抓住了警察。",
        "pinyin": "Nàge xiǎotōu dāngchǎng bèi zhuāzhù le jǐngchá.",
        "translation": "Đặt sai vị trí tác nhân sau động từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu bị động chữ 被: Chủ thể chịu tác động (那个小偷) + 被 + Tác nhân (警察) + Phó từ trạng ngữ (当场) + Động từ (抓住了)。",
    "points": 50,
    "relatedVocab": [
      "小偷",
      "警察",
      "被"
    ]
  },

  {
    "id": "q-hsk4-03-06",
    "exam_id": "hsk4-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp câu phức biểu thị nguyên nhân - kết quả:",
    "words": [
      "由于",
      "交通拥堵",
      "他",
      "迟到了",
      "半个小时"
    ],
    "scrambledWords": [
      "由于",
      "交通拥堵",
      "他",
      "迟到了",
      "半个小时"
    ],
    "correct_order": [
      "由于",
      "交通拥堵",
      "他",
      "迟到了",
      "半个小时"
    ],
    "answerKey": [
      "由于",
      "交通拥堵",
      "他",
      "迟到了",
      "半个小时"
    ],
    "correct_sentence": "由于交通拥堵，他迟到了半个小时。",
    "options": [
      {
        "text": "由于交通拥堵，他迟到了半个小时。",
        "pinyin": "Yóuyú jiāotōng yōngdǔ, tā chídào le bàn ge xiǎoshí.",
        "translation": "Do tắc đường, anh ấy đã đến muộn nửa tiếng đồng hồ."
      },
      {
        "text": "他迟到了由于交通拥堵半个小时。",
        "pinyin": "Tā chídào le yóuyú jiāotōng yōngdǔ bàn ge xiǎoshí.",
        "translation": "Ngắt sai ngữ đoạn nguyên nhân"
      },
      {
        "text": "交通拥堵由于他半个小时迟到了。",
        "pinyin": "Jiāotōng yōngdǔ yóuyú tā bàn ge xiǎoshí chídào le.",
        "translation": "Lỗi ngữ pháp trật tự từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc biểu thị nguyên nhân: 由于 + Cụm danh từ nguyên nhân (交通拥堵) + Mệnh đề kết quả (他迟到了半个小时)。",
    "points": 50,
    "relatedVocab": [
      "由于",
      "拥堵",
      "迟到"
    ]
  },

  {
    "id": "q-hsk5-02-01",
    "exam_id": "hsk5-mock-02",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听长对话，分析企业创新的核心动力：",
    "pinyin": "Tīng cháng duìhuà, fēnxī qǐyè chuàngxīn de héxīn dònglì:",
    "translation": "Nghe hội thoại dài, phân tích động lực cốt lõi của đổi mới sáng tạo doanh nghiệp:",
    "audio_url": "",
    "audio_script": "女：李总，您认为贵公司在激烈的数字化浪潮中能够持续领先的关键是什么？ 男：除了资金投入，最关键的是我们营造了包容失败、鼓励自主探索的研发机制，让青年人才敢于突破思维定式。",
    "options": [
      {
        "text": "包容失败、鼓励探索的科研机制与青年人才",
        "pinyin": "Bāoróng shībài, gǔlì tànsuǒ de kēyán jīzhì yǔ qīngnián réncái",
        "translation": "Cơ chế nghiên cứu dung nạp thất bại, khuyến khích tìm tòi và nhân tài trẻ"
      },
      {
        "text": "只依靠大量资本并购其他小公司",
        "pinyin": "Zhǐ yīkào dàliàng zīběn bìnggòu qítā xiǎo gōngsī",
        "translation": "Chỉ dựa vào thâu tóm vốn các công ty nhỏ"
      },
      {
        "text": "完全模仿国外成熟的产品设计",
        "pinyin": "Wánquán mófǎng guówài chéngshú de chǎnpǐn shèjì",
        "translation": "Sao chép hoàn toàn mẫu mã nước ngoài"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Giám đốc Lý khẳng định yếu tố quyết định là cơ chế bao dung thất bại, khuyến khích tự chủ tìm tòi và trao quyền cho nhân tài trẻ (包容失败、鼓励自主探索的研发机制). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "机制",
      "突破",
      "思维"
    ]
  },

  {
    "id": "q-hsk5-02-02",
    "exam_id": "hsk5-mock-02",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听报告节选，判断生态环境保护的核心措施：",
    "pinyin": "Tīng bàogào jiéxuǎn, pànduàn shēngtài huánjìng bǎohù de héxīn cuòshī:",
    "translation": "Nghe trích đoạn báo cáo, xác định giải pháp trọng tâm bảo vệ môi trường sinh thái:",
    "audio_url": "",
    "audio_script": "生态环境保护不仅需要严格的法律制度红线，更依赖于科技赋能。通过清洁能源替代和工业碳减排，实现经济发展与绿水青山的协同共赢。",
    "options": [
      {
        "text": "法律刚性约束与清洁能源低碳科技协同",
        "pinyin": "Fǎlǜ gāngxìng yuēshù yǔ qīngjié néngyuán dītàn kējì xiétóng",
        "translation": "Khung pháp lý nghiêm ngặt kết hợp công nghệ năng lượng sạch giảm carbon"
      },
      {
        "text": "全面叫停所有工业生产活动",
        "pinyin": "Quánmiàn jiàotíng suǒyǒu gōngyè shēngchǎn huódòng",
        "translation": "Dừng toàn bộ sản xuất công nghiệp"
      },
      {
        "text": "放任排污以换取短期经济高速增长",
        "pinyin": "Fàngrèn páiwū yǐ huànqǔ duǎnqī jīngjì gāosù zēngzhǎng",
        "translation": "Thả nổi xả thải để tăng trưởng nóng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Báo cáo chỉ rõ cần phối hợp chặt chẽ giữa kỷ cương luật pháp (法律红线) và giải pháp năng lượng sạch (清洁能源协同). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "协同",
      "生态",
      "约束"
    ]
  },

  {
    "id": "q-hsk5-02-03",
    "exam_id": "hsk5-mock-02",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "选词填空：面对复杂多变的世界经济形势，我们必须保持战略定力，______抓住产业升级的历史机遇。",
    "pinyin": "Xuǎn cí tiánkòng: Miànduì fùzá duōbiàn de shìjiè jīngjì xíngshì, wǒmen bìxū bǎochí zhànlüè dìnglì, ______ zhuāzhù chǎnyè shēngjí de lìshǐ jīyù.",
    "translation": "Chọn từ điền vào chỗ trống: Đối mặt với tình hình kinh tế biến chuyển phức tạp, chúng ta phải giữ vững định lực chiến lược, nắm chắc cơ hội lịch sử nâng cấp ngành công nghiệp.",
    "options": [
      {
        "text": "牢牢",
        "pinyin": "láoláo",
        "translation": "vững chắc, chặt chẽ (nắm giữ)"
      },
      {
        "text": "匆匆",
        "pinyin": "cōngcōng",
        "translation": "vội vã, hấp tấp"
      },
      {
        "text": "渐渐",
        "pinyin": "jiànjiàn",
        "translation": "dần dần"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm từ phối hợp chuẩn HSK 5: \"牢牢抓住机遇\" (nắm chắc, giữ chặt lấy thời cơ). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "机遇",
      "战略",
      "牢牢"
    ]
  },

  {
    "id": "q-hsk5-02-04",
    "exam_id": "hsk5-mock-02",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "阅读学术段落并概括主旨：所谓“工匠精神”，本质上是一种精益求精、甘于寂寞的职业信念。它不仅体现在对产品毫厘之间的极致打磨，更是对职业尊严与社会责任的高度自觉。",
    "pinyin": "Dú xuéshù duànluò bìng gàikuò zhǔzhǐ:",
    "translation": "Đọc đoạn văn học thuật và tóm lược chủ đề: \"Tinh thần nghệ nhân\" bản chất là niềm tin nghề nghiệp cầu toàn, kiên trì. Nó không chỉ ở sự mài giũa tỉ mỉ từng chi tiết mà còn là trách nhiệm xã hội và tự trọng nghề nghiệp.",
    "options": [
      {
        "text": "工匠精神是对专业精益求精与高度职业敬畏的升华",
        "pinyin": "Gōngjiàng jīngshén shì duì zhuānyè jīngyìqiújīng...",
        "translation": "Tinh thần nghệ nhân là sự thăng hoa của tính tận tâm và lòng kính nghiệp"
      },
      {
        "text": "工匠精神只适用于古代手工艺制作",
        "pinyin": "Gōngjiàng jīngshén zhǐ shìyòng yú gǔdài...",
        "translation": "Tinh thần này chỉ dành cho thủ công cổ đại"
      },
      {
        "text": "现代工业流水线不需要工匠精神",
        "pinyin": "Xiàndài gōngyè liúshuǐxiàn bù xūyào...",
        "translation": "Dây chuyền hiện đại không cần tinh thần nghệ nhân"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Đoạn văn mở rộng định nghĩa \"工匠精神\" lên tầm cao đạo đức nghề nghiệp và tự trọng xã hội. Phương án A phản ánh sâu sắc nhất.",
    "points": 50,
    "relatedVocab": [
      "精益求精",
      "自觉",
      "尊严"
    ]
  },

  {
    "id": "q-hsk5-02-05",
    "exam_id": "hsk5-mock-02",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các cụm từ thành câu hoàn chỉnh biểu thị tính quy luật:",
    "words": [
      "任何事物的发展",
      "经历",
      "都不可避免地要",
      "曲折的过程"
    ],
    "scrambledWords": [
      "任何事物的发展",
      "经历",
      "都不可避免地要",
      "曲折的过程"
    ],
    "correct_order": [
      "任何事物的发展",
      "都不可避免地要",
      "经历",
      "曲折的过程"
    ],
    "answerKey": [
      "任何事物的发展",
      "都不可避免地要",
      "经历",
      "曲折的过程"
    ],
    "correct_sentence": "任何事物的发展都不可避免地要经历曲折的过程。",
    "options": [
      {
        "text": "任何事物的发展都不可避免地要经历曲折的过程。",
        "pinyin": "Rènhé shìwù de fāzhǎn dōu bùkě bìmiǎn de yào jīnglì qūzhé de guòchéng.",
        "translation": "Sự phát triển của bất kỳ sự vật nào cũng không thể tránh khỏi phải trải qua quá trình quanh co trắc trở."
      },
      {
        "text": "曲折的过程都不可避免地要经历任何事物的发展。",
        "pinyin": "Qūzhé de guòchéng dōu bùkě bìmiǎn...",
        "translation": "Đảo lộn chủ ngữ vị ngữ triết học"
      },
      {
        "text": "任何事物的发展经历都不可避免地要曲折的过程。",
        "pinyin": "Rènhé shìwù de fāzhǎn jīnglì...",
        "translation": "Sai trật tự trạng ngữ và động từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (任何事物的发展) + Trạng ngữ (都不可避免地要) + Động từ (经历) + Tân ngữ (曲折的过程)。",
    "points": 50,
    "relatedVocab": [
      "不可避免",
      "曲折",
      "经历"
    ]
  },

  {
    "id": "q-hsk5-02-06",
    "exam_id": "hsk5-mock-02",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các từ thành câu thể hiện triết lý thành công:",
    "words": [
      "细节的精雕细琢",
      "决定了",
      "往往",
      "一件作品的成败"
    ],
    "scrambledWords": [
      "细节的精雕细琢",
      "决定了",
      "往往",
      "一件作品的成败"
    ],
    "correct_order": [
      "细节的精雕细琢",
      "往往",
      "决定了",
      "一件作品的成败"
    ],
    "answerKey": [
      "细节的精雕细琢",
      "往往",
      "决定了",
      "一件作品的成败"
    ],
    "correct_sentence": "细节的精雕细琢往往决定了一件作品的成败。",
    "options": [
      {
        "text": "细节的精雕细琢往往决定了一件作品的成败。",
        "pinyin": "Xìjié de jīngdiāoxìzhuó wǎngwǎng juédìng le yí jiàn zuòpǐn de chéngbài.",
        "translation": "Sự trau chuốt tỉ mỉ ở từng chi tiết thường quyết định sự thành bại của một tác phẩm."
      },
      {
        "text": "一件作品的成败往往决定了细节的精雕细琢。",
        "pinyin": "Yí jiàn zuòpǐn de chéngbài wǎngwǎng juédìng le...",
        "translation": "Đảo ngược nguyên nhân kết quả"
      },
      {
        "text": "往往细节的精雕细琢决定了一件作品的成败。",
        "pinyin": "Wǎngwǎng xìjié de...",
        "translation": "Đặt sai vị trí phó từ 往往"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (细节的精雕细琢) + Phó từ trạng ngữ (往往) + Động từ (决定了) + Tân ngữ (一件作品的成败)。",
    "points": 50,
    "relatedVocab": [
      "细节",
      "成败",
      "往往"
    ]
  },

  {
    "id": "q-hsk5-03-01",
    "exam_id": "hsk5-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听艺术访谈，选择中国水墨画的审美意境：",
    "pinyin": "Tīng yìshù fǎngtán, xuǎnzé Zhōngguó shuǐmòhuà de shěnměi yìjìng:",
    "translation": "Nghe phỏng vấn nghệ thuật, chọn ý cảnh thẩm mỹ của tranh thủy mặc Trung Hoa:",
    "audio_url": "",
    "audio_script": "女：中国传统绘画讲究“留白”，这该如何理解？ 男：“留白”并非画家的偷懒，而是给观赏者留出无限遐想的心灵空间，达到“虚实相生、无画处皆成妙境”的哲学境界。",
    "options": [
      {
        "text": "“留白”是给观赏者创造无限想象空间的虚实相生哲学",
        "pinyin": "“Liúbái” shì gěi guānshǎngzhě chuàngzào wúxiàn xiǎngxiàng kōngjiān...",
        "translation": "\"Lưu bạch\" (khoảng trắng) tạo không gian tưởng tượng vô tận, hư thực tương sinh"
      },
      {
        "text": "“留白”是因为画纸面积过大无法画满",
        "pinyin": "“Liúbái” shì yīnwèi huàzhǐ miànjī guò dà...",
        "translation": "Lưu bạch vì giấy quá lớn không vẽ hết"
      },
      {
        "text": "水墨画完全不讲究结构与色彩",
        "pinyin": "Shuǐmòhuà wánquán bù jiǎngjiu...",
        "translation": "Tranh thủy mặc không chú trọng bố cục"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Họa sĩ giải thích nghệ thuật \"留白\" (khoảng trống trắng) giúp gợi mở không gian suy tưởng hư thực tương sinh vô tận. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "水墨",
      "留白",
      "遐想"
    ]
  },

  {
    "id": "q-hsk5-03-02",
    "exam_id": "hsk5-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听茶道讲座，选择品茶的境界：",
    "pinyin": "Tīng chádào jiǎngzuò, xuǎnzé pǐnchá de jìngjiè:",
    "translation": "Nghe bài giảng trà đạo, xác định cảnh giới của việc thưởng trà:",
    "audio_url": "",
    "audio_script": "茶道之妙，在于“静”与“悟”。在一泡一饮之间，洗涤内心的浮躁，体会平淡之中见真味的处世哲学。",
    "options": [
      {
        "text": "以静心感悟生活，洗涤浮躁体会真味",
        "pinyin": "Yǐ jìngxīn gǎnwù shēnghuó, xǐdí fúzào tǐhuì zhēnwèi",
        "translation": "Lấy tâm tĩnh cảm ngộ nhân sinh, gột rửa ồn ào cảm nhận vị chân thực"
      },
      {
        "text": "喝茶只为了快速解渴",
        "pinyin": "Hē chá zhǐ wèile kuàisù jiěkě",
        "translation": "Uống trà chỉ để giải khát nhanh"
      },
      {
        "text": "茶叶越昂贵越能代表茶道",
        "pinyin": "Cháyè yuè ángguì yuè néng dàibiǎo chádào",
        "translation": "Trà càng đắt càng đại diện trà đạo"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Diễn giả đúc kết: \"在于静与悟，洗涤内心的浮躁\" (Nằm ở tĩnh và ngộ, gột rửa sự nông nổi ồn ào). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "浮躁",
      "感悟",
      "平淡"
    ]
  },

  {
    "id": "q-hsk5-03-03",
    "exam_id": "hsk5-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "选词填空：无论外界环境多么嘈杂，他总能______沉浸在书籍的世界里。",
    "pinyin": "Xuǎn cí tiánkòng: Wúlùn wàijiè huánjìng duōme cáozá, tā zǒng néng ______ chénjìn zài shūjí de shìjiè lǐ.",
    "translation": "Chọn từ điền vào chỗ trống: Bất luận môi trường bên ngoài huyên náo đến đâu, anh ấy luôn có thể đắm chìm vào thế giới sách vở.",
    "options": [
      {
        "text": "专注地",
        "pinyin": "zhuānzhù de",
        "translation": "chuyên chú, tập trung cao độ"
      },
      {
        "text": "马虎地",
        "pinyin": "mǎhu de",
        "translation": "qua loa, cẩu thả"
      },
      {
        "text": "偶尔地",
        "pinyin": "ǒu'ěr de",
        "translation": "thỉnh thoảng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Động từ \"沉浸\" (đắm chìm) đi kèm hợp lý nhất với phó từ miêu tả thái độ \"专注地\" (một cách chuyên tâm, tập trung).",
    "points": 50,
    "relatedVocab": [
      "专注",
      "嘈杂",
      "沉浸"
    ]
  },

  {
    "id": "q-hsk5-03-04",
    "exam_id": "hsk5-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "阅读哲学寓言并选择启示：大树能历经百年风暴而不倒，是因为它的根系深深地扎进土地；人的学识与修养也是如此，没有深厚的基础，难以承受未来的风浪。",
    "pinyin": "Dú zhéxué yùyán bìng xuǎnzé qǐshì:",
    "translation": "Đọc ngụ ngôn triết học và chọn bài học rút ra: Cây lớn vượt qua trăm năm bão táp không đổ vì rễ cắm sâu vào đất; học vấn và tu dưỡng của con người cũng vậy, không có nền tảng vững chắc thì khó đứng vững trước sóng gió tương lai.",
    "options": [
      {
        "text": "深厚扎实的基础是成就长远事业与品格的前提",
        "pinyin": "Shēnhòu zhāshi de jīchǔ shì chéngjiù chángyuǎn...",
        "translation": "Nền tảng sâu dày vững chắc là tiền đề cho sự nghiệp và phẩm cách lâu dài"
      },
      {
        "text": "树木比人类更懂得生存的智慧",
        "pinyin": "Shùmù bǐ rénlèi gèng dǒngde...",
        "translation": "Cây cối hiểu trí tuệ sinh tồn hơn con người"
      },
      {
        "text": "学习不需要打好基础",
        "pinyin": "Xuéxí bù xūyào dǎ hǎo jīchǔ",
        "translation": "Học tập không cần nền tảng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Hình ảnh rễ cây cắm sâu tượng trưng cho tầm quan trọng của nền tảng căn bản (深厚扎实的基础). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "根基",
      "承受",
      "修养"
    ]
  },

  {
    "id": "q-hsk5-03-05",
    "exam_id": "hsk5-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp các cụm từ sau thành câu văn biểu cảm:",
    "words": [
      "传统的茶道文化",
      "散发着",
      "历经千年的洗礼",
      "依然",
      "独特的魅力"
    ],
    "scrambledWords": [
      "传统的茶道文化",
      "散发着",
      "历经千年的洗礼",
      "依然",
      "独特的魅力"
    ],
    "correct_order": [
      "传统的茶道文化",
      "历经千年的洗礼",
      "依然",
      "散发着",
      "独特的魅力"
    ],
    "answerKey": [
      "传统的茶道文化",
      "历经千年的洗礼",
      "依然",
      "散发着",
      "独特的魅力"
    ],
    "correct_sentence": "传统的茶道文化历经千年的洗礼依然散发着独特的魅力。",
    "options": [
      {
        "text": "传统的茶道文化历经千年的洗礼依然散发着独特的魅力。",
        "pinyin": "Chuántǒng de chádào wénhuà lìjīng qiānnián de xǐlǐ yīrán sànfā zhe dútè de mèilì.",
        "translation": "Văn hóa trà đạo truyền thống trải qua thử thách ngàn năm vẫn tỏa ra sức hấp dẫn độc đáo."
      },
      {
        "text": "独特的魅力传统的茶道文化散发着依然历经千年的洗礼。",
        "pinyin": "Dútè de mèilì chuántǒng de...",
        "translation": "Lộn xộn giữa chủ ngữ và tân ngữ"
      },
      {
        "text": "历经千年的洗礼散发着传统的茶道文化依然独特的魅力。",
        "pinyin": "Lìjīng qiānnián de xǐlǐ sànfā...",
        "translation": "Trật tự cú pháp sai nghiêm trọng"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (传统的茶道文化) + Ngữ vị ngữ bổ trợ (历经千年的洗礼) + Phó từ (依然) + Động từ (散发着) + Tân ngữ (独特的魅力)。",
    "points": 50,
    "relatedVocab": [
      "洗礼",
      "魅力",
      "散发"
    ]
  },

  {
    "id": "q-hsk5-03-06",
    "exam_id": "hsk5-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết: Sắp xếp câu phức biểu thị điều kiện cần:",
    "words": [
      "唯有",
      "才能够",
      "脚踏实地地努力",
      "实现",
      "心中的宏伟抱负"
    ],
    "scrambledWords": [
      "唯有",
      "才能够",
      "脚踏实地地努力",
      "实现",
      "心中的宏伟抱负"
    ],
    "correct_order": [
      "唯有",
      "脚踏实地地努力",
      "才能够",
      "实现",
      "心中的宏伟抱负"
    ],
    "answerKey": [
      "唯有",
      "脚踏实地地努力",
      "才能够",
      "实现",
      "心中的宏伟抱负"
    ],
    "correct_sentence": "唯有脚踏实地地努力才能够实现心中的宏伟抱负。",
    "options": [
      {
        "text": "唯有脚踏实地地努力才能够实现心中的宏伟抱负。",
        "pinyin": "Wéiyǒu jiǎotàshídì de nǔlì cái nénggòu shíxiàn xīnzhōng de hóngwěi bàofù.",
        "translation": "Chỉ có nỗ lực bước từng bước vững chắc thì mới có thể thực hiện được hoài bão lớn lao trong tim."
      },
      {
        "text": "才能够实现唯有脚踏实地地努力心中的宏伟抱负。",
        "pinyin": "Cái nénggòu shíxiàn wéiyǒu...",
        "translation": "Đảo sai liên từ 唯有...才..."
      },
      {
        "text": "心中的宏伟抱负才能够唯有实现脚踏实地地努力。",
        "pinyin": "Xīnzhōng de hóngwěi bàofù cái nénggòu...",
        "translation": "Sai hoàn toàn trật tự logic câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cặp liên từ độc tôn biểu thị điều kiện duy nhất: \"唯有 (A) ... 才能/才能够 (B) ...\": 唯有脚踏实地地努力才能够实现心中的宏伟抱负。",
    "points": 50,
    "relatedVocab": [
      "抱负",
      "唯有",
      "脚踏实地"
    ]
  },

  {
    "id": "q-hsk6-02-01",
    "exam_id": "hsk6-mock-02",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听高层经济论坛，分析全球供应链重构趋势：",
    "pinyin": "Tīng gāocéng jīngjì lùntán, fēnxī quánqiú gōngyìngliàn chónggòu qūshì:",
    "translation": "Nghe diễn đàn kinh tế cấp cao, phân tích xu thế tái cấu trúc chuỗi cung ứng toàn cầu:",
    "audio_url": "",
    "audio_script": "专家指出，新一轮全球产业链分工正在从单一的“成本优先”转向“安全韧性与本土化”并重。跨国企业不仅要追求边际效益最大化，更须筑牢抵御不可抗力冲击的弹性屏障。",
    "options": [
      {
        "text": "供应链策略由单一低成本转向兼顾安全韧性与弹性缓冲",
        "pinyin": "Gōngyìngliàn cèlüè yóu dānyī dī chéngběn...",
        "translation": "Chiến lược chuyển từ đơn thuần chi phí thấp sang coi trọng độ an toàn dẻo dai và bộ đệm đàn hồi"
      },
      {
        "text": "全球贸易已完全杜绝任何跨国分工合作",
        "pinyin": "Quánqiú màoyì yǐ wánquán dùjué...",
        "translation": "Thương mại toàn cầu chấm dứt hoàn toàn hợp tác"
      },
      {
        "text": "企业应当放弃所有风险防范以节约支出",
        "pinyin": "Qǐyè yīngdāng fàngqì suǒyǒu...",
        "translation": "Doanh nghiệp nên từ bỏ mọi phòng ngừa rủi ro"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chuyên gia chỉ rõ xu hướng chuyển đổi từ \"成本优先\" (ưu tiên chi phí) sang \"安全韧性\" (an toàn và dẻo dai chống chịu rủi ro). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "供应链",
      "韧性",
      "抗力"
    ]
  },

  {
    "id": "q-hsk6-02-02",
    "exam_id": "hsk6-mock-02",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听学术报告，理解人工智能与人类思维的关系：",
    "pinyin": "Tīng xuéshù bàogào, lǐjiě réngōng zhìnéng yǔ rénlèi sīwéi de guānxì:",
    "translation": "Nghe báo cáo học thuật, nhận thức mối quan hệ giữa AI và tư duy con người:",
    "audio_url": "",
    "audio_script": "大模型在模式识别与符号运算上展现出远超人类的高效，然而人类特有的同理心、哲学顿悟与批判性直觉，依然是机器算法难以逾越的认知鸿沟。",
    "options": [
      {
        "text": "AI长于计算与模式匹配，而人类独具同理心与批判直觉",
        "pinyin": "AI cháng yú jìsuàn..., ér rénlèi dújù tónglǐxīn...",
        "translation": "AI mạnh về tính toán và nhận diện mẫu, trong khi con người có lòng trắc ẩn và trực giác phản biện độc nhất"
      },
      {
        "text": "机器算法在所有维度已全面超越并取代人类意识",
        "pinyin": "Jīqì suànfǎ zài suǒyǒu wéidù...",
        "translation": "Thuật toán máy tính đã thay thế hoàn toàn ý thức con người"
      },
      {
        "text": "人类不需要学习任何批判性思维",
        "pinyin": "Rénlèi bù xūyào xuéxí...",
        "translation": "Con người không cần tư duy phản biện"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Báo cáo phân định ranh giới: AI vượt trội ở tốc độ tính toán, nhưng con người giữ vị thế độc tôn ở sự đồng cảm (同理心) và trực giác phản biện (批判性直觉). Chọn A.",
    "points": 50,
    "relatedVocab": [
      "同理心",
      "运算",
      "逾越"
    ]
  },

  {
    "id": "q-hsk6-02-03",
    "exam_id": "hsk6-mock-02",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "阅读病句辨析题：选择下列句子中【没有语病】的一项：",
    "pinyin": "Bìngjù biànxī: Xuǎnzé xiàliè jùzi zhōng méiyǒu yǔbìng de yí xiàng:",
    "translation": "Phân tích lỗi cú pháp HSK 6: Chọn câu KHÔNG CÓ LỖI NGỮ PHÁP trong các câu sau:",
    "options": [
      {
        "text": "通过这次深入调研，专家组掌握了大量真实可靠的第一手科学数据。",
        "pinyin": "Tōngguò zhè cì shēnrù diàoyán, zhuānjiāzǔ zhǎngwò le dàliàng zhēnshí kěkào de dì-yī-shǒu kēxué shùjù.",
        "translation": "Thông qua đợt khảo sát sâu sắc này, tổ chuyên gia đã nắm bắt được lượng lớn số liệu khoa học gốc xác thực và đáng tin cậy."
      },
      {
        "text": "经过大家的共同努力，使我们圆满完成了这一艰巨的历史任务。",
        "pinyin": "Jīngguò dàjiā de gòngtóng nǔlì, shǐ wǒmen...",
        "translation": "Thiếu chủ ngữ do dùng đồng thời 经过 và 使"
      },
      {
        "text": "能否保持乐观的心态，是决定高考取得优异成绩的关键因素。",
        "pinyin": "Néng fǒu bǎochí... shì juédìng...",
        "translation": "Lỗi đối ứng một mặt - hai mặt (能否 vs 优异)"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu B mắc lỗi thiếu chủ ngữ (lạm dụng cặp 经过...使...). Câu C mắc lỗi bất đối xứng logic (能否 là 2 mặt, 优异成绩 là 1 mặt). Câu A chuẩn xác về cấu trúc ngữ pháp.",
    "points": 50,
    "relatedVocab": [
      "调研",
      "语病",
      "可靠"
    ]
  },

  {
    "id": "q-hsk6-02-04",
    "exam_id": "hsk6-mock-02",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "选词填空：面对突如其来的危机，指挥部沉着应对，迅速出台了一系列______有效的防范举措，遏制了事态恶化。",
    "pinyin": "Xuǎn cí tiánkòng: Miànduì tūrúqílái de wēijī, zhǐhuībù chénzhuó yìngduì, xùnsù chūtái le yíxìliè ______ yǒuxiào de fángfàn jǔcuò, èzhì le shìtài èhuà.",
    "translation": "Chọn từ điền vào chỗ trống: Đối mặt với khủng hoảng bất ngờ ập đến, ban chỉ huy bình tĩnh ứng phó, nhanh chóng ban hành hàng loạt biện pháp phòng ngừa thiết thực hiệu quả, ngăn chặn sự tình chuyển biến xấu.",
    "options": [
      {
        "text": "切实",
        "pinyin": "qièshí",
        "translation": "thiết thực, sát sao thực tế"
      },
      {
        "text": "勉强",
        "pinyin": "miǎnqiǎng",
        "translation": "gượng gạo, khiên cưỡng"
      },
      {
        "text": "敷衍",
        "pinyin": "fūyan",
        "translation": "qua loa lấy lệ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cụm từ phối hợp kinh điển phong cách văn bản hành chính HSK 6: \"切实有效\" (thiết thực và hiệu quả). Các từ 勉强 hay 敷衍 mang nghĩa tiêu cực không hợp ngữ cảnh.",
    "points": 50,
    "relatedVocab": [
      "切实",
      "遏制",
      "举措"
    ]
  },

  {
    "id": "q-hsk6-02-05",
    "exam_id": "hsk6-mock-02",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ học thuật thành câu lý luận hoàn chỉnh:",
    "words": [
      "文化软实力的持续提升",
      "凝聚了",
      "更向世界展现了",
      "全体人民的共同价值追求",
      "大国风范"
    ],
    "scrambledWords": [
      "文化软实力的持续提升",
      "凝聚了",
      "更向世界展现了",
      "全体人民的共同价值追求",
      "大国风范"
    ],
    "correct_order": [
      "文化软实力的持续提升",
      "凝聚了",
      "全体人民的共同价值追求",
      "更向世界展现了",
      "大国风范"
    ],
    "answerKey": [
      "文化软实力的持续提升",
      "凝聚了",
      "全体人民的共同价值追求",
      "更向世界展现了",
      "大国风范"
    ],
    "correct_sentence": "文化软实力的持续提升凝聚了全体人民的共同价值追求，更向世界展现了大国风范。",
    "options": [
      {
        "text": "文化软实力的持续提升凝聚了全体人民的共同价值追求，更向世界展现了大国风范。",
        "pinyin": "Wénhuà ruǎnshílì de chíxù tíshēng níngjù le...",
        "translation": "Việc nâng cao sức mạnh mềm văn hóa đã ngưng tụ giá trị mưu cầu chung của toàn dân, đồng thời thể hiện phong thái của một nước lớn ra thế giới."
      },
      {
        "text": "大国风范凝聚了文化软实力的持续提升全体人民的共同价值追求更向世界展现了。",
        "pinyin": "Dàguó fēngfàn níngjù le...",
        "translation": "Lỗi xáo trộn cấu trúc câu"
      },
      {
        "text": "更向世界展现了大国风范凝聚了文化软实力的持续提升。",
        "pinyin": "Gèng xiàng shìjiè...",
        "translation": "Đảo ngược vị trí mệnh đề liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu tăng tiến HSK 6: Chủ ngữ (文化软实力的持续提升) + Động từ 1 + Tân ngữ 1 (凝聚了全体人民的共同价值追求) + Liên từ tăng tiến + Động từ 2 + Tân ngữ 2 (更向世界展现了大国风范)。",
    "points": 50,
    "relatedVocab": [
      "软实力",
      "凝聚",
      "风范"
    ]
  },

  {
    "id": "q-hsk6-02-06",
    "exam_id": "hsk6-mock-02",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ sau thành câu phân tích tư duy khoa học:",
    "words": [
      "真理的探索过程",
      "往往伴随着",
      "对固有认知体系的",
      "勇敢质疑与深刻重构"
    ],
    "scrambledWords": [
      "真理的探索过程",
      "往往伴随着",
      "对固有认知体系的",
      "勇敢质疑与深刻重构"
    ],
    "correct_order": [
      "真理的探索过程",
      "往往伴随着",
      "对固有认知体系的",
      "勇敢质疑与深刻重构"
    ],
    "answerKey": [
      "真理的探索过程",
      "往往伴随着",
      "对固有认知体系的",
      "勇敢质疑与深刻重构"
    ],
    "correct_sentence": "真理的探索过程往往伴随着对固有认知体系的勇敢质疑与深刻重构。",
    "options": [
      {
        "text": "真理的探索过程往往伴随着对固有认知体系的勇敢质疑与深刻重构。",
        "pinyin": "Zhēnlǐ de tànsuǒ guòchéng wǎngwǎng bànsuí zhe duì gùyǒu rènzhī tǐxì de yǒnggǎn zhìyí yǔ shēnkè chónggòu.",
        "translation": "Quá trình khám phá chân lý thường đi đôi với sự dũng cảm hoài nghi và tái cấu trúc sâu sắc hệ thống nhận thức vốn có."
      },
      {
        "text": "对固有认知体系的勇敢质疑与深刻重构往往伴随着真理的探索过程。",
        "pinyin": "Duì gùyǒu rènzhī tǐxì...",
        "translation": "Đảo lộn chiều hướng chủ khách quan"
      },
      {
        "text": "往往伴随着真理的探索过程对固有认知体系的勇敢质疑。",
        "pinyin": "Wǎngwǎng bànsuí zhe...",
        "translation": "Sai trật tự trạng ngữ đầu câu"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chủ ngữ (真理的探索过程) + Động từ vị ngữ kèm trạng từ (往往伴随着) + Định ngữ giới từ (对固有认知体系的) + Cụm danh từ trung tâm (勇敢质疑与深刻重构)。",
    "points": 50,
    "relatedVocab": [
      "真理",
      "质疑",
      "重构"
    ]
  },

  {
    "id": "q-hsk6-03-01",
    "exam_id": "hsk6-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 1,
    "question_type": "listening_mcq",
    "prompt": "听天文学前沿讲座，理解深空探测的意义：",
    "pinyin": "Tīng tiānwénxué qiányán jiǎngzuò, lǐjiě shēnkōng tàncè de yìyì:",
    "translation": "Nghe bài giảng thiên văn học tiền phong, thấu hiểu ý nghĩa của việc thám hiểm không gian sâu:",
    "audio_url": "",
    "audio_script": "探测百亿光年外的宇宙深空，绝非单纯满足好奇心，而是为了追溯物质创生与时空演化的终极密码，反观人类在宏大宇宙中的坐标与归宿。",
    "options": [
      {
        "text": "追溯时空演化终极密码并认知人类自身存在坐标",
        "pinyin": "Zhuīsù shíkōng yǎnhuà zhōngjí mìmǎ...",
        "translation": "Truy tìm mật mã tiến hóa thời không và định vị tọa độ tồn tại của chính loài người"
      },
      {
        "text": "仅仅为了寻找可开采的稀有黄金矿产",
        "pinyin": "Jǐnjǐn wèile xúnzhǎo kě kāicǎi...",
        "translation": "Chỉ nhằm tìm khoáng sản vàng để khai thác"
      },
      {
        "text": "证明外星生命已完全掌控银河系",
        "pinyin": "Zhèngmíng wàixīng shēngmìng...",
        "translation": "Chứng minh người ngoài hành tinh đã kiểm soát dải ngân hà"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Diễn giả khẳng định thám hiểm vũ trụ sâu mang ý nghĩa triết học và khoa học: truy tìm nguồn gốc vũ trụ và định vị sự tồn tại của con người. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "探测",
      "演化",
      "密码"
    ]
  },

  {
    "id": "q-hsk6-03-02",
    "exam_id": "hsk6-mock-03",
    "part_type": "listening",
    "section": "listening",
    "part_number": 1,
    "question_number": 2,
    "question_type": "listening_mcq",
    "prompt": "听法学评论，理解数字时代隐私权的保护：",
    "pinyin": "Tīng fǎxué pínglùn, lǐjiě shùzì shídài yǐnsīquán de bǎohù:",
    "translation": "Nghe bình luận pháp học, hiểu về quyền bảo vệ sự riêng tư thời đại số:",
    "audio_url": "",
    "audio_script": "算法推荐与大数据画像极大地便捷了生活，但若缺乏对个人数据采集的知情同意与权属界定，公民的数字人格权就可能沦为商业资本无休止掠夺的猎物。",
    "options": [
      {
        "text": "必须明确知情同意与数据权属界定以捍卫数字人格",
        "pinyin": "Bìxū míngquè zhīqíng tóngyì...",
        "translation": "Cần xác lập rõ ràng sự đồng thuận thông suốt và chủ quyền dữ liệu để bảo vệ nhân cách số"
      },
      {
        "text": "彻底取缔互联网与任何算法推荐技术",
        "pinyin": "Chèdǐ qǔdì hùliánwǎng...",
        "translation": "Cấm triệt để internet và thuật toán gợi ý"
      },
      {
        "text": "商业平台拥有无偿占用一切个人隐私的特权",
        "pinyin": "Shāngyè píngtái yǒngyǒu...",
        "translation": "Nền tảng thương mại có quyền chiếm đoạt mọi thông tin cá nhân"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Chuyên gia pháp luật nhấn mạnh việc xác lập cơ chế \"知情同意\" (đồng thuận hiểu biết) và \"权属界定\" (ranh giới quyền sở hữu dữ liệu) để bảo vệ công dân. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "隐私",
      "知情",
      "权属"
    ]
  },

  {
    "id": "q-hsk6-03-03",
    "exam_id": "hsk6-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 3,
    "question_type": "reading_mcq",
    "prompt": "阅读学术文段，推断画线成语的最贴切解释：学术研究最忌讳【浮光掠影】与急功近利，唯有坐得住冷板凳，方能厚积薄发。",
    "pinyin": "Dú xuéshù wénduàn, tuīduàn huàxiàn chéngyǔ: Fúguāng-lüèyǐng",
    "translation": "Đọc văn đoạn học thuật, giải nghĩa thành ngữ gạch chân \"Phù quang lược ảnh\" (浮光掠影):",
    "options": [
      {
        "text": "观察不深入，观察事物如水面浮光浮光掠过般表面化",
        "pinyin": "Guānchá bù shēnrù, guānchá shìwù...",
        "translation": "Quan sát hời hợt, không đi sâu vào thực chất giống như ánh sáng lướt trên mặt nước"
      },
      {
        "text": "形容光芒耀眼夺目让人无法直视",
        "pinyin": "Xíngróng guāngmáng yàoyǎn...",
        "translation": "Miêu tả ánh sáng lóa mắt"
      },
      {
        "text": "形容行动极其敏捷迅速",
        "pinyin": "Xíngróng xíngdòng jíqí mǐnjié...",
        "translation": "Miêu tả hành động cực kỳ mau lẹ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Thành ngữ \"浮光掠影\" (phù quang lược ảnh) mang ý nghĩa chê bai sự hời hợt, xem hoa thoảng qua, không chịu đào sâu suy nghĩ. Chọn A.",
    "points": 50,
    "relatedVocab": [
      "浮光掠影",
      "忌讳",
      "急功近利"
    ]
  },

  {
    "id": "q-hsk6-03-04",
    "exam_id": "hsk6-mock-03",
    "part_type": "reading",
    "section": "reading",
    "part_number": 2,
    "question_number": 4,
    "question_type": "reading_mcq",
    "prompt": "病句辨析：下列句子中【存在明显语病】的一项是：",
    "pinyin": "Bìngjù biànxī: Xiàliè jùzi zhōng cúnzài míngxiǎn yǔbìng de yí xiàng shì:",
    "translation": "Phân tích lỗi câu: Chọn câu CÓ LỖI NGỮ PHÁP RÕ RỆT trong các câu sau:",
    "options": [
      {
        "text": "这部反映历史沧桑的记录片，自从公映以来，受到了广大观众的一致好评。",
        "pinyin": "Zhè bù fǎnyìng lìshǐ cāngsāng de jìlùpiàn, zìcóng gōngyìng yǐlái, shòudào le...",
        "translation": "Câu bị lỗi kết cấu đầu câu (chủ ngữ bị tách rời bởi giới từ 自从)"
      },
      {
        "text": "科学技术的日新月异，深刻改变了人类的生活方式与交往习惯。",
        "pinyin": "Kēxué jìshù de rìxīnyuèyì, shēnkè gǎibiàn le...",
        "translation": "Câu đúng chuẩn"
      },
      {
        "text": "在全球气候治理进程中，各国应当恪守共同但有区别的责任原则。",
        "pinyin": "Zài quánqiú qìhòu zhìlǐ jìnchéng zhōng, gèguó yīngdāng kèshǒu...",
        "translation": "Câu đúng chuẩn"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Câu A mắc lỗi ngữ pháp kinh điển HSK 6: \"这部记录片，自从公映以来...\" biến chủ ngữ đầu câu thành lửng lơ vô vị ngữ trước mệnh đề giới từ. Phải sửa thành: \"自从这部反映历史沧桑的记录片公映以来...\"。Chọn A.",
    "points": 50,
    "relatedVocab": [
      "沧桑",
      "语病",
      "恪守"
    ]
  },

  {
    "id": "q-hsk6-03-05",
    "exam_id": "hsk6-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 5,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ thành luận điểm triết học sâu sắc:",
    "words": [
      "文明的交流互鉴",
      "而是推动人类社会",
      "绝非简单的形式模仿",
      "向前迈进的根本动力"
    ],
    "scrambledWords": [
      "文明的交流互鉴",
      "而是推动人类社会",
      "绝非简单的形式模仿",
      "向前迈进的根本动力"
    ],
    "correct_order": [
      "文明的交流互鉴",
      "绝非简单的形式模仿",
      "而是推动人类社会",
      "向前迈进的根本动力"
    ],
    "answerKey": [
      "文明的交流互鉴",
      "绝非简单的形式模仿",
      "而是推动人类社会",
      "向前迈进的根本动力"
    ],
    "correct_sentence": "文明的交流互鉴绝非简单的形式模仿，而是推动人类社会向前迈进的根本动力。",
    "options": [
      {
        "text": "文明的交流互鉴绝非简单的形式模仿，而是推动人类社会向前迈进的根本动力。",
        "pinyin": "Wénmíng de jiāoliú hùjiàn juéfēi jiǎndān de xíngshì mófǎng, érshì tuīdòng rénlèi shèhuì xiàngqián màijìn de gēnběn dònglì.",
        "translation": "Sự giao lưu học hỏi lẫn nhau giữa các nền văn minh tuyệt nhiên không phải sự bắt chước hình thức đơn giản, mà là động lực căn bản thúc đẩy xã hội loài người tiến lên phía trước."
      },
      {
        "text": "绝非简单的形式模仿文明的交流互鉴而是推动人类社会向前迈进的根本动力。",
        "pinyin": "Juéfēi jiǎndān de...",
        "translation": "Đặt sai vị trí chủ ngữ chính"
      },
      {
        "text": "向前迈进的根本动力而是文明的交流互鉴绝非简单的形式模仿。",
        "pinyin": "Xiàngqián màijìn de...",
        "translation": "Sai trật tự liên từ và cấu trúc"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu phức phủ định - khẳng định cao cấp: \"绝非 (Không phải) ... 而是 (Mà là) ...\": 文明的交流互鉴绝非简单的形式模仿，而是推动人类社会向前迈进的根本动力。",
    "points": 50,
    "relatedVocab": [
      "互鉴",
      "绝非",
      "迈进"
    ]
  },

  {
    "id": "q-hsk6-03-06",
    "exam_id": "hsk6-mock-03",
    "part_type": "writing",
    "section": "writing",
    "part_number": 3,
    "question_number": 6,
    "question_type": "writing_reorder",
    "prompt": "书写第一部分：排列词语成句：",
    "pinyin": "Shūxiě: Páiliè cíyǔ chéng jù:",
    "translation": "Phần Viết HSK 6: Sắp xếp các cụm từ sau thành nhận định học thuật về bảo tồn di sản:",
    "words": [
      "非物质文化遗产的保护",
      "在现代化转型中",
      "更在于",
      "不仅在于静态典藏",
      "实现创造性转化"
    ],
    "scrambledWords": [
      "非物质文化遗产的保护",
      "在现代化转型中",
      "更在于",
      "不仅在于静态典藏",
      "实现创造性转化"
    ],
    "correct_order": [
      "非物质文化遗产的保护",
      "不仅在于静态典藏",
      "更在于",
      "在现代化转型中",
      "实现创造性转化"
    ],
    "answerKey": [
      "非物质文化遗产的保护",
      "不仅在于静态典藏",
      "更在于",
      "在现代化转型中",
      "实现创造性转化"
    ],
    "correct_sentence": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
    "options": [
      {
        "text": "非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
        "pinyin": "Fēiwùzhì wénhuà yíchǎn de bǎohù bùjǐn zàiyú jìngtài diǎncáng, gèng zàiyú zài xiàndàihuà zhuǎnxíng zhōng shíxiàn chuàngzàoxìng zhuǎnhuà.",
        "translation": "Việc bảo tồn di sản văn hóa phi vật thể không chỉ dừng ở việc lưu trữ tĩnh, mà quan trọng hơn là thực hiện chuyển hóa sáng tạo trong quá trình chuyển mình hiện đại hóa."
      },
      {
        "text": "在现代化转型中不仅在于静态典藏非物质文化遗产的保护更在于实现创造性转化。",
        "pinyin": "Zài xiàndàihuà zhuǎnxíng zhōng...",
        "translation": "Trật tự các vế câu lộn xộn"
      },
      {
        "text": "更在于实现创造性转化非物质文化遗产的保护不仅在于静态典藏。",
        "pinyin": "Gèng zàiyú...",
        "translation": "Đảo ngược thứ tự liên từ"
      }
    ],
    "correct_option_index": 0,
    "explanation": "Cấu trúc câu tăng tiến: \"不仅在于 (Không chỉ ở) ... 更在于 (Càng ở chỗ) ...\": 非物质文化遗产的保护不仅在于静态典藏，更在于在现代化转型中实现创造性转化。",
    "points": 50,
    "relatedVocab": [
      "非遗",
      "典藏",
      "转化"
    ]
  }
];
