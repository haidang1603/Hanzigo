import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  findActiveSubtitleCueIndex,
  type ImmersionVideo,
} from '../../services/videoStudioService.ts';

export type VideoPlayerStatus = 'idle' | 'playing' | 'paused' | 'ended';

interface UseInteractiveVideoPlayerOptions {
  video: ImmersionVideo;
  onTimeUpdate?: (timeMs: number) => void;
}

export function useInteractiveVideoPlayer({
  video,
  onTimeUpdate,
}: UseInteractiveVideoPlayerOptions) {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [activeCueIndex, setActiveCueIndex] = useState<number>(-1);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isLoopingCurrentCue, setIsLoopingCurrentCue] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);

  const totalDurationMs = Math.max(1000, video.duration_seconds * 1000);
  const subtitles = useMemo(() => video.subtitles || [], [video.subtitles]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
    setActiveCueIndex(subtitles.length > 0 ? 0 : -1);
  }, [video.id, subtitles.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (videoElementRef.current) {
      videoElementRef.current.pause();
    } else if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    }
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
    setHoverPaused(false);
    if (videoElementRef.current) {
      void videoElementRef.current.play().catch(() => {});
    } else if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const seekToMs = useCallback(
    (targetMs: number) => {
      const clamped = Math.max(0, Math.min(totalDurationMs, targetMs));
      setCurrentTimeMs(clamped);
      const cueIdx = findActiveSubtitleCueIndex(subtitles, clamped);
      setActiveCueIndex(cueIdx);

      if (videoElementRef.current) {
        videoElementRef.current.currentTime = clamped / 1000;
      } else if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [clamped / 1000, true] }),
          '*'
        );
      }
      onTimeUpdate?.(clamped);
    },
    [totalDurationMs, subtitles, onTimeUpdate]
  );

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = speed;
    } else if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed] }),
        '*'
      );
    }
  }, []);

  const jumpToCue = useCallback(
    (index: number) => {
      if (subtitles.length === 0) return;
      const safeIdx = Math.max(0, Math.min(subtitles.length - 1, index));
      const targetCue = subtitles[safeIdx];
      if (targetCue) {
        seekToMs(targetCue.start_ms);
      }
    },
    [subtitles, seekToMs]
  );

  const prevCue = useCallback(() => {
    if (activeCueIndex > 0) {
      jumpToCue(activeCueIndex - 1);
    } else if (subtitles.length > 0) {
      jumpToCue(0);
    }
  }, [activeCueIndex, jumpToCue, subtitles.length]);

  const nextCue = useCallback(() => {
    if (activeCueIndex < subtitles.length - 1) {
      jumpToCue(activeCueIndex + 1);
    }
  }, [activeCueIndex, jumpToCue, subtitles.length]);

  const replayCurrentCue = useCallback(() => {
    if (activeCueIndex >= 0 && subtitles[activeCueIndex]) {
      jumpToCue(activeCueIndex);
      play();
    }
  }, [activeCueIndex, subtitles, jumpToCue, play]);

  // Auto-pause on hover/token lookup
  const handleSubtitleMouseEnter = useCallback(() => {
    if (isPlaying) {
      pause();
      setHoverPaused(true);
    }
  }, [isPlaying, pause]);

  const handleSubtitleMouseLeave = useCallback(
    (pinnedPopover = false) => {
      if (hoverPaused && !pinnedPopover) {
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = window.setTimeout(() => {
          play();
        }, 300);
      }
    },
    [hoverPaused, play]
  );

  // 50ms interval clock / animationFrame loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    lastTickTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaMs = Math.max(0, now - lastTickTimeRef.current);
      lastTickTimeRef.current = now;

      let nextMs = currentTimeMs;
      if (videoElementRef.current) {
        nextMs = videoElementRef.current.currentTime * 1000;
      } else {
        nextMs = currentTimeMs + deltaMs * playbackSpeed;
      }

      // Check single cue loop
      if (isLoopingCurrentCue && activeCueIndex >= 0 && subtitles[activeCueIndex]) {
        const curCue = subtitles[activeCueIndex];
        if (nextMs >= curCue.end_ms) {
          seekToMs(curCue.start_ms);
          animFrameRef.current = requestAnimationFrame(loop);
          return;
        }
      }

      if (nextMs >= totalDurationMs) {
        setIsPlaying(false);
        setCurrentTimeMs(totalDurationMs);
        return;
      }

      setCurrentTimeMs(nextMs);
      const idx = findActiveSubtitleCueIndex(subtitles, nextMs);
      if (idx !== activeCueIndex) {
        setActiveCueIndex(idx);
      }
      onTimeUpdate?.(nextMs);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [
    isPlaying,
    currentTimeMs,
    playbackSpeed,
    isLoopingCurrentCue,
    activeCueIndex,
    subtitles,
    totalDurationMs,
    seekToMs,
    onTimeUpdate,
  ]);

  // Sync state & currentTime from YouTube iframe postMessage (when user interacts directly with YouTube controls)
  useEffect(() => {
    if (video.source_type !== 'youtube' || typeof window === 'undefined') return;

    const sendListeningHandshake = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'listening', id: video.id, channel: 'widget' }),
          '*'
        );
      } catch {
        // ignore cross-origin handshake errors
      }
    };

    const iframeEl = iframeRef.current;
    iframeEl?.addEventListener('load', sendListeningHandshake);
    sendListeningHandshake();

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.youtube-nocookie.com' &&
        event.origin !== 'https://www.youtube.com'
      ) {
        return;
      }

      let payload: { event?: string; info?: { playerState?: number; currentTime?: number } } | null = null;
      try {
        payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (!payload || !payload.info) return;

      if (typeof payload.info.currentTime === 'number') {
        const nextMs = Math.max(0, Math.round(payload.info.currentTime * 1000));
        setCurrentTimeMs(nextMs);
        const idx = findActiveSubtitleCueIndex(subtitles, nextMs);
        setActiveCueIndex(idx);
        onTimeUpdate?.(nextMs);
      }

      if (typeof payload.info.playerState === 'number') {
        // YouTube PlayerState: 1 = playing, 2 = paused, 0 = ended
        if (payload.info.playerState === 1) {
          setIsPlaying(true);
        } else if (payload.info.playerState === 2 || payload.info.playerState === 0) {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      iframeEl?.removeEventListener('load', sendListeningHandshake);
      window.removeEventListener('message', handleMessage);
    };
  }, [video.id, video.source_type, subtitles, onTimeUpdate]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return {
    videoElementRef,
    iframeRef,
    isPlaying,
    currentTimeMs,
    totalDurationMs,
    activeCueIndex,
    playbackSpeed,
    isLoopingCurrentCue,
    hoverPaused,
    play,
    pause,
    togglePlay,
    seekToMs,
    jumpToCue,
    prevCue,
    nextCue,
    replayCurrentCue,
    setPlaybackSpeed,
    setIsLoopingCurrentCue,
    handleSubtitleMouseEnter,
    handleSubtitleMouseLeave,
  };
}
