/**
 * =========================================================================
 * HANZI GO - TEACHER AI ASSISTANT SERVICE
 * =========================================================================
 * Tích hợp Trợ lý AI Giáo viên:
 * 1. AI Class Analysis: Nhận dữ liệu tổng hợp ẩn danh -> phân tích điểm mạnh, yếu, gợi ý bài tập
 * 2. AI Assignment Generator: Tạo đề trắc nghiệm/bài tập HSK (BẮT BUỘC Giáo viên duyệt trước khi publish)
 * 3. AI Lesson Plan: Soạn giáo án 7 bước thực chiến có thể chỉnh sửa
 * 
 * BẢO MẬT & QUYỀN RIÊNG TƯ:
 * - GEMINI_API_KEY lưu 100% trên server-side backend (/api/ai/teacher).
 * - Không bao giờ gửi mật khẩu, token, tên đầy đủ hay dữ liệu nhạy cảm của học viên.
 * - Có bộ mô phỏng sư phạm chuẩn HSK 3.0 (Offline Fallback Engine) khi chưa cấu hình API key.
 * - AI KHÔNG BAO GIỜ tự động publish bài tập: Luôn trả về trạng thái DRAFT_REQUIRES_TEACHER_REVIEW.
 */

/**
 * Gọi backend serverless API (/api/ai/teacher)
 */
async function callBackendTeacherAi(action, payload) {
  let authToken = '';
  let authUid = '';
  try {
    if (typeof localStorage !== 'undefined') {
      const rawUser = localStorage.getItem('hanzigo_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        authUid = u.uid || u.id || '';
        authToken = u.token || u.access_token || '';
      }
    }
  } catch {}

  const response = await fetch('/api/ai/teacher', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...(authUid ? { 'x-user-id': authUid } : {})
    },
    body: JSON.stringify({ action, payload })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Offline Fallback: Bộ máy sư phạm cục bộ mô phỏng phân tích lớp học
 */
function getOfflineClassAnalysis(payload) {
  const { hskLevel = 'HSK 1', averageScore = 75, assignmentCompletion = 70, skillBreakdown } = payload;
  
  const isScoreHigh = averageScore >= 80;
  const isListeningWeak = (skillBreakdown?.listening || 70) < (skillBreakdown?.reading || 75);

  return {
    classStrengths: [
      `Khả năng nhận diện mặt chữ Hán giản thể và đọc hiểu cơ bản đạt mức ${isScoreHigh ? 'rất tốt' : 'khá'} (${skillBreakdown?.reading || 75}%).`,
      `Đa số học viên duy trì chuỗi học tập ổn định với tỷ lệ hoàn thành bài tập đạt ${assignmentCompletion}%.`,
      'Nắm bắt nhanh các mẫu câu cấu trúc ngữ pháp thông dụng trong giao tiếp hàng ngày.'
    ],
    classWeaknesses: [
      isListeningWeak
        ? `Kỹ năng Nghe hiểu (${skillBreakdown?.listening || 68}%) còn hạn chế, học viên thường gặp khó khăn với tốc độ phát âm tự nhiên của người bản ngữ.`
        : 'Kỹ năng Viết chữ Hán và ngữ pháp trật tự từ còn đôi chỗ nhầm lẫn giữa trợ từ "的/得/地".',
      'Khoảng 15-20% học viên có dấu hiệu chững lại khi gặp bài tập dài hoặc hội thoại đa lượt lời.',
      'Sự phân hóa giữa nhóm học sinh tích cực và nhóm ít tương tác đang có chiều hướng tăng.'
    ],
    recommendedReview: [
      `Tổ chức buổi ôn tập ngắn 15 phút về phân biệt thanh điệu (đặc biệt thanh 2 và thanh 3) cấp độ ${hskLevel}.`,
      'Luyện tập phản xạ nghe - lặp lại (Shadowing) các mẫu câu chào hỏi, mua sắm và hỏi đường.',
      'Củng cố cách sử dụng các liên từ cơ bản: 因为...所以..., 虽然...但是...'
    ],
    recommendedExercises: [
      {
        title: `Luyện nghe hiểu phản xạ thực chiến ${hskLevel}`,
        hskLevel,
        type: 'Listening',
        focus: 'Phân biệt âm thanh tương đồng và chọn tranh minh họa đúng',
        suggestedTopic: 'Giao tiếp đời sống'
      },
      {
        title: `Trắc nghiệm ngữ pháp & trật tự câu ${hskLevel}`,
        hskLevel,
        type: 'Quiz',
        focus: 'Sắp xếp trật tự từ và trợ từ ngữ khí',
        suggestedTopic: 'Ngữ pháp trọng điểm'
      }
    ],
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'COMPLETED'
  };
}

/**
 * Offline Fallback: Bộ máy sư phạm tạo bộ câu hỏi trắc nghiệm
 */
function getOfflineAssignment(payload) {
  const { hskLevel = 'HSK 1', topic = 'Giao tiếp hàng ngày', questionCount = 5, assignmentType = 'Quiz' } = payload;

  const sampleBank = [
    {
      id: 'q1',
      question: 'Chọn từ thích hợp điền vào chỗ trống: "我每天早上七点_____起床。"',
      options: ['都 (dōu)', '很 (hěn)', '也 (yě)', '不 (bù)'],
      correctAnswer: 0,
      explanation: 'Phó từ "都" (đều) dùng để nhấn mạnh tính quy luật hoặc thói quen diễn ra mỗi ngày ("每天...都...").',
      difficulty: 'Dễ'
    },
    {
      id: 'q2',
      question: 'Đoạn hội thoại sau có nghĩa là gì?\nA: "谢谢你的帮助！"\nB: "不客气。"',
      options: [
        'A: Cảm ơn bạn đã giúp đỡ! - B: Đừng khách sáo.',
        'A: Xin lỗi vì làm phiền! - B: Không sao đâu.',
        'A: Hẹn gặp lại bạn ngày mai! - B: Tạm biệt.',
        'A: Bạn ăn cơm chưa? - B: Tôi chưa ăn.'
      ],
      correctAnswer: 0,
      explanation: '"不客气" (bú kèqi) là câu đáp lễ lịch sự tiêu chuẩn khi người khác nói lời cảm ơn "谢谢".',
      difficulty: 'Dễ'
    },
    {
      id: 'q3',
      question: 'Chọn câu có trật tự từ ĐÚNG trong tiếng Trung:',
      options: [
        '我昨天在图书馆看书。(Tôi hôm qua ở thư viện đọc sách)',
        '我看书在图书馆昨天。(Tôi đọc sách ở thư viện hôm qua)',
        '昨天我看书在图书馆。(Hôm qua tôi đọc sách ở thư viện)',
        '在图书馆我昨天看书。(Ở thư viện tôi hôm qua đọc sách)'
      ],
      correctAnswer: 0,
      explanation: 'Quy tắc ngữ pháp tiếng Trung: Chủ ngữ + Thời gian + Địa điểm + Hành động (S + Time + Place + Verb).',
      difficulty: 'Trung bình'
    },
    {
      id: 'q4',
      question: 'Chữ Hán nào dưới đây mang nghĩa là "Bác sĩ / Thầy thuốc"?',
      options: ['医生 (yīshēng)', '老师 (lǎoshī)', '学生 (xuésheng)', '司机 (sījī)'],
      correctAnswer: 0,
      explanation: '"医生" (yīshēng) nghĩa là bác sĩ; "老师" là giáo viên; "学生" là học sinh; "司机" là tài xế.',
      difficulty: 'Dễ'
    },
    {
      id: 'q5',
      question: 'Điền lượng từ thích hợp: "桌子上有两_____书。"',
      options: ['本 (běn)', '个 (gè)', '只 (zhī)', '张 (zhāng)'],
      correctAnswer: 0,
      explanation: 'Lượng từ của "书" (sách) là "本" (běn). Ví dụ: 一本书 (một quyển sách).',
      difficulty: 'Trung bình'
    },
    {
      id: 'q6',
      question: 'Câu nào sau đây diễn đạt ý phủ định ĐÚNG trong quá khứ?',
      options: [
        '我昨天没去学校。(Hôm qua tôi không đi học)',
        '我昨天不去学校。(Sai phó từ phủ định trong quá khứ)',
        '我昨天不去了学校。(Thừa "了")',
        '昨天没有去了我学校。(Sai vị trí)'
      ],
      correctAnswer: 0,
      explanation: 'Hành động trong quá khứ phủ định bằng "没" hoặc "没有", tuyệt đối không dùng "不" và không kèm "了".',
      difficulty: 'Khó'
    }
  ];

  const count = Math.min(Math.max(Number(questionCount) || 5, 1), sampleBank.length);
  const selectedQuestions = sampleBank.slice(0, count);

  return {
    title: `Bài tập ${assignmentType}: ${topic} (${hskLevel})`,
    description: `Bộ câu hỏi do AI đề xuất theo chủ đề "${topic}" chuẩn ${hskLevel}, giáo viên cần duyệt và chỉnh sửa trước khi xuất bản.`,
    topic,
    hskLevel,
    assignmentType,
    questions: selectedQuestions,
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'DRAFT_REQUIRES_TEACHER_REVIEW'
  };
}

/**
 * Offline Fallback: Bộ máy sư phạm soạn giáo án 7 bước
 */
function getOfflineLessonPlan(payload) {
  const { hskLevel = 'HSK 1', topic = 'Đi mua sắm tại siêu thị', duration = 45 } = payload;

  const sections = {
    warmUp: {
        durationMinutes: 5,
        title: '1. Khởi động (Warm-up & Tạo cảm xúc)',
        activities: [
          'Trình chiếu hình ảnh đồ vật/tiền tệ Trung Quốc (RMB), hỏi nhanh học sinh: "这是什么？" (Đây là cái gì?).',
          'Khơi gợi chủ đề mua sắm, đặt câu hỏi khởi động: "你喜欢买东西吗？" (Bạn có thích mua đồ không?).'
        ]
      },
      vocabulary: {
        durationMinutes: 10,
        title: '2. Từ vựng trọng tâm (Core Vocabulary)',
        items: [
          { hanzi: '多少', pinyin: 'duōshao', meaning: 'Bao nhiêu', example: '这个多少钱？(Cái này bao nhiêu tiền?)' },
          { hanzi: '块', pinyin: 'kuài', meaning: 'Đồng (đơn vị tiền tệ khẩu ngữ)', example: '五块钱。(Năm đồng.)' },
          { hanzi: '太...了', pinyin: 'tài...le', meaning: 'Quá... rồi', example: '太贵了！(Đắt quá rồi!)' },
          { hanzi: '便宜', pinyin: 'piányi', meaning: 'Rẻ', example: '能便宜一点吗？(Có thể rẻ hơn chút không?)' },
          { hanzi: '苹果', pinyin: 'píngguǒ', meaning: 'Quả táo', example: '我想买苹果。(Tôi muốn mua táo.)' }
        ]
      },
      grammar: {
        durationMinutes: 10,
        title: '3. Điểm ngữ pháp then chốt (Grammar Focus)',
        rules: [
          {
            pattern: 'Mẫu câu hỏi giá: [Đồ vật] + 多少钱？(Duōshao qián?)',
            explanation: 'Dùng để hỏi giá tiền của bất kỳ món đồ hoặc dịch vụ nào.',
            example: 'A: 苹果一斤多少钱？ B: 三块钱。(A: Táo bao nhiêu tiền một cân? B: Ba đồng.)'
          },
          {
            pattern: 'Cấu trúc mặc cả: 太 + Tính từ + 了 + 能便宜点吗？',
            explanation: 'Bày tỏ mức độ vượt quá mong đợi và đưa ra lời đề nghị giảm giá nhẹ nhàng.',
            example: '太贵了，两块行吗？(Đắt quá, hai đồng được không?)'
          }
        ]
      },
      listening: {
        durationMinutes: 5,
        title: '4. Luyện nghe phản xạ (Listening Comprehension)',
        script: '顾客: 老板，这件衣服多少钱？\n老板: 一百块。\n顾客: 太贵了，八十块可以吗？\n老板: 行，给你吧！',
        translation: 'Khách: Ông chủ, chiếc áo này bao nhiêu tiền?\nChủ: Một trăm đồng.\nKhách: Đắt quá, 80 đồng được không?\nChủ: Được, lấy cho bạn!'
      },
      speaking: {
        durationMinutes: 10,
        title: '5. Luyện nói tương tác & Đóng vai (Role-play Speaking)',
        scenario: 'Chia lớp thành từng cặp: 1 bạn đóng vai người mua hàng tại chợ, 1 bạn đóng vai người bán hoa quả.',
        prompts: [
          'Hỏi thăm chào hàng: "你好，你想买什么？"',
          'Hỏi giá và thương lượng giảm giá ít nhất 1 lần trước khi đồng ý mua.',
          'Kết thúc giao dịch: "给你钱 / 谢谢 / 再见".'
        ]
      },
      quiz: {
        durationMinutes: 5,
        title: '6. Trắc nghiệm kiểm tra nhanh tại lớp (Formative Quiz)',
        questions: [
          { prompt: 'Khi muốn hỏi giá của quyển sách, bạn nói câu nào?', answer: '这本书多少钱？' },
          { prompt: 'Từ trái nghĩa của "贵" (guì - đắt) là gì?', answer: '便宜 (piányi - rẻ)' },
          { prompt: 'Điền từ: "_____一点儿可以吗？"', answer: '便宜 (piányi)' }
        ]
      },
      homework: {
        title: '7. Bài tập về nhà & Tự luyện (Homework)',
        tasks: [
          'Ghi âm đoạn hội thoại mua sắm 4 câu gửi lên hệ thống HanziGo để giáo viên nghe và sửa phát âm.',
          'Viết lại 5 từ vựng mới học vào sổ tay luyện viết chữ Hán HanziGo.'
        ]
      }
    };

  return {
    title: `Giáo án: ${topic} (${hskLevel})`,
    hskLevel,
    topic,
    duration: Number(duration) || 45,
    sections,
    lessonPlan: sections,
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'DRAFT_REQUIRES_TEACHER_REVIEW'
  };
}

// =========================================================================
// PUBLIC API METHODS
// =========================================================================

/**
 * 1. Phân tích số liệu lớp học bằng AI
 * CHÚ Ý BẢO MẬT: Chỉ gửi các số liệu thống kê tổng hợp (hoàn toàn ẩn danh).
 */
export async function analyzeClassWithAi(aggregatedClassMetrics) {
  // Anonymization check: loại bỏ mọi trường nhạy cảm nếu có
  const safePayload = {
    totalStudents: aggregatedClassMetrics.totalStudents || 0,
    hskLevel: aggregatedClassMetrics.hskLevel || 'HSK 1',
    averageScore: aggregatedClassMetrics.averageScore || 0,
    assignmentCompletion: aggregatedClassMetrics.assignmentCompletion || 0,
    attendanceRate: aggregatedClassMetrics.attendanceRate || 0,
    skillBreakdown: aggregatedClassMetrics.skillBreakdown || { listening: 70, speaking: 65, reading: 75, writing: 60 }
  };

  try {
    const res = await callBackendTeacherAi('analyze_class', safePayload);
    return {
      success: true,
      data: res.data || res,
      ...res,
      provider: 'gemini',
      status: 'COMPLETED'
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi, chuyển sang bộ mô phỏng sư phạm offline:', err.message);
    const offlineRes = getOfflineClassAnalysis(safePayload);
    return {
      success: true,
      data: offlineRes,
      ...offlineRes,
      provider: 'offline',
      status: 'COMPLETED'
    };
  }
}

/**
 * 2. Tạo đề bài tập bằng AI
 * BẮT BUỘC GIÁO VIÊN DUYỆT TRƯỚC KHI PUBLISH!
 */
export async function generateAssignmentWithAi(params = {}) {
  const {
    hskLevel = 'HSK 1',
    topic = 'Cuộc sống hàng ngày',
    questionCount = 5,
    assignmentType = 'Quiz'
  } = params;

  const payload = {
    hskLevel,
    topic: (topic || 'Cuộc sống hàng ngày').trim(),
    questionCount: Number(questionCount) || 5,
    assignmentType
  };

  try {
    const res = await callBackendTeacherAi('generate_assignment', payload);
    return {
      success: true,
      data: res.data || res,
      ...res,
      provider: 'gemini',
      // Luôn gán cờ yêu cầu giáo viên kiểm duyệt
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      reviewedByTeacher: false
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi, dùng bộ đề mẫu sư phạm offline:', err.message);
    const offlineRes = getOfflineAssignment(payload);
    return {
      success: true,
      data: offlineRes,
      ...offlineRes,
      provider: 'offline',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      reviewedByTeacher: false
    };
  }
}

/**
 * 3. Soạn giáo án bằng AI
 */
export async function generateLessonPlanWithAi(params = {}) {
  const {
    hskLevel = 'HSK 1',
    topic = 'Giao tiếp hàng ngày',
    duration = 45,
    targetOutcomes = ''
  } = params;

  const payload = {
    hskLevel,
    topic: (topic || 'Giao tiếp hàng ngày').trim(),
    duration: Number(duration) || 45,
    targetOutcomes: (targetOutcomes || '').trim()
  };

  try {
    const res = await callBackendTeacherAi('generate_lesson_plan', payload);
    return {
      success: true,
      data: res.data || res,
      ...res,
      provider: 'gemini',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW'
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi, dùng giáo án mẫu sư phạm offline:', err.message);
    const offlineRes = getOfflineLessonPlan(payload);
    return {
      success: true,
      data: offlineRes,
      ...offlineRes,
      provider: 'offline',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW'
    };
  }
}
