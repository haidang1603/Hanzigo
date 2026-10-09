// =========================================================================
// HANZIGO RESEARCH-BASED CHINESE CURRICULUM LESSONS (LEVELS 1 - 3: 60 LESSONS)
// Aligned with docs/HANZIGO_CHINESE_CURRICULUM.md v2.0
// Features 9-step pedagogical architecture:
// Objectives, Prerequisites, Han-Viet lever, Grammar pitfall alerts,
// Audio scripts, Voice recognition, Sentence formation, Quizzes with rationale
// =========================================================================

export const CURRICULUM_60_LESSONS = [
  // =======================================================================
  // LEVEL 1: KHỞI ĐẦU & NỀN MÓNG (20 LESSONS | MODULE 1.1 - 1.4)
  // =======================================================================

  // --- MODULE 1.1: Ngữ âm Pinyin & Thuận bút Chữ Hán (Bài 101-105) ---
  {
    id: 'l-101',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 1,
    title: '4 Thanh điệu & Nhóm thanh mẫu môi - đầu lưỡi',
    chineseTitle: '四声与声母b, p, m, f; d, t, n, l',
    subtitle: 'Nắm vững 4 cao độ thanh điệu chuẩn Bắc Kinh và phát âm chuẩn xác các âm môi, âm đầu lưỡi.',
    objective: 'Nhận diện chuẩn 4 thanh điệu tiếng Trung, phân biệt âm bật hơi p/b và phát âm chính xác thanh mẫu b, p, m, f; d, t, n, l.',
    prerequisite: 'Không có (Bắt đầu từ con số 0)',
    completionCriteria: 'Đạt tối thiểu 70% điểm trắc nghiệm và đọc đúng mẫu câu phát âm.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Pinyin', 'Thanh điệu', 'Phát âm'],
    relatedMaterialIds: ['mat-1', 'mat-8'],

    step1_learn: {
      topic: '4 Thanh điệu căn bản & Nhóm thanh mẫu môi - đầu lưỡi',
      summary: 'Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ. Độ cao của thanh điệu quyết định nghĩa của từ.',
      toneGuide: [
        { tone: 1, name: 'Thanh 1 (mā, 5-5)', pitch: '5-5', symbol: 'ā', desc: 'Cao và phẳng, giữ đều hơi như nốt Sol', example: 'mā (Mẹ)' },
        { tone: 2, name: 'Thanh 2 (má, 3-5)', pitch: '3-5', symbol: 'á', desc: 'Vút từ vừa lên cao, giống dấu sắc tiếng Việt', example: 'má (Cây gai)' },
        { tone: 3, name: 'Thanh 3 (mǎ, 2-1-4)', pitch: '2-1-4', symbol: 'ǎ', desc: 'Xuống đáy cổ họng rồi hơi vút lên', example: 'mǎ (Ngựa)' },
        { tone: 4, name: 'Thanh 4 (mà, 5-1)', pitch: '5-1', symbol: 'à', desc: 'Rơi thẳng dứt khoát từ đỉnh xuống đáy, KHÔNG đọc thành dấu huyền tiếng Việt', example: 'mà (Mắng)' }
      ],
      initialsGuide: [
        { char: 'b', read: 'Giống chữ [P] nhẹ tiếng Việt, không bật hơi', example: 'bā (Số 8)' },
        { char: 'p', read: 'Bật hơi mạnh luồng gió từ hai môi (tờ giấy ăn phải bay)', example: 'pà (Sợ)' },
        { char: 'd', read: 'Đọc giống chữ [T] tiếng Việt (không bật hơi)', example: 'dà (To lớn)' },
        { char: 't', read: 'Đọc giống chữ [Th] tiếng Việt (bật hơi)', example: 'tā (Anh ấy)' }
      ],
      audioDemoText: 'bā pá mǎ mà dà tā'
    },
    step2_vocabulary: [
      { id: 'v-101-1', hanzi: '八', pinyin: 'bā', hanviet: 'Bát', meaning: 'Số 8', radical: '八 (Bát)', example: { hanzi: '八本书。', pinyin: 'Bā běn shū.', meaning: 'Tám quyển sách.' } },
      { id: 'v-101-2', hanzi: '爸爸', pinyin: 'bàba', hanviet: 'Ba ba', meaning: 'Bố, ba', radical: '父 (Phụ)', example: { hanzi: '爸爸很大。', pinyin: 'Bàba hěn dà.', meaning: 'Bố to lớn.' } },
      { id: 'v-101-3', hanzi: '妈妈', pinyin: 'māma', hanviet: 'Ma ma', meaning: 'Mẹ', radical: '女 (Nữ)', example: { hanzi: '妈妈好。', pinyin: 'Māma hǎo.', meaning: 'Mẹ tốt đẹp.' } },
      { id: 'v-101-4', hanzi: '大', pinyin: 'dà', hanviet: 'Đại', meaning: 'To, lớn', radical: '大 (Đại)', example: { hanzi: '很大。', pinyin: 'Hěn dà.', meaning: 'Rất to lớn.' } },
      { id: 'v-101-5', hanzi: '不', pinyin: 'bù', hanviet: 'Bất', meaning: 'Không (phủ định)', radical: '一 (Nhất)', example: { hanzi: '不大。', pinyin: 'Bú dà.', meaning: 'Không to.' } }
    ],
    step3_hanzi: [
      { hanzi: '八', pinyin: 'bā', meaning: 'Số 8', strokesCount: 2, strokeOrderText: 'Phẩy trước (丿), mác sau (乀)', components: 'Bộ Bát (八)', mnemonic: 'Hai nét mở rộng sang hai phía thể hiện sự phân tách.' },
      { hanzi: '大', pinyin: 'dà', meaning: 'To lớn', strokesCount: 3, strokeOrderText: 'Ngang (一) -> Phẩy (丿) -> Mác (乀)', components: 'Bộ Đại (大)', mnemonic: 'Hình tượng người dang rộng hai tay và hai chân.' }
    ],
    step4_grammar: {
      formula: 'Chủ ngữ + 不 (bù) + Tính từ / Động từ',
      title: 'Phủ định với phó từ 不 (bù)',
      explanation: 'Từ 不 luôn đứng trước tính từ hoặc động từ để biểu thị sự phủ định.',
      examples: [
        { hanzi: '爸爸不大。', pinyin: 'Bàba bú dà.', meaning: 'Bố không to lớn.' },
        { hanzi: '我不去。', pinyin: 'Wǒ bú qù.', meaning: 'Tôi không đi.' }
      ],
      commonMistake: {
        wrong: 'Đọc thanh 4 thành dấu huyền tiếng Việt (dà đọc thành đà).',
        correct: 'Phát âm dứt khoát rơi từ cao độ 5 xuống 1: dà (Đại).',
        explanation: 'Thanh 4 tiếng Trung cần lực rơi dứt khoát, không kéo dài ngân êm như dấu huyền.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '爸爸大吗？', pinyin: 'Bàba dà ma?', meaning: 'Bố to lớn không?' },
        { speaker: 'B', hanzi: '爸爸不大，妈妈大。', pinyin: 'Bàba bú dà, māma dà.', meaning: 'Bố không to, mẹ to lớn.' }
      ],
      audioText: '爸爸大吗？爸爸不大，妈妈大。',
      question: 'Theo bài nghe, người bố như thế nào?',
      options: ['Bố to lớn', 'Bố không to lớn', 'Bố rất bận', 'Bố đang đi học'],
      correctIndex: 1,
      explanation: 'Người B nói "爸爸不大" (Bàba bú dà - Bố không to lớn).'
    },
    step6_speaking: {
      prompt: 'Hãy đọc to mẫu câu phát âm chuẩn thanh điệu:',
      targetSentence: '爸爸不大。',
      targetPinyin: 'Bàba bú dà.',
      targetMeaning: 'Bố không to lớn.',
      hint: 'Chú ý biến điệu chữ 不 đứng trước thanh 4 đọc thành "bú".'
    },
    step7_writing: {
      prompt: 'Sắp xếp các từ thành câu phủ định hoàn chỉnh: "Bố không to lớn"',
      words: ['大', '不', '爸爸'],
      correctOrder: ['爸爸', '不', '大'],
      explanation: 'Trật tự: Chủ ngữ 爸爸 + Phó từ phủ định 不 + Tính từ 大.'
    },
    step8_quiz: [
      {
        id: 'q-101-1',
        type: 'multiple-choice',
        question: 'Thanh mẫu nào sau đây là âm bật hơi mạnh đẩy luồng gió ra môi?',
        options: ['b', 'p', 'm', 'd'],
        correctIndex: 1,
        explanation: 'Âm "p" là âm bật hơi mạnh, khi phát âm giấy ăn trước môi sẽ bay mạnh.'
      },
      {
        id: 'q-101-2',
        type: 'multiple-choice',
        question: 'Chữ "不" khi đứng trước âm mang thanh 4 (ví dụ: 大 dà) sẽ đọc biến điệu thành thanh mấy?',
        options: ['Thanh 1 (bū)', 'Thanh 2 (bú)', 'Thanh 3 (bǔ)', 'Giữ nguyên thanh 4 (bù)'],
        correctIndex: 1,
        explanation: 'Chữ 不 (bù) khi đứng trước từ mang thanh 4 bắt buộc biến điệu thành thanh 2: bú dà.'
      }
    ],
    step9_challenge: {
      title: 'Luyện 4 thanh điệu chuẩn xác trong 10 giây',
      taskDesc: 'Đọc to 4 thanh điệu của âm "ma": mā - má - mǎ - mà.',
      targetPhrase: 'mā má mǎ mà',
      xpReward: 50,
      badge: 'Khởi Đầu Phát Âm Chuẩn'
    }
  },

  {
    id: 'l-102',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 2,
    title: 'Vận mẫu đơn a, o, e, i, u, ü & 8 Nét chữ Hán cơ bản',
    chineseTitle: '单韵母与汉字八大基本笔画',
    subtitle: 'Nắm vững 6 nguyên âm đơn cốt lõi và làm chủ 8 nét bút nền móng để viết mọi chữ Hán.',
    objective: 'Phát âm chuẩn vận mẫu tròn môi ü, nhận diện và viết đúng 8 nét cơ bản: Ngang, Sổ, Phẩy, Mác, Hất, Chấm, Gập, Móc.',
    prerequisite: 'Đã hoàn thành Bài 101 về thanh mẫu và thanh điệu.',
    completionCriteria: 'Đạt >= 70% trắc nghiệm nhận diện nét chữ và nguyên âm ü.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Vận mẫu', 'Nét chữ Hán', 'Bút thuận'],
    relatedMaterialIds: ['mat-4', 'mat-9'],

    step1_learn: {
      topic: '6 Vận mẫu đơn & 8 Nét chữ Hán cơ bản',
      summary: 'Vận mẫu đơn gồm a, o, e, i, u, ü. Đặc biệt âm ü cần giữ khẩu hình tròn môi từ đầu đến cuối.',
      toneGuide: [
        { tone: 1, name: 'Âm ü tròn môi', pitch: '5-5', symbol: 'ǖ', desc: 'Phát âm chữ [i] nhưng giữ khẩu hình môi tròn chúm lại như chữ [u]', example: 'nǚ (Nữ - phụ nữ)' }
      ],
      initialsGuide: [
        { char: 'Nét Ngang (横)', read: 'Viết từ trái qua phải, hơi chếch nhẹ lên', example: '一 (Nhất)' },
        { char: 'Nét Sổ (竖)', read: 'Kéo thẳng từ trên xuống dưới vuông vức', example: '十 (Thập)' },
        { char: 'Nét Phẩy (撇)', read: 'Kéo từ trên xiên thoai thoải sang trái', example: '八 (Bát)' },
        { char: 'Nét Mác (捺)', read: 'Kéo từ trên xiên thoai thoải sang phải', example: '人 (Nhân)' }
      ],
      audioDemoText: 'a o e i u ü nǚ lǜ'
    },
    step2_vocabulary: [
      { id: 'v-102-1', hanzi: '一', pinyin: 'yī', hanviet: 'Nhất', meaning: 'Số 1', radical: '一 (Nhất)', example: { hanzi: '一个人。', pinyin: 'Yí gè rén.', meaning: 'Một người.' } },
      { id: 'v-102-2', hanzi: '五', pinyin: 'wǔ', hanviet: 'Ngũ', meaning: 'Số 5', radical: '二 (Nhị)', example: { hanzi: '五天。', pinyin: 'Wǔ tiān.', meaning: 'Năm ngày.' } },
      { id: 'v-102-3', hanzi: '女', pinyin: 'nǚ', hanviet: 'Nữ', meaning: 'Nữ, phụ nữ, con gái', radical: '女 (Nữ)', example: { hanzi: '她是女人。', pinyin: 'Tā shì nǚrén.', meaning: 'Cô ấy là phụ nữ.' } },
      { id: 'v-102-4', hanzi: '口', pinyin: 'kǒu', hanviet: 'Khẩu', meaning: 'Miệng, lượng từ người trong gia đình', radical: '口 (Khẩu)', example: { hanzi: '三口人。', pinyin: 'Sān kǒu rén.', meaning: 'Ba người trong nhà.' } }
    ],
    step3_hanzi: [
      { hanzi: '一', pinyin: 'yī', meaning: 'Số 1', strokesCount: 1, strokeOrderText: 'Nét ngang duy nhất (横)', components: 'Bộ Nhất (一)', mnemonic: 'Một nét ngang tượng trưng cho sự khởi đầu vạn vật.' },
      { hanzi: '口', pinyin: 'kǒu', meaning: 'Cái miệng', strokesCount: 3, strokeOrderText: 'Sổ -> Ngang gập -> Ngang đóng đáy', components: 'Bộ Khẩu (口)', mnemonic: 'Hình vẽ chiếc miệng mở vuông vức.' }
    ],
    step4_grammar: {
      formula: 'Quy tắc thuận bút cơ bản: Ngang trước sổ sau (一 ➔ 十)',
      title: 'Quy tắc vào nhà đóng cửa chữ Hán',
      explanation: 'Khi viết chữ có khung bao quanh như 口, 日, 四: Viết khung ngoài trước, viết ruột bên trong rồi mới viết nét ngang đóng đáy sau cùng.',
      examples: [
        { hanzi: '十 (Thập - Số 10)', pinyin: 'shí', meaning: 'Ngang trước sổ sau.' },
        { hanzi: '日 (Nhật - Mặt trời)', pinyin: 'rì', meaning: 'Khung ngoài -> Nét trong -> Đóng đáy.' }
      ],
      commonMistake: {
        wrong: 'Đóng đáy trước khi viết các nét bên trong chữ.',
        correct: 'Phải viết hết thành phần bên trong rồi mới vẽ nét ngang khoá đáy.',
        explanation: 'Khẩu quyết: "Vào phòng trước, đóng cửa sau".'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '这是什么字？', pinyin: 'Zhè shì shénme zì?', meaning: 'Đây là chữ gì?' },
        { speaker: 'B', hanzi: '这是口，口有一张。', pinyin: 'Zhè shì kǒu, kǒu yǒu yì zhāng.', meaning: 'Đây là chữ Khẩu, miệng có một chiếc.' }
      ],
      audioText: '这是口，口有一张。',
      question: 'Chữ Hán được nhắc tới mang ý nghĩa gì?',
      options: ['Cái miệng (Khẩu)', 'Mặt trời (Nhật)', 'Số một (Nhất)', 'Phụ nữ (Nữ)'],
      correctIndex: 0,
      explanation: 'Trong bài đối thoại nhắc tới chữ 口 (kǒu - Khẩu).'
    },
    step6_speaking: {
      prompt: 'Luyện phát âm nguyên âm tròn môi ü:',
      targetSentence: 'nǚ ér',
      targetPinyin: 'nǚ ér',
      targetMeaning: 'Con gái (nữ nhi)',
      hint: 'Giữ môi tròn chúm lại khi phát âm chữ nǚ.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Nhà tôi có năm người"',
      words: ['口人', '我家', '有', '五'],
      correctOrder: ['我家', '有', '五', '口人'],
      explanation: 'Cấu trúc: 我家 (Nhà tôi) + 有 (Có) + 五口人 (Năm người).'
    },
    step8_quiz: [
      {
        id: 'q-102-1',
        type: 'multiple-choice',
        question: 'Khi viết chữ "十" (Số 10), nét nào được viết trước?',
        options: ['Nét sổ viết trước', 'Nét ngang viết trước', 'Nét chấm viết trước', 'Tùy ý viết nét nào cũng được'],
        correctIndex: 1,
        explanation: 'Theo quy tắc thuận bút chữ Hán: Ngang trước sổ sau.'
      },
      {
        id: 'q-102-2',
        type: 'multiple-choice',
        question: 'Vận mẫu ü trong tiếng Trung cần giữ khẩu hình thế nào?',
        options: ['Môi bè rộng như cười', 'Môi tròn chúm lại không thay đổi', 'Há to miệng hết cỡ', 'Uốn cong lưỡi lên ngạc cứng'],
        correctIndex: 1,
        explanation: 'Âm ü là âm tròn môi, phải giữ chặt khẩu hình chúm tròn từ đầu đến cuối.'
      }
    ],
    step9_challenge: {
      title: 'Tập viết đúng thuận bút chữ 口 và 女',
      taskDesc: 'Viết chữ 口 và chữ 女 đúng thứ tự nét ra giấy hoặc trên màn hình cảm ứng.',
      targetPhrase: 'kǒu nǚ',
      xpReward: 50,
      badge: 'Vững Nét Thuận Bút'
    }
  },

  {
    id: 'l-103',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 3,
    title: 'Nhóm âm khó: z, c, s vs zh, ch, sh, r & Quy tắc viết chữ Hán',
    chineseTitle: '平翘舌音与汉字书写规则',
    subtitle: 'Đập tan nỗi sợ âm đầu lưỡi và âm cuốn lưỡi, chuẩn hóa ngữ âm như người Bắc Kinh.',
    objective: 'Phân biệt rạch ròi cặp âm thẳng lưỡi (z, c, s) và âm uốn lưỡi (zh, ch, sh, r), làm chủ 7 quy tắc thuận bút.',
    prerequisite: 'Đã hoàn thành Bài 101 và 102.',
    completionCriteria: 'Vượt qua bài kiểm tra phân biệt âm s và sh với điểm >= 70%.',
    durationMinutes: 25,
    xpReward: 50,
    tags: ['HSK 1', 'Âm uốn lưỡi', 'Quy tắc viết', 'Pinyin khó'],
    relatedMaterialIds: ['mat-1', 'mat-4'],

    step1_learn: {
      topic: 'Âm đầu lưỡi (z, c, s) đối chiếu Âm uốn lưỡi (zh, ch, sh, r)',
      summary: 'z, c, s: Đầu lưỡi thẳng chạm mặt sau răng trên. zh, ch, sh, r: Đầu lưỡi cong uốn lên vòm họng ngạc cứng.',
      toneGuide: [
        { tone: 1, name: 'Cặp âm đối chiếu', pitch: '5-5', symbol: 'sī vs shī', desc: 'sī (thẳng lưỡi) khác với shī (uốn cong đầu lưỡi)', example: 'sān (Số 3) vs shān (Ngọn núi)' }
      ],
      initialsGuide: [
        { char: 'z', read: 'Đầu lưỡi thẳng, đọc như chữ [ch] nhẹ không bật hơi', example: 'zǎo (Sớm)' },
        { char: 'c', read: 'Đầu lưỡi thẳng, bật luồng hơi xì qua khe răng', example: 'cài (Món ăn)' },
        { char: 'zh', read: 'Uốn cong đầu lưỡi lên ngạc cứng, không bật hơi', example: 'zhōng (Trung)' },
        { char: 'ch', read: 'Uốn cong đầu lưỡi và BẬT HƠI mạnh mẽ', example: 'chī (Ăn)' }
      ],
      audioDemoText: 'sān shān zǎo zhǎo cài chài'
    },
    step2_vocabulary: [
      { id: 'v-103-1', hanzi: '三', pinyin: 'sān', hanviet: 'Tam', meaning: 'Số 3', radical: '一 (Nhất)', example: { hanzi: '三个。', pinyin: 'Sān gè.', meaning: 'Ba cái.' } },
      { id: 'v-103-2', hanzi: '十', pinyin: 'shí', hanviet: 'Thập', meaning: 'Số 10', radical: '十 (Thập)', example: { hanzi: '十四。', pinyin: 'Shí sì.', meaning: 'Mười bốn.' } },
      { id: 'v-103-3', hanzi: '吃', pinyin: 'chī', hanviet: 'Ngật', meaning: 'Ăn', radical: '口 (Khẩu)', example: { hanzi: '吃饭。', pinyin: 'Chī fàn.', meaning: 'Ăn cơm.' } },
      { id: 'v-103-4', hanzi: '四', pinyin: 'sì', hanviet: 'Tứ', meaning: 'Số 4', radical: '囗 (Vi)', example: { hanzi: '四天。', pinyin: 'Sì tiān.', meaning: 'Bốn ngày.' } },
      { id: 'v-103-5', hanzi: '人', pinyin: 'rén', hanviet: 'Nhân', meaning: 'Người', radical: '人 (Nhân)', example: { hanzi: '中国人。', pinyin: 'Zhōngguó rén.', meaning: 'Người Trung Quốc.' } }
    ],
    step3_hanzi: [
      { hanzi: '人', pinyin: 'rén', meaning: 'Con người', strokesCount: 2, strokeOrderText: 'Phẩy trước (丿), Mác sau (乀)', components: 'Bộ Nhân (人)', mnemonic: 'Hình tượng con người đang bước đi trên hai chân vững chãi.' },
      { hanzi: '十', pinyin: 'shí', meaning: 'Số 10', strokesCount: 2, strokeOrderText: 'Ngang trước (一), Sổ sau (丨)', components: 'Bộ Thập (十)', mnemonic: 'Đầy đủ thập toàn thập mỹ theo bốn phương tám hướng.' }
    ],
    step4_grammar: {
      formula: 'Thần chú líu lưỡi kinh điển: 四是四，十是十 (sì shì sì, shí shì shí)',
      title: 'Phân biệt số 4 (sì - thẳng lưỡi) và số 10 (shí - uốn lưỡi)',
      explanation: 'Người Việt rất dễ nhầm lẫn hai âm này dẫn đến việc mua hàng nghe nhầm giá tiền từ 4 tệ thành 10 tệ.',
      examples: [
        { hanzi: '十四 (shísì)', pinyin: 'shísì', meaning: 'Mười bốn (uốn lưỡi trước, thẳng lưỡi sau).' },
        { hanzi: '四十 (sìshí)', pinyin: 'sìshí', meaning: 'Bốn mươi (thẳng lưỡi trước, uốn lưỡi sau).' }
      ],
      commonMistake: {
        wrong: 'Đọc số 4 và số 10 giống hệt nhau không uốn lưỡi.',
        correct: 'Số 4 đầu lưỡi sát răng (sì); số 10 đầu lưỡi uốn lên vòm họng (shí).',
        explanation: 'Hãy luyện tập câu líu lưỡi để phản xạ lưỡi linh hoạt.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你要吃什么？', pinyin: 'Nǐ yào chī shénme?', meaning: 'Bạn muốn ăn gì?' },
        { speaker: 'B', hanzi: '我要吃四个包子。', pinyin: 'Wǒ yào chī sì gè bāozi.', meaning: 'Tôi muốn ăn 4 chiếc bánh bao.' }
      ],
      audioText: '你要吃什么？我要吃四个包子。',
      question: 'Người B muốn ăn bao nhiêu chiếc bánh bao?',
      options: ['10 chiếc (shí)', '4 chiếc (sì)', '3 chiếc (sān)', '14 chiếc (shísì)'],
      correctIndex: 1,
      explanation: 'Người B nói "四个" (sì gè - bốn chiếc).'
    },
    step6_speaking: {
      prompt: 'Đọc câu líu lưỡi kinh điển kiểm tra độ chuẩn của lưỡi:',
      targetSentence: '四是四，十是十。',
      targetPinyin: 'Sì shì sì, shí shì shí.',
      targetMeaning: 'Bốn là bốn, mười là mười.',
      hint: 'Chữ sì thẳng lưỡi dứt khoát, chữ shí uốn cong đầu lưỡi lên ngạc cứng.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Người Trung Quốc ăn cơm"',
      words: ['吃饭', '中国人'],
      correctOrder: ['中国人', '吃饭'],
      explanation: 'Chủ ngữ 中国人 + Động từ tân ngữ 吃饭.'
    },
    step8_quiz: [
      {
        id: 'q-103-1',
        type: 'multiple-choice',
        question: 'Khi phát âm thanh mẫu "ch" (trong chữ 吃 chī), đầu lưỡi và luồng hơi hoạt động thế nào?',
        options: ['Lưỡi thẳng, không bật hơi', 'Uốn cong đầu lưỡi lên ngạc cứng và bật hơi mạnh', 'Đầu lưỡi chạm răng dưới', 'Không dùng luồng hơi'],
        correctIndex: 1,
        explanation: 'ch là âm uốn lưỡi và có bật hơi mạnh mẽ từ khoang miệng.'
      },
      {
        id: 'q-103-2',
        type: 'multiple-choice',
        question: 'Từ "四十" (bốn mươi) phát âm Pinyin chính xác là gì?',
        options: ['shísì', 'sìshí', 'shíshí', 'sìsì'],
        correctIndex: 1,
        explanation: 'Bốn mươi là sì (4) + shí (10) ➔ sìshí.'
      }
    ],
    step9_challenge: {
      title: 'Thử thách câu líu lưỡi 4 và 10 trong 8 giây',
      taskDesc: 'Đọc to không vấp: "Sì shì sì, shí shì shí, shísì shì shísì".',
      targetPhrase: 'sì shì sì shí shì shí',
      xpReward: 50,
      badge: 'Bậc Thầy Líu Lưỡi Pinyin'
    }
  },

  {
    id: 'l-104',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 4,
    title: 'Vận mẫu kép & 10 Bộ thủ thông dụng nhất (Phần 1)',
    chineseTitle: '复韵母与前十大常用部首',
    subtitle: 'Nắm chắc các vận mẫu kép ai, ei, ao, ou, an, en, ang, eng và 10 bộ thủ giúp đoán nghĩa 500 chữ Hán.',
    objective: 'Phát âm chuẩn vận mẫu mũi (an/ang, en/eng), nhận diện 10 bộ thủ: Nhân đứng, Nữ, Khẩu, Thủy, Hỏa, Mộc, Nhật, Nguyệt, Tâm, Ngôn.',
    prerequisite: 'Đã nắm vững Bài 101–103.',
    completionCriteria: 'Nhận diện đúng bộ thủ và ý nghĩa liên kết trong trắc nghiệm >= 70%.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Vận mẫu kép', 'Bộ thủ', 'Chiết tự'],
    relatedMaterialIds: ['mat-4', 'mat-8'],

    step1_learn: {
      topic: 'Vận mẫu mũi & 10 Bộ thủ đoán nghĩa thần thánh',
      summary: 'Vận mẫu kết thúc bằng n là âm mũi trước (an, en, in), kết thúc bằng ng là âm mũi sau mở rộng họng (ang, eng, ing, ong). Bộ thủ là chìa khóa mở kho báu chữ Hán.',
      toneGuide: [
        { tone: 1, name: 'Âm mũi an vs ang', pitch: '5-5', symbol: 'ān vs āng', desc: 'an khép đầu lưỡi vào chân răng trên; ang mở rộng khoang miệng ngân họng', example: 'gān (Khô) vs gāng (Vừa mới)' }
      ],
      initialsGuide: [
        { char: '亻 (Nhân đứng)', read: 'Liên quan đến con người: 你 (bạn), 他 (anh ấy), 们 (chúng tôi)' },
        { char: '氵 (Ba chấm thủy)', read: 'Liên quan đến nước, chất lỏng: 水 (nước), 河 (sông), 海 (biển)' },
        { char: '讠 (Bộ Ngôn)', read: 'Liên quan đến lời nói, ngôn ngữ: 说 (nói), 话 (lời), 语 (ngôn ngữ)' }
      ],
      audioDemoText: 'bān bāng fēn fēng hán háng'
    },
    step2_vocabulary: [
      { id: 'v-104-1', hanzi: '水', pinyin: 'shuǐ', hanviet: 'Thủy', meaning: 'Nước', radical: '水 (Thủy)', example: { hanzi: '喝水。', pinyin: 'Hē shuǐ.', meaning: 'Uống nước.' } },
      { id: 'v-104-2', hanzi: '火', pinyin: 'huǒ', hanviet: 'Hỏa', meaning: 'Lửa', radical: '火 (Hỏa)', example: { hanzi: '大火。', pinyin: 'Dà huǒ.', meaning: 'Lửa lớn.' } },
      { id: 'v-104-3', hanzi: '木', pinyin: 'mù', hanviet: 'Mộc', meaning: 'Gỗ, cây cối', radical: '木 (Mộc)', example: { hanzi: '树木。', pinyin: 'Shùmù.', meaning: 'Cây cối.' } },
      { id: 'v-104-4', hanzi: '月', pinyin: 'yuè', hanviet: 'Nguyệt', meaning: 'Mặt trăng, tháng', radical: '月 (Nguyệt)', example: { hanzi: '一月。', pinyin: 'Yī yuè.', meaning: 'Tháng một.' } },
      { id: 'v-104-5', hanzi: '日', pinyin: 'rì', hanviet: 'Nhật', meaning: 'Mặt trời, ngày', radical: '日 (Nhật)', example: { hanzi: '今日。', pinyin: 'Jīnrì.', meaning: 'Hôm nay.' } }
    ],
    step3_hanzi: [
      { hanzi: '水', pinyin: 'shuǐ', meaning: 'Nước', strokesCount: 4, strokeOrderText: 'Sổ móc giữa trước -> Phẩy gập trái -> Phẩy phải -> Mác', components: 'Bộ Thủy (水)', mnemonic: 'Dòng nước chảy cuồn cuộn ở giữa và các bọt nước bắn ra hai bên.' },
      { hanzi: '木', pinyin: 'mù', meaning: 'Cây cối, gỗ', strokesCount: 4, strokeOrderText: 'Ngang -> Sổ -> Phẩy -> Mác', components: 'Bộ Mộc (木)', mnemonic: 'Hình thân cây với cành lá phía trên và rễ tỏa phía dưới.' }
    ],
    step4_grammar: {
      formula: 'Bộ thủ chỉ ý + Thành phần chỉ âm = Chữ hình thanh (80% chữ Hán)',
      title: 'Bí mật đoán nghĩa chữ Hán qua bộ thủ',
      explanation: 'Nhìn thấy bộ Thủy (氵) là biết chữ đó liên quan đến nước; nhìn thấy bộ Mộc (木) là biết liên quan đến cây cối đồ gỗ.',
      examples: [
        { hanzi: '林 (Rừng thưa)', pinyin: 'lín', meaning: 'Hai chữ Mộc ghép lại (nhiều cây cối).' },
        { hanzi: '森 (Rừng rậm)', pinyin: 'sēn', meaning: 'Ba chữ Mộc xếp chồng lên nhau thành đại ngàn.' }
      ],
      commonMistake: {
        wrong: 'Học vẹt từng nét mà không nắm bộ thủ.',
        correct: 'Phân tích bộ thủ giúp nhớ sâu và viết chữ chính xác gấp 3 lần.',
        explanation: 'Bộ thủ là bảng chữ cái tư duy tượng hình của người Trung Hoa.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你喝水吗？', pinyin: 'Nǐ hē shuǐ ma?', meaning: 'Bạn uống nước không?' },
        { speaker: 'B', hanzi: '我喝水，谢谢！', pinyin: 'Wǒ hē shuǐ, xièxie!', meaning: 'Tôi uống nước, cảm ơn!' }
      ],
      audioText: '你喝水吗？我喝水，谢谢！',
      question: 'Người B chọn uống gì?',
      options: ['Uống trà', 'Uống nước lọc', 'Uống cà phê', 'Không uống gì'],
      correctIndex: 1,
      explanation: 'Người B nói rõ: "我喝水" (Wǒ hē shuǐ - Tôi uống nước).'
    },
    step6_speaking: {
      prompt: 'Nói câu đề nghị mời nước lịch sự:',
      targetSentence: '请喝水。',
      targetPinyin: 'Qǐng hē shuǐ.',
      targetMeaning: 'Mời uống nước.',
      hint: 'Phát âm shuǐ với âm uốn lưỡi sh và thanh 3.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Tôi uống nước"',
      words: ['水', '喝', '我'],
      correctOrder: ['我', '喝', '水'],
      explanation: 'Thứ tự: Chủ ngữ 我 + Động từ 喝 + Tân ngữ 水.'
    },
    step8_quiz: [
      {
        id: 'q-104-1',
        type: 'multiple-choice',
        question: 'Bộ thủ "氵" (Ba chấm thủy) thường xuất hiện trong những chữ Hán mang nghĩa liên quan đến:',
        options: ['Nước, sông hồ, chất lỏng', 'Lửa, nhiệt độ cao', 'Cây cối, rừng rậm', 'Lời nói, giao tiếp'],
        correctIndex: 0,
        explanation: 'Bộ Ba chấm thủy (氵) biểu thị nước hoặc chất lỏng.'
      },
      {
        id: 'q-104-2',
        type: 'multiple-choice',
        question: 'Chữ "森" (sēn - Rừng rậm) được tạo thành từ 3 chữ nào ghép lại?',
        options: ['3 chữ Hỏa (火)', '3 chữ Mộc (木)', '3 chữ Thủy (水)', '3 chữ Nhật (日)'],
        correctIndex: 1,
        explanation: 'Chữ 森 gồm 3 chữ Mộc (木) hợp thành chỉ rừng rậm bạt ngàn.'
      }
    ],
    step9_challenge: {
      title: 'Nhận diện 5 bộ thủ trong văn bản thực tế',
      taskDesc: 'Chỉ ra bộ thủ của các chữ: 你 (Nhân đứng), 妈 (Nữ), 喝 (Khẩu), 河 (Thủy), 说 (Ngôn).',
      targetPhrase: 'rén nǚ kǒu shuǐ yán',
      xpReward: 50,
      badge: 'Thần Nhãn Chiết Tự'
    }
  },

  {
    id: 'l-105',
    chapterId: 'ch-1',
    levelId: 'lvl-1',
    lessonNumber: 5,
    title: 'Quy tắc biến điệu thực chiến & Ôn tập Module 1.1',
    chineseTitle: '变调实战与模块一复习',
    subtitle: 'Làm chủ bí kíp biến điệu 2 thanh 3, biến điệu chữ 不 và chữ 一, tổng duyệt sẵn sàng đấu Boss.',
    objective: 'Nắm vững quy tắc biến điệu thanh 3, biến điệu chữ 一 (yī/yí/yì) và chữ 不 (bù/bú), đạt điều kiện mở khóa Boss 1.',
    prerequisite: 'Đã hoàn thành Bài 101–104.',
    completionCriteria: 'Đạt >= 80% điểm bài tập tổng kết Module 1.1.',
    durationMinutes: 25,
    xpReward: 60,
    tags: ['HSK 1', 'Biến điệu', 'Tổng kết Module', 'Review Checkpoint'],
    relatedMaterialIds: ['mat-1', 'mat-8'],

    step1_learn: {
      topic: '3 Quy tắc biến điệu quan trọng nhất trong tiếng Trung',
      summary: '1. Hai thanh 3 đi liền nhau -> 3+3 biến thành 2+3 (nǐ hǎo -> ní hǎo). 2. Chữ 不 đứng trước thanh 4 -> biến thành bú (bú shì). 3. Chữ 一 đứng trước thanh 4 biến thành yí (yí gè), trước thanh 1,2,3 biến thành yì (yì tiān, yì nián, yì qǐ).',
      toneGuide: [
        { tone: 1, name: 'Biến điệu chữ 一', pitch: 'Biến thanh', symbol: 'yí / yì', desc: 'Đứng trước thanh 4 đọc yí; đứng trước thanh 1, 2, 3 đọc yì', example: 'yí gè (một cái), yì tiān (một ngày)' }
      ],
      initialsGuide: [
        { char: 'Biến điệu thanh 3', read: 'nǐ + hǎo ➔ ní hǎo; wǒ + hěn + hǎo ➔ wǒ hén hǎo' },
        { char: 'Biến điệu chữ 不', read: 'bù + shì ➔ bú shì; bù + dà ➔ bú dà' }
      ],
      audioDemoText: 'ní hǎo, bú shì, yí gè, yì tiān, yì qǐ'
    },
    step2_vocabulary: [
      { id: 'v-105-1', hanzi: '你好', pinyin: 'nǐ hǎo', hanviet: 'Nhĩ hảo', meaning: 'Xin chào', radical: '亻 (Nhân)', example: { hanzi: '你好！很高兴认识你。', pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.', meaning: 'Xin chào! Rất vui được quen bạn.' } },
      { id: 'v-105-2', hanzi: '不是', pinyin: 'bú shì', hanviet: 'Bất thị', meaning: 'Không phải là', radical: '日 (Nhật)', example: { hanzi: '我不是老师。', pinyin: 'Wǒ bú shì lǎoshī.', meaning: 'Tôi không phải là giáo viên.' } },
      { id: 'v-105-3', hanzi: '一个', pinyin: 'yí gè', hanviet: 'Nhất cá', meaning: 'Một cái / một người', radical: '人 (Nhân)', example: { hanzi: '一个人。', pinyin: 'Yí gè rén.', meaning: 'Một người.' } },
      { id: 'v-105-4', hanzi: '一起', pinyin: 'yìqǐ', hanviet: 'Nhất khởi', meaning: 'Cùng nhau', radical: '走 (Tẩu)', example: { hanzi: '我们一起去。', pinyin: 'Wǒmen yìqǐ qù.', meaning: 'Chúng ta cùng đi.' } }
    ],
    step3_hanzi: [
      { hanzi: '个', pinyin: 'gè', meaning: 'Cái, chiếc (lượng từ phổ biến nhất)', strokesCount: 3, strokeOrderText: 'Phẩy -> Sổ -> Nét sổ giữa', components: 'Bộ Nhân (人)', mnemonic: 'Một con người độc lập đơn lẻ.' },
      { hanzi: '起', pinyin: 'qǐ', meaning: 'Dậy, khởi đầu', strokesCount: 10, strokeOrderText: 'Bộ Tẩu (走) bên trái trước, chữ Kỷ (己) bên phải sau', components: 'Bộ Tẩu (走) + Kỷ (己)', mnemonic: 'Bản thân (己) cất bước chân đi (走) để bắt đầu hành trình.' }
    ],
    step4_grammar: {
      formula: 'Nguyên tắc vàng: Biến âm khi nói, nhưng Pinyin gốc vẫn viết nguyên bản trên sách',
      title: 'Đọc biến điệu nhưng viết đúng âm gốc',
      explanation: 'Trong sách giáo khoa và từ điển, chữ 你好 vẫn in pinyin là nǐ hǎo, chữ 不是 vẫn in bù shì; người học phải tự động áp dụng quy tắc biến điệu khi phát âm.',
      examples: [
        { hanzi: '你好 (Viết: nǐ hǎo)', pinyin: 'ní hǎo', meaning: 'Đọc là ní hǎo.' },
        { hanzi: '不是 (Viết: bù shì)', pinyin: 'bú shì', meaning: 'Đọc là bú shì.' }
      ],
      commonMistake: {
        wrong: 'Viết trên bài thi Pinyin chữ nǐ biến thành ní.',
        correct: 'Pinyin viết vẫn giữ nguyên thanh 3 gốc, chỉ có miệng đọc thành thanh 2.',
        explanation: 'Khảo thí HSK quốc tế chấm điểm theo âm vị gốc.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你好！你是一个人吗？', pinyin: 'Nǐ hǎo! Nǐ shì yí gè rén ma?', meaning: 'Xin chào! Bạn đi một mình à?' },
        { speaker: 'B', hanzi: '不是，我们一起去。', pinyin: 'Bú shì, wǒmen yìqǐ qù.', meaning: 'Không phải, chúng tôi cùng đi.' }
      ],
      audioText: '你好！你是一个人吗？不是，我们一起去。',
      question: 'Người B đi một mình hay đi cùng người khác?',
      options: ['Đi một mình', 'Cùng đi với người khác', 'Không đi đâu cả', 'Đang ở nhà ngủ'],
      correctIndex: 1,
      explanation: 'Người B nói: "不是，我们一起去" (Chúng tôi cùng đi).'
    },
    step6_speaking: {
      prompt: 'Đọc to câu giao tiếp ứng dụng trọn vẹn cả 3 quy tắc biến điệu:',
      targetSentence: '你好，我不是一个人。',
      targetPinyin: 'Nǐ hǎo, wǒ bú shì yí gè rén.',
      targetMeaning: 'Xin chào, tôi không phải đi một mình.',
      hint: 'Đọc mượt mà: ní hǎo - wǒ bú shì - yí gè rén.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu hoàn chỉnh: "Chúng tôi cùng nhau ăn cơm"',
      words: ['吃饭', '一起', '我们'],
      correctOrder: ['我们', '一起', '吃饭'],
      explanation: 'Chủ ngữ 我们 + Phó từ 一起 + Động từ 吃饭.'
    },
    step8_quiz: [
      {
        id: 'q-105-1',
        type: 'multiple-choice',
        question: 'Cụm từ "一个" (yī + gè) sẽ được phát âm biến điệu thế nào khi chữ 个 mang thanh 4?',
        options: ['yī gè', 'yí gè', 'yì gè', 'yǐ gè'],
        correctIndex: 1,
        explanation: 'Chữ 一 đứng trước thanh 4 biến thành thanh 2: yí gè.'
      },
      {
        id: 'q-105-2',
        type: 'multiple-choice',
        question: 'Trong câu "我很好" (wǒ hěn hǎo), có ba thanh 3 đi liền nhau thì biến điệu thông thường ra sao?',
        options: ['wǒ hén hǎo (2-2-3 hoặc 3-2-3)', 'giữ nguyên cả ba thanh 3', 'đổi cả ba thành thanh 1', 'đổi thành wò hèn hào'],
        correctIndex: 0,
        explanation: 'Ba thanh 3 đi liền nhau thường ngắt cụm wǒ + (hén hǎo) đọc là wǒ hén hǎo.'
      }
    ],
    step9_challenge: {
      title: 'Mở khóa trận chiến Boss Chapter 1',
      taskDesc: 'Vượt qua bài tập Module 1.1 để bước vào đại chiến ngữ âm với Thầy Vương!',
      targetPhrase: 'nǐ hǎo bú shì yí gè',
      xpReward: 60,
      badge: 'Sẵn Sàng Diệt Boss Ngữ Âm'
    }
  },

  // --- MODULE 1.2: Chào hỏi, Bản thân & Xưng hô (Bài 106-110) ---
  {
    id: 'l-106',
    chapterId: 'ch-2',
    levelId: 'lvl-1',
    lessonNumber: 6,
    title: 'Chào hỏi lịch sự, cảm ơn & tạm biệt',
    chineseTitle: '礼貌问好、感谢与告别',
    subtitle: 'Tự tin xưng hô với kính ngữ 您, cảm ơn đúng mực và đáp lại lịch thiệp với 不客气.',
    objective: 'Chào hỏi tự tin trong mọi hoàn cảnh, biết dùng kính ngữ 您 với người lớn tuổi, đáp lại lời cảm ơn chuẩn mực.',
    prerequisite: 'Đã hoàn thành Module 1.1 (Bài 101–105).',
    completionCriteria: 'Đạt >= 70% trắc nghiệm và đóng vai chào hỏi lưu loát.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Chào hỏi', 'Kính ngữ', 'Giao tiếp'],
    relatedMaterialIds: ['mat-1', 'mat-5'],

    step1_learn: {
      topic: 'Văn hóa chào hỏi & Kính ngữ 您 (nín)',
      summary: 'Kính ngữ 您 ghép từ chữ 你 (bạn) ở trên và chữ 心 (trái tim) ở dưới, biểu thị sự tôn kính tự đáy lòng.',
      initialsGuide: [
        { char: '你好 (nǐ hǎo)', read: 'Chào bạn bè đồng trang lứa' },
        { char: '您好 (nín hǎo)', read: 'Chào người lớn tuổi, thầy cô, đối tác' },
        { char: '不客气 (bú kèqi)', read: 'Đáp lại khi ai đó cảm ơn' },
        { char: '再见 (zàijiàn)', read: 'Tạm biệt (hẹn gặp lại)' }
      ],
      audioDemoText: 'nín hǎo, xièxie nǐ, bú kèqi, zàijiàn'
    },
    step2_vocabulary: [
      { id: 'v-106-1', hanzi: '您', pinyin: 'nín', hanviet: 'Nhẫm', meaning: 'Ngài, ông, thầy (ngôi 2 tôn kính)', radical: '心 (Tâm)', example: { hanzi: '老师，您好！', pinyin: 'Lǎoshī, nín hǎo!', meaning: 'Em chào thầy ạ!' } },
      { id: 'v-106-2', hanzi: '谢谢', pinyin: 'xièxie', hanviet: 'Tạ tạ', meaning: 'Cảm ơn', radical: '讠 (Ngôn)', example: { hanzi: '太谢谢你了！', pinyin: 'Tài xièxie nǐ le!', meaning: 'Vô cùng cảm ơn bạn!' } },
      { id: 'v-106-3', hanzi: '不客气', pinyin: 'bú kèqi', hanviet: 'Bất khách khí', meaning: 'Không có chi, đừng khách sáo', radical: '宀 (Miên)', example: { hanzi: '不用谢，不客气。', pinyin: 'Bú yòng xiè, bú kèqi.', meaning: 'Không cần cảm ơn, đừng khách sáo.' } },
      { id: 'v-106-4', hanzi: '再见', pinyin: 'zàijiàn', hanviet: 'Tái kiến', meaning: 'Tạm biệt, hẹn gặp lại', radical: '见 (Kiến)', example: { hanzi: '明天再见！', pinyin: 'Míngtiān zàijiàn!', meaning: 'Ngày mai gặp lại nhé!' } }
    ],
    step3_hanzi: [
      { hanzi: '您', pinyin: 'nín', meaning: 'Ngài (kính ngữ)', strokesCount: 11, strokeOrderText: 'Chữ 你 ở trên -> Bộ Tâm (心) ở dưới', components: '你 + 心', mnemonic: 'Đặt bạn ở trong trái tim thể hiện sự tôn trọng tuyệt đối.' },
      { hanzi: '见', pinyin: 'jiàn', meaning: 'Gặp gỡ', strokesCount: 4, strokeOrderText: 'Sổ -> Ngang gập -> Phẩy -> Sổ cong móc', components: 'Bộ Kiến (见)', mnemonic: 'Đôi mắt to dõi theo đôi chân đi gặp gỡ bạn bè.' }
    ],
    step4_grammar: {
      formula: 'Đối tượng xưng hô + 好！ (Ví dụ: 老师好！ 同学们好！)',
      title: 'Công thức chào hỏi lịch sự tiếng Trung',
      explanation: 'Trong tiếng Trung, khi chào ai đó một cách trang trọng, ta đặt danh xưng của người đó lên trước chữ 好.',
      examples: [
        { hanzi: '王老师好！', pinyin: 'Wáng lǎoshī hǎo!', meaning: 'Em chào thầy Vương ạ!' },
        { hanzi: '大家晚上好！', pinyin: 'Dàjiā wǎnshang hǎo!', meaning: 'Chào buổi tối mọi người!' }
      ],
      commonMistake: {
        wrong: 'Chào thầy giáo là "好老师".',
        correct: 'Phải nói: "老师好！" (Danh xưng đứng trước chữ 好).',
        explanation: 'Trật tự lời chào tiếng Trung ngược lại so với cách nói "Chào thầy" của tiếng Việt.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'Học sinh', hanzi: '李老师，您好！', pinyin: 'Lǐ lǎoshī, nín hǎo!', meaning: 'Thưa cô Lý, em chào cô ạ!' },
        { speaker: 'Cô Lý', hanzi: '你好！谢谢你的花。', pinyin: 'Nǐ hǎo! Xièxie nǐ de huā.', meaning: 'Chào em! Cảm ơn bó hoa của em nhé.' },
        { speaker: 'Học sinh', hanzi: '老师不客气，老师再见！', pinyin: 'Lǎoshī bú kèqi, lǎoshī zàijiàn!', meaning: 'Dạ không có chi cô ạ, em chào cô em về!' }
      ],
      audioText: '李老师，您好！你好！谢谢你的花。老师不客气，老师再见！',
      question: 'Người học sinh tặng cô giáo món quà gì?',
      options: ['Quyển sách', 'Bó hoa (huā)', 'Ly trà sữa', 'Chiếc bánh bao'],
      correctIndex: 1,
      explanation: 'Cô Lý nói: "谢谢你的花" (Cảm ơn bó hoa của em).'
    },
    step6_speaking: {
      prompt: 'Gặp đối tác lớn tuổi, hãy chào họ bằng kính ngữ:',
      targetSentence: '您好，很高兴认识您！',
      targetPinyin: 'Nín hǎo, hěn gāoxìng rènshi nín!',
      targetMeaning: 'Kính chào ngài, rất vui được làm quen với ngài!',
      hint: 'Dùng chữ nín để thể hiện thái độ tôn trọng cao nhất.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Cảm ơn cô giáo, ngày mai gặp lại"',
      words: ['再见', '谢谢', '明天', '老师'],
      correctOrder: ['谢谢', '老师', '明天', '再见'],
      explanation: 'Thứ tự: 谢谢老师 (Cảm ơn cô) + 明天再见 (Mai gặp lại).'
    },
    step8_quiz: [
      {
        id: 'q-106-1',
        type: 'multiple-choice',
        question: 'Khi nói chuyện với khách hàng hoặc người lớn tuổi, ta nên dùng đại từ nào thay cho "你"?',
        options: ['他 (tā)', '您 (nín)', '我 (wǒ)', '谁 (shéi)'],
        correctIndex: 1,
        explanation: '您 (nín) là đại từ ngôi thứ 2 mang sắc thái tôn kính.'
      },
      {
        id: 'q-106-2',
        type: 'multiple-choice',
        question: 'Khi ai đó giúp đỡ và nói "谢谢", câu đáp lại lịch thiệp nhất là:',
        options: ['再见 (Zàijiàn)', '不客气 (Bú kèqi)', '你好 (Nǐ hǎo)', '对不起 (Duìbuqǐ)'],
        correctIndex: 1,
        explanation: '不客气 (Đừng khách sáo) là câu đáp lại chuẩn mực cho lời cảm ơn.'
      }
    ],
    step9_challenge: {
      title: 'Đóng vai chào đối tác và tạm biệt',
      taskDesc: 'Nói trọn vẹn lời thoại: "Lǎoshī nín hǎo! Xièxie nín! Zàijiàn!".',
      targetPhrase: 'lǎoshī nín hǎo xièxie zàijiàn',
      xpReward: 50,
      badge: 'Đại Sứ Lịch Thiệp'
    }
  },

  {
    id: 'l-107',
    chapterId: 'ch-2',
    levelId: 'lvl-1',
    lessonNumber: 7,
    title: 'Câu chữ 是 & Trợ từ nghi vấn 吗',
    chineseTitle: '是字句与吗字疑问句',
    subtitle: 'Nắm chắc cấu trúc khẳng định, phủ định với động từ 是 và tuyệt chiêu đặt câu hỏi Yes/No với chữ 吗.',
    objective: 'Sử dụng thành thạo câu chữ 是 (Chủ ngữ + 是 + Danh từ), câu phủ định 不是 và câu hỏi với trợ từ 吗.',
    prerequisite: 'Đã hoàn thành Bài 106.',
    completionCriteria: 'Đạt >= 70% trắc nghiệm đặt câu hỏi và dịch câu chuẩn xác.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Câu chữ 是', 'Trợ từ 吗', 'Ngữ pháp cơ bản'],
    relatedMaterialIds: ['mat-1', 'mat-5'],

    step1_learn: {
      topic: 'Câu chữ 是 & Đặt câu hỏi với chữ 吗',
      summary: 'Động từ 是 tương đương với "là" trong tiếng Việt. Để biến câu trần thuật thành câu hỏi Có/Không, chỉ cần thêm chữ 吗 vào cuối câu.',
      toneGuide: [
        { tone: 0, name: 'Trợ từ 吗 (ma)', pitch: 'Thanh nhẹ', symbol: 'ma', desc: 'Đọc nhẹ, ngắn và rơi tự nhiên', example: 'Nǐ shì lǎoshī ma?' }
      ],
      initialsGuide: [
        { char: '是 (shì)', read: 'Uốn lưỡi, thanh 4 dứt khoát: Tôi là học sinh (我是学生)' },
        { char: '不是 (bú shì)', read: 'Chữ 不 biến điệu thành bú trước chữ shì' }
      ],
      audioDemoText: 'wǒ shì xuésheng, tā bú shì lǎoshī, nǐ shì lǎoshī ma?'
    },
    step2_vocabulary: [
      { id: 'v-107-1', hanzi: '是', pinyin: 'shì', hanviet: 'Thị', meaning: 'Là, phải, vâng', radical: '日 (Nhật)', example: { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Tôi là học sinh.' } },
      { id: 'v-107-2', hanzi: '吗', pinyin: 'ma', hanviet: 'Ma', meaning: '...phải không? (trợ từ nghi vấn)', radical: '口 (Khẩu)', example: { hanzi: '你是老师吗？', pinyin: 'Nǐ shì lǎoshī ma?', meaning: 'Bạn là giáo viên phải không?' } },
      { id: 'v-107-3', hanzi: '老师', pinyin: 'lǎoshī', hanviet: 'Lão sư', meaning: 'Thầy cô, giáo viên', radical: '耂 (Lão)', example: { hanzi: '他是我的老师。', pinyin: 'Tā shì wǒ de lǎoshī.', meaning: 'Thầy ấy là giáo viên của tôi.' } },
      { id: 'v-107-4', hanzi: '学生', pinyin: 'xuésheng', hanviet: 'Học sinh', meaning: 'Học sinh, sinh viên', radical: '子 (Tử)', example: { hanzi: '我们都是学生。', pinyin: 'Wǒmen dōu shì xuésheng.', meaning: 'Chúng tôi đều là sinh viên.' } }
    ],
    step3_hanzi: [
      { hanzi: '是', pinyin: 'shì', meaning: 'Là', strokesCount: 9, strokeOrderText: 'Bộ Nhật (日) ở trên -> Nét ngang -> Bộ Chỉ (疋) ở dưới', components: '日 + 疋', mnemonic: 'Mặt trời chiếu sáng soi tỏ chân lý lẽ phải.' },
      { hanzi: '吗', pinyin: 'ma', meaning: 'Hỏi không?', strokesCount: 6, strokeOrderText: 'Bộ Khẩu (口) bên trái -> Chữ Mã (马) bên phải', components: '口 + 马', mnemonic: 'Dùng miệng (口) hỏi chuyện chú ngựa (马).' }
    ],
    step4_grammar: {
      formula: 'Câu khẳng định: A + 是 + B | Câu hỏi: A + 是 + B + 吗？',
      title: 'Công thức câu chữ 是 và trợ từ nghi vấn 吗',
      explanation: 'Không cần đảo trật tự từ như tiếng Anh! Chỉ cần lấy nguyên câu khẳng định và gắn chữ 吗 vào đuôi câu.',
      examples: [
        { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Tôi là học sinh.' },
        { hanzi: '你是学生吗？', pinyin: 'Nǐ shì xuésheng ma?', meaning: 'Bạn là học sinh phải không?' }
      ],
      commonMistake: {
        wrong: 'Đặt chữ 吗 ở đầu câu hoặc giữa câu.',
        correct: 'Trợ từ 吗 bắt buộc phải nằm ở vị trí CUỐI CÙNG của câu hỏi.',
        explanation: 'Trật tự cố định: [Mệnh đề trần thuật] + 吗？'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '请问，您是李老师吗？', pinyin: 'Qǐngwèn, nín shì Lǐ lǎoshī ma?', meaning: 'Xin hỏi, thầy có phải là thầy Lý không ạ?' },
        { speaker: 'B', hanzi: '我不是李老师，我是王老师。', pinyin: 'Wǒ bú shì Lǐ lǎoshī, wǒ shì Wáng lǎoshī.', meaning: 'Tôi không phải thầy Lý, tôi là thầy Vương.' }
      ],
      audioText: '请问，您是李老师吗？我不是李老师，我是王老师。',
      question: 'Người B thực chất là ai?',
      options: ['Thầy Lý', 'Thầy Vương', 'Một học sinh mới', 'Hiệu trưởng trường học'],
      correctIndex: 1,
      explanation: 'Người B khẳng định: "我是王老师" (Tôi là thầy Vương).'
    },
    step6_speaking: {
      prompt: 'Hỏi bạn cùng phòng xem họ có phải là học sinh không:',
      targetSentence: '你是学生吗？',
      targetPinyin: 'Nǐ shì xuésheng ma?',
      targetMeaning: 'Bạn là học sinh phải không?',
      hint: 'Nói rõ ràng âm shì và kết thúc nhẹ nhàng với âm ma.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu phủ định: "Chúng tôi không phải là giáo viên"',
      words: ['老师', '我们', '不是'],
      correctOrder: ['我们', '不是', '老师'],
      explanation: 'Cấu trúc: Chủ ngữ 我们 + 不是 + Danh từ 老师.'
    },
    step8_quiz: [
      {
        id: 'q-107-1',
        type: 'multiple-choice',
        question: 'Dịch câu sau sang tiếng Trung: "Anh ấy có phải là giáo viên không?"',
        options: ['他是老师吗？', '他是吗老师？', '吗他是老师？', '他老师是吗？'],
        correctIndex: 0,
        explanation: 'Cấu trúc câu hỏi Có/Không: 他是老师 (Khẳng định) + 吗？'
      },
      {
        id: 'q-107-2',
        type: 'multiple-choice',
        question: 'Từ phủ định đi với "是" để tạo thành "không phải là" đọc chuẩn Pinyin là gì?',
        options: ['bù shì', 'bú shì', 'bǔ shì', 'bū shì'],
        correctIndex: 1,
        explanation: 'Chữ 不 (bù) đứng trước thanh 4 biến điệu thành bú: bú shì.'
      }
    ],
    step9_challenge: {
      title: 'Hỏi đáp xác thực danh tính bạn học',
      taskDesc: 'Đặt 2 câu hỏi với 吗 và tự trả lời: "Nǐ shì xuésheng ma? - Shì, wǒ shì xuésheng!".',
      targetPhrase: 'nǐ shì xuésheng ma wǒ shì',
      xpReward: 50,
      badge: 'Chuyên Gia Nghi Vấn 吗'
    }
  },

  {
    id: 'l-108',
    chapterId: 'ch-2',
    levelId: 'lvl-1',
    lessonNumber: 8,
    title: 'Họ tên & Quốc tịch với đại từ 什么, 哪',
    chineseTitle: '姓名与国籍（什么、哪）',
    subtitle: 'Tự tin hỏi tên (你叫什么名字) và hỏi quốc tịch (你是哪国人), giới thiệu bản thân là người Việt Nam.',
    objective: 'Làm chủ đại từ nghi vấn 什么 (cái gì) và 哪 (nào), biết nói "Tôi là người Việt Nam" bằng tiếng Trung.',
    prerequisite: 'Đã hoàn thành Bài 107.',
    completionCriteria: 'Tự giới thiệu họ tên và quốc tịch trôi chảy, đạt >= 70% trắc nghiệm.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Tên tuổi', 'Quốc tịch', 'Người Việt Nam'],
    relatedMaterialIds: ['mat-1', 'mat-8'],

    step1_learn: {
      topic: 'Hỏi tên & Giới thiệu quốc tịch',
      summary: 'Để hỏi tên ta dùng động từ 叫 (jiào) kết hợp 什么 (shénme). Để hỏi quốc tịch ta dùng cấu trúc 哪国人 (nǎ guó rén).',
      initialsGuide: [
        { char: '叫 (jiào)', read: 'Kêu, gọi, tên là: 我叫... (Tôi tên là...)' },
        { char: '越南 (Yuènán)', read: 'Việt Nam: 越南人 (Yuènán rén - Người Việt Nam)' },
        { char: '中国 (Zhōngguó)', read: 'Trung Quốc: 中国人 (Zhōngguó rén - Người Trung Quốc)' }
      ],
      audioDemoText: 'nǐ jiào shénme míngzi, nǐ shì nǎ guó rén, wǒ shì Yuènán rén'
    },
    step2_vocabulary: [
      { id: 'v-108-1', hanzi: '叫', pinyin: 'jiào', hanviet: 'Khiếu', meaning: 'Tên là, gọi là', radical: '口 (Khẩu)', example: { hanzi: '我叫海登。', pinyin: 'Wǒ jiào Hǎidēng.', meaning: 'Tôi tên là Hải Đăng.' } },
      { id: 'v-108-2', hanzi: '什么', pinyin: 'shénme', hanviet: 'Thập ma', meaning: 'Cái gì, gì', radical: '亻 (Nhân)', example: { hanzi: '这是什么？', pinyin: 'Zhè shì shénme?', meaning: 'Đây là cái gì?' } },
      { id: 'v-108-3', hanzi: '名字', pinyin: 'míngzi', hanviet: 'Danh tự', meaning: 'Tên, họ tên', radical: '夕 (Tịch)', example: { hanzi: '你的名字。', pinyin: 'Nǐ de míngzi.', meaning: 'Tên của bạn.' } },
      { id: 'v-108-4', hanzi: '哪', pinyin: 'nǎ', hanviet: 'Nả', meaning: 'Nào, đâu', radical: '口 (Khẩu)', example: { hanzi: '哪国人？', pinyin: 'Nǎ guó rén?', meaning: 'Người nước nào?' } },
      { id: 'v-108-5', hanzi: '越南', pinyin: 'Yuènán', hanviet: 'Việt Nam', meaning: 'Việt Nam', radical: '走 (Tẩu)', example: { hanzi: '我是越南人。', pinyin: 'Wǒ shì Yuènán rén.', meaning: 'Tôi là người Việt Nam.' } }
    ],
    step3_hanzi: [
      { hanzi: '国', pinyin: 'guó', meaning: 'Đất nước, quốc gia', strokesCount: 8, strokeOrderText: 'Khung ngoài (囗) -> Chữ Ngọc (玉) bên trong -> Đóng đáy', components: '囗 (Vi) + 玉 (Ngọc)', mnemonic: 'Đất nước có tường thành bao bọc (囗) để giữ gìn báu vật ngọc ngà (玉).' },
      { hanzi: '名', pinyin: 'míng', meaning: 'Tên (Danh)', strokesCount: 6, strokeOrderText: 'Bộ Tịch (夕) ở trên -> Bộ Khẩu (口) ở dưới', components: '夕 + 口', mnemonic: 'Buổi tối trời tối (夕) phải dùng miệng (口) gọi tên nhau để nhận ra.' }
    ],
    step4_grammar: {
      formula: 'Hỏi tên: 你叫什么名字？ | Hỏi quốc tịch: 你是哪国人？',
      title: 'Vị trí của đại từ nghi vấn trong câu hỏi',
      explanation: 'Trong tiếng Trung, đại từ nghi vấn (什么, 哪) nằm ngay tại vị trí của thông tin cần trả lời, không cần đảo trật tự từ ra đầu câu.',
      examples: [
        { hanzi: '你叫什么名字？➔ 我叫安。', pinyin: 'Nǐ jiào shénme míngzi? ➔ Wǒ jiào Ān.', meaning: 'Bạn tên gì? ➔ Tôi tên An.' },
        { hanzi: '你是哪国人？➔ 我是越南人。', pinyin: 'Nǐ shì nǎ guó rén? ➔ Wǒ shì Yuènán rén.', meaning: 'Bạn là người nước nào? ➔ Tôi là người Việt Nam.' }
      ],
      commonMistake: {
        wrong: 'Đảo đại từ nghi vấn ra đầu câu như tiếng Anh: "什么你叫名字？"',
        correct: 'Giữ nguyên trật tự ngữ pháp SVO: "你叫什么名字？"',
        explanation: 'Tiếng Trung giữ nguyên trật tự câu khẳng định khi thay đại từ nghi vấn.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你好！你叫什么名字？', pinyin: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', meaning: 'Chào bạn! Bạn tên là gì?' },
        { speaker: 'B', hanzi: '我叫阮明，我是越南人。你呢？', pinyin: 'Wǒ jiào Ruǎn Míng, wǒ shì Yuènán rén. Nǐ ne?', meaning: 'Tôi tên Nguyễn Minh, tôi là người Việt Nam. Còn bạn?' },
        { speaker: 'A', hanzi: '我是中国人，我叫张华。', pinyin: 'Wǒ shì Zhōngguó rén, wǒ jiào Zhāng Huá.', meaning: 'Tôi là người Trung Quốc, tôi tên Trương Hoa.' }
      ],
      audioText: '你好！你叫什么名字？我叫阮明，我是越南人。我是中国人，我叫张华。',
      question: 'Bạn Nguyễn Minh mang quốc tịch nước nào?',
      options: ['Trung Quốc', 'Việt Nam', 'Hàn Quốc', 'Nhật Bản'],
      correctIndex: 1,
      explanation: 'Nguyễn Minh nói: "我是越南人" (Tôi là người Việt Nam).'
    },
    step6_speaking: {
      prompt: 'Giới thiệu bản thân là người Việt Nam một cách tự hào:',
      targetSentence: '我是越南人。',
      targetPinyin: 'Wǒ shì Yuènán rén.',
      targetMeaning: 'Tôi là người Việt Nam.',
      hint: 'Phát âm chuẩn Yuènán với thanh 4 rơi dứt khoát ở chữ Yuè và thanh 2 ở chữ nán.'
    },
    step7_writing: {
      prompt: 'Sắp xếp thành câu hỏi: "Bạn tên là gì?"',
      words: ['名字', '叫', '什么', '你'],
      correctOrder: ['你', '叫', '什么', '名字'],
      explanation: 'Cấu trúc: 你 (Bạn) + 叫 (Tên là) + 什么 (Gì) + 名字 (Tên).'
    },
    step8_quiz: [
      {
        id: 'q-108-1',
        type: 'multiple-choice',
        question: 'Để hỏi một người bạn nước ngoài "Bạn là người nước nào?", câu nói chuẩn là:',
        options: ['你是哪国人？', '你是谁人？', '你是什么国？', '你在哪里？'],
        correctIndex: 0,
        explanation: 'Cấu trúc chuẩn xác: 你是哪国人？ (Nǐ shì nǎ guó rén?).'
      },
      {
        id: 'q-108-2',
        type: 'multiple-choice',
        question: 'Chữ Hán nào mang nghĩa "Việt Nam"?',
        options: ['中国 (Zhōngguó)', '越南 (Yuènán)', '美国 (Měiguó)', '英国 (Yīngguó)'],
        correctIndex: 1,
        explanation: '越南 (Yuènán) âm Hán Việt là Việt Nam.'
      }
    ],
    step9_challenge: {
      title: 'Tự giới thiệu bản thân 3 câu hoàn chỉnh',
      taskDesc: 'Đọc to 3 câu: "Nǐ hǎo! Wǒ jiào... Wǒ shì Yuènán rén!".',
      targetPhrase: 'wǒ jiào wǒ shì Yuènán rén',
      xpReward: 50,
      badge: 'Tự Tin Giới Thiệu Bản Thân'
    }
  },

  {
    id: 'l-109',
    chapterId: 'ch-2',
    levelId: 'lvl-1',
    lessonNumber: 9,
    title: 'Số đếm 1–99 & Hỏi tuổi tác với 几, 多大',
    chineseTitle: '数字1-99与年龄问答（几、多大）',
    subtitle: 'Nắm vững quy tắc ghép số đếm đến 99 và cách hỏi tuổi cho trẻ em (几岁) vs người lớn (多大).',
    objective: 'Đếm trôi chảy từ 1 đến 99, biết hỏi và trả lời tuổi tác của bản thân và người thân.',
    prerequisite: 'Đã hoàn thành Bài 108.',
    completionCriteria: 'Đếm số chính xác và trả lời câu hỏi tuổi tác đạt >= 70% điểm.',
    durationMinutes: 20,
    xpReward: 50,
    tags: ['HSK 1', 'Số đếm', 'Tuổi tác', 'Số 1-99'],
    relatedMaterialIds: ['mat-1', 'mat-8'],

    step1_learn: {
      topic: 'Quy luật số đếm 1-99 & Cách hỏi tuổi theo độ tuổi',
      summary: 'Số đếm tiếng Trung ghép cực kỳ logic giống tiếng Việt: 11 = 十一 (shíyī), 20 = 二十 (èrshí), 25 = 二十五 (èrshíwǔ). Hỏi tuổi trẻ em dưới 10 tuổi dùng 几岁 (jǐ suì), người lớn dùng 多大 (duō dà).',
      initialsGuide: [
        { char: '1-10', read: 'yī, èr, sān, sì, wǔ, liù, qī, bā, jiǔ, shí' },
        { char: '几岁 (jǐ suì)', read: 'Mấy tuổi? (Dùng cho trẻ nhỏ dưới 10 tuổi)' },
        { char: '多大 (duō dà)', read: 'Bao nhiêu tuổi? (Dùng cho bạn bè, thanh niên, người lớn)' }
      ],
      audioDemoText: 'yī èr sān sì wǔ liù qī bā jiǔ shí, nǐ duō dà, wǒ èrshí suì'
    },
    step2_vocabulary: [
      { id: 'v-109-1', hanzi: '岁', pinyin: 'suì', hanviet: 'Tuế', meaning: 'Tuổi', radical: '山 (Sơn)', example: { hanzi: '我二十岁。', pinyin: 'Wǒ èrshí suì.', meaning: 'Tôi 20 tuổi.' } },
      { id: 'v-109-2', hanzi: '几', pinyin: 'jǐ', hanviet: 'Kỷ', meaning: 'Mấy (dưới 10)', radical: '几 (Kỷ)', example: { hanzi: '你几岁？', pinyin: 'Nǐ jǐ suì?', meaning: 'Cháu mấy tuổi?' } },
      { id: 'v-109-3', hanzi: '多大', pinyin: 'duō dà', hanviet: 'Đa đại', meaning: 'Bao nhiêu tuổi, lớn chừng nào', radical: '夕 (Tịch)', example: { hanzi: '你多大？', pinyin: 'Nǐ duō dà?', meaning: 'Bạn bao nhiêu tuổi?' } },
      { id: 'v-109-4', hanzi: '二十', pinyin: 'èrshí', hanviet: 'Nhị thập', meaning: 'Số 20', radical: '二 (Nhị)', example: { hanzi: '二十岁。', pinyin: 'Èrshí suì.', meaning: 'Hai mươi tuổi.' } }
    ],
    step3_hanzi: [
      { hanzi: '岁', pinyin: 'suì', meaning: 'Tuổi', strokesCount: 6, strokeOrderText: 'Bộ Sơn (山) ở trên -> Nét phẩy gập -> Nét chấm ở dưới', components: '山 + 夕', mnemonic: 'Núi non (山) trải qua bao đêm tối (夕) tính theo năm tháng tuổi tác.' },
      { hanzi: '几', pinyin: 'jǐ', meaning: 'Mấy', strokesCount: 2, strokeOrderText: 'Nét phẩy (丿) -> Nét hoành triết loan câu (横折弯钩)', components: 'Bộ Kỷ (几)', mnemonic: 'Hình chiếc bàn trà nhỏ để vài ba chén nước.' }
    ],
    step4_grammar: {
      formula: 'Hỏi tuổi bạn bè: 你多大？ | Trả lời: 我 + [Số tuổi] + 岁。',
      title: 'Phân biệt cách hỏi tuổi với 几 và 多大',
      explanation: 'Từ 几 chỉ dùng khi dự đoán số lượng dưới 10 (hỏi em bé: 你几岁？). Với người lớn, phải dùng đại từ 多大: 你多大？ hoặc kính ngữ 您多大年纪？',
      examples: [
        { hanzi: '他儿子今年五岁。(Tā érzi jīnnián wǔ suì.)', pinyin: 'wǔ suì', meaning: 'Con trai anh ấy năm nay 5 tuổi.' },
        { hanzi: '我今年二十二岁。(Wǒ jīnnián èrshí\'èr suì.)', pinyin: 'èrshí\'èr suì', meaning: 'Tôi năm nay 22 tuổi.' }
      ],
      commonMistake: {
        wrong: 'Hỏi người lớn tuổi bằng câu "你几岁？".',
        correct: 'Hỏi người lớn bằng câu "你多大？" hoặc "您多大年纪？".',
        explanation: 'Dùng "几岁" với người lớn bị coi là thiếu tế nhị, coi họ như trẻ con.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '李明，你今年多大？', pinyin: 'Lǐ Míng, nǐ jīnnián duō dà?', meaning: 'Lý Minh, năm nay bạn bao nhiêu tuổi?' },
        { speaker: 'B', hanzi: '我今年十八岁，我是大学生。', pinyin: 'Wǒ jīnnián shíbā suì, wǒ shì dàxuéshēng.', meaning: 'Tôi năm nay 18 tuổi, tôi là sinh viên đại học.' }
      ],
      audioText: '李明，你今年多大？我今年十八岁，我是大学生。',
      question: 'Lý Minh năm nay bao nhiêu tuổi?',
      options: ['8 tuổi', '18 tuổi (shíbā)', '28 tuổi (èrshíbā)', '80 tuổi (bāshí)'],
      correctIndex: 1,
      explanation: 'Lý Minh nói: "我今年十八岁" (shíbā - 18 tuổi).'
    },
    step6_speaking: {
      prompt: 'Hãy nói tuổi của bạn (Ví dụ: Tôi năm nay 20 tuổi):',
      targetSentence: '我今年二十岁。',
      targetPinyin: 'Wǒ jīnnián èrshí suì.',
      targetMeaning: 'Năm nay tôi 20 tuổi.',
      hint: 'Ghép số tuổi của bạn vào trước chữ suì.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Năm nay bạn bao nhiêu tuổi?"',
      words: ['今年', '你', '多大'],
      correctOrder: ['你', '今年', '多大'],
      explanation: 'Trật tự: Chủ ngữ 你 + Thời gian 今年 + Đại từ hỏi 多大.'
    },
    step8_quiz: [
      {
        id: 'q-109-1',
        type: 'multiple-choice',
        question: 'Số 35 trong tiếng Trung ghép như thế nào?',
        options: ['五十三 (wǔshísān)', '三十五 (sānshíwǔ)', '三五 (sānwǔ)', '五三 (wǔsān)'],
        correctIndex: 1,
        explanation: '35 = sān (3) + shí (10) + wǔ (5) ➔ 三十五 (sānshíwǔ).'
      },
      {
        id: 'q-109-2',
        type: 'multiple-choice',
        question: 'Khi gặp một em bé khoảng 5 tuổi, câu hỏi tuổi phù hợp và tự nhiên nhất là:',
        options: ['你多大？', '你几岁？', '你是谁？', '你叫什么？'],
        correctIndex: 1,
        explanation: 'Với trẻ nhỏ dưới 10 tuổi, ta dùng cấu trúc "你几岁？".'
      }
    ],
    step9_challenge: {
      title: 'Đếm nhanh các số từ 1 đến 20 trong 10 giây',
      taskDesc: 'Đếm to các số từ 1 đến 20 không bị nhầm lẫn thanh điệu.',
      targetPhrase: 'yī èr sān sì wǔ shí èrshí',
      xpReward: 50,
      badge: 'Thần Tốc Số Đếm 99'
    }
  },

  {
    id: 'l-110',
    chapterId: 'ch-2',
    levelId: 'lvl-1',
    lessonNumber: 10,
    title: 'Ôn tập Module 1.2 & Thử thách giao tiếp nhập môn',
    chineseTitle: '模块二总复习与入门沟通挑战',
    subtitle: 'Tổng hợp đàm thoại chào hỏi, giới thiệu họ tên, quốc tịch, tuổi tác và sẵn sàng khiêu chiến Boss.',
    objective: 'Tự tin đàm thoại một đoạn hội thoại làm quen hoàn chỉnh 4–5 lượt lời với người bản ngữ.',
    prerequisite: 'Đã hoàn thành Bài 106–109.',
    completionCriteria: 'Đạt >= 80% điểm bài tập tổng kết Module 1.2.',
    durationMinutes: 25,
    xpReward: 60,
    tags: ['HSK 1', 'Tổng kết Module', 'Giao tiếp thực tế', 'Review Checkpoint'],
    relatedMaterialIds: ['mat-1', 'mat-2', 'mat-5'],

    step1_learn: {
      topic: 'Chuỗi đàm thoại làm quen kinh điển 4 bước',
      summary: 'Bước 1: Chào hỏi kính cẩn (你好 / 您好) -> Bước 2: Hỏi & Giới thiệu tên (你叫什么名字) -> Bước 3: Hỏi & Nêu quốc tịch (你是哪国人) -> Bước 4: Hỏi tuổi tác & Chào tạm biệt (你多大 / 再见).',
      initialsGuide: [
        { char: 'Hội thoại mẫu', read: 'Nǐ hǎo! Wǒ jiào Ān, wǒ shì Yuènán rén, wǒ jīnnián èrshí suì. Hěn gāoxìng rènshi nǐ!' }
      ],
      audioDemoText: 'nǐ hǎo, wǒ jiào ruǎnmíng, wǒ shì Yuènán rén, hěn gāoxìng rènshi nǐ'
    },
    step2_vocabulary: [
      { id: 'v-110-1', hanzi: '认识', pinyin: 'rènshi', hanviet: 'Nhận thức', meaning: 'Quen biết, làm quen', radical: '讠 (Ngôn)', example: { hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', meaning: 'Rất vui được làm quen với bạn!' } },
      { id: 'v-110-2', hanzi: '高兴', pinyin: 'gāoxìng', hanviet: 'Cao hưng', meaning: 'Vui vẻ, phấn khởi', radical: '高 (Cao)', example: { hanzi: '我也很高兴。', pinyin: 'Wǒ yě hěn gāoxìng.', meaning: 'Tôi cũng rất vui.' } },
      { id: 'v-110-3', hanzi: '朋友', pinyin: 'péngyou', hanviet: 'Bằng hữu', meaning: 'Bạn bè', radical: '月 (Nguyệt)', example: { hanzi: '我们是好朋友。', pinyin: 'Wǒmen shì hǎo péngyou.', meaning: 'Chúng tôi là bạn tốt.' } }
    ],
    step3_hanzi: [
      { hanzi: '友', pinyin: 'yǒu', meaning: 'Bạn bè (Hữu)', strokesCount: 4, strokeOrderText: 'Ngang -> Phẩy -> Nét bộ Hựu (又)', components: 'Bộ Hựu (又)', mnemonic: 'Hai bàn tay nắm lấy nhau tượng trưng cho tình bạn thân thiết.' }
    ],
    step4_grammar: {
      formula: 'Cụm từ giao tế kinh điển: 很高兴认识你！ (Hěn gāoxìng rènshi nǐ!)',
      title: 'Lời kết thúc hoàn hảo cho màn làm quen',
      explanation: 'Sau khi đã biết tên tuổi quốc tịch, người Trung Quốc luôn dùng câu "很高兴认识你" để thể hiện thiện chí hữu nghị.',
      examples: [
        { hanzi: 'A: 很高兴认识你！ B: 认识你我也很高兴！', pinyin: 'A: Hěn gāoxìng rènshi nǐ! B: Rènshi nǐ wǒ yě hěn gāoxìng!', meaning: 'A: Rất vui được quen bạn! B: Quen bạn tôi cũng rất vui!' }
      ],
      commonMistake: {
        wrong: 'Nói cộc lốc rồi bỏ đi sau khi hỏi xong tên.',
        correct: 'Luôn kết bằng câu "很高兴认识你" và "再见".',
        explanation: 'Giúp xây dựng hình ảnh người học lịch sự, văn minh.'
      }
    },
    step5_listening: {
      dialogue: [
        { speaker: 'A', hanzi: '你好！我是王老师，你叫什么名字？', pinyin: 'Nǐ hǎo! Wǒ shì Wáng lǎoshī, nǐ jiào shénme míngzi?', meaning: 'Chào em! Thầy là thầy Vương, em tên là gì?' },
        { speaker: 'B', hanzi: '王老师您好！我叫陈兰，我是越南留学生，今年二十岁。', pinyin: 'Wáng lǎoshī nín hǎo! Wǒ jiào Chén Lán, wǒ shì Yuènán liúxuéshēng, jīnnián èrshí suì.', meaning: 'Em chào thầy Vương ạ! Em tên Trần Lan, em là du học sinh Việt Nam, năm nay 20 tuổi.' },
        { speaker: 'A', hanzi: '很好！欢迎你来到北京！', pinyin: 'Hěn hǎo! Huānyíng nǐ lái dào Běijīng!', meaning: 'Rất tốt! Chào mừng em đến với Bắc Kinh!' }
      ],
      audioText: '你好！我是王老师，你叫什么名字？王老师您好！我叫陈兰，我是越南留学生，今年二十岁。',
      question: 'Bạn Trần Lan đến Bắc Kinh với tư cách là gì?',
      options: ['Khách du lịch', 'Du học sinh Việt Nam (liúxuéshēng)', 'Giáo viên thỉnh giảng', 'Nhân viên kinh doanh'],
      correctIndex: 1,
      explanation: 'Trần Lan giới thiệu: "我是越南留学生" (Du học sinh Việt Nam).'
    },
    step6_speaking: {
      prompt: 'Đọc to trọn vẹn màn tự giới thiệu bản thân:',
      targetSentence: '你好，我是越南人，很高兴认识你！',
      targetPinyin: 'Nǐ hǎo, wǒ shì Yuènán rén, hěn gāoxìng rènshi nǐ!',
      targetMeaning: 'Xin chào, tôi là người Việt Nam, rất vui được làm quen với bạn!',
      hint: 'Phát âm tự tin và mượt mà các từ gāoxìng, rènshi.'
    },
    step7_writing: {
      prompt: 'Sắp xếp câu: "Rất vui được làm quen với bạn"',
      words: ['认识', '你', '很高兴'],
      correctOrder: ['很高兴', '认识', '你'],
      explanation: 'Cụm cố định: 很高兴 (Rất vui) + 认识你 (Quen biết bạn).'
    },
    step8_quiz: [
      {
        id: 'q-110-1',
        type: 'multiple-choice',
        question: 'Khi đối tác nói "很高兴认识你！", bạn nên đáp lại tự nhiên nhất là:',
        options: ['认识你我也很高兴！', '我不客气！', '明天见！', '你叫什么名字？'],
        correctIndex: 0,
        explanation: 'Đáp lại: "认识你我也很高兴！" (Được quen bạn tôi cũng rất vui!).'
      },
      {
        id: 'q-110-2',
        type: 'multiple-choice',
        question: 'Tổng hợp kiến thức Module 1.2: Từ nào sau đây KHÔNG phải là một đại từ?',
        options: ['你 (nǐ)', '谁 (shéi)', '老师 (lǎoshī)', '什么 (shénme)'],
        correctIndex: 2,
        explanation: '老师 là danh từ chỉ nghề nghiệp/người, không phải đại từ.'
      }
    ],
    step9_challenge: {
      title: 'Mở khóa Boss Chapter 2',
      taskDesc: 'Hoàn thành bài ôn tập để sẵn sàng thi đấu giao tiếp tại quán trà sữa Sanlitun!',
      targetPhrase: 'hěn gāoxìng rènshi nǐ péngyou',
      xpReward: 60,
      badge: 'Bậc Thầy Giao Tiếp Nhập Môn'
    }
  },
  {
    "id": "l-111",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 11,
    "title": "Gia đình & Động từ sở hữu 有 / 没有",
    "chineseTitle": "家庭与动词“有/没有”",
    "subtitle": "Nói về các thành viên gia đình, đếm người bằng lượng từ 口 và làm chủ động từ 有/没有.",
    "objective": "Giới thiệu trôi chảy số người trong gia đình và sử dụng chính xác phủ định 没有 (không dùng 不有).",
    "prerequisite": "Đã hoàn thành Module 1.2.",
    "completionCriteria": "Đạt >= 70% bài trắc nghiệm và giới thiệu đúng các thành viên gia đình.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Gia đình",
      "Động từ 有",
      "Lượng từ 口"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-5"
    ],
    "step1_learn": {
      "topic": "Động từ sở hữu 有 / 没有 & Thành viên trong gia đình",
      "summary": "Để diễn tả 'có' ta dùng 有 (yǒu), phủ định của 有 luôn luôn là 没有 (méiyǒu), tuyệt đối không dùng 不有. Đếm số người trong gia đình dùng lượng từ 口 (kǒu).",
      "audioDemoText": "nǐ jiā yǒu jǐ kǒu rén, wǒ jiā yǒu sì kǒu rén"
    },
    "step2_vocabulary": [
      {
        "id": "v-111-1",
        "hanzi": "有",
        "pinyin": "yǒu",
        "hanviet": "Hữu",
        "meaning": "Có",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "我有两个姐姐。",
          "pinyin": "Wǒ yǒu liǎng gè jiějie.",
          "meaning": "Tôi có 2 người chị gái."
        }
      },
      {
        "id": "v-111-2",
        "hanzi": "没有",
        "pinyin": "méiyǒu",
        "hanviet": "Một hữu",
        "meaning": "Không có",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "我没有哥哥。",
          "pinyin": "Wǒ méiyǒu gēge.",
          "meaning": "Tôi không có anh trai."
        }
      },
      {
        "id": "v-111-3",
        "hanzi": "家",
        "pinyin": "jiā",
        "hanviet": "Gia",
        "meaning": "Nhà, gia đình",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "我家在北京。",
          "pinyin": "Wǒ jiā zài Běijīng.",
          "meaning": "Nhà tôi ở Bắc Kinh."
        }
      },
      {
        "id": "v-111-4",
        "hanzi": "哥哥",
        "pinyin": "gēge",
        "hanviet": "Ca ca",
        "meaning": "Anh trai",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我哥哥很高。",
          "pinyin": "Wǒ gēge hěn gāo.",
          "meaning": "Anh trai tôi rất cao."
        }
      },
      {
        "id": "v-111-5",
        "hanzi": "姐姐",
        "pinyin": "jiějie",
        "hanviet": "Tỷ tỷ",
        "meaning": "Chị gái",
        "radical": "女 (Nữ)",
        "example": {
          "hanzi": "姐姐是医生。",
          "pinyin": "Jiějie shì yīshēng.",
          "meaning": "Chị gái là bác sĩ."
        }
      },
      {
        "id": "v-111-6",
        "hanzi": "和",
        "pinyin": "hé",
        "hanviet": "Hòa",
        "meaning": "Và, cùng với",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "爸爸和我。",
          "pinyin": "Bàba hé wǒ.",
          "meaning": "Bố và tôi."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "有",
        "pinyin": "yǒu",
        "meaning": "Có (sở hữu)",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy -> Bộ Nguyệt (月)",
        "components": "Bộ Nguyệt",
        "mnemonic": "Bàn tay nắm miếng thịt tượng trưng sự sở hữu sung túc."
      },
      {
        "hanzi": "家",
        "pinyin": "jiā",
        "meaning": "Gia đình, nhà",
        "strokesCount": 10,
        "strokeOrderText": "Mái nhà (宀) -> Chữ Thỉ (豕)",
        "components": "宀 + 豕",
        "mnemonic": "Dưới mái nhà che chở có đàn gia súc sinh sống ấm no."
      }
    ],
    "step4_grammar": {
      "title": "Phủ định của động từ 有 là 没有 (KHÔNG DÙNG 不有)",
      "formula": "Chủ ngữ + 有 / 没有 + Danh từ",
      "explanation": "Trong tiếng Trung, phủ định duy nhất của động từ sở hữu 有 là 没有. Tuyệt đối không dùng 不 có nghĩa là không để ghép với 有.",
      "examples": [
        {
          "hanzi": "我没有汉语书。",
          "pinyin": "Wǒ méiyǒu Hànyǔ shū.",
          "meaning": "Tôi không có sách tiếng Trung."
        }
      ],
      "commonMistake": {
        "wrong": "我不有书 ❌",
        "correct": "我没有书 ✔️",
        "explanation": "Phủ định của 有 luôn luôn là 没有."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你家有几口人？",
          "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
          "meaning": "Nhà bạn có mấy người?"
        },
        {
          "speaker": "B",
          "hanzi": "我家有四口人：爸爸、妈妈、哥哥和我。",
          "pinyin": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.",
          "meaning": "Nhà tôi có 4 người: bố, mẹ, anh trai và tôi."
        }
      ],
      "audioText": "你家有几口人？我家有四口人：爸爸、妈妈、哥哥和我。",
      "question": "Gia đình người B gồm những ai?",
      "options": [
        "3 người: bố, mẹ và B",
        "4 người: bố, mẹ, anh trai và B",
        "5 người",
        "2 người"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 四口人: bàba, māma, gēge hé wǒ (4 người)."
    },
    "step6_speaking": {
      "prompt": "Nói về số người trong nhà:",
      "targetSentence": "我家有四口人。",
      "targetPinyin": "Wǒ jiā yǒu sì kǒu rén.",
      "targetMeaning": "Nhà tôi có 4 người.",
      "hint": "Đọc kǒu rõ ràng với thanh 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi không có anh trai",
      "words": [
        "哥哥",
        "我",
        "没有"
      ],
      "correctOrder": [
        "我",
        "没有",
        "哥哥"
      ],
      "explanation": "我 + 没有 + 哥哥."
    },
    "step8_quiz": [
      {
        "id": "q-111-1",
        "type": "multiple-choice",
        "question": "Câu nào sau đây phủ định đúng về sở hữu?",
        "options": [
          "我不有姐姐",
          "我没有姐姐",
          "我没姐姐有",
          "我不姐姐"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định của 有 bắt buộc là 没有."
      },
      {
        "id": "q-111-2",
        "type": "multiple-choice",
        "question": "Lượng từ dùng để hỏi số người trong gia đình là:",
        "options": [
          "个 (gè)",
          "口 (kǒu)",
          "本 (běn)",
          "只 (zhī)"
        ],
        "correctIndex": 1,
        "explanation": "Đếm người trong gia đình dùng 口 (kǒu rén)."
      }
    ],
    "step9_challenge": {
      "title": "Giới thiệu gia đình bạn",
      "taskDesc": "Đọc to câu giới thiệu gia đình: Nhà tôi có mấy người, gồm những ai.",
      "targetPhrase": "wǒ jiā yǒu sì kǒu rén",
      "xpReward": 50,
      "badge": "Ấm Áp Tình Thân"
    }
  },

  {
    "id": "l-112",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 12,
    "title": "Ngày tháng năm theo trật tự lớn đến bé",
    "chineseTitle": "年月日与星期表达",
    "subtitle": "Nắm vững quy tắc thời gian kinh điển của tiếng Trung: Năm -> Tháng -> Ngày -> Thứ trong tuần.",
    "objective": "Hỏi và nói chuẩn xác ngày, tháng, năm và thứ trong tuần bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 111.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng ngày hôm nay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Thời gian",
      "Ngày tháng",
      "Thứ trong tuần"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Trật tự thời gian từ lớn đến bé: 年 (nián) -> 月 (yuè) -> 日/号 (hào) -> 星期 (xīngqī)",
      "summary": "Người Trung Quốc tư duy từ vĩ mô đến vi mô: Năm trước, tháng giữa, ngày sau, cuối cùng là thứ trong tuần. Trong văn nói thường dùng 号 thay cho 日.",
      "audioDemoText": "jīntiān jǐ yuè jǐ hào, jīntiān shí yuè jiǔ hào xīngqīwǔ"
    },
    "step2_vocabulary": [
      {
        "id": "v-112-1",
        "hanzi": "今天",
        "pinyin": "jīntiān",
        "hanviet": "Kim thiên",
        "meaning": "Hôm nay",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "今天很冷。",
          "pinyin": "Jīntiān hěn lěng.",
          "meaning": "Hôm nay rất lạnh."
        }
      },
      {
        "id": "v-112-2",
        "hanzi": "明天",
        "pinyin": "míngtiān",
        "hanviet": "Minh thiên",
        "meaning": "Ngày mai",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "明天见。",
          "pinyin": "Míngtiān jiàn.",
          "meaning": "Mai gặp lại nhé."
        }
      },
      {
        "id": "v-112-3",
        "hanzi": "昨天",
        "pinyin": "zuótiān",
        "hanviet": "Tạc thiên",
        "meaning": "Hôm qua",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "昨天是星期四。",
          "pinyin": "Zuótiān shì xīngqīsì.",
          "meaning": "Hôm qua là thứ Năm."
        }
      },
      {
        "id": "v-112-4",
        "hanzi": "月",
        "pinyin": "yuè",
        "hanviet": "Nguyệt",
        "meaning": "Tháng",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "十月。",
          "pinyin": "Shí yuè.",
          "meaning": "Tháng 10."
        }
      },
      {
        "id": "v-112-5",
        "hanzi": "号",
        "pinyin": "hào",
        "hanviet": "Hào",
        "meaning": "Ngày, mùng",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "九号。",
          "pinyin": "Jiǔ hào.",
          "meaning": "Mùng 9."
        }
      },
      {
        "id": "v-112-6",
        "hanzi": "星期",
        "pinyin": "xīngqī",
        "hanviet": "Tinh kỳ",
        "meaning": "Thứ, tuần",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "星期五。",
          "pinyin": "Xīngqīwǔ.",
          "meaning": "Thứ Sáu."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "天",
        "pinyin": "tiān",
        "meaning": "Trời, ngày",
        "strokesCount": 4,
        "strokeOrderText": "Ngang trên -> Ngang dưới -> Phẩy -> Mác",
        "components": "一 + 大",
        "mnemonic": "Phía trên đỉnh đầu con người to lớn chính là bầu trời cao rộng."
      },
      {
        "hanzi": "月",
        "pinyin": "yuè",
        "meaning": "Mặt trăng, tháng",
        "strokesCount": 4,
        "strokeOrderText": "Phẩy đứng -> Ngang gập móc -> Hai nét ngang trong",
        "components": "Bộ Nguyệt",
        "mnemonic": "Hình tượng vầng trăng khuyết chiếu sáng ban đêm."
      }
    ],
    "step4_grammar": {
      "title": "Trật tự thời gian từ lớn đến bé",
      "formula": "Năm (年) + Tháng (月) + Ngày (号) + Thứ (星期)",
      "explanation": "Quy tắc bất di bất dịch của tiếng Trung là đơn vị lớn luôn đứng trước đơn vị bé, ngược hoàn toàn với tiếng Việt.",
      "examples": [
        {
          "hanzi": "今天十月九号，星期五。",
          "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.",
          "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."
        }
      ],
      "commonMistake": {
        "wrong": "Nói ngày trước tháng sau theo tiếng Việt (9号10月 ❌)",
        "correct": "Tháng trước ngày sau: 10月9号 ✔️",
        "explanation": "Thời gian tiếng Trung luôn đi từ lớn đến bé."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天几月几号？",
          "pinyin": "Jīntiān jǐ yuè jǐ hào?",
          "meaning": "Hôm nay ngày mấy tháng mấy?"
        },
        {
          "speaker": "B",
          "hanzi": "今天十月九号，星期五。",
          "pinyin": "Jīntiān shí yuè jiǔ hào, xīngqīwǔ.",
          "meaning": "Hôm nay ngày 9 tháng 10, thứ Sáu."
        }
      ],
      "audioText": "今天十月九号，星期五。",
      "question": "Hôm nay là thứ mấy?",
      "options": [
        "Thứ Năm",
        "Thứ Sáu (xīngqīwǔ)",
        "Thứ Bảy",
        "Chủ nhật"
      ],
      "correctIndex": 1,
      "explanation": "星期五 là Thứ Sáu."
    },
    "step6_speaking": {
      "prompt": "Nói ngày hôm nay:",
      "targetSentence": "今天十月九号。",
      "targetPinyin": "Jīntiān shí yuè jiǔ hào.",
      "targetMeaning": "Hôm nay ngày 9 tháng 10.",
      "hint": "Tháng trước ngày sau: shí yuè jiǔ hào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Ngày mai là thứ Bảy",
      "words": [
        "明天",
        "星期六",
        "是"
      ],
      "correctOrder": [
        "明天",
        "是",
        "星期六"
      ],
      "explanation": "明天 + 是 + 星期六."
    },
    "step8_quiz": [
      {
        "id": "q-112-1",
        "type": "multiple-choice",
        "question": "Trong tiếng Trung, 'Thứ Hai' được nói là gì?",
        "options": [
          "星期一",
          "星期二",
          "星期天",
          "星期日"
        ],
        "correctIndex": 0,
        "explanation": "Thứ Hai tương ứng số 1: 星期一."
      },
      {
        "id": "q-112-2",
        "type": "multiple-choice",
        "question": "Cách nói ngày 1 tháng 1 chuẩn là:",
        "options": [
          "一号一月",
          "一月一号",
          "一号月一",
          "一月号一"
        ],
        "correctIndex": 1,
        "explanation": "Tháng trước ngày sau: 一月一号."
      }
    ],
    "step9_challenge": {
      "title": "Đọc ngày sinh nhật của bạn",
      "taskDesc": "Đọc to ngày tháng sinh nhật của bản thân bằng tiếng Trung.",
      "targetPhrase": "jīntiān shí yuè jiǔ hào",
      "xpReward": 50,
      "badge": "Làm Chủ Lịch Trình"
    }
  },

  {
    "id": "l-113",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 13,
    "title": "Giờ giấc & Hoạt động thường nhật",
    "chineseTitle": "时间点与日常活动（现在几点）",
    "subtitle": "Làm chủ cách hỏi giờ (现在几点), nói giờ hơn/phút và diễn đạt lịch trình sinh hoạt hàng ngày.",
    "objective": "Hỏi và trả lời giờ giấc chính xác (点 - giờ, 分 - phút, 半 - rưỡi), miêu tả lịch sinh hoạt cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 112.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng giờ hiện tại.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Giờ giấc",
      "Hỏi giờ",
      "Lịch sinh hoạt"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hỏi giờ: 现在几点？ (Xiànzài jǐ diǎn?) & Diễn đạt mốc thời gian",
      "summary": "点 (diǎn) là giờ, 分 (fēn) là phút, 半 (bàn) là 30 phút/rưỡi. Trạng ngữ chỉ thời gian luôn đứng trước động từ trong câu tiếng Trung.",
      "audioDemoText": "xiànzài jǐ diǎn, xiànzài bā diǎn bàn, wǒ qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {
        "id": "v-113-1",
        "hanzi": "现在",
        "pinyin": "xiànzài",
        "hanviet": "Hiện tại",
        "meaning": "Bây giờ, hiện nay",
        "radical": "玉 (Ngọc)",
        "example": {
          "hanzi": "现在几点了？",
          "pinyin": "Xiànzài jǐ diǎn le?",
          "meaning": "Bây giờ mấy giờ rồi?"
        }
      },
      {
        "id": "v-113-2",
        "hanzi": "点",
        "pinyin": "diǎn",
        "hanviet": "Điểm",
        "meaning": "Giờ",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "八点。",
          "pinyin": "Bā diǎn.",
          "meaning": "8 giờ."
        }
      },
      {
        "id": "v-113-3",
        "hanzi": "分",
        "pinyin": "fēn",
        "hanviet": "Phân",
        "meaning": "Phút",
        "radical": "刀 (Đao)",
        "example": {
          "hanzi": "十分。",
          "pinyin": "Shí fēn.",
          "meaning": "10 phút."
        }
      },
      {
        "id": "v-113-4",
        "hanzi": "半",
        "pinyin": "bàn",
        "hanviet": "Bán",
        "meaning": "Rưỡi, nửa",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "八点半。",
          "pinyin": "Bā diǎn bàn.",
          "meaning": "8 giờ rưỡi."
        }
      },
      {
        "id": "v-113-5",
        "hanzi": "上午",
        "pinyin": "shàngwǔ",
        "hanviet": "Thượng ngọ",
        "meaning": "Buổi sáng",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "上午好。",
          "pinyin": "Shàngwǔ hǎo.",
          "meaning": "Chào buổi sáng."
        }
      },
      {
        "id": "v-113-6",
        "hanzi": "下午",
        "pinyin": "xiàwǔ",
        "hanviet": "Hạ ngọ",
        "meaning": "Buổi chiều",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "下午三点。",
          "pinyin": "Xiàwǔ sān diǎn.",
          "meaning": "3 giờ chiều."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "现",
        "pinyin": "xiàn",
        "meaning": "Hiện tại, xuất hiện",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Vương (王) -> Bộ Kiến (见)",
        "components": "王 + 见",
        "mnemonic": "Viên ngọc quý xuất hiện rực rỡ ở hiện tại."
      },
      {
        "hanzi": "点",
        "pinyin": "diǎn",
        "meaning": "Giờ, chấm nhỏ",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Chiếm (占) ở trên -> Bốn chấm hỏa (灬) ở dưới",
        "components": "占 + 灬",
        "mnemonic": "Ngọn lửa nhỏ cháy tạo từng đốm sáng chỉ mốc giờ."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của trạng ngữ thời gian trong câu",
      "formula": "Chủ ngữ + Thời gian + Động từ + Tân ngữ (HOẶC Thời gian + Chủ ngữ + Động từ)",
      "explanation": "Trong tiếng Trung, thời gian PHẢI đứng trước động từ. Tuyệt đối không để thời gian ở cuối câu như tiếng Việt.",
      "examples": [
        {
          "hanzi": "我上午八点去学校。",
          "pinyin": "Wǒ shàngwǔ bā diǎn qù xuéxiào.",
          "meaning": "Tôi đi đến trường lúc 8 giờ sáng."
        }
      ],
      "commonMistake": {
        "wrong": "我吃早饭在七点 ❌",
        "correct": "我七点吃早饭 ✔️",
        "explanation": "Thời gian luôn đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，现在几点？",
          "pinyin": "Qǐngwèn, xiànzài jǐ diǎn?",
          "meaning": "Xin hỏi, bây giờ mấy giờ?"
        },
        {
          "speaker": "B",
          "hanzi": "现在下午三点半。",
          "pinyin": "Xiànzài xiàwǔ sān diǎn bàn.",
          "meaning": "Bây giờ là 3 giờ rưỡi chiều."
        }
      ],
      "audioText": "请问，现在几点？现在下午三点半。",
      "question": "Bây giờ là thời điểm nào?",
      "options": [
        "8 giờ sáng",
        "3 giờ rưỡi chiều (sān diǎn bàn)",
        "12 giờ trưa",
        "5 giờ chiều"
      ],
      "correctIndex": 1,
      "explanation": "3 giờ rưỡi chiều: 下午三点半."
    },
    "step6_speaking": {
      "prompt": "Trả lời câu hỏi bây giờ mấy giờ:",
      "targetSentence": "现在八点半。",
      "targetPinyin": "Xiànzài bā diǎn bàn.",
      "targetMeaning": "Bây giờ 8 giờ rưỡi.",
      "hint": "Đọc bā diǎn bàn dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi 8 giờ đi học",
      "words": [
        "去学校",
        "八点",
        "我"
      ],
      "correctOrder": [
        "我",
        "八点",
        "去学校"
      ],
      "explanation": "我 + 八点 + 去学校."
    },
    "step8_quiz": [
      {
        "id": "q-113-1",
        "type": "multiple-choice",
        "question": "Cách nói '8 giờ rưỡi' trong tiếng Trung là:",
        "options": [
          "八点半",
          "八分点",
          "半八点",
          "八点三十五"
        ],
        "correctIndex": 0,
        "explanation": "8 giờ rưỡi là 八点半 (bā diǎn bàn)."
      },
      {
        "id": "q-113-2",
        "type": "multiple-choice",
        "question": "Câu nào sau đây đúng trật tự thời gian?",
        "options": [
          "我去公司八点",
          "我八点去公司",
          "去公司我八点",
          "八点公司我去"
        ],
        "correctIndex": 1,
        "explanation": "Thời gian đứng trước động từ: 我八点去公司."
      }
    ],
    "step9_challenge": {
      "title": "Nói giờ hiện tại",
      "taskDesc": "Nhìn đồng hồ và đọc to giờ hiện tại bằng tiếng Trung.",
      "targetPhrase": "xiànzài jǐ diǎn le",
      "xpReward": 50,
      "badge": "Đồng Hồ Sống"
    }
  },

  {
    "id": "l-114",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 14,
    "title": "Địa điểm & Động từ chỉ nơi chốn 在, 去",
    "chineseTitle": "地点与介词“在/去”（你在哪儿）",
    "subtitle": "Hỏi và nói vị trí ở đâu với 在 (zài), đi đâu với 去 (qù) và cấu trúc làm gì ở đâu.",
    "objective": "Hỏi nơi chốn (哪儿), nói phương hướng di chuyển (去) và diễn đạt cấu trúc 'ở đâu làm gì' chuẩn ngữ pháp.",
    "prerequisite": "Đã hoàn thành Bài 113.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 在 + Địa điểm + Động từ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Địa điểm",
      "Giới từ 在",
      "Động từ 去"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hỏi vị trí: 你在哪儿？ (Nǐ zài nǎr?) & Cấu trúc Ở ĐÂU LÀM GÌ",
      "summary": "Trong tiếng Trung, địa điểm xảy ra hành động PHẢI đứng trước hành động đó: S + 在 + Nơi chốn + V. Khác với tiếng Việt (Ăn cơm ở nhà -> Tiếng Trung: Ở nhà ăn cơm).",
      "audioDemoText": "nǐ zài nǎr, wǒ zài xuéxiào, wǒ zài jiā chīfàn"
    },
    "step2_vocabulary": [
      {
        "id": "v-114-1",
        "hanzi": "在",
        "pinyin": "zài",
        "hanviet": "Tại",
        "meaning": "Ở, tại",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "你在哪儿？",
          "pinyin": "Nǐ zài nǎr?",
          "meaning": "Bạn đang ở đâu?"
        }
      },
      {
        "id": "v-114-2",
        "hanzi": "哪儿",
        "pinyin": "nǎr",
        "hanviet": "Na nhi",
        "meaning": "Ở đâu, chỗ nào",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "你去哪儿？",
          "pinyin": "Nǐ qù nǎr?",
          "meaning": "Bạn đi đâu đấy?"
        }
      },
      {
        "id": "v-114-3",
        "hanzi": "去",
        "pinyin": "qù",
        "hanviet": "Khứ",
        "meaning": "Đi",
        "radical": "厶 (Khứ)",
        "example": {
          "hanzi": "我去学校。",
          "pinyin": "Wǒ qù xuéxiào.",
          "meaning": "Tôi đi đến trường."
        }
      },
      {
        "id": "v-114-4",
        "hanzi": "学校",
        "pinyin": "xuéxiào",
        "hanviet": "Học hiệu",
        "meaning": "Trường học",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "学校很大。",
          "pinyin": "Xuéxiào hěn dà.",
          "meaning": "Trường học rất to."
        }
      },
      {
        "id": "v-114-5",
        "hanzi": "饭馆",
        "pinyin": "fànguǎn",
        "hanviet": "Phạn quán",
        "meaning": "Quán ăn, nhà hàng",
        "radical": "饣 (Thực)",
        "example": {
          "hanzi": "去饭馆吃饭。",
          "pinyin": "Qù fànguǎn chīfàn.",
          "meaning": "Đi quán ăn cơm."
        }
      },
      {
        "id": "v-114-6",
        "hanzi": "商店",
        "pinyin": "shāngdiàn",
        "hanviet": "Thương điếm",
        "meaning": "Cửa hàng",
        "radical": "广 (Quảng)",
        "example": {
          "hanzi": "商店有水。",
          "pinyin": "Shāngdiàn yǒu shuǐ.",
          "meaning": "Cửa hàng có nước."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "在",
        "pinyin": "zài",
        "meaning": "Ở, tồn tại",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy -> Sổ -> Ngang -> Sổ -> Ngang đóng (Bộ Thổ 土)",
        "components": "Bộ Thổ (土)",
        "mnemonic": "Cây cối đứng vững trên mặt đất (Thổ) biểu thị sự tồn tại."
      },
      {
        "hanzi": "去",
        "pinyin": "qù",
        "meaning": "Đi",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy gập -> Chấm",
        "components": "土 + 厶",
        "mnemonic": "Rời khỏi mảnh đất quê hương để đi nơi khác."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc vàng: Ở đâu làm gì (Chủ ngữ + 在 + Nơi chốn + Động từ)",
      "formula": "Chủ ngữ + 在 + Địa điểm + Hành động",
      "explanation": "Người Trung Quốc quy định: Phải đến địa điểm đó trước rồi mới thực hiện hành động. Do đó cụm 在 + Địa điểm luôn đứng trước Động từ.",
      "examples": [
        {
          "hanzi": "我在学校学汉语。",
          "pinyin": "Wǒ zài xuéxiào xué Hànyǔ.",
          "meaning": "Tôi học tiếng Trung ở trường."
        }
      ],
      "commonMistake": {
        "wrong": "我学汉语在学校 ❌",
        "correct": "我在学校学汉语 ✔️",
        "explanation": "Địa điểm phải đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "喂，你在哪儿？",
          "pinyin": "Wèi, nǐ zài nǎr?",
          "meaning": "Alo, bạn đang ở đâu thế?"
        },
        {
          "speaker": "B",
          "hanzi": "我在商店买东西，你呢？",
          "pinyin": "Wǒ zài shāngdiàn mǎi dōngxi, nǐ ne?",
          "meaning": "Tôi đang ở cửa hàng mua đồ, còn bạn?"
        },
        {
          "speaker": "A",
          "hanzi": "我在家看书。",
          "pinyin": "Wǒ zài jiā kàn shū.",
          "meaning": "Tôi đang ở nhà đọc sách."
        }
      ],
      "audioText": "你在哪儿？我在商店买东西。我在家看书。",
      "question": "Người B đang ở đâu và làm gì?",
      "options": [
        "Ở trường học",
        "Ở nhà đọc sách",
        "Ở cửa hàng mua đồ (shāngdiàn)",
        "Ở nhà hàng ăn cơm"
      ],
      "correctIndex": 2,
      "explanation": "Người B nói: 我在商店买东西."
    },
    "step6_speaking": {
      "prompt": "Nói bạn đang ở trường học:",
      "targetSentence": "我在学校。",
      "targetPinyin": "Wǒ zài xuéxiào.",
      "targetMeaning": "Tôi đang ở trường học.",
      "hint": "Đọc xuéxiào thanh 2 và thanh 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi ăn cơm ở nhà hàng",
      "words": [
        "吃饭",
        "在饭馆",
        "我"
      ],
      "correctOrder": [
        "我",
        "在饭馆",
        "吃饭"
      ],
      "explanation": "我 + 在饭馆 + 吃饭."
    },
    "step8_quiz": [
      {
        "id": "q-114-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp nói 'Tôi đọc sách ở nhà':",
        "options": [
          "我看书在家",
          "我在家看书",
          "在家我书看",
          "我书看在家"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc chuẩn: 在家 (Ở nhà) + 看书 (Đọc sách)."
      },
      {
        "id": "q-114-2",
        "type": "multiple-choice",
        "question": "Từ để hỏi 'Ở đâu' trong tiếng Trung là:",
        "options": [
          "什么 (shénme)",
          "哪儿 (nǎr)",
          "谁 (shéi)",
          "几 (jǐ)"
        ],
        "correctIndex": 1,
        "explanation": "哪儿 mang nghĩa là ở đâu, chỗ nào."
      }
    ],
    "step9_challenge": {
      "title": "Báo vị trí cho bạn bè",
      "taskDesc": "Nói trọn vẹn câu: Bạn đang ở đâu và đang làm gì.",
      "targetPhrase": "wǒ zài xuéxiào kàn shū",
      "xpReward": 50,
      "badge": "Định Vị Chuẩn Xác"
    }
  },

  {
    "id": "l-115",
    "chapterId": "ch-3",
    "levelId": "lvl-1",
    "lessonNumber": 15,
    "title": "Mua sắm cơ bản & Hỏi giá tiền 多少钱",
    "chineseTitle": "基础购物与问价（多少钱）",
    "subtitle": "Hỏi giá (多少钱), đơn vị tiền tệ 块 (kuài) và cấu trúc cảm thán 太...了 (quá...rồi).",
    "objective": "Tự tin hỏi giá đồ vật, hiểu số tiền người bán nói và biết cách kêu đắt (太贵了).",
    "prerequisite": "Đã hoàn thành Bài 114.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại mua bán cơ bản.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Mua sắm",
      "Giá tiền",
      "多少钱",
      "太...了"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-2"
    ],
    "step1_learn": {
      "topic": "Hỏi giá: 这个多少钱？ (Zhège duōshao qián?) & Đơn vị tiền tệ",
      "summary": "Để hỏi giá ta dùng 多少钱. Đơn vị tiền tệ khẩu ngữ là 块 (kuài - đồng/tệ), 毛 (máo - hào). Cấu trúc cảm thán: 太 + Tính từ + 了! (太贵了 - Đắt quá rồi!).",
      "audioDemoText": "zhè ge duōshao qián, èrshí kuài qián, tài guì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-115-1",
        "hanzi": "多少",
        "pinyin": "duōshao",
        "hanviet": "Đa thiểu",
        "meaning": "Bao nhiêu",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "多少钱？",
          "pinyin": "Duōshao qián?",
          "meaning": "Bao nhiêu tiền?"
        }
      },
      {
        "id": "v-115-2",
        "hanzi": "钱",
        "pinyin": "qián",
        "hanviet": "Tiền",
        "meaning": "Tiền bạc",
        "radical": "钅 (Kim)",
        "example": {
          "hanzi": "我有钱。",
          "pinyin": "Wǒ yǒu qián.",
          "meaning": "Tôi có tiền."
        }
      },
      {
        "id": "v-115-3",
        "hanzi": "块",
        "pinyin": "kuài",
        "hanviet": "Khối",
        "meaning": "Đồng tệ (khẩu ngữ)",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "五块钱。",
          "pinyin": "Wǔ kuài qián.",
          "meaning": "5 đồng tệ."
        }
      },
      {
        "id": "v-115-4",
        "hanzi": "买",
        "pinyin": "mǎi",
        "hanviet": "Mãi",
        "meaning": "Mua",
        "radical": "乙 (Ất)",
        "example": {
          "hanzi": "我想买苹果。",
          "pinyin": "Wǒ xiǎng mǎi píngguǒ.",
          "meaning": "Tôi muốn mua táo."
        }
      },
      {
        "id": "v-115-5",
        "hanzi": "太",
        "pinyin": "tài",
        "hanviet": "Thái",
        "meaning": "Quá, lắm",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "太好了！",
          "pinyin": "Tài hǎo le!",
          "meaning": "Tốt quá rồi!"
        }
      },
      {
        "id": "v-115-6",
        "hanzi": "贵",
        "pinyin": "guì",
        "hanviet": "Quý",
        "meaning": "Đắt, quý",
        "radical": "贝 (Bối)",
        "example": {
          "hanzi": "太贵了！",
          "pinyin": "Tài guì le!",
          "meaning": "Đắt quá rồi!"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "钱",
        "pinyin": "qián",
        "meaning": "Tiền bạc",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Kim (钅) -> Hai nét ngang gập bên phải",
        "components": "钅 + 戋",
        "mnemonic": "Kim loại vàng bạc quý giá dùng làm tiền tệ trao đổi."
      },
      {
        "hanzi": "买",
        "pinyin": "mǎi",
        "meaning": "Mua",
        "strokesCount": 6,
        "strokeOrderText": "Ngang móc -> Chấm -> Phẩy -> Chấm ngang",
        "components": "Bộ Ất",
        "mnemonic": "Bỏ đầu óc và tiền của ra mua hàng hóa về."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc cảm thán cố định 太...了",
      "formula": "太 + Tính từ + 了！ (Ví dụ: 太贵了 / 太好了 / 太大了)",
      "explanation": "Phó từ 太 luôn đi kèm với trợ từ 了 ở cuối câu để biểu thị mức độ cực độ hoặc lời than thở/khen ngợi.",
      "examples": [
        {
          "hanzi": "这个苹果太贵了！",
          "pinyin": "Zhège píngguǒ tài guì le!",
          "meaning": "Quả táo này đắt quá rồi!"
        }
      ],
      "commonMistake": {
        "wrong": "Quên chữ 了: 太贵 ❌",
        "correct": "Phải nói: 太贵了！ ✔️",
        "explanation": "太...了 đi thành cặp cố định."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你好，这个多少钱？",
          "pinyin": "Nǐ hǎo, zhè ge duōshao qián?",
          "meaning": "Chào bác, cái này bao nhiêu tiền ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "二十五块钱。",
          "pinyin": "Èrshíwǔ kuài qián.",
          "meaning": "25 đồng tệ cháu ơi."
        }
      ],
      "audioText": "你好，这个多少钱？二十五块钱。",
      "question": "Món đồ có giá bao nhiêu tiền?",
      "options": [
        "15 tệ",
        "20 tệ",
        "25 tệ (èrshíwǔ kuài)",
        "50 tệ"
      ],
      "correctIndex": 2,
      "explanation": "25 tệ: 二十五块钱."
    },
    "step6_speaking": {
      "prompt": "Hỏi giá đồ vật:",
      "targetSentence": "这个多少钱？",
      "targetPinyin": "Zhè ge duōshao qián?",
      "targetMeaning": "Cái này bao nhiêu tiền?",
      "hint": "Đọc duōshao nhẹ nhàng thanh nhẹ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Cái này đắt quá rồi",
      "words": [
        "太贵了",
        "这个"
      ],
      "correctOrder": [
        "这个",
        "太贵了"
      ],
      "explanation": "这个 + 太贵了."
    },
    "step8_quiz": [
      {
        "id": "q-115-1",
        "type": "multiple-choice",
        "question": "Từ khẩu ngữ chỉ đồng tiền tệ Trung Quốc là:",
        "options": [
          "元 (yuán)",
          "块 (kuài)",
          "角 (jiǎo)",
          "分 (fēn)"
        ],
        "correctIndex": 1,
        "explanation": "Trong khẩu ngữ hàng ngày dùng 块 (kuài)."
      },
      {
        "id": "q-115-2",
        "type": "multiple-choice",
        "question": "Cụm '太好了！' mang ý nghĩa gì?",
        "options": [
          "Đắt quá",
          "Tuyệt vời / Tốt quá rồi",
          "Xấu quá",
          "Không tốt"
        ],
        "correctIndex": 1,
        "explanation": "Thái hảo liễu nghĩa là Tốt quá rồi."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 3",
      "taskDesc": "Vượt qua thử thách mua sắm để sẵn sàng khiêu chiến Boss!",
      "targetPhrase": "zhè ge duōshao qián tài guì le",
      "xpReward": 60,
      "badge": "Thánh Mặc Cả Sơ Cấp"
    }
  },

  {
    "id": "l-116",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 16,
    "title": "Đồ ăn thức uống quen thuộc & Động từ 吃, 喝",
    "chineseTitle": "饮食与动词“吃/喝”（你喜欢吃什么）",
    "subtitle": "Nói về sở thích ẩm thực (喜欢), các món ăn và đồ uống thường nhật bằng tiếng Trung.",
    "objective": "Diễn đạt được bạn thích ăn gì, uống gì và gọi được món ăn/nước uống cơ bản.",
    "prerequisite": "Đã hoàn thành Module 1.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu sở thích ăn uống.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Ẩm thực",
      "Động từ 吃",
      "Động từ 喝",
      "喜欢"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-2"
    ],
    "step1_learn": {
      "topic": "Hỏi sở thích: 你喜欢吃什么？ (Nǐ xǐhuan chī shénme?)",
      "summary": "喜欢 (xǐhuan) là thích. 吃 (chī) là ăn, 喝 (hē) là uống. Cấu trúc: Chủ ngữ + 喜欢 + 吃/喝 + Đồ ăn/Thức uống.",
      "audioDemoText": "nǐ xǐhuan chī shénme, wǒ xǐhuan chī mǐfàn, wǒ xǐhuan hē chá"
    },
    "step2_vocabulary": [
      {
        "id": "v-116-1",
        "hanzi": "喜欢",
        "pinyin": "xǐhuan",
        "hanviet": "Hỷ hoan",
        "meaning": "Thích",
        "radical": "士 (Sĩ)",
        "example": {
          "hanzi": "我喜欢中国菜。",
          "pinyin": "Wǒ xǐhuan Zhōngguó cài.",
          "meaning": "Tôi thích món ăn Trung Quốc."
        }
      },
      {
        "id": "v-116-2",
        "hanzi": "吃",
        "pinyin": "chī",
        "hanviet": "Cật",
        "meaning": "Ăn",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "你想吃什么？",
          "pinyin": "Nǐ xiǎng chī shénme?",
          "meaning": "Bạn muốn ăn gì?"
        }
      },
      {
        "id": "v-116-3",
        "hanzi": "喝",
        "pinyin": "hē",
        "hanviet": "Hát",
        "meaning": "Uống",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "请喝茶。",
          "pinyin": "Qǐng hē chá.",
          "meaning": "Mời uống trà."
        }
      },
      {
        "id": "v-116-4",
        "hanzi": "米饭",
        "pinyin": "mǐfàn",
        "hanviet": "Mễ phạn",
        "meaning": "Cơm",
        "radical": "米 (Mễ)",
        "example": {
          "hanzi": "我吃米饭。",
          "pinyin": "Wǒ chī mǐfàn.",
          "meaning": "Tôi ăn cơm."
        }
      },
      {
        "id": "v-116-5",
        "hanzi": "茶",
        "pinyin": "chá",
        "hanviet": "Trà",
        "meaning": "Trà, chè",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "中国茶很好喝。",
          "pinyin": "Zhōngguó chá hěn hǎohē.",
          "meaning": "Trà Trung Quốc rất ngon."
        }
      },
      {
        "id": "v-116-6",
        "hanzi": "菜",
        "pinyin": "cài",
        "hanviet": "Thái",
        "meaning": "Món ăn, rau",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "这个菜很好吃。",
          "pinyin": "Zhège cài hěn hǎochī.",
          "meaning": "Món này rất ngon."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "吃",
        "pinyin": "chī",
        "meaning": "Ăn",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Khẩu (口) -> Nét phẩy -> Nét ngang gập cong móc (乞)",
        "components": "口 + 乞",
        "mnemonic": "Cái miệng (口) mở ra đón nhận đồ ăn xin về."
      },
      {
        "hanzi": "茶",
        "pinyin": "chá",
        "meaning": "Trà",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thảo (艹) ở trên -> Nét bộ Nhân (人) -> Bộ Mộc (木) ở dưới",
        "components": "艹 + 人 + 木",
        "mnemonic": "Con người (人) hái lá cỏ (艹) từ trên cây gỗ (木) về nấu trà."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc biểu đạt sở thích: 喜欢 + Động từ / Danh từ",
      "formula": "Chủ ngữ + 喜欢 + Động từ (吃 / 喝) + Tân ngữ",
      "explanation": "Từ 喜欢 có thể đi trực tiếp với danh từ (喜欢茶) hoặc đi với cụm động tân (喜欢喝茶). Phủ định là 不喜欢.",
      "examples": [
        {
          "hanzi": "我不喜欢喝咖啡，我喜欢喝茶。",
          "pinyin": "Wǒ bù xǐhuan hē kāfēi, wǒ xǐhuan hē chá.",
          "meaning": "Tôi không thích uống cà phê, tôi thích uống trà."
        }
      ],
      "commonMistake": {
        "wrong": "我没喜欢茶 ❌",
        "correct": "我不喜欢茶 ✔️",
        "explanation": "Phủ định tâm lý tình cảm dùng 不 (không dùng 没)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "中午你想吃什么？",
          "pinyin": "Zhōngwǔ nǐ xiǎng chī shénme?",
          "meaning": "Buổi trưa bạn muốn ăn gì?"
        },
        {
          "speaker": "B",
          "hanzi": "我想吃米饭和中国菜。",
          "pinyin": "Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.",
          "meaning": "Tôi muốn ăn cơm và món ăn Trung Quốc."
        }
      ],
      "audioText": "中午你想吃什么？我想吃米饭和中国菜。",
      "question": "Người B muốn ăn món gì buổi trưa?",
      "options": [
        "Bánh bao",
        "Cơm và món Trung Quốc (mǐfàn hé Zhōngguó cài)",
        "Trái cây",
        "Mì sợi"
      ],
      "correctIndex": 1,
      "explanation": "Người B nói rõ: 米饭和中国菜."
    },
    "step6_speaking": {
      "prompt": "Nói câu bạn thích uống trà:",
      "targetSentence": "我喜欢喝茶。",
      "targetPinyin": "Wǒ xǐhuan hē chá.",
      "targetMeaning": "Tôi thích uống trà.",
      "hint": "Đọc xǐhuan nhẹ nhàng, chá thanh 2."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi thích ăn cơm",
      "words": [
        "吃米饭",
        "喜欢",
        "我"
      ],
      "correctOrder": [
        "我",
        "喜欢",
        "吃米饭"
      ],
      "explanation": "我 + 喜欢 + 吃米饭."
    },
    "step8_quiz": [
      {
        "id": "q-116-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Uống'?",
        "options": [
          "吃 (chī)",
          "喝 (hē)",
          "买 (mǎi)",
          "看 (kàn)"
        ],
        "correctIndex": 1,
        "explanation": "喝 (hē) là uống."
      },
      {
        "id": "q-116-2",
        "type": "multiple-choice",
        "question": "Phủ định của 'Tôi thích ăn cơm' là:",
        "options": [
          "我没喜欢吃米饭",
          "我不喜欢吃米饭",
          "我喜欢不吃米饭",
          "我不吃米饭喜欢"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định sở thích dùng 不: 我不喜欢吃米饭."
      }
    ],
    "step9_challenge": {
      "title": "Gọi món tại quán ăn",
      "taskDesc": "Đọc to câu gọi 1 món ăn và 1 loại đồ uống mà bạn thích.",
      "targetPhrase": "wǒ xǐhuan chī mǐfàn hē chá",
      "xpReward": 50,
      "badge": "Tín Đồ Ẩm Thực"
    }
  },

  {
    "id": "l-117",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 17,
    "title": "Khả năng & Nguyện vọng với 会, 想",
    "chineseTitle": "能愿动词“会”与“想”（我会说汉语）",
    "subtitle": "Phân biệt năng nguyện động từ 会 (biết qua học tập rèn luyện) và 想 (mong muốn/dự định).",
    "objective": "Nói được bạn biết làm gì (会) và mong muốn làm gì (想) bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành Bài 116.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác 会 và 想.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Năng nguyện động từ",
      "会",
      "想",
      "Ngoại ngữ"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Năng nguyện động từ: 会 (huì - Biết) & 想 (xiǎng - Muốn)",
      "summary": "会 chỉ kỹ năng có được qua học tập (我会说汉语, 我会写汉字). 想 chỉ nguyện vọng/mong muốn (我想去北京). Phủ định là 不会 và 不想.",
      "audioDemoText": "wǒ huì shuō hànyǔ, wǒ huì xiě hànzì, wǒ xiǎng qù běijīng"
    },
    "step2_vocabulary": [
      {
        "id": "v-117-1",
        "hanzi": "会",
        "pinyin": "huì",
        "hanviet": "Hội",
        "meaning": "Biết (qua học tập)",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "你会说汉语吗？",
          "pinyin": "Nǐ huì shuō Hànyǔ ma?",
          "meaning": "Bạn biết nói tiếng Trung không?"
        }
      },
      {
        "id": "v-117-2",
        "hanzi": "想",
        "pinyin": "xiǎng",
        "hanviet": "Tưởng",
        "meaning": "Muốn, nhớ, nghĩ",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "我想学汉语。",
          "pinyin": "Wǒ xiǎng xué Hànyǔ.",
          "meaning": "Tôi muốn học tiếng Trung."
        }
      },
      {
        "id": "v-117-3",
        "hanzi": "说",
        "pinyin": "shuō",
        "hanviet": "Thuyết",
        "meaning": "Nói",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "他说得很好。",
          "pinyin": "Tā shuō de hěn hǎo.",
          "meaning": "Anh ấy nói rất tốt."
        }
      },
      {
        "id": "v-117-4",
        "hanzi": "写",
        "pinyin": "xiě",
        "hanviet": "Tả",
        "meaning": "Viết",
        "radical": "冖 (Mịch)",
        "example": {
          "hanzi": "写汉字。",
          "pinyin": "Xiě hànzì.",
          "meaning": "Viết chữ Hán."
        }
      },
      {
        "id": "v-117-5",
        "hanzi": "汉字",
        "pinyin": "hànzì",
        "hanviet": "Hán tự",
        "meaning": "Chữ Hán",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "汉字很有意思。",
          "pinyin": "Hànzì hěn yǒu yìsi.",
          "meaning": "Chữ Hán rất thú vị."
        }
      },
      {
        "id": "v-117-6",
        "hanzi": "做",
        "pinyin": "zuò",
        "hanviet": "Tác",
        "meaning": "Làm",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "做中国菜。",
          "pinyin": "Zuò Zhōngguó cài.",
          "meaning": "Nấu món Trung Quốc."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "会",
        "pinyin": "huì",
        "meaning": "Biết, gặp gỡ",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Nhân (人) ở trên -> Bộ Vân (云) ở dưới",
        "components": "人 + 云",
        "mnemonic": "Con người hội tụ dưới mây trời trao đổi tri thức và kỹ năng."
      },
      {
        "hanzi": "想",
        "pinyin": "xiǎng",
        "meaning": "Muốn, nghĩ tưởng",
        "strokesCount": 13,
        "strokeOrderText": "Chữ Tướng (相) ở trên -> Bộ Tâm (心) ở dưới",
        "components": "相 + 心",
        "mnemonic": "Để hình ảnh sự vật trong trái tim chính là sự suy nghĩ mong muốn."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của năng nguyện động từ 会 và 想",
      "formula": "Chủ ngữ + 会 / 想 + Động từ chính + Tân ngữ",
      "explanation": "Động từ năng nguyện luôn đứng trước động từ chính trong câu. Phủ định đặt 不 trước động từ năng nguyện (不会 / 不想).",
      "examples": [
        {
          "hanzi": "我会写这个汉字。",
          "pinyin": "Wǒ huì xiě zhège hànzì.",
          "meaning": "Tôi biết viết chữ Hán này."
        }
      ],
      "commonMistake": {
        "wrong": "我写会汉字 ❌",
        "correct": "我会写汉字 ✔️",
        "explanation": "会 đứng trước động từ chính 写."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你会说汉语吗？",
          "pinyin": "Nǐ huì shuō Hànyǔ ma?",
          "meaning": "Bạn biết nói tiếng Trung không?"
        },
        {
          "speaker": "B",
          "hanzi": "我会说一点儿汉语，我还会写汉字。",
          "pinyin": "Wǒ huì shuō yìdiǎnr Hànyǔ, wǒ hái huì xiě hànzì.",
          "meaning": "Tôi biết nói một chút tiếng Trung, tôi còn biết viết chữ Hán nữa."
        }
      ],
      "audioText": "你会说汉语吗？我会说一点儿汉语，我还会写汉字。",
      "question": "Người B có những kỹ năng nào?",
      "options": [
        "Chỉ biết nghe",
        "Biết nói một chút và biết viết chữ Hán",
        "Không biết tiếng Trung",
        "Chỉ biết đọc sách"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 会说一点儿... 会写汉字."
    },
    "step6_speaking": {
      "prompt": "Khẳng định khả năng nói tiếng Trung của bạn:",
      "targetSentence": "我会说汉语。",
      "targetPinyin": "Wǒ huì shuō Hànyǔ.",
      "targetMeaning": "Tôi biết nói tiếng Trung.",
      "hint": "Đọc shuō uốn lưỡi sh, Hànyǔ thanh 4 và 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi muốn đi Bắc Kinh",
      "words": [
        "去北京",
        "想",
        "我"
      ],
      "correctOrder": [
        "我",
        "想",
        "去北京"
      ],
      "explanation": "我 + 想 + 去北京."
    },
    "step8_quiz": [
      {
        "id": "q-117-1",
        "type": "multiple-choice",
        "question": "Để diễn tả 'kỹ năng biết làm gì qua học tập rèn luyện', ta dùng từ:",
        "options": [
          "想 (xiǎng)",
          "会 (huì)",
          "去 (qù)",
          "在 (zài)"
        ],
        "correctIndex": 1,
        "explanation": "Từ 会 biểu thị kỹ năng do học tập có được."
      },
      {
        "id": "q-117-2",
        "type": "multiple-choice",
        "question": "Chọn câu phủ định đúng:",
        "options": [
          "我不想去学校",
          "我没想去学校",
          "我去不想学校",
          "我不想学校去"
        ],
        "correctIndex": 0,
        "explanation": "Phủ định của 想 là 不想."
      }
    ],
    "step9_challenge": {
      "title": "Tự tin tuyên bố năng lực",
      "taskDesc": "Đọc to câu: 'Tôi biết nói tiếng Trung và tôi muốn đi du lịch Trung Quốc'.",
      "targetPhrase": "wǒ huì shuō hànyǔ wǒ xiǎng qù zhōngguó",
      "xpReward": 50,
      "badge": "Tự Tin Hội Nhập"
    }
  },

  {
    "id": "l-118",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 18,
    "title": "Giải trí & Thời tiết sơ cấp (看书, 看电影, 冷, 热)",
    "chineseTitle": "休闲与初级天气表达（天气怎么样）",
    "subtitle": "Hỏi và nhận xét thời tiết với 怎么样 (zěnmeyàng), 冷 (lạnh), 热 (nóng) và các hoạt động giải trí.",
    "objective": "Hỏi thăm thời tiết, miêu tả nóng/lạnh/mưa và nói về sở thích xem phim, đọc sách.",
    "prerequisite": "Đã hoàn thành Bài 117.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và miêu tả được thời tiết hôm nay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 1",
      "Thời tiết",
      "怎么样",
      "Giải trí",
      "Xem phim"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hỏi thời tiết: 今天天气怎么样？ (Jīntiān tiānqì zěnmeyàng?)",
      "summary": "天气 (tiānqì) là thời tiết. 怎么样 (zěnmeyàng) dùng để hỏi tính chất/tình hình như thế nào. 冷 (lěng) là lạnh, 热 (rè) là nóng, 下雨 (xiàyǔ) là trời mưa.",
      "audioDemoText": "jīntiān tiānqì zěnmeyàng, jīntiān tiānqì hěn hǎo, bù lěng yě bú rè"
    },
    "step2_vocabulary": [
      {
        "id": "v-118-1",
        "hanzi": "天气",
        "pinyin": "tiānqì",
        "hanviet": "Thiên khí",
        "meaning": "Thời tiết",
        "radical": "气 (Khí)",
        "example": {
          "hanzi": "今天天气很好。",
          "pinyin": "Jīntiān tiānqì hěn hǎo.",
          "meaning": "Hôm nay thời tiết rất đẹp."
        }
      },
      {
        "id": "v-118-2",
        "hanzi": "怎么样",
        "pinyin": "zěnmeyàng",
        "hanviet": "Chẩm ma dạng",
        "meaning": "Như thế nào",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "你觉得怎么样？",
          "pinyin": "Nǐ juéde zěnmeyàng?",
          "meaning": "Bạn thấy thế nào?"
        }
      },
      {
        "id": "v-118-3",
        "hanzi": "冷",
        "pinyin": "lěng",
        "hanviet": "Lãnh",
        "meaning": "Lạnh",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "太冷了！",
          "pinyin": "Tài lěng le!",
          "meaning": "Lạnh quá rồi!"
        }
      },
      {
        "id": "v-118-4",
        "hanzi": "热",
        "pinyin": "rè",
        "hanviet": "Nhiệt",
        "meaning": "Nóng",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "今天很热。",
          "pinyin": "Jīntiān hěn rè.",
          "meaning": "Hôm nay rất nóng."
        }
      },
      {
        "id": "v-118-5",
        "hanzi": "下雨",
        "pinyin": "xià yǔ",
        "hanviet": "Hạ vũ",
        "meaning": "Trời mưa",
        "radical": "雨 (Vũ)",
        "example": {
          "hanzi": "明天会下雨。",
          "pinyin": "Míngtiān huì xià yǔ.",
          "meaning": "Ngày mai trời sẽ mưa."
        }
      },
      {
        "id": "v-118-6",
        "hanzi": "看电影",
        "pinyin": "kàn diànyǐng",
        "hanviet": "Khán điện ảnh",
        "meaning": "Xem phim",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "周末看电影。",
          "pinyin": "Zhōumò kàn diànyǐng.",
          "meaning": "Cuối tuần đi xem phim."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "冷",
        "pinyin": "lěng",
        "meaning": "Lạnh lẽo",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Băng (冫) bên trái -> Chữ Lệnh (令) bên phải",
        "components": "冫 + 令",
        "mnemonic": "Hai giọt nước đóng băng (冫) mang lại cảm giác lạnh giá."
      },
      {
        "hanzi": "雨",
        "pinyin": "yǔ",
        "meaning": "Mưa",
        "strokesCount": 8,
        "strokeOrderText": "Ngang -> Sổ -> Ngang gập móc -> Sổ giữa -> Bốn chấm mưa",
        "components": "Bộ Vũ (雨)",
        "mnemonic": "Bầu trời giăng mây và 4 giọt nước mưa rơi xuống."
      }
    ],
    "step4_grammar": {
      "title": "Hỏi ý kiến hoặc tình trạng với 怎么样",
      "formula": "Chủ ngữ (Người / Sự vật / Thời tiết) + 怎么样？",
      "explanation": "Từ 怎么样 đứng ở cuối câu để hỏi về tính chất, ý kiến hoặc thời tiết.",
      "examples": [
        {
          "hanzi": "北京的天气怎么样？",
          "pinyin": "Běijīng de tiānqì zěnmeyàng?",
          "meaning": "Thời tiết ở Bắc Kinh như thế nào?"
        }
      ],
      "commonMistake": {
        "wrong": "怎么样天气 ❌",
        "correct": "天气怎么样 ✔️",
        "explanation": "怎么样 luôn đứng sau chủ ngữ được hỏi."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "明天天气怎么样？",
          "pinyin": "Míngtiān tiānqì zěnmeyàng?",
          "meaning": "Ngày mai thời tiết thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "明天不下雨，不冷也不热，很舒服。",
          "pinyin": "Míngtiān bú xià yǔ, bù lěng yě bú rè, hěn shūfu.",
          "meaning": "Ngày mai không mưa, không lạnh cũng không nóng, rất dễ chịu."
        }
      ],
      "audioText": "明天天气怎么样？明天不下雨，不冷也不热。",
      "question": "Thời tiết ngày mai ra sao?",
      "options": [
        "Rất lạnh và có tuyết",
        "Mưa rất to",
        "Không mưa, không lạnh cũng không nóng",
        "Rất nóng bức"
      ],
      "correctIndex": 2,
      "explanation": "B nói: 不下雨，不冷也不热."
    },
    "step6_speaking": {
      "prompt": "Nhận xét thời tiết hôm nay rất đẹp:",
      "targetSentence": "今天天气很好。",
      "targetPinyin": "Jīntiān tiānqì hěn hǎo.",
      "targetMeaning": "Hôm nay thời tiết rất đẹp.",
      "hint": "Đọc tiānqì thanh 1 và 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Thời tiết hôm nay như thế nào?",
      "words": [
        "怎么样",
        "今天",
        "天气"
      ],
      "correctOrder": [
        "今天",
        "天气",
        "怎么样"
      ],
      "explanation": "今天 + 天气 + 怎么样."
    },
    "step8_quiz": [
      {
        "id": "q-118-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Trời mưa'?",
        "options": [
          "下雪 (xià xuě)",
          "下雨 (xià yǔ)",
          "刮风 (guā fēng)",
          "晴天 (qíngtiān)"
        ],
        "correctIndex": 1,
        "explanation": "下雨 (xià yǔ) là trời mưa."
      },
      {
        "id": "q-118-2",
        "type": "multiple-choice",
        "question": "Cụm '不冷也不热' mang nghĩa:",
        "options": [
          "Vừa lạnh vừa nóng",
          "Không lạnh cũng không nóng",
          "Rất lạnh",
          "Rất nóng"
        ],
        "correctIndex": 1,
        "explanation": "Không lạnh cũng không nóng, thời tiết ôn hòa."
      }
    ],
    "step9_challenge": {
      "title": "Bản tin thời tiết bỏ túi",
      "taskDesc": "Đọc to bản tin dự báo thời tiết 2 câu miêu tả hôm nay nắng hay mưa, nóng hay lạnh.",
      "targetPhrase": "jīntiān tiānqì hěn hǎo bù lěng yě bú rè",
      "xpReward": 50,
      "badge": "Khí Tượng Viên Nhí"
    }
  },

  {
    "id": "l-119",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện ngữ pháp & 150 từ vựng HSK 1",
    "chineseTitle": "HSK 1全真语法体系与150词总复习",
    "subtitle": "Hệ thống hóa toàn bộ ngữ pháp HSK 1: Trợ từ 的, 吗, 呢, 了; trật tự từ SVO và đòn bẩy Hán - Việt.",
    "objective": "Tổng kết vững chắc 150 từ vựng cốt lõi và 48 cấu trúc ngữ pháp trước kỳ thi Checkpoint Test.",
    "prerequisite": "Đã hoàn thành Bài 101–118.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm tổng hợp toàn bộ Level 1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 1",
      "Tổng ôn tập",
      "Ngữ pháp tổng hợp",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-4",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Hệ thống 4 trợ từ kinh điển HSK 1: 的 (sở hữu), 吗 (hỏi có/không), 呢 (còn...thì sao), 了 (đã/rồi)",
      "summary": "1. 的 biểu thị sở hữu (我的书). 2. 吗 biến câu kể thành câu hỏi nghi vấn (你好吗). 3. 呢 hỏi tiếp hoặc rút gọn (你呢). 4. 了 biểu thị sự thay đổi trạng thái hoặc hành động đã xảy ra (太贵了 / 我买了).",
      "audioDemoText": "wǒ de shū, nǐ hǎo ma, wǒ hěn hǎo nǐ ne, tài guì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-119-1",
        "hanzi": "都",
        "pinyin": "dōu",
        "hanviet": "Đô",
        "meaning": "Đều",
        "radical": "阝 (Ấp)",
        "example": {
          "hanzi": "我们都是学生。",
          "pinyin": "Wǒmen dōu shì xuésheng.",
          "meaning": "Chúng tôi đều là học sinh."
        }
      },
      {
        "id": "v-119-2",
        "hanzi": "很",
        "pinyin": "hěn",
        "hanviet": "Khẩn",
        "meaning": "Rất",
        "radical": "彳 (Xích)",
        "example": {
          "hanzi": "汉语很好听。",
          "pinyin": "Hànyǔ hěn hǎotīng.",
          "meaning": "Tiếng Trung rất hay."
        }
      },
      {
        "id": "v-119-3",
        "hanzi": "真",
        "pinyin": "zhēn",
        "hanviet": "Chân",
        "meaning": "Thật, thực sự",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "真漂亮！",
          "pinyin": "Zhēn piàoliang!",
          "meaning": "Thật là đẹp!"
        }
      },
      {
        "id": "v-119-4",
        "hanzi": "一点儿",
        "pinyin": "yìdiǎnr",
        "hanviet": "Nhất điểm nhi",
        "meaning": "Một chút, một ít",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "我会说一点儿。",
          "pinyin": "Wǒ huì shuō yìdiǎnr.",
          "meaning": "Tôi biết nói một chút."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "都",
        "pinyin": "dōu",
        "meaning": "Đều, tất cả",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Giả (者) bên trái -> Bộ Ấp (阝) bên phải",
        "components": "者 + 阝",
        "mnemonic": "Mọi người dân trong thành thị đều bình đẳng như nhau."
      },
      {
        "hanzi": "真",
        "pinyin": "zhēn",
        "meaning": "Thật, chân thật",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Thập (十) -> Khung Mục (目) với 3 nét ngang -> Hai nét phẩy chấm dưới",
        "components": "十 + 目",
        "mnemonic": "Đôi mắt nhìn thấy mười phần sự thật rõ ràng."
      }
    ],
    "step4_grammar": {
      "title": "Bảng tổng kết 3 quy tắc trật tự từ tiếng Trung tối quan trọng",
      "formula": "1. Ai làm gì ở đâu: S + 在 + Địa điểm + V. 2. Thời gian trước hành động: S + Time + V. 3. Định ngữ trước trung tâm ngữ: Tính từ/Định ngữ + 的 + Danh từ.",
      "explanation": "Nắm vững 3 quy tắc vàng này là bạn đã giải quyết được 90% lỗi sai cú pháp khi làm bài thi HSK 1.",
      "examples": [
        {
          "hanzi": "我今天在学校买了一本书。",
          "pinyin": "Wǒ jīntiān zài xuéxiào mǎi le yì běn shū.",
          "meaning": "Hôm nay tôi đã mua một quyển sách ở trường."
        }
      ],
      "commonMistake": {
        "wrong": "我买一本书在学校今天 ❌",
        "correct": "我今天在学校买了一本书 ✔️",
        "explanation": "Thời gian và địa điểm luôn đứng trước hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你们都是越南留学生吗？",
          "pinyin": "Nǐmen dōu shì Yuènán liúxuéshēng ma?",
          "meaning": "Các bạn đều là du học sinh Việt Nam à?"
        },
        {
          "speaker": "B",
          "hanzi": "对，我们都在北京大学学汉语。",
          "pinyin": "Duì, wǒmen dōu zài Běijīng Dàxué xué Hànyǔ.",
          "meaning": "Đúng vậy, chúng tôi đều học tiếng Trung tại Đại học Bắc Kinh."
        }
      ],
      "audioText": "你们都是越南留学生吗？对，我们都在北京大学学汉语。",
      "question": "Những người này đang làm gì ở đâu?",
      "options": [
        "Đang du lịch Thượng Hải",
        "Đang học tiếng Trung tại Đại học Bắc Kinh",
        "Đang đi làm ở công ty",
        "Đang đi mua sắm"
      ],
      "correctIndex": 1,
      "explanation": "都在北京大学学汉语."
    },
    "step6_speaking": {
      "prompt": "Đọc câu tổng hợp toàn diện:",
      "targetSentence": "我们都在学校学汉语。",
      "targetPinyin": "Wǒmen dōu zài xuéxiào xué Hànyǔ.",
      "targetMeaning": "Chúng tôi đều học tiếng Trung ở trường.",
      "hint": "Đọc mượt mà dōu zài xuéxiào."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chúng tôi đều là bạn tốt",
      "words": [
        "好朋友",
        "我们",
        "都是"
      ],
      "correctOrder": [
        "我们",
        "都是",
        "好朋友"
      ],
      "explanation": "我们 + 都是 + 好朋友."
    },
    "step8_quiz": [
      {
        "id": "q-119-1",
        "type": "multiple-choice",
        "question": "Trong câu '这是 ___ 汉语书', điền từ sở hữu nào phù hợp nhất?",
        "options": [
          "我",
          "我的",
          "我很",
          "我都"
        ],
        "correctIndex": 1,
        "explanation": "Biểu thị sở hữu dùng 我的 (của tôi)."
      },
      {
        "id": "q-119-2",
        "type": "multiple-choice",
        "question": "Phó từ '都' (dōu - Đều) luôn đứng ở vị trí nào trong câu?",
        "options": [
          "Đầu câu trước chủ ngữ",
          "Sau chủ ngữ, trước động từ/tính từ",
          "Cuối câu",
          "Sau tân ngữ"
        ],
        "correctIndex": 1,
        "explanation": "都 đứng sau chủ ngữ số nhiều và trước động từ: 我们都去."
      }
    ],
    "step9_challenge": {
      "title": "Sẵn sàng thi Checkpoint HSK 1",
      "taskDesc": "Vượt qua thử thách phản xạ để mở khóa bài thi chuẩn hóa Level 1!",
      "targetPhrase": "wǒmen dōu zài xuéxiào xué hànyǔ",
      "xpReward": 60,
      "badge": "Chiến Binh Sẵn Sàng"
    }
  },

  {
    "id": "l-120",
    "chapterId": "ch-4",
    "levelId": "lvl-1",
    "lessonNumber": 20,
    "title": "Checkpoint Test HSK 1 (Thi thử mô phỏng chuẩn CTI)",
    "chineseTitle": "HSK 1级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện 100% cấu trúc khảo thí quốc tế CTI: Nghe hiểu, Đọc hiểu và Viết câu.",
    "objective": "Đạt chuẩn đầu ra Level 1 (HSK 1): Nắm vững 150 từ vựng và tự tin vượt qua đề thi chứng chỉ.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 101–119.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Huy hiệu Tốt nghiệp HSK 1.",
    "durationMinutes": 30,
    "xpReward": 100,
    "tags": [
      "HSK 1",
      "Thi thử CTI",
      "Checkpoint Test",
      "Tốt nghiệp Level 1"
    ],
    "relatedMaterialIds": [
      "mat-1",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Chiến thuật làm bài thi HSK 1 chuẩn quốc tế CTI",
      "summary": "Đề thi HSK 1 gồm 2 phần lớn: 1. Phần Nghe (20 câu, có tranh minh họa và audio đọc 2 lần). 2. Phần Đọc hiểu (20 câu, nối từ với hình ảnh, chọn đúng sai). Tất cả đều có Pinyin hỗ trợ.",
      "audioDemoText": "hsk yī jí kǎoshì xiànzài kāishǐ, qǐng tīng dì yī tí"
    },
    "step2_vocabulary": [
      {
        "id": "v-120-1",
        "hanzi": "考试",
        "pinyin": "kǎoshì",
        "hanviet": "Khảo thí",
        "meaning": "Thi cử, kiểm tra",
        "radical": "耂 (Lão)",
        "example": {
          "hanzi": "今天的考试不难。",
          "pinyin": "Jīntiān de kǎoshì bù nán.",
          "meaning": "Bài thi hôm nay không khó."
        }
      },
      {
        "id": "v-120-2",
        "hanzi": "准备",
        "pinyin": "zhǔnbèi",
        "hanviet": "Chuẩn bị",
        "meaning": "Chuẩn bị",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "你准备好了吗？",
          "pinyin": "Nǐ zhǔnbèi hǎo le ma?",
          "meaning": "Bạn đã chuẩn bị xong chưa?"
        }
      },
      {
        "id": "v-120-3",
        "hanzi": "问题",
        "pinyin": "wèntí",
        "hanviet": "Vấn đề",
        "meaning": "Câu hỏi, vấn đề",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "没问题！",
          "pinyin": "Méi wèntí!",
          "meaning": "Không vấn đề gì cả!"
        }
      },
      {
        "id": "v-120-4",
        "hanzi": "开始",
        "pinyin": "kāishǐ",
        "hanviet": "Khai thủy",
        "meaning": "Bắt đầu",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "现在开始。",
          "pinyin": "Xiànzài kāishǐ.",
          "meaning": "Bây giờ bắt đầu."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "考",
        "pinyin": "kǎo",
        "meaning": "Khảo thí, thi",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Sổ -> Ngang -> Phẩy -> Nét gập móc",
        "components": "Bộ Lão (耂)",
        "mnemonic": "Các vị khảo quan lớn tuổi (Lão) ngồi chấm thi."
      },
      {
        "hanzi": "试",
        "pinyin": "shì",
        "meaning": "Thử nghiệm, bài thi",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Bộ Thức (式) bên phải",
        "components": "讠 + 式",
        "mnemonic": "Dùng lời nói (Ngôn) diễn đạt theo đúng quy thức (Thức) bài thi."
      }
    ],
    "step4_grammar": {
      "title": "Mẹo tránh bẫy nghe và đọc đề thi HSK 1",
      "formula": "1. Nghe từ khóa (Số lượng, Thời gian, Đại từ). 2. Phân tích tranh trước khi audio phát.",
      "explanation": "Trong bài thi nghe, audio luôn có khoảng dừng 10 giây trước mỗi câu. Hãy tận dụng thời gian này nhìn nhanh vào các bức tranh để dự đoán từ vựng liên quan.",
      "examples": [
        {
          "hanzi": "没问题，我已经准备好了！",
          "pinyin": "Méi wèntí, wǒ yǐjīng zhǔnbèi hǎo le!",
          "meaning": "Không vấn đề gì, tôi đã chuẩn bị sẵn sàng rồi!"
        }
      ],
      "commonMistake": {
        "wrong": "Đợi nghe xong mới đọc câu hỏi dẫn đến bị cuống.",
        "correct": "Đọc lướt câu hỏi trước khi nghe audio.",
        "explanation": "Chiến thuật làm bài khảo thí chuẩn mực."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khảo quan",
          "hanzi": "你好！请问你叫什么名字？你是哪国人？",
          "pinyin": "Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi? Nǐ shì nǎ guó rén?",
          "meaning": "Xin chào! Xin hỏi em tên gì? Em là người nước nào?"
        },
        {
          "speaker": "Thí sinh",
          "hanzi": "老师您好！我叫阮明，我是越南人，今天我来参加HSK 1级考试。",
          "pinyin": "Lǎoshī nín hǎo! Wǒ jiào Ruǎn Míng, wǒ shì Yuènán rén, jīntiān wǒ lái cānjiā HSK yī jí kǎoshì.",
          "meaning": "Em chào thầy ạ! Em tên Nguyễn Minh, em là người Việt Nam, hôm nay em đến tham gia kỳ thi HSK 1."
        }
      ],
      "audioText": "我叫阮明，我是越南人，今天我来参加HSK 1级考试。",
      "question": "Thí sinh Nguyễn Minh đến đây để làm gì?",
      "options": [
        "Đi du lịch",
        "Tham gia kỳ thi HSK 1 (cānjiā HSK yī jí kǎoshì)",
        "Đi mua sách",
        "Đi ăn cơm"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 来参加HSK 1级考试."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn đã sẵn sàng vượt qua kỳ thi:",
      "targetSentence": "没问题，我准备好了！",
      "targetPinyin": "Méi wèntí, wǒ zhǔnbèi hǎo le!",
      "targetMeaning": "Không vấn đề gì, tôi đã chuẩn bị xong rồi!",
      "hint": "Đọc méi wèntí dứt khoát và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Kỳ thi tiếng Trung bắt đầu rồi",
      "words": [
        "开始了",
        "汉语考试"
      ],
      "correctOrder": [
        "汉语考试",
        "开始了"
      ],
      "explanation": "汉语考试 + 开始了."
    },
    "step8_quiz": [
      {
        "id": "q-120-1",
        "type": "multiple-choice",
        "question": "Chúc mừng bạn đến với câu hỏi tốt nghiệp HSK 1: Câu nào sau đây hoàn toàn đúng chuẩn ngữ pháp tiếng Trung?",
        "options": [
          "我今天下午在学校学汉语",
          "我学汉语在学校今天下午",
          "今天下午我学汉语在学校",
          "在学校我学汉语今天下午"
        ],
        "correctIndex": 0,
        "explanation": "Trật tự vàng: Chủ ngữ (我) + Thời gian (今天下午) + Địa điểm (在学校) + Động từ tân ngữ (学汉语)."
      },
      {
        "id": "q-120-2",
        "type": "multiple-choice",
        "question": "Số lượng từ vựng cốt lõi mà người học làm chủ sau khi hoàn thành Level 1 là:",
        "options": [
          "50 từ",
          "100 từ",
          "150 từ vựng cốt lõi",
          "1000 từ"
        ],
        "correctIndex": 2,
        "explanation": "HSK 1 trang bị chuẩn 150 từ vựng quốc tế và hệ thống ngữ âm nền móng."
      }
    ],
    "step9_challenge": {
      "title": "Vinh danh Tốt nghiệp HSK 1",
      "taskDesc": "Đọc to câu tuyên bố hoàn thành Level 1 và mở khóa Boss Đấu trường Sanlitun!",
      "targetPhrase": "wǒ zhǔnbèi hǎo le hsk yī jí tōngguān",
      "xpReward": 100,
      "badge": "Tốt Nghiệp HSK 1 Xuất Sắc"
    }
  },

  {
    "id": "l-201",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 1,
    "title": "Giờ giấc chi tiết, thói quen thức dậy & đi ngủ",
    "chineseTitle": "精确时间点与作息（起床与睡觉）",
    "subtitle": "Diễn đạt giờ kém (差 - chà), 15 phút (刻 - kè) và thói quen sinh hoạt thường nhật.",
    "objective": "Nói chính xác giờ kém, giờ khắc và miêu tả thời gian biểu một ngày của bạn.",
    "prerequisite": "Đã hoàn thành Level 1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng lịch thức dậy, đi ngủ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Giờ giấc chi tiết",
      "Lịch sinh hoạt",
      "起床",
      "睡觉"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Giờ kém và khắc: 差 (chà - kém) & 刻 (kè - 15 phút)",
      "summary": "Trong tiếng Trung, 15 phút là 一刻 (yí kè), 45 phút là 三刻 (sān kè). Giờ kém: 差 + Phút + 点 (差五分八点 - 8 giờ kém 5).",
      "audioDemoText": "chà wǔ fēn bā diǎn, qī diǎn yí kè, wǒ měitiān zǎoshang qī diǎn qǐchuáng"
    },
    "step2_vocabulary": [
      {
        "id": "v-201-1",
        "hanzi": "起床",
        "pinyin": "qǐchuáng",
        "hanviet": "Khởi sàng",
        "meaning": "Thức dậy, rời giường",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "我早上六点起床。",
          "pinyin": "Wǒ zǎoshang liù diǎn qǐchuáng.",
          "meaning": "Tôi thức dậy lúc 6 giờ sáng."
        }
      },
      {
        "id": "v-201-2",
        "hanzi": "睡觉",
        "pinyin": "shuìjiào",
        "hanviet": "Thụy giác",
        "meaning": "Đi ngủ",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "晚上十一点睡觉。",
          "pinyin": "Wǎnshang shíyī diǎn shuìjiào.",
          "meaning": "11 giờ đêm đi ngủ."
        }
      },
      {
        "id": "v-201-3",
        "hanzi": "差",
        "pinyin": "chà",
        "hanviet": "Sai",
        "meaning": "Kém, thiếu",
        "radical": "工 (Công)",
        "example": {
          "hanzi": "差五分九点。",
          "pinyin": "Chà wǔ fēn jiǔ diǎn.",
          "meaning": "9 giờ kém 5 phút."
        }
      },
      {
        "id": "v-201-4",
        "hanzi": "刻",
        "pinyin": "kè",
        "hanviet": "Khắc",
        "meaning": "15 phút, khắc",
        "radical": "刂 (Đao)",
        "example": {
          "hanzi": "七点一刻。",
          "pinyin": "Qī diǎn yí kè.",
          "meaning": "7 giờ 15 phút."
        }
      },
      {
        "id": "v-201-5",
        "hanzi": "每天",
        "pinyin": "měitiān",
        "hanviet": "Mỗi thiên",
        "meaning": "Mỗi ngày, hàng ngày",
        "radical": "人 (Nhân)",
        "example": {
          "hanzi": "我每天跑步。",
          "pinyin": "Wǒ měitiān pǎobù.",
          "meaning": "Mỗi ngày tôi đều chạy bộ."
        }
      },
      {
        "id": "v-201-6",
        "hanzi": "早饭",
        "pinyin": "zǎofàn",
        "hanviet": "Tảo phạn",
        "meaning": "Bữa sáng",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "吃了早饭。",
          "pinyin": "Chī le zǎofàn.",
          "meaning": "Ăn bữa sáng rồi."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "床",
        "pinyin": "chuáng",
        "meaning": "Giường ngủ",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Quảng (广) ở ngoài -> Bộ Mộc (木) ở trong",
        "components": "广 + 木",
        "mnemonic": "Chiếc giường bằng gỗ (Mộc) đặt trong căn nhà (Quảng)."
      },
      {
        "hanzi": "睡",
        "pinyin": "shuì",
        "meaning": "Ngủ",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Mục (目) bên trái -> Chữ Thùy (垂) bên phải",
        "components": "目 + 垂",
        "mnemonic": "Đôi mắt (目) rủ mí xuống (垂) chính là chìm vào giấc ngủ."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc nói giờ kém trong tiếng Trung: 差 + Phút + 点",
      "formula": "差 + Số phút + 分 + Số giờ + 点",
      "explanation": "Từ 差 đặt ở đầu để chỉ số phút còn thiếu trước khi chạm tới giờ tròn.",
      "examples": [
        {
          "hanzi": "现在差十分八点。",
          "pinyin": "Xiànzài chà shí fēn bā diǎn.",
          "meaning": "Bây giờ là 8 giờ kém 10 phút."
        }
      ],
      "commonMistake": {
        "wrong": "八点差十分 ❌",
        "correct": "差十分八点 ✔️",
        "explanation": "Trong tiếng Trung, chữ 差 phải đứng trước số phút."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你每天几点起床？几点睡觉？",
          "pinyin": "Nǐ měitiān jǐ diǎn qǐchuáng? Jǐ diǎn shuìjiào?",
          "meaning": "Mỗi ngày bạn mấy giờ thức dậy? Mấy giờ đi ngủ?"
        },
        {
          "speaker": "B",
          "hanzi": "我早上七点一刻起床，晚上差十分十一点睡觉。",
          "pinyin": "Wǒ zǎoshang qī diǎn yí kè qǐchuáng, wǎnshang chà shí fēn shíyī diǎn shuìjiào.",
          "meaning": "Tôi thức dậy lúc 7 giờ 15 phút sáng, và đi ngủ lúc 11 giờ kém 10 đêm."
        }
      ],
      "audioText": "我早上七点一刻起床，晚上差十分十一点睡觉。",
      "question": "Người B thức dậy vào thời điểm nào?",
      "options": [
        "6 giờ 30 sáng",
        "7 giờ 15 sáng (qī diǎn yí kè)",
        "8 giờ sáng",
        "7 giờ kém 15"
      ],
      "correctIndex": 1,
      "explanation": "七点一刻 = 7 giờ 15 phút sáng."
    },
    "step6_speaking": {
      "prompt": "Nói giờ thức dậy của bạn:",
      "targetSentence": "我每天早上七点起床。",
      "targetPinyin": "Wǒ měitiān zǎoshang qī diǎn qǐchuáng.",
      "targetMeaning": "Hàng ngày tôi thức dậy lúc 7 giờ sáng.",
      "hint": "Đọc qǐchuáng rõ ràng thanh 3 và 2."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bây giờ là 8 giờ kém 5",
      "words": [
        "八点",
        "现在",
        "差五分"
      ],
      "correctOrder": [
        "现在",
        "差五分",
        "八点"
      ],
      "explanation": "现在 + 差五分 + 八点."
    },
    "step8_quiz": [
      {
        "id": "q-201-1",
        "type": "multiple-choice",
        "question": "Cách nói chuẩn của '7 giờ 15 phút' là:",
        "options": [
          "七点一刻",
          "七刻一点",
          "一刻七点",
          "七点十五刻"
        ],
        "correctIndex": 0,
        "explanation": "15 phút là 一刻: 七点一刻."
      },
      {
        "id": "q-201-2",
        "type": "multiple-choice",
        "question": "Chữ '差' trong '差十分十点' mang ý nghĩa gì?",
        "options": [
          "Hơn",
          "Kém / Thiếu",
          "Đúng",
          "Rưỡi"
        ],
        "correctIndex": 1,
        "explanation": "Chà mang nghĩa là kém (10 giờ kém 10)."
      }
    ],
    "step9_challenge": {
      "title": "Lên lịch sinh hoạt vàng",
      "taskDesc": "Đọc to câu miêu tả giờ thức dậy và giờ đi ngủ của bạn bằng cụm giờ chính xác.",
      "targetPhrase": "wǒ qī diǎn qǐchuáng shíyī diǎn shuìjiào",
      "xpReward": 50,
      "badge": "Bậc Thầy Giờ Giấc"
    }
  },

  {
    "id": "l-202",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 2,
    "title": "Phương tiện giao thông công cộng & Động từ di chuyển",
    "chineseTitle": "公共交通与出行（坐地铁、公共汽车、出租车）",
    "subtitle": "Nói về phương tiện di chuyển với 坐 (ngồi/đi xe), 骑 (cưỡi/đi xe đạp), 地铁 (tàu điện ngầm), 出租车 (taxi).",
    "objective": "Diễn đạt được bạn đi đâu bằng phương tiện gì và hỏi cách đi lại tại thành phố lớn.",
    "prerequisite": "Đã hoàn thành Bài 201.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 坐 / 骑 với phương tiện.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Giao thông",
      "Phương tiện",
      "坐",
      "骑",
      "地铁"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Động từ phương tiện: 坐 (zuò - Đi/Ngồi xe ô tô, tàu điện) vs 骑 (qí - Đi xe đạp, xe máy)",
      "summary": "Phương tiện có buồng lái ngồi vào dùng 坐 (坐出租车, 坐地铁, 坐飞机). Phương tiện ngồi dạng cưỡi hai chân dùng 骑 (骑自行车, 骑摩托车).",
      "audioDemoText": "wǒ zuò dìtiě qù gōngsī, tā qí zìxíngchē qù xuéxiào"
    },
    "step2_vocabulary": [
      {
        "id": "v-202-1",
        "hanzi": "坐",
        "pinyin": "zuò",
        "hanviet": "Tọa",
        "meaning": "Ngồi, đi (phương tiện)",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "坐出租车。",
          "pinyin": "Zuò chūzūchē.",
          "meaning": "Đi xe taxi."
        }
      },
      {
        "id": "v-202-2",
        "hanzi": "地铁",
        "pinyin": "dìtiě",
        "hanviet": "Địa thiết",
        "meaning": "Tàu điện ngầm",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "北京地铁很方便。",
          "pinyin": "Běijīng dìtiě hěn fāngbiàn.",
          "meaning": "Tàu điện ngầm Bắc Kinh rất tiện lợi."
        }
      },
      {
        "id": "v-202-3",
        "hanzi": "公共汽车",
        "pinyin": "gōnggòng qìchē",
        "hanviet": "Công cộng khí xa",
        "meaning": "Xe buýt",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "坐公共汽车。",
          "pinyin": "Zuò gōnggòng qìchē.",
          "meaning": "Đi xe buýt."
        }
      },
      {
        "id": "v-202-4",
        "hanzi": "出租车",
        "pinyin": "chūzūchē",
        "hanviet": "Xuất tô xa",
        "meaning": "Xe taxi",
        "radical": "出 (Xuất)",
        "example": {
          "hanzi": "打出租车。",
          "pinyin": "Dǎ chūzūchē.",
          "meaning": "Bắt taxi."
        }
      },
      {
        "id": "v-202-5",
        "hanzi": "骑",
        "pinyin": "qí",
        "hanviet": "Kỵ",
        "meaning": "Cưỡi, đi (xe đạp, xe máy)",
        "radical": "马 (Mã)",
        "example": {
          "hanzi": "骑自行车。",
          "pinyin": "Qí zìxíngchē.",
          "meaning": "Đi xe đạp."
        }
      },
      {
        "id": "v-202-6",
        "hanzi": "自行车",
        "pinyin": "zìxíngchē",
        "hanviet": "Tự hành xa",
        "meaning": "Xe đạp",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "买一辆自行车。",
          "pinyin": "Mǎi yí liàng zìxíngchē.",
          "meaning": "Mua một chiếc xe đạp."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "坐",
        "pinyin": "zuò",
        "meaning": "Ngồi, đi xe",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Nhân (人) trái -> Bộ Nhân (人) phải -> Bộ Thổ (土) dưới",
        "components": "人 + 人 + 土",
        "mnemonic": "Hai người (人 人) cùng ngồi nói chuyện trên mặt đất (土)."
      },
      {
        "hanzi": "铁",
        "pinyin": "tiě",
        "meaning": "Sắt thép (trong Địa thiết 地铁)",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Kim (钅) bên trái -> Chữ Thất (失) bên phải",
        "components": "钅 + 失",
        "mnemonic": "Kim loại sắt thép tạo nên đường ray tàu ngầm vững chắc."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc đi đâu bằng phương tiện gì (Chủ ngữ + 坐/骑 + Phương tiện + 去 + Nơi chốn)",
      "formula": "Chủ ngữ + 坐 / 骑 + Phương tiện + 去 + Địa điểm",
      "explanation": "Phương thức di chuyển luôn đứng trước hành động đi tới đích đến.",
      "examples": [
        {
          "hanzi": "我每天坐地铁去上班。",
          "pinyin": "Wǒ měitiān zuò dìtiě qù shàngbān.",
          "meaning": "Mỗi ngày tôi đi tàu điện ngầm đi làm."
        }
      ],
      "commonMistake": {
        "wrong": "我去上班坐地铁 ❌",
        "correct": "我坐地铁去上班 ✔️",
        "explanation": "Cách thức di chuyển đứng trước mục đích."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你今天怎么去公司？",
          "pinyin": "Nǐ jīntiān zěnme qù gōngsī?",
          "meaning": "Hôm nay bạn đi đến công ty bằng cách nào?"
        },
        {
          "speaker": "B",
          "hanzi": "今天天气很好，我骑自行车去。",
          "pinyin": "Jīntiān tiānqì hěn hǎo, wǒ qí zìxíngchē qù.",
          "meaning": "Hôm nay thời tiết đẹp, tôi đạp xe đạp đi."
        }
      ],
      "audioText": "你今天怎么去公司？今天天气很好，我骑自行车去。",
      "question": "Người B đi đến công ty bằng phương tiện gì?",
      "options": [
        "Tàu điện ngầm",
        "Xe đạp (zìxíngchē)",
        "Xe buýt",
        "Xe taxi"
      ],
      "correctIndex": 1,
      "explanation": "骑自行车去 = Đạp xe đạp đi."
    },
    "step6_speaking": {
      "prompt": "Nói bạn đi tàu điện ngầm đi làm:",
      "targetSentence": "我坐地铁去上班。",
      "targetPinyin": "Wǒ zuò dìtiě qù shàngbān.",
      "targetMeaning": "Tôi đi tàu điện ngầm đi làm.",
      "hint": "Đọc dìtiě dứt khoát với thanh 4 và 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đi xe buýt đến trường",
      "words": [
        "去学校",
        "坐公共汽车",
        "他"
      ],
      "correctOrder": [
        "他",
        "坐公共汽车",
        "去学校"
      ],
      "explanation": "他 + 坐公共汽车 + 去学校."
    },
    "step8_quiz": [
      {
        "id": "q-202-1",
        "type": "multiple-choice",
        "question": "Động từ phù hợp đi cùng '自行车' (xe đạp) là:",
        "options": [
          "坐 (zuò)",
          "骑 (qí)",
          "开 (kāi)",
          "走 (zǒu)"
        ],
        "correctIndex": 1,
        "explanation": "Đi xe đạp dùng động từ 骑 (qí zìxíngchē)."
      },
      {
        "id": "q-202-2",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Tàu điện ngầm'?",
        "options": [
          "出租车",
          "公共汽车",
          "地铁 (dìtiě)",
          "飞机"
        ],
        "correctIndex": 2,
        "explanation": "地铁 (Địa thiết) là tàu điện ngầm."
      }
    ],
    "step9_challenge": {
      "title": "Lập lộ trình đi lại",
      "taskDesc": "Nói to câu giới thiệu lộ trình đi học/đi làm hàng ngày của bạn và phương tiện sử dụng.",
      "targetPhrase": "wǒ zuò dìtiě qù shàngbān",
      "xpReward": 50,
      "badge": "Phượt Thủ Đô Thị"
    }
  },

  {
    "id": "l-203",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 3,
    "title": "Diễn đạt khoảng cách không gian với giới từ 离 (lí)",
    "chineseTitle": "空间距离与介词“离”（离这里很远/很近）",
    "subtitle": "Nắm vững cấu trúc A 离 B 很远/很近 (A cách B rất xa/rất gần) và hỏi khoảng cách bao xa.",
    "objective": "Hỏi và miêu tả được khoảng cách giữa hai địa điểm bằng cấu trúc chữ 离.",
    "prerequisite": "Đã hoàn thành Bài 202.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng cấu trúc A 离 B.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Khoảng cách",
      "Giới từ 离",
      "远",
      "近"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Giới từ khoảng cách: A 离 B 很远 / 很近 (A lí B hěn yuǎn / hěn jìn)",
      "summary": "离 (lí - Ly) dùng để so sánh khoảng cách từ điểm A tới điểm B. Cấu trúc: Nơi chốn A + 离 + Nơi chốn B + (Khoảng cách / 很远 / 很近).",
      "audioDemoText": "wǒ jiā lí gōngsī hěn jìn, xuéxiào lí jīchǎng hěn yuǎn"
    },
    "step2_vocabulary": [
      {
        "id": "v-203-1",
        "hanzi": "离",
        "pinyin": "lí",
        "hanviet": "Ly",
        "meaning": "Cách, rời khỏi",
        "radical": "亠 (Đầu)",
        "example": {
          "hanzi": "学校离这里不远。",
          "pinyin": "Xuéxiào lí zhèlǐ bù yuǎn.",
          "meaning": "Trường học cách đây không xa."
        }
      },
      {
        "id": "v-203-2",
        "hanzi": "远",
        "pinyin": "yuǎn",
        "hanviet": "Viễn",
        "meaning": "Xa",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "太远了。",
          "pinyin": "Tài yuǎn le.",
          "meaning": "Xa quá rồi."
        }
      },
      {
        "id": "v-203-3",
        "hanzi": "近",
        "pinyin": "jìn",
        "hanviet": "Cận",
        "meaning": "Gần",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "我家离公司很近。",
          "pinyin": "Wǒ jiā lí gōngsī hěn jìn.",
          "meaning": "Nhà tôi cách công ty rất gần."
        }
      },
      {
        "id": "v-203-4",
        "hanzi": "公里",
        "pinyin": "gōnglǐ",
        "hanviet": "Công lý",
        "meaning": "Ki-lô-mét (km)",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "有五公里。",
          "pinyin": "Yǒu wǔ gōnglǐ.",
          "meaning": "Cách 5 km."
        }
      },
      {
        "id": "v-203-5",
        "hanzi": "走路",
        "pinyin": "zǒulù",
        "hanviet": "Tẩu lộ",
        "meaning": "Đi bộ",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "走路去十分钟。",
          "pinyin": "Zǒulù qù shí fēnzhōng.",
          "meaning": "Đi bộ mất 10 phút."
        }
      },
      {
        "id": "v-203-6",
        "hanzi": "分钟",
        "pinyin": "fēnzhōng",
        "hanviet": "Phân chung",
        "meaning": "Phút (khoảng thời gian)",
        "radical": "钅 (Kim)",
        "example": {
          "hanzi": "二十分钟。",
          "pinyin": "Èrshí fēnzhōng.",
          "meaning": "20 phút."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "远",
        "pinyin": "yuǎn",
        "meaning": "Xa xôi",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Nguyên (元) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "元 + 辶",
        "mnemonic": "Bước chân đi xa (辶) đến tận nơi nguyên thủy ban đầu."
      },
      {
        "hanzi": "近",
        "pinyin": "jìn",
        "meaning": "Gần gũi",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Cân (斤) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "斤 + 辶",
        "mnemonic": "Cầm cây rìu (Cân) đi vài bước chân (Sước) là tới nơi gần."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc khoảng cách: A + 离 + B + Tính từ / Khoảng cách",
      "formula": "Địa điểm A + 离 + Địa điểm B + 很远 / 很近 / Có bao nhiêu km/phút",
      "explanation": "Câu hỏi khoảng cách thường dùng: A 离 B 远吗？ (A cách B xa không?) hoặc A 离 B 多远？ (A cách B bao xa?).",
      "examples": [
        {
          "hanzi": "我家离地铁站只有五百米。",
          "pinyin": "Wǒ jiā lí dìtiězhàn zhǐ yǒu wǔ bǎi mǐ.",
          "meaning": "Nhà tôi cách ga tàu điện ngầm chỉ có 500 mét."
        }
      ],
      "commonMistake": {
        "wrong": "我家从地铁站很近 ❌",
        "correct": "我家离地铁站很近 ✔️",
        "explanation": "Nói khoảng cách tĩnh dùng 离 (không dùng 从)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，故宫离这里远不远？",
          "pinyin": "Qǐngwèn, Gùgōng lí zhèlǐ yuǎn bu yuǎn?",
          "meaning": "Xin hỏi, Tử Cấm Thành cách đây có xa không?"
        },
        {
          "speaker": "B",
          "hanzi": "不远，离这里只有两公里，走路二十分钟就到了。",
          "pinyin": "Bù yuǎn, lí zhèlǐ zhǐ yǒu liǎng gōnglǐ, zǒulù èrshí fēnzhōng jiù dào le.",
          "meaning": "Không xa, cách đây chỉ có 2 km thôi, đi bộ 20 phút là tới rồi."
        }
      ],
      "audioText": "故宫离这里远不远？不远，离这里只有两公里。",
      "question": "Địa điểm Tử Cấm Thành cách đây bao xa?",
      "options": [
        "Rất xa, cách 20 km",
        "Không xa, chỉ cách 2 km (liǎng gōnglǐ)",
        "Phải đi máy bay",
        "Cách 50 km"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 不远，只有两公里."
    },
    "step6_speaking": {
      "prompt": "Nói nhà bạn cách công ty rất gần:",
      "targetSentence": "我家离公司很近。",
      "targetPinyin": "Wǒ jiā lí gōngsī hěn jìn.",
      "targetMeaning": "Nhà tôi cách công ty rất gần.",
      "hint": "Đọc rõ ràng lí và jìn thanh 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Trường học cách đây không xa",
      "words": [
        "不远",
        "离这里",
        "学校"
      ],
      "correctOrder": [
        "学校",
        "离这里",
        "不远"
      ],
      "explanation": "学校 + 离这里 + 不远."
    },
    "step8_quiz": [
      {
        "id": "q-203-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 我家 ___ 学校很近。",
        "options": [
          "在",
          "从",
          "离 (lí)",
          "往"
        ],
        "correctIndex": 2,
        "explanation": "Biểu thị khoảng cách cách bao xa dùng 离."
      },
      {
        "id": "q-203-2",
        "type": "multiple-choice",
        "question": "Từ phản nghĩa của '远' (yuǎn - Xa) là:",
        "options": [
          "大 (dà)",
          "近 (jìn - Gần)",
          "高 (gāo)",
          "冷 (lěng)"
        ],
        "correctIndex": 1,
        "explanation": "Gần là 近 (jìn)."
      }
    ],
    "step9_challenge": {
      "title": "Đo đạc khoảng cách",
      "taskDesc": "Nói to câu giới thiệu khoảng cách từ nhà bạn đến trường/chỗ làm bao nhiêu km hoặc đi mất bao lâu.",
      "targetPhrase": "wǒ jiā lí gōngsī bù yuǎn",
      "xpReward": 50,
      "badge": "Chuyên Gia Đo Đạc"
    }
  },

  {
    "id": "l-204",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 4,
    "title": "Hỏi đường & Chỉ hướng với giới từ 往 (wǎng)",
    "chineseTitle": "问路与指路介词“往”（往左拐、往前走）",
    "subtitle": "Nắm vững kỹ năng hỏi đường (怎么走), rẽ trái (往左拐), rẽ phải (往右拐), đi thẳng (往前走).",
    "objective": "Hỏi đường người đi đường và hiểu trọn vẹn chỉ dẫn hướng đi để không bị lạc ở Trung Quốc.",
    "prerequisite": "Đã hoàn thành Bài 203.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc 往 + Hướng + Động từ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Hỏi đường",
      "Giới từ 往",
      "Phương hướng",
      "Rẽ trái",
      "Đi thẳng"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Chỉ hướng với giới từ 往 (wǎng - Hướng về phía): 往 + Hướng + Động từ di chuyển",
      "summary": "往 (wǎng) biểu thị phương hướng vận động: 往前走 (Đi về phía trước), 往左拐 (Rẽ sang trái), 往右拐 (Rẽ sang phải).",
      "audioDemoText": "qǐngwèn dìtiězhàn zěnme zǒu, wǎng qián zǒu, dào lùkǒu wǎng zuǒ guǎi"
    },
    "step2_vocabulary": [
      {
        "id": "v-204-1",
        "hanzi": "往",
        "pinyin": "wǎng",
        "hanviet": "Vãng",
        "meaning": "Về hướng, hướng tới",
        "radical": "彳 (Xích)",
        "example": {
          "hanzi": "往前走。",
          "pinyin": "Wǎng qián zǒu.",
          "meaning": "Đi thẳng về phía trước."
        }
      },
      {
        "id": "v-204-2",
        "hanzi": "左",
        "pinyin": "zuǒ",
        "hanviet": "Tả",
        "meaning": "Bên trái",
        "radical": "工 (Công)",
        "example": {
          "hanzi": "往左拐。",
          "pinyin": "Wǎng zuǒ guǎi.",
          "meaning": "Rẽ sang bên trái."
        }
      },
      {
        "id": "v-204-3",
        "hanzi": "右",
        "pinyin": "yòu",
        "hanviet": "Hữu",
        "meaning": "Bên phải",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "往右拐。",
          "pinyin": "Wǎng yòu guǎi.",
          "meaning": "Rẽ sang bên phải."
        }
      },
      {
        "id": "v-204-4",
        "hanzi": "拐",
        "pinyin": "guǎi",
        "hanviet": "Quải",
        "meaning": "Rẽ, quẹo",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "在路口拐弯。",
          "pinyin": "Zài lùkǒu guǎi wān.",
          "meaning": "Rẽ tại ngã rẽ."
        }
      },
      {
        "id": "v-204-5",
        "hanzi": "路口",
        "pinyin": "lùkǒu",
        "hanviet": "Lộ khẩu",
        "meaning": "Ngã tư, ngã rẽ đường",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "前面的十字路口。",
          "pinyin": "Qiánmiàn de shízì lùkǒu.",
          "meaning": "Ngã tư đường phía trước."
        }
      },
      {
        "id": "v-204-6",
        "hanzi": "红绿灯",
        "pinyin": "hónglǜdēng",
        "hanviet": "Hồng lục đăng",
        "meaning": "Đèn giao thông (xanh đỏ)",
        "radical": "糸 (Mịch)",
        "example": {
          "hanzi": "看红绿灯。",
          "pinyin": "Kàn hónglǜdēng.",
          "meaning": "Nhìn đèn tín hiệu giao thông."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "左",
        "pinyin": "zuǒ",
        "meaning": "Bên trái",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Phẩy -> Nét chữ Công (工)",
        "components": "𠂇 + 工",
        "mnemonic": "Tay trái cầm công cụ hỗ trợ làm việc."
      },
      {
        "hanzi": "右",
        "pinyin": "yòu",
        "meaning": "Bên phải",
        "strokesCount": 5,
        "strokeOrderText": "Ngang -> Phẩy -> Bộ Khẩu (口)",
        "components": "𠂇 + 口",
        "mnemonic": "Tay phải cầm đũa đưa thức ăn vào miệng (Khẩu)."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc chỉ hướng kinh điển: 往 + Phương hướng + Động từ (拐 / 走)",
      "formula": "往 + 前 / 左 / 右 + 走 (Đi) / 拐 (Rẽ)",
      "explanation": "Khác với tiếng Việt (Rẽ trái -> Tiếng Trung: Hướng về bên trái mà rẽ = 往左拐).",
      "examples": [
        {
          "hanzi": "到前面的红绿灯，往右拐就到了。",
          "pinyin": "Dào qiánmiàn de hónglǜdēng, wǎng yòu guǎi jiù dào le.",
          "meaning": "Đến chỗ đèn giao thông phía trước, rẽ phải là tới rồi."
        }
      ],
      "commonMistake": {
        "wrong": "拐左 ❌",
        "correct": "往左拐 ✔️",
        "explanation": "Phải có giới từ 往 chỉ hướng."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Du khách",
          "hanzi": "请问，去地铁站怎么走？",
          "pinyin": "Qǐngwèn, qù dìtiězhàn zěnme zǒu?",
          "meaning": "Xin hỏi, đi đến ga tàu điện ngầm đi đường nào?"
        },
        {
          "speaker": "Người đi đường",
          "hanzi": "你往前走五百米，在第一个路口往左拐，就能看见了。",
          "pinyin": "Nǐ wǎng qián zǒu wǔ bǎi mǐ, zài dì yí gè lùkǒu wǎng zuǒ guǎi, jiù néng kànjiàn le.",
          "meaning": "Bạn đi thẳng 500m, ở ngã rẽ đầu tiên rẽ sang trái là sẽ nhìn thấy ngay."
        }
      ],
      "audioText": "你往前走五百米，在第一个路口往左拐，就能看见了。",
      "question": "Chỉ dẫn rẽ ở đâu?",
      "options": [
        "Rẽ phải ở ngã tư thứ hai",
        "Rẽ trái ở ngã rẽ đầu tiên (dì yí gè lùkǒu wǎng zuǒ guǎi)",
        "Quay đầu lại",
        "Đi thẳng 2 km"
      ],
      "correctIndex": 1,
      "explanation": "在第一个路口往左拐 = Ngã rẽ đầu tiên rẽ trái."
    },
    "step6_speaking": {
      "prompt": "Đọc câu chỉ đường: Đi thẳng rồi rẽ phải:",
      "targetSentence": "往前走，往右拐。",
      "targetPinyin": "Wǎng qián zǒu, wǎng yòu guǎi.",
      "targetMeaning": "Đi thẳng về phía trước, rẽ sang bên phải.",
      "hint": "Đọc dứt khoát wǎng qián zǒu."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Rẽ trái ở ngã tư đường",
      "words": [
        "在路口",
        "往左拐"
      ],
      "correctOrder": [
        "在路口",
        "往左拐"
      ],
      "explanation": "在路口 + 往左拐."
    },
    "step8_quiz": [
      {
        "id": "q-204-1",
        "type": "multiple-choice",
        "question": "Cách nói 'Rẽ phải' chuẩn xác trong tiếng Trung là:",
        "options": [
          "拐右",
          "往右拐 (wǎng yòu guǎi)",
          "右走",
          "拐在右"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc chỉ hướng: 往右拐."
      },
      {
        "id": "q-204-2",
        "type": "multiple-choice",
        "question": "Cụm '红绿灯' (hónglǜdēng) mang nghĩa là gì?",
        "options": [
          "Đèn lồng đỏ",
          "Đèn giao thông (đèn xanh đèn đỏ)",
          "Biển báo tốc độ",
          "Đường cao tốc"
        ],
        "correctIndex": 1,
        "explanation": "Hồng lục đăng là đèn tín hiệu giao thông."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy dẫn đường",
      "taskDesc": "Đọc to câu hướng dẫn bạn bè đi thẳng 200m rồi rẽ trái đến trạm xe buýt.",
      "targetPhrase": "wǎng qián zǒu wǎng zuǒ guǎi dào dìtiězhàn",
      "xpReward": 50,
      "badge": "Bản Đồ Di Động"
    }
  },

  {
    "id": "l-205",
    "chapterId": "ch-5",
    "levelId": "lvl-2",
    "lessonNumber": 5,
    "title": "Ôn tập Module 2.1 & Thử thách bắt taxi, chỉ đường thực tế",
    "chineseTitle": "模块2.1总复习与打车实战挑战",
    "subtitle": "Tổng kết đàm thoại gọi taxi, nói địa điểm, giao tiếp với tài xế và sẵn sàng đấu Boss Chapter 5.",
    "objective": "Tự tin đối thoại với tài xế taxi, chỉ đường trực tiếp và hỏi giá tiền chuyến đi trôi chảy.",
    "prerequisite": "Đã hoàn thành Bài 201–204.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng kết Module",
      "Bắt taxi",
      "Thực chiến chỉ đường"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hội thoại gọi taxi thực chiến tại Bắc Kinh",
      "summary": "1. Chào hỏi & Nêu điểm đến: 师傅，我去... (Thưa bác tài, cháu đi...). 2. Hỏi thời gian: 大概需要多长时间？ (Khoảng bao lâu tới?). 3. Chỉ đường gần đích: 前面路口靠边停 (Phía trước ngã rẽ tấp lề đỗ lại).",
      "audioDemoText": "shīfu wǒ qù běijīng dàxué, duō cháng shíjiān néng dào"
    },
    "step2_vocabulary": [
      {
        "id": "v-205-1",
        "hanzi": "师傅",
        "pinyin": "shīfu",
        "hanviet": "Sư phó",
        "meaning": "Bác tài, chú (xưng hô tài xế, thợ)",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "师傅，请问去机场多少钱？",
          "pinyin": "Shīfu, qǐngwèn qù jīchǎng duōshao qián?",
          "meaning": "Bác tài ơi, đi sân bay bao nhiêu tiền ạ?"
        }
      },
      {
        "id": "v-205-2",
        "hanzi": "大概",
        "pinyin": "dàgài",
        "hanviet": "Đại khái",
        "meaning": "Khoảng chừng, đại khái",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "大概半个小时。",
          "pinyin": "Dàgài bàn gè xiǎoshí.",
          "meaning": "Khoảng nửa tiếng đồng hồ."
        }
      },
      {
        "id": "v-205-3",
        "hanzi": "停车",
        "pinyin": "tíngchē",
        "hanviet": "Đình xa",
        "meaning": "Dừng xe, đỗ xe",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "在这里停车。",
          "pinyin": "Zài zhèlǐ tíngchē.",
          "meaning": "Đỗ xe ở đây."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "停",
        "pinyin": "tíng",
        "meaning": "Dừng lại, đỗ xe",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Nhân đứng (亻) -> Chữ Đình (亭)",
        "components": "亻 + 亭",
        "mnemonic": "Con người (亻) bước vào ngôi đình (亭) dừng chân nghỉ ngơi."
      }
    ],
    "step4_grammar": {
      "title": "Cụm câu khẩu ngữ kinh điển khi đi taxi",
      "formula": "师傅，我去 + Nơi chốn。 前面 + 往左拐 / 靠边停。",
      "explanation": "Từ 师傅 là cách gọi tôn trọng và thân thiện nhất với các bác tài xế taxi tại Trung Quốc.",
      "examples": [
        {
          "hanzi": "师傅，前面路口右拐，谢谢！",
          "pinyin": "Shīfu, qiánmiàn lùkǒu yòuguǎi, xièxie!",
          "meaning": "Bác tài ơi, ngã rẽ phía trước rẽ phải ạ, cảm ơn bác!"
        }
      ],
      "commonMistake": {
        "wrong": "Gọi tài xế là 司机 (nghe xa cách và lạnh nhạt)",
        "correct": "Gọi là 师傅 (thân mật, bản xứ)",
        "explanation": "Văn hóa giao tiếp xã hội Trung Quốc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khách",
          "hanzi": "师傅，我去王府井步行街，大概要多长时间？",
          "pinyin": "Shīfu, wǒ qù Wángfǔjǐng Bùxíngjiē, dàgài yào duō cháng shíjiān?",
          "meaning": "Bác tài ơi, cháu đi phố đi bộ Vương Phủ Tỉnh, khoảng bao lâu thì tới ạ?"
        },
        {
          "speaker": "Tài xế",
          "hanzi": "不堵车的话，大概二十分钟就到了。",
          "pinyin": "Bù dǔchē dehuà, dàgài èrshí fēnzhōng jiù dào le.",
          "meaning": "Nếu không kẹt xe thì khoảng 20 phút là tới nơi rồi."
        }
      ],
      "audioText": "师傅，我去王府井步行街，大概要多长时间？大概二十分钟就到了。",
      "question": "Chuyến đi taxi dự kiến mất bao lâu?",
      "options": [
        "1 tiếng",
        "Khoảng 20 phút (dàgài èrshí fēnzhōng)",
        "5 phút",
        "2 tiếng"
      ],
      "correctIndex": 1,
      "explanation": "Tài xế nói: 大概二十分钟."
    },
    "step6_speaking": {
      "prompt": "Nói với tài xế taxi dừng xe tại đây:",
      "targetSentence": "师傅，请在这里停车。",
      "targetPinyin": "Shīfu, qǐng zài zhèlǐ tíngchē.",
      "targetMeaning": "Bác tài ơi, xin dừng xe ở đây ạ.",
      "hint": "Đọc lịch sự và to rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bác tài ơi, tôi đi sân bay",
      "words": [
        "我去机场",
        "师傅"
      ],
      "correctOrder": [
        "师傅",
        "我去机场"
      ],
      "explanation": "师傅 + 我去机场."
    },
    "step8_quiz": [
      {
        "id": "q-205-1",
        "type": "multiple-choice",
        "question": "Cách xưng hô tự nhiên và lịch sự nhất với bác tài xế taxi là:",
        "options": [
          "老师 (Lǎoshī)",
          "师傅 (Shīfu)",
          "服务员 (Fúwùyuán)",
          "老板 (Lǎobǎn)"
        ],
        "correctIndex": 1,
        "explanation": "Xưng hô với tài xế là 师傅 (Shīfu)."
      },
      {
        "id": "q-205-2",
        "type": "multiple-choice",
        "question": "Cụm '大概' (dàgài) mang ý nghĩa gì?",
        "options": [
          "Chắc chắn 100%",
          "Đại khái / Khoảng chừng",
          "Không bao giờ",
          "Chậm trễ"
        ],
        "correctIndex": 1,
        "explanation": "Đại khái nghĩa là khoảng chừng, ước lượng."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 5",
      "taskDesc": "Vượt qua thử thách đàm thoại di chuyển để mở khóa Boss giao thông đô thị!",
      "targetPhrase": "shīfu wǒ qù jīchǎng qǐng zài zhèlǐ tíngchē",
      "xpReward": 60,
      "badge": "Tài Xế Vàng Phố Thị"
    }
  },

  {
    "id": "l-206",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 6,
    "title": "Đi nhà hàng & Gọi món quen thuộc (点菜与菜单)",
    "chineseTitle": "餐厅点菜与特色美食（服务员，点菜）",
    "subtitle": "Kêu phục vụ (服务员), xem thực đơn (菜单), gọi món (点菜) và các món ăn Trung Hoa trứ danh.",
    "objective": "Tự tin gọi món tại quán ăn Trung Quốc và hỏi nhân viên về các món đặc sản.",
    "prerequisite": "Đã hoàn thành Module 2.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đóng vai gọi 2 món ăn kèm đồ uống.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Nhà hàng",
      "Gọi món",
      "服务员",
      "点菜"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Đàm thoại gọi món: 服务员，我们要点菜 (Fúwùyuán, wǒmen yào diǎncài)",
      "summary": "服务员 (fúwùyuán) là nhân viên phục vụ. 菜单 (càidān) là thực đơn. 点菜 (diǎncài) là gọi món. 好吃 (hǎochī) là ngon miệng.",
      "audioDemoText": "fúwùyuán qǐng gěi wǒ càidān, wǒmen yào diǎncài"
    },
    "step2_vocabulary": [
      {
        "id": "v-206-1",
        "hanzi": "服务员",
        "pinyin": "fúwùyuán",
        "hanviet": "Phục vụ viên",
        "meaning": "Nhân viên phục vụ",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "服务员，买单！",
          "pinyin": "Fúwùyuán, mǎidān!",
          "meaning": "Phục vụ ơi, tính tiền!"
        }
      },
      {
        "id": "v-206-2",
        "hanzi": "菜单",
        "pinyin": "càidān",
        "hanviet": "Thái đơn",
        "meaning": "Thực đơn",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "请看菜单。",
          "pinyin": "Qǐng kàn càidān.",
          "meaning": "Mời xem thực đơn."
        }
      },
      {
        "id": "v-206-3",
        "hanzi": "点菜",
        "pinyin": "diǎncài",
        "hanviet": "Điểm thái",
        "meaning": "Gọi món, gọi thức ăn",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "可以点菜了吗？",
          "pinyin": "Kěyǐ diǎncài le ma?",
          "meaning": "Đã có thể gọi món chưa ạ?"
        }
      },
      {
        "id": "v-206-4",
        "hanzi": "饺子",
        "pinyin": "jiǎozi",
        "hanviet": "Sủi cảo",
        "meaning": "Sủi cảo, bánh chẻo",
        "radical": "饣 (Thực)",
        "example": {
          "hanzi": "中国饺子很好吃。",
          "pinyin": "Zhōngguó jiǎozi hěn hǎochī.",
          "meaning": "Sủi cảo Trung Quốc rất ngon."
        }
      },
      {
        "id": "v-206-5",
        "hanzi": "好吃",
        "pinyin": "hǎochī",
        "hanviet": "Hảo cật",
        "meaning": "Ngon miệng",
        "radical": "女 (Nữ)",
        "example": {
          "hanzi": "这个菜真好吃！",
          "pinyin": "Zhège cài zhēn hǎochī!",
          "meaning": "Món này ngon thật!"
        }
      },
      {
        "id": "v-206-6",
        "hanzi": "烤鸭",
        "pinyin": "kǎoyā",
        "hanviet": "Khảo áp",
        "meaning": "Vịt quay",
        "radical": "火 (Hỏa)",
        "example": {
          "hanzi": "北京烤鸭。",
          "pinyin": "Běijīng kǎoyā.",
          "meaning": "Vịt quay Bắc Kinh."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "服",
        "pinyin": "fú",
        "meaning": "Phục vụ, quần áo",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Nguyệt (月) bên trái -> Nét gập chấm phải",
        "components": "月 + 卩 + 又",
        "mnemonic": "Mặc trang phục gọn gàng cung kính phục vụ khách hàng."
      },
      {
        "hanzi": "单",
        "pinyin": "dān",
        "meaning": "Đơn tờ, danh sách",
        "strokesCount": 8,
        "strokeOrderText": "Hai chấm trên -> Bộ Khẩu (口) -> Ngang -> Sổ thẳng dài",
        "components": "丷 + 口 + 十",
        "mnemonic": "Tờ giấy ghi chép danh sách các món ăn rõ ràng."
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu gọi món lịch sự: 请给我们... / 我们要...",
      "formula": "服务员，请给我们一份 + Tên món ăn",
      "explanation": "Lượng từ cho một phần đồ ăn là 份 (fèn - suất, phần) hoặc 盘 (pán - đĩa).",
      "examples": [
        {
          "hanzi": "服务员，我们要一份北京烤鸭和两碗米饭。",
          "pinyin": "Fúwùyuán, wǒmen yào yí fèn Běijīng kǎoyā hé liǎng wǎn mǐfàn.",
          "meaning": "Phục vụ ơi, cho chúng tôi một phần vịt quay Bắc Kinh và hai bát cơm."
        }
      ],
      "commonMistake": {
        "wrong": "我要一米饭 ❌",
        "correct": "我们要一碗米饭 ✔️",
        "explanation": "Phải có lượng từ bát (碗 - wǎn) cho cơm."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Nhân viên",
          "hanzi": "您好，两位想吃点什么？",
          "pinyin": "Nín hǎo, liǎng wèi xiǎng chī diǎn shénme?",
          "meaning": "Kính chào quý khách, hai vị muốn dùng món gì ạ?"
        },
        {
          "speaker": "Khách",
          "hanzi": "服务员，给我们来一盘饺子和一份宫保鸡丁。",
          "pinyin": "Fúwùyuán, gěi wǒmen lái yì pán jiǎozi hé yí fèn Gōngbǎo jīdīng.",
          "meaning": "Phục vụ ơi, cho chúng tôi một đĩa sủi cảo và một phần gà xào Cung Bảo nhé."
        }
      ],
      "audioText": "服务员，给我们来一盘饺子和一份宫保鸡丁。",
      "question": "Khách hàng đã gọi những món gì?",
      "options": [
        "Cơm chiên và canh trứng",
        "Một đĩa sủi cảo và gà xào Cung Bảo (yì pán jiǎozi hé yí fèn Gōngbǎo jīdīng)",
        "Vịt quay Bắc Kinh",
        "Mì cay Tứ Xuyên"
      ],
      "correctIndex": 1,
      "explanation": "Khách gọi: 一盘饺子和一份宫保鸡丁."
    },
    "step6_speaking": {
      "prompt": "Nói gọi món với nhân viên phục vụ:",
      "targetSentence": "服务员，我们要点菜。",
      "targetPinyin": "Fúwùyuán, wǒmen yào diǎncài.",
      "targetMeaning": "Phục vụ ơi, chúng tôi muốn gọi món.",
      "hint": "Đọc fúwùyuán rõ ràng và lịch sự."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Cho chúng tôi một đĩa sủi cảo",
      "words": [
        "一盘饺子",
        "给我们",
        "来"
      ],
      "correctOrder": [
        "给我们",
        "来",
        "一盘饺子"
      ],
      "explanation": "给我们 + 来 + 一盘饺子."
    },
    "step8_quiz": [
      {
        "id": "q-206-1",
        "type": "multiple-choice",
        "question": "Khi muốn gọi tính tiền tại quán ăn, người Trung Quốc thường nói:",
        "options": [
          "买单 (mǎidān)",
          "点菜 (diǎncài)",
          "看菜单 (kàn càidān)",
          "吃饭 (chīfàn)"
        ],
        "correctIndex": 0,
        "explanation": "Thanh toán tính tiền gọi là 买单 (mǎidān)."
      },
      {
        "id": "q-206-2",
        "type": "multiple-choice",
        "question": "Từ '饺子' (jiǎozi) là món ăn nổi tiếng nào của Trung Hoa?",
        "options": [
          "Bánh bao",
          "Sủi cảo / Bánh chẻo",
          "Mì xào",
          "Đậu phụ thối"
        ],
        "correctIndex": 1,
        "explanation": "Sủi cảo là món ăn truyền thống đặc sắc của Trung Quốc."
      }
    ],
    "step9_challenge": {
      "title": "Gọi món chuyên nghiệp",
      "taskDesc": "Đóng vai gọi trọn vẹn 1 món mặn, 1 món canh và 1 món nước tại bàn ăn.",
      "targetPhrase": "fúwùyuán wǒmen yào diǎncài gěi wǒ càidān",
      "xpReward": 50,
      "badge": "Thực Khách Sành Điệu"
    }
  },

  {
    "id": "l-207",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 7,
    "title": "Khẩu vị & Dặn dò nhà bếp (不要放辣椒)",
    "chineseTitle": "口味与点餐嘱咐（酸、甜、苦、辣、咸）",
    "subtitle": "5 vị cơ bản trong ẩm thực (chua, ngọt, đắng, cay, mặn) và cách dặn dò nhà bếp không bỏ ớt hay hành.",
    "objective": "Miêu tả khẩu vị ưa thích và dặn dò đầu bếp nấu theo yêu cầu đặc biệt của bản thân.",
    "prerequisite": "Đã hoàn thành Bài 206.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu dặn dò nhà bếp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Khẩu vị",
      "Cay",
      "Ngọt",
      "不要放辣椒"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "5 Vị cơ bản: 酸 (suān - chua), 甜 (tián - ngọt), 苦 (kǔ - đắng), 辣 (là - cay), 咸 (xián - mặn)",
      "summary": "Cấu trúc dặn dò đầu bếp: 不要放... (Đừng bỏ...), 少放... (Bỏ ít...). Ví dụ: 不要放辣椒 (Đừng bỏ ớt), 少放盐 (Bỏ ít muối).",
      "audioDemoText": "suān tián kǔ là xián, bú yào fàng làjiāo, shǎo fàng yán"
    },
    "step2_vocabulary": [
      {
        "id": "v-207-1",
        "hanzi": "辣",
        "pinyin": "là",
        "hanviet": "Lạt",
        "meaning": "Cay",
        "radical": "辛 (Tân)",
        "example": {
          "hanzi": "四川菜很辣。",
          "pinyin": "Sìchuān cài hěn là.",
          "meaning": "Món ăn Tứ Xuyên rất cay."
        }
      },
      {
        "id": "v-207-2",
        "hanzi": "甜",
        "pinyin": "tián",
        "hanviet": "Điềm",
        "meaning": "Ngọt",
        "radical": "甘 (Cam)",
        "example": {
          "hanzi": "这个西瓜很甜。",
          "pinyin": "Zhège xīguā hěn tián.",
          "meaning": "Quả dưa hấu này rất ngọt."
        }
      },
      {
        "id": "v-207-3",
        "hanzi": "酸",
        "pinyin": "suān",
        "hanviet": "Toan",
        "meaning": "Chua",
        "radical": "酉 (Dậu)",
        "example": {
          "hanzi": "有点儿酸。",
          "pinyin": "Yǒudiǎnr suān.",
          "meaning": "Hơi chua một chút."
        }
      },
      {
        "id": "v-207-4",
        "hanzi": "放",
        "pinyin": "fàng",
        "hanviet": "Phóng",
        "meaning": "Bỏ vào, để, đặt",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "不要放糖。",
          "pinyin": "Bú yào fàng táng.",
          "meaning": "Đừng bỏ đường."
        }
      },
      {
        "id": "v-207-5",
        "hanzi": "辣椒",
        "pinyin": "làjiāo",
        "hanviet": "Lạt tiêu",
        "meaning": "Quả ớt",
        "radical": "辛 (Tân)",
        "example": {
          "hanzi": "我不吃辣椒。",
          "pinyin": "Wǒ bù chī làjiāo.",
          "meaning": "Tôi không ăn ớt."
        }
      },
      {
        "id": "v-207-6",
        "hanzi": "少",
        "pinyin": "shǎo",
        "hanviet": "Thiểu",
        "meaning": "Ít",
        "radical": "小 (Tiểu)",
        "example": {
          "hanzi": "少放一点儿盐。",
          "pinyin": "Shǎo fàng yìdiǎnr yán.",
          "meaning": "Bỏ ít muối một chút."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "辣",
        "pinyin": "là",
        "meaning": "Cay nồng",
        "strokesCount": 14,
        "strokeOrderText": "Bộ Tân (辛) bên trái -> Chữ Thúc (束) bên phải",
        "components": "辛 + 束",
        "mnemonic": "Vị cay đắng (Tân) buộc chặt (Thúc) nơi đầu lưỡi."
      },
      {
        "hanzi": "甜",
        "pinyin": "tián",
        "meaning": "Ngọt ngào",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Cam (甘) bên trái -> Bộ Thiệt (舌) bên phải",
        "components": "甘 + 舌",
        "mnemonic": "Cái lưỡi (Thiệt) nếm vị ngọt lành thơm tho (Cam)."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc dặn dò khẩu vị: 不要放 / 少放 + Gia vị",
      "formula": "请 + 不要放 / 少放 + 辣椒 (ớt) / 糖 (đường) / 盐 (muối) / 香菜 (ngò rí)",
      "explanation": "Khi đi du lịch Trung Quốc, đặc biệt ở Tứ Xuyên và Hồ Nam nơi các món rất cay, mẫu câu '不要放辣椒' là chìa khóa sinh tồn hữu ích.",
      "examples": [
        {
          "hanzi": "服务员，我的菜请不要放辣椒，少放盐。",
          "pinyin": "Fúwùyuán, wǒ de cài qǐng bú yào fàng làjiāo, shǎo fàng yán.",
          "meaning": "Phục vụ ơi, món của tôi xin đừng bỏ ớt, và cho ít muối thôi nhé."
        }
      ],
      "commonMistake": {
        "wrong": "不放辣椒 ❌ (thiếu lịch sự)",
        "correct": "请不要放辣椒 ✔️",
        "explanation": "Thêm 请 và 不要 để thể hiện thái độ nhã nhặn."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Nhân viên",
          "hanzi": "这份麻婆豆腐需要微辣还是大辣？",
          "pinyin": "Zhè fèn Mápó dòufu xūyào wēilà háishì dàlà?",
          "meaning": "Phần đậu phụ Ma Bà này quý khách muốn cay nhẹ hay cay nồng ạ?"
        },
        {
          "speaker": "Khách",
          "hanzi": "我不太能吃辣，请帮我做微辣，少放辣椒，谢谢！",
          "pinyin": "Wǒ bú tài néng chī là, qǐng bāng wǒ zuò wēilà, shǎo fàng làjiāo, xièxie!",
          "meaning": "Tôi không ăn được cay lắm, xin làm cay nhẹ thôi và cho ít ớt giúp tôi, cảm ơn nhé!"
        }
      ],
      "audioText": "我不太能吃辣，请帮我做微辣，少放辣椒。",
      "question": "Khách hàng yêu cầu độ cay như thế nào?",
      "options": [
        "Rất cay nồng",
        "Không bỏ đậu phụ",
        "Cay nhẹ và cho ít ớt (wēilà, shǎo fàng làjiāo)",
        "Cho thật nhiều ớt"
      ],
      "correctIndex": 2,
      "explanation": "Khách dặn: 微辣，少放辣椒."
    },
    "step6_speaking": {
      "prompt": "Dặn dò đầu bếp không bỏ ớt:",
      "targetSentence": "请不要放辣椒。",
      "targetPinyin": "Qǐng bú yào fàng làjiāo.",
      "targetMeaning": "Xin đừng bỏ ớt.",
      "hint": "Đọc làjiāo dứt khoát thanh 4 và 1."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Xin cho ít muối một chút",
      "words": [
        "盐",
        "少放一点儿",
        "请"
      ],
      "correctOrder": [
        "请",
        "少放一点儿",
        "盐"
      ],
      "explanation": "请 + 少放一点儿 + 盐."
    },
    "step8_quiz": [
      {
        "id": "q-207-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là vị 'Ngọt'?",
        "options": [
          "辣 (là)",
          "酸 (suān)",
          "甜 (tián)",
          "苦 (kǔ)"
        ],
        "correctIndex": 2,
        "explanation": "甜 (tián) là ngọt."
      },
      {
        "id": "q-207-2",
        "type": "multiple-choice",
        "question": "Câu '不要放辣椒' có nghĩa là:",
        "options": [
          "Cho nhiều ớt vào",
          "Đừng bỏ ớt",
          "Đừng ăn cơm",
          "Bỏ thêm muối"
        ],
        "correctIndex": 1,
        "explanation": "Đừng bỏ ớt vào món ăn."
      }
    ],
    "step9_challenge": {
      "title": "Khẩu vị của riêng tôi",
      "taskDesc": "Đọc to câu dặn dò nhà bếp: Tôi thích ngọt, không ăn được cay, xin đừng cho ớt.",
      "targetPhrase": "qǐng bú yào fàng làjiāo wǒ bù chī là",
      "xpReward": 50,
      "badge": "Khẩu Vị Tinh Tế"
    }
  },

  {
    "id": "l-208",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 8,
    "title": "Mua sắm quần áo, màu sắc & Size (试衣服)",
    "chineseTitle": "服装购物、颜色与试穿（这件衣服可以试一下吗）",
    "subtitle": "Lượng từ 件 (jiàn), màu sắc cơ bản (đỏ, đen, trắng), động từ 穿 (mặc) và thử đồ (试一下).",
    "objective": "Biết hỏi thử quần áo, hỏi size lớn/nhỏ và miêu tả màu sắc yêu thích.",
    "prerequisite": "Đã hoàn thành Bài 207.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại thử đồ trong shop thời trang.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Mua sắm",
      "Quần áo",
      "Màu sắc",
      "试衣服"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Mua sắm quần áo: 这件衣服可以试一下吗？ (Zhè jiàn yīfu kěyǐ shì yíxià ma?)",
      "summary": "件 (jiàn) là lượng từ cho quần áo. 颜色 (yánsè) là màu sắc: 红色 (đỏ), 黑色 (đen), 白色 (trắng). 试 (shì) là thử, 穿 (chuān) là mặc.",
      "audioDemoText": "zhè jiàn yīfu kěyǐ shì yíxià ma, yǒu méiyǒu dà yidiǎnr de"
    },
    "step2_vocabulary": [
      {
        "id": "v-208-1",
        "hanzi": "衣服",
        "pinyin": "yīfu",
        "hanviet": "Y phục",
        "meaning": "Quần áo",
        "radical": "衣 (Y)",
        "example": {
          "hanzi": "买新衣服。",
          "pinyin": "Mǎi xīn yīfu.",
          "meaning": "Mua quần áo mới."
        }
      },
      {
        "id": "v-208-2",
        "hanzi": "件",
        "pinyin": "jiàn",
        "hanviet": "Kiện",
        "meaning": "Chiếc, cái (lượng từ quần áo)",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "这件衣服很漂亮。",
          "pinyin": "Zhè jiàn yīfu hěn piàoliang.",
          "meaning": "Bộ quần áo này rất đẹp."
        }
      },
      {
        "id": "v-208-3",
        "hanzi": "试",
        "pinyin": "shì",
        "hanviet": "Thí",
        "meaning": "Thử (thử đồ, thi)",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "我可以试一下吗？",
          "pinyin": "Wǒ kěyǐ shì yíxià ma?",
          "meaning": "Tôi có thể thử một chút không?"
        }
      },
      {
        "id": "v-208-4",
        "hanzi": "穿",
        "pinyin": "chuān",
        "hanviet": "Xuyên",
        "meaning": "Mặc, xỏ (giày áo)",
        "radical": "穴 (Huyệt)",
        "example": {
          "hanzi": "穿这件衬衫。",
          "pinyin": "Chuān zhè jiàn chènshān.",
          "meaning": "Mặc chiếc áo sơ mi này."
        }
      },
      {
        "id": "v-208-5",
        "hanzi": "颜色",
        "pinyin": "yánsè",
        "hanviet": "Nhan sắc",
        "meaning": "Màu sắc",
        "radical": "页 (Hiệp)",
        "example": {
          "hanzi": "你喜欢什么颜色？",
          "pinyin": "Nǐ xǐhuan shénme yánsè?",
          "meaning": "Bạn thích màu gì?"
        }
      },
      {
        "id": "v-208-6",
        "hanzi": "红",
        "pinyin": "hóng",
        "hanviet": "Hồng",
        "meaning": "Màu đỏ",
        "radical": "纟 (Mịch)",
        "example": {
          "hanzi": "红色的衣服。",
          "pinyin": "Hóngsè de yīfu.",
          "meaning": "Quần áo màu đỏ."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "衣",
        "pinyin": "yī",
        "meaning": "Áo, y phục",
        "strokesCount": 6,
        "strokeOrderText": "Chấm -> Ngang -> Phẩy -> Sổ gập cong -> Phẩy -> Mác",
        "components": "Bộ Y (衣)",
        "mnemonic": "Hình dáng chiếc áo cổ truyền có vạt áo khoác lên người."
      },
      {
        "hanzi": "穿",
        "pinyin": "chuān",
        "meaning": "Mặc quần áo, xuyên qua",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Huyệt (穴) ở trên -> Chữ Nha (牙) ở dưới",
        "components": "穴 + 牙",
        "mnemonic": "Đưa cơ thể xuyên qua cái hang lỗ áo để mặc vào."
      }
    ],
    "step4_grammar": {
      "title": "Động từ trùng điệp hoặc đi cùng 一下 để làm mềm giọng điệu: 试一下 / 穿穿",
      "formula": "Động từ + 一下 (yíxià) -> Biểu thị hành động thử trong chốc lát, tạo ngữ khí nhẹ nhàng",
      "explanation": "Khi xin phép làm gì (thử áo, xem đồ, hỏi han), dùng 一下 để câu nói trở nên vô cùng lịch sự và tự nhiên.",
      "examples": [
        {
          "hanzi": "请问，我可以试一下这件红色的衣服吗？",
          "pinyin": "Qǐngwèn, wǒ kěyǐ shì yíxià zhè jiàn hóngsè de yīfu ma?",
          "meaning": "Xin hỏi, tôi có thể thử chiếc áo màu đỏ này một chút được không?"
        }
      ],
      "commonMistake": {
        "wrong": "我可以试吗？ (hơi cộc lốc)",
        "correct": "我可以试一下吗？ ✔️",
        "explanation": "一下 giúp câu nói mềm mại, nhã nhặn hơn."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khách",
          "hanzi": "服务员，这件衣服有点儿小，有大一点儿的吗？",
          "pinyin": "Fúwùyuán, zhè jiàn yīfu yǒudiǎnr xiǎo, yǒu dà yìdiǎnr de ma?",
          "meaning": "Nhân viên ơi, chiếc áo này hơi chật một chút, có cái lớn hơn một chút không?"
        },
        {
          "speaker": "Nhân viên",
          "hanzi": "有的，您等一下，我帮您拿一件大号的试一下。",
          "pinyin": "Yǒu de, nín děng yíxià, wǒ bāng nín ná yí jiàn dàhào de shì yíxià.",
          "meaning": "Dạ có ạ, quý khách đợi một chút, em lấy cho quý khách chiếc size L để thử nhé."
        }
      ],
      "audioText": "这件衣服有点儿小，有大一点儿的吗？有的，我帮您拿一件大号的。",
      "question": "Khách hàng muốn đổi chiếc áo như thế nào?",
      "options": [
        "Đổi màu đen",
        "Lấy chiếc to hơn một chút (dà yìdiǎnr de)",
        "Lấy chiếc rẻ hơn",
        "Không mua nữa"
      ],
      "correctIndex": 1,
      "explanation": "Khách hỏi: 有大一点儿的吗."
    },
    "step6_speaking": {
      "prompt": "Hỏi nhân viên xin phép thử chiếc áo này:",
      "targetSentence": "我可以试一下吗？",
      "targetPinyin": "Wǒ kěyǐ shì yíxià ma?",
      "targetMeaning": "Tôi có thể thử một chút không?",
      "hint": "Đọc shì yíxià ma nhẹ nhàng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chiếc áo này rất đẹp",
      "words": [
        "很漂亮",
        "衣服",
        "这件"
      ],
      "correctOrder": [
        "这件",
        "衣服",
        "很漂亮"
      ],
      "explanation": "这件 + 衣服 + 很漂亮."
    },
    "step8_quiz": [
      {
        "id": "q-208-1",
        "type": "multiple-choice",
        "question": "Lượng từ dùng cho quần áo (áo, váy, áo khoác) là:",
        "options": [
          "个 (gè)",
          "件 (jiàn)",
          "本 (běn)",
          "张 (zhāng)"
        ],
        "correctIndex": 1,
        "explanation": "Lượng từ quần áo là 件 (jiàn yīfu)."
      },
      {
        "id": "q-208-2",
        "type": "multiple-choice",
        "question": "Màu '黑色' (hēisè) trong tiếng Trung là màu gì?",
        "options": [
          "Màu trắng",
          "Màu đen",
          "Màu đỏ",
          "Màu xanh"
        ],
        "correctIndex": 1,
        "explanation": "Hắc sắc là màu đen."
      }
    ],
    "step9_challenge": {
      "title": "Tín đồ thời trang",
      "taskDesc": "Đọc to câu hỏi xin thử một chiếc áo màu đỏ size lớn hơn.",
      "targetPhrase": "wǒ kěyǐ shì yíxià zhè jiàn yīfu ma",
      "xpReward": 50,
      "badge": "Stylist Bản Lĩnh"
    }
  },

  {
    "id": "l-209",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 9,
    "title": "Thanh toán số & Mặc cả (微信支付与打折)",
    "chineseTitle": "移动支付与讨价还价（可以便宜一点儿吗）",
    "subtitle": "Kỹ năng mặc cả (便宜一点儿), giảm giá (打折) và thanh toán qua ví điện tử WeChat Pay/Alipay.",
    "objective": "Mặc cả mua hàng thành công và thanh toán quét mã QR như người bản xứ.",
    "prerequisite": "Đã hoàn thành Bài 208.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và thực hành đàm thoại mặc cả, thanh toán.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Mặc cả",
      "WeChat Pay",
      "Alipay",
      "打折",
      "便宜一点儿"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Thanh toán thời đại số: 扫码支付 (Quét mã trả tiền) & Mặc cả: 可以便宜一点儿吗？",
      "summary": "便宜 (piányi) là rẻ. 便宜一点儿 (rẻ hơn chút nhé). 打折 (dǎzhé) là giảm giá (打八折 nghĩa là giảm 20%, bán với giá 80%). 微信 (WeChat), 支付宝 (Alipay).",
      "audioDemoText": "kěyǐ piányi yìdiǎnr ma, wǒ sǎomǎ fùqián, wēixìn háishì zhīfùbǎo"
    },
    "step2_vocabulary": [
      {
        "id": "v-209-1",
        "hanzi": "便宜",
        "pinyin": "piányi",
        "hanviet": "Tiện nghi",
        "meaning": "Rẻ, giá cả phải chăng",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "太贵了，便宜一点儿吧！",
          "pinyin": "Tài guì le, piányi yìdiǎnr ba!",
          "meaning": "Đắt quá, rẻ một chút đi mà!"
        }
      },
      {
        "id": "v-209-2",
        "hanzi": "打折",
        "pinyin": "dǎzhé",
        "hanviet": "Đả chiết",
        "meaning": "Chiết khấu, giảm giá",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "今天打八折。",
          "pinyin": "Jīntiān dǎ bā zhé.",
          "meaning": "Hôm nay giảm 20% (bán giá 80%)."
        }
      },
      {
        "id": "v-209-3",
        "hanzi": "微信",
        "pinyin": "Wēixìn",
        "hanviet": "Vi tín",
        "meaning": "WeChat (ứng dụng nhắn tin/thanh toán)",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "我用微信付钱。",
          "pinyin": "Wǒ yòng Wēixìn fùqián.",
          "meaning": "Tôi dùng WeChat trả tiền."
        }
      },
      {
        "id": "v-209-4",
        "hanzi": "支付宝",
        "pinyin": "Zhīfùbǎo",
        "hanviet": "Chi phó bảo",
        "meaning": "Alipay (ví điện tử)",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "支持支付宝。",
          "pinyin": "Zhīchí Zhīfùbǎo.",
          "meaning": "Hỗ trợ thanh toán Alipay."
        }
      },
      {
        "id": "v-209-5",
        "hanzi": "扫码",
        "pinyin": "sǎomǎ",
        "hanviet": "Tảo mã",
        "meaning": "Quét mã QR",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "请扫这里。",
          "pinyin": "Qǐng sǎo zhèlǐ.",
          "meaning": "Xin quét ở đây."
        }
      },
      {
        "id": "v-209-6",
        "hanzi": "现金",
        "pinyin": "xiànjīn",
        "hanviet": "Hiện kim",
        "meaning": "Tiền mặt",
        "radical": "王 (Vương)",
        "example": {
          "hanzi": "我有现金。",
          "pinyin": "Wǒ yǒu xiànjīn.",
          "meaning": "Tôi có tiền mặt."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "宜",
        "pinyin": "yi",
        "meaning": "Thích hợp, tiện nghi",
        "strokesCount": 8,
        "strokeOrderText": "Mái nhà (宀) -> Bộ Thả (且)",
        "components": "宀 + 且",
        "mnemonic": "Trong nhà mọi thứ sắp xếp thích hợp tạo sự thuận tiện."
      },
      {
        "hanzi": "信",
        "pinyin": "xìn",
        "meaning": "Tin tưởng, thư từ (trong WeChat 微信)",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Bộ Ngôn (言) bên phải",
        "components": "亻 + 言",
        "mnemonic": "Lời nói của con người (亻 + 言) phải giữ chữ tín."
      }
    ],
    "step4_grammar": {
      "title": "Hiểu đúng cách tính giảm giá '打...折' của người Trung Quốc",
      "formula": "打 X 折 = Giá bán bằng X/10 giá gốc (Ví dụ: 打八折 = Bán 80% giá, tức giảm 20%)",
      "explanation": "Người Việt hay nhầm: Nghe '打八折' tưởng giảm 80%, nhưng thực tế người Trung Quốc tính phần GIỮ LẠI (bán với 8 phần giá gốc).",
      "examples": [
        {
          "hanzi": "一件一百块的衣服，打八折就是八十块。",
          "pinyin": "Yí jiàn yì bǎi kuài de yīfu, dǎ bā zhé jiù shì bāshí kuài.",
          "meaning": "Một chiếc áo 100 tệ, giảm giá 20% (đả bát chiết) thì còn 80 tệ."
        }
      ],
      "commonMistake": {
        "wrong": "Nghĩ 打八折 là giảm 80% ❌",
        "correct": "Đánh giá 8/10, tức là giảm 20% ✔️",
        "explanation": "Cách tính chiết khấu đặc trưng của Trung Quốc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khách",
          "hanzi": "老板，这个一百二十块太贵了，可以便宜一点儿吗？",
          "pinyin": "Lǎobǎn, zhè ge yì bǎi èrshí kuài tài guì le, kěyǐ piányi yìdiǎnr ma?",
          "meaning": "Chủ quán ơi, cái này 120 tệ đắt quá, bớt cho em chút được không?"
        },
        {
          "speaker": "Chủ shop",
          "hanzi": "行，看你是留学生，给你打九折，一百块拿走！你扫码还是付现金？",
          "pinyin": "Xíng, kàn nǐ shì liúxuéshēng, gěi nǐ dǎ jiǔ zhé, yì bǎi kuài ná zǒu! Nǐ sǎomǎ háishì fù xiànjīn?",
          "meaning": "Được rồi, thấy cháu là du học sinh, bớt cho cháu 10% (đả cửu chiết), 100 tệ cầm đi! Cháu quét mã hay trả tiền mặt?"
        }
      ],
      "audioText": "可以便宜一点儿吗？给你打折，一百块拿走！你扫码还是付现金？",
      "question": "Chủ cửa hàng đồng ý bán với giá bao nhiêu?",
      "options": [
        "120 tệ",
        "100 tệ (yì bǎi kuài)",
        "50 tệ",
        "Không bán"
      ],
      "correctIndex": 1,
      "explanation": "Chủ quán đồng ý: 一百块拿走 (100 tệ)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu mặc cả kinh điển:",
      "targetSentence": "老板，可以便宜一点儿吗？",
      "targetPinyin": "Lǎobǎn, kěyǐ piányi yìdiǎnr ma?",
      "targetMeaning": "Chủ quán ơi, có thể bớt chút được không?",
      "hint": "Đọc piányi thanh nhẹ, giọng điệu dễ thương."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi quét mã WeChat trả tiền",
      "words": [
        "付钱",
        "微信",
        "我扫"
      ],
      "correctOrder": [
        "我扫",
        "微信",
        "付钱"
      ],
      "explanation": "我扫 + 微信 + 付钱."
    },
    "step8_quiz": [
      {
        "id": "q-209-1",
        "type": "multiple-choice",
        "question": "Cửa hàng treo biển '打七折' (dǎ qī zhé) nghĩa là khách được:",
        "options": [
          "Giảm 70%",
          "Giảm 30% (bán giá 70% giá gốc)",
          "Mua 7 tặng 1",
          "Miễn phí"
        ],
        "correctIndex": 1,
        "explanation": "Đả thất chiết là bán 70% giá, tức giảm 30%."
      },
      {
        "id": "q-209-2",
        "type": "multiple-choice",
        "question": "Hai ứng dụng quét mã thanh toán phổ biến nhất Trung Quốc là:",
        "options": [
          "Facebook và Google",
          "WeChat (微信) và Alipay (支付宝)",
          "Zalo và Momo",
          "Grab và Shopee"
        ],
        "correctIndex": 1,
        "explanation": "WeChat Pay và Alipay thống trị thanh toán số Trung Quốc."
      }
    ],
    "step9_challenge": {
      "title": "Chinh phục chủ shop",
      "taskDesc": "Đọc trọn vẹn câu: Bác ơi bớt chút đi, cháu quét mã WeChat thanh toán ngay!",
      "targetPhrase": "lǎobǎn kěyǐ piányi yìdiǎnr ma wǒ sǎomǎ",
      "xpReward": 50,
      "badge": "Bậc Thầy Mặc Cả"
    }
  },

  {
    "id": "l-210",
    "chapterId": "ch-6",
    "levelId": "lvl-2",
    "lessonNumber": 10,
    "title": "Ôn tập Module 2.2 & Thử thách đi chợ đêm mua sắm",
    "chineseTitle": "模块2.2总复习与夜市购物实战",
    "subtitle": "Tổng hợp đối thoại ăn uống, mặc cả, thanh toán quét mã tại khu chợ đêm sầm uất.",
    "objective": "Làm chủ trọn vẹn kỹ năng giao tiếp sinh hoạt ẩm thực và mua sắm trước khi đấu Boss Chapter 6.",
    "prerequisite": "Đã hoàn thành Bài 206–209.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 2.2.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng kết Module",
      "Chợ đêm",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Hội thoại thực chiến tại Chợ đêm Vương Phủ Tỉnh (王府井夜市)",
      "summary": "1. Mua đồ ăn vặt: 来一份... (Cho một phần...). 2. Thử trang phục lưu niệm: 这件多少钱，可以试吗？. 3. Mặc cả & Quét mã: 便宜点，我扫码.",
      "audioDemoText": "wángfǔjǐng yèshì hěn rènao, yǒushíhou yào dǎzhé"
    },
    "step2_vocabulary": [
      {
        "id": "v-210-1",
        "hanzi": "夜市",
        "pinyin": "yèshì",
        "hanviet": "Dạ thị",
        "meaning": "Chợ đêm",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "逛夜市。",
          "pinyin": "Guàng yèshì.",
          "meaning": "Dạo chợ đêm."
        }
      },
      {
        "id": "v-210-2",
        "hanzi": "热闹",
        "pinyin": "rènao",
        "hanviet": "Nhiệt náo",
        "meaning": "Náo nhiệt, sôi động",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "这里真热闹！",
          "pinyin": "Zhèlǐ zhēn rènao!",
          "meaning": "Ở đây náo nhiệt thật!"
        }
      },
      {
        "id": "v-210-3",
        "hanzi": "一共",
        "pinyin": "yígòng",
        "hanviet": "Nhất cộng",
        "meaning": "Tổng cộng",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "一共五十块。",
          "pinyin": "Yígòng wǔshí kuài.",
          "meaning": "Tổng cộng 50 tệ."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "共",
        "pinyin": "gòng",
        "meaning": "Chung, tổng cộng",
        "strokesCount": 6,
        "strokeOrderText": "Ngang trên -> Sổ -> Sổ -> Ngang dưới -> Phẩy -> Chấm",
        "components": "艹 + 八",
        "mnemonic": "Hai bàn tay cùng chung tay góp sức lại."
      }
    ],
    "step4_grammar": {
      "title": "Hỏi tổng số tiền với 一共 (yígòng)",
      "formula": "一共 + Số tiền + 块 (Ví dụ: 一共八十块)",
      "explanation": "Dùng 一共 khi tính tổng chi phí nhiều món hàng mua cùng một lúc.",
      "examples": [
        {
          "hanzi": "两个一共多少钱？ 一共六十块。",
          "pinyin": "Liǎng gè yígòng duōshao qián? Yígòng liùshí kuài.",
          "meaning": "Hai cái tổng cộng bao nhiêu tiền? Tổng cộng 60 tệ."
        }
      ],
      "commonMistake": {
        "wrong": "共一 ❌",
        "correct": "一共 ✔️",
        "explanation": "Thứ tự từ là 一共."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "老板，一碗炸酱面和一杯奶茶，一共多少钱？",
          "pinyin": "Lǎobǎn, yì wǎn zhájiàngmiàn hé yì bēi nǎichá, yígòng duōshao qián?",
          "meaning": "Chủ quán ơi, một bát mì tương đen và một ly trà sữa tổng cộng bao nhiêu tiền ạ?"
        },
        {
          "speaker": "B",
          "hanzi": "面二十五，奶茶十五，一共四十块。",
          "pinyin": "Miàn èrshíwǔ, nǎichá shíwǔ, yígòng sìshí kuài.",
          "meaning": "Mì 25, trà sữa 15, tổng cộng 40 tệ nhé."
        }
      ],
      "audioText": "一共多少钱？一共四十块。",
      "question": "Tổng cộng số tiền của hai món là bao nhiêu?",
      "options": [
        "25 tệ",
        "30 tệ",
        "40 tệ (sìshí kuài)",
        "50 tệ"
      ],
      "correctIndex": 2,
      "explanation": "Chủ quán nói: 一共四十块 (40 tệ)."
    },
    "step6_speaking": {
      "prompt": "Hỏi tổng số tiền mua sắm:",
      "targetSentence": "这两个一共多少钱？",
      "targetPinyin": "Zhè liǎng gè yígòng duōshao qián?",
      "targetMeaning": "Hai cái này tổng cộng bao nhiêu tiền?",
      "hint": "Đọc yígòng rõ ràng thanh 2 và 4."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tổng cộng năm mươi tệ",
      "words": [
        "五十块",
        "一共"
      ],
      "correctOrder": [
        "一共",
        "五十块"
      ],
      "explanation": "一共 + 五十块."
    },
    "step8_quiz": [
      {
        "id": "q-210-1",
        "type": "multiple-choice",
        "question": "Từ '一共' (yígòng) mang nghĩa là gì?",
        "options": [
          "Từng cái một",
          "Tổng cộng",
          "Đắt nhất",
          "Rẻ nhất"
        ],
        "correctIndex": 1,
        "explanation": "一共 là tổng cộng."
      },
      {
        "id": "q-210-2",
        "type": "multiple-choice",
        "question": "Muốn nói 'Tôi quét mã trả tiền', bạn nói:",
        "options": [
          "我付现金",
          "我扫码付钱",
          "我不给钱",
          "你扫我"
        ],
        "correctIndex": 1,
        "explanation": "我扫码付钱 = Tôi quét mã trả tiền."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 6",
      "taskDesc": "Vượt qua thử thách chợ đêm để chuẩn bị so tài mua sắm với Boss!",
      "targetPhrase": "zhè liǎng gè yígòng duōshao qián wǒ sǎomǎ",
      "xpReward": 60,
      "badge": "Chiến Thần Chợ Đêm"
    }
  },

  {
    "id": "l-211",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 11,
    "title": "Bốn mùa & Hiện tượng thời tiết (刮风, 下雪, 晴天)",
    "chineseTitle": "四季气候与天气现象（春夏秋冬）",
    "subtitle": "4 mùa trong năm (xuân, hạ, thu, đông) và các hiện tượng thời tiết gió, mưa tuyết, trời quang.",
    "objective": "Miêu tả được khí hậu các mùa trong năm và các hiện tượng thời tiết quen thuộc.",
    "prerequisite": "Đã hoàn thành Module 2.2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu miêu tả thời tiết 4 mùa.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Thời tiết",
      "Bốn mùa",
      "下雪",
      "晴天"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "4 Mùa: 春 (chūn - xuân), 夏 (xià - hạ), 秋 (qiū - thu), 冬 (dōng - đông)",
      "summary": "Hiện tượng thời tiết phong phú: 晴天 (qíngtiān - trời nắng ráo), 阴天 (yīntiān - trời râm u ám), 刮风 (guāfēng - gió thổi), 下雪 (xiàxuě - tuyết rơi).",
      "audioDemoText": "chūn xià qiū dōng, jīntiān shì qíngtiān, běijīng dōngtiān huì xiàxuě"
    },
    "step2_vocabulary": [
      {
        "id": "v-211-1",
        "hanzi": "晴天",
        "pinyin": "qíngtiān",
        "hanviet": "Tình thiên",
        "meaning": "Trời nắng, trời quang",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "今天是晴天。",
          "pinyin": "Jīntiān shì qíngtiān.",
          "meaning": "Hôm nay trời nắng ráo."
        }
      },
      {
        "id": "v-211-2",
        "hanzi": "阴天",
        "pinyin": "yīntiān",
        "hanviet": " m thiên",
        "meaning": "Trời âm u, trời râm",
        "radical": "阝 (Phụ)",
        "example": {
          "hanzi": "阴天要带伞。",
          "pinyin": "Yīntiān yào dài sǎn.",
          "meaning": "Trời râm nhớ mang ô."
        }
      },
      {
        "id": "v-211-3",
        "hanzi": "下雪",
        "pinyin": "xià xuě",
        "hanviet": "Hạ tuyết",
        "meaning": "Tuyết rơi",
        "radical": "雨 (Vũ)",
        "example": {
          "hanzi": "外面下雪了。",
          "pinyin": "Wàimiàn xià xuě le.",
          "meaning": "Bên ngoài tuyết rơi rồi."
        }
      },
      {
        "id": "v-211-4",
        "hanzi": "刮风",
        "pinyin": "guā fēng",
        "hanviet": "Quát phong",
        "meaning": "Gió thổi, có gió",
        "radical": "舌 (Thiệt)",
        "example": {
          "hanzi": "刮大风。",
          "pinyin": "Guā dà fēng.",
          "meaning": "Gió thổi lớn."
        }
      },
      {
        "id": "v-211-5",
        "hanzi": "春天",
        "pinyin": "chūntiān",
        "hanviet": "Xuân thiên",
        "meaning": "Mùa xuân",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "春天很暖和。",
          "pinyin": "Chūntiān hěn nuǎnhuo.",
          "meaning": "Mùa xuân rất ấm áp."
        }
      },
      {
        "id": "v-211-6",
        "hanzi": "冬天",
        "pinyin": "dōngtiān",
        "hanviet": "Đông thiên",
        "meaning": "Mùa đông",
        "radical": "夂 (Tri)",
        "example": {
          "hanzi": "冬天很冷。",
          "pinyin": "Dōngtiān hěn lěng.",
          "meaning": "Mùa đông rất lạnh."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "晴",
        "pinyin": "qíng",
        "meaning": "Trời quang mây tạnh",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Nhật (日) bên trái -> Chữ Thanh (青) bên phải",
        "components": "日 + 青",
        "mnemonic": "Mặt trời (Nhật) soi rọi trời xanh (Thanh) trong trẻo."
      },
      {
        "hanzi": "雪",
        "pinyin": "xuě",
        "meaning": "Tuyết trắng",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Vũ (雨) ở trên -> Bộ Ký (彐) ở dưới",
        "components": "雨 + 彐",
        "mnemonic": "Mưa rơi (Vũ) trong giá lạnh tích tụ thành tuyết trắng."
      }
    ],
    "step4_grammar": {
      "title": "Cách diễn đạt hiện tượng thời tiết đang xảy ra",
      "formula": "外面 + 下雪了 / 刮风了 / 下雨了",
      "explanation": "Thêm trợ từ 了 ở cuối cụm từ để báo hiệu sự thay đổi của thời tiết (đã bắt đầu có tuyết rơi hoặc nổi gió).",
      "examples": [
        {
          "hanzi": "外面刮风了，穿多一点儿衣服吧！",
          "pinyin": "Wàimiàn guā fēng le, chuān duō yìdiǎnr yīfu ba!",
          "meaning": "Bên ngoài nổi gió rồi, mặc nhiều quần áo một chút đi!"
        }
      ],
      "commonMistake": {
        "wrong": "风刮 ❌",
        "correct": "刮风 ✔️",
        "explanation": "Động từ 刮 đứng trước danh từ 风."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天北京天气怎么样？",
          "pinyin": "Jīntiān Běijīng tiānqì zěnmeyàng?",
          "meaning": "Hôm nay thời tiết Bắc Kinh thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "今天阴天，外面刮风了，下午可能会下雪。",
          "pinyin": "Jīntiān yīntiān, wàimiàn guā fēng le, xiàwǔ kěnéng huì xià xuě.",
          "meaning": "Hôm nay trời âm u, bên ngoài nổi gió rồi, buổi chiều có thể sẽ có tuyết rơi đấy."
        }
      ],
      "audioText": "今天阴天，外面刮风了，下午可能会下雪。",
      "question": "Buổi chiều dự báo có thể xảy ra hiện tượng gì?",
      "options": [
        "Nắng to",
        "Trời có thể sẽ có tuyết rơi (xià xuě)",
        "Mưa đá",
        "Trời ấm áp"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 下午可能会下雪."
    },
    "step6_speaking": {
      "prompt": "Nói bên ngoài đang có gió thổi:",
      "targetSentence": "外面刮风了。",
      "targetPinyin": "Wàimiàn guā fēng le.",
      "targetMeaning": "Bên ngoài gió thổi rồi.",
      "hint": "Đọc guā fēng thanh 1 rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Hôm nay là trời nắng",
      "words": [
        "晴天",
        "今天",
        "是"
      ],
      "correctOrder": [
        "今天",
        "是",
        "晴天"
      ],
      "explanation": "今天 + 是 + 晴天."
    },
    "step8_quiz": [
      {
        "id": "q-211-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Tuyết rơi'?",
        "options": [
          "下雨 (xià yǔ)",
          "下雪 (xià xuě)",
          "刮风 (guā fēng)",
          "阴天 (yīntiān)"
        ],
        "correctIndex": 1,
        "explanation": "下雪 là tuyết rơi."
      },
      {
        "id": "q-211-2",
        "type": "multiple-choice",
        "question": "Mùa xuân trong tiếng Trung là gì?",
        "options": [
          "春天 (chūntiān)",
          "夏天 (xiàtiān)",
          "秋天 (qiūtiān)",
          "冬天 (dōngtiān)"
        ],
        "correctIndex": 0,
        "explanation": "Mùa xuân là 春天."
      }
    ],
    "step9_challenge": {
      "title": "Thời tiết 4 phương",
      "taskDesc": "Đọc to câu miêu tả thời tiết mùa đông Bắc Kinh có tuyết rơi rất lạnh.",
      "targetPhrase": "běijīng dōngtiān hěn lěng huì xiàxuě",
      "xpReward": 50,
      "badge": "Sứ Giả Bốn Mùa"
    }
  },

  {
    "id": "l-212",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 12,
    "title": "Câu so sánh hơn với chữ 比 (A 比 B + Tính từ)",
    "chineseTitle": "比较句与介词“比”（今天比昨天冷）",
    "subtitle": "Ngữ pháp trọng điểm bậc nhất HSK 2: Cấu trúc so sánh hơn với chữ 比 và dạng phủ định 没有.",
    "objective": "Sử dụng thành thạo câu chữ 比 để so sánh hai người hoặc hai sự vật hiện tượng.",
    "prerequisite": "Đã hoàn thành Bài 211.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đặt được 2 câu so sánh đúng cú pháp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Câu chữ 比",
      "So sánh hơn",
      "Ngữ pháp trọng điểm"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức câu so sánh hơn: A + 比 (bǐ) + B + Tính từ",
      "summary": "Tiếng Trung so sánh hơn: A 比 B + Tính từ (今天比昨天冷 - Hôm nay lạnh hơn hôm qua). Phủ định so sánh: A 没有 B + Tính từ (A không bằng B: 昨天没有今天冷).",
      "audioDemoText": "jīntiān bǐ zuótiān lěng, gēge bǐ wǒ gāo, tā méiyǒu wǒ dà"
    },
    "step2_vocabulary": [
      {
        "id": "v-212-1",
        "hanzi": "比",
        "pinyin": "bǐ",
        "hanviet": "Tỷ",
        "meaning": "So với, hơn",
        "radical": "比 (Tỷ)",
        "example": {
          "hanzi": "他比我大两岁。",
          "pinyin": "Tā bǐ wǒ dà liǎng suì.",
          "meaning": "Anh ấy lớn hơn tôi 2 tuổi."
        }
      },
      {
        "id": "v-212-2",
        "hanzi": "高",
        "pinyin": "gāo",
        "hanviet": "Cao",
        "meaning": "Cao",
        "radical": "高 (Cao)",
        "example": {
          "hanzi": "姚明很高。",
          "pinyin": "Yáo Míng hěn gāo.",
          "meaning": "Diêu Minh rất cao."
        }
      },
      {
        "id": "v-212-3",
        "hanzi": "矮",
        "pinyin": "ǎi",
        "hanviet": "Ải",
        "meaning": "Thấp, lùn",
        "radical": "矢 (Thỉ)",
        "example": {
          "hanzi": "弟弟比我矮。",
          "pinyin": "Dìdi bǐ wǒ ǎi.",
          "meaning": "Em trai thấp hơn tôi."
        }
      },
      {
        "id": "v-212-4",
        "hanzi": "长",
        "pinyin": "cháng",
        "hanviet": "Trường",
        "meaning": "Dài",
        "radical": "长 (Trường)",
        "example": {
          "hanzi": "这件衣服比较长。",
          "pinyin": "Zhè jiàn yīfu bǐjiào cháng.",
          "meaning": "Chiếc áo này tương đối dài."
        }
      },
      {
        "id": "v-212-5",
        "hanzi": "短",
        "pinyin": "duǎn",
        "hanviet": "Đoản",
        "meaning": "Ngắn",
        "radical": "矢 (Thỉ)",
        "example": {
          "hanzi": "头发很短。",
          "pinyin": "Tóufa hěn duǎn.",
          "meaning": "Tóc rất ngắn."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "比",
        "pinyin": "bǐ",
        "meaning": "So sánh, hơn kém",
        "strokesCount": 4,
        "strokeOrderText": "Ngang -> Sổ ngắn -> Phẩy -> Sổ cong móc",
        "components": "Bộ Tỷ (比)",
        "mnemonic": "Hình tượng hai người đứng cạnh nhau để so đọ chiều cao."
      },
      {
        "hanzi": "高",
        "pinyin": "gāo",
        "meaning": "To lớn, cao ráo",
        "strokesCount": 10,
        "strokeOrderText": "Chấm -> Ngang -> Khẩu -> Quynh -> Khẩu",
        "components": "Bộ Cao (高)",
        "mnemonic": "Hình ảnh tòa tháp cao vút tầng tầng lớp lớp hướng lên trời."
      }
    ],
    "step4_grammar": {
      "title": "Quy tắc vàng: Tuyệt đối KHÔNG dùng 很 trong câu chữ 比",
      "formula": "A + 比 + B + Tính từ (KHÔNG DÙNG: A 比 B 很 + Tính từ ❌)",
      "explanation": "Trong câu chữ 比, sự so sánh đã thể hiện tính chênh lệch. Dùng thêm 很 sẽ bị coi là lỗi ngữ pháp nghiêm trọng.",
      "examples": [
        {
          "hanzi": "今天比昨天冷。（ĐÚNG）  /  今天比昨天很冷。（SAI ❌）",
          "pinyin": "Jīntiān bǐ zuótiān lěng.",
          "meaning": "Hôm nay lạnh hơn hôm qua."
        }
      ],
      "commonMistake": {
        "wrong": "他比我很高 ❌",
        "correct": "他比我高 ✔️",
        "explanation": "Trong câu chữ 比 tuyệt đối không cho 很 đứng trước tính từ."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天天气怎么样？冷不冷？",
          "pinyin": "Jīntiān tiānqì zěnmeyàng? Lěng bu lěng?",
          "meaning": "Thời tiết hôm nay thế nào? Lạnh không?"
        },
        {
          "speaker": "B",
          "hanzi": "今天比昨天冷多了，你出门多穿点儿。",
          "pinyin": "Jīntiān bǐ zuótiān lěng duō le, nǐ chūmén duō chuān diǎnr.",
          "meaning": "Hôm nay lạnh hơn hôm qua nhiều lắm, bạn ra ngoài nhớ mặc nhiều áo vào."
        }
      ],
      "audioText": "今天比昨天冷多了，你出门多穿点儿。",
      "question": "So sánh thời tiết hôm nay và hôm qua như thế nào?",
      "options": [
        "Hôm nay ấm hơn hôm qua",
        "Hôm nay lạnh hơn hôm qua nhiều (bǐ zuótiān lěng duō le)",
        "Hai ngày như nhau",
        "Hôm qua lạnh hơn"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 今天比昨天冷多了."
    },
    "step6_speaking": {
      "prompt": "Đọc câu so sánh: Hôm nay lạnh hơn hôm qua:",
      "targetSentence": "今天比昨天冷。",
      "targetPinyin": "Jīntiān bǐ zuótiān lěng.",
      "targetMeaning": "Hôm nay lạnh hơn hôm qua.",
      "hint": "Đọc mượt mà bǐ zuótiān lěng, không thêm 很."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh trai cao hơn tôi",
      "words": [
        "我",
        "高",
        "哥哥",
        "比"
      ],
      "correctOrder": [
        "哥哥",
        "比",
        "我",
        "高"
      ],
      "explanation": "哥哥 + 比 + 我 + 高."
    },
    "step8_quiz": [
      {
        "id": "q-212-1",
        "type": "multiple-choice",
        "question": "Câu so sánh nào sau đây đúng ngữ pháp?",
        "options": [
          "他比我很高",
          "他比我高",
          "高他比我",
          "他我比高"
        ],
        "correctIndex": 1,
        "explanation": "Không dùng 很 trong câu chữ 比: 他比我高."
      },
      {
        "id": "q-212-2",
        "type": "multiple-choice",
        "question": "Dạng phủ định của 'Hôm nay lạnh hơn hôm qua' là:",
        "options": [
          "今天不比昨天冷",
          "今天没有昨天冷",
          "今天比昨天没冷",
          "今天冷没有昨天"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định so sánh dùng 没有: 今天没有昨天冷 (Hôm nay không lạnh bằng hôm qua)."
      }
    ],
    "step9_challenge": {
      "title": "Nhà so sánh cừ khôi",
      "taskDesc": "Đọc to câu so sánh chiều cao hoặc tuổi tác của bạn với một người bạn.",
      "targetPhrase": "tā bǐ wǒ gāo wǒ bǐ tā dà",
      "xpReward": 50,
      "badge": "Bậc Thầy So Sánh"
    }
  },

  {
    "id": "l-213",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 13,
    "title": "So sánh mức độ nâng cao với 更, 最 (Càng & Nhất)",
    "chineseTitle": "程度副词“更”与“最”（更漂亮、最好）",
    "subtitle": "Biểu thị mức độ cao hơn nữa với 更 (gèng - càng) và mức độ tuyệt đối với 最 (zuì - nhất).",
    "objective": "Sử dụng 更 và 最 để diễn tả mức độ tăng tiến và sở thích nhất trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 212.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng 更 và 最.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "So sánh bậc nhất",
      "更",
      "最",
      "Càng",
      "Nhất"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Phó từ mức độ: 更 (gèng - Càng hơn nữa) & 最 (zuì - Nhất, tuyệt đối)",
      "summary": "更 đứng trước tính từ để biểu đạt mức độ vượt trội hơn nữa (这件更漂亮 - Cái này càng đẹp hơn). 最 đứng trước tính từ/tâm lý để biểu đạt nhất (最好 - Tốt nhất, 最喜欢 - Thích nhất).",
      "audioDemoText": "zhè jiàn gèng piàoliang, wǒ zuì xǐhuan chī běijīng kǎoyā"
    },
    "step2_vocabulary": [
      {
        "id": "v-213-1",
        "hanzi": "更",
        "pinyin": "gèng",
        "hanviet": "Canh",
        "meaning": "Càng, hơn nữa",
        "radical": "曰 (Viết)",
        "example": {
          "hanzi": "明天会更冷。",
          "pinyin": "Míngtiān huì gèng lěng.",
          "meaning": "Ngày mai sẽ càng lạnh hơn."
        }
      },
      {
        "id": "v-213-2",
        "hanzi": "最",
        "pinyin": "zuì",
        "hanviet": "Tối",
        "meaning": "Nhất",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我最喜欢你。",
          "pinyin": "Wǒ zuì xǐhuan nǐ.",
          "meaning": "Tôi thích bạn nhất."
        }
      },
      {
        "id": "v-213-3",
        "hanzi": "好",
        "pinyin": "hǎo",
        "hanviet": "Hảo",
        "meaning": "Tốt",
        "radical": "女 (Nữ)",
        "example": {
          "hanzi": "最好的朋友。",
          "pinyin": "Zuì hǎo de péngyou.",
          "meaning": "Người bạn tốt nhất."
        }
      },
      {
        "id": "v-213-4",
        "hanzi": "漂亮",
        "pinyin": "piàoliang",
        "hanviet": "Phiêu lượng",
        "meaning": "Xinh đẹp, đẹp đẽ",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "她真漂亮！",
          "pinyin": "Tā zhēn piàoliang!",
          "meaning": "Cô ấy thật là xinh đẹp!"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "更",
        "pinyin": "gèng",
        "meaning": "Càng, thay đổi",
        "strokesCount": 7,
        "strokeOrderText": "Ngang -> Nhật (日) -> Phẩy dài -> Mác",
        "components": "一 + 日 + 乂",
        "mnemonic": "Mỗi ngày mới trôi qua sự việc càng thêm tiến triển."
      },
      {
        "hanzi": "最",
        "pinyin": "zuì",
        "meaning": "Tối, đứng đầu, nhất",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Nhật (日) ở trên -> Chữ Thủ (取) ở dưới",
        "components": "日 + 耳 + 又",
        "mnemonic": "Dưới ánh mặt trời, lấy được phần thưởng cao nhất đứng đầu."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của phó từ 更 và 最 trong câu",
      "formula": "Chủ ngữ + 更 / 最 + Tính từ / Động từ chỉ cảm xúc (喜欢, 想)",
      "explanation": "Khác với tiếng Việt (Đẹp nhất -> Tiếng Trung: 最漂亮 = Nhất đẹp; Thích nhất -> 最喜欢 = Nhất thích). Phó từ luôn đứng trước từ nó bổ nghĩa.",
      "examples": [
        {
          "hanzi": "在所有中国菜里，我最喜欢吃饺子。",
          "pinyin": "Zài suǒyǒu Zhōngguó cài lǐ, wǒ zuì xǐhuan chī jiǎozi.",
          "meaning": "Trong tất cả các món ăn Trung Quốc, tôi thích ăn sủi cảo nhất."
        }
      ],
      "commonMistake": {
        "wrong": "我喜欢最饺子 ❌",
        "correct": "我最喜欢饺子 ✔️",
        "explanation": "最 luôn đứng trước động từ/tính từ."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你觉得这件衣服怎么样？",
          "pinyin": "Nǐ juéde zhè jiàn yīfu zěnmeyàng?",
          "meaning": "Bạn thấy chiếc áo này thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "这件很好看，但那件红色的更漂亮，而且价格最便宜！",
          "pinyin": "Zhè jiàn hěn hǎokàn, dàn nà jiàn hóngsè de gèng piàoliang, érqiě jiàgé zuì piányi!",
          "meaning": "Chiếc này rất đẹp, nhưng chiếc màu đỏ kia càng đẹp hơn, vả lại giá còn rẻ nhất nữa!"
        }
      ],
      "audioText": "那件红色的更漂亮，而且价格最便宜！",
      "question": "Chiếc áo màu đỏ có đặc điểm gì?",
      "options": [
        "Đắt nhất",
        "Càng đẹp hơn và giá rẻ nhất (gèng piàoliang, zuì piányi)",
        "Xấu hơn",
        "Hơi nhỏ"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 更漂亮，价格最便宜."
    },
    "step6_speaking": {
      "prompt": "Nói món ăn bạn thích nhất:",
      "targetSentence": "我最喜欢中国菜。",
      "targetPinyin": "Wǒ zuì xǐhuan Zhōngguó cài.",
      "targetMeaning": "Tôi thích nhất món ăn Trung Quốc.",
      "hint": "Đọc zuì xǐhuan liền mạch."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Ngày mai sẽ càng lạnh hơn",
      "words": [
        "会更冷",
        "明天"
      ],
      "correctOrder": [
        "明天",
        "会更冷"
      ],
      "explanation": "明天 + 会更冷."
    },
    "step8_quiz": [
      {
        "id": "q-213-1",
        "type": "multiple-choice",
        "question": "Cách nói 'Người bạn tốt nhất' trong tiếng Trung là:",
        "options": [
          "朋友最好",
          "最好的朋友 (zuì hǎo de péngyou)",
          "最好朋友",
          "更朋友好"
        ],
        "correctIndex": 1,
        "explanation": "Định ngữ đứng trước: 最好的朋友."
      },
      {
        "id": "q-213-2",
        "type": "multiple-choice",
        "question": "Từ '更' (gèng) mang ý nghĩa là gì?",
        "options": [
          "Kém hơn",
          "Càng / Hơn nữa",
          "Bằng nhau",
          "Không thích"
        ],
        "correctIndex": 1,
        "explanation": "更 mang nghĩa là càng, hơn nữa."
      }
    ],
    "step9_challenge": {
      "title": "Khẳng định ngôi vị số một",
      "taskDesc": "Đọc to câu: 'Đây là điều tôi yêu thích nhất trong cuộc sống'.",
      "targetPhrase": "zhè shì wǒ zuì xǐhuan de",
      "xpReward": 50,
      "badge": "Bậc Thầy Tối Thượng"
    }
  },

  {
    "id": "l-214",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 14,
    "title": "Sức khỏe & Đi khám bệnh (生病, 感冒, 发烧, 吃药)",
    "chineseTitle": "身体健康与医院看病（感冒发烧与吃药）",
    "subtitle": "Khai báo triệu chứng sức khỏe với bác sĩ: ốm (生病), cảm cúm (感冒), sốt (发烧), uống thuốc (吃药).",
    "objective": "Trình bày được tình trạng sức khỏe không khỏe và hiểu lời dặn uống thuốc của bác sĩ.",
    "prerequisite": "Đã hoàn thành Bài 213.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các triệu chứng bệnh thường gặp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Sức khỏe",
      "Bệnh viện",
      "感冒",
      "发烧",
      "吃药"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Miêu tả sức khỏe: 身体 (shēntǐ - cơ thể/sức khỏe), 生病 (shēngbìng - bị ốm)",
      "summary": "Triệu chứng thông thường: 感冒 (gǎnmào - cảm cúm), 发烧 (fāshāo - phát sốt), 头疼 (tóuténg - đau đầu). Giải pháp y tế: 看医生 (khám bác sĩ), 吃药 (uống thuốc - chú ý tiếng Trung dùng động từ 吃 cho thuốc).",
      "audioDemoText": "wǒ shēntǐ bú shūfu, wǒ fāshāo le, yīsheng ràng wǒ chī yào"
    },
    "step2_vocabulary": [
      {
        "id": "v-214-1",
        "hanzi": "身体",
        "pinyin": "shēntǐ",
        "hanviet": "Thân thể",
        "meaning": "Cơ thể, sức khỏe",
        "radical": "身 (Thân)",
        "example": {
          "hanzi": "身体健康。",
          "pinyin": "Shēntǐ jiànkāng.",
          "meaning": "Sức khỏe dồi dào."
        }
      },
      {
        "id": "v-214-2",
        "hanzi": "生病",
        "pinyin": "shēngbìng",
        "hanviet": "Sinh bệnh",
        "meaning": "Bị ốm, mắc bệnh",
        "radical": "疒 (Nạch)",
        "example": {
          "hanzi": "他生病住院了。",
          "pinyin": "Tā shēngbìng zhùyuàn le.",
          "meaning": "Anh ấy ốm phải nhập viện rồi."
        }
      },
      {
        "id": "v-214-3",
        "hanzi": "感冒",
        "pinyin": "gǎnmào",
        "hanviet": "Cảm mạo",
        "meaning": "Cảm cúm",
        "radical": "心 (Tâm)",
        "example": {
          "hanzi": "我感冒了。",
          "pinyin": "Wǒ gǎnmào le.",
          "meaning": "Tôi bị cảm cúm rồi."
        }
      },
      {
        "id": "v-214-4",
        "hanzi": "发烧",
        "pinyin": "fāshāo",
        "hanviet": "Phát thiêu",
        "meaning": "Sốt, phát sốt",
        "radical": "火 (Hỏa)",
        "example": {
          "hanzi": "三十八度，发烧了。",
          "pinyin": "Sānshíbā dù, fāshāo le.",
          "meaning": "38 độ, sốt rồi."
        }
      },
      {
        "id": "v-214-5",
        "hanzi": "药",
        "pinyin": "yào",
        "hanviet": "Dược",
        "meaning": "Thuốc",
        "radical": "艹 (Thảo)",
        "example": {
          "hanzi": "记得按时吃药。",
          "pinyin": "Jìde ànshí chī yào.",
          "meaning": "Nhớ uống thuốc đúng giờ."
        }
      },
      {
        "id": "v-214-6",
        "hanzi": "舒服",
        "pinyin": "shūfu",
        "hanviet": "Thư phục",
        "meaning": "Dễ chịu, thoải mái",
        "radical": "矢 (Thỉ)",
        "example": {
          "hanzi": "我不舒服。",
          "pinyin": "Wǒ bù shūfu.",
          "meaning": "Tôi thấy không được khỏe."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "病",
        "pinyin": "bìng",
        "meaning": "Bệnh tật, ốm đau",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Nạch (疒) bao ngoài -> Chữ Bính (丙) bên trong",
        "components": "疒 + 丙",
        "mnemonic": "Người nằm trên giường bệnh (bộ Nạch 疒) đang bị ốm đau."
      },
      {
        "hanzi": "药",
        "pinyin": "yào",
        "meaning": "Thuốc men (Dược)",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thảo (艹) ở trên -> Chữ Ước (约) ở dưới",
        "components": "艹 + 约",
        "mnemonic": "Cây cỏ thảo mộc (艹) hẹn ước giúp chữa lành bệnh tật."
      }
    ],
    "step4_grammar": {
      "title": "Cảnh báo dùng từ: Người Trung Quốc nói 'ĂN THUỐC' (吃药), không nói 喝药",
      "formula": "吃药 (chī yào - Uống thuốc viên/thuốc tây nói chung)",
      "explanation": "Trong tiếng Việt ta nói 'uống thuốc', nhưng trong tiếng Trung tiêu chuẩn bắt buộc dùng động từ 吃 (chī yào). Chỉ khi thuốc là thuốc nước bắc đun sôi người ta mới dùng 喝中药.",
      "examples": [
        {
          "hanzi": "医生说一天吃三次药。",
          "pinyin": "Yīshēng shuō yì tiān chī sān cì yào.",
          "meaning": "Bác sĩ nói mỗi ngày uống thuốc 3 lần."
        }
      ],
      "commonMistake": {
        "wrong": "喝药 ❌ (nghe giống uống thuốc độc)",
        "correct": "吃药 ✔️",
        "explanation": "Thuốc tây viên uống luôn dùng 吃药."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Bác sĩ",
          "hanzi": "你哪里不舒服？",
          "pinyin": "Nǐ nǎlǐ bù shūfu?",
          "meaning": "Cháu thấy không khỏe ở chỗ nào?"
        },
        {
          "speaker": "Bệnh nhân",
          "hanzi": "医生，我头疼，昨天晚上发烧三十八度五，好像感冒了。",
          "pinyin": "Yīshēng, wǒ tóuténg, zuótiān wǎnshang fāshāo sānshíbā dù wǔ, hǎoxiàng gǎnmào le.",
          "meaning": "Bác sĩ ơi, cháu bị đau đầu, tối qua sốt 38.5 độ, hình như bị cảm cúm rồi ạ."
        }
      ],
      "audioText": "我头疼，昨天晚上发烧三十八度五，好像感冒了。",
      "question": "Bệnh nhân gặp phải những triệu chứng gì?",
      "options": [
        "Đau chân",
        "Đau đầu và sốt 38.5 độ (tóuténg, fāshāo)",
        "Đau bụng do ăn no",
        "Không bị làm sao"
      ],
      "correctIndex": 1,
      "explanation": "Bệnh nhân nói: 头疼，发烧三十八度五."
    },
    "step6_speaking": {
      "prompt": "Nói tình trạng bạn bị cảm sốt với bác sĩ:",
      "targetSentence": "我感冒发烧了。",
      "targetPinyin": "Wǒ gǎnmào fāshāo le.",
      "targetMeaning": "Tôi bị cảm sốt rồi.",
      "hint": "Đọc gǎnmào thanh 3 và 4, fāshāo thanh 1."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nhớ uống thuốc đúng giờ",
      "words": [
        "吃药",
        "按时",
        "记得"
      ],
      "correctOrder": [
        "记得",
        "按时",
        "吃药"
      ],
      "explanation": "记得 + 按时 + 吃药."
    },
    "step8_quiz": [
      {
        "id": "q-214-1",
        "type": "multiple-choice",
        "question": "Từ tiếng Trung chuẩn xác để nói 'uống thuốc' là:",
        "options": [
          "喝药",
          "吃药 (chī yào)",
          "买药",
          "看药"
        ],
        "correctIndex": 1,
        "explanation": "Tiếng Trung dùng động từ 吃 cho thuốc: 吃药."
      },
      {
        "id": "q-214-2",
        "type": "multiple-choice",
        "question": "Cụm '不舒服' (bù shūfu) dùng để biểu thị:",
        "options": [
          "Rất khỏe mạnh",
          "Không thoải mái / Trong người không khỏe",
          "Rất vui vẻ",
          "Rất đói bụng"
        ],
        "correctIndex": 1,
        "explanation": "Không khỏe trong người là 不舒服."
      }
    ],
    "step9_challenge": {
      "title": "Bệnh án tự thuật",
      "taskDesc": "Đọc to câu miêu tả: 'Hôm nay tôi thấy không được khỏe, bị cảm sốt nên phải đi khám bác sĩ'.",
      "targetPhrase": "wǒ jīntiān bù shūfu gǎnmào fāshāo le",
      "xpReward": 50,
      "badge": "Tự Chăm Sóc Bản Thân"
    }
  },

  {
    "id": "l-215",
    "chapterId": "ch-7",
    "levelId": "lvl-2",
    "lessonNumber": 15,
    "title": "Xin nghỉ phép & Lời khuyên ân cần (请假, 休息, 多喝水)",
    "chineseTitle": "请假条与健康叮嘱（请假与多喝水）",
    "subtitle": "Kỹ năng xin nghỉ học/nghỉ làm với 请假 (qǐngjià), lời khuyên nghỉ ngơi (休息) và uống nhiều nước ấm.",
    "objective": "Viết được tin nhắn hoặc nói lời xin phép nghỉ ốm lịch sự với giáo viên/sếp.",
    "prerequisite": "Đã hoàn thành Bài 214.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói trọn vẹn câu xin nghỉ phép.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Xin nghỉ phép",
      "请假",
      "休息",
      "多喝水"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Mẫu câu xin nghỉ phép: 老师/经理，我想请假 (Lǎoshī/Jīnglǐ, wǒ xiǎng qǐngjià)",
      "summary": "请假 (qǐngjià) là xin nghỉ phép. 休息 (xiūxi) là nghỉ ngơi. Cấu trúc khuyên nhủ: 多 + Động từ (多喝水 - Uống nhiều nước, 多休息 - Nghỉ ngơi nhiều).",
      "audioDemoText": "lǎoshī wǒ shēngbìng le xiǎng qǐngjià yì tiān, nǐ hǎohao xiūxi duō hē shuǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-215-1",
        "hanzi": "请假",
        "pinyin": "qǐngjià",
        "hanviet": "Thỉnh giả",
        "meaning": "Xin nghỉ phép",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "我想请假两天。",
          "pinyin": "Wǒ xiǎng qǐngjià liǎng tiān.",
          "meaning": "Tôi muốn xin nghỉ phép 2 ngày."
        }
      },
      {
        "id": "v-215-2",
        "hanzi": "休息",
        "pinyin": "xiūxi",
        "hanviet": "Hưu tức",
        "meaning": "Nghỉ ngơi",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "好好休息。",
          "pinyin": "Hǎohāo xiūxi.",
          "meaning": "Nghỉ ngơi thật tốt nhé."
        }
      },
      {
        "id": "v-215-3",
        "hanzi": "多",
        "pinyin": "duō",
        "hanviet": "Đa",
        "meaning": "Nhiều (làm gì nhiều hơn)",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "多喝热水。",
          "pinyin": "Duō hē rèshuǐ.",
          "meaning": "Uống nhiều nước ấm."
        }
      },
      {
        "id": "v-215-4",
        "hanzi": "能不能",
        "pinyin": "néng bu néng",
        "hanviet": "Năng bất năng",
        "meaning": "Có thể...hay không",
        "radical": "月 (Nguyệt)",
        "example": {
          "hanzi": "能不能帮我？",
          "pinyin": "Néng bu néng bāng wǒ?",
          "meaning": "Có thể giúp tôi được không?"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "休",
        "pinyin": "xiū",
        "meaning": "Nghỉ ngơi (Hưu)",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Bộ Mộc (木) bên phải",
        "components": "亻 + 木",
        "mnemonic": "Con người (亻) tựa lưng vào gốc cây (木) để nghỉ ngơi."
      },
      {
        "hanzi": "息",
        "pinyin": "xī",
        "meaning": "Hơi thở, nghỉ dưỡng",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Tự (自) ở trên -> Bộ Tâm (心) ở dưới",
        "components": "自 + 心",
        "mnemonic": "Tự bản thân (自) lắng nghe hơi thở con tim (心) trong tĩnh lặng."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc khuyên bảo làm gì nhiều hơn: 多 + Động từ + Tân ngữ",
      "formula": "多 + Động từ (多喝水 / 多吃水果 / 多休息)",
      "explanation": "Trong tiếng Trung, phó từ 多 đứng trước động từ để khuyên ai đó nên thực hiện hành động gì nhiều hơn.",
      "examples": [
        {
          "hanzi": "感冒的时候要多喝温水，多睡觉。",
          "pinyin": "Gǎnmào de shíhou yào duō hē wēnshuǐ, duō shuìjiào.",
          "meaning": "Khi bị cảm cúm cần uống nhiều nước ấm và ngủ nhiều hơn."
        }
      ],
      "commonMistake": {
        "wrong": "喝水多 ❌",
        "correct": "多喝水 ✔️",
        "explanation": "Từ 多 phải đứng trước động từ 喝."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Học sinh",
          "hanzi": "王老师，我今天感冒发烧了，头很疼，想请假一天去医院看病。",
          "pinyin": "Wáng lǎoshī, wǒ jīntiān gǎnmào fāshāo le, tóu hěn téng, xiǎng qǐngjià yì tiān qù yīyuàn kànbìng.",
          "meaning": "Thưa thầy Vương, hôm nay em bị cảm sốt, đầu rất đau, em muốn xin phép nghỉ 1 ngày đi viện khám ạ."
        },
        {
          "speaker": "Thầy giáo",
          "hanzi": "好的，你好好休息，多喝水，按时吃药，祝你早日康复！",
          "pinyin": "Hǎo de, nǐ hǎohāo xiūxi, duō hē shuǐ, ànshí chī yào, zhù nǐ zǎorì kāngfù!",
          "meaning": "Được rồi, em nghỉ ngơi cho khỏe nhé, uống nhiều nước, nhớ uống thuốc đúng giờ, chúc em sớm bình phục!"
        }
      ],
      "audioText": "老师，我今天感冒发烧了，想请假一天。好的，你好好休息，多喝水。",
      "question": "Thầy giáo dặn dò học sinh điều gì?",
      "options": [
        "Phải đến lớp ngay",
        "Nghỉ ngơi thật tốt và uống nhiều nước (hǎohāo xiūxi, duō hē shuǐ)",
        "Không được nghỉ học",
        "Đi chơi thể thao"
      ],
      "correctIndex": 1,
      "explanation": "Thầy dặn: 好好休息，多喝水."
    },
    "step6_speaking": {
      "prompt": "Đọc câu xin phép nghỉ 1 ngày:",
      "targetSentence": "老师，我想请假一天。",
      "targetPinyin": "Lǎoshī, wǒ xiǎng qǐngjià yì tiān.",
      "targetMeaning": "Thưa thầy, em muốn xin nghỉ một ngày.",
      "hint": "Đọc qǐngjià yì tiān trang trọng, lễ phép."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bạn hãy nghỉ ngơi thật tốt nhé",
      "words": [
        "休息",
        "好好",
        "你"
      ],
      "correctOrder": [
        "你",
        "好好",
        "休息"
      ],
      "explanation": "你 + 好好 + 休息."
    },
    "step8_quiz": [
      {
        "id": "q-215-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Xin nghỉ phép' trong tiếng Trung là:",
        "options": [
          "放假 (fàngjià)",
          "请假 (qǐngjià)",
          "休息 (xiūxi)",
          "睡觉 (shuìjiào)"
        ],
        "correctIndex": 1,
        "explanation": "Xin nghỉ phép là 请假 (qǐngjià)."
      },
      {
        "id": "q-215-2",
        "type": "multiple-choice",
        "question": "Khuyên ai đó 'uống nhiều nước', câu đúng ngữ pháp là:",
        "options": [
          "喝水多",
          "多喝水 (duō hē shuǐ)",
          "水多喝",
          "多水喝"
        ],
        "correctIndex": 1,
        "explanation": "Cấu trúc: 多 + Động từ = 多喝水."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 7",
      "taskDesc": "Vượt qua thử thách để chuẩn bị đại chiến giải quyết tình huống y tế và thời tiết!",
      "targetPhrase": "lǎoshī wǒ bù shūfu xiǎng qǐngjià yì tiān",
      "xpReward": 60,
      "badge": "Giao Tế Chu Toàn"
    }
  },

  {
    "id": "l-216",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 16,
    "title": "Trợ từ động thái 着 diễn đạt trạng thái duy trì (门开着呢)",
    "chineseTitle": "动态助词“着”与状态持续（门开着、穿着红衣服）",
    "subtitle": "Làm chủ trợ từ 着 (zhe) biểu thị trạng thái đang tiếp diễn hoặc một tư thế được giữ nguyên.",
    "objective": "Phân biệt cách dùng trợ từ 着 và miêu tả được các trạng thái đồ vật, con người xung quanh.",
    "prerequisite": "Đã hoàn thành Module 2.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc Động từ + 着.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Trợ từ 着",
      "Trạng thái duy trì",
      "Ngữ pháp HSK 2"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Trợ từ động thái 着 (zhe): Động từ + 着 + (Tân ngữ) + 呢",
      "summary": "着 biểu thị trạng thái kết quả của hành động đang được duy trì: 门开着 (Cửa đang mở), 穿戴着 (Đang mặc/đeo), 站着 (Đang đứng), 拿着 (Đang cầm trên tay). Phủ định: 没 + Động từ + 着.",
      "audioDemoText": "mén kāi zhe ne, tā chuān zhe hóngsè de yīfu, shǒu lǐ ná zhe yì běn shū"
    },
    "step2_vocabulary": [
      {
        "id": "v-216-1",
        "hanzi": "着",
        "pinyin": "zhe",
        "hanviet": "Trước",
        "meaning": "Đang (trợ từ trạng thái)",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "门开着呢。",
          "pinyin": "Mén kāi zhe ne.",
          "meaning": "Cửa đang mở đấy."
        }
      },
      {
        "id": "v-216-2",
        "hanzi": "开",
        "pinyin": "kāi",
        "hanviet": "Khai",
        "meaning": "Mở, lái xe",
        "radical": "廾 (Củng)",
        "example": {
          "hanzi": "请开门。",
          "pinyin": "Qǐng kāi mén.",
          "meaning": "Xin mở cửa."
        }
      },
      {
        "id": "v-216-3",
        "hanzi": "关",
        "pinyin": "guān",
        "hanviet": "Quan",
        "meaning": "Đóng, tắt",
        "radical": "丷 (Bát)",
        "example": {
          "hanzi": "窗户关着。",
          "pinyin": "Chuānghu guān zhe.",
          "meaning": "Cửa sổ đang đóng."
        }
      },
      {
        "id": "v-216-4",
        "hanzi": "拿",
        "pinyin": "ná",
        "hanviet": "Nã",
        "meaning": "Cầm, nắm, lấy",
        "radical": "手 (Thủ)",
        "example": {
          "hanzi": "手里拿着手机。",
          "pinyin": "Shǒu lǐ ná zhe shǒujī.",
          "meaning": "Trong tay đang cầm điện thoại."
        }
      },
      {
        "id": "v-216-5",
        "hanzi": "站",
        "pinyin": "zhàn",
        "hanviet": "Trạm",
        "meaning": "Đứng, bến trạm",
        "radical": "立 (Lập)",
        "example": {
          "hanzi": "外面站着一个人。",
          "pinyin": "Wàimiàn zhàn zhe yí gè rén.",
          "meaning": "Bên ngoài đang đứng một người."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "关",
        "pinyin": "guān",
        "meaning": "Đóng lại, cửa ải",
        "strokesCount": 6,
        "strokeOrderText": "Chấm -> Phẩy -> Ngang trên -> Ngang dưới -> Phẩy -> Mác",
        "components": "丷 + 天",
        "mnemonic": "Cánh cổng thành then cài đóng kín bảo vệ sự bình an."
      },
      {
        "hanzi": "拿",
        "pinyin": "ná",
        "meaning": "Cầm lấy, nắm bắt",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Hợp (合) ở trên -> Bộ Thủ (手) ở dưới",
        "components": "合 + 手",
        "mnemonic": "Bàn tay (Thủ) chụm hợp lại (Hợp) để cầm nắm đồ vật."
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt 在 + V (Hành động đang diễn ra) vs V + 着 (Trạng thái duy trì)",
      "formula": "1. Hành động đang tiến hành: 他在穿衣服 (Anh ấy đang xỏ áo vào người). 2. Trạng thái duy trì: 他穿着衣服 (Anh ấy đang mặc chiếc áo trên người).",
      "explanation": "着 nhấn mạnh vào TRẠNG THÁI tĩnh được lưu giữ sau khi hành động đã hoàn tất.",
      "examples": [
        {
          "hanzi": "前面站着的那个人是我哥哥。",
          "pinyin": "Qiánmiàn zhàn zhe de nà ge rén shì wǒ gēge.",
          "meaning": "Người đang đứng ở phía trước kia là anh trai tôi."
        }
      ],
      "commonMistake": {
        "wrong": "门不开展 ❌",
        "correct": "门没开着 ✔️",
        "explanation": "Phủ định của trạng thái 着 dùng 没 (không dùng 不)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "请问，王老师在办公室吗？",
          "pinyin": "Qǐngwèn, Wáng lǎoshī zài bàngōngshì ma?",
          "meaning": "Xin hỏi, thầy Vương có ở trong văn phòng không?"
        },
        {
          "speaker": "B",
          "hanzi": "在的，你看，办公室门开着呢，他正坐在里面看书呢。",
          "pinyin": "Zài de, nǐ kàn, bàngōngshì mén kāi zhe ne, tā zhèng zuò zhe lǐmiàn kàn shū ne.",
          "meaning": "Có đấy, bạn nhìn kìa, cửa văn phòng đang mở đấy, thầy đang ngồi bên trong đọc sách kìa."
        }
      ],
      "audioText": "办公室门开着呢，他正坐在里面看书呢。",
      "question": "Thầy Vương đang ở đâu và làm gì?",
      "options": [
        "Đang đứng ngoài sân",
        "Đang ngồi đọc sách trong văn phòng cửa mở",
        "Đã về nhà",
        "Đang đi dạy học"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 门开着呢，坐在里面看书."
    },
    "step6_speaking": {
      "prompt": "Đọc câu miêu tả cửa đang mở:",
      "targetSentence": "门开着呢。",
      "targetPinyin": "Mén kāi zhe ne.",
      "targetMeaning": "Cửa đang mở đấy.",
      "hint": "Đọc zhe ne là thanh nhẹ lướt êm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đang cầm một quyển sách",
      "words": [
        "一本书",
        "他拿着"
      ],
      "correctOrder": [
        "他拿着",
        "一本书"
      ],
      "explanation": "他拿着 + 一本书."
    },
    "step8_quiz": [
      {
        "id": "q-216-1",
        "type": "multiple-choice",
        "question": "Trợ từ '着' trong câu '门开着呢' biểu thị điều gì?",
        "options": [
          "Hành động đã qua",
          "Trạng thái đang được duy trì",
          "Nguyện vọng tương lai",
          "So sánh"
        ],
        "correctIndex": 1,
        "explanation": "着 biểu thị trạng thái kết quả đang duy trì."
      },
      {
        "id": "q-216-2",
        "type": "multiple-choice",
        "question": "Phủ định đúng của '他穿着红衣服' là:",
        "options": [
          "他不穿着红衣服",
          "他没穿着红衣服",
          "他穿没着红衣服",
          "他红衣服不穿"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định của V+着 là 没 + V + 着."
      }
    ],
    "step9_challenge": {
      "title": "Bức tranh chuyển động",
      "taskDesc": "Đọc to câu miêu tả: 'Người đang đứng đằng kia đang mặc chiếc áo màu đỏ'.",
      "targetPhrase": "nà ge rén chuān zhe hóngsè de yīfu",
      "xpReward": 50,
      "badge": "Quan Sát Tinh Tường"
    }
  },

  {
    "id": "l-217",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 17,
    "title": "Trợ từ động thái 过 diễn đạt trải nghiệm quá khứ (我去过北京)",
    "chineseTitle": "动态助词“过”与人生经历（去过、吃过、没做过）",
    "subtitle": "Diễn đạt 'từng làm gì' trong đời với 过 (guo) và phủ định 'chưa từng' với 没...过.",
    "objective": "Hỏi và chia sẻ các trải nghiệm du lịch, ẩm thực, cuộc sống mà bạn từng làm trong quá khứ.",
    "prerequisite": "Đã hoàn thành Bài 216.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng các trải nghiệm cá nhân với 过.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Trợ từ 过",
      "Trải nghiệm quá khứ",
      "我去过北京"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Trợ từ động thái 过 (guo - Đã từng): Động từ + 过 + Tân ngữ",
      "summary": "过 nhấn mạnh vào KINH NGHIỆM / TRẢI NGHIỆM đã từng xảy ra trong quá khứ. Phủ định bắt buộc là: 没 + Động từ + 过 (Chưa từng). Tuyệt đối KHÔNG dùng 不 + Động từ + 过.",
      "audioDemoText": "wǒ qù guo běijīng, wǒ chī guo kǎoyā, wǒ méi xué guo fǎyǔ"
    },
    "step2_vocabulary": [
      {
        "id": "v-217-1",
        "hanzi": "过",
        "pinyin": "guo",
        "hanviet": "Quá",
        "meaning": "Đã từng (trợ từ kinh nghiệm)",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "你去过中国吗？",
          "pinyin": "Nǐ qù guo Zhōngguó ma?",
          "meaning": "Bạn từng đi Trung Quốc chưa?"
        }
      },
      {
        "id": "v-217-2",
        "hanzi": "次",
        "pinyin": "cì",
        "hanviet": "Thứ",
        "meaning": "Lần (lượng từ số lần)",
        "radical": "欠 (Khiếm)",
        "example": {
          "hanzi": "我去过两次。",
          "pinyin": "Wǒ qù guo liǎng cì.",
          "meaning": "Tôi từng đi 2 lần rồi."
        }
      },
      {
        "id": "v-217-3",
        "hanzi": "以前",
        "pinyin": "yǐqián",
        "hanviet": "Dĩ tiền",
        "meaning": "Trước đây, trước kia",
        "radical": "刀 (Đao)",
        "example": {
          "hanzi": "以前我没吃过。",
          "pinyin": "Yǐqián wǒ méi chī guo.",
          "meaning": "Trước đây tôi chưa từng ăn."
        }
      },
      {
        "id": "v-217-4",
        "hanzi": "电影",
        "pinyin": "diànyǐng",
        "hanviet": "Điện ảnh",
        "meaning": "Bộ phim",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "我看过这部电影。",
          "pinyin": "Wǒ kàn guo zhè bù diànyǐng.",
          "meaning": "Tôi đã từng xem bộ phim này."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "过",
        "pinyin": "guo",
        "meaning": "Đi qua, đã từng",
        "strokesCount": 6,
        "strokeOrderText": "Chữ Thốn (寸) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "寸 + 辶",
        "mnemonic": "Từng tấc bước chân (Thốn + Sước) đã đi qua dòng thời gian dĩ vãng."
      },
      {
        "hanzi": "次",
        "pinyin": "cì",
        "meaning": "Lần lượt, số lần",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Băng (冫) bên trái -> Bộ Khiếm (欠) bên phải",
        "components": "冫 + 欠",
        "mnemonic": "Từng lượt từng lần mở miệng đếm số lần trải nghiệm."
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt 了 (Hành động đã hoàn thành) vs 过 (Trải nghiệm từng làm qua)",
      "formula": "1. Khẳng định: S + V + 过 + O. 2. Phủ định: S + 没(有) + V + 过 + O. 3. Nghi vấn: S + V + 过 + O + 没有 / 吗？",
      "explanation": "Câu chữ 了 nhấn mạnh sự việc ĐÃ XONG (Ví dụ: 我吃了饭 - Tôi ăn cơm xong rồi). Còn 过 nhấn mạnh vào KINH NGHIỆM ĐỜI NGƯỜI (Ví dụ: 我吃过烤鸭 - Tôi từng ăn vịt quay rồi).",
      "examples": [
        {
          "hanzi": "我以前没去过北京，这是第一次。",
          "pinyin": "Wǒ yǐqián méi qù guo Běijīng, zhè shì dì yī cì.",
          "meaning": "Trước đây tôi chưa từng đến Bắc Kinh, đây là lần đầu tiên."
        }
      ],
      "commonMistake": {
        "wrong": "我不去过 ❌",
        "correct": "我没去过 ✔️",
        "explanation": "Phủ định của 过 bắt buộc dùng 没(有)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你看过中国京剧吗？",
          "pinyin": "Nǐ kàn guo Zhōngguó Jīngjù ma?",
          "meaning": "Bạn đã từng xem Kinh kịch Trung Quốc chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "我没看过，但我听过京剧的音乐，很有特色。",
          "pinyin": "Wǒ méi kàn guo, dàn wǒ tīng guo Jīngjù de yīnyuè, hěn yǒu tèsè.",
          "meaning": "Tôi chưa từng xem, nhưng tôi từng nghe qua âm nhạc Kinh kịch, rất đặc sắc."
        }
      ],
      "audioText": "你看过中国京剧吗？我没看过，但我听过京剧的音乐。",
      "question": "Người B đã từng làm điều gì liên quan đến Kinh kịch?",
      "options": [
        "Đã từng đi diễn Kinh kịch",
        "Từng nghe âm nhạc Kinh kịch (tīng guo Jīngjù de yīnyuè)",
        "Từng xem phim Kinh kịch",
        "Chưa nghe bao giờ"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 我听过京剧的音乐."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn từng đến Bắc Kinh:",
      "targetSentence": "我去过北京。",
      "targetPinyin": "Wǒ qù guo Běijīng.",
      "targetMeaning": "Tôi đã từng đi Bắc Kinh.",
      "hint": "Đọc guo là thanh nhẹ lướt êm."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi chưa từng ăn món này",
      "words": [
        "吃过",
        "我没",
        "这个菜"
      ],
      "correctOrder": [
        "我没",
        "吃过",
        "这个菜"
      ],
      "explanation": "我没 + 吃过 + 这个菜."
    },
    "step8_quiz": [
      {
        "id": "q-217-1",
        "type": "multiple-choice",
        "question": "Để nói 'Tôi chưa từng đi Trung Quốc', câu đúng là:",
        "options": [
          "我不去过中国",
          "我没去过中国",
          "我去不中国",
          "中国我没去"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định kinh nghiệm bắt buộc dùng 没: 我没去过中国."
      },
      {
        "id": "q-217-2",
        "type": "multiple-choice",
        "question": "Từ '次' trong '我去过两次' là loại từ gì?",
        "options": [
          "Danh từ",
          "Lượng từ chỉ số lần",
          "Tính từ",
          "Phó từ"
        ],
        "correctIndex": 1,
        "explanation": "次 là động lượng từ chỉ số lần thực hiện hành động."
      }
    ],
    "step9_challenge": {
      "title": "Kho báu trải nghiệm",
      "taskDesc": "Đọc to câu chia sẻ một món ăn ngon bạn từng thưởng thức bằng tiếng Trung.",
      "targetPhrase": "wǒ chī guo běijīng kǎoyā hěn hǎochī",
      "xpReward": 50,
      "badge": "Người Giàu Trải Nghiệm"
    }
  },

  {
    "id": "l-218",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 18,
    "title": "Cặp liên từ logic 因为...所以... & 虽然...但是...",
    "chineseTitle": "复句关联词（因为...所以...，虽然...但是...）",
    "subtitle": "Kết nối hai vế câu logic: Nguyên nhân - kết quả (Bởi vì...cho nên...) và chuyển ngoặt (Tuy rằng...nhưng mà...).",
    "objective": "Nói và viết được các câu phức logic giải thích nguyên nhân và diễn đạt quan điểm tương phản.",
    "prerequisite": "Đã hoàn thành Bài 217.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và ghép đúng các cặp liên từ logic.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 2",
      "Liên từ logic",
      "因为所以",
      "虽然但是",
      "Câu phức"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "2 Cặp liên từ cốt lõi HSK 2: 因为...所以... & 虽然...但是...",
      "summary": "1. Nguyên nhân - kết quả: 因为 (yīnwèi - bởi vì) ... 所以 (suǒyǐ - cho nên). 2. Chuyển ngoặt đối lập: 虽然 (suīrán - tuy rằng) ... 但是 (dànshì - nhưng mà).",
      "audioDemoText": "yīnwèi jīntiān xiàyǔ, suǒyǐ wǒ méi qù; suīrán hěn lěng, dànshì wǒ hěn kāixīn"
    },
    "step2_vocabulary": [
      {
        "id": "v-218-1",
        "hanzi": "因为",
        "pinyin": "yīnwèi",
        "hanviet": "Nhân vi",
        "meaning": "Bởi vì, vì",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "因为下雨了。",
          "pinyin": "Yīnwèi xià yǔ le.",
          "meaning": "Bởi vì trời mưa rồi."
        }
      },
      {
        "id": "v-218-2",
        "hanzi": "所以",
        "pinyin": "suǒyǐ",
        "hanviet": "Sở dĩ",
        "meaning": "Cho nên, vì vậy",
        "radical": "斤 (Cân)",
        "example": {
          "hanzi": "所以我在家。",
          "pinyin": "Suǒyǐ wǒ zài jiā.",
          "meaning": "Cho nên tôi ở nhà."
        }
      },
      {
        "id": "v-218-3",
        "hanzi": "虽然",
        "pinyin": "suīrán",
        "hanviet": "Tuy nhiên",
        "meaning": "Mặc dù, tuy rằng",
        "radical": "虫 (Trùng)",
        "example": {
          "hanzi": "虽然汉语难。",
          "pinyin": "Suīrán Hànyǔ nán.",
          "meaning": "Tuy rằng tiếng Trung khó."
        }
      },
      {
        "id": "v-218-4",
        "hanzi": "但是",
        "pinyin": "dànshì",
        "hanviet": "Đãn thị",
        "meaning": "Nhưng mà, nhưng",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "但是很有趣。",
          "pinyin": "Dànshì hěn yǒuqù.",
          "meaning": "Nhưng mà rất thú vị."
        }
      },
      {
        "id": "v-218-5",
        "hanzi": "还是",
        "pinyin": "háishi",
        "hanviet": "Hoàn thị",
        "meaning": "Hay là, vẫn là",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "喝茶还是喝咖啡？",
          "pinyin": "Hē chá háishi hē kāfēi?",
          "meaning": "Uống trà hay là uống cà phê?"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "因",
        "pinyin": "yīn",
        "meaning": "Nguyên nhân (trong Bởi vì 因为)",
        "strokesCount": 6,
        "strokeOrderText": "Khung Vi (囗) bao ngoài -> Chữ Đại (大) bên trong",
        "components": "囗 + 大",
        "mnemonic": "Con người to lớn (Đại) bị giới hạn trong khuôn khổ (Vi) sinh ra nguyên cớ."
      },
      {
        "hanzi": "但",
        "pinyin": "dàn",
        "meaning": "Nhưng mà (trong 但是)",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Đán (旦) bên phải",
        "components": "亻 + 旦",
        "mnemonic": "Con người (亻) nhìn mặt trời mọc rạng đông (旦) chuyển giao ngày mới."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc ghép nối logic tiếng Trung",
      "formula": "因为 + Nguyên nhân, 所以 + Kết quả.   /   虽然 + Vế nhượng bộ, 但是 + Vế chuyển ngoặt.",
      "explanation": "Trong tiếng Trung, hai liên từ này luôn đi thành từng cặp đối ứng với nhau (khác tiếng Anh không được dùng cả because và so cùng lúc, tiếng Trung BẮT BUỘC có thể dùng cả đôi).",
      "examples": [
        {
          "hanzi": "虽然汉字有点儿难写，但是我很喜欢学。",
          "pinyin": "Suīrán hànzì yǒudiǎnr nán xiě, dànshì wǒ hěn xǐhuan xué.",
          "meaning": "Mặc dù chữ Hán hơi khó viết một chút, nhưng tôi rất thích học."
        }
      ],
      "commonMistake": {
        "wrong": "Bỏ quên chữ 但是 khi đã có 虽然",
        "correct": "Luôn dùng cặp: 虽然...但是...",
        "explanation": "Cặp liên từ đi đôi giúp văn phong mạch lạc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你昨天怎么没来上课？",
          "pinyin": "Nǐ zuótiān zěnme méi lái shàngkè?",
          "meaning": "Hôm qua sao bạn không đến lớp học?"
        },
        {
          "speaker": "B",
          "hanzi": "因为我感冒发烧了，所以在家休息了一天。",
          "pinyin": "Yīnwèi wǒ gǎnmào fāshāo le, suǒyǐ zài jiā xiūxi le yì tiān.",
          "meaning": "Bởi vì tôi bị cảm sốt, cho nên đã ở nhà nghỉ ngơi một ngày."
        }
      ],
      "audioText": "因为我感冒发烧了，所以在家休息了一天。",
      "question": "Vì sao người B không đi học hôm qua?",
      "options": [
        "Bận đi làm",
        "Bị cảm sốt nên ở nhà nghỉ (gǎnmào fāshāo, suǒyǐ zài jiā xiūxi)",
        "Đi du lịch",
        "Quên lịch học"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 因为我感冒发烧了，所以在家休息."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thể hiện tinh thần học tập kiên trì:",
      "targetSentence": "虽然汉语难，但是我喜欢。",
      "targetPinyin": "Suīrán Hànyǔ nán, dànshì wǒ xǐhuan.",
      "targetMeaning": "Mặc dù tiếng Trung khó, nhưng tôi thích.",
      "hint": "Đọc nhấn giọng ở dànshì."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bởi vì trời mưa cho nên tôi không đi",
      "words": [
        "所以我不去",
        "因为下雨"
      ],
      "correctOrder": [
        "因为下雨",
        "所以我不去"
      ],
      "explanation": "因为下雨 + 所以我不去."
    },
    "step8_quiz": [
      {
        "id": "q-218-1",
        "type": "multiple-choice",
        "question": "Cặp liên từ nào sau đây biểu thị mối quan hệ nguyên nhân - kết quả?",
        "options": [
          "虽然...但是...",
          "因为...所以... (yīnwèi...suǒyǐ...)",
          "不但...而且...",
          "如果...就..."
        ],
        "correctIndex": 1,
        "explanation": "因为...所以... là Bởi vì...cho nên..."
      },
      {
        "id": "q-218-2",
        "type": "multiple-choice",
        "question": "Trong câu hỏi lựa chọn 'Bạn uống trà hay cà phê', từ 'hay là' chuẩn là:",
        "options": [
          "还是 (háishi)",
          "或者 (huòzhě)",
          "因为",
          "所以"
        ],
        "correctIndex": 0,
        "explanation": "Câu hỏi lựa chọn dùng 还是 (háishi)."
      }
    ],
    "step9_challenge": {
      "title": "Nhà hùng biện logic",
      "taskDesc": "Đọc to câu ghép sử dụng trọn vẹn cặp liên từ 因为...所以...",
      "targetPhrase": "yīnwèi wǒ xǐhuan hànyǔ suǒyǐ wǒ nǔlì xué",
      "xpReward": 50,
      "badge": "Tư Duy Logic"
    }
  },

  {
    "id": "l-219",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện hệ thống ngữ pháp HSK 2",
    "chineseTitle": "HSK 2级全真语法体系与300词总复习",
    "subtitle": "Hệ thống hóa toàn bộ 300 từ vựng và các cấu trúc câu so sánh 比, trợ từ 了/着/过, câu phức liên từ.",
    "objective": "Nắm vững toàn diện 96 điểm ngữ pháp HSK 2 và 300 từ vựng trước bài thi tổng kết.",
    "prerequisite": "Đã hoàn thành Bài 201–218.",
    "completionCriteria": "Đạt >= 80% điểm bài trắc nghiệm tổng hợp Level 2.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 2",
      "Tổng ôn tập",
      "Ngữ pháp tổng hợp",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Hệ thống 3 Trợ từ động thái cốt lõi: 了 (Hoàn thành), 着 (Duy trì), 过 (Kinh nghiệm quá khứ)",
      "summary": "1. V + 了: Hành động đã thực hiện (我买了). 2. V + 着: Trạng thái đang duy trì (门开着). 3. V + 过: Đã từng trải nghiệm trong đời (我去过). Bổ trợ thêm câu chữ 比 và các cặp liên từ.",
      "audioDemoText": "wǒ chī le fàn, mén kāi zhe, wǒ qù guo zhōngguó, jīntiān bǐ zuótiān lěng"
    },
    "step2_vocabulary": [
      {
        "id": "v-219-1",
        "hanzi": "已经",
        "pinyin": "yǐjīng",
        "hanviet": "Dĩ kinh",
        "meaning": "Đã, rồi",
        "radical": "己 (Kỷ)",
        "example": {
          "hanzi": "我已经知道了。",
          "pinyin": "Wǒ yǐjīng zhīdào le.",
          "meaning": "Tôi đã biết rồi."
        }
      },
      {
        "id": "v-219-2",
        "hanzi": "特别",
        "pinyin": "tèbié",
        "hanviet": "Đặc biệt",
        "meaning": "Đặc biệt, vô cùng",
        "radical": "牜 (Ngưu)",
        "example": {
          "hanzi": "今天特别热。",
          "pinyin": "Jīntiān tèbié rè.",
          "meaning": "Hôm nay đặc biệt nóng."
        }
      },
      {
        "id": "v-219-3",
        "hanzi": "帮助",
        "pinyin": "bāngzhù",
        "hanviet": "Bang trợ",
        "meaning": "Giúp đỡ",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "谢谢你的帮助。",
          "pinyin": "Xièxie nǐ de bāngzhù.",
          "meaning": "Cảm ơn sự giúp đỡ của bạn."
        }
      },
      {
        "id": "v-219-4",
        "hanzi": "懂",
        "pinyin": "dǒng",
        "hanviet": "Đổng",
        "meaning": "Hiểu",
        "radical": "忄 (Tâm)",
        "example": {
          "hanzi": "我听懂了。",
          "pinyin": "Wǒ tīng dǒng le.",
          "meaning": "Tôi nghe hiểu rồi."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "特",
        "pinyin": "tè",
        "meaning": "Đặc biệt",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Ngưu (牜) bên trái -> Chữ Tự (寺) bên phải",
        "components": "牜 + 寺",
        "mnemonic": "Con trâu đực quý giá (Ngưu) dâng lên cửa chùa (Tự) là lễ vật đặc biệt."
      },
      {
        "hanzi": "助",
        "pinyin": "zhù",
        "meaning": "Giúp sức, tương trợ",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Thả (且) bên trái -> Bộ Lực (力) bên phải",
        "components": "且 + 力",
        "mnemonic": "Bỏ thêm sức lực (Lực) cùng hỗ trợ nhau làm việc."
      }
    ],
    "step4_grammar": {
      "title": "Bảng đối sánh 3 trợ từ động thái kinh điển của tiếng Trung",
      "formula": "了 (Xong việc) vs 着 (Đang giữ trạng thái) vs 过 (Đã từng trải qua)",
      "explanation": "Nắm vững sự khác biệt giữa 3 trợ từ này giúp bạn đạt điểm tối đa các câu hỏi ngữ pháp điền từ trong kỳ thi HSK 2.",
      "examples": [
        {
          "hanzi": "我已经吃过饭了，现在正坐着休息呢。",
          "pinyin": "Wǒ yǐjīng chī guo fàn le, xiànzài zhèng zuò zhe xiūxi ne.",
          "meaning": "Tôi đã ăn cơm xong rồi, bây giờ đang ngồi nghỉ ngơi."
        }
      ],
      "commonMistake": {
        "wrong": "Nhầm lẫn giữa 过 và 了 khi kể về quá khứ.",
        "correct": "过 nhấn mạnh trải nghiệm từng làm; 了 nhấn mạnh hoàn tất sự việc.",
        "explanation": "Phân biệt bản chất ngữ nghĩa của trợ từ."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你学了多长时间汉语了？能听懂中国人说话吗？",
          "pinyin": "Nǐ xué le duō cháng shíjiān Hànyǔ le? Néng tīng dǒng Zhōngguórén shuōhuà ma?",
          "meaning": "Bạn đã học tiếng Trung được bao lâu rồi? Có nghe hiểu người Trung Quốc nói chuyện không?"
        },
        {
          "speaker": "B",
          "hanzi": "我学了半年了，虽然说得不太快，但是基本的日常对话都能听懂。",
          "pinyin": "Wǒ xué le bàn nián le, suīrán shuō de bú tài kuài, dànshì jīběn de rìcháng duìhuà dōu néng tīng dǒng.",
          "meaning": "Tôi học được nửa năm rồi, mặc dù nói chưa được nhanh lắm, nhưng các hội thoại sinh hoạt cơ bản đều nghe hiểu được hết."
        }
      ],
      "audioText": "虽然说得不太快，但是基本的日常对话都能听懂。",
      "question": "Trình độ tiếng Trung của người B hiện tại ra sao?",
      "options": [
        "Không hiểu gì",
        "Nói rất nhanh",
        "Nghe hiểu được các hội thoại sinh hoạt thường nhật (jīběn rìcháng duìhuà néng tīng dǒng)",
        "Đã quên hết"
      ],
      "correctIndex": 2,
      "explanation": "B nói: 基本的日常对话都能听懂."
    },
    "step6_speaking": {
      "prompt": "Khẳng định khả năng nghe hiểu tiếng Trung của bạn:",
      "targetSentence": "我能听懂日常对话。",
      "targetPinyin": "Wǒ néng tīng dǒng rìcháng duìhuà.",
      "targetMeaning": "Tôi có thể nghe hiểu hội thoại thường nhật.",
      "hint": "Đọc tīng dǒng thanh 1 và 3 dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi đã nghe hiểu rồi",
      "words": [
        "听懂了",
        "我已经"
      ],
      "correctOrder": [
        "我已经",
        "听懂了"
      ],
      "explanation": "我已经 + 听懂了."
    },
    "step8_quiz": [
      {
        "id": "q-219-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他手里拿 ___ 一本书。",
        "options": [
          "了",
          "着 (zhe)",
          "过",
          "在"
        ],
        "correctIndex": 1,
        "explanation": "Trạng thái cầm trên tay duy trì dùng 着: 拿着."
      },
      {
        "id": "q-219-2",
        "type": "multiple-choice",
        "question": "Tổng số từ vựng cốt lõi yêu cầu người học làm chủ khi hoàn thành HSK 2 là:",
        "options": [
          "150 từ",
          "300 từ vựng sinh hoạt",
          "600 từ",
          "1200 từ"
        ],
        "correctIndex": 1,
        "explanation": "HSK 2 tích lũy 300 từ vựng đàm thoại sinh hoạt thường nhật."
      }
    ],
    "step9_challenge": {
      "title": "Khởi động tổng duyệt HSK 2",
      "taskDesc": "Vượt qua thử thách để bước vào bài thi Checkpoint Test HSK 2 chính thức!",
      "targetPhrase": "wǒ yǐjīng dōu tīng dǒng le zhǔnbèi hǎo le",
      "xpReward": 60,
      "badge": "Sẵn Sàng Chinh Phục HSK 2"
    }
  },

  {
    "id": "l-220",
    "chapterId": "ch-8",
    "levelId": "lvl-2",
    "lessonNumber": 20,
    "title": "Checkpoint Test HSK 2 (Thi thử mô phỏng đề chuẩn CTI 35 câu)",
    "chineseTitle": "HSK 2级全真模拟考与阶段通关测试",
    "subtitle": "Đề thi sát hạch toàn diện Level 2: 35 câu hỏi chuẩn cấu trúc quốc tế CTI gồm Nghe hiểu và Đọc hiểu.",
    "objective": "Đạt chuẩn đầu ra Level 2 (HSK 2): Xử lý trôi chảy các tình huống sinh hoạt thường nhật bằng tiếng Trung.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 201–219.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Chứng nhận Tốt nghiệp Level 2.",
    "durationMinutes": 35,
    "xpReward": 100,
    "tags": [
      "HSK 2",
      "Thi thử CTI",
      "Checkpoint Test",
      "Tốt nghiệp Level 2"
    ],
    "relatedMaterialIds": [
      "mat-2",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Cấu trúc đề thi chuẩn quốc tế HSK 2 (CTI Exam Standard)",
      "summary": "Đề thi HSK 2 gồm 2 phần: 1. Nghe hiểu (35 câu, có tranh và audio đọc 2 lần). 2. Đọc hiểu (25 câu, nối câu tương ứng, điền từ vào chỗ trống). Tất cả vẫn có Pinyin hỗ trợ.",
      "audioDemoText": "hsk èr jí kǎoshì xiànzài kāishǐ, qǐng dàjiā zhǔnbèi hǎo"
    },
    "step2_vocabulary": [
      {
        "id": "v-220-1",
        "hanzi": "成绩",
        "pinyin": "chéngjì",
        "hanviet": "Thành tích",
        "meaning": "Thành tích, điểm số",
        "radical": "禾 (Hòa)",
        "example": {
          "hanzi": "考试成绩很好。",
          "pinyin": "Kǎoshì chéngjì hěn hǎo.",
          "meaning": "Điểm thi rất tốt."
        }
      },
      {
        "id": "v-220-2",
        "hanzi": "通过",
        "pinyin": "tōngguò",
        "hanviet": "Thông qua",
        "meaning": "Đậu, vượt qua bài thi",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "通过考试了！",
          "pinyin": "Tōngguò kǎoshì le!",
          "meaning": "Thi đậu rồi!"
        }
      },
      {
        "id": "v-220-3",
        "hanzi": "祝贺",
        "pinyin": "zhùhè",
        "hanviet": "Chúc hạ",
        "meaning": "Chúc mừng",
        "radical": "礻 (Thị)",
        "example": {
          "hanzi": "祝贺你！",
          "pinyin": "Zhùhè nǐ!",
          "meaning": "Chúc mừng bạn nhé!"
        }
      },
      {
        "id": "v-220-4",
        "hanzi": "希望",
        "pinyin": "xīwàng",
        "hanviet": "Hy vọng",
        "meaning": "Hy vọng, mong muốn",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "希望你能成功。",
          "pinyin": "Xīwàng nǐ néng chénggōng.",
          "meaning": "Hy vọng bạn có thể thành công."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "通",
        "pinyin": "tōng",
        "meaning": "Thông suốt, vượt qua",
        "strokesCount": 10,
        "strokeOrderText": "Chữ Dũng (甬) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "甬 + 辶",
        "mnemonic": "Con đường thông suốt không bị vật cản giúp vượt qua suôn sẻ."
      },
      {
        "hanzi": "贺",
        "pinyin": "hè",
        "meaning": "Chúc mừng (Hạ)",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Gia (加) ở trên -> Bộ Bối (贝) ở dưới",
        "components": "加 + 贝",
        "mnemonic": "Thêm lời chúc tụng (Gia) kèm theo quà tặng quý giá (Bối)."
      }
    ],
    "step4_grammar": {
      "title": "Bí kíp phân bổ thời gian bài thi HSK 2",
      "formula": "Nghe hiểu: Đọc trước câu hỏi 15 giây. Đọc hiểu: Tập trung vào từ khóa ngữ pháp (比, 着, 过, 因为, 离).",
      "explanation": "Đọc hiểu HSK 2 yêu cầu tốc độ đọc nhanh hơn HSK 1. Tìm nhanh các từ chỉ thời gian, địa điểm và đại từ liên kết để chọn đáp án chuẩn xác.",
      "examples": [
        {
          "hanzi": "祝贺你顺利通过HSK 2级考试！",
          "pinyin": "Zhùhè nǐ shùnlì tōngguò HSK èr jí kǎoshì!",
          "meaning": "Chúc mừng bạn đã thuận lợi vượt qua kỳ thi HSK 2!"
        }
      ],
      "commonMistake": {
        "wrong": "Đọc dịch từng chữ sang tiếng Việt mất thời gian.",
        "correct": "Nhìn lướt bắt cụm từ cố định để khoanh đáp án.",
        "explanation": "Chiến thuật làm bài khảo thí đạt điểm cao."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khảo quan",
          "hanzi": "恭喜你，你的听力和阅读成绩都非常好，达到了优秀标准！",
          "pinyin": "Gōngxǐ nǐ, nǐ de tīnglì hé yuèdú chéngjì dōu hěn hǎokàn, dádào le yōuxiù biāozhǔn!",
          "meaning": "Chúc mừng em, điểm thi nghe hiểu và đọc hiểu của em đều rất xuất sắc, đạt tiêu chuẩn loại giỏi!"
        },
        {
          "speaker": "Thí sinh",
          "hanzi": "太感谢老师了！接下来我一定要努力征服HSK 3级！",
          "pinyin": "Tài gǎnxiè lǎoshī le! Jiēxiàlai wǒ yídìng yào nǔlì zhēngfú HSK sān jí!",
          "meaning": "Em cảm ơn thầy nhiều lắm ạ! Sắp tới em nhất định sẽ nỗ lực chinh phục HSK 3!"
        }
      ],
      "audioText": "恭喜你，你的成绩达到了优秀标准！接下来我一定要征服HSK 3级！",
      "question": "Mục tiêu tiếp theo của thí sinh là gì?",
      "options": [
        "Nghỉ học tiếng Trung",
        "Chinh phục kỳ thi HSK 3 (zhēngfú HSK sān jí)",
        "Đi tìm việc làm",
        "Đi du lịch"
      ],
      "correctIndex": 1,
      "explanation": "Thí sinh nói rõ: 努力征服HSK 3级."
    },
    "step6_speaking": {
      "prompt": "Khẳng định quyết tâm vượt qua bài thi:",
      "targetSentence": "我一定能通过考试！",
      "targetPinyin": "Wǒ yídìng néng tōngguò kǎoshì!",
      "targetMeaning": "Tôi nhất định có thể vượt qua kỳ thi!",
      "hint": "Đọc dõng dạc và tràn đầy tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Chúc mừng bạn thi đậu rồi",
      "words": [
        "通过考试了",
        "祝贺你"
      ],
      "correctOrder": [
        "祝贺你",
        "通过考试了"
      ],
      "explanation": "祝贺你 + 通过考试了."
    },
    "step8_quiz": [
      {
        "id": "q-220-1",
        "type": "multiple-choice",
        "question": "Câu nào sau đây kết hợp hoàn hảo các cấu trúc trọng điểm của Level 2?",
        "options": [
          "今天比昨天冷，虽然刮风，但是门关着呢",
          "今天比昨天很冷，虽然刮风所以门关着",
          "比今天昨天冷虽然但是",
          "今天昨天比冷门关"
        ],
        "correctIndex": 0,
        "explanation": "Câu chuẩn kết hợp câu chữ 比 (比昨天冷), liên từ đối lập (虽然...但是...) và trạng thái (门关着呢)."
      },
      {
        "id": "q-220-2",
        "type": "multiple-choice",
        "question": "Chúc mừng bạn đã hoàn thành Level 2! Năng lực giao tiếp của bạn đạt mức:",
        "options": [
          "Chỉ biết chào hỏi cơ bản",
          "Xử lý trôi chảy các tình huống sinh hoạt đời thường (mua sắm, gọi món, đi lại, khám bệnh)",
          "Dịch cabin hội nghị quốc tế",
          "Đọc tiểu thuyết cổ đại"
        ],
        "correctIndex": 1,
        "explanation": "Level 2 (HSK 2) khẳng định năng lực tự chủ xử lý trôi chảy mọi tình huống sinh hoạt quen thuộc."
      }
    ],
    "step9_challenge": {
      "title": "Vinh danh Tốt nghiệp HSK 2",
      "taskDesc": "Đọc to câu tuyên bố hoàn thành xuất sắc Level 2 và mở khóa Boss Đấu trường Thiên An Môn!",
      "targetPhrase": "wǒ shùnlì tōngguò le hsk èr jí kǎoshì",
      "xpReward": 100,
      "badge": "Tốt Nghiệp HSK 2 Xuất Sắc"
    }
  },

  {
    "id": "l-301",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 1,
    "title": "Đặt phòng khách sạn & Làm thủ tục check-in (预订酒店)",
    "chineseTitle": "酒店入住与预订手续（押金、护照、房卡）",
    "subtitle": "Xử lý thủ tục khách sạn: Đặt phòng trước (预订), hộ chiếu (护照), tiền đặt cọc (押金), thẻ phòng (房卡).",
    "objective": "Tự tin check-in khách sạn, hỏi mật khẩu wifi và giải quyết các yêu cầu phòng nghỉ độc lập.",
    "prerequisite": "Đã hoàn thành Level 2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đàm thoại check-in khách sạn trôi chảy.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Du lịch",
      "Khách sạn",
      "预订",
      "护照",
      "押金"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Hội thoại quầy lễ tân khách sạn: 办理入住 (Bànlǐ rùzhù)",
      "summary": "预订 (yùdìng) là đặt trước. 护照 (hùzhào) là hộ chiếu. 押金 (yājīn) là tiền đặt cọc. 房卡 (fángkǎ) là thẻ phòng. 退房 (tuìfáng) là trả phòng.",
      "audioDemoText": "nǐ hǎo, wǒ zài wǎngshang yùdìng le yí jiān fángjiān, zhè shì wǒ de hùzhào"
    },
    "step2_vocabulary": [
      {
        "id": "v-301-1",
        "hanzi": "预订",
        "pinyin": "yùdìng",
        "hanviet": "Dự đính",
        "meaning": "Đặt trước (phòng, vé)",
        "radical": "页 (Hiệp)",
        "example": {
          "hanzi": "预订两晚房间。",
          "pinyin": "Yùdìng liǎng wǎn fángjiān.",
          "meaning": "Đặt phòng 2 đêm."
        }
      },
      {
        "id": "v-301-2",
        "hanzi": "护照",
        "pinyin": "hùzhào",
        "hanviet": "Hộ chiếu",
        "meaning": "Hộ chiếu",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "请出示您的护照。",
          "pinyin": "Qǐng chūshì nín de hùzhào.",
          "meaning": "Xin xuất trình hộ chiếu của quý khách."
        }
      },
      {
        "id": "v-301-3",
        "hanzi": "押金",
        "pinyin": "yājīn",
        "hanviet": "Áp kim",
        "meaning": "Tiền đặt cọc",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "押金两百元。",
          "pinyin": "Yājīn liǎng bǎi yuán.",
          "meaning": "Tiền đặt cọc 200 tệ."
        }
      },
      {
        "id": "v-301-4",
        "hanzi": "退房",
        "pinyin": "tuìfáng",
        "hanviet": "Thoái phòng",
        "meaning": "Trả phòng, check-out",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "明天中午退房。",
          "pinyin": "Míngtiān zhōngwǔ tuìfáng.",
          "meaning": "Trưa mai trả phòng."
        }
      },
      {
        "id": "v-301-5",
        "hanzi": "单人房",
        "pinyin": "dānrénfáng",
        "hanviet": "Đơn nhân phòng",
        "meaning": "Phòng đơn",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "一间单人房。",
          "pinyin": "Yì jiān dānrénfáng.",
          "meaning": "Một phòng đơn."
        }
      },
      {
        "id": "v-301-6",
        "hanzi": "网络",
        "pinyin": "wǎnglùo",
        "hanviet": "Võng lạc",
        "meaning": "Mạng internet, Wifi",
        "radical": "糸 (Mịch)",
        "example": {
          "hanzi": "房间有无线网络吗？",
          "pinyin": "Fángjiān yǒu wúxiàn wǎnglùo ma?",
          "meaning": "Phòng có wifi không?"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "护",
        "pinyin": "hù",
        "meaning": "Bảo hộ, che chở",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Chữ Hộ (户) bên phải",
        "components": "讠 + 户",
        "mnemonic": "Lời nói văn bản (Ngôn) bảo vệ an toàn cho từng hộ gia đình (Hộ)."
      },
      {
        "hanzi": "照",
        "pinyin": "zhào",
        "meaning": "Soi sáng, chiếu chụp",
        "strokesCount": 13,
        "strokeOrderText": "Chữ Chiêu (昭) ở trên -> Bốn chấm hỏa (灬) ở dưới",
        "components": "昭 + 灬",
        "mnemonic": "Ánh sáng rực rỡ soi rọi rõ chân dung tấm ảnh hộ chiếu."
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu thực hiện thủ tục: 办理 + Danh từ (办理入住 / 办理退房)",
      "formula": "我想办理 + 入住 (Check-in) / 退房 (Check-out) / 签证 (Visa)",
      "explanation": "Từ 办理 (bànlǐ - xử lý/làm thủ tục) là động từ trang trọng cốt lõi của trình độ HSK 3 trong mọi bối cảnh hành chính, sân bay, khách sạn.",
      "examples": [
        {
          "hanzi": "您好，我想办理入住手续，这是我的护照。",
          "pinyin": "Nín hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù, zhè shì wǒ de hùzhào.",
          "meaning": "Xin chào, tôi muốn làm thủ tục nhận phòng, đây là hộ chiếu của tôi."
        }
      ],
      "commonMistake": {
        "wrong": "我做住 ❌",
        "correct": "办理入住 ✔️",
        "explanation": "Dùng cụm thuật ngữ chuẩn 办理入住."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Lễ tân",
          "hanzi": "您好，请问有什么可以帮您？",
          "pinyin": "Nín hǎo, qǐngwèn yǒu shénme kěyǐ bāng nín?",
          "meaning": "Kính chào quý khách, xin hỏi em có thể giúp gì cho quý khách ạ?"
        },
        {
          "speaker": "Khách",
          "hanzi": "你好，我在网上预订了一间大床房，住两晚，这是我的护照。",
          "pinyin": "Nǐ hǎo, wǒ zài wǎngshang yùdìng le yì jiān dàchuángfáng, zhù liǎng wǎn, zhè shì wǒ de hùzhào.",
          "meaning": "Chào bạn, tôi đã đặt trên mạng một phòng giường đôi, ở 2 đêm, đây là hộ chiếu của tôi."
        }
      ],
      "audioText": "我在网上预订了一间大床房，住两晚，这是我的护照。",
      "question": "Khách hàng đã đặt phòng bằng hình thức nào và ở mấy đêm?",
      "options": [
        "Gọi điện thoại ở 1 đêm",
        "Đặt trên mạng ở 2 đêm (wǎngshang yùdìng, zhù liǎng wǎn)",
        "Đến trực tiếp mua phòng",
        "Ở 1 tháng"
      ],
      "correctIndex": 1,
      "explanation": "Khách nói: 在网上预订了一间... 住两晚."
    },
    "step6_speaking": {
      "prompt": "Đọc câu làm thủ tục nhận phòng:",
      "targetSentence": "你好，我想办理入住手续。",
      "targetPinyin": "Nǐ hǎo, wǒ xiǎng bànlǐ rùzhù shǒuxù.",
      "targetMeaning": "Xin chào, tôi muốn làm thủ tục nhận phòng.",
      "hint": "Đọc bànlǐ rùzhù shǒuxù dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Đây là hộ chiếu của tôi",
      "words": [
        "护照",
        "这是",
        "我的"
      ],
      "correctOrder": [
        "这是",
        "我的",
        "护照"
      ],
      "explanation": "这是 + 我的 + 护照."
    },
    "step8_quiz": [
      {
        "id": "q-301-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Hộ chiếu' trong tiếng Trung là:",
        "options": [
          "签证 (qiānzhèng)",
          "护照 (hùzhào)",
          "机票 (jīpiào)",
          "身份证 (shēnfènzhèng)"
        ],
        "correctIndex": 1,
        "explanation": "护照 (Hộ chiếu) là passport."
      },
      {
        "id": "q-301-2",
        "type": "multiple-choice",
        "question": "Khoản tiền đặt cọc tạm thời tại khách sạn gọi là:",
        "options": [
          "房费 (fángfèi)",
          "押金 (yājīn)",
          "现金 (xiànjīn)",
          "小费 (xiǎofèi)"
        ],
        "correctIndex": 1,
        "explanation": "押金 là tiền cọc bảo đảm."
      }
    ],
    "step9_challenge": {
      "title": "Check-in thành công",
      "taskDesc": "Đọc to màn đối thoại: Chào bạn, tôi đã đặt phòng trước, đây là hộ chiếu và tiền cọc.",
      "targetPhrase": "wǒ yùdìng le fángjiān zhè shì hùzhào hé yājīn",
      "xpReward": 50,
      "badge": "Khách Hàng VIP"
    }
  },

  {
    "id": "l-302",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 2,
    "title": "Tại sân bay & Thủ tục hành lý (机场办理登机与行李托运)",
    "chineseTitle": "机场登机与行李手续（准时、起飞、迟到）",
    "subtitle": "Kỹ năng hàng không: Thẻ lên máy bay (登机牌), gửi hành lý (托运行李), cất cánh (起飞) và đúng giờ (准时).",
    "objective": "Tự xử lý thủ tục check-in tại sân bay, cân hành lý và tìm đúng cửa lên máy bay.",
    "prerequisite": "Đã hoàn thành Bài 301.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và hiểu thông báo tại sân bay.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Sân bay",
      "Hành lý",
      "起飞",
      "准时",
      "迟到"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Thủ tục hàng không: 登机 (Dēngjī - Lên máy bay) & 行李 (Xíngli - Hành lý)",
      "summary": "机场 (jīchǎng) là sân bay. 登机牌 (dēngjīpái) là thẻ lên máy bay. 行李 (xíngli) là hành lý. 起飞 (qǐfēi) là cất cánh. 准时 (zhǔnshí) là đúng giờ. 迟到 (chídào) là đến muộn.",
      "audioDemoText": "fēijī zhǔnshí qǐfēi, qǐng chūshì dēngjīpái hé hùzhào, zhè jiàn xíngli yào tuōyùn"
    },
    "step2_vocabulary": [
      {
        "id": "v-302-1",
        "hanzi": "机场",
        "pinyin": "jīchǎng",
        "hanviet": "Cơ trường",
        "meaning": "Sân bay",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "去首都机场。",
          "pinyin": "Qù Shǒudū Jīchǎng.",
          "meaning": "Đi sân bay Thủ Đô."
        }
      },
      {
        "id": "v-302-2",
        "hanzi": "行李",
        "pinyin": "xíngli",
        "hanviet": "Hành lý",
        "meaning": "Hành lý, vali",
        "radical": "行 (Hành)",
        "example": {
          "hanzi": "托运行李。",
          "pinyin": "Tuōyùn xíngli.",
          "meaning": "Ký gửi hành lý."
        }
      },
      {
        "id": "v-302-3",
        "hanzi": "准时",
        "pinyin": "zhǔnshí",
        "hanviet": "Chuẩn thời",
        "meaning": "Đúng giờ",
        "radical": "冫 (Băng)",
        "example": {
          "hanzi": "飞机准时起飞。",
          "pinyin": "Fēijī zhǔnshí qǐfēi.",
          "meaning": "Máy bay cất cánh đúng giờ."
        }
      },
      {
        "id": "v-302-4",
        "hanzi": "起飞",
        "pinyin": "qǐfēi",
        "hanviet": "Khởi phi",
        "meaning": "Cất cánh",
        "radical": "走 (Tẩu)",
        "example": {
          "hanzi": "飞机要起飞了。",
          "pinyin": "Fēijī yào qǐfēi le.",
          "meaning": "Máy bay sắp cất cánh rồi."
        }
      },
      {
        "id": "v-302-5",
        "hanzi": "迟到",
        "pinyin": "chídào",
        "hanviet": "Trì đáo",
        "meaning": "Đến muộn, trễ giờ",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "不要迟到！",
          "pinyin": "Bú yào chídào!",
          "meaning": "Đừng đến muộn nhé!"
        }
      },
      {
        "id": "v-302-6",
        "hanzi": "登机牌",
        "pinyin": "dēngjīpái",
        "hanviet": "Đăng cơ bài",
        "meaning": "Thẻ lên máy bay",
        "radical": "癶 (Bát)",
        "example": {
          "hanzi": "这是您的登机牌。",
          "pinyin": "Zhè shì nín de dēngjīpái.",
          "meaning": "Đây là thẻ lên tàu bay của quý khách."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "准",
        "pinyin": "zhǔn",
        "meaning": "Chuẩn xác, cho phép",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Băng (冫) bên trái -> Chữ Chuy (隹) bên phải",
        "components": "冫 + 隹",
        "mnemonic": "Hình thước đo chim đậu chuẩn mực trên băng tuyết."
      },
      {
        "hanzi": "飞",
        "pinyin": "fēi",
        "meaning": "Bay lượn (trong Máy bay 飞机)",
        "strokesCount": 3,
        "strokeOrderText": "Ngang gập nghiêng móc -> Phẩy -> Chấm",
        "components": "Bộ Phi (飞)",
        "mnemonic": "Hình cánh chim dang rộng chao liệng trên không trung."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc sắp diễn ra: 快要 / 就要...了 (Sắp...rồi)",
      "formula": "Chủ ngữ + 快要 / 就要 + Động từ + 了",
      "explanation": "Biểu thị một hành động sắp sửa xảy ra trong tương lai rất gần. Rất hay dùng trong thông báo sân bay.",
      "examples": [
        {
          "hanzi": "飞机快要起飞了，请大家系好安全带。",
          "pinyin": "Fēijī kuàiyào qǐfēi le, qǐng dàjiā jì hǎo ānquándài.",
          "meaning": "Máy bay sắp cất cánh rồi, xin mọi người thắt chặt dây an toàn."
        }
      ],
      "commonMistake": {
        "wrong": "飞机快起飞 ❌",
        "correct": "飞机快要起飞了 ✔️",
        "explanation": "快要 luôn đi cùng 了 ở cuối câu."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Phát thanh",
          "hanzi": "前往北京的VN512次航班现在开始登机，飞机将于半小时后准时起飞，请各位旅客前往15号登机口。",
          "pinyin": "Qiánwǎng Běijīng de VN512 cì hángbān xiànzài kāishǐ dēngjī, fēijī jiāng yú bàn xiǎoshí hòu zhǔnshí qǐfēi, qǐng gèwèi lǚkè qiánwǎng shíwǔ hào dēngjīkǒu.",
          "meaning": "Chuyến bay VN512 đi Bắc Kinh hiện bắt đầu lên máy bay, máy bay sẽ cất cánh đúng giờ sau nửa tiếng, xin mời quý khách đến cửa số 15."
        }
      ],
      "audioText": "飞机将于半小时后准时起飞，请各位旅客前往15号登机口。",
      "question": "Hành khách cần đến cửa lên máy bay số mấy?",
      "options": [
        "Cửa số 5",
        "Cửa số 15 (shíwǔ hào dēngjīkǒu)",
        "Cửa số 20",
        "Cửa số 1"
      ],
      "correctIndex": 1,
      "explanation": "Thông báo: 前往15号登机口."
    },
    "step6_speaking": {
      "prompt": "Nói chuyến bay cất cánh đúng giờ:",
      "targetSentence": "飞机准时起飞。",
      "targetPinyin": "Fēijī zhǔnshí qǐfēi.",
      "targetMeaning": "Máy bay cất cánh đúng giờ.",
      "hint": "Đọc zhǔnshí qǐfēi dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Máy bay sắp cất cánh rồi",
      "words": [
        "快要起飞了",
        "飞机"
      ],
      "correctOrder": [
        "飞机",
        "快要起飞了"
      ],
      "explanation": "飞机 + 快要起飞了."
    },
    "step8_quiz": [
      {
        "id": "q-302-1",
        "type": "multiple-choice",
        "question": "Từ nào sau đây mang nghĩa là 'Thẻ lên máy bay'?",
        "options": [
          "护照 (hùzhào)",
          "登机牌 (dēngjīpái)",
          "门票 (ménpiào)",
          "车票 (chēpiào)"
        ],
        "correctIndex": 1,
        "explanation": "登机牌 là Boarding pass."
      },
      {
        "id": "q-302-2",
        "type": "multiple-choice",
        "question": "Cụm '准时' (zhǔnshí) mang nghĩa là:",
        "options": [
          "Đúng giờ",
          "Chậm trễ",
          "Hủy bỏ",
          "Đặt trước"
        ],
        "correctIndex": 0,
        "explanation": "Chuẩn thời nghĩa là đúng giờ."
      }
    ],
    "step9_challenge": {
      "title": "Làm chủ cổng sân bay",
      "taskDesc": "Đọc to câu: 'Chuyến bay của tôi cất cánh đúng giờ, tôi không bị trễ'.",
      "targetPhrase": "wǒ de fēijī zhǔnshí qǐfēi wǒ méi chídào",
      "xpReward": 50,
      "badge": "Phi Công Vũ Trụ"
    }
  },

  {
    "id": "l-303",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 3,
    "title": "Bổ ngữ Xu hướng Đơn với 来 và 去 (进来, 出去, 上来, 下去)",
    "chineseTitle": "简单趋向补语“来/去”（进来、出去、上来、下去）",
    "subtitle": "Quy tắc phương hướng kinh điển: Hướng về phía người nói dùng 来, rời xa người nói dùng 去.",
    "objective": "Sử dụng chính xác bổ ngữ xu hướng đơn 来 và 去 kết hợp 7 động từ chuyển động cơ bản.",
    "prerequisite": "Đã hoàn thành Bài 302.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cặp 来/去 theo điểm đứng của người nói.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ xu hướng đơn",
      "来",
      "去",
      "Ngữ pháp cốt lõi"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "7 Động từ chuyển động + 来 (Lại - về phía mình) / 去 (Khứ - ra xa mình)",
      "summary": "7 Động từ: 进 (vào), 出 (ra), 上 (lên), 下 (xuống), 回 (về), 过 (qua), 起 (dậy). Người nói ở trong phòng: Gọi người khác vào -> 进来; Người nói ở ngoài phòng: Bảo người khác vào trong -> 进去.",
      "audioDemoText": "qǐng jìnlái, tā zǒu chūqu le, nǐ shénme shíhou huílái"
    },
    "step2_vocabulary": [
      {
        "id": "v-303-1",
        "hanzi": "进来",
        "pinyin": "jìnlái",
        "hanviet": "Tiến lai",
        "meaning": "Vào đây (hướng về phía người nói)",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "请进来坐！",
          "pinyin": "Qǐng jìnlái zuò!",
          "meaning": "Mời vào đây ngồi!"
        }
      },
      {
        "id": "v-303-2",
        "hanzi": "出去",
        "pinyin": "chūqù",
        "hanviet": "Xuất khứ",
        "meaning": "Ra ngoài (xa người nói)",
        "radical": "出 (Xuất)",
        "example": {
          "hanzi": "他出去了。",
          "pinyin": "Tā chūqù le.",
          "meaning": "Anh ấy ra ngoài rồi."
        }
      },
      {
        "id": "v-303-3",
        "hanzi": "上来",
        "pinyin": "shànglái",
        "hanviet": "Thượng lai",
        "meaning": "Lên đây",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "快上来！",
          "pinyin": "Kuài shànglái!",
          "meaning": "Mau lên đây!"
        }
      },
      {
        "id": "v-303-4",
        "hanzi": "下去",
        "pinyin": "xiàqù",
        "hanviet": "Hạ khứ",
        "meaning": "Xuống dưới kia",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "走下去。",
          "pinyin": "Zǒu xiàqù.",
          "meaning": "Đi bộ xuống dưới kia."
        }
      },
      {
        "id": "v-303-5",
        "hanzi": "回来",
        "pinyin": "huílái",
        "hanviet": "Hồi lai",
        "meaning": "Trở về đây",
        "radical": "囗 (Vi)",
        "example": {
          "hanzi": "爸爸回来了。",
          "pinyin": "Bàba huílái le.",
          "meaning": "Bố đã về rồi."
        }
      },
      {
        "id": "v-303-6",
        "hanzi": "过去",
        "pinyin": "guòqù",
        "hanviet": "Quá khứ",
        "meaning": "Đi qua đằng kia, quá khứ",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "走过去看看。",
          "pinyin": "Zǒu guòqù kànkan.",
          "meaning": "Đi qua bên kia xem thử."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "进",
        "pinyin": "jìn",
        "meaning": "Tiến vào",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Tỉnh (井) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "井 + 辶",
        "mnemonic": "Bước chân (Sước) tiến thẳng vào trong giếng sâu (Tỉnh)."
      },
      {
        "hanzi": "出",
        "pinyin": "chū",
        "meaning": "Đi ra ngoài, xuất hiện",
        "strokesCount": 5,
        "strokeOrderText": "Sổ giữa -> Ngang gập -> Sổ -> Ngang gập -> Sổ giữa nối",
        "components": "Bộ Khảm (凵)",
        "mnemonic": "Hai ngọn núi chồng lên nhau nhô ra ngoài mặt đất."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ nơi chốn trong Bổ ngữ Xu hướng",
      "formula": "Động từ + NƠI CHỐN + 来 / 去 (Ví dụ: 回家来, 进教室去)",
      "explanation": "Quy tắc bắt buộc: Nếu tân ngữ là ĐỊA ĐIỂM NƠI CHỐN, nó BẮT BUỘC phải chen vào giữa động từ và 来/去. Tuyệt đối không được nói: 回来家 ❌.",
      "examples": [
        {
          "hanzi": "他已经进教室去了。（ĐÚNG）  /  他已经进去教室了。（SAI ❌）",
          "pinyin": "Tā yǐjīng jìn jiàoshì qù le.",
          "meaning": "Anh ấy đã bước vào trong lớp học rồi."
        }
      ],
      "commonMistake": {
        "wrong": "回学校去 ➔ nói thành 回去学校 ❌",
        "correct": "回学校去 ✔️",
        "explanation": "Địa điểm nơi chốn phải nằm kẹp ở giữa."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A (Ở trên lầu)",
          "hanzi": "小明，你在楼下做什么呢？快点儿上来吧！",
          "pinyin": "Xiǎomíng, nǐ zài lóuxià zuò shénme ne? Kuài diǎnr shànglái ba!",
          "meaning": "Tiểu Minh ơi, em làm gì dưới lầu thế? Mau lên đây đi!"
        },
        {
          "speaker": "B (Ở dưới lầu)",
          "hanzi": "哥哥，我马上拿行李上去！",
          "pinyin": "Gēge, wǒ mǎshàng ná xíngli shàngqù!",
          "meaning": "Anh ơi, em mang hành lý lên trên đó ngay đây!"
        }
      ],
      "audioText": "快点儿上来吧！我马上拿行李上去！",
      "question": "Vì sao người A nói '上来' còn người B nói '上去'?",
      "options": [
        "Nói bừa không có quy tắc",
        "Người A ở trên lầu (hướng về mình dùng 来), người B ở dưới lầu (hướng xa mình dùng 去)",
        "Cả hai đều ở dưới lầu",
        "Cả hai đều ở trên lầu"
      ],
      "correctIndex": 1,
      "explanation": "Nguyên lý tâm điểm người nói: Về phía mình là 来, xa mình là 去."
    },
    "step6_speaking": {
      "prompt": "Mời ai đó bước vào phòng:",
      "targetSentence": "请进，快请进来！",
      "targetPinyin": "Qǐng jìn, kuài qǐng jìnlái!",
      "targetMeaning": "Mời vào, mau vào đây đi!",
      "hint": "Đọc jìnlái thanh 4 và thanh nhẹ."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Anh ấy đã về nhà rồi",
      "words": [
        "回家去了",
        "他已经"
      ],
      "correctOrder": [
        "他已经",
        "回家去了"
      ],
      "explanation": "他已经 + 回家去了."
    },
    "step8_quiz": [
      {
        "id": "q-303-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp có tân ngữ nơi chốn:",
        "options": [
          "他进去了教室",
          "他进教室去了",
          "教室进他去",
          "他去进教室"
        ],
        "correctIndex": 1,
        "explanation": "Nơi chốn bắt buộc nằm kẹp ở giữa: 进教室去."
      },
      {
        "id": "q-303-2",
        "type": "multiple-choice",
        "question": "Nếu bạn đang ở trong nhà và gọi bạn bè ngoài sân vào, bạn sẽ nói:",
        "options": [
          "你出去吧",
          "你进来吧",
          "你上去吧",
          "你下去吧"
        ],
        "correctIndex": 1,
        "explanation": "Vào về phía mình đang đứng trong nhà dùng 进来."
      }
    ],
    "step9_challenge": {
      "title": "Điều hướng không gian",
      "taskDesc": "Đọc to câu: 'Xin mời bước vào đây ngồi, bố tôi đã về nhà rồi'.",
      "targetPhrase": "qǐng jìnlái zuò wǒ bàba huí jiā lái le",
      "xpReward": 50,
      "badge": "La Bàn Đa Chiều"
    }
  },

  {
    "id": "l-304",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 4,
    "title": "Bổ ngữ Xu hướng Kép (跑出来, 走过去, 拿出来)",
    "chineseTitle": "复合趋向补语（动词 + 上/下/进/出/回/过/起 + 来/去）",
    "subtitle": "Diễn đạt chuyển động phức tạp tinh tế: V + Bổ ngữ xu hướng kép (跑出来 - chạy vụt ra, 拿出来 - lấy đồ ra).",
    "objective": "Nắm vững cấu trúc Bổ ngữ xu hướng kép và miêu tả sinh động mọi chuyển động trong đời sống.",
    "prerequisite": "Đã hoàn thành Bài 303.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng bổ ngữ xu hướng kép.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ xu hướng kép",
      "跑出来",
      "拿出来",
      "Ngữ pháp nâng cao"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Xu hướng Kép: Động từ + (上/下/进/出/回/过/起) + (来/去)",
      "summary": "Kết hợp động từ hành động cụ thể với hướng di chuyển: 跑出来 (Chạy lao ra ngoài), 走过去 (Đi bước sang bên kia), 拿出来 (Lấy lôi từ trong túi ra ngoài).",
      "audioDemoText": "tā cóng fángjiān pǎo chūlái le, qǐng bǎ hùzhào ná chūlái"
    },
    "step2_vocabulary": [
      {
        "id": "v-304-1",
        "hanzi": "跑",
        "pinyin": "pǎo",
        "hanviet": "Bào",
        "meaning": "Chạy",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "跑得很快。",
          "pinyin": "Pǎo de hěn kuài.",
          "meaning": "Chạy rất nhanh."
        }
      },
      {
        "id": "v-304-2",
        "hanzi": "跑出来",
        "pinyin": "pǎo chūlái",
        "hanviet": "Bào xuất lai",
        "meaning": "Chạy vọt ra ngoài này",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "小狗跑出来了。",
          "pinyin": "Xiǎogǒu pǎo chūlái le.",
          "meaning": "Chú chó con chạy vọt ra ngoài rồi."
        }
      },
      {
        "id": "v-304-3",
        "hanzi": "拿出来",
        "pinyin": "ná chūlái",
        "hanviet": "Nã xuất lai",
        "meaning": "Lấy ra, rút ra",
        "radical": "手 (Thủ)",
        "example": {
          "hanzi": "把护照拿出来。",
          "pinyin": "Bǎ hùzhào ná chūlái.",
          "meaning": "Lấy cuốn hộ chiếu ra."
        }
      },
      {
        "id": "v-304-4",
        "hanzi": "站起来",
        "pinyin": "zhàn qǐlái",
        "hanviet": "Trạm khởi lai",
        "meaning": "Đứng dậy",
        "radical": "立 (Lập)",
        "example": {
          "hanzi": "请大家站起来。",
          "pinyin": "Qǐng dàjiā zhàn qǐlái.",
          "meaning": "Mời mọi người đứng dậy."
        }
      },
      {
        "id": "v-304-5",
        "hanzi": "带回去",
        "pinyin": "dài huíqù",
        "hanviet": "Đái hồi khứ",
        "meaning": "Mang về lại bên đó",
        "radical": "巾 (Cân)",
        "example": {
          "hanzi": "把礼物带回去。",
          "pinyin": "Bǎ lǐwù dài huíqù.",
          "meaning": "Mang món quà về lại."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "跑",
        "pinyin": "pǎo",
        "meaning": "Chạy nhảy",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Túc (足) bên trái -> Chữ Bao (包) bên phải",
        "components": "足 + 包",
        "mnemonic": "Đôi chân (Túc) thoăn thoắt ôm bao đồ (Bao) chạy thật nhanh."
      },
      {
        "hanzi": "带",
        "pinyin": "dài",
        "meaning": "Mang theo, dải băng",
        "strokesCount": 9,
        "strokeOrderText": "Ba nét trên -> Khung Mịch (冖) -> Bộ Cân (巾) ở dưới",
        "components": "廿 + 冖 + 巾",
        "mnemonic": "Thắt dải đai lưng (Cân) để mang theo đồ đạc bên mình."
      }
    ],
    "step4_grammar": {
      "title": "Vị trí của Tân ngữ chỉ sự vật trong Bổ ngữ Xu hướng Kép",
      "formula": "Động từ + (Xu hướng 1) + TÂN NGỮ ĐỒ VẬT + 来/去  HOẶC  Động từ + Xu hướng kép + Tân ngữ",
      "explanation": "Ví dụ: 拿出护照来 HOẶC 拿出来护照 (Cả hai cách đều đúng khi tân ngữ là đồ vật thông thường).",
      "examples": [
        {
          "hanzi": "安检的时候，请把电脑从包里拿出来。",
          "pinyin": "Ānjiǎn de shíhou, qǐng bǎ diànnǎo cóng bāo lǐ ná chūlái.",
          "meaning": "Khi kiểm tra an ninh, xin hãy lấy máy tính từ trong túi xách ra."
        }
      ],
      "commonMistake": {
        "wrong": "站起去 ❌",
        "correct": "站起来 ✔️",
        "explanation": "Chuyển động từ thấp lên cao luôn đi với 起来 (Khởi lai)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Nhân viên an ninh",
          "hanzi": "先生您好，请把您包里的笔记本电脑和水瓶拿出来放在盒子里。",
          "pinyin": "Xiānsheng nín hǎo, qǐng bǎ nín bāo lǐ de bǐjìběn diànnǎo hé shuǐpíng ná chūlái fàng zài hézi lǐ.",
          "meaning": "Chào anh, xin hãy lấy máy tính xách tay và chai nước trong túi ra đặt vào trong khay nhé."
        }
      ],
      "audioText": "请把您包里的笔记本电脑和水瓶拿出来放在盒子里。",
      "question": "Nhân viên an ninh yêu cầu hành khách làm gì?",
      "options": [
        "Đóng túi lại",
        "Lấy máy tính và chai nước ra (ná chūlái)",
        "Uống hết nước",
        "Bỏ máy tính đi"
      ],
      "correctIndex": 1,
      "explanation": "Yêu cầu: 拿出来放在盒子里."
    },
    "step6_speaking": {
      "prompt": "Đọc câu hướng dẫn đứng dậy:",
      "targetSentence": "请大家站起来。",
      "targetPinyin": "Qǐng dàjiā zhàn qǐlái.",
      "targetMeaning": "Mời mọi người đứng dậy.",
      "hint": "Đọc zhàn qǐlái dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Lấy hộ chiếu ra",
      "words": [
        "拿出来",
        "把护照"
      ],
      "correctOrder": [
        "把护照",
        "拿出来"
      ],
      "explanation": "把护照 + 拿出来."
    },
    "step8_quiz": [
      {
        "id": "q-304-1",
        "type": "multiple-choice",
        "question": "Hành động 'Đứng dậy' trong tiếng Trung nói là:",
        "options": [
          "站下去",
          "站出来",
          "站起来 (zhàn qǐlái)",
          "站过去"
        ],
        "correctIndex": 2,
        "explanation": "Hướng từ dưới lên dùng 起来: 站起来."
      },
      {
        "id": "q-304-2",
        "type": "multiple-choice",
        "question": "Từ '拿出来' (ná chūlái) có nghĩa là gì?",
        "options": [
          "Cất vào trong",
          "Lấy ra / Lôi ra ngoài này",
          "Vứt đi",
          "Mua về"
        ],
        "correctIndex": 1,
        "explanation": "拿出来 là lấy ra ngoài."
      }
    ],
    "step9_challenge": {
      "title": "Khẩu lệnh chuẩn xác",
      "taskDesc": "Đọc to câu: 'Khi qua an ninh, xin hãy lấy hộ chiếu và máy tính ra'.",
      "targetPhrase": "qǐng bǎ hùzhào hé diànnǎo ná chūlái",
      "xpReward": 50,
      "badge": "Bậc Thầy Chuyển Động"
    }
  },

  {
    "id": "l-305",
    "chapterId": "ch-9",
    "levelId": "lvl-3",
    "lessonNumber": 5,
    "title": "Ôn tập Module 3.1 & Xử lý tình huống du lịch tự túc",
    "chineseTitle": "模块3.1总复习与自由行独立沟通挑战",
    "subtitle": "Tổng kết đàm thoại du lịch độc lập: Check-in, sân bay, chỉ hướng bổ ngữ xu hướng và đấu Boss Chapter 9.",
    "objective": "Tự tin xử lý 100% tình huống du lịch tự túc tại Trung Quốc không cần người phiên dịch đi kèm.",
    "prerequisite": "Đã hoàn thành Bài 301–304.",
    "completionCriteria": "Đạt >= 80% điểm bài tập tổng kết Module 3.1.",
    "durationMinutes": 25,
    "xpReward": 60,
    "tags": [
      "HSK 3",
      "Tổng kết Module",
      "Du lịch tự túc",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-7"
    ],
    "step1_learn": {
      "topic": "Bộ cẩm nang sinh tồn du lịch tự túc 3 ngày tại Trung Quốc",
      "summary": "1. Sân bay: 办理登机, 托运行李, 准时起飞. 2. Khách sạn: 办理入住, 交押金, 拿房卡. 3. Không gian: 进教室去, 拿出来, 站起来.",
      "audioDemoText": "zìyóuxíng hěn fāngbiàn, wǒ néng dúlì jiějué wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-305-1",
        "hanzi": "自由行",
        "pinyin": "zìyóuxíng",
        "hanviet": "Tự do hành",
        "meaning": "Du lịch tự túc",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "我喜欢自由行。",
          "pinyin": "Wǒ xǐhuan zìyóuxíng.",
          "meaning": "Tôi thích du lịch tự túc."
        }
      },
      {
        "id": "v-305-2",
        "hanzi": "独立",
        "pinyin": "dúlì",
        "hanviet": "Độc lập",
        "meaning": "Độc lập, tự chủ",
        "radical": "犭 (Khuyển)",
        "example": {
          "hanzi": "独立生活。",
          "pinyin": "Dúlì shēnghuó.",
          "meaning": "Cuộc sống độc lập."
        }
      },
      {
        "id": "v-305-3",
        "hanzi": "解决",
        "pinyin": "jiějué",
        "hanviet": "Giải quyết",
        "meaning": "Giải quyết",
        "radical": "角 (Giác)",
        "example": {
          "hanzi": "解决问题。",
          "pinyin": "Jiějué wèntí.",
          "meaning": "Giải quyết vấn đề."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "独",
        "pinyin": "dú",
        "meaning": "Một mình, độc lập",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Khuyển (犭) bên trái -> Bộ Trùng (虫) bên phải",
        "components": "犭 + 虫",
        "mnemonic": "Con thú đơn độc kiên cường tự lập giữa thiên nhiên."
      },
      {
        "hanzi": "解",
        "pinyin": "jiě",
        "meaning": "Mở ra, giải tỏa (Giải)",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Giác (角) -> Chữ Đao (刀) -> Bộ Ngưu (牛)",
        "components": "角 + 刀 + 牛",
        "mnemonic": "Cầm con dao sắc (Đao) mổ trâu (Ngưu) tách sừng (Giác) giải quyết công việc."
      }
    ],
    "step4_grammar": {
      "title": "Mẫu câu tự tin giải quyết vấn đề của học viên HSK 3",
      "formula": "没问题，我自己可以解决！ (Méi wèntí, wǒ zìjǐ kěyǐ jiějué!)",
      "explanation": "Khẳng định bước chuyển mình từ người học thụ động sang người sử dụng tiếng Trung độc lập trong mọi hoàn cảnh.",
      "examples": [
        {
          "hanzi": "虽然这是我第一次来中国，但是这些问题我都能独立解决。",
          "pinyin": "Suīrán zhè shì wǒ dì yī cì lái Zhōngguó, dànshì zhèxiē wèntí wǒ dōu néng dúlì jiějué.",
          "meaning": "Mặc dù đây là lần đầu tiên tôi đến Trung Quốc, nhưng những vấn đề này tôi đều có thể tự mình giải quyết."
        }
      ],
      "commonMistake": {
        "wrong": "Nói ngập ngừng thiếu tự tin.",
        "correct": "Sử dụng câu ngắn dứt khoát kết hợp bổ ngữ xu hướng.",
        "explanation": "Khí chất của người giao tiếp độc lập."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Bạn bè",
          "hanzi": "你一个人去北京旅游，不用找导游吗？",
          "pinyin": "Nǐ yí gè rén qù Běijīng lǚyóu, bú yòng zhǎo dǎoyóu ma?",
          "meaning": "Bạn đi du lịch Bắc Kinh một mình, không cần tìm hướng dẫn viên à?"
        },
        {
          "speaker": "Thí sinh",
          "hanzi": "不用，我已经通过了HSK 2级，现在学到了HSK 3级，订酒店、坐地铁、买东西我都能自己搞定！",
          "pinyin": "Bú yòng, wǒ yǐjīng tōngguò le HSK èr jí, xiànzài xué dào le HSK sān jí, dìng jiǔdiàn, zuò dìtiě, mǎi dōngxi wǒ dōu néng zìjǐ gǎodìng!",
          "meaning": "Không cần đâu, tôi đã thi đậu HSK 2 và đang học HSK 3 rồi, đặt phòng, đi tàu điện, mua sắm tôi đều tự lo được hết!"
        }
      ],
      "audioText": "订酒店、坐地铁、买东西我都能自己搞定！",
      "question": "Thí sinh tự tin làm được những việc gì một mình?",
      "options": [
        "Không làm được gì",
        "Tự đặt phòng, đi lại, mua sắm độc lập (zìjǐ gǎodìng)",
        "Cần người phiên dịch kè kè",
        "Đi lạc đường"
      ],
      "correctIndex": 1,
      "explanation": "Thí sinh khẳng định: 都能自己搞定."
    },
    "step6_speaking": {
      "prompt": "Tuyên bố khả năng tự lập của bạn:",
      "targetSentence": "没问题，我能自己解决！",
      "targetPinyin": "Méi wèntí, wǒ néng zìjǐ jiějué!",
      "targetMeaning": "Không vấn đề gì, tôi có thể tự giải quyết!",
      "hint": "Đọc tràn đầy năng lượng và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi thích đi du lịch tự túc",
      "words": [
        "自由行",
        "喜欢",
        "我"
      ],
      "correctOrder": [
        "我",
        "喜欢",
        "自由行"
      ],
      "explanation": "我 + 喜欢 + 自由行."
    },
    "step8_quiz": [
      {
        "id": "q-305-1",
        "type": "multiple-choice",
        "question": "Từ '自由行' (zìyóuxíng) mang nghĩa là hình thức du lịch nào?",
        "options": [
          "Du lịch theo đoàn tour",
          "Du lịch tự túc / Tự do khám phá",
          "Đi công tác",
          "Về quê"
        ],
        "correctIndex": 1,
        "explanation": "自由行 là du lịch tự túc."
      },
      {
        "id": "q-305-2",
        "type": "multiple-choice",
        "question": "Dấu mốc của Level 3 (HSK 3) được gọi là:",
        "options": [
          "Khởi đầu bỡ ngỡ",
          "Mốc chuyển mình: Giao tiếp độc lập",
          "Bậc thầy dịch thuật",
          "Chuyên gia văn học"
        ],
        "correctIndex": 1,
        "explanation": "HSK 3 là cột mốc chuyển mình sang giao tiếp độc lập."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 9",
      "taskDesc": "Vượt qua thử thách du lịch độc lập để sẵn sàng đối đầu Boss Sân bay Bắc Kinh!",
      "targetPhrase": "wǒ néng dúlì zài zhōngguó zìyóuxíng",
      "xpReward": 60,
      "badge": "Phượt Thủ Tự Lập"
    }
  },

  {
    "id": "l-306",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 6,
    "title": "Bổ ngữ Kết quả cơ bản (做完, 学好, 听懂, 看见, 找到)",
    "chineseTitle": "结果补语核心（做完、学好、听懂、看见）",
    "subtitle": "Ngữ pháp linh hồn: Động từ + Bổ ngữ kết quả (完, 好, 懂, 见, 到) biểu thị hành động đã đạt kết quả.",
    "objective": "Sử dụng thành thạo bổ ngữ kết quả để diễn tả đã làm xong, học giỏi, nghe hiểu, nhìn thấy.",
    "prerequisite": "Đã hoàn thành Module 3.1.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng chính xác các bổ ngữ kết quả thông dụng.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ kết quả",
      "做完",
      "听懂",
      "学好"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Kết quả: Động từ + Kết quả (完 / 好 / 懂 / 见 / 到)",
      "summary": "1. 完 (xong): 做完, 吃完, 看完. 2. 好 (chuẩn/tốt đẹp): 准备好, 学好. 3. 懂 (hiểu): 听懂, 看懂. 4. 见 (nhận thấy qua giác quan): 看见, 听见. 5. 到 (đạt được mục tiêu): 找到, 买到.",
      "audioDemoText": "wǒ zuò wán zuòyè le, wǒ tīng dǒng le, wǒ zhǎo dào shǒujī le"
    },
    "step2_vocabulary": [
      {
        "id": "v-306-1",
        "hanzi": "完",
        "pinyin": "wán",
        "hanviet": "Hoàn",
        "meaning": "Xong, hết",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "做完练习。",
          "pinyin": "Zuò wán liànxí.",
          "meaning": "Làm xong bài tập."
        }
      },
      {
        "id": "v-306-2",
        "hanzi": "懂",
        "pinyin": "dǒng",
        "hanviet": "Đổng",
        "meaning": "Hiểu",
        "radical": "忄 (Tâm)",
        "example": {
          "hanzi": "我听懂了。",
          "pinyin": "Wǒ tīng dǒng le.",
          "meaning": "Tôi nghe hiểu rồi."
        }
      },
      {
        "id": "v-306-3",
        "hanzi": "看见",
        "pinyin": "kànjiàn",
        "hanviet": "Khán kiến",
        "meaning": "Nhìn thấy",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "看见他了吗？",
          "pinyin": "Kànjiàn tā le ma?",
          "meaning": "Nhìn thấy anh ấy chưa?"
        }
      },
      {
        "id": "v-306-4",
        "hanzi": "找到",
        "pinyin": "zhǎodào",
        "hanviet": "Trảo đáo",
        "meaning": "Tìm thấy, kiếm được",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "找到了钱包。",
          "pinyin": "Zhǎodào le qiánbāo.",
          "meaning": "Đã tìm thấy ví tiền."
        }
      },
      {
        "id": "v-306-5",
        "hanzi": "清楚",
        "pinyin": "qīngchu",
        "hanviet": "Thanh sở",
        "meaning": "Rõ ràng",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "听得清楚。",
          "pinyin": "Tīng de qīngchu.",
          "meaning": "Nghe được rõ ràng."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "完",
        "pinyin": "wán",
        "meaning": "Hoàn thành, trọn vẹn",
        "strokesCount": 7,
        "strokeOrderText": "Mái nhà (宀) -> Bộ Nguyên (元)",
        "components": "宀 + 元",
        "mnemonic": "Cất nóc mái nhà nguyên vẹn tượng trưng công trình đã hoàn thành."
      },
      {
        "hanzi": "懂",
        "pinyin": "dǒng",
        "meaning": "Hiểu biết (Đổng)",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Tâm đứng (忄) bên trái -> Chữ Trọng (重) bên phải",
        "components": "忄 + 重",
        "mnemonic": "Con tim thấu hiểu những trọng tâm sâu sắc."
      }
    ],
    "step4_grammar": {
      "title": "Phủ định của Bổ ngữ Kết quả: 没 + Động từ + Kết quả (KHÔNG DÙNG 不)",
      "formula": "Khẳng định: V + Kết quả + 了. Phủ định: 没(有) + V + Kết quả (BỎ 了).",
      "explanation": "Bổ ngữ kết quả biểu thị việc đã xảy ra, nên phủ định BẮT BUỘC dùng 没. Tuyệt đối không dùng 不.",
      "examples": [
        {
          "hanzi": "我还没做完作业。（ĐÚNG）  /  我不做完作业。（SAI ❌）",
          "pinyin": "Wǒ hái méi zuò wán zuòyè.",
          "meaning": "Tôi vẫn chưa làm xong bài tập về nhà."
        }
      ],
      "commonMistake": {
        "wrong": "我不听懂 ❌",
        "correct": "我没听懂 ✔️",
        "explanation": "Phủ định bổ ngữ kết quả luôn luôn dùng 没."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "今天的作业你写完了吗？",
          "pinyin": "Jīntiān de zuòyè nǐ xiě wán le ma?",
          "meaning": "Bài tập hôm nay bạn viết xong chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "我都写完了，而且老师讲的新课我也全听懂了。",
          "pinyin": "Wǒ dōu xiě wán le, érqiě lǎoshī jiǎng de xīn kè wǒ yě quán tīng dǒng le.",
          "meaning": "Tôi viết xong hết rồi, vả lại bài mới thầy giảng tôi cũng nghe hiểu hết cả rồi."
        }
      ],
      "audioText": "我都写完了，而且老师讲的新课我也全听懂了。",
      "question": "Người B đã hoàn thành những gì?",
      "options": [
        "Chưa viết bài",
        "Viết xong bài và nghe hiểu toàn bộ bài giảng (xiě wán le, tīng dǒng le)",
        "Không hiểu bài",
        "Mới làm được một nửa"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 写完了，全听懂了."
    },
    "step6_speaking": {
      "prompt": "Khẳng định bạn đã nghe hiểu:",
      "targetSentence": "我全都听懂了。",
      "targetPinyin": "Wǒ quándōu tīng dǒng le.",
      "targetMeaning": "Tôi nghe hiểu toàn bộ rồi.",
      "hint": "Đọc tīng dǒng thanh 1 và 3 rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tôi vẫn chưa làm xong bài tập",
      "words": [
        "作业",
        "还没做完",
        "我"
      ],
      "correctOrder": [
        "我",
        "还没做完",
        "作业"
      ],
      "explanation": "我 + 还没做完 + 作业."
    },
    "step8_quiz": [
      {
        "id": "q-306-1",
        "type": "multiple-choice",
        "question": "Chọn câu phủ định đúng với bổ ngữ kết quả:",
        "options": [
          "我不买到票",
          "我没买到票",
          "我买不到票了",
          "我买没票"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định bổ ngữ kết quả dùng 没: 我没买到票."
      },
      {
        "id": "q-306-2",
        "type": "multiple-choice",
        "question": "Từ '完' trong '吃完了' đóng vai trò ngữ pháp là gì?",
        "options": [
          "Bổ ngữ xu hướng",
          "Bổ ngữ kết quả",
          "Bổ ngữ thời lượng",
          "Trạng từ"
        ],
        "correctIndex": 1,
        "explanation": "完 là bổ ngữ kết quả chỉ sự hoàn tất."
      }
    ],
    "step9_challenge": {
      "title": "Báo cáo tiến độ chuẩn",
      "taskDesc": "Đọc to câu: 'Tôi đã chuẩn bị xong tất cả và tìm thấy hộ chiếu rồi'.",
      "targetPhrase": "wǒ zhǔnbèi hǎo le zhǎodào hùzhào le",
      "xpReward": 50,
      "badge": "Hoàn Tất Xuất Sắc"
    }
  },

  {
    "id": "l-307",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 7,
    "title": "Bổ ngữ Khả năng (看得懂, 听不清楚, 买不起)",
    "chineseTitle": "可能补语（动词 + 得/不 + 结果/趋向）",
    "subtitle": "Diễn đạt có thể hay không thể đạt được kết quả: V + 得/不 + Kết quả (看得懂 - xem hiểu được, 听不清 - nghe không rõ).",
    "objective": "Làm chủ bổ ngữ khả năng để phản xạ nhanh: có hiểu được không, có làm kịp không, có mua nổi không.",
    "prerequisite": "Đã hoàn thành Bài 306.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng cấu trúc V+得/不+Bổ ngữ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Bổ ngữ khả năng",
      "看得懂",
      "听不清楚",
      "Ngữ pháp HSK 3"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Bổ ngữ Khả năng: Khẳng định (V + 得 + Kết quả) vs Phủ định (V + 不 + Kết quả)",
      "summary": "Khẳng định: 看得懂 (Đọc hiểu được), 做得完 (Làm kịp/làm hết được). Phủ định: 看不懂 (Không đọc hiểu được), 做不完 (Không làm xuể/không kịp), 听不清楚 (Nghe không rõ ràng).",
      "audioDemoText": "nǐ kàn de dǒng ma, wǒ kàn bu dǒng, tài guì le wǒ mǎi bu qǐ"
    },
    "step2_vocabulary": [
      {
        "id": "v-307-1",
        "hanzi": "看得懂",
        "pinyin": "kàn de dǒng",
        "hanviet": "Khán đắc đổng",
        "meaning": "Xem/đọc hiểu được",
        "radical": "目 (Mục)",
        "example": {
          "hanzi": "你看得懂中文报纸吗？",
          "pinyin": "Nǐ kàn de dǒng Zhōngwén bàozhǐ ma?",
          "meaning": "Bạn đọc hiểu được báo tiếng Trung không?"
        }
      },
      {
        "id": "v-307-2",
        "hanzi": "听不懂",
        "pinyin": "tīng bu dǒng",
        "hanviet": "Thính bất đổng",
        "meaning": "Nghe không hiểu",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "说太快我听不懂。",
          "pinyin": "Shuō tài kuài wǒ tīng bu dǒng.",
          "meaning": "Nói nhanh quá tôi nghe không hiểu."
        }
      },
      {
        "id": "v-307-3",
        "hanzi": "买得起",
        "pinyin": "mǎi de qǐ",
        "hanviet": "Mãi đắc khởi",
        "meaning": "Mua nổi, đủ tiền mua",
        "radical": "乙 (Ất)",
        "example": {
          "hanzi": "太贵了买不起。",
          "pinyin": "Tài guì le mǎi bu qǐ.",
          "meaning": "Đắt quá mua không nổi."
        }
      },
      {
        "id": "v-307-4",
        "hanzi": "做不完",
        "pinyin": "zuò bu wán",
        "hanviet": "Tác bất hoàn",
        "meaning": "Làm không hết, không xong xuể",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "作业太多做不完。",
          "pinyin": "Zuòyè tài duō zuò bu wán.",
          "meaning": "Bài tập nhiều quá làm không hết."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "得",
        "pinyin": "de",
        "meaning": "Được (trong Bổ ngữ khả năng)",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Xích (彳) bên trái -> Chữ Đắc (㝵) bên phải",
        "components": "彳 + 㝵",
        "mnemonic": "Bước chân đi (Xích) tìm được ánh mặt trời ban mai (Đán) và tấc đất (Thốn)."
      }
    ],
    "step4_grammar": {
      "title": "Phân biệt Bổ ngữ Khả năng (看得懂) vs 能 + Động từ (能看懂)",
      "formula": "Bổ ngữ khả năng (V + 得/不 + Kết quả) là khẩu ngữ tự nhiên số 1 của người bản xứ",
      "explanation": "Người Việt hay nói '能看懂' theo thói quen dịch từng chữ, nhưng người Trung Quốc 90% sẽ nói '看得懂' hoặc '看不懂'.",
      "examples": [
        {
          "hanzi": "你说得太快了，我听不清楚，请慢一点儿。",
          "pinyin": "Nǐ shuō de tài kuài le, wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.",
          "meaning": "Bạn nói nhanh quá, tôi nghe không rõ, xin nói chậm lại một chút."
        }
      ],
      "commonMistake": {
        "wrong": "不能看懂 (nghe cứng nhắc dịch máy)",
        "correct": "看不懂 ✔️",
        "explanation": "Bổ ngữ khả năng tự nhiên, bản xứ hơn nhiều."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这本全中文的小说，你看得懂吗？",
          "pinyin": "Zhè běn quán Zhōngwén de xiǎoshuō, nǐ kàn de dǒng ma?",
          "meaning": "Cuốn tiểu thuyết toàn tiếng Trung này, bạn đọc có hiểu nổi không?"
        },
        {
          "speaker": "B",
          "hanzi": "借助生词表的话，大部分我都能看得懂！",
          "pinyin": "Jièzhù shēngcíbiǎo dehuà, dà bùfen wǒ dōu néng kàn de dǒng!",
          "meaning": "Nếu dựa vào bảng từ mới thì đại bộ phận tôi đều đọc hiểu được!"
        }
      ],
      "audioText": "这本全中文的小说，你看得懂吗？大部分我都能看得懂！",
      "question": "Người B có đọc hiểu được cuốn tiểu thuyết không?",
      "options": [
        "Không hiểu một chữ nào",
        "Đại bộ phận đều đọc hiểu được (dà bùfen kàn de dǒng)",
        "Chỉ đọc được mục lục",
        "Không thích đọc"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 大部分我都能看得懂."
    },
    "step6_speaking": {
      "prompt": "Nói bạn nghe không rõ, xin nói chậm lại:",
      "targetSentence": "我听不清楚，请慢一点儿。",
      "targetPinyin": "Wǒ tīng bu qīngchu, qǐng màn yìdiǎnr.",
      "targetMeaning": "Tôi nghe không rõ, xin chậm một chút.",
      "hint": "Đọc tīng bu qīngchu mượt mà."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Bạn có đọc hiểu không?",
      "words": [
        "看得懂吗",
        "你"
      ],
      "correctOrder": [
        "你",
        "看得懂吗"
      ],
      "explanation": "你 + 看得懂吗."
    },
    "step8_quiz": [
      {
        "id": "q-307-1",
        "type": "multiple-choice",
        "question": "Dạng phủ định của '看得懂' (Đọc hiểu được) là:",
        "options": [
          "不看懂",
          "看不懂 (kàn bu dǒng)",
          "没看得懂",
          "看得不懂"
        ],
        "correctIndex": 1,
        "explanation": "Phủ định bổ ngữ khả năng thay 得 bằng 不: 看不懂."
      },
      {
        "id": "q-307-2",
        "type": "multiple-choice",
        "question": "Cụm '买不起' (mǎi bu qǐ) mang nghĩa:",
        "options": [
          "Không muốn mua",
          "Không mua nổi (vì quá đắt/không đủ tiền)",
          "Đã mua rồi",
          "Mua rẻ"
        ],
        "correctIndex": 1,
        "explanation": "买不起 là không đủ năng lực tài chính để mua."
      }
    ],
    "step9_challenge": {
      "title": "Làm chủ khả năng",
      "taskDesc": "Đọc to câu: 'Bài tập này tuy khó nhưng tôi làm hết được'.",
      "targetPhrase": "zhè ge zuòyè wǒ zuò de wán",
      "xpReward": 50,
      "badge": "Khả Năng Vô Hạn"
    }
  },

  {
    "id": "l-308",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 8,
    "title": "Linh hồn ngữ pháp: Câu chữ 把 căn bản (S + 把 + O + V + khác)",
    "chineseTitle": "“把”字句核心法则（S + 把 + O + 动词 + 其他成分）",
    "subtitle": "Ngữ pháp tối quan trọng của tiếng Trung: Đưa tân ngữ lên trước để diễn tả sự tác động, xử lý của chủ ngữ.",
    "objective": "Làm chủ 100% bản chất câu chữ 把 căn bản và chuyển đổi câu SVO thông thường sang câu chữ 把.",
    "prerequisite": "Đã hoàn thành Bài 307.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và đổi đúng 3 câu SVO sang câu chữ 把.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu chữ 把",
      "Linh hồn ngữ pháp",
      "Ngữ pháp trọng điểm"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức kinh điển Câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
      "summary": "Câu chữ 把 dùng khi chủ ngữ TÁC ĐỘNG vào tân ngữ làm tân ngữ THAY ĐỔI VỊ TRÍ HOẶC TRẠNG THÁI. Động từ không bao giờ đứng trơ trọi một mình, phải có thành phần khác đi kèm (了, Bổ ngữ, Trùng điệp).",
      "audioDemoText": "wǒ bǎ zuòyè zuò wán le, qǐng bǎ mén guān shàng, tā bǎ píngguǒ chī le"
    },
    "step2_vocabulary": [
      {
        "id": "v-308-1",
        "hanzi": "把",
        "pinyin": "bǎ",
        "hanviet": "Bả",
        "meaning": "Đem, lấy (giới từ câu chữ 把)",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "把书给我。",
          "pinyin": "Bǎ shū gěi wǒ.",
          "meaning": "Đưa sách cho tôi."
        }
      },
      {
        "id": "v-308-2",
        "hanzi": "放",
        "pinyin": "fàng",
        "hanviet": "Phóng",
        "meaning": "Đặt, để",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "把包放在桌子上。",
          "pinyin": "Bǎ bāo fàng zài zhuōzi shàng.",
          "meaning": "Đặt túi xách lên trên bàn."
        }
      },
      {
        "id": "v-308-3",
        "hanzi": "关上",
        "pinyin": "guānshàng",
        "hanviet": "Quan thượng",
        "meaning": "Đóng lại",
        "radical": "丷 (Bát)",
        "example": {
          "hanzi": "把门关上。",
          "pinyin": "Bǎ mén guānshàng.",
          "meaning": "Đóng cửa lại."
        }
      },
      {
        "id": "v-308-4",
        "hanzi": "洗",
        "pinyin": "xǐ",
        "hanviet": "Tẩy",
        "meaning": "Rửa, giặt",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "把衣服洗干净。",
          "pinyin": "Bǎ yīfu xǐ gānjìng.",
          "meaning": "Giặt quần áo sạch sẽ."
        }
      },
      {
        "id": "v-308-5",
        "hanzi": "干净",
        "pinyin": "gānjìng",
        "hanviet": "Can tịnh",
        "meaning": "Sạch sẽ",
        "radical": "干 (Can)",
        "example": {
          "hanzi": "房间很干净。",
          "pinyin": "Fángjiān hěn gānjìng.",
          "meaning": "Căn phòng rất sạch sẽ."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "把",
        "pinyin": "bǎ",
        "meaning": "Cầm nắm, giới từ 把",
        "strokesCount": 7,
        "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Ba (巴) bên phải",
        "components": "扌 + 巴",
        "mnemonic": "Bàn tay (Thủ) nắm chặt lấy sự vật tác động xử lý."
      },
      {
        "hanzi": "洗",
        "pinyin": "xǐ",
        "meaning": "Tẩy rửa, giặt giũ",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thủy (氵) bên trái -> Chữ Tiên (先) bên phải",
        "components": "氵 + 先",
        "mnemonic": "Dùng nước sạch (Thủy) làm sạch trước tiên (Tiên)."
      }
    ],
    "step4_grammar": {
      "title": "4 Điều cấm kỵ tuyệt đối khi dùng Câu chữ 把",
      "formula": "1. Động từ không được đứng cô độc (phải có thành phần khác: 了, 在, 到, 成, Bổ ngữ). 2. Tân ngữ phải xác định (người nghe biết rõ là vật gì). 3. Không dùng cho động từ cảm xúc (喜欢, 觉得, 有, 是). 4. Phủ định (没) và Năng nguyện (想, 要) phải đứng TRƯỚC chữ 把.",
      "explanation": "Ví dụ phủ định: 我没把书带来 (ĐÚNG) / 我把书没带来 (SAI ❌).",
      "examples": [
        {
          "hanzi": "请你把门关上，外面很冷。",
          "pinyin": "Qǐng nǐ bǎ mén guānshàng, wàimiàn hěn lěng.",
          "meaning": "Xin bạn đóng cửa lại, bên ngoài rất lạnh."
        }
      ],
      "commonMistake": {
        "wrong": "我把书看 ❌ (động từ cô độc)",
        "correct": "我把书看完了 ✔️",
        "explanation": "Động từ câu chữ 把 bắt buộc có thành phần bổ trợ."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Mẹ",
          "hanzi": "儿子，你快把桌子上的牛奶喝了，然后把房间整理干净！",
          "pinyin": "Érzi, nǐ kuài bǎ zhuōzi shàng de niúnǎi hē le, ránhòu bǎ fángjiān zhěnglǐ gānjìng!",
          "meaning": "Con trai, con mau uống cốc sữa trên bàn đi, sau đó dọn dẹp phòng cho sạch sẽ nhé!"
        },
        {
          "speaker": "Con",
          "hanzi": "知道了妈妈，我马上把牛奶喝完！",
          "pinyin": "Zhīdào le māma, wǒ mǎshàng bǎ niúnǎi hē wán!",
          "meaning": "Con biết rồi mẹ ơi, con uống hết sữa ngay đây!"
        }
      ],
      "audioText": "你快把桌子上的牛奶喝了，然后把房间整理干净！",
      "question": "Người mẹ yêu cầu con trai xử lý những việc gì?",
      "options": [
        "Đi ngủ",
        "Uống sữa trên bàn và dọn sạch phòng (bǎ niúnǎi hē le, bǎ fángjiān zhěnglǐ gānjìng)",
        "Đi ra ngoài chơi",
        "Nấu cơm"
      ],
      "correctIndex": 1,
      "explanation": "Mẹ yêu cầu: 把牛奶喝了，把房间整理干净."
    },
    "step6_speaking": {
      "prompt": "Đọc câu chữ 把 yêu cầu đóng cửa:",
      "targetSentence": "请把门关上。",
      "targetPinyin": "Qǐng bǎ mén guānshàng.",
      "targetMeaning": "Xin hãy đóng cửa lại.",
      "hint": "Đọc bǎ mén guānshàng liền mạch."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu chữ 把: Tôi đã làm xong bài tập rồi",
      "words": [
        "做了完",
        "把作业",
        "我"
      ],
      "correctOrder": [
        "我",
        "把作业",
        "做了完"
      ],
      "explanation": "我 + 把作业 + 做完了."
    },
    "step8_quiz": [
      {
        "id": "q-308-1",
        "type": "multiple-choice",
        "question": "Trong câu chữ 把, từ phủ định '没' phải đứng ở vị trí nào?",
        "options": [
          "Đứng trước chữ 把 (S + 没 + 把 + O + V)",
          "Đứng sau chữ 把",
          "Đứng sau động từ",
          "Đứng cuối câu"
        ],
        "correctIndex": 0,
        "explanation": "Phó từ phủ định bắt buộc đứng trước 把: 我没把手机带来."
      },
      {
        "id": "q-308-2",
        "type": "multiple-choice",
        "question": "Câu nào sau đây phạm lỗi 'động từ đứng cô độc' trong câu chữ 把?",
        "options": [
          "我把苹果吃了",
          "我把书看",
          "我把衣服洗干净了",
          "我把门关上了"
        ],
        "correctIndex": 1,
        "explanation": "Câu '我把书看' sai vì động từ 看 không có thành phần bổ trợ."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy chữ 把",
      "taskDesc": "Đọc to câu: 'Tôi đã giặt sạch quần áo và đặt lên giường rồi'.",
      "targetPhrase": "wǒ bǎ yīfu xǐ gānjìng le fàng zài chuáng shàng",
      "xpReward": 50,
      "badge": "Bậc Thầy Chữ 把"
    }
  },

  {
    "id": "l-309",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 9,
    "title": "Câu chữ 把 nâng cao kết hợp Bổ ngữ kết quả & Xu hướng",
    "chineseTitle": "“把”字句进阶演练（把书交上去、把手机拿出来）",
    "subtitle": "Cấu trúc đỉnh cao của HSK 3: $S + 把 + O + V + Bổ ngữ kết quả / Bổ ngữ xu hướng phức hợp$.",
    "objective": "Kết hợp nhuần nhuyễn câu chữ 把 với các bổ ngữ xu hướng và bổ ngữ kết quả trong đàm thoại đời sống.",
    "prerequisite": "Đã hoàn thành Bài 308.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng câu chữ 把 nâng cao linh hoạt.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu chữ 把 nâng cao",
      "Bổ ngữ kết hợp",
      "Ngữ pháp đỉnh cao"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Cấu trúc 把 nâng cao: S + 把 + O + Động từ + (在 / 到 / 给 / 成 / 趋向补语)",
      "summary": "1. Thay đổi vị trí: 把书放到桌子上 (Để sách lên bàn). 2. Trao cho ai: 把作业交给老师 (Nộp bài cho thầy). 3. Chuyển dịch không gian: 把行李拿出来 (Lấy hành lý ra ngoài).",
      "audioDemoText": "qǐng bǎ zuòyè jiāo gěi lǎoshī, bǎ hùzhào ná chūlái, bǎ zhàopiàn fā gěi wǒ"
    },
    "step2_vocabulary": [
      {
        "id": "v-309-1",
        "hanzi": "交",
        "pinyin": "jiāo",
        "hanviet": "Giao",
        "meaning": "Giao nộp, kết bạn",
        "radical": "亠 (Đầu)",
        "example": {
          "hanzi": "交作业。",
          "pinyin": "Jiāo zuòyè.",
          "meaning": "Nộp bài tập."
        }
      },
      {
        "id": "v-309-2",
        "hanzi": "发",
        "pinyin": "fā",
        "hanviet": "Phát",
        "meaning": "Gửi, phát ra (tin nhắn, mail)",
        "radical": "又 (Hựu)",
        "example": {
          "hanzi": "把照片发给我。",
          "pinyin": "Bǎ zhàopiàn fā gěi wǒ.",
          "meaning": "Gửi ảnh cho tôi."
        }
      },
      {
        "id": "v-309-3",
        "hanzi": "搬",
        "pinyin": "bān",
        "hanviet": "Bàn",
        "meaning": "Chuyển, dọn (nhà, đồ nặng)",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "把桌子搬进去。",
          "pinyin": "Bǎ zhuōzi bān jìnqù.",
          "meaning": "Dọn bàn vào trong."
        }
      },
      {
        "id": "v-309-4",
        "hanzi": "借",
        "pinyin": "jiè",
        "hanviet": "Tá",
        "meaning": "Mượn, vay",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "把书借给我。",
          "pinyin": "Bǎ shū jiè gěi wǒ.",
          "meaning": "Cho tôi mượn sách."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "搬",
        "pinyin": "bān",
        "meaning": "Khuân vác, chuyển dọn",
        "strokesCount": 13,
        "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Bàn (般) bên phải",
        "components": "扌 + 般",
        "mnemonic": "Dùng bàn tay (Thủ) khuân vác thuyền bè đồ đạc dọn sang nơi mới."
      },
      {
        "hanzi": "借",
        "pinyin": "jiè",
        "meaning": "Mượn vay (Tá)",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Tích (昔) bên phải",
        "components": "亻 + 昔",
        "mnemonic": "Con người (亻) mượn lại ân tình của những ngày xưa cũ (Tích)."
      }
    ],
    "step4_grammar": {
      "title": "Mô hình chuyển giao: S + 把 + O + V + 给 / 到 + Người / Nơi chốn",
      "formula": "S + 把 + Đồ vật + 寄/送/交/带 + 给 + Đối tượng nhận",
      "explanation": "Khi muốn nói chuyển giao một đồ vật cho ai hoặc gửi tới đâu, bắt buộc phải dùng câu chữ 把 kết hợp giới từ 给 hoặc 到.",
      "examples": [
        {
          "hanzi": "请你把这份文件发给经理。",
          "pinyin": "Qǐng nǐ bǎ zhè fèn wénjiàn fā gěi jīnglǐ.",
          "meaning": "Xin bạn gửi tập tài liệu này cho giám đốc."
        }
      ],
      "commonMistake": {
        "wrong": "发这份文件给经理 ❌ (thiếu tự nhiên)",
        "correct": "把这份文件发给经理 ✔️",
        "explanation": "Dùng 把 câu văn chuẩn ngữ pháp và đĩnh đạc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Thầy giáo",
          "hanzi": "同学们，考试时间到了，请大家把试卷交上来！",
          "pinyin": "Tóngxuémen, kǎoshì shíjiān dào le, qǐng dàjiā bǎ shìjuàn jiāo shànglái!",
          "meaning": "Các em học sinh, hết giờ làm bài rồi, xin mọi người nộp bài thi lên đây!"
        },
        {
          "speaker": "Học sinh",
          "hanzi": "老师，我已经把名字写好了，把试卷放在讲台上了。",
          "pinyin": "Lǎoshī, wǒ yǐjīng bǎ míngzi xiě hǎo le, bǎ shìjuàn fàng zài jiǎngtái shàng le.",
          "meaning": "Thưa thầy, em đã ghi xong tên rồi, và đặt bài thi lên trên bục giảng rồi ạ."
        }
      ],
      "audioText": "请大家把试卷交上来！我已经把试卷放在讲台上了。",
      "question": "Học sinh đã làm gì với bài thi?",
      "options": [
        "Mang về nhà",
        "Đặt bài thi lên bục giảng (bǎ shìjuàn fàng zài jiǎngtái shàng)",
        "Xé bài thi",
        "Chưa làm xong"
      ],
      "correctIndex": 1,
      "explanation": "Học sinh nói: 把试卷放在讲台上了."
    },
    "step6_speaking": {
      "prompt": "Đọc câu nhờ gửi hình ảnh:",
      "targetSentence": "请把照片发给我。",
      "targetPinyin": "Qǐng bǎ zhàopiàn fā gěi wǒ.",
      "targetMeaning": "Xin hãy gửi ảnh cho tôi.",
      "hint": "Đọc fā gěi wǒ thanh 1, 3, 3."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Dọn chiếc bàn này vào trong phòng",
      "words": [
        "搬进房间去",
        "把这张桌子"
      ],
      "correctOrder": [
        "把这张桌子",
        "搬进房间去"
      ],
      "explanation": "把这张桌子 + 搬进房间去."
    },
    "step8_quiz": [
      {
        "id": "q-309-1",
        "type": "multiple-choice",
        "question": "Chọn câu đúng ngữ pháp nói 'Gửi tài liệu cho giám đốc':",
        "options": [
          "把文件发给经理",
          "发文件把经理",
          "经理把文件发",
          "给经理发把文件"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc chuẩn: 把文件发给经理."
      },
      {
        "id": "q-309-2",
        "type": "multiple-choice",
        "question": "Cụm '交上来' (jiāo shànglái) có nghĩa là:",
        "options": [
          "Nộp lên đây",
          "Cầm đi",
          "Bỏ xuống",
          "Giấu đi"
        ],
        "correctIndex": 0,
        "explanation": "Nộp bài lên trên hướng về phía thầy giáo."
      }
    ],
    "step9_challenge": {
      "title": "Thực chiến công sở",
      "taskDesc": "Đọc to câu: 'Tôi đã gửi bản kế hoạch cho giám đốc và dọn dẹp văn phòng xong rồi'.",
      "targetPhrase": "wǒ bǎ jìhuà fā gěi jīnglǐ le",
      "xpReward": 50,
      "badge": "Chuyên Gia Văn Phòng"
    }
  },

  {
    "id": "l-310",
    "chapterId": "ch-10",
    "levelId": "lvl-3",
    "lessonNumber": 10,
    "title": "Câu bị động chữ 被 (S + 被 + Tác nhân + V + khác)",
    "chineseTitle": "“被”字句与被动表达（钱包被偷了、被看见了）",
    "subtitle": "Diễn đạt sự việc bị động hoặc chịu tác động không mong muốn với chữ 被 (bèi), 叫 (jiào), 让 (ràng).",
    "objective": "Sử dụng thành thạo câu bị động chữ 被 để miêu tả các tình huống bị động trong cuộc sống.",
    "prerequisite": "Đã hoàn thành Bài 309.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và chuyển đổi linh hoạt giữa câu chữ 把 và câu chữ 被.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Câu bị động chữ 被",
      "Bị động",
      "Ngữ pháp HSK 3"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Công thức Câu bị động: Chủ ngữ (Người/Vật bị tác động) + 被 (bèi) + (Tác nhân) + Động từ + Thành phần khác",
      "summary": "Câu chữ 被 thường dùng trong tình huống không may mắn hoặc nhấn mạnh kết quả của đối tượng chịu trận: 钱包被偷了 (Ví tiền bị trộm rồi), 蛋糕被人吃了 (Bánh ngọt bị ai đó ăn mất rồi).",
      "audioDemoText": "wǒ de qiánbāo bèi tōu le, bēizi bèi dǎ suì le, tā bèi gōngsī lùqǔ le"
    },
    "step2_vocabulary": [
      {
        "id": "v-310-1",
        "hanzi": "被",
        "pinyin": "bèi",
        "hanviet": "Bị",
        "meaning": "Bị, được (giới từ bị động)",
        "radical": "衤 (Y)",
        "example": {
          "hanzi": "被发现了。",
          "pinyin": "Bèi fāxiàn le.",
          "meaning": "Bị phát hiện rồi."
        }
      },
      {
        "id": "v-310-2",
        "hanzi": "偷",
        "pinyin": "tōu",
        "hanviet": "Thâu",
        "meaning": "Trộm, cắp",
        "radical": "亻 (Nhân)",
        "example": {
          "hanzi": "自行车被偷了。",
          "pinyin": "Zìxíngchē bèi tōu le.",
          "meaning": "Xe đạp bị trộm mất rồi."
        }
      },
      {
        "id": "v-310-3",
        "hanzi": "钱包",
        "pinyin": "qiánbāo",
        "hanviet": "Tiền bao",
        "meaning": "Ví tiền, bóp tiền",
        "radical": "钅 (Kim)",
        "example": {
          "hanzi": "我的钱包呢？",
          "pinyin": "Wǒ de qiánbāo ne?",
          "meaning": "Ví tiền của tôi đâu rồi?"
        }
      },
      {
        "id": "v-310-4",
        "hanzi": "打碎",
        "pinyin": "dǎsuì",
        "hanviet": "Đả toái",
        "meaning": "Đánh vỡ, làm bể",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "杯子被打碎了。",
          "pinyin": "Bēizi bèi dǎsuì le.",
          "meaning": "Cái ly bị làm vỡ rồi."
        }
      },
      {
        "id": "v-310-5",
        "hanzi": "发现",
        "pinyin": "fāxiàn",
        "hanviet": "Phát hiện",
        "meaning": "Phát hiện, nhận ra",
        "radical": "又 (Hựu)",
        "example": {
          "hanzi": "被老师发现了。",
          "pinyin": "Bèi lǎoshī fāxiàn le.",
          "meaning": "Bị thầy giáo phát hiện rồi."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "被",
        "pinyin": "bèi",
        "meaning": "Bị, cái chăn",
        "strokesCount": 10,
        "strokeOrderText": "Bộ Y (衤) bên trái -> Bộ Bì (皮) bên phải",
        "components": "衤 + 皮",
        "mnemonic": "Tấm áo da khoác (Y + Bì) trùm phủ lên che chở hoặc bao phủ bị động."
      },
      {
        "hanzi": "偷",
        "pinyin": "tōu",
        "meaning": "Trộm cắp",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Chữ Du (俞) bên phải",
        "components": "亻 + 俞",
        "mnemonic": "Kẻ gian (Nhân) lén lút trộm đồ đạc của người khác."
      }
    ],
    "step4_grammar": {
      "title": "Mối quan hệ chuyển đổi tương hỗ giữa Câu chữ 把 và Câu chữ 被",
      "formula": "Tác nhân + 把 + Đối tượng + V + khác  ⟷  Đối tượng + 被 + (Tác nhân) + V + khác",
      "explanation": "Ví dụ: 弟弟吃了蛋糕 (Chủ động) ➔ 弟弟把蛋糕吃了 (Nhấn mạnh xử lý) ➔ 蛋糕被弟弟吃了 (Nhấn mạnh bánh bị mất).",
      "examples": [
        {
          "hanzi": "小偷把我的自行车偷走了。 ➔ 我的自行车被小偷偷走了。",
          "pinyin": "Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.",
          "meaning": "Chiếc xe đạp của tôi đã bị tên trộm lấy mất rồi."
        }
      ],
      "commonMistake": {
        "wrong": "自行车被 ❌ (thiếu động từ và kết quả)",
        "correct": "自行车被偷走了 ✔️",
        "explanation": "Câu chữ 被 luôn cần động từ và kết quả hành động."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你怎么看起来这么难过？发生什么事了？",
          "pinyin": "Nǐ zěnme kànqǐlai zhème nánguò? Fāshēng shénme shì le?",
          "meaning": "Sao trông bạn buồn thế? Đã xảy ra chuyện gì vậy?"
        },
        {
          "speaker": "B",
          "hanzi": "我刚才在地铁上，钱包被小偷偷走了，里面有我的护照和现金！",
          "pinyin": "Wǒ gāngcái zài dìtiě shàng, qiánbāo bèi xiǎotōu tōu zǒu le, lǐmiàn yǒu wǒ de hùzhào hé xiànjīn!",
          "meaning": "Hồi nãy trên tàu điện ngầm, ví tiền của tôi bị tên trộm lấy mất rồi, bên trong có cả hộ chiếu và tiền mặt của tôi!"
        }
      ],
      "audioText": "钱包被小偷偷走了，里面有我的护照和现金！",
      "question": "Chuyện không may gì đã xảy ra với người B?",
      "options": [
        "Bị trễ máy bay",
        "Ví tiền bị trộm mất trên tàu điện ngầm (qiánbāo bèi tōu zǒu le)",
        "Làm vỡ ly nước",
        "Bị ốm"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 钱包被小偷偷走了."
    },
    "step6_speaking": {
      "prompt": "Đọc câu miêu tả đồ vật bị vỡ:",
      "targetSentence": "杯子被人打碎了。",
      "targetPinyin": "Bēizi bèi rén dǎsuì le.",
      "targetMeaning": "Cái ly bị người ta làm vỡ rồi.",
      "hint": "Đọc bèi rén dǎsuì le dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu bị động: Ví tiền của tôi bị trộm mất rồi",
      "words": [
        "偷走了",
        "被",
        "我的钱包"
      ],
      "correctOrder": [
        "我的钱包",
        "被",
        "偷走了"
      ],
      "explanation": "我的钱包 + 被 + 偷走了."
    },
    "step8_quiz": [
      {
        "id": "q-310-1",
        "type": "multiple-choice",
        "question": "Trong câu chữ 被, tác nhân gây ra hành động có thể được lược bỏ không?",
        "options": [
          "Bắt buộc phải có",
          "Có thể lược bỏ (Ví dụ: 钱包被偷了)",
          "Không được dùng",
          "Chỉ dùng cho động vật"
        ],
        "correctIndex": 1,
        "explanation": "Trong câu chữ 被, tác nhân có thể được ẩn đi: 钱包被偷了."
      },
      {
        "id": "q-310-2",
        "type": "multiple-choice",
        "question": "Chuyển câu '他打破了杯子' sang câu chữ 被 đúng là:",
        "options": [
          "杯子被他打破了",
          "他被杯子打破了",
          "杯子他被打破",
          "被杯子他打破"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc bị động: 杯子 (Vật bị vỡ) + 被他 + 打破了."
      }
    ],
    "step9_challenge": {
      "title": "Mở khóa Boss Chapter 10",
      "taskDesc": "Vượt qua thử thách câu chữ 把 và câu chữ 被 để mở khóa trận chiến ngữ pháp Boss 10!",
      "targetPhrase": "wǒ zhǎngwò le bǎ zì jù hé bèi zì jù",
      "xpReward": 60,
      "badge": "Vua Cú Pháp Tiếng Trung"
    }
  },

  {
    "id": "l-311",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 11,
    "title": "Môi trường văn phòng & Đồng nghiệp (公司, 经理, 同事, 开会)",
    "chineseTitle": "职场环境与同事协作（开会、经理、同事）",
    "subtitle": "Kỹ năng công sở: Giám đốc (经理), đồng nghiệp (同事), họp hành (开会) và giao tiếp công việc.",
    "objective": "Giao tiếp cơ bản trong môi trường công sở tiếng Trung, sắp xếp lịch họp và trao đổi cùng đồng nghiệp.",
    "prerequisite": "Đã hoàn thành Module 3.2.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các từ vựng công sở văn phòng.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Công sở",
      "Văn phòng",
      "经理",
      "同事",
      "开会"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng công sở: 经理 (Jīnglǐ - Giám đốc), 同事 (Tóngshì - Đồng nghiệp), 开会 (Kāihuì - Họp)",
      "summary": "办公室 (bàngōngshì) là văn phòng làm việc. 经理 (jīnglǐ) là giám đốc/quản lý. 同事 (tóngshì) là đồng nghiệp. 开会 (kāihuì) là họp hành. 迟到 (chídào) là đi trễ.",
      "audioDemoText": "jīnglǐ ràng wǒmen xiàwǔ liǎng diǎn zài bàngōngshì kāihuì"
    },
    "step2_vocabulary": [
      {
        "id": "v-311-1",
        "hanzi": "经理",
        "pinyin": "jīnglǐ",
        "hanviet": "Kinh lý",
        "meaning": "Giám đốc, quản lý",
        "radical": "纟 (Mịch)",
        "example": {
          "hanzi": "王经理在开会。",
          "pinyin": "Wáng jīnglǐ zài kāihuì.",
          "meaning": "Giám đốc Vương đang họp."
        }
      },
      {
        "id": "v-311-2",
        "hanzi": "同事",
        "pinyin": "tóngshì",
        "hanviet": "Đồng sự",
        "meaning": "Đồng nghiệp",
        "radical": "口 (Khẩu)",
        "example": {
          "hanzi": "我和同事们一起吃午饭。",
          "pinyin": "Wǒ hé tóngshìmen yìqǐ chī wǔfàn.",
          "meaning": "Tôi cùng các đồng nghiệp ăn cơm trưa."
        }
      },
      {
        "id": "v-311-3",
        "hanzi": "开会",
        "pinyin": "kāihuì",
        "hanviet": "Khai hội",
        "meaning": "Họp, mở cuộc họp",
        "radical": "廾 (Củng)",
        "example": {
          "hanzi": "下午三点开会。",
          "pinyin": "Xiàwǔ sān diǎn kāihuì.",
          "meaning": "3 giờ chiều họp."
        }
      },
      {
        "id": "v-311-4",
        "hanzi": "办公室",
        "pinyin": "bàngōngshì",
        "hanviet": "Biện công thất",
        "meaning": "Văn phòng làm việc",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "去办公室找我。",
          "pinyin": "Qù bàngōngshì zhǎo wǒ.",
          "meaning": "Đến văn phòng tìm tôi."
        }
      },
      {
        "id": "v-311-5",
        "hanzi": "通知",
        "pinyin": "tōngzhī",
        "hanviet": "Thông tri",
        "meaning": "Thông báo",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "经理发通知了。",
          "pinyin": "Jīnglǐ fā tōngzhī le.",
          "meaning": "Giám đốc gửi thông báo rồi."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "同",
        "pinyin": "tóng",
        "meaning": "Cùng nhau, giống nhau (Đồng)",
        "strokesCount": 6,
        "strokeOrderText": "Sổ ngoài -> Ngang gập móc -> Ngang -> Khẩu trong",
        "components": "冂 + 一 + 口",
        "mnemonic": "Mọi người cùng chung trong một cánh cổng đồng lòng phát ngôn."
      },
      {
        "hanzi": "经",
        "pinyin": "jīng",
        "meaning": "Kinh qua, kinh sách",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Mịch (纟) bên trái -> Chữ Kính (圣) bên phải",
        "components": "纟 + 圣",
        "mnemonic": "Sợi tơ dệt nối (Mịch) kinh nghiệm quản lý chuẩn mực."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc sai khiến công sở: 让 / 叫 / 请 (Bảo ai / Nhờ ai làm gì)",
      "formula": "Chủ ngữ 1 + 让 / 叫 + Người nhận lệnh + Động từ + Tân ngữ",
      "explanation": "Trong môi trường làm việc, chữ 让 được sử dụng với tần suất cực cao khi truyền đạt yêu cầu của cấp trên.",
      "examples": [
        {
          "hanzi": "经理让我通知大家下午两点半到一号会议室开会。",
          "pinyin": "Jīnglǐ ràng wǒ tōngzhī dàjiā xiàwǔ liǎng diǎn bàn dào yī hào huìyìshì kāihuì.",
          "meaning": "Giám đốc bảo tôi thông báo mọi người 2 giờ rưỡi chiều đến phòng họp số 1 để họp."
        }
      ],
      "commonMistake": {
        "wrong": "经理叫我让开会 ❌",
        "correct": "经理让我通知大家开会 ✔️",
        "explanation": "Cấu trúc sai khiến rõ ràng rành mạch."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "李同事，请问下午的部门会议在哪个房间开？",
          "pinyin": "Lǐ tóngshì, qǐngwèn xiàwǔ de bùmén huìyì zài nǎ ge fángjiān kāi?",
          "meaning": "Đồng nghiệp Lý ơi, xin hỏi cuộc họp phòng ban chiều nay họp ở phòng nào thế?"
        },
        {
          "speaker": "B",
          "hanzi": "王经理刚才发了通知，在三楼的大会议室，两点准时开始，千万别迟到了。",
          "pinyin": "Wáng jīnglǐ gāngcái fā le tōngzhī, zài sān lóu de dà huìyìshì, liǎng diǎn zhǔnshí kāishǐ, qiānwàn bié chídào le.",
          "meaning": "Giám đốc Vương hồi nãy vừa gửi thông báo, ở phòng họp lớn tầng 3, 2 giờ đúng bắt đầu, tuyệt đối đừng đến trễ nhé."
        }
      ],
      "audioText": "王经理发了通知，在三楼的大会议室，两点准时开始。",
      "question": "Cuộc họp diễn ra ở đâu và lúc mấy giờ?",
      "options": [
        "Tầng 1 lúc 3 giờ",
        "Phòng họp lớn tầng 3 lúc 2 giờ đúng (sān lóu dà huìyìshì, liǎng diǎn zhǔnshí)",
        "Ở quán cà phê",
        "Hủy bỏ họp"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 三楼的大会议室，两点准时开始."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thông báo giờ họp:",
      "targetSentence": "下午两点在办公室开会。",
      "targetPinyin": "Xiàwǔ liǎng diǎn zài bàngōngshì kāihuì.",
      "targetMeaning": "2 giờ chiều họp ở văn phòng.",
      "hint": "Đọc bàngōngshì kāihuì dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Giám đốc bảo tôi thông báo mọi người",
      "words": [
        "通知大家",
        "让我",
        "经理"
      ],
      "correctOrder": [
        "经理",
        "让我",
        "通知大家"
      ],
      "explanation": "经理 + 让我 + 通知大家."
    },
    "step8_quiz": [
      {
        "id": "q-311-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Đồng nghiệp' trong tiếng Trung là:",
        "options": [
          "朋友 (péngyou)",
          "同学 (tóngxué)",
          "同事 (tóngshì)",
          "邻居 (línjū)"
        ],
        "correctIndex": 2,
        "explanation": "同事 là đồng nghiệp cùng làm việc."
      },
      {
        "id": "q-311-2",
        "type": "multiple-choice",
        "question": "Trong câu '经理让我去买咖啡', từ '让' mang ý nghĩa gì?",
        "options": [
          "Nhường nhịn",
          "Bảo / Sai khiến / Yêu cầu",
          "Ngăn cản",
          "Mời chào"
        ],
        "correctIndex": 1,
        "explanation": "让 là động từ sai khiến (bảo làm gì)."
      }
    ],
    "step9_challenge": {
      "title": "Tác phong chuyên nghiệp",
      "taskDesc": "Đọc to câu: 'Giám đốc đã thông báo chiều nay 2 giờ họp ở phòng họp lớn'.",
      "targetPhrase": "jīnglǐ tōngzhī xiàwǔ liǎng diǎn kāihuì",
      "xpReward": 50,
      "badge": "Nhân Viên Xuất Sắc"
    }
  },

  {
    "id": "l-312",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 12,
    "title": "Giải quyết vấn đề & Kế hoạch làm việc (解决, 问题, 认真, 完成)",
    "chineseTitle": "任务执行与工作计划（认真解决与按时完成）",
    "subtitle": "Kỹ năng hoàn thành nhiệm vụ: Thái độ nghiêm túc (认真), lập kế hoạch (计划), giải quyết (解决) và hoàn thành (完成).",
    "objective": "Trình bày kế hoạch làm việc, báo cáo hoàn thành nhiệm vụ đúng thời hạn.",
    "prerequisite": "Đã hoàn thành Bài 311.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các từ vựng công việc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Kế hoạch",
      "Giải quyết vấn đề",
      "认真",
      "完成"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng hành động công việc: 计划 (Jìhuà), 完成 (Wánchéng), 解决 (Jiějué), 认真 (Rènzhēn)",
      "summary": "认真 (rènzhēn) là chăm chỉ, nghiêm túc. 完成 (wánchéng) là hoàn thành. 解决问题 (jiějué wèntí) là giải quyết vấn đề. 按时 (ànshí) là đúng giờ.",
      "audioDemoText": "wǒmen yào rènzhēn gōngzuò, ànshí wánchéng jìhuà, jiějué zhè ge wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-312-1",
        "hanzi": "认真",
        "pinyin": "rènzhēn",
        "hanviet": "Nhận chân",
        "meaning": "Chăm chỉ, nghiêm túc",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "认真学习。",
          "pinyin": "Rènzhēn xuéxí.",
          "meaning": "Chăm chỉ học tập."
        }
      },
      {
        "id": "v-312-2",
        "hanzi": "完成",
        "pinyin": "wánchéng",
        "hanviet": "Hoàn thành",
        "meaning": "Hoàn thành",
        "radical": "宀 (Miên)",
        "example": {
          "hanzi": "按时完成任务。",
          "pinyin": "Ànshí wánchéng rènwu.",
          "meaning": "Hoàn thành nhiệm vụ đúng hạn."
        }
      },
      {
        "id": "v-312-3",
        "hanzi": "计划",
        "pinyin": "jìhuà",
        "hanviet": "Kế hoạch",
        "meaning": "Kế hoạch, dự định",
        "radical": "讠 (Ngôn)",
        "example": {
          "hanzi": "下个月的工作计划。",
          "pinyin": "Xià gè yuè de gōngzuò jìhuà.",
          "meaning": "Kế hoạch làm việc tháng tới."
        }
      },
      {
        "id": "v-312-4",
        "hanzi": "按时",
        "pinyin": "ànshí",
        "hanviet": "Án thời",
        "meaning": "Đúng giờ, đúng hẹn",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "按时上班。",
          "pinyin": "Ànshí shàngbān.",
          "meaning": "Đi làm đúng giờ."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "认",
        "pinyin": "rèn",
        "meaning": "Nhận biết, nhận thức",
        "strokesCount": 4,
        "strokeOrderText": "Bộ Ngôn (讠) bên trái -> Bộ Nhân (人) bên phải",
        "components": "讠 + 人",
        "mnemonic": "Lời nói văn bản (Ngôn) giúp nhận diện con người (Nhân)."
      },
      {
        "hanzi": "成",
        "pinyin": "chéng",
        "meaning": "Thành công, hoàn thành",
        "strokesCount": 6,
        "strokeOrderText": "Ngang -> Phẩy đao -> Sổ cong móc -> Nghiêng móc -> Phẩy -> Chấm",
        "components": "戈 + 刀",
        "mnemonic": "Dùng vũ khí rèn giũa đạt được thành quả vĩ đại."
      }
    ],
    "step4_grammar": {
      "title": "Phó từ cách thức đứng trước động từ: 认真 + 地 + Động từ (Làm việc chăm chỉ)",
      "formula": "认真 + 地 + 工作 (Làm việc nghiêm túc) / 学习 (Học tập chăm chỉ)",
      "explanation": "Từ 认真 khi làm trạng ngữ biểu thị thái độ tận tụy, tỉ mỉ khi thực hiện một hành động.",
      "examples": [
        {
          "hanzi": "只要我们认真准备，就一定能按时完成工作。",
          "pinyin": "Zhǐyào wǒmen rènzhēn zhǔnbèi, jiù yídìng néng ànshí wánchéng gōngzuò.",
          "meaning": "Chỉ cần chúng ta chuẩn bị nghiêm túc, thì nhất định có thể hoàn thành công việc đúng hạn."
        }
      ],
      "commonMistake": {
        "wrong": "工作认真地 ❌",
        "correct": "认真地工作 ✔️",
        "explanation": "Trạng ngữ cách thức đứng trước động từ."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这个项目的问题很复杂，这个星期能解决好吗？",
          "pinyin": "Zhè ge xiàngmù de wèntí hěn fùzá, zhè ge xīngqī néng jiějué hǎo ma?",
          "meaning": "Vấn đề của dự án này rất phức tạp, tuần này có giải quyết xong được không?"
        },
        {
          "speaker": "B",
          "hanzi": "大家都在认真加班，按照目前的计划，周五之前一定能顺利完成！",
          "pinyin": "Dàjiā dōu zài rènzhēn jiābān, ànzhào mùqián de jìhuà, Zhōuwǔ zhīqián yídìng néng shùnlì wánchéng!",
          "meaning": "Mọi người đều đang chăm chỉ tăng ca, dựa theo kế hoạch hiện tại, trước thứ Sáu nhất định sẽ hoàn thành suôn sẻ!"
        }
      ],
      "audioText": "按照目前的计划，周五之前一定能顺利完成！",
      "question": "Dự án dự kiến sẽ hoàn thành vào khi nào?",
      "options": [
        "Tháng sau",
        "Trước thứ Sáu (Zhōuwǔ zhīqián shùnlì wánchéng)",
        "Không hoàn thành được",
        "Bị hủy bỏ"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 周五之前一定能顺利完成."
    },
    "step6_speaking": {
      "prompt": "Khẳng định tinh thần trách nhiệm công việc:",
      "targetSentence": "我们一定能按时完成。",
      "targetPinyin": "Wǒmen yídìng néng ànshí wánchéng.",
      "targetMeaning": "Chúng tôi nhất định có thể hoàn thành đúng hạn.",
      "hint": "Đọc ànshí wánchéng dứt khoát."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nghiêm túc giải quyết vấn đề",
      "words": [
        "解决问题",
        "认真"
      ],
      "correctOrder": [
        "认真",
        "解决问题"
      ],
      "explanation": "认真 + 解决问题."
    },
    "step8_quiz": [
      {
        "id": "q-312-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Nghiêm túc, chăm chỉ' trong tiếng Trung là:",
        "options": [
          "热情 (rèqíng)",
          "聪明 (cōngming)",
          "认真 (rènzhēn)",
          "努力 (nǔlì)"
        ],
        "correctIndex": 2,
        "explanation": "认真 là nghiêm túc, chăm chỉ."
      },
      {
        "id": "q-312-2",
        "type": "multiple-choice",
        "question": "Cụm '按时' (ànshí) mang nghĩa là gì?",
        "options": [
          "Muộn giờ",
          "Đúng giờ / Đúng hạn",
          "Thỉnh thoảng",
          "Bất cứ lúc nào"
        ],
        "correctIndex": 1,
        "explanation": "按时 là đúng giờ, đúng hạn định."
      }
    ],
    "step9_challenge": {
      "title": "Lời hứa tiến độ",
      "taskDesc": "Đọc to câu: 'Tôi sẽ làm việc nghiêm túc và giải quyết vấn đề này đúng giờ'.",
      "targetPhrase": "wǒ yídìng rènzhēn jiějué zhè ge wèntí",
      "xpReward": 50,
      "badge": "Nhà Quản Trị Dự Án"
    }
  },

  {
    "id": "l-313",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 13,
    "title": "Môi trường đại học, thi cử & Điểm số (大学, 考试, 成绩, 努力)",
    "chineseTitle": "高校学习与学业成绩（大学、考试、努力）",
    "subtitle": "Kỹ năng học tập học đường: Đại học (大学), thi cử (考试), nỗ lực (努力) và điểm số thành tích (成绩).",
    "objective": "Trao đổi về môi trường học tập, thảo luận điểm số và chia sẻ mục tiêu học vấn.",
    "prerequisite": "Đã hoàn thành Bài 312.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và nói đúng câu chia sẻ nỗ lực học tập.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Trường học",
      "Thi cử",
      "成绩",
      "努力",
      "大学"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Từ vựng học đường: 大学 (Dàxué - Đại học), 成绩 (Chéngjì - Điểm số), 努力 (Nǔlì - Nỗ lực)",
      "summary": "大学 (dàxué) là trường đại học. 考试 (kǎoshì) là thi cử. 努力 (nǔlì) là nỗ lực, cố gắng. 提高 (tígāo) là nâng cao. 复习 (fùxí) là ôn tập.",
      "audioDemoText": "zhǐyào nǔlì xuéxí, chéngjì jiù huì tígāo, kǎoshì méi wèntí"
    },
    "step2_vocabulary": [
      {
        "id": "v-313-1",
        "hanzi": "大学",
        "pinyin": "dàxué",
        "hanviet": "Đại học",
        "meaning": "Trường đại học",
        "radical": "大 (Đại)",
        "example": {
          "hanzi": "他在北京大学读书。",
          "pinyin": "Tā zài Běijīng Dàxué dúshū.",
          "meaning": "Anh ấy học ở Đại học Bắc Kinh."
        }
      },
      {
        "id": "v-313-2",
        "hanzi": "成绩",
        "pinyin": "chéngjì",
        "hanviet": "Thành tích",
        "meaning": "Thành tích, điểm số",
        "radical": "禾 (Hòa)",
        "example": {
          "hanzi": "期末考试成绩很好。",
          "pinyin": "Qīmò kǎoshì chéngjì hěn hǎo.",
          "meaning": "Điểm thi cuối kỳ rất tốt."
        }
      },
      {
        "id": "v-313-3",
        "hanzi": "努力",
        "pinyin": "nǔlì",
        "hanviet": "Nỗ lực",
        "meaning": "Nỗ lực, cố gắng",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "努力学好汉语。",
          "pinyin": "Nǔlì xué hǎo Hànyǔ.",
          "meaning": "Cố gắng học giỏi tiếng Trung."
        }
      },
      {
        "id": "v-313-4",
        "hanzi": "提高",
        "pinyin": "tígāo",
        "hanviet": "Đề cao",
        "meaning": "Nâng cao, cải thiện",
        "radical": "扌 (Thủ)",
        "example": {
          "hanzi": "提高听力水平。",
          "pinyin": "Tígāo tīnglì shuǐpíng.",
          "meaning": "Nâng cao trình độ nghe."
        }
      },
      {
        "id": "v-313-5",
        "hanzi": "复习",
        "pinyin": "fùxí",
        "hanviet": "Phức tập",
        "meaning": " n tập, xem lại bài",
        "radical": "夂 (Tri)",
        "example": {
          "hanzi": "复习旧课。",
          "pinyin": "Fùxí jiù kè.",
          "meaning": " n tập bài cũ."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "努",
        "pinyin": "nǔ",
        "meaning": "Gắng sức, nỗ lực",
        "strokesCount": 7,
        "strokeOrderText": "Chữ Nô (奴) ở trên -> Bộ Lực (力) ở dưới",
        "components": "奴 + 力",
        "mnemonic": "Bỏ hết toàn bộ sức lực (Lực) phấn đấu vươn lên."
      },
      {
        "hanzi": "提",
        "pinyin": "tí",
        "meaning": "Nâng lên, đề xuất",
        "strokesCount": 12,
        "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Thị (是) bên phải",
        "components": "扌 + 是",
        "mnemonic": "Dùng bàn tay (Thủ) nâng đỡ những điều chuẩn mực đúng đắn (Thị)."
      }
    ],
    "step4_grammar": {
      "title": "Cặp liên từ điều kiện duy nhất: 只要...就... (Chỉ cần...thì...)",
      "formula": "只要 + Điều kiện, 就 + Kết quả tất yếu",
      "explanation": "Biểu thị chỉ cần đáp ứng một điều kiện nhất định là sẽ đạt được kết quả mong muốn.",
      "examples": [
        {
          "hanzi": "只要每天坚持努力复习，汉语水平就一定能提高。",
          "pinyin": "Zhǐyào měitiān jiānchí nǔlì fùxí, Hànyǔ shuǐpíng jiù yídìng néng tígāo.",
          "meaning": "Chỉ cần mỗi ngày kiên trì nỗ lực ôn tập, thì trình độ tiếng Trung nhất định sẽ nâng cao."
        }
      ],
      "commonMistake": {
        "wrong": "只要努力才能 ❌",
        "correct": "只要努力就 ✔️",
        "explanation": "只要 luôn đi đôi với 就 (Chỉ 只有 mới đi với 才)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这次HSK 3级模拟考试，你考得怎么样？",
          "pinyin": "Zhè cì HSK sān jí mónǐ kǎoshì, nǐ kǎo de zěnmeyàng?",
          "meaning": "Lần thi thử HSK 3 này bạn thi thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "我考了两百八十分！经过这几个月的努力复习，我的听力和阅读成绩都有了很大提高！",
          "pinyin": "Wǒ kǎo le liǎng bǎi bāshí fēn! Jīngguò zhè jǐ gè yuè de nǔlì fùxí, wǒ de tīnglì hé yuèdú chéngjì dōu yǒu le hěn dà tígāo!",
          "meaning": "Tôi thi được 280 điểm! Trải qua mấy tháng nỗ lực ôn tập, điểm thi nghe và đọc của tôi đều nâng cao rất nhiều!"
        }
      ],
      "audioText": "经过这几个月的努力复习，我的成绩有了很大提高！",
      "question": "Kết quả học tập của người B như thế nào?",
      "options": [
        "Bị tụt điểm",
        "Điểm số nâng cao rất nhiều nhờ nỗ lực ôn tập (chéngjì yǒu le hěn dà tígāo)",
        "Không tham gia thi",
        "Bị trượt"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 成绩有了很大提高."
    },
    "step6_speaking": {
      "prompt": "Khẳng định tinh thần nỗ lực học tập:",
      "targetSentence": "只要努力，成绩就会提高。",
      "targetPinyin": "Zhǐyào nǔlì, chéngjì jiù huì tígāo.",
      "targetMeaning": "Chỉ cần nỗ lực, điểm số sẽ nâng cao.",
      "hint": "Đọc zhǐyào nǔlì rõ ràng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Nâng cao trình độ tiếng Trung",
      "words": [
        "汉语水平",
        "提高"
      ],
      "correctOrder": [
        "提高",
        "汉语水平"
      ],
      "explanation": "提高 + 汉语水平."
    },
    "step8_quiz": [
      {
        "id": "q-313-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 只要认真学习，___ 能考出好成绩。",
        "options": [
          "就 (jiù)",
          "才 (cái)",
          "但 (dàn)",
          "也 (yě)"
        ],
        "correctIndex": 0,
        "explanation": "Cặp liên từ cố định: 只要...就..."
      },
      {
        "id": "q-313-2",
        "type": "multiple-choice",
        "question": "Từ '复习' (fùxí) mang ý nghĩa là gì?",
        "options": [
          "Học bài mới",
          "Ôn tập / Xem lại bài",
          "Thi cử",
          "Nghỉ học"
        ],
        "correctIndex": 1,
        "explanation": "复习 là ôn tập bài học."
      }
    ],
    "step9_challenge": {
      "title": "Khát vọng thủ khoa",
      "taskDesc": "Đọc to câu: 'Tôi đang nỗ lực ôn tập mỗi ngày để đạt điểm cao trong kỳ thi HSK 3'.",
      "targetPhrase": "wǒ měitiān nǔlì fùxí kǎo hsk sān jí",
      "xpReward": 50,
      "badge": "Học Bá Siêu Đẳng"
    }
  },

  {
    "id": "l-314",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 14,
    "title": "Cảm xúc, tính cách & Mối quan hệ (难过, 生气, 聪明, 热情)",
    "chineseTitle": "情绪表达与性格描摹（热情、聪明、难过、生气）",
    "subtitle": "Miêu tả cảm xúc con người: Buồn (难过), tức giận (生气), thông minh (聪明), nhiệt tình (热情).",
    "objective": "Bộc lộ trạng thái cảm xúc cá nhân và nhận xét tính cách của người khác một cách tế nhị.",
    "prerequisite": "Đã hoàn thành Bài 313.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng các tính từ tính cách, cảm xúc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Cảm xúc",
      "Tính cách",
      "热情",
      "生气",
      "聪明"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-6"
    ],
    "step1_learn": {
      "topic": "Từ vựng tính cách & Cảm xúc: 热情 (Rèqíng - Nhiệt tình), 聪明 (Cōngming - Thông minh)",
      "summary": "难过 (nánguò) là đau lòng, buồn bã. 生气 (shēngqì) là tức giận. 热情 (rèqíng) là niềm nở, nhiệt tình. 聪明 (cōngming) là thông minh, nhanh nhạy.",
      "audioDemoText": "tā duì rén hěn rèqíng, tā yòu cōngming yòu nǔlì, bié shēngqì le"
    },
    "step2_vocabulary": [
      {
        "id": "v-314-1",
        "hanzi": "难过",
        "pinyin": "nánguò",
        "hanviet": "Nan quá",
        "meaning": "Buồn bã, đau lòng",
        "radical": "隹 (Chuy)",
        "example": {
          "hanzi": "别难过了。",
          "pinyin": "Bié nánguò le.",
          "meaning": "Đừng buồn nữa nhé."
        }
      },
      {
        "id": "v-314-2",
        "hanzi": "生气",
        "pinyin": "shēngqì",
        "hanviet": "Sinh khí",
        "meaning": "Tức giận, giận hờn",
        "radical": "生 (Sinh)",
        "example": {
          "hanzi": "他生我的气了。",
          "pinyin": "Tā shēng wǒ de qì le.",
          "meaning": "Anh ấy giận tôi rồi."
        }
      },
      {
        "id": "v-314-3",
        "hanzi": "聪明",
        "pinyin": "cōngming",
        "hanviet": "Thông minh",
        "meaning": "Thông minh, sáng dạ",
        "radical": "耳 (Nhĩ)",
        "example": {
          "hanzi": "这个孩子真聪明。",
          "pinyin": "Zhè ge háizi zhēn cōngming.",
          "meaning": "Đứa bé này thật thông minh."
        }
      },
      {
        "id": "v-314-4",
        "hanzi": "热情",
        "pinyin": "rèqíng",
        "hanviet": "Nhiệt tình",
        "meaning": "Nhiệt tình, niềm nở",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "中国人很热情。",
          "pinyin": "Zhōngguórén hěn rèqíng.",
          "meaning": "Người Trung Quốc rất nhiệt tình."
        }
      },
      {
        "id": "v-314-5",
        "hanzi": "满意",
        "pinyin": "mǎnyì",
        "hanviet": "Mãn ý",
        "meaning": "Hài lòng",
        "radical": "氵 (Thủy)",
        "example": {
          "hanzi": "我很满意。",
          "pinyin": "Wǒ hěn mǎnyì.",
          "meaning": "Tôi rất hài lòng."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "聪",
        "pinyin": "cōng",
        "meaning": "Thông minh, thính tai",
        "strokesCount": 15,
        "strokeOrderText": "Bộ Nhĩ (耳) bên trái -> Khung Tổng (怱) bên phải",
        "components": "耳 + 怱",
        "mnemonic": "Đôi tai (Nhĩ) nghe rõ vạn vật và con tim (Tâm) thấu hiểu nhanh nhạy."
      },
      {
        "hanzi": "情",
        "pinyin": "qíng",
        "meaning": "Tình cảm, cảm xúc (Tình)",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Tâm đứng (忄) bên trái -> Chữ Thanh (青) bên phải",
        "components": "忄 + 青",
        "mnemonic": "Con tim (Tâm) dạt dào tình cảm thanh xuân trong sáng (Thanh)."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc song hành phẩm chất: 又...又... (Vừa...lại vừa...)",
      "formula": "Chủ ngữ + 又 + Tính từ 1 + 又 + Tính từ 2",
      "explanation": "Biểu thị hai đặc điểm phẩm chất cùng tồn tại đồng thời trên một người hoặc sự vật (hai tính từ cùng tích cực hoặc cùng tiêu cực).",
      "examples": [
        {
          "hanzi": "李老师又聪明又热情，大家都喜欢他。",
          "pinyin": "Lǐ lǎoshī yòu cōngming yòu rèqíng, dàjiā dōu xǐhuan tā.",
          "meaning": "Thầy Lý vừa thông minh lại vừa nhiệt tình, mọi người đều yêu mến thầy."
        }
      ],
      "commonMistake": {
        "wrong": "又聪明又贵 ❌ (vừa tích cực vừa tiêu cực)",
        "correct": "Hai tính từ phải cùng hướng phẩm chất.",
        "explanation": "Quy tắc ngữ nghĩa của 又...又..."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "这次你去中国留学，感觉那里的老师和同学怎么样？",
          "pinyin": "Zhè cì nǐ qù Zhōngguó liúxué, gǎnjué nàlǐ de lǎoshī hé tóngxué zěnmeyàng?",
          "meaning": "Lần này bạn sang Trung Quốc du học, cảm thấy thầy cô và bạn bè bên đó thế nào?"
        },
        {
          "speaker": "B",
          "hanzi": "大家都对我特别热情！遇到难题时，中国同学总是耐心帮我解决，我很感动。",
          "pinyin": "Dàjiā dōu duì wǒ tèbié rèqíng! Yù dào nántí shí, Zhōngguó tóngxué zǒngshì nàixīn bāng wǒ jiějué, wǒ hěn gǎndòng.",
          "meaning": "Mọi người đều đối xử với tôi đặc biệt nhiệt tình! Khi gặp bài khó, các bạn Trung Quốc luôn kiên nhẫn giúp tôi giải quyết, tôi rất cảm động."
        }
      ],
      "audioText": "大家都对我特别热情！中国同学总是耐心帮我解决问题。",
      "question": "Thái độ của các bạn học Trung Quốc đối với người B như thế nào?",
      "options": [
        "Rất lạnh nhạt",
        "Đặc biệt nhiệt tình và kiên nhẫn giúp đỡ (tèbié rèqíng, nàixīn bāng wǒ)",
        "Hay tức giận",
        "Không nói chuyện"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 对我特别热情，耐心帮我解决."
    },
    "step6_speaking": {
      "prompt": "Đọc câu khen ngợi: Vừa thông minh vừa nhiệt tình:",
      "targetSentence": "他又聪明又热情。",
      "targetPinyin": "Tā yòu cōngming yòu rèqíng.",
      "targetMeaning": "Anh ấy vừa thông minh lại vừa nhiệt tình.",
      "hint": "Đọc mượt mà yòu cōngming yòu rèqíng."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Xin bạn đừng giận nữa nhé",
      "words": [
        "生气了",
        "别",
        "请你"
      ],
      "correctOrder": [
        "请你",
        "别",
        "生气了"
      ],
      "explanation": "请你 + 别 + 生气了."
    },
    "step8_quiz": [
      {
        "id": "q-314-1",
        "type": "multiple-choice",
        "question": "Từ mang nghĩa 'Nhiệt tình, niềm nở' trong tiếng Trung là:",
        "options": [
          "生气 (shēngqì)",
          "难过 (nánguò)",
          "热情 (rèqíng)",
          "聪明 (cōngming)"
        ],
        "correctIndex": 2,
        "explanation": "热情 là nhiệt tình, hiếu khách."
      },
      {
        "id": "q-314-2",
        "type": "multiple-choice",
        "question": "Cấu trúc '又...又...' dùng để làm gì?",
        "options": [
          "So sánh hơn kém",
          "Biểu thị hai đặc điểm phẩm chất đồng thời (Vừa...lại vừa...)",
          "Nguyên nhân kết quả",
          "Câu hỏi lựa chọn"
        ],
        "correctIndex": 1,
        "explanation": "又...又... biểu thị hai phẩm chất song hành."
      }
    ],
    "step9_challenge": {
      "title": "Lan tỏa năng lượng tích cực",
      "taskDesc": "Đọc to câu: 'Xin đừng buồn nữa, mọi người đều rất nhiệt tình giúp đỡ bạn'.",
      "targetPhrase": "bié nánguò le dàjiā dōu hěn rèqíng",
      "xpReward": 50,
      "badge": "Sứ Giả Yêu Thương"
    }
  },

  {
    "id": "l-315",
    "chapterId": "ch-11",
    "levelId": "lvl-3",
    "lessonNumber": 15,
    "title": "Phân biệt triệt để 3 trợ từ kết cấu 的, 地, 得 (3 chữ Đích)",
    "chineseTitle": "结构助词“的、地、得”的终极区分与实战应用",
    "subtitle": "Giải quyết dứt điểm nỗi ám ảnh lớn nhất của người học: 白勺的 (Định ngữ), 土也地 (Trạng ngữ), 双人得 (Bổ ngữ).",
    "objective": "Phân biệt chính xác 100% cách dùng của 3 chữ 的, 地, 得 trong mọi kỳ thi và viết lách.",
    "prerequisite": "Đã hoàn thành Bài 314.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm phân biệt 3 chữ 的, 地, 得.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "3 chữ Đích",
      "的",
      "地",
      "得",
      "Ngữ pháp kinh điển"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4"
    ],
    "step1_learn": {
      "topic": "Tam giác vàng 3 chữ Đích: 的 (de) vs 地 (de) vs 得 (de)",
      "summary": "1. 的 (Bạch chước đích): Đứng trước DANH TỪ (漂亮的花, 我的书). 2. 地 (Thổ dã địa): Đứng trước ĐỘNG TỪ (认真地学习, 高兴地说). 3. 得 (Song nhân đắc): Đứng sau ĐỘNG TỪ/TÍNH TỪ chỉ mức độ (跑得快, 说得好).",
      "audioDemoText": "piàoliang de yīfu, rènzhēn de xuéxí, pǎo de hěn kuài"
    },
    "step2_vocabulary": [
      {
        "id": "v-315-1",
        "hanzi": "跑得快",
        "pinyin": "pǎo de kuài",
        "hanviet": "Bào đắc khoái",
        "meaning": "Chạy rất nhanh",
        "radical": "足 (Túc)",
        "example": {
          "hanzi": "他跑得真快！",
          "pinyin": "Tā pǎo de zhēn kuài!",
          "meaning": "Anh ấy chạy thật nhanh!"
        }
      },
      {
        "id": "v-315-2",
        "hanzi": "高兴地说",
        "pinyin": "gāoxìng de shuō",
        "hanviet": "Cao hưng địa thuyết",
        "meaning": "Vui vẻ nói",
        "radical": "高 (Cao)",
        "example": {
          "hanzi": "他高兴地笑了。",
          "pinyin": "Tā gāoxìng de xiào le.",
          "meaning": "Anh ấy vui mừng cười tươi."
        }
      },
      {
        "id": "v-315-3",
        "hanzi": "美丽的花",
        "pinyin": "měilì de huā",
        "hanviet": "Mỹ lệ đích hoa",
        "meaning": "Bông hoa xinh đẹp",
        "radical": "羊 (Dương)",
        "example": {
          "hanzi": "红色的美丽的花。",
          "pinyin": "Hóngsè de měilì de huā.",
          "meaning": "Bông hoa màu đỏ xinh đẹp."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "地",
        "pinyin": "de",
        "meaning": "Trợ từ trạng ngữ (Thổ dã địa)",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Thổ (土) bên trái -> Bộ Dã (也) bên phải",
        "components": "土 + 也",
        "mnemonic": "Mảnh đất (Thổ) vững chãi gắn liền phương thức hành động."
      },
      {
        "hanzi": "得",
        "pinyin": "de",
        "meaning": "Trợ từ bổ ngữ mức độ (Song nhân đắc)",
        "strokesCount": 11,
        "strokeOrderText": "Bộ Xích (彳) bên trái -> Chữ Đắc (㝵) bên phải",
        "components": "彳 + 㝵",
        "mnemonic": "Bước chân đi (Xích) thu được kết quả mức độ cao."
      }
    ],
    "step4_grammar": {
      "title": "Bí kíp thần chú phân biệt 3 chữ 的, 地, 得 trong 3 giây",
      "formula": "Tính từ + 的 + DANH TỪ  |  Tính từ + 地 + ĐỘNG TỪ  |  ĐỘNG TỪ + 得 + TÍNH TỪ/MỨC ĐỘ",
      "explanation": "Ghi nhớ thần chú: Sau 的 là Danh từ; Sau 地 là Động từ; Trước 得 là Động từ. Nhớ thần chú này bạn sẽ không bao giờ mắc lỗi.",
      "examples": [
        {
          "hanzi": "美丽的花儿（的 + Danh từ） / 认真地写作业（地 + Động từ） / 汉语说得很好（Động từ + 得 + Mức độ）",
          "pinyin": "Měilì de huār, rènzhēn de xiě zuòyè, Hànyǔ shuō de hěn hǎo.",
          "meaning": "Ba vị trí chuẩn xác của 3 chữ Đích."
        }
      ],
      "commonMistake": {
        "wrong": "跑的快 ❌ / 说地好 ❌",
        "correct": "跑得快 ✔️ / 说得好 ✔️",
        "explanation": "Động từ đi trước mức độ bắt buộc dùng 双人得 (得)."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你看，那个穿红衣服的女孩跑得真快！",
          "pinyin": "Nǐ kàn, nà ge chuān hóng yīfu de nǚhái pǎo de zhēn kuài!",
          "meaning": "Bạn nhìn xem, cô gái mặc áo đỏ kia chạy thật là nhanh!"
        },
        {
          "speaker": "B",
          "hanzi": "对啊，她正在努力地向前跑呢，肯定是第一名！",
          "pinyin": "Duì a, tā zhèngzài nǔlì de xiàng qián pǎo ne, kěndìng shì dì yī míng!",
          "meaning": "Đúng vậy, cô ấy đang nỗ lực chạy về phía trước kìa, chắc chắn là hạng nhất rồi!"
        }
      ],
      "audioText": "穿红衣服的女孩跑得真快！她正在努力地向前跑呢！",
      "question": "Trong câu có sự xuất hiện của những chữ nào?",
      "options": [
        "Chỉ có 1 chữ 的",
        "Xuất hiện trọn vẹn cả 3 chữ 的 (hóng yīfu de nǚhái), 得 (pǎo de zhēn kuài), 地 (nǔlì de xiàng qián pǎo)",
        "Không có chữ nào",
        "Chỉ có chữ 得"
      ],
      "correctIndex": 1,
      "explanation": "Câu tích hợp cả 3 chữ: 的 (định ngữ), 得 (bổ ngữ), 地 (trạng ngữ)."
    },
    "step6_speaking": {
      "prompt": "Đọc câu áp dụng chuẩn cả 3 chữ:",
      "targetSentence": "她高兴地跳，跳得很高。",
      "targetPinyin": "Tā gāoxìng de tiào, tiào de hěn gāo.",
      "targetMeaning": "Cô ấy vui vẻ nhảy, nhảy rất cao.",
      "hint": "Phân biệt gāoxìng de (地) và tiào de (得)."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Tiếng Trung anh ấy nói rất lưu loát",
      "words": [
        "很好",
        "说得",
        "他的汉语"
      ],
      "correctOrder": [
        "他的汉语",
        "说得",
        "很好"
      ],
      "explanation": "他的汉语 + 说得 + 很好."
    },
    "step8_quiz": [
      {
        "id": "q-315-1",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他认真 ___ 看着书。",
        "options": [
          "的",
          "地 (dì/de)",
          "得",
          "着"
        ],
        "correctIndex": 1,
        "explanation": "Đứng trước động từ (看着书) dùng trợ từ trạng ngữ 地."
      },
      {
        "id": "q-315-2",
        "type": "multiple-choice",
        "question": "Điền từ thích hợp vào chỗ trống: 他汉字写 ___ 非常漂亮。",
        "options": [
          "的",
          "地",
          "得 (de)",
          "了"
        ],
        "correctIndex": 2,
        "explanation": "Đứng sau động từ (写) và trước mức độ (非常漂亮) bắt buộc dùng 得."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy 3 chữ Đích",
      "taskDesc": "Đọc to câu: 'Cậu bé thông minh vui vẻ học tập, học rất giỏi'.",
      "targetPhrase": "cōngming de háizi rènzhēn de xué xué de hěn hǎo",
      "xpReward": 60,
      "badge": "Thần Nhãn Phân Biệt"
    }
  },

  {
    "id": "l-316",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 16,
    "title": "Thành ngữ 4 chữ thông dụng trong đời sống (成语入门)",
    "chineseTitle": "日常四字成语与文化典故（入乡随俗、马马虎虎）",
    "subtitle": "Bước chân vào thế giới văn hóa tinh hoa: Nhập gia tùy tục (入乡随俗), tàm tạm (马马虎虎), một lòng một dạ (一心一意).",
    "objective": "Hiểu và vận dụng chuẩn xác các thành ngữ 4 chữ thông dụng trong bài viết và giao tiếp thực tế.",
    "prerequisite": "Đã hoàn thành Module 3.3.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và sử dụng đúng ngữ cảnh của 2 thành ngữ.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Thành ngữ",
      "成语",
      "入乡随俗",
      "Văn hóa"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "3 Thành ngữ 4 chữ kinh điển HSK 3: 入乡随俗, 马马虎虎, 一心一意",
      "summary": "1. 入乡随俗 (rù xiāng suí sú - Nhập gia tùy tục): Đến nơi nào tôn trọng phong tục nơi đó. 2. 马马虎虎 (mǎmǎhūhū - Mã mã hổ hổ): Tàm tạm, qua loa đại khái. 3. 一心一意 (yì xīn yí yì - Nhất tâm nhất ý): Toàn tâm toàn ý, tập trung cao độ.",
      "audioDemoText": "dào le zhōngguó yào rùxiāngsuísú, tā zuòshì yíxīnyíyì"
    },
    "step2_vocabulary": [
      {
        "id": "v-316-1",
        "hanzi": "入乡随俗",
        "pinyin": "rù xiāng suí sú",
        "hanviet": "Nhập hương tùy tục",
        "meaning": "Nhập gia tùy tục",
        "radical": "入 (Nhập)",
        "example": {
          "hanzi": "去中国要入乡随俗。",
          "pinyin": "Qù Zhōngguó yào rù xiāng suí sú.",
          "meaning": "Đến Trung Quốc phải nhập gia tùy tục."
        }
      },
      {
        "id": "v-316-2",
        "hanzi": "马马虎虎",
        "pinyin": "mǎmǎhūhū",
        "hanviet": "Mã mã hổ hổ",
        "meaning": "Tàm tạm, qua loa",
        "radical": "马 (Mã)",
        "example": {
          "hanzi": "水平马马虎虎。",
          "pinyin": "Shuǐpíng mǎmǎhūhū.",
          "meaning": "Trình độ tàm tạm thôi."
        }
      },
      {
        "id": "v-316-3",
        "hanzi": "一心一意",
        "pinyin": "yì xīn yí yì",
        "hanviet": "Nhất tâm nhất ý",
        "meaning": "Toàn tâm toàn ý, hết lòng",
        "radical": "一 (Nhất)",
        "example": {
          "hanzi": "一心一意学汉语。",
          "pinyin": "Yì xīn yí yì xué Hànyǔ.",
          "meaning": "Hết lòng hết dạ học tiếng Trung."
        }
      },
      {
        "id": "v-316-4",
        "hanzi": "文化",
        "pinyin": "wénhuà",
        "hanviet": "Văn hóa",
        "meaning": "Văn hóa",
        "radical": "文 (Văn)",
        "example": {
          "hanzi": "中国传统文化。",
          "pinyin": "Zhōngguó chuántǒng wénhuà.",
          "meaning": "Văn hóa truyền thống Trung Hoa."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "俗",
        "pinyin": "sú",
        "meaning": "Phong tục, thói quen (Tục)",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Nhân đứng (亻) bên trái -> Bộ Cốc (谷) bên phải",
        "components": "亻 + 谷",
        "mnemonic": "Con người (Nhân) sinh sống trong thung lũng (Cốc) hình thành nên phong tục tập quán."
      },
      {
        "hanzi": "虎",
        "pinyin": "hǔ",
        "meaning": "Con hổ, dũng mãnh",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Hổ (虍) ở trên -> Nét cong móc dưới",
        "components": "虍 + 儿",
        "mnemonic": "Hình tượng chúa sơn lâm dũng mãnh giữa rừng già."
      }
    ],
    "step4_grammar": {
      "title": "Cách đặt câu với thành ngữ 4 chữ: Làm vị ngữ, định ngữ hoặc trạng ngữ",
      "formula": "Chủ ngữ + (是) + Thành ngữ  HOẶC  Thành ngữ + 地 + Động từ",
      "explanation": "Thành ngữ 4 chữ tiếng Trung cực kỳ cô đọng. Ví dụ: 他一心一意地学习 (Anh ấy toàn tâm toàn ý học tập).",
      "examples": [
        {
          "hanzi": "到了一个新的国家，我们应该学会入乡随俗，尊重当地的生活习惯。",
          "pinyin": "Dào le yí gè xīn de guójiā, wǒmen yīnggāi xuéhuì rù xiāng suí sú, zūnzhòng dāngdì de shēnghuó xíguàn.",
          "meaning": "Đến một quốc gia mới, chúng ta nên học cách nhập gia tùy tục, tôn trọng thói quen sinh hoạt bản địa."
        }
      ],
      "commonMistake": {
        "wrong": "入乡随俗地吃 ❌",
        "correct": "学会入乡随俗 ✔️",
        "explanation": "Dùng thành ngữ đúng ngữ cảnh văn hóa."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你第一次来中国生活，习惯用筷子吃饭了吗？",
          "pinyin": "Nǐ dì yī cì lái Zhōngguó shēnghuó, xíguàn yòng kuàizi chīfàn le ma?",
          "meaning": "Bạn lần đầu sang Trung Quốc sống, đã quen dùng đũa ăn cơm chưa?"
        },
        {
          "speaker": "B",
          "hanzi": "已经完全习惯了！中国人常说'入乡随俗'，我现在连吃面条都用筷子，感觉特别亲切。",
          "pinyin": "Yǐjīng wánquán xíguàn le! Zhōngguórén cháng shuō 'rù xiāng suí sú', wǒ xiànzài lián chī miàntiáo dōu yòng kuàizi, gǎnjué tèbié qīnqiè.",
          "meaning": "Tôi đã hoàn toàn quen rồi! Người Trung Quốc hay nói 'nhập gia tùy tục', bây giờ tôi đến ăn mì cũng dùng đũa, cảm thấy đặc biệt gần gũi."
        }
      ],
      "audioText": "中国人常说'入乡随俗'，我现在完全习惯了！",
      "question": "Thành ngữ nào được nhắc đến trong đoạn hội thoại?",
      "options": [
        "Mã mã hổ hổ",
        "Nhập gia tùy tục (rù xiāng suí sú)",
        "Nhất tâm nhất ý",
        "Tự do hành"
      ],
      "correctIndex": 1,
      "explanation": "B nói: 中国人常说入乡随俗."
    },
    "step6_speaking": {
      "prompt": "Đọc câu thành ngữ về sự thích nghi:",
      "targetSentence": "到了中国要入乡随俗。",
      "targetPinyin": "Dào le Zhōngguó yào rù xiāng suí sú.",
      "targetMeaning": "Đến Trung Quốc cần nhập gia tùy tục.",
      "hint": "Đọc rù xiāng suí sú dõng dạc."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Toàn tâm toàn ý học tập",
      "words": [
        "学习",
        "一心一意地"
      ],
      "correctOrder": [
        "一心一意地",
        "学习"
      ],
      "explanation": "一心一意地 + 学习."
    },
    "step8_quiz": [
      {
        "id": "q-316-1",
        "type": "multiple-choice",
        "question": "Thành ngữ '入乡随俗' tương đương với câu tục ngữ nào trong tiếng Việt?",
        "options": [
          "Nhập gia tùy tục",
          "Một nắng hai sương",
          "Uống nước nhớ nguồn",
          "Tay làm hàm nhai"
        ],
        "correctIndex": 0,
        "explanation": "Nhập hương tùy tục nghĩa là Nhập gia tùy tục."
      },
      {
        "id": "q-316-2",
        "type": "multiple-choice",
        "question": "Khi ai đó khiêm tốn nhận xét khả năng của mình 'tàm tạm thôi', họ thường dùng:",
        "options": [
          "入乡随俗",
          "马马虎虎 (mǎmǎhūhū)",
          "最好",
          "特别高"
        ],
        "correctIndex": 1,
        "explanation": "马马虎虎 là tàm tạm, bình thường."
      }
    ],
    "step9_challenge": {
      "title": "Nhà văn hóa tinh hoa",
      "taskDesc": "Đọc to câu: 'Tôi toàn tâm toàn ý học tiếng Trung và học cách nhập gia tùy tục'.",
      "targetPhrase": "wǒ yíxīnyíyì xué hànyǔ rùxiāngsuísú",
      "xpReward": 50,
      "badge": "Hiểu Sâu Văn Hóa"
    }
  },

  {
    "id": "l-317",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 17,
    "title": "Kể chuyện & Tự thuật (首先, 然后, 最后)",
    "chineseTitle": "叙事逻辑与故事复述（首先、然后、最后）",
    "subtitle": "Kỹ năng kể chuyện mạch lạc: Đầu tiên (首先), sau đó (然后), cuối cùng (最后) và liên từ thời gian.",
    "objective": "Kể lại một chuyến đi, một sự việc hoàn chỉnh 3–4 phút bằng chuỗi liên từ tuần tự.",
    "prerequisite": "Đã hoàn thành Bài 316.",
    "completionCriteria": "Đạt >= 70% trắc nghiệm và kể lại một mẩu chuyện ngắn có mở đầu, diễn biến, kết thúc.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Kể chuyện",
      "首先然后最后",
      "Tự thuật",
      "Diễn đạt dài"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-8"
    ],
    "step1_learn": {
      "topic": "Bộ ba liên từ tự thuật mạch lạc: 首先 (Shǒuxiān) ➔ 然后 (Ránhòu) ➔ 最后 (Zuìhòu)",
      "summary": "1. 首先 (đầu tiên/trước hết): Nêu khởi đầu sự việc. 2. 然后 (sau đó): Diễn biến tiếp nối. 3. 最后 (cuối cùng): Kết cục và cảm nghĩ rút ra.",
      "audioDemoText": "shǒuxiān wǒ qù jīchǎng, ránhòu zuò fēijī, zuìhòu dào le běijīng"
    },
    "step2_vocabulary": [
      {
        "id": "v-317-1",
        "hanzi": "首先",
        "pinyin": "shǒuxiān",
        "hanviet": "Thủ tiên",
        "meaning": "Đầu tiên, trước hết",
        "radical": "首 (Thủ)",
        "example": {
          "hanzi": "首先要准时。",
          "pinyin": "Shǒuxiān yào zhǔnshí.",
          "meaning": "Trước hết phải đúng giờ."
        }
      },
      {
        "id": "v-317-2",
        "hanzi": "然后",
        "pinyin": "ránhòu",
        "hanviet": "Nhiên hậu",
        "meaning": "Sau đó, tiếp theo",
        "radical": "灬 (Hỏa)",
        "example": {
          "hanzi": "然后去吃饭。",
          "pinyin": "Ránhòu qù chīfàn.",
          "meaning": "Sau đó đi ăn cơm."
        }
      },
      {
        "id": "v-317-3",
        "hanzi": "最后",
        "pinyin": "zuìhòu",
        "hanviet": "Tối hậu",
        "meaning": "Cuối cùng",
        "radical": "日 (Nhật)",
        "example": {
          "hanzi": "最后回家。",
          "pinyin": "Zuìhòu huí jiā.",
          "meaning": "Cuối cùng về nhà."
        }
      },
      {
        "id": "v-317-4",
        "hanzi": "故事",
        "pinyin": "gùshi",
        "hanviet": "Cố sự",
        "meaning": "Câu chuyện",
        "radical": "攵 (Phác)",
        "example": {
          "hanzi": "讲一个故事。",
          "pinyin": "Jiǎng yí gè gùshi.",
          "meaning": "Kể một câu chuyện."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "首",
        "pinyin": "shǒu",
        "meaning": "Đầu tiên, cái đầu (Thủ)",
        "strokesCount": 9,
        "strokeOrderText": "Hai chấm trên -> Ngang -> Khung Mục (目) có 3 nét ngang trong",
        "components": "Bộ Thủ (首)",
        "mnemonic": "Phần đầu của cơ thể dẫn đường đi trước tiên."
      },
      {
        "hanzi": "然",
        "pinyin": "rán",
        "meaning": "Đúng thế, tự nhiên (Nhiên)",
        "strokesCount": 12,
        "strokeOrderText": "Chữ Nguyệt (月) -> Chữ Khuyển (犬) -> Bốn chấm hỏa (灬)",
        "components": "肉 + 犬 + 灬",
        "mnemonic": "Nướng thịt thú trên lửa bốc hương thơm tự nhiên."
      }
    ],
    "step4_grammar": {
      "title": "Cấu trúc mạch truyện hoàn chỉnh trong phần thi nói HSKK",
      "formula": "首先...， 然后...， 接着...， 最后...。",
      "explanation": "Trong bài thi nói HSKK Sơ cấp và Trung cấp, giám khảo chấm điểm rất cao thí sinh biết dùng chuỗi liên từ này để kể lại câu chuyện tranh.",
      "examples": [
        {
          "hanzi": "周末我首先去图书馆借了书，然后和朋友去吃了烤鸭，最后心满意足地回到了家。",
          "pinyin": "Zhōumò wǒ shǒuxiān qù túshūguǎn jiè le shū, ránhòu hé péngyou qù chī le kǎoyā, zuìhòu xīnmǎnyìzú de huí dào le jiā.",
          "meaning": "Cuối tuần đầu tiên tôi đến thư viện mượn sách, sau đó đi ăn vịt quay cùng bạn bè, cuối cùng hài lòng trở về nhà."
        }
      ],
      "commonMistake": {
        "wrong": "Kể chuyện lộn xộn nhảy cóc thời gian.",
        "correct": "Tuân thủ thứ tự: 首先 -> 然后 -> 最后.",
        "explanation": "Tư duy logic thời gian mạch lạc."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "A",
          "hanzi": "你能讲讲你昨天是怎么去故宫的吗？",
          "pinyin": "Nǐ néng jiǎngjiang nǐ zuótiān shì zěnme qù Gùgōng de ma?",
          "meaning": "Bạn có thể kể lại hôm qua bạn đi Tử Cấm Thành như thế nào không?"
        },
        {
          "speaker": "B",
          "hanzi": "没问题！首先我早上七点起床吃了早饭，然后坐一号线地铁去天安门东站，最后排队半小时顺利进馆参观！",
          "pinyin": "Méi wèntí! Shǒuxiān wǒ zǎoshang qī diǎn qǐchuáng chī le zǎofàn, ránhòu zuò yī hào xiàn dìtiě qù Tiān'ānmén dōng zhàn, zuìhòu páiduì bàn xiǎoshí shùnlì jìn guǎn cānguān!",
          "meaning": "Được chứ! Đầu tiên 7 giờ sáng tôi thức dậy ăn điểm tâm, sau đó đi tàu điện tuyến số 1 đến ga Thiên An Môn Đông, cuối cùng xếp hàng nửa tiếng và thuận lợi vào tham quan!"
        }
      ],
      "audioText": "首先我早上七点起床，然后坐地铁，最后顺利进馆参观！",
      "question": "Người B đã dùng những liên từ nào để kể lại hành trình?",
      "options": [
        "Bởi vì cho nên",
        "Đầu tiên, sau đó, cuối cùng (shǒuxiān, ránhòu, zuìhòu)",
        "Mặc dù nhưng mà",
        "Không dùng liên từ"
      ],
      "correctIndex": 1,
      "explanation": "B dùng: 首先 -> 然后 -> 最后."
    },
    "step6_speaking": {
      "prompt": "Đọc câu kể lại trình tự một ngày:",
      "targetSentence": "首先学习，然后休息，最后睡觉。",
      "targetPinyin": "Shǒuxiān xuéxí, ránhòu xiūxi, zuìhòu shuìjiào.",
      "targetMeaning": "Trước hết học tập, sau đó nghỉ ngơi, cuối cùng đi ngủ.",
      "hint": "Đọc liền mạch 3 vế câu."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Trước hết học bài, sau đó đi chơi",
      "words": [
        "然后去玩",
        "首先学习"
      ],
      "correctOrder": [
        "首先学习",
        "然后去玩"
      ],
      "explanation": "首先学习 + 然后去玩."
    },
    "step8_quiz": [
      {
        "id": "q-317-1",
        "type": "multiple-choice",
        "question": "Liên từ mang nghĩa 'Đầu tiên, trước hết' là:",
        "options": [
          "然后 (ránhòu)",
          "首先 (shǒuxiān)",
          "最后 (zuìhòu)",
          "虽然 (suīrán)"
        ],
        "correctIndex": 1,
        "explanation": "首先 là đầu tiên, trước hết."
      },
      {
        "id": "q-317-2",
        "type": "multiple-choice",
        "question": "Chuỗi liên từ kể chuyện chuẩn mực trong tiếng Trung gồm:",
        "options": [
          "首先 ➔ 然后 ➔ 最后",
          "因为 ➔ 所以 ➔ 但是",
          "第一 ➔ 第二 ➔ 第四",
          "如果 ➔ 就 ➔ 那么"
        ],
        "correctIndex": 0,
        "explanation": "Cấu trúc kể chuyện: 首先 -> 然后 -> 最后."
      }
    ],
    "step9_challenge": {
      "title": "Bậc thầy kể chuyện",
      "taskDesc": "Đọc to câu chuyện 3 bước: 'Đầu tiên tôi học bài, sau đó ăn cơm, cuối cùng nghỉ ngơi'.",
      "targetPhrase": "shǒuxiān wǒ xuéxí ránhòu chīfàn zuìhòu xiūxi",
      "xpReward": 50,
      "badge": "Nhà Kể Chuyện Tài Ba"
    }
  },

  {
    "id": "l-318",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 18,
    "title": "Đọc hiểu đoạn văn phân cấp HSK 3 & Chiến thuật thi cử",
    "chineseTitle": "HSK 3级分级阅读与全真解题策略",
    "subtitle": "Kỹ thuật đọc lướt (Skimming), quét từ khóa (Scanning) và xử lý 30 câu đọc hiểu HSK 3 trong 30 phút.",
    "objective": "Đọc hiểu trôi chảy đoạn văn ngắn 100–150 chữ không cần tra từ điển và nắm chắc điểm đọc hiểu.",
    "prerequisite": "Đã hoàn thành Bài 317.",
    "completionCriteria": "Đạt >= 80% trắc nghiệm đọc hiểu đoạn văn phân cấp.",
    "durationMinutes": 20,
    "xpReward": 50,
    "tags": [
      "HSK 3",
      "Đọc hiểu",
      "Chiến thuật thi",
      "Kỹ năng đọc lướt"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "3 Bước vàng giải đề Đọc hiểu HSK 3",
      "summary": "1. Đọc câu hỏi và đáp án trước. 2. Quét nhanh từ khóa đối chiếu trong đoạn văn. 3. Xác định câu chủ đề (thường nằm ở đầu hoặc cuối đoạn).",
      "audioDemoText": "kuàisù yuèdú, zhǎo chū guānjiàncí, zhèngquè xuǎnzé dá'àn"
    },
    "step2_vocabulary": [
      {
        "id": "v-318-1",
        "hanzi": "阅读",
        "pinyin": "yuèdú",
        "hanviet": "Duyệt độc",
        "meaning": "Đọc hiểu",
        "radical": "门 (Môn)",
        "example": {
          "hanzi": "阅读理解。",
          "pinyin": "Yuèdú lǐjiě.",
          "meaning": "Đọc hiểu văn bản."
        }
      },
      {
        "id": "v-318-2",
        "hanzi": "简单",
        "pinyin": "jiǎndān",
        "hanviet": "Giản đơn",
        "meaning": "Đơn giản",
        "radical": "竹 (Trúc)",
        "example": {
          "hanzi": "这个问题很简 đơn.",
          "pinyin": "Zhè ge wèntí hěn jiǎndān.",
          "meaning": "Vấn đề này rất đơn giản."
        }
      },
      {
        "id": "v-318-3",
        "hanzi": "其实",
        "pinyin": "qíshí",
        "hanviet": "Kỳ thực",
        "meaning": "Thực ra, kỳ thực",
        "radical": "八 (Bát)",
        "example": {
          "hanzi": "其实并不难。",
          "pinyin": "Qíshí bìng bù nán.",
          "meaning": "Thực ra không khó chút nào."
        }
      },
      {
        "id": "v-318-4",
        "hanzi": "选择",
        "pinyin": "xuǎnzé",
        "hanviet": "Tuyển trạch",
        "meaning": "Lựa chọn",
        "radical": "辶 (Sước)",
        "example": {
          "hanzi": "做出正确的选择。",
          "pinyin": "Zuò chū zhèngquè de xuǎnzé.",
          "meaning": "Đưa ra sự lựa chọn đúng đắn."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "选",
        "pinyin": "xuǎn",
        "meaning": "Tuyển chọn, bầu chọn",
        "strokesCount": 9,
        "strokeOrderText": "Chữ Tiên (先) bên trong -> Bộ Sước (辶) bao ngoài",
        "components": "先 + 辶",
        "mnemonic": "Bước đi lên trước tiên (Tiên + Sước) được tuyển chọn tài năng."
      },
      {
        "hanzi": "择",
        "pinyin": "zé",
        "meaning": "Chọn lựa (Trạch)",
        "strokesCount": 8,
        "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Dịch (睪) rút gọn bên phải",
        "components": "扌 + 尺",
        "mnemonic": "Dùng bàn tay (Thủ) đo đạc lựa chọn phương án tối ưu."
      }
    ],
    "step4_grammar": {
      "title": "Phó từ chuyển ngoặt tinh tế: 其实 (qíshí - Thực ra / Kỳ thực)",
      "formula": "Tưởng là sự việc thế này, 其实 + Sự thật khách quan đằng sau",
      "explanation": "Từ 其实 thường dùng để sửa lại nhận thức chưa chính xác của người đối diện, hé lộ sự thật.",
      "examples": [
        {
          "hanzi": "很多人以为学中文很难，其实只要掌握了汉字规律，就会觉得非常有趣。",
          "pinyin": "Hěn duō rén yǐwéi xué Zhōngwén hěn nán, qíshí zhǐyào zhǎngwò le hànzì guīlǜ, jiù huì juéde fēicháng yǒuqù.",
          "meaning": "Rất nhiều người nghĩ học tiếng Trung khó, thực ra chỉ cần nắm chắc quy luật chữ Hán là sẽ thấy vô cùng thú vị."
        }
      ],
      "commonMistake": {
        "wrong": "其实放在句尾 ❌",
        "correct": "其实 đứng ở đầu vế câu thứ 2 ✔️",
        "explanation": "其实 làm liên từ nối mở đầu vế giải thích."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Người đọc",
          "hanzi": "很多人觉得学汉字很累，其实汉字像一幅画。只要你了解了它的部首和偏旁，就能像猜谜语一样记住它的意思，不仅不难，还很有意思！",
          "pinyin": "Hěn duō rén juéde xué hànzì hěn lèi, qíshí hànzì xiàng yì fú huà. Zhǐyào nǐ liǎojiě le tā de bùshǒu hé piānpáng, jiù néng xiàng cāi mǐyǔ yíyàng jì zhù tā de yìsi, bùjǐn bù nán, hái hěn yǒu yìsi!",
          "meaning": "Nhiều người thấy học chữ Hán mệt, thực ra chữ Hán giống như một bức tranh. Chỉ cần bạn hiểu bộ thủ của nó, là có thể nhớ nghĩa như đoán câu đố, chẳng những không khó mà còn rất thú vị!"
        }
      ],
      "audioText": "其实汉字像一幅画，了解了部首就能记住它的意思！",
      "question": "Bí quyết nhớ chữ Hán được đoạn văn nêu ra là gì?",
      "options": [
        "Viết đi viết lại 100 lần",
        "Hiểu bộ thủ và chiết tự như bức tranh (liǎojiě bùshǒu xiàng huà)",
        "Học vẹt",
        "Không cần học"
      ],
      "correctIndex": 1,
      "explanation": "Đoạn văn nhấn mạnh: 了解了它的部首和偏旁."
    },
    "step6_speaking": {
      "prompt": "Khẳng định sự thật học tiếng Trung:",
      "targetSentence": "其实汉语并不难。",
      "targetPinyin": "Qíshí Hànyǔ bìng bù nán.",
      "targetMeaning": "Thực ra tiếng Trung không khó chút nào.",
      "hint": "Đọc bìng bù nán nhấn mạnh."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Đưa ra lựa chọn đúng đắn",
      "words": [
        "正确的选择",
        "做出"
      ],
      "correctOrder": [
        "做出",
        "正确的选择"
      ],
      "explanation": "做出 + 正确的选择."
    },
    "step8_quiz": [
      {
        "id": "q-318-1",
        "type": "multiple-choice",
        "question": "Từ '其实' (qíshí) mang nghĩa là gì?",
        "options": [
          "Tất nhiên",
          "Thực ra / Kỳ thực",
          "Bởi vì",
          "Có lẽ"
        ],
        "correctIndex": 1,
        "explanation": "其实 là thực ra, trên thực tế."
      },
      {
        "id": "q-318-2",
        "type": "multiple-choice",
        "question": "Chiến thuật làm bài đọc hiểu HSK 3 tốt nhất là:",
        "options": [
          "Đọc kỹ từng chữ từ đầu đến cuối trước",
          "Đọc câu hỏi và từ khóa trước rồi quét tìm trong bài",
          "Đoán mò không cần đọc",
          "Bỏ qua phần đọc hiểu"
        ],
        "correctIndex": 1,
        "explanation": "Đọc câu hỏi trước để tìm mục tiêu thông tin nhanh chóng."
      }
    ],
    "step9_challenge": {
      "title": "Đọc quét thần tốc",
      "taskDesc": "Đọc to câu: 'Thực ra chỉ cần nắm chắc phương pháp thì bài đọc hiểu nào cũng làm được'.",
      "targetPhrase": "qíshí zhǐyào zhǎngwò fāngfǎ jiù néng zuò duì",
      "xpReward": 50,
      "badge": "Tốc Độ Đọc Đỉnh Cao"
    }
  },

  {
    "id": "l-319",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 19,
    "title": "Tổng ôn tập toàn diện 600 từ vựng & Ngữ pháp HSK 1–3",
    "chineseTitle": "HSK 1-3级全景语法大一统与600核心词总揽",
    "subtitle": "Đại hội tổng duyệt kiến thức 3 cấp độ: Bổ ngữ kết quả, bổ ngữ khả năng, câu chữ 把, câu chữ 被, câu chữ 比.",
    "objective": "Hệ thống hóa toàn bộ 600 từ vựng cốt lõi và 144 điểm ngữ pháp của trọn bộ Giai đoạn Sơ cấp & Giao tiếp độc lập.",
    "prerequisite": "Đã hoàn thành Bài 301–318.",
    "completionCriteria": "Đạt >= 85% bài kiểm tra tổng hợp toàn diện Level 1–3.",
    "durationMinutes": 30,
    "xpReward": 80,
    "tags": [
      "HSK 3",
      "Tổng kết Giai đoạn 1",
      "600 từ vựng",
      "Review Checkpoint"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-4",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Đại hội đồ ngũ đại ngữ pháp tiếng Trung: 比 (So sánh) + 把 (Tác động) + 被 (Bị động) + Bổ ngữ + 3 chữ Đích",
      "summary": "Chúc mừng bạn đã đi qua trọn vẹn lộ trình 60 bài học nghiên cứu! Bạn đã trang bị: 1. Phát âm Pinyin bản ngữ. 2. 600 từ vựng cốt lõi. 3. Tự tin giao tiếp và xử lý mọi tình huống độc lập.",
      "audioDemoText": "hsk yī dào sān jí zǒngfùxí, wǒmen zhǔnbèi hǎo le, yídìng néng chénggōng"
    },
    "step2_vocabulary": [
      {
        "id": "v-319-1",
        "hanzi": "水平",
        "pinyin": "shuǐpíng",
        "hanviet": "Thủy bình",
        "meaning": "Trình độ",
        "radical": "水 (Thủy)",
        "example": {
          "hanzi": "汉语水平很高。",
          "pinyin": "Hànyǔ shuǐpíng hěn gāo.",
          "meaning": "Trình độ tiếng Trung rất cao."
        }
      },
      {
        "id": "v-319-2",
        "hanzi": "成功",
        "pinyin": "chénggōng",
        "hanviet": "Thành công",
        "meaning": "Thành công",
        "radical": "戈 (Qua)",
        "example": {
          "hanzi": "祝你成功！",
          "pinyin": "Zhù nǐ chénggōng!",
          "meaning": "Chúc bạn thành công!"
        }
      },
      {
        "id": "v-319-3",
        "hanzi": "坚持",
        "pinyin": "jiānchí",
        "hanviet": "Kiên trì",
        "meaning": "Kiên trì",
        "radical": "土 (Thổ)",
        "example": {
          "hanzi": "坚持到底。",
          "pinyin": "Jiānchí dào dǐ.",
          "meaning": "Kiên trì đến cùng."
        }
      },
      {
        "id": "v-319-4",
        "hanzi": "自信",
        "pinyin": "zìxìn",
        "hanviet": "Tự tín",
        "meaning": "Tự tin",
        "radical": "自 (Tự)",
        "example": {
          "hanzi": "充满自信。",
          "pinyin": "Chōngmǎn zìxìn.",
          "meaning": "Tràn đầy tự tin."
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "平",
        "pinyin": "píng",
        "meaning": "Bằng phẳng, hòa bình",
        "strokesCount": 5,
        "strokeOrderText": "Ngang trên -> Phẩy -> Chấm -> Ngang dưới -> Sổ thẳng giữa",
        "components": "干 + 八",
        "mnemonic": "Cái cân thăng bằng hai bên biểu thị sự chuẩn xác ngang bằng."
      },
      {
        "hanzi": "持",
        "pinyin": "chí",
        "meaning": "Cầm giữ, kiên trì",
        "strokesCount": 9,
        "strokeOrderText": "Bộ Thủ (扌) bên trái -> Chữ Tự (寺) bên phải",
        "components": "扌 + 寺",
        "mnemonic": "Bàn tay giữ vững đạo đức tôn nghiêm cửa chùa."
      }
    ],
    "step4_grammar": {
      "title": "Bảng đồ họa ma trận 5 cấu trúc câu kinh điển nhất tiếng Trung",
      "formula": "1. Câu chữ 比: A 比 B + Tính từ. 2. Câu chữ 把: S + 把 + O + V + khác. 3. Câu chữ 被: O + 被 + S + V + khác. 4. Bổ ngữ kết quả: V + 完/好/懂/见/到. 5. Bổ ngữ khả năng: V + 得/不 + Kết quả.",
      "explanation": "Làm chủ 5 cấu trúc này đồng nghĩa với việc bạn đã có đủ 100% vũ khí ngữ pháp để đạt điểm tuyệt đối HSK 3.",
      "examples": [
        {
          "hanzi": "只要坚持到底，把学过的知识复习好，你就一定能取得成功！",
          "pinyin": "Zhǐyào jiānchí dào dǐ, bǎ xué guo de zhīshi fùxí hǎo, nǐ jiù yídìng néng qǔdé chénggōng!",
          "meaning": "Chỉ cần kiên trì đến cùng, ôn tập tốt kiến thức đã học, bạn nhất định sẽ gặt hái thành công!"
        }
      ],
      "commonMistake": {
        "wrong": "Học vẹt từng câu rời rạc.",
        "correct": "Kết nối các câu thành đoạn văn liền mạch.",
        "explanation": "Tư duy ngôn ngữ bậc trung cấp."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Thầy giáo",
          "hanzi": "同学们，恭喜你们完成了HSK 1级到3级的全部60节课程！大家现在不仅词汇量达到了600词，而且完全具备了独立中文交流的能力！",
          "pinyin": "Tóngxuémen, gōngxǐ nǐmen wánchéng le HSK yī jí dào sān jí de quánbù liùshí jié kèchéng! Dàjiā xiànzài bùjǐn cíhuìliàng dádào le liù bǎi cí, érqiě wánquán jùbèi le dúlì Zhōngwén jiāoliú de nénglì!",
          "meaning": "Các em học sinh, chúc mừng các em đã hoàn thành toàn bộ 60 bài học từ HSK 1 đến HSK 3! Các em bây giờ chẳng những vốn từ đạt 600 từ, mà còn hoàn toàn sở hữu năng lực giao tiếp tiếng Trung độc lập!"
        },
        {
          "speaker": "Học sinh",
          "hanzi": "老师，我们已经做好了准备，随时可以迎接终极Boss大挑战！",
          "pinyin": "Lǎoshī, wǒmen yǐjīng zuò hǎo le zhǔnbèi, suíshí kěyǐ yíngjiē zhōngjí Boss dà tiǎozhàn!",
          "meaning": "Thưa thầy, chúng em đã chuẩn bị sẵn sàng, bất cứ lúc nào cũng có thể đón nhận đại thử thách Boss tối thượng!"
        }
      ],
      "audioText": "恭喜你们完成了HSK 1-3级全部60节课程！完全具备了独立交流的能力！",
      "question": "Thành quả của học viên sau khi hoàn thành 60 bài học là gì?",
      "options": [
        "Mới biết đếm số",
        "Nắm vững 600 từ vựng và hoàn toàn có năng lực giao tiếp độc lập (dúlì jiāoliú de nénglì)",
        "Chưa biết viết chữ Hán",
        "Chỉ biết nghe"
      ],
      "correctIndex": 1,
      "explanation": "Thầy giáo chúc mừng: 具备了独立中文交流的能力."
    },
    "step6_speaking": {
      "prompt": "Khẳng định sự tự tin chinh phục HSK 3:",
      "targetSentence": "我相信我一定能成功！",
      "targetPinyin": "Wǒ xiāngxìn wǒ yídìng néng chénggōng!",
      "targetMeaning": "Tôi tin rằng tôi nhất định sẽ thành công!",
      "hint": "Đọc xiāngxìn dõng dạc và tự tin."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Kiên trì nhất định sẽ thành công",
      "words": [
        "一定会成功",
        "坚持"
      ],
      "correctOrder": [
        "坚持",
        "一定会成功"
      ],
      "explanation": "坚持 + 一定会成功."
    },
    "step8_quiz": [
      {
        "id": "q-319-1",
        "type": "multiple-choice",
        "question": "Hành trình HSK 1 đến HSK 3 của HanziGo trang bị bao nhiêu bài học sư phạm chuẩn hóa?",
        "options": [
          "20 bài",
          "40 bài",
          "60 bài học sư phạm khép kín (Levels 1–3)",
          "10 bài"
        ],
        "correctIndex": 2,
        "explanation": "Trọn bộ 60 bài học 9 bước sư phạm khép kín."
      },
      {
        "id": "q-319-2",
        "type": "multiple-choice",
        "question": "Khái niệm 'Stage 1: HSK 1–3' trong khung chương trình HanziGo mang tên là:",
        "options": [
          "Sơ cấp & Giao tiếp độc lập",
          "Dịch cabin",
          "Cổ phong thi họa",
          "Thương mại quốc tế"
        ],
        "correctIndex": 0,
        "explanation": "Stage 1 là giai đoạn Sơ cấp & Giao tiếp độc lập."
      }
    ],
    "step9_challenge": {
      "title": "Khúc khải hoàn 60 bài",
      "taskDesc": "Đọc to câu tuyên thệ tự tin: 'Tôi đã hoàn thành 60 bài học và sẵn sàng đại chiến Boss HSK 3!'.",
      "targetPhrase": "wǒ wánchéng le liùshí jié kèchéng zhǔnbèi dǎ boss",
      "xpReward": 80,
      "badge": "Chiến Binh 60 Bài"
    }
  },

  {
    "id": "l-320",
    "chapterId": "ch-12",
    "levelId": "lvl-3",
    "lessonNumber": 20,
    "title": "Boss Challenge HSK 3 (Đề thi thử 80 câu CTI & Thi nói HSKK)",
    "chineseTitle": "HSK 3级终极通关大考与HSKK口语模拟认证",
    "subtitle": "Đại kỳ thi sát hạch đỉnh cao Stage 1: 80 câu hỏi Nghe, Đọc, Viết chuẩn CTI kèm bài thi nói phản xạ HSKK.",
    "objective": "Chính thức tốt nghiệp Giai đoạn 1 (HSK 1–3): Đạt chứng chỉ quốc tế và hoàn toàn tự chủ trong thế giới tiếng Trung.",
    "prerequisite": "Đã hoàn thành toàn bộ Bài 101–319.",
    "completionCriteria": "Đạt >= 80% điểm bài thi để nhận Vương Miện Master Stage 1.",
    "durationMinutes": 45,
    "xpReward": 150,
    "tags": [
      "HSK 3",
      "Boss Challenge",
      "HSKK Thi nói",
      "Đại tốt nghiệp Stage 1"
    ],
    "relatedMaterialIds": [
      "mat-3",
      "mat-10"
    ],
    "step1_learn": {
      "topic": "Cấu trúc Đại kỳ thi HSK 3 & Khảo thí khẩu ngữ HSKK Sơ cấp",
      "summary": "HSK 3 gồm: 1. Nghe hiểu (40 câu, 35 phút). 2. Đọc hiểu (30 câu, 30 phút, KHÔNG CÒN PINYIN HỖ TRỢ). 3. Viết (10 câu, sắp xếp câu và viết chữ Hán điền từ). HSKK: Nghe nhắc lại và trả lời câu hỏi.",
      "audioDemoText": "gōngxǐ nǐ dàodá hsk sān jí zhōngjí zhànchǎng, qǐng zhǎnxiàn nǐ de shíli"
    },
    "step2_vocabulary": [
      {
        "id": "v-320-1",
        "hanzi": "毕业",
        "pinyin": "bìyè",
        "hanviet": "Tất nghiệp",
        "meaning": "Tốt nghiệp",
        "radical": "十 (Thập)",
        "example": {
          "hanzi": "大学毕业了。",
          "pinyin": "Dàxué bìyè le.",
          "meaning": "Tốt nghiệp đại học rồi."
        }
      },
      {
        "id": "v-320-2",
        "hanzi": "梦想",
        "pinyin": "mèngxiǎng",
        "hanviet": "Mộng tưởng",
        "meaning": "Ước mơ, hoài bão",
        "radical": "夕 (Tịch)",
        "example": {
          "hanzi": "实现梦想。",
          "pinyin": "Shíxiàn mèngxiǎng.",
          "meaning": "Thực hiện ước mơ."
        }
      },
      {
        "id": "v-320-3",
        "hanzi": "未来",
        "pinyin": "wèilái",
        "hanviet": "Vị lai",
        "meaning": "Tương lai",
        "radical": "木 (Mộc)",
        "example": {
          "hanzi": "美好的未来。",
          "pinyin": "Měihǎo de wèilái.",
          "meaning": "Tương lai tốt đẹp."
        }
      },
      {
        "id": "v-320-4",
        "hanzi": "加油",
        "pinyin": "jiāyóu",
        "hanviet": "Gia du",
        "meaning": "Cố lên, nỗ lực lên",
        "radical": "力 (Lực)",
        "example": {
          "hanzi": "一起加油！",
          "pinyin": "Yìqǐ jiāyóu!",
          "meaning": "Cùng nhau cố lên!"
        }
      }
    ],
    "step3_hanzi": [
      {
        "hanzi": "毕",
        "pinyin": "bì",
        "meaning": "Tất, hoàn thành trọn vẹn (Tất)",
        "strokesCount": 6,
        "strokeOrderText": "Bộ Tỷ (比) ở trên -> Bộ Thập (十) ở dưới",
        "components": "比 + 十",
        "mnemonic": "So sánh trọn vẹn mười phần (Tỷ + Thập) kết thúc chặng đường học tập."
      },
      {
        "hanzi": "梦",
        "pinyin": "mèng",
        "meaning": "Ước mơ, giấc mộng",
        "strokesCount": 11,
        "strokeOrderText": "Hai chữ Mộc (林) ở trên -> Bộ Tịch (夕) ở dưới",
        "components": "木 + 木 + 夕",
        "mnemonic": "Ánh trăng đêm (Tịch) chiếu qua cánh rừng (Lâm) dệt nên giấc mơ."
      }
    ],
    "step4_grammar": {
      "title": "Lời dặn dò tâm huyết của Antigravity & HanziGo",
      "formula": "Ngôn ngữ không phải là gánh nặng thi cử, ngôn ngữ là cánh cửa mở ra thế giới mới",
      "explanation": "Từ Bài 101 với những thanh điệu ngọng nghịu đầu tiên, bạn đã kiên trì bước qua 60 bài học để chạm tới đỉnh cao HSK 3 hôm nay. Hãy tự hào về chính mình!",
      "examples": [
        {
          "hanzi": "今天，我用汉语走向更广阔的世界！",
          "pinyin": "Jīntiān, wǒ yòng Hànyǔ zǒuxiàng gèng guǎngkuò de shìjiè!",
          "meaning": "Hôm nay, tôi dùng tiếng Trung bước ra thế giới rộng lớn hơn!"
        }
      ],
      "commonMistake": {
        "wrong": "Nghĩ rằng dừng lại sau HSK 3.",
        "correct": "HSK 3 là bệ phóng vươn tới HSK 4, 5, 6 và dịch thuật chuyên nghiệp.",
        "explanation": "Hành trình học tập là suốt đời."
      }
    },
    "step5_listening": {
      "dialogue": [
        {
          "speaker": "Khảo quan CTI",
          "hanzi": "恭喜你！经过严格考核，你的听力、阅读、书写和口语全项达标，正式授予你'HSK 3级独立交流学者'荣誉称号！",
          "pinyin": "Gōngxǐ nǐ! Jīngguò yángé kǎohé, nǐ de tīnglì, yuèdú, shūxiě hé kǒuyǔ quán xiàng dābiāo, zhèngshì shòuyǔ nǐ 'HSK sān jí dúlì jiāoliú xuézhě' róngyù chēnghào!",
          "meaning": "Chúc mừng bạn! Trải qua sát hạch nghiêm ngặt, nghe, đọc, viết và nói của bạn đều đạt chuẩn, chính thức trao tặng bạn danh hiệu danh dự 'Học giả Giao tiếp Độc lập HSK 3'!"
        },
        {
          "speaker": "Thí sinh HanziGo",
          "hanzi": "感谢HanziGo！从零开始到今天，我真正体会到了掌握一门语言的自豪和快乐！中国，我来啦！",
          "pinyin": "Gǎnxiè HanziGo! Cóng líng kāishǐ dào jīntiān, wǒ zhēnzhèng tǐhuì dào le zhǎngwò yì mén yǔyán de zìháo hé kuàilè! Zhōngguó, wǒ lái la!",
          "meaning": "Cảm ơn HanziGo! Từ con số 0 đến hôm nay, tôi thực sự cảm nhận được niềm tự hào và niềm vui làm chủ một ngôn ngữ! Trung Quốc ơi, tôi đến đây!"
        }
      ],
      "audioText": "恭喜你全项达标，正式授予你HSK 3级独立交流学者荣誉！",
      "question": "Danh hiệu vinh dự được trao tặng cho thí sinh là gì?",
      "options": [
        "Người học bắt đầu",
        "Học giả Giao tiếp Độc lập HSK 3 (HSK sān jí dúlì jiāoliú xuézhě)",
        "Khách qua đường",
        "Chưa đạt yêu cầu"
      ],
      "correctIndex": 1,
      "explanation": "Giám khảo tuyên bố danh hiệu danh dự chính thức."
    },
    "step6_speaking": {
      "prompt": "Đọc to lời tuyên ngôn tốt nghiệp Stage 1:",
      "targetSentence": "中国，我来啦！",
      "targetPinyin": "Zhōngguó, wǒ lái la!",
      "targetMeaning": "Trung Quốc ơi, tôi đến đây!",
      "hint": "Đọc vang dội, hào sảng và tràn ngập niềm vui."
    },
    "step7_writing": {
      "prompt": "Sắp xếp câu: Thực hiện ước mơ của tôi",
      "words": [
        "我的梦想",
        "实现"
      ],
      "correctOrder": [
        "实现",
        "我的梦想"
      ],
      "explanation": "实现 + 我的梦想."
    },
    "step8_quiz": [
      {
        "id": "q-320-1",
        "type": "multiple-choice",
        "question": "Điểm khác biệt then chốt giữa phần Đọc hiểu HSK 3 và HSK 1-2 là gì?",
        "options": [
          "Có nhiều tranh hơn",
          "HSK 3 hoàn toàn KHÔNG CÒN PINYIN hỗ trợ trong đề thi đọc hiểu",
          "Bài thi ngắn hơn",
          "Dễ hơn HSK 1"
        ],
        "correctIndex": 1,
        "explanation": "HSK 3 là kỳ thi chính thức cắt bỏ hoàn toàn Pinyin trong bài đọc hiểu."
      },
      {
        "id": "q-320-2",
        "type": "multiple-choice",
        "question": "Sau khi hoàn thành 60 bài học Levels 1–3, bạn đã chính thức làm chủ:",
        "options": [
          "100 chữ Hán",
          "600 từ vựng cốt lõi, 144 điểm ngữ pháp và khả năng du lịch, sinh hoạt, làm việc độc lập",
          "Chỉ biết nghe bập bõm",
          "Không thể tự đi lại"
        ],
        "correctIndex": 1,
        "explanation": "Khẳng định trọn vẹn thành quả sư phạm nghiên cứu của HanziGo."
      }
    ],
    "step9_challenge": {
      "title": "VƯƠNG MIỆN ĐẠI TỐT NGHIỆP STAGE 1",
      "taskDesc": "Đọc to câu tuyên thệ tốt nghiệp trọn vẹn 60 bài học để mở khóa danh hiệu Bậc Thầy Giai Đoạn 1!",
      "targetPhrase": "wǒ chénggōng tōngguò le hsk sān jí bìyè la",
      "xpReward": 150,
      "badge": "Vương Miện Hanzi Master Stage 1"
    }
  }
];

// Helper: Find lesson by id from curriculum dataset
export function getCurriculumLessonById(lessonId) {
  return CURRICULUM_60_LESSONS.find(l => l.id === lessonId);
}
