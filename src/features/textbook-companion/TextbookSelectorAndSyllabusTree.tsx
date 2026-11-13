import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
} from 'lucide-react';
import type {
  TextbookSeries,
  TextbookUnit,
  UserTextbookEnrollment,
} from '../../services/textbookCompanionService.ts';

interface TextbookSelectorAndSyllabusTreeProps {
  seriesList: TextbookSeries[];
  selectedSeriesId: string;
  onSelectSeries: (seriesId: string) => void;
  units: TextbookUnit[];
  selectedUnitId: string;
  onSelectUnit: (unit: TextbookUnit) => void;
  enrollments: UserTextbookEnrollment[];
}

export const TextbookSelectorAndSyllabusTree: React.FC<TextbookSelectorAndSyllabusTreeProps> = ({
  seriesList,
  selectedSeriesId,
  onSelectSeries,
  units,
  selectedUnitId,
  onSelectUnit,
  enrollments,
}) => {
  const activeEnrollment = enrollments.find((e) => e.series_id === selectedSeriesId);
  const completedSet = new Set(activeEnrollment?.completed_unit_ids || []);

  // Group units by volume_number
  const volumes = Array.from(new Set(units.map((u) => u.volume_number))).sort((a, b) => a - b);

  return (
    <div className="space-y-5">
      {/* Textbook Series Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {seriesList.map((series) => {
          const isSelected = series.id === selectedSeriesId;
          const seriesEnroll = enrollments.find((e) => e.series_id === series.id);
          return (
            <button
              key={series.id}
              type="button"
              onClick={() => onSelectSeries(series.id)}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {series.total_volumes} Quyển
                </span>
                {seriesEnroll && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Đang học Q{seriesEnroll.current_volume}·B{seriesEnroll.current_unit}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {series.title_vi}
                </h3>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">{series.title_zh}</p>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {series.publisher}
              </p>
            </button>
          );
        })}
      </div>

      {/* Syllabus Tree: Volume -> Unit */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Mục lục giáo trình (Quyển ➔ Bài học)</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {completedSet.size}/{units.length} bài đã hoàn thành
          </span>
        </div>

        <div className="space-y-4">
          {volumes.map((volNum) => {
            const volUnits = units
              .filter((u) => u.volume_number === volNum)
              .sort((a, b) => a.unit_number - b.unit_number);

            return (
              <div key={volNum} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>Quyển {volNum} (第{volNum}册)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-2 sm:pl-4 border-l-2 border-emerald-200">
                  {volUnits.map((unit) => {
                    const isActive = unit.id === selectedUnitId;
                    const isCompleted = completedSet.has(unit.id);
                    return (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => onSelectUnit(unit)}
                        className={`text-left rounded-2xl border p-3.5 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                              Bài {unit.unit_number}
                            </span>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm font-black text-slate-900 truncate pt-1">
                            {unit.title_zh}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{unit.title_vi}</p>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

