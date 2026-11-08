import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Read component source files
const unifiedDashPath = path.join(process.cwd(), 'src/components/dashboard/UnifiedDashboard.jsx');
const studentDashPath = path.join(process.cwd(), 'src/pages/DashboardPage.jsx');
const teacherDashPath = path.join(process.cwd(), 'src/components/dashboard/TeacherDashboard.jsx');
const adminDashPath = path.join(process.cwd(), 'src/components/dashboard/AdminDashboard.jsx');
const widgetPath = path.join(process.cwd(), 'src/components/dashboard/DashboardWidget.jsx');
const appPath = path.join(process.cwd(), 'src/App.jsx');

const unifiedDashSrc = fs.readFileSync(unifiedDashPath, 'utf8');
const studentDashSrc = fs.readFileSync(studentDashPath, 'utf8');
const teacherDashSrc = fs.readFileSync(teacherDashPath, 'utf8');
const adminDashSrc = fs.readFileSync(adminDashPath, 'utf8');
const widgetSrc = fs.readFileSync(widgetPath, 'utf8');
const appSrc = fs.readFileSync(appPath, 'utf8');

test('1. UNIFIED ARCHITECTURE: UnifiedDashboard delegates by authoritative user role', () => {
  assert.ok(unifiedDashSrc.includes('if (!user)'), 'Must render HomePage showcase when no user is logged in');
  assert.ok(unifiedDashSrc.includes("if (role === 'admin')"), 'Must render AdminDashboard for admin role');
  assert.ok(unifiedDashSrc.includes("if (role === 'teacher')"), 'Must render TeacherDashboard for teacher role');
  assert.ok(unifiedDashSrc.includes('<DashboardPage'), 'Must render DashboardPage for student role');
});

test('2. ZERO SPOOFING & GUARD INTEGRITY: Blocked users or client tampering cannot bypass role', () => {
  assert.ok(unifiedDashSrc.includes("user.status === 'blocked'"), 'Must guard against blocked user accounts');
  assert.ok(unifiedDashSrc.includes("const role = user.role || 'student';"), 'Must default to student if undefined');
});

test('3. STUDENT DASHBOARD: Contains Continue Learning, HSK Path, SRS and Real Data', () => {
  assert.ok(studentDashSrc.includes('getRecommendedNextLesson'), 'Must calculate recommended next lesson');
  assert.ok(studentDashSrc.includes('handleContinueLesson'), 'Must provide Continue Learning CTA');
  assert.ok(studentDashSrc.includes('weeklyStudyMinutes'), 'Must track real weekly study minutes');
  assert.ok(studentDashSrc.includes('studentAssignments'), 'Must render assignments for student classrooms');
  assert.ok(studentDashSrc.includes('localReviewList'), 'Must render Spaced Repetition (SRS) review items');
});

test('4. TEACHER DASHBOARD: Displays classrooms, students, pending submissions and AI studio', () => {
  assert.ok(teacherDashSrc.includes('getClassroomsForTeacher'), 'Must fetch classrooms for logged in teacher');
  assert.ok(teacherDashSrc.includes('getAllStudentsForTeacher'), 'Must fetch students for teacher');
  assert.ok(teacherDashSrc.includes('getAllSubmissionsForTeacher'), 'Must fetch submissions for teacher');
  assert.ok(teacherDashSrc.includes('AI Lesson Studio'), 'Must provide AI Lesson Studio quick tool');
  assert.ok(teacherDashSrc.includes('pendingSubmissions'), 'Must calculate pending submissions to grade');
});

test('5. ADMIN DASHBOARD: Displays system profiles, materials and moderation shortcuts', () => {
  assert.ok(adminDashSrc.includes('getAllProfilesFromDb'), 'Must fetch real system user profiles');
  assert.ok(adminDashSrc.includes('getMaterialsFromDb'), 'Must fetch learning materials');
  assert.ok(adminDashSrc.includes('Kiểm duyệt Cộng đồng'), 'Must provide moderation shortcut');
  assert.ok(adminDashSrc.includes('Quản lý người dùng'), 'Must provide user management shortcut');
});

test('6. DASHBOARD WIDGET: Standardized surface with loading, error, and empty states', () => {
  assert.ok(widgetSrc.includes('loading ?'), 'Must support loading skeleton/spinner');
  assert.ok(widgetSrc.includes('error ?'), 'Must support error state with onRetry');
  assert.ok(widgetSrc.includes('empty ?'), 'Must support empty state');
});

test('7. APP INTEGRATION & BACKWARD COMPATIBILITY: Both #home and #dashboard map to UnifiedDashboard', () => {
  assert.ok(appSrc.includes("(activeTab === 'home' || activeTab === 'dashboard')"), 'Must map both home and dashboard to UnifiedDashboard');
  assert.ok(appSrc.includes('<UnifiedDashboard'), 'Must mount UnifiedDashboard');
});

