import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Copy, 
  RefreshCw, 
  Search, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Upload,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { 
  getClassroomsForTeacher, 
  getClassroomById, 
  createClassroom, 
  updateClassroom, 
  deleteClassroom,
  regenerateClassCode, 
  getClassMembers, 
  removeStudentFromClass, 
  getAssignmentsForClassroom, 
  createAssignment, 
  deleteAssignment, 
  getAllSubmissionsForTeacher, 
  gradeSubmission, 
  deleteSubmission,
  getAnnouncementsForClassroom, 
  createAnnouncement, 
  deleteAnnouncement, 
  getMaterialsForClassroom, 
  uploadClassMaterial, 
  deleteClassMaterial,
  calculateStudentHealthStatus,
  getAllStudentsForTeacher,
  addDemoStudent,
  clearDemoStudents,
  subscribeToTeacherSubmissionsRealtime,
  subscribeToClassroomRealtime
} from '../services/classroomService';
import { 
  createClassSession, 
  getActiveSessionForClass 
} from '../services/liveClassroomService';
import { 
  computeClassAnalytics, 
  computeStudentDetailedAnalytics, 
  getAtRiskStudents 
} from '../services/teacherAnalyticsService';
import ClassAnalyticsDashboard from '../components/teacher/ClassAnalyticsDashboard';
import StudentAnalyticsModal from '../components/teacher/StudentAnalyticsModal';
import AiTeacherStudioModal from '../components/teacher/AiTeacherStudioModal';
import CreateClassModal from '../components/teacher/CreateClassModal';
import CreateAssignmentModal from '../components/teacher/CreateAssignmentModal';
import CreateAnnouncementModal from '../components/teacher/CreateAnnouncementModal';
import UploadMaterialModal from '../components/teacher/UploadMaterialModal';
import GradingDrawerModal from '../components/teacher/GradingDrawerModal';
import StudentDetailModal from '../components/teacher/StudentDetailModal';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function TeacherDashboardPage({
  user,
  _setActiveTab,
  subRoute = 'dashboard',
  classId = null,
  onNavigate = null
}) {
  // Navigation helper
  const navigateTo = useCallback((route, targetId = null) => {
    playClickSound();
    if (onNavigate) {
      onNavigate(route, targetId);
    } else {
      const hash = targetId ? `#teacher/${route}/${targetId}` : `#teacher/${route}`;
      window.location.hash = hash;
    }
  }, [onNavigate]);

  // Toast feedback state
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Timestamp for pure date computations during render
  const [currentTimestamp] = useState(() => Date.now());

  // Primary data states
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterClass, setStudentFilterClass] = useState('all');

  // Sub-tab for class detail
  const [classDetailTab, setClassDetailTab] = useState('overview');

  // Modals state
  const [createClassModalOpen, setCreateClassModalOpen] = useState(false);
  const [createAsgModalOpen, setCreateAsgModalOpen] = useState(false);
  const [createAnnModalOpen, setCreateAnnModalOpen] = useState(false);
  const [uploadMatModalOpen, setUploadMatModalOpen] = useState(false);
  const [gradingModalSub, setGradingModalSub] = useState(null);
  const [studentDetailModal, setStudentDetailModal] = useState(null);

  // AI Teacher Studio & Pedagogical Analytics State
  const [aiStudioModalOpen, setAiStudioModalOpen] = useState(false);
  const [aiStudioInitialTab, setAiStudioInitialTab] = useState('analysis');
  const [studentAnalyticsModalData, setStudentAnalyticsModalData] = useState(null);
  const [filterOnlyAtRisk, setFilterOnlyAtRisk] = useState(false);
  const [analyticsClassId, setAnalyticsClassId] = useState('all');

  // Memoized Pedagogical Analytics & Deterministic At-Risk Detection
  const classAnalyticsData = useMemo(() => {
    const targetCid = analyticsClassId === 'all' ? (classId || null) : analyticsClassId;
    return computeClassAnalytics(targetCid, allStudents, assignments, submissions);
  }, [analyticsClassId, classId, allStudents, assignments, submissions]);

  const atRiskSummary = useMemo(() => {
    return getAtRiskStudents(allStudents);
  }, [allStudents]);

  // Open detailed student pedagogical analytics
  const handleOpenStudentAnalytics = useCallback((student) => {
    const detailed = computeStudentDetailedAnalytics(student, classId, submissions);
    setStudentAnalyticsModalData(detailed);
  }, [classId, submissions]);

  // Load teacher overview data
  const loadTeacherData = useCallback(async () => {
    setLoading(true);
    try {
      const teacherId = user?.uid || user?.id || 'user_teacher_demo';
      const [clsList, subsList, allStuList] = await Promise.all([
        getClassroomsForTeacher(teacherId),
        getAllSubmissionsForTeacher(teacherId),
        getAllStudentsForTeacher(teacherId)
      ]);
      setClassrooms(clsList || []);
      setSubmissions(subsList || []);
      setAllStudents(allStuList || []);

      // If viewing a specific class detail
      if (classId) {
        const [clsDetail, memList, asgList, annList, matList] = await Promise.all([
          getClassroomById(classId),
          getClassMembers(classId),
          getAssignmentsForClassroom(classId, true),
          getAnnouncementsForClassroom(classId),
          getMaterialsForClassroom(classId)
        ]);
        setCurrentClass(clsDetail);
        setMembers(memList || []);
        setAssignments(asgList || []);
        setAnnouncements(annList || []);
        setMaterials(matList || []);
      }
    } catch (err) {
      console.warn('Teacher data load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, classId]);

  useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  // Real-time synchronization for submissions and classroom changes
  useEffect(() => {
    const unsubSubmissions = subscribeToTeacherSubmissionsRealtime(() => {
      const teacherId = user?.uid || user?.id || 'user_teacher_demo';
      getAllSubmissionsForTeacher(teacherId).then(subsList => setSubmissions(subsList || [])).catch(() => {});
    });

    let unsubClass = () => {};
    if (classId) {
      unsubClass = subscribeToClassroomRealtime(classId, (event) => {
        if (event.type === 'MEMBER') {
          getClassMembers(classId).then(mems => setMembers(mems || [])).catch(() => {});
        } else if (event.type === 'ASSIGNMENT') {
          getAssignmentsForClassroom(classId, true).then(asgs => setAssignments(asgs || [])).catch(() => {});
        } else if (event.type === 'ANNOUNCEMENT') {
          getAnnouncementsForClassroom(classId).then(anns => setAnnouncements(anns || [])).catch(() => {});
        } else if (event.type === 'MATERIAL') {
          getMaterialsForClassroom(classId).then(mats => setMaterials(mats || [])).catch(() => {});
        }
      });
    }

    // Polling mỗi 3s cho classrooms, members và submissions (hỗ trợ đa tab, browser khác nhau & demo mode)
    const interval = setInterval(() => {
      const currentTeacherId = user?.uid || user?.id || 'user_teacher_demo';
      getClassroomsForTeacher(currentTeacherId).then(clsList => setClassrooms(clsList || [])).catch(() => {});
      getAllStudentsForTeacher(currentTeacherId).then(allStu => setAllStudents(allStu || [])).catch(() => {});
      if (classId) {
        getClassMembers(classId).then(mems => setMembers(mems || [])).catch(() => {});
      }
    }, 3000);

    return () => {
      unsubSubmissions();
      unsubClass();
      clearInterval(interval);
    };
  }, [user, classId]);

  // Publish assignment generated by AI (after mandatory teacher review)
  const handlePublishAiAssignment = useCallback(async (payload) => {
    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const targetClassId = payload.classroomId || classId || classrooms[0]?.id;
    if (!targetClassId) {
      showToast('Vui lòng tạo hoặc chọn lớp học trước khi giao bài.');
      return;
    }

    const contentPayload = {
      questions: payload.questions || []
    };

    const res = await createAssignment({
      classroomId: targetClassId,
      teacherId,
      title: payload.title,
      description: payload.description,
      contentType: payload.contentType || 'Quiz',
      contentPayload,
      dueDate: new Date(currentTimestamp + 7 * 86400000).toISOString().split('T')[0],
      published: true
    });

    if (res.success) {
      playSuccessSound();
      showToast(`Đã xuất bản bài tập "${payload.title}" thành công!`);
      loadTeacherData();
      setAiStudioModalOpen(false);
    } else {
      showToast(res.error || 'Lỗi khi giao bài tập');
    }
  }, [user, classId, classrooms, currentTimestamp, showToast, loadTeacherData]);

  // Save lesson plan generated by AI to classroom materials
  const handleSaveLessonPlanToMaterials = async ({ classroomId, title, content }) => {
    const targetClassId = classroomId || classId || classrooms[0]?.id;
    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    if (!targetClassId) return;

    await uploadClassMaterial({
      classroomId: targetClassId,
      teacherId,
      title: `[Giáo án AI] ${title}`,
      description: 'Giáo án 7 bước do AI hỗ trợ và Giáo viên hiệu chỉnh',
      fileUrl: 'data:text/plain;charset=utf-8,' + encodeURIComponent(content),
      fileType: 'doc'
    });
    loadTeacherData();
  };

  // Send encouragement / study reminder to student
  const handleSendStudentReminder = (studentData) => {
    playSuccessSound();
    showToast(`Đã gửi lời nhắc ôn tập & động viên tới học viên "${studentData?.name}"!`);
  };

  // Form states
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    description: '',
    hskLevel: 'HSK 1',
    maxStudents: 30
  });

  const [newAsgForm, setNewAsgForm] = useState({
    title: '',
    description: '',
    contentType: 'Vocabulary',
    dueDate: '',
    published: true,
    quizQuestion1: '',
    quizCorrect: 0
  });

  const [newAnnForm, setNewAnnForm] = useState({
    title: '',
    content: '',
    pinned: false
  });

  const [newMatForm, setNewMatForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'pdf'
  });

  const [gradeInput, setGradeInput] = useState({ score: '', feedback: '' });

  // Add demo student helper
  const handleAddDemoStudent = async (targetClassId) => {
    const cid = targetClassId || classId || classrooms[0]?.id;
    if (!cid) {
      showToast('Vui lòng tạo lớp học trước khi thêm học viên thử nghiệm.');
      return;
    }
    const res = await addDemoStudent(cid);
    if (res.success) {
      playSuccessSound();
      showToast('🎉 Đã thêm học viên thử nghiệm vào lớp thành công!');
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi thêm học viên');
    }
  };

  // Remove single student from class
  const handleRemoveStudent = async (studentId, studentName, targetClassId) => {
    const cid = targetClassId || classId;
    if (!cid || !studentId) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học viên "${studentName || 'này'}" khỏi lớp học?`)) {
      return;
    }
    const res = await removeStudentFromClass(cid, studentId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã xóa học viên "${studentName || ''}" khỏi lớp!`);
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi xóa học viên');
    }
  };

  // Clear all demo students
  const handleClearDemoStudents = async (targetClassId = null) => {
    const cid = targetClassId || (classId && currentClass ? currentClass.id : null);
    const msg = cid 
      ? 'Bạn có chắc chắn muốn xóa tất cả học viên thử nghiệm trong lớp này?' 
      : 'Bạn có chắc chắn muốn xóa tất cả học viên thử nghiệm trong toàn bộ các lớp học?';
    if (!window.confirm(msg)) return;

    const res = await clearDemoStudents(cid);
    if (res.success) {
      playSuccessSound();
      showToast('Đã xóa tất cả học viên thử nghiệm thành công!');
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi xóa học viên thử nghiệm');
    }
  };

  // Copy code helper
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    playClickSound();
    showToast(`Đã sao chép mã lớp: ${code}`);
  };

  // Regenerate code
  const handleRegenerateCode = async (clsId) => {
    if (!window.confirm('Bạn có chắc muốn cấp lại mã lớp mới? Mã cũ sẽ không còn hiệu lực.')) return;
    const res = await regenerateClassCode(clsId);
    if (res.success) {
      playSuccessSound();
      showToast('Đã làm mới mã lớp học thành công!');
      loadTeacherData();
    }
  };

  // Delete classroom
  const handleDeleteClass = async (clsId, clsName) => {
    if (!clsId) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${clsName || 'này'}"?\n\nHành động này sẽ xóa vĩnh viễn dữ liệu lớp học, bao gồm danh sách học viên, bài tập và thảo luận liên quan.`)) {
      return;
    }
    // Optimistically remove from UI state immediately for responsive feedback
    setClassrooms(prev => prev.filter(c => c.id !== clsId && String(c.id) !== String(clsId)));

    const res = await deleteClassroom(clsId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã xóa lớp "${clsName || ''}" thành công!`);
      if (classId === clsId) {
        navigateTo('classes');
      }
      await loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi xóa lớp học.');
      await loadTeacherData();
    }
  };

  // Create class submit
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassForm.name.trim()) {
      showToast('Vui lòng nhập tên lớp học');
      return;
    }
    const maxStudentsNum = Number(newClassForm.maxStudents);
    if (isNaN(maxStudentsNum) || maxStudentsNum < 1) {
      showToast('Sĩ số học sinh của lớp phải từ 1 học viên trở lên.');
      return;
    }

    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const res = await createClassroom({
      teacherId,
      name: newClassForm.name,
      description: newClassForm.description,
      hskLevel: newClassForm.hskLevel,
      maxStudents: maxStudentsNum
    });

    if (res.success) {
      playSuccessSound();
      showToast(`Đã tạo lớp "${newClassForm.name}" thành công!`);
      setCreateClassModalOpen(false);
      setNewClassForm({ name: '', description: '', hskLevel: 'HSK 1', maxStudents: 30 });
      if (res.classroom) {
        setClassrooms(prev => [res.classroom, ...(prev || []).filter(c => c.id !== res.classroom.id)]);
      }
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi tạo lớp.');
    }
  };

  // Create Assignment submit
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAsgForm.title.trim()) {
      showToast('Vui lòng nhập tiêu đề bài tập');
      return;
    }

    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const targetClassId = classId || classrooms[0]?.id;
    if (!targetClassId) {
      showToast('Vui lòng chọn hoặc tạo lớp học trước khi giao bài tập.');
      return;
    }

    const contentPayload = {};
    if (newAsgForm.contentType === 'Quiz') {
      contentPayload.questions = [
        {
          id: 'q1',
          prompt: newAsgForm.quizQuestion1 || 'Chọn đáp án đúng theo ngữ cảnh:',
          options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
          correctIndex: Number(newAsgForm.quizCorrect) || 0
        }
      ];
    }

    const res = await createAssignment({
      classroomId: targetClassId,
      teacherId,
      title: newAsgForm.title,
      description: newAsgForm.description,
      contentType: newAsgForm.contentType,
      content: contentPayload,
      dueDate: newAsgForm.dueDate || null,
      published: newAsgForm.published
    });

    if (res.success) {
      playSuccessSound();
      showToast('Đã giao bài tập mới thành công!');
      setCreateAsgModalOpen(false);
      setNewAsgForm({
        title: '',
        description: '',
        contentType: 'Vocabulary',
        dueDate: '',
        published: true,
        quizQuestion1: '',
        quizCorrect: 0
      });
      loadTeacherData();
    }
  };

  // Create Announcement submit
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnForm.title.trim() || !newAnnForm.content.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }
    const targetClassId = classId || classrooms[0]?.id;
    const teacherId = user?.uid || user?.id || 'user_teacher_demo';

    const res = await createAnnouncement({
      classroomId: targetClassId,
      teacherId,
      title: newAnnForm.title,
      content: newAnnForm.content,
      pinned: newAnnForm.pinned
    });

    if (res.success) {
      playSuccessSound();
      showToast('Đã đăng thông báo cho lớp học!');
      setCreateAnnModalOpen(false);
      setNewAnnForm({ title: '', content: '', pinned: false });
      loadTeacherData();
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (annId, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thông báo "${title || 'này'}"?`)) return;
    const res = await deleteAnnouncement(annId);
    if (res.success) {
      playSuccessSound();
      showToast('Đã xóa thông báo thành công!');
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi xóa thông báo');
    }
  };

  // Upload Material submit
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!newMatForm.title.trim() || !newMatForm.fileUrl.trim()) {
      showToast('Vui lòng nhập tên tài liệu và đường dẫn URL.');
      return;
    }
    const targetClassId = classId || classrooms[0]?.id;
    const teacherId = user?.uid || user?.id || 'user_teacher_demo';

    const res = await uploadClassMaterial({
      classroomId: targetClassId,
      teacherId,
      title: newMatForm.title,
      description: newMatForm.description,
      fileUrl: newMatForm.fileUrl,
      fileType: newMatForm.fileType
    });

    if (res.success) {
      playSuccessSound();
      showToast('Đã thêm tài liệu mới vào lớp học!');
      setUploadMatModalOpen(false);
      setNewMatForm({ title: '', description: '', fileUrl: '', fileType: 'pdf' });
      loadTeacherData();
    }
  };

  // Delete material
  const handleDeleteMaterial = async (matId, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title || 'này'}"?`)) return;
    const res = await deleteClassMaterial(matId);
    if (res.success) {
      playSuccessSound();
      showToast('Đã xóa tài liệu thành công!');
      loadTeacherData();
    } else {
      showToast(res.error || 'Lỗi khi xóa tài liệu');
    }
  };

  // Grade submission submit
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingModalSub) return;

    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const res = await gradeSubmission({
      submissionId: gradingModalSub.id,
      score: gradeInput.score,
      feedback: gradeInput.feedback,
      teacherId
    });

    if (res.success) {
      playSuccessSound();
      showToast(`Đã chấm điểm thành công: ${gradeInput.score}/100!`);
      setGradingModalSub(null);
      loadTeacherData();
    }
  };


  // Delete assignment handler
  const handleDeleteAssignment = async (asgId, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${title}"?`)) return;
    const res = await deleteAssignment(asgId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã xóa bài tập "${title}".`);
      loadTeacherData();
    }
  };

  // Delete submission handler
  const handleDeleteSubmission = async (subId, studentName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài nộp của "${studentName || 'học viên này'}"?`)) return;
    const res = await deleteSubmission(subId);
    if (res.success) {
      playSuccessSound();
      showToast('Đã xóa bài nộp thành công.');
      loadTeacherData();
    } else {
      showToast(res.error || 'Không thể xóa bài nộp.');
    }
  };

  // Start or Join Live Class Session
  const handleStartLiveSession = async (cls) => {
    playClickSound();
    const targetClass = cls || currentClass;
    if (!targetClass) return;

    // Check existing active session
    const existing = await getActiveSessionForClass(targetClass.id);
    if (existing && existing.status === 'live') {
      window.location.hash = `#classroom/${targetClass.id}/live/${existing.id}`;
      return;
    }

    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const res = await createClassSession({
      classroomId: targetClass.id,
      teacherId,
      title: `Buổi học trực tuyến: ${targetClass.name}`
    });

    if (res.success && res.session) {
      playSuccessSound();
      window.location.hash = `#classroom/${targetClass.id}/live/${res.session.id}`;
    } else {
      showToast(res.error || 'Không thể tạo phòng học trực tuyến.');
    }
  };

  // Computed dashboard metrics
  const totalClasses = classrooms.length;
  const totalStudents = useMemo(() => {
    return classrooms.reduce((sum, c) => sum + (c.student_count || 0), 0);
  }, [classrooms]);

  const activeAssignmentsCount = useMemo(() => {
    return assignments.filter(a => a.published).length || classrooms.length * 2;
  }, [assignments, classrooms]);

  const pendingGradingCount = useMemo(() => {
    return submissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
  }, [submissions]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] py-6 sm:py-8 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#243447] dark:bg-white text-white dark:text-[#243447] text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#45B97C]" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E85D3F] mb-1">
              <GraduationCap size={16} />
              <span>TEACHER MODE • QUẢN LÝ LỚP HỌC</span>
              {currentClass && (
                <>
                  <ChevronRight size={12} className="text-[#748092]" />
                  <span className="text-[#748092] dark:text-[#94A3B8]">{currentClass.name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white tracking-tight">
              {subRoute === 'classes' ? 'Quản lý Lớp học' :
               subRoute === 'grading' ? 'Trung tâm Chấm điểm' :
               subRoute === 'analytics' ? 'Phân tích Học tập & Thống kê' :
               subRoute === 'ai_studio' ? 'AI Sư phạm & Soạn bài' :
               subRoute === 'class_detail' ? currentClass?.name || 'Chi tiết Lớp học' :
               'Bảng điều khiển Giáo viên'}
            </h1>
            <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
              {subRoute === 'class_detail' 
                ? `Mã lớp: ${currentClass?.class_code} • Trình độ: ${currentClass?.hsk_level}`
                : subRoute === 'analytics'
                ? 'Theo dõi 8 chỉ số học tập, 4 biểu đồ trực quan và phát hiện học viên cần chú ý'
                : subRoute === 'ai_studio'
                ? 'Trợ lý AI hỗ trợ giáo viên phân tích lớp, sinh đề bài và thiết kế giáo án chuẩn HSK'
                : 'Theo dõi tiến độ học viên, quản lý bài tập và kết quả chấm điểm'}
            </p>
          </div>

          {/* Quick Sub-navigation tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subRoute === 'dashboard'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2]'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => navigateTo('classes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subRoute === 'classes'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2]'
              }`}
            >
              Lớp học ({totalClasses})
            </button>
            <button
              onClick={() => navigateTo('students')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subRoute === 'students'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2]'
              }`}
            >
              Học viên ({allStudents.length || totalStudents})
            </button>
            <button
              onClick={() => navigateTo('analytics')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subRoute === 'analytics'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2]'
              }`}
            >
              <BarChart3 size={13} />
              <span>Phân tích</span>
              {atRiskSummary.totalAtRisk > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => {
                setAiStudioInitialTab('analysis');
                setAiStudioModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles size={13} />
              <span>AI Sư phạm</span>
            </button>
            <button
              onClick={() => navigateTo('grading')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                subRoute === 'grading'
                  ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                  : 'bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2]'
              }`}
            >
              <span>Chấm điểm</span>
              {pendingGradingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingGradingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCreateClassModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Tạo lớp mới</span>
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {/* ========================================================== */}
        {subRoute === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Tổng số lớp</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">{totalClasses}</div>
                <p className="text-[11px] text-[#45B97C] font-semibold mt-1">Đang hoạt động tốt</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Tổng học sinh</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">{totalStudents}</div>
                <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] font-medium mt-1">Đã tham gia bằng code</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Bài tập hoạt động</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">{activeAssignmentsCount}</div>
                <p className="text-[11px] text-[#45B97C] font-semibold mt-1">Đã công bố cho lớp</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Cần chấm điểm</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white">{pendingGradingCount}</div>
                <p className="text-[11px] text-rose-500 font-semibold mt-1">
                  {pendingGradingCount > 0 ? 'Có bài tập chờ duyệt' : 'Đã chấm hết'}
                </p>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                Thao tác nhanh
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setCreateClassModalOpen(true)}
                  className="p-3 sm:p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#FFF5F2] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#E85D3F]/10 text-[#E85D3F] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Plus size={16} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">Tạo lớp học</p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Sinh mã code tức thì</p>
                </button>

                <button
                  onClick={() => setCreateAsgModalOpen(true)}
                  className="p-3 sm:p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#FFF5F2] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FileText size={16} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">Giao bài tập</p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Trắc nghiệm, nói, viết</p>
                </button>

                <button
                  onClick={() => navigateTo('students')}
                  className="p-3 sm:p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#FFF5F2] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Users size={16} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">Xem học sinh</p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Danh sách & tiến độ</p>
                </button>

                <button
                  onClick={() => setCreateAnnModalOpen(true)}
                  className="p-3 sm:p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#FFF5F2] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageSquare size={16} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">Đăng thông báo</p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Gửi lời nhắc tới cả lớp</p>
                </button>
              </div>
            </div>

            {/* Phase 4: Teacher AI & Advanced Analytics Hub */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-[#E85D3F]/10 border border-purple-500/25 dark:border-purple-500/35 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Teacher AI & Advanced Analytics
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-black uppercase">
                        Phase 4 Mới
                      </span>
                    </div>
                    <p className="text-xs text-[#243447] dark:text-[#E2E8F0] font-semibold mt-0.5">
                      Hệ thống phân tích năng lực học sinh, cảnh báo sớm học viên yếu và trợ lý AI soạn bài giảng 5 kỹ năng
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('analytics')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center"
                >
                  <BarChart3 size={14} />
                  <span>Mở 6 Biểu đồ Phân tích</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* 3-Tier Risk Detection Quick Status Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div 
                  onClick={() => {
                    setFilterOnlyAtRisk(true);
                    navigateTo('students');
                  }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between cursor-pointer hover:bg-rose-500/15 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🔴</span>
                    <div>
                      <p className="text-xs font-black text-rose-600 dark:text-rose-400">Nguy cơ cao (High Risk)</p>
                      <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Vắng &ge;7 ngày / Điểm &lt;50 / Nộp &lt;35%</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    {atRiskSummary.highRisk?.length || 0}
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setFilterOnlyAtRisk(true);
                    navigateTo('students');
                  }}
                  className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🟡</span>
                    <div>
                      <p className="text-xs font-black text-amber-600 dark:text-amber-400">Cần chú ý (Needs Attention)</p>
                      <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Điểm &lt;60 / Lỗi sai lặp lại / Yếu nghe-nói</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {atRiskSummary.needsAttention?.length || 0}
                  </span>
                </div>

                <div 
                  onClick={() => navigateTo('students')}
                  className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between cursor-pointer hover:bg-emerald-500/15 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🟢</span>
                    <div>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Đúng tiến độ (On Track)</p>
                      <p className="text-[10px] text-[#748092] dark:text-[#94A3B8]">Tiến độ học tập và chuyên cần ổn định</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {atRiskSummary.onTrack?.length || 0}
                  </span>
                </div>
              </div>

              {/* AI Tool Quick Launchers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setAiStudioInitialTab('analysis');
                    setAiStudioModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 hover:bg-white dark:hover:bg-[#1E293B] border border-purple-500/20 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#243447] dark:text-white">AI Chẩn đoán Lớp</p>
                    <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Điểm mạnh, điểm yếu & hoạt động</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAiStudioInitialTab('assignment');
                    setAiStudioModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 hover:bg-white dark:hover:bg-[#1E293B] border border-indigo-500/20 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#243447] dark:text-white">AI Soạn bài tập 5 kỹ năng</p>
                    <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Từ vựng, ngữ pháp, nghe, đọc, nói</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAiStudioInitialTab('lesson');
                    setAiStudioModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 hover:bg-white dark:hover:bg-[#1E293B] border border-teal-500/20 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#243447] dark:text-white">AI Soạn giáo án HSK</p>
                    <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">6 cấu phần sư phạm thực chiến</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Classrooms List Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#243447] dark:text-white">
                  Danh sách Lớp học phụ trách
                </h2>
                <button
                  onClick={() => navigateTo('classes')}
                  className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {loading ? (
                <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                  Đang tải dữ liệu lớp học...
                </div>
              ) : classrooms.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white dark:bg-[#1A2433] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#243447] dark:text-white">Chưa có lớp học nào</h3>
                    <p className="text-xs text-[#748092] mt-1">Bấm nút bên dưới để tạo lớp học đầu tiên và nhận mã mời học viên.</p>
                  </div>
                  <button
                    onClick={() => setCreateClassModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm"
                  >
                    Tạo lớp học ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classrooms.map((cls) => (
                    <div 
                      key={cls.id}
                      className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F]/40 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border border-[#E85D3F]/20">
                              {cls.hsk_level}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cls.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {cls.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#243447] dark:text-white line-clamp-1">
                            {cls.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRegenerateCode(cls.id)}
                            title="Làm mới mã lớp"
                            className="p-1.5 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF5F2] dark:hover:bg-[#243447] transition-colors cursor-pointer"
                          >
                            <RefreshCw size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.id, cls.name)}
                            title="Xóa lớp học"
                            className="p-1.5 rounded-xl text-[#748092] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2">
                        {cls.description || 'Không có mô tả bổ sung cho lớp học.'}
                      </p>

                      {/* Class Code Snippet */}
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#748092] dark:text-[#94A3B8]">Mã tham gia</p>
                          <p className="text-xs font-black tracking-wider text-[#E85D3F]">{cls.class_code}</p>
                        </div>
                        <button
                          onClick={() => handleCopyCode(cls.class_code)}
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1A2433] hover:bg-[#E85D3F] hover:text-white text-xs font-bold text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>

                      {/* Bottom Footer Details */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs text-[#748092] dark:text-[#94A3B8]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Users size={14} />
                          <span>{cls.student_count || 0} / {cls.max_students || 30} học viên</span>
                        </span>
                        <button
                          onClick={() => navigateTo('classes', cls.id)}
                          className="font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Vào quản lý lớp</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: FULL CLASSES MANAGEMENT */}
        {/* ========================================================== */}
        {subRoute === 'classes' && !classId && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Quản lý các lớp học, sĩ số, chia sẻ mã mời và đóng/lưu trữ lớp học
              </p>
              <button
                onClick={() => setCreateClassModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Tạo lớp mới</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/70 dark:bg-[#243447]/50 text-[11px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                    <th className="p-4 pl-6">Lớp học</th>
                    <th className="p-4">Trình độ</th>
                    <th className="p-4">Sĩ số</th>
                    <th className="p-4">Mã lớp</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Ngày tạo</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8]/60 dark:divide-[#2B3A4F]/60 text-xs">
                  {classrooms.map((cls) => (
                    <tr key={cls.id} className="hover:bg-[#FFF9F2]/40 dark:hover:bg-[#243447]/30 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-[#243447] dark:text-white">{cls.name}</p>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-1">{cls.description || 'Chưa có mô tả'}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[#E85D3F] bg-[#FFF5F2] dark:bg-[#2C1D1A] px-2 py-0.5 rounded-md">
                          {cls.hsk_level}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#243447] dark:text-white">
                        {cls.student_count || 0} / {cls.max_students || 30}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#E85D3F]">
                        <button
                          onClick={() => handleCopyCode(cls.class_code)}
                          title="Bấm để copy"
                          className="hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>{cls.class_code}</span>
                          <Copy size={12} className="text-[#748092]" />
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cls.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {cls.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </td>
                      <td className="p-4 text-[#748092] dark:text-[#94A3B8]">
                        {new Date(cls.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => navigateTo('classes', cls.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] font-bold text-xs hover:bg-[#E85D3F] hover:text-white transition-all cursor-pointer"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls.id, cls.name)}
                          className="p-1.5 rounded-xl text-[#748092] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                          title="Xóa lớp học"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2.1: PEDAGOGICAL & CLASS ANALYTICS (/teacher/analytics) */}
        {/* ========================================================== */}
        {subRoute === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Class filter & Action toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Phạm vi phân tích:</span>
                <select
                  value={analyticsClassId}
                  onChange={(e) => setAnalyticsClassId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                >
                  <option value="all">Toàn bộ lớp học ({classrooms.length} lớp)</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.hsk_level})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setAiStudioInitialTab('analysis');
                    setAiStudioModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>AI Phân tích lớp học</span>
                </button>

                <button
                  onClick={() => {
                    setAiStudioInitialTab('assignment');
                    setAiStudioModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#243447] text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold hover:bg-[#FFF9F2] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen size={14} />
                  <span>AI Tạo bài tập</span>
                </button>
              </div>
            </div>

            <ClassAnalyticsDashboard
              classAnalytics={classAnalyticsData}
              classrooms={classrooms}
              selectedClassId={analyticsClassId}
              onSelectClassId={setAnalyticsClassId}
              onOpenAiStudio={(tab) => {
                setAiStudioInitialTab(tab || 'analysis');
                setAiStudioModalOpen(true);
              }}
              onSelectStudent={handleOpenStudentAnalytics}
            />
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2.2: AI TEACHER STUDIO (/teacher/ai-studio) */}
        {/* ========================================================== */}
        {subRoute === 'ai_studio' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Sparkles size={32} />
              </div>
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-black text-[#243447] dark:text-white">HanziGo AI Teacher Studio</h2>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1.5">
                  Trợ lý sư phạm thông minh hỗ trợ giáo viên phân tích học lực, sinh bài tập phân hóa theo HSK và thiết kế giáo án 7 bước chuẩn sư phạm. Giáo viên luôn có toàn quyền duyệt và chỉnh sửa trước khi xuất bản.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setAiStudioInitialTab('analysis');
                    setAiStudioModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 size={15} />
                  <span>Mở Phân tích AI</span>
                </button>
                <button
                  onClick={() => {
                    setAiStudioInitialTab('assignment');
                    setAiStudioModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen size={15} />
                  <span>Tạo bài tập AI</span>
                </button>
                <button
                  onClick={() => {
                    setAiStudioInitialTab('lesson_plan');
                    setAiStudioModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white border border-purple-200 dark:border-purple-800 hover:bg-purple-50 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={15} />
                  <span>Soạn giáo án 7 bước</span>
                </button>
              </div>
            </div>

            {/* Embedded Class Analytics Overview under AI studio */}
            <ClassAnalyticsDashboard
              classAnalytics={classAnalyticsData}
              classrooms={classrooms}
              selectedClassId={analyticsClassId}
              onSelectClassId={setAnalyticsClassId}
              onOpenAiStudio={(tab) => {
                setAiStudioInitialTab(tab || 'analysis');
                setAiStudioModalOpen(true);
              }}
              onSelectStudent={handleOpenStudentAnalytics}
            />
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2.5: ALL STUDENTS OVERVIEW (/teacher/students) */}
        {/* ========================================================== */}
        {subRoute === 'students' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc email học viên..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E85D3F] w-56 sm:w-64"
                  />
                </div>

                <select
                  value={studentFilterClass}
                  onChange={e => setStudentFilterClass(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                >
                  <option value="all">Tất cả lớp học ({classrooms.length})</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setFilterOnlyAtRisk(prev => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    filterOnlyAtRisk
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/25'
                      : 'bg-[#FFF9F2] dark:bg-[#243447] text-[#748092] dark:text-[#94A3B8] border-[#F1E5D8] dark:border-[#2B3A4F] hover:text-rose-500'
                  }`}
                  title="Chỉ hiển thị học viên có nguy cơ bỏ học hoặc cần chú ý"
                >
                  <AlertTriangle size={13} className={filterOnlyAtRisk ? 'text-white' : 'text-rose-500'} />
                  <span>Cần chú ý ({atRiskSummary.totalAtRisk})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {allStudents.some(s => String(s.student_id).startsWith('demo-stu-') || s.student_name?.includes('thử nghiệm')) && (
                  <button
                    onClick={() => handleClearDemoStudents()}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    title="Xóa tất cả tài khoản học viên thử nghiệm đã tạo"
                  >
                    <Trash2 size={13} />
                    <span>Xóa học viên thử nghiệm</span>
                  </button>
                )}

                {classrooms.length > 0 && (
                  <button
                    onClick={() => handleAddDemoStudent()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm shadow-[#45B97C]/25 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus size={14} />
                    <span>Thêm học viên thử nghiệm</span>
                  </button>
                )}
              </div>
            </div>

            {/* Students Table */}
            {(() => {
              const filtered = allStudents.filter(s => {
                const matchesClass = studentFilterClass === 'all' || s.classroom_id === studentFilterClass;
                const matchesQuery = !studentSearch.trim() || 
                  (s.student_name && s.student_name.toLowerCase().includes(studentSearch.toLowerCase())) ||
                  (s.student_email && s.student_email.toLowerCase().includes(studentSearch.toLowerCase()));
                const matchesAtRisk = !filterOnlyAtRisk || 
                  atRiskSummary.atRisk.some(ar => (ar.student_id && ar.student_id === s.student_id) || (ar.id && ar.id === s.id)) ||
                  atRiskSummary.needsAttention.some(na => (na.student_id && na.student_id === s.student_id) || (na.id && na.id === s.id));
                return matchesClass && matchesQuery && matchesAtRisk;
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#1A2433] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-3xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                      <Users size={28} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#243447] dark:text-white">Chưa có học viên nào tham gia lớp</h3>
                      <p className="text-xs text-[#748092] mt-1 max-w-md mx-auto">
                        Học viên có thể nhập mã mời để vào lớp. Bạn cũng có thể bấm nút bên dưới để tạo học viên thử nghiệm và kiểm tra tính năng quản lý lớp.
                      </p>
                    </div>
                    {classrooms.length > 0 ? (
                      <button
                        onClick={() => handleAddDemoStudent()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#45B97C]/25"
                      >
                        + Thêm học viên thử nghiệm vào lớp
                      </button>
                    ) : (
                      <button
                        onClick={() => setCreateClassModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                      >
                        Tạo lớp học trước
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/70 dark:bg-[#243447]/50 text-[11px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                        <th className="p-4 pl-6">Học viên</th>
                        <th className="p-4">Lớp học</th>
                        <th className="p-4">Ngày tham gia</th>
                        <th className="p-4">Tiến độ XP & Streak</th>
                        <th className="p-4">Trạng thái sức khỏe</th>
                        <th className="p-4 pr-6 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1E5D8]/60 dark:divide-[#2B3A4F]/60 text-xs">
                      {filtered.map(mem => {
                        const daysInactive = mem.last_active 
                          ? Math.floor((currentTimestamp - new Date(mem.last_active)) / 86400000)
                          : 1;
                        const health = calculateStudentHealthStatus({
                          daysInactive,
                          completionRate: mem.lessons_completed ? Math.min(100, mem.lessons_completed * 10) : 70,
                          overdueCount: 0,
                          avgScore: 85
                        });

                        const isDemo = String(mem.student_id).startsWith('demo-stu-') || mem.student_name?.includes('thử nghiệm');

                        return (
                          <tr key={`${mem.id}_${mem.classroom_id}`} className="hover:bg-[#FFF9F2]/40 dark:hover:bg-[#243447]/30 transition-colors">
                            <td className="p-4 pl-6">
                              <div 
                                onClick={() => handleOpenStudentAnalytics(mem)}
                                className="flex items-center gap-3 cursor-pointer group"
                                title="Xem phân tích chi tiết học viên"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                                  {mem.student_name ? mem.student_name.charAt(0).toUpperCase() : 'H'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors">{mem.student_name}</p>
                                    {isDemo && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Thử nghiệm
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#748092]">{mem.student_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-[#243447] dark:text-white">{mem.classroom_name || 'Lớp học'}</p>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF5F2] text-[#E85D3F] border border-[#E85D3F]/20">
                                {mem.classroom_hsk || mem.hsk_level || 'HSK 1'}
                              </span>
                            </td>
                            <td className="p-4 text-[#748092]">
                              {new Date(mem.joined_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#E85D3F]">{mem.xp || 0} XP</div>
                              <div className="text-[10px] text-[#748092]">Chuỗi {mem.streak || 0} ngày</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${health.badgeClass}`}>
                                {health.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenStudentAnalytics(mem)}
                                className="px-2.5 py-1.5 rounded-xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] font-bold text-xs hover:bg-[#E85D3F] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                                title="Xem đầy đủ 11 chỉ số chi tiết của học viên"
                              >
                                <BarChart3 size={12} />
                                <span>Phân tích</span>
                              </button>
                              <button
                                onClick={() => navigateTo('classes', mem.classroom_id)}
                                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#243447] text-[#243447] dark:text-white border border-[#F1E5D8] font-bold text-xs hover:bg-[#FFF9F2] cursor-pointer"
                              >
                                Vào lớp
                              </button>
                              <button
                                onClick={() => handleRemoveStudent(mem.student_id, mem.student_name, mem.classroom_id)}
                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                                title="Xóa học viên khỏi lớp này"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 3: CLASSROOM DETAIL (TABS: Overview, Students, Asg, Mat, Ann, Progress, Settings) */}
        {/* ========================================================== */}
        {classId && currentClass && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Class banner card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#E85D3F] text-white">
                    {currentClass.hsk_level}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Sĩ số: {members.length} / {currentClass.max_students}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                  {currentClass.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
                  {currentClass.description || 'Chưa có mô tả lớp học.'}
                </p>
              </div>

              {/* Class code action box */}
              <div className="flex items-center gap-2 bg-[#FFF9F2] dark:bg-[#243447] p-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#748092]">Mã lớp học</p>
                  <p className="text-sm font-black text-[#E85D3F] tracking-wider">{currentClass.class_code}</p>
                </div>
                <button
                  onClick={() => handleCopyCode(currentClass.class_code)}
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1A2433] hover:bg-[#E85D3F] hover:text-white text-xs font-bold text-[#243447] dark:text-white border border-[#F1E5D8] dark:border-[#2B3A4F] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => handleStartLiveSession(currentClass)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:opacity-95 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 whitespace-nowrap"
                  title="Bắt đầu phòng học trực tuyến"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Mở phòng Live</span>
                </button>
              </div>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex items-center gap-1 border-b border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto pb-2">
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'students', label: `Học sinh (${members.length})` },
                { id: 'analytics', label: 'Phân tích học tập' },
                { id: 'assignments', label: `Bài tập (${assignments.length})` },
                { id: 'materials', label: `Tài liệu (${materials.length})` },
                { id: 'announcements', label: `Thông báo (${announcements.length})` },
                { id: 'progress', label: 'Chẩn đoán học tập' },
                { id: 'settings', label: 'Cài đặt lớp' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setClassDetailTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    classDetailTab === tab.id
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW */}
            {classDetailTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Announcements Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#E85D3F]" />
                      <span>Thông báo mới nhất</span>
                    </h3>
                    <button
                      onClick={() => setCreateAnnModalOpen(true)}
                      className="text-xs font-bold text-[#E85D3F] hover:underline cursor-pointer"
                    >
                      + Đăng bài
                    </button>
                  </div>
                  {announcements.length === 0 ? (
                    <p className="text-xs text-[#748092] py-4 text-center">Chưa có thông báo nào trong lớp.</p>
                  ) : (
                    announcements.slice(0, 3).map(ann => (
                      <div key={ann.id} className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#243447] dark:text-white">{ann.title}</p>
                          {ann.pinned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Ghim</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-2">{ann.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Upcoming Assignments Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                      <span>Bài tập sắp tới</span>
                    </h3>
                    <button
                      onClick={() => setCreateAsgModalOpen(true)}
                      className="text-xs font-bold text-[#E85D3F] hover:underline cursor-pointer"
                    >
                      + Giao bài
                    </button>
                  </div>
                  {assignments.length === 0 ? (
                    <p className="text-xs text-[#748092] py-4 text-center">Chưa có bài tập nào được giao.</p>
                  ) : (
                    assignments.slice(0, 3).map(asg => (
                      <div key={asg.id} className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#243447] dark:text-white">{asg.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                            {asg.content_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                          Hạn chót: {asg.due_date ? new Date(asg.due_date).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: STUDENTS */}
            {classDetailTab === 'students' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-[#748092]">Danh sách {members.length} học viên đang theo học</p>
                  <div className="flex items-center gap-3">
                    {members.some(m => String(m.student_id).startsWith('demo-stu-') || m.student_name?.includes('thử nghiệm')) && (
                      <button
                        onClick={() => handleClearDemoStudents(currentClass.id)}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                        title="Xóa tất cả học viên thử nghiệm trong lớp này"
                      >
                        <Trash2 size={12} />
                        <span>Xóa học viên thử nghiệm</span>
                      </button>
                    )}
                    <button
                      onClick={() => setCreateAnnModalOpen(true)}
                      className="text-xs font-bold text-[#E85D3F] hover:underline cursor-pointer"
                    >
                      Gửi thông báo tới lớp
                    </button>
                  </div>
                </div>

                {members.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white dark:bg-[#1A2433] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#243447] dark:text-white">Chưa có học viên nào trong lớp này</h3>
                      <p className="text-xs text-[#748092] mt-1 max-w-md mx-auto">
                        Cung cấp mã mời <strong className="font-mono text-[#E85D3F]">{currentClass.class_code}</strong> cho học viên để tham gia, hoặc thêm học viên thử nghiệm để kiểm tra tính năng.
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddDemoStudent(currentClass.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#45B97C]/25"
                    >
                      + Thêm học viên thử nghiệm vào lớp
                    </button>
                  </div>
                ) : (
                <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/70 dark:bg-[#243447]/50 text-[11px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                        <th className="p-4 pl-6">Học viên</th>
                        <th className="p-4">Trình độ</th>
                        <th className="p-4">Ngày tham gia</th>
                        <th className="p-4">Tiến độ XP & Streak</th>
                        <th className="p-4">Trạng thái sức khỏe</th>
                        <th className="p-4 pr-6 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1E5D8]/60 dark:divide-[#2B3A4F]/60 text-xs">
                      {members.map((mem) => {
                        const daysInactive = mem.last_active 
                          ? Math.floor((currentTimestamp - new Date(mem.last_active)) / 86400000)
                          : 1;
                        const health = calculateStudentHealthStatus({
                          daysInactive,
                          completionRate: mem.lessons_completed ? Math.min(100, mem.lessons_completed * 10) : 70,
                          overdueCount: 0,
                          avgScore: 85
                        });

                        const isClassDemo = String(mem.student_id).startsWith('demo-stu-') || mem.student_name?.includes('thử nghiệm');

                        return (
                          <tr key={mem.id} className="hover:bg-[#FFF9F2]/40 dark:hover:bg-[#243447]/30 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {mem.student_name ? mem.student_name.charAt(0).toUpperCase() : 'H'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-[#243447] dark:text-white">{mem.student_name}</p>
                                    {isClassDemo && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        Thử nghiệm
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#748092]">{mem.student_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-[#243447] dark:text-white">
                              {mem.hsk_level || 'HSK 1'}
                            </td>
                            <td className="p-4 text-[#748092]">
                              {new Date(mem.joined_at).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#E85D3F]">{mem.xp || 0} XP</div>
                              <div className="text-[10px] text-[#748092]">Chuỗi {mem.streak || 0} ngày</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${health.badgeClass}`}>
                                {health.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right space-x-2">
                              <button
                                onClick={() => setStudentDetailModal({ ...mem, health })}
                                className="px-2.5 py-1 rounded-xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] font-bold text-xs hover:bg-[#E85D3F] hover:text-white transition-all cursor-pointer"
                              >
                                Xem tiến độ
                              </button>
                              <button
                                onClick={() => handleRemoveStudent(mem.student_id, mem.student_name)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                title="Xóa học viên khỏi lớp"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {classDetailTab === 'analytics' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <ClassAnalyticsDashboard
                  classAnalytics={classAnalyticsData}
                  classrooms={classrooms}
                  selectedClassId={currentClass.id}
                  onSelectClassId={() => {}}
                  onOpenAiStudio={(tab) => {
                    setAiStudioInitialTab(tab || 'analysis');
                    setAiStudioModalOpen(true);
                  }}
                  onSelectStudent={handleOpenStudentAnalytics}
                />
              </div>
            )}

            {/* TAB: ASSIGNMENTS */}
            {classDetailTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#748092]">Quản lý bài tập đã giao cho lớp</p>
                  <button
                    onClick={() => setCreateAsgModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Giao bài tập mới</span>
                  </button>
                </div>

                {assignments.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                    Chưa có bài tập nào được giao cho lớp này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map(asg => (
                      <div key={asg.id} className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                              {asg.content_type}
                            </span>
                            <h4 className="text-sm font-bold text-[#243447] dark:text-white mt-1">
                              {asg.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Xóa bài tập"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{asg.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-[#F1E5D8]/70 text-[11px] text-[#748092]">
                          <span>Hạn nộp: {asg.due_date ? new Date(asg.due_date).toLocaleDateString('vi-VN') : 'Tự do'}</span>
                          <span className="font-bold text-[#E85D3F]">{asg.submission_count || 0} bài đã nộp</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MATERIALS */}
            {classDetailTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#748092]">Kho tài liệu riêng dành cho thành viên của lớp</p>
                  <button
                    onClick={() => setUploadMatModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload size={14} />
                    <span>Tải lên tài liệu</span>
                  </button>
                </div>

                {materials.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                    Chưa có tài liệu nào tải lên.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map(mat => (
                      <div key={mat.id} className="p-4 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E85D3F] flex items-center justify-center font-bold text-xs uppercase">
                            {mat.file_type}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#243447] dark:text-white">{mat.title}</p>
                            <p className="text-[11px] text-[#748092] line-clamp-1">{mat.description || mat.file_url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a 
                            href={mat.file_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF5F2] cursor-pointer"
                            title="Mở tài liệu"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                            title="Xóa tài liệu này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {classDetailTab === 'announcements' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#748092]">Bảng tin thông báo của lớp học</p>
                  <button
                    onClick={() => setCreateAnnModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Tạo thông báo mới</span>
                  </button>
                </div>

                {announcements.map(ann => (
                  <div key={ann.id} className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#243447] dark:text-white">{ann.title}</h4>
                        {ann.pinned && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Đã ghim</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#748092]">
                          {new Date(ann.created_at).toLocaleDateString('vi-VN')}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                          title="Xóa thông báo này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed whitespace-pre-line">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: PROGRESS DIAGNOSTICS */}
            {classDetailTab === 'progress' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  ⚠️ <strong>Chẩn đoán Học thuật:</strong> Phân loại dựa trên dữ liệu hoạt động thực tế (tần suất học, tỷ lệ nộp bài, điểm trung bình). Giúp giáo viên chủ động nhắc nhở học viên trước khi bị gián đoạn kiến thức.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {members.map(mem => {
                    const daysInactive = mem.last_active 
                      ? Math.floor((currentTimestamp - new Date(mem.last_active)) / 86400000)
                      : 1;
                    const health = calculateStudentHealthStatus({
                      daysInactive,
                      completionRate: mem.lessons_completed ? Math.min(100, mem.lessons_completed * 10) : 70,
                      overdueCount: 0,
                      avgScore: 85
                    });

                    return (
                      <div key={mem.id} className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${health.badgeClass}`}>
                            {health.status}
                          </span>
                          <span className="text-[11px] text-[#748092]">{daysInactive} ngày trước</span>
                        </div>
                        <h4 className="font-bold text-[#243447] dark:text-white text-sm">{mem.student_name}</h4>
                        <p className="text-[11px] text-[#748092]">{health.reason}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#F1E5D8]/70">
                          <div>XP: <strong className="text-[#E85D3F]">{mem.xp || 0}</strong></div>
                          <div>Chuỗi: <strong>{mem.streak || 0} ngày</strong></div>
                          <div>Từ vựng: <strong>{mem.words_learned || 0} từ</strong></div>
                          <div>Giờ học: <strong>{mem.study_hours || 0}h</strong></div>
                        </div>

                        <button
                          onClick={() => setStudentDetailModal({ ...mem, health })}
                          className="w-full py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] text-xs font-bold text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white transition-all cursor-pointer"
                        >
                          Chi tiết học viên
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {classDetailTab === 'settings' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-6 max-w-xl">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">Cài đặt lớp học</h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#748092] mb-1">Tên lớp học</label>
                    <input 
                      type="text" 
                      defaultValue={currentClass.name}
                      onBlur={(e) => updateClassroom(currentClass.id, { name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#748092] mb-1">Mô tả</label>
                    <textarea 
                      defaultValue={currentClass.description}
                      onBlur={(e) => updateClassroom(currentClass.id, { description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#748092] mb-1">Sĩ số tối đa</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      defaultValue={currentClass.max_students}
                      onBlur={(e) => {
                        const val = Math.max(1, Number(e.target.value) || 1);
                        updateClassroom(currentClass.id, { max_students: val });
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#748092] mb-1">Trạng thái lớp</label>
                    <select
                      defaultValue={currentClass.status}
                      onChange={(e) => {
                        updateClassroom(currentClass.id, { status: e.target.value });
                        showToast(`Đã đổi trạng thái lớp: ${e.target.value}`);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                    >
                      <option value="active">Đang mở (Active)</option>
                      <option value="closed">Đã đóng (Closed)</option>
                      <option value="archived">Lưu trữ (Archived)</option>
                    </select>
                  </div>

                  <div className="pt-5 border-t border-rose-200 dark:border-rose-900/50 space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-600">Vùng nguy hiểm: Xóa lớp học</h4>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                      Xóa vĩnh viễn lớp học này cùng toàn bộ danh sách thành viên, bài tập và lịch sử bài nộp liên quan. Hành động này không thể hoàn tác.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(currentClass.id, currentClass.name)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Trash2 size={14} />
                      <span>Xóa lớp học này</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 4: GRADING HUB (/teacher/grading) */}
        {/* ========================================================== */}
        {subRoute === 'grading' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Xem danh sách bài nộp của tất cả học viên trong các lớp học bạn phụ trách
            </p>

            <div className="overflow-x-auto rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/70 dark:bg-[#243447]/50 text-[11px] font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
                    <th className="p-4 pl-6">Học viên</th>
                    <th className="p-4">Bài tập</th>
                    <th className="p-4">Thời gian nộp</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Điểm số</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8]/60 dark:divide-[#2B3A4F]/60 text-xs">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-[#748092]">
                        Chưa có bài nộp nào từ học viên.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#FFF9F2]/40 dark:hover:bg-[#243447]/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-[#243447] dark:text-white">
                          {sub.student_name}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-[#243447] dark:text-white">{sub.assignment_title}</p>
                          <span className="text-[10px] font-semibold text-[#E85D3F]">{sub.classroom_name}</span>
                        </td>
                        <td className="p-4 text-[#748092]">
                          {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'graded' ? 'bg-emerald-100 text-emerald-700' :
                            sub.status === 'late' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {sub.status === 'graded' ? 'Đã chấm' : sub.status === 'late' ? 'Trễ hạn' : 'Chờ chấm'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-base">
                          {sub.score !== null ? (
                            <span className="text-emerald-600">{sub.score} / 100</span>
                          ) : (
                            <span className="text-[#748092]">—</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setGradingModalSub(sub);
                                setGradeInput({
                                  score: sub.score !== null ? String(sub.score) : '',
                                  feedback: sub.feedback || ''
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-2xs"
                            >
                              {sub.status === 'graded' ? 'Sửa điểm' : 'Chấm điểm'}
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id, sub.student_name)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                              title="Xóa bài nộp"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================== */}
      {/* MODAL 1: CREATE CLASS */}
      {/* ========================================================== */}
      <CreateClassModal
        isOpen={createClassModalOpen}
        onClose={() => setCreateClassModalOpen(false)}
        onSubmit={handleCreateClass}
        formData={newClassForm}
        setFormData={setNewClassForm}
      />

      {/* ========================================================== */}
      {/* MODAL 3: CREATE ASSIGNMENT */}
      {/* ========================================================== */}
      <CreateAssignmentModal
        isOpen={createAsgModalOpen}
        onClose={() => setCreateAsgModalOpen(false)}
        onSubmit={handleCreateAssignment}
        formData={newAsgForm}
        setFormData={setNewAsgForm}
      />

      {/* ========================================================== */}
      {/* MODAL 4: CREATE ANNOUNCEMENT */}
      {/* ========================================================== */}
      <CreateAnnouncementModal
        isOpen={createAnnModalOpen}
        onClose={() => setCreateAnnModalOpen(false)}
        onSubmit={handleCreateAnnouncement}
        formData={newAnnForm}
        setFormData={setNewAnnForm}
      />

      {/* ========================================================== */}
      {/* MODAL 5: UPLOAD MATERIAL */}
      {/* ========================================================== */}
      <UploadMaterialModal
        isOpen={uploadMatModalOpen}
        onClose={() => setUploadMatModalOpen(false)}
        onSubmit={handleUploadMaterial}
        formData={newMatForm}
        setFormData={setNewMatForm}
      />

      {/* ========================================================== */}
      {/* MODAL 6: GRADING DRAWER */}
      {/* ========================================================== */}
      <GradingDrawerModal
        submission={gradingModalSub}
        onClose={() => setGradingModalSub(null)}
        onSubmit={handleGradeSubmit}
        gradeInput={gradeInput}
        setGradeInput={setGradeInput}
      />

      {/* ========================================================== */}
      {/* MODAL 7: STUDENT DETAIL DIAGNOSTIC */}
      {/* ========================================================== */}
      <StudentDetailModal
        student={studentDetailModal}
        onClose={() => setStudentDetailModal(null)}
      />

      {/* ========================================================== */}
      {/* MODAL 8: ADVANCED STUDENT DETAILED ANALYTICS (SPEC 2) */}
      {/* ========================================================== */}
      {studentAnalyticsModalData && (
        <StudentAnalyticsModal
          student={studentAnalyticsModalData}
          onClose={() => setStudentAnalyticsModalData(null)}
          onSendReminder={handleSendStudentReminder}
        />
      )}

      {/* ========================================================== */}
      {/* MODAL 9: AI TEACHER STUDIO (SPEC 4, 5, 6, 7, 8, 9) */}
      {/* ========================================================== */}
      <AiTeacherStudioModal
        isOpen={aiStudioModalOpen}
        onClose={() => setAiStudioModalOpen(false)}
        classrooms={classrooms}
        initialClassId={analyticsClassId === 'all' ? (classId || classrooms[0]?.id) : analyticsClassId}
        classAnalytics={classAnalyticsData}
        initialTab={aiStudioInitialTab}
        onPublishAssignment={handlePublishAiAssignment}
        onSaveLessonPlan={handleSaveLessonPlanToMaterials}
      />

    </div>
  );
}
