import React from 'react';
import {
  Search,
  RotateCw,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  PenTool,
  Mic,
  BookmarkPlus,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import AudioButton from '../AudioButton';
import { playClickSound } from '../../utils/audio';
import { DICT_HSK_LEVELS, GRID_PAGE_SIZE } from './vocabularyConstants';

export function VocabularyDictionaryView({
  dictQuery,
  setDictQuery,
  dictHsk,
  setDictHsk,
  dictPage,
  setDictPage,
  dictResults,
  dictTotal,
  dictTotalPages,
  dictLoading,
  dictSource,
  savedDictWords,
  setSelectedDictWord,
  handleSaveDictToSrs,
}) {
  return (
    <div className="space-y-6">
      {/* Dictionary Search & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]"
            />
            <input
              type="text"
              placeholder="Tra cứu chữ Hán, Pinyin hoặc nghĩa..."
              value={dictQuery}
              onChange={(e) => {
                setDictQuery(e.target.value);
                setDictPage(1);
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
            {dictQuery && (
              <button
                onClick={() => {
                  setDictQuery('');
                  setDictPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* HSK Filter for Dictionary */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#748092] mr-1">
              Bộ lọc HSK:
            </span>
            {DICT_HSK_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  playClickSound();
                  setDictHsk(lvl);
                  setDictPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dictHsk === lvl
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                }`}
              >
                {lvl === 'ALL' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Results metadata count bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#748092] dark:text-[#94A3B8] pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              Tìm thấy{' '}
              <strong className="text-[#243447] dark:text-white">
                {dictTotal.toLocaleString()}
              </strong>{' '}
              mục từ
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              {dictSource === 'cloud_rpc'
                ? '⚡ PostgreSQL GIN Trigram'
                : dictSource === 'cloud_table'
                  ? '☁️ Supabase Cloud'
                  : '📦 Dữ liệu chuẩn hóa'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Trang <strong>{dictPage}</strong> / {dictTotalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Dictionary Results Grid */}
      {dictLoading ? (
        <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E85D3F] border-t-transparent mb-3" />
          <p className="text-xs font-bold text-[#748092]">
            Đang tải dữ liệu từ kho từ điển CC-CEDICT...
          </p>
        </div>
      ) : dictResults.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-[#243447] dark:text-white">
            Không tìm thấy từ vựng phù hợp
          </h3>
          <p className="text-xs text-[#748092] max-w-md mx-auto">
            Hãy thử tìm bằng Pinyin không dấu, chữ Hán giản thể/phồn thể hoặc kiểm tra lại cấp độ HSK đã chọn.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dictResults.map((item, idx) => {
              const isSaved = savedDictWords.has(item.hanzi || item.simplified);
              return (
                <div
                  key={item.id || idx}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            {item.level}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            item.qualityStatus === 'verified_human'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.qualityStatus === 'verified_human'
                            ? '✓ Đã kiểm duyệt'
                            : 'CC-CEDICT'}
                        </span>
                      </div>
                      <AudioButton
                        text={item.hanzi || item.simplified}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                        {item.hanzi || item.simplified}
                      </span>
                      {item.traditional &&
                        item.traditional !== (item.hanzi || item.simplified) && (
                          <span
                            className="font-['Noto_Serif_SC'] text-sm text-slate-400"
                            title="Chữ phồn thể"
                          >
                            ({item.traditional})
                          </span>
                        )}
                      <span className="text-sm font-bold text-[#E85D3F]">
                        {item.pinyin}
                      </span>
                    </div>

                    {item.hanviet && (
                      <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                        Hán-Việt: {item.hanviet}
                      </p>
                    )}

                    {item.meaningVi ? (
                      <p className="text-xs font-bold text-[#45B97C] mt-1 line-clamp-2">
                        {item.meaningVi}
                      </p>
                    ) : null}

                    {item.meaningEn ? (
                      <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] mt-1 line-clamp-2 italic">
                        {item.meaningEn}
                      </p>
                    ) : null}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedDictWord(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-[#243447] dark:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Info size={13} />
                      <span>Chi tiết</span>
                    </button>

                    <button
                      onClick={(e) => handleSaveDictToSrs(e, item)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-[#E85D3F] hover:bg-[#CB4529] text-white shadow-xs active:scale-95'
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck size={13} />
                      ) : (
                        <BookmarkPlus size={13} />
                      )}
                      <span>{isSaved ? 'Đã lưu SRS' : '+ Thêm Flashcard'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              disabled={dictPage <= 1}
              onClick={() => {
                playClickSound();
                setDictPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
            >
              « Trang đầu
            </button>
            <button
              disabled={dictPage <= 1}
              onClick={() => {
                playClickSound();
                setDictPage((prev) => Math.max(1, prev - 1));
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-3 py-2 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 rounded-xl border border-orange-200 dark:border-orange-800">
              Trang {dictPage} / {dictTotalPages}
            </span>
            <button
              disabled={dictPage >= dictTotalPages}
              onClick={() => {
                playClickSound();
                setDictPage((prev) => Math.min(dictTotalPages, prev + 1));
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
            <button
              disabled={dictPage >= dictTotalPages}
              onClick={() => {
                playClickSound();
                setDictPage(dictTotalPages);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#243447] cursor-pointer"
            >
              Trang cuối »
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function VocabularyEmptyState({
  statusFilter,
  setStatusFilter,
  setSelectedTopic,
  setSearchTerm,
  setShowAddModal,
}) {
  return (
    <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 max-w-xl mx-auto p-6 shadow-sm">
      {statusFilter === 'due' ? (
        <>
          <span className="text-4xl">🎉</span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#243447] dark:text-white">
              Đã hoàn thành toàn bộ thẻ cần ôn hôm nay!
            </h3>
            <p className="text-xs text-[#748092]">
              Không còn từ vựng nào đến hạn ôn tập SRS lúc này. Bạn có thể học thêm bài mới trên Lộ trình hoặc chuyển sang chế độ ôn tập tất cả.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playClickSound();
                setStatusFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw size={15} />
              <span>Ôn tập tự do (Tất cả từ vựng)</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-4xl">📚</span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#243447] dark:text-white">
              Không tìm thấy từ vựng nào phù hợp
            </h3>
            <p className="text-xs text-[#748092]">
              Bạn chưa có từ vựng thuộc nhóm này, hoặc từ khóa tìm kiếm chưa chính xác.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                playClickSound();
                setStatusFilter('all');
                setSelectedTopic('Tất cả');
                setSearchTerm('');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#243447] dark:text-white cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
            <button
              onClick={() => {
                playClickSound();
                setShowAddModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md hover:bg-[#CB4529] transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Thêm từ vựng mới này ngay</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function VocabularyWordList({
  filteredVocab,
  gridPage,
  setGridPage,
  rememberedIds,
  reviewIds,
  srsMap,
  handleDeleteCustomItem,
  handleMarkReview,
  handleMarkRemembered,
  onSelectWriting,
  onSelectPronounce,
  setActiveTab,
}) {
  const gridTotalPages = Math.max(1, Math.ceil(filteredVocab.length / GRID_PAGE_SIZE));
  const safeGridPage = Math.min(gridPage, gridTotalPages);
  const paginatedGridVocab = filteredVocab.slice(
    (safeGridPage - 1) * GRID_PAGE_SIZE,
    safeGridPage * GRID_PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedGridVocab.map((item) => {
          const isRemembered =
            rememberedIds.includes(item.id) || srsMap[item.hanzi]?.stage === 2;
          const isReview =
            reviewIds.includes(item.id) || srsMap[item.hanzi]?.stage === 1;

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F] hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                      {item.topic} • {item.level}
                    </span>
                    {item.isCustom && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Tự thêm
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <AudioButton text={item.hanzi} size="sm" />
                    {item.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustomItem(item.id, e)}
                        title="Xóa từ vựng này"
                        className="p-1 rounded-md text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-['Noto_Serif_SC'] text-3xl font-black text-[#243447] dark:text-white">
                    {item.hanzi}
                  </span>
                  <span className="text-sm font-bold text-[#E85D3F]">
                    {item.pinyin}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#45B97C] mt-1">{item.meaning}</p>
                <p className="text-[11px] text-[#748092] mt-0.5">
                  Hán-Việt: {item.hanviet}
                </p>
              </div>

              {item.mnemonic && (
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] italic line-clamp-2">
                  💡 {item.mnemonic}
                </p>
              )}

              {item.example && (
                <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] text-[#748092] dark:text-[#94A3B8]">
                  <p className="font-semibold text-[#243447] dark:text-white">
                    {item.example.hanzi}
                  </p>
                  <p>{item.example.meaning}</p>
                </div>
              )}

              {/* Status Badges */}
              <div className="flex items-center justify-between pt-1 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px]">
                {isRemembered ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Đã nhớ
                  </span>
                ) : isReview ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Clock size={12} /> Cần ôn lại
                  </span>
                ) : (
                  <span className="text-[#748092]">Chưa đánh dấu</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMarkReview(item)}
                    title="Đánh dấu cần ôn"
                    className={`p-1 rounded cursor-pointer ${
                      isReview
                        ? 'text-amber-600 font-bold'
                        : 'text-[#748092] hover:text-amber-600'
                    }`}
                  >
                    <Clock size={13} />
                  </button>
                  <button
                    onClick={() => handleMarkRemembered(item)}
                    title="Đánh dấu đã nhớ"
                    className={`p-1 rounded cursor-pointer ${
                      isRemembered
                        ? 'text-emerald-600 font-bold'
                        : 'text-[#748092] hover:text-emerald-600'
                    }`}
                  >
                    <Check size={13} />
                  </button>
                </div>
              </div>

              {/* Quick Cross Practice */}
              {(onSelectWriting || onSelectPronounce || setActiveTab) && (
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                  <button
                    onClick={() => {
                      if (onSelectWriting) onSelectWriting(item);
                      else if (setActiveTab) setActiveTab('writing');
                    }}
                    title="Chuyển sang trang Luyện viết chữ này"
                    className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <PenTool size={11} />
                    <span>Viết chữ</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectPronounce) onSelectPronounce(item);
                      else if (setActiveTab) setActiveTab('pronunciation');
                    }}
                    title="Chuyển sang trang Luyện phát âm từ này"
                    className="flex-1 py-1.5 px-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Mic size={11} />
                    <span>Phát âm</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {gridTotalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={safeGridPage <= 1}
            onClick={() => setGridPage((p) => Math.max(1, p - 1))}
            className="min-h-11 px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            Trang trước
          </button>
          <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
            Trang {safeGridPage} / {gridTotalPages} ({filteredVocab.length} từ)
          </span>
          <button
            type="button"
            disabled={safeGridPage >= gridTotalPages}
            onClick={() => setGridPage((p) => Math.min(gridTotalPages, p + 1))}
            className="min-h-11 px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
