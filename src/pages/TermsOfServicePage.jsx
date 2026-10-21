import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle, 
  UserX, 
  Scale, 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function TermsOfServicePage({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('acceptance');

  const handleNav = (tab) => {
    playClickSound();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'acceptance', title: '1. Chấp thuận điều khoản', icon: FileText },
    { id: 'intellectual', title: '2. Quyền sở hữu trí tuệ & HSK', icon: BookOpen },
    { id: 'oer', title: '3. Giấy phép học liệu mở OER', icon: ShieldCheck },
    { id: 'conduct', title: '4. Ứng xử phòng học LiveKit', icon: CheckCircle2 },
    { id: 'disclaimer', title: '5. Miễn trừ trách nhiệm HSK', icon: AlertCircle },
    { id: 'accounts', title: '6. Tài khoản & Đình chỉ', icon: UserX },
    { id: 'liability', title: '7. Giới hạn trách nhiệm', icon: Scale },
    { id: 'law', title: '8. Luật áp dụng & Tranh chấp', icon: Scale },
    { id: 'contact', title: '9. Liên hệ Ban Học thuật', icon: Mail }
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
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/80 font-semibold">
            <button 
              onClick={() => handleNav('home')} 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Trang chủ</span>
            </button>
            <span>/</span>
            <span className="text-amber-300">Điều khoản dịch vụ</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20">
            <FileText size={14} className="text-amber-300" />
            <span>Quy chuẩn học tập văn minh & Bản quyền học thuật</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-['Noto_Serif_SC']">
            Điều Khoản Sử Dụng Dịch Vụ
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            Các quy tắc, điều kiện và thỏa thuận pháp lý điều chỉnh việc truy cập, tham gia lớp học trực tuyến, thi thử HSK và sử dụng học liệu trên nền tảng HanziGo.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span>📅 Ngày hiệu lực: <strong>01/01/2026</strong></span>
            <span>•</span>
            <span>🔍 Cập nhật gần nhất: <strong>12/10/2026</strong></span>
            <span>•</span>
            <span>Phiên bản: <strong>2.4 (Chuẩn mực)</strong></span>
          </div>
        </div>

        {/* Tab switch between Legal Pages */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleNav('privacy')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Chính sách bảo mật</span>
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white text-[#E85D3F] font-bold text-xs shadow-md flex items-center gap-1.5 cursor-default"
          >
            <FileText size={14} />
            <span>Điều khoản sử dụng</span>
          </button>
          <button
            onClick={() => handleNav('cookies')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Chính sách cookie</span>
          </button>
          <button
            onClick={() => handleNav('refund')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Học phí & Hoàn tiền</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid with Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-20 p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#748092] dark:text-[#94A3B8]">
              Mục Lục Điều Khoản
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
              <span className="text-[11px] text-[#748092] block font-semibold">Tư vấn bản quyền & Điều khoản?</span>
              <a
                href="mailto:lehaidang16032006@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D3F] hover:underline"
              >
                <Mail size={13} />
                <span>lehaidang16032006@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Text Body */}
        <div className="lg:col-span-3 space-y-8 text-sm leading-relaxed text-[#243447] dark:text-[#E2E8F0]">

          {/* Section 1: Acceptance */}
          <section id="acceptance" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#E85D3F]">
                <FileText size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">1. Chấp Thuận Điều Khoản & Phạm Vi Áp Dụng</h2>
            </div>
            <p>
              Bằng việc truy cập, tạo tài khoản hoặc sử dụng bất kỳ tính năng nào của HanziGo, bạn xác nhận rằng mình đã đọc, hiểu rõ và đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này.
            </p>
            <p>
              Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng ngừng sử dụng nền tảng. HanziGo bảo lưu quyền sửa đổi, bổ sung các điều khoản này nhằm đáp ứng các thay đổi về mặt công nghệ hoặc quy định pháp luật; phiên bản cập nhật sẽ được thông báo rõ ràng trên website.
            </p>
          </section>

          {/* Section 2: Intellectual Property */}
          <section id="intellectual" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">2. Quyền Sở Hữu Trí Tuệ & Bản Quyền Học Thuật</h2>
            </div>
            <p>
              HanziGo luôn tôn trọng quyền tác giả và tài sản trí tuệ của các tổ chức giáo dục quốc tế:
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                <strong className="text-sm font-bold text-[#E85D3F] block">🏛️ Tài liệu Khảo thí HSK (CTI / Hanban)</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Tất cả các đề cương, bài thi mẫu chính thức và tài liệu do Chinese Testing International (CTI) hoặc Khổng Tử Học Viện (Hanban) phát hành thuộc bản quyền của các đơn vị này. HanziGo chỉ đóng vai trò thư mục siêu dữ liệu (Metadata Index) và <strong>chỉ dẫn liên kết gốc (Linked-Only)</strong> đến cổng tải chính thức của CTI. HanziGo tuyệt đối không tự ý lưu trữ trái phép hay bán lại các đề thi này.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                <strong className="text-sm font-bold text-[#E85D3F] block">📚 Giáo trình Thương mại (BLCU Press, v.v.)</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Tên gọi và hình ảnh trích đoạn giáo trình được sử dụng theo nguyên tắc trích dẫn học thuật hợp lý (Fair Use Citation) nhằm hướng dẫn người học lựa chọn sách chuẩn. Chúng tôi không cung cấp tệp PDF lậu toàn bộ cuốn sách có bản quyền thương mại.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5">
                <strong className="text-sm font-bold text-[#45B97C] block">⚡ Nội dung Độc quyền HanziGo</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Giao diện, mã nguồn, thuật toán SRS, bài giảng tương tác Pinyin, mẫu vở kẻ ô Mễ tự A4, hệ thống câu hỏi mô phỏng độc quyền và nhận diện giọng nói do đội ngũ HanziGo sở hữu bản quyền.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: OER License */}
          <section id="oer" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">3. Giấy Phép Tài Nguyên Giáo Dục Mở (OER)</h2>
            </div>
            <p>
              Các tài nguyên được dán nhãn <strong>Giáo dục Mở (OER)</strong> hoặc <strong>Creative Commons (CC BY-NC-SA 4.0 / 3.0)</strong> trong Thư viện học liệu HanziGo tuân thủ các quy tắc sau:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Tự do học tập phi thương mại:</strong> Bạn được phép đọc, tải về, in ấn vở tập viết A4 để tự học hoặc dùng trong lớp học phi thương mại.</li>
              <li><strong>Ghi nhận nguồn gốc (Attribution):</strong> Khi chia sẻ hoặc trích dẫn lại, bạn phải giữ nguyên tên tác giả gốc và đường dẫn đến tài liệu.</li>
              <li><strong>Nghiêm cấm thương mại hóa:</strong> Tuyệt đối không được sao chép tài nguyên miễn phí của HanziGo để đóng gói bán lấy tiền trên các hội nhóm hoặc sàn thương mại điện tử.</li>
            </ul>
          </section>

          {/* Section 4: Live Classroom Conduct */}
          <section id="conduct" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">4. Quy Tắc Ứng Xử Phòng Học Trực Tuyến LiveKit & Cộng Đồng</h2>
            </div>
            <p>
              Khi tham gia phòng học trực tuyến LiveClassroom hoặc đăng bài thảo luận trong Cộng đồng HanziGo, người dùng cam kết:
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-2 text-amber-900 dark:text-amber-200">
              <strong className="block font-bold">Các hành vi bị nghiêm cấm tuyệt đối:</strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Sử dụng ngôn từ thô tục, xúc phạm giáo viên, trợ giảng hoặc bạn học.</li>
                <li>Bật mic phát âm thanh phản cảm hoặc làm gián đoạn giờ học chung mà không có sự cho phép của giáo viên.</li>
                <li>Đăng tải nội dung quảng cáo rác, lừa đảo, phát tán mã độc hoặc nội dung vi phạm thuần phong mỹ tục.</li>
                <li>Cố ý can thiệp kỹ thuật hoặc giả mạo quyền hạn giáo viên (Host moderation escalation).</li>
              </ul>
              <p className="pt-1 text-[11px] italic">
                * Giáo viên và Ban quản trị có toàn quyền tắt mic, mời ra khỏi phòng học hoặc khóa tài khoản vĩnh viễn đối với các trường hợp vi phạm.
              </p>
            </div>
          </section>

          {/* Section 5: Disclaimer */}
          <section id="disclaimer" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">5. Tuyên Bố Miễn Trừ Trách Nhiệm Về Điểm Thi HSK</h2>
            </div>
            <p>
              HanziGo cam kết cung cấp hệ thống đề thi mô phỏng bám sát cấu trúc đề thi thật của Hanban / CTI nhất có thể. Tuy nhiên:
            </p>
            <div className="space-y-2 text-xs">
              <p>
                1. <strong>Đề thi mô phỏng chỉ mang tính chất rèn luyện:</strong> Điểm số đạt được trên hệ thống thi thử HanziGo là chỉ số dự báo năng lực tham khảo trung thực, <strong>không thay thế cho chứng chỉ HSK chính thức</strong> do tổ chức khảo thí quốc tế CTI cấp.
              </p>
              <p>
                2. <strong>Bài viết tự do (HSK 3 - 6):</strong> Đối với các câu hỏi viết văn miêu tả tranh hoặc tóm tắt đoạn văn, hệ thống cung cấp thang tiêu chí đánh giá (Rubric) và bài văn mẫu đạt điểm tối đa để bạn tự đối chiếu. HanziGo không chấm bài viết tự do bằng các thuật toán đơn giản lừa dối người học.
              </p>
              <p>
                3. <strong>Giới hạn & Độ tin cậy của Trợ lý AI (AI Tutor):</strong> Các câu trả lời, hội thoại và giải thích ngữ pháp của AI (Tiểu Hàm, Lão Sư AI) được sinh tự động nhằm mục đích hỗ trợ học tập và luyện phản xạ. Mô hình ngôn ngữ AI có thể phát sinh sai sót hoặc hiện tượng ảo giác (hallucination). Nội dung do AI tạo ra chỉ mang tính chất tham khảo sư phạm và không thay thế cho giáo viên thực tế hoặc giáo trình được thẩm định chính thức.
              </p>
              <p>
                4. <strong>Không bảo đảm đỗ 100% nếu không tự nỗ lực:</strong> Kết quả thi thật phụ thuộc vào sự rèn luyện bền bỉ, tâm lý phòng thi và vốn từ vựng thực tế của từng học viên.
              </p>
            </div>
          </section>

          {/* Section 6: Accounts & Termination */}
          <section id="accounts" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <UserX size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">6. Quản Lý Tài Khoản & Chấm Dứt Dịch Vụ</h2>
            </div>
            <p className="text-xs">
              Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình. HanziGo có quyền đình chỉ hoặc hủy bỏ tài khoản của bạn ngay lập tức nếu phát hiện bạn có hành vi tấn công từ chối dịch vụ (DDoS), khai thác lỗ hổng bảo mật, gian lận điểm số trên Bảng xếp hạng hoặc vi phạm nghiêm trọng quy chuẩn cộng đồng.
            </p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section id="liability" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                <Scale size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">7. Giới Hạn Trách Nhiệm Pháp Lý</h2>
            </div>
            <p className="text-xs">
              Trong phạm vi tối đa được pháp luật cho phép, HanziGo sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc do gián đoạn đường truyền Internet của bên thứ ba, sự cố mạng viễn thông hoặc sự cố ngoài tầm kiểm soát hợp lý của chúng tôi.
            </p>
          </section>

          {/* Section 8: Law & Disputes */}
          <section id="law" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Scale size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">8. Luật Áp Dụng & Giải Quyết Tranh Chấp</h2>
            </div>
            <p className="text-xs">
              Các điều khoản này được điều chỉnh và giải thích theo quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh sẽ trước hết được giải quyết thông qua thương lượng hòa giải thiện chí giữa các bên. Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan Tòa án có thẩm quyền tại Việt Nam.
            </p>
          </section>

          {/* Section 9: Contact */}
          <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#E85D3F]">
                <Mail size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">9. Thông Tin Liên Hệ Ban Học Thuật & Pháp Chế</h2>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-2">
              <p><strong>Nền tảng:</strong> HanziGo — Nền Tảng Học Tiếng Trung Hiện Đại Cho Người Việt</p>
              <p><strong>Đại diện pháp lý & Kỹ thuật:</strong> Lê Hải Đăng</p>
              <p><strong>Email liên hệ:</strong> <a href="mailto:lehaidang16032006@gmail.com" className="text-[#E85D3F] font-bold hover:underline">lehaidang16032006@gmail.com</a></p>
              <p><strong>Trụ sở:</strong> Thành phố Đà Nẵng, Việt Nam</p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <button
                onClick={() => handleNav('home')}
                className="px-5 py-2.5 rounded-xl bg-[#243447] text-white font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quay lại trang chủ HanziGo</span>
              </button>

              <button
                onClick={() => handleNav('privacy')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem Chính sách bảo mật</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
