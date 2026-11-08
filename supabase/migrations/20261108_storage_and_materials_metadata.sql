-- =========================================================================
-- MIGRATION: 20261108_storage_and_materials_metadata.sql
-- HanziGo Phase 23 / Task 23.03: Direct Supabase Storage Upload & Metadata
-- =========================================================================

-- 1. ADD EXTENDED STORAGE METADATA COLUMNS TO public.class_materials
-- Cho phép class_materials quản lý cả URL ngoài (legacy) lẫn direct Supabase Storage
ALTER TABLE public.class_materials 
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'materials',
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS is_local_storage BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. ADD EXTENDED STORAGE METADATA COLUMNS TO public.materials (Thư viện chung)
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. CREATE INDEXES FOR FAST STORAGE PATH & CLASSROOM LOOKUP
CREATE INDEX IF NOT EXISTS idx_class_materials_storage ON public.class_materials(storage_bucket, storage_path);
CREATE INDEX IF NOT EXISTS idx_materials_storage ON public.materials(storage_bucket, storage_path);
CREATE INDEX IF NOT EXISTS idx_class_materials_teacher ON public.class_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_classroom ON public.class_materials(classroom_id);

-- 4. CONFIGURE STORAGE BUCKET: 'materials'
-- Bucket 'materials' được cấu hình private (public = false) để kiểm soát quyền đọc qua RLS/Storage Policy
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  false,
  52428800, -- 50MB (50 * 1024 * 1024)
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 5. STORAGE POLICIES FOR 'materials' BUCKET
-- Cấu trúc đường dẫn:
-- Path dạng: classroom/{classroom_id}/{material_id}/{safe_filename}
-- Hoặc: general/{owner_id}/{material_id}/{safe_filename}

-- Helper hàm lấy segment từ storage path
-- Ví dụ: storage.foldername(name)

-- 5.1 SELECT Policy (Tải / Xem file)
-- Người dùng được tải file nếu:
-- a) Là giáo viên sở hữu lớp học hoặc là admin
-- b) Là học viên active của lớp học đó
-- c) Là người tải lên file (đối với general)
DROP POLICY IF EXISTS "materials_storage_select_policy" ON storage.objects;
CREATE POLICY "materials_storage_select_policy" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'materials' AND (
    public.is_admin()
    -- Đối với path: classroom/<classroom_id>/...
    OR (
      (storage.foldername(name))[1] = 'classroom'
      AND (
        -- Giáo viên tạo lớp
        EXISTS (
          SELECT 1 FROM public.classrooms c
          WHERE c.id::text = (storage.foldername(name))[2]
            AND c.teacher_id = auth.uid()
        )
        -- Học viên active của lớp
        OR EXISTS (
          SELECT 1 FROM public.class_members cm
          WHERE cm.classroom_id::text = (storage.foldername(name))[2]
            AND cm.student_id = auth.uid()
            AND cm.status = 'active'
        )
      )
    )
    -- Đối với path: general/<owner_id>/...
    OR (
      (storage.foldername(name))[1] = 'general'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

-- 5.2 INSERT Policy (Tải lên file)
-- Chỉ giáo viên tạo lớp hoặc admin mới được upload vào classroom/<classroom_id>/...
-- Người dùng xác thực được upload vào general/<auth.uid()>/...
DROP POLICY IF EXISTS "materials_storage_insert_policy" ON storage.objects;
CREATE POLICY "materials_storage_insert_policy" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'materials' AND (
    public.is_admin()
    OR (
      (storage.foldername(name))[1] = 'classroom'
      AND EXISTS (
        SELECT 1 FROM public.classrooms c
        WHERE c.id::text = (storage.foldername(name))[2]
          AND c.teacher_id = auth.uid()
      )
    )
    OR (
      (storage.foldername(name))[1] = 'general'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

-- 5.3 UPDATE Policy (Thay thế file)
DROP POLICY IF EXISTS "materials_storage_update_policy" ON storage.objects;
CREATE POLICY "materials_storage_update_policy" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'materials' AND (
    public.is_admin()
    OR (
      (storage.foldername(name))[1] = 'classroom'
      AND EXISTS (
        SELECT 1 FROM public.classrooms c
        WHERE c.id::text = (storage.foldername(name))[2]
          AND c.teacher_id = auth.uid()
      )
    )
    OR (
      (storage.foldername(name))[1] = 'general'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

-- 5.4 DELETE Policy (Xóa file)
DROP POLICY IF EXISTS "materials_storage_delete_policy" ON storage.objects;
CREATE POLICY "materials_storage_delete_policy" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'materials' AND (
    public.is_admin()
    OR (
      (storage.foldername(name))[1] = 'classroom'
      AND EXISTS (
        SELECT 1 FROM public.classrooms c
        WHERE c.id::text = (storage.foldername(name))[2]
          AND c.teacher_id = auth.uid()
      )
    )
    OR (
      (storage.foldername(name))[1] = 'general'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

