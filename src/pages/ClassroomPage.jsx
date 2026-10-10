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
  Filter,
  Heart,
  ThumbsUp,
  Lightbulb,
  Download,
  CheckCircle,
  RefreshCw,
  BarChart2,
  Zap,
  Bookmark,
  Bell,
  Share2,
  Radio,
  Play
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
import { getActiveSessionForClass, createClassSession, endLiveSession, liveEventBus } from '../services/liveClassroomService';
import { playClickSound, playSuccessSound, playErrorSound, speakChinese } from '../utils/audio';
import { awardXp } from '../utils/gamification';

// Theme styling map for HSK levels
const HSK_THEMES = {
  'HSK 1': {
    gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
    character: '一',
    label: 'Cơ bản'
  },
  'HSK 2': {
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
    character: '二',
    label: 'Sơ cấp'
  },
  'HSK 3': {
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    character: '三',
    label: 'Trung cấp'
  },
  'HSK 4': {
    gradient: 'from-orange-600 via-rose-600 to-red-700',
    lightBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-800',
    character: '四',
    label: 'Trung cao'
  },
  'HSK 5': {
    gradient: 'from-purple-600 via-indigo-600 to-purple-800',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-800',
    character: '五',
    label: 'Cao cấp'
  },
  'HSK 6': {
    gradient: 'from-rose-700 via-red-700 to-rose-900',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-300 dark:border-rose-800',
    character: '六',
    label: 'Thành thạo'
  }
};

const DEFAULT_THEME = {
  gradient: 'from-[#E85D3F] via-[#CB4529] to-[#991B1B]',
  lightBg: 'bg-orange-50 dark:bg-orange-950/40',
  badgeText: 'text-orange-700 dark:text-orange-300',
  border: 'border-orange-300 dark:border-orange-800',
  character: '学',
  label: 'Khóa học'
};

// Preset demo classrooms for 1-click exploration
const PRESET_DEMO_CLASSES = [
  {
    code: 'HZG-7K2P9',
    level: 'HSK 1',
    name: 'HSK 1 - Nhập môn Giao tiếp & Phát âm',
    teacher: 'Giáo viên HanziGo',
    desc: 'Luyện âm chuẩn, 150 từ vựng và câu giao tiếp căn bản.'
  },
  {
    code: 'HZG-9M4X2',
    level: 'HSK 2',
    name: 'HSK 2 - Tăng tốc Hội thoại Hằng ngày',
    teacher: 'Giáo viên HanziGo',
    desc: '300 từ vựng cốt lõi, mẫu câu phản xạ trong đời sống.'
  }
];

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

  // Search & Filter state
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all' | 'pending' | 'submitted' | 'graded'
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL'); // 'ALL' | 'LIVE' | 'HSK 1' | 'HSK 2' | ...

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

  // Announcement reaction counts stored locally
  const [reactionsMap, setReactionsMap] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_announcement_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleReaction = useCallback((annId, emoji) => {
    playClickSound();
    setReactionsMap(prev => {
      const key = `${annId}_${emoji}`;
      const count = (prev[key] || 0) + 1;
      const updated = { ...prev, [key]: count };
      try {
        localStorage.setItem('hanzigo_announcement_reactions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = user?.name || user?.user_metadata?.name || 'Học viên';
    if (hour < 12) return { text: `Chào buổi sáng, ${name}!`, proverb: '千里之行，始于足下 — Vạn dặm khởi từ một bước' };
    if (hour < 18) return { text: `Chào buổi chiều, ${name}!`, proverb: '敏而好学，不耻下问 — Chăm học, không ngại hỏi han' };
    return { text: `Chào buổi tối, ${name}!`, proverb: '温故而知新，可以为师矣 — Ôn cũ biết mới' };
  }, [user]);

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

    // Fallback polling mỗi 5s
    const interval = setInterval(async () => {
      try {
        const liveSes = await getActiveSessionForClass(classId);
        setActiveLiveSession(liveSes || null);
        setLiveSessionsMap(prev => ({ ...prev, [classId]: liveSes || undefined }));
        const mems = await getClassMembers(classId);
        setPeers(mems || []);
      } catch {}
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [classId]);

  // Poll live sessions cho TẤT CẢ lớp mỗi 5s → hiện LIVE badge trên list view
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
        if (classId) setActiveLiveSession(map[classId] || null);
      } catch {}
    };

    const timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [myClasses.length, classId, myClasses]);

  // Handle lookup by class code
  const handleLookupCode = async (codeToLookup = null) => {
    const code = (codeToLookup || inputCode).trim().toUpperCase();
    setJoinError('');
    setLookedUpClass(null);
    if (!code) {
      setJoinError('Vui lòng nhập mã lớp học.');
      return;
    }

    setLookingUp(true);
    try {
      const found = await lookupClassroomByCode(code);
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
      const studentName = user?.name || user?.user_metadata?.name || 'Học viên HanziGo';

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
            particleCount: 60,
            spread: 70,
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
    let submittedCount = 0;
    let totalScore = 0;

    assignments.forEach(asg => {
      const sub = submissionsMap[asg.id];
      if (!sub || sub.status === 'pending') {
        pendingHomework++;
      } else if (sub.status === 'graded') {
        gradedCount++;
        submittedCount++;
        if (typeof sub.score === 'number') totalScore += sub.score;
      } else if (sub.status === 'submitted') {
        submittedCount++;
      }
    });

    const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : null;
    const completionRate = assignments.length > 0 ? Math.round((submittedCount / assignments.length) * 100) : 100;

    return { totalClasses, pendingHomework, gradedCount, submittedCount, avgScore, completionRate };
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

  // Filtered classes by search term and level filter
  const filteredClasses = useMemo(() => {
    let result = myClasses;

    if (levelFilter === 'LIVE') {
      result = result.filter(c => !!liveSessionsMap[c.id]);
    } else if (levelFilter !== 'ALL') {
      result = result.filter(c => c.hsk_level === levelFilter);
    }

    const term = classSearchTerm.toLowerCase().trim();
    if (!term) return result;

    return result.filter(c => 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.class_code && c.class_code.toLowerCase().includes(term)) ||
      (c.hsk_level && c.hsk_level.toLowerCase().includes(term)) ||
      (c.teacher_name && c.teacher_name.toLowerCase().includes(term))
    );
  }, [myClasses, classSearchTerm, levelFilter, liveSessionsMap]);

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

        {/* ========================================================== */}
        {/* 1. HERO HEADER BANNER (ASIAN-MODERN SCHOLAR PORTAL) */}
        {/* ========================================================== */}
        <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-2xl">
          {/* Subtle Asian background clouds / circles */}
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
                  : `${greeting.text} ${greeting.proverb}`}
              </p>
              
              {/* Quick Summary Pill Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  🏫 <strong>{myClasses.length}</strong> lớp đã tham gia
                </span>
                {classId && currentClass ? (
                  <>
                    <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                      📝 <strong>{assignments.length}</strong> bài tập
                    </span>
                    {stats.avgScore !== null && (
                      <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-300">
                        ⭐ Điểm TB: <strong>{stats.avgScore}/100</strong>
                      </span>
                    )}
                  </>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-amber-200">
                    <Sparkles size={12} className="text-amber-300" />
                    <span>Lộ trình HSK tiêu chuẩn kết hợp phòng học trực tuyến</span>
                  </span>
                )}
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
              {subRoute !== 'list' && (
                <button
                  onClick={() => navigateTo('list')}
                  className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại Danh sách lớp</span>
                </button>
              )}

              {subRoute === 'detail' && currentClass && (
                <button
                  onClick={handleLeaveClass}
                  className="px-4 py-2.5 rounded-2xl bg-rose-500/30 hover:bg-rose-500/50 text-white border border-rose-300/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
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

          {/* Decorative Calligraphy Watermark */}
          <div className="absolute right-6 -bottom-8 font-['Noto_Serif_SC'] text-8xl sm:text-9xl font-black text-white/10 select-none pointer-events-none">
            敏而好学
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. GAMIFIED STUDENT OVERVIEW KPI CARDS */}
        {/* ========================================================== */}
        {subRoute === 'list' && myClasses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] truncate">Lớp tham gia</p>
                <p className="text-xl font-black text-[#243447] dark:text-white">{myClasses.length} lớp</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <Radio size={20} className={Object.values(liveSessionsMap).filter(Boolean).length > 0 ? "animate-pulse" : ""} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] truncate">Phòng học Live</p>
                <p className="text-xl font-black text-[#243447] dark:text-white">
                  {Object.values(liveSessionsMap).filter(Boolean).length > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <span>{Object.values(liveSessionsMap).filter(Boolean).length}</span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600">Đang Live</span>
                    </span>
                  ) : (
                    <span className="text-[#748092]">Chưa mở</span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] truncate">Tỷ lệ nộp bài</p>
                <p className="text-xl font-black text-[#243447] dark:text-white">{stats.completionRate}%</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] truncate">Điểm trung bình</p>
                <p className="text-xl font-black text-[#243447] dark:text-white">
                  {stats.avgScore !== null ? `${stats.avgScore}/100` : '--'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* 3. TEACHER STUDIO BANNER (GIÁO VIÊN & ADMIN) */}
        {/* ========================================================== */}
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
          <div className="max-w-2xl mx-auto py-2 space-y-6 animate-in fade-in duration-200">
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
                    onClick={() => handleLookupCode()}
                    disabled={lookingUp}
                    className="px-5 py-3.5 rounded-2xl bg-[#E85D3F] text-white font-bold text-xs hover:bg-[#CB4529] cursor-pointer disabled:opacity-50 shadow-md transition-all active:scale-95"
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
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#45B97C] to-[#2E8B57] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#45B97C]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 size={16} />
                    <span>{joining ? 'Đang tham gia...' : 'Xác nhận tham gia lớp này (+15 XP)'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Presets / Recommendations */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#243447] dark:text-white">
                <Bookmark size={15} className="text-[#E85D3F]" />
                <span>Lớp học tiêu chuẩn gợi ý (Tham gia nhanh 1-Click)</span>
              </div>
              <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                Nếu bạn chưa có mã lớp từ giáo viên riêng, bạn có thể tham gia ngay các lớp học nền tảng sau để trải nghiệm:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {PRESET_DEMO_CLASSES.map(cls => (
                  <div 
                    key={cls.code}
                    className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col justify-between space-y-2.5 hover:border-[#E85D3F] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F]">
                          {cls.level}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#748092]">{cls.code}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#243447] dark:text-white mt-1.5 line-clamp-1">{cls.name}</h4>
                      <p className="text-[10px] text-[#748092] dark:text-[#94A3B8] mt-0.5 line-clamp-2">{cls.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        setInputCode(cls.code);
                        handleLookupCode(cls.code);
                      }}
                      className="w-full py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E85D3F]/40 hover:bg-[#E85D3F] hover:text-white text-[#E85D3F] text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Chọn mã lớp này</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* VIEW 2: MY CLASSROOMS LIST (/classroom) */}
        {/* ========================================================== */}
        {subRoute === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Search and Level Filter Bar */}
            {myClasses.length > 0 && (
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên lớp, mã lớp hoặc giáo viên..."
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

                {/* Level Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'ALL', label: 'Tất cả' },
                    { id: 'LIVE', label: '🔴 Đang Live' },
                    { id: 'HSK 1', label: 'HSK 1' },
                    { id: 'HSK 2', label: 'HSK 2' },
                    { id: 'HSK 3', label: 'HSK 3' },
                    { id: 'HSK 4', label: 'HSK 4+' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        playClickSound();
                        setLevelFilter(f.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        levelFilter === f.id
                          ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                          : 'bg-white dark:bg-[#1E293B] text-[#748092] hover:text-[#243447] dark:hover:text-white border border-[#F1E5D8] dark:border-[#2B3A4F]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] animate-pulse space-y-3">
                <RefreshCw size={24} className="mx-auto animate-spin text-[#E85D3F]" />
                <p>Đang tải danh sách lớp học của bạn...</p>
              </div>
            ) : myClasses.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#1E293B] border border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-5 max-w-lg mx-auto shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] flex items-center justify-center">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">Bạn chưa tham gia lớp học nào</h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1.5 leading-relaxed">
                    Nhập mã lớp do giáo viên cung cấp để bắt đầu học tập, nhận bài tập được giao và vào phòng học trực tuyến cùng cả lớp.
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigateTo('join')}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} />
                    <span>Nhập mã tham gia lớp ngay (+15 XP)</span>
                  </button>
                </div>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                Không tìm thấy lớp học nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map(cls => {
                  const theme = HSK_THEMES[cls.hsk_level] || DEFAULT_THEME;
                  const isLive = !!liveSessionsMap[cls.id];

                  return (
                    <div
                      key={cls.id}
                      className={`rounded-3xl bg-white dark:bg-[#1E293B] border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 ${
                        isLive 
                          ? 'border-rose-500 shadow-xl shadow-rose-500/15 ring-2 ring-rose-500/30' 
                          : 'border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-xl'
                      }`}
                    >
                      {/* Top Header Card Banner with HSK Motif */}
                      <div className={`p-5 bg-gradient-to-r ${theme.gradient} text-white relative overflow-hidden`}>
                        <div className="absolute right-3 -bottom-4 font-['Noto_Serif_SC'] text-6xl font-black text-white/15 select-none pointer-events-none">
                          {theme.character}
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
                            {cls.hsk_level || 'HSK'} • {theme.label}
                          </span>

                          {isLive ? (
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-900/40 animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                              <span>ĐANG TRỰC TIẾP</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                              Đang học
                            </span>
                          )}
                        </div>

                        <h3 className="relative z-10 text-base font-bold text-white mt-3 line-clamp-1 group-hover:underline">
                          {cls.name}
                        </h3>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                            {cls.description || 'Lớp học rèn luyện phản xạ, ngữ pháp và khẩu ngữ tiếng Trung.'}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-xs text-[#748092] dark:text-[#94A3B8]">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-[10px]">
                                {cls.teacher_name ? cls.teacher_name.charAt(0) : 'T'}
                              </div>
                              <span className="truncate max-w-[130px] font-medium">{cls.teacher_name || 'Giáo viên HanziGo'}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#45B97C]">
                              👥 {cls.student_count || 1} học viên
                            </span>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => handleCopyClassCode(cls.class_code)}
                            className="font-mono text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
                            title="Sao chép mã lớp"
                          >
                            <span>{cls.class_code}</span>
                            <Copy size={11} className="opacity-70" />
                          </button>

                          <div className="flex items-center gap-2">
                            {isLive && (
                              <button
                                onClick={() => {
                                  playClickSound();
                                  window.location.hash = `#classroom/${cls.id}/live/${liveSessionsMap[cls.id].id}`;
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                              >
                                <Video size={13} />
                                <span>Vào Live</span>
                              </button>
                            )}
                            <button
                              onClick={() => navigateTo('detail', cls.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                            >
                              <span>Vào lớp</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                          const res = await endLiveSession(activeLiveSession.id, user?.uid || user?.id || 'system_cleanup');
                          if (res.success) {
                            setActiveLiveSession(null);
                            showToast('Đã kết thúc phiên học trực tuyến.');
                          } else {
                            showToast(res.error || 'Không thể kết thúc phòng học.');
                          }
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

            {/* Teacher Quick-Start Live Banner when no session is active */}
            {!activeLiveSession && (user?.role === 'teacher' || user?.role === 'admin' || currentClass?.teacher_id === (user?.uid || user?.id)) && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <Video size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#243447] dark:text-white">
                      Chưa có phòng học trực tuyến nào đang mở cho lớp này
                    </h4>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-0.5">
                      Bạn là giáo viên phụ trách. Bạn có thể mở phòng ngay để bắt đầu giảng dạy và học viên sẽ thấy thông báo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    playClickSound();
                    const teacherId = user?.uid || user?.id || 'user_teacher_demo';
                    const res = await createClassSession({
                      classroomId: currentClass.id,
                      teacherId,
                      title: `Buổi học trực tuyến: ${currentClass.name}`
                    });
                    if (res?.success && res.session) {
                      setActiveLiveSession(res.session);
                      window.location.hash = `#classroom/${currentClass.id}/live/${res.session.id}`;
                    } else {
                      showToast(res?.error || 'Không thể mở phòng học.');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Video size={14} />
                  <span>Bắt đầu phòng Live ngay</span>
                </button>
              </div>
            )}

            {/* Class Details Bar & Copy Code */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] font-black text-sm flex items-center justify-center border border-[#E85D3F]/20">
                  {currentClass.hsk_level}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white">
                    {currentClass.name}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Sĩ số: {peers.length} thành viên • {currentClass.profiles?.name || currentClass.teacher_name || 'Giáo viên phụ trách'}
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
            <div className="flex items-center gap-1.5 border-b border-[#F1E5D8] dark:border-[#2B3A4F] overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'assignments', icon: FileText, label: `Bài tập & Đề thi (${assignments.length})` },
                { id: 'announcements', icon: Bell, label: `Bảng tin & Thông báo (${announcements.length})` },
                { id: 'materials', icon: FolderDown, label: `Tài liệu (${materials.length})` },
                { id: 'peers', icon: Users, label: `Bạn cùng lớp (${peers.length})` },
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playClickSound();
                      setClassTab(tab.id);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      classTab === tab.id
                        ? 'bg-[#E85D3F] text-white shadow-sm shadow-[#E85D3F]/30'
                        : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ========================================================== */}
            {/* TAB 1: ASSIGNMENTS */}
            {/* ========================================================== */}
            {classTab === 'assignments' && (
              <div className="space-y-4">
                
                {/* Assignment Filter Pills & Progress Bar */}
                {assignments.length > 0 && (
                  <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#748092] uppercase">Lọc bài tập:</span>
                        {[
                          { id: 'all', label: `Tất cả (${assignments.length})` },
                          { id: 'pending', label: 'Cần làm' },
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
                                : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      <div className="text-xs text-[#748092] font-semibold flex items-center gap-2">
                        <span>Tiến độ hoàn thành:</span>
                        <strong className="text-[#E85D3F]">{stats.submittedCount}/{assignments.length} bài</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#FFF9F2] dark:bg-[#131B24] h-2 rounded-full overflow-hidden border border-[#F1E5D8] dark:border-[#2B3A4F]">
                      <div 
                        className="bg-gradient-to-r from-[#E85D3F] to-[#45B97C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${assignments.length > 0 ? (stats.submittedCount / assignments.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {filteredAssignments.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Không có bài tập nào trong mục này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredAssignments.map(asg => {
                      const sub = submissionsMap[asg.id];
                      const isGraded = sub?.status === 'graded';
                      const isSubmitted = sub?.status === 'submitted';

                      return (
                        <div key={asg.id} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-[#E85D3F] dark:bg-orange-950/60 dark:text-orange-300">
                                {asg.content_type || 'Trắc nghiệm'}
                              </span>
                              
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                isGraded ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                                isSubmitted ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}>
                                {isGraded ? `⭐ Đã chấm: ${sub.score}/100` :
                                 isSubmitted ? 'Đã nộp (Chờ chấm)' :
                                 'Chưa làm'}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-[#243447] dark:text-white leading-snug">
                              {asg.title}
                            </h4>

                            <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                              {asg.description}
                            </p>

                            {/* Feedback if graded */}
                            {sub?.feedback && (
                              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                <div className="flex items-center gap-1.5 font-bold mb-1">
                                  <Star size={13} className="text-amber-500 fill-amber-500" />
                                  <span>Lời nhận xét của Giáo viên:</span>
                                </div>
                                <p className="italic">{sub.feedback}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 text-xs">
                            <span className="text-[#748092] flex items-center gap-1.5">
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
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-xs active:scale-95 transition-all"
                            >
                              {sub ? 'Xem bài / Làm lại' : 'Làm bài ngay (+20 XP)'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 2: ANNOUNCEMENTS */}
            {/* ========================================================== */}
            {classTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Chưa có thông báo nào từ giáo viên.
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white flex items-center justify-center font-bold text-xs">
                            {currentClass.teacher_name ? currentClass.teacher_name.charAt(0) : 'T'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                              <span>{ann.title}</span>
                              {ann.pinned && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold flex items-center gap-1">
                                  <Star size={10} className="fill-amber-500" />
                                  <span>Ghim</span>
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-[#748092]">
                              {new Date(ann.created_at).toLocaleDateString('vi-VN')} • {currentClass.teacher_name || 'Giáo viên phụ trách'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed whitespace-pre-line pl-10">
                        {ann.content}
                      </p>

                      {/* Interactive Reactions */}
                      <div className="pl-10 pt-2 flex items-center gap-2">
                        {[
                          { emoji: 'heart', icon: Heart, label: 'Thả tim' },
                          { emoji: 'clap', icon: ThumbsUp, label: 'Đồng ý' },
                          { emoji: 'bulb', icon: Lightbulb, label: 'Hữu ích' }
                        ].map(rx => {
                          const count = reactionsMap[`${ann.id}_${rx.emoji}`] || 0;
                          const IconComp = rx.icon;
                          return (
                            <button
                              key={rx.emoji}
                              onClick={() => handleToggleReaction(ann.id, rx.emoji)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                count > 0 
                                  ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] border border-[#E85D3F]/30' 
                                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                              }`}
                            >
                              <IconComp size={12} className={count > 0 ? "fill-current" : ""} />
                              <span>{count > 0 ? count : rx.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 3: MATERIALS */}
            {/* ========================================================== */}
            {classTab === 'materials' && (
              <div className="space-y-4">
                {materials.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] text-center text-xs text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    Chưa có tài liệu học tập nào được tải lên trong lớp này.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map(mat => (
                      <div key={mat.id} className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {mat.file_type || 'PDF'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{mat.title}</p>
                            <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] line-clamp-1 mt-0.5">{mat.description || 'Tài liệu học tập nội bộ'}</p>
                          </div>
                        </div>
                        <a 
                          href={mat.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-[#FFF5F2] dark:bg-[#2C1D1A] text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Mở hoặc tải tài liệu"
                        >
                          <Download size={13} />
                          <span>Xem / Tải</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 4: PEERS */}
            {/* ========================================================== */}
            {classTab === 'peers' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {peers.map(peer => (
                    <div key={peer.id} className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E85D3F] to-[#CB4529] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {peer.student_name ? peer.student_name.charAt(0) : 'H'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#243447] dark:text-white truncate">{peer.student_name}</p>
                          <p className="text-[10px] text-[#45B97C] font-semibold">{peer.hsk_level || 'HSK 1'} • Học viên tích cực</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playClickSound();
                          if (setActiveTab) setActiveTab('community');
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] font-bold hover:bg-[#E85D3F] hover:text-white transition-colors shrink-0 cursor-pointer"
                        title="Kết nối trong Cộng đồng"
                      >
                        Nhắn tin
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
          <div className="max-w-xl w-full bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {activeAssignment.content_type || 'Trắc nghiệm'}
                </span>
                <h3 className="text-base font-bold text-[#243447] dark:text-white mt-1">
                  {activeAssignment.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveAssignment(null)}
                className="text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer p-1"
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

                        <div className="space-y-2">
                          {q.options?.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                quizAnswers[q.id || `q${qIdx + 1}`] === optIdx
                                  ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-[#E85D3F] text-[#E85D3F] font-bold shadow-xs'
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
                  className="w-full p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/30 active:scale-95 transition-all"
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
