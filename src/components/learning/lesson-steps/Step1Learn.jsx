import React from 'react';
import { Target, Layers, Award, BookOpen, Volume2 } from 'lucide-react';

export default function Step1Learn({
  lesson,
  lessonMaterials = [],
  setShowMaterialsModal,
  handleSpeak
}) {
  if (!lesson?.step1_learn) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 1: Khám phá kiến thức mới
        </span>
        <h3 className="text-xl font-black text-[#243447] dark:text-white">
          {lesson.step1_learn.topic}
        </h3>
        <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
          {lesson.step1_learn.summary}
        </p>
      </div>

      {/* Pedagogical Framework: Objectives, Prerequisites, Passing Criteria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-[#45B97C] flex items-center gap-1">
            <Target size={11} /> Mục tiêu bài học
          </span>
          <p className="text-[#243447] dark:text-slate-300 text-[11px] font-medium leading-snug">
            {lesson.objective || 'Làm chủ kiến thức cốt lõi và mẫu câu giao tiếp.'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-[#3B82F6] flex items-center gap-1">
            <Layers size={11} /> Điều kiện tiên quyết
          </span>
          <p className="text-[#243447] dark:text-slate-300 text-[11px] font-medium leading-snug">
            {lesson.prerequisite || 'Đã hoàn thành các bài học trước.'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-[#E85D3F] flex items-center gap-1">
            <Award size={11} /> Chuẩn đầu ra (≥ 70%)
          </span>
          <p className="text-[#243447] dark:text-slate-300 text-[11px] font-medium leading-snug">
            {lesson.completionCriteria || 'Đạt tối thiểu 70% bài tập trắc nghiệm và thử thách.'}
          </p>
        </div>
      </div>

      {/* Linked Materials Quick Action */}
      {lessonMaterials.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base">📚</span>
            <div>
              <span className="font-bold text-[#243447] dark:text-white">
                Tài liệu bổ trợ:
              </span>
              <span className="text-[#748092] dark:text-slate-300 ml-1">
                {lessonMaterials[0].title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowMaterialsModal?.(true)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-amber-100 dark:hover:bg-[#2B3A4F] text-[#E85D3F] text-xs font-bold border border-amber-300 dark:border-amber-700 transition-all flex items-center gap-1 cursor-pointer"
          >
            <BookOpen size={12} />
            <span>Xem giáo trình ({lessonMaterials.length})</span>
          </button>
        </div>
      )}

      {/* Tone / Initial Guides */}
      {lesson.step1_learn.toneGuide && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {lesson.step1_learn.toneGuide.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E85D3F]">{t.name}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  {t.symbol}
                </span>
              </div>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{t.desc}</p>
              <div className="text-xs font-medium text-[#243447] dark:text-white pt-1">
                Ví dụ: <span className="font-bold text-[#45B97C]">{t.example}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initial breakdown */}
      {lesson.step1_learn.initialsGuide && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-[#243447] dark:text-white">
            Bảng phát âm chi tiết:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {lesson.step1_learn.initialsGuide.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                <div>
                  <span className="font-black text-[#E85D3F] text-base font-mono mr-2">{item.char}</span>
                  <span className="text-[#748092] text-[11px]">{item.read}</span>
                </div>
                {item.example && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF9F2] dark:bg-[#131B24] text-[#45B97C]">
                    {item.example}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio demo button */}
      {lesson.step1_learn.audioDemoText && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleSpeak(lesson.step1_learn.audioDemoText)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 size={16} />
            <span>Nghe phát âm mẫu chuẩn toàn bài</span>
          </button>
        </div>
      )}
    </div>
  );
}

