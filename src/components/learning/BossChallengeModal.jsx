import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Flame,
  RotateCcw
} from 'lucide-react';
import { completeBossChallenge } from '../../services/learningPathService';
import { playClickSound, playSuccessSound, playErrorSound, playLevelUpSound } from '../../utils/audio';

export default function BossChallengeModal({ bossChallenge, user, onClose, onBossBeaten }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stageFeedback, setStageFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  if (!bossChallenge) return null;

  const stages = bossChallenge.stages || [];
  const currentStage = stages[currentStageIdx];

  const handleSpeakAudio = (text) => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectChoice = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setStageFeedback(option);

    const gained = option.score || 0;
    const newTotal = totalScore + gained;
    setTotalScore(newTotal);

    if (option.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNextStage = () => {
    playClickSound();
    setSelectedOption(null);
    setStageFeedback(null);

    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx(currentStageIdx + 1);
    } else {
      // Completed all stages!
      setIsFinished(true);
      const passed = totalScore >= (bossChallenge.requiredScoreToPass || 75);

      if (passed) {
        playLevelUpSound();
        completeBossChallenge(bossChallenge.id, totalScore, user);
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch {}
      }
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentStageIdx(0);
    setTotalScore(0);
    setSelectedOption(null);
    setStageFeedback(null);
    setIsFinished(false);
  };

  const isPassed = totalScore >= (bossChallenge.requiredScoreToPass || 75);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 w-full max-w-lg border-2 border-red-500/40 dark:border-red-500/30 shadow-2xl relative space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {!isFinished ? (
          <div className="space-y-5">
            {/* Boss Banner Header */}
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 to-amber-500 text-3xl flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
                {bossChallenge.bossAvatar || '🐉'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                    BOSS CHALLENGE
                  </span>
                  <span className="text-xs text-[#E85D3F] font-bold">
                    Stage {currentStageIdx + 1}/{stages.length}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#243447] dark:text-white truncate">
                  {bossChallenge.bossName}
                </h3>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                  {bossChallenge.title}
                </p>
              </div>
            </div>

            {/* Boss Dialogue Bubble */}
            {currentStage && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 relative">
                  <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
                    <span className="flex items-center gap-1.5 text-red-500">
                      <Flame size={14} />
                      <span>{bossChallenge.bossName} nói:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakAudio(currentStage.bossDialogue)}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] flex items-center gap-1 cursor-pointer text-[10px] font-bold"
                    >
                      <Volume2 size={13} />
                      <span>Nghe</span>
                    </button>
                  </div>

                  <p className="text-sm font-bold text-[#243447] dark:text-white leading-relaxed">
                    {currentStage.bossDialogue}
                  </p>
                  <p className="text-xs text-[#E85D3F] font-mono font-medium">
                    {currentStage.bossPinyin}
                  </p>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] italic pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F]/50">
                    {currentStage.bossMeaning}
                  </p>
                </div>

                {/* Prompt */}
                <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#F4B942]" />
                  <span>{currentStage.prompt}</span>
                </div>

                {/* Choices */}
                <div className="space-y-2.5">
                  {currentStage.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectChoice(option)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? option.isCorrect
                              ? 'border-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] text-[#243447] dark:text-white'
                              : 'border-red-500 bg-red-50 dark:bg-red-950/30 text-[#243447] dark:text-white'
                            : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:border-[#E85D3F] text-[#243447] dark:text-white'
                        }`}
                      >
                        <div className="font-bold">{option.text}</div>
                        <div className="text-[11px] text-[#748092] font-mono mt-0.5">{option.pinyin}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {stageFeedback && (
                  <div className={`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in duration-150 ${
                    stageFeedback.isCorrect
                      ? 'bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-[#3AA56E]'
                      : 'bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {stageFeedback.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      <span>{stageFeedback.isCorrect ? 'Tuyệt vời (+25 điểm)' : 'Chưa chính xác (0 điểm)'}</span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      {stageFeedback.feedback}
                    </p>
                  </div>
                )}

                {selectedOption !== null && (
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="w-full py-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{currentStageIdx < stages.length - 1 ? 'Bước tiếp theo' : 'Xem kết quả Boss Battle'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl ${
              isPassed
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-white shadow-amber-500/30'
                : 'bg-gray-200 dark:bg-gray-800 text-[#748092]'
            }`}>
              {isPassed ? '🏆' : '💀'}
            </div>

            <div className="space-y-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isPassed ? 'bg-[#EBF8F2] text-[#45B97C]' : 'bg-red-100 text-red-500'
              }`}>
                {isPassed ? 'CHIẾN THẮNG BOSS ĐỈNH CAO' : 'CHƯA VƯỢT QUA BOSS'}
              </span>
              <h3 className="text-xl font-black text-[#243447] dark:text-white">
                {isPassed ? 'Chúc mừng bạn đã hạ gục Boss!' : 'Cố gắng lên, hãy thử lại!'}
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Điểm số đạt được: <span className="font-bold text-[#E85D3F] font-mono text-sm">{totalScore}</span> / 100 điểm (Yêu cầu {bossChallenge.requiredScoreToPass || 75} điểm)
              </p>
            </div>

            {isPassed ? (
              <div className="p-4 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-left space-y-1.5 text-xs text-[#3AA56E]">
                <div className="font-bold flex items-center gap-1.5 text-sm text-[#243447] dark:text-white">
                  <Sparkles size={16} className="text-[#F4B942]" />
                  <span>Phần thưởng chiến công:</span>
                </div>
                <p>• Nhận ngay <strong>+200 XP</strong> kinh nghiệm vào tài khoản</p>
                <p>• Mở khóa Huy hiệu <strong>Chiến Binh Đàm Thoại</strong></p>
                <p>• Khai mở Chương học tiếp theo trên Bản đồ hành trình</p>
              </div>
            ) : (
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Đừng nản lòng! Hãy ôn lại các bài học trong chương và khiêu chiến lại Boss bất cứ lúc nào.
              </p>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="py-3 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Khiêu chiến lại</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPassed && onBossBeaten) onBossBeaten(bossChallenge.id);
                  onClose();
                }}
                className={`flex-1 py-3 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPassed ? 'bg-[#45B97C] hover:bg-[#3AA56E]' : 'bg-[#243447] hover:bg-black'
                }`}
              >
                <span>{isPassed ? 'Nhận thưởng & Về Bản đồ' : 'Đóng'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
