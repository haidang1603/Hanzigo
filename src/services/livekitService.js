/**
 * =========================================================================
 * HANZI GO - LIVEKIT WEBRTC SFU SERVICE
 * =========================================================================
 * Real-time audio, video, and screen-sharing engine powered by LiveKit SFU.
 * - Sub-second latency for teacher broadcasting (1 teacher + 50 students).
 * - Automatic track subscription & video element mounting.
 * - Dual-layer Token Resolution: Serverless API with client-side fallback via jose.
 * - Hardware collision avoidance on Windows / multi-device.
 */

import { Room, RoomEvent, Track, VideoPresets } from 'livekit-client';
import { supabase, isSupabaseConfigured } from '../supabase/config.js';

function getEnv(key) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process?.env?.[key]) {
      return process.env[key];
    }
  } catch {}
  return '';
}

/**
 * Authoritative Serverless Token Fetcher
 * Strictly queries /api/webrtc/livekit-token with verified authentication.
 * No client secrets, no client-side forging of tokens.
 */
export async function fetchLiveKitToken({ sessionId, user, role = 'student' }) {
  const serverUrl = getEnv('VITE_LIVEKIT_URL') || getEnv('LIVEKIT_URL') || '';
  const isEnvConfigured = Boolean(serverUrl);

  try {
    const userId = user?.uid || user?.id || `user-${Date.now()}`;
    const userName = user?.name || user?.email || (role === 'teacher' ? 'Giáo viên' : 'Học sinh');

    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': String(userId)
    };

    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else if (isSupabaseConfigured && supabase?.auth) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) {
          headers['Authorization'] = `Bearer ${data.session.access_token}`;
        }
      } catch {}
    }

    let response;
    try {
      response = await fetch('/api/webrtc/livekit-token', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roomName: String(sessionId),
          userId: String(userId),
          userName: String(userName)
        })
      });
    } catch (fetchErr) {
      if (typeof window === 'undefined') {
        const livekitTokenHandler = (await import('../../api/_webrtc/livekit-token.js')).default;
        let statusCode = 200;
        let jsonData = null;
        const mockReq = {
          method: 'POST',
          headers,
          body: {
            roomName: String(sessionId),
            userId: String(userId),
            userName: String(userName)
          }
        };
        const mockRes = {
          status(code) { statusCode = code; return this; },
          json(data) { jsonData = data; return this; }
        };
        await livekitTokenHandler(mockReq, mockRes);
        if (statusCode === 200 && jsonData?.token) {
          return {
            success: true,
            token: jsonData.token,
            serverUrl: jsonData.serverUrl || serverUrl,
            isConfigured: Boolean(jsonData.isConfigured || isEnvConfigured)
          };
        } else {
          return {
            success: false,
            error: jsonData?.error || `Lỗi handler (${statusCode})`
          };
        }
      }
      throw fetchErr;
    }

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        return {
          success: true,
          token: data.token,
          serverUrl: data.serverUrl || serverUrl,
          isConfigured: Boolean(data.isConfigured || isEnvConfigured)
        };
      }
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `Lỗi máy chủ LiveKit (${response.status})`
      };
    }
  } catch (err) {
    console.warn('[LiveKit] Backend token endpoint unavailable:', err.message);
    return {
      success: false,
      error: 'Không thể kết nối đến máy chủ LiveKit Token: ' + err.message
    };
  }

  return {
    success: false,
    error: 'Không thể kết nối LiveKit (Chưa nhận được token hợp lệ).'
  };
}

/**
 * HanziGo LiveKit Classroom Manager
 */
export class LiveKitClassroomManager {
  constructor() {
    this.room = null;
    this.isConnected = false;
    this.isReconnecting = false;
    this.isConfigured = false;
    this.role = 'student';
    this.userId = null;
    this.sessionId = null;
    this.lastConnectOptions = null;

    // Remote Teacher Tracks
    this.teacherVideoTrack = null;
    this.teacherAudioTrack = null;
    this.teacherScreenTrack = null;
    this.teacherParticipant = null;

    // Map of remote participants: identity -> { identity, name, role, isSpeaking, videoTrack, audioTrack, screenTrack, connectionQuality }
    this.remoteParticipantsMap = new Map();

    // Local Tracks
    this.localVideoTrack = null;
    this.localAudioTrack = null;
    this.localScreenTrack = null;

    // Callbacks
    this.onTeacherStreamChange = null;
    this.onConnectionChange = null;
    this.onError = null;
    this.onRemoteParticipantsChange = null;
    this.onLocalStreamChange = null;

    // Track attached audio elements owned by this service instance
    this.attachedAudioElements = new Set();
  }

  /**
   * Connect to the LiveKit classroom room
   */
  async connect({ sessionId, user, role = 'student', teacherId = null }) {
    this.role = role;
    this.sessionId = sessionId;
    this.userId = user?.uid || user?.id;
    this.teacherId = teacherId;
    this.lastConnectOptions = { sessionId, user, role, teacherId };

    // 1. Fetch token
    const tokenResult = await fetchLiveKitToken({ sessionId, user, role });
    if (!tokenResult.success) {
      console.warn('[LiveKit] Không lấy được token:', tokenResult.error);
      return { success: false, error: tokenResult.error };
    }

    const { token, serverUrl, isConfigured } = tokenResult;
    this.isConfigured = isConfigured;

    if (!serverUrl || !isConfigured) {
      console.info('[LiveKit] VITE_LIVEKIT_URL chưa cấu hình. Hệ thống sẽ chạy chế độ mô phỏng WebRTC.');
      return {
        success: true,
        isConfigured: false,
        message: 'LiveKit server URL chưa được cấu hình. Sử dụng chế độ avatar/local.'
      };
    }

    try {
      // 2. Initialize Room with optimized latency and adaptive streams
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution
        }
      });
      this.room = room;

      // 3. Register Event Listeners
      this._setupEventListeners(room);

      // 4. Connect to LiveKit server
      await room.connect(serverUrl, token);
      this.isConnected = true;
      this.isReconnecting = false;
      console.info('[LiveKit] Đã kết nối thành công tới phòng:', sessionId, 'State:', room.state);

      // Handle browser audio autoplay restriction
      if (!room.canPlaybackAudio) {
        console.info('[LiveKit] Đang chờ cử chỉ người dùng để kích hoạt âm thanh phòng học...');
        const unlockAudio = () => {
          room.startAudio().then(() => {
            console.info('[LiveKit] Đã mở khóa âm thanh phòng học thành công.');
          }).catch(() => {});
        };
        window.addEventListener('click', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
      }

      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: true, isReconnecting: false, state: room.state });
      }

      // Scan existing participants in room
      this._scanParticipants(room);

      return { success: true, isConfigured: true, room };
    } catch (err) {
      console.error('[LiveKit] Lỗi kết nối LiveKit Room:', err);
      this.isConnected = false;
      if (this.onError) this.onError(err.message);
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: false, isReconnecting: false, state: 'error', error: err.message });
      }
      return { success: false, error: err.message };
    }
  }

  /**
   * Reconnect to room using saved session credentials
   */
  async reconnect() {
    if (!this.lastConnectOptions) return { success: false, error: 'Chưa có thông tin phiên trước đó' };
    console.info('[LiveKit] Đang thử kết nối lại phòng...');
    if (this.onConnectionChange) {
      this.onConnectionChange({ isConnected: false, isReconnecting: true, state: 'reconnecting' });
    }
    await this.disconnect();
    return this.connect(this.lastConnectOptions);
  }

  _setupEventListeners(room) {
    // When a remote track is published & subscribed
    room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      this._handleTrackSubscribed(track, publication, participant);
    });

    // When a remote track is unsubscribed
    room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      this._handleTrackUnsubscribed(track, publication, participant);
    });

    // Audio playback status changed
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (!room.canPlaybackAudio) {
        const unlockAudio = () => {
          room.startAudio().catch(() => {});
        };
        window.addEventListener('click', unlockAudio, { once: true });
      }
    });

    // Participant connected
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      this._updateParticipantInfo(participant);
      this._scanParticipants(room);
    });

    // Participant disconnected
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      this.remoteParticipantsMap.delete(participant.identity);
      if (this.teacherParticipant?.identity === participant.identity) {
        this.teacherVideoTrack = null;
        this.teacherAudioTrack = null;
        this.teacherScreenTrack = null;
        this.teacherParticipant = null;
        this._notifyTeacherStreamChange();
      }
      this._notifyParticipantsUpdate();
    });

    // Active speakers changed (speaking indicators)
    room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const activeIds = new Set((speakers || []).map(s => s.identity));
      this.remoteParticipantsMap.forEach((p, id) => {
        p.isSpeaking = activeIds.has(id);
      });
      this._notifyParticipantsUpdate();
    });

    // Connection quality changed
    room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      if (participant && this.remoteParticipantsMap.has(participant.identity)) {
        this.remoteParticipantsMap.get(participant.identity).connectionQuality = quality;
        this._notifyParticipantsUpdate();
      }
    });

    // Reconnecting to SFU
    room.on(RoomEvent.Reconnecting, () => {
      this.isReconnecting = true;
      this.isConnected = false;
      console.warn('[LiveKit] Mạng dao động, đang kết nối lại...');
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: false, isReconnecting: true, state: 'reconnecting' });
      }
    });

    // Reconnected
    room.on(RoomEvent.Reconnected, () => {
      this.isReconnecting = false;
      this.isConnected = true;
      console.info('[LiveKit] Đã kết nối lại thành công!');
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: true, isReconnecting: false, state: 'connected' });
      }
      this._scanParticipants(room);
    });

    // Disconnected
    room.on(RoomEvent.Disconnected, () => {
      this.isConnected = false;
      this.isReconnecting = false;
      console.info('[LiveKit] Phòng đã ngắt kết nối.');
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: false, isReconnecting: false, state: 'disconnected' });
      }
    });

    // Local track published
    room.on(RoomEvent.LocalTrackPublished, (publication) => {
      if (publication.track?.kind === Track.Kind.Video && publication.source !== Track.Source.ScreenShare) {
        this.localVideoTrack = publication.track;
      } else if (publication.source === Track.Source.ScreenShare) {
        this.localScreenTrack = publication.track;
      } else if (publication.track?.kind === Track.Kind.Audio) {
        this.localAudioTrack = publication.track;
      }
      if (this.onLocalStreamChange) {
        this.onLocalStreamChange({
          videoTrack: this.localVideoTrack,
          audioTrack: this.localAudioTrack,
          screenTrack: this.localScreenTrack
        });
      }
    });

    // Local track unpublished
    room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
      if (publication.track?.kind === Track.Kind.Video && publication.source !== Track.Source.ScreenShare) {
        this.localVideoTrack = null;
      } else if (publication.source === Track.Source.ScreenShare) {
        this.localScreenTrack = null;
      } else if (publication.track?.kind === Track.Kind.Audio) {
        this.localAudioTrack = null;
      }
      if (this.onLocalStreamChange) {
        this.onLocalStreamChange({
          videoTrack: this.localVideoTrack,
          audioTrack: this.localAudioTrack,
          screenTrack: this.localScreenTrack
        });
      }
    });
  }

  _updateParticipantInfo(participant) {
    if (!participant) return;
    let meta = {};
    try { meta = JSON.parse(participant.metadata || '{}'); } catch {}
    const isTeacher = meta.role === 'teacher' || 
                      (this.teacherId && String(participant.identity) === String(this.teacherId)) || 
                      participant.identity.startsWith('teacher') || 
                      participant.identity.includes('teacher');

    const existing = this.remoteParticipantsMap.get(participant.identity) || {};
    this.remoteParticipantsMap.set(participant.identity, {
      ...existing,
      identity: participant.identity,
      name: participant.name || (isTeacher ? 'Giáo viên' : 'Học sinh'),
      role: isTeacher ? 'teacher' : (meta.role || 'student'),
      isSpeaking: participant.isSpeaking || false,
      connectionQuality: participant.connectionQuality || 'good',
      participantRef: participant
    });
  }

  _scanParticipants(room) {
    if (!room) return;
    const participants = Array.from(room.remoteParticipants.values());

    for (const p of participants) {
      this._updateParticipantInfo(p);
      let meta = {};
      try { meta = JSON.parse(p.metadata || '{}'); } catch {}
      const isTeacher = meta.role === 'teacher' || 
                        (this.teacherId && String(p.identity) === String(this.teacherId)) || 
                        p.identity.startsWith('teacher') || 
                        p.identity.includes('teacher');
      if (isTeacher) {
        this.teacherParticipant = p;
      }
      p.trackPublications.forEach(pub => {
        if (pub.track && pub.isSubscribed) {
          this._handleTrackSubscribed(pub.track, pub, p);
        }
      });
    }

    this._notifyParticipantsUpdate();
  }

  _handleTrackSubscribed(track, publication, participant) {
    this._updateParticipantInfo(participant);
    const pInfo = this.remoteParticipantsMap.get(participant.identity);
    const isTeacher = pInfo?.role === 'teacher';

    const isScreenShare = publication?.source === Track.Source.ScreenShare || track?.source === Track.Source.ScreenShare;
    if (isScreenShare) {
      if (pInfo) pInfo.screenTrack = track;
      if (isTeacher) {
        this.teacherScreenTrack = track;
        this.teacherParticipant = participant;
        this._notifyTeacherStreamChange();
      }
    } else if (track.kind === Track.Kind.Video) {
      if (pInfo) pInfo.videoTrack = track;
      if (isTeacher) {
        this.teacherVideoTrack = track;
        this.teacherParticipant = participant;
        this._notifyTeacherStreamChange();
      }
    } else if (track.kind === Track.Kind.Audio) {
      if (pInfo) pInfo.audioTrack = track;
      if (isTeacher) {
        this.teacherAudioTrack = track;
        this.teacherParticipant = participant;
        this._notifyTeacherStreamChange();
      }
      // Auto-play audio safely
      try {
        const el = track.attach();
        el.style.display = 'none';
        el.dataset.livekitParticipant = participant.identity;
        if (this.sessionId) {
          el.dataset.livekitSession = String(this.sessionId);
        }
        this.attachedAudioElements.add(el);
        document.body.appendChild(el);
        el.play?.().catch(() => {
          const unlock = () => {
            el.play?.().catch(() => {});
          };
          window.addEventListener('click', unlock, { once: true });
        });
      } catch {}
    }

    this._notifyParticipantsUpdate();
  }

  _handleTrackUnsubscribed(track, publication, participant) {
    const pInfo = this.remoteParticipantsMap.get(participant?.identity);
    const isTeacher = pInfo?.role === 'teacher';

    const isScreenShare = publication?.source === Track.Source.ScreenShare || 
                          track?.source === Track.Source.ScreenShare || 
                          track === this.teacherScreenTrack;
    if (isScreenShare) {
      if (pInfo) pInfo.screenTrack = null;
      if (isTeacher && this.teacherScreenTrack) {
        try { this.teacherScreenTrack.detach().forEach(el => el.remove()); } catch {}
        this.teacherScreenTrack = null;
        this._notifyTeacherStreamChange();
      }
    }
    if (track.kind === Track.Kind.Video) {
      if (pInfo && pInfo.videoTrack === track) pInfo.videoTrack = null;
      if (isTeacher && track === this.teacherVideoTrack) {
        this.teacherVideoTrack = null;
        this._notifyTeacherStreamChange();
      }
    }
    if (track.kind === Track.Kind.Audio) {
      if (pInfo && pInfo.audioTrack === track) pInfo.audioTrack = null;
      if (isTeacher && track === this.teacherAudioTrack) {
        this.teacherAudioTrack = null;
        this._notifyTeacherStreamChange();
      }
      try {
        track.detach().forEach(el => {
          this.attachedAudioElements.delete(el);
          el.remove();
        });
      } catch {}
    }

    this._notifyParticipantsUpdate();
  }

  _notifyParticipantsUpdate() {
    if (this.onRemoteParticipantsChange) {
      const list = Array.from(this.remoteParticipantsMap.values());
      this.onRemoteParticipantsChange(list);
    }
  }

  _notifyTeacherStreamChange() {
    if (this.onTeacherStreamChange) {
      this.onTeacherStreamChange({
        videoTrack: this.teacherVideoTrack,
        audioTrack: this.teacherAudioTrack,
        screenTrack: this.teacherScreenTrack,
        teacherParticipant: this.teacherParticipant
      });
    }
  }

  /**
   * Teacher / Student: Toggle camera publishing
   */
  async setCameraEnabled(enabled) {
    if (!this.room || !this.isConnected) return false;
    try {
      await this.room.localParticipant.setCameraEnabled(enabled);
      if (!enabled) {
        this.localVideoTrack = null;
        if (this.onLocalStreamChange) {
          this.onLocalStreamChange({
            videoTrack: null,
            audioTrack: this.localAudioTrack,
            screenTrack: this.localScreenTrack
          });
        }
      }
      return enabled;
    } catch (err) {
      console.warn('[LiveKit] Không thể đổi trạng thái Camera:', err.message);
      return false;
    }
  }

  /**
   * Teacher / Student: Toggle microphone publishing
   */
  async setMicrophoneEnabled(enabled) {
    if (!this.room || !this.isConnected) return false;
    try {
      await this.room.localParticipant.setMicrophoneEnabled(enabled);
      if (!enabled) {
        this.localAudioTrack = null;
        if (this.onLocalStreamChange) {
          this.onLocalStreamChange({
            videoTrack: this.localVideoTrack,
            audioTrack: null,
            screenTrack: this.localScreenTrack
          });
        }
      }
      return enabled;
    } catch (err) {
      console.warn('[LiveKit] Không thể đổi trạng thái Micro:', err.message);
      return false;
    }
  }

  /**
   * Teacher: Toggle screen share publishing
   */
  async setScreenShareEnabled(enabled) {
    if (!this.room || !this.isConnected) return false;
    try {
      const pub = await this.room.localParticipant.setScreenShareEnabled(enabled);
      if (enabled) {
        if (pub?.track?.mediaStreamTrack) {
          pub.track.mediaStreamTrack.onended = () => {
            this.setScreenShareEnabled(false).catch(() => {});
          };
        }
      } else {
        if (this.localScreenTrack) {
          try { this.localScreenTrack.stop(); } catch {}
        }
        this.localScreenTrack = null;
        if (this.onLocalStreamChange) {
          this.onLocalStreamChange({
            videoTrack: this.localVideoTrack,
            audioTrack: this.localAudioTrack,
            screenTrack: null
          });
        }
      }
      return Boolean(enabled);
    } catch (err) {
      console.warn('[LiveKit] Không thể đổi trạng thái Screen Share:', err.message);
      return false;
    }
  }

  /**
   * Attach a track to an HTML video or audio element
   */
  attachTrack(track, element) {
    if (!track || !element) return;
    try {
      track.attach(element);
    } catch (err) {
      console.warn('[LiveKit] Lỗi khi attach track:', err.message);
    }
  }

  /**
   * Detach a track from an HTML element
   */
  detachTrack(track, element) {
    if (!track) return;
    try {
      if (element) {
        track.detach(element);
      } else {
        track.detach();
      }
    } catch (err) {
      console.warn('[LiveKit] Lỗi khi detach track:', err.message);
    }
  }

  /**
   * Disconnect and release all local & remote resources
   */
  async disconnect() {
    if (this.room) {
      try {
        if (this.teacherAudioTrack) {
          this.teacherAudioTrack.detach().forEach(el => {
            this.attachedAudioElements.delete(el);
            el.remove();
          });
        }
        await this.room.disconnect();
      } catch (err) {
        console.warn('[LiveKit] Lỗi khi disconnect room:', err.message);
      }
      this.room = null;
    }

    // Stop and release all local hardware tracks immediately
    if (this.localVideoTrack) {
      try { this.localVideoTrack.stop(); } catch {}
      this.localVideoTrack = null;
    }
    if (this.localAudioTrack) {
      try { this.localAudioTrack.stop(); } catch {}
      this.localAudioTrack = null;
    }
    if (this.localScreenTrack) {
      try { this.localScreenTrack.stop(); } catch {}
      this.localScreenTrack = null;
    }

    // Clean up audio elements attached by this service instance
    this.attachedAudioElements.forEach(el => {
      try { el.remove(); } catch {}
    });
    this.attachedAudioElements.clear();

    // Browser fallback cleanup strictly scoped to this session / participant tags
    if (typeof document !== 'undefined') {
      try {
        const selector = this.sessionId 
          ? `[data-livekit-participant][data-livekit-session="${this.sessionId}"]` 
          : '[data-livekit-participant]';
        document.querySelectorAll(selector).forEach(el => el.remove());
      } catch {}
    }

    this.remoteParticipantsMap.clear();
    this.isConnected = false;
    this.teacherVideoTrack = null;
    this.teacherAudioTrack = null;
    this.teacherScreenTrack = null;
    this.teacherParticipant = null;
  }
}
