import React from 'react';
import {
  Plus,
  X,
  Sparkles,
  Printer,
  Copy,
  Send,
  ArrowRight,
  Target,
} from 'lucide-react';
import {
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
  MATERIAL_FORMATS,
} from '../../utils/materialsStorage';
import { playClickSound } from '../../utils/audio';
import {
  CURATED_LEVEL_BUNDLES,
  FEATURED_EXCLUSIVE_TOOLS,
  QUICK_MATERIAL_SUGGESTIONS,
} from './materialsConstants';

export function MaterialsFeaturedSection({
  selectedLevel,
  handleSelectBundle,
  showToast,
}) {
  return (
    <>
      {/* 2. CURATED LEVEL STARTER PACKS (CHỌN NHANH THEO TRÌNH ĐỘ HSK) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F]">
              <Target size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Gói Tài Liệu Học Trọng Tâm Theo Trình Độ
            </h2>
          </div>
          <span className="text-xs text-[#748092] dark:text-[#94A3B8] font-semibold hidden sm:inline">
            Nhấp vào gói để lọc tài liệu tương ứng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURATED_LEVEL_BUNDLES.map((bundle) => {
            const isSelected = selectedLevel === bundle.level;
            return (
              <div
                key={bundle.id}
                onClick={() => handleSelectBundle(bundle)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group bg-gradient-to-br ${bundle.bgLight} ${
                  isSelected
                    ? 'border-2 border-[#E85D3F] shadow-lg shadow-[#E85D3F]/15 -translate-y-1'
                    : `${bundle.borderColor} hover:shadow-md hover:-translate-y-0.5`
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{bundle.icon}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black"
                      style={{ backgroundColor: `${bundle.color}20`, color: bundle.color }}
                    >
                      {bundle.level}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors leading-snug">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                    {bundle.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">{bundle.stats}</span>
                  <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: bundle.color }}>
                    <span>Xem gói</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FEATURED EXCLUSIVE TOOLS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E85D3F]/10 text-[#E85D3F]">
              <Sparkles size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#243447] dark:text-white">
              Học Cụ & Tiện Ích Độc Quyền HanziGo
            </h2>
          </div>
          <span className="text-xs text-[#748092] font-semibold hidden sm:inline">
            Tích hợp sẵn & In ấn không cần cài đặt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_EXCLUSIVE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md hover:border-[#E85D3F] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white group-hover:text-[#E85D3F] transition-colors leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D3F] hover:text-[#CB4529] group-hover:translate-x-0.5 transition-all"
                >
                  <span>{tool.actionText}</span>
                  <ArrowRight size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const fullUrl = `${window.location.origin}${tool.url}`;
                    navigator.clipboard.writeText(fullUrl);
                    showToast('Đã sao chép liên kết tiện ích!');
                  }}
                  title="Sao chép liên kết"
                  className="p-1.5 rounded-lg text-[#748092] hover:text-[#243447] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors cursor-pointer"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function MaterialsActionModals({
  isAdmin,
  showMizigeGenModal,
  setShowMizigeGenModal,
  mizigeInputText,
  setMizigeInputText,
  mizigeGridStyle,
  setMizigeGridStyle,
  showAddModal,
  setShowAddModal,
  handleApplySuggestion,
  handleAddNewMaterial,
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  newLevel,
  setNewLevel,
  newSkills,
  setNewSkills,
  newPublisher,
  setNewPublisher,
  newFormat,
  setNewFormat,
  newLicense,
  setNewLicense,
  newVerificationStatus,
  setNewVerificationStatus,
  newRelatedLessonId,
  setNewRelatedLessonId,
  newLanguage,
  setNewLanguage,
  newSourceUrl,
  setNewSourceUrl,
  newDownloadUrl,
  setNewDownloadUrl,
  newDescription,
  setNewDescription,
  newVerificationNotes,
  setNewVerificationNotes,
  newTags,
  setNewTags,
  showRequestModal,
  setShowRequestModal,
  handleRequestMaterialSubmit,
  reqTitle,
  setReqTitle,
  reqCategory,
  setReqCategory,
  reqLevel,
  setReqLevel,
  reqFormat,
  setReqFormat,
  reqNote,
  setReqNote,
  modalPanelClassName,
}) {
  return (
    <>
      {/* 10. MODAL: QUICK MIZIGE SHEET GENERATOR & PRINT STUDIO */}
      {showMizigeGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={modalPanelClassName}>
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Printer size={18} className="text-[#E85D3F]" />
                  <span>Xưởng Tạo Giấy Luyện Viết Ô Mễ Tự A4</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Nhập chữ Hán bất kỳ để tạo trang kẻ ô mễ tự (米字格) 8 hướng chuẩn và in ra giấy A4.
                </p>
              </div>
              <button
                onClick={() => setShowMizigeGenModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Chữ Hán hoặc cụm từ bạn muốn luyện viết:
                </label>
                <input
                  type="text"
                  value={mizigeInputText}
                  onChange={(e) => setMizigeInputText(e.target.value)}
                  placeholder="Ví dụ: 学海无涯, 你好, 汉语..."
                  className="w-full px-4 py-2.5 rounded-xl text-base font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Grid Style Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#748092]">Kiểu lưới:</span>
                {[
                  { id: 'mizige', label: 'Ô Mễ Tự (米字格 - 8 hướng)' },
                  { id: 'tianzige', label: 'Điền Tự Cách (田字格 - 4 ô)' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      playClickSound();
                      setMizigeGridStyle(st.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mizigeGridStyle === st.id
                        ? 'bg-[#E85D3F] text-white shadow-xs'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Real-time Visual Preview Canvas */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131B24] border-2 border-dashed border-[#F4B942]/60 flex flex-wrap items-center justify-center gap-4 min-h-[160px]">
                {(mizigeInputText.trim() || '永').split('').map((char, cIdx) => (
                  <div key={cIdx} className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#E85D3F] bg-[#FFFDF9] dark:bg-[#1E293B] flex items-center justify-center select-none shadow-xs">
                    {/* Mizige Dashed Guidelines */}
                    <div className="absolute inset-0 border-t border-dashed border-red-300 dark:border-red-900/60 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute inset-0 border-l border-dashed border-red-300 dark:border-red-900/60 left-1/2 -translate-x-1/2 pointer-events-none" />
                    {mizigeGridStyle === 'mizige' && (
                      <>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-red-200 dark:stroke-red-900/40" strokeDasharray="3 3">
                          <line x1="0" y1="0" x2="100%" y2="100%" />
                          <line x1="100%" y1="0" x2="0" y2="100%" />
                        </svg>
                      </>
                    )}
                    <span className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl font-black text-[#243447] dark:text-white relative z-10 opacity-75">
                      {char}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                💡 Khổ giấy được thiết lập chuẩn tỉ lệ A4 (210 x 297 mm), bạn có thể mở trang in độc quyền của HanziGo để xuất file PDF hoặc in trực tiếp qua máy in.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowMizigeGenModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Đóng
                </button>
                <a
                  href="/vo-tap-viet-chu-han-a4.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Mở Trang In Chuẩn A4 Toàn Màn Hình</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: ADD CUSTOM MATERIAL (ADMIN ONLY) */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={modalPanelClassName}>
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-[#E85D3F]" />
                  <span>Đóng Góp Tài Liệu Vào Thư Viện</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Lưu trữ metadata và liên kết đến tài liệu chuẩn, đề thi thử hoặc tài nguyên giáo dục mở.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
                ⚡ Gợi ý mẫu tài liệu chuẩn (Nhấp để điền nhanh toàn bộ):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_MATERIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium text-left truncate max-w-full cursor-pointer"
                  >
                    {sug.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddNewMaterial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tiêu đề tài liệu *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo trình Chuẩn HSK 3 kèm Audio..."
                  className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chuyên mục
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ phù hợp
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_LEVELS.filter((l) => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Kỹ năng trọng tâm (cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="Nghe hiểu, Đọc hiểu, Ngữ pháp..."
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Nhà xuất bản / Tổ chức phát hành
                  </label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    placeholder="BLCU Press, CTI, Khổng Tử Học Viện..."
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Định dạng
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>{fmt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Giấy phép / Bản quyền
                  </label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    placeholder="OER, CC-BY, Trích dẫn học thuật..."
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Trạng thái kiểm định
                  </label>
                  <select
                    value={newVerificationStatus}
                    onChange={(e) => setNewVerificationStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="verified_official">🛡️ Chính thức CTI / Hanban</option>
                    <option value="verified_oer">✅ Giáo dục Mở OER / CC</option>
                    <option value="academic_reference">🏛️ Đại học BLCU / Học thuật</option>
                    <option value="curated">⭐ Tuyển chọn nội bộ HanziGo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Liên kết Lộ trình học (Module / Bài học)
                  </label>
                  <input
                    type="text"
                    value={newRelatedLessonId}
                    onChange={(e) => setNewRelatedLessonId(e.target.value)}
                    placeholder="Ví dụ: Module 1.1 (Bài 101-105)"
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Ngôn ngữ thể hiện
                  </label>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Song ngữ Trung - Việt, Tiếng Trung Giản thể..."
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    URL Nguồn gốc phát hành *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://chinesetest.cn... hoặc link nguồn gốc"
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    URL Tải / Xem trực tuyến
                  </label>
                  <input
                    type="text"
                    value={newDownloadUrl}
                    onChange={(e) => setNewDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/... hoặc link tải"
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Mô tả chi tiết nội dung
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Giới thiệu nội dung, cấu trúc sách, đối tượng phù hợp và cách học hiệu quả..."
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Ghi chú kiểm định học thuật & Đánh giá nguồn
                </label>
                <input
                  type="text"
                  value={newVerificationNotes}
                  onChange={(e) => setNewVerificationNotes(e.target.value)}
                  placeholder="Đã xác thực qua website chính thức CTI, cấp phép theo điều khoản giáo dục..."
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Thẻ từ khóa (phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="HSK 1, Ngữ pháp, Audio, Đề thi, CTI..."
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || (!newSourceUrl.trim() && !newDownloadUrl.trim())}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Lưu & Chia sẻ tài liệu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. MODAL: REQUEST A MATERIAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                  <Send size={18} className="text-[#E85D3F]" />
                  <span>Yêu Cầu Tài Liệu Học Tập Mới</span>
                </h3>
                <p className="text-xs text-[#748092]">
                  Bạn đang tìm kiếm giáo trình, file Audio hoặc bộ đề nào mà chưa có trong kho?
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 rounded-full text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestMaterialSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Tên tài liệu / Giáo trình muốn yêu cầu *
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo trình Hán ngữ Boya Sơ cấp tập 2, Đề thi HSK 5 có audio..."
                  className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm font-semibold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Chuyên mục
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white">
                    Cấp độ HSK
                  </label>
                  <select
                    value={reqLevel}
                    onChange={(e) => setReqLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {MATERIAL_LEVELS.filter((l) => l !== 'Tất cả').map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Định dạng học liệu mong muốn
                </label>
                <select
                  value={reqFormat}
                  onChange={(e) => setReqFormat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="PDF + MP3">📄+🎧 PDF kèm Audio MP3</option>
                  <option value="PDF">📄 Sách / Giáo trình PDF</option>
                  <option value="Audio MP3">🎧 Tệp âm thanh MP3</option>
                  <option value="Trực tuyến & Web">💻 Web tương tác trực tuyến</option>
                  <option value="In ấn A4">🖨️ Tài liệu in ấn A4</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447] dark:text-white">
                  Ghi chú hoặc link tham khảo (nếu có)
                </label>
                <textarea
                  rows={3}
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  placeholder="Mô tả cụ thể phiên bản bạn cần (Ví dụ: Cần file nghe MP3 bài 5-10, sách tái bản mới...)"
                  className="w-full px-3 py-2 rounded-xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!reqTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Gửi yêu cầu tài liệu (+10 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
