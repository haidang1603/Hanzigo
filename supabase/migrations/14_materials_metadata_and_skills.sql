-- =========================================================================
-- MIGRATION 14: MATERIALS METADATA, SKILLS & ACADEMIC VERIFICATION
-- =========================================================================
-- Bổ sung metadata kiểm chứng học thuật, phân loại kỹ năng, liên kết lộ trình
-- và thắt chặt chính sách RLS cho kho tài liệu materials.
-- =========================================================================

-- 1. Bổ sung các cột metadata cho bảng materials (nếu chưa tồn tại)
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT 'Tổng hợp đa kỹ năng';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Song ngữ Trung - Việt';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'Tài liệu giáo dục công cộng';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified';
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS related_lesson_id TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- 2. Chỉ mục tối ưu hóa tìm kiếm và lọc dữ liệu
CREATE INDEX IF NOT EXISTS idx_materials_verification ON public.materials(verification_status);
CREATE INDEX IF NOT EXISTS idx_materials_skills ON public.materials(skills);
CREATE INDEX IF NOT EXISTS idx_materials_is_hidden ON public.materials(is_hidden);

-- 3. Cập nhật chính sách RLS (Row Level Security)
-- Đảm bảo người học chỉ nhìn thấy tài liệu đã được công khai (is_hidden = false)
-- Quản trị viên (Admin) xem được toàn bộ tài liệu bao gồm cả tài liệu đang ẩn
DROP POLICY IF EXISTS "materials_select_public" ON public.materials;

CREATE POLICY "materials_select_public" ON public.materials
  FOR SELECT
  USING (
    is_hidden = false 
    OR 
    public.is_admin()
  );

-- Giữ nguyên quyền INSERT, UPDATE, DELETE chỉ dành cho Quản trị viên (Admin)
-- (Đã được thiết lập trong migration 03: materials_admin_insert, materials_admin_update, materials_admin_delete)
