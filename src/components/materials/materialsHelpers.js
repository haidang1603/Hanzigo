import { HSK_LEARNING_RESOURCES } from '../../data/hskResourcesData.js';
import { HANZIGO_LIBRARY_CATALOG } from '../../data/materials/index.js';
import { CANONICAL_SITE_ORIGIN, SKILL_LABEL_MAP } from './materialsConstants.js';

export const MATERIAL_BOOKMARKS_PREFIX = 'hanzigo_bookmarked_materials';
export const MATERIAL_COMPLETED_PREFIX = 'hanzigo_completed_materials';
export const MATERIALS_VIEW_MODE_STORAGE_KEY = 'hanzigo_materials_view_mode';

export const QUICK_LOOKUP_GUIDE_TYPES = new Set([
  'Ngữ pháp',
  'Lượng từ',
  'Bộ thủ',
  'Bộ thủ & Bút thuận',
]);

export const COMPACT_GUIDE_TABS = [
  { id: 'Tất cả', label: 'Tất cả' },
  { id: 'Ngữ pháp', label: 'Ngữ pháp' },
  { id: 'Từ gần nghĩa', label: 'Từ gần nghĩa' },
  { id: 'Bộ thủ & Bút thuận', label: 'Bộ thủ' },
  { id: 'Lượng từ', label: 'Lượng từ' },
  { id: 'Chiến thuật HSK', label: 'Chiến thuật HSK' },
  { id: 'Phiếu in ấn', label: 'Phiếu in ấn' },
  { id: 'Nguồn chính thống', label: 'Nguồn mở' },
];

export function readManualViewMode(
  storage = typeof localStorage !== 'undefined' ? localStorage : null
) {
  if (!storage) return null;
  try {
    const val = storage.getItem(MATERIALS_VIEW_MODE_STORAGE_KEY);
    return val === 'grid' || val === 'list' ? val : null;
  } catch {
    return null;
  }
}

export function writeManualViewMode(
  mode,
  storage = typeof localStorage !== 'undefined' ? localStorage : null
) {
  if (!storage || (mode !== 'grid' && mode !== 'list')) return false;
  try {
    storage.setItem(MATERIALS_VIEW_MODE_STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}

export function resolveMaterialsViewMode({
  manualViewMode = null,
  selectedGuideType = 'Tất cả',
} = {}) {
  if (manualViewMode === 'grid' || manualViewMode === 'list') {
    return manualViewMode;
  }
  if (QUICK_LOOKUP_GUIDE_TYPES.has(selectedGuideType)) {
    return 'list';
  }
  return 'grid';
}

export function getPaginationStep(viewMode) {
  return viewMode === 'list' ? 24 : 12;
}

export function formatCompactLevelBadge(level = '') {
  const raw = String(level || '').trim();
  if (!raw) return 'HSK';
  if (/^tất cả$/i.test(raw) || /^all$/i.test(raw)) return 'All';
  if (/nhập môn/i.test(raw)) return 'NM';
  const matchRange = raw.match(/hsk\s*(\d)\s*[-–]\s*(\d)/i);
  if (matchRange) return `H${matchRange[1]}-${matchRange[2]}`;
  const matchSingle = raw.match(/hsk\s*(\d)/i);
  if (matchSingle) return `H${matchSingle[1]}`;
  return raw.slice(0, 6);
}

export function stripVietnameseAndPinyinTones(input = '') {
  return String(input || '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[üǖǘǚǜ]/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getMaterialBookmarkKey(user) {
  return user?.id ? `${MATERIAL_BOOKMARKS_PREFIX}_${user.id}` : `${MATERIAL_BOOKMARKS_PREFIX}_guest`;
}

export function getMaterialCompletedKey(user) {
  return user?.id ? `${MATERIAL_COMPLETED_PREFIX}_${user.id}` : `${MATERIAL_COMPLETED_PREFIX}_guest`;
}

export function readScopedMaterialIds(storageKey, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage || !storageKey) return [];
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeScopedMaterialIds(
  storageKey,
  ids,
  storage = typeof localStorage !== 'undefined' ? localStorage : null
) {
  if (!storage || !storageKey) return false;
  try {
    const unique = Array.from(new Set(Array.isArray(ids) ? ids : []));
    storage.setItem(storageKey, JSON.stringify(unique));
    return true;
  } catch {
    return false;
  }
}

function inferGuideType(item) {
  if (item.guideType) return item.guideType;
  if (item.host_type === 'official_published' || item.verificationStatus === 'verified_official') {
    return 'Nguồn chính thống';
  }
  const cat = String(item.category || '').toLowerCase();
  const acad = String(item.academic_category || '').toLowerCase();
  const fmt = String(item.format || '').toLowerCase();
  if (fmt.includes('in') || (item.downloadUrl || '').endsWith('.html')) return 'Phiếu in ấn';
  if (acad === 'chinese_characters' || cat.includes('bộ thủ')) return 'Bộ thủ & Bút thuận';
  if (acad === 'grammar' || cat.includes('ngữ pháp')) return 'Ngữ pháp';
  if (acad === 'hsk_preparation' || cat.includes('đề thi')) return 'Chiến thuật HSK';
  return 'Nguồn chính thống';
}

function matchesHskLevelFilter(itemLevelRaw = '', selectedLevel = 'Tất cả') {
  if (selectedLevel === 'Tất cả') return true;
  const itemLevel = String(itemLevelRaw || '').toUpperCase();
  const filterLvl = String(selectedLevel || '').toUpperCase();
  if (!itemLevel) return false;
  if (itemLevel === 'TẤT CẢ' || itemLevel === 'ALL') return true;
  if (itemLevel.includes(filterLvl)) return true;
  if (filterLvl === 'HSK 7-9') {
    return itemLevel.includes('7-9') || itemLevel.includes('7–9') || itemLevel.includes('1-9') || itemLevel.includes('5-9') || /HSK\s*[789]/.test(itemLevel);
  }
  const targetMatch = filterLvl.match(/HSK\s*(\d)/);
  if (!targetMatch) return itemLevel.includes(filterLvl);
  const targetNum = Number(targetMatch[1]);
  const rangeMatch = itemLevel.match(/(\d)\s*[-–]\s*(\d)/);
  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);
    return targetNum >= min && targetNum <= max;
  }
  return false;
}

export function normalizeMaterialUrl(url, origin = CANONICAL_SITE_ORIGIN) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#') return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleanOrigin = (origin || CANONICAL_SITE_ORIGIN).replace(/\/+$/, '');
  return trimmed.startsWith('/') ? `${cleanOrigin}${trimmed}` : `${cleanOrigin}/${trimmed}`;
}

export function enrichAndMergeMaterials(baseItems) {
  const safeBase = Array.isArray(baseItems) ? baseItems : [];
  const seenIds = new Set(safeBase.map((m) => String(m.id)));

  const enrichedBase = safeBase.map((m) => {
    if (m.academic_category) {
      return {
        ...m,
        guideType: inferGuideType(m),
        examSystem: m.examSystem || (m.exam_version === '3.0' ? 'hsk_3_0' : m.exam_version === '2.0' ? 'hsk_2_0' : 'both'),
        estimatedMinutes: m.estimatedMinutes || 10,
        summary: m.summary || m.description || '',
      };
    }
    let acad = 'textbooks_courses';
    const cat = (m.category || '').toLowerCase();
    const skills = Array.isArray(m.skills) ? m.skills.join(' ').toLowerCase() : '';
    if (cat.includes('phát âm') || skills.includes('phát âm') || m.id === 'feat-pinyin') {
      acad = 'pinyin_pronunciation';
    } else if (
      cat.includes('bộ thủ') ||
      cat.includes('viết') ||
      skills.includes('thuận bút') ||
      m.id === 'mat-4' ||
      m.id === 'mat-9' ||
      m.id === 'feat-radicals' ||
      m.id === 'feat-mizige' ||
      m.id === 'feat-tianzige'
    ) {
      acad = 'chinese_characters';
    } else if (cat.includes('từ vựng') || skills.includes('từ vựng') || m.id === 'mat-1' || m.id === 'mat-3') {
      acad = 'vocabulary';
    } else if (cat.includes('ngữ pháp') || skills.includes('ngữ pháp') || m.id === 'mat-5' || m.id === 'feat-grammar') {
      acad = 'grammar';
    } else if (
      cat.includes('giao tiếp') ||
      skills.includes('nói') ||
      skills.includes('nghe') ||
      m.id === 'mat-2' ||
      m.id === 'feat-phrases'
    ) {
      acad = 'listening_speaking';
    } else if (skills.includes('đọc') || skills.includes('viết')) {
      acad = 'reading_writing';
    } else if (cat.includes('đề thi') || skills.includes('luyện thi') || m.id === 'mat-6') {
      acad = 'hsk_preparation';
    } else if (cat.includes('thành ngữ') || cat.includes('văn hóa') || m.id === 'mat-10' || m.id === 'feat-hanviet') {
      acad = 'culture_communication';
    }
    const baseEnriched = {
      ...m,
      academic_category: acad,
      host_type: m.host_type || (m.downloadUrl && m.downloadUrl.startsWith('/') ? 'hanzigo_original' : 'free_external'),
      permission_status: m.permission_status || 'open_educational',
      verified_date: m.verified_date || '2026-10-12',
      examSystem: m.examSystem || (m.exam_version === '3.0' ? 'hsk_3_0' : m.exam_version === '2.0' ? 'hsk_2_0' : 'both'),
      estimatedMinutes: m.estimatedMinutes || 10,
      summary: m.summary || m.description || '',
    };
    return {
      ...baseEnriched,
      guideType: inferGuideType(baseEnriched),
    };
  });

  const structuredHanziGo = HANZIGO_LIBRARY_CATALOG.filter((item) => {
    const key = String(item.id);
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  const additionalAcademic = HSK_LEARNING_RESOURCES
    .filter((r) => {
      const key = String(r.id);
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    })
    .map((r) => {
      const item = {
        ...r,
        sourceUrl: r.sourceUrl || r.source_url || '',
        downloadUrl: r.downloadUrl || r.download_url || r.source_url || '',
        author: r.author || r.source_author || r.publisher || 'HanziGo Academic',
        language: r.language || r.language_of_instruction || 'Song ngữ Trung - Việt',
        skills:
          Array.isArray(r.skills) && r.skills.length > 0
            ? r.skills
            : [SKILL_LABEL_MAP[r.skill] || 'Tổng hợp đa kỹ năng'],
        createdAt: r.createdAt || r.verified_date || '2026-10-12',
        examSystem: r.examSystem || (r.exam_version === '3.0' ? 'hsk_3_0' : r.exam_version === '2.0' ? 'hsk_2_0' : 'both'),
        estimatedMinutes: r.estimatedMinutes || 15,
        summary: r.summary || r.description || '',
      };
      return {
        ...item,
        guideType: inferGuideType(item),
      };
    });

  return [...structuredHanziGo, ...enrichedBase, ...additionalAcademic];
}

export function filterAndSortMaterials(materials, filters = {}) {
  const {
    searchTerm = '',
    selectedAcademicCategory = 'all',
    selectedCategory = 'Tất cả',
    selectedGuideType = 'Tất cả',
    selectedLevel = 'Tất cả',
    selectedSkill = 'Tất cả kỹ năng',
    selectedExamVersion = 'all',
    selectedLanguage = 'all',
    selectedHostType = 'all',
    selectedVerification = 'all',
    activeTabFilter = 'all',
    readStatusFilter = 'all',
    formatFilter = 'all',
    sortBy = 'downloads',
    bookmarkedIds = [],
    completedIds = [],
    isAdmin = false,
  } = filters;

  const rawTerm = String(searchTerm || '').toLowerCase().trim();
  const normalizedTerm = stripVietnameseAndPinyinTones(rawTerm);

  const matchesNormalizedField = (val) => {
    if (!val) return false;
    const str = String(val);
    return str.toLowerCase().includes(rawTerm) || stripVietnameseAndPinyinTones(str).includes(normalizedTerm);
  };

  return materials
    .filter((item) => {
      // 1. RBAC check: Non-admins cannot see hidden materials
      if (item.isHidden && !isAdmin) return false;

      // 2. Trilingual search across Hanzi, Pinyin (with/without tones), and Vietnamese (accented/accentless)
      const matchesSearch =
        !rawTerm ||
        matchesNormalizedField(item.title) ||
        matchesNormalizedField(item.title_cn) ||
        matchesNormalizedField(item.summary) ||
        matchesNormalizedField(item.description) ||
        matchesNormalizedField(item.guideType) ||
        matchesNormalizedField(item.category) ||
        matchesNormalizedField(item.author) ||
        matchesNormalizedField(item.publisher) ||
        matchesNormalizedField(item.license) ||
        matchesNormalizedField(item.relatedLessonId) ||
        (Array.isArray(item.related_lesson_ids) && item.related_lesson_ids.some(matchesNormalizedField)) ||
        (Array.isArray(item.related_exam_ids) && item.related_exam_ids.some(matchesNormalizedField)) ||
        (Array.isArray(item.learning_objectives) && item.learning_objectives.some(matchesNormalizedField)) ||
        (Array.isArray(item.skills) && item.skills.some(matchesNormalizedField)) ||
        (Array.isArray(item.pinyinKeywords) && item.pinyinKeywords.some(matchesNormalizedField)) ||
        (Array.isArray(item.tags) && item.tags.some(matchesNormalizedField));

      // 3. Academic Category (A - I)
      const matchesAcademicCategory =
        selectedAcademicCategory === 'all' || item.academic_category === selectedAcademicCategory;

      // 4. Legacy Category & Guide Type Filters
      const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const normalizedGuideFilter =
        selectedGuideType === 'Bộ thủ'
          ? 'Bộ thủ & Bút thuận'
          : selectedGuideType === 'Nguồn mở'
            ? 'Nguồn chính thống'
            : selectedGuideType;
      const matchesGuideType =
        !normalizedGuideFilter ||
        normalizedGuideFilter === 'Tất cả' ||
        normalizedGuideFilter === 'all' ||
        item.guideType === normalizedGuideFilter;

      // 5. Level Filter (HSK 1..6 and HSK 7-9, including range labels)
      const matchesLevel = matchesHskLevelFilter(item.level, selectedLevel);

      // 6. Skill Filter
      let matchesSkill = true;
      if (selectedSkill !== 'Tất cả kỹ năng') {
        matchesSkill =
          Array.isArray(item.skills) &&
          item.skills.some(
            (s) =>
              s.toLowerCase().includes(selectedSkill.toLowerCase()) ||
              selectedSkill.toLowerCase().includes(s.toLowerCase())
          );
      }

      // 7. Exam Version Filter (2.0 / hsk_2_0, 3.0 / hsk_3_0, both)
      let matchesExamVersion = true;
      if (selectedExamVersion !== 'all') {
        const want30 = selectedExamVersion === '3.0' || selectedExamVersion === 'hsk_3_0';
        const want20 = selectedExamVersion === '2.0' || selectedExamVersion === 'hsk_2_0';
        const sys = item.examSystem || (item.exam_version === '3.0' ? 'hsk_3_0' : item.exam_version === '2.0' ? 'hsk_2_0' : 'both');
        if (want30) {
          matchesExamVersion = sys === 'both' || sys === 'hsk_3_0' || item.exam_version === 'both' || item.exam_version === '3.0';
        } else if (want20) {
          matchesExamVersion = sys === 'both' || sys === 'hsk_2_0' || item.exam_version === 'both' || item.exam_version === '2.0';
        }
      }

      // 8. Language of Instruction Filter
      let matchesLanguage = true;
      if (selectedLanguage !== 'all') {
        matchesLanguage = !item.language_of_instruction || item.language_of_instruction === selectedLanguage;
      }

      // 9. Host Type Filter
      let matchesHostType = true;
      if (selectedHostType !== 'all') {
        matchesHostType = item.host_type === selectedHostType;
      }

      // 10. Verification Status Filter
      let matchesVerification = true;
      if (selectedVerification !== 'all') {
        matchesVerification = item.verificationStatus === selectedVerification;
      }

      // 11. Tabs & Read Status Filter
      let matchesTab = true;
      if (activeTabFilter === 'bookmarked') {
        matchesTab = bookmarkedIds.includes(item.id);
      } else if (activeTabFilter === 'completed') {
        matchesTab = completedIds.includes(item.id);
      } else if (activeTabFilter === 'unread') {
        matchesTab = !completedIds.includes(item.id);
      } else if (activeTabFilter === 'custom') {
        matchesTab = Boolean(item.isCustom);
      }

      let matchesReadStatus = true;
      if (readStatusFilter === 'bookmarked') {
        matchesReadStatus = bookmarkedIds.includes(item.id);
      } else if (readStatusFilter === 'completed') {
        matchesReadStatus = completedIds.includes(item.id);
      } else if (readStatusFilter === 'unread') {
        matchesReadStatus = !completedIds.includes(item.id);
      }

      // 12. Format Filter
      let matchesFormat = true;
      if (formatFilter === 'pdf') {
        matchesFormat = (item.format || '').toLowerCase().includes('pdf') || item.format === 'document_pdf';
      } else if (formatFilter === 'audio') {
        matchesFormat =
          (item.format || '').toLowerCase().includes('mp3') ||
          item.format === 'audio' ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes('audio') || t.toLowerCase().includes('mp3')));
      } else if (formatFilter === 'interactive') {
        matchesFormat =
          (item.format || '').toLowerCase().includes('trực tuyến') ||
          (item.format || '').toLowerCase().includes('tương tác') ||
          (item.format || '').toLowerCase().includes('bách khoa') ||
          (item.format || '').toLowerCase().includes('từ điển') ||
          item.format === 'online_practice' ||
          (item.format || '').toLowerCase().includes('vector');
      } else if (formatFilter === 'print') {
        matchesFormat = (item.format || '').toLowerCase().includes('in') || (item.downloadUrl || '').endsWith('.html');
      }

      return (
        matchesSearch &&
        matchesAcademicCategory &&
        matchesCategory &&
        matchesGuideType &&
        matchesLevel &&
        matchesSkill &&
        matchesExamVersion &&
        matchesLanguage &&
        matchesHostType &&
        matchesVerification &&
        matchesTab &&
        matchesReadStatus &&
        matchesFormat
      );
    })
    .sort((a, b) => {
      if (Boolean(a.isInteractiveGuide) !== Boolean(b.isInteractiveGuide)) {
        return a.isInteractiveGuide ? -1 : 1;
      }
      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
        return b.isFeatured ? 1 : -1;
      }
      if (sortBy === 'downloads') {
        return (b.downloadsCount || 0) - (a.downloadsCount || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || b.verified_date || '2026-01-01') - new Date(a.createdAt || a.verified_date || '2026-01-01');
      }
      if (sortBy === 'recently_verified') {
        return new Date(b.verified_date || b.createdAt || '2026-01-01') - new Date(a.verified_date || a.createdAt || '2026-01-01');
      }
      if (sortBy === 'name') {
        return (a.title || '').localeCompare(b.title || '', 'vi');
      }
      if (sortBy === 'level_asc') {
        return (a.level || '').localeCompare(b.level || '', 'vi');
      }
      return 0;
    });
}

export function getSampleAudioTextForMaterial(item) {
  return item.title.includes('HSK 1')
    ? '你好，很高兴认识你'
    : item.title.includes('HSK 2')
      ? '这个多少钱？'
      : item.title.includes('HSK 3')
        ? '我们一起学习汉语'
        : item.title.includes('214')
          ? '人，木，水，火，土'
          : item.title.includes('500')
            ? '马到成功'
            : '天天向上';
}
