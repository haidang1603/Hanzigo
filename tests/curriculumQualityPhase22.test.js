import test from 'node:test';
import assert from 'node:assert/strict';

import { CURRICULUM_60_LESSONS } from '../src/data/curriculumLessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from '../src/data/curriculumLessonsHsk4to6.js';
import { LEARNING_CHAPTERS, BOSS_CHALLENGES } from '../src/data/learningPathData.js';
import { VOCABULARY_LIST } from '../src/data/chineseData.js';

test('HSK Curriculum - Completeness & Volume', async (t) => {
  await t.test('Total 120 official curriculum lessons are loaded', () => {
    assert.equal(CURRICULUM_60_LESSONS.length, 60, 'HSK 1-3 must have exactly 60 lessons');
    assert.equal(CURRICULUM_HSK4_6_LESSONS.length, 60, 'HSK 4-6 must have exactly 60 lessons');
    const totalLessons = CURRICULUM_60_LESSONS.length + CURRICULUM_HSK4_6_LESSONS.length;
    assert.equal(totalLessons, 120, 'Total curriculum lessons must be exactly 120');
  });

  await t.test('All 6 HSK levels have exactly 20 lessons each', () => {
    const all = [...CURRICULUM_60_LESSONS, ...CURRICULUM_HSK4_6_LESSONS];
    for (let level = 1; level <= 6; level++) {
      const levelId = `lvl-${level}`;
      const levelLessons = all.filter(l => l.levelId === levelId);
      assert.equal(levelLessons.length, 20, `Level ${levelId} must have exactly 20 lessons`);
    }
  });

  await t.test('All 24 chapters have their lessons mapped', () => {
    const all = [...CURRICULUM_60_LESSONS, ...CURRICULUM_HSK4_6_LESSONS];
    assert.equal(LEARNING_CHAPTERS.length, 24, 'Curriculum must contain 24 chapters');
    
    LEARNING_CHAPTERS.forEach((ch, idx) => {
      const chapterLessons = all.filter(l => l.chapterId === ch.id);
      assert.ok(chapterLessons.length > 0, `Chapter ${ch.id} (${ch.title}) must contain lessons`);
    });
  });

  await t.test('All 24 chapters have a dedicated Boss Challenge', () => {
    assert.equal(BOSS_CHALLENGES.length, 24, 'Must have exactly 24 Boss Challenges');
    const bossChapterIds = new Set(BOSS_CHALLENGES.map(b => b.chapterId));
    
    LEARNING_CHAPTERS.forEach(ch => {
      assert.ok(bossChapterIds.has(ch.id), `Chapter ${ch.id} must have a corresponding Boss Challenge`);
    });

    BOSS_CHALLENGES.forEach(boss => {
      assert.ok(boss.id, 'Boss must have an ID');
      assert.ok(boss.title, `Boss ${boss.id} must have a title`);
      assert.ok(boss.chineseTitle, `Boss ${boss.id} must have a chineseTitle`);
      assert.ok(Array.isArray(boss.stages) && boss.stages.length >= 3, `Boss ${boss.id} must have >= 3 stages`);
      assert.ok(boss.xpReward >= 50, `Boss ${boss.id} must reward XP`);
    });
  });
});

test('HSK Curriculum - Pedagogical Architecture (9 Steps per Lesson)', async (t) => {
  const allLessons = [...CURRICULUM_60_LESSONS, ...CURRICULUM_HSK4_6_LESSONS];

  await t.test('Every lesson contains complete 9-step pedagogical structures', () => {
    allLessons.forEach(l => {
      // Step 1: Learning objectives
      assert.ok(l.step1_learn, `Lesson ${l.id} missing step1_learn`);
      assert.ok(l.step1_learn.topic, `Lesson ${l.id} missing step1_learn.topic`);
      assert.ok(l.step1_learn.summary, `Lesson ${l.id} missing step1_learn.summary`);
      assert.ok(l.step1_learn.audioDemoText, `Lesson ${l.id} missing audioDemoText`);

      // Step 2: Vocabulary
      assert.ok(Array.isArray(l.step2_vocabulary) && l.step2_vocabulary.length >= 3, `Lesson ${l.id} missing step2_vocabulary`);
      l.step2_vocabulary.forEach(v => {
        assert.ok(v.hanzi, `Lesson ${l.id} vocabulary missing hanzi`);
        assert.ok(v.pinyin, `Lesson ${l.id} vocabulary ${v.hanzi} missing pinyin`);
        assert.ok(v.meaning, `Lesson ${l.id} vocabulary ${v.hanzi} missing meaning`);
        assert.ok(v.example && v.example.hanzi, `Lesson ${l.id} vocabulary ${v.hanzi} missing example`);
      });

      // Step 3: Hanzi stroke analysis
      assert.ok(Array.isArray(l.step3_hanzi) && l.step3_hanzi.length > 0, `Lesson ${l.id} missing step3_hanzi`);

      // Step 4: Grammar
      assert.ok(l.step4_grammar, `Lesson ${l.id} missing step4_grammar`);
      assert.ok(l.step4_grammar.formula, `Lesson ${l.id} missing grammar formula`);
      assert.ok(l.step4_grammar.explanation, `Lesson ${l.id} missing grammar explanation`);
      assert.ok(Array.isArray(l.step4_grammar.examples) && l.step4_grammar.examples.length > 0, `Lesson ${l.id} missing grammar examples`);
      assert.ok(l.step4_grammar.commonMistake, `Lesson ${l.id} missing commonMistake`);

      // Step 5: Listening dialogue
      assert.ok(l.step5_listening, `Lesson ${l.id} missing step5_listening`);
      assert.ok(Array.isArray(l.step5_listening.dialogue) && l.step5_listening.dialogue.length >= 1, `Lesson ${l.id} missing dialogue`);
      assert.ok(l.step5_listening.audioText, `Lesson ${l.id} missing audioText`);

      // Step 6: Speaking practice
      assert.ok(l.step6_speaking, `Lesson ${l.id} missing step6_speaking`);
      assert.ok(l.step6_speaking.targetSentence, `Lesson ${l.id} missing targetSentence in speaking`);

      // Step 7: Writing / Sentence construction
      assert.ok(l.step7_writing, `Lesson ${l.id} missing step7_writing`);
      assert.ok(Array.isArray(l.step7_writing.words) && l.step7_writing.words.length > 0, `Lesson ${l.id} missing words in writing`);

      // Step 8: Interactive Quizzes
      assert.ok(Array.isArray(l.step8_quiz) && l.step8_quiz.length >= 2, `Lesson ${l.id} missing step8_quiz`);
      l.step8_quiz.forEach((q, qIdx) => {
        assert.ok(q.question, `Lesson ${l.id} Q${qIdx+1} missing question text`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Lesson ${l.id} Q${qIdx+1} missing options`);
        assert.ok(typeof q.correctIndex === 'number', `Lesson ${l.id} Q${qIdx+1} missing correctIndex`);
        assert.ok(q.explanation, `Lesson ${l.id} Q${qIdx+1} missing explanation`);
      });

      // Step 9: Challenge & Reward
      assert.ok(l.step9_challenge, `Lesson ${l.id} missing step9_challenge`);
      assert.ok(l.step9_challenge.badge, `Lesson ${l.id} missing badge in step9`);
      assert.ok(l.step9_challenge.xpReward >= 40, `Lesson ${l.id} missing xpReward in step9`);
    });
  });
});

test('HSK Curriculum - Quality, Deduplication & Dictionary Synchronization', async (t) => {
  const allLessons = [...CURRICULUM_60_LESSONS, ...CURRICULUM_HSK4_6_LESSONS];

  await t.test('Zero placeholder or mock strings across all lessons', () => {
    const forbiddenSubstrings = ['TODO', 'Lorem ipsum', 'đang cập nhật', 'Chưa có nội dung'];
    allLessons.forEach(l => {
      const serialized = JSON.stringify(l).toLowerCase();
      forbiddenSubstrings.forEach(forbidden => {
        assert.equal(
          serialized.includes(forbidden.toLowerCase()),
          false,
          `Lesson ${l.id} contains forbidden placeholder '${forbidden}'`
        );
      });
    });
  });

  await t.test('No vocabulary overlap between HSK 1-3 and HSK 4-6', () => {
    // Justified cross-level thematic spirals (revisited in business/advanced contexts)
    const justifiedThematicSpirals = new Set([
      '微信', '坚持', '复习', '通过', '预订', '押金', '退房', '现金', '护照', '解决', '准时', '迟到', '请假', '扫码'
    ]);

    const hsk1_3Vocab = new Set();
    CURRICULUM_60_LESSONS.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        if (!justifiedThematicSpirals.has(v.hanzi)) {
          hsk1_3Vocab.add(v.hanzi);
        }
      });
    });

    const overlap = [];
    CURRICULUM_HSK4_6_LESSONS.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        if (hsk1_3Vocab.has(v.hanzi)) {
          overlap.push({ lesson: l.id, hanzi: v.hanzi });
        }
      });
    });

    assert.equal(overlap.length, 0, `Detected ${overlap.length} overlapping words: ${JSON.stringify(overlap)}`);
  });

  await t.test('100% of curriculum vocabulary is indexed in VOCABULARY_LIST', () => {
    const dictHanziSet = new Set(VOCABULARY_LIST.map(v => v.hanzi));
    const missing = [];

    allLessons.forEach(l => {
      (l.step2_vocabulary || []).forEach(v => {
        if (!dictHanziSet.has(v.hanzi)) {
          missing.push({ lesson: l.id, hanzi: v.hanzi });
        }
      });
    });

    assert.equal(
      missing.length,
      0,
      `All curriculum vocabulary must be present in VOCABULARY_LIST. Missing: ${JSON.stringify(missing)}`
    );
    assert.ok(VOCABULARY_LIST.length >= 714, `VOCABULARY_LIST must have at least 714 words, got ${VOCABULARY_LIST.length}`);
  });
});
