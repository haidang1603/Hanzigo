/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: AI FEEDBACK SERVICE
 * =========================================================================
 * Bộ máy giải thích lỗi sư phạm chuyên sâu:
 * 1. Pronunciation Mistake (Lỗi phát âm: thanh điệu, vận mẫu, âm uốn lưỡi, nhịp điệu)
 * 2. Grammar Mistake (Lỗi ngữ pháp: trật tự từ, vị trí phó từ, câu chữ 把/比/是)
 * 3. Translation Mistake (Lỗi dịch thuật: thiếu thành phần, dùng sai hư từ)
 * 4. Vocabulary Mistake (Lỗi từ vựng: nhầm lẫn từ đồng nghĩa, sai bộ thủ)
 * 
 * NGUYÊN TẮC BẢO MẬT:
 * TUYỆT ĐỐI KHÔNG TỰ ĐỘNG GHI HOẶC ĐỘT BIẾN DỮ LIỆU DATABASE NẾU CHƯA VALIDATE.
 * Mọi kết quả phản hồi chỉ mang tính chất phân tích sư phạm (Read-only analysis).
 */

export const MISTAKE_TYPES = {
  PRONUNCIATION: 'pronunciation',
  GRAMMAR: 'grammar',
  TRANSLATION: 'translation',
  VOCABULARY: 'vocabulary'
};

/**
 * Tạo giải thích lỗi sư phạm chi tiết
 * 
 * @param {Object} params
 * @param {string} params.mistakeType - Loại lỗi ('pronunciation' | 'grammar' | 'translation' | 'vocabulary')
 * @param {string} params.targetContent - Nội dung chuẩn mục tiêu
 * @param {string} params.userAttempt - Nội dung người dùng nhập hoặc phát âm
 * @param {Object} params.context - Ngữ cảnh bài tập
 * @param {boolean} params.isUserValidated - Xác thực của người dùng trước khi ghi
 * @returns {Object} Giải thích lỗi chi tiết và trạng thái validate an toàn
 */
export function explainLearningMistake({
  mistakeType,
  targetContent = '',
  userAttempt = '',
  context = {},
  isUserValidated = false
}) {
  if (!mistakeType || !Object.values(MISTAKE_TYPES).includes(mistakeType)) {
    throw new Error(`Loại lỗi không hợp lệ: "${mistakeType}".`);
  }

  const cleanTarget = String(targetContent).trim();
  const cleanAttempt = String(userAttempt).trim();

  let explanation = '';
  let pedagogicalRule = '';
  let suggestedAction = '';

  switch (mistakeType) {
    case MISTAKE_TYPES.PRONUNCIATION: {
      explanation = `Phát âm nhận diện được là "${cleanAttempt || '(chưa rõ âm)'}", khác với âm chuẩn "${cleanTarget}".`;
      pedagogicalRule = 'Trong tiếng Trung, thanh điệu quyết định ý nghĩa của từ. Khi phát âm thanh 4 cần dứt khoát từ cao xuống thấp; thanh 3 cần hạ thấp giọng trước khi nâng nhẹ.';
      suggestedAction = 'Hãy nghe lại âm thanh mẫu của người bản ngữ, mở tròn khẩu hình và đọc chậm từng âm tiết.';
      break;
    }

    case MISTAKE_TYPES.GRAMMAR: {
      explanation = `Trật tự câu hoặc thành phần ngữ pháp "${cleanAttempt}" chưa khớp với cấu trúc chuẩn "${cleanTarget}".`;
      pedagogicalRule = context.patternRule || 'Trật tự câu cơ bản tiếng Trung tuân theo quy tắc: Chủ ngữ + Trạng ngữ (thời gian/địa điểm) + Động từ + Tân ngữ. Phó từ phủ định (不, 没) đứng trước động từ.';
      suggestedAction = 'Ôn lại mẫu câu và thực hành sắp xếp các thẻ từ theo đúng công thức ngữ pháp.';
      break;
    }

    case MISTAKE_TYPES.TRANSLATION: {
      explanation = `Bản dịch "${cleanAttempt}" chưa chuyển tải trọn vẹn ngữ nghĩa của câu "${cleanTarget}".`;
      pedagogicalRule = 'Dịch thuật tiếng Trung cần chú ý tương đương về ngữ dụng, tránh dịch từng từ rời rạc (word-by-word) làm sai trật tự định ngữ - trung tâm ngữ.';
      suggestedAction = 'Xác định rõ trung tâm ngữ của cụm danh từ trước khi đặt định ngữ và trợ từ 的.';
      break;
    }

    case MISTAKE_TYPES.VOCABULARY: {
      explanation = `Từ vựng được chọn "${cleanAttempt}" không tương ứng với nghĩa mục tiêu "${cleanTarget}".`;
      pedagogicalRule = 'Chú ý phân biệt các từ đồng nghĩa và từ gần âm trong tiếng Hán, ghi nhớ theo bộ thủ và chiết tự.';
      suggestedAction = 'Xem lại mẹo nhớ (Mnemonic) và các ví dụ câu thực tế của từ này trong flashcard.';
      break;
    }
  }

  // Cổng bảo vệ: Không cho phép tự động ghi database nếu chưa validate
  const databaseWritePermitted = isUserValidated === true && cleanAttempt.length > 0;

  return {
    mistakeType,
    targetContent: cleanTarget,
    userAttempt: cleanAttempt,
    analysis: {
      explanation,
      pedagogicalRule,
      suggestedAction
    },
    // Validation Gate
    validationGate: {
      isValidated: isUserValidated,
      databaseWritePermitted,
      safetyNotice: databaseWritePermitted
        ? 'Dữ liệu đã được người dùng xác thực hợp lệ để cập nhật tiến độ học tập.'
        : 'Chế độ Read-only: Kết quả phân tích không tự động ghi đè dữ liệu cơ sở dữ liệu nếu chưa được xác thực.'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Bộ kiểm tra xác thực an toàn đầu vào của bài tập trước khi lưu
 */
export function validateExerciseSubmission(submission) {
  if (!submission) return { isValid: false, reason: 'Dữ liệu bài tập rỗng.' };

  const input = typeof submission === 'string' ? submission : submission.userInput || submission.text || '';
  const clean = String(input).trim();

  if (!clean) {
    return { isValid: false, reason: 'Vui lòng nhập câu trả lời trước khi nộp.' };
  }

  if (clean.length > 500) {
    return { isValid: false, reason: 'Nội dung trả lời vượt quá độ dài tối đa cho phép.' };
  }

  // Kiểm tra chống mã độc xss / injection cơ bản
  if (/<[a-z][\s\S]*>/i.test(clean)) {
    return { isValid: false, reason: 'Nội dung chứa ký tự không hợp lệ.' };
  }

  return { isValid: true, sanitizedInput: clean };
}
