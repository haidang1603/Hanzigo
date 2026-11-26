// File: src/features/hsk-exam/components/Hsk7to9FullMockSimulator.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Clock,
  Volume2,
  Mic,
  Square,
  FileText,
  Languages,
  Headphones,
  BarChart3,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  SECTION_STATES,
  buildExamSectionSchedule,
  createSectionLockState,
  getSectionStatus,
  canAccessSection,
  tickSectionTimer,
  finishCurrentSectionEarly,
  getActiveSectionRemainingSeconds,
  getTotalRemainingSeconds,
  isSectionTimeLow,
  serializeSectionLockDraft,
} from '../../../utils/examSectionLockEngine.js';

const HSK79_SECTION_DRAFT_PREFIX = 'hanzigo_hsk79_section_lock_v1_';

const SKILL_META = [
  { id: 'listening', label: '1. 听力', titleZh: '第一部分：听力理解', icon: Headphones },
  { id: 'reading', label: '2. 阅读', titleZh: '第二部分：阅读理解', icon: BarChart3 },
  { id: 'writing', label: '3. 写作', titleZh: '第三部分：书面表达', icon: FileText },
  { id: 'translation', label: '4. 翻译', titleZh: '第四部分：汉越笔译', icon: Languages },
  { id: 'speaking', label: '5. 口语', titleZh: '第五部分：口语表达', icon: Mic },
];

const PART_ZH = {
  1: '第一部分',
  2: '第二部分',
  3: '第三部分',
  4: '第四部分',
};

function formatClock(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function isQuestionAnswered(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === 'number') return true;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

export default function Hsk7to9FullMockSimulator({
  exam,
  answers = {},
  onAnswerChange,
  timeLeft: initialTimeLeft = 12000,
  isSubmitting = false,
  strictSectionLock = true,
  onSubmit,
  onExit,
}) {
  const questions = useMemo(() => (Array.isArray(exam?.questions) ? exam.questions : []), [exam]);

  // Group questions by skill in official HSK 7-9 order
  const sections = useMemo(() => {
    return SKILL_META.map((meta) => {
      const items = questions.filter((q) => (q.part_type || q.skill) === meta.id);
      return { ...meta, items };
    }).filter((sec) => sec.items.length > 0);
  }, [questions]);

  const sectionSchedule = useMemo(
    () => buildExamSectionSchedule({ exam: { ...exam, duration_minutes: exam?.duration_minutes || 200 }, questions }),
    [exam, questions]
  );

  const lockStorageKey = `${HSK79_SECTION_DRAFT_PREFIX}${exam?.id || 'default'}`;
  const [sectionLock, setSectionLock] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem(lockStorageKey);
      if (raw) saved = JSON.parse(raw);
    } catch {}
    return createSectionLockState({
      sections: sectionSchedule,
      strictSectionLock,
      restoredDraft: saved,
    });
  });

  const [activeSkill, setActiveSkill] = useState(
    () => sectionSchedule[sectionLock?.activeSectionIndex]?.skill || sections[0]?.id || 'listening'
  );
  const [playingId, setPlayingId] = useState(null);
  const [playCounts, setPlayCounts] = useState({});
  const [recordingId, setRecordingId] = useState(null);
  const [showGenkouMap, setShowGenkouMap] = useState({});
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [confirmFinishSectionOpen, setConfirmFinishSectionOpen] = useState(false);
  const [isComposingIme, setIsComposingIme] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const recognitionRef = useRef(null);
  const sectionLockRef = useRef(sectionLock);
  const autoSubmitTriggeredRef = useRef(false);
  sectionLockRef.current = sectionLock;

  const stopMediaOnTransition = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch {}
    setPlayingId(null);
    setRecordingId(null);
  }, []);

  const persistLockDraft = useCallback(
    (nextState) => {
      try {
        localStorage.setItem(
          lockStorageKey,
          JSON.stringify({ ...serializeSectionLockDraft(nextState), savedAt: Date.now() })
        );
      } catch {}
    },
    [lockStorageKey]
  );

  useEffect(() => {
    if (sectionSchedule.length === 0) return;
    setSectionLock((prev) => {
      if (prev && prev.sectionDurations?.length === sectionSchedule.length) {
        return prev;
      }
      let saved = null;
      try {
        const raw = localStorage.getItem(lockStorageKey);
        if (raw) saved = JSON.parse(raw);
      } catch {}
      const next = createSectionLockState({
        sections: sectionSchedule,
        strictSectionLock,
        restoredDraft: saved,
      });
      const targetSkill = sectionSchedule[next.activeSectionIndex]?.skill;
      if (targetSkill) setActiveSkill(targetSkill);
      return next;
    });
  }, [sectionSchedule, strictSectionLock, lockStorageKey]);

  useEffect(() => {
    if (sections.length > 0 && !sections.some((s) => s.id === activeSkill)) {
      setActiveSkill(sections[0].id);
    }
  }, [sections, activeSkill]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  }, []);

  // CTI Section Timer Tick (Nghe 30p -> Đọc 60p -> Viết 55p -> Dịch 30p -> Nói 25p = 200p)
  useEffect(() => {
    if (!strictSectionLock || isSubmitting || sectionSchedule.length === 0) return;
    let tickCount = 0;
    const timer = setInterval(() => {
      tickCount += 1;
      const res = tickSectionTimer(sectionLockRef.current, 1);
      sectionLockRef.current = res.nextState;
      setSectionLock(res.nextState);

      if (res.sectionAdvanced) {
        stopMediaOnTransition();
        const prevSec = sections[res.previousSectionIndex];
        const nextSec = sections[res.nextState.activeSectionIndex];
        if (nextSec) setActiveSkill(nextSec.id);
        persistLockDraft(res.nextState);
        showToast(
          `⏱️ ${prevSec?.label || '上一部分'} 时间结束并已锁定，已进入 ${nextSec?.label || '下一部分'}。`
        );
      } else if (tickCount % 5 === 0) {
        persistLockDraft(res.nextState);
      }

      if (res.autoSubmit && !autoSubmitTriggeredRef.current) {
        autoSubmitTriggeredRef.current = true;
        stopMediaOnTransition();
        persistLockDraft(res.nextState);
        clearInterval(timer);
        if (onSubmit) onSubmit();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [strictSectionLock, isSubmitting, sectionSchedule.length, sections, onSubmit, persistLockDraft, showToast, stopMediaOnTransition]);

  // Cleanup TTS & microphone on unmount
  useEffect(() => {
    return () => {
      stopMediaOnTransition();
    };
  }, [stopMediaOnTransition]);

  const handleConfirmFinishSectionEarly = () => {
    setConfirmFinishSectionOpen(false);
    stopMediaOnTransition();
    const res = finishCurrentSectionEarly(sectionLockRef.current);
    sectionLockRef.current = res.nextState;
    setSectionLock(res.nextState);
    persistLockDraft(res.nextState);
    if (res.sectionAdvanced) {
      const prevSec = sections[res.previousSectionIndex];
      const nextSec = sections[res.nextState.activeSectionIndex];
      if (nextSec) setActiveSkill(nextSec.id);
      showToast(`🔒 已锁定 ${prevSec?.label || '本部分'}，进入 ${nextSec?.label || '下一部分'}。`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (res.autoSubmit && onSubmit) {
      onSubmit();
    }
  };

  const activeSecRemaining = strictSectionLock
    ? getActiveSectionRemainingSeconds(sectionLock)
    : initialTimeLeft;
  const totalExamRemaining = strictSectionLock
    ? getTotalRemainingSeconds(sectionLock)
    : initialTimeLeft;
  const sectionLowTime = strictSectionLock && isSectionTimeLow(sectionLock, 120);
  const activeSecIdx = sectionLock?.activeSectionIndex ?? 0;
  const hasNextUnlockedSection = strictSectionLock && activeSecIdx < sections.length - 1;

  const speakAudio = useCallback((q, rate = 0.92) => {
    const text = q.audio_script || q.audioText || q.prompt || '';
    if (!text) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-CN';
      utter.rate = rate;
      setPlayingId(q.id);
      setPlayCounts((prev) => ({ ...prev, [q.id]: (prev[q.id] || 0) + 1 }));
      utter.onend = () => setPlayingId(null);
      utter.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utter);
    } catch {
      setPlayingId(null);
    }
  }, []);

  const toggleRecording = useCallback(
    (q) => {
      if (typeof window === 'undefined') return;
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        showToast('当前浏览器暂不支持语音识别，请直接输入作答内容。');
        return;
      }

      if (recordingId === q.id && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        setRecordingId(null);
        return;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      try {
        const rec = new SpeechRec();
        rec.lang = 'zh-CN';
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i += 1) {
            transcript += event.results[i][0].transcript;
          }
          const existing = typeof answers[q.id] === 'string' ? answers[q.id] : '';
          onAnswerChange(q.id, transcript || existing);
        };
        rec.onerror = () => setRecordingId(null);
        rec.onend = () => setRecordingId(null);
        recognitionRef.current = rec;
        rec.start();
        setRecordingId(q.id);
      } catch {
        setRecordingId(null);
      }
    },
    [recordingId, answers, onAnswerChange, showToast]
  );

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && isComposingIme) {
      e.stopPropagation();
    }
  };

  const totalAnswered = useMemo(
    () => questions.filter((q) => isQuestionAnswered(answers[q.id])).length,
    [questions, answers]
  );

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSkill) || sections[0],
    [sections, activeSkill]
  );

  const groupedByPart = useMemo(() => {
    if (!activeSection) return [];
    const map = new Map();
    for (const q of activeSection.items) {
      const partNum = Number(q.part_number || q.part || 1);
      if (!map.has(partNum)) map.set(partNum, []);
      map.get(partNum).push(q);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-slate-100 pb-20">
      {/* ===================================================================
          1. TOP CBT EXAM HEADER: 计时器 & 五项技能导航
      =================================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-b border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] text-[#243447] dark:text-slate-200 transition cursor-pointer shrink-0"
                  title="返回"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold uppercase shrink-0">
                    HSK 7–9 CBT
                  </span>
                  <h1 className="text-base sm:text-xl font-black text-[#243447] dark:text-white font-['Noto_Serif_SC'] truncate">
                    HSK（七—九级）全真综合模拟试卷
                  </h1>
                </div>
                <div className="text-xs text-[#748092] dark:text-slate-400 mt-0.5">
                  已完成：<strong className="text-[#243447] dark:text-white">{totalAnswered}</strong> / {questions.length} 题
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold ${
                  sectionLowTime
                    ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F]'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>
                  {activeSection?.label || ''}: {formatClock(activeSecRemaining)}
                </span>
                {strictSectionLock && (
                  <span className="text-[10px] font-sans text-[#748092] dark:text-slate-400">
                    / {formatClock(totalExamRemaining)}
                  </span>
                )}
              </div>

              {hasNextUnlockedSection && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setConfirmFinishSectionOpen(true)}
                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 transition cursor-pointer"
                >
                  Kết thúc phần này sớm
                </button>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setConfirmSubmitOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-extrabold text-xs hover:opacity-95 disabled:opacity-50 transition shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? '正在评分...' : '交卷并评定等级'}</span>
              </button>
            </div>
          </div>

          {/* 5-Section CBT Navigation Tabs (Khóa cứng theo pha CTI) */}
          <nav className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {sections.map((sec, secIdx) => {
              const Icon = sec.icon;
              const isActive = activeSection?.id === sec.id;
              const status = getSectionStatus(sectionLock, secIdx);
              const accessible = canAccessSection(sectionLock, secIdx);
              const doneCount = sec.items.filter((q) => isQuestionAnswered(answers[q.id])).length;
              return (
                <button
                  key={sec.id}
                  type="button"
                  disabled={!accessible}
                  onClick={() => {
                    if (accessible) setActiveSkill(sec.id);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#E85D3F] text-white border-[#E85D3F] shadow-sm cursor-pointer'
                      : accessible
                        ? 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#5B6B7F] dark:text-slate-300 border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F]/50 cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {status === SECTION_STATES.LOCKED_COMPLETED ? (
                    <span className="shrink-0">🔒</span>
                  ) : status === SECTION_STATES.LOCKED_UPCOMING ? (
                    <span className="shrink-0">⏳</span>
                  ) : (
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{sec.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {doneCount}/{sec.items.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. MAIN EXAM WORKSPACE
      =================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {activeSection && (
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase text-[#E85D3F]">
                {activeSection.titleZh}
              </span>
              <div className="text-xs text-[#748092] dark:text-slate-400 mt-0.5">
                本部分共 {activeSection.items.length} 题
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeSection.items.map((q) => {
                const answered = isQuestionAnswered(answers[q.id]);
                return (
                  <a
                    key={q.id}
                    href={`#q-${q.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(`q-${q.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center border transition ${
                      answered
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-400 hover:border-[#E85D3F]'
                    }`}
                  >
                    {q.question_number}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {groupedByPart.map(([partNum, partItems]) => (
          <section key={partNum} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-[#E85D3F]/30 text-xs font-extrabold text-[#E85D3F]">
                {PART_ZH[partNum] || `第 ${partNum} 部分`}
              </span>
              <span className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                共 {partItems.length} 题
              </span>
            </div>

            {partItems.map((q) => {
              const skill = q.part_type || q.skill;
              const val = answers[q.id];
              const options = Array.isArray(q.options) ? q.options : [];
              const keywords = q.writing_criteria || q.required_words || [];

              // LISTENING / READING MCQ CARD
              if (skill === 'listening' || skill === 'reading') {
                return (
                  <div
                    id={`q-${q.id}`}
                    key={q.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="text-sm sm:text-base font-bold text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC'] whitespace-pre-line">
                        第 {q.question_number} 题：{q.prompt}
                      </div>

                      {skill === 'listening' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => speakAudio(q, 0.92)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                              playingId === q.id
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white hover:opacity-95'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>
                              {playingId === q.id
                                ? '正在播放...'
                                : `播放录音 (1.0x)${playCounts[q.id] ? ` · ${playCounts[q.id]}` : ''}`}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => speakAudio(q, 0.78)}
                            className="px-3 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 text-xs font-bold hover:border-[#E85D3F] cursor-pointer"
                          >
                            0.8x
                          </button>
                        </div>
                      )}
                    </div>

                    {options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {options.map((opt, idx) => {
                          const optText = typeof opt === 'string' ? opt : opt.text;
                          const isSelected = val === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => onAnswerChange(q.id, idx)}
                              className={`text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition cursor-pointer ${
                                isSelected
                                  ? 'bg-orange-50 dark:bg-orange-950/40 border-[#E85D3F] text-[#E85D3F] font-bold'
                                  : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-slate-200 hover:border-[#E85D3F]/50'
                              }`}
                            >
                              {optText}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // WRITING ESSAY CARD (with 稿纸 square grid for long essays)
              if (skill === 'writing') {
                const textVal = typeof val === 'string' ? val : '';
                const targetChars = q.min_words || (partNum === 2 ? 400 : 250);
                const showGrid = Boolean(showGenkouMap[q.id]);
                const gridSize = Math.max(400, targetChars >= 400 ? 600 : 400);
                const genkouCells = showGrid
                  ? Array.from({ length: gridSize }, (_, idx) => textVal[idx] || '')
                  : [];

                return (
                  <div
                    id={`q-${q.id}`}
                    key={q.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#E85D3F]">
                        第 {q.question_number} 题 · {PART_ZH[partNum] || '书面表达'}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-extrabold ${
                            textVal.trim().length >= targetChars
                              ? 'text-emerald-600 dark:text-emerald-300'
                              : 'text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          当前字数：{textVal.trim().length} / {targetChars} 字
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowGenkouMap((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                          }
                          className="px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-[#E85D3F]/30 text-xs font-bold text-[#E85D3F] cursor-pointer"
                        >
                          {showGrid ? '隐藏稿纸' : '显示稿纸'}
                        </button>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-[#243447] dark:text-slate-200 leading-relaxed font-['Noto_Serif_SC'] whitespace-pre-line">
                      {q.prompt}
                    </p>

                    {keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                          参考关键词：
                        </span>
                        {keywords.map((kw) => {
                          const used = textVal.includes(kw);
                          return (
                            <span
                              key={kw}
                              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                                used
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-slate-400'
                              }`}
                            >
                              {kw} {used ? '✓' : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <textarea
                      rows={partNum === 2 ? 10 : 7}
                      value={textVal}
                      onCompositionStart={() => setIsComposingIme(true)}
                      onCompositionEnd={() => setIsComposingIme(false)}
                      onKeyDown={handleTextareaKeyDown}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      placeholder="请在此输入您的中文作文..."
                      className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
                    />

                    {showGrid && (
                      <div className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#0E141D] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#748092] dark:text-slate-400 font-medium">
                          <span>标准稿纸（每行20字 • 共 {gridSize} 格）</span>
                          <span>每段开头空两格</span>
                        </div>
                        <div className="grid grid-cols-10 sm:grid-cols-15 lg:grid-cols-20 gap-0.5 max-h-64 overflow-y-auto p-1">
                          {genkouCells.map((ch, idx) => (
                            <div
                              key={idx}
                              className={`aspect-square flex items-center justify-center text-xs font-['Noto_Serif_SC'] border ${
                                idx === targetChars - 1
                                  ? 'border-[#E85D3F] bg-orange-50 dark:bg-orange-950/50 text-[#E85D3F] font-black'
                                  : 'border-[#E8DCCF] dark:border-[#253244] text-[#243447] dark:text-slate-200'
                              }`}
                            >
                              {ch}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // TRANSLATION CARD
              if (skill === 'translation') {
                const textVal = typeof val === 'string' ? val : '';
                return (
                  <div
                    id={`q-${q.id}`}
                    key={q.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-amber-700 dark:text-amber-300">
                        第 {q.question_number} 题 · {PART_ZH[partNum] || '笔译'}
                      </h3>
                      <span className="text-xs text-[#748092] dark:text-slate-400 font-semibold">
                        评分标准：信 • 达 • 雅
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                      <p className="text-sm sm:text-base font-bold text-[#243447] dark:text-white leading-relaxed whitespace-pre-line">
                        {q.prompt}
                      </p>

                      {keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-xs text-[#748092] dark:text-slate-400 font-medium">
                            参考核心词汇：
                          </span>
                          {keywords.map((kw) => {
                            const used = textVal.toLowerCase().includes(kw.toLowerCase());
                            return (
                              <span
                                key={kw}
                                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                                  used
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#5B6B7F] dark:text-slate-300'
                                }`}
                              >
                                {kw} {used ? '✓' : ''}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={textVal}
                      onCompositionStart={() => setIsComposingIme(true)}
                      onCompositionEnd={() => setIsComposingIme(false)}
                      onKeyDown={handleTextareaKeyDown}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      placeholder="请在此输入您的中文译文..."
                      className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
                    />
                  </div>
                );
              }

              // SPEAKING CARD
              const textVal = typeof val === 'string' ? val : '';
              const isRecording = recordingId === q.id;
              return (
                <div
                  id={`q-${q.id}`}
                  key={q.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#243447] dark:text-white">
                      第 {q.question_number} 题 · {PART_ZH[partNum] || '口语表达'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleRecording(q)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>正在录音...（点击停止）</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>开始口语录音</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <p className="text-sm sm:text-base font-bold text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC'] whitespace-pre-line">
                      {q.prompt}
                    </p>
                  </div>

                  <textarea
                    rows={5}
                    value={textVal}
                    onCompositionStart={() => setIsComposingIme(true)}
                    onCompositionEnd={() => setIsComposingIme(false)}
                    onKeyDown={handleTextareaKeyDown}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    placeholder="请在此输入或通过麦克风录制您的中文口语作答内容..."
                    className="w-full p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] focus:border-[#E85D3F] focus:outline-none text-base sm:text-sm text-[#243447] dark:text-white leading-relaxed font-['Noto_Serif_SC']"
                  />
                </div>
              );
            })}
          </section>
        ))}

        {/* Bottom Section Switcher */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
          {(() => {
            const idx = sections.findIndex((s) => s.id === activeSection?.id);
            const prevSec = idx > 0 ? sections[idx - 1] : null;
            const nextSec = idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null;
            const prevAccessible = prevSec ? canAccessSection(sectionLock, idx - 1) : false;
            const nextAccessible = nextSec ? canAccessSection(sectionLock, idx + 1) : false;
            return (
              <>
                <button
                  type="button"
                  disabled={!prevSec || !prevAccessible}
                  onClick={() => {
                    if (prevSec && prevAccessible) {
                      setActiveSkill(prevSec.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  {prevSec ? (prevAccessible ? `← 上一部分：${prevSec.label}` : `🔒 ${prevSec.label}`) : '← 已是第一部分'}
                </button>
                {nextSec ? (
                  strictSectionLock ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setConfirmFinishSectionOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Kết thúc phần này & sang {nextSec.label} →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!nextAccessible}
                      onClick={() => {
                        setActiveSkill(nextSec.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-extrabold cursor-pointer"
                    >
                      下一部分：{nextSec.label} →
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setConfirmSubmitOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold cursor-pointer"
                  >
                    完成并交卷
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </main>

      {/* 2-Step Early Finish Section Confirmation Modal */}
      {confirmFinishSectionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#243447] dark:text-white">
              Xác nhận kết thúc sớm phân môn?
            </h3>
            <p className="text-sm text-[#5B6B7F] dark:text-slate-300 leading-relaxed">
              Sau khi kết thúc <strong>{activeSection?.label}</strong>, phân môn này sẽ bị khóa cứng và không thể quay lại chỉnh sửa. Hệ thống sẽ chuyển ngay sang phân môn kế tiếp.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmFinishSectionOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-slate-200 cursor-pointer"
              >
                Tiếp tục làm phần này
              </button>
              <button
                type="button"
                onClick={handleConfirmFinishSectionEarly}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold cursor-pointer"
              >
                Khóa phần này & chuyển tiếp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chinese Submit Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#243447] dark:text-white">确认交卷</h3>
            <p className="text-sm text-[#5B6B7F] dark:text-slate-300 leading-relaxed">
              当前已完成 <strong>{totalAnswered}</strong> / {questions.length} 题。提交后系统将立即评定成绩并生成完整试卷解析。
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-slate-200 cursor-pointer"
              >
                继续答题
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setConfirmSubmitOpen(false);
                  if (onSubmit) onSubmit();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-extrabold cursor-pointer"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
