import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eraser, Highlighter, Info, XCircle } from 'lucide-react';
import {
  HSK6_ERROR_TAXONOMY,
  type Hsk6FaultySentenceQuestion,
} from './hsk6StateMachine.ts';

type GrammarBrush = 'S' | 'V' | 'O' | 'ERASE';
type OptionKey = 'A' | 'B' | 'C' | 'D';

interface Hsk6FaultySentenceRendererProps {
  question: Hsk6FaultySentenceQuestion;
  selectedAnswer?: OptionKey | null;
  onSelectAnswer?: (choice: OptionKey) => void;
  isReviewMode?: boolean;
}

const BRUSH_META: Record<
  Exclude<GrammarBrush, 'ERASE'>,
  { label: string; short: string; className: string; chipClass: string }
> = {
  S: {
    label: 'Chủ ngữ (主语)',
    short: '主',
    className: 'underline decoration-2 decoration-sky-500 bg-sky-100/80 text-sky-900 rounded px-0.5',
    chipClass: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  V: {
    label: 'Vị ngữ (谓语)',
    short: '谓',
    className: 'underline decoration-2 decoration-rose-500 bg-rose-100/80 text-rose-900 rounded px-0.5',
    chipClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  O: {
    label: 'Tân ngữ (宾语)',
    short: '宾',
    className: 'underline decoration-2 decoration-emerald-500 bg-emerald-100/80 text-emerald-900 rounded px-0.5',
    chipClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
};

function splitIntoClickableChunks(sentence: string): string[] {
  // Tách thành cụm ngắn 1-2 ký tự hoặc dấu câu để click gạch chân Chủ-Vị-Tân mượt mà
  return sentence.match(/[\u4e00-\u9fa5]{1,2}|[^\u4e00-\u9fa5]/g) || [sentence];
}

export const Hsk6FaultySentenceRenderer: React.FC<Hsk6FaultySentenceRendererProps> = ({
  question,
  selectedAnswer = null,
  onSelectAnswer,
  isReviewMode = false,
}) => {
  const [activeBrush, setActiveBrush] = useState<GrammarBrush>('S');
  const [scratchMarks, setScratchMarks] = useState<Record<string, Exclude<GrammarBrush, 'ERASE'>>>({});

  const optionChunks = useMemo(() => {
    const map: Record<OptionKey, string[]> = {
      A: splitIntoClickableChunks(question.options.A),
      B: splitIntoClickableChunks(question.options.B),
      C: splitIntoClickableChunks(question.options.C),
      D: splitIntoClickableChunks(question.options.D),
    };
    return map;
  }, [question.options]);

  const handleChunkClick = (optKey: OptionKey, chunkIdx: number, e: React.MouseEvent) => {
    if (isReviewMode) return;
    e.stopPropagation();
    const markKey = `${question.id}-${optKey}-${chunkIdx}`;
    setScratchMarks((prev) => {
      const next = { ...prev };
      if (activeBrush === 'ERASE' || next[markKey] === activeBrush) {
        delete next[markKey];
      } else {
        next[markKey] = activeBrush;
      }
      return next;
    });
  };

  const errorMeta = HSK6_ERROR_TAXONOMY[question.error_type];
  const isUserCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
            HSK 6 · Đọc hiểu Phần 1 (找病句) · Câu {question.question_number}
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-900">
            Hãy chọn câu có lỗi sai ngữ pháp hoặc logic trong 4 phương án sau:
          </h3>
        </div>

        {!isReviewMode && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2 font-semibold text-slate-500">
              <Highlighter className="w-3.5 h-3.5" />
              Gạch nháp:
            </span>
            {(['S', 'V', 'O'] as const).map((brush) => (
              <button
                key={brush}
                type="button"
                onClick={() => setActiveBrush(brush)}
                className={`px-2.5 py-1 rounded-xl font-bold border transition cursor-pointer ${
                  activeBrush === brush
                    ? `${BRUSH_META[brush].chipClass} ring-2 ring-offset-1 ring-slate-300`
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={BRUSH_META[brush].label}
              >
                {BRUSH_META[brush].short} · {BRUSH_META[brush].label.split(' ')[0]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveBrush('ERASE')}
              className={`px-2 py-1 rounded-xl font-bold border transition cursor-pointer inline-flex items-center gap-1 ${
                activeBrush === 'ERASE'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Tẩy gạch chân"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Options A, B, C, D */}
      <div className="space-y-3">
        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
          const isSelected = selectedAnswer === optKey;
          const isFaultyAnswer = question.correct_answer === optKey;

          let cardClass = 'border-slate-200 bg-slate-50/50 hover:border-amber-300 hover:bg-amber-50/20';
          if (isReviewMode) {
            if (isFaultyAnswer) {
              cardClass = 'border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300';
            } else if (isSelected && !isFaultyAnswer) {
              cardClass = 'border-rose-400 bg-rose-50/60';
            } else {
              cardClass = 'border-slate-200 bg-slate-50/40 opacity-75';
            }
          } else if (isSelected) {
            cardClass = 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/30';
          }

          return (
            <div
              key={optKey}
              onClick={() => {
                if (!isReviewMode && onSelectAnswer) {
                  onSelectAnswer(optKey);
                }
              }}
              className={`rounded-2xl border p-4 transition ${
                !isReviewMode ? 'cursor-pointer' : ''
              } ${cardClass}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                    isReviewMode && isFaultyAnswer
                      ? 'bg-emerald-600 text-white'
                      : isReviewMode && isSelected && !isFaultyAnswer
                        ? 'bg-rose-600 text-white'
                        : isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                  }`}
                >
                  {optKey}
                </span>

                <div className="flex-1 text-base leading-relaxed text-slate-900 font-medium">
                  {optionChunks[optKey].map((chunk, idx) => {
                    const markKey = `${question.id}-${optKey}-${idx}`;
                    const mark = scratchMarks[markKey];
                    const markClass = mark ? BRUSH_META[mark].className : '';
                    return (
                      <span
                        key={idx}
                        onClick={(e) => handleChunkClick(optKey, idx, e)}
                        className={`${
                          !isReviewMode ? 'hover:bg-amber-100/70 rounded cursor-crosshair' : ''
                        } ${markClass}`}
                      >
                        {chunk}
                      </span>
                    );
                  })}
                </div>

                {isReviewMode && isFaultyAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                )}
                {isReviewMode && isSelected && !isFaultyAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Mode: Anatomy & 8 Classic Error Taxonomy */}
      {isReviewMode && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  isUserCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isUserCorrect ? 'Chính xác' : `Chưa đúng (Đáp án: ${question.correct_answer})`}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-extrabold">
                Nhóm lỗi: {errorMeta.code}
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-800">{errorMeta.labelVi}</span>
          </div>

          {/* Visual Correction Diff */}
          <div className="rounded-xl bg-white border border-indigo-100 p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Giải phẫu & Sửa câu sai ({question.correct_answer}):
            </div>
            <div className="text-base leading-relaxed font-medium text-slate-900">
              {question.correction_segments.map((seg, idx) => {
                if (seg.kind === 'delete') {
                  return (
                    <span
                      key={idx}
                      className="mx-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-rose-800 line-through decoration-2 decoration-rose-600 font-bold"
                      title="Phần cần lược bỏ"
                    >
                      {seg.text}
                    </span>
                  );
                }
                if (seg.kind === 'insert') {
                  return (
                    <span
                      key={idx}
                      className="mx-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900 underline decoration-2 decoration-emerald-600 font-bold"
                      title="Phần cần bổ sung / thay thế"
                    >
                      +{seg.text}
                    </span>
                  );
                }
                return <span key={idx}>{seg.text}</span>;
              })}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Giải thích chi tiết: </strong>
            {question.explanation_vi}
          </p>

          {question.grammar_note && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{question.grammar_note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

