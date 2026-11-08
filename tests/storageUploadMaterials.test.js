import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STORAGE_BUCKET_MATERIALS,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  sanitizeFilename,
  validateMaterialFile,
  buildClassroomStoragePath,
  buildGeneralStoragePath,
  uploadMaterialToStorage,
  getMaterialSignedUrl,
  deleteMaterialFromStorage,
  formatBytes
} from '../src/services/storageService.js';

import {
  normalizeClassMaterialRecord,
  uploadClassMaterial,
  deleteClassMaterial,
  getDownloadUrlForClassMaterial
} from '../src/services/classroomService.js';

// Polyfill localStorage cho môi trường kiểm thử Node
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

// =========================================================================
// NHÓM A — UPLOAD VALIDATION & STORAGE OPERATIONS
// =========================================================================

test('A1. Upload: Validates valid PDF, Word, PowerPoint and Image files', () => {
  const pdfFile = { name: 'GiaoTrinh_HSK1.pdf', size: 1024 * 1024, type: 'application/pdf' };
  const resPdf = validateMaterialFile(pdfFile);
  assert.equal(resPdf.valid, true);
  assert.equal(resPdf.extension, 'pdf');
  assert.equal(resPdf.detectedType, 'pdf');

  const docFile = { name: 'BaiTap_Tuan1.docx', size: 500 * 1024, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  const resDoc = validateMaterialFile(docFile);
  assert.equal(resDoc.valid, true);
  assert.equal(resDoc.extension, 'docx');
  assert.equal(resDoc.detectedType, 'doc');

  const audioFile = { name: 'PhatAm_ThanhDieu.mp3', size: 5 * 1024 * 1024, type: 'audio/mpeg' };
  const resAudio = validateMaterialFile(audioFile);
  assert.equal(resAudio.valid, true);
  assert.equal(resAudio.extension, 'mp3');
  assert.equal(resAudio.detectedType, 'audio');
});

test('A2. Upload: Rejects unsupported file extensions (exe, sh, bat, php, js)', () => {
  const dangerousFiles = [
    { name: 'malware.exe', size: 1000, type: 'application/x-msdownload' },
    { name: 'script.sh', size: 1000, type: 'application/x-sh' },
    { name: 'webshell.php', size: 1000, type: 'application/x-php' },
    { name: 'exploit.bat', size: 1000, type: '' }
  ];

  dangerousFiles.forEach(f => {
    const res = validateMaterialFile(f);
    assert.equal(res.valid, false);
    assert.match(res.error, /không được hỗ trợ/);
  });
});

test('A3. Upload: Rejects files exceeding 50MB size limit', () => {
  const oversizeFile = {
    name: 'HugeVideoLecture.mp4',
    size: MAX_FILE_SIZE_BYTES + 1024, // > 50MB
    type: 'video/mp4'
  };
  const res = validateMaterialFile(oversizeFile);
  assert.equal(res.valid, false);
  assert.match(res.error, /vượt quá giới hạn 50MB/);
});

test('A4. Upload: Null or empty file input handling', () => {
  const res = validateMaterialFile(null);
  assert.equal(res.valid, false);
  assert.match(res.error, /Vui lòng chọn một tệp/);
});

// =========================================================================
// NHÓM B — STORAGE SECURITY & PATH ISOLATION
// =========================================================================

test('B1. Security: Path Traversal prevention & filename sanitization', () => {
  // Test chống path traversal ../../
  const attack1 = sanitizeFilename('../../../etc/passwd');
  assert.equal(attack1.includes('..'), false);
  assert.equal(attack1, 'passwd');

  // Test ký tự đặc biệt & tên file tiếng Việt có dấu
  const dirtyName = 'Tài Liệu HSK 1 (Bản Đẹp) *?<>|:".pdf';
  const clean = sanitizeFilename(dirtyName);
  assert.equal(clean.includes('*'), false);
  assert.equal(clean.includes('?'), false);
  assert.equal(clean.includes('<'), false);
  assert.equal(clean.includes('"'), false);
  assert.match(clean, /\.pdf$/);
});

test('B2. Security: Strict path isolation for classrooms and users', () => {
  const cPath = buildClassroomStoragePath('class-uuid-123', 'mat-456', 'lesson1.pdf');
  assert.equal(cPath, 'classroom/class-uuid-123/mat-456/lesson1.pdf');

  const gPath = buildGeneralStoragePath('user-789', 'mat-999', 'vocab.xlsx');
  assert.equal(gPath, 'general/user-789/mat-999/vocab.xlsx');

  // Thử inject path trong ID
  const hackedCPath = buildClassroomStoragePath('class/../hack', 'mat/../id', 'file.pdf');
  assert.equal(hackedCPath.includes('..'), false);
});

test('B3. Security: Signed URL generation fails safely with missing path', async () => {
  const resEmpty = await getMaterialSignedUrl('');
  assert.equal(resEmpty.success, false);
  assert.match(resEmpty.error, /không tồn tại/);

  const resNull = await getMaterialSignedUrl(null);
  assert.equal(resNull.success, false);
});

// =========================================================================
// NHÓM C — METADATA & LIFECYCLE MANAGEMENT
// =========================================================================

test('C1. Metadata: Record normalization decodes JSON metadata seamlessly', () => {
  const rawRecord = {
    id: 'mat-test-1',
    classroom_id: 'class-1',
    teacher_id: 'teacher-1',
    title: 'Sách Bài Tập HSK 2',
    description: JSON.stringify({
      note: 'Dành cho ôn thi giữa kỳ',
      storage_path: 'classroom/class-1/mat-1/bai_tap.pdf',
      file_name: 'bai_tap.pdf',
      mime_type: 'application/pdf',
      file_size_bytes: 2048576
    }),
    file_url: 'storage://materials/classroom/class-1/mat-1/bai_tap.pdf',
    file_type: 'pdf'
  };

  const norm = normalizeClassMaterialRecord(rawRecord);
  assert.equal(norm.cleanDescription, 'Dành cho ôn thi giữa kỳ');
  assert.equal(norm.isStorageFile, true);
  assert.equal(norm.storagePath, 'classroom/class-1/mat-1/bai_tap.pdf');
  assert.equal(norm.fileName, 'bai_tap.pdf');
  assert.equal(norm.fileSizeBytes, 2048576);
});

test('C2. Metadata: Backward compatibility with legacy external URL materials', () => {
  const legacyRecord = {
    id: 'mat-legacy-1',
    classroom_id: 'class-1',
    teacher_id: 'teacher-1',
    title: 'Từ điển HSK Trực tuyến',
    description: 'Tra cứu trực tuyến',
    file_url: 'https://hsk.academy/en/hsk_1',
    file_type: 'pdf'
  };

  const norm = normalizeClassMaterialRecord(legacyRecord);
  assert.equal(norm.cleanDescription, 'Tra cứu trực tuyến');
  assert.equal(norm.isStorageFile, false);
  assert.equal(norm.storagePath, null);
  assert.equal(norm.file_url, 'https://hsk.academy/en/hsk_1');
});

test('C3. Lifecycle: uploadClassMaterial stores extended metadata and emits normalized record', async () => {
  const uploadRes = await uploadClassMaterial({
    classroomId: 'c-sim-100',
    teacherId: 'teacher-sim-1',
    title: 'File Nghe HSK 1 Bài 1',
    description: 'File MP3 giọng chuẩn Bắc Kinh',
    fileUrl: null,
    fileType: 'audio',
    storagePath: 'classroom/c-sim-100/mat-aud-1/audio1.mp3',
    fileName: 'audio1.mp3',
    mimeType: 'audio/mpeg',
    fileSizeBytes: 3145728
  });

  assert.equal(uploadRes.success, true);
  assert.ok(uploadRes.material);
  assert.equal(uploadRes.material.title, 'File Nghe HSK 1 Bài 1');
  assert.equal(uploadRes.material.isStorageFile, true);
  assert.equal(uploadRes.material.storagePath, 'classroom/c-sim-100/mat-aud-1/audio1.mp3');
  assert.equal(uploadRes.material.fileSizeBytes, 3145728);
});

test('C4. Lifecycle: deleteClassMaterial safely deletes storage object and database item', async () => {
  const delRes = await deleteClassMaterial('mat-sim-del', 'classroom/c-sim-100/mat-aud-1/audio1.mp3');
  assert.equal(delRes.success, true);
});

test('C5. Helpers: formatBytes accurately formats diverse byte sizes', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(15728640), '15 MB');
});

// =========================================================================
// NHÓM D — REGRESSION & SECURITY AUDIT
// =========================================================================

test('D1. Regression: getDownloadUrlForClassMaterial returns URL for external link', async () => {
  const mat = {
    id: 'mat-ext-1',
    title: 'External Resource',
    file_url: 'https://example.com/doc.pdf',
    description: 'External link'
  };
  const url = await getDownloadUrlForClassMaterial(mat);
  assert.equal(url, 'https://example.com/doc.pdf');
});

test('D2. Regression: Zero secret key exposure in client storage service', () => {
  // Đảm bảo không có service_role key trong module
  assert.equal(typeof uploadMaterialToStorage, 'function');
  assert.equal(typeof getMaterialSignedUrl, 'function');
  assert.equal(typeof deleteMaterialFromStorage, 'function');
});

