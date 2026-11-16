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

      <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/30 text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#748092]">Công thức ngữ pháp</span>
        <div className="text-base font-bold font-mono text-[#E85D3F]">
          {lesson.step4_grammar.formula}
        </div>
        {Array.isArray(lesson.step4_grammar.formula_tokens) && lesson.step4_grammar.formula_tokens.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
            {lesson.step4_grammar.formula_tokens.map((tok, tIdx) => (
              <div key={tIdx} className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E85D3F]/25 text-left">
                <div className="text-[11px] font-bold font-mono text-[#243447] dark:text-white">{tok.token}</div>
                {tok.role && <div className="text-[9px] font-semibold text-[#748092]">{tok.role}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
        {lesson.step4_grammar.explanation}
      </p>

      {Array.isArray(lesson.step4_grammar.masteryNotes) && lesson.step4_grammar.masteryNotes.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
          <div className="font-bold text-amber-800 dark:text-amber-300">Điểm nhấn khảo thí CTI:</div>
          {lesson.step4_grammar.masteryNotes.map((note, idx) => (
            <p key={idx} className="text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{note}</p>
          ))}
        </div>
      )}

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

      {/* HSK 6: 8 Faulty Sentence Types Matrix (语病 Q51-60) */}
      {Array.isArray(lesson.step4_grammar.faultySentenceRules) && lesson.step4_grammar.faultySentenceRules.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131B24] border border-slate-200 dark:border-[#2B3A4F] space-y-2.5 text-xs">
          <div className="font-black text-sm text-[#243447] dark:text-white">
            Ma trận 8 Dạng Câu Bệnh Kinh Điển HSK 6 (语病 · Câu 51–60)
          </div>
          <div className="grid grid-cols-1 gap-2">
            {lesson.step4_grammar.faultySentenceRules.map((rule) => (
              <div key={rule.code} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#2B3A4F] space-y-1">
                <div className="font-bold text-[#E85D3F]">{rule.nameZh}</div>
                <div className="font-mono text-[11px] text-[#475569] dark:text-[#CBD5E1]">Dấu hiệu: {rule.signalPattern}</div>
                <div className="text-[11px] text-red-500 line-through">{rule.wrongSentence}</div>
                <div className="text-[11px] font-bold text-[#45B97C]">{rule.fixedSentence}</div>
                <p className="text-[11px] text-[#748092]">{rule.diagnosisTipVi}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HSK 6: 1000->400 Char Summary Rules (缩写) */}
      {Array.isArray(lesson.step4_grammar.summaryWritingRules) && lesson.step4_grammar.summaryWritingRules.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/25 border border-purple-200 dark:border-purple-900/40 space-y-2 text-xs">
          <div className="font-black text-sm text-purple-800 dark:text-purple-300">
            6 Nguyên tắc Thép Tóm tắt 1.000 → 400 Chữ HSK 6 (缩写)
          </div>
          <ul className="space-y-1.5">
            {lesson.step4_grammar.summaryWritingRules.map((r) => (
              <li key={r.id} className="leading-relaxed text-[#243447] dark:text-[#CBD5E1]">
                <strong className="text-purple-700 dark:text-purple-300">{r.title}:</strong> {r.ruleVi}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Linked HSK Exam Question Archetypes */}
      {Array.isArray(lesson.examQuestionTypesMapped) && lesson.examQuestionTypesMapped.length > 0 && (
        <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="font-bold text-[#748092]">Dạng đề HSK tương ứng:</span>
          {lesson.examQuestionTypesMapped.map((qt) => (
            <span key={qt.code} className="px-2 py-0.5 rounded-lg bg-orange-500/10 text-[#E85D3F] font-semibold border border-orange-500/20">
              [{qt.level} · {qt.skill}] {qt.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

