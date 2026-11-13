import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Autocorrelation pitch detector (YIN-style normalized difference) for human voice F0 (75Hz - 450Hz).
 */
export function detectPitchAutocorrelation(
  buffer: Float32Array,
  sampleRate: number
): number | null {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i += 1) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / size);
  if (rms < 0.015) return null; // silence / background noise gate

  const minLag = Math.floor(sampleRate / 450);
  const maxLag = Math.min(Math.floor(size / 2), Math.floor(sampleRate / 75));
  if (maxLag <= minLag) return null;

  let bestLag = -1;
  let bestCorr = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let sum = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < size - lag; i += 1) {
      sum += buffer[i] * buffer[i + lag];
      normA += buffer[i] * buffer[i];
      normB += buffer[i + lag] * buffer[i + lag];
    }
    const denom = Math.sqrt(normA * normB);
    const corr = denom > 0 ? sum / denom : 0;
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  if (bestLag <= 0 || bestCorr < 0.72) return null;
  return sampleRate / bestLag;
}

/**
 * Normalize F0 (Hz) into Chao Yuen Ren 5-level pitch scale mapped to [0..100].
 * Default baseline ~160Hz spans ~100Hz..280Hz across semitones.
 */
export function normalizeHzToChaoScale(f0Hz: number, baselineHz = 160): number {
  const semitones = 12 * Math.log2(Math.max(60, f0Hz) / Math.max(60, baselineHz));
  // Map [-7 .. +9] semitones to [10 .. 95]
  const normalized = ((semitones + 7) / 16) * 85 + 10;
  return Math.max(5, Math.min(98, Math.round(normalized)));
}

export function chaoScaleToLevel(value0to100: number): number {
  return Math.max(1, Math.min(5, Math.round((value0to100 / 100) * 4 + 1)));
}

export function usePitchContourAnalyzer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const contourRef = useRef<number[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [livePitchHz, setLivePitchHz] = useState<number | null>(null);
  const [liveChaoLevel, setLiveChaoLevel] = useState<number | null>(null);
  const [userContour, setUserContour] = useState<number[]>([]);
  const [micError, setMicError] = useState<string | null>(null);

  const stopTracksAndContext = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const stopRecording = useCallback((): number[] => {
    stopTracksAndContext();
    setIsRecording(false);
    setLivePitchHz(null);
    setLiveChaoLevel(null);
    return contourRef.current;
  }, [stopTracksAndContext]);

  const resetContour = useCallback(() => {
    contourRef.current = [];
    setUserContour([]);
    setLivePitchHz(null);
    setLiveChaoLevel(null);
    setMicError(null);
  }, []);

  const startRecording = useCallback(async () => {
    setMicError(null);
    contourRef.current = [];
    setUserContour([]);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setMicError('Trình duyệt không hỗ trợ thu âm Micro. Bạn có thể dùng nút "Mô phỏng giọng đọc" để xem đường cao độ.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsRecording(true);
      const buffer = new Float32Array(analyser.fftSize);

      const sampleFrame = () => {
        if (!analyserRef.current || !audioCtxRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);
        const f0 = detectPitchAutocorrelation(buffer, audioCtxRef.current.sampleRate);
        if (f0 !== null) {
          const scaled = normalizeHzToChaoScale(f0);
          setLivePitchHz(Math.round(f0));
          setLiveChaoLevel(chaoScaleToLevel(scaled));
          contourRef.current = [...contourRef.current, scaled];
          setUserContour(contourRef.current);
        }
        rafRef.current = requestAnimationFrame(sampleFrame);
      };

      rafRef.current = requestAnimationFrame(sampleFrame);
    } catch {
      setMicError('Không thể truy cập Micro. Vui lòng cấp quyền Micro hoặc dùng chế độ mô phỏng.');
      stopTracksAndContext();
      setIsRecording(false);
    }
  }, [stopTracksAndContext]);

  useEffect(() => {
    return () => {
      stopTracksAndContext();
    };
  }, [stopTracksAndContext]);

  return {
    isRecording,
    livePitchHz,
    liveChaoLevel,
    userContour,
    micError,
    startRecording,
    stopRecording,
    resetContour,
    setSimulatedContour: (pts: number[]) => {
      contourRef.current = pts;
      setUserContour(pts);
    },
  };
}

