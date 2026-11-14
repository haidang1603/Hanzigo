import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HSK79_CBT_CONFIG,
  HSK79_STAGE_CONFIGS,
  HSK79_MODULE_TITLES,
  HSK_79_60_LESSONS,
  getHsk79LessonMetaById,
} from '../src/features/curriculum/hsk7to9CurriculumData.js';
import { getHsk79LessonWithContent } from '../src/features/curriculum/lessonContentSynthesizer.js';
import {
  LEARNING_LESSONS,
  LEARNING_CHAPTERS,
} from '../src/data/learningPathData.js';

test('HSK 7-9 curriculum defines exactly 60 lessons (121-180) across 12 modules and preserves HSK 1-6', () => {
  assert.equal(LEARNING_LESSONS.length, 120);
  assert.equal(LEARNING_CHAPTERS.length, 24);

  assert.equal(HSK_79_60_LESSONS.length, 60);
  assert.equal(HSK79_MODULE_TITLES.length, 12);

  const ids = HSK_79_60_LESSONS.map((l) => l.id);
  assert.equal(new Set(ids).size, 60);
  assert.equal(ids[0], 121);
  assert.equal(ids[ids.length - 1], 180);

  assert.equal(HSK_79_60_LESSONS.filter((l) => l.level === 7).length, 20);
  assert.equal(HSK_79_60_LESSONS.filter((l) => l.level === 8).length, 20);
  assert.equal(HSK_79_60_LESSONS.filter((l) => l.level === 9).length, 20);

  assert.equal(HSK79_CBT_CONFIG.questionCount, 98);
  assert.equal(HSK79_CBT_CONFIG.durationMinutes, 210);
  assert.equal(HSK79_CBT_CONFIG.maxScore, 300);
  assert.equal(HSK79_STAGE_CONFIGS[7].vocabTarget, 7000);
  assert.equal(HSK79_STAGE_CONFIGS[8].vocabTarget, 9000);
  assert.equal(HSK79_STAGE_CONFIGS[9].vocabTarget, 11092);
});

test('lessonContentSynthesizer produces 9-step + 3-tier translation + essay blueprint for all 60 HSK 7-9 lessons', () => {
  for (let id = 121; id <= 180; id++) {
    const meta = getHsk79LessonMetaById(id);
    assert.ok(meta, `Missing meta for lesson ${id}`);

    const synthesized = getHsk79LessonWithContent(`hsk79-${id}`);
    assert.ok(synthesized, `Failed to synthesize hsk79-${id}`);
    assert.equal(synthesized.isHsk79, true);
    assert.equal(synthesized.numericId, id);

    // 9-step fields expected by InteractiveLessonPlayer
    assert.ok(synthesized.step1_learn?.topic);
    assert.ok(Array.isArray(synthesized.step2_vocabulary) && synthesized.step2_vocabulary.length >= 4);
    assert.ok(Array.isArray(synthesized.step3_hanzi) && synthesized.step3_hanzi.length >= 1);
    assert.ok(synthesized.step4_grammar?.formula);
    assert.ok(Array.isArray(synthesized.step5_listening?.dialogue) && synthesized.step5_listening.dialogue.length >= 2);
    assert.ok(synthesized.step6_speaking?.targetSentence);
    assert.ok(Array.isArray(synthesized.step7_writing?.words) && synthesized.step7_writing.words.length >= 4);
    assert.ok(Array.isArray(synthesized.step8_quiz) && synthesized.step8_quiz.length >= 4);
    assert.ok(synthesized.step9_challenge?.targetPhrase);

    // HSK 7-9 specialized components
    assert.equal(synthesized.academicPassage.paragraphsZh.length, 3);
    assert.ok(synthesized.academicPassage.translationVi.length > 30);

    assert.equal(synthesized.translationDrills.length, 2);
    for (const drill of synthesized.translationDrills) {
      assert.ok(drill.literalTrapVersion, `Missing literalTrapVersion in lesson ${id}`);
      assert.ok(drill.standardHsk7Version, `Missing standardHsk7Version in lesson ${id}`);
      assert.ok(drill.masterHsk9Version, `Missing masterHsk9Version in lesson ${id}`);
    }

    assert.equal(synthesized.essayBlueprint.outline.length, 3);
    assert.ok(synthesized.essayBlueprint.discourseMarkers.length >= 5);
  }
});
