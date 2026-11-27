import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getExamForTaking,
  submitExamAttempt,
  saveTemporaryAnswers,
  getTemporaryExamSession,
  clearTemporaryAnswers,
} from '../../../services/hskService';
import {
  PRACTICE_MODES,
  analyzeDualExamAttempt,
  saveDualExamHistoryRecord,
  gradeSubjectiveSubmission,
  getDefaultShowPinyinForLevel,
  evaluateLearningQuestionFeedback,
} from '../../../data/hskExamBlueprints.js';
import {
  createExamSessionSeed,
  shuffleSessionQuestions,
  remapSelectedAnswerToOriginal,
  remapAnswersToOriginalIndices,
  remapFeedbackForShuffledQuestion,
} from '../../../utils/examOptionShuffler.js';
import {
  buildExamSectionSchedule,
  createSectionLockState,
  tickSectionTimer,
  finishCurrentSectionEarly,
  getActiveSectionRemainingSeconds,
  getTotalRemainingSeconds,
  isSectionTimeLow,
} from '../../../utils/examSectionLockEngine.js';
import {
  recordMistakeEntry,
  syncMistakeNotebookFromAttempt,
  markMistakeResolved,
} from '../../../services/mistakeNotebookService.js';
import { saveCustomVocab } from '../../../utils/materialsStorage.js';
import { lookupChineseTokenLocal } from '../../../utils/localVocabLookup.js';
import { PENDING_SHUFFLE_SESSION_KEY } from '../hskPracticeConstants.js';
import { readShufflePreference } from '../hskPracticeHelpers.js';

export function useHskExamSession({
  examId,
  user,
  onNavigate,
  draftStorage = {},
  stopAllExamAudioRef = null,
}) {
  const loadDraftSession = draftStorage.getTemporaryExamSession || getTemporaryExamSession;
  const saveDraftSession = draftStorage.saveTemporaryAnswers || saveTemporaryAnswers;

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [examMode, setExamMode] = useState(() => {
    try {
      const pending = sessionStorage.getItem('hanzigo_pending_exam_mode');
      if (pending) {
        sessionStorage.removeItem('hanzigo_pending_exam_mode');
        return pending === PRACTICE_MODES.LEARNING || pending === 'practice' ? 'practice' : 'simulation';
      }
    } catch {}
    return 'simulation';
  });
  const [showPinyin, setShowPinyin] = useState(true);
  const [learningFeedbackMap, setLearningFeedbackMap] = useState({});
  const [subjectiveGradingMap, setSubjectiveGradingMap] = useState({});
  const [subjectiveTestingId, setSubjectiveTestingId] = useState(null);
  const [savedSrsIds, setSavedSrsIds] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState('all');
  const [restoredToast, setRestoredToast] = useState(false);
  const [showPracticeScript, setShowPracticeScript] = useState(false);
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);
  const [lookupEntry, setLookupEntry] = useState(null);
  const [lookupSavedFlash, setLookupSavedFlash] = useState(false);
  const [sectionLockState, setSectionLockState] = useState(null);
  const [confirmFinishSectionOpen, setConfirmFinishSectionOpen] = useState(false);
  const [sectionBannerNotice, setSectionBannerNotice] = useState('');
  const [failedImageKeys, setFailedImageKeys] = useState({});

  const answersRef = useRef(answers);
  const flaggedIdsRef = useRef(flaggedIds);
  const examModeRef = useRef(examMode);
  const currentIdxRef = useRef(currentIdx);
  const timeLeftRef = useRef(timeLeft);
  const timeSpentRef = useRef(timeSpentSeconds);
  const isSubmittingRef = useRef(isSubmitting);
  const shuffleOptionsRef = useRef(readShufflePreference());
  const sessionSeedRef = useRef('');
  const sectionLockRef = useRef(sectionLockState);
  const sectionNoticeTimerRef = useRef(null);

  answersRef.current = answers;
  flaggedIdsRef.current = flaggedIds;
  examModeRef.current = examMode;
  currentIdxRef.current = currentIdx;
  timeLeftRef.current = timeLeft;
  timeSpentRef.current = timeSpentSeconds;
  isSubmittingRef.current = isSubmitting;
  sectionLockRef.current = sectionLockState;

  useEffect(() => {
    setShowPracticeScript(false);
    setShowPracticeExplanation(false);
    setLookupEntry(null);
    setLookupSavedFlash(false);
  }, [currentIdx]);

  const stopAudioSafe = () => {
    try {
      stopAllExamAudioRef?.current?.();
    } catch {}
  };

  const examSchedule = useMemo(() => {
    if (!exam || !exam.questions) return [];
    return buildExamSectionSchedule({ exam, questions: exam.questions });
  }, [exam]);

  const sections = useMemo(() => {
    if (!exam || !exam.questions || examSchedule.length === 0) return [];
    return examSchedule.map((sec) => {
      const answered = sec.questionIndexes.reduce((acc, idx) => {
        const q = exam.questions[idx];
        return q && answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '' ? acc + 1 : acc;
      }, 0);
      return {
        ...sec,
        title: sec.labelZh ? `${sec.labelVi} (${sec.labelZh})` : sec.labelVi,
        indices: sec.questionIndexes,
        total: sec.questionIndexes.length,
        answered,
      };
    });
  }, [exam, examSchedule, answers]);

  const serializeDraftMeta = (lockObj) => {
    if (!lockObj) return {};
    return {
      sectionLock: {
        activeSectionIndex: lockObj.activeSectionIndex,
        strictSectionLock: Boolean(lockObj.strictSectionLock),
        sectionRemainingSeconds: { ...(lockObj.sectionRemainingSeconds || {}) },
        lockedSectionIndexes: [...(lockObj.lockedSectionIndexes || [])],
      },
    };
  };

  const buildDraftPayload = (overrides = {}) => {
    const lockMeta = serializeDraftMeta(
      overrides.sectionLockState !== undefined ? overrides.sectionLockState : sectionLockRef.current
    );
    return {
      flaggedQuestionIds: flaggedIdsRef.current,
      examMode: overrides.examMode ?? examModeRef.current,
      currentIdx: overrides.currentIdx ?? currentIdxRef.current,
      timeLeft: overrides.timeLeft ?? timeLeftRef.current,
      timeSpentSeconds: overrides.timeSpentSeconds ?? timeSpentRef.current,
      shuffleOptions: shuffleOptionsRef.current,
      sessionSeed: sessionSeedRef.current,
      ...lockMeta,
    };
  };

  const triggerSectionBanner = (msg) => {
    setSectionBannerNotice(msg);
    if (sectionNoticeTimerRef.current) clearTimeout(sectionNoticeTimerRef.current);
    sectionNoticeTimerRef.current = setTimeout(() => setSectionBannerNotice(''), 6000);
  };

  useEffect(() => {
    let mounted = true;
    getExamForTaking(examId)
      .then((data) => {
        if (!mounted) return;
        setShowPinyin(getDefaultShowPinyinForLevel(data.level));

        const defaultDurationSeconds = (data.duration_minutes || 40) * 60;
        let resolvedTimeLeft = defaultDurationSeconds;
        let resolvedTimeSpent = 0;

        const session = loadDraftSession(examId);
        if (!session) {
          clearTemporaryAnswers(examId);
        }

        let resolvedShuffle = readShufflePreference();
        let resolvedSeed = '';
        if (session && typeof session.sessionSeed === 'string' && session.sessionSeed) {
          resolvedShuffle = typeof session.shuffleOptions === 'boolean' ? session.shuffleOptions : false;
          resolvedSeed = session.sessionSeed;
        } else if (session && session.answers && Object.keys(session.answers).length > 0) {
          resolvedShuffle = false;
          resolvedSeed = '';
        } else {
          try {
            const pendingShuffle = sessionStorage.getItem(PENDING_SHUFFLE_SESSION_KEY);
            if (pendingShuffle !== null) {
              sessionStorage.removeItem(PENDING_SHUFFLE_SESSION_KEY);
              resolvedShuffle = pendingShuffle === 'true';
            }
          } catch {}
          resolvedSeed = createExamSessionSeed(examId);
        }

        shuffleOptionsRef.current = resolvedShuffle;
        sessionSeedRef.current = resolvedSeed;

        const sessionQuestions = shuffleSessionQuestions(data.questions || [], {
          enabled: resolvedShuffle,
          sessionSeed: resolvedSeed,
        });
        setExam({ ...data, questions: sessionQuestions });

        const resolvedMode = session?.examMode || examModeRef.current;
        const schedule = buildExamSectionSchedule({ exam: data, questions: sessionQuestions });
        const initialLock = createSectionLockState({
          sections: schedule,
          strictSectionLock: resolvedMode === 'simulation' && schedule.length > 0,
          restoredDraft: session,
        });
        setSectionLockState(initialLock);
        sectionLockRef.current = initialLock;

        if (session) {
          if (session.answers && Object.keys(session.answers).length > 0) {
            setAnswers(session.answers);
            answersRef.current = session.answers;
            setRestoredToast(true);
            setTimeout(() => setRestoredToast(false), 5000);
          }
          if (session.flaggedQuestionIds) {
            setFlaggedIds(session.flaggedQuestionIds);
            flaggedIdsRef.current = session.flaggedQuestionIds;
          }
          if (session.examMode) {
            setExamMode(session.examMode);
            examModeRef.current = session.examMode;
          }
          if (resolvedMode === 'simulation' && schedule.length > 0) {
            resolvedTimeLeft = getTotalRemainingSeconds(initialLock);
            const activeSec = schedule[initialLock.activeSectionIndex];
            const requestedIdx = typeof session.currentIdx === 'number' ? session.currentIdx : 0;
            const safeIdx =
              activeSec && activeSec.questionIndexes.includes(requestedIdx)
                ? requestedIdx
                : activeSec?.firstIdx ?? 0;
            setCurrentIdx(safeIdx);
            currentIdxRef.current = safeIdx;
          } else {
            if (typeof session.currentIdx === 'number' && sessionQuestions.length > 0) {
              const safeIdx = Math.max(0, Math.min(session.currentIdx, sessionQuestions.length - 1));
              setCurrentIdx(safeIdx);
              currentIdxRef.current = safeIdx;
            }
            if (typeof session.timeLeft === 'number' && session.timeLeft > 0) {
              resolvedTimeLeft = Math.min(defaultDurationSeconds, session.timeLeft);
            }
          }
          if (typeof session.timeSpentSeconds === 'number' && session.timeSpentSeconds > 0) {
            resolvedTimeSpent = session.timeSpentSeconds;
          }
        } else {
          if (resolvedMode === 'simulation' && schedule.length > 0) {
            resolvedTimeLeft = getTotalRemainingSeconds(initialLock);
          }
          saveDraftSession(
            examId,
            {},
            {
              flaggedQuestionIds: [],
              examMode: resolvedMode,
              currentIdx: 0,
              timeLeft: resolvedTimeLeft,
              timeSpentSeconds: 0,
              shuffleOptions: resolvedShuffle,
              sessionSeed: resolvedSeed,
              ...serializeDraftMeta(initialLock),
            }
          );
        }

        setTimeLeft(resolvedTimeLeft);
        timeLeftRef.current = resolvedTimeLeft;
        setTimeSpentSeconds(resolvedTimeSpent);
        timeSpentRef.current = resolvedTimeSpent;
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        onNavigate('exams');
      });

    return () => {
      mounted = false;
    };
  }, [examId]);

  const executeSubmission = async () => {
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const latestMode = examModeRef.current;
      const calculatedTimeSpent =
        latestMode === 'simulation'
          ? Math.max(1, (exam?.duration_minutes || 40) * 60 - timeLeftRef.current)
          : Math.max(1, timeSpentRef.current);

      const remappedAnswersForServer = remapAnswersToOriginalIndices(
        exam?.questions || [],
        answersRef.current
      );

      const attempt = await submitExamAttempt({
        examId: exam.id,
        submittedAnswers: remappedAnswersForServer,
        timeSpentSeconds: calculatedTimeSpent,
        user,
        examMode: latestMode,
        subjectiveGrades: subjectiveGradingMap,
      });
      syncMistakeNotebookFromAttempt({ user, attempt, exam });
      if (exam?.examSystem) {
        const analytics = analyzeDualExamAttempt({
          exam,
          questions: exam.questions || [],
          userAnswers: answersRef.current,
          subjectiveGrades: subjectiveGradingMap,
          timeSpentSeconds: calculatedTimeSpent,
        });
        saveDualExamHistoryRecord({
          user,
          analytics: {
            ...analytics,
            practiceMode: latestMode === 'practice' ? 'learning' : 'exam',
            answerSnapshots: attempt?.answerSnapshots || [],
          },
        });
      }
      clearTemporaryAnswers(examId);
      onNavigate('result', attempt.id);
    } catch (err) {
      alert('Lỗi nộp bài: ' + err.message);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      alert('⏱️ Đã hết thời gian làm bài thi! Hệ thống đang tự động nộp bài của bạn.');
    } catch {}
    await executeSubmission();
  };

  useEffect(() => {
    if (loading || !exam || isSubmitting) return;
    const isHsk79CbtView =
      examMode === 'simulation' &&
      (exam.level === 'HSK 7-9' ||
        String(exam.level || '').includes('7-9') ||
        String(exam.id || '').includes('hsk7-9'));
    if (isHsk79CbtView) return;

    const timer = setInterval(() => {
      const nextSpent = timeSpentRef.current + 1;
      timeSpentRef.current = nextSpent;
      setTimeSpentSeconds(nextSpent);

      if (examModeRef.current === 'simulation') {
        const curLock = sectionLockRef.current;
        if (curLock && curLock.strictSectionLock && examSchedule.length > 0) {
          const ticked = tickSectionTimer(curLock, 1);
          sectionLockRef.current = ticked.nextState;
          setSectionLockState(ticked.nextState);
          const nextLeft = getTotalRemainingSeconds(ticked.nextState);
          timeLeftRef.current = nextLeft;
          setTimeLeft(nextLeft);

          if (ticked.sectionAdvanced) {
            stopAudioSafe();
            const prevSec = examSchedule[ticked.previousSectionIndex];
            const nextSec = examSchedule[ticked.nextState.activeSectionIndex];
            const nextIdx = nextSec?.firstIdx ?? currentIdxRef.current;
            setCurrentIdx(nextIdx);
            currentIdxRef.current = nextIdx;
            triggerSectionBanner(
              `⏱️ Đã hết giờ phần ${prevSec?.labelVi || ''} — đã khóa vĩnh viễn và chuyển sang ${nextSec?.labelVi || ''}.`
            );
            saveDraftSession(
              examId,
              answersRef.current,
              buildDraftPayload({
                sectionLockState: ticked.nextState,
                currentIdx: nextIdx,
                timeLeft: nextLeft,
                timeSpentSeconds: nextSpent,
              })
            );
          } else if (nextSpent % 5 === 0) {
            saveDraftSession(
              examId,
              answersRef.current,
              buildDraftPayload({
                sectionLockState: ticked.nextState,
                timeLeft: nextLeft,
                timeSpentSeconds: nextSpent,
              })
            );
          }

          if (ticked.autoSubmit) {
            stopAudioSafe();
            clearInterval(timer);
            handleAutoSubmit();
          }
          return;
        }

        const nextLeft = Math.max(0, timeLeftRef.current - 1);
        timeLeftRef.current = nextLeft;
        setTimeLeft(nextLeft);

        if (nextSpent % 5 === 0) {
          saveDraftSession(examId, answersRef.current, buildDraftPayload({ timeLeft: nextLeft, timeSpentSeconds: nextSpent }));
        }

        if (nextLeft <= 0) {
          stopAudioSafe();
          clearInterval(timer);
          handleAutoSubmit();
        }
      } else if (nextSpent % 5 === 0) {
        saveDraftSession(examId, answersRef.current, buildDraftPayload({ timeSpentSeconds: nextSpent }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, exam, isSubmitting, examMode, examId, examSchedule]);

  const recordAnswerChange = (questionId, value) => {
    const updated = { ...answersRef.current, [questionId]: value };
    answersRef.current = updated;
    setAnswers(updated);
    saveDraftSession(examId, updated, buildDraftPayload());
  };

  const toggleFlagQuestion = (qId) => {
    const curFlagged = flaggedIdsRef.current;
    const nextFlagged = curFlagged.includes(qId)
      ? curFlagged.filter((id) => id !== qId)
      : [...curFlagged, qId];
    flaggedIdsRef.current = nextFlagged;
    setFlaggedIds(nextFlagged);
    saveDraftSession(examId, answersRef.current, {
      ...buildDraftPayload(),
      flaggedQuestionIds: nextFlagged,
    });
  };

  const handleSwitchExamMode = (nextMode) => {
    setExamMode(nextMode);
    examModeRef.current = nextMode;
    if (sectionLockRef.current && examSchedule.length > 0) {
      const nextStrict = nextMode === 'simulation';
      const updatedLock = {
        ...sectionLockRef.current,
        strictSectionLock: nextStrict,
      };
      sectionLockRef.current = updatedLock;
      setSectionLockState(updatedLock);
      if (nextStrict) {
        const activeSec = examSchedule[updatedLock.activeSectionIndex];
        if (activeSec && !activeSec.questionIndexes.includes(currentIdxRef.current)) {
          setCurrentIdx(activeSec.firstIdx ?? 0);
          currentIdxRef.current = activeSec.firstIdx ?? 0;
        }
      }
      saveDraftSession(
        examId,
        answersRef.current,
        buildDraftPayload({ examMode: nextMode, sectionLockState: updatedLock })
      );
    }
  };

  const handleConfirmFinishSectionEarly = () => {
    setConfirmFinishSectionOpen(false);
    if (!sectionLockRef.current) return;
    stopAudioSafe();
    const res = finishCurrentSectionEarly(sectionLockRef.current);
    sectionLockRef.current = res.nextState;
    setSectionLockState(res.nextState);
    const nextTotalLeft = getTotalRemainingSeconds(res.nextState);
    timeLeftRef.current = nextTotalLeft;
    setTimeLeft(nextTotalLeft);

    if (res.sectionAdvanced) {
      const prevSec = examSchedule[res.previousSectionIndex];
      const nextSec = examSchedule[res.nextState.activeSectionIndex];
      const nextIdx = nextSec?.firstIdx ?? currentIdxRef.current;
      setCurrentIdx(nextIdx);
      currentIdxRef.current = nextIdx;
      triggerSectionBanner(
        `🔒 Đã khóa phần ${prevSec?.labelVi || ''} và chuyển sang ${nextSec?.labelVi || ''}.`
      );
      saveDraftSession(
        examId,
        answersRef.current,
        buildDraftPayload({
          sectionLockState: res.nextState,
          currentIdx: nextIdx,
          timeLeft: nextTotalLeft,
        })
      );
    } else if (res.autoSubmit) {
      executeSubmission();
    }
  };

  const isLearningMode = examMode === 'practice';

  const triggerInstantLearningCheck = (questionObj, answerVal) => {
    if (!isLearningMode || !questionObj) return;
    const originalAnswerVal = remapSelectedAnswerToOriginal(questionObj, answerVal);
    const fb = evaluateLearningQuestionFeedback({
      examId: exam?.id,
      questionId: questionObj.id,
      userAnswer: originalAnswerVal,
      practiceMode: PRACTICE_MODES.LEARNING,
    });
    if (fb && !fb.blocked) {
      const syncedFeedback = remapFeedbackForShuffledQuestion(fb, questionObj);
      setLearningFeedbackMap((prev) => ({ ...prev, [questionObj.id]: syncedFeedback }));
      if (syncedFeedback.isCorrect === false) {
        recordMistakeEntry({
          user,
          question: questionObj,
          userAnswer: answerVal,
          examId: exam?.id,
          examSystem: exam?.examSystem || 'hsk_2_0',
          level: exam?.level || 'HSK 1',
          mode: 'practice',
        });
      } else if (
        syncedFeedback.isCorrect === true &&
        (exam?.isMistakeReview || String(exam?.id || '').startsWith('mistake-review-'))
      ) {
        markMistakeResolved({ user, questionId: questionObj.id });
      }
    }
  };

  const handleGradeSubjectiveInLearning = async (questionObj) => {
    if (!isLearningMode || !questionObj) return;
    const userText = answersRef.current[questionObj.id] || '';
    setSubjectiveTestingId(questionObj.id);
    try {
      const [subRes, fb] = await Promise.all([
        gradeSubjectiveSubmission({
          question: questionObj,
          userAnswer: userText,
          level: exam?.level || 'HSK 4',
        }),
        Promise.resolve(
          evaluateLearningQuestionFeedback({
            examId: exam?.id,
            questionId: questionObj.id,
            userAnswer: userText,
            practiceMode: PRACTICE_MODES.LEARNING,
          })
        ),
      ]);
      setSubjectiveGradingMap((prev) => ({ ...prev, [questionObj.id]: subRes }));
      if (fb && !fb.blocked) {
        setLearningFeedbackMap((prev) => ({ ...prev, [questionObj.id]: fb }));
      }
    } finally {
      setSubjectiveTestingId(null);
    }
  };

  const handleSaveTokenToSrs = (entry) => {
    if (!entry) return;
    saveCustomVocab(
      {
        hanzi: entry.hanzi,
        pinyin: entry.pinyin,
        meaning: entry.meaning,
        level: exam?.level || 'HSK 4',
      },
      user
    );
    setLookupSavedFlash(true);
    setTimeout(() => setLookupSavedFlash(false), 2000);
  };

  const handleQuickLookupToken = (token) => {
    const clean = String(token || '').trim();
    if (!/[\u4e00-\u9fa5]/.test(clean)) return;
    const entry = lookupChineseTokenLocal(clean);
    setLookupSavedFlash(false);
    setLookupEntry(
      entry || {
        hanzi: clean,
        pinyin: '',
        meaning: 'Chưa có trong từ điển cục bộ — bấm lưu để tự bổ sung vào Sổ SRS.',
      }
    );
  };

  const currentQ = exam?.questions?.[currentIdx] || null;
  const totalQuestions = exam?.questions?.length || 0;
  const answeredCount = exam
    ? Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== null && answers[k] !== '').length
    : 0;
  const isAnswered =
    currentQ &&
    answers[currentQ.id] !== undefined &&
    answers[currentQ.id] !== null &&
    answers[currentQ.id] !== '';
  const isFlagged = currentQ && flaggedIds.includes(currentQ.id);
  const isActiveExamSession = !isLearningMode;
  const showPinyinInTaking = isLearningMode && showPinyin;
  const activeSectionIdx = sectionLockState?.activeSectionIndex ?? 0;
  const activeSectionSchedule = examSchedule[activeSectionIdx] || null;
  const activeSectionRemaining =
    isActiveExamSession && sectionLockState?.strictSectionLock
      ? getActiveSectionRemainingSeconds(sectionLockState)
      : timeLeft;
  const sectionLowTime =
    isActiveExamSession && sectionLockState?.strictSectionLock && isSectionTimeLow(sectionLockState, 120);
  const hasNextUnlockedSection =
    isActiveExamSession &&
    sectionLockState?.strictSectionLock &&
    activeSectionIdx < examSchedule.length - 1;

  return {
    exam,
    loading,
    currentIdx,
    setCurrentIdx,
    answers,
    flaggedIds,
    examMode,
    isLearningMode,
    isActiveExamSession,
    showPinyin,
    setShowPinyin,
    showPinyinInTaking,
    learningFeedbackMap,
    subjectiveGradingMap,
    subjectiveTestingId,
    savedSrsIds,
    setSavedSrsIds,
    timeLeft,
    timeSpentSeconds,
    isSubmitting,
    showConfirmModal,
    setShowConfirmModal,
    paletteFilter,
    setPaletteFilter,
    restoredToast,
    setRestoredToast,
    showPracticeScript,
    setShowPracticeScript,
    showPracticeExplanation,
    setShowPracticeExplanation,
    lookupEntry,
    setLookupEntry,
    lookupSavedFlash,
    sectionLockState,
    confirmFinishSectionOpen,
    setConfirmFinishSectionOpen,
    sectionBannerNotice,
    setSectionBannerNotice,
    failedImageKeys,
    setFailedImageKeys,
    examSchedule,
    sections,
    currentQ,
    totalQuestions,
    answeredCount,
    isAnswered,
    isFlagged,
    activeSectionIdx,
    activeSectionSchedule,
    activeSectionRemaining,
    sectionLowTime,
    hasNextUnlockedSection,
    recordAnswerChange,
    toggleFlagQuestion,
    executeSubmission,
    handleSwitchExamMode,
    handleConfirmFinishSectionEarly,
    triggerInstantLearningCheck,
    handleGradeSubjectiveInLearning,
    handleSaveTokenToSrs,
    handleQuickLookupToken,
    triggerSectionBanner,
  };
}
