import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileText,
  PenTool,
  Play,
  Sparkles,
} from 'lucide-react';
import DashboardWidget from '../../components/dashboard/DashboardWidget.jsx';
import {
  addCorrectionToMistakeNotebook,
  countChineseCharacters,
  evaluateHskWriting,
  HSK_WRITING_PROMPTS,
  type HskWritingTaskPrompt,
  type InlineCorrection,
  type WritingEvaluationResult,
} from '../../services/writingEvaluationService.ts';

export interface HskWritingEvaluatorProps {
  user?: { id?: string | null } | null;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function HskWritingEvaluator({
  user = null,
}: HskWritingEvaluatorProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    HSK_WRITING_PROMPTS[2].id // Default HSK 5 5-keyword 80-char essay
  );
  const [responseText, setResponseText] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<WritingEvaluationResult | null>(null);
  const [savedCorrections, setSavedCorrections] = useState<Record<string, boolean>>({});
  const [startTimeMs, setStartTimeMs] = useState<number>(() => Date.now());

  // HSK 6 缩写 10m reading -> 35m writing timer state
  const [hsk6Phase, setHsk6Phase] = useState<'idle' | 'reading' | 'writing'>('idle');
  const [secondsLeft, setSecondsLeft] = useState<number>(600);

  const selectedTask: HskWritingTaskPrompt = useMemo(
    () =>
      HSK_WRITING_PROMPTS.find((t) => t.id === selectedTaskId) ??
      HSK_WRITING_PROMPTS[0],
    [selectedTaskId]
  );

  const liveCharCount = useMemo(
    () => countChineseCharacters(responseText),
    [responseText]
  );

  const keywordStatuses = useMemo(
    () =>
      selectedTask.mandatoryKeywords.map((kw) => ({
        keyword: kw,
        used: responseText.includes(kw),
      })),
    [selectedTask.mandatoryKeywords, responseText]
  );

  useEffect(() => {
    if (selectedTask.taskType !== 'hsk6_summary' || hsk6Phase === 'idle') {
      return undefined;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (hsk6Phase === 'reading') {
            setHsk6Phase('writing');
            return 35 * 60;
          }
          setHsk6Phase('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedTask.taskType, hsk6Phase]);

  const handleSelectTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setResponseText('');
    setResult(null);
    setSavedCorrections({});
    setStartTimeMs(Date.now());
    setHsk6Phase('idle');
    setSecondsLeft(600);
  }, []);

  const handleStartHsk6Reading = useCallback(() => {
    setHsk6Phase('reading');
    setSecondsLeft(10 * 60);
  }, []);

  const handleSwitchToHsk6Writing = useCallback(() => {
    setHsk6Phase('writing');
    setSecondsLeft(35 * 60);
    setStartTimeMs(Date.now());
  }, []);

  const handleEvaluate = useCallback(async () => {
    if (!responseText.trim()) return;
    setEvaluating(true);
    try {
      const durationMs = Math.max(0, Date.now() - startTimeMs);
      const evalRes = await evaluateHskWriting({
        user,
        task: selectedTask,
        responseText,
        durationMs,
      });
      setResult(evalRes);
    } finally {
      setEvaluating(false);
    }
  }, [responseText, startTimeMs, user, selectedTask]);

  const handleAddToMistakeNotebook = useCallback(
    async (corr: InlineCorrection) => {
      await addCorrectionToMistakeNotebook({
        user,
        task: selectedTask,
        correction: corr,
      });
      setSavedCorrections((prev) => ({ ...prev, [corr.id]: true }));
    },
    [user, selectedTask]
  );

  const lengthInRange =
    liveCharCount >= selectedTask.targetMinChars &&
    liveCharCount <= selectedTask.targetMaxChars;

  return (
    <section aria-label="HSK Writing & Translation Evaluator" className="space-y-6">
      <DashboardWidget
        title="Chấm điểm Viết & Tóm tắt HSK 4–6 (Rubric Evaluator)"
        subtitle="Hỗ trợ 连词成句, 看图造句, 80字短文 (5 từ bắt buộc) & HSK 6 缩写 (~400 chữ)"
        icon={PenTool}
        action={
          <select
            aria-label="Chọn dạng bài viết HSK 4-6"
            value={selectedTaskId}
            onChange={(e) => handleSelectTask(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer max-w-xs"
          >
            {HSK_WRITING_PROMPTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        }
      >
        <div className="space-y-4">
          {/* Prompt Box */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2">
            <p className="text-xs font-bold text-[#E85D3F]">
              {selectedTask.instructionVi}
            </p>
            <p className="text-sm font-semibold text-[#243447] dark:text-white">
              {selectedTask.promptText}
            </p>

            {/* Mandatory Keywords live status */}
            {keywordStatuses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywordStatuses.map((kw) => (
                  <span
                    key={kw.keyword}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      kw.used
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-white dark:bg-[#1E293B] text-[#748092] border border-[#E5D8C8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {kw.used && <CheckCircle2 size={11} />}
                    {kw.keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* HSK 6 缩写 10m Reading -> 35m Writing Timer Bar */}
          {selectedTask.taskType === 'hsk6_summary' && selectedTask.passageText && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-800 dark:text-indigo-300">
                  <Clock size={15} />
                  <span>
                    HSK 6 缩写 Timer:{' '}
                    {hsk6Phase === 'idle'
                      ? 'Sẵn sàng (10p đọc → 35p viết)'
                      : hsk6Phase === 'reading'
                      ? `Pha Đọc (còn ${formatTimer(secondsLeft)})`
                      : `Pha Viết (còn ${formatTimer(secondsLeft)} · Đã ẩn văn bản)`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hsk6Phase === 'idle' && (
                    <button
                      type="button"
                      onClick={handleStartHsk6Reading}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Bắt đầu đọc 10:00</span>
                    </button>
                  )}
                  {hsk6Phase === 'reading' && (
                    <button
                      type="button"
                      onClick={handleSwitchToHsk6Writing}
                      className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <EyeOff size={13} />
                      <span>Ẩn bài & Chuyển sang Viết 35:00</span>
                    </button>
                  )}
                </div>
              </div>

              {hsk6Phase === 'reading' && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-indigo-100 dark:border-indigo-900/40 text-sm leading-relaxed text-[#243447] dark:text-gray-200 max-h-56 overflow-y-auto">
                  {selectedTask.passageText}
                </div>
              )}
            </div>
          )}

          {/* Writing Input Area & Live Character Counter */}
          <div className="space-y-2">
            <textarea
              aria-label="Bài viết tiếng Trung"
              rows={selectedTask.hskLevel === 4 ? 3 : 6}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              disabled={selectedTask.taskType === 'hsk6_summary' && hsk6Phase === 'reading'}
              placeholder={
                selectedTask.taskType === 'hsk6_summary' && hsk6Phase === 'reading'
                  ? 'Đang ở pha đọc 10 phút. Nhấn "Ẩn bài & Chuyển sang Viết" để bắt đầu viết tóm tắt...'
                  : 'Nhập câu hoặc đoạn văn tiếng Trung của bạn tại đây...'
              }
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E5D8C8] dark:border-[#2B3A4F] text-sm sm:text-base text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold ${
                    lengthInRange
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  Số chữ Hán: {liveCharCount} (Mục tiêu: {selectedTask.targetMinChars}–{selectedTask.targetMaxChars} chữ)
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleEvaluate()}
                disabled={evaluating || !responseText.trim()}
                className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] disabled:opacity-50 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <Play size={13} />
                <span>{evaluating ? 'Đang chấm bài...' : 'Chấm điểm & Sửa lỗi'}</span>
              </button>
            </div>
          </div>
        </div>
      </DashboardWidget>

      {/* Evaluation Results: Rubric + Interactive Diff Viewer + Model Rewrites */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rubric Dimensions */}
          <DashboardWidget
            title={`Kết quả Đánh giá: ${result.overall_score}/100`}
            subtitle={`Thang điểm chuẩn HSK ${result.hskLevel} Writing: ${result.official_hsk_writing_score}/100`}
            icon={Sparkles}
            className="lg:col-span-5"
          >
            <div className="space-y-3">
              {[
                { key: 'task_fulfillment', label: 'Hoàn thành yêu cầu (Task Fulfillment)', val: result.dimensions.task_fulfillment },
                { key: 'grammar_accuracy', label: 'Độ chính xác ngữ pháp (Grammar)', val: result.dimensions.grammar_accuracy },
                { key: 'vocabulary_richness', label: 'Độ phong phú từ vựng (Vocabulary)', val: result.dimensions.vocabulary_richness },
                { key: 'coherence_cohesion', label: 'Mạch lạc & Dấu câu (Coherence)', val: result.dimensions.coherence_cohesion },
              ].map((dim) => (
                <div key={dim.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#243447] dark:text-white">
                    <span>{dim.label}</span>
                    <span className="text-[#E85D3F]">{dim.val}/25</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#F3ECE4] dark:bg-[#0F172A] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#E85D3F]"
                      style={{ width: `${Math.round((dim.val / 25) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Interactive Diff Viewer + Model Rewrites */}
          <DashboardWidget
            title="Sửa lỗi Chi tiết & Bài mẫu Đối chiếu"
            subtitle={`${result.inline_corrections.length} điểm cần chỉnh sửa`}
            icon={FileText}
            className="lg:col-span-7"
          >
            <div className="space-y-4">
              {result.inline_corrections.length === 0 ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Không phát hiện lỗi ngữ pháp 病句 hay thiếu từ khóa bắt buộc!</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.inline_corrections.map((corr) => {
                    const isSaved = Boolean(savedCorrections[corr.id]);
                    return (
                      <div
                        key={corr.id}
                        className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-1.5 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="line-through text-rose-600 dark:text-rose-400 font-bold">
                              {corr.original_span}
                            </span>
                            <span>→</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {corr.corrected_span}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            {corr.hsk_grammar_point}
                          </span>
                        </div>
                        <p className="text-[#5B6B7F] dark:text-gray-300 flex items-start gap-1.5">
                          <AlertCircle size={13} className="text-[#E85D3F] shrink-0 mt-0.5" />
                          <span>{corr.explanation_vi}</span>
                        </p>
                        <div className="pt-1">
                          <button
                            type="button"
                            disabled={isSaved}
                            onClick={() => void handleAddToMistakeNotebook(corr)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E5D8C8] dark:border-[#2B3A4F] text-[11px] font-bold text-[#243447] dark:text-white hover:border-[#E85D3F] cursor-pointer inline-flex items-center gap-1 disabled:opacity-60"
                          >
                            <BookmarkPlus size={12} className="text-[#E85D3F]" />
                            <span>{isSaved ? 'Đã lưu Sổ tay lỗi' : 'Add to Mistake Notebook'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Model Rewrites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-1">
                  <div className="text-[11px] font-extrabold uppercase text-sky-600 dark:text-sky-400">
                    Band-Pass Version
                  </div>
                  <p className="text-xs text-[#243447] dark:text-gray-200 leading-relaxed">
                    {result.model_rewrites.band_pass}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-1">
                  <div className="text-[11px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                    High-Scoring Native Version
                  </div>
                  <p className="text-xs text-[#243447] dark:text-gray-200 leading-relaxed">
                    {result.model_rewrites.high_scoring_native}
                  </p>
                </div>
              </div>
            </div>
          </DashboardWidget>
        </div>
      )}
    </section>
  );
}

