/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: GRAMMAR ENGINE
 * =========================================================================
 * Bộ máy học ngữ pháp chuyên sâu:
 * Flow: Pattern -> Explanation -> Examples -> Practice -> Correction
 * 
 * 4 dạng bài tập tương tác:
 * 1. Sentence Builder (Xây dựng câu từng phần)
 * 2. Fill Blank (Điền trợ từ / từ loại vào chỗ trống)
 * 3. Word Ordering (Sắp xếp từ bị xáo trộn, e.g. 我 + 喜欢 + 喝 + 茶 -> 我喜欢喝茶。)
 * 4. Translation Practice (Dịch câu Việt - Trung kèm phân tích ngữ pháp)
 */

export const GRAMMAR_LESSONS = [
  {
    id: 'gram-1',
    level: 'HSK 1',
    code: 'G1',
    title: 'Cấu trúc biểu đạt sở thích với 喜欢 (xǐhuan)',
    pattern: 'S (Chủ ngữ) + 喜欢 + V (Động từ) + O (Tân ngữ)',
    explanation: 'Trong tiếng Trung, động từ 喜欢 (thích) có thể trực tiếp đi kèm với một động từ khác để biểu thị sở thích làm một việc gì đó. Trật tự câu tương tự như tiếng Việt: Ai + thích + làm gì.',
    examples: [
      {
        hanzi: '我喜欢喝茶。',
        pinyin: 'Wǒ xǐhuan hē chá.',
        meaning: 'Tôi thích uống trà.'
      },
      {
        hanzi: '她喜欢学中文。',
        pinyin: 'Tā xǐhuan xué Zhōngwén.',
        meaning: 'Cô ấy thích học tiếng Trung.'
      },
      {
        hanzi: '我们喜欢看电影。',
        pinyin: 'Wǒmen xǐhuan kàn diànyǐng.',
        meaning: 'Chúng tôi thích xem phim.'
      }
    ],
    exercises: [
      {
        id: 'g1-ex1',
        type: 'word_ordering',
        title: 'Sắp xếp trật tự từ: Sở thích uống trà',
        prompt: 'Sắp xếp các thẻ từ sau thành câu hoàn chỉnh đúng ngữ pháp:',
        scrambledTokens: ['喝', '我', '茶', '喜欢'],
        correctTokens: ['我', '喜欢', '喝', '茶'],
        correctSentence: '我喜欢喝茶。',
        pinyin: 'Wǒ xǐhuan hē chá.',
        meaning: 'Tôi thích uống trà.',
        explanation: 'Trật tự chuẩn: Chủ ngữ "我" đứng đầu, tiếp đến là động từ sở thích "喜欢", sau đó là cụm vị ngữ "喝茶" (động từ + tân ngữ).'
      },
      {
        id: 'g1-ex2',
        type: 'fill_blank',
        title: 'Điền từ thích hợp vào chỗ trống',
        prompt: 'Chọn từ thích hợp điền vào câu: 他___看书。 (Anh ấy thích đọc sách)',
        sentence: '他___看书。',
        options: ['喜欢', '吗', '很', '是'],
        correctAnswer: '喜欢',
        pinyin: 'Tā xǐhuan kànshū.',
        meaning: 'Anh ấy thích đọc sách.',
        explanation: 'Động từ "喜欢" đứng trước hành động "看书" để diễn đạt ý thích đọc sách.'
      },
      {
        id: 'g1-ex3',
        type: 'sentence_builder',
        title: 'Xây dựng câu hoàn chỉnh',
        prompt: 'Ghép các thành phần ngữ pháp sau thành câu diễn đạt "Chúng tôi thích học tiếng Trung":',
        availableTokens: ['我们', '喜欢', '学', '中文', '很', '不'],
        targetSentenceTokens: ['我们', '喜欢', '学', '中文'],
        correctSentence: '我们喜欢学中文。',
        meaning: 'Chúng tôi thích học tiếng Trung.',
        explanation: 'Cấu trúc chuẩn: Chúng tôi (我们) + Thích (喜欢) + Học (学) + Tiếng Trung (中文).'
      },
      {
        id: 'g1-ex4',
        type: 'translation_practice',
        title: 'Luyện dịch câu ứng dụng',
        promptVietnamese: 'Cô ấy thích nghe nhạc.',
        targetChinese: '她喜欢听音乐。',
        pinyin: 'Tā xǐhuan tīng yīnyuè.',
        acceptableVariations: ['她喜欢听音乐', '她喜欢听音乐。'],
        keywordHints: ['她 (tā)', '喜欢 (xǐhuan)', '听 (tīng)', '音乐 (yīnyuè)'],
        explanation: 'Dịch chuẩn: Cô ấy (她) + thích (喜欢) + nghe (听) + âm nhạc (音乐).'
      }
    ]
  },
  {
    id: 'gram-2',
    level: 'HSK 1',
    code: 'G2',
    title: 'Câu phán đoán với động từ 是 (shì)',
    pattern: 'S (Chủ ngữ) + 是 + N / Đại từ (Tân ngữ)',
    explanation: 'Động từ "是" tương đương với từ "là" trong tiếng Việt, dùng để phán đoán hoặc xác nhận danh tính, quốc tịch, nghề nghiệp của người hoặc sự vật.',
    examples: [
      {
        hanzi: '我是越南人。',
        pinyin: 'Wǒ shì Yuènán rén.',
        meaning: 'Tôi là người Việt Nam.'
      },
      {
        hanzi: '他是我的老师。',
        pinyin: 'Tā shì wǒ de lǎoshī.',
        meaning: 'Thầy ấy là giáo viên của tôi.'
      }
    ],
    exercises: [
      {
        id: 'g2-ex1',
        type: 'word_ordering',
        title: 'Sắp xếp trật tự từ: Khẳng định quốc tịch',
        prompt: 'Sắp xếp các từ sau thành câu đúng ngữ pháp:',
        scrambledTokens: ['越南人', '是', '我'],
        correctTokens: ['我', '是', '越南人'],
        correctSentence: '我是越南人。',
        pinyin: 'Wǒ shì Yuènán rén.',
        meaning: 'Tôi là người Việt Nam.',
        explanation: 'Chủ ngữ "我" + động từ phán đoán "是" + danh từ quốc tịch "越南人".'
      },
      {
        id: 'g2-ex2',
        type: 'fill_blank',
        title: 'Điền từ vào câu phán đoán',
        prompt: 'Điền động từ thích hợp: 这___我爸爸。 (Đây là bố của tôi)',
        sentence: '这___我爸爸。',
        options: ['是', '有', '在', '很'],
        correctAnswer: '是',
        pinyin: 'Zhè shì wǒ bàba.',
        meaning: 'Đây là bố của tôi.',
        explanation: 'Khẳng định quan hệ thân nhân dùng động từ "是".'
      },
      {
        id: 'g2-ex3',
        type: 'translation_practice',
        title: 'Luyện dịch câu phán đoán',
        promptVietnamese: 'Anh ấy là học sinh của tôi.',
        targetChinese: '他是我的学生。',
        pinyin: 'Tā shì wǒ de xuésheng.',
        acceptableVariations: ['他是我的学生', '他是我的学生。'],
        keywordHints: ['他 (tā)', '是 (shì)', '我的 (wǒ de)', '学生 (xuésheng)'],
        explanation: 'Chủ ngữ (他) + động từ (是) + định ngữ sở hữu (我的) + trung tâm ngữ (学生).'
      }
    ]
  },
  {
    id: 'gram-3',
    level: 'HSK 2',
    code: 'G3',
    title: 'Câu so sánh hơn với chữ 比 (bǐ)',
    pattern: 'A + 比 + B + Tính từ (Adjective) [+ Số lượng cụ thể]',
    explanation: 'Trong tiếng Trung, so sánh "A hơn B về mặt nào đó" dùng giới từ "比". Lưu ý: Tuyệt đối KHÔNG thêm các phó từ chỉ mức độ như "很", "非常", "真" trước tính từ trong câu chữ 比.',
    examples: [
      {
        hanzi: '哥哥比我高。',
        pinyin: 'Gēge bǐ wǒ gāo.',
        meaning: 'Anh trai cao hơn tôi.'
      },
      {
        hanzi: '今天比昨天冷。',
        pinyin: 'Jīntiān bǐ zuótiān lěng.',
        meaning: 'Hôm nay lạnh hơn hôm qua.'
      }
    ],
    exercises: [
      {
        id: 'g3-ex1',
        type: 'word_ordering',
        title: 'Sắp xếp câu so sánh hơn',
        prompt: 'Sắp xếp câu: Hôm nay lạnh hơn hôm qua',
        scrambledTokens: ['冷', '今天', '昨天', '比'],
        correctTokens: ['今天', '比', '昨天', '冷'],
        correctSentence: '今天比昨天冷。',
        pinyin: 'Jīntiān bǐ zuótiān lěng.',
        meaning: 'Hôm nay lạnh hơn hôm qua.',
        explanation: 'Công thức chuẩn: A (今天) + 比 + B (昨天) + Tính từ (冷).'
      },
      {
        id: 'g3-ex2',
        type: 'fill_blank',
        title: 'Điền từ so sánh',
        prompt: 'Điền giới từ so sánh: 苹果___香蕉贵。 (Táo đắt hơn chuối)',
        sentence: '苹果___香蕉贵。',
        options: ['比', '跟', '像', '对'],
        correctAnswer: '比',
        pinyin: 'Píngguǒ bǐ xiāngjiāo guì.',
        meaning: 'Táo đắt hơn chuối.',
        explanation: 'So sánh mức độ hơn kém dùng giới từ "比".'
      },
      {
        id: 'g3-ex3',
        type: 'translation_practice',
        title: 'Dịch câu so sánh hơn',
        promptVietnamese: 'Anh ấy cao hơn tôi.',
        targetChinese: '他比我高。',
        pinyin: 'Tā bǐ wǒ gāo.',
        acceptableVariations: ['他比我高', '他比我高。'],
        keywordHints: ['他 (tā)', '比 (bǐ)', '我 (wǒ)', '高 (gāo)'],
        explanation: 'Cấu trúc: A (他) + 比 + B (我) + Tính từ (高). Không dùng "很".'
      }
    ]
  }
];

/**
 * Lấy danh sách bài học ngữ pháp theo cấp độ
 */
export function getGrammarLessons(level = 'all') {
  if (!level || level === 'all') return GRAMMAR_LESSONS;
  return GRAMMAR_LESSONS.filter(l => l.level.toLowerCase() === level.toLowerCase());
}

/**
 * Lấy bài học theo ID
 */
export function getGrammarLessonById(lessonId) {
  return GRAMMAR_LESSONS.find(l => l.id === lessonId) || GRAMMAR_LESSONS[0];
}

/**
 * Kiểm tra kết quả Word Ordering & Sentence Builder
 */
export function validateWordOrdering({ userOrderedTokens = [], exercise }) {
  if (!exercise) throw new Error('Bài tập ngữ pháp không hợp lệ.');

  const targetTokens = exercise.correctTokens || exercise.targetSentenceTokens || [];
  const cleanUserTokens = userOrderedTokens.map(t => String(t).trim()).filter(Boolean);
  
  const isLengthMatch = cleanUserTokens.length === targetTokens.length;
  const isSequenceMatch = isLengthMatch && cleanUserTokens.every((token, index) => token === targetTokens[index]);

  const assembledSentence = cleanUserTokens.join('');
  const cleanTargetSentence = (exercise.correctSentence || '').replace(/[\s\p{P}]/gu, '');
  const cleanAssembled = assembledSentence.replace(/[\s\p{P}]/gu, '');

  const isCorrect = isSequenceMatch || (cleanAssembled === cleanTargetSentence);

  let feedback = '';
  if (isCorrect) {
    feedback = `Chính xác! Câu hoàn chỉnh: "${exercise.correctSentence}". ${exercise.explanation}`;
  } else {
    feedback = `Chưa chính xác. Bạn đã sắp xếp thành: "${assembledSentence}". Trật tự đúng là: "${exercise.correctSentence}". Gợi ý: ${exercise.explanation}`;
  }

  return {
    isCorrect,
    userSentence: assembledSentence,
    correctSentence: exercise.correctSentence,
    feedback,
    explanation: exercise.explanation
  };
}

/**
 * Kiểm tra kết quả Fill in the Blank
 */
export function validateFillBlank({ userAnswer = '', exercise }) {
  if (!exercise) throw new Error('Bài tập điền từ không hợp lệ.');

  const cleanUser = String(userAnswer).trim();
  const cleanCorrect = String(exercise.correctAnswer).trim();
  const isCorrect = cleanUser.toLowerCase() === cleanCorrect.toLowerCase();

  let feedback = '';
  if (isCorrect) {
    feedback = `Chính xác! Đáp án đúng là "${cleanCorrect}". ${exercise.explanation}`;
  } else {
    feedback = `Chưa đúng. Bạn chọn "${cleanUser}", nhưng đáp án chính xác là "${cleanCorrect}". Gợi ý: ${exercise.explanation}`;
  }

  return {
    isCorrect,
    userAnswer: cleanUser,
    correctAnswer: cleanCorrect,
    feedback,
    explanation: exercise.explanation
  };
}

/**
 * Kiểm tra kết quả Translation Practice
 */
export function validateTranslationPractice({ userTranslation = '', exercise }) {
  if (!exercise) throw new Error('Bài tập dịch không hợp lệ.');

  const cleanUser = String(userTranslation).trim().replace(/[\s\p{P}]/gu, '');
  const cleanTarget = String(exercise.targetChinese).trim().replace(/[\s\p{P}]/gu, '');
  
  const variations = (exercise.acceptableVariations || [exercise.targetChinese]).map(v => 
    String(v).trim().replace(/[\s\p{P}]/gu, '')
  );

  const isCorrect = cleanUser === cleanTarget || variations.includes(cleanUser);

  let feedback = '';
  if (isCorrect) {
    feedback = `Dịch rất xuất sắc! Câu chuẩn: "${exercise.targetChinese}" (${exercise.pinyin}). ${exercise.explanation}`;
  } else {
    feedback = `Câu dịch chưa thật chính xác. Câu dịch của bạn: "${userTranslation}". Đáp án chuẩn: "${exercise.targetChinese}" (${exercise.pinyin}). Giải thích: ${exercise.explanation}`;
  }

  return {
    isCorrect,
    userTranslation,
    targetChinese: exercise.targetChinese,
    feedback,
    explanation: exercise.explanation
  };
}

/**
 * Unified Exercise Validator
 */
export function evaluateGrammarExercise({ exercise, submission }) {
  if (!exercise) throw new Error('Bài tập không hợp lệ.');

  switch (exercise.type) {
    case 'word_ordering':
    case 'sentence_builder':
      return validateWordOrdering({
        userOrderedTokens: submission.tokens || submission,
        exercise
      });

    case 'fill_blank':
      return validateFillBlank({
        userAnswer: submission.answer || submission,
        exercise
      });

    case 'translation_practice':
      return validateTranslationPractice({
        userTranslation: submission.text || submission,
        exercise
      });

    default:
      throw new Error(`Loại bài tập không được hỗ trợ: ${exercise.type}`);
  }
}
