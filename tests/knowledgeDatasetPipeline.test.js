import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

import {
  normalizeUnicodeNfc,
  convertNumberedSyllableToAccented,
  convertNumberedPinyinToAccented,
  validateVietnameseText,
  containsChineseCharacters
} from '../scripts/knowledge/normalizer.js';

import {
  parseCcCedictLine,
  parseCcCedictContent,
  CC_CEDICT_METADATA
} from '../scripts/knowledge/parsers/ccCedictParser.js';

import {
  parseCurriculumVocabulary,
  parseCurriculumGrammar,
  CURRICULUM_METADATA
} from '../scripts/knowledge/parsers/curriculumParser.js';

import {
  computeChunkKey,
  computeContentChecksum,
  detectRecordAnomaly,
  deduplicateRecords
} from '../scripts/knowledge/deduplicator.js';

import {
  InMemoryKnowledgeStore,
  executeKnowledgeImport,
  executeKnowledgeRollback,
  isLicenseVerified,
  APPROVED_OPEN_LICENSES
} from '../scripts/knowledge/importer.js';

test('1. Unicode & Phonetic Normalization (UTF-8, Diacritics & Pinyin)', async (t) => {
  await t.test('preserves Vietnamese diacritics and NFC form', () => {
    const vnSamples = [
      'Học tiếng Trung giao tiếp mỗi ngày',
      'Cấu trúc câu chữ 把 trong HSK 3',
      'Ngữ âm: thanh điệu, vận mẫu uốn lưỡi, biến điệu thanh 3',
      'Đại từ nhân xưng: Tôi, Bạn, Anh ấy, Chúng ta'
    ];

    for (const text of vnSamples) {
      const normalized = normalizeUnicodeNfc(text);
      assert.equal(normalized, text.normalize('NFC'));
      const validation = validateVietnameseText(normalized);
      assert.equal(validation.valid, true, `Text should be valid Vietnamese: ${text}`);
    }
  });

  await t.test('flags corrupt mojibake characters in Vietnamese text', () => {
    const brokenText1 = 'Ti\uFFFDu thuy\uFFFDt';
    const brokenText2 = 'H???c ti???ng Trung';
    assert.equal(validateVietnameseText(brokenText1).valid, false);
    assert.equal(validateVietnameseText(brokenText2).valid, false);
  });

  await t.test('converts numbered Pinyin to accurate tone marks without dropping accents', () => {
    assert.equal(convertNumberedSyllableToAccented('ni3'), 'nǐ');
    assert.equal(convertNumberedSyllableToAccented('hao3'), 'hǎo');
    assert.equal(convertNumberedSyllableToAccented('zhong1'), 'zhōng');
    assert.equal(convertNumberedSyllableToAccented('guo2'), 'guó');
    assert.equal(convertNumberedSyllableToAccented('xue2'), 'xué');
    assert.equal(convertNumberedSyllableToAccented('xi2'), 'xí');
    assert.equal(convertNumberedSyllableToAccented('de5'), 'de');
    assert.equal(convertNumberedSyllableToAccented('er2'), 'ér');

    // Tricky ü sounds (v / u:)
    assert.equal(convertNumberedSyllableToAccented('lu:4'), 'lǜ');
    assert.equal(convertNumberedSyllableToAccented('lv4'), 'lǜ');
    assert.equal(convertNumberedSyllableToAccented('nv3'), 'nǚ');

    // Multi-syllable phrases
    assert.equal(convertNumberedPinyinToAccented('ni3 hao3'), 'nǐ hǎo');
    assert.equal(convertNumberedPinyinToAccented('Zhong1 guo2'), 'Zhōng guó');
    assert.equal(convertNumberedPinyinToAccented('lu:4 se4'), 'lǜ sè');
  });

  await t.test('detects Chinese characters accurately', () => {
    assert.equal(containsChineseCharacters('你好'), true);
    assert.equal(containsChineseCharacters('学中文'), true);
    assert.equal(containsChineseCharacters('Hello World'), false);
    assert.equal(containsChineseCharacters('12345'), false);
  });
});

test('2. CC-CEDICT Parser & License Attribution', async (t) => {
  await t.test('parses official CC-CEDICT line format accurately', () => {
    const line = '你好 你好 [ni3 hao3] /hello/hi/how are you/';
    const result = parseCcCedictLine(line, 1);
    assert.equal(result.valid, true);
    assert.equal(result.record.simplified, '你好');
    assert.equal(result.record.traditional, '你好');
    assert.equal(result.record.pinyin, 'nǐ hǎo');
    assert.equal(result.record.pinyin_numbered, 'ni3 hao3');
    assert.equal(result.record.license_identifier, 'CC-BY-SA-4.0');
    assert.ok(result.record.attribution.includes('CC-CEDICT'));
    assert.ok(result.record.vietnamese_meaning.includes('hello; hi; how are you'));
  });

  await t.test('ignores comment lines starting with #', () => {
    const comment = '# CC-CEDICT License header';
    const result = parseCcCedictLine(comment, 1);
    assert.equal(result.valid, false);
    assert.equal(result.isComment, true);
  });

  await t.test('flags malformed syntax lines gracefully without crashing', () => {
    const invalidLine = 'BAD_LINE [missing_slashes] error';
    const result = parseCcCedictLine(invalidLine, 42);
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('Cú pháp không hợp lệ tại dòng 42'));
  });

  await t.test('parses full sample fixture and extracts error statistics', () => {
    const fixturePath = path.resolve(process.cwd(), 'scripts/knowledge/fixtures/sample_cedict.u8');
    const content = fs.readFileSync(fixturePath, 'utf8');
    const parsed = parseCcCedictContent(content);

    assert.ok(parsed.records.length >= 8, 'Expected at least 8 valid records in sample fixture');
    assert.ok(parsed.commentLines >= 3, 'Expected at least 3 comment lines');
    assert.ok(parsed.errors.length >= 1, 'Expected at least 1 caught malformed line');

    const greenEntry = parsed.records.find(r => r.simplified === '绿色');
    assert.ok(greenEntry, 'Found 绿色');
    assert.equal(greenEntry.pinyin, 'lǜ sè');
  });
});

test('3. Curriculum & Pedagogical Grammar Parser', async (t) => {
  const fixturePath = path.resolve(process.cwd(), 'scripts/knowledge/fixtures/sample_curriculum.json');
  const json = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  await t.test('extracts vocabulary entries with meanings, pinyin, and level', () => {
    const parsed = parseCurriculumVocabulary(json.vocabulary);
    assert.equal(parsed.records.length, 3);
    assert.equal(parsed.errors.length, 0);

    const apple = parsed.records.find(r => r.simplified === '苹果');
    assert.ok(apple);
    assert.equal(apple.pinyin, 'píngguǒ');
    assert.equal(apple.vietnamese_meaning, 'Quả táo');
    assert.equal(apple.hsk_level, 'HSK 1');
    assert.equal(apple.license_identifier, 'Educational-CC-BY-NC-SA-4.0');
    assert.ok(apple.attribution.includes('HanziGo Pedagogical Curriculum'));
  });

  await t.test('extracts grammar patterns with explanation and example sentences', () => {
    const parsed = parseCurriculumGrammar(json.lessons);
    assert.equal(parsed.records.length, 1);
    assert.equal(parsed.errors.length, 0);

    const baSentence = parsed.records[0];
    assert.equal(baSentence.chunk_type, 'grammar_pattern');
    assert.ok(baSentence.grammar_pattern.includes('把'));
    assert.ok(baSentence.vietnamese_meaning.includes('Câu chữ 把'));
    assert.equal(baSentence.hsk_level, 'HSK 3');
    assert.equal(baSentence.example_sentences.length, 2);
  });
});

test('4. Deterministic Hashing & Deduplication', async (t) => {
  await t.test('computeChunkKey is deterministic and collisions-resistant', () => {
    const key1 = computeChunkKey({
      sourceKey: 'cc-cedict-v1',
      simplified: '你好',
      pinyin: 'nǐ hǎo',
      chunkType: 'vocab_entry'
    });
    const key2 = computeChunkKey({
      sourceKey: 'cc-cedict-v1',
      simplified: '你好',
      pinyin: 'nǐ hǎo',
      chunkType: 'vocab_entry'
    });
    assert.equal(key1, key2);

    const keyDifferentSource = computeChunkKey({
      sourceKey: 'curriculum-v2',
      simplified: '你好',
      pinyin: 'nǐ hǎo',
      chunkType: 'vocab_entry'
    });
    assert.notEqual(key1, keyDifferentSource);
  });

  await t.test('detectRecordAnomaly flags invalid records', () => {
    assert.equal(detectRecordAnomaly(null).isAnomaly, true);
    assert.equal(detectRecordAnomaly({ simplified: '', vietnamese_meaning: 'nghĩa' }).isAnomaly, true);
    assert.equal(detectRecordAnomaly({ simplified: 'abc', vietnamese_meaning: 'nghĩa' }).isAnomaly, true);
    assert.equal(detectRecordAnomaly({ simplified: '你好', vietnamese_meaning: '' }).isAnomaly, true);
    assert.equal(detectRecordAnomaly({ simplified: '你好', vietnamese_meaning: 'Xin chào', license_identifier: 'CC-BY' }).isAnomaly, false);
  });

  await t.test('deduplicateRecords eliminates identical duplicates in batch', () => {
    const batch = [
      { simplified: '学生', pinyin: 'xuéshēng', vietnamese_meaning: 'Học sinh', license_identifier: 'CC-BY' },
      { simplified: '学生', pinyin: 'xuéshēng', vietnamese_meaning: 'Học sinh', license_identifier: 'CC-BY' },
      { simplified: '老师', pinyin: 'lǎoshī', vietnamese_meaning: 'Thầy cô', license_identifier: 'CC-BY' }
    ];
    const result = deduplicateRecords(batch, 'test-source');
    assert.equal(result.uniqueRecords.length, 2);
    assert.equal(result.duplicates.length, 1);
    assert.equal(result.duplicates[0].simplified, '学生');
  });
});

test('5. Idempotent Ingestion & Review Gate (Import lại không tạo trùng)', async (t) => {
  const store = new InMemoryKnowledgeStore();
  const sourceMetadata = {
    source_key: 'hsk1-verified-vocab',
    title: 'Từ vựng HSK 1 Chuẩn',
    license_identifier: 'Educational-CC-BY-NC-SA-4.0',
    attribution: 'HanziGo Curriculum (CC BY-NC-SA 4.0)',
    review_status: 'curated_verified'
  };

  const records = [
    { simplified: '大', pinyin: 'dà', vietnamese_meaning: 'To lớn', license_identifier: 'Educational-CC-BY-NC-SA-4.0' },
    { simplified: '小', pinyin: 'xiǎo', vietnamese_meaning: 'Nhỏ bé', license_identifier: 'Educational-CC-BY-NC-SA-4.0' },
    { simplified: '多', pinyin: 'duō', vietnamese_meaning: 'Nhiều', license_identifier: 'Educational-CC-BY-NC-SA-4.0' }
  ];

  await t.test('Run 1: First ingestion inserts all unique records', async () => {
    const report1 = await executeKnowledgeImport({
      sourceMetadata,
      rawRecords: records,
      storageEngine: store
    });

    assert.equal(report1.success, true);
    assert.equal(report1.importedRecords, 3);
    assert.equal(report1.updatedRecords, 0);
    assert.equal(report1.isVerified, true);
    assert.equal(report1.reviewStatus, 'curated_verified');
    assert.equal(store.chunks.size, 3);
  });

  await t.test('Run 2: Re-ingesting the exact same source updates without creating duplicates (Idempotency)', async () => {
    const report2 = await executeKnowledgeImport({
      sourceMetadata,
      rawRecords: records,
      storageEngine: store
    });

    assert.equal(report2.success, true);
    assert.equal(report2.importedRecords, 0, 'Should not insert new duplicates');
    assert.equal(report2.updatedRecords, 3, 'Should safely update existing chunks');
    assert.equal(store.chunks.size, 3, 'Total chunks in store must remain exactly 3');
  });

  await t.test('Source Traceability: every chunk links to source_id, license and attribution', () => {
    const chunks = Array.from(store.chunks.values());
    for (const chunk of chunks) {
      assert.ok(chunk.source_id, 'Chunk must link to source_id');
      assert.equal(chunk.license_identifier, 'Educational-CC-BY-NC-SA-4.0');
      assert.equal(chunk.attribution, 'HanziGo Curriculum (CC BY-NC-SA 4.0)');
      assert.equal(chunk.is_verified, true);
    }
  });

  await t.test('Review Gate: unverified license automatically marked pending_review and is_verified: false', async () => {
    const unverifiedSource = {
      source_key: 'unverified-web-scrape',
      title: 'Tài liệu không rõ nguồn',
      license_identifier: 'Unknown / Unlicensed',
      attribution: 'Internet',
      review_status: 'curated_verified' // Cố ý gán verified nhưng giấy phép không hợp lệ
    };

    const unverifiedRecords = [
      { simplified: '秘密', pinyin: 'mìmì', vietnamese_meaning: 'Bí mật', license_identifier: 'Unknown' }
    ];

    const report = await executeKnowledgeImport({
      sourceMetadata: unverifiedSource,
      rawRecords: unverifiedRecords,
      storageEngine: store
    });

    assert.equal(report.isVerified, false, 'Unverified license must be is_verified: false');
    assert.equal(report.reviewStatus, 'pending_review', 'Review status must be forced to pending_review');
  });
});

test('6. Dry-Run, Rollback & Audit Logging', async (t) => {
  const store = new InMemoryKnowledgeStore();
  const sourceMetadata = {
    source_key: 'rollback-test-source',
    title: 'Nguồn kiểm thử Rollback',
    license_identifier: 'CC-BY-SA-4.0',
    attribution: 'HanziGo Test',
    review_status: 'curated_verified'
  };

  const records = [
    { simplified: '猫', pinyin: 'māo', vietnamese_meaning: 'Con mèo', license_identifier: 'CC-BY-SA-4.0' },
    { simplified: '狗', pinyin: 'gǒu', vietnamese_meaning: 'Con chó', license_identifier: 'CC-BY-SA-4.0' }
  ];

  await t.test('Dry-Run mode does not write to knowledge store', async () => {
    const dryRunReport = await executeKnowledgeImport({
      sourceMetadata,
      rawRecords: records,
      dryRun: true,
      storageEngine: store
    });

    assert.equal(dryRunReport.mode, 'dry_run');
    assert.equal(dryRunReport.totalRecords, 2);
    assert.equal(store.chunks.size, 0, 'Dry-run must not mutate chunks store');

    // Audit log for dry_run is properly saved
    assert.equal(store.auditLogs.length, 1);
    assert.equal(store.auditLogs[0].action, 'dry_run');
  });

  await t.test('Official import creates audit log and populates store', async () => {
    const importReport = await executeKnowledgeImport({
      sourceMetadata,
      rawRecords: records,
      dryRun: false,
      batchId: 'batch-test-101',
      storageEngine: store
    });

    assert.equal(importReport.importedRecords, 2);
    assert.equal(store.chunks.size, 2);
    assert.equal(store.auditLogs.length, 2); // 1 dry_run + 1 import
  });

  await t.test('Rollback cleanly removes imported chunks and logs audit event', () => {
    const rollbackResult = executeKnowledgeRollback({
      sourceKey: 'rollback-test-source',
      batchId: 'batch-test-101',
      storageEngine: store
    });

    assert.equal(rollbackResult.deletedChunksCount, 2);
    assert.equal(store.chunks.size, 0, 'Store must be empty after rollback');
    assert.equal(store.auditLogs.length, 3);
    assert.equal(store.auditLogs[2].action, 'rollback');
  });
});
