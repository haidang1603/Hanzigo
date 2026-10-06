import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';

// Keys for local simulation storage fallback
const STORAGE_KEYS = {
  CLASSROOMS: 'hanzigo_classrooms_store',
  MEMBERS: 'hanzigo_class_members_store',
  ASSIGNMENTS: 'hanzigo_assignments_store',
  SUBMISSIONS: 'hanzigo_submissions_store',
  ANNOUNCEMENTS: 'hanzigo_announcements_store',
  MATERIALS: 'hanzigo_class_materials_store',
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

// Automatically purge any fake/mock student accounts and demo submissions
function purgeMockUsers() {
  const mockStudentIds = ['stu-nguyen-an', 'stu-tran-mai', 'stu-le-hoang'];
  const mockNames = ['Nguyễn Văn An', 'Trần Tuyết Mai', 'Lê Huy Hoàng'];
  const mockSubIds = ['sub-1', 'sub-2', 'sub-3'];

  try {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const cleanMembers = members.filter(m => 
      !mockStudentIds.includes(m.student_id) && 
      !mockNames.includes(m.student_name)
    );
    if (cleanMembers.length !== members.length) {
      setLocalItem(STORAGE_KEYS.MEMBERS, cleanMembers);
    }

    const subs = getLocalItem(STORAGE_KEYS.SUBMISSIONS, []);
    const cleanSubs = subs.filter(s => 
      !mockSubIds.includes(s.id) &&
      !mockStudentIds.includes(s.student_id) && 
      !mockNames.includes(s.student_name)
    );
    if (cleanSubs.length !== subs.length) {
      setLocalItem(STORAGE_KEYS.SUBMISSIONS, cleanSubs);
    }
  } catch {}
}

// Initial mock seed for simulation mode
function ensureSimulationSeed() {
  purgeMockUsers();

  const existingClasses = getLocalItem(STORAGE_KEYS.CLASSROOMS, null);
  if (existingClasses && existingClasses.length > 0) return;

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

  // No mock students by default - genuine clean slate
  const defaultMembers = [];

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

  setLocalItem(STORAGE_KEYS.CLASSROOMS, defaultClasses);
  setLocalItem(STORAGE_KEYS.MEMBERS, defaultMembers);
  setLocalItem(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
  setLocalItem(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
  setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, defaultAnnouncements);
  setLocalItem(STORAGE_KEYS.MATERIALS, defaultMaterials);
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
  const merged = [...dbClasses];
  
  for (const lc of localList) {
    const isOwner = lc.teacher_id === effectiveTeacherId || 
                    lc.teacher_id === teacherId || 
                    lc.teacher_id === 'user_teacher_demo' ||
                    teacherId === 'user_teacher_demo';
    if (isOwner && !merged.some(m => m.id === lc.id || m.class_code === lc.class_code)) {
      merged.push({
        ...lc,
        student_count: lc.student_count || 0
      });
    }
  }

  return merged;
}

/**
 * Fetch single classroom by ID
 */
export async function getClassroomById(classroomId) {
  ensureSimulationSeed();
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
  const cleanCode = (classCode || '').trim().toUpperCase();
  if (!cleanCode) return null;

  if (!isSupabaseConfigured || !supabase) {
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const found = list.find(c => c.class_code.toUpperCase() === cleanCode);
    if (!found) return null;
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const memberCount = members.filter(m => m.classroom_id === found.id && m.status === 'active').length;
    return {
      ...found,
      teacher_name: 'Giáo viên HanziGo',
      student_count: memberCount
    };
  }

  try {
    const { data, error } = await supabase
      .from('classrooms')
      .select('id, name, description, hsk_level, class_code, max_students, status, teacher:teacher_id(name, avatar), class_members(count)')
      .ilike('class_code', cleanCode)
      .maybeSingle();

    if (error || !data) return null;
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
  } catch (err) {
    console.warn('Supabase lookupClassroomByCode notice:', err);
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    return list.find(c => c.class_code.toUpperCase() === cleanCode) || null;
  }
}

/**
 * Create a new classroom
 */
export async function createClassroom({
  teacherId,
  name,
  description = '',
  hskLevel = 'HSK 1',
  maxStudents = 30
}) {
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

  if (!isSupabaseConfigured || !supabase || !isValidUuid(effectiveTeacherId)) {
    const newClass = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      teacher_id: effectiveTeacherId,
      name: name.trim(),
      description: description.trim(),
      hsk_level: hskLevel,
      class_code: code,
      max_students: parsedMaxStudents,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
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
      const newClass = {
        id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        teacher_id: effectiveTeacherId,
        name: name.trim(),
        description: description.trim(),
        hsk_level: hskLevel,
        class_code: code,
        max_students: parsedMaxStudents,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
      setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
      return { success: true, classroom: newClass };
    }

    if (data) {
      const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
      if (!list.some(c => c.id === data.id || c.class_code === data.class_code)) {
        setLocalItem(STORAGE_KEYS.CLASSROOMS, [data, ...list]);
      }
    }
    return { success: true, classroom: data };
  } catch (err) {
    console.warn('Supabase createClassroom fallback:', err);
    const newClass = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      teacher_id: effectiveTeacherId,
      name: name.trim(),
      description: description.trim(),
      hsk_level: hskLevel,
      class_code: code,
      max_students: parsedMaxStudents,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    setLocalItem(STORAGE_KEYS.CLASSROOMS, [newClass, ...list]);
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
  allowed.updated_at = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const updatedList = list.map(c => c.id === classroomroomId ? { ...c, ...allowed } : c);
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
  return await updateClassroom(classroomId, { class_code: newCode });
}

/**
 * Delete a classroom completely (including local storage & Supabase)
 */
export async function deleteClassroom(classroomId) {
  ensureSimulationSeed();
  if (!classroomId) return { success: false, error: 'Thiếu mã ID lớp học' };

  // 1. Always purge from local simulation store
  const list = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
  const updatedList = list.filter(c => c.id !== classroomId);
  setLocalItem(STORAGE_KEYS.CLASSROOMS, updatedList);

  // Clean up associated local records
  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  setLocalItem(STORAGE_KEYS.MEMBERS, members.filter(m => m.classroom_id !== classroomId));

  const asgs = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
  setLocalItem(STORAGE_KEYS.ASSIGNMENTS, asgs.filter(a => a.classroom_id !== classroomId));

  const anns = getLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, []);
  setLocalItem(STORAGE_KEYS.ANNOUNCEMENTS, anns.filter(a => a.classroom_id !== classroomId));

  const mats = getLocalItem(STORAGE_KEYS.MATERIALS, []);
  setLocalItem(STORAGE_KEYS.MATERIALS, mats.filter(m => m.classroom_id !== classroomId));

  // 2. If Supabase configured and valid UUID, delete from Supabase (cascades automatically to related tables)
  if (isSupabaseConfigured && supabase && isValidUuid(classroomId)) {
    try {
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', classroomId);

      if (error) {
        console.warn('Supabase deleteClassroom notice:', error);
      }
    } catch (err) {
      console.warn('Supabase deleteClassroom catch:', err);
    }
  }

  return { success: true };
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
  const cleanCode = (classCode || '').trim().toUpperCase();

  if (!cleanCode) {
    return { success: false, error: 'Vui lòng nhập mã lớp học.' };
  }

  if (!currentUser) {
    return { success: false, error: 'Vui lòng đăng nhập để tham gia lớp học.' };
  }

  // Supabase RPC implementation
  if (isSupabaseConfigured && supabase && isValidUuid(currentUser.uid || currentUser.id)) {
    try {
      const { data, error } = await supabase.rpc('join_class_by_code', {
        p_class_code: cleanCode
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return data;
    } catch (err) {
      console.warn('RPC join_class_by_code error, evaluating local mode:', err);
      // Fallback to local evaluation if network or offline
    }
  }

  // Local simulation implementation
  const classes = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
  const targetClass = classes.find(c => (c.class_code || '').toUpperCase() === cleanCode);

  if (!targetClass) {
    return { success: false, error: 'Mã lớp không hợp lệ hoặc không tồn tại.' };
  }

  if (targetClass.status !== 'active') {
    return { success: false, error: 'Lớp học hiện tại đã đóng hoặc lưu trữ.' };
  }

  const userId = currentUser.uid || currentUser.id || 'user_guest';
  if (targetClass.teacher_id === userId) {
    return { success: false, error: 'Bạn là giáo viên phụ trách lớp này.' };
  }

  const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
  const activeMembersInClass = members.filter(m => m.classroom_id === targetClass.id && m.status === 'active');

  if (activeMembersInClass.length >= (targetClass.max_students || 30)) {
    return { success: false, error: `Lớp học đã đạt sĩ số tối đa (${targetClass.max_students} học viên).` };
  }

  const alreadyJoined = activeMembersInClass.some(m => m.student_id === userId);
  if (alreadyJoined) {
    return { success: false, error: 'Bạn đã là thành viên của lớp học này rồi.' };
  }

  const newMember = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    classroom_id: targetClass.id,
    student_id: userId,
    student_name: currentUser.name || 'Học viên HanziGo',
    student_avatar: currentUser.avatar || null,
    student_email: currentUser.email || 'student@hanzigo.com',
    hsk_level: currentUser.level || targetClass.hsk_level,
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
 */
export async function getClassMembers(classroomId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    return members.filter(m => m.classroom_id === classroomId && m.status === 'active');
  }

  try {
    const { data, error } = await supabase
      .from('class_members')
      .select('*, student:student_id(id, name, email, avatar, level, xp, streak, words_learned)')
      .eq('classroom_id', classroomId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(m => ({
      id: m.id,
      classroom_id: m.classroom_id,
      student_id: m.student_id,
      student_name: m.student?.name || 'Học viên',
      student_email: m.student?.email || '',
      student_avatar: m.student?.avatar || null,
      hsk_level: m.student?.level || 'HSK 1',
      joined_at: m.joined_at,
      status: m.status,
      xp: m.student?.xp || 0,
      streak: m.student?.streak || 0,
      words_learned: m.student?.words_learned || 0
    }));
  } catch (err) {
    console.warn('Supabase getClassMembers notice, fallback:', err);
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    return members.filter(m => m.classroom_id === classroomId && m.status === 'active');
  }
}

/**
 * Fetch all classrooms a student has joined
 */
export async function getClassroomsForStudent(studentId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(studentId)) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const studentMemberships = members.filter(m => (m.student_id === studentId || studentId === 'user_guest') && m.status === 'active');
    const classes = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const classIds = new Set(studentMemberships.map(m => m.classroom_id));
    return classes.filter(c => classIds.has(c.id));
  }

  try {
    const { data, error } = await supabase
      .from('class_members')
      .select('classroom:classroom_id(*, teacher:teacher_id(name, avatar))')
      .eq('student_id', studentId)
      .eq('status', 'active');

    if (error) throw error;
    return (data || []).map(item => item.classroom).filter(Boolean);
  } catch (err) {
    console.warn('Supabase getClassroomsForStudent notice, fallback:', err);
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const studentMemberships = members.filter(m => (m.student_id === studentId || studentId === 'user_guest') && m.status === 'active');
    const classes = getLocalItem(STORAGE_KEYS.CLASSROOMS, []);
    const classIds = new Set(studentMemberships.map(m => m.classroom_id));
    return classes.filter(c => classIds.has(c.id));
  }
}

/**
 * Remove student from classroom
 */
export async function removeStudentFromClass(classroomId, studentId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, []);
    const updated = members.map(m => {
      if (m.classroom_id === classroomId && m.student_id === studentId) {
        return { ...m, status: 'removed' };
      }
      return m;
    });
    setLocalItem(STORAGE_KEYS.MEMBERS, updated);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('class_members')
      .update({ status: 'removed' })
      .eq('classroom_id', classroomId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Supabase removeStudentFromClass error:', err);
    return { success: false, error: err.message };
  }
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
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(classroomId)) {
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
    return { success: false, error: err.message };
  }
}

/**
 * Delete assignment
 */
export async function deleteAssignment(assignmentId) {
  ensureSimulationSeed();
  if (!isSupabaseConfigured || !supabase || !isValidUuid(assignmentId)) {
    const list = getLocalItem(STORAGE_KEYS.ASSIGNMENTS, []);
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
    return { success: false, error: err.message };
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
  if (!isSupabaseConfigured || !supabase || !isValidUuid(teacherId)) {
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
      .filter(item => item.assignment?.classroom?.teacher_id === teacherId)
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
    return { success: true };
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
    return { success: true, submission: data };
  } catch (err) {
    console.error('Supabase gradeSubmission error:', err);
    return { success: false, error: err.message };
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
