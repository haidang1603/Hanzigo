/// Helper for managing Documents, Materials, and Custom Content in HanziGo
import { triggerCloudSync } from '../supabase/services.js';
import { getUserStorageKey } from './gamification.js';
import { DEFAULT_MATERIALS } from '../data/defaultMaterialsData.js';

export { DEFAULT_MATERIALS };
export const CURRENT_MATERIALS_VERSION = 'v2.1_academic';

export const MATERIAL_CATEGORIES = [
  'Tất cả',
  'Giáo trình chuẩn',
  'Ngữ pháp chuyên sâu',
  'Đề thi HSK',
  'Bộ thủ & Hán tự',
  'Thành ngữ & Giao tiếp',
  'Kỹ năng Nghe & Đọc'
];

export const MATERIAL_LEVELS = [
  'Tất cả',
  'Nhập môn',
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6',
  'HSK 7-9'
];

export const MATERIAL_SKILLS = [
  'Tất cả kỹ năng',
  'Nghe hiểu',
  'Nói & Khẩu ngữ',
  'Đọc hiểu',
  'Viết & Thuận bút',
  'Ngữ pháp',
  'Từ vựng',
  'Luyện thi HSK'
];

export const MATERIAL_FORMATS = [
  'PDF',
  'PDF + MP3',
  'ZIP (PDF + MP3)',
  'PDF In A4 Vector',
  'Tương tác & In PDF',
  'Trực tuyến & MP3',
  'Trực tuyến & In A4',
  'Bách khoa Ngữ pháp',
  'Từ điển Mở',
  'Vector Thuận bút',
  'Tệp Âm thanh CC0',
  'Video Bài giảng',
  'Đề thi Chính thức'
];

export const VERIFICATION_STATUS_META = {
  verified_official: {
    label: 'Chính thức CTI / Bộ GD',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    icon: '🛡️'
  },
  verified_oer: {
    label: 'Giáo dục mở OER / CC',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    icon: '✅'
  },
  academic_reference: {
    label: 'Đại học BLCU / ULIS',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    icon: '🏛️'
  },
  curated: {
    label: 'Tuyển chọn chất lượng',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    icon: '⭐'
  }
};

// Helper functions for Materials
export function getStoredMaterials() {
  const materialsKey = getUserStorageKey('hanzigo_materials');
  const versionKey = getUserStorageKey('hanzigo_materials_version');
  try {
    const savedVersion = localStorage.getItem(versionKey);
    const saved = localStorage.getItem(materialsKey);

    if (saved && savedVersion === CURRENT_MATERIALS_VERSION) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Auto-migrate to current academic version if version mismatched or missing
    let customItems = [];
    if (saved) {
      try {
        const oldParsed = JSON.parse(saved);
        if (Array.isArray(oldParsed)) {
          customItems = oldParsed.filter(item => item.isCustom);
        }
      } catch {}
    }

    const merged = [...customItems, ...DEFAULT_MATERIALS];
    localStorage.setItem(materialsKey, JSON.stringify(merged));
    localStorage.setItem(versionKey, CURRENT_MATERIALS_VERSION);
    return merged;
  } catch (err) {
    console.error('Error reading stored materials:', err);
  }
  // Fallback to default
  localStorage.setItem(materialsKey, JSON.stringify(DEFAULT_MATERIALS));
  localStorage.setItem(versionKey, CURRENT_MATERIALS_VERSION);
  return DEFAULT_MATERIALS;
}

export function saveMaterial(material) {
  const current = getStoredMaterials();
  const newMaterial = {
    ...material,
    id: material.id || `mat-${Date.now()}`,
    skills: Array.isArray(material.skills) ? material.skills : (material.skills ? [material.skills] : ['Tổng hợp']),
    language: material.language || 'Song ngữ Trung - Việt',
    license: material.license || 'Tài liệu giáo dục',
    verificationStatus: material.verificationStatus || 'curated',
    relatedLessonId: material.relatedLessonId || null,
    sourceUrl: material.sourceUrl || material.downloadUrl || '',
    createdAt: material.createdAt || new Date().toISOString().split('T')[0],
    downloadsCount: material.downloadsCount || 0
  };
  const updated = [newMaterial, ...current];
  localStorage.setItem(getUserStorageKey('hanzigo_materials'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function updateMaterial(id, updatedData) {
  const current = getStoredMaterials();
  const updated = current.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
  localStorage.setItem(getUserStorageKey('hanzigo_materials'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteMaterial(id) {
  const current = getStoredMaterials();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(getUserStorageKey('hanzigo_materials'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function resetMaterials() {
  localStorage.setItem(getUserStorageKey('hanzigo_materials'), JSON.stringify(DEFAULT_MATERIALS));
  localStorage.setItem(getUserStorageKey('hanzigo_materials_version'), CURRENT_MATERIALS_VERSION);
  triggerCloudSync();
  return DEFAULT_MATERIALS;
}

// Custom Vocabulary Helpers
export function getStoredCustomVocab() {
  try {
    const saved = localStorage.getItem(getUserStorageKey('hanzigo_custom_vocab'));
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom vocab:', err);
  }
  return [];
}

export function saveCustomVocab(vocab) {
  const current = getStoredCustomVocab();
  const newItem = {
    ...vocab,
    id: vocab.id || `custom-vocab-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem(getUserStorageKey('hanzigo_custom_vocab'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomVocab(id) {
  const current = getStoredCustomVocab();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(getUserStorageKey('hanzigo_custom_vocab'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

// Custom Lessons Helpers
export function getStoredCustomLessons() {
  try {
    const saved = localStorage.getItem(getUserStorageKey('hanzigo_custom_lessons'));
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored custom lessons:', err);
  }
  return [];
}

export function saveCustomLesson(lesson) {
  const current = getStoredCustomLessons();
  const newItem = {
    ...lesson,
    id: lesson.id || `custom-lesson-${Date.now()}`,
    isCustom: true
  };
  const updated = [newItem, ...current];
  localStorage.setItem(getUserStorageKey('hanzigo_custom_lessons'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}

export function deleteCustomLesson(id) {
  const current = getStoredCustomLessons();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(getUserStorageKey('hanzigo_custom_lessons'), JSON.stringify(updated));
  triggerCloudSync();
  return updated;
}
