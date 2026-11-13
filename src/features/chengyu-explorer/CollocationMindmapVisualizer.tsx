import React, { useState } from 'react';
import {
  Volume2,
  AlertTriangle,
  GitBranch,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import type {
  WordCollocationHub,
  CollocationPatternType,
} from '../../services/chengyuCollocationService.ts';

interface CollocationMindmapVisualizerProps {
  hub: WordCollocationHub;
}

const PATTERN_META: Record<
  CollocationPatternType,
  {
    labelVi: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    cardBg: string;
  }
> = {
  'Verb + Noun': {
    labelVi: 'Động – Tân (Verb + Noun)',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    border: 'border-emerald-200',
    cardBg: 'bg-emerald-50/50',
  },
  'Adv + Verb': {
    labelVi: 'Trạng – Động (Adv + Verb)',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    border: 'border-sky-200',
    cardBg: 'bg-sky-50/50',
  },
  'Adj + Noun': {
    labelVi: 'Định – Trung (Adj + Noun)',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-800',
    border: 'border-violet-200',
    cardBg: 'bg-violet-50/50',
  },
  'MeasureWord + Noun': {
    labelVi: 'Lượng – Danh (Measure + Noun)',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    border: 'border-amber-200',
    cardBg: 'bg-amber-50/50',
  },
};

export const CollocationMindmapVisualizer: React.FC<CollocationMindmapVisualizerProps> = ({
  hub,
}) => {
  const [activeFilter, setActiveFilter] = useState<CollocationPatternType | 'all'>('all');

  const patternTypes = Array.from(
    new Set(hub.collocation_patterns.map((p) => p.pattern_type))
  );

  const visiblePatterns =
    activeFilter === 'all'
      ? hub.collocation_patterns
      : hub.collocation_patterns.filter((p) => p.pattern_type === activeFilter);

  const buildSpeakPhrase = (collocateZh: string, patternType: CollocationPatternType): string => {
    const clean = collocateZh.replace(/\s*\+\s*/g, '').split('/')[0].trim();
    if (clean.includes(hub.core_word)) return clean;
    if (patternType === 'Adv + Verb' || patternType === 'MeasureWord + Noun') {
      return `${clean}${hub.core_word}`;
    }
    return `${hub.core_word}${clean}`;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Pattern Filter Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <GitBranch className="w-4 h-4 text-emerald-600" />
          <span>Sơ đồ Kết hợp từ (Collocation Mindmap)</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({hub.collocation_patterns.length})
          </button>
          {patternTypes.map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setActiveFilter(pt)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                activeFilter === pt
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Mindmap Canvas */}
      <div className="p-5 sm:p-7 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:18px_18px] space-y-6">
        {/* Central Core Word Hub */}
        <div className="flex flex-col items-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white px-7 py-5 shadow-xl border-4 border-emerald-400/30 max-w-md w-full text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                HSK {hub.hsk_level}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
                {hub.pos}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <h3 className="text-3xl sm:text-4xl font-black tracking-wide">
                {hub.core_word}
              </h3>
              <button
                type="button"
                onClick={() => speakChinese(hub.core_word, 0.85)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-300 transition cursor-pointer"
                title="Nghe từ trung tâm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-semibold text-emerald-300">{hub.pinyin}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{hub.meaning_vi}</p>
          </div>

          {/* Vertical connector stem */}
          <div className="w-0.5 h-6 bg-emerald-400/70" />
          <div className="w-3/4 max-w-xl h-0.5 bg-emerald-300/70 rounded-full" />
        </div>

        {/* Collocation Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePatterns.map((pattern, idx) => {
            const meta = PATTERN_META[pattern.pattern_type];
            const phraseToSpeak = buildSpeakPhrase(pattern.collocate_zh, pattern.pattern_type);

            return (
              <div
                key={`${pattern.collocate_zh}-${idx}`}
                className={`rounded-2xl border ${meta.border} ${meta.cardBg} bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}
                    >
                      {meta.labelVi}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakChinese(phraseToSpeak, 0.85)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition cursor-pointer"
                      title={`Nghe cụm: ${phraseToSpeak}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900">
                        {pattern.pattern_type === 'Adv + Verb' ||
                        pattern.pattern_type === 'MeasureWord + Noun'
                          ? pattern.collocate_zh
                          : `${hub.core_word} + ${pattern.collocate_zh}`}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {pattern.collocate_pinyin}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pattern.full_phrase_vi}</span>
                  </div>
                </div>

                {/* Common Vietnamese Interference Warning */}
                {pattern.common_vietnamese_error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 flex items-start gap-2 text-[11px] text-rose-800 leading-snug">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Cảnh báo lỗi dịch Việt-Trung:</strong> {pattern.common_vietnamese_error}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Học theo cụm cố định (搭配) giúp diễn đạt tự nhiên và đạt điểm cao ở phần Viết HSK 4–6.</span>
        </div>
      </div>
    </div>
  );
};

