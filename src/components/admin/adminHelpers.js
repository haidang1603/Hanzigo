export function checkIsAdmin(user) {
  if (!user) return false;
  const normalizedRole = String(user.role || '').trim().toLowerCase();
  return (normalizedRole === 'admin' || user.isAdmin === true) && user.status !== 'blocked';
}

export function canModifyTargetUser(currentAdmin, targetUser) {
  if (!currentAdmin || !targetUser) {
    return { allowed: true, reason: '' };
  }
  const adminIds = new Set(
    [currentAdmin.id, currentAdmin.uid]
      .filter(Boolean)
      .map((v) => String(v).trim().toLowerCase())
  );
  const targetIds = [targetUser.id, targetUser.uid]
    .filter(Boolean)
    .map((v) => String(v).trim().toLowerCase());
  const sameId = targetIds.some((id) => adminIds.has(id));
  const adminEmail = String(currentAdmin.email || '').trim().toLowerCase();
  const targetEmail = String(targetUser.email || '').trim().toLowerCase();
  const sameEmail = Boolean(adminEmail && targetEmail && adminEmail === targetEmail);

  if (sameId || sameEmail) {
    return {
      allowed: false,
      reason: 'Quản trị viên không thể tự thay đổi quyền hoặc khóa tài khoản của chính mình.',
    };
  }
  return { allowed: true, reason: '' };
}

export function formatVietnamDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const dt = new Date(isoString);
    if (Number.isNaN(dt.getTime())) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dt);
  } catch {
    return '—';
  }
}

export function formatVietnamShortDate(isoOrDate) {
  try {
    const dt = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
    if (Number.isNaN(dt.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
    }).format(dt);
  } catch {
    return '';
  }
}

export function redactPiiText(raw = '') {
  return String(raw || '')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email-đã-che]')
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [đã-che]')
    .replace(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.?[A-Za-z0-9_-]*/g, '[token-đã-che]')
    .replace(/\b(?:\+?84|0)(?:3|5|7|8|9)\d{8}\b/g, '[sđt-đã-che]');
}

export function groupClientErrorLogs(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) return [];
  const grouped = new Map();
  logs.forEach((log) => {
    const route = String(log.route || '/');
    const errorName = String(log.error_name || 'Error');
    const fp = String(log.fingerprint || `${errorName}|${route}`);
    const existing = grouped.get(fp);
    const ts = log.created_at || '';
    if (!existing) {
      grouped.set(fp, {
        fingerprint: fp,
        count: 1,
        lastSeenAt: ts,
        route,
        errorName,
        message: redactPiiText(log.error_message || ''),
        stackShort: redactPiiText(log.component_stack_short || ''),
        appVersion: log.app_version || '',
      });
    } else {
      existing.count += 1;
      if (ts && (!existing.lastSeenAt || new Date(ts) > new Date(existing.lastSeenAt))) {
        existing.lastSeenAt = ts;
      }
    }
  });
  return Array.from(grouped.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.lastSeenAt || 0) - new Date(a.lastSeenAt || 0);
  });
}

export function buildVietnam7DayTrendSeries(records = [], now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dayKeys = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const dt = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
    dayKeys.push(formatter.format(dt));
  }
  const counts = new Map(dayKeys.map((dk) => [dk, 0]));
  if (Array.isArray(records)) {
    records.forEach((rec) => {
      const iso = typeof rec === 'string' ? rec : rec?.created_at || rec?.createdAt;
      if (!iso) return;
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return;
      const key = formatter.format(d);
      if (counts.has(key)) counts.set(key, counts.get(key) + 1);
    });
  }
  return dayKeys.map((dk) => {
    const [, mm, dd] = dk.split('-');
    return {
      date: dk,
      label: `${dd}/${mm}`,
      count: counts.get(dk) || 0,
    };
  });
}

export function createEmptyDashboardSummary() {
  return {
    kpis: {
      totalUsers: 0,
      activeLearners7d: 0,
      totalHskAttempts: 0,
      hsk20Attempts: 0,
      hsk30Attempts: 0,
      communityPostsCount: 0,
      openReportsCount: 0,
      clientErrors24h: 0,
    },
    trends7d: buildVietnam7DayTrendSeries([]),
    hskDistribution: [],
    contentHealth: {
      hsk20QuestionsCount: 0,
      hsk30QuestionsCount: 0,
      hsk15ImageCoveragePercent: 0,
      hsk15ImageCount: 0,
      hsk15TotalCount: 0,
      materialsCount: 0,
    },
    urgentItems: [],
    serviceHealth: [],
    clientErrorLogs: [],
    generatedAt: null,
  };
}

export function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export function mapCloudProfileToUser(cp) {
  return {
    id: cp.id,
    name: cp.name || cp.full_name || 'Học viên',
    email: cp.email || '',
    role: cp.role || 'student',
    level: cp.level || 'HSK 1 - Sơ cấp',
    xp: typeof cp.xp === 'number' ? cp.xp : 0,
    streak: typeof cp.streak === 'number' ? cp.streak : 0,
    wordsLearned: cp.words_learned || 0,
    status: cp.status || 'active',
    avatar: cp.avatar || cp.avatar_url || null,
    joinedDate: cp.created_at ? cp.created_at.split('T')[0] : '2026-01-01',
    lastActive: 'Gần đây',
  };
}

export function filterAndSortUsers(
  usersList,
  { userSearch, userRoleFilter, userStatusFilter, userSortBy }
) {
  return usersList
    .filter((u) => {
      const matchSearch =
        !userSearch.trim() ||
        (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.level && u.level.toLowerCase().includes(userSearch.toLowerCase()));
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    })
    .sort((a, b) => {
      if (userSortBy === 'xp') return (b.xp || 0) - (a.xp || 0);
      if (userSortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
      if (userSortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return (b.joinedDate || '').localeCompare(a.joinedDate || '');
    });
}

export function filterAndSortAdminMaterials(
  materials,
  { matSearch, matCategoryFilter, matLevelFilter }
) {
  return materials
    .filter((m) => {
      const matchSearch =
        !matSearch.trim() ||
        m.title.toLowerCase().includes(matSearch.toLowerCase()) ||
        (m.author && m.author.toLowerCase().includes(matSearch.toLowerCase())) ||
        (Array.isArray(m.tags) &&
          m.tags.some((t) => t.toLowerCase().includes(matSearch.toLowerCase())));
      const matchCat =
        matCategoryFilter === 'Tất cả' || m.category === matCategoryFilter;
      const lvl = (m.level || '').toUpperCase();
      const filterLvl = matLevelFilter.toUpperCase();
      const matchLevel =
        matLevelFilter === 'Tất cả' ||
        lvl === filterLvl ||
        lvl.includes(filterLvl) ||
        (lvl.includes('4-6') && ['HSK 4', 'HSK 5', 'HSK 6'].includes(filterLvl)) ||
        lvl.includes('1-6');
      return matchSearch && matchCat && matchLevel;
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
}

export function filterCustomVocab(customVocab, { vocabSearch, vocabHskFilter }) {
  return customVocab.filter((v) => {
    const matchSearch =
      !vocabSearch.trim() ||
      v.hanzi.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      v.pinyin.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      v.meaning.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      (v.hanviet && v.hanviet.toLowerCase().includes(vocabSearch.toLowerCase()));
    const matchHsk = vocabHskFilter === 'all' || v.hsk === vocabHskFilter;
    return matchSearch && matchHsk;
  });
}

export function filterCustomLessons(customLessons, { lessonSearch, lessonLevelFilter }) {
  return customLessons.filter((l) => {
    const matchSearch =
      !lessonSearch.trim() ||
      (l.title && l.title.toLowerCase().includes(lessonSearch.toLowerCase())) ||
      (l.description &&
        l.description.toLowerCase().includes(lessonSearch.toLowerCase()));
    const matchLevel =
      lessonLevelFilter === 'all' ||
      (l.level &&
        l.level.toLowerCase().replace(/\s+/g, '') ===
          lessonLevelFilter.toLowerCase().replace(/\s+/g, ''));
    return matchSearch && matchLevel;
  });
}

export function computeUserStats(usersList) {
  const total = usersList.length;
  const admins = usersList.filter((u) => u.role === 'admin').length;
  const teachers = usersList.filter((u) => u.role === 'teacher').length;
  const active = usersList.filter((u) => u.status === 'active').length;
  const blocked = usersList.filter((u) => u.status === 'blocked').length;
  const totalXp = usersList.reduce((acc, cur) => acc + (cur.xp || 0), 0);
  return { total, admins, teachers, active, blocked, totalXp };
}

export function exportAdminBackupJson({ materials, usersList, customVocab, customLessons }) {
  const backupData = {
    version: '3.0',
    timestamp: new Date().toISOString(),
    materials,
    users: usersList,
    customVocab,
    customLessons,
  };
  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `HanziGo_Backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}
