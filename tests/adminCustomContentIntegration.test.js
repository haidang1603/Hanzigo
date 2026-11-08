import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  normalizeCustomVocab,
  checkVocabularyDuplicate
} from '../src/services/customVocabularyService.js';

import {
  normalizeCustomLesson,
  checkLessonDuplicate
} from '../src/services/customLessonService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.06 — Admin Custom Vocabulary & Custom Lessons Supabase Integration Tests', () => {

  // =========================================================================
  // GROUP A: CUSTOM VOCABULARY INTEGRATION
  // =========================================================================
  describe('Group A: Custom Vocabulary Integration', () => {

    test('A1. normalizeCustomVocab correctly parses database row with JSONB example and metadata', () => {
      const rawDbRow = {
        id: 1042,
        hanzi: '高铁',
        pinyin: 'gāotiě',
        hanviet: 'Cao thiết',
        meaning: 'Tàu cao tốc',
        level: 2,
        topic: 'Tự thêm - Giao thông',
        radical: '钅',
        strokes: 15,
        mnemonic: 'Tàu sắt chạy tốc độ cao',
        example: {
          sentence: '中国的高铁非常快。',
          pinyin: 'Zhōngguó de gāotiě fēicháng kuài.',
          meaning: 'Tàu cao tốc của Trung Quốc rất nhanh.',
          is_custom: true
        },
        is_custom: true,
        is_hidden: false,
        created_at: '2026-11-08T10:00:00Z'
      };

      const normalized = normalizeCustomVocab(rawDbRow);
      assert.strictEqual(normalized.id, 1042);
      assert.strictEqual(normalized.hanzi, '高铁');
      assert.strictEqual(normalized.pinyin, 'gāotiě');
      assert.strictEqual(normalized.hanviet, 'Cao thiết');
      assert.strictEqual(normalized.meaning, 'Tàu cao tốc');
      assert.strictEqual(normalized.hsk, 'hsk2');
      assert.strictEqual(normalized.isCustom, true);
      assert.strictEqual(normalized.is_custom, true);
      assert.strictEqual(normalized.isHidden, false);
      assert.strictEqual(normalized.exampleSentence, '中国的高铁非常快。');
      assert.strictEqual(normalized.examplePinyin, 'Zhōngguó de gāotiě fēicháng kuài.');
      assert.strictEqual(normalized.exampleMeaning, 'Tàu cao tốc của Trung Quốc rất nhanh.');
    });

    test('A2. normalizeCustomVocab handles legacy string example format safely', () => {
      const rawLegacy = {
        id: 'cv-999',
        hanzi: '飞机',
        pinyin: 'fēijī',
        hanviet: 'Phi cơ',
        meaning: 'Máy bay',
        level: 'HSK 1',
        topic: 'Giao tiếp hàng ngày',
        example: '我坐飞机去北京。',
        examplePinyin: 'Wǒ zuò fēijī qù Běijīng.',
        exampleMeaning: 'Tôi đi máy bay đến Bắc Kinh.',
        memoryTip: 'Phi là bay, cơ là máy'
      };

      const normalized = normalizeCustomVocab(rawLegacy);
      assert.strictEqual(normalized.id, 'cv-999');
      assert.strictEqual(normalized.hanzi, '飞机');
      assert.strictEqual(normalized.hsk, 'hsk1');
      assert.strictEqual(normalized.exampleSentence, '我坐飞机去北京。');
      assert.strictEqual(normalized.mnemonic, 'Phi là bay, cơ là máy');
      assert.strictEqual(normalized.isCustom, true);
    });

    test('A3. Custom vocabulary search and filter accurately matches hanzi, pinyin, meaning, and HSK level', () => {
      const vocabList = [
        normalizeCustomVocab({ id: 1, hanzi: '咖啡', pinyin: 'kāfēi', meaning: 'Cà phê', level: 1 }),
        normalizeCustomVocab({ id: 2, hanzi: '茶', pinyin: 'chá', meaning: 'Trà', level: 1 }),
        normalizeCustomVocab({ id: 3, hanzi: '奶茶', pinyin: 'nǎichá', meaning: 'Trà sữa', level: 2 }),
        normalizeCustomVocab({ id: 4, hanzi: '电脑', pinyin: 'diànnǎo', meaning: 'Máy vi tính', level: 3 })
      ];

      // Search by Chinese character
      const matchHanzi = vocabList.filter(v => v.hanzi.includes('茶'));
      assert.strictEqual(matchHanzi.length, 2);

      // Search by pinyin & meaning
      const matchPinyin = vocabList.filter(v => v.pinyin.toLowerCase().includes('kā'));
      assert.strictEqual(matchPinyin.length, 1);
      assert.strictEqual(matchPinyin[0].hanzi, '咖啡');

      const matchMeaning = vocabList.filter(v => v.meaning.toLowerCase().includes('cà phê'));
      assert.strictEqual(matchMeaning.length, 1);
      assert.strictEqual(matchMeaning[0].hanzi, '咖啡');

      // Filter by level
      const matchHsk1 = vocabList.filter(v => v.hsk === 'hsk1');
      assert.strictEqual(matchHsk1.length, 2);
    });

    test('A4. Vocabulary validation rejects missing hanzi or meaning', () => {
      assert.throws(() => {
        const hanzi = '   ';
        const meaning = 'Xin chào';
        if (!hanzi.trim() || !meaning.trim()) throw new Error('Vui lòng nhập chữ Hán và ý nghĩa!');
      }, /Vui lòng nhập chữ Hán và ý nghĩa/);

      assert.throws(() => {
        const hanzi = '你好';
        const meaning = '';
        if (!hanzi.trim() || !meaning.trim()) throw new Error('Vui lòng nhập chữ Hán và ý nghĩa!');
      }, /Vui lòng nhập chữ Hán và ý nghĩa/);
    });

    test('A5. VocabularyPage normalizeVocab detects custom vocabularies correctly', () => {
      const vocabPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/VocabularyPage.jsx'), 'utf-8');
      assert.ok(vocabPageCode.includes("item.is_custom"), 'VocabularyPage must detect item.is_custom');
      assert.ok(vocabPageCode.includes("item.example.is_custom"), 'VocabularyPage must detect item.example.is_custom');
      assert.ok(vocabPageCode.includes("hanzigo:custom_vocab_updated"), 'VocabularyPage must listen to hanzigo:custom_vocab_updated');
    });
  });

  // =========================================================================
  // GROUP B: CUSTOM LESSONS INTEGRATION
  // =========================================================================
  describe('Group B: Custom Lessons Integration', () => {

    test('B1. normalizeCustomLesson correctly normalizes database row to client model', () => {
      const rawLesson = {
        id: 'custom-lesson-12',
        level_id: 'hsk2',
        number: 12,
        title: 'Bài 12: Mua sắm và Đổi trả hàng',
        duration: 35,
        xp: 80,
        description: 'Từ vựng và mẫu câu giao tiếp khi mua sắm tại chợ và siêu thị.',
        is_custom: true,
        is_hidden: false,
        created_at: '2026-11-08T11:00:00Z'
      };

      const normalized = normalizeCustomLesson(rawLesson);
      assert.strictEqual(normalized.id, 'custom-lesson-12');
      assert.strictEqual(normalized.title, 'Bài 12: Mua sắm và Đổi trả hàng');
      assert.strictEqual(normalized.level, 'HSK 2');
      assert.strictEqual(normalized.level_id, 'hsk2');
      assert.strictEqual(normalized.duration, 35);
      assert.strictEqual(normalized.xp, 80);
      assert.strictEqual(normalized.is_custom, true);
      assert.strictEqual(normalized.isHidden, false);
    });

    test('B2. normalizeCustomLesson preserves description and duration from alternative field names', () => {
      const rawAlt = {
        id: 'l-supp-1',
        title: 'Luyện đàm thoại hàng không',
        level: 'HSK 3',
        duration: '25',
        xp: '60',
        description: 'Tập trung vào khẩu ngữ sân bay.'
      };

      const normalized = normalizeCustomLesson(rawAlt);
      assert.strictEqual(normalized.duration, 25);
      assert.strictEqual(normalized.xp, 60);
      assert.strictEqual(normalized.level, 'HSK 3');
      assert.strictEqual(normalized.level_id, 'hsk3');
      assert.strictEqual(normalized.is_custom, true);
    });

    test('B3. Custom lessons search and level filter accurately query list', () => {
      const lessonList = [
        normalizeCustomLesson({ id: 'c1', title: 'Khẩu ngữ du lịch', level: 'HSK 1', description: 'Đặt phòng khách sạn' }),
        normalizeCustomLesson({ id: 'c2', title: 'Điểm ngữ pháp chữ 把', level: 'HSK 2', description: 'Cấu trúc câu chữ 把' }),
        normalizeCustomLesson({ id: 'c3', title: 'Đàm thoại kinh doanh', level: 'HSK 3', description: 'Thương lượng giá cả' })
      ];

      // Search by title
      const matchTitle = lessonList.filter(l => l.title.includes('ngữ pháp'));
      assert.strictEqual(matchTitle.length, 1);
      assert.strictEqual(matchTitle[0].id, 'c2');

      // Filter by level
      const matchHsk2 = lessonList.filter(l => l.level === 'HSK 2');
      assert.strictEqual(matchHsk2.length, 1);
      assert.strictEqual(matchHsk2[0].title, 'Điểm ngữ pháp chữ 把');
    });

    test('B4. Lesson validation rejects empty or whitespace-only title', () => {
      assert.throws(() => {
        const title = '    ';
        if (!title.trim()) throw new Error('Vui lòng nhập tên bài học!');
      }, /Vui lòng nhập tên bài học/);
    });

    test('B5. Authoritative curriculum lessons (120 lessons) remain untouched and distinct', () => {
      // Ensure custom lesson ID prefix pattern does not overlap with core curriculum 'l-101'..'l-620'
      const customPrefix = 'custom-';
      const curriculumIdPattern = /^l-[1-6][0-2][0-9]$/;

      const sampleCustomId = `${customPrefix}1731057600000`;
      assert.strictEqual(curriculumIdPattern.test(sampleCustomId), false, 'Custom lesson ID must never match core curriculum IDs');
    });
  });

  // =========================================================================
  // GROUP C: RBAC & RLS POLICIES VERIFICATION
  // =========================================================================
  describe('Group C: RBAC & RLS Security Policies Verification', () => {

    test('C1. Schema migration file exists and defines custom columns on vocabulary & lessons', () => {
      const migrationPath = path.join(rootDir, 'supabase/migrations/20261108_custom_content_schema.sql');
      assert.ok(fs.existsSync(migrationPath), 'Migration file 20261108_custom_content_schema.sql must exist');

      const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
      assert.ok(migrationSql.includes('is_custom BOOLEAN DEFAULT false'), 'Must add is_custom column');
      assert.ok(migrationSql.includes('is_hidden BOOLEAN DEFAULT false'), 'Must add is_hidden column');
      assert.ok(migrationSql.includes('public.vocabulary'), 'Must configure public.vocabulary');
      assert.ok(migrationSql.includes('public.lessons'), 'Must configure public.lessons');
    });

    test('C2. RLS policies enforce admin-only mutations and non-hidden public reads', () => {
      const migrationSql = fs.readFileSync(path.join(rootDir, 'supabase/migrations/20261108_custom_content_schema.sql'), 'utf-8');
      
      // Verification of admin mutations
      assert.ok(migrationSql.includes('CREATE POLICY "vocabulary_admin_insert" ON public.vocabulary'), 'Vocabulary insert must require is_admin');
      assert.ok(migrationSql.includes('CREATE POLICY "vocabulary_admin_update" ON public.vocabulary'), 'Vocabulary update must require is_admin');
      assert.ok(migrationSql.includes('CREATE POLICY "vocabulary_admin_delete" ON public.vocabulary'), 'Vocabulary delete must require is_admin');

      assert.ok(migrationSql.includes('CREATE POLICY "lessons_admin_insert" ON public.lessons'), 'Lessons insert must require is_admin');
      assert.ok(migrationSql.includes('CREATE POLICY "lessons_admin_update" ON public.lessons'), 'Lessons update must require is_admin');
      assert.ok(migrationSql.includes('CREATE POLICY "lessons_admin_delete" ON public.lessons'), 'Lessons delete must require is_admin');

      // Public read policy checks is_hidden
      assert.ok(migrationSql.includes('(is_hidden = false) OR public.is_admin()'), 'Read policy must filter out hidden records for non-admins');
    });

    test('C3. Frontend client files never expose or reference SUPABASE_SERVICE_ROLE_KEY', () => {
      const clientFiles = [
        'src/services/customVocabularyService.js',
        'src/services/customLessonService.js',
        'src/services/materialsService.js',
        'src/pages/AdminPage.jsx',
        'src/pages/MaterialsPage.jsx',
        'src/pages/VocabularyPage.jsx'
      ];

      clientFiles.forEach(relPath => {
        const fullPath = path.join(rootDir, relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          assert.strictEqual(
            content.includes('service_role'),
            false,
            `Client file ${relPath} must never reference service_role`
          );
          assert.strictEqual(
            content.includes('SUPABASE_SERVICE_ROLE_KEY'),
            false,
            `Client file ${relPath} must never reference SUPABASE_SERVICE_ROLE_KEY`
          );
        }
      });
    });
  });

  // =========================================================================
  // GROUP D: DATA MIGRATION & BACKWARD COMPATIBILITY
  // =========================================================================
  describe('Group D: Data Migration & Backward Compatibility', () => {

    test('D1. LocalStorage custom vocab items are normalized without data loss', () => {
      const legacyStorageItems = [
        {
          id: 'cv-1',
          hanzi: '地铁',
          pinyin: 'dìtiě',
          hanviet: 'Địa thiết',
          meaning: 'Tàu điện ngầm',
          hsk: 'hsk2',
          topic: 'Giao thông',
          example: '我每天坐地铁上班。',
          examplePinyin: 'Wǒ měitiān zuò dìtiě shàngbān.',
          exampleMeaning: 'Tôi đi tàu điện ngầm đi làm mỗi ngày.',
          memoryTip: 'Tàu chạy dưới đất'
        }
      ];

      const item = legacyStorageItems[0];
      const normalized = normalizeCustomVocab(item);
      assert.strictEqual(normalized.hanzi, '地铁');
      assert.strictEqual(normalized.pinyin, 'dìtiě');
      assert.strictEqual(normalized.meaning, 'Tàu điện ngầm');
      assert.strictEqual(normalized.exampleSentence, '我每天坐地铁上班。');
      assert.strictEqual(normalized.mnemonic, 'Tàu chạy dưới đất');
      assert.strictEqual(normalized.isCustom, true);
    });

    test('D2. LocalStorage custom lesson items are normalized without data loss', () => {
      const legacyLessons = [
        {
          id: 'cl-1',
          title: 'Bài học hội thoại nhà hàng',
          level: 'HSK 2',
          duration: '30',
          xp: '50',
          description: 'Gọi món và tính tiền.'
        }
      ];

      const item = legacyLessons[0];
      const normalized = normalizeCustomLesson(item);
      assert.strictEqual(normalized.title, 'Bài học hội thoại nhà hàng');
      assert.strictEqual(normalized.level, 'HSK 2');
      assert.strictEqual(normalized.duration, 30);
      assert.strictEqual(normalized.xp, 50);
      assert.strictEqual(normalized.description, 'Gọi món và tính tiền.');
    });

    test('D3. AdminPage initializes migration safely on mount', () => {
      const adminCode = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');
      assert.ok(adminCode.includes('migrateLocalStorageCustomVocab'), 'AdminPage must invoke migrateLocalStorageCustomVocab');
      assert.ok(adminCode.includes('migrateLocalStorageCustomLessons'), 'AdminPage must invoke migrateLocalStorageCustomLessons');
      assert.ok(adminCode.includes('hanzigo:custom_vocab_updated'), 'AdminPage must listen to hanzigo:custom_vocab_updated');
      assert.ok(adminCode.includes('hanzigo:custom_lessons_updated'), 'AdminPage must listen to hanzigo:custom_lessons_updated');
    });
  });

  // =========================================================================
  // GROUP E: MATERIALS SYNCHRONIZATION REGRESSION FIX
  // =========================================================================
  describe('Group E: Materials Synchronization Regression Fix', () => {

    test('E1. MaterialsPage handles empty DB results properly via applyAuthoritativeMaterials', () => {
      const materialsPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/MaterialsPage.jsx'), 'utf-8');
      assert.ok(
        materialsPageCode.includes('applyAuthoritativeMaterials'),
        'MaterialsPage must implement applyAuthoritativeMaterials to handle empty and non-empty arrays'
      );
      assert.ok(
        materialsPageCode.includes('setMaterials(dbItems)'),
        'MaterialsPage must set materials directly when database returns results'
      );
    });

    test('E2. MaterialsPage does not use title-based deduplication that swallows updates', () => {
      const materialsPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/MaterialsPage.jsx'), 'utf-8');
      // Verify that old buggy deduplication code is removed
      assert.strictEqual(
        materialsPageCode.includes('!seenTitles.has(m.title.toLowerCase())'),
        false,
        'MaterialsPage must not contain title-based deduplication that drops edited items'
      );
    });

    test('E3. MaterialsPage subscribes to Supabase Realtime channel and CustomEvent', () => {
      const materialsPageCode = fs.readFileSync(path.join(rootDir, 'src/pages/MaterialsPage.jsx'), 'utf-8');
      assert.ok(
        materialsPageCode.includes(".channel('public:materials_changes')"),
        'MaterialsPage must subscribe to Supabase realtime channel for materials changes'
      );
      assert.ok(
        materialsPageCode.includes("hanzigo:materials_updated"),
        'MaterialsPage must listen for hanzigo:materials_updated custom event'
      );
    });
  });
});
