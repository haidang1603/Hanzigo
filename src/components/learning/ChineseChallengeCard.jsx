import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  Award,
  Zap,
  Volume2
} from 'lucide-react';
import { 
  getCurrentDailyChallenge, 
  getCurrentWeeklyChallenge, 
  evaluateChallengeSubmission 
} from '../../services/gamificationService';
import { playClickSound, playSuccessSound } from '../../utils/audio';

export default function ChineseChallengeCard({ user, onAddXp }) {
  const [challengeType, setChallengeType] = useState('daily'); // 'daily' | 'weekly'
  const [daily, setDaily] = useState(() => getCurrentDailyChallenge(user));
  const [weekly, setWeekly] = useState(() => getCurrentWeeklyChallenge(user));
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);

  const activeChallenge = challengeType === 'daily' ? daily : weekly;

  // Initialize Speech Recognition for zh-CN if supported in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setAudioTranscript(transcript);
          setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } catch {}
    }
  }, []);

  const handleToggleRecord = () => {
    playClickSound();
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói trực tiếp. Bạn có thể gõ văn bản tiếng Trung vào ô bên dưới!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setFeedback(null);
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) {
      setFeedback({ success: false, message: 'Vui lòng nhập câu trả lời hoặc sử dụng Mic để nói!' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Call Gamification Challenge Evaluator
    const result = evaluateChallengeSubmission(
      activeChallenge.id,
      {
        text: inputText,
        type: audioTranscript ? 'audio' : 'text',
        audioScore: audioTranscript ? 88 : 80
      },
      user
    );

    setIsSubmitting(false);

    if (result.success) {
      playSuccessSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      setFeedback({
        success: true,
        message: result.feedback,
        xp: result.xpEarned
      });

      if (onAddXp && result.xpEarned > 0) {
        onAddXp(result.xpEarned);
      }

      // Refresh challenge state
      setDaily(getCurrentDailyChallenge(user));
      setWeekly(getCurrentWeeklyChallenge(user));
      setInputText('');
      setAudioTranscript('');
    } else {
      setFeedback({
        success: false,
        message: result.feedback
      });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FEF7E9] to-[#FFF9F2] dark:from-[#1E293B] dark:to-[#131B24] border border-[#F4B942]/50 shadow-sm space-y-4">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
            <Flame size={16} />
          </span>
          <h3 className="text-sm font-bold text-[#243447] dark:text-white uppercase tracking-wider">
            Thử thách Hán ngữ
          </h3>
        </div>

        {/* Tab switch: Daily vs Weekly */}
        <div className="flex items-center p-0.5 bg-white/80 dark:bg-black/30 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setChallengeType('daily');
              setFeedback(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              challengeType === 'daily'
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            Hàng ngày
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setChallengeType('weekly');
              setFeedback(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              challengeType === 'weekly'
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            Tuần này
          </button>
        </div>
      </div>

      {/* Challenge Description Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B]/80 border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#243447] dark:text-white flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#F4B942]" />
            <span>{activeChallenge.title}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
            <Zap size={10} className="fill-amber-500" />
            +{activeChallenge.xpReward} XP
          </span>
        </div>

        <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
          {activeChallenge.desc}
        </p>

        {activeChallenge.hint && (
          <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 text-[11px] text-[#E85D3F] font-medium border border-orange-200/50 dark:border-orange-900/30">
            💡 {activeChallenge.hint}
          </div>
        )}
      </div>

      {/* Completion Status or Submission Form */}
      {activeChallenge.isCompleted ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3">
          <CheckCircle2 size={24} className="text-[#45B97C] shrink-0" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              Đã hoàn thành thử thách kỳ này!
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Bạn đã nhận thành công +{activeChallenge.xpReward} XP. Hãy quay lại trong kỳ tiếp theo nhé!
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu tiếng Trung của bạn tại đây hoặc nhấn Mic..."
              className="w-full p-3.5 pr-12 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F] resize-none"
            />
            {/* Mic speech input button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              title={isRecording ? 'Dừng ghi âm' : 'Nhấn để nói tiếng Trung'}
              className={`absolute right-3 top-3 p-2 rounded-xl transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-orange-100 dark:bg-orange-950/50 text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white'
              }`}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>

          {isRecording && (
            <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Đang lắng nghe tiếng Trung (zh-CN)... Hãy nói to và rõ ràng!</span>
            </p>
          )}

          {/* Feedback message banner */}
          {feedback && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-semibold ${
              feedback.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
            }`}>
              {feedback.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />}
              <span>{feedback.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !inputText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} />
            <span>Nộp bài thử thách (+{activeChallenge.xpReward} XP)</span>
          </button>
        </form>
      )}
    </div>
  );
}
