import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { isFirebaseConfigured } from '../firebase/config';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../firebase/services';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
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
      if (isFirebaseConfigured) {
        // Real Firebase Authentication
        let userData;
        if (mode === 'register') {
          userData = await registerWithEmail(
            formData.email,
            formData.password,
            formData.name,
            formData.level
          );
        } else {
          userData = await loginWithEmail(formData.email, formData.password);
        }
        playSuccessSound();
        onLoginSuccess(userData);
        onClose();
      } else {
        // Local Fallback simulation if Firebase env keys are not added yet
        setTimeout(() => {
          playSuccessSound();
          const userData = {
            name: mode === 'register' ? formData.name : (formData.email.split('@')[0] || 'Học viên HanziGo'),
            email: formData.email,
            level: formData.level,
            avatar: null,
            streak: 0,
            xp: 0,
            wordsLearned: 0
          };
          onLoginSuccess(userData);
          onClose();
        }, 500);
      }
    } catch (err) {
      playErrorSound();
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được đăng ký tài khoản.');
      } else {
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    playClickSound();
    if (isFirebaseConfigured) {
      try {
        setLoading(true);
        const userData = await loginWithGoogle();
        playSuccessSound();
        onLoginSuccess(userData);
        onClose();
      } catch (err) {
        playErrorSound();
        console.error(err);
        setError('Đăng nhập Google thất bại hoặc cửa sổ bị đóng.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Firebase chưa được cấu hình cho Google Auth.');
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
            {isFirebaseConfigured ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-white border border-emerald-300/40">
                🟢 Firebase Connected
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/30 text-white border border-amber-300/40">
                ⚡ Local Demo Mode
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
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

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
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang xử lý Firebase...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Đăng nhập ngay' : 'Hoàn tất đăng ký'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Social Options Footer */}
        <div className="px-6 pb-6 text-center">
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#F1E5D8] dark:border-[#2B3A4F]" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white dark:bg-[#1E293B] text-[#748092]">Hoặc tiếp tục với</span></div>
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#243447] dark:text-white hover:bg-[#FFF9F2] dark:hover:bg-[#131B24] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="font-bold text-[#EA4335] text-sm">G</span>
            <span>Đăng nhập nhanh với tài khoản Google</span>
          </button>
        </div>

      </div>
    </div>
  );
}
