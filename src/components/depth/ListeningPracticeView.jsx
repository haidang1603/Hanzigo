import React, { useState } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Gauge, 
  Headphones,
  Award
} from 'lucide-react';
import { 
  getListeningExercises, 
  evaluateListeningExercise, 
  PLAYBACK_RATES 
} from '../../services/listeningPracticeService';
import { speakChinese, playSuccessSound, playClickSound, playErrorSound } from '../../utils/audio';

export default function ListeningPracticeView() {
  const exercises = getListeningExercises('all');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const currentExercise = exercises[selectedExerciseIndex] || exercises[0];

  // Playback controls
  const [playbackSpeed, setPlaybackSpeed] = useState(PLAYBACK_RATES.NORMAL);
  const [showTranscript, setShowTranscript] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  // User input & answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handlePlayAudio = (rate = playbackSpeed) => {
    playClickSound();
    setReplayCount(prev => prev + 1);
    speakChinese(currentExercise.audioText, rate);
  };

  const handleSelectOption = (optText) => {
    setUserAnswer(optText);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    const result = evaluateListeningExercise({
      exercise: currentExercise,
      userAnswer
    });

    setEvaluation(result);
    if (result.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNextExercise = () => {
    playClickSound();
    const nextIdx = (selectedExerciseIndex + 1) % exercises.length;
    setSelectedExerciseIndex(nextIdx);
    setUserAnswer('');
    setEvaluation(null);
    setShowTranscript(false);
    setReplayCount(0);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] p-6 shadow-sm space-y-6">
      
      {/* Header and Exercise Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Headphones size={13} />
            <span>Listening Practice Engine ({selectedExerciseIndex + 1}/{exercises.length})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
            {currentExercise.title}
          </h2>
        </div>

        {/* Level & Type badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] font-bold text-xs">
            {currentExercise.level}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#748092] font-semibold text-xs">
            {currentExercise.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Audio Playback Deck */}
      <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Play Audio */}
          <button
            onClick={() => handlePlayAudio(playbackSpeed)}
            className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#E85D3F]/30 transition-all cursor-pointer"
          >
            <Volume2 size={16} />
            <span>Phát âm thanh</span>
          </button>

          {/* Slow Playback Toggle */}
          <button
            onClick={() => {
              const newRate = playbackSpeed === PLAYBACK_RATES.NORMAL ? PLAYBACK_RATES.SLOW : PLAYBACK_RATES.NORMAL;
              setPlaybackSpeed(newRate);
              handlePlayAudio(newRate);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              playbackSpeed === PLAYBACK_RATES.SLOW
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200'
                : 'bg-white dark:bg-[#1E293B] text-[#748092] border-gray-200 dark:border-gray-700'
            }`}
          >
            <Gauge size={14} />
            <span>{playbackSpeed === PLAYBACK_RATES.SLOW ? 'Tốc độ chậm: 0.75x' : 'Tốc độ: 1.0x'}</span>
          </button>

          {/* Replay Counter */}
          <span className="text-[11px] text-[#748092]">
            Đã nghe: <strong>{replayCount}</strong> lần
          </span>
        </div>

        {/* Transcript Toggle */}
        <button
          onClick={() => setShowTranscript(prev => !prev)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}</span>
        </button>
      </div>

      {/* Transcript Box (Conditionally Shown) */}
      {showTranscript && (
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-left space-y-1 animate-in fade-in">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
            Bản ghi Transcript:
          </span>
          <p className="font-['Noto_Serif_SC'] text-lg font-bold text-[#243447] dark:text-white">
            {currentExercise.transcript}
          </p>
          <p className="text-xs text-[#748092]">
            {currentExercise.pinyin}
          </p>
        </div>
      )}

      {/* Question Prompt */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-[#E85D3F]" />
          <span>{currentExercise.question}</span>
        </h3>

        {/* Options / Input based on Type */}
        {currentExercise.options ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentExercise.options.map((opt, i) => {
              const isSelected = userAnswer === opt.text;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.text)}
                  className={`p-3.5 rounded-xl border text-left text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E85D3F]/10 border-[#E85D3F] text-[#E85D3F] ring-2 ring-[#E85D3F]/30'
                      : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-700 text-[#243447] dark:text-white hover:border-[#E85D3F]/50'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Nhập câu trả lời hoặc câu chính tả nghe được..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#131B24] text-sm text-[#243447] dark:text-white focus:outline-hidden focus:border-[#E85D3F]"
            />
          </div>
        )}
      </div>

      {/* Submission & Evaluation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
        <button
          onClick={handleSubmitAnswer}
          disabled={!userAnswer.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <CheckCircle2 size={15} />
          <span>Kiểm tra kết quả</span>
        </button>

        <button
          onClick={handleNextExercise}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Bài tập tiếp theo</span>
        </button>
      </div>

      {/* Evaluation Diagnostic Feedback */}
      {evaluation && (
        <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
          evaluation.isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-black text-sm">
            {evaluation.isCorrect ? <Award size={16} /> : <AlertCircle size={16} />}
            <span>{evaluation.isCorrect ? 'Chính xác! Luyện tai nghe rất nhạy.' : 'Chưa đúng. Hãy nghe lại nhé!'}</span>
          </div>
          <p className="leading-relaxed">{evaluation.feedback}</p>
        </div>
      )}

    </div>
  );
}
