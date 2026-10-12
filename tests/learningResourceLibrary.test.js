import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

import { 
  HSK_LEARNING_RESOURCES,
  RESOURCE_ACADEMIC_CATEGORIES,
  PERMISSION_BADGES,
  HOST_TYPE_BADGES
} from '../src/data/hskResourcesData.js';

import {
  getPublicHskResources,
  getResourceById,
  getResourcesForLesson,
  getResourcesForExam,
  submitContentReport
} from '../src/services/hskReviewService.js';

// =========================================================================
// 1. ACADEMIC CATEGORY COVERAGE (A through I)
// =========================================================================
test('1. CATEGORY COVERAGE: Exactly 9 standardized academic categories (A - I)', () => {
  assert.equal(RESOURCE_ACADEMIC_CATEGORIES.length, 9, 'Must have 9 academic categories');
  
  const expectedCodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const actualCodes = RESOURCE_ACADEMIC_CATEGORIES.map(c => c.code);
  assert.deepEqual(actualCodes, expectedCodes, 'Codes must match A through I');

  // Verify each category has at least 2 verified learning resources
  RESOURCE_ACADEMIC_CATEGORIES.forEach(cat => {
    const matched = HSK_LEARNING_RESOURCES.filter(r => r.academic_category === cat.id);
    assert.ok(
      matched.length >= 2, 
      `Category ${cat.code} (${cat.nameVi}) must have at least 2 verified resources. Found: ${matched.length}`
    );
  });
});

// =========================================================================
// 2. METADATA INTEGRITY & COPYRIGHT TRANSPARENCY
// =========================================================================
test('2. METADATA INTEGRITY: Every resource must satisfy strict academic & legal criteria', () => {
  const validHostTypes = ['hanzigo_original', 'official_published', 'open_license', 'free_external'];
  const validPermissions = ['reproducible', 'linked_only', 'open_educational'];
  const validLanguages = ['vi', 'zh', 'bilingual'];

  HSK_LEARNING_RESOURCES.forEach((res, idx) => {
    assert.ok(res.id, `Resource #${idx} must have an ID`);
    assert.ok(res.title && res.title.trim().length > 5, `Resource "${res.id}" must have title`);
    assert.ok(res.academic_category, `Resource "${res.id}" must specify academic_category`);
    assert.ok(res.description && res.description.trim().length > 15, `Resource "${res.id}" must have description`);
    
    // URL verification
    assert.ok(
      (res.source_url && (res.source_url.startsWith('http://') || res.source_url.startsWith('https://') || res.source_url.startsWith('/'))),
      `Resource "${res.id}" must have valid working source_url`
    );

    // Provenance & Legal compliance
    assert.ok(res.publisher || res.author, `Resource "${res.id}" must have author or publisher`);
    assert.ok(validHostTypes.includes(res.host_type), `Resource "${res.id}" has invalid host_type: ${res.host_type}`);
    assert.ok(validPermissions.includes(res.permission_status), `Resource "${res.id}" has invalid permission_status: ${res.permission_status}`);
    assert.ok(
      typeof res.language_of_instruction === 'string' && res.language_of_instruction.trim().length > 0,
      `Resource "${res.id}" must have non-empty language_of_instruction`
    );

    // Verification date audit
    assert.ok(
      res.verified_date && /^\d{4}-\d{2}-\d{2}$/.test(res.verified_date),
      `Resource "${res.id}" must have verified_date in YYYY-MM-DD format`
    );

    // Learning objectives
    assert.ok(
      Array.isArray(res.learning_objectives) && res.learning_objectives.length > 0,
      `Resource "${res.id}" must provide at least one learning objective`
    );

    // Strict copyright restriction check: External official published materials must NEVER claim fake reproduction
    if (res.host_type === 'official_published') {
      assert.notEqual(
        res.permission_status,
        'reproducible',
        `Official published resource "${res.id}" cannot be marked reproducible without explicit redistribution authorization`
      );
    }
  });
});

// =========================================================================
// 3. PUBLIC ACCESS (NO REGISTRATION/PAYWALL REQUIRED)
// =========================================================================
test('3. ANONYMOUS ACCESS: Resource library must be browsable without authentication', async () => {
  // Query without user context or token
  const publicList = await getPublicHskResources();
  assert.ok(Array.isArray(publicList), 'Should return an array');
  assert.ok(publicList.length >= 25, 'Should return at least 25 public resources');

  // Verify all returned resources are published and accessible
  publicList.forEach(r => {
    assert.equal(r.review_status, 'published', `Resource "${r.id}" must be published`);
    assert.equal(r.is_archived, false, `Resource "${r.id}" must not be archived`);
  });
});

// =========================================================================
// 4. MULTI-CRITERIA SEARCH & FILTERING
// =========================================================================
test('4. FILTERING & SEARCH: Accurate multi-criteria queries', async () => {
  // A. Filter by Academic Category (Grammar - E)
  const grammarResources = await getPublicHskResources({ academicCategory: 'grammar' });
  assert.ok(grammarResources.length >= 2, 'Should find grammar resources');
  grammarResources.forEach(r => {
    assert.equal(r.academic_category, 'grammar', 'Must strictly match grammar category');
  });

  // B. Filter by HSK Level (HSK 1)
  const hsk1Resources = await getPublicHskResources({ level: 'HSK 1' });
  assert.ok(hsk1Resources.length >= 3, 'Should find HSK 1 resources');
  hsk1Resources.forEach(r => {
    const lvl = (r.level || '').toUpperCase();
    assert.ok(lvl.includes('HSK 1') || lvl.includes('1-6') || lvl.includes('1-3') || lvl.includes('ALL'), `Must match HSK 1: ${lvl}`);
  });

  // C. Filter by Exam Version (3.0)
  const hsk30Resources = await getPublicHskResources({ examVersion: '3.0' });
  assert.ok(hsk30Resources.length >= 1, 'Should find HSK 3.0 resources');
  hsk30Resources.forEach(r => {
    assert.ok((r.exam_version || '').includes('3.0') || r.exam_version === 'both');
  });

  // D. Filter by Host Type (official_published)
  const officialResources = await getPublicHskResources({ hostType: 'official_published' });
  assert.ok(officialResources.length >= 2, 'Should find official published resources');
  officialResources.forEach(r => {
    assert.equal(r.host_type, 'official_published');
  });

  // E. Keyword Search
  const searchBlcu = await getPublicHskResources({ search: 'BLCU' });
  assert.ok(searchBlcu.length >= 1, 'Should find resources matching keyword BLCU');
  assert.ok(searchBlcu.some(r => r.publisher?.includes('BLCU') || r.title?.includes('BLCU')));
});

// =========================================================================
// 5. TWO-WAY ROADMAP INTEGRATION
// =========================================================================
test('5. ROADMAP INTEGRATION: Resources map directly to curriculum lessons', async () => {
  // Test lookup for lesson l-101
  const lesson101Resources = await getResourcesForLesson('l-101');
  assert.ok(lesson101Resources.length >= 1, 'Lesson l-101 must have related resources');
  assert.ok(
    lesson101Resources.some(r => r.related_lesson_ids?.includes('l-101')),
    'Resources must explicitly include l-101 in related_lesson_ids'
  );

  // Test lookup for lesson l-102
  const lesson102Resources = await getResourcesForLesson('l-102');
  assert.ok(lesson102Resources.length >= 1, 'Lesson l-102 must have related resources');
});

// =========================================================================
// 6. TWO-WAY HSK PRACTICE INTEGRATION
// =========================================================================
test('6. HSK PRACTICE INTEGRATION: Resources map directly to exams and skills', async () => {
  // Test lookup for exam hsk1-mock-01
  const examResources = await getResourcesForExam('hsk1-mock-01');
  assert.ok(examResources.length >= 1, 'Mock exam hsk1-mock-01 must have supplementary learning resources');
  assert.ok(
    examResources.some(r => r.related_exam_ids?.includes('hsk1-mock-01')),
    'Resources must explicitly reference hsk1-mock-01'
  );

  // Test lookup by skill
  const listeningResources = await getResourcesForExam(null, 'listening');
  assert.ok(listeningResources.length >= 2, 'Must find listening resources for exam review');
});

// =========================================================================
// 7. SORTING CAPABILITIES
// =========================================================================
test('7. SORTING: Supports recently verified and alphabetical sorting', async () => {
  const sortedByDate = await getPublicHskResources({ sortBy: 'recently_verified' });
  assert.ok(sortedByDate.length > 2);
  
  for (let i = 0; i < sortedByDate.length - 1; i++) {
    const d1 = new Date(sortedByDate[i].verified_date || '2026-01-01');
    const d2 = new Date(sortedByDate[i + 1].verified_date || '2026-01-01');
    assert.ok(d1 >= d2, `Dates should be sorted descending: ${sortedByDate[i].verified_date} vs ${sortedByDate[i+1].verified_date}`);
  }

  const sortedByName = await getPublicHskResources({ sortBy: 'title_asc' });
  assert.ok(sortedByName.length > 2);
  assert.ok(sortedByName[0].title.localeCompare(sortedByName[1].title, 'vi') <= 0);
});

// =========================================================================
// 8. CONTENT QUALITY & BROKEN LINK REPORTING
// =========================================================================
test('8. QUALITY CONTROL: Users can report broken links and metadata issues', async () => {
  const reportPayload = {
    resourceId: 'res-cti-official-portal',
    reportType: 'broken_link',
    description: 'Kiểm tra liên kết cổng thông tin chính thức CTI',
    reporterEmail: 'tester@hanzigo.test'
  };

  const result = await submitContentReport(reportPayload);
  assert.equal(result.success, true, 'Report submission must succeed');
  assert.ok(result.reportId, 'Must return a generated reportId');
});

// =========================================================================
// 9. DATABASE SCHEMA MIGRATION 23
// =========================================================================
test('9. DATABASE SCHEMA: Schema defines comprehensive schema for learning resource library', () => {
  const schemaPath = fs.existsSync(path.resolve(process.cwd(), 'supabase/migrations/23_free_learning_resource_library_schema.sql'))
    ? path.resolve(process.cwd(), 'supabase/migrations/23_free_learning_resource_library_schema.sql')
    : path.resolve(process.cwd(), 'supabase/schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'Schema file must exist');

  const sql = fs.readFileSync(schemaPath, 'utf8');
  assert.ok(sql.includes('academic_category'), 'Must define academic_category column');
  assert.ok(sql.includes('host_type'), 'Must define host_type column');
  assert.ok(sql.includes('language_of_instruction'), 'Must define language_of_instruction column');
  assert.ok(sql.includes('learning_objectives'), 'Must define learning_objectives column');
  assert.ok(sql.includes('related_lesson_ids'), 'Must define related_lesson_ids column');
  assert.ok(sql.includes('related_exam_ids'), 'Must define related_exam_ids column');
  assert.ok(sql.includes('idx_hsk_resources_academic_cat'), 'Must create academic_category index');
  assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'), 'Must enforce RLS security policies');
});
