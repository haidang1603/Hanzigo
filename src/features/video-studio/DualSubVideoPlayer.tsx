import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat1,
  BookmarkPlus,
  Volume2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Mic,
} from 'lucide-react';
import type {
  ImmersionVideo,
  SubtitleCue,
  SubtitleCueToken,
} from '../../services/videoStudioService.ts';
import { mineVideoSentenceToSRS } from '../../services/videoStudioService.ts';
import { useInteractiveVideoPlayer } from './useInteractiveVideoPlayer.ts';
import { speakChinese } from '../../utils/audio.js';

interface DualSubVideoPlayerProps {
  video: ImmersionVideo;
  user?: { id?: string | null } | null;
  onOpenDictionary?: (hanzi: string) => void;
  onOpenPronunciation?: (hanzi: string, pinyin: string) => void;
  onCueChange?: (cueIndex: number) => void;
}

function getHskUnderlineColor(level?: number): string {
  if (!level) return 'border-b-2 border-slate-300';
  if (level <= 2) return 'border-b-2 border-emerald-400';
  if (level <= 4) return 'border-b-2 border-sky-400';
  if (level <= 6) return 'border-b-2 border-amber-400';
  return 'border-b-2 border-rose-400';
}

export const DualSubVideoPlayer: React.FC<DualSubVideoPlayerProps> = ({
  video,
  user,
  onOpenDictionary,
  onOpenPronunciation,
  onCueChange,
}) => {
  const {
    videoElementRef,
    iframeRef,
    activeCueIndex,
    isPlaying,
    playbackSpeed,
    isLoopingCurrentCue,
    setIsLoopingCurrentCue,
    setPlaybackSpeed,
    togglePlay,
    pause,
    prevCue,
    nextCue,
    replayCurrentCue,
    handleSubtitleMouseEnter,
    handleSubtitleMouseLeave,
  } = useInteractiveVideoPlayer({
    video,
    onTimeUpdate: () => {},
  });

  const [pinyinVisibility, setPinyinVisibility] = useState<'all' | 'hard_only' | 'off'>('all');
  const [blurTranslation, setBlurTranslation] = useState(false);
  const [selectedToken, setSelectedToken] = useState<SubtitleCueToken | null>(null);
  const [savedTokenSet, setSavedTokenSet] = useState<Set<string>>(() => new Set());
  const [isMining, setIsMining] = useState(false);

  const activeCue: SubtitleCue | undefined = video.subtitles[activeCueIndex];

  useEffect(() => {
    if (activeCueIndex >= 0) {
      onCueChange?.(activeCueIndex);
    }
  }, [activeCueIndex, onCueChange]);

  // Keyboard shortcuts: Space (Play/Pause), A (Prev), D (Next), S (Replay), L (Loop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        prevCue();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        nextCue();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        replayCurrentCue();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLoopingCurrentCue((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, prevCue, nextCue, replayCurrentCue, setIsLoopingCurrentCue]);

  const handleTokenClick = (tok: SubtitleCueToken) => {
    pause();
    setSelectedToken(tok);
  };

  const handleMineToken = async (tok: SubtitleCueToken) => {
    if (!activeCue) return;
    setIsMining(true);
    try {
      await mineVideoSentenceToSRS({
        video,
        cue: activeCue,
        token: tok,
        user,
      });
      setSavedTokenSet((prev) => new Set(prev).add(tok.text));
    } finally {
      setIsMining(false);
    }
  };

  const shouldShowPinyin = (tok: SubtitleCueToken): boolean => {
    if (tok.is_punctuation || !tok.pinyin) return false;
    if (pinyinVisibility === 'off') return false;
    if (pinyinVisibility === 'all') return true;
    return (tok.hsk_level ?? 4) >= 3;
  };

  return (
    <div className="space-y-4">
      {/* Video Container with Overlays */}
      <div
        className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group"
        onMouseEnter={handleSubtitleMouseEnter}
        onMouseLeave={() => handleSubtitleMouseLeave(Boolean(selectedToken))}
      >
        {video.source_type === 'youtube' ? (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${video.external_video_id}?enablejsapi=1&controls=0&rel=0&modestbranding=1`}
            title={video.title_zh}
            className="w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video
            ref={videoElementRef}
            src={video.external_video_id}
            className="w-full h-full object-cover"
          />
        )}

        {/* Top Video Header Overlay */}
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/80 uppercase">
              HSK {video.hsk_level}
            </span>
            <span className="text-sm font-semibold ml-2">{video.title_zh}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setPinyinVisibility((v) => (v === 'all' ? 'hard_only' : v === 'hard_only' ? 'off' : 'all'))
              }
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur transition"
            >
              Pinyin: {pinyinVisibility === 'all' ? 'Tất cả' : pinyinVisibility === 'hard_only' ? 'Từ khó' : 'Tắt'}
            </button>
            <button
              type="button"
              onClick={() => setBlurTranslation((v) => !v)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur transition flex items-center gap-1"
            >
              {blurTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {blurTranslation ? 'Che dịch' : 'Hiện dịch'}
            </button>
          </div>
        </div>

        {/* Interactive Subtitle Overlay Bar */}
        <div className="absolute bottom-3 inset-x-4 bg-black/75 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 shadow-2xl space-y-1.5">
          {activeCue ? (
            <>
              {/* Hanzi line with Pinyin ruby */}
              <div className="text-2xl sm:text-3xl font-bold text-white flex flex-wrap items-center justify-center gap-x-1 gap-y-1 leading-relaxed">
                {activeCue.tokens.map((tok, idx) =>
                  tok.is_punctuation ? (
                    <span key={`punc-${idx}`} className="text-white/80">
                      {tok.text}
                    </span>
                  ) : (
                    <button
                      key={`tok-${idx}`}
                      type="button"
                      onClick={() => handleTokenClick(tok)}
                      className={`inline-flex flex-col items-center rounded px-1 transition hover:bg-white/20 cursor-pointer ${getHskUnderlineColor(
                        tok.hsk_level
                      )}`}
                    >
                      <ruby className="ruby-align-center">
                        <span className="text-white">{tok.text}</span>
                        {shouldShowPinyin(tok) && (
                          <rt className="text-xs font-normal text-emerald-300 select-none pb-0.5">
                            {tok.pinyin}
                          </rt>
                        )}
                      </ruby>
                    </button>
                  )
                )}
              </div>

              {/* Vietnamese Translation Line */}
              <p
                className={`text-sm text-slate-200 transition duration-200 ${
                  blurTranslation ? 'blur-xs hover:blur-none select-none' : ''
                }`}
              >
                {activeCue.vi_translation}
              </p>
            </>
          ) : (
            <p className="text-sm text-white/50 py-2">Đang phát video tiếng Trung...</p>
          )}
        </div>
      </div>

      {/* Quick Word Lookup Popover */}
      {selectedToken && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">{selectedToken.text}</span>
              <span className="text-sm font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {selectedToken.pinyin}
              </span>
              {selectedToken.hsk_level && (
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  HSK {selectedToken.hsk_level}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700">
              {selectedToken.meaning_vi || 'Từ vựng trong đoạn hội thoại video.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => speakChinese(selectedToken.text, 0.85)}
              className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              Nghe
            </button>

            {onOpenDictionary && (
              <button
                type="button"
                onClick={() => onOpenDictionary(selectedToken.text)}
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Tra từ điển
              </button>
            )}

            {onOpenPronunciation && (
              <button
                type="button"
                onClick={() => onOpenPronunciation(selectedToken.text, selectedToken.pinyin)}
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                Luyện âm
              </button>
            )}

            <button
              type="button"
              disabled={isMining}
              onClick={() => handleMineToken(selectedToken)}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-semibold"
            >
              {savedTokenSet.has(selectedToken.text) ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Đã lưu vào SRS
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  Lưu từ + Ngữ cảnh
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSelectedToken(null)}
              className="text-xs text-slate-500 hover:text-slate-800 ml-1"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Control Deck */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevCue}
            title="Lùi 1 câu thoại (A)"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            title="Phát/Tạm dừng (Space)"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          </button>

          <button
            type="button"
            onClick={nextCue}
            title="Tiến 1 câu thoại (D)"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={replayCurrentCue}
            title="Nghe lại câu hiện tại (S)"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Nghe lại câu
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLoopingCurrentCue((v) => !v)}
            title="Lặp câu thoại hiện tại (L)"
            className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isLoopingCurrentCue
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Repeat1 className="w-3.5 h-3.5" />
            Lặp câu [L]
          </button>

          {/* Speed Selector */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  playbackSpeed === spd
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
        <span>Phím tắt: <strong>Space</strong> Play/Pause</span>
        <span><strong>A</strong> Lùi câu</span>
        <span><strong>D</strong> Tiến câu</span>
        <span><strong>S</strong> Nghe lại</span>
        <span><strong>L</strong> Lặp câu thoại</span>
      </div>
    </div>
  );
};
