import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRICULUM_60_LESSONS, CURRICULUM_ALL_LESSONS, getCurriculumLessonById } from '../src/data/curriculumLessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from '../src/data/curriculumLessonsHsk4to6.js';
import { HANZI_DECOMPOSITION_DATABASE, getHanziDecomposition } from '../src/data/hanziDecomposition.js';
import { HSK6_IDIOMS_DATABASE, getHsk6IdiomById, getHsk6IdiomsByCategory } from '../src/data/hsk6IdiomsData.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';

test('=== PHASE 22 / TASK 22.07: HSK 6 MASTERY & IDIOM SPECIALIZATION TEST SUITE ===', async (t) => {
  const hsk6Lessons = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-6'));

  await t.test('Criterion 1: Exactly 20 HSK 6 lessons from l-601 to l-620', () => {
    assert.equal(hsk6Lessons.length, 20, 'HSK 6 must contain exactly 20 lessons');
  });

  await t.test('Criterion 2: Lessons have exact sequential IDs from l-601 to l-620', () => {
    const expectedIds = Array.from({ length: 20 }, (_, i) => `l-${601 + i}`);
    const actualIds = hsk6Lessons.map(l => l.id);
    assert.deepEqual(actualIds, expectedIds, 'Lessons must strictly follow sequential IDs l-601 through l-620');
  });

  await t.test('Criterion 3: All lesson IDs are globally unique across entire 120 curriculum lessons', () => {
    const allIds = CURRICULUM_ALL_LESSONS.map(l => l.id);
    const uniqueIds = new Set(allIds);
    assert.equal(uniqueIds.size, 120, 'Every lesson ID across the entire 120 curriculum must be globally unique');
  });

  await t.test('Criterion 4: Each HSK 6 lesson contains all 9 pedagogical steps', () => {
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
    hsk6Lessons.forEach((lesson) => {
      requiredSteps.forEach((step) => {
        assert.ok(lesson[step], `Lesson ${lesson.id} must contain step ${step}`);
      });
    });
  });

  await t.test('Criterion 5: 100% of vocabulary items have valid Pinyin with tone marks', () => {
    const toneRegex = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/;
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      assert.ok(Array.isArray(lesson.step2_vocabulary), `Lesson ${lesson.id} step2 must be array`);
      lesson.step2_vocabulary.forEach((v) => {
        count++;
        assert.ok(v.pinyin && v.pinyin.trim().length > 0, `Vocab ${v.id || v.hanzi} in ${lesson.id} missing pinyin`);
        assert.match(v.pinyin, toneRegex, `Vocab ${v.hanzi} (${v.pinyin}) in ${lesson.id} must have tone mark`);
      });
    });
    assert.equal(count, 80, 'Must validate all 80 HSK 6 vocabulary items');
  });

  await t.test('Criterion 6: 100% of vocabulary items have clear Vietnamese meaning', () => {
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        count++;
        assert.ok(v.meaning && v.meaning.trim().length > 0, `Vocab ${v.hanzi} in ${lesson.id} missing meaning`);
        assert.ok(!v.meaning.includes('placeholder'), `Vocab ${v.hanzi} contains placeholder meaning`);
      });
    });
    assert.equal(count, 80);
  });

  await t.test('Criterion 7: 100% of vocabulary items have accurate Vietnamese POS (Part of Speech)', () => {
    const validPosKeywords = ['Thành ngữ', 'Danh từ', 'Động từ', 'Tính từ', 'Phó từ', 'Liên từ', 'Cụm'];
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        count++;
        assert.ok(v.pos && v.pos.trim().length > 0, `Vocab ${v.hanzi} in ${lesson.id} missing pos`);
        const isValid = validPosKeywords.some(keyword => v.pos.includes(keyword));
        assert.ok(isValid, `Vocab ${v.hanzi} in ${lesson.id} has invalid POS: "${v.pos}"`);
      });
    });
    assert.equal(count, 80);
  });

  await t.test('Criterion 8: 100% of vocabulary items have accurate Han-Viet pronunciation', () => {
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        count++;
        assert.ok(v.hanviet && v.hanviet.trim().length > 0, `Vocab ${v.hanzi} in ${lesson.id} missing hanviet`);
      });
    });
    assert.equal(count, 80);
  });

  await t.test('Criterion 9: 100% of vocabulary items have valid Kangxi radical information', () => {
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        count++;
        assert.ok(v.radical && v.radical.trim().length > 0, `Vocab ${v.hanzi} in ${lesson.id} missing radical`);
      });
    });
    assert.equal(count, 80);
  });

  await t.test('Criterion 10: Zero unjustified vocabulary overlaps with HSK 1-3 curriculum', () => {
    const hsk1to3Words = new Set();
    CURRICULUM_60_LESSONS.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => hsk1to3Words.add(v.hanzi || v.word));
    });

    hsk6Lessons.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        const word = v.hanzi || v.word;
        assert.ok(!hsk1to3Words.has(word), `HSK 6 word "${word}" in ${l.id} overlaps with HSK 1-3`);
      });
    });
  });

  await t.test('Criterion 11: 100% of lessons have comprehensive grammar explanation and examples', () => {
    hsk6Lessons.forEach((lesson) => {
      const g = lesson.step4_grammar;
      assert.ok(g, `Lesson ${lesson.id} missing step4_grammar`);
      assert.ok(g.title && g.title.length > 0, `Lesson ${lesson.id} grammar missing title`);
      assert.ok(g.explanation && g.explanation.length >= 10, `Lesson ${lesson.id} grammar explanation too short`);
      assert.ok(Array.isArray(g.examples) && g.examples.length >= 1, `Lesson ${lesson.id} grammar must have >= 1 example`);
      g.examples.forEach((ex) => {
        assert.ok(ex.hanzi && ex.pinyin && ex.meaning, `Example in ${lesson.id} missing fields`);
      });
    });
  });

  await t.test('Criterion 12: Reading comprehension and core knowledge in Step 1', () => {
    hsk6Lessons.forEach((lesson) => {
      const s1 = lesson.step1_learn;
      assert.ok(s1, `Lesson ${lesson.id} missing step1_learn`);
      assert.ok(s1.topic && s1.topic.length > 0, `Lesson ${lesson.id} missing topic`);
      assert.ok(s1.summary && s1.summary.length > 0, `Lesson ${lesson.id} missing summary`);
    });
  });

  await t.test('Criterion 13: Reading comprehension & quiz questions in Step 8 with explanations', () => {
    hsk6Lessons.forEach((lesson) => {
      const quizzes = lesson.step8_quiz;
      assert.ok(Array.isArray(quizzes) && quizzes.length >= 2, `Lesson ${lesson.id} must have at least 2 quiz items`);
      quizzes.forEach((q, idx) => {
        assert.ok(q.question && q.question.length > 0, `Quiz ${idx} in ${lesson.id} missing question`);
        assert.ok(Array.isArray(q.options) && q.options.length === 4, `Quiz ${idx} in ${lesson.id} must have 4 options`);
        assert.ok(typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3, `Quiz ${idx} in ${lesson.id} invalid correctIndex`);
        assert.ok(q.explanation && q.explanation.length >= 10, `Quiz ${idx} in ${lesson.id} missing explanation`);
      });
    });
  });

  await t.test('Criterion 14: Exactly 50 four-character idioms in HSK6_IDIOMS_DATABASE', () => {
    assert.equal(HSK6_IDIOMS_DATABASE.length, 50, 'HSK6_IDIOMS_DATABASE must contain exactly 50 idioms');
    const uniqueIds = new Set(HSK6_IDIOMS_DATABASE.map(c => c.id));
    assert.equal(uniqueIds.size, 50, 'All 50 idiom IDs must be unique');
    const uniqueChengyu = new Set(HSK6_IDIOMS_DATABASE.map(c => c.chengyu));
    assert.equal(uniqueChengyu.size, 50, 'All 50 idioms must be unique');
  });

  await t.test('Criterion 15: Idioms contain complete required academic metadata', () => {
    HSK6_IDIOMS_DATABASE.forEach(item => {
      assert.ok(item.id && item.id.startsWith('cy-'), `Idiom ${item.chengyu} invalid id`);
      assert.equal(item.chengyu.length, 4, `Idiom ${item.chengyu} must have 4 characters`);
      assert.ok(item.pinyin && item.pinyin.length > 0, `Idiom ${item.chengyu} missing pinyin`);
      assert.ok(item.hanviet && item.hanviet.length > 0, `Idiom ${item.chengyu} missing hanviet`);
      assert.ok(item.meaning && item.meaning.length > 0, `Idiom ${item.chengyu} missing meaning`);
      assert.ok(item.literalMeaning && item.literalMeaning.length > 0, `Idiom ${item.chengyu} missing literalMeaning`);
      assert.ok(item.figurativeMeaning && item.figurativeMeaning.length > 0, `Idiom ${item.chengyu} missing figurativeMeaning`);
      assert.ok(item.usage && item.usage.length > 0, `Idiom ${item.chengyu} missing usage`);
      assert.ok(item.register && item.register.length > 0, `Idiom ${item.chengyu} missing register`);
      assert.ok(item.example && item.example.length > 0, `Idiom ${item.chengyu} missing example`);
      assert.ok(item.examplePinyin && item.examplePinyin.length > 0, `Idiom ${item.chengyu} missing examplePinyin`);
      assert.ok(item.exampleMeaning && item.exampleMeaning.length > 0, `Idiom ${item.chengyu} missing exampleMeaning`);
      assert.ok(item.relatedWords && item.relatedWords.synonyms && item.relatedWords.antonyms, `Idiom ${item.chengyu} missing relatedWords`);
      assert.ok(item.commonMistakes && item.commonMistakes.length > 0, `Idiom ${item.chengyu} missing commonMistakes`);
      assert.ok(item.origin && item.origin.length > 0, `Idiom ${item.chengyu} missing origin`);
      assert.ok(item.originSourceType && item.originSourceType.length > 0, `Idiom ${item.chengyu} missing originSourceType`);
    });
  });

  await t.test('Criterion 16: Idioms are categorized into 5 distinct themes with 10 idioms each', () => {
    const categories = [
      'Tư duy, học tập & Tri thức',
      'Công việc, quản trị & Sự nghiệp',
      'Xã hội, quan hệ & Ứng xử',
      'Nghị lực, cảm xúc & Phẩm chất',
      'Chiến lược, kinh tế & Đàm phán'
    ];
    categories.forEach(cat => {
      const items = getHsk6IdiomsByCategory(cat);
      assert.equal(items.length, 10, `Category "${cat}" must contain exactly 10 idioms, got ${items.length}`);
    });
  });

  await t.test('Criterion 17: Idiom lookup functions getHsk6IdiomById work accurately', () => {
    const item1 = getHsk6IdiomById('cy-601');
    assert.ok(item1 && item1.chengyu === '坚持不懈', 'Must retrieve 坚持不懈 by ID cy-601');
    const item2 = getHsk6IdiomById('破釜沉舟');
    assert.ok(item2 && item2.id === 'cy-632', 'Must retrieve cy-632 by chengyu 破釜沉舟');
  });

  await t.test('Criterion 18: 100% of 50 idioms are indexed in VOCABULARY_LIST for Flashcard & SRS', () => {
    const dictWords = new Set(VOCABULARY_LIST.map(v => v.hanzi || v.word));
    HSK6_IDIOMS_DATABASE.forEach(item => {
      assert.ok(dictWords.has(item.chengyu), `Idiom ${item.chengyu} must be indexed in VOCABULARY_LIST`);
    });
  });

  await t.test('Criterion 19: Dialogue in Step 5 has at least 5 lines per lesson (total >= 100 lines)', () => {
    let totalLines = 0;
    hsk6Lessons.forEach((lesson) => {
      const d = lesson.step5_listening?.dialogue;
      assert.ok(Array.isArray(d), `Lesson ${lesson.id} missing dialogue array`);
      assert.ok(d.length >= 5, `Lesson ${lesson.id} dialogue must have at least 5 lines, got ${d.length}`);
      totalLines += d.length;
    });
    assert.ok(totalLines >= 100, `Total dialogue lines across HSK 6 must be >= 100, got ${totalLines}`);
  });

  await t.test('Criterion 20: Dialogue content is non-repetitive across lessons', () => {
    const allFirstLines = new Set();
    hsk6Lessons.forEach((lesson) => {
      const firstLine = lesson.step5_listening.dialogue[0].hanzi;
      assert.ok(!allFirstLines.has(firstLine), `Duplicate opening dialogue line found in ${lesson.id}: "${firstLine}"`);
      allFirstLines.add(firstLine);
    });
  });

  await t.test('Criterion 21: Dialogue alternates between at least 2 distinct roles (A and B)', () => {
    hsk6Lessons.forEach((lesson) => {
      const speakers = new Set(lesson.step5_listening.dialogue.map(d => d.speaker));
      assert.ok(speakers.has('A') && speakers.has('B'), `Lesson ${lesson.id} must alternate between speakers A and B`);
    });
  });

  await t.test('Criterion 22: Dialogue Pinyin matches Chinese text with valid tone marks', () => {
    const toneRegex = /[āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/;
    hsk6Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line) => {
        assert.ok(line.pinyin && line.pinyin.trim().length > 0, `Line in ${lesson.id} missing pinyin`);
        assert.match(line.pinyin, toneRegex, `Line pinyin in ${lesson.id} missing tone marks: ${line.pinyin}`);
      });
    });
  });

  await t.test('Criterion 23: Vietnamese translations in dialogue are non-empty, clear, and natural', () => {
    hsk6Lessons.forEach((lesson) => {
      lesson.step5_listening.dialogue.forEach((line) => {
        assert.ok(line.meaning && line.meaning.trim().length >= 5, `Line in ${lesson.id} has invalid meaning: ${line.meaning}`);
      });
    });
  });

  await t.test('Criterion 24: Every lesson has a situational context card (situation, context, participants, targetGoal)', () => {
    hsk6Lessons.forEach((lesson) => {
      const lsit = lesson.step5_listening;
      assert.ok(lsit.situation && lsit.situation.length >= 3, `Lesson ${lesson.id} missing situation`);
      assert.ok(lsit.context && lsit.context.length >= 5, `Lesson ${lesson.id} missing context`);
      assert.ok(lsit.participants && lsit.participants.length >= 5, `Lesson ${lesson.id} missing participants`);
      assert.ok(lsit.targetGoal && lsit.targetGoal.length >= 5, `Lesson ${lesson.id} missing targetGoal`);
    });
  });

  await t.test('Criterion 25: Linguistic usage notes for Vietnamese learners in every lesson', () => {
    hsk6Lessons.forEach((lesson) => {
      const notes = lesson.step5_listening.usageNotes;
      assert.ok(notes && notes.trim().length >= 10, `Lesson ${lesson.id} missing linguistic usage notes`);
    });
  });

  await t.test('Criterion 26: Valid, authentic audioText containing genuine Chinese sentences (ZERO fake audio URLs)', () => {
    hsk6Lessons.forEach((lesson) => {
      const lsit = lesson.step5_listening;
      assert.ok(lsit.audioText && lsit.audioText.length >= 20, `Lesson ${lesson.id} audioText missing or too short`);
      assert.ok(!lsit.audioText.includes('http://') && !lsit.audioText.includes('https://'), `Lesson ${lesson.id} audioText contains fake URL`);
      assert.ok(!lsit.audioText.includes('.mp3') && !lsit.audioText.includes('.wav'), `Lesson ${lesson.id} audioText contains fake audio file`);
    });
  });

  await t.test('Criterion 27: Listening comprehension exercise in Step 5 has exactly 4 options', () => {
    hsk6Lessons.forEach((lesson) => {
      const lsit = lesson.step5_listening;
      assert.ok(Array.isArray(lsit.options), `Lesson ${lesson.id} listening options must be array`);
      assert.equal(lsit.options.length, 4, `Lesson ${lesson.id} listening options must have exactly 4 items`);
      lsit.options.forEach((opt, idx) => {
        assert.ok(opt && opt.trim().length > 0, `Lesson ${lesson.id} option ${idx} is empty`);
      });
    });
  });

  await t.test('Criterion 28: Listening comprehension exercise has valid correctIndex and detailed explanation', () => {
    hsk6Lessons.forEach((lesson) => {
      const lsit = lesson.step5_listening;
      assert.ok(
        typeof lsit.correctIndex === 'number' && lsit.correctIndex >= 0 && lsit.correctIndex <= 3,
        `Lesson ${lesson.id} listening invalid correctIndex: ${lsit.correctIndex}`
      );
      assert.ok(lsit.explanation && lsit.explanation.length >= 15, `Lesson ${lesson.id} listening missing explanation`);
    });
  });

  await t.test('Criterion 29: Speaking exercise in Step 6 has prompt, targetSentence, targetPinyin, and targetMeaning', () => {
    hsk6Lessons.forEach((lesson) => {
      const s6 = lesson.step6_speaking;
      assert.ok(s6.prompt && s6.prompt.length > 0, `Lesson ${lesson.id} speaking missing prompt`);
      assert.ok(s6.targetSentence && s6.targetSentence.length > 0, `Lesson ${lesson.id} speaking missing targetSentence`);
      assert.ok(s6.targetPinyin && s6.targetPinyin.length > 0, `Lesson ${lesson.id} speaking missing targetPinyin`);
      assert.ok(s6.targetMeaning && s6.targetMeaning.length > 0, `Lesson ${lesson.id} speaking missing targetMeaning`);
    });
  });

  await t.test('Criterion 30: Exactly 2 characters in step3_hanzi for every lesson (40 total)', () => {
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      assert.ok(Array.isArray(lesson.step3_hanzi), `Lesson ${lesson.id} step3 must be array`);
      assert.equal(lesson.step3_hanzi.length, 2, `Lesson ${lesson.id} step3 must have exactly 2 characters`);
      count += lesson.step3_hanzi.length;
    });
    assert.equal(count, 40, 'HSK 6 must contain exactly 40 Step 3 hanzi');
  });

  await t.test('Criterion 31: 100% of Step 3 characters have standardized IDS, structure, and mnemonics', () => {
    let count = 0;
    hsk6Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        count++;
        assert.ok(h.char && h.char.length === 1, `Char in ${lesson.id} invalid: ${h.char}`);
        assert.ok(h.ids && h.ids.length > 0, `Char ${h.char} in ${lesson.id} missing ids`);
        assert.ok(h.structure && h.structure.code && h.structure.name && h.structure.symbol, `Char ${h.char} in ${lesson.id} missing structure fields`);
        assert.ok(h.radical && h.radical.char && h.radical.name, `Char ${h.char} in ${lesson.id} missing radical info`);
        assert.ok(h.strokesCount > 0, `Char ${h.char} in ${lesson.id} missing strokesCount`);
        assert.ok(h.strokeOrderText && h.strokeOrderText.length > 0, `Char ${h.char} in ${lesson.id} missing strokeOrderText`);
        assert.ok(Array.isArray(h.components) && h.components.length > 0, `Char ${h.char} in ${lesson.id} missing components`);
        assert.ok(h.mnemonic && h.mnemonic.length >= 10, `Char ${h.char} in ${lesson.id} missing mnemonic`);
      });
    });
    assert.equal(count, 40);
  });

  await t.test('Criterion 32: HANZI_DECOMPOSITION_DATABASE contains all 40 HSK 6 characters (total >= 325)', () => {
    const dbSize = Object.keys(HANZI_DECOMPOSITION_DATABASE).length;
    assert.ok(dbSize >= 325, `HANZI_DECOMPOSITION_DATABASE should have >= 325 characters, currently has ${dbSize}`);

    hsk6Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const entry = HANZI_DECOMPOSITION_DATABASE[h.char];
        assert.ok(entry, `Character ${h.char} from ${lesson.id} missing in HANZI_DECOMPOSITION_DATABASE`);
        assert.ok(entry.structure && entry.structure.code, `Entry for ${h.char} missing structure`);
        assert.ok(entry.ids, `Entry for ${h.char} missing ids`);
        assert.ok(Array.isArray(entry.components) && entry.components.length > 0, `Entry for ${h.char} missing components`);
        assert.ok(entry.mnemonic, `Entry for ${h.char} missing mnemonic`);
      });
    });
  });

  await t.test('Criterion 33: Step 3 characters are compatible with getHanziDecomposition dictionary lookups', () => {
    hsk6Lessons.forEach((lesson) => {
      lesson.step3_hanzi.forEach((h) => {
        const res = getHanziDecomposition(h.char);
        assert.ok(res, `Lookup for ${h.char} returned null or undefined`);
        assert.ok(res.structure, `Lookup for ${h.char} missing structure`);
        assert.ok(res.ids, `Lookup for ${h.char} missing ids`);
        assert.ok(Array.isArray(res.components), `Lookup for ${h.char} missing components`);
      });
    });
  });

  await t.test('Criterion 34: Zero placeholder strings across all 20 HSK 6 lessons', () => {
    const forbiddenPhrases = ['placeholder', 'dummy', 'lorem ipsum', 'Nghĩa của từ', 'TODO', 'TBD'];
    hsk6Lessons.forEach((lesson) => {
      const str = JSON.stringify(lesson).toLowerCase();
      forbiddenPhrases.forEach((phrase) => {
        assert.ok(
          !str.includes(phrase.toLowerCase()),
          `Lesson ${lesson.id} contains forbidden placeholder: "${phrase}"`
        );
      });
    });
  });

  await t.test('Criterion 35: HSK 1-5 curriculums remain completely intact', () => {
    const hsk1to3Lessons = CURRICULUM_60_LESSONS;
    assert.equal(hsk1to3Lessons.length, 60, 'HSK 1-3 must contain exactly 60 lessons');

    const hsk4Lessons = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-4'));
    assert.equal(hsk4Lessons.length, 20, 'HSK 4 must contain exactly 20 lessons');

    const hsk5Lessons = CURRICULUM_HSK4_6_LESSONS.filter(l => l.id.startsWith('l-5'));
    assert.equal(hsk5Lessons.length, 20, 'HSK 5 must contain exactly 20 lessons');
  });

  await t.test('Criterion 36: Entire curriculum contains exactly 120 lessons and lookup works with zero regressions', () => {
    assert.equal(CURRICULUM_ALL_LESSONS.length, 120, 'Curriculum must contain exactly 120 lessons');
    
    const sampleIds = ['l-101', 'l-201', 'l-301', 'l-401', 'l-501', 'l-601', 'l-620'];
    sampleIds.forEach((id) => {
      const lesson = getCurriculumLessonById(id);
      assert.ok(lesson, `getCurriculumLessonById("${id}") must return a valid lesson`);
      assert.equal(lesson.id, id, `Fetched lesson ID must match "${id}"`);
    });
  });

  await t.test('Criterion 37: Dictionary search operates accurately with HSK 6 vocabulary & idioms', () => {
    const results = VOCABULARY_LIST.filter(v => v.hanzi === '坚持不懈');
    assert.ok(results.length > 0, 'Must find 坚持不懈 in VOCABULARY_LIST');
    assert.equal(results[0].hanzi, '坚持不懈');
    assert.ok(results[0].meaning && results[0].meaning.length > 0, 'Meaning must be non-empty');
  });

  await t.test('Criterion 38: Vocabulary data structure is compatible with Flashcard saving', () => {
    hsk6Lessons.forEach((lesson) => {
      lesson.step2_vocabulary.forEach((v) => {
        assert.ok(v.hanzi && v.pinyin && v.meaning, `Vocab ${v.id} incompatible with flashcard storage`);
        const flashcardPayload = {
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaning: v.meaning,
          hanviet: v.hanviet || '',
          radical: v.radical || '',
          level: 'HSK 6',
          lessonId: lesson.id
        };
        assert.ok(flashcardPayload.hanzi, 'Flashcard item must have hanzi');
        assert.ok(flashcardPayload.pinyin, 'Flashcard item must have pinyin');
        assert.ok(flashcardPayload.meaning, 'Flashcard item must have meaning');
      });
    });
  });

  await t.test('Criterion 39: Practical international trade, negotiation, and economic news modules', () => {
    const tradeLesson = hsk6Lessons.find(l => l.id === 'l-613');
    assert.ok(tradeLesson.step5_listening.audioText.includes('信用证') || tradeLesson.step5_listening.audioText.includes('装运港'), 'Trade lesson must include L/C and shipping terms');

    const econLesson = hsk6Lessons.find(l => l.id === 'l-616');
    assert.ok(econLesson.step5_listening.audioText.includes('国内生产总值') || econLesson.step5_listening.audioText.includes('通货膨胀'), 'Econ lesson must include GDP and inflation');
  });

  await t.test('Criterion 40: Zero duplicate Step 3 characters across entire HSK 6 (40 unique hanzi)', () => {
    const chars = [];
    hsk6Lessons.forEach((lesson) => {
      (lesson.step3_hanzi || []).forEach(h => chars.push(h.char));
    });
    assert.equal(chars.length, 40, 'HSK 6 must have exactly 40 Step 3 hanzi');
    const uniqueChars = new Set(chars);
    assert.equal(uniqueChars.size, 40, 'All 40 Step 3 characters in HSK 6 must be unique');
  });
});
