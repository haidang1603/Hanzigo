import React, { Suspense, lazy, useEffect } from 'react';
import { CheckCircle2, Filter, AlertCircle } from 'lucide-react';
import { getMaterialsFromDb } from '../supabase/services';
import { supabase, isSupabaseConfigured } from '../supabase/config';
import { useAuth } from '../context/AuthContext';
import { useMaterialsLibrary } from '../components/materials/hooks/useMaterialsLibrary';
import MaterialsCompactHeader from '../components/materials/MaterialsCompactHeader';
import MaterialsFilterBar from '../components/materials/MaterialsFilterBar';
import ResourceCardGrid from '../components/materials/ResourceCardGrid';
import MaterialsReaderDrawer from '../components/materials/MaterialsReaderDrawer';
import MaterialsDetailModals from '../components/materials/ResourceDetailModal';
import { MaterialsActionModals } from '../components/materials/GrammarGuidePanel';
import { enrichAndMergeMaterials } from '../components/materials/materialsHelpers';

const LazyWorksheetGeneratorModal = lazy(() =>
  import('../components/dictionary/WorksheetGeneratorModal')
);

export { normalizeMaterialUrl } from '../components/materials/materialsHelpers';

const MATERIAL_MODAL_PANEL_CLASS =
  'bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto';

const MATERIAL_PREVIEW_MODAL_PANEL_CLASS =
  'bg-white dark:bg-[#1E293B] rounded-3xl max-w-3xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto';

export default function MaterialsPage({
  setActiveTab,
  user: propUser,
  isAdmin: propIsAdmin,
  onSelectLesson = null,
}) {
  const authContext = useAuth();
  const user = propUser !== undefined ? propUser : authContext?.user;
  const isAdmin =
    propIsAdmin !== undefined
      ? propIsAdmin
      : Boolean(authContext?.isAdmin || (user?.role === 'admin' && user?.status === 'active'));

  const lib = useMaterialsLibrary({ user, isAdmin });
  const { setMaterials } = lib;

  const applyAuthoritativeMaterials = (dbItems) => {
    if (!Array.isArray(dbItems)) return;
    setMaterials(enrichAndMergeMaterials(dbItems));
  };

  useEffect(() => {
    const handleRemoteMaterialsUpdate = () => {
      getMaterialsFromDb()
        .then((dbItems) => {
          applyAuthoritativeMaterials(dbItems);
        })
        .catch((err) => {
          console.warn('Real-time materials sync notice:', err);
        });
    };
    window.addEventListener('hanzigo:materials_updated', handleRemoteMaterialsUpdate);

    let channel;
    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel('public:materials_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => {
            handleRemoteMaterialsUpdate();
          })
          .subscribe();
      } catch (err) {
        console.warn('Realtime channel subscription notice:', err);
      }
    }

    return () => {
      window.removeEventListener('hanzigo:materials_updated', handleRemoteMaterialsUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel).catch(() => {});
      }
    };
  }, []);

  const renderMobileFilterToggle = () => (
    <button
      type="button"
      onClick={() => lib.setIsFilterOpen((prev) => !prev)}
      className="sm:hidden min-h-11 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
    >
      <Filter size={14} className="text-[#E85D3F]" />
      <span>Bộ lọc</span>
      {lib.activeMobileFilterCount > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-[#E85D3F] text-white text-[10px] font-black">
          {lib.activeMobileFilterCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4">
      {lib.toast && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-[#243447] text-white shadow-2xl flex items-center gap-3 border border-white/20">
          <CheckCircle2 size={18} className="shrink-0 text-amber-300" />
          <p className="text-xs sm:text-sm font-bold">{lib.toast}</p>
        </div>
      )}

      {lib.fetchError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{lib.fetchError}</span>
          </div>
          <button
            type="button"
            onClick={lib.handleRefreshCloud}
            className="min-h-11 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Tier 1: Compact Single-Bar Header */}
      <MaterialsCompactHeader
        totalCount={lib.materials.length}
        completedCount={lib.completedIds.length}
        bookmarkedCount={lib.bookmarkedIds.length}
        searchTerm={lib.searchTerm}
        setSearchTerm={lib.setSearchTerm}
        isBookmarkedOnly={lib.readStatusFilter === 'bookmarked'}
        onToggleBookmarkedOnly={lib.handleToggleBookmarkedOnly}
        onOpenWorksheet={lib.openWorksheetWithChars}
        isAdmin={isAdmin}
        onOpenAddModal={() => lib.setShowAddModal(true)}
      />

      {/* Tier 2: 2-Row Compact Filter Bar & View Switcher */}
      <MaterialsFilterBar
        filteredCount={lib.filteredMaterials.length}
        materialsCount={lib.materials.length}
        selectedGuideType={lib.selectedGuideType}
        setSelectedGuideType={lib.setSelectedGuideType}
        selectedExamVersion={lib.selectedExamVersion}
        setSelectedExamVersion={lib.setSelectedExamVersion}
        selectedLevel={lib.selectedLevel}
        setSelectedLevel={lib.setSelectedLevel}
        viewMode={lib.effectiveViewMode}
        onChangeViewMode={lib.handleChangeViewMode}
        isFilterOpen={lib.isFilterOpen}
        hasActiveFilters={lib.hasActiveFilters}
        handleResetFilters={lib.handleResetFilters}
        renderMobileFilterToggle={renderMobileFilterToggle}
      />

      {/* Tier 3: Grid / 1-Line Compact List View */}
      <ResourceCardGrid
        isLoading={lib.isLoading}
        viewMode={lib.effectiveViewMode}
        visibleMaterials={lib.visibleMaterials}
        hasMoreMaterials={lib.hasMoreMaterials}
        remainingMaterialsCount={lib.remainingMaterialsCount}
        onLoadMore={lib.handleLoadMore}
        bookmarkedIds={lib.bookmarkedIds}
        completedIds={lib.completedIds}
        openResourceReader={lib.openResourceReader}
        toggleBookmark={lib.toggleBookmark}
        handleResetFilters={lib.handleResetFilters}
      />

      {/* Tier 4: Focused Reader Drawer / Modal */}
      <MaterialsReaderDrawer
        resource={lib.activeReaderResource}
        detail={lib.readerDetail}
        isLoading={lib.isLoadingReader}
        isBookmarked={Boolean(lib.activeReaderResource && lib.bookmarkedIds.includes(lib.activeReaderResource.id))}
        isCompleted={Boolean(lib.activeReaderResource && lib.completedIds.includes(lib.activeReaderResource.id))}
        savedSrsTerms={lib.savedSrsTerms}
        onClose={lib.closeResourceReader}
        onToggleBookmark={lib.toggleBookmark}
        onToggleCompleted={lib.toggleCompleted}
        onSaveTermToSrs={lib.handleSaveTermToSrs}
        onOpenWorksheet={lib.openWorksheetWithChars}
        onPracticeHskLevel={(targetLevel) => {
          lib.closeResourceReader();
          window.location.hash = targetLevel ? `#hsk?level=${encodeURIComponent(targetLevel)}` : '#hsk';
          if (setActiveTab) setActiveTab('hsk');
        }}
      />

      {lib.isWorksheetModalOpen && (
        <Suspense fallback={null}>
          <LazyWorksheetGeneratorModal
            key={lib.worksheetChars}
            isOpen={lib.isWorksheetModalOpen}
            onClose={lib.closeWorksheetModal}
            initialChar={lib.worksheetChars}
          />
        </Suspense>
      )}

      <MaterialsDetailModals
        selectedPreviewDoc={lib.selectedPreviewDoc}
        setSelectedPreviewDoc={lib.setSelectedPreviewDoc}
        previewTab={lib.previewTab}
        setPreviewTab={lib.setPreviewTab}
        quizAnsweredIndex={lib.quizAnsweredIndex}
        setQuizAnsweredIndex={lib.setQuizAnsweredIndex}
        bookmarkedIds={lib.bookmarkedIds}
        isAdmin={isAdmin}
        toggleBookmark={lib.toggleBookmark}
        handleCopyLink={lib.handleCopyLink}
        handleDeleteMaterial={lib.handleDeleteMaterial}
        handleDownloadClick={lib.handleDownloadClick}
        onSelectLesson={onSelectLesson}
        setActiveTab={setActiveTab}
        activeDetailResource={lib.activeDetailResource}
        setActiveDetailResource={lib.setActiveDetailResource}
        brokenReportTarget={lib.brokenReportTarget}
        setBrokenReportTarget={lib.setBrokenReportTarget}
        user={user}
        modalPanelClassName={MATERIAL_PREVIEW_MODAL_PANEL_CLASS}
      />

      <MaterialsActionModals
        isAdmin={isAdmin}
        showMizigeGenModal={lib.showMizigeGenModal}
        setShowMizigeGenModal={lib.setShowMizigeGenModal}
        mizigeInputText={lib.mizigeInputText}
        setMizigeInputText={lib.setMizigeInputText}
        mizigeGridStyle={lib.mizigeGridStyle}
        setMizigeGridStyle={lib.setMizigeGridStyle}
        showAddModal={lib.showAddModal}
        setShowAddModal={lib.setShowAddModal}
        handleApplySuggestion={lib.handleApplySuggestion}
        handleAddNewMaterial={lib.handleAddNewMaterial}
        newTitle={lib.newTitle}
        setNewTitle={lib.setNewTitle}
        newCategory={lib.newCategory}
        setNewCategory={lib.setNewCategory}
        newLevel={lib.newLevel}
        setNewLevel={lib.setNewLevel}
        newSkills={lib.newSkills}
        setNewSkills={lib.setNewSkills}
        newPublisher={lib.newPublisher}
        setNewPublisher={lib.setNewPublisher}
        newFormat={lib.newFormat}
        setNewFormat={lib.setNewFormat}
        newLicense={lib.newLicense}
        setNewLicense={lib.setNewLicense}
        newVerificationStatus={lib.newVerificationStatus}
        setNewVerificationStatus={lib.setNewVerificationStatus}
        newRelatedLessonId={lib.newRelatedLessonId}
        setNewRelatedLessonId={lib.setNewRelatedLessonId}
        newLanguage={lib.newLanguage}
        setNewLanguage={lib.setNewLanguage}
        newSourceUrl={lib.newSourceUrl}
        setNewSourceUrl={lib.setNewSourceUrl}
        newDownloadUrl={lib.newDownloadUrl}
        setNewDownloadUrl={lib.setNewDownloadUrl}
        newDescription={lib.newDescription}
        setNewDescription={lib.setNewDescription}
        newVerificationNotes={lib.newVerificationNotes}
        setNewVerificationNotes={lib.setNewVerificationNotes}
        newTags={lib.newTags}
        setNewTags={lib.setNewTags}
        showRequestModal={lib.showRequestModal}
        setShowRequestModal={lib.setShowRequestModal}
        handleRequestMaterialSubmit={lib.handleRequestMaterialSubmit}
        reqTitle={lib.reqTitle}
        setReqTitle={lib.setReqTitle}
        reqCategory={lib.reqCategory}
        setReqCategory={lib.setReqCategory}
        reqLevel={lib.reqLevel}
        setReqLevel={lib.setReqLevel}
        reqFormat={lib.reqFormat}
        setReqFormat={lib.setReqFormat}
        reqNote={lib.reqNote}
        setReqNote={lib.setReqNote}
        modalPanelClassName={MATERIAL_MODAL_PANEL_CLASS}
      />
    </div>
  );
}
