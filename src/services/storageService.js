/**
 * =========================================================================
 * HANZI GO - SUPABASE STORAGE SERVICE FOR LEARNING MATERIALS
 * =========================================================================
 * Cung cấp giải pháp tải lên, tạo signed URL, xóa và thay thế file
 * trực tiếp trên Supabase Storage bucket 'materials' (private),
 * với cơ chế validation định dạng (MIME & extension), kích thước (<= 50MB),
 * cấu trúc đường dẫn phân tách và fallback an toan khi offline / simulation.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export const STORAGE_BUCKET_MATERIALS = 'materials';
export const MAX_FILE_SIZE_BYTES = 52428800; // 50MB (50 * 1024 * 1024)
export const DEFAULT_SIGNED_URL_EXPIRES = 3600; // 1 giờ (giây)

// Danh mục định dạng cho phép theo chuẩn giáo dục
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'video/mp4'
];

export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc', 'docx',
  'ppt', 'pptx',
  'xls', 'xlsx',
  'txt',
  'png', 'jpg', 'jpeg', 'webp',
  'mp3', 'wav',
  'mp4'
];

// Ánh xạ extension sang loại tài liệu (fileType)
export const EXT_TO_FILE_TYPE = {
  pdf: 'pdf',
  doc: 'doc',
  docx: 'doc',
  ppt: 'ppt',
  pptx: 'ppt',
  xls: 'xls',
  xlsx: 'xls',
  txt: 'doc',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  mp3: 'audio',
  wav: 'audio',
  mp4: 'video'
};

/**
 * Làm sạch tên file và chống path traversal
 * Loại bỏ ký tự đặc biệt, ../, dấu cách, dấu ngoặc
 */
export function sanitizeFilename(filename = 'document') {
  if (typeof filename !== 'string') return 'document';
  // Lấy basename (loại bỏ path separators Unix & Windows)
  const basename = filename.split(/[/\\]/).pop() || 'document';
  // Tách extension
  const lastDot = basename.lastIndexOf('.');
  let namePart = lastDot > 0 ? basename.substring(0, lastDot) : basename;
  const extPart = lastDot > 0 ? basename.substring(lastDot + 1).toLowerCase() : '';

  // Giữ lại ký tự an toàn: a-z, 0-9, -, _
  namePart = namePart
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt nếu có
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 80); // giới hạn độ dài tên

  if (!namePart) namePart = 'file';
  return extPart ? `${namePart}.${extPart}` : namePart;
}

/**
 * Kiểm tra tính hợp lệ của file (MIME type và dung lượng)
 */
export function validateMaterialFile(file) {
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn một tệp từ thiết bị.' };
  }

  // 1. Kiểm tra dung lượng
  if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Tệp vượt quá giới hạn 50MB cho phép (kích thước thực tế: ${sizeMb}MB).`
    };
  }

  // 2. Kiểm tra phần mở rộng
  const filename = file.name || '';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Định dạng tệp ".${ext}" không được hỗ trợ. Chỉ chấp nhận PDF, Word, PowerPoint, Excel, Hình ảnh, Audio và Video.`
    };
  }

  // 3. Kiểm tra MIME type nếu trình duyệt cung cấp
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    // Một số OS có thể gán MIME lạ cho docx/pptx hoặc text/plain, kiểm tra nếu extension hợp lệ thì nới lỏng cảnh báo
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `MIME type "${file.type}" không hợp lệ cho hoạt động học tập.`
      };
    }
  }

  return { valid: true, extension: ext, detectedType: EXT_TO_FILE_TYPE[ext] || 'pdf' };
}

/**
 * Tạo storage path chuẩn hóa cho tài liệu:
 * classroom/{classroom_id}/{material_id}/{safe_filename}
 */
export function buildClassroomStoragePath(classroomId, materialId, originalFilename) {
  const safeClassId = String(classroomId || 'general').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeMatId = String(materialId || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = sanitizeFilename(originalFilename);
  return `classroom/${safeClassId}/${safeMatId}/${safeName}`;
}

/**
 * Tạo storage path chuẩn hóa cho tài liệu cá nhân / thư viện chung:
 * general/{owner_id}/{material_id}/{safe_filename}
 */
export function buildGeneralStoragePath(ownerId, materialId, originalFilename) {
  const safeOwnerId = String(ownerId || 'public').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeMatId = String(materialId || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = sanitizeFilename(originalFilename);
  return `general/${safeOwnerId}/${safeMatId}/${safeName}`;
}

/**
 * Tải file trực tiếp lên Supabase Storage bucket 'materials'
 * Hỗ trợ progress reporting và abort signal nếu cần.
 *
 * @param {object} params
 * @param {File|Blob} params.file - Đối tượng File từ input file
 * @param {string} params.path - Đường dẫn tương đối trong bucket
 * @param {boolean} [params.upsert=true] - Cho phép ghi đè nếu thay thế tệp
 * @param {function} [params.onProgress] - Callback tiến trình: (percentage) => void
 * @returns {Promise<{success: boolean, path?: string, error?: string, size?: number, mimeType?: string}>}
 */
export async function uploadMaterialToStorage({
  file,
  path,
  upsert = true,
  onProgress = null
}) {
  const validation = validateMaterialFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (!path || typeof path !== 'string' || path.includes('..')) {
    return { success: false, error: 'Đường dẫn tệp không hợp lệ hoặc chứa ký tự bị cấm.' };
  }

  // 1. Chế độ Offline / Simulation fallback
  if (!isSupabaseConfigured || !supabase) {
    if (typeof onProgress === 'function') {
      onProgress(30);
      await new Promise(r => setTimeout(r, 100));
      onProgress(70);
      await new Promise(r => setTimeout(r, 100));
      onProgress(100);
    }
    // Tạo data url mô phỏng cho client preview khi offline
    return {
      success: true,
      isSimulated: true,
      bucket: STORAGE_BUCKET_MATERIALS,
      path,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream'
    };
  }

  try {
    if (typeof onProgress === 'function') onProgress(15);

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_MATERIALS)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: Boolean(upsert),
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      throw error;
    }

    if (typeof onProgress === 'function') onProgress(100);

    return {
      success: true,
      bucket: STORAGE_BUCKET_MATERIALS,
      path: data?.path || path,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream'
    };
  } catch (err) {
    console.error('[Storage Service] Upload error:', err);
    return {
      success: false,
      error: err.message || 'Lỗi khi tải tệp lên máy chủ lưu trữ.'
    };
  }
}

/**
 * Tạo Signed URL có thời hạn cho private bucket 'materials'
 * Tránh lưu Signed URL hết hạn lâu dài vào database.
 *
 * @param {string} storagePath - Đường dẫn tương đối trong bucket
 * @param {number} [expiresIn=3600] - Thời gian sống tính theo giây (mặc định 1 giờ)
 * @returns {Promise<{success: boolean, signedUrl?: string, error?: string}>}
 */
export async function getMaterialSignedUrl(storagePath, expiresIn = DEFAULT_SIGNED_URL_EXPIRES) {
  if (!storagePath || typeof storagePath !== 'string') {
    return { success: false, error: 'Đường dẫn tệp không tồn tại.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      signedUrl: '#simulated-offline-file',
      isSimulated: true
    };
  }

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET_MATERIALS)
      .createSignedUrl(storagePath, expiresIn);

    if (error) throw error;
    if (!data?.signedUrl) throw new Error('Không tạo được liên kết tải có thẩm quyền.');

    return {
      success: true,
      signedUrl: data.signedUrl
    };
  } catch (err) {
    console.warn('[Storage Service] Create signed url warning:', err);
    return {
      success: false,
      error: err.message || 'Không thể tạo liên kết tải tài liệu.'
    };
  }
}

/**
 * Xóa một hoặc nhiều file khỏi Supabase Storage bucket 'materials'
 *
 * @param {string|string[]} paths - Danh sách storage path cần xóa
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteMaterialFromStorage(paths) {
  const pathList = Array.isArray(paths) ? paths : [paths];
  const validPaths = pathList.filter(p => typeof p === 'string' && p.trim().length > 0);

  if (validPaths.length === 0) {
    return { success: true };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { success: true, isSimulated: true };
  }

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET_MATERIALS)
      .remove(validPaths);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Storage Service] Delete storage file error:', err);
    return {
      success: false,
      error: err.message || 'Lỗi khi xóa tệp khỏi hệ thống lưu trữ.'
    };
  }
}

/**
 * Helper format dung lượng byte sang chuỗi hiển thị thân thiện (KB, MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

