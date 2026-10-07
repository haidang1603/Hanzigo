import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  FileText, 
  FolderDown, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  Award, 
  AlertCircle,
  Search,
  Sparkles,
  Send,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { 
  getClassroomsForStudent, 
  getClassroomById, 
  lookupClassroomByCode, 
  joinClassByCode, 
  getAssignmentsForClassroom, 
  getStudentSubmission, 
  submitAssignment, 
  getAnnouncementsForClassroom, 
  getMaterialsForClassroom,
  getClassMembers,
  removeStudentFromClass
} from '../services/classroomService';
import { getActiveSessionForClass } from '../services/liveClassroomService';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function ClassroomPage({
  user,
  setActiveTab,
  subRoute = 'list',
  classId = null,
  onNavigate = null
}) {
  // Navigation helper
  const navigateTo = useCallback((route, targetId = null) => {
    playClickSound();
    if (onNavigate) {
      onNavigate(route, targetId);
    } else {
      const hash = targetId ? `#classroom/${route}/${targetId}` : `#classroom/${route}`;
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
  const [myClasses, setMyClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [classTab, setClassTab] = useState('assignments'); // 'overview' | 'assignments' | 'materials' | 'announcements' | 'peers'
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [peers, setPeers] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [activeLiveSession, setActiveLiveSession] = useState(null);

  // Join class form states
  const [inputCode, setInputCode] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookedUpClass, setLookedUpClass] = useState(null);
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);

  // Assignment submission player state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [writingNotes, setWritingNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load student classrooms
  const loadStudentData = useCallback(async () => {
    setLoading(true);
    try {
      const studentId = user?.uid || user?.id || 'user_guest';
      const list = await getClassroomsForStudent(studentId);
      setMyClasses(list || []);

      if (classId) {
        const [clsDetail, asgList, annList, matList, peerList, liveSes] = await Promise.all([
          getClassroomById(classId),
          getAssignmentsForClassroom(classId, false),
          getAnnouncementsForClassroom(classId),
          getMaterialsForClassroom(classId),
          getClassMembers(classId),
          getActiveSessionForClass(classId)
        ]);

        setCurrentClass(clsDetail);
        setAssignments(asgList || []);
        setAnnouncements(annList || []);
        setMaterials(matList || []);
        setPeers(peerList || []);
        setActiveLiveSession(liveSes || null);

        // Load submissions for all assignments in parallel
        const subMap = {};
        const asgs = asgList || [];
        const subs = await Promise.all(asgs.map(asg => getStudentSubmission(asg.id, studentId)));
        asgs.forEach((asg, idx) => {
          if (subs[idx]) subMap[asg.id] = subs[idx];
        });
        setSubmissionsMap(subMap);
      }
    } catch (err) {
      console.warn('Classroom data load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, classId]);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // Handle lookup by class code
  const handleLookupCode = async () => {
    setJoinError('');
    setLookedUpClass(null);
    if (!inputCode.trim()) {
      setJoinError('Vui lòng nhập mã lớp học.');
      return;
    }

    setLookingUp(true);
    try {
      const found = await lookupClassroomByCode(inputCode.trim());
      if (!found) {
        setJoinError('Không tìm thấy lớp học với mã này. Vui lòng kiểm tra lại.');
      } else {
        setLookedUpClass(found);
      }
    } catch (err) {
      setJoinError('Lỗi khi tra cứu mã lớp học.');
    } finally {
      setLookingUp(false);
    }
  };

  // Handle confirm join class
  const handleConfirmJoin = async () => {
    if (!lookedUpClass) return;
    setJoining(true);
    setJoinError('');

    try {
      const res = await joinClassByCode(lookedUpClass.class_code, user);
      if (res.success) {
        playSuccessSound();
        showToast(`🎉 Chúc mừng! Bạn đã tham gia lớp "${res.name}"!`);
        await loadStudentData();
        // Navigate to the joined classroom
        navigateTo('detail', res.classroom_id);
      } else {
        setJoinError(res.error || 'Không thể tham gia lớp học.');
      }
    } catch (err) {
      setJoinError('Có lỗi xảy ra khi tham gia lớp học.');
    } finally {
      setJoining(false);
    }
  };

  // Handle submit assignment
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setSubmitting(true);
    try {
      const studentId = user?.uid || user?.id || 'user_guest';
      const studentName = user?.name || 'Học viên HanziGo';

      const payload = {
        assignmentId: activeAssignment.id,
        studentId,
        studentName,
        submissionData: {
          answers: quizAnswers,
          notes: writingNotes
        },
        assignmentInfo: activeAssignment
      };

      const res = await submitAssignment(payload);
      if (res.success) {
        playSuccessSound();
        showToast(
          res.submission.status === 'graded'
            ? `🎉 Nộp bài thành công! Điểm trắc nghiệm tự động: ${res.submission.score}/100`
            : 'Đã nộp bài tập thành công! Giáo viên sẽ sớm chấm điểm.'
        );
        setActiveAssignment(null);
        setQuizAnswers({});
        setWritingNotes('');
        loadStudentData();
      } else {
        showToast(res.error || 'Lỗi khi nộp bài.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Có lỗi xảy ra trong quá trình nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle student leaving classroom
  const handleLeaveClass = async () => {
    if (!currentClass) return;
    if (!window.confirm(`Bạn có chắc chắn muốn rời khỏi lớp học "${currentClass.name}"?`)) return;
    const studentId = user?.uid || user?.id || 'user_guest';
    const res = await removeStudentFromClass(currentClass.id, studentId);
    if (res.success) {
      playSuccessSound();
      showToast(`Đã rời khỏi lớp "${currentClass.name}".`);
      navigateTo('list');
      loadStudentData();
    } else {
      showToast(res.error || 'Lỗi khi rời lớp học.');
    }
  };

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E85D3F] mb-1">
              <BookOpen size={16} />
              <span>HANZIGO CLASSROOM • LỚP HỌC HSK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] dark:text-white tracking-tight">
              {subRoute === 'join' ? 'Tham gia Lớp học' :
               classId && currentClass ? currentClass.name :
               'Lớp học của tôi'}
            </h1>
            <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8] mt-1">
              {classId && currentClass 
                ? `Giáo viên phụ trách: ${currentClass.profiles?.name || 'Giáo viên HanziGo'} • ${currentClass.hsk_level}`
                : 'Theo dõi bài học, làm bài tập và nhận phản hồi trực tiếp từ giáo viên'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {subRoute !== 'list' && (
              <button
                onClick={() => navigateTo('list')}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1A2433] text-[#243447] dark:text-white text-xs font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-[#FFF5F2] cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Danh sách lớp</span>
              </button>
            )}

            {subRoute === 'detail' && currentClass && (
              <button
                onClick={handleLeaveClass}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold cursor-pointer transition-all"
                title="Rời khỏi lớp học này"
              >
                <span>Rời lớp</span>
              </button>
            )}

            {subRoute !== 'join' && (
              <button
                onClick={() => navigateTo('join')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus size={14} />
                <span>Nhập mã vào lớp</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================== */}
        {/* VIEW 1: JOIN CLASS BY CODE (/classroom/join) */}
        {/* ========================================================== */}
        {subRoute === 'join' && (
          <div className="max-w-xl mx-auto py-4 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-xl font-black text-[#243447] dark:text-white">
                  Nhập Mã Lớp Học
                </h2>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Nhận mã mời từ giáo viên của bạn (ví dụ: <span className="font-mono font-bold text-[#E85D3F]">HZG-7K2P9</span> hoặc chỉ cần nhập <span className="font-mono font-bold text-[#E85D3F]">7K2P9</span>)
                </p>
              </div>

              {/* Input Code Field */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="HZG-XXXXX hoặc XXXXX"
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleLookupCode()}
                    className="flex-1 p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-mono font-bold text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-[#E85D3F]"
                  />
                  <button
                    onClick={handleLookupCode}
                    disabled={lookingUp}
                    className="px-5 py-3.5 rounded-2xl bg-[#E85D3F] text-white font-bold text-xs hover:opacity-95 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {lookingUp ? 'Đang tìm...' : 'Kiểm tra'}
                  </button>
                </div>

                {joinError && (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{joinError}</span>
                  </div>
                )}
              </div>

              {/* Preview card when class found */}
              {lookedUpClass && (
                <div className="p-5 rounded-3xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#E85D3F] text-white">
                      {lookedUpClass.hsk_level}
                    </span>
                    <span className="text-xs font-semibold text-[#748092]">
                      Sĩ số: {lookedUpClass.student_count || 0} / {lookedUpClass.max_students || 30}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#243447] dark:text-white">
                      {lookedUpClass.name}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                      {lookedUpClass.description || 'Lớp học không có mô tả chi tiết.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#F1E5D8]/70">
                    <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs">
                      {lookedUpClass.teacher_name ? lookedUpClass.teacher_name.charAt(0) : 'T'}
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-[#243447] dark:text-white">{lookedUpClass.teacher_name || 'Giáo viên HanziGo'}</p>
                      <p className="text-[10px] text-[#748092]">Giáo viên phụ trách</p>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmJoin}
                    disabled={joining}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#45B97C]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>{joining ? 'Đang tham gia...' : 'Xác nhận tham gia lớp này'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: MY CLASSROOMS LIST (/classroom) */}
        {/* ========================================================== */}
        {subRoute === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {loading ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                Đang tải danh sách lớp học của bạn...
              </div>
            ) : myClasses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1A2433] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">Bạn chưa tham gia lớp học nào</h3>
                  <p className="text-xs text-[#748092] mt-1">
                    Nhập mã code do giáo viên cung cấp để bắt đầu học tập và làm bài tập cùng cả lớp.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('join')}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/25"
                >
                  Nhập mã tham gia lớp
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myClasses.map(cls => (
                  <div
                    key={cls.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:border-[#E85D3F]/40 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border border-[#E85D3F]/20">
                        {cls.hsk_level}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Đang tham gia
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#243447] dark:text-white line-clamp-1">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 mt-1">
                        {cls.description || 'Không có mô tả chi tiết.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8]/70 text-xs">
                      <span className="text-[#748092]">
                        Mã lớp: <strong className="font-mono text-[#E85D3F]">{cls.class_code}</strong>
                      </span>
                      <button
                        onClick={() => navigateTo('detail', cls.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#E85D3F] text-white font-bold text-xs hover:opacity-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>Vào lớp học</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 3: CLASSROOM DETAIL FOR STUDENT */}
        {/* ========================================================== */}
        {classId && currentClass && subRoute === 'detail' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Active Live Session Banner */}
            {activeLiveSession && (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border-2 border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-md">
                <div className="flex items-center gap-3.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                        🔴 ĐANG TRỰC TIẾP
                      </span>
                      <h4 className="text-sm font-bold text-[#243447] dark:text-white">
                        {activeLiveSession.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                      Giáo viên đang mở phòng học trực tuyến. Bấm vào để tham gia ngay!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    window.location.hash = `#classroom/${classId}/live/${activeLiveSession.id}`;
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <span>Tham gia phòng học Live</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Navigation Tabs for Class */}
            <div className="flex items-center gap-1 border-b border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto pb-2">
              {[
                { id: 'assignments', label: `Bài tập (${assignments.length})` },
                { id: 'announcements', label: `Thông báo (${announcements.length})` },
                { id: 'materials', label: `Tài liệu (${materials.length})` },
                { id: 'peers', label: `Bạn cùng lớp (${peers.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setClassTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    classTab === tab.id
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: ASSIGNMENTS */}
            {classTab === 'assignments' && (
              <div className="space-y-4">
                {assignments.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                    Chưa có bài tập nào được giao cho lớp này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map(asg => {
                      const sub = submissionsMap[asg.id];
                      return (
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
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sub?.status === 'graded' ? 'bg-emerald-100 text-emerald-700' :
                              sub?.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {sub?.status === 'graded' ? `Đã chấm: ${sub.score}đ` :
                               sub?.status === 'submitted' ? 'Đã nộp bài' :
                               'Chưa làm'}
                            </span>
                          </div>

                          <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{asg.description}</p>

                          {/* Feedback if graded */}
                          {sub?.feedback && (
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300">
                              <strong>Lời nhận xét của Thầy/Cô:</strong> {sub.feedback}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[#F1E5D8]/70 text-xs">
                            <span className="text-[#748092]">
                              Hạn nộp: {asg.due_date ? new Date(asg.due_date).toLocaleDateString('vi-VN') : 'Tự do'}
                            </span>
                            <button
                              onClick={() => {
                                setActiveAssignment(asg);
                                setQuizAnswers({});
                                setWritingNotes(sub?.submission_data?.notes || '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-2xs"
                            >
                              {sub ? 'Làm lại / Xem bài' : 'Làm bài ngay'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS */}
            {classTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                    Chưa có thông báo nào từ giáo viên.
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-5 rounded-3xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#243447] dark:text-white">{ann.title}</h4>
                          {ann.pinned && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Ghim</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#748092]">
                          {new Date(ann.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed whitespace-pre-line">{ann.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: MATERIALS */}
            {classTab === 'materials' && (
              <div className="space-y-4">
                {materials.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A2433] text-center text-xs text-[#748092]">
                    Chưa có tài liệu nào tải lên trong lớp.
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
                            <p className="text-[11px] text-[#748092] line-clamp-1">{mat.description || 'Tài liệu học tập'}</p>
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

            {/* TAB: PEERS */}
            {classTab === 'peers' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {peers.map(peer => (
                  <div key={peer.id} className="p-3.5 rounded-2xl bg-white dark:bg-[#1A2433] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {peer.student_name ? peer.student_name.charAt(0) : 'H'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{peer.student_name}</p>
                      <p className="text-[10px] text-[#45B97C] font-semibold">{peer.hsk_level || 'HSK 1'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================== */}
      {/* MODAL: ASSIGNMENT SUBMISSION PLAYER */}
      {/* ========================================================== */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-lg w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {activeAssignment.content_type}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white mt-1">
                  {activeAssignment.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveAssignment(null)}
                className="text-[#748092] hover:text-[#243447] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              {activeAssignment.description}
            </p>

            <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
              {/* If Quiz format */}
              {activeAssignment.content?.questions && activeAssignment.content.questions.length > 0 && (
                <div className="space-y-3">
                  {activeAssignment.content.questions.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] space-y-2">
                      <p className="font-bold text-[#243447] dark:text-white">
                        Câu {qIdx + 1}: {q.prompt}
                      </p>
                      <div className="space-y-1.5">
                        {q.options?.map((opt, optIdx) => (
                          <label 
                            key={optIdx} 
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                              quizAnswers[q.id || `q${qIdx + 1}`] === optIdx
                                ? 'bg-[#FFF5F2] border-[#E85D3F] text-[#E85D3F] font-bold'
                                : 'bg-white dark:bg-[#1A2433] border-[#F1E5D8] text-[#243447] dark:text-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id || `q${qIdx + 1}`}
                              value={optIdx}
                              checked={quizAnswers[q.id || `q${qIdx + 1}`] === optIdx}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [q.id || `q${qIdx + 1}`]: optIdx })}
                              className="text-[#E85D3F]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Freeform Writing / Notes input */}
              <div>
                <label className="block font-bold text-[#748092] mb-1">
                  Nội dung bài làm / Lời nhắn gửi giáo viên:
                </label>
                <textarea
                  required={!activeAssignment.content?.questions}
                  placeholder="Nhập câu trả lời, chữ Hán, bản dịch hoặc liên kết ghi âm bài nói..."
                  value={writingNotes}
                  onChange={e => setWritingNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] text-xs"
                  rows={4}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md"
                >
                  {submitting ? 'Đang nộp...' : 'Xác nhận Nộp bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
