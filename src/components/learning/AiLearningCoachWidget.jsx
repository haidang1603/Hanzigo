import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Brain,
  ShieldCheck,
  ChevronRight,
  Award,
  BookOpen,
  RotateCcw,
  Compass,
  Download,
  ExternalLink
} from 'lucide-react';

import {
  buildStudentLearningProfile,
  detectWeaknesses,
  getAiCoachRecommendation,
  SKILL_KEYS,
  SKILL_LABELS
} from '../../services/aiLearningCoachService';
import { 
  LEARNING_GOALS, 
  getUserLearningGoal, 
  saveUserLearningGoal, 
  getUserDailyGoalMinutes, 
  saveUserDailyGoalMinutes 
} from '../../services/learningPathService';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import PlacementTestModal from './PlacementTestModal';

export default function AiLearningCoachWidget({ user, setActiveTab, onSelectLesson }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [durationMinutes, setDurationMinutes] = useState(() => getUserDailyGoalMinutes(user));
  const [learningGoal, setLearningGoal] = useState(() => getUserLearningGoal(user));
  const [activeTabSub, setActiveTabSub] = useState('plan'); // 'plan' | 'review' | 'skills' | 'weaknesses' | 'materials'
  const [showPlacementModal, setShowPlacementModal] = useState(false);

  // Load coach recommendation
  const loadCoachRecommendation = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const currentProfile = buildStudentLearningProfile(user);
      setProfile(currentProfile);

      const res = await getAiCoachRecommendation(user, { 
        forceRefresh, 
        durationMinutes,
        learningGoal
      });
      if (res && res.data) {
        setCoachData(res.data);
      }
    } catch (err) {
      console.warn('Error loading AI Coach recommendation:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, durationMinutes, learningGoal]);

  useEffect(() => {
    loadCoachRecommendation(false);
  }, [loadCoachRecommendation]);

  // Load completed steps from localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`hanzigo_coach_steps_${today}`);
      if (saved) setCompletedSteps(JSON.parse(saved));
    } catch {}
  }, []);

  const handleToggleStep = (stepId) => {
    playClickSound();
    setCompletedSteps(prev => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      if (next[stepId]) playSuccessSound();
      try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`hanzigo_coach_steps_${today}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleNavigateStep = (route, targetRef) => {
    playClickSound();
    if (targetRef === 'placement_test') {
      setShowPlacementModal(true);
      return;
    }
    if (route === 'roadmap' && targetRef && onSelectLesson) {
      onSelectLesson(targetRef);
    } else if (setActiveTab) {
      setActiveTab(route);
    }
  };

  const handleGoalChange = (newGoal) => {
    playClickSound();
    setLearningGoal(newGoal);
    saveUserLearningGoal(newGoal, user);
  };

  const handleDurationChange = (mins) => {
    playClickSound();
    setDurationMinutes(mins);
    saveUserDailyGoalMinutes(mins, user);
  };

  const completedCount = useMemo(() => {
    if (!coachData?.dailyPlan) return 0;
    return coachData.dailyPlan.filter(step => completedSteps[step.id]).length;
  }, [coachData, completedSteps]);

  const totalSteps = coachData?.dailyPlan?.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const nextLesson = coachData?.recommendedNextLesson || profile?.nextLesson;
  const reviewLessons = coachData?.recommendedReviewLessons || profile?.reviewLessons || [];
  const recommendedMaterials = coachData?.recommendedMaterials || [];
  const activeGoalDetails = LEARNING_GOALS[learningGoal] || LEARNING_GOALS.general_foundation;

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E85D3F]/20" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-3 w-64 bg-gray-100 dark:bg-gray-800 rounded-md" />
          </div>
        </div>
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-[#FFF9F2] to-white dark:from-[#1E293B] dark:via-[#16202C] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-md space-y-6">
      
      {/* 1. Header Bar: Coach Identity & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white flex items-center justify-center text-xl shadow-md shadow-[#E85D3F]/20">
              👨‍🏫
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#45B97C] border-2 border-white dark:border-[#1E293B] flex items-center justify-center text-[10px] text-white" title="Trí tuệ nhân tạo đang sẵn sàng">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-[#243447] dark:text-white">
                Lão Sư HanziGo
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E85D3F]/10 text-[#E85D3F] uppercase tracking-wider">
                AI Learning Coach
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                {activeGoalDetails.shortName}
              </span>
            </div>
            <p className="text-xs text-[#748092] dark:text-gray-400">
              Lộ trình cá nhân hóa dựa trên dữ liệu học tập thực tế
            </p>
          </div>
        </div>

        {/* Goal & Duration Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-auto">
          {/* Goal Selector */}
          <div className="relative">
            <select
              value={learningGoal}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none cursor-pointer shadow-xs"
            >
              {Object.values(LEARNING_GOALS).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center bg-[#F1E5D8]/50 dark:bg-[#131B24] p-1 rounded-xl text-xs font-bold text-[#748092]">
            {[10, 15, 20, 30, 45].map(mins => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                    : 'hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {mins}p
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadCoachRecommendation(true)}
            disabled={refreshing}
            title="Làm mới khuyến nghị"
            className="p-2 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#E85D3F]' : ''} />
          </button>
        </div>
      </div>

      {/* 2. New Learner / Sparse Data Guidance Banner */}
      {profile?.hasSparseData && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/40 space-y-3">
          <div className="flex items-start gap-3">
            <Compass className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-blue-900 dark:text-blue-100">
                Chào mừng bạn! Chưa có dữ liệu đánh giá đầu vào
              </h4>
              <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                Để AI cá nhân hóa lộ trình phù hợp nhất và không phỏng đoán ngẫu nhiên, bạn hãy làm bài kiểm tra đầu vào (10 câu - 3 phút) hoặc bắt đầu ngay Bài 101.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowPlacementModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Compass size={14} />
              <span>Làm bài kiểm tra đầu vào (3 phút)</span>
            </button>
            <button
              onClick={() => handleNavigateStep('roadmap', 'l-101')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-blue-200 dark:border-blue-700 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <span>Học Bài 101 ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Coach Summary Banner */}
      {coachData?.summary && (
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#131B24]/90 border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-start gap-3 shadow-xs">
          <Sparkles size={18} className="text-[#E85D3F] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-[#243447] dark:text-[#E2E8F0] leading-relaxed">
              {coachData.summary}
            </p>
            {coachData.source === 'offline_heuristic' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#748092]">
                <ShieldCheck size={11} className="text-[#45B97C]" />
                Thuật toán sư phạm ngoại tuyến SM-2 & HSK 3.0 (Không phát sinh chi phí API)
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. Core Recommendations Spotlight Grid (Next Lesson & Critical Review) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Next Lesson */}
        {nextLesson && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between gap-3 shadow-xs hover:border-[#E85D3F]/40 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#45B97C]/10 text-[#45B97C]">
                  Bài học tiếp theo
                </span>
                <span className="text-[11px] font-bold text-[#748092] flex items-center gap-1">
                  <Clock size={11} />
                  {nextLesson.durationMinutes || 18} phút
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#243447] dark:text-white">
                {nextLesson.title}
              </h4>
              <p className="text-[11px] text-[#748092] dark:text-gray-400">
                {nextLesson.chapterTitle || 'Chương trình học chuẩn HSK'}
              </p>
              {nextLesson.reason && (
                <div className="p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <p className="text-[11px] text-[#E85D3F] dark:text-[#F4826B] font-medium leading-relaxed">
                    💡 <strong>Lý do đề xuất:</strong> {nextLesson.reason}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavigateStep('roadmap', nextLesson.lessonId)}
              className="w-full py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Học bài này ngay</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Card: Review Recommendation */}
        {reviewLessons.length > 0 ? (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-amber-200 dark:border-amber-800/40 flex flex-col justify-between gap-3 shadow-xs hover:border-amber-400 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  Cần ôn tập lại
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  Điểm: {reviewLessons[0].score}% ({reviewLessons[0].stars} sao)
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#243447] dark:text-white">
                {reviewLessons[0].title}
              </h4>
              <p className="text-[11px] text-[#748092] dark:text-gray-400">
                {reviewLessons[0].chapterTitle || 'Cần củng cố trước khi làm bài Boss Challenge'}
              </p>
              {reviewLessons[0].reason && (
                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
                  <p className="text-[11px] text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                    💡 <strong>Lý do ôn lại:</strong> {reviewLessons[0].reason}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavigateStep('roadmap', reviewLessons[0].lessonId)}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw size={14} />
              <span>Ôn tập để nâng sao</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between gap-3 shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#45B97C]/10 text-[#45B97C]">
                  Tiến độ ôn tập
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#243447] dark:text-white">
                Chưa có bài nào cần ôn khẩn cấp
              </h4>
              <p className="text-[11px] text-[#748092] dark:text-gray-400 leading-relaxed">
                Các bài đã học của bạn đều đạt kết quả xuất sắc (≥ 90%) hoặc bạn đang học bài đầu tiên. Hãy tập trung cho bài học tiếp theo!
              </p>
            </div>
            <button
              onClick={() => handleNavigateStep('vocabulary')}
              className="w-full py-2 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:text-[#E85D3F] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem thẻ từ vựng SRS</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 5. Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => { playClickSound(); setActiveTabSub('plan'); }}
          className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'plan'
              ? 'border-[#E85D3F] text-[#E85D3F]'
              : 'border-transparent text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Target size={14} />
          <span>Kế hoạch Hôm nay ({completedCount}/{totalSteps})</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTabSub('review'); }}
          className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'review'
              ? 'border-[#E85D3F] text-[#E85D3F]'
              : 'border-transparent text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <RotateCcw size={14} />
          <span>Bài cần ôn lại ({reviewLessons.length})</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTabSub('skills'); }}
          className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'skills'
              ? 'border-[#E85D3F] text-[#E85D3F]'
              : 'border-transparent text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Brain size={14} />
          <span>Năng lực 7 kỹ năng</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTabSub('weaknesses'); }}
          className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'weaknesses'
              ? 'border-[#E85D3F] text-[#E85D3F]'
              : 'border-transparent text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <AlertTriangle size={14} />
          <span>Lỗ hổng cần vá ({coachData?.weaknesses?.length || 0})</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTabSub('materials'); }}
          className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'materials'
              ? 'border-[#E85D3F] text-[#E85D3F]'
              : 'border-transparent text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <BookOpen size={14} />
          <span>Tài liệu đề xuất ({recommendedMaterials.length})</span>
        </button>
      </div>

      {/* 6. Tab Content 1: TODAY'S LEARNING PLAN */}
      {activeTabSub === 'plan' && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span>Tiến độ hoàn thành kế hoạch {durationMinutes} phút</span>
              <span className="text-[#E85D3F] font-mono">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-[#F1E5D8] dark:bg-[#131B24] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E85D3F] to-[#45B97C] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2.5">
            {coachData?.dailyPlan?.map((step, idx) => {
              const isDone = Boolean(completedSteps[step.id]);
              return (
                <div
                  key={step.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-[#EBF8F2]/60 dark:bg-[#162B21]/40 border-[#45B97C]/30 opacity-90'
                      : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleStep(step.id)}
                      className="mt-0.5 text-[#748092] hover:text-[#45B97C] transition-colors cursor-pointer shrink-0"
                      title={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} className="text-[#45B97C]" />
                      ) : (
                        <Circle size={20} className="text-gray-300 dark:text-gray-600" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-extrabold ${isDone ? 'line-through text-[#748092]' : 'text-[#243447] dark:text-white'}`}>
                          {step.title}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1E5D8]/60 dark:bg-[#131B24] text-[#748092]">
                          <Clock size={10} />
                          {step.durationMinutes} phút
                        </span>
                      </div>
                      <p className="text-[11px] text-[#748092] dark:text-gray-400 line-clamp-1">
                        {step.subtitle}
                      </p>
                      {step.reason && (
                        <p className="text-[10px] text-[#E85D3F] dark:text-[#F4826B] font-medium flex items-center gap-1">
                          <span>💡 Căn cứ:</span>
                          <span className="italic">{step.reason}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleNavigateStep(step.route, step.targetRef)}
                      className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Thực hiện</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Tab Content 2: REVIEW LESSONS LIST */}
      {activeTabSub === 'review' && (
        <div className="space-y-3">
          <p className="text-xs text-[#748092] dark:text-gray-400">
            Hệ thống tự động phát hiện các bài học có điểm thi trắc nghiệm dưới 90% (chưa đạt chuẩn thuần thục 3 sao) hoặc đã hoàn thành quá 7 ngày để đề xuất bạn ôn tập lại.
          </p>

          {reviewLessons.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-center space-y-2">
              <Award size={28} className="text-[#45B97C] mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-[#45B97C]">
                Không có bài học nào cần ôn tập khẩn cấp!
              </p>
              <p className="text-xs text-[#748092]">
                Bạn đã hoàn thành xuất sắc các bài học trước đó với điểm số cao. Hãy tiếp tục tiến tới bài học mới.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewLessons.map((item, idx) => (
                <div
                  key={item.lessonId || idx}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-[#243447] dark:text-white">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        {item.score}% ({item.stars} sao)
                      </span>
                    </div>
                    <p className="text-xs text-[#748092] dark:text-gray-300">
                      {item.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigateStep('roadmap', item.lessonId)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-end sm:self-auto"
                  >
                    <RotateCcw size={13} />
                    <span>Ôn lại ngay</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. Tab Content 3: 7-SKILL PROFICIENCY BREAKDOWN */}
      {activeTabSub === 'skills' && (
        <div className="space-y-3">
          <p className="text-xs text-[#748092] dark:text-gray-400">
            Điểm số năng lực được suy luận từ lịch sử học tập thực tế (SRS, bài kiểm tra, phát âm qua mic). Nếu bạn chưa thực hành kỹ năng nào, hệ thống hiển thị <strong className="text-[#243447] dark:text-white">"Chưa đủ dữ liệu"</strong> thay vì tạo điểm ảo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {SKILL_KEYS.map(key => {
              const skillInfo = profile?.skills?.[key];
              const hasData = skillInfo?.hasEnoughData && skillInfo?.score !== null;

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#243447] dark:text-white">
                      {SKILL_LABELS[key] || key}
                    </span>
                    {hasData ? (
                      <span className="text-[#E85D3F] font-mono font-black">
                        {skillInfo.score}/100
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500">
                        Chưa đủ dữ liệu
                      </span>
                    )}
                  </div>

                  <div className="h-1.5 w-full bg-[#F1E5D8] dark:bg-[#131B24] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        hasData
                          ? skillInfo.score >= 80 ? 'bg-[#45B97C]' : (skillInfo.score >= 60 ? 'bg-amber-400' : 'bg-[#E85D3F]')
                          : 'bg-transparent'
                      }`}
                      style={{ width: `${hasData ? skillInfo.score : 0}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-[#748092] flex items-center justify-between">
                    <span>{skillInfo?.statusText || 'Bắt đầu luyện tập để đo lường'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. Tab Content 4: DETECTED WEAKNESSES & REMEDIATION */}
      {activeTabSub === 'weaknesses' && (
        <div className="space-y-3">
          {(!coachData?.weaknesses || coachData.weaknesses.length === 0) ? (
            <div className="p-6 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-center space-y-2">
              <Award size={28} className="text-[#45B97C] mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-[#45B97C]">
                Không phát hiện lỗ hổng kiến thức nghiêm trọng!
              </p>
              <p className="text-xs text-[#748092]">
                Các kỹ năng của bạn đang phát triển đồng đều. Hãy tiếp tục duy trì đà học tập mỗi ngày.
              </p>
            </div>
          ) : (
            coachData.weaknesses.map((w, i) => {
              const isHigh = w.severity === 'high';
              return (
                <div
                  key={w.id || i}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isHigh
                      ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                      : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        isHigh ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}>
                        {isHigh ? 'Ưu tiên cao' : 'Cần lưu ý'}
                      </span>
                      <span className="text-xs font-bold text-[#243447] dark:text-white">
                        {w.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#748092] dark:text-gray-300">
                      {w.detail}
                    </p>
                    {w.suggestedAction && (
                      <p className="text-[11px] font-semibold text-[#E85D3F]">
                        👉 Giải pháp: {w.suggestedAction}
                      </p>
                    )}
                  </div>

                  {w.targetRoute && (
                    <button
                      onClick={() => handleNavigateStep(w.targetRoute, w.actionType === 'placement_test' ? 'placement_test' : null)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors shrink-0 flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                    >
                      <span>Khắc phục</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 10. Tab Content 5: RECOMMENDED MATERIALS FROM MATERIALS */}
      {activeTabSub === 'materials' && (
        <div className="space-y-3">
          <p className="text-xs text-[#748092] dark:text-gray-400">
            Tài liệu học thuật được AI tuyển chọn từ Thư viện Materials, khớp chuẩn với trình độ {profile?.hskLevel || 'HSK 1'}, mục tiêu "{activeGoalDetails.name}" và các kỹ năng cần bổ trợ của bạn.
          </p>

          <div className="space-y-3">
            {recommendedMaterials.map((mat, idx) => (
              <div
                key={mat.id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#E85D3F]/40 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E85D3F]/10 text-[#E85D3F]">
                      {mat.category || 'Tài liệu'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-[#748092]">
                      {mat.level || 'Tất cả'}
                    </span>
                    <span className="text-[11px] font-bold text-[#748092]">
                      {mat.format}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#243447] dark:text-white line-clamp-1">
                    {mat.title}
                  </h4>
                  {mat.reason && (
                    <p className="text-[11px] text-[#E85D3F] dark:text-[#F4826B] font-medium leading-relaxed">
                      💡 <strong>Lý do đề xuất:</strong> {mat.reason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {mat.downloadUrl && mat.downloadUrl.startsWith('http') ? (
                    <a
                      href={mat.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:text-[#E85D3F] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mở link</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : null}
                  <button
                    onClick={() => setActiveTab && setActiveTab('materials')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Vào Thư viện</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placement Test Modal (for cold-start new learners) */}
      {showPlacementModal && (
        <PlacementTestModal
          user={user}
          onClose={() => setShowPlacementModal(false)}
          onTestCompleted={() => {
            setShowPlacementModal(false);
            loadCoachRecommendation(true);
          }}
          onComplete={() => {
            setShowPlacementModal(false);
            loadCoachRecommendation(true);
          }}
        />
      )}

    </div>
  );
}
