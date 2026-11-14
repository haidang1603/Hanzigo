/**
 * =========================================================================
 * HANZI GO - REALISTIC PRONUNCIATION EVALUATION ENGINE
 * =========================================================================
 * Đánh giá phát âm trung thực, tách bạch giữa Nhận dạng ký tự (STT),
 * Phân tích âm tiết (Syllables/Tones), và Độ trôi chảy (Fluency/Acoustics).
 * TUYỆT ĐỐI KHÔNG SỬ DỤNG Math.random() ĐỂ TẠO ĐIỂM SỐ ẢO 98/100.
 */

// Bảng thanh điệu Pinyin chuẩn
const TONE_MARKS = {
  1: ['ā', 'ō', 'ē', 'ī', 'ū', 'ǖ'],
  2: ['á', 'ó', 'é', 'í', 'ú', 'ǘ'],
  3: ['ǎ', 'ǒ', 'ě', 'ǐ', 'ǔ', 'ǚ'],
  4: ['à', 'ò', 'è', 'ì', 'ù', 'ǜ']
};

/**
 * Trích xuất thanh điệu từ chuỗi Pinyin (1, 2, 3, 4 hoặc 5 cho khinh thanh)
 */
export function extractTone(pinyinStr = '') {
  const p = pinyinStr.toLowerCase();
  for (let tone = 1; tone <= 4; tone++) {
    for (const char of TONE_MARKS[tone]) {
      if (p.includes(char)) return tone;
    }
  }
  const match = p.match(/[1-5]$/);
  if (match) return parseInt(match[0], 10);
  return 5; // Thanh nhẹ / Khinh thanh
}

/**
 * Đánh giá phát âm dựa trên dữ liệu thu âm thực tế
 * 
 * @param {Object} params
 * @param {string} params.targetHanzi - Chữ Hán mục tiêu (Ví dụ: "你好")
 * @param {string} params.targetPinyin - Pinyin mục tiêu (Ví dụ: "nǐ hǎo")
 * @param {string} params.spokenTranscript - Văn bản nhận diện được từ giọng nói (SpeechRecognition)
 * @param {number} params.audioDurationMs - Thời lượng người dùng phát âm (mili-giây)
 * @param {number} params.audioEnergyRms - Năng lượng âm thanh thu được từ Web Audio Analyser
 * @returns {Object} Kết quả đánh giá chi tiết
 */
// Nhóm chữ đồng âm phổ biến mà ASR hay nhận nhầm khi chấm phát âm offline
const HOMOPHONE_GROUPS = [
  '他她它',
  '在再',
  '的得地',
  '做作坐座',
  '和合河',
  '以已椅',
  '有友又右',
  '是事市试室',
  '那哪',
  '这着',
  '吗妈马骂',
  '没每妹',
  '几己',
  '工公功',
  '进近',
  '快块',
  '期七妻',
  '新心',
  '看刊',
  '听厅',
];

function isHomophonePair(a, b) {
  if (!a || !b || a === b) return false;
  return HOMOPHONE_GROUPS.some((group) => group.includes(a) && group.includes(b));
}

export function evaluateRealPronunciation({
  targetHanzi = '',
  targetPinyin: _targetPinyin = '',
  spokenTranscript = '',
  audioDurationMs = 0,
  audioEnergyRms: _audioEnergyRms = 0
}) {
  const cleanTarget = targetHanzi.replace(/[\s\p{P}]/gu, '');
  const cleanSpoken = (spokenTranscript || '').replace(/[\s\p{P}]/gu, '');

  // 1. Kiểm tra nếu không nhận diện được tín hiệu âm thanh
  if (!cleanSpoken) {
    return {
      isValid: false,
      overall: 0,
      accuracyScore: 0,
      fluencyScore: 0,
      charBreakdown: Array.from(cleanTarget).map(char => ({
        char,
        status: 'unrecognized',
        label: 'Chưa thu được âm'
      })),
      rank: 'Chưa đạt',
      rankBadge: 'Chưa nhận diện được 🎙️',
      feedback: 'Máy chưa thu được giọng nói rõ ràng. Vui lòng phát âm to, dứt khoát từng chữ và kiểm tra micro.',
      xpEarned: 0
    };
  }

  // 2. Phân tích từng ký tự (hỗ trợ nhận diện chữ đồng âm ASR)
  const targetChars = Array.from(cleanTarget);
  let exactCount = 0;
  let partialCount = 0;

  const charBreakdown = targetChars.map((char, index) => {
    const spokenAtIdx = cleanSpoken[index];
    if (spokenAtIdx === char) {
      exactCount += 1;
      return { char, status: 'correct', label: 'Chuẩn xác' };
    } else if (isHomophonePair(char, spokenAtIdx)) {
      partialCount += 0.75;
      return { char, status: 'warning', label: `Đồng âm ASR (${spokenAtIdx})` };
    } else if (cleanSpoken.includes(char)) {
      partialCount += 0.5;
      return { char, status: 'warning', label: 'Cần chỉnh thanh điệu/âm tiết' };
    } else {
      return { char, status: 'incorrect', label: 'Phát âm chưa đúng' };
    }
  });

  // 3. Tính điểm độ chính xác (Accuracy Score) dựa trên tỷ lệ khớp thực tế
  const totalChars = targetChars.length || 1;
  const matchRatio = Math.min(1, (exactCount + partialCount) / totalChars);
  const accuracyScore = Math.round(matchRatio * 100);

  // 4. Tính điểm độ trôi chảy (Fluency Score) dựa trên thời lượng phát âm thực
  // Trung bình mỗi âm tiết tiếng Trung phát âm chuẩn mất khoảng 350ms - 550ms
  const idealMinDuration = totalChars * 300;
  const idealMaxDuration = totalChars * 900;
  let fluencyScore = 78;

  if (audioDurationMs > 0) {
    if (audioDurationMs >= idealMinDuration && audioDurationMs <= idealMaxDuration) {
      // Tính độ lệch so với thời lượng vàng ~450ms/chữ để điểm phân hóa tự nhiên thay vì luôn 95
      const idealCenter = totalChars * 450;
      const deviationRatio = Math.min(1, Math.abs(audioDurationMs - idealCenter) / idealCenter);
      fluencyScore = Math.max(70, Math.min(96, Math.round(96 - (deviationRatio * 20))));
    } else if (audioDurationMs < idealMinDuration) {
      fluencyScore = Math.max(50, Math.round(55 + (audioDurationMs / idealMinDuration) * 15)); // Phát âm quá vội
    } else {
      fluencyScore = Math.max(50, Math.round(75 - Math.min(25, ((audioDurationMs - idealMaxDuration) / 1000) * 10))); // Kéo dài quá
    }
  }

  // 5. Phân tích chi tiết lỗi từ vựng & âm tiết (Speaking Lab Diagnostics)
  const missingWords = targetChars.filter(char => !cleanSpoken.includes(char));
  const spokenChars = Array.from(cleanSpoken);
  const extraWords = spokenChars.filter(char => !targetChars.includes(char));

  // 6. Tính tốc độ nói (Speaking Pace: Chars Per Minute)
  const durationSec = audioDurationMs > 0 ? audioDurationMs / 1000 : (totalChars * 0.45);
  const charsPerMinute = durationSec > 0 ? Math.round((cleanSpoken.length / (durationSec / 60))) : 0;
  let paceCategory = 'optimal';
  let paceFeedback = 'Tốc độ phát âm tự nhiên, ngắt nghỉ hợp lý.';

  if (charsPerMinute < 90 && audioDurationMs > 0) {
    paceCategory = 'too_slow';
    paceFeedback = 'Tốc độ hơi chậm hoặc ngập ngừng. Hãy luyện phát âm liền mạch hơn.';
  } else if (charsPerMinute > 260 && audioDurationMs > 0) {
    paceCategory = 'too_fast';
    paceFeedback = 'Tốc độ hơi nhanh, dễ làm mất rõ nét thanh điệu. Hãy chậm lại một chút.';
  }

  // 7. Phân tích mức năng lượng / âm lượng (RMS Energy)
  const rmsLevel = typeof _audioEnergyRms === 'number' ? Math.round(_audioEnergyRms) : 50;
  let energyAssessment = 'optimal';
  let energyFeedback = 'Âm lượng rõ ràng, micro bắt âm tốt.';

  if (rmsLevel < 18) {
    energyAssessment = 'low';
    energyFeedback = 'Âm lượng hơi nhỏ hoặc micro cách xa. Hãy phát âm to và dứt khoát hơn.';
  } else if (rmsLevel > 82) {
    energyAssessment = 'noisy';
    energyFeedback = 'Môi trường có tạp âm hoặc micro bị rè. Hãy kiểm tra lại không gian luyện tập.';
  }

  // 8. Tính độ nhất quán (Pronunciation Consistency)
  const perCharDuration = audioDurationMs > 0 ? audioDurationMs / totalChars : 400;
  const timingDeviation = Math.abs(perCharDuration - 450);
  let consistencyScore = Math.max(55, Math.min(98, Math.round(95 - (timingDeviation / 18))));
  if (accuracyScore === 100) consistencyScore = Math.max(82, consistencyScore);

  // 9. Tính điểm thanh điệu dự kiến & điểm tổng hợp phân hóa chân thực
  // Giảm bớt thiên vị 93 điểm: Điểm tổng hợp kết hợp accuracy, fluency và nhịp điệu
  let overall = 0;
  if (accuracyScore === 0) {
    overall = 0;
  } else {
    // Nếu đúng 100% chữ, điểm giao động linh hoạt theo tốc độ nói và trường độ thực từ 86 đến 98
    const baseScore = accuracyScore * 0.70 + fluencyScore * 0.20 + (consistencyScore * 0.10);
    overall = Math.max(15, Math.min(98, Math.round(baseScore)));
  }

  // 10. Nhận xét định tính trung thực
  let rank = 'Cần luyện thêm';
  let rankBadge = 'Cần luyện thêm ✍️';
  let feedback = '';

  if (overall >= 90 && exactCount === totalChars) {
    rank = 'Xuất sắc';
    rankBadge = 'Xuất sắc 🌟';
    feedback = `Tuyệt vời! Bạn phát âm chuẩn xác hoàn toàn ${exactCount}/${totalChars} chữ, ngữ điệu và trường độ rất tự nhiên.`;
  } else if (overall >= 75) {
    rank = 'Rất tốt';
    rankBadge = 'Rất tốt 👏';
    feedback = `Khá chuẩn! Nhận diện đúng ${exactCount}/${totalChars} chữ. Hãy chú ý mở khẩu hình tròn hơn để thanh điệu rõ ràng hơn.`;
  } else if (overall >= 50) {
    rank = 'Đạt yêu cầu';
    rankBadge = 'Đạt yêu cầu 👍';
    feedback = `Máy nhận diện được: "${cleanSpoken}". Hãy nghe lại âm mẫu của người bản xứ và luyện phát âm chậm từng âm tiết nhé.`;
  } else {
    rank = 'Cần luyện thêm';
    rankBadge = 'Cần luyện thêm ✍️';
    feedback = `Máy ghi nhận: "${cleanSpoken}". Phát âm chưa khớp với mục tiêu "${cleanTarget}". Hãy nghe lại âm mẫu và thử lại!`;
  }

  // XP thưởng theo nỗ lực học tập thực
  let xp = 5;
  if (overall >= 90) xp = 20;
  else if (overall >= 75) xp = 15;
  else if (overall >= 50) xp = 10;

  return {
    isValid: true,
    overall,
    accuracyScore,
    fluencyScore,
    spokenText: cleanSpoken,
    charBreakdown,
    // Speaking Lab depth metrics
    wordRecognition: {
      recognizedCount: exactCount,
      totalCount: totalChars,
      ratio: Math.round((exactCount / totalChars) * 100) / 100
    },
    missingWords,
    extraWords,
    duration: {
      durationMs: audioDurationMs,
      durationSeconds: Math.round(durationSec * 10) / 10
    },
    speakingPace: {
      charsPerMinute,
      category: paceCategory,
      feedback: paceFeedback
    },
    rmsEnergy: {
      level: rmsLevel,
      assessment: energyAssessment,
      feedback: energyFeedback
    },
    pronunciationConsistency: {
      score: consistencyScore,
      feedback: consistencyScore >= 80 ? 'Nhịp điệu phân bố đều giữa các âm tiết.' : 'Nhịp điệu các âm tiết chưa thật đồng đều.'
    },
    // Trung thực: KHÔNG tuyên bố F0 contour giả lập
    toneContourHonesty: {
      hasF0Analysis: false,
      method: 'Phonetic Recognition + Duration & Energy RMS Diagnostic',
      note: 'Hệ thống đánh giá trung thực qua nhận dạng ngữ âm, trường độ nhịp điệu và năng lượng RMS. Không giả lập đồ thị cao độ F0 khi chưa có cảm biến âm học chuyên dụng.'
    },
    rank,
    rankBadge,
    feedback,
    xpEarned: xp
  };
}

/**
 * Universal adapter supporting both positional arguments and object parameters
 */
export function evaluatePronunciation(targetHanzi, targetPinyin = '', audioDurationMs = 1200, audioEnergyRms = 45, spokenTranscript = '') {
  if (typeof targetHanzi === 'object' && targetHanzi !== null) {
    const res = evaluateRealPronunciation(targetHanzi);
    return { ...res, score: res.overall };
  }
  const transcript = spokenTranscript ? String(spokenTranscript).trim() : '';
  const res = evaluateRealPronunciation({
    targetHanzi,
    targetPinyin,
    spokenTranscript: transcript,
    audioDurationMs,
    audioEnergyRms
  });
  return { ...res, score: res.overall };
}
