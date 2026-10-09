/**
 * =========================================================================
 * HANZI GO - PRODUCTION ERROR SANITIZER
 * =========================================================================
 * Đảm bảo hệ thống KHÔNG BAO GIỜ để lộ:
 * - SQL errors / PostgreSQL internals (PGRST, constraint, column names)
 * - API keys (Gemini, Supabase service keys)
 * - Internal stack traces
 * - Tên bảng hoặc cấu trúc cơ sở dữ liệu nhạy cảm
 * 
 * Người dùng cuối chỉ nhận thông báo phù hợp, lịch sự và dễ hiểu.
 */

// Các từ khóa kỹ thuật cần phát hiện và che giấu
const TECHNICAL_PATTERNS = [
  /PGRST\d+/i,
  /relation\s+["']?\w+["']?\s+does\s+not\s+exist/i,
  /column\s+["']?\w+["']?\s+does\s+not\s+exist/i,
  /violates\s+(foreign\s+key|not-null|unique|check)\s+constraint/i,
  /syntax\s+error\s+at\s+or\s+near/i,
  /supabase/i,
  /postgres/i,
  /key\s+[A-Za-z0-9_-]{20,}/i,
  /eyJ[A-Za-z0-9_-]{20,}/i // JWT tokens
];

/**
 * Làm sạch và chuyển đổi lỗi kỹ thuật thành thông báo an toàn cho người dùng
 * @param {Error|Object|string} error 
 * @param {string} fallbackMessage 
 * @returns {string} Thông báo thân thiện, an toàn
 */
export function sanitizeUserErrorMessage(error, fallbackMessage = 'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.') {
  if (!error) return fallbackMessage;

  const rawMsg = typeof error === 'string' 
    ? error 
    : (error.message || error.error_description || error.error || String(error));

  // Ghi log kỹ thuật nội bộ an toàn (chỉ trên console dev / server logs)
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[Sanitizer Diagnostic Log]:', rawMsg);
  }

  // 1. Kiểm tra nếu có API key hoặc JWT lộ trong thông báo
  if (/key\s+[A-Za-z0-9_-]{15,}|AIza[0-9A-Za-z-_]{35}/.test(rawMsg)) {
    return 'Lỗi cấu hình dịch vụ bảo mật. Vui lòng liên hệ quản trị viên.';
  }

  // 2. Lỗi quyền truy cập RLS
  if (/row-level\s+security|permission\s+denied|not\s+authorized|unauthorized/i.test(rawMsg)) {
    return 'Bạn không có quyền thực hiện thao tác này hoặc phiên đăng nhập đã hết hạn.';
  }

  // 3. Lỗi trùng lặp dữ liệu (Unique constraint)
  if (/unique|already\s+exists|trùng\s+lặp/i.test(rawMsg)) {
    if (/class_code/i.test(rawMsg)) return 'Mã lớp học đã tồn tại. Vui lòng thử lại với mã khác.';
    if (/uq_class_member/i.test(rawMsg) || /học viên.*đã tham gia/i.test(rawMsg)) {
      return 'Học viên đã tham gia lớp học này từ trước.';
    }
    return 'Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.';
  }

  // 4. Lỗi khóa ngoại không tồn tại (Not found)
  if (/foreign\s+key|not\s+found|không\s+tìm\s+thấy/i.test(rawMsg)) {
    return 'Dữ liệu yêu cầu không tồn tại hoặc đã bị xóa.';
  }

  // 5. Kiểm tra nếu chứa lỗi SQL / PostgreSQL kỹ thuật thuần túy
  const hasTechnicalLeak = TECHNICAL_PATTERNS.some(pattern => pattern.test(rawMsg));
  if (hasTechnicalLeak) {
    return fallbackMessage;
  }

  // 6. Nếu thông điệp là tiếng Việt có nghĩa và an toàn, cho phép hiển thị
  const isSafeVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(rawMsg) 
    && rawMsg.length < 150 
    && !rawMsg.includes('{') 
    && !rawMsg.includes(';')
    && !rawMsg.includes('SELECT');

  if (isSafeVietnamese) {
    return rawMsg;
  }

  return fallbackMessage;
}
