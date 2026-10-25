import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getLocalDateStringInTz,
  getCalendarDaysDiff,
  calculateStreakUpdate,
  SCHOLAR_RANKS,
  calculateScholarRank,
  ACHIEVEMENT_BADGES,
  evaluateAcademicBadges
} from '../src/utils/gamificationEngine.js';

describe('Gamification Engine - Timezone Streak & Freezes', () => {
  it('calculates calendar difference accurately without DST drift', () => {
    assert.strictEqual(getCalendarDaysDiff('2026-10-20', '2026-10-20'), 0);
    assert.strictEqual(getCalendarDaysDiff('2026-10-20', '2026-10-21'), 1);
    assert.strictEqual(getCalendarDaysDiff('2026-10-20', '2026-10-22'), 2);
    assert.strictEqual(getCalendarDaysDiff('2026-10-20', '2026-10-25'), 5);
  });

  it('increments streak on consecutive days', () => {
    // Ngày 1
    const day1 = calculateStreakUpdate({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      streakFreezes: 1,
      today: '2026-10-20'
    });
    assert.strictEqual(day1.currentStreak, 1);
    assert.strictEqual(day1.longestStreak, 1);
    assert.strictEqual(day1.freezeUsed, false);

    // Ngày 2
    const day2 = calculateStreakUpdate({
      currentStreak: day1.currentStreak,
      longestStreak: day1.longestStreak,
      lastActiveDate: day1.lastActiveDate,
      streakFreezes: day1.streakFreezes,
      today: '2026-10-21'
    });
    assert.strictEqual(day2.currentStreak, 2);
    assert.strictEqual(day2.longestStreak, 2);

    // Ngày 3
    const day3 = calculateStreakUpdate({
      currentStreak: day2.currentStreak,
      longestStreak: day2.longestStreak,
      lastActiveDate: day2.lastActiveDate,
      streakFreezes: day2.streakFreezes,
      today: '2026-10-22'
    });
    assert.strictEqual(day3.currentStreak, 3);
    assert.strictEqual(day3.longestStreak, 3);
  });

  it('maintains streak on the same calendar day without double increment', () => {
    const firstStudy = calculateStreakUpdate({
      currentStreak: 5,
      longestStreak: 10,
      lastActiveDate: '2026-10-20',
      streakFreezes: 2,
      today: '2026-10-21'
    });
    assert.strictEqual(firstStudy.currentStreak, 6);

    const secondStudySameDay = calculateStreakUpdate({
      currentStreak: firstStudy.currentStreak,
      longestStreak: firstStudy.longestStreak,
      lastActiveDate: firstStudy.lastActiveDate,
      streakFreezes: firstStudy.streakFreezes,
      today: '2026-10-21'
    });
    assert.strictEqual(secondStudySameDay.currentStreak, 6);
    assert.strictEqual(secondStudySameDay.freezeUsed, false);
    assert.strictEqual(secondStudySameDay.status, 'maintained_same_day');
  });

  it('activates Streak Freeze when learner skips 1 day (diff = 2) and preserves streak', () => {
    const result = calculateStreakUpdate({
      currentStreak: 15,
      longestStreak: 20,
      lastActiveDate: '2026-10-20', // Nghỉ ngày 21, học lại ngày 22 (diff = 2)
      streakFreezes: 1,
      today: '2026-10-22'
    });

    assert.strictEqual(result.freezeUsed, true);
    assert.strictEqual(result.streakFreezes, 0); // Đã dùng 1 freeze
    assert.strictEqual(result.currentStreak, 16); // Được bảo vệ và tăng thêm ngày học hôm nay
    assert.strictEqual(result.status, 'freeze_saved');
  });

  it('resets streak to 1 if skipped day and streakFreezes = 0', () => {
    const result = calculateStreakUpdate({
      currentStreak: 15,
      longestStreak: 20,
      lastActiveDate: '2026-10-20',
      streakFreezes: 0,
      today: '2026-10-22'
    });

    assert.strictEqual(result.freezeUsed, false);
    assert.strictEqual(result.currentStreak, 1);
    assert.strictEqual(result.longestStreak, 20); // Vẫn lưu kỷ lục cao nhất
    assert.strictEqual(result.status, 'reset_to_one');
  });

  it('resets streak to 1 if skipped 2 consecutive days (diff = 3) even if 1 freeze available', () => {
    const result = calculateStreakUpdate({
      currentStreak: 25,
      longestStreak: 25,
      lastActiveDate: '2026-10-20',
      streakFreezes: 1,
      today: '2026-10-23' // Cách 3 ngày
    });

    assert.strictEqual(result.currentStreak, 1);
    assert.strictEqual(result.streakFreezes, 1); // Không tiêu tốn freeze vô nghĩa
    assert.strictEqual(result.status, 'reset_to_one');
  });
});

describe('Gamification Engine - Scholar Ranks', () => {
  it('has 10 distinct scholar ranks with increasing minXp', () => {
    assert.strictEqual(SCHOLAR_RANKS.length, 10);
    for (let i = 1; i < SCHOLAR_RANKS.length; i++) {
      assert.ok(SCHOLAR_RANKS[i].minXp > SCHOLAR_RANKS[i - 1].minXp);
    }
  });

  it('correctly maps XP to rank and calculates progress to next rank', () => {
    // 0 XP -> Rank 1 Nhập Môn
    const rank0 = calculateScholarRank(0);
    assert.strictEqual(rank0.level, 1);
    assert.strictEqual(rank0.title, 'Nhập Môn Học Đồng');
    assert.strictEqual(rank0.progressPercent, 0);
    assert.strictEqual(rank0.xpToNext, 300);

    // 150 XP -> Rank 1, 50%
    const rank150 = calculateScholarRank(150);
    assert.strictEqual(rank150.level, 1);
    assert.strictEqual(rank150.progressPercent, 50);
    assert.strictEqual(rank150.xpToNext, 150);

    // 7500 XP -> Rank 6 Tiến Sĩ Hán Học
    const rank7500 = calculateScholarRank(7500);
    assert.strictEqual(rank7500.level, 6);
    assert.strictEqual(rank7500.title, 'Tiến Sĩ Hán Học');
    assert.strictEqual(rank7500.nextRankTitle, 'Thám Hoa Văn Nhã');

    // 70000 XP -> Rank 10 Đại Tông Sư (Max)
    const rankMax = calculateScholarRank(70000);
    assert.strictEqual(rankMax.level, 10);
    assert.strictEqual(rankMax.title, 'Đại Tông Sư');
    assert.strictEqual(rankMax.progressPercent, 100);
    assert.strictEqual(rankMax.xpToNext, 0);
  });
});

describe('Gamification Engine - 18 Academic Badges', () => {
  it('defines exactly 18 academic badges across 4 categories', () => {
    assert.strictEqual(ACHIEVEMENT_BADGES.length, 18);
    const categories = new Set(ACHIEVEMENT_BADGES.map(b => b.category));
    assert.ok(categories.has('streak'));
    assert.ok(categories.has('hsk_milestone'));
    assert.ok(categories.has('skill_depth'));
    assert.ok(categories.has('exam_excellence'));
  });

  it('correctly unlocks badges based on deterministic user statistics', () => {
    const emptyStats = {};
    const evaluatedEmpty = evaluateAcademicBadges(emptyStats);
    assert.strictEqual(evaluatedEmpty.filter(b => b.isUnlocked).length, 0);

    const fullStats = {
      longestStreak: 35,
      hskGraduations: {
        'HSK 1': true,
        'HSK 2': true
      },
      highScoreWritingCharsCount: 55,
      matureSrsCardsCount: 320,
      smartReaderCompletedCount: 12,
      roleplayFullMissionsCount: 10,
      hasPerfectExamScore: true,
      completedLessonsTotal: 45,
      vocabRememberedTotal: 600,
      highAccuracyListeningCount: 35
    };

    const evaluated = evaluateAcademicBadges(fullStats);
    
    // Check specific badges
    const streak3 = evaluated.find(b => b.id === 'streak_3_days');
    assert.strictEqual(streak3.isUnlocked, true);
    assert.strictEqual(streak3.progress, 100);

    const streak100 = evaluated.find(b => b.id === 'streak_100_days');
    assert.strictEqual(streak100.isUnlocked, false);
    assert.strictEqual(streak100.progress, 35); // 35 / 100

    const hsk1 = evaluated.find(b => b.id === 'hsk1_master');
    assert.strictEqual(hsk1.isUnlocked, true);

    const hsk3 = evaluated.find(b => b.id === 'hsk3_master');
    assert.strictEqual(hsk3.isUnlocked, false);

    const calligraphy = evaluated.find(b => b.id === 'calligraphy_master');
    assert.strictEqual(calligraphy.isUnlocked, true);

    const perfectExam = evaluated.find(b => b.id === 'perfect_mock_exam');
    assert.strictEqual(perfectExam.isUnlocked, true);
  });
});
