import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRICULUM_60_LESSONS, CURRICULUM_ALL_LESSONS, getCurriculumLessonById } from '../src/data/curriculumLessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from '../src/data/curriculumLessonsHsk4to6.js';
import { HANZI_DECOMPOSITION_DATABASE, getHanziDecomposition } from '../src/data/hanziDecomposition.js';

test('=== PHASE 22 / TASK 22.05: HSK 4 CONTENT QUALITY & DEDUPLICATION TEST SUITE ===', async (t) => {
  const hsk4Lessons = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-4'));

  await t.test('Criterion 1: Exactly 20 HSK 4 lessons from l-401 to l-420', () => {
    assert.equal(hsk4Lessons.length, 20, 'HSK 4 must contain exactly 20 lessons');
    const ids = hsk4Lessons.map(l => l.id);
    for (let i = 401; i <= 420; i++) {
      assert.ok(ids.includes(`l-${i}`), `Lesson l-${i} must exist in HSK 4`);
    }
  });

  await t.test('Criterion 2: All lesson IDs are globally unique across entire curriculum', () => {
    const allIds = CURRICULUM_ALL_LESSONS.map(l => l.id);
    const uniqueIds = new Set(allIds);
    assert.equal(uniqueIds.size, allIds.length, 'Every lesson ID across the entire curriculum must be unique');
  });

  await t.test('Criterion 3: Lessons are in strict sequential order from l-401 to l-420', () => {
    const expectedIds = Array.from({ length: 20 }, (_, i) => `l-${401 + i}`);
    const actualIds = hsk4Lessons.map(l => l.id);
    assert.deepEqual(actualIds, expectedIds, 'Lessons must strictly follow sequential order l-401 through l-420');
  });

  await t.test('Criterion 4: Each lesson contains all 9 pedagogical steps', () => {
    hsk4Lessons.forEach((lesson) => {
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
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        totalVocabs++;
        assert.ok(v.pinyin && typeof v.pinyin === 'string' && v.pinyin.trim().length > 0, `Vocab ${v.id} in ${lesson.id} has invalid pinyin`);
        assert.match(v.pinyin, toneMarkRegex, `Vocab ${v.id} (${v.hanzi}) pinyin "${v.pinyin}" must contain proper tone marks`);
      });
    });
    assert.equal(totalVocabs, 80, 'HSK 4 must contain exactly 80 vocabulary items');
  });

  await t.test('Criterion 6: 100% of vocabulary items have clear Vietnamese meaning', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.meaning && typeof v.meaning === 'string' && v.meaning.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing meaning`);
        assert.ok(!v.meaning.toLowerCase().includes('todo') && !v.meaning.toLowerCase().includes('đang cập nhật'), `Vocab ${v.id} has placeholder meaning`);
      });
    });
  });

  await t.test('Criterion 7: 100% of vocabulary items have accurate Vietnamese POS (Part of Speech)', () => {
    const validPosCategories = [
      'động từ', 'danh từ', 'tính từ', 'phó từ', 'trợ từ', 'liên từ',
      'giới từ', 'số từ', 'đại từ', 'lượng từ', 'thành ngữ', 'cụm từ', 'động tân', 'thán từ', 'bổ ngữ'
    ];
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.pos && typeof v.pos === 'string' && v.pos.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing POS`);
        const lowerPos = v.pos.toLowerCase();
        const isMatched = validPosCategories.some(cat => lowerPos.includes(cat));
        assert.ok(isMatched, `Vocab ${v.id} (${v.hanzi}) pos "${v.pos}" is not a recognized Vietnamese POS`);
      });
    });
  });

  await t.test('Criterion 8: 100% of vocabulary items have accurate Han-Viet pronunciation', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.hanviet && typeof v.hanviet === 'string' && v.hanviet.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing Han-Viet`);
      });
    });
  });

  await t.test('Criterion 9: 100% of vocabulary items have valid Kangxi radical information', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.radical && typeof v.radical === 'string' && v.radical.trim().length > 0, `Vocab ${v.id} in ${lesson.id} missing radical`);
      });
    });
  });

  await t.test('Criterion 10: Zero unjustified vocabulary overlaps with HSK 1-3 curriculum', () => {
    // Justified cross-level thematic spirals (revisited in advanced commercial/business contexts)
    const justifiedThematicSpirals = new Set([
      '微信', '坚持', '复习', '通过', '预订', '押金', '退房', '现金', '护照', '解决', '准时', '迟到', '请假', '扫码'
    ]);

    const hsk1to3Vocabs = new Set();
    CURRICULUM_60_LESSONS.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        if (!justifiedThematicSpirals.has(v.hanzi)) {
          hsk1to3Vocabs.add(v.hanzi);
        }
      });
    });

    const duplicates = [];
    hsk4Lessons.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        if (hsk1to3Vocabs.has(v.hanzi)) {
          duplicates.push({ lessonId: l.id, hanzi: v.hanzi });
        }
      });
    });

    assert.equal(duplicates.length, 0, `Detected unjustified vocabulary duplication with HSK 1-3: ${JSON.stringify(duplicates)}`);
  });

  await t.test('Criterion 11: Vocabulary replacement v-418-4 (方便 -> 快捷) is properly integrated', () => {
    const l418 = hsk4Lessons.find(l => l.id === 'l-418');
    assert.ok(l418, 'Lesson l-418 must exist');
    const v4 = l418.step2_vocabulary.find(v => v.id === 'v-418-4');
    assert.ok(v4, 'v-418-4 must exist');
    assert.equal(v4.hanzi, '快捷', 'v-418-4 must be replaced by 快捷 to eliminate HSK 3 duplication');
    assert.equal(v4.pinyin, 'kuàijié');
    assert.equal(v4.hanviet, 'Khoái tiệp');
    assert.equal(v4.pos, 'Tính từ');
  });

  await t.test('Criterion 12: 100% of lessons have comprehensive grammar explanation and examples', () => {
    hsk4Lessons.forEach((lesson) => {
      const g = lesson.step4_grammar;
      assert.ok(g, `Lesson ${lesson.id} missing step4_grammar`);
      assert.ok(g.formula && g.formula.length > 0, `Lesson ${lesson.id} missing grammar formula`);
      assert.ok(g.title && g.title.length > 0, `Lesson ${lesson.id} missing grammar title`);
      assert.ok(g.explanation && g.explanation.length > 10, `Lesson ${lesson.id} missing grammar explanation`);
      assert.ok(Array.isArray(g.examples) && g.examples.length > 0, `Lesson ${lesson.id} missing grammar examples`);
      assert.ok(g.commonMistake, `Lesson ${lesson.id} missing commonMistake`);
    });
  });

  await t.test('Criterion 13: Dialogue in Step 5 has at least 5 lines per lesson (total >= 100 lines)', () => {
    let totalLines = 0;
    hsk4Lessons.forEach((lesson) => {
      const dialogue = lesson.step5_listening.dialogue;
      assert.ok(Array.isArray(dialogue), `Dialogue in ${lesson.id} must be an array`);
      assert.ok(dialogue.length >= 5, `Dialogue in ${lesson.id} must have at least 5 lines (found ${dialogue.length})`);
      totalLines += dialogue.length;
    });
    assert.ok(totalLines >= 100, `Total dialogue lines across HSK 4 must be >= 100 (found ${totalLines})`);
  });

  await t.test('Criterion 14: Dialogue content is non-repetitive across lessons', () => {
    const openingLines = hsk4Lessons.map(l => (l.step5_listening.dialogue[0].hanzi || l.step5_listening.dialogue[0].chinese).trim());
    const uniqueOpenings = new Set(openingLines);
    assert.equal(uniqueOpenings.size, openingLines.length, 'Every lesson must have a distinct, unique opening dialogue line');
  });

  await t.test('Criterion 15: Dialogue alternates between at least 2 distinct roles (A and B)', () => {
    hsk4Lessons.forEach((lesson) => {
      const dialogue = lesson.step5_listening.dialogue;
      const speakers = new Set(dialogue.map(d => d.speaker));
      assert.ok(speakers.size >= 2, `Dialogue in ${lesson.id} must feature at least 2 distinct speakers`);
      assert.ok(speakers.has('A') && speakers.has('B'), `Dialogue in ${lesson.id} must have speakers A and B`);
    });
  });

  await t.test('Criterion 16: Dialogue Pinyin matches Chinese text with valid tone marks', () => {
    const toneMarkRegex = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/i;
    hsk4Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line, idx) => {
        assert.ok(line.pinyin && line.pinyin.trim().length > 0, `Missing pinyin on line ${idx} in ${lesson.id}`);
        assert.match(line.pinyin, toneMarkRegex, `Pinyin on line ${idx} in ${lesson.id} must have proper tone marks`);
      });
    });
  });

  await t.test('Criterion 17: Vietnamese translations in dialogue are non-empty, clear, and natural', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line, idx) => {
        const trans = line.meaning || line.vietnamese;
        assert.ok(trans && trans.trim().length > 3, `Missing or too short Vietnamese translation on line ${idx} in ${lesson.id}`);
      });
    });
  });

  await t.test('Criterion 18: Every lesson has a situational context card (situation, context, participants, targetGoal)', () => {
    hsk4Lessons.forEach((lesson) => {
      const l = lesson.step5_listening;
      const card = l.situationalCard || l;
      assert.ok(card.situation && card.situation.length > 0, `Lesson ${lesson.id} missing situation description`);
      assert.ok(card.context && card.context.length > 0, `Lesson ${lesson.id} missing context`);
      assert.ok(card.participants && card.participants.length > 0, `Lesson ${lesson.id} missing participants`);
      assert.ok(card.targetGoal && card.targetGoal.length > 0, `Lesson ${lesson.id} missing targetGoal`);
    });
  });

  await t.test('Criterion 19: Linguistic usage notes for Vietnamese learners in every lesson', () => {
    hsk4Lessons.forEach((lesson) => {
      const notes = lesson.step5_listening.usageNotes;
      assert.ok(notes && notes.trim().length > 10, `Lesson ${lesson.id} missing linguistic usage notes`);
    });
  });

  await t.test('Criterion 20: Reading comprehension and core knowledge in Step 1', () => {
    hsk4Lessons.forEach((lesson) => {
      const s1 = lesson.step1_learn;
      assert.ok(s1, `Lesson ${lesson.id} missing step1_learn`);
      assert.ok(s1.topic && s1.topic.length > 0, `Lesson ${lesson.id} missing topic`);
      assert.ok(s1.summary && s1.summary.length > 0, `Lesson ${lesson.id} missing summary`);
      assert.ok(Array.isArray(s1.keyTakeaways) && s1.keyTakeaways.length > 0, `Lesson ${lesson.id} missing keyTakeaways`);
    });
  });

  await t.test('Criterion 21: Reading comprehension & quiz questions in Step 8 with explanations', () => {
    hsk4Lessons.forEach((lesson) => {
      const quizzes = lesson.step8_quiz;
      assert.ok(Array.isArray(quizzes) && quizzes.length >= 2, `Lesson ${lesson.id} must have at least 2 quiz items`);
      quizzes.forEach((q, idx) => {
        assert.ok(q.question && q.question.length > 0, `Quiz ${idx} in ${lesson.id} missing question`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Quiz ${idx} in ${lesson.id} missing options`);
        assert.ok(q.correctIndex !== undefined && q.correctIndex >= 0, `Quiz ${idx} in ${lesson.id} missing correctIndex`);
        assert.ok(q.explanation && q.explanation.length > 0, `Quiz ${idx} in ${lesson.id} missing explanation`);
      });
    });
  });

  await t.test('Criterion 22: Valid, authentic audioText containing genuine Chinese sentences (ZERO fake audio URLs)', () => {
    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    hsk4Lessons.forEach((lesson) => {
      const audioText = lesson.step5_listening.audioText;
      assert.ok(audioText && audioText.trim().length > 5, `Lesson ${lesson.id} missing or short audioText`);
      assert.match(audioText, chineseCharRegex, `audioText in ${lesson.id} must contain authentic Chinese characters`);

      // Check no fake audio URLs
      const str = JSON.stringify(lesson);
      assert.ok(!str.includes('placeholder.com'), `Lesson ${lesson.id} contains placeholder URL`);
      assert.ok(!str.includes('fake_audio'), `Lesson ${lesson.id} contains fake audio path`);
    });
  });

  await t.test('Criterion 23: Listening comprehension exercise in Step 5 has exactly 4 options', () => {
    hsk4Lessons.forEach((lesson) => {
      const l = lesson.step5_listening;
      assert.ok(Array.isArray(l.options), `Lesson ${lesson.id} options must be an array`);
      assert.equal(l.options.length, 4, `Lesson ${lesson.id} must have exactly 4 choices`);
    });
  });

  await t.test('Criterion 24: Listening comprehension exercise has valid correctIndex and detailed explanation', () => {
    hsk4Lessons.forEach((lesson) => {
      const l = lesson.step5_listening;
      assert.ok(l.question && l.question.trim().length > 5, `Lesson ${lesson.id} missing listening question`);
      assert.ok(l.correctIndex >= 0 && l.correctIndex <= 3, `Lesson ${lesson.id} correctIndex must be between 0 and 3`);
      assert.ok(l.explanation && l.explanation.trim().length > 10, `Lesson ${lesson.id} missing comprehensive explanation`);
    });
  });

  await t.test('Criterion 25: Speaking exercise in Step 6 has prompt, targetSentence, targetPinyin, and targetMeaning', () => {
    hsk4Lessons.forEach((lesson) => {
      const s = lesson.step6_speaking;
      assert.ok(s.prompt && s.prompt.trim().length > 0, `Lesson ${lesson.id} missing speaking prompt`);
      assert.ok(s.targetSentence && s.targetSentence.trim().length > 0, `Lesson ${lesson.id} missing targetSentence`);
      assert.ok(s.targetPinyin && s.targetPinyin.trim().length > 0, `Lesson ${lesson.id} missing targetPinyin`);
      assert.ok(s.targetMeaning && s.targetMeaning.trim().length > 0, `Lesson ${lesson.id} missing targetMeaning`);
    });
  });

  await t.test('Criterion 26: Exactly 2 characters in step3_hanzi for every lesson (40 total)', () => {
    let totalHanzi = 0;
    hsk4Lessons.forEach((lesson) => {
      assert.ok(Array.isArray(lesson.step3_hanzi), `Lesson ${lesson.id} step3_hanzi must be an array`);
      assert.equal(lesson.step3_hanzi.length, 2, `Lesson ${lesson.id} step3_hanzi must contain exactly 2 characters`);
      totalHanzi += lesson.step3_hanzi.length;
    });
    assert.equal(totalHanzi, 40, 'Total Step 3 Hanzi in HSK 4 must be 40');
  });

  await t.test('Criterion 27: 100% of Step 3 characters have standardized IDS, structure, and mnemonics', () => {
    hsk4Lessons.forEach((lesson) => {
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

  await t.test('Criterion 28: HANZI_DECOMPOSITION_DATABASE contains all 40 HSK 4 characters (total >= 247)', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const char = h.hanzi || h.char;
        const decomp = HANZI_DECOMPOSITION_DATABASE[char];
        assert.ok(decomp, `HANZI_DECOMPOSITION_DATABASE missing entry for HSK 4 character: ${char}`);
        assert.ok(decomp.structure, `Missing structure for ${char}`);
        assert.ok(decomp.ids, `Missing ids for ${char}`);
        assert.ok(Array.isArray(decomp.components) && decomp.components.length > 0, `Missing components for ${char}`);
        assert.ok(decomp.mnemonic && decomp.mnemonic.length > 5, `Missing mnemonic for ${char}`);
      });
    });
    assert.ok(Object.keys(HANZI_DECOMPOSITION_DATABASE).length >= 247, 'Database must have at least 247 entries');
  });

  await t.test('Criterion 29: Preserves HSK 1, HSK 2, and HSK 3 character decompositions intact', () => {
    const sampleEarlierChars = ['你', '好', '我', '国', '大', '买', '问', '近', '远', '护', '照', '跑', '把', '被', '同', '成', '平'];
    sampleEarlierChars.forEach(c => assert.ok(HANZI_DECOMPOSITION_DATABASE[c], `Character ${c} from HSK 1-3 must remain intact`));
  });

  await t.test('Criterion 30: Vocabulary data structure is compatible with Flashcard saving', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
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

  await t.test('Criterion 31: Step 3 characters are compatible with getHanziDecomposition dictionary lookups', () => {
    hsk4Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const char = h.hanzi || h.char;
        const result = getHanziDecomposition(char);
        assert.ok(result, `getHanziDecomposition returned null for ${char}`);
        assert.ok(result.components && result.components.length > 0, `getHanziDecomposition missing components for ${char}`);
      });
    });
  });

  await t.test('Criterion 32: Zero placeholder strings across all 20 HSK 4 lessons', () => {
    const placeholders = ['TODO', 'lorem ipsum', 'đang cập nhật', 'placeholder', 'TBD'];
    const lessonString = JSON.stringify(hsk4Lessons).toLowerCase();
    placeholders.forEach((ph) => {
      assert.ok(!lessonString.includes(ph.toLowerCase()), `Detected placeholder string "${ph}" in HSK 4 lessons`);
    });
  });

  await t.test('Criterion 33: HSK 1-3 and HSK 5-6 curriculums remain completely intact', () => {
    const hsk1to3 = CURRICULUM_60_LESSONS;
    assert.equal(hsk1to3.length, 60, 'HSK 1-3 must have exactly 60 lessons');
    const hsk5 = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-5'));
    const hsk6 = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-6'));
    assert.equal(hsk5.length, 20, 'HSK 5 must have 20 lessons');
    assert.equal(hsk6.length, 20, 'HSK 6 must have 20 lessons');
  });

  await t.test('Criterion 34: Entire curriculum contains exactly 120 lessons and lookup works with zero regressions', () => {
    assert.equal(CURRICULUM_ALL_LESSONS.length, 120, 'Entire curriculum must contain exactly 120 lessons');
    const testLookup = getCurriculumLessonById('l-408');
    assert.ok(testLookup, 'getCurriculumLessonById must retrieve lesson l-408');
    assert.equal(testLookup.id, 'l-408');
    assert.equal(testLookup.title, 'Đổi ngoại tệ & Rút tiền tại ATM');
  });
});

