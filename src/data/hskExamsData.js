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

import { EXPANDED_MOCK_EXAMS, EXPANDED_MOCK_QUESTIONS } from './hskMockExamsExpanded.js';
import { REAL_SIMULATION_QUESTIONS } from './hskRealExamQuestions.js';

const BASE_HSK_EXAMS = [
  {
    id: 'hsk1-mock-01',
    title: 'Đề Thi Thử HSK 1 Chuẩn Mẫu Số 1 (Tổng Hợp Nghe & Đọc)',
    level: 'HSK 1',
    exam_version: '2015-Standard',
    exam_type: 'mock', // Đề thi thử HanziGo
    skill_category: 'mixed',
    duration_minutes: 40,
    total_questions: 40,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử toàn diện 100% chuẩn quy cách thi thật CTI: 20 câu Nghe hiểu (phát 2 lượt kèm audio) và 20 câu Đọc hiểu (từ vựng, ghép câu, đối chiếu tranh ảnh, điền từ). Thời gian làm bài 40 phút, điểm đạt 120/200.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk1-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0 (Creative Commons Ghi công - Phi thương mại)',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
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
    total_questions: 10,
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
    total_questions: 35,
    passing_score: 120,
    max_score: 200,
    description: 'Đề thi thử HSK 2 mở rộng toàn diện chuẩn phòng thi: 20 câu Nghe hiểu hội thoại (audio phát 2 lượt) và 15 câu Đọc hiểu ngữ pháp, câu so sánh chữ 比, lượng từ và liên từ. Thời gian 55 phút, điểm đạt 120/200.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk2-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
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
    total_questions: 10,
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
    title: 'Đề Thi Thử HSK 3 Chuẩn Số 1 (Nghe - Đọc - Viết Câu)',
    level: 'HSK 3',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 85,
    total_questions: 30,
    passing_score: 180,
    max_score: 300,
    description: 'Đề thi thử HSK 3 chuẩn thực chiến 3 phân môn: 12 câu Nghe hiểu đoạn văn ngắn (audio 2 lượt), 12 câu Đọc hiểu nối câu & đoạn văn, 6 câu Viết (sắp xếp câu chữ 把 / chữ 被 và điền chữ Hán). Thời gian làm bài 85 phút, điểm đạt 180/300.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk3-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk4-mock-01',
    title: 'Đề Thi Thử HSK 4 Toàn Diện Số 1 (Nghe 1 Lần - Đọc - Viết Đoạn)',
    level: 'HSK 4',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 105,
    total_questions: 30,
    passing_score: 180,
    max_score: 300,
    description: 'Mô phỏng cấu trúc HSK 4 chuẩn chuyên sâu: 12 câu Nghe chỉ phát 1 lần duy nhất, 12 câu Đọc hiểu (sắp xếp mệnh đề A-B-C, điền từ A-E, bài báo xã hội), 6 câu Viết (sắp xếp câu phức và viết câu theo tranh). Thời gian làm bài 105 phút, điểm đạt 180/300.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk4-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
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
    description: 'Tài liệu đề thi mẫu chính thức CTI mã H10901 dùng làm chuẩn tham chiếu đối sánh cấu trúc thi thật.',
    source_url: 'http://www.chinesetest.cn/godownload.do',
    source_author: 'Chinese Testing International (CTI / Hanban)',
    license: 'Public Educational Sample Reference (Chỉ tham chiếu học thuật công khai)',
    permission_status: 'reproducible',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk5-mock-01',
    title: 'Đề Luyện Thi Thử HSK 5 Toàn Diện Số 1 (Mô Phỏng 3 Phân Môn)',
    level: 'HSK 5',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 125,
    total_questions: 15,
    passing_score: 180,
    max_score: 300,
    description: 'Đề mô phỏng định dạng HSK 5 nâng cao 3 kỹ năng: Nghe hiểu thời sự và đàm phán, Đọc hiểu văn bản dài và thành ngữ, Viết sắp xếp và làm bài luận 80 chữ. Thời gian làm bài 125 phút, điểm đạt 180/300.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk5-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  },
  {
    id: 'hsk6-mock-01',
    title: 'Đề Luyện Thi Thử HSK 6 Đỉnh Phong Số 1 (Mô Phỏng Nâng Cao & Bệnh Cú)',
    level: 'HSK 6',
    exam_version: '2015-Standard',
    exam_type: 'mock',
    skill_category: 'mixed',
    duration_minutes: 140,
    total_questions: 15,
    passing_score: 180,
    max_score: 300,
    description: 'Đề mô phỏng cấp độ cao nhất HSK 6: Nghe hội thảo học thuật, nhận diện lỗi ngữ pháp (病句), đọc luận thuyết khoa học và kỹ năng tóm tắt văn bản 400 chữ. Thời gian làm bài 140 phút, điểm đạt 180/300.',
    source_url: 'https://hanzigo.com/hsk/mock/hsk6-01',
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0',
    permission_status: 'original_content',
    verified_date: '2026-10-25',
    is_published: true
  }
];

const BASE_HSK_QUESTIONS = [
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
  // EXAM 3: hsk3-mock-01 (Mẫu HSK 3: Nghe, Đọc, Viết)
  // ==========================================
  {
    id: 'q-hsk3-01-01',
    exam_id: 'hsk3-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听对话，选择正确答案：',
    pinyin: 'Tīng duìhuà, xuǎnzé zhèngquè dá\'àn:',
    translation: 'Nghe đối thoại, chọn đáp án đúng:',
    audio_url: '',
    audio_script: '男：小王，请问会议室在几层？女：在五层，出电梯往左走就是。问：会议室在几层？',
    options: [
      { text: '三层 (Tầng 3)', pinyin: 'Sān céng', translation: 'Tầng 3' },
      { text: '五层 (Tầng 5)', pinyin: 'Wǔ céng', translation: 'Tầng 5' },
      { text: '七层 (Tầng 7)', pinyin: 'Qī céng', translation: 'Tầng 7' }
    ],
    correct_option_index: 1,
    explanation: 'Lời thoại người nữ: "在五层，出电梯往左走就是" (Ở tầng 5, ra khỏi thang máy rẽ trái là tới).',
    points: 15
  },
  {
    id: 'q-hsk3-01-02',
    exam_id: 'hsk3-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听对话，判断女的打算买什么：',
    pinyin: 'Tīng duìhuà, pànduàn nǚ de dǎsuàn mǎi shénme:',
    translation: 'Nghe đối thoại, phán đoán người nữ định mua gì:',
    audio_url: '',
    audio_script: '男：天气越来越冷了，你得多穿点儿。女：是啊，我打算周末去商场买一件厚羽绒服。问：女的打算买什么？',
    options: [
      { text: '羽绒服 (Áo phao lông vũ)', pinyin: 'Yǔróngfú', translation: 'Áo phao' },
      { text: '衬衫 (Áo sơ mi)', pinyin: 'Chènshān', translation: 'Áo sơ mi' },
      { text: '雨伞 (Cái ô)', pinyin: 'Yǔsǎn', translation: 'Cái ô' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ nói: "我打算周末去商场买一件厚羽绒服" (Tôi định cuối tuần đi trung tâm mua sắm mua một chiếc áo phao dày).',
    points: 15
  },
  {
    id: 'q-hsk3-01-03',
    exam_id: 'hsk3-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 3,
    question_type: 'multiple_choice',
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
    points: 15
  },
  {
    id: 'q-hsk3-01-04',
    exam_id: 'hsk3-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
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
    points: 15
  },
  {
    id: 'q-hsk3-01-05',
    exam_id: 'hsk3-mock-01',
    part_type: 'writing',
    part_number: 3,
    question_number: 5,
    question_type: 'reorder_sentence',
    prompt: '书写第一部分：将词语排列成一句通顺的话（Sắp xếp từ thành câu）：',
    pinyin: 'Shūxiě dì-yī bùfen: Jiāng cíyǔ páiliè chéng yí jù tōngshùn de huà:',
    translation: 'Viết Phần 1: Sắp xếp các cụm từ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    audio_url: '',
    audio_script: '',
    words: ['作业', '他', '把', '做完了'],
    correct_order: ['他', '把', '作业', '做完了'],
    correct_sentence: '他把作业做完了。',
    options: [
      { text: '他把作业做完了。', pinyin: 'Tā bǎ zuòyè zuò wán le.', translation: 'Anh ấy đã làm xong bài tập rồi.' },
      { text: '作业他把做完了。', pinyin: 'Zuòyè tā bǎ zuò wán le.', translation: 'Sai vị trí chủ ngữ - tân ngữ' },
      { text: '他把做完了作业。', pinyin: 'Tā bǎ zuò wán le zuòyè.', translation: 'Sai cấu trúc chữ 把' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc câu chữ 把: Chủ ngữ (他) + 把 + Tân ngữ chịu tác động (作业) + Động từ (做) + Bổ ngữ kết quả (完了).',
    points: 20
  },
  {
    id: 'q-hsk3-01-06',
    exam_id: 'hsk3-mock-01',
    part_type: 'writing',
    part_number: 3,
    question_number: 6,
    question_type: 'fill_blank',
    prompt: '书写第二部分：读拼音，写汉字（Điền chữ Hán vào chỗ trống）：他是我的好朋______ (yǒu)。',
    pinyin: 'Shūxiě dì-èr bùfen: Dú pīnyīn, xiě hànzì: Tā shì wǒ de hǎo péng______ (yǒu).',
    translation: 'Viết Phần 2: Nhìn Pinyin điền chữ Hán: Cậu ấy là người bạn tốt của tôi.',
    audio_url: '',
    audio_script: '',
    hint_pinyin: 'yǒu',
    accepted_answers: ['友'],
    options: [
      { text: '友 (Hữu - bạn bè)', pinyin: 'yǒu', translation: 'Bạn hữu' },
      { text: '有 (Hữu - có)', pinyin: 'yǒu', translation: 'Có' },
      { text: '右 (Hữu - bên phải)', pinyin: 'yòu', translation: 'Bên phải' }
    ],
    correct_option_index: 0,
    explanation: 'Từ vựng "朋友" (péngyou - bạn bè). Chữ Hán cần điền là chữ 友 (yǒu - có bộ Hựu 又).',
    points: 20
  },

  // ==========================================
  // EXAM 4: hsk4-mock-01 (Mẫu HSK 4: Nghe 1 Lần, Đọc, Viết)
  // ==========================================
  {
    id: 'q-hsk4-01-01',
    exam_id: 'hsk4-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听短文（仅播放一次），选择正确答案：',
    pinyin: 'Tīng duǎnwén (jǐn bōfàng yí cì), xuǎnzé zhèngquè dá\'àn:',
    translation: 'Nghe đoạn văn (chỉ phát duy nhất 1 lần theo chuẩn HSK 4), chọn đáp án đúng:',
    audio_url: '',
    audio_script: '每个人都会遇到困难，重要的是要保持乐观的心态，勇敢面对。问：遇到困难时最重要的是什么？',
    options: [
      { text: '放弃目标 (Từ bỏ mục tiêu)', pinyin: 'Fàngqì mùbiāo', translation: 'Từ bỏ' },
      { text: '保持乐观心态 (Giữ tinh thần lạc quan)', pinyin: 'Bǎochí lèguān xīntài', translation: 'Giữ thái độ lạc quan' },
      { text: '依靠别人 (Dựa dẫm người khác)', pinyin: 'Yīkào biérén', translation: 'Trông cậy người khác' }
    ],
    correct_option_index: 1,
    explanation: 'Lời thoại đoạn văn: "重要的是要保持乐观的心态，勇敢面对" (Điều quan trọng là giữ vững tinh thần lạc quan, dũng cảm đối diện).',
    points: 15
  },
  {
    id: 'q-hsk4-01-02',
    exam_id: 'hsk4-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听对话（仅播放一次），选择男的对这份工作的感觉：',
    pinyin: 'Tīng duìhuà (jǐn bōfàng yí cì), xuǎnzé nán de duì zhè fèn gōngzuò de gǎnjué:',
    translation: 'Nghe đối thoại (phát 1 lần), chọn cảm nhận của người nam về công việc:',
    audio_url: '',
    audio_script: '女：新工作适应得怎么样了？男：挺好的，同事们都很友好，而且加班也不算多。问：男的觉得新工作怎么样？',
    options: [
      { text: '挺满意的 (Khá hài lòng)', pinyin: 'Tǐng mǎnyì de', translation: 'Rất hài lòng' },
      { text: '压力太大 (Áp lực quá lớn)', pinyin: 'Yālì tài dà', translation: 'Quá áp lực' },
      { text: '想换工作 (Muốn đổi việc)', pinyin: 'Xiǎng huàn gōngzuò', translation: 'Muốn đổi việc' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam trả lời: "挺好的，同事们都很友好..." (Rất tốt, các đồng nghiệp đều thân thiện). Thể hiện thái độ hài lòng.',
    points: 15
  },
  {
    id: 'q-hsk4-01-03',
    exam_id: 'hsk4-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '选词填空：成功往往属于那些能够坚持到底的人，______他们从不轻易放弃。',
    pinyin: 'Xuǎncí tiánkòng: Chénggōng wǎngwǎng shǔyú nàxiē nénggòu jiānchí dàodǐ de rén, ______ tāmen cóngbù qīngyì fàngqì.',
    translation: 'Điền từ nối câu: Thành công thường thuộc về những người có thể kiên trì đến cùng, ______ họ không bao giờ dễ dàng từ bỏ.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '因为 (Bởi vì)', pinyin: 'Yīnwèi', translation: 'Bởi vì' },
      { text: '尽管 (Mặc dù)', pinyin: 'Jǐnguǎn', translation: 'Mặc dù' },
      { text: '即使 (Cho dù)', pinyin: 'Jíshǐ', translation: 'Cho dù' },
      { text: '不仅 (Không những)', pinyin: 'Bùjǐn', translation: 'Không chỉ' }
    ],
    correct_option_index: 0,
    explanation: 'Vế sau giải thích nguyên nhân cho vế trước ("họ không bao giờ từ bỏ"), do đó dùng liên từ nguyên nhân "因为" (yīnwèi).',
    points: 15
  },
  {
    id: 'q-hsk4-01-04',
    exam_id: 'hsk4-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '阅读理解：要想身体健康，除了合理饮食，保证充足的睡眠也是非常必要的。根据这段话，可以知道：',
    pinyin: 'Yuèdú lǐjiě: Yào xiǎng shēntǐ jiànkāng, chúle hélǐ yǐnshí, bǎozhèng chōngzú de shuìmián yě shì fēicháng bìyào de. Gēnjù zhè duàn huà, kěyǐ zhīdào:',
    translation: 'Đọc hiểu: Muốn cơ thể khỏe mạnh, ngoài ăn uống hợp lý, đảm bảo ngủ đủ giấc cũng vô cùng cần thiết. Căn cứ đoạn văn trên, có thể biết:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '睡眠对健康很重要 (Giấc ngủ rất quan trọng với sức khỏe)', pinyin: 'Shuìmián duì jiànkāng hěn zhòngyào', translation: 'Giấc ngủ rất quan trọng' },
      { text: '饮食比睡眠更关键 (Ăn uống quan trọng hơn giấc ngủ)', pinyin: 'Yǐnshí bǐ shuìmián gèng guānjiàn', translation: 'Ăn uống quan trọng hơn' },
      { text: '运动是最好的习惯 (Thể thao là thói quen tốt nhất)', pinyin: 'Yùndòng shì zuì hǎo de xíguàn', translation: 'Vận động tốt nhất' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn nhấn mạnh: "保证充足的睡眠也是非常必要的" (đảm bảo ngủ đủ giấc cũng là vô cùng cần thiết).',
    points: 15
  },
  {
    id: 'q-hsk4-01-05',
    exam_id: 'hsk4-mock-01',
    part_type: 'writing',
    part_number: 3,
    question_number: 5,
    question_type: 'reorder_sentence',
    prompt: '书写第一部分：排列词语成句：',
    pinyin: 'Shūxiě dì-yī bùfen: Páiliè cíyǔ chéng jù:',
    translation: 'Viết Phần 1: Sắp xếp các cụm từ sau thành câu hoàn chỉnh đúng ngữ pháp:',
    audio_url: '',
    audio_script: '',
    words: ['这次', '举办', '活动', '很成功', '得'],
    correct_order: ['这次', '活动', '举办', '得', '很成功'],
    correct_sentence: '这次活动举办得很成功。',
    options: [
      { text: '这次活动举办得很成功。', pinyin: 'Zhè cì huó dòng jǔ bàn de hěn chéng gōng.', translation: 'Hoạt động lần này tổ chức rất thành công.' },
      { text: '这次举办活动得很成功。', pinyin: 'Zhè cì jǔ bàn huó dòng de hěn chéng gōng.', translation: 'Sai vị trí trợ từ kết cấu 得' },
      { text: '活动这次得很成功举办。', pinyin: 'Huó dòng zhè cì de hěn chéng gōng jǔ bàn.', translation: 'Sai trật tự câu bổ ngữ trạng thái' }
    ],
    correct_option_index: 0,
    explanation: 'Cấu trúc bổ ngữ trạng thái: Chủ ngữ (这次活动) + Động từ (举办) + 得 + Bổ ngữ chỉ mức độ (很成功).',
    points: 20
  },
  {
    id: 'q-hsk4-01-06',
    exam_id: 'hsk4-mock-01',
    part_type: 'writing',
    part_number: 3,
    question_number: 6,
    question_type: 'free_writing',
    is_subjective: true,
    prompt: '书写第二部分：看图用词造句（Nhìn tranh dùng từ [乒乓球] đặt câu）：',
    pinyin: 'Shūxiě dì-èr bùfen: Kàn tú yòng cí zào jù: [pīngpāngqiú]',
    translation: 'Viết Phần 2: Dùng từ gợi ý "bóng bàn" (乒乓球) viết 1 câu hoàn chỉnh mô tả hành động (tối thiểu 6 chữ).',
    audio_url: '',
    audio_script: '',
    required_words: ['乒乓球'],
    min_words: 6,
    max_words: 30,
    options: [
      { text: '他们俩在体育馆里打乒乓球。', pinyin: 'Tāmen liǎ zài tǐyùguǎn lǐ dǎ pīngpāngqiú.', translation: 'Bài mẫu tham khảo: Hai người họ đang đánh bóng bàn ở nhà thi đấu.' },
      { text: '我非常喜欢打乒乓球。', pinyin: 'Wǒ fēicháng xǐhuan dǎ pīngpāngqiú.', translation: 'Bài mẫu tham khảo 2: Tôi rất thích đánh bóng bàn.' }
    ],
    correct_option_index: 0,
    sample_answer: '他们俩在体育馆里打乒乓球。',
    writing_criteria: [
      { name: 'Sử dụng đúng từ gợi ý [乒乓球]', weight: 30, description: 'Có xuất hiện từ 乒乓球 và kết hợp đúng động từ 打' },
      { name: 'Cấu trúc câu hoàn chỉnh', weight: 40, description: 'Đầy đủ chủ ngữ, vị ngữ, nơi chốn hoặc thời gian' },
      { name: 'Chính tả chữ Hán & dấu câu', weight: 30, description: 'Không viết sai nét chữ Hán, có dấu chấm câu đúng quy cách' }
    ],
    explanation: 'Tiêu chuẩn chấm bài thi viết tự do HSK 4: Đặt câu hoàn chỉnh có động từ 打乒乓球 (đánh bóng bàn), bổ sung trạng ngữ chỉ nơi chốn (在体育馆) hoặc thời gian (周末) để câu sinh động.',
    points: 20
  },

  // =========================================================================
  // EXAM: hsk1-reading-02 (Đề Luyện Chuyên Sâu Đọc Hiểu & Từ Vựng HSK 1 - 10 câu)
  // =========================================================================
  {
    id: 'q-hsk1-02-01',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '阅读第一部分：看词语与解释，判断是否正确：[飞机 (fēijī) - Máy bay]',
    pinyin: 'Yuèdú dì-yī bùfen: Kàn cíyǔ yǔ jiěshì, pànduàn shìfǒu zhèngquè: [fēijī - Máy bay]',
    translation: 'Đọc hiểu Phần 1: Đối chiếu từ vựng và nghĩa tiếng Việt [飞机 - Máy bay]:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: 'Đúng (正确)', pinyin: 'Zhèngquè', translation: 'Nghĩa chính xác là máy bay' },
      { text: 'Sai (错误)', pinyin: 'Cuòwù', translation: 'Không phải máy bay' }
    ],
    correct_option_index: 0,
    explanation: '飞机 (fēijī - âm Hán Việt: Phi cơ) có nghĩa chính xác là "Máy bay". Do đó phán đoán Đúng.',
    points: 10
  },
  {
    id: 'q-hsk1-02-02',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 1,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '看图文对照，判断是否吻合：[看书 (kàn shū) - Anh ấy đang ngủ]',
    pinyin: 'Kàn túwén duìzhào, pànduàn shìfǒu wènhé: [kàn shū - Anh ấy đang ngủ]',
    translation: 'Đối chiếu từ và giải nghĩa: [看书 - Anh ấy đang ngủ]:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: 'Đúng (正确)', pinyin: 'Zhèngquè', translation: 'Khớp nghĩa' },
      { text: 'Sai (错误)', pinyin: 'Cuòwù', translation: 'Sai nghĩa' }
    ],
    correct_option_index: 1,
    explanation: '看书 (kàn shū) nghĩa là "Đọc sách / Xem sách". Hành động "ngủ" trong tiếng Trung là 睡觉 (shuìjiào). Do đó phán đoán Sai.',
    points: 10
  },
  {
    id: 'q-hsk1-02-03',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '看词语与解释，判断是否正确：[吃苹果 (chī píngguǒ) - Ăn táo]',
    pinyin: 'Kàn cíyǔ yǔ jiěshì, pànduàn shìfǒu zhèngquè: [chī píngguǒ - Ăn táo]',
    translation: 'Đối chiếu từ và giải nghĩa: [吃苹果 - Ăn táo]:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: 'Đúng (正确)', pinyin: 'Zhèngquè', translation: 'Chính xác' },
      { text: 'Sai (错误)', pinyin: 'Cuòwù', translation: 'Không chính xác' }
    ],
    correct_option_index: 0,
    explanation: '吃 (chī - ăn) + 苹果 (píngguǒ - quả táo) kết hợp thành cụm từ "ăn táo". Phán đoán Đúng.',
    points: 10
  },
  {
    id: 'q-hsk1-02-04',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 1,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '看词语与解释，判断是否正确：[喝水 (hē shuǐ) - Gọi điện thoại]',
    pinyin: 'Kàn cíyǔ yǔ jiěshì, pànduàn shìfǒu zhèngquè: [hē shuǐ - Gọi điện thoại]',
    translation: 'Đối chiếu từ và giải nghĩa: [喝水 - Gọi điện thoại]:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: 'Đúng (正确)', pinyin: 'Zhèngquè', translation: 'Đúng' },
      { text: 'Sai (错误)', pinyin: 'Cuòwù', translation: 'Sai' }
    ],
    correct_option_index: 1,
    explanation: '喝水 (hē shuǐ) nghĩa là "Uống nước". Gọi điện thoại trong tiếng Trung là 打电话 (dǎ diànhuà). Do đó phán đoán Sai.',
    points: 10
  },
  {
    id: 'q-hsk1-02-05',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 2,
    question_number: 5,
    question_type: 'multiple_choice',
    prompt: '阅读第二部分：选词填空：这里的中国菜很______。',
    pinyin: 'Yuèdú dì-èr bùfen: Xuǎncí tiánkòng: Zhèlǐ de Zhōngguó cài hěn ______.',
    translation: 'Đọc hiểu Phần 2: Điền từ thích hợp vào chỗ trống: Món ăn Trung Quốc ở đây rất ______.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '好吃 (hǎochī - Ngon)', pinyin: 'Hǎochī', translation: 'Ngon miệng' },
      { text: '天气 (tiānqì - Thời tiết)', pinyin: 'Tiānqì', translation: 'Thời tiết' },
      { text: '东西 (dōngxi - Đồ vật)', pinyin: 'Dōngxi', translation: 'Đồ đạc' }
    ],
    correct_option_index: 0,
    explanation: 'Tính từ đi kèm miêu tả món ăn (菜 - cài) là 好吃 (hǎochī - ngon miệng).',
    points: 10
  },
  {
    id: 'q-hsk1-02-06',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 2,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '选词填空：下午我想去商场______衣服。',
    pinyin: 'Xuǎncí tiánkòng: Xiàwǔ wǒ xiǎng qù shāngchǎng ______ yīfu.',
    translation: 'Điền từ vào chỗ trống: Chiều nay tôi muốn đến trung tâm thương mại ______ quần áo.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '买 (mǎi - Mua)', pinyin: 'Mǎi', translation: 'Mua sắm' },
      { text: '读 (dú - Đọc)', pinyin: 'Dú', translation: 'Đọc' },
      { text: '坐 (zuò - Ngồi)', pinyin: 'Zuò', translation: 'Ngồi' }
    ],
    correct_option_index: 0,
    explanation: 'Động từ phù hợp đi cùng tân ngữ "quần áo" (衣服) tại trung tâm thương mại là 买 (mǎi - mua).',
    points: 10
  },
  {
    id: 'q-hsk1-02-07',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 2,
    question_number: 7,
    question_type: 'multiple_choice',
    prompt: '选词填空：他在学校的图书馆里______呢。',
    pinyin: 'Xuǎncí tiánkòng: Tā zài xuéxiào de túshūguǎn lǐ ______ ne.',
    translation: 'Điền từ vào chỗ trống: Anh ấy đang ở trong thư viện của trường ______ đấy.',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '看书 (kàn shū - Đọc sách)', pinyin: 'Kàn shū', translation: 'Đọc sách' },
      { text: '开车 (kāi chē - Lái xe)', pinyin: 'Kāi chē', translation: 'Lái xe' },
      { text: '做饭 (zuò fàn - Nấu ăn)', pinyin: 'Zuò fàn', translation: 'Nấu cơm' }
    ],
    correct_option_index: 0,
    explanation: 'Nơi chốn là "thư viện" (图书馆), hành động logic tương ứng là 看书 (kàn shū - đọc sách).',
    points: 10
  },
  {
    id: 'q-hsk1-02-08',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 3,
    question_number: 8,
    question_type: 'multiple_choice',
    prompt: '阅读第三部分：问答配对：问："你叫什么名字？" —— 答：',
    pinyin: 'Yuèdú dì-sān bùfen: Wèndá pèiduì: Wèn: "Nǐ jiào shénme míngzi?" —— Dá:',
    translation: 'Đọc hiểu Phần 3: Ghép cặp hỏi - đáp: Hỏi: "Bạn tên là gì?" —— Đáp:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '我叫李明。(Wǒ jiào Lǐ Míng.)', pinyin: 'Wǒ jiào Lǐ Míng.', translation: 'Tôi tên là Lý Minh.' },
      { text: '我是越南人。(Wǒ shì Yuènán rén.)', pinyin: 'Wǒ shì Yuènán rén.', translation: 'Tôi là người Việt Nam.' },
      { text: '我二十岁。(Wǒ èrshí suì.)', pinyin: 'Wǒ èrshí suì.', translation: 'Tôi hai mươi tuổi.' }
    ],
    correct_option_index: 0,
    explanation: 'Câu hỏi về tên họ (叫什么名字) phải được trả lời bằng mẫu câu xưng tên: "我叫 + Tên" (Tôi tên là Lý Minh).',
    points: 10
  },
  {
    id: 'q-hsk1-02-09',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 3,
    question_number: 9,
    question_type: 'multiple_choice',
    prompt: '问答配对：问："这本书多少钱？" —— 答：',
    pinyin: 'Wèndá pèiduì: Wèn: "Zhè běn shū duōshao qián?" —— Dá:',
    translation: 'Ghép cặp hỏi - đáp: Hỏi: "Quyển sách này bao nhiêu tiền?" —— Đáp:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '十五块钱。(Shíwǔ kuài qián.)', pinyin: 'Shíwǔ kuài qián.', translation: 'Mười lăm tệ.' },
      { text: '下午三点。(Xiàwǔ sān diǎn.)', pinyin: 'Xiàwǔ sān diǎn.', translation: 'Ba giờ chiều.' },
      { text: '不客气。(Bú kèqi.)', pinyin: 'Bú kèqi.', translation: 'Không có chi.' }
    ],
    correct_option_index: 0,
    explanation: 'Câu hỏi giá tiền (多少钱) được hồi đáp bằng số tiền kèm đơn vị tiền tệ: "15块钱" (15 tệ).',
    points: 10
  },
  {
    id: 'q-hsk1-02-10',
    exam_id: 'hsk1-reading-02',
    part_type: 'reading',
    part_number: 3,
    question_number: 10,
    question_type: 'multiple_choice',
    prompt: '问答配对：问："你妈妈在医院工作吗？" —— 答：',
    pinyin: 'Wèndá pèiduì: Wèn: "Nǐ māma zài yīyuàn gōngzuò ma?" —— Dá:',
    translation: 'Ghép cặp hỏi - đáp: Hỏi: "Mẹ bạn làm việc ở bệnh viện phải không?" —— Đáp:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '是的，她是医生。(Shì de, tā shì yīshēng.)', pinyin: 'Shì de, tā shì yīshēng.', translation: 'Vâng, mẹ tôi là bác sĩ.' },
      { text: '她喜欢吃水果。(Tā xǐhuan chī shuǐguǒ.)', pinyin: 'Tā xǐhuan chī shuǐguǒ.', translation: 'Mẹ thích ăn hoa quả.' },
      { text: '明天见。(Míngtiān jiàn.)', pinyin: 'Míngtiān jiàn.', translation: 'Ngày mai gặp lại.' }
    ],
    correct_option_index: 0,
    explanation: 'Câu hỏi nghi vấn nghề nghiệp/nơi làm việc ở bệnh viện (在医院工作吗), câu trả lời khẳng định: "是的，她是医生" (Vâng, mẹ là bác sĩ).',
    points: 10
  },

  // =========================================================================
  // EXAM: hsk2-listening-02 (Đề Luyện Nghe Hiểu Phản Xạ Nhanh HSK 2 - 10 câu)
  // =========================================================================
  {
    id: 'q-hsk2-02-01',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听录音，判断天气情况：',
    pinyin: 'Tīng lùyīn, pànduàn tiānqì qíngkuàng:',
    translation: 'Nghe đoạn ghi âm, chọn tình hình thời tiết tương ứng:',
    audio_url: '',
    audio_script: '外面下大雨了，你出门别忘了带雨伞。',
    options: [
      { text: '下雨 (xiàyǔ - Trời mưa)', pinyin: 'Xiàyǔ', translation: 'Trời mưa lớn' },
      { text: '晴天 (qíngtiān - Trời nắng)', pinyin: 'Qíngtiān', translation: 'Trời nắng ráo' },
      { text: '刮风 (guāfēng - Nổi gió)', pinyin: 'Guāfēng', translation: 'Gió to' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại phát thanh: "外面下大雨了，你出门别忘了带雨伞" (Bên ngoài mưa to rồi, bạn ra ngoài đừng quên mang theo ô). Thời tiết là 下雨.',
    points: 10
  },
  {
    id: 'q-hsk2-02-02',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 1,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听对话，判断他们在哪儿：',
    pinyin: 'Tīng duìhuà, pànduàn tāmen zài nǎr:',
    translation: 'Nghe đoạn hội thoại, xác định nơi chốn của các nhân vật:',
    audio_url: '',
    audio_script: '服务员，请给我们来两杯热咖啡和一份牛肉面。好的，请稍等。',
    options: [
      { text: '餐馆/咖啡厅 (Nhà hàng / Quán cà phê)', pinyin: 'Cānguǎn / Kāfēitīng', translation: 'Nhà hàng / Quán cà phê' },
      { text: '火车站 (Ga tàu hỏa)', pinyin: 'Huǒchēzhàn', translation: 'Nhà ga tàu hỏa' },
      { text: '电影院 (Rạp chiếu phim)', pinyin: 'Diànyǐngyuàn', translation: 'Rạp chiếu phim' }
    ],
    correct_option_index: 0,
    explanation: 'Từ khóa "服务员" (phục vụ), "热咖啡" (cà phê nóng) và "牛肉面" (mì bò) cho thấy bối cảnh diễn ra tại quán ăn / nhà hàng.',
    points: 10
  },
  {
    id: 'q-hsk2-02-03',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '听录音，判断人物状态：',
    pinyin: 'Tīng lùyīn, pànduàn rénwù zhuàngtài:',
    translation: 'Nghe đoạn ghi âm, xác định tình trạng của nhân vật:',
    audio_url: '',
    audio_script: '我今天身体很不舒服，发烧了，要去医院看医生。',
    options: [
      { text: '生病了 (shēngbìng le - Bị ốm/sốt)', pinyin: 'Shēngbìng le', translation: 'Bị ốm, sốt' },
      { text: '很高兴 (hěn gāoxìng - Rất vui)', pinyin: 'Hěn gāoxìng', translation: 'Rất vui vẻ' },
      { text: '去旅游 (qù lǚyóu - Đi du lịch)', pinyin: 'Qù lǚyóu', translation: 'Đi du lịch' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại: "身体很不舒服，发烧了" (trong người rất khó chịu, bị sốt rồi). Tình trạng nhân vật là bị ốm.',
    points: 10
  },
  {
    id: 'q-hsk2-02-04',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 1,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '听录音，选择交通方式：',
    pinyin: 'Tīng lùyīn, xuǎnzé jiāotōng fāngshì:',
    translation: 'Nghe đoạn ghi âm, chọn phương tiện giao thông được nhắc tới:',
    audio_url: '',
    audio_script: '从我们学校到机场，坐出租车大约需要四十分钟。',
    options: [
      { text: '出租车 (chūzūchē - Xe taxi)', pinyin: 'Chūzūchē', translation: 'Đi xe taxi' },
      { text: '公共汽车 (gōnggòng qìchē - Xe buýt)', pinyin: 'Gōnggòng qìchē', translation: 'Đi xe buýt' },
      { text: '自行车 (zìxíngchē - Xe đạp)', pinyin: 'Zìxíngchē', translation: 'Đi xe đạp' }
    ],
    correct_option_index: 0,
    explanation: 'Lời thoại nói rõ: "坐出租车大约需要四十分钟" (Đi taxi mất khoảng 40 phút). Phương tiện là 出租车.',
    points: 10
  },
  {
    id: 'q-hsk2-02-05',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 2,
    question_number: 5,
    question_type: 'multiple_choice',
    prompt: '听对话，选择商品现在的折后价格：',
    pinyin: 'Tīng duìhuà, xuǎnzé shāngpǐn xiànzài de zhéhòu jiàgé:',
    translation: 'Nghe đối thoại, chọn giá tiền đã giảm giá hôm nay:',
    audio_url: '',
    audio_script: '男：这件红色的衣服真好看，多少钱？女：原价三百块，今天打折只要两百块。问：这件衣服今天卖多少钱？',
    options: [
      { text: '两百块 (200 tệ)', pinyin: 'Liǎng bǎi kuài', translation: '200 tệ' },
      { text: '三百块 (300 tệ)', pinyin: 'Sān bǎi kuài', translation: '300 tệ' },
      { text: '一百块 (100 tệ)', pinyin: 'Yī bǎi kuài', translation: '100 tệ' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ trả lời: "今天打折只要两百块" (Hôm nay giảm giá chỉ cần 200 tệ). Giá tiền hôm nay là 200 tệ.',
    points: 10
  },
  {
    id: 'q-hsk2-02-06',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 2,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '听对话，选择开会的时间：',
    pinyin: 'Tīng duìhuà, xuǎnzé kāihuì de shíjiān:',
    translation: 'Nghe đoạn hội thoại, xác định giờ giấc cuộc họp:',
    audio_url: '',
    audio_script: '女：喂，王经理，明天下午两点开会可以吗？男：好的，没问题，在三楼会议室见。问：他们明天几点开会？',
    options: [
      { text: '下午两点 (2 giờ chiều)', pinyin: 'Xiàwǔ liǎng diǎn', translation: '14:00 chiều' },
      { text: '上午十点 (10 giờ sáng)', pinyin: 'Shàngwǔ shí diǎn', translation: '10:00 sáng' },
      { text: '下午四点 (4 giờ chiều)', pinyin: 'Xiàwǔ sì diǎn', translation: '16:00 chiều' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ hẹn: "明天下午两点开会可以吗？" (Ngày mai 2 giờ chiều họp được không?). Giờ họp là 下午两点.',
    points: 10
  },
  {
    id: 'q-hsk2-02-07',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 2,
    question_number: 7,
    question_type: 'multiple_choice',
    prompt: '听对话，判断女的每天早上的习惯：',
    pinyin: 'Tīng duìhuà, pànduàn nǚ de měitiān zǎoshang de xíguàn:',
    translation: 'Nghe đối thoại, xác định thói quen buổi sáng của người nữ:',
    audio_url: '',
    audio_script: '男：你平时喜欢做什么运动？女：我每天早上都去公园跑步半小时。问：女的每天早上做什么？',
    options: [
      { text: '跑步 (pǎobù - Chạy bộ)', pinyin: 'Pǎobù', translation: 'Chạy bộ tập thể dục' },
      { text: '游泳 (yóuyǒng - Bơi lội)', pinyin: 'Yóuyǒng', translation: 'Bơi lội' },
      { text: '跳舞 (tiàowǔ - Khiêu vũ)', pinyin: 'Tiàowǔ', translation: 'Nhảy múa' }
    ],
    correct_option_index: 0,
    explanation: 'Người nữ trả lời: "我每天早上都去公园跑步半小时" (Mỗi sáng tôi đều đến công viên chạy bộ nửa tiếng). Hoạt động là 跑步.',
    points: 10
  },
  {
    id: 'q-hsk2-02-08',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 3,
    question_number: 8,
    question_type: 'multiple_choice',
    prompt: '听短文，选择关于张先生的正确描述：',
    pinyin: 'Tīng duǎnwén, xuǎnzé guānyú Zhāng xiānsheng de zhèngquè miáoshù:',
    translation: 'Nghe đoạn văn ngắn, chọn mô tả chính xác về ông Trương:',
    audio_url: '',
    audio_script: '张先生在北京工作了五年，他非常喜欢吃中国菜，汉语也说得非常流利。问：张先生在北京工作了几年？',
    options: [
      { text: '五年 (wǔ nián - 5 năm)', pinyin: 'Wǔ nián', translation: 'Năm năm' },
      { text: '三年 (sān nián - 3 năm)', pinyin: 'Sān nián', translation: 'Ba năm' },
      { text: '八年 (bā nián - 8 năm)', pinyin: 'Bā nián', translation: 'Tám năm' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn nêu rõ: "张先生在北京工作了五年" (Ông Trương làm việc ở Bắc Kinh được 5 năm). Đáp án là 5 năm.',
    points: 10
  },
  {
    id: 'q-hsk2-02-09',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 3,
    question_number: 9,
    question_type: 'multiple_choice',
    prompt: '听短文，选择迟到的原因：',
    pinyin: 'Tīng duǎnwén, xuǎnzé chídào de yuányīn:',
    translation: 'Nghe đoạn văn, xác định lý do suýt đi học muộn:',
    audio_url: '',
    audio_script: '昨天晚上我复习功课到深夜十二点，太累了，所以今天早晨闹钟响了都没听见，差点儿迟到了。问：他为什么差点儿迟到？',
    options: [
      { text: '昨晚复习睡得太晚 (Tối qua học bài ngủ muộn)', pinyin: 'Zuówǎn fùxí shuì de tài wǎn', translation: 'Ngủ muộn do ôn bài' },
      { text: '路上堵车 (Lùshang dǔchē - Kẹt xe)', pinyin: 'Lùshang dǔchē', translation: 'Đường bị tắc' },
      { text: '生病发烧 (Bị ốm sốt)', pinyin: 'Shēngbìng fāshāo', translation: 'Bị sốt' }
    ],
    correct_option_index: 0,
    explanation: 'Người nói giải thích nguyên nhân: "昨天晚上我复习功课到深夜十二点，太累了..." (Tối qua ôn bài đến 12h đêm, mệt quá). Lý do là ngủ muộn.',
    points: 10
  },
  {
    id: 'q-hsk2-02-10',
    exam_id: 'hsk2-listening-02',
    part_type: 'listening',
    part_number: 3,
    question_number: 10,
    question_type: 'multiple_choice',
    prompt: '听短文，选择说话人的主要态度：',
    pinyin: 'Tīng duǎnwén, xuǎnzé shuōhuà rén de zhǔyào tàidu:',
    translation: 'Nghe đoạn văn, xác định ý chính của người nói:',
    audio_url: '',
    audio_script: '学汉语虽然一开始觉得有点儿难，但是只要我们每天坚持大声朗读，就一定能学好。问：说话人认为学好汉语的关键是什么？',
    options: [
      { text: '每天坚持练习 (Kiên trì luyện tập mỗi ngày)', pinyin: 'Měitiān jiānchí liànxí', translation: 'Kiên trì mỗi ngày' },
      { text: '不需要背生词 (Không cần học từ vựng)', pinyin: 'Bù xūyào bèi shēngcí', translation: 'Không cần học từ' },
      { text: '只听不说 (Chỉ nghe không cần nói)', pinyin: 'Zhǐ tīng bù shuō', translation: 'Chỉ nghe' }
    ],
    correct_option_index: 0,
    explanation: 'Lời khuyên then chốt trong bài: "只要我们每天坚持大声朗读，就一定能学好" (Chỉ cần mỗi ngày kiên trì đọc to thì nhất định sẽ học giỏi). Bí quyết là kiên trì luyện tập mỗi ngày.',
    points: 10
  },
  // ==========================================
  // EXAM: hsk5-mock-01 (6 câu mô phỏng HSK 5)
  // ==========================================
  {
    id: 'q-hsk5-01-01',
    exam_id: 'hsk5-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听对话，选择最符合内容的选项：',
    pinyin: 'Tīng duìhuà, xuǎnzé zuì fúhé nèiróng de xuǎnxiàng:',
    translation: 'Nghe hội thoại, chọn đáp án phù hợp nhất với nội dung:',
    audio_url: '',
    audio_script: '女：李总，关于这次跨国并购案，对方财务顾问提出了几项附带条款，似乎在估值上还有分歧。\n男：我们必须坚持审慎原则。你立刻组织法律和审计团队，对他们的核心专利资产重新进行全面尽职调查。\n问：男的主要要求女的做什么？',
    options: [
      { text: '重新对对方核心专利进行尽职调查 (Tái thẩm định độc lập bằng sáng chế cốt lõi)', pinyin: 'Chóngxīn duì duìfāng héxīn zhuānlì jìnxíng jìnzhí diàochá', translation: 'Thẩm định tài sản trí tuệ' },
      { text: '立即答应对方提出的估值要求 (Lập tức đồng ý định giá của đối tác)', pinyin: 'Lìjí dāyìng duìfāng tíchū de gūzhí yāoqiú', translation: 'Đồng ý định giá' },
      { text: '终止所有商务合作谈判 (Chấm dứt đàm phán hợp tác)', pinyin: 'Zhōngzhǐ suǒyǒu shāngwù hézuò tánpàn', translation: 'Chấm dứt đàm phán' },
      { text: '解散法务与审计团队 (Giải tán đội ngũ pháp lý)', pinyin: 'Jiěsàn fǎwù yǔ shěnjì tuánduì', translation: 'Giải tán nhóm pháp lý' }
    ],
    correct_option_index: 0,
    explanation: 'Người nam nói: "我们必须坚持审慎原则。你立刻组织法律和审计团队，对他们的核心专利资产重新进行全面尽职调查。" Do đó đáp án chính xác là tiến hành thẩm định chuyên sâu (尽职调查).',
    points: 15
  },
  {
    id: 'q-hsk5-01-02',
    exam_id: 'hsk5-mock-01',
    part_type: 'listening',
    part_number: 2,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听短文，判断讲话者的主要观点：',
    pinyin: 'Tīng duǎnwén, pànduàn jiǎnghuà zhě de zhǔyào guāndiǎn:',
    translation: 'Nghe bài phát biểu, xác định quan điểm chủ đạo của diễn giả:',
    audio_url: '',
    audio_script: '心理学研究表明，拖延症的本质并非时间管理能力欠缺，而往往是情绪调节困难的体现。当面对一项令人生畏的任务时，大脑本能地逃避当下的焦虑，转而寻求即时满足。因此，克服拖延的关键不是制定更密集的计划，而是学会接纳负面情绪并把任务分解至微不足道的行动。\n问：根据短文，克服拖延的关键是什么？',
    options: [
      { text: '接纳负面情绪并拆解微小行动 (Chấp nhận cảm xúc tiêu cực và chia nhỏ hành động)', pinyin: 'Jiēnà fùmiàn qíngxù bìng chāijiě wēixiǎo xíngdòng', translation: 'Tiếp nhận cảm xúc và chia nhỏ nhiệm vụ' },
      { text: '制定更加严密繁重的时间表 (Lập thời gian biểu khắt khe hơn nữa)', pinyin: 'Zhìdìng gèngjiā yánmì fánzhòng de shíjiānbiǎo', translation: 'Thời gian biểu khắt khe' },
      { text: '完全逃避令人焦虑的任务 (Trốn tránh hoàn toàn nhiệm vụ)', pinyin: 'Wánquán táobì lìngrén jiāolǜ de rènwu', translation: 'Trốn tránh áp lực' },
      { text: '随时寻求即时的感官满足 (Luôn tìm kiếm thỏa mãn tức thời)', pinyin: 'Suíshí xúnqiú jíshí de gǎnguān mǎnzú', translation: 'Thỏa mãn tức thời' }
    ],
    correct_option_index: 0,
    explanation: 'Câu kết đoạn khẳng định: "克服拖延的关键不是制定更密集的计划，而是学会接纳负面情绪并把任务分解至微不足道的行动。"',
    points: 15
  },
  {
    id: 'q-hsk5-01-03',
    exam_id: 'hsk5-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '选词填空：选择最恰当的一组词语填入空格：',
    pinyin: 'Xuǎncí tiánkòng: Xuǎnzé zuì qiàdàng de yì zǔ cíyǔ tiánrù kònggé:',
    translation: 'Chọn từ điền chỗ trống thích hợp nhất:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '推卸 —— 忽视 —— 迫在眉睫 (Thoái thác — Coi nhẹ — Cấp bách ngay trước mắt)', pinyin: 'tuīxiè — hūshì — pòzàiméijié', translation: 'Đẩy trách nhiệm — ngó lơ — cấp bách' },
      { text: '承担 —— 重视 —— 息息相关 (Đảm đương — Coi trọng — Gắn bó mật thiết)', pinyin: 'chéngdān — zhòngshì — xīxīxiāngguān', translation: 'Gánh vác — coi trọng — liên quan mật thiết' },
      { text: '逃避 —— 抵触 —— 漫不经心 (Trốn tránh — Xung đột — Vô tâm)', pinyin: 'táobì — dǐchù — mànbùjīngxīn', translation: 'Trốn tránh — đối kháng — hờ hững' },
      { text: '放弃 —— 观察 —— 井井有条 (Từ bỏ — Quan sát — Ngăn nắp trật tự)', pinyin: 'fàngqì — guānchá — jǐngjǐngyǒutiáo', translation: 'Bỏ cuộc — quan sát — trật tự' }
    ],
    correct_option_index: 1,
    explanation: 'Văn cảnh bảo vệ môi trường: Doanh nghiệp cần [承担] trách nhiệm xã hội, [重视] phát triển bền vững vì tương lai nhân loại [息息相关] (liên quan mật thiết). Nhóm từ B mang tính học thuật và tương thích ngữ nghĩa chặt chẽ.',
    points: 15
  },
  {
    id: 'q-hsk5-01-04',
    exam_id: 'hsk5-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '阅读短文回答问题：作者对“失败”持何种态度？',
    pinyin: 'Yuèdú duǎnwén huídá wèntí: Zuòzhě duì “shībài” chí hézhǒng tàidu?',
    translation: 'Đọc đoạn văn và trả lời câu hỏi: Tác giả có thái độ như thế nào đối với "thất bại"?',
    audio_url: '',
    audio_script: '真正的探索者从不把失败视为终点，而将其视作排除错误路径的宝贵数据。在科学史上，无数突破性的发现恰恰诞生于对异常结果的重新审视。如果一味回避错误，创新的火花也将随之熄灭。',
    options: [
      { text: '失败是修正方向与激发创新的必要财富 (Thất bại là tài sản cần thiết để sửa hướng và khơi nguồn đổi mới)', pinyin: 'Shībài shì xiūzhèng fāngxiàng yǔ jīfā chuàngxīn de bìyào cáifù', translation: 'Thất bại là tài sản' },
      { text: '失败意味着彻底的无能与资源的浪费 (Thất bại đồng nghĩa với bất tài và lãng phí)', pinyin: 'Shībài yìwèizhe chèdǐ de wúnéng yǔ zīyuán de làngfèi', translation: 'Thất bại là bất tài' },
      { text: '应当竭尽全力隐瞒并避免一切错误 (Nên cố gắng che giấu sai sót)', pinyin: 'Yīngdāng jiéjìn quánlì yǐnmán bìng bìmiǎn yíqiè cuòwù', translation: 'Che giấu lỗi' },
      { text: '异常结果毫无科学探讨价值 (Kết quả dị thường không có giá trị)', pinyin: 'Yìcháng jiéguǒ háowú kēxué tàntǎo jiàzhí', translation: 'Không có giá trị' }
    ],
    correct_option_index: 0,
    explanation: 'Tác giả xem thất bại là "排除错误路径的宝贵数据" và là tiền đề cho "突破性的发现", do đó thái độ là xem thất bại như tài sản kích hoạt sáng tạo.',
    points: 15
  },
  {
    id: 'q-hsk5-01-05',
    exam_id: 'hsk5-mock-01',
    part_type: 'writing',
    part_number: 1,
    question_number: 5,
    question_type: 'ordering',
    prompt: '书写第一部分：连词成句（请排出正确的语序）：',
    pinyin: 'Shūxiě dì-yī bùfen: Lián cí chéng jù (Qǐng pǎi chū zhèngquè de yǔxù):',
    translation: 'Phần Viết 1: Sắp xếp các cụm từ thành câu hoàn chỉnh đúng ngữ pháp:',
    audio_url: '',
    audio_script: '',
    words: ['这场辩论赛', '双方辩手', '出色的表现', '充分展现了', '敏捷的思维'],
    options: [
      { text: '这场辩论赛 充分展现了 双方辩手 敏捷的思维 出色的表现', pinyin: '', translation: '' },
      { text: '双方辩手 出色的表现 充分展现了 这场辩论赛 敏捷的思维', pinyin: '', translation: '' },
      { text: '这场辩论赛 双方辩手的出色表现 充分展现了 敏捷的思维 (Cú pháp chuẩn)', pinyin: 'Zhè chǎng biànlùnsài shuāngfāng biànshǒu de chūsè biǎoxiàn chōngfèn zhǎnxiàn le mǐnjié de sīwéi', translation: 'Trận tranh biện đã thể hiện xuất sắc tư duy nhạy bén của các bên' },
      { text: '敏捷的思维 这场辩论赛 充分展现了 双方辩手', pinyin: '', translation: '' }
    ],
    correct_option_index: 2,
    explanation: 'Cấu trúc câu phức HSK 5: Định ngữ chỉ phạm vi [这场辩论赛] + Cụm chủ ngữ [双方辩手的出色表现] + Phó từ bổ nghĩa vị ngữ [充分展现了] + Tân ngữ [敏捷的思维].',
    points: 20
  },
  {
    id: 'q-hsk5-01-06',
    exam_id: 'hsk5-mock-01',
    part_type: 'writing',
    part_number: 2,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '书写第二部分：结合给出的5个词语，选择最通顺且切题的80字短文段落：\n词语：[契约、诚信、合作、长远、共赢]',
    pinyin: 'Shūxiě dì-èr bùfen: Jiéhé gěichū de 5 gè cíyǔ, xuǎnzé zuì tōngshùn qiě qiètí de 80 zì duǎnwén duànluò: [Qìyuē, chéngxìn, hézuò, chángyuǎn, gòngyíng]',
    translation: 'Phần Viết 2: Kết hợp 5 từ khóa [Khế ước, Thành tín, Hợp tác, Lâu dài, Cùng thắng], chọn đoạn văn viết chuẩn mực nhất:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '在商业往来中，严谨的契约精神与立足诚信的品格是建立深度合作的基础。唯有放下眼前短期私利，放眼长远发展，双方才能真正实现互利共赢的稳固局面。', pinyin: 'Zài shāngyè wǎnglái zhōng, yánjǐn de qìyuē jīngshén...', translation: 'Vận dụng chuẩn xác cả 5 từ khóa trong văn phong nghị luận thương mại.' },
      { text: '我今天去买东西，没有契约也没有诚信，合作很不开心，以后不能长远，也不能共赢。', pinyin: 'Wǒ jīntiān qù mǎi dōngxi...', translation: 'Văn phong khẩu ngữ thô sơ, không đạt chuẩn HSK 5.' },
      { text: '契约是纸张，诚信是说话，合作是两个人，长远是时间，共赢是大家赢。', pinyin: 'Qìyuē shì zhǐzhāng...', translation: 'Giải nghĩa từ vụn vặt, thiếu tính kết nối đoạn văn.' },
      { text: '由于没有钱，所以我们无法合作，契约也失效了。', pinyin: 'Yóuyú méiyǒu qián...', translation: 'Thiếu từ khóa và lạc đề.' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn A liên kết mượt mà cả 5 từ khóa [契约、诚信、合作、长远、共赢] bằng cấu trúc nghị luận: "在...中，...是...基础。唯有...，才能...". Đạt chuẩn mực tối đa của bài viết 80 chữ HSK 5.',
    points: 20
  },

  // ==========================================
  // EXAM: hsk6-mock-01 (6 câu đỉnh phong HSK 6)
  // ==========================================
  {
    id: 'q-hsk6-01-01',
    exam_id: 'hsk6-mock-01',
    part_type: 'listening',
    part_number: 1,
    question_number: 1,
    question_type: 'multiple_choice',
    prompt: '听高端访谈录音，选择核心主旨：',
    pinyin: 'Tīng gāoduān fǎngtán lùyīn, xuǎnzé héxīn zhǔzhǐ:',
    translation: 'Nghe đoạn phỏng vấn chuyên gia, chọn thông điệp cốt lõi:',
    audio_url: '',
    audio_script: '主持人：面对新一代生成式人工智能的爆发式增长，您如何评估它对传统产业劳动力生态的重塑？\n学者：技术的迭代固然会淘汰一部分程序化、机械性的岗位，但这并不意味着人类劳动价值的贬损。恰恰相反，它迫使教育体系与职业培训向审辩式思维、审美鉴赏力以及复杂人文共情等深层素养转型。未来的核心竞争力绝非与算法比拼算力，而在于人机协同中对价值尺度的终极把控。\n问：学者认为未来人类的核心竞争力是什么？',
    options: [
      { text: '人机协同中对价值尺度的终极把控 (Khả năng kiểm soát chuẩn mực giá trị trong tương tác người - máy)', pinyin: 'Rén-jī xiétóng zhōng duì jiàzhí chǐdù de zhōngjí bǎkòng', translation: 'Kiểm soát chuẩn mực giá trị' },
      { text: '在计算速度和记忆力上全面超越算法 (Vượt qua thuật toán về tốc độ và ghi nhớ)', pinyin: 'Zài jìsuàn sùdù hé jìyìlì shàng quánmiàn chāoyuè suànfǎ', translation: 'Cạnh tranh máy móc' },
      { text: '彻底抵制并禁止人工智能进入传统产业 (Tẩy chay trí tuệ nhân tạo)', pinyin: 'Chèdǐ dǐzhì bìng jìnzhǐ réngōng zhìnéng jìnrù chuántǒng chǎnyè', translation: 'Tẩy chay AI' },
      { text: '保留所有机械性与程序化的初级工作 (Duy trì công việc rập khuôn)', pinyin: 'Bǎoliú suǒyǒu jīxièxìng yǔ chéngxùhuà de chūjí gōngzuò', translation: 'Giữ việc cơ bản' }
    ],
    correct_option_index: 0,
    explanation: 'Học giả kết luận: "未来的核心竞争力绝非与算法比拼算力，而在于人机协同中对价值尺度的终极把控。" Đáp án A thể hiện chính xác bản chất.',
    points: 15
  },
  {
    id: 'q-hsk6-01-02',
    exam_id: 'hsk6-mock-01',
    part_type: 'listening',
    part_number: 2,
    question_number: 2,
    question_type: 'multiple_choice',
    prompt: '听学术报告短文，选出理解正确的一项：',
    pinyin: 'Tīng xuéshù bàogào duǎnwén, xuǎn chū lǐjiě zhèngquè de yí xiàng:',
    translation: 'Nghe báo cáo học thuật, chọn nhận định chính xác:',
    audio_url: '',
    audio_script: '深海热泉生态系统的发现彻底颠覆了以往生命完全依赖光合作用的经典假说。在数千米漆黑、高压、富含硫化氢的极端海底环境中，化能合成细菌构成了初级生产力，支撑起繁荣独特的化能自养生物圈。这不仅拓宽了生物圈的物理边界，更为地外天体如木卫二、土卫二是否存在生命提供了关键的地缘比对样本。\n问：深海热泉生态系统带来的重大科学启示是什么？',
    options: [
      { text: '颠覆了生命全凭光合作用的传统假说，为地外生命探测提供理论支撑 (Lật đổ định kiến quang hợp độc tôn, mở ra cơ sở tìm kiếm sự sống ngoài vũ trụ)', pinyin: 'Diānfù le shēngmìng quán píng guānghé zuòyòng de chuántǒng jiǎshuō...', translation: 'Chứng minh hóa năng tự dưỡng' },
      { text: '证明深海极端环境没有任何生物生存 (Chứng minh đáy biển không có sự sống)', pinyin: 'Zhèngmíng shēnhǎi jíduān huánjìng méiyǒu rènhé shēngwù shēngcún', translation: 'Vô sinh quyển' },
      { text: '所有地球生物都必须依赖硫化氢生存 (Tất cả sinh vật đều cần H2S)', pinyin: 'Suǒyǒu dìqiú shēngwù dōu bìxū yīlài liúhuàqīng shēngcún', translation: 'Bắt buộc H2S' },
      { text: '木卫二的环境与地球热带雨林完全相同 (Môi trường Europa giống rừng nhiệt đới)', pinyin: 'Mùwèi èr de huánjìng yǔ dìqiú rèdài yǔlín wánquán xiāngtóng', translation: 'Giống rừng rậm' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn nhấn mạnh hai hệ quả: 颠覆了以往生命完全依赖光合作用的经典假说 và 为地外天体是否存在生命提供了关键的地缘比对样本.',
    points: 15
  },
  {
    id: 'q-hsk6-01-03',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 1,
    question_number: 3,
    question_type: 'multiple_choice',
    prompt: '【HSK 6 特色题型：找病句】下列句子中，有语病的一句是：',
    pinyin: '【HSK 6 tèsè tíxíng: Zhǎo bìngjù】Xiàliè jùzi zhōng, yǒu yǔbìng de yí jù shì:',
    translation: '【Dạng bài đặc trưng HSK 6: Tìm câu có lỗi ngữ pháp】Trong các câu sau, câu nào mắc lỗi ngữ bệnh?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '经过几代科研工作者的艰苦攻关，使该型号超导量子芯片终于突破了关键技术瓶颈。 (Câu khuyết chủ ngữ do lạm dụng giới từ)', pinyin: 'Jīngguò jǐ dài kēyán gōngzuòzhě de jiānkǔ gōngguān, shǐ gāi xínghào...', translation: 'Mắc bệnh lạm dụng "经过...使..." làm triệt tiêu chủ ngữ thực của câu' },
      { text: '在数字经济迅猛发展的今天，数据要素对实体产业的赋能效应日益凸显。', pinyin: 'Zài shùzì jīngjì xùnměng fāzhǎn de jīntiān, shùjù yàosù duì shítǐ chǎnyè...', translation: 'Câu chuẩn xác cấu trúc và sắc thái nghĩa' },
      { text: '博大精深的中华传统文化，正以崭新的姿态融入当代青年群体的日常生活。', pinyin: 'Bódà jīngshēn de zhōnghuá chuántǒng wénhuà, zhèng yǐ zhǎnxīn de zītài...', translation: 'Câu chuẩn ngữ pháp' },
      { text: '能否健全生态补偿长效机制，是守护绿水青山、实现区域协同发展的制度基石。', pinyin: 'Néng fǒu jiànquán shēngtài bǔcháng chángxiào jīzhì...', translation: 'Cấu trúc đối ứng hai mặt chuẩn xác' }
    ],
    correct_option_index: 0,
    explanation: 'Câu A là dạng bệnh cú kinh điển nhất HSK 6: "Lạm dụng giới từ dẫn đến khuyết chủ ngữ" (介词滥用导致主语残缺). Dùng "经过...使...", cả hai vế đều biến thành trạng ngữ, khiến câu không còn chủ ngữ. Sửa đúng: Bỏ "使" để "该型号超导量子芯片" làm chủ ngữ chính của câu.',
    points: 15
  },
  {
    id: 'q-hsk6-01-04',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 2,
    question_number: 4,
    question_type: 'multiple_choice',
    prompt: '阅读学术评论，回答问题：文中的“和而不同”体现了何种哲学智慧？',
    pinyin: 'Yuèdú xuéshù pínglùn, huídá wèntí: Wénzhōng de “hé ér bù tóng” tǐxiàn le hézhǒng zhéxué zhìhuì?',
    translation: 'Đọc đoạn bình luận học thuật, giải nghĩa triết học của "Hòa nhi bất đồng" (和而不同):',
    audio_url: '',
    audio_script: '《论语》有云：“君子和而不同，小人同而不和。”所谓“和”，是在承认并尊重事物多样性与差异性的前提下，实现更高层面的动态和谐与互补协调；而“同”则是消解个性、强求划一的盲目顺从。“和而不同”不仅是中国古人处理人际关系的准则，更为当今跨文化交流与全球文明互鉴提供了超越冷战对抗思维的东方智慧。',
    options: [
      { text: '承认尊重差异多样性，在互补中追求动态和谐 (Tôn trọng dị biệt và đa nguyên, theo đuổi sự hài hòa phát triển tương hỗ)', pinyin: 'Chéngrèn zūnzhòng chāyì duōyàngxìng, zài hùbǔ zhōng zhuīqiú dòngtài héxié', translation: 'Tôn trọng sự đa dạng để hòa hợp' },
      { text: '强行抹杀所有不同声音，要求步调绝对统一 (Xóa bỏ mọi tiếng nói khác biệt để đồng nhất hóa)', pinyin: 'Qiángxíng mǒshā suǒyǒu bùtóng shēngyīn, yāoqiú bùdiào juéduì tǒngyī', translation: 'Cưỡng chế đồng nhất' },
      { text: '凡事盲目妥协奉承，缺乏独立人格 (Thỏa hiệp mù quáng thiếu nhân cách độc lập)', pinyin: 'Fánshì mángmù tuǒxié fèngcheng, quēfá dúlì réngé', translation: 'Thỏa hiệp vô nguyên tắc' },
      { text: '拒绝与任何不同观点的人产生交往 (Từ chối giao tiếp với người bất đồng chính kiến)', pinyin: 'Jùjué yǔ rènhé bùtóng guāndiǎn de rén chǎnshēng jiāowǎng', translation: 'Cô lập bài ngoại' }
    ],
    correct_option_index: 0,
    explanation: 'Đoạn văn phân tích rõ ràng: "所谓和，是在承认并尊重事物多样性与差异性的前提下，实现更高层面的动态和谐与互补协调".',
    points: 15
  },
  {
    id: 'q-hsk6-01-05',
    exam_id: 'hsk6-mock-01',
    part_type: 'reading',
    part_number: 3,
    question_number: 5,
    question_type: 'multiple_choice',
    prompt: '选词填空：选择最契合高级报刊政论语境的四字成语组合：',
    pinyin: 'Xuǎncí tiánkòng: Xuǎnzé zuì qìhé gāojí bàokān zhènglùn yǔjìng de sìzì chéngyǔ zǔhé:',
    translation: 'Chọn nhóm thành ngữ HSK 6 cao cấp thích hợp nhất với văn cảnh bình luận thời sự:',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '居安思危 —— 防微杜渐 —— 运筹帷幄 (Lo xa lúc an bình — Ngăn chặn từ mầm mống — Bày mưu tính kế điều binh)', pinyin: "jū'ānsīwēi — fángwēidùjiàn — yùnchóuwéiwò", translation: 'Thành ngữ tư duy chiến lược đỉnh cao' },
      { text: '自相矛盾 —— 掩耳盗铃 —— 画蛇添足 (Mâu thuẫn — Bịt tai trộm chuông — Vẽ rắn thêm chân)', pinyin: "zìxiāng máodùn — yǎn'ěrdàolíng — huàshétiānzú", translation: 'Thành ngữ tiêu cực chỉ sự vụng về' },
      { text: '朝三暮四 —— 走马观花 —— 井底之蛙 (Sáng ba chiều bốn — Cưỡi ngựa xem hoa — Ếch ngồi đáy giếng)', pinyin: 'zhāosānmùsì — zǒumǎguānhuā — jǐngdǐzhīwā', translation: 'Thành ngữ chỉ sự thiển cận' },
      { text: '南辕北辙 —— 守株待兔 —— 拔苗助长 (Trống đánh xuôi kèn thổi ngược — Ôm cây đợi thỏ — Đốt cháy giai đoạn)', pinyin: 'nányuánběizhé — shǒuzhūdàitù — bámiáozhùzhǎng', translation: 'Thành ngữ phản tác dụng' }
    ],
    correct_option_index: 0,
    explanation: 'Trong hoạch định chiến lược kinh tế vĩ mô và phòng ngừa rủi ro, tam tấu thành ngữ HSK 6 [居安思危、防微杜渐、运筹帷幄] là chuẩn mực văn phong cao cấp.',
    points: 20
  },
  {
    id: 'q-hsk6-01-06',
    exam_id: 'hsk6-mock-01',
    part_type: 'writing',
    part_number: 1,
    question_number: 6,
    question_type: 'multiple_choice',
    prompt: '【HSK 6 书写缩写要领】阅读1000字叙事文后进行400字缩写，以下哪项操作符合官方评分准则？',
    pinyin: '【HSK 6 Shūxiě suōxiě yàolǐng】Yuèdú 1000 zì xùshìwén hòu jìnxíng 400 zì suōxiě, yǐxià nǎ xiàng cāozuò fúhé guānfāng píngfēn zhǔnzé?',
    translation: '【Kỹ năng viết tóm tắt HSK 6】Khi tóm tắt văn bản 1000 chữ thành 400 chữ, thao tác nào dưới đây chuẩn xác theo tiêu chuẩn khảo thí?',
    audio_url: '',
    audio_script: '',
    options: [
      { text: '忠实于原文叙事主线与因果脉络，提炼核心事件，不得掺入个人主观评论 (Trung thực với mạch truyện và nhân quả nguyên tác, cô đọng biến cố cốt lõi, tuyệt đối KHÔNG lồng bình luận chủ quan cá nhân)', pinyin: 'Zhōngshí yú yuánwén xùshì zhǔxiàn...', translation: 'Quy tắc vàng tóm tắt văn bản HSK 6' },
      { text: '必须加入大量个人读后感和主观议论抒情 (Cần thêm nhiều cảm nghĩ và bình luận cá nhân)', pinyin: 'Bìxū jiārù dàliàng gèrén dúhòugǎn...', translation: 'Sai lầm làm trừ điểm nặng' },
      { text: '可以任意更改原著主角姓名和故事结局 (Có thể tự đổi kết thúc truyện)', pinyin: 'Kěyǐ rènyì gēnggǎi yuánzhù zhǔjiǎo xìngmíng...', translation: 'Xuyên tạc cốt truyện' },
      { text: '直接抄写原文前两段凑足400字 (Chép nguyên vẹn 2 đoạn đầu)', pinyin: 'Zhíjiē chāoxiě yuánwén qián liǎng duàn...', translation: 'Gian lận bị điểm liệt' }
    ],
    correct_option_index: 0,
    explanation: 'Tiêu chuẩn chấm thi Viết HSK 6: Đề bài yêu cầu "缩写" (tóm tắt khách quan). Thí sinh phải bảo lưu ngôi kể thứ 3, bám sát các sự kiện mấu chốt, tuyệt đối không được đưa quan điểm, cảm nhận cá nhân (không viết thành bài văn "读后感").',
    points: 20
  }
];

export const HSK_EXAMS = [...BASE_HSK_EXAMS, ...EXPANDED_MOCK_EXAMS];

// Các bộ đề đã được nâng cấp toàn diện quy chuẩn thi thật (40 câu, 35 câu, 30 câu...)
const REAL_SIMULATION_EXAM_IDS = new Set([
  'hsk1-mock-01',
  'hsk1-official-ref-01',
  'hsk2-mock-01',
  'hsk3-mock-01',
  'hsk4-mock-01',
  'hsk5-mock-01',
  'hsk6-mock-01'
]);

// Giữ lại các đề kỹ năng đơn lẻ như hsk1-reading-02, hsk2-listening-02
const curatedBaseQuestions = BASE_HSK_QUESTIONS.filter(q => !REAL_SIMULATION_EXAM_IDS.has(q.exam_id));

export const HSK_QUESTIONS = [
  ...REAL_SIMULATION_QUESTIONS,
  ...curatedBaseQuestions,
  ...EXPANDED_MOCK_QUESTIONS
];

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
      section: q.section || q.part_type || 'reading',
      part_type: q.part_type || q.section || 'reading',
      part_number: q.part_number || 1,
      question_number: q.question_number || 1,
      question_type: q.question_type || q.questionType || 'multiple_choice',
      questionType: q.questionType || q.question_type || 'multiple_choice',
      prompt: q.prompt,
      pinyin: q.pinyin,
      translation: q.translation,
      audio_url: q.audio_url || q.audioUrl || '',
      audioUrl: q.audioUrl || q.audio_url || '',
      audio_script: q.audio_script || q.audioScript || '',
      audioScript: q.audioScript || q.audio_script || '',
      options: q.options || [],
      words: q.words || q.scrambledWords || [],
      scrambledWords: q.scrambledWords || q.words || [],
      writing_criteria: q.writing_criteria || [],
      min_words: q.min_words || 0,
      max_words: q.max_words || 0,
      is_subjective: !!q.is_subjective,
      points: q.points || 10,
      relatedVocab: q.relatedVocab || []
      // BẢO MẬT TUYỆT ĐỐI: Không bao gồm correct_option_index, correct_order, accepted_answers, sample_answer và explanation ở đây!
    }));
  return { ...exam, questions };
}


