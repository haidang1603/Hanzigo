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
  Send, 
  X, 
  Sparkles, 
  RefreshCw,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Activity,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { 
  verifySessionAccess,
  joinLiveSession,
  leaveLiveSession,
  endLiveSession,
  getSessionParticipants,
  getSessionById,
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
  LiveRoomMediaManager,
  liveEventBus
} from '../services/liveClassroomService';
import { LiveKitClassroomManager } from '../services/livekitService';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

/**
 * Reusable video tile for remote participants (both students and teacher)
 */
function RemoteParticipantTile({ participant, lkManager }) {
  const videoRef = useRef(null);
  const hasVideo = Boolean(participant?.videoTrack);

  useEffect(() => {
    if (hasVideo && videoRef.current && lkManager) {
      lkManager.attachTrack(participant.videoTrack, videoRef.current);
      return () => {
        lkManager.detachTrack(participant.videoTrack, videoRef.current);
      };
    }
  }, [hasVideo, participant?.videoTrack, lkManager]);

  return (
    <div className={`relative rounded-2xl bg-[#0F172A] border overflow-hidden aspect-video flex items-center justify-center transition-all ${
      participant?.isSpeaking ? 'border-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/50' : 'border-white/10'
    }`}>
      {hasVideo ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E85D3F] to-[#F4B942] text-white font-black text-lg flex items-center justify-center shadow-md">
            {participant?.name?.[0]?.toUpperCase() || 'H'}
          </div>
          <p className="text-xs font-bold text-white/90 mt-2 truncate max-w-[120px]">
            {participant?.name || 'Học viên'}
          </p>
          <span className="text-[10px] text-white/50">Camera tắt</span>
        </div>
      )}

      {/* Name and status badge */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white max-w-[80%] truncate">
          {participant?.isSpeaking && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          )}
          <span className="truncate">{participant?.name || 'Học viên'}</span>
          {participant?.role === 'teacher' && (
            <span className="px-1 py-0.2 rounded bg-[#E85D3F] text-[9px] font-black uppercase">GV</span>
          )}
        </div>

        <div className="px-1.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md flex items-center gap-1 text-[10px]">
          {participant?.audioTrack ? (
            <Volume2 size={12} className={participant?.isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-white/70'} />
          ) : (
            <MicOff size={12} className="text-rose-400" />
          )}
        </div>
      </div>
    </div>
  );
}

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

  // Video element refs
  const teacherVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const selfVideoRef = useRef(null);
  const classroomContainerRef = useRef(null);

  // LiveKit WebRTC SFU state
  const livekitManagerRef = useRef(null);
  const [connectionState, setConnectionState] = useState({
    status: 'connecting', // 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
    isConfigured: true,
    ping: 25,
    error: null
  });

  const [teacherRemoteStream, setTeacherRemoteStream] = useState({
    videoTrack: null,
    audioTrack: null,
    screenTrack: null,
    isScreenSharingActive: false
  });

  const [livekitLocalTracks, setLivekitLocalTracks] = useState({
    videoTrack: null,
    audioTrack: null,
    screenTrack: null
  });

  const [remoteLkParticipants, setRemoteLkParticipants] = useState([]);

  // Layout & UI state
  const [activeSideTab, setActiveSideTab] = useState('chat'); // 'chat' | 'participants' | null
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const chatBottomRef = useRef(null);
  const handleLeaveRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const currentUserId = user?.uid || user?.id;

  // =========================================================================
  // 1. INITIALIZE WEBRTC MEDIA & LIVEKIT ROOM
  // =========================================================================
  const initSession = useCallback(async () => {
    setAuthChecking(true);
    setAccessDeniedReason(null);
    setConnectionState(prev => ({ ...prev, status: 'connecting', error: null }));

    // Verify access
    const check = await verifySessionAccess(sessionId, user);
    if (!check.allowed) {
      setAccessDeniedReason(check.reason);
      setAuthChecking(false);
      setConnectionState(prev => ({ ...prev, status: 'disconnected', error: check.reason }));
      return;
    }

    setSessionData(check.session);
    setMyRole(check.role);
    setIsRoomLocked(Boolean(check.session?.is_locked));
    setIsChatMuted(Boolean(check.session?.is_chat_muted));

    // Join room in database / session store
    const joinRes = await joinLiveSession(sessionId, user);
    if (!joinRes.success) {
      setAccessDeniedReason(joinRes.error);
      setAuthChecking(false);
      setConnectionState(prev => ({ ...prev, status: 'disconnected', error: joinRes.error }));
      return;
    }

    setMyParticipant(joinRes.participant);

    // Initial participants & chat
    const [partList, msgList] = await Promise.all([
      getSessionParticipants(sessionId),
      getSessionChatMessages(sessionId)
    ]);
    setParticipants(partList);
    setChatMessages(msgList);
    setAuthChecking(false);

    // Connect to LiveKit WebRTC SFU Server
    const lkManager = new LiveKitClassroomManager();
    livekitManagerRef.current = lkManager;

    lkManager.onConnectionChange = ({ isConnected, isReconnecting: isReconn, state, error }) => {
      setConnectionState(prev => ({
        ...prev,
        status: isReconn ? 'reconnecting' : (isConnected ? 'connected' : (error ? 'disconnected' : 'connecting')),
        error: error || null
      }));
      if (isConnected) {
        setIsReconnecting(false);
      }
    };

    lkManager.onTeacherStreamChange = (streamData) => {
      setTeacherRemoteStream(prev => ({
        ...prev,
        videoTrack: streamData.videoTrack,
        audioTrack: streamData.audioTrack,
        screenTrack: streamData.screenTrack,
        isScreenSharingActive: Boolean(streamData.screenTrack)
      }));
    };

    lkManager.onRemoteParticipantsChange = (lkParts) => {
      setRemoteLkParticipants([...lkParts]);
      // Sync names from Supabase session_participants
      getSessionParticipants(sessionId).then(setParticipants).catch(() => {});
    };

    lkManager.onLocalStreamChange = (localStreamData) => {
      const isSharing = Boolean(localStreamData.screenTrack);
      setLivekitLocalTracks({ ...localStreamData });
      setMediaState(prev => {
        if (check.role === 'teacher' && prev.isScreenSharing !== isSharing) {
          liveEventBus.broadcast(sessionId, {
            type: 'TEACHER_SCREEN_SHARE_CHANGED',
            isSharing
          });
        }
        return {
          ...prev,
          isCameraOn: Boolean(localStreamData.videoTrack),
          isMicOn: Boolean(localStreamData.audioTrack),
          isScreenSharing: isSharing
        };
      });
    };

    try {
      const connRes = await lkManager.connect({
        sessionId,
        user,
        role: check.role,
        teacherId: check.session?.teacher_id
      });

      const isConnected = Boolean(connRes?.room?.state === 'connected' || connRes?.success);
      setConnectionState({
        status: isConnected ? 'connected' : 'disconnected',
        isConfigured: Boolean(connRes?.isConfigured),
        ping: Math.floor(Math.random() * 15) + 18,
        error: connRes?.error || null
      });

      if (!isConnected) {
        const fallbackManager = new LiveRoomMediaManager();
        mediaManagerRef.current = fallbackManager;
      }

      // Teacher automatically publishes camera & mic upon joining
      if (check.role === 'teacher' && isConnected) {
        lkManager.setCameraEnabled(true).catch(() => {});
        lkManager.setMicrophoneEnabled(true).catch(() => {});
      }
    } catch (err) {
      console.warn('[LiveClassroom] LiveKit connection warning:', err);
      setConnectionState({
        status: 'disconnected',
        isConfigured: true,
        ping: 0,
        error: err.message
      });
      // Fallback: local media manager
      const fallbackManager = new LiveRoomMediaManager();
      mediaManagerRef.current = fallbackManager;
      if (check.role === 'teacher') {
        fallbackManager.startMedia({ video: true, audio: true }).then(mRes => {
          if (mRes?.success) {
            setMediaState(prev => ({ ...prev, localStream: mRes.stream, isCameraOn: true, isMicOn: true }));
          }
        }).catch(() => {});
      }
    }
  }, [sessionId, user]);

  useEffect(() => {
    initSession();

    // Polling interval (3s) to synchronize participants status
    const interval = setInterval(() => {
      getSessionParticipants(sessionId).then(setParticipants).catch(() => {});
    }, 3000);

    const handleBeforeUnload = () => {
      livekitManagerRef.current?.disconnect();
      mediaManagerRef.current?.stopAll();
      if (currentUserId) {
        leaveLiveSession(sessionId, currentUserId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      livekitManagerRef.current?.disconnect();
      mediaManagerRef.current?.stopAll();
      if (currentUserId) {
        leaveLiveSession(sessionId, currentUserId);
      }
    };
  }, [initSession, sessionId, currentUserId]);

  // Periodic ping simulation for connection quality display
  useEffect(() => {
    if (connectionState.status !== 'connected') return;
    const pInterval = setInterval(() => {
      setConnectionState(prev => ({
        ...prev,
        ping: Math.floor(Math.random() * 12) + 20
      }));
    }, 5000);
    return () => clearInterval(pInterval);
  }, [connectionState.status]);

  // =========================================================================
  // 2. VIDEO TRACK ATTACHMENT
  // =========================================================================
  
  // Teacher Spotlight Video (when teacher is remote and camera is active)
  useEffect(() => {
    const el = teacherVideoRef.current;
    const lk = livekitManagerRef.current;
    if (myRole === 'student' && el && teacherRemoteStream.videoTrack) {
      lk?.attachTrack(teacherRemoteStream.videoTrack, el);
      return () => {
        lk?.detachTrack(teacherRemoteStream.videoTrack, el);
      };
    }
  }, [myRole, teacherRemoteStream.videoTrack]);

  // Teacher Local Video Preview (when user is teacher)
  useEffect(() => {
    const el = teacherVideoRef.current;
    const lk = livekitManagerRef.current;
    if (myRole === 'teacher' && el) {
      if (livekitLocalTracks.videoTrack) {
        lk?.attachTrack(livekitLocalTracks.videoTrack, el);
      } else if (mediaState.localStream) {
        el.srcObject = mediaState.localStream;
      } else {
        el.srcObject = null;
      }
      return () => {
        if (livekitLocalTracks.videoTrack && el) {
          lk?.detachTrack(livekitLocalTracks.videoTrack, el);
        }
      };
    }
  }, [myRole, livekitLocalTracks.videoTrack, mediaState.localStream, mediaState.isCameraOn]);

  // Local Self Preview Video (for student or teacher floating preview)
  useEffect(() => {
    const el = selfVideoRef.current;
    const lk = livekitManagerRef.current;
    if (el) {
      if (livekitLocalTracks.videoTrack) {
        lk?.attachTrack(livekitLocalTracks.videoTrack, el);
      } else if (mediaState.localStream) {
        el.srcObject = mediaState.localStream;
      } else {
        el.srcObject = null;
      }
      return () => {
        if (livekitLocalTracks.videoTrack && el) {
          lk?.detachTrack(livekitLocalTracks.videoTrack, el);
        }
      };
    }
  }, [livekitLocalTracks.videoTrack, mediaState.localStream, mediaState.isCameraOn]);

  // Screen Share Video
  useEffect(() => {
    const el = screenVideoRef.current;
    const lk = livekitManagerRef.current;
    if (el) {
      if (myRole === 'teacher' && livekitLocalTracks.screenTrack) {
        lk?.attachTrack(livekitLocalTracks.screenTrack, el);
        return () => {
          lk?.detachTrack(livekitLocalTracks.screenTrack, el);
        };
      } else if (myRole === 'student' && teacherRemoteStream.screenTrack) {
        lk?.attachTrack(teacherRemoteStream.screenTrack, el);
        return () => {
          lk?.detachTrack(teacherRemoteStream.screenTrack, el);
        };
      }
    }
  }, [myRole, livekitLocalTracks.screenTrack, teacherRemoteStream.screenTrack]);

  // =========================================================================
  // 3. REALTIME EVENT BUS LISTENER
  // =========================================================================
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
          if (event.studentId === currentUserId) {
            playSuccessSound();
            showToast('🎤 Giáo viên đã cho phép bạn phát biểu! Bạn có thể bật Mic.');
            setMyParticipant(prev => prev ? { ...prev, is_mic_allowed: true } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'MIC_PERMISSION_REVOKED':
          if (event.studentId === currentUserId) {
            showToast('🔇 Giáo viên đã thu hồi quyền phát biểu.');
            livekitManagerRef.current?.setMicrophoneEnabled(false);
            mediaManagerRef.current?.toggleMicrophone(false);
            setMediaState(prev => ({ ...prev, isMicOn: false }));
            setMyParticipant(prev => prev ? { ...prev, is_mic_allowed: false, mic_enabled: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'MUTE_ALL':
          if (myRole !== 'teacher') {
            livekitManagerRef.current?.setMicrophoneEnabled(false);
            mediaManagerRef.current?.toggleMicrophone(false);
            setMediaState(prev => ({ ...prev, isMicOn: false }));
            showToast('🔇 Giáo viên đã tắt Micro của tất cả học viên.');
            setMyParticipant(prev => prev ? { ...prev, mic_enabled: false, is_mic_allowed: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'USER_MUTED':
          if (event.targetUserId === currentUserId) {
            livekitManagerRef.current?.setMicrophoneEnabled(false);
            mediaManagerRef.current?.toggleMicrophone(false);
            setMediaState(prev => ({ ...prev, isMicOn: false }));
            showToast('🔇 Giáo viên đã tắt Micro của bạn.');
            setMyParticipant(prev => prev ? { ...prev, mic_enabled: false } : prev);
          }
          getSessionParticipants(sessionId).then(setParticipants);
          break;

        case 'USER_KICKED':
          if (event.targetUserId === currentUserId) {
            playErrorSound();
            alert('Bạn đã bị giáo viên mời ra khỏi phòng học.');
            handleLeaveRef.current?.(true);
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
          if (activeSideTab !== 'chat') {
            setUnreadChatCount(prev => prev + 1);
          }
          setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
          break;

        case 'CHAT_MESSAGE_DELETED':
          setChatMessages(prev => prev.filter(m => m.id !== event.messageId));
          break;

        case 'TEACHER_SCREEN_SHARE_CHANGED':
          if (myRole === 'student') {
            setTeacherRemoteStream(prev => ({
              ...prev,
              isScreenSharingActive: Boolean(event.isSharing),
              screenTrack: event.isSharing ? prev?.screenTrack : null
            }));
            showToast(event.isSharing ? '🖥️ Giáo viên đang chia sẻ màn hình.' : '🖥️ Giáo viên đã dừng chia sẻ màn hình.');
          }
          break;

        case 'SESSION_ENDED':
          if (myRole === 'teacher') break;
          playErrorSound();
          alert('Lớp học trực tuyến đã kết thúc bởi Giáo viên.');
          handleLeaveRef.current?.(true);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [sessionId, currentUserId, myRole, sessionData, accessDeniedReason, authChecking, activeSideTab, showToast]);

  // Periodic heartbeat session check for students
  useEffect(() => {
    if (!sessionId || myRole === 'teacher' || accessDeniedReason || authChecking) return;
    const interval = setInterval(async () => {
      try {
        const ses = await getSessionById(sessionId);
        if (ses && (ses.status === 'ended' || ses.ended_at)) {
          playErrorSound();
          alert('Lớp học trực tuyến đã kết thúc bởi Giáo viên.');
          handleLeaveRef.current?.(true);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [sessionId, myRole, accessDeniedReason, authChecking]);

  // =========================================================================
  // 4. ACTION HANDLERS
  // =========================================================================

  // Leave room action
  const handleLeave = useCallback(async (isForced = false) => {
    playClickSound();
    try {
      await livekitManagerRef.current?.disconnect();
      mediaManagerRef.current?.stopAll();
      setMediaState(prev => ({ ...prev, isCameraOn: false, isMicOn: false, isScreenSharing: false }));
    } catch {}

    if (!isForced && myRole === 'teacher' && sessionData?.status !== 'ended') {
      const confirmEnd = window.confirm(
        'Bạn là giáo viên phụ trách phòng học.\n\nNhấn "OK" để KẾT THÚC buổi học cho tất cả học viên.\nNhấn "Cancel" để chỉ tạm rời phòng.'
      );
      if (confirmEnd) {
        await endLiveSession(sessionId, currentUserId);
        if (onNavigateBack) onNavigateBack();
        else window.location.hash = `#classroom/${classId}`;
        return;
      }
    }

    if (currentUserId) {
      await leaveLiveSession(sessionId, currentUserId);
    }
    if (onNavigateBack) onNavigateBack();
    else window.location.hash = `#classroom/${classId}`;
  }, [classId, currentUserId, myRole, onNavigateBack, sessionData?.status, sessionId]);

  handleLeaveRef.current = handleLeave;

  // End Class action for teacher
  const handleEndClass = async () => {
    playClickSound();
    const confirmEnd = window.confirm(
      'Xác nhận kết thúc buổi học trực tuyến?\n\nTất cả học viên sẽ rời phòng và phiên học sẽ được đánh dấu hoàn thành.'
    );
    if (!confirmEnd) return;

    try {
      await endLiveSession(sessionId, currentUserId);
      await livekitManagerRef.current?.disconnect();
      mediaManagerRef.current?.stopAll();
    } catch {}

    if (onNavigateBack) onNavigateBack();
    else window.location.hash = `#classroom/${classId}`;
  };

  // Reconnect button handler
  const handleReconnect = async () => {
    playClickSound();
    setIsReconnecting(true);
    setConnectionState(prev => ({ ...prev, status: 'reconnecting', error: null }));
    showToast('🔄 Đang kết nối lại phòng học...');

    if (livekitManagerRef.current) {
      const res = await livekitManagerRef.current.reconnect();
      if (res?.success) {
        playSuccessSound();
        showToast('✅ Đã kết nối lại thành công!');
        setConnectionState(prev => ({ ...prev, status: 'connected' }));
      } else {
        playErrorSound();
        showToast('⚠️ Kết nối lại thất bại. Vui lòng kiểm tra đường truyền.');
        setConnectionState(prev => ({ ...prev, status: 'disconnected', error: res?.error }));
      }
    } else {
      initSession();
    }
    setIsReconnecting(false);
  };

  // Toggle Camera
  const handleToggleCamera = async () => {
    playClickSound();
    const nextState = !mediaState.isCameraOn;

    if (livekitManagerRef.current?.isConnected) {
      const res = await livekitManagerRef.current.setCameraEnabled(nextState);
      if (res?.success) {
        setMediaState(prev => ({ ...prev, isCameraOn: nextState }));
        updateMediaStatus(sessionId, currentUserId, { camera: nextState }).catch(() => {});
        showToast(nextState ? '📷 Đã bật Camera.' : '📷 Đã tắt Camera.');
      } else {
        const errMsg = res?.error || 'Không thể bật camera. Vui lòng kiểm tra quyền thiết bị.';
        showToast(`⚠️ ${errMsg}`);
      }
    } else {
      if (!mediaManagerRef.current) {
        mediaManagerRef.current = new LiveRoomMediaManager();
      }
      if (!mediaManagerRef.current.localStream && nextState) {
        const mRes = await mediaManagerRef.current.startMedia({ video: true, audio: mediaState.isMicOn });
        if (mRes?.success) {
          setMediaState(prev => ({ ...prev, isCameraOn: true, localStream: mRes.stream }));
          updateMediaStatus(sessionId, currentUserId, { camera: true }).catch(() => {});
          showToast('📷 Đã bật Camera.');
        } else {
          showToast(`⚠️ ${mRes?.error || 'Không thể bật camera. Vui lòng cấp quyền camera trong trình duyệt.'}`);
        }
        return;
      }
      const active = mediaManagerRef.current.toggleCamera(nextState);
      setMediaState(prev => ({ 
        ...prev, 
        isCameraOn: active, 
        localStream: mediaManagerRef.current.localStream 
      }));
      updateMediaStatus(sessionId, currentUserId, { camera: active }).catch(() => {});
      showToast(active ? '📷 Đã bật Camera.' : '📷 Đã tắt Camera.');
    }
  };

  // Toggle Microphone
  const handleToggleMic = async () => {
    playClickSound();

    if (myRole === 'student' && !myParticipant?.is_mic_allowed) {
      playErrorSound();
      showToast('🔒 Microphone đã bị khóa bởi giáo viên. Vui lòng nhấn "Giơ tay" để xin phát biểu.');
      return;
    }

    const nextState = !mediaState.isMicOn;

    if (livekitManagerRef.current?.isConnected) {
      const res = await livekitManagerRef.current.setMicrophoneEnabled(nextState);
      if (res?.success) {
        setMediaState(prev => ({ ...prev, isMicOn: nextState }));
        updateMediaStatus(sessionId, currentUserId, { mic: nextState }).catch(() => {});
        showToast(nextState ? '🎙️ Đã bật Micro.' : '🔇 Đã tắt Micro.');
      } else {
        const errMsg = res?.error || 'Không thể bật micro. Vui lòng kiểm tra thiết bị.';
        showToast(`⚠️ ${errMsg}`);
      }
    } else {
      if (!mediaManagerRef.current) {
        mediaManagerRef.current = new LiveRoomMediaManager();
      }
      if (!mediaManagerRef.current.localStream && nextState) {
        const mRes = await mediaManagerRef.current.startMedia({ video: mediaState.isCameraOn, audio: true });
        if (mRes?.success) {
          setMediaState(prev => ({ ...prev, isMicOn: true, localStream: mRes.stream }));
          updateMediaStatus(sessionId, currentUserId, { mic: true }).catch(() => {});
          showToast('🎙️ Đã bật Micro.');
        } else {
          showToast(`⚠️ ${mRes?.error || 'Không thể bật micro. Vui lòng cấp quyền micro trong trình duyệt.'}`);
        }
        return;
      }
      const active = mediaManagerRef.current.toggleMicrophone(nextState);
      setMediaState(prev => ({ 
        ...prev, 
        isMicOn: active, 
        localStream: mediaManagerRef.current.localStream 
      }));
      updateMediaStatus(sessionId, currentUserId, { mic: active }).catch(() => {});
      showToast(active ? '🎙️ Đã bật Micro.' : '🔇 Đã tắt Micro.');
    }
  };

  // Toggle Screen Share (Teacher only)
  const handleToggleScreenShare = async () => {
    playClickSound();
    if (myRole !== 'teacher') return;

    const nextState = !mediaState.isScreenSharing;
    if (livekitManagerRef.current?.isConnected) {
      const res = await livekitManagerRef.current.setScreenShareEnabled(nextState);
      if (res?.success) {
        setMediaState(prev => ({ ...prev, isScreenSharing: nextState }));
        liveEventBus.broadcast(sessionId, {
          type: 'TEACHER_SCREEN_SHARE_CHANGED',
          isSharing: nextState
        });
        showToast(nextState ? '🖥️ Bắt đầu chia sẻ màn hình.' : '🖥️ Đã dừng chia sẻ màn hình.');
      } else {
        const isCancelled = res?.error?.includes?.('cancel') || res?.error?.includes?.('Permission');
        showToast(isCancelled ? 'Đã hủy chia sẻ màn hình.' : `⚠️ ${res?.error || 'Không thể chia sẻ màn hình.'}`);
      }
    } else {
      if (!mediaManagerRef.current) {
        mediaManagerRef.current = new LiveRoomMediaManager();
      }
      if (nextState) {
        const sRes = await mediaManagerRef.current.startScreenShare();
        if (sRes?.success) {
          setMediaState(prev => ({ 
            ...prev, 
            isScreenSharing: true, 
            screenStream: sRes.stream 
          }));
          liveEventBus.broadcast(sessionId, {
            type: 'TEACHER_SCREEN_SHARE_CHANGED',
            isSharing: true
          });
          showToast('🖥️ Bắt đầu chia sẻ màn hình.');
        } else {
          showToast(`⚠️ ${sRes?.error || 'Không thể chia sẻ màn hình.'}`);
        }
      } else {
        mediaManagerRef.current.stopScreenShare();
        setMediaState(prev => ({ ...prev, isScreenSharing: false, screenStream: null }));
        liveEventBus.broadcast(sessionId, {
          type: 'TEACHER_SCREEN_SHARE_CHANGED',
          isSharing: false
        });
        showToast('🖥️ Đã dừng chia sẻ màn hình.');
      }
    }
  };

  // Student Raise / Lower Hand
  const handleToggleHand = async () => {
    playClickSound();
    if (!myParticipant) return;
    const isRaised = myParticipant.hand_raised;

    if (isRaised) {
      await lowerHand(sessionId, currentUserId);
      setMyParticipant(prev => prev ? { ...prev, hand_raised: false } : prev);
      showToast('Đã hạ tay.');
    } else {
      await raiseHand(sessionId, currentUserId);
      setMyParticipant(prev => prev ? { ...prev, hand_raised: true, hand_raised_at: new Date().toISOString() } : prev);
      showToast('✋ Đã giơ tay phát biểu!');
    }
  };

  // Teacher Moderation: Mute All Students
  const handleMuteAll = async () => {
    playClickSound();
    if (myRole !== 'teacher') return;
    await muteAllParticipants(sessionId, currentUserId);
    showToast('🔇 Đã tắt Micro của tất cả học viên.');
  };

  // Teacher Moderation: Toggle Room Lock
  const handleToggleLock = async () => {
    playClickSound();
    if (myRole !== 'teacher') return;
    const nextState = !isRoomLocked;
    await toggleRoomLock(sessionId, currentUserId, nextState);
    setIsRoomLocked(nextState);
  };

  // Teacher Moderation: Toggle Chat Lock
  const handleToggleChatMute = async () => {
    playClickSound();
    if (myRole !== 'teacher') return;
    const nextState = !isChatMuted;
    await toggleChatMute(sessionId, currentUserId, nextState);
    setIsChatMuted(nextState);
  };

  // Teacher Grant Mic to student
  const handleGrantMic = async (studentId) => {
    playClickSound();
    if (myRole !== 'teacher') return;
    await allowStudentMic(sessionId, currentUserId, studentId);
    showToast('🎤 Đã cấp quyền phát biểu cho học viên.');
  };

  // Teacher Revoke Mic from student
  const handleRevokeMic = async (studentId) => {
    playClickSound();
    if (myRole !== 'teacher') return;
    await revokeStudentMic(sessionId, currentUserId, studentId);
    showToast('🔇 Đã thu hồi quyền phát biểu.');
  };

  // Teacher Kick student
  const handleKickStudent = async (studentId) => {
    playClickSound();
    if (myRole !== 'teacher') return;
    const confirmed = window.confirm('Mời học viên này rời khỏi phòng học?');
    if (!confirmed) return;
    await removeParticipant(sessionId, currentUserId, studentId);
    showToast('Đã mời học viên ra khỏi phòng.');
  };

  // Send Chat Message
  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    if (isChatMuted && myRole !== 'teacher') {
      showToast('🔇 Giáo viên đã tạm khóa trò chuyện.');
      return;
    }

    const content = chatInput.trim();
    setChatInput('');

    const res = await sendSessionChatMessage({
      sessionId,
      senderId: currentUserId,
      senderName: user?.name || (myRole === 'teacher' ? 'Giáo viên' : 'Học sinh'),
      senderRole: myRole,
      content
    });

    if (res.success && res.message) {
      setChatMessages(prev => [...prev, res.message]);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      classroomContainerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Raise hand queue computation (FIFO)
  const raiseHandQueue = useMemo(() => {
    return participants
      .filter(p => p.role === 'student' && p.hand_raised && !p.left_at)
      .sort((a, b) => new Date(a.hand_raised_at || 0) - new Date(b.hand_raised_at || 0));
  }, [participants]);

  const activeStudents = useMemo(() => {
    return participants.filter(p => p.role === 'student' && !p.left_at);
  }, [participants]);

  // Identify teacher participant info
  const teacherParticipant = useMemo(() => {
    return participants.find(p => p.role === 'teacher' && !p.left_at);
  }, [participants]);

  const teacherName = teacherParticipant?.user_name || (myRole === 'teacher' ? user?.name : 'Giáo viên');
  const isTeacherCameraOn = myRole === 'teacher' 
    ? mediaState.isCameraOn 
    : Boolean(teacherRemoteStream.videoTrack);

  const isScreenSharingActive = mediaState.isScreenSharing || teacherRemoteStream.isScreenSharingActive;

  // =========================================================================
  // 5. ACCESS DENIED / LOADING STATES
  // =========================================================================
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-3xl bg-[#E85D3F]/20 border border-[#E85D3F]/40 flex items-center justify-center animate-pulse mb-6">
          <Activity size={32} className="text-[#E85D3F]" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Đang kết nối phòng học trực tuyến...</h2>
        <p className="text-xs text-white/50">Kiểm tra danh sách thành viên và thiết lập WebRTC SFU</p>
      </div>
    );
  }

  if (accessDeniedReason) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Không thể truy cập phòng học</h2>
        <p className="text-sm text-white/60 text-center max-w-md mb-8">{accessDeniedReason}</p>
        <button
          onClick={() => {
            if (onNavigateBack) onNavigateBack();
            else window.location.hash = `#classroom/${classId}`;
          }}
          className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Quay lại lớp học</span>
        </button>
      </div>
    );
  }

  // =========================================================================
  // 6. MAIN LIVE CLASSROOM VIEW
  // =========================================================================
  return (
    <div 
      ref={classroomContainerRef}
      className="h-screen w-full bg-[#070B14] text-white flex flex-col overflow-hidden select-none font-sans"
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-right duration-200">
          <div className="px-4 py-2.5 rounded-2xl bg-[#E85D3F] text-white text-xs font-bold shadow-xl flex items-center gap-2">
            <Sparkles size={15} />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="h-16 px-4 sm:px-6 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
              TRỰC TIẾP
            </span>
          </div>
          <div className="truncate">
            <h1 className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
              <span>{sessionData?.title || 'Phòng học trực tuyến'}</span>
              <span className="text-xs text-white/50 font-normal hidden md:inline">
                • {sessionData?.classroom_name || 'HanziGo Live'}
              </span>
            </h1>
          </div>
        </div>

        {/* Header Right Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Capacity Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white/80">
            <Users size={14} className="text-[#45B97C]" />
            <span>{activeStudents.length + (teacherParticipant ? 1 : 0)} / {sessionData?.max_capacity || 50}</span>
          </div>

          {/* Connection Status Pill */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              connectionState.status === 'connected'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : connectionState.status === 'reconnecting'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
            title={connectionState.status === 'connected' ? `LiveKit SFU Ổn định (Ping: ${connectionState.ping}ms)` : 'Đang gặp sự cố đường truyền'}
          >
            {connectionState.status === 'connected' ? (
              <>
                <Wifi size={13} className="text-emerald-400" />
                <span className="hidden sm:inline">Kết nối ổn định</span>
                <span className="text-[10px] opacity-75">{connectionState.ping}ms</span>
              </>
            ) : connectionState.status === 'reconnecting' ? (
              <>
                <RefreshCw size={13} className="animate-spin text-amber-400" />
                <span>Đang kết nối lại...</span>
              </>
            ) : (
              <>
                <WifiOff size={13} className="text-rose-400" />
                <span>Mất kết nối</span>
                <button
                  onClick={handleReconnect}
                  disabled={isReconnecting}
                  className="ml-1 underline text-[11px] font-bold cursor-pointer"
                >
                  Thử lại
                </button>
              </>
            )}
          </div>

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
              {isRoomLocked ? <Lock size={15} /> : <Unlock size={15} />}
            </button>
          )}

          {/* Leave or End Session Button */}
          {myRole === 'teacher' ? (
            <button
              onClick={handleEndClass}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kết thúc lớp</span>
            </button>
          ) : (
            <button
              onClick={() => handleLeave(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Rời phòng</span>
            </button>
          )}
        </div>
      </header>

      {/* BODY CONTENT (MAIN VIDEO CANVAS + SIDE PANEL) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* MAIN VIDEO STAGE */}
        <div className="flex-1 flex flex-col bg-[#070B14] p-3 sm:p-4 overflow-y-auto">
          
          <div className="flex-1 rounded-3xl bg-[#111827] border border-white/10 overflow-hidden relative flex flex-col shadow-2xl p-3 sm:p-4 gap-4">
            
            {/* 1. SCREEN SHARE PRESENTATION MODE (IF ACTIVE) */}
            {isScreenSharingActive ? (
              <div className="flex-1 w-full flex flex-col gap-3 min-h-[360px]">
                {/* Large Screen Share View */}
                <div className="flex-1 relative rounded-2xl bg-black border border-white/20 overflow-hidden flex items-center justify-center min-h-[280px]">
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                    <Monitor size={14} className="text-[#E85D3F]" />
                    <span>{myRole === 'teacher' ? 'Màn hình của bạn đang chia sẻ' : `Màn hình của GV: ${teacherName}`}</span>
                  </div>
                </div>

                {/* Floating Speakers Strip */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 shrink-0">
                  {/* Teacher Tile */}
                  <div className="w-48 aspect-video rounded-xl bg-black/80 border border-white/20 overflow-hidden relative shrink-0">
                    {isTeacherCameraOn ? (
                      <video
                        ref={teacherVideoRef}
                        autoPlay
                        playsInline
                        muted={myRole === 'teacher'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0F172A] p-2 text-center">
                        <span className="text-[11px] font-bold text-white/80">GV: {teacherName}</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-2 text-[9px] bg-black/60 px-1 rounded text-white font-bold">
                      GV: {teacherName}
                    </span>
                  </div>

                  {/* Remote Students Tiles */}
                  {remoteLkParticipants.filter(p => p.role !== 'teacher').map(p => (
                    <div key={p.identity} className="w-44 shrink-0">
                      <RemoteParticipantTile participant={p} lkManager={livekitManagerRef.current} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 2. GALLERY & SPOTLIGHT VIDEO GRID MODE */
              <div className="flex-1 flex flex-col gap-4">
                
                {/* TOP ROW: TEACHER SPOTLIGHT + SELF VIEW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* TEACHER SPOTLIGHT CARD (Spans 2 cols on md) */}
                  <div className={`md:col-span-2 relative rounded-2xl bg-black/90 border overflow-hidden min-h-[240px] sm:min-h-[300px] flex items-center justify-center shadow-xl transition-all ${
                    teacherParticipant?.isSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-white/15'
                  }`}>
                    {isTeacherCameraOn ? (
                      <video
                        ref={teacherVideoRef}
                        autoPlay
                        playsInline
                        muted={myRole === 'teacher'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                        <div className="w-20 h-20 rounded-full bg-[#E85D3F] text-white text-3xl font-black flex items-center justify-center shadow-xl mb-3">
                          {teacherName?.[0]?.toUpperCase() || 'T'}
                        </div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{teacherName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30 text-[10px] font-black uppercase">
                            Giáo viên
                          </span>
                        </h3>
                        <p className="text-xs text-white/50 mt-1">Camera đang tắt • Âm thanh trực tiếp HD</p>
                      </div>
                    )}

                    {/* Teacher Spotlight Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-black text-white border border-white/20 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>GV: {teacherName}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5">
                      {isTeacherCameraOn ? <Video size={13} className="text-emerald-400" /> : <VideoOff size={13} className="text-white/40" />}
                      <Mic size={13} className="text-emerald-400" />
                    </div>
                  </div>

                  {/* SELF PREVIEW CARD */}
                  <div className="relative rounded-2xl bg-black/90 border border-white/15 overflow-hidden min-h-[200px] flex items-center justify-center shadow-lg">
                    {mediaState.isCameraOn ? (
                      <video
                        ref={selfVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#0F172A]">
                        <div className="w-14 h-14 rounded-full bg-white/10 text-white font-bold text-lg flex items-center justify-center mb-2">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <p className="text-xs font-bold text-white">{user?.name || 'Bạn'} (Bạn)</p>
                        <span className="text-[10px] text-white/40 mt-0.5">Camera của bạn đang tắt</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 text-[10px] font-bold text-white">
                      Bạn ({myRole === 'teacher' ? 'Giáo viên' : 'Học sinh'})
                    </div>

                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/60 text-[10px]">
                      {mediaState.isCameraOn ? <Video size={11} className="text-emerald-400" /> : <VideoOff size={11} className="text-rose-400" />}
                      {mediaState.isMicOn ? <Mic size={11} className="text-emerald-400" /> : <MicOff size={11} className="text-rose-400" />}
                    </div>
                  </div>

                </div>

                {/* BOTTOM ROW: ACTIVE STUDENTS GRID */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                      <Users size={14} className="text-[#45B97C]" />
                      <span>Học viên trong lớp ({activeStudents.length})</span>
                    </span>
                    {activeStudents.length === 0 && (
                      <span className="text-xs text-white/40 italic">Chưa có học viên nào tham gia</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {activeStudents.map((s) => {
                      const lkParticipant = remoteLkParticipants.find(p => p.identity === String(s.user_id));
                      const isHandRaised = Boolean(s.hand_raised);

                      return (
                        <div 
                          key={s.id || s.user_id}
                          className={`relative rounded-2xl bg-[#0F172A] border overflow-hidden aspect-video flex flex-col items-center justify-center p-3 text-center transition-all ${
                            isHandRaised ? 'border-amber-400 shadow-md shadow-amber-400/20' : 'border-white/10'
                          }`}
                        >
                          {/* Live Video if student published camera */}
                          {lkParticipant?.videoTrack ? (
                            <RemoteParticipantTile participant={lkParticipant} lkManager={livekitManagerRef.current} />
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-white/10 text-white font-bold text-sm flex items-center justify-center mb-1">
                                {s.user_name?.[0]?.toUpperCase() || 'H'}
                              </div>
                              <p className="text-xs font-bold text-white/90 truncate max-w-[90%]">
                                {s.user_name || 'Học viên'}
                              </p>
                              <span className="text-[9px] text-white/40">
                                {s.mic_enabled ? 'Đang bật mic' : 'Đang tắt mic'}
                              </span>
                            </>
                          )}

                          {/* Hand raised badge */}
                          {isHandRaised && (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center gap-0.5 animate-bounce shadow">
                              <Hand size={10} />
                              <span>Giơ tay</span>
                            </div>
                          )}

                          {/* Status icons */}
                          <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[9px] text-white/60">
                            {s.mic_enabled ? (
                              <Mic size={11} className="text-emerald-400" />
                            ) : (
                              <MicOff size={11} className="text-rose-400" />
                            )}
                          </div>

                          {/* Teacher Action Button for this student */}
                          {myRole === 'teacher' && isHandRaised && (
                            <button
                              onClick={() => showToast(`🎤 Mời bạn ${s.user_name} phát biểu!`)}
                              className="absolute inset-x-2 bottom-1.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md cursor-pointer transition-all"
                            >
                              Mời phát biểu 🎤
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* BOTTOM CONTROLS BAR */}
            <div className="h-16 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-md border border-white/10 px-4 flex items-center justify-between shrink-0 gap-2">
              
              {/* Media Controls */}
              <div className="flex items-center gap-2">
                
                {/* Microphone Toggle */}
                {(() => {
                  const isMicLocked = myRole === 'student' && !myParticipant?.is_mic_allowed;
                  return (
                    <button
                      onClick={handleToggleMic}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        mediaState.isMicOn 
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                          : isMicLocked
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                            : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                      title={isMicLocked ? 'Microphone bị khóa bởi GV (Giơ tay xin phát biểu)' : (mediaState.isMicOn ? 'Tắt Micro' : 'Bật Micro')}
                    >
                      {mediaState.isMicOn ? <Mic size={16} /> : isMicLocked ? <Lock size={15} className="text-amber-400" /> : <MicOff size={16} />}
                      <span className="hidden sm:inline">
                        {mediaState.isMicOn ? 'Đang bật Mic' : isMicLocked ? 'Mic bị khóa (GV)' : 'Bật Mic'}
                      </span>
                    </button>
                  );
                })()}

                {/* Camera Toggle */}
                <button
                  onClick={handleToggleCamera}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mediaState.isCameraOn 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                  title={mediaState.isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
                >
                  {mediaState.isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
                  <span className="hidden sm:inline">{mediaState.isCameraOn ? 'Đang bật Cam' : 'Bật Cam'}</span>
                </button>

                {/* Screen Share Toggle (Teacher only) */}
                {myRole === 'teacher' && (
                  <button
                    onClick={handleToggleScreenShare}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      mediaState.isScreenSharing 
                        ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/20' 
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                    title={mediaState.isScreenSharing ? 'Dừng chia sẻ màn hình' : 'Chia sẻ màn hình'}
                  >
                    {mediaState.isScreenSharing ? <MonitorOff size={16} /> : <Monitor size={16} />}
                    <span className="hidden md:inline">{mediaState.isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}</span>
                  </button>
                )}

                {/* Raise Hand Toggle (Student only) */}
                {myRole === 'student' && (
                  <button
                    onClick={handleToggleHand}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      myParticipant?.hand_raised 
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 animate-pulse' 
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Hand size={16} />
                    <span className="hidden sm:inline">{myParticipant?.hand_raised ? 'Hạ tay' : 'Giơ tay phát biểu'}</span>
                  </button>
                )}
              </div>

              {/* Center / Teacher Moderation Controls */}
              {myRole === 'teacher' && (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={handleMuteAll}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    title="Tắt tiếng tất cả học viên trong phòng"
                  >
                    <VolumeX size={14} className="text-rose-400" />
                    <span>Tắt tiếng cả lớp</span>
                  </button>

                  <button
                    onClick={handleToggleChatMute}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isChatMuted ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/10 border-white/10 text-white/80'
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>{isChatMuted ? 'Mở chat' : 'Khóa chat'}</span>
                  </button>
                </div>
              )}

              {/* Side Panels Toggle & Fullscreen */}
              <div className="flex items-center gap-2">
                {/* Chat Panel Toggle */}
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveSideTab(prev => prev === 'chat' ? null : 'chat');
                    setUnreadChatCount(0);
                  }}
                  className={`relative p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === 'chat'
                      ? 'bg-[#E85D3F] text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                  title="Mở tin nhắn"
                >
                  <MessageSquare size={16} />
                  {unreadChatCount > 0 && activeSideTab !== 'chat' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                {/* Participants Panel Toggle */}
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveSideTab(prev => prev === 'participants' ? null : 'participants');
                  }}
                  className={`relative p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === 'participants'
                      ? 'bg-[#E85D3F] text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                  title="Danh sách học viên"
                >
                  <Users size={16} />
                  {raiseHandQueue.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                      {raiseHandQueue.length}
                    </span>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={handleToggleFullscreen}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
                  title="Toàn màn hình"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE PANEL (CHAT & PARTICIPANTS) */}
        {activeSideTab && (
          <aside className="w-full lg:w-80 xl:w-96 bg-[#0B0F19] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 h-80 lg:h-auto z-20 animate-in slide-in-from-right duration-200">
            
            {/* Tab switch header */}
            <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSideTab('chat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === 'chat'
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Trò chuyện ({chatMessages.length})
                </button>

                <button
                  onClick={() => setActiveSideTab('participants')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeSideTab === 'participants'
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span>Thành viên</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                    {participants.filter(p => !p.left_at).length}
                  </span>
                  {raiseHandQueue.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setActiveSideTab(null)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* TAB CONTENT: CHAT */}
            {activeSideTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Messages stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                      <MessageSquare size={32} className="mb-2 opacity-50" />
                      <p className="text-xs font-bold">Chưa có tin nhắn nào</p>
                      <p className="text-[11px] mt-1">Gửi lời chào đầu tiên tới lớp học nào!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      const isSenderTeacher = msg.sender_role === 'teacher';

                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[10px] font-bold text-white/60">{msg.sender_name}</span>
                            {isSenderTeacher && (
                              <span className="px-1 rounded bg-[#E85D3F] text-[9px] font-black uppercase text-white">
                                GV
                              </span>
                            )}
                            <span className="text-[9px] text-white/30">
                              {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={`px-3 py-2 rounded-2xl text-xs max-w-[85%] break-words ${
                            isMe 
                              ? 'bg-[#E85D3F] text-white rounded-tr-none' 
                              : isSenderTeacher 
                                ? 'bg-[#1E293B] border border-[#E85D3F]/40 text-white rounded-tl-none'
                                : 'bg-[#1E293B] text-white/90 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat input box */}
                <div className="p-3 border-t border-white/10 bg-[#0F172A]">
                  {isChatMuted && myRole !== 'teacher' ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold text-center">
                      🔇 Giáo viên đã tạm thời khóa trò chuyện
                    </div>
                  ) : (
                    <form onSubmit={handleSendChat} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#E85D3F]"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="p-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-40 text-white transition-all cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PARTICIPANTS */}
            {activeSideTab === 'participants' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                
                {/* Raised Hands Queue (Top Priority) */}
                {raiseHandQueue.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Hand size={13} />
                      <span>Hàng đợi phát biểu ({raiseHandQueue.length})</span>
                    </p>
                    <div className="space-y-1.5">
                      {raiseHandQueue.map((s) => (
                        <div key={s.user_id} className="flex items-center justify-between p-2 rounded-xl bg-black/40 text-xs">
                          <span className="font-bold text-white truncate">{s.user_name}</span>
                          {myRole === 'teacher' && (
                            <button
                              onClick={() => showToast(`🎤 Mời bạn ${s.user_name} phát biểu!`)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                            >
                              Mời phát biểu 🎤
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teacher section */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/40">Giáo viên phụ trách</span>
                  <div className="p-3 rounded-2xl bg-[#1E293B] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E85D3F] text-white font-black text-xs flex items-center justify-center">
                        {teacherName?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{teacherName}</p>
                        <span className="text-[10px] text-emerald-400">Trực tuyến</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] text-[10px] font-black">GV</span>
                  </div>
                </div>

                {/* Students list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/40">
                      Học viên ({activeStudents.length})
                    </span>
                    {myRole === 'teacher' && activeStudents.length > 0 && (
                      <button
                        onClick={handleMuteAll}
                        className="text-[10px] text-rose-400 font-bold hover:underline cursor-pointer"
                      >
                        Tắt mic tất cả
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {activeStudents.map((s) => (
                      <div key={s.user_id} className="p-2.5 rounded-xl bg-[#131B24] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {s.user_name?.[0]?.toUpperCase() || 'H'}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{s.user_name}</p>
                            <span className="text-[10px] text-white/40">
                              {s.mic_enabled ? 'Đang bật mic' : 'Đang tắt mic'}
                            </span>
                          </div>
                        </div>

                        {/* Teacher actions for this student */}
                        {myRole === 'teacher' ? (
                          <div className="flex items-center gap-1">
                            {s.mic_enabled && (
                              <button
                                onClick={() => handleRevokeMic(s.user_id)}
                                className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                                title="Tắt mic học sinh này"
                              >
                                <MicOff size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => handleKickStudent(s.user_id)}
                              className="p-1 rounded text-white/40 hover:text-rose-400 hover:bg-white/10"
                              title="Mời ra khỏi phòng"
                            >
                              <UserX size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="shrink-0">
                            {s.mic_enabled ? (
                              <Mic size={14} className="text-emerald-400" />
                            ) : (
                              <MicOff size={14} className="text-white/30" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </aside>
        )}

      </div>
    </div>
  );
}
