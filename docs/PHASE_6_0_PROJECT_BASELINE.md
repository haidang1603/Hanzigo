# HANZIGO — PHASE 6.0: THIẾT LẬP BASELINE KỸ THUẬT & ĐÁNH GIÁ ĐỘ TIN CẬY
(TECHNICAL BASELINE & VERIFICATION REPORT)

> **Dự án**: HanziGo — Nền tảng học tiếng Trung chuyên sâu dành cho người Việt  
> **Repository**: [https://github.com/haidang1603/Hanzigo](https://github.com/haidang1603/Hanzigo)  
> **Production URL**: [https://hanzigo-xi.vercel.app/](https://hanzigo-xi.vercel.app/)  
> **Vai trò**: Senior Software Architect & Technical Lead  
> **Thời điểm xác lập**: Ngày 16 tháng 10 năm 2026  
> **Nguyên tắc**: Xác minh độc lập bằng lệnh chạy thực tế trên máy tính, đối chiếu trực tiếp git diff, package.json và log build/test.

---

## 1. THÔNG SỐ RUNTIME & PACKAGE DEPENDENCIES CHÍNH

### 1.1. Core Runtime & Tooling
| Thành phần | Phiên bản thực tế | Vai trò trong kiến trúc | Đánh giá tính ổn định / Nguy cơ |
| :--- | :---: | :--- | :--- |
| **Node.js** | `>= 20.x` | Runtime serverless & test runner | Hoàn toàn tương thích với `--test` native runner. |
| **React** | `^19.2.8` | Giao diện cốt lõi | Sử dụng React 19 mới nhất; linter phát hiện một số cảnh báo `react(set-state-in-effect)`. |
| **React DOM** | `^19.2.8` | DOM Renderer | Đi kèm React 19. |
| **Vite** | `^8.3.0` (8.3.1) | Trình build & dev server | Sử dụng Rolldown engine siêu tốc, build hoàn tất trong ~1.27 giây. |
| **TailwindCSS** | `^4.3.3` | Styling Utility-First | Sử dụng Tailwind v4 hiện đại qua `@tailwindcss/vite`. |
| **Oxlint** | `^1.81.0` | Rust-based Linter | Siêu nhanh (~309ms), thay thế ESLint truyền thống. |

### 1.2. Thư Viện Nghiệp Vụ Chính (Core Dependencies)
- `@supabase/supabase-js` (`^2.117.2`): Client kết nối PostgreSQL, Auth, Realtime & Storage.
- `livekit-client` (`^2.22.4`): WebRTC Client kết nối LiveKit SFU.
- `@livekit/components-react` (`^2.9.24`) & `@livekit/components-styles` (`^1.2.0`): React UI components cho WebRTC room.
- `livekit-server-sdk` (`^2.19.1`): Máy chủ ký AccessToken và điều khiển RoomServiceClient cho phòng Live.
- `hanzi-writer` (`^3.7.3`): Diễn hoạt nét viết, bút thuận chữ Hán và kiểm tra tập viết.
- `lucide-react` (`^1.48.0`): Bộ icon SVG nhất quán toàn hệ thống.
- `canvas-confetti` (`^1.9.4`): Hiệu ứng chúc mừng khi học viên hoàn thành bài học / đạt streak.

### 1.3. Đánh Giá Xung Đột & Rủi Ro Tương Thích (Dependency Risk Audit)
1. **React 19 Hooks Warning**: Linter Oxlint báo 467 cảnh báo, phần lớn là `react(set-state-in-effect)` do React 19 Compiler siết chặt việc gọi `setState` trực tiếp trong `useEffect` (tại `ClassroomPage.jsx`, `AdminPage.jsx`, `MaterialsPage.jsx`, `TeacherDashboardPage.jsx`). Cần refactor dạng derive-state hoặc event-based trong Phase 6.3.
2. **Kích thước Chunks Vite Build**: Bản build sản sinh một số chunk có kích thước lớn:
   - `dist/assets/vendor-deps-*.js` (~618 kB / gzip: 164 kB)
   - `dist/assets/data-curriculum-*.js` (~354 kB / gzip: 102 kB)
   - `dist/assets/gamification-*.js` (~276 kB / gzip: 84 kB)
   *Khuyến nghị*: Áp dụng dynamic `import()` chia nhỏ bộ dữ liệu giáo trình và vendor chunk trong giai đoạn tối ưu.

---

## 2. DANH MỤC SCRIPTS THỰC TẾ TRONG PACKAGE.JSON

Các lệnh có thể chạy được ghi nhận từ [package.json](file:///d:/DELL/Dowloads/HanziGo/package.json):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "node --test tests/srsEngine.test.js ... (48 test files)",
    "db:seed": "node scripts/seedSupabase.js",
    "db:seed:learning": "node scripts/seedLearningPath.js",
    "db:seed:hsk": "node scripts/seedHskExams.js"
  }
}
```

---

## 3. KẾT QUẢ THỰC THI BASELINE KIỂM THỬ THỰC TẾ (AUTOMATED BASELINE EXECUTION)

Toàn bộ các lệnh dưới đây đã được Senior Architect trực tiếp thực thi trên môi trường local:

### 3.1. Kết Quả Kiểm Tra Linter (`npm run lint`)
- **Lệnh**: `npm run lint` (`oxlint`)
- **Thời gian thực thi**: **309 ms** (trên 237 files, 104 rules, 12 threads)
- **Mã lỗi trả về (Exit Code)**: **0 (THÀNH CÔNG)**
- **Số lỗi (Errors)**: **0 lỗi**
- **Số cảnh báo (Warnings)**: **467 cảnh báo**
  - *Nhóm 1*: `eslint(no-unused-vars)`: Các import icon Lucide và hàm tiện ích chưa dùng đến.
  - *Nhóm 2*: `react(set-state-in-effect)`: Gợi ý tối ưu React Compiler cho việc nạp dữ liệu ban đầu trong `useEffect`.

### 3.2. Kết Quả Chạy Toàn Bộ Test Suite (`npm test`)
- **Lệnh**: `npm test` (`node --test tests/...`)
- **Thời gian thực thi**: **4.655 giây**
- **Mã lỗi trả về (Exit Code)**: **0 (THÀNH CÔNG)**
- **Thống kê chi tiết**:
  - **Tổng số tests**: **525 tests**
  - **Số lượng tests PASS**: **525 (100%)**
  - **Số lượng tests FAIL**: **0 (0%)**
  - **Số lượng tests SKIPPED / CANCELLED**: **0**
- **Phạm vi kiểm tra bao phủ**:
  - `tests/srsEngine.test.js`: Thuật toán SM-2, tính ngày ôn tập, hệ số dễ.
  - `tests/pronunciationEvaluator.test.js`: Đánh giá phát âm Pinyin và thanh điệu.
  - `tests/securityRbac.test.js`: Kiểm soát vai trò, bảo vệ route, xóa email admin hardcoded.
  - `tests/zeroTrustAuthPhase1.test.js`: Fail-closed khi token rỗng, tài khoản bị khóa, mạo danh role.
  - `tests/crossDeviceSyncPhase2.test.js`: Đồng bộ tiến độ hành trình học tập giữa thiết bị và đám mây.
  - `tests/hskExamCenterPhase3.test.js`: Cấu trúc đề thi HSK, chống lộ đáp án, sổ tay lỗi sai.
  - `tests/aiPersonalizationPhase4.test.js`: Cổng gia sư AI, chống phát sinh chi phí ngoài ý muốn.
  - `tests/liveClassroomPhase5Reliability.test.js`: 11 kịch bản khắt khe của Live Classroom (khóa hàng RPC, 50 học viên, cấp/thu hồi mic, cleanup).
  - 40 test files khác về từ điển, bài tập, lớp học, rate limiter, v.v.

### 3.3. Kết Quả Thử Nghiệm Production Build (`npm run build`)
- **Lệnh**: `npm run build` (`vite build`)
- **Thời gian build**: **1.27 giây**
- **Mã lỗi trả về (Exit Code)**: **0 (THÀNH CÔNG)**
- **Kết quả đầu ra**: 2201 modules transformed, tạo ra 37 chunks tối ưu trong thư mục `dist/`.
- **Đánh giá**: Mã nguồn hoàn toàn hợp lệ về mặt cú pháp ES Module, không có lỗi import hay thiếu thư viện gây gãy bundle.

---

## 4. MA TRẬN CẤU HÌNH BIẾN MÔI TRƯỜNG & PHÂN BIỆT MÔI TRƯỜNG

Hệ thống quản lý biến môi trường theo mô hình phân tầng:

| Biến môi trường | Vị trí khai báo | Frontend/Backend | Giá trị mặc định / Cơ chế bảo vệ | Mức độ nhạy cảm |
| :--- | :--- | :---: | :--- | :---: |
| `VITE_SUPABASE_URL` | `.env` / Vercel Settings | Cả hai | URL dự án Supabase (`https://...supabase.co`) | Công khai an toàn |
| `VITE_SUPABASE_ANON_KEY` | `.env` / Vercel Settings | Frontend | Public Anonymous Key (được RLS bảo vệ) | Công khai an toàn |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Secrets duy nhất | Backend | Khóa bypass RLS. **TUYỆT ĐỐI KHÔNG có tiền tố VITE_** | **TỐI MẬT** |
| `XKIRO_API_KEY` | `.env` / Vercel Secrets | Backend | Khóa truy cập AI miễn phí xKiro | **BÍ MẬT** |
| `XKIRO_BASE_URL` | `.env` / Vercel Secrets | Backend | `https://api.xkiro.com/v1` | Cấu hình |
| `XKIRO_MODEL` | `.env` / Vercel Secrets | Backend | `qwen/qwen-plus-2025-07-28` | Cấu hình |
| `ENABLE_AI_TUTOR` | `.env` / Vercel Settings | Backend | `true` (Cờ tính năng) | Cấu hình |
| `AI_TUTOR_KILL_SWITCH` | `.env` / Vercel Settings | Backend | `false` (Khóa khẩn cấp tắt toàn bộ AI) | Vận hành |
| `ALLOW_PAID_FALLBACK` | `.env` / Vercel Secrets | Backend | **`false`** (Bảo vệ ngân sách, cấm tự gọi Gemini trả phí) | **QUAN TRỌNG** |
| `LIVEKIT_URL` / `VITE_LIVEKIT_URL` | `.env` / Vercel Settings | Cả hai | `wss://...livekit.cloud` | Cấu hình |
| `LIVEKIT_API_KEY` | Vercel Secrets duy nhất | Backend | Khóa API máy chủ LiveKit | **BÍ MẬT** |
| `LIVEKIT_API_SECRET` | Vercel Secrets duy nhất | Backend | Khóa bí mật ký token LiveKit | **TỐI MẬT** |
| `UPSTASH_REDIS_REST_URL` | Vercel Secrets | Backend | URL Redis phân tán cho Rate Limiter (tùy chọn) | Cấu hình |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel Secrets | Backend | Token Redis | **BÍ MẬT** |

### Cách Phân Biệt Development, Preview và Production
- Trong backend Serverless (`api/_utils/supabaseServer.js`):
  ```javascript
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  ```
- **Quy tắc Zero-Trust**:
  - Khi `isProd === true`: Bắt buộc 100% request phải có Bearer token hợp lệ được kiểm tra qua `supabase.auth.getUser()`, từ chối mọi header giả lập (`x-user-id`). Nếu database mất kết nối, hệ thống fail-closed (HTTP 503/500).
  - Khi `isProd === false` (Local dev & automated tests): Cho phép sử dụng in-memory mock store (`memoryParticipants`, test user ID) để chạy kiểm thử offline mà không cần kết nối mạng.

---

## 5. ĐỐI CHIẾU ĐỘ TIN CẬY CỦA CÁC BÁO CÁO TRƯỚC (NHIỆM VỤ D)

Đã đối chiếu toàn bộ các tài liệu nghiệm thu trước đây trong thư mục `docs/`:

### 5.1. Báo Cáo Phase 3 & 3.1 (HSK Practice Platform)
- **Tài liệu**: `docs/PHASE_3_HSK_COMPLETION_REPORT.md`, `docs/PHASE_3_1_ACCEPTANCE_REPORT.md`
- **Tuyên bố**: Đã tạo ngân hàng đề thi HSK, chấm điểm bảo mật, tính năng review, chống lộ đề.
- **Thực tế kiểm tra chéo**:
  - ✅ Bộ đề thi chuẩn hóa trong `src/data/hskExamsData.js` và `src/data/hskStructureData.js` tồn tại đầy đủ, chất lượng sư phạm cao.
  - ⚠️ Backend `api/_handlers/hsk/submit.js` đã được viết nhưng giao diện frontend hiện vẫn dùng hàm chấm điểm local trong `src/services/hskService.js`.
  - ⚠️ Migration `20261016_phase3_hsk_exam_center.sql` chứa policy RLS mở cho phép SELECT bảng gốc `hsk_questions`.

### 5.2. Báo Cáo Phase 4 & 4.1 (AI Personalization & AI Tutor)
- **Tài liệu**: `docs/PHASE_4_AI_PERSONALIZATION_COMPLETION_REPORT.md`, `docs/HANZIGO_AI_TUTOR_QA_RELEASE_REPORT.md`
- **Tuyên bố**: Tích hợp AI Tutor RAG, model llama-3.3, vector search PostgreSQL.
- **Thực tế kiểm tra chéo (Xác nhận phát hiện từ `POST_PHASE_06_VERIFICATION.md`)**:
  - ✅ Khóa chi phí `ALLOW_PAID_FALLBACK=false` hoạt động chuẩn xác 100%.
  - ✅ Đã gọi live request thành công tới xKiro API.
  - ⚠️ Model thực tế là `qwen/qwen-plus-2025-07-28:free` (không phải Llama 3.3).
  - ⚠️ Thuật toán embedding là Feature Hashing N-gram deterministic, chưa phải neural embedding.
  - ⚠️ Dữ liệu tri thức RAG trong database Supabase remote hiện có 0 bản ghi (hệ thống fallback vào bộ từ vựng local).

### 5.3. Báo Cáo Phase 5, 5.1, 5.2 & 5.2.1 (Live Classroom)
- **Tài liệu**: `docs/PHASE_5_2_1_FINAL_SAFETY_GATE.md`, `docs/PHASE_5_2_PILOT_RESULTS.md`
- **Tuyên bố**: Sẵn sàng cho pilot 2 người, tích hợp RPC khóa hàng, ngắt mic ở SFU.
- **Thực tế kiểm tra chéo**:
  - ✅ Mã nguồn `api/_handlers/live/join.js` đã tích hợp gọi RPC `atomic_join_live_session`.
  - ✅ Ngắt track mic phía máy chủ trong `api/_handlers/live/moderation.js` qua `RoomServiceClient.mutePublishedTrack` đã cài đặt chuẩn xác.
  - ✅ 11 scenarios kiểm thử hồi quy Live Classroom đều PASS.
  - ⚠️ Số lượng thiết bị thật tham gia: 0 thiết bị vật lý (chưa tiến hành pilot trên thiết bị thật).
  - ⚠️ Lỗ hổng RPC: `atomic_join_live_session` cấp quyền EXECUTE cho `authenticated` nhưng nhận `p_user_id` như tham số đầu vào mà không đối chiếu với `auth.uid()`.

---

## 6. SỰ KHÁC BIỆT GIỮA LOCAL WORKSPACE, REPOSITORY GITHUB VÀ PRODUCTION

Đây là **phát hiện quan trọng nhất về hiện trạng quản trị mã nguồn**:

```
[Local Workspace: DELL/Downloads/HanziGo]
  ├── 45 Files Modified (1292 dòng thêm, 258 dòng bớt)
  │   └── Gồm các bản vá an ninh: Zero-Trust auth, RPC LiveKit, HSK submit, AI Coach...
  ├── 30 Files Untracked
  │   └── Gồm: 5 test suites mới, 3 migration SQL quan trọng, 2 services mới, các báo cáo Phase 3-5.2.1
  └── Trạng thái: Chạy pass 525 tests, build thành công, lint 0 lỗi
         │
         ▼ (CHƯA COMMIT, CHƯA PUSH)
[Remote GitHub Repository: haidang1603/Hanzigo (main)]
  └── Commit HEAD: f17c897 ("feat(dictionary-writing): add Hanzi Dictionary...")
         │
         ▼ (TỰ ĐỘNG TRIỂN KHAI QUA VERCEL GIT INTEGRATION)
[Vercel Production: https://hanzigo-xi.vercel.app/]
  └── Đang chạy mã nguồn ở commit f17c897.
  └── TOÀN BỘ CÁC BẢN VÁ AN NINH & TÍNH NĂNG TỪ PHASE 1 ĐẾN 5.2.1 HIỆN CHƯA CÓ TRÊN PRODUCTION!
```

### Kết Luận Baseline
Hệ thống cục bộ đã đạt trạng thái kỹ thuật vượt trội (525 tests pass, cấu trúc hoàn thiện), nhưng **tồn tại độ trễ đồng bộ (synchronization gap)** giữa máy local và Production. Đây sẽ là nhiệm vụ trọng tâm được giải quyết theo quy trình kiểm soát chặt chẽ trong Master Plan.
