import React from 'react';
import { AlertTriangle, Award, History, RotateCcw } from 'lucide-react';
import type {
  HanziCharacterMasteryRecord,
  HanziWritingLogRecord,
  MasteryTier,
} from '../../services/writingStudioService.ts';

export interface WritingHistoryAnalyticsProps {
  logs: HanziWritingLogRecord[];
  masteryList: HanziCharacterMasteryRecord[];
  mostMistakenCharacters: HanziCharacterMasteryRecord[];
  onPracticeCharacter: (character: string) => void;
}

const TIER_META: Record<MasteryTier, { label: string; badgeClass: string }> = {
  novice: {
    label: 'Mới tập',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  practicing: {
    label: 'Đang rèn',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
  proficient: {
    label: 'Thành thạo',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  },
  calligrapher: {
    label: 'Thư pháp gia',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
};

export default function WritingHistoryAnalytics({
  logs,
  masteryList,
  mostMistakenCharacters,
  onPracticeCharacter,
}: WritingHistoryAnalyticsProps) {
  const avgAccuracy =
    logs.length > 0
      ? Math.round(
          (logs.reduce((acc, item) => acc + Number(item.accuracy_score || 0), 0) /
            logs.length) *
            10
        ) / 10
      : 0;

  const recentLogs = logs.slice(0, 10).reverse();

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
          <div className="text-[11px] font-bold text-[#748092]">Tổng lượt viết</div>
          <div className="text-xl font-black text-[#243447] dark:text-white mt-0.5">
            {logs.length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
          <div className="text-[11px] font-bold text-[#748092]">Độ chính xác TB</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {avgAccuracy}%
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
          <div className="text-[11px] font-bold text-[#748092]">Chữ đã luyện</div>
          <div className="text-xl font-black text-[#E85D3F] mt-0.5">
            {masteryList.length}
          </div>
        </div>
      </div>

      {/* Accuracy Progression Mini-Chart */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3">
        <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
          <Award size={14} className="text-[#E85D3F]" />
          <span>Biểu đồ tiến bộ 10 lượt viết gần nhất</span>
        </div>
        {recentLogs.length === 0 ? (
          <p className="text-xs text-[#748092]">
            Hoàn thành lượt viết đầu tiên để xem biểu đồ tiến bộ của bạn.
          </p>
        ) : (
          <div className="grid grid-cols-10 gap-1.5 items-end h-24 pt-2">
            {recentLogs.map((l) => {
              const pct = Math.max(10, Math.round(Number(l.accuracy_score) || 0));
              const barColor =
                pct >= 85
                  ? 'bg-emerald-500'
                  : pct >= 65
                  ? 'bg-amber-500'
                  : 'bg-rose-500';
              return (
                <div
                  key={l.id}
                  className="flex flex-col items-center gap-1 h-full justify-end"
                  title={`${l.character}: ${pct}% (${l.mode})`}
                >
                  <div className="w-full h-16 rounded-t-lg bg-[#FAF6F0] dark:bg-[#0F172A] flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-md ${barColor}`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#243447] dark:text-white">
                    {l.character}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Most Mistaken Characters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-3">
        <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-rose-500" />
          <span>Chữ Hán hay viết sai nét nhất</span>
        </div>

        {mostMistakenCharacters.length === 0 ? (
          <p className="text-xs text-[#748092]">
            Chưa phát hiện chữ Hán nào có tỷ lệ sai nét cao.
          </p>
        ) : (
          <div className="space-y-2">
            {mostMistakenCharacters.map((item) => {
              const tier = TIER_META[item.mastery_tier] || TIER_META.novice;
              const badStrokes = Object.entries(item.problematic_strokes || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([idx]) => `#${Number(idx) + 1}`);

              return (
                <div
                  key={item.character}
                  className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-900/40 flex items-center justify-center text-xl font-black text-[#243447] dark:text-white shrink-0">
                      {item.character}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#243447] dark:text-white">
                          TB {item.avg_accuracy}% · {item.total_attempts} lượt
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.badgeClass}`}
                        >
                          {tier.label}
                        </span>
                      </div>
                      {badStrokes.length > 0 && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 truncate">
                          Hay sai nét: {badStrokes.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onPracticeCharacter(item.character)}
                    className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw size={12} />
                    <span>Ôn lại</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Logs */}
      {logs.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2">
          <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
            <History size={14} className="text-[#748092]" />
            <span>Lịch sử gần đây</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {logs.slice(0, 6).map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between text-xs py-1 border-b last:border-b-0 border-[#F1E5D8] dark:border-[#2B3A4F]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#243447] dark:text-white">
                    {l.character}
                  </span>
                  <span className="text-[11px] text-[#748092] uppercase">{l.mode}</span>
                </div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {l.accuracy_score}% · {l.mistake_count} lỗi
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

