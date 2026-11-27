import React from 'react';
import {
  Trash2,
  ExternalLink,
  X,
  Sparkles,
  Printer,
  Heart,
  Copy,
  BookOpen,
  PenTool,
  Mic,
  ShieldCheck,
  Compass,
  Volume2,
  Layers,
} from 'lucide-react';
import { VERIFICATION_STATUS_META } from '../../utils/materialsStorage';
import {
  playClickSound,
  playSuccessSound,
  playErrorSound,
  speakChinese,
} from '../../utils/audio';
import BaseResourceDetailModal from '../ResourceDetailModal';
import { HskReportModal } from '../HskPhase3Components';
import { SAMPLE_EXCERPTS } from './materialsConstants';

export function MaterialPreviewStudioModal({
  selectedPreviewDoc,
  setSelectedPreviewDoc,
  previewTab,
  setPreviewTab,
  quizAnsweredIndex,
  setQuizAnsweredIndex,
  bookmarkedIds,
  isAdmin,
  toggleBookmark,
  handleCopyLink,
  handleDeleteMaterial,
  handleDownloadClick,
  onSelectLesson,
  setActiveTab,
  modalPanelClassName,
}) {
  if (!selectedPreviewDoc) return null;

  const modalMeta =
    VERIFICATION_STATUS_META[selectedPreviewDoc.verificationStatus] || VERIFICATION_STATUS_META.curated;
  const excerpt = SAMPLE_EXCERPTS[selectedPreviewDoc.id] || {
    type: 'general',
    title: `Trích đoạn & Nội dung then chốt: ${selectedPreviewDoc.title}`,
    subtitle: selectedPreviewDoc.publisher || 'HanziGo Academic',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={modalPanelClassName}>
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${modalMeta.badgeClass} flex items-center gap-1`}>
              <span>{modalMeta.icon}</span>
              <span>{modalMeta.label}</span>
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
              {selectedPreviewDoc.level}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
              {selectedPreviewDoc.category}
            </span>
            {selectedPreviewDoc.isCustom && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Tự thêm
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedPreviewDoc(null)}
            className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Metadata Strip */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#243447] dark:text-white leading-snug">
            {selectedPreviewDoc.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] block text-[10px]">Định dạng</span>
              <strong className="text-[#243447] dark:text-white">{selectedPreviewDoc.format}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] block text-[10px]">Nhà xuất bản</span>
              <strong className="text-[#243447] dark:text-white truncate block">
                {selectedPreviewDoc.publisher || selectedPreviewDoc.author || 'HanziGo'}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] block text-[10px]">Ngôn ngữ</span>
              <strong className="text-[#243447] dark:text-white truncate block">
                {selectedPreviewDoc.language || 'Song ngữ Trung - Việt'}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <span className="text-[#748092] block text-[10px]">Lượt quan tâm</span>
              <strong className="text-[#E85D3F]">
                {selectedPreviewDoc.downloadsCount ? `${selectedPreviewDoc.downloadsCount.toLocaleString()} lượt` : 'Mới'}
              </strong>
            </div>
          </div>
        </div>

        {/* Preview Studio Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          <button
            type="button"
            onClick={() => setPreviewTab('excerpt')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              previewTab === 'excerpt'
                ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Trích đoạn đọc mẫu</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('provenance')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              previewTab === 'provenance'
                ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Thẩm định & Bản quyền</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('ecosystem')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              previewTab === 'ecosystem'
                ? 'bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white shadow-sm'
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Học cùng HanziGo</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE EXCERPT READER */}
        {previewTab === 'excerpt' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
                <div>
                  <h4 className="text-sm font-black text-[#243447] dark:text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#E85D3F]" />
                    <span>{excerpt.title}</span>
                  </h4>
                  <p className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                    {excerpt.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Đọc thử miễn phí
                </span>
              </div>

              {/* Excerpt Type: Vocab Table */}
              {excerpt.type === 'vocab_table' && (
                <div className="space-y-2">
                  <div className="divide-y divide-[#F1E5D8]/70 dark:divide-[#2B3A4F]/70">
                    {excerpt.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-['Noto_Serif_SC'] text-xl font-black text-[#E85D3F]">
                            {it.hanzi}
                          </span>
                          <div>
                            <p className="font-bold text-[#243447] dark:text-white">{it.pinyin} • <span className="text-[#D97706]">{it.hanViet}</span></p>
                            <p className="text-[#748092] dark:text-[#94A3B8] text-[11px]">{it.meaning}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => speakChinese(it.hanzi)}
                          className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] hover:bg-orange-100 transition-colors cursor-pointer"
                          title="Nghe phát âm"
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Excerpt Type: Dialogue */}
              {excerpt.type === 'dialogue' && (
                <div className="space-y-3">
                  {excerpt.lines.map((ln, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E85D3F] uppercase tracking-wider">{ln.speaker}</span>
                        <button
                          onClick={() => speakChinese(ln.hanzi)}
                          className="text-xs text-[#748092] hover:text-[#E85D3F] flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 size={12} />
                          <span>Nghe</span>
                        </button>
                      </div>
                      <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">{ln.hanzi}</p>
                      <p className="text-xs text-[#D97706] font-semibold">{ln.pinyin}</p>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8]">Ý nghĩa: {ln.viet}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Excerpt Type: Radicals */}
              {excerpt.type === 'radicals' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {excerpt.items.map((rad, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['Noto_Serif_SC'] text-2xl font-black text-[#E85D3F]">{rad.radical}</span>
                        <div>
                          <h5 className="text-xs font-bold text-[#243447] dark:text-white">{rad.name} ({rad.strokes} nét)</h5>
                          <p className="text-[11px] text-[#748092]">{rad.meaning}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#D97706] font-semibold pt-1 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70">
                        Chữ ví dụ: {rad.examples}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Excerpt Type: Grammar */}
              {excerpt.type === 'grammar' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                    <strong>Công thức:</strong> {excerpt.formula}
                  </div>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {excerpt.explanation}
                  </p>
                  <div className="space-y-2">
                    {excerpt.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1">
                        <p className="font-bold text-[#243447] dark:text-white">{ex.correct || ex.incorrect}</p>
                        <p className="text-[#748092] dark:text-[#94A3B8]">{ex.viet}</p>
                        <span className="text-[11px] text-[#E85D3F] font-semibold block">{ex.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Excerpt Type: Mock Quiz */}
              {excerpt.type === 'quiz' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
                    <p className="font-['Noto_Serif_SC'] text-base font-bold text-[#243447] dark:text-white">{excerpt.question}</p>
                    <p className="text-xs text-[#D97706] font-semibold">{excerpt.pinyin}</p>
                    <p className="text-xs text-[#748092]">Dịch nghĩa: {excerpt.translation}</p>
                  </div>

                  <div className="space-y-2">
                    {excerpt.options.map((opt, oIdx) => {
                      const isAnswered = quizAnsweredIndex !== null;
                      const isChosen = quizAnsweredIndex === oIdx;
                      let btnCls = 'bg-white dark:bg-[#1E293B] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F]';
                      if (isAnswered) {
                        if (opt.correct) btnCls = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                        else if (isChosen) btnCls = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                        else btnCls = 'opacity-50 border-[#F1E5D8]';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => {
                            playClickSound();
                            setQuizAnsweredIndex(oIdx);
                            if (opt.correct) playSuccessSound();
                            else playErrorSound();
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${btnCls}`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnsweredIndex !== null && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                      💡 <strong>Giải thích chi tiết:</strong> {excerpt.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Excerpt Type: General Fallback */}
              {excerpt.type === 'general' && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed">
                  {selectedPreviewDoc.description}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROVENANCE & COPYRIGHT */}
        {previewTab === 'provenance' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-blue-50/70 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck size={18} />
                <span className="text-sm">Xác minh nguồn gốc & Điều kiện bản quyền</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[#748092] dark:text-[#94A3B8] block text-[11px]">Giấy phép phân phối:</span>
                  <strong className="text-[#243447] dark:text-white">
                    {selectedPreviewDoc.license || 'Trích dẫn học thuật'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#748092] dark:text-[#94A3B8] block text-[11px]">Trạng thái thẩm định:</span>
                  <strong className="text-[#243447] dark:text-white">
                    {modalMeta.label}
                  </strong>
                </div>
              </div>

              {selectedPreviewDoc.verificationNotes && (
                <p className="text-xs text-[#243447] dark:text-[#CBD5E1] bg-white/70 dark:bg-black/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 leading-relaxed">
                  <strong>Đánh giá học thuật:</strong> {selectedPreviewDoc.verificationNotes}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between text-xs border-t border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[#748092] dark:text-[#94A3B8]">URL gốc nhà phát hành:</span>
                <a
                  href={selectedPreviewDoc.sourceUrl || selectedPreviewDoc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E85D3F] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Mở trang phát hành gốc</span>
                </a>
              </div>
            </div>

            {/* Skills Focus */}
            {Array.isArray(selectedPreviewDoc.skills) && selectedPreviewDoc.skills.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider block">
                  Kỹ năng trọng tâm rèn luyện:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPreviewDoc.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                    >
                      🎯 {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedPreviewDoc.tags && selectedPreviewDoc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedPreviewDoc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HỌC CÙNG HỆ SINH THÁI HANZIGO */}
        {previewTab === 'ecosystem' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* ROADMAP CURRICULUM INTEGRATION LINK */}
            {selectedPreviewDoc.relatedLessonId && (
              <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                    📍 Tương thích Lộ trình học HanziGo:
                  </span>
                  <strong className="text-[#243447] dark:text-white text-sm">
                    {selectedPreviewDoc.relatedLessonId}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  {onSelectLesson && (
                    <button
                      onClick={() => {
                        playClickSound();
                        const match = String(selectedPreviewDoc.relatedLessonId).match(/\b(\d+)\b/);
                        const targetLesson = match ? match[1] : selectedPreviewDoc.relatedLessonId;
                        setSelectedPreviewDoc(null);
                        onSelectLesson(targetLesson);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Vào bài học ngay</span>
                    </button>
                  )}
                  {setActiveTab && (
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedPreviewDoc(null);
                        setActiveTab('roadmap');
                      }}
                      className="px-4 py-2 rounded-xl border border-[#E85D3F] text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Compass size={14} />
                      <span>Xem Lộ trình</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Cross Practice Shortcuts with other modules */}
            {setActiveTab && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <span className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider block">
                  🚀 Luyện tập bổ trợ cùng HanziGo:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedPreviewDoc(null);
                      setActiveTab('writing');
                    }}
                    className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-orange-200 dark:border-orange-900/40 cursor-pointer"
                  >
                    <PenTool size={14} />
                    <span>Luyện viết chữ Hán</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedPreviewDoc(null);
                      setActiveTab('pronunciation');
                    }}
                    className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-emerald-200 dark:border-emerald-900/40 cursor-pointer"
                  >
                    <Mic size={14} />
                    <span>Luyện phát âm AI</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedPreviewDoc(null);
                      setActiveTab('vocabulary');
                    }}
                    className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-blue-200 dark:border-blue-900/40 cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>Flashcards SRS</span>
                  </button>
                </div>
              </div>
            )}

            {/* Study Tips Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEF7E9] to-[#FFF9F2] dark:from-[#2D2619] dark:to-[#1E293B] border border-[#F4B942]/40 text-xs text-[#243447] dark:text-[#CBD5E1] space-y-2">
              <h4 className="font-bold text-[#D97706] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Mẹo khai thác tài liệu hiệu quả cùng HanziGo:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#748092] dark:text-[#94A3B8]">
                <li>Đối với giáo trình và đề thi có Audio: Nghe lặp lại 2-3 lần trước khi xem phụ đề / transcript.</li>
                <li>Đối với vở tập viết mễ tự: In khổ A4 và sử dụng bút gel mực đen 0.5 - 0.7mm để nét chữ sắc sảo.</li>
                <li>Ghi nhớ từ vựng qua âm Hán-Việt tương đồng để tăng tốc gấp đôi hiệu suất học.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleBookmark(selectedPreviewDoc.id, selectedPreviewDoc.title)}
              className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
            >
              <Heart size={14} className={bookmarkedIds.includes(selectedPreviewDoc.id) ? 'fill-[#E85D3F] text-[#E85D3F]' : 'text-[#748092]'} />
              <span>{bookmarkedIds.includes(selectedPreviewDoc.id) ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyLink(selectedPreviewDoc)}
              className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
            >
              <Copy size={14} />
              <span>Sao chép link</span>
            </button>

            {(selectedPreviewDoc.isCustom || isAdmin) && (
              <button
                type="button"
                onClick={(e) => handleDeleteMaterial(selectedPreviewDoc.id, selectedPreviewDoc.title, e)}
                className="px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Xóa</span>
              </button>
            )}
          </div>

          <a
            href={selectedPreviewDoc.sourceUrl || selectedPreviewDoc.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleDownloadClick(selectedPreviewDoc)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:from-[#D44B2E] hover:to-[#B53B22] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#E85D3F]/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            {(selectedPreviewDoc.format || '').includes('In') || (selectedPreviewDoc.downloadUrl || '').endsWith('.html') ? (
              <>
                <Printer size={16} />
                <span>Mở In & Tải File</span>
              </>
            ) : (
              <>
                <ExternalLink size={16} />
                <span>Mở Nguồn Gốc / Tải Ngay</span>
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MaterialsDetailModals({
  selectedPreviewDoc,
  setSelectedPreviewDoc,
  previewTab,
  setPreviewTab,
  quizAnsweredIndex,
  setQuizAnsweredIndex,
  bookmarkedIds,
  isAdmin,
  toggleBookmark,
  handleCopyLink,
  handleDeleteMaterial,
  handleDownloadClick,
  onSelectLesson,
  setActiveTab,
  activeDetailResource,
  setActiveDetailResource,
  brokenReportTarget,
  setBrokenReportTarget,
  user,
  modalPanelClassName,
}) {
  return (
    <>
      <MaterialPreviewStudioModal
        selectedPreviewDoc={selectedPreviewDoc}
        setSelectedPreviewDoc={setSelectedPreviewDoc}
        previewTab={previewTab}
        setPreviewTab={setPreviewTab}
        quizAnsweredIndex={quizAnsweredIndex}
        setQuizAnsweredIndex={setQuizAnsweredIndex}
        bookmarkedIds={bookmarkedIds}
        isAdmin={isAdmin}
        toggleBookmark={toggleBookmark}
        handleCopyLink={handleCopyLink}
        handleDeleteMaterial={handleDeleteMaterial}
        handleDownloadClick={handleDownloadClick}
        onSelectLesson={onSelectLesson}
        setActiveTab={setActiveTab}
        modalPanelClassName={modalPanelClassName}
      />

      {/* 13. MODAL: RESOURCE DETAIL MODAL (PHASE 4) */}
      <BaseResourceDetailModal
        resource={activeDetailResource}
        isOpen={Boolean(activeDetailResource)}
        onClose={() => setActiveDetailResource(null)}
        onSelectLesson={(lessonId) => {
          if (onSelectLesson) {
            onSelectLesson(lessonId);
          } else if (setActiveTab) {
            setActiveTab('roadmap');
          }
        }}
        onNavigateExam={(examId) => {
          window.location.hash = `#hsk/exam/${examId}`;
          if (setActiveTab) setActiveTab('hsk');
        }}
        onOpenReport={(item) => {
          setBrokenReportTarget(item);
        }}
        onReportBroken={(item) => {
          setBrokenReportTarget(item);
        }}
      />

      {/* 14. MODAL: PUBLIC CONTENT & BROKEN LINK REPORT MODAL (PHASE 4) */}
      <HskReportModal
        isOpen={Boolean(brokenReportTarget)}
        onClose={() => setBrokenReportTarget(null)}
        targetItem={brokenReportTarget}
        user={user}
      />
    </>
  );
}
