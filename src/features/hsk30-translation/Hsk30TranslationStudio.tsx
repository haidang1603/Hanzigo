import React, { useState, useEffect } from 'react';
import { Languages, Briefcase, ArrowLeftRight, Sparkles } from 'lucide-react';
import {
  listSpecializedDomainPacks,
  listTranslationDrills,
  type SpecializedDomainPack,
  type TranslationDrill,
} from '../../services/translationStudioService.ts';
import { SpecializedTrackExplorer } from './SpecializedTrackExplorer.tsx';
import { TranslationWorkbench } from './TranslationWorkbench.tsx';

interface Hsk30TranslationStudioProps {
  user?: any;
  onOpenDictionary?: (term: string) => void;
}

type StudioTab = 'workbench' | 'specialized';

export const Hsk30TranslationStudio: React.FC<Hsk30TranslationStudioProps> = ({
  user,
  onOpenDictionary,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('workbench');
  const [packs, setPacks] = useState<SpecializedDomainPack[]>([]);
  const [drills, setDrills] = useState<TranslationDrill[]>([]);
  const [domainFilterFromTrack, setDomainFilterFromTrack] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listSpecializedDomainPacks().then((p) => {
      if (mounted) setPacks(p);
    });
    listTranslationDrills().then((d) => {
      if (mounted) setDrills(d);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePracticeDomain = (domainSlug: string) => {
    setDomainFilterFromTrack(domainSlug);
    setActiveTab('workbench');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Studio Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-400/20 text-indigo-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              HSK 3.0 Advanced &amp; Specialized Chinese
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Xưởng Luyện Dịch Trung – Việt &amp; Tiếng Trung Chuyên Ngành
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Chinh phục chuẩn HSK 3.0 (Cấp 7–9) với kỹ năng biên dịch đa chiều và gói thuật ngữ chuyên sâu cho Kỹ sư CNTT, Thương mại Logistics, Du lịch.
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('workbench')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'workbench'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Xưởng Luyện Dịch ({drills.length} bài)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specialized')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'specialized'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Tiếng Trung Chuyên Ngành &amp; HSK 7–9 ({packs.length} gói)</span>
          </button>
        </div>
      </div>

      {activeTab === 'workbench' ? (
        drills.length > 0 ? (
          <TranslationWorkbench
            drills={drills}
            initialDomainFilter={domainFilterFromTrack}
            user={user}
            onOpenDictionary={onOpenDictionary}
          />
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <Languages className="w-4 h-4 animate-pulse" />
            <span>Đang tải bài tập luyện dịch...</span>
          </div>
        )
      ) : (
        <SpecializedTrackExplorer
          packs={packs}
          user={user}
          onPracticeDomainTranslation={handlePracticeDomain}
        />
      )}
    </div>
  );
};

