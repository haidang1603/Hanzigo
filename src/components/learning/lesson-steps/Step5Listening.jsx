import React from 'react';
import { Eye, EyeOff, Languages, Sparkles, Volume2 } from 'lucide-react';

export default function Step5Listening({
  lesson,
  isSlowAudio = false,
  setIsSlowAudio,
  showPinyin = true,
  setShowPinyin,
  showTranslation = false,
  setShowTranslation,
  dialogueRoleFilter = 'ALL',
  setDialogueRoleFilter,
  revealedTranslations = {},
  setRevealedTranslations,
  handleSpeak,
  listeningFeedback,
  setListeningFeedback,
  playSuccessSound,
  playErrorSound
}) {
  if (!lesson?.step5_listening) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">
            Step 5: Luyện nghe hiểu & Đàm thoại phản xạ
          </span>
          <h3 className="text-base font-bold text-[#243447] dark:text-white">
            {lesson.step5_listening.situation || 'Nghe đoạn đàm thoại thực tế'}
          </h3>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSlowAudio?.(!isSlowAudio)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
              isSlowAudio 
                ? 'border-[#E85D3F] bg-[#FDEEEB] text-[#E85D3F]' 
                : 'border-[#F1E5D8] text-[#748092]'
            }`}
          >
            {isSlowAudio ? 'Tốc độ: 0.65x (Chậm)' : 'Tốc độ: Chuẩn'}
          </button>

          <button
            type="button"
            onClick={() => setShowPinyin?.(!showPinyin)}
            className="p-1.5 rounded-xl border border-[#F1E5D8] text-[#748092] hover:text-[#E85D3F] transition-colors cursor-pointer"
            title={showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
          >
            {showPinyin ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>

          <button
            type="button"
            onClick={() => setShowTranslation?.(!showTranslation)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              showTranslation 
                ? 'border-[#E85D3F] bg-[#FDEEEB] text-[#E85D3F]' 
                : 'border-[#F1E5D8] text-[#748092] hover:text-[#E85D3F]'
            }`}
            title={showTranslation ? 'Ẩn toàn bộ nghĩa tiếng Việt' : 'Hiện toàn bộ nghĩa tiếng Việt'}
          >
            <Languages size={15} />
          </button>
        </div>
      </div>

      {/* Situational Context Card */}
      {lesson.step5_listening.context && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF9F2] to-[#FFF4EC] dark:from-[#131B24] dark:to-[#1A2332] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#E85D3F] font-bold">
            <Sparkles size={14} />
            <span>Bối cảnh giao tiếp thực tế</span>
          </div>
          <p className="text-[#243447] dark:text-[#E2E8F0] font-medium leading-relaxed">
            {lesson.step5_listening.context}
          </p>
          {lesson.step5_listening.participants && (
            <div className="text-[11px] text-[#748092] dark:text-[#94A3B8] pt-1">
              <strong className="text-[#243447] dark:text-white">Nhân vật:</strong> {lesson.step5_listening.participants}
            </div>
          )}
          {lesson.step5_listening.targetGoal && (
            <div className="text-[11px] text-[#45B97C] font-semibold">
              🎯 Mục tiêu: {lesson.step5_listening.targetGoal}
            </div>
          )}
        </div>
      )}

      {/* Role Filter & Mode Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#F1E5D8]/60 dark:border-[#2B3A4F]">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mr-1">Chế độ nghe:</span>
          <button
            type="button"
            onClick={() => setDialogueRoleFilter?.('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              dialogueRoleFilter === 'ALL'
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'bg-[#F8F9FA] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
            }`}
          >
            Toàn bộ
          </button>
          <button
            type="button"
            onClick={() => setDialogueRoleFilter?.('A')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              dialogueRoleFilter === 'A'
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'bg-[#F8F9FA] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
            }`}
          >
            Chỉ vai A
          </button>
          <button
            type="button"
            onClick={() => setDialogueRoleFilter?.('B')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              dialogueRoleFilter === 'B'
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'bg-[#F8F9FA] dark:bg-[#131B24] text-[#748092] hover:text-[#243447]'
            }`}
          >
            Chỉ vai B
          </button>
          <button
            type="button"
            onClick={() => setDialogueRoleFilter?.('ROLEPLAY_B')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              dialogueRoleFilter === 'ROLEPLAY_B'
                ? 'bg-[#45B97C] text-white shadow-xs'
                : 'bg-[#F8F9FA] dark:bg-[#131B24] text-[#45B97C] border border-[#45B97C]/30 hover:bg-[#EBF8F2]'
            }`}
          >
            🎭 Đóng vai (Luyện vai B)
          </button>
        </div>
      </div>

      {/* Master Play Button */}
      <button
        type="button"
        onClick={() => handleSpeak(lesson.step5_listening.audioText)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#3AA56E] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Volume2 size={20} />
        <span>Phát toàn bộ đoạn hội thoại</span>
      </button>

      {/* Dialogue lines */}
      <div className="space-y-3 pt-2">
        {lesson.step5_listening.dialogue
          .filter(line => {
            if (dialogueRoleFilter === 'ALL' || dialogueRoleFilter === 'ROLEPLAY_B') return true;
            return line.speaker === dialogueRoleFilter;
          })
          .map((line, idx) => {
            const isLineRevealed = Boolean(showTranslation || revealedTranslations[idx]);
            const isRoleplayTarget = dialogueRoleFilter === 'ROLEPLAY_B' && line.speaker === 'B';
            
            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isRoleplayTarget
                    ? 'bg-[#F4FAF6] dark:bg-[#11221A] border-[#45B97C] ring-2 ring-[#45B97C]/20 shadow-xs'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/40'
                }`}
                onClick={() => {
                  setRevealedTranslations?.(prev => ({
                    ...prev,
                    [idx]: !prev[idx]
                  }));
                }}
                title="Bấm vào câu để hiện / ẩn dịch nghĩa"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 ${
                    line.speaker === 'A' ? 'bg-[#E85D3F]' : 'bg-[#3B82F6]'
                  }`}>
                    {line.speaker}
                  </div>
                  <div className="flex-1 space-y-0.5 select-none">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#243447] dark:text-white text-sm">
                        {line.hanzi}
                      </span>
                      {isRoleplayTarget && (
                        <span className="text-[10px] bg-[#45B97C] text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                          🎤 Lượt bạn đọc
                        </span>
                      )}
                      {!isLineRevealed && (
                        <span className="text-[10px] text-[#748092] dark:text-[#94A3B8] font-normal italic bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                          👆 Chạm để xem dịch
                        </span>
                      )}
                    </div>
                    {showPinyin && (
                      <div className="text-[#E85D3F] font-mono text-[11px]">{line.pinyin}</div>
                    )}
                    {isLineRevealed ? (
                      <div className="text-[#748092] dark:text-[#94A3B8] text-[11px] pt-1 animate-in fade-in duration-150">
                        {line.meaning}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(line.hanzi);
                    }}
                    className="p-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:border-[#E85D3F] transition-colors shrink-0 cursor-pointer"
                    title="Nghe phát âm câu này"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Cultural & Linguistic Usage Notes */}
      {lesson.step5_listening.usageNotes && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <span>💡</span>
            <span>Mẹo giao tiếp thực tế cho người Việt:</span>
          </div>
          <p className="text-amber-900 dark:text-amber-200/90 leading-relaxed text-[11px]">
            {lesson.step5_listening.usageNotes}
          </p>
        </div>
      )}

      {/* Comprehension Question */}
      {lesson.step5_listening.question && (
        <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
          <h4 className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
            <span>🎯</span>
            <span>Câu hỏi nghe hiểu: {lesson.step5_listening.question}</span>
          </h4>
          {listeningFeedback && (
            <div className={`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in ${
              listeningFeedback.isCorrect 
                ? 'bg-[#EBF8F2] text-[#45B97C] border border-[#45B97C]/30' 
                : 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30'
            }`}>
              <div className="font-bold flex items-center gap-2">
                <span>{listeningFeedback.isCorrect ? '✅' : '❌'}</span>
                <span>{listeningFeedback.message}</span>
              </div>
              {lesson.step5_listening.explanation && (
                <div className="text-[11px] text-[#243447] dark:text-[#E2E8F0] pt-1 pl-6">
                  <strong>Giải thích:</strong> {lesson.step5_listening.explanation}
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {lesson.step5_listening.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx === lesson.step5_listening.correctIndex) {
                    playSuccessSound?.();
                    setListeningFeedback?.({
                      isCorrect: true,
                      message: 'Chính xác! Bạn nghe hiểu đoạn đàm thoại rất tốt.'
                    });
                  } else {
                    playErrorSound?.();
                    setListeningFeedback?.({
                      isCorrect: false,
                      message: 'Chưa chính xác! Hãy bấm nghe lại đoạn hội thoại nhé.'
                    });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  listeningFeedback && idx === lesson.step5_listening.correctIndex
                    ? 'border-[#45B97C] bg-[#EBF8F2]/60 text-[#243447] dark:text-white font-bold'
                    : 'border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#45B97C]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

