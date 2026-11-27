import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from 'react';
import { Search, Plus, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { TOPIC_FILTERS } from '../data/chineseData';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import { SRS_QUALITY } from '../utils/srsEngine';
import { saveUserVocabSrsCard } from '../services';
import { recordLearningEvent } from '../services/learningDataService.ts';
import { trackLearningEvent } from '../core/telemetry/learningTelemetryService.js';
import {
  fetchHsk30FlashcardBatch,
  HSK_30_BANDS,
} from '../services/hsk30FlashcardDeckService.js';
import { useVocabularySrs } from '../components/vocabulary/hooks/useVocabularySrs';
import VocabularyFilterBar from '../components/vocabulary/VocabularyFilterBar';
import VocabularyWordList, {
  VocabularyDictionaryView,
  VocabularyEmptyState,
} from '../components/vocabulary/VocabularyWordList';
import SrsReviewSessionView, {
  VocabularyQuizView,
} from '../components/vocabulary/SrsReviewSessionView';
import WordDetailDrawer from '../components/vocabulary/WordDetailDrawer';
import {
  normalizeVocab,
  matchesVocabStatusAndLength,
  sortDueCardsFirst,
  computeSrsPreview,
  buildQuizOptions,
} from '../components/vocabulary/vocabularyHelpers';

export { normalizeVocab } from '../components/vocabulary/vocabularyHelpers';

const VocabularyWorkspace = lazy(() =>
  import('../features/vocabulary-workspace/VocabularyWorkspace.tsx').then((m) => ({
    default: m.VocabularyWorkspace || m.default,
  }))
);
const ChengyuCollocationExplorer = lazy(() =>
  import('../features/chengyu-explorer/ChengyuCollocationExplorer.tsx').then((m) => ({
    default: m.ChengyuCollocationExplorer || m.default,
  }))
);

const SRS_RATING_BTN_BASE =
  'min-h-[48px] py-3 px-3 rounded-2xl font-bold text-xs shadow-2xs transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer group';

const normalizeVocabWithCustomCheck = (item) => {
  const normalized = normalizeVocab(item);
  if (!normalized) return null;
  if (!normalized.isCustom && (item.is_custom || (item.example && item.example.is_custom))) {
    return { ...normalized, isCustom: true };
  }
  return normalized;
};

export default function VocabularyPage({
  user,
  setActiveTab,
  onSelectWriting,
  onSelectPronounce,
  initialView = 'flashcard',
}) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const cardTouchMovedRef = useRef(false);

  const onRecordSrsTelemetry = useCallback(
    ({ card, quality, nextSrs }) => {
      try {
        const targetUid = user?.uid || user?.id;
        if (targetUid) {
          saveUserVocabSrsCard(targetUid, {
            hanzi: card.hanzi,
            pinyin: card.pinyin,
            meaning: card.meaning,
            level: card.level,
            ...nextSrs,
          });
        }
        const hskLvlMatch = String(card.level || '1').match(/\d+/);
        const parsedHskLvl = hskLvlMatch ? Number(hskLvlMatch[0]) : 1;
        const isCorrectReview = quality >= SRS_QUALITY.GOOD;
        void recordLearningEvent({
          userId: targetUid ?? null,
          sourceModule: 'srs_review',
          hskLevel: parsedHskLvl,
          skillDomain: 'vocabulary',
          itemId: card.hanzi,
          isCorrect: isCorrectReview,
          scoreEarned: isCorrectReview ? 100 : quality === SRS_QUALITY.HARD ? 60 : 20,
          scoreMax: 100,
          durationMs: 4000,
          metadata: {
            source: 'user_vocab_srs',
            lapse_count: nextSrs?.lapseCount ?? 0,
            stage: nextSrs?.stage ?? 0,
          },
        });
        trackLearningEvent(
          {
            userId: targetUid ?? null,
            eventType: 'vocab_review',
            itemId: card.hanzi,
            hskLevel: parsedHskLvl,
            isCorrect: isCorrectReview,
            metadata: { source: 'user_vocab_srs', lapseCount: nextSrs?.lapseCount ?? 0 },
          },
          { user }
        );
      } catch (e) {
        console.warn('SRS DB sync notice:', e);
      }
    },
    [user]
  );

  const lib = useVocabularySrs({ user, initialView, onRecordSrsTelemetry });
  const {
    searchTerm,
    setSearchTerm,
    isComposingSearch,
    setIsComposingSearch,
    selectedTopic,
    setSelectedTopic,
    selectedHsk,
    corpusMode,
    setCorpusMode,
    corpusPage,
    setCorpusPage,
    corpusCards,
    setCorpusCards,
    setCorpusTotalCount,
    setCorpusTotalPages,
    setCorpusLoading,
    setCorpusSource,
    allVocabList,
    syncVocabularyFromDb,
    currentIndex,
    setCurrentIndex,
    isFlipped,
    rememberedIds,
    reviewIds,
    srsMap,
    statusFilter,
    hideMastered,
    lengthFilter,
    isPersonalStatusFilter,
    viewMode,
    showAddModal,
    bindFilteredVocab,
    handleFlip,
    handleNextCard,
    handlePrevCard,
    handleSrsRate,
  } = lib;

  // Tải từng lô 50 từ trong kho 11.092 từ HSK 3.0 (bao gồm HSK 7-9) khi bật corpusMode
  useEffect(() => {
    if (!corpusMode || isComposingSearch) return;
    let cancelled = false;
    setCorpusLoading(true);
    const bandKey = HSK_30_BANDS[selectedHsk] ? selectedHsk : selectedHsk === 'HSK 7-9' ? 'HSK 7-9' : 'all';

    fetchHsk30FlashcardBatch({
      hskBand: bandKey,
      page: corpusPage,
      pageSize: 50,
      searchQuery: searchTerm,
    })
      .then((res) => {
        if (cancelled || !res) return;
        setCorpusCards(
          (Array.isArray(res.entries) ? res.entries : [])
            .map(normalizeVocabWithCustomCheck)
            .filter(Boolean)
        );
        setCorpusTotalCount(res.totalCount || 0);
        setCorpusTotalPages(res.totalPages || 1);
        setCorpusSource(res.source || 'supabase_hsk30_corpus');
      })
      .finally(() => {
        if (!cancelled) setCorpusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    corpusMode,
    selectedHsk,
    corpusPage,
    searchTerm,
    isComposingSearch,
    setCorpusLoading,
    setCorpusCards,
    setCorpusTotalCount,
    setCorpusTotalPages,
    setCorpusSource,
  ]);

  // Fetch on mount + subscribe to Supabase Realtime channel and local CustomEvent
  useEffect(() => {
    let isMounted = true;
    syncVocabularyFromDb();

    const handleLocalVocabUpdate = () => {
      if (isMounted) syncVocabularyFromDb();
    };
    window.addEventListener('hanzigo:custom_vocab_updated', handleLocalVocabUpdate);

    let channel;
    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel('public:vocabulary_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'vocabulary' },
            () => {
              if (isMounted) syncVocabularyFromDb();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime vocabulary subscription notice:', err);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('hanzigo:custom_vocab_updated', handleLocalVocabUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel).catch(() => {});
      }
    };
  }, [syncVocabularyFromDb]);

  // Filtered vocabularies (Tự động hợp nhất allVocabList + corpusCards khi lọc trạng thái cá nhân hoặc lọc chủ đề)
  const filteredVocab = useMemo(() => {
    const isTopicFiltering = selectedTopic !== 'Tất cả';
    const rawPool =
      corpusMode && !isPersonalStatusFilter && !isTopicFiltering
        ? corpusCards
        : [...allVocabList, ...corpusCards];

    const sourcePool = Array.from(
      new Map(
        rawPool
          .filter((v) => v && v.hanzi)
          .map((v) => [v.hanzi, v])
      ).values()
    );

    const q = searchTerm.trim().toLowerCase();

    const matched = sourcePool.filter((item) => {
      if (!item || !item.hanzi) return false;
      const matchesTopic = selectedTopic === 'Tất cả' || item.topic === selectedTopic;
      if (!matchesTopic) return false;
      return matchesVocabStatusAndLength(item, {
        corpusMode,
        isPersonalStatusFilter,
        isTopicFiltering,
        q,
        selectedHsk,
        statusFilter,
        hideMastered,
        lengthFilter,
        rememberedIds,
        reviewIds,
        srsMap,
      });
    });

    return sortDueCardsFirst(matched, statusFilter, srsMap);
  }, [
    corpusMode,
    isPersonalStatusFilter,
    hideMastered,
    corpusCards,
    allVocabList,
    searchTerm,
    selectedTopic,
    selectedHsk,
    statusFilter,
    lengthFilter,
    rememberedIds,
    reviewIds,
    srsMap,
  ]);

  bindFilteredVocab(filteredVocab);

  const currentCard = filteredVocab[currentIndex] || filteredVocab[0];
  const srsPreview = useMemo(
    () => computeSrsPreview(currentCard, srsMap),
    [currentCard, srsMap]
  );
  const quizOptions = useMemo(
    () => buildQuizOptions(currentCard, allVocabList, corpusCards),
    [currentCard, allVocabList, corpusCards]
  );

  // Keyboard navigation for Flashcards
  useEffect(() => {
    if (viewMode !== 'flashcard' || showAddModal) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown'
      ) {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === '1' || e.key === 'r' || e.key === 'R') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.AGAIN);
      } else if (e.key === '2') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.HARD);
      } else if (e.key === '3' || e.key === 'm' || e.key === 'M') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.GOOD);
      } else if (e.key === '4') {
        if (currentCard) handleSrsRate(currentCard, SRS_QUALITY.EASY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewMode,
    showAddModal,
    currentCard,
    handleFlip,
    handleNextCard,
    handlePrevCard,
    handleSrsRate,
  ]);

  const renderSearchAndTopicControls = () => (
    <>
      <div className="relative lg:col-span-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
        <input
          id="vocab-search-input"
          name="vocabSearch"
          aria-label="Tìm kiếm từ vựng theo chữ Hán, Pinyin, nghĩa hoặc Hán-Việt"
          type="text"
          placeholder="Tìm theo chữ Hán, Pinyin, nghĩa tiếng Việt hoặc âm Hán-Việt..."
          value={searchTerm}
          onCompositionStart={() => setIsComposingSearch(true)}
          onCompositionEnd={() => setIsComposingSearch(false)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentIndex(0);
          }}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setCurrentIndex(0);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Xóa từ khóa"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="lg:col-span-3">
        <select
          id="vocab-topic-filter"
          name="vocabTopic"
          aria-label="Lọc từ vựng theo chủ đề"
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setCurrentIndex(0);
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
        >
          {TOPIC_FILTERS.map((t) => (
            <option key={t} value={t}>
              {t === 'Tất cả' ? 'Chủ đề: Tất cả' : `Chủ đề: ${t}`}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  const renderCorpusToggleBar = () => (
    <button
      type="button"
      onClick={() => {
        playClickSound();
        setCorpusMode((prev) => !prev);
        setCorpusPage(1);
        setCurrentIndex(0);
      }}
      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
        corpusMode
          ? 'bg-[#E85D3F] text-white shadow-sm'
          : 'bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]'
      }`}
    >
      <Sparkles size={13} />
      <span>Kho 11.092 từ chuẩn HSK 3.0</span>
    </button>
  );

  const renderFlipContainer = (cardInner) => (
    <div
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? 'Lật lại mặt trước thẻ từ vựng' : 'Lật xem mặt sau thẻ từ vựng'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      onTouchStart={() => {
        cardTouchMovedRef.current = false;
      }}
      onTouchMove={() => {
        cardTouchMovedRef.current = true;
      }}
      onClick={() => {
        if (cardTouchMovedRef.current) {
          cardTouchMovedRef.current = false;
          return;
        }
        handleFlip();
      }}
      className="perspective-1000 cursor-pointer min-h-[380px] select-none"
    >
      {cardInner}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HEADER & ADAPTIVE PROGRESS CARD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Học Sâu Qua Spaced Repetition &amp; Tự Tạo Từ Điển
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">
              Kho Flashcard Từ Vựng Tiếng Trung
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {lib.displayTotalVocabCount.toLocaleString('vi-VN')} từ chuẩn HSK 1–9
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
            Ghi nhớ chữ Hán qua chiết tự, âm Hán-Việt, tiến độ từng cấp HSK và câu ví dụ thực tế.
          </p>
        </div>

        {/* Adaptive Progress & Add Button Container */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm w-full sm:w-auto sm:min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 gap-3">
              <span className="text-[#243447] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#45B97C]" />
                {lib.activeHskProgress
                  ? `Đã thuộc ${lib.activeHskProgress.label}:`
                  : 'Đã nhớ vững tổng:'}
              </span>
              <span className="text-[#45B97C]">
                {lib.headerMasteredCount.toLocaleString('vi-VN')} /{' '}
                {lib.headerTargetCount.toLocaleString('vi-VN')} từ ({lib.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-[#FFF9F2] dark:bg-[#131B24] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#45B97C] rounded-full transition-all duration-300"
                style={{ width: `${lib.progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              lib.setShowAddModal(true);
            }}
            className="min-h-11 px-4 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus size={18} />
            <span>Thêm từ vựng muốn học</span>
          </button>
        </div>
      </div>

      {/* 2 & 4. HSK LEVEL MATRIX + SEARCH / FILTER TOOLBAR / VIEW SWITCHER */}
      <VocabularyFilterBar
        hskLevelProgress={lib.hskLevelProgress}
        activeHskProgress={lib.activeHskProgress}
        selectedHsk={lib.selectedHsk}
        setSelectedHsk={lib.setSelectedHsk}
        setCorpusPage={lib.setCorpusPage}
        setCurrentIndex={lib.setCurrentIndex}
        viewMode={lib.viewMode}
        setViewMode={lib.setViewMode}
        filteredCount={filteredVocab.length}
        handleExportCsv={lib.handleExportCsv}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
        renderSearchAndTopicControls={renderSearchAndTopicControls}
        lengthFilter={lib.lengthFilter}
        setLengthFilter={lib.setLengthFilter}
        corpusMode={lib.corpusMode}
        allVocabList={lib.allVocabList}
        hskCounts={lib.hskCounts}
        renderCorpusToggleBar={renderCorpusToggleBar}
        isPersonalStatusFilter={lib.isPersonalStatusFilter}
        corpusLoading={lib.corpusLoading}
        corpusTotalCount={lib.corpusTotalCount}
        corpusSource={lib.corpusSource}
        corpusPage={lib.corpusPage}
        corpusTotalPages={lib.corpusTotalPages}
        statusFilter={lib.statusFilter}
        setStatusFilter={lib.setStatusFilter}
        srsStats={lib.srsStats}
        customVocabCount={lib.customVocabCount}
        hideMastered={lib.hideMastered}
        setHideMastered={lib.setHideMastered}
        selectedTopic={lib.selectedTopic}
        setSelectedTopic={lib.setSelectedTopic}
      />

      {/* 5. MAIN CONTENT AREA */}
      {lib.viewMode === 'workspace' ? (
        <Suspense
          fallback={
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-2" />
              <p className="text-xs font-bold text-[#748092]">
                Đang tải Vocabulary Workspace...
              </p>
            </div>
          }
        >
          <VocabularyWorkspace user={user} />
        </Suspense>
      ) : lib.viewMode === 'chengyu' ? (
        <Suspense
          fallback={
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-2" />
              <p className="text-xs font-bold text-[#748092]">
                Đang tải Kho Thành ngữ &amp; Collocations...
              </p>
            </div>
          }
        >
          <ChengyuCollocationExplorer user={user} onOpenWriting={onSelectWriting} />
        </Suspense>
      ) : lib.viewMode === 'dictionary' ? (
        <VocabularyDictionaryView
          dictQuery={lib.dictQuery}
          setDictQuery={lib.setDictQuery}
          dictHsk={lib.dictHsk}
          setDictHsk={lib.setDictHsk}
          dictPage={lib.dictPage}
          setDictPage={lib.setDictPage}
          dictResults={lib.dictResults}
          dictTotal={lib.dictTotal}
          dictTotalPages={lib.dictTotalPages}
          dictLoading={lib.dictLoading}
          dictSource={lib.dictSource}
          savedDictWords={lib.savedDictWords}
          setSelectedDictWord={lib.setSelectedDictWord}
          handleSaveDictToSrs={lib.handleSaveDictToSrs}
        />
      ) : filteredVocab.length === 0 ? (
        <VocabularyEmptyState
          statusFilter={lib.statusFilter}
          setStatusFilter={lib.setStatusFilter}
          setSelectedTopic={lib.setSelectedTopic}
          setSearchTerm={lib.setSearchTerm}
          setShowAddModal={lib.setShowAddModal}
        />
      ) : lib.viewMode === 'flashcard' && currentCard ? (
        <SrsReviewSessionView
          currentCard={currentCard}
          currentIndex={lib.currentIndex}
          totalFiltered={filteredVocab.length}
          isFlipped={lib.isFlipped}
          srsMap={lib.srsMap}
          srsPreview={srsPreview}
          aiGeneratedExample={lib.aiGeneratedExample}
          isGeneratingExample={lib.isGeneratingExample}
          handleDeleteCustomItem={lib.handleDeleteCustomItem}
          handleGenerateAiExample={lib.handleGenerateAiExample}
          handleSrsRate={lib.handleSrsRate}
          handleNextCard={lib.handleNextCard}
          handlePrevCard={lib.handlePrevCard}
          onSelectWriting={onSelectWriting}
          onSelectPronounce={onSelectPronounce}
          setActiveTab={setActiveTab}
          renderFlipContainer={renderFlipContainer}
          ratingButtonBaseClass={SRS_RATING_BTN_BASE}
        />
      ) : lib.viewMode === 'grid' ? (
        <VocabularyWordList
          filteredVocab={filteredVocab}
          gridPage={lib.gridPage}
          setGridPage={lib.setGridPage}
          rememberedIds={lib.rememberedIds}
          reviewIds={lib.reviewIds}
          srsMap={lib.srsMap}
          handleDeleteCustomItem={lib.handleDeleteCustomItem}
          handleMarkReview={lib.handleMarkReview}
          handleMarkRemembered={lib.handleMarkRemembered}
          onSelectWriting={onSelectWriting}
          onSelectPronounce={onSelectPronounce}
          setActiveTab={setActiveTab}
        />
      ) : (
        <VocabularyQuizView
          currentCard={currentCard}
          quizScore={lib.quizScore}
          quizStreak={lib.quizStreak}
          quizOptions={quizOptions}
          quizAnswered={lib.quizAnswered}
          selectedOption={lib.selectedOption}
          handleQuizAnswer={lib.handleQuizAnswer}
          handleNextQuizCard={lib.handleNextQuizCard}
          onSelectWriting={onSelectWriting}
          onSelectPronounce={onSelectPronounce}
          setActiveTab={setActiveTab}
        />
      )}

      {/* MODALS: DICTIONARY WORD DETAIL & ADD CUSTOM VOCABULARY */}
      <WordDetailDrawer
        selectedDictWord={lib.selectedDictWord}
        setSelectedDictWord={lib.setSelectedDictWord}
        handleSaveDictToSrs={lib.handleSaveDictToSrs}
        onSelectWriting={onSelectWriting}
        setActiveTab={setActiveTab}
        showAddModal={lib.showAddModal}
        setShowAddModal={lib.setShowAddModal}
        handleApplySuggestion={lib.handleApplySuggestion}
        handleAddNewVocab={lib.handleAddNewVocab}
        newHanzi={lib.newHanzi}
        setNewHanzi={lib.setNewHanzi}
        matchedVocabInDict={lib.matchedVocabInDict}
        handleApplyDictMatch={lib.handleApplyDictMatch}
        newPinyin={lib.newPinyin}
        setNewPinyin={lib.setNewPinyin}
        newHanviet={lib.newHanviet}
        setNewHanviet={lib.setNewHanviet}
        newMeaning={lib.newMeaning}
        setNewMeaning={lib.setNewMeaning}
        newLevel={lib.newLevel}
        setNewLevel={lib.setNewLevel}
        newTopic={lib.newTopic}
        setNewTopic={lib.setNewTopic}
        newRadical={lib.newRadical}
        setNewRadical={lib.setNewRadical}
        newStrokes={lib.newStrokes}
        setNewStrokes={lib.setNewStrokes}
        newMnemonic={lib.newMnemonic}
        setNewMnemonic={lib.setNewMnemonic}
        newExampleHanzi={lib.newExampleHanzi}
        setNewExampleHanzi={lib.setNewExampleHanzi}
        newExamplePinyin={lib.newExamplePinyin}
        setNewExamplePinyin={lib.setNewExamplePinyin}
        newExampleMeaning={lib.newExampleMeaning}
        setNewExampleMeaning={lib.setNewExampleMeaning}
      />
    </div>
  );
}
