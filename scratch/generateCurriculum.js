// Script to build authentic 60-lesson curriculum according to docs/HANZIGO_CHINESE_CURRICULUM.md
import fs from 'fs';
import path from 'path';

// Load lessons already written for l-101 to l-110
import { CURRICULUM_60_LESSONS as initialLessons } from '../src/data/curriculumLessons.js';

// Curriculum blueprint for Lessons 111-120, 201-220, 301-320
const rawCurriculumSpecs = [
  // --- MODULE 1.3: Gia đình, Thời gian & Nơi chốn (111-115) ---
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
      { hanzi: '家', pinyin: 'jiā', meaning: 'Gia đình, nhà', strokesCount: 10, strokeOrderText: 'Mái nhà (宀) -> Nét phẩy cong chữ Thỉ (豕 - con lợn)', components: '宀 + 豕', mnemonic: 'Dưới mái nhà (宀) có nuôi gia súc lợn (豕) chính là tổ ấm gia đình.' }
    ],
    step4_grammar: {
      formula: 'Chủ ngữ + 有 / 没有 + Danh từ (Tân ngữ)',
      title: 'Phủ định của động từ 有 là 没有 (KHÔNG DÙNG 不有)',
      explanation: 'Đây là lỗi sai phổ biến nhất của người mới học tiếng Trung. Trong tiếng Trung, phủ định của 有 duy nhất là 没有.',
      examples: [
        { hanzi: '你有汉语书吗？ (Nǐ yǒu Hànyǔ shū ma?)', pinyin: 'yǒu shū ma', meaning: 'Bạn có sách tiếng Trung không?' },
        { hanzi: '我没有汉语书。 (Wǒ méiyǒu Hànyǔ shū.)', pinyin: 'méiyǒu shū', meaning: 'Tôi không có sách tiếng Trung.' }
      ],
      commonMistake: {
        wrong: '我不仅有 ❌ / 我不有 ❌',
        correct: '我没有 ✔️ (Luôn luôn dùng 没有).',
        explanation: 'Không bao giờ tồn tại cấu trúc "不有" trong ngữ pháp tiếng Trung chuẩn.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', meaning: 'Nhà bạn có mấy người?' },
        { speaker: 'B', hanzi: '我家有四口人：爸爸、妈妈、一个哥哥和我。你呢？', pinyin: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, yí gè gēge hé wǒ. Nǐ ne?', meaning: 'Nhà tôi có 4 người: bố, mẹ, một anh trai và tôi. Còn bạn?' },
        { speaker: 'A', hanzi: '我家有三口人，我没有哥哥。', pinyin: 'Wǒ jiā yǒu sān kǒu rén, wǒ méiyǒu gēge.', meaning: 'Nhà tôi có 3 người, tôi không có anh trai.' }
      ],
      audioText: '你家有几口人？我家有四口人：爸爸、妈妈、一个哥哥和我。',
      question: 'Gia đình người B có tổng cộng mấy người?',
      options: ['3 người', '4 người (sì kǒu rén)', '5 người', '2 người'],
      correctIndex: 1,
      explanation: 'Người B nói rõ: "我家有四口人" (4 người).'
    },
    step6_speaking: {
      prompt: 'Hãy nói về gia đình bạn (Ví dụ: Nhà tôi có 4 người):',
      targetSentence: '我家有四口人。',
      targetPinyin: 'Wǒ jiā yǒu sì kǒu rén.',
      targetMeaning: 'Nhà tôi có bốn người.',
      hint: 'Dùng lượng từ kǒu đi liền sau con số.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Tôi không có anh trai"',
      words: ['哥哥', '我', '没有'],
      correctOrder: ['我', '没有', '哥哥'],
      explanation: 'Cấu trúc: 我 (Tôi) + 没有 (Không có) + 哥哥 (Anh trai).'
    },
    step8_quiz: [
      {
        id: 'q-111-1',
        type: 'multiple-choice',
        question: 'Dạng phủ định chính xác của động từ "有" (có) là:',
        options: ['不有 (bù yǒu)', '没有 (méi yǒu)', '没是有 (méi shì yǒu)', '不没有 (bù méi yǒu)'],
        correctIndex: 1,
        explanation: 'Phủ định của 有 duy nhất là 没有.'
      },
      {
        id: 'q-111-2',
        type: 'multiple-choice',
        question: 'Khi hỏi về số thành viên trong gia đình, ta dùng lượng từ nào?',
        options: ['个 (gè)', '口 (kǒu)', '张 (zhāng)', '本 (běn)'],
        correctIndex: 1,
        explanation: 'Lượng từ chỉ thành viên gia đình là 口 (kǒu).'
      }
    ],
    step9_challenge: {
      title: 'Giới thiệu các thành viên trong gia đình bạn',
      taskDesc: 'Đọc to câu: "Wǒ jiā yǒu... kǒu rén: bàba, māma hé wǒ".',
      targetPhrase: 'wǒ jiā yǒu sì kǒu rén',
      xpReward: 50, badge: 'Gia Đình Ấm Áp'
    }
  },

  {
    id: 'l-112', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 12,
    title: 'Ngày tháng năm theo trật tự lớn đến bé',
    chineseTitle: '年月日与星期（大到小规则）',
    subtitle: 'Nắm vững quy tắc thời gian Á Đông (Năm -> Tháng -> Ngày -> Thứ) và nói ngày sinh nhật.',
    objective: 'Nói chuẩn xác ngày, tháng, năm và các thứ trong tuần (星期一 đến 星期天) theo quy tắc từ lớn đến bé.',
    prerequisite: 'Đã hoàn thành số đếm 1–99 ở Bài 109.',
    completionCriteria: 'Đạt >= 70% trắc nghiệm và nói đúng ngày hôm nay.',
    durationMinutes: 20, xpReward: 50, tags: ['HSK 1', 'Ngày tháng', 'Thứ trong tuần', 'Thời gian'],
    relatedMaterialIds: ['mat-1', 'mat-5'],
    step1_learn: {
      topic: 'Quy tắc vàng thời gian: Từ lớn đến bé (Năm ➔ Tháng ➔ Ngày ➔ Thứ)',
      summary: 'Khác với tiếng Việt (ngày trước tháng sau), tiếng Trung luôn đi từ đơn vị lớn nhất đến nhỏ nhất: 年 (nián - năm) -> 月 (yuè - tháng) -> 日/号 (rì/hào - ngày) -> 星期 (xīngqī - thứ). Thứ hai đến thứ bảy là 星期一 đến 星期六, Chủ nhật là 星期天 hoặc 星期日.',
      initialsGuide: [
        { char: '年 (nián)', read: 'Năm: 二〇二六年 (Năm 2026)' },
        { char: '月 (yuè)', read: 'Tháng: 一月 đến 十二月' },
        { char: '日 / 号 (hào)', read: 'Ngày: khẩu ngữ hay dùng 号 (hào)' },
        { char: '星期 (xīngqī)', read: 'Thứ trong tuần: 星期一 = Thứ 2; 星期天 = Chủ nhật' }
      ],
      audioDemoText: 'jīntiān shì jǐ yuè jǐ hào, jīntiān shì shí yuè jiǔ hào xīngqīwǔ'
    },
    step2_vocabulary: [
      { id: 'v-112-1', hanzi: '今天', pinyin: 'jīntiān', hanviet: 'Kim thiên', meaning: 'Hôm nay', radical: '人 (Nhân)', example: { hanzi: '今天星期五。', pinyin: 'Jīntiān xīngqīwǔ.', meaning: 'Hôm nay là thứ Sáu.' } },
      { id: 'v-112-2', hanzi: '明天', pinyin: 'míngtiān', hanviet: 'Minh thiên', meaning: 'Ngày mai', radical: '日 (Nhật)', example: { hanzi: '明天见！', pinyin: 'Míngtiān zàijiàn!', meaning: 'Ngày mai gặp lại!' } },
      { id: 'v-112-3', hanzi: '昨天', pinyin: 'zuótiān', hanviet: 'Tạc thiên', meaning: 'Hôm qua', radical: '日 (Nhật)', example: { hanzi: '昨天很冷。', pinyin: 'Zuótiān hěn lěng.', meaning: 'Hôm qua rất lạnh.' } },
      { id: 'v-112-4', hanzi: '年', pinyin: 'nián', hanviet: 'Niên', meaning: 'Năm', radical: '干 (Can)', example: { hanzi: '今年。', pinyin: 'Jīnnián.', meaning: 'Năm nay.' } },
      { id: 'v-112-5', hanzi: '月', pinyin: 'yuè', hanviet: 'Nguyệt', meaning: 'Tháng', radical: '月 (Nguyệt)', example: { hanzi: '五月。', pinyin: 'Wǔ yuè.', meaning: 'Tháng năm.' } },
      { id: 'v-112-6', hanzi: '号', pinyin: 'hào', hanviet: 'Hào', meaning: 'Ngày (mùng), số', radical: '口 (Khẩu)', example: { hanzi: '九号。', pinyin: 'Jiǔ hào.', meaning: 'Ngày 9.' } },
      { id: 'v-112-7', hanzi: '星期', pinyin: 'xīngqī', hanviet: 'Tinh kỳ', meaning: 'Tuần, thứ', radical: '日 (Nhật)', example: { hanzi: '星期天。', pinyin: 'Xīngqītiān.', meaning: 'Chủ nhật.' } }
    ],
    step3_hanzi: [
      { hanzi: '天', pinyin: 'tiān', meaning: 'Trời, ngày', strokesCount: 4, strokeOrderText: 'Ngang trên -> Ngang dưới -> Phẩy -> Mác', components: '一 + 大', mnemonic: 'Phía trên con người to lớn (大) có bầu trời cao rộng (天).' },
      { hanzi: '星', pinyin: 'xīng', meaning: 'Ngôi sao (Tinh)', strokesCount: 9, strokeOrderText: 'Bộ Nhật (日) ở trên -> Chữ Sinh (生) ở dưới', components: '日 + 生', mnemonic: 'Mặt trời sinh ra muôn vàn vì tinh tú.' }
    ],
    step4_grammar: {
      formula: 'Thời gian: Năm + 月 + Ngày/号 + 星期',
      title: 'Trật tự tư duy không gian và thời gian từ lớn đến bé',
      explanation: 'Người Trung Quốc tư duy từ tổng thể bao quát đến chi tiết: Quốc gia -> Thành phố -> Đường phố; Năm -> Tháng -> Ngày -> Giờ.',
      examples: [
        { hanzi: '2026年10月9日星期五', pinyin: 'èr líng èr liù nián shí yuè jiǔ rì xīngqīwǔ', meaning: 'Thứ Sáu, ngày 9 tháng 10 năm 2026.' }
      ],
      commonMistake: {
        wrong: 'Nói ngày trước tháng sau theo tiếng Việt: "9号10月".',
        correct: 'Bắt buộc tháng trước ngày sau: "10月9号".',
        explanation: 'Quy tắc vàng: Đơn vị lớn đứng trước, đơn vị nhỏ đứng sau.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '请问，今天几月几号？星期几？', pinyin: 'Qǐngwèn, jīntiān jǐ yuè jǐ hào? Xīngqī jǐ?', meaning: 'Xin hỏi, hôm nay ngày mấy tháng mấy? Thứ mấy?' },
        { speaker: 'B', hanzi: '今天十月九号，星期五。', pinyin: 'Jīntiān shí yuè jiǔ hào, xīngqīwǔ.', meaning: 'Hôm nay ngày 9 tháng 10, thứ Sáu.' }
      ],
      audioText: '今天十月九号，星期五。',
      question: 'Hôm nay là thứ mấy trong tuần?',
      options: ['Thứ Năm', 'Thứ Sáu (xīngqīwǔ)', 'Thứ Bảy', 'Chủ nhật'],
      correctIndex: 1,
      explanation: '星期五 tương ứng với Thứ Sáu trong tiếng Việt (xīngqīyī là Thứ 2).'
    },
    step6_speaking: {
      prompt: 'Hãy nói ngày hôm nay (Ví dụ: Hôm nay là thứ Sáu):',
      targetSentence: '今天星期五。',
      targetPinyin: 'Jīntiān xīngqīwǔ.',
      targetMeaning: 'Hôm nay là thứ Sáu.',
      hint: 'Phát âm chuẩn xīngqī với thanh 1 đều đặn.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Ngày mai là ngày 10 tháng 10"',
      words: ['明天', '十月', '是', '十号'],
      correctOrder: ['明天', '是', '十月', '十号'],
      explanation: 'Chủ ngữ 明天 + 是 + Tháng 十月 + Ngày 十号.'
    },
    step8_quiz: [
      {
        id: 'q-112-1',
        type: 'multiple-choice',
        question: 'Trong tiếng Trung, "Thứ Hai" được gọi là gì?',
        options: ['星期一 (xīngqīyī)', '星期二 (xīngqī\'èr)', '星期天 (xīngqītiān)', '星期日 (xīngqīrì)'],
        correctIndex: 0,
        explanation: 'Thứ 2 là ngày đầu tuần đếm từ 1: 星期一.'
      },
      {
        id: 'q-112-2',
        type: 'multiple-choice',
        question: 'Trật tự đúng khi diễn đạt "Ngày 1 tháng 1" là:',
        options: ['一号一月', '一月一号', '一月号一', '号一一月'],
        correctIndex: 1,
        explanation: 'Tháng lớn hơn ngày nên viết: 一月一号 (Yī yuè yī hào).'
      }
    ],
    step9_challenge: {
      title: 'Đọc trọn vẹn ngày tháng năm sinh của bạn',
      taskDesc: 'Đọc to theo đúng trật tự: Năm... Tháng... Ngày...',
      targetPhrase: 'nián yuè hào xīngqī',
      xpReward: 50, badge: 'Làm Chủ Lịch Trình'
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
      summary: 'Cấu trúc giờ: [Số] + 点 (giờ) + [Số] + 分 (phút). Giờ rưỡi dùng 半 (bàn - 30 phút). Điểm thời gian luôn đứng TRƯỚC động từ.',
      initialsGuide: [
        { char: '点 (diǎn)', read: 'Giờ: 八点 (8 giờ)' },
        { char: '分 (fēn)', read: 'Phút: 八点十分 (8 giờ 10 phút)' },
        { char: '半 (bàn)', read: 'Rưỡi: 八点半 (8 giờ rưỡi)' }
      ],
      audioDemoText: 'xiànzài jǐ diǎn, xiànzài bā diǎn bàn, wǒ bā diǎn qù xuéxiào'
    },
    step2_vocabulary: [
      { id: 'v-113-1', hanzi: '现在', pinyin: 'xiànzài', hanviet: 'Hiện tại', meaning: 'Bây giờ, hiện nay', radical: '王 (Ngọc)', example: { hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', meaning: 'Bây giờ mấy giờ rồi?' } },
      { id: 'v-113-2', hanzi: '点', pinyin: 'diǎn', hanviet: 'Điểm', meaning: 'Giờ', radical: '灬 (Hỏa)', example: { hanzi: '三点。', pinyin: 'Sān diǎn.', meaning: 'Ba giờ.' } },
      { id: 'v-113-3', hanzi: '分', pinyin: 'fēn', hanviet: 'Phân', meaning: 'Phút', radical: '刀 (Đao)', example: { hanzi: '十分。', pinyin: 'Shí fēn.', meaning: 'Mười phút.' } },
      { id: 'v-113-4', hanzi: '半', pinyin: 'bàn', hanviet: 'Bán', meaning: 'Rưỡi, một nửa', radical: '十 (Thập)', example: { hanzi: '两点半。', pinyin: 'Liǎng diǎn bàn.', meaning: 'Hai giờ rưỡi.' } },
      { id: 'v-113-5', hanzi: '去', pinyin: 'qù', hanviet: 'Khứ', meaning: 'Đi', radical: '厶 (Khứ)', example: { hanzi: '去学校。', pinyin: 'Qù xuéxiào.', meaning: 'Đi trường học.' } }
    ],
    step3_hanzi: [
      { hanzi: '分', pinyin: 'fēn', meaning: 'Chia, phút', strokesCount: 4, strokeOrderText: 'Bát (八) ở trên -> Dao (刀) ở dưới', components: '八 + 刀', mnemonic: 'Dùng con dao (刀) chia đôi (八) một vật ra từng phần nhỏ.' },
      { hanzi: '半', pinyin: 'bàn', meaning: 'Một nửa (Bán)', strokesCount: 5, strokeOrderText: 'Chấm -> Phẩy -> Ngang ngắn -> Ngang dài -> Sổ', components: 'Bộ Thập', mnemonic: 'Chẻ một nửa đồ vật theo trục sổ dọc.' }
    ],
    step4_grammar: {
      formula: 'Trật tự: Chủ ngữ + [Thời gian] + Động từ + Tân ngữ',
      title: 'Thời gian luôn đứng TRƯỚC hành động trong tiếng Trung',
      explanation: 'Trong tiếng Việt ta có thể nói "Tôi đi học lúc 8 giờ" (thời gian ở cuối), nhưng trong tiếng Trung THỜI GIAN BẮT BUỘC ĐỨNG TRƯỚC ĐỘNG TỪ.',
      examples: [
        { hanzi: '我八点去学校。', pinyin: 'Wǒ bā diǎn qù xuéxiào.', meaning: 'Tôi 8 giờ đi học (KHÔNG NÓI: 我去学校八点 ❌).' }
      ],
      commonMistake: {
        wrong: '我去学校八点 ❌ (Dịch word-by-word từ tiếng Việt).',
        correct: '我八点去学校 ✔️ (Thời gian đứng trước hành động).',
        explanation: 'Quy tắc bất di bất dịch: Bối cảnh thời gian phải xác lập trước khi hành động diễn ra.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '请问，现在几点？', pinyin: 'Qǐngwèn, xiànzài jǐ diǎn?', meaning: 'Xin hỏi, bây giờ mấy giờ rồi?' },
        { speaker: 'B', hanzi: '现在七点半，我们要去学校了。', pinyin: 'Xiànzài qī diǎn bàn, wǒmen yào qù xuéxiào le.', meaning: 'Bây giờ 7 giờ rưỡi, chúng ta phải đến trường rồi.' }
      ],
      audioText: '现在七点半，我们要去学校了。',
      question: 'Bây giờ là mấy giờ?',
      options: ['6 giờ rưỡi', '7 giờ rưỡi (qī diǎn bàn)', '8 giờ đúng', '7 giờ 15'],
      correctIndex: 1,
      explanation: 'Người B nói: "现在七点半" (7 giờ rưỡi).'
    },
    step6_speaking: {
      prompt: 'Nói câu hỏi giờ giấc thông dụng nhất:',
      targetSentence: '现在几点？',
      targetPinyin: 'Xiànzài jǐ diǎn?',
      targetMeaning: 'Bây giờ mấy giờ rồi?',
      hint: 'Hỏi tự nhiên với ngữ điệu nhẹ nhàng.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Tôi 8 giờ đi trường học"',
      words: ['去学校', '我', '八点'],
      correctOrder: ['我', '八点', '去学校'],
      explanation: 'Trật tự: Chủ ngữ 我 + Thời gian 八点 + Động từ tân ngữ 去学校.'
    },
    step8_quiz: [
      {
        id: 'q-113-1',
        type: 'multiple-choice',
        question: 'Dịch câu sau sang tiếng Trung: "Tôi ăn cơm lúc 12 giờ."',
        options: ['我吃饭十二点。', '我十二点吃饭。', '十二点我饭吃。', '饭吃我十二点。'],
        correctIndex: 1,
        explanation: 'Thời gian 十二点 bắt buộc đứng trước hành động 吃饭.'
      },
      {
        id: 'q-113-2',
        type: 'multiple-choice',
        question: 'Cụm từ "两点半" mang ý nghĩa gì?',
        options: ['12 giờ', '2 giờ rưỡi', '2 giờ 10 phút', '3 giờ kém 15'],
        correctIndex: 1,
        explanation: '两点半 là 2 giờ rưỡi (chú ý số 2 đi với lượng từ giờ dùng liǎng, không dùng èr).'
      }
    ],
    step9_challenge: {
      title: 'Báo giờ hiện tại trên đồng hồ của bạn',
      taskDesc: 'Nhìn đồng hồ và nói to: "Xiànzài... diǎn... fēn".',
      targetPhrase: 'xiànzài jǐ diǎn bā diǎn bàn',
      xpReward: 50, badge: 'Đúng Giờ Chuẩn Xác'
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
      summary: 'Khi diễn tả làm việc gì ở đâu, cấu trúc tiếng Trung là: [Ở Đ U] TRƯỚC ➔ [LÀM GÌ] SAU. Công thức: Chủ ngữ + 在 + Địa điểm + Động từ.',
      initialsGuide: [
        { char: '在哪儿 (zài nǎr)', read: 'Ở đâu? (Bắc Kinh hay thêm âm uốn lưỡi er)' },
        { char: '学校 (xuéxiào)', read: 'Trường học' },
        { char: '医院 (yīyuàn)', read: 'Bệnh viện' },
        { char: '商店 (shāngdiàn)', read: 'Cửa hàng' }
      ],
      audioDemoText: 'nǐ zài nǎr, wǒ zài xuéxiào, wǒ zài xuéxiào kàn shū'
    },
    step2_vocabulary: [
      { id: 'v-114-1', hanzi: '在', pinyin: 'zài', hanviet: 'Tại', meaning: 'Ở, tại', radical: '土 (Thổ)', example: { hanzi: '你在哪儿？', pinyin: 'Nǐ zài nǎr?', meaning: 'Bạn đang ở đâu?' } },
      { id: 'v-114-2', hanzi: '哪儿', pinyin: 'nǎr', hanviet: 'Nả nhi', meaning: 'Ở đâu, chỗ nào', radical: '口 (Khẩu)', example: { hanzi: '他在哪儿？', pinyin: 'Tā zài nǎr?', meaning: 'Anh ấy ở đâu?' } },
      { id: 'v-114-3', hanzi: '学校', pinyin: 'xuéxiào', hanviet: 'Học hiệu', meaning: 'Trường học', radical: '木 (Mộc)', example: { hanzi: '我去学校。', pinyin: 'Wǒ qù xuéxiào.', meaning: 'Tôi đi trường học.' } },
      { id: 'v-114-4', hanzi: '医院', pinyin: 'yīyuàn', hanviet: 'Y viện', meaning: 'Bệnh viện', radical: '阝 (Phụ)', example: { hanzi: '妈妈在医院。', pinyin: 'Māma zài yīyuàn.', meaning: 'Mẹ đang ở bệnh viện.' } },
      { id: 'v-114-5', hanzi: '看书', pinyin: 'kàn shū', hanviet: 'Khán thư', meaning: 'Đọc sách', radical: '目 (Mục)', example: { hanzi: '我在家看书。', pinyin: 'Wǒ zài jiā kàn shū.', meaning: 'Tôi ở nhà đọc sách.' } }
    ],
    step3_hanzi: [
      { hanzi: '在', pinyin: 'zài', meaning: 'Ở tại', strokesCount: 6, strokeOrderText: 'Ngang -> Phẩy -> Sổ -> Ngang -> Sổ -> Ngang đáy bộ Thổ', components: '土 (Đất)', mnemonic: 'Đứng vững vàng chân trên mặt đất (土).' },
      { hanzi: '看', pinyin: 'kàn', meaning: 'Nhìn, xem, đọc', strokesCount: 9, strokeOrderText: 'Bộ Thủ (手 - bàn tay) ở trên -> Bộ Mục (目 - con mắt) ở dưới', components: '手 + 目', mnemonic: 'Đưa bàn tay lên trán che mắt để nhìn ngắm từ xa.' }
    ],
    step4_grammar: {
      formula: 'Chủ ngữ + 在 + Địa điểm + Động từ + Tân ngữ',
      title: 'Địa điểm luôn đứng TRƯỚC hành động',
      explanation: 'Người Việt hay nói: "Tôi đọc sách ở trường" (hành động trước, nơi chốn sau). Nhưng trong tiếng Trung BẮT BUỘC NÓI: "Tôi ở trường đọc sách".',
      examples: [
        { hanzi: '我在学校看书。', pinyin: 'Wǒ zài xuéxiào kàn shū.', meaning: 'Tôi ở trường đọc sách (KHÔNG NÓI: 我看书在学校 ❌).' }
      ],
      commonMistake: {
        wrong: '我看书在学校 ❌ (Sai trật tự nghiêm trọng).',
        correct: '我在学校看书 ✔️ (Nơi chốn 在 xuéxiào đứng trước kàn shū).',
        explanation: 'Quy tắc: Phải đến địa điểm đó rồi mới thực hiện hành động.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '喂，你在哪儿呢？', pinyin: 'Wèi, nǐ zài nǎr ne?', meaning: 'Alo, bạn đang ở đâu thế?' },
        { speaker: 'B', hanzi: '我在学校图书馆看书呢，你来吗？', pinyin: 'Wǒ zài xuéxiào túshūguǎn kàn shū ne, nǐ lái ma?', meaning: 'Tôi đang đọc sách ở thư viện trường, bạn đến không?' }
      ],
      audioText: '我在学校图书馆看书呢，你来吗？',
      question: 'Người B đang làm gì ở thư viện trường học?',
      options: ['Uống cà phê', 'Đọc sách (kàn shū)', 'Ngủ trưa', 'Nói chuyện điện thoại'],
      correctIndex: 1,
      explanation: 'Người B nói: "我在学校图书馆看书" (Đọc sách).'
    },
    step6_speaking: {
      prompt: 'Hỏi bạn bè đang ở đâu:',
      targetSentence: '你在哪儿？',
      targetPinyin: 'Nǐ zài nǎr?',
      targetMeaning: 'Bạn đang ở đâu?',
      hint: 'Uốn lưỡi nhẹ âm nǎr ở cuối câu.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Mẹ tôi làm việc ở bệnh viện"',
      words: ['在医院', '我妈妈', '工作'],
      correctOrder: ['我妈妈', '在医院', '工作'],
      explanation: 'Trật tự: 我妈妈 (Mẹ tôi) + 在医院 (Ở bệnh viện) + 工作 (Làm việc).'
    },
    step8_quiz: [
      {
        id: 'q-114-1',
        type: 'multiple-choice',
        question: 'Dịch câu đúng chuẩn ngữ pháp: "Chúng tôi uống trà ở nhà."',
        options: ['我们喝茶在家。', '我们在家喝茶。', '在家我们喝茶。', '喝茶我们在家。'],
        correctIndex: 1,
        explanation: 'Cấu trúc chuẩn: Chủ ngữ 我们 + 在家 (ở nhà) + 喝茶 (uống trà).'
      },
      {
        id: 'q-114-2',
        type: 'multiple-choice',
        question: 'Từ "哪儿" (nǎr) dùng để hỏi về điều gì?',
        options: ['Thời gian', 'Địa điểm, nơi chốn', 'Giá tiền', 'Tuổi tác'],
        correctIndex: 1,
        explanation: '哪儿 là đại từ nghi vấn hỏi về nơi chốn (ở đâu).'
      }
    ],
    step9_challenge: {
      title: 'Báo vị trí và việc bạn đang làm',
      taskDesc: 'Nói to câu: "Wǒ zài jiā xué Hànyǔ" (Tôi ở nhà học tiếng Trung).',
      targetPhrase: 'wǒ zài jiā xué Hànyǔ',
      xpReward: 50, badge: 'Định Vị Không Gian'
    }
  },

  {
    id: 'l-115', chapterId: 'ch-3', levelId: 'lvl-1', lessonNumber: 15,
    title: 'Mua sắm cơ bản & Hỏi giá tiền 多少钱',
    chineseTitle: '基础购物与询价（多少钱、块）',
    subtitle: 'Hỏi giá tiền (这个多少钱), tiền tệ (块/元) và cách khen chê đắt rẻ (太贵了) khi mua sắm.',
    objective: 'Hỏi giá hàng hóa thành thạo, hiểu mệnh giá tiền tệ Trung Quốc (块 - tệ) và nói câu cảm thán 太...了.',
    prerequisite: 'Đã hoàn thành số đếm và Bài 114.',
    completionCriteria: 'Đạt >= 80% bài tập tình huống mua sắm và hỏi giá.',
    durationMinutes: 25, xpReward: 60, tags: ['HSK 1', 'Mua sắm', 'Hỏi giá tiền', 'Review Checkpoint'],
    relatedMaterialIds: ['mat-1', 'mat-2', 'mat-5'],
    step1_learn: {
      topic: 'Hỏi giá tiền với 多少钱 (duōshao qián) & Cụm cảm thán 太...了',
      summary: 'Công thức hỏi giá: [Đồ vật] + 多少钱？ Tiền tệ trong khẩu ngữ gọi là 块 (kuài) thay cho chữ 元 (yuán) trên văn bản. Khi thấy đắt: 太贵了 (Tài guì le - Đắt quá!).',
      initialsGuide: [
        { char: '多少钱 (duōshao qián)', read: 'Bao nhiêu tiền?' },
        { char: '块 (kuài)', read: 'Đồng / Tệ (Khẩu ngữ)' },
        { char: '太贵了 (tài guì le)', read: 'Đắt quá rồi!' }
      ],
      audioDemoText: 'zhège duōshao qián, zhège shí kuài qián, tài guì le'
    },
    step2_vocabulary: [
      { id: 'v-115-1', hanzi: '多少', pinyin: 'duōshao', hanviet: 'Đa thiểu', meaning: 'Bao nhiêu (số lượng lớn)', radical: '夕 (Tịch)', example: { hanzi: '多少人？', pinyin: 'Duōshao rén?', meaning: 'Bao nhiêu người?' } },
      { id: 'v-115-2', hanzi: '钱', pinyin: 'qián', hanviet: 'Tiền', meaning: 'Tiền', radical: '钅 (Kim)', example: { hanzi: '我有钱。', pinyin: 'Wǒ yǒu qián.', meaning: 'Tôi có tiền.' } },
      { id: 'v-115-3', hanzi: '块', pinyin: 'kuài', hanviet: 'Khối', meaning: 'Đồng, tệ (đơn vị tiền tệ)', radical: '土 (Thổ)', example: { hanzi: '五块钱。', pinyin: 'Wǔ kuài qián.', meaning: 'Năm tệ.' } },
      { id: 'v-115-4', hanzi: '太...了', pinyin: 'tài...le', hanviet: 'Thái... liễu', meaning: 'Quá... rồi (cảm thán)', radical: '大 (Đại)', example: { hanzi: '太好了！', pinyin: 'Tài hǎo le!', meaning: 'Tốt quá rồi!' } },
      { id: 'v-115-5', hanzi: '买', pinyin: 'mǎi', hanviet: 'Mãi', meaning: 'Mua', radical: '乙 (Ất)', example: { hanzi: '买水果。', pinyin: 'Mǎi shuǐguǒ.', meaning: 'Mua hoa quả.' } }
    ],
    step3_hanzi: [
      { hanzi: '钱', pinyin: 'qián', meaning: 'Tiền bạc', strokesCount: 10, strokeOrderText: 'Bộ Kim (钅) bên trái -> Hai nét ngang gập bên phải', components: '钅 + 戋', mnemonic: 'Kim loại vàng bạc quý giá (钅) thời xưa được đúc thành tiền.' },
      { hanzi: '买', pinyin: 'mǎi', meaning: 'Mua', strokesCount: 6, strokeOrderText: 'Ngang móc -> Chấm -> Phẩy -> Chấm', components: 'Bộ Ất', mnemonic: 'Bỏ tiền ra mua đồ mang về nhà.' }
    ],
    step4_grammar: {
      formula: 'Cấu trúc cảm thán: 太 + Tính từ + 了！ (Ví dụ: 太大 / 太贵 / 太好)',
      title: 'Mẫu câu cảm thán kinh điển 太...了',
      explanation: 'Trong tiếng Trung, phó từ 太 luôn đi kèm với trợ từ ngữ khí 了 ở cuối câu để biểu thị mức độ cực độ hoặc sự cảm thán.',
      examples: [
        { hanzi: '这个苹果太甜了！', pinyin: 'Zhè ge píngguǒ tài tián le!', meaning: 'Quả táo này ngọt quá!' },
        { hanzi: '太贵了，不买！', pinyin: 'Tài guì le, bù mǎi!', meaning: 'Đắt quá, không mua đâu!' }
      ],
      commonMistake: {
        wrong: 'Quên chữ 了 ở cuối câu: "太贵" (thiếu tự nhiên).',
        correct: 'Bắt buộc đi cặp: "太贵了！"',
        explanation: 'Cặp liên kết 太...了 là cấu trúc ngữ pháp cố định HSK 1.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '老板，请问这个杯子多少钱？', pinyin: 'Lǎobǎn, qǐngwèn zhè ge bēizi duōshao qián?', meaning: 'Ông chủ ơi, xin hỏi cái cốc này bao nhiêu tiền?' },
        { speaker: 'B', hanzi: '二十五块钱一个。', pinyin: 'Èrshíwǔ kuài qián yí gè.', meaning: 'Hai mươi lăm tệ một cái.' },
        { speaker: 'A', hanzi: '太贵了！二十块可以吗？', pinyin: 'Tài guì le! Èrshí kuài kěyǐ ma?', meaning: 'Đắt quá! Hai mươi tệ được không ạ?' }
      ],
      audioText: '老板，请问这个杯子多少钱？二十五块钱一个。太贵了！',
      question: 'Chiếc cốc ban đầu người bán ra giá bao nhiêu tiền?',
      options: ['15 tệ', '20 tệ', '25 tệ (èrshíwǔ kuài)', '50 tệ'],
      correctIndex: 2,
      explanation: 'Chủ quán báo: "二十五块钱一个" (25 tệ).'
    },
    step6_speaking: {
      prompt: 'Hỏi giá tiền món đồ trước mặt bạn:',
      targetSentence: '这个多少钱？',
      targetPinyin: 'Zhè ge duōshao qián?',
      targetMeaning: 'Cái này bao nhiêu tiền?',
      hint: 'Đọc âm duōshao với thanh nhẹ ở chữ shao.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Cái này đắt quá rồi"',
      words: ['太贵了', '这个'],
      correctOrder: ['这个', '太贵了'],
      explanation: 'Chủ ngữ 这个 + Vị ngữ cảm thán 太贵了.'
    },
    step8_quiz: [
      {
        id: 'q-115-1',
        type: 'multiple-choice',
        question: 'Trong khẩu ngữ đời sống, người Trung Quốc dùng từ nào để gọi đơn vị tiền tệ "Tệ"?',
        options: ['元 (yuán)', '块 (kuài)', '角 (jiǎo)', '分 (fēn)'],
        correctIndex: 1,
        explanation: 'Khẩu ngữ luôn dùng 块 (kuài): 10 tệ = 十块钱.'
      },
      {
        id: 'q-115-2',
        type: 'multiple-choice',
        question: 'Cụm từ "太好了！" (Tài hǎo le!) mang ý nghĩa gì?',
        options: ['Đắt quá rồi!', 'Tốt quá rồi / Tuyệt vời!', 'Xấu quá rồi!', 'Không tốt chút nào!'],
        correctIndex: 1,
        explanation: '太好了 mang nghĩa Tốt quá / Tuyệt quá rồi.'
      }
    ],
    step9_challenge: {
      title: 'Mở khóa Boss Chapter 3',
      taskDesc: 'Hoàn thành bài tập để sẵn sàng khiêu chiến thử thách mua sắm tại chợ Bắc Kinh!',
      targetPhrase: 'zhè ge duōshao qián tài guì le',
      xpReward: 60, badge: 'Thánh Mặc Cả Sơ Cấp'
    }
  }
];

console.log(`Writing curriculum extension... initial: ${initialLessons.length}, blueprint: ${rawCurriculumSpecs.length}`);
