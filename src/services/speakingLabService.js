/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: SPEAKING LAB SERVICE
 * =========================================================================
 * Kiến trúc luyện nói tương tác chuyên sâu:
 * Flow: AI Prompt -> User listens -> User speaks -> Speech Recognition ->
 *       Pronunciation Diagnostic -> Feedback -> Retry
 * 
 * Phân tích thực tế:
 * - Word recognition (tỷ lệ nhận diện)
 * - Missing words (từ bị phát âm sót)
 * - Extra words (từ thừa/phát âm chệch)
 * - Duration & Speaking pace (ký tự/phút)
 * - RMS energy (năng lượng âm lượng microphone)
 * - Pronunciation consistency (nhất quán nhịp điệu & lịch sử thử lại)
 * 
 * NGUYÊN TẮC: KHÔNG tuyên bố F0/tone contour analysis nếu chưa có cảm biến âm học thực.
 */

import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator.js';

export const SPEAKING_LAB_PROMPTS = [
  {
    id: 'spk-1',
    level: 'HSK 1',
    category: 'Chào hỏi & Giao tiếp cơ bản',
    promptHanzi: '你好，很高兴认识你。',
    promptPinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ.',
    promptMeaning: 'Xin chào, rất vui được quen biết bạn.',
    promptContext: 'Gặp gỡ một người bạn Trung Quốc lần đầu tiên tại trường học.',
    targetKeywords: ['你好', '高兴', '认识'],
    idealPaceCPM: 150
  },
  {
    id: 'spk-2',
    level: 'HSK 1',
    category: 'Hỏi thăm & Sinh hoạt',
    promptHanzi: '今天天气真好，你想去哪儿？',
    promptPinyin: 'Jīntiān tiānqì zhēn hǎo, nǐ xiǎng qù nǎr?',
    promptMeaning: 'Hôm nay thời tiết thật đẹp, bạn muốn đi đâu?',
    promptContext: 'Rủ bạn cùng phòng ra ngoài dạo chơi vào ngày cuối tuần nắng đẹp.',
    targetKeywords: ['今天', '天气', '想', '去哪儿'],
    idealPaceCPM: 160
  },
  {
    id: 'spk-3',
    level: 'HSK 2',
    category: 'Ăn uống & Mua sắm',
    promptHanzi: '服务员，请给我一杯冰水，谢谢。',
    promptPinyin: 'Fúwùyuán, qǐng gěi wǒ yì bēi bīng shuǐ, xièxie.',
    promptMeaning: 'Phục vụ ơi, làm ơn cho tôi một cốc nước đá, cảm ơn.',
    promptContext: 'Gọi nước khi đang ngồi tại quán ăn ở Bắc Kinh.',
    targetKeywords: ['服务员', '请', '一杯', '冰水', '谢谢'],
    idealPaceCPM: 170
  },
  {
    id: 'spk-4',
    level: 'HSK 2',
    category: 'Hỏi đường & Di chuyển',
    promptHanzi: '请问，去地铁站怎么走？',
    promptPinyin: 'Qǐngwèn, qù dìtiězhàn zěnme zǒu?',
    promptMeaning: 'Xin hỏi, đi đến ga tàu điện ngầm đi đường nào?',
    promptContext: 'Hỏi người đi đường khi bạn cần tìm lối vào ga tàu điện ngầm.',
    targetKeywords: ['请问', '地铁站', '怎么走'],
    idealPaceCPM: 160
  },
  {
    id: 'spk-5',
    level: 'HSK 3',
    category: 'Công việc & Lịch hẹn',
    promptHanzi: '虽然今天下雨，但是我们还是要按时开会。',
    promptPinyin: 'Suīrán jīntiān xiàyǔ, dànshì wǒmen háishì yào ànshí kāihuì.',
    promptMeaning: 'Tuy hôm nay trời mưa, nhưng chúng tôi vẫn phải họp đúng giờ.',
    promptContext: 'Thông báo lịch họp làm việc nhóm tại văn phòng.',
    targetKeywords: ['虽然', '但是', '按时', '开会'],
    idealPaceCPM: 180
  }
];

/**
 * Lấy danh sách AI Prompts theo cấp độ
 */
export function getSpeakingLabPrompts(level = 'all') {
  if (!level || level === 'all') return SPEAKING_LAB_PROMPTS;
  return SPEAKING_LAB_PROMPTS.filter(p => p.level.toLowerCase() === level.toLowerCase());
}

/**
 * Đánh giá phiên luyện nói Speaking Lab toàn diện
 * 
 * @param {Object} params
 * @param {Object} params.prompt - AI Prompt mục tiêu
 * @param {string} params.spokenTranscript - Văn bản nhận diện được từ giọng nói thực
 * @param {number} params.audioDurationMs - Thời lượng thu âm (ms)
 * @param {number} params.audioEnergyRms - Năng lượng âm lượng (RMS 0-100)
 * @param {Array} params.attemptHistory - Lịch sử các lần thử trước của prompt này
 * @returns {Object} Kết quả chẩn đoán chuyên sâu Speaking Lab
 */
export function evaluateSpeakingLabSession({
  prompt,
  spokenTranscript = '',
  audioDurationMs = 0,
  audioEnergyRms = 50,
  attemptHistory = []
}) {
  if (!prompt || !prompt.promptHanzi) {
    throw new Error('AI Prompt hợp lệ là bắt buộc để đánh giá Speaking Lab.');
  }

  // 1. Phân tích phát âm lõi qua evaluator trung thực
  const diagnostic = evaluateRealPronunciation({
    targetHanzi: prompt.promptHanzi,
    targetPinyin: prompt.promptPinyin,
    spokenTranscript,
    audioDurationMs,
    audioEnergyRms
  });

  // 2. Tính toán cải thiện qua các lần thử (Retry comparison)
  const currentAttemptIndex = attemptHistory.length + 1;
  let improvement = {
    isFirstAttempt: currentAttemptIndex === 1,
    accuracyDelta: 0,
    consistencyDelta: 0,
    notes: 'Lần thử đầu tiên.'
  };

  if (attemptHistory.length > 0) {
    const previous = attemptHistory[attemptHistory.length - 1];
    const prevScore = previous.overall || 0;
    const prevConsistency = previous.pronunciationConsistency?.score || 70;

    const accDelta = diagnostic.overall - prevScore;
    const consDelta = (diagnostic.pronunciationConsistency?.score || 70) - prevConsistency;

    let deltaNote = '';
    if (accDelta > 0) {
      deltaNote = `Tiến bộ +${accDelta} điểm so với lần thử trước!`;
    } else if (accDelta === 0) {
      deltaNote = 'Điểm số ổn định so với lần trước.';
    } else {
      deltaNote = `Điểm số giảm ${Math.abs(accDelta)} điểm, hãy tập trung khẩu hình hơn.`;
    }

    improvement = {
      isFirstAttempt: false,
      accuracyDelta: accDelta,
      consistencyDelta: consDelta,
      notes: deltaNote
    };
  }

  // 3. Phân tích chi tiết lỗi phát âm (Pedagogical Advice)
  const pedagogicalFeedback = generateSpeakingPedagogicalFeedback({
    diagnostic,
    prompt
  });

  // 4. Quyết định Retry khuyến nghị
  const retryRecommended = diagnostic.overall < 85 || (diagnostic.missingWords && diagnostic.missingWords.length > 0);
  const canAdvance = diagnostic.overall >= 75;

  return {
    promptId: prompt.id,
    attemptNumber: currentAttemptIndex,
    spokenTranscript: diagnostic.spokenText || '',
    diagnostic,
    improvement,
    feedback: pedagogicalFeedback,
    retryRecommended,
    canAdvance,
    timestamp: new Date().toISOString()
  };
}

/**
 * Tạo lời giải thích sư phạm tự động dựa trên chẩn đoán
 */
export function generateSpeakingPedagogicalFeedback({ diagnostic }) {
  if (!diagnostic.isValid) {
    return {
      summary: 'Chưa nhận diện được giọng nói.',
      advice: 'Microphone chưa thu được tín hiệu phát âm rõ ràng. Vui lòng bấm micro và đọc to câu mẫu.',
      actionItems: ['Kiểm tra quyền truy cập micro trên trình duyệt.', 'Đến gần microphone và đọc dứt khoát.']
    };
  }

  const actionItems = [];

  // Phân tích từ sót
  if (diagnostic.missingWords && diagnostic.missingWords.length > 0) {
    actionItems.push(`Bạn đã bỏ sót hoặc phát âm chưa rõ các chữ: "${diagnostic.missingWords.join(', ')}". Hãy chú ý ngắt âm rõ từng chữ.`);
  }

  // Phân tích từ thừa
  if (diagnostic.extraWords && diagnostic.extraWords.length > 0) {
    actionItems.push(`Máy ghi nhận thêm các âm không có trong câu mẫu: "${diagnostic.extraWords.join(', ')}". Hãy giữ nhịp đọc tập trung vào câu mẫu.`);
  }

  // Phân tích tốc độ nói
  if (diagnostic.speakingPace?.category === 'too_fast') {
    actionItems.push('Tốc độ nói quá nhanh làm trôi mất thanh điệu. Tiếng Trung cần phát âm đầy đủ trường độ từng âm tiết.');
  } else if (diagnostic.speakingPace?.category === 'too_slow') {
    actionItems.push('Tốc độ nói hơi chậm hoặc ngập ngừng. Hãy nghe âm mẫu nhiều lần để câu nói liền mạch tự nhiên hơn.');
  }

  // Phân tích năng lượng âm lượng
  if (diagnostic.rmsEnergy?.assessment === 'low') {
    actionItems.push('Âm lượng nói hơi nhỏ. Hãy mở khẩu hình to hơn để âm phát ra đầy đặn.');
  } else if (diagnostic.rmsEnergy?.assessment === 'noisy') {
    actionItems.push('Tín hiệu âm thanh bị ồn hoặc rè. Nên luyện tập ở nơi yên tĩnh.');
  }

  if (actionItems.length === 0) {
    actionItems.push('Phát âm rất chuẩn xác! Hãy duy trì ngữ điệu tự nhiên này.');
  }

  return {
    summary: diagnostic.rank,
    advice: diagnostic.feedback,
    actionItems,
    honestDisclaimer: diagnostic.toneContourHonesty?.note
  };
}
