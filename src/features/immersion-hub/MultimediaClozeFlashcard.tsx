import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Mic,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Video,
  FileText,
  Camera,
  BookMarked,
  RotateCw,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import { tokenizeChineseText } from '../../utils/chineseTokenizer.ts';
import type { MinedSentenceCard, ImmersionSourceModule } from '../../services/sentenceMiningEngine.ts';

interface MultimediaClozeFlashcardProps {
  card: MinedSentenceCard;
  onOpenDictionary?: (term: string) => void;
  onOpenPronunciation?: (text: string, pinyin?: string) => void;
  onNextCard?: () => void;
}

const SOURCE_BADGE: Record<
  ImmersionSourceModule,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  video: {
    label: 'Video Studio',
    icon: <Video className="w-3.5 h-3.5" />,
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  article: {
    label: 'Web Clipper',
    icon: <FileText className="w-3.5 h-3.5" />,
    cls: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  ocr: {
    label: 'OCR Scanner',
    icon: <Camera className="w-3.5 h-3.5" />,
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  story: {
    label: 'Reading Studio',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    cls: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  textbook: {
    label: 'Giáo trình',
    icon: <BookMarked className="w-3.5 h-3.5" />,
    cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

function formatMs(ms?: number): string {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return '';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const MultimediaClozeFlashcard: React.FC<MultimediaClozeFlashcardProps> = ({
  card,
  onOpenDictionary,
  onOpenPronunciation,
  onNextCard,
}) => {
  const [userGuess, setUserGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const sourceMeta = SOURCE_BADGE[card.media_context.source_module] || SOURCE_BADGE.story;

  const clozeParts = useMemo(() => {
    if (!card.target_word || !card.sentence_zh.includes(card.target_word)) {
      return { before: card.sentence_zh, blank: '', after: '' };
    }
    const idx = card.sentence_zh.indexOf(card.target_word);
    return {
      before: card.sentence_zh.slice(0, idx),
      blank: card.target_word,
      after: card.sentence_zh.slice(idx + card.target_word.length),
    };
  }, [card]);

  const sentenceTokens = useMemo(() => {
    return tokenizeChineseText(card.sentence_zh).filter((t) => !t.is_punctuation);
  }, [card.sentence_zh]);

  const isCorrect =
    userGuess.trim() === card.target_word.trim() && card.target_word.trim().length > 0;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRevealed(true);
    speakChinese(card.sentence_zh, 0.85);
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-white shadow-md overflow-hidden">
      {/* Media Context Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50/90 via-white to-emerald-50/70 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sourceMeta.cls}`}
          >
            {sourceMeta.icon}
            <span>{sourceMeta.label}</span>
          </span>

          <span className="text-xs font-bold text-slate-700 truncate max-w-[240px]">
            {card.media_context.source_title}
          </span>

          {typeof card.media_context.start_ms === 'number' && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
              {formatMs(card.media_context.start_ms)} – {formatMs(card.media_context.end_ms)}
            </span>
          )}
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          {card.comprehensibility_ratio}% đã biết (i+1)
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Cloze Sentence Prompt */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => speakChinese(card.sentence_zh, 0.85)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Phát âm đoạn câu gốc</span>
            </button>
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed pt-2">
            <span>{clozeParts.before}</span>
            {clozeParts.blank ? (
              <span
                className={`inline-block mx-1.5 px-3 py-0.5 rounded-xl border-2 transition ${
                  isRevealed
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-dashed border-amber-500 bg-amber-50 text-amber-700 min-w-[72px]'
                }`}
              >
                {isRevealed ? clozeParts.blank : '____'}
              </span>
            ) : null}
            <span>{clozeParts.after}</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-500 italic">{card.sentence_vi}</p>
        </div>

        {/* Input Form / Answer Reveal */}
        {!isRevealed ? (
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Điền từ còn thiếu vào chỗ trống..."
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-center sm:text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-3 text-sm shadow-xs transition cursor-pointer"
            >
              Kiểm tra &amp; Lật thẻ
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Result Status Banner */}
            {userGuess.trim() && (
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 ${
                  isCorrect
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chính xác! Từ mục tiêu là “{card.target_word}”.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Đáp án đúng là “{card.target_word}” (bạn nhập: “{userGuess}”).
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Back of Card: Full Pinyin + Token Breakdown + Shadowing */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-emerald-700">{card.sentence_pinyin}</p>
                <div className="flex items-center gap-2">
                  {onOpenPronunciation && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenPronunciation(card.sentence_zh, card.sentence_pinyin)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Đọc nhại lại câu này</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Token Pills for Deep Vocabulary Inspection */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Bấm vào từng từ để tra từ điển:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sentenceTokens.map((tok, i) => {
                    const isTarget = tok.text === card.target_word;
                    return (
                      <button
                        key={`${tok.text}-${i}`}
                        type="button"
                        onClick={() => onOpenDictionary && onOpenDictionary(tok.text)}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          isTarget
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <span>{tok.text}</span>
                        {tok.pinyin ? (
                          <span className="text-[10px] opacity-75 ml-1">({tok.pinyin})</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRevealed(false);
                  setUserGuess('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Ôn lại thẻ này</span>
              </button>

              {onNextCard && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRevealed(false);
                    setUserGuess('');
                    onNextCard();
                  }}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs cursor-pointer"
                >
                  Thẻ tiếp theo →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

