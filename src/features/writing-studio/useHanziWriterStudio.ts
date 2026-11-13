import { useCallback, useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import {
  calculateStrokeAccuracy,
  recordWritingAttempt,
  type GridType,
  type HanziCharacterMasteryRecord,
  type HanziWritingLogRecord,
  type StrokeAccuracyResult,
  type WritingMode,
} from '../../services/writingStudioService.ts';
import { speakChinese } from '../../utils/audio.js';

export interface CharacterStrokeData {
  strokes: string[];
  medians: number[][][];
}

export interface UseHanziWriterStudioOptions {
  character: string;
  word?: string;
  sourceVocabId?: string | null;
  user?: { id?: string | null } | null;
  stageSize?: number;
  onAttemptRecorded?: (result: {
    log: HanziWritingLogRecord;
    mastery: HanziCharacterMasteryRecord;
  }) => void;
}

export function useHanziWriterStudio({
  character,
  word = '',
  sourceVocabId = null,
  user = null,
  stageSize = 360,
  onAttemptRecorded,
}: UseHanziWriterStudioOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
  const strokeMistakesRef = useRef<Record<number, number>>({});
  const quizStartTimeRef = useRef<number>(Date.now());

  const [mode, setMode] = useState<WritingMode>('guided');
  const [gridType, setGridType] = useState<GridType>('mizige');
  const [leniency, setLeniency] = useState<number>(1.0);
  const [strokeAnimationSpeed, setStrokeAnimationSpeed] = useState<number>(1.0);
  const [strokeData, setStrokeData] = useState<CharacterStrokeData | null>(null);
  const [isLoadingChar, setIsLoadingChar] = useState<boolean>(false);
  const [mistakenStrokeIndices, setMistakenStrokeIndices] = useState<number[]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [completedStrokes, setCompletedStrokes] = useState<number>(0);
  const [activeStrokeIndex, setActiveStrokeIndex] = useState<number>(0);
  const [lastAccuracy, setLastAccuracy] = useState<StrokeAccuracyResult | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const playAudio = useCallback(() => {
    const text = word || character;
    if (text) {
      void speakChinese(text, 0.85);
    }
  }, [word, character]);

  const startQuiz = useCallback(() => {
    const writer = writerRef.current;
    if (!writer) return;

    strokeMistakesRef.current = {};
    quizStartTimeRef.current = Date.now();
    setMistakenStrokeIndices([]);
    setMistakeCount(0);
    setCompletedStrokes(0);
    setActiveStrokeIndex(0);
    setLastAccuracy(null);
    setIsQuizComplete(false);

    if (mode === 'dictation') {
      playAudio();
    }

    writer.quiz({
      leniency,
      showHintAfterMisses: 3,
      highlightOnComplete: true,
      onMistake: (strokeDataInfo: { strokeNum: number }) => {
        const sIdx = strokeDataInfo.strokeNum;
        const prev = strokeMistakesRef.current[sIdx] ?? 0;
        strokeMistakesRef.current[sIdx] = prev + 1;

        setMistakeCount((c) => c + 1);
        setMistakenStrokeIndices((prevArr) =>
          prevArr.includes(sIdx) ? prevArr : [...prevArr, sIdx]
        );
      },
      onCorrectStroke: (strokeDataInfo: { strokeNum: number; strokesRemaining: number }) => {
        setCompletedStrokes(strokeDataInfo.strokeNum + 1);
        setActiveStrokeIndex(
          strokeDataInfo.strokesRemaining > 0 ? strokeDataInfo.strokeNum + 1 : strokeDataInfo.strokeNum
        );
      },
      onComplete: (summaryData: { totalMistakes: number }) => {
        const totalStrokes = strokeData?.strokes.length || completedStrokes || 1;
        const durationMs = Date.now() - quizStartTimeRef.current;
        const computed = calculateStrokeAccuracy({
          mode,
          totalStrokes,
          strokeMistakes: strokeMistakesRef.current,
        });

        setLastAccuracy({
          ...computed,
          totalMistakes: Math.max(computed.totalMistakes, summaryData.totalMistakes ?? 0),
        });
        setIsQuizComplete(true);

        void recordWritingAttempt({
          user,
          character,
          sourceVocabId,
          mode,
          totalStrokes,
          strokeMistakes: strokeMistakesRef.current,
          durationMs,
        }).then((res) => {
          onAttemptRecorded?.(res);
        });
      },
    });
  }, [
    mode,
    leniency,
    playAudio,
    strokeData?.strokes.length,
    completedStrokes,
    user,
    character,
    sourceVocabId,
    onAttemptRecorded,
  ]);

  // Load character data for StrokeBreakdownStrip + mount HanziWriter
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !character) return;

    let cancelled = false;
    container.innerHTML = '';
    setIsLoadingChar(true);
    setMistakenStrokeIndices([]);
    setMistakeCount(0);
    setCompletedStrokes(0);
    setActiveStrokeIndex(0);
    setLastAccuracy(null);
    setIsQuizComplete(false);

    void HanziWriter.loadCharacterData(character)
      .then((data: CharacterStrokeData | null) => {
        if (!cancelled && data) {
          setStrokeData(data);
        }
      })
      .catch(() => {
        if (!cancelled) setStrokeData(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingChar(false);
      });

    const showOutline = mode === 'guided';
    const writer = HanziWriter.create(container, character, {
      width: stageSize,
      height: stageSize,
      padding: 18,
      showOutline,
      showCharacter: false,
      strokeAnimationSpeed,
      delayBetweenStrokes: 180,
      strokeColor: '#243447',
      radicalColor: '#E85D3F',
      outlineColor: '#CBD5E1',
      drawingColor: '#E85D3F',
      drawingWidth: 16,
      highlightColor: '#F59E0B',
      showHintAfterMisses: 3,
      leniency,
    });

    writerRef.current = writer;

    // Defer quiz initialization cleanly
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        startQuiz();
      }
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      writerRef.current = null;
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, mode, leniency, strokeAnimationSpeed, stageSize]);

  const animateCharacter = useCallback(() => {
    const writer = writerRef.current;
    if (!writer) return;
    writer.showOutline();
    writer.animateCharacter({
      onComplete: () => {
        if (mode !== 'guided') {
          writer.hideOutline();
        }
        startQuiz();
      },
    });
  }, [mode, startQuiz]);

  const hintCurrentStroke = useCallback(() => {
    const writer = writerRef.current as unknown as {
      highlightStroke?: (idx: number) => void;
    } | null;
    if (writer?.highlightStroke) {
      writer.highlightStroke(activeStrokeIndex);
    }
  }, [activeStrokeIndex]);

  return {
    containerRef,
    mode,
    setMode,
    gridType,
    setGridType,
    leniency,
    setLeniency,
    strokeAnimationSpeed,
    setStrokeAnimationSpeed,
    strokeData,
    isLoadingChar,
    mistakenStrokeIndices,
    mistakeCount,
    completedStrokes,
    activeStrokeIndex,
    lastAccuracy,
    isQuizComplete,
    animateCharacter,
    startQuiz,
    hintCurrentStroke,
    playAudio,
  };
}

