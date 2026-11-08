import React, { lazy, Suspense } from 'react';
import PageLoader from '../PageLoader';
import HomePage from '../../pages/HomePage';
import DashboardPage from '../../pages/DashboardPage';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

/**
 * UnifiedDashboard Component
 * ONE HOMEPAGE — ROLE-ADAPTIVE EXPERIENCE — REAL DATA ONLY.
 * 
 * Selects and renders the appropriate dashboard experience based on authoritative user role:
 * - Anonymous (No user logged in): Renders Public HomePage Showcase & Hero
 * - Student role: Renders Student Dashboard (Personalized learning, SRS, Streak, XP, HSK Roadmap)
 * - Teacher role: Renders Teacher Dashboard (Classrooms, students, submissions, grading)
 * - Admin role: Renders Admin Dashboard (Users, moderation, materials, system metrics)
 */
export default function UnifiedDashboard({
  user = null,
  streak = 0,
  xp = 0,
  setActiveTab,
  openAuthModal,
  onSelectLesson,
  onNavigate = null
}) {
  // 1. Anonymous User: Display the engaging Public Product Homepage
  if (!user) {
    return (
      <HomePage
        user={null}
        streak={0}
        xp={0}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
        onSelectLesson={onSelectLesson}
      />
    );
  }

  // Authoritative role evaluation (Strictly checking user object)
  const role = user.role || 'student';
  const isBlocked = user.status === 'blocked';

  // 2. Blocked User Guard: Fallback to basic student view or public
  if (isBlocked) {
    return (
      <HomePage
        user={user}
        streak={streak}
        xp={xp}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
        onSelectLesson={onSelectLesson}
      />
    );
  }

  // 3. Admin User: System Operations & Governance Dashboard
  if (role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
      />
    );
  }

  // 4. Teacher User: Classrooms, Students & Grading Dashboard
  if (role === 'teacher') {
    return (
      <TeacherDashboard
        user={user}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
      />
    );
  }

  // 5. Student User: Default & Primary Personalized Learning Dashboard
  return (
    <DashboardPage
      user={user}
      setActiveTab={setActiveTab}
      onSelectLesson={onSelectLesson}
    />
  );
}

