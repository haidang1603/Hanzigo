import React, { useEffect, useRef, useState } from 'react';
import { Volume2, BookmarkPlus, Check, Sparkles, X, Loader2 } from 'lucide-react';
import type { ReadingParagraph, ReadingSentence, ReadingToken } from '../../utils/chineseTokenizer.ts';
import {
  analyzeSentenceGrammar,
  type SentenceGrammarAnalysis,
} from '../../services/readingStudioService.ts';
import { saveWordToDeck, type DictionaryEntry } from '../../services/dictionaryService.ts';
import { speakChinese } from '../../utils/audio.js';
import type { ReaderSettings } from './ReaderControlToolbar.tsx';

interface InteractiveArticleRendererProps {
  paragraphs: ReadingParagraph[];
  articleHskLevel: number;
  settings: ReaderSettings;
  savedWords: Set<string>;
  highlightedSentenceId: string | null;
  user?: { id?: string | null } | null;
  onWordSaved?: (word: string) => void;
}

interface SelectedTokenState {
  token: ReadingToken;
  sentence: ReadingSentence;
}

function getHskUnderlineClass(hskLevel?: number): string {
  if (!hskLevel) return '';
  if (hskLevel <= 2) return 'border-b-2 border-emerald-300/80';
  if (hskLevel <= 4) return 'border-b-2 border-sky-400/80';
  if (hskLevel <= 6) return 'border-b-2 border-amber-400/90';
  return 'border-b-2 border-rose-400/90';
}

function getFontStack(fontFamily: ReaderSettings['fontFamily']): string {
  if (fontFamily === 'KaiTi') return '"KaiTi", "STKaiti", "BiauKai", serif';
  if (fontFamily === 'Noto Serif SC') return '"Noto Serif SC", "Songti SC", serif';
  return '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';
}

export const InteractiveArticleRenderer: React.FC<InteractiveArticleRendererProps> = ({
  paragraphs,
  articleHskLevel,
  settings,
  savedWords,
  highlightedSentenceId,
  user,
  onWordSaved,
}) => {
  const sentenceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedToken, setSelectedToken] = useState<SelectedTokenState | null>(null);
  const [savingWord, setSavingWord] = useState(false);
  const [justSavedWord, setJustSavedWord] = useState<string | null>(null);

  const [grammarMap, setGrammarMap] = useState<Record<string, SentenceGrammarAnalysis>>({});
  const [analyzingSentenceId, setAnalyzingSentenceId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedSentenceId) return;
    const node = sentenceRefs.current[highlightedSentenceId];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedSentenceId]);

  const shouldShowPinyin = (token: ReadingToken): boolean => {
    if (token.is_punctuation || !token.pinyin) return false;
    if (settings.pinyinMode === 'off') return false;
    if (settings.pinyinMode === 'all') return true;
    // hard_only: show for unknown words, HSK >= 4, or words above article level
    const isSaved = savedWords.has(token.text);
    const isHighHsk = (token.hsk_level ?? 5) >= 4;
    return !isSaved && isHighHsk;
  };

  const handleSaveSelectedToken = async () => {
    if (!selectedToken) return;
    const { token, sentence } = selectedToken;
    setSavingWord(true);
    try {
      const entry: DictionaryEntry = {
        id: `reading_${token.text}`,
        simplified: token.text,
        traditional: token.text,
        pinyin_display: token.pinyin || token.text,
        pinyin_numeric: token.pinyin || token.text,
        pinyin_clean: (token.pinyin || token.text).replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        han_viet: token.han_viet || '',
        hsk_2_level: token.hsk_level && token.hsk_level <= 6 ? token.hsk_level : null,
        hsk_3_level: token.hsk_level || null,
        frequency_rank: 5000,
        pos_meanings: [
          {
            pos: (token.pos as 'n' | 'v' | 'adj' | 'adv' | 'mw') || 'n',
            definitions_vi: [token.meaning_vi || 'Từ vựng trong bài đọc'],
            definitions_en: [],
            collocations: [],
          },
        ],
        examples: [
          {
            hanzi: sentence.zh_raw,
            pinyin: sentence.pinyin_full,
            vi: sentence.vi_translation,
            hsk_level: articleHskLevel,
          },
        ],
      };

      await saveWordToDeck(entry, user);
      setJustSavedWord(token.text);
      onWordSaved?.(token.text);
    } finally {
      setSavingWord(false);
    }
  };

  const handleAnalyzeGrammar = async (sentence: ReadingSentence) => {
    if (grammarMap[sentence.sentence_id]) {
      setGrammarMap((prev) => {
        const next = { ...prev };
        delete next[sentence.sentence_id];
        return next;
      });
      return;
    }

    setAnalyzingSentenceId(sentence.sentence_id);
    try {
      const result = await analyzeSentenceGrammar(sentence.zh_raw, articleHskLevel, user);
      setGrammarMap((prev) => ({ ...prev, [sentence.sentence_id]: result }));
    } finally {
      setAnalyzingSentenceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Word Lookup Popover Bar */}
      {selectedToken && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-2xl font-bold text-slate-900"
                  style={{ fontFamily: getFontStack(settings.fontFamily) }}
                >
                  {selectedToken.token.text}
                </span>
                {selectedToken.token.pinyin && (
                  <span className="text-sm font-medium text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedToken.token.pinyin}
                  </span>
                )}
                {selectedToken.token.han_viet && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 bg-white/80 px-2 py-0.5 rounded-md">
                    HV: {selectedToken.token.han_viet}
                  </span>
                )}
                {selectedToken.token.hsk_level && (
                  <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    HSK {selectedToken.token.hsk_level}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700">
                {selectedToken.token.meaning_vi || 'Chưa có nghĩa chi tiết trong từ điển nhanh.'}
              </p>
              <p className="text-xs text-slate-500">
                Ngữ cảnh: {selectedToken.sentence.zh_raw}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakChinese(selectedToken.token.text, 0.85)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                Nghe từ
              </button>

              <button
                type="button"
                disabled={savingWord}
                onClick={handleSaveSelectedToken}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  savedWords.has(selectedToken.token.text) ||
                  justSavedWord === selectedToken.token.text
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {savedWords.has(selectedToken.token.text) ||
                justSavedWord === selectedToken.token.text ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Đã lưu vào Bộ từ
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    {savingWord ? 'Đang lưu...' : '+ Lưu vào Bộ từ'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedToken(null)}
                aria-label="Đóng tra từ"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-white/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paragraphs */}
      <div className="space-y-6">
        {paragraphs.map((para) => (
          <div key={para.paragraph_index} className="space-y-3">
            {para.sentences.map((sentence) => {
              const isHighlighted = highlightedSentenceId === sentence.sentence_id;
              const grammar = grammarMap[sentence.sentence_id];
              const isAnalyzing = analyzingSentenceId === sentence.sentence_id;

              return (
                <div
                  key={sentence.sentence_id}
                  ref={(el) => {
                    sentenceRefs.current[sentence.sentence_id] = el;
                  }}
                  className={`rounded-xl p-3.5 transition-colors border ${
                    isHighlighted
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/70'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="leading-[2.3] flex flex-wrap items-end gap-x-1 gap-y-1.5"
                      style={{
                        fontSize: `${settings.fontSize}px`,
                        fontFamily: getFontStack(settings.fontFamily),
                      }}
                    >
                      {sentence.tokens.map((token, idx) => {
                        if (token.is_punctuation) {
                          return (
                            <span key={`${sentence.sentence_id}-p-${idx}`} className="text-slate-700">
                              {token.text}
                            </span>
                          );
                        }

                        const isSaved = savedWords.has(token.text);
                        const isSelected =
                          selectedToken?.token.text === token.text &&
                          selectedToken?.sentence.sentence_id === sentence.sentence_id;
                        const hskClass = settings.hskHighlight
                          ? getHskUnderlineClass(token.hsk_level)
                          : '';
                        const savedClass =
                          settings.savedHighlight && isSaved
                            ? 'bg-amber-100/90 text-amber-950 rounded px-0.5'
                            : '';

                        return (
                          <button
                            key={`${sentence.sentence_id}-t-${idx}`}
                            type="button"
                            onClick={() => {
                              setJustSavedWord(null);
                              setSelectedToken({ token, sentence });
                            }}
                            className={`inline-flex flex-col items-center cursor-pointer rounded px-0.5 transition hover:bg-emerald-50 ${hskClass} ${savedClass} ${
                              isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                            }`}
                          >
                            <ruby className="ruby-align-center">
                              <span>{token.text}</span>
                              {shouldShowPinyin(token) && (
                                <rt className="text-[11px] font-sans font-normal text-slate-500 select-none pb-0.5">
                                  {token.pinyin}
                                </rt>
                              )}
                            </ruby>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={() => speakChinese(sentence.zh_raw, 0.85)}
                        title="Nghe câu này"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnalyzeGrammar(sentence)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition ${
                          grammar
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        Phân tích câu
                      </button>
                    </div>
                  </div>

                  {settings.showInterlinearVi && sentence.vi_translation && (
                    <p className="mt-1.5 text-sm text-slate-600 pl-0.5">
                      {sentence.vi_translation}
                    </p>
                  )}

                  {grammar && (
                    <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-800">
                          Cấu trúc: {grammar.pattern}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {grammar.explanation_vi}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {grammar.breakdown.map((item, bIdx) => (
                          <div
                            key={`${sentence.sentence_id}-g-${bIdx}`}
                            className="rounded-lg bg-white border border-indigo-100 px-2.5 py-1.5 text-xs"
                          >
                            <span className="font-semibold text-slate-900">{item.segment}</span>
                            <span className="mx-1 text-indigo-500">·</span>
                            <span className="font-medium text-indigo-700">{item.role}</span>
                            {item.note && (
                              <span className="text-slate-500 ml-1">({item.note})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

