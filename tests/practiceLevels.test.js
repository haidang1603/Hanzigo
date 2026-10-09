import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRACTICE_LEVELS,
  PRONUNCIATION_ITEMS_BY_LEVEL,
  LISTENING_DRILLS_BY_LEVEL,
  GRAMMAR_DRILLS_BY_LEVEL
} from '../src/data/practiceLevelData.js';

test('Practice Levels Data: contains 4 pedagogical levels with required structure', () => {
  assert.equal(PRACTICE_LEVELS.length, 4, 'Must have exactly 4 difficulty levels');

  PRACTICE_LEVELS.forEach((lvl, idx) => {
    assert.equal(lvl.level, idx + 1, `Level must match 1-based index for ${lvl.id}`);
    assert.ok(lvl.name && lvl.name.length > 0, `Level ${lvl.level} must have a name`);
    assert.ok(lvl.badge && lvl.badge.length > 0, `Level ${lvl.level} must have a badge`);
    assert.ok(lvl.color, `Level ${lvl.level} must have a theme color`);
    assert.ok(lvl.stats && typeof lvl.stats === 'object', `Level ${lvl.level} must have stats`);
    assert.ok(lvl.targetOutcomes && lvl.targetOutcomes.length > 0, `Level ${lvl.level} must define learning outcomes`);
  });

  const levelCodes = PRACTICE_LEVELS.map(l => l.code);
  assert.deepEqual(levelCodes, ['LV1', 'LV2', 'LV3', 'LV4']);
});

test('Pronunciation Drills: covers all 4 difficulty tiers and valid schema', () => {
  assert.ok(PRONUNCIATION_ITEMS_BY_LEVEL.length >= 20, 'Should have rich pronunciation repository');

  const levelsFound = new Set(PRONUNCIATION_ITEMS_BY_LEVEL.map(item => item.level));
  assert.equal(levelsFound.has(1), true, 'Must have Level 1 pronunciation items');
  assert.equal(levelsFound.has(2), true, 'Must have Level 2 pronunciation items');
  assert.equal(levelsFound.has(3), true, 'Must have Level 3 pronunciation items');
  assert.equal(levelsFound.has(4), true, 'Must have Level 4 pronunciation items');

  PRONUNCIATION_ITEMS_BY_LEVEL.forEach(item => {
    assert.ok(item.id, 'Item must have an id');
    assert.ok([1, 2, 3, 4].includes(item.level), `Item ${item.id} has invalid level`);
    assert.ok(item.hanzi && item.hanzi.length > 0, `Item ${item.id} must have hanzi`);
    assert.ok(item.pinyin && item.pinyin.length > 0, `Item ${item.id} must have pinyin`);
    assert.ok(item.meaning && item.meaning.length > 0, `Item ${item.id} must have meaning`);
    assert.ok(item.tip, `Item ${item.id} must provide pedagogical tip`);
  });

  // Verify Level 4 has advanced drills (chengyu or tongue twister)
  const lvl4Items = PRONUNCIATION_ITEMS_BY_LEVEL.filter(i => i.level === 4);
  assert.ok(lvl4Items.some(i => i.category.includes('Thành ngữ') || i.category.includes('líu lưỡi') || i.category.includes('Danh ngôn')),
    'Level 4 must include advanced idioms or tongue twisters');
});

test('Listening Drills: valid multiple-choice format with correct options', () => {
  assert.ok(LISTENING_DRILLS_BY_LEVEL.length > 0);

  LISTENING_DRILLS_BY_LEVEL.forEach(drill => {
    assert.ok(drill.id);
    assert.ok([1, 2, 3, 4].includes(drill.level));
    assert.ok(drill.question && drill.question.length > 0);
    assert.ok(Array.isArray(drill.options) && drill.options.length >= 2);
    assert.ok(drill.correctIndex >= 0 && drill.correctIndex < drill.options.length,
      `Correct index ${drill.correctIndex} out of bounds for drill ${drill.id}`);
    assert.ok(drill.explanation);
  });
});

test('Grammar Drills: sentence reconstruction token integrity', () => {
  assert.ok(GRAMMAR_DRILLS_BY_LEVEL.length > 0);

  GRAMMAR_DRILLS_BY_LEVEL.forEach(drill => {
    assert.ok(drill.id);
    assert.ok([1, 2, 3, 4].includes(drill.level));
    assert.ok(drill.title);
    assert.ok(drill.meaning);
    assert.ok(Array.isArray(drill.tokens));
    assert.ok(Array.isArray(drill.correctTokens));
    assert.equal(drill.tokens.length, drill.correctTokens.length,
      `Scrambled tokens count must match target tokens for ${drill.id}`);

    // Verify all tokens exist in both sets
    const tokenSet = [...drill.tokens].sort();
    const targetSet = [...drill.correctTokens].sort();
    assert.deepEqual(tokenSet, targetSet,
      `Tokens set must be identical between scrambled and correct in ${drill.id}`);
  });
});

test('Writing Difficulty Tiers: character stroke thresholds partition logically', () => {
  // Test stroke categorization partition rule
  const testChars = [
    { char: '一', strokes: 1, expectedLvl: '1' },
    { char: '人', strokes: 2, expectedLvl: '1' },
    { char: '水', strokes: 4, expectedLvl: '1' },
    { char: '你', strokes: 7, expectedLvl: '2' },
    { char: '学', strokes: 8, expectedLvl: '2' },
    { char: '爱', strokes: 10, expectedLvl: '3' },
    { char: '谢', strokes: 12, expectedLvl: '3' },
    { char: '福', strokes: 13, expectedLvl: '4' },
    { char: '德', strokes: 15, expectedLvl: '4' }
  ];

  const classifyStrokes = (strokes) => {
    if (strokes <= 4) return '1';
    if (strokes >= 5 && strokes <= 8) return '2';
    if (strokes >= 9 && strokes <= 12) return '3';
    return '4';
  };

  testChars.forEach(({ char, strokes, expectedLvl }) => {
    assert.equal(classifyStrokes(strokes), expectedLvl,
      `Character ${char} with ${strokes} strokes should be Level ${expectedLvl}`);
  });
});

test('HSK Metadata & Enriched Vocabulary: partitioned across HSK levels with full sentences', async () => {
  const { HSK_LEVELS_METADATA } = await import('../src/data/practiceLevelData.js');
  const { VOCABULARY_LIST } = await import('../src/data/chineseData.js');

  // Verify HSK Metadata
  assert.ok(HSK_LEVELS_METADATA.length >= 5);
  const hskCodes = HSK_LEVELS_METADATA.map(h => h.code);
  assert.ok(hskCodes.includes('HSK 1'));
  assert.ok(hskCodes.includes('HSK 2'));
  assert.ok(hskCodes.includes('HSK 3'));
  assert.ok(hskCodes.includes('HSK 4'));
  assert.ok(hskCodes.includes('HSK 5-6'));

  // Verify Vocabulary Partition by HSK
  assert.ok(VOCABULARY_LIST.length >= 400, 'Vocabulary list should be enriched with 400+ words');

  const counts = {};
  VOCABULARY_LIST.forEach(v => {
    counts[v.level] = (counts[v.level] || 0) + 1;
    assert.ok(v.hanzi && v.hanzi.length > 0);
    assert.ok(v.pinyin && v.pinyin.length > 0);
    assert.ok(v.meaning && v.meaning.length > 0);
    assert.ok(v.level && v.level.length > 0);
    assert.ok(v.example, `Item ${v.hanzi} must have an example`);
    assert.ok(v.example.hanzi, `Item ${v.hanzi} must have example hanzi sentence`);
    assert.ok(v.example.meaning, `Item ${v.hanzi} must have example meaning`);
  });

  assert.ok(counts['HSK 1'] >= 100, 'Must have 100+ HSK 1 words');
  assert.ok(counts['HSK 2'] >= 100, 'Must have 100+ HSK 2 words');
  assert.ok(counts['HSK 3'] >= 100, 'Must have 100+ HSK 3 words');
  assert.ok(counts['HSK 4'] >= 5, 'Must have HSK 4 words');
  assert.ok(counts['HSK 5-6'] >= 5, 'Must have HSK 5-6 / Idiom words');

  // Verify presence of idioms from consolidated documentation
  const idioms = ['入乡随俗', '马马虎虎', '一心一意', '半途而废'];
  idioms.forEach(idm => {
    const found = VOCABULARY_LIST.find(v => v.hanzi === idm);
    assert.ok(found, `Expected idiom ${idm} to exist in VOCABULARY_LIST`);
    assert.ok(found.example.hanzi.length > 0, `Idiom ${idm} must have example sentence`);
  });
});

test('Cross-Skill Synchronization: Vocabulary is synchronized with Pronunciation and Character Writing', async () => {
  const { VOCABULARY_LIST, CHARACTERS_WRITING } = await import('../src/data/chineseData.js');
  const { PRONUNCIATION_ITEMS_BY_LEVEL } = await import('../src/data/practiceLevelData.js');

  // 1. Verify Character Writing Extraction covers over 500 unique Hanzi characters across HSK levels
  const writingCharMap = new Map();
  CHARACTERS_WRITING.forEach(c => writingCharMap.set(c.char, { ...c, hskLevel: 'HSK 1' }));

  VOCABULARY_LIST.forEach(v => {
    const chars = Array.from(v.hanzi).filter(ch => /\p{Script=Han}/u.test(ch));
    chars.forEach(ch => {
      if (!writingCharMap.has(ch)) {
        writingCharMap.set(ch, {
          char: ch,
          pinyin: v.pinyin,
          meaning: v.meaning,
          hskLevel: v.level || 'HSK 1',
          parentVocab: v
        });
      }
    });
  });

  assert.ok(writingCharMap.size >= 500, `Expected 500+ unique characters for writing, got ${writingCharMap.size}`);
  assert.ok(writingCharMap.has('我'), 'Writing map must have 我');
  assert.ok(writingCharMap.has('你'), 'Writing map must have 你');
  assert.ok(writingCharMap.has('好'), 'Writing map must have 好');
  assert.ok(writingCharMap.has('学'), 'Writing map must have 学');

  // 2. Verify Pronunciation synchronization covers all 455 vocabulary words with contextual sentences
  const pronounceMap = new Map();
  PRONUNCIATION_ITEMS_BY_LEVEL.forEach(item => {
    pronounceMap.set(item.hanzi, { ...item, isDialogue: true });
  });

  VOCABULARY_LIST.forEach(v => {
    const exHanzi = typeof v.example === 'object' ? v.example?.hanzi : (v.example || '');
    if (!pronounceMap.has(v.hanzi)) {
      pronounceMap.set(v.hanzi, {
        id: `vocab-${v.id || v.hanzi}`,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        meaning: v.meaning,
        hskLevel: v.level || 'HSK 1',
        example: exHanzi,
        parentVocab: v
      });
    } else {
      const existing = pronounceMap.get(v.hanzi);
      existing.parentVocab = v;
      existing.example = existing.example || exHanzi;
    }
  });

  assert.ok(pronounceMap.size >= 455, `Expected 455+ pronunciation items, got ${pronounceMap.size}`);
  
  // Verify HSK 1, 2, 3, 4, 5-6 are all represented in pronunciation
  const pronounceHskSet = new Set(Array.from(pronounceMap.values()).map(p => p.hskLevel || `Mức ${p.level}`));
  assert.ok(pronounceHskSet.has('HSK 1') || pronounceHskSet.has('Mức 1'));
  assert.ok(pronounceHskSet.has('HSK 2') || pronounceHskSet.has('Mức 2'));
  assert.ok(pronounceHskSet.has('HSK 3') || pronounceHskSet.has('Mức 3'));

  // 3. Verify contextual sentences are present for speech recognition
  let sentenceCount = 0;
  pronounceMap.forEach(item => {
    if (item.example && item.example.length > 0) sentenceCount++;
  });
  assert.ok(sentenceCount >= 400, `Expected 400+ items with contextual example sentences, got ${sentenceCount}`);
});

test('Roadmap Vocabulary Integration: synchronizes 60 curriculum lessons into practice section', async () => {
  const { 
    getAllRoadmapVocabulary, 
    getRoadmapLessonsWithVocabCount, 
    getCompletedRoadmapVocabulary,
    getRoadmapVocabularyByLesson
  } = await import('../src/services/learningPathService.js');

  // 1. Verify roadmap vocabulary extraction
  const allRoadmapVocab = getAllRoadmapVocabulary();
  assert.ok(allRoadmapVocab.length >= 350, `Expected 350+ roadmap vocabulary items, got ${allRoadmapVocab.length}`);

  // 2. Verify all items carry required metadata
  allRoadmapVocab.forEach(v => {
    assert.ok(v.id, 'Item must have an id');
    assert.ok(v.hanzi && v.hanzi.length > 0, 'Item must have hanzi');
    assert.ok(v.pinyin, 'Item must have pinyin');
    assert.ok(v.meaning, 'Item must have meaning');
    assert.ok(v.roadmapLessonId, 'Item must reference roadmapLessonId');
    assert.ok(v.roadmapLessonNumber >= 1 && v.roadmapLessonNumber <= 60, 'Lesson number must be 1..60');
    assert.ok(v.roadmapLessonTitle, 'Item must have roadmapLessonTitle');
    assert.ok(v.level, 'Item must have level');
    assert.ok(v.example, 'Item must have example');
  });

  // 3. Verify roadmap lessons list with vocabulary count
  const lessonsWithCount = getRoadmapLessonsWithVocabCount();
  assert.equal(lessonsWithCount.length, 60, 'Must have exactly 60 roadmap lessons with counts');
  const lessonsWithVocab = lessonsWithCount.filter(l => l.vocabCount > 0);
  assert.ok(lessonsWithVocab.length >= 58, 'At least 58 lessons should have vocabulary');

  // 4. Verify lesson-specific filtering
  const lesson1Vocab = getRoadmapVocabularyByLesson('l-101');
  assert.ok(lesson1Vocab.length >= 4, 'Lesson 101 should have 4+ vocabulary items');
  assert.ok(lesson1Vocab.some(v => v.hanzi === '八' || v.hanzi === '妈妈' || v.hanzi === '爸爸'));

  // 5. Verify completed roadmap lessons filter
  const mockUser = { id: 'usr-test-roadmap' };
  const completed = getCompletedRoadmapVocabulary(mockUser);
  assert.ok(Array.isArray(completed));
});


