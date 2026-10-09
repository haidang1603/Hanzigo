import test from 'node:test';
import assert from 'node:assert/strict';

import {
  computeClassAnalytics,
  computeStudentDetailedAnalytics,
  getAtRiskStudents,
  sanitizeStudentDataForTeacher
} from '../src/services/teacherAnalyticsService.js';

import {
  createClassroom,
  getClassMembers
} from '../src/services/classroomService.js';

import {
  analyzeClassWithAi,
  generateAssignmentWithAi,
  generateLessonPlanWithAi
} from '../src/services/teacherAiService.js';

test('Rule-based At-Risk Detection: strictly flags at-risk & needs-attention without AI', async () => {
  const now = Date.now();
  const dayMs = 86400000;

  const mockStudents = [
    {
      student_id: 'stu-healthy',
      student_name: 'Nguyen Van Healthy',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_completion: 90,
      assignment_score: 85,
      attendance_rate: 95
    },
    {
      student_id: 'stu-inactive-risk',
      student_name: 'Le Thi Inactive',
      last_active: new Date(now - 8 * dayMs).toISOString(), // >= 7 days
      assignment_completion: 70,
      assignment_score: 75,
      attendance_rate: 80
    },
    {
      student_id: 'stu-low-completion',
      student_name: 'Tran Van Lazy',
      last_active: new Date(now - 2 * dayMs).toISOString(),
      assignment_completion: 40, // < 50%
      assignment_score: 70,
      attendance_rate: 80
    },
    {
      student_id: 'stu-low-score',
      student_name: 'Pham Thi Struggling',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_completion: 80,
      assignment_score: 55, // < 60%
      attendance_rate: 80
    }
  ];

  const analysis = getAtRiskStudents(mockStudents);

  // 1. Inactive >= 7 days -> AT RISK
  assert.equal(analysis.atRisk.length, 1);
  assert.equal(analysis.atRisk[0].student_id, 'stu-inactive-risk');
  assert.equal(analysis.atRisk[0].riskLevel, 'AT_RISK');

  // 2. Low completion (<50%) or Low score (<60%) -> NEEDS ATTENTION
  assert.equal(analysis.needsAttention.length, 2);
  const attentionIds = analysis.needsAttention.map(s => s.student_id);
  assert.ok(attentionIds.includes('stu-low-completion'));
  assert.ok(attentionIds.includes('stu-low-score'));

  // 3. Healthy students
  assert.equal(analysis.healthy.length, 1);
  assert.equal(analysis.healthy[0].student_id, 'stu-healthy');
  assert.equal(analysis.totalAtRisk, 3);
});

test('Class Analytics KPIs & Charts: correctly aggregates 8 KPIs and 4 charts', async () => {
  const mockStudents = [
    {
      id: 's1',
      student_id: 's1',
      classroom_id: 'class-1',
      student_name: 'Hoc Vien 1',
      xp: 400,
      words_learned: 80,
      hsk_level: 'HSK 2',
      study_hours: 5,
      last_active: new Date().toISOString()
    },
    {
      id: 's2',
      student_id: 's2',
      classroom_id: 'class-1',
      student_name: 'Hoc Vien 2',
      xp: 200,
      words_learned: 40,
      hsk_level: 'HSK 1',
      study_hours: 3,
      last_active: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const mockAssignments = [
    { id: 'asg-1', classroom_id: 'class-1', title: 'Bai 1' }
  ];

  const mockSubmissions = [
    { id: 'sub-1', assignment_id: 'asg-1', student_id: 's1', score: 90, status: 'graded' },
    { id: 'sub-2', assignment_id: 'asg-1', student_id: 's2', score: 70, status: 'graded' }
  ];

  const analytics = computeClassAnalytics('class-1', mockStudents, mockAssignments, mockSubmissions);

  // 8 KPIs
  assert.equal(analytics.totalStudents, 2);
  assert.equal(analytics.activeStudents, 2); // both active in <= 7 days
  assert.equal(analytics.averageScore, 80); // (90 + 70) / 2
  assert.equal(analytics.assignmentCompletion, 100); // 2 submissions for 1 asg * 2 students
  assert.ok(analytics.attendanceRate > 0);
  assert.ok(analytics.averageStudyTime > 0);
  assert.ok(analytics.vocabularyProgress >= 30);
  assert.ok(analytics.hskProgress > 0);

  // 4 Charts datasets
  assert.ok(Array.isArray(analytics.charts.completionDistribution));
  assert.ok(Array.isArray(analytics.charts.scoresDistribution));
  assert.ok(Array.isArray(analytics.charts.attendanceTrend));
  assert.ok(Array.isArray(analytics.charts.activityTimeline));
});

test('Student Detailed Analytics: computes all 11 required dimensions', async () => {
  const mockStudent = {
    student_id: 'stu-alice',
    student_name: 'Alice Wonder',
    xp: 650,
    streak: 12,
    words_learned: 130,
    study_hours: 8.5,
    last_active: new Date().toISOString()
  };

  const mockSubmissions = [
    { id: 'sub-1', student_id: 'stu-alice', score: 85, submitted_at: new Date().toISOString() },
    { id: 'sub-2', student_id: 'stu-alice', score: 95, submitted_at: new Date().toISOString() }
  ];

  const detailed = computeStudentDetailedAnalytics(mockStudent, 'class-1', mockSubmissions);

  // 11 fields check
  assert.equal(detailed.xp, 650);
  assert.equal(detailed.streak, 12);
  assert.equal(detailed.vocabulary, 130);
  assert.ok(detailed.srs !== undefined);
  assert.ok(detailed.srs.retentionRate > 0);
  assert.ok(detailed.listening >= 0 && detailed.listening <= 100);
  assert.ok(detailed.speaking >= 0 && detailed.speaking <= 100);
  assert.ok(detailed.reading >= 0 && detailed.reading <= 100);
  assert.ok(detailed.writing >= 0 && detailed.writing <= 100);
  assert.equal(detailed.studyTime, 8.5);
  assert.equal(detailed.assignmentScore, 90); // avg of 85 & 95
  assert.ok(detailed.attendance > 0);
});

test('AI Class Analysis: generates pedagogical strengths, weaknesses, and review suggestions', async () => {
  const dummyAnalytics = {
    hskLevel: 'HSK 3',
    totalStudents: 15,
    averageScore: 68,
    assignmentCompletion: 65,
    attendanceRate: 80,
    skills: {
      listening: 55, // weakness
      speaking: 62,
      reading: 78,
      writing: 72
    }
  };

  const res = await analyzeClassWithAi(dummyAnalytics);

  assert.ok(res.success);
  assert.ok(Array.isArray(res.data.classStrengths) && res.data.classStrengths.length > 0);
  assert.ok(Array.isArray(res.data.classWeaknesses) && res.data.classWeaknesses.length > 0);
  assert.ok(Array.isArray(res.data.recommendedReview) && res.data.recommendedReview.length > 0);
  assert.ok(Array.isArray(res.data.recommendedExercises) && res.data.recommendedExercises.length > 0);
});

test('AI Assignment Generator: generates draft questions requiring teacher review before publish', async () => {
  const res = await generateAssignmentWithAi({
    hskLevel: 'HSK 3',
    topic: 'Travel and Transportation',
    questionCount: 5
  });

  assert.ok(res.success);
  assert.equal(res.status, 'DRAFT_REQUIRES_TEACHER_REVIEW');
  assert.ok(res.data.title.length > 0);
  assert.equal(res.data.questions.length, 5);

  const firstQ = res.data.questions[0];
  assert.ok(firstQ.question && firstQ.question.length > 0);
  assert.ok(Array.isArray(firstQ.options) && firstQ.options.length === 4);
  assert.ok(firstQ.correctAnswer !== undefined);
  assert.ok(firstQ.explanation && firstQ.explanation.length > 0);
  assert.ok(firstQ.difficulty && firstQ.difficulty.length > 0);
});

test('AI Lesson Plan: generates 7-step pedagogical structure for teacher customization', async () => {
  const res = await generateLessonPlanWithAi({
    hskLevel: 'HSK 2',
    topic: 'Shopping in China',
    duration: 45
  });

  assert.ok(res.success);
  assert.equal(res.status, 'DRAFT_REQUIRES_TEACHER_REVIEW');

  const plan = res.data.lessonPlan;
  assert.ok(plan.warmUp);
  assert.ok(plan.vocabulary);
  assert.ok(plan.grammar);
  assert.ok(plan.listening);
  assert.ok(plan.speaking);
  assert.ok(plan.quiz);
  assert.ok(plan.homework);
});

// =========================================================================
// PHASE 4 SPECIFIC VERIFICATION TESTS
// =========================================================================

test('PHASE 4: Student Privacy - Sanitization strictly purges credentials, tokens and secrets', () => {
  const dirtyStudent = {
    id: 'stu-123',
    student_name: 'Nguyen Van Test',
    email: 'test@hanzigo.com',
    password: 'SuperSecretPassword123!',
    password_hash: '$2b$12$e80yqjV...',
    token: 'eyJhbGciOiJIUzI1Ni...',
    access_token: 'acc_token_secret',
    refresh_token: 'ref_token_secret',
    auth_token: 'auth_jwt_value',
    secret: 'hidden_client_secret',
    raw_user_meta_data: { phone: '0901234567' },
    private_account_info: { ssn: '999-99-9999' },
    xp: 450,
    streak: 5
  };

  const safe = sanitizeStudentDataForTeacher(dirtyStudent);

  assert.equal(safe.student_name, 'Nguyen Van Test');
  assert.equal(safe.xp, 450);
  assert.equal(safe.password, undefined);
  assert.equal(safe.password_hash, undefined);
  assert.equal(safe.token, undefined);
  assert.equal(safe.access_token, undefined);
  assert.equal(safe.refresh_token, undefined);
  assert.equal(safe.auth_token, undefined);
  assert.equal(safe.secret, undefined);
  assert.equal(safe.raw_user_meta_data, undefined);
  assert.equal(safe.private_account_info, undefined);
});

test('PHASE 4: Student Privacy - Teacher A cannot access Class B members', async () => {
  // Create Class B owned by Teacher B
  const teacherBId = 'teacher-owner-b';
  const teacherAId = 'teacher-intruder-a';

  const classCreateRes = await createClassroom({
    name: 'Lớp HSK 3 - Thầy B',
    description: 'Chỉ học viên lớp B được truy cập',
    hskLevel: 'HSK 3',
    teacherId: teacherBId
  });

  assert.ok(classCreateRes.success);
  const classBId = classCreateRes.classroom.id;

  // Teacher A tries to fetch members of Class B
  const intruderAccess = await getClassMembers(classBId, teacherAId);
  assert.deepEqual(intruderAccess, [], 'Teacher A must be blocked from accessing Class B');

  // Teacher B fetches members of Class B (authorized)
  const ownerAccess = await getClassMembers(classBId, teacherBId);
  assert.ok(Array.isArray(ownerAccess));
});

test('PHASE 4: Deterministic 7-factor Risk Detection (🔴 High Risk, 🟡 Needs Attention, 🟢 On Track)', () => {
  const now = Date.now();
  const dayMs = 86400000;

  const mockStudents = [
    // 1. High risk due to inactivity >= 7 days
    {
      id: 's-inact',
      student_id: 's-inact',
      last_active: new Date(now - 10 * dayMs).toISOString(),
      assignment_score: 80,
      assignment_completion: 80
    },
    // 2. High risk due to critical low score (< 50)
    {
      id: 's-lowscore',
      student_id: 's-lowscore',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 42,
      assignment_completion: 70
    },
    // 3. High risk due to critical low completion (< 35)
    {
      id: 's-lowcomp',
      student_id: 's-lowcomp',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 75,
      assignment_completion: 25
    },
    // 4. Needs attention due to repeated mistakes (>= 5)
    {
      id: 's-mistakes',
      student_id: 's-mistakes',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 75,
      assignment_completion: 80,
      repeated_mistakes: 7
    },
    // 5. Needs attention due to weak listening (< 50)
    {
      id: 's-listening',
      student_id: 's-listening',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 75,
      assignment_completion: 80,
      listening: 40
    },
    // 6. Needs attention due to weak speaking (< 50)
    {
      id: 's-speaking',
      student_id: 's-speaking',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 75,
      assignment_completion: 80,
      speaking: 42
    },
    // 7. Needs attention due to weak vocabulary (< 30)
    {
      id: 's-vocab',
      student_id: 's-vocab',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 75,
      assignment_completion: 80,
      words_learned: 18
    },
    // 8. On Track (Healthy)
    {
      id: 's-healthy',
      student_id: 's-healthy',
      last_active: new Date(now - 1 * dayMs).toISOString(),
      assignment_score: 92,
      assignment_completion: 95,
      listening: 90,
      speaking: 88,
      words_learned: 120
    }
  ];

  const result = getAtRiskStudents(mockStudents);

  // Check 3 tiers
  assert.equal(result.highRisk.length, 3, 'Must detect 3 High Risk students');
  assert.equal(result.needsAttention.length, 4, 'Must detect 4 Needs Attention students');
  assert.equal(result.onTrack.length, 1, 'Must detect 1 On Track student');

  // Verify Badges
  result.highRisk.forEach(s => assert.equal(s.riskBadge, '🔴 High Risk'));
  result.needsAttention.forEach(s => assert.equal(s.riskBadge, '🟡 Needs Attention'));
  result.onTrack.forEach(s => assert.equal(s.riskBadge, '🟢 On Track'));

  // Verify Risk Breakdown captures all 7 dimensions
  assert.ok(result.riskBreakdown.inactiveCount > 0);
  assert.ok(result.riskBreakdown.lowScoreCount > 0);
  assert.ok(result.riskBreakdown.lowCompletionCount > 0);
  assert.ok(result.riskBreakdown.repeatedMistakesCount > 0);
  assert.ok(result.riskBreakdown.weakListeningCount > 0);
  assert.ok(result.riskBreakdown.weakSpeakingCount > 0);
  assert.ok(result.riskBreakdown.weakVocabularyCount > 0);
});

test('PHASE 4: Empty Classroom - Returns meaningful empty state without crashing or fake stats', () => {
  const emptyAnalytics = computeClassAnalytics('empty-class-id', [], [], []);

  assert.equal(emptyAnalytics.isEmptyClass, true);
  assert.equal(emptyAnalytics.totalStudents, 0);
  assert.equal(emptyAnalytics.activeStudents, 0);
  assert.equal(emptyAnalytics.averageScore, 0);
  assert.equal(emptyAnalytics.completionRate, 0);
  assert.equal(emptyAnalytics.classProgress, 0);
  assert.ok(typeof emptyAnalytics.emptyStateMessage === 'string');
  assert.ok(emptyAnalytics.emptyStateMessage.includes('chưa có học viên'));
});

test('PHASE 4: AI Class Insights - Returns the 5 mandated pedagogical categories', async () => {
  const aggregatedInput = {
    totalStudents: 20,
    hskLevel: 'HSK 3',
    averageScore: 72,
    assignmentCompletion: 68,
    attendanceRate: 85,
    skillBreakdown: { listening: 60, speaking: 65, reading: 80, writing: 70 },
    inactiveCount: 2
  };

  const insights = await analyzeClassWithAi(aggregatedInput);

  assert.ok(insights.success);
  // 1. class strengths
  assert.ok(Array.isArray(insights.data.classStrengths) && insights.data.classStrengths.length > 0);
  // 2. class weaknesses
  assert.ok(Array.isArray(insights.data.classWeaknesses) && insights.data.classWeaknesses.length > 0);
  // 3. recommended teaching topics
  assert.ok(Array.isArray(insights.data.recommendedTeachingTopics) && insights.data.recommendedTeachingTopics.length > 0);
  // 4. students needing attention (anonymized cohort)
  assert.ok(Array.isArray(insights.data.studentsNeedingAttention) && insights.data.studentsNeedingAttention.length > 0);
  // 5. suggested activities
  assert.ok(Array.isArray(insights.data.suggestedActivities) && insights.data.suggestedActivities.length > 0);
});

test('PHASE 4: AI Assignment Generator - Covers 5 skills and CANNOT auto-publish', async () => {
  const res = await generateAssignmentWithAi({
    hskLevel: 'HSK 3',
    topic: 'Du lịch và Đặt vé tàu',
    questionCount: 5,
    assignmentType: 'Quiz'
  });

  assert.ok(res.success);
  // AI KHÔNG được tự động publish
  assert.equal(res.status, 'DRAFT_REQUIRES_TEACHER_REVIEW');
  assert.equal(res.published, false);
  assert.equal(res.reviewedByTeacher, false);

  // Covers 5 skills
  const skills = res.data.questions.map(q => q.skill);
  assert.ok(skills.includes('Vocabulary'), 'Must include Vocabulary');
  assert.ok(skills.includes('Grammar'), 'Must include Grammar');
  assert.ok(skills.includes('Listening'), 'Must include Listening');
  assert.ok(skills.includes('Reading'), 'Must include Reading');
  assert.ok(skills.includes('Speaking'), 'Must include Speaking');
  assert.equal(res.data.skillsCovered.length, 5);
});

test('PHASE 4: AI Lesson Generator - Generates all 6 lesson elements in draft state', async () => {
  const res = await generateLessonPlanWithAi({
    hskLevel: 'HSK 3',
    topic: 'Đi mua sắm tại chợ Bắc Kinh',
    duration: 45
  });

  assert.ok(res.success);
  assert.equal(res.status, 'DRAFT_REQUIRES_TEACHER_REVIEW');
  assert.equal(res.published, false);

  const lesson = res.data;
  // 1. Learning objective
  assert.ok(lesson.learningObjective && lesson.learningObjective.length > 0);
  // 2. Vocabulary
  assert.ok(Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0);
  // 3. Grammar
  assert.ok(Array.isArray(lesson.grammar) && lesson.grammar.length > 0);
  // 4. Examples
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.length > 0);
  // 5. Practice
  assert.ok(Array.isArray(lesson.practice) && lesson.practice.length > 0);
  // 6. Quiz
  assert.ok(Array.isArray(lesson.quiz) && lesson.quiz.length > 0);
});

test('PHASE 4: Fault Tolerance - Invalid AI output triggers graceful fallback without throwing', async () => {
  // Pass unexpected payload
  const fallbackAssignment = await generateAssignmentWithAi({
    hskLevel: 'UNKNOWN',
    topic: '',
    questionCount: -1
  });

  assert.ok(fallbackAssignment.success);
  assert.equal(fallbackAssignment.status, 'DRAFT_REQUIRES_TEACHER_REVIEW');
  assert.equal(fallbackAssignment.published, false);
  assert.ok(Array.isArray(fallbackAssignment.data.questions));
  assert.ok(fallbackAssignment.data.questions.length >= 1);
});
