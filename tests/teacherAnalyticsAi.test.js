import test from 'node:test';
import assert from 'node:assert/strict';

import {
  computeClassAnalytics,
  computeStudentDetailedAnalytics,
  getAtRiskStudents
} from '../src/services/teacherAnalyticsService.js';

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
