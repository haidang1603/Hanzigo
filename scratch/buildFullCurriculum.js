import fs from 'fs';
import path from 'path';

// Load our first 15 lessons already written
import { CURRICULUM_60_LESSONS as first10 } from '../src/data/curriculumLessons.js';

// Define the remaining lesson specifications from the curriculum
const remainingLessonSpecs = [
  // --- Bài 111-115 are already prototyped; let's include 111-115 with full fidelity ---
  {
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
  },

  {
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
  },

  {
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
  },

  {
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
  },

  {
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
  }
];

console.log('Generating complete 60 curriculum lessons...');
