// Comprehensive builder for all 60 curriculum lessons (HSK 1-3)
// Direct alignment with docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
import fs from 'fs';
import path from 'path';

// Master lesson definitions catalog
const LESSONS = [];

// Helper to add lesson
function addLesson(data) {
  LESSONS.push(data);
}

// -------------------------------------------------------------
// LEVEL 1: KHỞI ĐẦU & NỀN MÓNG (BÀI 101 - 120)
// -------------------------------------------------------------
// We import the already detailed 1-15 lessons, then append 116-120, 201-220, 301-320

// Let's read the first 10 lessons from our initial file
import { CURRICULUM_60_LESSONS as initial10 } from '../src/data/curriculumLessons.js';
initial10.slice(0, 10).forEach(l => addLesson(l));

// Lesson 111-115
addLesson({
  id: 'l-111', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 11,
  title: 'Gia đình & Động từ sở hữu 有 / 没有',
  chineseTitle: '家庭与动词“有/没有”',
  subtitle: 'Nói về thành viên trong gia đình, đếm số người bằng lượng từ 口 và sở hữu 有/没有.',
  objective: 'Biết giới thiệu các thành viên trong gia đình (bố, mẹ, anh, chị, em), dùng chuẩn động từ 有 và phủ định 没有.',
  prerequisite: 'Đã hoàn thành Module 1.2.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và giới thiệu đúng số thành viên trong gia đình.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Gia đình', 'Động từ 有', 'Lượng từ 口'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Động từ sở hữu 有 / 没有 & Các thành viên gia đình',
    summary: 'Để diễn tả "có" ta dùng 有 (yǒu), phủ định của 有 luôn luôn là 没有 (méi yǒu), tuyệt đối KHÔNG dùng 不有.',
    initialsGuide: [
      { char: '有 (yǒu)', read: 'Có: 我有哥哥 (Tôi có anh trai)' },
      { char: '没有 (méi yǒu)', read: 'Không có: 我没有姐姐 (Tôi không có chị gái)' },
      { char: '口 (kǒu)', read: 'Lượng từ chỉ số người trong nhà: 三口人' }
    ],
    audioDemoText: 'nǐ jiā yǒu jǐ kǒu rén, wǒ jiā yǒu sì kǒu rén, bàba, māma, gēge hé wǒ'
  },
  step2_vocabulary: [
    { id: 'v-111-1', hanzi: '有', pinyin: 'yǒu', hanviet: 'Hữu', meaning: 'Có', radical: '月 (Nguyệt)', example: { hanzi: '我有两个姐姐。', pinyin: 'Wǒ yǒu liǎng gè jiějie.', meaning: 'Tôi có 2 người chị gái.' } },
    { id: 'v-111-2', hanzi: '没有', pinyin: 'méiyǒu', hanviet: 'Một hữu', meaning: 'Không có', radical: '氵 (Thủy)', example: { hanzi: '我没有哥哥。', pinyin: 'Wǒ méiyǒu gēge.', meaning: 'Tôi không có anh trai.' } },
    { id: 'v-111-3', hanzi: '家', pinyin: 'jiā', hanviet: 'Gia', meaning: 'Nhà, gia đình', radical: '宀 (Miên)', example: { hanzi: '我家在北京。', pinyin: 'Wǒ jiā zài Běijīng.', meaning: 'Nhà tôi ở Bắc Kinh.' } },
    { id: 'v-111-4', hanzi: '哥哥', pinyin: 'gēge', hanviet: 'Ca ca', meaning: 'Anh trai', radical: '口 (Khẩu)', example: { hanzi: '我哥哥很高。', pinyin: 'Wǒ gēge hěn gāo.', meaning: 'Anh trai tôi rất cao.' } },
    { id: 'v-111-5', hanzi: '姐姐', pinyin: 'jiějie', hanviet: 'Tỷ tỷ', meaning: 'Chị gái', radical: '女 (Nữ)', example: { hanzi: '姐姐是医生。', pinyin: 'Jiějie shì yīshēng.', meaning: 'Chị gái là bác sĩ.' } },
    { id: 'v-111-6', hanzi: '和', pinyin: 'hé', hanviet: 'Hòa', meaning: 'Và, cùng với', radical: '口 (Khẩu)', example: { hanzi: '爸爸和我。', pinyin: 'Bàba hé wǒ.', meaning: 'Bố và tôi.' } }
  ],
  step3_hanzi: [
    { hanzi: '有', pinyin: 'yǒu', meaning: 'Có (sở hữu)', strokesCount: 6, strokeOrderText: 'Ngang -> Phẩy -> Bộ Nguyệt (月)', components: 'Bộ Nguyệt', mnemonic: 'Bàn tay nắm lấy miếng thịt (Nguyệt) biểu thị sự sở hữu giàu có.' },
    { hanzi: '家', pinyin: 'jiā', meaning: 'Gia đình, nhà', strokesCount: 10, strokeOrderText: 'Mái nhà (宀) -> Chữ Thỉ (豕 - con lợn)', components: '宀 + 豕', mnemonic: 'Dưới mái nhà nuôi heo tạo thành gia đình sung túc.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + 有 / 没有 + Danh từ',
    title: 'Phủ định của động từ 有 là 没有 (KHÔNG DÙNG 不有)',
    explanation: 'Trong tiếng Trung, phủ định của 有 duy nhất là 没有. Tuyệt đối không dùng 不 có nghĩa là không để ghép với 有.',
    examples: [
      { hanzi: '我有汉语书。', pinyin: 'Wǒ yǒu Hànyǔ shū.', meaning: 'Tôi có sách tiếng Trung.' },
      { hanzi: '我没有汉语书。', pinyin: 'Wǒ méiyǒu Hànyǔ shū.', meaning: 'Tôi không có sách tiếng Trung.' }
    ],
    commonMistake: { wrong: '我不有书 ❌', correct: '我没有书 ✔️', explanation: 'Phủ định của 有 luôn luôn là 没有.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', meaning: 'Nhà bạn có mấy người?' },
      { speaker: 'B', hanzi: '我家有四口人：爸爸、妈妈、哥哥和我。', pinyin: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.', meaning: 'Nhà tôi có 4 người: bố, mẹ, anh trai và tôi.' }
    ],
    audioText: '你家有几口人？我家有四口人：爸爸、妈妈、哥哥和我。',
    question: 'Nhà người B có mấy thành viên?',
    options: ['3 người', '4 người (sì kǒu)', '5 người', '2 người'],
    correctIndex: 1, explanation: 'Người B nói rõ: "我家有四口人".'
  },
  step6_speaking: {
    prompt: 'Hãy nói về số thành viên trong gia đình bạn:',
    targetSentence: '我家有四口人。', targetPinyin: 'Wǒ jiā yǒu sì kǒu rén.', targetMeaning: 'Nhà tôi có 4 người.', hint: 'Nói rõ ràng âm kǒu.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Tôi không có anh trai"',
    words: ['哥哥', '我', '没有'], correctOrder: ['我', '没有', '哥哥'],
    explanation: 'Cấu trúc: 我 (Tôi) + 没有 (Không có) + 哥哥 (Anh trai).'
  },
  step8_quiz: [
    { id: 'q-111-1', type: 'multiple-choice', question: 'Dạng phủ định của động từ 有 là gì?', options: ['不有', '没有', '不没有', '没是有'], correctIndex: 1, explanation: 'Phủ định của 有 là 没有.' },
    { id: 'q-111-2', type: 'multiple-choice', question: 'Lượng từ đếm số người trong nhà là:', options: ['个', '口', '本', '只'], correctIndex: 1, explanation: 'Dùng lượng từ 口 (kǒu).' }
  ],
  step9_challenge: {
    title: 'Giới thiệu các thành viên trong gia đình bạn',
    taskDesc: 'Đọc to câu: "Wǒ jiā yǒu sì kǒu rén: bàba, māma hé wǒ".',
    targetPhrase: 'wǒ jiā yǒu sì kǒu rén', xpReward: 50, badge: 'Gia Đình Ấm Áp'
  }
});

addLesson({
  id: 'l-112', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 12,
  title: 'Ngày tháng năm theo trật tự lớn đến bé',
  chineseTitle: '年月日与星期（大到小规则）',
  subtitle: 'Nắm vững quy tắc thời gian Á Đông (Năm -> Tháng -> Ngày -> Thứ) và nói ngày sinh nhật.',
  objective: 'Nói chuẩn xác ngày, tháng, năm và các thứ trong tuần (星期一 đến 星期天) theo quy tắc từ lớn đến bé.',
  prerequisite: 'Đã hoàn thành số đếm ở Bài 109.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và nói đúng ngày hôm nay.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Ngày tháng', 'Thứ trong tuần', 'Thời gian'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Quy tắc vàng thời gian: Từ lớn đến bé (Năm ➔ Tháng ➔ Ngày ➔ Thứ)',
    summary: 'Khác với tiếng Việt (ngày trước tháng sau), tiếng Trung luôn đi từ đơn vị lớn nhất đến nhỏ nhất: 年 (năm) -> 月 (tháng) -> 日/号 (ngày) -> 星期 (thứ).',
    initialsGuide: [
      { char: '年 (nián)', read: 'Năm' }, { char: '月 (yuè)', read: 'Tháng' }, { char: '号 (hào)', read: 'Ngày (khẩu ngữ)' }, { char: '星期 (xīngqī)', read: 'Thứ' }
    ],
    audioDemoText: 'jīntiān shí yuè jiǔ hào xīngqīwǔ'
  },
  step2_vocabulary: [
    { id: 'v-112-1', hanzi: '今天', pinyin: 'jīntiān', hanviet: 'Kim thiên', meaning: 'Hôm nay', radical: '人 (Nhân)', example: { hanzi: '今天星期五。', pinyin: 'Jīntiān xīngqīwǔ.', meaning: 'Hôm nay thứ Sáu.' } },
    { id: 'v-112-2', hanzi: '明天', pinyin: 'míngtiān', hanviet: 'Minh thiên', meaning: 'Ngày mai', radical: '日 (Nhật)', example: { hanzi: '明天见。', pinyin: 'Míngtiān jiàn.', meaning: 'Mai gặp lại.' } },
    { id: 'v-112-3', hanzi: '月', pinyin: 'yuè', hanviet: 'Nguyệt', meaning: 'Tháng', radical: '月 (Nguyệt)', example: { hanzi: '十月。', pinyin: 'Shí yuè.', meaning: 'Tháng 10.' } },
    { id: 'v-112-4', hanzi: '号', pinyin: 'hào', hanviet: 'Hào', meaning: 'Ngày, mùng', radical: '口 (Khẩu)', example: { hanzi: '九号。', pinyin: 'Jiǔ hào.', meaning: 'Ngày 9.' } },
    { id: 'v-112-5', hanzi: '星期', pinyin: 'xīngqī', hanviet: 'Tinh kỳ', meaning: 'Thứ, tuần', radical: '日 (Nhật)', example: { hanzi: '星期五。', pinyin: 'Xīngqīwǔ.', meaning: 'Thứ Sáu.' } }
  ],
  step3_hanzi: [
    { hanzi: '天', pinyin: 'tiān', meaning: 'Trời, ngày', strokesCount: 4, strokeOrderText: 'Ngang trên -> Ngang dưới -> Phẩy -> Mác', components: '一 + 大', mnemonic: 'Phía trên con người to lớn có bầu trời cao rộng.' },
    { hanzi: '月', pinyin: 'yuè', meaning: 'Mặt trăng, tháng', strokesCount: 4, strokeOrderText: 'Phẩy đứng -> Ngang gập móc -> Hai nét ngang trong', components: 'Bộ Nguyệt', mnemonic: 'Hình vầng trăng khuyết.' }
  ],
  step4_grammar: {
    formula: 'Năm + 月 + Ngày/号 + 星期',
    title: 'Quy tắc từ lớn đến bé',
    explanation: 'Tháng luôn đứng trước ngày: 10月9号 (Tháng 10 mùng 9).',
    examples: [{ hanzi: '今天十月九号。', pinyin: 'Jīntiān shí yuè jiǔ hào.', meaning: 'Hôm nay ngày 9 tháng 10.' }],
    commonMistake: { wrong: 'Nói 9号10月 theo tiếng Việt.', correct: 'Nói 10月9号 (Tháng trước ngày sau).', explanation: 'Quy tắc lớn trước bé sau.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '今天几月几号？', pinyin: 'Jīntiān jǐ yuè jǐ hào?', meaning: 'Hôm nay ngày mấy tháng mấy?' },
      { speaker: 'B', hanzi: '今天十月九号，星期五。', pinyin: 'Jīntiān shí yuè jiǔ hào, xīngqīwǔ.', meaning: 'Hôm nay ngày 9 tháng 10, thứ Sáu.' }
    ],
    audioText: '今天十月九号，星期五。',
    question: 'Hôm nay là thứ mấy?', options: ['Thứ Tư', 'Thứ Sáu (xīngqīwǔ)', 'Thứ Bảy', 'Chủ nhật'], correctIndex: 1, explanation: '星期五 là Thứ Sáu.'
  },
  step6_speaking: {
    prompt: 'Nói ngày hôm nay:', targetSentence: '今天星期五。', targetPinyin: 'Jīntiān xīngqīwǔ.', targetMeaning: 'Hôm nay thứ Sáu.', hint: 'Phát âm xīngqī thanh 1.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Ngày mai là ngày 10 tháng 10"',
    words: ['明天', '十月', '是', '十号'], correctOrder: ['明天', '是', '十月', '十号'],
    explanation: '明天 + 是 + 十月 + 十号.'
  },
  step8_quiz: [
    { id: 'q-112-1', type: 'multiple-choice', question: 'Trong tiếng Trung "Thứ Hai" là gì?', options: ['星期一', '星期二', '星期天', '星期日'], correctIndex: 0, explanation: '星期一 là Thứ 2.' },
    { id: 'q-112-2', type: 'multiple-choice', question: 'Cách nói "ngày 1 tháng 1" chuẩn là:', options: ['一号一月', '一月一号', '一号月一', '一月号一'], correctIndex: 1, explanation: 'Tháng trước ngày sau: 一月一号.' }
  ],
  step9_challenge: {
    title: 'Đọc ngày sinh nhật của bạn', taskDesc: 'Đọc to ngày tháng sinh theo trật tự: Tháng... Ngày...', targetPhrase: 'yuè hào xīngqī', xpReward: 50, badge: 'Làm Chủ Lịch Trình'
  }
});

addLesson({
  id: 'l-113', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 13,
  title: 'Giờ giấc & Hoạt động thường nhật',
  chineseTitle: '时间点与日常活动（现在几点）',
  subtitle: 'Làm chủ cách hỏi giờ (现在几点), nói giờ hơn/phút và diễn đạt lịch trình sinh hoạt hàng ngày.',
  objective: 'Hỏi và trả lời giờ giấc chính xác (点 - giờ, 分 - phút, 半 - rưỡi), miêu tả lịch sinh hoạt cơ bản.',
  prerequisite: 'Đã hoàn thành Bài 112.',
  completionCriteria: 'Đạt >= 70% bài tập đọc đồng hồ và sắp xếp thời gian biểu.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Giờ giấc', 'Sinh hoạt', 'Bây giờ mấy giờ'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Hỏi và trả lời giờ giấc với 点 (diǎn) và 分 (fēn)',
    summary: 'Cấu trúc giờ: [Số] + 点 (giờ) + [Số] + 分 (phút). Giờ rưỡi dùng 半 (bàn). Điểm thời gian luôn đứng TRƯỚC động từ.',
    initialsGuide: [
      { char: '点 (diǎn)', read: 'Giờ' }, { char: '分 (fēn)', read: 'Phút' }, { char: '半 (bàn)', read: 'Rưỡi' }
    ],
    audioDemoText: 'xiànzài jǐ diǎn, xiànzài bā diǎn bàn'
  },
  step2_vocabulary: [
    { id: 'v-113-1', hanzi: '现在', pinyin: 'xiànzài', hanviet: 'Hiện tại', meaning: 'Bây giờ', radical: '王 (Ngọc)', example: { hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', meaning: 'Bây giờ mấy giờ?' } },
    { id: 'v-113-2', hanzi: '点', pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Giờ', radical: '灬 (Hỏa)', example: { hanzi: '八点。', pinyin: 'Bā diǎn.', meaning: '8 giờ.' } },
    { id: 'v-113-3', hanzi: '分', pinyin: 'fēn', hanviet: 'Phân', meaning: 'Phút', radical: '刀 (Đao)', example: { hanzi: '十分。', pinyin: 'Shí fēn.', meaning: '10 phút.' } },
    { id: 'v-113-4', hanzi: '半', pinyin: 'bàn', hanviet: 'Bán', meaning: 'Rưỡi, nửa', radical: '十 (Thập)', example: { hanzi: '七点半。', pinyin: 'Qī diǎn bàn.', meaning: '7 giờ rưỡi.' } },
    { id: 'v-113-5', hanzi: '去', pinyin: 'qù', hanviet: 'Khứ', meaning: 'Đi', radical: '厶 (Khứ)', example: { hanzi: '去学校。', pinyin: 'Qù xuéxiào.', meaning: 'Đi trường học.' } }
  ],
  step3_hanzi: [
    { hanzi: '分', pinyin: 'fēn', meaning: 'Phút, chia', strokesCount: 4, strokeOrderText: 'Bát (八) -> Dao (刀)', components: '八 + 刀', mnemonic: 'Dùng dao chia nhỏ.' },
    { hanzi: '半', pinyin: 'bàn', meaning: 'Một nửa', strokesCount: 5, strokeOrderText: 'Chấm -> Phẩy -> Ngang ngắn -> Ngang dài -> Sổ', components: 'Bộ Thập', mnemonic: 'Chẻ nửa đôi bờ.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + [Thời gian] + Động từ + Tân ngữ',
    title: 'Thời gian luôn đứng TRƯỚC động từ',
    explanation: 'Trong tiếng Trung, trạng từ chỉ thời gian bắt buộc phải đứng trước động từ chỉ hành động.',
    examples: [{ hanzi: '我八点去学校。', pinyin: 'Wǒ bā diǎn qù xuéxiào.', meaning: 'Tôi 8 giờ đi học.' }],
    commonMistake: { wrong: '我去学校八点 ❌', correct: '我八点去学校 ✔️', explanation: 'Thời gian đứng trước hành động.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', meaning: 'Bây giờ mấy giờ?' },
      { speaker: 'B', hanzi: '现在七点半，要去学校了。', pinyin: 'Xiànzài qī diǎn bàn, yào qù xuéxiào le.', meaning: 'Bây giờ 7 giờ rưỡi, phải đi học rồi.' }
    ],
    audioText: '现在七点半，要去学校了。',
    question: 'Bây giờ là mấy giờ?', options: ['7 giờ đúng', '7 giờ rưỡi (qī diǎn bàn)', '8 giờ', '6 giờ rưỡi'], correctIndex: 1, explanation: '七点半 là 7 giờ rưỡi.'
  },
  step6_speaking: {
    prompt: 'Hỏi giờ bây giờ:', targetSentence: '现在几点？', targetPinyin: 'Xiànzài jǐ diǎn?', targetMeaning: 'Bây giờ mấy giờ?', hint: 'Nói nhẹ nhàng.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Tôi 8 giờ đi trường học"',
    words: ['去学校', '我', '八点'], correctOrder: ['我', '八点', '去学校'],
    explanation: '我 + 八点 + 去学校.'
  },
  step8_quiz: [
    { id: 'q-113-1', type: 'multiple-choice', question: 'Dịch câu đúng: "Tôi ăn cơm lúc 12 giờ"', options: ['我吃饭十二点。', '我十二点吃饭。', '十二点我饭吃。', '饭吃我十二点。'], correctIndex: 1, explanation: 'Thời gian đứng trước động từ: 我十二点吃饭.' },
    { id: 'q-113-2', type: 'multiple-choice', question: '"两点半" là mấy giờ?', options: ['12 giờ', '2 giờ rưỡi', '3 giờ kém', '2 giờ 15'], correctIndex: 1, explanation: '两点半 là 2 giờ rưỡi.' }
  ],
  step9_challenge: {
    title: 'Báo giờ hiện tại', taskDesc: 'Nhìn đồng hồ và nói to: "Xiànzài... diǎn".', targetPhrase: 'xiànzài jǐ diǎn', xpReward: 50, badge: 'Đúng Giờ Chuẩn Xác'
  }
});

addLesson({
  id: 'l-114', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 14,
  title: 'Địa điểm & Động từ chỉ nơi chốn 在, 去',
  chineseTitle: '地点与处所动词“在/去”（在哪儿）',
  subtitle: 'Nắm chắc mẫu câu hỏi vị trí (在哪儿), giới từ 在 (ở đâu) và động từ 去 (đi đâu).',
  objective: 'Hỏi và chỉ vị trí ở đâu với 在 (ở) và 去 (đi), phân biệt trật tự câu nơi chốn trong tiếng Trung.',
  prerequisite: 'Đã hoàn thành Bài 113.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và nói đúng câu hành động tại địa điểm.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Địa điểm', 'Nơi chốn', 'Động từ 在 và 去'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Vị trí nơi chốn với 在 (zài - ở) và 去 (qù - đi)',
    summary: 'Khi diễn tả làm việc gì ở đâu: [Ở Đ U] TRƯỚC ➔ [LÀM GÌ] SAU. Công thức: Chủ ngữ + 在 + Địa điểm + Động từ.',
    initialsGuide: [
      { char: '在哪儿 (zài nǎr)', read: 'Ở đâu?' }, { char: '学校 (xuéxiào)', read: 'Trường học' }, { char: '医院 (yīyuàn)', read: 'Bệnh viện' }
    ],
    audioDemoText: 'nǐ zài nǎr, wǒ zài xuéxiào kàn shū'
  },
  step2_vocabulary: [
    { id: 'v-114-1', hanzi: '在', pinyin: 'zài', hanviet: 'Tại', meaning: 'Ở, tại', radical: '土 (Thổ)', example: { hanzi: '你在哪儿？', pinyin: 'Nǐ zài nǎr?', meaning: 'Bạn ở đâu?' } },
    { id: 'v-114-2', hanzi: '哪儿', pinyin: 'nǎr', hanviet: 'Nả nhi', meaning: 'Ở đâu', radical: '口 (Khẩu)', example: { hanzi: '他在哪儿？', pinyin: 'Tā zài nǎr?', meaning: 'Anh ấy ở đâu?' } },
    { id: 'v-114-3', hanzi: '学校', pinyin: 'xuéxiào', hanviet: 'Học hiệu', meaning: 'Trường học', radical: '木 (Mộc)', example: { hanzi: '我去学校。', pinyin: 'Wǒ qù xuéxiào.', meaning: 'Tôi đi trường.' } },
    { id: 'v-114-4', hanzi: '看书', pinyin: 'kàn shū', hanviet: 'Khán thư', meaning: 'Đọc sách', radical: '目 (Mục)', example: { hanzi: '看书。', pinyin: 'Kàn shū.', meaning: 'Đọc sách.' } }
  ],
  step3_hanzi: [
    { hanzi: '在', pinyin: 'zài', meaning: 'Ở tại', strokesCount: 6, strokeOrderText: 'Ngang -> Phẩy -> Sổ -> Ngang -> Sổ -> Ngang đáy', components: '土', mnemonic: 'Đứng trên mặt đất.' },
    { hanzi: '看', pinyin: 'kàn', meaning: 'Xem, đọc', strokesCount: 9, strokeOrderText: 'Tay (手) ở trên -> Mắt (目) ở dưới', components: '手 + 目', mnemonic: 'Đưa tay che mắt nhìn xa.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + 在 + Địa điểm + Động từ + Tân ngữ',
    title: 'Địa điểm luôn đứng TRƯỚC hành động',
    explanation: 'Trong tiếng Trung: Phải đến địa điểm rồi mới làm hành động, nên 在 + Địa điểm luôn đứng trước động từ.',
    examples: [{ hanzi: '我在学校看书。', pinyin: 'Wǒ zài xuéxiào kàn shū.', meaning: 'Tôi ở trường đọc sách.' }],
    commonMistake: { wrong: '我看书在学校 ❌', correct: '我在学校看书 ✔️', explanation: 'Nơi chốn đứng trước động từ.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '你在哪儿？', pinyin: 'Nǐ zài nǎr?', meaning: 'Bạn ở đâu?' },
      { speaker: 'B', hanzi: '我在学校看书。', pinyin: 'Wǒ zài xuéxiào kàn shū.', meaning: 'Tôi ở trường đọc sách.' }
    ],
    audioText: '我在学校看书。', question: 'Người B đang ở đâu làm gì?', options: ['Ở nhà ngủ', 'Ở trường đọc sách', 'Đi mua sắm', 'Ăn cơm ở quán'], correctIndex: 1, explanation: '我在学校看书.'
  },
  step6_speaking: {
    prompt: 'Hỏi bạn ở đâu:', targetSentence: '你在哪儿？', targetPinyin: 'Nǐ zài nǎr?', targetMeaning: 'Bạn đang ở đâu?', hint: 'Uốn lưỡi nǎr.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Tôi đọc sách ở trường"',
    words: ['在学校', '我', '看书'], correctOrder: ['我', '在学校', '看书'],
    explanation: '我 + 在学校 + 看书.'
  },
  step8_quiz: [
    { id: 'q-114-1', type: 'multiple-choice', question: 'Câu đúng: "Chúng tôi uống trà ở nhà"', options: ['我们喝茶在家。', '我们在家喝茶。', '在家我们喝茶。', '喝茶我们在家。'], correctIndex: 1, explanation: '我们在家喝茶.' },
    { id: 'q-114-2', type: 'multiple-choice', question: '"哪儿" dùng để hỏi:', options: ['Thời gian', 'Địa điểm', 'Giá cả', 'Tuổi'], correctIndex: 1, explanation: 'Hỏi nơi chốn.' }
  ],
  step9_challenge: {
    title: 'Báo việc bạn đang làm', taskDesc: 'Nói to: "Wǒ zài jiā xué Hànyǔ".', targetPhrase: 'wǒ zài jiā xué Hànyǔ', xpReward: 50, badge: 'Định Vị Không Gian'
  }
});

addLesson({
  id: 'l-115', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 15,
  title: 'Mua sắm cơ bản & Hỏi giá tiền 多少钱',
  chineseTitle: '基础购物与询价（多少钱、块）',
  subtitle: 'Hỏi giá tiền (这个多少钱), tiền tệ (块/元) và cách khen chê đắt rẻ (太贵了) khi mua sắm.',
  objective: 'Hỏi giá hàng hóa thành thạo, hiểu mệnh giá tiền tệ Trung Quốc (块 - tệ) và nói câu cảm thán 太...了.',
  prerequisite: 'Đã hoàn thành Bài 114.',
  completionCriteria: 'Đạt >= 80% bài tập tình huống mua sắm và hỏi giá.',
  durationMinutes: 25, xpReward: 60, tags: ['HSK 1', 'Mua sắm', 'Hỏi giá tiền', 'Review Checkpoint'],
  relatedMaterialIds: ['mat-1', 'mat-2', 'mat-5'],
  step1_learn: {
    topic: 'Hỏi giá tiền với 多少钱 (duōshao qián) & Cụm cảm thán 太...了',
    summary: 'Công thức hỏi giá: [Đồ vật] + 多少钱？ Tiền tệ khẩu ngữ là 块 (kuài). Đắt quá: 太贵了 (Tài guì le).',
    initialsGuide: [
      { char: '多少钱 (duōshao qián)', read: 'Bao nhiêu tiền?' }, { char: '块 (kuài)', read: 'Đồng, tệ' }, { char: '太贵了 (tài guì le)', read: 'Đắt quá rồi' }
    ],
    audioDemoText: 'zhège duōshao qián, shí kuài qián, tài guì le'
  },
  step2_vocabulary: [
    { id: 'v-115-1', hanzi: '多少', pinyin: 'duōshao', hanviet: 'Đa thiểu', meaning: 'Bao nhiêu', radical: '夕 (Tịch)', example: { hanzi: '多少钱？', pinyin: 'Duōshao qián?', meaning: 'Bao nhiêu tiền?' } },
    { id: 'v-115-2', hanzi: '钱', pinyin: 'qián', hanviet: 'Tiền', meaning: 'Tiền', radical: '钅 (Kim)', example: { hanzi: '多少钱？', pinyin: 'Duōshao qián?', meaning: 'Bao nhiêu tiền?' } },
    { id: 'v-115-3', hanzi: '块', pinyin: 'kuài', hanviet: 'Khối', meaning: 'Đồng, tệ', radical: '土 (Thổ)', example: { hanzi: '十块。', pinyin: 'Shí kuài.', meaning: 'Mười tệ.' } },
    { id: 'v-115-4', hanzi: '太...了', pinyin: 'tài...le', hanviet: 'Thái... liễu', meaning: 'Quá... rồi', radical: '大 (Đại)', example: { hanzi: '太贵了！', pinyin: 'Tài guì le!', meaning: 'Đắt quá rồi!' } }
  ],
  step3_hanzi: [
    { hanzi: '钱', pinyin: 'qián', meaning: 'Tiền bạc', strokesCount: 10, strokeOrderText: 'Bộ Kim (钅) -> Hai nét ngang gập phải', components: '钅 + 戋', mnemonic: 'Kim loại vàng bạc quý giá làm tiền.' },
    { hanzi: '买', pinyin: 'mǎi', meaning: 'Mua', strokesCount: 6, strokeOrderText: 'Ngang móc -> Chấm -> Phẩy -> Chấm', components: 'Bộ Ất', mnemonic: 'Bỏ tiền ra mua.' }
  ],
  step4_grammar: {
    formula: '太 + Tính từ + 了！ (Ví dụ: 太贵了 / 太好了)',
    title: 'Cấu trúc cảm thán cố định 太...了',
    explanation: 'Phó từ 太 luôn đi kèm với trợ từ 了 ở cuối câu để biểu thị mức độ cao hoặc cảm thán.',
    examples: [{ hanzi: '太贵了！', pinyin: 'Tài guì le!', meaning: 'Đắt quá rồi!' }],
    commonMistake: { wrong: 'Quên chữ 了: "太贵" ❌', correct: 'Phải nói: "太贵了！" ✔️', explanation: '太...了 đi thành cặp.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '这个多少钱？', pinyin: 'Zhè ge duōshao qián?', meaning: 'Cái này bao nhiêu tiền?' },
      { speaker: 'B', hanzi: '二十五块钱。', pinyin: 'Èrshíwǔ kuài qián.', meaning: '25 tệ.' }
    ],
    audioText: '这个多少钱？二十五块钱。', question: 'Món đồ có giá bao nhiêu?', options: ['15 tệ', '20 tệ', '25 tệ (èrshíwǔ kuài)', '50 tệ'], correctIndex: 2, explanation: '25 tệ.'
  },
  step6_speaking: {
    prompt: 'Hỏi giá:', targetSentence: '这个多少钱？', targetPinyin: 'Zhè ge duōshao qián?', targetMeaning: 'Cái này bao nhiêu tiền?', hint: 'Đọc duōshao nhẹ nhàng.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Cái này đắt quá rồi"',
    words: ['太贵了', '这个'], correctOrder: ['这个', '太贵了'],
    explanation: '这个 + 太贵了.'
  },
  step8_quiz: [
    { id: 'q-115-1', type: 'multiple-choice', question: 'Từ khẩu ngữ chỉ đồng tiền tệ Trung Quốc là:', options: ['元', '块', '角', '分'], correctIndex: 1, explanation: 'Khẩu ngữ dùng 块 (kuài).' },
    { id: 'q-115-2', type: 'multiple-choice', question: '"太好了！" mang nghĩa:', options: ['Đắt quá', 'Tuyệt vời / Tốt quá', 'Xấu quá', 'Không tốt'], correctIndex: 1, explanation: 'Tốt quá rồi.' }
  ],
  step9_challenge: {
    title: 'Mở khóa Boss Chapter 3', taskDesc: 'Vượt qua bài tập để đấu Boss mua sắm!', targetPhrase: 'zhè ge duōshao qián', xpReward: 60, badge: 'Thánh Mặc Cả Sơ Cấp'
  }
});

// --- MODULE 1.4: Thói quen, Sở thích & Tổng kết HSK 1 (Bài 116-120) ---
addLesson({
  id: 'l-116', chapterId: 'ch-4', levelId: 'lvl-1', lessonNumber: 16,
  title: 'Đồ ăn thức uống & Sở thích 喜欢, 吃, 喝',
  chineseTitle: '饮食偏好与动词“喜欢/吃/喝”',
  subtitle: 'Biết nói món ăn yêu thích (米饭, 面条), đồ uống (茶, 水) và cấu trúc bày tỏ sở thích 喜欢.',
  objective: 'Biết gọi tên các món ăn cơ bản, dùng động từ 喜欢 (thích), 吃 (ăn), 喝 (uống) để nói về sở thích ẩm thực.',
  prerequisite: 'Đã hoàn thành Module 1.3.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và nói được món mình thích ăn.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Ẩm thực', 'Sở thích', 'Ăn uống'],
  relatedMaterialIds: ['mat-1', 'mat-2', 'mat-5'],
  step1_learn: {
    topic: 'Diễn đạt sở thích ẩm thực với 喜欢 (xǐhuan) + 吃/喝',
    summary: 'Công thức: Chủ ngữ + 喜欢 + 吃/喝 + Món ăn/Thức uống. 米饭 (cơm), 面条 (mì sợi), 苹果 (táo), 茶 (trà), 水 (nước).',
    initialsGuide: [
      { char: '喜欢 (xǐhuan)', read: 'Thích: 我喜欢吃米饭 (Tôi thích ăn cơm)' },
      { char: '米饭 (mǐfàn)', read: 'Cơm trắng' },
      { char: '面条 (miàntiáo)', read: 'Mì sợi' }
    ],
    audioDemoText: 'nǐ xǐhuan chī shénme, wǒ xǐhuan chī miàntiáo hé mǐfàn'
  },
  step2_vocabulary: [
    { id: 'v-116-1', hanzi: '喜欢', pinyin: 'xǐhuan', hanviet: 'Hỷ hoan', meaning: 'Thích, yêu thích', radical: '口 (Khẩu)', example: { hanzi: '我喜欢你。', pinyin: 'Wǒ xǐhuan nǐ.', meaning: 'Tôi thích bạn.' } },
    { id: 'v-116-2', hanzi: '米饭', pinyin: 'mǐfàn', hanviet: 'Mễ phạn', meaning: 'Cơm trắng', radical: '米 (Mễ)', example: { hanzi: '吃米饭。', pinyin: 'Chī mǐfàn.', meaning: 'Ăn cơm.' } },
    { id: 'v-116-3', hanzi: '面条', pinyin: 'miàntiáo', hanviet: 'Diện điều', meaning: 'Mì sợi', radical: '面 (Diện)', example: { hanzi: '我喜欢吃面条。', pinyin: 'Wǒ xǐhuan chī miàntiáo.', meaning: 'Tôi thích ăn mì.' } },
    { id: 'v-116-4', hanzi: '苹果', pinyin: 'píngguǒ', hanviet: 'Bình quả', meaning: 'Quả táo', radical: '艹 (Thảo)', example: { hanzi: '买苹果。', pinyin: 'Mǎi píngguǒ.', meaning: 'Mua táo.' } },
    { id: 'v-116-5', hanzi: '茶', pinyin: 'chá', hanviet: 'Trà', meaning: 'Trà, chè', radical: '艹 (Thảo)', example: { hanzi: '喝中国茶。', pinyin: 'Hē Zhōngguó chá.', meaning: 'Uống trà Trung Quốc.' } }
  ],
  step3_hanzi: [
    { hanzi: '米', pinyin: 'mǐ', meaning: 'Gạo, hạt lúa', strokesCount: 6, strokeOrderText: 'Chấm -> Phẩy -> Ngang -> Sổ -> Phẩy -> Mác', components: 'Bộ Mễ', mnemonic: 'Hạt thóc lúa bung nở bốn phương.' },
    { hanzi: '面', pinyin: 'miàn', meaning: 'Mặt, mì', strokesCount: 9, strokeOrderText: 'Ngang -> Phẩy -> Sổ -> Ngang gập -> Ngang -> Ngang...', components: 'Bộ Diện', mnemonic: 'Khuôn mặt hoặc bột mì trắng.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + 喜欢 + Động từ + Tân ngữ',
    title: 'Bày tỏ sở thích với 喜欢',
    explanation: 'Từ 喜欢 có thể đi trực tiếp với danh từ (我喜欢茶) hoặc đi với cụm động từ (我喜欢喝茶).',
    examples: [{ hanzi: '我不喜欢吃面条。', pinyin: 'Wǒ bù xǐhuan chī miàntiáo.', meaning: 'Tôi không thích ăn mì.' }],
    commonMistake: { wrong: 'Dùng 爱 thay cho 喜欢 trong mọi ngữ cảnh ẩm thực.', correct: 'Dùng 喜欢 nhẹ nhàng tự nhiên hơn cho món ăn hàng ngày.', explanation: '喜欢 là thích phổ biến.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '你喜欢吃米饭还是面条？', pinyin: 'Nǐ xǐhuan chī mǐfàn háishi miàntiáo?', meaning: 'Bạn thích ăn cơm hay ăn mì?' },
      { speaker: 'B', hanzi: '我喜欢吃面条，不喜欢吃米饭。', pinyin: 'Wǒ xǐhuan chī miàntiáo, bù xǐhuan chī mǐfàn.', meaning: 'Tôi thích ăn mì, không thích ăn cơm.' }
    ],
    audioText: '我喜欢吃面条，不喜欢吃米饭。',
    question: 'Người B thích ăn món gì?', options: ['Cơm (mǐfàn)', 'Mì sợi (miàntiáo)', 'Bánh bao', 'Táo'], correctIndex: 1, explanation: 'Người B nói thích ăn 面条.'
  },
  step6_speaking: {
    prompt: 'Nói món bạn thích ăn:', targetSentence: '我喜欢吃中国菜。', targetPinyin: 'Wǒ xǐhuan chī Zhōngguó cài.', targetMeaning: 'Tôi thích ăn món Trung Quốc.', hint: 'Đọc xǐhuan mềm mại.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Tôi thích uống trà nóng"',
    words: ['喝茶', '喜欢', '我'], correctOrder: ['我', '喜欢', '喝茶'],
    explanation: '我 + 喜欢 + 喝茶.'
  },
  step8_quiz: [
    { id: 'q-116-1', type: 'multiple-choice', question: '"米饭" nghĩa là gì?', options: ['Cơm trắng', 'Mì sợi', 'Bánh mì', 'Nước ngọt'], correctIndex: 0, explanation: '米饭 là Cơm trắng.' },
    { id: 'q-116-2', type: 'multiple-choice', question: 'Từ phủ định đi với 喜欢 là:', options: ['不喜欢', '没喜欢', '不有喜欢', '别喜欢'], correctIndex: 0, explanation: 'Phủ định là 不喜欢.' }
  ],
  step9_challenge: {
    title: 'Nói 2 món bạn thích ăn và uống', taskDesc: 'Đọc to: "Wǒ xǐhuan chī... wǒ xǐhuan hē...".', targetPhrase: 'wǒ xǐhuan chī mǐfàn', xpReward: 50, badge: 'Sành Ăn Trung Hoa'
  }
});

addLesson({
  id: 'l-117', chapterId: 'ch-4', levelId: 'lvl-1', lessonNumber: 17,
  title: 'Khả năng & Nguyện vọng với năng nguyện động từ 会, 想',
  chineseTitle: '能愿动词“会/想”（我会说汉语）',
  subtitle: 'Phân biệt 会 (biết qua học tập: 会说汉语) và 想 (muốn/nhớ: 想喝茶).',
  objective: 'Biết dùng 会 diễn đạt kỹ năng qua rèn luyện (biết nấu ăn, biết nói tiếng Trung) và 想 diễn đạt mong muốn.',
  prerequisite: 'Đã hoàn thành Bài 116.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và nói được câu "Tôi biết nói tiếng Trung".',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Năng nguyện động từ', 'Biết qua học tập 会', 'Mong muốn 想'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Năng nguyện động từ 会 (biết) và 想 (muốn)',
    summary: '会 (huì): Diễn tả khả năng đạt được qua học hỏi rèn luyện (biết bơi, biết tiếng Trung). Phủ định là 不会. 想 (xiǎng): Diễn tả nguyện vọng mong muốn (muốn làm gì) hoặc nhớ nhung (nhớ nhà).',
    initialsGuide: [
      { char: '会 (huì)', read: 'Biết: 我会说汉语 (Tôi biết nói tiếng Trung)' },
      { char: '想 (xiǎng)', read: 'Muốn: 我想去中国 (Tôi muốn đi Trung Quốc)' }
    ],
    audioDemoText: 'nǐ huì shuō Hànyǔ ma, wǒ huì shuō Hànyǔ, wǒ xiǎng qù Běijīng'
  },
  step2_vocabulary: [
    { id: 'v-117-1', hanzi: '会', pinyin: 'huì', hanviet: 'Hội', meaning: 'Biết (qua học hỏi), sẽ', radical: '人 (Nhân)', example: { hanzi: '我会说汉语。', pinyin: 'Wǒ huì shuō Hànyǔ.', meaning: 'Tôi biết nói tiếng Trung.' } },
    { id: 'v-117-2', hanzi: '想', pinyin: 'xiǎng', hanviet: 'Tưởng', meaning: 'Muốn, nghĩ, nhớ', radical: '心 (Tâm)', example: { hanzi: '我想喝茶。', pinyin: 'Wǒ xiǎng hē chá.', meaning: 'Tôi muốn uống trà.' } },
    { id: 'v-117-3', hanzi: '说', pinyin: 'shuō', hanviet: 'Thuyết', meaning: 'Nói', radical: '讠 (Ngôn)', example: { hanzi: '说话。', pinyin: 'Shuōhuà.', meaning: 'Nói chuyện.' } },
    { id: 'v-117-4', hanzi: '汉语', pinyin: 'Hànyǔ', hanviet: 'Hán ngữ', meaning: 'Tiếng Trung, tiếng Hán', radical: '氵 (Thủy)', example: { hanzi: '学汉语。', pinyin: 'Xué Hànyǔ.', meaning: 'Học tiếng Trung.' } },
    { id: 'v-117-5', hanzi: '做饭', pinyin: 'zuò fàn', hanviet: 'Tác phạn', meaning: 'Nấu cơm, làm bếp', radical: '亻 (Nhân)', example: { hanzi: '妈妈会做饭。', pinyin: 'Māma huì zuò fàn.', meaning: 'Mẹ biết nấu ăn.' } }
  ],
  step3_hanzi: [
    { hanzi: '会', pinyin: 'huì', meaning: 'Hội họp, biết', strokesCount: 6, strokeOrderText: 'Nhân (人) ở trên -> Vân (云) ở dưới', components: '人 + 云', mnemonic: 'Mọi người tụ họp dưới mây bàn bạc.' },
    { hanzi: '想', pinyin: 'xiǎng', meaning: 'Suy nghĩ, muốn', strokesCount: 13, strokeOrderText: 'Tương (相) ở trên -> Tâm (心) ở dưới', components: '相 + 心', mnemonic: 'Đặt hình ảnh người thân vào trong tim là nỗi nhớ và ước muốn.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + 会 / 想 + Động từ + Tân ngữ',
    title: 'Vị trí của năng nguyện động từ trong câu',
    explanation: 'Năng nguyện động từ 会 và 想 luôn đứng ngay TRƯỚC động từ chính.',
    examples: [
      { hanzi: '你会写汉字吗？', pinyin: 'Nǐ huì xiě hànzì ma?', meaning: 'Bạn biết viết chữ Hán không?' },
      { hanzi: '我想去中国旅游。', pinyin: 'Wǒ xiǎng qù Zhōngguó lǚyóu.', meaning: 'Tôi muốn đi du lịch Trung Quốc.' }
    ],
    commonMistake: { wrong: '我不想做饭 ❌ phủ định của 会 dùng 不想.', correct: 'Phủ định của 会 là 不会; phủ định của 想 là 不想.', explanation: 'Tùy theo nghĩa biết hay muốn mà chọn từ phủ định.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '你会说汉语吗？', pinyin: 'Nǐ huì shuō Hànyǔ ma?', meaning: 'Bạn biết nói tiếng Trung không?' },
      { speaker: 'B', hanzi: '我会说一点儿汉语，我想去北京大学学习。', pinyin: 'Wǒ huì shuō yìdiǎnr Hànyǔ, wǒ xiǎng qù Běijīng Dàxué xuéxí.', meaning: 'Tôi biết nói một chút tiếng Trung, tôi muốn đến Đại học Bắc Kinh học tập.' }
    ],
    audioText: '我会说一点儿汉语，我想去北京大学学习。',
    question: 'Khả năng tiếng Trung của người B ra sao?',
    options: ['Không biết nói', 'Biết nói một chút (huì shuō yìdiǎnr)', 'Nói cực kỳ lưu loát', 'Chỉ biết viết không biết nói'],
    correctIndex: 1, explanation: 'Người B nói: "我会说一点儿汉语".'
  },
  step6_speaking: {
    prompt: 'Tự tin khẳng định bạn biết nói tiếng Trung:',
    targetSentence: '我会说汉语。', targetPinyin: 'Wǒ huì shuō Hànyǔ.', targetMeaning: 'Tôi biết nói tiếng Trung.', hint: 'Nói to dứt khoát huì shuō Hànyǔ.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Tôi muốn đi Trung Quốc học tiếng Trung"',
    words: ['去中国', '我想', '学汉语'], correctOrder: ['我想', '去中国', '学汉语'],
    explanation: '我想 + 去中国 + 学汉语.'
  },
  step8_quiz: [
    { id: 'q-117-1', type: 'multiple-choice', question: 'Để diễn tả một kỹ năng có được qua học tập rèn luyện (như bơi, lái xe, ngoại ngữ), ta dùng từ nào?', options: ['想 (xiǎng)', '会 (huì)', '去 (qù)', '在 (zài)'], correctIndex: 1, explanation: 'Dùng từ 会 (huì).' },
    { id: 'q-117-2', type: 'multiple-choice', question: 'Câu phủ định "Tôi không muốn ăn cơm" là:', options: ['我不会吃饭。', '我不想吃饭。', '我没想吃饭。', '我不吃饭想。'], correctIndex: 1, explanation: 'Không muốn là 不想.' }
  ],
  step9_challenge: {
    title: 'Khẳng định khả năng và nguyện vọng của bạn',
    taskDesc: 'Nói to: "Wǒ huì shuō Hànyǔ, wǒ xiǎng qù Zhōngguó!".',
    targetPhrase: 'wǒ huì shuō Hànyǔ', xpReward: 50, badge: 'Chiến Binh Đa Ngôn Ngữ'
  }
});

addLesson({
  id: 'l-118', chapterId: 'ch-4', levelId: 'lvl-1', lessonNumber: 18,
  title: 'Giải trí & Thời tiết sơ cấp 冷, 热, 下雨',
  chineseTitle: '休闲娱乐与基础天气（冷/热/下雨）',
  subtitle: 'Miêu tả hoạt động giải trí (看电影) và tình hình thời tiết (hôm nay trời lạnh/nóng/mưa).',
  objective: 'Biết nói về thời tiết (nóng, lạnh, mưa) và các hoạt động giải trí yêu thích (xem phim, đọc sách).',
  prerequisite: 'Đã hoàn thành Bài 117.',
  completionCriteria: 'Đạt >= 70% trắc nghiệm và nói đúng câu thời tiết hôm nay.',
  durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Thời tiết', 'Xem phim', 'Nóng lạnh'],
  relatedMaterialIds: ['mat-1', 'mat-5'],
  step1_learn: {
    topic: 'Miêu tả thời tiết với 天气 (tiānqì), 冷 (lěng), 热 (rè), 下雨 (xià yǔ)',
    summary: 'Cấu trúc thời tiết: 今天天气怎么样？ (Thời tiết hôm nay thế nào?). Hôm nay rất lạnh: 今天很冷. Hôm nay có mưa: 今天下雨.',
    initialsGuide: [
      { char: '天气 (tiānqì)', read: 'Thời tiết' }, { char: '冷 (lěng)', read: 'Lạnh' }, { char: '热 (rè)', read: 'Nóng' }, { char: '电影 (diànyǐng)', read: 'Phim điện ảnh' }
    ],
    audioDemoText: 'jīntiān tiānqì zěnmeyàng, jīntiān hěn lěng, wǒ zài jiā kàn diànyǐng'
  },
  step2_vocabulary: [
    { id: 'v-118-1', hanzi: '天气', pinyin: 'tiānqì', hanviet: 'Thiên khí', meaning: 'Thời tiết', radical: '气 (Khí)', example: { hanzi: '今天天气好。', pinyin: 'Jīntiān tiānqì hǎo.', meaning: 'Hôm nay thời tiết đẹp.' } },
    { id: 'v-118-2', hanzi: '怎么样', pinyin: 'zěnmeyàng', hanviet: 'Chẩm ma dạng', meaning: 'Như thế nào, ra sao', radical: '心 (Tâm)', example: { hanzi: '怎么样？', pinyin: 'Zěnmeyàng?', meaning: 'Thế nào rồi?' } },
    { id: 'v-118-3', hanzi: '冷', pinyin: 'lěng', hanviet: 'Lãnh', meaning: 'Lạnh', radical: '冫 (Băng)', example: { hanzi: '太冷了！', pinyin: 'Tài lěng le!', meaning: 'Lạnh quá rồi!' } },
    { id: 'v-118-4', hanzi: '热', pinyin: 'rè', hanviet: 'Nhiệt', meaning: 'Nóng', radical: '灬 (Hỏa)', example: { hanzi: '今天很热。', pinyin: 'Jīntiān hěn rè.', meaning: 'Hôm nay rất nóng.' } },
    { id: 'v-118-5', hanzi: '下雨', pinyin: 'xiàyǔ', hanviet: 'Hạ vũ', meaning: 'Mưa, trời mưa', radical: '雨 (Vũ)', example: { hanzi: '下雨了。', pinyin: 'Xiàyǔ le.', meaning: 'Mưa rồi.' } },
    { id: 'v-118-6', hanzi: '电影', pinyin: 'diànyǐng', hanviet: 'Điện ảnh', meaning: 'Bộ phim', radical: '日 (Nhật)', example: { hanzi: '看电影。', pinyin: 'Kàn diànyǐng.', meaning: 'Xem phim.' } }
  ],
  step3_hanzi: [
    { hanzi: '雨', pinyin: 'yǔ', meaning: 'Mưa', strokesCount: 8, strokeOrderText: 'Ngang -> Sổ -> Ngang gập móc -> Sổ giữa -> Bốn hạt mưa', components: 'Bộ Vũ', mnemonic: 'Bầu trời mây che và bốn hạt nước mưa rơi xuống.' },
    { hanzi: '电', pinyin: 'diàn', meaning: 'Điện, tia sét', strokesCount: 5, strokeOrderText: 'Bộ Nhật (日) -> Nét sổ cong móc vút sang phải', components: 'Bộ Điền / Nhật', mnemonic: 'Tia chớp giáng xuống cánh đồng.' }
  ],
  step4_grammar: {
    formula: 'Thời gian + 天气 + 怎么样？ ➔ Thời gian + 很 + Tính từ (冷 / 热)',
    title: 'Mẫu câu hỏi và nhận xét thời tiết',
    explanation: 'Từ 怎么样 đặt ở cuối câu để hỏi về tình trạng, tính chất thời tiết hoặc ý kiến cá nhân.',
    examples: [{ hanzi: '明天天气怎么样？', pinyin: 'Míngtiān tiānqì zěnmeyàng?', meaning: 'Ngày mai thời tiết thế nào?' }],
    commonMistake: { wrong: 'Hôm nay lạnh nói là 今天是冷 ❌.', correct: 'Bỏ chữ 是, dùng phó từ 很: 今天很冷 ✔️.', explanation: 'Trước tính từ dùng phó từ chỉ mức độ 很, không dùng 是.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '今天天气怎么样？', pinyin: 'Jīntiān tiānqì zěnmeyàng?', meaning: 'Thời tiết hôm nay thế nào?' },
      { speaker: 'B', hanzi: '今天下雨，太冷了！我们不去了，在家看电影吧。', pinyin: 'Jīntiān xiàyǔ, tài lěng le! Wǒmen bú qù le, zài jiā kàn diànyǐng ba.', meaning: 'Hôm nay trời mưa, lạnh quá! Chúng ta không đi nữa, ở nhà xem phim nhé.' }
    ],
    audioText: '今天下雨，太冷了！在家看电影吧。',
    question: 'Thời tiết hôm nay như thế nào theo bài nghe?',
    options: ['Trời nắng to', 'Trời mưa và rất lạnh (xiàyǔ, tài lěng)', 'Ấm áp dễ chịu', 'Trời tuyết rơi'],
    correctIndex: 1, explanation: 'Người B nói: "今天下雨，太冷了".'
  },
  step6_speaking: {
    prompt: 'Miêu tả thời tiết hôm nay:', targetSentence: '今天天气很冷。', targetPinyin: 'Jīntiān tiānqì hěn lěng.', targetMeaning: 'Hôm nay thời tiết rất lạnh.', hint: 'Đọc lěng với thanh 3 sâu sắc.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Hôm nay trời mưa, tôi ở nhà xem phim"',
    words: ['在家看电影', '今天下雨', '我'], correctOrder: ['今天下雨', '我', '在家看电影'],
    explanation: 'Thời tiết 今天下雨 + Chủ ngữ 我 + Hành động 在家看电影.'
  },
  step8_quiz: [
    { id: 'q-118-1', type: 'multiple-choice', question: '"下雨" nghĩa là gì?', options: ['Tuyết rơi', 'Trời mưa', 'Gió to', 'Nắng gắt'], correctIndex: 1, explanation: '下雨 là Trời mưa.' },
    { id: 'q-118-2', type: 'multiple-choice', question: 'Để hỏi "Thời tiết hôm nay thế nào?", câu đúng là:', options: ['今天天气什么？', '今天天气怎么样？', '今天天气哪儿？', '今天天气几？'], correctIndex: 1, explanation: 'Hỏi thế nào dùng 怎么样.' }
  ],
  step9_challenge: {
    title: 'Báo cáo thời tiết và kế hoạch của bạn',
    taskDesc: 'Nói to: "Jīntiān tiānqì hěn lěng, wǒ zài jiā kàn diànyǐng".',
    targetPhrase: 'jīntiān tiānqì hěn lěng kàn diànyǐng', xpReward: 50, badge: 'Dự Báo Thời Tiết Sơ Cấp'
  }
});

addLesson({
  id: 'l-119', chapterId: 'ch-4', levelId: 'lvl-1', lessonNumber: 19,
  title: 'Tổng ôn tập toàn diện từ vựng & ngữ pháp HSK 1',
  chineseTitle: 'HSK 1全真语法与核心150词汇大串讲',
  subtitle: 'Hệ thống hóa toàn bộ 150 từ vựng cốt lõi và 48 điểm ngữ pháp trọng tâm chuẩn bị cho kỳ thi.',
  objective: 'Hệ thống hóa toàn bộ kiến thức HSK 1, làm chủ các dạng bài thi Nghe và Đọc hiểu của CTI.',
  prerequisite: 'Đã hoàn thành Bài 101–118.',
  completionCriteria: 'Đạt >= 85% điểm bài thi tổng ôn HSK 1.',
  durationMinutes: 30, xpReward: 80, tags: ['HSK 1', 'Tổng ôn tập', '150 từ vựng', 'Ôn thi CTI'],
  relatedMaterialIds: ['mat-1', 'mat-5', 'mat-8'],
  step1_learn: {
    topic: 'Bản đồ tổng thể 150 từ vựng & Ngữ pháp then chốt HSK 1',
    summary: 'HSK 1 gồm: 1. Đại từ nhân xưng & nghi vấn (我, 你, 他, 她, 我们, 什么, 哪, 哪儿, 谁, 几, 多少, 怎么, 怎么样). 2. Động từ năng nguyện & hành động (是, 有, 去, 来, 看, 吃, 喝, 叫, 认识, 会, 想). 3. Lượng từ (个, 口, 块, 本, 岁). 4. Trợ từ (的, 吗, 呢, 了).',
    initialsGuide: [
      { char: 'Hệ thống ngữ pháp', read: 'SVO, Câu chữ 是, Câu chữ 有, Câu hỏi 吗, Thời gian trước hành động, Nơi chốn trước hành động' }
    ],
    audioDemoText: 'dàjiā hǎo, wǒmen shì Hànyǔ xuésheng, wǒmen dōu huì shuō Hànyǔ'
  },
  step2_vocabulary: [
    { id: 'v-119-1', hanzi: '都', pinyin: 'dōu', hanviet: 'Đô', meaning: 'Đều, tất cả', radical: '阝 (Ấp)', example: { hanzi: '我们都是学生。', pinyin: 'Wǒmen dōu shì xuésheng.', meaning: 'Chúng tôi đều là sinh viên.' } },
    { id: 'v-119-2', hanzi: '听', pinyin: 'tīng', hanviet: 'Thính', meaning: 'Nghe', radical: '口 (Khẩu)', example: { hanzi: '听老师说。', pinyin: 'Tīng lǎoshī shuō.', meaning: 'Nghe thầy giáo nói.' } },
    { id: 'v-119-3', hanzi: '写', pinyin: 'xiě', hanviet: 'Tả', meaning: 'Viết', radical: '冖 (Miên)', example: { hanzi: '写汉字。', pinyin: 'Xiě hànzì.', meaning: 'Viết chữ Hán.' } },
    { id: 'v-119-4', hanzi: '读', pinyin: 'dú', hanviet: 'Độc', meaning: 'Đọc', radical: '讠 (Ngôn)', example: { hanzi: '读书。', pinyin: 'Dú shū.', meaning: 'Đọc sách.' } }
  ],
  step3_hanzi: [
    { hanzi: '写', pinyin: 'xiě', meaning: 'Viết', strokesCount: 5, strokeOrderText: 'Nắp nhà (冖) -> Nét ngang gập móc -> Nét ngang đáy', components: '冖 + 与', mnemonic: 'Ngồi dưới mái nhà cầm bút viết chữ.' }
  ],
  step4_grammar: {
    formula: 'Chủ ngữ + 都 + Vị ngữ (Ví dụ: 我们都喜欢学汉语)',
    title: 'Phó từ 都 (đều) luôn đứng TRƯỚC động từ',
    explanation: 'Từ 都 mang nghĩa là "đều", luôn đứng sau chủ ngữ số nhiều và đứng trước động từ/tính từ.',
    examples: [{ hanzi: '他们都很高兴。', pinyin: 'Tāmen dōu hěn gāoxìng.', meaning: 'Họ đều rất vui.' }],
    commonMistake: { wrong: '我们是都学生 ❌', correct: '我们都是学生 ✔️ (都 đứng trước 是).', explanation: 'Phó từ 都 đứng trước động từ 是.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'A', hanzi: '你们都去中国吗？', pinyin: 'Nǐmen dōu qù Zhōngguó ma?', meaning: 'Các bạn đều đi Trung Quốc à?' },
      { speaker: 'B', hanzi: '对，我们都去北京语言大学学汉语。', pinyin: 'Duì, wǒmen dōu qù Běijīng Yǔyán Dàxué xué Hànyǔ.', meaning: 'Đúng vậy, chúng tôi đều đến Đại học Ngôn ngữ Bắc Kinh học tiếng Trung.' }
    ],
    audioText: '对，我们都去北京语言大学学汉语。',
    question: 'Họ cùng nhau đi đâu học tiếng Trung?',
    options: ['Thượng Hải', 'Bắc Kinh (Běijīng Yǔyán Dàxué)', 'Quảng Châu', 'Đài Bắc'],
    correctIndex: 1, explanation: 'Họ đều đến Đại học Ngôn ngữ Bắc Kinh.'
  },
  step6_speaking: {
    prompt: 'Nói câu tổng kết trình độ của bạn:',
    targetSentence: '我们都喜欢学汉语。', targetPinyin: 'Wǒmen dōu xǐhuan xué Hànyǔ.', targetMeaning: 'Chúng tôi đều thích học tiếng Trung.', hint: 'Đọc dōu rõ ràng.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Họ đều là bạn tốt của tôi"',
    words: ['我的是', '好朋友', '他们都'], correctOrder: ['他们都', '是我的', '好朋友'],
    explanation: '他们都 + 是我的 + 好朋友.'
  },
  step8_quiz: [
    { id: 'q-119-1', type: 'multiple-choice', question: 'Vị trí của phó từ "都" (đều) trong câu là:', options: ['Đứng đầu câu', 'Đứng sau chủ ngữ và trước động từ', 'Đứng cuối câu', 'Đứng sau tân ngữ'], correctIndex: 1, explanation: 'Sau chủ ngữ, trước động từ: 我们都去.' },
    { id: 'q-119-2', type: 'multiple-choice', question: 'Đến hết HSK 1, lượng từ nào thông dụng nhất cho đồ vật và con người?', options: ['个 (gè)', '本 (běn)', '支 (zhī)', '张 (zhāng)'], correctIndex: 0, explanation: '个 là lượng từ phổ thông nhất.' }
  ],
  step9_challenge: {
    title: 'Sẵn sàng bước vào Đề thi thử Checkpoint HSK 1',
    taskDesc: 'Ôn lại toàn bộ ghi chú để chuẩn bị làm đề thi thử 40 câu!',
    targetPhrase: 'wǒmen dōu huì shuō Hànyǔ', xpReward: 60, badge: 'Chiến Binh Sẵn Sàng Vượt Cấp'
  }
});

addLesson({
  id: 'l-120', chapterId: 'ch-4', levelId: 'lvl-1', lessonNumber: 20,
  title: 'Checkpoint Test HSK 1 (Thi thử mô phỏng 100% CTI)',
  chineseTitle: 'HSK 1全真模拟大考与毕业冲刺',
  subtitle: 'Đề thi thử chính thức HSK 1 mô phỏng cấu trúc kỳ thi quốc tế của Chinese Testing International.',
  objective: 'Hoàn thành bài thi thử chuẩn mực HSK 1 (Nghe hiểu & Đọc hiểu), đạt chuẩn chứng chỉ quốc tế và mở khóa Level 2.',
  prerequisite: 'Đã hoàn thành toàn bộ Bài 101–119 của Level 1.',
  completionCriteria: 'Đạt từ 70/100 điểm trở lên để tốt nghiệp Level 1.',
  durationMinutes: 35, xpReward: 100, tags: ['HSK 1', 'Đề thi thử CTI', 'Tốt nghiệp Level 1', 'Checkpoint Exam'],
  relatedMaterialIds: ['mat-1', 'mat-6', 'mat-8'],
  step1_learn: {
    topic: 'Hướng dẫn chiến thuật làm bài thi HSK 1 CTI',
    summary: 'Bài thi HSK 1 gồm 2 phần: 1. Phần Nghe (20 câu - 15 phút): Nghe phán đoán đúng sai tranh ảnh, chọn tranh tương ứng. 2. Phần Đọc hiểu (20 câu - 17 phút): Nối tranh, điền từ vào chỗ trống, đọc hiểu câu trắc nghiệm. Tổng điểm 200, đạt 120 điểm là đỗ.',
    initialsGuide: [
      { char: 'Chiến thuật thi', read: 'Tận dụng thời gian đọc lướt tranh trước khi băng phát; chú ý từ khóa danh từ và động từ' }
    ],
    audioDemoText: 'kǎoshì kāishǐ, qǐng tīng dì-yī tí'
  },
  step2_vocabulary: [
    { id: 'v-120-1', hanzi: '考试', pinyin: 'kǎoshì', hanviet: 'Khảo thí', meaning: 'Thi cử, kỳ thi', radical: '耂 (Lão)', example: { hanzi: '今天考试。', pinyin: 'Jīntiān kǎoshì.', meaning: 'Hôm nay thi.' } },
    { id: 'v-120-2', hanzi: '分', pinyin: 'fēn', hanviet: 'Phân', meaning: 'Điểm số, phút', radical: '刀 (Đao)', example: { hanzi: '一百分。', pinyin: 'Yì bǎi fēn.', meaning: '100 điểm.' } },
    { id: 'v-120-3', hanzi: '对', pinyin: 'duì', hanviet: 'Đối', meaning: 'Đúng, chính xác', radical: '寸 (Thốn)', example: { hanzi: '你说得很对。', pinyin: 'Nǐ shuō de hěn duì.', meaning: 'Bạn nói rất đúng.' } }
  ],
  step3_hanzi: [
    { hanzi: '考', pinyin: 'kǎo', meaning: 'Thi, kiểm tra', strokesCount: 6, strokeOrderText: 'Bộ Lão (耂) -> Nét sổ gập ngang cong', components: '耂', mnemonic: 'Các bậc bô lão khảo thí chọn nhân tài.' }
  ],
  step4_grammar: {
    formula: 'Mô phỏng 100% CTI: Nghe hiểu ➔ Đọc hiểu ➔ Điểm số tổng',
    title: 'Quy tắc khảo thí quốc tế HSK 1',
    explanation: 'Để đạt điểm cao, học viên cần nắm vững toàn bộ 150 từ vựng và phản xạ nối âm nhanh.',
    examples: [{ hanzi: '祝你考试成功！', pinyin: 'Zhù nǐ kǎoshì chénggōng!', meaning: 'Chúc bạn thi cử thành công!' }],
    commonMistake: { wrong: 'Dành quá nhiều thời gian cho một câu khó.', correct: 'Đánh dấu lại và làm tiếp để không bỏ lỡ câu dễ.', explanation: 'Quản trị thời gian phòng thi.' }
  },
  step5_listening: {
    dialogue: [
      { speaker: 'Giám khảo', hanzi: '现在开始听力考试。第一题：喂，李老师在学校吗？', pinyin: 'Xiànzài kāishǐ tīnglì kǎoshì. Dì-yī tí: Wèi, Lǐ lǎoshī zài xuéxiào ma?', meaning: 'Bây giờ bắt đầu phần thi nghe. Câu 1: Alo, cô Lý có ở trường không?' },
      { speaker: 'Thí sinh', hanzi: '在，李老师正在办公室看书呢。', pinyin: 'Zài, Lǐ lǎoshī zhèngzài bàngōngshì kàn shū ne.', meaning: 'Có, cô Lý đang đọc sách ở văn phòng.' }
    ],
    audioText: '李老师正在办公室看书呢。',
    question: 'Theo đoạn nghe, cô Lý đang làm gì?',
    options: ['Đang dạy học', 'Đang đọc sách ở văn phòng (zài bàngōngshì kàn shū)', 'Đang ăn cơm ở nhà ăn', 'Đang đi bệnh viện'],
    correctIndex: 1, explanation: 'Cô Lý đang đọc sách ở văn phòng.'
  },
  step6_speaking: {
    prompt: 'Nói lời tuyên bố hoàn thành Level 1:',
    targetSentence: '我通过HSK 1考试了！', targetPinyin: 'Wǒ tōngguò HSK 1 kǎoshì le!', targetMeaning: 'Tôi đã thi đỗ HSK 1 rồi!', hint: 'Nói to hào hùng tràn đầy tự tin.'
  },
  step7_writing: {
    prompt: 'Sắp xếp câu: "Chúc mừng bạn thi đỗ HSK 1"',
    words: ['考试', '祝贺你', '通过'], correctOrder: ['祝贺你', '通过', '考试'],
    explanation: '祝贺你 + 通过 + 考试.'
  },
  step8_quiz: [
    { id: 'q-120-1', type: 'multiple-choice', question: 'Tổng số từ vựng cần thiết để thi đỗ chứng chỉ HSK 1 quốc tế là:', options: ['50 từ', '150 từ', '300 từ', '600 từ'], correctIndex: 1, explanation: 'HSK 1 cốt lõi gồm 150 từ vựng.' },
    { id: 'q-120-2', type: 'multiple-choice', question: 'Trong bài thi đọc hiểu HSK 1, câu "他在医院工作" có nghĩa là:', options: ['Anh ấy đi học ở trường', 'Anh ấy làm việc ở bệnh viện', 'Anh ấy mua đồ ở cửa hàng', 'Anh ấy xem phim ở nhà'], correctIndex: 1, explanation: 'Làm việc ở bệnh viện.' }
  ],
  step9_challenge: {
    title: 'Tốt nghiệp vinh quang HSK 1 - Mở khóa Level 2!',
    taskDesc: 'Vượt qua bài thi với số điểm >= 70% để chính thức mở khóa Level 2!',
    targetPhrase: 'wǒ tōngguò HSK 1 kǎoshì le', xpReward: 100, badge: 'Chiến Tướng HSK 1 Quốc Tế'
  }
});

console.log(`Level 1 completed! Total lessons so far: ${LESSONS.length}`);

// -------------------------------------------------------------
// LEVEL 2: SINH HOẠT & TÌNH HUỐNG THỰC TẾ (BÀI 201 - 220)
// -------------------------------------------------------------
// Modules:
// 2.1: Lịch trình, Phương tiện & Đi lại (201-205)
// 2.2: Ẩm thực, Nhà hàng & Mua sắm (206-210)
// 2.3: Thời tiết, So sánh & Sức khỏe (211-215)
// 2.4: Trạng thái, Cảm xúc & Tổng kết HSK 2 (216-220)

const level2LessonData = [
  // 201
  {
    id: 'l-201', chapterId: 'ch-5', levelId: 'lvl-2', lessonNumber: 1,
    title: 'Giờ giấc chi tiết, thói quen thức dậy & đi ngủ',
    chineseTitle: '作息时间与日常起居（起床、睡觉、差、刻）',
    subtitle: 'Nói giờ kém (差), khắc (刻 - 15 phút), thói quen thức dậy (起床) và đi ngủ (睡觉).',
    objective: 'Làm chủ cách diễn đạt giờ kém (差三分八点 - 8 giờ kém 3 phút), một khắc (一刻 - 15 phút) và lịch sinh hoạt.',
    prerequisite: 'Đã hoàn thành Level 1.', completionCriteria: 'Đạt >= 70% trắc nghiệm đọc giờ kém.',
    durationMinutes: 20, xpReward: 50, tags: ['HSK 2', 'Giờ kém 差', 'Một khắc 刻', 'Sinh hoạt'],
    relatedMaterialIds: ['mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Giờ kém với 差 (chà) & Một khắc với 刻 (kè = 15 phút)',
      summary: 'Giờ kém: 差 + Phút + 点: 差五分八点 (8 giờ kém 5). Một khắc = 15 phút: 八点一刻 (8 giờ 15 phút).',
      initialsGuide: [{ char: '差 (chà)', read: 'Kém' }, { char: '刻 (kè)', read: 'Khắc (15 phút)' }, { char: '起床 (qǐchuáng)', read: 'Thức dậy' }, { char: '睡觉 (shuìjiào)', read: 'Đi ngủ' }],
      audioDemoText: 'chà wǔ fēn bā diǎn, bā diǎn yí kè, wǒ qī diǎn qǐchuáng'
    },
    step2_vocabulary: [
      { id: 'v-201-1', hanzi: '起床', pinyin: 'qǐchuáng', hanviet: 'Khởi sàng', meaning: 'Thức dậy, rời giường', radical: '走 (Tẩu)', example: { hanzi: '七点起床。', pinyin: 'Qī diǎn qǐchuáng.', meaning: '7 giờ thức dậy.' } },
      { id: 'v-201-2', hanzi: '睡觉', pinyin: 'shuìjiào', hanviet: 'Thụy giác', meaning: 'Đi ngủ', radical: '目 (Mục)', example: { hanzi: '十一点睡觉。', pinyin: 'Shíyī diǎn shuìjiào.', meaning: '11 giờ đi ngủ.' } },
      { id: 'v-201-3', hanzi: '差', pinyin: 'chà', hanviet: 'Sai', meaning: 'Kém, thiếu', radical: '羊 (Dương)', example: { hanzi: '差五分。', pinyin: 'Chà wǔ fēn.', meaning: 'Kém 5 phút.' } },
      { id: 'v-201-4', hanzi: '刻', pinyin: 'kè', hanviet: 'Khắc', meaning: 'Khắc (15 phút)', radical: '刂 (Đao)', example: { hanzi: '三点一刻。', pinyin: 'Sān diǎn yí kè.', meaning: '3 giờ 15 phút.' } }
    ],
    step3_hanzi: [
      { hanzi: '床', pinyin: 'chuáng', meaning: 'Chiếc giường', strokesCount: 7, strokeOrderText: 'Bộ Nghiễm (广) -> Bộ Mộc (木)', components: '广 + 木', mnemonic: 'Chiếc giường gỗ kê dưới mái hiên nhà.' },
      { hanzi: '睡', pinyin: 'shuì', meaning: 'Ngủ', strokesCount: 13, strokeOrderText: 'Mắt (目) -> Thùy (垂 - rủ xuống)', components: '目 + 垂', mnemonic: 'Đôi mi mắt rủ xuống trĩu nặng là lúc đi ngủ.' }
    ],
    step4_grammar: {
      formula: 'Giờ kém: 差 + Số phút + 分 + Số giờ + 点',
      title: 'Công thức nói giờ kém',
      explanation: 'Trong tiếng Trung chữ 差 (kém) đứng ở đầu: 差五分八点 nghĩa là 8 giờ kém 5.',
      examples: [{ hanzi: '差十分九点。', pinyin: 'Chà shí fēn jiǔ diǎn.', meaning: '9 giờ kém 10 phút.' }],
      commonMistake: { wrong: 'Nói 九点差十分 ❌.', correct: 'Bắt buộc nói 差十分九点 ✔️.', explanation: 'Chữ 差 đứng trước số phút.' }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你每天几点起床？', pinyin: 'Nǐ měitiān jǐ diǎn qǐchuáng?', meaning: 'Mỗi ngày bạn mấy giờ dậy?' },
        { speaker: 'B', hanzi: '我每天差一刻七点起床。', pinyin: 'Wǒ měitiān chà yí kè qī diǎn qǐchuáng.', meaning: 'Tôi mỗi ngày 7 giờ kém 15 thức dậy.' }
      ],
      audioText: '我每天差一刻七点起床。', question: 'Người B thức dậy lúc mấy giờ?', options: ['7 giờ đúng', '7 giờ 15', '6 giờ 45 (7 giờ kém 15)', '8 giờ kém 15'], correctIndex: 2, explanation: '差一刻七点 là 7 giờ kém 15 (6:45).'
    },
    step6_speaking: { prompt: 'Nói giờ bạn thức dậy:', targetSentence: '我早上七点起床。', targetPinyin: 'Wǒ zǎoshang qī diǎn qǐchuáng.', targetMeaning: 'Tôi 7 giờ sáng thức dậy.', hint: 'Đọc qǐchuáng chuẩn thanh 3 và thanh 2.' },
    step7_writing: { prompt: 'Sắp xếp câu: "Tôi 11 giờ tối đi ngủ"', words: ['睡觉', '我晚上', '十一点'], correctOrder: ['我晚上', '十一点', '睡觉'], explanation: '我晚上 + 十一点 + 睡觉.' },
    step8_quiz: [
      { id: 'q-201-1', type: 'multiple-choice', question: '"八点一刻" tương đương với mấy giờ?', options: ['8 giờ 5 phút', '8 giờ 15 phút', '8 giờ 30 phút', '8 giờ 45 phút'], correctIndex: 1, explanation: 'Một khắc (一刻) = 15 phút, 八点一刻 = 8h15.' },
      { id: 'q-201-2', type: 'multiple-choice', question: 'Dịch "7 giờ kém 10 phút":', options: ['七点差十分', '差十分七点', '十分差七点', '七点十分差'], correctIndex: 1, explanation: 'Công thức: 差十分七点.' }
    ],
    step9_challenge: { title: 'Báo lịch sinh hoạt trong ngày', taskDesc: 'Nói to: "Wǒ qī diǎn qǐchuáng, shí\'èr diǎn shuìjiào".', targetPhrase: 'qǐchuáng shuìjiào', xpReward: 50, badge: 'Thói Quen Khoa Học' }
  },

  // 202
  {
    id: 'l-202', chapterId: 'ch-5', levelId: 'lvl-2', lessonNumber: 2,
    title: 'Phương tiện giao thông công cộng & Cách đi lại',
    chineseTitle: '公共交通与出行方式（坐出租车、地铁、公交）',
    subtitle: 'Nắm vững các phương tiện: đi xe bus (坐公共汽车), tàu điện ngầm (地铁), taxi (出租车) và xe đạp (骑自行车).',
    objective: 'Phân biệt động từ 坐 (ngồi/đi xe bus, taxi, tàu điện) và 骑 (cưỡi/đi xe đạp, xe máy).',
    prerequisite: 'Đã hoàn thành Bài 201.', completionCriteria: 'Đạt >= 70% trắc nghiệm phương tiện giao thông.',
    durationMinutes: 20, xpReward: 50, tags: ['HSK 2', 'Phương tiện', 'Tàu điện ngầm', 'Taxi'],
    relatedMaterialIds: ['mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Động từ chỉ cách đi lại: 坐 (ngồi xe) vs 骑 (cưỡi xe)',
      summary: 'Các phương tiện ngồi vào trong khoang (taxi, bus, máy bay, tàu điện) dùng 坐 (zuò). Các phương tiện dạng ngồi cưỡi lên (xe đạp, xe máy, ngựa) dùng 骑 (qí).',
      initialsGuide: [{ char: '坐 (zuò)', read: 'Ngồi: 坐出租车 (đi taxi), 坐地铁 (đi tàu điện)' }, { char: '骑 (qí)', read: 'Cưỡi: 骑自行车 (đi xe đạp)' }, { char: '公共汽车 (gōnggòng qìchē)', read: 'Xe buýt' }],
      audioDemoText: 'zuò chūzūchē, zuò dìtiě, qí zìxíngchē, wǒ zuò dìtiě qù shàngbān'
    },
    step2_vocabulary: [
      { id: 'v-202-1', hanzi: '出租车', pinyin: 'chūzūchē', hanviet: 'Xuất tô xa', meaning: 'Xe taxi', radical: '车 (Xa)', example: { hanzi: '坐出租车。', pinyin: 'Zuò chūzūchē.', meaning: 'Đi taxi.' } },
      { id: 'v-202-2', hanzi: '地铁', pinyin: 'dìtiě', hanviet: 'Địa thiết', meaning: 'Tàu điện ngầm', radical: '土 (Thổ)', example: { hanzi: '坐地铁。', pinyin: 'Zuò dìtiě.', meaning: 'Đi tàu điện ngầm.' } },
      { id: 'v-202-3', hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', hanviet: 'Công cộng khí xa', meaning: 'Xe buýt', radical: '车 (Xa)', example: { hanzi: '乘公共汽车。', pinyin: 'Chéng gōnggòng qìchē.', meaning: 'Đi xe bus.' } },
      { id: 'v-202-4', hanzi: '骑', pinyin: 'qí', hanviet: 'Kỵ', meaning: 'Cưỡi, đi (xe đạp/máy)', radical: '马 (Mã)', example: { hanzi: '骑自行车。', pinyin: 'Qí zìxíngchē.', meaning: 'Đi xe đạp.' } }
    ],
    step3_hanzi: [
      { hanzi: '车', pinyin: 'chē', meaning: 'Xe cộ', strokesCount: 4, strokeOrderText: 'Ngang -> Phẩy gập -> Ngang dài -> Sổ', components: 'Bộ Xa', mnemonic: 'Hình vẽ chiếc xe nhìn từ trên cao.' },
      { hanzi: '铁', pinyin: 'tiě', meaning: 'Sắt thép (Thiết)', strokesCount: 10, strokeOrderText: 'Kim (钅) -> Thất (失)', components: '钅 + 失', mnemonic: 'Kim loại sắt thép kiên cố.' }
    ],
    step4_grammar: {
      formula: 'Chủ ngữ + 坐/骑 + Phương tiện + 去 + Nơi chốn',
      title: 'Cấu trúc liên động chỉ phương tiện đi lại',
      explanation: 'Trong tiếng Trung, phương thức di chuyển (坐/骑 + xe) đứng TRƯỚC động từ hành động 去 + Nơi chốn.',
      examples: [{ hanzi: '我坐地铁去公司。', pinyin: 'Wǒ zuò dìtiě qù gōngsī.', meaning: 'Tôi đi tàu điện ngầm đến công ty.' }],
      commonMistake: { wrong: '我去公司坐地铁 ❌', correct: '我坐地铁去公司 ✔️', explanation: 'Phương tiện đứng trước đích đến.' }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你怎么去机场？', pinyin: 'Nǐ zěnme qù jīchǎng?', meaning: 'Bạn đi sân bay bằng phương tiện gì?' },
        { speaker: 'B', hanzi: '行李太多了，我坐出租车去。', pinyin: 'Xíngli tài duō le, wǒ zuò chūzūchē qù.', meaning: 'Hành lý nhiều quá, tôi đi taxi.' }
      ],
      audioText: '行李太多了，我坐出租车去。', question: 'Người B chọn đi sân bay bằng gì?', options: ['Tàu điện', 'Xe đạp', 'Xe taxi (chūzūchē)', 'Xe buýt'], correctIndex: 2, explanation: 'Người B chọn đi taxi.'
    },
    step6_speaking: { prompt: 'Nói bạn đi tàu điện đi làm:', targetSentence: '我坐地铁去上班。', targetPinyin: 'Wǒ zuò dìtiě qù shàngbān.', targetMeaning: 'Tôi đi tàu điện ngầm đi làm.', hint: 'Đọc zuò dìtiě rõ nét.' },
    step7_writing: { prompt: 'Sắp xếp câu: "Tôi đi xe đạp đến trường"', words: ['骑自行车', '去学校', '我'], correctOrder: ['我', '骑自行车', '去学校'], explanation: '我 + 骑自行车 + 去学校.' },
    step8_quiz: [
      { id: 'q-202-1', type: 'multiple-choice', question: 'Phương tiện nào dùng động từ "骑" (cưỡi/đi)?', options: ['出租车', '自行车 (xe đạp)', '地铁', '飞机 (máy bay)'], correctIndex: 1, explanation: 'Xe đạp dùng 骑: 骑自行车.' },
      { id: 'q-202-2', type: 'multiple-choice', question: 'Dịch "Tôi đi xe buýt về nhà":', options: ['我回家坐公共汽车。', '我坐公共汽车回家。', '回家我公共汽车。', '公共汽车坐我回家。'], correctIndex: 1, explanation: 'Phương tiện trước: 我坐公共汽车回家.' }
    ],
    step9_challenge: { title: 'Nói phương tiện bạn đi lại hàng ngày', taskDesc: 'Đọc to: "Wǒ zuò dìtiě qù...".', targetPhrase: 'zuò dìtiě qí zìxíngchē', xpReward: 50, badge: 'Thông Thạo Giao Thông' }
  },

  // 203: Diễn đạt khoảng cách với 离 (Featured in curriculum detail)
  {
    id: 'l-203', chapterId: 'ch-5', levelId: 'lvl-2', lessonNumber: 3,
    title: 'Diễn đạt khoảng cách không gian với giới từ 离',
    chineseTitle: '空间距离表达与介词“离”（离很近/很远）',
    subtitle: 'Nói về khoảng cách giữa hai địa điểm: A 离 B 很近 (rất gần) hoặc 很远 (rất xa).',
    objective: 'Làm chủ giới từ 离 (lí - cách), biết miêu tả khoảng cách không gian và thời gian giữa hai địa điểm.',
    prerequisite: 'Đã hoàn thành Bài 202.', completionCriteria: 'Đạt >= 70% trắc nghiệm và miêu tả được khoảng cách từ nhà đến trường/công ty.',
    durationMinutes: 25, xpReward: 50, tags: ['HSK 2', 'Giới từ 离', 'Khoảng cách', 'Gần xa'],
    relatedMaterialIds: ['mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Cấu trúc khoảng cách không gian với 离 (lí)',
      summary: 'Công thức: Địa điểm A + 离 + Địa điểm B + 很远 (rất xa) / 很近 (rất gần) / 有 + Khoảng cách. Hỏi: A 离 B 远不远？ hoặc 有多远？',
      initialsGuide: [{ char: '离 (lí)', read: 'Cách (khoảng cách)' }, { char: '远 (yuǎn)', read: 'Xa' }, { char: '近 (jìn)', read: 'Gần' }, { char: '公里 (gōnglǐ)', read: 'Ki-lô-mét' }],
      audioDemoText: 'wǒ jiā lí gōngsī hěn jìn, bīnguǎn lí jīchǎng yǒu èrshí gōnglǐ'
    },
    step2_vocabulary: [
      { id: 'v-203-1', hanzi: '离', pinyin: 'lí', hanviet: 'Ly', meaning: 'Cách (khoảng cách)', radical: '亠 (Đầu)', example: { hanzi: '学校离家不远。', pinyin: 'Xuéxiào lí jiā bù yuǎn.', meaning: 'Trường cách nhà không xa.' } },
      { id: 'v-203-2', hanzi: '远', pinyin: 'yuǎn', hanviet: 'Viễn', meaning: 'Xa', radical: '辶 (Quai xước)', example: { hanzi: '很远。', pinyin: 'Hěn yuǎn.', meaning: 'Rất xa.' } },
      { id: 'v-203-3', hanzi: '近', pinyin: 'jìn', hanviet: 'Cận', meaning: 'Gần', radical: '辶 (Quai xước)', example: { hanzi: '很近。', pinyin: 'Hěn jìn.', meaning: 'Rất gần.' } },
      { id: 'v-203-4', hanzi: '公里', pinyin: 'gōnglǐ', hanviet: 'Công lý', meaning: 'Ki-lô-mét (km)', radical: '里 (Lý)', example: { hanzi: '五公里。', pinyin: 'Wǔ gōnglǐ.', meaning: '5 km.' } },
      { id: 'v-203-5', hanzi: '走路', pinyin: 'zǒulù', hanviet: 'Tẩu lộ', meaning: 'Đi bộ', radical: '走 (Tẩu)', example: { hanzi: '走路去。', pinyin: 'Zǒulù qù.', meaning: 'Đi bộ đến.' } }
    ],
    step3_hanzi: [
      { hanzi: '近', pinyin: 'jìn', meaning: 'Gần (Cận)', strokesCount: 7, strokeOrderText: 'Cân (斤) bên phải trước -> Quai xước (辶) bên trái sau', components: '斤 + 辶', mnemonic: 'Bước chân (辶) đi vài bước là tới cây búa (斤) gần bên.' },
      { hanzi: '远', pinyin: 'yuǎn', meaning: 'Xa (Viễn)', strokesCount: 7, strokeOrderText: 'Nguyên (元) bên phải trước -> Quai xước (辶) bên trái sau', components: '元 + 辶', mnemonic: 'Phải đi bộ (辶) một quãng dài tốn tiền bạc (元).' }
    ],
    step4_grammar: {
      formula: 'Địa điểm A + 离 + Địa điểm B + 很近 / 很远',
      title: 'Cấu trúc so sánh khoảng cách với chữ 离',
      explanation: 'Trong tiếng Trung chữ 离 tương đương với "cách" trong tiếng Việt: Nhà tôi CÁCH công ty rất gần.',
      examples: [
        { hanzi: '我家离学校很近。', pinyin: 'Wǒ jiā lí xuéxiào hěn jìn.', meaning: 'Nhà tôi cách trường rất gần.' },
        { hanzi: '宾馆离机场有二十公里。', pinyin: 'Bīnguǎn lí jīchǎng yǒu èrshí gōnglǐ.', meaning: 'Khách sạn cách sân bay 20 km.' }
      ],
      commonMistake: { wrong: '我家很近学校 ❌ (thiếu chữ 离).', correct: '我家离学校很近 ✔️.', explanation: 'Bắt buộc dùng giới từ 离.' }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '请问，医院离这儿远不远？', pinyin: 'Qǐngwèn, yīyuàn lí zhèr yuǎn bu yuǎn?', meaning: 'Xin hỏi bệnh viện cách đây xa không?' },
        { speaker: 'B', hanzi: '不远，走路十分钟就到了。', pinyin: 'Bù yuǎn, zǒulù shí fēnzhōng jiù dào le.', meaning: 'Không xa, đi bộ 10 phút là tới rồi.' }
      ],
      audioText: '医院离这儿不远，走路十分钟就到了。', question: 'Bệnh viện cách đây bao xa?', options: ['Rất xa phải đi máy bay', 'Không xa, đi bộ 10 phút là tới', 'Cách 50 cây số', 'Không tìm thấy bệnh viện'], correctIndex: 1, explanation: 'Bệnh viện không xa, đi bộ 10 phút.'
    },
    step6_speaking: { prompt: 'Nói nhà bạn cách công ty rất gần:', targetSentence: '我家离公司很近。', targetPinyin: 'Wǒ jiā lí gōngsī hěn jìn.', targetMeaning: 'Nhà tôi cách công ty rất gần.', hint: 'Đọc lí gōngsī hěn jìn lưu loát.' },
    step7_writing: { prompt: 'Sắp xếp câu: "Bệnh viện cách trường học rất gần"', words: ['很近', '离学校', '医院'], correctOrder: ['医院', '离学校', '很近'], explanation: '医院 + 离学校 + 很近.' },
    step8_quiz: [
      { id: 'q-203-1', type: 'multiple-choice', question: 'Điền từ thích hợp vào chỗ trống: 学校 ___ 我家很远。', options: ['在', '去', '离', '到'], correctIndex: 2, explanation: 'Khoảng cách dùng 离: 学校离我家很远.' },
      { id: 'q-203-2', type: 'multiple-choice', question: 'Từ "很近" trái nghĩa với từ nào?', options: ['很大', '很远 (rất xa)', '很小', '很冷'], correctIndex: 1, explanation: '近 (gần) trái nghĩa với 远 (xa).' }
    ],
    step9_challenge: { title: 'Mô tả khoảng cách từ nhà bạn đến trung tâm', taskDesc: 'Đọc to: "Wǒ jiā lí... hěn jìn / hěn yuǎn".', targetPhrase: 'wǒ jiā lí gōngsī hěn jìn', xpReward: 50, badge: 'Đo Lường Không Gian' }
  },

  // 204
  {
    id: 'l-204', chapterId: 'ch-5', levelId: 'lvl-2', lessonNumber: 4,
    title: 'Hỏi đường & Chỉ hướng với giới từ 往',
    chineseTitle: '问路与方向指引（往左拐、往前走、路口）',
    subtitle: 'Nắm vững phương hướng: rẽ trái (往左拐), rẽ phải (往右拐), đi thẳng (往前走) và ngã tư (十字路口).',
    objective: 'Biết hỏi đường và chỉ đường trôi chảy bằng giới từ 往 (hướng về phía), rẽ trái/phải.',
    prerequisite: 'Đã hoàn thành Bài 203.', completionCriteria: 'Đạt >= 70% trắc nghiệm chỉ đường trên bản đồ.',
    durationMinutes: 20, xpReward: 50, tags: ['HSK 2', 'Hỏi đường', 'Chỉ hướng', 'Rẽ trái rẽ phải'],
    relatedMaterialIds: ['mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Chỉ hướng với giới từ 往 (wǎng) + Phương hướng + Động từ',
      summary: 'Công thức chỉ đường: 往 + Hướng + Động từ: 往前走 (đi thẳng về phía trước), 往左拐 (rẽ trái), 往右拐 (rẽ phải), 到十字路口 (đến ngã tư).',
      initialsGuide: [{ char: '往 (wǎng)', read: 'Hướng về phía' }, { char: '左 (zuǒ)', read: 'Trái' }, { char: '右 (yòu)', read: 'Phải' }, { char: '拐 (guǎi)', read: 'Rẽ, quẹo' }],
      audioDemoText: 'qǐngwèn dìtiězhàn zěnme zǒu, wǎng qián zǒu, dào lùkǒu wǎng zuǒ guǎi'
    },
    step2_vocabulary: [
      { id: 'v-204-1', hanzi: '往', pinyin: 'wǎng', hanviet: 'Vãng', meaning: 'Về phía, hướng về', radical: '彳 (Xích)', example: { hanzi: '往前走。', pinyin: 'Wǎng qián zǒu.', meaning: 'Đi về phía trước.' } },
      { id: 'v-204-2', hanzi: '左', pinyin: 'zuǒ', hanviet: 'Tả', meaning: 'Bên trái', radical: '工 (Công)', example: { hanzi: '往左拐。', pinyin: 'Wǎng zuǒ guǎi.', meaning: 'Rẽ trái.' } },
      { id: 'v-204-3', hanzi: '右', pinyin: 'yòu', hanviet: 'Hữu', meaning: 'Bên phải', radical: '口 (Khẩu)', example: { hanzi: '往右拐。', pinyin: 'Wǎng yòu guǎi.', meaning: 'Rẽ phải.' } },
      { id: 'v-204-4', hanzi: '路口', pinyin: 'lùkǒu', hanviet: 'Lộ khẩu', meaning: 'Giao lộ, ngã rẽ', radical: '口 (Khẩu)', example: { hanzi: '到了路口。', pinyin: 'Dào le lùkǒu.', meaning: 'Đến ngã rẽ.' } }
    ],
    step3_hanzi: [
      { hanzi: '左', pinyin: 'zuǒ', meaning: 'Bên trái (Tả)', strokesCount: 5, strokeOrderText: 'Ngang -> Phẩy -> Bộ Công (工)', components: '工', mnemonic: 'Tay trái cầm dụng cụ làm công việc.' },
      { hanzi: '右', pinyin: 'yòu', meaning: 'Bên phải (Hữu)', strokesCount: 5, strokeOrderText: 'Ngang -> Phẩy -> Bộ Khẩu (口)', components: '口', mnemonic: 'Tay phải cầm đồ ăn đưa vào miệng.' }
    ],
    step4_grammar: {
      formula: '往 + Hướng (前/后/左/右) + Động từ (走/拐)',
      title: 'Công thức chỉ hướng với chữ 往',
      explanation: 'Trong tiếng Trung, giới từ 往 luôn đứng trước từ chỉ phương hướng và đi trước động từ.',
      examples: [{ hanzi: '往前走一百米，然后往右拐。', pinyin: 'Wǎng qián zǒu yì bǎi mǐ, ránhòu wǎng yòu guǎi.', meaning: 'Đi thẳng 100m, sau đó rẽ phải.' }],
      commonMistake: { wrong: '拐往左 ❌', correct: '往左拐 ✔️ (往 đứng trước).', explanation: 'Trật tự: 往 + Phương hướng + Động từ.' }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '请问，地铁站在哪儿？怎么走？', pinyin: 'Qǐngwèn, dìtiězhàn zài nǎr? Zěnme zǒu?', meaning: 'Xin hỏi ga tàu điện ở đâu? Đi thế nào ạ?' },
        { speaker: 'B', hanzi: '你一直往前走，到了路口往右拐就看到了。', pinyin: 'Nǐ yìzhí wǎng qián zǒu, dào le lùkǒu wǎng yòu guǎi jiù kàndào le.', meaning: 'Bạn cứ đi thẳng, đến ngã rẽ quẹo phải là nhìn thấy.' }
      ],
      audioText: '你一直往前走，到了路口往右拐。', question: 'Người hỏi đường cần làm gì ở ngã rẽ?', options: ['Rẽ trái', 'Rẽ phải (wǎng yòu guǎi)', 'Quay đầu lại', 'Dừng lại đi xe bus'], correctIndex: 1, explanation: 'Đến ngã rẽ quẹo phải (往右拐).'
    },
    step6_speaking: { prompt: 'Nói chỉ dẫn đi thẳng rồi rẽ trái:', targetSentence: '往前走，往左拐。', targetPinyin: 'Wǎng qián zǒu, wǎng zuǒ guǎi.', targetMeaning: 'Đi thẳng, rẽ trái.', hint: 'Đọc wǎng qián zǒu mượt mà.' },
    step7_writing: { prompt: 'Sắp xếp câu: "Đi thẳng về phía trước"', words: ['走', '往', '前'], correctOrder: ['往', '前', '走'], explanation: '往 + 前 + 走.' },
    step8_quiz: [
      { id: 'q-204-1', type: 'multiple-choice', question: '"往左拐" nghĩa là:', options: ['Rẽ phải', 'Rẽ trái', 'Đi lùi lại', 'Đi thẳng'], correctIndex: 1, explanation: '左 là bên trái, 往左拐 là Rẽ trái.' },
      { id: 'q-204-2', type: 'multiple-choice', question: 'Để hỏi đường "Đi như thế nào?", ta dùng cụm từ:', options: ['怎么走？', '多少钱？', '什么时候？', '谁去？'], correctIndex: 0, explanation: 'Hỏi cách đi: 怎么走？ (Zěnme zǒu?).' }
    ],
    step9_challenge: { title: 'Đóng vai cảnh sát chỉ đường', taskDesc: 'Đọc to: "Yìzhí wǎng qián zǒu, dào lùkǒu wǎng yòu guǎi".', targetPhrase: 'wǎng qián zǒu wǎng yòu guǎi', xpReward: 50, badge: 'Người Dẫn Đường Bản Ngữ' }
  },

  // 205
  {
    id: 'l-205', chapterId: 'ch-5', levelId: 'lvl-2', lessonNumber: 5,
    title: 'Ôn tập Module 2.1 & Thử thách bắt taxi, chỉ đường',
    chineseTitle: '模块一复习与出租车实战挑战',
    subtitle: 'Tổng kết giờ giấc sinh hoạt, phương tiện giao thông và đàm thoại thực tế bắt taxi.',
    objective: 'Tự tin xử lý tình huống bắt taxi tại Trung Quốc, nói điểm đến và hướng dẫn tài xế dừng xe.',
    prerequisite: 'Đã hoàn thành Bài 201–204.', completionCriteria: 'Đạt >= 80% điểm bài tập tổng kết Module 2.1.',
    durationMinutes: 25, xpReward: 60, tags: ['HSK 2', 'Tổng kết Module', 'Bắt taxi', 'Review Checkpoint'],
    relatedMaterialIds: ['mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Kịch bản vàng khi đi Taxi / Didi tại Trung Quốc',
      summary: 'Lên xe: 师傅，我去... (Bác tài, cho cháu đến...). Dọc đường: 走高速吗？ (Đi cao tốc không?). Xuống xe: 请在前面路口停车 (Làm ơn dừng xe ở ngã rẽ phía trước).',
      initialsGuide: [{ char: '师傅 (shīfu)', read: 'Bác tài, sư phụ (gọi tài xế lịch sự)' }, { char: '停车 (tíngchē)', read: 'Dừng xe' }],
      audioDemoText: 'shīfu, wǒ qù Běijīng Fàndiàn, qǐng zài qiánmian tíngchē'
    },
    step2_vocabulary: [
      { id: 'v-205-1', hanzi: '师傅', pinyin: 'shīfu', hanviet: 'Sư phụ', meaning: 'Bác tài, chú tài xế', radical: '巾 (Cân)', example: { hanzi: '师傅，去机场。', pinyin: 'Shīfu, qù jīchǎng.', meaning: 'Bác tài, đi sân bay.' } },
      { id: 'v-205-2', hanzi: '停', pinyin: 'tíng', hanviet: 'Đình', meaning: 'Dừng lại, đỗ xe', radical: '亻 (Nhân)', example: { hanzi: '停车。', pinyin: 'Tíngchē.', meaning: 'Dừng xe.' } },
      { id: 'v-205-3', hanzi: '前面', pinyin: 'qiánmian', hanviet: 'Tiền diện', meaning: 'Phía trước', radical: '面 (Diện)', example: { hanzi: '在前面。', pinyin: 'Zài qiánmian.', meaning: 'Ở phía trước.' } }
    ],
    step3_hanzi: [
      { hanzi: '停', pinyin: 'tíng', meaning: 'Dừng lại', strokesCount: 11, strokeOrderText: 'Nhân đứng (亻) -> Chữ Đình (亭)', components: '亻 + 亭', mnemonic: 'Con người ghé vào đình nghỉ chân dừng bước.' }
    ],
    step4_grammar: {
      formula: '师傅，请在 + Địa điểm + 停车。',
      title: 'Yêu cầu tài xế dừng xe an toàn',
      explanation: 'Sử dụng kính xưng 师傅 kết hợp với cấu trúc câu cầu khiến 请...',
      examples: [{ hanzi: '师傅，请在路口右边停车。', pinyin: 'Shīfu, qǐng zài lùkǒu yòubiān tíngchē.', meaning: 'Bác tài, làm ơn dừng xe ở bên phải ngã rẽ.' }],
      commonMistake: { wrong: 'Quát lớn "停停停!" thiếu lịch sự.', correct: 'Nói: "师傅，请在前面停车，谢谢！"', explanation: 'Giao tiếp văn minh chuẩn bản xứ.' }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'Tài xế', hanzi: '您好，请问去哪儿？', pinyin: 'Nín hǎo, qǐngwèn qù nǎr?', meaning: 'Xin chào, quý khách đi đâu ạ?' },
        { speaker: 'Khách', hanzi: '师傅，我去王府井步行街。请在前面地铁口停车，谢谢！', pinyin: 'Shīfu, wǒ qù Wángfǔjǐng bùxíngjiē. Qǐng zài qiánmian dìtiěkǒu tíngchē, xièxie!', meaning: 'Bác tài, cho tôi đến phố đi bộ Vương Phủ Tỉnh. Làm ơn dừng ở cửa ga tàu điện ngầm phía trước nhé!' }
      ],
      audioText: '师傅，我去王府井，请在前面地铁口停车。', question: 'Hành khách yêu cầu dừng xe ở đâu?', options: ['Ở bệnh viện', 'Ở cửa ga tàu điện phía trước (qiánmian dìtiěkǒu)', 'Ở cổng trường', 'Ở sân bay'], correctIndex: 1, explanation: 'Dừng ở cửa ga tàu điện ngầm phía trước.'
    },
    step6_speaking: { prompt: 'Nói câu dừng xe lịch sự với tài xế:', targetSentence: '师傅，请在前面停车。', targetPinyin: 'Shīfu, qǐng zài qiánmian tíngchē.', targetMeaning: 'Bác tài ơi, làm ơn dừng xe ở phía trước nhé.', hint: 'Đọc shīfu tự nhiên.' },
    step7_writing: { prompt: 'Sắp xếp câu: "Bác tài, cho tôi đi sân bay"', words: ['我去机场', '师傅'], correctOrder: ['师傅', '我去机场'], explanation: '师傅 + 我去机场.' },
    step8_quiz: [
      { id: 'q-205-1', type: 'multiple-choice', question: 'Từ xưng hô lịch sự và phổ biến nhất với tài xế taxi ở Trung Quốc là:', options: ['老师 (thầy giáo)', '师傅 (bác tài)', '老板 (ông chủ)', '同学 (bạn học)'], correctIndex: 1, explanation: 'Gọi tài xế là 师傅 (shīfu).' },
      { id: 'q-205-2', type: 'multiple-choice', question: '"停车" mang ý nghĩa:', options: ['Khởi hành xe', 'Dừng xe / Đỗ xe', 'Mua xe mới', 'Sửa chữa xe'], correctIndex: 1, explanation: 'Dừng xe, đỗ xe.' }
    ],
    step9_challenge: { title: 'Mở khóa Boss Chapter 5', taskDesc: 'Vượt qua bài tập để đấu Boss Taxi Challenge tại Bắc Kinh!', targetPhrase: 'shīfu qǐng zài qiánmian tíngchē', xpReward: 60, badge: 'Chinh Phục Giao Thông HSK 2' }
  }
];

level2LessonData.forEach(l => addLesson(l));
console.log(`Level 2 Module 2.1 added! Total: ${LESSONS.length}`);
