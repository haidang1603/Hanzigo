import React, { useState, useEffect, useMemo } from 'react';
import {
  BookMarked,
  BookOpen,
  Zap,
  Layers,
  AlertCircle,
  CheckCircle2,
  Search,
  RefreshCw,
  CheckCircle,
  Volume2,
  Check,
  Trash2,
  BarChart2,
  Info,
  Target,
  Flame,
  Compass,
  ChevronRight,
} from 'lucide-react';
import {
  getMistakeNotebook,
  updateMistakeStatus,
  removeMistakeItem,
  getMistakePracticeExam,
  getUserExamHistory,
  generateStudyAnalytics,
  generateStudyRecommendations,
} from '../../services/hskService';
import { speakChinese } from '../../utils/audio';
import HskAiDiagnosticPanel from '../personalization/HskAiDiagnosticPanel';

export function HskMistakesView({ user, onNavigate }) {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'needs_review', 'mastered'
  const [levelFilter, setLevelFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionId, setActionId] = useState(null);

  const loadMistakes = () => {
    setLoading(true);
    getMistakeNotebook({
      user,
      level: levelFilter,
      skill: skillFilter,
      status: statusFilter,
      search: searchQuery,
    }).then((data) => {
      setMistakes(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadMistakes();
  }, [user, statusFilter, levelFilter, skillFilter, searchQuery]);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'mastered' ? 'needs_review' : 'mastered';
    setActionId(item.id);
    await updateMistakeStatus(item.id, nextStatus, user);
    setActionId(null);
    loadMistakes();
  };

  const handleRemove = async (item) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này khỏi sổ tay câu sai?')) return;
    setActionId(item.id);
    await removeMistakeItem(item.id, user);
    setActionId(null);
    loadMistakes();
  };

  const unmasteredCount = mistakes.filter((m) => m.status === 'needs_review').length;
  const masteredCount = mistakes.filter((m) => m.status === 'mastered').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-7 h-7 text-amber-500" />
            Sổ Tay Câu Hỏi Sai &amp; Bẫy Đề
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nơi tập hợp tự động các câu bạn làm sai hoặc chưa chắc chắn. Ôn luyện tập trung để không lặp lại lỗi sai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.location.hash = '#materials?category=grammar';
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra cứu ngữ pháp</span>
          </button>
          {unmasteredCount > 0 && (
            <button
              onClick={async () => {
                const practice = await getMistakePracticeExam({ user, level: levelFilter });
                if (practice) {
                  onNavigate('take', practice.id);
                } else {
                  alert('Không có câu hỏi cần ôn tập.');
                }
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Luyện {unmasteredCount} câu sai ngay</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{mistakes.length}</div>
            <div className="text-xs text-slate-500">Tổng số câu trong sổ tay</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-rose-600">{unmasteredCount}</div>
            <div className="text-xs text-slate-500">Cần ôn lại (Chưa thành thạo)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-600">{masteredCount}</div>
            <div className="text-xs text-slate-500">Đã hiểu &amp; thành thạo</div>
          </div>
        </div>
      </div>

      {/* AI Sư phạm: Chẩn đoán lỗi sai sổ tay */}
      {mistakes.length > 0 && (
        <HskAiDiagnosticPanel
          mistakes={mistakes}
          user={user}
          onNavigate={onNavigate}
        />
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm Chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Level Dropdown */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="HSK 1">HSK 1</option>
            <option value="HSK 2">HSK 2</option>
            <option value="HSK 3">HSK 3</option>
          </select>

          {/* Skill Dropdown */}
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="listening">Nghe hiểu</option>
            <option value="reading">Đọc hiểu</option>
            <option value="writing">Viết</option>
          </select>
        </div>

        {/* Status Tab Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 mr-2">Trạng thái:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'needs_review', label: '🔴 Cần ôn lại' },
            { id: 'mastered', label: '🟢 Đã hiểu' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tải sổ tay câu sai...</p>
        </div>
      ) : mistakes.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Không có câu hỏi sai nào trong bộ lọc</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Rất tốt! Bạn không có câu sai tồn đọng nào hoặc tất cả câu hỏi đã được đánh dấu Đã hiểu.
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Thử sức đề thi mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((item) => {
            const isMastered = item.status === 'mastered';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  isMastered
                    ? 'border-emerald-200 dark:border-emerald-950/60 opacity-80'
                    : 'border-slate-200/90 dark:border-slate-800 shadow-xs'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
                      {item.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                      {item.category || (item.partType === 'listening' ? 'Nghe hiểu' : 'Đọc hiểu')}
                    </span>
                    {item.mistakeCount > 1 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                        Đã sai {item.mistakeCount} lần
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {isMastered ? '✓ Đã hiểu' : '● Cần ôn lại'}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                      {item.prompt}
                    </h3>
                    {item.pinyin && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                        {item.pinyin}
                      </div>
                    )}
                    {item.translation && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                        {item.translation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => speakChinese(item.prompt)}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                  {item.options?.map((opt, idx) => {
                    const isCorrect = idx === item.correctAnswerIndex;
                    const isUserChoice = idx === item.userAnswerIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold'
                            : isUserChoice
                            ? 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 line-through'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div>
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && <span className="text-emerald-600 text-[11px] font-bold">✓ Đáp án đúng</span>}
                        {isUserChoice && !isCorrect && <span className="text-rose-600 text-[11px] font-bold">✗ Bạn đã chọn</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300 my-3">
                  <strong className="text-amber-900 dark:text-amber-300 block mb-0.5 font-bold">
                    💡 Phân tích bẫy sai &amp; Lời giải:
                  </strong>
                  {item.explanation || 'Chưa có lời giải chi tiết cho câu hỏi này.'}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Nguồn: {item.examTitle || item.examId}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={actionId === item.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                        isMastered
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Đổi sang Cần ôn' : 'Đánh dấu Đã hiểu'}</span>
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      disabled={actionId === item.id}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Xóa câu hỏi khỏi sổ tay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function HskAnalyticsView({ user, onNavigate, setActiveTab }) {
  const [attempts, setAttempts] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserExamHistory({ user }),
      getMistakeNotebook({ user }),
    ]).then(([attData, mstData]) => {
      setAttempts(attData);
      setMistakes(mstData);
      setLoading(false);
    });
  }, [user]);

  const analytics = useMemo(() => {
    return generateStudyAnalytics(attempts, mistakes);
  }, [attempts, mistakes]);

  const recommendations = useMemo(() => {
    return generateStudyRecommendations(analytics, mistakes);
  }, [analytics, mistakes]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-7 h-7 text-amber-500" />
          Báo Cáo Tiến Độ &amp; Khuyến Nghị Học Tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống phân tích năng lực chuẩn xác dựa trên kết quả các bài thi thử bạn đã hoàn thành.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang tổng hợp báo cáo phân tích...</p>
        </div>
      ) : (
        <>
          {/* Data Honesty Banner */}
          <div
            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-start space-x-3 border ${
              analytics.dataStatus === 'no_data'
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                : analytics.dataStatus === 'insufficient'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">
                {analytics.dataStatus === 'no_data'
                  ? 'Chưa có dữ liệu bài thi'
                  : analytics.dataStatus === 'insufficient'
                  ? 'Dữ liệu đang thu thập (Chưa đủ 3 đề thi)'
                  : 'Dữ liệu đo lường tin cậy'}
              </strong>
              <span>{analytics.message}</span>
            </div>
          </div>

          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Đề hoàn thành</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {analytics.totalExams}
              </div>
              <div className="text-xs text-slate-500 mt-1">Tổng câu: {analytics.totalQuestions}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tỷ lệ đỗ kỳ thi</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                {analytics.passRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Chuẩn HSK: &gt;= 60%</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Độ chính xác</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                {analytics.overallAccuracy}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Đúng: {analytics.totalCorrect} câu</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Thời gian tích lũy</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                {analytics.totalTimeMinutes} <span className="text-xs font-normal text-slate-400">phút</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Luyện thi thực chiến</div>
            </div>
          </div>

          {/* Skill Accuracy & Level Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Skills Progress */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Độ chính xác theo Kỹ năng
              </h3>

              <div className="space-y-4">
                {Object.entries(analytics.skillsAccuracy).map(([key, s]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        {s.accuracy}% ({s.correct}/{s.total} câu)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          s.accuracy >= 80 ? 'bg-emerald-500' : s.accuracy >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(s.accuracy, 2))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Performance & Frequently Missed */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Các dạng câu hỏi cần chú ý nhất
              </h3>

              {analytics.frequentlyMissedCategories.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Chưa ghi nhận lỗi sai định kỳ nào trong sổ tay.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {analytics.frequentlyMissedCategories.map((cat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {cat.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-[11px]">
                        Làm sai {cat.count} lần
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Sư phạm: Chẩn đoán toàn diện kỹ năng & khắc phục lỗi */}
          <HskAiDiagnosticPanel
            mistakes={mistakes}
            attempts={attempts}
            user={user}
            onNavigate={onNavigate}
          />

          {/* Deterministic Study Recommendations */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-500" />
              Khuyến Nghị Học Tập Dựa Trên Dữ Liệu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold mb-2 inline-block ${
                        rec.priority === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : rec.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}
                    >
                      {rec.badge}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {rec.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (rec.targetTab === 'hsk' && rec.subRoute) {
                        onNavigate(rec.subRoute);
                      } else if (setActiveTab && rec.targetTab) {
                        setActiveTab(rec.targetTab);
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start flex items-center space-x-1"
                  >
                    <span>{rec.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
