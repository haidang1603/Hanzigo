/**
 * =========================================================================
 * HANZI GO — COMMUNITY & LEADERBOARD SAFETY, TIMEZONE & HALL OF FAME ENGINE
 * =========================================================================
 * - Zero PII: Che email / PII nhạy cảm khỏi bảng xếp hạng và bài viết công khai
 * - Zero XSS: Chỉ render văn bản thuần, chặn script / javascript: URI
 * - Chuẩn múi giờ Asia/Ho_Chi_Minh (UTC+7) cho Bảng vàng Tuần / Tháng
 * - Hall of Fame chỉ tính Exam Mode ('simulation' / 'exam_mode')
 */

const EMAIL_LIKE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_SCRIPT_REGEX = /<\s*\/?\s*script\b|javascript\s*:/i;

export const POST_LIMITS = Object.freeze({
  TITLE_MAX: 120,
  CONTENT_MAX: 2000,
  SNIPPET_MAX: 400,
  COMMENT_MAX: 600,
});

export function sanitizePublicDisplayName(rawName, fallback = 'Học viên HanziGo') {
  if (rawName === null || rawName === undefined) return fallback;
  const cleaned = String(rawName).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;

  if (EMAIL_LIKE_REGEX.test(cleaned)) {
    const local = cleaned.split('@')[0] || '';
    const prefix = local.slice(0, Math.min(3, Math.max(1, local.length - 1))) || local.charAt(0) || 'u';
    return `${prefix}***`;
  }

  return cleaned.slice(0, 60);
}

export function isSafeMediaUrl(url) {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (/^(javascript|vbscript):/i.test(trimmed)) return false;
  if (/^data:/i.test(trimmed)) {
    return /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(trimmed);
  }
  return trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed);
}

export function validateCommunityPostInput({
  title = '',
  content = '',
  chineseSnippet = '',
  pinyinSnippet = '',
  imageUrl = '',
} = {}) {
  const cleanTitle = String(title || '').replace(/\s+/g, ' ').trim();
  const cleanContent = String(content || '').trim();
  const cleanZh = String(chineseSnippet || '').trim();
  const cleanPy = String(pinyinSnippet || '').trim();
  const cleanImage = typeof imageUrl === 'string' ? imageUrl.trim() : '';

  if (!cleanContent) {
    return { valid: false, error: 'Nội dung bài viết không được để trống.' };
  }
  if (cleanTitle.length > POST_LIMITS.TITLE_MAX) {
    return { valid: false, error: `Tiêu đề tối đa ${POST_LIMITS.TITLE_MAX} ký tự.` };
  }
  if (cleanContent.length > POST_LIMITS.CONTENT_MAX) {
    return { valid: false, error: `Nội dung bài viết tối đa ${POST_LIMITS.CONTENT_MAX} ký tự.` };
  }
  if (cleanZh.length > POST_LIMITS.SNIPPET_MAX || cleanPy.length > POST_LIMITS.SNIPPET_MAX) {
    return { valid: false, error: `Câu tiếng Trung / Pinyin tối đa ${POST_LIMITS.SNIPPET_MAX} ký tự.` };
  }
  if (
    UNSAFE_SCRIPT_REGEX.test(cleanTitle) ||
    UNSAFE_SCRIPT_REGEX.test(cleanContent) ||
    UNSAFE_SCRIPT_REGEX.test(cleanZh) ||
    UNSAFE_SCRIPT_REGEX.test(cleanPy)
  ) {
    return { valid: false, error: 'Nội dung chứa mã không an toàn và đã bị chặn.' };
  }
  if (!isSafeMediaUrl(cleanImage)) {
    return { valid: false, error: 'Đường dẫn ảnh đính kèm không hợp lệ.' };
  }

  return {
    valid: true,
    error: null,
    sanitized: {
      title: cleanTitle,
      content: cleanContent,
      chineseSnippet: cleanZh,
      pinyinSnippet: cleanPy,
      imageUrl: cleanImage || null,
    },
  };
}

export function validateCommunityCommentInput(content = '') {
  const clean = String(content || '').trim();
  if (!clean) {
    return { valid: false, error: 'Bình luận không được để trống.' };
  }
  if (clean.length > POST_LIMITS.COMMENT_MAX) {
    return { valid: false, error: `Bình luận tối đa ${POST_LIMITS.COMMENT_MAX} ký tự.` };
  }
  if (UNSAFE_SCRIPT_REGEX.test(clean)) {
    return { valid: false, error: 'Nội dung bình luận chứa mã không an toàn.' };
  }
  return { valid: true, error: null, sanitizedContent: clean };
}

export function formatStructuredPostContent({
  title = '',
  hskLevel = '',
  chineseSnippet = '',
  pinyinSnippet = '',
  content = '',
} = {}) {
  const lines = [];
  if (title && title.trim()) {
    lines.push(`【${title.trim()}】`);
  }
  if (hskLevel && hskLevel !== 'all') {
    lines.push(`[Cấp độ: ${hskLevel}]`);
  }
  if (chineseSnippet && chineseSnippet.trim()) {
    lines.push(`中文: ${chineseSnippet.trim()}`);
  }
  if (pinyinSnippet && pinyinSnippet.trim()) {
    lines.push(`Pinyin: ${pinyinSnippet.trim()}`);
  }
  if (lines.length > 0) lines.push('');
  lines.push(String(content || '').trim());
  return lines.join('\n').trim();
}

export function parseStructuredPostContent(rawContent = '') {
  const text = String(rawContent || '');
  const lines = text.split(/\r?\n/);
  let idx = 0;
  let title = '';
  let hskLevel = '';
  let chineseSnippet = '';
  let pinyinSnippet = '';

  while (idx < lines.length && idx < 5) {
    const line = lines[idx].trim();
    if (!title && line.startsWith('【') && line.endsWith('】')) {
      title = line.slice(1, -1).trim();
      idx += 1;
      continue;
    }
    if (!hskLevel && /^\[Cấp độ:\s*(.+?)\]$/.test(line)) {
      hskLevel = line.match(/^\[Cấp độ:\s*(.+?)\]$/)?.[1]?.trim() || '';
      idx += 1;
      continue;
    }
    if (!chineseSnippet && /^中文:\s*(.+)$/.test(line)) {
      chineseSnippet = line.replace(/^中文:\s*/, '').trim();
      idx += 1;
      continue;
    }
    if (!pinyinSnippet && /^Pinyin:\s*(.+)$/i.test(line)) {
      pinyinSnippet = line.replace(/^Pinyin:\s*/i, '').trim();
      idx += 1;
      continue;
    }
    if (line === '' && (title || hskLevel || chineseSnippet || pinyinSnippet)) {
      idx += 1;
      break;
    }
    break;
  }

  return {
    title,
    hskLevel,
    chineseSnippet,
    pinyinSnippet,
    body: lines.slice(idx).join('\n').trim() || text,
  };
}

const _cooldownStore = new Map();

export function checkActionCooldown(actionKey, cooldownMs = 5000, nowMs = Date.now()) {
  const prev = _cooldownStore.get(actionKey) || 0;
  const elapsed = nowMs - prev;
  if (prev > 0 && elapsed < cooldownMs) {
    const waitSec = Math.max(1, Math.ceil((cooldownMs - elapsed) / 1000));
    return { allowed: false, waitSeconds: waitSec };
  }
  _cooldownStore.set(actionKey, nowMs);
  return { allowed: true, waitSeconds: 0 };
}

export function resetActionCooldowns() {
  _cooldownStore.clear();
}

export function toggleLikeOptimisticList(posts = [], postId) {
  const idStr = String(postId);
  return (posts || []).map((p) => {
    if (String(p.id) !== idStr) return p;
    const isLiked = !p.liked;
    return {
      ...p,
      liked: isLiked,
      likes: isLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
    };
  });
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

export function getVietnamLeaderboardWindow(now = new Date()) {
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const shifted = new Date(now.getTime() + vnOffsetMs);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const dowSun0 = shifted.getUTCDay(); // 0=Sun, 1=Mon...
  const daysSinceMonday = (dowSun0 + 6) % 7;

  const weekStartShifted = new Date(Date.UTC(year, month - 1, day - daysSinceMonday, 0, 0, 0, 0));
  const nextWeekShifted = new Date(weekStartShifted.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthStartShifted = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));

  const formatVnIso = (d) =>
    `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}T00:00:00+07:00`;

  const remainingMs = Math.max(0, nextWeekShifted.getTime() - shifted.getTime());
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((remainingMs / (60 * 1000)) % 60);

  return {
    timezone: 'Asia/Ho_Chi_Minh',
    vnDateKey: `${year}-${pad2(month)}-${pad2(day)}`,
    weekStartIso: formatVnIso(weekStartShifted),
    weekStartUtcMs: weekStartShifted.getTime() - vnOffsetMs,
    nextWeekStartIso: formatVnIso(nextWeekShifted),
    monthStartIso: formatVnIso(monthStartShifted),
    monthStartUtcMs: monthStartShifted.getTime() - vnOffsetMs,
    countdownToNextWeek: { days, hours, minutes },
  };
}

export function normalizeHskLevelFilter(rawLevel = 'all') {
  const s = String(rawLevel || 'all').replace(/–/g, '-').trim().toUpperCase();
  if (s === 'ALL' || !s) return 'all';
  if (s.includes('7') || s.includes('8') || s.includes('9')) return 'HSK 7-9';
  const m = s.match(/([1-6])/);
  return m ? `HSK ${m[1]}` : s;
}

export function filterAndRankHallOfFame(
  attempts = [],
  { examSystem = 'all', level = 'all', currentUserId = null, limit = 50 } = {}
) {
  const normLevelFilter = normalizeHskLevelFilter(level);
  const bestByUserLevel = new Map();

  for (const a of Array.isArray(attempts) ? attempts : []) {
    if (!a || typeof a !== 'object') continue;
    const mode = String(a.examMode || a.exam_mode || '').toLowerCase();
    // Tuyệt đối chỉ lấy lượt thi thử Exam Mode đã xác thực, loại bỏ learning_mode / practice
    if (mode !== 'simulation' && mode !== 'exam_mode' && mode !== 'exam') continue;

    const uid = a.userId || a.user_id;
    if (!uid) continue;

    const rowSys = String(a.examSystem || a.exam_system || (String(a.examId || a.exam_id || '').includes('hsk30') || String(a.examLevel || a.exam_level || '').includes('7') ? 'hsk_3_0' : 'hsk_2_0')).toLowerCase();
    if (examSystem !== 'all' && rowSys !== examSystem) continue;

    const rowLvl = normalizeHskLevelFilter(a.examLevel || a.exam_level || a.level || 'HSK 1');
    if (normLevelFilter !== 'all' && rowLvl !== normLevelFilter) continue;

    if (a.isOptedOut || a.is_leaderboard_hidden) {
      if (!currentUserId || String(uid) !== String(currentUserId)) continue;
    }

    const score = Number(a.score ?? 0);
    const maxScore = Math.max(1, Number(a.maxScore ?? a.max_score ?? 200));
    const pct = Number(a.accuracyPercentage ?? a.accuracy_percentage ?? Math.round((score / maxScore) * 100));
    const key = `${uid}::${rowSys}::${rowLvl}`;
    const prev = bestByUserLevel.get(key);

    if (!prev || score > prev.score || (score === prev.score && pct > prev.accuracyPercentage)) {
      bestByUserLevel.set(key, {
        id: String(a.id || key),
        userId: String(uid),
        name: sanitizePublicDisplayName(a.displayName || a.display_name || a.userName || a.name || 'Học viên HanziGo'),
        avatar: a.avatar || null,
        examId: a.examId || a.exam_id || '',
        examTitle: a.examTitle || a.exam_title || `Đề thi ${rowLvl}`,
        examSystem: rowSys,
        examLevel: rowLvl,
        score,
        maxScore,
        accuracyPercentage: pct,
        passed: Boolean(a.passed ?? score >= Math.round(maxScore * 0.6)),
        createdAt: a.createdAt || a.created_at || new Date().toISOString(),
        isCurrentUser: Boolean(currentUserId && String(uid) === String(currentUserId)),
        isOptedOut: Boolean(a.isOptedOut || a.is_leaderboard_hidden),
      });
    }
  }

  const sorted = Array.from(bestByUserLevel.values()).sort((a, b) => {
    const ratioDiff = b.score / b.maxScore - a.score / a.maxScore;
    if (Math.abs(ratioDiff) > 0.0001) return ratioDiff;
    if (b.score !== a.score) return b.score - a.score;
    return b.accuracyPercentage - a.accuracyPercentage;
  });

  let currentUserRank = -1;
  let currentUserEntry = null;
  const publicEntries = [];

  sorted.forEach((item, idx) => {
    const rank = idx + 1;
    const ranked = { ...item, rank };
    if (ranked.isCurrentUser && currentUserRank === -1) {
      currentUserRank = rank;
      currentUserEntry = ranked;
    }
    if (!ranked.isOptedOut || ranked.isCurrentUser) {
      publicEntries.push(ranked);
    }
  });

  return {
    entries: publicEntries.slice(0, limit),
    totalEntries: publicEntries.length,
    currentUserRank,
    currentUserEntry,
  };
}

export const XP_HONORIFIC_TITLES = [
  { minXp: 1500, title: '👑 Đại Tông Sư HSK', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' },
  { minXp: 1000, title: '🐉 Cao Thủ Phản Xạ', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700' },
  { minXp: 600,  title: '🔥 Bậc Thầy Hán Tự', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700' },
  { minXp: 300,  title: '🌿 Học Giả Siêng Năng', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700' },
  { minXp: 100,  title: '🌱 Tân Binh Nỗ Lực', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700' },
  { minXp: 0,    title: '🐣 Người Mới Bắt Đầu', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700' },
];

export function getXpHonorificTitle(xp = 0) {
  const matched = XP_HONORIFIC_TITLES.find((t) => xp >= t.minXp);
  return matched || XP_HONORIFIC_TITLES[XP_HONORIFIC_TITLES.length - 1];
}
