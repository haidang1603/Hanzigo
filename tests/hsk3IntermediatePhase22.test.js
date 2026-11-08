import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRICULUM_60_LESSONS, CURRICULUM_ALL_LESSONS, getCurriculumLessonById } from '../src/data/curriculumLessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from '../src/data/curriculumLessonsHsk4to6.js';
import { HANZI_DECOMPOSITION_DATABASE, getHanziDecomposition } from '../src/data/hanziDecomposition.js';

test('=== PHASE 22 / TASK 22.04: HSK 3 INTERMEDIATE EXPANSION TEST SUITE ===', async (t) => {
  const hsk3Lessons = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-3'));

  await t.test('Criterion 1: Exactly 20 HSK 3 lessons from l-301 to l-320', () => {
    assert.equal(hsk3Lessons.length, 20, 'HSK 3 must contain exactly 20 lessons');
    const ids = hsk3Lessons.map(l => l.id);
    for (let i = 301; i <= 320; i++) {
      assert.ok(ids.includes(`l-${i}`), `Lesson l-${i} must exist in HSK 3`);
    }
  });

  await t.test('Criterion 2: All lesson IDs are globally unique', () => {
    const allIds = CURRICULUM_ALL_LESSONS.map(l => l.id);
    const uniqueIds = new Set(allIds);
    assert.equal(uniqueIds.size, allIds.length, 'Every lesson ID across the entire curriculum must be unique');
  });

  await t.test('Criterion 3: Lessons are in strict sequential order from l-301 to l-320', () => {
    const expectedIds = Array.from({ length: 20 }, (_, i) => `l-${301 + i}`);
    const actualIds = hsk3Lessons.map(l => l.id);
    assert.deepEqual(actualIds, expectedIds, 'Lessons must strictly follow sequential order l-301 through l-320');
  });

  await t.test('Criterion 4: Each lesson contains all 9 pedagogical steps', () => {
    hsk3Lessons.forEach((lesson) => {
      const requiredSteps = [
        'step1_learn',
        'step2_vocabulary',
        'step3_hanzi',
        'step4_grammar',
        'step5_listening',
        'step6_speaking',
        'step7_writing',
        'step8_quiz',
        'step9_challenge'
      ];
      requiredSteps.forEach((step) => {
        assert.ok(lesson[step] !== undefined && lesson[step] !== null, `Lesson ${lesson.id} missing ${step}`);
      });
    });
  });

  await t.test('Criterion 5: 100% of vocabulary items have valid Pinyin with tone marks', () => {
    const toneMarkRegex = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/i;
    let totalVocabs = 0;
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        totalVocabs++;
        assert.ok(v.pinyin && typeof v.pinyin === 'string' && v.pinyin.trim().length > 0, `Vocab ${v.id} in ${lesson.id} has invalid pinyin`);
        assert.match(v.pinyin, toneMarkRegex, `Vocab ${v.id} (${v.hanzi}) pinyin "${v.pinyin}" must contain proper tone marks`);
      });
    });
    assert.equal(totalVocabs, 91, 'HSK 3 must contain exactly 91 vocabulary items');
  });

  await t.test('Criterion 6: 100% of vocabulary items have clear Vietnamese meaning', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.meaning && typeof v.meaning === 'string' && v.meaning.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing meaning`);
        assert.ok(!v.meaning.toLowerCase().includes('todo') && !v.meaning.toLowerCase().includes('đang cập nhật'), `Vocab ${v.id} has placeholder meaning`);
      });
    });
  });

  await t.test('Criterion 7: 100% of vocabulary items have accurate Vietnamese POS (Part of Speech)', () => {
    const validPosCategories = [
      'động từ', 'danh từ', 'tính từ', 'phó từ', 'trợ từ', 'liên từ', 
      'giới từ', 'số từ', 'đại từ', 'lượng từ', 'thành ngữ', 'cụm từ', 'động tân', 'thán từ', 'bổ ngữ', 'trạng ngữ', 'định trung'
    ];
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.pos && typeof v.pos === 'string' && v.pos.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing POS`);
        const lowerPos = v.pos.toLowerCase();
        const isMatched = validPosCategories.some(cat => lowerPos.includes(cat));
        assert.ok(isMatched, `Vocab ${v.id} (${v.hanzi}) pos "${v.pos}" is not a recognized Vietnamese POS`);
      });
    });
  });

  await t.test('Criterion 8: 100% of vocabulary items have accurate Han-Viet pronunciation', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.hanviet && typeof v.hanviet === 'string' && v.hanviet.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing Han-Viet`);
      });
    });
  });

  await t.test('Criterion 9: 100% of vocabulary items have valid Kangxi radical information', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.radical && typeof v.radical === 'string' && v.radical.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing radical`);
      });
    });
  });

  await t.test('Criterion 10: Exactly 2 characters in step3_hanzi for every lesson (40 total)', () => {
    let totalHanzi = 0;
    hsk3Lessons.forEach((lesson) => {
      assert.ok(Array.isArray(lesson.step3_hanzi), `Lesson ${lesson.id} step3_hanzi must be an array`);
      assert.equal(lesson.step3_hanzi.length, 2, `Lesson ${lesson.id} step3_hanzi must contain exactly 2 characters`);
      totalHanzi += lesson.step3_hanzi.length;
    });
    assert.equal(totalHanzi, 40, 'Total Step 3 Hanzi in HSK 3 must be 40');
  });

  await t.test('Criterion 11: 100% of Step 3 characters have standardized IDS, structure, and mnemonics', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const char = h.hanzi || h.char;
        assert.ok(char && char.length === 1, `Invalid character in ${lesson.id}: ${char}`);
        assert.ok(h.pinyin && h.pinyin.length > 0, `Missing pinyin for ${char} in ${lesson.id}`);
        assert.ok(h.structure && h.structure.code && h.structure.symbol, `Missing structure object for ${char} in ${lesson.id}`);
        assert.ok(h.ids && typeof h.ids === 'string', `Missing IDS for ${char} in ${lesson.id}`);
        assert.ok(h.radical && (h.radical.char || typeof h.radical === 'string'), `Missing radical for ${char} in ${lesson.id}`);
        assert.ok(h.strokeOrderText && h.strokeOrderText.length > 0, `Missing stroke order description for ${char} in ${lesson.id}`);
        assert.ok(h.mnemonic && h.mnemonic.length > 10, `Missing mnemonic for ${char} in ${lesson.id}`);
      });
    });
  });

  await t.test('Criterion 12: HANZI_DECOMPOSITION_DATABASE contains all 40 HSK 3 characters while preserving HSK 1 and HSK 2', () => {
    // Check all HSK 3 characters
    hsk3Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const char = h.hanzi || h.char;
        const decomp = HANZI_DECOMPOSITION_DATABASE[char];
        assert.ok(decomp, `HANZI_DECOMPOSITION_DATABASE missing entry for HSK 3 character: ${char}`);
        assert.ok(decomp.structure, `Missing structure for ${char}`);
        assert.ok(decomp.ids, `Missing ids for ${char}`);
        assert.ok(Array.isArray(decomp.components) && decomp.components.length > 0, `Missing components for ${char}`);
        assert.ok(decomp.mnemonic && decomp.mnemonic.length > 5, `Missing mnemonic for ${char}`);
      });
    });

    // Verify HSK 1 and HSK 2 characters are preserved
    const sampleHsk1Chars = ['你', '好', '我', '国', '大'];
    sampleHsk1Chars.forEach(c => assert.ok(HANZI_DECOMPOSITION_DATABASE[c], `HSK 1 char ${c} must remain intact`));

    const sampleHsk2Chars = ['买', '问', '近', '远'];
    sampleHsk2Chars.forEach(c => assert.ok(HANZI_DECOMPOSITION_DATABASE[c], `HSK 2 char ${c} must remain intact`));
  });

  await t.test('Criterion 13: Dialogue in Step 5 has at least 4 lines per lesson (total >= 80)', () => {
    let totalLines = 0;
    hsk3Lessons.forEach((lesson) => {
      const dialogue = lesson.step5_listening.dialogue;
      assert.ok(Array.isArray(dialogue), `Dialogue in ${lesson.id} must be an array`);
      assert.ok(dialogue.length >= 4, `Dialogue in ${lesson.id} must have at least 4 lines (found ${dialogue.length})`);
      totalLines += dialogue.length;
    });
    assert.ok(totalLines >= 80, `Total dialogue lines across HSK 3 must be >= 80 (found ${totalLines})`);
  });

  await t.test('Criterion 14: Dialogue alternates between at least 2 roles (A and B)', () => {
    hsk3Lessons.forEach((lesson) => {
      const dialogue = lesson.step5_listening.dialogue;
      const speakers = new Set(dialogue.map(d => d.speaker));
      assert.ok(speakers.size >= 2, `Dialogue in ${lesson.id} must feature at least 2 distinct speakers (found ${speakers.size})`);
      assert.ok(speakers.has('A') && speakers.has('B'), `Dialogue in ${lesson.id} must have speakers A and B`);
    });
  });

  await t.test('Criterion 15: Dialogue content is non-repetitive across lessons', () => {
    const openingLines = hsk3Lessons.map(l => (l.step5_listening.dialogue[0].hanzi || l.step5_listening.dialogue[0].chinese).trim());
    const uniqueOpenings = new Set(openingLines);
    assert.equal(uniqueOpenings.size, openingLines.length, 'Every lesson must have a distinct, unique opening dialogue line');
  });

  await t.test('Criterion 16: Dialogue Pinyin matches Chinese text with valid tone marks', () => {
    const toneMarkRegex = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/i;
    hsk3Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line, idx) => {
        assert.ok(line.pinyin && line.pinyin.trim().length > 0, `Missing pinyin on line ${idx} in ${lesson.id}`);
        assert.match(line.pinyin, toneMarkRegex, `Pinyin on line ${idx} in ${lesson.id} must have proper tone marks`);
      });
    });
  });

  await t.test('Criterion 17: Vietnamese translations in dialogue are non-empty, clear, and natural', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line, idx) => {
        const trans = line.meaning || line.vietnamese;
        assert.ok(trans && trans.trim().length > 3, `Missing or too short Vietnamese translation on line ${idx} in ${lesson.id}`);
      });
    });
  });

  await t.test('Criterion 18: Every lesson has a situational context card', () => {
    hsk3Lessons.forEach((lesson) => {
      const l = lesson.step5_listening;
      const card = l.situationalCard || l;
      assert.ok(card.situation && card.situation.length > 0, `Lesson ${lesson.id} missing situation description`);
      assert.ok(card.context && card.context.length > 0, `Lesson ${lesson.id} missing context`);
      assert.ok(card.participants && card.participants.length > 0, `Lesson ${lesson.id} missing participants`);
      assert.ok(card.targetGoal && card.targetGoal.length > 0, `Lesson ${lesson.id} missing targetGoal`);
    });
  });

  await t.test('Criterion 19: Valid, non-empty audioText containing genuine Chinese sentences', () => {
    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    hsk3Lessons.forEach((lesson) => {
      const audioText = lesson.step5_listening.audioText;
      assert.ok(audioText && audioText.trim().length > 5, `Lesson ${lesson.id} missing or short audioText`);
      assert.match(audioText, chineseCharRegex, `audioText in ${lesson.id} must contain authentic Chinese characters`);
    });
  });

  await t.test('Criterion 20: ZERO fake audio URLs, dummy files, or placeholder links', () => {
    const checkNoFakeUrls = (obj, path = '') => {
      if (!obj) return;
      if (typeof obj === 'string') {
        assert.ok(!obj.includes('.mp3') || !obj.includes('fake') && !obj.includes('dummy'), `Found suspicious fake audio path at ${path}: ${obj}`);
        assert.ok(!obj.includes('placeholder.com'), `Found placeholder URL at ${path}: ${obj}`);
      } else if (typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj)) {
          checkNoFakeUrls(val, `${path}.${key}`);
        }
      }
    };
    hsk3Lessons.forEach((lesson) => checkNoFakeUrls(lesson, lesson.id));
  });

  await t.test('Criterion 21: Listening comprehension exercise has 4 options, valid correctIndex, and explanation', () => {
    hsk3Lessons.forEach((lesson) => {
      const l = lesson.step5_listening;
      assert.ok(l.question && l.question.trim().length > 5, `Lesson ${lesson.id} missing listening question`);
      assert.ok(Array.isArray(l.options), `Lesson ${lesson.id} options must be an array`);
      assert.equal(l.options.length, 4, `Lesson ${lesson.id} must have exactly 4 choices`);
      assert.ok(l.correctIndex >= 0 && l.correctIndex <= 3, `Lesson ${lesson.id} correctIndex must be between 0 and 3`);
      assert.ok(l.explanation && l.explanation.trim().length > 10, `Lesson ${lesson.id} missing comprehensive explanation`);
    });
  });

  await t.test('Criterion 22: Speaking exercise in Step 6 has prompt, targetSentence, targetPinyin, and targetMeaning', () => {
    hsk3Lessons.forEach((lesson) => {
      const s = lesson.step6_speaking;
      assert.ok(s.prompt && s.prompt.trim().length > 0, `Lesson ${lesson.id} missing speaking prompt`);
      assert.ok(s.targetSentence && s.targetSentence.trim().length > 0, `Lesson ${lesson.id} missing targetSentence`);
      assert.ok(s.targetPinyin && s.targetPinyin.trim().length > 0, `Lesson ${lesson.id} missing targetPinyin`);
      assert.ok(s.targetMeaning && s.targetMeaning.trim().length > 0, `Lesson ${lesson.id} missing targetMeaning`);
    });
  });

  await t.test('Criterion 23: Vocabulary data structure is compatible with Flashcard saving', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        // Flashcard system requires hanzi, pinyin, meaning, and optional pos/hanviet/radical
        assert.ok(v.hanzi && v.pinyin && v.meaning, `Vocab ${v.id} incompatible with flashcard storage`);
        const flashcardPayload = {
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaning: v.meaning,
          hanviet: v.hanviet,
          pos: v.pos,
          radical: v.radical
        };
        assert.ok(flashcardPayload.hanzi.length > 0);
      });
    });
  });

  await t.test('Criterion 24: Step 3 characters are compatible with getHanziDecomposition dictionary lookups', () => {
    hsk3Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const char = h.hanzi || h.char;
        const result = getHanziDecomposition(char);
        assert.ok(result, `getHanziDecomposition returned null for ${char}`);
        assert.ok(result.components && result.components.length > 0, `getHanziDecomposition missing components for ${char}`);
      });
    });
  });

  await t.test('Criterion 25: Zero placeholder strings across all 20 HSK 3 lessons', () => {
    const placeholders = ['TODO', 'lorem ipsum', 'đang cập nhật', 'placeholder', 'TBD'];
    const lessonString = JSON.stringify(hsk3Lessons).toLowerCase();
    placeholders.forEach((ph) => {
      assert.ok(!lessonString.includes(ph.toLowerCase()), `Detected placeholder string "${ph}" in HSK 3 lessons`);
    });
  });

  await t.test('Criterion 26: HSK 1 curriculum remains fully intact (20 lessons, 99 vocabs)', () => {
    const hsk1Lessons = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-1'));
    assert.equal(hsk1Lessons.length, 20, 'HSK 1 must have exactly 20 lessons');
    const hsk1VocabCount = hsk1Lessons.reduce((sum, l) => sum + (l.step2_vocabulary || []).length, 0);
    assert.equal(hsk1VocabCount, 99, 'HSK 1 must retain exactly 99 vocabulary items');
  });

  await t.test('Criterion 27: HSK 2 curriculum remains fully intact (20 lessons, 101 vocabs)', () => {
    const hsk2Lessons = CURRICULUM_60_LESSONS.filter(l => l.id.startsWith('l-2'));
    assert.equal(hsk2Lessons.length, 20, 'HSK 2 must have exactly 20 lessons');
    const hsk2VocabCount = hsk2Lessons.reduce((sum, l) => sum + (l.step2_vocabulary || []).length, 0);
    assert.equal(hsk2VocabCount, 101, 'HSK 2 must retain exactly 101 vocabulary items');
  });

  await t.test('Criterion 28: HSK 4–6 curriculum remains fully intact (60 lessons)', () => {
    assert.equal(CURRICULUM_HSK4_6_LESSONS.length, 60, 'HSK 4-6 must have exactly 60 lessons');
    const hsk4 = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-4'));
    const hsk5 = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-5'));
    const hsk6 = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-6'));
    assert.equal(hsk4.length, 20, 'HSK 4 must have 20 lessons');
    assert.equal(hsk5.length, 20, 'HSK 5 must have 20 lessons');
    assert.equal(hsk6.length, 20, 'HSK 6 must have 20 lessons');
  });

  await t.test('Criterion 29: Entire curriculum contains exactly 120 lessons and lookup works', () => {
    assert.equal(CURRICULUM_ALL_LESSONS.length, 120, 'Entire curriculum must contain exactly 120 lessons');
    const testLookup = getCurriculumLessonById('l-305');
    assert.ok(testLookup, 'getCurriculumLessonById must retrieve lesson l-305');
    assert.equal(testLookup.id, 'l-305');
  });

  await t.test('Criterion 30: Zero regressions on overall data integrity', () => {
    // Check that chapters ch-9 to ch-12 are well mapped
    const chapters = new Set(hsk3Lessons.map(l => l.chapterId));
    assert.ok(chapters.has('ch-9') && chapters.has('ch-10') && chapters.has('ch-11') && chapters.has('ch-12'));
    assert.equal(chapters.size, 4, 'HSK 3 must cover exactly chapters ch-9, ch-10, ch-11, ch-12');
  });
});
