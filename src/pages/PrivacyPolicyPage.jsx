import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Mic, 
  UserCheck, 
  Mail, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function PrivacyPolicyPage({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('intro');

  const handleNav = (tab) => {
    playClickSound();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'intro', title: '1. Giới thiệu & Cam kết', icon: ShieldCheck },
    { id: 'collection', title: '2. Dữ liệu thu thập', icon: Database },
    { id: 'voice', title: '3. Dữ liệu giọng nói & Mic', icon: Mic },
    { id: 'usage', title: '4. Mục đích sử dụng dữ liệu', icon: Eye },
    { id: 'security', title: '5. Bảo mật & Zero-Trust', icon: Lock },
    { id: 'rights', title: '6. Quyền của học viên & DSAR', icon: UserCheck },
    { id: 'minors', title: '7. Bảo vệ trẻ vị thành niên', icon: Sparkles },
    { id: 'processors', title: '8. Bên thứ ba xử lý dữ liệu', icon: ShieldCheck },
    { id: 'retention', title: '9. Thời hạn lưu trữ dữ liệu', icon: Database },
    { id: 'cookies', title: '10. Cookies & Lưu trữ', icon: FileText },
    { id: 'contact', title: '11. Đơn vị vận hành & Liên hệ', icon: Mail }
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
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

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
            <span className="text-[#E85D3F]">Chính sách bảo mật</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold backdrop-blur-md border border-white/10">
            <ShieldCheck size={14} />
            <span>Bảo vệ quyền dữ liệu cá nhân & Tuân thủ pháp luật</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Chính Sách Bảo Mật & Quyền Riêng Tư
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            HanziGo cam kết bảo vệ dữ liệu cá nhân của người học tiếng Trung theo tiêu chuẩn bảo mật hiện đại nhất, tuân thủ Nghị định 13/2023/NĐ-CP (Việt Nam) và các nguyên tắc bảo vệ quyền riêng tư quốc tế.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>📅 Ngày hiệu lực: <strong>01/01/2026</strong></span>
            <span>•</span>
            <span>🔍 Cập nhật gần nhất: <strong>12/10/2026</strong></span>
            <span>•</span>
            <span>Phiên bản: <strong>2.4 (Toàn diện)</strong></span>
          </div>
        </div>

        {/* Tab switch between Legal Pages */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-default"
          >
            <ShieldCheck size={14} />
            <span>Chính sách bảo mật</span>
          </button>
          <button
            onClick={() => handleNav('terms')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} />
            <span>Điều khoản sử dụng</span>
          </button>
          <button
            onClick={() => handleNav('cookies')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
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

      {/* 2. Main Content Grid with Table of Contents */}
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
              <span className="text-[11px] text-[#748092] block font-semibold">Cần giải đáp quyền riêng tư?</span>
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

          {/* Section 1: Intro */}
          <section id="intro" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">1. Giới Thiệu & Cam Kết Bảo Mật</h2>
            </div>
            <p>
              Chào mừng bạn đến với <strong>HanziGo</strong> (gọi tắt là "Chúng tôi", "Nền tảng"). Chúng tôi thấu hiểu rằng thông tin cá nhân và tiến trình học tập là những dữ liệu nhạy cảm thuộc quyền sở hữu riêng tư của bạn.
            </p>
            <p>
              Chính sách bảo mật này giải thích minh bạch cách HanziGo thu thập, bảo vệ, lưu trữ và sử dụng dữ liệu khi bạn truy cập website, luyện thi HSK, học từ vựng Flashcard, tham gia phòng học trực tiếp hoặc duyệt Thư viện tài nguyên mở.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5 text-emerald-900 dark:text-emerald-200">
              <strong className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={15} />
                Cam kết 3 KHÔNG của HanziGo:
              </strong>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong>KHÔNG BÁN</strong> hoặc trao đổi dữ liệu cá nhân hay hồ sơ học tập của bạn cho bất kỳ nhà quảng cáo bên thứ ba nào.</li>
                <li><strong>KHÔNG BẮT BUỘC ĐĂNG KÝ</strong> đối với người dùng chỉ có nhu cầu thi thử HSK trải nghiệm hoặc tra cứu Thư viện tài nguyên mở.</li>
                <li><strong>KHÔNG THU THẬP DỮ LIỆU NGOÀI PHẠM VI</strong> phục vụ trực tiếp cho việc nâng cao hiệu quả học tiếng Trung.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Data Collection */}
          <section id="collection" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Database size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">2. Những Dữ Liệu Chúng Tôi Thu Thập</h2>
            </div>
            <p>Tùy theo mức độ tương tác của bạn với HanziGo, các loại dữ liệu được thu thập bao gồm:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block">👤 Thông tin tài khoản</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Địa chỉ email, họ và tên hiển thị, mật khẩu đã mã hóa một chiều (bảo vệ bởi Supabase Auth), vai trò (Học viên hoặc Giáo viên).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block">📈 Tiến trình & Thành tích</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Chuỗi ngày học liên tục (Streak), điểm kinh nghiệm (XP), lịch sử lặp lại ngắt quãng SM-2 của thẻ Flashcard, tiến độ hoàn thành các bài học trong Lộ trình 60 bài.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block">📝 Kết quả thi HSK</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Điểm thi mô phỏng, thời gian làm bài, tỷ lệ chính xác theo kỹ năng (Nghe, Đọc, Viết) và danh sách câu hỏi trong Sổ tay câu sai.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <strong className="text-sm font-bold text-[#243447] dark:text-white block">🏫 Dữ liệu Lớp học trực tiếp</strong>
                <p className="text-[#748092] dark:text-[#94A3B8]">
                  Mã lớp học, trạng thái điểm danh, danh sách bài tập đã nộp cho giáo viên và tương tác trong buổi học LiveKit.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Voice Data */}
          <section id="voice" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <Mic size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">3. Quyền Truy Cập Microphone & Dữ Liệu Phát Âm</h2>
            </div>
            <p>
              Để hỗ trợ bạn rèn luyện phát âm chuẩn ngữ âm Pinyin và tham gia phòng học trực tiếp, trình duyệt sẽ yêu cầu quyền truy cập <strong>Microphone</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Chỉ xử lý thời gian thực:</strong> Giọng nói phát âm của bạn được chuyển đổi thành văn bản và phân tích thanh điệu tại chỗ bằng Web Speech API chuẩn trình duyệt. HanziGo <strong>không lưu trữ các tệp âm thanh ghi âm lén lút</strong> vào máy chủ.</li>
              <li><strong>Trong phòng học trực tuyến LiveKit:</strong> Âm thanh đàm thoại chỉ truyền trực tiếp (peer-to-peer/SFU) giữa các thành viên có mặt trong phòng học đã được xác thực mã phòng. Luồng âm thanh được mã hóa đường truyền TLS/WebRTC.</li>
              <li><strong>Bạn toàn quyền kiểm soát:</strong> Bạn có thể tắt Micro hoặc thu hồi quyền truy cập Micro trong cài đặt trình duyệt bất kỳ lúc nào.</li>
            </ul>
          </section>

          {/* Section 4: Purpose */}
          <section id="usage" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#E85D3F]">
                <Eye size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">4. Mục Đích Sử Dụng Dữ Liệu</h2>
            </div>
            <p>Chúng tôi chỉ sử dụng thông tin thu thập được cho các mục đích học thuật và vận hành sau:</p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#E85D3F] shrink-0 mt-0.5" />
                <span><strong>Cá nhân hóa việc ôn tập:</strong> Thuật toán SM-2 tính toán chính xác ngày một từ vựng cần được lặp lại dựa trên độ nhớ của bạn.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#E85D3F] shrink-0 mt-0.5" />
                <span><strong>Duy trì bảng xếp hạng & Động lực:</strong> Hiển thị vị trí của bạn trên Bảng phong thần học viên và ghi nhận thành tích streak.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#E85D3F] shrink-0 mt-0.5" />
                <span><strong>Báo cáo sư phạm cho giáo viên:</strong> Phân tích điểm yếu và cảnh báo sớm học viên cần quan tâm đặc biệt (At-risk detection) để giáo viên kịp thời hỗ trợ.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#E85D3F] shrink-0 mt-0.5" />
                <span><strong>Hỗ trợ kỹ thuật:</strong> Xử lý các báo cáo liên kết tài liệu hỏng hoặc lỗi đề thi do bạn gửi qua hệ thống.</span>
              </div>
            </div>
          </section>

          {/* Section 5: Security */}
          <section id="security" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D97706]">
                <Lock size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">5. Cơ Chế Bảo Mật & Kiến Trúc Zero-Trust</h2>
            </div>
            <p>HanziGo áp dụng các chuẩn mực an ninh thông tin cấp doanh nghiệp:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs">
              <li><strong>Mã hóa toàn diện:</strong> 100% dữ liệu truyền qua mạng được bảo vệ bởi giao thức HTTPS/TLS 1.3 với chứng chỉ SSL hợp lệ.</li>
              <li><strong>Row Level Security (RLS) trên Supabase:</strong> Mỗi dòng dữ liệu học tập của học viên được cô lập bằng chính sách RLS cấp cơ sở dữ liệu. Người dùng khác không thể truy vấn hoặc can thiệp vào bảng điểm hay sổ tay câu sai của bạn.</li>
              <li><strong>Kiểm soát phân quyền nghiêm ngặt (RBAC):</strong> Giáo viên của Lớp A tuyệt đối không thể truy cập danh sách học viên hoặc điểm số của Lớp B. Học viên không thể tự nâng quyền lên giáo viên hay quản trị viên.</li>
              <li><strong>Bảo vệ mật khẩu:</strong> Mật khẩu được mã hóa băm bằng thuật toán bcrypt an toàn. Đội ngũ HanziGo không bao giờ nhìn thấy mật khẩu dạng văn bản thô của bạn.</li>
            </ul>
          </section>

          {/* Section 6: Rights */}
          <section id="rights" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                <UserCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">6. Quyền Hạn Của Học Viên Đối Với Dữ Liệu</h2>
            </div>
            <p>Theo quy định của pháp luật hiện hành, bạn có đầy đủ các quyền sau:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>🔍 Quyền được biết & Tra cứu:</strong> Bạn có quyền xem toàn bộ lịch sử thi, số từ vựng đã thuộc và thông tin hồ sơ của mình trong trang Hồ sơ cá nhân.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>✏️ Quyền chỉnh sửa:</strong> Bạn có thể cập nhật tên hiển thị, mật khẩu và thông tin liên hệ bất kỳ lúc nào.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>🗑️ Quyền yêu cầu xóa bỏ (Right to be Forgotten):</strong> Bạn có quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ lịch sử học tập bằng cách gửi email cho Ban quản trị.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>👤 Quyền học tập ẩn danh:</strong> Bạn hoàn toàn có thể thi thử HSK và duyệt tài liệu mà không cần tạo tài khoản.
              </div>
            </div>
          </section>

          {/* Section 7: Minors */}
          <section id="minors" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                <Sparkles size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">7. Bảo Vệ Dữ Liệu Học Viên Vị Thành Niên</h2>
            </div>
            <p>
              HanziGo khuyến khích phụ huynh và người giám hộ đồng hành cùng các học sinh dưới 16 tuổi trong quá trình học tiếng Trung.
            </p>
            <p className="text-xs">
              Chúng tôi không cố ý thu thập thông tin nhận dạng nhạy cảm ngoài học tập của trẻ vị thành niên. Khi tham gia các lớp học trực tuyến, giáo viên phụ trách có trách nhiệm giám sát và bảo đảm môi trường học tập lành mạnh, tôn trọng quyền riêng tư của các em.
            </p>
          </section>

          {/* Section 8: Third-Party Processors */}
          <section id="processors" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">8. Danh Mục Bên Thứ Ba Xử Lý Dữ Liệu (Third-Party Processors)</h2>
            </div>
            <p>
              HanziGo chỉ hợp tác với các nhà cung cấp hạ tầng kỹ thuật đáng tin cậy phục vụ vận hành ứng dụng:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Nhà cung cấp</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Chức năng tích hợp</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Dữ liệu chia sẻ</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-700">Chính sách bảo mật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="p-3 font-bold text-[#E85D3F]">Supabase Inc. (AWS)</td>
                    <td className="p-3">Xác thực tài khoản (Auth) & Cơ sở dữ liệu Postgres RLS</td>
                    <td className="p-3">Email, họ tên, tiến độ học, điểm thi, vai trò</td>
                    <td className="p-3"><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">supabase.com/privacy</a></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#E85D3F]">LiveKit Cloud</td>
                    <td className="p-3">Phòng học trực tuyến WebRTC SFU (Audio/Video thời gian thực)</td>
                    <td className="p-3">Mã phòng, ID phòng học, luồng âm thanh/video thời gian thực (không lưu lại file ghi âm)</td>
                    <td className="p-3"><a href="https://livekit.io/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">livekit.io/privacy</a></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#E85D3F]">xKiro / Google Gemini</td>
                    <td className="p-3">Gia sư AI học thuật (AI Tutor, hội thoại Tiểu Hàm, gợi ý bài tập)</td>
                    <td className="p-3">Nội dung câu hỏi học thuật, cấp độ HSK mục tiêu (tuyệt đối không gửi email, mật khẩu hay token xác thực)</td>
                    <td className="p-3"><span className="text-gray-500">API hợp đồng bảo mật không lưu dữ liệu huấn luyện</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#E85D3F]">Google Fonts & jsDelivr</td>
                    <td className="p-3">Phông chữ hiển thị Noto Serif SC & dữ liệu vector nét bút HanziWriter</td>
                    <td className="p-3">Chỉ yêu cầu HTTP tiêu chuẩn trình duyệt để tải tệp tĩnh</td>
                    <td className="p-3"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">google.com/privacy</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 9: Retention */}
          <section id="retention" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Database size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">9. Thời Hạn Lưu Trữ Dữ Liệu & Quy Trình Bản Sao Lưu</h2>
            </div>
            <p>
              HanziGo chỉ lưu giữ dữ liệu cá nhân trong khoảng thời gian cần thiết để phục vụ mục đích học tập của bạn:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Dữ liệu tài khoản & học tập:</strong> Lưu trữ trong suốt thời gian tài khoản hoạt động. Khi bạn gửi yêu cầu xóa tài khoản (DSAR), dữ liệu sẽ được xóa khỏi bảng dữ liệu chính trong vòng 48 giờ làm việc.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Bản sao lưu dự phòng (Backups):</strong> Bản sao lưu sự cố hệ thống do Supabase quản lý được lưu trữ mã hóa và tự động ghi đè theo chu kỳ lưu trữ (tối đa 30 ngày) mà không phục hồi lại dữ liệu đã xóa.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Dữ liệu âm thanh phát âm:</strong> Xử lý tức thì tại trình duyệt (Zero-retention). Không lưu tệp âm thanh giọng nói trên máy chủ.
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                <strong>Bộ nhớ đệm trình duyệt (LocalStorage):</strong> Bạn có toàn quyền xóa dữ liệu bất kỳ lúc nào tại cài đặt trình duyệt hoặc thông qua công cụ tùy chọn của HanziGo.
              </div>
            </div>
          </section>

          {/* Section 10: Cookies */}
          <section id="cookies" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                <FileText size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">10. Cơ Chế Lưu Trữ Cục Bộ (Local Storage) & Cookies</h2>
            </div>
            <p>
              HanziGo chủ yếu sử dụng <strong>Local Storage</strong> của trình duyệt để nâng cao tốc độ tải trang, lưu trữ ngoại tuyến và duy trì phiên đăng nhập an toàn. Chi tiết về danh mục khóa lưu trữ và quyền tùy chỉnh được công bố đầy đủ tại:
            </p>
            <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
              <span className="font-bold text-xs text-[#243447] dark:text-white">Xem chi tiết Chính Sách Lưu Trữ & Cookie</span>
              <button
                onClick={() => handleNav('cookies')}
                className="px-3.5 py-1.5 rounded-lg bg-[#E85D3F] text-white font-bold text-xs hover:bg-[#CB4529] transition-colors cursor-pointer"
              >
                Mở chính sách cookie &rarr;
              </button>
            </div>
          </section>

          {/* Section 11: Contact & Operator */}
          <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FEF7E9] dark:from-[#131B24] dark:via-[#1B2636] dark:to-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E85D3F]">
                <Mail size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-black">11. Thông Tin Đơn Vị Vận Hành & Tiếp Nhận Yêu Cầu (DSAR)</h2>
            </div>
            <p>
              Nếu bạn có bất kỳ câu hỏi, yêu cầu truy cập, sửa đổi hoặc xóa dữ liệu cá nhân theo quy định của Nghị định 13/2023/NĐ-CP, vui lòng liên hệ:
            </p>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs space-y-2">
              <p><strong>Dự án:</strong> Nền tảng học tiếng Trung trực tuyến HanziGo (Dự án giáo dục phi thương mại)</p>
              <p><strong>Người đại diện & phụ trách dữ liệu:</strong> Lê Hải Đăng</p>
              <p><strong>Email tiếp nhận DSAR:</strong> <a href="mailto:lehaidang16032006@gmail.com" className="text-[#E85D3F] font-bold hover:underline">lehaidang16032006@gmail.com</a></p>
              <p><strong>Địa chỉ liên hệ:</strong> Thành phố Đà Nẵng, Việt Nam</p>
              <p><strong>Thời hạn giải quyết:</strong> Tối đa 48 giờ làm việc kể từ thời điểm nhận được yêu cầu hợp lệ.</p>
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
                onClick={() => handleNav('terms')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem Điều khoản sử dụng</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
