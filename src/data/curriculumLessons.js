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

import { HSK_1_LESSONS } from './curriculum/hsk1Lessons.js';
import { HSK_2_LESSONS } from './curriculum/hsk2Lessons.js';
import { HSK_3_LESSONS } from './curriculum/hsk3Lessons.js';
import { CURRICULUM_HSK4_6_LESSONS } from './curriculumLessonsHsk4to6.js';

export const CURRICULUM_60_LESSONS = [
  ...HSK_1_LESSONS,
  ...HSK_2_LESSONS,
  ...HSK_3_LESSONS
];

export { CURRICULUM_HSK4_6_LESSONS };

// Full 120 lessons across all 24 chapters (Levels 1 to 6)
export const CURRICULUM_ALL_LESSONS = [
  ...CURRICULUM_60_LESSONS,
  ...CURRICULUM_HSK4_6_LESSONS
];

// Helper: Find lesson by id from curriculum dataset (searches all 120 lessons)
export function getCurriculumLessonById(lessonId) {
  if (!lessonId) return null;
  return CURRICULUM_ALL_LESSONS.find(l => l.id === lessonId) || null;
}

export default CURRICULUM_60_LESSONS;
