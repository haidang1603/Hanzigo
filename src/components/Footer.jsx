import React from 'react';
import { 
  Send, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { speakChinese } from '../utils/audio';

export default function Footer({ setActiveTab }) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#243447] text-white pt-16 pb-12 border-t border-[#1B2636] relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-4 bottom-4 font-['Noto_Serif_SC'] text-9xl font-black text-white/[0.03] select-none pointer-events-none">
        汉语
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Highlight Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] shadow-xl mb-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              <Sparkles size={14} />
              <span>Châm ngôn mỗi ngày</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Noto_Serif_SC'] tracking-wide">
              千里之行，始于足下
            </h3>
            <p className="text-sm text-white/90 font-medium">
              Qiānlǐ zhī xíng, shǐ yú zúxià — <span className="italic">"Hành trình vạn dặm bắt đầu từ một bước chân."</span>
            </p>
          </div>
          <button
            onClick={() => speakChinese('千里之行，始于足下')}
            className="px-5 py-2.5 rounded-xl bg-white text-[#E85D3F] font-bold text-sm shadow-md hover:bg-[#FFF9F2] hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Nghe phát âm</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E85D3F] flex items-center justify-center text-white font-bold shadow-md">
                <span className="font-['Noto_Serif_SC'] text-2xl font-black">汉</span>
              </div>
              <span className="text-2xl font-black tracking-tight">
                Hanzi<span className="text-[#E85D3F]">Go</span>
              </span>
            </div>
            
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Nền tảng học tiếng Trung trực tuyến hiện đại dành riêng cho người Việt Nam. Tối ưu phương pháp phản xạ, chiết tự chữ Hán, phát âm chuẩn Bắc Kinh và đồng hành cùng bạn thi đỗ HSK.
            </p>

            <div className="pt-2 text-xs text-[#94A3B8] space-y-1">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#F4B942]" />
                <span>support@hanzigo.vn</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe size={14} className="text-[#45B97C]" />
                <span>Hà Nội & TP. Hồ Chí Minh, Việt Nam</span>
              </p>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              Khóa học & Lộ trình
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">Nhập môn Pinyin & Bút thuận</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">Khóa HSK 1 - 150 từ cơ bản</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">Khóa HSK 2 - Sơ cấp đàm thoại</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">Khóa HSK 3 - 4 Giao tiếp công sở</button></li>
              <li><button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">Luyện thi HSK 5-6 Chuyên sâu</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              Tính năng nổi bật
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><button onClick={() => handleNav('materials')} className="hover:text-white transition-colors text-[#F4B942] font-semibold">Thư viện Tài liệu & Giáo trình</button></li>
              <li><button onClick={() => handleNav('vocabulary')} className="hover:text-white transition-colors">Flashcard 3D thông minh SRS</button></li>
              <li><button onClick={() => handleNav('pronunciation')} className="hover:text-white transition-colors">Luyện phát âm & Nhận diện giọng</button></li>
              <li><button onClick={() => handleNav('writing')} className="hover:text-white transition-colors">Canvas tập viết chữ Hán mễ tự</button></li>
              <li><button onClick={() => handleNav('conversation')} className="hover:text-white transition-colors">Hội thoại AI Tiểu Hàm</button></li>
              <li><button onClick={() => handleNav('community')} className="hover:text-white transition-colors">Cộng đồng & Tìm bạn luyện nói</button></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              Nhận bài học mỗi ngày
            </h4>
            <p className="text-xs text-[#94A3B8]">
              Đăng ký nhận mẹo nhớ chữ Hán và từ vựng thông dụng gửi vào hòm thư mỗi sáng.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bài học!'); }} className="space-y-2">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1E293B] border border-[#2B3A4F] text-white placeholder-[#64748B] focus:outline-none focus:border-[#E85D3F]"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Đăng ký miễn phí</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>© 2026 HanziGo. Toàn bộ bản quyền thuộc về HanziGo Việt Nam.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('admin')} className="text-[#E85D3F] font-bold hover:underline flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>Quản trị viên (Admin)</span>
            </button>
            <a href="#privacy" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#terms" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
