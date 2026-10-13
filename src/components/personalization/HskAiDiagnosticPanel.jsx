import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight, 
  Target, 
  Lightbulb, 
  Info,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import AiContextBadge from './AiContextBadge';
import { getHskMistakesDiagnosis } from '../../services/aiGateway';

/**
 * HskAiDiagnosticPanel
 * Hiển thị chẩn đoán lỗi sai HSK theo kỹ năng, quy luật lỗi lặp lại và kế hoạch ôn tập mục tiêu.
 * Minh bạch rõ ràng nguồn phân tích (AI Gợi ý hoặc Phân tích Sư phạm ngoại tuyến).
 * Luôn tuân thủ nguyên tắc không mạo danh chứng chỉ chính thức CTI/Hanban.
 */
export default function HskAiDiagnosticPanel({
  mistakes = [],
  attempts = [],
  user = null,
  onNavigate = null,
  compact = false
}) {
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const fetchDiagnosis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHskMistakesDiagnosis(mistakes, attempts, user);
      setDiagnosis(res);
    } catch (err) {
      console.warn('Lỗi tải chẩn đoán HSK:', err);
      setError('Không thể hoàn tất chẩn đoán lúc này.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnosis();
  }, [mistakes.length, attempts.length, user?.id]);

  if (!isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-between hover:bg-amber-500/15 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Xem Chẩn đoán lỗi sai AI & Chiến lược khắc phục ({mistakes.length} câu sai)
          </span>
          <ChevronRight className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900/40 dark:to-slate-900/20 rounded-3xl p-5 sm:p-6 border border-amber-500/20 dark:border-amber-500/30 shadow-xs mb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/15 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Chẩn Đoán Lỗi Sai & Chiến Lược Khắc Phục
              </h3>
              <AiContextBadge 
                type={diagnosis?.isOffline ? "pedagogy" : "ai_suggestion"} 
                label={diagnosis?.isOffline ? "Phân tích Sư phạm" : "AI Chẩn đoán"} 
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân tích mẫu sai lặp lại theo kỹ năng Nghe - Đọc - Viết & đề xuất hành động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={fetchDiagnosis}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Chẩn đoán lại"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Phân tích lại</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-8 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang đối chiếu dữ liệu bài thi với ma trận kỹ năng...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
          {error}
        </div>
      ) : diagnosis ? (
        <div className="pt-4 space-y-4">
          {/* Overall Diagnosis */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/15 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
              📌 Đánh giá tổng quát:
            </span>
            {diagnosis.overallDiagnosis}
          </div>

          {/* Recurring Patterns */}
          {Array.isArray(diagnosis.recurringErrorPatterns) && diagnosis.recurringErrorPatterns.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-rose-500" />
                Mẫu lỗi cần chú ý ({diagnosis.recurringErrorPatterns.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diagnosis.recurringErrorPatterns.map((pat, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs flex flex-col justify-between space-y-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {pat.errorType || 'Lỗi nhận diện'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          {pat.frequency || pat.skill}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {pat.description}
                      </p>
                    </div>

                    {pat.remedy && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-xl">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                        <div>
                          <strong className="font-bold">Khắc phục: </strong>
                          {pat.remedy}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Targeted Action Plan */}
          {Array.isArray(diagnosis.targetedPracticePlan) && diagnosis.targetedPracticePlan.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Kế hoạch khắc phục đề xuất
              </h4>
              <div className="space-y-2">
                {diagnosis.targetedPracticePlan.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                        {step.step || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {step.focus}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {step.recommendedAction}
                        </div>
                      </div>
                    </div>

                    {step.targetRoute && onNavigate && (
                      <button
                        onClick={() => onNavigate(step.targetRoute)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Thực hiện</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encouragement Note */}
          {diagnosis.encouragement && (
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 italic pt-1">
              "{diagnosis.encouragement}"
            </div>
          )}

          {/* Official HSK Separation Disclaimer */}
          <div className="pt-2">
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>
                <strong>Khẳng định độc lập:</strong> Kết quả chẩn đoán trên dựa trên dữ liệu các đề thi thử HanziGo, mang tính chất hỗ trợ sư phạm cá nhân và không thay thế kết quả đánh giá chứng chỉ HSK chính thức của Hanban/CTI.
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
