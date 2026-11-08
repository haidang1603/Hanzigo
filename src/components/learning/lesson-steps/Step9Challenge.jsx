import React from 'react';
import { Sparkles, Volume2, Timer, CheckCircle2, Mic, Zap, Lock } from 'lucide-react';

export default function Step9Challenge({
  lesson,
  handleSpeak,
  getChallengeTarget,
  challengeCompleted = false,
  setChallengeCompleted,
  challengeFeedback,
  setChallengeFeedback,
  isChallengeRecording = false,
  challengeCountdown = 10,
  challengeTranscript = '',
  handleStopChallengeRecording,
  isReflexRunning = false,
  showReflexConfirm = false,
  setShowReflexConfirm,
  handleConfirmReflex,
  handleStartChallengeRecording,
  handleStartReflexChallenge,
  handleFinishLesson
}) {
  if (!lesson?.step9_challenge) return null;

  const targetPhrase = getChallengeTarget ? getChallengeTarget(lesson) : (lesson?.step9_challenge?.targetPhrase || '中文');

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm text-center space-y-6 animate-in fade-in">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-3xl">
        🔥
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
          Step 9: Thử thách đời thực & Khảo hạch
        </span>
        <h3 className="text-xl font-black text-[#243447] dark:text-white">
          {lesson.step9_challenge.title}
        </h3>
        <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed max-w-md mx-auto">
          {lesson.step9_challenge.taskDesc}
        </p>
      </div>

      {/* Target Challenge Prompt Box */}
      <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-dashed border-[#E85D3F]/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
          <span className="flex items-center gap-1.5 text-[#E85D3F]">
            <Sparkles size={14} />
            <span>Nội dung thử thách:</span>
          </span>
          <button
            type="button"
            onClick={() => handleSpeak(targetPhrase)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] text-[11px] text-[#E85D3F] hover:bg-[#FDEEEB] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Volume2 size={13} />
            <span>Nghe phát âm mẫu</span>
          </button>
        </div>

        <div className="text-xl sm:text-2xl font-black text-[#E85D3F] font-mono tracking-wide py-1 select-all">
          {targetPhrase}
        </div>

        <div className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
          🏆 Huy hiệu mở khóa: <strong>{lesson.step9_challenge.badge}</strong> (+{lesson.xpReward} XP)
        </div>
      </div>

      {/* Interactive Challenge Arena */}
      <div className="space-y-4 pt-1">
        {!challengeCompleted ? (
          <div className="space-y-3">
            {/* Active Recording State */}
            {isChallengeRecording ? (
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-center space-y-3 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Đang ghi âm thử thách... (Còn {challengeCountdown}s)</span>
                </div>
                
                <div className="h-2 w-full bg-rose-200 dark:bg-rose-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-600 transition-all duration-1000 rounded-full"
                    style={{ width: `${(challengeCountdown / 10) * 100}%` }}
                  />
                </div>

                {challengeTranscript && (
                  <p className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-[#1E293B] p-2 rounded-xl border border-rose-200">
                    Đang nghe: "{challengeTranscript}"
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleStopChallengeRecording}
                  className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <span>⏹️ Dừng & Nộp bài thử thách</span>
                </button>
              </div>
            ) : isReflexRunning ? (
              /* Active Reflex Timer State */
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-center space-y-3 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Timer size={16} className="animate-spin" />
                  <span>Đếm ngược phản xạ: Còn {challengeCountdown} giây</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                  Hãy đọc to câu mẫu tiếng Trung trên ít nhất 2 lần thật chuẩn xác!
                </p>
                <div className="h-2 w-full bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 rounded-full"
                    style={{ width: `${(challengeCountdown / 10) * 100}%` }}
                  />
                </div>
              </div>
            ) : showReflexConfirm ? (
              /* Reflex Confirmation Card */
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 animate-in zoom-in-95">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  ⏱️ Hết thời gian đếm ngược! Bạn đã đọc to câu trên rõ ràng và chuẩn ngữ điệu?
                </div>
                <button
                  type="button"
                  onClick={handleConfirmReflex}
                  className="py-2.5 px-6 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Xác nhận Đã Hoàn Thành Thử Thách</span>
                </button>
              </div>
            ) : (
              /* Default Action Selector */
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleStartChallengeRecording}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Mic size={18} />
                  <span>Bật Micro & Bắt đầu Thử thách Ghi âm (10s)</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartReflexChallenge}
                  className="w-full py-3 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FDEEEB] text-[#748092] hover:text-[#E85D3F] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap size={14} />
                  <span>Không tiện dùng Mic? Làm Thử thách Phản xạ 10s</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Challenge Completed Celebration Card */
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-[#45B97C] text-center space-y-2.5 animate-in zoom-in-95">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#45B97C] text-white text-xs font-bold">
              <CheckCircle2 size={14} />
              <span>ĐÃ CHINH PHỤC THỬ THÁCH THÀNH CÔNG!</span>
            </div>
            <p className="text-xs font-bold text-[#243447] dark:text-white">
              {challengeFeedback?.message || `Bạn đã hoàn thành thử thách và nhận huy hiệu: ${lesson.step9_challenge.badge}!`}
            </p>
            <button
              type="button"
              onClick={() => {
                setChallengeCompleted?.(false);
                setChallengeFeedback?.(null);
                setShowReflexConfirm?.(false);
              }}
              className="text-[11px] text-[#748092] hover:text-[#E85D3F] underline cursor-pointer"
            >
              Thực hiện lại thử thách
            </button>
          </div>
        )}
      </div>

      {/* Final Completion Action Button: Locked until challenge completed */}
      <div className="pt-2">
        {!challengeCompleted ? (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2">
              <Lock size={14} />
              <span>Cần hoàn thành thử thách ghi âm hoặc phản xạ bên trên để mở khóa</span>
            </div>
            <button
              type="button"
              disabled
              className="w-full py-4 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-gray-300 dark:border-gray-700"
            >
              <Lock size={18} />
              <span>Hoàn thành bài học (+{lesson.xpReward} XP)</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleFinishLesson}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#3AA56E] text-white text-sm font-black shadow-lg shadow-[#45B97C]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ring-4 ring-[#45B97C]/20 animate-pulse"
          >
            <Sparkles size={18} />
            <span>Nhận Huy Hiệu & Hoàn Thành Bài Học (+{lesson.xpReward} XP)</span>
          </button>
        )}
      </div>
    </div>
  );
}

