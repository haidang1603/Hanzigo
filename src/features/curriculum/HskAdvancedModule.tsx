import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  BookmarkPlus,
  CheckCircle2,
  Compass,
  GraduationCap,
  HelpCircle,
  Languages,
  Scale,
  Search,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import DashboardWidget from '../../components/dashboard/DashboardWidget.jsx';
import {
  completeHsk7to9Module,
  exportHskAdvancedItemToSrs,
  getCompletedHsk7to9Modules,
  HSK_7_9_GRAMMAR,
  HSK_7_9_MODULES,
  HSK_7_9_STANDARD_SPEC,
  HSK_7_9_SYNONYM_GROUPS,
  HSK_7_9_VOCABULARY,
  lookupHsk7to9OrCedict,
  type DictionaryPopupResult,
  type Hsk7to9ModuleCompletion,
  type HskAdvancedDomain,
  type HskAdvancedVocabItem,
} from '../../data/hsk7to9CurriculumData.ts';
import { playSuccessSound, speakChinese, stopChineseSpeech } from '../../utils/audio.js';

export interface HskAdvancedModuleProps {
  user?: { id?: string | null } | null;
  onSwitchToFoundation?: () => void;
}

const CONNOTATION_STYLE: Record<string, string> = {
  褒义: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  贬义: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  中性: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export default function HskAdvancedModule({
  user = null,
  onSwitchToFoundation,
}: HskAdvancedModuleProps) {
  const [domainFilter, setDomainFilter] = useState<HskAdvancedDomain | 'all'>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    HSK_7_9_MODULES[0].id
  );
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [lookupInput, setLookupInput] = useState<string>('');
  const [popupResult, setPopupResult] = useState<DictionaryPopupResult | null>(null);
  const [exportedMap, setExportedMap] = useState<Record<string, boolean>>({});
  const [completedModules, setCompletedModules] = useState<Record<string, Hsk7to9ModuleCompletion>>(() =>
    getCompletedHsk7to9Modules(user)
  );
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completionToast, setCompletionToast] = useState<string | null>(null);

  useEffect(() => {
    setCompletedModules(getCompletedHsk7to9Modules(user));
  }, [user]);

  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCompletionToast(null);
    stopChineseSpeech();
    setSpeakingKey(null);
  }, [selectedModuleId]);

  const handleToggleSpeech = useCallback(
    (key: string, text: string) => {
      if (speakingKey === key) {
        stopChineseSpeech();
        setSpeakingKey(null);
        return;
      }
      stopChineseSpeech();
      setSpeakingKey(key);
      speakChinese(text, {
        rate: 0.9,
        onEnd: () => setSpeakingKey((prev) => (prev === key ? null : prev)),
        onError: () => setSpeakingKey((prev) => (prev === key ? null : prev)),
      });
    },
    [speakingKey]
  );

  const filteredModules = useMemo(() => {
    if (domainFilter === 'all') return HSK_7_9_MODULES;
    const matched = HSK_7_9_MODULES.filter((m) => m.domain === domainFilter);
    return matched.length > 0 ? matched : HSK_7_9_MODULES;
  }, [domainFilter]);

  const activeModule = useMemo(
    () =>
      filteredModules.find((m) => m.id === selectedModuleId) ??
      filteredModules[0],
    [filteredModules, selectedModuleId]
  );

  const moduleVocab = useMemo(() => {
    const idSet = new Set(activeModule.vocabIds);
    return HSK_7_9_VOCABULARY.filter((v) => idSet.has(v.id));
  }, [activeModule]);

  const moduleGrammar = useMemo(() => {
    const idSet = new Set(activeModule.grammarIds);
    return HSK_7_9_GRAMMAR.filter((g) => idSet.has(g.id));
  }, [activeModule]);

  const moduleSynonyms = useMemo(() => {
    const idSet = new Set(activeModule.synonymGroupIds);
    return HSK_7_9_SYNONYM_GROUPS.filter((s) => idSet.has(s.id));
  }, [activeModule]);

  const handleLookup = useCallback(async (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    const hit = await lookupHsk7to9OrCedict(cleaned);
    if (hit) {
      setPopupResult(hit);
    }
  }, []);

  const handleExportSrs = useCallback(
    async (item: HskAdvancedVocabItem | DictionaryPopupResult) => {
      const payload =
        'meaningVi' in item
          ? item
          : {
              id: `adv_${item.hanzi}`,
              hanzi: item.hanzi,
              pinyin: item.pinyin,
              meaningVi: item.meaning,
              hskBand: (item.hskBand === 8 || item.hskBand === 9 ? item.hskBand : 7) as 7 | 8 | 9,
              domain: activeModule.domain,
            };

      const res = await exportHskAdvancedItemToSrs(payload, user);
      setExportedMap((prev) => ({
        ...prev,
        [payload.hanzi]: res.exported,
        [res.cardId]: res.exported,
      }));
    },
    [activeModule.domain, user]
  );

  const quizQuestions = activeModule.quizQuestions ?? [];
  const quizCorrectCount = useMemo(
    () =>
      quizQuestions.filter((q) => quizAnswers[q.id] === q.correctIndex).length,
    [quizQuestions, quizAnswers]
  );
  const quizScorePercent =
    quizQuestions.length > 0
      ? Math.round((quizCorrectCount / quizQuestions.length) * 100)
      : 100;

  const handleSubmitQuiz = useCallback(async () => {
    setQuizSubmitted(true);
    const { xpAwarded, progress } = await completeHsk7to9Module(
      activeModule,
      quizScorePercent,
      user
    );
    setCompletedModules(progress);
    playSuccessSound();
    setCompletionToast(
      `Đã hoàn thành "${activeModule.titleVi}" (${quizScorePercent}%) · +${xpAwarded} XP`
    );
  }, [activeModule, quizScorePercent, user]);

  const completedCount = Object.keys(completedModules).length;

  return (
    <section aria-label="HSK 7-9 Advanced Professional Band" className="space-y-6">
      {/* Header & Band Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#243447] to-[#1a2533] text-white shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <GraduationCap size={14} />
              <span>{HSK_7_9_STANDARD_SPEC.standardName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Advanced Professional Band (HSK 7–9 · {HSK_7_9_STANDARD_SPEC.targetAdvancedVocabCount.toLocaleString()} từ nâng cao)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Đọc hiểu chuyên đề dài (800–1.500 chữ), phân biệt sắc thái từ gần nghĩa (近义词辨析), thành ngữ & cầu nối văn ngôn – hiện đại.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onSwitchToFoundation && (
              <button
                type="button"
                onClick={onSwitchToFoundation}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                ← Foundation-Intermediate (HSK 1–6)
              </button>
            )}
            <span className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold">
              Advanced Band (HSK 7–9)
            </span>
          </div>
        </div>

        {/* Domain Filter Pills + Instant CC-CEDICT Lookup */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDomainFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                domainFilter === 'all'
                  ? 'bg-white text-[#243447]'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              Tất cả chuyên đề
            </button>
            {HSK_7_9_STANDARD_SPEC.domains.map((dom) => (
              <button
                key={dom.key}
                type="button"
                onClick={() => setDomainFilter(dom.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  domainFilter === dom.key
                    ? 'bg-white text-[#243447]'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {dom.labelVi}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 border border-white/15">
            <Search size={14} className="text-slate-300" />
            <input
              type="text"
              aria-label="Tra cứu CC-CEDICT & HSK 7-9"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleLookup(lookupInput);
              }}
              placeholder="Tra từ HSK 7–9 / CC-CEDICT..."
              className="bg-transparent text-xs text-white placeholder:text-slate-300 focus:outline-none w-44 sm:w-56"
            />
            <button
              type="button"
              onClick={() => void handleLookup(lookupInput)}
              className="px-2.5 py-1 rounded-lg bg-[#E85D3F] hover:bg-[#d44d30] text-[11px] font-bold cursor-pointer"
            >
              Tra nhanh
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar + Module Selector Cards */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <span className="font-bold text-[#243447] dark:text-gray-200 inline-flex items-center gap-1.5">
            <Award size={15} className="text-[#E85D3F]" />
            Tiến độ chuyên đề HSK 7–9: {completedCount}/{HSK_7_9_MODULES.length} bài đã hoàn thành
          </span>
          <div className="w-40 h-2 rounded-full bg-[#EFE4D6] dark:bg-[#2B3A4F] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E85D3F] to-amber-500 transition-all duration-300"
              style={{ width: `${Math.round((completedCount / Math.max(1, HSK_7_9_MODULES.length)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {filteredModules.map((mod) => {
            const isSelected = mod.id === activeModule.id;
            const modCompletion = completedModules[mod.id];
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModuleId(mod.id)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-[#FFF5F2] dark:bg-[#1E293B] border-[#E85D3F] shadow-sm'
                    : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] font-extrabold">
                  <span className="px-2 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F]">
                    HSK {mod.hskBand}
                  </span>
                  {modCompletion ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">
                      <CheckCircle2 size={11} />
                      {modCompletion.scorePercent}%
                    </span>
                  ) : (
                    <span className="text-[#748092] dark:text-gray-400 truncate">
                      {mod.domainLabelVi}
                    </span>
                  )}
                </div>
                <div className="text-sm font-extrabold text-[#243447] dark:text-white line-clamp-2">
                  {mod.titleZh}
                </div>
                <div className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2">
                  {mod.titleVi}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Dictionary Pop-up Card */}
      {popupResult && (
        <div
          role="dialog"
          aria-label="Dictionary Popup"
          className="p-4 rounded-2xl bg-amber-50/80 dark:bg-[#1E293B] border-2 border-[#E85D3F] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-extrabold text-[#243447] dark:text-white">
                {popupResult.hanzi}
              </span>
              <span className="text-xs font-semibold text-[#E85D3F]">
                {popupResult.pinyin}
              </span>
              {popupResult.hskBand && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  HSK {popupResult.hskBand}
                </span>
              )}
              {popupResult.connotationLabelZh && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    CONNOTATION_STYLE[popupResult.connotationLabelZh] ?? ''
                  }`}
                >
                  {popupResult.connotationLabelZh}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#243447] dark:text-gray-200">
              {popupResult.meaning}
            </p>
            {popupResult.collocations && popupResult.collocations.length > 0 && (
              <p className="text-[11px] text-[#748092] dark:text-gray-400">
                Collocations: {popupResult.collocations.join(' · ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={Boolean(exportedMap[popupResult.hanzi])}
              onClick={() => void handleExportSrs(popupResult)}
              className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] disabled:opacity-60 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
            >
              <BookmarkPlus size={13} />
              <span>
                {exportedMap[popupResult.hanzi] ? 'Đã thêm SRS' : 'Export to SRS Deck'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPopupResult(null)}
              aria-label="Đóng từ điển nhanh"
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#748092] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Long-Form Thematic Reading + Rhetorical Analysis */}
      <DashboardWidget
        title={activeModule.titleZh}
        subtitle={`${activeModule.titleVi} · Nhấn vào thuật ngữ bên dưới để tra nhanh & xuất sang SRS`}
        icon={BookOpen}
        action={
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer inline-flex items-center gap-1.5"
          >
            <Languages size={14} className="text-[#E85D3F]" />
            <span>{showTranslation ? 'Ẩn song ngữ VI' : 'Hiện song ngữ VI'}</span>
          </button>
        }
      >
        <div className="space-y-4">
          {/* Interactive Key Terms Strip */}
          <div className="flex flex-wrap gap-2">
            {moduleVocab.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => void handleLookup(v.hanzi)}
                className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{v.hanzi}</span>
                <span className="text-[10px] text-[#E85D3F]">HSK {v.hskBand}</span>
              </button>
            ))}
          </div>

          {/* Bilingual Paragraphs */}
          <div className="space-y-4">
            {activeModule.paragraphs.map((p) => (
              <div
                key={p.index}
                className="p-4 rounded-2xl bg-[#FAF6F0]/70 dark:bg-[#0F172A]/70 border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    Đoạn {p.index} · {p.discourseRole}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleSpeech(`${activeModule.id}_p_${p.index}`, p.zh)}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[11px] font-bold text-[#243447] dark:text-gray-200 cursor-pointer inline-flex items-center gap-1"
                  >
                    {speakingKey === `${activeModule.id}_p_${p.index}` ? (
                      <>
                        <Square size={11} className="text-[#E85D3F] fill-[#E85D3F]" />
                        <span>Dừng</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} className="text-[#E85D3F]" />
                        <span>Nghe đoạn</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-[#243447] dark:text-gray-100 font-medium">
                  {p.zh}
                </p>
                {showTranslation && (
                  <p className="text-xs sm:text-sm leading-relaxed text-[#5B6B7F] dark:text-[#94A3B8] border-t border-[#EFE4D6] dark:border-[#2B3A4F] pt-2">
                    {p.vi}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Rhetorical Devices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeModule.rhetoricalDevices.map((rd, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1"
              >
                <div className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>{rd.deviceZh} — {rd.deviceVi}</span>
                </div>
                <p className="text-xs text-[#243447] dark:text-gray-200 italic">
                  “{rd.excerptZh}”
                </p>
                <p className="text-[11px] text-[#748092] dark:text-gray-400">
                  {rd.analysisVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardWidget>

      {/* Register & Nuance Comparison Cards (近义词辨析) */}
      <DashboardWidget
        title="Register & Nuance Comparison Cards (近义词辨析)"
        subtitle="Phân biệt sắc thái trang trọng, kết hợp từ (collocations) & nghĩa 褒义/贬义/中性"
        icon={Scale}
      >
        <div className="space-y-5">
          {moduleSynonyms.map((group) => (
            <div key={group.id} className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#243447] dark:text-white">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.word}
                    className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-extrabold text-[#243447] dark:text-white">
                          {item.word}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-[#E85D3F]">
                          {item.pinyin}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          CONNOTATION_STYLE[item.connotation] ?? ''
                        }`}
                      >
                        {item.connotation}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                      Văn phong: {item.register}
                    </div>
                    <p className="text-xs text-[#5B6B7F] dark:text-gray-300">
                      {item.nuanceVi}
                    </p>
                    <div className="text-[11px] text-[#748092] dark:text-gray-400">
                      <strong>Kết hợp từ:</strong> {item.collocationConstraints}
                    </div>
                    <div className="text-xs text-[#243447] dark:text-gray-200 pt-1 border-t border-[#EFE4D6] dark:border-[#2B3A4F]">
                      {item.exampleZh}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardWidget>

      {/* Advanced Grammar: 书面语 vs 口语 & Classical Bridges */}
      <DashboardWidget
        title="Ngữ pháp Cao cấp: 书面语 vs. 口语 & Cầu nối Văn ngôn"
        subtitle="Chuyển đổi văn phong trang trọng và cấu trúc cổ văn thường gặp trong HSK 7–9"
        icon={Compass}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleGrammar.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-[#E85D3F]">
                  {g.pattern}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-bold text-[10px]">
                  HSK {g.hskBand}
                </span>
              </div>
              <div className="font-bold text-[#243447] dark:text-white">
                {g.titleVi}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    书面语 (Văn viết):
                  </span>
                  <span className="text-[#243447] dark:text-gray-200">
                    {g.formalWrittenForm}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#EFE4D6] dark:border-[#2B3A4F]">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">
                    口语 (Khẩu ngữ):
                  </span>
                  <span className="text-[#243447] dark:text-gray-200">
                    {g.spokenEquivalent}
                  </span>
                </div>
              </div>
              <p className="text-[#748092] dark:text-gray-400">
                <strong>Cầu nối văn ngôn:</strong> {g.classicalBridge}
              </p>
              <p className="text-[#243447] dark:text-gray-200 italic pt-1 border-t border-[#EFE4D6] dark:border-[#2B3A4F]">
                {g.exampleZh} — {g.exampleVi}
              </p>
            </div>
          ))}
        </div>

        {/* One-click SRS export summary for module vocab */}
        <div className="mt-4 pt-4 border-t border-[#EFE4D6] dark:border-[#2B3A4F] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#748092] dark:text-gray-400">
            Xuất nhanh toàn bộ từ vựng trọng tâm chuyên đề này vào SRS Deck:
          </span>
          <button
            type="button"
            onClick={() => {
              void Promise.all(moduleVocab.map((v) => handleExportSrs(v)));
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            <span>Xuất {moduleVocab.length} từ chuyên đề sang SRS</span>
          </button>
        </div>
      </DashboardWidget>

      {/* Interactive HSK 7-9 Comprehension & Register Quiz */}
      {quizQuestions.length > 0 && (
        <DashboardWidget
          title="Luyện tập & Kiểm tra Năng lực Chuyên đề"
          subtitle={`Hoàn thành ${quizQuestions.length} câu hỏi chuẩn HSK ${activeModule.hskBand} để ghi nhận tiến độ, XP và biểu đồ năng lực`}
          icon={HelpCircle}
        >
          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => {
              const chosen = quizAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
                      Câu {qIdx + 1}: {q.promptVi}
                    </p>
                  </div>
                  {q.promptZh && (
                    <p className="text-sm font-semibold text-[#E85D3F] bg-white dark:bg-[#1E293B] px-3 py-2 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F]">
                      {q.promptZh}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = chosen === optIdx;
                      const isRight = optIdx === q.correctIndex;
                      let optionStyle =
                        'bg-white dark:bg-[#1E293B] border-[#EFE4D6] dark:border-[#2B3A4F] text-[#243447] dark:text-gray-200 hover:border-[#E85D3F]';
                      if (quizSubmitted) {
                        if (isRight) {
                          optionStyle =
                            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (isPicked && !isRight) {
                          optionStyle =
                            'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                        }
                      } else if (isPicked) {
                        optionStyle =
                          'bg-[#FFF5F2] dark:bg-[#2D1E1B] border-[#E85D3F] text-[#E85D3F] font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <span className="font-extrabold mr-1.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p className="text-[11px] text-[#5B6B7F] dark:text-gray-300 bg-white/80 dark:bg-[#1E293B] p-2.5 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F]">
                      <strong>Giải thích:</strong> {q.explanationVi}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {completionToast ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 size={15} />
                  <span>{completionToast}</span>
                </div>
              ) : (
                <span className="text-xs text-[#748092] dark:text-gray-400">
                  Đã chọn {Object.keys(quizAnswers).length}/{quizQuestions.length} câu
                </span>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {quizSubmitted && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                      setCompletionToast(null);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[#EFE4D6] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white hover:bg-[#FAF6F0] dark:hover:bg-[#1E293B] cursor-pointer"
                  >
                    Làm lại
                  </button>
                )}
                <button
                  type="button"
                  disabled={
                    quizSubmitted ||
                    Object.keys(quizAnswers).length < quizQuestions.length
                  }
                  onClick={() => void handleSubmitQuiz()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] disabled:opacity-50 text-white text-xs font-extrabold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Award size={14} />
                  <span>
                    {quizSubmitted
                      ? `Điểm: ${quizCorrectCount}/${quizQuestions.length} (${quizScorePercent}%)`
                      : 'Nộp bài & Hoàn thành (+XP)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </DashboardWidget>
      )}
    </section>
  );
}

