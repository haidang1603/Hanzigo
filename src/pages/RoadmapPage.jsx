import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  BarChart3, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import LearningJourneyMap from '../components/learning/LearningJourneyMap';
import InteractiveLessonPlayer from '../components/learning/InteractiveLessonPlayer';
import BossChallengeModal from '../components/learning/BossChallengeModal';
import PlacementTestModal from '../components/learning/PlacementTestModal';
import DailyMissionsModal from '../components/learning/DailyMissionsModal';
import SkillMasteryCard from '../components/learning/SkillMasteryCard';
import { getLessonById, getUserJourneyProgress } from '../services/learningPathService';

export default function RoadmapPage({ user, setActiveTab, onSelectLesson, onAddXp }) {
  const [roadmapView, setRoadmapView] = useState('journey'); // 'journey' | 'skills'
  const [activeLessonToPlay, setActiveLessonToPlay] = useState(null);
  const [activeBossChallenge, setActiveBossChallenge] = useState(null);
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showDailyMissions, setShowDailyMissions] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const progress = getUserJourneyProgress(user);
  const totalCompletedLessons = Object.keys(progress.completedLessons || {}).length;
  const totalCompletedBosses = Object.keys(progress.completedBosses || {}).length;

  // 1. IMMERSIVE LESSON VIEW: If a lesson is being played, render directly on screen
  if (activeLessonToPlay) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF9F2] dark:bg-[#131B24] animate-in fade-in duration-200">
        <InteractiveLessonPlayer
          lesson={activeLessonToPlay}
          user={user}
          onClose={() => {
            setActiveLessonToPlay(null);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onBack={() => {
            setActiveLessonToPlay(null);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onCompleteLesson={(score, stars) => {
            playSuccessSound();
            showToast(`🎉 Xuất sắc! Bạn đã hoàn thành bài học với ${score} điểm (${stars} sao)`);
            if (onAddXp) onAddXp(activeLessonToPlay.xpReward || 50);
          }}
          onNextLesson={(nextId) => {
            const next = getLessonById(nextId);
            if (next) {
              setActiveLessonToPlay(next);
            } else {
              setActiveLessonToPlay(null);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-[#E85D3F] text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toast}</p>
        </div>
      )}

      {/* Page Header Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#243447] via-[#1E293B] to-[#0F172A] text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30 text-xs font-bold">
              <Sparkles size={14} />
              <span>Khung Chuẩn HSK 3.0 Quốc Tế (Chinese Test)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Noto_Serif_SC'] tracking-tight">
              Lộ Trình Học Tiếng Trung HSK 3.0
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Hành trình sư phạm 7 chặng từ HSK 1 đến HSK 6 (+ HSK 7-9) chuẩn hóa theo 5 trụ cột HSK 3.0: Nhiệm vụ giao tiếp thực tế, chủ đề sinh hoạt, từ vựng, ngữ pháp và chữ Hán.
            </p>

            {/* Real KPI stats from user's authentic progress */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                🎯 <strong>24</strong> Chương học & Boss thực chiến
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                ✅ <strong>{totalCompletedLessons}</strong> bài học đã hoàn thành
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-medium backdrop-blur-sm">
                🏆 <strong>{totalCompletedBosses}</strong> Boss khảo hạch đã hạ gục
              </span>
            </div>
          </div>

          {/* Quick Access Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowPlacementTest(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#F4B942] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Compass size={18} />
              <span>Kiểm tra & Xếp lớp HSK</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setShowDailyMissions(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar size={15} />
              <span>Nhiệm vụ hàng ngày</span>
            </button>
          </div>
        </div>

        {/* Decorative Chinese watermark */}
        <div className="absolute right-4 -bottom-6 font-['Noto_Serif_SC'] text-9xl font-black text-white/5 select-none pointer-events-none">
          登攀
        </div>
      </div>

      {/* 2 Focused View Tabs Switcher */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm max-w-md mx-auto">
        <button
          type="button"
          onClick={() => { playClickSound(); setRoadmapView('journey'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            roadmapView === 'journey'
              ? 'bg-[#E85D3F] text-white shadow-xs'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Compass size={15} />
          <span>Bản đồ hành trình HSK</span>
        </button>
        <button
          type="button"
          onClick={() => { playClickSound(); setRoadmapView('skills'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            roadmapView === 'skills'
              ? 'bg-[#E85D3F] text-white shadow-xs'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <BarChart3 size={15} />
          <span>Phân tích kỹ năng thực tế</span>
        </button>
      </div>

      {/* VIEW 1: 🗺️ JOURNEY MAP (Default interactive HSK roadmap) */}
      {roadmapView === 'journey' && (
        <LearningJourneyMap
          user={user}
          onSelectLesson={(lesson) => setActiveLessonToPlay(lesson)}
          onOpenBoss={(boss) => setActiveBossChallenge(boss)}
          onOpenPlacementTest={() => setShowPlacementTest(true)}
          onOpenDailyMissions={() => setShowDailyMissions(true)}
          onOpenSkills={() => setRoadmapView('skills')}
          onLockedClick={(lesson) => {
            playErrorSound();
            showToast(`🔒 Bài học "${lesson.title}" đang khóa. Hoàn thành bài trước hoặc làm bài Test để mở khóa!`);
          }}
        />
      )}

      {/* VIEW 2: 📊 REAL SKILL MASTERY & DAILY MISSIONS */}
      {roadmapView === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            <SkillMasteryCard user={user} onNavigateTab={setActiveTab} />
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center mx-auto text-2xl">
                🔥
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Nhiệm vụ hàng ngày
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Duy trì streak và nhận rương hoàn thành ngày +100 XP
                </p>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); setShowDailyMissions(true); }}
                className="w-full py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Mở bảng nhiệm vụ ngày</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BOSS CHALLENGE ROLEPLAY BATTLE */}
      {activeBossChallenge && (
        <BossChallengeModal
          bossChallenge={activeBossChallenge}
          user={user}
          onClose={() => setActiveBossChallenge(null)}
          onVictory={(score) => {
            playSuccessSound();
            showToast(`🐉 Chiến thắng vang dội! Bạn đã hạ gục Boss với ${score} điểm!`);
            if (onAddXp) onAddXp(activeBossChallenge.xpReward || 200);
          }}
        />
      )}

      {/* MODAL 3: DIAGNOSTIC PLACEMENT TEST */}
      {showPlacementTest && (
        <PlacementTestModal
          user={user}
          onClose={() => setShowPlacementTest(false)}
          onComplete={(result) => {
            playSuccessSound();
            showToast(`🎉 Xếp lớp thành công! Trình độ đề xuất: ${result.badge}`);
          }}
        />
      )}

      {/* MODAL 4: DAILY MISSIONS & STREAK REWARDS */}
      {showDailyMissions && (
        <DailyMissionsModal
          user={user}
          onClose={() => setShowDailyMissions(false)}
          onAddXp={onAddXp}
        />
      )}

    </div>
  );
}
