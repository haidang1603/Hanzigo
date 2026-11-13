import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileSearch, PenTool } from 'lucide-react';
import { Hsk6FaultySentenceRenderer } from './Hsk6FaultySentenceRenderer.tsx';
import { Hsk6TwoPhaseSummarySimulator } from './Hsk6TwoPhaseSummarySimulator.tsx';
import { SAMPLE_HSK6_FAULTY_QUESTIONS } from './hsk6StateMachine.ts';

interface Hsk6SimulatorWorkspaceProps {
  onBack?: () => void;
}

export const Hsk6SimulatorWorkspace: React.FC<Hsk6SimulatorWorkspaceProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'faulty_sentence' | 'summary_writing'>(
    'faulty_sentence'
  );
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [reviewFaultyMode, setReviewFaultyMode] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại HSK
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Mô phỏng đặc thù HSK 6 (找病句 & 缩写)
            </h2>
            <p className="text-xs text-slate-500">
              Luyện chuyên sâu 2 phần thi khắc nghiệt nhất của HSK 6: Tìm câu sai (Câu 51–60) & Tóm tắt 2 pha (Câu 101).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('faulty_sentence')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition cursor-pointer ${
              activeMode === 'faulty_sentence'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSearch className="w-4 h-4 text-amber-600" />
            Đọc hiểu P1: Tìm câu sai (51–60)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('summary_writing')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition cursor-pointer ${
              activeMode === 'summary_writing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4 text-emerald-600" />
            Viết: Tóm tắt 2 pha (Câu 101)
          </button>
        </div>
      </div>

      {activeMode === 'faulty_sentence' ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-xs">
            <span className="font-semibold text-amber-900">
              Mẹo: Dùng công cụ gạch chân nháp Chủ - Vị - Tân ngay trên từng phương án trước khi chọn đáp án.
            </span>
            <button
              type="button"
              onClick={() => setReviewFaultyMode((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 font-bold text-white cursor-pointer transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {reviewFaultyMode ? 'Quay lại chế độ làm bài' : 'Chấm điểm & Giải phẫu câu sai'}
            </button>
          </div>

          {SAMPLE_HSK6_FAULTY_QUESTIONS.map((q) => (
            <Hsk6FaultySentenceRenderer
              key={q.id}
              question={q}
              selectedAnswer={answers[q.id] ?? null}
              onSelectAnswer={(choice) =>
                setAnswers((prev) => ({
                  ...prev,
                  [q.id]: choice,
                }))
              }
              isReviewMode={reviewFaultyMode}
            />
          ))}
        </div>
      ) : (
        <Hsk6TwoPhaseSummarySimulator practiceMode />
      )}
    </div>
  );
};

