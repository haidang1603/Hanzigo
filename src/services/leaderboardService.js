import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { calculateTotalXp, getStreakStatus } from '../utils/gamification.js';
import { isValidUuid } from './authService.js';

// Honorific titles earned by reaching total XP thresholds
export const XP_HONORIFIC_TITLES = [
  { minXp: 1500, title: '👑 Đại Tông Sư HSK', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' },
  { minXp: 1000, title: '🐉 Cao Thủ Phản Xạ', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700' },
  { minXp: 600,  title: '🔥 Bậc Thầy Hán Tự', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700' },
  { minXp: 300,  title: '🌿 Học Giả Siêng Năng', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700' },
  { minXp: 100,  title: '🌱 Tân Binh Nỗ Lực', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700' },
  { minXp: 0,    title: '🐣 Người Mới Bắt Đầu', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700' },
];

export function getXpHonorificTitle(xp = 0) {
  const matched = XP_HONORIFIC_TITLES.find(t => xp >= t.minXp);
  return matched || XP_HONORIFIC_TITLES[XP_HONORIFIC_TITLES.length - 1];
}

/**
 * Che giấu email nhạy cảm nhằm bảo vệ quyền riêng tư học viên
 * Ví dụ: hoang.tran@hanzigo.com -> h***n@hanzigo.com
 */
export function maskSensitiveEmail(email = '') {
  if (!email || typeof email !== 'string') return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return '***';
  const name = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (name.length <= 2) {
    return `${name.charAt(0)}***@${domain}`;
  }
  return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
}

/**
 * Kiểm tra xem người dùng có kích hoạt chế độ ẩn danh (opt-out) trên Leaderboard hay không
 */
export function isUserLeaderboardOptedOut(u) {
  if (!u) return false;
  if (u.is_leaderboard_hidden || u.leaderboard_opt_out) return true;
  const uid = u.uid || u.id || (u.email ? u.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest');
  try {
    const pref = localStorage.getItem(`hanzigo_leaderboard_opt_out_${uid}`);
    if (pref === 'true') return true;
  } catch {}
  return false;
}

/**
 * Cập nhật tùy chọn ẩn danh / hiển thị trên Leaderboard
 */
export function setLeaderboardPrivacyOptOut(user, isOptedOut) {
  if (!user) return false;
  const uid = user.uid || user.id || (user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest');
  try {
    localStorage.setItem(`hanzigo_leaderboard_opt_out_${uid}`, isOptedOut ? 'true' : 'false');
  } catch {}
  return true;
}

/**
 * Filter out mock/demo accounts
 */
function isDemoLeaderboardUser(u) {
  if (!u) return true;
  const id = String(u.id || u.uid || '');
  const email = String(u.email || '').toLowerCase().trim();
  const demoIds = ['user-admin-1', 'user-mod-1', 'user-stu-1', 'user-stu-2', 'user-stu-3', 'user-stu-4'];
  const demoEmails = [
    'hoang.tran@hanzigo.com',
    'mai.nguyen@gmail.com',
    'dat.le@outlook.com',
    'quynhanh.pham@yahoo.com',
    'thinh.vu.learner@gmail.com'
  ];
  return demoIds.includes(id) || 
         demoEmails.includes(email) || 
         id.startsWith('user-admin-') || 
         id.startsWith('user-mod-') || 
         id.startsWith('user-stu-');
}

/**
 * Fetch and construct the comprehensive XP Leaderboard
 * Options:
 * - timeframe: 'all' | 'weekly' | 'monthly'
 * - scope: 'global' | 'class'
 * - classroomId: ID lớp học nếu scope === 'class'
 */
export async function getXpLeaderboard(currentUser = null, options = {}) {
  const { 
    timeframe = 'all', 
    scope = 'global', 
    classroomId = null 
  } = options;

  const usersMap = new Map();

  // 1. Fetch live profiles from Supabase if connected (authoritative source of truth)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbProfiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, level, xp, streak, words_learned, role, status, is_leaderboard_hidden, created_at')
        .neq('status', 'blocked')
        .order('xp', { ascending: false, nullsFirst: false })
        .limit(100);

      if (!error && Array.isArray(dbProfiles)) {
        dbProfiles.filter(p => !isDemoLeaderboardUser(p)).forEach(p => {
          const normEmail = p.email ? p.email.toLowerCase().trim() : '';
          const key = normEmail || p.id;
          usersMap.set(key, {
            id: p.id,
            name: p.name || 'Học viên',
            email: p.email || '',
            avatar: p.avatar || null,
            level: p.level || 'HSK 1 - Sơ cấp',
            xp: typeof p.xp === 'number' && !isNaN(p.xp) ? p.xp : (Number(p.xp) || 50),
            streak: typeof p.streak === 'number' && !isNaN(p.streak) ? p.streak : (Number(p.streak) || 1),
            wordsLearned: p.words_learned || 0,
            role: p.role || 'student',
            status: p.status || 'active',
            isOptedOut: Boolean(p.is_leaderboard_hidden)
          });
          if (p.id) usersMap.set(p.id, usersMap.get(key));
        });
      }
    } catch (err) {
      console.warn('Leaderboard Supabase fetch notice:', err);
    }
  }

  // 2. Merge local registered shared profiles cache & admin directory
  try {
    const rawShared = localStorage.getItem('hanzigo_shared_profiles_cache');
    if (rawShared) {
      const sharedCache = JSON.parse(rawShared);
      Object.values(sharedCache).forEach(u => {
        if (!isDemoLeaderboardUser(u) && u.status !== 'blocked') {
          const normEmail = u.email ? u.email.toLowerCase().trim() : '';
          const key = normEmail || u.id;
          const existing = usersMap.get(key) || (u.id ? usersMap.get(u.id) : null);
          if (!existing) {
            usersMap.set(key, { ...u, isOptedOut: isUserLeaderboardOptedOut(u) });
          } else {
            if (typeof u.xp === 'number' && u.xp > existing.xp) {
              existing.xp = u.xp;
            }
          }
        }
      });
    }

    const rawLocal = localStorage.getItem('hanzigo_admin_users_directory');
    if (rawLocal) {
      const localUsers = JSON.parse(rawLocal);
      if (Array.isArray(localUsers)) {
        localUsers.filter(u => !isDemoLeaderboardUser(u) && u.status !== 'blocked').forEach(u => {
          const normEmail = u.email ? u.email.toLowerCase().trim() : '';
          const key = normEmail || u.id;
          const existing = usersMap.get(key) || (u.id ? usersMap.get(u.id) : null);
          const isOptedOut = isUserLeaderboardOptedOut(u);

          if (!existing) {
            usersMap.set(key, {
              id: u.id || key,
              name: u.name || 'Học viên',
              email: u.email || '',
              avatar: u.avatar || null,
              level: u.level || 'HSK 1 - Sơ cấp',
              xp: typeof u.xp === 'number' ? u.xp : 50,
              streak: typeof u.streak === 'number' ? u.streak : 1,
              wordsLearned: u.wordsLearned || 0,
              role: u.role || 'student',
              status: u.status || 'active',
              isOptedOut
            });
          } else {
            if (typeof u.xp === 'number' && u.xp > existing.xp) {
              existing.xp = u.xp;
            }
          }
        });
      }
    }
  } catch {}

  // 3. Merge currently logged-in user with authentic live calculated XP
  if (currentUser) {
    const liveXp = calculateTotalXp(currentUser);
    const normEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';
    const userKey = normEmail || currentUser.uid || currentUser.id;
    const existing = usersMap.get(userKey) || (currentUser.id ? usersMap.get(currentUser.id) : null);
    const isOptedOut = isUserLeaderboardOptedOut(currentUser);

    // CRITICAL: authoritative XP must be the highest between live calculation, cloud DB, and user object
    const authoritativeXp = Math.max(
      liveXp,
      typeof existing?.xp === 'number' ? existing.xp : 0,
      typeof currentUser?.xp === 'number' ? currentUser.xp : 0
    );

    const liveStreak = getStreakStatus(currentUser).streak;
    const authoritativeStreak = Math.max(
      liveStreak,
      currentUser.streak || 0,
      existing?.streak || 1
    );

    const mergedUser = {
      id: currentUser.uid || currentUser.id || existing?.id || 'current_user',
      name: currentUser.name || currentUser.displayName || existing?.name || 'Bạn',
      email: currentUser.email || existing?.email || '',
      avatar: currentUser.avatar || currentUser.photoURL || existing?.avatar || null,
      level: currentUser.level || existing?.level || 'HSK 1 - Sơ cấp',
      xp: authoritativeXp,
      streak: authoritativeStreak,
      wordsLearned: Math.max(currentUser.wordsLearned || 0, existing?.wordsLearned || 0),
      role: currentUser.role || existing?.role || 'student',
      status: 'active',
      isCurrentUser: true,
      isOptedOut
    };

    usersMap.set(userKey, mergedUser);
    if (mergedUser.id) usersMap.set(mergedUser.id, mergedUser);

    // CRITICAL: Immediately persist authoritative XP to Supabase profiles
    // so ALL OTHER ACCOUNTS see this user's exact up-to-date XP on their leaderboard!
    if (isSupabaseConfigured && supabase && mergedUser.id && isValidUuid(mergedUser.id)) {
      if (!existing || authoritativeXp !== existing.xp || authoritativeStreak !== existing.streak) {
        supabase
          .from('profiles')
          .update({
            xp: authoritativeXp,
            streak: authoritativeStreak,
            level: mergedUser.level,
            avatar: mergedUser.avatar,
            name: mergedUser.name,
            updated_at: new Date().toISOString()
          })
          .eq('id', mergedUser.id)
          .then(() => {})
          .catch((e) => console.warn('Leaderboard Supabase sync notice:', e));
      }
    }

    // Persist to shared roster cache for multi-account testing
    try {
      const rawShared = localStorage.getItem('hanzigo_shared_profiles_cache');
      const roster = rawShared ? JSON.parse(rawShared) : {};
      roster[mergedUser.id || userKey] = {
        id: mergedUser.id,
        name: mergedUser.name,
        email: mergedUser.email,
        avatar: mergedUser.avatar,
        level: mergedUser.level,
        xp: mergedUser.xp,
        streak: mergedUser.streak,
        wordsLearned: mergedUser.wordsLearned,
        role: mergedUser.role,
        status: mergedUser.status
      };
      localStorage.setItem('hanzigo_shared_profiles_cache', JSON.stringify(roster));
    } catch {}
  }

  // 4. Lọc theo lớp học nếu scope === 'class'
  if (scope === 'class' && classroomId) {
    try {
      const rawMembers = localStorage.getItem('hanzigo_class_members_store');
      if (rawMembers) {
        const members = JSON.parse(rawMembers);
        const classMemberIds = new Set(
          members
            .filter(m => m.classroom_id === classroomId && m.status === 'active')
            .map(m => m.student_id || m.student_email || m.email)
            .filter(Boolean)
        );

        for (const [key, userObj] of usersMap.entries()) {
          const isMember = classMemberIds.has(userObj.id) || classMemberIds.has(userObj.email);
          if (!isMember && !userObj.isCurrentUser) {
            usersMap.delete(key);
          }
        }
      }
    } catch {}
  }

  // Deduplicate unique users
  const uniqueUsers = new Map();
  for (const userObj of usersMap.values()) {
    const dedupKey = (userObj.email ? userObj.email.toLowerCase().trim() : '') || userObj.id;
    const prev = uniqueUsers.get(dedupKey);
    if (!prev || (!prev.isCurrentUser && (userObj.isCurrentUser || (userObj.xp || 0) > (prev.xp || 0)))) {
      uniqueUsers.set(dedupKey, userObj);
    }
  }

  // 5. Điều chỉnh điểm XP theo timeframe (Weekly / Monthly)
  let rawList = Array.from(uniqueUsers.values()).map(userObj => {
    let effectiveXp = userObj.xp;

    if (timeframe === 'weekly') {
      const streakWeight = Math.min(7, Math.max(1, userObj.streak || 1)) / 7;
      effectiveXp = Math.max(25, Math.round(userObj.xp * (0.15 + (streakWeight * 0.25))));
    } else if (timeframe === 'monthly') {
      const streakWeight = Math.min(30, Math.max(1, userObj.streak || 1)) / 30;
      effectiveXp = Math.max(50, Math.round(userObj.xp * (0.45 + (streakWeight * 0.35))));
    }

    return {
      ...userObj,
      xp: effectiveXp
    };
  });

  // 6. Sắp xếp giảm dần theo XP và Streak
  rawList.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return (b.streak || 0) - (a.streak || 0);
  });

  // 7. Gán thứ hạng, bảo mật che email và xử lý Opt-Out (Ẩn danh)
  const currentId = currentUser?.uid || currentUser?.id;
  const currentEmail = (currentUser?.email || '').toLowerCase().trim();
  let currentUserRank = -1;
  let currentUserEntry = null;

  const rankedList = rawList.map((item, index) => {
    const rank = index + 1;
    const itemEmail = (item.email || '').toLowerCase().trim();
    const isCurrent = Boolean(
      (currentId && item.id === currentId) ||
      (currentEmail && itemEmail && itemEmail === currentEmail)
    );
    const titleObj = getXpHonorificTitle(item.xp);

    // Quyền riêng tư: Che email nhạy cảm
    const maskedEmail = maskSensitiveEmail(item.email);

    // Xử lý Opt-Out: Nếu ẩn danh, che tên với người khác, chỉ hiện rõ với chính họ
    const displayName = (item.isOptedOut && !isCurrent) 
      ? `Học viên #${String(item.id || rank).slice(-4)}` 
      : item.name;

    const displayAvatar = (item.isOptedOut && !isCurrent) ? null : item.avatar;

    const entry = {
      ...item,
      rank,
      name: displayName,
      avatar: displayAvatar,
      email: item.email,
      maskedEmail,
      isCurrentUser: isCurrent,
      isOptedOut: Boolean(item.isOptedOut),
      honorific: titleObj.title,
      honorificStyle: titleObj.color
    };

    if (isCurrent) {
      currentUserRank = rank;
      currentUserEntry = entry;
    }

    return entry;
  });

  // Tính khoảng cách đến thứ hạng kế tiếp
  let gapToNext = 0;
  let nextRankUser = null;
  if (currentUserRank > 1) {
    nextRankUser = rankedList[currentUserRank - 2];
    if (nextRankUser) {
      gapToNext = Math.max(1, nextRankUser.xp - (currentUserEntry?.xp || 0) + 1);
    }
  }

  return {
    leaderboard: rankedList,
    totalLearners: rankedList.length,
    currentUserRank,
    currentUserEntry,
    gapToNext,
    nextRankUser,
    timeframe,
    scope
  };
}
