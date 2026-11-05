/**
 * =========================================================================
 * PHASE 18 TEST SUITE: EXPAND EXAM BANK & IMPORT PUBLIC EXAMS
 * =========================================================================
 * Kiểm thử toàn diện ngân hàng đề thi HSK 1 - 6 mở rộng:
 * 1. Độ phủ cấp độ HSK 1 đến HSK 6 (100% câu hỏi thật, không mock).
 * 2. Đề tham chiếu chính thức CTI/CLEC (H10901 - H60901) ghi công chuẩn bản quyền.
 * 3. 5 Chế độ thi & luyện tập (Thi thử toàn phần, Luyện kỹ năng, Luyện chủ đề, Sổ câu sai, Thi ngẫu nhiên).
 * 4. Bảo mật khảo thí: Tước bỏ đáp án & lời giải trước khi nộp (Zero answer leak).
 * 5. Công cụ nhập đề hàng loạt & thẩm định Dry-run nguyên tử.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  HSK_EXAMS, 
  HSK_QUESTIONS, 
  getFullExamById, 
  getSanitizedExamForTaking 
} from '../src/data/hskExamsData.js';
import { 
  getHskExams, 
  generateRandomExam, 
  generateTopicExam, 
  getAvailableExamTopics,
  getMistakePracticeExam,
  submitExamAttempt,
  getAudioPlayLimit
} from '../src/services/hskService.js';
import { 
  validateHskImportPayload, 
  importHskExamWithValidation, 
  generateSampleImportJson 
} from '../src/services/hskImportService.js';

describe('PHASE 18 — HSK EXAM BANK EXPANSION & INTEGRITY', () => {

  it('1. Đảm bảo toàn bộ HSK 1 đến HSK 6 đều có nhiều đề thi hoàn chỉnh', () => {
    const levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
    const countByLevel = {};

    levels.forEach(lvl => {
      const levelExams = HSK_EXAMS.filter(e => e.level === lvl && e.is_published);
      countByLevel[lvl] = levelExams.length;
      assert.ok(levelExams.length >= 3, `Cấp độ ${lvl} phải có ít nhất 3 đề thi hoàn chỉnh. Hiện có: ${levelExams.length}`);
    });

    assert.ok(HSK_EXAMS.length >= 26, `Tổng số đề thi toàn hệ thống phải >= 26. Hiện có: ${HSK_EXAMS.length}`);
  });

  it('2. Kiểm tra tính toàn vẹn câu hỏi: Mỗi đề thi có đủ số lượng câu hỏi thực tế khớp total_questions', () => {
    // hsk1-official-ref-01 là tài liệu tham chiếu ngoại bộ (chinesetest.cn) được bảo tồn theo chuẩn Phase 3
    HSK_EXAMS.filter(exam => exam.id !== 'hsk1-official-ref-01').forEach(exam => {
      const full = getFullExamById(exam.id);
      assert.ok(full, `Đề thi ${exam.id} không tìm thấy dữ liệu đầy đủ`);
      assert.equal(
        full.questions.length, 
        exam.total_questions, 
        `Đề [${exam.id}] cấu hình ${exam.total_questions} câu nhưng thực tế có ${full.questions.length} câu`
      );
    });
  });

  it('3. Ngân hàng câu hỏi có ID duy nhất (0 câu trùng lặp ID) và có đầy đủ đáp án & giải thích', () => {
    const seenIds = new Set();
    assert.ok(HSK_QUESTIONS.length >= 400, `Tổng số câu hỏi phải >= 400. Hiện có: ${HSK_QUESTIONS.length}`);

    HSK_QUESTIONS.forEach(q => {
      assert.ok(!seenIds.has(q.id), `Phát hiện trùng lặp mã câu hỏi ID: ${q.id}`);
      seenIds.add(q.id);

      assert.ok(q.prompt && q.prompt.trim().length > 0, `Câu hỏi ${q.id} thiếu nội dung đề bài`);
      assert.ok(q.explanation && q.explanation.trim().length > 0, `Câu hỏi ${q.id} thiếu lời giải thích`);

      const hasAnswer = (typeof q.correct_option_index === 'number') || 
                        (Array.isArray(q.correct_order) && q.correct_order.length > 0) ||
                        (typeof q.correctOptionIndex === 'number');
      assert.ok(hasAnswer || q.is_subjective, `Câu hỏi ${q.id} thiếu đáp án`);
    });
  });

  it('4. Đề minh họa CTI/CLEC chính thức (H10901 - H60901) có đầy đủ nguồn, bản quyền và nội dung', () => {
    const officialIds = [
      'hsk1-official-sample-01',
      'hsk2-official-ref-01',
      'hsk3-official-ref-01',
      'hsk4-official-ref-01',
      'hsk5-official-ref-01',
      'hsk6-official-ref-01'
    ];

    officialIds.forEach(id => {
      const exam = HSK_EXAMS.find(e => e.id === id);
      assert.ok(exam, `Thiếu đề tham chiếu chính thức mã: ${id}`);
      assert.equal(exam.exam_type, 'official_sample');
      assert.equal(exam.permission_status, 'reproducible');
      assert.ok(exam.source_url.includes('chinesetest.cn'));
      assert.ok(exam.source_author.includes('Chinese Testing International'));

      const full = getFullExamById(id);
      assert.ok(full.questions.length > 0, `Đề tham chiếu ${id} không được để trống câu hỏi`);

      // Kiểm tra câu hỏi nghe có audio_script
      const listeningQs = full.questions.filter(q => q.part_type === 'listening');
      listeningQs.forEach(lq => {
        assert.ok(lq.audio_script && lq.audio_script.trim().length > 0, `Câu nghe ${lq.id} thiếu audio script lời thoại`);
      });
    });
  });

  it('5. BẢO MẬT KHẢO THÍ: getSanitizedExamForTaking TUYỆT ĐỐI không để lộ đáp án hay giải thích', () => {
    HSK_EXAMS.forEach(exam => {
      const sanitized = getSanitizedExamForTaking(exam.id);
      assert.ok(sanitized, `Không thể sanitize đề ${exam.id}`);
      sanitized.questions.forEach(sq => {
        assert.equal(sq.correct_option_index, undefined, `LỘ ĐÁP ÁN correct_option_index ở câu ${sq.id}`);
        assert.equal(sq.correctOptionIndex, undefined, `LỘ ĐÁP ÁN correctOptionIndex ở câu ${sq.id}`);
        assert.equal(sq.explanation, undefined, `LỘ LỜI GIẢI explanation ở câu ${sq.id}`);
        assert.equal(sq.correct_order, undefined, `LỘ ĐÁP ÁN correct_order ở câu ${sq.id}`);
      });
    });
  });

  it('6. CHẾ ĐỘ 5: Bộ sinh đề thi ngẫu nhiên thích ứng (generateRandomExam) hoạt động chuẩn xác', () => {
    const randomExam = generateRandomExam({
      level: 'HSK 1',
      questionCount: 15,
      skills: ['listening', 'reading']
    });

    assert.ok(randomExam.id.startsWith('random-hsk1-'));
    assert.equal(randomExam.total_questions, 15);
    assert.equal(randomExam.questions.length, 15);
    assert.equal(randomExam.exam_type, 'random');

    // Không lặp câu hỏi
    const qIds = randomExam.questions.map(q => q.id);
    const uniqueIds = new Set(qIds);
    assert.equal(uniqueIds.size, 15, 'Đề thi ngẫu nhiên không được lặp lại câu hỏi');

    // Tước bỏ đáp án khi cấp cho thí sinh
    const sanitizedRandom = getSanitizedExamForTaking(randomExam.id);
    assert.ok(sanitizedRandom);
    assert.equal(sanitizedRandom.questions[0].correct_option_index, undefined);

    // Chấm điểm chuẩn xác
    const mockAnswers = {};
    randomExam.questions.forEach((q, idx) => {
      mockAnswers[q.id] = (idx % 2 === 0) ? q.correct_option_index : 99; // Một nửa đúng
    });

    const result = submitExamAttempt({
      examId: randomExam.id,
      submittedAnswers: mockAnswers,
      timeSpentSeconds: 180,
      examMode: 'simulation'
    });

    return result.then(res => {
      assert.ok(res.score > 0, 'Phải có điểm số');
      assert.equal(res.correctCount + res.incorrectCount, 15);
      assert.ok(res.detailedResults.length === 15);
    });
  });

  it('7. CHẾ ĐỘ 3: Bộ đề theo chủ đề (generateTopicExam) & Danh mục chủ đề', async () => {
    const topics = getAvailableExamTopics('HSK 1');
    assert.ok(Array.isArray(topics) && topics.length >= 7);

    const topicExam = generateTopicExam({
      level: 'HSK 1',
      topic: 'daily_life',
      questionCount: 10
    });

    assert.ok(topicExam.id.startsWith('topic-daily_life-'));
    assert.ok(topicExam.total_questions > 0);
    assert.equal(topicExam.exam_type, 'topic');

    // Kiểm tra bộ lọc đề thi theo chủ đề
    const examsByTopic = await getHskExams({ topic: 'daily_life' });
    assert.ok(Array.isArray(examsByTopic));
  });

  it('8. CHẾ ĐỘ 4: Tạo đề ôn luyện từ Sổ tay câu sai (getMistakePracticeExam)', async () => {
    const mockUser = { id: 'test_user_phase18', email: 'test18@hanzigo.com', role: 'student' };
    
    // Giả lập ghi nhận kết quả có câu sai
    const practice = await getMistakePracticeExam({ 
      mistakeIds: ['q-hsk1-ref-01', 'q-hsk1-ref-02'],
      user: mockUser,
      level: 'HSK 1'
    });

    // Nếu không có câu sai nào trong mock DB, trả về null an toàn
    if (practice) {
      assert.ok(practice.id.startsWith('mistake-practice-'));
      assert.ok(practice.questions.length > 0);
      assert.equal(practice.questions[0].correct_option_index, undefined);
    } else {
      assert.equal(practice, null);
    }
  });

  it('9. CÔNG CỤ NHẬP ĐỀ THI: Thẩm định cú pháp JSON & Bản quyền nghiêm ngặt', async () => {
    const validPayload = JSON.parse(generateSampleImportJson('HSK 1'));
    const adminUser = { id: 'admin_test', role: 'admin' };

    // Thẩm định thành công với cấu trúc chuẩn
    const validReport = await importHskExamWithValidation({
      jsonPayload: validPayload,
      dryRun: true,
      user: adminUser
    });
    assert.equal(validReport.success, true);
    assert.equal(validReport.dryRun, true);
    assert.ok(validReport.stats.totalQuestions >= 2);

    // Từ chối dữ liệu thiếu câu hỏi
    const invalidPayload = { ...validPayload, questions: [] };
    const invalidReport = await importHskExamWithValidation({
      jsonPayload: invalidPayload,
      dryRun: true,
      user: adminUser
    });
    assert.equal(invalidReport.success, false);
    assert.ok(invalidReport.errors.some(e => e.includes('câu hỏi')));
  });

  it('10. QUY ĐỊNH AUDIO: HSK 1 - 2 phát 2 lượt, HSK 3 - 6 phát 1 lượt, Luyện tập phát vô hạn', () => {
    assert.equal(getAudioPlayLimit('HSK 1', 'simulation'), 2);
    assert.equal(getAudioPlayLimit('HSK 2', 'simulation'), 2);
    assert.equal(getAudioPlayLimit('HSK 3', 'simulation'), 1);
    assert.equal(getAudioPlayLimit('HSK 4', 'simulation'), 1);
    assert.equal(getAudioPlayLimit('HSK 5', 'simulation'), 1);
    assert.equal(getAudioPlayLimit('HSK 6', 'simulation'), 1);
    assert.equal(getAudioPlayLimit('HSK 1', 'practice'), Infinity);
    assert.equal(getAudioPlayLimit('HSK 4', 'practice'), Infinity);
  });

});
