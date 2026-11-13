import React, { useCallback, useEffect, useState } from 'react';
import { Volume2, RotateCw, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import {
  scheduleNextReview,
  saveVocabItemReview,
  updatePersonalMnemonic,
  markVocabItemAsMastered,
  type MultiModalReviewCard,
  type ReviewRating,
  type UserVocabItem,
} from '../../services/vocabWorkspaceService.ts';
import { speakChinese } from '../../utils/audio.js';

interface SmartFlashcardSessionProps {
  cards: MultiModalReviewCard[];
  user?: { id?: string | null } | null;
  onItemUpdated: (updated: UserVocabItem) => void;
  onExit: () => void;
}

const RATING_BUTTONS: Array<{
  rating: ReviewRating;
  keyHint: string;
  label: string;
  sub: string;
  cls: string;
}> = [
  {
    rating: 1,
    keyHint: '1',
    label: 'Quên',
    sub: 'Again',
    cls: 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100',
  },
  {
    rating: 2,
    keyHint: '2',
    label: 'Khó',
    sub: 'Hard',
    cls: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100',
  },
  {
    rating: 3,
    keyHint: '3',
    label: 'Tốt',
    sub: 'Good',
    cls: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
  },
  {
    rating: 4,
    keyHint: '4',
    label: 'Rất dễ',
    sub: 'Easy',
    cls: 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100',
  },
];

export const SmartFlashcardSession: React.FC<SmartFlashcardSessionProps> = ({
  cards,
  user,
  onItemUpdated,
  onExit,
}) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedAudioChoice, setSelectedAudioChoice] = useState<string | null>(null);
  const [clozeInput, setClozeInput] = useState('');
  const [mnemonicDraft, setMnemonicDraft] = useState(cards[0]?.item.personal_mnemonic || '');
  const [savingMnemonic, setSavingMnemonic] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const currentCard = cards[index];
  const isFinished = index >= cards.length;

  const advanceCard = useCallback(
    (nextIdx: number) => {
      setIndex(nextIdx);
      setFlipped(false);
      setSelectedAudioChoice(null);
      setClozeInput('');
      setMnemonicDraft(cards[nextIdx]?.item.personal_mnemonic || '');
    },
    [cards]
  );

  const handleRate = useCallback(
    async (rating: ReviewRating) => {
      if (!currentCard) return;
      const updated = scheduleNextReview(currentCard.item, rating);
      await saveVocabItemReview(updated, rating, user);
      onItemUpdated(updated);
      setCompletedCount((c) => c + 1);
      advanceCard(index + 1);
    },
    [currentCard, user, onItemUpdated, advanceCard, index]
  );

  const handleMarkMasteredDirect = async () => {
    if (!currentCard) return;
    const updatedList = await markVocabItemAsMastered(currentCard.item.id, user);
    const updated = updatedList.find((it) => it.id === currentCard.item.id) || {
      ...currentCard.item,
      interval_days: 30,
      meaning_mastery: 100,
    };
    onItemUpdated(updated);
    setCompletedCount((c) => c + 1);
    advanceCard(index + 1);
  };

  // Keyboard shortcuts: Space (Flip), 1-4 (Rate), R (Speak)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (isFinished || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((v) => !v);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakChinese(currentCard.item.simplified, 0.85);
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        void handleRate(Number(e.key) as ReviewRating);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFinished, currentCard, flipped, handleRate]);

  const handleSaveMnemonic = async () => {
    if (!currentCard) return;
    setSavingMnemonic(true);
    try {
      await updatePersonalMnemonic(currentCard.item.id, mnemonicDraft, user);
      onItemUpdated({ ...currentCard.item, personal_mnemonic: mnemonicDraft });
    } finally {
      setSavingMnemonic(false);
    }
  };

  if (isFinished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Hoàn thành phiên ôn tập!</h2>
        <p className="text-sm text-slate-600">
          Bạn đã ôn tập {completedCount} từ vựng và cập nhật lịch trình SRS đa chiều.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Quay lại Workspace
        </button>
      </div>
    );
  }

  const { item, mode, audioOptions, clozePrompt } = currentCard;
  const primaryContext = item.source_context?.[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại kho từ vựng
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Thẻ {index + 1} / {cards.length} ·{' '}
          {mode === 'flashcard'
            ? 'Thẻ 3D'
            : mode === 'audio_choice'
              ? 'Nghe chọn từ'
              : 'Điền ngữ cảnh'}
        </span>
      </div>

      {/* 3D Flip Card */}
      <div className="relative" style={{ perspective: '1200px' }}>
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '320px',
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                HSK {item.hsk_level}
              </span>
              <button
                type="button"
                onClick={() => speakChinese(item.simplified, 0.85)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Nghe (R)
              </button>
            </div>

            <div className="text-center space-y-4 my-auto py-4">
              {mode === 'flashcard' && (
                <>
                  <div className="text-5xl font-bold text-slate-900">{item.simplified}</div>
                  <p className="text-xs text-slate-400">Nhấn Space hoặc nút bên dưới để lật thẻ</p>
                </>
              )}

              {mode === 'audio_choice' && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Nghe phát âm và chọn chữ Hán đúng:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    {(audioOptions || []).map((opt) => {
                      const picked = selectedAudioChoice === opt.simplified;
                      const isCorrect = opt.simplified === item.simplified;
                      let cls = 'bg-slate-50 border-slate-200 hover:border-emerald-300';
                      if (selectedAudioChoice) {
                        if (isCorrect) cls = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                        else if (picked) cls = 'bg-rose-50 border-rose-300 text-rose-800';
                      }
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedAudioChoice(opt.simplified);
                            setFlipped(true);
                          }}
                          className={`rounded-xl border p-3 text-lg font-bold transition ${cls}`}
                        >
                          {opt.simplified}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === 'context_cloze' && (
                <div className="space-y-3 max-w-lg mx-auto">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Điền từ vào câu ngữ cảnh bạn đã lưu
                  </p>
                  <p className="text-xl font-bold text-slate-900">{clozePrompt}</p>
                  {primaryContext?.sentence_vi && (
                    <p className="text-xs text-slate-500">{primaryContext.sentence_vi}</p>
                  )}
                  <input
                    type="text"
                    value={clozeInput}
                    onChange={(e) => setClozeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setFlipped(true);
                    }}
                    placeholder="Gõ từ còn thiếu rồi nhấn Enter..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-center"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Lật thẻ xem đáp án (Space)
              </button>
            </div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-slate-900">{item.simplified}</span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                    {item.pinyin}
                  </span>
                  {item.han_viet && (
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {item.han_viet}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFlipped(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Lật lại
                </button>
              </div>

              <p className="text-base font-semibold text-slate-800">{item.meaning_vi}</p>

              {primaryContext && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Ngữ cảnh gốc ({primaryContext.source_type})
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {primaryContext.sentence_zh}
                  </div>
                  <div className="text-xs text-slate-600">{primaryContext.sentence_pinyin}</div>
                  <div className="text-xs text-slate-500">{primaryContext.sentence_vi}</div>
                </div>
              )}

              {/* Editable Personal Mnemonic */}
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-2.5 space-y-1.5">
                <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ghi chú / Mẹo nhớ cá nhân
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mnemonicDraft}
                    onChange={(e) => setMnemonicDraft(e.target.value)}
                    placeholder="Thêm mẹo nhớ riêng cho từ này..."
                    className="flex-1 rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs"
                  />
                  <button
                    type="button"
                    disabled={savingMnemonic}
                    onClick={handleSaveMnemonic}
                    className="rounded-lg bg-amber-600 text-white px-2.5 py-1 text-xs font-semibold"
                  >
                    {savingMnemonic ? '...' : 'Lưu'}
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Buttons */}
            <div className="space-y-2 pt-3">
              <div className="grid grid-cols-4 gap-2">
                {RATING_BUTTONS.map((btn) => (
                  <button
                    key={btn.rating}
                    type="button"
                    onClick={() => handleRate(btn.rating)}
                    className={`rounded-xl border py-2 px-2 text-center transition ${btn.cls}`}
                  >
                    <div className="text-xs font-bold">
                      [{btn.keyHint}] {btn.label}
                    </div>
                    <div className="text-[10px] opacity-80">{btn.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleMarkMasteredDirect}
                  className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã thuộc từ này (Không hiện lại nữa)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

