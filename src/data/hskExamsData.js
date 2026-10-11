/**
 * =========================================================================
 * HSK EXAMS & QUESTIONS DATASET — HANZIGO FREE PRACTICE PLATFORM
 * =========================================================================
 * Bộ dữ liệu đề thi thử, câu hỏi luyện tập và thông tin thẩm định bản quyền.
 * Tuân thủ nghiêm ngặt nguyên tắc minh bạch:
 * - Đề do HanziGo biên soạn được dán nhãn 'mock' (Đề thi thử HanziGo)
 * - Đề tham chiếu từ CTI/Hanban được dán nhãn 'official_sample' (Đề mẫu đối chiếu)
 * =========================================================================
 */

export const HSK_EXAMS = [
  {
    id: 'hsk1-mock-01',
    title: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 1 (Tổng Hợp Nghe & Đọc)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'mock', // Đề thi thử HanziGo
    skill_category: 'mixed',
    duration_minutes: 40,
    total_questions: 20,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử toàn diện cấu trúc chuẩn HSK 1: 10 câu Nghe hiểu (kèm phát âm âm thanh) và 10 câu Đọc hiểu (từ vựng, ghép câu, đối chiếu tranh ảnh). Thời gian làm bài 40 phút, điểm đạt 120/200.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk1-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0 (Creative Commons Ghi công - Phi thương mại)',
    permission_status: 'original_content',
    verified_date: '2026-10-12',
    is_published: true
  },
  {
    id: 'hsk1-reading-02',
    title: 'Đề Luyện Chuyên Sâu Đọc Hiểu & Từ Vựng HSK 1',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'reading',
    duration_minutes: 25,
    total_questions: 15,
    passing_score: 60,
    max_score: 100,
    description: 'Tập trung rèn luyện kỹ năng đọc hiểu nhanh 150 từ vựng cốt lõi HSK 1: xác thực đúng/sai, chọn từ điền vào chỗ trống và nối câu hỏi - đáp.',
    source_url: 'https://hanzigo.com/hsk/practice/hsk1-reading',
    source_author: 'Ban Học Thuật HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-12',
    is_published: true
  },
  {
    id: 'hsk2-mock-01',
    title: 'Đề Thi Thử HSK 2 Toàn Diện Số 1 (Giao Tiếp Sinh Hoạt)',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 55,
    total_questions: 25,
    passing_score: 120,
    max_score: 200,
    description: 'Cấu trúc đề HSK 2 chuẩn: 12 câu Nghe hiểu hội thoại 2 lượt và 13 câu Đọc hiểu phân loại ngữ pháp, trạng từ chỉ thời gian và liên từ.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk2-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-12',
    is_published: true
  },
  {
    id: 'hsk2-listening-02',
    title: 'Đề Luyện Nghe Hiểu Phản Xạ Nhanh HSK 2',
    level: 'HSK 2',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'listening',
    duration_minutes: 30,
    total_questions: 15,
    passing_score: 60,
    max_score: 100,
    description: 'Luyện phản xạ nghe hiểu hội thoại mua sắm, hỏi đường, đặt xe và sinh hoạt thường nhật. Có audio và lời thoại đối chiếu sau khi nộp bài.',
    source_url: 'https://hanzigo.com/hsk/practice/hsk2-listening',
    source_author: 'Ban Học Thuật HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-12',
    is_published: true
  },
  {
    id: 'hsk3-mock-01',
    title: 'Đề Thi Thử HSK 3 Chuẩn Số 1 (Nghe - Đọc - Ngữ Pháp Cốt Lõi)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 85,
    total_questions: 30,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 3 toàn diện 3 kỹ năng: Nghe hiểu đoạn văn ngắn, Đọc hiểu chọn đoạn tương ứng và kiểm tra câu chữ 把, chữ 被, câu so sánh 比.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk3-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-12',
    is_published: true
  },
  {
    id: 'hsk1-official-ref-01',
    title: 'Đề Minh Họa HSK 1 CLEC/CTI Chính Thức (Mã đề H10901 - Tham Chiếu)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'official_sample', // Đề mẫu chính thức đối chiếu
    skill_category: 'mixed',
    duration_minutes: 40,
    total_questions: 20,
    passing_score: 120,
    max_score: 200,
    description: 'Bộ câu hỏi tham chiếu học thuật trích từ đề minh họa công khai của Trung tâm Khảo thí Quốc tế HSK (CTI / chinesetest.cn). Dùng cho mục đích đối chiếu cấu trúc.',
    source_url: 'http://www.chinesetest.cn/godownload.do',
    source_author: 'Chinese Testing International (CTI / Hanban)',
    license: 'Public Educational Sample Reference (Chỉ tham chiếu học thuật công khai)',
    permission_status: 'reproducible',
    verified_date: '2026-10-12',
    is_published: true
  }
];

export const HSK_QUESTIONS = [
  // ==========================================
  // EXAM 1: hsk1-mock-01 (20 câu: 10 nghe + 10 đọc)
  // ==========================================
  // PHẦN NGHE (Listening - 10 câu)
  {
    id: 'q-hsk1-01-01',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    prompt: '听录音，判断与听到的内容是否一致：[很高兴认识你。]',
    pinyin: 'Tīng lùyīn, pànduàn yǔ tīng dào de nèiróng shìfǒu yízhì: [Hěn gāoxìng rènshí nǐ.]',
    translation: 'Nghe đoạn ghi âm, phán đoán đúng sai với nội dung: "Rất vui được quen biết bạn."',
    audio_url: '',
    audio_script: '你好！很高兴认识你。',
    options: [
      { text: '✓ Đúng (一致)', pinyin: 'Yízhì', translation: 'Nội dung khớp hoàn toàn' },
      { text: '✗ Sai (不一致)', pinyin: 'Bù yízhì', translation: 'Nội dung không khớp' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại phát thanh: "你好！很高兴认识你。" (Xin chào! Rất vui được quen biết bạn). Khớp chính xác với nội dung đề bài.',
    points: 10
  },
  {
    id: 'q-hsk1-01-02',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 2,
    prompt: '听录音，选出正确的图片/动作：',
    pinyin: 'Tīng lùyīn, xuǎn chū zhèngquè de túpiàn/dòngzuò:',
    translation: 'Nghe đoạn ghi âm, chọn hành động tương ứng:',
    audio_url: '',
    audio_script: '他在喝茶。',
    options: [
      { text: 'Uống trà (喝茶)', pinyin: 'Hē chá', translation: 'Anh ấy đang uống trà' },
      { text: 'Ăn cơm (吃饭)', pinyin: 'Chī fàn', translation: 'Anh ấy đang ăn cơm' },
      { text: 'Xem sách (看书)', pinyin: 'Kàn shū', translation: 'Anh ấy đang đọc sách' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại phát thanh: "他在喝茶。" (Tā zài hē chá - Anh ấy đang uống trà). Đáp án chính xác là phương án A.',
    points: 10
  },
  {
    id: 'q-hsk1-01-03',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 3,
    prompt: '听对话，选择正确答案：',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn:',
    translation: 'Nghe đoạn hội thoại, chọn đáp án đúng:',
    audio_url: '',
    audio_script: '女：请问，苹果多少钱一斤？男：三块钱一斤。问：苹果多少钱一斤？',
    options: [
      { text: '2块 (Liǎng kuài)', pinyin: 'Liǎng kuài', translation: '2 tệ' },
      { text: '3块 (Sān kuài)', pinyin: 'Sān kuài', translation: '3 tệ' },
      { text: '5块 (Wǔ kuài)', pinyin: 'Wǔ kuài', translation: '5 tệ' }
    ],
    correct_option_index: 1,
    explanation: 'Người nam trả lời: "三块钱一斤" (Sān kuài qián yì jīn - 3 tệ một cân). Do đó quả táo có giá 3 tệ.',
    points: 10
  },
  {
    id: 'q-hsk1-01-04',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 4,
    prompt: '听对话，选择正确答案：',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn:',
    translation: 'Nghe đoạn hội thoại, chọn đáp án đúng:',
    audio_url: '',
    audio_script: '男：今天星期几？女：今天星期三。问：今天星期几？',
    options: [
      { text: '星期二 (Thứ Ba)', pinyin: 'Xīngqī\'èr', translation: 'Thứ Ba' },
      { text: '星期三 (Thứ Tư)', pinyin: 'Xīngqīsān', translation: 'Thứ Tư' },
      { text: '星期四 (Thứ Năm)', pinyin: 'Xīngqīsì', translation: 'Thứ Năm' }
    ],
    correct_option_index: 1,
    explanation: 'Người nữ trả lời: "今天星期三" (Hôm nay là thứ Tư). Chú ý: 星期三 trong tiếng Trung tương ứng với Thứ Tư trong tiếng Việt.',
    points: 10
  },
  {
    id: 'q-hsk1-01-05',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 5,
    prompt: '听对话，选择人物所在地：',
    pinyin: 'Tīng duìhuà, xuǎnzé rénwù suǒzàidì:',
    translation: 'Nghe đối thoại, chọn nơi chốn nhân vật đang ở:',
    audio_url: '',
    audio_script: '女：小王在哪里？男：他在学校看书呢。问：小王在哪里？',
    options: [
      { text: '学校 (Trường học)', pinyin: 'Xuéxiào', translation: 'Ở trường học' },
      { text: '医院 (Bệnh viện)', pinyin: 'Yīyuàn', translation: 'Ở bệnh viện' },
      { text: '商店 (Cửa hàng)', pinyin: 'Shāngdiàn', translation: 'Ở cửa hàng' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói rõ: "他在学校看书呢" (Anh ấy đang ở trường học đọc sách). Địa điểm là 学校 (trường học).',
    points: 10
  },
  {
    id: 'q-hsk1-01-06',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 6,
    prompt: '听句子，判断与内容是否一致：[桌子上有三本书。]',
    pinyin: 'Tīng jùzi, pànduàn yǔ nèiróng shìfǒu yízhì: [Zhuōzi shang yǒu sān běn shū.]',
    translation: 'Nghe câu thoại, phán đoán đúng/sai: "Trên bàn có 3 cuốn sách."',
    audio_url: '',
    audio_script: '桌子上有一本书和一个杯子。',
    options: [
      { text: '✓ Đúng (一致)', pinyin: 'Yízhì', translation: 'Đúng' },
      { text: '✗ Sai (不一致)', pinyin: 'Bù yízhì', translation: 'Sai' }
    ],
    correct_option_index: 1,
    explanation: 'Lời thoại phát: "桌子上有一本书和一个杯子" (Trên bàn có 1 cuốn sách và 1 chiếc cốc), khác với nhận định "có 3 cuốn sách". Do đó chọn Sai.',
    points: 10
  },
  {
    id: 'q-hsk1-01-07',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 7,
    prompt: '听对话，选择人物关系：',
    pinyin: 'Tīng duìhuà, xuǎnzé rénwù guānxì:',
    translation: 'Nghe đối thoại, chọn mối quan hệ giữa hai người:',
    audio_url: '',
    audio_script: '男：李老师，明天见！女：明天见，路上小心。',
    options: [
      { text: '医生与病人 (Bác sĩ & bệnh nhân)', pinyin: 'Yīshēng yǔ bìngrén', translation: 'Y tế' },
      { text: '老师与学生 (Thầy cô & học sinh)', pinyin: 'Lǎoshī yǔ xuésheng', translation: 'Trường học' },
      { text: '父子 (Bố con)', pinyin: 'Fù zǐ', translation: 'Gia đình' }
    ],
    correct_option_index: 1,
    explanation: 'Người nam gọi "李老师" (Cô giáo Lý) và chào tạm biệt. Đây là quan hệ thầy trò (老师与学生).',
    points: 10
  },
  {
    id: 'q-hsk1-01-08',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 8,
    prompt: '听录音，选出说话人提到的时间：',
    pinyin: 'Tīng lùyīn, xuǎn chū shuōhuàrén tí dào de shíjiān:',
    translation: 'Nghe đoạn ghi âm, chọn thời gian được nhắc tới:',
    audio_url: '',
    audio_script: '现在是下午两点半。',
    options: [
      { text: '12:30 (Shí\'èr diǎn bàn)', pinyin: 'Shí\'èr diǎn bàn', translation: '12 giờ rưỡi' },
      { text: '14:30 (Liǎng diǎn bàn)', pinyin: 'Liǎng diǎn bàn', translation: '2 giờ rưỡi chiều' },
      { text: '15:00 (Sān diǎn)', pinyin: 'Sān diǎn', translation: '3 giờ chiều' }
    ],
    correct_option_index: 1,
    explanation: '"下午两点半" nghĩa là 2 giờ rưỡi chiều (14:30). Chú ý số 2 khi nói giờ dùng 两 (liǎng), không dùng 二 (èr).',
    points: 10
  },
  {
    id: 'q-hsk1-01-09',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 9,
    prompt: '听对话，选择天气情况：',
    pinyin: 'Tīng duìhuà, xuǎnzé tiānqì qíngkuàng:',
    translation: 'Nghe đoạn đối thoại, chọn tình hình thời tiết:',
    audio_url: '',
    audio_script: '女：今天天气怎么样？男：今天太冷了，还下雨了。',
    options: [
      { text: '下雨 (Trời mưa)', pinyin: 'Xiàyǔ', translation: 'Trời mưa' },
      { text: '很热 (Rất nóng)', pinyin: 'Hěn rè', translation: 'Rất nóng' },
      { text: '晴天 (Trời nắng ráo)', pinyin: 'Qíngtiān', translation: 'Trời nắng' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói: "今天太冷了，还下雨了" (Hôm nay lạnh quá, trời còn mưa nữa). Đáp án là 下雨.',
    points: 10
  },
  {
    id: 'q-hsk1-01-10',
    exam_id: 'hsk1-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 10,
    prompt: '听对话，选择人物正在做的事情：',
    pinyin: 'Tīng duìhuà, xuǎnzé rénwù zhèngzài zuò de shìqing:',
    translation: 'Nghe đối thoại, chọn việc người đó đang làm:',
    audio_url: '',
    audio_script: '男：你在做什么呢？女：我在看电视呢。问：女的在做什么？',
    options: [
      { text: '睡觉 (Ngủ)', pinyin: 'Shuìjiào', translation: 'Ngủ' },
      { text: '做饭 (Nấu cơm)', pinyin: 'Zuòfàn', translation: 'Nấu ăn' },
      { text: '看电视 (Xem tivi)', pinyin: 'Kàn diànshì', translation: 'Xem tivi' }
    ],
    correct_option_index: 2,
    explanation: 'Người nữ trả lời rõ: "我在看电视呢" (Tôi đang xem tivi).',
    points: 10
  },

  // PHẦN ĐỌC HIỂU (Reading - 10 câu)
  {
    id: 'q-hsk1-01-11',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 11,
    prompt: '选词填空：我______中国菜，中国菜很好吃。',
    pinyin: 'Xuǎncí tiánkòng: Wǒ ______ Zhōngguó cài, Zhōngguó cài hěn hǎochī.',
    translation: 'Chọn từ điền vào chỗ trống: Tôi ______ món ăn Trung Quốc, đồ ăn Trung Quốc rất ngon.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '喜欢 (Thích)', pinyin: 'Xǐhuan', translation: 'Yêu thích' },
      { text: '去 (Đi)', pinyin: 'Qù', translation: 'Đi' },
      { text: '买 (Mua)', pinyin: 'Mǎi', translation: 'Mua' },
      { text: '叫 (Gọi/Tên là)', pinyin: 'Jiào', translation: 'Tên là' }
    ],
    correct_option_index: 0,
    explanation: 'Vế sau khen "món ăn Trung Quốc rất ngon", nên động từ phù hợp nhất về mặt ngữ nghĩa là 喜欢 (thích).',
    points: 10
  },
  {
    id: 'q-hsk1-01-12',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 12,
    prompt: '读句子，选择正确的意思：[她是我的汉语老师。]',
    pinyin: 'Dú jùzi, xuǎnzé zhèngquè de yìsi: [Tā shì wǒ de Hànyǔ lǎoshī.]',
    translation: 'Đọc câu, chọn ý nghĩa chính xác của câu: "Cô ấy là giáo viên tiếng Trung của tôi."',
    audio_url: '',
    audio_script: '',
    options: [
      { text: 'Cô ấy là bạn học của tôi', pinyin: 'Tā shì wǒ de tóngxué', translation: 'Sai' },
      { text: 'Cô ấy là giáo viên tiếng Trung của tôi', pinyin: 'Tā shì wǒ de Hànyǔ lǎoshī', translation: 'Đúng' },
      { text: 'Tôi là giáo viên của cô ấy', pinyin: 'Wǒ shì tā de lǎoshī', translation: 'Sai' },
      { text: 'Cô ấy đang học tiếng Trung', pinyin: 'Tā zài xué Hànyǔ', translation: 'Sai' }
    ],
    correct_option_index: 1,
    explanation: 'Chủ ngữ "她" (cô ấy), vị ngữ "是我的汉语老师" (là giáo viên tiếng Trung của tôi). Đáp án B dịch chính xác 100%.',
    points: 10
  },
  {
    id: 'q-hsk1-01-13',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 13,
    prompt: '选词填空：对不起，我不会说______。',
    pinyin: 'Xuǎncí tiánkòng: Duìbuqǐ, wǒ bú huì shuō ______.',
    translation: 'Điền từ: Xin lỗi, tôi không biết nói ______.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '学校 (Trường học)', pinyin: 'Xuéxiào', translation: 'Danh từ nơi chốn' },
      { text: '汉语 (Tiếng Hán/Tiếng Trung)', pinyin: 'Hànyǔ', translation: 'Ngôn ngữ' },
      { text: '米饭 (Cơm trắng)', pinyin: 'Mǐfàn', translation: 'Thức ăn' },
      { text: '衣服 (Quần áo)', pinyin: 'Yīfu', translation: 'Trang phục' }
    ],
    correct_option_index: 1,
    explanation: 'Động từ "说" (nói) chỉ kết hợp với danh từ chỉ ngôn ngữ. Ở đây là "汉语" (tiếng Trung).',
    points: 10
  },
  {
    id: 'q-hsk1-01-14',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 14,
    prompt: '选择正确的问句答语：[请问，洗手间在哪里？]',
    pinyin: 'Xuǎnzé zhèngquè de wènjù dáyǔ: [Qǐngwèn, xǐshǒujiān zài nǎlǐ?]',
    translation: 'Chọn câu đáp lại phù hợp: "Xin hỏi, nhà vệ sinh ở đâu ạ?"',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '在前面左拐。', pinyin: 'Zài qiánmiàn zuǒ guǎi.', translation: 'Ở phía trước rẽ trái.' },
      { text: '不用谢。', pinyin: 'Bú yòng xiè.', translation: 'Không có chi.' },
      { text: '我不是学生。', pinyin: 'Wǒ bú shì xuésheng.', translation: 'Tôi không phải học sinh.' },
      { text: '今天星期五。', pinyin: 'Jīntiān xīngqīwǔ.', translation: 'Hôm nay thứ Sáu.' }
    ],
    correct_option_index: 0,
    explanation: 'Câu hỏi hỏi về địa điểm nơi chốn ("在哪里？" - ở đâu?), đáp án chỉ phương hướng nơi chốn là "在前面左拐" (ở phía trước rẽ trái).',
    points: 10
  },
  {
    id: 'q-hsk1-01-15',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 15,
    prompt: '选词填空：你在看______呢？',
    pinyin: 'Xuǎncí tiánkòng: Nǐ zài kàn ______ ne?',
    translation: 'Điền đại từ nghi vấn: Bạn đang xem ______ thế?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '什么 (Gì/Cái gì)', pinyin: 'Shénme', translation: 'Cái gì' },
      { text: '谁 (Ai)', pinyin: 'Shéi', translation: 'Ai' },
      { text: '哪儿 (Ở đâu)', pinyin: 'Nǎr', translation: 'Ở đâu' },
      { text: '怎么 (Như thế nào)', pinyin: 'Zěnme', translation: 'Thế nào' }
    ],
    correct_option_index: 0,
    explanation: '"你在看什么呢？" (Bạn đang xem cái gì vậy?). "什么" là đại từ hỏi tân ngữ chỉ đồ vật/nội dung.',
    points: 10
  },
  {
    id: 'q-hsk1-01-16',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 16,
    prompt: '读短文判断：[我叫大卫，我是美国人。我今年二十岁，在清华大学学习中文。] 问：大卫是在哪所大学学习？',
    pinyin: 'Dú duǎnwén pànduàn: [Wǒ jiào Dàwèi, wǒ shì Měiguó rén. Wǒ jīnnián èrshí suì, zài Qīnghuá Dàxué xuéxí Zhōngwén.] Wèn: Dàwèi shì zài nǎ suǒ dàxué xuéxí?',
    translation: 'Đọc đoạn văn ngắn: "Tôi tên là David, là người Mỹ. Năm nay tôi 20 tuổi, đang học tiếng Trung ở Đại học Thanh Hoa." Hỏi: David đang học ở trường đại học nào?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '北京大学 (Đại học Bắc Kinh)', pinyin: 'Běijīng Dàxué', translation: 'Bắc Đại' },
      { text: '清华大学 (Đại học Thanh Hoa)', pinyin: 'Qīnghuá Dàxué', translation: 'Thanh Hoa' },
      { text: '河内大学 (Đại học Hà Nội)', pinyin: 'Hénèi Dàxué', translation: 'Hà Nội' },
      { text: '纽约大学 (Đại học New York)', pinyin: 'Niǔyuē Dàxué', translation: 'New York' }
    ],
    correct_option_index: 1,
    explanation: 'Đoạn văn viết rõ: "在清华大学学习中文" (học tiếng Trung ở Đại học Thanh Hoa). Chọn phương án B.',
    points: 10
  },
  {
    id: 'q-hsk1-01-17',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 17,
    prompt: '连词成句，选出语序正确的一项：[①在 ②我 ③北京 ④住]',
    pinyin: 'Liáncí chéng jù, xuǎn chū yǔxù zhèngquè de yí xiàng: [①zài ②wǒ ③Běijīng ④zhù]',
    translation: 'Sắp xếp từ thành câu đúng ngữ pháp: [①ở ②tôi ③Bắc Kinh ④sống]',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '②④①③ (我住 intuitive/ 我住在北京。)', pinyin: 'Wǒ zhù zài Běijīng.', translation: 'Tôi sống ở Bắc Kinh.' },
      { text: '①③②④ (在 北京 我 住。)', pinyin: 'Zài Běijīng wǒ zhù.', translation: 'Sai ngữ tự' },
      { text: '②①④③ (我 在 住 北京。)', pinyin: 'Wǒ zài zhù Běijīng.', translation: 'Sai cấu trúc' },
      { text: '③①②④ (北京 在 我 住。)', pinyin: 'Běijīng zài wǒ zhù.', translation: 'Sai chủ ngữ' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc "Chủ ngữ + 住 + 在 + Địa điểm" (我住在北京 - Wǒ zhù zài Běijīng). Trật tự đúng là ②④①③.',
    points: 10
  },
  {
    id: 'q-hsk1-01-18',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 18,
    prompt: '读句子，选择量词：这里有两______书。',
    pinyin: 'Dú jùzi, xuǎnzé liàngcí: Zhèlǐ yǒu liǎng ______ shū.',
    translation: 'Chọn lượng từ phù hợp cho danh từ "sách" (书): Ở đây có 2 ______ sách.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '本 (Běn - quyển/cuốn)', pinyin: 'Běn', translation: 'Lượng từ cho sách' },
      { text: '个 (Gè - cái/chiếc)', pinyin: 'Gè', translation: 'Lượng từ chung' },
      { text: '只 (Zhī - con)', pinyin: 'Zhī', translation: 'Lượng từ cho động vật' },
      { text: '张 (Zhāng - tờ/tấm)', pinyin: 'Zhāng', translation: 'Lượng từ cho mặt phẳng' }
    ],
    correct_option_index: 0,
    explanation: 'Lượng từ chuẩn xác đi cùng sách (书) là 本 (běn - quyển/cuốn): 两本书 (liǎng běn shū).',
    points: 10
  },
  {
    id: 'q-hsk1-01-19',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 19,
    prompt: '看拼音选汉字：māma (mẹ)',
    pinyin: 'Kàn pīnyīn xuǎn hànzì: māma (mẹ)',
    translation: 'Nhìn pinyin chọn chữ Hán đúng: māma (mẹ)',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '妈妈', pinyin: 'māma', translation: 'Mẹ' },
      { text: '爸爸', pinyin: 'bàba', translation: 'Bố' },
      { text: '哥哥', pinyin: 'gēge', translation: 'Anh trai' },
      { text: '姐姐', pinyin: 'jiějie', translation: 'Chị gái' }
    ],
    correct_option_index: 0,
    explanation: '"māma" là phiên âm của chữ 妈妈 (mẹ, mẫu thân có bộ Nữ 女).',
    points: 10
  },
  {
    id: 'q-hsk1-01-20',
    exam_id: 'hsk1-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 20,
    prompt: '选择与划线词意思相反的词：这件衣服太[小]了。',
    pinyin: 'Xuǎnzé yǔ huàxiàn cí yìsi xiāngfǎn de cí: Zhè jiàn yīfu tài [xiǎo] le.',
    translation: 'Chọn từ trái nghĩa với từ trong ngoặc [tiểu - nhỏ]: Bộ quần áo này [nhỏ] quá.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '大 (Đại - to/lớn)', pinyin: 'Dà', translation: 'To lớn' },
      { text: '冷 (Lãnh - lạnh)', pinyin: 'Lěng', translation: 'Lạnh' },
      { text: '热 (Nhiệt - nóng)', pinyin: 'Rè', translation: 'Nóng' },
      { text: '多 (Đa - nhiều)', pinyin: 'Duō', translation: 'Nhiều' }
    ],
    correct_option_index: 0,
    explanation: 'Trái nghĩa với 小 (xiǎo - nhỏ) là 大 (dà - to, lớn).',
    points: 10
  },

  // ==========================================
  // EXAM 2: hsk2-mock-01 (Mẫu HSK 2: 25 câu)
  // ==========================================
  {
    id: 'q-hsk2-01-01',
    exam_id: 'hsk2-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    prompt: '听对话，判断对错：[男的今天晚上有空。]',
    pinyin: 'Tīng duìhuà, pànduàn duì cuò: [Nán de jīntiān wǎnshang yǒu kòng.]',
    translation: 'Nghe đối thoại, đoán đúng sai: "Người nam tối nay rảnh rỗi."',
    audio_url: '',
    audio_script: '女：今天晚上一起去看电影吧？男：真不巧，我今晚要加班。',
    options: [
      { text: '✓ Đúng (对)', pinyin: 'Duì', translation: 'Đúng' },
      { text: '✗ Sai (错)', pinyin: 'Cuò', translation: 'Sai' }
    ],
    correct_option_index: 1,
    explanation: 'Người nam nói: "我今晚要加班" (Tối nay tôi phải tăng ca), chứng tỏ anh ấy không rảnh rỗi. Nhận định "có thời gian rảnh" là Sai (错).',
    points: 8
  },
  {
    id: 'q-hsk2-01-02',
    exam_id: 'hsk2-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 2,
    prompt: '听对话，选择男的想买什么：',
    pinyin: 'Tīng duìhuà, xuǎnzé nán de xiǎng mǎi shénme:',
    translation: 'Nghe đối thoại, chọn món đồ người nam muốn mua:',
    audio_url: '',
    audio_script: '女：您需要买点儿什么？男：我想买一件黑色的羽绒服。问：男的想买什么？',
    options: [
      { text: '羽绒服 (Áo khoác lông vũ)', pinyin: 'Yǔróngfú', translation: 'Áo phao lông vũ' },
      { text: '运动鞋 (Giày thể thao)', pinyin: 'Yùndòngxié', translation: 'Giày thể thao' },
      { text: '帽子 (Mũ nón)', pinyin: 'Màozi', translation: 'Mũ' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói: "我想买一件黑色的羽绒服" (Tôi muốn mua một chiếc áo khoác lông vũ màu đen).',
    points: 8
  },
  {
    id: 'q-hsk2-01-03',
    exam_id: 'hsk2-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 3,
    prompt: '选词填空：今天比昨天______多了，快穿上外套吧。',
    pinyin: 'Xuǎncí tiánkòng: Jīntiān bǐ zuótiān ______ duō le, kuài chuān shang wàitào ba.',
    translation: 'Điền từ câu so sánh 比: Hôm nay so với hôm qua ______ hơn nhiều, mau mặc áo khoác vào đi.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '冷 (Lạnh)', pinyin: 'Lěng', translation: 'Lạnh' },
      { text: '热 (Nóng)', pinyin: 'Rè', translation: 'Nóng' },
      { text: '远 (Xa)', pinyin: 'Yuǎn', translation: 'Xa' },
      { text: '快 (Nhanh)', pinyin: 'Kuài', translation: 'Nhanh' }
    ],
    correct_option_index: 0,
    explanation: 'Vế sau khuyên "快穿上外套吧" (mau mặc áo khoác ngoài vào), do đó tính từ phù hợp là 冷 (lạnh). Cấu trúc: A + 比 + B + Adj + 多了.',
    points: 8
  },
  {
    id: 'q-hsk2-01-04',
    exam_id: 'hsk2-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    prompt: '选词填空：虽然汉语很难，______我非常喜欢。',
    pinyin: 'Xuǎncí tiánkòng: Suīrán Hànyǔ hěn nán, ______ wǒ fēicháng xǐhuan.',
    translation: 'Điền liên từ: Tuy tiếng Trung rất khó, ______ tôi rất thích.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '但是 (Nhưng)', pinyin: 'Dànshì', translation: 'Nhưng/Tuy nhiên' },
      { text: '所以 (Cho nên)', pinyin: 'Suǒyǐ', translation: 'Vì vậy' },
      { text: '因为 (Bởi vì)', pinyin: 'Yīnwèi', translation: 'Bởi vì' },
      { text: '或者 (Hoặc là)', pinyin: 'Huòzhě', translation: 'Hoặc là' }
    ],
    correct_option_index: 0,
    explanation: 'Cặp liên từ chỉ sự nhượng bộ: 虽然...但是... (Tuy...nhưng...).',
    points: 8
  },
  {
    id: 'q-hsk2-01-05',
    exam_id: 'hsk2-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 5,
    prompt: '选择正确的动词：他正在教室里______作业呢。',
    pinyin: 'Xuǎnzé zhèngquè de dòngcí: Tā zhèngzài jiàoshì lǐ ______ zuòyè ne.',
    translation: 'Chọn động từ kết hợp với "bài tập" (作业): Cậu ấy đang ở trong lớp ______ bài tập.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '做 (Làm)', pinyin: 'Zuò', translation: 'Làm bài tập' },
      { text: '吃 (Ăn)', pinyin: 'Chī', translation: 'Ăn' },
      { text: '买 (Mua)', pinyin: 'Mǎi', translation: 'Mua' },
      { text: '听 (Nghe)', pinyin: 'Tīng', translation: 'Nghe' }
    ],
    correct_option_index: 0,
    explanation: 'Cụm từ cố định: 做作业 (zuò zuòyè - làm bài tập).',
    points: 8
  },

  // ==========================================
  // EXAM 3: hsk3-mock-01 (Mẫu HSK 3: câu chữ 把, 被, v.v.)
  // ==========================================
  {
    id: 'q-hsk3-01-01',
    exam_id: 'hsk3-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 1,
    prompt: '选词填空：请你把窗户______，外面刮大风了。',
    pinyin: 'Xuǎncí tiánkòng: Qǐng nǐ bǎ chuānghu ______, wàimiàn guā dàfēng le.',
    translation: 'Điền từ vào câu chữ 把: Làm phiền bạn đem cửa sổ ______, bên ngoài gió to quá.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '关上 (Đóng lại)', pinyin: 'Guān shàng', translation: 'Đóng lại' },
      { text: '打开 (Mở ra)', pinyin: 'Dǎ kāi', translation: 'Mở ra' },
      { text: '扔掉 (Vứt đi)', pinyin: 'Rēng diào', translation: 'Vứt đi' },
      { text: '洗干净 (Rửa sạch)', pinyin: 'Xǐ gānjìng', translation: 'Rửa sạch' }
    ],
    correct_option_index: 0,
    explanation: 'Bên ngoài đang có gió to (刮大风), vì vậy hành động xử trí đối với cửa sổ là "关上" (đóng lại). Cấu trúc câu chữ 把: S + 把 + O + V + Bổ ngữ kết quả/phương hướng.',
    points: 10
  },
  {
    id: 'q-hsk3-01-02',
    exam_id: 'hsk3-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 2,
    prompt: '选择语法正确的一句：',
    pinyin: 'Xuǎnzé yǔfǎ zhèngquè de yí jù:',
    translation: 'Chọn câu có ngữ pháp chuẩn xác:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '他把作业做完了。', pinyin: 'Tā bǎ zuòyè zuò wán le.', translation: 'Chuẩn câu chữ 把' },
      { text: '他把作业做。', pinyin: 'Tā bǎ zuòyè zuò.', translation: 'Thiếu thành phần kết quả sau V' },
      { text: '他作业把做完了。', pinyin: 'Tā zuòyè bǎ zuò wán le.', translation: 'Sai vị trí 把' },
      { text: '他把做完了作业。', pinyin: 'Tā bǎ zuò wán le zuòyè.', translation: 'Sai vị trí tân ngữ' }
    ],
    correct_option_index: 0,
    explanation: 'Trong câu chữ 把, động từ bắt buộc phải có thành phần kết quả đi kèm (做完了), và tân ngữ chịu tác động (作业) phải đứng ngay sau 把.',
    points: 10
  },
  {
    id: 'q-hsk3-01-03',
    exam_id: 'hsk3-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    prompt: '选词填空：我的自行车______人骑走了。',
    pinyin: 'Xuǎncí tiánkòng: Wǒ de zìxíngchē ______ rén qí zǒu le.',
    translation: 'Điền từ câu bị động: Xe đạp của tôi ______ người ta đạp đi mất rồi.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '被 (Bị/Được)', pinyin: 'Bèi', translation: 'Giới từ bị động' },
      { text: '把 (Đem/Lấy)', pinyin: 'Bǎ', translation: 'Câu xử trí' },
      { text: '给 (Cho)', pinyin: 'Gěi', translation: 'Cho/Tặng' },
      { text: '让 (Để)', pinyin: 'Ràng', translation: 'Khiến cho' }
    ],
    correct_option_index: 0,
    explanation: 'Chủ ngữ "我的自行车" là vật bị tác động, mất đi xe đạp mang sắc thái không mong muốn nên dùng câu bị động chữ 被: S (chịu tác động) + 被 + Tác nhân + V + Thành phần khác.',
    points: 10
  }
];

// Helper: lấy đề thi đầy đủ thông tin (chỉ dùng nội bộ server / scoring service)
export function getFullExamById(examId) {
  const exam = HSK_EXAMS.find(e => e.id === examId);
  if (!exam) return null;
  const questions = HSK_QUESTIONS.filter(q => q.exam_id === examId)
    .sort((a, b) => a.question_number - b.question_number);
  return { ...exam, questions };
}

// Helper: BẢO MẬT TUYỆT ĐỐI — Tước bỏ đáp án & lời giải trước khi đưa ra màn hình thi
export function getSanitizedExamForTaking(examId) {
  const exam = HSK_EXAMS.find(e => e.id === examId);
  if (!exam) return null;
  const questions = HSK_QUESTIONS.filter(q => q.exam_id === examId)
    .sort((a, b) => a.question_number - b.question_number)
    .map(q => ({
      id: q.id,
      exam_id: q.exam_id,
      part_type: q.part_type,
      part_number: q.part_number,
      question_number: q.question_number,
      prompt: q.prompt,
      pinyin: q.pinyin,
      translation: q.translation,
      audio_url: q.audio_url,
      audio_script: q.audio_script,
      options: q.options,
      points: q.points
      // BẢO MẬT: Tuyệt đối không bao gồm correct_option_index và explanation ở đây!
    }));
  return { ...exam, questions };
}
