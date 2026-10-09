import test from 'node:test';
import assert from 'node:assert/strict';

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
  getUserJourneyProgress, 
  completeLesson, 
  getLessonById,
  getRecommendedNextLesson,
  getDailyMissions,
  claimDailyMission
} from '../src/services/learningPathService.js';

import { 
  syncLessonVocabToSrs 
} from '../src/services/vocabularyService.js';

import { 
  calculateTotalXp, 
  awardXp, 
  getUserStorageKey,
  getLocalDateString 
} from '../src/utils/gamification.js';

import { 
  buildStudentLearningProfile, 
  detectWeaknesses, 
  generateDailyLearningPlan 
} from '../src/services/aiLearningCoachService.js';

import { 
  getStoredMaterials 
} from '../src/utils/materialsStorage.js';

import { 
  getMaterialsForLesson 
} from '../src/services/materialsService.js';

import { 
  createClassroom,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentsForClassroom,
  getStudentSubmission,
  sanitizeStudentDataForTeacher
} from '../src/services/classroomService.js';

// Setup fresh state before testing
const testStudent = {
  uid: 'e2e-student-001',
  id: 'e2e-student-001',
  name: 'Trần Văn An',
  email: 'an.tran@example.com',
  role: 'student',
  hskLevel: 'HSK 1'
};

const testTeacher = {
  uid: 'e2e-teacher-001',
  id: 'e2e-teacher-001',
  name: 'Cô Nguyễn Thu Hà',
  email: 'coha.chinese@example.com',
  role: 'teacher'
};

const intruderTeacher = {
  uid: 'e2e-intruder-999',
  id: 'e2e-intruder-999',
  name: 'Giáo viên Xâm nhập',
  email: 'intruder@example.com',
  role: 'teacher'
};

test('SCENARIO 1: Self-Study Loop (Lộ trình -> Bài học -> Từ vựng/Hanzi -> SRS -> Missions -> Single XP)', async () => {
  localStorage.clear();

  // 1. Initial State: Student starts at lesson l-101
  const initialJourney = getUserJourneyProgress(testStudent);
  assert.equal(initialJourney.activeLessonId, 'l-101', 'Initial active lesson should be l-101');
  assert.equal(Object.keys(initialJourney.completedLessons).length, 0, 'No lessons completed yet');

  // 2. Complete Lesson l-101 with 95 points
  const result = completeLesson('l-101', 95, testStudent);
  assert.equal(result.success, true, 'completeLesson should succeed');
  assert.equal(result.isFirstTime, true, 'Should mark first completion');
  assert.equal(result.xpEarned, 50, 'First completion should award exactly 50 XP');

  // Allow async SRS sync to settle
  await new Promise(r => setTimeout(r, 20));

  // 3. Verify Journey Progress: l-101 completed, l-102 unlocked
  const updatedJourney = getUserJourneyProgress(testStudent);
  assert.ok(updatedJourney.completedLessons['l-101'], 'l-101 must be in completedLessons');
  assert.equal(updatedJourney.completedLessons['l-101'].score, 95);
  assert.equal(updatedJourney.completedLessons['l-101'].stars, 3);
  assert.equal(updatedJourney.activeLessonId, 'l-102', 'Next active lesson must advance to l-102');

  // 4. Verify SRS Enqueueing: Vocabulary from l-101 registered in localStorage
  const remKey = getUserStorageKey('hanzigo_vocab_remembered', testStudent);
  const rememberedJson = localStorage.getItem(remKey);
  assert.ok(rememberedJson, 'hanzigo_vocab_remembered must be saved');
  const remembered = JSON.parse(rememberedJson);
  assert.ok(remembered.length > 0, 'Vocabulary and Hanzi from l-101 should be auto-enqueued');

  // 5. Verify Daily Mission progress updated for lesson
  const missions = getDailyMissions(testStudent);
  const lessonMission = missions.find(m => m.category === 'lesson');
  assert.ok(lessonMission, 'Lesson mission should exist');
  assert.equal(lessonMission.current, 1, 'Lesson mission progress must increment to 1');
  assert.equal(lessonMission.isCompleted, true, 'Lesson mission must be completed');

  // 6. Claim Mission Reward & verify XP
  const claimResult = claimDailyMission(lessonMission.id, testStudent);
  assert.equal(claimResult.xpAwarded, 50, 'Lesson mission should award 50 XP');
  
  // Total XP should now be 50 (lesson) + 70 (7 vocab synced) + 50 (mission) = 170 XP
  const totalXp = calculateTotalXp(testStudent);
  assert.equal(totalXp, 170, 'Total XP should strictly equal 170 without double additions');

  // 7. Verify Idempotency: Re-completing same lesson in same day awards +10 review XP once, never duplicates +50 first completion
  const replayResult = completeLesson('l-101', 90, testStudent);
  assert.equal(replayResult.isFirstTime, false, 'Replay should not be first completion');
  assert.equal(replayResult.progress.completedLessons['l-101'].score, 95, 'Replay should retain previous best score (95)');
  assert.equal(replayResult.stars, 3, 'Replay should retain 3 stars');
  assert.equal(replayResult.xpEarned, 10, 'Reviewing lesson awards +10 review XP');
  
  // Total XP after review: 170 + 10 = 180 XP
  assert.equal(calculateTotalXp(testStudent), 180, 'Total XP after one review is 180');

  // Third replay in same day must be idempotent (+0 review XP)
  completeLesson('l-101', 88, testStudent);
  assert.equal(calculateTotalXp(testStudent), 180, 'Third review in same day must not duplicate XP');

  // Daily mission claim twice on same day must be rejected
  const replayClaim = claimDailyMission(lessonMission.id, testStudent);
  assert.equal(replayClaim.xpAwarded, 0, 'Cannot claim already-claimed mission');
});

test('SCENARIO 2: Remediation Loop (Student Gap -> AI Coach Detection -> Actionable Recommendation)', () => {
  localStorage.clear();

  // Create simulated student gap: student has completed 2 lessons but has low pronunciation score (< 70)
  // and has 3 overdue review cards
  const completedKey = getUserStorageKey('hanzigo_completed_lessons', testStudent);
  localStorage.setItem(completedKey, JSON.stringify(['l-101', 'l-102']));

  const pKey = getUserStorageKey('hanzigo_pronounce_history', testStudent);
  localStorage.setItem(pKey, JSON.stringify([
    { targetHanzi: '你好', overall: 55, timestamp: new Date().toISOString() },
    { targetHanzi: '谢谢', overall: 58, timestamp: new Date().toISOString() }
  ]));

  const revKey = getUserStorageKey('hanzigo_vocab_review', testStudent);
  localStorage.setItem(revKey, JSON.stringify(['w-hello', 'w-thanks', 'w-you']));

  // 1. Build profile using real derived data (zero fake scores)
  const profile = buildStudentLearningProfile(testStudent);
  assert.equal(profile.skills.pronunciation.hasEnoughData, true);
  assert.ok(profile.skills.pronunciation.score < 70, 'Pronunciation score must reflect honest average');
  assert.ok(profile.weakVocabulary.length > 0, 'Weak vocabulary must be identified');

  // 2. Detect weaknesses
  const weaknesses = detectWeaknesses(profile);
  const pronWeakness = weaknesses.find(w => w.skill === 'pronunciation');
  assert.ok(pronWeakness, 'AI Coach must detect pronunciation weakness');
  assert.equal(pronWeakness.targetRoute, 'pronunciation');

  // 3. Generate adaptive learning plan targeting the weakness
  const dailyPlan = generateDailyLearningPlan(profile, weaknesses, 20);
  assert.ok(dailyPlan.length >= 2, 'Daily plan must have at least 2 steps');
  
  // Must include SRS review step
  const srsStep = dailyPlan.find(p => p.type === 'srs');
  assert.ok(srsStep, 'Must include SRS step to clear overdue cards');

  // Must include pronunciation remediation step
  const pronStep = dailyPlan.find(p => p.type === 'pronunciation');
  assert.ok(pronStep, 'Must include pronunciation drill step to address detected weakness');
  assert.equal(pronStep.route, 'pronunciation');
});

test('SCENARIO 3: Materials Cohesion (Curriculum Integration & Bidirectional Linkage)', async () => {
  const materials = getStoredMaterials();
  assert.ok(materials.length >= 20, 'Materials library must have default verified items');

  // 1. Verify every material with relatedLessonId specifies valid curriculum reference
  const linkedItems = materials.filter(m => m.relatedLessonId);
  assert.ok(linkedItems.length > 0, 'Should have materials linked to curriculum');

  // 2. Materials mapping query
  const lessonMaterials = await getMaterialsForLesson('201');
  assert.ok(Array.isArray(lessonMaterials), 'getMaterialsForLesson must return array');

  // 3. Materials have required academic attribution
  linkedItems.forEach(item => {
    assert.ok(item.license, `Item ${item.title} must have license`);
    assert.ok(item.verificationStatus, `Item ${item.title} must have verificationStatus`);
    assert.ok(item.sourceUrl || item.downloadUrl, `Item ${item.title} must have link`);
  });
});

test('SCENARIO 4: Classroom Homework (Teacher Assigns -> Student Submits -> Teacher Grades -> Feedback)', async () => {
  localStorage.clear();

  // 1. Teacher creates classroom
  const classResult = await createClassroom({
    name: 'Hán Ngữ Sơ Cấp K12',
    level: 'HSK 1',
    description: 'Lớp học nền tảng giao tiếp và chữ Hán',
    teacherId: testTeacher.uid,
    currentUserRole: 'teacher'
  });
  assert.equal(classResult.success, true, 'Teacher should create classroom');
  const classroomId = classResult.classroom.id;

  // 2. Teacher assigns homework
  const assignResult = await createAssignment({
    classroomId,
    teacherId: testTeacher.uid,
    title: 'Bài tập 01: Luyện viết 5 chữ Hán cơ bản',
    description: 'Viết các chữ 一, 二, 三, 人, 大 vào vở ô mễ tự và ghi âm',
    contentType: 'Writing',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString() // due in 3 days
  });
  assert.equal(assignResult.success, true, 'Teacher should create assignment');
  const assignmentId = assignResult.assignment.id;

  // 3. Student views assignment list
  const assignments = await getAssignmentsForClassroom(classroomId, false);
  assert.equal(assignments.length, 1, 'Student should see published assignment');
  assert.equal(assignments[0].id, assignmentId);

  // 4. Student submits homework
  const submitResult = await submitAssignment({
    assignmentId,
    studentId: testStudent.uid,
    studentName: testStudent.name,
    content: {
      writtenChars: ['一', '二', '三', '人', '大'],
      notes: 'Em đã hoàn thành bài viết đúng thuận bút ạ.'
    }
  });
  assert.equal(submitResult.success, true, 'Student submission should succeed');
  const submissionId = submitResult.submission.id;

  // 5. Teacher grades submission and gives feedback
  const gradeResult = await gradeSubmission({
    submissionId,
    teacherId: testTeacher.uid,
    score: 95,
    feedback: 'Nét chữ rất đều và chuẩn ô mễ tự! Tiếp tục phát huy nhé em.'
  });
  assert.equal(gradeResult.success, true, 'Teacher grading should succeed');
  assert.equal(gradeResult.submission.score, 95);

  // 6. Student reads evaluated submission
  const studentSub = await getStudentSubmission(assignmentId, testStudent.uid);
  assert.ok(studentSub, 'Student submission must exist');
  assert.equal(studentSub.status, 'graded', 'Submission should be marked as graded');
  assert.equal(studentSub.score, 95, 'Student should see 95 points');
  assert.equal(studentSub.feedback, 'Nét chữ rất đều và chuẩn ô mễ tự! Tiếp tục phát huy nhé em.');
});

test('SCENARIO 5: RBAC Security (Student Denied Creation & Cross-Teacher Anti-Hijack)', async () => {
  localStorage.clear();

  // 1. Student attempts to create classroom -> must be rejected
  const studentAttempt = await createClassroom({
    name: 'Lớp Học Lậu',
    level: 'HSK 1',
    teacherId: testStudent.uid,
    currentUserRole: 'student'
  });
  assert.equal(studentAttempt.success, false, 'Student MUST NOT be allowed to create classroom');
  assert.match(studentAttempt.error, /quyền giáo viên/i);

  // 2. Setup legitimate classroom under Teacher A
  const teacherAClass = await createClassroom({
    name: 'Lớp Cô Hà',
    level: 'HSK 2',
    teacherId: testTeacher.uid,
    currentUserRole: 'teacher'
  });
  const assign = await createAssignment({
    classroomId: teacherAClass.classroom.id,
    teacherId: testTeacher.uid,
    title: 'Bài tập riêng'
  });
  const sub = await submitAssignment({
    assignmentId: assign.assignment.id,
    studentId: testStudent.uid,
    studentName: testStudent.name,
    content: 'Bài làm của học viên'
  });

  // 3. Teacher B (Intruder) attempts to grade Teacher A's student -> must be blocked
  const intruderGrade = await gradeSubmission({
    submissionId: sub.submission.id,
    teacherId: intruderTeacher.uid,
    score: 0,
    feedback: 'Bị hack điểm'
  });
  assert.equal(intruderGrade.success, false, 'Intruder teacher must be blocked from grading');
  assert.match(intruderGrade.error, /quyền chấm/i);

  // 4. Privacy: sanitizeStudentDataForTeacher purges sensitive account secrets
  const rawStudent = {
    id: 's-123',
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
    password: 'super_secret_password',
    token: 'jwt_secret_token_123',
    access_token: 'bearer_token'
  };
  const sanitized = sanitizeStudentDataForTeacher(rawStudent);
  assert.equal(sanitized.id, 's-123');
  assert.equal(sanitized.password, undefined, 'Password must be completely removed');
  assert.equal(sanitized.token, undefined, 'Token must be removed');
  assert.equal(sanitized.access_token, undefined, 'Access token must be removed');
});

test('SCENARIO 6: Error Resilience & Idempotency (Strict Deduplication & User Key Isolation)', () => {
  localStorage.clear();

  // 1. Idempotent XP Award
  const today = getLocalDateString();
  const testKey = `test_xp_idempotent_${today}`;

  const initialXp = calculateTotalXp(testStudent);
  const award1 = awardXp(50, testStudent, testKey);
  assert.equal(award1, initialXp + 50, 'First award should increase XP by 50');

  const award2 = awardXp(50, testStudent, testKey);
  assert.equal(award2, award1, 'Second award with same key must not increase XP');

  // Total XP should strictly be initial + 50, not initial + 100
  const finalXp = calculateTotalXp(testStudent);
  assert.equal(finalXp, initialXp + 50, 'Total XP must be exactly 50 after duplicate attempts');

  // 2. User Key Isolation: Guest vs Logged-in user
  const guestKey = getUserStorageKey('hanzigo_vocab_remembered', null);
  const studentKey = getUserStorageKey('hanzigo_vocab_remembered', testStudent);
  assert.notEqual(guestKey, studentKey, 'Storage keys must be strictly isolated across users');
  assert.equal(guestKey, 'hanzigo_vocab_remembered_guest');
  assert.equal(studentKey, `hanzigo_vocab_remembered_${testStudent.id}`);
});
