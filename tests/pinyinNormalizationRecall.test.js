/**
 * =========================================================================
 * HANZI GO - ISS-03: PINYIN NORMALIZATION & UNACCENTED RETRIEVAL TEST SUITE
 * =========================================================================
 * Kiểm thử khả năng nhận dạng và truy xuất Pinyin không dấu, dung sai thanh điệu,
 * khoảng trắng, chữ giản thể/phồn thể và phòng chống dương tính giả.
 * =========================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  stripPinyinTones,
  generatePinyinVariants
} from '../scripts/knowledge/normalizer.js';

import {
  normalizeQueryForRetrieval,
  calculateLexicalScore,
  retrieveRagKnowledge,
  BUILTIN_CURATED_CHUNKS
} from '../api/_utils/ragRetriever.js';

test('ISS-03: Pinyin Normalization & Unaccented Matching Suite', async (t) => {

  // 1. Kiểm thử hàm stripPinyinTones
  await t.test('1. stripPinyinTones strips tone marks accurately while preserving vowels', () => {
    assert.equal(stripPinyinTones('nǐ hǎo'), 'ni hao');
    assert.equal(stripPinyinTones('lǜ sè'), 'lü se');
    assert.equal(stripPinyinTones('xièxie'), 'xiexie');
    assert.equal(stripPinyinTones('gāoxìng'), 'gaoxing');
    assert.equal(stripPinyinTones('bǎ'), 'ba');
    assert.equal(stripPinyinTones('bǐ'), 'bi');
  });

  // 2. Kiểm thử hàm generatePinyinVariants
  await t.test('2. generatePinyinVariants generates accented, unaccented, compact, and v/u variants', () => {
    const nihaoVars = generatePinyinVariants('nǐ hǎo');
    assert.ok(nihaoVars.includes('nǐ hǎo'));
    assert.ok(nihaoVars.includes('ni hao'));
    assert.ok(nihaoVars.includes('nihao'));

    const luseVars = generatePinyinVariants('lǜ sè');
    assert.ok(luseVars.includes('lǜ sè'));
    assert.ok(luseVars.includes('lü se'));
    assert.ok(luseVars.includes('lüse'));
    assert.ok(luseVars.includes('lv se'));
    assert.ok(luseVars.includes('lvse'));
    assert.ok(luseVars.includes('luse'));

    const xiexieVars = generatePinyinVariants('xièxie');
    assert.ok(xiexieVars.includes('xièxie'));
    assert.ok(xiexieVars.includes('xiexie'));
  });

  // 3. Kiểm thử truy xuất thực tế với Pinyin không dấu và viết liền (nihao, xiexie, lvse)
  await t.test('3. Retrieval succeeds for unaccented and compact pinyin queries', async () => {
    const store = {
      chunks: [
        ...BUILTIN_CURATED_CHUNKS,
        {
          id: 'chunk-xiexie',
          simplified: '谢谢',
          traditional: '謝謝',
          pinyin: 'xièxie',
          vietnamese_meaning: 'Cảm ơn bạn, bày tỏ lòng cảm kích.',
          is_verified: true,
          review_status: 'curated_verified',
          example_sentences: []
        }
      ]
    };

    // A. Query: "Cách đọc nihao trong tiếng Trung"
    const resNihao = await retrieveRagKnowledge({
      query: 'Cách đọc nihao trong tiếng Trung',
      topK: 3,
      storageEngine: store
    });
    assert.equal(resNihao.status, 'success');
    assert.equal(resNihao.chunks[0].simplified, '你好');

    // B. Query: "Từ xiexie biểu thị điều gì"
    const resXiexie = await retrieveRagKnowledge({
      query: 'Từ xiexie biểu thị điều gì',
      topK: 3,
      storageEngine: store
    });
    assert.equal(resXiexie.status, 'success');
    assert.equal(resXiexie.chunks[0].simplified, '谢谢');

    // C. Query: "Màu sắc lvse là gì"
    const resLvse = await retrieveRagKnowledge({
      query: 'Màu sắc lvse là gì',
      topK: 3,
      storageEngine: store
    });
    assert.equal(resLvse.status, 'success');
    assert.equal(resLvse.chunks[0].simplified, '绿色');

    // D. Query: "Màu luse"
    const resLuse = await retrieveRagKnowledge({
      query: 'Màu luse là màu gì',
      topK: 3,
      storageEngine: store
    });
    assert.equal(resLuse.status, 'success');
    assert.equal(resLuse.chunks[0].simplified, '绿色');
  });

  // 4. Kiểm thử Chữ Phồn thể (Traditional Hanzi)
  await t.test('4. Traditional Chinese characters match correctly', async () => {
    const resTrad = await retrieveRagKnowledge({
      query: 'Ý nghĩa của 高興 là gì?',
      topK: 3
    });
    assert.equal(resTrad.status, 'success');
    assert.equal(resTrad.chunks[0].simplified, '高兴');
  });

  // 5. Kiểm thử Bảo vệ chống Dương tính giả với Tiếng Việt (Anti-False Positive)
  await t.test('5. Common Vietnamese phrases do not trigger false positive pinyin matches', async () => {
    // "Viên bi màu đỏ" có chữ "bi" nhưng đây là danh từ tiếng Việt, không phải câu hỏi ngữ pháp chữ 比
    const queryMeta = normalizeQueryForRetrieval('Tôi nhìn thấy viên bi màu đỏ rơi trên sàn');
    const biChunk = {
      simplified: '比',
      pinyin: 'bǐ',
      vietnamese_meaning: 'Câu so sánh chữ 比',
      pedagogical_notes: 'Ngữ pháp so sánh hơn'
    };
    const score = calculateLexicalScore(biChunk, queryMeta);
    // Điểm phải thấp hơn ngưỡng 0.35
    assert.ok(score < 0.35, `Điểm (${score}) phải < 0.35 để tránh match nhầm từ tiếng Việt`);
  });

  // 6. Kiểm thử Truy vấn Thiếu chứng cứ (Out-of-domain)
  await t.test('6. Out-of-domain query strictly returns insufficient_evidence with 0 chunks', async () => {
    const resOod = await retrieveRagKnowledge({
      query: 'Tình hình kinh tế chứng khoán Bắc Kinh hôm nay',
      topK: 3
    });
    assert.equal(resOod.status, 'insufficient_evidence');
    assert.equal(resOod.chunks.length, 0);
  });

});
