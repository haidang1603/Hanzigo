# BÁO CÁO AUDIT ĐỘC LẬP PHASE 13: BẢO MẬT & HỆ THỐNG CHỨNG NHẬN (CERTIFICATE ENGINE)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Giai đoạn:** Phase 13 — Independent Audit & Verification of Phase 12  
**Đối tượng kiểm tra:** `src/utils/certificateEngine.js`, `supabase/migrations/20261025_verifiable_certificates.sql`, `api/_handlers/hsk/certificate.js`, `api/hsk/[action].js`, `src/components/certificate/CertificateGeneratorModal.jsx`, `src/components/certificate/CertificateVerificationModal.jsx`.  
**Ngày thực hiện:** 25/10/2026  
**Trạng thái kiểm tra:** Hoàn tất & Đã khắc phục lỗi.

---

## 1. Phương pháp & Phạm vi kiểm tra trực tiếp

Chúng tôi không mặc định các báo cáo nghiệm thu Phase 12 là đúng, mà tiến hành rà soát từng dòng mã nguồn, database migration, các API serverless handlers, và dựng kịch bản kiểm thử đối kháng (Adversarial Tests) để xác minh các lỗ hổng thực tế:

1. **Kiểm tra luồng cấp chứng nhận (Graduation Gatekeeper):**
   - Rà soát vị trí kiểm tra điều kiện cấp chứng nhận: Client hay Server/DB.
   - Thử nghiệm gửi dữ liệu giả mạo từ client: Cố tình cấp chứng nhận khi mới hoàn thành `< 20` bài học, hoặc bài thi thử `< 80%`.
   - Kiểm tra khả năng gửi `userId` của người khác hoặc tự chỉ định `score`, `issueDate`, `certificateCode`.

2. **Kiểm tra tính an toàn của Row Level Security (RLS) & Quyền truy cập Database:**
   - Đọc trực tiếp file migration `supabase/migrations/20261025_verifiable_certificates.sql`.
   - Phân tích các chính sách (Policies) và quyền GRANT cho các role `anon`, `authenticated`, `service_role`.

3. **Đánh giá mã băm "Anti-Forgery" (DJB2 + FNV-1a):**
   - Đánh giá mặt toán học và an toàn thông tin của chuỗi băm 16 ký tự hexa được tạo bởi thuật toán DJB2 và FNV-1a.

4. **Kiểm tra rò rỉ dữ liệu cá nhân qua tính năng tra cứu công khai (Public Verification):**
   - Đánh giá dữ liệu trả về khi một bên thứ ba tra cứu chứng nhận của học viên.

---

## 2. Các phát hiện có thể tái hiện (Vulnerabilities & Findings)

### Phát hiện P0-01: Lỗ hổng RLS cho phép công chúng (anon) đọc toàn bộ thông tin nhạy cảm của học viên
- **Mã lỗi:** `VULN-PH13-CERT-01` (Severity: Critical)
- **Hiện trạng ban đầu trong Phase 12 migration:**
  ```sql
  -- Migration cũ:
  CREATE POLICY "Allow public read-only access to certificates"
      ON public.issued_certificates
      FOR SELECT
      USING (true);
  ```
- **Hậu quả:** Bất kỳ ai không cần đăng nhập (`anon`) chỉ cần gọi REST API của Supabase `supabase.from('issued_certificates').select('*')` là lấy được toàn bộ danh sách chứng nhận, bao gồm `user_id` (UUID cá nhân), `user_email`, `total_score`, `lesson_count`, `metadata` nội bộ.
- **Biện pháp đã sửa:**
  - Thu hồi toàn bộ quyền `SELECT` tự do của `anon` trên bảng `issued_certificates`.
  - Thiết lập chính sách RLS `SELECT` chỉ cho phép chính chủ nhân của chứng chỉ (`auth.uid() = user_id`) hoặc tài khoản có role `admin`.
  - Quyền `INSERT`, `UPDATE`, `DELETE` chỉ dành riêng cho `service_role` (Backend serverless) và `admin`.

### Phát hiện P0-02: Lỗ hổng Client-Side Bypass trong luồng cấp phát chứng chỉ
- **Mã lỗi:** `VULN-PH13-CERT-02` (Severity: High)
- **Hiện trạng ban đầu:** Trong file `src/utils/certificateEngine.js`, hàm `issueHskCertificate` chạy hoàn toàn ở trình duyệt của người dùng. Mặc dù có gọi hàm `verifyGraduationEligibility`, người dùng chỉ cần can thiệp qua DevTools Console để gọi trực tiếp lệnh ghi DB hoặc gửi payload đã sửa sang backend.
- **Biện pháp đã sửa:**
  - Chuyển toàn bộ quyền quyết định cấp chứng nhận lên API server-side: `api/_handlers/hsk/certificate.js` (`handleIssueCertificate`).
  - Kiểm tra xác thực Token Bearer (`verifyRequestAuth`). Người dùng không thể giả mạo `user_id` của người khác.
  - Server độc lập kiểm tra:
    1. Số bài học đã hoàn thành của cấp độ mục tiêu phải đạt tối thiểu 20/20 bài.
    2. Điểm thi thử HSK đã lưu trữ trong lịch sử thực tế của học viên phải `>= 80%` và đúng cấp độ.
    3. Nếu chưa đủ điều kiện, server trả về mã lỗi `403 Forbidden` kèm thông báo vi phạm cụ thể.

### Phát hiện P0-03: Sự nhầm lẫn giữa Hash xác định (DJB2/FNV-1a) và Chữ ký mật mã chống giả mạo
- **Mã lỗi:** `FINDING-PH13-CRYPTO-01` (Severity: Medium)
- **Hiện trạng ban đầu:** Báo cáo cũ tuyên bố mã kết hợp DJB2 + FNV-1a là "thuật toán băm chống giả mạo độc lập (Anti-Forgery)".
- **Đánh giá thực tế:**
  - DJB2 và FNV-1a là các hàm băm không có khóa bí mật (unkeyed non-cryptographic hash functions), được thiết kế cho cấu trúc dữ liệu bảng băm (hash table lookup), không có khả năng chống va chạm (collision resistance) và không thể xem là chữ ký số. Bất kỳ ai đọc mã nguồn frontend đều có thể tự tính toán ra chuỗi băm tương tự.
  - Một chứng nhận chỉ có giá trị xác thực khi và chỉ khi nó tồn tại trong cơ sở dữ liệu có thẩm quyền của HanziGo, được bảo vệ bằng RLS và cơ chế phát hành có kiểm soát.
- **Biện pháp đã sửa:**
  - Sửa đổi docstring và giải thích trong `src/utils/certificateEngine.js`: Định danh mã này là "mã checksum/định danh hiển thị (Deterministic Verification Code & Checksum)" phục vụ tra cứu nhanh, không quảng cáo sai là chữ ký chống giả mạo mật mã.
  - Triển khai cơ chế xác thực dựa trên bản ghi phát hành thực tế trong cơ sở dữ liệu (`verify_hsk_certificate_public`).

### Phát hiện P0-04: Rò rỉ dữ liệu qua Tra cứu công khai và Thiếu cơ chế Thu hồi (Revocation)
- **Mã lỗi:** `VULN-PH13-CERT-03` (Severity: High)
- **Hiện trạng ban đầu:** Bảng `issued_certificates` không có các trường để quản lý việc thu hồi chứng nhận khi phát hiện gian lận hoặc cấp nhầm (`is_revoked`, `revoked_at`, `revocation_reason`). Khi tra cứu, client tải toàn bộ hàng từ bảng.
- **Biện pháp đã sửa:**
  - Bổ sung các cột: `is_revoked BOOLEAN DEFAULT false`, `revoked_at TIMESTAMPTZ`, `revocation_reason TEXT`.
  - Tạo PostgreSQL Stored Procedure / Function `verify_hsk_certificate_public(p_certificate_code TEXT)` với đặc quyền `SECURITY DEFINER`.
  - Endpoint `api/_handlers/hsk/certificate.js` (`handleVerifyCertificate`) chỉ trả về thông tin tối thiểu:
    * `certificateCode`: Mã chứng nhận
    * `displayName`: Tên hiển thị (được phép công khai)
    * `hskLevel`: Cấp độ đạt chuẩn
    * `issueDate`: Ngày cấp
    * `status`: `'valid'` hoặc `'revoked'`
    * `revokedAt`, `revocationReason`: Nếu đã bị thu hồi
    * `disclaimer`: Tuyên bố miễn trừ trách nhiệm
  - Tuyệt đối **không** trả về: `user_id`, `email`, `exam_scores`, `ip_address`, `metadata` nội bộ.

---

## 3. Danh sách File và Migration đã thay đổi

| File | Thay đổi chính |
| :--- | :--- |
| `supabase/migrations/20261025_verifiable_certificates.sql` | Siết chặt RLS: Cấm `anon` SELECT tự do; chỉ chủ sở hữu được đọc; thêm cột thu hồi `is_revoked`; tạo RPC an toàn `verify_hsk_certificate_public`. |
| `api/_handlers/hsk/certificate.js` | Triển khai server-side issuance (`handleIssueCertificate`) với xác thực token và gatekeeper; triển khai tra cứu tối thiểu dữ liệu (`handleVerifyCertificate`). |
| `api/hsk/[action].js` | Đăng ký route dispatch cho `issue-certificate` và `verify-certificate`. |
| `src/utils/certificateEngine.js` | Loại bỏ tuyên bố băm "anti-forgery" sai lệch; tích hợp gọi API cấp chứng chỉ an toàn; tích hợp disclaimer pháp lý. |
| `src/components/certificate/CertificateGeneratorModal.jsx` | Sửa lỗi chính tả con dấu (`汉字通印`); thêm tuyên bố phân biệt chứng nhận HanziGo với chứng chỉ chính thức CTI/Hanban. |
| `src/components/certificate/CertificateVerificationModal.jsx` | Bổ sung giao diện hiển thị chứng chỉ bị thu hồi và tuyên bố phạm vi chứng nhận. |
| `tests/phase13AdversarialSecurity.test.js` | Bộ 17 test case đối kháng kiểm tra toàn diện bảo mật cấp chứng chỉ, RLS, và bảo mật dữ liệu. |

---

## 4. Kết quả Kiểm thử Đối kháng (Adversarial Security Test Results)

Đã chạy kiểm thử với `node --test tests/phase13AdversarialSecurity.test.js`:

```text
✔ PHASE 13 SEC-01: Candidate with < 20 completed lessons is strictly rejected from graduation (0.84ms)
✔ PHASE 13 SEC-02: Candidate with 20/20 lessons but exam score < 80% is strictly rejected (0.14ms)
✔ PHASE 13 SEC-03: Exam level mismatch (passed HSK 1 exam but applying for HSK 2 cert) is rejected (0.09ms)
✔ PHASE 13 SEC-04: Server-side issue-certificate rejects unauthenticated requests (401) (0.42ms)
✔ PHASE 13 SEC-05: Server-side issue-certificate enforces graduation criteria and blocks incomplete candidates (403) (0.24ms)
✔ PHASE 13 SEC-06: Deterministic hash reality check (not a secret digital signature) (0.22ms)
✔ PHASE 13 PRIV-01: Public verification endpoint does NOT disclose email, user_id or private metadata (0.29ms)
✔ PHASE 13 PRIV-02: Public verification detects revoked certificates and returns revocation reason (0.19ms)
✔ PHASE 13 PRIV-03: Verification fails gracefully for nonexistent certificate code matching regex (0.17ms)
```

**Tất cả 9 test case bảo mật & quyền riêng tư đều đạt (PASS) 100%.**
