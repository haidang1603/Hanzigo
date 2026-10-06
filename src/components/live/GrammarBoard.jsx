import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';
import { speakChinese, playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { submitGrammarAnswer } from '../../services/liveClassroomService';

export default function GrammarBoard({
  isTeacher = false,
  user,
  sessionId,
  grammarState = {},
  onUpdateState: _onUpdateState
}) {
  const grammar = grammarState || {
    pattern: 'S + V + O (Chủ ngữ + Động từ + Tân ngữ)',
    explanation: 'Trật tự câu cơ bản trong tiếng Trung tương tự tiếng Việt: Chủ ngữ đứng đầu, tiếp đến vị ngữ động từ, sau đó là tân ngữ.',
    components: [
      { id: 'g1', text: '我', role: 'Chủ ngữ (Subject)', tag: 'S', color: 'blue' },
      { id: 'g2', text: '喜欢', role: 'Động từ (Verb)', tag: 'V', color: 'emerald' },
      { id: 'g3', text: '学习中文', role: 'Tân ngữ (Object)', tag: 'O', color: 'amber' }
    ],
    miniExercise: {
      prompt: 'Sắp xếp các từ sau thành câu tiếng Trung đúng cấu trúc:',
      scrambled: ['喜欢', '中文', '我', '学习'],
      correct: ['我', '喜欢', '学习', '中文']
    }
  };

  const miniExercise = grammar.miniExercise || {
    prompt: 'Sắp xếp các từ sau thành câu tiếng Trung đúng cấu trúc:',
    scrambled: ['喜欢', '中文', '我', '学习'],
    correct: ['我', '喜欢', '学习', '中文']
  };

  // Student Interactive Scramble arrange state
  const [arrangedTokens, setArrangedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState(miniExercise.scrambled || ['喜欢', '中文', '我', '学习']);
  const [exerciseResult, setExerciseResult] = useState(null); // null | 'correct' | 'wrong'

  const handlePickToken = (token, idx) => {
    playClickSound();
    setArrangedTokens(prev => [...prev, token]);
    setAvailableTokens(prev => prev.filter((_, i) => i !== idx));
    setExerciseResult(null);
  };

  const handleRemoveToken = (token, idx) => {
    playClickSound();
    setArrangedTokens(prev => prev.filter((_, i) => i !== idx));
    setAvailableTokens(prev => [...prev, token]);
    setExerciseResult(null);
  };

  const handleResetExercise = () => {
    playClickSound();
    setArrangedTokens([]);
    setAvailableTokens(miniExercise.scrambled || ['喜欢', '中文', '我', '学习']);
    setExerciseResult(null);
  };

  const handleCheckAnswer = async () => {
    playClickSound();
    const isCorrect = arrangedTokens.join('') === (miniExercise.correct || []).join('');
    setExerciseResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
    await submitGrammarAnswer(sessionId, user, arrangedTokens);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Grammar Syntax Board</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold">
                Ngữ pháp & Trật tự câu
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 pt-0.5">
            Phân tích thành phần cú pháp câu và thực hành mini exercise sắp xếp trật tự từ.
          </p>
        </div>
      </div>

      {/* 1. Grammar Pattern Spotlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
            MẪU CÂU TRỌNG TÂM
          </span>
          <button
            onClick={() => speakChinese(grammar.components?.map(c => c.text).join('') || '我喜欢学习中文')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 size={14} className="text-emerald-400" />
            <span>Phát âm câu mẫu</span>
          </button>
        </div>

        {/* Big Formula Badge */}
        <div className="text-center py-1">
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-lg sm:text-xl font-black text-amber-300 font-mono">
            {grammar.pattern}
          </div>
          <p className="text-xs text-white/70 max-w-2xl mx-auto mt-2 leading-relaxed">
            {grammar.explanation}
          </p>
        </div>

        {/* Interactive Syntax Breakdown Blocks */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap py-2">
          {grammar.components?.map((comp, idx) => (
            <React.Fragment key={comp.id || idx}>
              <div className="p-4 sm:p-5 rounded-3xl bg-[#111827] border-2 border-white/15 shadow-xl flex flex-col items-center justify-center text-center space-y-1.5 min-w-[120px]">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  comp.color === 'blue'
                    ? 'bg-blue-500/20 text-blue-400'
                    : comp.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {comp.tag} • {comp.role}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-serif">
                  {comp.text}
                </span>
              </div>
              {idx < (grammar.components.length - 1) && (
                <span className="text-2xl font-black text-white/30">+</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. Student Mini Exercise: Sentence Order Arranger */}
      <div className="rounded-3xl bg-[#111827] border border-white/10 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#F4B942]" />
            <h3 className="text-sm font-bold text-white">Mini Exercise: Sắp xếp trật tự từ</h3>
          </div>
          <button
            onClick={handleResetExercise}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Làm lại từ đầu</span>
          </button>
        </div>

        <p className="text-xs text-white/70">
          👉 {miniExercise.prompt}
        </p>

        {/* Arranged Answer Drop Area */}
        <div className="p-5 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 min-h-[72px] flex items-center justify-center gap-2.5 flex-wrap">
          {arrangedTokens.length === 0 ? (
            <span className="text-xs text-white/30 italic">
              Bấm vào các từ bên dưới để sắp xếp vào đây...
            </span>
          ) : (
            arrangedTokens.map((token, idx) => (
              <button
                key={`${token}-${idx}`}
                onClick={() => handleRemoveToken(token, idx)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#F4B942] text-white font-black text-base shadow-md cursor-pointer hover:scale-105 transition-transform"
                title="Bấm để gỡ bỏ"
              >
                {token}
              </button>
            ))
          )}
        </div>

        {/* Available Tokens to Pick */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white/50">Các từ cần sắp xếp:</span>
          <div className="flex items-center gap-2.5 flex-wrap">
            {availableTokens.map((token, idx) => (
              <button
                key={`${token}-${idx}`}
                onClick={() => handlePickToken(token, idx)}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-base transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        {/* Check Answer Button & Feedback */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 flex-wrap">
          <button
            onClick={handleCheckAnswer}
            disabled={arrangedTokens.length === 0}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <CheckCircle2 size={16} />
            <span>Kiểm tra đáp án</span>
          </button>

          {exerciseResult === 'correct' && (
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 size={16} />
              <span>🎉 Chính xác! Bạn đã sắp xếp câu tiếng Trung hoàn toàn đúng ngữ pháp.</span>
            </div>
          )}

          {exerciseResult === 'wrong' && (
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <XCircle size={16} />
              <span>Chưa đúng trật tự. Hãy kiểm tra lại Chủ ngữ (S) đứng trước Động từ (V) nhé!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
