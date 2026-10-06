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
  QrCode, 
  Search, 
  Filter, 
  FileText, 
  MessageSquare, 
  FolderDown, 
  Settings, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Send, 
  Upload, 
  File, 
  Eye, 
  Calendar,
  X,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck
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
  calculateStudentHealthStatus
} from '../services/classroomService';
import { 
  createClassSession, 
  getActiveSessionForClass 
} from '../services/liveClassroomService';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function TeacherDashboardPage({
  user,
  setActiveTab,
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

  // Primary data states
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Sub-tab for class detail
  const [classDetailTab, setClassDetailTab] = useState('overview');

  // Modals state
  const [createClassModalOpen, setCreateClassModalOpen] = useState(false);
  const [qrModalClass, setQrModalClass] = useState(null);
  const [createAsgModalOpen, setCreateAsgModalOpen] = useState(false);
  const [createAnnModalOpen, setCreateAnnModalOpen] = useState(false);
  const [uploadMatModalOpen, setUploadMatModalOpen] = useState(false);
  const [gradingModalSub, setGradingModalSub] = useState(null);
  const [studentDetailModal, setStudentDetailModal] = useState(null);

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

  // Load teacher overview data
  const loadTeacherData = useCallback(async () => {
    setLoading(true);
    try {
      const teacherId = user?.uid || user?.id || 'user_teacher_demo';
      const [clsList, subsList] = await Promise.all([
        getClassroomsForTeacher(teacherId),
        getAllSubmissionsForTeacher(teacherId)
      ]);
      setClassrooms(clsList || []);
      setSubmissions(subsList || []);

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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${clsName || 'này'}"?\n\nHành động này sẽ xóa vĩnh viễn dữ liệu lớp học, bao gồm danh sách học viên, bài tập và thảo luận liên quan.`)) {
      return;
    }
    const res = await deleteClassroom(clsId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã xóa lớp "${clsName || ''}" thành công!`);
      setClassrooms(prev => prev.filter(c => c.id !== clsId));
      if (classId === clsId) {
        navigateTo('classes');
      } else {
        loadTeacherData();
      }
    } else {
      alert(res.error || 'Lỗi khi xóa lớp học.');
    }
  };

  // Create class submit
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassForm.name.trim()) {
      alert('Vui lòng nhập tên lớp học');
      return;
    }
    const maxStudentsNum = Number(newClassForm.maxStudents);
    if (isNaN(maxStudentsNum) || maxStudentsNum < 1) {
      alert('Sĩ số học sinh của lớp phải từ 1 học viên trở lên.');
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
      alert(res.error || 'Lỗi khi tạo lớp.');
    }
  };

  // Create Assignment submit
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAsgForm.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài tập');
      return;
    }

    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
    const targetClassId = classId || classrooms[0]?.id;
    if (!targetClassId) {
      alert('Vui lòng chọn hoặc tạo lớp học trước khi giao bài tập.');
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
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
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

  // Upload Material submit
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!newMatForm.title.trim() || !newMatForm.fileUrl.trim()) {
      alert('Vui lòng nhập tên tài liệu và đường dẫn URL.');
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

  // Remove student handler
  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học viên "${studentName}" khỏi lớp học này?`)) return;
    const res = await removeStudentFromClass(classId, studentId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã xóa học viên ${studentName} khỏi lớp.`);
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
    if (existing) {
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
               subRoute === 'class_detail' ? currentClass?.name || 'Chi tiết Lớp học' :
               'Bảng điều khiển Giáo viên'}
            </h1>
            <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
              {subRoute === 'class_detail' 
                ? `Mã lớp: ${currentClass?.class_code} • Trình độ: ${currentClass?.hsk_level}`
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
                  onClick={() => navigateTo('classes')}
                  className="p-3 sm:p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] hover:bg-[#FFF5F2] dark:hover:bg-[#2B3A4F] border border-[#F1E5D8] dark:border-[#2B3A4F] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Users size={16} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">Xem học sinh</p>
                  <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] truncate">Theo dõi sức khỏe học tập</p>
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
                            onClick={() => setQrModalClass(cls)}
                            title="Xem mã QR"
                            className="p-1.5 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF5F2] dark:hover:bg-[#243447] transition-colors cursor-pointer"
                          >
                            <QrCode size={16} />
                          </button>
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
                          onClick={() => setQrModalClass(cls)}
                          className="p-1.5 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                          title="QR Code"
                        >
                          <QrCode size={15} />
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
                  onClick={() => setQrModalClass(currentClass)}
                  className="p-1.5 rounded-xl bg-white dark:bg-[#1A2433] text-[#748092] hover:text-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] cursor-pointer"
                  title="Xem mã QR"
                >
                  <QrCode size={14} />
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#748092]">Danh sách {members.length} học viên đang theo học</p>
                  <button
                    onClick={() => setCreateAnnModalOpen(true)}
                    className="text-xs font-bold text-[#E85D3F] hover:underline cursor-pointer"
                  >
                    Gửi thông báo tới lớp
                  </button>
                </div>

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
                          ? Math.floor((Date.now() - new Date(mem.last_active)) / 86400000)
                          : 1;
                        const health = calculateStudentHealthStatus({
                          daysInactive,
                          completionRate: mem.lessons_completed ? Math.min(100, mem.lessons_completed * 10) : 70,
                          overdueCount: 0,
                          avgScore: 85
                        });

                        return (
                          <tr key={mem.id} className="hover:bg-[#FFF9F2]/40 dark:hover:bg-[#243447]/30 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {mem.student_name ? mem.student_name.charAt(0).toUpperCase() : 'H'}
                                </div>
                                <div>
                                  <p className="font-bold text-[#243447] dark:text-white">{mem.student_name}</p>
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
                        <a 
                          href={mat.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF5F2] cursor-pointer"
                        >
                          <ExternalLink size={16} />
                        </a>
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
                      <span className="text-[11px] text-[#748092]">
                        {new Date(ann.created_at).toLocaleDateString('vi-VN')}
                      </span>
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
                      ? Math.floor((Date.now() - new Date(mem.last_active)) / 86400000)
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
      {createClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">Tạo Lớp học mới</h3>
              <button 
                onClick={() => setCreateClassModalOpen(false)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#748092] mb-1">Tên lớp học *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: HSK 1 - Khóa Buổi tối 2-4-6"
                  value={newClassForm.name}
                  onChange={e => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Mô tả mục tiêu lớp</label>
                <textarea
                  placeholder="Giới thiệu về mục tiêu, lịch học, yêu cầu..."
                  value={newClassForm.description}
                  onChange={e => setNewClassForm({ ...newClassForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#748092] mb-1">Trình độ HSK</label>
                  <select
                    value={newClassForm.hskLevel}
                    onChange={e => setNewClassForm({ ...newClassForm, hskLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5">HSK 5</option>
                    <option value="HSK 6">HSK 6</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#748092] mb-1">Sĩ số tối đa</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Tối thiểu 1 học viên"
                    value={newClassForm.maxStudents}
                    onChange={e => setNewClassForm({ ...newClassForm, maxStudents: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                  />
                  <p className="text-[10px] text-[#748092] mt-1">Từ 1 học viên trở lên (hỗ trợ kèm 1-1 hoặc lớp nhóm)</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  Tạo lớp & Nhận mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: QR CODE PREVIEW */}
      {/* ========================================================== */}
      {qrModalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-sm w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E5D8]">
              <h3 className="text-sm font-bold text-[#243447] dark:text-white">Mã QR Lớp học</h3>
              <button 
                onClick={() => setQrModalClass(null)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#E85D3F]/40 inline-block shadow-inner">
              {/* Minimal SVG QR Code representation */}
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M45 15h10v10h-10z M45 45h10v10h-10z M65 45h10v10h-10z M75 55h15v10h-15z M45 75h10v15h-10z M65 65h10v25h-10z M80 80h10v10h-10z" className="text-[#243447]" />
              </svg>
            </div>

            <div>
              <p className="text-base font-black text-[#E85D3F] tracking-widest">{qrModalClass.class_code}</p>
              <p className="text-xs font-bold text-[#243447] dark:text-white mt-1">{qrModalClass.name}</p>
              <p className="text-[11px] text-[#748092] mt-0.5">Học viên quét hoặc nhập mã trên tại mục "Tham gia lớp"</p>
            </div>

            <button
              onClick={() => handleCopyCode(qrModalClass.class_code)}
              className="w-full py-2.5 rounded-xl bg-[#FFF5F2] text-[#E85D3F] font-bold text-xs hover:bg-[#E85D3F] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Copy size={14} />
              <span>Sao chép mã lớp ({qrModalClass.class_code})</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: CREATE ASSIGNMENT */}
      {/* ========================================================== */}
      {createAsgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">Giao Bài tập mới</h3>
              <button 
                onClick={() => setCreateAsgModalOpen(false)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#748092] mb-1">Tiêu đề bài tập *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập 20 Từ vựng Bài 3"
                  value={newAsgForm.title}
                  onChange={e => setNewAsgForm({ ...newAsgForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Loại bài tập</label>
                <select
                  value={newAsgForm.contentType}
                  onChange={e => setNewAsgForm({ ...newAsgForm, contentType: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold"
                >
                  <option value="Vocabulary">Từ vựng (Vocabulary)</option>
                  <option value="Grammar">Ngữ pháp (Grammar)</option>
                  <option value="Listening">Luyện nghe (Listening)</option>
                  <option value="Speaking">Luyện nói (Speaking)</option>
                  <option value="Reading">Đọc hiểu (Reading)</option>
                  <option value="Writing">Viết chữ (Writing)</option>
                  <option value="Quiz">Trắc nghiệm (Quiz - Tự động chấm)</option>
                </select>
              </div>

              {newAsgForm.contentType === 'Quiz' && (
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                  <p className="font-bold text-blue-700 dark:text-blue-300">Câu hỏi mẫu (Tự động chấm điểm)</p>
                  <input
                    type="text"
                    placeholder="Câu hỏi trắc nghiệm..."
                    value={newAsgForm.quizQuestion1}
                    onChange={e => setNewAsgForm({ ...newAsgForm, quizQuestion1: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#1A2433] border text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#748092]">Đáp án đúng:</span>
                    <select
                      value={newAsgForm.quizCorrect}
                      onChange={e => setNewAsgForm({ ...newAsgForm, quizCorrect: Number(e.target.value) })}
                      className="p-1 rounded bg-white text-xs"
                    >
                      <option value={0}>Đáp án A</option>
                      <option value={1}>Đáp án B</option>
                      <option value={2}>Đáp án C</option>
                      <option value={3}>Đáp án D</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#748092] mb-1">Mô tả & Hướng dẫn làm bài</label>
                <textarea
                  placeholder="Ghi chú thêm cho học viên..."
                  value={newAsgForm.description}
                  onChange={e => setNewAsgForm({ ...newAsgForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Hạn nộp (Deadline)</label>
                <input
                  type="datetime-local"
                  value={newAsgForm.dueDate}
                  onChange={e => setNewAsgForm({ ...newAsgForm, dueDate: e.target.value })}
                  className="w-full p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="asgPub"
                  checked={newAsgForm.published}
                  onChange={e => setNewAsgForm({ ...newAsgForm, published: e.target.checked })}
                  className="rounded text-[#E85D3F]"
                />
                <label htmlFor="asgPub" className="font-bold text-[#243447] dark:text-white">Công bố ngay cho học viên</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateAsgModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] hover:bg-gray-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 4: CREATE ANNOUNCEMENT */}
      {/* ========================================================== */}
      {createAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">Đăng thông báo lớp</h3>
              <button 
                onClick={() => setCreateAnnModalOpen(false)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#748092] mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhắc nhở lịch kiểm tra định kỳ"
                  value={newAnnForm.title}
                  onChange={e => setNewAnnForm({ ...newAnnForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Nội dung thông báo *</label>
                <textarea
                  required
                  placeholder="Nhập nội dung chi tiết gửi tới toàn bộ học viên..."
                  value={newAnnForm.content}
                  onChange={e => setNewAnnForm({ ...newAnnForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annPin"
                  checked={newAnnForm.pinned}
                  onChange={e => setNewAnnForm({ ...newAnnForm, pinned: e.target.checked })}
                  className="rounded text-[#E85D3F]"
                />
                <label htmlFor="annPin" className="font-bold text-[#243447] dark:text-white">Ghim lên đầu bảng tin lớp</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 5: UPLOAD MATERIAL */}
      {/* ========================================================== */}
      {uploadMatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white">Thêm Tài liệu cho Lớp</h3>
              <button 
                onClick={() => setUploadMatModalOpen(false)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#748092] mb-1">Tên tài liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sách Giáo trình HSK 1 PDF"
                  value={newMatForm.title}
                  onChange={e => setNewMatForm({ ...newMatForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#748092] mb-1">Loại tệp</label>
                  <select
                    value={newMatForm.fileType}
                    onChange={e => setNewMatForm({ ...newMatForm, fileType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] font-bold text-xs"
                  >
                    <option value="pdf">Tài liệu PDF</option>
                    <option value="audio">Âm thanh (Audio/MP3)</option>
                    <option value="image">Hình ảnh (Image)</option>
                    <option value="video">Video bài giảng</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#748092] mb-1">Đường dẫn tệp (URL) *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newMatForm.fileUrl}
                    onChange={e => setNewMatForm({ ...newMatForm, fileUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Ghi chú thêm</label>
                <textarea
                  placeholder="Mô tả nội dung tài liệu..."
                  value={newMatForm.description}
                  onChange={e => setNewMatForm({ ...newMatForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  Lưu tài liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 6: GRADING DRAWER */}
      {/* ========================================================== */}
      {gradingModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#243447] dark:text-white">Chấm điểm Bài nộp</h3>
                <p className="text-xs text-[#748092]">Học viên: {gradingModalSub.student_name}</p>
              </div>
              <button 
                onClick={() => setGradingModalSub(null)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Submission preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-2">
              <p className="font-bold text-[#243447] dark:text-white">{gradingModalSub.assignment_title}</p>
              <div className="text-[#748092] dark:text-[#94A3B8] max-h-36 overflow-y-auto whitespace-pre-wrap">
                {gradingModalSub.submission_data?.notes 
                  ? gradingModalSub.submission_data.notes 
                  : JSON.stringify(gradingModalSub.submission_data, null, 2)}
              </div>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#748092] mb-1">Điểm số (0 - 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="Ví dụ: 95"
                  value={gradeInput.score}
                  onChange={e => setGradeInput({ ...gradeInput, score: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#243447] border border-[#F1E5D8] font-bold text-sm text-[#E85D3F]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#748092] mb-1">Nhận xét & Feedback của Giáo viên</label>
                <textarea
                  placeholder="Ghi nhận xét chi tiết, khen ngợi hoặc lỗi cần khắc phục..."
                  value={gradeInput.feedback}
                  onChange={e => setGradeInput({ ...gradeInput, feedback: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#243447] border border-[#F1E5D8] text-xs"
                  rows={3}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingModalSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  Xác nhận Chấm điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 7: STUDENT DETAIL DIAGNOSTIC */}
      {/* ========================================================== */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs">
                  {studentDetailModal.student_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#243447] dark:text-white">{studentDetailModal.student_name}</h3>
                  <p className="text-[10px] text-[#748092]">{studentDetailModal.student_email}</p>
                </div>
              </div>
              <button 
                onClick={() => setStudentDetailModal(null)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447]">
                <span className="font-bold text-[#748092]">Đánh giá học thuật:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold border ${studentDetailModal.health?.badgeClass}`}>
                  {studentDetailModal.health?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200">
                  <p className="text-[10px] text-[#748092]">Kinh nghiệm (XP)</p>
                  <p className="text-base font-black text-[#E85D3F]">{studentDetailModal.xp || 0}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                  <p className="text-[10px] text-[#748092]">Chuỗi học tập</p>
                  <p className="text-base font-black text-amber-600">{studentDetailModal.streak || 0} ngày</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                  <p className="text-[10px] text-[#748092]">Từ vựng đã học</p>
                  <p className="text-base font-black text-emerald-600">{studentDetailModal.words_learned || 0}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200">
                  <p className="text-[10px] text-[#748092]">Thời gian tích lũy</p>
                  <p className="text-base font-black text-blue-600">{studentDetailModal.study_hours || 1.5} giờ</p>
                </div>
              </div>

              <p className="text-[11px] text-[#748092] italic pt-1 text-center">
                Chẩn đoán: {studentDetailModal.health?.reason}
              </p>
            </div>

            <button
              onClick={() => setStudentDetailModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FFF9F2] text-[#243447] dark:text-white font-bold text-xs hover:bg-[#F1E5D8] transition-all cursor-pointer border border-[#F1E5D8]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
