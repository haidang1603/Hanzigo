import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Check, 
  Star, 
  Flame, 
  Compass, 
  Award, 
  ChevronRight, 
  Trophy,
  Play,
  RotateCcw,
  BarChart3,
  Calendar,
  Gift,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';
import { 
  getAllLevels, 
  getChaptersByLevel, 
  getLessonsByChapter, 
  getUserJourneyProgress, 
  getLessonNodeStatus, 
  isBossUnlocked,
  getBossChallengeByChapter,
  getLevelById,
  getSkillMastery
} from '../../services/learningPathService';
import { playClickSound } from '../../utils/audio';

export default function LearningJourneyMap({ 
  user, 
  onSelectLesson, 
  onOpenBoss, 
  onOpenPlacementTest,
  onOpenDailyMissions,
  onOpenSkills
}) {
  const levels = getAllLevels();
  const [selectedLevelId, setSelectedLevelId] = useState('lvl-1');
  const progress = getUserJourneyProgress(user);

  const selectedLevel = getLevelById(selectedLevelId);
  const chapters = getChaptersByLevel(selectedLevelId);

  // Compute level completion percent
  const allLevelLessons = chapters.flatMap(ch => getLessonsByChapter(ch.id));
  const completedCount = allLevelLessons.filter(l => Boolean(progress.completedLessons[l.id])).length;
  const levelProgressPercent = allLevelLessons.length > 0 
    ? Math.round((completedCount / allLevelLessons.length) * 100) 
    : 0;

  const [showSyllabusDrawer, setShowSyllabusDrawer] = useState(false);
  const skillMastery = getSkillMastery(user);

  // Active next lesson to continue
  const nextActiveLesson = allLevelLessons.find(l => !progress.completedLessons[l.id]) || allLevelLessons[0];

  return (
    <div className="space-y-6">
      {/* 0. 🇨🇳 HSK JOURNEY MASTER DASHBOARD (HSK 3.0 Real-time Stats) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white shadow-xl border border-white/10 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E85D3F] text-white shadow-xs">
                🇨🇳 HSK OFFICIAL JOURNEY
              </span>
              <span className="text-xs text-white/70 font-medium">
                {selectedLevel.hskStage || 'Stage 1: HSK 1–3'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2.5">
              <span>{selectedLevel.icon}</span>
              <span>{selectedLevel.code}: {selectedLevel.name}</span>
              <span className="text-sm font-normal text-white/60 hidden sm:inline">
                ({selectedLevel.chineseName})
              </span>
            </h2>
            <p className="text-xs text-white/70 max-w-xl">
              {selectedLevel.tagline}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowSyllabusDrawer(!showSyllabusDrawer);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <BookOpen size={15} />
              <span>Khung HSK 3.0</span>
              {showSyllabusDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {nextActiveLesson && (
              <button
                onClick={() => {
                  playClickSound();
                  onSelectLesson(nextActiveLesson);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#F4B942] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>Học tiếp bài {nextActiveLesson.lessonNumber || 1}</span>
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white/75">
              Tiến độ cấp độ: {completedCount}/{allLevelLessons.length} bài học
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {levelProgressPercent}% HOÀN THÀNH
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/15 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#45B97C] via-[#3B82F6] to-[#E85D3F] transition-all duration-700"
              style={{ width: `${Math.max(4, levelProgressPercent)}%` }}
            />
          </div>
        </div>

        {/* 6 Skill Breakdown Bars according to HSK Test standard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-white/10">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Từ vựng (Vocab)</div>
            <div className="text-lg font-black text-amber-400">{skillMastery.vocabulary}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${skillMastery.vocabulary}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Ngữ pháp (Grammar)</div>
            <div className="text-lg font-black text-blue-400">{skillMastery.grammar}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${skillMastery.grammar}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Nghe hiểu (Listening)</div>
            <div className="text-lg font-black text-emerald-400">{skillMastery.listening}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${skillMastery.listening}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Đọc hiểu (Reading)</div>
            <div className="text-lg font-black text-purple-400">{skillMastery.reading}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${skillMastery.reading}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Viết câu (Writing)</div>
            <div className="text-lg font-black text-rose-400">{skillMastery.writing}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-rose-400 rounded-full" style={{ width: `${skillMastery.writing}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[10px] text-white/60 font-semibold">Nói & Phản xạ (Speaking)</div>
            <div className="text-lg font-black text-orange-400">{skillMastery.speaking}%</div>
            <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${skillMastery.speaking}%` }} />
            </div>
          </div>
        </div>

        {/* 5-Pillar Syllabus Dropdown / Drawer */}
        {showSyllabusDrawer && selectedLevel.syllabus5Pillars && (
          <div className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span>📚</span>
                <span>Khung Đào Tạo HSK 3.0: 5 Thành Phần Cốt Lõi</span>
              </div>
              <div className="text-[11px] text-white/60">
                {selectedLevel.code} • Chuẩn khảo thí Quốc gia Trung Quốc
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Pillar 1: Tasks */}
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🎯</span> Nhiệm vụ giao tiếp (Tasks)
                </span>
                <ul className="space-y-1 text-white/80 list-disc list-inside text-[11px]">
                  {selectedLevel.syllabus5Pillars.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>

              {/* Pillar 2: Topics */}
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span>💬</span> Chủ đề đời sống (Topics)
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedLevel.syllabus5Pillars.topics.map((tp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-[10px]">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pillar 3 & 4: Vocab, Grammar, Hanzi */}
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>📐</span> Chỉ tiêu HSK 3.0
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <div className="text-white/60">Từ vựng</div>
                    <div className="font-black text-amber-400 text-sm">{selectedLevel.syllabus5Pillars.vocabularyTarget}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <div className="text-white/60">Ngữ pháp</div>
                    <div className="font-black text-blue-400 text-sm">{selectedLevel.syllabus5Pillars.grammarTarget}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <div className="text-white/60">Hán tự</div>
                    <div className="font-black text-rose-400 text-sm">{selectedLevel.syllabus5Pillars.hanziTarget}</div>
                  </div>
                </div>
                <p className="text-[10px] text-white/60 italic leading-tight">
                  Tập trung kỹ năng: {selectedLevel.syllabus5Pillars.skillsFocus.listening}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. Placement Test Banner (If not yet taken or want to reassess) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FFF9F2] via-[#FDEEEB] to-[#FEF8EA] dark:from-[#1E293B] dark:via-[#2D1E1B] dark:to-[#222B1E] border border-[#E85D3F]/25 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white flex items-center justify-center shadow-md shadow-[#E85D3F]/20 shrink-0">
            <Compass size={24} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E85D3F]/15 text-[#E85D3F]">
                ĐÁNH GIÁ NĂNG LỰC
              </span>
              <span className="text-[11px] text-[#748092]">10 câu hỏi • 3 phút</span>
            </div>
            <h3 className="text-sm font-bold text-[#243447] dark:text-white">
              Đã có nền tảng tiếng Trung? Làm bài test để bỏ qua các bài đã biết
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            if (onOpenPlacementTest) onOpenPlacementTest();
          }}
          className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <span>Kiểm tra trình độ</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 2. Level Selector Pills (6 Levels) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {levels.map(lvl => {
          const isSelected = selectedLevelId === lvl.id;
          const isLevelLocked = lvl.levelNumber > progress.unlockedLevelNumber;

          return (
            <button
              key={lvl.id}
              onClick={() => {
                playClickSound();
                setSelectedLevelId(lvl.id);
              }}
              className={`p-3 rounded-2xl border transition-all text-left flex items-center gap-3 shrink-0 cursor-pointer min-w-44 ${
                isSelected
                  ? 'border-[#E85D3F] bg-white dark:bg-[#1E293B] shadow-md ring-2 ring-[#E85D3F]/20'
                  : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/70 dark:bg-[#1E293B]/60 hover:border-[#E85D3F]/50'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${lvl.color}18`, color: lvl.color }}
              >
                {lvl.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase" style={{ color: lvl.color }}>
                    {lvl.code}
                  </span>
                  {isLevelLocked && <Lock size={10} className="text-[#748092]" />}
                </div>
                <div className="text-xs font-bold text-[#243447] dark:text-white truncate">
                  {lvl.name}
                </div>
                <div className="text-[10px] text-[#748092] truncate">
                  {lvl.chineseName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Selected Level Banner & Progress */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-black uppercase px-2.5 py-0.5 rounded-lg"
                style={{ backgroundColor: `${selectedLevel.color}20`, color: selectedLevel.color }}
              >
                {selectedLevel.code} • {selectedLevel.chineseName}
              </span>
              <span className="text-xs font-bold text-[#748092]">
                {selectedLevel.tagline}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#243447] dark:text-white">
              Level {selectedLevel.levelNumber}: {selectedLevel.name}
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
              {selectedLevel.description}
            </p>
          </div>

          {/* Quick Level Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenDailyMissions && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenDailyMissions();
                }}
                className="p-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#E85D3F] flex items-center gap-1.5"
                title="Nhiệm vụ hàng ngày"
              >
                <Calendar size={15} />
                <span className="hidden sm:inline">Nhiệm vụ</span>
              </button>
            )}

            {onOpenSkills && (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenSkills();
                }}
                className="p-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#45B97C] flex items-center gap-1.5"
                title="Bảng phân tích kỹ năng"
              >
                <BarChart3 size={15} />
                <span className="hidden sm:inline">Kỹ năng</span>
              </button>
            )}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#748092]">Tiến độ Level:</span>
            <span className="font-mono text-[#E85D3F]">{completedCount}/{allLevelLessons.length} bài ({levelProgressPercent}%)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#F1E5D8] dark:bg-[#131B24] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${levelProgressPercent}%`, 
                backgroundColor: selectedLevel.color 
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. CHAPTER PATHWAYS & VERTICAL JOURNEY MAP */}
      <div className="space-y-10 py-4">
        {chapters.map((chapter) => {
          const chapterLessons = getLessonsByChapter(chapter.id);
          const bossChallenge = getBossChallengeByChapter(chapter.id);
          const bossUnlocked = isBossUnlocked(chapter.id, progress);
          const bossBeaten = bossChallenge && Boolean(progress.completedBosses[bossChallenge.id]);

          return (
            <div key={chapter.id} className="relative space-y-6">
              {/* Chapter Header Banner */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                      CHƯƠNG {chapter.chapterNumber}
                    </span>
                    <span className="text-xs font-bold text-[#748092]">{chapter.chineseTitle}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    {chapter.desc}
                  </p>
                </div>
              </div>

              {/* Vertical Interactive Node Pathway */}
              <div className="relative py-4 flex flex-col items-center gap-8">
                {/* Connecting background vertical winding line */}
                <div className="absolute top-4 bottom-4 w-1 bg-gradient-to-b from-[#F1E5D8] via-[#E85D3F]/30 to-[#F1E5D8] dark:from-[#2B3A4F] dark:via-[#E85D3F]/30 dark:to-[#2B3A4F] rounded-full z-0" />

                {/* Lesson Nodes */}
                {chapterLessons.map((lesson, idx) => {
                  const status = getLessonNodeStatus(lesson.id, progress);
                  const isLocked = status === 'locked';
                  const isCompleted = status === 'completed' || status === 'mastered';
                  const isInProgress = status === 'in_progress';
                  const isAvailable = status === 'available';

                  // Zigzag alternating offset for playful journey feel
                  const offsetClass = idx % 2 === 0 ? '-translate-x-6 sm:-translate-x-12' : 'translate-x-6 sm:translate-x-12';

                  return (
                    <div 
                      key={lesson.id}
                      className={`relative z-10 flex flex-col items-center transition-all ${offsetClass}`}
                    >
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          playClickSound();
                          onSelectLesson(lesson);
                        }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center relative shadow-lg transition-all active:scale-95 cursor-pointer group ${
                          isCompleted
                            ? 'bg-[#45B97C] text-white shadow-[#45B97C]/25 ring-4 ring-[#45B97C]/20'
                            : isInProgress
                            ? 'bg-[#E85D3F] text-white shadow-[#E85D3F]/30 ring-4 ring-[#E85D3F]/30 animate-pulse'
                            : isAvailable
                            ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] border-2 border-[#E85D3F] shadow-sm hover:scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-75'
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={20} />
                        ) : isCompleted ? (
                          <Check size={26} strokeWidth={3} />
                        ) : (
                          <>
                            <span className="text-base sm:text-lg font-black font-mono">
                              {lesson.lessonNumber}
                            </span>
                            <span className="text-[9px] uppercase font-bold tracking-tight">Bài học</span>
                          </>
                        )}

                        {/* Star Rating Badge */}
                        {isCompleted && (
                          <div className="absolute -bottom-2 flex items-center gap-0.5 bg-white dark:bg-[#1E293B] px-1.5 py-0.5 rounded-full border border-[#F1E5D8] shadow-xs text-amber-400 text-[10px]">
                            ★
                          </div>
                        )}
                      </button>

                      {/* Tooltip Label */}
                      <div className="mt-2 text-center max-w-44 px-2 py-1 rounded-xl bg-white/90 dark:bg-[#1E293B]/90 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
                        <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-[#748092]">+{lesson.xpReward} XP</p>
                      </div>
                    </div>
                  );
                })}

                {/* Chapter Boss Challenge Node */}
                {bossChallenge && (
                  <div className="relative z-10 flex flex-col items-center pt-2">
                    <button
                      type="button"
                      disabled={!bossUnlocked}
                      onClick={() => {
                        playClickSound();
                        onOpenBoss(bossChallenge);
                      }}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center relative shadow-xl transition-all active:scale-95 cursor-pointer ${
                        bossBeaten
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-white ring-4 ring-amber-400/30'
                          : bossUnlocked
                          ? 'bg-gradient-to-tr from-red-500 to-orange-500 text-white ring-4 ring-red-500/30 animate-bounce'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl">
                        {bossBeaten ? '🏆' : bossChallenge.bossAvatar || '🐉'}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider mt-1">
                        {bossBeaten ? 'ĐÃ HẠ GỤC' : 'BOSS BATTLE'}
                      </span>

                      {!bossUnlocked && (
                        <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white">
                          <Lock size={22} />
                        </div>
                      )}
                    </button>

                    <div className="mt-2 text-center max-w-64 p-2.5 rounded-xl bg-white/95 dark:bg-[#1E293B]/95 border border-red-500/30 shadow-xs space-y-1">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">
                        {bossChallenge.title}
                      </p>
                      <p className="text-[10px] text-[#748092]">
                        {bossUnlocked ? `Sẵn sàng khiêu chiến (+${bossChallenge.xpReward} XP)` : 'Hoàn thành các bài trên để mở khóa'}
                      </p>

                      {bossChallenge.stages && bossChallenge.stages.length >= 5 && (
                        <div className="pt-1 border-t border-red-100 dark:border-red-900/40">
                          <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block pb-0.5">
                            5 ẢI SINH TỒN THỰC CHIẾN:
                          </span>
                          <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-semibold text-[#243447] dark:text-white">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">✈️ Sân bay</span>
                            <span>➔</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">🏨 Khách sạn</span>
                            <span>➔</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">🍜 Nhà hàng</span>
                            <span>➔</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">🚇 Tàu điện</span>
                            <span>➔</span>
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">🛍️ Mua sắm</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
