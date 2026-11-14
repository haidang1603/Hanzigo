import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Mic,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Volume2,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  gradeHskkSpeakingResponse,
  HSKK_FULL_EXAMS,
  HSKK_LEVEL_META,
  HSKK_OFFICIAL_SPEC,
  HSKK_SAMPLE_QUESTIONS,
  playBeepTone,
  type HskkEvaluationResult,
  type HskkLevel,
  type HskkPictureSceneKey,
} from './hskkEngine.ts';

type SimulatorStage = 'IDLE' | 'PLAYING_PROMPT' | 'PREPARING' | 'RECORDING' | 'COMPLETED';
type SimulatorExamMode = 'full' | 'quick';

interface HskkSpeakingSimulatorProps {
  onBack?: () => void;
}

/**
 * Minh họa SVG trực quan cho phần thi Mô tả tranh HSKK Trung cấp (看图说话)
 */
const PictureSceneSvg: React.FC<{ sceneKey?: HskkPictureSceneKey }> = ({ sceneKey }) => {
  if (sceneKey === 'office_teamwork') {
    return (
      <div className="rounded-2xl overflow-hidden border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 p-3">
        <svg viewBox="0 0 480 220" className="w-full max-w-lg mx-auto h-48" role="img" aria-label="Tranh đồng nghiệp thảo luận dự án">
          <rect x="0" y="0" width="480" height="220" rx="14" fill="#F8FAFC" />
          {/* Presentation Board */}
          <rect x="275" y="20" width="170" height="105" rx="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.5" />
          <polyline points="295,100 325,82 355,88 395,52 425,40" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
          <rect x="300" y="92" width="16" height="20" fill="#3B82F6" rx="2" />
          <rect x="330" y="76" width="16" height="36" fill="#3B82F6" rx="2" />
          <rect x="360" y="64" width="16" height="48" fill="#6366F1" rx="2" />
          <rect x="390" y="46" width="16" height="66" fill="#10B981" rx="2" />
          {/* Meeting Table */}
          <rect x="55" y="138" width="290" height="18" rx="6" fill="#D97706" />
          <rect x="85" y="156" width="14" height="50" fill="#92400E" />
          <rect x="295" y="156" width="14" height="50" fill="#92400E" />
          {/* Laptop on table */}
          <polygon points="150,138 205,138 215,112 162,112" fill="#334155" />
          {/* Colleague 1 pointing at board */}
          <circle cx="245" cy="68" r="18" fill="#FDE68A" />
          <path d="M225,138 C225,100 265,100 265,138 Z" fill="#2563EB" />
          <line x1="258" y1="104" x2="292" y2="75" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          {/* Colleague 2 seated left */}
          <circle cx="105" cy="82" r="16" fill="#FED7AA" />
          <path d="M84,138 C84,105 126,105 126,138 Z" fill="#059669" />
          {/* Colleague 3 seated mid */}
          <circle cx="170" cy="80" r="16" fill="#FDBA74" />
          <path d="M150,138 C150,104 190,104 190,138 Z" fill="#E11D48" />
          {/* Coffee cup */}
          <rect x="118" y="124" width="14" height="14" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3">
      <svg viewBox="0 0 480 220" className="w-full max-w-lg mx-auto h-48" role="img" aria-label="Tranh gia đình cùng nấu ăn trong bếp">
        <rect x="0" y="0" width="480" height="220" rx="14" fill="#FFFBEB" />
        {/* Kitchen Window */}
        <rect x="28" y="22" width="110" height="82" rx="6" fill="#BAE6FD" stroke="#D97706" strokeWidth="4" />
        <line x1="83" y1="22" x2="83" y2="104" stroke="#D97706" strokeWidth="3" />
        <line x1="28" y1="63" x2="138" y2="63" stroke="#D97706" strokeWidth="3" />
        {/* Counter */}
        <rect x="30" y="138" width="420" height="62" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
        {/* Stove & Pot */}
        <rect x="310" y="128" width="76" height="10" fill="#334155" rx="2" />
        <rect x="322" y="98" width="52" height="30" rx="5" fill="#94A3B8" />
        <path d="M335,88 Q338,76 333,68 M352,86 Q356,74 350,64 M368,88 Q372,76 367,68" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Mom cooking */}
        <circle cx="285" cy="70" r="18" fill="#FDBA74" />
        <path d="M262,138 C262,98 308,98 308,138 Z" fill="#EC4899" />
        {/* Dad washing vegetables */}
        <circle cx="150" cy="66" r="18" fill="#FED7AA" />
        <path d="M126,138 C126,96 174,96 174,138 Z" fill="#0284C7" />
        {/* Child helping with bowl */}
        <circle cx="215" cy="92" r="14" fill="#FDE68A" />
        <path d="M196,138 C196,110 234,110 234,138 Z" fill="#10B981" />
        {/* Vegetables on counter */}
        <circle cx="190" cy="130" r="7" fill="#EF4444" />
        <circle cx="204" cy="131" r="6" fill="#22C55E" />
        <ellipse cx="222" cy="131" rx="9" ry="5" fill="#F59E0B" />
      </svg>
    </div>
  );
};

function formatTimeMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Ước lượng tần số cơ bản F0 bằng autocorrelation đơn giản trên AudioBuffer
 */
function estimatePitchLevel(buffer: Float32Array, sampleRate: number): number | null {
  let rms = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.015) return null; // Silence

  const minLag = Math.floor(sampleRate / 380);
  const maxLag = Math.floor(sampleRate / 75);
  let bestLag = -1;
  let bestCorr = 0;

  for (let lag = minLag; lag <= maxLag && lag < buffer.length; lag += 1) {
    let corr = 0;
    for (let i = 0; i < buffer.length - lag; i += 2) {
      corr += buffer[i] * buffer[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  if (bestLag <= 0) return null;
  const hz = sampleRate / bestLag;
  // Map ~85..320Hz onto Mandarin 5-level pitch scale (1..5)
  const level = 1 + ((Math.min(320, Math.max(85, hz)) - 85) / 235) * 4;
  return Number(level.toFixed(2));
}

export const HskkSpeakingSimulator: React.FC<HskkSpeakingSimulatorProps> = ({ onBack }) => {
  const [level, setLevel] = useState<HskkLevel>('beginner');
  const [examMode, setExamMode] = useState<SimulatorExamMode>('full');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stage, setStage] = useState<SimulatorStage>('IDLE');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(0);
  const [recordSecondsLeft, setRecordSecondsLeft] = useState(0);
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});
  const [scratchNotes, setScratchNotes] = useState<Record<string, string>>({});
  const [results, setResults] = useState<HskkEvaluationResult[]>([]);

  const recognitionRef = useRef<{ stop?: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pitchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const contoursRef = useRef<Record<string, number[]>>({});
  const stageRef = useRef<SimulatorStage>('IDLE');

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const questions = examMode === 'full' ? HSKK_FULL_EXAMS[level] : HSKK_SAMPLE_QUESTIONS[level];
  const currentQuestion = questions[questionIndex];
  const officialSpec = HSKK_OFFICIAL_SPEC[level];

  const stopHardwareAndTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pitchTimerRef.current) {
      clearInterval(pitchTimerRef.current);
      pitchTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        void audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopHardwareAndTimers();
  }, []);

  const resetSession = (nextLevel = level, nextMode = examMode) => {
    stopHardwareAndTimers();
    setLevel(nextLevel);
    setExamMode(nextMode);
    setQuestionIndex(0);
    setStage('IDLE');
    setResults([]);
    setTranscripts({});
    setScratchNotes({});
    contoursRef.current = {};
  };

  const advanceToNextOrFinish = (qIdx: number, allTranscripts: Record<string, string>) => {
    stopHardwareAndTimers();
    if (qIdx + 1 < questions.length) {
      const nextIdx = qIdx + 1;
      setQuestionIndex(nextIdx);
      startQuestionFlow(nextIdx, allTranscripts);
    } else {
      const graded = questions.map((q) =>
        gradeHskkSpeakingResponse(q, allTranscripts[q.id] || '', contoursRef.current[q.id])
      );
      setResults(graded);
      setStage('COMPLETED');
    }
  };

  const startRecordingWindow = (qIdx: number, currentTranscripts: Record<string, string>) => {
    stopHardwareAndTimers();
    const q = questions[qIdx];
    playBeepTone(880, 240);
    setStage('RECORDING');
    setRecordSecondsLeft(q.recordDurationSeconds);
    contoursRef.current[q.id] = [];

    // 1. SpeechRecognition (zh-CN)
    try {
      const SpeechRec =
        (window as unknown as { SpeechRecognition?: new () => Record<string, unknown> })
          .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => Record<string, unknown> })
          .webkitSpeechRecognition;

      if (SpeechRec) {
        const rec = new SpeechRec() as {
          lang: string;
          continuous: boolean;
          interimResults: boolean;
          onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
          start: () => void;
          stop: () => void;
        };
        rec.lang = 'zh-CN';
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event) => {
          let combined = '';
          for (let i = 0; i < event.results.length; i += 1) {
            combined += event.results[i][0]?.transcript || '';
          }
          setTranscripts((prev) => ({ ...prev, [q.id]: combined }));
        };
        rec.start();
        recognitionRef.current = rec;
      }
    } catch {
      // Fallback sang gõ văn bản nếu trình duyệt không hỗ trợ SpeechRecognition
    }

    // 2. Real Microphone Pitch F0 Sampling (optional hardware stream)
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (stageRef.current !== 'RECORDING') {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          mediaStreamRef.current = stream;
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtx) return;

          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 1024;
          source.connect(analyser);

          const buf = new Float32Array(analyser.fftSize);
          pitchTimerRef.current = setInterval(() => {
            if (stageRef.current !== 'RECORDING') return;
            analyser.getFloatTimeDomainData(buf);
            const pitchLvl = estimatePitchLevel(buf, ctx.sampleRate);
            if (pitchLvl !== null) {
              contoursRef.current[q.id] = [
                ...(contoursRef.current[q.id] || []).slice(-60),
                pitchLvl,
              ];
            }
          }, 160);
        })
        .catch(() => {
          // Bỏ qua nếu không được cấp quyền micro
        });
    }

    let left = q.recordDurationSeconds;
    timerRef.current = setInterval(() => {
      left -= 1;
      setRecordSecondsLeft(Math.max(0, left));
      if (left <= 0) {
        setTranscripts((latest) => {
          advanceToNextOrFinish(qIdx, { ...currentTranscripts, ...latest });
          return latest;
        });
      }
    }, 1000);
  };

  const startPreparingPhase = (qIdx: number, currentTranscripts: Record<string, string>) => {
    stopHardwareAndTimers();
    const q = questions[qIdx];
    const prepSec = q.prepDurationSeconds || 0;
    if (prepSec <= 0) {
      startRecordingWindow(qIdx, currentTranscripts);
      return;
    }

    setStage('PREPARING');
    setPrepSecondsLeft(prepSec);
    let left = prepSec;
    timerRef.current = setInterval(() => {
      left -= 1;
      setPrepSecondsLeft(Math.max(0, left));
      if (left <= 0) {
        startRecordingWindow(qIdx, currentTranscripts);
      }
    }, 1000);
  };

  const startQuestionFlow = (qIdx: number, currentTranscripts: Record<string, string> = transcripts) => {
    stopHardwareAndTimers();
    const q = questions[qIdx];
    setStage('PLAYING_PROMPT');

    try {
      speakChinese(q.promptZh, q.taskType === 'read_aloud' ? 0.95 : 0.9);
    } catch {
      // ignore speech synthesis issues
    }

    const waitMs = q.taskType === 'read_aloud' ? 1400 : 2400;
    setTimeout(() => {
      if (stageRef.current !== 'PLAYING_PROMPT') return;
      if (q.prepDurationSeconds && q.prepDurationSeconds > 0) {
        startPreparingPhase(qIdx, currentTranscripts);
      } else {
        startRecordingWindow(qIdx, currentTranscripts);
      }
    }, waitMs);
  };

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                stopHardwareAndTimers();
                onBack();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại HSK
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Phòng thi nói HSKK (Sơ · Trung · Cao cấp)
            </h2>
            <p className="text-xs text-slate-500">
              Chuẩn phòng thi thật: Phát đề mẫu → Chuẩn bị &amp; Nháp ý → Tiếng Beep → Thu âm kèm đo cao độ F0.
            </p>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
          {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => resetSession(lvl, examMode)}
              className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                level === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {HSKK_LEVEL_META[lvl].title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switcher + Official Spec Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-extrabold ${HSKK_LEVEL_META[level].badgeClass}`}>
              {HSKK_LEVEL_META[level].title}
            </span>
            <p className="text-xs text-slate-500 mt-1">{HSKK_LEVEL_META[level].subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => resetSession(level, 'full')}
              className={`rounded-lg px-3 py-1.5 cursor-pointer transition ${
                examMode === 'full' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Thi trọn bộ chuẩn ({officialSpec.totalQuestions} câu)
            </button>
            <button
              type="button"
              onClick={() => resetSession(level, 'quick')}
              className={`rounded-lg px-3 py-1.5 cursor-pointer transition ${
                examMode === 'quick' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Luyện nhanh 3 phần (3 câu)
            </button>
          </div>
        </div>

        {/* 3 Official Parts Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {officialSpec.parts.map((part) => (
            <div key={part.partNumber} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="font-black text-slate-800">
                Phần {part.partNumber}: {part.nameCn}
              </div>
              <div className="text-slate-600 mt-0.5">
                {part.nameVi} · <strong>{part.count} câu</strong> ({part.secondsPerItem}s/câu)
              </div>
            </div>
          ))}
        </div>

        {stage === 'IDLE' && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => startQuestionFlow(0)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer transition"
            >
              <Play className="w-4 h-4" />
              Bắt đầu thi nói ({questions.length} câu)
            </button>
          </div>
        )}
      </div>

      {/* Active Simulator */}
      {stage !== 'IDLE' && stage !== 'COMPLETED' && currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-extrabold text-indigo-700">
              Câu {questionIndex + 1}/{questions.length} · {currentQuestion.partLabel}
            </span>

            {stage === 'PLAYING_PROMPT' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Đang phát đề mẫu...
              </span>
            ) : stage === 'PREPARING' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                <Clock className="w-3.5 h-3.5" />
                Thời gian chuẩn bị · Còn {formatTimeMMSS(prepSecondsLeft)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800 animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                Đang thu âm · Còn {formatTimeMMSS(recordSecondsLeft)}
              </span>
            )}
          </div>

          {/* Picture Scene when taskType === 'picture_description' */}
          {currentQuestion.taskType === 'picture_description' && (
            <PictureSceneSvg sceneKey={currentQuestion.sceneKey} />
          )}

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {(currentQuestion.taskType === 'listen_and_repeat' ||
                currentQuestion.taskType === 'listen_and_answer_short') &&
              stage === 'RECORDING'
                ? currentQuestion.taskType === 'listen_and_answer_short'
                  ? '🎧 Hãy trả lời nhanh câu hỏi bạn vừa nghe bằng tiếng Trung...'
                  : '🎧 Hãy lặp lại / kể lại nội dung tiếng Trung bạn vừa nghe...'
                : currentQuestion.promptZh}
            </div>

            {currentQuestion.imageHint && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <strong>Chi tiết tranh:</strong> {currentQuestion.imageHint}
              </div>
            )}
            <div className="text-xs text-slate-500">{currentQuestion.promptVi}</div>
          </div>

          {/* Preparation Phase Controls + Scratchpad */}
          {stage === 'PREPARING' ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Giấy nháp dàn ý nhanh (Không tính điểm, chỉ dùng khi chuẩn bị):</span>
              </label>
              <textarea
                rows={4}
                value={scratchNotes[currentQuestion.id] || ''}
                onChange={(e) =>
                  setScratchNotes((prev) => ({
                    ...prev,
                    [currentQuestion.id]: e.target.value,
                  }))
                }
                placeholder="Ghi nhanh từ khóa: 首先..., 其次..., 因为..., 最后..."
                className="w-full rounded-2xl border border-amber-300 bg-amber-50/40 p-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => startRecordingWindow(questionIndex, transcripts)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white cursor-pointer shadow-xs"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Sẵn sàng — Phát BEEP &amp; Nói ngay</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Live Transcript + Fallback Input */}
              <div className="space-y-1.5">
                {scratchNotes[currentQuestion.id] && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 mb-2">
                    <strong>Ghi chú nháp của bạn:</strong> {scratchNotes[currentQuestion.id]}
                  </div>
                )}
                <label className="text-xs font-bold text-slate-600">
                  Nội dung giọng nói nhận diện được (hoặc gõ dự phòng nếu không dùng Micro):
                </label>
                <textarea
                  rows={3}
                  value={transcripts[currentQuestion.id] || ''}
                  onChange={(e) =>
                    setTranscripts((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                  placeholder="Hệ thống tự ghi nhận tiếng Trung khi bạn nói..."
                  className="w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => advanceToNextOrFinish(questionIndex, transcripts)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  {questionIndex + 1 < questions.length ? 'Xong câu này -> Câu tiếp' : 'Kết thúc & Chấm điểm'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results View */}
      {stage === 'COMPLETED' && (
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Kết quả chấm điểm HSKK ({avgScore}/100 điểm · {avgScore >= 60 ? 'Đạt chuẩn ≥ 60đ' : 'Chưa đạt < 60đ'})
                </h3>
                <p className="text-xs text-slate-500">
                  Đánh giá đủ 3 phần thi chuẩn HSKK: Lặp lại / Đọc / Trả lời nhanh / Mô tả tranh / Nghị luận.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => resetSession(level, examMode)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Thi lại cấp độ này
            </button>
          </div>

          <div className="space-y-3">
            {results.map((res, idx) => (
              <div
                key={res.questionId}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">
                    Câu {idx + 1}: {questions[idx]?.partLabel}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800">
                    {res.score}/100đ
                  </span>
                </div>
                <div className="text-slate-500">
                  <strong>Đề bài:</strong> {questions[idx]?.promptZh}
                </div>
                <div className="text-slate-700">
                  <strong>Bạn đã nói:</strong> {res.transcript || '(Chưa có dữ liệu)'}
                </div>
                <div className="text-indigo-800 font-medium">{res.feedbackVi}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
