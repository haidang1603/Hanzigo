import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  RotateCcw, 
  Check, 
  BookOpen, 
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Layers,
  AlertCircle
} from 'lucide-react';
import { completeLesson, getUserJourneyProgress } from '../../services/learningPathService';
import { evaluatePronunciation } from '../../utils/pronunciationEvaluator';
import { playClickSound, playSuccessSound, playErrorSound, playLevelUpSound } from '../../utils/audio';

export default function InteractiveLessonPlayer({ 
  lesson, 
  user, 
  onBack, 
  onClose, 
  onCompleteNext, 
  onNextLesson, 
  onCompleteLesson 
}) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 8 (9 steps)
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [quizScore, setQuizScore] = useState(0);
  const [stepWarning, setStepWarning] = useState(null);

  const handleClose = () => {
    if (onBack) onBack();
    else if (onClose) onClose();
  };

  const handleNextLessonAction = () => {
    if (onNextLesson && lesson?.nextLessonId) {
      onNextLesson(lesson.nextLessonId);
    } else if (onCompleteNext) {
      onCompleteNext();
    } else {
      handleClose();
    }
  };

  // Step 5: Listening speed & toggles
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Step 6: Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speakingFeedback, setSpeakingFeedback] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const recognitionRef = useRef(null);
  const spokenTranscriptRef = useRef('');
  const recordingStartTimeRef = useRef(null);
  const streamRef = useRef(null);

  // Step 7: Writing reordering state
  const [reorderedWords, setReorderedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [writingChecked, setWritingChecked] = useState(false);
  const [writingCorrect, setWritingCorrect] = useState(false);

  // Step 8: Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFeedbacks, setQuizFeedbacks] = useState({});

  // Check if previously completed
  const journeyProgress = getUserJourneyProgress(user);
  const isAlreadyCompleted = Boolean(journeyProgress.completedLessons?.[lesson?.id]);

  useEffect(() => {
    if (lesson?.step7_writing?.words) {
      setAvailableWords([...lesson.step7_writing.words].sort(() => Math.random() - 0.5));
      setReorderedWords([]);
      setWritingChecked(false);
      setWritingCorrect(false);
      setStepWarning(null);
    }
  }, [lesson]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [lesson?.id, currentStep]);

  if (!lesson) return null;

  const stepsMeta = [
    { num: 1, title: 'Learn', icon: '📖', label: 'Khám phá' },
    { num: 2, title: 'Vocab', icon: '🧠', label: 'Từ vựng' },
    { num: 3, title: 'Hanzi', icon: '🀄', label: 'Chữ Hán' },
    { num: 4, title: 'Grammar', icon: '📚', label: 'Ngữ pháp' },
    { num: 5, title: 'Listening', icon: '🎧', label: 'Luyện nghe' },
    { num: 6, title: 'Speaking', icon: '🗣️', label: 'Nói phản xạ' },
    { num: 7, title: 'Writing', icon: '✍️', label: 'Ghép câu' },
    { num: 8, title: 'Quiz', icon: '🎯', label: 'Trắc nghiệm' },
    { num: 9, title: 'Challenge', icon: '🔥', label: 'Thử thách' }
  ];

  const handleSpeak = (text, rate = null) => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate !== null ? rate : (isSlowAudio ? 0.65 : 0.9);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mic recording for speaking
  const handleToggleRecord = () => {
    playClickSound();
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    } else {
      // Start recording
      setSpeakingFeedback(null);
      setRecordedAudioUrl(null);
      setStepWarning(null);
      setSpeechTranscript('');
      spokenTranscriptRef.current = '';
      recordingStartTimeRef.current = Date.now();
      audioChunksRef.current = [];

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'zh-CN';
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.onresult = (evt) => {
            const results = evt.results;
            const transcript = results[results.length - 1][0].transcript || '';
            spokenTranscriptRef.current = transcript;
            setSpeechTranscript(transcript);
          };
          recognition.onerror = (e) => {
            console.warn('Speaking recognition error:', e.error);
          };
          recognitionRef.current = recognition;
          recognition.start();
        } catch (recErr) {
          console.warn('Recognition start error:', recErr);
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = e => {
              if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = () => {
              if (audioChunksRef.current.length > 0) {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(url);
              }

              // Evaluate after brief timeout to let recognition finish delivering final transcript
              setTimeout(() => {
                const spoken = (spokenTranscriptRef.current || '').trim();
                const durationMs = Date.now() - (recordingStartTimeRef.current || Date.now());
                const target = lesson.step6_speaking?.targetSentence || '';
                const targetPinyin = lesson.step6_speaking?.targetPinyin || '';

                const evalResult = evaluatePronunciation(target, targetPinyin, durationMs, 45, spoken);
                setSpeakingFeedback(evalResult);

                if (evalResult.score >= 50 && evalResult.isValid) {
                  playSuccessSound();
                  setStepWarning(null);
                } else {
                  playErrorSound();
                  if (!spoken) {
                    setStepWarning('Không nhận diện được giọng nói. Bạn hãy bấm Micro và phát âm to, rõ ràng theo câu mẫu tiếng Trung để được chấm điểm nhé!');
                  } else {
                    setStepWarning(`Điểm phát âm: ${evalResult.score}/100. Máy nghe thấy: "${spoken}". Hãy luyện tập và phát âm lại rõ hơn để đạt từ 50 điểm nhé!`);
                  }
                }
              }, 250);
            };
            mediaRecorder.start();
            setIsRecording(true);
          })
          .catch(err => {
            console.warn('Mic access error:', err);
            setIsRecording(false);
            playErrorSound();
            setStepWarning('Không thể truy cập Microphone. Vui lòng kiểm tra quyền truy cập micro trên trình duyệt.');
          });
      } else {
        setIsRecording(false);
        setStepWarning('Trình duyệt không hỗ trợ thu âm Microphone.');
      }
    }
  };

  // Writing tile toggle
  const handleWordTileClick = (word, isFromAvailable) => {
    if (writingCorrect) return; // Locked only once solved correctly
    playClickSound();
    setWritingChecked(false);
    setWritingCorrect(false);
    setStepWarning(null);
    if (isFromAvailable) {
      setAvailableWords(prev => prev.filter(w => w !== word));
      setReorderedWords(prev => [...prev, word]);
    } else {
      setReorderedWords(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const handleResetWriting = () => {
    playClickSound();
    if (lesson?.step7_writing?.words) {
      setAvailableWords([...lesson.step7_writing.words].sort(() => Math.random() - 0.5));
      setReorderedWords([]);
      setWritingChecked(false);
      setWritingCorrect(false);
      setStepWarning(null);
    }
  };

  const handleCheckWriting = () => {
    playClickSound();
    const correctOrder = lesson.step7_writing?.correctOrder || [];
    const isCorrect = reorderedWords.join('') === correctOrder.join('');
    setWritingChecked(true);
    setWritingCorrect(isCorrect);
    if (isCorrect) {
      playSuccessSound();
      setStepWarning(null);
    } else {
      playErrorSound();
      setStepWarning('❌ Thứ tự câu chưa đúng! Hãy bấm vào thẻ từ để chỉnh lại hoặc bấm "Xếp lại".');
    }
  };

  // Quiz answering: can retry wrong options until correct!
  const handleSelectQuizOption = (quizId, optIdx, correctIdx) => {
    if (quizFeedbacks[quizId] === true) return; // Locked once answered correctly
    playClickSound();
    const isCorrect = optIdx === correctIdx;
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optIdx }));
    setQuizFeedbacks(prev => ({ ...prev, [quizId]: isCorrect }));

    if (isCorrect) {
      setQuizScore(prev => prev + 25);
      playSuccessSound();
      setStepWarning(null);
    } else {
      playErrorSound();
      setStepWarning('❌ Đáp án chưa chính xác, hãy suy nghĩ và chọn lại phương án đúng để vượt qua!');
    }
  };

  // Validation gating: check if learner meets requirements to advance
  const canProceedToNextStep = () => {
    // Step 6: Speaking (Index 5)
    if (currentStep === 5) {
      if (!speakingFeedback) {
        return {
          canProceed: false,
          message: '🎙️ Vui lòng bật Mic và luyện phát âm câu tiếng Trung trước khi sang bước tiếp theo!'
        };
      }
      if (speakingFeedback.score < 50) {
        return {
          canProceed: false,
          message: `⚠️ Điểm phát âm (${speakingFeedback.score}/100) chưa đạt tối thiểu 50đ. Hãy luyện phát âm lại nhé!`
        };
      }
    }

    // Step 7: Writing / Ghép câu (Index 6)
    if (currentStep === 6 && lesson.step7_writing) {
      if (!writingChecked) {
        return {
          canProceed: false,
          message: '✍️ Bạn chưa hoàn thành ghép câu! Vui lòng xếp các từ và bấm "Kiểm tra đáp án".'
        };
      }
      if (!writingCorrect) {
        return {
          canProceed: false,
          message: '❌ Thứ tự ghép câu chưa đúng! Hãy chỉnh lại các từ cho đúng để tiếp tục.'
        };
      }
    }

    // Step 8: Quiz (Index 7)
    if (currentStep === 7 && lesson.step8_quiz) {
      for (let i = 0; i < lesson.step8_quiz.length; i++) {
        const q = lesson.step8_quiz[i];
        if (selectedAnswers[q.id] === undefined) {
          return {
            canProceed: false,
            message: `🎯 Bạn chưa chọn đáp án cho Câu hỏi số ${i + 1}!`
          };
        }
        if (quizFeedbacks[q.id] !== true) {
          return {
            canProceed: false,
            message: `❌ Câu hỏi số ${i + 1} chưa chính xác! Hãy chọn phương án đúng để vượt qua.`
          };
        }
      }
    }

    return { canProceed: true, message: null };
  };

  const handleNextStep = () => {
    const check = canProceedToNextStep();
    if (!check.canProceed) {
      playErrorSound();
      setStepWarning(check.message);
      return;
    }
    setStepWarning(null);
    playClickSound();
    setCurrentStep(prev => Math.min(8, prev + 1));
  };

  // Replay / Re-learn lesson anytime
  const handleRestartLesson = () => {
    playClickSound();
    setCurrentStep(0);
    setIsCompleted(false);
    setEarnedStars(3);
    setQuizScore(0);
    setSpeakingFeedback(null);
    setRecordedAudioUrl(null);
    setSpeechTranscript('');
    setIsRecording(false);
    if (lesson?.step7_writing?.words) {
      setAvailableWords([...lesson.step7_writing.words].sort(() => Math.random() - 0.5));
      setReorderedWords([]);
      setWritingChecked(false);
      setWritingCorrect(false);
    }
    setSelectedAnswers({});
    setQuizFeedbacks({});
    setStepWarning(null);
  };

  // Complete lesson
  const handleFinishLesson = () => {
    playLevelUpSound();
    const finalScore = Math.min(100, Math.max(70, 75 + quizScore));
    const { stars } = completeLesson(lesson.id, finalScore, user);
    setEarnedStars(stars);
    setIsCompleted(true);
    if (onCompleteLesson) onCompleteLesson(finalScore, stars);

    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="min-h-[85vh] flex flex-col bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6]">
      {/* 1. Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-b border-[#F1E5D8] dark:border-[#2B3A4F] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Quay lại Lộ trình</span>
          </button>

          <div className="flex-1 max-w-md mx-auto text-center min-w-0">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#748092]">
              <span>Bài {lesson.lessonNumber}:</span>
              <span className="text-[#243447] dark:text-white truncate">{lesson.title}</span>
              {isAlreadyCompleted && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} />
                  <span>Ôn tập lại</span>
                </span>
              )}
            </div>
            <div className="h-2 w-full bg-[#F1E5D8] dark:bg-[#131B24] rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / stepsMeta.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestartLesson}
              title="Học lại bài này từ đầu"
              className="p-2 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Học lại</span>
            </button>

            <div className="flex items-center gap-1 text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-3 py-1.5 rounded-xl shrink-0">
              <Sparkles size={14} />
              <span>+{lesson.xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Step Navigator Pills */}
      <div className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-white/60 dark:bg-[#1E293B]/60 overflow-x-auto scrollbar-none py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 min-w-max">
          {stepsMeta.map((s, idx) => {
            const isActive = currentStep === idx;
            const isPassed = currentStep > idx;
            return (
              <button
                key={s.num}
                onClick={() => {
                  if (idx > currentStep) {
                    const check = canProceedToNextStep();
                    if (!check.canProceed) {
                      playErrorSound();
                      setStepWarning(check.message);
                      return;
                    }
                  }
                  setStepWarning(null);
                  playClickSound();
                  setCurrentStep(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : isPassed
                    ? 'bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C]'
                    : 'text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                {isPassed && <Check size={11} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Step Content Container */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {!isCompleted ? (
          <>
            {/* STEP 1: 📖 LEARN */}
            {currentStep === 0 && lesson.step1_learn && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 1: Khám phá kiến thức mới
                  </span>
                  <h3 className="text-xl font-black text-[#243447] dark:text-white">
                    {lesson.step1_learn.topic}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {lesson.step1_learn.summary}
                  </p>
                </div>

                {/* Tone / Initial Guides */}
                {lesson.step1_learn.toneGuide && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {lesson.step1_learn.toneGuide.map((t, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#E85D3F]">{t.name}</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                            {t.symbol}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{t.desc}</p>
                        <div className="text-xs font-medium text-[#243447] dark:text-white pt-1">
                          Ví dụ: <span className="font-bold text-[#45B97C]">{t.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Initial breakdown */}
                {lesson.step1_learn.initialsGuide && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-[#243447] dark:text-white">
                      Bảng phát âm chi tiết:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {lesson.step1_learn.initialsGuide.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                          <div>
                            <span className="font-black text-[#E85D3F] text-base font-mono mr-2">{item.char}</span>
                            <span className="text-[#748092] text-[11px]">{item.read}</span>
                          </div>
                          {item.example && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF9F2] dark:bg-[#131B24] text-[#45B97C]">
                              {item.example}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio demo button */}
                {lesson.step1_learn.audioDemoText && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleSpeak(lesson.step1_learn.audioDemoText)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Volume2 size={16} />
                      <span>Nghe phát âm mẫu chuẩn toàn bài</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: 🧠 VOCABULARY */}
            {currentStep === 1 && lesson.step2_vocabulary && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Từ vựng cốt lõi ({lesson.step2_vocabulary.length} từ)
                  </h3>
                  <p className="text-xs text-[#748092]">Bấm biểu tượng loa để nghe phát âm từng từ và câu ví dụ</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {lesson.step2_vocabulary.map(v => (
                    <div key={v.id} className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-3xl font-black text-[#243447] dark:text-white font-serif tracking-wider">
                            {v.hanzi}
                          </div>
                          <div className="text-xs font-bold text-[#E85D3F] font-mono mt-0.5">
                            {v.pinyin} • {v.hanviet}
                          </div>
                        </div>
                        <button
                          onClick={() => handleSpeak(v.audioText || v.hanzi)}
                          className="p-2.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors"
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-[#243447] dark:text-white">
                        {v.meaning}
                      </div>

                      {v.example && (
                        <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                          <div className="font-bold text-[#243447] dark:text-white flex items-center justify-between">
                            <span>{v.example.hanzi}</span>
                            <button
                              onClick={() => handleSpeak(v.example.hanzi)}
                              className="text-[#E85D3F] hover:text-[#CB4529] p-0.5"
                            >
                              <Volume2 size={13} />
                            </button>
                          </div>
                          <div className="text-[#E85D3F] font-mono text-[11px]">{v.example.pinyin}</div>
                          <div className="text-[#748092] text-[11px]">{v.example.meaning}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: 🀄 HANZI */}
            {currentStep === 2 && lesson.step3_hanzi && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Phân tích cấu tạo & Thuận bút chữ Hán
                  </h3>
                  <p className="text-xs text-[#748092]">Hiểu quy tắc nét bút và câu chuyện gợi nhớ (mnemonic) giúp nhớ lâu gấp 3 lần</p>
                </div>

                <div className="space-y-4">
                  {lesson.step3_hanzi.map((h, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-4xl font-serif font-black text-[#E85D3F] flex items-center justify-center">
                          {h.hanzi}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-[#243447] dark:text-white">
                            Chữ {h.hanzi} ({h.pinyin}) — {h.meaning}
                          </h4>
                          <p className="text-xs text-[#748092]">Số nét: <span className="font-bold text-[#E85D3F]">{h.strokesCount} nét</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                          <span className="font-bold text-[#E85D3F] block">Quy tắc thứ tự nét:</span>
                          <span className="text-[#243447] dark:text-white">{h.strokeOrderText}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                          <span className="font-bold text-[#45B97C] block">Bộ phận & Bộ thủ:</span>
                          <span className="text-[#243447] dark:text-white">{h.components}</span>
                        </div>
                      </div>

                      {h.mnemonic && (
                        <div className="p-3.5 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-[#45B97C]/30 text-xs space-y-1">
                          <span className="font-bold text-[#3AA56E] flex items-center gap-1.5">
                            <Sparkles size={14} />
                            <span>Mẹo ghi nhớ nhanh:</span>
                          </span>
                          <p className="text-[#243447] dark:text-[#CBD5E1] leading-relaxed">{h.mnemonic}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: 📚 GRAMMAR */}
            {currentStep === 3 && lesson.step4_grammar && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-5 animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 4: Cấu trúc ngữ pháp
                  </span>
                  <h3 className="text-xl font-black text-[#243447] dark:text-white">
                    {lesson.step4_grammar.title}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/30 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#748092]">Công thức ngữ pháp</span>
                  <div className="text-base font-bold font-mono text-[#E85D3F]">
                    {lesson.step4_grammar.formula}
                  </div>
                </div>

                <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                  {lesson.step4_grammar.explanation}
                </p>

                {/* Examples */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-[#243447] dark:text-white">
                    Ví dụ ứng dụng thực tế:
                  </h4>
                  {lesson.step4_grammar.examples.map((ex, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#243447] dark:text-white text-sm">{ex.hanzi}</div>
                        <div className="text-[#E85D3F] font-mono text-[11px]">{ex.pinyin}</div>
                        <div className="text-[#748092]">{ex.meaning}</div>
                      </div>
                      <button
                        onClick={() => handleSpeak(ex.hanzi)}
                        className="p-2 rounded-xl text-[#E85D3F] hover:bg-[#FDEEEB]"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Common mistake */}
                {lesson.step4_grammar.commonMistake && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs space-y-1.5">
                    <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle size={15} />
                      <span>Lỗi sai thường gặp của người Việt:</span>
                    </span>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="line-through text-red-500">{lesson.step4_grammar.commonMistake.wrong}</span>
                      <ArrowRight size={13} className="text-[#748092]" />
                      <span className="font-bold text-[#45B97C]">{lesson.step4_grammar.commonMistake.correct}</span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      {lesson.step4_grammar.commonMistake.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: 🎧 LISTENING */}
            {currentStep === 4 && lesson.step5_listening && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                      Step 5: Luyện nghe hiểu hội thoại
                    </span>
                    <h3 className="text-base font-bold text-[#243447] dark:text-white">
                      Nghe đoạn đàm thoại thực tế
                    </h3>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSlowAudio(!isSlowAudio)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                        isSlowAudio 
                          ? 'border-[#E85D3F] bg-[#FDEEEB] text-[#E85D3F]' 
                          : 'border-[#F1E5D8] text-[#748092]'
                      }`}
                    >
                      {isSlowAudio ? 'Tốc độ: 0.65x (Chậm)' : 'Tốc độ: Chuẩn'}
                    </button>

                    <button
                      onClick={() => setShowPinyin(!showPinyin)}
                      className="p-1.5 rounded-xl border border-[#F1E5D8] text-[#748092]"
                      title="Bật/Tắt Pinyin"
                    >
                      {showPinyin ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                {/* Master Play Button */}
                <button
                  onClick={() => handleSpeak(lesson.step5_listening.audioText)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#3AA56E] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 size={20} />
                  <span>Phát toàn bộ đoạn hội thoại</span>
                </button>

                {/* Dialogue lines */}
                <div className="space-y-3 pt-2">
                  {lesson.step5_listening.dialogue.map((line, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {line.speaker}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="font-bold text-[#243447] dark:text-white text-sm">{line.hanzi}</div>
                        {showPinyin && (
                          <div className="text-[#E85D3F] font-mono text-[11px]">{line.pinyin}</div>
                        )}
                        {showTranslation && (
                          <div className="text-[#748092] text-[11px]">{line.meaning}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSpeak(line.hanzi)}
                        className="text-[#748092] hover:text-[#E85D3F] p-1"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Comprehension Question */}
                {lesson.step5_listening.question && (
                  <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                    <h4 className="text-xs font-bold text-[#243447] dark:text-white">
                      Câu hỏi nghe hiểu: {lesson.step5_listening.question}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {lesson.step5_listening.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (idx === lesson.step5_listening.correctIndex) {
                              playSuccessSound();
                              alert('Chính xác! Bạn nghe hiểu rất tốt.');
                            } else {
                              playErrorSound();
                              alert('Chưa chính xác, hãy nghe lại kỹ hơn nhé!');
                            }
                          }}
                          className="p-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-left hover:border-[#45B97C] transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: 🗣️ SPEAKING */}
            {currentStep === 5 && lesson.step6_speaking && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 text-center animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 6: Nói phản xạ & Chấm điểm thanh điệu
                  </span>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Tình huống: {lesson.step6_speaking.prompt}
                  </h3>
                </div>

                {/* Target Sentence Card */}
                <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-[#E85D3F]/30 space-y-2">
                  <span className="text-[11px] text-[#748092] uppercase font-bold">Câu mục tiêu cần nói:</span>
                  <div className="text-2xl font-black text-[#243447] dark:text-white font-serif">
                    {lesson.step6_speaking.targetSentence}
                  </div>
                  <div className="text-sm font-bold font-mono text-[#E85D3F]">
                    {lesson.step6_speaking.targetPinyin}
                  </div>
                  <div className="text-xs text-[#748092]">
                    Nghĩa: {lesson.step6_speaking.targetMeaning}
                  </div>
                  <button
                    onClick={() => handleSpeak(lesson.step6_speaking.targetSentence)}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] text-xs font-bold text-[#E85D3F] inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Volume2 size={14} />
                    <span>Nghe giọng mẫu</span>
                  </button>
                </div>

                {/* Mic Record Button */}
                <div className="py-2">
                  <button
                    onClick={handleToggleRecord}
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white shadow-xl transition-all active:scale-95 cursor-pointer ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse ring-8 ring-red-500/20' 
                        : 'bg-gradient-to-tr from-[#E85D3F] to-[#F4B942]'
                    }`}
                  >
                    {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                  <p className="text-xs font-bold text-[#748092] mt-3">
                    {isRecording ? 'Đang lắng nghe... Bấm lại để dừng và chấm điểm' : 'Bấm micro để bắt đầu nói'}
                  </p>
                </div>

                {/* Pronunciation Feedback */}
                {speakingFeedback && (
                  <div className={`p-4 rounded-2xl border text-left space-y-2 text-xs animate-in zoom-in-95 ${
                    speakingFeedback.score >= 50 && speakingFeedback.isValid
                      ? 'bg-[#EBF8F2] dark:bg-[#162B21] border-[#45B97C]/30'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className={`flex items-center gap-1.5 ${
                        speakingFeedback.score >= 50 && speakingFeedback.isValid ? 'text-[#3AA56E]' : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        {speakingFeedback.score >= 50 && speakingFeedback.isValid ? (
                          <CheckCircle2 size={16} className="shrink-0" />
                        ) : (
                          <AlertCircle size={16} className="shrink-0 text-amber-600" />
                        )}
                        <span>{speakingFeedback.rankBadge || 'Đánh giá phản xạ'}: {speakingFeedback.feedback}</span>
                      </span>
                      <span className={`font-mono text-base font-black ${
                        speakingFeedback.score >= 50 && speakingFeedback.isValid ? 'text-[#45B97C]' : 'text-rose-500'
                      }`}>
                        {speakingFeedback.score} / 100 điểm
                      </span>
                    </div>

                    {speechTranscript && (
                      <div className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                        Máy nhận diện được: <strong className="text-[#243447] dark:text-white">"{speechTranscript}"</strong>
                      </div>
                    )}

                    {recordedAudioUrl && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[11px] text-[#748092]">Nghe lại bản thu của bạn:</span>
                        <audio src={recordedAudioUrl} controls className="h-8 w-48" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: ✍️ WRITING */}
            {currentStep === 6 && lesson.step7_writing && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 7: Sắp xếp câu hoàn chỉnh
                  </span>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    {lesson.step7_writing.prompt}
                  </h3>
                </div>

                {/* Sentence Drop Zone */}
                <div className="min-h-16 p-3.5 rounded-2xl border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 flex flex-wrap items-center gap-2">
                  {reorderedWords.length === 0 ? (
                    <span className="text-xs text-[#748092] italic">Bấm các thẻ từ bên dưới để ghép vào đây...</span>
                  ) : (
                    reorderedWords.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWordTileClick(word, false)}
                        className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-sm shadow-xs transition-transform active:scale-95"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available word tiles */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleWordTileClick(word, true)}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-sm hover:border-[#E85D3F] transition-all active:scale-95 shadow-xs"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Validation button & Reset button */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleResetWriting}
                    disabled={reorderedWords.length === 0 && availableWords.length === (lesson.step7_writing?.words?.length || 0)}
                    className="py-3 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 text-[#748092] hover:text-[#243447] dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    title="Xếp lại từ đầu"
                  >
                    <RotateCcw size={15} />
                    <span>Xếp lại</span>
                  </button>

                  <button
                    onClick={handleCheckWriting}
                    disabled={reorderedWords.length === 0}
                    className="flex-1 py-3 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check size={16} />
                    <span>Kiểm tra đáp án</span>
                  </button>
                </div>

                {writingChecked && (
                  <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    writingCorrect ? 'bg-[#EBF8F2] text-[#3AA56E]' : 'bg-red-50 text-red-500'
                  }`}>
                    {writingCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span>{writingCorrect ? 'Ghép câu hoàn toàn chính xác!' : 'Chưa đúng thứ tự, hãy thử lại.'}</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 8: 🎯 QUIZ */}
            {currentStep === 7 && lesson.step8_quiz && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 8: Thử thách trắc nghiệm
                  </span>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Kiểm tra độ ghi nhớ kiến thức
                  </h3>
                </div>

                <div className="space-y-5">
                  {lesson.step8_quiz.map((q, qIdx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCorrect = quizFeedbacks[q.id];

                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#E85D3F]">Câu hỏi {qIdx + 1}:</span>
                          {q.audioText && (
                            <button
                              onClick={() => handleSpeak(q.audioText)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] text-[10px] text-[#E85D3F] flex items-center gap-1"
                            >
                              <Volume2 size={12} />
                              <span>Nghe audio</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#243447] dark:text-white">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            const isThisCorrect = optIdx === q.correctIndex;
                            const isAnsweredCorrectly = quizFeedbacks[q.id] === true;

                            return (
                              <button
                                key={optIdx}
                                disabled={isAnsweredCorrectly}
                                onClick={() => handleSelectQuizOption(q.id, optIdx, q.correctIndex)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                  isAnsweredCorrectly
                                    ? isThisCorrect
                                      ? 'border-[#45B97C] bg-[#EBF8F2] dark:bg-[#162B21] text-[#3AA56E] font-bold shadow-xs'
                                      : 'border-[#F1E5D8] dark:border-[#2B3A4F] opacity-40'
                                    : isSelected
                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold'
                                    : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:border-[#E85D3F]'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {isAnsweredCorrectly && isThisCorrect && (
                                    <CheckCircle2 size={15} className="text-[#3AA56E]" />
                                  )}
                                  {!isAnsweredCorrectly && isSelected && (
                                    <XCircle size={15} className="text-red-500" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && q.explanation && (
                          <p className="text-[11px] text-[#748092] italic pt-1 border-t border-[#F1E5D8]/50">
                            Giải thích: {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 9: 🔥 REAL-WORLD CHALLENGE */}
            {currentStep === 8 && lesson.step9_challenge && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-3xl">
                  🔥
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
                    Step 9: Thử thách đời thực
                  </span>
                  <h3 className="text-xl font-black text-[#243447] dark:text-white">
                    {lesson.step9_challenge.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed max-w-md mx-auto">
                    {lesson.step9_challenge.taskDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] flex items-center justify-center gap-2">
                  <Award size={16} />
                  <span>Huy hiệu mở khóa: {lesson.step9_challenge.badge} (+{lesson.xpReward} XP)</span>
                </div>

                <button
                  onClick={handleFinishLesson}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#3AA56E] text-white text-sm font-bold shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles size={18} />
                  <span>Hoàn thành bài học (+{lesson.xpReward} XP)</span>
                </button>
              </div>
            )}

            {/* Bottom Next/Prev Action Bar */}
            <div className="space-y-3 pt-3">
              {stepWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-2.5 animate-in shake duration-200">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span className="flex-1">{stepWarning}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => {
                    playClickSound();
                    setStepWarning(null);
                    setCurrentStep(prev => Math.max(0, prev - 1));
                  }}
                  className="py-2.5 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] disabled:opacity-30 cursor-pointer"
                >
                  Bước trước
                </button>

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="py-2.5 px-5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Tiếp theo: {stepsMeta[currentStep + 1]?.label}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          /* COMPLETION CELEBRATION MODAL */
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] flex items-center justify-center mx-auto text-4xl border-2 border-[#45B97C] shadow-lg">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#45B97C] uppercase tracking-wider">
                XUẤT SẮC HOÀN THÀNH
              </span>
              <h2 className="text-2xl font-black text-[#243447] dark:text-white">
                Bài {lesson.lessonNumber}: {lesson.title}
              </h2>
              <div className="flex items-center justify-center gap-1 text-2xl pt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={i < earnedStars ? 'text-amber-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-[#748092] uppercase font-bold block">Kinh nghiệm</span>
                <span className="text-base font-black text-[#E85D3F] font-mono">+{lesson.xpReward} XP</span>
              </div>
              <div className="h-8 w-px bg-[#F1E5D8] dark:bg-[#2B3A4F]" />
              <div>
                <span className="text-[10px] text-[#748092] uppercase font-bold block">Chuỗi ngày học</span>
                <span className="text-base font-black text-[#45B97C] font-mono">+{user?.streak || 1} Ngày 🔥</span>
              </div>
              <div className="h-8 w-px bg-[#F1E5D8] dark:bg-[#2B3A4F]" />
              <div>
                <span className="text-[10px] text-[#748092] uppercase font-bold block">Độ chính xác</span>
                <span className="text-base font-black text-blue-500 font-mono">100%</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                Về Bản đồ Lộ trình
              </button>

              <button
                onClick={handleRestartLesson}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border-2 border-[#E85D3F] text-[#E85D3F] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw size={15} />
                <span>Học lại bài này</span>
              </button>

              <button
                onClick={handleNextLessonAction}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Học bài tiếp theo</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
