import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  RotateCcw,
  BookMarked,
  Sparkles,
  Award,
  BookOpen,
  BarChart2,
  Info,
  CheckCircle2,
  XCircle,
  Volume2,
} from 'lucide-react';
import { getAttemptResult } from '../../services/hskService';
import {
  getUserMistakeEntries,
  buildMistakeReviewExam,
} from '../../services/mistakeNotebookService.js';
import {
  PRACTICE_MODES,
  buildAskAiTutorPromptForQuestion,
} from '../../data/hskExamBlueprints.js';
import { resolveReviewItemsFromAttempt } from '../../utils/examAttemptSnapshot.js';
import { saveCustomVocab } from '../../utils/materialsStorage.js';
import { speakChinese } from '../../utils/audio';
import HskAiDiagnosticPanel from '../personalization/HskAiDiagnosticPanel';
import {
  formatWritingCriterion as defaultFormatWritingCriterion,
  shouldShowMcqReviewOptions as defaultShouldShowReviewOptions,
} from './hskPracticeHelpers.js';

export default function HskExamResultView({
  attemptId,
  user,
  onNavigate,
  renderPostExamRemediation,
  formatWritingCriterion = defaultFormatWritingCriterion,
  shouldShowReviewOptions = defaultShouldShowReviewOptions,
}) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'incorrect', 'correct'
  const [vocabToast, setVocabToast] = useState(null);

  useEffect(() => {
    getAttemptResult(attemptId).then((data) => {
      setAttempt(data);
      setLoading(false);
    });
  }, [attemptId]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-bold">Đang tải kết quả thi...</div>;
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <h3 className="font-bold text-lg mb-4">Không tìm thấy lượt làm bài</h3>
        <button
          onClick={() => onNavigate('exams')}
          className="px-6 py-2 bg-[#E85D3F] text-white rounded-xl text-xs font-bold"
        >
          Về danh sách đề
        </button>
      </div>
    );
  }

  const results = resolveReviewItemsFromAttempt(attempt);
  const activeNotebookCount = getUserMistakeEntries(user).length;
  const filteredResults = results.filter((r) => {
    if (filterMode === 'incorrect') return r.isCorrect === false;
    if (filterMode === 'correct') return r.isCorrect === true;
    return true;
  });

  const handleSaveWrongWordsToFlashcard = () => {
    const wrongQuestions = results.filter((r) => !r.isCorrect);
    const wordsToSave = [];
    wrongQuestions.forEach((q) => {
      if (q.relatedVocab && Array.isArray(q.relatedVocab)) {
        q.relatedVocab.forEach((v) => {
          if (v && typeof v === 'string' && !wordsToSave.includes(v)) {
            wordsToSave.push(v);
          }
        });
      }
    });

    if (wordsToSave.length === 0) {
      wrongQuestions.forEach((q) => {
        if (q.prompt && typeof q.prompt === 'string') {
          const match = q.prompt.match(/[\u4e00-\u9fa5]{2,4}/g);
          if (match) {
            match.slice(0, 2).forEach((w) => {
              if (!wordsToSave.includes(w)) wordsToSave.push(w);
            });
          }
        }
      });
    }

    if (wordsToSave.length > 0) {
      wordsToSave.forEach((word) => {
        saveCustomVocab({
          id: `hsk-mistake-${Date.now()}-${word}`,
          hanzi: word,
          traditional: word,
          pinyin: '',
          hanviet: '',
          meaning: `Từ vựng cần củng cố từ đề ${attempt.examTitle || 'HSK'}`,
          level: attempt.examLevel || 'HSK 1',
          topic: 'Ôn tập câu sai HSK CBT',
          radical: '—',
          strokes: word.length * 6,
          mnemonic: 'Ghi nhớ từ vựng trọng tâm từ đề thi thử HSK.',
          example: {
            hanzi: word,
            pinyin: '',
            meaning: `Trích từ đề thi ${attempt.examTitle || 'HSK'}`,
          },
        });
      });
      setVocabToast(`✓ Đã lưu ${wordsToSave.length} từ vựng vào Sổ tay Flashcard!`);
      setTimeout(() => setVocabToast(null), 4000);
    } else {
      setVocabToast('Không có câu làm sai hoặc đã lưu đầy đủ!');
      setTimeout(() => setVocabToast(null), 3000);
    }
  };

  const isEliminated =
    attempt.cbtScore?.eliminatedByZeroScore ||
    (attempt.sectionsBreakdown && Object.values(attempt.sectionsBreakdown).some((s) => s.score < 40));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      {/* Top action */}
      <button
        onClick={() => onNavigate('exams')}
        className="text-xs font-bold text-slate-500 hover:text-[#E85D3F] flex items-center gap-1 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đề thi
      </button>

      {/* Toast thông báo lưu từ vựng */}
      {vocabToast && (
        <div className="mb-4 p-3.5 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-300 text-sky-900 dark:text-sky-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{vocabToast}</span>
          <button onClick={() => setVocabToast(null)} className="text-sky-700 hover:text-sky-950 font-black">✕</button>
        </div>
      )}

      {/* Main Score Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 text-center relative overflow-hidden">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${
            attempt.passed
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
          }`}
        >
          {isEliminated
            ? '⚠️ BỊ ĐIỂM LIỆT KỸ NĂNG (< 40/100)'
            : attempt.passed
            ? '🎉 CHÚC MỪNG! BẠN ĐÃ ĐẠT CHUẨN HSK'
            : '⚠️ CẦN CỐ GẮNG THÊM (CHƯA ĐẠT CHUẨN)'}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
          {attempt.examTitle}
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Thời gian làm bài: {Math.round(attempt.timeSpentSeconds / 60)} phút • Chế độ: {attempt.examMode === 'simulation' ? 'Phòng thi CBT tính giờ' : 'Luyện tập tự do'} • Hoàn thành ngày {new Date(attempt.createdAt).toLocaleDateString('vi-VN')}
        </p>

        {/* Score Ring / Digits */}
        <div className="inline-block p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 mb-4 border border-slate-100 dark:border-slate-800">
          <div className="text-4xl sm:text-5xl font-black text-[#E85D3F]">
            {attempt.score} <span className="text-xl text-slate-400 font-bold">/ {attempt.maxScore}</span>
          </div>
          <div className="text-xs font-bold text-slate-500 mt-2">
            Thang điểm chuẩn Quốc tế • Điểm chuẩn đậu: <strong className="text-slate-800 dark:text-slate-200">{attempt.passingScore}đ</strong> (Độ chính xác: {attempt.accuracyPercentage}%)
          </div>
        </div>

        {/* Elimination Notice Banner if any skill < 40 */}
        {isEliminated && (
          <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-center gap-2 font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Quy chế khảo thí: Thí sinh có kỹ năng dưới 40/100 điểm bị tính điểm liệt và không được công nhận đạt chứng chỉ HSK.</span>
          </div>
        )}

        {/* Official CBT Section Breakdown Cards (Nghe - Đọc - Viết) */}
        {attempt.sectionsBreakdown && Object.keys(attempt.sectionsBreakdown).length > 0 && (
          <div className="max-w-2xl mx-auto my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(attempt.sectionsBreakdown).map(([secKey, secData]) => {
              const secElim = secData.score < 40;
              const title = secKey === 'listening' ? '🎧 Nghe hiểu (听力)' : secKey === 'reading' ? '📖 Đọc hiểu (阅读)' : '✍️ Viết (书写)';
              return (
                <div
                  key={secKey}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    secElim
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {title}
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className={`text-2xl font-black ${secElim ? 'text-rose-600' : 'text-[#E85D3F]'}`}>
                      {secData.score}
                      <span className="text-xs text-slate-400 font-bold"> / 100đ</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {secData.correct ?? secData.correctQuestions ?? 0}/{secData.total ?? secData.totalQuestions ?? 0} câu
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full ${secElim ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, secData.score)}%` }}
                    />
                  </div>
                  {secElim ? (
                    <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      ⚠️ Điểm liệt (&lt; 40đ)
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Đạt yêu cầu
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer Banner: Honest scoring notice */}
        <div className="max-w-xl mx-auto mb-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {attempt.disclaimer || 'Điểm số luyện tập mô phỏng theo chuẩn CTI của HanziGo, không thay thế chứng chỉ khảo thí chính thức.'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-center text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
            <div className="text-emerald-700 dark:text-emerald-400 font-bold">Câu đúng</div>
            <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
              {attempt.correctCount}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30">
            <div className="text-rose-700 dark:text-rose-400 font-bold">Câu sai</div>
            <div className="text-xl font-black text-rose-800 dark:text-rose-300 mt-1">
              {attempt.incorrectCount}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 font-bold">Bỏ qua</div>
            <div className="text-xl font-black text-slate-700 dark:text-slate-300 mt-1">
              {attempt.unansweredCount}
            </div>
          </div>
          {attempt.subjectiveCount > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 col-span-3 sm:col-span-1">
              <div className="text-amber-700 dark:text-amber-400 font-bold">Tự luận</div>
              <div className="text-xl font-black text-amber-800 dark:text-amber-300 mt-1">
                {attempt.subjectiveCount}
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={() => onNavigate('take', attempt.examId)}
            className="px-6 py-3 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại đề thi này
          </button>
          {attempt.incorrectCount > 0 && (
            <button
              onClick={() => setFilterMode('incorrect')}
              className="px-6 py-3 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              Xem lại {attempt.incorrectCount} câu làm sai
            </button>
          )}
          {activeNotebookCount > 0 && (
            <button
              type="button"
              onClick={() => {
                const reviewExam = buildMistakeReviewExam(user);
                if (reviewExam) {
                  try {
                    sessionStorage.setItem('hanzigo_pending_exam_mode', PRACTICE_MODES.LEARNING);
                  } catch {}
                  onNavigate('take', reviewExam.id);
                }
              }}
              className="min-h-11 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookMarked className="w-4 h-4" /> Luyện lại câu sai ngay ({activeNotebookCount} câu)
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const weakest = Object.values(attempt.skillBreakdown || {}).sort(
                (a, b) =>
                  (a.totalQuestions > 0 ? a.correctQuestions / a.totalQuestions : 1) -
                  (b.totalQuestions > 0 ? b.correctQuestions / b.totalQuestions : 1)
              )[0];
              const promptMsg = weakest
                ? `Mình vừa hoàn thành "${attempt.examTitle || 'bài luyện HSK'}" đạt ${attempt.accuracyPercentage}%. Kỹ năng yếu nhất là ${weakest.name} (${weakest.correctQuestions}/${weakest.totalQuestions} câu). Hãy phân tích lỗi thường gặp và lộ trình cải thiện giúp mình.`
                : `Mình vừa hoàn thành "${attempt.examTitle || 'bài luyện HSK'}" (${attempt.accuracyPercentage}%). Hãy tư vấn chiến lược cải thiện điểm số nhé.`;
              try {
                sessionStorage.setItem('hanzigo_ai_tutor_prefill', promptMsg);
              } catch {}
              window.location.hash = '#conversation/tutor';
            }}
            className="min-h-11 px-5 py-3 rounded-xl border border-[#E85D3F] bg-orange-50 dark:bg-orange-950/30 text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Hỏi Lão Sư AI về điểm yếu này
          </button>
          {attempt.incorrectCount > 0 && (
            <button
              onClick={handleSaveWrongWordsToFlashcard}
              className="px-6 py-3 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-200 text-xs font-bold hover:bg-sky-100 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600" /> Lưu từ vựng câu làm sai vào Sổ tay Flashcard
            </button>
          )}
          <button
            onClick={() => onNavigate('mistakes')}
            className="px-6 py-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookMarked className="w-4 h-4" /> Vào sổ tay câu sai
          </button>
          {(attempt.accuracyPercentage >= 80 || attempt.passed) && (
            <button
              onClick={() => {
                window.location.hash = '#profile';
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" /> Kiểm tra &amp; Nhận Chứng Nhận HSK ✨
            </button>
          )}
          <button
            onClick={() => {
              window.location.hash = `#materials?level=${attempt.examLevel || 'HSK 1'}&category=hsk_preparation`;
            }}
            className="px-6 py-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" /> Ôn tập trong Thư viện tài nguyên
          </button>
        </div>
      </div>

      {/* Phân tích kỹ năng */}
      {attempt.skillBreakdown && Object.keys(attempt.skillBreakdown).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#E85D3F]" />
            Đánh giá theo từng phần kỹ năng
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(attempt.skillBreakdown).map(([k, s]) => {
              const pct = s.totalQuestions > 0 ? Math.round((s.correctQuestions / s.totalQuestions) * 100) : 0;
              return (
                <div key={k} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="text-[#E85D3F]">{s.correctQuestions}/{s.totalQuestions} câu ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 60 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Sư phạm Chẩn đoán lỗi bài làm */}
      {attempt.incorrectCount > 0 && (
        <>
          <HskAiDiagnosticPanel
            mistakes={(attempt.detailedResults || []).filter((r) => !r.isCorrect)}
            attempts={[attempt]}
            user={user}
            onNavigate={onNavigate}
          />
          {renderPostExamRemediation && renderPostExamRemediation(attempt)}
        </>
      )}

      {/* Answer Review Filter & List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl text-slate-900 dark:text-white">
            Chi tiết lời giải từng câu hỏi ({filteredResults.length})
          </h3>

          {/* Filter tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              Tất cả ({results.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Câu sai / Bỏ qua ({results.filter((r) => r.isCorrect === false).length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Câu đúng ({attempt.correctCount})
            </button>
          </div>
        </div>

        {/* Detailed Questions List */}
        {filteredResults.map((q) => {
          const isUnanswered = q.isCorrect === false && (q.userAnswer === undefined || q.userAnswer === null || q.userAnswer === '');
          return (
            <div
              key={q.questionId}
              className={`p-6 rounded-3xl border-2 bg-white dark:bg-slate-900 transition-all ${
                q.isSubjective
                  ? 'border-amber-200 dark:border-amber-950/60'
                  : q.isCorrect
                  ? 'border-emerald-200 dark:border-emerald-950/60'
                  : isUnanswered
                  ? 'border-slate-200 dark:border-slate-700 shadow-xs'
                  : 'border-rose-200 dark:border-rose-950/60 shadow-xs'
              }`}
            >
              {/* Question head */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${
                      q.isSubjective
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : q.isCorrect
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : isUnanswered
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {q.isSubjective ? (
                      '✍️ Tự luận (Đối chiếu tự chấm)'
                    ) : q.isCorrect ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Câu {q.questionNumber}: Đúng</>
                    ) : isUnanswered ? (
                      <>Câu {q.questionNumber}: Bỏ qua</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" /> Câu {q.questionNumber}: Sai</>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {q.partType === 'listening' ? '🎧 Nghe hiểu' : q.partType === 'writing' ? '✍️ Viết' : '📖 Đọc hiểu'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  +{q.pointsAwarded}/{q.points} điểm
                </span>
              </div>

              {/* Prompt */}
              <div className="mb-4">
                {q.imageUrl && String(q.imageUrl).startsWith('/images/hsk/') && (
                  <div className="mb-3">
                    <img
                      src={q.imageUrl}
                      alt={q.imageAlt || 'Hình minh họa câu hỏi HSK'}
                      width={320}
                      height={220}
                      loading="lazy"
                      decoding="async"
                      className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white object-contain"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.prompt}
                    </h4>
                    {q.pinyin && <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">{q.pinyin}</div>}
                    {q.translation && <div className="text-xs text-slate-500 italic mt-0.5">{q.translation}</div>}
                  </div>

                  {q.partType === 'listening' && (
                    <button
                      onClick={() => speakChinese(q.audio_script || q.prompt)}
                      className="p-2.5 rounded-xl bg-orange-100 text-[#E85D3F] hover:bg-orange-200 flex-shrink-0 transition-colors cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {q.audio_script && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Lời thoại phát thanh:</span> {q.audio_script}
                  </div>
                )}
              </div>

              {/* Sub-format review: Reorder Sentence result */}
              {q.questionType === 'reorder_sentence' && (
                <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-slate-500">Câu của bạn:</span>{' '}
                    <span className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                      {Array.isArray(q.userAnswer) ? q.userAnswer.join(' ') : (q.options?.[q.selectedIndex]?.text || q.userAnswer || 'Chưa làm')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Trật tự chuẩn xác:</span>{' '}
                    <span className="text-emerald-600 font-bold">
                      {q.correctSentence || (q.correctOrder || []).join(' ') || q.options?.[q.correctIndex]?.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Sub-format review: Free Writing with Rubric */}
              {q.isSubjective && (
                <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200">Bài làm của bạn:</span>
                    <div className="mt-1 p-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 italic">
                      {q.userAnswer ? String(q.userAnswer) : '(Chưa điền câu trả lời)'}
                    </div>
                  </div>

                  {q.sampleAnswer && (
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">Bài mẫu tham khảo đạt điểm tối đa:</span>
                      <div className="mt-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium">
                        {q.sampleAnswer}
                      </div>
                    </div>
                  )}

                  {q.writingCriteria && q.writingCriteria.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Thang tiêu chí tự đánh giá (Rubric):
                      </span>
                      <div className="space-y-1">
                        {q.writingCriteria.map((crit, crIdx) => {
                          const { label: critLabel, weight: critWeight } = formatWritingCriterion(crit);
                          return (
                            <div key={crIdx} className="flex justify-between items-center gap-3 text-[11px] p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
                              <span className="text-slate-700 dark:text-slate-300">• {critLabel}</span>
                              {critWeight !== null && critWeight !== undefined && (
                                <span className="font-bold text-amber-600 shrink-0">Trọng số: {critWeight}%</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-amber-800 dark:text-amber-300 italic">
                    * HanziGo không chấm bài viết tự do bằng quy tắc đơn giản. Vui lòng đối chiếu với bài mẫu và tiêu chí trên.
                  </div>
                </div>
              )}

              {/* Options review */}
              {shouldShowReviewOptions(q) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelectedByUser = q.selectedIndex === oIdx;
                    const isCorrectOption = q.correctIndex === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          isCorrectOption
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                            : isSelectedByUser && !isCorrectOption
                            ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div>
                          <span className="mr-2 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt.text}</span>
                          {opt.translation && <span className="text-slate-400 font-normal ml-1">({opt.translation})</span>}
                        </div>
                        {isCorrectOption && <span className="text-emerald-600 font-bold">✓ Đáp án đúng</span>}
                        {isSelectedByUser && !isCorrectOption && <span className="text-rose-600 font-bold">✗ Bạn đã chọn</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Detailed Explanation */}
              {q.explanation && (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-1">
                    💡 Lời giải chi tiết:
                  </strong>
                  {q.explanation}
                </div>
              )}

              {/* Post-Submission Only: Hỏi Lão Sư AI về câu này */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const aiPrompt = buildAskAiTutorPromptForQuestion(
                        { prompt: q.prompt, options: q.options },
                        q.selectedIndex ?? q.userAnswer
                      );
                      sessionStorage.setItem('hanzigo_ai_tutor_prefill', aiPrompt);
                    } catch {}
                    window.location.hash = '#conversation/tutor';
                  }}
                  className="min-h-11 px-3.5 py-2 rounded-xl border border-[#E85D3F] bg-orange-50 dark:bg-orange-950/30 text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi Lão Sư AI về câu này</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
