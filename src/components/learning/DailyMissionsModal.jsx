import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Check, 
  X, 
  Gift
} from 'lucide-react';
import { getDailyMissions, claimDailyMission } from '../../services/learningPathService';
import { playSuccessSound, playLevelUpSound } from '../../utils/audio';
import { getUserStorageKey, awardXp, getLocalDateString } from '../../utils/gamification';

export default function DailyMissionsModal({ user, onClose, onRewardClaimed }) {
  const [missions, setMissions] = useState(() => getDailyMissions(user));
  const today = getLocalDateString();
  const chestKey = getUserStorageKey(`hanzigo_chest_${today}`, user);
  
  const [claimedChest, setClaimedChest] = useState(() => {
    try {
      return localStorage.getItem(chestKey) === 'true';
    } catch {
      return false;
    }
  });

  const allCompleted = missions.every(m => m.isCompleted);
  const completedCount = missions.filter(m => m.isCompleted).length;

  const handleClaim = (missionId) => {
    playSuccessSound();
    const { missions: updated, xpAwarded } = claimDailyMission(missionId, user);
    setMissions(updated);
    if (onRewardClaimed) onRewardClaimed(xpAwarded);

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleClaimGrandChest = () => {
    if (!allCompleted || claimedChest) return;
    playLevelUpSound();
    try {
      localStorage.setItem(chestKey, 'true');
    } catch {}
    setClaimedChest(true);
    awardXp(100, user, `grand_chest_${today}`);
    if (onRewardClaimed) onRewardClaimed(100);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
  };

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0: Mon, 6: Sun

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-7 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
              <Flame size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#243447] dark:text-white">
                Nhiệm vụ hàng ngày (今日任务)
              </h3>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                Hoàn thành tất cả để nhận Rương kho báu +100 XP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* 7-Day Streak Calendar */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#243447] dark:text-white flex items-center gap-1.5">
              <Flame size={14} className="text-[#E85D3F]" />
              <span>Chuỗi 7 ngày học tập tuần này</span>
            </span>
            <span className="text-[#E85D3F]">{user?.streak || 1} ngày liên tiếp</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayDayIndex;
              return (
                <div
                  key={day}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold border transition-all ${
                    idx === todayDayIndex
                      ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-xs'
                      : isPastOrToday
                      ? 'bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] border-[#45B97C]'
                      : 'bg-white dark:bg-[#1E293B] text-[#748092] border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <span className="text-[9px] opacity-75">{day}</span>
                  {isPastOrToday ? <Check size={11} strokeWidth={3} /> : '•'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Missions list */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {missions.map(m => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                m.isCompleted
                  ? 'bg-[#EBF8F2]/50 dark:bg-[#162B21]/30 border-[#45B97C]/30'
                  : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{m.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#243447] dark:text-white truncate">
                    {m.title}
                  </h4>
                  {m.reason && (
                    <span className="inline-block text-[9px] font-medium text-[#E85D3F] bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded-md my-0.5 max-w-full truncate">
                      🎯 {m.reason}
                    </span>
                  )}
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
                    Tiến độ: <span className="font-mono font-bold text-[#E85D3F]">{m.current}/{m.target}</span> • +{m.xp} XP
                  </p>
                </div>
              </div>

              {m.isClaimed ? (
                <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-[#748092]">
                  Đã nhận
                </span>
              ) : m.isCompleted ? (
                <button
                  type="button"
                  onClick={() => handleClaim(m.id)}
                  className="px-3 py-1 rounded-lg bg-[#45B97C] hover:bg-[#3AA56E] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 animate-pulse"
                >
                  Nhận XP
                </button>
              ) : (
                <span className="text-[11px] font-bold text-[#748092] shrink-0">
                  Chưa xong
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Daily Completion Grand Chest */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Gift size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#243447] dark:text-white">
                Rương hoàn thành ngày
              </h4>
              <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">
                {completedCount}/5 nhiệm vụ hoàn thành • Thưởng +100 XP
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!allCompleted || claimedChest}
            onClick={handleClaimGrandChest}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              claimedChest
                ? 'bg-gray-200 dark:bg-gray-700 text-[#748092] cursor-default'
                : allCompleted
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 animate-bounce'
                : 'bg-gray-200 dark:bg-gray-800 text-[#748092] cursor-not-allowed opacity-60'
            }`}
          >
            {claimedChest ? 'Đã mở rương' : 'Mở rương (+100)'}
          </button>
        </div>
      </div>
    </div>
  );
}
