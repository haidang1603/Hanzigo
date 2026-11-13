import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  PenTool,
  Sparkles,
  Headphones,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Check,
  ArrowRight,
  RotateCw,
  Award,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  syncTextbookUnitToWorkspace,
  markTextbookUnitCompleted,
  extractUniqueHanziFromUnit,
  type TextbookSeries,
  type TextbookUnit,
  type SyncWorkspaceResult,
} from '../../services/textbookCompanionService.ts';

interface UnitAllInOneStudyHubProps {
  series: TextbookSeries;
  unit: TextbookUnit;
  user?: any;
  isCompleted?: boolean;
  onUnitCompleted?: (unitId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

type StudyTab = 'vocab' | 'writing' | 'grammar' | 'dialogue' | 'quiz';

export const UnitAllInOneStudyHub: React.FC<UnitAllInOneStudyHubProps> = ({
  series,
  unit,
  user,
  isCompleted = false,
  onUnitCompleted,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<StudyTab>('vocab');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncWorkspaceResult | null>(null);

  // Flashcard preview state (Tab 1)
  const [flashIdx, setFlashIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Writing character selector (Tab 2)
  const uniqueChars = useMemo(() => extractUniqueHanziFromUnit(unit), [unit]);
  const [selectedChar, setSelectedChar] = useState<string>(uniqueChars[0] || '');

  // Dialogue options (Tab 4)
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVi, setShowVi] = useState(true);

  // Quiz state (Tab 5)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSyncToWorkspace = async () => {
    setIsSyncing(true);
    try {
      const res = await syncTextbookUnitToWorkspace(series, unit, user);
      setSyncResult(res);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCompleteUnit = async () => {
    await markTextbookUnitCompleted(series.id, unit.id, user);
    if (onUnitCompleted) {
      onUnitCompleted(unit.id);
    }
  };

  const handleOpenModule = (tabTarget: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabTarget);
    }
  };

  const currentFlashcard = unit.unit_vocab_list[flashIdx] || unit.unit_vocab_list[0];

  const quizCorrectCount = unit.unit_quiz.filter(
    (q) => quizAnswers[q.id] === q.correct_index
  ).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Unit Header & 1-Click Ecosystem Sync */}
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 font-bold">
                {series.title_zh} · Quyển {unit.volume_number} · Bài {unit.unit_number}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã hoàn thành
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{unit.title_zh}</h3>
            <p className="text-xs sm:text-sm text-emerald-100">{unit.title_vi}</p>
          </div>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToWorkspace}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 text-xs sm:text-sm shadow-md disabled:opacity-50 transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'Đang nạp vào hệ sinh thái...'
                : 'Nạp trọn bộ Bài học vào Hệ sinh thái'}
            </span>
          </button>
        </div>

        {/* Sync Confirmation & Quick Cross-Module Launchers */}
        {syncResult && (
          <div className="rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-3.5 space-y-2.5 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
              <Check className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                Đã tạo Deck “{syncResult.deck.name}” với {syncResult.syncedWordsCount} từ mới &amp; {syncResult.writingChars.length} chữ Hán!
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleOpenModule('vocabulary')}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[11px] font-bold hover:bg-emerald-50 cursor-pointer"
              >
                Mở Vocabulary Workspace ➔
              </button>
              <button
                type="button"
                onClick={() => handleOpenModule('writing')}
                className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-[11px] font-bold hover:bg-white/25 cursor-pointer"
              >
                Mở Hanzi Writing Studio ➔
              </button>
              <button
                type="button"
                onClick={() => handleOpenModule('reader')}
                className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-[11px] font-bold hover:bg-white/25 cursor-pointer"
              >
                Mở Reading Studio ➔
              </button>
              <button
                type="button"
                onClick={() => handleOpenModule('practice')}
                className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-[11px] font-bold hover:bg-white/25 cursor-pointer"
              >
                Mở Listening &amp; Grammar ➔
              </button>
            </div>
          </div>
        )}

        {/* 5-Tab Sequential Study Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/15">
          {[
            { id: 'vocab', label: '1. Từ mới & Flashcard', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'writing', label: '2. Luyện viết chữ Hán', icon: <PenTool className="w-3.5 h-3.5" /> },
            { id: 'grammar', label: '3. Ngữ pháp trọng tâm', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'dialogue', label: '4. Đọc & Nghe bài khóa', icon: <Headphones className="w-3.5 h-3.5" /> },
            { id: 'quiz', label: '5. Kiểm tra cuối bài', icon: <Award className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as StudyTab)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="p-5 sm:p-6">
        {/* TAB 1: VOCAB & FLASHCARD */}
        {activeTab === 'vocab' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Ordered Vocab Table */}
            <div className="lg:col-span-7 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-3.5 py-2.5 w-10">#</th>
                    <th className="px-3.5 py-2.5">Từ mới</th>
                    <th className="px-3.5 py-2.5">Pinyin</th>
                    <th className="px-3.5 py-2.5">Từ loại</th>
                    <th className="px-3.5 py-2.5">Nghĩa tiếng Việt</th>
                    <th className="px-3.5 py-2.5 w-12">Nghe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unit.unit_vocab_list.map((v, i) => (
                    <tr
                      key={v.order}
                      onClick={() => {
                        setFlashIdx(i);
                        setIsFlipped(false);
                      }}
                      className={`cursor-pointer transition ${
                        flashIdx === i ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-3.5 py-2.5 text-slate-400 font-bold">{v.order}</td>
                      <td className="px-3.5 py-2.5 font-black text-base text-slate-900">
                        {v.simplified}
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-emerald-700">{v.pinyin}</td>
                      <td className="px-3.5 py-2.5 text-xs text-slate-500">{v.pos}</td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-800">{v.meaning_vi}</td>
                      <td className="px-3.5 py-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakChinese(v.simplified, 0.85);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interactive Quick Flashcard */}
            {currentFlashcard && (
              <div className="lg:col-span-5 space-y-3">
                <div
                  onClick={() => setIsFlipped((f) => !f)}
                  className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-8 text-center cursor-pointer shadow-xs hover:shadow-md transition min-h-[240px] flex flex-col items-center justify-center space-y-3 select-none"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    Bấm thẻ để lật ({flashIdx + 1}/{unit.unit_vocab_list.length})
                  </span>
                  {!isFlipped ? (
                    <>
                      <div className="text-5xl font-black text-slate-900">
                        {currentFlashcard.simplified}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakChinese(currentFlashcard.simplified, 0.85);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe phát âm</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-black text-emerald-700">
                        {currentFlashcard.pinyin}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        {currentFlashcard.pos}
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {currentFlashcard.meaning_vi}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFlashIdx((prev) =>
                        prev > 0 ? prev - 1 : unit.unit_vocab_list.length - 1
                      );
                      setIsFlipped(false);
                    }}
                    className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    ← Từ trước
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlashIdx((prev) => (prev + 1) % unit.unit_vocab_list.length);
                      setIsFlipped(false);
                    }}
                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Từ tiếp theo →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WRITING CHARACTERS IN UNIT */}
        {activeTab === 'writing' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900">
                  Danh sách {uniqueChars.length} chữ Hán mới trong bài ({unit.title_zh})
                </h4>
                <p className="text-xs text-slate-500">
                  Chọn từng chữ để nghe phát âm hoặc mở thẳng trong Hanzi Writing Studio để luyện nét bút.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenModule('writing')}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-xs cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-amber-400" />
                <span>Mở Hanzi Writing Studio</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {uniqueChars.map((ch) => {
                const isSel = (selectedChar || uniqueChars[0]) === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setSelectedChar(ch);
                      speakChinese(ch, 0.8);
                    }}
                    className={`w-16 h-16 rounded-2xl border-2 font-serif text-3xl font-black flex items-center justify-center transition cursor-pointer relative ${
                      isSel
                        ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-[#fdfbf7] text-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="absolute inset-1.5 border border-dashed border-amber-200/80 rounded-lg pointer-events-none" />
                    <span className="relative z-10">{ch}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GRAMMAR POINTS */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-black text-slate-900">
                Điểm ngữ pháp trọng tâm của Bài {unit.unit_number}
              </h4>
              <button
                type="button"
                onClick={() => handleOpenModule('practice')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                <span>Luyện thêm trong Grammar Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {unit.grammar_points.map((gp) => (
              <div
                key={gp.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-black text-indigo-900">{gp.pattern}</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {gp.pinyin}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {gp.explanation_vi}
                </p>
                <div className="rounded-xl bg-white border border-slate-200/80 p-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">{gp.example_zh}</p>
                    <p className="text-xs text-emerald-700">{gp.example_pinyin}</p>
                    <p className="text-xs text-slate-500 italic">{gp.example_vi}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakChinese(gp.example_zh, 0.85)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: READING & LISTENING DIALOGUE */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    speakChinese(
                      unit.reading_dialogue.map((l) => l.zh).join(' '),
                      0.85
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe toàn bài khóa</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPinyin}
                    onChange={(e) => setShowPinyin(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Hiện Pinyin</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVi}
                    onChange={(e) => setShowVi(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Hiện nghĩa Việt</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {unit.reading_dialogue.map((line, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase">
                      {line.speaker}
                    </span>
                    <p className="text-base font-bold text-slate-900">{line.zh}</p>
                    {showPinyin && (
                      <p className="text-xs font-medium text-emerald-700">{line.pinyin}</p>
                    )}
                    {showVi && (
                      <p className="text-xs text-slate-600 italic">{line.vi}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => speakChinese(line.zh, 0.85)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: END-OF-UNIT QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-5">
            {unit.unit_quiz.map((q, qIdx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-3"
                >
                  <p className="text-sm font-black text-slate-900">
                    Câu {qIdx + 1}: {q.question_vi}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = selectedOpt === optIdx;
                      const isCorrect = q.correct_index === optIdx;
                      let cls = 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400';
                      if (quizSubmitted) {
                        if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-800';
                      } else if (isPicked) {
                        cls = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full text-left rounded-xl border px-4 py-2.5 text-xs sm:text-sm transition cursor-pointer ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="text-xs text-slate-600 bg-white rounded-xl p-2.5 border border-slate-200">
                      <strong>Giải thích:</strong> {q.explanation_vi}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(true)}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  Nộp bài kiểm tra
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-black text-emerald-700">
                    Kết quả: {quizCorrectCount}/{unit.unit_quiz.length} câu đúng
                  </span>
                  <button
                    type="button"
                    onClick={handleCompleteUnit}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 text-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Đánh dấu hoàn thành Bài {unit.unit_number}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

