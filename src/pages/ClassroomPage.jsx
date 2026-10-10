import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
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
  X,
  Volume2,
  Users,
  Video,
  Copy,
  Calendar,
  Flame,
  GraduationCap,
  Star,
  ShieldCheck,
  Filter
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
  removeStudentFromClass,
  subscribeToClassroomRealtime
} from '../services/classroomService';
import { getActiveSessionForClass, endLiveSession, liveEventBus } from '../services/liveClassroomService';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { awardXp } from '../utils/gamification';

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
  const [classTab, setClassTab] = useState('assignments'); // 'assignments' | 'announcements' | 'materials' | 'peers'
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [peers, setPeers] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [activeLiveSession, setActiveLiveSession] = useState(null);
  const [liveSessionsMap, setLiveSessionsMap] = useState({}); // { [classId]: session | undefined }
  const [copiedCode, setCopiedCode] = useState(false);

  // Search & Filter state for assignments
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all' | 'pending' | 'submitted' | 'graded'
  const [classSearchTerm, setClassSearchTerm] = useState('');

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

      // Preload live sessions for ALL enrolled classes → enables LIVE badge on list view
      const sessionChecks = await Promise.allSettled(
        (list || []).map(cls => getActiveSessionForClass(cls.id))
      );
      const liveMap = {};
      (list || []).forEach((cls, idx) => {
        const result = sessionChecks[idx];
        if (result.status === 'fulfilled' && result.value) {
          liveMap[cls.id] = result.value;
        }
      });
      setLiveSessionsMap(liveMap);

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

  // Real-time classroom sync (sessions, assignments, announcements, materials, peers)
  useEffect(() => {
    if (!classId) return;

    getActiveSessionForClass(classId).then(ses => {
      setActiveLiveSession(ses || null);
      setLiveSessionsMap(prev => ({ ...prev, [classId]: ses || undefined }));
    }).catch(() => {});

    const unsubscribe = subscribeToClassroomRealtime(classId, (event) => {
      switch (event.type) {
        case 'SESSION':
          getActiveSessionForClass(classId).then(ses => {
            setActiveLiveSession(ses || null);
            setLiveSessionsMap(prev => ({ ...prev, [classId]: ses || undefined }));
          }).catch(() => {});
          break;
        case 'ASSIGNMENT':
          getAssignmentsForClassroom(classId).then(asgs => setAssignments(asgs || [])).catch(() => {});
          break;
        case 'ANNOUNCEMENT':
          getAnnouncementsForClassroom(classId).then(anns => setAnnouncements(anns || [])).catch(() => {});
          break;
        case 'MATERIAL':
          getMaterialsForClassroom(classId).then(mats => setMaterials(mats || [])).catch(() => {});
          break;
        case 'MEMBER':
          getClassMembers(classId).then(mems => setPeers(mems || [])).catch(() => {});
          break;
        default:
          break;
      }
    });

    // Fallback polling mỗi 5s (giảm từ 30s) — hoạt động ngay cả khi Supabase Realtime chưa config
    const interval = setInterval(async () => {
      try {
        const liveSes = await getActiveSessionForClass(classId);
        setActiveLiveSession(liveSes || null);
        setLiveSessionsMap(prev => ({ ...prev, [classId]: liveSes || undefined }));
      } catch {}
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [classId]);

  // Poll live sessions cho TẤT CẢ lớp mỗi 5s → hiện LIVE badge trên list view
  // Hoạt động ngay cả khi không có Supabase Realtime (demo mode / localStorage fallback)
  useEffect(() => {
    if (myClasses.length === 0) return;

    const poll = async () => {
      try {
        const checks = await Promise.allSettled(
          myClasses.map(c => getActiveSessionForClass(c.id))
        );
        const map = {};
        myClasses.forEach((c, i) => {
          if (checks[i].status === 'fulfilled' && checks[i].value) {
            map[c.id] = checks[i].value;
          }
        });
        setLiveSessionsMap(map);
        // Cũng cập nhật active session cho detail view nếu đang mở
        if (classId) setActiveLiveSession(map[classId] || null);
      } catch {}
    };

    const timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myClasses.length, classId]);

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
    } catch {
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
        awardXp(15);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 }
          });
        } catch {}
        showToast(`🎉 Chúc mừng! Bạn đã tham gia lớp "${res.name}" (+15 XP)!`);
        await loadStudentData();
        navigateTo('detail', res.classroom_id);
      } else {
        setJoinError(res.error || 'Không thể tham gia lớp học.');
      }
    } catch {
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
        awardXp(20);
        try {
          confetti({
            particleCount: 40,
            spread: 55,
            origin: { y: 0.6 }
          });
        } catch {}

        showToast(
          res.submission.status === 'graded'
            ? `🎉 Nộp bài thành công! Điểm trắc nghiệm tự động: ${res.submission.score}/100 (+20 XP)`
            : 'Đã nộp bài tập thành công! Giáo viên sẽ sớm chấm điểm (+20 XP).'
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

  // Copy class code to clipboard
  const handleCopyClassCode = (code) => {
    playClickSound();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Đã sao chép mã lớp: ${code}`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Compute student summary statistics across classes
  const stats = useMemo(() => {
    const totalClasses = myClasses.length;
    let pendingHomework = 0;
    let gradedCount = 0;
    let totalScore = 0;

    assignments.forEach(asg => {
      const sub = submissionsMap[asg.id];
      if (!sub || sub.status === 'pending') {
        pendingHomework++;
      } else if (sub.status === 'graded' && typeof sub.score === 'number') {
        gradedCount++;
        totalScore += sub.score;
      }
    });

    const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : null;
    return { totalClasses, pendingHomework, gradedCount, avgScore };
  }, [myClasses, assignments, submissionsMap]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asg => {
      const sub = submissionsMap[asg.id];
      if (assignmentFilter === 'pending') {
        return !sub || sub.status === 'pending';
      }
      if (assignmentFilter === 'submitted') {
        return sub && sub.status === 'submitted';
      }
      if (assignmentFilter === 'graded') {
        return sub && sub.status === 'graded';
      }
      return true;
    });
  }, [assignments, submissionsMap, assignmentFilter]);

  // Filtered classes by search term
  const filteredClasses = useMemo(() => {
    const term = classSearchTerm.toLowerCase().trim();
    if (!term) return myClasses;
    return myClasses.filter(c => 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.class_code && c.class_code.toLowerCase().includes(term)) ||
      (c.hsk_level && c.hsk_level.toLowerCase().includes(term)) ||
      (c.teacher_name && c.teacher_name.toLowerCase().includes(term))
    );
  }, [myClasses, classSearchTerm]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] py-6 sm:py-10 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10">
            <CheckCircle2 size={16} className="text-[#45B97C]" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. HERO HEADER BANNER (ASIAN-MODERN PORTAL) */}
        <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-xs">
                <GraduationCap size={14} className="text-amber-300" />
                <span>Không gian Lớp học & Giảng đường Số HanziGo</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Noto_Serif_SC'] leading-tight">
                {subRoute === 'join' ? 'Tham Gia Lớp Học' :
                 classId && currentClass ? currentClass.name :
                 'Lớp Học Của Tôi'}
              </h1>
              
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                {classId && currentClass 
                  ? `Giáo viên phụ trách: ${currentClass.profiles?.name || currentClass.teacher_name || 'Giáo viên HanziGo'} • Cấp độ ${currentClass.hsk_level} • Mã lớp: ${currentClass.class_code}`
                  : 'Nơi kết nối trực tiếp với giáo viên, làm bài tập được giao, tham gia phòng học trực tuyến và rèn luyện cùng bạn bè.'}
              </p>
              
              {/* Quick Stats Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  🏫 <strong>{myClasses.length}</strong> lớp học đang tham gia
                </span>
                {classId && currentClass && (
                  <>
                    <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                      📝 <strong>{assignments.length}</strong> bài tập được giao
                    </span>
                    {stats.avgScore !== null && (
                      <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-300">
                        ⭐ Điểm TB: <strong>{stats.avgScore}/100</strong>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
              {subRoute !== 'list' && (
                <button
                  onClick={() => navigateTo('list')}
                  className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại Danh sách lớp</span>
                </button>
              )}

              {subRoute === 'detail' && currentClass && (
                <button
                  onClick={handleLeaveClass}
                  className="px-4 py-2.5 rounded-2xl bg-rose-500/30 hover:bg-rose-500/50 text-white border border-rose-300/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Rời khỏi lớp học này"
                >
                  <span>Rời lớp học</span>
                </button>
              )}

              {subRoute !== 'join' && (
                <button
                  onClick={() => navigateTo('join')}
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Nhập mã vào lớp (+15 XP)</span>
                </button>
              )}
            </div>
          </div>

          {/* Decorative Chinese watermark */}
          <div className="absolute right-6 -bottom-8 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/10 select-none pointer-events-none">
            敏而好学
          </div>
        </div>

        {/* 2. TEACHER AI STUDIO BANNER (CHỈ HIỂN THỊ VỚI GIÁO VIÊN & ADMIN) */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-orange-500/10 border border-purple-500/20 dark:border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Cổng Quản Trị Giáo Viên • Teacher AI Studio</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-black uppercase">Quyền Giáo Viên</span>
                </div>
                <p className="text-xs text-[#243447] dark:text-[#E2E8F0] font-semibold mt-0.5">
                  Quản lý học sinh chuyên sâu, nhận diện 7 chiều rủi ro học tập, tự động sinh đề bài 5 kỹ năng và soạn giáo án chuẩn HSK.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.hash = '#teacher';
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center"
            >
              <span>Mở Bảng Điều Khiển Giáo Viên</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 1: JOIN CLASS BY CODE (/classroom/join) */}
        {/* ========================================================== */}
        {subRoute === 'join' && (
          <div className="max-w-xl mx-auto py-4 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center shadow-xs">
                  <Sparkles size={26} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white">
                  Nhập Mã Lớp Học
                </h2>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                  Nhận mã mời gồm 5 ký tự từ giáo viên của bạn (ví dụ: <span className="font-mono font-bold text-[#E85D3F]">HZG-7K2P9</span> hoặc chỉ cần nhập <span className="font-mono font-bold text-[#E85D3F]">7K2P9</span>)
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
                    className="flex-1 p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-mono font-bold text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-[#E85D3F]"
                  />
                  <button
                    onClick={handleLookupCode}
                    disabled={lookingUp}
                    className="px-5 py-3.5 rounded-2xl bg-[#E85D3F] text-white font-bold text-xs hover:bg-[#CB4529] cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {lookingUp ? 'Đang tìm...' : 'Kiểm tra'}
                  </button>
                </div>

                {joinError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{joinError}</span>
                  </div>
                )}
              </div>

              {/* Preview card when class found */}
              {lookedUpClass && (
                <div className="p-6 rounded-3xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#E85D3F] text-white">
                      {lookedUpClass.hsk_level}
                    </span>
                    <span className="text-xs font-semibold text-[#748092]">
                      Sĩ số: {lookedUpClass.student_count || 0} / {lookedUpClass.max_students || 30} học viên
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#243447] dark:text-white">
                      {lookedUpClass.name}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 leading-relaxed">
                      {lookedUpClass.description || 'Lớp học không có mô tả chi tiết.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                    <div className="w-9 h-9 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs">
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
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#45B97C]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 size={16} />
                    <span>{joining ? 'Đang tham gia...' : 'Xác nhận tham gia lớp này (+15 XP)'}</span>
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
            
            {/* Search Filter Bar */}
            {myClasses.length > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên lớp, mã lớp hoặc cấp độ..."
                    value={classSearchTerm}
                    onChange={(e) => setClassSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                  />
                  {classSearchTerm && (
                    <button
                      onClick={() => setClassSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#748092] hover:text-[#243447]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#748092] font-semibold hidden sm:block">
                  Hiển thị <strong>{filteredClasses.length}</strong> lớp học
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] animate-pulse">
                Đang tải danh sách lớp học của bạn...
              </div>
            ) : myClasses.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#1E293B] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-4 max-w-lg mx-auto shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">Bạn chưa tham gia lớp học nào</h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    Nhập mã code do giáo viên cung cấp để bắt đầu học tập, nhận bài tập được giao và vào phòng học trực tuyến cùng cả lớp.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('join')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/25"
                >
                  Nhập mã tham gia lớp ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredClasses.map(cls => (
                  <div
                    key={cls.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border border-[#E85D3F]/20">
                          {cls.hsk_level}
                        </span>
                        {liveSessionsMap[cls.id] ? (
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1" style={{animation: 'pulse 1.5s ease-in-out infinite'}}>
                            🔴 ĐANG LIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            Đang tham gia
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#243447] dark:text-white line-clamp-1 group-hover:text-[#E85D3F] transition-colors">
                          {cls.name}
                        </h3>
                        <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
                          {cls.description || 'Lớp học rèn luyện phản xạ và ngữ pháp cùng giáo viên.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-[#748092] dark:text-[#94A3B8] pt-1">
                        <div className="w-6 h-6 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-[10px]">
                          {cls.teacher_name ? cls.teacher_name.charAt(0) : 'T'}
                        </div>
                        <span className="truncate">{cls.teacher_name || 'Giáo viên HanziGo'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs">
                      <span className="text-[#748092]">
                        Mã: <strong className="font-mono text-[#E85D3F]">{cls.class_code}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {liveSessionsMap[cls.id] && (
                          <button
                            onClick={() => {
                              playClickSound();
                              window.location.hash = `#classroom/${cls.id}/live/${liveSessionsMap[cls.id].id}`;
                            }}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs hover:opacity-95 cursor-pointer flex items-center gap-1 shadow-md shadow-rose-500/25 animate-pulse"
                          >
                            <Video size={12} />
                            <span>Vào LIVE</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigateTo('detail', cls.id)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 cursor-pointer flex items-center gap-1 shadow-xs group-hover:scale-105 transition-transform"
                        >
                          <span>Vào lớp học</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
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
            
            {/* Active Live Session Pulsing Banner */}
            {activeLiveSession && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-amber-500/10 border-2 border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-lg shadow-rose-500/10">
                <div className="flex items-center gap-3.5">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500" />
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                        🔴 PHÒNG HỌC ĐANG TRỰC TIẾP
                      </span>
                      <h4 className="text-sm font-bold text-[#243447] dark:text-white">
                        {activeLiveSession.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                      Giáo viên đang mở phòng học trực tuyến {activeLiveSession.active_participants_count ? `(${activeLiveSession.active_participants_count} người trong phòng)` : ''}. Vào phòng để tương tác và luyện đàm thoại ngay!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(user?.role === 'teacher' || user?.role === 'admin' || currentClass?.teacher_id === (user?.uid || user?.id)) && (
                    <button
                      onClick={async () => {
                        if (window.confirm('Bạn có chắc chắn muốn KẾT THÚC phòng học trực tuyến này cho tất cả học viên?')) {
                          await endLiveSession(activeLiveSession.id, user?.uid || user?.id || 'system_cleanup');
                          setActiveLiveSession(null);
                          showToast('Đã kết thúc phiên học trực tuyến.');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-200/80 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-[#243447] dark:text-white font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                      title="Kết thúc phòng học ngay lập tức"
                    >
                      Kết thúc phòng
                    </button>
                  )}

                  <button
                    onClick={() => {
                      playClickSound();
                      window.location.hash = `#classroom/${classId}/live/${activeLiveSession.id}`;
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <Video size={14} />
                    <span>Tham gia phòng học Live</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Class Details Bar & Copy Code */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] font-black text-sm flex items-center justify-center border border-[#E85D3F]/20">
                  {currentClass.hsk_level}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#243447] dark:text-white">
                    {currentClass.name}
                  </h3>
                  <p className="text-xs text-[#748092]">
                    Sĩ số: {peers.length} thành viên • {currentClass.profiles?.name || 'Giáo viên phụ trách'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#748092]">Mã lớp:</span>
                <span className="px-3 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] font-mono font-bold text-xs text-[#E85D3F]">
                  {currentClass.class_code}
                </span>
                <button
                  onClick={() => handleCopyClassCode(currentClass.class_code)}
                  className="p-1.5 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#E85D3F] border border-[#F1E5D8] dark:border-[#2B3A4F] transition-colors cursor-pointer"
                  title="Sao chép mã lớp"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Navigation Tabs for Class */}
            <div className="flex items-center gap-1.5 border-b border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto pb-2">
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    classTab === tab.id
                      ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                      : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: ASSIGNMENTS */}
            {classTab === 'assignments' && (
              <div className="space-y-4">
                
                {/* Assignment Filter Pills */}
                {assignments.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-[#748092] uppercase mr-1">Lọc:</span>
                    {[
                      { id: 'all', label: `Tất cả (${assignments.length})` },
                      { id: 'pending', label: 'Cần nộp' },
                      { id: 'submitted', label: 'Đã nộp bài' },
                      { id: 'graded', label: 'Đã chấm điểm' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          playClickSound();
                          setAssignmentFilter(f.id);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          assignmentFilter === f.id
                            ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24]'
                            : 'bg-white dark:bg-[#1E293B] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {filteredAssignments.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Không có bài tập nào trong mục này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAssignments.map(asg => {
                      const sub = submissionsMap[asg.id];
                      return (
                        <div key={asg.id} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                {asg.content_type}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                sub?.status === 'graded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                                sub?.status === 'submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}>
                                {sub?.status === 'graded' ? `Đã chấm: ${sub.score}/100` :
                                 sub?.status === 'submitted' ? 'Đã nộp bài' :
                                 'Chưa làm'}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-[#243447] dark:text-white leading-snug">
                              {asg.title}
                            </h4>

                            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                              {asg.description}
                            </p>

                            {/* Feedback if graded */}
                            {sub?.feedback && (
                              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                <strong>Lời nhận xét của Thầy/Cô:</strong> {sub.feedback}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs">
                            <span className="text-[#748092] flex items-center gap-1">
                              <Clock size={12} />
                              <span>Hạn: {asg.due_date ? new Date(asg.due_date).toLocaleDateString('vi-VN') : 'Tự do'}</span>
                            </span>
                            <button
                              onClick={() => {
                                playClickSound();
                                setActiveAssignment(asg);
                                setQuizAnswers({});
                                setWritingNotes(sub?.submission_data?.notes || '');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-xs"
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

            {/* TAB 2: ANNOUNCEMENTS */}
            {classTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Chưa có thông báo nào từ giáo viên.
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#243447] dark:text-white">{ann.title}</h4>
                          {ann.pinned && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                              <Star size={10} className="fill-amber-500" />
                              <span>Ghim</span>
                            </span>
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

            {/* TAB 3: MATERIALS */}
            {classTab === 'materials' && (
              <div className="space-y-4">
                {materials.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Chưa có tài liệu học tập nào được tải lên trong lớp này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map(mat => (
                      <div key={mat.id} className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E85D3F] flex items-center justify-center font-bold text-xs uppercase">
                            {mat.file_type || 'PDF'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#243447] dark:text-white">{mat.title}</p>
                            <p className="text-[11px] text-[#748092] line-clamp-1">{mat.description || 'Tài liệu học tập nội bộ'}</p>
                          </div>
                        </div>
                        <a 
                          href={mat.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-xl text-[#748092] hover:text-[#E85D3F] hover:bg-[#FFF5F2] cursor-pointer"
                          title="Mở tài liệu"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PEERS */}
            {classTab === 'peers' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {peers.map(peer => (
                    <div key={peer.id} className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {peer.student_name ? peer.student_name.charAt(0) : 'H'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{peer.student_name}</p>
                          <p className="text-[10px] text-[#45B97C] font-semibold">{peer.hsk_level || 'HSK 1'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playClickSound();
                          if (setActiveTab) setActiveTab('community');
                        }}
                        className="text-[10px] text-[#E85D3F] font-bold hover:underline shrink-0 cursor-pointer"
                        title="Kết nối trong Cộng đồng"
                      >
                        Kết nối
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================== */}
      {/* MODAL: ASSIGNMENT SUBMISSION PLAYER */}
      {/* ========================================================== */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-xl w-full bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {activeAssignment.content_type}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white mt-1">
                  {activeAssignment.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveAssignment(null)}
                className="text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
              {activeAssignment.description}
            </p>

            <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
              {/* If Quiz format */}
              {activeAssignment.content?.questions && activeAssignment.content.questions.length > 0 && (
                <div className="space-y-3">
                  {activeAssignment.content.questions.map((q, qIdx) => {
                    const hasChinese = /[\u4e00-\u9fa5]/.test(q.prompt);
                    return (
                      <div key={q.id || qIdx} className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-[#243447] dark:text-white">
                            Câu {qIdx + 1}: {q.prompt}
                          </p>
                          {hasChinese && (
                            <button
                              type="button"
                              onClick={() => speakChinese(q.prompt)}
                              className="text-xs text-[#E85D3F] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                              title="Nghe phát âm câu hỏi"
                            >
                              <Volume2 size={13} />
                              <span>Nghe</span>
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {q.options?.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                quizAnswers[q.id || `q${qIdx + 1}`] === optIdx
                                  ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-[#E85D3F] text-[#E85D3F] font-bold'
                                  : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id || `q${qIdx + 1}`}
                                value={optIdx}
                                checked={quizAnswers[q.id || `q${qIdx + 1}`] === optIdx}
                                onChange={() => {
                                  playClickSound();
                                  setQuizAnswers({ ...quizAnswers, [q.id || `q${qIdx + 1}`]: optIdx });
                                }}
                                className="text-[#E85D3F]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
                  className="w-full p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  rows={4}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveAssignment(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/30"
                >
                  {submitting ? 'Đang nộp...' : 'Xác nhận Nộp bài (+20 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
