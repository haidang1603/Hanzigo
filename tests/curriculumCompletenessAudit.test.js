// =========================================================================
// CURRICULUM COMPLETENESS AUDIT TEST SUITE (4 PILLARS · HSK 1-6 & 7-9)
// Verifies 100/100 Scorecard across Lexical/Function Words, Grammar Matrix,
// Zero-Fallback Content Depth, and 22 HSK Exam Archetypes Alignment.
// =========================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runCurriculumAudit } from '../scripts/auditCurriculumCompleteness.js';
import {
  HSK_120_LESSONS,
  HSK_STAGE_CONFIGS,
  ALL_180_LESSONS,
  ALL_9_STAGE_CONFIGS,
  FUNCTION_WORDS_SYSTEM,
  HSK6_FAULTY_SENTENCE_8_TYPES,
  HSK6_SUMMARY_1000_TO_400_RULES,
  HSK_EXAM_22_QUESTION_TYPES,
} from '../src/features/curriculum/hsk120CurriculumData.js';
import {
  HSK_7_TO_9_STAGE_CONFIGS,
  HSK_7_TO_9_LESSONS,
} from '../src/features/curriculum/hsk7to9CurriculumData.js';
import { RAW_LEXICON_ENTRIES } from '../src/features/curriculum/hsk120LexiconBank.js';
import { SPECIFIC_GRAMMAR_AST_MAP } from '../src/features/curriculum/hsk120GrammarAstBank.js';
import { buildSynthesizedLessonDetail } from '../src/features/curriculum/lessonContentSynthesizer.js';
import { HSK79_VOCAB_GLOSSARY } from '../src/features/curriculum/hsk79VocabGlossary.js';
import { MODULE_PASSAGE_TEMPLATES } from '../src/features/curriculum/hsk79PassagesAndGrammar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('Curriculum Audit achieves 100/100 across all 4 Pillars (Lessons 1-180)', () => {
  const report = runCurriculumAudit();
  assert.equal(report.totalScore, 100, `Expected 100/100 score, got ${report.totalScore}: ${JSON.stringify(report)}`);
  assert.equal(report.pillars.pillar1_lexicalAndFunctionWords.missingInDict.length, 0);
  assert.equal(report.pillars.pillar1_lexicalAndFunctionWords.missingInLessons.length, 0);
  assert.equal(report.pillars.pillar1_lexicalAndFunctionWords.under5VocabLessons.length, 0);
  assert.equal(report.pillars.pillar2_grammarMatrix.missingGrammarTokens.length, 0);
  assert.equal(report.pillars.pillar2_grammarMatrix.lessonsWithoutAst.length, 0);
  assert.equal(report.pillars.pillar3_contentDepthZeroFallback.fallbackHits.length, 0);
  assert.equal(report.pillars.pillar3_contentDepthZeroFallback.missingModulePassages.length, 0);
  assert.equal(report.pillars.pillar3_contentDepthZeroFallback.unique79GrammarMistakes, 60);
  assert.equal(report.pillars.pillar4_examAlignment.unmappedExamTypes.length, 0);
  assert.equal(report.pillars.pillar4_examAlignment.unmappedLessons.length, 0);
});

test('Pillar 1: Function words systems cover all 18 measure words, 9 adverb pairs, 17 prepositions & >=6 vocab/lesson', () => {
  assert.equal(FUNCTION_WORDS_SYSTEM.measureWords18.length, 18);
  assert.equal(FUNCTION_WORDS_SYSTEM.confusableAdverbs9Pairs.length, 9);
  assert.equal(FUNCTION_WORDS_SYSTEM.corePrepositions17.length, 17);
  assert.equal(HSK_120_LESSONS.length, 120);

  for (const lesson of HSK_120_LESSONS) {
    assert.ok(Array.isArray(lesson.keyVocab) && lesson.keyVocab.length >= 6, `${lesson.id} must have >= 6 keyVocab`);
    assert.ok(Array.isArray(lesson.grammarAst) && lesson.grammarAst.length >= 1, `${lesson.id} must have grammarAst`);
  }
});

test('Pillar 2 & 4: HSK 6 8-type Yubing (Q51-60), 1000->400 Summary rules, and 22 Exam Archetypes mapped', () => {
  assert.equal(HSK6_FAULTY_SENTENCE_8_TYPES.length, 8);
  assert.equal(HSK6_SUMMARY_1000_TO_400_RULES.length, 6);
  assert.equal(HSK_EXAM_22_QUESTION_TYPES.length, 22);

  const l618 = HSK_120_LESSONS.find((l) => l.id === 'l-618');
  const l619 = HSK_120_LESSONS.find((l) => l.id === 'l-619');
  assert.equal(l618?.step4_grammar?.faultySentenceRules?.length, 8);
  assert.equal(l619?.step4_grammar?.summaryWritingRules?.length, 6);
});

test('Pillar 3: HSK 7-9 glossary covers all words in HSK_7_TO_9_LESSONS and all 12 module passages (7.1-9.4)', () => {
  assert.ok(Object.keys(HSK79_VOCAB_GLOSSARY).length >= 335);
  assert.equal(Object.keys(MODULE_PASSAGE_TEMPLATES).length, 12);

  for (const lesson of HSK_7_TO_9_LESSONS) {
    for (const kw of lesson.keyVocab) {
      assert.ok(HSK79_VOCAB_GLOSSARY[kw], `Missing HSK79 glossary entry for ${kw} (lesson ${lesson.id})`);
    }
  }
});

test('Unified HSK 1-9 Integration: ALL_180_LESSONS, ALL_9_STAGE_CONFIGS, Lexicon/AST Banks & buildSynthesizedLessonDetail(1..180)', () => {
  assert.equal(HSK_STAGE_CONFIGS.length, 6);
  assert.equal(HSK_7_TO_9_STAGE_CONFIGS.length, 3);
  assert.equal(ALL_9_STAGE_CONFIGS.length, 9);
  assert.equal(ALL_180_LESSONS.length, 180);

  for (const lesson of ALL_180_LESSONS) {
    for (const kw of lesson.keyVocab || []) {
      assert.ok(RAW_LEXICON_ENTRIES[kw], `RAW_LEXICON_ENTRIES missing keyVocab "${kw}" in lesson ${lesson.id}`);
    }
    assert.ok(SPECIFIC_GRAMMAR_AST_MAP[lesson.grammarCode], `SPECIFIC_GRAMMAR_AST_MAP missing grammarCode "${lesson.grammarCode}" in lesson ${lesson.id}`);
  }

  for (let i = 1; i <= 180; i++) {
    const detail = buildSynthesizedLessonDetail(i);
    assert.ok(detail, `buildSynthesizedLessonDetail(${i}) must return lesson detail`);
    if (i <= 120) {
      assert.equal(detail.translationDrill, null, `Lesson ${i} should have null translationDrill`);
    } else {
      assert.ok(detail.translationDrill?.threeTierComparison?.masterHsk9Version, `Lesson ${i} missing HSK 7-9 translationDrill`);
    }
  }

  // Numeric clamping check at 180
  const clamped = buildSynthesizedLessonDetail(999);
  assert.equal(clamped?.numericId, 180);
});

test('UI Integration: Step2Vocabulary and Step4Grammar render enriched fields', () => {
  const step2Src = fs.readFileSync(path.join(ROOT, 'src/components/learning/lesson-steps/Step2Vocabulary.jsx'), 'utf8');
  const step4Src = fs.readFileSync(path.join(ROOT, 'src/components/learning/lesson-steps/Step4Grammar.jsx'), 'utf8');

  assert.ok(step2Src.includes('lesson.extendedVocabulary'), 'Step2Vocabulary must render extendedVocabulary');
  assert.ok(step2Src.includes('lesson.functionWordFocus'), 'Step2Vocabulary must render functionWordFocus');
  assert.ok(step4Src.includes('formula_tokens'), 'Step4Grammar must render formula_tokens AST');
  assert.ok(step4Src.includes('faultySentenceRules'), 'Step4Grammar must render HSK 6 faultySentenceRules');
  assert.ok(step4Src.includes('summaryWritingRules'), 'Step4Grammar must render HSK 6 summaryWritingRules');
  assert.ok(step4Src.includes('examQuestionTypesMapped'), 'Step4Grammar must render examQuestionTypesMapped');
});
