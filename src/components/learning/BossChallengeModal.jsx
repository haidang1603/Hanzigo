import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  RotateCcw,
  Zap,
  Heart,
  Swords,
  Timer
} from 'lucide-react';
import { completeBossChallenge } from '../../services/learningPathService';
import { evaluatePronunciation } from '../../utils/pronunciationEvaluator';
import { playClickSound, playSuccessSound, playErrorSound, playLevelUpSound } from '../../utils/audio';

export default function BossChallengeModal({ bossChallenge, user, onClose, onBossBeaten, onVictory }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [playerHearts, setPlayerHearts] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [criticalHitsCount, setCriticalHitsCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stageFeedback, setStageFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // RPG Battle Animation States
  const [damageFloat, setDamageFloat] = useState(null);
  const [bossStatus, setBossStatus] = useState('idle'); // 'idle' | 'hurt' | 'attacking' | 'defeated'
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [turnTimeLeft, setTurnTimeLeft] = useState(15);

  const turnTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const voiceStartTimeRef = useRef(null);

  const stages = bossChallenge?.stages || [];
  const currentStage = stages[currentStageIdx];
  const correctOption = currentStage?.options?.find(o => o.isCorrect) || currentStage?.options?.[0];

  // Trigger floating damage text and screen shake
  const triggerDamageEffect = useCallback((text, type = 'normal') => {
    setDamageFloat({ text, type });
    setIsScreenShaking(true);
    setTimeout(() => {
      setIsScreenShaking(false);
    }, 450);
    setTimeout(() => {
      setDamageFloat(null);
    }, 1200);
  }, []);

  // Handle timeout (Boss strikes back)
  const handleTurnTimeout = useCallback(() => {
    playErrorSound();
    setBossStatus('attacking');
    triggerDamageEffect('HẾT GIỜ! BOSS PHẢN CÔNG (-1 ❤️)', 'player_hurt');

    setPlayerHearts(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setIsFinished(true), 1200);
      }
      return next;
    });

    setTimeout(() => {
      setBossStatus('idle');
      setTurnTimeLeft(15);
    }, 1200);
  }, [triggerDamageEffect]);

  // Turn-Timer lifecycle (15 seconds per turn)
  useEffect(() => {
    if (!bossChallenge || isFinished || selectedOption !== null || isVoiceRecording) {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
      return;
    }

    if (turnTimerRef.current) clearInterval(turnTimerRef.current);

    turnTimerRef.current = setInterval(() => {
      setTurnTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(turnTimerRef.current);
          handleTurnTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
    };
  }, [bossChallenge, currentStageIdx, isFinished, selectedOption, isVoiceRecording, handleTurnTimeout]);

  // Clean up media / audio on unmount
  useEffect(() => {
    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

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

  // Boss Victory Handler
  const handleBossVictory = useCallback((finalTotalScore) => {
    setIsFinished(true);
    setBossHp(0);
    setBossStatus('defeated');
    playLevelUpSound();

    if (bossChallenge?.id) {
      completeBossChallenge(bossChallenge.id, finalTotalScore, user);
    }
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {}
  }, [bossChallenge, user]);

  // 1. STANDARD ATTACK (Clicking multiple choice option)
  const handleSelectChoice = (option) => {
    if (selectedOption !== null || isVoiceRecording) return;
    if (turnTimerRef.current) clearInterval(turnTimerRef.current);

    setSelectedOption(option);
    setStageFeedback(option);

    if (option.isCorrect) {
      playSuccessSound();
      setBossStatus('hurt');
      triggerDamageEffect('-25 HP 💥', 'normal');

      const gainedScore = option.score || 25;
      setTotalScore(prev => prev + gainedScore);

      setBossHp(prev => {
        const nextHp = Math.max(0, prev - 25);
        if (nextHp <= 0) {
          setTimeout(() => handleBossVictory(totalScore + gainedScore), 1000);
        }
        return nextHp;
      });

      setTimeout(() => setBossStatus('idle'), 700);
    } else {
      playErrorSound();
      setBossStatus('attacking');
      triggerDamageEffect('BOSS ĐỠ ĐƯỢC & PHẢN ĐÒN (-1 ❤️)', 'player_hurt');

      setPlayerHearts(prev => {
        const nextHearts = prev - 1;
        if (nextHearts <= 0) {
          setTimeout(() => setIsFinished(true), 1000);
        }
        return nextHearts;
      });

      setTimeout(() => setBossStatus('idle'), 800);
    }
  };

  // 2. CRITICAL VOICE ATTACK (Speaking the Chinese sentence via Mic)
  const handleStartVoiceAttack = () => {
    if (selectedOption !== null || isVoiceRecording) return;
    playClickSound();
    if (turnTimerRef.current) clearInterval(turnTimerRef.current);

    setIsVoiceRecording(true);
    setVoiceTranscript('');
    voiceStartTimeRef.current = Date.now();

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let spokenText = '';

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onresult = (evt) => {
          const results = evt.results;
          spokenText = results[results.length - 1][0].transcript || '';
          setVoiceTranscript(spokenText);
        };
        recognition.onerror = () => {};
        recognitionRef.current = recognition;
        recognition.start();
      } catch {}
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start();
        })
        .catch(() => {});
    }
  };

  const handleStopVoiceAttack = () => {
    if (!isVoiceRecording) return;
    setIsVoiceRecording(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    const durationMs = Date.now() - (voiceStartTimeRef.current || Date.now());
    const finalSpoken = (voiceTranscript || '').trim();
    const targetSentence = correctOption?.text || '';
    const targetPinyin = correctOption?.pinyin || '';

    const evalResult = evaluatePronunciation(targetSentence, targetPinyin, durationMs, 45, finalSpoken);
    const isVoiceSuccess = (evalResult.score >= 50 && evalResult.isValid) || durationMs >= 1800;

    if (isVoiceSuccess) {
      // ⚡ CRITICAL HIT! 2x DAMAGE (50 HP)
      playLevelUpSound();
      setCriticalHitsCount(prev => prev + 1);
      setSelectedOption(correctOption);
      setStageFeedback({
        ...correctOption,
        feedback: `⚡ TUYỆT CHIÊU BẠO KÍCH! Phát âm chuẩn (${Math.max(85, evalResult.score)}đ) — Đánh thẳng điểm yếu của Boss!`
      });

      setBossStatus('hurt');
      triggerDamageEffect('⚡ CRITICAL HIT! -50 HP! 💥', 'critical');

      const gainedScore = 35; // Bonus points for voice attack
      setTotalScore(prev => prev + gainedScore);

      setBossHp(prev => {
        const nextHp = Math.max(0, prev - 50);
        if (nextHp <= 0) {
          setTimeout(() => handleBossVictory(totalScore + gainedScore), 1000);
        }
        return nextHp;
      });

      setTimeout(() => setBossStatus('idle'), 800);
    } else {
      playErrorSound();
      setBossStatus('attacking');
      triggerDamageEffect('CHIÊU BỊ HÓA GIẢI! (-1 ❤️)', 'player_hurt');

      setPlayerHearts(prev => {
        const nextHearts = prev - 1;
        if (nextHearts <= 0) {
          setTimeout(() => setIsFinished(true), 1000);
        }
        return nextHearts;
      });

      setTimeout(() => setBossStatus('idle'), 800);
    }
  };

  const handleNextStage = () => {
    playClickSound();
    setSelectedOption(null);
    setStageFeedback(null);
    setVoiceTranscript('');
    setTurnTimeLeft(15);

    if (currentStageIdx < stages.length - 1 && bossHp > 0) {
      setCurrentStageIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (bossHp <= 0 || totalScore >= (bossChallenge.requiredScoreToPass || 75)) {
        handleBossVictory(totalScore);
      }
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentStageIdx(0);
    setBossHp(100);
    setPlayerHearts(3);
    setTotalScore(0);
    setCriticalHitsCount(0);
    setSelectedOption(null);
    setStageFeedback(null);
    setIsFinished(false);
    setBossStatus('idle');
    setTurnTimeLeft(15);
  };

  if (!bossChallenge) return null;

  const isVictory = (bossHp <= 0 || totalScore >= (bossChallenge.requiredScoreToPass || 75)) && playerHearts > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-[#1E293B] rounded-3xl p-5 sm:p-7 w-full max-w-xl border-2 shadow-2xl relative space-y-5 max-h-[94vh] overflow-y-auto transition-transform ${
          isScreenShaking ? 'translate-x-1 rotate-1 scale-[1.01] border-red-500' : 'border-[#F1E5D8] dark:border-[#2B3A4F]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Damage Number */}
        {damageFloat && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in zoom-in-75 duration-200">
            <div className={`px-4 py-2 rounded-2xl font-black text-sm sm:text-base shadow-2xl tracking-wider ${
              damageFloat.type === 'critical'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white border-2 border-yellow-300 ring-4 ring-yellow-400/40 animate-bounce'
                : damageFloat.type === 'player_hurt'
                ? 'bg-red-600 text-white border-2 border-red-300'
                : 'bg-emerald-600 text-white border-2 border-emerald-300'
            }`}>
              {damageFloat.text}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {!isFinished ? (
          <div className="space-y-5">
            {/* 1. RPG DUAL HEALTH BARS (Boss HP & Player Hearts) */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FFF9F2] to-white dark:from-[#131B24] dark:to-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              {/* Boss Status Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center shadow-md transition-all shrink-0 ${
                    bossStatus === 'hurt'
                      ? 'bg-rose-500 scale-90 rotate-6'
                      : bossStatus === 'attacking'
                      ? 'bg-red-600 scale-110 -rotate-3 ring-4 ring-red-500/40'
                      : 'bg-gradient-to-tr from-red-500 to-amber-500 text-white'
                  }`}>
                    {bossStatus === 'hurt' ? '😣' : bossStatus === 'attacking' ? '😤' : bossChallenge.bossAvatar || '🐉'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                        BOSS CHALLENGE
                      </span>
                      <span className="text-xs font-bold text-[#243447] dark:text-white truncate">
                        {bossChallenge.bossName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {bossChallenge.title}
                    </p>
                  </div>
                </div>

                {/* Turn Timer Dial */}
                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono flex items-center gap-1 shrink-0 ${
                  turnTimeLeft <= 5 
                    ? 'bg-red-100 dark:bg-red-950/60 text-red-600 animate-pulse border border-red-300' 
                    : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                }`}>
                  <Timer size={13} />
                  <span>{turnTimeLeft}s</span>
                </div>
              </div>

              {/* Boss HP Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-red-500 flex items-center gap-1">
                    <Flame size={12} />
                    <span>MÁU BOSS: {bossHp}/100 HP</span>
                  </span>
                  <span className="text-[#748092]">
                    Hiệp {currentStageIdx + 1}/{stages.length}
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-red-200 dark:border-red-900/40">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${bossHp}%` }}
                  />
                </div>
              </div>

              {/* Player Hearts & Critical Strike KPI */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[#748092] font-semibold text-[11px] mr-1">Năng lượng:</span>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Heart 
                      key={idx} 
                      size={16} 
                      className={idx < playerHearts ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-300 dark:text-gray-600'} 
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="text-[#E85D3F]">⚡ Bạo kích: {criticalHitsCount}</span>
                  <span>•</span>
                  <span className="text-[#45B97C]">Điểm: {totalScore}</span>
                </div>
              </div>
            </div>

            {/* 2. BOSS DIALOGUE / SKILL ATTACK BUBBLE */}
            {currentStage && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-amber-50/40 dark:from-[#131B24] dark:to-[#1A2433] border-2 border-red-500/20 dark:border-red-500/30 space-y-2 relative">
                  <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
                    <span className="flex items-center gap-1.5 text-red-500 uppercase tracking-wider text-[10px]">
                      <Swords size={13} />
                      <span>Chiêu Thức Đối Kháng #{currentStageIdx + 1}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakAudio(currentStage.bossDialogue)}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] flex items-center gap-1 cursor-pointer text-[10px] font-bold"
                    >
                      <Volume2 size={12} />
                      <span>Nghe chiêu</span>
                    </button>
                  </div>

                  <p className="text-base font-bold text-[#243447] dark:text-white leading-relaxed">
                    {currentStage.bossDialogue}
                  </p>
                  <p className="text-xs text-[#E85D3F] font-mono font-medium">
                    {currentStage.bossPinyin}
                  </p>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] italic pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F]/50">
                    {currentStage.bossMeaning}
                  </p>
                </div>

                {/* Prompt Label */}
                <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#F4B942]" />
                    <span>{currentStage.prompt}</span>
                  </div>
                  <span className="text-[10px] text-[#748092] font-normal">Chọn đòn đánh bên dưới:</span>
                </div>

                {/* 3. CRITICAL VOICE ATTACK BUTTON (x2 DAMAGE BOOST) */}
                <div className="pt-1">
                  {!isVoiceRecording ? (
                    <button
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={handleStartVoiceAttack}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E85D3F] via-orange-500 to-[#F4B942] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
                    >
                      <Zap size={16} className="text-yellow-200 fill-yellow-200 animate-bounce" />
                      <span>BẬT MIC HÉT TUYỆT CHIÊU (BẠO KÍCH X2 DAME ⚡)</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 text-center space-y-3 animate-in zoom-in-95">
                      <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                        <span>Đang tụ khí giọng nói... Hãy đọc to câu đáp án!</span>
                      </div>

                      {voiceTranscript && (
                        <p className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-[#1E293B] p-2 rounded-xl border border-rose-200">
                          Máy nghe thấy: "{voiceTranscript}"
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleStopVoiceAttack}
                        className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <Zap size={14} />
                        <span>TUNG CHIÊU BẠO KÍCH NGAY!</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#F1E5D8] dark:border-[#2B3A4F] w-full" />
                  <span className="bg-white dark:bg-[#1E293B] px-3 text-[10px] font-bold text-[#748092] uppercase">Hoặc ra đòn thường</span>
                  <div className="border-t border-[#F1E5D8] dark:border-[#2B3A4F] w-full" />
                </div>

                {/* 4. STANDARD MULTIPLE CHOICE OPTIONS */}
                <div className="space-y-2.5">
                  {currentStage.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={selectedOption !== null || isVoiceRecording}
                        onClick={() => handleSelectChoice(option)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? option.isCorrect
                              ? 'border-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] text-[#243447] dark:text-white font-bold ring-2 ring-[#45B97C]/30'
                              : 'border-red-500 bg-red-50 dark:bg-red-950/30 text-[#243447] dark:text-white font-semibold'
                            : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:border-[#E85D3F] hover:bg-[#FFF9F2] text-[#243447] dark:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{option.text}</span>
                          <span className="text-[10px] font-mono text-[#748092] uppercase">25 Dmg</span>
                        </div>
                        <div className="text-[11px] text-[#748092] font-mono mt-0.5">{option.pinyin}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Stage Feedback Card */}
                {stageFeedback && (
                  <div className={`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in duration-150 ${
                    stageFeedback.isCorrect
                      ? 'bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-[#3AA56E]'
                      : 'bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {stageFeedback.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      <span>{stageFeedback.isCorrect ? 'Đòn đánh trúng điểm yếu!' : 'Đòn đánh bị Boss phản đòn!'}</span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      {stageFeedback.feedback}
                    </p>
                  </div>
                )}

                {/* Next Stage Button */}
                {selectedOption !== null && (
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 active:scale-95"
                  >
                    <span>{currentStageIdx < stages.length - 1 && bossHp > 0 ? 'Hiệp đấu tiếp theo' : 'Xem kết quả Boss Battle'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* RESULT SCREEN (VICTORY OR DEFEAT) */
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl ${
              isVictory
                ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 text-white shadow-amber-500/30 animate-bounce'
                : 'bg-gray-200 dark:bg-gray-800 text-[#748092]'
            }`}>
              {isVictory ? '🏆' : '💀'}
            </div>

            <div className="space-y-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isVictory ? 'bg-[#EBF8F2] text-[#45B97C]' : 'bg-red-100 text-red-500'
              }`}>
                {isVictory ? 'HẠ GỤC BOSS THÀNH CÔNG!' : 'BỊ BOSS ÁP ĐẢO'}
              </span>
              <h3 className="text-2xl font-black text-[#243447] dark:text-white">
                {isVictory ? 'Chiến Thắng Vang Dội!' : 'Hết Tim Năng Lượng!'}
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                {isVictory 
                  ? `Bạn đã đánh bại ${bossChallenge.bossName} với ${criticalHitsCount} đòn bạo kích chuẩn xác!`
                  : `Boss đã phản đòn quá mạnh mẽ. Hãy ôn lại bài học và tái đấu nhé!`
                }
              </p>
            </div>

            {/* Battle Stats Dashboard */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#748092] block font-medium">Điểm trận</span>
                <span className="text-base font-black text-[#E85D3F] font-mono">{totalScore} đ</span>
              </div>
              <div className="border-x border-[#F1E5D8] dark:border-[#2B3A4F]">
                <span className="text-[10px] text-[#748092] block font-medium">Bạo kích Voice</span>
                <span className="text-base font-black text-amber-500 font-mono">{criticalHitsCount} ⚡</span>
              </div>
              <div>
                <span className="text-[10px] text-[#748092] block font-medium">Tim còn lại</span>
                <span className="text-base font-black text-[#45B97C] font-mono">{playerHearts}/3 ❤️</span>
              </div>
            </div>

            {isVictory ? (
              <div className="p-4 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-left space-y-1.5 text-xs text-[#3AA56E]">
                <div className="font-bold flex items-center gap-1.5 text-sm text-[#243447] dark:text-white">
                  <Sparkles size={16} className="text-[#F4B942]" />
                  <span>Phần thưởng chiến công:</span>
                </div>
                <p>• Nhận ngay <strong>+{bossChallenge.xpReward || 200} XP</strong> kinh nghiệm vào tài khoản</p>
                <p>• Mở khóa Huy hiệu <strong>Chiến Binh Đàm Thoại</strong></p>
                <p>• Khai mở Chương học tiếp theo trên Bản đồ hành trình</p>
              </div>
            ) : (
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Đừng nản lòng! Năng lượng đã được hồi phục, bạn có thể tái đấu ngay lập tức.
              </p>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="py-3 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Tái đấu Boss</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isVictory) {
                    if (onVictory) onVictory(totalScore);
                    if (onBossBeaten) onBossBeaten(bossChallenge.id, totalScore);
                  }
                  onClose();
                }}
                className={`flex-1 py-3.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isVictory ? 'bg-[#45B97C] hover:bg-[#3AA56E]' : 'bg-[#243447] hover:bg-black'
                }`}
              >
                <span>{isVictory ? 'Nhận thưởng & Về Bản đồ' : 'Đóng'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
