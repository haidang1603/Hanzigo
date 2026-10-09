import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Check, 
  ChevronRight, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Compass,
  Play,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Volume2
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
  getResumeLesson,
  getChapterMaterials,
  getLessonMaterials
} from '../../services/learningPathService';
import { playClickSound, playErrorSound, speakChinese } from '../../utils/audio';

export default function LearningJourneyMap({ 
  user, 
  onSelectLesson, 
  onOpenBoss, 
  onOpenPlacementTest,
  onOpenDailyMissions: _onOpenDailyMissions,
  onOpenSkills: _onOpenSkills,
  onLockedClick
}) {
  const levels = getAllLevels();
  const [selectedLevelId, setSelectedLevelId] = useState('lvl-1');
  const [selectedMaterialModal, setSelectedMaterialModal] = useState(null);
  const progress = getUserJourneyProgress(user);
  const resumeInfo = getResumeLesson(progress);

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
      {/* 0. HERO RESUME BANNER ("TIẾP TỤC BÀI HỌC") */}
      {resumeInfo?.lesson && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#243447] via-[#1E293B] to-[#131B24] text-white border border-[#E85D3F]/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E85D3F]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E85D3F] text-white tracking-wider flex items-center gap-1">
                  <Play size={10} fill="currentColor" />
                  Tiếp tục bài học
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {resumeInfo.level?.code || 'HSK 1'} • Module {resumeInfo.chapter?.moduleCode || '1.1'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  resumeInfo.status === 'in_progress' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  resumeInfo.status === 'mastered' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  resumeInfo.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {resumeInfo.status === 'in_progress' ? 'Đang học dở' :
                   resumeInfo.status === 'mastered' ? 'Đã thành thạo (3★)' :
                   resumeInfo.status === 'completed' ? 'Đã hoàn thành' : 'Sẵn sàng học'}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>Bài {resumeInfo.lesson.lessonNumber}:</span>
                  <span>{resumeInfo.lesson.title}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-2">
                  {resumeInfo.lesson.objective || resumeInfo.lesson.subtitle}
                </p>
              </div>

              {resumeInfo.lesson.completionCriteria && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CheckCircle2 size={12} className="text-[#45B97C]" />
                  <span>Tiêu chuẩn qua bài: {resumeInfo.lesson.completionCriteria}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onSelectLesson(resumeInfo.lesson);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#f06e52] hover:to-[#db4f33] text-white text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Play size={16} fill="currentColor" />
                <span>Vào học ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
        {chapters.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-5 max-w-xl mx-auto shadow-xs animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto text-4xl shadow-inner">
              👑
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                HSK 7–9 • Đỉnh cao Bậc thầy & Phiên dịch
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                Chuyên Đề Cao Cấp & Phiên Dịch Cabin
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Chuẩn HSK 7-9 mới tích hợp toàn diện 5 kỹ năng (Nghe, Nói, Đọc, Viết, Dịch thuật).
                Hãy chinh phục trọn vẹn 24 chương học nền tảng từ HSK 1 đến HSK 6 hoặc làm bài Kiểm tra xếp lớp để sẵn sàng bứt phá!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedLevelId('lvl-1');
                }}
                className="py-2.5 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                Về HSK 1 Căn bản
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (onOpenPlacementTest) onOpenPlacementTest();
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass size={14} />
                <span>Kiểm tra xếp lớp ngay</span>
              </button>
            </div>
          </div>
        ) : (
          chapters.map((chapter) => {
          const chapterLessons = getLessonsByChapter(chapter.id);
          const bossChallenge = getBossChallengeByChapter(chapter.id);
          const bossUnlocked = isBossUnlocked(chapter.id, progress);
          const bossBeaten = bossChallenge && Boolean(progress.completedBosses[bossChallenge.id]);

          return (
            <div key={chapter.id} className="relative space-y-6">
              {/* Chapter Header Banner with Full Hierarchy & Materials */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                        {chapter.moduleCode ? `MODULE ${chapter.moduleCode}` : `CHƯƠNG ${chapter.chapterNumber}`}
                      </span>
                      {chapter.unitTitle && (
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          Unit: {chapter.unitTitle}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#748092]">{chapter.chineseTitle}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                      {chapter.desc}
                    </p>
                  </div>

                  {/* Prerequisites & Review Badges */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-1.5 text-[11px] shrink-0">
                    {chapter.prerequisite && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} />
                        <span>Tiên quyết: {chapter.prerequisite}</span>
                      </span>
                    )}
                    {chapter.reviewLessonId && (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 font-medium">
                        <BookOpen size={12} />
                        <span>Ôn tập: Bài {chapter.reviewLessonId.replace('l-', '')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Related Materials Linked Chips */}
                {(() => {
                  const chapterMaterials = getChapterMaterials(chapter.id);
                  if (chapterMaterials.length === 0) return null;
                  return (
                    <div className="pt-2.5 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-[#748092] flex items-center gap-1">
                        <FileText size={12} className="text-[#E85D3F]" />
                        <span>Tài liệu thẩm định:</span>
                      </span>
                      {chapterMaterials.map(mat => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedMaterialModal(mat);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#F1E5D8] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>📖</span>
                          <span className="max-w-[180px] truncate">{mat.title}</span>
                          <ExternalLink size={10} className="text-[#E85D3F]" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Vertical Interactive Node Pathway */}
              <div className="relative py-4 flex flex-col items-center gap-8">
                {/* Connecting background vertical winding line */}
                <div className="absolute top-4 bottom-4 w-1 bg-gradient-to-b from-[#F1E5D8] via-[#E85D3F]/30 to-[#F1E5D8] dark:from-[#2B3A4F] dark:via-[#E85D3F]/30 dark:to-[#2B3A4F] rounded-full z-0" />

                {/* Lesson Nodes */}
                {chapterLessons.map((lesson, idx) => {
                  const status = getLessonNodeStatus(lesson.id, progress);
                  const isLocked = status === 'locked';
                  const isMastered = status === 'mastered';
                  const isCompleted = status === 'completed' || isMastered;
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
                          isMastered
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30 ring-4 ring-amber-400/40'
                            : isCompleted
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
                          <div className={`absolute -bottom-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full border shadow-xs text-[10px] ${
                            isMastered
                              ? 'bg-amber-400 text-amber-950 border-amber-300 font-black'
                              : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] text-amber-400 font-bold'
                          }`}>
                            {isMastered ? '★★★' : (progress.completedLessons[lesson.id]?.stars === 2 ? '★★' : '★')}
                          </div>
                        )}
                      </button>

                      {/* Tooltip Label */}
                      <div className="mt-2 text-center max-w-48 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#1E293B]/95 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs hover:border-[#E85D3F] transition-all">
                        <div className="flex items-center justify-center gap-1.5">
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
                            className="text-xs font-bold text-[#243447] dark:text-white truncate cursor-pointer hover:text-[#E85D3F] transition-colors"
                          >
                            {lesson.title}
                          </button>
                          {lesson.chineseTitle && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakChinese(lesson.chineseTitle);
                              }}
                              className="text-[#E85D3F] hover:scale-125 transition-transform cursor-pointer shrink-0"
                              title={`Nghe phát âm: ${lesson.chineseTitle}`}
                            >
                              <Volume2 size={12} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#748092] mt-0.5">
                          <span>+{lesson.xpReward} XP</span>
                          {lesson.relatedMaterialIds?.length > 0 && (
                            <span className="text-[#E85D3F] font-bold">● Giáo trình</span>
                          )}
                        </div>
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
        }))}
      </div>

      {/* 5. VERIFIED MATERIAL PREVIEW MODAL */}
      {selectedMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                  {selectedMaterialModal.category || 'Tài liệu chuẩn'} • {selectedMaterialModal.level || 'HSK'}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  {selectedMaterialModal.title}
                </h3>
                <p className="text-xs text-[#748092]">
                  {selectedMaterialModal.author} ({selectedMaterialModal.publisher})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMaterialModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#748092] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              {selectedMaterialModal.description || 'Tài liệu giáo dục trích dẫn học thuật phục vụ người học HanziGo.'}
            </p>

            {selectedMaterialModal.verificationNotes && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                ✓ <strong>Thẩm định:</strong> {selectedMaterialModal.verificationNotes}
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] text-[#748092] space-y-1">
              <p>💡 <em>Lưu ý an toàn:</em> Mở tài liệu ngoài sẽ mở trong tab mới và KHÔNG tự động hoàn thành bài học của bạn.</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMaterialModal(null)}
                className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] cursor-pointer"
              >
                Đóng
              </button>
              {selectedMaterialModal.downloadUrl || selectedMaterialModal.sourceUrl ? (
                <a
                  href={selectedMaterialModal.downloadUrl || selectedMaterialModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <span>Mở tài liệu (Tab mới)</span>
                  <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
