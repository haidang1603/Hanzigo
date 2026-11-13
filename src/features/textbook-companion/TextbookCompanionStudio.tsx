import React, { useState, useEffect, useMemo } from 'react';
import { BookMarked, Sparkles } from 'lucide-react';
import {
  listTextbookSeries,
  listUnitsForSeries,
  getUserTextbookEnrollments,
  type TextbookSeries,
  type TextbookUnit,
  type UserTextbookEnrollment,
} from '../../services/textbookCompanionService.ts';
import { TextbookSelectorAndSyllabusTree } from './TextbookSelectorAndSyllabusTree.tsx';
import { UnitAllInOneStudyHub } from './UnitAllInOneStudyHub.tsx';

interface TextbookCompanionStudioProps {
  user?: any;
  onNavigateTab?: (tabId: string) => void;
}

export const TextbookCompanionStudio: React.FC<TextbookCompanionStudioProps> = ({
  user,
  onNavigateTab,
}) => {
  const [seriesList, setSeriesList] = useState<TextbookSeries[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [units, setUnits] = useState<TextbookUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<TextbookUnit | null>(null);
  const [enrollments, setEnrollments] = useState<UserTextbookEnrollment[]>([]);

  useEffect(() => {
    let mounted = true;
    listTextbookSeries().then((list) => {
      if (!mounted) return;
      setSeriesList(list);
      if (list.length > 0) {
        setSelectedSeriesId((cur) => cur || list[0].id);
      }
    });
    getUserTextbookEnrollments(user).then((enr) => {
      if (mounted) setEnrollments(enr);
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!selectedSeriesId) return;
    let mounted = true;
    listUnitsForSeries(selectedSeriesId).then((unitList) => {
      if (!mounted) return;
      setUnits(unitList);
      setSelectedUnit(unitList[0] || null);
    });
    return () => {
      mounted = false;
    };
  }, [selectedSeriesId]);

  const activeSeries = useMemo(
    () => seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0] || null,
    [seriesList, selectedSeriesId]
  );

  const activeEnrollment = enrollments.find((e) => e.series_id === selectedSeriesId);
  const isSelectedUnitCompleted = Boolean(
    selectedUnit && activeEnrollment?.completed_unit_ids.includes(selectedUnit.id)
  );

  const handleUnitCompleted = (unitId: string) => {
    setEnrollments((prev) => {
      const idx = prev.findIndex((e) => e.series_id === selectedSeriesId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          completed_unit_ids: Array.from(new Set([...next[idx].completed_unit_ids, unitId])),
        };
        return next;
      }
      return [
        ...prev,
        {
          series_id: selectedSeriesId,
          current_volume: selectedUnit?.volume_number || 1,
          current_unit: selectedUnit?.unit_number || 1,
          completed_unit_ids: [unitId],
          updated_at: new Date().toISOString(),
        },
      ];
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 p-6 text-white shadow-lg space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Textbook Curriculum Companion
        </span>
        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-300 shrink-0" />
          <span>Đồng hành Giáo trình Chính thống (Hán Ngữ · HSK · Boya · Msutong)</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl">
          Đồng bộ 100% từ vựng, chữ Hán, ngữ pháp và bài khóa của từng bài học trên lớp vào toàn bộ công cụ luyện tập chỉ với 1 lần bấm.
        </p>
      </div>

      {/* Selector & Syllabus Tree */}
      {seriesList.length > 0 && (
        <TextbookSelectorAndSyllabusTree
          seriesList={seriesList}
          selectedSeriesId={selectedSeriesId}
          onSelectSeries={setSelectedSeriesId}
          units={units}
          selectedUnitId={selectedUnit?.id || ''}
          onSelectUnit={setSelectedUnit}
          enrollments={enrollments}
        />
      )}

      {/* 5-Tab All-in-One Study Hub */}
      {activeSeries && selectedUnit && (
        <UnitAllInOneStudyHub
          key={selectedUnit.id}
          series={activeSeries}
          unit={selectedUnit}
          user={user}
          isCompleted={isSelectedUnitCompleted}
          onUnitCompleted={handleUnitCompleted}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};

