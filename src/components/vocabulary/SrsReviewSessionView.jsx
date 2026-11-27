import React from 'react';
import {
  RotateCw,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Zap,
  PenTool,
  Mic,
  Flame,
  Keyboard,
} from 'lucide-react';
import AudioButton from '../AudioButton';
import AiContextBadge from '../personalization/AiContextBadge.jsx';
import { SRS_QUALITY } from '../../utils/srsEngine';

export function VocabularyQuizView({
  currentCard,
  quizScore,
  quizStreak,
  quizOptions,
  quizAnswered,
  selectedOption,
  handleQuizAnswer,
  handleNextQuizCard,
  onSelectWriting,
  onSelectPronounce,
  setActiveTab,
}) {
  return (
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl text-center space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider">
          Thử thách phản xạ từ vựng
        </span>
        <div className="flex items-center gap-2">
          {quizStreak > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse">
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              Chuỗi {quizStreak} từ!
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Zap size={12} />
            Đã đúng: {quizScore} từ
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-[#243447] dark:text-white">
          Chọn nghĩa tiếng Việt chính xác
        </h3>
        <p className="text-xs text-[#748092]">
          Quan sát chữ Hán và chọn 1 trong 4 đáp án bên dưới.
        </p>
      </div>

      {/* Flashcard prompt */}
      {currentCard && (
        <div className="p-8 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
          <span className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white block">
            {currentCard.hanzi}
          </span>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-sm font-bold text-[#E85D3F]">
              {currentCard.pinyin}
            </span>
            <AudioButton text={currentCard.hanzi} size="sm" />
          </div>
          <p className="text-xs text-[#748092]">Hán-Việt: {currentCard.hanviet}</p>
        </div>
      )}

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quizOptions.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentCard?.meaning;
          let btnClass =
            'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';

          if (quizAnswered) {
            if (isCorrect) {
              btnClass =
                'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
            } else if (isSelected) {
              btnClass =
                'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(currentCard, opt)}
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Quiz Feedback & Next Button */}
      {quizAnswered && currentCard && (
        <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-3 animate-in fade-in">
          <p className="font-bold text-[#243447] dark:text-white">
            {selectedOption === currentCard.meaning
              ? '🎉 Chính xác tuyệt vời!'
              : `⚠️ Chưa đúng! Nghĩa đúng là: ${currentCard.meaning}`}
          </p>
          {currentCard.mnemonic && (
            <p className="text-[11px] text-[#748092]">
              💡 Mẹo nhớ: {currentCard.mnemonic}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSelectWriting
                    ? onSelectWriting(currentCard)
                    : setActiveTab?.('writing')
                }
                className="px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[11px] font-bold flex items-center gap-1 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <PenTool size={12} />
                <span>Viết chữ</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onSelectPronounce
                    ? onSelectPronounce(currentCard)
                    : setActiveTab?.('pronunciation')
                }
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Mic size={12} />
                <span>Phát âm</span>
              </button>
            </div>
            <button
              onClick={handleNextQuizCard}
              className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-sm transition-all ml-auto cursor-pointer"
            >
              Từ tiếp theo ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SrsReviewSessionView({
  currentCard,
  currentIndex,
  totalFiltered,
  isFlipped,
  srsMap,
  srsPreview,
  aiGeneratedExample,
  isGeneratingExample,
  handleDeleteCustomItem,
  handleGenerateAiExample,
  handleSrsRate,
  handleNextCard,
  handlePrevCard,
  onSelectWriting,
  onSelectPronounce,
  setActiveTab,
  renderFlipContainer,
  ratingButtonBaseClass,
}) {
  if (!currentCard) return null;

  const cardInner = (
    <div
      className={`relative w-full h-[380px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl border border-[#F1E5D8] dark:border-[#2B3A4F] ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
    >
      {/* FRONT OF FLASHCARD */}
      <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-white to-[#FFF9F2] dark:from-[#1E293B] dark:to-[#131B24] rounded-3xl p-8 flex flex-col justify-between items-center text-center">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
              {currentCard.level}
            </span>
            {currentCard.pos && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                {currentCard.pos}
              </span>
            )}
          </div>
          <AudioButton text={currentCard.hanzi} size="md" />
        </div>

        <div className="space-y-3">
          <div className="font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-[#243447] dark:text-white tracking-wide">
            {currentCard.hanzi}
          </div>
          {currentCard.traditional &&
            currentCard.traditional !== currentCard.hanzi && (
              <p className="text-xs font-medium text-[#748092] dark:text-[#94A3B8]">
                Phồn thể:{' '}
                <span className="font-['Noto_Serif_SC'] font-bold text-[#E85D3F]">
                  {currentCard.traditional}
                </span>
              </p>
            )}
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Bộ thủ: {currentCard.radical} • {currentCard.strokes} nét
          </p>
        </div>

        <div className="text-xs font-bold text-[#E85D3F] flex items-center gap-1.5 animate-bounce">
          <RotateCw size={14} />
          <span>Bấm vào thẻ để xem Pinyin, nghĩa &amp; chiết tự</span>
        </div>
      </div>

      {/* BACK OF FLASHCARD */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-[#1E293B] rounded-3xl p-5 sm:p-7 flex flex-col justify-between text-left overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
              {currentCard.hanzi}
            </span>
            {currentCard.traditional &&
              currentCard.traditional !== currentCard.hanzi && (
                <span className="font-['Noto_Serif_SC'] text-sm font-semibold text-gray-400">
                  ({currentCard.traditional})
                </span>
              )}
            <span className="text-lg font-bold text-[#E85D3F]">
              {currentCard.pinyin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentCard.pos && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50">
                {currentCard.pos}
              </span>
            )}
            <AudioButton text={currentCard.hanzi} size="sm" />
          </div>
        </div>

        <div className="space-y-3 my-auto py-2">
          <div>
            <span className="text-[11px] text-[#748092] dark:text-[#94A3B8] block">
              Nghĩa tiếng Việt:
            </span>
            <p className="text-lg font-bold text-[#45B97C]">
              {currentCard.meaning}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#748092]">
              <p>
                Âm Hán-Việt:{' '}
                <span className="font-semibold text-[#243447] dark:text-white">
                  {currentCard.hanviet}
                </span>
              </p>
              {currentCard.en && (
                <p>
                  Tiếng Anh (CC-CEDICT):{' '}
                  <span className="font-medium text-[#243447] dark:text-gray-300">
                    {currentCard.en}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[11px] font-bold text-[#E85D3F] block mb-1">
              Mẹo nhớ chữ qua chiết tự:
            </span>
            <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
              {currentCard.mnemonic}
            </p>
          </div>

          {currentCard.example && (
            <div className="text-xs space-y-0.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#243447] dark:text-white">
                    Ví dụ từ điển:
                  </span>
                  <AiContextBadge type="official_dict" size="xs" />
                </div>
                <AudioButton text={currentCard.example.hanzi} size="sm" />
              </div>
              <p className="text-[#243447] dark:text-white font-medium">
                {currentCard.example.hanzi}
              </p>
              {currentCard.example.pinyin && (
                <p className="text-[11px] text-[#E85D3F]">
                  {currentCard.example.pinyin}
                </p>
              )}
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                {currentCard.example.meaning}
              </p>
            </div>
          )}

          {/* AI Contextual Generated Drill */}
          {aiGeneratedExample ? (
            <div className="text-xs space-y-0.5 pt-1 p-2.5 rounded-xl bg-amber-50/70 dark:bg-gray-800/70 border border-amber-200/60 dark:border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#E85D3F]">
                    Ngữ cảnh bổ trợ:
                  </span>
                  <AiContextBadge type="ai_suggestion" size="xs" />
                </div>
                <AudioButton
                  text={aiGeneratedExample.targetHanzi || currentCard.hanzi}
                  size="sm"
                />
              </div>
              <p className="text-[#243447] dark:text-white font-medium">
                {aiGeneratedExample.targetHanzi || currentCard.hanzi}
              </p>
              {aiGeneratedExample.pinyin && (
                <p className="text-[11px] text-[#E85D3F]">
                  {aiGeneratedExample.pinyin}
                </p>
              )}
              <p className="text-[11px] text-gray-600 dark:text-gray-300">
                {aiGeneratedExample.explanation || aiGeneratedExample.prompt}
              </p>
            </div>
          ) : (
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateAiExample(currentCard);
                }}
                disabled={isGeneratingExample}
                className="w-full py-1.5 px-3 rounded-xl bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-[#E85D3F] dark:text-orange-400 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles
                  size={13}
                  className={isGeneratingExample ? 'animate-spin' : ''}
                />
                <span>
                  {isGeneratingExample
                    ? 'Đang tạo câu ví dụ...'
                    : '✨ Tạo câu ví dụ ngữ cảnh AI'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Cross-practice Quick Access */}
        {(onSelectWriting || onSelectPronounce || setActiveTab) && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectWriting) onSelectWriting(currentCard);
                else if (setActiveTab) setActiveTab('writing');
              }}
              className="flex-1 min-h-11 py-1.5 px-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <PenTool size={13} />
              <span>✍️ Luyện viết chữ</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectPronounce) onSelectPronounce(currentCard);
                else if (setActiveTab) setActiveTab('pronunciation');
              }}
              className="flex-1 min-h-11 py-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Mic size={13} />
              <span>🎙️ Luyện phát âm</span>
            </button>
          </div>
        )}

        <div className="text-right text-[10px] text-[#748092] italic pt-1">
          Bấm lần nữa để lật lại mặt trước
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Card Meta Bar */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#748092] dark:text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E85D3F]" />
          <span>
            Chủ đề: {currentCard.topic} • {currentCard.level}
          </span>
          {currentCard.isCustom && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
              Tự thêm
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentCard.isCustom && (
            <button
              onClick={(e) => handleDeleteCustomItem(currentCard.id, e)}
              title="Xóa từ vựng này khỏi danh sách cá nhân"
              className="p-1 text-[#748092] hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          )}
          <span>
            Thẻ {currentIndex + 1} / {totalFiltered}
          </span>
        </div>
      </div>

      {/* Interactive Flip Card */}
      {renderFlipContainer(cardInner)}

      {/* SM-2 SRS Card Status Indicator */}
      <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#1E293B]/80 border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles size={13} className="text-[#E85D3F]" />
            <span>
              SRS:{' '}
              {srsMap[currentCard.hanzi]?.stage === 2
                ? '🏆 Đã thuần thục'
                : srsMap[currentCard.hanzi]?.stage === 1
                  ? '🔄 Đang ôn tập'
                  : '🆕 Thẻ mới'}
            </span>
          </span>
          {(srsMap[currentCard.hanzi]?.lapseCount ||
            srsMap[currentCard.hanzi]?.lapse_count ||
            0) >= 3 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 text-[10px]">
              ⚠️ Hay quên (
              {srsMap[currentCard.hanzi]?.lapseCount ||
                srsMap[currentCard.hanzi]?.lapse_count}{' '}
              lần)
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>
            Lặp: <strong>{srsMap[currentCard.hanzi]?.repetitions || 0}</strong> lần
          </span>
          <span>
            Cách: <strong>{srsMap[currentCard.hanzi]?.intervalDays || 1}</strong>{' '}
            ngày
          </span>
          <span>
            EF:{' '}
            <strong>
              {(srsMap[currentCard.hanzi]?.easeFactor || 2.5).toFixed(2)}
            </strong>
          </span>
        </div>
      </div>

      {/* Action Buttons: 4-tier SM-2 SRS Rating */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => handleSrsRate(currentCard, SRS_QUALITY.AGAIN)}
          className={`${ratingButtonBaseClass} bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-rose-200/70 dark:bg-rose-900/80 text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <Clock size={14} className="text-rose-500" />
            <span>Quên</span>
          </div>
          <span className="text-[10px] font-semibold text-rose-600/80 dark:text-rose-300/80">
            {srsPreview.againLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSrsRate(currentCard, SRS_QUALITY.HARD)}
          className={`${ratingButtonBaseClass} bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-amber-200/80 dark:bg-amber-900/80 text-[10px] font-black flex items-center justify-center">
              2
            </span>
            <RotateCw size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Khó</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-300/80">
            Ôn sau {srsPreview.hardLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSrsRate(currentCard, SRS_QUALITY.GOOD)}
          className={`${ratingButtonBaseClass} bg-gradient-to-br from-[#45B97C] to-[#2E8B57] text-white shadow-md shadow-[#45B97C]/25 hover:opacity-95`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-white/20 text-[10px] font-black flex items-center justify-center">
              3
            </span>
            <Check size={14} />
            <span>Tốt</span>
          </div>
          <span className="text-[10px] font-semibold text-white/85">
            Ôn sau {srsPreview.goodLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSrsRate(currentCard, SRS_QUALITY.EASY)}
          className={`${ratingButtonBaseClass} bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white shadow-md shadow-[#E85D3F]/25 hover:opacity-95`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-white/20 text-[10px] font-black flex items-center justify-center">
              4
            </span>
            <Zap size={14} />
            <span>Dễ</span>
          </div>
          <span className="text-[10px] font-semibold text-white/85">
            Ôn sau {srsPreview.easyLabel}
          </span>
        </button>
      </div>

      {/* Prev / Next Card Controls */}
      <div className="flex items-center justify-center gap-6 pt-1">
        <button
          onClick={handlePrevCard}
          title="Thẻ trước (←)"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs font-bold text-[#748092]">
          {currentIndex + 1} / {totalFiltered}
        </span>
        <button
          onClick={handleNextCard}
          title="Thẻ tiếp theo (→)"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Keyboard shortcut guide */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#748092] dark:text-[#94A3B8] pt-1">
        <span className="flex items-center gap-1 font-bold text-[#243447] dark:text-white">
          <Keyboard size={13} /> Phím tắt:
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          Space: Lật
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          ← / →: Chuyển thẻ
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          1: Quên
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          2: Khó
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          3: Tốt
        </span>
        <span className="bg-[#FFF9F2] dark:bg-[#131B24] px-2 py-0.5 rounded-md border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono">
          4: Dễ
        </span>
      </div>
    </div>
  );
}
