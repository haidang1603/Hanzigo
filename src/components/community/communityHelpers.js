import {
  POST_LIMITS,
  sanitizePublicDisplayName,
  formatStructuredPostContent,
  parseStructuredPostContent,
  validateCommunityPostInput,
  validateCommunityCommentInput,
  toggleLikeOptimisticList,
} from '../../utils/communitySafety.js';
import { FAKE_AUTHORS, FAKE_PARTNERS } from './communityConstants.js';

export {
  POST_LIMITS,
  sanitizePublicDisplayName,
  formatStructuredPostContent,
  parseStructuredPostContent,
  validateCommunityPostInput,
  validateCommunityCommentInput,
  toggleLikeOptimisticList,
};

// Helper nén ảnh cục bộ cho mã QR và tệp đính kèm (giữ độ sắc nét cho QR)
export function compressImageFile(file, maxWidth = 600, maxHeight = 600) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isFakePost(p) {
  if (!p) return true;
  const author = (p.author_name || p.author || '').trim();
  return FAKE_AUTHORS.some((fake) => author.includes(fake));
}

export function sanitizeCommunityPosts(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((p) => !isFakePost(p))
    .map((p) => {
      const rawAuthor = p.author_name || p.author;
      const authorName = rawAuthor ? sanitizePublicDisplayName(rawAuthor, '') : '';
      const isBqt =
        authorName.includes('Ban Quản Trị') ||
        p.author_level === 'Quản trị viên' ||
        p.level === 'Quản trị viên' ||
        p.level === 'BQT' ||
        p.id === 'system-welcome';
      const isLegacyUnsplash =
        (p.author_avatar && p.author_avatar.includes('photo-1534528741775-53994a69daeb')) ||
        (p.avatar && p.avatar.includes('photo-1534528741775-53994a69daeb'));
      if (isBqt || isLegacyUnsplash) {
        return {
          ...p,
          avatar: '/hanzigo-logo.svg',
          author_avatar: '/hanzigo-logo.svg',
          level: p.level || p.author_level || 'Quản trị viên',
        };
      }
      return p;
    });
}

export function isFakePartner(p) {
  if (!p) return true;
  const name = (p.name || '').trim();
  return FAKE_PARTNERS.some((fake) => name.includes(fake));
}

export function getRankTier(xp) {
  if (xp >= 600) {
    return {
      name: 'Bậc Thầy Vàng',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      next: 'Tối đa',
      progress: 100,
    };
  }
  if (xp >= 300) {
    return {
      name: 'Học Giả Bạc',
      color: 'text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-900',
      next: '600 XP',
      progress: Math.round(((xp - 300) / 300) * 100),
    };
  }
  if (xp >= 100) {
    return {
      name: 'Chiến Binh Đồng',
      color: 'text-amber-700',
      bg: 'bg-amber-100/50 dark:bg-amber-950/30',
      next: '300 XP',
      progress: Math.round(((xp - 100) / 200) * 100),
    };
  }
  return {
    name: 'Tân Binh Hanzi',
    color: 'text-[#45B97C]',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    next: '100 XP',
    progress: Math.round((xp / 100) * 100),
  };
}

export function filterAndSortPosts(posts, { searchTerm, selectedTag, selectedHskGroup, postSort }) {
  const q = (searchTerm || '').toLowerCase().trim();
  const list = (posts || []).filter((post) => {
    const matchesSearch =
      !q ||
      (post.content || '').toLowerCase().includes(q) ||
      (post.author || '').toLowerCase().includes(q) ||
      (post.tag || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (selectedTag === 'saved' && !post.saved) return false;
    if (selectedTag !== 'all' && selectedTag !== 'saved' && post.tag !== selectedTag) return false;

    if (selectedHskGroup !== 'all') {
      const parsed = parseStructuredPostContent(post.content);
      const rawLvl = `${parsed.hskLevel || ''} ${post.level || ''}`.toUpperCase();
      if (selectedHskGroup === 'HSK 1–3' && !/HSK\s*[123]\b/.test(rawLvl)) return false;
      if (selectedHskGroup === 'HSK 4–6' && !/HSK\s*[456]\b/.test(rawLvl)) return false;
      if (selectedHskGroup === 'HSK 7–9' && !/HSK\s*[789]/.test(rawLvl)) return false;
    }
    return true;
  });

  if (postSort === 'popular') {
    return [...list].sort((a, b) => {
      if (Boolean(a.isPinned) !== Boolean(b.isPinned)) return a.isPinned ? -1 : 1;
      return (b.likes || 0) - (a.likes || 0) || (b.commentsCount || 0) - (a.commentsCount || 0);
    });
  }
  return list;
}

export function filterStudyPartners(
  studyPartners,
  { partnerFilterLevel, partnerFilterMethod, partnerFilterStatus, partnerSearchTerm, user }
) {
  return (studyPartners || []).filter((p) => {
    if (partnerFilterLevel !== 'all') {
      const pLevel = (p.level || p.targetLevel || '').toLowerCase();
      if (!pLevel.startsWith(partnerFilterLevel.toLowerCase())) {
        return false;
      }
    }

    if (partnerFilterMethod !== 'all') {
      const pMethod = (p.contactMethod || '').toLowerCase();
      if (pMethod !== partnerFilterMethod.toLowerCase()) {
        return false;
      }
    }

    if (partnerFilterStatus === 'active') {
      const isOwner = Boolean(
        (user?.id && p.userId && String(user.id) === String(p.userId)) || p.isMyPartnerPost
      );
      if (p.isActive === false && !isOwner) {
        return false;
      }
    }

    if (partnerSearchTerm.trim()) {
      const q = partnerSearchTerm.trim().toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchGoal = (p.goal || p.intro || '').toLowerCase().includes(q);
      const matchSkills = (p.skills || '').toLowerCase().includes(q);
      const matchTime = (p.dailyTime || '').toLowerCase().includes(q);
      const matchMethod = (p.contactMethod || '').toLowerCase().includes(q);
      if (!matchName && !matchGoal && !matchSkills && !matchTime && !matchMethod) {
        return false;
      }
    }

    return true;
  });
}

export function resolveContactAction(contactMethod, contactInfo) {
  if (!contactInfo) return { type: 'none', target: '' };
  const trimmed = contactInfo.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { type: 'url', target: trimmed };
  }
  if (contactMethod === 'Telegram' && trimmed.startsWith('@')) {
    return { type: 'url', target: `https://t.me/${trimmed.slice(1)}` };
  }
  if (contactMethod === 'Zalo' && /^[0-9+]+$/.test(trimmed)) {
    return { type: 'url', target: `https://zalo.me/${trimmed}` };
  }
  if (/^[0-9+]{9,15}$/.test(trimmed)) {
    return { type: 'tel', target: `tel:${trimmed}` };
  }
  return { type: 'copy', target: trimmed };
}
