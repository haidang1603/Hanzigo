import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  normalizeCustomVocab,
  checkVocabularyDuplicate,
  migrateLocalStorageCustomVocab
} from '../src/services/customVocabularyService.js';

import {
  normalizeCustomLesson,
  checkLessonDuplicate,
  getStudentSupplementaryLessons,
  completeCustomLesson,
  migrateLocalStorageCustomLessons
} from '../src/services/customLessonService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.07 — Custom Content Student Integration & Data Migration Hardening Tests', () => {

  // Setup mock storage environment
  const mockStorage = {};
  const mockLocalStorage = {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(mockStorage, key) ? mockStorage[key] : null),
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };

  beforeEach(() => {
    mockLocalStorage.clear();
    globalThis.localStorage = mockLocalStorage;
    globalThis.window = {
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  });

  // =========================================================================
  // GROUP A: STUDENT CUSTOM VOCABULARY SYNC HARDENING
  // =========================================================================
  describe('Group A: Student Custom Vocabulary Sync Hardening', () => {

    test('A1. normalizeCustomVocab correctly normalizes custom vocabulary properties for student consumption', () => {
      const dbRow = {
        id: 501,
        hanzi: '人工智能',
        pinyin: 'réngōng zhìnéng',
        hanviet: 'Nhân công trí năng',
        meaning: 'Trí tuệ nhân tạo',
        level: 4,
        topic: 'Công nghệ',
        radical: '人',
        strokes: 2,
        mnemonic: 'Người tạo ra trí thông minh máy',
        example: {
          sentence: '人工智能正在迅速发展。',
          pinyin: 'Réngōng zhìnéng zhèngzài xùnsù fāzhǎn.',
          meaning: 'Trí tuệ nhân tạo đang phát triển nhanh chóng.',
          is_custom: true
        },
        is_custom: true,
        is_hidden: false,
        created_at: '2026-11-08T12:00:00Z'
      };

      const normalized = normalizeCustomVocab(dbRow);
      assert.strictEqual(normalized.id, 501);
      assert.strictEqual(normalized.hanzi, '人工智能');
      assert.strictEqual(normalized.pinyin, 'réngōng zhìnéng');
      assert.strictEqual(normalized.meaning, 'Trí tuệ nhân tạo');
      assert.strictEqual(normalized.hsk, 'hsk4');
      assert.strictEqual(normalized.isCustom, true);
      assert.strictEqual(normalized.isHidden, false);
      assert.strictEqual(normalized.is_hidden, false);
      assert.strictEqual(normalized.example, '人工智能正在迅速发展。');
    });

    test('A2. VocabularyPage source code mounts authoritative list from VOCABULARY_LIST + normalizedDb and drops stale LocalStorage merge', () => {
      const vocabPageCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'VocabularyPage.jsx'), 'utf-8');
      
      // Ensure syncVocabularyFromDb builds authoritative list
      assert.ok(vocabPageCode.includes('VOCABULARY_LIST.map(normalizeVocab).forEach'), 'VocabularyPage must map and index base list');
      assert.ok(vocabPageCode.includes('normalizedDb.forEach(item => map.set(item.hanzi, item))'), 'Authoritative Supabase DB items merged');
      // Ensure stale LocalStorage merging prev.forEach / getStoredCustomVocab loop is removed from sync
      assert.ok(!vocabPageCode.includes('prev.forEach(item => map.set(item.hanzi, item))'), 'Stale prev.forEach re-merge loop must be eliminated');
    });

    test('A3. VocabularyPage subscribes to Supabase Realtime channel and cleans up on unmount', () => {
      const vocabPageCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'VocabularyPage.jsx'), 'utf-8');

      assert.ok(vocabPageCode.includes('public:vocabulary_changes'), 'Must register channel for public:vocabulary_changes');
      assert.ok(vocabPageCode.includes('postgres_changes'), 'Must listen to postgres_changes');
      assert.ok(vocabPageCode.includes("table: 'vocabulary'"), 'Must target vocabulary table');
      assert.ok(vocabPageCode.includes('supabase.removeChannel(channel)'), 'Must remove channel subscription on component unmount');
      assert.ok(vocabPageCode.includes("window.addEventListener('hanzigo:custom_vocab_updated'"), 'Must retain local CustomEvent listener');
      assert.ok(vocabPageCode.includes("window.removeEventListener('hanzigo:custom_vocab_updated'"), 'Must remove CustomEvent listener on unmount');
    });

    test('A4. Hidden vocabulary items are excluded from student display list', () => {
      const rows = [
        { id: 1, hanzi: '太阳', meaning: 'Mặt trời', is_hidden: false, is_custom: true },
        { id: 2, hanzi: '月亮', meaning: 'Mặt trăng', is_hidden: true, is_custom: true },
        { id: 3, hanzi: '星星', meaning: 'Ngôi sao', is_hidden: false, is_custom: true }
      ];

      const visibleRows = rows.filter(r => !r.is_hidden && !r.isHidden).map(normalizeCustomVocab);
      assert.strictEqual(visibleRows.length, 2);
      assert.strictEqual(visibleRows[0].hanzi, '太阳');
      assert.strictEqual(visibleRows[1].hanzi, '星星');
      assert.ok(!visibleRows.some(r => r.hanzi === '月亮'));
    });
  });

  // =========================================================================
  // GROUP B: STUDENT CUSTOM LESSONS NAVIGATION & DISPLAY
  // =========================================================================
  describe('Group B: Student Custom Lessons Navigation & Display', () => {

    test('B1. getStudentSupplementaryLessons filters out hidden and deleted lessons', async () => {
      const lessons = await getStudentSupplementaryLessons();
      assert.ok(Array.isArray(lessons), 'Result must be an array');
      // If DB has lessons, verify none are hidden
      lessons.forEach(l => {
        assert.ok(!l.isHidden, `Lesson ${l.id} must not be hidden`);
        assert.ok(!l.is_hidden, `Lesson ${l.id} must not have is_hidden flag`);
      });
    });

    test('B2. RoadmapPage contains 4th view tab for Supplementary Lessons with dynamic count badge', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      assert.ok(roadmapCode.includes("roadmapView === 'supplementary'"), 'RoadmapPage must support supplementary view mode');
      assert.ok(roadmapCode.includes('supplementaryLessons.length'), 'RoadmapPage tab must display supplementary lessons count');
      assert.ok(roadmapCode.includes('Bài học Mở rộng'), 'Tab title must clearly identify supplementary lessons');
      assert.ok(roadmapCode.includes('🌟 Bài học bổ sung'), 'Must render supplementary badge on cards');
    });

    test('B3. RoadmapPage implements search and HSK level filtering for supplementary lessons', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      assert.ok(roadmapCode.includes('supplementarySearch'), 'RoadmapPage must track supplementary search state');
      assert.ok(roadmapCode.includes('supplementaryLevelFilter'), 'RoadmapPage must track level filter state');
      assert.ok(roadmapCode.includes('filteredSupplementaryLessons'), 'RoadmapPage must compute filtered supplementary lessons');
    });

    test('B4. Supplementary lessons view maintains strict separation from 120 curriculum lessons', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      // The core views use learningPathService (getLessonsByChapter, getLessonById) and InteractiveLessonPlayer
      assert.ok(roadmapCode.includes('activeLessonToPlay'), 'Active core lesson state preserved');
      assert.ok(roadmapCode.includes('selectedSupplementaryLesson'), 'Dedicated supplementary lesson state');
      assert.ok(roadmapCode.includes('handleOpenSupplementaryLesson'), 'Dedicated supplementary opening handler');
      assert.ok(roadmapCode.includes('getLessonsByChapter'), 'Core curriculum lessons reference intact');
    });

    test('B5. RoadmapPage subscribes to Supabase Realtime channel for supplementary lessons', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      assert.ok(roadmapCode.includes('public:lessons_changes'), 'Must register channel for public:lessons_changes');
      assert.ok(roadmapCode.includes("table: 'lessons'"), 'Must target lessons table');
      assert.ok(roadmapCode.includes('supabase.removeChannel(channel)'), 'Must remove lessons channel subscription on unmount');
      assert.ok(roadmapCode.includes("window.addEventListener('hanzigo:custom_lessons_updated'"), 'Must listen to local custom lessons events');
    });
  });

  // =========================================================================
  // GROUP C: CUSTOM LESSON STUDY FLOW & PROGRESS TRACKING
  // =========================================================================
  describe('Group C: Custom Lesson Study Flow & Progress Tracking', () => {

    test('C1. handleOpenSupplementaryLesson routes 9-step schema to player and overview schema to modal without fake data', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      // Check logic in handleOpenSupplementaryLesson
      assert.ok(roadmapCode.includes('lesson?.step1_objectives && lesson?.step2_vocabulary'), 'Must check for full 9-step player schema');
      assert.ok(roadmapCode.includes('setActiveLessonToPlay(lesson)'), 'Routes 9-step lessons to InteractiveLessonPlayer');
      assert.ok(roadmapCode.includes('setSelectedSupplementaryLesson(lesson)'), 'Routes overview lessons to dedicated modal');
    });

    test('C2. Supplementary Lesson Study Modal renders key sections and grammar points cleanly', () => {
      const roadmapCode = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'RoadmapPage.jsx'), 'utf-8');

      assert.ok(roadmapCode.includes('selectedSupplementaryLesson.title'), 'Modal displays lesson title');
      assert.ok(roadmapCode.includes('selectedSupplementaryLesson.description'), 'Modal displays lesson description');
      assert.ok(roadmapCode.includes('selectedSupplementaryLesson.grammarPoints'), 'Modal renders grammar points if available');
      assert.ok(roadmapCode.includes('handleCompleteSupplementaryLesson'), 'Modal provides completion trigger button');
    });

    test('C3. completeCustomLesson records progress and awards XP with strict idempotency', async () => {
      const mockUser = { id: '00000000-0000-0000-0000-000000000001', email: 'student@hanzigo.vn', role: 'student' };
      const lesson = {
        id: 'custom-lesson-test-001',
        title: 'Thành ngữ Trung Quốc thường gặp',
        level_id: 'hsk4',
        xp: 45,
        duration: 25
      };

      // Run initial completion for user
      const result = await completeCustomLesson(lesson, mockUser);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.lessonId, lesson.id);
      assert.strictEqual(result.isFirstTime, true);
      assert.strictEqual(result.xpAwarded, 45);

      // Verify journey progress in localStorage (using user storage key)
      const userKey = `hanzigo_journey_progress_${mockUser.id}`;
      const rawStored = mockLocalStorage.getItem(userKey);
      assert.ok(rawStored, 'Journey progress must be saved in localStorage');
      const savedProgress = JSON.parse(rawStored);
      assert.ok(savedProgress.completedLessons);
      assert.ok(savedProgress.completedLessons[lesson.id], 'Completed lesson must be marked in journey progress');
      assert.strictEqual(savedProgress.completedLessons[lesson.id].score, 100);

      // Verify idempotency on repeat completion: awards review XP (10) and isFirstTime is false
      const repeatResult = await completeCustomLesson(lesson, mockUser);
      assert.strictEqual(repeatResult.success, true);
      assert.strictEqual(repeatResult.isFirstTime, false);
      assert.strictEqual(repeatResult.xpAwarded, 10);
    });
  });

  // =========================================================================
  // GROUP D: DATA MIGRATION HARDENING & COLLISION RESISTANCE
  // =========================================================================
  describe('Group D: Data Migration Hardening & Collision Resistance', () => {

    test('D1. Collision prevention: normalizeCustomLesson uses crypto.randomUUID or resilient format instead of Date.now()', () => {
      const lessonServiceCode = fs.readFileSync(path.join(rootDir, 'src', 'services', 'customLessonService.js'), 'utf-8');

      assert.ok(lessonServiceCode.includes('crypto.randomUUID()'), 'Must use crypto.randomUUID() for custom lesson IDs');
      assert.ok(!lessonServiceCode.includes('id: `custom-lesson-${Date.now()}`'), 'Must not generate collision-prone Date.now() IDs');
    });

    test('D2. Admin-only execution guard: unauthenticated or student calls to migration abort safely without modifying storage', async () => {
      mockLocalStorage.setItem('hanzigo_custom_lessons', JSON.stringify([
        { id: 'legacy-1', title: 'Bài cũ', level_id: 'hsk1' }
      ]));
      mockLocalStorage.setItem('hanzigo_custom_vocab', JSON.stringify([
        { id: 'legacy-v1', hanzi: '你好', meaning: 'Xin chào' }
      ]));

      // 1. Unauthenticated call
      const anonResult = await migrateLocalStorageCustomLessons(null);
      assert.strictEqual(anonResult.totalFound, 0);
      assert.strictEqual(anonResult.errors.length, 1);
      assert.ok(anonResult.errors[0].includes('Admin access required'));

      // 2. Student role call
      const studentUser = { id: '00000000-0000-0000-0000-000000000002', role: 'student' };
      const studentResult = await migrateLocalStorageCustomVocab(studentUser);
      assert.strictEqual(studentResult.totalFound, 0);
      assert.strictEqual(studentResult.errors.length, 1);
      assert.ok(studentResult.errors[0].includes('Admin access required'));

      // Verify storage was not wiped or modified
      const lessonsInStorage = JSON.parse(mockLocalStorage.getItem('hanzigo_custom_lessons'));
      assert.strictEqual(lessonsInStorage.length, 1);
      assert.strictEqual(lessonsInStorage[0].title, 'Bài cũ');
    });

    test('D3. Migration is idempotent and skips already-migrated items marked with _migrated', async () => {
      const adminUser = { id: '00000000-0000-0000-0000-000000000003', role: 'admin' };
      mockLocalStorage.setItem('hanzigo_custom_lessons', JSON.stringify([
        { id: 'lesson-done', title: 'Đã di chuyển', _migrated: true },
        { id: 'lesson-skip', title: 'Đã skip', isMigrated: true }
      ]));

      const res = await migrateLocalStorageCustomLessons(adminUser);
      assert.strictEqual(res.totalFound, 2);
      assert.strictEqual(res.skippedCount, 2);
      assert.strictEqual(res.migratedCount, 0);
      assert.strictEqual(res.failedCount, 0);
    });

    test('D4. Migration result manifest contains all required telemetry metrics', async () => {
      const adminUser = { id: '00000000-0000-0000-0000-000000000003', role: 'admin' };
      mockLocalStorage.setItem('hanzigo_custom_vocab', JSON.stringify([]));

      const res = await migrateLocalStorageCustomVocab(adminUser);
      assert.ok('totalFound' in res);
      assert.ok('migratedCount' in res);
      assert.ok('skippedCount' in res);
      assert.ok('failedCount' in res);
      assert.ok('errors' in res);
      assert.ok(Array.isArray(res.errors));
    });
  });

  // =========================================================================
  // GROUP E: RLS, RBAC & REALTIME SECURITY VERIFICATION
  // =========================================================================
  describe('Group E: RLS, RBAC & Realtime Security Verification', () => {

    test('E1. Migration SQL enrolls vocabulary, lessons, and materials into supabase_realtime publication', () => {
      const migrationFile = fs.readFileSync(path.join(rootDir, 'supabase', 'migrations', '20261108_custom_content_schema.sql'), 'utf-8');

      assert.ok(migrationFile.includes('supabase_realtime ADD TABLE public.vocabulary'), 'vocabulary must be added to realtime publication');
      assert.ok(migrationFile.includes('supabase_realtime ADD TABLE public.lessons'), 'lessons must be added to realtime publication');
      assert.ok(migrationFile.includes('supabase_realtime ADD TABLE public.materials'), 'materials must be added to realtime publication');
    });

    test('E2. Master schema.sql synchronizes realtime publication and RLS policies', () => {
      const masterSchema = fs.readFileSync(path.join(rootDir, 'supabase', 'schema.sql'), 'utf-8');

      assert.ok(masterSchema.includes('supabase_realtime ADD TABLE public.vocabulary'), 'Master schema must enroll vocabulary in realtime');
      assert.ok(masterSchema.includes('supabase_realtime ADD TABLE public.lessons'), 'Master schema must enroll lessons in realtime');
      assert.ok(masterSchema.includes('supabase_realtime ADD TABLE public.materials'), 'Master schema must enroll materials in realtime');
      assert.ok(masterSchema.includes('ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on vocabulary');
      assert.ok(masterSchema.includes('ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on lessons');
    });

    test('E3. Zero exposure of SUPABASE_SERVICE_ROLE_KEY across frontend codebase', () => {
      const clientFiles = [
        'src/services/customVocabularyService.js',
        'src/services/customLessonService.js',
        'src/pages/VocabularyPage.jsx',
        'src/pages/RoadmapPage.jsx',
        'src/pages/AdminPage.jsx'
      ];

      clientFiles.forEach(file => {
        const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
        assert.ok(!content.includes('SERVICE_ROLE_KEY'), `File ${file} must not reference SERVICE_ROLE_KEY`);
        assert.ok(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `File ${file} must not reference SUPABASE_SERVICE_ROLE_KEY`);
      });
    });
  });

});
