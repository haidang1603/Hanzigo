import React, { useRef, useEffect } from 'react';
import { getAudioPlayLimit } from '../../services/hskService';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';
import { useHskAudioController } from './hooks/useHskAudioController.js';
import { useHskExamSession } from './hooks/useHskExamSession.js';
import { HskExamTopBar, HskExamConfirmModals } from './HskExamTopBar.jsx';
import HskQuestionRenderer from './HskQuestionRenderer.jsx';
import HskQuestionPalette from './HskQuestionPalette.jsx';

export default function HskExamTakingView({
  examId,
  user,
  onNavigate,
  draftStorage,
  renderHsk79FullMockSimulator,
  renderHsk6SummarySimulator,
}) {
  const stopAllExamAudioRef = useRef(null);
  const { setActiveExamSession } = useUnifiedTools() || {};

  const session = useHskExamSession({
    examId,
    user,
    onNavigate,
    draftStorage,
    stopAllExamAudioRef,
  });

  const audio = useHskAudioController({
    exam: session.exam,
    currentIdx: session.currentIdx,
    examMode: session.examMode,
  });

  stopAllExamAudioRef.current = audio.stopAllExamAudio;

  useEffect(() => {
    setActiveExamSession?.(Boolean(session.exam && !session.loading && session.isActiveExamSession));
    return () => {
      setActiveExamSession?.(false);
    };
  }, [setActiveExamSession, session.exam, session.loading, session.isActiveExamSession]);

  if (session.loading) {
    return (
      <div className="text-center py-24 text-slate-400 font-bold">
        Đang tải đề thi và thiết lập phòng thi...
      </div>
    );
  }

  if (!session.exam || !session.currentQ) {
    return (
      <div className="text-center py-24 text-slate-400 font-bold">
        Không tìm thấy nội dung đề thi.
      </div>
    );
  }

  const {
    exam,
    currentQ,
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
    setLookupSavedFlash,
    sectionLockState,
    confirmFinishSectionOpen,
    setConfirmFinishSectionOpen,
    sectionBannerNotice,
    setSectionBannerNotice,
    failedImageKeys,
    setFailedImageKeys,
    examSchedule,
    sections,
    totalQuestions,
    answeredCount,
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
  } = session;

  const audioLimit = getAudioPlayLimit(exam?.level, examMode);
  const currentPlays = currentQ ? (audio.audioPlayCounts[currentQ.id] || 0) : 0;
  const canPlayAudio = examMode === 'practice' || currentPlays < audioLimit;
  const currentSecKey = currentQ ? (currentQ.part_type || currentQ.section || 'reading') : 'reading';

  const isHsk79FullMockCbt =
    !isLearningMode &&
    exam &&
    (exam.level === 'HSK 7-9' ||
      String(exam.level || '').includes('7-9') ||
      String(exam.id || '').includes('hsk7-9'));

  if (isHsk79FullMockCbt && renderHsk79FullMockSimulator) {
    return renderHsk79FullMockSimulator({
      exam,
      answers,
      recordAnswerChange,
      timeLeft,
      isSubmitting,
      executeSubmission,
      onNavigate,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      <HskExamTopBar
        exam={exam}
        examMode={examMode}
        isLearningMode={isLearningMode}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        flaggedIds={flaggedIds}
        showPinyin={showPinyin}
        setShowPinyin={setShowPinyin}
        sectionLowTime={sectionLowTime}
        timeLeft={timeLeft}
        timeSpentSeconds={timeSpentSeconds}
        activeSectionSchedule={activeSectionSchedule}
        activeSectionRemaining={activeSectionRemaining}
        sections={sections}
        currentSecKey={currentSecKey}
        sectionLockState={sectionLockState}
        setCurrentIdx={setCurrentIdx}
        hasNextUnlockedSection={hasNextUnlockedSection}
        isSubmitting={isSubmitting}
        restoredToast={restoredToast}
        setRestoredToast={setRestoredToast}
        sectionBannerNotice={sectionBannerNotice}
        setSectionBannerNotice={setSectionBannerNotice}
        handleSwitchExamMode={handleSwitchExamMode}
        setConfirmFinishSectionOpen={setConfirmFinishSectionOpen}
        setShowConfirmModal={setShowConfirmModal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start pb-12">
        <HskQuestionRenderer
          exam={exam}
          user={user}
          currentQ={currentQ}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          totalQuestions={totalQuestions}
          answers={answers}
          recordAnswerChange={recordAnswerChange}
          isFlagged={isFlagged}
          toggleFlagQuestion={toggleFlagQuestion}
          isLearningMode={isLearningMode}
          isActiveExamSession={isActiveExamSession}
          examMode={examMode}
          showPinyinInTaking={showPinyinInTaking}
          audioPlaying={audio.audioPlaying}
          canPlayAudio={canPlayAudio}
          currentPlays={currentPlays}
          audioLimit={audioLimit}
          listeningVoice={audio.listeningVoice}
          listeningRate={audio.listeningRate}
          audioFallbackActive={audio.audioFallbackActive}
          audioNotice={audio.audioNotice}
          handlePlayAudio={audio.handlePlayAudio}
          handleChangeListeningVoice={audio.handleChangeListeningVoice}
          handleChangeListeningRate={audio.handleChangeListeningRate}
          showPracticeScript={showPracticeScript}
          setShowPracticeScript={setShowPracticeScript}
          failedImageKeys={failedImageKeys}
          setFailedImageKeys={setFailedImageKeys}
          lookupEntry={lookupEntry}
          setLookupEntry={setLookupEntry}
          lookupSavedFlash={lookupSavedFlash}
          setLookupSavedFlash={setLookupSavedFlash}
          savedSrsIds={savedSrsIds}
          setSavedSrsIds={setSavedSrsIds}
          isSubmitting={isSubmitting}
          triggerInstantLearningCheck={triggerInstantLearningCheck}
          subjectiveTestingId={subjectiveTestingId}
          handleGradeSubjectiveInLearning={handleGradeSubjectiveInLearning}
          showPracticeExplanation={showPracticeExplanation}
          setShowPracticeExplanation={setShowPracticeExplanation}
          learningFeedbackMap={learningFeedbackMap}
          subjectiveGradingMap={subjectiveGradingMap}
          sectionLockState={sectionLockState}
          activeSectionSchedule={activeSectionSchedule}
          hasNextUnlockedSection={hasNextUnlockedSection}
          setConfirmFinishSectionOpen={setConfirmFinishSectionOpen}
          setShowConfirmModal={setShowConfirmModal}
          renderHsk6SummarySimulator={renderHsk6SummarySimulator}
        />

        <HskQuestionPalette
          exam={exam}
          answers={answers}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          flaggedIds={flaggedIds}
          paletteFilter={paletteFilter}
          setPaletteFilter={setPaletteFilter}
          sectionLockState={sectionLockState}
          examSchedule={examSchedule}
          isLearningMode={isLearningMode}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
        />
      </div>

      <HskExamConfirmModals
        confirmFinishSectionOpen={confirmFinishSectionOpen}
        setConfirmFinishSectionOpen={setConfirmFinishSectionOpen}
        activeSectionSchedule={activeSectionSchedule}
        examSchedule={examSchedule}
        activeSectionIdx={activeSectionIdx}
        handleConfirmFinishSectionEarly={handleConfirmFinishSectionEarly}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        isLearningMode={isLearningMode}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        flaggedIds={flaggedIds}
        executeSubmission={executeSubmission}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
