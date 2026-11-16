/**
 * =========================================================================
 * HANZI GO - HSK 1 TO 3 CURRICULUM (60 LESSONS)
 * =========================================================================
 * Modular re-export architecture for backward compatibility with existing tests and imports.
 * The underlying lesson data is divided into granular chunk modules:
 * - src/data/curriculum/hsk1Lessons.js (l-101 to l-120)
 * - src/data/curriculum/hsk2Lessons.js (l-201 to l-220)
 * - src/data/curriculum/hsk3Lessons.js (l-301 to l-320)
 *
 * All 60 lessons strictly follow the 9-step pedagogical standard.
 */

import {
  HSK_1_TO_3_ENRICHED,
  HSK_4_TO_6_ENRICHED,
  HSK_120_LESSONS,
  FUNCTION_WORDS_SYSTEM,
  GRAMMAR_MATRIX_HSK1_6,
  HSK6_FAULTY_SENTENCE_8_TYPES,
  HSK6_SUMMARY_1000_TO_400_RULES,
  HSK_EXAM_22_QUESTION_TYPES,
} from '../features/curriculum/hsk120CurriculumData.js';

export const CURRICULUM_60_LESSONS = HSK_1_TO_3_ENRICHED;

export const CURRICULUM_HSK4_6_LESSONS = HSK_4_TO_6_ENRICHED;

// Full 120 lessons across all 24 chapters (Levels 1 to 6)
export const CURRICULUM_ALL_LESSONS = HSK_120_LESSONS;

export {
  HSK_120_LESSONS,
  FUNCTION_WORDS_SYSTEM,
  GRAMMAR_MATRIX_HSK1_6,
  HSK6_FAULTY_SENTENCE_8_TYPES,
  HSK6_SUMMARY_1000_TO_400_RULES,
  HSK_EXAM_22_QUESTION_TYPES,
};

// Helper: Find lesson by id from curriculum dataset (searches all 120 lessons)
export function getCurriculumLessonById(lessonId) {
  if (!lessonId) return null;
  return CURRICULUM_ALL_LESSONS.find(l => l.id === lessonId) || null;
}

export default CURRICULUM_60_LESSONS;
