import { useCallback, useEffect, useRef, useState } from 'react';
import type { TranscriptSegment } from '../../services/listeningStudioService.ts';
import { speakChinese } from '../../utils/audio.js';

export type PlaybackSpeed = 0.6 | 0.8 | 1.0 | 1.25 | 1.5;
export type LoopMode = 'none' | 'single' | 'ab';

export interface AbLoopRange {
  startIndex: number;
  endIndex: number;
}

interface UsePrecisionAudioPlayerOptions {
  audioUrl: string;
  segments: TranscriptSegment[];
  durationSeconds: number;
}

function applyPreservesPitch(audio: HTMLAudioElement): void {
  const extended = audio as HTMLAudioElement & {
    mozPreservesPitch?: boolean;
    webkitPreservesPitch?: boolean;
  };
  audio.preservesPitch = true;
  extended.mozPreservesPitch = true;
  extended.webkitPreservesPitch = true;
}

function findSegmentIndexAtMs(segments: TranscriptSegment[], timeMs: number): number {
  if (segments.length === 0) return 0;
  for (let i = 0; i < segments.length; i += 1) {
    if (timeMs >= segments[i].start_ms && timeMs < segments[i].end_ms) {
      return i;
    }
  }
  if (timeMs >= segments[segments.length - 1].end_ms) {
    return segments.length - 1;
  }
  return 0;
}

export function usePrecisionAudioPlayer({
  audioUrl,
  segments,
  durationSeconds,
}: UsePrecisionAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTsRef = useRef<number>(0);
  const virtualTimeMsRef = useRef<number>(0);
  const lastSpokenSegmentRef = useRef<number>(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState<PlaybackSpeed>(1.0);
  const [loopMode, setLoopMode] = useState<LoopMode>('none');
  const [abRange, setAbRangeState] = useState<AbLoopRange>({
    startIndex: 0,
    endIndex: Math.max(0, segments.length - 1),
  });

  const hasExternalAudio = Boolean(audioUrl && audioUrl.trim().length > 0);
  const totalDurationMs =
    segments.length > 0
      ? Math.max(durationSeconds * 1000, segments[segments.length - 1].end_ms)
      : durationSeconds * 1000;

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakSegment = useCallback(
    (segIndex: number, rate: PlaybackSpeed) => {
      const seg = segments[segIndex];
      if (!seg || hasExternalAudio) return;
      lastSpokenSegmentRef.current = segIndex;
      speakChinese(seg.hanzi, Math.min(1.5, Math.max(0.55, rate * 0.9)));
    },
    [segments, hasExternalAudio]
  );

  const seekToMs = useCallback(
    (targetMs: number, autoSpeakIfPlaying = true) => {
      const clamped = Math.max(0, Math.min(totalDurationMs, targetMs));
      virtualTimeMsRef.current = clamped;
      setCurrentTimeMs(clamped);

      const nextIdx = findSegmentIndexAtMs(segments, clamped);
      setActiveSegmentIndex(nextIdx);

      if (hasExternalAudio && audioRef.current) {
        audioRef.current.currentTime = clamped / 1000;
      } else if (isPlaying && autoSpeakIfPlaying) {
        stopSpeech();
        speakSegment(nextIdx, playbackRate);
      }
    },
    [totalDurationMs, segments, hasExternalAudio, isPlaying, stopSpeech, speakSegment, playbackRate]
  );

  const setPlaybackRate = useCallback(
    (rate: PlaybackSpeed) => {
      setPlaybackRateState(rate);
      if (audioRef.current) {
        applyPreservesPitch(audioRef.current);
        audioRef.current.playbackRate = rate;
      }
    },
    []
  );

  const play = useCallback(() => {
    if (hasExternalAudio && audioRef.current) {
      applyPreservesPitch(audioRef.current);
      audioRef.current.playbackRate = playbackRate;
      void audioRef.current.play().catch(() => {});
    } else {
      lastFrameTsRef.current = performance.now();
      const idx = findSegmentIndexAtMs(segments, virtualTimeMsRef.current);
      speakSegment(idx, playbackRate);
    }
    setIsPlaying(true);
  }, [hasExternalAudio, playbackRate, segments, speakSegment]);

  const pause = useCallback(() => {
    if (hasExternalAudio && audioRef.current) {
      audioRef.current.pause();
    } else {
      stopSpeech();
    }
    setIsPlaying(false);
  }, [hasExternalAudio, stopSpeech]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const jumpToSegment = useCallback(
    (index: number) => {
      if (segments.length === 0) return;
      const safeIdx = Math.max(0, Math.min(segments.length - 1, index));
      const targetMs = segments[safeIdx].start_ms;
      virtualTimeMsRef.current = targetMs;
      setCurrentTimeMs(targetMs);
      setActiveSegmentIndex(safeIdx);

      if (hasExternalAudio && audioRef.current) {
        audioRef.current.currentTime = targetMs / 1000;
        if (isPlaying) {
          void audioRef.current.play().catch(() => {});
        }
      } else {
        stopSpeech();
        if (isPlaying) {
          speakSegment(safeIdx, playbackRate);
        }
      }
    },
    [segments, hasExternalAudio, isPlaying, stopSpeech, speakSegment, playbackRate]
  );

  const prevSegment = useCallback(() => {
    jumpToSegment(activeSegmentIndex - 1);
  }, [jumpToSegment, activeSegmentIndex]);

  const nextSegment = useCallback(() => {
    jumpToSegment(activeSegmentIndex + 1);
  }, [jumpToSegment, activeSegmentIndex]);

  const replayCurrentSegment = useCallback(() => {
    if (segments.length === 0) return;
    const seg = segments[activeSegmentIndex];
    if (!seg) return;
    virtualTimeMsRef.current = seg.start_ms;
    setCurrentTimeMs(seg.start_ms);

    if (hasExternalAudio && audioRef.current) {
      applyPreservesPitch(audioRef.current);
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = seg.start_ms / 1000;
      void audioRef.current.play().catch(() => {});
    } else {
      lastFrameTsRef.current = performance.now();
      stopSpeech();
      speakSegment(activeSegmentIndex, playbackRate);
    }
    setIsPlaying(true);
  }, [segments, activeSegmentIndex, hasExternalAudio, playbackRate, stopSpeech, speakSegment]);

  const setAbRange = useCallback(
    (startIndex: number, endIndex: number) => {
      const maxIdx = Math.max(0, segments.length - 1);
      const safeStart = Math.max(0, Math.min(maxIdx, startIndex));
      const safeEnd = Math.max(safeStart, Math.min(maxIdx, endIndex));
      setAbRangeState({ startIndex: safeStart, endIndex: safeEnd });
    },
    [segments.length]
  );

  // 60fps requestAnimationFrame loop for millisecond-accurate sync and A-B loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    lastFrameTsRef.current = performance.now();

    const tick = (now: number) => {
      const deltaMs = Math.max(0, now - lastFrameTsRef.current);
      lastFrameTsRef.current = now;

      let nextTimeMs = virtualTimeMsRef.current;
      if (hasExternalAudio && audioRef.current) {
        nextTimeMs = audioRef.current.currentTime * 1000;
        virtualTimeMsRef.current = nextTimeMs;
      } else {
        nextTimeMs = virtualTimeMsRef.current + deltaMs * playbackRate;
        virtualTimeMsRef.current = nextTimeMs;
      }

      const currentIdx = findSegmentIndexAtMs(segments, nextTimeMs);

      // Handle Single Sentence Loop & A-B Loop
      if (loopMode === 'single' && segments[activeSegmentIndex]) {
        const seg = segments[activeSegmentIndex];
        if (nextTimeMs >= seg.end_ms) {
          virtualTimeMsRef.current = seg.start_ms;
          setCurrentTimeMs(seg.start_ms);
          if (hasExternalAudio && audioRef.current) {
            audioRef.current.currentTime = seg.start_ms / 1000;
          } else {
            stopSpeech();
            speakSegment(activeSegmentIndex, playbackRate);
          }
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      } else if (loopMode === 'ab' && segments.length > 0) {
        const startSeg = segments[Math.min(abRange.startIndex, segments.length - 1)];
        const endSeg = segments[Math.min(abRange.endIndex, segments.length - 1)];
        if (startSeg && endSeg && nextTimeMs >= endSeg.end_ms) {
          virtualTimeMsRef.current = startSeg.start_ms;
          setCurrentTimeMs(startSeg.start_ms);
          setActiveSegmentIndex(abRange.startIndex);
          if (hasExternalAudio && audioRef.current) {
            audioRef.current.currentTime = startSeg.start_ms / 1000;
          } else {
            stopSpeech();
            speakSegment(abRange.startIndex, playbackRate);
          }
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      }

      // End of track
      if (nextTimeMs >= totalDurationMs) {
        virtualTimeMsRef.current = 0;
        setCurrentTimeMs(0);
        setActiveSegmentIndex(0);
        setIsPlaying(false);
        if (hasExternalAudio && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } else {
          stopSpeech();
        }
        return;
      }

      setCurrentTimeMs(nextTimeMs);
      if (currentIdx !== activeSegmentIndex) {
        setActiveSegmentIndex(currentIdx);
        if (!hasExternalAudio && lastSpokenSegmentRef.current !== currentIdx) {
          speakSegment(currentIdx, playbackRate);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    isPlaying,
    hasExternalAudio,
    playbackRate,
    segments,
    loopMode,
    activeSegmentIndex,
    abRange,
    totalDurationMs,
    stopSpeech,
    speakSegment,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
    audioRef,
    hasExternalAudio,
    isPlaying,
    currentTimeMs,
    totalDurationMs,
    activeSegmentIndex,
    playbackRate,
    loopMode,
    abRange,
    play,
    pause,
    togglePlay,
    seekToMs,
    jumpToSegment,
    prevSegment,
    nextSegment,
    replayCurrentSegment,
    setPlaybackRate,
    setLoopMode,
    setAbRange,
  };
}

