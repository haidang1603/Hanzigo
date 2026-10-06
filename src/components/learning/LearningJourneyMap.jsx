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
  getLevelById
} from '../../services/learningPathService';
import { playClickSound, playErrorSound } from '../../utils/audio';

export default function LearningJourneyMap({ 
  user, 
  onSelectLesson, 
  onOpenBoss, 
  onOpenPlacementTest,
  onOpenDailyMissions,
  onOpenSkills,
  onLockedClick
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

  // Active next lesson to continue
  const nextActiveLesson = allLevelLessons.find(l => !progress.completedLessons[l.id]) || allLevelLessons[0];

  return (
    <div className="space-y-6">
      {/* 1. COMPACT LEVEL SELECTOR & STATUS BAR */}
      <div className="space-y-3">
        {/* Level Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {levels.map(lvl => {
            const isSelected = selectedLevelId === lvl.id;
            const isLevelLocked = lvl.levelNumber > progress.unlockedLevelNumber;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedLevelId(lvl.id);
                }}
                className={`px-3.5 py-2 rounded-2xl border transition-all text-left flex items-center gap-2.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-[#E85D3F] bg-white dark:bg-[#1E293B] shadow-sm ring-2 ring-[#E85D3F]/20 text-[#243447] dark:text-white'
                    : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/70 dark:bg-[#1E293B]/60 hover:border-[#E85D3F]/50 text-[#748092] dark:text-[#94A3B8]'
                }`}
              >
                <span className="text-lg shrink-0">{lvl.icon}</span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black uppercase" style={{ color: isSelected ? '#E85D3F' : undefined }}>
                      {lvl.code}
                    </span>
                    {isLevelLocked ? (
                      <Lock size={10} className="text-[#748092]" />
                    ) : (
                      <span className="text-[10px] text-[#45B97C] font-semibold">●</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-medium leading-none">
                    {lvl.chineseName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active Level Overview Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg"
                  style={{ backgroundColor: `${selectedLevel.color}15`, color: selectedLevel.color }}
                >
                  {selectedLevel.code} • {selectedLevel.chineseName}
                </span>
                <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-medium">
                  {selectedLevel.hskStage || 'Stage 1: HSK 1–3'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white flex items-center gap-2">
                <span>{selectedLevel.icon}</span>
                <span>{selectedLevel.code}: {selectedLevel.name}</span>
              </h2>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-xl">
                {selectedLevel.tagline}
              </p>
            </div>

            {/* Quick Actions for Current Level */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowSyllabusDrawer(!showSyllabusDrawer);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#F1E5D8] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <BookOpen size={14} className="text-[#E85D3F]" />
                <span>Khung HSK 3.0</span>
                {showSyllabusDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {nextActiveLesson && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSelectLesson(nextActiveLesson);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>Học tiếp bài {nextActiveLesson.lessonNumber || 1}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#748092] dark:text-[#94A3B8]">
                Tiến độ cấp độ: {completedCount}/{allLevelLessons.length} bài học
              </span>
              <span className="font-mono text-[#E85D3F] font-bold">
                {levelProgressPercent}% HOÀN THÀNH
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#45B97C] via-[#3B82F6] to-[#E85D3F] transition-all duration-500"
                style={{ width: `${Math.max(levelProgressPercent > 0 ? 4 : 0, levelProgressPercent)}%` }}
              />
            </div>
          </div>

          {/* 5-Pillar Syllabus Dropdown / Drawer */}
          {showSyllabusDrawer && selectedLevel.syllabus5Pillars && (
            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-wider text-[#E85D3F] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>5 Thành phần chuẩn HSK 3.0</span>
                </div>
                <div className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  {selectedLevel.code} • Chuẩn khảo thí Quốc gia Trung Quốc
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Pillar 1: Tasks */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                  <span className="font-bold text-[#45B97C] flex items-center gap-1.5">
                    <span>🎯</span> Nhiệm vụ giao tiếp (Tasks)
                  </span>
                  <ul className="space-y-1 text-[#748092] dark:text-[#94A3B8] list-disc list-inside text-[11px]">
                    {selectedLevel.syllabus5Pillars.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>

                {/* Pillar 2: Topics */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                  <span className="font-bold text-[#3B82F6] flex items-center gap-1.5">
                    <span>💬</span> Chủ đề đời sống (Topics)
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedLevel.syllabus5Pillars.topics.map((tp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-[10px]">
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pillar 3 & 4: Vocab, Grammar, Hanzi */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <span className="font-bold text-[#E85D3F] flex items-center gap-1.5">
                    <span>📐</span> Chỉ tiêu HSK 3.0
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-[#FFF9F2] dark:bg-[#243447]">
                      <div className="text-[#748092] dark:text-[#94A3B8]">Từ vựng</div>
                      <div className="font-black text-[#E85D3F] text-xs">{selectedLevel.syllabus5Pillars.vocabularyTarget}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#FFF9F2] dark:bg-[#243447]">
                      <div className="text-[#748092] dark:text-[#94A3B8]">Ngữ pháp</div>
                      <div className="font-black text-[#3B82F6] text-xs">{selectedLevel.syllabus5Pillars.grammarTarget}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#FFF9F2] dark:bg-[#243447]">
                      <div className="text-[#748092] dark:text-[#94A3B8]">Hán tự</div>
                      <div className="font-black text-[#E85D3F] text-xs">{selectedLevel.syllabus5Pillars.hanziTarget}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                        onClick={() => {
                          if (isLocked) {
                            playErrorSound();
                            if (onLockedClick) {
                              onLockedClick(lesson);
                            } else if (onOpenPlacementTest) {
                              onOpenPlacementTest();
                            }
                            return;
                          }
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
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 opacity-75 hover:opacity-100'
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
                      <button
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            playErrorSound();
                            if (onLockedClick) {
                              onLockedClick(lesson);
                            } else if (onOpenPlacementTest) {
                              onOpenPlacementTest();
                            }
                            return;
                          }
                          playClickSound();
                          onSelectLesson(lesson);
                        }}
                        className="mt-2 text-center max-w-44 px-2 py-1 rounded-xl bg-white/90 dark:bg-[#1E293B]/90 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs hover:border-[#E85D3F] transition-all cursor-pointer"
                      >
                        <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-[#748092]">+{lesson.xpReward} XP</p>
                      </button>
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
