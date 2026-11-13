import React, { useState } from 'react';
import { Play, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import {
  evaluateDictationDiff,
  recordListeningProgress,
  type DictationEvaluationResult,
  type DictationMode,
  type ListeningTrack,
  type TranscriptSegment,
} from '../../services/listeningStudioService.ts';

interface SentenceDictationWorkbenchProps {
  track: ListeningTrack;
  segment: TranscriptSegment;
  totalSegments: number;
  user?: { id?: string | null } | null;
  onReplayCurrent: () => void;
  onNextSegment: () => void;
}

export const SentenceDictationWorkbench: React.FC<SentenceDictationWorkbenchProps> = ({
  track,
  segment,
  totalSegments,
  user,
  onReplayCurrent,
  onNextSegment,
}) => {
  const [mode, setMode] = useState<DictationMode>('hanzi');
  const [inputValue, setInputValue] = useState('');
  const [evaluation, setEvaluation] = useState<DictationEvaluationResult | null>(null);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [showAnswerHint, setShowAnswerHint] = useState(false);

  const handleCheck = async () => {
    if (!inputValue.trim()) return;
    const result = evaluateDictationDiff(inputValue, segment, mode);
    setEvaluation(result);

    const nextCompleted =
      result.accuracy >= 70 && !completedIndices.includes(segment.index)
        ? [...completedIndices, segment.index]
        : completedIndices;
    setCompletedIndices(nextCompleted);

    await recordListeningProgress({
      user,
      track,
      dictationAccuracy: result.accuracy,
      completedSegments: nextCompleted,
      quizScore: 0,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleCheck();
    }
  };

  const handleAdvance = () => {
    setInputValue('');
    setEvaluation(null);
    setShowAnswerHint(false);
    onNextSegment();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Nghe chép chính tả — Câu {segment.index + 1}/{totalSegments}
          </h3>
          <p className="text-xs text-slate-500">
            Nghe câu mẫu, gõ lại nội dung và nhấn <strong>Enter</strong> để chấm điểm từng chữ.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => {
              setMode('hanzi');
              setEvaluation(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              mode === 'hanzi' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Gõ Chữ Hán
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pinyin');
              setEvaluation(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              mode === 'pinyin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Gõ Pinyin
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onReplayCurrent}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition"
        >
          <Play className="w-3.5 h-3.5" />
          Phát câu này
        </button>

        <button
          type="button"
          onClick={() => setShowAnswerHint((v) => !v)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showAnswerHint ? 'Ẩn gợi ý nghĩa' : 'Xem gợi ý nghĩa'}
        </button>

        {completedIndices.length > 0 && (
          <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Đã chép chuẩn: {completedIndices.length}/{totalSegments} câu
          </span>
        )}
      </div>

      {showAnswerHint && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
          Nghĩa câu: {segment.vi}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'hanzi'
              ? 'Gõ chữ Hán bạn nghe được rồi nhấn Enter...'
              : 'Gõ Pinyin cách nhau bởi dấu cách (vd: ni hao qing wen)...'
          }
          className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={!inputValue.trim()}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 px-4 py-2 text-xs font-semibold text-white transition"
        >
          Chấm điểm
        </button>
      </div>

      {evaluation && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-slate-900">
                Độ chính xác: {evaluation.accuracy}% ({evaluation.correctCount}/
                {evaluation.totalExpected})
              </span>
            </div>

            {segment.index < totalSegments - 1 && (
              <button
                type="button"
                onClick={handleAdvance}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Câu tiếp theo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Diff Tokens */}
          <div className="flex flex-wrap gap-1.5">
            {evaluation.diffs.map((item, idx) => {
              if (item.status === 'correct') {
                return (
                  <span
                    key={`diff-${idx}`}
                    className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-sm font-semibold"
                  >
                    {item.char}
                  </span>
                );
              }
              if (item.status === 'wrong') {
                return (
                  <span
                    key={`diff-${idx}`}
                    title={`Đáp án đúng: ${item.expected}`}
                    className="px-2 py-1 rounded-lg bg-rose-100 text-rose-900 text-sm font-semibold"
                  >
                    {item.char} → <span className="underline">{item.expected}</span>
                  </span>
                );
              }
              if (item.status === 'missing') {
                return (
                  <span
                    key={`diff-${idx}`}
                    className="px-2 py-1 rounded-lg bg-amber-100 text-amber-900 text-sm font-semibold border border-dashed border-amber-400"
                  >
                    +{item.expected}
                  </span>
                );
              }
              return (
                <span
                  key={`diff-${idx}`}
                  className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-sm line-through"
                >
                  {item.char}
                </span>
              );
            })}
          </div>

          <div className="text-xs text-slate-600">
            <strong>Đáp án gốc:</strong> {segment.hanzi} ({segment.pinyin})
          </div>

          {evaluation.homophoneHints.length > 0 && (
            <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-2.5 space-y-1">
              <div className="text-xs font-bold text-indigo-800">Lưu ý chữ đồng âm dễ nhầm:</div>
              {evaluation.homophoneHints.map((hint, hIdx) => (
                <p key={`hint-${hIdx}`} className="text-xs text-indigo-900">
                  • {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

