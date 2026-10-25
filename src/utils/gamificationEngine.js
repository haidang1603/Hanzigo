/**
 * =========================================================================
 * GAMIFICATION ENGINE — TIMEZONE-AWARE STREAK, SCHOLAR RANKS & ACADEMIC BADGES
 * =========================================================================
 * Module tính toán thuần túy (pure deterministic logic) cho hệ thống Giữ chân Người học:
 * 1. Timezone-aware Daily Streak & Streak Freeze:
 *    - Tính toán chênh lệch ngày lịch theo múi giờ IANA (vd: 'Asia/Ho_Chi_Minh', 'America/New_York').
 *    - Chống gian lận thời gian, bảo vệ chuỗi khi dùng Streak Freeze hợp lệ.
 * 2. 10 Cấp bậc Học thuật (Scholar Ranks):
 *    - Quy đổi tổng XP sang danh hiệu Hán học cổ điển kết hợp hiện đại.
 * 3. 18 Huy hiệu Thành tựu Học thuật (Academic Badges):
 *    - 4 nhóm tiêu chí: Chuyên cần, Cột mốc HSK 1-6, Kỹ năng chuyên sâu, Xuất sắc thi cử.
 * =========================================================================
 */

// =========================================================================
// 1. TIMEZONE & CALENDAR UTILS
// =========================================================================

/**
 * Lấy chuỗi ngày lịch YYYY-MM-DD theo múi giờ chỉ định (hoặc múi giờ máy tính nếu không có).
 * Đảm bảo đồng nhất không bị lệch múi giờ UTC vs Local.
 */
export function getLocalDateStringInTz(date = new Date(), timeZone = null) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;

  try {
    const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(d); // en-CA cho định dạng chuẩn YYYY-MM-DD
  } catch {
    // Fallback nếu múi giờ không hợp lệ
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Tính số ngày lịch chênh lệch giữa hai chuỗi ngày 'YYYY-MM-DD'
 * Trả về:
 * - 0: Cùng ngày
 * - 1: Kế tiếp 1 ngày
 * - 2: Cách 1 ngày (ví dụ thứ 2 rồi đến thứ 4)
 * - >2: Cách nhiều ngày
 * - <0: Ngày thứ hai diễn ra trước ngày thứ nhất
 */
export function getCalendarDaysDiff(fromDateStr, toDateStr) {
  if (!fromDateStr || !toDateStr) return null;
  const [y1, m1, d1] = fromDateStr.split('-').map(Number);
  const [y2, m2, d2] = toDateStr.split('-').map(Number);
  
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;

  // Sử dụng UTC midnight để tránh bug giờ mùa hè (Daylight Saving Time)
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

// =========================================================================
// 2. DAILY STREAK & STREAK FREEZE ENGINE
// =========================================================================

/**
 * Cập nhật chuỗi học liên tiếp (Streak) có hỗ trợ vật phẩm Đóng băng Chuỗi (Streak Freeze).
 * Logic nghiệp vụ chặt chẽ:
 * - Học viên phải hoàn thành ít nhất 1 hoạt động có thực chất trong ngày.
 * - `lastActiveDate === today`: Cùng ngày -> Giữ nguyên currentStreak.
 * - `lastActiveDate === yesterday` (diff === 1): Hôm qua có học -> currentStreak + 1.
 * - `daysDiff === 2` VÀ `streakFreezes > 0`: Nghỉ 1 ngày nhưng CÓ Freeze -> Kích hoạt Freeze,
 *   giữ nguyên currentStreak, streakFreezes - 1, freezeUsed = true.
 * - `daysDiff >= 2` và KHÔNG đủ freeze: Đứt chuỗi -> currentStreak = 1.
 * - Lần đầu tiên học (lastActiveDate rỗng): currentStreak = 1.
 */
export function calculateStreakUpdate({
  currentStreak = 0,
  longestStreak = 0,
  lastActiveDate = null,
  streakFreezes = 0,
  today = null,
  timeZone = null
} = {}) {
  const effectiveToday = today || getLocalDateStringInTz(new Date(), timeZone);
  const safeCurrent = Math.max(0, parseInt(currentStreak, 10) || 0);
  const safeLongest = Math.max(safeCurrent, parseInt(longestStreak, 10) || 0);
  let safeFreezes = Math.max(0, parseInt(streakFreezes, 10) || 0);

  // 1. Học viên mới lần đầu tiên
  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, safeLongest),
      lastActiveDate: effectiveToday,
      streakFreezes: safeFreezes,
      freezeUsed: false,
      status: 'started'
    };
  }

  const daysDiff = getCalendarDaysDiff(lastActiveDate, effectiveToday);

  // 2. Học viên quay lại học trong cùng ngày
  if (daysDiff === 0) {
    return {
      currentStreak: Math.max(1, safeCurrent),
      longestStreak: Math.max(safeLongest, safeCurrent, 1),
      lastActiveDate: effectiveToday,
      streakFreezes: safeFreezes,
      freezeUsed: false,
      status: 'maintained_same_day'
    };
  }

  // 3. Học viên học ngày kế tiếp liên tiếp (hôm qua có học)
  if (daysDiff === 1) {
    const nextStreak = safeCurrent + 1;
    return {
      currentStreak: nextStreak,
      longestStreak: Math.max(safeLongest, nextStreak),
      lastActiveDate: effectiveToday,
      streakFreezes: safeFreezes,
      freezeUsed: false,
      status: 'incremented'
    };
  }

  // 4. Nghỉ 1 ngày (daysDiff === 2) và CÓ vật phẩm Streak Freeze
  if (daysDiff === 2 && safeFreezes > 0) {
    safeFreezes -= 1;
    // Streak được bảo vệ, sau đó cộng thêm ngày học hôm nay
    const nextStreak = (safeCurrent > 0 ? safeCurrent : 1) + 1;
    return {
      currentStreak: nextStreak,
      longestStreak: Math.max(safeLongest, nextStreak),
      lastActiveDate: effectiveToday,
      streakFreezes: safeFreezes,
      freezeUsed: true,
      status: 'freeze_saved'
    };
  }

  // 5. Đứt chuỗi (nghỉ quá 1 ngày hoặc không có freeze khi nghỉ)
  return {
    currentStreak: 1,
    longestStreak: Math.max(safeLongest, 1),
    lastActiveDate: effectiveToday,
    streakFreezes: safeFreezes,
    freezeUsed: false,
    status: 'reset_to_one'
  };
}

// =========================================================================
// 3. HỆ THỐNG CẤP ĐỘ HỌC THUẬT (SCHOLAR RANKS - 10 CẤP BẬC)
// =========================================================================

export const SCHOLAR_RANKS = [
  {
    level: 1,
    title: 'Nhập Môn Học Đồng',
    chineseTitle: '入门学童',
    minXp: 0,
    icon: '🌱',
    color: '#94A3B8',
    description: 'Bắt đầu làm quen với ngữ âm Pinyin và nét bút cơ bản.'
  },
  {
    level: 2,
    title: 'Đồng Sinh Hán Ngữ',
    chineseTitle: '童生',
    minXp: 300,
    icon: '✏️',
    color: '#60A5FA',
    description: 'Nắm vững bảng chữ cái, chào hỏi và hội thoại sinh hoạt sơ cấp.'
  },
  {
    level: 3,
    title: 'Tú Tài Sơ Giai',
    chineseTitle: '秀才',
    minXp: 900,
    icon: '📜',
    color: '#34D399',
    description: 'Làm chủ 300 từ vựng cốt lõi và giao tiếp tự tin ở trình độ HSK 1-2.'
  },
  {
    level: 4,
    title: 'Cử Nhân Trung Giai',
    chineseTitle: '举人',
    minXp: 2000,
    icon: '🏮',
    color: '#FBBF24',
    description: 'Đọc hiểu đoạn văn dài, ngữ pháp phức tạp tương đương HSK 3.'
  },
  {
    level: 5,
    title: 'Cống Sĩ Tinh Anh',
    chineseTitle: '贡士',
    minXp: 4000,
    icon: '🏛️',
    color: '#FB923C',
    description: 'Sử dụng thành thạo từ vựng phong phú, phản xạ nói trôi chảy.'
  },
  {
    level: 6,
    title: 'Tiến Sĩ Hán Học',
    chineseTitle: '进士',
    minXp: 7000,
    icon: '🎖️',
    color: '#E85D3F',
    description: 'Đọc báo, tài liệu chuyên sâu và tự tin đạt chuẩn HSK 4.'
  },
  {
    level: 7,
    title: 'Thám Hoa Văn Nhã',
    chineseTitle: '探花',
    minXp: 12000,
    icon: '🌸',
    color: '#EC4899',
    description: 'Văn phong tao nhã, diễn đạt mạch lạc cả văn nói và văn bản.'
  },
  {
    level: 8,
    title: 'Bảng Nhãn Uyên Bác',
    chineseTitle: '榜眼',
    minXp: 20000,
    icon: '🌟',
    color: '#A855F7',
    description: 'Hiểu sâu văn hóa, thành ngữ (thành ngữ tục ngữ) và tranh luận học thuật.'
  },
  {
    level: 9,
    title: 'Trạng Nguyên Hán Ngữ',
    chineseTitle: '状元',
    minXp: 35000,
    icon: '👑',
    color: '#EAB308',
    description: 'Đỉnh cao học thuật, làm chủ toàn diện 4 kỹ năng HSK 5-6.'
  },
  {
    level: 10,
    title: 'Đại Tông Sư',
    chineseTitle: '一代宗师',
    minXp: 60000,
    icon: '🌌',
    color: '#6366F1',
    description: 'Bậc thầy ngôn ngữ và văn hóa Đông Á, truyền cảm hứng cho muôn người.'
  }
];

/**
 * Tính cấp bậc Scholar Rank dựa trên tổng XP thực tế
 */
export function calculateScholarRank(totalXp = 0) {
  const safeXp = Math.max(0, parseInt(totalXp, 10) || 0);
  
  let currentRank = SCHOLAR_RANKS[0];
  let nextRank = SCHOLAR_RANKS[1];

  for (let i = SCHOLAR_RANKS.length - 1; i >= 0; i--) {
    if (safeXp >= SCHOLAR_RANKS[i].minXp) {
      currentRank = SCHOLAR_RANKS[i];
      nextRank = SCHOLAR_RANKS[i + 1] || null;
      break;
    }
  }

  let progressPercent = 100;
  let xpToNext = 0;

  if (nextRank) {
    const range = nextRank.minXp - currentRank.minXp;
    const currentOverMin = safeXp - currentRank.minXp;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentOverMin / range) * 100)));
    xpToNext = Math.max(0, nextRank.minXp - safeXp);
  }

  return {
    ...currentRank,
    currentXp: safeXp,
    progressPercent,
    xpToNext,
    nextRankTitle: nextRank ? nextRank.title : null,
    nextRankXp: nextRank ? nextRank.minXp : null
  };
}

// =========================================================================
// 4. BỘ 18 HUY HIỆU THÀNH TỰU HỌC THUẬT (ACADEMIC ACHIEVEMENT BADGES)
// =========================================================================

export const ACHIEVEMENT_BADGES = [
  // --- NHÓM 1: CHUYÊN CẦN (STREAK DEDICATION) ---
  {
    id: 'streak_3_days',
    title: 'Khởi Đầu Kiên Trì',
    chineseTitle: '持之以恒',
    category: 'streak',
    icon: '🔥',
    description: 'Duy trì chuỗi học tập liên tiếp 3 ngày.',
    checkUnlock: (stats) => (stats.longestStreak || stats.currentStreak || 0) >= 3,
    progress: (stats) => Math.min(100, Math.round(((stats.longestStreak || stats.currentStreak || 0) / 3) * 100))
  },
  {
    id: 'streak_7_days',
    title: 'Chiến Binh Tuần Lễ',
    chineseTitle: '周冠军',
    category: 'streak',
    icon: '⚡',
    description: 'Duy trì chuỗi học tập liên tiếp 7 ngày.',
    checkUnlock: (stats) => (stats.longestStreak || stats.currentStreak || 0) >= 7,
    progress: (stats) => Math.min(100, Math.round(((stats.longestStreak || stats.currentStreak || 0) / 7) * 100))
  },
  {
    id: 'streak_30_days',
    title: 'Thói Quen Vàng',
    chineseTitle: '习惯成自然',
    category: 'streak',
    icon: '🏆',
    description: 'Duy trì ngọn lửa học tập suốt 30 ngày liên tục.',
    checkUnlock: (stats) => (stats.longestStreak || stats.currentStreak || 0) >= 30,
    progress: (stats) => Math.min(100, Math.round(((stats.longestStreak || stats.currentStreak || 0) / 30) * 100))
  },
  {
    id: 'streak_100_days',
    title: 'Hán Học Bách Nhật',
    chineseTitle: '百日功成',
    category: 'streak',
    icon: '💎',
    description: 'Đạt mốc 100 ngày kiên định học tập không ngắt quãng.',
    checkUnlock: (stats) => (stats.longestStreak || stats.currentStreak || 0) >= 100,
    progress: (stats) => Math.min(100, Math.round(((stats.longestStreak || stats.currentStreak || 0) / 100) * 100))
  },

  // --- NHÓM 2: CỘT MỐC CẤP ĐỘ HSK (HSK MILESTONES 1 - 6) ---
  {
    id: 'hsk1_master',
    title: 'Chinh Phục HSK 1',
    chineseTitle: 'HSK 一级通关',
    category: 'hsk_milestone',
    icon: '🥉',
    description: 'Hoàn thành trọn vẹn 20 bài học và vượt qua Đề thi thử HSK 1.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 1']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 1'] ? 100 : (stats.hskLessonCounts?.['HSK 1'] || 0) * 5)
  },
  {
    id: 'hsk2_master',
    title: 'Chinh Phục HSK 2',
    chineseTitle: 'HSK 二级通关',
    category: 'hsk_milestone',
    icon: '🥈',
    description: 'Hoàn thành trọn vẹn 20 bài học và vượt qua Đề thi thử HSK 2.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 2']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 2'] ? 100 : (stats.hskLessonCounts?.['HSK 2'] || 0) * 5)
  },
  {
    id: 'hsk3_master',
    title: 'Chinh Phục HSK 3',
    chineseTitle: 'HSK 三级通关',
    category: 'hsk_milestone',
    icon: '🥇',
    description: 'Hoàn thành trọn vẹn 20 bài học và vượt qua Đề thi thử HSK 3.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 3']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 3'] ? 100 : (stats.hskLessonCounts?.['HSK 3'] || 0) * 5)
  },
  {
    id: 'hsk4_master',
    title: 'Chinh Phục HSK 4',
    chineseTitle: 'HSK 四级通关',
    category: 'hsk_milestone',
    icon: '🎖️',
    description: 'Hoàn thành trọn vẹn 20 bài học và vượt qua Đề thi thử HSK 4.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 4']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 4'] ? 100 : (stats.hskLessonCounts?.['HSK 4'] || 0) * 5)
  },
  {
    id: 'hsk5_master',
    title: 'Chinh Phục HSK 5',
    chineseTitle: 'HSK 五级通关',
    category: 'hsk_milestone',
    icon: '👑',
    description: 'Hoàn thành trọn vẹn 20 bài học và vượt qua Đề thi thử HSK 5.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 5']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 5'] ? 100 : (stats.hskLessonCounts?.['HSK 5'] || 0) * 5)
  },
  {
    id: 'hsk6_master',
    title: 'Đỉnh Phong HSK 6',
    chineseTitle: 'HSK 六级巅峰',
    category: 'hsk_milestone',
    icon: '🌌',
    description: 'Hoàn thành toàn bộ 120 bài học chương trình và tốt nghiệp HSK 6.',
    checkUnlock: (stats) => Boolean(stats.hskGraduations && stats.hskGraduations['HSK 6']),
    progress: (stats) => (stats.hskGraduations && stats.hskGraduations['HSK 6'] ? 100 : (stats.hskLessonCounts?.['HSK 6'] || 0) * 5)
  },

  // --- NHÓM 3: KỸ NĂNG CHUYÊN SÂU (ADVANCED SKILLS) ---
  {
    id: 'calligraphy_master',
    title: 'Bậc Thầy Thư Pháp',
    chineseTitle: '妙笔生花',
    category: 'skill_depth',
    icon: '🖌️',
    description: 'Viết đạt trên 90 điểm cho ít nhất 50 chữ Hán trên Writing Pad.',
    checkUnlock: (stats) => (stats.highScoreWritingCharsCount || 0) >= 50,
    progress: (stats) => Math.min(100, Math.round(((stats.highScoreWritingCharsCount || 0) / 50) * 100))
  },
  {
    id: 'srs_linguist',
    title: 'Nhà Ngôn Ngữ Học',
    chineseTitle: '博闻强识',
    category: 'skill_depth',
    icon: '🧠',
    description: 'Sở hữu ít nhất 300 thẻ từ vựng Spaced Repetition ở trạng thái Mature (khoảng cách ôn tập >= 7 ngày).',
    checkUnlock: (stats) => (stats.matureSrsCardsCount || 0) >= 300,
    progress: (stats) => Math.min(100, Math.round(((stats.matureSrsCardsCount || 0) / 300) * 100))
  },
  {
    id: 'wise_reader',
    title: 'Độc Giả Thông Thái',
    chineseTitle: '开卷有益',
    category: 'skill_depth',
    icon: '📚',
    description: 'Đọc và hoàn thành trả lời câu hỏi cho 10 bài báo trên Smart Reader.',
    checkUnlock: (stats) => (stats.smartReaderCompletedCount || 0) >= 10,
    progress: (stats) => Math.min(100, Math.round(((stats.smartReaderCompletedCount || 0) / 10) * 100))
  },
  {
    id: 'roleplay_virtuoso',
    title: 'Cao Thủ Đối Thoại',
    chineseTitle: '伶牙俐齿',
    category: 'skill_depth',
    icon: '🎭',
    description: 'Hoàn thành xuất sắc 10 kịch bản AI Roleplay với trọn vẹn 3/3 nhiệm vụ giao tiếp.',
    checkUnlock: (stats) => (stats.roleplayFullMissionsCount || 0) >= 10,
    progress: (stats) => Math.min(100, Math.round(((stats.roleplayFullMissionsCount || 0) / 10) * 100))
  },

  // --- NHÓM 4: XUẤT SẮC THI CỬ & CỘNG ĐỒNG (EXAM EXCELLENCE & MASTERY) ---
  {
    id: 'perfect_mock_exam',
    title: 'Tuyệt Đối Điểm 100',
    chineseTitle: '满分神话',
    category: 'exam_excellence',
    icon: '💯',
    description: 'Đạt điểm tối đa 100% trong bất kỳ một đề thi thử HSK nào.',
    checkUnlock: (stats) => Boolean(stats.hasPerfectExamScore),
    progress: (stats) => (stats.hasPerfectExamScore ? 100 : Math.min(99, stats.maxExamPercentage || 0))
  },
  {
    id: 'first_lesson_done',
    title: 'Bước Đầu Tiên',
    chineseTitle: '千里之行',
    category: 'exam_excellence',
    icon: '🚀',
    description: 'Hoàn thành bài học đầu tiên trong hành trình Hanzigo.',
    checkUnlock: (stats) => (stats.completedLessonsTotal || 0) >= 1,
    progress: (stats) => ((stats.completedLessonsTotal || 0) >= 1 ? 100 : 0)
  },
  {
    id: 'vocab_500_club',
    title: 'Túi Gấm 500 Từ',
    chineseTitle: '词汇五百',
    category: 'exam_excellence',
    icon: '🎒',
    description: 'Tích lũy ghi nhớ 500 từ vựng tiếng Trung vào kho từ cá nhân.',
    checkUnlock: (stats) => (stats.vocabRememberedTotal || 0) >= 500,
    progress: (stats) => Math.min(100, Math.round(((stats.vocabRememberedTotal || 0) / 500) * 100))
  },
  {
    id: 'speed_demon_listener',
    title: 'Đôi Tai Vàng',
    chineseTitle: '顺风之耳',
    category: 'exam_excellence',
    icon: '🎧',
    description: 'Hoàn thành 30 bài luyện nghe Step 5 đạt độ chính xác trên 90%.',
    checkUnlock: (stats) => (stats.highAccuracyListeningCount || 0) >= 30,
    progress: (stats) => Math.min(100, Math.round(((stats.highAccuracyListeningCount || 0) / 30) * 100))
  }
];

/**
 * Đánh giá toàn bộ 18 huy hiệu dựa trên dữ liệu người dùng thực tế
 */
export function evaluateAcademicBadges(userStats = {}) {
  return ACHIEVEMENT_BADGES.map(badge => {
    const isUnlocked = Boolean(badge.checkUnlock(userStats));
    const progress = isUnlocked ? 100 : Math.max(0, Math.min(99, badge.progress(userStats) || 0));

    return {
      id: badge.id,
      title: badge.title,
      chineseTitle: badge.chineseTitle,
      category: badge.category,
      icon: badge.icon,
      description: badge.description,
      isUnlocked,
      progress
    };
  });
}
