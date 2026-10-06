-- =========================================================================
-- HANZI GO - MIGRATION 08: LIVE CHINESE TEACHING TOOLS & SESSION STATE
-- =========================================================================

-- Bổ sung các cột lưu trạng thái giảng dạy tương tác realtime vào class_sessions
ALTER TABLE public.class_sessions
  ADD COLUMN IF NOT EXISTS active_tool TEXT DEFAULT 'hanzi' 
    CHECK (active_tool IN ('hanzi', 'pinyin', 'vocabulary', 'pronunciation', 'quiz', 'listening', 'grammar', 'whiteboard')),
  ADD COLUMN IF NOT EXISTS teaching_state JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS session_history JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS lesson_summary JSONB DEFAULT '{}'::jsonb;

-- Chỉ mục hỗ trợ truy vấn công cụ đang dùng
CREATE INDEX IF NOT EXISTS idx_sessions_active_tool ON public.class_sessions(active_tool);

-- Chính sách RLS cho phép giáo viên cập nhật teaching_state
-- (Teacher can update session đã có trong migration 06, bổ sung comment đảm bảo an toàn)
COMMENT ON COLUMN public.class_sessions.active_tool IS 'Công cụ giảng dạy tiếng Trung đang hoạt động (hanzi, pinyin, vocabulary, pronunciation, quiz, listening, grammar, whiteboard)';
COMMENT ON COLUMN public.class_sessions.teaching_state IS 'Trạng thái dữ liệu của công cụ đang trình chiếu (Quiz, phát âm, từ vựng, ngữ pháp, bảng vẽ vector)';
COMMENT ON COLUMN public.class_sessions.session_history IS 'Lịch sử phiên học (thời lượng, số lượng tham gia, kết quả bài tập)';
COMMENT ON COLUMN public.class_sessions.lesson_summary IS 'Bản tóm tắt bài giảng AI thông minh sau giờ học';
