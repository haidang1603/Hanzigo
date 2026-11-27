import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { VOCABULARY_LIST } from '../src/data/chineseData.js';
import { GRADED_READERS_DATA } from '../src/data/gradedReadersData.js';
import {
  extractContextualPinyinArray,
  segmentSentenceWithPinyin,
  analyzeChineseText,
} from '../src/utils/chineseNlpEngine.js';
import { lookupChineseTokenLocal } from '../src/utils/localVocabLookup.js';
import {
  lookupLocalSelectionEntry,
  saveSelectionToSrs,
} from '../src/services/selectionAiService.js';
import {
  isValidVietnameseMeaning,
  lookupUnifiedChineseWord,
  buildSafeReaderFlashcard,
} from '../src/services/unifiedLookupService.js';

const ROOT = process.cwd();

test('1. Single source of truth: Word Inspector and SelectionAiPopover resolve identical Sino-Vietnamese & meaning for 子', () => {
  const inspectorTokens = segmentSentenceWithPinyin('子');
  assert.equal(inspectorTokens.length, 1);
  const inspectorWord = inspectorTokens[0];

  const popoverEntry = lookupLocalSelectionEntry('子');
  const localToken = lookupChineseTokenLocal('子');
  const unified = lookupUnifiedChineseWord('子');

  assert.equal(inspectorWord.hanviet, 'Tử');
  assert.equal(popoverEntry.sinoVietnamese, 'Tử');
  assert.equal(localToken.hanviet, 'Tử');
  assert.equal(unified.sinoVietnamese, 'Tử');

  assert.notEqual(inspectorWord.hanviet, 'Tự');
  assert.notEqual(popoverEntry.sinoVietnamese, 'Tự');
  assert.equal(inspectorWord.meaningVi, popoverEntry.meaningVi);
  assert.equal(popoverEntry.meaningVi, localToken.meaning);
  assert.ok(inspectorWord.pinyin.includes('zǐ'));
  assert.ok(popoverEntry.pinyin.includes('zǐ'));
  assert.ok(Array.isArray(popoverEntry.relatedCompounds) && popoverEntry.relatedCompounds.length >= 1);
  assert.ok(Array.isArray(inspectorWord.relatedCompounds) && inspectorWord.relatedCompounds.length >= 1);
});

test('2. Confusable Sino-Vietnamese groups & corrected single chars map accurately', () => {
  const expected = [
    ['子', 'Tử'],
    ['字', 'Tự'],
    ['自', 'Tự'],
    ['在', 'Tại'],
    ['再', 'Tái'],
    ['做', 'Tác'],
    ['作', 'Tác'],
    ['的', 'Đích'],
    ['地', 'Địa'],
    ['得', 'Đắc'],
    ['他', 'Tha'],
    ['她', 'Tha'],
    ['它', 'Tha'],
    ['买', 'Mãi'],
    ['卖', 'Mại'],
    ['事', 'Sự'],
    ['是', 'Thị'],
    ['时', 'Thời'],
    ['十', 'Thập'],
    ['市', 'Thị'],
    ['长', 'Trường'],
    ['常', 'Thường'],
    ['场', 'Tràng'],
    ['和', 'Hòa'],
    ['河', 'Hà'],
    ['合', 'Hợp'],
    ['喝', 'Hát'],
    ['生', 'Sinh'],
    ['声', 'Thanh'],
    ['升', 'Thăng'],
    ['国', 'Quốc'],
    ['过', 'Quá'],
    ['果', 'Quả'],
    ['人', 'Nhân'],
    ['认', 'Nhận'],
    ['任', 'Nhiệm'],
    ['进', 'Tiến'],
    ['近', 'Cận'],
    ['今', 'Kim'],
    ['金', 'Kim'],
    ['吃', 'Cật'],
    ['住', 'Trú'],
    ['很', 'Khẩn'],
    ['拿', 'Nã'],
  ];

  for (const [ch, expectedHvPrefix] of expected) {
    const pyArr = extractContextualPinyinArray(ch);
    const unified = lookupUnifiedChineseWord(ch);
    assert.ok(pyArr[0]?.pinyin, `Missing pinyin for ${ch}`);
    assert.ok(
      String(pyArr[0]?.hanviet || '').startsWith(expectedHvPrefix),
      `extractContextualPinyinArray(${ch}) hanviet=${pyArr[0]?.hanviet}, expected prefix=${expectedHvPrefix}`
    );
    assert.ok(
      String(unified.sinoVietnamese || '').startsWith(expectedHvPrefix),
      `lookupUnifiedChineseWord(${ch}) hanviet=${unified.sinoVietnamese}, expected prefix=${expectedHvPrefix}`
    );
    assert.equal(
      isValidVietnameseMeaning(unified.meaningVi),
      true,
      `Missing valid Vietnamese meaning for ${ch}: "${unified.meaningVi}"`
    );
  }
});

test('3. Zero "Đang cập nhật" or wrong "Tự"/"zì" fallback across VOCABULARY_LIST, graded readers & lookup services', () => {
  for (const item of VOCABULARY_LIST) {
    const unified = lookupUnifiedChineseWord(item.hanzi);
    assert.equal(
      isValidVietnameseMeaning(unified.meaningVi),
      true,
      `VOCABULARY_LIST entry ${item.hanzi} resolved invalid meaning: ${unified.meaningVi}`
    );
    if (!['字', '自'].includes(item.hanzi)) {
      const charArr = extractContextualPinyinArray(item.hanzi);
      for (const c of charArr) {
        if (/[\u4e00-\u9fa5]/.test(c.char) && !['字', '自', '籽', '恣'].includes(c.char)) {
          assert.notEqual(c.hanviet, 'Tự', `Unexpected fallback "Tự" on char "${c.char}" in "${item.hanzi}"`);
        }
      }
    }
  }

  for (const reader of GRADED_READERS_DATA) {
    const text = (reader.paragraphs || []).map((p) => p.zh || '').join(' ');
    const analyzed = analyzeChineseText(text);
    for (const tok of analyzed.tokens) {
      if (!tok.isChinese) continue;
      assert.equal(
        isValidVietnameseMeaning(tok.meaningVi),
        true,
        `Graded reader ${reader.id} token "${tok.raw}" has placeholder/empty meaning: "${tok.meaningVi}"`
      );
    }
  }

  const runtimeFilesToScan = [
    'src/utils/chineseNlpEngine.js',
    'src/utils/localVocabLookup.js',
    'src/services/selectionAiService.js',
    'src/services/dictionaryService.ts',
    'src/core/ecosystem/UnifiedToolsContext.tsx',
    'src/pages/ReaderPage.jsx',
  ];

  for (const rel of runtimeFilesToScan) {
    const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.equal(/['"`]Đang cập nhật['"`]/i.test(code), false, `${rel} still contains "Đang cập nhật" placeholder`);
    assert.equal(/Chưa có mục từ chi tiết trong bộ từ điển nhanh/i.test(code), false, `${rel} still contains old dictionary placeholder`);
  }
});

test('4. Anti-junk SRS guard blocks empty/placeholder meanings and persists valid cards', async () => {
  assert.equal(isValidVietnameseMeaning(''), false);
  assert.equal(isValidVietnameseMeaning('Đang cập nhật'), false);
  assert.equal(isValidVietnameseMeaning('Chưa cập nhật'), false);
  assert.equal(isValidVietnameseMeaning('Từ ghép tiếng Trung'), false);
  assert.equal(isValidVietnameseMeaning('N/A'), false);
  assert.equal(isValidVietnameseMeaning('Đứa con, con nhỏ'), true);

  const rejected = await saveSelectionToSrs({
    user: null,
    hanzi: '子',
    pinyin: 'zǐ',
    meaningVi: 'Đang cập nhật',
  });
  assert.equal(rejected.ok, false);

  const rejectedEmpty = await saveSelectionToSrs({
    user: null,
    hanzi: '子',
    pinyin: 'zǐ',
    meaningVi: '',
  });
  assert.equal(rejectedEmpty.ok, false);

  const readerBlocked = buildSafeReaderFlashcard({ raw: 'x', meaningVi: 'Đang cập nhật' });
  assert.equal(readerBlocked.ok, false);
  const readerOk = buildSafeReaderFlashcard({ raw: '子', pinyin: 'zǐ', meaningVi: 'Đứa con, con nhỏ' });
  assert.equal(readerOk.ok, true);

  const readerSrc = fs.readFileSync(path.join(ROOT, 'src/pages/ReaderPage.jsx'), 'utf8');
  assert.ok(
    readerSrc.includes('buildSafeReaderFlashcard'),
    'ReaderPage.jsx must use buildSafeReaderFlashcard to block junk SRS cards & XP'
  );
});
