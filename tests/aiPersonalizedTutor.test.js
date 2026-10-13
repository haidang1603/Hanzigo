/**
 * =========================================================================
 * HANZI GO — PHASE 05: PERSONALIZED CHINESE TUTOR ACCEPTANCE TEST SUITE
 * =========================================================================
 * Kiểm thử toàn diện cá nhân hóa Gia sư AI dựa trên dữ liệu học tập thật:
 * 1. Hai hồ sơ giả lập có trình độ khác nhau (Profile A vs Profile B):
 *    - Profile A (HSK 1, Cold-start, người học mới)
 *    - Profile B (HSK 3, Đã hoàn thành 24 bài, có lỗi sai xác nhận về câu chữ 把)
 * 2. Khả năng điều chỉnh mức giải thích và ví dụ theo trình độ (HSK 1 vs HSK 3).
 * 3. Đưa tóm tắt trình độ vào prompt (<learner_profile_summary>).
 * 4. Đề xuất bước học tiếp theo (next_learning_step) minh bạch từ dữ liệu học.
 * 5. Phân biệt lỗi sai đã xác nhận từ bài kiểm tra với suy đoán của AI.
 * 6. Tính toán điểm yếu bằng quy tắc minh bạch (SRS backlog, quiz mistakes, phát âm, cold-start).
 * 7. Không rò rỉ dữ liệu chéo giữa các người dùng (User A vs User B isolation).
 * 8. Zero-Trust Security: Không cho phép AI hoặc client can thiệp thay đổi quyền hạn (No Privilege Escalation).
 * 9. Không suy diễn quá mức (Zero-fabrication cho người dùng mới).
 * 10. Cho phép người dùng xem, sửa mục tiêu và xóa dữ liệu cá nhân hóa (GDPR / Nghị định 13).
 * =========================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import tutorHandler from '../api/ai/tutor.js';
import {
  getLearnerPreferences,
  saveLearnerPreferences,
  buildComprehensiveLearnerContext,
  sanitizeContextForAi,
  recordConfirmedMistake,
  getConfirmedMistakes,
  clearLearnerPersonalizationData,
  isPersonalizationEnabled
} from '../src/services/learnerContextService.js';

// Polyfill localStorage trong môi trường Node test
if (typeof globalThis.localStorage === 'undefined') {
  const memoryStore = new Map();
  globalThis.localStorage = {
    getItem: (k) => memoryStore.get(k) || null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k),
    clear: () => memoryStore.clear(),
    key: (i) => Array.from(memoryStore.keys())[i] || null,
    get length() {
      return memoryStore.size;
    }
  };
}

function resetStorage() {
  localStorage.clear();
}

function createMockHttp({ method = 'POST', headers = {}, body = {} }) {
  const req = {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer valid-test-token',
      'x-user-id': 'test-learner-default',
      ...headers
    },
    body
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  return { req, res };
}

// =========================================================================
// TEST SUITE: PHASE 05 PERSONALIZED CHINESE TUTOR
// =========================================================================

test('HANZIGO PHASE 05: PERSONALIZED CHINESE TUTOR ACCEPTANCE SUITE', async (t) => {

  // -----------------------------------------------------------------------
  // 1. TÍNH TOÁN ĐIỂM YẾU BẰNG QUY TẮC MINH BẠCH (DETERMINISTIC RULES)
  // -----------------------------------------------------------------------
  await t.test('1. Deterministic Weakness Calculation: Cold-start, SRS backlog, Pronunciation & Confirmed Quiz Mistakes', () => {
    resetStorage();

    // 1A. Người học mới (Cold Start): Chưa có dữ liệu -> gắn cờ cold start, không tạo điểm số ảo
    const newStudent = { id: 'student-cold-start', uid: 'student-cold-start' };
    const coldCtx = buildComprehensiveLearnerContext(newStudent);

    assert.equal(coldCtx.hasSparseData, true, 'Học viên mới phải có cờ hasSparseData = true');
    assert.equal(coldCtx.completedLessonsCount, 0, 'Số bài hoàn thành phải bằng 0');
    assert.ok(coldCtx.weaknesses.some(w => w.id === 'wk-cold-start'), 'Phải có điểm yếu wk-cold-start minh bạch');
    assert.equal(coldCtx.guidanceForNewLearner?.suggestedAction, 'placement_test', 'Đề xuất làm placement test');

    // 1B. Quy tắc SRS Backlog: Tồn đọng >= 10 từ vựng cần ôn
    const srsStudent = { id: 'student-srs', uid: 'student-srs' };
    const revKey = `hanzigo_vocab_review_${srsStudent.id}`;
    const tenWords = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11'];
    localStorage.setItem(revKey, JSON.stringify(tenWords));

    const srsCtx = buildComprehensiveLearnerContext(srsStudent);
    assert.ok(srsCtx.srsDueCount >= 10, 'Đếm đúng số từ SRS đến hạn >= 10');
    assert.ok(srsCtx.weaknesses.some(w => w.id === 'wk-srs-backlog'), 'Phải kích hoạt điểm yếu tồn đọng từ vựng wk-srs-backlog');

    // 1C. Quy tắc Phát âm yếu: Điểm mic trung bình < 70% với ít nhất 2 lần thử
    const pronStudent = { id: 'student-pron', uid: 'student-pron' };
    const pronKey = `hanzigo_pronounce_history_${pronStudent.id}`;
    localStorage.setItem(pronKey, JSON.stringify([
      { overall: 55, score: 55 },
      { overall: 60, score: 60 }
    ]));
    const pronCtx = buildComprehensiveLearnerContext(pronStudent);
    assert.ok(pronCtx.weaknesses.some(w => w.id === 'wk-pronunciation'), 'Phải kích hoạt điểm yếu phát âm khi điểm mic < 70%');

    // 1D. Quy tắc Lỗi sai xác nhận từ quiz / exam (count >= 2)
    const mistakeStudent = { id: 'student-mistake', uid: 'student-mistake' };
    recordConfirmedMistake(mistakeStudent, {
      topic: 'Cấu trúc câu chữ 把',
      question: '我把书看。',
      userChoice: 'Đúng',
      correctAnswer: 'Sai (Động từ cần có thành phần khác)',
      source: 'quiz',
      details: 'Nhầm lẫn cấu trúc câu chữ 把: động từ chính không được đứng một mình'
    });
    // Ghi nhận lần 2
    recordConfirmedMistake(mistakeStudent, {
      topic: 'Cấu trúc câu chữ 把',
      question: '他把作业做。',
      source: 'quiz'
    });

    const confirmedCtx = buildComprehensiveLearnerContext(mistakeStudent);
    assert.equal(confirmedCtx.confirmedMistakes.length, 1);
    assert.equal(confirmedCtx.confirmedMistakes[0].count, 2);
    assert.ok(
      confirmedCtx.weaknesses.some(w => w.topic === 'Cấu trúc câu chữ 把' && w.isConfirmed === true),
      'Phải kích hoạt điểm yếu lỗi sai xác nhận từ quiz khi lặp lại >= 2 lần'
    );
  });

  // -----------------------------------------------------------------------
  // 2. SO SÁNH HAI HỒ SƠ GIẢ LẬP (PROFILE A vs PROFILE B) TRÊN AI TUTOR
  // -----------------------------------------------------------------------
  await t.test('2. Two Simulated Profiles: Profile A (HSK 1 Beginner) vs Profile B (HSK 3 Intermediate)', async () => {
    resetStorage();

    // PROFILE A: Người mới bắt đầu (HSK 1, Cold-start)
    const profileA = {
      userId: 'learner-profile-a-beginner',
      targetHskLevel: 'HSK 1',
      learningGoal: 'general_foundation',
      completedLessonsCount: 0,
      confirmedMistakes: [],
      hasSparseData: true,
      weaknesses: [{ label: 'Chưa có dữ liệu nền tảng', skill: 'placement' }]
    };

    const { req: reqA, res: resA } = createMockHttp({
      headers: { 'x-user-id': profileA.userId },
      body: {
        question: 'Xin chào tiếng Trung nói thế nào?',
        learner_level: 'HSK 1',
        learner_context: profileA
      }
    });

    await tutorHandler(reqA, resA);
    assert.equal(resA.statusCode, 200);
    assert.equal(resA.body.success, true);
    assert.equal(resA.body.learner_level, 'HSK 1');
    assert.equal(resA.body._metadata.personalized, true);

    const dataA = resA.body.data;
    assert.ok(dataA.answer, 'Profile A nhận câu trả lời phù hợp');
    assert.ok(dataA.pinyin, 'Profile A bắt buộc có Pinyin chuẩn');
    assert.ok(dataA.next_learning_step, 'Profile A phải có đề xuất bước học tiếp theo');
    assert.equal(dataA.next_learning_step.action, 'start_lesson', 'Học viên mới được gợi ý bắt đầu bài học');
    assert.equal(dataA.next_learning_step.recommended_lesson_id, 'l-101', 'Gợi ý bài 1');

    // PROFILE B: Trình độ HSK 3 có lỗi sai xác nhận về câu chữ 把
    const profileB = {
      userId: 'learner-profile-b-intermediate',
      targetHskLevel: 'HSK 3',
      learningGoal: 'hsk_exam',
      completedLessonsCount: 24,
      confirmedMistakes: ['Cấu trúc câu chữ 把'],
      hasSparseData: false,
      weaknesses: [
        { label: 'Lỗi sai xác nhận: Cấu trúc câu chữ 把', detail: 'Đã làm sai 2 lần trong bài quiz' }
      ]
    };

    const { req: reqB, res: resB } = createMockHttp({
      headers: { 'x-user-id': profileB.userId },
      body: {
        question: 'Giải thích câu chữ 把 trong tiếng Trung',
        learner_level: 'HSK 3',
        learner_context: profileB
      }
    });

    await tutorHandler(reqB, resB);
    assert.equal(resB.statusCode, 200);
    assert.equal(resB.body.success, true);
    assert.equal(resB.body.learner_level, 'HSK 3');

    const dataB = resB.body.data;
    assert.ok(dataB.answer, 'Profile B nhận được câu trả lời');
    assert.ok(dataB.confirmed_mistake_note, 'Profile B phải nhận được lưu ý lỗi sai đã xác nhận về câu chữ 把');
    assert.ok(
      dataB.confirmed_mistake_note.includes('chữ 把'),
      'Lưu ý phải đề cập chính xác đến câu chữ 把'
    );
    assert.ok(dataB.next_learning_step, 'Profile B phải có bước học tiếp theo');
    assert.equal(dataB.next_learning_step.action, 'practice_grammar');
    assert.ok(dataB.next_learning_step.target_topic.includes('把'));
  });

  // -----------------------------------------------------------------------
  // 3. CÁCH LY DỮ LIỆU CHÉO (STRICT CROSS-USER ISOLATION)
  // -----------------------------------------------------------------------
  await t.test('3. Cross-User Data Isolation: User A never leaks data to User B', () => {
    resetStorage();

    const userA = { id: 'alice-001', uid: 'alice-001' };
    const userB = { id: 'bob-002', uid: 'bob-002' };

    // Lưu mục tiêu và lỗi sai riêng cho User A
    saveLearnerPreferences({ targetHskLevel: 'HSK 4', learningGoal: 'work_business' }, userA);
    recordConfirmedMistake(userA, {
      topic: 'Bổ ngữ trạng thái 得',
      source: 'quiz',
      details: 'Nhầm 得 và 地'
    });

    // Lưu mục tiêu riêng cho User B
    saveLearnerPreferences({ targetHskLevel: 'HSK 2', learningGoal: 'travel_speaking' }, userB);

    // Kiểm tra User A
    const prefsA = getLearnerPreferences(userA);
    const mistakesA = getConfirmedMistakes(userA);
    assert.equal(prefsA.targetHskLevel, 'HSK 4');
    assert.equal(mistakesA.length, 1);
    assert.equal(mistakesA[0].topic, 'Bổ ngữ trạng thái 得');

    // Kiểm tra User B — Tuyệt đối không rò rỉ dữ liệu của User A
    const prefsB = getLearnerPreferences(userB);
    const mistakesB = getConfirmedMistakes(userB);
    assert.equal(prefsB.targetHskLevel, 'HSK 2');
    assert.equal(mistakesB.length, 0, 'User B không được chứa bất kỳ lỗi sai nào của User A');
  });

  // -----------------------------------------------------------------------
  // 4. PHÂN ĐỊNH LỖI SAI XÁC NHẬN VÀ SUY ĐOÁN CỦA AI (NO OVER-INFERENCE)
  // -----------------------------------------------------------------------
  await t.test('4. Distinction: Confirmed mistakes vs AI speculation & Zero Over-Inference', () => {
    resetStorage();

    const cleanLearner = { id: 'learner-clean', uid: 'learner-clean' };
    const ctx = buildComprehensiveLearnerContext(cleanLearner);

    // Người học mới không được có bất kỳ lỗi sai giả định nào
    assert.equal(ctx.confirmedMistakes.length, 0);

    // Kiểm tra cổng làm sạch: Không cho phép payload chứa các trường suy đoán bừa bãi
    const sanitized = sanitizeContextForAi(ctx);
    assert.equal(sanitized.confirmedMistakes.length, 0);
  });

  // -----------------------------------------------------------------------
  // 5. BẢO MẬT ZERO-TRUST: CHỐNG LEO THANG ĐẶC QUYỀN (NO PRIVILEGE ESCALATION)
  // -----------------------------------------------------------------------
  await t.test('5. Zero-Trust Security: Strips any spoofed roles, permissions or admin flags in learner_context', async () => {
    // Kẻ tấn công cố tình truyền payload chứa đặc quyền admin
    const maliciousPayload = {
      role: 'admin',
      roles: ['teacher', 'admin'],
      permissions: ['delete_all', 'manage_users'],
      isAdmin: true,
      is_admin: true,
      user_id: 'impersonated-victim',
      targetHskLevel: 'HSK 1',
      learningGoal: 'general_foundation'
    };

    // Kiểm tra qua cổng sanitizeContextForAi
    const safePayload = sanitizeContextForAi(maliciousPayload);
    assert.equal(safePayload.role, undefined, 'Thuộc tính role phải bị tước bỏ hoàn toàn');
    assert.equal(safePayload.roles, undefined, 'Thuộc tính roles phải bị tước bỏ');
    assert.equal(safePayload.permissions, undefined, 'Thuộc tính permissions phải bị tước bỏ');
    assert.equal(safePayload.isAdmin, undefined, 'Thuộc tính isAdmin phải bị tước bỏ');

    // Kiểm tra trên Serverless function /api/ai/tutor
    const { req, res } = createMockHttp({
      headers: {
        'x-user-id': 'legitimate-student-789'
      },
      body: {
        question: 'Xin chào',
        learner_context: maliciousPayload
      }
    });

    await tutorHandler(req, res);
    assert.equal(res.statusCode, 200);
    // Phản hồi metadata và ngữ cảnh không bao giờ thăng cấp quyền cho kẻ tấn công
    assert.equal(res.body._metadata.sanitized, true);
  });

  // -----------------------------------------------------------------------
  // 6. XEM, SỬA MỤC TIÊU VÀ XÓA DỮ LIỆU CÁ NHÂN HÓA (GDPR & POLICY COMPLIANCE)
  // -----------------------------------------------------------------------
  await t.test('6. Goal Management & GDPR Deletion: View, update and wipe personalization data', () => {
    resetStorage();

    const user = { id: 'gdpr-user-999', uid: 'gdpr-user-999' };

    // 6A. Xem mục tiêu mặc định
    const initialPrefs = getLearnerPreferences(user);
    assert.equal(initialPrefs.targetHskLevel, 'HSK 1');

    // 6B. Cập nhật mục tiêu học
    saveLearnerPreferences({
      targetHskLevel: 'HSK 3',
      learningGoal: 'hsk_exam',
      dailyGoalMinutes: 30,
      personalizationEnabled: true
    }, user);

    const updatedPrefs = getLearnerPreferences(user);
    assert.equal(updatedPrefs.targetHskLevel, 'HSK 3');
    assert.equal(updatedPrefs.dailyGoalMinutes, 30);
    assert.equal(updatedPrefs.learningGoal, 'hsk_exam');

    // Ghi nhận lỗi sai giả lập
    recordConfirmedMistake(user, { topic: 'Từ nối 但是', source: 'quiz' });
    assert.equal(getConfirmedMistakes(user).length, 1);

    // 6C. Xóa dữ liệu theo chính sách bảo vệ dữ liệu (GDPR / Nghị định 13)
    const clearResult = clearLearnerPersonalizationData(user);
    assert.equal(clearResult.success, true);

    // Sau khi xóa: Lỗi sai và tùy chọn cá nhân hóa phải được dọn dẹp sạch
    const clearedMistakes = getConfirmedMistakes(user);
    assert.equal(clearedMistakes.length, 0, 'Toàn bộ lỗi sai cá nhân phải bị xóa');

    const freshCtx = buildComprehensiveLearnerContext(user);
    assert.equal(freshCtx.confirmedMistakes.length, 0);
  });

});
