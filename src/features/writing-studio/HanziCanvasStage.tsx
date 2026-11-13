import React from 'react';
import {
  Eye,
  EyeOff,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type {
  GridType,
  StrokeAccuracyResult,
  WritingMode,
} from '../../services/writingStudioService.ts';

export interface HanziCanvasStageProps {
  character: string;
  word?: string;
  pinyin?: string;
  meaning?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  mode: WritingMode;
  onModeChange: (mode: WritingMode) => void;
  gridType: GridType;
  onGridTypeChange: (grid: GridType) => void;
  leniency: number;
  onLeniencyChange: (leniency: number) => void;
  strokeAnimationSpeed: number;
  onSpeedChange: (speed: number) => void;
  mistakeCount: number;
  completedStrokes: number;
  totalStrokes: number;
  lastAccuracy: StrokeAccuracyResult | null;
  isQuizComplete: boolean;
  onAnimate: () => void;
  onRestart: () => void;
  onHint: () => void;
  onPlayAudio: () => void;
}

const GRID_OPTIONS: Array<{ id: GridType; label: string }> = [
  { id: 'mizige', label: '米字格' },
  { id: 'tianzige', label: '田字格' },
  { id: 'jiugongge', label: '九宫格' },
];

const MODE_OPTIONS: Array<{ id: WritingMode; label: string; desc: string }> = [
  { id: 'guided', label: 'Tập đồ nét', desc: 'Hiện bóng chữ mờ dẫn hướng' },
  { id: 'recall', label: 'Nhớ mặt chữ', desc: 'Ẩn chữ, chỉ hiện Pinyin + Nghĩa' },
  { id: 'dictation', label: 'Nghe viết', desc: 'Chỉ phát âm thanh, tự nhớ và viết' },
];

function GridOverlaySvg({ gridType }: { gridType: GridType }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx="4"
        fill="none"
        stroke="#E85D3F"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      {(gridType === 'mizige' || gridType === 'tianzige') && (
        <>
          <line
            x1="50"
            y1="1"
            x2="50"
            y2="99"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
          <line
            x1="1"
            y1="50"
            x2="99"
            y2="50"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
        </>
      )}
      {gridType === 'mizige' && (
        <>
          <line
            x1="1"
            y1="1"
            x2="99"
            y2="99"
            stroke="#94A3B8"
            strokeOpacity="0.35"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.6"
          />
          <line
            x1="99"
            y1="1"
            x2="1"
            y2="99"
            stroke="#94A3B8"
            strokeOpacity="0.35"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.6"
          />
        </>
      )}
      {gridType === 'jiugongge' && (
        <>
          <line
            x1="33.3"
            y1="1"
            x2="33.3"
            y2="99"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
          <line
            x1="66.6"
            y1="1"
            x2="66.6"
            y2="99"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
          <line
            x1="1"
            y1="33.3"
            x2="99"
            y2="33.3"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
          <line
            x1="1"
            y1="66.6"
            x2="99"
            y2="66.6"
            stroke="#94A3B8"
            strokeOpacity="0.45"
            strokeDasharray="2.5 2.5"
            strokeWidth="0.7"
          />
        </>
      )}
    </svg>
  );
}

export default function HanziCanvasStage({
  character,
  word = '',
  pinyin = '',
  meaning = '',
  containerRef,
  mode,
  onModeChange,
  gridType,
  onGridTypeChange,
  leniency,
  onLeniencyChange,
  strokeAnimationSpeed,
  onSpeedChange,
  mistakeCount,
  completedStrokes,
  totalStrokes,
  lastAccuracy,
  isQuizComplete,
  onAnimate,
  onRestart,
  onHint,
  onPlayAudio,
}: HanziCanvasStageProps) {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-5">
      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {MODE_OPTIONS.map((opt) => {
          const active = mode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onModeChange(opt.id)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                active
                  ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-sm'
                  : 'bg-[#FAF6F0] dark:bg-[#0F172A] border-[#EFE4D6] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]/60'
              }`}
            >
              <div className="text-xs font-extrabold flex items-center gap-1.5">
                {opt.id === 'guided' && <Eye size={13} />}
                {opt.id === 'recall' && <EyeOff size={13} />}
                {opt.id === 'dictation' && <Volume2 size={13} />}
                <span>{opt.label}</span>
              </div>
              <div
                className={`text-[11px] mt-0.5 ${
                  active ? 'text-white/90' : 'text-[#748092] dark:text-slate-400'
                }`}
              >
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Prompt Header (varies by mode) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F]">
        <div className="space-y-0.5">
          {mode === 'dictation' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPlayAudio}
                className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Volume2 size={14} />
                <span>Nghe phát âm để viết</span>
              </button>
              <span className="text-xs text-[#748092]">
                Ẩn chữ & Pinyin — tự nhớ mặt chữ
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline gap-2.5">
              {mode === 'guided' && (
                <span className="text-2xl font-black text-[#243447] dark:text-white">
                  {character}
                </span>
              )}
              {word && word !== character && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E293B] text-[#5B6B7F] dark:text-slate-300 border border-[#EFE4D6] dark:border-[#2B3A4F]">
                  Từ: {mode === 'recall' ? word.replaceAll(character, '□') : word}
                </span>
              )}
              {pinyin && (
                <span className="text-sm font-extrabold text-[#E85D3F]">{pinyin}</span>
              )}
              {meaning && (
                <span className="text-xs text-[#5B6B7F] dark:text-slate-300">
                  {meaning}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#243447] dark:text-white">
            Nét: {completedStrokes}/{totalStrokes || '?'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg ${
              mistakeCount > 0
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
            }`}
          >
            Lỗi: {mistakeCount}
          </span>
        </div>
      </div>

      {/* Main Responsive Canvas Stage (320px - 420px) */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] lg:w-[400px] lg:h-[400px] rounded-2xl bg-[#FFFDF9] dark:bg-[#0F172A] shadow-inner flex items-center justify-center overflow-hidden">
          <GridOverlaySvg gridType={gridType} />
          <div
            ref={containerRef}
            className="relative z-10 flex items-center justify-center"
            aria-label={`Khung tập viết chữ ${character}`}
          />
        </div>

        {/* Completion Feedback Banner */}
        {isQuizComplete && lastAccuracy && (
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                  Hoàn thành chữ "{character}" · Độ chính xác {lastAccuracy.accuracyScore}%
                </div>
                <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                  {lastAccuracy.totalMistakes === 0
                    ? 'Xuất sắc! Không sai nét nào.'
                    : `Sai ${lastAccuracy.totalMistakes} lần${
                        lastAccuracy.mistakenStrokeIndices.length > 0
                          ? ` (nét ${lastAccuracy.mistakenStrokeIndices
                              .map((i) => `#${i + 1}`)
                              .join(', ')})`
                          : ''
                      }.`}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onRestart}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shrink-0"
            >
              Viết lại
            </button>
          </div>
        )}
      </div>

      {/* Controls Toolbar: Grid, Leniency, Speed & Actions */}
      <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAnimate}
            className="px-3 py-1.5 rounded-xl bg-[#243447] hover:bg-[#1a2636] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Play size={13} />
            <span>Xem mẫu</span>
          </button>

          <button
            type="button"
            onClick={onHint}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <HelpCircle size={13} />
            <span>Gợi ý nét</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={onPlayAudio}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Volume2 size={13} className="text-[#E85D3F]" />
            <span>Phát âm</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Grid selector */}
          <div className="inline-flex rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] p-0.5 border border-[#EFE4D6] dark:border-[#2B3A4F]">
            {GRID_OPTIONS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onGridTypeChange(g.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                  gridType === g.id
                    ? 'bg-[#E85D3F] text-white'
                    : 'text-[#5B6B7F] dark:text-slate-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Leniency selector */}
          <select
            aria-label="Độ khắt khe chấm nét"
            value={String(leniency)}
            onChange={(e) => onLeniencyChange(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold cursor-pointer"
          >
            <option value="1">Chấm dễ (1.0)</option>
            <option value="0.75">Chấm chặt (0.75)</option>
          </select>

          {/* Speed selector */}
          <select
            aria-label="Tốc độ nét mẫu"
            value={String(strokeAnimationSpeed)}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold cursor-pointer"
          >
            <option value="0.7">0.7x</option>
            <option value="1">1.0x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>
    </div>
  );
}

