import React, { useRef, useEffect, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Award,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

/**
 * =========================================================================
 * CERTIFICATE GENERATOR MODAL — RETINA 2X CANVAS & A4 PRINT
 * =========================================================================
 * Kết xuất Chứng nhận Tốt nghiệp HSK Song ngữ Trung - Việt chuẩn in ấn:
 * - HTML5 Canvas Retina 2x sắc nét với hoa văn cổ điển (Classical Borders)
 * - Con dấu đỏ triện thư "汉子通 Hanzigo 印"
 * - Mã định danh xác thực duy nhất (Certificate Verification ID)
 * - Nút tải ảnh PNG độ nét cao (HD 2x) & Nút In A4 trực tiếp qua window.print()
 * - Tuyệt đối không cài thêm thư viện jsPDF nặng nề
 * =========================================================================
 */
export default function CertificateGeneratorModal({
  isOpen,
  onClose,
  certificate = null
}) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!isOpen || !certificate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina 2x scale: A4 Landscape ratio 297mm x 210mm (~ 1200 x 850 at standard web, 2400 x 1700 at 2x)
    const width = 1200;
    const height = 850;
    const scale = 2;

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // 1. Nền kem hoàng gia (Imperial Ivory Cream)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#FCF9F2');
    bgGrad.addColorStop(0.5, '#FFFDF9');
    bgGrad.addColorStop(1, '#FBF6EC');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Viền đôi họa tiết truyền thống (Double Classical Border)
    // Viền ngoài đỏ thẫm / vàng kim
    ctx.strokeStyle = '#8B1E1E';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Viền trong vàng kim tinh tế
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Hoa văn góc (Corner Ornaments)
    const drawCorner = (x, y, flipX, flipY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(35, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 35);
      ctx.moveTo(8, 8);
      ctx.lineTo(25, 8);
      ctx.moveTo(8, 8);
      ctx.lineTo(8, 25);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(48, 48, 1, 1);
    drawCorner(width - 48, 48, -1, 1);
    drawCorner(48, height - 48, 1, -1);
    drawCorner(width - 48, height - 48, -1, -1);

    // 3. Logo & Tiêu đề Song ngữ
    ctx.textAlign = 'center';

    // Logo Text: 汉字通 • HANZIGO
    ctx.font = '900 24px "Noto Serif SC", serif';
    ctx.fillStyle = '#E85D3F';
    ctx.fillText('汉字通 • HANZIGO', width / 2, 95);

    ctx.font = '600 12px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('NỀN TẢNG ĐÀO TẠO HÁN NGỮ & CHUẨN HÓA NĂNG LỰC HSK', width / 2, 115);

    // Tiêu đề chính chữ Hán
    ctx.font = '900 42px "Noto Serif SC", serif';
    ctx.fillStyle = '#8B1E1E';
    ctx.fillText('汉语水平课程结业证书', width / 2, 180);

    // Tiêu đề tiếng Việt
    ctx.font = '800 20px sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('CHỨNG NHẬN HOÀN THÀNH CHƯƠNG TRÌNH HÁN NGỮ', width / 2, 215);

    // Đường kẻ phân cách vàng kim
    ctx.strokeStyle = '#E2D7CC';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 235);
    ctx.lineTo(width / 2 + 250, 235);
    ctx.stroke();

    // 4. Lời chứng nhận
    const cleanLevel = String(certificate.hskLevel || 'HSK 1');
    const levelNumber = cleanLevel.replace(/[^0-9]/g, '') || '1';
    const userName = String(certificate.userName || certificate.displayName || 'Học viên HanziGo');
    const certCode = String(certificate.certificateCode || '');
    const issueDate = String(certificate.issueDate || '');
    const examPercent = certificate.examPercentage ?? 100;
    const completedCount = certificate.completedLessonsCount ?? 20;

    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Trân trọng chứng nhận học viên:', width / 2, 280);

    // Tên học viên trang trọng
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(userName, width / 2, 335);

    // Chi tiết cấp độ
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(
      `Đã hoàn thành xuất sắc toàn bộ khóa học và bài thi sát hạch cấp độ`,
      width / 2,
      385
    );

    // Huy hiệu Cấp độ HSK
    ctx.font = '900 30px "Noto Serif SC", serif';
    ctx.fillStyle = '#E85D3F';
    ctx.fillText(`${cleanLevel} (HSK ${levelNumber}级)`, width / 2, 430);

    // Bảng thành tích phụ
    ctx.font = '500 15px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(
      `Kết quả Đề thi thử tổng kết: ${examPercent}%  |  Số bài học hoàn thành: ${completedCount}/20 bài`,
      width / 2,
      475
    );

    // 5. Chân trang: Mã chứng nhận & Con dấu triện
    // Góc trái: Thông tin cấp phát & Mã định danh
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Mã định danh xác thực: ${certCode}`, 100, 680);
    ctx.font = '500 13px sans-serif';
    ctx.fillText(`Ngày cấp phát: ${issueDate}`, 100, 705);
    ctx.font = '500 12px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Tra cứu tính hợp lệ tại: https://hanzigo-xi.vercel.app/verify', 100, 725);
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText('* Chứng nhận hoàn thành chương trình HSK HanziGo. Không thay thế chứng chỉ HSK quốc tế CTI/Hanban.', 100, 746);

    // Con dấu triện đỏ vuông truyền thống (Square Vermilion Seal) ở bên phải
    const sealX = width - 260;
    const sealY = 620;
    const sealSize = 95;

    ctx.save();
    ctx.strokeStyle = '#D92D20';
    ctx.lineWidth = 4;
    ctx.strokeRect(sealX, sealY, sealSize, sealSize);

    ctx.fillStyle = 'rgba(217, 45, 32, 0.06)';
    ctx.fillRect(sealX, sealY, sealSize, sealSize);

    // Chữ triện Hán bên trong con dấu: 汉字通印 (Hán Tự Thông Ấn)
    ctx.textAlign = 'center';
    ctx.font = '900 24px "Noto Serif SC", serif';
    ctx.fillStyle = '#D92D20';
    ctx.fillText('汉字', sealX + sealSize / 2, sealY + 42);
    ctx.fillText('通印', sealX + sealSize / 2, sealY + 74);
    ctx.restore();

    // Chữ ký hội đồng khảo thí
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('HỘI ĐỒNG KHẢO THÍ HANZIGO', sealX + sealSize / 2, sealY + 115);
    ctx.font = 'italic 12px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Ban Đánh giá Học thuật & Sư phạm', sealX + sealSize / 2, sealY + 132);

    setIsRendered(true);
  }, [isOpen, certificate]);

  // Tải file ảnh PNG độ phân giải 2x Retina
  const handleDownloadImage = () => {
    if (!canvasRef.current || !certificate) return;
    const link = document.createElement('a');
    link.download = `HanziGo_Certificate_${certificate.hskLevel}_${certificate.certificateCode}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  // Kích hoạt In A4 chuẩn trình duyệt
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden no-print">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                Chứng Nhận Hoàn Thành Cấp Độ {certificate.hskLevel}
              </h3>
              <p className="text-xs text-slate-500">Mã định danh xác thực: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{certificate.certificateCode}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Tải Ảnh HD (2x)
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#E85D3F] hover:bg-[#D44D30] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> In / Lưu PDF A4
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Preview Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center items-center bg-slate-100/70 dark:bg-slate-950/50">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-full border border-slate-200">
            <canvas
              ref={canvasRef}
              style={{ width: '100%', maxWidth: '880px', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Verification Footer Banner */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Chứng nhận hoàn thành chương trình HSK do HanziGo cấp.</span>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Lưu ý: Chứng nhận này phản ánh sự hoàn thành chương trình đào tạo nội bộ HanziGo, không thay thế chứng chỉ HSK chính thức do CTI / Hanban cấp.
            </p>
          </div>
          <div className="font-mono text-slate-500 font-bold">
            {certificate.certificateCode}
          </div>
        </div>
      </div>

      {/* Container ẩn phục vụ lệnh In A4 ngang chuẩn */}
      <div id="hanzigo-certificate-printable" className="hidden">
        <div className="p-8 border-8 border-[#8B1E1E] bg-[#FFFDF9] text-center max-w-[1000px] mx-auto">
          <h1 className="text-3xl font-black text-[#8B1E1E] mb-2 font-['Noto_Serif_SC']">汉语水平课程结业证书</h1>
          <h2 className="text-xl font-bold text-slate-800 mb-6">CHỨNG NHẬN HOÀN THÀNH CHƯƠNG TRÌNH HÁN NGỮ</h2>
          <p className="text-sm italic text-slate-600">Trân trọng chứng nhận học viên</p>
          <h3 className="text-2xl font-black text-slate-900 my-4">{certificate.userName}</h3>
          <p className="text-sm text-slate-700">Đã hoàn thành xuất sắc toàn bộ khóa học và sát hạch cấp độ</p>
          <h4 className="text-xl font-black text-[#E85D3F] my-3">{certificate.hskLevel}</h4>
          <p className="text-xs text-slate-600">Kết quả Đề thi thử: {certificate.examPercentage}% | Số bài học: {certificate.completedLessonsCount}/20 bài</p>
          <div className="mt-12 flex justify-between items-end text-xs text-slate-500 border-t pt-4">
            <div>
              <p>Mã xác thực: <strong>{certificate.certificateCode}</strong></p>
              <p>Ngày cấp: {certificate.issueDate}</p>
            </div>
            <div className="text-center font-bold text-slate-800">
              <p>HỘI ĐỒNG KHẢO THÍ HANZIGO</p>
              <p className="text-[10px] text-slate-500 font-normal">Ban Đánh giá Học thuật & Sư phạm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
