import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  EyeOff,
  Lock,
  PenTool,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  clearPersistedSummaryState,
  computePhaseRemainingSeconds,
  countChineseSummaryChars,
  detectDirectQuotes,
  loadPersistedSummaryState,
  normalizeSummaryPhaseState,
  SAMPLE_HSK6_SUMMARY_PASSAGE,
  savePersistedSummaryState,
  transitionToSubmittedPhase,
  transitionToWritingPhase,
  type Hsk6SummaryPersistedState,
} from './hsk6StateMachine.ts';

interface Hsk6TwoPhaseSummarySimulatorProps {
  attemptKey?: string;
  passageParagraphs?: string[];
  practiceMode?: boolean;
  onSubmitSummary?: (payload: { title: string; summary: string; charCount: number }) => void;
}

const SIX_NARRATIVE_ELEMENTS = [
  { zh: '人物', vi: 'Nhân vật chính & phụ', hint: 'Ai? Quan hệ thế nào?' },
  { zh: '时间', vi: 'Thời gian', hint: 'Bối cảnh & các mốc chuyển biến' },
  { zh: '地点', vi: 'Địa điểm', hint: 'Sự việc diễn ra ở đâu?' },
  { zh: '起因', vi: 'Nguyên nhân', hint: 'Vì sao câu chuyện bắt đầu?' },
  { zh: '经过', vi: 'Diễn biến', hint: 'Xung đột & hành động then chốt' },
  { zh: '结果', vi: 'Kết quả', hint: 'Kết cục & thông điệp cuối cùng' },
];

function formatCountdown(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const Hsk6TwoPhaseSummarySimulator: React.FC<Hsk6TwoPhaseSummarySimulatorProps> = ({
  attemptKey = SAMPLE_HSK6_SUMMARY_PASSAGE.id,
  passageParagraphs = SAMPLE_HSK6_SUMMARY_PASSAGE.paragraphs,
  practiceMode = true,
  onSubmitSummary,
}) => {
  const storageKey = `hanzigo_hsk6_summary_state_${attemptKey}`;

  const [state, setState] = useState<Hsk6SummaryPersistedState>(() =>
    loadPersistedSummaryState(storageKey, attemptKey)
  );
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [showSixElements, setShowSixElements] = useState<boolean>(true);

  const sourceCharCount = useMemo(
    () => countChineseSummaryChars(passageParagraphs.join('')),
    [passageParagraphs]
  );

  // Tick every second and enforce automatic phase transitions
  useEffect(() => {
    if (state.phase === 'SUBMITTED') return;
    const timer = setInterval(() => {
      const currentNow = Date.now();
      setNowMs(currentNow);
      setState((prev) => {
        const normalized = normalizeSummaryPhaseState(prev, currentNow);
        if (normalized.phase !== prev.phase) {
          savePersistedSummaryState(storageKey, normalized);
          if (normalized.phase === 'SUBMITTED' && onSubmitSummary) {
            onSubmitSummary({
              title: normalized.title,
              summary: normalized.summary,
              charCount: countChineseSummaryChars(normalized.summary),
            });
          }
        }
        return normalized;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.phase, storageKey, onSubmitSummary]);

  const remainingSeconds = computePhaseRemainingSeconds(state, nowMs);
  const summaryCharCount = useMemo(
    () => countChineseSummaryChars(state.summary),
    [state.summary]
  );
  const directQuotes = useMemo(() => detectDirectQuotes(state.summary), [state.summary]);

  const updateDraft = (patch: Partial<Pick<Hsk6SummaryPersistedState, 'title' | 'summary'>>) => {
    if (state.phase !== 'WRITING_ONLY') return;
    setState((prev) => {
      const next = { ...prev, ...patch };
      savePersistedSummaryState(storageKey, next);
      return next;
    });
  };

  const handleAdvanceToWritingEarly = () => {
    const now = Date.now();
    setNowMs(now);
    setState((prev) => {
      const next = transitionToWritingPhase(prev, now);
      savePersistedSummaryState(storageKey, next);
      return next;
    });
  };

  const handleSubmit = () => {
    const now = Date.now();
    setNowMs(now);
    setState((prev) => {
      const next = transitionToSubmittedPhase(prev, now);
      savePersistedSummaryState(storageKey, next);
      if (onSubmitSummary) {
        onSubmitSummary({
          title: next.title,
          summary: next.summary,
          charCount: countChineseSummaryChars(next.summary),
        });
      }
      return next;
    });
  };

  const handleResetSimulator = () => {
    clearPersistedSummaryState(storageKey);
    const now = Date.now();
    setNowMs(now);
    setState(loadPersistedSummaryState(storageKey, attemptKey, now));
  };

  const charStatusColor =
    summaryCharCount === 0
      ? 'text-slate-500'
      : summaryCharCount < 380
        ? 'text-amber-600'
        : summaryCharCount <= 420
          ? 'text-emerald-600'
          : 'text-rose-600';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Phase Banner & Countdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
              HSK 6 · Viết (Câu 101 · 缩写)
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                state.phase === 'READING_ONLY'
                  ? 'bg-sky-100 text-sky-800'
                  : state.phase === 'WRITING_ONLY'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {state.phase === 'READING_ONLY'
                ? 'Pha 1/2: Chỉ Đọc bài gốc (10 phút)'
                : state.phase === 'WRITING_ONLY'
                  ? 'Pha 2/2: Viết tóm tắt (35 phút)'
                  : 'Đã nộp bài'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Trạng thái & thời gian được khóa theo đồng hồ hệ thống (chống reset khi tải lại trang).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {state.phase !== 'SUBMITTED' && (
            <div
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 font-mono text-lg font-black ${
                remainingSeconds <= 60
                  ? 'border-rose-300 bg-rose-50 text-rose-700 animate-pulse'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{formatCountdown(remainingSeconds)}</span>
            </div>
          )}

          {practiceMode && (
            <button
              type="button"
              onClick={handleResetSimulator}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Làm lại bài mô phỏng 2 pha từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: READING_ONLY (10 minutes) — Source passage visible, Writing locked */}
      {state.phase === 'READING_ONLY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Passage Panel */}
          <div className="lg:col-span-8 rounded-2xl border border-sky-200 bg-sky-50/30 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Bài đọc gốc (~{sourceCharCount} chữ)</span>
              </div>
              <button
                type="button"
                onClick={handleAdvanceToWritingEarly}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer transition"
              >
                <span>Tôi đã đọc xong -&gt; Chuyển sang Viết sớm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-[15px] leading-relaxed text-slate-800 max-h-[460px] overflow-y-auto pr-2">
              {passageParagraphs.map((para, idx) => (
                <p key={idx} className="indent-7">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Locked Writing Notice + 6 Narrative Elements */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Khung soạn thảo đang khóa
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Theo đúng quy chế thi HSK 6, trong 10 phút đầu thí sinh chỉ được đọc bài và ghi nhớ, không được gõ nháp.
              </p>
            </div>

            {practiceMode && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Gợi ý ghi nhớ 6 yếu tố tự sự
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSixElements((v) => !v)}
                    className="text-[11px] font-bold text-amber-700 underline cursor-pointer"
                  >
                    {showSixElements ? 'Thu gọn' : 'Mở'}
                  </button>
                </div>

                {showSixElements && (
                  <div className="grid grid-cols-2 gap-2">
                    {SIX_NARRATIVE_ELEMENTS.map((el) => (
                      <div
                        key={el.zh}
                        className="rounded-xl bg-white border border-amber-100 p-2 text-xs"
                      >
                        <div className="font-black text-amber-900">
                          {el.zh} <span className="font-semibold text-slate-600">({el.vi})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{el.hint}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2 & SUBMITTED: Passage completely unmounted from DOM */}
      {state.phase !== 'READING_ONLY' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
            <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              Văn bản gốc đã được <strong>thu hồi vĩnh viễn khỏi màn hình</strong> theo quy chế HSK 6. Hãy tự đặt tiêu đề và viết lại bài tóm tắt (~400 chữ).
            </span>
          </div>

          {/* Centered Title Input (标题) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 text-center">
              Tiêu đề bài viết (标题 — Bắt buộc căn giữa)
            </label>
            <input
              type="text"
              disabled={state.phase === 'SUBMITTED'}
              value={state.title}
              onChange={(e) => updateDraft({ title: e.target.value })}
              placeholder="Nhập tiêu đề tiếng Trung (ví dụ: 时间医生陈伯)..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-center text-base font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50"
            />
          </div>

          {/* Direct Quote Warning */}
          {directQuotes.length > 0 && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cảnh báo quy tắc 缩写:</strong> Phát hiện dấu ngoặc kép trích dẫn trực tiếp ({directQuotes[0]}). Hãy chuyển toàn bộ lời thoại trực tiếp sang câu trần thuật gián tiếp (转述)!
              </div>
            </div>
          )}

          {/* Summary Textarea */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                Nội dung tóm tắt (Mục tiêu chuẩn: 380 – 420 chữ)
              </span>
              <span className={`font-extrabold ${charStatusColor}`}>
                {summaryCharCount} / 400 chữ
              </span>
            </div>

            <textarea
              disabled={state.phase === 'SUBMITTED'}
              value={state.summary}
              onChange={(e) => updateDraft({ summary: e.target.value })}
              rows={11}
              placeholder="Viết bài tóm tắt bằng tiếng Trung (không sao chép nguyên văn lời thoại trực tiếp)..."
              className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-relaxed text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50"
            />

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  summaryCharCount >= 380 && summaryCharCount <= 420
                    ? 'bg-emerald-500'
                    : summaryCharCount > 450
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.round((summaryCharCount / 420) * 100))}%` }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            {state.phase === 'SUBMITTED' ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã nộp bài tóm tắt ({summaryCharCount} chữ).
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Tự động lưu nháp liên tục vào trình duyệt.
              </div>
            )}

            {state.phase === 'WRITING_ONLY' && (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Nộp bài tóm tắt (Câu 101)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

