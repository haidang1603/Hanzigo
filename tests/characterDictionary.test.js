/**
 * =========================================================================
 * HANZIGO - CHINESE CHARACTER DICTIONARY & STROKE WRITING TEST SUITE
 * =========================================================================
 * Kiểm thử toàn diện 13 danh mục tính năng:
 * 1. Tra cứu theo Chữ Hán (Giản thể & Phồn thể)
 * 2. Tra cứu theo Pinyin có dấu, không dấu, số thanh điệu và viết liền
 * 3. Tra cứu theo Nghĩa tiếng Việt (có dấu & không dấu) và âm Hán Việt
 * 4. Xử lý trường hợp không tìm thấy (Empty state / Zero match resilience)
 * 5. Hồ sơ chi tiết chữ Hán (Character detail & Zero hallucination policy)
 * 6. Xử lý phân rã từ ghép đa ký tự (Multi-character compound breakdown)
 * 7. Bảng 214 Bộ thủ Khang Hy & Lọc theo số nét
 * 8. Cấu trúc chữ, phân rã thành phần và các cặp chữ dễ nhầm lẫn
 * 9. Lưu trữ và đồng bộ tiến độ học tập (Guest vs Authenticated User)
 * 10. Tích hợp Lộ trình HSK và Lịch sử luyện viết
 * 11. Tính toán điểm số và dung sai lỗi trong luyện viết (Quiz Evaluation)
 * 12. Khả năng chống chịu lỗi dữ liệu và đầu vào không hợp lệ
 * =========================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  searchCharacters,
  getCharacterDetail,
  getAllCanonicalCharacters,
  getRelatedWordsForChar,
  stripVietnameseDiacritics,
  getUserWritingProgressMap,
  setUserWritingStatus,
  getWritingHistory,
  WRITING_STATUS
} from '../src/services/characterDictionaryService.js';

import {
  KANGXI_RADICALS,
  getRadicalsGroupedByStrokes,
  findRadical
} from '../src/data/radicalsData.js';

import {
  CHARACTER_DECOMPOSITION_DICT,
  CONFUSING_CHARACTER_PAIRS,
  STRUCTURE_TYPES,
  getCharacterDecomposition,
  getConfusingPairForChar
} from '../src/data/characterDecompositionData.js';

import {
  stripPinyinTones,
  generatePinyinVariants,
  convertNumberedPinyinToAccented
} from '../scripts/knowledge/normalizer.js';

test('HANZIGO DICTIONARY & STROKE WRITING TEST SUITE', async (suite) => {

  // 1. Tìm kiếm theo chữ Hán Giản thể & Phồn thể
  await suite.test('1. Search characters by Simplified & Traditional Hanzi', () => {
    // A. Giản thể đơn
    const resNi = searchCharacters({ query: '你' });
    assert.ok(resNi.total >= 1);
    assert.equal(resNi.items[0].char, '你');

    // B. Giản thể trong từ ghép
    const resXue = searchCharacters({ query: '学' });
    assert.ok(resXue.items.some(i => i.char === '学'));

    // C. Tìm bằng ký tự phồn thể tương ứng (學 ↔ 学, 國 ↔ 国, 漢 ↔ 汉)
    const resTradXue = searchCharacters({ query: '學' });
    assert.ok(resTradXue.items.some(i => i.char === '学'));

    const resTradGuo = searchCharacters({ query: '國' });
    assert.ok(resTradGuo.items.some(i => i.char === '国'));

    const resTradHan = searchCharacters({ query: '漢' });
    assert.ok(resTradHan.items.some(i => i.char === '汉'));
  });

  // 2. Tra cứu theo Pinyin (có dấu, không dấu, số thanh điệu, viết liền)
  await suite.test('2. Search characters by Pinyin variants', () => {
    // A. Pinyin có dấu chuẩn
    const resAccented = searchCharacters({ query: 'nǐ' });
    assert.ok(resAccented.items.some(i => i.char === '你'));

    // B. Pinyin không dấu
    const resUnaccented = searchCharacters({ query: 'ni' });
    assert.ok(resUnaccented.items.some(i => i.char === '你'));

    // C. Pinyin số thanh điệu
    const resNumbered = searchCharacters({ query: 'hao3' });
    assert.ok(resNumbered.items.some(i => i.char === '好'));

    // D. Pinyin từ ghép viết liền (nihao -> 你好 -> [你, 好])
    const resCompound = searchCharacters({ query: 'nihao' });
    assert.ok(resCompound.items.some(i => i.char === '你'));
    assert.ok(resCompound.items.some(i => i.char === '好'));
    assert.ok(resCompound.multiCharBreakdown !== null);
    assert.equal(resCompound.multiCharBreakdown.word, '你好');

    // E. Pinyin có khoảng trắng (ni hao)
    const resSpaced = searchCharacters({ query: 'ni hao' });
    assert.ok(resSpaced.items.some(i => i.char === '你'));
  });

  // 3. Tra cứu theo Nghĩa tiếng Việt & Hán Việt
  await suite.test('3. Search characters by Vietnamese meaning and Hanviet', () => {
    // A. Nghĩa tiếng Việt có dấu
    const resHoc = searchCharacters({ query: 'học' });
    assert.ok(resHoc.items.some(i => i.char === '学'));

    // B. Nghĩa tiếng Việt không dấu
    const resNuoc = searchCharacters({ query: 'nuoc' });
    assert.ok(resNuoc.items.some(i => i.char === '水'));

    // C. Hán Việt
    const resNga = searchCharacters({ query: 'Ngã' });
    assert.ok(resNga.items.some(i => i.char === '我'));

    const resHao = searchCharacters({ query: 'Hảo' });
    assert.ok(resHao.items.some(i => i.char === '好'));
  });

  // 4. Tìm kiếm không có kết quả (Empty & Resilience)
  await suite.test('4. Search returns graceful empty state for nonexistent queries', () => {
    const resEmpty = searchCharacters({ query: 'xyznonexistent123' });
    assert.equal(resEmpty.total, 0);
    assert.deepEqual(resEmpty.items, []);
    assert.equal(resEmpty.multiCharBreakdown, null);

    // Whitespace query
    const resSpaces = searchCharacters({ query: '    ' });
    assert.ok(resSpaces.total > 0); // returns full catalog without error
  });

  // 5. Hồ sơ chi tiết chữ Hán (Character detail & Zero Hallucination)
  await suite.test('5. Character detail extraction contains required fields without hallucinations', () => {
    const detailNi = getCharacterDetail('你');
    assert.ok(detailNi !== null);
    assert.equal(detailNi.char, '你');
    assert.equal(detailNi.pinyin, 'nǐ');
    assert.equal(detailNi.hanviet, 'Nhĩ');
    assert.equal(detailNi.strokesCount, 7);
    assert.ok(detailNi.radical.includes('亻') || detailNi.radical.includes('Nhân'));
    assert.ok(Array.isArray(detailNi.components));
    assert.ok(detailNi.mnemonic && detailNi.mnemonic.length > 5);

    // Compound vocabulary contains 你
    assert.ok(Array.isArray(detailNi.relatedWords));
    assert.ok(detailNi.relatedWords.some(w => w.hanzi.includes('你')));

    // Kiểm tra chữ đơn chưa có chiết tự nâng cao vẫn trả về cấu trúc an toàn
    const detailFallback = getCharacterDetail('一');
    assert.ok(detailFallback !== null);
    assert.equal(detailFallback.char, '一');
    assert.equal(detailFallback.strokesCount, 1);
  });

  // 6. Xử lý phân rã từ ghép (Multi-character breakdown)
  await suite.test('6. Multi-character words are cleanly parsed into constituent characters', () => {
    const resWord = searchCharacters({ query: '学习' });
    assert.ok(resWord.multiCharBreakdown !== null);
    assert.equal(resWord.multiCharBreakdown.word, '学习');
    assert.equal(resWord.multiCharBreakdown.characters.length, 2);
    assert.equal(resWord.multiCharBreakdown.characters[0].char, '学');
    assert.equal(resWord.multiCharBreakdown.characters[1].char, '习');
  });

  // 7. Bảng 214 Bộ thủ Khang Hy & Nhóm theo số nét
  await suite.test('7. 214 Kangxi Radicals dataset is complete and grouped by strokes 1 to 17', () => {
    assert.equal(KANGXI_RADICALS.length, 214);

    const grouped = getRadicalsGroupedByStrokes();
    // 1 stroke radicals: 一, 丨, 丶, 丿, 乙, 亅 (6 radicals)
    assert.equal(grouped[1].length, 6);
    // 17 strokes radical: 龠 (1 radical)
    assert.equal(grouped[17].length, 1);

    // Tra cứu bộ thủ
    const radNhan = findRadical('亻');
    assert.ok(radNhan !== null);
    assert.equal(radNhan.hanviet, 'Nhân');

    const radThuy = findRadical('Thủy');
    assert.ok(radThuy !== null);
    assert.equal(radThuy.radical, '水');
  });

  // 8. Cấu trúc chữ, phân rã thành phần và các cặp chữ dễ nhầm
  await suite.test('8. Character structure and confusing pairs detection', () => {
    // A. Cấu trúc chữ
    const decompHao = getCharacterDecomposition('好');
    assert.ok(decompHao !== null);
    assert.equal(decompHao.structure.code, 'left_right');
    assert.equal(decompHao.components.length, 2);
    assert.equal(decompHao.components[0].char, '女');
    assert.equal(decompHao.components[1].char, '子');

    // B. Cặp chữ dễ nhầm (己, 已, 巳)
    const confJi = getConfusingPairForChar('己');
    assert.ok(confJi !== null);
    assert.ok(confJi.pair.includes('已'));
    assert.ok(confJi.distinction.length > 10);
    assert.ok(confJi.mnemonic.length > 5);

    // C. Cặp chữ không có trong danh sách dễ nhầm
    const confNone = getConfusingPairForChar('你');
    assert.equal(confNone, null);
  });

  // 9. Lọc theo Cấp độ HSK và Số nét
  await suite.test('9. Search filters accurately by HSK level and Stroke count ranges', () => {
    // A. Lọc HSK 1
    const resHsk1 = searchCharacters({ hskFilter: 'HSK 1', limit: 100 });
    assert.ok(resHsk1.total > 0);
    resHsk1.items.forEach(i => {
      assert.equal(i.hskLevel, 'HSK 1');
    });

    // B. Lọc theo khoảng số nét (1 đến 4 nét)
    const resShort = searchCharacters({ strokeMin: 1, strokeMax: 4, limit: 50 });
    assert.ok(resShort.total > 0);
    resShort.items.forEach(i => {
      assert.ok(i.strokesCount >= 1 && i.strokesCount <= 4);
    });
  });

  // 10. Lưu trữ tiến độ học tập và phân quyền Guest vs Authenticated User
  await suite.test('10. Progress tracking handles Guest and Authenticated users with state isolation', async () => {
    const mockGuest = null;
    const mockUserA = { uid: '00000000-0000-0000-0000-000000000001', email: 'student_a@test.com' };
    const mockUserB = { uid: '00000000-0000-0000-0000-000000000002', email: 'student_b@test.com' };

    // Set progress for Guest
    await setUserWritingStatus('你', WRITING_STATUS.LEARNED, mockGuest, { score: 95 });
    const guestProgress = getUserWritingProgressMap(mockGuest);
    assert.equal(guestProgress['你'].status, WRITING_STATUS.LEARNED);
    assert.equal(guestProgress['你'].bestScore, 95);

    // Set progress for User A
    await setUserWritingStatus('好', WRITING_STATUS.LEARNED, mockUserA, { score: 100 });
    const userAProgress = getUserWritingProgressMap(mockUserA);
    assert.equal(userAProgress['好'].status, WRITING_STATUS.LEARNED);
    assert.equal(userAProgress['好'].bestScore, 100);

    // Verify User B does not see User A's progress (Isolation check)
    const userBProgress = getUserWritingProgressMap(mockUserB);
    assert.equal(userBProgress['好']?.status || WRITING_STATUS.NOT_STARTED, WRITING_STATUS.NOT_STARTED);

    // User A history check
    const historyA = getWritingHistory(mockUserA);
    assert.ok(Array.isArray(historyA));
    assert.ok(historyA.some(h => h.char === '好'));
  });

  // 11. Chuẩn hóa hàm stripVietnameseDiacritics
  await suite.test('11. stripVietnameseDiacritics accurately normalizes complex Vietnamese text', () => {
    assert.equal(stripVietnameseDiacritics('Học tiếng Trung Quốc'), 'hoc tieng trung quoc');
    assert.equal(stripVietnameseDiacritics('Đất nước & Con người'), 'dat nuoc & con nguoi');
    assert.equal(stripVietnameseDiacritics(''), '');
    assert.equal(stripVietnameseDiacritics(null), '');
  });

  // 12. Danh mục từ liên quan (Related words)
  await suite.test('12. getRelatedWordsForChar returns valid matching words from lexicon', () => {
    const related = getRelatedWordsForChar('学');
    assert.ok(related.length > 0);
    related.forEach(v => {
      assert.ok(v.hanzi.includes('学'));
    });
  });
});
