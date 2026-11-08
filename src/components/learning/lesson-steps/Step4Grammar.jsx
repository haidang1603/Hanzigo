import React from 'react';
import { Volume2, XCircle, ArrowRight } from 'lucide-react';

export default function Step4Grammar({
  lesson,
  handleSpeak
}) {
  if (!lesson?.step4_grammar) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-5 animate-in fade-in">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 4: Cấu trúc ngữ pháp
        </span>
        <h3 className="text-xl font-black text-[#243447] dark:text-white">
          {lesson.step4_grammar.title}
        </h3>
      </div>

      <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/30 text-center space-y-1">
        <span className="text-[10px] uppercase font-bold text-[#748092]">Công thức ngữ pháp</span>
        <div className="text-base font-bold font-mono text-[#E85D3F]">
          {lesson.step4_grammar.formula}
        </div>
      </div>

      <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
        {lesson.step4_grammar.explanation}
      </p>

      {/* Examples */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-xs font-bold text-[#243447] dark:text-white">
          Ví dụ ứng dụng thực tế:
        </h4>
        {lesson.step4_grammar.examples.map((ex, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#243447] dark:text-white text-sm">{ex.hanzi}</div>
              <div className="text-[#E85D3F] font-mono text-[11px]">{ex.pinyin}</div>
              <div className="text-[#748092]">{ex.meaning}</div>
            </div>
            <button
              type="button"
              onClick={() => handleSpeak(ex.hanzi)}
              className="p-2 rounded-xl text-[#E85D3F] hover:bg-[#FDEEEB] cursor-pointer"
            >
              <Volume2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Common mistake */}
      {lesson.step4_grammar.commonMistake && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs space-y-1.5">
          <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <XCircle size={15} />
            <span>Lỗi sai thường gặp của người Việt:</span>
          </span>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="line-through text-red-500">{lesson.step4_grammar.commonMistake.wrong}</span>
            <ArrowRight size={13} className="text-[#748092]" />
            <span className="font-bold text-[#45B97C]">{lesson.step4_grammar.commonMistake.correct}</span>
          </div>
          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
            {lesson.step4_grammar.commonMistake.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

