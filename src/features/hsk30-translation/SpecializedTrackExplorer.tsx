import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Truck,
  Plane,
  GraduationCap,
  Volume2,
  BookmarkPlus,
  Check,
  Search,
  ArrowRight,
  Languages,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  saveDomainTermToSRS,
  type SpecializedDomainPack,
  type DomainTerminologyItem,
} from '../../services/translationStudioService.ts';

interface SpecializedTrackExplorerProps {
  packs: SpecializedDomainPack[];
  user?: any;
  onPracticeDomainTranslation?: (domainSlug: string) => void;
}

const DOMAIN_ICON_MAP: Record<string, React.ReactNode> = {
  'it-software': <Cpu className="w-4 h-4" />,
  'ecommerce-logistics': <Truck className="w-4 h-4" />,
  'tourism-hospitality': <Plane className="w-4 h-4" />,
  'hsk-7-9-academic': <GraduationCap className="w-4 h-4" />,
};

export const SpecializedTrackExplorer: React.FC<SpecializedTrackExplorerProps> = ({
  packs,
  user,
  onPracticeDomainTranslation,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(packs[0]?.slug || 'it-software');
  const [query, setQuery] = useState('');
  const [savedTerms, setSavedTerms] = useState<Set<string>>(() => new Set());

  const activePack = useMemo(
    () => packs.find((p) => p.slug === selectedSlug) || packs[0] || null,
    [packs, selectedSlug]
  );

  const filteredTerms = useMemo(() => {
    if (!activePack) return [];
    const q = query.trim().toLowerCase();
    if (!q) return activePack.terminology_list;

    return activePack.terminology_list.filter((t) =>
      [t.simplified, t.pinyin, t.han_viet, t.meaning_vi, t.english_equiv]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [activePack, query]);

  const handleSaveTerm = async (term: DomainTerminologyItem) => {
    await saveDomainTermToSRS(term, user);
    setSavedTerms((prev) => new Set(prev).add(term.simplified));
  };

  if (!activePack) return null;

  return (
    <div className="space-y-5">
      {/* Domain Track Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {packs.map((pack) => {
          const isActive = pack.slug === activePack.slug;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => setSelectedSlug(pack.slug)}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer space-y-1.5 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`p-2 rounded-xl ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {DOMAIN_ICON_MAP[pack.slug] || <Languages className="w-4 h-4" />}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {pack.terminology_list.length} thuật ngữ
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug pt-1">
                {pack.title_vi}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Pack Header + Search */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {activePack.title_vi}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">{activePack.description_vi}</p>
          </div>

          {onPracticeDomainTranslation && (
            <button
              type="button"
              onClick={() => onPracticeDomainTranslation(activePack.slug)}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs shadow-sm transition cursor-pointer"
            >
              <span>Luyện dịch chuyên ngành này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm thuật ngữ (tiếng Trung, Pinyin, tiếng Anh hoặc tiếng Việt)..."
            className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Terminology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
          const isSaved = savedTerms.has(term.simplified);
          return (
            <div
              key={term.simplified}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        {term.simplified}
                      </span>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                        {term.english_equiv}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                      {term.pinyin} · <span className="text-amber-700 uppercase">{term.han_viet}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakChinese(term.simplified, 0.85)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveTerm(term)}
                      disabled={isSaved}
                      className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                      <span>{isSaved ? 'Đã lưu' : 'Lưu SRS'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-800">{term.meaning_vi}</p>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 leading-relaxed">
                      {term.sample_sentence_zh}
                    </p>
                    <button
                      type="button"
                      onClick={() => speakChinese(term.sample_sentence_zh, 0.85)}
                      className="p-1 text-slate-400 hover:text-indigo-600 shrink-0 cursor-pointer"
                      title="Nghe câu ví dụ"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 italic">{term.sample_sentence_vi}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

