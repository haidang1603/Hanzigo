# BÁO CÁO NGHIỆM THU: PHASE 24 / TASK 24.08C.1A.1 FINAL PATCH
# LEGACY UUID PRECISION, SOURCE COLLISION DETECTION & AUDIT RPC ACL CONSISTENCY

**Phiên bản:** 1.0.0  
**Ngày hoàn thành:** 08/11/2026  
**Trạng thái triển khai:** `PRODUCTION VERIFICATION PARTIAL` (Code & Test hoàn tất 100%, chờ thực thi SQL Editor trên Supabase Cloud)  
**Tập tin di chuyển trọng tâm:** [20261108_community_legacy_integrity_and_cursor_correction.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql)  
**Tập tin Schema đối soát:** [schema.sql](file:///d:/DELL/Dowloads/HanziGo/supabase/schema.sql)  
**Tập tin kiểm thử:** [communityLegacyIntegrityAndCursorCorrection.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/communityLegacyIntegrityAndCursorCorrection.test.js)

---

## 1. TỔNG QUAN VÀ MỤC TIÊU BẢN VÁ CUỐI

Bản vá cuối **Task 24.08C.1A.1** được thực hiện nhằm xử lý dứt điểm các điểm kỹ thuật nhạy cảm được phát hiện trong quá trình nghiệm thu Task 24.08C.1A:

1. **Loại bỏ hoàn toàn nhận diện legacy bằng `content LIKE` hoặc `COUNT(*) = 1` không chặt chẽ**:
   - Sử dụng định danh Primary Key UUID được trích xuất và xác thực trực tiếp từ cơ sở dữ liệu Supabase Cloud.
   - Thắt chặt điều kiện tiên quyết (preconditions): Kiểm tra UUID tồn tại, thuộc đúng `post_id`, và `legacy_source_id` đích chưa bị bản ghi nào khác chiếm giữ. Nếu vi phạm bất kỳ điều kiện nào, ngay lập tức `RAISE EXCEPTION` và tự động rollback toàn bộ transaction.
2. **Kiểm tra va chạm định danh nguồn (Source ID Collision Detection)**:
   - Thêm bước tiền kiểm (precheck) toàn bộ mảng `comments` JSONB trên tất cả các bài viết trong hệ thống.
   - Phát hiện các phần tử trùng lặp `legacy_source_id` (hoặc index fallback) trong phạm vi cùng một bài viết trước khi chèn vào `community_comments`.
3. **Chuẩn hóa PostgreSQL Partial Unique Index Conflict Specification**:
   - Khắc phục lỗi `ERROR: 42P10` bằng cách khai báo đúng mệnh đề lọc `WHERE legacy_source_id IS NOT NULL` trong cú pháp `ON CONFLICT (post_id, legacy_source_id) WHERE legacy_source_id IS NOT NULL DO NOTHING`.
4. **Nhất quán chính sách truy cập Audit RPC (`audit_community_post_counters`)**:
   - Áp dụng một chính sách kiểm soát truy cập duy nhất, nghiêm ngặt: Chỉ duy nhất caller mang vai trò `service_role` (hoặc superuser/replication) mới được phép thực thi function.
   - Thu hồi toàn bộ quyền `EXECUTE` từ `PUBLIC`, `anon`, và `authenticated` (kể cả Active Admin khi gọi qua PostgREST client cũng bị từ chối; chỉ backend backend/management endpoints có Service Role JWT mới có quyền truy cập).
5. **Bảo toàn hàm và đối tượng phụ thuộc (In-place Function Replacement)**:
   - Sử dụng `CREATE OR REPLACE FUNCTION`, tuyệt đối không dùng `DROP FUNCTION IF EXISTS ... CASCADE`.

---

## 2. KẾT QUẢ ĐỐI SOÁT DỮ LIỆU THỰC TẾ TRÊN SUPABASE CLOUD

### 2.1. Xác thực Primary Key UUID của 2 bản ghi lịch sử

Truy vấn đối soát trực tiếp trên database đã xác nhận chính xác UUID của 2 bản ghi:

| Thuộc tính | Post 7 Legacy Comment | Post 3 Legacy Comment |
| :--- | :--- | :--- |
| **Primary Key UUID** | `d76d4034-25c9-4d67-a601-9fa5cb777b2f` | `22eb72d5-38ef-4a2d-9454-e4121bce91b7` |
| **`post_id`** | `7` | `3` |
| **`legacy_source_id` mục tiêu** | `'comment-1791666635196'` | `'c1'` |
| **`legacy_author_name` snapshot** | `'Alibaba và 36 tên Thanh Hoá'` | `'Nguyễn Văn Minh'` |
| **`author_id`** | `NULL` (không liên kết auth account) | `NULL` (không liên kết auth account) |
| **Nội dung** | `'ní hảo ní nha'` | `'Bổ ích quá anh'` |

### 2.2. Kiểm tra Source Collision trong JSONB Comments
Truy vấn kiểm tra trùng lặp ID nguồn trong mảng `comments` JSONB:
```sql
SELECT post_id, source_id, COUNT(*) AS occurrences
FROM (
  SELECT p.id AS post_id,
         COALESCE(NULLIF(TRIM(c->>'id'), ''), 'idx_' || (row_number() OVER (PARTITION BY p.id))::text) AS source_id
  FROM public.community_posts p,
       jsonb_array_elements(p.comments) c
  WHERE p.comments IS NOT NULL AND jsonb_typeof(p.comments) = 'array'
) sub
GROUP BY post_id, source_id
HAVING COUNT(*) > 1;
```
**Kết quả:** `0` hàng trùng lặp. Toàn bộ mảng JSONB comments hiện tại đều có ID duy nhất trong từng bài viết.

---

## 3. CHI TIẾT CÁC ĐIỂM SỬA ĐỔI CHÍNH TRONG MIGRATION SQL

### 3.1. Xác thực và cập nhật bản ghi legacy bằng UUID chính xác (Section 5)
```sql
DO $$
DECLARE
  v_p7_uuid UUID := 'd76d4034-25c9-4d67-a601-9fa5cb777b2f'::uuid;
  v_p3_uuid UUID := '22eb72d5-38ef-4a2d-9454-e4121bce91b7'::uuid;
  v_p7_exists BOOLEAN;
  v_p3_exists BOOLEAN;
  v_collision_count INT;
BEGIN
  -- 1. Kiểm tra tồn tại và đúng post_id cho Post 7
  SELECT EXISTS (
    SELECT 1 FROM public.community_comments
    WHERE id = v_p7_uuid AND post_id = 7
  ) INTO v_p7_exists;

  IF NOT v_p7_exists THEN
    RAISE EXCEPTION 'MIGRATION ABORT: Post 7 comment with verified UUID % does not exist or has wrong post_id', v_p7_uuid;
  END IF;

  -- 2. Kiểm tra xung đột legacy_source_id cho Post 7
  SELECT COUNT(*) INTO v_collision_count
  FROM public.community_comments
  WHERE post_id = 7 AND legacy_source_id = 'comment-1791666635196' AND id <> v_p7_uuid;

  IF v_collision_count > 0 THEN
    RAISE EXCEPTION 'MIGRATION ABORT: legacy_source_id comment-1791666635196 on post 7 is already held by another comment!';
  END IF;

  -- 3. Cập nhật chính xác bản ghi Post 7
  UPDATE public.community_comments
  SET legacy_source_id = 'comment-1791666635196',
      legacy_author_name = 'Alibaba và 36 tên Thanh Hoá',
      author_id = NULL
  WHERE id = v_p7_uuid;

  -- (Tương tự cho Post 3 với UUID v_p3_uuid và source ID 'c1')
  ...
END $$;
```

### 3.2. Tiền kiểm tra Source ID Collision trước khi Insert (Section 6.1)
```sql
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.id AS post_id,
           COALESCE(NULLIF(TRIM(elem.val->>'id'), ''), 'idx_' || elem.ord::text) AS legacy_source_id,
           COUNT(*) AS occurrences
    FROM public.community_posts p,
         LATERAL jsonb_array_elements(p.comments) WITH ORDINALITY AS elem(val, ord)
    WHERE p.comments IS NOT NULL AND jsonb_typeof(p.comments) = 'array'
    GROUP BY p.id, COALESCE(NULLIF(TRIM(elem.val->>'id'), ''), 'idx_' || elem.ord::text)
    HAVING COUNT(*) > 1
  ) LOOP
    RAISE EXCEPTION 'MIGRATION ABORT: Duplicate legacy_source_id % found in post % (% occurrences) in JSONB comments array',
      r.legacy_source_id, r.post_id, r.occurrences;
  END LOOP;
END $$;
```

### 3.3. Khắc phục Partial Unique Index Conflict Target (Section 6.2)
Chỉ mục duy nhất được định nghĩa:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_community_comments_post_legacy_source 
ON public.community_comments(post_id, legacy_source_id) 
WHERE legacy_source_id IS NOT NULL;
```
Cú pháp INSERT phải phản ánh đúng điều kiện `WHERE`:
```sql
INSERT INTO public.community_comments (
  post_id,
  content,
  author_id,
  legacy_author_name,
  legacy_source_id,
  created_at
)
SELECT ...
ON CONFLICT (post_id, legacy_source_id) WHERE legacy_source_id IS NOT NULL DO NOTHING;
```

### 3.4. Thắt chặt quyền truy cập Audit RPC (Section 9)
```sql
CREATE OR REPLACE FUNCTION public.audit_community_post_counters()
...
DECLARE
  v_jwt_role TEXT;
BEGIN
  v_jwt_role := COALESCE(
    current_setting('request.jwt.claim.role', true),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  );

  -- Chỉ duy nhất service_role được phép thực thi
  IF current_user NOT IN ('postgres', 'supabase_admin')
     AND session_user NOT IN ('postgres', 'supabase_admin')
     AND COALESCE(v_jwt_role, '') <> 'service_role' THEN
    RAISE EXCEPTION 'ACCESS DENIED: audit_community_post_counters() is reserved strictly for service_role telemetry.'
      USING ERRCODE = '42501';
  END IF;
  ...
END;
$$;

-- Phân quyền nghiêm ngặt
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM anon;
REVOKE EXECUTE ON FUNCTION public.audit_community_post_counters() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO service_role;
```

---

## 4. KẾT QUẢ KIỂM THỬ VÀ XÁC MINH TOÀN DIỆN

### 4.1. Kết quả Unit / Integration Tests
Bộ test suite mới và regression suites đã được chạy và đạt tỷ lệ thành công 100%:

```
> npm test

PASS tests/communityLegacyIntegrityAndCursorCorrection.test.js (29/29 tests)
  ...
  √ 5.9 Audit RPC Caller Matrix: Strictly service_role only (6/6 scenarios pass)
  √ 5.10 Precondition validation for legacy comment UUID resolution
  √ 5.11 Source ID collision detection precheck in JSONB comments
  √ 6.2 Live Supabase check: Anonymous client call to audit RPC returns 42501

Test Suites: 38 passed, 38 total
Tests:       191 passed, 191 total
Snapshots:   0 total
Time:        4.512 s
```

### 4.2. Linting & Production Build
- **Linter**: `npm run lint` hoàn thành mà không có bất kỳ lỗi hoặc cảnh báo nào (`0 errors, 0 warnings`).
- **Build**: `npm run build` hoàn thành thành công trong 906ms (`dist/index.html` và các bundle tạo thành công không có lỗi biên dịch).

---

## 5. HƯỚNG DẪN THỰC THI TRÊN SUPABASE CLOUD SQL EDITOR

Để áp dụng an toàn bản di chuyển trên môi trường Supabase Cloud:

1. Đăng nhập vào trang quản trị Supabase Dashboard của dự án HanziGo.
2. Điều hướng tới **SQL Editor** -> Tạo **New Query**.
3. Dán toàn bộ nội dung của tập tin `supabase/migrations/20261108_community_legacy_integrity_and_cursor_correction.sql`.
4. Nhấn **Run** (Ctrl + Enter).
5. Toàn bộ logic được bao bọc trong giao dịch (Transaction block), đảm bảo tính toàn vẹn tuyệt đối: nếu bất kỳ điều kiện nào (như sai UUID hoặc trùng ID) bị vi phạm, PostgreSQL sẽ rollback toàn bộ và không làm ảnh hưởng tới dữ liệu hiện có.

---

## 6. QUY TRÌNH ROLLBACK (KHI CẦN THIẾT)

Nếu cần đảo ngược các thay đổi:
1. Chạy lại trigger function từ bản backup trước đó (trong `supabase/schema.sql`).
2. Khôi phục quyền truy cập RPC nếu cần kiểm tra đặc thù:
   ```sql
   GRANT EXECUTE ON FUNCTION public.audit_community_post_counters() TO authenticated;
   ```
3. Xóa các bình luận đã chèn qua migration (chỉ giữ lại bài viết và dữ liệu gốc):
   ```sql
   DELETE FROM public.community_comments WHERE legacy_source_id IS NOT NULL;
   ```

---

## 7. KẾT LUẬN & BƯỚC TIẾP THEO

- **Task 24.08C.1A.1 Final Patch** đã hoàn thành đạt chuẩn kỹ thuật cao nhất: Loại bỏ hoàn toàn match chuỗi, ràng buộc chính xác UUID thật, phát hiện va chạm ID nguồn, sửa đúng partial index syntax, và thắt chặt bảo mật RPC.
- Mọi ràng buộc bảo tồn dữ liệu và phạm vi không xâm lấn đã được tuân thủ nghiêm ngặt.
- Sẵn sàng chuyển giao sang **Phase 24 / Task 24.08D — Community Reports & Moderation UI** sau khi hoàn tất kiểm chứng trên Supabase Cloud.

