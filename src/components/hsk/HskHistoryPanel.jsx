import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ArrowUpDown,
  BookOpen,
  Info,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  getUserExamHistory,
  compareExamAttempts,
} from '../../services/hskService';

export function AttemptComparisonModal({ comparison, onClose, onReviewAttempt }) {
  const { baseline, target, metrics, skillsDelta, examTitle, examLevel } = comparison;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90dvh] overflow-y-auto pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              {examLevel} • Đối chiếu 2 lần thi
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {examTitle}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Head-to-Head Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
          {/* Baseline */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Lần thi trước</span>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {baseline.score} <span className="text-xs text-slate-400">/{baseline.maxScore}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Độ chính xác: {baseline.accuracyPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {new Date(baseline.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Delta Progression */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-center items-center text-center ${
              metrics.improved
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {metrics.improved ? 'Tiến bộ' : 'Cần cải thiện'}
            </span>
            <div className="text-2xl font-black mt-1 flex items-center space-x-1">
              {metrics.improved ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-rose-600" />}
              <span>{metrics.scoreDelta >= 0 ? `+${metrics.scoreDelta}` : metrics.scoreDelta} điểm</span>
            </div>
            <div className="text-xs font-semibold mt-0.5">
              {metrics.accuracyDelta >= 0 ? `+${metrics.accuracyDelta}%` : `${metrics.accuracyDelta}%`} chính xác
            </div>
            <div className="text-[11px] opacity-80 mt-1">
              {metrics.timeDeltaSeconds < 0
                ? `Nhanh hơn ${Math.abs(metrics.timeDeltaSeconds)} giây`
                : `Thêm ${metrics.timeDeltaSeconds} giây`}
            </div>
          </div>

          {/* Target */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider block">Lần thi sau</span>
            <div className="text-2xl font-extrabold text-indigo-950 dark:text-indigo-200 mt-1">
              {target.score} <span className="text-xs text-slate-400">/{target.maxScore}</span>
            </div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
              Độ chính xác: {target.accuracyPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {new Date(target.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Skill-by-skill Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Đối chiếu chi tiết theo từng kỹ năng:
          </h4>
          <div className="space-y-2.5">
            {Object.entries(skillsDelta).map(([key, s]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                  <span className="text-slate-400 ml-2">
                    Lần 1: {s.baselinePoints}đ ➔ Lần 2: {s.targetPoints}đ
                  </span>
                </div>
                <div className={`font-bold ${s.pointsDelta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.pointsDelta >= 0 ? `+${s.pointsDelta}đ` : `${s.pointsDelta}đ`} ({s.accuracyDelta >= 0 ? `+${s.accuracyDelta}%` : `${s.accuracyDelta}%`})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => onReviewAttempt(baseline.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Xem lại Lần 1
            </button>
            <button
              onClick={() => onReviewAttempt(target.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Xem lại Lần 2
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer w-full sm:w-auto"
          >
            Đóng bảng đối chiếu
          </button>
        </div>
      </div>
    </div>
  );
}

export function HskHistoryView({ user, onNavigate }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareError, setCompareError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserExamHistory({ user }).then((data) => {
      setAttempts(data);
      setLoading(false);
    });
  }, [user]);

  const filteredAttempts = useMemo(() => {
    if (levelFilter === 'all') return attempts;
    return attempts.filter((a) => a.examLevel?.toLowerCase() === levelFilter.toLowerCase());
  }, [attempts, levelFilter]);

  const toggleSelectAttempt = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
    setCompareError(null);
  };

  const handleExecuteComparison = () => {
    if (selectedIds.length !== 2) {
      setCompareError('Vui lòng chọn chính xác 2 lượt làm bài để đối chiếu.');
      return;
    }

    const attA = attempts.find((a) => a.id === selectedIds[0]);
    const attB = attempts.find((a) => a.id === selectedIds[1]);

    if (!attA || !attB) {
      setCompareError('Không tìm thấy thông tin lượt thi đã chọn.');
      return;
    }

    const result = compareExamAttempts(attA, attB);
    if (!result.compatible) {
      setCompareError(result.reason);
      return;
    }

    setComparisonResult(result);
    setCompareError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-amber-500" />
            Lịch Sử Làm Bài &amp; Tiến Độ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tất cả bài thi bạn đã hoàn thành và so sánh để thấy rõ sự tiến bộ qua từng đợt luyện.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {attempts.length >= 2 && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedIds([]);
                setCompareError(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                compareMode
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{compareMode ? 'Hủy chế độ so sánh' : 'So sánh 2 lần thi'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('exams')}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer flex items-center space-x-1"
          >
            <BookOpen className="w-4 h-4" />
            <span>Làm đề mới</span>
          </button>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'HSK 1', 'HSK 2', 'HSK 3'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevelFilter(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              levelFilter === lvl
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
          </button>
        ))}
      </div>

      {/* Compare Mode Notice Banner */}
      {compareMode && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              Chọn 2 lượt thi của <strong>cùng một đề thi</strong> để đối chiếu điểm số và độ chính xác (Đã chọn: {selectedIds.length}/2).
            </span>
          </div>
          {selectedIds.length === 2 && (
            <button
              onClick={handleExecuteComparison}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Xem kết quả so sánh
            </button>
          )}
        </div>
      )}

      {/* Compare Error Notice */}
      {compareError && (
        <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{compareError}</span>
        </div>
      )}

      {/* Attempts List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tải lịch sử bài làm...</p>
        </div>
      ) : filteredAttempts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có lượt thi nào</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Hãy bắt đầu thử sức với các đề thi HSK chuẩn mẫu để hệ thống ghi nhận lịch sử và phân tích năng lực.
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Làm bài thi đầu tiên ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAttempts.map((att) => {
            const isSelected = selectedIds.includes(att.id);
            const formattedDate = att.createdAt
              ? new Date(att.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
              : 'Gần đây';

            return (
              <div
                key={att.id}
                onClick={() => {
                  if (compareMode) toggleSelectAttempt(att.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-amber-300'
                } ${compareMode ? 'cursor-pointer' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start space-x-3">
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectAttempt(att.id)}
                        className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    )}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
                          {att.examLevel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            att.passed
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {att.passed ? '✓ Đạt' : '✗ Chưa đạt'}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {att.examTitle || att.examId}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Đúng: <strong>{att.correctCount || 0}</strong>/{att.totalQuestions || 20} câu</span>
                        <span>•</span>
                        <span>Thời gian: <strong>{Math.floor((att.timeSpentSeconds || 0) / 60)}p {(att.timeSpentSeconds || 0) % 60}s</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {att.score} <span className="text-xs font-normal text-slate-400">/ {att.maxScore}</span>
                      </div>
                      <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {att.accuracyPercentage}% chính xác
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('result', att.id);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('take', att.examId);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        Thi lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      {comparisonResult && (
        <AttemptComparisonModal
          comparison={comparisonResult}
          onClose={() => setComparisonResult(null)}
          onReviewAttempt={(id) => onNavigate('result', id)}
        />
      )}
    </div>
  );
}
