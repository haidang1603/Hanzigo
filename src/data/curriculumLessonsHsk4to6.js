/**
 * =========================================================================
 * HANZI GO - HSK 4 TO 6 ADVANCED PEDAGOGICAL CURRICULUM (60 LESSONS)
 * =========================================================================
 * Modular re-export architecture for backward compatibility with existing tests and imports.
 * The underlying lesson data is divided into granular chunk modules:
 * - src/data/curriculum/hsk4Lessons.js (l-401 to l-420)
 * - src/data/curriculum/hsk5Lessons.js (l-501 to l-520)
 * - src/data/curriculum/hsk6Lessons.js (l-601 to l-620)
 */

import { HSK_4_LESSONS } from './curriculum/hsk4Lessons.js';
import { HSK_5_LESSONS } from './curriculum/hsk5Lessons.js';
import { HSK_6_LESSONS } from './curriculum/hsk6Lessons.js';

export const CURRICULUM_HSK4_6_LESSONS = [
  ...HSK_4_LESSONS,
  ...HSK_5_LESSONS,
  ...HSK_6_LESSONS
];

export default CURRICULUM_HSK4_6_LESSONS;
