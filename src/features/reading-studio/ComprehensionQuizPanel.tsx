import React, { useState } from 'react';
import { CheckCircle2, XCircle, Crosshair, Award } from 'lucide-react';
import {
  recordReadingSession,
  type ComprehensionQuestion,
  type ReadingArticle,
} from '../../services/readingStudioService.ts';

interface ComprehensionQuizPanelProps {
  article: ReadingArticle;
  knownPercentage: number;
  savedVocabCount: number;
  user?: { id?: string | null } | null;
  onJumpToEvidence: (sentenceId: string) => void;
}

export const ComprehensionQuizPanel: React.FC<ComprehensionQuizPanelProps> = ({
  article,
  knownPercentage,
  savedVocabCount,
  user,
  onJumpToEvidence,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savingSession, setSavingSession] = useState(false);

  const questions: ComprehensionQuestion[] = article.comprehension_questions || [];

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Bài đọc tùy chỉnh chưa có câu hỏi trắc nghiệm. Bạn có thể bấm vào từng từ để tra nghĩa,
        lưu vào bộ từ vựng hoặc dùng nút <strong>Phân tích câu</strong>.
      </div>
    );
  }

  const correctCount = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correct_index ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const handleSubmit = async () => {
    setSubmitted(true);
    setSavingSession(true);
    try {
      await recordReadingSession({
        user,
        article,
        knownPercentage,
        savedVocabCount,
        quizScore: scorePercent,
      });
    } finally {
      setSavingSession(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Kiểm tra đọc hiểu</h3>
          <p className="text-xs text-slate-500">
            Trả lời câu hỏi và bấm &ldquo;Xem dẫn chứng&rdquo; để định vị câu gốc trong bài.
          </p>
        </div>

        {submitted && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-bold text-emerald-800">
            <Award className="w-4 h-4 text-emerald-600" />
            {correctCount}/{questions.length} ({scorePercent}%)
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const picked = answers[q.id];
          const isCorrect = picked === q.correct_index;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Câu {qIdx + 1}: {q.question_vi}
                </p>
                <p className="text-xs text-slate-500">{q.question_zh}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((option, optIdx) => {
                  const selected = picked === optIdx;
                  let style =
                    'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';
                  if (submitted) {
                    if (optIdx === q.correct_index) {
                      style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                    } else if (selected && optIdx !== q.correct_index) {
                      style = 'bg-rose-50 border-rose-300 text-rose-800';
                    }
                  } else if (selected) {
                    style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
                  }

                  return (
                    <button
                      key={`${q.id}-opt-${optIdx}`}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`text-left rounded-xl border px-3 py-2 text-sm transition ${style}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-start gap-2 text-xs">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-700">{q.explanation_vi}</span>
                  </div>

                  {q.evidence_sentence_id && (
                    <button
                      type="button"
                      onClick={() => onJumpToEvidence(q.evidence_sentence_id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-100 hover:bg-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-900 transition"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      Xem dẫn chứng
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2">
        {submitted ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Làm lại
          </button>
        ) : (
          <button
            type="button"
            disabled={Object.keys(answers).length < questions.length || savingSession}
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
          >
            {savingSession ? 'Đang lưu kết quả...' : 'Nộp bài đọc hiểu'}
          </button>
        )}
      </div>
    </div>
  );
};

