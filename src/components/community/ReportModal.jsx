import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { REPORT_REASONS, submitCommunityReport } from '../../services/communityService';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';

export default function ReportModal({
  isOpen,
  onClose,
  targetType, // 'post' | 'comment'
  targetId,
  targetContent = '',
  targetAuthor = '',
  user
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    playClickSound();
    setSelectedReason('');
    setDetails('');
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!user) {
      playErrorSound();
      setErrorMsg('Vui lòng đăng nhập tài khoản HanziGo để gửi báo cáo.');
      return;
    }

    if (!selectedReason) {
      playErrorSound();
      setErrorMsg('Vui lòng chọn một lý do vi phạm.');
      return;
    }

    if (details.length > 500) {
      playErrorSound();
      setErrorMsg('Mô tả bổ sung không được vượt quá 500 ký tự.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    playClickSound();

    try {
      const result = await submitCommunityReport({
        targetType,
        targetId,
        reason: selectedReason,
        details
      });

      if (result.success) {
        playSuccessSound();
        setSuccessMsg(result.message || 'Báo cáo của bạn đã được gửi thành công.');
        setTimeout(() => {
          handleClose();
        }, 1800);
      } else {
        playErrorSound();
        setErrorMsg(result.message || 'Không thể gửi báo cáo. Vui lòng thử lại sau.');
      }
    } catch (err) {
      playErrorSound();
      setErrorMsg(err.message || 'Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetLabel = targetType === 'comment' ? 'bình luận' : 'bài viết';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#1A2432]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <Flag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#243447] dark:text-white">
                Báo cáo {targetLabel} vi phạm
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Đóng góp xây dựng cộng đồng Hán ngữ văn minh, tích cực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-[#748092] hover:text-[#243447] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Content Preview */}
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#748092] dark:text-[#94A3B8]">
              <span className="font-semibold">Nội dung {targetLabel} bị báo cáo:</span>
              {targetAuthor && <span>Tác giả: <strong className="text-[#243447] dark:text-white">{targetAuthor}</strong></span>}
            </div>
            <p className="text-xs text-[#4A5568] dark:text-[#CBD5E1] line-clamp-2 italic">
              "{targetContent || `Mã đối tượng: ${targetId}`}"
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-800 dark:text-red-300 leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#243447] dark:text-white">
              Lý do bạn báo cáo {targetLabel} này? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => {
                const isChecked = selectedReason === r.id;
                return (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-[#E85D3F] bg-[#FFF5F2] dark:bg-[#2D1E1B] text-[#243447] dark:text-white shadow-xs'
                        : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] hover:border-[#E85D3F]/40 text-[#4A5568] dark:text-[#CBD5E1]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={r.id}
                      checked={isChecked}
                      onChange={() => setSelectedReason(r.id)}
                      disabled={isSubmitting || Boolean(successMsg)}
                      className="mt-0.5 text-[#E85D3F] focus:ring-[#E85D3F]"
                    />
                    <span className="text-xs font-medium leading-relaxed">
                      {r.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#243447] dark:text-white">
                Mô tả chi tiết bổ sung (tùy chọn)
              </label>
              <span className={`text-[10px] ${details.length > 500 ? 'text-red-500 font-bold' : 'text-[#748092]'}`}>
                {details.length}/500
              </span>
            </div>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isSubmitting || Boolean(successMsg)}
              maxLength={500}
              placeholder="Cung cấp thêm thông tin vi phạm để Ban Quản Trị xử lý chính xác hơn..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!selectedReason || isSubmitting || Boolean(successMsg)}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={14} />
                  <span>Gửi báo cáo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

