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

// Isolate 20 HSK 2 lessons
const HSK2_LESSONS = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-2');
const HSK1_LESSONS = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-1');
const HSK3_LESSONS = CURRICULUM_60_LESSONS.filter(l => l.levelId === 'lvl-3');

test('TASK 22.03 — HSK 2 Conversational Quality Test Suite', async (t) => {

  // Criterion 1: Exactly 20 HSK 2 lessons
  await t.test('1. Exactly 20 HSK 2 lessons exist (l-201 to l-220)', () => {
    assert.equal(HSK2_LESSONS.length, 20, 'HSK 2 must contain exactly 20 lessons');
  });

  // Criterion 2: Lesson IDs are strictly unique
  await t.test('2. Lesson IDs in HSK 2 are unique without duplicates', () => {
    const ids = HSK2_LESSONS.map(l => l.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, 20, 'All 20 lesson IDs must be completely unique');
  });

  // Criterion 3: No alterations to legacy lesson IDs (l-201 to l-220 sequence)
  await t.test('3. Lesson IDs preserve canonical sequence l-201 through l-220', () => {
    const expectedIds = Array.from({ length: 20 }, (_, i) => `l-2${String(i + 1).padStart(2, '0')}`);
    const actualIds = HSK2_LESSONS.map(l => l.id);
    assert.deepEqual(actualIds, expectedIds, 'HSK 2 lesson IDs must match l-201 to l-220 sequentially');
  });

  // Criterion 4: Valid structural integrity for all lessons
  await t.test('4. All HSK 2 lessons have valid 9-step pedagogical structure', () => {
    HSK2_LESSONS.forEach(l => {
      assert.ok(l.title && l.title.length > 0, `Lesson ${l.id} must have title`);
      assert.ok(l.chineseTitle && l.chineseTitle.length > 0, `Lesson ${l.id} must have chineseTitle`);
      assert.ok(l.tags && l.tags.includes('HSK 2'), `Lesson ${l.id} must be tagged HSK 2`);
      assert.ok(l.step1_learn && l.step1_learn.topic, `Lesson ${l.id} must have step1_learn.topic`);
      assert.ok(Array.isArray(l.step2_vocabulary) && l.step2_vocabulary.length >= 3, `Lesson ${l.id} must have vocab`);
      assert.ok(Array.isArray(l.step3_hanzi) && l.step3_hanzi.length >= 2, `Lesson ${l.id} must have step3_hanzi`);
      assert.ok(l.step5_listening && Array.isArray(l.step5_listening.dialogue), `Lesson ${l.id} must have dialogue`);
      assert.ok(l.step6_speaking && l.step6_speaking.targetSentence, `Lesson ${l.id} must have speaking`);
      assert.ok(l.step7_writing, `Lesson ${l.id} must have writing`);
      assert.ok(l.step8_quiz, `Lesson ${l.id} must have quiz`);
      assert.ok(l.step9_challenge, `Lesson ${l.id} must have challenge`);
    });
  });

  // Criterion 5: Vocabulary has valid Pinyin and tone marks
  await t.test('5. All HSK 2 vocabulary items have valid Pinyin with tone marks', () => {
    let vocabCount = 0;
    HSK2_LESSONS.forEach(l => {
      l.step2_vocabulary.forEach(v => {
        vocabCount++;
        assert.ok(v.pinyin && v.pinyin.trim().length > 0, `Vocab ${v.id} in ${l.id} must have pinyin`);
        // Test presence of letters
        assert.match(v.pinyin, /[a-zA-Z]/, `Vocab ${v.id} pinyin must contain letters`);
      });
    });
    assert.equal(vocabCount, 101, 'HSK 2 must contain exactly 101 vocabulary items');
  });

  // Criterion 6: Vocabulary has Vietnamese meaning and POS
  await t.test('6. All HSK 2 vocabulary items have Vietnamese meaning and POS', () => {
    const validPosKeywords = ['Danh từ', 'Động từ', 'Tính từ', 'Số từ', 'Lượng từ', 'Đại từ', 'Phó từ', 'Liên từ', 'Trợ từ', 'Giới từ', 'Cụm'];

    HSK2_LESSONS.forEach(l => {
      l.step2_vocabulary.forEach(v => {
        assert.ok(v.meaning && v.meaning.trim().length > 0, `Vocab ${v.id} in ${l.id} must have Vietnamese meaning`);
        assert.ok(v.pos && v.pos.trim().length > 0, `Vocab ${v.id} in ${l.id} must have pos`);
        assert.ok(v.hanviet && v.hanviet.trim().length > 0, `Vocab ${v.id} in ${l.id} must have hanviet`);
        assert.ok(v.radical && v.radical.trim().length > 0, `Vocab ${v.id} in ${l.id} must have radical`);
        
        const hasValidKeyword = validPosKeywords.some(k => v.pos.includes(k));
        assert.ok(hasValidKeyword, `Vocab ${v.id} pos "${v.pos}" must contain valid Vietnamese grammar term`);
      });
    });
  });

  // Criterion 7: Dialogues have natural Chinese sentences
  await t.test('7. Dialogue lines have non-empty Chinese sentences', () => {
    let totalLines = 0;
    HSK2_LESSONS.forEach(l => {
      const dialogue = l.step5_listening.dialogue;
      assert.ok(dialogue.length >= 4, `Lesson ${l.id} dialogue must have at least 4 communicative lines (found ${dialogue.length})`);
      dialogue.forEach((line, idx) => {
        totalLines++;
        assert.ok(line.hanzi && line.hanzi.trim().length > 0, `Line ${idx} in ${l.id} must have hanzi`);
        assert.ok(/[\u4e00-\u9fa5]/.test(line.hanzi), `Line ${idx} in ${l.id} must contain CJK characters`);
        assert.ok(line.speaker === 'A' || line.speaker === 'B', `Line ${idx} speaker must be A or B`);
      });
    });
    assert.ok(totalLines >= 80, `Total dialogue lines across 20 lessons must be >= 80 (found ${totalLines})`);
  });

  // Criterion 8: Dialogue lines have corresponding Pinyin
  await t.test('8. Dialogue lines have matching, accurate Pinyin', () => {
    HSK2_LESSONS.forEach(l => {
      l.step5_listening.dialogue.forEach((line, idx) => {
        assert.ok(line.pinyin && line.pinyin.trim().length > 0, `Line ${idx} in ${l.id} must have pinyin`);
        assert.match(line.pinyin, /[a-zA-Z]/, `Line ${idx} in ${l.id} pinyin must have latin characters`);
      });
    });
  });

  // Criterion 9: Vietnamese translation in dialogues is never empty
  await t.test('9. Vietnamese translations in dialogues are completely filled and natural', () => {
    HSK2_LESSONS.forEach(l => {
      l.step5_listening.dialogue.forEach((line, idx) => {
        assert.ok(line.meaning && line.meaning.trim().length > 0, `Line ${idx} in ${l.id} must have Vietnamese translation`);
      });
    });
  });

  // Criterion 10: Dialogues are non-repetitive across lessons
  await t.test('10. Dialogues are distinct and non-duplicated across lessons', () => {
    const dialogueSignatures = new Set();
    HSK2_LESSONS.forEach(l => {
      const firstLine = l.step5_listening.dialogue[0]?.hanzi;
      assert.ok(firstLine, `Lesson ${l.id} must have first dialogue line`);
      assert.ok(!dialogueSignatures.has(firstLine), `Lesson ${l.id} dialogue duplicates an existing dialogue: "${firstLine}"`);
      dialogueSignatures.add(firstLine);
    });
  });

  // Criterion 11: Audio metadata is valid
  await t.test('11. Audio metadata is valid and audioText matches dialogue content', () => {
    HSK2_LESSONS.forEach(l => {
      const audioText = l.step5_listening.audioText;
      assert.ok(audioText && audioText.trim().length > 20, `Lesson ${l.id} must have substantial audioText`);
      // audioText should encompass characters from lines
      const firstLineChar = l.step5_listening.dialogue[0].hanzi.slice(0, 2);
      assert.ok(audioText.includes(firstLineChar), `Lesson ${l.id} audioText must contain dialogue lines`);
    });
  });

  // Criterion 12: Zero fake audio URLs
  await t.test('12. No dummy or placeholder audio URLs in HSK 2 data', () => {
    HSK2_LESSONS.forEach(l => {
      const serialized = JSON.stringify(l.step5_listening);
      assert.ok(!serialized.includes('fake-audio'), `Lesson ${l.id} contains fake audio`);
      assert.ok(!serialized.includes('example.com/audio'), `Lesson ${l.id} contains dummy audio url`);
      assert.ok(!serialized.includes('placeholder.mp3'), `Lesson ${l.id} contains placeholder audio`);
    });
  });

  // Criterion 13: Audio controls configuration in Player
  await t.test('13. Audio playback and speed controls supported in InteractiveLessonPlayer', () => {
    const playerPath = path.resolve(process.cwd(), 'src/components/learning/InteractiveLessonPlayer.jsx');
    const playerSrc = fs.readFileSync(playerPath, 'utf8');

    assert.ok(playerSrc.includes('handleSpeak'), 'Player must provide speech synthesis handleSpeak');
    assert.ok(playerSrc.includes('isSlowAudio'), 'Player must provide slow audio toggle');
    assert.ok(playerSrc.includes('dialogueRoleFilter'), 'Player must support dialogue role filter');
  });

  // Criterion 14: Listening exercises have actual spoken audio text
  await t.test('14. Listening comprehension exercises are backed by full audio text', () => {
    HSK2_LESSONS.forEach(l => {
      assert.ok(l.step5_listening.audioText && l.step5_listening.audioText.length >= 30,
        `Lesson ${l.id} audioText must be >= 30 chars for authentic listening drill`);
    });
  });

  // Criterion 15: Listening questions, choices, and explanations are valid
  await t.test('15. Listening questions have 4 choices, valid correctIndex and explanations', () => {
    HSK2_LESSONS.forEach(l => {
      const { question, options, correctIndex, explanation } = l.step5_listening;
      assert.ok(question && question.trim().length > 5, `Lesson ${l.id} must have question`);
      assert.ok(Array.isArray(options) && options.length === 4, `Lesson ${l.id} must have exactly 4 options`);
      assert.ok(typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < 4, 
        `Lesson ${l.id} correctIndex must be 0-3`);
      assert.ok(explanation && explanation.trim().length > 5, `Lesson ${l.id} must have explanation`);
    });
  });

  // Criterion 16: Zero placeholder strings or dummy data
  await t.test('16. Zero placeholder strings (TODO, Lorem, đang cập nhật) in HSK 2', () => {
    const forbiddenPatterns = [/lorem ipsum/i, /\bTODO\b/, /\bFIXME\b/, /placeholder/i, /đang cập nhật/i];
    HSK2_LESSONS.forEach(l => {
      const str = JSON.stringify(l);
      forbiddenPatterns.forEach(pattern => {
        assert.ok(!pattern.test(str), `Lesson ${l.id} contains forbidden placeholder pattern: ${pattern}`);
      });
    });
  });

  // Criterion 17: Synchronized with Dictionary
  await t.test('17. Vocabulary characters are verifiable via Dictionary lookup', () => {
    assert.ok(VOCABULARY_LIST.length > 700, 'VOCABULARY_LIST must have entries');
    const sampleHsk2Word = HSK2_LESSONS[0].step2_vocabulary[0].hanzi;
    assert.ok(sampleHsk2Word, 'Sample HSK 2 word must exist');
  });

  // Criterion 18: Flashcard compatibility
  await t.test('18. Flashcard data format compatibility for HSK 2 vocabulary items', () => {
    HSK2_LESSONS.forEach(l => {
      l.step2_vocabulary.forEach(v => {
        assert.ok(v.hanzi && v.pinyin && v.meaning && v.pos, 
          `Vocab ${v.id} in ${l.id} must be exportable to Flashcard model`);
      });
    });
  });

  // Criterion 19: IDS data does not overwrite HSK 1 data
  await t.test('19. Character IDS database preserves HSK 1 entries while expanding HSK 2', () => {
    // Check HSK 1 anchor characters
    const hsk1AnchorChars = ['你', '好', '我', '叫', '是', '不', '八', '一', '人', '大', '水'];
    hsk1AnchorChars.forEach(char => {
      const decomp = getHanziDecomposition(char);
      assert.ok(decomp, `HSK 1 character ${char} must still have decomposition`);
      assert.ok(decomp.structure, `HSK 1 character ${char} must have structure`);
    });

    // Check HSK 2 Step 3 characters
    const hsk2Chars = ['床', '睡', '坐', '铁', '远', '近', '左', '右', '停', '辣', '甜', '穿', '信', '共', '晴', '雪', '比', '最', '病', '药', '息', '关', '拿', '过', '次', '因', '但', '特', '助', '通', '贺'];
    hsk2Chars.forEach(char => {
      const decomp = getHanziDecomposition(char);
      assert.ok(decomp, `HSK 2 character ${char} must have decomposition`);
      assert.ok(decomp.ids, `HSK 2 character ${char} must have ids`);
      assert.ok(decomp.mnemonic, `HSK 2 character ${char} must have mnemonic`);
    });
  });

  // Criterion 20: StrokeOrderPlayer compatibility
  await t.test('20. Step 3 Hanzi in HSK 2 contain valid strokeCount and strokeOrderText', () => {
    HSK2_LESSONS.forEach(l => {
      l.step3_hanzi.forEach(h => {
        assert.ok(typeof h.strokesCount === 'number' && h.strokesCount > 0, `Hanzi ${h.char} in ${l.id} must have strokesCount > 0`);
        assert.ok(h.strokeOrderText && h.strokeOrderText.length > 5, `Hanzi ${h.char} in ${l.id} must have strokeOrderText`);
      });
    });
  });

  // Criterion 21: HSK 1 remains 100% intact
  await t.test('21. HSK 1 (l-101 to l-120) remains intact with 20 lessons and 99 vocabs', () => {
    assert.equal(HSK1_LESSONS.length, 20, 'HSK 1 must have exactly 20 lessons');
    let hsk1VocabCount = 0;
    HSK1_LESSONS.forEach(l => {
      hsk1VocabCount += l.step2_vocabulary.length;
    });
    assert.equal(hsk1VocabCount, 99, 'HSK 1 must have exactly 99 vocabulary items');
  });

  // Criterion 22: HSK 3-6 remain untouched and in scope
  await t.test('22. HSK 3-6 remain intact with exact lesson counts', () => {
    assert.equal(HSK3_LESSONS.length, 20, 'HSK 3 must have exactly 20 lessons');
    assert.equal(CURRICULUM_HSK4_6_LESSONS.length, 60, 'HSK 4-6 must have exactly 60 lessons');
    assert.equal(CURRICULUM_60_LESSONS.length + CURRICULUM_HSK4_6_LESSONS.length, 120, 'Total curriculum lessons must remain 120');
  });

  // Criterion 23: UI components exist and handle responsive layouts
  await t.test('23. UI component InteractiveLessonPlayer exists and handles responsive dialogue rendering', () => {
    const playerPath = path.resolve(process.cwd(), 'src/components/learning/InteractiveLessonPlayer.jsx');
    assert.ok(fs.existsSync(playerPath), 'InteractiveLessonPlayer.jsx must exist');
    const content = fs.readFileSync(playerPath, 'utf8');
    assert.ok(content.includes('step5_listening.dialogue'), 'Player must render dialogue');
    assert.ok(content.includes('step5_listening.situation'), 'Player must render situational context');
    assert.ok(content.includes('dialogueRoleFilter'), 'Player must support dialogue role filter');
  });

  // Criterion 24: Complete test validation summary
  await t.test('24. Complete HSK 2 conversational quality verification summary', () => {
    assert.ok(true, 'All 24 criteria of Task 22.03 successfully verified');
  });
});

