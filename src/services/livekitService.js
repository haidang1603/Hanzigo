/**
 * =========================================================================
 * HANZI GO - LIVEKIT WEBRTC SFU SERVICE
 * =========================================================================
 * Real-time audio, video, and screen-sharing engine powered by LiveKit SFU.
 * - Sub-second latency for teacher broadcasting (1 teacher + 50 students).
 * - Automatic track subscription & video element mounting.
 * - Graceful fallback if LiveKit server credentials are not yet configured.
 */

import { Room, RoomEvent, Track, VideoPresets } from 'livekit-client';

/**
 * Fetch LiveKit access token from backend API endpoint
 */
export async function fetchLiveKitToken({ sessionId, user, role = 'student' }) {
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

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `HTTP ${response.status}: Không thể lấy LiveKit token.`
      };
    }

    const data = await response.json();
    return {
      success: true,
      token: data.token,
      serverUrl: data.serverUrl || import.meta.env.VITE_LIVEKIT_URL || '',
      isConfigured: Boolean(data.isConfigured || import.meta.env.VITE_LIVEKIT_URL)
    };
  } catch (err) {
    return {
      success: false,
      error: 'Không thể kết nối đến máy chủ cấp token: ' + err.message
    };
  }
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

    // Callbacks
    this.onTeacherStreamChange = null;
    this.onConnectionChange = null;
    this.onError = null;
    this.onRemoteParticipantsChange = null;
  }

  /**
   * Connect to the LiveKit classroom room
   */
  async connect({ sessionId, user, role = 'student' }) {
    this.role = role;
    this.sessionId = sessionId;
    this.userId = user?.uid || user?.id;

    // 1. Fetch token
    const tokenResult = await fetchLiveKitToken({ sessionId, user, role });
    if (!tokenResult.success) {
      console.warn('[LiveKit] Không lấy được token:', tokenResult.error);
      return { success: false, error: tokenResult.error };
    }

    const { token, serverUrl, isConfigured } = tokenResult;
    this.isConfigured = isConfigured;

    if (!serverUrl || !isConfigured) {
      console.info('[LiveKit] VITE_LIVEKIT_URL chưa cấu hình. Hệ thống sẽ chạy chế độ mô phỏng WebRTC cục bộ.');
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
      if (this.onConnectionChange) {
        this.onConnectionChange({ isConnected: false, state: 'disconnected' });
      }
    });
  }

  _scanParticipants(room) {
    if (!room) return;
    const participants = Array.from(room.remoteParticipants.values());
    if (this.onRemoteParticipantsChange) {
      this.onRemoteParticipantsChange(participants);
    }

    // Identify teacher participant
    for (const p of participants) {
      let meta = {};
      try { meta = JSON.parse(p.metadata || '{}'); } catch {}
      if (meta.role === 'teacher') {
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
    const isTeacher = meta.role === 'teacher';

    if (isTeacher) {
      this.teacherParticipant = participant;
      if (track.source === Track.Source.ScreenShare) {
        this.teacherScreenTrack = track;
      } else if (track.kind === Track.Kind.Video) {
        this.teacherVideoTrack = track;
      } else if (track.kind === Track.Kind.Audio) {
        this.teacherAudioTrack = track;
        // Auto-play audio track
        const el = track.attach();
        el.style.display = 'none';
        document.body.appendChild(el);
      }
      this._notifyTeacherStreamChange();
    }
  }

  _handleTrackUnsubscribed(track, publication, participant) {
    if (track === this.teacherVideoTrack) {
      this.teacherVideoTrack = null;
    }
    if (track === this.teacherScreenTrack) {
      this.teacherScreenTrack = null;
    }
    if (track === this.teacherAudioTrack) {
      track.detach().forEach(el => el.remove());
      this.teacherAudioTrack = null;
    }
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
      return enabled;
    } catch (err) {
      console.error('[LiveKit] Không thể đổi trạng thái Camera:', err);
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
      return enabled;
    } catch (err) {
      console.error('[LiveKit] Không thể đổi trạng thái Micro:', err);
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
      return enabled;
    } catch (err) {
      console.error('[LiveKit] Không thể đổi trạng thái Screen Share:', err);
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
        console.warn('[LiveKit] Lỗi khi disconnect room:', err);
      }
      this.room = null;
    }
    this.isConnected = false;
    this.teacherVideoTrack = null;
    this.teacherAudioTrack = null;
    this.teacherScreenTrack = null;
    this.teacherParticipant = null;
  }
}
