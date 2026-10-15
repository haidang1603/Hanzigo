/**
 * =========================================================================
 * HANZIGO - WORKSHEET GENERATOR & TIANZIGE PRINT ENGINE TEST SUITE
 * =========================================================================
 * Kiểm thử toàn diện module sinh bảng tập viết ô Điền tự / Mễ tự chuẩn A4:
 * 1. Trích xuất ký tự CJK từ văn bản tự do và lọc nhiễu
 * 2. Cấu trúc dòng ô Điền tự, phân bổ ô mẫu - ô đồ nét - ô tự viết
 * 3. Sinh mô hình tài liệu in A4 tích hợp thông tin chữ Hán
 * 4. Tính toàn vẹn của các cấu hình kiểu lưới và màu sắc truyền thống
 * 5. Khả năng chống chịu dữ liệu rỗng và đầu vào không hợp lệ
 * =========================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GRID_STYLES,
  GRID_COLORS,
  WORKSHEET_PRESETS,
  extractWorksheetCharacters,
  generateRowCells,
  buildWorksheetDocument
} from '../src/utils/worksheetGenerator.js';

test('HANZIGO WORKSHEET GENERATOR TEST SUITE', async (suite) => {

  // 1. Trích xuất chữ Hán CJK từ văn bản
  await suite.test('1. Extract CJK characters from diverse inputs', () => {
    // A. Chữ đơn
    assert.deepEqual(extractWorksheetCharacters('学'), ['学']);

    // B. Từ ghép
    assert.deepEqual(extractWorksheetCharacters('学习'), ['学', '习']);

    // C. Văn bản hỗn hợp chữ Hán, Pinyin, tiếng Việt và dấu câu
    const mixed = 'Học từ 你好 (nǐ hǎo) và 中国 (zhōng guó)!';
    const extracted = extractWorksheetCharacters(mixed);
    assert.deepEqual(extracted, ['你', '好', '中', '国']);

    // D. Chế độ lọc trùng lặp (deduplicate)
    const repeated = '妈妈，好妈妈！';
    assert.deepEqual(extractWorksheetCharacters(repeated, true), ['妈', '好']);
    assert.deepEqual(extractWorksheetCharacters(repeated, false), ['妈', '妈', '好', '妈', '妈']);

    // E. Đầu vào rỗng hoặc không hợp lệ
    assert.deepEqual(extractWorksheetCharacters(''), []);
    assert.deepEqual(extractWorksheetCharacters(null), []);
    assert.deepEqual(extractWorksheetCharacters('Hello 123 !@#$'), []);
  });

  // 2. Phân bổ các ô trong một dòng tập viết (Ô mẫu, Ô đồ nét, Ô trống tự viết)
  await suite.test('2. Generate practice row cells with model, trace, and blank boxes', () => {
    const cells = generateRowCells({
      character: '学',
      totalCells: 11,
      traceBoxesCount: 3,
      traceOpacity: 0.25,
      pinyin: 'xué',
      showPinyin: true
    });

    assert.equal(cells.length, 11, 'Mỗi dòng phải có đúng 11 ô chuẩn A4');

    // Ô đầu tiên: Ô chữ mẫu (mực đậm 100%)
    assert.equal(cells[0].mode, 'model');
    assert.equal(cells[0].opacity, 1);
    assert.equal(cells[0].char, '学');
    assert.equal(cells[0].pinyin, 'xué');

    // Các ô tiếp theo (1 -> 3): Ô đồ nét mờ theo
    for (let i = 1; i <= 3; i++) {
      assert.equal(cells[i].mode, 'trace', `Ô thứ ${i} phải là ô đồ nét mờ`);
      assert.equal(cells[i].opacity, 0.25);
      assert.equal(cells[i].char, '学');
    }

    // Các ô còn lại (4 -> 10): Ô trống để học viên tự viết
    for (let i = 4; i < 11; i++) {
      assert.equal(cells[i].mode, 'blank', `Ô thứ ${i} phải là ô trống tự viết`);
      assert.equal(cells[i].opacity, 0);
    }
  });

  // 3. Tùy biến số lượng ô đồ nét (0 ô đồ nét -> 100% tự viết)
  await suite.test('3. Customize trace count (zero trace for independent exam mode)', () => {
    const examCells = generateRowCells({
      character: '好',
      totalCells: 10,
      traceBoxesCount: 0,
      traceOpacity: 0.25,
      pinyin: 'hǎo'
    });

    assert.equal(examCells[0].mode, 'model');
    assert.equal(examCells[0].opacity, 1);

    for (let i = 1; i < 10; i++) {
      assert.equal(examCells[i].mode, 'blank');
      assert.equal(examCells[i].opacity, 0);
    }
  });

  // 4. Sinh mô hình tài liệu in A4 đầy đủ
  await suite.test('4. Build complete A4 worksheet document model', () => {
    const doc = buildWorksheetDocument({
      title: 'Bảng Tập Viết HanziGo',
      characters: ['学', '习'],
      rowsPerChar: 2,
      totalCellsPerRow: 11,
      gridStyle: 'mizige',
      gridColor: 'red',
      traceBoxesCount: 3,
      traceOpacity: 0.25,
      studentName: 'Nguyễn Văn A',
      className: 'HSK 1'
    });

    // Kiểm tra Meta
    assert.equal(doc.meta.studentName, 'Nguyễn Văn A');
    assert.equal(doc.meta.className, 'HSK 1');
    assert.ok(doc.meta.date);

    // Kiểm tra Settings
    assert.equal(doc.settings.gridStyle, 'mizige');
    assert.equal(doc.settings.gridColor.hex, '#DC2626');
    assert.equal(doc.settings.rowsPerChar, 2);

    // Kiểm tra Character Sections
    assert.equal(doc.characterSections.length, 2);
    
    // Chữ '学'
    const sec1 = doc.characterSections[0];
    assert.equal(sec1.char, '学');
    assert.equal(sec1.detail.pinyin, 'xué');
    assert.equal(sec1.detail.hanviet, 'Học');
    assert.equal(sec1.rows.length, 2);
    assert.equal(sec1.rows[0].cells.length, 11);

    // Chữ '习'
    const sec2 = doc.characterSections[1];
    assert.equal(sec2.char, '习');
    assert.equal(sec2.rows.length, 2);
  });

  // 5. Kiểm tra tính hợp lệ của các Preset và Styles
  await suite.test('5. Verify grid styles, colors, and curated presets', () => {
    // Grid Styles
    assert.ok(GRID_STYLES.TIANZIGE, 'Phải có kiểu ô Điền tự');
    assert.ok(GRID_STYLES.MIZIGE, 'Phải có kiểu ô Mễ tự');
    assert.ok(GRID_STYLES.JIUGONGGE, 'Phải có kiểu ô Cửu cung');
    assert.ok(GRID_STYLES.BLANK, 'Phải có kiểu ô vuông trơn');

    // Colors
    assert.ok(GRID_COLORS.red.borderHex.startsWith('#'));
    assert.ok(GRID_COLORS.slate.lineHex.startsWith('#'));
    assert.ok(GRID_COLORS.blue.hex.startsWith('#'));

    // Presets
    assert.ok(WORKSHEET_PRESETS.length >= 4);
    WORKSHEET_PRESETS.forEach(preset => {
      assert.ok(preset.id);
      assert.ok(preset.label);
      const chars = extractWorksheetCharacters(preset.text);
      assert.ok(chars.length > 0, `Preset ${preset.id} phải chứa ít nhất 1 chữ Hán hợp lệ`);
    });
  });

});
