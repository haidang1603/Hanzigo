import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function RefundPolicyPage({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('current-status');

  const handleNav = (tab) => {
    playClickSound();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'current-status', title: '1. Hiện trạng: Nền tảng học tập miễn phí 100%', icon: Sparkles },
    { id: 'no-charge', title: '2. Cam kết không thu phí ẩn & Cảnh giác giả mạo', icon: ShieldCheck },
    { id: 'future-framework', title: '3. Khung chính sách khi mở dịch vụ trả phí', icon: CreditCard },
    { id: 'checklist', title: '4. Checklist điều kiện hoàn tiền chuẩn bị trước', icon: CheckCircle2 },
    { id: 'contact', title: '5. Thông tin liên hệ & Hỗ trợ học vụ', icon: Mail }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#243447] via-[#1E293B] to-[#131B24] text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 rounded-full bg-[#E85D3F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-semibold">
            <button 
              onClick={() => handleNav('home')} 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Trang chủ</span>
            </button>
            <span>/</span>
            <span className="text-[#E85D3F]">Chính sách học phí & Hoàn tiền</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold backdrop-blur-md border border-white/10">
            <Sparkles size={14} />
            <span>Nền tảng giáo dục mở — Hiện tại hoàn toàn miễn phí</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Chính Sách Học Phí, Giao Dịch & Hoàn Tiền
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Thông tin minh bạch về mô hình vận hành phi thương mại hiện tại của HanziGo, quy định về miễn phí học liệu và khung nguyên tắc xử lý giao dịch dự kiến khi triển khai các dịch vụ nâng cao trong tương lai.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>📅 Ngày hiệu lực: <strong>01/01/2026</strong></span>
            <span>•</span>
            <span>🔍 Cập nhật gần nhất: <strong>20/10/2026</strong></span>
            <span>•</span>
            <span>Trạng thái: <strong>Miễn phí toàn phần (Non-commercial)</strong></span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleNav('privacy')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Chính sách bảo mật</span>
          </button>
          <button
            onClick={() => handleNav('terms')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} />
            <span>Điều khoản dịch vụ</span>
          </button>
          <button
            onClick={() => handleNav('cookies')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Chính sách cookie</span>
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-default"
          >
            <CreditCard size={14} />
            <span>Học phí & Hoàn tiền</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-20 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
              Mục Lục Văn Bản
            </h3>
            <div className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isCurrent = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#E85D3F]/10 text-[#E85D3F] font-bold'
                        : 'text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} className={isCurrent ? 'text-[#E85D3F]' : 'shrink-0'} />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
              <span className="text-[11px] text-[#748092] block font-semibold">Tình trạng miễn phí</span>
              <p className="text-[11px] text-[#748092]">Mọi tính năng hiện tại trên HanziGo đều không yêu cầu nạp tiền hoặc thanh toán.</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-3 space-y-8 text-sm leading-relaxed text-[#243447] dark:text-[#E2E8F0]">

          {/* Section 1 */}
          <section id="current-status" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <Sparkles size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">1. Hiện Trạng Vận Hành: Nền Tảng Học Tập Miễn Phí 100%</h2>
            </div>
            <p>
              Hiện tại, <strong>HanziGo là dự án học tập mở và phi thương mại</strong> nhằm hỗ trợ cộng đồng người Việt Nam tiếp cận phương pháp học tiếng Trung khoa học, hiệu quả và dễ dàng nhất.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2 text-emerald-900 dark:text-emerald-200">
              <strong className="flex items-center gap-1.5 font-bold text-sm">
                <CheckCircle2 size={16} />
                Danh mục tính năng hoàn toàn MIỄN PHÍ:
              </strong>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li><strong>Toàn bộ 60 bài học</strong> thuộc Lộ trình chuẩn từ Nhập môn đến HSK 4.</li>
                <li><strong>Hệ thống Flashcard 3D</strong> và thuật toán ngắt quãng SM-2 không giới hạn số từ vựng.</li>
                <li><strong>Công cụ AI Speaking Lab</strong> nhận diện giọng nói và chẩn đoán thanh điệu.</li>
                <li><strong>Bàn tập viết Ô Mễ Tự A4</strong> với hoạt ảnh bút thuận và xuất file in A4 PDF.</li>
                <li><strong>Hệ thống thi thử HSK trực tuyến</strong> đầy đủ bài nghe MP3, chấm điểm và Sổ tay câu sai.</li>
                <li><strong>Thư viện học liệu mở OER</strong> tải miễn phí 20+ bộ tài liệu học thuật.</li>
                <li><strong>Phòng học tương tác LiveClassroom</strong> phục vụ giảng dạy và trao đổi học tập.</li>
              </ul>
            </div>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Vì hệ thống <strong>chưa mở cổng thanh toán</strong> và <strong>không bán bất kỳ gói dịch vụ có phí nào</strong>, hiện tại không phát sinh nghĩa vụ hoàn tiền cho người dùng.
            </p>
          </section>

          {/* Section 2 */}
          <section id="no-charge" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D97706]">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">2. Cam Kết Không Thu Phí Ẩn & Cảnh Giác Giả Mạo</h2>
            </div>
            <p>
              HanziGo cam kết giữ vững tính minh bạch đối với mọi tương tác của học viên trên nền tảng:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Không thu phí ngầm:</strong> Không có cơ chế tự động trừ tiền, không yêu cầu nhập thông tin thẻ tín dụng (Visa/Mastercard) khi đăng ký tài khoản.</li>
              <li><strong>Không bắt buộc trả phí để thi thử:</strong> Mọi học viên và khách vãng lai đều có thể làm bài thi thử HSK và tra cứu tài liệu mà không phải đóng bất kỳ khoản phí nào.</li>
            </ul>
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs space-y-1.5 text-rose-900 dark:text-rose-200">
              <strong className="flex items-center gap-1.5 font-bold">
                <AlertTriangle size={15} />
                Cảnh giác hành vi giả mạo:
              </strong>
              <p>
                Nếu có bất kỳ cá nhân hoặc tổ chức nào mạo danh HanziGo yêu cầu bạn chuyển khoản, nạp tiền mua khóa học hoặc cung cấp mã OTP/thẻ ngân hàng qua mạng xã hội (Facebook, Telegram, Zalo), đó hoàn toàn là hành vi lừa đảo. Vui lòng báo cáo ngay cho chúng tôi qua email: <a href="mailto:lehaidang16032006@gmail.com" className="font-bold underline">lehaidang16032006@gmail.com</a>.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="future-framework" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">3. Khung Chính Sách Dự Kiến Khi Có Dịch Vụ Thương Mại Hóa</h2>
            </div>
            <p>
              Trong tương lai, nếu HanziGo triển khai các gói dịch vụ nâng cao (như: gia sư AI chuyên sâu 1-1 không giới hạn token cao cấp, phòng thi có giáo viên chấm tự luận trực tiếp, hoặc tài liệu độc quyền có bản quyền thương mại), chính sách hoàn tiền sẽ được áp dụng theo các nguyên tắc chuẩn sau:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>⏱️ Thời hạn yêu cầu hoàn tiền:</strong> Sẽ được công bố rõ ràng và minh bạch trước thời điểm thanh toán (dự kiến trong vòng 7 ngày kể từ khi kích hoạt dịch vụ nếu phát sinh lỗi kỹ thuật hệ thống không thể khắc phục).
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>💳 Kênh hoàn tiền:</strong> Hoàn trả trực tiếp về phương thức thanh toán ban đầu (tài khoản ngân hàng hoặc ví điện tử nội địa) theo quy định của cổng thanh toán được cấp phép tại Việt Nam.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>⚠️ Trường hợp không áp dụng hoàn tiền:</strong> Người dùng đã sử dụng quá 50% khối lượng bài học của gói, hoặc cố ý vi phạm quy chế ứng xử/chia sẻ trái phép tài khoản cho nhiều người cùng lúc.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>⚖️ Tuân thủ pháp luật Việt Nam:</strong> Tuân thủ Luật Bảo vệ quyền lợi người tiêu dùng và các nghị định về thương mại điện tử hiện hành.
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="checklist" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">4. Checklist Kích Hoạt Trước Khi Thu Phí</h2>
            </div>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Trước khi mở bất kỳ giao dịch tài chính có phí nào, Ban điều hành HanziGo bắt buộc phải hoàn thành các bước kiểm tra sau:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Kiểm tra 1:</strong> Xác lập tư cách pháp nhân hoặc đăng ký hộ kinh doanh / đề án thương mại điện tử theo đúng quy định pháp luật Việt Nam.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Kiểm tra 2:</strong> Tích hợp cổng thanh toán được cấp phép (VNPay, MoMo, ZaloPay, hoặc cổng quốc tế) có hợp đồng đại lý và mã số thuế minh bạch.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Kiểm tra 3:</strong> Soạn thảo điều khoản thanh toán, biểu phí chi tiết và quy trình hoàn trả tiền tự động được chuyên gia pháp lý rà soát.</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Kiểm tra 4:</strong> Cung cấp hóa đơn điện tử hợp lệ cho từng giao dịch của người học.</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E85D3F]">
                <Mail size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">5. Thông Tin Liên Hệ & Giải Đáp Thắc Mắc</h2>
            </div>
            <p className="text-xs">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách học liệu mở hoặc cần xác minh thông tin tài khoản, vui lòng liên hệ:
            </p>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1.5">
              <p><strong>Dự án:</strong> Nền tảng học tiếng Trung HanziGo</p>
              <p><strong>Người đại diện dự án:</strong> Lê Hải Đăng</p>
              <p><strong>Email:</strong> <a href="mailto:lehaidang16032006@gmail.com" className="text-[#E85D3F] font-bold hover:underline">lehaidang16032006@gmail.com</a></p>
              <p><strong>Địa chỉ:</strong> Thành phố Đà Nẵng, Việt Nam</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
