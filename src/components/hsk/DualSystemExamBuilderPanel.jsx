import React, { useState, useMemo, useEffect } from 'react';
import { Layers, Dices, BookMarked, Play } from 'lucide-react';
import {
  EXAM_SYSTEMS,
  EXAM_MODES,
  PRACTICE_MODES,
  SKILL_LABELS_VI,
  getBlueprint,
  assembleDualSystemExam,
} from '../../data/hskExamBlueprints.js';
import { ensureAllFullStandardExamsLoaded } from '../../data/hsk30/index.js';
import { getUserMistakeEntries, buildMistakeReviewExam } from '../../services/mistakeNotebookService.js';
import {
  SHUFFLE_PREF_STORAGE_KEY,
  PENDING_SHUFFLE_SESSION_KEY,
  ALL_FIVE_SKILLS,
} from './hskPracticeConstants.js';
import { readShufflePreference } from './hskPracticeHelpers.js';

export default function DualSystemExamBuilderPanel({ user = null, onNavigate, onLaunchHsk7to9Paper }) {
  const [examSystem, setExamSystem] = useState(EXAM_SYSTEMS.HSK_3_0);
  const [level, setLevel] = useState('HSK 1');
  const [examMode, setExamMode] = useState(EXAM_MODES.FULL_EXAM);
  const [selectedSkill, setSelectedSkill] = useState('listening');
  const [selectedPart, setSelectedPart] = useState(1);
  const [selectedPracticeMode, setSelectedPracticeMode] = useState(PRACTICE_MODES.EXAM);
  const [shuffleOptions, setShuffleOptions] = useState(readShufflePreference);
  const [hsk30BankVersion, setHsk30BankVersion] = useState(0);
  const activeMistakeCount = getUserMistakeEntries(user).length;

  const availableLevels = useMemo(
    () =>
      examSystem === EXAM_SYSTEMS.HSK_2_0
        ? ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6']
        : ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'],
    [examSystem]
  );

  const resolvedLevel = availableLevels.includes(level) ? level : availableLevels[0];

  useEffect(() => {
    let active = true;
    ensureAllFullStandardExamsLoaded()
      .then(() => {
        if (active) setHsk30BankVersion((v) => v + 1);
      })
      .catch(() => {
        // Fallback to local registered questions if dynamic chunk load fails
      });
    return () => {
      active = false;
    };
  }, [examSystem, resolvedLevel]);

  const blueprint = useMemo(
    () => getBlueprint(examSystem, resolvedLevel),
    [examSystem, resolvedLevel]
  );

  const availableSkills = useMemo(
    () =>
      Object.entries(blueprint.skills || {})
        .filter(([, cfg]) => cfg && cfg.count > 0)
        .map(([key]) => key),
    [blueprint]
  );

  const selectableSkills =
    examMode === EXAM_MODES.BY_SKILL
      ? Array.from(new Set([...ALL_FIVE_SKILLS, ...availableSkills]))
      : availableSkills;

  const resolvedSkill = selectableSkills.includes(selectedSkill)
    ? selectedSkill
    : (availableSkills[0] || 'listening');

  const availableParts = useMemo(
    () => blueprint.skills?.[resolvedSkill]?.parts || [],
    [blueprint, resolvedSkill]
  );

  const resolvedPart = availableParts.some((p) => Number(p.part) === Number(selectedPart))
    ? Number(selectedPart)
    : Number(availableParts[0]?.part || 1);

  const previewExam = useMemo(
    () =>
      assembleDualSystemExam({
        examSystem,
        level: resolvedLevel,
        mode: examMode,
        skill: resolvedSkill,
        part: resolvedPart,
        _bankVersion: hsk30BankVersion,
      }),
    [examSystem, resolvedLevel, examMode, resolvedSkill, resolvedPart, hsk30BankVersion]
  );

  const isHsk79 = resolvedLevel === 'HSK 7-9';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E85D3F] shrink-0" />
            <span>Trung Tâm Thi Thử Song Song (HSK 2.0 &amp; HSK 3.0)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {examSystem === EXAM_SYSTEMS.HSK_3_0
              ? 'Chuẩn HSK 3.0 (9 cấp)'
              : 'Chuẩn HSK 2.0 (6 cấp hiện hành — Giữ nguyên 100% thang điểm 200/300)'}
          </p>
        </div>

        {/* System Segmented Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => setExamSystem(EXAM_SYSTEMS.HSK_2_0)}
            className={`min-h-11 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              examSystem === EXAM_SYSTEMS.HSK_2_0
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            HSK 2.0 (6 cấp)
          </button>
          <button
            type="button"
            onClick={() => setExamSystem(EXAM_SYSTEMS.HSK_3_0)}
            className={`min-h-11 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              examSystem === EXAM_SYSTEMS.HSK_3_0
                ? 'bg-[#E85D3F] text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            HSK 3.0 (9 cấp)
          </button>
        </div>
      </div>

      {/* Level Pills */}
      <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1">
        {availableLevels.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setLevel(lvl)}
            className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              resolvedLevel === lvl
                ? 'bg-[#E85D3F] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* 3 Exam Modes Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { id: EXAM_MODES.FULL_EXAM, label: '1. Thi thử toàn bộ đề' },
          { id: EXAM_MODES.BY_SKILL, label: '2. Luyện theo từng kỹ năng' },
          { id: EXAM_MODES.BY_PART, label: '3. Luyện theo từng dạng bài' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setExamMode(m.id)}
            className={`min-h-11 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer text-left ${
              examMode === m.id
                ? 'border-[#E85D3F] bg-orange-50 dark:bg-orange-950/30 text-[#E85D3F]'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Skill & Part Selectors for Mode 2 & 3 */}
      {(examMode === EXAM_MODES.BY_SKILL || examMode === EXAM_MODES.BY_PART) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Chọn kỹ năng:</label>
            <div className="flex flex-wrap gap-1.5">
              {selectableSkills.map((sk) => {
                const isSupported = availableSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => setSelectedSkill(sk)}
                    className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      resolvedSkill === sk
                        ? 'bg-[#E85D3F] text-white'
                        : isSupported
                        ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {SKILL_LABELS_VI[sk] || sk}
                  </button>
                );
              })}
            </div>
          </div>

          {examMode === EXAM_MODES.BY_PART && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Chọn phần thi (Part):</label>
              <select
                value={resolvedPart}
                onChange={(e) => setSelectedPart(Number(e.target.value))}
                className="w-full min-h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-xs font-bold text-slate-800 dark:text-white"
              >
                {availableParts.map((p) => (
                  <option key={p.part} value={p.part}>
                    {p.titleVi || `Phần ${p.part}`} ({p.count} câu chuẩn)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Practice Mode Selector (Thi thật CBT vs Luyện tập Learning) */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Chế độ phòng thi:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedPracticeMode(PRACTICE_MODES.EXAM)}
            className={`min-h-11 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPracticeMode === PRACTICE_MODES.EXAM
                ? 'border-[#E85D3F] bg-orange-50/70 dark:bg-orange-950/30 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="text-xs font-black">⏱️ Thi thật (CBT)</div>
            <div className="text-[11px] text-slate-500">Áp lực thời gian, không hiện đáp án trước khi nộp</div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPracticeMode(PRACTICE_MODES.LEARNING)}
            className={`min-h-11 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPracticeMode === PRACTICE_MODES.LEARNING
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="text-xs font-black">📚 Luyện tập (Learning)</div>
            <div className="text-[11px] text-slate-500">Có hướng dẫn tiếng Việt, bật/tắt Pinyin, xem giải thích ngay</div>
          </button>
        </div>

        {/* Dynamic Session Option Shuffler Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={shuffleOptions}
          onClick={() => {
            const nextVal = !shuffleOptions;
            setShuffleOptions(nextVal);
            try {
              localStorage.setItem(SHUFFLE_PREF_STORAGE_KEY, String(nextVal));
            } catch {}
          }}
          className={`w-full min-h-11 px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
            shuffleOptions
              ? 'border-[#E85D3F] bg-orange-50/70 dark:bg-orange-950/30 text-slate-900 dark:text-white'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Dices className="w-4 h-4 shrink-0 text-[#E85D3F]" />
            <div className="min-w-0">
              <div className="text-xs font-black">Xáo trộn thứ tự đáp án A/B/C/D</div>
              <div className="text-[11px] text-slate-500">
                Đảo động vị trí phương án theo từng phiên thi (giữ nguyên khi tải lại trang)
              </div>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 ${
              shuffleOptions
                ? 'bg-[#E85D3F] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {shuffleOptions ? 'Đang bật' : 'Đang tắt'}
          </span>
        </button>
      </div>

      {/* Empty State Guard khi tổ hợp Hệ x Cấp độ x Kỹ năng chưa có câu hỏi */}
      {(!previewExam.questions || previewExam.questions.length === 0) && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            {previewExam.bankCoverage?.emptyReasonVi ||
              `Tổ hợp ${resolvedLevel} (${examSystem === EXAM_SYSTEMS.HSK_3_0 ? 'HSK 3.0' : 'HSK 2.0'}) — ${SKILL_LABELS_VI[resolvedSkill] || resolvedSkill} hiện chưa có câu hỏi khả dụng. Hãy chọn kỹ năng khác hoặc nâng lên HSK 7–9.`}
          </span>
          {examSystem === EXAM_SYSTEMS.HSK_3_0 && resolvedSkill === 'translation' && (
            <button
              type="button"
              onClick={() => setLevel('HSK 7-9')}
              className="min-h-11 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Chuyển sang HSK 7–9 (Dịch thuật)
            </button>
          )}
        </div>
      )}

      {/* Blueprint Summary & Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Cấu hình chuẩn: <span className="text-[#E85D3F]">{blueprint.totalQuestions} câu</span> •{' '}
            <span>{blueprint.durationMinutes} phút</span>
            {isHsk79 && ' (Nghe 30p · Đọc 50p · Viết 55p · Dịch 41p · Nói 24p)'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Ngân hàng lắp ráp: <strong>{previewExam.bankCoverage?.coverageLabelVi}</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeMistakeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                const reviewExam = buildMistakeReviewExam(user);
                if (reviewExam) {
                  try {
                    sessionStorage.setItem('hanzigo_pending_exam_mode', PRACTICE_MODES.LEARNING);
                    sessionStorage.setItem(PENDING_SHUFFLE_SESSION_KEY, String(shuffleOptions));
                  } catch {}
                  onNavigate('take', reviewExam.id);
                }
              }}
              className="min-h-11 px-3.5 py-2 rounded-xl border border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Ôn lại câu sai ({activeMistakeCount} câu)</span>
            </button>
          )}
          {blueprint.speakingMode === 'separate' && (
            <button
              type="button"
              onClick={() => onNavigate('hskk_simulator')}
              className="min-h-11 px-3.5 py-2 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-xs cursor-pointer"
            >
              Thi Nói Riêng ({blueprint.separateSpeakingQuestions ? `${blueprint.separateSpeakingQuestions} câu · ` : ''}~{blueprint.separateSpeakingMinutes}p)
            </button>
          )}
          {isHsk79 && onLaunchHsk7to9Paper && (
            <button
              type="button"
              onClick={() => onLaunchHsk7to9Paper('H79001', 7)}
              className="min-h-11 px-3.5 py-2 rounded-xl border border-amber-500 text-amber-700 dark:text-amber-300 font-bold text-xs cursor-pointer"
            >
              Phòng thi tích hợp 5 kỹ năng
            </button>
          )}
          <button
            type="button"
            disabled={!previewExam.questions || previewExam.questions.length === 0}
            onClick={() => {
              try {
                sessionStorage.setItem('hanzigo_pending_exam_mode', selectedPracticeMode);
                sessionStorage.setItem(PENDING_SHUFFLE_SESSION_KEY, String(shuffleOptions));
                localStorage.setItem(SHUFFLE_PREF_STORAGE_KEY, String(shuffleOptions));
              } catch {}
              onNavigate('take', previewExam.id);
            }}
            className="min-h-11 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-40 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Bắt đầu làm bài ({previewExam.questions?.length || 0} câu)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
