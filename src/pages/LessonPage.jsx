import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import AudioButton from '../components/AudioButton';
import { 
  playSuccessSound, 
  playErrorSound, 
  playClickSound, 
  playLevelUpSound 
} from '../utils/audio';
import { LESSONS_DATA } from '../data/chineseData';

export default function LessonPage({ setActiveTab, onAddXp, initialLessonIndex = 0 }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);
  const [currentStep, setCurrentStep] = useState(0); // 0: Vocab, 1: Grammar, 2: Quiz 1, 3: Listening Quiz 2, 4: Reorder Quiz 3, 5: Completed
  
  const lesson = LESSONS_DATA[currentLessonIndex] || LESSONS_DATA[0];

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Sentence reorder state
  const [unscrambledSentence, setUnscrambledSentence] = useState([]);
  const [availableWords, setAvailableWords] = useState(
    lesson.quizzes[2]?.words || []
  );

  useEffect(() => {
    if (initialLessonIndex !== undefined && initialLessonIndex !== null) {
      setCurrentLessonIndex(initialLessonIndex);
      setCurrentStep(0);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      const targetLesson = LESSONS_DATA[initialLessonIndex] || LESSONS_DATA[0];
      setAvailableWords(targetLesson.quizzes[2]?.words || []);
      setUnscrambledSentence([]);
    }
  }, [initialLessonIndex]);

  const steps = [
    { title: 'Từ mới' },
    { title: 'Ngữ pháp' },
    { title: 'Trắc nghiệm' },
    { title: 'Luyện nghe' },
    { title: 'Ghép câu' },
    { title: 'Hoàn thành' }
  ];

  const handleNextStep = () => {
    playClickSound();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else if (currentStep === 4) {
      // Complete lesson!
      setCurrentStep(5);
      playLevelUpSound();
      if (onAddXp) onAddXp(lesson.xpReward);
      
      // Persist completed lesson in localStorage
      try {
        const saved = localStorage.getItem('hanzigo_completed_lessons');
        const completed = saved ? JSON.parse(saved) : [];
        if (!completed.includes(lesson.id)) {
          const updated = [...completed, lesson.id];
          localStorage.setItem('hanzigo_completed_lessons', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Failed to save completed lesson:', err);
      }

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevStep = () => {
    playClickSound();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    }
  };

  const handleCheckMultipleChoice = (index, correctIndex) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);
    if (index === correctIndex) {
      setIsCorrect(true);
      setScore(score + 10);
      playSuccessSound();
    } else {
      setIsCorrect(false);
      playErrorSound();
    }
  };

  // Sentence tile clicking
  const handleWordTileClick = (word, fromAvailable = true) => {
    playClickSound();
    if (fromAvailable) {
      setAvailableWords(availableWords.filter(w => w !== word));
      setUnscrambledSentence([...unscrambledSentence, word]);
    } else {
      setUnscrambledSentence(unscrambledSentence.filter(w => w !== word));
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleCheckReorder = (correctOrder) => {
    setIsAnswerChecked(true);
    const isMatched = unscrambledSentence.join('') === correctOrder.join('');
    if (isMatched) {
      setIsCorrect(true);
      setScore(score + 10);
      playSuccessSound();
    } else {
      setIsCorrect(false);
      playErrorSound();
    }
  };

  const handleRestartLesson = () => {
    playClickSound();
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setUnscrambledSentence([]);
    setAvailableWords(lesson.quizzes[2]?.words || []);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Lesson Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#E85D3F] px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B]">
            {lesson.level}
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
            {lesson.title}
          </h2>
        </div>

        {/* Change Lesson Dropdown */}
        <select
          value={currentLessonIndex}
          onChange={(e) => {
            setCurrentLessonIndex(Number(e.target.value));
            handleRestartLesson();
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white focus:outline-none"
        >
          {LESSONS_DATA.map((l, idx) => (
            <option key={l.id} value={idx}>
              Bài {l.number}: {l.title}
            </option>
          ))}
        </select>
      </div>

      {/* Step Progress Indicator Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
          <span>Bước {currentStep + 1} / {steps.length}: {steps[currentStep].title}</span>
          <span className="text-[#E85D3F]">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#FFF9F2] dark:bg-[#131B24] rounded-full overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div 
            className="h-full bg-gradient-to-r from-[#E85D3F] to-[#F4B942] rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl min-h-[460px] flex flex-col justify-between">
        
        {/* STEP 0: TỪ MỚI (NEW VOCABULARY) */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
                Phần 1: Khám phá từ mới
              </span>
              <h3 className="text-xl font-bold text-[#243447] dark:text-white">
                Nghe phát âm chuẩn và làm quen mặt chữ
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Bấm vào biểu tượng loa để nghe giọng đọc bản xứ. Chú ý thanh điệu và cách đọc Hán-Việt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.vocabList.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-start justify-between gap-3 group hover:border-[#E85D3F] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-['Noto_Serif_SC'] text-2xl font-bold text-[#243447] dark:text-white">
                        {item.hanzi}
                      </span>
                      <span className="text-sm font-bold text-[#E85D3F]">
                        {item.pinyin}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#45B97C]">
                      {item.meaning}
                    </p>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      Âm Hán-Việt: {item.hanviet}
                    </p>
                    {item.example && (
                      <div className="pt-2 text-[11px] text-[#243447] dark:text-[#CBD5E1] border-t border-[#F1E5D8] dark:border-[#2B3A4F]/50">
                        <span className="font-semibold">Ví dụ: </span>{item.example}
                      </div>
                    )}
                  </div>
                  <AudioButton text={item.hanzi} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: NGỮ PHÁP (GRAMMAR BREAKDOWN) */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">
                Phần 2: Cấu trúc ngữ pháp trọng tâm
              </span>
              <h3 className="text-xl font-bold text-[#243447] dark:text-white">
                {lesson.grammar.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#FEF7E9] dark:bg-[#2D2619] border border-[#F4B942]/30 text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
              {lesson.grammar.explanation}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] uppercase">
                Mẫu câu minh họa thực tế
              </h4>
              <div className="space-y-2.5">
                {lesson.grammar.examples.map((ex, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-['Noto_Serif_SC'] text-lg font-bold text-[#243447] dark:text-white">
                          {ex.hanzi}
                        </span>
                        <span className="text-xs font-semibold text-[#E85D3F]">
                          {ex.read}
                        </span>
                      </div>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                        {ex.meaning}
                      </p>
                    </div>
                    <AudioButton text={ex.hanzi} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: QUIZ 1 - MULTIPLE CHOICE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
                Bài tập 1: Trắc nghiệm phản xạ
              </span>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white">
                {lesson.quizzes[0].question}
              </h3>
            </div>

            <div className="space-y-3">
              {lesson.quizzes[0].options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectOption = idx === lesson.quizzes[0].correctIndex;
                let btnStyle = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]';

                if (isAnswerChecked) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleCheckMultipleChoice(idx, lesson.quizzes[0].correctIndex)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerChecked && isCorrectOption && <CheckCircle2 size={18} className="text-emerald-500" />}
                    {isAnswerChecked && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {isAnswerChecked && (
              <div className={`p-4 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'}`}>
                <p className="font-bold">{isCorrect ? '🎉 Chính xác!' : '💡 Gợi ý giải thích:'}</p>
                <p className="mt-1">{lesson.quizzes[0].explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: QUIZ 2 - LISTENING COMPREHENSION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
                Bài tập 2: Luyện nghe chọn đáp án
              </span>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white">
                {lesson.quizzes[1].question}
              </h3>
            </div>

            {/* Audio Listening Box */}
            <div className="p-6 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Bấm vào nút bên dưới để nghe câu nói tiếng Trung:
              </p>
              <AudioButton 
                text={lesson.quizzes[1].audioText} 
                size="lg" 
                label="Phát đoạn âm thanh" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.quizzes[1].options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectOption = idx === lesson.quizzes[1].correctIndex;
                let btnStyle = 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]';

                if (isAnswerChecked) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleCheckMultipleChoice(idx, lesson.quizzes[1].correctIndex)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerChecked && isCorrectOption && <CheckCircle2 size={18} className="text-emerald-500" />}
                    {isAnswerChecked && isSelected && !isCorrectOption && <XCircle size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>

            {isAnswerChecked && (
              <div className={`p-4 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'}`}>
                <p className="font-bold">{isCorrect ? '🎉 Bạn nghe rất chuẩn!' : '💡 Đáp án:'}</p>
                <p className="mt-1">{lesson.quizzes[1].explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: QUIZ 3 - SENTENCE UNSCRAMBLE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
                Bài tập 3: Sắp xếp trật tự câu từ
              </span>
              <h3 className="text-lg font-bold text-[#243447] dark:text-white">
                {lesson.quizzes[2].question}
              </h3>
            </div>

            {/* Answer Sentence Drop Target Box */}
            <div className="p-6 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border-2 border-dashed border-[#E85D3F]/40 min-h-[100px] flex flex-wrap items-center gap-2">
              {unscrambledSentence.length === 0 ? (
                <span className="text-xs text-[#748092] italic">
                  Bấm vào các thẻ chữ bên dưới để xếp thành câu hoàn chỉnh...
                </span>
              ) : (
                unscrambledSentence.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWordTileClick(word, false)}
                    className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white font-bold text-sm shadow-sm hover:bg-[#CB4529] active:scale-95 transition-all"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Available Word Tiles */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordTileClick(word, true)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-sm shadow-sm hover:border-[#E85D3F] hover:scale-105 active:scale-95 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Check Button */}
            {!isAnswerChecked ? (
              <button
                disabled={unscrambledSentence.length === 0}
                onClick={() => handleCheckReorder(lesson.quizzes[2].correctOrder)}
                className="px-6 py-2.5 rounded-xl bg-[#E85D3F] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
              >
                Kiểm tra kết quả
              </button>
            ) : (
              <div className={`p-4 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'}`}>
                <p className="font-bold">{isCorrect ? '🎉 Bạn ghép câu hoàn toàn chính xác!' : '💡 Đáp án đúng:'}</p>
                <p className="mt-1 font-semibold">{lesson.quizzes[2].correctOrder.join(' ')}</p>
                <p className="mt-0.5">{lesson.quizzes[2].explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: LESSON COMPLETION CELEBRATION */}
        {currentStep === 5 && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white flex items-center justify-center text-4xl mx-auto shadow-xl shadow-[#E85D3F]/30 animate-bounce">
              🏆
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
                Chúc mừng bạn đã hoàn thành bài học!
              </h3>
              <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] max-w-md mx-auto">
                Bạn đã nắm vững toàn bộ kiến thức và bài tập phản xạ của <br />
                <span className="font-bold text-[#E85D3F]">{lesson.title}</span>.
              </p>
            </div>

            {/* Rewards Card */}
            <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#748092]">Điểm kinh nghiệm</p>
                <p className="text-xl font-black text-[#E85D3F]">+{lesson.xpReward} XP</p>
              </div>
              <div>
                <p className="text-[10px] text-[#748092]">Độ chính xác</p>
                <p className="text-xl font-black text-[#45B97C]">100%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestartLesson}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white font-bold text-xs hover:bg-[#FFF9F2] transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Học lại bài này</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  if (currentLessonIndex < LESSONS_DATA.length - 1) {
                    setCurrentLessonIndex(currentLessonIndex + 1);
                    handleRestartLesson();
                  } else {
                    setActiveTab('dashboard');
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{currentLessonIndex < LESSONS_DATA.length - 1 ? 'Bài học kế tiếp' : 'Về Dashboard'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Step Controller Buttons */}
        {currentStep < 5 && (
          <div className="pt-8 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
            <button
              disabled={currentStep === 0}
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Quay lại</span>
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{currentStep === 4 ? 'Hoàn thành bài' : 'Tiếp theo'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
