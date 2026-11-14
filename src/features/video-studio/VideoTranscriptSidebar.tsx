import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, FileText, Filter, Mic, Pickaxe, Volume2 } from 'lucide-react';
import type { SubtitleCue } from '../../services/videoStudioService.ts';
import {
  analyzeSentenceComprehensibility,
  getUserKnownWordsSet,
  mineSentenceToMultimediaCard,
  type AnalyzedSentenceResult,
} from '../../services/sentenceMiningEngine.ts';
import { speakChinese } from '../../utils/audio.js';

interface VideoTranscriptSidebarProps {
  subtitles: SubtitleCue[];
  activeCueIndex: number;
  onSelectCue: (index: number) => void;
  onOpenPronunciation?: (hanzi: string, pinyin: string) => void;
  onUpdateSubtitles?: (rawSubtitles: string) => void;
  videoId?: string;
  videoTitle?: string;
  thumbnailUrl?: string;
}

export const VideoTranscriptSidebar: React.FC<VideoTranscriptSidebarProps> = ({
  subtitles,
  activeCueIndex,
  onSelectCue,
  onOpenPronunciation,
  onUpdateSubtitles,
  videoId = 'video-studio',
  videoTitle = 'Video Studio',
  thumbnailUrl,
}) => {
  const [onlyHardHsk, setOnlyHardHsk] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(() => new Set());
  const [minedCueIndices, setMinedCueIndices] = useState<Record<number, boolean>>({});
  const [miningCueIndex, setMiningCueIndex] = useState<number | null>(null);
  const [draftSubtitles, setDraftSubtitles] = useState('');
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    let active = true;
    getUserKnownWordsSet().then((set) => {
      if (active) setKnownWords(set);
    });
    return () => {
      active = false;
    };
  }, []);

  const cueAnalyses = useMemo(() => {
    const map = new Map<number, AnalyzedSentenceResult>();
    if (knownWords.size === 0) return map;
    for (const cue of subtitles) {
      map.set(
        cue.cue_index,
        analyzeSentenceComprehensibility(
          {
            sentence_zh: cue.zh_raw,
            sentence_pinyin: cue.pinyin_full,
            sentence_vi: cue.vi_translation,
            tokens: cue.tokens,
            media_context: {
              source_module: 'video',
              source_id: videoId,
              source_title: videoTitle,
              video_id: videoId,
              start_ms: cue.start_ms,
              end_ms: cue.end_ms,
              snapshot_image_url: thumbnailUrl,
            },
          },
          knownWords
        )
      );
    }
    return map;
  }, [subtitles, knownWords, videoId, videoTitle, thumbnailUrl]);

  const handleMineCue = async (cueIndex: number, analysis: AnalyzedSentenceResult) => {
    if (miningCueIndex !== null || minedCueIndices[cueIndex]) return;
    setMiningCueIndex(cueIndex);
    try {
      await mineSentenceToMultimediaCard({ analyzed: analysis });
      setMinedCueIndices((prev) => ({ ...prev, [cueIndex]: true }));
    } finally {
      setMiningCueIndex(null);
    }
  };

  useEffect(() => {
    const el = itemRefs.current[activeCueIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeCueIndex]);

  const displayedCues = onlyHardHsk
    ? subtitles.filter((cue) => cue.tokens.some((t) => (t.hsk_level ?? 1) >= 3))
    : subtitles;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-[560px]">
      {/* Header & Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Lời thoại tương tác</h3>
          <p className="text-[11px] text-slate-500">{subtitles.length} câu thoại đồng bộ</p>
        </div>

        <button
          type="button"
          onClick={() => setOnlyHardHsk((v) => !v)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            onlyHardHsk
              ? 'bg-sky-50 border-sky-300 text-sky-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3 h-3" />
          {onlyHardHsk ? 'Đang lọc từ khó HSK' : 'Hiện tất cả'}
        </button>
      </div>

      {/* Cues List or Empty Subtitles State */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {subtitles.length === 0 ? (
          <div className="h-full flex flex-col justify-center space-y-3 text-center px-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Video này chưa có phụ đề tương tác</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bạn có thể xem video trực tiếp (bật CC trên YouTube) hoặc dán phụ đề `.srt`, `.vtt` hoặc từng dòng tiếng Trung vào đây:
              </p>
            </div>
            {onUpdateSubtitles && (
              <div className="space-y-2 text-left">
                <textarea
                  value={draftSubtitles}
                  onChange={(e) => setDraftSubtitles(e.target.value)}
                  rows={6}
                  placeholder={`Ví dụ:\n1\n00:00:01,000 --> 00:00:05,000\n你好，欢迎来到我的频道。\nXin chào, chào mừng đến với kênh của tôi.\n\nHoặc mỗi dòng 1 câu:\n今天天气很好 | Hôm nay thời tiết rất đẹp`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!draftSubtitles.trim()}
                  onClick={() => {
                    onUpdateSubtitles(draftSubtitles);
                    setDraftSubtitles('');
                  }}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold py-2 transition"
                >
                  Nạp phụ đề vào video
                </button>
              </div>
            )}
          </div>
        ) : (
          displayedCues.map((cue) => {
          const isActive = cue.cue_index === activeCueIndex;
          const analysis = cueAnalyses.get(cue.cue_index);
          const isIPlusOne = Boolean(analysis?.is_i_plus_one);
          const isMined = Boolean(minedCueIndices[cue.cue_index]);
          const isMining = miningCueIndex === cue.cue_index;

          return (
            <div
              key={cue.cue_index}
              ref={(el) => {
                itemRefs.current[cue.cue_index] = el;
              }}
              onClick={() => onSelectCue(cue.cue_index)}
              className={`rounded-2xl border p-3 cursor-pointer transition space-y-1 ${
                isActive
                  ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-300 shadow-sm'
                  : isIPlusOne
                    ? 'bg-amber-50/40 border-amber-400 hover:bg-amber-50/70'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-700">#{cue.cue_index + 1}</span>
                  {isIPlusOne && analysis?.target_word && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-sans text-[10px] font-bold text-amber-800">
                      i+1 · {analysis.target_word}
                    </span>
                  )}
                </div>
                <span>{(cue.start_ms / 1000).toFixed(1)}s</span>
              </div>

              <div className="text-sm font-bold text-slate-900">{cue.zh_raw}</div>
              <div className="text-xs text-slate-500 leading-snug">{cue.pinyin_full}</div>
              <div className="text-xs text-slate-600 leading-snug">{cue.vi_translation}</div>

              {cue.grammar_notes && cue.grammar_notes.length > 0 && (
                <div className="text-[11px] text-indigo-700 bg-indigo-50/80 rounded-lg p-1.5 mt-1 font-medium">
                  {cue.grammar_notes[0]}
                </div>
              )}

              <div className="flex items-center justify-end gap-1 pt-1">
                {isIPlusOne && analysis && (
                  <button
                    type="button"
                    disabled={isMining || isMined}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleMineCue(cue.cue_index, analysis);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                      isMined
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                    title="Đào câu i+1 này thành thẻ Cloze đa phương tiện"
                  >
                    {isMined ? <Check className="w-3 h-3" /> : <Pickaxe className="w-3 h-3" />}
                    {isMined ? 'Đã đào i+1' : isMining ? 'Đang lưu...' : 'Mine i+1'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakChinese(cue.zh_raw, 0.85);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                  title="Nghe câu này"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {onOpenPronunciation && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPronunciation(cue.zh_raw, cue.pinyin_full);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100"
                    title="Nhại theo diễn viên (Shadowing)"
                  >
                    <Mic className="w-3 h-3" />
                    Nhại âm
                  </button>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

