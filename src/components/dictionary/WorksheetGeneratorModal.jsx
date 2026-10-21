import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  X, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Info
} from 'lucide-react';
import { 
  GRID_STYLES, 
  GRID_COLORS, 
  WORKSHEET_PRESETS, 
  extractWorksheetCharacters, 
  buildWorksheetDocument 
} from '../../utils/worksheetGenerator.js';
import WorksheetGridCell from './WorksheetGridCell.jsx';

export default function WorksheetGeneratorModal({
  isOpen,
  onClose,
  initialChar = '学',
  _relatedWords = []
}) {
  // 1. Cấu hình nội dung cần in
  const [inputText, setInputText] = useState(initialChar);
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');

  // 2. Cấu hình kiểu dáng lưới & trang in
  const [gridStyle, setGridStyle] = useState('tianzige');
  const [gridColor, setGridColor] = useState('red');
  const [rowsPerChar, setRowsPerChar] = useState(2);
  const [traceBoxesCount, setTraceBoxesCount] = useState(3);
  const [traceOpacity, setTraceOpacity] = useState(0.25);
  const [showPinyinGrid, setShowPinyinGrid] = useState(true);
  const [showSummaryCard, setShowSummaryCard] = useState(true);
  const [showHeaderInfo, setShowHeaderInfo] = useState(true);

  // 3. Zoom preview trên màn hình (không ảnh hưởng bản in A4)
  const [previewZoom, setPreviewZoom] = useState(1);

  // 4. Trích xuất danh sách chữ Hán hợp lệ
  const targetChars = useMemo(() => {
    const extracted = extractWorksheetCharacters(inputText);
    return extracted.length > 0 ? extracted : [initialChar || '学'];
  }, [inputText, initialChar]);

  // 5. Xây dựng cấu trúc tài liệu in A4
  const worksheetDoc = useMemo(() => {
    return buildWorksheetDocument({
      title: 'HanziGo — Bảng Tập Viết Chữ Hán',
      characters: targetChars,
      rowsPerChar,
      totalCellsPerRow: 11,
      gridStyle,
      gridColor,
      traceBoxesCount,
      traceOpacity,
      showPinyin: true,
      showPinyinGrid,
      showSummaryCard,
      showHeaderInfo,
      studentName,
      className
    });
  }, [
    targetChars,
    rowsPerChar,
    gridStyle,
    gridColor,
    traceBoxesCount,
    traceOpacity,
    showPinyinGrid,
    showSummaryCard,
    showHeaderInfo,
    studentName,
    className
  ]);

  // Kích hoạt hộp thoại In / Lưu PDF chuẩn của trình duyệt
  const handlePrint = () => {
    window.print();
  };

  const currentColorConfig = GRID_COLORS[gridColor] || GRID_COLORS.red;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Container Modal (ẩn khi kích hoạt lệnh in) */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-[#F1E5D8] dark:border-[#334155] overflow-hidden no-print">
        
        {/* Header Thanh Tiêu Đề */}
        <div className="p-4 sm:p-5 border-b border-[#F1E5D8] dark:border-[#334155] flex items-center justify-between gap-4 bg-[#FFF9F2] dark:bg-[#0F172A]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white shadow-md shadow-[#E85D3F]/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#243447] dark:text-[#F3F4F6] flex items-center gap-2">
                <span>In Bảng Tập Viết Chữ Hán (Worksheet Generator)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E85D3F]/10 text-[#E85D3F] border border-[#E85D3F]/20">
                  Chuẩn A4 PDF
                </span>
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Tùy chỉnh ô Điền tự / Mễ tự và in ra giấy A4 để học viên luyện chữ bằng bút mực truyền thống
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút In Nhanh */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#E85D3F]/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>In ngay / Lưu PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nội dung 2 Cột: Bên trái Tùy chỉnh - Bên phải Xem trước trực tiếp */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: BẢNG ĐIỀU KHIỂN CẤU HÌNH (5 CỘT) */}
          <div className="lg:col-span-5 p-5 border-r border-[#F1E5D8] dark:border-[#334155] overflow-y-auto space-y-5 bg-[#FAF6F0] dark:bg-[#131B26]">
            
            {/* 1. Nhập chữ cần in */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6] flex items-center justify-between">
                <span>Chữ Hán cần in ({targetChars.length} chữ):</span>
                <span className="text-[11px] font-normal text-gray-500">Tự lọc ký tự CJK</span>
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập 1 chữ hoặc nhiều chữ (ví dụ: 学, 学习, 你好, 谢谢...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-[#F3F4F6] text-sm focus:outline-hidden focus:border-[#E85D3F] font-['Noto_Serif_SC'] tracking-wider"
              />

              {/* Gợi ý mẫu từ vựng nhanh */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-gray-500 mr-1">Bộ mẫu:</span>
                {WORKSHEET_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setInputText(preset.text)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#334155] text-gray-600 dark:text-gray-300 hover:border-[#E85D3F] hover:text-[#E85D3F] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kiểu dáng lưới ô (Grid Style) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6]">
                Kiểu lưới tập viết:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(GRID_STYLES).map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setGridStyle(style.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      gridStyle === style.id
                        ? 'bg-white dark:bg-[#1E293B] border-[#E85D3F] shadow-xs ring-1 ring-[#E85D3F]'
                        : 'bg-white/60 dark:bg-[#1E293B]/60 border-[#F1E5D8] dark:border-[#334155] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6]">
                        {style.shortName}
                      </span>
                      {gridStyle === style.id && <Check className="w-3.5 h-3.5 text-[#E85D3F]" />}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {style.id === 'tianzige' ? 'Dấu chữ thập (+)' : style.id === 'mizige' ? '8 hướng nét đứt' : style.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Màu sắc đường kẻ lưới */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6]">
                Màu mực đường kẻ lưới:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(GRID_COLORS).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setGridColor(c.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                      gridColor === c.id
                        ? 'bg-white dark:bg-[#1E293B] border-[#E85D3F] ring-1 ring-[#E85D3F]'
                        : 'bg-white/60 dark:bg-[#1E293B]/60 border-[#F1E5D8] dark:border-[#334155]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border"
                      style={{ backgroundColor: c.hex, borderColor: c.borderHex }}
                    />
                    <span className="text-xs font-semibold text-[#243447] dark:text-[#F3F4F6] truncate">
                      {c.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Tùy chọn hàng luyện viết & Ô đồ nét */}
            <div className="grid grid-cols-2 gap-3">
              {/* Số dòng trên mỗi chữ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6]">
                  Dòng / mỗi chữ:
                </label>
                <select
                  value={rowsPerChar}
                  onChange={(e) => setRowsPerChar(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-bold text-[#243447] dark:text-[#F3F4F6]"
                >
                  <option value={1}>1 dòng / chữ</option>
                  <option value={2}>2 dòng / chữ (Chuẩn)</option>
                  <option value={3}>3 dòng / chữ</option>
                  <option value={4}>4 dòng / chữ</option>
                  <option value={6}>6 dòng / chữ (Chuyên sâu)</option>
                </select>
              </div>

              {/* Số ô in mờ đồ theo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6]">
                  Số ô đồ nét mờ:
                </label>
                <select
                  value={traceBoxesCount}
                  onChange={(e) => setTraceBoxesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-bold text-[#243447] dark:text-[#F3F4F6]"
                >
                  <option value={0}>0 ô (100% tự viết)</option>
                  <option value={1}>1 ô đồ</option>
                  <option value={3}>3 ô đồ (Khuyên dùng)</option>
                  <option value={5}>5 ô đồ</option>
                  <option value={10}>Đồ toàn bộ dòng</option>
                </select>
              </div>
            </div>

            {/* 5. Độ mờ nét chữ đồ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6] flex items-center justify-between">
                <span>Độ mờ nét đồ theo:</span>
                <span className="text-gray-500">{Math.round(traceOpacity * 100)}%</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 0.15, label: 'Mờ nhẹ (15%)' },
                  { val: 0.25, label: 'Chuẩn (25%)' },
                  { val: 0.40, label: 'Rõ nét (40%)' }
                ].map((op) => (
                  <button
                    key={op.val}
                    type="button"
                    onClick={() => setTraceOpacity(op.val)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      traceOpacity === op.val
                        ? 'bg-white dark:bg-[#1E293B] border-[#E85D3F] text-[#E85D3F]'
                        : 'bg-white/60 dark:bg-[#1E293B]/60 border-[#F1E5D8] dark:border-[#334155] text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Các trường bật/tắt bổ trợ */}
            <div className="space-y-2 pt-2 border-t border-[#F1E5D8] dark:border-[#334155]">
              <span className="text-xs font-bold text-[#243447] dark:text-[#F3F4F6] block">
                Tùy chọn hiển thị trên trang:
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#243447] dark:text-[#F3F4F6]">
                <input
                  type="checkbox"
                  checked={showPinyinGrid}
                  onChange={(e) => setShowPinyinGrid(e.target.checked)}
                  className="rounded-md border-gray-300 text-[#E85D3F] focus:ring-[#E85D3F]"
                />
                <span>Kèm thanh 4 đường kẻ phiên âm Pinyin (四线三格)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#243447] dark:text-[#F3F4F6]">
                <input
                  type="checkbox"
                  checked={showSummaryCard}
                  onChange={(e) => setShowSummaryCard(e.target.checked)}
                  className="rounded-md border-gray-300 text-[#E85D3F] focus:ring-[#E85D3F]"
                />
                <span>Thẻ tóm tắt thông tin chữ (Pinyin, Hán Việt, Bộ thủ, Số nét, Nghĩa)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#243447] dark:text-[#F3F4F6]">
                <input
                  type="checkbox"
                  checked={showHeaderInfo}
                  onChange={(e) => setShowHeaderInfo(e.target.checked)}
                  className="rounded-md border-gray-300 text-[#E85D3F] focus:ring-[#E85D3F]"
                />
                <span>Thanh tiêu đề học viên (Họ tên, Lớp, Ngày tháng, Điểm số)</span>
              </label>
            </div>

            {/* 7. Thông tin học viên (nếu bật header) */}
            {showHeaderInfo && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Họ tên học viên (tùy chọn)"
                  className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-[#F3F4F6]"
                />
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Lớp / Trình độ HSK"
                  className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-[#F3F4F6]"
                />
              </div>
            )}

            {/* Hướng dẫn xuất PDF */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Mẹo in hoặc lưu file PDF:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                Bấm nút <strong>"In ngay / Lưu PDF"</strong> ở góc trên. Trong cửa sổ in của trình duyệt, chọn đích đến là <strong>"Lưu dưới dạng PDF" (Save as PDF)</strong> với khổ giấy A4 dọc để xuất ra file PDF chất lượng cao.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC TRỰC QUAN KHỔ GIẤY A4 (7 CỘT) */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-gray-200 dark:bg-[#0B111A] overflow-y-auto flex flex-col items-center justify-start relative">
            
            {/* Toolbar thu phóng preview */}
            <div className="w-full max-w-[620px] flex items-center justify-between mb-3 text-xs text-gray-500">
              <span className="font-semibold">Bản xem trước A4 (Preview):</span>
              <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] px-3 py-1 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.max(0.7, z - 0.1))}
                  className="p-1 hover:text-black dark:hover:text-white"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-12 text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.min(1.4, z + 0.1))}
                  className="p-1 hover:text-black dark:hover:text-white"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Giả lập trang giấy A4 */}
            <div
              style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center' }}
              className="w-full max-w-[620px] min-h-[840px] bg-white text-black p-8 shadow-2xl rounded-sm border border-gray-300 transition-transform duration-150 relative space-y-6 select-none"
            >
              {/* Header Khổ Giấy A4 */}
              {showHeaderInfo && (
                <div className="border-b-2 border-gray-800 pb-3 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-lg font-black tracking-wider text-gray-900 font-serif">
                      HanziGo — Bảng Tập Viết Chữ Hán
                    </h1>
                    <p className="text-[11px] text-gray-600 italic">
                      Luyện viết chữ Hán theo ô {GRID_STYLES[gridStyle.toUpperCase()]?.name || 'Điền tự'} chuẩn
                    </p>
                  </div>

                  <div className="text-[11px] text-gray-700 space-y-1 text-right">
                    <div>
                      <span>Họ tên: </span>
                      <span className="font-bold border-b border-dotted border-gray-500 min-w-[100px] inline-block text-left pl-1">
                        {studentName || '................................'}
                      </span>
                    </div>
                    <div>
                      <span>Lớp / HSK: </span>
                      <span className="font-bold border-b border-dotted border-gray-500 min-w-[70px] inline-block text-left pl-1">
                        {className || '..................'}
                      </span>
                      <span className="ml-2">Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Danh sách các phần chữ Hán */}
              <div className="space-y-6">
                {worksheetDoc.characterSections.map((section) => (
                  <div key={section.char} className="space-y-3">
                    
                    {/* Thẻ tóm tắt thông tin chữ Hán */}
                    {showSummaryCard && (
                      <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50/70 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-['Noto_Serif_SC'] text-2xl font-black text-gray-900">
                            {section.char}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-sm">
                                {section.detail?.pinyin}
                              </span>
                              {section.detail?.hanviet && (
                                <span className="text-gray-600">
                                  (Hán Việt: <strong>{section.detail.hanviet}</strong>)
                                </span>
                              )}
                              {section.detail?.hskLevel && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gray-200 font-bold text-gray-700">
                                  {section.detail.hskLevel}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-600 line-clamp-1">
                              Nghĩa: {section.detail?.meaning || 'Đang cập nhật'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-gray-600 space-y-0.5 shrink-0">
                          <div>
                            Bộ thủ: <strong>{section.detail?.radical || '—'}</strong>
                          </div>
                          <div>
                            Tổng số nét: <strong>{section.detail?.strokesCount || 0} nét</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Các dòng ô luyện viết */}
                    <div className="space-y-2">
                      {section.rows.map((row) => (
                        <div
                          key={row.rowIndex}
                          className="grid grid-cols-11 gap-0 border border-transparent"
                        >
                          {row.cells.map((cell) => (
                            <WorksheetGridCell
                              key={cell.index}
                              char={cell.char}
                              mode={cell.mode}
                              opacity={cell.opacity}
                              pinyin={cell.pinyin}
                              gridStyle={gridStyle}
                              colorConfig={currentColorConfig}
                              showPinyinGrid={showPinyinGrid}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Trang */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400 mt-auto">
                <span>HanziGo — Nền tảng học tiếng Trung trực tuyến cho người Việt</span>
                <span>https://hanzigo-xi.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTAINER CHUYÊN BIỆT CHO LỆNH IN (CHỈ HIỂN THỊ KHI IN QUA @media print)
          ========================================================================= */}
      <div id="hanzigo-worksheet-printable" className="hidden">
        <div className="w-full bg-white text-black p-4 space-y-5">
          {/* Header A4 */}
          {showHeaderInfo && (
            <div className="border-b-2 border-gray-900 pb-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-wider text-gray-900 font-serif">
                  HanziGo — Bảng Tập Viết Chữ Hán
                </h1>
                <p className="text-xs text-gray-600 italic">
                  Luyện viết chữ Hán theo ô {GRID_STYLES[gridStyle.toUpperCase()]?.name || 'Điền tự'} chuẩn
                </p>
              </div>

              <div className="text-xs text-gray-800 space-y-1.5 text-right">
                <div>
                  <span>Họ tên: </span>
                  <span className="font-bold border-b border-dotted border-gray-800 min-w-[140px] inline-block text-left pl-1">
                    {studentName || '................................................'}
                  </span>
                </div>
                <div>
                  <span>Lớp / HSK: </span>
                  <span className="font-bold border-b border-dotted border-gray-800 min-w-[90px] inline-block text-left pl-1">
                    {className || '........................'}
                  </span>
                  <span className="ml-3">Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Nội dung danh sách chữ Hán */}
          <div className="space-y-6">
            {worksheetDoc.characterSections.map((section) => (
              <div key={section.char} className="space-y-3 break-inside-avoid">
                {showSummaryCard && (
                  <div className="p-2.5 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-['Noto_Serif_SC'] text-3xl font-black text-gray-900">
                        {section.char}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">
                            {section.detail?.pinyin}
                          </span>
                          {section.detail?.hanviet && (
                            <span className="text-gray-700">
                              (Hán Việt: <strong>{section.detail.hanviet}</strong>)
                            </span>
                          )}
                          {section.detail?.hskLevel && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 font-bold text-gray-800">
                              {section.detail.hskLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700">
                          Nghĩa: {section.detail?.meaning || 'Đang cập nhật'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-700 space-y-0.5">
                      <div>
                        Bộ thủ: <strong>{section.detail?.radical || '—'}</strong>
                      </div>
                      <div>
                        Tổng số nét: <strong>{section.detail?.strokesCount || 0} nét</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Các hàng ô tập viết */}
                <div className="space-y-2">
                  {section.rows.map((row) => (
                    <div
                      key={row.rowIndex}
                      className="grid grid-cols-11 gap-0"
                    >
                      {row.cells.map((cell) => (
                        <WorksheetGridCell
                          key={cell.index}
                          char={cell.char}
                          mode={cell.mode}
                          opacity={cell.opacity}
                          pinyin={cell.pinyin}
                          gridStyle={gridStyle}
                          colorConfig={currentColorConfig}
                          showPinyinGrid={showPinyinGrid}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer A4 */}
          <div className="pt-6 border-t border-gray-300 flex items-center justify-between text-xs text-gray-500">
            <span>HanziGo — Nền tảng học tiếng Trung trực tuyến cho người Việt</span>
            <span>https://hanzigo-xi.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}
