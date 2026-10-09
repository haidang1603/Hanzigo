# HANZIGO LIVE CLASSROOM — INTEGRATION AUDIT & DEPENDENCY MAP
**Phiên bản**: 1.0.0  
**Hệ thống**: HanziGo Real-time Virtual Classroom Ecosystem  
**Thời gian kiểm toán**: 2026-10-09  
**Người thực hiện**: Senior Full-stack Architect & WebRTC/Realtime Engineer  

---

## 1. TỔNG QUAN KIẾN TRÚC HIỆN TẠI

Hệ thống phòng học trực tuyến Live Classroom của HanziGo phục vụ mô hình **1 Giáo viên + 30–50 Học viên**, kết hợp:
1. **Media Layer**: WebRTC Audio/Video, Screen Share, Floating PiP, Ephemeral STUN/TURN via HMAC.
2. **Realtime Transport**: Supabase Realtime Channels (`broadcast` + `postgres_changes`).
3. **Database & Security**: PostgreSQL + RLS + Triggers chống leo thang đặc quyền (`session_participants`, `class_sessions`, `session_chat_messages`, `audit_logs`).
4. **Pedagogical Suite**: Bộ 9 công cụ giảng dạy tiếng Trung chuyên sâu (`InteractiveHanziBoard`, `HanziStrokeOrderBoard`, `PinyinToneBoard`, `PronunciationPracticeBoard`, `LiveVocabularyBoard`, `LiveQuizBoard`, `ListeningActivityBoard`, `GrammarBoard`, `WhiteboardBoard`).
5. **Classroom Management**: FIFO Hand-raise, Cấp/Thu hồi Micro, Mute All, Khóa phòng, Mute chat, Điểm danh tự động và AI Session Summary.

---

## 2. BẢN ĐỒ PHỤ THUỘC VÀ HIỆN TRẠNG TRIỂN KHAI

### 2.1. Phân loại mức độ hoàn thiện các tính năng

| Thành phần / Chức năng | Trạng thái thực tế | Đánh giá kiến trúc & Rủi ro phát hiện |
| :--- | :---: | :--- |
| **Xác thực & Kiểm soát vào phòng (`verifySessionAccess`)** | ✅ Đã hoàn thiện | Kiểm tra `class_members`, `is_locked`, role giáo viên/học viên. Ghi audit log nếu truy cập trái phép. |
| **Media Hardware Manager (`LiveRoomMediaManager`)** | ✅ Đã hoàn thiện | Quản lý Camera, Mic, Screen Share, xử lý sự kiện `onended` màn hình, hỗ trợ ephemeral TURN. |
| **Floating Presenter PiP** | ⚠️ Bán phần | Video nổi của giáo viên hiển thị tốt trên UI; có nút thu nhỏ/mở rộng, nhưng chưa dùng Document PiP API chuẩn khi chuyển tab. |
| **Hàng đợi Giơ tay (FIFO Queue)** | ✅ Đã hoàn thiện | Sắp xếp theo `hand_raised_at`, đèn nhấp nháy trên nút Thành viên, giáo viên cấp/thu hồi mic theo thứ tự. |
| **Kênh Chat thời gian thực** | ✅ Đã hoàn thiện | Tích hợp Supabase Realtime `session_chat_messages` (INSERT, DELETE), phân quyền xóa tin nhắn giáo viên. |
| **Thuận bút chữ Hán (`HanziStrokeOrderBoard`)** | ✅ Đã hoàn thiện | Tích hợp vector thư pháp `hanzi-writer` trên ô Mễ/Điền 224x224, tự động chạy nét bút chuẩn. |
| **Bảng phụ trợ chữ Hán (`Side Hanzi Board`)** | ❌ Chỉ có UI cục bộ | 3 ô input (`hanziBoardInput`, `pinyin`, `meaning`) lưu trong `useState` của `LiveClassroomPage.jsx`. **Giáo viên gõ không phát tán sang học viên!** |
| **Chế độ xem Hanzi (`hanziViewMode`)** | ❌ Lệch trạng thái | Toggle giữa *Phân tích chữ Hán* và *Thuận bút* chỉ lưu trong React state cục bộ của giáo viên, học viên không tự đổi view theo giáo viên. |
| **Liên kết giữa 9 công cụ sư phạm** | ❌ Thiếu liên kết | 9 công cụ hoạt động như 9 ứng dụng rời rạc: không có nút chuyển tiếp dữ liệu (Hanzi -> Stroke, Pinyin -> Pronunciation, Vocab -> Quiz, Listening -> Grammar). |
| **Điểm danh & Reconnect** | ⚠️ Rủi ro dữ liệu | `joinLiveSession` chỉ lưu vào memory/local storage; khi học viên F5 tải lại trang, `total_duration_seconds` bị reset về 0 và `joined_at` bị đè thời gian mới. |
| **Lưu trữ kết quả Quiz/Phát âm/Nghe** | ❌ Thiếu Backend | Kết quả quiz và điểm phát âm chỉ lưu trong `TEACHING_STATE` tạm thời; chưa liên kết với hồ sơ học tập dài hạn hoặc Teacher Analytics. |
| **AI Session Summary** | ⚠️ Cần chuẩn hóa | Tính toán dựa trên dữ liệu tạm thời trong bộ nhớ; chưa lưu trữ bền vững gắn với `class_sessions` và chưa kết nối SRS ôn tập sau buổi học. |

---

## 3. CÁC ĐIỂM NGHẼN & RỦI RO CHI TIẾT

### Rủi ro 1: Lệch trạng thái công cụ giữa Giáo viên và Học viên (Desynchronization)
- **Vấn đề**: Khi giáo viên đang ở công cụ `hanzi` và bấm chuyển từ tab *Phân tích chữ Hán* sang tab *Thuận bút & Luyện viết*, biến `hanziViewMode` chỉ đổi trong trình duyệt của giáo viên. Màn hình học viên vẫn ở chế độ phân tích, không thấy giáo viên đang trình chiếu hoạt họa nét viết.
- **Giải pháp**: Đưa `view_mode` ('board' | 'stroke') vào trực tiếp `teachingState.hanzi_state.view_mode` và broadcast đồng bộ toàn lớp.

### Rủi ro 2: Bảng phụ trợ chữ Hán (Side Hanzi Board) không đồng bộ
- **Vấn đề**: Giáo viên gõ chữ Hán vào ô nhập liệu ở thanh bên phải, nhưng `setHanziBoardInput` chỉ thay đổi biến nội bộ. Học viên nhìn thấy chữ mặc định "汉字".
- **Giải pháp**: Lưu `side_hanzi_board` vào `teachingState` và phát sự kiện `SIDE_HANZI_UPDATED` khi giáo viên thay đổi, đồng thời cung cấp nút "Đưa vào Bảng phụ" từ bất kỳ chữ Hán nào trên bảng chính.

### Rủi ro 3: Mất dữ liệu thời gian tham gia khi Học viên kết nối lại (Reconnect Duration Loss)
- **Vấn đề**: Trong `joinLiveSession`:
  ```javascript
  const filtered = participants.filter(p => !(p.session_id === sessionId && p.user_id === userId));
  filtered.push(participantData);
  ```
  Nếu học viên bị rớt mạng hoặc ấn F5 tải lại trang sau khi học 40 phút, bản ghi cũ bị xóa và tạo mới với `joined_at = now` và `total_duration_seconds = 0`, dẫn đến báo cáo chuyên cần cuối buổi đánh giá học viên thành "Đi muộn / Rời sớm".
- **Giải pháp**: Cơ chế Session Continuity — giữ nguyên `first_joined_at`, tích lũy thời gian tham gia (`cumulative_duration_seconds`), và xóa cờ `left_at`.

### Rủi ro 4: Cô lập dữ liệu giữa 9 công cụ sư phạm (Tool Silos)
- Giáo viên chọn từ vựng trong `LiveVocabularyBoard` không thể bấm nút để biến nó thành câu hỏi trắc nghiệm trong `LiveQuizBoard`.
- Giáo viên phân tích mẫu câu trong `PinyinToneBoard` không thể 1-click tạo bài tập phát âm sang `PronunciationPracticeBoard`.
- Không có luồng chuyển tiếp mượt mà từ kết quả bài nghe (`ListeningActivityBoard`) sang bảng phân tích ngữ pháp (`GrammarBoard`) để chữa bài.

### Rủi ro 5: Kết quả buổi học không lưu trữ vào Hệ sinh thái học tập HanziGo
- Khi buổi học kết thúc, điểm quiz, kết quả phát âm và danh sách từ vựng đã học không được lưu vào hệ cơ sở dữ liệu để:
  - Học viên xem lại trong lịch sử học tập cá nhân.
  - Tự động nạp các từ vựng vào hàng đợi ôn tập ngắt quãng (SRS Vocabulary / Hanzi Mastery).
  - Cập nhật chỉ số chuyên cần vào Teacher Dashboard Analytics.

---

## 4. DANH SÁCH FILE VÀ SERVICE CẦN ĐIỀU CHỈNH

1. **`src/services/liveClassroomService.js`**:
   - Hoàn thiện State Hub: `session_version`, `active_tool`, `view_mode`, `side_hanzi_state`.
   - Cải tiến `joinLiveSession` & `leaveLiveSession`: bảo toàn thời gian tham gia khi reconnect, đồng bộ xuống Supabase `session_participants`.
   - Thêm các hàm cầu nối liên công cụ:
     - `linkVocabToQuiz(sessionId, teacherId, vocabItem)`
     - `linkPinyinToPronunciationChallenge(sessionId, teacherId, phoneticData)`
     - `linkHanziToStrokeBoard(sessionId, teacherId, char)`
     - `updateSideHanziBoard(sessionId, teacherId, { char, pinyin, meaning })`
   - Bổ sung hàm lưu trữ kết quả buổi học dài hạn: `saveSessionLearningOutcomes(sessionId)`.

2. **`src/pages/LiveClassroomPage.jsx`**:
   - Đồng bộ `hanziViewMode` từ `teachingState`.
   - Kết nối `Side Hanzi Board` với Realtime State Hub.
   - Bổ sung thanh điều hướng ngữ cảnh sư phạm thông minh giữa các công cụ.
   - Thêm nút kết nối nhanh sang SRS ôn tập từ vựng sau buổi học.

3. **`src/components/live/InteractiveHanziBoard.jsx`**:
   - Thêm nút chuyển nhanh: "Xem thứ tự nét (Stroke Order) ➔" và "Thêm vào bảng từ vựng ➔".

4. **`src/components/live/HanziStrokeOrderBoard.jsx`**:
   - Thêm nút quay lại: "← Xem phân tích chiết tự".

5. **`src/components/live/PinyinToneBoard.jsx`**:
   - Thêm nút "Tạo thử thách phát âm với mẫu câu này ➔".

6. **`src/components/live/LiveVocabularyBoard.jsx`**:
   - Thêm nút "Tạo Quiz trực tiếp từ từ vựng này ➔" và "Đưa vào cấu trúc ngữ pháp ➔".

7. **`src/components/live/LiveQuizBoard.jsx`**:
   - Thêm nút "Quay lại bộ từ vựng để chữa bài ➔".

8. **`src/components/live/ListeningActivityBoard.jsx`**:
   - Thêm nút "Chuyển sang phân tích ngữ pháp câu này ➔".

9. **`src/components/live/GrammarBoard.jsx`**:
   - Cho phép chèn từ vựng từ `todayLessonVocab` vào các thành phần câu.

10. **`src/components/live/WhiteboardBoard.jsx`**:
    - Thêm cơ chế phân quyền vẽ (chỉ giáo viên vẽ hoặc cấp quyền cho học viên).

---

## 5. KẾ HOẠCH TRIỂN KHAI THEO PHASES

- **Phase 2**: Xây dựng Unified Live Session State Hub & Reconnect Resilience.
- **Phase 3**: Triển khai Smart Pedagogical Workflow Bridges giữa 9 công cụ.
- **Phase 4**: Đồng bộ Side Hanzi Board và Presenter PiP.
- **Phase 5**: Hoàn thiện Classroom Controls & Hand-raise FIFO.
- **Phase 6**: Điểm danh chống trùng lặp & Lưu trữ kết quả học tập.
- **Phase 7**: AI Session Summary gắn kết dữ liệu thực tế.
- **Phase 8**: Tích hợp với Teacher Dashboard, SRS Vocabulary & Student Learning History.
- **Phase 9**: Viết bộ Test E2E toàn diện (Scenarios A - G).
