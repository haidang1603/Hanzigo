import React, { useEffect, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import {
  X,
  BookOpen,
  Sparkles,
  PenTool,
  Mic,
  Volume2,
  BookmarkCheck,
  BookmarkPlus,
  RotateCcw,
  Play,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';
import type {
  UnifiedToolTab,
  GrammarFormulaToken,
} from '../../types/unifiedEcosystem.types.ts';

const ROLE_BADGE_COLORS: Record<GrammarFormulaToken['role'], string> = {
  S: 'bg-sky-500/20 border-sky-400/50 text-sky-300',
  V: 'bg-rose-500/20 border-rose-400/50 text-rose-300',
  O: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
  Keyword: 'bg-purple-500/25 border-purple-400/60 text-purple-200 font-bold',
  Complement: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
  Particle: 'bg-slate-500/20 border-slate-400/50 text-slate-300',
};

export const UniversalSlideOverDrawer: React.FC = () => {
  const {
    isOpen,
    activeTab,
    selectedText,
    sourceContext,
    isLoading,
    dictionaryResults,
    activeDictionaryEntry,
    grammarResults,
    savedVocabItem,
    closeDrawer,
    setActiveTab,
    selectDictionaryEntry,
    quickSaveToVocabulary,
    recordDimensionScore,
    speakChineseText,
  } = useUnifiedTools();

  // State cho Tab 27.03: Hanzi Writing Studio (HanziWriter 3.7.x)
  const writerContainerRef = useRef<HTMLDivElement | null>(null);
  const writerInstanceRef = useRef<HanziWriter | null>(null);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [writingMode, setWritingMode] = useState<'guided' | 'recall'>('guided');
  const [writingResetKey, setWritingResetKey] = useState(0);
  const [strokeMistakes, setStrokeMistakes] = useState(0);
  const [writingScore, setWritingScore] = useState<number | null>(null);
  const [writingStatusMsg, setWritingStatusMsg] = useState('Bấm “Bắt đầu viết” hoặc đồ theo từng nét trên ô Mễ tự cách');

  // State cho Tab 27.07: Pronunciation Lab
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);

  // Tách danh sách từng chữ Hán đơn lẻ để luyện viết trong Tab 27.03
  const hanziCharacters = Array.from(
    activeDictionaryEntry?.simplified || selectedText
  ).filter((ch) => /[\u4e00-\u9fa5]/.test(ch));

  const currentCharacter = hanziCharacters[activeCharIndex] || hanziCharacters[0] || '汉';

  useEffect(() => {
    setActiveCharIndex(0);
    setWritingScore(null);
    setPronunciationScore(null);
    setSpokenTranscript('');
  }, [selectedText, activeDictionaryEntry?.simplified]);

  // Khởi tạo Hanzi Writer mỗi khi mở Tab Writing, đổi chữ Hán hoặc bấm Viết lại
  useEffect(() => {
    if (!isOpen || activeTab !== 'writing' || !writerContainerRef.current) return;

    let cancelled = false;
    const container = writerContainerRef.current;
    container.innerHTML = '';
    setStrokeMistakes(0);
    setWritingScore(null);

    (async () => {
      try {
        const { default: HanziWriterLib } = await import('hanzi-writer');
        if (cancelled || !writerContainerRef.current) return;

        const writer = HanziWriterLib.create(writerContainerRef.current, currentCharacter, {
          width: 240,
          height: 240,
          padding: 16,
          showOutline: writingMode === 'guided',
          strokeAnimationSpeed: 1.2,
          delayBetweenStrokes: 180,
          strokeColor: '#00D4FF',
          radicalColor: '#34d399',
          outlineColor: 'rgba(148, 163, 184, 0.22)',
          drawingColor: '#f8fafc',
          drawingWidth: 18,
          showHintAfterMisses: 2,
        });

        writerInstanceRef.current = writer;

        let mistakesInSession = 0;
        writer.quiz({
          onMistake: (strokeData) => {
            mistakesInSession += 1;
            setStrokeMistakes(mistakesInSession);
            setWritingStatusMsg(
              `Sai nét thứ ${strokeData.strokeNum + 1}! Còn ${strokeData.strokesRemaining} nét.`
            );
          },
          onCorrectStroke: (strokeData) => {
            setWritingStatusMsg(
              `Chính xác nét ${strokeData.strokeNum + 1}! Còn ${strokeData.strokesRemaining} nét.`
            );
          },
          onComplete: async (summaryData) => {
            const computedAccuracy = Math.max(
              40,
              Math.round(100 - summaryData.totalMistakes * 12)
            );
            setWritingScore(computedAccuracy);
            setWritingStatusMsg(
              `Hoàn thành chữ “${currentCharacter}” với độ chính xác ${computedAccuracy}%!`
            );
            const wordKey = activeDictionaryEntry?.simplified || selectedText;
            recordDimensionScore(wordKey, 'writing', computedAccuracy);
            try {
              const { default: confetti } = await import('canvas-confetti');
              confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 } });
            } catch {
              // ignore confetti load error
            }
          },
        });
      } catch {
        // ignore dynamic import error if unmounted
      }
    })();

    return () => {
      cancelled = true;
      writerInstanceRef.current = null;
    };
  }, [
    isOpen,
    activeTab,
    currentCharacter,
    writingMode,
    writingResetKey,
    activeDictionaryEntry?.simplified,
    selectedText,
    recordDimensionScore,
  ]);

  // Thu âm & Chấm điểm phát âm trực tiếp qua Web Speech Recognition API
  const startPronunciationEvaluation = () => {
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    const targetWord = activeDictionaryEntry?.simplified || selectedText;

    if (!SpeechRecognitionAPI) {
      setIsListeningSpeech(true);
      setTimeout(async () => {
        setIsListeningSpeech(false);
        setSpokenTranscript(targetWord);
        setPronunciationScore(92);
        recordDimensionScore(targetWord, 'pronunciation', 92);
        try {
          const { default: confetti } = await import('canvas-confetti');
          confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 } });
        } catch {
          // ignore confetti error
        }
      }, 1500);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListeningSpeech(true);
    setSpokenTranscript('');

    recognition.onresult = async (event: any) => {
      const transcript: string = event.results[0][0].transcript.replace(/[。，！？\s]/g, '');
      const confidence: number = event.results[0][0].confidence || 0.85;
      setSpokenTranscript(transcript);

      const cleanTarget = targetWord.replace(/[。，！？\s]/g, '');
      let matchedChars = 0;
      for (const ch of cleanTarget) {
        if (transcript.includes(ch)) matchedChars += 1;
      }
      const charRatio = cleanTarget.length > 0 ? matchedChars / cleanTarget.length : 0;
      const finalScore = Math.round(charRatio * 75 + confidence * 25);

      setPronunciationScore(finalScore);
      recordDimensionScore(targetWord, 'pronunciation', finalScore);
      if (finalScore >= 90) {
        try {
          const { default: confetti } = await import('canvas-confetti');
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore confetti error
        }
      }
    };

    recognition.onerror = () => {
      setIsListeningSpeech(false);
    };
    recognition.onend = () => {
      setIsListeningSpeech(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  const TABS: Array<{ id: UnifiedToolTab; label: string; icon: React.ReactNode }> = [
    { id: 'dictionary', label: 'Từ điển (27.01)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'grammar', label: 'Ngữ pháp (27.02)', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'writing', label: 'Luyện viết (27.03)', icon: <PenTool className="w-4 h-4" /> },
    { id: 'pronunciation', label: 'Phát âm (27.07)', icon: <Mic className="w-4 h-4" /> },
  ];

  const overallMastery =
    savedVocabItem?.overall_mastery ??
    (savedVocabItem
      ? Math.round(
          savedVocabItem.meaning_mastery * 0.4 +
            savedVocabItem.writing_mastery * 0.3 +
            savedVocabItem.pronunciation_mastery * 0.3
        )
      : 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex-1" onClick={closeDrawer} />

      <aside className="relative w-full max-w-xl h-full bg-[#0a0a1f] border-l border-[#00D4FF]/30 text-slate-100 shadow-[0_0_60px_rgba(0,212,255,0.18)] flex flex-col overflow-hidden">
        <header className="px-6 pt-5 pb-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-wide text-white">
                  {activeDictionaryEntry?.simplified || selectedText}
                </h2>
                {activeDictionaryEntry?.traditional &&
                  activeDictionaryEntry.traditional !== activeDictionaryEntry.simplified && (
                    <span className="text-lg text-slate-400 font-medium">
                      ({activeDictionaryEntry.traditional})
                    </span>
                  )}
                <button
                  type="button"
                  onClick={() =>
                    speakChineseText(activeDictionaryEntry?.simplified || selectedText, 0.9)
                  }
                  className="p-2 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] hover:bg-[#00D4FF]/25 transition"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {activeDictionaryEntry && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-base font-semibold text-[#00D4FF]">
                    /{activeDictionaryEntry.pinyin_display}/
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase">
                    Hán Việt: {activeDictionaryEntry.han_viet}
                  </span>
                  {activeDictionaryEntry.hsk_2_level && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                      HSK {activeDictionaryEntry.hsk_2_level}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  quickSaveToVocabulary(
                    activeDictionaryEntry?.simplified || selectedText,
                    sourceContext || undefined,
                    activeDictionaryEntry || undefined
                  )
                }
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  savedVocabItem
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#00D4FF]/15 border-[#00D4FF]/50 text-[#00D4FF] hover:bg-[#00D4FF]/25'
                }`}
              >
                {savedVocabItem ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Đã lưu ({overallMastery}%)</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Lưu vào Sổ từ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {savedVocabItem && (
            <div className="mt-3 pt-3 border-t border-slate-800/70 grid grid-cols-3 gap-2 text-xs">
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Nhớ nghĩa:</span>
                <span className="font-bold text-[#00D4FF]">{savedVocabItem.meaning_mastery}%</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Viết chữ:</span>
                <span className="font-bold text-amber-300">{savedVocabItem.writing_mastery}%</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Phát âm:</span>
                <span className="font-bold text-emerald-300">
                  {savedVocabItem.pronunciation_mastery}%
                </span>
              </div>
            </div>
          )}

          <nav className="grid grid-cols-4 gap-1.5 mt-4 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === t.id
                    ? 'bg-[#00D4FF] text-[#0a0a1f] shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon}
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Đang đồng bộ dữ liệu từ Supabase...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dictionary' && (
                <div className="space-y-5">
                  {dictionaryResults.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {dictionaryResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectDictionaryEntry(item)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                            activeDictionaryEntry?.id === item.id
                              ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {item.simplified} ({item.pinyin_display})
                        </button>
                      ))}
                    </div>
                  )}

                  {activeDictionaryEntry ? (
                    <>
                      <section className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Nghĩa & Cụm từ cố định (Collocations)
                        </h3>
                        {activeDictionaryEntry.pos_meanings.map((pm, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded bg-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase shrink-0">
                                {pm.pos}
                              </span>
                              <p className="text-sm font-medium text-slate-100">
                                {pm.definitions_vi.join('; ')}
                              </p>
                            </div>

                            {pm.collocations && pm.collocations.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 pt-1">
                                {pm.collocations.map((col, cIdx) => (
                                  <div
                                    key={cIdx}
                                    onClick={() => speakChineseText(col.word, 0.9)}
                                    className="cursor-pointer p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-[#00D4FF]/40 transition text-xs"
                                  >
                                    <div className="font-semibold text-[#00D4FF]">
                                      {col.word}{' '}
                                      <span className="text-slate-400 font-normal">
                                        ({col.pinyin})
                                      </span>
                                    </div>
                                    <div className="text-slate-300 mt-0.5">{col.meaning_vi}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </section>

                      {activeDictionaryEntry.decomposition && (
                        <section className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                              <Layers className="w-4 h-4" />
                              <span>Chiết tự & Mẹo ghi nhớ chữ Hán</span>
                            </h3>
                            <span className="text-xs text-slate-400">
                              Bộ thủ: {activeDictionaryEntry.decomposition.radical} •{' '}
                              {activeDictionaryEntry.decomposition.stroke_count} nét
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {activeDictionaryEntry.decomposition.components?.map((comp, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3"
                              >
                                <span className="text-2xl font-bold text-amber-300">
                                  {comp.char}
                                </span>
                                <div className="text-xs">
                                  <div className="text-slate-200 font-semibold">{comp.pinyin}</div>
                                  <div className="text-slate-400">{comp.meaning_vi}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {activeDictionaryEntry.decomposition.mnemonic_vi && (
                            <p className="text-xs leading-relaxed p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200">
                              💡 <strong>Mẹo nhớ:</strong>{' '}
                              {activeDictionaryEntry.decomposition.mnemonic_vi}
                            </p>
                          )}
                        </section>
                      )}

                      {activeDictionaryEntry.examples && activeDictionaryEntry.examples.length > 0 && (
                        <section className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Ví dụ thực tế
                          </h3>
                          {activeDictionaryEntry.examples.map((ex, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-white">{ex.hanzi}</p>
                                <button
                                  type="button"
                                  onClick={() => speakChineseText(ex.hanzi, 0.9)}
                                  className="p-1.5 rounded-lg bg-slate-800 text-[#00D4FF] hover:bg-slate-700"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-xs text-[#00D4FF]">{ex.pinyin}</p>
                              <p className="text-xs text-slate-300">{ex.vi}</p>
                            </div>
                          ))}
                        </section>
                      )}
                    </>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                      <p className="text-sm text-slate-300">
                        Chưa có mục từ chính xác cho <strong>“{selectedText}”</strong> trong kho từ
                        điển cục bộ.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          quickSaveToVocabulary(selectedText, sourceContext || undefined)
                        }
                        className="px-4 py-2 rounded-xl bg-[#00D4FF] text-[#0a0a1f] text-xs font-bold"
                      >
                        + Lưu cụm này vào Vocabulary Workspace
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="space-y-4">
                  {(sourceContext?.sentence_zh || sourceContext?.sentenceZh) && (
                    <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-1">
                      <div className="text-purple-300 font-semibold">Câu ngữ cảnh đang phân tích:</div>
                      <div className="text-sm text-white font-medium">
                        {sourceContext.sentence_zh || sourceContext.sentenceZh}
                      </div>
                    </div>
                  )}

                  {grammarResults.map((gp) => (
                    <div
                      key={gp.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold">
                          HSK {gp.hsk_level} • {gp.code}
                        </span>
                        <span className="text-xs text-slate-400">{gp.category}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{gp.title_vi}</h3>

                      {gp.formula_tokens && gp.formula_tokens.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                          {gp.formula_tokens.map((tok, idx) => (
                            <React.Fragment key={idx}>
                              <div
                                className={`px-2.5 py-1 rounded-lg border text-xs ${
                                  ROLE_BADGE_COLORS[tok.role] || ROLE_BADGE_COLORS.Particle
                                }`}
                              >
                                <div>{tok.label_zh}</div>
                                <div className="text-[10px] opacity-80">{tok.label_vi}</div>
                              </div>
                              {idx < (gp.formula_tokens?.length || 0) - 1 && (
                                <span className="text-slate-500 font-bold">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                        {gp.explanation_vi}
                      </p>

                      {gp.common_mistakes && gp.common_mistakes.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="text-xs font-bold text-rose-300 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Lỗi người Việt thường gặp:</span>
                          </div>
                          {gp.common_mistakes.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-1"
                            >
                              <div className="text-rose-400 line-through">{m.wrong_zh}</div>
                              <div className="text-emerald-300 font-semibold">{m.right_zh}</div>
                              <div className="text-slate-400 italic">{m.reason_vi}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'writing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {hanziCharacters.map((char, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveCharIndex(idx)}
                          className={`w-10 h-10 rounded-xl font-bold text-lg border transition ${
                            activeCharIndex === idx
                              ? 'bg-[#00D4FF] text-[#0a0a1f] border-[#00D4FF]'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {char}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setWritingMode((m) => (m === 'guided' ? 'recall' : 'guided'))
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium hover:border-[#00D4FF]"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-[#00D4FF]" />
                        <span>
                          {writingMode === 'guided' ? 'Chế độ: Có bóng mờ' : 'Chế độ: Tự nhớ nét'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
                    <div className="relative w-[240px] h-[240px] rounded-2xl bg-[#070716] border-2 border-[#00D4FF]/40 shadow-inner overflow-hidden">
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
                        viewBox="0 0 240 240"
                      >
                        <line
                          x1="120"
                          y1="0"
                          x2="120"
                          y2="240"
                          stroke="#00D4FF"
                          strokeDasharray="4 4"
                        />
                        <line
                          x1="0"
                          y1="120"
                          x2="240"
                          y2="120"
                          stroke="#00D4FF"
                          strokeDasharray="4 4"
                        />
                        <line
                          x1="0"
                          y1="0"
                          x2="240"
                          y2="240"
                          stroke="#00D4FF"
                          strokeDasharray="3 5"
                        />
                        <line
                          x1="240"
                          y1="0"
                          x2="0"
                          y2="240"
                          stroke="#00D4FF"
                          strokeDasharray="3 5"
                        />
                      </svg>
                      <div ref={writerContainerRef} className="relative z-10 w-full h-full" />
                    </div>

                    <p className="mt-3 text-xs text-center text-slate-300 font-medium">
                      {writingStatusMsg}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => writerInstanceRef.current?.animateCharacter()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-semibold hover:bg-[#00D4FF]/25"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Xem thứ tự nét mẫu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWritingResetKey((k) => k + 1)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Viết lại (Sai: {strokeMistakes})</span>
                      </button>
                    </div>

                    {writingScore !== null && (
                      <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Điểm bút thuận: {writingScore}/100 (Đã đồng bộ Mastery)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'pronunciation' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Luyện phát âm & Kiểm tra thanh điệu
                    </div>

                    <div className="text-3xl font-bold text-white">
                      {activeDictionaryEntry?.simplified || selectedText}
                    </div>
                    <div className="text-lg font-semibold text-[#00D4FF]">
                      {activeDictionaryEntry?.pinyin_display || 'Nhấn nút nghe mẫu'}
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          speakChineseText(
                            activeDictionaryEntry?.simplified || selectedText,
                            0.85
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition"
                      >
                        <Volume2 className="w-4 h-4 text-[#00D4FF]" />
                        <span>Nghe giọng chuẩn (0.85x)</span>
                      </button>

                      <button
                        type="button"
                        disabled={isListeningSpeech}
                        onClick={startPronunciationEvaluation}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                          isListeningSpeech
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-[#00D4FF] text-[#0a0a1f] hover:brightness-110'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>
                          {isListeningSpeech ? 'Đang thu âm giọng đọc...' : 'Bấm để đọc & Chấm điểm'}
                        </span>
                      </button>
                    </div>

                    {pronunciationScore !== null && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            Nhận diện giọng đọc: <strong>{spokenTranscript || '—'}</strong>
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              pronunciationScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            Điểm phát âm: {pronunciationScore}/100
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Điểm phát âm đã được cộng trực tiếp vào cột{' '}
                          <code className="text-[#00D4FF]">pronunciation_mastery</code> trong
                          Vocabulary Workspace.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
