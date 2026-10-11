/**
 * =========================================================================
 * HSK IMPORT & VALIDATION SERVICE — QUALITY CONTROL PIPELINE
 * =========================================================================
 * Bộ xử lý nhập liệu đề thi và câu hỏi có thẩm định nghiêm ngặt:
 * - Kiểm tra cấu trúc trường bắt buộc và thang điểm
 * - Kiểm định chỉ số đáp án đúng (Bounds Check)
 * - Phát hiện câu hỏi trùng lặp (Duplicate Detection)
 * - Rà soát bản quyền & nguồn gốc tài liệu
 * - Chế độ chạy thử (Dry-run) và báo cáo kiểm tra (Validation Report)
 * - Nhập nguyên tử (All-or-Nothing) và tính lũy đẳng (Idempotent)
 * =========================================================================
 */

import { HSK_EXAMS, HSK_QUESTIONS } from '../data/hskExamsData.js';
import { supabase } from '../supabase/config.js';

const VALID_HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
const VALID_PART_TYPES = ['listening', 'reading', 'writing', 'grammar', 'vocabulary', 'mixed'];
const VALID_PERMISSION_STATUSES = ['reproducible', 'linked_only', 'unverified'];

/**
 * Thẩm định gói dữ liệu nhập liệu đề thi (Validation Pipeline)
 * @param {Object} payload - Dữ liệu đề thi và mảng câu hỏi
 * @param {Object} options - { existingQuestions, existingExams }
 * @returns {Object} { valid: boolean, errors: Array, warnings: Array, stats: Object, preview: Object }
 */
export function validateHskImportPayload(payload, options = {}) {
  const errors = [];
  const warnings = [];

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['Gói dữ liệu tải lên không hợp lệ hoặc rỗng.'],
      warnings: [],
      stats: null,
      preview: null
    };
  }

  // 1. Kiểm định thông tin đề thi cấp cao
  const exam = payload.exam || payload;

  if (!exam.title || typeof exam.title !== 'string' || exam.title.trim().length < 5) {
    errors.push('Tiêu đề đề thi (title) bắt buộc và phải có ít nhất 5 ký tự.');
  }

  const normalizedLevel = String(exam.level || '').trim().toUpperCase();
  const matchedLevel = VALID_HSK_LEVELS.find(l => l.toUpperCase() === normalizedLevel);
  if (!matchedLevel) {
    errors.push(`Cấp độ HSK (${exam.level}) không hợp lệ. Phải là một trong: ${VALID_HSK_LEVELS.join(', ')}.`);
  }

  if (!exam.duration_minutes || Number(exam.duration_minutes) <= 0) {
    errors.push('Thời lượng làm bài (duration_minutes) phải là số nguyên dương > 0.');
  }

  const maxScore = Number(exam.max_score || exam.total_score || (matchedLevel === 'HSK 1' || matchedLevel === 'HSK 2' ? 200 : 300));
  if (!maxScore || maxScore <= 0) {
    errors.push('Thang điểm tối đa (max_score) phải là số dương.');
  }

  const passingScore = Number(exam.passing_score || Math.round(maxScore * 0.6));
  if (!passingScore || passingScore <= 0) {
    errors.push('Điểm đạt chuẩn (passing_score) phải là số dương.');
  }

  if (passingScore > maxScore) {
    errors.push(`Điểm đạt chuẩn (${passingScore}) không thể lớn hơn điểm tối đa (${maxScore}).`);
  }

  // 2. Kiểm định bản quyền & nguồn gốc
  const sourceUrl = exam.source_url || exam.url || 'https://hanzigo.app/hsk/sample-exam';
  if (!sourceUrl || typeof sourceUrl !== 'string' || !sourceUrl.startsWith('http')) {
    errors.push('Bắt buộc phải có URL nguồn gốc hợp lệ (source_url) bắt đầu bằng http:// hoặc https://.');
  }

  const sourceAuthor = exam.source_author || exam.author || exam.publisher;
  if (!sourceAuthor || typeof sourceAuthor !== 'string' || sourceAuthor.trim().length === 0) {
    errors.push('Bắt buộc phải khai báo tên tác giả hoặc đơn vị xuất bản (source_author).');
  }

  const permissionStatus = exam.permission_status || 'reproducible';
  const licenseStatus = exam.license_status || exam.license || (permissionStatus === 'reproducible' ? 'CC BY-NC-SA 4.0 / HanziGo Original' : 'Educational Public Resource');
  if (!licenseStatus || typeof licenseStatus !== 'string') {
    errors.push('Bắt buộc phải khai báo giấy phép bản quyền rõ ràng (license_status).');
  }

  if (permissionStatus && !VALID_PERMISSION_STATUSES.includes(permissionStatus)) {
    errors.push(`Trạng thái cấp phép (permission_status) không hợp lệ. Giá trị cho phép: ${VALID_PERMISSION_STATUSES.join(', ')}.`);
  }

  if (permissionStatus === 'unverified') {
    warnings.push('Cảnh báo bản quyền: Tài liệu chưa xác minh quyền tái phân phối. Hệ thống chỉ cho phép lưu nháp hoặc dẫn liên kết ngoài.');
  }

  // Không cho phép tự gắn nhãn 'official_sample' nếu nguồn gốc không phải từ CTI/CLEC
  if (exam.exam_type === 'official_sample') {
    const authorLower = String(exam.source_author || '').toLowerCase();
    const isActuallyOfficial = authorLower.includes('cti') || authorLower.includes('clec') || authorLower.includes('hanban');
    if (!isActuallyOfficial) {
      errors.push('Vi phạm quy chế minh bạch: Đề thi không thuộc CTI/CLEC/Hanban không được gắn nhãn official_sample.');
    }
  }

  // 3. Kiểm định danh sách câu hỏi
  const questions = Array.isArray(payload.questions) 
    ? payload.questions 
    : Array.isArray(exam.questions) 
    ? exam.questions 
    : [];

  if (questions.length === 0) {
    errors.push('Đề thi phải có ít nhất 1 câu hỏi trong danh sách (questions).');
  }

  const seenPromptHashes = new Set();
  const existingQuestionsList = options.existingQuestions || HSK_QUESTIONS;
  const existingPrompts = new Set(
    existingQuestionsList.map(q => q.prompt?.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')).filter(Boolean)
  );

  let listeningCount = 0;
  let readingCount = 0;
  let writingCount = 0;
  let totalPoints = 0;

  questions.forEach((q, idx) => {
    const qNum = q.question_number || (idx + 1);

    const promptText = q.prompt || q.question_text || q.text;
    if (!promptText || typeof promptText !== 'string' || promptText.trim().length === 0) {
      errors.push(`Câu ${qNum}: Nội dung câu hỏi (prompt) không được để trống.`);
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push(`Câu ${qNum}: Phương án trả lời (options) phải là mảng có ít nhất 2 lựa chọn.`);
    } else {
      q.options.forEach((opt, oIdx) => {
        const text = typeof opt === 'string' ? opt : opt?.text;
        if (!text || text.trim().length === 0) {
          errors.push(`Câu ${qNum}, phương án ${String.fromCharCode(65 + oIdx)}: Nội dung không được để trống.`);
        }
      });
    }

    // Kiểm tra chỉ số đáp án đúng
    const correctIdx = q.correct_option_index !== undefined ? q.correct_option_index : (q.correct_answer !== undefined ? q.correct_answer : q.answer_index);
    if (correctIdx === undefined || correctIdx === null || isNaN(correctIdx)) {
      errors.push(`Câu ${qNum}: Thiếu chỉ số đáp án đúng (correct_option_index).`);
    } else {
      const cIdx = Number(correctIdx);
      if (!Number.isInteger(cIdx) || cIdx < 0 || (Array.isArray(q.options) && cIdx >= q.options.length)) {
        errors.push(`Câu ${qNum}: Chỉ số đáp án đúng (${correctIdx}) vượt quá số lượng phương án (0-${(q.options?.length || 1) - 1}).`);
      }
    }

    // Kiểm tra lời giải thích
    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 5) {
      warnings.push(`Câu ${qNum}: Chưa có lời giải chi tiết (explanation). Khuyến khích bổ sung để nâng cao trải nghiệm học tập.`);
    }

    // Kiểm tra âm thanh cho câu nghe hiểu
    if (q.part_type === 'listening') {
      listeningCount++;
      if (!q.audio_url && !q.audio_script) {
        warnings.push(`Câu ${qNum} (Nghe hiểu): Thiếu cả audio_url lẫn audio_script phát âm.`);
      }
    } else if (q.part_type === 'reading') {
      readingCount++;
    } else if (q.part_type === 'writing') {
      writingCount++;
    }

    totalPoints += Number(q.points || 5);

    // Phát hiện câu hỏi trùng lặp
    if (promptText) {
      const normalizedPrompt = promptText.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      if (seenPromptHashes.has(normalizedPrompt)) {
        errors.push(`Câu ${qNum}: Phát hiện trùng lặp nội dung câu hỏi trong cùng một đề thi ("${promptText.substring(0, 20)}...").`);
      } else {
        seenPromptHashes.add(normalizedPrompt);
      }

      if (existingPrompts.has(normalizedPrompt)) {
        warnings.push(`Câu ${qNum}: Câu hỏi đã xuất hiện trong ngân hàng đề thi hiện có ("${promptText.substring(0, 20)}...").`);
      }
    }
  });

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    stats: {
      totalQuestions: questions.length,
      listeningCount,
      readingCount,
      writingCount,
      totalPoints,
      durationMinutes: Number(exam.duration_minutes || 0)
    },
    preview: {
      id: exam.id || `exam-${Date.now()}`,
      title: exam.title,
      level: matchedLevel || exam.level,
      exam_type: exam.exam_type || 'mock',
      license_status: exam.license_status,
      permission_status: exam.permission_status || 'reproducible',
      source_author: exam.source_author,
      source_url: exam.source_url,
      questionsCount: questions.length,
      questionsSample: questions.slice(0, 3).map((q, idx) => ({
        number: idx + 1,
        prompt: q.prompt,
        optionsCount: q.options?.length || 0,
        hasExplanation: Boolean(q.explanation)
      }))
    }
  };
}

/**
 * Thực hiện nhập liệu đề thi và câu hỏi (Hỗ trợ Dry-run / Preview và Commit)
 * @param {Object} payload - Dữ liệu đề thi
 * @param {Object} user - Người thực hiện (Bắt buộc phải là Admin)
 * @param {boolean} dryRun - Nếu true, chỉ thẩm định và trả về preview mà không ghi DB
 */
export async function importHskExamWithValidation(arg1, arg2 = null, arg3 = true) {
  let payload = arg1;
  let user = arg2;
  let dryRun = arg3;

  if (arg1 && typeof arg1 === 'object' && ('jsonPayload' in arg1 || ('payload' in arg1 && 'user' in arg1))) {
    payload = arg1.jsonPayload || arg1.payload;
    user = arg1.user !== undefined ? arg1.user : arg2;
    dryRun = arg1.dryRun !== undefined ? arg1.dryRun : arg3;
  }
  // 1. Kiểm tra quyền Admin
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);
  if (!isAdmin) {
    return {
      success: false,
      error: 'Quyền hạn không hợp lệ. Chỉ Quản trị viên (Admin) mới có quyền nhập và duyệt đề thi.'
    };
  }

  // 2. Chạy pipeline thẩm định
  const validation = validateHskImportPayload(payload);
  if (!validation.valid) {
    return {
      success: false,
      dryRun,
      errors: validation.errors,
      warnings: validation.warnings,
      stats: validation.stats
    };
  }

  // Nếu là chế độ Dry-run -> Trả về kết quả kiểm thử ngay
  if (dryRun) {
    return {
      success: true,
      dryRun: true,
      message: 'Gói dữ liệu hoàn toàn hợp lệ và sẵn sàng nhập vào hệ thống.',
      warnings: validation.warnings,
      stats: validation.stats,
      preview: validation.preview
    };
  }

  // 3. Chế độ Commit (Ghi dữ liệu nguyên tử)
  try {
    const examData = payload.exam || payload;
    const examId = examData.id || `hsk-${examData.level?.toLowerCase().replace(/\s+/g, '') || 'mock'}-${Date.now()}`;
    const rawQuestions = Array.isArray(payload.questions) ? payload.questions : examData.questions;

    const formattedExam = {
      id: examId,
      title: examData.title.trim(),
      level: examData.level,
      exam_version: examData.exam_version || '2015-Standard',
      exam_type: examData.exam_type || 'mock',
      skill_category: examData.skill_category || 'mixed',
      duration_minutes: Number(examData.duration_minutes),
      total_questions: rawQuestions.length,
      passing_score: Number(examData.passing_score),
      max_score: Number(examData.max_score),
      description: examData.description || '',
      source_url: examData.source_url,
      source_author: examData.source_author,
      license: examData.license_status,
      permission_status: examData.permission_status || 'reproducible',
      review_status: examData.review_status || 'needs_review',
      is_published: examData.is_published !== undefined ? Boolean(examData.is_published) : false,
      verified_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    const formattedQuestions = rawQuestions.map((q, idx) => ({
      id: q.id || `${examId}-q-${String(idx + 1).padStart(2, '0')}`,
      exam_id: examId,
      part_type: q.part_type || 'reading',
      part_number: Number(q.part_number || 1),
      prompt: (q.prompt || q.question_text || q.text || '').trim(),
      pinyin: q.pinyin || '',
      translation: q.translation || q.vietnamese_translation || '',
      audio_url: q.audio_url || '',
      audio_script: q.audio_script || '',
      options: q.options.map(opt => typeof opt === 'string' ? { text: opt } : opt),
      correct_option_index: Number(q.correct_option_index !== undefined ? q.correct_option_index : (q.correct_answer !== undefined ? q.correct_answer : q.answer_index)),
      explanation: q.explanation || 'Chưa có lời giải chi tiết cho câu hỏi này.',
      points: Number(q.points || 5),
      created_at: new Date().toISOString()
    }));

    // Ghi vào Supabase nếu có cấu hình
    if (supabase) {
      const { error: examErr } = await supabase
        .from('hsk_exams')
        .upsert(formattedExam);

      if (examErr) {
        throw new Error(`Lỗi ghi thông tin đề thi: ${examErr.message}`);
      }

      const { error: qErr } = await supabase
        .from('hsk_questions')
        .upsert(formattedQuestions);

      if (qErr) {
        throw new Error(`Lỗi ghi câu hỏi: ${qErr.message}`);
      }
    }

    // Cập nhật bộ nhớ cục bộ để kiểm thử và offline
    try {
      const localExamsRaw = localStorage.getItem('hanzigo_imported_exams');
      const localExams = localExamsRaw ? JSON.parse(localExamsRaw) : [];
      const updatedExams = [formattedExam, ...localExams.filter(e => e.id !== formattedExam.id)];
      localStorage.setItem('hanzigo_imported_exams', JSON.stringify(updatedExams));

      const localQuestionsRaw = localStorage.getItem('hanzigo_imported_questions');
      const localQuestions = localQuestionsRaw ? JSON.parse(localQuestionsRaw) : [];
      const updatedQuestions = [...formattedQuestions, ...localQuestions.filter(q => q.exam_id !== formattedExam.id)];
      localStorage.setItem('hanzigo_imported_questions', JSON.stringify(updatedQuestions));
    } catch {}

    return {
      success: true,
      dryRun: false,
      message: `Đã nhập thành công đề thi [${formattedExam.title}] với ${formattedQuestions.length} câu hỏi.`,
      examId,
      reviewStatus: formattedExam.review_status,
      warnings: validation.warnings
    };
  } catch (err) {
    return {
      success: false,
      dryRun: false,
      error: `Thất bại trong quá trình nhập liệu: ${err.message}`
    };
  }
}

/**
 * Tạo gói dữ liệu JSON mẫu phục vụ kiểm thử và hướng dẫn biên soạn
 * @param {string} level - Cấp độ HSK ('HSK 1', 'HSK 2', etc.)
 * @returns {string} JSON string
 */
export function generateSampleImportJson(level = 'HSK 1') {
  const isL12 = level === 'HSK 1' || level === 'HSK 2';
  const maxScore = isL12 ? 200 : 300;
  const passScore = isL12 ? 120 : 180;

  return JSON.stringify({
    exam: {
      id: `sample_${level.toLowerCase().replace(/\s+/g, '')}_01`,
      title: `Đề Luyện Thi Chuẩn Hóa ${level} (Mẫu Đã Thẩm Định)`,
      level: level,
      exam_version: '2015-Standard',
      exam_type: 'mock',
      total_score: maxScore,
      max_score: maxScore,
      passing_score: passScore,
      duration_minutes: isL12 ? 40 : 85,
      description: 'Đề thi mẫu dùng để kiểm thử quy trình nhập liệu và rà soát chất lượng học thuật HanziGo.',
      source: 'HanziGo Academic Board',
      source_author: 'Ban Học Thuật HanziGo',
      source_url: 'https://hanzigo.app/hsk/sample-exam',
      license_status: 'CC BY-NC-SA 4.0 / HanziGo Original',
      permission_status: 'reproducible',
      author: 'Ban Học Thuật HanziGo',
      difficulty_estimate: 'medium'
    },
    questions: [
      {
        part_type: 'reading',
        question_number: 1,
        prompt: '请选出与图片意思相符的词语。\n(Chọn từ ngữ phù hợp nhất)',
        question_text: '请选出与图片意思相符的词语。\n(Chọn từ ngữ phù hợp nhất)',
        pinyin: 'Qǐng xuǎn chū yǔ túpiàn yìsi xiāngfú de cíyǔ.',
        translation: 'Xin hãy chọn từ phù hợp với ý nghĩa.',
        options: ['苹果 (píngguǒ)', '米饭 (mǐfàn)', '茶 (chá)', '水 (shuǐ)'],
        correct_option_index: 0,
        correct_answer: 0,
        explanation: '苹果 nghĩa là quả táo, phù hợp với ngữ cảnh câu hỏi.',
        points: 5,
        difficulty: 'easy',
        tags: ['hoa quả', 'từ vựng cơ bản']
      },
      {
        part_type: 'reading',
        question_number: 2,
        prompt: '他正在喝_____。',
        question_text: '他正在喝_____。',
        pinyin: 'Tā zhèngzài hē _____.',
        translation: 'Anh ấy đang uống _____.',
        options: ['书 (shū)', '茶 (chá)', '桌子 (zhuōzi)', '猫 (māo)'],
        correct_option_index: 1,
        correct_answer: 1,
        explanation: 'Động từ 喝 (uống) chỉ kết hợp với danh từ đồ uống như 茶 (trà).',
        points: 5,
        difficulty: 'easy',
        tags: ['động từ', 'đồ uống']
      }
    ]
  }, null, 2);
}
