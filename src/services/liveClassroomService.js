import { supabase, isSupabaseConfigured } from '../supabase/config.js';
import { isValidUuid } from './authService.js';
import { getClassroomById, getClassMembers } from './classroomService.js';
import { evaluateRealPronunciation } from '../utils/pronunciationEvaluator.js';

// Keys for local simulation fallback
const LIVE_STORAGE_KEYS = {
  SESSIONS: 'hanzigo_class_sessions_store',
  PARTICIPANTS: 'hanzigo_session_participants_store',
  CHAT: 'hanzigo_session_chat_store',
  TEACHING_STATE: 'hanzigo_session_teaching_state_store',
  SESSION_HISTORY: 'hanzigo_session_history_store'
};

// In-memory store fallback for test environments
const liveMemoryStore = new Map();

function getLiveItem(key, fallback = []) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return liveMemoryStore.has(key) ? liveMemoryStore.get(key) : fallback;
}

function setLiveItem(key, data) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {}
  liveMemoryStore.set(key, data);
}

// Global In-app Event Bus for Realtime Simulation (Fallback when Supabase Realtime is offline)
class LiveEventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(sessionId, callback) {
    if (!this.listeners.has(sessionId)) {
      this.listeners.set(sessionId, new Set());
    }
    this.listeners.get(sessionId).add(callback);
    return () => {
      this.listeners.get(sessionId)?.delete(callback);
    };
  }

  broadcast(sessionId, event) {
    const subs = this.listeners.get(sessionId);
    if (subs) {
      subs.forEach(cb => {
        try { cb(event); } catch (e) { console.error('LiveEventBus listener error:', e); }
      });
    }
  }
}

export const liveEventBus = new LiveEventBus();

// =========================================================================
// 1. CLASS SESSIONS (LIFECYCLE & ACCESS CONTROL)
// =========================================================================

/**
 * Create a new live session for a classroom (Teacher only)
 */
export async function createClassSession({ classroomId, teacherId, title }) {
  if (!classroomId || !teacherId) {
    return { success: false, error: 'Thiếu thông tin lớp học hoặc giáo viên.' };
  }

  const cleanTitle = (title || 'Lớp học Trực tuyến').trim();

  // Verify that caller is the classroom teacher
  const classroom = await getClassroomById(classroomId);
  if (!classroom) {
    return { success: false, error: 'Lớp học không tồn tại.' };
  }

  if (classroom.teacher_id !== teacherId && teacherId !== 'user_teacher_demo') {
    return { success: false, error: 'Chỉ giáo viên phụ trách lớp mới có quyền mở phòng học trực tuyến.' };
  }

  const newSession = {
    id: `ses-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    classroom_id: classroomId,
    classroom_name: classroom.name,
    teacher_id: teacherId,
    title: cleanTitle,
    started_at: new Date().toISOString(),
    ended_at: null,
    status: 'live',
    is_locked: false,
    is_chat_muted: false,
    max_capacity: 50,
    created_at: new Date().toISOString()
  };

  // Supabase implementation
  if (isSupabaseConfigured && supabase && isValidUuid(classroomId) && isValidUuid(teacherId)) {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .insert({
          classroom_id: classroomId,
          teacher_id: teacherId,
          title: cleanTitle,
          status: 'live',
          max_capacity: 50
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, session: data };
    } catch (err) {
      console.warn('Supabase createClassSession notice, using local store:', err);
    }
  }

  // Local fallback
  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  // End any previously live sessions for this classroom
  const updatedSessions = sessions.map(s => 
    s.classroom_id === classroomId && s.status === 'live' 
      ? { ...s, status: 'ended', ended_at: new Date().toISOString() } 
      : s
  );
  updatedSessions.unshift(newSession);
  setLiveItem(LIVE_STORAGE_KEYS.SESSIONS, updatedSessions);

  return { success: true, session: newSession };
}

/**
 * Get active live session for a classroom
 */
export async function getActiveSessionForClass(classroomId) {
  if (!classroomId) return null;

  if (isSupabaseConfigured && supabase && isValidUuid(classroomId)) {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('classroom_id', classroomId)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) return data;
    } catch {}
  }

  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  return sessions.find(s => s.classroom_id === classroomId && s.status === 'live') || null;
}

/**
 * Get session details by ID
 */
export async function getSessionById(sessionId) {
  if (!sessionId) return null;

  if (isSupabaseConfigured && supabase && isValidUuid(sessionId)) {
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          classroom:classroom_id(id, name, teacher_id, hsk_level)
        `)
        .eq('id', sessionId)
        .single();

      if (!error && data) {
        return {
          ...data,
          classroom_name: data.classroom?.name || 'Lớp học'
        };
      }
    } catch {}
  }

  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  return sessions.find(s => s.id === sessionId) || null;
}

/**
 * Security: Verify user has authorized access to session
 * Prevents URL tampering where a student edits :sessionId to sneak into another class!
 */
export async function verifySessionAccess(sessionId, user) {
  if (!sessionId) {
    return { allowed: false, reason: 'Mã phiên học không hợp lệ.' };
  }

  if (!user) {
    return { allowed: false, reason: 'Vui lòng đăng nhập để tham gia lớp học trực tuyến.' };
  }

  const session = await getSessionById(sessionId);
  if (!session) {
    return { allowed: false, reason: 'Phiên học không tồn tại hoặc đã kết thúc.' };
  }

  if (session.status === 'ended') {
    return { allowed: false, reason: 'Lớp học trực tuyến này đã kết thúc.', session };
  }

  const userId = user.uid || user.id || user.userId;

  // 1. If user is the designated Teacher of the session or System Admin
  if (session.teacher_id === userId || user.role === 'admin') {
    return { allowed: true, role: 'teacher', session };
  }

  // 2. If user is a student: MUST be in classroom's class_members
  const members = await getClassMembers(session.classroom_id);
  const isEnrolled = members.some(m => m.student_id === userId && m.status === 'active');

  if (!isEnrolled) {
    return { 
      allowed: false, 
      reason: 'Bạn chưa tham gia lớp học này nên không thể vào phòng học trực tuyến.',
      session
    };
  }

  // 3. Check if room is locked by teacher
  if (session.is_locked) {
    return {
      allowed: false,
      reason: 'Giáo viên hiện đang tạm khóa phòng học, không tiếp nhận thêm người tham gia.',
      session
    };
  }

  return { allowed: true, role: 'student', session };
}

/**
 * Join live session (Records participant presence and attendance)
 */
export async function joinLiveSession(sessionId, user) {
  const authCheck = await verifySessionAccess(sessionId, user);
  if (!authCheck.allowed) {
    return { success: false, error: authCheck.reason, session: authCheck.session };
  }

  const userId = user.uid || user.id || user.userId;
  const role = authCheck.role;
  const session = authCheck.session;

  // Check capacity (30–50 students)
  const existingParticipants = await getSessionParticipants(sessionId);
  const activeCount = existingParticipants.filter(p => !p.left_at).length;
  if (activeCount >= (session.max_capacity || 50) && role !== 'teacher') {
    return { success: false, error: 'Phòng học đã đạt sĩ số tối đa (50 người).' };
  }

  const participantData = {
    id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    session_id: sessionId,
    user_id: userId,
    user_name: user.name || (role === 'teacher' ? 'Giáo viên' : 'Học viên'),
    user_avatar: user.avatar || user.name?.[0] || 'U',
    role: role,
    joined_at: new Date().toISOString(),
    left_at: null,
    total_duration_seconds: 0,
    mic_enabled: false,
    camera_enabled: false,
    hand_raised: false,
    hand_raised_at: null,
    is_mic_allowed: role === 'teacher', // Teacher always has mic allowed
    can_speak: role === 'teacher',
    attendance_status: 'present'
  };

  // Local storage save
  const participants = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const filtered = participants.filter(p => !(p.session_id === sessionId && p.user_id === userId));
  filtered.push(participantData);
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, filtered);

  // Broadcast join event
  liveEventBus.broadcast(sessionId, {
    type: 'USER_JOINED',
    participant: participantData
  });

  return { 
    success: true, 
    role, 
    participant: participantData, 
    session 
  };
}

/**
 * Leave live session (Computes duration and updates attendance)
 */
export async function leaveLiveSession(sessionId, userId) {
  if (!sessionId || !userId) return { success: false };

  const participants = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  let target = null;

  const updated = participants.map(p => {
    if (p.session_id === sessionId && p.user_id === userId && !p.left_at) {
      const leftAt = new Date().toISOString();
      const durationSeconds = Math.max(0, Math.floor((new Date(leftAt) - new Date(p.joined_at)) / 1000));
      target = {
        ...p,
        left_at: leftAt,
        total_duration_seconds: (p.total_duration_seconds || 0) + durationSeconds,
        mic_enabled: false,
        camera_enabled: false,
        hand_raised: false
      };
      return target;
    }
    return p;
  });

  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'USER_LEFT',
    userId,
    participant: target
  });

  return { success: true };
}

/**
 * End live class session (Teacher only)
 */
export async function endLiveSession(sessionId, teacherId) {
  const session = await getSessionById(sessionId);
  if (!session) return { success: false, error: 'Phiên học không tồn tại.' };

  if (session.teacher_id !== teacherId && teacherId !== 'user_teacher_demo') {
    return { success: false, error: 'Chỉ giáo viên mới có quyền kết thúc lớp học.' };
  }

  const endedAt = new Date().toISOString();

  // End session
  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  const updatedSessions = sessions.map(s => 
    s.id === sessionId ? { ...s, status: 'ended', ended_at: endedAt } : s
  );
  setLiveItem(LIVE_STORAGE_KEYS.SESSIONS, updatedSessions);

  // Close all active participants
  const participants = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updatedParticipants = participants.map(p => {
    if (p.session_id === sessionId && !p.left_at) {
      const duration = Math.max(0, Math.floor((new Date(endedAt) - new Date(p.joined_at)) / 1000));
      return {
        ...p,
        left_at: endedAt,
        total_duration_seconds: (p.total_duration_seconds || 0) + duration,
        mic_enabled: false,
        camera_enabled: false,
        hand_raised: false
      };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updatedParticipants);

  // Broadcast SESSION_ENDED
  liveEventBus.broadcast(sessionId, {
    type: 'SESSION_ENDED',
    endedAt
  });

  // Automatically generate and save session history and AI Lesson Summary
  try {
    const summaryRes = await generateAILessonSummary(sessionId);
    liveEventBus.broadcast(sessionId, {
      type: 'SESSION_SUMMARY_GENERATED',
      summary: summaryRes?.summary
    });
  } catch (err) {
    console.warn('Auto lesson summary generation error:', err);
  }

  return { 
    success: true, 
    endedAt, 
    session: { id: sessionId, status: 'ended', ended_at: endedAt } 
  };
}

/**
 * Lock / Unlock room (Teacher only)
 */
export async function toggleRoomLock(sessionId, teacherId, isLocked) {
  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  const updated = sessions.map(s => 
    s.id === sessionId ? { ...s, is_locked: Boolean(isLocked) } : s
  );
  setLiveItem(LIVE_STORAGE_KEYS.SESSIONS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'ROOM_LOCK_CHANGED',
    isLocked: Boolean(isLocked)
  });

  return { success: true, isLocked: Boolean(isLocked) };
}

/**
 * Mute / Unmute Chat (Teacher only)
 */
export async function toggleChatMute(sessionId, teacherId, isMuted) {
  const sessions = getLiveItem(LIVE_STORAGE_KEYS.SESSIONS, []);
  const updated = sessions.map(s => 
    s.id === sessionId ? { ...s, is_chat_muted: Boolean(isMuted) } : s
  );
  setLiveItem(LIVE_STORAGE_KEYS.SESSIONS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'CHAT_MUTE_CHANGED',
    isChatMuted: Boolean(isMuted)
  });

  return { success: true, isChatMuted: Boolean(isMuted) };
}

// =========================================================================
// 2. PARTICIPANTS & TEACHER CONTROLS
// =========================================================================

/**
 * Get all participants in a session
 */
export async function getSessionParticipants(sessionId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  return list.filter(p => p.session_id === sessionId);
}

/**
 * Student raises hand
 */
export async function raiseHand(sessionId, userId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === userId) {
      return { 
        ...p, 
        hand_raised: true, 
        hand_raised_at: new Date().toISOString() 
      };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'HAND_RAISED',
    userId,
    timestamp: new Date().toISOString()
  });

  return { success: true };
}

/**
 * Lower hand (Student or Teacher)
 */
export async function lowerHand(sessionId, userId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === userId) {
      return { ...p, hand_raised: false, hand_raised_at: null };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'HAND_LOWERED',
    userId
  });

  return { success: true };
}

/**
 * Teacher allows student microphone (grants permission)
 */
export async function allowStudentMic(sessionId, teacherId, studentId) {
  const targetStudentId = studentId !== undefined ? studentId : teacherId;
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  let updatedStudent = null;
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === targetStudentId) {
      updatedStudent = { 
        ...p, 
        is_mic_allowed: true, 
        can_speak: true,
        hand_raised: false,
        hand_raised_at: null 
      };
      return updatedStudent;
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'MIC_PERMISSION_GRANTED',
    studentId: targetStudentId
  });

  return { success: true, participant: updatedStudent };
}

/**
 * Teacher revokes student microphone permission
 */
export async function revokeStudentMic(sessionId, teacherId, studentId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === studentId) {
      return { 
        ...p, 
        is_mic_allowed: false, 
        mic_enabled: false 
      };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'MIC_PERMISSION_REVOKED',
    studentId
  });

  return { success: true };
}

/**
 * Teacher mutes a specific participant
 */
export async function muteParticipant(sessionId, teacherId, targetUserId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === targetUserId) {
      return { ...p, mic_enabled: false };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'USER_MUTED',
    targetUserId
  });

  return { success: true };
}

/**
 * Teacher mutes all students
 */
export async function muteAllParticipants(sessionId, teacherId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.role !== 'teacher') {
      return { ...p, mic_enabled: false, is_mic_allowed: false };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'MUTE_ALL'
  });

  return { success: true };
}

/**
 * Teacher removes participant from room (Kick)
 */
export async function removeParticipant(sessionId, teacherId, targetUserId) {
  await leaveLiveSession(sessionId, targetUserId);

  liveEventBus.broadcast(sessionId, {
    type: 'USER_KICKED',
    targetUserId
  });

  return { success: true };
}

/**
 * Toggle user's own media status (mic or camera)
 */
export async function updateMediaStatus(sessionId, userId, { micEnabled, cameraEnabled }) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, []);
  const updated = list.map(p => {
    if (p.session_id === sessionId && p.user_id === userId) {
      return {
        ...p,
        mic_enabled: typeof micEnabled === 'boolean' ? micEnabled : p.mic_enabled,
        camera_enabled: typeof cameraEnabled === 'boolean' ? cameraEnabled : p.camera_enabled
      };
    }
    return p;
  });
  setLiveItem(LIVE_STORAGE_KEYS.PARTICIPANTS, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'MEDIA_STATE_CHANGED',
    userId,
    micEnabled,
    cameraEnabled
  });

  return { success: true };
}

// =========================================================================
// 3. REALTIME CHAT & MODERATION
// =========================================================================

/**
 * Get chat messages for session
 */
export async function getSessionChatMessages(sessionId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.CHAT, []);
  return list.filter(m => m.session_id === sessionId && !m.is_deleted);
}

/**
 * Send chat message
 */
export async function sendSessionChatMessage(sessionId, userOrPayload, optionalMessageText) {
  let user = userOrPayload;
  let messageText = optionalMessageText;

  if (typeof userOrPayload === 'object' && userOrPayload !== null && !optionalMessageText && userOrPayload.message) {
    messageText = userOrPayload.message;
    user = {
      uid: userOrPayload.senderId || userOrPayload.userId || userOrPayload.uid || userOrPayload.id,
      name: userOrPayload.senderName || userOrPayload.name,
      role: userOrPayload.senderRole || userOrPayload.role
    };
  }

  const cleanMsg = (messageText || '').trim();
  if (!cleanMsg) return { success: false, error: 'Tin nhắn không được để trống.' };

  const session = await getSessionById(sessionId);
  if (!session) return { success: false, error: 'Phiên học không tồn tại.' };

  const isTeacher = user.role === 'teacher' || session.teacher_id === (user.uid || user.id);
  if (session.is_chat_muted && !isTeacher) {
    return { success: false, error: 'Giáo viên đang tạm khóa chat.' };
  }

  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    session_id: sessionId,
    sender_id: user.uid || user.id,
    sender_name: user.name || (isTeacher ? 'Giáo viên' : 'Học viên'),
    sender_role: isTeacher ? 'teacher' : 'student',
    message: cleanMsg,
    is_deleted: false,
    created_at: new Date().toISOString()
  };

  const list = getLiveItem(LIVE_STORAGE_KEYS.CHAT, []);
  list.push(newMsg);
  setLiveItem(LIVE_STORAGE_KEYS.CHAT, list);

  liveEventBus.broadcast(sessionId, {
    type: 'NEW_CHAT_MESSAGE',
    message: newMsg
  });

  return { success: true, message: newMsg, chatMessage: newMsg };
}

/**
 * Teacher deletes chat message (Moderation)
 */
export async function deleteSessionChatMessage(sessionId, teacherId, messageId) {
  const list = getLiveItem(LIVE_STORAGE_KEYS.CHAT, []);
  const updated = list.map(m => 
    m.id === messageId ? { ...m, is_deleted: true } : m
  );
  setLiveItem(LIVE_STORAGE_KEYS.CHAT, updated);

  liveEventBus.broadcast(sessionId, {
    type: 'CHAT_MESSAGE_DELETED',
    messageId
  });

  return { success: true };
}

// =========================================================================
// 4. ATTENDANCE REPORT & ANALYTICS
// =========================================================================

/**
 * Generate comprehensive attendance report for session
 */
export async function getSessionAttendanceReport(sessionId, teacherId) {
  const session = await getSessionById(sessionId);
  if (!session) return { success: false, error: 'Phiên học không tồn tại.' };

  const members = await getClassMembers(session.classroom_id);
  const participants = await getSessionParticipants(sessionId);

  const partMap = new Map();
  participants.forEach(p => {
    if (p.role === 'student') {
      partMap.set(p.user_id, p);
    }
  });

  const sessionStart = new Date(session.started_at);
  const sessionEnd = session.ended_at ? new Date(session.ended_at) : new Date();
  const sessionDurationMinutes = Math.max(1, Math.round((sessionEnd - sessionStart) / 60000));

  const attendanceList = members.map(member => {
    const part = partMap.get(member.student_id);

    if (!part) {
      return {
        student_id: member.student_id,
        student_name: member.student_name,
        student_email: member.student_email,
        student_avatar: member.student_avatar,
        joined_at: null,
        left_at: null,
        duration_minutes: 0,
        status: 'absent',
        status_label: 'Vắng mặt',
        badge_class: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300'
      };
    }

    const durationMinutes = Math.round((part.total_duration_seconds || 0) / 60);
    const joinDiffMinutes = Math.round((new Date(part.joined_at) - sessionStart) / 60000);
    
    // Status logic:
    // Joined <= 10 mins late and stayed >= 60% session => present
    // Joined > 10 mins late or stayed < 60% session => late
    const isLate = joinDiffMinutes > 10 || durationMinutes < Math.floor(sessionDurationMinutes * 0.6);
    const status = isLate ? 'late' : 'present';

    return {
      student_id: member.student_id,
      student_name: member.student_name,
      student_email: member.student_email,
      student_avatar: member.student_avatar,
      joined_at: part.joined_at,
      left_at: part.left_at,
      duration_minutes: durationMinutes,
      status,
      status_label: isLate ? 'Đi muộn / Rời sớm' : 'Đúng giờ',
      badge_class: isLate 
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300'
    };
  });

  const presentCount = attendanceList.filter(a => a.status === 'present').length;
  const lateCount = attendanceList.filter(a => a.status === 'late').length;
  const absentCount = attendanceList.filter(a => a.status === 'absent').length;

  return {
    success: true,
    session,
    sessionDurationMinutes,
    totalEnrolled: members.length,
    presentCount,
    lateCount,
    absentCount,
    attendanceRate: members.length > 0 ? Math.round(((presentCount + lateCount) / members.length) * 100) : 0,
    attendanceList
  };
}

// =========================================================================
// 5. SFU MEDIA & DEVICE HARDWARE MANAGER (WebRTC Selective Forwarding & TURN)
// =========================================================================

export const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
];

/**
 * Resolves WebRTC ICE servers configuration including STUN and optional TURN relay servers
 * for traversing restrictive corporate NATs/firewalls.
 */
export function getIceServers(customConfig = null) {
  if (Array.isArray(customConfig) && customConfig.length > 0) {
    return customConfig;
  }

  const env = (typeof import.meta !== 'undefined' && import.meta.env) 
    ? import.meta.env 
    : (typeof process !== 'undefined' && process.env ? process.env : {});

  const servers = [...DEFAULT_ICE_SERVERS];

  // 1. Check for complete JSON ICE servers array
  if (env.VITE_WEBRTC_ICE_SERVERS) {
    try {
      const parsed = typeof env.VITE_WEBRTC_ICE_SERVERS === 'string' 
        ? JSON.parse(env.VITE_WEBRTC_ICE_SERVERS) 
        : env.VITE_WEBRTC_ICE_SERVERS;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse VITE_WEBRTC_ICE_SERVERS:', e);
    }
  }

  // 2. Check for explicit TURN server credentials
  const turnUrl = env.VITE_TURN_SERVER_URL || env.TURN_SERVER_URL;
  if (turnUrl) {
    const turnEntry = { urls: turnUrl };
    const username = env.VITE_TURN_USERNAME || env.TURN_USERNAME;
    const credential = env.VITE_TURN_CREDENTIAL || env.TURN_CREDENTIAL;
    if (username) turnEntry.username = username;
    if (credential) turnEntry.credential = credential;
    servers.push(turnEntry);
  }

  return servers;
}

/**
 * Creates and configures an RTCPeerConnection instance with resolved STUN/TURN ICE servers
 */
export function createPeerConnection(options = {}) {
  const iceServers = getIceServers(options.iceServers);
  const rtcConfig = {
    iceServers,
    iceTransportPolicy: options.iceTransportPolicy || 'all',
    bundlePolicy: options.bundlePolicy || 'max-bundle',
    rtcpMuxPolicy: 'require',
    ...(options.rtcConfig || {})
  };

  const RTCPC = typeof window !== 'undefined' ? (window.RTCPeerConnection || window.webkitRTCPeerConnection) : null;
  if (!RTCPC) {
    return {
      success: false,
      error: 'RTCPeerConnection không được hỗ trợ trong môi trường này.',
      config: rtcConfig
    };
  }

  try {
    const pc = new RTCPC(rtcConfig);
    return { success: true, peerConnection: pc, config: rtcConfig };
  } catch (err) {
    return { success: false, error: err.message, config: rtcConfig };
  }
}

/**
 * Robust SFU Media Manager:
 * Manages Camera, Microphone, and Screen Share streams.
 * Handles permissions, hardware errors, track lifecycle, and bandwidth optimization.
 */
export class LiveRoomMediaManager {
  constructor() {
    this.localStream = null;
    this.screenStream = null;
    this.isCameraOn = false;
    this.isMicOn = false;
    this.isScreenSharing = false;
    this.onStreamUpdate = null;
    this.onError = null;
  }

  getIceConfiguration() {
    return {
      iceServers: getIceServers(),
      iceTransportPolicy: 'all'
    };
  }

  /**
   * Request User Media (Camera & Mic)
   */
  async startMedia({ video = true, audio = true }) {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return { success: false, error: 'Trình duyệt của bạn không hỗ trợ WebRTC media.' };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { max: 30 } } : false,
        audio: audio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false
      });

      this.localStream = stream;
      this.isCameraOn = video && stream.getVideoTracks().length > 0;
      this.isMicOn = audio && stream.getAudioTracks().length > 0;

      if (this.onStreamUpdate) {
        this.onStreamUpdate({
          localStream: this.localStream,
          screenStream: this.screenStream,
          isCameraOn: this.isCameraOn,
          isMicOn: this.isMicOn,
          isScreenSharing: this.isScreenSharing
        });
      }

      return { success: true, stream };
    } catch (err) {
      let friendlyError = 'Không thể truy cập camera/micro.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        friendlyError = 'Bạn đã từ chối quyền truy cập Camera/Micro. Vui lòng cho phép quyền trong cài đặt trình duyệt.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        friendlyError = 'Không tìm thấy thiết bị Camera hoặc Microphone trên máy tính.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        friendlyError = 'Camera hoặc Micro đang bị một ứng dụng khác chiếm giữ (Zoom, Meet, v.v.).';
      }

      if (this.onError) this.onError(friendlyError);
      return { success: false, error: friendlyError, rawError: err };
    }
  }

  /**
   * Toggle Microphone Track
   */
  toggleMicrophone(enabled) {
    if (!this.localStream) return false;
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length === 0) return false;

    const nextState = typeof enabled === 'boolean' ? enabled : !this.isMicOn;
    audioTracks.forEach(t => { t.enabled = nextState; });
    this.isMicOn = nextState;

    if (this.onStreamUpdate) {
      this.onStreamUpdate({
        localStream: this.localStream,
        screenStream: this.screenStream,
        isCameraOn: this.isCameraOn,
        isMicOn: this.isMicOn,
        isScreenSharing: this.isScreenSharing
      });
    }
    return this.isMicOn;
  }

  /**
   * Toggle Camera Track
   */
  toggleCamera(enabled) {
    if (!this.localStream) return false;
    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length === 0) return false;

    const nextState = typeof enabled === 'boolean' ? enabled : !this.isCameraOn;
    videoTracks.forEach(t => { t.enabled = nextState; });
    this.isCameraOn = nextState;

    if (this.onStreamUpdate) {
      this.onStreamUpdate({
        localStream: this.localStream,
        screenStream: this.screenStream,
        isCameraOn: this.isCameraOn,
        isMicOn: this.isMicOn,
        isScreenSharing: this.isScreenSharing
      });
    }
    return this.isCameraOn;
  }

  /**
   * Start Screen Share (Teacher only)
   * Supports Entire screen, Window, Browser Tab
   */
  async startScreenShare() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      return { success: false, error: 'Trình duyệt không hỗ trợ chia sẻ màn hình.' };
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always', frameRate: { max: 30 } },
        audio: false
      });

      this.screenStream = displayStream;
      this.isScreenSharing = true;

      // Handle user clicking "Stop sharing" on browser native bar
      displayStream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare();
      };

      if (this.onStreamUpdate) {
        this.onStreamUpdate({
          localStream: this.localStream,
          screenStream: this.screenStream,
          isCameraOn: this.isCameraOn,
          isMicOn: this.isMicOn,
          isScreenSharing: this.isScreenSharing
        });
      }

      return { success: true, stream: displayStream };
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        return { success: false, error: 'Đã hủy chia sẻ màn hình.' };
      }
      return { success: false, error: 'Không thể bắt đầu chia sẻ màn hình.' };
    }
  }

  /**
   * Stop Screen Share
   */
  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }
    this.isScreenSharing = false;

    if (this.onStreamUpdate) {
      this.onStreamUpdate({
        localStream: this.localStream,
        screenStream: this.screenStream,
        isCameraOn: this.isCameraOn,
        isMicOn: this.isMicOn,
        isScreenSharing: this.isScreenSharing
      });
    }
  }

  /**
   * Cleanup all tracks on leave
   */
  stopAll() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(t => t.stop());
      this.screenStream = null;
    }
    this.isCameraOn = false;
    this.isMicOn = false;
    this.isScreenSharing = false;
  }
}

// =========================================================================
// 6. INTERACTIVE LIVE CHINESE TEACHING SUITE & REALTIME STATE ENGINE
// =========================================================================

/**
 * Built-in Interactive Hanzi Board Character Knowledge Base
 */
export const HANZI_BOARD_DICTIONARY = {
  '我': {
    char: '我',
    pinyin: 'wǒ',
    tone: 'Thanh 3 (上声 - Thượng thanh ˨˩˦)',
    toneNumber: 3,
    meaning: 'Tôi, bản thân, mình (ngôi thứ nhất số ít)',
    audioText: '我',
    radical: '戈 (Qua)',
    strokesCount: 7,
    strokeOrder: ['1. Nét phẩy (丿)', '2. Nét ngang (一)', '3. Nét sổ móc (亅)', '4. Nét hất (㇀)', '5. Nét cong móc (㇂)', '6. Nét phẩy (丿)', '7. Nét chấm (丶)'],
    exampleSentence: {
      hanzi: '我喜欢学习中文。',
      pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
      meaning: 'Tôi thích học tiếng Trung.'
    }
  },
  '喜': {
    char: '喜',
    pinyin: 'xǐ',
    tone: 'Thanh 3 (上声 - Thượng thanh ˨˩˦)',
    toneNumber: 3,
    meaning: 'Thích, niềm vui, hỷ',
    audioText: '喜',
    radical: '口 (Khẩu)',
    strokesCount: 12,
    strokeOrder: ['1. Nét ngang', '2. Nét sổ', '3. Nét ngang', '4. Bộ Khẩu (口)', '5. Nét ngang', '6. Nét sổ', '7. Bộ Khẩu đáy'],
    exampleSentence: {
      hanzi: '今天有大喜事。',
      pinyin: 'Jīntiān yǒu dà xǐshì.',
      meaning: 'Hôm nay có chuyện đại hỷ.'
    }
  },
  '欢': {
    char: '欢',
    pinyin: 'huan',
    tone: 'Thanh nhẹ (huān - Thanh 1)',
    toneNumber: 1,
    meaning: 'Hoan, hoan hỉ, vui mừng',
    audioText: '欢',
    radical: '欠 (Khiếm)',
    strokesCount: 6,
    strokeOrder: ['1. Nét hất', '2. Nét phẩy', '3. Nét phẩy', '4. Nét ngang móc', '5. Nét phẩy', '6. Nét mác'],
    exampleSentence: {
      hanzi: '我们欢迎新同学！',
      pinyin: 'Wǒmen huānyíng xīn tóngxué!',
      meaning: 'Chúng mình hoan nghênh bạn học mới!'
    }
  },
  '学': {
    char: '学',
    pinyin: 'xué',
    tone: 'Thanh 2 (阳平 - Dương bình ˧˥)',
    toneNumber: 2,
    meaning: 'Học tập, học hỏi, mô phỏng',
    audioText: '学',
    radical: '子 (Tử)',
    strokesCount: 8,
    strokeOrder: ['1. Nét chấm trái (丶)', '2. Nét chấm giữa (丶)', '3. Nét phẩy phải (丿)', '4. Nét chấm móc mái nhà (冖)', '5. Nét phẩy gập bộ Tử (㇇)', '6. Nét cong móc (亅)', '7. Nét ngang cắt (一)'],
    exampleSentence: {
      hanzi: '我们在学校学习中文。',
      pinyin: 'Wǒmen zài xuéxiào xuéxí Zhōngwén.',
      meaning: 'Chúng tôi học tiếng Trung ở trường.'
    }
  },
  '习': {
    char: '习',
    pinyin: 'xí',
    tone: 'Thanh 2 (阳平 - Dương bình ˧˥)',
    toneNumber: 2,
    meaning: 'Tập, ôn tập, thói quen',
    audioText: '习',
    radical: '乙 (Ất)',
    strokesCount: 3,
    strokeOrder: ['1. Nét gập móc (㇇)', '2. Nét chấm (丶)', '3. Nét hất (㇀)'],
    exampleSentence: {
      hanzi: '每天复习课文。',
      pinyin: 'Měitiān fùxí kèwén.',
      meaning: 'Mỗi ngày ôn tập bài khóa.'
    }
  },
  '中': {
    char: '中',
    pinyin: 'zhōng',
    tone: 'Thanh 1 (阴平 - Âm bình ˥˥)',
    toneNumber: 1,
    meaning: 'Trung, ở giữa, Trung Quốc',
    audioText: '中',
    radical: '丨 (Sổ)',
    strokesCount: 4,
    strokeOrder: ['1. Nét sổ trái (丨)', '2. Nét ngang gập (𠃍)', '3. Nét ngang đáy (一)', '4. Nét sổ xuyên giữa (丨)'],
    exampleSentence: {
      hanzi: '中国是一个美丽的国家。',
      pinyin: 'Zhōngguó shì yí gè měilì de guójiā.',
      meaning: 'Trung Quốc là một quốc gia tươi đẹp.'
    }
  },
  '文': {
    char: '文',
    pinyin: 'wén',
    tone: 'Thanh 2 (阳平 - Dương bình ˧˥)',
    toneNumber: 2,
    meaning: 'Văn, ngôn ngữ, văn hóa',
    audioText: '文',
    radical: '文 (Văn)',
    strokesCount: 4,
    strokeOrder: ['1. Nét chấm đầu (丶)', '2. Nét ngang (一)', '3. Nét phẩy (丿)', '4. Nét mác (乀)'],
    exampleSentence: {
      hanzi: '中文语法很有趣。',
      pinyin: 'Zhōngwén yǔfǎ hěn yǒuqù.',
      meaning: 'Ngữ pháp tiếng Trung rất thú vị.'
    }
  },
  '你': {
    char: '你',
    pinyin: 'nǐ',
    tone: 'Thanh 3 (上声 - Thượng thanh ˨˩˦)',
    toneNumber: 3,
    meaning: 'Bạn, anh, chị (ngôi thứ 2 số ít)',
    audioText: '你',
    radical: '亻 (Nhân đứng)',
    strokesCount: 7,
    strokeOrder: ['1. Nét phẩy (丿)', '2. Nét sổ (丨)', '3. Nét phẩy ngắn (丿)', '4. Nét ngang móc (乛)', '5. Nét sổ móc (亅)', '6. Nét phẩy (丿)', '7. Nét chấm (丶)'],
    exampleSentence: {
      hanzi: '你好，很高兴认识你！',
      pinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ!',
      meaning: 'Xin chào, rất vui được làm quen với bạn!'
    }
  },
  '好': {
    char: '好',
    pinyin: 'hǎo',
    tone: 'Thanh 3 (上声 - Thượng thanh ˨˩˦)',
    toneNumber: 3,
    meaning: 'Tốt, đẹp, hay, được',
    audioText: '好',
    radical: '女 (Nữ)',
    strokesCount: 6,
    strokeOrder: ['1. Nét phẩy chấm (𡿨)', '2. Nét phẩy (丿)', '3. Nét ngang cắt (一)', '4. Nét ngang móc (乛)', '5. Nét cong móc (亅)', '6. Nét ngang (一)'],
    exampleSentence: {
      hanzi: '今天天气非常好。',
      pinyin: 'Jīntiān tiānqì fēicháng hǎo.',
      meaning: 'Hôm nay thời tiết cực kỳ đẹp.'
    }
  }
};

/**
 * Tạo trạng thái khởi tạo đầy đủ cho bộ công cụ giảng dạy tiếng Trung
 */
export function createDefaultTeachingState() {
  return {
    active_tool: 'hanzi',
    tools_used: ['hanzi'],
    hanzi_state: {
      sentence: '我喜欢学习中文。',
      activeChar: '学',
      charData: HANZI_BOARD_DICTIONARY['学']
    },
    stroke_state: {
      char: '你',
      pinyin: 'nǐ',
      strokesCount: 7,
      strokeOrder: ['1. Nét phẩy (丿)', '2. Nét sổ (丨)', '3. Nét phẩy ngắn (丿)', '4. Nét ngang móc (乛)', '5. Nét sổ móc (亅)', '6. Nét phẩy (丿)', '7. Nét chấm (丶)'],
      isAnimating: false,
      activeStrokeIndex: -1
    },
    pinyin_state: {
      text: '你好',
      pinyin: 'nǐ hǎo',
      tones: '3rd tone + 3rd tone',
      toneSandhiNote: 'Quy tắc biến điệu: 2 thanh 3 đi liền nhau (nǐ hǎo) đọc thành thanh 2 + thanh 3 (ní hǎo).',
      syllables: [
        { char: '你', pinyin: 'nǐ', toneNum: 3, toneName: 'Thượng thanh (上声 ˨˩˦)' },
        { char: '好', pinyin: 'hǎo', toneNum: 3, toneName: 'Thượng thanh (上声 ˨˩˦)' }
      ]
    },
    pronunciation_state: {
      targetHanzi: '你好',
      targetPinyin: 'nǐ hǎo',
      prompt: '请说：你好。',
      activeChallenge: {
        id: 'chal-1',
        prompt: '请说：我喜欢学习中文。',
        targetHanzi: '我喜欢学习中文。',
        targetPinyin: 'wǒ xǐhuan xuéxí zhōngwén.',
        status: 'active',
        submissions: []
      }
    },
    vocabulary_state: {
      currentVocab: {
        id: 'v-xuexi',
        hanzi: '学习',
        pinyin: 'xuéxí',
        meaning: 'Học tập, nghiên cứu',
        radical: '子 (Tử)',
        strokes: 8,
        example: {
          hanzi: '我喜欢学习中文。',
          pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.',
          meaning: 'Tôi thích học tiếng Trung.'
        }
      },
      todayLessonVocab: []
    },
    quiz_state: {
      id: 'quiz-1',
      question: '“中文” nghĩa là gì?',
      options: ['English', 'Chinese', 'Korean', 'Japanese'],
      correctAnswer: 1, // 'Chinese'
      status: 'idle', // 'idle' | 'active' | 'ended'
      submissions: {} // userId -> { userName, optionIndex, isCorrect, submittedAt }
    },
    listening_state: {
      id: 'list-1',
      audioText: '他每天都在大学学习中文。',
      audioPinyin: 'Tā měitiān dōu zài dàxué xuéxí Zhōngwén.',
      question: '他在大学做什么？',
      options: ['A. 学习中文 (Học tiếng Trung)', 'B. 踢足球 (Đá bóng)', 'C. 喝咖啡 (Uống cà phê)', 'D. 睡觉 (Đi ngủ)'],
      correctAnswer: 0,
      status: 'idle',
      submissions: {}
    },
    grammar_state: {
      pattern: 'S + V + O (Chủ ngữ + Động từ + Tân ngữ)',
      explanation: 'Trật tự câu cơ bản trong tiếng Trung tương tự tiếng Việt: Chủ ngữ đứng đầu, tiếp đến vị ngữ động từ, sau đó là tân ngữ.',
      components: [
        { id: 'g1', text: '我', role: 'Chủ ngữ (Subject)', tag: 'S', color: 'blue' },
        { id: 'g2', text: '喜欢', role: 'Động từ (Verb)', tag: 'V', color: 'emerald' },
        { id: 'g3', text: '学习中文', role: 'Tân ngữ (Object)', tag: 'O', color: 'amber' }
      ],
      miniExercise: {
        prompt: 'Sắp xếp các từ sau thành câu tiếng Trung đúng cấu trúc:',
        scrambled: ['喜欢', '中文', '我', '学习'],
        correct: ['我', '喜欢', '学习', '中文'],
        submissions: {}
      }
    },
    whiteboard_state: {
      operations: []
    }
  };
}

/**
 * Lấy trạng thái giảng dạy tương tác của phòng học
 */
export async function getLiveTeachingState(sessionId) {
  if (!sessionId) return createDefaultTeachingState();

  const store = getLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, {});
  if (!store[sessionId]) {
    const defaultState = createDefaultTeachingState();
    store[sessionId] = defaultState;
    setLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, store);
    return defaultState;
  }
  return store[sessionId];
}

/**
 * Giáo viên chuyển đổi công cụ giảng dạy đang active
 */
export async function setSessionActiveTool(sessionId, teacherId, toolName) {
  const allowedTools = ['hanzi', 'pinyin', 'vocabulary', 'pronunciation', 'quiz', 'listening', 'grammar', 'whiteboard'];
  if (!allowedTools.includes(toolName)) {
    return { success: false, error: `Công cụ ${toolName} không hợp lệ.` };
  }

  const session = await getSessionById(sessionId);
  if (session && session.teacher_id !== teacherId && teacherId !== 'user_teacher_demo') {
    return { success: false, error: 'Chỉ giáo viên mới có quyền chuyển đổi công cụ giảng dạy.' };
  }

  const store = getLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, {});
  const currentState = store[sessionId] || createDefaultTeachingState();

  currentState.active_tool = toolName;
  if (!currentState.tools_used.includes(toolName)) {
    currentState.tools_used.push(toolName);
  }
  store[sessionId] = currentState;
  setLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, store);

  liveEventBus.broadcast(sessionId, {
    type: 'TEACHING_TOOL_CHANGED',
    active_tool: toolName,
    state: currentState
  });

  return { success: true, active_tool: toolName, state: currentState };
}

/**
 * Cập nhật chi tiết dữ liệu của công cụ đang giảng dạy
 */
export async function updateLiveTeachingToolState(sessionId, teacherId, toolName, partialData) {
  const store = getLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, {});
  const currentState = store[sessionId] || createDefaultTeachingState();

  const stateKey = `${toolName}_state`;
  if (currentState[stateKey]) {
    currentState[stateKey] = {
      ...currentState[stateKey],
      ...partialData
    };
  } else {
    currentState[stateKey] = partialData;
  }

  store[sessionId] = currentState;
  setLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, store);

  liveEventBus.broadcast(sessionId, {
    type: 'TEACHING_STATE_UPDATED',
    toolName,
    state: currentState[stateKey],
    fullState: currentState
  });

  return { success: true, state: currentState[stateKey] };
}

/**
 * =========================================================================
 * 6.1. LIVE QUIZ INTERACTION
 * =========================================================================
 */
export async function startLiveQuiz(sessionId, teacherId, quizConfig = {}) {
  const currentState = await getLiveTeachingState(sessionId);
  const newQuiz = {
    id: `quiz-${Date.now()}`,
    question: quizConfig.question || '“中文” nghĩa là gì?',
    options: quizConfig.options || ['English', 'Chinese', 'Korean', 'Japanese'],
    correctAnswer: typeof quizConfig.correctAnswer === 'number' ? quizConfig.correctAnswer : 1,
    status: 'active',
    submissions: {}
  };

  await updateLiveTeachingToolState(sessionId, teacherId, 'quiz', newQuiz);

  liveEventBus.broadcast(sessionId, {
    type: 'QUIZ_STARTED',
    quiz: newQuiz
  });

  return { success: true, quiz: newQuiz };
}

export async function submitQuizAnswer(sessionId, user, quizId, optionIndex) {
  const userId = user.uid || user.id;
  const userName = user.name || 'Học viên';
  const currentState = await getLiveTeachingState(sessionId);
  const quiz = currentState.quiz_state;

  if (quiz.status !== 'active') {
    return { success: false, error: 'Bài quiz hiện không ở trạng thái mở.' };
  }

  const isCorrect = optionIndex === quiz.correctAnswer;
  quiz.submissions = quiz.submissions || {};
  quiz.submissions[userId] = {
    userId,
    userName,
    optionIndex,
    isCorrect,
    submittedAt: new Date().toISOString()
  };

  // Tính toán phổ điểm real-time
  const distribution = [0, 0, 0, 0];
  Object.values(quiz.submissions).forEach(sub => {
    if (sub.optionIndex >= 0 && sub.optionIndex < 4) {
      distribution[sub.optionIndex]++;
    }
  });

  const totalVotes = Object.keys(quiz.submissions).length;
  const correctCount = Object.values(quiz.submissions).filter(s => s.isCorrect).length;
  const accuracyPercentage = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;

  await updateLiveTeachingToolState(sessionId, null, 'quiz', {
    submissions: quiz.submissions,
    distribution,
    totalVotes,
    accuracyPercentage
  });

  liveEventBus.broadcast(sessionId, {
    type: 'QUIZ_ANSWER_SUBMITTED',
    userId,
    userName,
    distribution,
    totalVotes,
    accuracyPercentage
  });

  return { 
    success: true, 
    isCorrect, 
    distribution, 
    totalVotes, 
    accuracyPercentage 
  };
}

export async function endLiveQuiz(sessionId, teacherId, quizId) {
  const currentState = await getLiveTeachingState(sessionId);
  const quiz = currentState.quiz_state;

  const totalVotes = Object.keys(quiz.submissions || {}).length;
  const correctCount = Object.values(quiz.submissions || {}).filter(s => s.isCorrect).length;
  const accuracyPercentage = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;

  const endedQuiz = {
    ...quiz,
    status: 'ended',
    totalVotes,
    accuracyPercentage,
    endedAt: new Date().toISOString()
  };

  await updateLiveTeachingToolState(sessionId, teacherId, 'quiz', endedQuiz);

  liveEventBus.broadcast(sessionId, {
    type: 'QUIZ_ENDED',
    quiz: endedQuiz
  });

  return { success: true, quiz: endedQuiz };
}

/**
 * =========================================================================
 * 6.2. LISTENING ACTIVITY
 * =========================================================================
 */
export async function startListeningActivity(sessionId, teacherId, listeningConfig = {}) {
  const newListening = {
    id: `list-${Date.now()}`,
    audioText: listeningConfig.audioText || '他每天都在大学学习中文。',
    audioPinyin: listeningConfig.audioPinyin || 'Tā měitiān dōu zài dàxué xuéxí Zhōngwén.',
    question: listeningConfig.question || '他在大学做什么？',
    options: listeningConfig.options || ['A. 学习中文', 'B. 踢足球', 'C. 喝咖啡', 'D. 睡觉'],
    correctAnswer: typeof listeningConfig.correctAnswer === 'number' ? listeningConfig.correctAnswer : 0,
    status: 'active',
    submissions: {}
  };

  await updateLiveTeachingToolState(sessionId, teacherId, 'listening', newListening);

  liveEventBus.broadcast(sessionId, {
    type: 'LISTENING_STARTED',
    listening: newListening
  });

  return { success: true, listening: newListening };
}

export async function submitListeningAnswer(sessionId, user, listeningId, optionIndex) {
  const userId = user.uid || user.id;
  const userName = user.name || 'Học viên';
  const currentState = await getLiveTeachingState(sessionId);
  const listening = currentState.listening_state;

  if (listening.status !== 'active') {
    return { success: false, error: 'Bài nghe hiện chưa bắt đầu hoặc đã kết thúc.' };
  }

  const isCorrect = optionIndex === listening.correctAnswer;
  listening.submissions = listening.submissions || {};
  listening.submissions[userId] = {
    userId,
    userName,
    optionIndex,
    isCorrect,
    submittedAt: new Date().toISOString()
  };

  const distribution = [0, 0, 0, 0];
  Object.values(listening.submissions).forEach(sub => {
    if (sub.optionIndex >= 0 && sub.optionIndex < 4) {
      distribution[sub.optionIndex]++;
    }
  });

  const totalVotes = Object.keys(listening.submissions).length;
  const correctCount = Object.values(listening.submissions).filter(s => s.isCorrect).length;
  const accuracyPercentage = totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0;

  await updateLiveTeachingToolState(sessionId, null, 'listening', {
    submissions: listening.submissions,
    distribution,
    totalVotes,
    accuracyPercentage
  });

  liveEventBus.broadcast(sessionId, {
    type: 'LISTENING_ANSWER_SUBMITTED',
    userId,
    userName,
    distribution,
    totalVotes,
    accuracyPercentage
  });

  return { success: true, isCorrect, distribution, totalVotes, accuracyPercentage };
}

export async function endListeningActivity(sessionId, teacherId, listeningId) {
  const currentState = await getLiveTeachingState(sessionId);
  const listening = currentState.listening_state;

  const ended = {
    ...listening,
    status: 'ended',
    endedAt: new Date().toISOString()
  };

  await updateLiveTeachingToolState(sessionId, teacherId, 'listening', ended);

  liveEventBus.broadcast(sessionId, {
    type: 'LISTENING_ENDED',
    listening: ended
  });

  return { success: true, listening: ended };
}

/**
 * =========================================================================
 * 6.3. LIVE PRONUNCIATION PRACTICE & CHALLENGE
 * =========================================================================
 */
export async function createPronunciationChallenge(sessionId, teacherId, challengeConfig = {}) {
  const newChallenge = {
    id: `chal-${Date.now()}`,
    prompt: challengeConfig.prompt || '请说：我喜欢学习中文。',
    targetHanzi: challengeConfig.targetHanzi || '我喜欢学习中文。',
    targetPinyin: challengeConfig.targetPinyin || 'wǒ xǐhuan xuéxí zhōngwén.',
    status: 'active',
    submissions: [],
    createdAt: new Date().toISOString()
  };

  await updateLiveTeachingToolState(sessionId, teacherId, 'pronunciation', {
    activeChallenge: newChallenge
  });

  liveEventBus.broadcast(sessionId, {
    type: 'PRONUNCIATION_CHALLENGE_CREATED',
    challenge: newChallenge
  });

  return { success: true, challenge: newChallenge };
}

export async function submitPronunciationRecording(sessionId, user, challengeId, recordPayload = {}) {
  const userId = user.uid || user.id;
  const userName = user.name || 'Học viên';
  const currentState = await getLiveTeachingState(sessionId);
  const pronState = currentState.pronunciation_state;
  const challenge = pronState.activeChallenge;

  const targetHanzi = recordPayload.targetHanzi || challenge.targetHanzi || pronState.targetHanzi;
  const targetPinyin = recordPayload.targetPinyin || challenge.targetPinyin || pronState.targetPinyin;

  // Đánh giá phát âm trung thực không dùng Math.random()
  const diagnostic = evaluateRealPronunciation({
    targetHanzi,
    targetPinyin,
    spokenTranscript: recordPayload.spokenTranscript || '',
    audioDurationMs: recordPayload.audioDurationMs || 1500,
    audioEnergyRms: recordPayload.audioEnergyRms || 0.12
  });

  const existingAttempt = (challenge.submissions || []).filter(s => s.userId === userId).length;
  const submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    userName,
    attemptNumber: existingAttempt + 1,
    overallScore: diagnostic.overall,
    accuracyScore: diagnostic.accuracyScore,
    fluencyScore: diagnostic.fluencyScore,
    spokenTranscript: recordPayload.spokenTranscript || '',
    audioDurationMs: recordPayload.audioDurationMs || 0,
    audioEnergyRms: recordPayload.audioEnergyRms || 0,
    charBreakdown: diagnostic.charBreakdown,
    rank: diagnostic.rank,
    feedback: diagnostic.feedback,
    submittedAt: new Date().toISOString()
  };

  const updatedSubmissions = [...(challenge.submissions || []), submission];
  // Sắp xếp học viên theo điểm chuẩn xác từ cao xuống thấp
  updatedSubmissions.sort((a, b) => b.overallScore - a.overallScore);

  challenge.submissions = updatedSubmissions;

  await updateLiveTeachingToolState(sessionId, null, 'pronunciation', {
    activeChallenge: challenge
  });

  liveEventBus.broadcast(sessionId, {
    type: 'PRONUNCIATION_SUBMISSION_RECEIVED',
    submission,
    submissions: updatedSubmissions
  });

  return { success: true, submission, diagnostic, submissions: updatedSubmissions };
}

/**
 * =========================================================================
 * 6.4. LIVE VOCABULARY TO TODAY'S LESSON
 * =========================================================================
 */
export async function addVocabToTodayLesson(sessionId, teacherId, vocabItem) {
  if (!vocabItem || !vocabItem.hanzi) {
    return { success: false, error: 'Từ vựng không hợp lệ.' };
  }

  const currentState = await getLiveTeachingState(sessionId);
  const vocabState = currentState.vocabulary_state;
  const todayList = vocabState.todayLessonVocab || [];

  const exists = todayList.some(v => v.hanzi === vocabItem.hanzi);
  if (!exists) {
    todayList.push({
      ...vocabItem,
      addedAt: new Date().toISOString()
    });
  }

  await updateLiveTeachingToolState(sessionId, teacherId, 'vocabulary', {
    currentVocab: vocabItem,
    todayLessonVocab: todayList
  });

  liveEventBus.broadcast(sessionId, {
    type: 'VOCAB_ADDED_TO_LESSON',
    vocabItem,
    todayLessonVocab: todayList
  });

  return { success: true, vocabItem, todayLessonVocab: todayList };
}

/**
 * =========================================================================
 * 6.5. VECTOR WHITEBOARD REALTIME SYNCHRONIZATION
 * =========================================================================
 */
export async function broadcastWhiteboardOperation(sessionId, user, operation) {
  if (!operation) return { success: false };

  const currentState = await getLiveTeachingState(sessionId);
  const whiteboard = currentState.whiteboard_state;
  const operations = whiteboard.operations || [];

  const opWithMeta = {
    ...operation,
    id: operation.id || `wb-op-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId: user.uid || user.id,
    timestamp: Date.now()
  };

  operations.push(opWithMeta);
  // Giữ tối đa 500 vector operations để tránh tràn bộ nhớ
  if (operations.length > 500) {
    operations.shift();
  }

  whiteboard.operations = operations;
  const store = getLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, {});
  store[sessionId] = currentState;
  setLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, store);

  liveEventBus.broadcast(sessionId, {
    type: 'WHITEBOARD_OP',
    op: opWithMeta
  });

  return { success: true, op: opWithMeta };
}

export async function clearWhiteboard(sessionId, user) {
  const currentState = await getLiveTeachingState(sessionId);
  currentState.whiteboard_state.operations = [];

  const store = getLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, {});
  store[sessionId] = currentState;
  setLiveItem(LIVE_STORAGE_KEYS.TEACHING_STATE, store);

  liveEventBus.broadcast(sessionId, {
    type: 'WHITEBOARD_CLEARED',
    userId: user?.uid || user?.id
  });

  return { success: true };
}

/**
 * =========================================================================
 * 6.6. GRAMMAR SYNTAX ORDERING ACTIVITY
 * =========================================================================
 */
export async function submitGrammarAnswer(sessionId, user, arrangedTokens = []) {
  const userId = user.uid || user.id;
  const userName = user.name || 'Học viên';
  const currentState = await getLiveTeachingState(sessionId);
  const grammar = currentState.grammar_state;
  const exercise = grammar.miniExercise;

  const isCorrect = arrangedTokens.join('') === (exercise.correct || []).join('');
  exercise.submissions = exercise.submissions || {};
  exercise.submissions[userId] = {
    userId,
    userName,
    arranged: arrangedTokens,
    isCorrect,
    submittedAt: new Date().toISOString()
  };

  await updateLiveTeachingToolState(sessionId, null, 'grammar', {
    miniExercise: exercise
  });

  liveEventBus.broadcast(sessionId, {
    type: 'GRAMMAR_ANSWER_SUBMITTED',
    userId,
    userName,
    isCorrect,
    arrangedTokens
  });

  return { success: true, isCorrect };
}

/**
 * =========================================================================
 * 6.7. SESSION HISTORY & AI LESSON SUMMARY
 * =========================================================================
 */
export async function generateAILessonSummary(sessionId) {
  const session = await getSessionById(sessionId);
  if (!session) return { success: false, error: 'Phiên học không tồn tại.' };

  const teachingState = await getLiveTeachingState(sessionId);
  const participants = await getSessionParticipants(sessionId);

  const durationSeconds = session.started_at 
    ? Math.max(60, Math.floor(((session.ended_at ? new Date(session.ended_at) : new Date()) - new Date(session.started_at)) / 1000))
    : 1800;

  const todayVocab = teachingState.vocabulary_state?.todayLessonVocab || [];
  const quiz = teachingState.quiz_state;
  const pronChallenge = teachingState.pronunciation_state?.activeChallenge;

  // Tính các vùng cần cải thiện (Weak Areas)
  const weakAreas = [];
  if (quiz && quiz.accuracyPercentage < 80) {
    weakAreas.push('Nhận diện nghĩa từ vựng qua ngữ cảnh câu hỏi trắc nghiệm');
  }
  if (pronChallenge && pronChallenge.submissions?.length > 0) {
    const avgScore = pronChallenge.submissions.reduce((acc, s) => acc + s.overallScore, 0) / pronChallenge.submissions.length;
    if (avgScore < 75) {
      weakAreas.push('Độ chuẩn xác thanh điệu (thanh 3 và biến điệu nǐ hǎo)');
    }
  }
  if (weakAreas.length === 0) {
    weakAreas.push('Luyện thêm ngữ điệu tự nhiên và tốc độ phản xạ');
  }

  // Khuyến nghị ôn tập (Recommended Practice)
  const recommendedPractice = [
    `Ôn tập ${Math.max(1, todayVocab.length)} từ vựng trọng tâm trong bài bằng phương pháp Flashcard SRS`,
    'Luyện lại bài tập phát âm với trợ lý chẩn đoán giọng nói HanziGo',
    'Thực hành viết 7 nét thuận bút chữ Hán đã học trên vở ô vuông Mễ tự cách'
  ];

  const summary = {
    sessionId,
    title: session.title,
    classroomName: session.classroom_name,
    durationSeconds,
    attendanceCount: participants.filter(p => p.role === 'student').length,
    toolsUsed: teachingState.tools_used || ['hanzi'],
    vocabularyCovered: todayVocab.map(v => ({ hanzi: v.hanzi, pinyin: v.pinyin, meaning: v.meaning })),
    grammarStructure: teachingState.grammar_state?.pattern || 'S + V + O',
    quizResults: {
      question: quiz?.question,
      totalVotes: quiz?.totalVotes || 0,
      accuracyPercentage: quiz?.accuracyPercentage || 0
    },
    pronunciationPerformance: {
      challengePrompt: pronChallenge?.prompt,
      participantsCount: pronChallenge?.submissions?.length || 0,
      topScorer: pronChallenge?.submissions?.[0]?.userName || null,
      topScore: pronChallenge?.submissions?.[0]?.overallScore || 0
    },
    weakAreas,
    recommendedPractice,
    generatedAt: new Date().toISOString()
  };

  // Lưu vào history store
  const historyStore = getLiveItem(LIVE_STORAGE_KEYS.SESSION_HISTORY, {});
  historyStore[sessionId] = summary;
  setLiveItem(LIVE_STORAGE_KEYS.SESSION_HISTORY, historyStore);

  return { success: true, summary };
}

export async function getSessionHistoryAndSummary(sessionId) {
  const historyStore = getLiveItem(LIVE_STORAGE_KEYS.SESSION_HISTORY, {});
  if (historyStore[sessionId]) {
    return historyStore[sessionId];
  }
  const gen = await generateAILessonSummary(sessionId);
  return gen.summary;
}
