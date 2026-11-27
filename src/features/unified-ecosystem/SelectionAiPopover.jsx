import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  BookOpen,
  Mic,
  Square,
  RotateCcw,
  BookmarkPlus,
  BookmarkCheck,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  cancelActiveSelectionRequest,
  lookupLocalSelectionEntry,
  fetchSelectionAiInsight,
  evaluateSelectionPronunciation,
  saveSelectionToSrs,
  handoffSelectionToAiTutor,
  redactSelectionPii,
  isValidVietnameseMeaning,
} from '../../services/selectionAiService.js';

const TABS = [
  { id: 'dictionary', label: 'Tra từ', Icon: BookOpen },
  { id: 'grammar', label: 'Ngữ pháp', Icon: Sparkles },
  { id: 'pronunciation', label: 'Phát âm', Icon: Mic },
];

export default function SelectionAiPopover({
  isOpen = false,
  activeTab = 'dictionary',
  onTabChange,
  onClose,
  selectedText = '',
  contextSentence = '',
  anchorRect = null,
  user = null,
  onSpeak = null,
  onQuickSaveVocab = null,
}) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  // Local dictionary entry (0ms, zero network)
  const localEntry = useMemo(
    () => lookupLocalSelectionEntry(selectedText),
    [selectedText]
  );

  const userHskLevel = user?.hskLevel || localEntry.hskLevel || 'HSK 1';

  // AI Insight state for Tab 1 (lazy click) & Tab 2 (auto on tab open)
  const [aiInsightMap, setAiInsightMap] = useState({});
  const [insightLoadingAction, setInsightLoadingAction] = useState(null);
  const [insightNotice, setInsightNotice] = useState('');

  // Tab 3 Pronunciation recording & evaluation state
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluatingPron, setIsEvaluatingPron] = useState(false);
  const [micError, setMicError] = useState('');
  const [pronResult, setPronResult] = useState(null);
  const [pronNotice, setPronNotice] = useState('');

  // Shared bottom bar HITL SRS state
  const [isSavingSrs, setIsSavingSrs] = useState(false);
  const [savedSrs, setSavedSrs] = useState(false);

  const popoverRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const recordStartedAtRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 640);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const stopRecordingResources = useCallback(() => {
    try {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    } catch {}
    speechRecognitionRef.current = null;

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch {}

    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch {}
    mediaStreamRef.current = null;
  }, []);

  // Reset transient states and abort old requests whenever selection changes or closes
  useEffect(() => {
    cancelActiveSelectionRequest();
    setAiInsightMap({});
    setInsightLoadingAction(null);
    setInsightNotice('');
    setMicError('');
    setPronResult(null);
    setPronNotice('');
    setSavedSrs(false);
    setIsRecording(false);
    setIsEvaluatingPron(false);
    stopRecordingResources();
  }, [selectedText, contextSentence, stopRecordingResources]);

  useEffect(() => {
    if (!isOpen) {
      cancelActiveSelectionRequest();
      stopRecordingResources();
      return undefined;
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        cancelActiveSelectionRequest();
        onClose?.();
      }
    };

    const onPointerDownOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        cancelActiveSelectionRequest();
        onClose?.();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDownOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDownOutside);
    };
  }, [isOpen, onClose, stopRecordingResources]);

  const requestAiInsight = useCallback(
    async (action) => {
      if (!selectedText) return;
      setInsightLoadingAction(action);
      setInsightNotice('');
      try {
        const res = await fetchSelectionAiInsight({
          action,
          selectedText,
          contextSentence,
          userHskLevel,
          user,
        });
        if (res?.aborted) return;
        if (res?.ok && res?.insight) {
          setAiInsightMap((prev) => ({ ...prev, [action]: res.insight }));
          setInsightNotice(res.fallbackNotice || '');
        } else if (res?.error) {
          setInsightNotice(res.error);
        }
      } finally {
        setInsightLoadingAction((curr) => (curr === action ? null : curr));
      }
    },
    [selectedText, contextSentence, userHskLevel, user]
  );

  // Auto-load grammar analysis only when Tab 'grammar' is active
  useEffect(() => {
    if (!isOpen || activeTab !== 'grammar' || !selectedText) return;
    if (!aiInsightMap.grammar) {
      void requestAiInsight('grammar');
    }
  }, [isOpen, activeTab, selectedText, aiInsightMap.grammar, requestAiInsight]);

  const desktopStyle = useMemo(() => {
    if (isMobile || typeof window === 'undefined') return undefined;
    const width = Math.min(448, window.innerWidth - 24);
    const estHeight = 460;
    const rect = anchorRect || {
      top: window.innerHeight * 0.25,
      bottom: window.innerHeight * 0.3,
      left: window.innerWidth / 2 - width / 2,
      width: 0,
    };

    const left = Math.max(
      12,
      Math.min(window.innerWidth - width - 12, rect.left + (rect.width || 0) / 2 - width / 2)
    );
    const spaceBelow = window.innerHeight - (rect.bottom || 0) - 16;
    const top =
      spaceBelow >= 280
        ? Math.min(window.innerHeight - estHeight - 12, Math.max(12, (rect.bottom || 0) + 10))
        : Math.max(12, Math.min(window.innerHeight - estHeight - 12, (rect.top || 120) - estHeight - 10));

    return {
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
    };
  }, [isMobile, anchorRect]);

  const handleStartRecording = async () => {
    setMicError('');
    setPronNotice('');
    transcriptRef.current = '';
    audioChunksRef.current = [];
    recordStartedAtRef.current = Date.now();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicError('Trình duyệt không hỗ trợ ghi âm micro. Hãy thử lại trên Chrome/Edge hoặc thiết bị có micro.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const SpeechRec =
        typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = 'zh-CN';
          rec.interimResults = true;
          rec.maxAlternatives = 1;
          rec.onresult = (event) => {
            const text = Array.from(event.results || [])
              .map((r) => r?.[0]?.transcript || '')
              .join('')
              .trim();
            if (text) transcriptRef.current = text;
          };
          rec.onerror = () => {};
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {}
      }

      if (typeof MediaRecorder !== 'undefined') {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            audioChunksRef.current.push(ev.data);
          }
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      }

      setIsRecording(true);
    } catch (err) {
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
      setMicError(
        denied
          ? 'Bạn đã từ chối quyền micro. Hãy cấp quyền micro trong trình duyệt để chấm điểm phát âm.'
          : 'Không thể khởi động micro trên thiết bị này.'
      );
      stopRecordingResources();
    }
  };

  const handleStopAndEvaluate = async () => {
    setIsRecording(false);
    setIsEvaluatingPron(true);
    const durationMs = Math.max(400, Date.now() - (recordStartedAtRef.current || Date.now()));

    let audioBlob = null;
    try {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        audioBlob = await new Promise((resolve) => {
          const prevStop = recorder.onstop;
          recorder.onstop = () => {
            if (typeof prevStop === 'function') prevStop();
            resolve(
              audioChunksRef.current.length > 0
                ? new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
                : null
            );
          };
          recorder.stop();
        });
      }
    } catch {
      audioBlob = null;
    } finally {
      stopRecordingResources();
    }

    let audioBase64 = null;
    if (audioBlob && typeof FileReader !== 'undefined') {
      try {
        audioBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(audioBlob);
        });
      } catch {
        audioBase64 = null;
      }
    }

    try {
      const res = await evaluateSelectionPronunciation({
        targetHanzi: selectedText,
        targetPinyin: localEntry.pinyin,
        spokenTranscript: transcriptRef.current,
        audioBase64,
        mimeType: audioBlob?.type || 'audio/webm',
        audioDurationMs: durationMs,
        hskLevel: userHskLevel,
        user,
      });
      if (res?.ok && res?.result) {
        setPronResult(res.result);
        setPronNotice(res.fallbackNotice || '');
      }
    } finally {
      setIsEvaluatingPron(false);
    }
  };

  const handleSaveToSrs = async () => {
    if (isSavingSrs || savedSrs) return;
    const activeInsight = aiInsightMap.context_explain || aiInsightMap.grammar;
    const pinyin = activeInsight?.pinyin || localEntry.pinyin || '';
    const candidateMeaning =
      activeInsight?.contextualMeaningVi || localEntry.meaningVi || '';
    if (!isValidVietnameseMeaning(candidateMeaning)) {
      setInsightNotice(
        'Chưa có nghĩa tiếng Việt chuẩn để lưu SRS — hãy bấm "Giải thích theo ngữ cảnh (AI)" trước.'
      );
      return;
    }

    setIsSavingSrs(true);
    try {
      const saveRes = await saveSelectionToSrs({
        user,
        hanzi: selectedText,
        pinyin,
        meaningVi: candidateMeaning,
        hskLevel: localEntry.hskLevel || userHskLevel,
        contextSentence,
      });
      if (!saveRes?.ok) {
        if (saveRes?.error) setInsightNotice(saveRes.error);
        return;
      }
      if (onQuickSaveVocab) {
        await onQuickSaveVocab(selectedText, {
          source_type: 'selection',
          sentence_zh: contextSentence || selectedText,
        }).catch(() => {});
      }
      setSavedSrs(true);
    } finally {
      setIsSavingSrs(false);
    }
  };

  const handleAskTutorDeep = () => {
    handoffSelectionToAiTutor({ selectedText, contextSentence });
    onClose?.();
  };

  if (!isOpen || !selectedText) return null;

  const contextInsight = aiInsightMap.context_explain || null;
  const grammarInsight = aiInsightMap.grammar || null;
  const cleanContextPreview = redactSelectionPii(contextSentence || selectedText);

  const containerClassName = isMobile
    ? 'fixed inset-x-0 bottom-0 z-50 w-full rounded-t-3xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl max-h-screen overflow-y-auto'
    : 'fixed z-50 w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl max-h-screen overflow-y-auto';

  return (
    <div className={isMobile ? 'fixed inset-0 z-50 bg-black/40' : ''}>
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="selection-ai-popover-title"
        style={desktopStyle}
        className={containerClassName}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex items-center gap-2">
              <h2
                id="selection-ai-popover-title"
                className="text-lg font-black text-slate-900 dark:text-white truncate"
              >
                {selectedText}
              </h2>
              {localEntry.pinyin && (
                <span className="text-xs font-bold text-[#E85D3F] truncate">
                  {localEntry.pinyin}
                </span>
              )}
              {localEntry.hskLevel && (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0">
                  {localEntry.hskLevel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                aria-label="Nghe cụm chữ Hán"
                onClick={() => onSpeak?.(selectedText, 0.9)}
                className="min-h-11 min-w-11 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-slate-200 dark:border-slate-700 text-[#E85D3F] flex items-center justify-center cursor-pointer"
              >
                <Volume2 size={16} />
              </button>
              <button
                type="button"
                aria-label="Đóng khung AI ngữ cảnh"
                onClick={() => {
                  cancelActiveSelectionRequest();
                  onClose?.();
                }}
                className="min-h-11 min-w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {cleanContextPreview && cleanContextPreview !== selectedText && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words">
              Ngữ cảnh: {cleanContextPreview}
            </p>
          )}

          {/* 3 Shared Tabs */}
          <div className="grid grid-cols-3 gap-1.5">
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange?.(id)}
                  className={`min-h-11 px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#E85D3F] text-white'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          {/* TAB 1: TRA TỪ (0ms Local + Lazy AI CTA) */}
          {activeTab === 'dictionary' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Tra nhanh từ điển nội bộ (0ms)
                  </span>
                  {(localEntry.sinoVietnamese || localEntry.hanviet) && (
                    <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                      Âm Hán-Việt: {localEntry.sinoVietnamese || localEntry.hanviet}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white break-words">
                  {localEntry.meaningVi || 'Bấm "Giải thích theo ngữ cảnh (AI)" để tra nghĩa chi tiết.'}
                </p>
                {Array.isArray(localEntry.relatedCompounds) && localEntry.relatedCompounds.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {localEntry.relatedCompounds.slice(0, 4).map((comp) => (
                      <span
                        key={comp.hanzi}
                        className="px-2.5 py-1 rounded-xl text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {comp.hanzi} ({comp.pinyin}): {comp.meaning}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!contextInsight && (
                <button
                  type="button"
                  disabled={insightLoadingAction === 'context_explain'}
                  onClick={() => requestAiInsight('context_explain')}
                  className="min-h-11 w-full px-4 py-2.5 rounded-2xl bg-[#E85D3F] text-white font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {insightLoadingAction === 'context_explain' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang phân tích theo ngữ cảnh...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Giải thích theo ngữ cảnh (AI)</span>
                    </>
                  )}
                </button>
              )}

              {insightNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px] font-semibold">
                  {insightNotice}
                </div>
              )}

              {contextInsight && (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white break-words">
                    {contextInsight.contextualMeaningVi}
                  </p>
                  {contextInsight.nuanceVi && (
                    <p className="text-slate-600 dark:text-slate-300 break-words">
                      {contextInsight.nuanceVi}
                    </p>
                  )}
                  {Array.isArray(contextInsight.examples) && contextInsight.examples.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {contextInsight.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <p className="font-bold text-slate-900 dark:text-white break-words">
                              {ex.chinese}
                            </p>
                            {ex.pinyin && (
                              <p className="text-[11px] text-[#E85D3F] break-words">{ex.pinyin}</p>
                            )}
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 break-words">
                              {ex.vietnamese}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Nghe câu ví dụ"
                            onClick={() => onSpeak?.(ex.chinese, 0.9)}
                            className="min-h-11 min-w-11 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F] flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NGỮ PHÁP */}
          {activeTab === 'grammar' && (
            <div className="space-y-3">
              {insightLoadingAction === 'grammar' && !grammarInsight && (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#E85D3F]" />
                  <span>Đang phân tích cấu trúc ngữ pháp trong câu...</span>
                </div>
              )}

              {insightNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px] font-semibold">
                  {insightNotice}
                </div>
              )}

              {grammarInsight && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-slate-200 dark:border-slate-700 space-y-1">
                    {grammarInsight.pinyin && (
                      <p className="text-xs font-bold text-[#E85D3F]">{grammarInsight.pinyin}</p>
                    )}
                    <p className="text-sm font-black text-slate-900 dark:text-white break-words">
                      {grammarInsight.grammarStructure}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 break-words">
                      {grammarInsight.contextualMeaningVi}
                    </p>
                  </div>

                  {Array.isArray(grammarInsight.breakdown) && grammarInsight.breakdown.length > 0 && (
                    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <tr>
                            <th className="px-2.5 py-2 font-bold">Thành phần</th>
                            <th className="px-2.5 py-2 font-bold">Pinyin</th>
                            <th className="px-2.5 py-2 font-bold">Vai trò</th>
                            <th className="px-2.5 py-2 font-bold">Nghĩa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {grammarInsight.breakdown.map((row, idx) => (
                            <tr key={idx}>
                              <td className="px-2.5 py-2 font-bold text-slate-900 dark:text-white">
                                {row.segment}
                              </td>
                              <td className="px-2.5 py-2 text-[#E85D3F]">{row.pinyin || '—'}</td>
                              <td className="px-2.5 py-2 text-slate-600 dark:text-slate-300">
                                {row.role}
                              </td>
                              <td className="px-2.5 py-2 text-slate-600 dark:text-slate-300">
                                {row.meaningVi}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {grammarInsight.vietnamesePitfall && (
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-200 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        <span>Lỗi người Việt hay mắc</span>
                      </p>
                      <p className="break-words">{grammarInsight.vietnamesePitfall}</p>
                    </div>
                  )}

                  {Array.isArray(grammarInsight.examples) && grammarInsight.examples.length > 0 && (
                    <div className="space-y-2">
                      {grammarInsight.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <p className="font-bold text-slate-900 dark:text-white break-words">
                              {ex.chinese}
                            </p>
                            {ex.pinyin && (
                              <p className="text-[11px] text-[#E85D3F] break-words">{ex.pinyin}</p>
                            )}
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 break-words">
                              {ex.vietnamese}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Nghe câu ví dụ ngữ pháp"
                            onClick={() => onSpeak?.(ex.chinese, 0.9)}
                            className="min-h-11 min-w-11 rounded-xl bg-white dark:bg-slate-900 text-[#E85D3F] flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PHÁT ÂM (/api/ai/pronunciation) */}
          {activeTab === 'pronunciation' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-black text-slate-900 dark:text-white truncate">
                    {selectedText}
                  </p>
                  <p className="text-xs font-bold text-[#E85D3F]">
                    {localEntry.pinyin || 'Nhấn Nghe mẫu để đối chiếu thanh điệu'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSpeak?.(selectedText, 0.85)}
                  className="min-h-11 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Volume2 size={15} className="text-[#E85D3F]" />
                  <span>Nghe mẫu</span>
                </button>
              </div>

              {micError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-[11px] font-semibold">
                  {micError}
                </div>
              )}

              {pronNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px] font-semibold">
                  {pronNotice}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    disabled={isEvaluatingPron}
                    onClick={handleStartRecording}
                    className="min-h-11 flex-1 px-4 py-2.5 rounded-2xl bg-[#E85D3F] text-white font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isEvaluatingPron ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Đang chấm phát âm...</span>
                      </>
                    ) : (
                      <>
                        <Mic size={15} />
                        <span>{pronResult ? 'Thử lại' : 'Bắt đầu đọc'}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopAndEvaluate}
                    className="min-h-11 flex-1 px-4 py-2.5 rounded-2xl bg-rose-600 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Square size={14} />
                    <span>Dừng &amp; Chấm điểm</span>
                  </button>
                )}

                {pronResult && !isRecording && (
                  <button
                    type="button"
                    onClick={() => {
                      setPronResult(null);
                      setPronNotice('');
                      setMicError('');
                    }}
                    className="min-h-11 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Thử lại</span>
                  </button>
                )}
              </div>

              {pronResult && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-600 dark:text-slate-300">
                      Điểm phát âm
                    </span>
                    <span className="text-lg font-black text-[#E85D3F]">
                      {Number(pronResult.overall || 0)}/100
                    </span>
                  </div>

                  {Array.isArray(pronResult.charBreakdown) && pronResult.charBreakdown.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pronResult.charBreakdown.map((item, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                            item.status === 'correct'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
                          }`}
                        >
                          {item.char} {item.pinyin ? `(${item.pinyin})` : ''} · {item.label || item.status}
                        </span>
                      ))}
                    </div>
                  )}

                  {pronResult.feedback && (
                    <p className="text-slate-600 dark:text-slate-300 break-words">
                      {pronResult.feedback}
                    </p>
                  )}
                  {pronResult.articulatoryTip && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words">
                      Mẹo khẩu hình: {pronResult.articulatoryTip}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shared Footer Bar (2 Action Buttons: HITL Save SRS + Deep Ask Lão Sư AI) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isSavingSrs || savedSrs}
            onClick={handleSaveToSrs}
            className={`min-h-11 px-3 py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 ${
              savedSrs
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-[#FFF9F2] dark:bg-[#131B24] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            {savedSrs ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} className="text-[#E85D3F]" />}
            <span>{savedSrs ? 'Đã lưu SRS' : isSavingSrs ? 'Đang lưu...' : 'Lưu vào sổ SRS'}</span>
          </button>

          <button
            type="button"
            onClick={handleAskTutorDeep}
            className="min-h-11 px-3 py-2 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare size={15} className="text-[#E85D3F]" />
            <span>Hỏi sâu Lão Sư AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
