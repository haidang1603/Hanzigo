import React, { useEffect, useMemo, useState } from 'react';
import { Mic, Square, Volume2, Sparkles, Activity } from 'lucide-react';
import {
  evaluatePronunciationAttempt,
  getBuiltInPronunciationDrills,
  listPronunciationDrills,
  savePronunciationAttempt,
  type PronunciationAttemptResult,
  type PronunciationCategory,
  type PronunciationDrill,
} from '../../services/pronunciationLabService.ts';
import { applyMandarinToneSandhi } from '../../utils/toneSandhiEngine.ts';
import { speakChinese } from '../../utils/audio.js';
import { usePitchContourAnalyzer } from './usePitchContourAnalyzer.ts';
import { ToneContourCanvas } from './ToneContourCanvas.tsx';
import { SyllableDiagnosticCard } from './SyllableDiagnosticCard.tsx';
import { TonePairMatrixTrainer } from './TonePairMatrixTrainer.tsx';

interface ChinesePronunciationLabProps {
  user?: { id?: string | null } | null;
}

const CATEGORY_LABELS: Record<'all' | PronunciationCategory, string> = {
  all: 'Tất cả',
  tone_sandhi: 'Biến điệu (Sandhi)',
  initials_finals: 'Thanh mẫu / Vận mẫu',
  minimal_pairs: 'Cặp âm dễ nhầm',
  tone_pairs: 'Cặp thanh điệu',
  sentence_shadowing: 'Đọc đuổi (Shadowing)',
};

export const ChinesePronunciationLab: React.FC<ChinesePronunciationLabProps> = ({ user }) => {
  const [drills, setDrills] = useState<PronunciationDrill[]>(() =>
    getBuiltInPronunciationDrills()
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | PronunciationCategory>('all');
  const [selectedDrillId, setSelectedDrillId] = useState<string>(
    () => getBuiltInPronunciationDrills()[0]?.id || ''
  );
  const [attemptResult, setAttemptResult] = useState<PronunciationAttemptResult | null>(null);

  const analyzer = usePitchContourAnalyzer();

  useEffect(() => {
    let active = true;
    listPronunciationDrills().then((loaded) => {
      if (!active || loaded.length === 0) return;
      setDrills(loaded);
      setSelectedDrillId((prev) => prev || loaded[0].id);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredDrills = useMemo(() => {
    if (categoryFilter === 'all') return drills;
    return drills.filter((d) => d.category === categoryFilter);
  }, [drills, categoryFilter]);

  const currentDrill = useMemo(() => {
    return (
      filteredDrills.find((d) => d.id === selectedDrillId) ||
      filteredDrills[0] ||
      drills[0]
    );
  }, [filteredDrills, selectedDrillId, drills]);

  const sandhiInfo = useMemo(() => {
    if (!currentDrill) return null;
    return applyMandarinToneSandhi(currentDrill.hanzi, currentDrill.pinyin_underlying);
  }, [currentDrill]);

  if (!currentDrill) return null;

  const handleToggleRecord = async () => {
    if (analyzer.isRecording) {
      const recorded = analyzer.stopRecording();
      if (recorded.length > 0) {
        const res = evaluatePronunciationAttempt({
          drill: currentDrill,
          userContour: recorded,
        });
        setAttemptResult(res);
        await savePronunciationAttempt({ user, drill: currentDrill, result: res });
      }
    } else {
      setAttemptResult(null);
      await analyzer.startRecording();
    }
  };

  const handleSimulateAttempt = async () => {
    // Generate a realistic contour near reference with slight variation for instant preview without mic
    const simulated = currentDrill.reference_pitch_contour.map((v, idx) =>
      Math.max(10, Math.min(95, v + (idx % 3 === 0 ? -6 : 4)))
    );
    analyzer.setSimulatedContour(simulated);
    const res = evaluatePronunciationAttempt({
      drill: currentDrill,
      userContour: simulated,
    });
    setAttemptResult(res);
    await savePronunciationAttempt({ user, drill: currentDrill, result: res });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Category Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Chinese Pronunciation Lab</h1>
              <p className="text-xs text-slate-500">
                Chuẩn hóa Pinyin, biến điệu tiếng Trung (Tone Sandhi) &amp; biểu đồ cao độ giọng nói
              </p>
            </div>
          </div>

          {analyzer.isRecording && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {analyzer.livePitchHz ? `${analyzer.livePitchHz} Hz (Bậc ${analyzer.liveChaoLevel})` : 'Đang lắng nghe...'}
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as Array<'all' | PronunciationCategory>).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat);
                setAttemptResult(null);
                analyzer.resetContour();
              }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Drill Pills */}
        <div className="flex flex-wrap gap-2">
          {filteredDrills.map((dr) => {
            const active = dr.id === currentDrill.id;
            return (
              <button
                key={dr.id}
                type="button"
                onClick={() => {
                  setSelectedDrillId(dr.id);
                  setAttemptResult(null);
                  analyzer.resetContour();
                }}
                className={`rounded-xl border px-3 py-2 text-left transition ${
                  active
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-bold">{dr.hanzi}</div>
                <div className="text-[11px] text-slate-500">{dr.pinyin_surface}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Drill Card + Underlying vs Surface Sandhi */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-4xl font-bold text-slate-900">{currentDrill.hanzi}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                HSK {currentDrill.hsk_level}
              </span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                {currentDrill.phonetic_focus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-500">
                Thanh gốc: <strong>{currentDrill.pinyin_underlying}</strong>
              </span>
              <span className="text-emerald-700">
                Đọc thực tế: <strong>{currentDrill.pinyin_surface}</strong>
              </span>
              <span className="text-slate-600">— {currentDrill.meaning_vi}</span>
            </div>

            {sandhiInfo?.hasSandhi && (
              <div className="flex flex-wrap gap-2 pt-1">
                {sandhiInfo.syllables
                  .filter((s) => s.sandhiApplied && s.sandhiRule)
                  .map((s, idx) => (
                    <span
                      key={`${s.char}-${idx}`}
                      className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg"
                    >
                      {s.sandhiRule}
                    </span>
                  ))}
              </div>
            )}

            <p className="text-xs text-slate-600 pt-1">
              <strong>Mẹo khẩu hình:</strong> {currentDrill.articulation_tip_vi}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => speakChinese(currentDrill.hanzi, 0.78)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              Nghe mẫu chuẩn
            </button>

            <button
              type="button"
              onClick={handleToggleRecord}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition ${
                analyzer.isRecording
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {analyzer.isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  Dừng &amp; Chấm điểm
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  Thu âm giọng đọc
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulateAttempt}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Thử chấm mẫu
            </button>
          </div>
        </div>

        {analyzer.micError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
            {analyzer.micError}
          </div>
        )}
      </div>

      {/* Pitch Contour Canvas */}
      <ToneContourCanvas
        referenceContour={currentDrill.reference_pitch_contour}
        userContour={analyzer.userContour}
        overallScore={attemptResult?.overall_score ?? null}
      />

      {/* Syllable Diagnostic Card */}
      {attemptResult && (
        <SyllableDiagnosticCard
          breakdown={attemptResult.syllable_breakdown}
          overallScore={attemptResult.overall_score}
          toneScore={attemptResult.tone_score}
          initialFinalScore={attemptResult.initial_final_score}
          fluencyScore={attemptResult.fluency_score}
        />
      )}

      {/* 20-Combination Tone Pair Matrix */}
      <TonePairMatrixTrainer />
    </div>
  );
};

