import React, { useState } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Database, 
  Settings, 
  Lock, 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  Info,
  ChevronRight,
  FileText
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function CookiePolicyPage({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('overview');

  const handleNav = (tab) => {
    playClickSound();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'overview', title: '1. Khái niệm & Công nghệ lưu trữ', icon: Cookie },
    { id: 'inventory', title: '2. Bảng kiểm kê Local Storage & Cookies', icon: Database },
    { id: 'classification', title: '3. Phân loại: Thiết yếu vs Tùy chọn', icon: Settings },
    { id: 'thirdparty', title: '4. Dịch vụ bên thứ ba & Dữ liệu', icon: ShieldCheck },
    { id: 'usercontrol', title: '5. Quyền kiểm soát & Hướng dẫn xóa', icon: Lock },
    { id: 'contact', title: '6. Thông tin liên hệ & Hỗ trợ', icon: Mail }
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
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-[#E85D3F]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

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
            <span className="text-[#E85D3F]">Chính sách lưu trữ & Cookie</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold backdrop-blur-md border border-white/10">
            <Cookie size={14} />
            <span>Minh bạch công nghệ lưu trữ cục bộ & Dữ liệu phiên</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Chính Sách Cookie & Lưu Trữ Dữ Liệu
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Tài liệu này giải thích cách HanziGo sử dụng LocalStorage, SessionStorage và Cookie kỹ thuật nhằm duy trì trạng thái đăng nhập, ghi nhớ tiến độ bài học và tối ưu trải nghiệm học tập của bạn.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>📅 Ngày hiệu lực: <strong>01/01/2026</strong></span>
            <span>•</span>
            <span>🔍 Cập nhật gần nhất: <strong>20/10/2026</strong></span>
            <span>•</span>
            <span>Phiên bản: <strong>1.0 (Chính thức)</strong></span>
          </div>
        </div>

        {/* Tab switch between Legal Pages */}
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-default"
          >
            <Cookie size={14} />
            <span>Chính sách cookie</span>
          </button>
          <button
            onClick={() => handleNav('refund')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Học phí & Hoàn tiền</span>
            <ChevronRight size={13} />
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
              <span className="text-[11px] text-[#748092] block font-semibold">Tùy chỉnh lưu trữ?</span>
              <p className="text-[11px] text-[#748092]">Bạn có thể xóa bộ nhớ đệm bất cứ lúc nào trong cài đặt trình duyệt hoặc ở cuối trang này.</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-3 space-y-8 text-sm leading-relaxed text-[#243447] dark:text-[#E2E8F0]">

          {/* Section 1 */}
          <section id="overview" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D97706]">
                <Cookie size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">1. Khái Niệm & Công Nghệ Lưu Trữ Trên HanziGo</h2>
            </div>
            <p>
              Để mang lại trải nghiệm học tiếng Trung mượt mà, tải nhanh và cho phép bạn tiếp tục bài học ngay cả khi kết nối mạng chập chờn, HanziGo sử dụng các công nghệ lưu trữ phía máy khách (Client-Side Storage):
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Local Storage (Bộ nhớ cục bộ):</strong> Lưu trữ dữ liệu lâu dài trong trình duyệt của bạn (như bài học đã hoàn thành, từ vựng Flashcard cần ôn tập, điểm streak). Dữ liệu này chỉ nằm trên thiết bị của bạn và không bị tự động gửi lên máy chủ trong mỗi yêu cầu HTTP.</li>
              <li><strong>Session Storage (Bộ nhớ phiên):</strong> Lưu dữ liệu tạm thời cho một phiên học hoặc bài thi thử HSK. Dữ liệu này sẽ tự động xóa khi bạn đóng tab trình duyệt.</li>
              <li><strong>Cookies kỹ thuật:</strong> Các chuỗi định danh mã hóa ngắn dùng cho xác thực bảo mật tài khoản (Supabase Auth token) khi bạn đăng nhập.</li>
            </ul>
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
              <strong className="flex items-center gap-1.5 font-bold">
                <Info size={15} />
                Lưu ý quan trọng:
              </strong>
              <p>
                HanziGo <strong>KHÔNG SỬ DỤNG</strong> bất kỳ cookie quảng cáo của bên thứ ba nào (như Google Ads, Facebook Pixel, Criteo hay mạng lưới tiếp thị lại). Chúng tôi không bán dữ liệu hay theo dõi hành vi duyệt web của bạn qua các trang web khác.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="inventory" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Database size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">2. Bảng Kiểm Kê Dữ Liệu Lưu Trữ Cụ Thể</h2>
            </div>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Dưới đây là danh mục toàn bộ các khóa dữ liệu (Storage Keys) đang được hệ thống HanziGo sử dụng:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Tên khóa (Key)</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Công nghệ</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Mục đích sử dụng</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Thời hạn</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Phân loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">sb-*-auth-token</td>
                    <td className="p-3">LocalStorage / Cookie</td>
                    <td className="p-3">Lưu trữ JWT session để duy trì đăng nhập an toàn với Supabase</td>
                    <td className="p-3">Theo phiên (Refresh khi hết hạn)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Thiết yếu</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_theme_dark</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Ghi nhớ tùy chọn giao diện Sáng (Light) / Tối (Dark)</td>
                    <td className="p-3">Vĩnh viễn cho đến khi xóa</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 text-[10px] font-bold">Tùy chọn hiển thị</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_completed_lessons</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Lưu danh sách ID các bài học trong lộ trình đã hoàn thành</td>
                    <td className="p-3">Vĩnh viễn (Đồng bộ mây khi đăng nhập)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Thiết yếu học tập</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_streak_count</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Lưu số ngày học liên tục (Streak) và ngày học gần nhất</td>
                    <td className="p-3">Vĩnh viễn (Cập nhật hàng ngày)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Thiết yếu học tập</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_vocab_schedule</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Lưu lịch ôn từ vựng theo thuật toán ngắt quãng SM-2</td>
                    <td className="p-3">Vĩnh viễn</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Thiết yếu học tập</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_ai_chat_history</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Lưu hội thoại luyện tập với AI Tutor để bạn có thể xem lại bài học</td>
                    <td className="p-3">Xóa được trong Cài đặt cá nhân hóa</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 text-[10px] font-bold">Tùy chọn AI</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-[#E85D3F]">hanzigo_storage_consent</td>
                    <td className="p-3">LocalStorage</td>
                    <td className="p-3">Ghi nhận lựa chọn đồng ý lưu trữ dữ liệu của người dùng</td>
                    <td className="p-3">12 tháng</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Thiết yếu</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section id="classification" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <Settings size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">3. Phân Loại: Công Nghệ Thiết Yếu vs Tùy Chọn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  1. Dữ liệu thiết yếu (Strictly Necessary)
                </strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Cần thiết để website hoạt động và cung cấp các dịch vụ cốt lõi bạn yêu cầu (đăng nhập, bảo mật phiên, lưu kết quả bài thi HSK, điểm danh phòng học LiveKit). Nhóm này không thể tắt nếu muốn sử dụng nền tảng một cách trọn vẹn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block flex items-center gap-1.5">
                  <Settings size={16} className="text-blue-500" />
                  2. Dữ liệu tùy chọn (Preferences & Analytics)
                </strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Bao gồm sở thích giao diện (chế độ tối/sáng), âm thanh phản hồi khi luyện tập, lịch sử hội thoại AI và chẩn đoán hiệu năng kỹ thuật cục bộ. Bạn có quyền từ chối hoặc xóa dữ liệu này bất cứ lúc nào.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="thirdparty" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">4. Tương Tác Với Nhà Cung Cấp Bên Thứ Ba</h2>
            </div>
            <p>Khi bạn học tập trên HanziGo, một số thư viện và dịch vụ kỹ thuật có thể lưu trữ tạm thời tài nguyên nhằm tối ưu băng thông:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Google Fonts:</strong> Trình duyệt tải phông chữ Noto Serif SC và Plus Jakarta Sans để hiển thị tiếng Trung và tiếng Việt sắc nét. Trình duyệt có thể lưu phông chữ vào bộ đệm cache cục bộ.</li>
              <li><strong>jsDelivr CDN (HanziWriter Data):</strong> Dữ liệu nét vector chữ Hán (Make Me a Hanzi) được nạp bất đồng bộ khi bạn tra cứu hoặc tập viết chữ Hán. Dữ liệu được cache trên trình duyệt để tránh tải lại nhiều lần.</li>
              <li><strong>LiveKit Cloud:</strong> Thiết lập kết nối WebRTC phòng học trực tuyến (không lưu trữ cookie quảng cáo).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="usercontrol" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E85D3F]">
                <Lock size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">5. Hướng Dẫn Kiểm Soát & Xóa Dữ Liệu Lưu Trữ</h2>
            </div>
            <p>Bạn có toàn quyền kiểm soát dữ liệu trên trình duyệt của mình bằng các cách sau:</p>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Cách 1: Xóa trong Cài đặt Trình duyệt</strong>
                <p className="text-[#748092] dark:text-[#94A3B8] mt-1">
                  Mở Cài đặt trình duyệt (Chrome, Safari, Edge, Firefox) &rarr; Quyền riêng tư & Bảo mật &rarr; Xóa dữ liệu duyệt web &rarr; Chọn "Cookies và dữ liệu trang web khác".
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Cách 2: Đặt lại tùy chọn Cookie trên HanziGo</strong>
                <p className="text-[#748092] dark:text-[#94A3B8] mt-1">
                  Bấm vào nút bên dưới để đặt lại thông báo tùy chọn lưu trữ và điều chỉnh lựa chọn của bạn:
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('hanzigo_storage_consent');
                      window.location.reload();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#243447] text-white font-bold text-xs hover:bg-[#E85D3F] transition-colors cursor-pointer"
                  >
                    🔄 Đặt lại tùy chọn lưu trữ & Tải lại trang
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E85D3F]">
                <Mail size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">6. Thông Tin Liên Hệ & Phản Hồi Kỹ Thuật</h2>
            </div>
            <p className="text-xs">
              Mọi thắc mắc hoặc báo cáo sự cố liên quan đến bộ nhớ đệm và công nghệ lưu trữ, xin vui lòng gửi về:
            </p>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-1.5">
              <p><strong>Người phụ trách kỹ thuật:</strong> Lê Hải Đăng</p>
              <p><strong>Email:</strong> <a href="mailto:lehaidang16032006@gmail.com" className="text-[#E85D3F] font-bold hover:underline">lehaidang16032006@gmail.com</a></p>
              <p><strong>Địa chỉ:</strong> Thành phố Đà Nẵng, Việt Nam</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
