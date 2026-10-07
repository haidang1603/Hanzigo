import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff, 
  Hand, 
  Users, 
  MessageSquare, 
  Lock, 
  Unlock, 
  VolumeX, 
  UserX, 
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Send, 
  X, 
  Sparkles, 
  Copy
} from 'lucide-react';
import { 
  verifySessionAccess,
  joinLiveSession,
  leaveLiveSession,
  endLiveSession,
  getSessionParticipants,
  raiseHand,
  lowerHand,
  allowStudentMic,
  revokeStudentMic,
  muteAllParticipants,
  removeParticipant,
  updateMediaStatus,
  getSessionChatMessages,
  sendSessionChatMessage,
  deleteSessionChatMessage,
  toggleRoomLock,
  toggleChatMute,
  getSessionAttendanceReport,
  getLiveTeachingState,
  setSessionActiveTool,
  updateLiveTeachingToolState,
  getSessionHistoryAndSummary,
  LiveRoomMediaManager,
  liveEventBus
} from '../services/liveClassroomService';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

// Interactive Live Chinese Teaching Suite Modules
import LiveChineseToolbar from '../components/live/LiveChineseToolbar';
import InteractiveHanziBoard from '../components/live/InteractiveHanziBoard';
import HanziStrokeOrderBoard from '../components/live/HanziStrokeOrderBoard';
import PinyinToneBoard from '../components/live/PinyinToneBoard';
import PronunciationPracticeBoard from '../components/live/PronunciationPracticeBoard';
import LiveVocabularyBoard from '../components/live/LiveVocabularyBoard';
import LiveQuizBoard from '../components/live/LiveQuizBoard';
import WhiteboardBoard from '../components/live/WhiteboardBoard';
import GrammarBoard from '../components/live/GrammarBoard';
import ListeningActivityBoard from '../components/live/ListeningActivityBoard';
import SessionHistorySummaryModal from '../components/live/SessionHistorySummaryModal';

export default function LiveClassroomPage({
  user,
  classId,
  sessionId,
  onNavigateBack
}) {
  // Access and Auth state
  const [authChecking, setAuthChecking] = useState(true);
  const [accessDeniedReason, setAccessDeniedReason] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [myRole, setMyRole] = useState('student'); // 'teacher' | 'student'
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [isChatMuted, setIsChatMuted] = useState(false);

  // Participants & Queue state
  const [participants, setParticipants] = useState([]);
  const [myParticipant, setMyParticipant] = useState(null);

  // Media Hardware state
  const mediaManagerRef = useRef(null);
  const [mediaState, setMediaState] = useState({
    localStream: null,
    screenStream: null,
    isCameraOn: false,
    isMicOn: false,
    isScreenSharing: false
  });
  const [_mediaError, setMediaError] = useState(null);

  // Video element refs
  const teacherVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const studentSelfVideoRef = useRef(null);

  // Layout & Tabs state (for mobile / responsive)
  const [activeSideTab, setActiveSideTab] = useState('chat'); // 'chat' | 'participants' | 'hanziBoard'
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceReport, setAttendanceReport] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  // Live Chinese Teaching State & AI Summary
  const [teachingState, setTeachingState] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionSummaryData, setSessionSummaryData] = useState(null);
  const [isPresenterPipMinimized, setIsPresenterPipMinimized] = useState(false);
  const [hanziViewMode, setHanziViewMode] = useState('board'); // 'board' | 'stroke'

  // Chinese Whiteboard Quick Tools for language learning
  const [hanziBoardInput, setHanziBoardInput] = useState('你好');
  const [hanziPinyin, setHanziPinyin] = useState('nǐ hǎo');
  const [hanziMeaning, setHanziMeaning] = useState('Xin chào');

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. INITIALIZE MEDIA MANAGER
  useEffect(() => {
    const manager = new LiveRoomMediaManager();
    mediaManagerRef.current = manager;

    manager.onStreamUpdate = (state) => {
      setMediaState({ ...state });
    };

    manager.onError = (err) => {
      setMediaError(err);
      showToast(`⚠️ ${err}`);
    };

    return () => {
      manager.stopAll();
    };
  }, []);

  // 2. VERIFY ACCESS & JOIN SESSION
  const initSession = useCallback(async () => {
    setAuthChecking(true);
    setAccessDeniedReason(null);

    const check = await verifySessionAccess(sessionId, user);
    if (!check.allowed) {
      setAccessDeniedReason(check.reason);
      setAuthChecking(false);
      return;
    }

    setSessionData(check.session);
    setMyRole(check.role);
    setIsRoomLocked(Boolean(check.session.is_locked));
    setIsChatMuted(Boolean(check.session.is_chat_muted));

    // Join room
    const joinRes = await joinLiveSession(sessionId, user);
    if (!joinRes.success) {
      setAccessDeniedReason(joinRes.error);
      setAuthChecking(false);
      return;
    }

    setMyParticipant(joinRes.participant);

    // Initial participants, chat, and live teaching state
    const [partList, msgList, tState] = await Promise.all([
      getSessionParticipants(sessionId),
      getSessionChatMessages(sessionId),
      getLiveTeachingState(sessionId)
    ]);
    setParticipants(partList);
    setChatMessages(msgList);
    setTeachingState(tState);

    setAuthChecking(false);

    // If teacher, automatically request camera & mic by default for presenter role
    if (check.role === 'teacher') {
      mediaManagerRef.current?.startMedia({ video: true, audio: true });
    }
  }, [sessionId, user]);

  useEffect(() => {
    initSession();

    // Cleanup on unmount (Leave room)
    return () => {
      if (user) {
        leaveLiveSession(sessionId, user.uid || user.id);
      }
    };
  }, [initSession, sessionId, user]);

  // 3. ATTACH MEDIA STREAMS TO VIDEO TAGS
  useEffect(() => {
    if (mediaState.screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = mediaState.screenStream;
    }
  }, [mediaState.screenStream]);

  useEffect(() => {
    if (mediaState.localStream) {
      if (myRole === 'teacher' && teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = mediaState.localStream;
      } else if (studentSelfVideoRef.current) {
        studentSelfVideoRef.current.srcObject = mediaState.localStream;
      }
    }
  }, [mediaState.localStream, myRole]);

  // Leave room action
  const handleLeave = useCallback(() => {
    playClickSound();
    mediaManagerRef.current?.stopAll();
    if (user) {
      leaveLiveSession(sessionId, user.uid || user.id);
    }
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      window.location.hash = `#classroom/${classId}`;
    }
  }, [classId, onNavigateBack, sessionId, user]);

  // 4. REALTIME EVENT BUS LISTENER (Chỉ subscribe khi đã xác thực quyền truy cập phòng)
  useEffect(() => {
    if (!sessionData || accessDeniedReason || authChecking) return;

    const unsubscribe = liveEventBus.subscribe(sessionId, (event) => {
      switch (event.type) {
        case 'USER_JOINED':
        case 'USER_LEFT':
        case 'HAND_RAISED':
        case 'HAND_LOWERED':
        case 'MEDIA_STATE_CHANGED':
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'MIC_PERMISSION_GRANTED':
          if (event.studentId === (user?.uid || user?.id)) {
            playSuccessSound();
            showToast('🎤 Giáo viên đã cho phép bạn phát biểu! Bạn có thể bật Mic.');
            setMyParticipant(prev => prev ? { ...prev, is_mic_allowed: true } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'MIC_PERMISSION_REVOKED':
          if (event.studentId === (user?.uid || user?.id)) {
            showToast('🔇 Giáo viên đã thu hồi quyền phát biểu.');
            mediaManagerRef.current?.toggleMicrophone(false);
            setMyParticipant(prev => prev ? { ...prev, is_mic_allowed: false, mic_enabled: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'MUTE_ALL':
          if (myRole !== 'teacher') {
            mediaManagerRef.current?.toggleMicrophone(false);
            showToast('🔇 Giáo viên đã tắt Micro của tất cả học viên.');
            setMyParticipant(prev => prev ? { ...prev, mic_enabled: false, is_mic_allowed: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'USER_MUTED':
          if (event.targetUserId === (user?.uid || user?.id)) {
            mediaManagerRef.current?.toggleMicrophone(false);
            showToast('🔇 Giáo viên đã tắt Micro của bạn.');
            setMyParticipant(prev => prev ? { ...prev, mic_enabled: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'USER_KICKED':
          if (event.targetUserId === (user?.uid || user?.id)) {
            playErrorSound();
            alert('Bạn đã bị giáo viên mời ra khỏi phòng học.');
            handleLeave();
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'ROOM_LOCK_CHANGED':
          setIsRoomLocked(event.isLocked);
          showToast(event.isLocked ? '🔒 Phòng học đã được khóa.' : '🔓 Phòng học đã mở khóa.');
          break;

        case 'CHAT_MUTE_CHANGED':
          setIsChatMuted(event.isChatMuted);
          showToast(event.isChatMuted ? '🔇 Giáo viên đã tạm khóa chat.' : '💬 Chat đã được mở lại.');
          break;

        case 'NEW_CHAT_MESSAGE':
          setChatMessages(prev => [...prev, event.message]);
          setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
          break;

        case 'CHAT_MESSAGE_DELETED':
          setChatMessages(prev => prev.filter(m => m.id !== event.messageId));
          break;

        case 'SESSION_ENDED':
          playErrorSound();
          alert('Lớp học trực tuyến đã kết thúc bởi Giáo viên.');
          handleLeave();
          break;

        case 'TEACHING_TOOL_CHANGED':
          setTeachingState(prev => ({
            ...(prev || {}),
            active_tool: event.active_tool,
            ...(event.state || {})
          }));
          showToast(`🀄 Giáo viên đã chuyển sang công cụ: ${event.active_tool?.toUpperCase()}`);
          break;

        case 'TEACHING_STATE_UPDATED':
          setTeachingState(prev => ({
            ...(prev || {}),
            [`${event.toolName}_state`]: event.state
          }));
          break;

        case 'QUIZ_STARTED':
        case 'QUIZ_ANSWER_SUBMITTED':
        case 'QUIZ_ENDED':
        case 'LISTENING_STARTED':
        case 'LISTENING_ANSWER_SUBMITTED':
        case 'LISTENING_ENDED':
        case 'PRONUNCIATION_CHALLENGE_CREATED':
        case 'PRONUNCIATION_SUBMISSION_RECEIVED':
        case 'GRAMMAR_ANSWER_SUBMITTED':
          getLiveTeachingState(sessionId).then(setTeachingState);
          break;

        case 'VOCAB_ADDED_TO_LESSON':
          getLiveTeachingState(sessionId).then(setTeachingState);
          showToast(`📚 Từ vựng mới được thêm: ${event.vocabItem?.hanzi}`);
          break;

        case 'WHITEBOARD_OP':
          setTeachingState(prev => {
            const currentOps = prev?.whiteboard_state?.operations || [];
            return {
              ...(prev || {}),
              whiteboard_state: {
                ...(prev?.whiteboard_state || {}),
                operations: [...currentOps, event.op]
              }
            };
          });
          break;

        case 'WHITEBOARD_CLEARED':
          setTeachingState(prev => ({
            ...(prev || {}),
            whiteboard_state: { operations: [] }
          }));
          break;

        case 'SESSION_SUMMARY_GENERATED':
          setSessionSummaryData(event.summary);
          setShowSummaryModal(true);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [sessionId, user, myRole, handleLeave, sessionData, accessDeniedReason, authChecking]);

  // Raise hand queue computation (FIFO)
  const raiseHandQueue = useMemo(() => {
    return participants
      .filter(p => p.role === 'student' && p.hand_raised && !p.left_at)
      .sort((a, b) => new Date(a.hand_raised_at || 0) - new Date(b.hand_raised_at || 0));
  }, [participants]);

  const activeStudents = useMemo(() => {
    return participants.filter(p => p.role === 'student' && !p.left_at);
  }, [participants]);

  // =========================================================================
  // ACTIONS & CONTROLS
  // =========================================================================

  const handleToggleMic = async () => {
    playClickSound();
    if (myRole === 'student' && !myParticipant?.is_mic_allowed) {
      playErrorSound();
      showToast('⚠️ Vui lòng giơ tay phát biểu và đợi Giáo viên cho phép trước khi bật Micro.');
      return;
    }

    if (!mediaState.localStream) {
      await mediaManagerRef.current?.startMedia({ video: mediaState.isCameraOn, audio: true });
    }

    const nextMic = mediaManagerRef.current?.toggleMicrophone();
    if (user) {
      updateMediaStatus(sessionId, user.uid || user.id, { micEnabled: nextMic });
    }
  };

  const handleToggleCamera = async () => {
    playClickSound();
    if (!mediaState.localStream) {
      await mediaManagerRef.current?.startMedia({ video: true, audio: mediaState.isMicOn });
    }

    const nextCam = mediaManagerRef.current?.toggleCamera();
    if (user) {
      updateMediaStatus(sessionId, user.uid || user.id, { cameraEnabled: nextCam });
    }
  };

  const handleToggleScreenShare = async () => {
    playClickSound();
    if (myRole !== 'teacher') return;

    if (mediaState.isScreenSharing) {
      mediaManagerRef.current?.stopScreenShare();
    } else {
      const res = await mediaManagerRef.current?.startScreenShare();
      if (!res.success) {
        showToast(`⚠️ ${res.error}`);
      }
    }
  };

  const handleRaiseHandToggle = async () => {
    playClickSound();
    if (!user) return;
    const userId = user.uid || user.id;

    if (myParticipant?.hand_raised) {
      await lowerHand(sessionId, userId);
      setMyParticipant(prev => prev ? { ...prev, hand_raised: false } : prev);
      showToast('Đã hạ tay.');
    } else {
      await raiseHand(sessionId, userId);
      setMyParticipant(prev => prev ? { ...prev, hand_raised: true } : prev);
      showToast('✋ Đã giơ tay phát biểu! Đang chờ giáo viên cho phép.');
    }
  };

  const handleAllowMic = async (studentId, studentName) => {
    playClickSound();
    await allowStudentMic(sessionId, user.uid || user.id, studentId);
    showToast(`Đã cho phép ${studentName} phát biểu.`);
  };

  const handleRevokeMic = async (studentId, studentName) => {
    playClickSound();
    await revokeStudentMic(sessionId, user.uid || user.id, studentId);
    showToast(`Đã tắt quyền phát biểu của ${studentName}.`);
  };

  const handleMuteAll = async () => {
    playClickSound();
    if (!window.confirm('Tắt Micro của tất cả học viên trong phòng?')) return;
    await muteAllParticipants(sessionId, user.uid || user.id);
    showToast('Đã tắt Micro toàn thể lớp học.');
  };

  const handleKickParticipant = async (targetUserId, targetName) => {
    playClickSound();
    if (!window.confirm(`Bạn có chắc muốn mời ${targetName} ra khỏi lớp học?`)) return;
    await removeParticipant(sessionId, user.uid || user.id, targetUserId);
    showToast(`Đã mời ${targetName} ra khỏi lớp.`);
  };

  const handleToggleLock = async () => {
    playClickSound();
    await toggleRoomLock(sessionId, user.uid || user.id, !isRoomLocked);
  };

  const handleToggleChatMute = async () => {
    playClickSound();
    await toggleChatMute(sessionId, user.uid || user.id, !isChatMuted);
  };

  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !user) return;
    const res = await sendSessionChatMessage(sessionId, user, chatInput);
    if (res.success) {
      setChatInput('');
    } else {
      showToast(`⚠️ ${res.error}`);
    }
  };

  const handleDeleteChat = async (messageId) => {
    playClickSound();
    await deleteSessionChatMessage(sessionId, user.uid || user.id, messageId);
    showToast('Đã xóa tin nhắn.');
  };

  const handleSwitchTool = async (toolKey) => {
    playClickSound();
    if (myRole !== 'teacher') return;
    const res = await setSessionActiveTool(sessionId, user.uid || user.id, toolKey);
    if (res.success) {
      setTeachingState(res.state);
    }
  };

  const handleUpdateToolState = async (toolName, partialData) => {
    const res = await updateLiveTeachingToolState(sessionId, user.uid || user.id, toolName, partialData);
    if (res.success) {
      setTeachingState(prev => ({
        ...(prev || {}),
        [`${toolName}_state`]: {
          ...(prev?.[`${toolName}_state`] || {}),
          ...partialData
        }
      }));
    }
  };

  const handleOpenSummaryModal = async () => {
    playClickSound();
    const summary = await getSessionHistoryAndSummary(sessionId);
    setSessionSummaryData(summary);
    setShowSummaryModal(true);
  };

  const handleEndClass = async () => {
    playClickSound();
    if (!window.confirm('Bạn có chắc chắn muốn KẾT THÚC buổi học trực tuyến này? Toàn bộ học viên sẽ được lưu điểm danh và AI sẽ tổng hợp báo cáo bài học.')) {
      return;
    }

    const res = await endLiveSession(sessionId, user.uid || user.id);
    if (res.success) {
      const [report, summary] = await Promise.all([
        getSessionAttendanceReport(sessionId, user.uid || user.id),
        getSessionHistoryAndSummary(sessionId)
      ]);
      setAttendanceReport(report);
      setSessionSummaryData(summary);
      setShowSummaryModal(true);
    }
  };

  // =========================================================================
  // RENDER: AUTH CHECKING OR ACCESS DENIED
  // =========================================================================

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-[#E85D3F] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-bold text-white/80">Đang kiểm tra quyền truy cập phòng học Live...</p>
      </div>
    );
  }

  if (accessDeniedReason) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#1E293B] border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-white">Không thể tham gia phòng học</h2>
          <p className="text-xs text-white/70 leading-relaxed">
            {accessDeniedReason}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigateBack) onNavigateBack();
                else window.location.hash = `#classroom/${classId}`;
              }}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Quay lại trang lớp học</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN LIVE ROOM VIEW
  // =========================================================================

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-right duration-200">
          <div className="px-4 py-2.5 rounded-2xl bg-[#E85D3F] text-white text-xs font-bold shadow-xl flex items-center gap-2">
            <Sparkles size={15} />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* 1. HEADER BAR */}
      <header className="h-16 px-4 sm:px-6 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
              LIVE CLASS
            </span>
          </div>
          <div className="truncate">
            <h1 className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
              <span>{sessionData?.title || 'Phòng học trực tuyến'}</span>
              <span className="text-xs text-white/50 font-normal hidden md:inline">
                • {sessionData?.classroom_name}
              </span>
            </h1>
          </div>
        </div>

        {/* Header Right Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Capacity & Participants Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white/80">
            <Users size={14} className="text-[#45B97C]" />
            <span>{activeStudents.length + (participants.some(p => p.role === 'teacher' && !p.left_at) ? 1 : 0)} / {sessionData?.max_capacity || 50}</span>
          </div>

          {/* AI Summary / Session Report Button */}
          <button
            onClick={handleOpenSummaryModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D3F]/20 to-[#F4B942]/20 hover:from-[#E85D3F]/30 hover:to-[#F4B942]/30 border border-[#E85D3F]/40 text-[#F4B942] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Xem báo cáo tổng kết buổi học & AI Lesson Summary"
          >
            <Sparkles size={14} className="text-[#F4B942]" />
            <span className="hidden md:inline">AI Summary</span>
          </button>

          {/* Teacher Room Lock Toggle */}
          {myRole === 'teacher' && (
            <button
              onClick={handleToggleLock}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isRoomLocked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-white/10 border-white/10 text-white/70 hover:text-white'
              }`}
              title={isRoomLocked ? 'Phòng đang khóa (Bấm để mở)' : 'Phòng đang mở (Bấm để khóa)'}
            >
              {isRoomLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          )}

          {/* Leave or End Session Button */}
          {myRole === 'teacher' ? (
            <button
              onClick={handleEndClass}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kết thúc lớp</span>
            </button>
          ) : (
            <button
              onClick={handleLeave}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Rời phòng</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT (MAIN STAGE + SIDE PANEL) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* 2.1. MAIN TEACHING AREA / INTERACTIVE CHINESE STAGE */}
        <div className="flex-1 flex flex-col bg-[#070B14] p-3 sm:p-4 overflow-y-auto">
          
          {/* STAGE CONTAINER */}
          <div className="flex-1 rounded-3xl bg-[#111827] border border-white/10 overflow-hidden relative flex flex-col min-h-[480px] shadow-2xl">
            
            {/* LIVE CHINESE TEACHING TOOLBAR */}
            <LiveChineseToolbar
              activeTool={teachingState?.active_tool || 'hanzi'}
              onSelectTool={handleSwitchTool}
              isTeacher={myRole === 'teacher'}
            />

            {/* Sub-toggle for Hanzi Board vs Stroke Order when activeTool is 'hanzi' */}
            {(!teachingState?.active_tool || teachingState?.active_tool === 'hanzi') && !mediaState.isScreenSharing && (
              <div className="bg-[#0B0F19] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/60">Chế độ hiển thị:</span>
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setHanziViewMode('board')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        hanziViewMode === 'board' ? 'bg-[#E85D3F] text-white shadow-sm' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      🀄 Phân tích chữ Hán (Board)
                    </button>
                    <button
                      onClick={() => setHanziViewMode('stroke')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        hanziViewMode === 'stroke' ? 'bg-[#E85D3F] text-white shadow-sm' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      ✍️ Thuận bút & Luyện viết (Stroke)
                    </button>
                  </div>
                </div>

                <span className="text-[10px] text-white/40 hidden sm:inline">
                  {myRole === 'teacher' ? 'Giáo viên điều phối toàn lớp' : 'Theo dõi bài giảng'}
                </span>
              </div>
            )}

            {/* SCREEN SHARE PRESENTATION (IF ACTIVE) */}
            {mediaState.isScreenSharing ? (
              <div className="w-full flex-1 relative flex items-center justify-center bg-black min-h-[380px]">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                  <Monitor size={14} className="text-[#E85D3F]" />
                  <span>Màn hình của Giáo viên</span>
                </div>
              </div>
            ) : (
              /* DEDICATED INTERACTIVE CHINESE TEACHING ENVIRONMENT */
              <div className="flex-1 w-full overflow-hidden relative flex flex-col">
                {(!teachingState?.active_tool || teachingState?.active_tool === 'hanzi') && (
                  hanziViewMode === 'board' ? (
                    <InteractiveHanziBoard
                      isTeacher={myRole === 'teacher'}
                      hanziState={teachingState?.hanzi_state}
                      onUpdateState={(st) => handleUpdateToolState('hanzi', st)}
                    />
                  ) : (
                    <HanziStrokeOrderBoard
                      isTeacher={myRole === 'teacher'}
                      strokeState={teachingState?.stroke_state}
                      onUpdateState={(st) => handleUpdateToolState('stroke', st)}
                    />
                  )
                )}

                {teachingState?.active_tool === 'pinyin' && (
                  <PinyinToneBoard
                    isTeacher={myRole === 'teacher'}
                    pinyinState={teachingState?.pinyin_state}
                    onUpdateState={(st) => handleUpdateToolState('pinyin', st)}
                  />
                )}

                {teachingState?.active_tool === 'vocabulary' && (
                  <LiveVocabularyBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    vocabState={teachingState?.vocabulary_state}
                    onUpdateState={(st) => handleUpdateToolState('vocabulary', st)}
                  />
                )}

                {teachingState?.active_tool === 'pronunciation' && (
                  <PronunciationPracticeBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    pronState={teachingState?.pronunciation_state}
                    onUpdateState={(st) => handleUpdateToolState('pronunciation', st)}
                  />
                )}

                {teachingState?.active_tool === 'quiz' && (
                  <LiveQuizBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    quizState={teachingState?.quiz_state}
                    onUpdateState={(st) => handleUpdateToolState('quiz', st)}
                  />
                )}

                {teachingState?.active_tool === 'listening' && (
                  <ListeningActivityBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    listeningState={teachingState?.listening_state}
                    onUpdateState={(st) => handleUpdateToolState('listening', st)}
                  />
                )}

                {teachingState?.active_tool === 'grammar' && (
                  <GrammarBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    grammarState={teachingState?.grammar_state}
                    onUpdateState={(st) => handleUpdateToolState('grammar', st)}
                  />
                )}

                {teachingState?.active_tool === 'whiteboard' && (
                  <WhiteboardBoard
                    isTeacher={myRole === 'teacher'}
                    user={user}
                    sessionId={sessionId}
                    whiteboardState={teachingState?.whiteboard_state}
                    onUpdateState={(st) => handleUpdateToolState('whiteboard', st)}
                  />
                )}
              </div>
            )}

            {/* FLOATING PRESENTER VIDEO / AVATAR PIP (PICTURE-IN-PICTURE) */}
            <div className="absolute bottom-4 right-4 z-20 flex items-end gap-2 pointer-events-none">
              
              {/* Teacher Presenter Video PiP */}
              {myRole === 'teacher' ? (
                <div className={`rounded-2xl bg-black/90 border border-white/20 overflow-hidden shadow-2xl pointer-events-auto transition-all ${
                  isPresenterPipMinimized ? 'w-28 h-10 p-2 flex items-center justify-between' : 'w-44 h-32 relative'
                }`}>
                  {isPresenterPipMinimized ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold text-white truncate">GV: {user?.name}</span>
                      <button
                        onClick={() => setIsPresenterPipMinimized(false)}
                        className="text-[10px] text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Mở
                      </button>
                    </div>
                  ) : (
                    <>
                      {mediaState.isCameraOn ? (
                        <video
                          ref={teacherVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#0F172A]">
                          <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white text-xs font-black flex items-center justify-center">
                            {user?.name?.[0] || 'T'}
                          </div>
                          <span className="text-[10px] text-white/70 mt-1 font-bold truncate max-w-full">
                            {user?.name || 'Giáo viên'}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-1 left-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] font-bold text-white/90 bg-black/60 px-1 rounded">
                          Bạn (GV)
                        </span>
                      </div>
                      <button
                        onClick={() => setIsPresenterPipMinimized(true)}
                        className="absolute top-1 right-1 text-[9px] font-bold text-white/60 hover:text-white bg-black/60 px-1 rounded cursor-pointer"
                        title="Thu nhỏ"
                      >
                        _
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* Student view of teacher presenter stream */
                <div className={`rounded-2xl bg-black/90 border border-white/20 overflow-hidden shadow-2xl pointer-events-auto transition-all ${
                  isPresenterPipMinimized ? 'w-28 h-10 p-2 flex items-center justify-between' : 'w-44 h-32 relative'
                }`}>
                  {isPresenterPipMinimized ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold text-white truncate">Giáo viên</span>
                      <button
                        onClick={() => setIsPresenterPipMinimized(false)}
                        className="text-[10px] text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Mở
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#0F172A] relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white text-xs font-black flex items-center justify-center shadow-md">
                        师
                      </div>
                      <span className="text-[10px] text-white font-bold mt-1">Giáo viên (Live)</span>
                      <span className="text-[9px] text-emerald-400">● SFU Broadcast</span>
                      <button
                        onClick={() => setIsPresenterPipMinimized(true)}
                        className="absolute top-1 right-1 text-[9px] font-bold text-white/60 hover:text-white bg-black/60 px-1 rounded cursor-pointer"
                        title="Thu nhỏ"
                      >
                        _
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Student Self Mini Video */}
              {myRole === 'student' && mediaState.isCameraOn && (
                <div className="w-28 h-20 rounded-2xl bg-black/80 border border-white/20 overflow-hidden shadow-2xl pointer-events-auto relative">
                  <video
                    ref={studentSelfVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white/80 bg-black/60 px-1 rounded">
                    Bạn
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* MEDIA CONTROLS TOOLBAR */}
          <div className="mt-3 py-2.5 px-4 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-between gap-2 shadow-xl flex-wrap">
            
            {/* Left Controls: Audio & Video */}
            <div className="flex items-center gap-2">
              {/* Mic Button */}
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  mediaState.isMicOn
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-sm'
                    : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white/70'
                }`}
                title={mediaState.isMicOn ? 'Tắt Micro' : 'Bật Micro'}
              >
                {mediaState.isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                <span className="hidden sm:inline">{mediaState.isMicOn ? 'Bật Mic' : 'Tắt Mic'}</span>
              </button>

              {/* Camera Button */}
              <button
                onClick={handleToggleCamera}
                className={`p-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  mediaState.isCameraOn
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white/70'
                }`}
                title={mediaState.isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
              >
                {mediaState.isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                <span className="hidden sm:inline">{mediaState.isCameraOn ? 'Bật Cam' : 'Tắt Cam'}</span>
              </button>

              {/* Teacher Screen Share */}
              {myRole === 'teacher' && (
                <button
                  onClick={handleToggleScreenShare}
                  className={`p-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    mediaState.isScreenSharing
                      ? 'bg-[#E85D3F] text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white/70'
                  }`}
                  title={mediaState.isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
                >
                  {mediaState.isScreenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
                  <span className="hidden md:inline">{mediaState.isScreenSharing ? 'Dừng Share' : 'Share Màn hình'}</span>
                </button>
              )}
            </div>

            {/* Middle Controls: Raise Hand (Student) or Mute All (Teacher) */}
            <div className="flex items-center gap-2">
              {myRole === 'student' ? (
                <button
                  onClick={handleRaiseHandToggle}
                  className={`px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                    myParticipant?.hand_raised
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                      : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white/80'
                  }`}
                >
                  <Hand size={18} />
                  <span>{myParticipant?.hand_raised ? 'Hạ tay' : 'Giơ tay phát biểu'}</span>
                </button>
              ) : (
                <button
                  onClick={handleMuteAll}
                  className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                  title="Tắt micro của tất cả học viên"
                >
                  <VolumeX size={17} className="text-rose-400" />
                  <span className="hidden sm:inline">Tắt mic cả lớp</span>
                </button>
              )}
            </div>

            {/* Right Controls: Tab Switchers */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
              <button
                onClick={() => {
                  if (activeSideTab === 'chat' && isMobilePanelOpen) {
                    setIsMobilePanelOpen(false);
                  } else {
                    setActiveSideTab('chat');
                    setIsMobilePanelOpen(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'chat'
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                <span>Chat</span>
              </button>

              <button
                onClick={() => {
                  if (activeSideTab === 'participants' && isMobilePanelOpen) {
                    setIsMobilePanelOpen(false);
                  } else {
                    setActiveSideTab('participants');
                    setIsMobilePanelOpen(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative cursor-pointer ${
                  activeSideTab === 'participants'
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Thành viên</span>
                {raiseHandQueue.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
                )}
              </button>

              <button
                onClick={() => {
                  if (activeSideTab === 'hanziBoard' && isMobilePanelOpen) {
                    setIsMobilePanelOpen(false);
                  } else {
                    setActiveSideTab('hanziBoard');
                    setIsMobilePanelOpen(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'hanziBoard'
                    ? 'bg-[#E85D3F] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles size={14} />
                <span>Hán tự</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2.2. SIDE PANEL (CHAT | PARTICIPANTS | HANZI BOARD) */}
        <aside className={`w-full lg:w-96 bg-[#0F172A] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 ${
          isMobilePanelOpen ? 'h-80 sm:h-96' : 'hidden lg:flex lg:h-auto'
        }`}>
          
          {/* TAB 1: REALTIME CHAT */}
          {activeSideTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#E85D3F]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Tin nhắn lớp học</h3>
                </div>
                <div className="flex items-center gap-2">
                  {myRole === 'teacher' && (
                    <button
                      onClick={handleToggleChatMute}
                      className="text-[11px] text-white/60 hover:text-white font-medium cursor-pointer"
                    >
                      {isChatMuted ? 'Mở lại chat' : 'Khóa chat'}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobilePanelOpen(false)}
                    className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                    title="Đóng bảng"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs">
                    <p>Chưa có tin nhắn nào.</p>
                    <p className="text-[11px] pt-1">Chào thầy cô và bạn học bằng tiếng Trung nhé!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isFromMe = msg.sender_id === (user?.uid || user?.id);
                    const isTeacherMsg = msg.sender_role === 'teacher';

                    return (
                      <div key={msg.id} className="space-y-1 group">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white/90">{msg.sender_name}</span>
                            {isTeacherMsg && (
                              <span className="px-1.5 py-0.2 rounded bg-[#E85D3F]/20 text-[#E85D3F] text-[9px] font-black uppercase">
                                GIÁO VIÊN
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-white/40">
                              {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {myRole === 'teacher' && (
                              <button
                                onClick={() => handleDeleteChat(msg.id)}
                                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer transition-opacity"
                                title="Xóa tin nhắn"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={`p-2.5 rounded-2xl text-xs break-words leading-relaxed ${
                          isTeacherMsg
                            ? 'bg-[#E85D3F]/15 border border-[#E85D3F]/30 text-white'
                            : isFromMe
                            ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                            : 'bg-white/5 border border-white/10 text-white/80'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 bg-black/20">
                {isChatMuted && myRole !== 'teacher' ? (
                  <p className="text-center text-xs text-amber-400 py-1">
                    🔒 Giáo viên đang tạm thời khóa trò chuyện.
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-[#E85D3F]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] disabled:opacity-40 text-white transition-all cursor-pointer"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: PARTICIPANTS & RAISE HAND QUEUE */}
          {activeSideTab === 'participants' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#45B97C]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Học viên ({activeStudents.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Đóng bảng"
                >
                  <X size={16} />
                </button>
              </div>

              {/* RAISE HAND FIFO QUEUE SECTION */}
              {raiseHandQueue.length > 0 && (
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Hand size={14} />
                    <span>Hàng đợi giơ tay ({raiseHandQueue.length})</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {raiseHandQueue.map((student, idx) => (
                      <div key={student.id} className="p-2 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{student.user_name}</span>
                        </div>
                        {myRole === 'teacher' && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleAllowMic(student.user_id, student.user_name)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              Cho phép
                            </button>
                            <button
                              onClick={() => lowerHand(sessionId, student.user_id)}
                              className="px-2 py-1 rounded-lg bg-white/10 text-white/70 text-[10px] font-bold hover:text-white cursor-pointer"
                            >
                              Hạ tay
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ALL PARTICIPANTS LIST */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {participants.filter(p => !p.left_at).map((p) => {
                  const isTeacher = p.role === 'teacher';

                  return (
                    <div key={p.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isTeacher ? 'bg-[#E85D3F] text-white' : 'bg-white/15 text-white'
                        }`}>
                          {p.user_avatar || p.user_name?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-white truncate">{p.user_name}</p>
                            {isTeacher && (
                              <span className="px-1.5 py-0.2 rounded bg-[#E85D3F]/20 text-[#E85D3F] text-[9px] font-black uppercase">
                                GV
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/50">
                            {p.mic_enabled ? 'Đang bật mic' : p.is_mic_allowed ? 'Được phép nói' : 'Micro tắt'}
                          </p>
                        </div>
                      </div>

                      {/* Participant Status & Teacher Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.mic_enabled ? (
                          <Mic size={14} className="text-emerald-400" />
                        ) : (
                          <MicOff size={14} className="text-white/40" />
                        )}

                        {myRole === 'teacher' && !isTeacher && (
                          <div className="flex items-center gap-1">
                            {p.is_mic_allowed ? (
                              <button
                                onClick={() => handleRevokeMic(p.user_id, p.user_name)}
                                className="p-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 cursor-pointer"
                                title="Thu hồi quyền bật mic"
                              >
                                <VolumeX size={12} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAllowMic(p.user_id, p.user_name)}
                                className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                                title="Cho phép bật mic"
                              >
                                <Mic size={12} />
                              </button>
                            )}

                            <button
                              onClick={() => handleKickParticipant(p.user_id, p.user_name)}
                              className="p-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
                              title="Mời ra khỏi lớp"
                            >
                              <UserX size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HANZI QUICK WHITEBOARD & TEACHING TOOL */}
          {activeSideTab === 'hanziBoard' && (
            <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#E85D3F]">CÔNG CỤ GIẢNG DẠY</span>
                  <h3 className="text-sm font-bold text-white">Bảng phụ trợ Hán tự & Pinyin</h3>
                  <p className="text-xs text-white/60">
                    Hiển thị mẫu chữ Hán, phiên âm và nghĩa trực tiếp cho học viên theo dõi khi giảng.
                  </p>
                </div>
                <button
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
                  title="Đóng bảng"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Large Hanzi Presentation Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/15 text-center space-y-3 shadow-xl">
                <div className="text-5xl font-black text-[#F4B942] tracking-wider py-2">
                  {hanziBoardInput || '汉字'}
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {hanziPinyin || 'hàn zì'}
                  </div>
                  <div className="text-xs text-white/80">
                    {hanziMeaning || 'Chữ Hán'}
                  </div>
                </div>
              </div>

              {/* Quick Input (Teacher can change character on the fly) */}
              {myRole === 'teacher' && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-white/70">Thay đổi chữ hiển thị:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={hanziBoardInput}
                      onChange={(e) => setHanziBoardInput(e.target.value)}
                      placeholder="Chữ Hán"
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white text-center"
                    />
                    <input
                      type="text"
                      value={hanziPinyin}
                      onChange={(e) => setHanziPinyin(e.target.value)}
                      placeholder="Pinyin"
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white text-center"
                    />
                    <input
                      type="text"
                      value={hanziMeaning}
                      onChange={(e) => setHanziMeaning(e.target.value)}
                      placeholder="Nghĩa"
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </aside>
      </div>

      {/* 3. POST-SESSION ATTENDANCE REPORT MODAL (TEACHER) */}
      {showAttendanceModal && attendanceReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full max-h-[90vh] bg-[#1E293B] rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#45B97C]">ĐIỂM DANH TỰ ĐỘNG</span>
                <h3 className="text-lg font-black text-white">Báo cáo tham gia lớp học</h3>
                <p className="text-xs text-white/60">
                  Thời lượng phiên: {attendanceReport.sessionDurationMinutes} phút • Sĩ số: {attendanceReport.presentCount}/{attendanceReport.totalEnrolled} học viên ({attendanceReport.attendanceRate}%)
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAttendanceModal(false);
                  handleLeave();
                }}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Attendance Table */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-white/60 uppercase font-black text-[10px]">
                      <th className="p-3 pl-4">Học viên</th>
                      <th className="p-3">Giờ vào</th>
                      <th className="p-3">Thời gian học</th>
                      <th className="p-3 pr-4 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {attendanceReport.attendanceList.map((att) => (
                      <tr key={att.student_id} className="hover:bg-white/5">
                        <td className="p-3 pl-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#E85D3F]/20 text-[#E85D3F] flex items-center justify-center text-[10px]">
                              {att.student_avatar || att.student_name?.[0]}
                            </div>
                            <span>{att.student_name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-white/70">
                          {att.joined_at 
                            ? new Date(att.joined_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </td>
                        <td className="p-3 text-white/70">
                          {att.duration_minutes > 0 ? `${att.duration_minutes} phút` : '0 phút'}
                        </td>
                        <td className="p-3 pr-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${att.badge_class}`}>
                            {att.status_label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  showToast('Đã sao chép báo cáo điểm danh vào clipboard!');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span>Sao chép kết quả</span>
              </button>
              <button
                onClick={() => {
                  setShowAttendanceModal(false);
                  handleLeave();
                }}
                className="px-5 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Hoàn tất & Rời phòng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI LESSON SUMMARY & POST-SESSION REPORT MODAL */}
      {showSummaryModal && sessionSummaryData && (
        <SessionHistorySummaryModal
          summaryData={sessionSummaryData}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

    </div>
  );
}
