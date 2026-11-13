import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Mic,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  gradeHskkSpeakingResponse,
  HSKK_LEVEL_META,
  HSKK_SAMPLE_QUESTIONS,
  playBeepTone,
  type HskkEvaluationResult,
  type HskkLevel,
} from './hskkEngine.ts';

type SimulatorStage = 'IDLE' | 'PLAYING_PROMPT' | 'RECORDING' | 'COMPLETED';

interface HskkSpeakingSimulatorProps {
  onBack?: () => void;
}

export const HskkSpeakingSimulator: React.FC<HskkSpeakingSimulatorProps> = ({ onBack }) => {
  const [level, setLevel] = useState<HskkLevel>('beginner');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stage, setStage] = useState<SimulatorStage>('IDLE');
  const [recordSecondsLeft, setRecordSecondsLeft] = useState(0);
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});
  const [results, setResults] = useState<HskkEvaluationResult[]>([]);

  const recognitionRef = useRef<{ stop?: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageRef = useRef<SimulatorStage>('IDLE');

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const questions = HSKK_SAMPLE_QUESTIONS[level];
  const currentQuestion = questions[questionIndex];

  const stopRecordingHardware = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    recognitionRef.current = null;
  };

  useEffect(() => {
    return () => stopRecordingHardware();
  }, []);

  const handleSelectLevel = (newLevel: HskkLevel) => {
    stopRecordingHardware();
    setLevel(newLevel);
    setQuestionIndex(0);
    setStage('IDLE');
    setResults([]);
    setTranscripts({});
  };

  const advanceToNextOrFinish = (qIdx: number, allTranscripts: Record<string, string>) => {
    stopRecordingHardware();
    if (qIdx + 1 < questions.length) {
      const nextIdx = qIdx + 1;
      setQuestionIndex(nextIdx);
      startQuestionFlow(nextIdx, allTranscripts);
    } else {
      const graded = questions.map((q) =>
        gradeHskkSpeakingResponse(q, allTranscripts[q.id] || '')
      );
      setResults(graded);
      setStage('COMPLETED');
    }
  };

  const startRecordingWindow = (qIdx: number, currentTranscripts: Record<string, string>) => {
    const q = questions[qIdx];
    playBeepTone(880, 240);
    setStage('RECORDING');
    setRecordSecondsLeft(q.recordDurationSeconds);

    // Khởi động Web Speech API (zh-CN) nếu trình duyệt hỗ trợ
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
      // Fallback sang nhập văn bản thủ công nếu không có quyền mic
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

  const startQuestionFlow = (qIdx: number, currentTranscripts: Record<string, string> = transcripts) => {
    stopRecordingHardware();
    const q = questions[qIdx];
    setStage('PLAYING_PROMPT');

    const promptText = q.taskType === 'picture_description' ? q.promptZh : q.promptZh;
    try {
      speakChinese(promptText, 0.9);
    } catch {
      // ignore speech errors
    }

    // Sau khi phát câu mẫu (~2.5s), tự động phát Beep và bật thu âm
    setTimeout(() => {
      if (stageRef.current === 'PLAYING_PROMPT') {
        startRecordingWindow(qIdx, currentTranscripts);
      }
    }, 2400);
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
                stopRecordingHardware();
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
              Luồng tự động chuẩn phòng thi: Phát đề mẫu → Tiếng Beep → Thu âm đếm ngược → Chuyển câu tự động.
            </p>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
          {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleSelectLevel(lvl)}
              className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                level === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {HSKK_LEVEL_META[lvl].title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Level Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-extrabold ${HSKK_LEVEL_META[level].badgeClass}`}>
            {HSKK_LEVEL_META[level].title}
          </span>
          <p className="text-xs text-slate-500 mt-1">{HSKK_LEVEL_META[level].subtitle}</p>
        </div>

        {stage === 'IDLE' && (
          <button
            type="button"
            onClick={() => startQuestionFlow(0)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer transition"
          >
            <Play className="w-4 h-4" />
            Bắt đầu thi nói ({questions.length} câu)
          </button>
        )}
      </div>

      {/* Active Simulator */}
      {stage !== 'IDLE' && stage !== 'COMPLETED' && currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-extrabold text-indigo-700">
              Câu {questionIndex + 1}/{questions.length} · {currentQuestion.partLabel}
            </span>

            {stage === 'PLAYING_PROMPT' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Đang phát đề mẫu... Chuẩn bị nghe tiếng Beep
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800 animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                Đang thu âm · Còn {recordSecondsLeft}s
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="text-lg font-bold text-slate-900">
              {currentQuestion.taskType === 'listen_and_repeat' && stage === 'RECORDING'
                ? '🎧 Hãy lặp lại câu tiếng Trung bạn vừa nghe...'
                : currentQuestion.promptZh}
            </div>
            {currentQuestion.imageHint && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <strong>Gợi ý bối cảnh tranh:</strong> {currentQuestion.imageHint}
              </div>
            )}
            <div className="text-xs text-slate-500">{currentQuestion.promptVi}</div>
          </div>

          {/* Live Transcript + Fallback Input */}
          <div className="space-y-1.5">
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
                  Kết quả chấm điểm HSKK ({avgScore}/100 điểm)
                </h3>
                <p className="text-xs text-slate-500">
                  Đánh giá thanh điệu, độ khớp chữ Hán và mạch diễn đạt theo chuẩn HSKK.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectLevel(level)}
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
                <div className="text-slate-600">
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
