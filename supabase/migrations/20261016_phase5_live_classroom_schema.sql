-- =========================================================================
-- HANZIGO MIGRATION: PHASE 5 & 5.1 - LIVE CLASSROOM WEBRTC SFU & REALTIME
-- =========================================================================
-- Idempotent schema definition, RLS policies, anti-escalation triggers,
-- and atomic race-free concurrency control for 1 teacher + 50 students.
-- =========================================================================

-- 1. Table: class_sessions
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

CREATE INDEX IF NOT EXISTS idx_sessions_classroom ON public.class_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON public.class_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.class_sessions(status);

-- 2. Table: session_participants
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
  is_mic_allowed BOOLEAN DEFAULT false,
  attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'late', 'absent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_session_user_pair UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_part_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_part_user ON public.session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_part_session_active ON public.session_participants(session_id, left_at) WHERE left_at IS NULL;

-- 3. Table: session_chat_messages
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for class_sessions
DROP POLICY IF EXISTS "Members can view class sessions" ON public.class_sessions;
CREATE POLICY "Members can view class sessions"
  ON public.class_sessions FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    public.is_classroom_member(classroom_id, auth.uid())
  );

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
  USING (teacher_id = auth.uid() OR public.is_admin());

-- 6. RLS Policies for session_participants
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

DROP POLICY IF EXISTS "Users or Teacher can update participant" ON public.session_participants;
CREATE POLICY "Users or Teacher can update participant"
  ON public.session_participants FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = session_id AND (s.teacher_id = auth.uid() OR public.is_admin())
    )
  );

-- 7. Anti-Privilege Escalation Trigger (Prevents student from self-granting mic or changing role)
CREATE OR REPLACE FUNCTION public.prevent_participant_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_is_teacher BOOLEAN := false;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    v_is_teacher := public.is_admin() OR EXISTS (
      SELECT 1 FROM public.class_sessions s
      WHERE s.id = OLD.session_id AND s.teacher_id = auth.uid()
    );
  END IF;

  IF NOT v_is_teacher THEN
    IF (NEW.is_mic_allowed IS DISTINCT FROM OLD.is_mic_allowed) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Chỉ giáo viên phụ trách phòng mới có quyền cấp quyền Micro.';
    END IF;
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự thay đổi vai trò trong phòng học.';
    END IF;
    IF (NEW.attendance_status IS DISTINCT FROM OLD.attendance_status) THEN
      RAISE EXCEPTION 'Quyền hạn bị từ chối: Học viên không được phép tự sửa trạng thái điểm danh.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_prevent_participant_privilege_escalation ON public.session_participants;
CREATE TRIGGER trg_prevent_participant_privilege_escalation
  BEFORE UPDATE ON public.session_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_participant_privilege_escalation();

-- 8. Atomic Serialized RPC for Joining Live Session (Guarantees zero race conditions at 50 capacity)
CREATE OR REPLACE FUNCTION public.atomic_join_live_session(
  p_session_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'student',
  p_attendance_status TEXT DEFAULT 'present'
)
RETURNS JSONB AS $$
DECLARE
  v_session RECORD;
  v_active_count INT;
  v_participant RECORD;
  v_mic_allowed BOOLEAN := false;
BEGIN
  -- Row-level lock on the session to serialize concurrent joins
  SELECT * INTO v_session
  FROM public.class_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Phòng học trực tuyến không tồn tại.';
  END IF;

  IF v_session.status = 'ended' OR v_session.ended_at IS NOT NULL THEN
    RAISE EXCEPTION 'Phiên học trực tuyến đã kết thúc.';
  END IF;

  -- Verify teacher vs student
  IF v_session.teacher_id = p_user_id THEN
    p_role := 'teacher';
    v_mic_allowed := true;
  ELSE
    p_role := 'student';

    -- Verify active student membership in the classroom
    IF NOT EXISTS (
      SELECT 1 FROM public.class_members
      WHERE classroom_id = v_session.classroom_id
        AND student_id = p_user_id
        AND status = 'active'
    ) THEN
      RAISE EXCEPTION 'Bạn chưa tham gia lớp học này.';
    END IF;

    -- Check active student count excluding teachers and reconnecting user
    SELECT COUNT(*) INTO v_active_count
    FROM public.session_participants
    WHERE session_id = p_session_id
      AND left_at IS NULL
      AND role != 'teacher'
      AND user_id != p_user_id;

    IF v_active_count >= COALESCE(v_session.max_capacity, 50) THEN
      RAISE EXCEPTION 'Phòng học đã đạt sĩ số tối đa (% học viên).', COALESCE(v_session.max_capacity, 50);
    END IF;

    -- Preserve existing mic permission if already granted
    SELECT is_mic_allowed INTO v_mic_allowed
    FROM public.session_participants
    WHERE session_id = p_session_id AND user_id = p_user_id;
    v_mic_allowed := COALESCE(v_mic_allowed, false);
  END IF;

  -- Upsert participant record
  INSERT INTO public.session_participants (
    session_id, user_id, role, joined_at, left_at, is_mic_allowed, attendance_status
  ) VALUES (
    p_session_id, p_user_id, p_role, NOW(), NULL, v_mic_allowed, p_attendance_status
  )
  ON CONFLICT (session_id, user_id) DO UPDATE SET
    left_at = NULL,
    joined_at = NOW(),
    role = EXCLUDED.role,
    attendance_status = EXCLUDED.attendance_status
  RETURNING * INTO v_participant;

  RETURN to_jsonb(v_participant);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Explicitly configure execution privileges on RPC function
REVOKE EXECUTE ON FUNCTION public.atomic_join_live_session(UUID, UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.atomic_join_live_session(UUID, UUID, TEXT, TEXT) TO authenticated, service_role;

-- 9. Realtime Publication Sync
ALTER TABLE public.session_participants REPLICA IDENTITY FULL;
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_chat_messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
