import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Filter } from 'lucide-react';
import { HskResourcesView, HskReportModal, HskAdminImportModal } from '../components/HskPhase3Components';
import HskStructureView from '../components/HskStructureView';
import {
  getTemporaryExamSession,
  saveTemporaryAnswers,
} from '../services/hskService';
import HskSubNavHeader from '../components/hsk/HskSubNavHeader.jsx';
import { HskHomeView } from '../components/hsk/HskHubLobby.jsx';
import { HskExamsListView, HskExamDetailView } from '../components/hsk/HskExamsCatalogView.jsx';
import HskExamTakingView from '../components/hsk/HskExamTakingView.jsx';
import HskExamResultView from '../components/hsk/HskResultAndReviewView.jsx';
import { HskHistoryView } from '../components/hsk/HskHistoryPanel.jsx';
import {
  HskMistakesView,
  HskAnalyticsView,
} from '../components/hsk/HskMistakesAndAnalyticsPanels.jsx';
import Hsk7to9ExamCenterSectionView from '../components/hsk/Hsk7to9ExamCenterSectionView.jsx';
import HskRandomExamModal from '../components/hsk/HskRandomExamModal.jsx';
import { parseHskExamUrlParamsImpl } from '../components/hsk/hskPracticeHelpers.js';

export {
  formatExamTime,
  isSentenceReorderQuestion,
  isSubjectiveQuestion,
  readShufflePreference,
} from '../components/hsk/hskPracticeHelpers.js';

// Lazy-load các module mô phỏng chuyên sâu để giữ gói tải chính siêu nhẹ
const Hsk6TwoPhaseSummarySimulator = lazy(() =>
  import('../features/hsk-exam/renderers/hsk6/Hsk6TwoPhaseSummarySimulator.tsx').then((m) => ({
    default: m.Hsk6TwoPhaseSummarySimulator,
  }))
);
const HskkSpeakingSimulator = lazy(() =>
  import('../features/hskk-exam/HskkSpeakingSimulator.tsx').then((m) => ({
    default: m.HskkSpeakingSimulator,
  }))
);
const PostExamMistakeRemediationPanel = lazy(() =>
  import('../features/hsk-exam/analytics/PostExamMistakeRemediationPanel.tsx').then((m) => ({
    default: m.PostExamMistakeRemediationPanel,
  }))
);
const Hsk7to9IntegratedExamSimulator = lazy(() =>
  import('@/features/hsk-exam/components/Hsk7to9IntegratedExamSimulator')
);
const Hsk7to9FullMockSimulator = lazy(() =>
  import('@/features/hsk-exam/components/Hsk7to9FullMockSimulator')
);

const RANDOM_MODAL_PANEL_CLASS =
  'bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90dvh] overflow-y-auto pb-[max(0.75rem,env(safe-area-inset-bottom))]';
const RANDOM_TOPIC_SELECT_CLASS =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm font-medium focus:outline-none focus:border-[#E85D3F]';

const formatWritingCriterion = (crit) => ({
  label: typeof crit === 'string' ? crit : (crit?.name || ''),
  weight: typeof crit === 'object' && crit !== null ? crit.weight : null,
});

const shouldShowReviewOptions = (q) =>
  !q.isSubjective && q.questionType !== 'essay_summary' && q.questionType !== 'free_writing' && q.options && q.options.length > 0;

/**
 * Đọc tham số level (1..9) và paper (ví dụ: H41005, H79001, H79002, H79003)
 * Hỗ trợ cả window.location.search (?level=7&paper=H79001) và Hash Router (#hsk?level=7&paper=H79001)
 */
export function parseHskExamUrlParams() {
  return parseHskExamUrlParamsImpl();
}

/**
 * Component Banner & Danh sách 3 Đề thi Tích hợp HSK 7–9 (H79001, H79002, H79003)
 */
export function Hsk7to9ExamCenterSection(props) {
  return <Hsk7to9ExamCenterSectionView {...props} />;
}

export default function HskPracticePage({
  user,
  setActiveTab,
  subRoute = 'home',
  paramId = null,
  onNavigate = null,
}) {
  const [reportTarget, setReportTarget] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);
  const initialUrlConfig = useMemo(() => parseHskExamUrlParams(), []);
  const [selectedLevel, setSelectedLevel] = useState(initialUrlConfig.level);
  const [activeHsk7to9PaperCode, setActiveHsk7to9PaperCode] = useState(
    initialUrlConfig.autoStartHsk79 ? initialUrlConfig.paperCode : null
  );

  useEffect(() => {
    const syncFromHash = () => {
      const parsed = parseHskExamUrlParams();
      if (parsed.level) setSelectedLevel(parsed.level);
      if (parsed.autoStartHsk79 && parsed.paperCode) {
        setActiveHsk7to9PaperCode(parsed.paperCode);
      }
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const navigateTo = (view, id = null) => {
    if (onNavigate) {
      onNavigate(view, id);
    } else if (view === 'home' || view === 'levels') {
      window.location.hash = '#hsk';
    } else if (view === 'exams') {
      window.location.hash = '#hsk/exams';
    } else if (view === 'structure') {
      window.location.hash = '#hsk/structure';
    } else if (view === 'hsk7_9_simulator') {
      window.location.hash = '#hsk/hsk7_9_simulator';
    } else if (view === 'hskk_simulator') {
      window.location.hash = '#hsk/hskk_simulator';
    } else if (view === 'resources') {
      window.location.hash = '#hsk/resources';
    } else if (view === 'history') {
      window.location.hash = '#hsk/history';
    } else if (view === 'mistakes') {
      window.location.hash = '#hsk/mistakes';
    } else if (view === 'analytics') {
      window.location.hash = '#hsk/analytics';
    } else if (view === 'exam' && id) {
      window.location.hash = `#hsk/exam/${id}`;
    } else if (view === 'take' && id) {
      window.location.hash = `#hsk/take/${id}`;
    } else if (view === 'result' && id) {
      window.location.hash = `#hsk/result/${id}`;
    }
  };

  const launchHsk7to9Paper = (code) => {
    setActiveHsk7to9PaperCode(code);
    window.location.hash = `#hsk?level=${selectedLevel >= 7 ? selectedLevel : 7}&paper=${code}`;
  };

  const currentView = useMemo(() => {
    if (subRoute === 'hsk7_9_simulator' || activeHsk7to9PaperCode) {
      return 'hsk7_9_simulator';
    }
    if (subRoute === 'exams') return 'exams';
    if (subRoute === 'structure') return 'structure';
    if (subRoute === 'hskk_simulator') return 'hskk_simulator';
    if (subRoute === 'resources') return 'resources';
    if (subRoute === 'history') return 'history';
    if (subRoute === 'mistakes') return 'mistakes';
    if (subRoute === 'analytics') return 'analytics';
    if (subRoute === 'exam' && paramId) return 'exam_detail';
    if (subRoute === 'take' && paramId) return 'exam_taking';
    if (subRoute === 'result' && paramId) return 'exam_result';
    return 'home';
  }, [subRoute, paramId, activeHsk7to9PaperCode]);

  if (currentView === 'hsk7_9_simulator') {
    const resolvedPaper =
      activeHsk7to9PaperCode ||
      (selectedLevel >= 7 ? `H7900${selectedLevel - 6}` : 'H79001');
    return (
      <Suspense
        fallback={
          <div className="min-h-dvh bg-[#FFF9F2] dark:bg-[#131B24] flex flex-col items-center justify-center gap-3 text-[#5B6B7F] dark:text-slate-300">
            <div className="w-9 h-9 border-2 border-[#E85D3F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#E85D3F]">
              Đang khởi tạo Phòng thi Tích hợp HSK 7–9 ({resolvedPaper})...
            </p>
          </div>
        }
      >
        <Hsk7to9IntegratedExamSimulator
          paperCode={resolvedPaper}
          initialLevel={selectedLevel >= 7 ? selectedLevel : 7}
          onExit={() => {
            setActiveHsk7to9PaperCode(null);
            window.location.hash = '#hsk';
            if (onNavigate) onNavigate('home');
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FFF9F2] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-16">
      {currentView !== 'exam_taking' && (
        <HskSubNavHeader
          currentView={currentView}
          user={user}
          onNavigate={navigateTo}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />
      )}

      {currentView === 'home' && (
        <HskHomeView
          user={user}
          onNavigate={navigateTo}
          onOpenRandomModal={() => setRandomModalOpen(true)}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          onLaunchHsk7to9Paper={launchHsk7to9Paper}
          Hsk7to9ExamCenterSection={Hsk7to9ExamCenterSection}
        />
      )}

      {currentView === 'structure' && (
        <HskStructureView onNavigate={navigateTo} />
      )}

      {currentView === 'hskk_simulator' && (
        <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Đang tải trình mô phỏng HSKK...</div>}>
          <HskkSpeakingSimulator onBack={() => navigateTo('home')} />
        </Suspense>
      )}

      {currentView === 'exams' && (
        <HskExamsListView
          onNavigate={navigateTo}
          onOpenRandomModal={() => setRandomModalOpen(true)}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          onLaunchHsk7to9Paper={launchHsk7to9Paper}
          Hsk7to9ExamCenterSection={Hsk7to9ExamCenterSection}
          renderMobileFilterToggle={({ toggleMobileFilters, activeExamFilterCount }) => (
            <button
              type="button"
              onClick={toggleMobileFilters}
              className="sm:hidden min-h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#E85D3F]" />
              <span>Bộ lọc đề thi</span>
              {activeExamFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#E85D3F] text-white text-[10px] font-black">
                  {activeExamFilterCount}
                </span>
              )}
            </button>
          )}
        />
      )}

      {currentView === 'resources' && (
        <HskResourcesView
          user={user}
          onNavigate={navigateTo}
          onOpenReport={(item) => setReportTarget(item)}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />
      )}

      {currentView === 'history' && (
        <HskHistoryView user={user} onNavigate={navigateTo} />
      )}

      {currentView === 'mistakes' && (
        <HskMistakesView user={user} onNavigate={navigateTo} />
      )}

      {currentView === 'analytics' && (
        <HskAnalyticsView
          user={user}
          onNavigate={navigateTo}
          setActiveTab={setActiveTab}
        />
      )}

      {currentView === 'exam_detail' && (
        <HskExamDetailView examId={paramId} onNavigate={navigateTo} />
      )}

      {currentView === 'exam_taking' && (
        <HskExamTakingView
          examId={paramId}
          user={user}
          onNavigate={navigateTo}
          draftStorage={{ getTemporaryExamSession, saveTemporaryAnswers }}
          renderHsk79FullMockSimulator={({
            exam,
            answers,
            recordAnswerChange,
            timeLeft,
            isSubmitting,
            executeSubmission,
            onNavigate: exitNav,
          }) => (
            <Suspense
              fallback={
                <div className="p-10 text-center text-sm font-bold text-slate-500">
                  正在加载 HSK 7–9 全真模拟考场...
                </div>
              }
            >
              <Hsk7to9FullMockSimulator
                exam={exam}
                answers={answers}
                onAnswerChange={recordAnswerChange}
                timeLeft={timeLeft}
                isSubmitting={isSubmitting}
                onSubmit={() => executeSubmission(false)}
                onExit={() => exitNav('exams')}
              />
            </Suspense>
          )}
          renderHsk6SummarySimulator={({ exam, currentQ, practiceMode, recordAnswerChange }) => (
            <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Đang tải bài viết tóm tắt HSK 6...</div>}>
              <Hsk6TwoPhaseSummarySimulator
                attemptKey={`${exam.id}_${currentQ.id}`}
                passageParagraphs={currentQ.summary_passage_paragraphs || undefined}
                practiceMode={practiceMode}
                onDraftChange={(payload) => {
                  const hasContent = Boolean((payload.title || '').trim() || (payload.summary || '').trim());
                  const formatted = hasContent
                    ? `《${(payload.title || '').trim() || '无题'}》\n${payload.summary || ''}`.trim()
                    : '';
                  recordAnswerChange(currentQ.id, formatted);
                }}
                onSubmitSummary={(payload) => {
                  const formatted = `《${(payload.title || '').trim() || '无题'}》\n${payload.summary || ''}`.trim();
                  recordAnswerChange(currentQ.id, formatted);
                }}
              />
            </Suspense>
          )}
        />
      )}

      {currentView === 'exam_result' && (
        <HskExamResultView
          attemptId={paramId}
          user={user}
          onNavigate={navigateTo}
          formatWritingCriterion={formatWritingCriterion}
          shouldShowReviewOptions={shouldShowReviewOptions}
          renderPostExamRemediation={(attempt) => (
            <Suspense fallback={<div className="p-4 text-center text-sm text-slate-500">Đang tải phân tích khắc phục lỗi...</div>}>
              <PostExamMistakeRemediationPanel
                mistakes={(attempt.detailedResults || []).filter((r) => !r.isCorrect)}
                paperCode={attempt.examId || 'HSK-CBT'}
                user={user}
                onOpenGrammarExplorer={() => navigateTo('structure')}
              />
            </Suspense>
          )}
        />
      )}

      <HskReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetItem={reportTarget}
        user={user}
      />

      <HskAdminImportModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        user={user}
      />

      <HskRandomExamModal
        isOpen={randomModalOpen}
        onClose={() => setRandomModalOpen(false)}
        onNavigate={navigateTo}
        modalPanelClassName={RANDOM_MODAL_PANEL_CLASS}
        topicSelectClassName={RANDOM_TOPIC_SELECT_CLASS}
      />
    </div>
  );
}
