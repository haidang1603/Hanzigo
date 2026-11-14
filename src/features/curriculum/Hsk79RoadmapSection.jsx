import React, { useMemo, useState } from 'react';
import {
  Play,
  CheckCircle2,
  Search,
  Trophy,
  BookOpen,
  Languages,
  PenTool,
  Mic,
  Sparkles,
  FileText,
  Layers,
  Award,
} from 'lucide-react';
import {
  HSK79_STAGE_CONFIGS,
  HSK79_MODULE_TITLES,
  HSK_79_60_LESSONS,
} from './hsk7to9CurriculumData.js';
import { getHsk79LessonWithContent } from './lessonContentSynthesizer.js';
import HskAdvancedModule from './HskAdvancedModule.tsx';

const FOCUS_META = {
  translation: { label: 'Dịch 3 tầng', icon: Languages, cls: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800' },
  writing: { label: 'Nghị luận 500字', icon: PenTool, cls: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  reading: { label: 'Đọc báo chí', icon: BookOpen, cls: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800' },
  speaking: { label: 'Biện luận AI', icon: Mic, cls: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  grammar: { label: 'Văn viết cổ', icon: Sparkles, cls: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
  exam: { label: 'Tổng ôn CBT', icon: Trophy, cls: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
};

export default function Hsk79RoadmapSection({
  user,
  completedLessonsMap = {},
  onStartLesson,
  onSwitchToFoundation,
  onOpenHskExam,
  speakChinese,
}) {
  const [subMode, setSubMode] = useState('lessons'); // 'lessons' | 'studio'
  const [activeLevel, setActiveLevel] = useState(7); // 7 | 8 | 9
  const [activeModuleIndex, setActiveModuleIndex] = useState(0); // 0 = all 4 modules
  const [searchTerm, setSearchTerm] = useState('');

  const hsk79CompletedCount = useMemo(() => {
    return HSK_79_60_LESSONS.filter((l) => Boolean(completedLessonsMap[l.stringId])).length;
  }, [completedLessonsMap]);

  const stageCfg = HSK79_STAGE_CONFIGS[activeLevel] || HSK79_STAGE_CONFIGS[7];
  const modulesForLevel = useMemo(
    () => HSK79_MODULE_TITLES.filter((m) => m.level === activeLevel),
    [activeLevel]
  );

  const filteredLessons = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return HSK_79_60_LESSONS.filter((lesson) => {
      if (lesson.level !== activeLevel) return false;
      if (activeModuleIndex !== 0 && lesson.moduleIndex !== activeModuleIndex) return false;
      if (!q) return true;
      return (
        String(lesson.id).includes(q) ||
        lesson.zh.toLowerCase().includes(q) ||
        lesson.vi.toLowerCase().includes(q) ||
        lesson.grammarPattern.toLowerCase().includes(q) ||
        (lesson.keyVocab || []).some((w) => w.toLowerCase().includes(q))
      );
    });
  }, [activeLevel, activeModuleIndex, searchTerm]);

  const handleLaunchLesson = (lessonMeta) => {
    const fullLesson = getHsk79LessonWithContent(lessonMeta.id);
    if (fullLesson && onStartLesson) {
      onStartLesson(fullLesson);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner for Band 3 (HSK 7-9) */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white shadow-xl border border-indigo-400/20">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold">
              <Award size={13} className="text-amber-300" />
              <span>Chuẩn HSK 3.0 Bậc Cao Cấp (高等七–九级) · 60 Bài (121–180) · 11.092 Từ vựng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Noto_Serif_SC'] tracking-tight">
              Lộ Trình HSK 7–9: Học Thuật, Báo Chí & Biên Phiên Dịch
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Chinh phục 12 chặng chuyên sâu từ Kinh tế số, AI, Hợp đồng pháp lý đến Ngoại giao & Triết học Á Đông,
              kèm Xưởng dịch thuật 3 tầng (Trung ↔ Việt) và Dàn ý nghị luận 450–650 chữ.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                Đã hoàn thành: <strong>{hsk79CompletedCount} / 60 bài</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                Chuẩn đề CBT: <strong>98 câu · 210 phút · 300 điểm</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-200 border border-amber-300/30">
                HSK 7 ≥ 180đ · HSK 8 ≥ 210đ · HSK 9 ≥ 240đ
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleLaunchLesson(HSK_79_60_LESSONS[0])}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Play size={15} fill="currentColor" />
              <span>Vào học Bài 121 ngay</span>
            </button>
            {onOpenHskExam && (
              <button
                type="button"
                onClick={onOpenHskExam}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trophy size={14} className="text-amber-300" />
                <span>Vào phòng thi CBT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-mode Toggle: 60 Structured Lessons vs Reference Vault */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubMode('lessons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              subMode === 'lessons'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
            }`}
          >
            <Layers size={14} />
            <span>60 Bài Học Chuyên Sâu (Bài 121–180)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubMode('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              subMode === 'studio'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24]'
            }`}
          >
            <FileText size={14} />
            <span>Kho Từ vựng Đồng nghĩa & Ngữ pháp Chuẩn 7–9</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-[#748092] px-2">
          3 Cấp (HSK 7–8–9) · 12 Chặng · 60 Bài
        </span>
      </div>

      {subMode === 'studio' ? (
        <HskAdvancedModule
          user={user}
          onSwitchToFoundation={onSwitchToFoundation}
        />
      ) : (
        <div className="space-y-5">
          {/* Level Tabs: HSK 7 / HSK 8 / HSK 9 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[7, 8, 9].map((lvl) => {
              const cfg = HSK79_STAGE_CONFIGS[lvl];
              const isSelected = activeLevel === lvl;
              const completedInLvl = HSK_79_60_LESSONS.filter(
                (l) => l.level === lvl && completedLessonsMap[l.stringId]
              ).length;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setActiveLevel(lvl);
                    setActiveModuleIndex(0);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-white dark:bg-[#1E293B] border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white/70 dark:bg-[#1E293B]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-black">
                      {cfg.code} · Bài {cfg.lessonRange[0]}–{cfg.lessonRange[1]}
                    </span>
                    <span className="text-[11px] font-bold text-[#45B97C]">
                      {completedInLvl}/20 bài
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#243447] dark:text-white">
                    {cfg.title}
                  </div>
                  <div className="text-[11px] text-[#748092] dark:text-slate-400">
                    Mục tiêu: {cfg.vocabTarget.toLocaleString('vi-VN')} từ · {cfg.hanziTarget.toLocaleString('vi-VN')} chữ Hán · Đạt ≥ {cfg.passScore}/300đ
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Summary + Module Filter + Search */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
                  {stageCfg.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-slate-400">
                  {stageCfg.description}
                </p>
              </div>
              <div className="relative w-full md:w-72 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm bài, cấu trúc hoặc từ khóa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-medium text-[#243447] dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 4 Module Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModuleIndex(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeModuleIndex === 0
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                }`}
              >
                Tất cả 4 chặng (20 bài)
              </button>
              {modulesForLevel.map((mod) => (
                <button
                  key={mod.code}
                  type="button"
                  onClick={() => setActiveModuleIndex(mod.moduleIndex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeModuleIndex === mod.moduleIndex
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-indigo-300'
                  }`}
                >
                  {mod.title}
                </button>
              ))}
            </div>
          </div>

          {/* 60-Lesson Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => {
              const isDone = Boolean(completedLessonsMap[lesson.stringId]);
              const focus = FOCUS_META[lesson.focusTool] || FOCUS_META.translation;
              const FocusIcon = focus.icon;

              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#1E293B] border transition-all flex flex-col justify-between gap-4 ${
                    isDone
                      ? 'border-[#45B97C]/60 shadow-xs'
                      : 'border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-indigo-400 shadow-xs'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900 dark:bg-indigo-950 text-white text-[11px] font-black font-mono">
                          Bài {lesson.id} · HSK {lesson.level}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${focus.cls}`}>
                          <FocusIcon size={11} />
                          <span>{focus.label}</span>
                        </span>
                      </div>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={12} />
                          <span>Đã xong</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          onClick={() => speakChinese?.(lesson.zh)}
                          className="text-lg font-black text-[#243447] dark:text-white font-serif cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                          title="Bấm để nghe phát âm tiêu đề"
                        >
                          {lesson.zh}
                        </h4>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#E85D3F]">
                        {lesson.pinyin}
                      </div>
                      <div className="text-xs font-semibold text-[#748092] dark:text-slate-300 mt-0.5">
                        {lesson.vi}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px]">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Ngữ pháp văn viết: </span>
                      <span className="font-mono font-bold text-[#243447] dark:text-white">{lesson.grammarPattern}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(lesson.keyVocab || []).slice(0, 5).map((word) => (
                        <span
                          key={word}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-[#243447] dark:text-slate-200"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <span className="text-[11px] text-[#748092] truncate">
                      {lesson.moduleTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLaunchLesson(lesson)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>{isDone ? 'Ôn lại bài' : 'Vào học'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
