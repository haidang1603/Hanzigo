import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, GraduationCap } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { isSupabaseConfigured } from '../supabase/config';
import { loginWithEmail, registerWithEmail, loginWithGoogle, generateUuid, isEmailAdmin } from '../supabase/services';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'teacher'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'HSK 1 - Sơ cấp'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !formData.name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    playClickSound();

    try {
      if (isSupabaseConfigured) {
        // Real Supabase Authentication
        let userData;
        if (mode === 'register') {
          userData = await registerWithEmail(
            formData.email,
            formData.password,
            formData.name,
            formData.level,
            selectedRole
          );
        } else {
          userData = await loginWithEmail(formData.email, formData.password, selectedRole);
        }
        playSuccessSound();
        onLoginSuccess(userData);
        onClose();
      } else {
        // Local Fallback simulation if Firebase/Supabase env keys are not added yet
        setTimeout(() => {
          playSuccessSound();
          const customAvatar = localStorage.getItem('hanzigo_custom_avatar');
          const generatedId = generateUuid();
          const isSysAdmin = isEmailAdmin(formData.email);
          const isTeacher = selectedRole === 'teacher';
          const defaultName = isSysAdmin ? 'Admin HanziGo' : isTeacher ? 'Thầy cô HanziGo' : 'Học viên HanziGo';
          const finalRole = isSysAdmin ? 'admin' : selectedRole;
          const userData = {
            uid: generatedId,
            id: generatedId,
            name: mode === 'register' ? formData.name : (formData.email.split('@')[0] || defaultName),
            email: formData.email,
            level: formData.level,
            role: finalRole,
            avatar: customAvatar || null,
            streak: 0,
            xp: 50,
            wordsLearned: 0
          };
          onLoginSuccess(userData);
          onClose();
        }, 500);
      }
    } catch (err) {
      playErrorSound();
      console.error(err);
      const msg = err.message || '';
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential' ||
        msg.includes('Invalid login credentials')
      ) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (
        err.code === 'auth/email-already-in-use' ||
        msg.includes('already registered')
      ) {
        setError('Email này đã được đăng ký tài khoản.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Email chưa được xác thực. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.');
      } else {
        setError(msg || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger Genuine Google OAuth Login
  const handleGoogleLogin = async () => {
    playClickSound();
    setLoading(true);
    setError('');

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase chưa được cấu hình. Vui lòng thiết lập biến môi trường VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
      }
      localStorage.setItem('hanzigo_oauth_intended_role', selectedRole);
      await loginWithGoogle();
      // Browser automatically redirects to accounts.google.com consent screen
    } catch (err) {
      playErrorSound();
      console.warn('Google OAuth error:', err);
      const msg = err.message || '';
      if (
        msg.includes('provider is not enabled') ||
        msg.includes('Unsupported provider') ||
        msg.includes('validation_failed') ||
        err.status === 400
      ) {
        setError('Đăng nhập Google chưa được kích hoạt trên Supabase. Vui lòng vào Supabase Dashboard > Authentication > Providers > Google để cấu hình Client ID & Secret.');
      } else {
        setError('Không thể kết nối Google OAuth: ' + (msg || 'Vui lòng thử lại sau.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#E85D3F] to-[#CB4529] p-6 text-white relative">
          <button 
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E85D3F] font-black flex items-center justify-center font-['Noto_Serif_SC'] text-2xl shadow-md">
              汉
            </div>
            {isSupabaseConfigured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-white border border-emerald-300/40">
                🟢 Supabase Connected
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold">
            {mode === 'login' ? 'Chào mừng bạn trở lại!' : 'Bắt đầu hành trình tiếng Trung'}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            {mode === 'login' 
              ? 'Đăng nhập để đồng bộ tiến độ học tập và chuỗi ngày rực lửa.'
              : 'Tạo tài khoản miễn phí trong 30 giây cùng hơn 10.000 người học.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  mode === 'login' 
                    ? 'text-[#E85D3F] border-b-2 border-[#E85D3F] font-bold' 
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('register');
                  setError('');
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  mode === 'register' 
                    ? 'text-[#E85D3F] border-b-2 border-[#E85D3F] font-bold' 
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
                  <p>{error}</p>
                </div>
              )}

              {/* Tùy chọn chức vụ: Học sinh vs Giáo viên */}
              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                  Chức vụ ({mode === 'login' ? 'Đăng nhập với vai trò' : 'Đăng ký tài khoản'})
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedRole('student');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === 'student'
                        ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-[#E85D3F] text-[#E85D3F] shadow-sm ring-1 ring-[#E85D3F]/30'
                        : 'bg-white dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                    }`}
                  >
                    <User size={15} />
                    <span>Học sinh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedRole('teacher');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedRole === 'teacher'
                        ? 'bg-[#FFF5F2] dark:bg-[#2C1D1A] border-[#E85D3F] text-[#E85D3F] shadow-sm ring-1 ring-[#E85D3F]/30'
                        : 'bg-white dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] dark:hover:text-white'
                    }`}
                  >
                    <GraduationCap size={15} />
                    <span>Giáo viên</span>
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                    Họ và tên của bạn
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-[#748092]" />
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn Minh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-[#748092]" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
                {isEmailAdmin(formData.email) && (
                  <p className="mt-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <span>🛡️</span>
                    <span>Hệ thống nhận diện: Tài khoản Quản trị viên (Admin)</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-[#748092]" />
                  <input
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                    Trình độ tiếng Trung hiện tại
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  >
                    <option value="Nhập môn - Chưa biết gì">Chưa biết gì (Học từ Pinyin và Nét chữ)</option>
                    <option value="HSK 1 - Sơ cấp">Đã biết chút ít / Học lại từ đầu</option>
                    <option value="HSK 2 - Giao tiếp">Đã có gốc cơ bản (Mục tiêu giao tiếp)</option>
                    <option value="HSK 3-4 - Ôn thi">Luyện thi lấy chứng chỉ HSK 3 - HSK 4</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Đăng nhập ngay' : 'Hoàn tất đăng ký'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Social Options Footer */}
            <div className="px-6 pb-6 text-center space-y-2.5">
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#F1E5D8] dark:border-[#2B3A4F]" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white dark:bg-[#1E293B] text-[#748092]">Hoặc đăng nhập nhanh</span></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-all flex items-center justify-center gap-2.5 shadow-sm group hover:border-[#4285F4] cursor-pointer"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Đăng nhập với tài khoản Google</span>
              </button>
            </div>
      </div>
    </div>
  );
}
