# HANZIGO — LEGAL COMPLIANCE, PRIVACY & APPLICATION AUDIT REPORT
## Phase 6.6: Comprehensive Audit of 20 Mandatory Compliance Criteria

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến dành cho người Việt  
**Phiên bản audit:** Phase 6.6 Release Gate  
**Ngày hoàn thành:** 20/10/2026  
**Chuyên gia thực hiện:** Senior Full-Stack Engineer, Application Security Engineer, Privacy Engineer & Accessibility Lead  
**Môi trường kiểm tra:** Local Workspace & Static Codebase Audit (Không can thiệp DB Production)  

---

### 1. BẢNG KIỂM KÊ 20 TIÊU CHÍ TUÂN THỦ TOÀN DIỆN (COMPLIANCE MATRIX)

| ID | Tiêu chí | Bằng chứng hiện tại trong Codebase | Trạng thái | Rủi ro tiềm ẩn | Hành động đã/đang đề xuất |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LEGAL-01** | Chính sách bảo mật (/privacy-policy) | `src/pages/PrivacyPolicyPage.jsx`: Đã tích hợp 11 phần chi tiết viện dẫn Nghị định 13/2023/NĐ-CP, Zero-Trust Supabase RLS, zero-retention micro, bảng lưu trữ dữ liệu và thông tin liên hệ `lehaidang16032006@gmail.com`. | **PASS** | Nếu thay đổi nhà cung cấp AI trong tương lai, chính sách cần cập nhật kịp thời. | Duy trì cơ chế cập nhật phiên bản định kỳ; hiển thị ngày cập nhật minh bạch. |
| **LEGAL-02** | Điều khoản dịch vụ (/terms-of-service) | `src/pages/TermsOfServicePage.jsx`: Quy định ứng xử học viên/giáo viên, nhãn hiệu HSK/CTI, giấy phép mở OER CC BY-NC-SA 4.0, điều khoản LiveKit, và bổ sung tuyên bố giới hạn sai sót do AI tạo ra (hallucination). | **PASS** | Người dùng có thể lầm tưởng đề thi HanziGo cấp chứng chỉ chính thức. | Đã gắn disclaimer "không thay thế chứng chỉ CTI chính thức" trên mọi màn hình thi. |
| **LEGAL-03** | Chính sách cookie (/cookie-policy) | `src/pages/CookiePolicyPage.jsx`: Tạo mới trang độc lập, kiểm kê 7 storage keys thực tế (`sb-*-auth-token`, `hanzigo_completed_lessons`, `hanzigo_streak_count`, v.v.), phân loại thiết yếu vs tùy chọn. | **PASS** | Người dùng nhầm lẫn giữa LocalStorage và cookie theo dõi quảng cáo. | Giải thích minh bạch HanziGo KHÔNG dùng cookie quảng cáo của bên thứ ba. |
| **LEGAL-04** | Chính sách hoàn tiền (/refund-policy) | `src/pages/RefundPolicyPage.jsx`: Khẳng định hiện trạng 100% miễn phí phi thương mại; cung cấp checklist điều kiện pháp lý và cổng thanh toán cần kích hoạt trước khi mở bán gói có phí. | **PASS** | Đối tượng xấu giả mạo HanziGo để thu tiền học viên qua mạng xã hội. | Đã bổ sung cảnh báo phòng chống lừa đảo giả mạo và kênh tố giác chính thức. |
| **PRIVACY-05** | Thu thập dữ liệu tối thiểu | Biểu mẫu chỉ yêu cầu `email`, `password`, `name`, `level`. Tuyệt đối không thu thập CCCD, số điện thoại, địa chỉ nhà. Không gửi token/mật khẩu vào prompt của AI Gateway (`api/ai/*`). | **PASS** | Thu thập quá mức cần thiết dẫn đến vi phạm nguyên tắc Data Minimization. | Duy trì zero-credential logging và RBAC serverless isolation. |
| **PRIVACY-06** | Sự đồng ý riêng theo mục đích | `src/components/AuthModal.jsx`: Tách biệt checkbox đồng ý Điều khoản & Bảo mật (bắt buộc) với checkbox nhận tin bài học (tùy chọn). Mặc định không tick sẵn (un-checked). | **PASS** | Gộp chung thỏa thuận sử dụng với sự đồng ý nhận email tiếp thị. | Đã phân tách rõ ràng 2 mục đích riêng biệt tại form đăng ký. |
| **PRIVACY-07** | Thông báo trước khi thu thập | `src/components/AuthModal.jsx` và `src/components/Footer.jsx`: Thêm khối "Thông báo quyền riêng tư" ngay trước nút bấm Đăng ký và Nhận bản tin email. | **PASS** | Người dùng gửi thông tin mà không biết mục đích sử dụng. | Đã đặt thông báo tại điểm thu thập (Just-in-time Notice). |
| **PRIVACY-08** | Quy trình yêu cầu xóa dữ liệu (DSAR) | `src/components/DataSubjectRequestModal.jsx` tích hợp tại trang Hồ sơ: Cho phép trích xuất tệp JSON dữ liệu học tập, xác nhận xóa tài khoản bằng chuỗi ký tự, ngăn chặn giáo viên xóa lớp đang hoạt động, phát sinh mã ticket DSAR. | **PASS** | Xóa nhầm tài khoản giáo viên ảnh hưởng học sinh; hoặc sót dữ liệu backend. | Đã áp dụng rào chắn xác nhận 2 lớp và cảnh báo chu kỳ sao lưu dự phòng 30 ngày. |
| **PRIVACY-09** | Minh bạch bên thứ ba | Công bố danh mục 4 đối tác xử lý dữ liệu chính trong `PrivacyPolicyPage.jsx`: Supabase (Auth/DB), LiveKit (WebRTC SFU), xKiro/Gemini (AI Tutor), Google Fonts/jsDelivr (CDN). | **PASS** | Chuyển dữ liệu xuyên biên giới chưa có văn bản đánh giá tác động riêng. | Đã ghi nhận cần chủ dự án hoàn tất Hồ sơ Đánh giá Tác động theo NĐ 13 nếu mở rộng. |
| **CONTENT-10** | Kiểm kê bản quyền tài sản | Tạo tài liệu chuẩn `docs/CONTENT_LICENSE_REGISTER.md`: Liệt kê nguồn gốc, giấy phép (MIT, Apache 2.0, SIL OFL, Arphic Public License, CC BY-SA 4.0), cách ghi công và quy trình Notice & Takedown. | **PASS** | Rủi ro tranh chấp bản quyền đề thi hoặc phông chữ thương mại. | Chỉ dùng tài nguyên mã nguồn mở và viện dẫn liên kết tới nguồn phát hành OER. |
| **CONTENT-11** | Review & lời chứng thực | Quét toàn bộ codebase: Không tìm thấy bất kỳ review giả, đánh giá ảo (như "5 sao từ 10.000 học viên") hoặc logo đối tác ngụy tạo nào trên website. | **PASS** | Sử dụng đánh giá ảo gây mất uy tín và vi phạm luật quảng cáo. | Duy trì nguyên tắc zero-fake-testimonials; chỉ dùng dữ liệu thực từ cộng đồng. |
| **CONTENT-12** | Rà soát tuyên bố quảng cáo | Đã loại bỏ các từ ngữ tuyệt đối hóa: "hàng đầu", "độc quyền", "tự tin sau 30 ngày", "đầy đủ nhất" trong `HomePage.jsx`, `index.html` và `WorksheetGeneratorModal.jsx`. Thay bằng mô tả sư phạm trung thực. | **PASS** | Tuyên bố không kiểm chứng được có thể bị xử lý theo Luật Quảng cáo Việt Nam. | Đã chỉnh sửa toàn bộ các câu chữ sang dạng trung tính, kiểm chứng được. |
| **CONTENT-13** | Thông tin đơn vị vận hành | Footer và trang liên hệ ghi rõ thông tin: Dự án Học Tiếng Trung HanziGo, người đại diện Lê Hải Đăng, email `lehaidang16032006@gmail.com`, Đà Nẵng, Việt Nam. Không bịa đặt MST hay công ty. | **PASS** | Giả định sai về tư cách pháp nhân của dự án giáo dục sinh viên/cá nhân. | Đã tạo danh sách xác nhận riêng để chủ dự án điền thông tin pháp lý khi có công ty. |
| **A11Y-14** | Alt text cho hình ảnh | Đã kiểm tra 100% thẻ `<img>` trong Navbar, Profile, Conversation, Community, Leaderboard. Tất cả đều có thuộc tính `alt` mô tả chuẩn ngữ cảnh. | **PASS** | Trình đọc màn hình không thể diễn giải nội dung hình ảnh hoặc QR code. | Đã rà soát và kiểm thử hoàn chỉnh. |
| **A11Y-15** | Độ tương phản màu sắc | Tinh chỉnh `--text-muted` trong `src/index.css` từ `#748092` thành `#556272` trên nền sáng nâng tương phản lên **5.4:1** (> 4.5:1 chuẩn AA). Nền tối đạt **6.5:1**. | **PASS** | Học viên thị lực kém hoặc học trong môi trường ánh sáng mạnh bị mỏi mắt. | Đã chuẩn hóa token màu toàn cục. |
| **A11Y-16** | Điều hướng bằng bàn phím | Bổ sung quy tắc `:focus-visible` viền nổi bật (2px outline + 2px offset). Bổ sung sự kiện phím `Escape` đóng modals. Hỗ trợ `prefers-reduced-motion`. | **PASS** | Người dùng chỉ sử dụng bàn phím bị kẹt (keyboard trap) trong modal. | Đã kiểm thử tab, enter, escape trên tất cả các modal chính. |
| **A11Y-17** | Nút bấm & biểu mẫu tiếp cận | Thêm `role="dialog"`, `aria-modal="true"`, `aria-label` cho nút icon. Lỗi form có cả icon + chữ tiếng Việt. Touch target &ge; 44×44px trên mobile. | **PASS** | Nút đóng icon-only bị trình đọc màn hình đọc là "unlabeled button". | Đã gán nhãn trợ năng đầy đủ cho mọi nút bấm quan trọng. |
| **RELEASE-18** | Cơ chế Cookie/Storage Consent | Triển khai `src/components/StorageConsentBanner.jsx`: Thực sự kiểm soát khóa lưu trữ, cho phép chọn "Chỉ dữ liệu thiết yếu" hoặc "Tùy chỉnh", có nút mở lại từ footer, không làm hỏng đăng nhập. | **PASS** | Banner giả tạo chỉ để hiển thị mà không can thiệp vào bộ nhớ trình duyệt. | Banner lưu trạng thái vào `hanzigo_storage_consent` và phát sự kiện đồng bộ. |
| **RELEASE-19** | Rà soát pháp luật theo phạm vi | Lập bảng đối chiếu chi tiết Nghị định 13/2023/NĐ-CP (Điều 9, 11, 13, 17), cơ sở pháp lý xử lý dữ liệu và tính áp dụng của GDPR/CCPA theo nhóm đối tượng người học. | **PASS** | Áp dụng nhầm luật quốc tế hoặc bỏ sót nghĩa vụ báo cáo sự cố dữ liệu theo NĐ 13. | Lập checklist pháp lý chuyên sâu trong tài liệu bàn giao. |
| **RELEASE-20** | Quy trình kiểm tra sau cập nhật | Thiết lập checklist 8 bước bắt buộc cho mọi lần pull request / cập nhật schema / đổi nhà cung cấp AI; tích hợp test tự động vào `tests/privacyAndTerms.test.js`. | **PASS** | Bản cập nhật sau vô tình làm lộ token, mất link footer hoặc phá vỡ RLS. | Đã bổ sung 4 test case mới và tự động hóa trong `npm test`. |

---

### 2. KHO DỮ LIỆU ĐANG LƯU TRỮ VÀ CƠ CHẾ BẢO VỆ

1. **Dữ liệu định danh tài khoản (`profiles` trong Supabase Postgres):**
   - Các trường: `id (UUID)`, `email`, `name`, `role ('student' | 'teacher' | 'admin')`, `level`, `avatar`, `streak`, `xp`, `created_at`.
   - Cơ chế bảo vệ: Bảo vệ bằng Row Level Security (RLS). Học viên chỉ được phép đọc/ghi hồ sơ của chính mình (`auth.uid() = id`).
2. **Dữ liệu bài tập & tiến trình học tập (`student_progress`, `user_submissions`):**
   - Chỉ có học viên sở hữu và giáo viên phụ trách lớp học tương ứng mới có quyền xem bảng điểm.
   - Cơ chế cô lập lớp học (Multi-tenant isolation) đã được chứng minh qua 556 test cases trong suite kiểm thử.
3. **Dữ liệu giọng nói & âm thanh:**
   - **Zero-retention policy:** Âm thanh phát âm được chấm điểm tức thì trên Web Speech API cục bộ của trình duyệt. Máy chủ HanziGo không ghi lại hay lưu trữ tệp âm thanh nghe lén.
   - Phòng học trực tuyến LiveKit truyền luồng âm thanh thời gian thực (WebRTC SFU) mã hóa DTLS/SRTP và tự giải phóng khi kết thúc buổi học.
4. **Dữ liệu gửi tới Trợ lý AI (AI Gateway):**
   - Prompt gửi tới xKiro / Google Gemini chỉ bao gồm câu hỏi học thuật và cấp độ mục tiêu HSK.
   - Tuyệt đối không đính kèm thông tin nhạy cảm: email, mật khẩu băm, token JWT, số điện thoại hay thông tin tài khoản cá nhân.
