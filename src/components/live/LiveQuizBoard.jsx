import React, { useState } from 'react';
import { 
  CheckSquare, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Square, 
  Sparkles, 
  BarChart2, 
  Users,
  Award,
  RefreshCw
} from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { startLiveQuiz, submitQuizAnswer, endLiveQuiz } from '../../services/liveClassroomService';

export default function LiveQuizBoard({
  isTeacher = false,
  user,
  sessionId,
  quizState = {},
  onUpdateState: _onUpdateState
}) {
  const quiz = quizState || {
    id: 'quiz-1',
    question: '“中文” nghĩa là gì?',
    options: ['English', 'Chinese', 'Korean', 'Japanese'],
    correctAnswer: 1,
    status: 'idle',
    submissions: {}
  };

  const userId = user?.uid || user?.id;
  const mySubmission = quiz.submissions?.[userId];
  const hasVoted = Boolean(mySubmission);

  // Teacher custom question form
  const [questionInput, setQuestionInput] = useState(quiz.question || '“中文” nghĩa là gì?');
  const [optionA, setOptionA] = useState(quiz.options?.[0] || 'English');
  const [optionB, setOptionB] = useState(quiz.options?.[1] || 'Chinese');
  const [optionC, setOptionC] = useState(quiz.options?.[2] || 'Korean');
  const [optionD, setOptionD] = useState(quiz.options?.[3] || 'Japanese');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(quiz.correctAnswer || 1);

  // Compute live distribution
  const submissionsList = Object.values(quiz.submissions || {});
  const totalVotes = submissionsList.length;
  const distribution = [0, 0, 0, 0];
  submissionsList.forEach(sub => {
    if (sub.optionIndex >= 0 && sub.optionIndex < 4) {
      distribution[sub.optionIndex]++;
    }
  });

  const correctCount = submissionsList.filter(s => s.isCorrect).length;
  const classAccuracy = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;

  const handleStartQuiz = async () => {
    playClickSound();
    if (!isTeacher) return;
    await startLiveQuiz(sessionId, userId, {
      question: questionInput.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswer: correctOptionIndex
    });
    playSuccessSound();
  };

  const handleEndQuiz = async () => {
    playClickSound();
    if (!isTeacher) return;
    await endLiveQuiz(sessionId, userId, quiz.id);
  };

  const handleSelectOption = async (index) => {
    playClickSound();
    if (quiz.status !== 'active') return;
    const res = await submitQuizAnswer(sessionId, user, quiz.id, index);
    if (res.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Live Classroom Quiz</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${
                quiz.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                  : quiz.status === 'ended'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : 'bg-white/10 text-white/60 border-white/10'
              }`}>
                {quiz.status === 'active' ? '● ĐANG DIỄN RA' : quiz.status === 'ended' ? 'ĐÃ KẾT THÚC' : 'CHỜ BẮT ĐẦU'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            Trắc nghiệm tương tác thời gian thực với thống kê phổ điểm tự động.
          </p>
        </div>

        {/* Teacher Controls: Start / End Quiz */}
        {isTeacher && (
          <div className="flex items-center gap-2">
            {quiz.status !== 'active' ? (
              <button
                onClick={handleStartQuiz}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Play size={14} />
                <span>Start Quiz (Bắt đầu)</span>
              </button>
            ) : (
              <button
                onClick={handleEndQuiz}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Square size={14} />
                <span>Kết thúc & Xem kết quả</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT (7 cols): Question & Student Voting Cards */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-white/10 p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20">
              CÂU HỎI TRẮC NGHIỆM
            </span>
            
            <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed font-serif">
              {quiz.question}
            </h3>

            {/* 4 Interactive Answer Options */}
            <div className="space-y-3 pt-2">
              {quiz.options?.map((opt, idx) => {
                const label = OPTION_LABELS[idx];
                const isSelectedByMe = mySubmission?.optionIndex === idx;
                const isCorrectAnswer = quiz.status === 'ended' && idx === quiz.correctAnswer;
                const isWrongSelection = quiz.status === 'ended' && isSelectedByMe && !mySubmission.isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={quiz.status !== 'active'}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isCorrectAnswer
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-101'
                        : isWrongSelection
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : isSelectedByMe
                        ? 'bg-[#E85D3F]/25 border-[#E85D3F] text-white shadow-md'
                        : quiz.status === 'active'
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/90 cursor-pointer'
                        : 'bg-white/5 border-white/5 text-white/60 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        isCorrectAnswer
                          ? 'bg-emerald-500 text-white'
                          : isWrongSelection
                          ? 'bg-rose-500 text-white'
                          : isSelectedByMe
                          ? 'bg-[#E85D3F] text-white'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {label}
                      </span>
                      <span className="font-bold text-sm sm:text-base">{opt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrectAnswer && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 size={13} />
                          <span>Đáp án đúng</span>
                        </span>
                      )}
                      {isWrongSelection && (
                        <span className="flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                          <XCircle size={13} />
                          <span>Bạn chọn sai</span>
                        </span>
                      )}
                      {isSelectedByMe && quiz.status === 'active' && (
                        <span className="text-xs text-[#E85D3F] font-bold">
                          Đã chọn ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback badge for student */}
          {quiz.status === 'ended' && mySubmission && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              mySubmission.isCorrect
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}>
              {mySubmission.isCorrect 
                ? '🎉 Xuất sắc! Bạn đã chọn chính xác đáp án của câu hỏi.' 
                : `⚠️ Chưa chính xác. Đáp án đúng của câu này là: ${OPTION_LABELS[quiz.correctAnswer]}. ${quiz.options[quiz.correctAnswer]}.`}
            </div>
          )}
        </div>

        {/* RIGHT (5 cols): Realtime Distribution & Teacher Config */}
        <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-2xl">
          
          {/* Realtime Distribution Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[#F4B942]" />
                <h3 className="text-sm font-bold text-white">Phổ điểm Realtime</h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/60">
                <Users size={13} />
                <span>{totalVotes} đã nộp</span>
              </div>
            </div>

            <div className="space-y-3">
              {OPTION_LABELS.map((label, idx) => {
                const count = distribution[idx];
                const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isCorrect = quiz.status === 'ended' && idx === quiz.correctAnswer;

                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-white/80'}`}>
                        {label}: {quiz.options?.[idx]} {isCorrect ? '✓' : ''}
                      </span>
                      <span className="font-mono text-white/60">
                        {count} ({pct}%)
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-500'
                            : idx === 0
                            ? 'bg-blue-500'
                            : idx === 1
                            ? 'bg-amber-500'
                            : idx === 2
                            ? 'bg-violet-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Class Accuracy Highlight */}
            {quiz.status === 'ended' && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-white/40">ĐỘ CHÍNH XÁC CẢ LỚP</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{classAccuracy}%</p>
                </div>
                <Award size={28} className="text-[#F4B942]" />
              </div>
            )}
          </div>

          {/* Teacher Create Custom Question Accordion */}
          {isTeacher && quiz.status !== 'active' && (
            <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
              <span className="font-bold text-white/70 block">Thiết lập câu hỏi tiếp theo:</span>
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Nội dung câu hỏi..."
                className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Đáp án A"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white"
                />
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Đáp án B"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white"
                />
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Đáp án C"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white"
                />
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Đáp án D"
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60">Đáp án đúng:</span>
                {[0, 1, 2, 3].map(optIdx => (
                  <label key={optIdx} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === optIdx}
                      onChange={() => setCorrectOptionIndex(optIdx)}
                      className="accent-[#E85D3F]"
                    />
                    <span>{OPTION_LABELS[optIdx]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
