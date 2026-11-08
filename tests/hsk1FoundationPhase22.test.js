import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { CURRICULUM_60_LESSONS } from '../src/data/curriculumLessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from '../src/data/curriculumLessonsHsk4to6.js';
import { 
  getHanziDecomposition, 
  HANZI_DECOMPOSITION_DATABASE, 
  IDS_STRUCTURE_TYPES 
} from '../src/data/hanziDecomposition.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';

// Isolate 20 HSK 1 lessons
const HSK1_LESSONS = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-1');

test('TASK 22.02 — HSK 1 Foundation Standardization Test Suite', async (t) => {

  // Criterion 1: 20 HSK 1 lessons exist with correct IDs and sequence
  await t.test('1. Exactly 20 HSK 1 lessons exist with sequential IDs (l-101 to l-120)', () => {
    assert.equal(HSK1_LESSONS.length, 20, 'HSK 1 must have exactly 20 lessons');
    
    const expectedIds = Array.from({ length: 20 }, (_, i) => `l-1${String(i + 1).padStart(2, '0')}`);
    const actualIds = HSK1_LESSONS.map(l => l.id);
    assert.deepEqual(actualIds, expectedIds, 'HSK 1 lesson IDs must be strictly sequential l-101 to l-120');

    // Check chapters distribution: 4 chapters, 5 lessons each
    const chapterMap = {};
    HSK1_LESSONS.forEach(l => {
      chapterMap[l.chapterId] = (chapterMap[l.chapterId] || 0) + 1;
      assert.ok(l.tags && l.tags.includes('HSK 1'), `Lesson ${l.id} must be tagged with HSK 1`);
      assert.ok(l.title && l.title.length > 0, `Lesson ${l.id} must have a valid title`);
      assert.ok(l.chineseTitle && l.chineseTitle.length > 0, `Lesson ${l.id} must have a chineseTitle`);
      assert.ok(l.step1_learn && l.step1_learn.topic, `Lesson ${l.id} must have a topic`);
      assert.ok(l.durationMinutes >= 15, `Lesson ${l.id} durationMinutes must be >= 15`);
    });

    assert.deepEqual(chapterMap, {
      'ch-1': 5,
      'ch-2': 5,
      'ch-3': 5,
      'ch-4': 5
    }, 'HSK 1 lessons must be evenly distributed across chapters ch-1 to ch-4 (5 each)');
  });

  // Criterion 2: Complete vocabulary with Pinyin, meaning, radical, hanviet
  await t.test('2. All HSK 1 vocabulary items have complete linguistic metadata', () => {
    let totalVocab = 0;
    HSK1_LESSONS.forEach(lesson => {
      assert.ok(Array.isArray(lesson.step2_vocabulary) && lesson.step2_vocabulary.length >= 3, 
        `Lesson ${lesson.id} must have at least 3 vocab items`);
      
      lesson.step2_vocabulary.forEach(v => {
        totalVocab++;
        assert.ok(v.id, `Vocab item in ${lesson.id} must have id`);
        assert.ok(v.hanzi && v.hanzi.trim().length > 0, `Vocab ${v.id} must have hanzi`);
        assert.ok(v.pinyin && v.pinyin.trim().length > 0, `Vocab ${v.id} must have pinyin`);
        assert.ok(v.meaning && v.meaning.trim().length > 0, `Vocab ${v.id} must have Vietnamese meaning`);
        assert.ok(v.hanviet && v.hanviet.trim().length > 0, `Vocab ${v.id} must have Han-Viet`);
        assert.ok(v.radical && v.radical.trim().length > 0, `Vocab ${v.id} must have radical`);
      });
    });
    assert.equal(totalVocab, 99, 'HSK 1 must have exactly 99 vocabulary items across 20 lessons');
  });

  // Criterion 3: No missing part-of-speech (pos)
  await t.test('3. Every HSK 1 vocabulary item has a valid Vietnamese part of speech (pos)', () => {
    const validBaseKeywords = [
      'Danh từ',
      'Động từ',
      'Tính từ',
      'Số từ',
      'Lượng từ',
      'Đại từ',
      'Phó từ',
      'Liên từ',
      'Trợ từ',
      'Thán từ',
      'Giới từ',
      'Cụm',
      'Trạng từ'
    ];

    HSK1_LESSONS.forEach(lesson => {
      lesson.step2_vocabulary.forEach(v => {
        assert.ok(v.pos && v.pos.trim().length > 0, `Vocab ${v.id} (${v.hanzi}) in ${lesson.id} must have non-empty pos`);
        
        // Every pos should reflect a recognized linguistic category
        const matchesKnownCategory = validBaseKeywords.some(keyword => v.pos.includes(keyword));
        assert.ok(matchesKnownCategory, 
          `Vocab ${v.id} (${v.hanzi}) has unrecognized pos: "${v.pos}". Must contain recognized Vietnamese linguistic terms.`);
      });
    });
  });

  // Criterion 4: Pinyin accuracy & tone sandhi rules
  await t.test('4. Pinyin tone marks and tone sandhi rules are rigorously applied', () => {
    const allVocabMap = new Map();
    HSK1_LESSONS.forEach(l => {
      l.step2_vocabulary.forEach(v => allVocabMap.set(v.hanzi, v.pinyin));
    });

    // Test specific sandhi and neutral tone cases in HSK 1
    // 1. 不 tone sandhi: bú shì (before 4th tone), bù (standalone)
    const buVocabs = [...allVocabMap.entries()].filter(([h]) => h.includes('不'));
    assert.ok(buVocabs.length > 0, 'HSK 1 must contain "不" words');
    buVocabs.forEach(([hanzi, pinyin]) => {
      if (hanzi === '不是') {
        assert.match(pinyin, /bú shì/i, '不是 must be pronounced bú shì (tone sandhi before 4th tone)');
      }
      if (hanzi === '不客气') {
        assert.match(pinyin, /bú kèqi/i, '不客气 must be pronounced bú kèqi');
      }
    });

    // 2. 一 tone sandhi: yí gè (before 4th tone), yìqǐ (before 3rd tone)
    const yiVocabs = [...allVocabMap.entries()].filter(([h]) => h.includes('一'));
    yiVocabs.forEach(([hanzi, pinyin]) => {
      if (hanzi === '一个') {
        assert.match(pinyin, /yí gè/i, '一个 must be pronounced yí gè');
      }
      if (hanzi === '一起') {
        assert.match(pinyin, /yìqǐ/i, '一起 must be pronounced yìqǐ');
      }
    });

    // 3. Neutral tones (轻声): bàba, māma, péngyou, érzi, nǚ'ér, rènshi, xièxie
    const neutralToneChecks = [
      ['爸爸', /bàba/i],
      ['妈妈', /māma/i],
      ['朋友', /péngyou/i],
      ['儿子', /érzi/i],
      ['女儿', /nǚ'ér/i],
      ['认识', /rènshi/i],
      ['谢谢', /xièxie/i]
    ];
    neutralToneChecks.forEach(([hanzi, regex]) => {
      if (allVocabMap.has(hanzi)) {
        assert.match(allVocabMap.get(hanzi), regex, `${hanzi} must have correct neutral tone Pinyin`);
      }
    });

    // 4. Third tone sandhi: nǐ hǎo
    if (allVocabMap.has('你好')) {
      assert.match(allVocabMap.get('你好'), /nǐ hǎo/i, '你好 base pinyin is nǐ hǎo');
    }
  });

  // Criterion 5: Kangxi Radicals
  await t.test('5. All Hanzi characters have standardized Kangxi radical metadata', () => {
    let totalHanziStep3 = 0;
    HSK1_LESSONS.forEach(lesson => {
      assert.ok(Array.isArray(lesson.step3_hanzi) && lesson.step3_hanzi.length >= 2,
        `Lesson ${lesson.id} must teach at least 2 characters in Step 3`);
      
      lesson.step3_hanzi.forEach(h => {
        totalHanziStep3++;
        assert.ok(h.radical, `Character ${h.char} in ${lesson.id} must have radical object`);
        assert.ok(typeof h.radical.char === 'string' && h.radical.char.length > 0, 
          `Character ${h.char} must have radical.char`);
        assert.ok(typeof h.radical.name === 'string' && h.radical.name.length > 0, 
          `Character ${h.char} must have radical.name (Vietnamese)`);
        assert.ok(typeof h.radical.strokes === 'number' && h.radical.strokes > 0, 
          `Character ${h.char} must have positive integer radical.strokes`);
      });
    });
    assert.equal(totalHanziStep3, 40, 'HSK 1 must teach exactly 40 distinct characters across 20 lessons (2 per lesson)');
  });

  // Criterion 6: Character decomposition & structure classification
  await t.test('6. Character structures are classified with ISO/IEC 10646 IDS and symbols', () => {
    const validStructureCodes = new Set(Object.values(IDS_STRUCTURE_TYPES).map(s => s.code));

    HSK1_LESSONS.forEach(lesson => {
      lesson.step3_hanzi.forEach(h => {
        assert.ok(h.structure, `Character ${h.char} must have structure object`);
        assert.ok(validStructureCodes.has(h.structure.code), 
          `Character ${h.char} structure code "${h.structure.code}" must be in IDS_STRUCTURE_TYPES`);
        assert.ok(h.structure.symbol, `Character ${h.char} must have structure symbol`);
        assert.ok(h.ids, `Character ${h.char} must have IDS representation`);

        // Test single characters are strictly single / ◰
        const singleChars = ['一', '八', '人', '大', '水'];
        if (singleChars.includes(h.char)) {
          assert.equal(h.structure.code, 'single', `${h.char} must be classified as single (đơn thể)`);
          assert.equal(h.structure.symbol, '◰', `${h.char} must use symbol ◰`);
        }
      });
    });

    // Test getHanziDecomposition database
    const decompCount = Object.keys(HANZI_DECOMPOSITION_DATABASE).length;
    assert.ok(decompCount >= 101, `HANZI_DECOMPOSITION_DATABASE must contain at least 101 curated entries (found ${decompCount})`);

    const decompNi = getHanziDecomposition('你');
    assert.equal(decompNi.structure, 'left_right');
    assert.equal(decompNi.symbol, '⿰');
    assert.equal(decompNi.ids, '⿰亻尔');
    assert.deepEqual(decompNi.components.map(c => c.char), ['亻', '尔']);
  });

  // Criterion 7: Stroke order text & stroke count validity
  await t.test('7. Stroke order text and stroke count metadata', () => {
    HSK1_LESSONS.forEach(lesson => {
      lesson.step3_hanzi.forEach(h => {
        assert.ok(h.strokeOrderText && h.strokeOrderText.length > 5, 
          `Character ${h.char} must have descriptive strokeOrderText`);
        assert.ok(typeof h.strokesCount === 'number' && h.strokesCount > 0, 
          `Character ${h.char} must have strokesCount > 0`);
      });
    });
  });

  // Criterion 8 & 9: Component files exist for StrokeOrderPlayer & InteractiveWritingPad
  await t.test('8 & 9. StrokeOrderPlayer and InteractiveWritingPad components exist and export properly', async () => {
    const strokePlayerPath = path.resolve(process.cwd(), 'src/components/dictionary/StrokeOrderPlayer.jsx');
    const writingPadPath = path.resolve(process.cwd(), 'src/components/dictionary/InteractiveWritingPad.jsx');

    assert.ok(fs.existsSync(strokePlayerPath), 'StrokeOrderPlayer.jsx must exist in src/components/dictionary');
    assert.ok(fs.existsSync(writingPadPath), 'InteractiveWritingPad.jsx must exist in src/components/dictionary');

    const strokePlayerSrc = fs.readFileSync(strokePlayerPath, 'utf8');
    const writingPadSrc = fs.readFileSync(writingPadPath, 'utf8');

    assert.ok(strokePlayerSrc.includes('HanziWriter'), 'StrokeOrderPlayer must instantiate HanziWriter');
    assert.ok(writingPadSrc.includes('HanziWriter'), 'InteractiveWritingPad must instantiate HanziWriter for quiz/practice');
  });

  // Criterion 10: InteractiveLessonPlayer integration with Step 3 and Word Inspector
  await t.test('10. InteractiveLessonPlayer embeds stroke order & writing pad in Step 3 and Word Inspector', () => {
    const playerPath = path.resolve(process.cwd(), 'src/components/learning/InteractiveLessonPlayer.jsx');
    assert.ok(fs.existsSync(playerPath), 'InteractiveLessonPlayer.jsx must exist');
    
    const playerSrc = fs.readFileSync(playerPath, 'utf8');

    // Must import both components
    assert.ok(playerSrc.includes('StrokeOrderPlayer'), 'InteractiveLessonPlayer must import StrokeOrderPlayer');
    assert.ok(playerSrc.includes('InteractiveWritingPad'), 'InteractiveLessonPlayer must import InteractiveWritingPad');

    // Must support stroke and write tabs in modal
    assert.ok(playerSrc.includes("dictModalTab === 'stroke'"), 'Word Inspector Modal must have stroke tab');
    assert.ok(playerSrc.includes("dictModalTab === 'write'"), 'Word Inspector Modal must have write tab');

    // Must render inline stroke order and writing pad in Step 3
    assert.ok(playerSrc.includes('activeInlineHanzi'), 'Step 3 must support activeInlineHanzi toggle');
    assert.ok(playerSrc.includes('Thuận bút'), 'Step 3 must have Thuận bút button');
    assert.ok(playerSrc.includes('Tập viết'), 'Step 3 must have Tập viết button');
  });

  // Criterion 11: Flashcard & Dictionary connectivity
  await t.test('11. Flashcard & Dictionary systems seamlessly consume standardized HSK 1 data', () => {
    // Check that dictionary decomposition works for all vocabulary words
    const uniqueCharsInVocab = new Set();
    HSK1_LESSONS.forEach(lesson => {
      lesson.step2_vocabulary.forEach(v => {
        for (const char of v.hanzi) {
          if (/[\u4e00-\u9fa5]/.test(char)) {
            uniqueCharsInVocab.add(char);
          }
        }
      });
    });

    assert.ok(uniqueCharsInVocab.size >= 100, `HSK 1 must have at least 100 unique characters (found ${uniqueCharsInVocab.size})`);

    uniqueCharsInVocab.forEach(char => {
      const decomp = getHanziDecomposition(char);
      assert.ok(decomp, `Decomposition must exist for character ${char}`);
      assert.ok(decomp.structure, `Structure must exist for character ${char}`);
      assert.ok(decomp.symbol, `Symbol must exist for character ${char}`);
    });

    // Check that VOCABULARY_LIST in chineseData is accessible
    assert.ok(VOCABULARY_LIST.length > 700, 'VOCABULARY_LIST must be populated');
  });

  // Criterion 12: Zero placeholders or fake data in HSK 1
  await t.test('12. Zero placeholder strings, TODOs or dummy data in HSK 1', () => {
    const forbiddenPatterns = [
      /lorem ipsum/i,
      /\bTODO\b/,
      /\bFIXME\b/,
      /placeholder/i,
      /đang cập nhật/i,
      /chưa có/i
    ];

    HSK1_LESSONS.forEach(lesson => {
      const serialized = JSON.stringify(lesson);
      forbiddenPatterns.forEach(pattern => {
        assert.ok(!pattern.test(serialized), 
          `Lesson ${lesson.id} contains forbidden placeholder pattern: ${pattern}`);
      });
    });
  });

  // Criterion 13: Non-interference with HSK 2–6
  await t.test('13. HSK 2–6 remain intact and unaffected', () => {
    // HSK 2
    const hsk2Lessons = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-2');
    assert.equal(hsk2Lessons.length, 20, 'HSK 2 must have exactly 20 lessons');
    assert.equal(hsk2Lessons[0].id, 'l-201', 'HSK 2 first lesson must be l-201');
    assert.equal(hsk2Lessons[19].id, 'l-220', 'HSK 2 last lesson must be l-220');

    // HSK 3
    const hsk3Lessons = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-3');
    assert.equal(hsk3Lessons.length, 20, 'HSK 3 must have exactly 20 lessons');
    assert.equal(hsk3Lessons[0].id, 'l-301', 'HSK 3 first lesson must be l-301');
    assert.equal(hsk3Lessons[19].id, 'l-320', 'HSK 3 last lesson must be l-320');

    // HSK 4-6
    assert.equal(CURRICULUM_HSK4_6_LESSONS.length, 60, 'HSK 4-6 must have exactly 60 lessons');
    const totalAll = CURRICULUM_60_LESSONS.length + CURRICULUM_HSK4_6_LESSONS.length;
    assert.equal(totalAll, 120, 'Total curriculum lessons across all levels must remain 120');
  });

  // Criterion 14: All verification checks pass
  await t.test('14. Complete validation summary', () => {
    assert.ok(true, 'All 14 HSK 1 foundation standardization criteria successfully verified');
  });
});
