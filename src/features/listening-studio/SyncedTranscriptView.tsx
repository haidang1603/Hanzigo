import React, { useEffect, useRef, useState } from 'react';
import { EyeOff, Eye, Volume2, BookmarkPlus, Check, X } from 'lucide-react';
import type { TranscriptSegment } from '../../services/listeningStudioService.ts';
import { tokenizeChineseText, type ReadingToken } from '../../utils/chineseTokenizer.ts';
import { saveWordToDeck, type DictionaryEntry } from '../../services/dictionaryService.ts';
import { speakChinese } from '../../utils/audio.js';

interface SyncedTranscriptViewProps {
  segments: TranscriptSegment[];
  activeSegmentIndex: number;
  hskLevel: number;
  user?: { id?: string | null } | null;
  onSelectSegment: (index: number) => void;
}

interface ClickedWordState {
  token: ReadingToken;
  segment: TranscriptSegment;
}

export const SyncedTranscriptView: React.FC<SyncedTranscriptViewProps> = ({
  segments,
  activeSegmentIndex,
  hskLevel,
  user,
  onSelectSegment,
}) => {
  const segmentRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [hideHanzi, setHideHanzi] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [hideVi, setHideVi] = useState(false);
  const [peekAll, setPeekAll] = useState(false);

  const [clickedWord, setClickedWord] = useState<ClickedWordState | null>(null);
  const [savingWord, setSavingWord] = useState(false);
  const [savedWordSet, setSavedWordSet] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const el = segmentRefs.current[activeSegmentIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSegmentIndex]);

  // Hold H to temporarily reveal blurred layers
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'h' || e.key === 'H') setPeekAll(true);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') setPeekAll(false);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const handleSaveWord = async () => {
    if (!clickedWord) return;
    const { token, segment } = clickedWord;
    setSavingWord(true);
    try {
      const entry: DictionaryEntry = {
        id: `listen_${token.text}`,
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
            definitions_vi: [token.meaning_vi || 'Từ vựng trong bài nghe'],
            definitions_en: [],
            collocations: [],
          },
        ],
        examples: [
          {
            hanzi: segment.hanzi,
            pinyin: segment.pinyin,
            vi: segment.vi,
            hsk_level: hskLevel,
          },
        ],
      };
      await saveWordToDeck(entry, user);
      setSavedWordSet((prev) => {
        const next = new Set(prev);
        next.add(token.text);
        return next;
      });
    } finally {
      setSavingWord(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      {/* Blur / Cloze Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Chế độ che mờ (Cloze)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHideHanzi((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              hideHanzi
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {hideHanzi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Ẩn Chữ Hán
          </button>

          <button
            type="button"
            onClick={() => setHidePinyin((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              hidePinyin
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {hidePinyin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Ẩn Pinyin
          </button>

          <button
            type="button"
            onClick={() => setHideVi((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              hideVi
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {hideVi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Ẩn Dịch nghĩa
          </button>
        </div>
      </div>

      {/* Quick Word Lookup Popover */}
      {clickedWord && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">{clickedWord.token.text}</span>
              {clickedWord.token.pinyin && (
                <span className="text-xs font-medium text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {clickedWord.token.pinyin}
                </span>
              )}
              {clickedWord.token.hsk_level && (
                <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                  HSK {clickedWord.token.hsk_level}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 mt-1">
              {clickedWord.token.meaning_vi || 'Từ vựng trong đoạn hội thoại'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => speakChinese(clickedWord.token.text, 0.85)}
              className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              Nghe
            </button>
            <button
              type="button"
              disabled={savingWord}
              onClick={handleSaveWord}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 text-white px-2.5 py-1.5 text-xs font-semibold"
            >
              {savedWordSet.has(clickedWord.token.text) ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Đã lưu
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  Lưu từ
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setClickedWord(null)}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Segments List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {segments.map((seg) => {
          const isActive = seg.index === activeSegmentIndex;
          const tokens = tokenizeChineseText(seg.hanzi);

          return (
            <div
              key={seg.index}
              ref={(el) => {
                segmentRefs.current[seg.index] = el;
              }}
              onClick={() => onSelectSegment(seg.index)}
              className={`group rounded-xl border p-3.5 cursor-pointer transition ${
                isActive
                  ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-300'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700">
                  #{seg.index + 1} · {seg.speaker}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {(seg.start_ms / 1000).toFixed(1)}s – {(seg.end_ms / 1000).toFixed(1)}s
                </span>
              </div>

              {/* Hanzi */}
              <div
                className={`text-lg font-medium text-slate-900 flex flex-wrap gap-0.5 transition ${
                  hideHanzi && !peekAll ? 'blur-sm group-hover:blur-none select-none' : ''
                }`}
              >
                {tokens.map((tok, tIdx) =>
                  tok.is_punctuation ? (
                    <span key={`${seg.index}-p-${tIdx}`}>{tok.text}</span>
                  ) : (
                    <button
                      key={`${seg.index}-t-${tIdx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClickedWord({ token: tok, segment: seg });
                      }}
                      className="hover:bg-emerald-100 rounded px-0.5 transition"
                    >
                      {tok.text}
                    </button>
                  )
                )}
              </div>

              {/* Pinyin */}
              <p
                className={`text-xs text-slate-600 mt-1 transition ${
                  hidePinyin && !peekAll ? 'blur-sm group-hover:blur-none select-none' : ''
                }`}
              >
                {seg.pinyin}
              </p>

              {/* Vietnamese Translation */}
              <p
                className={`text-xs text-slate-500 mt-0.5 transition ${
                  hideVi && !peekAll ? 'blur-sm group-hover:blur-none select-none' : ''
                }`}
              >
                {seg.vi}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

