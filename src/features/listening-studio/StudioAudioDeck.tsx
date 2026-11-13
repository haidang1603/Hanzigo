import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Repeat,
  Repeat1,
  Gauge,
} from 'lucide-react';
import type { TranscriptSegment } from '../../services/listeningStudioService.ts';
import type { AbLoopRange, LoopMode, PlaybackSpeed } from './usePrecisionAudioPlayer.ts';

interface StudioAudioDeckProps {
  segments: TranscriptSegment[];
  isPlaying: boolean;
  currentTimeMs: number;
  totalDurationMs: number;
  activeSegmentIndex: number;
  playbackRate: PlaybackSpeed;
  loopMode: LoopMode;
  abRange: AbLoopRange;
  onTogglePlay: () => void;
  onPrevSegment: () => void;
  onNextSegment: () => void;
  onReplaySegment: () => void;
  onSeekMs: (ms: number) => void;
  onSetPlaybackRate: (rate: PlaybackSpeed) => void;
  onSetLoopMode: (mode: LoopMode) => void;
  onSetAbRange: (startIdx: number, endIdx: number) => void;
}

const SPEED_OPTIONS: PlaybackSpeed[] = [0.6, 0.8, 1.0, 1.25, 1.5];

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const StudioAudioDeck: React.FC<StudioAudioDeckProps> = ({
  segments,
  isPlaying,
  currentTimeMs,
  totalDurationMs,
  activeSegmentIndex,
  playbackRate,
  loopMode,
  abRange,
  onTogglePlay,
  onPrevSegment,
  onNextSegment,
  onReplaySegment,
  onSeekMs,
  onSetPlaybackRate,
  onSetLoopMode,
  onSetAbRange,
}) => {
  // Keyboard shortcuts: Space (Play/Pause), ArrowLeft (Prev), ArrowRight (Next), R (Replay)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrevSegment();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNextSegment();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReplaySegment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onPrevSegment, onNextSegment, onReplaySegment]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      {/* Progress Scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-500 w-11">
          {formatTime(currentTimeMs)}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(1000, totalDurationMs)}
          step={100}
          value={Math.min(currentTimeMs, totalDurationMs)}
          onChange={(e) => onSeekMs(Number(e.target.value))}
          aria-label="Tiến độ audio"
          className="flex-1 accent-emerald-600 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-500 w-11 text-right">
          {formatTime(totalDurationMs)}
        </span>
      </div>

      {/* Main Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevSegment}
            title="Lùi 1 câu (ArrowLeft)"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            title="Phát / Tạm dừng (Space)"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Tạm dừng' : 'Phát'}
          </button>

          <button
            type="button"
            onClick={onNextSegment}
            title="Tiến 1 câu (ArrowRight)"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReplaySegment}
            title="Nghe lại câu hiện tại (R)"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Nghe lại câu {activeSegmentIndex + 1}
          </button>
        </div>

        {/* Loop & Speed Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSetLoopMode(loopMode === 'single' ? 'none' : 'single')}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
              loopMode === 'single'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Repeat1 className="w-3.5 h-3.5" />
            Lặp câu
          </button>

          <button
            type="button"
            onClick={() => onSetLoopMode(loopMode === 'ab' ? 'none' : 'ab')}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
              loopMode === 'ab'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            A-B Loop
          </button>

          {loopMode === 'ab' && segments.length > 0 && (
            <div className="flex items-center gap-1 text-xs bg-indigo-50/70 border border-indigo-200 rounded-xl px-2 py-1">
              <span className="text-indigo-700 font-semibold">A:</span>
              <select
                value={abRange.startIndex}
                onChange={(e) => onSetAbRange(Number(e.target.value), abRange.endIndex)}
                className="bg-white rounded border border-indigo-200 px-1 py-0.5 text-xs"
              >
                {segments.map((s) => (
                  <option key={`a-${s.index}`} value={s.index}>
                    Câu {s.index + 1}
                  </option>
                ))}
              </select>
              <span className="text-indigo-700 font-semibold">B:</span>
              <select
                value={abRange.endIndex}
                onChange={(e) => onSetAbRange(abRange.startIndex, Number(e.target.value))}
                className="bg-white rounded border border-indigo-200 px-1 py-0.5 text-xs"
              >
                {segments.map((s) => (
                  <option key={`b-${s.index}`} value={s.index}>
                    Câu {s.index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed Selector */}
          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            {SPEED_OPTIONS.map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSetPlaybackRate(spd)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                  playbackRate === spd
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
        <span>Phím tắt: <strong>Space</strong> Phát/Dừng</span>
        <span><strong>← / →</strong> Lùi/Tiến câu</span>
        <span><strong>R</strong> Nghe lại câu</span>
        <span><strong>Giữ H</strong> Tạm hiện chữ bị che</span>
      </div>
    </div>
  );
};

