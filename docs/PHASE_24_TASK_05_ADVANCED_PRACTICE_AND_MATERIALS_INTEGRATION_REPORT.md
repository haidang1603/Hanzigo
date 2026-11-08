# HANZIGO — PHASE 24 / TASK 24.05 ACCEPTANCE REPORT
## ADVANCED HSK PRACTICE EXPANSION & ADMIN MATERIALS SUPABASE INTEGRATION
### BÁO CÁO NGHIỆM THU: MỞ RỘNG LUYỆN TẬP HSK 5–6 VÀ ĐỒNG BỘ QUẢN TRỊ TÀI LIỆU VỚI SUPABASE

---

## 1. TỔNG QUAN & PHÂN ĐỊNH TRẠNG THÁI NGHIỆM THU

### 1.1. Mục tiêu đã thực hiện
1. **Mở rộng luyện tập nâng cao HSK 5 & HSK 6**:
   - Bổ sung 20 bài luyện ngữ pháp mới (10 bài HSK 5: `gram-l5-01` đến `gram-l5-10`, 10 bài HSK 6: `gram-l6-01` đến `gram-l6-10`). Tổng ngân hàng ngữ pháp tăng từ 7 lên 27 bài.
   - Bổ sung 20 bài luyện nghe mới (10 bài HSK 5: `list-l5-01` đến `list-l5-10`, 10 bài HSK 6: `list-l6-01` đến `list-l6-10`). Tổng ngân hàng luyện nghe tăng từ 9 lên 29 bài.
   - Toàn bộ 40 bài tập mới đều có schema sư phạm hoàn chỉnh: phiên âm chuẩn Pinyin có dấu thanh điệu, giải nghĩa tiếng Việt, phân tích phương án nhiễu (`whyWrong`), Web Speech TTS `zh-CN`, độ khó ('advanced' / 'mastery'), chủ đề học thuật và ngữ cảnh thực tế.
   - Mở rộng giao diện điều hướng `PracticePage.jsx` và cấu hình `PRACTICE_LEVELS` thành 6 cấp độ (HSK 1 đến HSK 6), bố cục 6 cột đáp ứng trên máy tính và phân trang câu hỏi chuẩn xác.

2. **Đồng bộ hóa quản trị tài liệu với Supabase (Admin Materials Integration)**:
   - Loại bỏ hoàn toàn cơ chế lưu trữ cục bộ LocalStorage (`getStoredMaterials`, `saveMaterial`, `updateMaterial`, `deleteMaterial`, `resetMaterials`) trong [AdminPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/AdminPage.jsx).
   - Thiết lập bảng cơ sở dữ liệu `public.materials` của Supabase làm **nguồn chân lý duy nhất (Authoritative Single Source of Truth)**.
   - Thực hiện đầy đủ các thao tác CRUD trên database thông qua [materialsService.js](file:///d:/DELL/Dowloads/HanziGo/src/services/materialsService.js): Đọc danh sách, thêm tài liệu mới, cập nhật thông tin, xóa tài liệu, ghim nổi bật (`isFeatured`), ẩn/hiển thị (`isHidden`), làm mới (`RefreshCw`).
   - Tích hợp trạng thái giao diện trực quan: biểu tượng xoay tải (`Loader2`), thanh cảnh báo lỗi kết nối kèm nút bấm "Thử lại", và trạng thái danh sách rỗng (Empty State) khi không có dữ liệu.
   - Thiết lập cơ chế đồng bộ hóa liên component theo thời gian thực (Real-time Cross-Component Event Sync): phát và bắt sự kiện `hanzigo:materials_updated` trên `window` giữa `AdminPage.jsx` và `MaterialsPage.jsx`, giúp cập nhật kho tài liệu tức thì mà không cần nạp lại toàn bộ trang web.
   - Đảm bảo nghiêm ngặt bảo mật RBAC: Khóa Service Role Key tuyệt đối không xuất hiện trong mã nguồn client; bảng `public.materials` được bảo vệ bằng Row Level Security (RLS) với chính sách chỉ cho phép quản trị viên (`is_admin()`) thực hiện thao tác sửa đổi.

3. **Chuẩn hóa quản trị người dùng (Admin User Management Standardization)**:
   - Đồng bộ hoàn tất các tiêu chuẩn của Task 24.03 trong [AdminPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/AdminPage.jsx): loại bỏ 100% dữ liệu giả (`isDemoUser`, `demoIds`, `demoEmails`), tích hợp phân trang 10 người dùng/trang (`pageSize = 10`, `safeCurrentPage`, `paginatedUsers`), trạng thái nạp dữ liệu và kiểm soát tạo người dùng thông qua serverless API an toàn với giới hạn vai trò nghiêm ngặt `student` và `teacher` (loại bỏ tùy chọn `admin`).

### 1.2. Phân định trạng thái nghiệm thu

Theo đúng quy chuẩn kiểm toán của dự án, trạng thái kỹ thuật được phân định rành mạch như sau:

| Tiêu chí | Trạng thái | Ghi chú bằng chứng |
| :--- | :--- | :--- |
| **Mã nguồn tính năng** | `IMPLEMENTATION COMPLETE` | Đã triển khai đầy đủ 40 bài tập HSK 5-6, cấu trúc Practice 6 cấp độ, Supabase Materials CRUD và đồng bộ sự kiện. |
| **Kiểm thử tự động** | `TESTS PASSED` | **43/43 tests PASS 100%** across 4 test suites: `productCompletionGapClosure.test.js` (7/7), `adminManagementStandardization.test.js` (16/16), `grammarListeningIntegration.test.js` (12/12), `practiceLevels.test.js` (8/8). |
| **Biên dịch & Đóng gói** | `BUILD VERIFIED` | `vite build` thành công trong **902ms**, 0 lỗi biên dịch, bundle hoàn chỉnh, 0 rò rỉ secret. Oxlint vượt qua với **0 lỗi**. |
| **Môi trường Production Thực tế** | `PRODUCTION VERIFICATION PARTIAL` | Mã nguồn local và cơ sở dữ liệu Supabase kết nối trực tiếp đã đạt chuẩn. Việc xác minh các tương tác người dùng thời gian thực trên domain production live cần được tiếp tục đối soát cùng phiên đăng nhập admin thực tế. |

---

## 2. CHI TIẾT DANH MỤC LUYỆN TẬP HSK 5–6 ĐƯỢC BỔ SUNG

### 2.1. Ngân hàng 20 bài tập ngữ pháp mới (Grammar Drills)

Toàn bộ 20 bài tập ngữ pháp mới được tích hợp vào mảng `GRAMMAR_DRILLS_BY_LEVEL` trong [src/data/practiceLevelData.js](file:///d:/DELL/Dowloads/HanziGo/src/data/practiceLevelData.js):

| ID | Cấp độ | Cấu trúc ngữ pháp trọng tâm | Ý nghĩa tiếng Việt | Số token |
| :--- | :---: | :--- | :--- | :---: |
| `gram-l5-01` | HSK 5 | Giả thiết nhượng bộ: 哪怕...也... | Dù công việc có bận rộn hơn nữa, anh ấy cũng kiên trì đọc sách mỗi ngày. | 8 |
| `gram-l5-02` | HSK 5 | Giới từ biểu thị căn cứ: 凭着... | Dựa vào năng lực xuất sắc và sự nỗ lực kiên trì, cô ấy đã giành được sự tín nhiệm của cấp trên. | 11 |
| `gram-l5-03` | HSK 5 | Liên từ chuyển ý đối lập: 反而 | Khí hậu biến đổi không những không thuyên giảm mà ngược lại ngày càng nghiêm trọng. | 11 |
| `gram-l5-04` | HSK 5 | Câu vị ngữ chủ vị kết hợp: 无论...都... | Bất kể gặp phải khó khăn gì, chúng ta đều phải giữ vững niềm tin lạc quan. | 10 |
| `gram-l5-05` | HSK 5 | Phó từ phủ định nhấn mạnh: 并不 | Thành công không nằm ở việc sở hữu bao nhiêu tài phú, mà là tạo ra bao nhiêu giá trị cho xã hội. | 11 |
| `gram-l5-06` | HSK 5 | Liên từ điều kiện loại trừ: 除非...才... | Trừ khi hai bên chịu nhượng bộ, nếu không cuộc đàm phán thương mại này mới có thể tiến triển. | 11 |
| `gram-l5-07` | HSK 5 | Phó từ chỉ mức độ tiến thêm: 更加 | Sau khi trải qua thất bại này, anh ấy càng thêm trân trọng sự giúp đỡ của bạn bè bè. | 9 |
| `gram-l5-08` | HSK 5 | Giới từ phương thức: 采取...措施 | Để bảo vệ môi trường sinh thái, chính quyền đã áp dụng hàng loạt biện pháp hiệu quả. | 10 |
| `gram-l5-09` | HSK 5 | Liên từ nhân quả nhấn mạnh: 既然...就... | Đã nhận trách nhiệm dự án này, chúng ta phải dốc toàn lực hoàn thành tốt nhiệm vụ. | 10 |
| `gram-l5-10` | HSK 5 | Cấu trúc so sánh ẩn dụ: 像...一样 | Cô ấy biểu đạt quan điểm của mình trôi chảy và tự tin như người bản xứ. | 9 |
| `gram-l6-01` | HSK 6 | Cặp liên từ nhượng bộ đối lập: 固然...然而... | Thu nhập kinh tế tuy quan trọng, song trách nhiệm xã hội càng không thể xem nhẹ. | 10 |
| `gram-l6-02` | HSK 6 | Phó từ thời gian biểu thị sắp sửa: 势必 | Nếu tiếp tục xem nhẹ vấn đề này, hậu quả tất yếu sẽ ngày càng khó kiểm soát. | 10 |
| `gram-l6-03` | HSK 6 | Cấu trúc thành ngữ kết hợp: 一旦...便... | Mối quan hệ tin cậy một khi bị phá vỡ thì rất khó phục hồi lại như xưa. | 9 |
| `gram-l6-04` | HSK 6 | Cặp từ chỉ tương hỗ: 鉴于...特此... | Căn cứ vào diễn biến tình hình quốc tế hiện tại, chúng tôi xin đặc biệt điều chỉnh chiến lược ngoại giao. | 10 |
| `gram-l6-05` | HSK 6 | Liên từ điều kiện bác bỏ: 唯有...方能... | Chỉ có kiên trì đổi mới công nghệ thì doanh nghiệp mới có thể bất khả chiến bại trên thương trường cạnh tranh. | 10 |
| `gram-l6-06` | HSK 6 | Phó từ kết luận tất yếu: 无疑 | Phát minh đột phá này chắc chắn sẽ thúc đẩy mạnh mẽ sự phát triển của y học hiện đại. | 9 |
| `gram-l6-07` | HSK 6 | Cặp từ điều kiện ngược: 倘若...则... | Nếu như lơ là việc kiểm định chất lượng, uy tín thương hiệu sẽ lập tức sụp đổ. | 9 |
| `gram-l6-08` | HSK 6 | Phó từ chuyển ngoặt: 殊不知 | Anh ấy cứ ngỡ kế hoạch chu toàn, nào ngờ các đối thủ cạnh tranh đã sớm nhìn thấu sơ hở. | 10 |
| `gram-l6-09` | HSK 6 | Cấu trúc nguyên nhân hệ quả: 藉由...得以... | Nhờ vào nền tảng giao lưu văn hóa quốc tế, nghệ thuật truyền thống đã được kế thừa và phát huy. | 10 |
| `gram-l6-10` | HSK 6 | Cấu trúc bác bỏ khẳng định: 并非...而是... | Khoa học khám phá không phải là tìm kiếm đáp án tuyệt đối, mà là không ngừng đặt ra câu hỏi sâu sắc hơn. | 10 |

### 2.2. Ngân hàng 20 bài tập luyện nghe mới (Listening Drills)

Toàn bộ 20 bài tập nghe mới được tích hợp vào mảng `LISTENING_DRILLS_BY_LEVEL` trong [src/data/practiceLevelData.js](file:///d:/DELL/Dowloads/HanziGo/src/data/practiceLevelData.js):

| ID | Cấp độ | Chủ đề ngữ cảnh | Câu hỏi đọc hiểu | Đáp án đúng |
| :--- | :---: | :--- | :--- | :---: |
| `list-l5-01` | HSK 5 | Phỏng vấn tuyển dụng | Tiêu chí quan trọng nhất khi tuyển dụng là gì? | B |
| `list-l5-02` | HSK 5 | Chiến lược kinh doanh | Điều chỉnh nào được đưa ra cho sản phẩm? | A |
| `list-l5-03` | HSK 5 | Nghiên cứu giáo dục | Thói quen đọc sách thuở nhỏ tác động gì đến trẻ? | C |
| `list-l5-04` | HSK 5 | Bảo vệ môi trường sinh thái | Người nói nhận định thế nào về lối sống xanh? | B |
| `list-l5-05` | HSK 5 | Tâm lý học quản lý stress | Phương pháp kiểm soát căng thẳng được khuyến nghị là gì? | A |
| `list-l5-06` | HSK 5 | Văn hóa ẩm thực truyền thống | Ý nghĩa tinh thần của việc cùng ăn cơm gia đình là gì? | C |
| `list-l5-07` | HSK 5 | Trí tuệ nhân tạo & Công việc | Người nói nhìn nhận thế nào về làn sóng công nghệ mới? | B |
| `list-l5-08` | HSK 5 | Du lịch trải nghiệm sinh thái | Mục đích chính của loại hình du lịch sinh thái là gì? | A |
| `list-l5-09` | HSK 5 | Giao dịch tài chính thông minh | Lời khuyên dành cho nhà đầu tư cá nhân là gì? | B |
| `list-l5-10` | HSK 5 | Nghệ thuật đàm phán hợp tác | Điểm cốt lõi để đạt được đàm phán thành công là gì? | A |
| `list-l6-01` | HSK 6 | Kinh tế học vĩ mô & Chu kỳ | Thách thức lớn nhất đối với chính sách tiền tệ lúc này là gì? | B |
| `list-l6-02` | HSK 6 | Di sản văn hóa phi vật thể | Biện pháp bảo tồn di sản hiệu quả nhất theo bài nói là gì? | C |
| `list-l6-03` | HSK 6 | Triết học nhận thức & Tư duy | Giá trị lớn nhất của hoài nghi học thuật là gì? | B |
| `list-l6-04` | HSK 6 | Công nghệ sinh học & Y tế | Điểm mấu chốt khi triển khai liệu pháp gen là gì? | A |
| `list-l6-05` | HSK 6 | Quản trị khủng hoảng truyền thông | Nguyên tắc phản ứng ưu tiên hàng đầu khi gặp sự cố là gì? | B |
| `list-l6-06` | HSK 6 | Quy hoạch đô thị bền vững | Trọng tâm của quy hoạch đô thị tương lai là gì? | C |
| `list-l6-07` | HSK 6 | Văn học so sánh & Dịch thuật | Thử thách lớn nhất của dịch thuật văn học là gì? | A |
| `list-l6-08` | HSK 6 | An ninh mạng & Bảo mật dữ liệu | Yếu tố phòng vệ then chốt nhất trong an ninh mạng là gì? | B |
| `list-l6-09` | HSK 6 | Đổi mới tổ chức & Văn hóa | Điều kiện tiên quyết để thúc đẩy đổi mới sáng tạo là gì? | C |
| `list-l6-10` | HSK 6 | Tâm lý học xã hội & Hành vi | Tác động sâu sắc nhất của công nghệ số đến giao tiếp là gì? | B |

---

## 3. KIỂM CHỨNG THỰC NGHIỆM TÍNH TOÀN VẸN CỦA NỘI DUNG LUYỆN TẬP

Để đảm bảo không xảy ra lỗi sư phạm, toàn bộ 40 bài tập mới đã được kiểm tra tính nhất quán thông qua các bài kiểm thử thực nghiệm:

1. **Kiểm tra tính nhất quán 100% của Token Ngữ pháp (Grammar Token Identity)**:
   - Tất cả 20 câu ngữ pháp HSK 5 và HSK 6 được kiểm tra: Mảng `tokens` (đã xáo trộn) và mảng `correctTokens` (thứ tự đúng) có cùng độ dài chính xác, cùng chứa tập hợp các từ ngữ giống nhau hoàn toàn (`sorted(tokens) === sorted(correctTokens)`).
   - Tỷ lệ trùng khớp: **20/20 bài đạt 100%**.
2. **Kiểm tra chỉ số và cấu trúc phương án Luyện nghe (Listening Drills Multiple Choice Schema)**:
   - 100% bài luyện nghe đều có đúng **4 phương án lựa chọn** (`options.length === 4`).
   - `correctIndex` được giới hạn nghiêm ngặt trong khoảng `0 <= correctIndex <= 3`.
   - Nội dung đoạn phát âm `audioText` hoàn chỉnh, không chứa ký tự điều khiển hay lỗi mã hóa unicode, sẵn sàng cho bộ tổng hợp giọng nói Web Speech TTS (`zh-CN`).
3. **Phân tích lý do sai (Distractor Analysis `whyWrong`)**:
   - Mỗi câu hỏi đều đi kèm mục giải thích sư phạm (`explanation`) chi tiết tại sao đáp án đúng, đồng thời chỉ rõ lỗi tư duy hoặc cấu trúc thường gặp khiến người học chọn sai phương án.

---

## 4. ĐỒNG BỘ QUẢN TRỊ TÀI LIỆU VỚI SUPABASE (ADMIN MATERIALS INTEGRATION)

### 4.1. Loại bỏ LocalStorage làm nguồn dữ liệu chính

Trước Task 24.05, [AdminPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/AdminPage.jsx) nhập các hàm từ `materialsStorage.js`:
- `getStoredMaterials()`
- `saveMaterial()`
- `updateMaterial()`
- `deleteMaterial()`
- `resetMaterials()`

Cơ chế này khiến các thay đổi của Admin chỉ được lưu vào LocalStorage của trình duyệt máy tính cá nhân người quản trị, gây ra tình trạng bất đồng bộ dữ liệu: học viên truy cập từ máy khác hoặc thiết bị di động không nhìn thấy các tài liệu mới được tạo.

**Các điều chỉnh kiến trúc đã triển khai:**
1. **Loại bỏ nhập**: Không còn import 5 hàm trên từ `materialsStorage.js`.
2. **Nhập trực tiếp từ database**:
   ```javascript
   import {
     getMaterialsFromDb,
     addMaterialToDb,
     updateMaterialInDb,
     deleteMaterialFromDb
   } from '../services/materialsService';
   ```
3. **Quản lý trạng thái dựa trên Supabase**:
   - `materials`: Khởi tạo bằng `[]` (thay vì đọc LocalStorage).
   - `isLoadingMaterials`: Bật `true` khi đang nạp dữ liệu từ database.
   - `materialsError`: Ghi nhận thông báo lỗi nếu kết nối Supabase gặp sự cố.
4. **Hàm nạp dữ liệu tập trung `loadMaterialsData`**:
   ```javascript
   const loadMaterialsData = async () => {
     setIsLoadingMaterials(true);
     setMaterialsError(null);
     try {
       const dbItems = await getMaterialsFromDb();
       if (Array.isArray(dbItems)) {
         setMaterials(dbItems);
       } else {
         setMaterials([]);
       }
     } catch (err) {
       console.error('Failed to load materials from DB:', err);
       setMaterialsError('Không thể nạp danh sách tài liệu từ cơ sở dữ liệu.');
     } finally {
       setIsLoadingMaterials(false);
     }
   };
   ```

### 4.2. Giao diện người dùng Tab 2 (Materials Tab)

Đã bổ sung 4 thành phần phản hồi trạng thái:
- **Biểu tượng làm mới (`RefreshCw`)**: Nút "Tải lại tài liệu từ cơ sở dữ liệu" với hiệu ứng xoay tròn khi đang đồng bộ.
- **Vùng chờ nạp dữ liệu (Loading State)**: Hiển thị `<Loader2 size={36} className="text-[#E85D3F] animate-spin" />` và thông báo *"Đang tải danh sách tài liệu từ cơ sở dữ liệu..."*.
- **Vùng cảnh báo lỗi (Error State)**: Khung viền đỏ nổi bật với icon `AlertTriangle`, hiển thị nội dung lỗi và nút *"Thử lại"* cho phép Admin tải lại mà không cần F5 trình duyệt.
- **Vùng dữ liệu trống (Empty State)**: Khung hiển thị icon `BookOpen` cùng thông báo *"Không tìm thấy tài liệu phù hợp"* khi database chưa có bản ghi hoặc bộ lọc không có kết quả.

---

## 5. CƠ CHẾ ĐỒNG BỘ HÓA LIÊN COMPONENT THEO THỜI GIAN THỰC

Nhằm tránh việc người dùng phải tải lại toàn bộ trang (Full Page Reload) khi tài liệu được thêm, sửa, xóa, hệ thống đã ứng dụng mô hình Custom Event trên `window`:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant AP as AdminPage.jsx
    participant MS as materialsService.js
    participant SB as Supabase DB (materials)
    participant WIN as Window Event Bus
    participant MP as MaterialsPage.jsx
    actor Learner as Học viên

    Admin->>AP: Thêm / Sửa / Xóa / Ghim tài liệu
    AP->>MS: addMaterialToDb / updateMaterialInDb / deleteMaterialFromDb
    MS->>SB: UPSERT / UPDATE / DELETE qua Supabase API
    SB-->>MS: Thành công
    AP->>WIN: dispatchEvent('hanzigo:materials_updated')
    AP->>AP: loadMaterialsData() làm mới bảng Admin
    WIN-->>MP: Bắt sự kiện 'hanzigo:materials_updated'
    MP->>MS: getMaterialsFromDb() nạp bản ghi mới
    MS->>SB: SELECT * FROM materials
    SB-->>MS: Dữ liệu tài liệu cập nhật
    MP-->>Learner: Giao diện học viên lập tức cập nhật tài liệu mới
```

Mã nguồn triển khai:
- Trong [AdminPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/AdminPage.jsx): Gọi `window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'))` ngay sau mỗi thao tác thêm, sửa, xóa, ghim nổi bật, ẩn/hiển thị.
- Trong [MaterialsPage.jsx](file:///d:/DELL/Dowloads/HanziGo/src/pages/MaterialsPage.jsx): Lắng nghe sự kiện qua `useEffect`:
  ```javascript
  useEffect(() => {
    const handleRemoteMaterialsUpdate = () => {
      getMaterialsFromDb()
        .then(dbItems => {
          if (dbItems && dbItems.length > 0) {
            setMaterials(prev => {
              const custom = prev.filter(p => p.isCustom);
              const merged = [...custom];
              dbItems.forEach(dbItem => {
                if (!merged.some(m => String(m.id) === String(dbItem.id) || m.title === dbItem.title)) {
                  merged.push(dbItem);
                }
              });
              return merged;
            });
          }
        })
        .catch(err => {
          console.warn('Real-time materials sync notice:', err);
        });
    };
    window.addEventListener('hanzigo:materials_updated', handleRemoteMaterialsUpdate);
    return () => window.removeEventListener('hanzigo:materials_updated', handleRemoteMaterialsUpdate);
  }, []);
  ```

---

## 6. BẰNG CHỨNG PHÂN QUYỀN RBAC & BẢO MẬT DỮ LIỆU

1. **Khóa bí mật Service Role Key**:
   - Được kiểm toán bằng `tests/adminManagementStandardization.test.js` (test 14, 16) và `tests/productCompletionGapClosure.test.js` (test 7):
   - Tuyệt đối **không** xuất hiện trong mã nguồn client bundle `src/` hoặc dist build output.
2. **Chính sách Row Level Security (RLS) trên bảng `public.materials`**:
   - Đã được kích hoạt: `ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;`.
   - Quyền đọc (`SELECT`): Cho phép công khai với điều kiện `(is_hidden = false) OR public.is_admin()`.
   - Quyền ghi (`INSERT`, `UPDATE`, `DELETE`): Yêu cầu bắt buộc quyền quản trị viên thông qua hàm kiểm tra bảo mật `public.is_admin()`.

---

## 7. ĐỐI SOÁT VÀ ĐỒNG BỘ KIỂM THỬ HỒI QUY

Khi mở rộng hệ thống luyện tập lên 6 cấp độ (HSK 1–6), hai bộ test hồi quy trước đây đã được cập nhật để phù hợp với kiến trúc thực tế:

1. [tests/practiceLevels.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/practiceLevels.test.js):
   - Cập nhật số cấp độ từ 4 lên 6: `PRACTICE_LEVELS.length === 6` (tương ứng `['LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'LV6']`).
   - Cập nhật điều kiện lọc cấp độ của bài nghe và ngữ pháp từ `[1, 2, 3, 4]` thành `[1, 2, 3, 4, 5, 6]`.
2. [tests/grammarListeningIntegration.test.js](file:///d:/DELL/Dowloads/HanziGo/tests/grammarListeningIntegration.test.js):
   - Cập nhật số bài ngữ pháp từ 7 lên 27 (Level 1: 2, Level 2: 2, Level 3: 2, Level 4: 1, Level 5: 10, Level 6: 10).
   - Cập nhật số bài luyện nghe từ 9 lên 29 (Level 1: 3, Level 2: 2, Level 3: 2, Level 4: 2, Level 5: 10, Level 6: 10).
   - Kiểm tra an toàn biên điều hướng: Cấp độ ngoài phạm vi (Level 7) trả về an toàn mảng rỗng 0 phần tử.

---

## 8. KẾT QUẢ THỰC THI TOÀN BỘ BỘ KIỂM THỬ TỰ ĐỘNG

Lệnh kiểm thử tích hợp thực thi đồng thời 4 bộ kiểm thử:
```bash
node --env-file=.env --test tests/productCompletionGapClosure.test.js tests/adminManagementStandardization.test.js tests/grammarListeningIntegration.test.js tests/practiceLevels.test.js
```

### Kết quả chi tiết: **43/43 Tests PASS (100%)**

```
▶ Task 24.03 - Admin Management Standardization & Deep Integration Tests
  ✔ 1. AdminPage.jsx has completely removed isDemoUser, demoIds, and demoEmails (1.28ms)
  ✔ 2. AdminPage.jsx includes pagination, search, loading, error, and refresh controls (0.55ms)
  ✔ 3. AdminPage.jsx Add User modal strictly restricts role to student and teacher (disallows admin) (0.55ms)
  ✔ 4. Serverless dispatcher api/admin/[action].js and handler exist and enforce Hobby plan limits (0.47ms)
  ✔ 5. API rejects unauthenticated caller with 401 (1.01ms)
  ✔ 6. API rejects non-admin callers (student, teacher -> 403, blocked admin -> 401) (0.68ms)
  ✔ 7. API rejects client spoofing admin role in metadata when database profile is student (0.30ms)
  ✔ 8. API rejects creation attempts with role = admin (400) (0.40ms)
  ✔ 9. API validates email, name, and password constraints (400) (0.39ms)
  ✔ 10. API handles email conflicts in profiles or auth with 409 (0.30ms)
  ✔ 11. Atomic Rollback: Deletes Auth user if profile upsert fails (1.20ms)
  ✔ 12. Valid Admin successfully creates student account (201) (0.34ms)
  ✔ 13. Backend RPC definitions enforce self-guards (prevent self-demote, self-lock, self-delete) (0.28ms)
  ✔ 14. Client bundle and frontend code never expose SUPABASE_SERVICE_ROLE_KEY (51.20ms)
  ✔ 15. Navbar and Lesson navigation harmonized to #roadmap (0.40ms)
  ✔ 16. Client build artifact contains zero service role secrets (61.97ms)
✔ Task 24.03 - Admin Management Standardization & Deep Integration Tests (122.49ms)

▶ Grammar & Listening Integration Tests
  ✔ 1. Routing: VALID_TABS includes practice, grammar, and listening (1.45ms)
  ✔ 2. Routing: Route parser accurately parses #practice, #grammar, #listening (0.91ms)
  ✔ 3. Navigation: Navbar includes grammar and listening in practiceItems without removing core items (0.43ms)
  ✔ 4. Grammar Drills: dataset contains valid levels and question structures (0.25ms)
  ✔ 5. Grammar Drills: answer evaluation validates exact token order (0.15ms)
  ✔ 6. Grammar Drills: question navigation and boundary handling (0.14ms)
  ✔ 7. Listening Drills: dataset contains valid levels, audio texts, and option choices (0.20ms)
  ✔ 8. Listening Drills: answer evaluation checks option index correctly (0.08ms)
  ✔ 9. Listening Audio: audio utility functions exist and are safe in headless environments (0.38ms)
  ✔ 10. Regression: Core learning pages exist and are properly structured (3.19ms)
  ✔ 11. PracticePage: contains no duplicate flashcard engine and exposes required handlers (0.42ms)
  ✔ 12. XP Deduplication: Component logic prevents repeated XP awarding on same question in session (0.33ms)
✔ Grammar & Listening Integration Tests (12.35ms)

▶ Practice Levels Tests
  ✔ 1. Practice Levels Data: contains 6 pedagogical levels with required structure (1.94ms)
  ✔ 2. Pronunciation Drills: covers all 4 difficulty tiers and valid schema (0.43ms)
  ✔ 3. Listening Drills: valid multiple-choice format with correct options (0.29ms)
  ✔ 4. Grammar Drills: sentence reconstruction token integrity (0.58ms)
  ✔ 5. Writing Difficulty Tiers: character stroke thresholds partition logically (0.29ms)
  ✔ 6. HSK Metadata & Enriched Vocabulary: partitioned across HSK levels with full sentences (16.94ms)
  ✔ 7. Cross-Skill Synchronization: Vocabulary is synchronized with Pronunciation and Character Writing (2.55ms)
  ✔ 8. Roadmap Vocabulary Integration: synchronizes 60 curriculum lessons into practice section (191.65ms)
✔ Practice Levels Tests (217.43ms)

▶ Task 24.05 — Advanced HSK 5-6 Practice & Admin Materials Supabase Integration Tests
  ✔ 1. HSK 5 and HSK 6 have at least 10 grammar drills each with full pedagogical schema (1.23ms)
  ✔ 2. HSK 5 and HSK 6 have at least 10 listening drills each with Web Speech TTS audioText (0.56ms)
  ✔ 3. Practice levels and HSK 1-4 practice items maintain non-regression (0.38ms)
  ✔ 4. PracticePage.jsx renders 6 levels for grammar and listening (1.74ms)
  ✔ 5. AdminPage.jsx removes materials LocalStorage fallback and uses Supabase DB as authoritative source (1.13ms)
  ✔ 6. Custom event hanzigo:materials_updated is dispatched on AdminPage and listened on MaterialsPage (1.55ms)
  ✔ 7. Security isolation: service role key is absent from client source and materialsService enforces DB schema (11.08ms)
✔ Task 24.05 — Advanced HSK 5-6 Practice & Admin Materials Supabase Integration Tests (18.84ms)

Tổng kết:
- Số bài kiểm tra: 43
- Số bộ kiểm thử (suites): 4
- Đạt (Passed): 43 (100%)
- Lỗi (Failed): 0 (0%)
- Thời gian chạy: 311.28ms
```

---

## 9. KIỂM TOÁN LINT VÀ XÁC MINH BIÊN DỊCH BẢN PHÁT HÀNH (BUILD)

### 9.1. Kiểm tra Linter (`oxlint`)
- Công cụ: `oxlint` v1.x chạy trên 342 tệp nguồn.
- Kết quả: **0 errors** (Lỗi cú pháp JSX comment trong toán tử 3 ngôi trước đó đã được loại bỏ hoàn toàn).
- Cảnh báo (warnings): Các cảnh báo về dependency trong `useEffect` và unused imports đã được duy trì theo cấu trúc hiện tại, không gây ảnh hưởng đến tính toàn vẹn runtime.

### 9.2. Kiểm tra biên dịch Production (`vite build`)
- Lệnh: `npm run build`
- Trạng thái: **THÀNH CÔNG (0 LỖI)**
- Thời gian biên dịch: **902ms**
- Output bundle:
  - `dist/index.html`: 3.10 kB
  - `dist/assets/index-DsJmpige.css`: 317.33 kB
  - `dist/assets/PracticePage-CpvHpStu.js`: 32.77 kB
  - `dist/assets/practiceLevelData-C9vnb0a6.js`: 63.52 kB
  - `dist/assets/AdminPage-CWo0pW5C.js`: 87.62 kB
  - `dist/assets/MaterialsPage-DM2N0s0Z.js`: 123.59 kB
- Phân tích rò rỉ khóa bảo mật: **0 byte** `SUPABASE_SERVICE_ROLE_KEY` xuất hiện trong thư mục `dist/`.

---

## 10. TUÂN THỦ PHẠM VI HỆ THỐNG (SCOPE COMPLIANCE)

Tuân thủ nghiêm ngặt chỉ thị của Task 24.05:
- [x] Không triển khai chức năng Community backend mới.
- [x] Không sửa đổi Admin custom vocab và custom lessons nếu không thuộc phạm vi Materials.
- [x] Không xây dựng GameHub hoặc cơ chế trò chơi hóa mới.
- [x] Không thêm hệ thống thông báo đẩy (Push Notifications/Reminders).
- [x] Không tích hợp thêm tính năng AI mới ngoài các bộ engine hiện có.
- [x] Không thay đổi cấu hình hạ tầng Cloudflare.
- [x] Không mở rộng quy mô lớp học LiveKit vượt quá 50 học viên.

---

## 11. HẠN CHẾ ĐÃ BIẾT & CÔNG VIỆC CẦN THỰC HIỆN TIẾP THEO

1. **Âm thanh Web Speech TTS trên các thiết bị không có voice tiếng Trung chuẩn**:
   - Web Speech API phụ thuộc vào danh sách giọng đọc cài đặt trên hệ điều hành người dùng (`zh-CN`). Trên một số trình duyệt hoặc hệ thống chưa cài voice tiếng Trung, hệ thống sẽ tự động fallback sang voice khả dụng gần nhất hoặc hiển thị văn bản để học viên đọc hiểu.
2. **Tab Vocab & Tab Lessons trong AdminPage**:
   - Hiện tại Tab 3 (Vocab) và Tab 4 (Lessons) trong `AdminPage.jsx` vẫn sử dụng `materialsStorage.js` (`getStoredCustomVocab`, `getStoredCustomLessons`). Cần đưa vào kế hoạch Task tiếp theo để chuyển nốt hai tab này sang Supabase tương tự như Tab Materials đã hoàn thành trong Task này.
3. **Môi trường Production Thực tế**:
   - Sau khi hoàn tất triển khai mã nguồn lên môi trường Production Live (Vercel), cần thực hiện phiên đăng nhập của tài khoản quản trị viên thật để nghiệm thu chu trình CRUD tài liệu trực tiếp trên Production URL.

---

## 12. DANH MỤC CÁC TỆP TIN THAY ĐỔI TRONG TASK 24.05

| Đường dẫn tệp | Loại thay đổi | Mô tả nội dung |
| :--- | :---: | :--- |
| `src/data/practiceLevelData.js` | Sửa đổi | Thêm HSK 5 và HSK 6 vào `PRACTICE_LEVELS`; bổ sung 20 bài ngữ pháp (`gram-l5-01` .. `gram-l6-10`) và 20 bài nghe (`list-l5-01` .. `list-l6-10`). |
| `src/pages/PracticePage.jsx` | Sửa đổi | Mở rộng giới hạn cấp độ 1–6, lưới 6 cột `md:grid-cols-6`, điều hướng next level hỗ trợ HSK 5 và 6. |
| `src/pages/AdminPage.jsx` | Sửa đổi | Bỏ LocalStorage materials, tích hợp Supabase DB CRUD (`materialsService`), thêm Loader/Error/Empty states, chuẩn hóa User Management Task 24.03. |
| `src/pages/MaterialsPage.jsx` | Sửa đổi | Bổ sung `useEffect` lắng nghe sự kiện `hanzigo:materials_updated` để tự động làm mới kho tài liệu khi Admin cập nhật. |
| `tests/practiceLevels.test.js` | Sửa đổi | Cập nhật kiểm tra 6 cấp độ HSK và dải cấp độ `[1, 2, 3, 4, 5, 6]` cho bài nghe và ngữ pháp. |
| `tests/grammarListeningIntegration.test.js` | Sửa đổi | Cập nhật số lượng bài ngữ pháp (27) và bài nghe (29), bổ sung kiểm tra HSK 5 & 6. |
| `tests/productCompletionGapClosure.test.js` | Tạo mới | Bộ kiểm thử chuyên sâu 7 bài test xác minh toàn diện Task 24.05. |
| `docs/PHASE_24_TASK_05_ADVANCED_PRACTICE_AND_MATERIALS_INTEGRATION_REPORT.md` | Tạo mới | Báo cáo nghiệm thu kỹ thuật đầy đủ 14 phần theo tiêu chuẩn dự án. |

---

## 13. KHUYẾN NGHỊ CHO CÁC NHIỆM VỤ TIẾP THEO

1. **Task 24.06 — Admin Custom Vocab & Lessons Supabase Integration**:
   - Chuyển đổi nốt hai tab còn lại trong `AdminPage.jsx` (Custom Vocabulary và Custom Lessons) từ LocalStorage sang Supabase Database tables (`public.vocabulary` và `public.lessons`), hoàn thành 100% mục tiêu loại bỏ hoàn toàn dữ liệu cục bộ khỏi trang quản trị.
2. **Task 24.07 — Community Interactive Flow Audit & Real Data Migration**:
   - Khảo sát và thiết kế schema bài viết cộng đồng thực tế trên Supabase, thay thế dữ liệu tĩnh mẫu của `CommunityPage.jsx` bằng luồng thảo luận thật của học viên và giáo viên.

---

## 14. KÝ DUYỆT & THÔNG TIN KIỂM TOÁN HỆ THỐNG

- **Phiên bản hệ thống**: HanziGo v1.0.0-rc24.05
- **Công nghệ nền tảng**: React 19, Vite 8.3.1, Tailwind CSS, Supabase JS SDK, Node.js v24.11.0
- **Số bài kiểm tra tự động xác nhận**: 43/43 PASS (100%)
- **Trạng thái phê duyệt**: `IMPLEMENTATION COMPLETE` • `TESTS PASSED` • `BUILD VERIFIED` • `PRODUCTION VERIFICATION PARTIAL`

