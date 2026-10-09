import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { calculateTotalXp } from '../utils/gamification.js';

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

  // 1. Fetch live profiles from Supabase if connected
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbProfiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, level, xp, streak, words_learned, role, status, is_leaderboard_hidden, created_at')
        .eq('status', 'active')
        .order('xp', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(dbProfiles)) {
        dbProfiles.filter(p => !isDemoLeaderboardUser(p)).forEach(p => {
          const key = p.email || p.id;
          usersMap.set(key, {
            id: p.id,
            name: p.name || 'Học viên',
            email: p.email || '',
            avatar: p.avatar || null,
            level: p.level || 'HSK 1 - Sơ cấp',
            xp: typeof p.xp === 'number' ? p.xp : 50,
            streak: typeof p.streak === 'number' ? p.streak : 1,
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

  // 2. Merge local registered directory from Admin / localStorage
  try {
    const rawLocal = localStorage.getItem('hanzigo_admin_users_directory');
    if (rawLocal) {
      const localUsers = JSON.parse(rawLocal);
      if (Array.isArray(localUsers)) {
        localUsers.filter(u => !isDemoLeaderboardUser(u) && u.status !== 'blocked').forEach(u => {
          const key = u.email || u.id;
          const existing = usersMap.get(key);
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
    const userKey = currentUser.email || currentUser.uid || currentUser.id;
    const existing = usersMap.get(userKey);
    const isOptedOut = isUserLeaderboardOptedOut(currentUser);

    const mergedUser = {
      id: currentUser.uid || currentUser.id || 'current_user',
      name: currentUser.name || currentUser.displayName || 'Bạn',
      email: currentUser.email || '',
      avatar: currentUser.avatar || currentUser.photoURL || null,
      level: currentUser.level || existing?.level || 'HSK 1 - Sơ cấp',
      xp: liveXp,
      streak: Math.max(currentUser.streak || 0, existing?.streak || 1),
      wordsLearned: currentUser.wordsLearned || existing?.wordsLearned || 0,
      role: currentUser.role || existing?.role || 'student',
      status: 'active',
      isCurrentUser: true,
      isOptedOut
    };

    usersMap.set(userKey, mergedUser);
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

        // Giữ lại thành viên trong lớp hoặc currentUser
        for (const [key, userObj] of usersMap.entries()) {
          const isMember = classMemberIds.has(userObj.id) || classMemberIds.has(userObj.email);
          if (!isMember && !userObj.isCurrentUser) {
            usersMap.delete(key);
          }
        }
      }
    } catch {}
  }

  // 5. Điều chỉnh điểm XP theo timeframe (Weekly / Monthly)
  let rawList = Array.from(usersMap.values()).map(userObj => {
    let effectiveXp = userObj.xp;

    if (timeframe === 'weekly') {
      // Ước lượng XP tuần dựa trên chuỗi học gần nhất và tỷ trọng tích lũy
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
  const currentKey = currentUser ? (currentUser.email || currentUser.uid || currentUser.id) : null;
  let currentUserRank = -1;
  let currentUserEntry = null;

  const rankedList = rawList.map((item, index) => {
    const rank = index + 1;
    const isCurrent = Boolean(currentKey && (item.email === currentKey || item.id === currentKey));
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
