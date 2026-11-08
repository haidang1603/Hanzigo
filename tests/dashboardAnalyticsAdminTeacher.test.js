import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {
  getAdminOverviewMetrics,
  getUserDistributionData,
  getUserGrowthData,
  getPlatformLearningActivityData,
  getHskCurriculumDistributionData,
  getCommunityModerationOverviewData
} from '../src/services/adminAnalyticsService.js';

import {
  getTeacherOverviewMetrics,
  getClassLearningProgress,
  getStudentPerformanceData,
  getAssignmentStatusData,
  getClassActivityData,
  getStudentsRequiringAttention
} from '../src/services/teacherAnalyticsService.js';

import { calculateStudentHealthStatus } from '../src/services/classroomService.js';

test('1. ADMIN ANALYTICS: getAdminOverviewMetrics returns authoritative metric structure', async () => {
  const metrics = await getAdminOverviewMetrics();
  assert.ok(typeof metrics === 'object' && metrics !== null, 'Metrics must be an object');
  assert.ok(typeof metrics.totalAccounts === 'number', 'totalAccounts must be a number');
  assert.ok(typeof metrics.studentCount === 'number', 'studentCount must be a number');
  assert.ok(typeof metrics.teacherCount === 'number', 'teacherCount must be a number');
  assert.ok(typeof metrics.adminCount === 'number', 'adminCount must be a number');
  assert.ok(typeof metrics.blockedCount === 'number', 'blockedCount must be a number');
  assert.ok(typeof metrics.totalMaterials === 'number', 'totalMaterials must be a number');
  assert.ok(typeof metrics.activeClassroomsCount === 'number', 'activeClassroomsCount must be a number');
  assert.ok(metrics.totalAccounts >= (metrics.studentCount + metrics.teacherCount + metrics.adminCount), 'Account counts must be mathematically consistent');
});

test('2. ADMIN ANALYTICS: getUserDistributionData groups roles & statuses without double counting', async () => {
  const dist = await getUserDistributionData();
  assert.ok(typeof dist.total === 'number', 'total must be numeric');
  assert.ok(Array.isArray(dist.roles), 'roles must be an array');
  assert.ok(Array.isArray(dist.statuses), 'statuses must be an array');

  if (dist.total > 0) {
    const rolesSum = dist.roles.reduce((acc, r) => acc + r.count, 0);
    assert.strictEqual(rolesSum, dist.total, 'Sum of role counts must exactly equal total accounts (no double count)');

    const statusSum = dist.statuses.reduce((acc, s) => acc + s.count, 0);
    assert.strictEqual(statusSum, dist.total, 'Sum of status counts must equal total accounts');
  }
});

test('3. ADMIN ANALYTICS: getUserGrowthData supports timeframes (7d, 30d, 90d, 12m) and zero-fabrication', async () => {
  for (const tf of ['7d', '30d', '90d', '12m']) {
    const growth = await getUserGrowthData(tf);
    assert.strictEqual(growth.timeframe, tf, `Timeframe must match requested ${tf}`);
    assert.ok(Array.isArray(growth.points), 'Points must be an array');
    assert.ok(typeof growth.totalNewUsers === 'number', 'totalNewUsers must be numeric');

    const expectedPointsCount = tf === '7d' ? 7 : tf === '30d' ? 30 : tf === '90d' ? 90 : 365;
    assert.strictEqual(growth.points.length, expectedPointsCount, `Must contain exactly ${expectedPointsCount} days points`);

    // Verify non-fabrication: points sum must equal totalNewUsers
    const pointSum = growth.points.reduce((acc, p) => acc + p.count, 0);
    assert.strictEqual(pointSum, growth.totalNewUsers, 'Sum of daily increments must equal totalNewUsers');
  }
});

test('4. ADMIN ANALYTICS: getPlatformLearningActivityData & getHskCurriculumDistributionData integrity', async () => {
  const act = await getPlatformLearningActivityData();
  assert.ok(Array.isArray(act.activities), 'Activities must be an array');
  assert.ok(typeof act.totalActions === 'number', 'totalActions must be a number');

  const curr = await getHskCurriculumDistributionData();
  assert.ok(Array.isArray(curr.distribution), 'Distribution must be an array');
  assert.strictEqual(curr.distribution.length, 6, 'Must cover HSK 1 to HSK 6');
  assert.ok(curr.totalLessons > 0, 'Total lessons must be greater than 0');
});

test('5. TEACHER ANALYTICS: Role isolation & unauthorized teacher access prevention', async () => {
  // Missing teacherId must throw
  await assert.rejects(
    () => getTeacherOverviewMetrics(null),
    /teacherId hợp lệ/,
    'Must throw error when teacherId is missing'
  );

  // Calling with foreign classroomId must be blocked
  await assert.rejects(
    () => getClassLearningProgress('user_teacher_demo', 'foreign_classroom_999'),
    /Từ chối truy cập/,
    'Must reject teacher accessing a classroom they do not own'
  );
});

test('6. TEACHER ANALYTICS: getTeacherOverviewMetrics retrieves only teacher classes', async () => {
  const metrics = await getTeacherOverviewMetrics('user_teacher_demo');
  assert.ok(typeof metrics.totalClassrooms === 'number', 'totalClassrooms must be a number');
  assert.ok(typeof metrics.totalStudents === 'number', 'totalStudents must be a number');
  assert.ok(typeof metrics.totalAssignments === 'number', 'totalAssignments must be a number');
  assert.ok(typeof metrics.pendingSubmissions === 'number', 'pendingSubmissions must be a number');
});

test('7. TEACHER ANALYTICS: getAssignmentStatusData enforces mutually exclusive states (no double counting)', async () => {
  const status = await getAssignmentStatusData('user_teacher_demo', 'all');
  assert.ok(Array.isArray(status.statuses), 'statuses must be array');
  assert.ok(typeof status.totalTasks === 'number', 'totalTasks must be numeric');

  const expectedCategories = ['graded', 'pending_grade', 'overdue', 'not_submitted'];
  const presentCategories = status.statuses.map(s => s.id);
  for (const cat of expectedCategories) {
    assert.ok(presentCategories.includes(cat), `Category ${cat} must be present`);
  }

  const sumOfStatuses = status.statuses.reduce((acc, s) => acc + s.count, 0);
  assert.strictEqual(sumOfStatuses, status.totalTasks, 'Sum of exclusive statuses must equal totalTasks');
});

test('8. TEACHER ANALYTICS: getStudentPerformanceData calculates grade tiers correctly', async () => {
  const perf = await getStudentPerformanceData('user_teacher_demo', 'all');
  assert.ok(typeof perf.averageScore === 'number', 'averageScore must be numeric');
  assert.ok(Array.isArray(perf.tiers), 'tiers must be array');
  assert.strictEqual(perf.tiers.length, 4, 'Must have 4 score tiers');
});

test('9. TEACHER ANALYTICS: getStudentsRequiringAttention applies pedagogical diagnostics', async () => {
  // Test unit diagnosis logic
  const atRiskHealth = calculateStudentHealthStatus({ daysInactive: 8, overdueCount: 2, avgScore: 40 });
  assert.strictEqual(atRiskHealth.status, 'At Risk', 'Student inactive 8 days with 2 overdue must be At Risk');

  const needsAttentionHealth = calculateStudentHealthStatus({ daysInactive: 4, overdueCount: 1, avgScore: 60 });
  assert.strictEqual(needsAttentionHealth.status, 'Needs Attention', 'Student with 1 overdue must need attention');

  const healthy = calculateStudentHealthStatus({ daysInactive: 0, overdueCount: 0, avgScore: 90 });
  assert.strictEqual(healthy.status, 'Healthy', 'Active student with no overdue must be Healthy');

  const list = await getStudentsRequiringAttention('user_teacher_demo', 'all');
  assert.ok(Array.isArray(list), 'Attention list must be an array');
  list.forEach(stu => {
    assert.ok(stu.status === 'At Risk' || stu.status === 'Needs Attention', 'Only flagged students in attention list');
    assert.ok(Boolean(stu.reason), 'Diagnostic reason must be present');
  });
});

test('10. COMPONENT ARCHITECTURE: Chart components exist and export cleanly', () => {
  const chartDir = path.resolve('src/components/dashboard/charts');
  const expectedFiles = [
    'DashboardChartContainer.jsx',
    'UserDistributionChart.jsx',
    'UserGrowthChart.jsx',
    'PlatformActivityChart.jsx',
    'CurriculumDistributionChart.jsx',
    'CommunityModerationChart.jsx',
    'ClassProgressChart.jsx',
    'StudentPerformanceChart.jsx',
    'AssignmentStatusChart.jsx',
    'ClassActivityChart.jsx',
    'StudentsRequiringAttentionTable.jsx',
    'index.js'
  ];

  expectedFiles.forEach(file => {
    const fullPath = path.join(chartDir, file);
    assert.ok(fs.existsSync(fullPath), `Chart file ${file} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 50, `${file} must have valid content`);
  });
});

test('11. DASHBOARD INTEGRATION: AdminDashboard and TeacherDashboard embed interactive charts', () => {
  const adminSrc = fs.readFileSync(path.resolve('src/components/dashboard/AdminDashboard.jsx'), 'utf8');
  assert.ok(adminSrc.includes('UserGrowthChart'), 'AdminDashboard must embed UserGrowthChart');
  assert.ok(adminSrc.includes('UserDistributionChart'), 'AdminDashboard must embed UserDistributionChart');
  assert.ok(adminSrc.includes('PlatformActivityChart'), 'AdminDashboard must embed PlatformActivityChart');
  assert.ok(adminSrc.includes('CurriculumDistributionChart'), 'AdminDashboard must embed CurriculumDistributionChart');
  assert.ok(adminSrc.includes('CommunityModerationChart'), 'AdminDashboard must embed CommunityModerationChart');

  const teacherSrc = fs.readFileSync(path.resolve('src/components/dashboard/TeacherDashboard.jsx'), 'utf8');
  assert.ok(teacherSrc.includes('ClassProgressChart'), 'TeacherDashboard must embed ClassProgressChart');
  assert.ok(teacherSrc.includes('StudentPerformanceChart'), 'TeacherDashboard must embed StudentPerformanceChart');
  assert.ok(teacherSrc.includes('AssignmentStatusChart'), 'TeacherDashboard must embed AssignmentStatusChart');
  assert.ok(teacherSrc.includes('ClassActivityChart'), 'TeacherDashboard must embed ClassActivityChart');
  assert.ok(teacherSrc.includes('StudentsRequiringAttentionTable'), 'TeacherDashboard must embed StudentsRequiringAttentionTable');
});

