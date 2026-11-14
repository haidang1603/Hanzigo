import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileSearch, PenTool } from 'lucide-react';
import { Hsk6FaultySentenceRenderer } from './Hsk6FaultySentenceRenderer.tsx';
import { Hsk6TwoPhaseSummarySimulator } from './Hsk6TwoPhaseSummarySimulator.tsx';
import {
  HSK6_SUMMARY_PASSAGES,
  SAMPLE_HSK6_FAULTY_QUESTIONS,
} from './hsk6StateMachine.ts';

interface Hsk6SimulatorWorkspaceProps {
  onBack?: () => void;
}

export const Hsk6SimulatorWorkspace: React.FC<Hsk6SimulatorWorkspaceProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'faulty_sentence' | 'summary_writing'>(
    'faulty_sentence'
  );
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [reviewFaultyMode, setReviewFaultyMode] = useState(false);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(HSK6_SUMMARY_PASSAGES[0].id);

  const selectedPassage =
    HSK6_SUMMARY_PASSAGES.find((p) => p.id === selectedPassageId) || HSK6_SUMMARY_PASSAGES[0];
  const faultyCorrectCount = SAMPLE_HSK6_FAULTY_QUESTIONS.filter(
    (q) => answers[q.id] === q.correct_answer
  ).length;

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
              Trọn bộ {SAMPLE_HSK6_FAULTY_QUESTIONS.length} câu (51–60) phủ đủ 8 nhóm bệnh cú HSK 6 · Mẹo: gạch chân nháp Chủ – Vị – Tân trước khi chọn đáp án.
            </span>
            <div className="flex items-center gap-2">
              {reviewFaultyMode && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black">
                  Đúng {faultyCorrectCount}/{SAMPLE_HSK6_FAULTY_QUESTIONS.length} câu
                </span>
              )}
              <button
                type="button"
                onClick={() => setReviewFaultyMode((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 font-bold text-white cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                {reviewFaultyMode ? 'Quay lại chế độ làm bài' : 'Chấm điểm & Giải phẫu câu sai'}
              </button>
            </div>
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
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
            <span className="text-xs font-extrabold text-slate-600 px-2">
              Chọn đề tự sự (~1.000 chữ):
            </span>
            {HSK6_SUMMARY_PASSAGES.map((passage) => (
              <button
                key={passage.id}
                type="button"
                onClick={() => setSelectedPassageId(passage.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  selectedPassageId === passage.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {passage.title_hint}
              </button>
            ))}
          </div>

          <Hsk6TwoPhaseSummarySimulator
            key={selectedPassage.id}
            attemptKey={selectedPassage.id}
            passageParagraphs={selectedPassage.paragraphs}
            practiceMode
          />
        </div>
      )}
    </div>
  );
};

