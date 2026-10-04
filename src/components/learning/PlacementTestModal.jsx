import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Volume2,
  RotateCcw
} from 'lucide-react';
import { getPlacementQuestions, evaluatePlacementTest } from '../../services/learningPathService';
import { playClickSound, playSuccessSound, playLevelUpSound } from '../../utils/audio';

export default function PlacementTestModal({ user, onClose, onTestCompleted }) {
  const questions = getPlacementQuestions();
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro' | 'testing' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selfLevel, setSelfLevel] = useState('beginner');
  const [result, setResult] = useState(null);

  const currentQ = questions[currentIndex];

  const handleStartTest = () => {
    playClickSound();
    setCurrentStep('testing');
    setCurrentIndex(0);
    setAnswers({});
  };

  const handleSelectOption = (optionIndex) => {
    playClickSound();
    const updatedAnswers = { ...answers, [currentQ.id]: optionIndex };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 250);
    } else {
      // Completed all questions
      const res = evaluatePlacementTest(updatedAnswers, selfLevel, user);
      setResult(res);
      setCurrentStep('result');
      playLevelUpSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const handleApplyResult = () => {
    playSuccessSound();
    if (onTestCompleted) {
      onTestCompleted(result);
    }
    onClose();
  };

  const handleSpeakAudio = (text) => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* STEP 1: INTRO */}
        {currentStep === 'intro' && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#E85D3F]/20">
              <Compass size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#243447] dark:text-white">
                Kiểm tra trình độ tiếng Trung
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed max-w-md mx-auto">
                Làm bài đánh giá ngắn (10 câu hỏi) để HanziGo gợi ý điểm xuất phát tối ưu nhất, không cần học lại những gì bạn đã biết!
              </p>
            </div>

            {/* Self assessment options */}
            <div className="space-y-2 text-left pt-2">
              <label className="text-xs font-bold text-[#243447] dark:text-white block">
                Tự đánh giá trình độ hiện tại của bạn:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'zero', label: 'Chưa biết gì', desc: 'Bắt đầu từ vỡ lòng Pinyin' },
                  { id: 'pinyin', label: 'Đã biết Pinyin', desc: 'Có thể phát âm đơn giản' },
                  { id: 'basic', label: 'Tiếng Trung cơ bản', desc: 'Giao tiếp sinh hoạt cơ bản' },
                  { id: 'hsk3', label: 'Đã học HSK 3+', desc: 'Muốn học nâng cao' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelfLevel(opt.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selfLevel === opt.id
                        ? 'border-[#E85D3F] bg-[#FFF9F2] dark:bg-[#2D1E1B] text-[#E85D3F] shadow-xs'
                        : 'border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:border-[#E85D3F]/50'
                    }`}
                  >
                    <span className="font-bold block text-[#243447] dark:text-white">{opt.label}</span>
                    <span className="text-[10px] opacity-80">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white"
              >
                Học từ Level 1
              </button>
              <button
                type="button"
                onClick={handleStartTest}
                className="flex-1 py-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Bắt đầu test (10 câu)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TESTING */}
        {currentStep === 'testing' && currentQ && (
          <div className="space-y-5">
            {/* Header progress */}
            <div className="flex items-center justify-between text-xs font-bold text-[#748092]">
              <span className="px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F]">
                {currentQ.skill} • {currentQ.level}
              </span>
              <span>
                Câu {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#F1E5D8] dark:bg-[#131B24] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E85D3F] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question title */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#243447] dark:text-white leading-snug">
                {currentQ.question}
              </h4>

              {currentQ.audioText && (
                <button
                  type="button"
                  onClick={() => handleSpeakAudio(currentQ.audioText)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] hover:bg-[#FDEEEB] flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Volume2 size={16} />
                  <span>Bấm nghe Audio</span>
                </button>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className="w-full p-3.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] text-left text-xs font-medium text-[#243447] dark:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{option}</span>
                  <div className="w-5 h-5 rounded-full border border-[#CBD5E1] group-hover:border-[#E85D3F] flex items-center justify-center shrink-0 ml-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#E85D3F] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {currentStep === 'result' && result && (
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] flex items-center justify-center mx-auto border-2 border-[#45B97C] shadow-lg">
              <Trophy size={32} />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#45B97C] uppercase tracking-wider">
                Kết quả đánh giá năng lực
              </span>
              <h3 className="text-xl font-black text-[#243447] dark:text-white">
                {result.levelTitle}
              </h3>
              <p className="text-xs text-[#E85D3F] font-bold">
                Chính xác {result.correctCount} / {result.total} câu ({result.percentage}%) • +100 XP Thưởng
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#243447] dark:text-white">
                <Sparkles size={14} className="text-[#F4B942]" />
                <span>Đề xuất lộ trình tối ưu:</span>
              </div>
              <p className="text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                {result.rationale}
              </p>
              <div className="pt-1 text-[11px] text-[#45B97C] font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Hệ thống đã tự động mở khóa các Level tương ứng trên Bản đồ.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleStartTest}
                className="py-2.5 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Làm lại</span>
              </button>
              <button
                type="button"
                onClick={handleApplyResult}
                className="flex-1 py-3 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Vào bản đồ học ngay</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
