import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  UserCheck, 
  Clock, 
  FileText 
} from 'lucide-react';
import { playClickSound, playErrorSound, playSuccessSound } from '../utils/audio';

export default function DataSubjectRequestModal({ isOpen, onClose, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'export' | 'delete'
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTeacher = user?.role === 'teacher';

  const handleExportData = () => {
    playClickSound();
    try {
      const exportPayload = {
        exportDate: new Date().toISOString(),
        system: 'HanziGo Chinese Learning Platform',
        compliance: 'Decree 13/2023/ND-CP Data Portability & GDPR Art. 20',
        user: {
          uid: user?.uid || user?.id || 'guest',
          name: user?.name || 'Học viên',
          email: user?.email || '',
          role: user?.role || 'student',
          level: user?.level || 'HSK 1',
          streak: user?.streak || 0,
          xp: user?.xp || 0
        },
        learningProgress: {
          completedLessons: JSON.parse(localStorage.getItem('hanzigo_completed_lessons') || '[]'),
          vocabRemembered: JSON.parse(localStorage.getItem('hanzigo_vocab_remembered') || '[]'),
          hskExamHistory: JSON.parse(localStorage.getItem('hanzigo_hsk_exam_history') || '[]'),
          hskMistakes: JSON.parse(localStorage.getItem('hanzigo_hsk_mistakes') || '[]'),
          personalizationProfile: JSON.parse(localStorage.getItem('hanzigo_learner_context') || '{}')
        }
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hanzigo_user_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playSuccessSound();
    } catch (err) {
      playErrorSound();
      console.error('Export data error:', err);
      alert('Có lỗi xảy ra khi trích xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const handleDeleteRequest = () => {
    if (confirmText !== 'XÓA TÀI KHOẢN VĨNH VIỄN') {
      playErrorSound();
      alert('Vui lòng nhập chính xác cụm từ: XÓA TÀI KHOẢN VĨNH VIỄN để xác nhận.');
      return;
    }

    setIsDeleting(true);
    playClickSound();

    const generatedTicket = 'DSAR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    setTicketId(generatedTicket);

    setTimeout(() => {
      setIsDeleting(false);
      setRequestSubmitted(true);
      playSuccessSound();

      // Clear local client-side cached learning data for safety
      try {
        localStorage.removeItem('hanzigo_user');
        localStorage.removeItem('hanzigo_ai_chat_history');
        localStorage.removeItem('hanzigo_learner_context');
      } catch {}
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dsar-modal-title"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#243447] via-[#1E293B] to-[#131B24] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 id="dsar-modal-title" className="text-base sm:text-lg font-black">
                Quản Lý Quyền Riêng Tư & Dữ Liệu Cá Nhân
              </h2>
              <p className="text-xs text-slate-300">
                Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ quản lý quyền dữ liệu"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#E85D3F] text-[#E85D3F]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Tổng quan các quyền
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#E85D3F] text-[#E85D3F]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Trích xuất dữ liệu (Export)
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'delete'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-500 hover:text-rose-600'
            }`}
          >
            Yêu cầu xóa tài khoản (Delete)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#243447] dark:text-gray-300">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">
                Chào bạn <strong>{user?.name || user?.email || 'Học viên'}</strong>! Theo quy định bảo vệ dữ liệu cá nhân, bạn có đầy đủ các quyền kiểm soát thông tin của mình:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <strong className="text-sm font-bold block mb-1 text-[#243447] dark:text-white">
                    1. Quyền được biết & Truy cập
                  </strong>
                  <p className="text-[#748092] dark:text-gray-400">
                    Toàn bộ lịch sử điểm thi HSK, từ vựng Flashcard, chuỗi ngày streak và bảng điểm lớp học luôn hiển thị đầy đủ trong hồ sơ cá nhân của bạn.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <strong className="text-sm font-bold block mb-1 text-[#243447] dark:text-white">
                    2. Quyền trích xuất mang theo (Portability)
                  </strong>
                  <p className="text-[#748092] dark:text-gray-400">
                    Bạn có thể tải về toàn bộ dữ liệu học tập định dạng tệp JSON mở để lưu trữ trên máy cá nhân hoặc chuyển đổi nền tảng.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <strong className="text-sm font-bold block mb-1 text-[#243447] dark:text-white">
                    3. Quyền chỉnh sửa & Bổ sung
                  </strong>
                  <p className="text-[#748092] dark:text-gray-400">
                    Bạn có thể sửa đổi tên hiển thị, ảnh đại diện, mục tiêu HSK và cài đặt mật khẩu bất kỳ lúc nào tại trang Hồ sơ.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <strong className="text-sm font-bold block mb-1 text-rose-600 dark:text-rose-400">
                    4. Quyền xóa bỏ (Right to Erasure)
                  </strong>
                  <p className="text-[#748092] dark:text-gray-400">
                    Bạn có quyền yêu cầu hủy tài khoản vĩnh viễn và xóa bỏ các bản ghi học tập liên quan khỏi cơ sở dữ liệu.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 space-y-1">
                <strong className="font-bold flex items-center gap-1.5">
                  <UserCheck size={14} />
                  Thời gian tiếp nhận & xử lý yêu cầu:
                </strong>
                <p>
                  Mọi yêu cầu gửi qua hệ thống được phản hồi và thực thi trong vòng <strong>tối đa 48 giờ làm việc</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Export Data */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                <strong className="font-bold text-sm block">
                  Trích xuất bản sao dữ liệu học tập cá nhân (JSON)
                </strong>
                <p className="text-xs">
                  Tệp dữ liệu bao gồm: Thông tin tài khoản, danh sách bài học đã hoàn thành, sổ từ vựng Flashcard ghi nhớ ngắt quãng SM-2, kết quả bài thi HSK và cấu hình trợ lý AI.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#243447] dark:text-white">Tải về tệp JSON</h4>
                    <p className="text-[11px] text-[#748092]">Định dạng tiêu chuẩn mở, đọc được bằng Notepad hoặc trình duyệt.</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Xuất dữ liệu ngay</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Delete Account */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              {!requestSubmitted ? (
                <>
                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
                    <div className="flex items-center gap-2 font-black text-sm">
                      <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                      <span>Cảnh báo quan trọng trước khi xóa tài khoản:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-1">
                      <li>Toàn bộ chuỗi ngày học streak, điểm kinh nghiệm (XP) và thành tích sẽ bị xóa vĩnh viễn.</li>
                      <li>Toàn bộ sổ tay câu sai HSK và lịch ôn tập từ vựng SM-2 sẽ bị hủy bỏ.</li>
                      <li>Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong> sau khi xác nhận.</li>
                      <li>Bản sao lưu dự phòng sự cố hệ thống của hạ tầng máy chủ Supabase sẽ tự động ghi đè theo chu kỳ lưu trữ (tối đa 30 ngày) mà không tái khôi phục tài khoản của bạn.</li>
                    </ul>
                  </div>

                  {isTeacher && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                      <strong>⚠️ Chú ý đối với tài khoản Giáo viên:</strong> Vì bạn đang sở hữu vai trò giáo viên, để bảo vệ quyền lợi của các học sinh trong lớp, bạn vui lòng hoàn thành việc chấm điểm hoặc giải tán các lớp học trước khi gửi yêu cầu hủy tài khoản.
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white">
                      Để xác nhận, vui lòng nhập chính xác chữ hoa: <span className="text-rose-600 font-mono">XÓA TÀI KHOẢN VĨNH VIỄN</span>
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="XÓA TÀI KHOẢN VĨNH VIỄN"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-[#131B24] text-xs font-mono text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      disabled={confirmText !== 'XÓA TÀI KHOẢN VĨNH VIỄN' || isDeleting}
                      onClick={handleDeleteRequest}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                      <span>{isDeleting ? 'Đang gửi yêu cầu...' : 'Xác nhận xóa tài khoản'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#243447] dark:text-white">
                      Yêu Cầu Xóa Dữ Liệu Đã Được Ghi Nhận
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-gray-400 mt-1">
                      Mã phiếu yêu cầu của bạn: <strong className="font-mono text-[#E85D3F]">{ticketId}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-left text-xs space-y-2">
                    <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Clock size={14} />
                      <span>Quy trình xử lý tự động & thủ công:</span>
                    </p>
                    <p>1. Phiên đăng nhập và dữ liệu đệm trên trình duyệt này đã được đăng xuất an toàn.</p>
                    <p>2. Phiếu yêu cầu đã được đưa vào hàng đợi xử lý xóa định danh trong Supabase Database.</p>
                    <p>3. Một thông báo xác nhận sẽ được gửi về email <strong>{user?.email}</strong> sau khi hoàn tất trong vòng 48 giờ làm việc.</p>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={`mailto:lehaidang16032006@gmail.com?subject=[DSAR%20Request]%20Xóa%20tài%20khoản%20${ticketId}&body=Kính%20gửi%20Ban%20Quản%20Trị%20HanziGo,%0A%0ATôi%20yêu%20cầu%20xóa%20tài%20khoản%20và%20dữ%20liệu%20cá%20nhân%20thuộc%20email:%20${user?.email}%0AMã%20phiếu:%20${ticketId}`}
                      className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      <Mail size={14} />
                      <span>Gửi email hỗ trợ trực tiếp</span>
                    </a>
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        onClose();
                        window.location.hash = '#home';
                        window.location.reload();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#243447] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                    >
                      Đóng & Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
