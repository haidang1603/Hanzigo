import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PRACTICE_LEVELS,
  GRAMMAR_DRILLS_BY_LEVEL,
  LISTENING_DRILLS_BY_LEVEL
} from '../src/data/practiceLevelData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Task 24.05 — Advanced HSK 5-6 Practice & Admin Materials Supabase Integration Tests', () => {

  // =========================================================================
  // SUITE 1: HSK 5 & 6 GRAMMAR DRILLS EXPANSION
  // =========================================================================
  test('1. HSK 5 and HSK 6 have at least 10 grammar drills each with full pedagogical schema', () => {
    const l5Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 5);
    const l6Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 6);

    assert.ok(l5Grammar.length >= 10, `HSK 5 must have >= 10 grammar drills (found: ${l5Grammar.length})`);
    assert.ok(l6Grammar.length >= 10, `HSK 6 must have >= 10 grammar drills (found: ${l6Grammar.length})`);

    const allGrammarIds = new Set();
    [...l5Grammar, ...l6Grammar].forEach(drill => {
      // Unique ID check
      assert.ok(drill.id && typeof drill.id === 'string', `Grammar drill missing valid ID: ${drill.id}`);
      assert.ok(!allGrammarIds.has(drill.id), `Duplicate grammar drill ID found: ${drill.id}`);
      allGrammarIds.add(drill.id);

      // Level check
      assert.ok([5, 6].includes(drill.level), `Drill ${drill.id} level must be 5 or 6`);

      // Content integrity
      assert.ok(drill.title && drill.title.length > 0, `Drill ${drill.id} missing title`);
      assert.ok(drill.meaning && drill.meaning.length > 0, `Drill ${drill.id} missing meaning`);
      assert.ok(drill.explanation && drill.explanation.length > 0, `Drill ${drill.id} missing explanation`);
      assert.ok(drill.topic && drill.topic.length > 0, `Drill ${drill.id} missing topic`);
      assert.ok(drill.difficulty && drill.difficulty.length > 0, `Drill ${drill.id} missing difficulty`);

      // Token integrity
      assert.ok(Array.isArray(drill.tokens) && drill.tokens.length >= 3, `Drill ${drill.id} must have >= 3 tokens`);
      assert.ok(Array.isArray(drill.correctTokens) && drill.correctTokens.length >= 3, `Drill ${drill.id} must have >= 3 correctTokens`);
      assert.equal(drill.tokens.length, drill.correctTokens.length, `Drill ${drill.id} token counts must match`);

      // Verify token identity: sorted tokens must strictly match sorted correctTokens
      const sortedTokens = [...drill.tokens].sort();
      const sortedCorrect = [...drill.correctTokens].sort();
      assert.deepEqual(sortedTokens, sortedCorrect, `Drill ${drill.id} tokens do not match correctTokens multiset`);

      // Distractor analysis
      assert.ok(drill.whyWrong && (typeof drill.whyWrong === 'string' || typeof drill.whyWrong === 'object'), `Drill ${drill.id} missing whyWrong analysis`);
    });
  });

  // =========================================================================
  // SUITE 2: HSK 5 & 6 LISTENING DRILLS EXPANSION
  // =========================================================================
  test('2. HSK 5 and HSK 6 have at least 10 listening drills each with Web Speech TTS audioText', () => {
    const l5Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 5);
    const l6Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 6);

    assert.ok(l5Listening.length >= 10, `HSK 5 must have >= 10 listening drills (found: ${l5Listening.length})`);
    assert.ok(l6Listening.length >= 10, `HSK 6 must have >= 10 listening drills (found: ${l6Listening.length})`);

    const allListeningIds = new Set();
    [...l5Listening, ...l6Listening].forEach(drill => {
      // Unique ID check
      assert.ok(drill.id && typeof drill.id === 'string', `Listening drill missing valid ID: ${drill.id}`);
      assert.ok(!allListeningIds.has(drill.id), `Duplicate listening drill ID found: ${drill.id}`);
      allListeningIds.add(drill.id);

      // Level check
      assert.ok([5, 6].includes(drill.level), `Drill ${drill.id} level must be 5 or 6`);

      // Speech & script fields
      assert.ok(drill.audioText && drill.audioText.length > 0, `Drill ${drill.id} missing audioText`);
      assert.ok(drill.hanzi && drill.hanzi.length > 0, `Drill ${drill.id} missing hanzi script`);
      assert.ok(drill.pinyin && drill.pinyin.length > 0, `Drill ${drill.id} missing pinyin`);
      assert.ok((drill.translation || drill.meaning) && (drill.translation || drill.meaning).length > 0, `Drill ${drill.id} missing translation/meaning`);
      assert.ok(drill.question && drill.question.length > 0, `Drill ${drill.id} missing question`);
      assert.ok(drill.explanation && drill.explanation.length > 0, `Drill ${drill.id} missing explanation`);
      assert.ok(drill.topic && drill.topic.length > 0, `Drill ${drill.id} missing topic`);

      // 4-choice Multiple Choice Format
      assert.ok(Array.isArray(drill.options) && drill.options.length === 4, `Drill ${drill.id} must have exactly 4 options (found: ${drill.options?.length})`);
      assert.ok(typeof drill.correctIndex === 'number' && drill.correctIndex >= 0 && drill.correctIndex < 4, `Drill ${drill.id} correctIndex must be 0..3 (got: ${drill.correctIndex})`);
    });
  });

  // =========================================================================
  // SUITE 3: NON-REGRESSION FOR HSK 1-4 AND OVERALL PRACTICE LEVELS
  // =========================================================================
  test('3. Practice levels and HSK 1-4 practice items maintain non-regression', () => {
    assert.equal(PRACTICE_LEVELS.length, 6, 'PRACTICE_LEVELS must span all 6 HSK tiers');
    assert.equal(PRACTICE_LEVELS[4].id, 'level-5');
    assert.equal(PRACTICE_LEVELS[5].id, 'level-6');

    const l1Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 1);
    const l2Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 2);
    const l3Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 3);
    const l4Grammar = GRAMMAR_DRILLS_BY_LEVEL.filter(d => d.level === 4);

    assert.equal(l1Grammar.length, 2, 'HSK 1 grammar drills count must be 2');
    assert.equal(l2Grammar.length, 2, 'HSK 2 grammar drills count must be 2');
    assert.equal(l3Grammar.length, 2, 'HSK 3 grammar drills count must be 2');
    assert.equal(l4Grammar.length, 1, 'HSK 4 grammar drills count must be 1');

    const l1Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 1);
    const l2Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 2);
    const l3Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 3);
    const l4Listening = LISTENING_DRILLS_BY_LEVEL.filter(d => d.level === 4);

    assert.equal(l1Listening.length, 3, 'HSK 1 listening drills count must be 3');
    assert.equal(l2Listening.length, 2, 'HSK 2 listening drills count must be 2');
    assert.equal(l3Listening.length, 2, 'HSK 3 listening drills count must be 2');
    assert.equal(l4Listening.length, 2, 'HSK 4 listening drills count must be 2');
  });

  // =========================================================================
  // SUITE 4: PRACTICE PAGE UI EXPANSION (HSK 1-6)
  // =========================================================================
  test('4. PracticePage.jsx renders 6 levels for grammar and listening', () => {
    const practicePageContent = fs.readFileSync(path.join(rootDir, 'src/pages/PracticePage.jsx'), 'utf-8');

    // Bounds limit up to 6
    assert.ok(practicePageContent.includes('Math.min(Math.max(Number(initialLevel) || 1, 1), 6)'), 'PracticePage must allow levels 1 through 6');

    // 6 columns grid for level buttons
    assert.ok(practicePageContent.includes('md:grid-cols-6'), 'PracticePage must use 6 columns layout on desktop');

    // Next level button navigation supports up to level 6
    assert.ok(practicePageContent.includes('selectedLevelId < 6'), 'PracticePage next level check must support level < 6');
  });

  // =========================================================================
  // SUITE 5: ADMIN MATERIALS SUPABASE INTEGRATION (ZERO LOCALSTORAGE SOURCE)
  // =========================================================================
  test('5. AdminPage.jsx removes materials LocalStorage fallback and uses Supabase DB as authoritative source', () => {
    const adminPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');

    // Does NOT import materials CRUD from materialsStorage
    assert.strictEqual(adminPageContent.includes('getStoredMaterials'), false, 'AdminPage must not import getStoredMaterials');
    assert.strictEqual(adminPageContent.includes('saveMaterial,'), false, 'AdminPage must not import saveMaterial');
    assert.strictEqual(adminPageContent.includes('updateMaterial,'), false, 'AdminPage must not import updateMaterial');
    assert.strictEqual(adminPageContent.includes('deleteMaterial,'), false, 'AdminPage must not import deleteMaterial');
    assert.strictEqual(adminPageContent.includes('resetMaterials'), false, 'AdminPage must not import resetMaterials');

    // Imports DB materials functions from materialsService
    assert.ok(adminPageContent.includes('getMaterialsFromDb'), 'AdminPage must import getMaterialsFromDb');
    assert.ok(adminPageContent.includes('addMaterialToDb'), 'AdminPage must import addMaterialToDb');
    assert.ok(adminPageContent.includes('updateMaterialInDb'), 'AdminPage must import updateMaterialInDb');
    assert.ok(adminPageContent.includes('deleteMaterialFromDb'), 'AdminPage must import deleteMaterialFromDb');

    // Authoritative state
    assert.ok(adminPageContent.includes('isLoadingMaterials'), 'AdminPage must track isLoadingMaterials state');
    assert.ok(adminPageContent.includes('materialsError'), 'AdminPage must track materialsError state');
    assert.ok(adminPageContent.includes('loadMaterialsData'), 'AdminPage must implement loadMaterialsData');
    assert.ok(adminPageContent.includes('handleRefreshMaterials'), 'AdminPage must implement handleRefreshMaterials');

    // UI Feedback elements
    assert.ok(adminPageContent.includes('Đang tải danh sách tài liệu từ cơ sở dữ liệu...'), 'AdminPage must show loading feedback for materials');
    assert.ok(adminPageContent.includes('Không tìm thấy tài liệu phù hợp'), 'AdminPage must show empty state for materials');
    assert.ok(adminPageContent.includes('Tải lại tài liệu từ cơ sở dữ liệu'), 'AdminPage must have refresh control for materials');
  });

  // =========================================================================
  // SUITE 6: REAL-TIME CROSS-PAGE SYNCHRONIZATION
  // =========================================================================
  test('6. Custom event hanzigo:materials_updated is dispatched on AdminPage and listened on MaterialsPage', () => {
    const adminPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/AdminPage.jsx'), 'utf-8');
    const materialsPageContent = fs.readFileSync(path.join(rootDir, 'src/pages/MaterialsPage.jsx'), 'utf-8');

    // Dispatches event on create, update, delete, feature, hide
    const eventDispatches = (adminPageContent.match(/hanzigo:materials_updated/g) || []).length;
    assert.ok(eventDispatches >= 4, `AdminPage must dispatch hanzigo:materials_updated on mutations (found: ${eventDispatches})`);

    // Listens for event in MaterialsPage.jsx
    assert.ok(materialsPageContent.includes('hanzigo:materials_updated'), 'MaterialsPage must listen for hanzigo:materials_updated event');
    assert.ok(materialsPageContent.includes('addEventListener(\'hanzigo:materials_updated\''), 'MaterialsPage must attach event listener');
    assert.ok(materialsPageContent.includes('removeEventListener(\'hanzigo:materials_updated\''), 'MaterialsPage must clean up event listener');
  });

  // =========================================================================
  // SUITE 7: RBAC GUARDS & SECRETS ISOLATION
  // =========================================================================
  test('7. Security isolation: service role key is absent from client source and materialsService enforces DB schema', () => {
    const materialsServiceContent = fs.readFileSync(path.join(rootDir, 'src/services/materialsService.js'), 'utf-8');
    const adminServiceContent = fs.readFileSync(path.join(rootDir, 'src/services/adminService.js'), 'utf-8');

    // Client services do not reference service role
    assert.strictEqual(materialsServiceContent.includes('SUPABASE_SERVICE_ROLE_KEY'), false, 'materialsService must not access service role');
    assert.strictEqual(adminServiceContent.includes('SUPABASE_SERVICE_ROLE_KEY'), false, 'adminService must not access service role');

    // Materials table schema in SQL has RLS and admin-only mutation policies
    const schemaContent = fs.readFileSync(path.join(rootDir, 'supabase/schema.sql'), 'utf-8');
    assert.ok(schemaContent.includes('ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY'), 'materials table must have RLS enabled');
    assert.ok(schemaContent.includes('is_admin()'), 'materials mutation policy must check is_admin()');
  });
});
