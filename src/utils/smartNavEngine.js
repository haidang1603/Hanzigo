const HISTORY_KEY = 'hanzigo_nav_history_v1';
const PINNED_KEY = 'hanzigo_nav_pinned_v1';

let memoryHistory = {};
let memoryPinned = ['roadmap', 'hsk', 'reader'];

export const SMART_NAV_CATALOG = {
  home: { id: 'home', label: 'Trang chủ', shortLabel: 'Trang chủ' },
  intelligence: { id: 'intelligence', label: 'Trung tâm AI Học tập', shortLabel: 'AI Coach', badge: 'AI' },
  roadmap: { id: 'roadmap', label: 'Lộ trình HSK', shortLabel: 'Lộ trình' },
  hsk: { id: 'hsk', label: 'Thi thử HSK', shortLabel: 'Thi HSK', badge: '1–6' },
  classroom: { id: 'classroom', label: 'Lớp học', shortLabel: 'Lớp học' },
  listening: { id: 'listening', label: 'Luyện nghe HSK', shortLabel: 'Nghe HSK' },
  'listening-studio': { id: 'listening-studio', label: 'Listening Studio & Dictation', shortLabel: 'Dictation', badge: 'Studio' },
  'video-studio': { id: 'video-studio', label: 'Video Studio Song ngữ', shortLabel: 'Video Sub', badge: 'Sub' },
  grammar: { id: 'grammar', label: 'Ngữ pháp HSK', shortLabel: 'Ngữ pháp' },
  vocabulary: { id: 'vocabulary', label: 'Flashcards Từ vựng', shortLabel: 'Từ vựng SRS' },
  pronunciation: { id: 'pronunciation', label: 'Luyện phát âm AI', shortLabel: 'Phát âm' },
  writing: { id: 'writing', label: 'Từ điển & Viết chữ', shortLabel: 'Viết chữ' },
  conversation: { id: 'conversation', label: 'Hội thoại Lão Sư', shortLabel: 'Hội thoại' },
  reader: { id: 'reader', label: 'Đọc hiểu & Immersion', shortLabel: 'Đọc & i+1', badge: 'i+1' },
  'hsk30-translation': { id: 'hsk30-translation', label: 'Xưởng Dịch & HSK 7–9', shortLabel: 'Xưởng Dịch', badge: '7–9' },
  practice: { id: 'practice', label: 'Trung tâm tổng hợp', shortLabel: 'Luyện tập' },
  materials: { id: 'materials', label: 'Thư viện tài liệu', shortLabel: 'Tài liệu' },
  community: { id: 'community', label: 'Cộng đồng học viên', shortLabel: 'Cộng đồng' },
  leaderboard: { id: 'leaderboard', label: 'Bảng vàng cao thủ', shortLabel: 'Xếp hạng' },
  teacher: { id: 'teacher', label: 'Quản lý giảng dạy', shortLabel: 'Giáo viên', requiredRole: 'teacher' },
  admin: { id: 'admin', label: 'Bảng điều khiển Admin', shortLabel: 'Admin', requiredRole: 'admin' },
};

const CONTEXTUAL_NEXT_STEPS = {
  home: ['roadmap', 'hsk', 'reader', 'vocabulary'],
  roadmap: ['practice', 'vocabulary', 'pronunciation', 'hsk'],
  hsk: ['vocabulary', 'grammar', 'listening', 'intelligence'],
  reader: ['vocabulary', 'writing', 'listening', 'grammar'],
  listening: ['pronunciation', 'vocabulary', 'hsk'],
  vocabulary: ['reader', 'writing', 'hsk'],
  writing: ['vocabulary', 'reader', 'grammar'],
  pronunciation: ['conversation', 'listening', 'hsk'],
  grammar: ['hsk', 'writing', 'reader'],
  conversation: ['pronunciation', 'vocabulary', 'reader'],
  practice: ['hsk', 'roadmap', 'intelligence'],
  intelligence: ['roadmap', 'vocabulary', 'hsk'],
  classroom: ['materials', 'hsk', 'vocabulary'],
  materials: ['reader', 'hsk', 'classroom'],
  community: ['leaderboard', 'hsk', 'roadmap'],
  leaderboard: ['hsk', 'roadmap', 'community'],
};

function canAccessItem(item, user) {
  if (!item) return false;
  if (!item.requiredRole) return true;
  const isAdmin = Boolean(user && user.role === 'admin' && user.status !== 'blocked');
  const isTeacher = Boolean(user && (user.role === 'teacher' || isAdmin) && user.status !== 'blocked');
  if (item.requiredRole === 'admin') return isAdmin;
  if (item.requiredRole === 'teacher') return isTeacher;
  return true;
}

export function getNavVisitStats() {
  try {
    if (typeof localStorage === 'undefined') return memoryHistory;
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : memoryHistory;
  } catch {
    return memoryHistory;
  }
}

export function recordNavigationVisit(tabId) {
  if (!tabId || !SMART_NAV_CATALOG[tabId]) return;
  const stats = { ...getNavVisitStats() };
  const prev = stats[tabId] || { count: 0, lastAt: 0 };
  stats[tabId] = {
    count: prev.count + 1,
    lastAt: Date.now(),
  };
  memoryHistory = stats;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(stats));
    }
  } catch {
    // ignore
  }
}

export function getPinnedNavTabs() {
  try {
    if (typeof localStorage === 'undefined') return memoryPinned;
    const raw = localStorage.getItem(PINNED_KEY);
    if (!raw) return memoryPinned;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : memoryPinned;
  } catch {
    return memoryPinned;
  }
}

export function togglePinnedNavTab(tabId) {
  if (!SMART_NAV_CATALOG[tabId]) return getPinnedNavTabs();
  const current = getPinnedNavTabs();
  const next = current.includes(tabId)
    ? current.filter((id) => id !== tabId)
    : [tabId, ...current].slice(0, 5);
  memoryPinned = next;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PINNED_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
  return next;
}

/**
 * Trả về 3–4 gợi ý điều hướng thông minh dựa theo trang hiện tại, tần suất dùng và mục đã ghim
 */
export function getSmartNavSuggestions(activeTab = 'home', user = null, limit = 3) {
  const contextualIds = CONTEXTUAL_NEXT_STEPS[activeTab] || CONTEXTUAL_NEXT_STEPS.home;
  const stats = getNavVisitStats();
  const recentSorted = Object.entries(stats)
    .sort((a, b) => (b[1]?.lastAt || 0) - (a[1]?.lastAt || 0))
    .map(([id]) => id);

  const merged = [...contextualIds, ...recentSorted];
  const seen = new Set([activeTab]);
  const result = [];

  for (const id of merged) {
    if (seen.has(id)) continue;
    const item = SMART_NAV_CATALOG[id];
    if (!canAccessItem(item, user)) continue;
    seen.add(id);
    result.push({
      ...item,
      reason: contextualIds.includes(id) ? 'Bước tiếp theo' : 'Gần đây',
    });
    if (result.length >= limit) break;
  }

  return result;
}

