import React from 'react';
import {
  LayoutGrid,
  CreditCard,
  Sparkles,
  Filter,
  Zap,
  Download,
  Layers,
  BookOpen,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { TOPIC_FILTERS } from '../../data/chineseData';
import { HSK_30_BANDS } from '../../services/hsk30FlashcardDeckService.js';

export default function VocabularyFilterBar({
  hskLevelProgress,
  activeHskProgress,
  selectedHsk,
  setSelectedHsk,
  setCorpusPage,
  setCurrentIndex,
  viewMode,
  setViewMode,
  filteredCount,
  handleExportCsv,
  showMobileFilters,
  setShowMobileFilters,
  renderSearchAndTopicControls,
  lengthFilter,
  setLengthFilter,
  corpusMode,
  allVocabList,
  hskCounts,
  renderCorpusToggleBar,
  isPersonalStatusFilter,
  corpusLoading,
  corpusTotalCount,
  corpusSource,
  corpusPage,
  corpusTotalPages,
  statusFilter,
  setStatusFilter,
  srsStats,
  customVocabCount,
  hideMastered,
  setHideMastered,
  selectedTopic,
  setSelectedTopic,
}) {
  return (
    <>
      {/* 2. BẢNG TIẾN ĐỘ LÀM CHỦ TỪ VỰNG THEO CẤP ĐỘ HSK (HSK 1 -> HSK 7-9) */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-[#E85D3F]" />
              <span>Tiến Độ Làm Chủ Từ Vựng Theo Cấp Độ HSK (HSK 1 – HSK 9)</span>
            </h2>
            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
              Bấm vào từng thẻ cấp độ để lọc nhanh bộ Flashcard của riêng cấp đó (Bấm lần nữa để xem tất cả).
            </p>
          </div>

          {activeHskProgress && (
            <div className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <span>
                Đang lọc <strong className="text-[#E85D3F]">{activeHskProgress.label}</strong>:{' '}
                <strong className="text-[#45B97C]">{activeHskProgress.mastered}</strong>/
                {activeHskProgress.denominator} từ ({activeHskProgress.masteredPct}%)
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedHsk('all');
                  setCorpusPage(1);
                  setCurrentIndex(0);
                }}
                className="text-[11px] text-[#E85D3F] hover:underline ml-1 cursor-pointer"
              >
                Bỏ lọc
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {hskLevelProgress.map((tier) => {
            const isSelected = selectedHsk === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedHsk(isSelected ? 'all' : tier.id);
                  setCorpusPage(1);
                  setCurrentIndex(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#E85D3F] ring-2 ring-[#E85D3F]/30 shadow-md scale-[1.02]'
                    : 'bg-[#FFF9F2]/60 dark:bg-[#131B24]/60 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-[#243447] dark:text-white">
                    {tier.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#748092] dark:text-[#94A3B8]">
                    {tier.masteredPct}%
                  </span>
                </div>

                {/* Thanh Progress 2 tầng: Đã nhớ vững + Đang ôn tập */}
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex">
                  <div
                    className={`h-full bg-gradient-to-r ${tier.color} transition-all duration-500`}
                    style={{ width: `${tier.masteredPct}%` }}
                    title={`Đã nhớ vững: ${tier.mastered} từ`}
                  />
                  {tier.learningPct > 0 && (
                    <div
                      className="h-full bg-amber-400/80 transition-all duration-500"
                      style={{ width: `${tier.learningPct}%` }}
                      title={`Đang ôn: ${tier.learning} từ`}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#748092] dark:text-[#94A3B8]">
                  <span>
                    <strong className="text-[#243447] dark:text-white">
                      {tier.mastered}
                    </strong>
                    /{tier.denominator}
                  </span>
                  {tier.dueToday > 0 ? (
                    <span className="text-rose-500 font-bold">⏰ {tier.dueToday} ôn</span>
                  ) : (
                    <span className="truncate">{tier.badge}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SEARCH, FILTER TOOLBAR & VIEW MODE SWITCHER */}
      <div className="space-y-4 bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
        {/* Row 1: Primary View Mode Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1E5D8]/80 dark:border-[#2B3A4F]/80">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF9F2] dark:bg-[#131B24] p-1.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] w-full lg:w-auto">
            {[
              { id: 'flashcard', label: 'Thẻ lật', icon: CreditCard, title: 'Xem dạng thẻ lật Spaced Repetition', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'grid', label: 'Danh sách', icon: LayoutGrid, title: 'Xem dạng lưới danh sách đầy đủ', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'quiz', label: 'Trắc nghiệm', icon: Zap, title: 'Luyện phản xạ trắc nghiệm nhanh', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'dictionary', label: 'Từ điển CC-CEDICT', icon: BookOpen, title: 'Tra cứu kho từ điển CC-CEDICT', activeCls: 'bg-[#E85D3F] text-white shadow-sm' },
              { id: 'workspace', label: 'Workspace SRS', icon: Sparkles, title: 'Vocabulary Workspace: Quản lý Decks & Ẩn từ đã thuộc', activeCls: 'bg-emerald-600 text-white shadow-sm' },
              { id: 'chengyu', label: 'Thành ngữ & Collocations', icon: Layers, title: 'Khám phá Thành ngữ 4 chữ & Kết hợp từ cố định', activeCls: 'bg-amber-600 text-white shadow-sm' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setViewMode(mode.id);
                  }}
                  title={mode.title}
                  className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? mode.activeCls
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            title="Tải danh sách từ vựng hiện tại dạng file CSV (Hỗ trợ Anki, Excel)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-[#FDEEEB] dark:hover:bg-[#2D1E1B] text-[#748092] hover:text-[#E85D3F] text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 ml-auto"
          >
            <Download size={14} />
            <span>Xuất CSV ({filteredCount})</span>
          </button>
        </div>

        {/* Mobile Filter Toggle Button (One-handed UX) */}
        <div className="flex lg:hidden items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="min-h-[44px] flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white active:scale-95 transition-all cursor-pointer"
          >
            <Filter size={14} className="text-[#E85D3F]" />
            <span>
              {showMobileFilters ? 'Thu gọn bộ lọc & tìm kiếm' : 'Mở bộ lọc, tìm kiếm & HSK'}
            </span>
          </button>
        </div>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
          {/* Row 2: Wide Search Bar + Topic Select + Length Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {renderSearchAndTopicControls()}

            <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-1 bg-[#FFF9F2] dark:bg-[#131B24] p-1 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'single', label: 'Từ đơn' },
                { id: 'compound', label: 'Từ ghép' },
              ].map((lf) => (
                <button
                  key={lf.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setLengthFilter(lf.id);
                    setCurrentIndex(0);
                  }}
                  className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    lengthFilter === lf.id
                      ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs'
                      : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  {lf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: HSK Level Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
              Cấp độ HSK:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                {
                  id: 'all',
                  label: 'Tất cả HSK',
                  count: corpusMode ? HSK_30_BANDS.all.limit : allVocabList.length,
                },
                {
                  id: 'HSK 1',
                  label: 'HSK 1',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 1'].limit
                    : hskCounts['HSK 1'] || 0,
                },
                {
                  id: 'HSK 2',
                  label: 'HSK 2',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 2'].limit
                    : hskCounts['HSK 2'] || 0,
                },
                {
                  id: 'HSK 3',
                  label: 'HSK 3',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 3'].limit
                    : hskCounts['HSK 3'] || 0,
                },
                {
                  id: 'HSK 4',
                  label: 'HSK 4',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 4'].limit
                    : hskCounts['HSK 4'] || 0,
                },
                {
                  id: 'HSK 5',
                  label: 'HSK 5',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 5'].limit
                    : hskCounts['HSK 5'] || 0,
                },
                {
                  id: 'HSK 6',
                  label: 'HSK 6',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 6'].limit
                    : hskCounts['HSK 6'] || 0,
                },
                {
                  id: 'HSK 5-6',
                  label: 'Thành ngữ / Cao cấp',
                  count:
                    (hskCounts['HSK 5-6'] || 0) +
                    (hskCounts['HSK 5'] || 0) +
                    (hskCounts['HSK 6'] || 0),
                },
                {
                  id: 'HSK 7-9',
                  label: 'HSK 7–9',
                  count: corpusMode
                    ? HSK_30_BANDS['HSK 7-9'].limit
                    : hskCounts['HSK 7-9'] || 0,
                },
              ].map((tab) => {
                const isActive = selectedHsk === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedHsk(tab.id);
                      setCorpusPage(1);
                      setCurrentIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#E85D3F] text-white shadow-xs scale-[1.02]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-black/5 dark:bg-white/10 text-[#748092]'
                      }`}
                    >
                      {tab.count.toLocaleString('vi-VN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Kho Flashcards 11.092 từ chuẩn HSK 3.0 */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] px-3.5 py-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {renderCorpusToggleBar()}
              <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                {isPersonalStatusFilter
                  ? 'Đang lọc trên toàn bộ Sổ từ SRS cá nhân của bạn'
                  : corpusMode
                    ? `${
                        corpusLoading
                          ? 'Đang tải lô thẻ...'
                          : `Đang học ${corpusTotalCount.toLocaleString('vi-VN')} từ (${
                              corpusSource === 'supabase_hsk30_corpus'
                                ? 'Cloud 11.092 từ'
                                : 'Offline HSK 1–9'
                            })`
                      }`
                    : 'Bật để học toàn bộ 11.092 từ HSK 3.0 theo từng lô 50 thẻ'}
              </span>
            </div>

            {corpusMode && !isPersonalStatusFilter && (
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  disabled={corpusPage <= 1 || corpusLoading}
                  onClick={() => {
                    setCorpusPage((p) => Math.max(1, p - 1));
                    setCurrentIndex(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] disabled:opacity-40 cursor-pointer"
                >
                  Lô trước
                </button>
                <span className="px-2 text-[11px] text-[#243447] dark:text-slate-200">
                  Lô {corpusPage} / {corpusTotalPages}
                </span>
                <button
                  type="button"
                  disabled={corpusPage >= corpusTotalPages || corpusLoading}
                  onClick={() => {
                    setCorpusPage((p) => Math.min(corpusTotalPages, p + 1));
                    setCurrentIndex(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] disabled:opacity-40 cursor-pointer"
                >
                  Lô tiếp (50 từ)
                </button>
              </div>
            )}
          </div>

          {/* Row 5: Status Filter Chips (Full-width, zero clipping) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
              Trạng thái:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'due', label: `⏰ Cần ôn (${srsStats.dueCount})` },
                { id: 'leeches', label: `⚠️ Hay quên (${srsStats.leechCount})` },
                { id: 'custom', label: `🌟 Tự thêm (${customVocabCount})` },
                { id: 'remembered', label: '✅ Đã thuộc vững' },
                { id: 'review', label: 'Đang ôn' },
                { id: 'srs_priority', label: '🔥 AI Ưu tiên ôn' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setStatusFilter(f.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24] shadow-xs'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {statusFilter === 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setHideMastered((prev) => !prev);
                    setCurrentIndex(0);
                  }}
                  title="Ẩn các từ bạn đã đánh dấu Tốt/Dễ để không lặp lại"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ml-auto ${
                    hideMastered
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  {hideMastered ? '🙈 Đang ẩn từ đã thuộc' : '👁️ Hiện cả từ đã thuộc'}
                </button>
              )}
            </div>
          </div>

          {/* Row 6: Topics Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
            <Filter size={13} className="text-[#748092] shrink-0" />
            {TOPIC_FILTERS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedTopic(topic);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
