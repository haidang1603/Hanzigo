-- =========================================================================
-- HANZI GO - MIGRATION 06: LIVE CLASSROOM & SFU SESSIONS SCHEMA & RLS
-- =========================================================================

-- 1. Bảng class_sessions: Phiên học trực tuyến Live Classroom
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ NULL,
  status TEXT DEFAULT 'live' CHECK (status IN ('scheduled', 'live', 'ended')),
  is_locked BOOLEAN DEFAULT false,
  is_chat_muted BOOLEAN DEFAULT false,
  max_capacity INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho truy vấn phiên học
CREATE INDEX IF NOT EXISTS idx_sessions_classroom ON public.class_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON public.class_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.class_sessions(status);

-- 2. Bảng session_participants: Người tham gia & Điểm danh tự động
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ NULL,
  total_duration_seconds INT DEFAULT 0,
  mic_enabled BOOLEAN DEFAULT false,
  camera_enabled BOOLEAN DEFAULT false,
  hand_raised BOOLEAN DEFAULT false,
  hand_raised_at TIMESTAMPTZ NULL,
  is_mic_allowed BOOLEAN DEFAULT false, -- Quyền bật mic được giáo viên cấp
  attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'late', 'absent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_session_user_pair UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_part_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_part_user ON public.session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_part_hand_raised ON public.session_participants(session_id, hand_raised);

-- 3. Bảng session_chat_messages: Tin nhắn thời gian thực trong phòng học
CREATE TABLE IF NOT EXISTS public.session_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'student')),
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON public.session_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON public.session_chat_messages(created_at);

-- =========================================================================
-- 4. BẬT ROW LEVEL SECURITY (RLS)
-- =========================================================================

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_chat_messages ENABLE ROW LEVEL SECURITY;

-- 4.1. Quyền trên class_sessions
-- Xem: Chỉ giáo viên của lớp hoặc học viên trong class_members mới xem được session
DROP POLICY IF EXISTS "Members can view class sessions" ON public.class_sessions;
CREATE POLICY "Members can view class sessions"
  ON public.class_sessions FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    public.is_classroom_member(classroom_id, auth.uid())
  );

-- Tạo/Sửa/Xóa session: Chỉ Teacher của lớp
DROP POLICY IF EXISTS "Teacher can create session" ON public.class_sessions;
CREATE POLICY "Teacher can create session"
  ON public.class_sessions FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid() AND
    public.is_classroom_teacher(classroom_id, auth.uid())
  );

DROP POLICY IF EXISTS "Teacher can update session" ON public.class_sessions;
CREATE POLICY "Teacher can update session"
  ON public.class_sessions FOR UPDATE
  USING (
    teacher_id = auth.uid()
  );

-- 4.2. Quyền trên session_participants
-- Xem: Thành viên trong cùng lớp học
DROP POLICY IF EXISTS "Session members can view participants" ON public.session_participants;
CREATE POLICY "Session members can view participants"
  ON public.session_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

-- Tham gia: Chỉ cho phép học viên của lớp hoặc chính giáo viên
DROP POLICY IF EXISTS "Authorized users can join session" ON public.session_participants;
CREATE POLICY "Authorized users can join session"
  ON public.session_participants FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

-- Cập nhật trạng thái người tham gia: User tự cập nhật mic/camera của mình, hoặc Teacher cập nhật
DROP POLICY IF EXISTS "Users or Teacher can update participant" ON public.session_participants;
CREATE POLICY "Users or Teacher can update participant"
  ON public.session_participants FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
  );

-- 4.3. Quyền trên session_chat_messages
-- Xem: Người tham gia trong session
DROP POLICY IF EXISTS "Participants can view chat messages" ON public.session_chat_messages;
CREATE POLICY "Participants can view chat messages"
  ON public.session_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        public.is_classroom_member(s.classroom_id, auth.uid())
      )
    )
  );

-- Gửi tin nhắn: User thuộc session và session chưa bị mute chat (trừ giáo viên)
DROP POLICY IF EXISTS "Participants can send chat message" ON public.session_chat_messages;
CREATE POLICY "Participants can send chat message"
  ON public.session_chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (
        s.teacher_id = auth.uid() OR
        (
          s.is_chat_muted = false AND
          public.is_classroom_member(s.classroom_id, auth.uid())
        )
      )
    )
  );

-- Xóa tin nhắn: Chỉ giáo viên mới được xóa tin nhắn
DROP POLICY IF EXISTS "Teacher can delete chat message" ON public.session_chat_messages;
CREATE POLICY "Teacher can delete chat message"
  ON public.session_chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
  );
