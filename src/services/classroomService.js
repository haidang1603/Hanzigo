import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';
import { sanitizeUserErrorMessage } from '../utils/errorSanitizer.js';
import { recordAuditLog, AUDIT_CATEGORIES, AUDIT_SEVERITY } from './auditLogService.js';

// Keys for local simulation storage fallback
const STORAGE_KEYS = {
  CLASSROOMS: 'hanzigo_classrooms_store',
  MEMBERS: 'hanzigo_class_members_store',
  ASSIGNMENTS: 'hanzigo_assignments_store',
  SUBMISSIONS: 'hanzigo_submissions_store',
  ANNOUNCEMENTS: 'hanzigo_announcements_store',
  MATERIALS: 'hanzigo_class_materials_store',
  DELETED_CLASSES: 'hanzigo_deleted_classrooms_store',
  SEED_FLAG: 'hanzigo_classroom_seed_initialized',
};

/**
 * Generate unique, easy-to-read Class Code (e.g., HZG-7K2P9)
 * Excludes ambiguous chars (0, O, 1, I, L)
 */
export function generateClassCode() {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    randomPart += chars[idx];
  }
  return `HZG-${randomPart}`;
}

/**
 * Normalizes input class codes to handle:
 * - With or without 'HZG-' prefix (e.g. '7K2P9' vs 'HZG-7K2P9')
 * - Spaces and casing (e.g. ' hzg - 7k2p9 ')
 */
export function normalizeClassCode(code) {
  if (!code) return { raw: '', codeWithPrefix: '', codeWithoutPrefix: '' };
  const raw = String(code).trim().toUpperCase().replace(/\s+/g, '');
  const codeWithoutPrefix = raw.replace(/^HZG-?/, '');
  const codeWithPrefix = codeWithoutPrefix ? `HZG-${codeWithoutPrefix}` : '';
  return { raw, codeWithPrefix, codeWithoutPrefix };
}

/**
 * Lọc bỏ hoàn toàn các thông tin nhạy cảm của tài khoản học viên (Student Privacy)
 * Giáo viên chỉ được xem dữ liệu học tập cần thiết, KHÔNG BAO GIỜ thấy mật khẩu hay auth token.
 */
export function sanitizeStudentDataForTeacher(student) {
  if (!student || typeof student !== 'object') return null;
  const safe = { ...student };
  delete safe.password;
  delete safe.password_hash;
  delete safe.token;
  delete safe.access_token;
  delete safe.refresh_token;
  delete safe.auth_token;
  delete safe.secret;
  delete safe.raw_user_meta_data;
  delete safe.private_account_info;
  return safe;
}

/**
 * Diagnostic logic: Student Learning Health Status
 * Categories: 'Healthy' | 'Needs Attention' | 'At Risk'
 * Note: Purely based on academic data (activity, completion, deadlines, scores).
 */
export function calculateStudentHealthStatus({
  daysInactive = 0,
  completionRate = 100,
  overdueCount = 0,
  avgScore = 85
} = {}) {
  if (daysInactive >= 7 || completionRate < 40 || overdueCount >= 2 || (avgScore !== null && avgScore < 50)) {
    return {
      status: 'At Risk',
      color: 'red',
      badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800',
      reason: daysInactive >= 7 
        ? `Không hoạt động ${daysInactive} ngày` 
        : overdueCount >= 2 
          ? `Quá hạn ${overdueCount} bài tập` 
          : completionRate < 40 
            ? `Tỷ lệ hoàn thành thấp (${completionRate}%)`
            : `Điểm trung bình thấp (${avgScore} đ)`
    };
  }

  if (daysInactive >= 4 || completionRate < 70 || overdueCount >= 1 || (avgScore !== null && avgScore < 65)) {
    return {
      status: 'Needs Attention',
      color: 'amber',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      reason: daysInactive >= 4
        ? `Chưa vào lớp ${daysInactive} ngày`
        : overdueCount >= 1
          ? `Có 1 bài tập trễ hạn`
          : `Tiến độ học tập cần cải thiện (${completionRate}%)`
    };
  }

  return {
    status: 'Healthy',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    reason: 'Học tập đều đặn, hoàn thành tốt'
  };
}

// ==========================================
// LOCAL SIMULATION HELPERS
// ==========================================
// In-memory store fallback for Node.js / SSR / non-browser test environments
const memoryStore = new Map();

function getLocalItem(key, fallback = []) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return memoryStore.has(key) ? memoryStore.get(key) : fallback;
}

function setLocalItem(key, data) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {}
  memoryStore.set(key, data);
}

// Automatically purge any legacy fake/mock student accounts and demo submissions by ID
function purgeMockUsers() {
  const mockStudentIds = [
    'stu-nguyen-an', 'stu-tran-mai', 'stu-le-hoang',
    'stu-demo-hung', 'stu-demo-lan', 'stu-demo-nam', 'stu-demo-anh', 'stu-demo-yen'
  ];
  const mockSubIds = [
    'sub-1', 'sub-2', 'sub-3',
    'sub-demo-1', 'sub-demo-2', 'sub-demo-3', 'sub-demo-4', 'sub-demo-5'
  ];

  try {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const cleanMembers = members.filter(m => !mockStudentIds.includes(m.student_id));
    if (cleanMembers.length !== members.length) {
      setLocalItem(STORAGE_KEYS.MEMBERS, cleanMembers);
    }

    const subs = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const cleanSubs = subs.filter(s => 
      !mockSubIds.includes(s.id) && 
      !mockStudentIds.includes(s.student_id)
    );
    if (cleanSubs.length !== subs.length) {
      setLocalItem(STORAGE_KEYS.SUBMISSIONS, cleanSubs);
    }
  } catch {}
}

// Initial mock seed for simulation mode
export function ensureSimulationSeed() {
  purgeMockUsers();

  const isSeeded = getLocalItem(STORAGE_KEYS.SEED_FLAG, false);
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);

  // Ensure default foundational classes are never blacklisted by accidental deletion
  const cleanDeletedIds = deletedIds.filter(id => id !== 'cls-hsk1-foundation' && id !== 'cls-hsk2-intermediate');
  if (cleanDeletedIds.length !== deletedIds.length) {
    setLocalItem(STORAGE_KEYS.DELETED_CLASSES, cleanDeletedIds);
  }

  const existingClasses = getLocalItem(STORAGE_KEYS.CLASSROOMS, null);
  // Only skip if already initialized and contains at least 1 classroom
  if (isSeeded && Array.isArray(existingClasses) && existingClasses.length > 0) {
    return;
  }

  const defaultClasses = [
    {
      id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      name: 'HSK 1 - Nhập môn Giao tiếp & Phát âm',
      description: 'Lớp học nền tảng dành cho người mới bắt đầu. Tập trung phát âm chuẩn Pinyin và 150 từ vựng cốt lõi.',
      hsk_level: 'HSK 1',
      class_code: 'HZG-7K2P9',
      max_students: 30,
      status: 'active',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cls-hsk2-intermediate',
      teacher_id: 'user_teacher_demo',
      name: 'HSK 2 - Tăng tốc Hội thoại Hằng ngày',
      description: 'Mở rộng 300 từ vựng và cấu trúc ngữ pháp thông dụng trong sinh hoạt và công việc.',
      hsk_level: 'HSK 2',
      class_code: 'HZG-9M4X2',
      max_students: 25,
      status: 'active',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Default guest student enrolled in foundation class so student portal is never empty
  const defaultMembers = [
    {
      id: 'mem-default-student-1',
      classroom_id: 'cls-hsk1-foundation',
      student_id: 'user_guest',
      student_name: 'Học viên HanziGo',
      student_avatar: null,
      student_email: 'student@hanzigo.com',
      hsk_level: 'HSK 1',
      joined_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      status: 'active',
      last_active: new Date().toISOString(),
      xp: 50,
      streak: 1,
      words_learned: 20,
      lessons_completed: 2,
      study_hours: 1.5
    }
  ];

  const defaultAssignments = [
    {
      id: 'asg-vocab-1',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Luyện tập 20 Từ vựng HSK 1 về Gia đình & Đại từ',
      description: 'Học và kiểm tra nghĩa của các từ: 爸爸, 妈妈, 哥哥, 姐姐, 我, 你, 他, 她...',
      content_type: 'Vocabulary',
      content: {
        questions: [
          { id: 'q1', type: 'choice', prompt: 'Từ nào có nghĩa là "Bố / Cha"?', options: ['爸爸 (bàba)', '妈妈 (māma)', '老师 (lǎoshī)', '朋友 (péngyou)'], correctIndex: 0 },
          { id: 'q2', type: 'choice', prompt: 'Nghĩa của "Chúng tôi / Chúng ta" là gì?', options: ['我们', '他们', '你们', '老师'], correctIndex: 0 },
          { id: 'q3', type: 'choice', prompt: 'Pinyin đúng của "谢谢" là:', options: ['xièxie', 'zàijiàn', 'bù kèqi', 'duìbuqǐ'], correctIndex: 0 }
        ]
      },
      due_date: new Date(Date.now() + 3 * 86400000).toISOString(),
      published: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'asg-write-1',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Tập viết chữ Hán: Quy tắc bút thuận các chữ cơ bản',
      description: 'Luyện viết 5 chữ: 一, 二, 三, 人, 大. Chú ý thứ tự nét từ trên xuống dưới, từ trái sang phải.',
      content_type: 'Writing',
      content: {
        promptText: 'Hãy viết lại các chữ 一, 二, 三, 人, 大 và ghi chú nét bút.',
        targetCharacters: ['一', '二', '三', '人', '大']
      },
      due_date: new Date(Date.now() + 5 * 86400000).toISOString(),
      published: true,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'asg-speak-1',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Ghi âm phát âm 4 Thanh điệu cơ bản',
      description: 'Đọc to và ghi âm các từ mā, má, mǎ, mà để giáo viên nghe và sửa phát âm.',
      content_type: 'Speaking',
      content: {
        practicePinyin: 'mā - má - mǎ - mà'
      },
      due_date: new Date(Date.now() - 1 * 86400000).toISOString(),
      published: true,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // No mock submissions by default
  const defaultSubmissions = [];

  const defaultAnnouncements = [
    {
      id: 'ann-1',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Chào mừng cả lớp đến với khóa HSK 1!',
      content: 'Chào các bạn! Chúng ta sẽ cùng nhau chinh phục 150 từ vựng và đỗ HSK 1 với điểm số cao nhất. Hãy hoàn thành các bài tập đúng hạn nhé!',
      pinned: true,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'ann-2',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Nhắc nhở nộp bài tập phát âm 4 Thanh điệu',
      content: 'Các bạn chưa nộp bài tập ghi âm vui lòng hoàn thành trước 23h59 hôm nay để thầy kịp nghe và nhận xét nhé.',
      pinned: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ];

  const defaultMaterials = [
    {
      id: 'mat-1',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'Giáo trình Chuẩn HSK 1 - PDF Màu',
      description: 'Sách bài học đầy đủ kèm pinyin và dịch nghĩa tiếng Việt.',
      file_url: 'https://example.com/materials/hsk1-standard.pdf',
      file_type: 'pdf',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'mat-2',
      classroom_id: 'cls-hsk1-foundation',
      teacher_id: 'user_teacher_demo',
      title: 'File Audio Nghe Pinyin & Thanh điệu HSK 1',
      description: 'Tệp âm thanh chuẩn giọng Bắc Kinh để luyện phát âm.',
      file_url: 'https://example.com/materials/hsk1-pinyin-audio.mp3',
      file_type: 'audio',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ];

  // Filter out any classrooms that were explicitly deleted by the user
  const freshClasses = defaultClasses.filter(c => !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
  setLocalItem(STORAGE_KEYS.CLASSROOMS, freshClasses);
  setLocalItem(STORAGE_KEYS.MEMBERS, defaultMembers);
  setLocalItem(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
  setLocalItem(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
  setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, defaultAnnouncements);
  setLocalItem(STORAGE_KEYS.MATERIALS, defaultMaterials);
  setLocalItem(STORAGE_KEYS.SEED_FLAG, true);
}

// ==========================================
// CLASSROOM MANAGEMENT APIS
// ==========================================

/**
 * Fetch all classrooms owned by a Teacher
 */
export async function getClassroomsForTeacher(teacherId) {
  ensureSimulationSeed();

  // Resolve effective teacher ID from auth session if available
  let effectiveTeacherId = teacherId;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        effectiveTeacherId = authData.user.id;
      }
    } catch {}
  }

  let dbClasses = [];
  if (isSupabaseConfigured && supabase && (isValidUuid(effectiveTeacherId) || isValidUuid(teacherId))) {
    try {
      let query = supabase
        .from('classrooms')
        .select('*, class_members(count)')
        .order('created_at', { ascending: false });

      if (isValidUuid(effectiveTeacherId) && isValidUuid(teacherId) && effectiveTeacherId !== teacherId) {
        query = query.or(`teacher_id.eq.${effectiveTeacherId},teacher_id.eq.${teacherId}`);
      } else {
        const targetId = isValidUuid(effectiveTeacherId) ? effectiveTeacherId : teacherId;
        query = query.eq('teacher_id', targetId);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        dbClasses = data.map(c => ({
          ...c,
          student_count: c.class_members?.[0]?.count || 0
        }));
      }
    } catch (err) {
      console.warn('Supabase getClassroomsForTeacher notice:', err);
    }
  }

  // Always merge local classrooms (ensures newly created or simulation classrooms are never lost)
  const localList = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
  const allLocalMembers = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);
  const merged = [...dbClasses];
  
  for (const lc of localList) {
    const isOwner = lc.teacher_id === effectiveTeacherId || 
                    lc.teacher_id === teacherId || 
                    lc.teacher_id === 'user_teacher_demo' ||
                    teacherId === 'user_teacher_demo';
    if (isOwner && !merged.some(m => m.id === lc.id || m.class_code === lc.class_code)) {
      merged.push({ ...lc });
    }
  }

  // Strictly filter out any classroom that has been deleted
  let finalClasses = merged.filter(c => 
    c && 
    !deletedIds.includes(c.id) && 
    !deletedIds.includes(String(c.id))
  );

  // If teacher has no classrooms yet, ensure default foundational demo classes are available so the dashboard is not blank
  if (finalClasses.length === 0) {
    const fallbackList = localList.filter(c => c && !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
    if (fallbackList.length > 0) {
      finalClasses = [...fallbackList];
    }
  }

  // Synchronize dynamic student_count for all classrooms from local members and DB
  for (const c of finalClasses) {
    const localMemberCount = allLocalMembers.filter(m => 
      (m.classroom_id === c.id || String(m.classroom_id) === String(c.id)) && 
      m.status === 'active'
    ).length;
    c.student_count = Math.max(c.student_count || 0, localMemberCount);
  }

  return finalClasses;
}

/**
 * Fetch single classroom by ID
 */
export async function getClassroomById(classroomId) {
  ensureSimulationSeed();
  if (!classroomId) return null;
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);
  if (deletedIds.includes(classroomId) || deletedIds.includes(String(classroomId))) {
    return null;
  }
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    return list.find(c => c.id === classroomId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*, profiles:teacher_id(name, email, avatar)')
      .eq('id', classroomId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getClassroomById notice, falling back:', err);
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    return list.find(c => c.id === classroomId) || null;
  }
}

/**
 * Lookup classroom preview by Class Code (for joining)
 */
export async function lookupClassroomByCode(classCode) {
  ensureSimulationSeed();
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);
  const { raw, codeWithPrefix, codeWithoutPrefix } = normalizeClassCode(classCode);
  if (!raw && !codeWithPrefix && !codeWithoutPrefix) return null;

  const targetCodes = Array.from(new Set([codeWithPrefix, raw, codeWithoutPrefix].filter(Boolean)));

  // Fast check: default foundational classes
  const defaultFoundational = [
    {
      id: 'cls-hsk1-foundation',
      name: 'HSK 1 - Nhập môn Giao tiếp & Phát âm',
      description: 'Lớp học nền tảng dành cho người mới bắt đầu. Tập trung phát âm chuẩn Pinyin và 150 từ vựng cốt lõi.',
      hsk_level: 'HSK 1',
      class_code: 'HZG-7K2P9',
      max_students: 30,
      status: 'active',
      teacher_name: 'Giáo viên HanziGo',
      student_count: 1
    },
    {
      id: 'cls-hsk2-intermediate',
      name: 'HSK 2 - Tăng tốc Hội thoại Hằng ngày',
      description: 'Mở rộng 300 từ vựng và cấu trúc ngữ pháp thông dụng trong sinh hoạt và công việc.',
      hsk_level: 'HSK 2',
      class_code: 'HZG-9M4X2',
      max_students: 25,
      status: 'active',
      teacher_name: 'Giáo viên HanziGo',
      student_count: 0
    }
  ];
  const foundDef = defaultFoundational.find(df => {
    const dfNorm = normalizeClassCode(df.class_code);
    return targetCodes.some(tc => tc === dfNorm.raw || tc === dfNorm.codeWithPrefix || tc === dfNorm.codeWithoutPrefix);
  });
  if (foundDef && !deletedIds.includes(foundDef.id)) {
    return foundDef;
  }

  // 1. Try Supabase RPC first if configured (SECURITY DEFINER bypasses RLS)
  if (isSupabaseConfigured && supabase) {
    try {
      for (const testCode of targetCodes) {
        const { data: rpcData, error: rpcError } = await supabase.rpc('lookup_classroom_by_code', {
          p_class_code: testCode
        });
        if (!rpcError && rpcData && rpcData.id && !deletedIds.includes(rpcData.id) && !deletedIds.includes(String(rpcData.id))) {
          return rpcData;
        }
      }
    } catch (rpcErr) {
      console.warn('lookup_classroom_by_code RPC notice:', rpcErr);
    }

    // 2. Direct Supabase query fallback (works when RLS allows active classes)
    try {
      const orFilter = targetCodes.map(c => `class_code.ilike.${c}`).join(',');
      const { data, error } = await supabase
        .from('classrooms')
        .select('id, name, description, hsk_level, class_code, max_students, status, teacher_id, teacher:teacher_id(name, avatar), class_members(count)')
        .or(orFilter)
        .eq('status', 'active')
        .maybeSingle();

      if (!error && data && !deletedIds.includes(data.id) && !deletedIds.includes(String(data.id))) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          hsk_level: data.hsk_level,
          class_code: data.class_code,
          max_students: data.max_students,
          status: data.status,
          teacher_name: data.teacher?.name || 'Giáo viên HanziGo',
          teacher_avatar: data.teacher?.avatar || null,
          student_count: data.class_members?.[0]?.count || 0
        };
      }
    } catch (selErr) {
      console.warn('Supabase direct classroom select notice:', selErr);
    }
  }

  // 3. Shared dev/server API lookup (enables cross-browser, cross-device, incognito lookup)
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const primary = targetCodes[0];
      const sRes = await fetch(`/api/classroom/lookup?code=${encodeURIComponent(primary)}`);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData?.classroom && !deletedIds.includes(sData.classroom.id)) {
          // Cache in local storage so this browser also has it
          const localList = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
          if (!localList.some(c => c.id === sData.classroom.id || c.class_code === sData.classroom.class_code)) {
            setLocalItem(STORAGE_KEYS.CLASSROOMS, [sData.classroom, ...localList]);
          }
          return sData.classroom;
        }
      }
    } catch {}
  }

  // 4. Fallback to local storage (for offline, local simulation mode, or locally created classes)
  const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []).filter(c => !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
  const found = list.find(c => {
    const cNorm = normalizeClassCode(c.class_code);
    return targetCodes.some(tc => 
      tc === cNorm.raw || 
      tc === cNorm.codeWithPrefix || 
      tc === cNorm.codeWithoutPrefix
    );
  });

  if (found) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const memberCount = members.filter(m => m.classroom_id === found.id && m.status === 'active').length;
    return {
      ...found,
      teacher_name: found.teacher_name || 'Giáo viên HanziGo',
      student_count: found.student_count ?? memberCount
    };
  }

  return null;
}

/**
 * Create a new classroom
 */
export async function createClassroom({
  teacherId,
  name,
  description = '',
  hskLevel = 'HSK 1',
  maxStudents = 30,
  currentUserRole = 'teacher'
}) {
  if (currentUserRole === 'student') {
    return { success: false, error: 'Chỉ tài khoản có quyền giáo viên mới có thể tạo lớp học.' };
  }
  ensureSimulationSeed();
  const code = generateClassCode();
  const parsedMaxStudents = Math.max(1, Number(maxStudents) || 30);

  // Determine effective teacher ID (prefer active Supabase session if authenticated)
  let effectiveTeacherId = teacherId;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        effectiveTeacherId = authData.user.id;
      }
    } catch {}
  }

  const logCreatedClass = (cls) => {
    if (cls?.id) {
      recordAuditLog({
        action: 'CLASSROOM_CREATED',
        category: AUDIT_CATEGORIES.CLASSROOM,
        severity: AUDIT_SEVERITY.INFO,
        actorId: effectiveTeacherId,
        targetId: cls.id,
        metadata: { name: cls.name, class_code: cls.class_code, hsk_level: cls.hsk_level }
      });
    }
  };

  const newClass = {
    id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    teacher_id: effectiveTeacherId,
    teacher_name: 'Giáo viên HanziGo',
    name: name.trim(),
    description: description.trim(),
    hsk_level: hskLevel,
    class_code: code,
    max_students: parsedMaxStudents,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Synchronize to shared server store immediately (so other browsers/tabs see it)
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      fetch('/api/classroom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass)
      }).catch(() => {});
    } catch {}
  }

  if (!isSupabaseConfigured || !supabase || !isValidUuid(effectiveTeacherId)) {
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
    logCreatedClass(newClass);
    return { success: true, classroom: newClass };
  }

  try {
    const { data, error } = await supabase
      .from('classrooms')
      .insert({
        teacher_id: effectiveTeacherId,
        name: name.trim(),
        description: description.trim(),
        hsk_level: hskLevel,
        class_code: code,
        max_students: parsedMaxStudents,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase createClassroom notice, saving locally:', error);
      const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
      setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
      logCreatedClass(newClass);
      return { success: true, classroom: newClass };
    }

    if (data) {
      const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
      if (!list.some(c => c.id === data.id || c.class_code === data.class_code)) {
        setLocalItem(STORAGE_KEYS.CLASSROOMS, [data, ...list]);
      }
      logCreatedClass(data);
    }
    return { success: true, classroom: data };
  } catch (err) {
    console.warn('Supabase createClassroom fallback:', err);
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
    logCreatedClass(newClass);
    return { success: true, classroom: newClass };
  }
}

/**
 * Update classroom details
 */
export async function updateClassroom(classroomId, updates) {
  ensureSimulationSeed();
  const allowed = {};
  if (updates.name !== undefined) allowed.name = updates.name.trim();
  if (updates.description !== undefined) allowed.description = updates.description.trim();
  if (updates.hsk_level !== undefined) allowed.hsk_level = updates.hsk_level;
  if (updates.max_students !== undefined) allowed.max_students = Math.max(1, Number(updates.max_students) || 1);
  if (updates.status !== undefined) allowed.status = updates.status;
  if (updates.class_code !== undefined) allowed.class_code = updates.class_code;
  allowed.updated_at = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const updatedList = list.map(c => c.id === classroomId ? { ...c, ...allowed } : c);
    setLocalItem(STORAGE_KEYS.CLASSROOMS, updatedList);
    return { success: true };
  }

  try {
    const { data, error } = await supabase
      .from('classrooms')
      .update(allowed)
      .eq('id', classroomId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, classroom: data };
  } catch (err) {
    console.error('Supabase updateClassroom error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Regenerate class code for an existing classroom
 */
export async function regenerateClassCode(classroomId) {
  const newCode = generateClassCode();
  const res = await updateClassroom(classroomId, { class_code: newCode });
  if (res.success) {
    recordAuditLog({
      action: 'CLASS_CODE_REGENERATED',
      category: AUDIT_CATEGORIES.CLASSROOM,
      targetId: classroomId,
      metadata: { newCode }
    });
  }
  return res;
}

/**
 * Delete a classroom completely (including local storage & Supabase)
 */
export async function deleteClassroom(classroomId) {
  if (!classroomId) return { success: false, error: 'Thiếu mã ID lớp học' };

  const rawId = classroomId;
  const strId = String(classroomId).trim();

  // 1. Permanently record ID into deleted classrooms blacklist
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);
  if (!deletedIds.includes(rawId)) deletedIds.push(rawId);
  if (!deletedIds.includes(strId)) deletedIds.push(strId);
  setLocalItem(STORAGE_KEYS.DELETED_CLASSES, deletedIds);

  // 2. Always purge from local simulation store
  const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
  const updatedList = list.filter(c => c.id !== rawId && String(c.id) !== strId);
  setLocalItem(STORAGE_KEYS.CLASSROOMS, updatedList);

  // Clean up associated local records
  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  setLocalItem(STORAGE_KEYS.MEMBERS, members.filter(m => m.classroom_id !== rawId && String(m.classroom_id) !== strId));

  const asgs = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
  setLocalItem(STORAGE_KEYS.ASSIGNMENTS, asgs.filter(a => a.classroom_id !== rawId && String(a.classroom_id) !== strId));

  const anns = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
  setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, anns.filter(a => a.classroom_id !== rawId && String(a.classroom_id) !== strId));

  const mats = getLocalItem(STORAGE_KEYS.MATERIALS, []);
  setLocalItem(STORAGE_KEYS.MATERIALS, mats.filter(m => m.classroom_id !== rawId && String(m.classroom_id) !== strId));

  const subs = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
  setLocalItem(STORAGE_KEYS.SUBMISSIONS, subs.filter(s => s.classroom_id !== rawId && String(s.classroom_id) !== strId));

  // 3. If Supabase configured and valid UUID, delete from Supabase
  if (isSupabaseConfigured && supabase && isValidUuid(rawId)) {
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', rawId)
        .select();

      if (error) {
        console.warn('Supabase deleteClassroom notice:', error);
      }
      // If RLS blocked hard-delete (0 rows returned), attempt archiving to deactivate
      if (!error && Array.isArray(data) && data.length === 0) {
        await supabase
          .from('classrooms')
          .update({ status: 'archived' })
          .eq('id', rawId);
      }
    } catch (err) {
      console.warn('Supabase deleteClassroom catch:', err);
    }
  }

  recordAuditLog({
    action: 'CLASSROOM_DELETED',
    category: AUDIT_CATEGORIES.CLASSROOM,
    severity: AUDIT_SEVERITY.WARN,
    targetId: rawId
  });

  return { success: true, classroomId: rawId };
}

// ==========================================
// STUDENT JOIN & MEMBERSHIP APIS
// ==========================================

/**
 * Join class using class code
 * Calls PostgreSQL secure RPC join_class_by_code
 */
export async function joinClassByCode(classCode, currentUser) {
  ensureSimulationSeed();
  const { raw, codeWithPrefix, codeWithoutPrefix } = normalizeClassCode(classCode);
  const primaryCode = codeWithPrefix || raw;

  if (!primaryCode) {
    return { success: false, error: 'Vui lòng nhập mã lớp học.' };
  }

  if (!currentUser) {
    return { success: false, error: 'Vui lòng đăng nhập để tham gia lớp học.' };
  }

  const targetCodes = Array.from(new Set([codeWithPrefix, raw, codeWithoutPrefix].filter(Boolean)));

  // Supabase RPC implementation
  if (isSupabaseConfigured && supabase && isValidUuid(currentUser.uid || currentUser.id)) {
    try {
      const { data, error } = await supabase.rpc('join_class_by_code', {
        p_class_code: primaryCode
      });

      if (!error && data?.success) {
        // Also cache membership in local store so teacher & student see it immediately
        const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
        const targetCId = data.classroom_id;
        const studentId = currentUser.uid || currentUser.id;
        const exists = members.some(m => m.classroom_id === targetCId && m.student_id === studentId);
        const newMember = {
          id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          classroom_id: targetCId,
          student_id: studentId,
          student_name: currentUser.name || 'Học viên HanziGo',
          student_avatar: currentUser.avatar || null,
          student_email: currentUser.email || 'student@hanzigo.com',
          hsk_level: currentUser.level || data.hsk_level || 'HSK 1',
          joined_at: new Date().toISOString(),
          status: 'active',
          last_active: new Date().toISOString(),
          xp: currentUser.xp || 50,
          streak: currentUser.streak || 1,
          words_learned: currentUser.wordsLearned || 0,
          lessons_completed: 1,
          study_hours: 1.0
        };
        if (!exists) {
          setLocalItem(STORAGE_KEYS.MEMBERS, [newMember, ...members]);
        }
        if (typeof window !== 'undefined' && typeof fetch === 'function') {
          fetch('/api/classroom/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classroom_id: targetCId,
              class_code: primaryCode,
              student: newMember
            })
          }).catch(() => {});
        }
        return data;
      }

      // If error is about already joined or max students reached, return that specific error
      if (error && error.message?.includes('sĩ số tối đa')) {
        return { success: false, error: error.message };
      }
      if (error && error.message?.includes('đã là thành viên')) {
        const targetClass = await lookupClassroomByCode(primaryCode);
        return {
          success: true,
          already_joined: true,
          message: 'Bạn đã là thành viên của lớp học này!',
          classroom_id: targetClass?.id || null,
          name: targetClass?.name || 'Lớp học',
          hsk_level: targetClass?.hsk_level || 'HSK 1'
        };
      }
    } catch (err) {
      console.warn('RPC join_class_by_code notice, evaluating local mode:', err);
    }
  }

  // Look up target classroom across default, DB, server API, and local storage
  const targetClass = await lookupClassroomByCode(primaryCode);

  if (!targetClass) {
    return { success: false, error: 'Mã lớp không hợp lệ hoặc không tồn tại.' };
  }

  if (targetClass.status !== 'active') {
    return { success: false, error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' };
  }

  const userId = currentUser.uid || currentUser.id || 'user_guest';
  const isDemo = userId === 'user_guest' || userId === 'user_teacher_demo' || targetClass.teacher_id === 'user_teacher_demo' || targetClass.teacher_id === 'user_guest';
  if (!isDemo && targetClass.teacher_id === userId && currentUser.role === 'teacher') {
    return { success: false, error: 'Bạn là giáo viên phụ trách lớp này.' };
  }

  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const activeMembersInClass = members.filter(m => (m.classroom_id === targetClass.id || String(m.classroom_id) === String(targetClass.id)) && m.status === 'active');

  if (activeMembersInClass.length >= (targetClass.max_students || 30)) {
    return { success: false, error: `Lớp học đã đạt sĩ số tối đa (${targetClass.max_students} học viên).` };
  }

  const alreadyJoined = activeMembersInClass.some(m => m.student_id === userId && userId !== 'user_guest');
  if (alreadyJoined) {
    return { success: false, error: 'Bạn đã là thành viên của lớp học này rồi.' };
  }

  // Ensure unique student ID so multiple guests or demo users don't collide
  const effectiveStudentId = (userId && userId !== 'user_guest')
    ? userId
    : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newMember = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    classroom_id: targetClass.id,
    student_id: effectiveStudentId,
    student_name: currentUser.name || (currentUser.role === 'student' ? 'Học viên HanziGo' : 'Học viên mới'),
    student_avatar: currentUser.avatar || null,
    student_email: currentUser.email || 'student@hanzigo.com',
    hsk_level: currentUser.level || targetClass.hsk_level || 'HSK 1',
    joined_at: new Date().toISOString(),
    status: 'active',
    last_active: new Date().toISOString(),
    xp: currentUser.xp || 50,
    streak: currentUser.streak || 1,
    words_learned: currentUser.wordsLearned || 0,
    lessons_completed: 1,
    study_hours: 1.0
  };

  setLocalItem(STORAGE_KEYS.MEMBERS, [newMember, ...members]);

  // Synchronize join with shared server store
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      fetch('/api/classroom/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: targetClass.id,
          class_code: targetClass.class_code,
          student: newMember
        })
      }).catch(() => {});
    } catch {}
  }

  // Also ensure classroom is cached in local classrooms
  const localClasses = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
  if (!localClasses.some(c => c.id === targetClass.id || c.class_code === targetClass.class_code)) {
    setLocalItem(STORAGE_KEYS.CLASSROOMS, [targetClass, ...localClasses]);
  }

  return {
    success: true,
    message: 'Tham gia lớp học thành công!',
    classroom_id: targetClass.id,
    name: targetClass.name,
    hsk_level: targetClass.hsk_level
  };
}

/**
 * Fetch member list of a classroom
 * STUDENT PRIVACY ENFORCEMENT:
 * - Teacher chỉ được xem học sinh thuộc class của mình (nếu truyền requestingTeacherId).
 * - Không bao giờ expose password, auth tokens, secrets hay private metadata.
 */
export async function getClassMembers(classroomId, requestingTeacherId = null) {
  ensureSimulationSeed();
  if (!classroomId) return [];

  // Teacher Access Isolation: Teacher A cannot access students of Class B
  if (requestingTeacherId && requestingTeacherId !== 'user_admin') {
    const classroom = await getClassroomById(classroomId);
    if (!classroom) {
      return [];
    }
    const isOwner = classroom.teacher_id === requestingTeacherId;
    if (!isOwner) {
      console.warn(`[Student Privacy] Teacher ${requestingTeacherId} attempted unauthorized access to Class ${classroomId}`);
      return [];
    }
  }

  // Fetch members from shared server dev API (syncs members who joined from other tabs/browsers)
  let serverMembers = [];
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const sRes = await fetch(`/api/classroom/members?classroomId=${encodeURIComponent(classroomId)}`);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData?.members)) {
          serverMembers = sData.members;
          // Cache into local storage
          const allStored = getLocalItem(STORAGE_KEYS.MEMBERS, []);
          let updated = false;
          for (const sm of serverMembers) {
            if (!allStored.some(m => (m.classroom_id === sm.classroom_id || String(m.classroom_id) === String(sm.classroom_id)) && (m.student_id === sm.student_id || m.id === sm.id))) {
              allStored.unshift(sm);
              updated = true;
            }
          }
          if (updated) {
            setLocalItem(STORAGE_KEYS.MEMBERS, allStored);
          }
        }
      }
    } catch {}
  }

  const localMembers = getLocalItem(STORAGE_KEYS.MEMBERS, [])
    .filter(m => (m.classroom_id === classroomId || String(m.classroom_id) === String(classroomId)) && m.status === 'active');

  const combinedLocal = [...localMembers];
  for (const sm of serverMembers) {
    if (!combinedLocal.some(m => m.student_id === sm.student_id || m.id === sm.id)) {
      combinedLocal.push(sm);
    }
  }

  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    return combinedLocal.map(sanitizeStudentDataForTeacher);
  }

  try {
    const { data, error } = await supabase
      .from('class_members')
      .select('*, student:student_id(id, name, email, avatar, level, xp, streak, words_learned), profiles:student_id(id, name, email, avatar, level, xp, streak, words_learned)')
      .eq('classroom_id', classroomId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false });

    let dbMembers = [];
    if (!error && Array.isArray(data)) {
      dbMembers = data.map(m => {
        const prof = m.profiles || m.student || {};
        return {
          id: m.id,
          classroom_id: m.classroom_id,
          student_id: m.student_id,
          student_name: prof.name || m.student_name || 'Học viên',
          student_email: prof.email || m.student_email || '',
          student_avatar: prof.avatar || m.student_avatar || null,
          hsk_level: prof.level || m.hsk_level || 'HSK 1',
          joined_at: m.joined_at,
          status: m.status,
          xp: prof.xp ?? m.xp ?? 0,
          streak: prof.streak ?? m.streak ?? 0,
          words_learned: prof.words_learned ?? m.words_learned ?? 0
        };
      });
    }

    // Merge Supabase and local simulation members
    const merged = [...dbMembers];
    for (const lm of combinedLocal) {
      if (!merged.some(m => m.student_id === lm.student_id || m.id === lm.id)) {
        merged.push(lm);
      }
    }
    return merged.map(sanitizeStudentDataForTeacher);
  } catch (err) {
    console.warn('Supabase getClassMembers notice, fallback:', err);
    return combinedLocal.map(sanitizeStudentDataForTeacher);
  }
}

/**
 * Fetch all students across all classrooms taught by a teacher
 */
export async function getAllStudentsForTeacher(teacherId) {
  const classrooms = await getClassroomsForTeacher(teacherId);
  if (!classrooms || classrooms.length === 0) return [];

  const memberPromises = classrooms.map(c => getClassMembers(c.id));
  const memberLists = await Promise.all(memberPromises);

  const studentMap = new Map();
  memberLists.forEach((list, idx) => {
    const cls = classrooms[idx];
    (list || []).forEach(m => {
      const key = `${m.student_id}_${cls.id}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          ...m,
          classroom_id: cls.id,
          classroom_name: cls.name,
          classroom_code: cls.class_code,
          classroom_hsk: cls.hsk_level
        });
      }
    });
  });

  return Array.from(studentMap.values());
}

/**
 * Add a demo student to a classroom for testing & preview
 */
export async function addDemoStudent(classroomId, studentName = 'Nguyễn Minh Tuấn (Học viên thử nghiệm)') {
  ensureSimulationSeed();
  if (!classroomId) return { success: false, error: 'Thiếu mã lớp học' };

  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const studentId = `demo-stu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  const newMember = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    classroom_id: classroomId,
    student_id: studentId,
    student_name: studentName,
    student_avatar: null,
    student_email: `student_${Math.floor(Math.random() * 900 + 100)}@test.hanzigo.com`,
    hsk_level: 'HSK 2',
    joined_at: new Date().toISOString(),
    status: 'active',
    last_active: new Date().toISOString(),
    xp: 120,
    streak: 3,
    words_learned: 28,
    lessons_completed: 4,
    study_hours: 2.5
  };

  setLocalItem(STORAGE_KEYS.MEMBERS, [newMember, ...members]);

  // Synchronize with shared dev API
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      fetch('/api/classroom/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          student: newMember
        })
      }).catch(() => {});
    } catch {}
  }

  return { success: true, member: newMember };
}

/**
 * Fetch all classrooms a student has joined
 */
export async function getClassroomsForStudent(studentId) {
  ensureSimulationSeed();
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);

  if (!isSupabaseConfigured || !supabase || !isValidUuid(studentId)) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const studentMemberships = members.filter(m => (m.student_id === studentId || studentId === 'user_guest') && m.status === 'active');
    const classes = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const classIds = new Set(studentMemberships.map(m => m.classroom_id));
    let studentClasses = classes.filter(c => classIds.has(c.id) && !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
    // If student has no joined classes yet, default to foundation class so student portal is never blank
    if (studentClasses.length === 0 && classes.some(c => c.id === 'cls-hsk1-foundation')) {
      const fClass = classes.find(c => c.id === 'cls-hsk1-foundation');
      if (fClass && !deletedIds.includes(fClass.id)) {
        studentClasses = [fClass];
      }
    }
    return studentClasses;
  }

  try {
    const { data, error } = await supabase
      .from('class_members')
      .select('classroom:classroom_id(*, teacher:teacher_id(name, avatar))')
      .eq('student_id', studentId)
      .eq('status', 'active');

    if (error) throw error;
    const dbClasses = (data || []).map(item => item.classroom).filter(Boolean);

    // Merge with local simulation memberships
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const studentMemberships = members.filter(m => (m.student_id === studentId || studentId === 'user_guest') && m.status === 'active');
    const localClasses = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const localJoinedIds = new Set(studentMemberships.map(m => m.classroom_id));
    const merged = [...dbClasses];
    for (const lc of localClasses) {
      if (localJoinedIds.has(lc.id) && !merged.some(m => m.id === lc.id || m.class_code === lc.class_code)) {
        merged.push(lc);
      }
    }
    let studentClasses = merged.filter(c => c && !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
    if (studentClasses.length === 0) {
      const fClass = localClasses.find(c => c.id === 'cls-hsk1-foundation');
      if (fClass && !deletedIds.includes(fClass.id)) {
        studentClasses = [fClass];
      }
    }
    return studentClasses;
  } catch (err) {
    console.warn('Supabase getClassroomsForStudent notice, fallback:', err);
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const studentMemberships = members.filter(m => (m.student_id === studentId || studentId === 'user_guest') && m.status === 'active');
    const classes = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const classIds = new Set(studentMemberships.map(m => m.classroom_id));
    let studentClasses = classes.filter(c => classIds.has(c.id) && !deletedIds.includes(c.id) && !deletedIds.includes(String(c.id)));
    if (studentClasses.length === 0) {
      const fClass = classes.find(c => c.id === 'cls-hsk1-foundation');
      if (fClass && !deletedIds.includes(fClass.id)) {
        studentClasses = [fClass];
      }
    }
    return studentClasses;
  }
}

/**
 * Remove student from classroom
 */
export async function removeStudentFromClass(classroomId, studentId) {
  ensureSimulationSeed();
  if (!classroomId || !studentId) return { success: false, error: 'Thiếu thông tin học viên hoặc lớp' };

  // Always update in local simulation cache
  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const updated = members.map(m => {
    const matchClass = m.classroom_id === classroomId || String(m.classroom_id) === String(classroomId);
    const matchStudent = m.student_id === studentId || m.id === studentId;
    if (matchClass && matchStudent) {
      return { ...m, status: 'removed' };
    }
    return m;
  });
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);

  // Synchronize removal with shared dev server
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      fetch('/api/classroom/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          student_id: studentId
        })
      }).catch(() => {});
    } catch {}
  }

  recordAuditLog({
    action: 'STUDENT_REMOVED_FROM_CLASS',
    category: AUDIT_CATEGORIES.CLASSROOM,
    severity: AUDIT_SEVERITY.WARN,
    targetId: studentId,
    metadata: { classroomId }
  });

  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('class_members')
      .update({ status: 'removed' })
      .eq('classroom_id', classroomId)
      .eq('student_id', studentId);

    if (error) {
      console.warn('Supabase removeStudentFromClass notice:', error);
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase removeStudentFromClass catch:', err);
    return { success: true };
  }
}

/**
 * Remove all demo/test students from a classroom or all classrooms
 */
export async function clearDemoStudents(classroomId = null) {
  ensureSimulationSeed();
  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const updated = members.filter(m => {
    const isDemo = String(m.student_id).startsWith('demo-stu-') || (m.student_name && m.student_name.includes('thử nghiệm'));
    if (!isDemo) return true;
    if (classroomId && m.classroom_id !== classroomId && String(m.classroom_id) !== String(classroomId)) return true;
    return false; // delete demo student
  });
  setLocalItem(STORAGE_KEYS.MEMBERS, updated);
  return { success: true };
}

// ==========================================
// ASSIGNMENTS & SUBMISSIONS APIS
// ==========================================

/**
 * Fetch assignments for a classroom
 */
export async function getAssignmentsForClassroom(classroomId, isTeacher = false) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const assignments = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    return assignments.filter(a => {
      if (a.classroom_id !== classroomId) return false;
      return isTeacher || a.published !== false;
    });
  }

  try {
    let query = supabase
      .from('assignments')
      .select('*, assignment_submissions(count)')
      .eq('classroom_id', classroomId)
      .order('created_at', { ascending: false });

    if (!isTeacher) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(a => ({
      ...a,
      submission_count: a.assignment_submissions?.[0]?.count || 0
    }));
  } catch (err) {
    console.warn('Supabase getAssignmentsForClassroom notice, fallback:', err);
    const assignments = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    return assignments.filter(a => a.classroom_id === classroomId);
  }
}

/**
 * Create new assignment
 */
export async function createAssignment({
  classroomId,
  teacherId,
  title,
  description = '',
  contentType = 'Vocabulary',
  content = {},
  dueDate = null,
  published = true
}) {
  if (!teacherId) {
    return { success: false, error: 'Chỉ giáo viên phụ trách mới có quyền giao bài tập.' };
  }

  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const classrooms = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const targetClass = classrooms.find(c => c.id === classroomId);
    if (!targetClass && !classroomId?.startsWith('cls-demo-')) {
      return { success: false, error: 'Không tìm thấy lớp học.' };
    }
    if (targetClass && teacherId && targetClass.teacher_id && targetClass.teacher_id !== teacherId && teacherId !== 'admin') {
      return { success: false, error: 'Bạn không có quyền giao bài tập cho lớp học này.' };
    }

    const newAsg = {
      id: `asg-${Date.now()}`,
      classroom_id: classroomId,
      teacher_id: teacherId,
      title: title.trim(),
      description: description.trim(),
      content_type: contentType,
      content,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      published: Boolean(published),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const list = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    setLocalItem(STORAGE_KEYS.ASSIGNMENTS, [newAsg, ...list]);
    return { success: true, assignment: newAsg };
  }

  try {
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        classroom_id: classroomId,
        teacher_id: teacherId,
        title: title.trim(),
        description: description.trim(),
        content_type: contentType,
        content,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        published: Boolean(published)
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, assignment: data };
  } catch (err) {
    console.error('Supabase createAssignment error:', err);
    return { success: false, error: sanitizeUserErrorMessage(err, 'Lỗi khi giao bài tập cho lớp học.') };
  }
}

/**
 * Delete assignment
 */
export async function deleteAssignment(assignmentId, teacherId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(assignmentId)) {
    const list = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const targetAsg = list.find(a => a.id === assignmentId);
    if (!targetAsg) {
      return { success: false, error: 'Không tìm thấy bài tập cần xóa.' };
    }
    if (teacherId && targetAsg.teacher_id && targetAsg.teacher_id !== teacherId && teacherId !== 'admin') {
      return { success: false, error: 'Bạn không có quyền xóa bài tập của lớp học khác.' };
    }
    setLocalItem(STORAGE_KEYS.ASSIGNMENTS, list.filter(a => a.id !== assignmentId));
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase deleteAssignment error:', err);
    return { success: false, error: sanitizeUserErrorMessage(err, 'Lỗi khi xóa bài tập.') };
  }
}

/**
 * Auto-evaluate Quiz answers
 * Returns calculated score 0-100
 */
export function autoEvaluateQuiz(quizQuestions = [], studentAnswers = {}) {
  if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) return 100;

  let correctCount = 0;
  quizQuestions.forEach((q, idx) => {
    const key = q.id || `q${idx + 1}`;
    const selected = studentAnswers[key];
    if (selected !== undefined && Number(selected) === Number(q.correctIndex)) {
      correctCount++;
    }
  });

  return Math.round((correctCount / quizQuestions.length) * 100);
}

/**
 * Submit assignment (Student)
 */
export async function submitAssignment({
  assignmentId,
  studentId,
  studentName = 'Học viên',
  submissionData = {},
  assignmentInfo = null
}) {
  ensureSimulationSeed();

  // Check if auto-grading applies (Quiz)
  let autoScore = null;
  let status = 'submitted';
  let autoFeedback = '';

  if (assignmentInfo?.content_type === 'Quiz' && assignmentInfo?.content?.questions) {
    autoScore = autoEvaluateQuiz(assignmentInfo.content.questions, submissionData.answers || {});
    status = 'graded';
    autoFeedback = `Chấm điểm tự động trắc nghiệm: ${autoScore}/100.`;
  }

  // Check if late
  if (assignmentInfo?.due_date && new Date() > new Date(assignmentInfo.due_date) && status !== 'graded') {
    status = 'late';
  }

  if (!isSupabaseConfigured || !supabase || !isValidUuid(assignmentId)) {
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const existingIdx = list.findIndex(s => s.assignment_id === assignmentId && s.student_id === studentId);

    const submissionRecord = {
      id: existingIdx >= 0 ? list[existingIdx].id : `sub-${Date.now()}`,
      assignment_id: assignmentId,
      student_id: studentId,
      student_name: studentName,
      status,
      submission_data: submissionData,
      score: autoScore,
      feedback: autoFeedback,
      submitted_at: new Date().toISOString(),
      graded_at: autoScore !== null ? new Date().toISOString() : null,
      graded_by: autoScore !== null ? 'system_auto_grader' : null
    };

    if (existingIdx >= 0) {
      list[existingIdx] = submissionRecord;
    } else {
      list.unshift(submissionRecord);
    }

    setLocalItem(STORAGE_KEYS.SUBMISSIONS, list);
    return { success: true, submission: submissionRecord };
  }

  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        status,
        submission_data: submissionData,
        score: autoScore,
        feedback: autoFeedback,
        submitted_at: new Date().toISOString(),
        graded_at: autoScore !== null ? new Date().toISOString() : null,
        graded_by: autoScore !== null ? studentId : null
      }, { onConflict: 'assignment_id,student_id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, submission: data };
  } catch (err) {
    console.error('Supabase submitAssignment error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch student submission for an assignment
 */
export async function getStudentSubmission(assignmentId, studentId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(assignmentId)) {
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    return list.find(s => s.assignment_id === assignmentId && (s.student_id === studentId || studentId === 'user_guest')) || null;
  }

  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase getStudentSubmission notice, fallback:', err);
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    return list.find(s => s.assignment_id === assignmentId && s.student_id === studentId) || null;
  }
}

/**
 * Fetch all submissions across teacher's classrooms (for /teacher/grading hub)
 */
export async function getAllSubmissionsForTeacher(teacherId) {
  ensureSimulationSeed();
  const deletedIds = getLocalItem(STORAGE_KEYS.DELETED_CLASSES, []);

  if (!isSupabaseConfigured || !supabase || !isValidUuid(teacherId)) {
    const submissions = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const assignments = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const classrooms = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);

    const asgMap = new Map(assignments.map(a => [a.id, a]));
    const clsMap = new Map(classrooms.map(c => [c.id, c]));

    return submissions
      .filter(sub => {
        const asg = asgMap.get(sub.assignment_id);
        const cid = sub.classroom_id || asg?.classroom_id;
        return !deletedIds.includes(cid) && !deletedIds.includes(String(cid));
      })
      .map(sub => {
        const asg = asgMap.get(sub.assignment_id) || {};
        const cls = clsMap.get(asg.classroom_id) || {};
        return {
          ...sub,
          assignment_title: asg.title || 'Bài tập',
          content_type: asg.content_type || 'General',
          classroom_name: cls.name || 'Lớp học',
          classroom_id: cls.id,
          due_date: asg.due_date
        };
      });
  }

  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select(`
        *,
        student:student_id(id, name, email, avatar),
        assignment:assignment_id(
          id, title, content_type, due_date, classroom_id,
          classroom:classroom_id(id, name, teacher_id)
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter(item => {
        const cid = item.assignment?.classroom_id || item.assignment?.classroom?.id;
        return (
          item.assignment?.classroom?.teacher_id === teacherId &&
          !deletedIds.includes(cid) &&
          !deletedIds.includes(String(cid))
        );
      })
      .map(item => ({
        id: item.id,
        assignment_id: item.assignment_id,
        student_id: item.student_id,
        student_name: item.student?.name || 'Học viên',
        student_avatar: item.student?.avatar || null,
        student_email: item.student?.email || '',
        assignment_title: item.assignment?.title || 'Bài tập',
        content_type: item.assignment?.content_type || 'General',
        classroom_name: item.assignment?.classroom?.name || 'Lớp học',
        classroom_id: item.assignment?.classroom?.id,
        due_date: item.assignment?.due_date,
        status: item.status,
        score: item.score,
        feedback: item.feedback,
        submission_data: item.submission_data,
        submitted_at: item.submitted_at,
        graded_at: item.graded_at
      }));
  } catch (err) {
    console.warn('Supabase getAllSubmissionsForTeacher notice, fallback:', err);
    purgeMockUsers();
    const submissions = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const assignments = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const classrooms = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);

    const asgMap = new Map(assignments.map(a => [a.id, a]));
    const clsMap = new Map(classrooms.map(c => [c.id, c]));

    return submissions.map(sub => {
      const asg = asgMap.get(sub.assignment_id) || {};
      const cls = clsMap.get(asg.classroom_id) || {};
      return {
        ...sub,
        assignment_title: asg.title || 'Bài tập',
        content_type: asg.content_type || 'General',
        classroom_name: cls.name || 'Lớp học',
        classroom_id: cls.id,
        due_date: asg.due_date
      };
    });
  }
}

/**
 * Delete a student submission (Teacher)
 */
export async function deleteSubmission(submissionId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(submissionId)) {
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const updated = list.filter(s => s.id !== submissionId);
    setLocalItem(STORAGE_KEYS.SUBMISSIONS, updated);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('assignment_submissions')
      .delete()
      .eq('id', submissionId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase deleteSubmission error:', err);
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const updated = list.filter(s => s.id !== submissionId);
    setLocalItem(STORAGE_KEYS.SUBMISSIONS, updated);
    return { success: true };
  }
}

/**
 * Grade a student submission (Teacher)
 */
export async function gradeSubmission({
  submissionId,
  score,
  feedback = '',
  teacherId
}) {
  ensureSimulationSeed();
  const parsedScore = Math.min(100, Math.max(0, Number(score) || 0));

  if (!isSupabaseConfigured || !supabase || !isValidUuid(submissionId)) {
    const list = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const targetSub = list.find(s => s.id === submissionId);
    if (!targetSub) {
      return { success: false, error: 'Không tìm thấy bài nộp cần chấm điểm.' };
    }

    // Authorization check: verify teacher owns this classroom
    const assignments = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const asg = assignments.find(a => a.id === targetSub.assignment_id);
    if (asg) {
      const classrooms = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
      const cls = classrooms.find(c => c.id === asg.classroom_id);
      if (cls && teacherId && cls.teacher_id && cls.teacher_id !== teacherId && teacherId !== 'admin') {
        recordAuditLog({
          action: 'SECURITY_CROSS_TEACHER_TAMPER',
          category: AUDIT_CATEGORIES.SECURITY,
          severity: AUDIT_SEVERITY.SECURITY_ALERT,
          actorId: teacherId,
          targetId: submissionId,
          metadata: { classroomId: cls.id, reason: 'Cross-teacher grading attempt blocked' }
        });
        return { success: false, error: 'Bạn không có quyền chấm điểm bài tập của lớp học khác.' };
      }
    }

    const updated = list.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          score: parsedScore,
          feedback: feedback.trim(),
          status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: teacherId
        };
      }
      return s;
    });
    setLocalItem(STORAGE_KEYS.SUBMISSIONS, updated);
    const gradedItem = updated.find(s => s.id === submissionId);

    recordAuditLog({
      action: 'SUBMISSION_GRADED',
      category: AUDIT_CATEGORIES.ASSIGNMENT,
      severity: AUDIT_SEVERITY.INFO,
      actorId: teacherId,
      targetId: submissionId,
      metadata: { score: parsedScore, hasFeedback: Boolean(feedback.trim()) }
    });

    return { success: true, submission: gradedItem };
  }

  try {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .update({
        score: parsedScore,
        feedback: feedback.trim(),
        status: 'graded',
        graded_at: new Date().toISOString(),
        graded_by: teacherId
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;

    recordAuditLog({
      action: 'SUBMISSION_GRADED',
      category: AUDIT_CATEGORIES.ASSIGNMENT,
      severity: AUDIT_SEVERITY.INFO,
      actorId: teacherId,
      targetId: submissionId,
      metadata: { score: parsedScore, hasFeedback: Boolean(feedback.trim()) }
    });

    return { success: true, submission: data };
  } catch (err) {
    console.error('Supabase gradeSubmission error:', err);
    return { success: false, error: sanitizeUserErrorMessage(err, 'Lỗi khi chấm điểm bài nộp.') };
  }
}

// ==========================================
// ANNOUNCEMENTS & MATERIALS APIS
// ==========================================

export async function getAnnouncementsForClassroom(classroomId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const list = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
    return list
      .filter(a => a.classroom_id === classroomId)
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.created_at) - new Date(a.created_at));
  }

  try {
    const { data, error } = await supabase
      .from('class_announcements')
      .select('*, teacher:teacher_id(name, avatar)')
      .eq('classroom_id', classroomId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase getAnnouncementsForClassroom notice, fallback:', err);
    const list = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
    return list.filter(a => a.classroom_id === classroomId);
  }
}

export async function createAnnouncement({
  classroomId,
  teacherId,
  title,
  content,
  pinned = false
}) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const newAnn = {
      id: `ann-${Date.now()}`,
      classroom_id: classroomId,
      teacher_id: teacherId,
      title: title.trim(),
      content: content.trim(),
      pinned: Boolean(pinned),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const list = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
    setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, [newAnn, ...list]);
    return { success: true, announcement: newAnn };
  }

  try {
    const { data, error } = await supabase
      .from('class_announcements')
      .insert({
        classroom_id: classroomId,
        teacher_id: teacherId,
        title: title.trim(),
        content: content.trim(),
        pinned: Boolean(pinned)
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, announcement: data };
  } catch (err) {
    console.error('Supabase createAnnouncement error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteAnnouncement(announcementId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(announcementId)) {
    const list = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
    setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, list.filter(a => a.id !== announcementId));
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('class_announcements')
      .delete()
      .eq('id', announcementId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase deleteAnnouncement error:', err);
    return { success: false, error: err.message };
  }
}

export async function getMaterialsForClassroom(classroomId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const list = getLocalItem(STORAGE_KEYS.MATERIALS, []);
    return list.filter(m => m.classroom_id === classroomId);
  }

  try {
    const { data, error } = await supabase
      .from('class_materials')
      .select('*, teacher:teacher_id(name)')
      .eq('classroom_id', classroomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase getMaterialsForClassroom notice, fallback:', err);
    const list = getLocalItem(STORAGE_KEYS.MATERIALS, []);
    return list.filter(m => m.classroom_id === classroomId);
  }
}

export async function uploadClassMaterial({
  classroomId,
  teacherId,
  title,
  description = '',
  fileUrl,
  fileType = 'pdf'
}) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const newMat = {
      id: `mat-${Date.now()}`,
      classroom_id: classroomId,
      teacher_id: teacherId,
      title: title.trim(),
      description: description.trim(),
      file_url: fileUrl.trim(),
      file_type: fileType,
      created_at: new Date().toISOString()
    };
    const list = getLocalItem(STORAGE_KEYS.MATERIALS, []);
    setLocalItem(STORAGE_KEYS.MATERIALS, [newMat, ...list]);
    return { success: true, material: newMat };
  }

  try {
    const { data, error } = await supabase
      .from('class_materials')
      .insert({
        classroom_id: classroomId,
        teacher_id: teacherId,
        title: title.trim(),
        description: description.trim(),
        file_url: fileUrl.trim(),
        file_type: fileType
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, material: data };
  } catch (err) {
    console.error('Supabase uploadClassMaterial error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteClassMaterial(materialId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(materialId)) {
    const list = getLocalItem(STORAGE_KEYS.MATERIALS, []);
    setLocalItem(STORAGE_KEYS.MATERIALS, list.filter(m => m.id !== materialId));
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('class_materials')
      .delete()
      .eq('id', materialId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase deleteClassMaterial error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to realtime classroom updates (assignments, announcements, materials, sessions, members)
 */
export function subscribeToClassroomRealtime(classroomId, onEvent) {
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId) || typeof onEvent !== 'function') {
    return () => {};
  }

  try {
    const channel = supabase
      .channel(`classroom_live_sync_${classroomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assignments', filter: `classroom_id=eq.${classroomId}` },
        (payload) => onEvent({ type: 'ASSIGNMENT', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_announcements', filter: `classroom_id=eq.${classroomId}` },
        (payload) => onEvent({ type: 'ANNOUNCEMENT', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_sessions', filter: `classroom_id=eq.${classroomId}` },
        (payload) => onEvent({ type: 'SESSION', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_materials', filter: `classroom_id=eq.${classroomId}` },
        (payload) => onEvent({ type: 'MATERIAL', payload })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_members', filter: `classroom_id=eq.${classroomId}` },
        (payload) => onEvent({ type: 'MEMBER', payload })
      )
      .subscribe((status, err) => {
        if (err) console.warn(`Classroom Realtime error [${classroomId}]:`, err);
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error removing classroom realtime channel:', e);
      }
    };
  } catch (err) {
    console.warn('subscribeToClassroomRealtime init error:', err);
    return () => {};
  }
}

/**
 * Subscribe to realtime student assignment submissions for teacher
 */
export function subscribeToTeacherSubmissionsRealtime(onEvent) {
  if (!isSupabaseConfigured || !supabase || typeof onEvent !== 'function') {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('teacher_submissions_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assignment_submissions' },
        (payload) => onEvent({ type: 'SUBMISSION', payload })
      )
      .subscribe((status, err) => {
        if (err) console.warn('Teacher Submissions Realtime error:', err);
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error removing teacher submissions channel:', e);
      }
    };
  } catch (err) {
    console.warn('subscribeToTeacherSubmissionsRealtime init error:', err);
    return () => {};
  }
}

