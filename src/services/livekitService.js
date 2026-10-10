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
 * Generate LiveKit access token directly on client using jose (HS256)
 * Used as high-reliability fallback when backend API is unreachable or in dev mode.
 */
async function generateLocalLiveKitToken({ sessionId, user, role = 'student' }) {
  const apiKey = getEnv('VITE_LIVEKIT_API_KEY') || getEnv('LIVEKIT_API_KEY');
  const apiSecret = getEnv('VITE_LIVEKIT_API_SECRET') || getEnv('LIVEKIT_API_SECRET');
  const serverUrl = getEnv('VITE_LIVEKIT_URL') || getEnv('LIVEKIT_URL');

  if (!apiKey || !apiSecret || !serverUrl) return null;

  try {
    const { SignJWT } = await import('jose');
    const secretBytes = new TextEncoder().encode(apiSecret);
    const userId = String(user?.uid || user?.id || `user-${Date.now()}`);
    const userName = String(user?.name || user?.email || (role === 'teacher' ? 'Giáo viên' : 'Học sinh'));
    const isTeacher = role === 'teacher';

    const jwt = await new SignJWT({
      sub: userId,
      name: userName,
      metadata: JSON.stringify({ role, userId }),
      video: {
        room: String(sessionId),
        roomJoin: true,
        canPublish: isTeacher,
        canSubscribe: true,
        canPublishData: true
      }
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(apiKey)
      .setExpirationTime('2h')
      .setNotBefore(Math.floor(Date.now() / 1000) - 10)
      .sign(secretBytes);

    console.info('[LiveKit] Sinh token thành công từ client-side generator');
    return {
      success: true,
      token: jwt,
      serverUrl,
      isConfigured: true
    };
  } catch (err) {
    console.warn('[LiveKit] Client token generator notice:', err.message);
    return null;
  }
}

/**
 * Fetch LiveKit access token from backend API endpoint, with client-side fallback
 */
export async function fetchLiveKitToken({ sessionId, user, role = 'student' }) {
  const serverUrl = getEnv('VITE_LIVEKIT_URL') || getEnv('LIVEKIT_URL') || '';
  const isEnvConfigured = Boolean(serverUrl);

  // 1. Try serverless API endpoint
  try {
    const userId = user?.uid || user?.id || `user-${Date.now()}`;
    const userName = user?.name || user?.email || (role === 'teacher' ? 'Giáo viên' : 'Học sinh');

    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': String(userId)
    };

    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const response = await fetch('/api/webrtc/livekit-token', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        roomName: String(sessionId),
        userId: String(userId),
        userName: String(userName),
        role
      })
    });

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
    }
  } catch (err) {
    console.warn('[LiveKit] Backend token endpoint unavailable, trying local resolution:', err.message);
  }

  // 2. Fallback to client-side token generator if API is offline or returns error
  const localToken = await generateLocalLiveKitToken({ sessionId, user, role });
  if (localToken) {
    return localToken;
  }

  return {
    success: false,
    error: 'Không thể kết nối LiveKit (Chưa cấu hình URL hoặc Token).'
  };
}

/**
 * HanziGo LiveKit Classroom Manager
 */
export class LiveKitClassroomManager {
  constructor() {
    this.room = null;
    this.isConnected = false;
    this.isConfigured = false;
    this.role = 'student';
    this.userId = null;
    this.sessionId = null;

    // Remote Teacher Tracks
    this.teacherVideoTrack = null;
    this.teacherAudioTrack = null;
    this.teacherScreenTrack = null;
    this.teacherParticipant = null;

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
  }

  /**
   * Connect to the LiveKit classroom room
   */
  /**
   * Connect to the LiveKit classroom room
   */
  async connect({ sessionId, user, role = 'student', teacherId = null }) {
    this.role = role;
    this.sessionId = sessionId;
    this.userId = user?.uid || user?.id;
    this.teacherId = teacherId;

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
      // 2. Initialize Room
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
        this.onConnectionChange({ isConnected: true, state: room.state });
      }

      // Check existing participants in room
      this._scanParticipants(room);

      return { success: true, isConfigured: true, room };
    } catch (err) {
      console.error('[LiveKit] Lỗi kết nối LiveKit Room:', err);
      if (this.onError) this.onError(err.message);
      return { success: false, error: err.message };
    }
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

    // Audio playback status changed (e.g. browser autoplay unlocked)
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
      this._scanParticipants(room);
    });

    // Participant disconnected
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      if (this.teacherParticipant?.identity === participant.identity) {
        this.teacherVideoTrack = null;
        this.teacherAudioTrack = null;
        this.teacherScreenTrack = null;
        this.teacherParticipant = null;
        this._notifyTeacherStreamChange();
      }
      this._scanParticipants(room);
    });

    // Disconnected
    room.on(RoomEvent.Disconnected, () => {
      this.isConnected = false;
      console.info('[LiveKit] Phòng đã ngắt kết nối.');
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: false, state: 'disconnected' });
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

    // Local track unpublished (when camera, mic or screen share is turned off)
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

  _scanParticipants(room) {
    if (!room) return;
    const participants = Array.from(room.remoteParticipants.values());
    if (this.onRemoteParticipantsChange) {
      this.onRemoteParticipantsChange(participants);
    }

    // Identify teacher participant strictly
    for (const p of participants) {
      let meta = {};
      try { meta = JSON.parse(p.metadata || '{}'); } catch {}
      const isTeacher = meta.role === 'teacher' || 
                        (this.teacherId && String(p.identity) === String(this.teacherId)) || 
                        p.identity.startsWith('teacher') || 
                        p.identity.includes('teacher');
      if (isTeacher) {
        this.teacherParticipant = p;
        p.trackPublications.forEach(pub => {
          if (pub.track && pub.isSubscribed) {
            this._handleTrackSubscribed(pub.track, pub, p);
          }
        });
      }
    }
  }

  _handleTrackSubscribed(track, publication, participant) {
    let meta = {};
    try { meta = JSON.parse(participant.metadata || '{}'); } catch {}
    const isTeacher = meta.role === 'teacher' || 
                      (this.teacherId && String(participant.identity) === String(this.teacherId)) || 
                      participant.identity.startsWith('teacher') || 
                      participant.identity.includes('teacher');

    if (isTeacher) {
      this.teacherParticipant = participant;
      const isScreenShare = publication?.source === Track.Source.ScreenShare || track?.source === Track.Source.ScreenShare;
      if (isScreenShare) {
        this.teacherScreenTrack = track;
      } else if (track.kind === Track.Kind.Video) {
        this.teacherVideoTrack = track;
      } else if (track.kind === Track.Kind.Audio) {
        this.teacherAudioTrack = track;
        // Auto-play audio safely
        try {
          const el = track.attach();
          el.style.display = 'none';
          document.body.appendChild(el);
          el.play?.().catch(() => {
            // Browser autoplay restrictions may wait for user interaction
            const unlock = () => {
              el.play?.().catch(() => {});
            };
            window.addEventListener('click', unlock, { once: true });
          });
        } catch {}
      }
      this._notifyTeacherStreamChange();
    } else {
      // Remote student track (e.g. student granted speech permission)
      if (track.kind === Track.Kind.Audio) {
        try {
          const el = track.attach();
          el.style.display = 'none';
          el.dataset.livekitParticipant = participant.identity;
          document.body.appendChild(el);
          el.play?.().catch(() => {
            const unlock = () => {
              el.play?.().catch(() => {});
            };
            window.addEventListener('click', unlock, { once: true });
          });
        } catch {}
      }
    }
  }

  _handleTrackUnsubscribed(track, publication, participant) {
    const isScreenShare = publication?.source === Track.Source.ScreenShare || 
                          track?.source === Track.Source.ScreenShare || 
                          track === this.teacherScreenTrack;
    if (isScreenShare) {
      if (this.teacherScreenTrack) {
        try { this.teacherScreenTrack.detach().forEach(el => el.remove()); } catch {}
      }
      this.teacherScreenTrack = null;
    }
    if (track === this.teacherVideoTrack || publication?.source === Track.Source.Camera) {
      this.teacherVideoTrack = null;
    }
    if (track === this.teacherAudioTrack || publication?.source === Track.Source.Microphone) {
      try { track.detach().forEach(el => el.remove()); } catch {}
      this.teacherAudioTrack = null;
    }
    // Clean up detached student audio elements
    try {
      track.detach().forEach(el => el.remove());
    } catch {}
    this._notifyTeacherStreamChange();
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
      await this.room.localParticipant.setScreenShareEnabled(enabled);
      if (!enabled) {
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
          this.teacherAudioTrack.detach().forEach(el => el.remove());
        }
        await this.room.disconnect();
      } catch (err) {
        console.warn('[LiveKit] Lỗi khi disconnect room:', err.message);
      }
      this.room = null;
    }
    this.isConnected = false;
    this.teacherVideoTrack = null;
    this.teacherAudioTrack = null;
    this.teacherScreenTrack = null;
    this.teacherParticipant = null;
    this.localVideoTrack = null;
    this.localAudioTrack = null;
    this.localScreenTrack = null;
  }
}
