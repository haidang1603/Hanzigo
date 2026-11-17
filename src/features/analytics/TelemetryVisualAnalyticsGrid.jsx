import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Compass,
  Layers,
  Zap,
} from 'lucide-react';
import { CBT_SPEED_BENCHMARKS_MS } from './aiStudyPrescriptionEngine.js';

export default function TelemetryVisualAnalyticsGrid({
  snapshot,
  onSelectLevel,
  setActiveTab,
}) {
  const retentionPct = Math.min(100, Math.max(0, Number(snapshot?.retention_rate_pct || 0)));
  const eventsCount7d = Number(snapshot?.events_count_7d || 0);
  const forecast7d = Array.isArray(snapshot?.srs_forecast_7d) && snapshot.srs_forecast_7d.length === 7
    ? snapshot.srs_forecast_7d
    : Array.from({ length: 7 }, (_, i) => ({
        day_offset: i,
        label: i === 0 ? 'Hôm nay' : `N+${i}`,
        due_count: 0,
      }));

  const maxForecast = Math.max(1, ...forecast7d.map((d) => Number(d.due_count || 0)));
  const hasForecastData = forecast7d.some((d) => Number(d.due_count || 0) > 0);

  // Pure SVG Ebbinghaus curve path (only rendered when real retention data > 0)
  const ebbinghausPath = useMemo(() => {
    if (retentionPct <= 0) return '';
    const startY = 8 + ((100 - retentionPct) / 100) * 34;
    const points = [0, 1, 2, 3, 4, 5, 6].map((day) => {
      const x = 14 + day * 42;
      const decay = Math.exp(-day * 0.22);
      const y = 48 - (48 - startY) * decay;
      return `${x},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [retentionPct]);

  // Speed meter rows
  const speedRows = useMemo(() => {
    const avg = snapshot?.avg_response_latency_ms || {};
    return ['listening', 'grammar', 'reading', 'writing'].map((key) => {
      const bench = CBT_SPEED_BENCHMARKS_MS[key];
      const ms = Number(avg[key] || 0);
      const sec = ms > 0 ? Math.round((ms / 1000) * 10) / 10 : 0;
      const isOvertime = ms > bench.goldMs;
      const fillPct = ms > 0 ? Math.min(100, Math.round((ms / (bench.goldMs * 1.5)) * 100)) : 0;
      return {
        key,
        label: bench.label,
        goldSec: bench.goldSec,
        sec,
        isOvertime,
        fillPct,
      };
    });
  }, [snapshot?.avg_response_latency_ms]);

  const tri = snapshot?.triDimensionalMastery || {
    meaningPct: 0,
    writingPct: 0,
    pronunciationPct: 0,
    weakestDimension: 'writing',
    imbalanceNote: 'Chưa có dữ liệu sổ từ — hãy lưu hoặc ôn từ vựng đầu tiên để kích hoạt phân tích 3 chiều.',
  };

  const heatmap = Array.isArray(snapshot?.hskHeatmap) && snapshot.hskHeatmap.length === 9
    ? snapshot.hskHeatmap
    : Array.from({ length: 9 }, (_, i) => ({
        level: i + 1,
        label: `HSK ${i + 1}`,
        startLesson: i * 20 + 1,
        endLesson: (i + 1) * 20,
        completedCount: 0,
        totalLessons: 20,
        pct: 0,
      }));

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm p-5 sm:p-6 space-y-5 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FDEEEB] dark:bg-[#2D1E1B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-center text-[#E85D3F]">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-tight text-[#243447] dark:text-white">
              Telemetry Phân Tích Thời Gian Thực
            </h3>
            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              Đường cong trí nhớ SRS, tốc độ phản xạ CBT, cân bằng 3 chiều và tiến độ 180 bài HSK 1–9
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200">
            7 ngày: {eventsCount7d} lượt
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#EBF8F2] dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[#45B97C]">
            {snapshot?.total_active_minutes_7d ?? 0} phút
          </span>
        </div>
      </div>

      {/* 2x2 Visual Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Panel 1: Ebbinghaus Retention & 7-Day SRS Workload Forecast */}
        <div className="rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-[#E85D3F]" />
              <span className="text-xs font-extrabold text-[#243447] dark:text-white">
                Đường cong Ebbinghaus &amp; Dự báo SRS 7 ngày
              </span>
            </div>
            <span className="text-xs font-black text-[#E85D3F]">
              {retentionPct > 0 ? `Nhớ ${retentionPct}%` : 'Chưa có dữ liệu'}
            </span>
          </div>

          <svg
            viewBox="0 0 280 112"
            className="w-full h-28 overflow-visible text-[#748092] dark:text-[#94A3B8]"
            role="img"
            aria-label="Biểu đồ đường cong ghi nhớ Ebbinghaus và dự báo ôn tập 7 ngày"
          >
            {/* Gridlines */}
            <line x1="8" y1="50" x2="274" y2="50" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="8" y1="92" x2="274" y2="92" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

            {/* Ebbinghaus Curve */}
            {ebbinghausPath ? (
              <path
                d={ebbinghausPath}
                fill="none"
                stroke="#E85D3F"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : (
              <text x="140" y="30" textAnchor="middle" fontSize="8.5" fill="currentColor">
                Chưa có lịch sử ôn tập SRS
              </text>
            )}

            {/* 7-Day Forecast Bars */}
            {forecast7d.map((day, idx) => {
              const dueCount = Number(day.due_count || 0);
              const barH = dueCount > 0 ? Math.max(6, Math.round((dueCount / maxForecast) * 34)) : 2;
              const x = 14 + idx * 38;
              const y = 92 - barH;
              return (
                <g key={day.forecast_date || idx}>
                  <rect
                    x={x}
                    y={y}
                    width="20"
                    height={barH}
                    rx="4"
                    fill={dueCount > 0 ? (idx === 0 ? '#E85D3F' : '#45B97C') : 'currentColor'}
                    fillOpacity={dueCount > 0 ? (idx === 0 ? '0.95' : '0.65') : '0.2'}
                  />
                  {hasForecastData && (
                    <text
                      x={x + 10}
                      y={y - 3}
                      textAnchor="middle"
                      fontSize="8"
                      fill="currentColor"
                      fontWeight="bold"
                    >
                      {dueCount}
                    </text>
                  )}
                  <text
                    x={x + 10}
                    y="105"
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="currentColor"
                  >
                    {idx === 0 ? 'Nay' : `N+${idx}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel 2: Cognitive Response Speed Meter */}
        <div className="rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#3B82F6]" />
              <span className="text-xs font-extrabold text-[#243447] dark:text-white">
                Tốc độ Phản xạ CBT vs Chuẩn Vàng
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#748092] dark:text-[#94A3B8]">giây / câu</span>
          </div>

          <div className="space-y-2.5">
            {speedRows.map((row) => (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#243447] dark:text-slate-200">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    {row.isOvertime && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-[#D97706] dark:text-amber-300 text-[9px] font-bold">
                        <AlertTriangle size={10} /> Cháy giờ
                      </span>
                    )}
                    <span className={`font-bold ${row.isOvertime ? 'text-[#D97706]' : 'text-[#243447] dark:text-slate-200'}`}>
                      {row.sec > 0 ? `${row.sec}s` : '—'} / &lt;{row.goldSec}s
                    </span>
                  </div>
                </div>
                <svg viewBox="0 0 240 10" className="w-full h-2.5 text-[#E2D6C8] dark:text-slate-700">
                  <rect x="0" y="1" width="240" height="8" rx="4" fill="currentColor" fillOpacity="0.45" />
                  {row.fillPct > 0 && (
                    <rect
                      x="0"
                      y="1"
                      width={Math.max(4, Math.round((row.fillPct / 100) * 240))}
                      height="8"
                      rx="4"
                      fill={row.isOvertime ? '#D97706' : '#3B82F6'}
                    />
                  )}
                  <line x1="160" y1="0" x2="160" y2="10" stroke="#45B97C" strokeWidth="1.5" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Tri-Dimensional Mastery Balance */}
        <div className="rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-[#45B97C]" />
              <span className="text-xs font-extrabold text-[#243447] dark:text-white">
                Bản đồ Cân bằng 3 Chiều Từ vựng
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
              Ưu tiên: {tri.weakestDimension}
            </span>
          </div>

          <svg
            viewBox="0 0 280 78"
            className="w-full h-20 text-[#243447] dark:text-slate-200"
            role="img"
            aria-label="So sánh 3 chiều Nghĩa, Viết chữ Hán và Phát âm"
          >
            {[
              { label: 'Nghĩa (Meaning)', pct: tri.meaningPct, y: 8, color: '#45B97C' },
              { label: 'Chữ Hán (Writing)', pct: tri.writingPct, y: 32, color: '#E85D3F' },
              { label: 'Thanh điệu (Pron)', pct: tri.pronunciationPct, y: 56, color: '#3B82F6' },
            ].map((axis) => (
              <g key={axis.label}>
                <text x="0" y={axis.y + 10} fontSize="9.5" fill="currentColor" fontWeight="bold">
                  {axis.label}
                </text>
                <rect x="115" y={axis.y + 2} width="125" height="9" rx="4.5" fill="currentColor" fillOpacity="0.14" />
                {axis.pct > 0 && (
                  <rect
                    x="115"
                    y={axis.y + 2}
                    width={Math.round((Math.min(100, axis.pct) / 100) * 125)}
                    height="9"
                    rx="4.5"
                    fill={axis.color}
                  />
                )}
                <text x="248" y={axis.y + 10} fontSize="9.5" fill="currentColor" fontWeight="bold">
                  {axis.pct}%
                </text>
              </g>
            ))}
          </svg>

          <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] leading-relaxed bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] rounded-xl px-3 py-2">
            {tri.imbalanceNote}
          </p>
        </div>

        {/* Panel 4: 180-Lesson HSK 1–9 Mastery Heatmap */}
        <div className="rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-[#45B97C]" />
              <span className="text-xs font-extrabold text-[#243447] dark:text-white">
                Ma trận 9 Cấp độ HSK 1–9 (180 Bài)
              </span>
            </div>
            <span className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Nhấn cấp để học ngay</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {heatmap.map((cell) => (
              <button
                key={cell.level}
                type="button"
                onClick={() => {
                  if (onSelectLevel) {
                    onSelectLevel(cell.level, cell.startLesson);
                  } else {
                    setActiveTab?.('roadmap');
                  }
                }}
                className="text-left rounded-xl bg-white dark:bg-[#1E293B] hover:border-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] p-2.5 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#243447] dark:text-white group-hover:text-[#E85D3F]">{cell.label}</span>
                  <span className="text-[#E85D3F]">{cell.pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F1E5D8] dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E85D3F] to-[#45B97C] transition-all"
                    style={{ width: `${cell.pct}%` }}
                  />
                </div>
                <div className="mt-1 text-[9px] text-[#748092] dark:text-[#94A3B8]">
                  {cell.completedCount}/{cell.totalLessons} bài
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
