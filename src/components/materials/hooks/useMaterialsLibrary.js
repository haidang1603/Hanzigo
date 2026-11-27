import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  getStoredMaterials,
  saveMaterial,
  deleteMaterial,
  updateMaterial,
} from '../../../utils/materialsStorage';
import { playClickSound, playSuccessSound, speakChinese } from '../../../utils/audio';
import {
  triggerCloudSync,
  getMaterialsFromDb,
  addMaterialToDb,
  deleteMaterialFromDb,
  updateMaterialInDb,
} from '../../../supabase/services';
import { awardXp } from '../../../utils/gamification';
import { captureWeakVocabulary } from '../../../utils/srsEngine';
import { RESOURCE_ACADEMIC_CATEGORIES } from '../../../data/hskResourcesData';
import { loadMaterialDetailById } from '../../../data/materials/index.js';
import {
  enrichAndMergeMaterials,
  filterAndSortMaterials,
  getMaterialBookmarkKey,
  getMaterialCompletedKey,
  getPaginationStep,
  getSampleAudioTextForMaterial,
  normalizeMaterialUrl,
  readManualViewMode,
  readScopedMaterialIds,
  resolveMaterialsViewMode,
  writeManualViewMode,
  writeScopedMaterialIds,
} from '../materialsHelpers';

export function useMaterialsLibrary({ user, isAdmin }) {
  const [materials, setMaterials] = useState(() => enrichAndMergeMaterials(getStoredMaterials()));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcademicCategory, setSelectedAcademicCategory] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedGuideType, setSelectedGuideType] = useState('Tất cả');
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedSkill, setSelectedSkill] = useState('Tất cả kỹ năng');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [selectedExamVersion, setSelectedExamVersion] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedHostType, setSelectedHostType] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all', 'bookmarked', 'custom'
  const [readStatusFilter, setReadStatusFilter] = useState('all'); // 'all', 'bookmarked', 'unread', 'completed'
  const [sortBy, setSortBy] = useState('downloads'); // 'downloads', 'newest', 'recently_verified', 'name', 'level_asc'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [manualViewMode, setManualViewMode] = useState(() => readManualViewMode());
  const [paginationState, setPaginationState] = useState({ signature: '', multiplier: 1 });

  // Detail Modal, Interactive Reader Modal, Worksheet Modal & Broken Link Report States
  const [activeDetailResource, setActiveDetailResource] = useState(null);
  const [activeReaderResource, setActiveReaderResource] = useState(null);
  const [readerDetail, setReaderDetail] = useState(null);
  const [isLoadingReader, setIsLoadingReader] = useState(false);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [worksheetChars, setWorksheetChars] = useState('学习汉语');
  const [savedSrsTerms, setSavedSrsTerms] = useState(() => new Set());
  const [brokenReportTarget, setBrokenReportTarget] = useState(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Strict user-isolated bookmarks & reading completion state
  const bookmarkStorageKey = useMemo(() => getMaterialBookmarkKey(user), [user?.id]);
  const completedStorageKey = useMemo(() => getMaterialCompletedKey(user), [user?.id]);

  const [bookmarkedIds, setBookmarkedIds] = useState(() => readScopedMaterialIds(bookmarkStorageKey));
  const [completedIds, setCompletedIds] = useState(() => readScopedMaterialIds(completedStorageKey));

  useEffect(() => {
    setBookmarkedIds(readScopedMaterialIds(bookmarkStorageKey));
    setCompletedIds(readScopedMaterialIds(completedStorageKey));
    setSavedSrsTerms(new Set());
  }, [bookmarkStorageKey, completedStorageKey]);

  // URL Hash query parser for 2-way routing (#materials?category=...&level=...&lesson=...&exam=...)
  useEffect(() => {
    const parseHashParams = () => {
      try {
        const hash = window.location.hash || '';
        const queryIdx = hash.indexOf('?');
        if (queryIdx === -1) return;
        const queryStr = hash.slice(queryIdx + 1);
        const params = new URLSearchParams(queryStr);

        const catParam = params.get('category');
        if (catParam) {
          const matchAcad = RESOURCE_ACADEMIC_CATEGORIES.find(
            (c) => c.id === catParam || c.code.toLowerCase() === catParam.toLowerCase()
          );
          if (matchAcad) {
            setSelectedAcademicCategory(matchAcad.id);
          }
        }

        const lvlParam = params.get('level');
        if (lvlParam) setSelectedLevel(lvlParam);

        const lessonParam = params.get('lesson');
        if (lessonParam) setSearchTerm(lessonParam);

        const examParam = params.get('exam');
        if (examParam) setSearchTerm(examParam);

        const resId = params.get('id');
        if (resId) {
          const found = materials.find((m) => String(m.id) === resId);
          if (found) setActiveDetailResource(found);
        }
      } catch (err) {
        console.warn('Lỗi đọc tham số URL tài nguyên:', err);
      }
    };

    parseHashParams();
    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, [materials]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMizigeGenModal, setShowMizigeGenModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [previewTab, setPreviewTab] = useState('excerpt'); // 'excerpt', 'provenance', 'ecosystem'
  const [quizAnsweredIndex, setQuizAnsweredIndex] = useState(null);

  // Quick Mizige Generator State
  const [mizigeInputText, setMizigeInputText] = useState('学海无涯');
  const [mizigeGridStyle, setMizigeGridStyle] = useState('mizige'); // 'mizige', 'tianzige', 'blank'

  // New Material Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Giáo trình chuẩn');
  const [newLevel, setNewLevel] = useState('HSK 1');
  const [newSkills, setNewSkills] = useState('Từ vựng, Nghe hiểu');
  const [newPublisher, setNewPublisher] = useState('');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newLanguage, setNewLanguage] = useState('Song ngữ Trung - Việt');
  const [newLicense, setNewLicense] = useState('Tài liệu Giáo dục Mở HanziGo');
  const [newVerificationStatus, setNewVerificationStatus] = useState('curated');
  const [newRelatedLessonId, setNewRelatedLessonId] = useState('');
  const [newVerificationNotes, setNewVerificationNotes] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // Request Material Form State
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState('Giáo trình chuẩn');
  const [reqLevel, setReqLevel] = useState('HSK 1');
  const [reqFormat, setReqFormat] = useState('PDF + MP3');
  const [reqNote, setReqNote] = useState('');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Authoritative database update helper
  const applyAuthoritativeMaterials = useCallback((dbItems) => {
    if (!Array.isArray(dbItems)) return;
    setMaterials(enrichAndMergeMaterials(dbItems));
  }, []);

  // Fetch materials from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    getMaterialsFromDb()
      .then((dbItems) => {
        if (!isMounted) return;
        applyAuthoritativeMaterials(dbItems);
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Không thể tải từ máy chủ, sử dụng dữ liệu cục bộ:', err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applyAuthoritativeMaterials]);

  // Sync / Refresh with Supabase cloud
  const handleRefreshCloud = async () => {
    setIsSyncing(true);
    setFetchError(null);
    playClickSound();
    try {
      const dbItems = await getMaterialsFromDb();
      if (Array.isArray(dbItems)) {
        applyAuthoritativeMaterials(dbItems);
        showToast('Đã làm mới dữ liệu tài liệu từ máy chủ!');
      } else {
        showToast('Dữ liệu tài liệu đang ở trạng thái mới nhất!');
      }
    } catch {
      setFetchError('Chưa thể đồng bộ với máy chủ. HanziGo đang hiển thị dữ liệu cục bộ đã xác minh.');
      showToast('Đã chuyển sang kho tài liệu cục bộ an toàn.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Bookmark (user-isolated, no unscoped write leak)
  const toggleBookmark = (id, title) => {
    playClickSound();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id);
      showToast(`Đã bỏ lưu: "${title}"`);
    } else {
      updated = [...bookmarkedIds, id];
      showToast('Đã lưu tài liệu vào danh sách yêu thích (+5 XP)!');
      playSuccessSound();
      awardXp(5);
    }
    setBookmarkedIds(updated);
    writeScopedMaterialIds(bookmarkStorageKey, updated);
    triggerCloudSync();
  };

  // Toggle Completed Reading Progress (user-isolated)
  const toggleCompleted = useCallback(
    (id, title) => {
      playClickSound();
      setCompletedIds((prev) => {
        const exists = prev.includes(id);
        const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
        writeScopedMaterialIds(completedStorageKey, updated);
        if (exists) {
          showToast(`Đã bỏ đánh dấu hoàn thành: "${title}"`);
        } else {
          playSuccessSound();
          awardXp(5);
          showToast(`Đã đánh dấu hoàn thành: "${title}" (+5 XP)`);
        }
        return updated;
      });
    },
    [completedStorageKey, showToast]
  );

  // Open Interactive Reader Modal with lazy-loaded contentBlocks or fallback Detail Modal
  const openResourceReader = useCallback(async (item) => {
    if (!item) return;
    playClickSound();
    if (item.isInteractiveGuide) {
      setActiveReaderResource(item);
      setReaderDetail(null);
      setIsLoadingReader(true);
      try {
        const full = await loadMaterialDetailById(item.id);
        setReaderDetail(full || item);
      } catch {
        setReaderDetail(item);
      } finally {
        setIsLoadingReader(false);
      }
      return;
    }
    setActiveDetailResource(item);
  }, []);

  const closeResourceReader = useCallback(() => {
    setActiveReaderResource(null);
    setReaderDetail(null);
    setIsLoadingReader(false);
  }, []);

  const openWorksheetWithChars = useCallback((chars = '学习汉语') => {
    setWorksheetChars(String(chars || '学习汉语'));
    setIsWorksheetModalOpen(true);
  }, []);

  const closeWorksheetModal = useCallback(() => {
    setIsWorksheetModalOpen(false);
  }, []);

  const handleSaveTermToSrs = useCallback(
    (term) => {
      if (!term?.hanzi) return;
      captureWeakVocabulary(
        {
          hanzi: term.hanzi,
          pinyin: term.pinyin || '',
          meaning: term.meaning || '',
          hanviet: term.hanviet || '',
          level: term.level || 'HSK 1',
        },
        'materials_library',
        user
      );
      setSavedSrsTerms((prev) => {
        const next = new Set(prev);
        next.add(term.hanzi);
        return next;
      });
      showToast(`Đã lưu "${term.hanzi}" vào sổ ôn tập SRS!`);
    },
    [user, showToast]
  );

  // Copy document link
  const handleCopyLink = (item) => {
    playClickSound();
    const targetUrl = item.sourceUrl || item.downloadUrl || window.location.href;
    const fullUrl = normalizeMaterialUrl(targetUrl, window.location.origin);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    showToast('Đã sao chép liên kết tài liệu vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Increment download count and open URL
  const handleDownloadClick = (item) => {
    playClickSound();
    awardXp(5);
    setMaterials((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m))
    );
  };

  // Inline Pronunciation Audio preview for cards
  const handlePlaySampleAudio = (e, item) => {
    e.stopPropagation();
    playClickSound();
    const sampleText = getSampleAudioTextForMaterial(item);
    speakChinese(sampleText);
    showToast(`🔊 Đang phát âm giọng chuẩn Bắc Kinh: "${sampleText}"`);
  };

  // Quick fill suggestion
  const handleApplySuggestion = (sug) => {
    playClickSound();
    setNewTitle(sug.title);
    setNewCategory(sug.category);
    setNewLevel(sug.level);
    setNewSkills(Array.isArray(sug.skills) ? sug.skills.join(', ') : sug.skills || '');
    setNewPublisher(sug.publisher || '');
    setNewFormat(sug.format);
    setNewLanguage(sug.language || 'Song ngữ Trung - Việt');
    setNewLicense(sug.license || 'Tài liệu Giáo dục Mở HanziGo');
    setNewVerificationStatus(sug.verificationStatus || 'curated');
    setNewRelatedLessonId(sug.relatedLessonId || '');
    setNewVerificationNotes(sug.verificationNotes || '');
    setNewFileSize(sug.fileSize);
    setNewAuthor(sug.author);
    setNewDownloadUrl(sug.downloadUrl);
    setNewSourceUrl(sug.sourceUrl || sug.downloadUrl);
    setNewDescription(sug.description);
    setNewTags(sug.tags);
  };

  // Handle Add New Material
  const handleAddNewMaterial = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('⚠️ Chỉ Quản trị viên mới có quyền đăng tải học liệu lên thư viện.');
      setShowAddModal(false);
      return;
    }
    if (!newTitle.trim()) return;

    playClickSound();

    const tagList = newTags
      ? newTags.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
      : [newCategory, newLevel];

    const skillList = newSkills
      ? newSkills.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      : ['Từ vựng', 'Ngữ pháp'];

    const newMat = {
      id: `mat-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      skills: skillList,
      format: newFormat || 'PDF',
      fileSize: newFileSize.trim() || 'Tài liệu số',
      author: newAuthor.trim() || 'Người dùng HanziGo',
      publisher: newPublisher.trim() || newAuthor.trim() || 'Cộng đồng HanziGo',
      language: newLanguage || 'Song ngữ Trung - Việt',
      license: newLicense.trim() || 'Tài liệu học tập HanziGo',
      verificationStatus: newVerificationStatus || 'curated',
      relatedLessonId: newRelatedLessonId.trim() || '',
      verificationNotes: newVerificationNotes.trim() || 'Được đóng góp bởi học viên và cộng đồng HanziGo.',
      description: newDescription.trim() || 'Tài liệu học tiếng Trung do người dùng tự tổng hợp và chia sẻ.',
      downloadUrl: newDownloadUrl.trim() || '#',
      sourceUrl: newSourceUrl.trim() || newDownloadUrl.trim() || '#',
      tags: tagList,
      isCustom: true,
      isHidden: false,
      createdAt: new Date().toISOString().split('T')[0],
      downloadsCount: 1,
    };

    saveMaterial(newMat);
    const updated = [newMat, ...materials];
    setMaterials(updated);

    const cloudId = await addMaterialToDb(newMat);
    awardXp(20);

    playSuccessSound();
    setShowAddModal(false);
    if (cloudId) {
      showToast('Đã thêm tài liệu mới & đồng bộ lên máy chủ! (+20 XP)');
    } else {
      showToast('Đã lưu tài liệu vào danh mục cục bộ (+20 XP)');
    }

    // Reset Form
    setNewTitle('');
    setNewCategory('Giáo trình chuẩn');
    setNewLevel('HSK 1');
    setNewSkills('Từ vựng, Nghe hiểu');
    setNewPublisher('');
    setNewFormat('PDF');
    setNewLanguage('Song ngữ Trung - Việt');
    setNewLicense('Tài liệu Giáo dục Mở HanziGo');
    setNewVerificationStatus('curated');
    setNewRelatedLessonId('');
    setNewVerificationNotes('');
    setNewFileSize('');
    setNewAuthor('');
    setNewDownloadUrl('');
    setNewSourceUrl('');
    setNewDescription('');
    setNewTags('');
  };

  // Handle Request Material Submit
  const handleRequestMaterialSubmit = (e) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    playClickSound();
    try {
      const existing = JSON.parse(localStorage.getItem('hanzigo_material_requests') || '[]');
      const newReq = {
        id: `req-${Date.now()}`,
        title: reqTitle.trim(),
        category: reqCategory,
        level: reqLevel,
        format: reqFormat,
        note: reqNote.trim(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('hanzigo_material_requests', JSON.stringify([newReq, ...existing]));
    } catch {}

    awardXp(10);
    playSuccessSound();
    setShowRequestModal(false);
    showToast('Cảm ơn bạn! Ban Học thuật HanziGo đã ghi nhận yêu cầu tài liệu (+10 XP)!');

    setReqTitle('');
    setReqNote('');
  };

  // Delete Material
  const handleDeleteMaterial = (id, title, e) => {
    if (e) e.stopPropagation();
    playClickSound();
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu: "${title}"?`)) return;

    deleteMaterial(id);
    deleteMaterialFromDb(id);
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);

    if (selectedPreviewDoc && selectedPreviewDoc.id === id) {
      setSelectedPreviewDoc(null);
    }

    showToast('Đã xóa tài liệu khỏi danh sách.');
  };

  // Admin Toggle Hide
  const handleToggleHide = async (item, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    playClickSound();
    const newHidden = !item.isHidden;
    const updatedItem = { ...item, isHidden: newHidden };
    updateMaterial(item.id, { isHidden: newHidden });
    await updateMaterialInDb(item.id, { isHidden: newHidden });
    setMaterials((prev) => prev.map((m) => (m.id === item.id ? updatedItem : m)));
    showToast(newHidden ? `Đã tạm ẩn: "${item.title}"` : `Đã công khai: "${item.title}"`);
  };

  // Admin Toggle Feature
  const handleToggleFeature = async (item, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;
    playClickSound();
    const newFeatured = !item.isFeatured;
    const updatedItem = { ...item, isFeatured: newFeatured };
    updateMaterial(item.id, { isFeatured: newFeatured });
    await updateMaterialInDb(item.id, { isFeatured: newFeatured });
    setMaterials((prev) => prev.map((m) => (m.id === item.id ? updatedItem : m)));
    showToast(newFeatured ? `Đã ghim nổi bật: "${item.title}"` : `Đã bỏ ghim: "${item.title}"`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    playClickSound();
    setSearchTerm('');
    setSelectedAcademicCategory('all');
    setSelectedCategory('Tất cả');
    setSelectedGuideType('Tất cả');
    setSelectedLevel('Tất cả');
    setSelectedSkill('Tất cả kỹ năng');
    setSelectedVerification('all');
    setSelectedExamVersion('all');
    setSelectedLanguage('all');
    setSelectedHostType('all');
    setFormatFilter('all');
    setActiveTabFilter('all');
    setReadStatusFilter('all');
  };

  // Select Level Bundle
  const handleSelectBundle = (bundle) => {
    playClickSound();
    setSelectedLevel(bundle.level);
    setSelectedCategory('Tất cả');
    setSelectedGuideType('Tất cả');
    setSelectedAcademicCategory('all');
    setActiveTabFilter('all');
    setReadStatusFilter('all');
    const matched = materials.find((m) => m.id === bundle.recommendDocId);
    if (matched) {
      showToast(`Đã lọc gói tài liệu: ${bundle.title}`);
    }
  };

  const filteredMaterials = useMemo(
    () =>
      filterAndSortMaterials(materials, {
        searchTerm,
        selectedAcademicCategory,
        selectedCategory,
        selectedGuideType,
        selectedLevel,
        selectedSkill,
        selectedExamVersion,
        selectedLanguage,
        selectedHostType,
        selectedVerification,
        activeTabFilter,
        readStatusFilter,
        formatFilter,
        sortBy,
        bookmarkedIds,
        completedIds,
        isAdmin,
      }),
    [
      materials,
      searchTerm,
      selectedAcademicCategory,
      selectedCategory,
      selectedGuideType,
      selectedLevel,
      selectedSkill,
      selectedExamVersion,
      selectedLanguage,
      selectedHostType,
      selectedVerification,
      activeTabFilter,
      readStatusFilter,
      formatFilter,
      sortBy,
      bookmarkedIds,
      completedIds,
      isAdmin,
    ]
  );

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedAcademicCategory !== 'all' ||
    selectedCategory !== 'Tất cả' ||
    selectedGuideType !== 'Tất cả' ||
    selectedLevel !== 'Tất cả' ||
    selectedSkill !== 'Tất cả kỹ năng' ||
    selectedVerification !== 'all' ||
    selectedExamVersion !== 'all' ||
    selectedLanguage !== 'all' ||
    selectedHostType !== 'all' ||
    formatFilter !== 'all' ||
    activeTabFilter !== 'all' ||
    readStatusFilter !== 'all';

  const activeMobileFilterCount = [
    selectedCategory !== 'Tất cả',
    selectedGuideType !== 'Tất cả',
    selectedLevel !== 'Tất cả',
    selectedSkill !== 'Tất cả kỹ năng',
    selectedVerification !== 'all',
    selectedExamVersion !== 'all',
    selectedLanguage !== 'all',
    selectedHostType !== 'all',
    formatFilter !== 'all',
    readStatusFilter !== 'all',
  ].filter(Boolean).length;

  const effectiveViewMode = useMemo(
    () => resolveMaterialsViewMode({ manualViewMode, selectedGuideType }),
    [manualViewMode, selectedGuideType]
  );

  const handleChangeViewMode = useCallback((nextMode) => {
    if (nextMode !== 'grid' && nextMode !== 'list') return;
    playClickSound();
    setManualViewMode(nextMode);
    writeManualViewMode(nextMode);
  }, []);

  const handleToggleBookmarkedOnly = useCallback(() => {
    playClickSound();
    setReadStatusFilter((prev) => (prev === 'bookmarked' ? 'all' : 'bookmarked'));
  }, []);

  const filterSignature = `${searchTerm}|${selectedAcademicCategory}|${selectedCategory}|${selectedGuideType}|${selectedLevel}|${selectedSkill}|${selectedExamVersion}|${selectedLanguage}|${selectedHostType}|${selectedVerification}|${activeTabFilter}|${readStatusFilter}|${formatFilter}|${sortBy}|${effectiveViewMode}`;
  const currentMultiplier = paginationState.signature === filterSignature ? paginationState.multiplier : 1;
  const pageStep = getPaginationStep(effectiveViewMode);
  const visibleMaterials = useMemo(
    () => filteredMaterials.slice(0, currentMultiplier * pageStep),
    [filteredMaterials, currentMultiplier, pageStep]
  );
  const remainingMaterialsCount = Math.max(0, filteredMaterials.length - visibleMaterials.length);
  const hasMoreMaterials = remainingMaterialsCount > 0;

  const handleLoadMore = useCallback(() => {
    playClickSound();
    setPaginationState((prev) => ({
      signature: filterSignature,
      multiplier: prev.signature === filterSignature ? prev.multiplier + 1 : 2,
    }));
  }, [filterSignature]);

  const customMaterialsCount = materials.filter((m) => m.isCustom).length;
  const audioMaterialsCount = materials.filter(
    (m) => (m.format || '').includes('MP3') || (m.tags && m.tags.some((t) => t.toLowerCase().includes('audio')))
  ).length;
  const verifiedCount = materials.filter(
    (m) => m.verificationStatus === 'verified_official' || m.verificationStatus === 'verified_oer'
  ).length;

  return {
    materials,
    setMaterials,
    searchTerm,
    setSearchTerm,
    selectedAcademicCategory,
    setSelectedAcademicCategory,
    selectedCategory,
    setSelectedCategory,
    selectedGuideType,
    setSelectedGuideType,
    selectedLevel,
    setSelectedLevel,
    selectedSkill,
    setSelectedSkill,
    selectedVerification,
    setSelectedVerification,
    selectedExamVersion,
    setSelectedExamVersion,
    selectedLanguage,
    setSelectedLanguage,
    selectedHostType,
    setSelectedHostType,
    formatFilter,
    setFormatFilter,
    activeTabFilter,
    setActiveTabFilter,
    readStatusFilter,
    setReadStatusFilter,
    sortBy,
    setSortBy,
    isFilterOpen,
    setIsFilterOpen,
    activeDetailResource,
    setActiveDetailResource,
    activeReaderResource,
    readerDetail,
    isLoadingReader,
    openResourceReader,
    closeResourceReader,
    isWorksheetModalOpen,
    worksheetChars,
    openWorksheetWithChars,
    closeWorksheetModal,
    savedSrsTerms,
    handleSaveTermToSrs,
    brokenReportTarget,
    setBrokenReportTarget,
    isLoading,
    isSyncing,
    fetchError,
    copiedId,
    bookmarkedIds,
    completedIds,
    toggleCompleted,
    showAddModal,
    setShowAddModal,
    showRequestModal,
    setShowRequestModal,
    showMizigeGenModal,
    setShowMizigeGenModal,
    selectedPreviewDoc,
    setSelectedPreviewDoc,
    previewTab,
    setPreviewTab,
    quizAnsweredIndex,
    setQuizAnsweredIndex,
    mizigeInputText,
    setMizigeInputText,
    mizigeGridStyle,
    setMizigeGridStyle,
    newTitle,
    setNewTitle,
    newCategory,
    setNewCategory,
    newLevel,
    setNewLevel,
    newSkills,
    setNewSkills,
    newPublisher,
    setNewPublisher,
    newFormat,
    setNewFormat,
    newLanguage,
    setNewLanguage,
    newLicense,
    setNewLicense,
    newVerificationStatus,
    setNewVerificationStatus,
    newRelatedLessonId,
    setNewRelatedLessonId,
    newVerificationNotes,
    setNewVerificationNotes,
    newFileSize,
    setNewFileSize,
    newAuthor,
    setNewAuthor,
    newDownloadUrl,
    setNewDownloadUrl,
    newSourceUrl,
    setNewSourceUrl,
    newDescription,
    setNewDescription,
    newTags,
    setNewTags,
    reqTitle,
    setReqTitle,
    reqCategory,
    setReqCategory,
    reqLevel,
    setReqLevel,
    reqFormat,
    setReqFormat,
    reqNote,
    setReqNote,
    toast,
    showToast,
    applyAuthoritativeMaterials,
    handleRefreshCloud,
    toggleBookmark,
    handleCopyLink,
    handleDownloadClick,
    handlePlaySampleAudio,
    handleApplySuggestion,
    handleAddNewMaterial,
    handleRequestMaterialSubmit,
    handleDeleteMaterial,
    handleToggleHide,
    handleToggleFeature,
    handleResetFilters,
    handleSelectBundle,
    filteredMaterials,
    visibleMaterials,
    hasMoreMaterials,
    remainingMaterialsCount,
    handleLoadMore,
    effectiveViewMode,
    manualViewMode,
    handleChangeViewMode,
    handleToggleBookmarkedOnly,
    hasActiveFilters,
    activeMobileFilterCount,
    customMaterialsCount,
    audioMaterialsCount,
    verifiedCount,
  };
}
