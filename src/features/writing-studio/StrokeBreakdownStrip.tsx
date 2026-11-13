import React from 'react';
import type { CharacterStrokeData } from './useHanziWriterStudio.ts';

export interface StrokeBreakdownStripProps {
  character: string;
  strokeData: CharacterStrokeData | null;
  completedStrokes: number;
  mistakenStrokeIndices: number[];
}

/**
 * Step-by-step fan-out progression strip:
 * Frame 1: Stroke 1 -> Frame 2: Strokes 1..2 -> Frame 3: Strokes 1..3 ...
 * Mistaken strokes from the active practice session are highlighted in red (#EF4444).
 */
export default function StrokeBreakdownStrip({
  character,
  strokeData,
  completedStrokes,
  mistakenStrokeIndices,
}: StrokeBreakdownStripProps) {
  const strokes = strokeData?.strokes ?? [];

  if (strokes.length === 0) {
    return (
      <div className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs text-[#748092] text-center">
        Đang tải dữ liệu nét bút thuận cho chữ "{character}"...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#243447] dark:text-white">
          Bút thuận từng nét ({strokes.length} nét)
        </span>
        {mistakenStrokeIndices.length > 0 && (
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
            Nét viết sai: {mistakenStrokeIndices.map((i) => `#${i + 1}`).join(', ')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {strokes.map((_, stepIdx) => {
          const isStepMistaken = mistakenStrokeIndices.includes(stepIdx);
          const isStepDone = stepIdx < completedStrokes;
          return (
            <div
              key={stepIdx}
              className={`shrink-0 p-1.5 rounded-xl border transition-colors flex flex-col items-center gap-1 ${
                isStepMistaken
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400'
                  : isStepDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400/70'
                  : 'bg-white dark:bg-[#1E293B] border-[#EFE4D6] dark:border-[#2B3A4F]'
              }`}
              title={`Bước ${stepIdx + 1}${isStepMistaken ? ' (viết sai nét này)' : ''}`}
            >
              <svg
                viewBox="0 0 1024 1024"
                className="w-11 h-11"
                aria-label={`Nét ${stepIdx + 1}`}
              >
                <g transform="scale(1, -1) translate(0, -900)">
                  {strokes.slice(0, stepIdx + 1).map((pathD, pathIdx) => {
                    const isCurrent = pathIdx === stepIdx;
                    const isMistaken = mistakenStrokeIndices.includes(pathIdx);
                    const fill = isMistaken
                      ? '#EF4444'
                      : isCurrent
                      ? '#E85D3F'
                      : '#64748B';
                    return (
                      <path
                        key={pathIdx}
                        d={pathD}
                        fill={fill}
                        opacity={isCurrent || isMistaken ? 1 : 0.65}
                      />
                    );
                  })}
                </g>
              </svg>
              <span
                className={`text-[10px] font-bold ${
                  isStepMistaken
                    ? 'text-rose-600 dark:text-rose-400'
                    : isStepDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-[#748092]'
                }`}
              >
                {stepIdx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

