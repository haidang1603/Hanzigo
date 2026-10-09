import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';
import { 
  getGrammarLessons, 
  evaluateGrammarExercise 
} from '../../services/grammarEngineService';
import { speakChinese, playSuccessSound, playClickSound, playErrorSound } from '../../utils/audio';

export default function GrammarEngineView() {
  const lessons = getGrammarLessons('all');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const currentLesson = lessons[selectedLessonIndex] || lessons[0];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = currentLesson.exercises[currentExerciseIndex] || currentLesson.exercises[0];

  // Word Ordering token state
  const [selectedTokens, setSelectedTokens] = useState([]);
  // Fill blank / Translation state
  const [textInput, setTextInput] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleLessonChange = (idx) => {
    playClickSound();
    setSelectedLessonIndex(idx);
    setCurrentExerciseIndex(0);
    setSelectedTokens([]);
    setTextInput('');
    setEvaluation(null);
  };

  const handleExerciseChange = (idx) => {
    playClickSound();
    setCurrentExerciseIndex(idx);
    setSelectedTokens([]);
    setTextInput('');
    setEvaluation(null);
  };

  const handleAddToken = (token) => {
    playClickSound();
    setSelectedTokens(prev => [...prev, token]);
  };

  const handleRemoveToken = (idxToRemove) => {
    playClickSound();
    setSelectedTokens(prev => prev.filter((_, i) => i !== idxToRemove));
  };

  const handleCheckExercise = () => {
    let submission = null;
    if (currentExercise.type === 'word_ordering' || currentExercise.type === 'sentence_builder') {
      submission = { tokens: selectedTokens };
    } else if (currentExercise.type === 'fill_blank') {
      submission = { answer: textInput };
    } else {
      submission = { text: textInput };
    }

    const result = evaluateGrammarExercise({
      exercise: currentExercise,
      submission
    });

    setEvaluation(result);
    if (result.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleResetCurrent = () => {
    playClickSound();
    setSelectedTokens([]);
    setTextInput('');
    setEvaluation(null);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] p-6 shadow-sm space-y-6">
      
      {/* Top Header & Lesson Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers size={13} />
            <span>Grammar Depth Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
            {currentLesson.title}
          </h2>
        </div>

        {/* Lesson selection buttons */}
        <div className="flex flex-wrap gap-2">
          {lessons.map((les, idx) => (
            <button
              key={les.id}
              onClick={() => handleLessonChange(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLessonIndex === idx
                  ? 'bg-[#E85D3F] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {les.code}: {les.level}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PATTERN BANNER */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F4B942]/40 space-y-1">
        <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider block">
          Công thức Ngữ pháp (Pattern):
        </span>
        <p className="text-base sm:text-lg font-black text-[#243447] dark:text-white font-mono">
          {currentLesson.pattern}
        </p>
        <p className="text-xs text-[#748092] leading-relaxed pt-1">
          {currentLesson.explanation}
        </p>
      </div>

      {/* 2. EXAMPLES CAROUSEL / LIST */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
          <BookOpen size={14} className="text-[#E85D3F]" />
          <span>Ví dụ minh họa (Examples):</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentLesson.examples.map((ex, i) => (
            <div 
              key={i} 
              className="p-3 rounded-2xl bg-gray-50 dark:bg-[#131B24] border border-gray-100 dark:border-gray-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">
                  {ex.hanzi}
                </span>
                <button
                  onClick={() => speakChinese(ex.hanzi)}
                  className="p-1 rounded-lg text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors"
                >
                  <Volume2 size={14} />
                </button>
              </div>
              <p className="text-[11px] text-[#E85D3F] font-semibold">{ex.pinyin}</p>
              <p className="text-[11px] text-[#748092]">{ex.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PRACTICE EXERCISE SECTION */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131B24] border border-gray-200 dark:border-gray-700 space-y-4">
        {/* Exercise tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#E85D3F]" />
            <span>Thực hành (Practice: {currentExercise.title})</span>
          </span>
          <div className="flex gap-1.5">
            {currentLesson.exercises.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => handleExerciseChange(i)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentExerciseIndex === i
                    ? 'bg-[#E85D3F] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-[#748092]'
                }`}
              >
                Dạng {i + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#243447] dark:text-white">
          {currentExercise.prompt || currentExercise.promptVietnamese}
        </p>

        {/* Mode A: Word Ordering / Sentence Builder */}
        {(currentExercise.type === 'word_ordering' || currentExercise.type === 'sentence_builder') && (
          <div className="space-y-3">
            {/* Answer Assembled Tray */}
            <div className="min-h-14 p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] border-2 border-dashed border-[#E85D3F]/40 flex flex-wrap items-center gap-2">
              {selectedTokens.length === 0 ? (
                <span className="text-xs text-[#748092] italic">
                  Chạm vào các thẻ từ bên dưới để ghép câu theo đúng trật tự...
                </span>
              ) : (
                selectedTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveToken(idx)}
                    className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-white font-['Noto_Serif_SC'] text-base font-bold shadow-xs hover:bg-[#CB4529] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{tok}</span>
                    <span className="text-[10px] opacity-75">×</span>
                  </button>
                ))
              )}
            </div>

            {/* Word Chips pool */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(currentExercise.scrambledTokens || currentExercise.availableTokens || []).map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddToken(tok)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all cursor-pointer shadow-xs"
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode B: Fill Blank */}
        {currentExercise.type === 'fill_blank' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E293B] text-center font-['Noto_Serif_SC'] text-xl font-bold text-[#243447] dark:text-white">
              {currentExercise.sentence.replace('___', ` [ ${textInput || '___'} ] `)}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {currentExercise.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setTextInput(opt)}
                  className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    textInput === opt
                      ? 'bg-[#E85D3F] text-white border-[#E85D3F]'
                      : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#E85D3F]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode C: Translation Practice */}
        {currentExercise.type === 'translation_practice' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
              <strong>Gợi ý từ vựng:</strong> {currentExercise.keywordHints?.join(' • ')}
            </div>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Nhập câu tiếng Trung tương ứng (ví dụ: 他比我高。)..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-sm text-[#243447] dark:text-white focus:outline-hidden focus:border-[#E85D3F]"
            />
          </div>
        )}

        {/* Submission actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <button
              onClick={handleCheckExercise}
              className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>Kiểm tra ngữ pháp</span>
            </button>
            <button
              onClick={handleResetCurrent}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-xs font-bold text-[#748092] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Đặt lại</span>
            </button>
          </div>

          {currentExerciseIndex < currentLesson.exercises.length - 1 && (
            <button
              onClick={() => handleExerciseChange(currentExerciseIndex + 1)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Bài tập tiếp theo</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* 4. CORRECTION & FEEDBACK CARD */}
        {evaluation && (
          <div className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in duration-200 ${
            evaluation.isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {evaluation.isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{evaluation.isCorrect ? 'Cấu trúc hoàn toàn chuẩn xác!' : 'Cần sửa đổi trật tự ngữ pháp:'}</span>
            </div>
            <p className="leading-relaxed">{evaluation.feedback}</p>
          </div>
        )}

      </div>

    </div>
  );
}
