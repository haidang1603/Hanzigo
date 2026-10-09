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

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

/**
 * Gọi backend serverless API (/api/ai/teacher)
 */
async function callBackendTeacherAi(action, payload) {
  let authToken = '';
  let authUid = '';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        authToken = session.access_token || '';
        authUid = session.user?.id || '';
      }
    } catch {}
  }

  if (!authToken) {
    try {
      if (typeof localStorage !== 'undefined') {
        const rawUser = localStorage.getItem('hanzigo_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          authUid = u.uid || u.id || authUid;
          authToken = u.token || u.access_token || '';
        }
      }
    } catch {}
  }

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
  const { hskLevel = 'HSK 1', averageScore = 75, assignmentCompletion = 70, skillBreakdown, inactiveCount = 0 } = payload;
  
  const isScoreHigh = averageScore >= 80;
  const isListeningWeak = (skillBreakdown?.listening || 70) < (skillBreakdown?.reading || 75);

  const strengths = [
    `Khả năng nhận diện mặt chữ Hán giản thể và đọc hiểu cơ bản đạt mức ${isScoreHigh ? 'rất tốt' : 'khá'} (${skillBreakdown?.reading || 75}%).`,
    `Đa số học viên duy trì chuỗi học tập ổn định với tỷ lệ hoàn thành bài tập đạt ${assignmentCompletion}%.`,
    'Nắm bắt nhanh các mẫu câu cấu trúc ngữ pháp thông dụng trong giao tiếp hàng ngày.'
  ];

  const weaknesses = [
    isListeningWeak
      ? `Kỹ năng Nghe hiểu (${skillBreakdown?.listening || 68}%) còn hạn chế, học viên thường gặp khó khăn với tốc độ phát âm tự nhiên của người bản ngữ.`
      : 'Kỹ năng Viết chữ Hán và ngữ pháp trật tự từ còn đôi chỗ nhầm lẫn giữa trợ từ "的/得/地".',
    'Khoảng 15-20% học viên có dấu hiệu chững lại khi gặp bài tập dài hoặc hội thoại đa lượt lời.',
    'Sự phân hóa giữa nhóm học sinh tích cực và nhóm ít tương tác đang có chiều hướng tăng.'
  ];

  const teachingTopics = [
    `Phân biệt thanh điệu (đặc biệt thanh 2 và thanh 3) cấp độ ${hskLevel}`,
    'Luyện tập phản xạ nghe - lặp lại (Shadowing) các mẫu câu giao tiếp',
    'Củng cố cách sử dụng các liên từ cơ bản: 因为...所以..., 虽然...但是...'
  ];

  const attentionCohorts = [
    `${inactiveCount > 0 ? inactiveCount : 'Khoảng 10%'} học viên vắng mặt quá 7 ngày cần được gửi thông báo nhắc nhở`,
    `Nhóm học viên có điểm Nghe hiểu dưới 65% cần bài tập bổ trợ âm vị chuẩn HSK`
  ];

  const activities = [
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
    },
    {
      title: `Đóng vai hội thoại tương tác (Role-play)`,
      hskLevel,
      type: 'Speaking',
      focus: 'Luyện nói phản xạ tình huống thực tế theo cặp',
      suggestedTopic: 'Giao tiếp hàng ngày'
    }
  ];

  return {
    classStrengths: strengths,
    classWeaknesses: weaknesses,
    recommendedTeachingTopics: teachingTopics,
    recommendedReview: teachingTopics,
    studentsNeedingAttention: attentionCohorts,
    suggestedActivities: activities,
    recommendedExercises: activities,
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'COMPLETED'
  };
}

/**
 * Offline Fallback: Bộ máy sư phạm tạo bộ câu hỏi trắc nghiệm đa kỹ năng
 * Bao gồm đầy đủ 5 kỹ năng: Vocabulary, Grammar, Listening, Reading, Speaking
 */
function getOfflineAssignment(payload) {
  const { hskLevel = 'HSK 1', topic = 'Giao tiếp hàng ngày', questionCount = 5, assignmentType = 'Quiz' } = payload;

  const multiSkillQuestions = [
    {
      id: 'q1',
      skill: 'Vocabulary',
      skillName: 'Từ vựng (Vocabulary)',
      question: `[Từ vựng] Chọn từ thích hợp thuộc chủ đề "${topic}": "我打算下个月去中国_____。"`,
      options: ['旅游 (lǚyóu)', '睡觉 (shuìjiào)', '生病 (shēngbìng)', '游泳 (yóuyǒng)'],
      correctAnswer: 0,
      explanation: 'Phù hợp ngữ cảnh: "旅游" nghĩa là đi du lịch.',
      difficulty: 'Dễ'
    },
    {
      id: 'q2',
      skill: 'Grammar',
      skillName: 'Ngữ pháp (Grammar)',
      question: '[Ngữ pháp] Chọn câu có trật tự từ ĐÚNG trong tiếng Trung:',
      options: [
        '我们明天早上八点在机场见面。(Chúng tôi gặp nhau lúc 8h sáng mai ở sân bay)',
        '我们在机场见面明天早上八点。(Sai trật tự trạng ngữ thời gian)',
        '明天早上八点见面我们在机场。(Sai vị trí động từ)',
        '我们见面在机场明天早上八点。(Sai trật tự tiêu chuẩn)'
      ],
      correctAnswer: 0,
      explanation: 'Quy tắc ngữ pháp tiếng Trung: S + Thời gian + Địa điểm + Động từ + Tân ngữ.',
      difficulty: 'Trung bình'
    },
    {
      id: 'q3',
      skill: 'Listening',
      skillName: 'Nghe hiểu (Listening)',
      question: '[Nghe hiểu] Nghe đoạn audio ngắn: "请问，去故宫坐几路公共汽车？" - Người nói đang hỏi thông tin gì?',
      audioPrompt: 'prompt_travel_bus.mp3',
      options: [
        'Tuyến xe buýt đi đến Cố Cung',
        'Giá vé tham quan Cố Cung',
        'Giờ mở cửa của Cố Cung',
        'Cách mua vé tàu hỏa'
      ],
      correctAnswer: 0,
      explanation: '"几路公共汽车" nghĩa là xe buýt tuyến số mấy; "去故宫" là đi đến Cố Cung.',
      difficulty: 'Trung bình'
    },
    {
      id: 'q4',
      skill: 'Reading',
      skillName: 'Đọc hiểu (Reading)',
      question: 'Đọc đoạn ngắn: "北京的秋天天气很舒服，不冷也不热，是最适合旅游的季节。"\nTheo đoạn văn, tại sao mùa thu thích hợp nhất để du lịch Bắc Kinh?',
      options: [
        'Thời tiết dễ chịu, không lạnh cũng không nóng',
        'Giá vé máy bay rẻ nhất trong năm',
        'Có nhiều lễ hội truyền thống đặc sắc',
        'Các danh lam thắng cảnh mở cửa miễn phí'
      ],
      correctAnswer: 0,
      explanation: 'Đoạn văn nêu rõ: "天气很舒服，不冷也不热" (thời tiết rất dễ chịu, không lạnh cũng không nóng).',
      difficulty: 'Dễ'
    },
    {
      id: 'q5',
      skill: 'Speaking',
      skillName: 'Khẩu ngữ (Speaking)',
      question: '[Khẩu ngữ] Luyện nói phản xạ: Chọn câu trả lời tự nhiên nhất khi được hỏi: "你喜欢坐高铁还是坐飞机？"',
      options: [
        '我更喜欢坐高铁，因为又快又舒服。(Tôi thích đi tàu cao tốc hơn, vì vừa nhanh vừa thoải mái)',
        '我不喜欢吃苹果。(Không liên quan)',
        '明天天气很好。(Không đúng ngữ cảnh)',
        '我昨天去学校了。(Sai thì và chủ đề)'
      ],
      correctAnswer: 0,
      explanation: 'Học viên luyện phát âm và ngữ điệu trả lời cho câu hỏi lựa chọn "A 还是 B".',
      difficulty: 'Trung bình'
    }
  ];

  const count = Math.min(Math.max(Number(questionCount) || 5, 1), multiSkillQuestions.length);
  const selectedQuestions = multiSkillQuestions.slice(0, count);

  return {
    title: `Bài tập ${assignmentType}: ${topic} (${hskLevel})`,
    description: `Bộ câu hỏi đa kỹ năng do AI đề xuất theo chủ đề "${topic}" chuẩn ${hskLevel}, giáo viên cần duyệt và chỉnh sửa trước khi xuất bản.`,
    topic,
    hskLevel,
    assignmentType,
    skillsCovered: ['Vocabulary', 'Grammar', 'Listening', 'Reading', 'Speaking'],
    questions: selectedQuestions,
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
    published: false,
    reviewedByTeacher: false
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

  const learningObjective = [
    `Nắm vững từ vựng và cấu trúc ngữ pháp then chốt chủ đề "${topic}" (${hskLevel}).`,
    'Tự tin vận dụng mẫu câu hỏi giá và đàm phán trong ngữ cảnh giao tiếp thực tế.'
  ];

  const examples = [
    { chinese: '这个多少钱？', pinyin: 'Zhège duōshao qián?', vietnamese: 'Cái này bao nhiêu tiền?' },
    { chinese: '太贵了，便宜点吧。', pinyin: 'Tài guì le, piányi diǎn ba.', vietnamese: 'Đắt quá, rẻ một chút đi.' }
  ];

  const practice = [
    'Luyện tập theo cặp: Một bạn là người bán hàng, một bạn là khách mua hỏi giá',
    'Thực hành cấu trúc "太...了" với các tính từ 贵, 大, 小, 多, 少'
  ];

  return {
    title: `Giáo án: ${topic} (${hskLevel})`,
    hskLevel,
    topic,
    duration: Number(duration) || 45,
    skills: payload.skills || ['Vocabulary', 'Grammar', 'Listening', 'Speaking'],
    learningObjective,
    learningObjectives: learningObjective,
    vocabulary: sections.vocabulary.items,
    grammar: sections.grammar.rules,
    examples,
    practice,
    quiz: sections.quiz.questions,
    sections,
    lessonPlan: sections,
    generatedBy: 'HanziGo Pedagogical Engine (Offline / Local)',
    status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
    published: false
  };
}

// =========================================================================
// PUBLIC API METHODS
// =========================================================================

/**
 * 1. Phân tích số liệu lớp học bằng AI
 * CHÚ Ý BẢO MẬT: Chỉ gửi các số liệu thống kê tổng hợp (hoàn toàn ẩn danh, KHÔNG gửi PII).
 * AI trả về: classStrengths, classWeaknesses, recommendedTeachingTopics, studentsNeedingAttention, suggestedActivities.
 */
export async function analyzeClassWithAi(aggregatedClassMetrics = {}) {
  // Anonymization check: loại bỏ mọi trường nhạy cảm nếu có
  const safePayload = {
    totalStudents: aggregatedClassMetrics.totalStudents || 0,
    hskLevel: aggregatedClassMetrics.hskLevel || 'HSK 1',
    averageScore: aggregatedClassMetrics.averageScore || 0,
    assignmentCompletion: aggregatedClassMetrics.assignmentCompletion || 0,
    attendanceRate: aggregatedClassMetrics.attendanceRate || 0,
    skillBreakdown: aggregatedClassMetrics.skillBreakdown || { listening: 70, speaking: 65, reading: 75, writing: 60 },
    weakSkills: aggregatedClassMetrics.weakSkills || [],
    inactiveCount: aggregatedClassMetrics.inactiveCount || 0
  };

  try {
    const res = await callBackendTeacherAi('analyze_class', safePayload);
    const parsedData = res.data || res;
    // Graceful validation fallback: nếu AI trả về định dạng sai/thiếu trường bắt buộc
    if (!parsedData || !Array.isArray(parsedData.classStrengths) || !Array.isArray(parsedData.classWeaknesses)) {
      throw new Error('AI output invalid format: missing strengths or weaknesses');
    }

    const normalizedData = {
      ...parsedData,
      classStrengths: parsedData.classStrengths || [],
      classWeaknesses: parsedData.classWeaknesses || [],
      recommendedTeachingTopics: parsedData.recommendedTeachingTopics || parsedData.recommendedReview || [],
      recommendedReview: parsedData.recommendedReview || parsedData.recommendedTeachingTopics || [],
      studentsNeedingAttention: parsedData.studentsNeedingAttention || [
        'Nhóm học viên có điểm dưới trung bình cần giao bài tập bổ trợ cá nhân hóa',
        'Học viên không hoạt động trên 7 ngày cần liên hệ trực tiếp'
      ],
      suggestedActivities: parsedData.suggestedActivities || parsedData.recommendedExercises || [],
      recommendedExercises: parsedData.recommendedExercises || parsedData.suggestedActivities || [],
      status: 'COMPLETED'
    };

    return {
      success: true,
      data: normalizedData,
      ...normalizedData,
      provider: 'gemini',
      status: 'COMPLETED'
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi hoặc output invalid, chuyển sang bộ mô phỏng sư phạm offline:', err.message);
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
 * Quy trình: Generate -> Review -> Edit -> Publish
 * AI KHÔNG ĐƯỢC TỰ ĐỘNG PUBLISH: status luôn là DRAFT_REQUIRES_TEACHER_REVIEW và published: false.
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
    const parsedData = res.data || res;
    // Validate output structure - Graceful fallback if invalid
    if (!parsedData || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
      throw new Error('AI output invalid format: missing questions array');
    }

    // Ensure questions span the required 5 skills: Vocabulary, Grammar, Listening, Reading, Speaking
    const skillsOrder = ['Vocabulary', 'Grammar', 'Listening', 'Reading', 'Speaking'];
    const sanitizedQuestions = parsedData.questions.map((q, idx) => ({
      ...q,
      skill: q.skill || skillsOrder[idx % skillsOrder.length]
    }));

    const normalizedData = {
      ...parsedData,
      questions: sanitizedQuestions,
      skillsCovered: parsedData.skillsCovered || skillsOrder,
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false,
      reviewedByTeacher: false
    };

    return {
      success: true,
      data: normalizedData,
      ...normalizedData,
      provider: 'gemini',
      // AI KHÔNG được tự động publish
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false,
      reviewedByTeacher: false
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi hoặc invalid, dùng bộ đề mẫu sư phạm offline:', err.message);
    const offlineRes = getOfflineAssignment(payload);
    return {
      success: true,
      data: offlineRes,
      ...offlineRes,
      provider: 'offline',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false,
      reviewedByTeacher: false
    };
  }
}

/**
 * 3. Soạn giáo án bằng AI
 * Tạo cấu trúc: learningObjective, vocabulary, grammar, examples, practice, quiz.
 * AI KHÔNG TỰ ĐỘNG PUBLISH: Luôn trả về DRAFT_REQUIRES_TEACHER_REVIEW và published: false.
 */
export async function generateLessonPlanWithAi(params = {}) {
  const {
    hskLevel = 'HSK 1',
    topic = 'Giao tiếp hàng ngày',
    duration = 45,
    skills = ['Vocabulary', 'Grammar', 'Listening', 'Speaking'],
    targetOutcomes = ''
  } = params;

  const payload = {
    hskLevel,
    topic: (topic || 'Giao tiếp hàng ngày').trim(),
    duration: Number(duration) || 45,
    skills: Array.isArray(skills) ? skills : [skills],
    targetOutcomes: (targetOutcomes || '').trim()
  };

  try {
    const res = await callBackendTeacherAi('generate_lesson_plan', payload);
    const parsedData = res.data || res;
    // Graceful validation
    if (!parsedData || (!parsedData.sections && !parsedData.vocabulary)) {
      throw new Error('AI output invalid format: missing lesson plan sections');
    }

    const learningObj = parsedData.learningObjective || parsedData.learningObjectives || [
      `Nắm vững từ vựng và cấu trúc ngữ pháp chủ đề ${payload.topic} (${payload.hskLevel})`,
      'Vận dụng linh hoạt trong tình huống giao tiếp thực tế'
    ];

    const normalized = {
      ...parsedData,
      learningObjective: learningObj,
      learningObjectives: learningObj,
      vocabulary: parsedData.vocabulary || parsedData.sections?.vocabulary?.items || [],
      grammar: parsedData.grammar || parsedData.sections?.grammar?.rules || [],
      examples: parsedData.examples || [
        { chinese: '请问，洗手间在哪儿？', pinyin: 'Qǐngwèn, xǐshǒujiān zài nǎr?', vietnamese: 'Xin hỏi, nhà vệ sinh ở đâu?' }
      ],
      practice: parsedData.practice || parsedData.sections?.speaking?.prompts || [
        'Luyện tập theo cặp: Hỏi đường và chỉ đường bằng tiếng Trung'
      ],
      quiz: parsedData.quiz || parsedData.sections?.quiz?.questions || [],
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false
    };

    return {
      success: true,
      data: normalized,
      ...normalized,
      provider: 'gemini',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false
    };
  } catch (err) {
    console.info('Backend AI Teacher không phản hồi hoặc invalid, dùng giáo án mẫu sư phạm offline:', err.message);
    const offlineRes = getOfflineLessonPlan(payload);
    return {
      success: true,
      data: offlineRes,
      ...offlineRes,
      provider: 'offline',
      status: 'DRAFT_REQUIRES_TEACHER_REVIEW',
      published: false
    };
  }
}
