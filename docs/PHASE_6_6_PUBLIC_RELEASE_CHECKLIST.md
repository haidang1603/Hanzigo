# HANZIGO — PUBLIC RELEASE & POST-UPDATE COMPLIANCE CHECKLIST
## Phase 6.6: Pre-Flight Verification & Continuous Compliance Protocol

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Phiên bản:** Release Ready (Phase 6.6)  
**Mục tiêu:** Cung cấp bộ quy trình kiểm toán bắt buộc (Gate Checklist) áp dụng trước khi phát hành công khai (Public Release) và sau mỗi lần cập nhật mã nguồn (Post-Update Routine).  

---

### 1. CHECKLIST PHÁP LUẬT THEO PHẠM VI NGƯỜI DÙNG (LEGAL APPLICABILITY MATRIX)

| Văn bản Pháp luật | Phạm vi & Điều kiện áp dụng cho HanziGo | Nghĩa vụ kỹ thuật đã xác minh (Verified) | Nghĩa vụ cần tham vấn Luật sư / Chủ dự án |
| :--- | :--- | :--- | :--- |
| **Nghị định 13/2023/NĐ-CP (Việt Nam)** | **BẮT BUỘC ÁP DỤNG:** Nền tảng hướng tới người học tại Việt Nam, xử lý dữ liệu cá nhân cơ bản (email, họ tên, tiến trình học tập, giọng nói phát âm). | • Có Chính sách bảo mật tiếng Việt chuẩn mực.<br>• Phân tách sự đồng ý riêng biệt (Consent Checkboxes).<br>• Thông báo mục đích trước khi thu thập (Just-in-time notice).<br>• Cung cấp cơ chế thực thi quyền chủ thể dữ liệu (DSAR - Xuất & Xóa).<br>• Mã hóa dữ liệu truyền tải (TLS 1.3) & Zero-Trust RLS. | • Lập Hồ sơ Đánh giá Tác động Xử lý Dữ liệu Cá nhân (DPIA) theo Mẫu số 04 gửi Cục An ninh mạng (A05 - Bộ Công an) nếu quy mô xử lý lớn.<br>• Lập Hồ sơ Chuyển Dữ liệu Cá nhân ra Nước ngoài theo Mẫu số 06 (do hạ tầng Supabase đặt tại AWS EU/US). |
| **Luật An ninh mạng 2018 (Việt Nam)** | **BẮT BUỘC ÁP DỤNG:** Bảo vệ hệ thống thông tin, ngăn chặn hành vi phát tán nội dung xuyên tạc, bạo lực hoặc vi phạm thuần phong mỹ tục trong lớp học và cộng đồng. | • Kiểm soát quyền hạn giáo viên/học viên (RBAC).<br>• Khả năng tắt mic và mời học viên quá khích ra khỏi phòng học LiveKit.<br>• Bộ lọc mã độc và XSS khi người dùng đăng bài thảo luận. | • Đăng ký thông tin đầu mối liên hệ an ninh mạng khi cơ quan chức năng yêu cầu.<br>• Lưu trữ nhật ký hệ thống phục vụ điều tra theo thời hạn quy định. |
| **Luật Bảo vệ Quyền lợi Người tiêu dùng** | **DỰ PHÒNG KHI CÓ THU PHÍ:** Hiện tại HanziGo miễn phí 100% nên chưa phát sinh nghĩa vụ bán hàng. | • Khẳng định rõ ràng trạng thái miễn phí, không thu phí ẩn, không đòi hỏi thẻ tín dụng để thi thử HSK. | • Đăng ký website thương mại điện tử bán hàng với Bộ Công Thương (`online.gov.vn`) ngay khi kích hoạt bán khóa học trả phí. |
| **GDPR (Châu Âu - Quy định 2016/679)** | **ÁP DỤNG KHI CÓ NGƯỜI DÙNG TẠI EU:** Nếu kiều bào người Việt sinh sống tại EU truy cập và sử dụng HanziGo. | • Quyền truy cập & di chuyển dữ liệu (Art. 20 - Data Portability JSON Export).<br>• Quyền được lãng quên (Art. 17 - Right to Erasure).<br>• Cơ chế quản trị Cookie/Storage Consent thực tế (Opt-in trước khi lưu tùy chọn). | • Chỉ định Đại diện tại EU (EU Representative theo Art. 27) nếu chủ động hướng tới thị trường Châu Âu quy mô lớn. |
| **CCPA / CPRA (California, Hoa Kỳ)** | **ÁP DỤNG NẾU ĐẠT NGƯỠNG DOANH THU:** HanziGo là dự án học thuật phi thương mại nên chưa thuộc đối tượng kiểm soát trực tiếp của CCPA ($25M+ doanh thu). | • Tuyên bố rõ ràng: "HanziGo KHÔNG BÁN dữ liệu cá nhân của người học" (Do Not Sell My Info). | • Tự động kích hoạt các điều khoản bổ sung nếu thành lập pháp nhân thương mại tại Hoa Kỳ. |

---

### 2. QUY TRÌNH KIỂM SOÁT THAY ĐỔI MÃ NGUỒN (POST-UPDATE ROUTINE)

Mỗi khi phát hành bản cập nhật (Pull Request hoặc Release Tag), kỹ sư phụ trách bắt buộc phải đối chiếu 8 cổng kiểm tra sau:

```
[Thay đổi Code] ──► [1. Auth/RBAC] ──► [2. DB/RLS] ──► [3. AI Gateway] ──► [4. Cookie/Storage]
                           │
                           ▼
                    [5. Biểu mẫu] ──► [6. Bản quyền] ──► [7. Accessibility] ──► [8. Test & Build]
```

#### Cổng 1: Xác thực & Phân quyền (Authentication / RBAC)
- [ ] Token đăng nhập không bị phơi bày trong URL hoặc client console logs.
- [ ] Học viên gửi request giả mạo vai trò `teacher` hoặc `admin` đều bị serverless API từ chối (`403 Forbidden`).
- [ ] Không đưa danh sách email Admin vào gói client bundle (`ADMIN_EMAILS` phải để trống phía client).

#### Cổng 2: Cơ sở dữ liệu & Cô lập dữ liệu (Database Schema & RLS)
- [ ] Mọi bảng mới tạo trong Supabase Postgres đều bắt buộc phải kích hoạt `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
- [ ] Kiểm tra chính sách RLS: Học viên A không thể đọc bảng điểm của Học viên B.
- [ ] Giáo viên Lớp A không có quyền thao tác trên học sinh của Lớp B.

#### Cổng 3: Cổng Trợ lý AI (AI Provider & Data Boundary)
- [ ] Cấu hình chi phí tuân thủ nghiêm ngặt: `ALLOW_PAID_FALLBACK=false` để tránh phát sinh chi phí ngoài ý muốn.
- [ ] Payload gửi cho AI chỉ chứa câu hỏi học thuật và cấp độ HSK; tuyệt đối lọc bỏ token xác thực, mật khẩu, email và số điện thoại.
- [ ] Xử lý lỗi graceful fallback: Khi AI provider hết quota (429) hoặc mạng gián đoạn (504), hệ thống chuyển sang chế độ mô phỏng offline mà không làm crash ứng dụng.

#### Cổng 4: Công nghệ Lưu trữ & Theo dõi (Storage / Tracking)
- [ ] Không cài đặt lén lút các script theo dõi của bên thứ ba (Google Tag Manager, Facebook Pixel, Ads tracking).
- [ ] Khóa LocalStorage mới phải được khai báo minh bạch vào `CookiePolicyPage.jsx`.
- [ ] Người dùng chọn "Chỉ dữ liệu thiết yếu" thì hệ thống không lưu các trường sở thích tùy chọn.

#### Cổng 5: Biểu mẫu & Thu thập dữ liệu cá nhân
- [ ] Biểu mẫu mới phải có "Thông báo quyền riêng tư" nêu rõ mục đích xử lý trước nút gửi.
- [ ] Ô đồng ý nhận tin quảng cáo/email tiếp thị mặc định phải để trống (Un-checked).
- [ ] Không bổ sung các trường thông tin nhạy cảm không phục vụ mục đích học thuật.

#### Cổng 6: Bản quyền Tài sản & Nội dung học thuật
- [ ] Phông chữ, biểu tượng, hình ảnh mới phải có giấy phép mở được liệt kê trong `CONTENT_LICENSE_REGISTER.md`.
- [ ] Đề thi mô phỏng mới phải có nhãn dẫn chiếu và disclaimer CTI/Hanban.
- [ ] Không sao chép nguyên văn sách giáo trình thương mại đang được bán bản quyền độc quyền tại Việt Nam.

#### Cổng 7: Khả năng Tiếp cận & Trải nghiệm Người dùng (Accessibility)
- [ ] Mọi thẻ `<img>` mới phải có thuộc tính `alt` mô tả chuẩn xác.
- [ ] Tỷ lệ tương phản chữ trên nền đạt tối thiểu 4.5:1 ở cả 2 chế độ Sáng / Tối.
- [ ] Mọi modal popup mới phải đóng được bằng phím `Escape`.
- [ ] Nút icon-only phải có `aria-label`.

#### Cổng 8: Tích hợp Tự động (Automated CI / Test Suite)
- [ ] Chạy kiểm thử tự động toàn diện: `npm test` (Bảo đảm vượt qua 556/556 test cases).
- [ ] Chạy kiểm tra quy chuẩn mã nguồn: `npm run lint` (Không phát sinh lỗi cú pháp nghiêm trọng).
- [ ] Chạy đóng gói sản phẩm: `npm run build` (Biên dịch thành công gói production bundle).

---

### 3. ĐIỀU KIỆN TIÊN QUYẾT ĐỂ CÔNG BỐ "READY FOR PUBLIC RELEASE"

Hệ thống chỉ được phép chuyển trạng thái sang **READY FOR PUBLIC RELEASE** khi thỏa mãn đồng thời:
1. Toàn bộ 20 tiêu chí trong Bảng kiểm kê Phase 6.6 đạt trạng thái **PASS**.
2. 5 tài liệu pháp lý và trợ năng đã được lưu trữ hoàn tất trong thư mục `docs/`.
3. Chủ dự án (Lê Hải Đăng) đã rà soát và ký duyệt các thông tin cần xác nhận tại `docs/PHASE_6_6_OWNER_CONFIRMATIONS_REQUIRED.md`.
4. Không có bất kỳ cảnh báo rò rỉ secret hoặc API key nào trong client bundle.
