import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';
import { isSupabaseConfigured, supabase } from '../supabase/config';
import { updateNewPassword } from '../services/authService';

/**
 * Calculate password strength score: 0 to 4
 */
function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Chưa nhập', color: 'bg-gray-200 text-gray-500' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password) || (/[A-Z]/.test(password) && /[a-z]/.test(password))) score += 1;

  if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-rose-500 text-rose-600', percent: '25%' };
  if (score === 2) return { score: 2, label: 'Trung bình', color: 'bg-amber-500 text-amber-600', percent: '50%' };
  if (score === 3) return { score: 3, label: 'Khá mạnh', color: 'bg-blue-500 text-blue-600', percent: '75%' };
  return { score: 4, label: 'Rất an toàn', color: 'bg-emerald-500 text-emerald-600', percent: '100%' };
}

export default function ResetPasswordPage({ onNavigateHome, onOpenLogin }) {
  // Session verification state: 'verifying' | 'ready' | 'expired_or_invalid' | 'success'
  const [sessionState, setSessionState] = useState('verifying');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => calculatePasswordStrength(newPassword), [newPassword]);

  // Verify recovery session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkRecoverySession() {
      // 1. Simulation mode if Supabase not configured
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setSessionState('ready');
        return;
      }

      // 2. Check if URL contains error or expired tokens
      const hash = typeof window !== 'undefined' ? (window.location.hash || '') : '';
      const search = typeof window !== 'undefined' ? (window.location.search || '') : '';

      if (hash.includes('error=') || hash.includes('error_code=') || search.includes('error=')) {
        if (isMounted) setSessionState('expired_or_invalid');
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (isMounted) setSessionState('expired_or_invalid');
          return;
        }

        if (session?.user) {
          if (isMounted) setSessionState('ready');
        } else {
          // If detectSessionInUrl is still processing URL hash, retry once after a short delay
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession?.user) {
                setSessionState('ready');
              } else {
                setSessionState('expired_or_invalid');
              }
            } catch {
              setSessionState('expired_or_invalid');
            }
          }, 800);
        }
      } catch {
        if (isMounted) setSessionState('expired_or_invalid');
      }
    }

    checkRecoverySession();

    // Listen for PASSWORD_RECOVERY auth event
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (['PASSWORD_RECOVERY', 'SIGNED_IN'].includes(event) && session?.user) {
          if (isMounted) setSessionState('ready');
        }
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      playErrorSound();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp với mật khẩu mới.');
      playErrorSound();
      return;
    }

    setIsSubmitting(true);
    playClickSound();

    try {
      await updateNewPassword(newPassword);

      playSuccessSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      // Clear password inputs from memory
      setNewPassword('');
      setConfirmPassword('');
      setSessionState('success');

      // Sign out from temporary recovery session so user can log in with their fresh credentials
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch (err) {
      playErrorSound();
      setErrorMessage(err.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-[#F3F4F6] transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#E85D3F] to-[#CB4529] p-6 text-white text-center relative">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 shadow-inner">
            <KeyRound size={24} />
          </div>
          <h2 className="text-xl font-bold">Đặt lại mật khẩu HanziGo</h2>
          <p className="text-xs text-white/80 mt-1">
            Thiết lập mật khẩu mới an toàn cho tài khoản học tiếng Trung của bạn
          </p>
        </div>

        {/* Content Body based on sessionState */}
        <div className="p-6">
          {sessionState === 'verifying' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-3 border-[#E85D3F] border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-[#748092] dark:text-gray-300">
                Đang xác thực liên kết khôi phục bảo mật...
              </p>
            </div>
          )}

          {sessionState === 'expired_or_invalid' && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-500 shadow-sm">
                <AlertCircle size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Liên kết không hợp lệ hoặc đã hết hạn
                </h3>
                <p className="text-xs text-[#748092] dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Liên kết khôi phục mật khẩu không còn hợp lệ hoặc đã hết hạn. Vui lòng quay lại trang đăng nhập để yêu cầu liên kết mới.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Yêu cầu liên kết mới</span>
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] dark:text-gray-300 hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          )}

          {sessionState === 'success' && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-500 shadow-sm animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={30} />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  Đổi mật khẩu thành công!
                </h3>
                <p className="text-xs text-[#748092] dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Mật khẩu tài khoản HanziGo của bạn đã được cập nhật thành công. Bạn có thể sử dụng mật khẩu mới này để đăng nhập ngay bây giờ.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onOpenLogin) {
                      onOpenLogin();
                    } else if (onNavigateHome) {
                      onNavigateHome();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Đăng nhập ngay</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {sessionState === 'ready' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-[#748092]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#748092]">Độ mạnh mật khẩu:</span>
                      <span className={`font-bold ${strength.color.split(' ')[1]}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]}`}
                        style={{ width: strength.percent }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                  Nhập lại mật khẩu mới *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-[#748092]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập lại chính xác mật khẩu trên"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-[11px] text-[#748092] dark:text-gray-300 space-y-1 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#243447] dark:text-white">
                  <ShieldCheck size={14} className="text-[#E85D3F]" />
                  <span>Gợi ý bảo mật:</span>
                </div>
                <p>Nên sử dụng kết hợp cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt để tài khoản được bảo vệ tốt nhất.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <span>Cập nhật mật khẩu mới</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onNavigateHome) onNavigateHome();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-[#748092] hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer text-center"
                >
                  Hủy và về trang chủ
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
