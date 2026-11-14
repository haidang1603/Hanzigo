import React, { useEffect, useMemo, useState } from 'react';
import { Headphones, CheckCircle2, XCircle, Crosshair, Award, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getBuiltInListeningTracks,
  listListeningTracks,
  recordListeningProgress,
  type ListeningTrack,
} from '../../services/listeningStudioService.ts';
import { usePrecisionAudioPlayer } from './usePrecisionAudioPlayer.ts';
import { StudioAudioDeck } from './StudioAudioDeck.tsx';
import { SyncedTranscriptView } from './SyncedTranscriptView.tsx';
import { SentenceDictationWorkbench } from './SentenceDictationWorkbench.tsx';

interface ChineseListeningStudioProps {
  user?: { id?: string | null } | null;
}

const CATEGORY_LABELS: Record<ListeningTrack['category'], string> = {
  dialogue: 'Hội thoại',
  podcast: 'Podcast',
  news: 'Tin tức',
  hsk_mock: 'Đề thi HSK',
};

export const ChineseListeningStudio: React.FC<ChineseListeningStudioProps> = ({ user }) => {
  const [tracks, setTracks] = useState<ListeningTrack[]>(() => getBuiltInListeningTracks());
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    () => getBuiltInListeningTracks()[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'transcript' | 'dictation'>('transcript');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);

  useEffect(() => {
    let active = true;
    listListeningTracks().then((items) => {
      if (!active || items.length === 0) return;
      setTracks(items);
      setSelectedTrackId((prev) => prev || items[0].id);
    });
    return () => {
      active = false;
    };
  }, []);

  const currentTrack = useMemo(() => {
    return tracks.find((t) => t.id === selectedTrackId) || tracks[0];
  }, [tracks, selectedTrackId]);

  const {
    audioRef,
    hasExternalAudio,
    isPlaying,
    currentTimeMs,
    totalDurationMs,
    activeSegmentIndex,
    playbackRate,
    loopMode,
    abRange,
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
  } = usePrecisionAudioPlayer({
    audioUrl: currentTrack?.audio_url || '',
    segments: currentTrack?.transcript_segments || [],
    durationSeconds: currentTrack?.duration_seconds || 30,
  });

  if (!currentTrack) return null;

  const currentSegment =
    currentTrack.transcript_segments[activeSegmentIndex] ||
    currentTrack.transcript_segments[0];

  const questions = currentTrack.listening_questions || [];
  const quizCorrectCount = questions.reduce(
    (acc, q) => acc + (quizAnswers[q.id] === q.correct_index ? 1 : 0),
    0
  );
  const quizScore =
    questions.length > 0 ? Math.round((quizCorrectCount / questions.length) * 100) : 0;

  const handleSelectTrack = (trackId: string) => {
    pause();
    setSelectedTrackId(trackId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    seekToMs(0, false);
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    await recordListeningProgress({
      user,
      track: currentTrack,
      dictationAccuracy: 0,
      completedSegments: [],
      quizScore,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Track Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Chinese Listening Studio</h1>
              <p className="text-xs text-slate-500">
                Đồng bộ transcript 60fps, lặp đoạn A-B &amp; luyện nghe chép chính tả từng chữ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              Tốc độ gốc: <strong>{currentTrack.speech_rate_wpm} chữ/phút</strong>
            </div>
            <button
              type="button"
              onClick={() => setShowTrackList((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition"
            >
              {showTrackList ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Thu gọn danh sách
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Chọn bài nghe ({tracks.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Compact Active Track Bar when collapsed */}
        {!showTrackList ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-800">
                HSK {currentTrack.hsk_level}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {CATEGORY_LABELS[currentTrack.category]}
              </span>
              <span className="text-sm font-bold text-slate-900 truncate">
                {currentTrack.title_zh}
              </span>
              <span className="text-xs text-slate-600 truncate">
                — {currentTrack.title_vi}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tracks.map((trk) => {
              const active = trk.id === currentTrack.id;
              return (
                <button
                  key={trk.id}
                  type="button"
                  onClick={() => {
                    handleSelectTrack(trk.id);
                    setShowTrackList(false);
                  }}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      HSK {trk.hsk_level}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {CATEGORY_LABELS[trk.category]}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{trk.title_zh}</div>
                  <div className="text-xs text-slate-500">{trk.title_vi}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden HTMLAudioElement for external audio URLs */}
      {hasExternalAudio && (
        <audio ref={audioRef} src={currentTrack.audio_url} preload="metadata" />
      )}

      {/* Audio Deck */}
      <StudioAudioDeck
        segments={currentTrack.transcript_segments}
        isPlaying={isPlaying}
        currentTimeMs={currentTimeMs}
        totalDurationMs={totalDurationMs}
        activeSegmentIndex={activeSegmentIndex}
        playbackRate={playbackRate}
        loopMode={loopMode}
        abRange={abRange}
        onTogglePlay={togglePlay}
        onPrevSegment={prevSegment}
        onNextSegment={nextSegment}
        onReplaySegment={replayCurrentSegment}
        onSeekMs={(ms) => seekToMs(ms)}
        onSetPlaybackRate={setPlaybackRate}
        onSetLoopMode={setLoopMode}
        onSetAbRange={setAbRange}
      />

      {/* Mode Switcher: Transcript vs Dictation */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'transcript'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Transcript đồng bộ &amp; Che mờ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dictation')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === 'dictation'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Nghe chép chính tả (Dictation)
        </button>
      </div>

      {activeTab === 'transcript' ? (
        <SyncedTranscriptView
          segments={currentTrack.transcript_segments}
          activeSegmentIndex={activeSegmentIndex}
          hskLevel={currentTrack.hsk_level}
          user={user}
          onSelectSegment={(idx) => jumpToSegment(idx)}
        />
      ) : (
        currentSegment && (
          <SentenceDictationWorkbench
            track={currentTrack}
            segment={currentSegment}
            totalSegments={currentTrack.transcript_segments.length}
            user={user}
            onReplayCurrent={replayCurrentSegment}
            onNextSegment={nextSegment}
          />
        )
      )}

      {/* HSK Listening Comprehension Questions */}
      {questions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Câu hỏi nghe hiểu chuẩn HSK</h3>
            {quizSubmitted && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                <Award className="w-4 h-4 text-emerald-600" />
                {quizCorrectCount}/{questions.length} ({quizScore}%)
              </span>
            )}
          </div>

          <div className="space-y-3">
            {questions.map((q, qIdx) => {
              const picked = quizAnswers[q.id];
              const isCorrect = picked === q.correct_index;

              return (
                <div key={q.id} className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                  <p className="text-sm font-semibold text-slate-900">
                    Câu {qIdx + 1}: {q.question_vi}
                  </p>
                  <p className="text-xs text-slate-500">{q.question_zh}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Array.isArray(q.options) ? q.options : Object.values(q.options || {})).map((opt, optIdx) => {
                      const selected = picked === optIdx;
                      let cls = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';
                      if (quizSubmitted) {
                        if (optIdx === q.correct_index) {
                          cls = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                        } else if (selected) {
                          cls = 'bg-rose-50 border-rose-300 text-rose-800';
                        }
                      } else if (selected) {
                        cls = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
                      }

                      return (
                        <button
                          key={`${q.id}-${optIdx}`}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`text-left rounded-xl border px-3 py-2 text-sm transition ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>{q.explanation_vi}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('transcript');
                          jumpToSegment(q.evidence_segment_index);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-100 hover:bg-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-900"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        Nghe câu dẫn chứng #{q.evidence_segment_index + 1}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            {quizSubmitted ? (
              <button
                type="button"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Làm lại
              </button>
            ) : (
              <button
                type="button"
                disabled={Object.keys(quizAnswers).length < questions.length}
                onClick={handleSubmitQuiz}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 px-4 py-2 text-xs font-semibold text-white"
              >
                Nộp bài nghe hiểu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
