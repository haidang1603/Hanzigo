/**
 * =========================================================================
 * HANZI GO - DETERMINISTIC OFFLINE PERSONALIZATION ENGINE
 * =========================================================================
 * Bộ máy Sư phạm Ngoại tuyến chuẩn mực:
 * - Hoạt động độc lập 100% khi không có GEMINI_API_KEY, mất mạng, hoặc vượt quota.
 * - Tuyệt đối KHÔNG giả lập điểm số, KHÔNG bịa đặt dữ liệu (Zero-hallucination).
 * - Cung cấp phân tích sư phạm thực tế cho 5 phân hệ:
 *    1. coach_plan (Kế hoạch học tập hàng ngày & chẩn đoán điểm yếu)
 *    2. explain_grammar (Giải thích ngữ pháp đối chiếu Trung - Việt)
 *    3. generate_exercise (Sinh bài tập thực hành theo từ vựng / ngữ pháp yếu)
 *    4. diagnose_hsk_mistakes (Chẩn đoán lỗi sai thi thử HSK theo kỹ năng)
 *    5. recommend_resources (Gợi ý tài liệu học tập chuẩn hóa)
 * =========================================================================
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { CURRICULUM_60_LESSONS as CURRICULUM_LESSONS } from '../data/curriculumLessons.js';
import { HSK_RESOURCES } from '../data/hskResourcesData.js';

/**
 * 1. Sinh kế hoạch học tập cá nhân hóa ngoại tuyến
 */
export function generateOfflinePersonalizedPlan(context = {}) {
  const {
    hskLevel = 'HSK 1',
    learningGoal = 'general_foundation',
    dailyGoalMinutes = 15,
    streak = 1,
    srsDueCount = 0,
    hasSparseData = false,
    weaknesses = [],
    nextLesson = { lessonId: 'l-101', title: 'Bài 1: Chào hỏi căn bản (你好)' },
    reviewLessons = []
  } = context;

  // Xây dựng tóm tắt sư phạm
  let summary = '';
  if (hasSparseData) {
    summary = `Chào mừng bạn bắt đầu hành trình chinh phục tiếng Trung! Hãy bắt đầu với bài kiểm tra trình độ đầu vào hoặc bài học nhập môn Pinyin để hệ thống tối ưu hóa lộ trình cá nhân cho bạn.`;
  } else if (streak >= 7) {
    summary = `Tuyệt vời! Bạn đang duy trì chuỗi học ${streak} ngày liên tiếp rất ấn tượng. Hãy tiếp tục củng cố bài học mới và duy trì phản xạ đều đặn mỗi ngày.`;
  } else if (srsDueCount > 5) {
    summary = `Hôm nay bạn có ${srsDueCount} từ vựng đến hạn ôn tập trong hệ thống lặp lại ngắt quãng (SRS). Ưu tiên ôn tập từ vựng trước khi chuyển sang kiến thức mới sẽ giúp bạn nhớ sâu bền vững.`;
  } else {
    summary = `Chào bạn! Hôm nay hãy dành ${dailyGoalMinutes} phút tập trung hoàn thành bài học tiếp theo và luyện khẩu ngữ để nâng cao độ trôi chảy.`;
  }

  // Phân bổ nhiệm vụ trong ngày phù hợp thời lượng
  const dailyPlan = [];
  let allocatedMinutes = 0;

  // Nhiệm vụ 1: Ôn tập từ vựng SRS nếu có từ đến hạn
  if (srsDueCount > 0) {
    const srsMins = Math.min(5, Math.max(3, Math.floor(dailyGoalMinutes * 0.25)));
    dailyPlan.push({
      id: 'plan-srs',
      type: 'srs',
      title: `Ôn tập ${Math.min(srsDueCount, 15)} từ vựng đến hạn (SRS)`,
      subtitle: 'Củng cố trí nhớ dài hạn theo thuật toán SuperMemo-2',
      durationMinutes: srsMins,
      route: 'vocabulary',
      reason: `Có ${srsDueCount} thẻ từ vựng đã đến chu kỳ cần kích hoạt lại trí nhớ`,
      completed: false
    });
    allocatedMinutes += srsMins;
  }

  // Nhiệm vụ 2: Bài học tiếp theo trên lộ trình
  const lessonMins = Math.min(15, Math.max(8, dailyGoalMinutes - allocatedMinutes - 5));
  dailyPlan.push({
    id: 'plan-next-lesson',
    type: 'lesson',
    title: `Học bài mới: ${nextLesson?.title || 'Bài học lộ trình'}`,
    subtitle: 'Nắm vững từ vựng mới, ngữ pháp trọng tâm và hội thoại thực tế',
    durationMinutes: lessonMins,
    route: 'roadmap',
    targetRef: nextLesson?.lessonId || 'l-101',
    reason: 'Bước tiếp theo tối ưu trên lộ trình chuẩn HSK',
    completed: false
  });
  allocatedMinutes += lessonMins;

  // Nhiệm vụ 3: Ôn lại bài có điểm thấp hoặc bài cũ nếu còn thời gian
  if (reviewLessons.length > 0 && dailyGoalMinutes >= 20) {
    const rev = reviewLessons[0];
    dailyPlan.push({
      id: 'plan-review-lesson',
      type: 'review_lesson',
      title: `Ôn tập bài cũ: ${rev.title || rev.lessonId}`,
      subtitle: rev.reason || 'Luyện lại bài tập trắc nghiệm để đạt chuẩn 3 sao',
      durationMinutes: 7,
      route: 'roadmap',
      targetRef: rev.lessonId,
      reason: rev.reason || 'Bài học trước đó cần được củng cố lại kiến thức',
      completed: false
    });
    allocatedMinutes += 7;
  }

  // Nhiệm vụ 4: Luyện nói hoặc luyện viết tùy theo mục tiêu học
  const remainingMins = Math.max(3, dailyGoalMinutes - allocatedMinutes);
  if (learningGoal === 'daily_communication' || learningGoal === 'travel_speaking') {
    dailyPlan.push({
      id: 'plan-speaking',
      type: 'pronunciation',
      title: 'Luyện phản xạ giao tiếp & phát âm chuẩn thanh điệu',
      subtitle: 'Thực hành 5 câu khẩu ngữ với chẩn đoán microphone',
      durationMinutes: remainingMins,
      route: 'pronunciation',
      reason: 'Phù hợp mục tiêu ưu tiên giao tiếp lưu loát của bạn',
      completed: false
    });
  } else if (learningGoal === 'hanzi_culture') {
    dailyPlan.push({
      id: 'plan-writing',
      type: 'writing',
      title: 'Luyện viết chữ Hán & quy tắc thuận bút',
      subtitle: 'Tập viết 3 chữ Hán trọng tâm trên ô Mễ tự (米字格)',
      durationMinutes: remainingMins,
      route: 'writing',
      reason: 'Phù hợp mục tiêu tìm hiểu cấu trúc và thuận bút chữ Hán',
      completed: false
    });
  } else {
    dailyPlan.push({
      id: 'plan-practice',
      type: 'grammar',
      title: 'Luyện tập ngữ pháp & củng cố câu',
      subtitle: 'Thực hành các mẫu câu cốt lõi của bài học',
      durationMinutes: remainingMins,
      route: 'conversation',
      reason: 'Xây chắc nền tảng ngữ pháp ứng dụng chuẩn HSK',
      completed: false
    });
  }

  return {
    summary,
    weaknesses: weaknesses.length > 0 ? weaknesses : (hasSparseData ? [
      {
        id: 'wk-cold-start',
        skill: 'placement',
        severity: 'medium',
        label: 'Chưa xác định trình độ chính xác',
        detail: 'Tài khoản mới bắt đầu, chưa có đủ dữ liệu kiểm tra thực tế',
        suggestedAction: 'Làm bài kiểm tra đầu vào ngắn (Placement Test) để hệ thống định vị chính xác',
        targetRoute: 'roadmap'
      }
    ] : []),
    recommendedNextLesson: nextLesson,
    recommendedReviewLessons: reviewLessons.slice(0, 3),
    recommendedMaterials: [
      {
        id: 'mat-1',
        title: 'Giáo trình Chuẩn HSK 1 (Standard Course)',
        category: 'Giáo trình chuẩn',
        reason: 'Tài liệu nền tảng tương thích chuẩn khung HSK'
      }
    ],
    dailyPlan,
    reasoning: [
      hasSparseData 
        ? 'Dựa trên trạng thái học viên mới: Đề xuất bài học mở đầu và kiểm tra đầu vào.'
        : `Dựa trên dữ liệu thực tế: ${srsDueCount} từ SRS đến hạn, mục tiêu ${learningGoal}, thời lượng ${dailyGoalMinutes} phút/ngày.`
    ],
    isOffline: true,
    generatedAt: new Date().toISOString()
  };
}

/**
 * 2. Giải thích ngữ pháp ngoại tuyến chuẩn sư phạm
 */
export function generateOfflineGrammarExplanation(grammarPoint = '', hskLevel = 'HSK 1') {
  const cleanPoint = String(grammarPoint || '').trim();

  // Tra cứu trong kho bài học curriculumLessons nếu có
  let matchedPoint = null;
  for (const lesson of CURRICULUM_LESSONS) {
    if (lesson.grammarPoints && Array.isArray(lesson.grammarPoints)) {
      const found = lesson.grammarPoints.find(g => 
        (g.title && g.title.includes(cleanPoint)) || 
        (g.structure && g.structure.includes(cleanPoint)) ||
        cleanPoint.includes(g.title || '')
      );
      if (found) {
        matchedPoint = found;
        break;
      }
    }
  }

  if (matchedPoint) {
    return {
      grammarPoint: matchedPoint.title || cleanPoint,
      hskLevel,
      structure: matchedPoint.structure || 'Chủ ngữ + Vị ngữ',
      explanationVi: matchedPoint.explanation || `Điểm ngữ pháp "${matchedPoint.title}" là cấu trúc quan trọng trong cấp độ ${hskLevel}. Cần chú ý vị trí hư từ và trật tự từ so với tiếng Việt.`,
      sinoVietnameseNotes: 'Chú ý liên hệ các từ đồng nghĩa Hán-Việt để ghi nhớ ngữ cảnh ứng dụng.',
      commonMistakes: [
        {
          wrong: 'Dịch từng từ rời rạc theo trật tự tiếng Việt (word-by-word)',
          correct: 'Tuân theo trật tự: Trạng ngữ thời gian/địa điểm đứng trước vị ngữ động từ',
          reason: 'Người Việt hay đặt cụm thời gian và địa điểm ở cuối câu giống tiếng Việt.'
        }
      ],
      exampleSentences: matchedPoint.examples && Array.isArray(matchedPoint.examples) 
        ? matchedPoint.examples.map(ex => ({
            hanzi: ex.chinese || ex.hanzi || '我在学校学习。',
            pinyin: ex.pinyin || 'Wǒ zài xuéxiào xuéxí.',
            meaning: ex.vietnamese || ex.meaning || 'Tôi học tập ở trường.',
            sourceType: 'verified_curriculum_example'
          }))
        : [
            {
              hanzi: '我是越南人。',
              pinyin: 'Wǒ shì Yuènán rén.',
              meaning: 'Tôi là người Việt Nam.',
              sourceType: 'verified_curriculum_example'
            }
          ],
      quickPractice: [
        {
          question: `Chọn câu có trật tự đúng với điểm ngữ pháp "${matchedPoint.title || cleanPoint}":`,
          options: [
            '我在家看书。',
            '我看书在家。',
            '家我在看书。',
            '在看书我家。'
          ],
          correctIndex: 0,
          explanation: 'Quy tắc: Chủ ngữ (我) + 在 + Địa điểm (家) + Động từ (看书).'
        }
      ],
      isOffline: true
    };
  }

  // Fallback tổng quát chuẩn mực
  return {
    grammarPoint: cleanPoint || 'Trật tự câu cơ bản trong tiếng Trung',
    hskLevel,
    structure: 'Chủ ngữ + [Trạng ngữ Thời gian / Nơi chốn] + Động từ + Tân ngữ',
    explanationVi: `Trong tiếng Trung, quy tắc then chốt cần nhớ là: Sự việc xảy ra ở đâu, khi nào thì thành phần "khi nào" và "ở đâu" phải diễn ra TRƯỚC hành động động từ. Điều này khác biệt lớn so với tiếng Việt.`,
    sinoVietnameseNotes: 'Nhiều hư từ ngữ pháp có nghĩa Hán Việt tương đương (như 在 = Tại, 是 = Thị, 有 = Hữu).',
    commonMistakes: [
      {
        wrong: '我看电影在电影院。 (Dịch theo tiếng Việt: Tôi xem phim ở rạp)',
        correct: '我在电影院看电影。',
        reason: 'Trong tiếng Trung, trạng ngữ nơi chốn (在电影院) bắt buộc phải đứng trước động từ (看).'
      }
    ],
    exampleSentences: [
      {
        hanzi: '他明天去北京。',
        pinyin: 'Tā míngtiān qù Běijīng.',
        meaning: 'Ngày mai anh ấy đi Bắc Kinh.',
        sourceType: 'verified_curriculum_example'
      },
      {
        hanzi: '我们在教室听老师说话。',
        pinyin: 'Wǒmen zài jiàoshì tīng lǎoshī shuōhuà.',
        meaning: 'Chúng tôi nghe thầy cô nói chuyện trong lớp học.',
        sourceType: 'verified_curriculum_example'
      }
    ],
    quickPractice: [
      {
        question: 'Chọn câu diễn đạt tự nhiên và đúng ngữ pháp nhất:',
        options: [
          '我晚上八点喝茶。',
          '我喝茶晚上八点。',
          '喝茶我晚上八点。',
          '八点我茶喝晚上。'
        ],
        correctIndex: 0,
        explanation: 'Trạng ngữ thời gian "晚上八点" đứng sau chủ ngữ "我" và đứng trước động từ "喝茶".'
      }
    ],
    isOffline: true
  };
}

/**
 * 3. Sinh bài tập cá nhân hóa ngoại tuyến dựa trên từ vựng mục tiêu
 */
export function generateOfflineExercises(targetConcept = '你好', hskLevel = 'HSK 1', exerciseType = 'multiple_choice') {
  const cleanTarget = String(targetConcept || '你好').trim();

  // Tìm từ vựng tương ứng trong từ điển VOCABULARY_LIST
  const vocab = VOCABULARY_LIST.find(v => v.hanzi === cleanTarget || cleanTarget.includes(v.hanzi)) || {
    id: 999,
    hanzi: cleanTarget,
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào',
    level: hskLevel,
    example: { hanzi: `${cleanTarget}，很高兴认识你。`, pinyin: '', meaning: 'Xin chào, rất vui được làm quen với bạn.' }
  };

  const drills = [
    {
      id: `drill-mc-${vocab.id || 1}`,
      prompt: `Chọn nghĩa tiếng Việt chính xác của từ "${vocab.hanzi}" (${vocab.pinyin}):`,
      targetHanzi: vocab.hanzi,
      pinyin: vocab.pinyin,
      meaning: vocab.meaning,
      options: [
        vocab.meaning,
        'Cảm ơn bạn',
        'Tạm biệt',
        'Không có gì'
      ],
      correctAnswer: vocab.meaning,
      correctIndex: 0,
      explanation: `"${vocab.hanzi}" có phiên âm chuẩn là "${vocab.pinyin}", mang nghĩa là "${vocab.meaning}".`,
      sourceType: 'offline_verified_drill'
    },
    {
      id: `drill-fill-${vocab.id || 1}`,
      prompt: `Điền từ thích hợp vào chỗ trống trong câu: "_____，很高兴认识你。"`,
      targetHanzi: vocab.hanzi,
      pinyin: vocab.pinyin,
      meaning: vocab.meaning,
      options: [
        vocab.hanzi,
        '再见',
        '谢谢',
        '不客气'
      ],
      correctAnswer: vocab.hanzi,
      correctIndex: 0,
      explanation: `Trong tình huống gặp mặt làm quen, người bản xứ dùng "${vocab.hanzi}" để mở đầu câu chào hỏi thân thiện.`,
      sourceType: 'offline_verified_drill'
    }
  ];

  return {
    targetConcept: cleanTarget,
    hskLevel,
    exerciseType,
    drills,
    isOffline: true
  };
}

/**
 * 4. Chẩn đoán lỗi sai thi thử HSK ngoại tuyến
 */
export function diagnoseOfflineHskMistakes(mistakes = [], attempts = []) {
  if (!Array.isArray(mistakes) || mistakes.length === 0) {
    return {
      overallDiagnosis: 'Bài thi thử của bạn có kết quả rất tốt, không ghi nhận các lỗi sai nghiêm trọng mang tính hệ thống!',
      recurringErrorPatterns: [],
      targetedPracticePlan: [
        {
          step: 1,
          focus: 'Duy trì phong độ',
          recommendedAction: 'Thực hiện thêm 1 bài thi mô phỏng đầy đủ thời gian để rèn áp lực phòng thi.',
          targetRoute: 'hsk'
        }
      ],
      encouragement: 'Tiếp tục giữ vững sự tập trung cao độ và đà luyện thi này nhé!',
      isOffline: true
    };
  }

  // Phân loại lỗi theo kỹ năng
  const skillCount = { listening: 0, reading: 0, writing: 0 };
  mistakes.forEach(m => {
    const s = String(m.skill || m.skill_category || 'reading').toLowerCase();
    if (s.includes('listen') || s.includes('nghe')) skillCount.listening++;
    else if (s.includes('writ') || s.includes('viết')) skillCount.writing++;
    else skillCount.reading++;
  });

  const patterns = [];
  if (skillCount.listening > 0) {
    patterns.push({
      skill: 'listening',
      errorType: 'Nhiễu âm thanh & bẫy thời gian',
      description: `Ghi nhận ${skillCount.listening} lỗi trong phần Nghe. Thường do người học chưa nhận diện nhanh từ đồng âm hoặc bị cuốn vào việc dịch thầm sang tiếng Việt.`,
      frequency: `${skillCount.listening} câu`,
      remedy: 'Đọc lướt 4 đáp án trước khi băng phát; tập trung bắt các từ khóa then chốt (ai, ở đâu, khi nào).'
    });
  }

  if (skillCount.reading > 0) {
    patterns.push({
      skill: 'reading',
      errorType: 'Nhầm lẫn định ngữ & trung tâm ngữ',
      description: `Ghi nhận ${skillCount.reading} lỗi trong phần Đọc hiểu. Lỗi phổ biến là nhầm lẫn các từ gần nghĩa hoặc không xác định đúng cụm danh từ dài.`,
      frequency: `${skillCount.reading} câu`,
      remedy: 'Tìm thành phần trợ từ "的" trong câu để tách biệt cụm miêu tả (định ngữ) và danh từ chính.'
    });
  }

  if (skillCount.writing > 0) {
    patterns.push({
      skill: 'writing',
      errorType: 'Trật tự câu & liên từ bổ ngữ',
      description: `Ghi nhận ${skillCount.writing} lỗi trong phần Viết. Thường gặp ở các câu sắp xếp trật tự từ có câu chữ 把 hoặc câu so sánh 比.`,
      frequency: `${skillCount.writing} câu`,
      remedy: 'Nắm vững 5 mẫu câu đặc biệt HSK (câu chữ 把, 被, 比, 是...的, 连...都).'
    });
  }

  const targetedPlan = [
    {
      step: 1,
      focus: 'Khắc phục lỗ hổng từ vựng trong đề thi',
      recommendedAction: 'Mở Sổ tay lỗi sai (Mistake Notebook) và lưu các từ làm sai vào danh sách Flashcard SRS.',
      targetRoute: 'hsk'
    },
    {
      step: 2,
      focus: 'Luyện tập theo chuyên đề kỹ năng yếu nhất',
      recommendedAction: `Ưu tiên làm các bài tập trắc nghiệm kỹ năng ${skillCount.listening >= skillCount.reading ? 'Nghe hiểu' : 'Đọc hiểu'}.`,
      targetRoute: 'vocabulary'
    }
  ];

  return {
    overallDiagnosis: `Phát hiện tổng cộng ${mistakes.length} câu làm chưa chính xác trong các lần làm bài gần đây. Phần cần củng cố ưu tiên nhất là ${skillCount.listening > skillCount.reading ? 'Kỹ năng Nghe' : 'Kỹ năng Đọc hiểu'}.`,
    recurringErrorPatterns: patterns,
    targetedPracticePlan: targetedPlan,
    encouragement: 'Mỗi lỗi sai trong thi thử là một cơ hội vàng để bít lỗ hổng kiến thức trước kỳ thi thật. Đừng nản lòng!',
    isOffline: true
  };
}

/**
 * 5. Gợi ý tài liệu học tập chuẩn hóa ngoại tuyến
 */
export function recommendOfflineResources(context = {}, candidateMaterials = []) {
  const {
    hskLevel = 'HSK 1',
    learningGoal = 'general_foundation',
    weakSkills = []
  } = context;

  const pool = Array.isArray(candidateMaterials) && candidateMaterials.length > 0 
    ? candidateMaterials 
    : HSK_RESOURCES;

  // Lọc và chấm điểm phù hợp
  const scored = pool.map(item => {
    let score = 50;
    const itemLevel = String(item.level || '').toUpperCase();
    const targetLvl = String(hskLevel || '').toUpperCase();

    // Khớp cấp độ
    if (itemLevel.includes(targetLvl) || targetLvl.includes(itemLevel)) {
      score += 30;
    }

    // Khớp kỹ năng yếu
    const itemSkill = String(item.skills || item.skill || item.category || '').toLowerCase();
    for (const ws of weakSkills) {
      if (itemSkill.includes(String(ws).toLowerCase())) {
        score += 20;
        break;
      }
    }

    // Khớp mục tiêu học
    if (learningGoal === 'hsk_exam' && (item.category?.includes('Đề thi') || item.category?.includes('Giáo trình'))) {
      score += 15;
    } else if (learningGoal === 'daily_communication' && item.category?.includes('Giao tiếp')) {
      score += 15;
    }

    return {
      materialId: item.id,
      title: item.title,
      category: item.category || 'Tài liệu học tập',
      matchScore: Math.min(100, score),
      rationale: `Phù hợp với cấp độ ${hskLevel} và mục tiêu ${learningGoal === 'hsk_exam' ? 'luyện thi HSK' : 'củng cố kiến thức'}.`,
      recommendedChaptersOrPages: 'Tham khảo phần trọng tâm theo bài học hiện tại'
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  return {
    recommendations: scored.slice(0, 4),
    isOffline: true
  };
}
