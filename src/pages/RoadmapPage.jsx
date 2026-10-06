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

      {/* Streamlined, Elegant Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] text-[11px] font-bold">
              <Sparkles size={12} />
              <span>Khung Chuẩn HSK 3.0</span>
            </span>
            <span className="text-xs text-[#748092] dark:text-[#94A3B8]">
              • 24 Chương học & Boss thực chiến
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white tracking-tight">
            Lộ Trình Học Tiếng Trung HSK 3.0
          </h1>
          
          <div className="flex items-center gap-3 text-xs text-[#748092] dark:text-[#94A3B8]">
            <span>✅ <strong>{totalCompletedLessons}</strong> bài hoàn thành</span>
            <span>•</span>
            <span>🏆 <strong>{totalCompletedBosses}</strong> Boss hạ gục</span>
          </div>
        </div>

        {/* Action Buttons & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              type="button"
              onClick={() => { playClickSound(); setRoadmapView('journey'); }}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                roadmapView === 'journey'
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>Bản đồ HSK</span>
            </button>
            <button
              type="button"
              onClick={() => { playClickSound(); setRoadmapView('skills'); }}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                roadmapView === 'skills'
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <BarChart3 size={14} />
              <span>Kỹ năng</span>
            </button>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowPlacementTest(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Compass size={14} />
            <span>Xếp lớp HSK</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowDailyMissions(true);
            }}
            className="px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#F1E5D8] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Calendar size={14} />
            <span>Nhiệm vụ ngày</span>
          </button>
        </div>
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
