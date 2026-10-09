import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Square, 
  CheckCircle2, 
  BarChart2, 
  Users,
  RotateCcw
} from 'lucide-react';
import { speakChinese, playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { startListeningActivity, submitListeningAnswer, endListeningActivity } from '../../services/liveClassroomService';

export default function ListeningActivityBoard({
  isTeacher = false,
  user,
  sessionId,
  listeningState = {},
  onUpdateState: _onUpdateState,
  onLinkToGrammar
}) {
  const listening = listeningState || {
    id: 'list-1',
    audioText: '他每天都在大学学习中文。',
    audioPinyin: 'Tā měitiān dōu zài dàxué xuéxí Zhōngwén.',
    question: '他在大学做什么？',
    options: ['A. 学习中文 (Học tiếng Trung)', 'B. 踢足球 (Đá bóng)', 'C. 喝咖啡 (Uống cà phê)', 'D. 睡觉 (Đi ngủ)'],
    correctAnswer: 0,
    status: 'idle',
    submissions: {}
  };

  const userId = user?.uid || user?.id;
  const mySubmission = listening.submissions?.[userId];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Compute live distribution
  const submissionsList = Object.values(listening.submissions || {});
  const totalVotes = submissionsList.length;
  const distribution = [0, 0, 0, 0];
  submissionsList.forEach(sub => {
    if (sub.optionIndex >= 0 && sub.optionIndex < 4) {
      distribution[sub.optionIndex]++;
    }
  });

  const handlePlayAudio = () => {
    playClickSound();
    setIsPlayingAudio(true);
    speakChinese(listening.audioText || '他每天都在大学学习中文。', 0.80);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  const handleStartActivity = async () => {
    playClickSound();
    if (!isTeacher) return;
    await startListeningActivity(sessionId, userId, {
      audioText: listening.audioText,
      audioPinyin: listening.audioPinyin,
      question: listening.question,
      options: listening.options,
      correctAnswer: listening.correctAnswer
    });
    playSuccessSound();
  };

  const handleEndActivity = async () => {
    playClickSound();
    if (!isTeacher) return;
    await endListeningActivity(sessionId, userId, listening.id);
  };

  const handleSelectOption = async (index) => {
    playClickSound();
    if (listening.status !== 'active') return;
    const res = await submitListeningAnswer(sessionId, user, listening.id, index);
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
            <span className="text-xl">🎧</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Live Listening Activity</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${
                listening.status === 'active'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
                  : listening.status === 'ended'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : 'bg-white/10 text-white/60 border-white/10'
              }`}>
                {listening.status === 'active' ? '● ĐANG DIỄN RA' : listening.status === 'ended' ? 'ĐÃ KẾT THÚC' : 'CHỜ BẮT ĐẦU'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            Luyện nghe hiểu hội thoại trực tiếp và trả lời câu hỏi trắc nghiệm thời gian thực.
          </p>
        </div>

        {/* Teacher Controls */}
        {isTeacher && (
          <div className="flex items-center gap-2">
            {onLinkToGrammar && (
              <button
                onClick={() => onLinkToGrammar({ audioText: listening.audioText, audioPinyin: listening.audioPinyin })}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Chuyển câu đoạn nghe sang phân tích cấu trúc ngữ pháp để chữa bài"
              >
                <span>Phân tích ngữ pháp ➔</span>
              </button>
            )}

            {listening.status !== 'active' ? (
              <button
                onClick={handleStartActivity}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Play size={14} />
                <span>Bắt đầu bài nghe</span>
              </button>
            ) : (
              <button
                onClick={handleEndActivity}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Square size={14} />
                <span>Kết thúc bài nghe</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT (7 cols): Audio Player & Question Options */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-white/10 p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-5">
            
            {/* Audio Wave Player Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-[#0F172A] border border-blue-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAudio}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    isPlayingAudio
                      ? 'bg-blue-500 text-white scale-105 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                  title="Phát đoạn ghi âm bài nghe"
                >
                  <Volume2 size={24} />
                </button>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>File âm thanh luyện nghe</span>
                    {isPlayingAudio && <span className="text-[10px] text-emerald-400 font-mono">● Đang phát</span>}
                  </h4>
                  <p className="text-xs text-white/50">Bấm nút để nghe đoạn hội thoại (Phát âm chuẩn HSK)</p>
                </div>
              </div>

              <button
                onClick={handlePlayAudio}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCcw size={13} />
                <span>Nghe lại</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                CÂU HỎI NGHE HIỂU
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-serif">
                {listening.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {listening.options?.map((opt, idx) => {
                const label = OPTION_LABELS[idx];
                const isSelectedByMe = mySubmission?.optionIndex === idx;
                const isCorrect = listening.status === 'ended' && idx === listening.correctAnswer;
                const isWrong = listening.status === 'ended' && isSelectedByMe && !mySubmission.isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={listening.status !== 'active'}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg'
                        : isWrong
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : isSelectedByMe
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-md'
                        : listening.status === 'active'
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90 cursor-pointer'
                        : 'bg-white/5 border-white/5 text-white/60 cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isWrong
                          ? 'bg-rose-500 text-white'
                          : isSelectedByMe
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/70'
                      }`}>
                        {label}
                      </span>
                      <span className="font-bold text-sm sm:text-base">{opt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 size={13} />
                          <span>Đáp án đúng</span>
                        </span>
                      )}
                      {isSelectedByMe && listening.status === 'active' && (
                        <span className="text-xs text-blue-400 font-bold">
                          Đã chọn ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transcript reveal when ended */}
          {listening.status === 'ended' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <span className="font-bold text-white/50 uppercase tracking-wider text-[10px]">TRANSCRIPT BÀI NGHE</span>
              <p className="font-serif text-white font-bold text-sm">{listening.audioText}</p>
              <p className="font-mono text-emerald-400">{listening.audioPinyin}</p>
            </div>
          )}
        </div>

        {/* RIGHT (5 cols): Realtime Distribution */}
        <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-white/10 p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white">Kết quả trả lời Realtime</h3>
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
                const isCorrect = listening.status === 'ended' && idx === listening.correctAnswer;

                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-white/80'}`}>
                        {label}: {listening.options?.[idx]} {isCorrect ? '✓' : ''}
                      </span>
                      <span className="font-mono text-white/60">
                        {count} ({pct}%)
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCorrect ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
