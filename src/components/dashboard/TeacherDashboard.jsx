import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  ChevronRight,
  Award,
  BarChart3,
  Activity,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { 
  getTeacherOverviewMetrics,
  getClassLearningProgress,
  getStudentPerformanceData,
  getAssignmentStatusData,
  getClassActivityData,
  getStudentsRequiringAttention
} from '../../services/teacherAnalyticsService';
import { 
  getClassroomsForTeacher, 
  getAllSubmissionsForTeacher,
  getAllStudentsForTeacher
} from '../../services/classroomService';
import { playClickSound } from '../../utils/audio';
import {
  ClassProgressChart,
  StudentPerformanceChart,
  AssignmentStatusChart,
  ClassActivityChart,
  StudentsRequiringAttentionTable
} from './charts';

export default function TeacherDashboard({ user, setActiveTab, onNavigate = null }) {
  const teacherId = user?.id || user?.uid;
  const teacherName = user?.name || user?.email?.split('@')[0] || 'Thầy/Cô';

  const [metrics, setMetrics] = useState({
    totalClassrooms: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0,
    gradedSubmissions: 0,
    classrooms: []
  });

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [activityTimeframe, setActivityTimeframe] = useState('30d');

  const [progressData, setProgressData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [attentionStudents, setAttentionStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTeacherAnalytics = async (classId = selectedClassId, tf = activityTimeframe) => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);
    try {
      const [
        metricsRes,
        classesRes,
        progressRes,
        perfRes,
        statusRes,
        actRes,
        attentionRes,
        subsRes,
        studentsRes
      ] = await Promise.all([
        getTeacherOverviewMetrics(teacherId).catch(() => ({})),
        getClassroomsForTeacher(teacherId).catch(() => []),
        getClassLearningProgress(teacherId, classId).catch(() => null),
        getStudentPerformanceData(teacherId, classId).catch(() => null),
        getAssignmentStatusData(teacherId, classId).catch(() => null),
        getClassActivityData(teacherId, classId, tf).catch(() => null),
        getStudentsRequiringAttention(teacherId, classId).catch(() => []),
        getAllSubmissionsForTeacher(teacherId).catch(() => []),
        getAllStudentsForTeacher(teacherId).catch(() => [])
      ]);

      setMetrics(metricsRes || {});
      setClassrooms(classesRes || []);
      setProgressData(progressRes);
      setPerformanceData(perfRes);
      setStatusData(statusRes);
      setActivityData(actRes);
      setAttentionStudents(attentionRes || []);
      setSubmissions(subsRes || []);
    } catch (err) {
      console.warn('TeacherDashboard load analytics notice:', err);
      setError('Không thể tải toàn bộ hệ thống phân tích giảng dạy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      loadTeacherAnalytics(selectedClassId, activityTimeframe);
    }
  }, [teacherId]);

  const handleSelectClass = async (classId) => {
    setSelectedClassId(classId);
    try {
      const [progressRes, perfRes, statusRes, actRes, attentionRes] = await Promise.all([
        getClassLearningProgress(teacherId, classId).catch(() => null),
        getStudentPerformanceData(teacherId, classId).catch(() => null),
        getAssignmentStatusData(teacherId, classId).catch(() => null),
        getClassActivityData(teacherId, classId, activityTimeframe).catch(() => null),
        getStudentsRequiringAttention(teacherId, classId).catch(() => [])
      ]);
      setProgressData(progressRes);
      setPerformanceData(perfRes);
      setStatusData(statusRes);
      setActivityData(actRes);
      setAttentionStudents(attentionRes || []);
    } catch (err) {
      console.warn('Error reloading class analytics:', err);
    }
  };

  const handleTimeframeChange = async (tf) => {
    setActivityTimeframe(tf);
    try {
      const actRes = await getClassActivityData(teacherId, selectedClassId, tf);
      setActivityData(actRes);
    } catch (err) {
      console.warn('Error reloading activity data:', err);
    }
  };

  const pendingSubmissions = useMemo(() => {
    return submissions.filter(s => !s.graded);
  }, [submissions]);

  const handleNav = (tab, sub = null, param = null) => {
    playClickSound();
    if (tab === 'teacher' && onNavigate) {
      onNavigate(sub || 'dashboard', param);
    } else {
      if (sub && param) window.location.hash = `#${tab}/${sub}/${param}`;
      else if (sub) window.location.hash = `#${tab}/${sub}`;
      else window.location.hash = `#${tab}`;
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-[#1E293B] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/10">
            <GraduationCap size={14} />
            <span>Cổng Giảng Dạy & Trung Tâm Phân Tích Lớp Học</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Chào mừng trở lại, {teacherName}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Theo dõi tiến độ học tập, phổ điểm bài kiểm tra, kiểm soát tỷ lệ nộp bài và nhận diện học viên cần hỗ trợ kịp thời.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('teacher', 'studio')}
            className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Soạn giáo án và bài tập thông minh với AI"
          >
            <Sparkles size={15} className="text-amber-300" />
            <span>AI Lesson Studio</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('teacher', 'classes')}
            className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>Tạo / Quản lý Lớp</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('teacher', 'grading')}
            className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <CheckCircle2 size={15} />
            <span>Chấm bài tập ({pendingSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <GraduationCap size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Lớp đang quản lý</p>
            <p className="text-2xl font-black text-[#243447] dark:text-white">
              {metrics.totalClassrooms || classrooms.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tổng học viên</p>
            <p className="text-2xl font-black text-[#243447] dark:text-white">
              {metrics.totalStudents || 0}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Bài cần chấm gấp</p>
            <p className="text-2xl font-black text-[#243447] dark:text-white">
              {metrics.pendingSubmissions || pendingSubmissions.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">Tổng bài tập giao</p>
            <p className="text-2xl font-black text-[#243447] dark:text-white">
              {metrics.totalAssignments || 0}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Row 2: Class Learning Progress (Full Width Bar Chart) */}
      <div>
        <ClassProgressChart
          data={progressData}
          classrooms={classrooms}
          selectedClassId={selectedClassId}
          onSelectClass={handleSelectClass}
          loading={loading}
          error={error}
          onRetry={() => loadTeacherAnalytics(selectedClassId, activityTimeframe)}
        />
      </div>

      {/* 4. Row 3: Student Performance + Assignment Status (Grid 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <StudentPerformanceChart
            data={performanceData}
            classrooms={classrooms}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            loading={loading}
            error={error}
            onRetry={() => loadTeacherAnalytics(selectedClassId, activityTimeframe)}
          />
        </div>
        <div className="lg:col-span-6">
          <AssignmentStatusChart
            data={statusData}
            classrooms={classrooms}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            loading={loading}
            error={error}
            onRetry={() => loadTeacherAnalytics(selectedClassId, activityTimeframe)}
          />
        </div>
      </div>

      {/* 5. Row 4: Class Learning Activity (Timeline) */}
      <div>
        <ClassActivityChart
          data={activityData}
          timeframe={activityTimeframe}
          onTimeframeChange={handleTimeframeChange}
          classrooms={classrooms}
          selectedClassId={selectedClassId}
          onSelectClass={handleSelectClass}
          loading={loading}
          error={error}
          onRetry={() => loadTeacherAnalytics(selectedClassId, activityTimeframe)}
        />
      </div>

      {/* 6. Row 5: Students Requiring Pedagogical Attention */}
      <div>
        <StudentsRequiringAttentionTable
          students={attentionStudents}
          classrooms={classrooms}
          selectedClassId={selectedClassId}
          onSelectClass={handleSelectClass}
          onNavigateToStudent={(cId) => handleNav('teacher', 'classes', cId)}
          loading={loading}
          error={error}
          onRetry={() => loadTeacherAnalytics(selectedClassId, activityTimeframe)}
        />
      </div>

      {/* 7. Classrooms & Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Classrooms List */}
        <div className="lg:col-span-8">
          <DashboardWidget
            title="Danh sách Lớp học phụ trách"
            subtitle="Các phòng học bạn đang trực tiếp giảng dạy"
            icon={GraduationCap}
            loading={loading}
            error={error}
            empty={classrooms.length === 0}
            emptyMessage="Bạn chưa tạo lớp học nào. Hãy bấm 'Tạo / Quản lý Lớp' để bắt đầu giảng dạy."
            action={
              <button
                type="button"
                onClick={() => handleNav('teacher', 'classes')}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả</span>
                <ArrowRight size={13} />
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classrooms.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleNav('teacher', 'classes', c.id)}
                  className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                      Mã lớp: {c.code || c.class_code || '---'}
                    </span>
                    <span className="text-xs text-[#748092] flex items-center gap-1">
                      <Users size={12} />
                      <span>{c.student_count || 0} HV</span>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#243447] dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                      {c.name}
                    </h4>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">
                      {c.description || 'Chưa có mô tả lớp'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#F1E5D8]/60 dark:border-[#2B3A4F]/60 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                    <span>Vào chi tiết lớp</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>

        {/* Right Column (4 cols): Pending Submissions */}
        <div className="lg:col-span-4">
          <DashboardWidget
            title="Bài tập chờ chấm"
            subtitle="Bài nộp từ học sinh trong các lớp bạn quản lý"
            icon={CheckCircle2}
            loading={loading}
            empty={pendingSubmissions.length === 0}
            emptyMessage="🎉 Tuyệt vời! Bạn không còn bài nộp nào đang chờ chấm."
            action={
              <button
                type="button"
                onClick={() => handleNav('teacher', 'grading')}
                className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Bàn chấm bài</span>
                <ArrowRight size={13} />
              </button>
            }
          >
            <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
              {pendingSubmissions.slice(0, 4).map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-[#243447] dark:text-white truncate">
                      {sub.student_name || 'Học viên'}
                    </p>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">
                      {sub.assignment_title || 'Bài tập'} • {sub.classroom_name || 'Lớp học'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNav('teacher', 'grading')}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Chấm
                  </button>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>

      </div>

    </div>
  );
}
