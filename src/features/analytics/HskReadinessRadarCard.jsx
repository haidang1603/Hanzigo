import React, { useMemo } from 'react';
import { Award, ShieldCheck, ArrowRight } from 'lucide-react';

const CENTER = 110;
const RADIUS = 74;

const SKILL_AXES = [
  { key: 'listening', label: 'Nghe hiểu' },
  { key: 'reading', label: 'Đọc hiểu' },
  { key: 'vocabulary', label: 'Từ vựng' },
  { key: 'grammar', label: 'Ngữ pháp' },
  { key: 'writing', label: 'Viết/Dịch' },
  { key: 'pronunciation', label: 'Thanh điệu' },
];

function polar(angle, radius) {
  return {
    x: Math.round((CENTER + radius * Math.cos(angle)) * 100) / 100,
    y: Math.round((CENTER + radius * Math.sin(angle)) * 100) / 100,
  };
}

export default function HskReadinessRadarCard({
  snapshot,
  targetHskLevel = 1,
  onLaunchExam,
}) {
  const axes = useMemo(() => {
    const tri = snapshot?.triDimensionalMastery || {};
    const avgLat = snapshot?.avg_response_latency_ms || {};
    const retention = Number(snapshot?.retention_rate_pct || 0);

    const scoreFromLatency = (ms, goldMs) => {
      if (!ms || ms <= 0) return 0;
      if (ms <= goldMs) return 88;
      return Math.max(25, Math.round((goldMs / ms) * 85));
    };

    const values = {
      listening: scoreFromLatency(avgLat.listening, 12000),
      reading: scoreFromLatency(avgLat.reading, 35000),
      vocabulary: Math.round(Number(tri.meaningPct || retention || 0)),
      grammar: scoreFromLatency(avgLat.grammar, 25000),
      writing: Math.round(Number(tri.writingPct || 0)),
      pronunciation: Math.round(Number(tri.pronunciationPct || 0)),
    };

    return SKILL_AXES.map((s, idx) => {
      const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / SKILL_AXES.length;
      const pct = Math.min(100, Math.max(0, values[s.key] || 0));
      const pt = polar(angle, (pct / 100) * RADIUS);
      const labelPt = polar(angle, RADIUS + 20);
      return { ...s, pct, pt, labelPt };
    });
  }, [snapshot]);

  const hasAnyRealData = useMemo(() => axes.some((a) => a.pct > 0), [axes]);

  const projectedScore300 = useMemo(() => {
    if (!hasAnyRealData) return 0;
    const avg = axes.reduce((acc, a) => acc + a.pct, 0) / axes.length;
    return Math.min(300, Math.max(0, Math.round((avg / 100) * 300)));
  }, [axes, hasAnyRealData]);

  const passThreshold = targetHskLevel >= 7 ? (targetHskLevel === 9 ? 240 : targetHskLevel === 8 ? 210 : 180) : 180;
  const isReady = hasAnyRealData && projectedScore300 >= passThreshold;
  const polygonPoints = axes.map((a) => `${a.pt.x},${a.pt.y}`).join(' ');

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-4 h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E85D3F]">
            <ShieldCheck size={13} /> HSK Readiness Radar
          </span>
          <h3 className="text-base font-black text-[#243447] dark:text-white mt-0.5">
            Năng lực 6 Kỹ năng · HSK {targetHskLevel}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#E85D3F] leading-none">
            {projectedScore300}<span className="text-xs text-[#748092] dark:text-[#94A3B8] font-bold">/300</span>
          </div>
          <span
            className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              !hasAnyRealData
                ? 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                : isReady
                ? 'bg-[#EBF8F2] dark:bg-emerald-950/50 text-[#45B97C] border border-emerald-200 dark:border-emerald-800'
                : 'bg-[#FEF7E9] dark:bg-amber-950/40 text-[#D97706] border border-amber-200 dark:border-amber-800'
            }`}
          >
            {!hasAnyRealData
              ? 'Chưa có dữ liệu đo'
              : isReady
              ? `Đạt ngưỡng đỗ (${passThreshold})`
              : `Mục tiêu đỗ: ${passThreshold}`}
          </span>
        </div>
      </div>

      {/* Pure SVG 6-Axis Radar */}
      <div className="flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          className="w-56 h-56 overflow-visible text-[#748092] dark:text-[#94A3B8]"
          role="img"
          aria-label="Biểu đồ Radar 6 kỹ năng dự báo điểm thi HSK"
        >
          {[0.33, 0.66, 1].map((scale) => {
            const pts = SKILL_AXES.map((_, idx) => {
              const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / SKILL_AXES.length;
              const p = polar(angle, RADIUS * scale);
              return `${p.x},${p.y}`;
            }).join(' ');
            return (
              <polygon
                key={scale}
                points={pts}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            );
          })}

          {axes.map((a, idx) => {
            const outerPt = polar(-Math.PI / 2 + (idx * 2 * Math.PI) / 6, RADIUS);
            return (
              <line
                key={a.key}
                x1={CENTER}
                y1={CENTER}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke="currentColor"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            );
          })}

          {hasAnyRealData && (
            <polygon
              points={polygonPoints}
              fill="#E85D3F"
              fillOpacity="0.2"
              stroke="#E85D3F"
              strokeWidth="2"
            />
          )}

          {axes.map((a) => (
            <g key={a.key}>
              {a.pct > 0 && <circle cx={a.pt.x} cy={a.pt.y} r="3.5" fill="#E85D3F" />}
              <text
                x={a.labelPt.x}
                y={a.labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8.5"
                fontWeight="bold"
                fill="currentColor"
              >
                {a.label} ({a.pct}%)
              </text>
            </g>
          ))}
        </svg>

        {!hasAnyRealData && (
          <p className="text-[11px] text-center text-[#748092] dark:text-[#94A3B8] mt-1">
            Chưa có dữ liệu thực tế — hoàn thành bài học hoặc làm đề thi thử để đo năng lực thật.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onLaunchExam?.()}
        className="w-full min-h-11 py-2.5 px-4 rounded-2xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Award size={15} />
        <span>Thi thử HSK {targetHskLevel} CBT ngay</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
