import React, { useState } from 'react';
import {
  Languages,
  BookOpen,
  PenTool,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Hsk79StudioPanel({ lesson, handleSpeak }) {
  const [activeTab, setActiveTab] = useState('translation');
  const [showPassageVi, setShowPassageVi] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!lesson?.isHsk79 && !lesson?.translationDrills?.length) {
    return null;
  }

  const passage = lesson.academicPassage;
  const drills = lesson.translationDrills || [];
  const blueprint = lesson.essayBlueprint || lesson.writingAndSpeakingPrompt;

  return (
    <section
      aria-label="Xưởng Dịch Thuật 3 Tầng và Luận Văn HSK 7–9"
      className="mt-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-indigo-200/70 dark:border-indigo-800/60 shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-violet-500/30 border border-violet-300/30 text-[10px] font-black uppercase tracking-wider">
              {lesson.hskLevel || `HSK ${lesson.level || 7}`} · Cao cấp
            </span>
            <span className="text-[11px] font-semibold text-indigo-200">
              {lesson.moduleTitle}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-black flex items-center gap-2">
            <Sparkles size={15} className="text-amber-300 shrink-0" />
            <span>Xưởng Dịch Thuật 3 Tầng (Trung ↔ Việt) & Khung Lập Dàn Ý Luận Văn</span>
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{isCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-5 space-y-4">
          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('translation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'translation'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <Languages size={14} />
              <span>Dịch thuật 3 Tầng ({drills.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('passage')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'passage'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Bài đọc Báo chí – Học thuật</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('essay')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'essay'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <PenTool size={14} />
              <span>Khung Luận văn & Biện luận</span>
            </button>
          </div>

          {/* TAB 1: 3-TIER TRANSLATION DRILLS */}
          {activeTab === 'translation' && (
            <div className="space-y-4">
              {drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                      {drill.direction === 'vi_to_zh' ? '🇻🇳 → 🇨🇳 Việt – Trung' : '🇨🇳 → 🇻🇳 Trung – Việt'} · {drill.title}
                    </span>
                    {drill.direction === 'zh_to_vi' && handleSpeak && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(drill.sourceText)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[11px] font-bold text-[#E85D3F] flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>Nghe câu gốc</span>
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-semibold text-[#243447] dark:text-white leading-relaxed">
                    <span className="text-[10px] font-black uppercase text-[#748092] block mb-1">
                      Văn bản gốc cần dịch:
                    </span>
                    {drill.sourceText}
                  </div>

                  {/* Tier 1: Literal Trap */}
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/50 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                      <AlertTriangle size={13} />
                      <span>Tầng 1 — Bẫy dịch từng chữ (Cần tránh)</span>
                    </div>
                    <p className="text-[#243447] dark:text-rose-100 leading-relaxed">
                      {drill.literalTrapVersion}
                    </p>
                  </div>

                  {/* Tier 2: Standard HSK 7 */}
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/25 border border-sky-200 dark:border-sky-900/50 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        <span>Tầng 2 — Chuẩn ngữ pháp HSK 7</span>
                      </span>
                      {drill.direction === 'vi_to_zh' && handleSpeak && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(drill.standardHsk7Version)}
                          className="text-sky-600 dark:text-sky-300 hover:opacity-80 cursor-pointer"
                          title="Nghe bản chuẩn HSK 7"
                        >
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="text-[#243447] dark:text-sky-100 font-medium leading-relaxed">
                      {drill.standardHsk7Version}
                    </p>
                  </div>

                  {/* Tier 3: Master HSK 9 */}
                  <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-300 dark:border-violet-800/60 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                        <Sparkles size={13} />
                        <span>Tầng 3 — Thượng thừa HSK 9 (Tứ tự cách & Tín – Đạt – Nhã)</span>
                      </span>
                      {drill.direction === 'vi_to_zh' && handleSpeak && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(drill.masterHsk9Version)}
                          className="text-violet-600 dark:text-violet-300 hover:opacity-80 cursor-pointer"
                          title="Nghe bản HSK 9"
                        >
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>
                    <p className="text-[#243447] dark:text-white font-semibold leading-relaxed">
                      {drill.masterHsk9Version}
                    </p>
                  </div>

                  {drill.analysisVi && (
                    <p className="text-[11px] text-[#748092] dark:text-slate-300 leading-relaxed pt-1">
                      <strong>💡 Phân tích biên dịch:</strong> {drill.analysisVi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ACADEMIC PASSAGE */}
          {activeTab === 'passage' && passage && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    {passage.style}
                  </span>
                  <h4 className="text-base font-black text-[#243447] dark:text-white font-serif">
                    {passage.titleZh} — {passage.titleVi}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {handleSpeak && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(passage.fullTextZh)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={13} />
                      <span>Đọc toàn bài</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassageVi((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                  >
                    {showPassageVi ? 'Ẩn bản dịch' : 'Hiện bản dịch chuyên ngành'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {passage.paragraphsZh.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-start justify-between gap-3"
                  >
                    <p className="text-sm text-[#243447] dark:text-slate-100 leading-relaxed font-serif">
                      <span className="font-mono text-[11px] font-bold text-indigo-500 mr-2">
                        [Đoạn {idx + 1}]
                      </span>
                      {p}
                    </p>
                    {handleSpeak && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(p)}
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 shrink-0 cursor-pointer"
                        title="Nghe đoạn này"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {showPassageVi && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-xs text-[#243447] dark:text-slate-200 leading-relaxed">
                  <span className="font-black text-indigo-700 dark:text-indigo-300 block mb-1">
                    Bản dịch chuyên ngành tham khảo:
                  </span>
                  {passage.translationVi}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ESSAY BLUEPRINT & SPEAKING DEBATE */}
          {activeTab === 'essay' && blueprint && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase">
                    Đề Viết Luận Học Thuật ({blueprint.targetWordCount})
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#243447] dark:text-white leading-relaxed">
                  {blueprint.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(blueprint.outline || []).map((section, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5"
                  >
                    <div className="text-xs font-black text-[#E85D3F]">{section.part}</div>
                    <p className="text-[11px] text-[#748092] dark:text-slate-300 leading-relaxed">
                      {section.guideVi}
                    </p>
                  </div>
                ))}
              </div>

              {blueprint.discourseMarkers?.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 block">
                    5 Cụm từ nối học thuật (Discourse Markers) nên đưa vào bài viết:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {blueprint.discourseMarkers.map((marker, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E293B] border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-[#243447] dark:text-white"
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {blueprint.speakingDebatePrompt && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>🎙️ Khẩu ngữ Biện luận:</strong> {blueprint.speakingDebatePrompt}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
