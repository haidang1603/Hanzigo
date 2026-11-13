import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Send,
} from 'lucide-react';
import {
  getSavedDeckForWriting,
  getWritingHistoryAndMastery,
  WritingQueueManager,
  type HanziCharacterMasteryRecord,
  type HanziWritingLogRecord,
} from '../../services/writingStudioService.ts';
import HanziCanvasStage from './HanziCanvasStage.tsx';
import StrokeBreakdownStrip from './StrokeBreakdownStrip.tsx';
import { useHanziWriterStudio } from './useHanziWriterStudio.ts';
import WritingHistoryAnalytics from './WritingHistoryAnalytics.tsx';

export interface HanziWritingStudioProps {
  user?: { id?: string | null } | null;
  initialText?: string;
}

export default function HanziWritingStudio({
  user = null,
  initialText = '图书馆',
}: HanziWritingStudioProps) {
  const [queueInput, setQueueInput] = useState(initialText);
  const queueRef = useMemo(() => new WritingQueueManager(initialText), [initialText]);
  const [queueVersion, setQueueVersion] = useState(0);

  const [logs, setLogs] = useState<HanziWritingLogRecord[]>([]);
  const [masteryList, setMasteryList] = useState<HanziCharacterMasteryRecord[]>([]);
  const [mostMistaken, setMostMistaken] = useState<HanziCharacterMasteryRecord[]>([]);

  const refreshHistory = useCallback(() => {
    void getWritingHistoryAndMastery(user).then((res) => {
      setLogs(res.logs);
      setMasteryList(res.masteryList);
      setMostMistaken(res.mostMistakenCharacters);
    });
  }, [user]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const queueItems = useMemo(() => {
    void queueVersion;
    return queueRef.getItems();
  }, [queueRef, queueVersion]);

  const currentItem = useMemo(() => {
    void queueVersion;
    return queueRef.getCurrentItem();
  }, [queueRef, queueVersion]);

  const progress = useMemo(() => {
    void queueVersion;
    return queueRef.getProgress();
  }, [queueRef, queueVersion]);

  const activeChar = currentItem?.character || '字';

  const studio = useHanziWriterStudio({
    character: activeChar,
    word: currentItem?.word,
    sourceVocabId: currentItem?.vocabId ?? null,
    user,
    onAttemptRecorded: () => {
      refreshHistory();
    },
  });

  const handleLoadInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueInput.trim()) return;
    queueRef.load(queueInput.trim());
    setQueueVersion((v) => v + 1);
  };

  const handleLoadSavedDeck = () => {
    const deck = getSavedDeckForWriting(user);
    if (deck.length === 0) return;
    queueRef.load(deck);
    setQueueVersion((v) => v + 1);
  };

  const handlePracticeChar = (char: string) => {
    setQueueInput(char);
    queueRef.load(char);
    setQueueVersion((v) => v + 1);
  };

  return (
    <section aria-label="Hanzi Writing Studio" className="space-y-6">
      {/* Header & Queue Loader */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] text-[11px] font-bold uppercase tracking-wider">
              <PenTool size={12} />
              <span>Hanzi Writing Studio</span>
            </div>
            <h1 className="text-xl font-black text-[#243447] dark:text-white mt-1">
              Phòng Luyện Viết Chữ Hán & Phân Tích Nét
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLoadSavedDeck}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-xs font-bold text-[#243447] dark:text-white cursor-pointer inline-flex items-center gap-1.5"
          >
            <Bookmark size={14} className="text-[#E85D3F]" />
            <span>Nạp từ Bộ từ đã lưu</span>
          </button>
        </div>

        {/* Word / Sentence Queue Form */}
        <form onSubmit={handleLoadInput} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={queueInput}
            onChange={(e) => setQueueInput(e.target.value)}
            placeholder="Nhập chữ Hán, từ ghép (图书馆) hoặc cả câu để luyện viết nối tiếp..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#0F172A] border border-[#EFE4D6] dark:border-[#2B3A4F] text-sm font-medium text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#d44d30] text-white text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Send size={14} />
            <span>Nạp hàng đợi</span>
          </button>
        </form>

        {/* Queue Chips + Prev/Next */}
        {queueItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {queueItems.map((item, idx) => {
                const isActive = idx === queueRef.getCursor();
                return (
                  <button
                    key={`${item.character}-${idx}`}
                    type="button"
                    onClick={() => {
                      queueRef.jumpTo(idx);
                      setQueueVersion((v) => v + 1);
                    }}
                    className={`w-9 h-9 rounded-xl text-base font-extrabold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#E85D3F] text-white shadow-sm scale-105'
                        : 'bg-[#FAF6F0] dark:bg-[#0F172A] text-[#243447] dark:text-white border border-[#EFE4D6] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {item.character}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#748092]">
              <span>
                {progress.current}/{progress.total} ({progress.percent}%)
              </span>
              <button
                type="button"
                onClick={() => {
                  queueRef.prev();
                  setQueueVersion((v) => v + 1);
                }}
                disabled={progress.current <= 1}
                aria-label="Chữ trước"
                className="p-1.5 rounded-lg bg-[#FAF6F0] dark:bg-[#0F172A] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  queueRef.next();
                  setQueueVersion((v) => v + 1);
                }}
                disabled={progress.current >= progress.total}
                aria-label="Chữ tiếp theo"
                className="p-1.5 rounded-lg bg-[#FAF6F0] dark:bg-[#0F172A] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Split: Canvas Stage + Breakdown (Left) & Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          <HanziCanvasStage
            character={activeChar}
            word={currentItem?.word}
            pinyin={currentItem?.pinyin}
            meaning={currentItem?.meaning}
            containerRef={studio.containerRef}
            mode={studio.mode}
            onModeChange={studio.setMode}
            gridType={studio.gridType}
            onGridTypeChange={studio.setGridType}
            leniency={studio.leniency}
            onLeniencyChange={studio.setLeniency}
            strokeAnimationSpeed={studio.strokeAnimationSpeed}
            onSpeedChange={studio.setStrokeAnimationSpeed}
            mistakeCount={studio.mistakeCount}
            completedStrokes={studio.completedStrokes}
            totalStrokes={studio.strokeData?.strokes.length ?? 0}
            lastAccuracy={studio.lastAccuracy}
            isQuizComplete={studio.isQuizComplete}
            onAnimate={studio.animateCharacter}
            onRestart={studio.startQuiz}
            onHint={studio.hintCurrentStroke}
            onPlayAudio={studio.playAudio}
          />

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
            <StrokeBreakdownStrip
              character={activeChar}
              strokeData={studio.strokeData}
              completedStrokes={studio.completedStrokes}
              mistakenStrokeIndices={studio.mistakenStrokeIndices}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <WritingHistoryAnalytics
            logs={logs}
            masteryList={masteryList}
            mostMistakenCharacters={mostMistaken}
            onPracticeCharacter={handlePracticeChar}
          />
        </div>
      </div>
    </section>
  );
}

