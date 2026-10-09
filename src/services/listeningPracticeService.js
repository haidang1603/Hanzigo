/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: LISTENING PRACTICE SERVICE
 * =========================================================================
 * Hệ thống luyện nghe hiểu chuyên sâu:
 * Mỗi bài tập bao gồm:
 * - Audio (Văn bản phát âm TTS / Web Speech)
 * - Transcript (Nội dung bài nghe)
 * - Question (Câu hỏi nghe hiểu)
 * - Answer (Đáp án đúng)
 * - Explanation (Giải thích chi tiết)
 * 
 * 5 dạng bài tập chuẩn hóa:
 * 1. Multiple Choice (Trắc nghiệm chọn đáp án đúng)
 * 2. True / False (Đúng / Sai theo nội dung nghe)
 * 3. Fill Blank (Nghe và điền từ khuyết)
 * 4. Dictation (Chính tả: Nghe và chép lại toàn bộ câu)
 * 5. Keyword Identification (Nhận diện từ khóa trọng tâm: giá cả, thời gian, địa điểm)
 * 
 * Tính năng điều khiển:
 * - Replay (Nghe lại)
 * - Slow playback (Tốc độ chậm 0.75x)
 * - Transcript toggle (Ẩn / hiện bản ghi transcript)
 */

export const LISTENING_EXERCISES = [
  {
    id: 'lis-1',
    level: 'HSK 1',
    type: 'multiple_choice',
    title: 'Hẹn gặp thời gian & địa điểm',
    audioText: '明天上午九点，我们在图书馆门口见面。',
    pinyin: 'Míngtiān shàngwǔ jiǔ diǎn, wǒmen zài túshūguǎn ménkǒu jiànmiàn.',
    transcript: '明天上午九点，我们在图书馆门口见面。',
    question: 'Họ hẹn gặp nhau lúc mấy giờ?',
    options: [
      { text: '8 giờ sáng', isCorrect: false },
      { text: '9 giờ sáng', isCorrect: true },
      { text: '10 giờ trưa', isCorrect: false },
      { text: '2 giờ chiều', isCorrect: false }
    ],
    correctAnswer: '9 giờ sáng',
    explanation: 'Trong câu nói rõ: "明天上午九点" (Míngtiān shàngwǔ jiǔ diǎn = 9 giờ sáng ngày mai).'
  },
  {
    id: 'lis-2',
    level: 'HSK 2',
    type: 'true_false',
    title: 'Lời dặn của bác sĩ',
    audioText: '大夫说我感冒了，要多喝水，不要吃辣的。',
    pinyin: 'Dàifu shuō wǒ gǎnmào le, yào duō hē shuǐ, bú yào chī là de.',
    transcript: '大夫说我感冒了，要多喝水，不要吃辣的。',
    question: 'Đúng hay Sai: Bác sĩ khuyên bệnh nhân nên ăn nhiều đồ ăn cay?',
    options: [
      { text: 'Đúng (正确)', isCorrect: false },
      { text: 'Sai (错误)', isCorrect: true }
    ],
    correctAnswer: 'Sai (错误)',
    explanation: 'Bác sĩ căn dặn "不要吃辣的" (bú yào chī là de = không được ăn đồ cay), do đó nhận định trên là Sai.'
  },
  {
    id: 'lis-3',
    level: 'HSK 1',
    type: 'fill_blank',
    title: 'Hỏi đường đến ga tàu',
    audioText: '请问，去火车站坐哪路公共汽车？',
    pinyin: 'Qǐngwèn, qù huǒchēzhàn zuò nǎ lù gōnggòng qìchē?',
    transcript: '请问，去火车站坐哪路公共汽车？',
    question: 'Nghe và điền từ còn thiếu: 请问，去___坐哪路公共汽车？',
    correctAnswer: '火车站',
    acceptableAnswers: ['火车站', 'huǒchēzhàn', 'huochezhan', 'Ga tàu', 'ga xe lửa'],
    explanation: 'Từ khuyết là "火车站" (huǒchēzhàn = ga xe lửa, ga tàu hỏa).'
  },
  {
    id: 'lis-4',
    level: 'HSK 2',
    type: 'dictation',
    title: 'Chính tả câu dự báo thời tiết',
    audioText: '今天北京的天气非常晴朗。',
    pinyin: 'Jīntiān Běijīng de tiānqì fēicháng qínglǎng.',
    transcript: '今天北京的天气非常晴朗。',
    question: 'Nghe và gõ lại toàn bộ câu chính tả bằng chữ Hán:',
    correctAnswer: '今天北京的天气非常晴朗。',
    acceptableAnswers: [
      '今天北京的天气非常晴朗',
      '今天北京的天气非常晴朗。',
      'Jīntiān Běijīng de tiānqì fēicháng qínglǎng'
    ],
    explanation: 'Câu chính tả hoàn chỉnh: "今天北京的天气非常晴朗。" (Hôm nay thời tiết Bắc Kinh vô cùng quang đãng).'
  },
  {
    id: 'lis-5',
    level: 'HSK 2',
    type: 'keyword_identification',
    title: 'Nhận diện giá tiền khi mua sắm',
    audioText: '这件毛衣两百五十块钱，太贵了，便宜一点儿吧。',
    pinyin: 'Zhè jiàn máoyī liǎng bǎi wǔshí kuài qián, tài guì le, piányi yìdiǎnr ba.',
    transcript: '这件毛衣两百五十块钱，太贵了，便宜一点儿吧。',
    question: 'Chiếc áo len được người bán ra giá bao nhiêu tiền?',
    targetKeyword: '两百五十块',
    options: [
      { text: '150 tệ', isCorrect: false },
      { text: '200 tệ', isCorrect: false },
      { text: '250 tệ', isCorrect: true },
      { text: '350 tệ', isCorrect: false }
    ],
    correctAnswer: '250 tệ',
    explanation: 'Từ khóa giá tiền là "两百五十块钱" (liǎng bǎi wǔshí kuài qián = 250 tệ).'
  }
];

export const PLAYBACK_RATES = {
  NORMAL: 1.0,
  SLOW: 0.75
};

/**
 * Lấy danh sách bài tập luyện nghe theo cấp độ
 */
export function getListeningExercises(level = 'all') {
  if (!level || level === 'all') return LISTENING_EXERCISES;
  return LISTENING_EXERCISES.filter(e => e.level.toLowerCase() === level.toLowerCase());
}

/**
 * Lấy bài tập nghe theo ID
 */
export function getListeningExerciseById(exerciseId) {
  return LISTENING_EXERCISES.find(e => e.id === exerciseId) || LISTENING_EXERCISES[0];
}

/**
 * Đánh giá kết quả bài tập nghe hiểu
 */
export function evaluateListeningExercise({ exercise, userAnswer = '' }) {
  if (!exercise) throw new Error('Bài tập luyện nghe không hợp lệ.');

  const cleanUser = String(userAnswer).trim();
  let isCorrect = false;

  switch (exercise.type) {
    case 'multiple_choice':
    case 'keyword_identification': {
      isCorrect = cleanUser === exercise.correctAnswer;
      break;
    }

    case 'true_false': {
      isCorrect = cleanUser === exercise.correctAnswer || 
        (String(userAnswer) === 'false' && exercise.correctAnswer.includes('Sai')) ||
        (String(userAnswer) === 'true' && exercise.correctAnswer.includes('Đúng'));
      break;
    }

    case 'fill_blank':
    case 'dictation': {
      const sanitizedUser = cleanUser.replace(/[\s\p{P}]/gu, '').toLowerCase();
      const sanitizedTarget = (exercise.correctAnswer || '').replace(/[\s\p{P}]/gu, '').toLowerCase();
      const acceptableSanitized = (exercise.acceptableAnswers || []).map(a => 
        String(a).trim().replace(/[\s\p{P}]/gu, '').toLowerCase()
      );

      isCorrect = sanitizedUser === sanitizedTarget || acceptableSanitized.includes(sanitizedUser);
      break;
    }

    default:
      isCorrect = cleanUser === exercise.correctAnswer;
  }

  let feedback = '';
  if (isCorrect) {
    feedback = `Tuyệt vời! Bạn đã nghe hiểu chính xác. Giải thích: ${exercise.explanation}`;
  } else {
    feedback = `Chưa chính xác. Bạn đã chọn/nhập: "${cleanUser}". Đáp án đúng: "${exercise.correctAnswer}". Giải thích: ${exercise.explanation}`;
  }

  return {
    isCorrect,
    userAnswer: cleanUser,
    correctAnswer: exercise.correctAnswer,
    transcript: exercise.transcript,
    pinyin: exercise.pinyin,
    explanation: exercise.explanation,
    feedback
  };
}
