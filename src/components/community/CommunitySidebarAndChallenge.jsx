import React from 'react';
import { Flame, Trophy, Award, ArrowRight, Crown, Users, Plus } from 'lucide-react';
import ChineseChallengeCard from '../learning/ChineseChallengeCard';
import { playClickSound } from '../../utils/audio';
import { awardXp } from '../../utils/gamification';

export function CommunityChallengeView({
  user,
  challengeData,
  isCheckedInToday,
  handleJoinChallenge,
  handleCheckIn,
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <ChineseChallengeCard user={user} onAddXp={awardXp} />
        </div>

        <div className="md:col-span-4 space-y-6">
          {/* Challenge Check-in summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                <Flame size={16} className="text-[#E85D3F]" />
                <span>Hành Trình 21 Ngày</span>
              </h3>
              <span className="text-xs font-bold text-[#45B97C]">
                Ngày {challengeData.checkIns || 0}/21
              </span>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              Duy trì việc học ít nhất 15 phút mỗi ngày để tạo thói quen bền vững và rèn luyện phản xạ ngôn ngữ.
            </p>

            <div className="w-full h-2.5 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div
                className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round(((challengeData.checkIns || 0) / 21) * 100))}%` }}
              />
            </div>

            {!challengeData.joined ? (
              <button
                onClick={handleJoinChallenge}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                Bắt đầu thử thách (+20 XP)
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={isCheckedInToday}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isCheckedInToday
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
                    : 'bg-[#45B97C] hover:bg-[#3AA56E] text-white'
                }`}
              >
                {isCheckedInToday ? '✓ Đã điểm danh hôm nay' : '🔥 Điểm danh ngày hôm nay (+15 XP)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommunityRightSidebar({
  user,
  rankTier,
  currentStreak,
  totalUserXp,
  completedLessonsCount,
  studyPartnersCount,
  setCommunityView,
  onOpenPartnerModal,
}) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* 1. Real Learner Progress & Milestones */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Trophy size={16} className="text-[#F4B942]" />
            <span>Thành tích của bạn</span>
          </h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${rankTier.bg} ${rankTier.color}`}>
            {rankTier.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center gap-1.5 text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
              <Flame size={14} className="text-[#E85D3F]" />
              <span>Chuỗi ngày</span>
            </div>
            <div className="text-lg font-black text-[#243447] dark:text-white mt-1">
              {currentStreak} ngày
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center gap-1.5 text-xs text-[#748092] dark:text-[#94A3B8] font-semibold">
              <Award size={14} className="text-[#F4B942]" />
              <span>Tổng điểm XP</span>
            </div>
            <div className="text-lg font-black text-[#E85D3F] mt-1">
              {totalUserXp} XP
            </div>
          </div>
        </div>

        {/* Next tier progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#748092] dark:text-[#94A3B8]">Mục tiêu kế tiếp:</span>
            <span className="text-[#243447] dark:text-white">{rankTier.next}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FFF9F2] dark:bg-[#131B24] overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div
              className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, rankTier.progress))}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-[#748092] dark:text-[#94A3B8] flex items-center justify-between pt-1">
          <span>Đã hoàn thành: {completedLessonsCount} bài học</span>
          <span className="text-[#45B97C] font-semibold">Duy trì đều đặn!</span>
        </div>
      </div>

      {/* 2. Mini XP Leaderboard Teaser Widget */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white border border-white/10 shadow-sm space-y-2.5 sm:space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
            <Trophy size={14} className="text-amber-400" />
            <span>Bảng Xếp Hạng XP</span>
          </span>
          <button
            onClick={() => {
              playClickSound();
              setCommunityView('leaderboard');
            }}
            className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Xem Top 50</span>
            <ArrowRight size={12} />
          </button>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          Bạn đang có <span className="font-mono font-bold text-amber-300">{totalUserXp.toLocaleString()} XP</span>. Hãy thi đua cùng các học viên khác để ghi tên lên bục vinh quang!
        </p>
        <button
          onClick={() => {
            playClickSound();
            setCommunityView('leaderboard');
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Crown size={14} />
          <span>Xem Bảng Xếp Hạng Chi Tiết</span>
        </button>
      </div>

      {/* 3. Real Interactive Chinese Daily Challenge */}
      <ChineseChallengeCard user={user} onAddXp={awardXp} />

      {/* 4. Mini Study Partner Call 1-1 Widget */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Users size={16} className="text-[#45B97C]" />
            <span>Tìm bạn luyện nói 1-1</span>
          </h3>
          <button
            onClick={() => {
              playClickSound();
              setCommunityView('partners');
            }}
            className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
          Hiện có <strong className="text-[#243447] dark:text-white">{studyPartnersCount} học viên</strong> đang tìm bạn ghép đôi luyện khẩu ngữ.
        </p>

        <button
          onClick={() => {
            playClickSound();
            onOpenPartnerModal();
          }}
          className="w-full py-2.5 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          <span>Đăng tin tìm bạn ngay</span>
        </button>
      </div>
    </div>
  );
}
