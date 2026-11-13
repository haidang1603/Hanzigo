import React, { useState, useEffect, useRef } from 'react';
import { fireConfetti as confetti } from '../../utils/confetti';
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
  Languages,
  Flame,
  Award,
  Layers,
  AlertCircle,
  Lock,
  Unlock,
  Timer,
  Zap,
  Target,
  ExternalLink,
  FileText,
  PenTool,
  X,
  Bookmark,
  BookmarkCheck,
  Search
} from 'lucide-react';
import { 
  completeLesson, 
  getUserJourneyProgress, 
  getNextLessonId, 
  getLessonMaterials 
} from '../../services/learningPathService';
import { generatePostLessonAiFeedback, recordLearningLoopStep } from '../../services/aiLearningCoachService';
import { evaluatePronunciation } from '../../utils/pronunciationEvaluator';
import { playClickSound, playSuccessSound, playErrorSound, playLevelUpSound } from '../../utils/audio';
import { captureWeakVocabulary } from '../../utils/srsEngine.js';
import { saveCustomVocab } from '../../utils/materialsStorage.js';
import { getHanziDecomposition } from '../../data/hanziDecomposition.js';
import RoleplayStudioModal from './RoleplayStudioModal.jsx';
import { buildScenarioForLesson } from '../../utils/roleplayScenarioBuilder.js';
import StrokeOrderPlayer from '../dictionary/StrokeOrderPlayer';
import InteractiveWritingPad from '../dictionary/InteractiveWritingPad';
import {
  Step1Learn,
  Step2Vocabulary,
  Step3Hanzi,
  Step4Grammar,
  Step5Listening,
  Step6Speaking,
  Step7Writing,
  Step8Quiz,
  Step9Challenge
} from './lesson-steps';

/*
 * 9-Step Modular Pedagogical Architecture:
 * - Step 1: Khám phá kiến thức mới (step1_learn)
 * - Step 2: Từ vựng cốt lõi (step2_vocabulary: Tập viết, Thuận bút, Flashcard)
 * - Step 3: Phân tích cấu tạo & Thuận bút chữ Hán (step3_hanzi: Thuận bút, Tập viết, activeInlineHanzi)
 * - Step 4: Cấu trúc ngữ pháp (step4_grammar)
 * - Step 5: Luyện nghe hiểu & Đàm thoại phản xạ (step5_listening.situation, step5_listening.dialogue, dialogueRoleFilter)
 * - Step 6: Nói phản xạ & Chấm điểm thanh điệu (step6_speaking)
 * - Step 7: Sắp xếp câu hoàn chỉnh (step7_writing)
 * - Step 8: Thử thách trắc nghiệm (step8_quiz)
 * - Step 9: Thử thách đời thực & Khảo hạch (step9_challenge)
 */

// Helper: Extract target phrase or challenge text from lesson definition
const getChallengeTarget = (lesson) => {
  if (lesson?.step9_challenge?.targetPhrase) return lesson.step9_challenge.targetPhrase;
  const desc = lesson?.step9_challenge?.taskDesc || '';
  const colonMatch = desc.match(/:\s*([^.]+?)\s*(?:trong vòng|$)/i);
  if (colonMatch && colonMatch[1]) return colonMatch[1].trim();
  const quoteMatch = desc.match(/["“]([^"”]+)["”]/);
  if (quoteMatch && quoteMatch[1]) return quoteMatch[1].trim();
  if (lesson?.step6_speaking?.targetSentence) return lesson.step6_speaking.targetSentence;
  return lesson?.step2_vocabulary?.[0]?.hanzi || '中文';
};

export default function InteractiveLessonPlayer({ 
  lesson, 
  user, 
  onBack, 
  onClose, 
  onCompleteNext, 
  onNextLesson, 
  onCompleteLesson,
  onSelectWriting = null,
  onSelectPronounce = null
}) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 8 (9 steps)
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [quizScore, setQuizScore] = useState(0);
  const [stepWarning, setStepWarning] = useState(null);
  const [listeningFeedback, setListeningFeedback] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [showRoleplayModal, setShowRoleplayModal] = useState(false);
  const [selectedDictWord, setSelectedDictWord] = useState(null);
  const [dictModalTab, setDictModalTab] = useState('detail'); // 'detail' | 'stroke' | 'write'
  const [dictCharIndex, setDictCharIndex] = useState(0);
  const [activeInlineHanzi, setActiveInlineHanzi] = useState({}); // { [hanzi]: 'stroke' | 'write' }
  const [savedFlashcardIds, setSavedFlashcardIds] = useState(() => new Set());
  const [flashcardToast, setFlashcardToast] = useState(null);
  const lessonMaterials = lesson?.id ? getLessonMaterials(lesson.id) : [];

  const handleSaveFlashcard = (v) => {
    playClickSound();
    try {
      saveCustomVocab({
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        meaning: v.meaning,
        hanviet: v.hanviet || '',
        level: lesson?.levelId?.replace('lvl-', 'HSK ') || 'HSK 1',
        topic: lesson?.title || 'Giáo trình',
        radical: v.radical || 'Chữ Hán',
        example: v.example || { hanzi: v.hanzi, pinyin: v.pinyin, meaning: v.meaning }
      });
      captureWeakVocabulary(v, 'lesson_manual', user);
      setSavedFlashcardIds(prev => new Set([...prev, v.id || v.hanzi]));
      playSuccessSound();
      setFlashcardToast(`✨ Đã thêm "${v.hanzi}" vào Flashcard & Hàng đợi SRS! (+10 XP)`);
      setTimeout(() => setFlashcardToast(null), 3000);
    } catch (e) {
      console.warn('Lỗi lưu từ vựng:', e);
    }
  };

  const handleClose = () => {
    if (onBack) onBack();
    else if (onClose) onClose();
  };

  const handleNextLessonAction = () => {
    const nextId = lesson?.nextLessonId || (lesson?.id ? getNextLessonId(lesson.id) : null);
    if (onNextLesson && nextId) {
      onNextLesson(nextId);
    } else if (onCompleteNext) {
      onCompleteNext();
    } else {
      handleClose();
    }
  };

  // Step 5: Listening speed & toggles
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false); // Mặc định ẩn bản dịch để học viên tự luyện nghe/đọc
  const [revealedTranslations, setRevealedTranslations] = useState({}); // Lưu các dòng được người dùng click mở dịch riêng lẻ
  const [dialogueRoleFilter, setDialogueRoleFilter] = useState('ALL'); // 'ALL' | 'A' | 'B' | 'ROLEPLAY_B'
  const [activePlayingIndex, setActivePlayingIndex] = useState(null);

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

  // Step 9: Challenge execution states
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [isChallengeRecording, setIsChallengeRecording] = useState(false);
  const [challengeTranscript, setChallengeTranscript] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [challengeCountdown, setChallengeCountdown] = useState(10);
  const [isReflexRunning, setIsReflexRunning] = useState(false);
  const [showReflexConfirm, setShowReflexConfirm] = useState(false);
  const challengeMediaRecorderRef = useRef(null);
  const challengeAudioChunksRef = useRef([]);
  const challengeRecognitionRef = useRef(null);
  const challengeStreamRef = useRef(null);
  const challengeTimerRef = useRef(null);
  const challengeStartTimeRef = useRef(null);

  // Gated navigation progression (prevents jumping forward to uncompleted steps)
  const [maxStepReached, setMaxStepReached] = useState(() => isAlreadyCompleted ? 8 : 0);

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
      if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
      if (challengeRecognitionRef.current) {
        try { challengeRecognitionRef.current.stop(); } catch (e) {}
      }
      if (challengeMediaRecorderRef.current && challengeMediaRecorderRef.current.state === 'recording') {
        try { challengeMediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (challengeStreamRef.current) {
        challengeStreamRef.current.getTracks().forEach(t => t.stop());
        challengeStreamRef.current = null;
      }
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
      try {
        const targetQuiz = (lesson.step8_quiz || []).find(q => q.id === quizId);
        const targetWord = targetQuiz?.targetWord || targetQuiz?.audioText || (lesson.step2_vocab && lesson.step2_vocab[0]?.hanzi);
        if (targetWord) {
          captureWeakVocabulary(targetWord, 'quiz_mistake', user);
        }
      } catch {}
    }
  };

  // Validation gating: check if learner meets requirements to advance
  const canProceedToNextStep = () => {
    // Step 5: Listening comprehension question (Index 4)
    if (currentStep === 4 && lesson.step5_listening?.question) {
      if (!listeningFeedback?.isCorrect) {
        return {
          canProceed: false,
          message: '🎧 Vui lòng nghe đoạn hội thoại và chọn đáp án chính xác cho câu hỏi nghe hiểu!'
        };
      }
    }

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

    // Step 9: Challenge (Index 8)
    if (currentStep === 8 && lesson.step9_challenge) {
      if (!challengeCompleted && !isAlreadyCompleted) {
        return {
          canProceed: false,
          message: '🔥 Bạn cần thực hiện và hoàn thành thử thách thực chiến trước khi kết thúc bài học!'
        };
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
    const nextStep = Math.min(8, currentStep + 1);
    setMaxStepReached(prev => Math.max(prev, nextStep));
    setCurrentStep(nextStep);
  };

  // Step 9: Challenge Handlers
  const handleStopChallengeRecording = () => {
    if (challengeTimerRef.current) {
      clearInterval(challengeTimerRef.current);
      challengeTimerRef.current = null;
    }
    if (challengeRecognitionRef.current) {
      try { challengeRecognitionRef.current.stop(); } catch (e) {}
    }
    if (challengeMediaRecorderRef.current && challengeMediaRecorderRef.current.state === 'recording') {
      try { challengeMediaRecorderRef.current.stop(); } catch (e) {}
    }
    if (challengeStreamRef.current) {
      challengeStreamRef.current.getTracks().forEach(t => t.stop());
      challengeStreamRef.current = null;
    }
    setIsChallengeRecording(false);
  };

  const handleStartChallengeRecording = () => {
    playClickSound();
    setStepWarning(null);
    setChallengeFeedback(null);
    setChallengeTranscript('');
    setIsReflexRunning(false);
    setShowReflexConfirm(false);
    setChallengeCountdown(10);
    challengeAudioChunksRef.current = [];
    challengeStartTimeRef.current = Date.now();

    const targetPhrase = getChallengeTarget(lesson);

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
          setChallengeTranscript(spokenText);
        };
        recognition.onerror = (e) => console.warn('Challenge recognition error:', e.error);
        challengeRecognitionRef.current = recognition;
        recognition.start();
      } catch (recErr) {
        console.warn('Challenge recognition start err:', recErr);
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          challengeStreamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          challengeMediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) challengeAudioChunksRef.current.push(e.data);
          };
          mediaRecorder.onstop = () => {
            const durationMs = Date.now() - (challengeStartTimeRef.current || Date.now());
            const finalSpoken = (spokenText || '').trim();

            if (finalSpoken || durationMs >= 1800) {
              const evalResult = evaluatePronunciation(targetPhrase, '', durationMs, 45, finalSpoken);
              const score = Math.max(75, evalResult.score || 85);
              setChallengeFeedback({
                score,
                spoken: finalSpoken || targetPhrase,
                message: `🎉 Xuất sắc! Bạn đã vượt qua thử thách thực chiến với ${score} điểm!`
              });
              setChallengeCompleted(true);
              playSuccessSound();
              setStepWarning(null);
              try {
                confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
              } catch {}
            } else {
              playErrorSound();
              setStepWarning('Không nhận diện được giọng nói trong thời gian thử thách. Hãy bấm Micro và đọc to, rõ ràng theo yêu cầu!');
            }
          };
          mediaRecorder.start();
          setIsChallengeRecording(true);

          // 10-second live countdown
          let seconds = 10;
          if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
          challengeTimerRef.current = setInterval(() => {
            seconds -= 1;
            setChallengeCountdown(seconds);
            if (seconds <= 0) {
              clearInterval(challengeTimerRef.current);
              challengeTimerRef.current = null;
              handleStopChallengeRecording();
            }
          }, 1000);
        })
        .catch(err => {
          console.warn('Challenge mic error:', err);
          setIsChallengeRecording(false);
          playErrorSound();
          setStepWarning('Không thể truy cập Microphone. Bạn hãy sử dụng chế độ "Thử thách Phản xạ 10s" bên cạnh để hoàn thành!');
        });
    } else {
      setIsChallengeRecording(false);
      setStepWarning('Trình duyệt không hỗ trợ thu âm Mic. Vui lòng bấm "Thử thách Phản xạ 10s".');
    }
  };

  const handleStartReflexChallenge = () => {
    playClickSound();
    handleStopChallengeRecording();
    setStepWarning(null);
    setChallengeFeedback(null);
    setIsReflexRunning(true);
    setShowReflexConfirm(false);
    setChallengeCountdown(10);

    let seconds = 10;
    if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
    challengeTimerRef.current = setInterval(() => {
      seconds -= 1;
      setChallengeCountdown(seconds);
      if (seconds <= 0) {
        clearInterval(challengeTimerRef.current);
        challengeTimerRef.current = null;
        setIsReflexRunning(false);
        setShowReflexConfirm(true);
        playSuccessSound();
      }
    }, 1000);
  };

  const handleConfirmReflex = () => {
    playSuccessSound();
    setChallengeCompleted(true);
    setShowReflexConfirm(false);
    setChallengeFeedback({
      score: 90,
      spoken: getChallengeTarget(lesson),
      message: '🎉 Tuyệt vời! Bạn đã hoàn thành bài thử thách phản xạ đúng thời gian quy định!'
    });
    setStepWarning(null);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Replay / Re-learn lesson anytime
  const handleRestartLesson = () => {
    handleStopChallengeRecording();
    playClickSound();
    setCurrentStep(0);
    setIsCompleted(false);
    setEarnedStars(3);
    setQuizScore(0);
    setSpeakingFeedback(null);
    setRecordedAudioUrl(null);
    setSpeechTranscript('');
    setIsRecording(false);
    setChallengeCompleted(false);
    setIsChallengeRecording(false);
    setChallengeTranscript('');
    setChallengeFeedback(null);
    setChallengeCountdown(10);
    setIsReflexRunning(false);
    setShowReflexConfirm(false);
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
    if (lesson.step9_challenge && !challengeCompleted && !isAlreadyCompleted) {
      playErrorSound();
      setStepWarning('🔥 Bạn cần hoàn thành thử thách thực chiến bên trên trước khi nhận thưởng hoàn thành bài học!');
      return;
    }
    handleStopChallengeRecording();
    
    const finalScore = Math.min(100, Math.max(70, 75 + quizScore));
    const result = completeLesson(lesson.id, finalScore, user);

    if (result.success === false || result.passed === false) {
      playErrorSound();
      setStepWarning(result.message || 'Điểm số chưa đạt chuẩn đầu ra (tối thiểu 70%). Hãy ôn tập kiến thức và thử lại!');
      return;
    }

    playLevelUpSound();
    const stars = result.stars || (finalScore >= 90 ? 3 : (finalScore >= 80 ? 2 : 1));
    setEarnedStars(stars);

    // AI Pedagogical Feedback & Learning Loop Tracking
    try {
      const feedback = generatePostLessonAiFeedback({
        lesson,
        score: finalScore,
        earnedStars: stars,
        speakingScore: speakingFeedback?.overall || null,
        user
      });
      setAiFeedback(feedback);
      recordLearningLoopStep('COMPLETE_LESSON', { lessonId: lesson.id, score: finalScore }, user);
    } catch (e) {
      console.warn('AI Feedback error:', e);
    }

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
              type="button"
              onClick={() => { playClickSound(); setShowRoleplayModal(true); }}
              title="Luyện hội thoại nhập vai AI bám sát từ vựng và ngữ pháp bài học"
              className="px-2.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/60 text-[#E85D3F] dark:text-orange-300 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
            >
              <span>🎭</span>
              <span className="hidden md:inline">Nhập vai AI</span>
            </button>

            {lessonMaterials.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMaterialsModal(true)}
                title="Xem tài liệu học tập & giáo trình bổ trợ"
                className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <BookOpen size={14} className="text-[#E85D3F]" />
                <span className="hidden lg:inline">Tài liệu ({lessonMaterials.length})</span>
              </button>
            )}

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
            const isAccessible = isAlreadyCompleted || idx <= maxStepReached;
            return (
              <button
                key={s.num}
                onClick={() => {
                  if (!isAlreadyCompleted && idx > maxStepReached) {
                    playErrorSound();
                    setStepWarning(`🔒 Vui lòng hoàn thành tuần tự từng bước trước khi đến "${s.label}"!`);
                    return;
                  }
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
                    : isAccessible
                    ? 'text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-gray-300 dark:text-gray-600 opacity-60'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                {isPassed && <Check size={11} strokeWidth={3} />}
                {!isAccessible && !isPassed && <Lock size={10} className="opacity-60" />}
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
            {currentStep === 0 && (
              <Step1Learn
                lesson={lesson}
                lessonMaterials={lessonMaterials}
                setShowMaterialsModal={setShowMaterialsModal}
                handleSpeak={handleSpeak}
              />
            )}

            {/* STEP 2: 🧠 VOCABULARY */}
            {currentStep === 1 && (
              <Step2Vocabulary
                lesson={lesson}
                handleSpeak={handleSpeak}
                onSelectWriting={onSelectWriting}
                onSelectPronounce={onSelectPronounce}
                handleSaveFlashcard={handleSaveFlashcard}
                savedFlashcardIds={savedFlashcardIds}
                playClickSound={playClickSound}
                setSelectedDictWord={setSelectedDictWord}
                setDictModalTab={setDictModalTab}
                setDictCharIndex={setDictCharIndex}
              />
            )}

            {/* STEP 3: 🀄 HANZI */}
            {currentStep === 2 && (
              <Step3Hanzi
                lesson={lesson}
                activeInlineHanzi={activeInlineHanzi}
                setActiveInlineHanzi={setActiveInlineHanzi}
                playClickSound={playClickSound}
                onSelectWriting={onSelectWriting}
              />
            )}

            {/* STEP 4: 📚 GRAMMAR */}
            {currentStep === 3 && (
              <Step4Grammar
                lesson={lesson}
                handleSpeak={handleSpeak}
              />
            )}

            {/* STEP 5: 🎧 LISTENING */}
            {currentStep === 4 && (
              <Step5Listening
                lesson={lesson}
                isSlowAudio={isSlowAudio}
                setIsSlowAudio={setIsSlowAudio}
                showPinyin={showPinyin}
                setShowPinyin={setShowPinyin}
                showTranslation={showTranslation}
                setShowTranslation={setShowTranslation}
                dialogueRoleFilter={dialogueRoleFilter}
                setDialogueRoleFilter={setDialogueRoleFilter}
                revealedTranslations={revealedTranslations}
                setRevealedTranslations={setRevealedTranslations}
                handleSpeak={handleSpeak}
                listeningFeedback={listeningFeedback}
                setListeningFeedback={setListeningFeedback}
                playSuccessSound={playSuccessSound}
                playErrorSound={playErrorSound}
              />
            )}

            {/* STEP 6: 🗣️ SPEAKING */}
            {currentStep === 5 && (
              <Step6Speaking
                lesson={lesson}
                handleSpeak={handleSpeak}
                handleToggleRecord={handleToggleRecord}
                isRecording={isRecording}
                speakingFeedback={speakingFeedback}
                speechTranscript={speechTranscript}
                recordedAudioUrl={recordedAudioUrl}
              />
            )}

            {/* STEP 7: ✍️ WRITING */}
            {currentStep === 6 && (
              <Step7Writing
                lesson={lesson}
                reorderedWords={reorderedWords}
                availableWords={availableWords}
                handleWordTileClick={handleWordTileClick}
                handleResetWriting={handleResetWriting}
                handleCheckWriting={handleCheckWriting}
                writingChecked={writingChecked}
                writingCorrect={writingCorrect}
              />
            )}

            {/* STEP 8: 🎯 QUIZ */}
            {currentStep === 7 && (
              <Step8Quiz
                lesson={lesson}
                selectedAnswers={selectedAnswers}
                quizFeedbacks={quizFeedbacks}
                handleSpeak={handleSpeak}
                handleSelectQuizOption={handleSelectQuizOption}
              />
            )}

            {/* STEP 9: 🔥 REAL-WORLD CHALLENGE */}
            {currentStep === 8 && (
              <Step9Challenge
                lesson={lesson}
                handleSpeak={handleSpeak}
                getChallengeTarget={getChallengeTarget}
                challengeCompleted={challengeCompleted}
                setChallengeCompleted={setChallengeCompleted}
                challengeFeedback={challengeFeedback}
                setChallengeFeedback={setChallengeFeedback}
                isChallengeRecording={isChallengeRecording}
                challengeCountdown={challengeCountdown}
                challengeTranscript={challengeTranscript}
                handleStopChallengeRecording={handleStopChallengeRecording}
                isReflexRunning={isReflexRunning}
                showReflexConfirm={showReflexConfirm}
                setShowReflexConfirm={setShowReflexConfirm}
                handleConfirmReflex={handleConfirmReflex}
                handleStartChallengeRecording={handleStartChallengeRecording}
                handleStartReflexChallenge={handleStartReflexChallenge}
                handleFinishLesson={handleFinishLesson}
              />
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

            {/* AI Pedagogical Feedback Card */}
            {aiFeedback && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black text-[#E85D3F]">
                  <Sparkles size={15} />
                  <span>Cố vấn Sư phạm AI HanziGo nhận xét:</span>
                </div>
                {aiFeedback.whatUserDidWell?.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-[#45B97C]">✓ Điểm làm tốt:</span>
                    <ul className="list-disc pl-4 text-[#748092] dark:text-gray-300 space-y-0.5">
                      {aiFeedback.whatUserDidWell.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiFeedback.mistakes?.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-[#E85D3F]">! Cần lưu ý:</span>
                    <ul className="list-disc pl-4 text-[#748092] dark:text-gray-300 space-y-0.5">
                      {aiFeedback.mistakes.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiFeedback.recommendedPractice?.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-blue-500">👉 Khuyến nghị bước tiếp theo:</span>
                    <ul className="list-disc pl-4 text-[#748092] dark:text-gray-300 space-y-0.5">
                      {aiFeedback.recommendedPractice.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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

      {/* VERIFIED MATERIALS MODAL */}
      {showMaterialsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] border border-[#E85D3F]/20">
                  Tài liệu học tập liên kết • Bài {lesson.lessonNumber}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Tài liệu học tập & Giáo trình bổ trợ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMaterialsModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#748092] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {lessonMaterials.map(mat => (
                <div key={mat.id} className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1E293B] text-[#E85D3F]">
                      {mat.category || 'Giáo trình'}
                    </span>
                    <span className="text-[10px] text-[#748092]">{mat.author}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#243447] dark:text-white">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-2">
                    {mat.description}
                  </p>
                  {mat.verificationNotes && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      ✓ {mat.verificationNotes}
                    </p>
                  )}
                  {mat.downloadUrl || mat.sourceUrl ? (
                    <div className="pt-1">
                      <a
                        href={mat.downloadUrl || mat.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-[11px] font-bold shadow-xs hover:opacity-95 transition-all"
                      >
                        <span>Mở tài liệu (Tab mới)</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-[11px] text-blue-700 dark:text-blue-300">
              💡 <em>Lưu ý an toàn:</em> Mở tài liệu ngoài sẽ mở trong tab mới độc lập và không ảnh hưởng đến tiến độ bài học của bạn.
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowMaterialsModal(false)}
                className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roleplay Studio Modal */}
      {showRoleplayModal && (
        <RoleplayStudioModal
          isOpen={showRoleplayModal}
          onClose={() => setShowRoleplayModal(false)}
          scenario={buildScenarioForLesson(lesson)}
          user={user}
        />
      )}

      {/* INLINE DICTIONARY WORD INSPECTOR MODAL */}
      {selectedDictWord && (() => {
        const hanziChars = Array.from(selectedDictWord.hanzi).filter(ch => /[\u4e00-\u9fa5]/.test(ch));
        const activeChar = hanziChars[dictCharIndex] || hanziChars[0] || selectedDictWord.hanzi;
        const decomp = getHanziDecomposition(activeChar);
        const strokes = decomp?.totalStrokes || activeChar.length * 6;
        const radical = selectedDictWord.radical || decomp?.radical || 'Chữ Hán';
        const mnemonic = selectedDictWord.mnemonic || decomp?.mnemonic || `Từ vựng cốt lõi trong bài học ${lesson?.title}.`;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20">
                    Tra cứu Từ Điển & Thuận Bút
                  </span>
                  <span className="text-[11px] font-medium text-[#748092]">
                    {lesson?.levelId?.replace('lvl-', 'HSK ') || 'HSK'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDictWord(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-[#748092] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Character Card */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-center shadow-xs">
                    <span className="font-serif text-3xl font-black text-[#E85D3F]">
                      {activeChar}
                    </span>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#243447] dark:text-white font-mono flex items-center gap-2">
                      <span>{selectedDictWord.pinyin}</span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(selectedDictWord.audioText || selectedDictWord.hanzi)}
                        className="p-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#E85D3F] transition-colors cursor-pointer"
                        title="Nghe phát âm chuẩn"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      Hán-Việt: {selectedDictWord.hanviet || 'Đang cập nhật'}
                    </div>
                  </div>
                </div>

                {selectedDictWord.pos && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    {selectedDictWord.pos}
                  </span>
                )}
              </div>

              {/* Character selector if word contains multiple characters */}
              {hanziChars.length > 1 && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] font-bold text-[#748092]">Chọn chữ để xem nét:</span>
                  <div className="flex items-center gap-1.5">
                    {hanziChars.map((ch, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setDictCharIndex(cIdx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeChar === ch
                            ? 'bg-[#E85D3F] text-white shadow-xs'
                            : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDictModalTab('detail')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dictModalTab === 'detail'
                      ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                      : 'text-[#748092] hover:text-[#243447]'
                  }`}
                >
                  📖 Chi tiết
                </button>
                <button
                  type="button"
                  onClick={() => setDictModalTab('stroke')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dictModalTab === 'stroke'
                      ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                      : 'text-[#748092] hover:text-[#243447]'
                  }`}
                >
                  🖌️ Thuận bút ({activeChar})
                </button>
                <button
                  type="button"
                  onClick={() => setDictModalTab('write')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    dictModalTab === 'write'
                      ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs'
                      : 'text-[#748092] hover:text-[#243447]'
                  }`}
                >
                  ✍️ Luyện viết ({activeChar})
                </button>
              </div>

              {/* TAB 1: Chi tiết */}
              {dictModalTab === 'detail' && (
                <div className="space-y-3 text-xs animate-in fade-in">
                  <div>
                    <span className="font-bold text-[#748092] uppercase text-[10px] tracking-wider block mb-1">
                      Nghĩa Tiếng Việt:
                    </span>
                    <p className="text-sm font-semibold text-[#243447] dark:text-white">
                      {selectedDictWord.meaning}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-[#748092] block">Bộ thủ</span>
                      <span className="font-bold text-[#243447] dark:text-white">{radical}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] text-[#748092] block">Kết cấu & Nét</span>
                      <span className="font-bold text-[#243447] dark:text-white">
                        {decomp?.structureName || 'Đơn thể'} ({strokes} nét)
                      </span>
                    </div>
                  </div>

                  {mnemonic && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200">
                      <span className="font-bold block text-[11px] mb-0.5">💡 Mẹo nhớ chữ Hán (Chiết tự):</span>
                      <p className="text-[11px] leading-relaxed">{mnemonic}</p>
                    </div>
                  )}

                  {selectedDictWord.example && (
                    <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#243447] dark:text-white">
                        <span>{selectedDictWord.example.hanzi}</span>
                        <button
                          type="button"
                          onClick={() => handleSpeak(selectedDictWord.example.hanzi)}
                          className="text-[#E85D3F] hover:text-[#CB4529] p-0.5 cursor-pointer"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                      <div className="text-[#E85D3F] font-mono text-[11px]">{selectedDictWord.example.pinyin}</div>
                      <div className="text-[#748092] text-[11px]">{selectedDictWord.example.meaning}</div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Thuận bút (Stroke order animation) */}
              {dictModalTab === 'stroke' && (
                <div className="p-2 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#E85D3F]/20 animate-in fade-in flex flex-col items-center">
                  <StrokeOrderPlayer
                    character={activeChar}
                    strokesCount={strokes}
                  />
                </div>
              )}

              {/* TAB 3: Luyện viết (Writing Canvas) */}
              {dictModalTab === 'write' && (
                <div className="p-2 rounded-2xl bg-[#F0FDF4] dark:bg-[#14261C] border border-emerald-500/20 animate-in fade-in flex flex-col items-center">
                  <InteractiveWritingPad
                    character={activeChar}
                    strokesCount={strokes}
                  />
                </div>
              )}

              {/* Action buttons footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => handleSaveFlashcard(selectedDictWord)}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Bookmark size={13} />
                  <span>{savedFlashcardIds.has(selectedDictWord.id || selectedDictWord.hanzi) ? 'Đã trong SRS' : 'Lưu Flashcard'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {onSelectPronounce && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedDictWord;
                        setSelectedDictWord(null);
                        onSelectPronounce(target);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Mic size={12} />
                      <span>Nói</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedDictWord(null)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FLOATING FLASHCARD TOAST NOTIFICATION */}
      {flashcardToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-amber-500/30">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{flashcardToast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
