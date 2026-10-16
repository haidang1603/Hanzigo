/**
 * =========================================================================
 * HANZI GO - LEARNING RECOMMENDATION ENGINE (PHASE 4)
 * =========================================================================
 * Bộ máy đề xuất nội dung học tập tiếp theo thông minh, chuẩn mực sư phạm:
 * 1. Đa tín hiệu phân tích thực tế (Multi-signal Deterministic Ranking):
 *    - Từ vựng sắp đến hạn ôn tập SRS (SuperMemo-2).
 *    - Từ vựng thường xuyên trả lời sai hoặc cần củng cố.
 *    - Bài học tiên quyết trên lộ trình chưa hoàn thành.
 *    - Các câu sai trong đề thi HSK (Sổ tay câu sai / Mistake Notebook).
 *    - Kỹ năng có kết quả thấp qua nhiều lượt luyện tập.
 *    - Mục tiêu học tập cá nhân do người dùng thiết lập.
 *    - Nguy cơ đứt gãy thói quen (Inactivity Risk / Streak Broken).
 * 2. Cấu trúc chuẩn hóa của mỗi đề xuất:
 *    - id, title, reason, skill, priority, estimatedMinutes, actionUrl,
 *      targetRoute, targetRef, dataSources, signals.
 * 3. Chống liên kết hỏng (Zero Broken Links):
 *    - Đối chiếu và kiểm tra tính tồn tại của bài học trước khi đề xuất.
 * 4. Xử lý Cold-Start:
 *    - Cung cấp lộ trình khởi đầu minh bạch cho học viên mới.
 * =========================================================================
 */

import { CURRICULUM_60_LESSONS } from '../data/curriculumLessons.js';

// Danh sách các ID bài học hợp lệ trong giáo trình chuẩn
const VALID_LESSON_IDS = new Set(CURRICULUM_60_LESSONS.map(l => l.id));

/**
 * Tạo danh sách các khuyến nghị học tập cá nhân hóa được xếp hạng theo thứ tự ưu tiên
 * @param {Object} unifiedProfile - Hồ sơ năng lực học tập thống nhất từ unifiedLearningProfileService
 * @returns {Array<Object>} Danh sách các khuyến nghị học tập
 */
export function generateLearningRecommendations(unifiedProfile) {
  if (!unifiedProfile) return [];

  const {
    hasSparseData = false,
    targetHskLevel = 'HSK 1',
    learningGoal = 'general_foundation',
    dailyGoalMinutes = 15,
    streak = 0,
    daysInactive = 0,
    lessonProgress = {},
    vocabProgress = {},
    hskProgress = {},
    skills = {}
  } = unifiedProfile;

  const recommendations = [];

  // -------------------------------------------------------------------------
  // KỊCH BẢN 1: HỌC VIÊN MỚI (COLD-START / SPARSE DATA)
  // -------------------------------------------------------------------------
  if (hasSparseData) {
    // Gợi ý 1: Bài kiểm tra định vị đầu vào (Placement Test)
    recommendations.push({
      id: 'rec-cold-start-placement',
      title: 'Đánh giá năng lực đầu vào (Placement Test)',
      reason: 'Bạn là học viên mới! Hoàn thành bài kiểm tra nhanh 3 phút (10 câu) giúp AI định vị chuẩn xác trình độ và đề xuất bài học phù hợp nhất.',
      skill: 'general',
      priority: 'high',
      estimatedMinutes: 3,
      actionUrl: '/roadmap?action=placement_test',
      targetRoute: 'roadmap',
      targetRef: 'placement_test',
      dataSources: ['onboarding_assessment'],
      signals: ['Học viên mới chưa có lịch sử thực hành'],
      isInitialRecommendation: true
    });

    // Gợi ý 2: Bài học mở đầu nhập môn Pinyin
    recommendations.push({
      id: 'rec-cold-start-lesson-1',
      title: 'Bài 1: Chào hỏi căn bản (你好)',
      reason: 'Bắt đầu làm quen với hệ thống ngữ âm Pinyin, 4 thanh điệu chuẩn và cách chào hỏi lịch sự cơ bản trong tiếng Trung.',
      skill: 'pronunciation',
      priority: 'medium',
      estimatedMinutes: Math.min(10, dailyGoalMinutes),
      actionUrl: '/roadmap?lessonId=l-101',
      targetRoute: 'roadmap',
      targetRef: 'l-101',
      dataSources: ['curriculum_starter'],
      signals: [`Mục tiêu học: ${targetHskLevel}`],
      isInitialRecommendation: true
    });

    return recommendations;
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 1: NGUY CƠ GIÁN ĐOẠN HỌC TẬP (INACTIVITY & STREAK RECOVERY)
  // -------------------------------------------------------------------------
  if (daysInactive >= 3) {
    recommendations.push({
      id: 'rec-inactivity-revival',
      title: 'Khởi động 5 phút để kích hoạt lại thói quen',
      reason: `Bạn đã tạm dừng học ${daysInactive} ngày. Ôn tập nhanh 5 phút giúp tái kích hoạt trí nhớ từ vựng và phục hồi chuỗi học tập liên tục.`,
      skill: 'general',
      priority: 'high',
      estimatedMinutes: 5,
      actionUrl: '/vocabulary?mode=quick_review',
      targetRoute: 'vocabulary',
      dataSources: ['activity_history'],
      signals: [`${daysInactive} ngày chưa học`, `Chuỗi streak hiện tại: ${streak} ngày`]
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 2: TỒN ĐỌNG TỪ VỰNG SRS ĐẾN HẠN (SPACED REPETITION BACKLOG)
  // -------------------------------------------------------------------------
  const srsDueCount = vocabProgress.srsDueCount || 0;
  if (srsDueCount > 0) {
    const isHeavyBacklog = srsDueCount >= 10;
    recommendations.push({
      id: 'rec-srs-due-review',
      title: `Ôn tập ${Math.min(srsDueCount, 20)} từ vựng đến hạn (SRS)`,
      reason: `Có ${srsDueCount} từ vựng đã đến chu kỳ lặp lại ngắt quãng SuperMemo-2. Ôn tập ngay hôm nay để đưa từ vào vùng trí nhớ dài hạn.`,
      skill: 'vocabulary',
      priority: isHeavyBacklog ? 'high' : 'medium',
      estimatedMinutes: Math.min(10, Math.max(3, Math.ceil(srsDueCount * 0.4))),
      actionUrl: '/vocabulary?mode=review',
      targetRoute: 'vocabulary',
      dataSources: ['srs_database'],
      signals: [`${srsDueCount} thẻ từ đến chu kỳ cần ôn tập`]
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 3: SỔ TAY CÂU SAI HSK CẦN ÔN LẠI (MISTAKES DRILL)
  // -------------------------------------------------------------------------
  const activeMistakesCount = hskProgress.activeMistakesCount || 0;
  const topMistakes = hskProgress.topRecurringMistakes || [];

  if (activeMistakesCount > 0) {
    const hasRecurring = topMistakes.some(m => (m.mistakeCount || 1) >= 2);
    const primarySkill = hskProgress.mistakesBySkill?.listening?.length > hskProgress.mistakesBySkill?.reading?.length 
      ? 'listening' 
      : 'reading';

    recommendations.push({
      id: 'rec-hsk-mistakes-practice',
      title: `Luyện lại ${Math.min(activeMistakesCount, 10)} câu sai trong Sổ tay câu sai`,
      reason: hasRecurring
        ? `Bạn có những câu hỏi làm sai lặp lại nhiều lần trong các đề thi ${targetHskLevel}. Luyện lại giúp giải mã bẫy đề thi và không mất điểm oan.`
        : `Có ${activeMistakesCount} câu hỏi bạn từng làm sai chưa được khắc phục. Luyện tập lại với lời giải chi tiết để biến điểm yếu thành điểm mạnh.`,
      skill: primarySkill,
      priority: hasRecurring ? 'high' : 'medium',
      estimatedMinutes: Math.min(12, Math.max(5, activeMistakesCount * 2)),
      actionUrl: '/practice/hsk?tab=mistakes',
      targetRoute: 'hsk',
      targetRef: 'mistakes_tab',
      dataSources: ['hsk_mistakes_notebook'],
      signals: [
        `${activeMistakesCount} câu sai cần ôn`,
        hasRecurring ? 'Phát hiện lỗi sai lặp lại >= 2 lần' : 'Lỗi thi thử gần nhất'
      ]
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 4: BÀI HỌC CẦN ÔN LẠI TRÊN LỘ TRÌNH (LOW SCORE LESSONS)
  // -------------------------------------------------------------------------
  const reviewLessons = lessonProgress.reviewLessons || [];
  const topRevLesson = reviewLessons.find(l => VALID_LESSON_IDS.has(l.lessonId));
  if (topRevLesson) {
    recommendations.push({
      id: `rec-review-lesson-${topRevLesson.lessonId}`,
      title: `Ôn tập bài học: ${topRevLesson.title || topRevLesson.lessonId}`,
      reason: topRevLesson.reason || `Bài học trước đó đạt điểm đánh giá ${topRevLesson.score || 70}/100. Hãy hoàn thiện các câu hỏi để đạt 3 sao chuẩn.`,
      skill: 'grammar',
      priority: 'medium',
      estimatedMinutes: 8,
      actionUrl: `/roadmap?lessonId=${topRevLesson.lessonId}`,
      targetRoute: 'roadmap',
      targetRef: topRevLesson.lessonId,
      dataSources: ['lesson_progress_history'],
      signals: [`Điểm bài học: ${topRevLesson.score || 70}/100`, 'Cần củng cố ngữ pháp']
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 5: BÀI HỌC TIẾP THEO TRÊN LỘ TRÌNH CHUẨN (NEXT PREREQUISITE LESSON)
  // -------------------------------------------------------------------------
  const nextLesson = lessonProgress.nextLesson;
  const isNextLessonAlreadyCompleted = nextLesson && (
    (lessonProgress.completedLessonsMap && Boolean(lessonProgress.completedLessonsMap[nextLesson.lessonId])) ||
    (lessonProgress.completedLessonIds && lessonProgress.completedLessonIds.includes(nextLesson.lessonId))
  );

  if (nextLesson && VALID_LESSON_IDS.has(nextLesson.lessonId) && !isNextLessonAlreadyCompleted) {
    recommendations.push({
      id: `rec-next-lesson-${nextLesson.lessonId}`,
      title: `Học bài mới: ${nextLesson.title}`,
      reason: 'Bước tiếp theo tối ưu trên lộ trình. Nạp thêm từ vựng và cấu trúc câu mới phù hợp với mục tiêu của bạn.',
      skill: 'reading',
      priority: recommendations.length === 0 ? 'high' : 'medium',
      estimatedMinutes: Math.min(15, Math.max(10, dailyGoalMinutes - 5)),
      actionUrl: `/roadmap?lessonId=${nextLesson.lessonId}`,
      targetRoute: 'roadmap',
      targetRef: nextLesson.lessonId,
      dataSources: ['curriculum_roadmap'],
      signals: [`Bài học tiếp theo sau ${lessonProgress.completedCount || 0} bài đã hoàn thành`]
    });
  } else if (((lessonProgress.completedCount || lessonProgress.totalCompletedLessons || lessonProgress.completedLessonIds?.length || 0) >= 60) && !recommendations.some(r => r.id.startsWith('rec-next-lesson'))) {
    recommendations.push({
      id: 'rec-curriculum-completed',
      title: 'Hoàn thành toàn bộ 60 bài học!',
      reason: 'Chúc mừng bạn đã hoàn thành xuất sắc toàn bộ 60 bài học trên Lộ trình! Hãy tập trung luyện đề thi thử HSK để đạt chứng chỉ.',
      skill: 'general',
      priority: 'high',
      estimatedMinutes: 20,
      actionUrl: '/practice/hsk',
      targetRoute: 'hsk',
      dataSources: ['curriculum_completion'],
      signals: ['60/60 bài học đã hoàn thành']
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 6: KỸ NĂNG CÓ ĐIỂM SỐ YẾU QUA ĐÁNH GIÁ (SKILL DEFICIT)
  // -------------------------------------------------------------------------
  // (a) Phát âm yếu
  if (skills.pronunciation?.hasEnoughData && skills.pronunciation.score < 70) {
    recommendations.push({
      id: 'rec-skill-pronunciation',
      title: 'Luyện 5 câu phát âm & thanh điệu với Mic',
      reason: `Độ chuẩn xác phát âm microphone đạt ${skills.pronunciation.score}/100. Cần chú ý phân biệt rõ thanh 1 (âm cao bằng) và thanh 4 (âm dứt khoát).`,
      skill: 'pronunciation',
      priority: skills.pronunciation.score < 50 ? 'high' : 'medium',
      estimatedMinutes: 5,
      actionUrl: '/pronunciation',
      targetRoute: 'pronunciation',
      dataSources: ['microphone_speech_diagnostic'],
      signals: [`Điểm phát âm: ${skills.pronunciation.score}/100`]
    });
  }

  // (b) Nghe hiểu HSK yếu
  if (skills.listening?.hasEnoughData && skills.listening.score < 60) {
    recommendations.push({
      id: 'rec-skill-listening-hsk',
      title: `Luyện nghe đối thoại theo chuẩn ${targetHskLevel}`,
      reason: `Kỹ năng nghe hiểu đạt ${skills.listening.score}%. Luyện nghe câu hỏi phản xạ giúp tăng tốc độ bắt từ khóa trong bài nói của người bản ngữ.`,
      skill: 'listening',
      priority: 'high',
      estimatedMinutes: 8,
      actionUrl: '/conversation',
      targetRoute: 'conversation',
      dataSources: ['hsk_exam_skill_breakdown'],
      signals: [`Độ chính xác kỹ năng nghe: ${skills.listening.score}%`]
    });
  }

  // -------------------------------------------------------------------------
  // TÍN HIỆU 7: THÍCH ỨNG THEO MỤC TIÊU HỌC TẬP RIÊNG (USER GOAL ADAPTATION)
  // -------------------------------------------------------------------------
  if (learningGoal === 'hsk_exam') {
    recommendations.push({
      id: 'rec-goal-hsk-mock',
      title: `Thử sức với đề thi mô phỏng ${targetHskLevel}`,
      reason: 'Làm quen với áp lực thời gian và giao diện thi thật để đánh giá độ sẵn sàng trước kỳ thi.',
      skill: 'general',
      priority: 'medium',
      estimatedMinutes: 15,
      actionUrl: '/practice/hsk',
      targetRoute: 'hsk',
      dataSources: ['user_goal_preference'],
      signals: [`Mục tiêu người dùng: Chinh phục kỳ thi ${targetHskLevel}`]
    });
  } else if (learningGoal === 'daily_communication' || learningGoal === 'travel_speaking') {
    if (!recommendations.some(r => r.skill === 'speaking' || r.skill === 'pronunciation')) {
      recommendations.push({
        id: 'rec-goal-speaking-drill',
        title: 'Luyện phản xạ giao tiếp & khẩu ngữ',
        reason: 'Thực hành các mẫu câu đối thoại thực tế theo đúng mục tiêu ưu tiên giao tiếp hàng ngày của bạn.',
        skill: 'speaking',
        priority: 'medium',
        estimatedMinutes: 7,
        actionUrl: '/conversation',
        targetRoute: 'conversation',
        dataSources: ['user_goal_preference'],
        signals: ['Mục tiêu người dùng: Giao tiếp thực chiến']
      });
    }
  }

  // -------------------------------------------------------------------------
  // XẾP HẠNG & LỌC TỐI ĐA 5 ĐỀ XUẤT TỐT NHẤT
  // -------------------------------------------------------------------------
  const priorityWeights = { high: 3, medium: 2, low: 1 };
  const sorted = recommendations.sort((a, b) => {
    const diff = (priorityWeights[b.priority] || 1) - (priorityWeights[a.priority] || 1);
    if (diff !== 0) return diff;
    return (a.estimatedMinutes || 5) - (b.estimatedMinutes || 5);
  });

  return sorted.slice(0, 5);
}
