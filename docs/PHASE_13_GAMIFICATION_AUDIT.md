# BÁO CÁO AUDIT ĐỘC LẬP PHASE 13: GAMIFICATION & CƠ CHẾ STREAK (GAMIFICATION ENGINE)

**Dự án:** HanziGo — Nền tảng học tiếng Trung trực tuyến  
**Giai đoạn:** Phase 13 — Independent Audit & Verification of Phase 12  
**Đối tượng kiểm tra:** `src/utils/gamificationEngine.js`, `tests/gamificationEngine.test.js`, `tests/phase13AdversarialSecurity.test.js`.  
**Ngày thực hiện:** 25/10/2026  
**Trạng thái kiểm tra:** Hoàn tất & Không phát sinh hồi quy.

---

## 1. Phương pháp & Phạm vi kiểm tra trực tiếp

Chúng tôi đã tiến hành phân tích sâu các hàm xử lý Gamification cốt lõi trong `src/utils/gamificationEngine.js`:
- `calculateStreak`: Tính toán chuỗi ngày học liên tục, xử lý mốc ngày và tiêu hao khiên bảo vệ (Streak Freeze).
- `getTodayDateString`: Xác định ngày hiện tại theo múi giờ IANA của học viên (mặc định `'Asia/Ho_Chi_Minh'`).
- `awardActivityXp`: Cộng XP có giới hạn hàng ngày và chống trùng lặp.
- `evaluateBadges`: Mở khóa danh hiệu học thuật từ sự kiện học tập thực tế.
- `getScholarRank`: Phân hạng danh hiệu học sĩ theo các mốc XP lũy kế.

---

## 2. Các phát hiện & Đánh giá chi tiết (Audit Findings)

### Đánh giá 1: Bảo toàn Streak theo Múi giờ IANA và Xuyên biên giới lịch (Calendar Boundaries)
- **Cơ chế thực tế:** Hàm `getTodayDateString(timezone)` sử dụng `Intl.DateTimeFormat('en-CA', { timeZone: timezone })` để định dạng ngày theo chuẩn `YYYY-MM-DD`.
- **Kiểm tra ranh giới năm nhuận (Leap Year) & Chuyển năm:**
  - Chuyển tiếp ngày nhuận: Từ `2024-02-28` đến `2024-02-29` (1 ngày), từ `2024-02-29` đến `2024-03-01` (1 ngày).
  - Chuyển giao năm mới: Từ `2025-12-31` sang `2026-01-01` (1 ngày).
- **Kết quả:** Thuật toán tính toán số ngày chênh lệch dựa trên `Math.round((tCurr - tLast) / 86400000)` tính theo mốc UTC nửa đêm, xử lý chính xác và không bị lệch bởi quy ước giờ mùa hè (DST) tại các quốc gia sử dụng DST.

### Đánh giá 2: Chống tăng Streak nhiều lần trong cùng một ngày (Same-Day Idempotency)
- **Kịch bản kiểm thử:** Học viên hoàn thành bài học lúc 08:00 sáng (streak tăng từ 3 lên 4), sau đó tiếp tục làm thêm bài tập lúc 14:00 và 20:00 cùng ngày.
- **Kết quả mã nguồn:**
  ```javascript
  if (dayDiff === 0) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      freezeCount: streak.freezeCount,
      lastActivityDate: todayStr,
      freezeUsedToday: false,
      streakSaved: false
    };
  }
  ```
- **Kết luận:** An toàn. Nhiều hoạt động trong cùng một ngày không làm tăng số chuỗi streak; streak chỉ được bảo lưu và giữ nguyên cho đến ngày hôm sau.

### Đánh giá 3: Chống lạm dụng & Tiêu hao lặp Khiên bảo vệ (Streak Freeze)
- **Kịch bản rủi ro:**
  - Khi học viên nghỉ 1 ngày (`dayDiff === 2`), nếu hệ thống gọi `calculateStreak` nhiều lần trong ngày đó (do người dùng tải lại trang F5 nhiều lần hoặc nhiều component cùng gọi), khiên bảo vệ có thể bị trừ hết sạch.
- **Kết quả mã nguồn:**
  - Thuật toán kiểm tra chặt chẽ:
    ```javascript
    if (dayDiff === 2) {
      if (streak.freezeCount > 0) {
        // Cứu chuỗi: streak giữ nguyên, trừ 1 freeze
        return {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          freezeCount: streak.freezeCount - 1,
          lastActivityDate: todayStr,
          freezeUsedToday: true,
          streakSaved: true
        };
      }
    }
    ```
  - Khi `lastActivityDate` được cập nhật thành ngày hiện tại (`todayStr`), mọi lần gọi kế tiếp trong cùng ngày sẽ rơi vào nhánh `dayDiff === 0`, do đó không thể trừ tiếp `freezeCount`.
  - Nếu học viên nghỉ từ 2 ngày trở lên (`dayDiff > 2`), dù còn 1 freeze cũng không đủ cứu và streak sẽ được đặt lại về 1 (`currentStreak: 1`) theo đúng luật chơi, đảm bảo tính công bằng.

### Đánh giá 4: Tính chính xác của 10 Cấp bậc Học sĩ (Scholar Ranks) tại mọi ranh giới
Hệ thống gồm 10 bậc học vị:
1. Đồng Môn (Tong Sheng) - 0 XP
2. Tú Tài (Xiu Cai) - 500 XP
3. Cử Nhân (Ju Ren) - 1,500 XP
4. Cống Sĩ (Gong Shi) - 3,500 XP
5. Tiến Sĩ (Jin Shi) - 7,000 XP
6. Thám Hoa (Tan Hua) - 12,000 XP
7. Bảng Nhãn (Bang Yan) - 20,000 XP
8. Trạng Nguyên (Zhuang Yuan) - 32,000 XP
9. Hàn Lâm Viện Sĩ (Hanlin Academician) - 50,000 XP
10. Thái Học Đại Sĩ (Grand Preceptor) - 80,000 XP

- **Kiểm thử ranh giới:**
  - Điểm `499 XP` -> `Đồng Môn (Tong Sheng)`
  - Điểm `500 XP` -> Đúng ngưỡng đạt `Tú Tài (Xiu Cai)`
  - Điểm `3,500 XP` -> Đúng ngưỡng đạt `Cống Sĩ (Gong Shi)`
  - Điểm `80,000 XP` và `999,999 XP` -> Đúng ngưỡng đạt `Thái Học Đại Sĩ (Grand Preceptor)`
- **Kết luận:** Tất cả 10 mốc phân bậc hoạt động chính xác tuyệt đối, không có sai lệch toán học `<= / <`.

### Đánh giá 5: Hệ thống 18 Danh hiệu Học thuật (18 Academic Badges)
- **Kiểm tra tính nhất quán:**
  - Danh hiệu được chia thành 4 nhóm:
    * 4 Huy hiệu Chuỗi học tập: `streak_3`, `streak_7`, `streak_30`, `streak_100`.
    * 4 Huy hiệu Hán tự & Từ vựng: `vocab_50`, `vocab_200`, `vocab_500`, `hanzi_master_100`.
    * 5 Huy hiệu Bài thi & Học thuật: `first_perfect_lesson`, `mock_exam_starter`, `mock_exam_high_scorer`, `scholar_graduate`, `ai_conversation_master`.
    * 5 Huy hiệu Cấp độ HSK: `hsk1_master`, `hsk2_master`, `hsk3_master`, `hsk4_master`, `hsk5_master`.
- **Cơ chế chống cấp trùng:** Hàm `evaluateBadges` lọc bỏ các danh hiệu đã mở khóa (`unlockedBadgeIds.includes(badge.id)`) và chỉ trả về các huy hiệu mới mở khóa (`newlyUnlocked`), đảm bảo tính lũy tích bất biến.

---

## 3. Kết quả Kiểm thử Đối kháng Gamification (Gamification Test Suite)

Đã chạy kiểm thử với `node --test tests/phase13AdversarialSecurity.test.js`:

```text
✔ PHASE 13 GAME-01: Same-day multiple activity completions do NOT increase streak (0.16ms)
✔ PHASE 13 GAME-02: Streak Freeze is consumed exactly once and protected against repeated calls on same day (0.10ms)
✔ PHASE 13 GAME-03: Gap > 1 day with 1 freeze cannot salvage streak and resets to 1 (0.05ms)
✔ PHASE 13 GAME-04: Leap year and calendar boundaries calculate exact 1 day diff (0.05ms)
✔ PHASE 13 GAME-05: Scholar ranks evaluate correctly at all 10 tier boundaries (0.15ms)
```

**Tất cả 5 test case kiểm thử độ bền Gamification đều đạt (PASS) 100%.**
