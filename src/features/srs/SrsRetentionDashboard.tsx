import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertOctagon,
  Brain,
  CalendarClock,
  Layers,
  PenTool,
  RotateCcw,
  Sparkles,
  TrendingDown,
  X,
} from 'lucide-react';
import DashboardWidget from '../../components/dashboard/DashboardWidget.jsx';
import { setAdaptiveNavigationTarget } from '../../services/adaptiveLearningService.js';
import {
  buildSrsRetentionSnapshot,
  injectLeechMnemonic,
  resetLeechCard,
  type MaturityState,
  type SrsRetentionCard,
  type SrsRetentionSnapshot,
} from '../../services/srsRetentionService.ts';

export interface SrsRetentionDashboardProps {
  user?: { id?: string | null } | null;
  setActiveTab?: (tab: string) => void;
  initialSnapshot?: SrsRetentionSnapshot | null;
}

const MATURITY_CONFIG: Array<{
  key: MaturityState;
  label: string;
  barClass: string;
  badgeClass: string;
}> = [
  {
    key: 'New',
    label: 'New',
    barClass: 'bg-slate-300 dark:bg-slate-600',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    key: 'Learning',
    label: 'Learning',
    barClass: 'bg-amber-400',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  {
    key: 'Young',
    label: 'Young (<21d)',
    barClass: 'bg-sky-500',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  },
  {
    key: 'Mature',
    label: 'Mature (≥21d)',
    barClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  {
    key: 'Leech',
    label: 'Leech',
    barClass: 'bg-rose-500',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
];

export default function SrsRetentionDashboard({
  user = null,
  setActiveTab,
  initialSnapshot = null,
}: SrsRetentionDashboardProps) {
  const [hskFilter, setHskFilter] = useState<number | 'all'>('all');
  const [refreshTick, setRefreshTick] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mnemonicDrafts, setMnemonicDrafts] = useState<Record<string, string>>({});
  const [hoveredCurveIdx, setHoveredCurveIdx] = useState<number | null>(null);

  const snapshot = useMemo(() => {
    if (initialSnapshot && refreshTick === 0 && hskFilter === initialSnapshot.hskFilter) {
      return initialSnapshot;
    }
    return buildSrsRetentionSnapshot({ user, hskFilter });
  }, [initialSnapshot, user, hskFilter, refreshTick]);

  // Memoized SVG Geometry for Forgetting Curve Visualizer
  const curveGeometry = useMemo(() => {
    const pts = snapshot.forgettingCurve;
    const width = 480;
    const height = 200;
    const padX = 40;
    const padY = 22;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    const mapped = pts.map((pt, idx) => {
      const x =
        pts.length <= 1
          ? padX + plotW / 2
          : padX + (idx / (pts.length - 1)) * plotW;
      const yPred = padY + plotH - (pt.predictedRetention / 100) * plotH;
      const yActual =
        pt.actualRetention !== null
          ? padY + plotH - (pt.actualRetention / 100) * plotH
          : null;
      return { pt, x, yPred, yActual };
    });

    const predLine = mapped.map((m) => `${m.x},${m.yPred}`).join(' ');
    const actualNodes = mapped.filter((m) => m.yActual !== null);
    const actualLine = actualNodes
      .map((m) => `${m.x},${m.yActual}`)
      .join(' ');

    return { width, height, padX, padY, plotW, plotH, mapped, predLine, actualLine };
  }, [snapshot.forgettingCurve]);

  // Memoized 7-day workload max
  const maxWorkload = useMemo(() => {
    return Math.max(10, ...snapshot.workloadForecast.map((d) => d.dueReviews));
  }, [snapshot.workloadForecast]);

  const handleResetLeech = useCallback(
    (cardId: string) => {
      resetLeechCard(cardId, user);
      setRefreshTick((t) => t + 1);
    },
    [user]
  );

  const handleInjectMnemonic = useCallback(
    (card: SrsRetentionCard) => {
      const draft = mnemonicDrafts[card.cardId]?.trim();
      const text =
        draft ||
        card.radicalBreakdown?.mnemonic ||
        `Ghi nhớ chữ "${card.hanzi}" (${card.pinyin}): ${card.meaning}`;
      injectLeechMnemonic(card.cardId, text, user);
      setRefreshTick((t) => t + 1);
    },
    [mnemonicDrafts, user]
  );

  const handleInjectStrokeDrill = useCallback(
    (card: SrsRetentionCard) => {
      setAdaptiveNavigationTarget({
        targetTab: 'writing',
        source: 'hanzi_writer',
        levelNum: card.hskLevel || 1,
        targetRef: card.hanzi,
      });
      setDrawerOpen(false);
      setActiveTab?.('writing');
    },
    [setActiveTab]
  );

  return (
    <section aria-label="SRS Retention Analytics" className="space-y-6">
      {/* Header & HSK Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold uppercase tracking-wider">
            <Brain size={13} />
            <span>SRS Retention Analytics</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#243447] dark:text-white">
            Phân tích Trí nhớ & Độ bền Từ vựng (FSRS Decay)
          </h2>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
            Độ ổn định trung bình (S):{' '}
            <strong className="text-[#243447] dark:text-white">
              {snapshot.averageStabilityDays} ngày
            </strong>{' '}
            · Khả năng truy xuất (R):{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {snapshot.averageRetrievability}%
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Lọc theo cấp độ HSK"
            value={String(hskFilter)}
            onChange={(e) => {
              const val = e.target.value;
              setHskFilter(val === 'all' ? 'all' : Number(val));
            }}
            className="px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer"
          >
            <option value="all">Tất cả HSK 1–9</option>
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
          >
            <AlertOctagon size={14} />
            <span>Leech Drawer ({snapshot.leechCount})</span>
          </button>
        </div>
      </div>

      {/* Top Row: Forgetting Curve Visualizer + Vocabulary Maturity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Forgetting Curve Visualizer */}
        <DashboardWidget
          title="Đường cong Quên lãng (Forgetting Curve)"
          subtitle="Tỷ lệ nhớ thực tế vs. mô hình suy giảm R(t, S) qua 1d → 90d"
          icon={TrendingDown}
          className="lg:col-span-6"
        >
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${curveGeometry.width} ${curveGeometry.height}`}
                className="w-full min-w-[360px] h-48"
                role="img"
                aria-label="SRS Forgetting Curve Chart"
              >
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y =
                    curveGeometry.padY +
                    curveGeometry.plotH -
                    (pct / 100) * curveGeometry.plotH;
                  return (
                    <g key={pct}>
                      <line
                        x1={curveGeometry.padX}
                        y1={y}
                        x2={curveGeometry.width - curveGeometry.padX}
                        y2={y}
                        stroke="currentColor"
                        className="text-[#EFE4D6] dark:text-[#334155]"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={curveGeometry.padX - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-[#748092] dark:fill-gray-400 text-[9px]"
                      >
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* Predicted Decay Curve */}
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  strokeDasharray="5 3"
                  points={curveGeometry.predLine}
                />

                {/* Actual User Retention Line */}
                {curveGeometry.actualLine && (
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={2.75}
                    points={curveGeometry.actualLine}
                  />
                )}

                {curveGeometry.mapped.map(({ pt, x, yPred, yActual }, idx) => (
                  <g
                    key={pt.intervalDays}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredCurveIdx(idx)}
                    onMouseLeave={() => setHoveredCurveIdx(null)}
                  >
                    <circle cx={x} cy={yPred} r={4} fill="#8B5CF6" />
                    {yActual !== null && (
                      <circle
                        cx={x}
                        cy={yActual}
                        r={hoveredCurveIdx === idx ? 6 : 4.5}
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                    )}
                    <text
                      x={x}
                      y={curveGeometry.height - 4}
                      textAnchor="middle"
                      className="fill-[#748092] dark:fill-gray-400 text-[10px] font-semibold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400">
                  <span className="w-3 h-0.5 bg-purple-500" />
                  Dự báo R(t, S)
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-500" />
                  Thực tế người dùng
                </span>
              </div>

              {hoveredCurveIdx !== null && curveGeometry.mapped[hoveredCurveIdx] && (
                <span className="text-[#243447] dark:text-white font-semibold">
                  Mốc {curveGeometry.mapped[hoveredCurveIdx].pt.label}: Dự báo{' '}
                  <strong>
                    {curveGeometry.mapped[hoveredCurveIdx].pt.predictedRetention}%
                  </strong>
                  {curveGeometry.mapped[hoveredCurveIdx].pt.actualRetention !== null
                    ? ` · Thực tế ${curveGeometry.mapped[hoveredCurveIdx].pt.actualRetention}% (${curveGeometry.mapped[hoveredCurveIdx].pt.sampleSize} lượt)`
                    : ' · Chưa có mẫu'}
                </span>
              )}
            </div>
          </div>
        </DashboardWidget>

        {/* Vocabulary Maturity Distribution */}
        <DashboardWidget
          title="Phân bổ Độ chín Từ vựng (Maturity)"
          subtitle={`Tổng ${snapshot.maturityDistribution.total} thẻ trong phạm vi đã chọn`}
          icon={Layers}
          className="lg:col-span-6"
        >
          <div className="space-y-4">
            {/* Stacked Bar */}
            <div className="w-full h-7 rounded-2xl overflow-hidden flex bg-[#F3ECE4] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F]">
              {MATURITY_CONFIG.map((cfg) => {
                const count = snapshot.maturityDistribution.counts[cfg.key] || 0;
                const total = Math.max(1, snapshot.maturityDistribution.total);
                const pct = (count / total) * 100;
                if (pct <= 0) return null;
                return (
                  <div
                    key={cfg.key}
                    style={{ width: `${pct}%` }}
                    className={`${cfg.barClass} h-full transition-all duration-300`}
                    title={`${cfg.label}: ${count} (${Math.round(pct)}%)`}
                  />
                );
              })}
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {MATURITY_CONFIG.map((cfg) => {
                const count = snapshot.maturityDistribution.counts[cfg.key] || 0;
                const total = Math.max(1, snapshot.maturityDistribution.total);
                const pct = Math.round((count / total) * 100);
                return (
                  <div
                    key={cfg.key}
                    className="p-2.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-1"
                  >
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}
                    >
                      {cfg.label}
                    </span>
                    <div className="text-lg font-extrabold text-[#243447] dark:text-white">
                      {count}
                    </div>
                    <div className="text-[11px] text-[#748092] dark:text-gray-400">
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardWidget>
      </div>

      {/* 7-Day Workload Forecast */}
      <DashboardWidget
        title="Dự báo Khối lượng Ôn tập 7 Ngày tới"
        subtitle="Giúp điều tiết số thẻ mới nạp vào mỗi ngày để tránh quá tải trí nhớ"
        icon={CalendarClock}
        action={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles size={14} />
            Khuyên nạp: +{snapshot.recommendedNewCardsPerDay} thẻ mới/ngày
          </span>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-36 pt-4">
            {snapshot.workloadForecast.map((day) => {
              const barPct = Math.max(
                6,
                Math.round((day.dueReviews / maxWorkload) * 100)
              );
              const barColor =
                day.burnoutRisk === 'high'
                  ? 'bg-rose-500'
                  : day.burnoutRisk === 'moderate'
                  ? 'bg-amber-500'
                  : 'bg-[#E85D3F]';
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1.5 h-full justify-end"
                >
                  <span className="text-[11px] font-bold text-[#243447] dark:text-white">
                    {day.dueReviews}
                  </span>
                  <div className="w-full max-w-[38px] h-24 rounded-t-xl bg-[#FAF6F0] dark:bg-[#0F172A] flex items-end overflow-hidden border border-[#EFE4D6] dark:border-[#2B3A4F]">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                      style={{ height: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#748092] dark:text-gray-400">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs text-[#5B6B7F] dark:text-gray-300">
            {snapshot.workloadGuidance}
          </div>
        </div>
      </DashboardWidget>

      {/* Leech Intervention Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Leech Intervention Drawer"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg h-full bg-white dark:bg-[#1E293B] border-l border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#243447] dark:text-white flex items-center gap-2">
                  <AlertOctagon size={18} className="text-rose-500" />
                  Leech Intervention Drawer ({snapshot.leechCards.length})
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Thẻ có ≥4 lần quên (lapses) hoặc độ chính xác &lt;45% trong 6 lượt gần nhất.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Đóng Leech Drawer"
                className="p-2 rounded-xl hover:bg-[#FAF6F0] dark:hover:bg-[#0F172A] text-[#748092] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {snapshot.leechCards.length === 0 ? (
                <div className="py-12 text-center text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
                  Tuyệt vời! Hiện chưa có thẻ Leech nào cần can thiệp.
                </div>
              ) : (
                snapshot.leechCards.map((card) => (
                  <div
                    key={card.cardId}
                    className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-rose-200 dark:border-rose-900/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-extrabold text-[#243447] dark:text-white">
                            {card.hanzi}
                          </span>
                          <span className="text-xs font-semibold text-[#E85D3F]">
                            {card.pinyin}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                            {card.lapses} lapses
                          </span>
                        </div>
                        {card.meaning && (
                          <p className="text-xs text-[#5B6B7F] dark:text-gray-300 mt-0.5">
                            {card.meaning}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#748092]">
                        HSK {card.hskLevel}
                      </span>
                    </div>

                    {/* Confusion pairs */}
                    {card.confusedWith.length > 0 && (
                      <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1.5 rounded-xl">
                        Hay nhầm với:{' '}
                        <strong>{card.confusedWith.join(', ')}</strong>
                      </div>
                    )}

                    {/* Radical Breakdown */}
                    {card.radicalBreakdown && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-1.5 text-xs">
                        <div className="font-bold text-[#243447] dark:text-white">
                          Phân rã bộ thủ: {card.radicalBreakdown.ids || '—'}
                        </div>
                        {card.radicalBreakdown.components.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {card.radicalBreakdown.components.map((comp, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[#FAF6F0] dark:bg-[#0F172A] text-[11px]"
                              >
                                <strong>{comp.char}</strong>{' '}
                                {comp.hanviet ? `(${comp.hanviet})` : ''}{' '}
                                {comp.meaning ? `– ${comp.meaning}` : ''}
                              </span>
                            ))}
                          </div>
                        )}
                        {(card.customMnemonic || card.radicalBreakdown.mnemonic) && (
                          <p className="text-[11px] text-[#748092] dark:text-gray-400 italic">
                            Mẹo nhớ: {card.customMnemonic || card.radicalBreakdown.mnemonic}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mnemonic Injection + Actions */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={mnemonicDrafts[card.cardId] ?? ''}
                        onChange={(e) =>
                          setMnemonicDrafts((prev) => ({
                            ...prev,
                            [card.cardId]: e.target.value,
                          }))
                        }
                        placeholder="Nhập mẹo ghi nhớ (mnemonic) riêng..."
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5D8C8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-white"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleInjectMnemonic(card)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Sparkles size={12} />
                          <span>Lưu Mnemonic</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInjectStrokeDrill(card)}
                          className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <PenTool size={12} />
                          <span>Luyện viết nét</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetLeech(card.cardId)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5D8C8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 hover:border-emerald-500"
                        >
                          <RotateCcw size={12} />
                          <span>Reset thẻ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

