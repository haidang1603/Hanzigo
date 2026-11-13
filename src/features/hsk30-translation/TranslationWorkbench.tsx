import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeftRight,
  Sparkles,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Send,
  RotateCcw,
  Award,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  submitTranslationAttempt,
  type TranslationDrill,
  type TranslationDirection,
  type UserTranslationSubmission,
} from '../../services/translationStudioService.ts';

interface TranslationWorkbenchProps {
  drills: TranslationDrill[];
  initialDomainFilter?: string | null;
  user?: any;
  onOpenDictionary?: (term: string) => void;
}

const LEVEL_BADGE: Record<string, string> = {
  hsk3: 'HSK 3',
  hsk4: 'HSK 4',
  hsk5: 'HSK 5',
  hsk6: 'HSK 6',
  hsk7_9: 'HSK 7–9',
  it_business: 'CNTT & Kinh doanh',
};

export const TranslationWorkbench: React.FC<TranslationWorkbenchProps> = ({
  drills,
  initialDomainFilter,
  user,
  onOpenDictionary,
}) => {
  const [directionFilter, setDirectionFilter] = useState<TranslationDirection | 'all'>('all');
  const [domainFilter, setDomainFilter] = useState<string>(initialDomainFilter || 'all');
  const [selectedDrillId, setSelectedDrillId] = useState<string>(drills[0]?.id || '');
  const [userOutput, setUserOutput] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [submission, setSubmission] = useState<UserTranslationSubmission | null>(null);

  useEffect(() => {
    if (initialDomainFilter) {
      setDomainFilter(initialDomainFilter);
    }
  }, [initialDomainFilter]);

  const filteredDrills = useMemo(() => {
    return drills.filter((d) => {
      if (directionFilter !== 'all' && d.direction !== directionFilter) return false;
      if (domainFilter !== 'all' && d.domain_slug !== domainFilter) return false;
      return true;
    });
  }, [drills, directionFilter, domainFilter]);

  const activeDrill = useMemo(() => {
    return (
      filteredDrills.find((d) => d.id === selectedDrillId) ||
      filteredDrills[0] ||
      drills[0] ||
      null
    );
  }, [filteredDrills, selectedDrillId, drills]);

  const handleSelectDrill = (drill: TranslationDrill) => {
    setSelectedDrillId(drill.id);
    setUserOutput('');
    setSubmission(null);
  };

  const handleGrade = async () => {
    if (!activeDrill || !userOutput.trim() || isGrading) return;
    setIsGrading(true);
    try {
      const res = await submitTranslationAttempt({
        drill: activeDrill,
        userOutput,
        user,
      });
      setSubmission(res);
    } finally {
      setIsGrading(false);
    }
  };

  if (!activeDrill) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Chưa có bài tập dịch nào phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filter & Drill Selector Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Tất cả chiều dịch' },
              { id: 'vi_to_zh', label: 'Việt ➔ Trung' },
              { id: 'zh_to_vi', label: 'Trung ➔ Việt' },
            ].map((dir) => (
              <button
                key={dir.id}
                type="button"
                onClick={() => setDirectionFilter(dir.id as TranslationDirection | 'all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  directionFilter === dir.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả lĩnh vực</option>
            <option value="it-software">CNTT &amp; Phần mềm</option>
            <option value="ecommerce-logistics">Thương mại &amp; Logistics</option>
            <option value="hsk-7-9-academic">HSK 7–9 Học thuật</option>
          </select>
        </div>

        {/* Drill Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filteredDrills.map((d, idx) => {
            const isSelected = d.id === activeDrill.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDrill(d)}
                className={`shrink-0 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Bài #{idx + 1}</span>
                <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px]">
                  {d.direction === 'vi_to_zh' ? 'Việt ➔ Trung' : 'Trung ➔ Việt'}
                </span>
                <span className="text-[10px] text-indigo-600">
                  {LEVEL_BADGE[d.level] || d.level}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Workbench: Source (Left) vs User Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Source & Hints */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                {activeDrill.direction === 'vi_to_zh'
                  ? 'Dịch Việt ➔ Trung'
                  : 'Dịch Trung ➔ Việt'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                {LEVEL_BADGE[activeDrill.level] || activeDrill.level}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Câu nguồn cần dịch
                </span>
                {activeDrill.direction === 'zh_to_vi' && (
                  <button
                    type="button"
                    onClick={() => speakChinese(activeDrill.source_text, 0.85)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe câu gốc</span>
                  </button>
                )}
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {activeDrill.source_text}
              </p>
            </div>

            {/* Required Keywords & Patterns */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Từ khóa &amp; Cấu trúc ngữ pháp gợi ý (bấm để tra nhanh):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeDrill.required_keywords.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const cleanTerm = kw.word_or_pattern.split('/')[0].replace(/\.\.\./g, '').trim();
                      if (onOpenDictionary && cleanTerm) {
                        onOpenDictionary(cleanTerm);
                      }
                    }}
                    className="rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1.5 text-left transition cursor-pointer"
                  >
                    <div className="text-xs font-black text-emerald-900">
                      {kw.word_or_pattern}{' '}
                      <span className="font-normal text-emerald-700">({kw.pinyin})</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{kw.hint_vi}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pitfalls Warning */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Bẫy dịch thuật cần tránh:</strong> {activeDrill.translation_pitfalls_vi}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Translation Editor */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <label
                htmlFor="translation-editor"
                className="text-sm font-black text-slate-900"
              >
                Bản dịch của bạn
              </label>
              <button
                type="button"
                onClick={() => {
                  setUserOutput('');
                  setSubmission(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Viết lại</span>
              </button>
            </div>

            <textarea
              id="translation-editor"
              value={userOutput}
              onChange={(e) => setUserOutput(e.target.value)}
              rows={6}
              placeholder={
                activeDrill.direction === 'vi_to_zh'
                  ? 'Nhập câu dịch tiếng Trung hoàn chỉnh (chú ý trật tự định ngữ và trạng ngữ)...'
                  : 'Nhập bản dịch tiếng Việt tự nhiên, sát nghĩa học thuật...'
              }
              className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            type="button"
            disabled={!userOutput.trim() || isGrading}
            onClick={handleGrade}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isGrading ? 'Đang phân tích bản dịch...' : 'Chấm bài dịch'}</span>
          </button>
        </div>
      </div>

      {/* 3-TIER EVALUATION & COMPARISON PANEL */}
      {submission && (
        <div className="rounded-3xl border border-indigo-200 bg-white shadow-md overflow-hidden animate-in fade-in">
          {/* Score Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center font-black text-xl text-amber-300">
                {submission.ai_critique.overall_score}
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Đánh giá năng lực biên dịch
                </div>
                <div className="text-sm font-bold">
                  {submission.ai_critique.overall_score >= 85
                    ? 'Xuất sắc! Đạt chuẩn diễn đạt bản xứ'
                    : submission.ai_critique.overall_score >= 65
                      ? 'Khá tốt — cần tinh chỉnh một số cấu trúc'
                      : 'Cần luyện thêm trật tự định ngữ và từ khóa'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-slate-300">Chính xác ý (40%): </span>
                <strong className="text-emerald-300">{submission.accuracy_score}/100</strong>
              </div>
              <div className="bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-slate-300">Ngữ pháp (30%): </span>
                <strong className="text-sky-300">{submission.grammar_score}/100</strong>
              </div>
              <div className="bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-slate-300">Tự nhiên (30%): </span>
                <strong className="text-amber-300">{submission.naturalness_score}/100</strong>
              </div>
            </div>
          </div>

          {/* 3-Tier Comparison Grid */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: User version with token diffs */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  1. Bản của bạn (Phân tích từ)
                </div>
                <div className="flex flex-wrap gap-1 leading-relaxed text-sm font-semibold">
                  {submission.ai_critique.token_diffs.map((tok, i) => (
                    <span
                      key={i}
                      title={tok.note}
                      className={`px-1 py-0.5 rounded ${
                        tok.status === 'match'
                          ? 'text-emerald-800 bg-emerald-100/70'
                          : tok.status === 'missing'
                            ? 'text-rose-800 bg-rose-100 border border-rose-200 text-xs'
                            : 'text-amber-900 bg-amber-100/80'
                      }`}
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tier 2: Direct Corrected Version */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    2. Bản sửa lỗi trực tiếp
                  </span>
                  {activeDrill.direction === 'vi_to_zh' && (
                    <button
                      type="button"
                      onClick={() =>
                        speakChinese(submission.ai_critique.corrected_version, 0.85)
                      }
                      className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {submission.ai_critique.corrected_version}
                </p>
              </div>

              {/* Tier 3: Superior Native HSK 7-9 Version */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    3. Bản nâng cao HSK 7–9
                  </span>
                  {activeDrill.direction === 'vi_to_zh' && (
                    <button
                      type="button"
                      onClick={() =>
                        speakChinese(submission.ai_critique.superior_native_version, 0.85)
                      }
                      className="p-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm font-bold text-indigo-950 leading-relaxed">
                  {submission.ai_critique.superior_native_version}
                </p>
              </div>
            </div>

            {/* Detailed Pedagogical Feedback */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Nhận xét chi tiết: </strong>
              {submission.ai_critique.detailed_feedback_vi}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

