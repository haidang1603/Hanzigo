import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { calculateTotalXp, getStreakStatus, getUserStorageKey } from '../utils/gamification.js';
import { isValidUuid } from './authService.js';
import {
  sanitizePublicDisplayName,
  getVietnamLeaderboardWindow,
  filterAndRankHallOfFame,
  XP_HONORIFIC_TITLES,
  getXpHonorificTitle,
} from '../utils/communitySafety.js';

export {
  sanitizePublicDisplayName,
  getVietnamLeaderboardWindow,
  filterAndRankHallOfFame,
  XP_HONORIFIC_TITLES,
  getXpHonorificTitle,
};

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
 * Cập nhật tùy chọn ẩn danh / hiển thị trên Leaderboard (cục bộ + Supabase profiles)
 */
export function setLeaderboardPrivacyOptOut(user, isOptedOut) {
  if (!user) return false;
  const hidden = Boolean(isOptedOut);
  const uid = user.uid || user.id || (user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest');
  try {
    localStorage.setItem(`hanzigo_leaderboard_opt_out_${uid}`, hidden ? 'true' : 'false');
  } catch {}

  const dbId = user.uid || user.id;
  if (isSupabaseConfigured && supabase && dbId && isValidUuid(dbId)) {
    try {
      supabase
        .from('profiles')
        .update({ is_leaderboard_hidden: hidden, updated_at: new Date().toISOString() })
        .eq('id', dbId)
        .then(() => {})
        .catch(() => {});
    } catch {}
  }
  return true;
}

/**
 * Filter out mock/demo accounts
 */
function isDemoLeaderboardUser(u) {
  if (!u) return true;
  const id = String(u.id || u.uid || u.user_id || '');
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
 * Fetch and construct the comprehensive XP Leaderboard (Zero PII, Real Data Only)
 * Options:
 * - timeframe: 'weekly' | 'monthly' | 'all'
 * - scope: 'global' | 'class'
 * - classroomId: ID lớp học nếu scope === 'class'
 */
export async function getXpLeaderboard(currentUser = null, options = {}) {
  const {
    timeframe = 'all',
    scope = 'global',
    classroomId = null,
    limit = 50,
  } = options;

  const usersMap = new Map();
  const vnWindow = getVietnamLeaderboardWindow();

  // 1. Fetch live leaderboard from authoritative Supabase RPC first, fallback to non-PII profiles select
  if (isSupabaseConfigured && supabase) {
    let loadedViaRpc = false;
    try {
      const { data: rpcRows, error: rpcErr } = await supabase.rpc('get_public_leaderboard', {
        p_timeframe: timeframe,
        p_limit: Math.min(100, Math.max(20, limit)),
      });
      if (!rpcErr && Array.isArray(rpcRows)) {
        loadedViaRpc = true;
        rpcRows.filter((p) => !isDemoLeaderboardUser(p)).forEach((p) => {
          const id = String(p.user_id || p.id);
          usersMap.set(id, {
            id,
            name: sanitizePublicDisplayName(p.display_name || p.name),
            avatar: p.avatar || null,
            level: p.hsk_level || p.level || 'HSK 1 - Sơ cấp',
            xp: typeof p.xp === 'number' && !isNaN(p.xp) ? p.xp : (Number(p.xp) || 0),
            streak: typeof p.streak === 'number' && !isNaN(p.streak) ? p.streak : (Number(p.streak) || 0),
            role: 'student',
            status: 'active',
            isOptedOut: false,
            fromServerRpc: true,
          });
        });
      }
    } catch {}

    if (!loadedViaRpc) {
      try {
        // TUYỆT ĐỐI KHÔNG SELECT email / phone trên bảng xếp hạng công khai
        const { data: dbProfiles, error } = await supabase
          .from('profiles')
          .select('id, name, avatar, level, xp, streak, words_learned, role, status, is_leaderboard_hidden, created_at')
          .neq('status', 'blocked')
          .order('xp', { ascending: false, nullsFirst: false })
          .limit(100);

        if (!error && Array.isArray(dbProfiles)) {
          dbProfiles.filter(p => !isDemoLeaderboardUser(p)).forEach(p => {
            const key = String(p.id);
            usersMap.set(key, {
              id: key,
              name: sanitizePublicDisplayName(p.name),
              avatar: p.avatar || null,
              level: p.level || 'HSK 1 - Sơ cấp',
              xp: typeof p.xp === 'number' && !isNaN(p.xp) ? p.xp : (Number(p.xp) || 0),
              streak: typeof p.streak === 'number' && !isNaN(p.streak) ? p.streak : (Number(p.streak) || 0),
              wordsLearned: p.words_learned || 0,
              role: p.role || 'student',
              status: p.status || 'active',
              isOptedOut: Boolean(p.is_leaderboard_hidden)
            });
          });
        }
      } catch (err) {
        console.warn('Leaderboard Supabase fetch notice:', err);
      }
    }
  }

  // 2. Merge local learner cache (Zero PII: strip email, mask email-like display name)
  try {
    const rawLocal = localStorage.getItem('hanzigo_admin_users_directory');
    if (rawLocal) {
      const localUsers = JSON.parse(rawLocal);
      if (Array.isArray(localUsers)) {
        localUsers.filter(u => !isDemoLeaderboardUser(u) && u.status !== 'blocked').forEach(u => {
          const idKey = String(u.id || u.uid || (u.email ? `loc_${u.email.split('@')[0]}` : ''));
          if (!idKey) return;
          const existing = usersMap.get(idKey);
          const isOptedOut = isUserLeaderboardOptedOut(u);

          if (!existing) {
            usersMap.set(idKey, {
              id: idKey,
              name: sanitizePublicDisplayName(u.name),
              avatar: u.avatar || null,
              level: u.level || 'HSK 1 - Sơ cấp',
              xp: typeof u.xp === 'number' ? u.xp : 0,
              streak: typeof u.streak === 'number' ? u.streak : 0,
              wordsLearned: u.wordsLearned || 0,
              role: u.role || 'student',
              status: u.status || 'active',
              isOptedOut,
              _matchEmail: u.email ? u.email.toLowerCase().trim() : '',
            });
          } else if (typeof u.xp === 'number' && u.xp > existing.xp && !existing.fromServerRpc) {
            existing.xp = u.xp;
          }
        });
      }
    }
  } catch {}

  // 3. Merge currently logged-in user with authentic live calculated XP
  const currentId = currentUser?.uid || currentUser?.id || null;
  const currentEmail = (currentUser?.email || '').toLowerCase().trim();
  if (currentUser) {
    const liveXp = calculateTotalXp(currentUser);
    const matchedByEmail = currentEmail
      ? Array.from(usersMap.values()).find((u) => u._matchEmail && u._matchEmail === currentEmail)
      : null;
    const userKey = String(currentId || matchedByEmail?.id || 'current_user');
    const existing = usersMap.get(userKey) || matchedByEmail || null;
    const isOptedOut = isUserLeaderboardOptedOut(currentUser);

    const authoritativeXp = Math.max(
      liveXp,
      typeof existing?.xp === 'number' ? existing.xp : 0,
      typeof currentUser?.xp === 'number' ? currentUser.xp : 0
    );

    const liveStreak = getStreakStatus(currentUser).streak;
    const authoritativeStreak = typeof liveStreak === 'number' ? liveStreak : 0;

    const mergedUser = {
      id: userKey,
      name: sanitizePublicDisplayName(currentUser.name || currentUser.displayName || existing?.name || 'Bạn'),
      avatar: currentUser.avatar || currentUser.photoURL || existing?.avatar || null,
      level: currentUser.level || existing?.level || 'HSK 1 - Sơ cấp',
      xp: existing?.fromServerRpc && (timeframe === 'weekly' || timeframe === 'monthly')
        ? Math.max(existing.xp || 0, liveXp > 0 ? Math.min(liveXp, 50) : 0)
        : authoritativeXp,
      streak: authoritativeStreak,
      wordsLearned: Math.max(currentUser.wordsLearned || 0, existing?.wordsLearned || 0),
      role: currentUser.role || existing?.role || 'student',
      status: 'active',
      isCurrentUser: true,
      isOptedOut,
      fromServerRpc: Boolean(existing?.fromServerRpc),
    };

    usersMap.set(userKey, mergedUser);

    if (isSupabaseConfigured && supabase && currentId && isValidUuid(currentId)) {
      if (!existing || (!existing.fromServerRpc && (authoritativeXp !== existing.xp || authoritativeStreak !== existing.streak))) {
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
          .eq('id', currentId)
          .then(() => {})
          .catch((e) => console.warn('Leaderboard Supabase sync notice:', e));
      }
    }
  }

  // 4. Lọc theo lớp học nếu scope === 'class'
  if (scope === 'class' && classroomId) {
    try {
      const rawMembers = localStorage.getItem(getUserStorageKey('hanzigo_class_members_store', currentUser));
      if (rawMembers) {
        const members = JSON.parse(rawMembers);
        const classMemberIds = new Set(
          members
            .filter(m => m.classroom_id === classroomId && m.status === 'active')
            .map(m => m.student_id || m.student_email || m.email)
            .filter(Boolean)
        );

        for (const [key, userObj] of usersMap.entries()) {
          const isMember =
            classMemberIds.has(userObj.id) ||
            (userObj._matchEmail && classMemberIds.has(userObj._matchEmail));
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
    const dedupKey = String(userObj.id);
    const prev = uniqueUsers.get(dedupKey);
    if (!prev || (!prev.isCurrentUser && (userObj.isCurrentUser || (userObj.xp || 0) > (prev.xp || 0)))) {
      uniqueUsers.set(dedupKey, userObj);
    }
  }

  // 5. Điều chỉnh XP theo khung Tuần / Tháng giờ Việt Nam (chỉ khi chưa được RPC tính sẵn)
  const rawList = Array.from(uniqueUsers.values())
    .filter((u) => !u.isOptedOut || u.isCurrentUser)
    .map(userObj => {
      let effectiveXp = userObj.xp;
      if (!userObj.fromServerRpc) {
        if (timeframe === 'weekly') {
          const streakWeight = Math.min(7, Math.max(0, userObj.streak || 0)) / 7;
          effectiveXp = userObj.xp > 0 ? Math.max(10, Math.round(userObj.xp * (0.15 + (streakWeight * 0.25)))) : 0;
        } else if (timeframe === 'monthly') {
          const streakWeight = Math.min(30, Math.max(0, userObj.streak || 0)) / 30;
          effectiveXp = userObj.xp > 0 ? Math.max(20, Math.round(userObj.xp * (0.45 + (streakWeight * 0.35)))) : 0;
        }
      }
      return { ...userObj, xp: effectiveXp };
    });

  // 6. Sắp xếp giảm dần theo XP và Streak
  rawList.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return (b.streak || 0) - (a.streak || 0);
  });

  // 7. Gán thứ hạng & loại bỏ toàn bộ email/PII khỏi payload công khai
  let currentUserRank = -1;
  let currentUserEntry = null;
  const publicRanked = [];
  let publicRankCounter = 0;

  rawList.forEach((item) => {
    const isCurrent = Boolean(
      item.isCurrentUser || (currentId && item.id === currentId)
    );
    const titleObj = getXpHonorificTitle(item.xp);

    // Nếu user bật ẩn danh: không đưa vào danh sách công khai cho người khác thấy, vẫn trả My Rank Card riêng
    const visibleInPublic = !item.isOptedOut;
    if (visibleInPublic) {
      publicRankCounter += 1;
    }
    const rank = visibleInPublic ? publicRankCounter : rawList.length;

    const cleanEntry = {
      id: item.id,
      rank,
      name: sanitizePublicDisplayName(item.name),
      maskedEmail: item._matchEmail ? maskSensitiveEmail(item._matchEmail) : '***',
      avatar: item.isOptedOut ? null : item.avatar,
      level: item.level,
      xp: item.xp,
      streak: item.streak,
      wordsLearned: item.wordsLearned || 0,
      role: item.role || 'student',
      status: item.status || 'active',
      isCurrentUser: isCurrent,
      isOptedOut: Boolean(item.isOptedOut),
      honorific: titleObj.title,
      honorificStyle: titleObj.color,
    };

    if (isCurrent) {
      currentUserRank = visibleInPublic ? rank : -1;
      currentUserEntry = { ...cleanEntry, rank: visibleInPublic ? rank : -1 };
    }
    if (visibleInPublic) {
      publicRanked.push(cleanEntry);
    }
  });

  const slicedLeaderboard = publicRanked.slice(0, limit);

  let gapToNext = 0;
  let nextRankUser = null;
  if (currentUserRank > 1) {
    nextRankUser = publicRanked[currentUserRank - 2];
    if (nextRankUser) {
      gapToNext = Math.max(1, nextRankUser.xp - (currentUserEntry?.xp || 0) + 1);
    }
  }

  return {
    leaderboard: slicedLeaderboard,
    totalLearners: publicRanked.length,
    currentUserRank,
    currentUserEntry,
    gapToNext,
    nextRankUser,
    timeframe,
    scope,
    vnWindow,
  };
}

/**
 * Bảng vàng HSK (Hall of Fame): chỉ tính các bài thi thật trong Exam Mode ('simulation')
 */
export async function getHskHallOfFame(
  currentUser = null,
  { examSystem = 'all', level = 'all', limit = 50 } = {}
) {
  const currentId = currentUser?.uid || currentUser?.id || null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rpcRows, error } = await supabase.rpc('get_hsk_hall_of_fame', {
        p_exam_system: examSystem,
        p_level: level,
        p_limit: limit,
      });

      if (!error && Array.isArray(rpcRows)) {
        const entries = rpcRows.map((r) => ({
          id: String(r.attempt_id || `${r.user_id}-${r.exam_id}`),
          userId: String(r.user_id),
          name: sanitizePublicDisplayName(r.display_name),
          avatar: r.avatar || null,
          examId: r.exam_id,
          examTitle: r.exam_title,
          examLevel: r.exam_level,
          examSystem: r.exam_system,
          score: Number(r.score || 0),
          maxScore: Number(r.max_score || 200),
          accuracyPercentage: Number(r.accuracy_percentage || 0),
          passed: Boolean(r.passed),
          createdAt: r.created_at,
          rank: Number(r.rank),
          isCurrentUser: Boolean(currentId && String(r.user_id) === String(currentId)),
        }));
        const mine = entries.find((e) => e.isCurrentUser) || null;
        return {
          entries,
          totalEntries: entries.length,
          currentUserRank: mine ? mine.rank : -1,
          currentUserEntry: mine,
          examSystem,
          level,
        };
      }
    } catch {}
  }

  // Fallback cục bộ đọc lịch sử Exam Mode thật của người dùng hiện tại (0 dữ liệu giả)
  const localAttempts = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('hanzigo_hsk_attempts') || k.startsWith('hanzigo_dual_exam_history'))) {
        const parsed = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(parsed)) {
          for (const a of parsed) {
            if (!a) continue;
            localAttempts.push({
              ...a,
              userId: a.userId || currentId || 'local_learner',
              displayName: sanitizePublicDisplayName(currentUser?.name || a.displayName || 'Bạn'),
              isOptedOut: isUserLeaderboardOptedOut(currentUser),
            });
          }
        }
      }
    }
  } catch {}

  const ranked = filterAndRankHallOfFame(localAttempts, {
    examSystem,
    level,
    currentUserId: currentId || 'local_learner',
    limit,
  });

  return {
    ...ranked,
    examSystem,
    level,
  };
}
