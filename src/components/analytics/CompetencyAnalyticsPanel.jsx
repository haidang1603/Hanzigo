import React, { useMemo, useState } from 'react';
import { 
  Target, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Award, 
  Zap,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { generateStudyPrescriptions, generateActivityHeatmapData } from '../../utils/competencyAnalytics.js';

/**
 * =========================================================================
 * COMPETENCY ANALYTICS PANEL
 * =========================================================================
 * Trung tâm Phân tích Năng lực Đa chiều 4 Kỹ năng (Nghe - Nói - Đọc - Viết):
 * - Radar Chart SVG tương tác mượt mà không cần thư viện đồ thị cồng kềnh.
 * - Lưới nhiệt hoạt động 365 ngày (Activity Heatmap) phong cách GitHub.
 * - Lộ trình hành động (Actionable Prescriptions) điều hướng thẳng tới module yếu.
 * =========================================================================
 */
export default function CompetencyAnalyticsPanel({
  competencyScores = {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
    overall: 0
  },
  activityLog = {},
  targetLevel = 'HSK 1',
  streak = 0,
  scholarRank = null,
  onNavigate = null
}) {
  const [selectedDay, setSelectedDay] = useState(null);

  // 1. Phân tích khuyến nghị sư phạm
  const prescriptionsData = useMemo(() => {
    return generateStudyPrescriptions(competencyScores, targetLevel);
  }, [competencyScores, targetLevel]);

  // 2. Dữ liệu biểu đồ nhiệt 365 ngày
  const heatmapData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return generateActivityHeatmapData(activityLog, currentYear);
  }, [activityLog]);

  // 3. Tính toán tọa độ Radar Chart SVG (Polygon 4 đỉnh: Nghe, Nói, Đọc, Viết)
  // Tâm: (150, 150), Bán kính max: 100
  const radarSvgData = useMemo(() => {
    const cx = 150;
    const cy = 150;
    const r = 95;

    // 4 góc: Trên (Nghe), Phải (Nói), Dưới (Đọc), Trái (Viết)
    const axes = [
      { key: 'listening', label: 'Nghe hiểu (听力)', angle: -Math.PI / 2, score: competencyScores?.listening || 0 },
      { key: 'speaking', label: 'Khẩu ngữ (口语)', angle: 0, score: competencyScores?.speaking || 0 },
      { key: 'reading', label: 'Đọc & Từ vựng (阅读)', angle: Math.PI / 2, score: competencyScores?.reading || 0 },
      { key: 'writing', label: 'Viết & Hán tự (书写)', angle: Math.PI, score: competencyScores?.writing || 0 }
    ];


    // Tọa độ người dùng
    const userPoints = axes.map(a => {
      const dist = (a.score / 100) * r;
      const x = cx + dist * Math.cos(a.angle);
      const y = cy + dist * Math.sin(a.angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Mức chuẩn 80% (Benchmark)
    const benchmarkPoints = axes.map(a => {
      const dist = 0.8 * r;
      const x = cx + dist * Math.cos(a.angle);
      const y = cy + dist * Math.sin(a.angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return { cx, cy, r, axes, userPoints, benchmarkPoints };
  }, [competencyScores]);

  return (
    <div className="space-y-6">
      {/* 1. Header KPIs & Scholar Rank */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            {scholarRank?.icon || '🌱'}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Học vị Hán học</div>
            <div className="text-base font-black text-slate-800 dark:text-slate-100">{scholarRank?.title || 'Nhập Môn Học Đồng'}</div>
            <div className="text-xs text-amber-600 font-semibold">{scholarRank?.progressPercent || 0}% đến cấp kế</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] flex items-center justify-center text-2xl font-bold shadow-inner">
            🔥
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chuỗi ngày học</div>
            <div className="text-xl font-black text-[#E85D3F]">{streak} ngày liên tiếp</div>
            <div className="text-xs text-slate-500 font-medium">Được bảo vệ bởi Streak Freeze</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            🎯
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Năng lực tổng hợp</div>
            <div className="text-xl font-black text-emerald-600">{(competencyScores?.overall ?? 0)}/100</div>
            <div className="text-xs text-slate-500 font-medium">Mục tiêu: {targetLevel || 'HSK 1'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            📅
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ngày tích cực 365</div>
            <div className="text-xl font-black text-blue-600">{(heatmapData?.activeDays ?? 0)} ngày</div>
            <div className="text-xs text-slate-500 font-medium">Tổng {(heatmapData?.totalXp ?? 0)} XP năm {(heatmapData?.year ?? new Date().getFullYear())}</div>
          </div>
        </div>
      </div>


      {/* 2. Radar Chart & Actionable Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">Biểu đồ Radar 4 Kỹ Năng</h3>
              <p className="text-xs text-slate-500">Cân bằng Nghe - Nói - Đọc - Viết theo chuẩn {targetLevel}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E85D3F]"></span> Thực tế
              <span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-emerald-500"></span> Chuẩn 80%
            </div>
          </div>

          <div className="flex justify-center py-2">
            <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
              {/* Vòng tròn đồng tâm 25%, 50%, 75%, 100% */}
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <polygon
                  key={scale}
                  points={radarSvgData.axes.map(a => {
                    const d = scale * radarSvgData.r;
                    const x = radarSvgData.cx + d * Math.cos(a.angle);
                    const y = radarSvgData.cy + d * Math.sin(a.angle);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3,3'}
                  className="dark:stroke-slate-800"
                />
              ))}

              {/* Trục tọa độ 4 hướng */}
              {radarSvgData.axes.map((a, i) => {
                const x = radarSvgData.cx + radarSvgData.r * Math.cos(a.angle);
                const y = radarSvgData.cy + radarSvgData.r * Math.sin(a.angle);
                return (
                  <line
                    key={i}
                    x1={radarSvgData.cx}
                    y1={radarSvgData.cy}
                    x2={x}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    className="dark:stroke-slate-800"
                  />
                );
              })}

              {/* Đa giác Chuẩn 80% */}
              <polygon
                points={radarSvgData.benchmarkPoints}
                fill="rgba(16, 185, 129, 0.08)"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Đa giác Năng lực Thực tế Người học */}
              <polygon
                points={radarSvgData.userPoints}
                fill="rgba(232, 93, 63, 0.25)"
                stroke="#E85D3F"
                strokeWidth="2.5"
              />

              {/* Các điểm neo (Vertices) */}
              {radarSvgData.axes.map((a, i) => {
                const dist = (a.score / 100) * radarSvgData.r;
                const x = radarSvgData.cx + dist * Math.cos(a.angle);
                const y = radarSvgData.cy + dist * Math.sin(a.angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#E85D3F"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="shadow-sm"
                  />
                );
              })}

              {/* Nhãn 4 kỹ năng */}
              {radarSvgData.axes.map((a, i) => {
                const labelDist = radarSvgData.r + 26;
                const x = radarSvgData.cx + labelDist * Math.cos(a.angle);
                const y = radarSvgData.cy + labelDist * Math.sin(a.angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] font-black fill-slate-700 dark:fill-slate-300"
                  >
                    {a.label.split(' ')[0]} ({a.score}%)
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
              <span className="text-slate-500 text-[11px]">Nghe (Listening):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{(competencyScores?.listening ?? 0)}/100</span>
                {competencyScores?.skillStatuses?.listening?.status === 'no_data' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Chưa học</span>
                )}
                {competencyScores?.skillStatuses?.listening?.status === 'insufficient_sample' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">Tạm thời</span>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
              <span className="text-slate-500 text-[11px]">Nói (Speaking):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{(competencyScores?.speaking ?? 0)}/100</span>
                {competencyScores?.skillStatuses?.speaking?.status === 'no_data' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Chưa học</span>
                )}
                {competencyScores?.skillStatuses?.speaking?.status === 'insufficient_sample' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">Tạm thời</span>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
              <span className="text-slate-500 text-[11px]">Đọc (Reading):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{(competencyScores?.reading ?? 0)}/100</span>
                {competencyScores?.skillStatuses?.reading?.status === 'no_data' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Chưa học</span>
                )}
                {competencyScores?.skillStatuses?.reading?.status === 'insufficient_sample' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">Tạm thời</span>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
              <span className="text-slate-500 text-[11px]">Viết (Writing):</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{(competencyScores?.writing ?? 0)}/100</span>
                {competencyScores?.skillStatuses?.writing?.status === 'no_data' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Chưa học</span>
                )}
                {competencyScores?.skillStatuses?.writing?.status === 'insufficient_sample' && (
                  <span className="text-[9px] px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">Tạm thời</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-3 text-center">
            * {competencyScores?.disclaimer || 'Chỉ số năng lực học tập nội bộ HanziGo dựa trên tiến độ và bài tập thực tế. Không phải bài thi chuẩn hóa quốc tế.'}
          </p>
        </div>


        {/* Actionable Prescriptions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">Lộ Trình Khắc Phục Điểm Yếu Cá Nhân Hóa</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Thuật toán phân tích trực tiếp điểm số thực tế và tự động thiết lập bài tập ưu tiên hàng đầu để san lấp khoảng cách kỹ năng:
            </p>

            <div className="space-y-3">
              {(prescriptionsData?.prescriptions || []).map((pres, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    pres.priority === 'high'
                      ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
                      : 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          pres.priority === 'high' 
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}>
                          {pres.priority === 'high' ? 'Ưu tiên số 1' : 'Khuyến nghị nâng cao'}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{pres.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pres.description}</p>
                    </div>

                    <button
                      onClick={() => onNavigate && onNavigate(pres.actionPath || 'dashboard')}
                      className="shrink-0 px-4 py-2 bg-[#E85D3F] hover:bg-[#D44D30] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    >
                      {pres.actionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 365-Day Activity Heatmap */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Biểu Đồ Nhiệt Hoạt Động (Activity Heatmap {heatmapData?.year || new Date().getFullYear()})</h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                <span>Ít</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-200 dark:bg-orange-950"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-400 dark:bg-orange-800"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-[#E85D3F]"></span>
                <span>Nhiều</span>
              </div>
            </div>

            {/* Heatmap Grid (Scrollable horizontally) */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[650px]">
                {(heatmapData?.days || []).map((d) => {
                  let bgClass = 'bg-slate-100 dark:bg-slate-800';
                  if (d.intensity === 1) bgClass = 'bg-orange-100 dark:bg-orange-950/60 border border-orange-200/50';
                  if (d.intensity === 2) bgClass = 'bg-orange-300 dark:bg-orange-800/80';
                  if (d.intensity === 3) bgClass = 'bg-orange-500 dark:bg-orange-600';
                  if (d.intensity === 4) bgClass = 'bg-[#E85D3F] shadow-xs';

                  return (
                    <div
                      key={d.date}
                      onMouseEnter={() => setSelectedDay(d)}
                      className={`w-3 h-3 rounded-xs cursor-pointer transition-transform hover:scale-125 ${bgClass}`}
                      title={`${d.date}: ${d.count} hoạt động (${d.xp} XP)`}
                    />
                  );
                })}
              </div>
            </div>

            {selectedDay ? (
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>Chi tiết ngày <strong>{selectedDay.date}</strong>:</span>
                <span className="font-bold text-[#E85D3F]">{selectedDay.count} bài học / ôn tập • {selectedDay.xp} XP</span>
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-slate-400">
                Rê chuột vào các ô vuông để xem chi tiết số hoạt động và XP đạt được từng ngày.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
