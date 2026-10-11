import test from 'node:test';
import assert from 'node:assert/strict';

import { HSK_RESOURCES } from '../src/data/hskResourcesData.js';
import { 
  getPublicHskResources, 
  transitionContentState, 
  submitContentReport, 
  getAdminReports 
} from '../src/services/hskReviewService.js';
import { 
  validateHskImportPayload, 
  importHskExamWithValidation, 
  generateSampleImportJson 
} from '../src/services/hskImportService.js';
import { 
  getHskExams, 
  submitExamAttempt, 
  getUserExamHistory, 
  generateStudyAnalytics 
} from '../src/services/hskService.js';
import hskRouter from '../api/hsk/[action].js';

// Setup mock localStorage for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

// Mock mockReqRes for testing API handlers
function createMockReqRes({ method = 'GET', query = {}, body = {}, headers = {} } = {}) {
  const req = {
    method,
    query,
    body,
    headers: { ...headers }
  };

  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    setHeader() {
      return res;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData
  };

  return { req, res };
}

// Mock users
const regularUser = { id: 'user-normal-01', email: 'student@example.com', role: 'student', isAdmin: false };
const adminUser = { id: 'admin-01', email: 'academic.admin@hanzigo.app', role: 'admin', isAdmin: true };

// ============================================================================
// 1. RESOURCE LIBRARY: PUBLIC ACCESS, FILTERING, SEARCH & LICENSES
// ============================================================================
test('Resource Library: provides verified public resources with transparent license metadata', async () => {
  localStorage.clear();

  const resources = await getPublicHskResources();
  assert.ok(resources.length >= 8, 'Must provide at least 8 verified initial resources');

  // Verify all published resources have verified fields
  for (const res of resources) {
    assert.ok(res.id, 'Resource must have unique ID');
    assert.ok(res.title, 'Resource must have title');
    assert.ok(res.level, 'Resource must specify level');
    assert.ok(res.category, 'Resource must have category');
    assert.ok(res.format, 'Resource must have format');
    assert.ok(res.source_author || res.publisher, 'Resource must identify source/author');
    assert.ok(['reproducible', 'linked_only', 'unverified'].includes(res.permission_status), 'Valid permission status');
    assert.equal(res.is_published, true, 'Only published resources appear in public hub');
    assert.equal(res.review_status, 'published');
  }

  // Official materials from CLEC and CTI ChineTest must be linked_only or have explicit license
  const officialRes = resources.filter(r => r.source_author?.includes('CTI') || r.source_author?.includes('CLEC'));
  assert.ok(officialRes.length >= 2, 'Must include official CLEC/CTI ChineTest resources');
  for (const off of officialRes) {
    assert.ok(off.source_url.startsWith('http'), 'Official resource must have genuine source URL');
    assert.equal(off.permission_status, 'linked_only', 'Official exams must not be republished without license');
  }

  // HanziGo resources must be reproducible
  const mockRes = resources.filter(r => r.category === 'grammar_guide' || r.category === 'vocab_sheet' || r.source_author?.includes('HanziGo'));
  assert.ok(mockRes.length >= 2, 'Must include HanziGo resources');
  for (const m of mockRes) {
    assert.equal(m.permission_status, 'reproducible');
  }
});

test('Resource Library: filters by level, category, format, skill, and keyword search', async () => {
  // Filter by level (level matches 'HSK 1' or 'All')
  const hsk1List = await getPublicHskResources({ level: 'HSK 1' });
  assert.ok(hsk1List.length > 0);
  assert.ok(hsk1List.every(r => r.level.toLowerCase() === 'hsk 1' || r.level.toLowerCase() === 'all'));

  // Filter by category
  const sampleList = await getPublicHskResources({ category: 'sample_exam' });
  assert.ok(sampleList.length > 0);
  assert.ok(sampleList.every(r => r.category === 'sample_exam'));

  // Filter by format
  const pdfList = await getPublicHskResources({ format: 'pdf' });
  assert.ok(pdfList.length > 0);
  assert.ok(pdfList.every(r => r.format === 'pdf'));

  // Search by keyword
  const searchChineTest = await getPublicHskResources({ search: 'chinesetest' });
  assert.ok(searchChineTest.length >= 1);
  assert.ok(searchChineTest.some(r => r.title.toLowerCase().includes('chinesetest') || r.source_url.includes('chinesetest')));

  // Search by nonexistent keyword
  const emptySearch = await getPublicHskResources({ search: 'nonexistentkeywordxyz123' });
  assert.equal(emptySearch.length, 0);
});

// ============================================================================
// 2. CONTENT IMPORT PIPELINE: STRICT VALIDATION & DUPLICATE DETECTION
// ============================================================================
test('Import Validation: validates correct payload structure, scores, and bounds', () => {
  const validJson = JSON.parse(generateSampleImportJson('HSK 1'));
  const report = validateHskImportPayload(validJson);

  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
  assert.ok(report.stats.totalQuestions >= 2);
  assert.equal(report.preview.level, 'HSK 1');
  assert.equal(report.preview.permission_status, 'reproducible');
});

test('Import Validation: rejects malformed data, invalid level, and missing questions', () => {
  // Null payload
  const emptyReport = validateHskImportPayload(null);
  assert.equal(emptyReport.valid, false);
  assert.ok(emptyReport.errors.length > 0);

  // Missing title & invalid level
  const badLevelPayload = {
    exam: {
      title: 'A', // too short
      level: 'HSK 99', // invalid
      passing_score: 120,
      duration_minutes: 40
    },
    questions: []
  };
  const badReport = validateHskImportPayload(badLevelPayload);
  assert.equal(badReport.valid, false);
  assert.ok(badReport.errors.some(e => e.includes('tiêu đề') || e.includes('title')));
  assert.ok(badReport.errors.some(e => e.includes('Cấp độ HSK')));
  assert.ok(badReport.errors.some(e => e.includes('ít nhất 1 câu hỏi')));
});

test('Import Validation: enforces question option bounds and detects out-of-range answers', () => {
  const invalidAnswerPayload = {
    exam: {
      title: 'Đề Kiểm Tra Ngoại Vi Điểm Số',
      level: 'HSK 2',
      passing_score: 120,
      duration_minutes: 50,
      source: 'Internal'
    },
    questions: [
      {
        question_number: 1,
        part_type: 'reading',
        question_text: 'Anh ấy đang đọc sách.',
        options: ['A. Đúng', 'B. Sai'],
        correct_answer: 4, // Out of bounds! Only 0 or 1 valid.
        points: 5
      }
    ]
  };

  const report = validateHskImportPayload(invalidAnswerPayload);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => e.includes('vượt quá số lượng')));
});

test('Import Validation: detects duplicate questions within payload and against existing bank', () => {
  const duplicatePayload = {
    exam: {
      title: 'Đề Có Câu Hỏi Trùng Lặp',
      level: 'HSK 1',
      passing_score: 120,
      duration_minutes: 40,
      source: 'Internal'
    },
    questions: [
      {
        question_number: 1,
        part_type: 'reading',
        question_text: '这是我的书。 (Đây là sách của tôi)',
        options: ['Đúng', 'Sai'],
        correct_answer: 0,
        points: 5
      },
      {
        question_number: 2,
        part_type: 'reading',
        question_text: '这是我的书。 (Đây là sách của tôi)', // Duplicate!
        options: ['Đúng', 'Sai'],
        correct_answer: 0,
        points: 5
      }
    ]
  };

  const report = validateHskImportPayload(duplicatePayload);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => e.includes('trùng lặp nội dung')));
});

// ============================================================================
// 3. IMPORT WORKFLOW: DRY-RUN VS COMMIT & ADMIN AUTHORIZATION
// ============================================================================
test('Import Workflow: rejects non-admin users from importing or previewing exams', async () => {
  const validJson = JSON.parse(generateSampleImportJson('HSK 2'));

  // Regular user attempt
  const res = await importHskExamWithValidation({
    jsonPayload: validJson,
    dryRun: true,
    user: regularUser
  });

  assert.equal(res.success, false);
  assert.ok(res.error.includes('Quyền hạn') || res.error.includes('Admin') || res.error.includes('Quản trị'));
});

test('Import Workflow: dry-run mode returns validation report without modifying storage', async () => {
  localStorage.clear();
  const sampleJson = JSON.parse(generateSampleImportJson('HSK 3'));
  sampleJson.exam.id = 'hsk3-dryrun-test-01';

  // Admin dry-run
  const dryRunRes = await importHskExamWithValidation({
    jsonPayload: sampleJson,
    dryRun: true,
    user: adminUser
  });

  assert.equal(dryRunRes.success, true);
  assert.equal(dryRunRes.dryRun, true);
  assert.ok(dryRunRes.preview);
  assert.equal(dryRunRes.preview.id, 'hsk3-dryrun-test-01');

  // Verify storage was NOT modified
  const storedExams = localStorage.getItem('hanzigo_imported_exams');
  assert.equal(storedExams, null, 'Dry-run must not write to persistent storage');
});

test('Import Workflow: commit mode atomically persists valid exam and questions with idempotent updates', async () => {
  localStorage.clear();
  const sampleJson = JSON.parse(generateSampleImportJson('HSK 1'));
  sampleJson.exam.id = 'hsk1-commit-unit-test';

  // Admin commits valid exam
  const commitRes = await importHskExamWithValidation({
    jsonPayload: sampleJson,
    dryRun: false,
    user: adminUser
  });

  assert.equal(commitRes.success, true);
  assert.equal(commitRes.dryRun, false);
  assert.equal(commitRes.examId, 'hsk1-commit-unit-test');

  // Verify stored in localStorage
  const storedExams = JSON.parse(localStorage.getItem('hanzigo_imported_exams'));
  assert.ok(storedExams.length >= 1);
  assert.equal(storedExams[0].id, 'hsk1-commit-unit-test');

  // Repeat commit (idempotent update, should not duplicate)
  sampleJson.exam.title = 'Đề HSK 1 Đã Cập Nhật Lần 2';
  const repeatCommit = await importHskExamWithValidation({
    jsonPayload: sampleJson,
    dryRun: false,
    user: adminUser
  });

  assert.equal(repeatCommit.success, true);
  const reloadedExams = JSON.parse(localStorage.getItem('hanzigo_imported_exams'));
  const matches = reloadedExams.filter(e => e.id === 'hsk1-commit-unit-test');
  assert.equal(matches.length, 1, 'Repeated import must update rather than duplicate');
  assert.equal(matches[0].title, 'Đề HSK 1 Đã Cập Nhật Lần 2');
});

// ============================================================================
// 4. REVIEW & PUBLISHING WORKFLOW: LIFECYCLE & HISTORICAL INTEGRITY
// ============================================================================
test('Review Workflow: enforces admin authorization for state transitions', async () => {
  // Regular user fails
  const userAttempt = await transitionContentState({
    contentId: 'res-cti-official-sample-hsk1',
    contentType: 'resource',
    targetState: 'draft',
    user: regularUser
  });
  assert.equal(userAttempt.success, false);
  assert.ok(userAttempt.error.includes('Từ chối truy cập') || userAttempt.error.includes('Admin'));

  // Admin user succeeds
  const adminAttempt = await transitionContentState({
    contentId: 'res-cti-official-sample-hsk1',
    contentType: 'resource',
    targetState: 'draft',
    user: adminUser
  });
  assert.equal(adminAttempt.success, true);
  assert.equal(adminAttempt.newState, 'draft');
  assert.equal(adminAttempt.isPublished, false);
});

test('Review Workflow: historical exam results remain immutable when exam status changes', async () => {
  localStorage.clear();

  // Student takes exam
  const attempt = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-01': 0, 'q-hsk1-01-02': 0 },
    timeSpentSeconds: 600,
    user: regularUser
  });

  assert.ok(attempt.id);
  assert.ok(Array.isArray(attempt.detailedResults));
  assert.ok(attempt.detailedResults.length > 0);

  // Admin transitions exam to 'draft' or updates question bank
  await transitionContentState({
    contentId: 'hsk1-mock-01',
    contentType: 'exam',
    targetState: 'draft',
    user: adminUser
  });

  // Verify historical attempt result snapshot has not been corrupted
  const history = await getUserExamHistory({ user: regularUser });
  assert.equal(history.length, 1);
  assert.equal(history[0].id, attempt.id);
  assert.equal(history[0].detailedResults[0].prompt, attempt.detailedResults[0].prompt);
  assert.equal(history[0].score, attempt.score);
});

// ============================================================================
// 5. PUBLIC QUALITY REPORTING (BROKEN LINKS & ACADEMIC AUDIT)
// ============================================================================
test('Quality Reporting: learners can report broken links and errors, admins can audit them', async () => {
  localStorage.clear();

  // Anonymous visitor reports broken link
  const repRes = await submitContentReport({
    resourceId: 'res-cti-official-sample-hsk1',
    reportType: 'broken_link',
    description: 'Trang web đích của CTI báo lỗi 404 không tìm thấy file PDF.',
    reporterEmail: 'learner@gmail.com'
  });

  assert.equal(repRes.success, true);
  assert.ok(repRes.reportId);

  // Rejection on empty or short description
  const badRep = await submitContentReport({
    reportType: 'typo_content',
    description: 'abc' // too short
  });
  assert.equal(badRep.success, false);

  // Admin audits reports
  const adminReports = await getAdminReports({ user: adminUser });
  assert.equal(adminReports.length, 1);
  assert.equal(adminReports[0].id, repRes.reportId);
  assert.equal(adminReports[0].report_type, 'broken_link');
  assert.equal(adminReports[0].reporter_email, 'learner@gmail.com');

  // Regular user cannot audit reports
  const userReports = await getAdminReports({ user: regularUser });
  assert.equal(userReports.length, 0);
});

// ============================================================================
// 6. SERVERLESS API DISPATCHER: /api/hsk/[action] INTEGRATION
// ============================================================================
test('API Router: GET /api/hsk/resources returns published resources', async () => {
  const { req, res } = createMockReqRes({
    method: 'GET',
    query: { action: 'resources' }
  });

  await hskRouter(req, res);
  assert.equal(res.getStatusCode(), 200);
  const data = res.getData();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.resources));
  assert.ok(data.resources.length >= 8);
});

test('API Router: POST /api/hsk/report accepts public incident reports', async () => {
  const { req, res } = createMockReqRes({
    method: 'POST',
    query: { action: 'report' },
    body: {
      resourceId: 'res-pku-coursera-hsk1',
      reportType: 'typo_content',
      description: 'Lỗi dịch nghĩa ở mục câu chữ 把 tại bài 3.',
      reporterEmail: 'test@example.com'
    }
  });

  await hskRouter(req, res);
  assert.equal(res.getStatusCode(), 200);
  const data = res.getData();
  assert.equal(data.success, true);
  assert.ok(data.reportId);
});

test('API Router: POST /api/hsk/import rejects unauthorized requests without admin auth', async () => {
  const { req, res } = createMockReqRes({
    method: 'POST',
    query: { action: 'import' },
    body: {
      jsonPayload: JSON.parse(generateSampleImportJson('HSK 1')),
      dryRun: true
    }
  });

  await hskRouter(req, res);
  assert.equal(res.getStatusCode(), 401);
  const data = res.getData();
  assert.ok(data.error.includes('xác thực') || data.error.includes('Admin'));
});

// ============================================================================
// 7. REGRESSION TESTS: PHASE 1 & PHASE 2 CAPABILITIES UNINTERRUPTED
// ============================================================================
test('Regression: existing exam listing, scoring, mistakes, and analytics continue to work', async () => {
  localStorage.clear();

  // Phase 1: getHskExams returns all mock exams
  const exams = await getHskExams();
  assert.ok(exams.length >= 4);

  // Phase 1: submit exam attempt
  const attempt = await submitExamAttempt({
    examId: 'hsk1-mock-01',
    submittedAnswers: { 'q-hsk1-01-01': 0, 'q-hsk1-01-02': 0 },
    timeSpentSeconds: 500,
    user: regularUser
  });
  assert.ok(attempt.id);
  assert.ok(attempt.score > 0);

  // Phase 2: study analytics computes correctly
  const history = await getUserExamHistory({ user: regularUser });
  const analytics = generateStudyAnalytics(history, []);
  assert.ok(analytics);
  assert.equal(analytics.totalExams, 1);
  assert.ok(analytics.passRate >= 0);
});
