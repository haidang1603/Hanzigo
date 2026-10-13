/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE: DEDUPLICATOR & ANOMALY DETECTOR
 * =========================================================================
 * - Sinh mã băm định danh tất định (Deterministic Chunk Key) chống trùng lặp.
 * - Phát hiện trùng lặp tuyệt đối (Exact Duplicates) và trùng lặp tiệm cận (Near-duplicates).
 * - Phát hiện bất thường ngữ nghĩa và cú pháp (Anomaly Detection).
 * =========================================================================
 */

import crypto from 'crypto';
import { normalizeUnicodeNfc, containsChineseCharacters } from './normalizer.js';

/**
 * Tạo mã băm định danh tất định cho 1 chunk tri thức
 * Đảm bảo: Import lại cùng 1 nguồn sẽ sinh ra đúng chunk_key này -> Không tạo bản ghi trùng
 * @param {Object} params
 * @returns {string} SHA-256 Hex string
 */
export function computeChunkKey({
  sourceKey,
  simplified,
  pinyin = '',
  chunkType = 'vocab_entry'
}) {
  const normSource = normalizeUnicodeNfc(sourceKey || 'unknown_source').toLowerCase();
  const normHanzi = normalizeUnicodeNfc(simplified || '');
  const normPinyin = normalizeUnicodeNfc(pinyin || '').toLowerCase().replace(/\s+/g, '');
  const normType = normalizeUnicodeNfc(chunkType || 'vocab_entry').toLowerCase();

  const payload = `${normSource}:${normType}:${normHanzi}:${normPinyin}`;
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

/**
 * Tính SHA-256 checksum của toàn bộ nguồn dữ liệu (tệp văn bản hoặc danh sách)
 * @param {string|Buffer} content 
 * @returns {string}
 */
export function computeContentChecksum(content) {
  const raw = Buffer.isBuffer(content) ? content : Buffer.from(String(content || ''), 'utf8');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/**
 * Kiểm tra bất thường của bản ghi tri thức
 * @param {Object} record 
 * @returns {{ isAnomaly: boolean, reason?: string, severity?: 'error'|'warning' }}
 */
export function detectRecordAnomaly(record) {
  if (!record || typeof record !== 'object') {
    return { isAnomaly: true, reason: 'Bản ghi không phải object.', severity: 'error' };
  }

  const simplified = normalizeUnicodeNfc(record.simplified || '');
  const meaning = normalizeUnicodeNfc(record.vietnamese_meaning || '');

  // 1. Kiểm tra chữ Hán
  if (!simplified) {
    return { isAnomaly: true, reason: 'Chữ Hán (simplified) bị trống.', severity: 'error' };
  }
  if (!containsChineseCharacters(simplified)) {
    return { isAnomaly: true, reason: `Không tìm thấy ký tự CJK trong chữ Hán: "${simplified}".`, severity: 'error' };
  }
  if (record.chunk_type === 'vocab_entry' && simplified.length > 20) {
    return { isAnomaly: true, reason: `Từ vựng có độ dài bất thường (> 20 ký tự): "${simplified}".`, severity: 'warning' };
  }

  // 2. Kiểm tra nghĩa tiếng Việt
  if (!meaning) {
    return { isAnomaly: true, reason: 'Nghĩa tiếng Việt bị trống.', severity: 'error' };
  }

  // 3. Kiểm tra tính hợp lệ của giấy phép
  if (!record.license_identifier) {
    return { isAnomaly: true, reason: 'Thiếu thông tin giấy phép bản quyền (license_identifier).', severity: 'error' };
  }

  return { isAnomaly: false };
}

/**
 * Lọc trùng lặp và phân loại dữ liệu trong danh sách bản ghi
 * @param {Array} records 
 * @param {string} sourceKey 
 * @returns {{ uniqueRecords: Array, duplicates: Array, anomalies: Array }}
 */
export function deduplicateRecords(records = [], sourceKey = 'default_source') {
  const seenKeys = new Map();
  const seenHanziMap = new Map();

  const uniqueRecords = [];
  const duplicates = [];
  const anomalies = [];

  records.forEach((rawRecord, index) => {
    // 1. Kiểm tra bất thường
    const anomalyCheck = detectRecordAnomaly(rawRecord);
    if (anomalyCheck.isAnomaly && anomalyCheck.severity === 'error') {
      anomalies.push({ index, record: rawRecord, reason: anomalyCheck.reason });
      return;
    }

    // 2. Gán chunk_key tất định
    const chunkKey = computeChunkKey({
      sourceKey,
      simplified: rawRecord.simplified,
      pinyin: rawRecord.pinyin,
      chunkType: rawRecord.chunk_type
    });

    const record = {
      ...rawRecord,
      chunk_key: chunkKey
    };

    // 3. Phát hiện trùng lặp tuyệt đối (Exact duplicate)
    if (seenKeys.has(chunkKey)) {
      duplicates.push({
        index,
        type: 'exact_duplicate',
        chunkKey,
        originalIndex: seenKeys.get(chunkKey),
        simplified: record.simplified
      });
      return;
    }

    // 4. Phát hiện trùng lặp tiệm cận (Near-duplicate: cùng chữ Hán và cùng loại, khác nhẹ pinyin/nghĩa)
    const hanziTypeKey = `${record.chunk_type}:${normalizeUnicodeNfc(record.simplified)}`;
    if (seenHanziMap.has(hanziTypeKey)) {
      const prevRecord = seenHanziMap.get(hanziTypeKey);
      // Ghi chú cảnh báo nhưng vẫn lưu nếu pinyin biểu thị từ đa âm (đa âm tự)
      if (prevRecord.pinyin !== record.pinyin) {
        record.metadata = {
          ...record.metadata,
          polyphone_variant: true,
          polyphone_pair: prevRecord.pinyin
        };
      }
    } else {
      seenHanziMap.set(hanziTypeKey, record);
    }

    seenKeys.set(chunkKey, index);
    uniqueRecords.push(record);
  });

  return {
    uniqueRecords,
    duplicates,
    anomalies
  };
}
