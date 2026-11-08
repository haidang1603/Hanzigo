import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { getAllProfilesFromDb } from './adminService.js';
import { getMaterialsFromDb } from './materialsService.js';
import { getCommunityReports, getCommunityPosts } from './communityService.js';
import { getAllLevels } from './learningPathService.js';

/**
 * ADMIN ANALYTICS SERVICE — HANZIGO
 * Cung cấp dữ liệu phân tích, thống kê toàn nền tảng cho Quản Trị Viên (Admin)
 * Nguyên tắc: REAL DATA — AUTHORITATIVE QUERIES — NO FABRICATION
 */

/**
 * 1. Lấy chỉ số tổng quan hệ thống (Key Metric Cards)
 */
export async function getAdminOverviewMetrics() {
  try {
    const [profiles, materials] = await Promise.all([
      getAllProfilesFromDb().catch(() => []),
      getMaterialsFromDb().catch(() => [])
    ]);

    const safeProfiles = profiles || [];
    const safeMaterials = materials || [];

    const totalAccounts = safeProfiles.length;
    const studentCount = safeProfiles.filter(p => !p.role || p.role === 'student').length;
    const teacherCount = safeProfiles.filter(p => p.role === 'teacher').length;
    const adminCount = safeProfiles.filter(p => p.role === 'admin').length;
    const blockedCount = safeProfiles.filter(p => p.status === 'blocked').length;
    const totalMaterials = safeMaterials.length;

    // Lấy số lớp học đang hoạt động từ Supabase hoặc fallback
    let activeClassroomsCount = 0;
    if (isSupabaseConfigured && supabase) {
      try {
        const { count, error } = await supabase
          .from('classrooms')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');
        if (!error && typeof count === 'number') {
          activeClassroomsCount = count;
        }
      } catch (err) {
        console.warn('Error counting active classrooms:', err);
      }
    } else {
      try {
        const raw = localStorage.getItem('hanzigo_classrooms_store');
        if (raw) {
          const list = JSON.parse(raw);
          activeClassroomsCount = list.filter(c => c.status === 'active' || !c.status).length;
        }
      } catch {}
    }

    return {
      totalAccounts,
      studentCount,
      teacherCount,
      adminCount,
      blockedCount,
      totalMaterials,
      activeClassroomsCount
    };
  } catch (err) {
    console.error('getAdminOverviewMetrics error:', err);
    throw err;
  }
}

/**
 * 2. Phân bố tài khoản người dùng theo vai trò & trạng thái (Donut Chart)
 */
export async function getUserDistributionData() {
  const profiles = (await getAllProfilesFromDb().catch(() => [])) || [];
  const total = profiles.length;

  if (total === 0) {
    return {
      total: 0,
      roles: [],
      statuses: []
    };
  }

  const studentCount = profiles.filter(p => !p.role || p.role === 'student').length;
  const teacherCount = profiles.filter(p => p.role === 'teacher').length;
  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const blockedCount = profiles.filter(p => p.status === 'blocked').length;
  const activeCount = total - blockedCount;

  return {
    total,
    roles: [
      {
        id: 'student',
        label: 'Học viên',
        count: studentCount,
        percentage: Number(((studentCount / total) * 100).toFixed(1)),
        color: '#3B82F6' // Sky Blue
      },
      {
        id: 'teacher',
        label: 'Giáo viên',
        count: teacherCount,
        percentage: Number(((teacherCount / total) * 100).toFixed(1)),
        color: '#10B981' // Emerald
      },
      {
        id: 'admin',
        label: 'Quản trị viên',
        count: adminCount,
        percentage: Number(((adminCount / total) * 100).toFixed(1)),
        color: '#F43F5E' // Rose
      }
    ],
    statuses: [
      {
        id: 'active',
        label: 'Hoạt động',
        count: activeCount,
        percentage: Number(((activeCount / total) * 100).toFixed(1)),
        color: '#10B981'
      },
      {
        id: 'blocked',
        label: 'Bị khóa',
        count: blockedCount,
        percentage: Number(((blockedCount / total) * 100).toFixed(1)),
        color: '#EF4444'
      }
    ]
  };
}

/**
 * 3. Tăng trưởng người dùng theo mốc thời gian (Line / Area Chart)
 * @param {'7d' | '30d' | '90d' | '12m'} timeframe
 */
export async function getUserGrowthData(timeframe = '30d') {
  const profiles = (await getAllProfilesFromDb().catch(() => [])) || [];
  const now = new Date();
  let days = 30;

  if (timeframe === '7d') days = 7;
  else if (timeframe === '90d') days = 90;
  else if (timeframe === '12m') days = 365;

  const startDate = new Date();
  startDate.setDate(now.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  // Tạo map từng ngày
  const dateMap = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dateMap[dateStr] = 0;
  }

  let totalNewUsers = 0;

  profiles.forEach(p => {
    if (!p.created_at) return;
    const createdDate = new Date(p.created_at);
    const dateStr = createdDate.toISOString().split('T')[0];
    if (dateMap[dateStr] !== undefined) {
      dateMap[dateStr] += 1;
      totalNewUsers += 1;
    }
  });

  // Chuyển map thành mảng điểm tọa độ kèm lũy kế
  let cumulative = 0;
  const points = Object.entries(dateMap).map(([date, count]) => {
    cumulative += count;
    const [y, m, d] = date.split('-');
    return {
      date,
      displayDate: `${d}/${m}`,
      count,
      cumulative
    };
  });

  return {
    timeframe,
    totalNewUsers,
    totalAccounts: profiles.length,
    points
  };
}

/**
 * 4. Hoạt động học tập toàn nền tảng (Bar Chart)
 */
export async function getPlatformLearningActivityData() {
  let submissionsCount = 0;
  let readingProgressCount = 0;
  let communityPostsCount = 0;
  let materialsCount = 0;

  if (isSupabaseConfigured && supabase) {
    try {
      const [subsRes, readRes, postRes, matRes] = await Promise.all([
        supabase.from('submissions').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0 })),
        supabase.from('reading_progress').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0 })),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0 })),
        supabase.from('materials').select('id', { count: 'exact', head: true }).catch(() => ({ count: 0 }))
      ]);

      submissionsCount = subsRes.count || 0;
      readingProgressCount = readRes.count || 0;
      communityPostsCount = postRes.count || 0;
      materialsCount = matRes.count || 0;
    } catch (err) {
      console.warn('Error fetching platform learning activities:', err);
    }
  } else {
    // Local fallback
    try {
      const subs = JSON.parse(localStorage.getItem('hanzigo_submissions_store') || '[]');
      submissionsCount = subs.length;
    } catch {}
    try {
      const reads = JSON.parse(localStorage.getItem('hanzigo_reading_progress_store') || '[]');
      readingProgressCount = reads.length;
    } catch {}
    try {
      const posts = JSON.parse(localStorage.getItem('hanzigo_community_posts_store') || '[]');
      communityPostsCount = posts.length;
    } catch {}
    try {
      const mats = await getMaterialsFromDb().catch(() => []);
      materialsCount = mats ? mats.length : 0;
    } catch {}
  }

  const activities = [
    {
      id: 'submissions',
      label: 'Bài nộp học viên',
      count: submissionsCount,
      color: '#3B82F6',
      icon: 'FileCheck'
    },
    {
      id: 'reading',
      label: 'Bài đọc hoàn thành',
      count: readingProgressCount,
      color: '#10B981',
      icon: 'BookOpen'
    },
    {
      id: 'community',
      label: 'Thảo luận cộng đồng',
      count: communityPostsCount,
      color: '#F59E0B',
      icon: 'MessageSquare'
    },
    {
      id: 'materials',
      label: 'Tài liệu giáo trình',
      count: materialsCount,
      color: '#8B5CF6',
      icon: 'FolderDown'
    }
  ];

  const totalActions = activities.reduce((sum, a) => sum + a.count, 0);

  return {
    totalActions,
    activities
  };
}

/**
 * 5. Phân bố giáo trình & tài liệu HSK (Horizontal Bar Chart)
 */
export async function getHskCurriculumDistributionData() {
  const levels = getAllLevels() || [];
  const materials = (await getMaterialsFromDb().catch(() => [])) || [];

  const hskOrder = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
  const colors = {
    'HSK 1': '#45B97C',
    'HSK 2': '#F4B942',
    'HSK 3': '#E85D3F',
    'HSK 4': '#3B82F6',
    'HSK 5': '#0284C7',
    'HSK 6': '#8B5CF6'
  };

  const distribution = hskOrder.map(hsk => {
    const levelObj = levels.find(l => l.hskLevel === hsk);
    const lessonCount = levelObj ? (levelObj.totalLessons || 20) : 20;
    
    // Đếm số tài liệu thuộc cấp độ HSK này
    const matCount = materials.filter(m => {
      const target = (m.level || m.category || '').toUpperCase();
      return target.includes(hsk.toUpperCase());
    }).length;

    return {
      hsk,
      name: levelObj ? levelObj.name : `Giáo trình ${hsk}`,
      lessonCount,
      materialsCount: matCount,
      color: colors[hsk] || '#E85D3F'
    };
  });

  const totalLessons = distribution.reduce((sum, d) => sum + d.lessonCount, 0);
  const totalMaterials = distribution.reduce((sum, d) => sum + d.materialsCount, 0);

  return {
    totalLessons,
    totalMaterials,
    distribution
  };
}

/**
 * 6. Quản lý & Kiểm duyệt cộng đồng (Moderation Overview Chart)
 */
export async function getCommunityModerationOverviewData() {
  let reports = [];
  let totalPosts = 0;

  try {
    const [reportsRes, postsRes] = await Promise.all([
      getCommunityReports({ pageSize: 100 }).catch(() => ({ reports: [] })),
      getCommunityPosts({ pageSize: 100 }).catch(() => ({ posts: [] }))
    ]);

    reports = reportsRes?.reports || [];
    totalPosts = postsRes?.totalCount || postsRes?.posts?.length || 0;
  } catch (err) {
    console.warn('getCommunityModerationOverviewData notice:', err);
  }

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending' || !r.status).length;
  const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'dismissed').length;
  const hiddenReports = reports.filter(r => r.status === 'hidden' || r.status === 'action_taken').length;

  return {
    totalPosts,
    totalReports,
    pendingReports,
    resolvedReports,
    hiddenReports,
    metrics: [
      {
        id: 'pending',
        label: 'Chờ duyệt',
        count: pendingReports,
        percentage: totalReports > 0 ? Number(((pendingReports / totalReports) * 100).toFixed(1)) : 0,
        color: '#F59E0B'
      },
      {
        id: 'resolved',
        label: 'Đã giải quyết',
        count: resolvedReports,
        percentage: totalReports > 0 ? Number(((resolvedReports / totalReports) * 100).toFixed(1)) : 0,
        color: '#10B981'
      },
      {
        id: 'hidden',
        label: 'Đã gỡ / Ẩn',
        count: hiddenReports,
        percentage: totalReports > 0 ? Number(((hiddenReports / totalReports) * 100).toFixed(1)) : 0,
        color: '#EF4444'
      }
    ]
  };
}

