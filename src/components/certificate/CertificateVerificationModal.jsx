import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, X, Award, CheckCircle2 } from 'lucide-react';
import { verifyCertificate } from '../../utils/certificateEngine.js';

/**
 * =========================================================================
 * CERTIFICATE VERIFICATION MODAL
 * =========================================================================
 * Tra cứu và xác minh tính hợp lệ của mã Chứng nhận HSK công khai.
 * Giúp nhà tuyển dụng, giáo viên kiểm tra chứng nhận thật/giả tức thì.
 * =========================================================================
 */
export default function CertificateVerificationModal({
  isOpen,
  onClose,
  initialCode = ''
}) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await verifyCertificate(code.trim());
    setResult(res);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                Tra Cứu Xác Thực Chứng Nhận HSK
              </h3>
              <p className="text-xs text-slate-500">Hệ thống thẩm định văn bằng số hóa HanziGo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Nhập mã chứng nhận (Ví dụ: HZG-HSK1-20261025-8F9A2C1B)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="HZG-HSK..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E85D3F]"
              />
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="px-5 py-2.5 bg-[#E85D3F] hover:bg-[#D44D30] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                {loading ? 'Đang tra cứu...' : 'Xác Minh'}
              </button>
            </div>
          </form>

          {/* Result Display */}
          {result && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              {result.isValid ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>CHỨNG NHẬN HỢP LỆ VÀ ĐÃ XÁC THỰC</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Học viên được cấp:</span>
                      <strong className="font-bold text-slate-900 dark:text-slate-100">{result.certificate.displayName || result.certificate.userName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cấp độ HSK hoàn thành:</span>
                      <strong className="font-bold text-[#E85D3F]">{result.certificate.hskLevel}</strong>
                    </div>
                    {result.certificate.examPercentage !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kết quả thi thử tốt nghiệp:</span>
                        <strong className="font-bold text-emerald-600">{result.certificate.examPercentage}%</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày cấp phát:</span>
                      <span>{result.certificate.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã định danh:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{result.certificate.certificateCode}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-slate-500 italic">
                    * Lưu ý: Chứng nhận hoàn thành chương trình đào tạo nội bộ HanziGo, không thay thế chứng chỉ HSK quốc tế do CTI / Hanban cấp.
                  </div>
                </div>
              ) : result.status === 'revoked' ? (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>CHỨNG NHẬN ĐÃ BỊ THU HỒI</span>
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    {result.message}
                  </p>
                  {result.certificate && (
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-amber-200 dark:border-amber-800/40">
                      <div className="flex justify-between">
                        <span>Mã chứng nhận:</span>
                        <span className="font-mono font-bold">{result.certificate.certificateCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Học viên ban đầu:</span>
                        <span>{result.certificate.displayName}</span>
                      </div>
                      {result.certificate.revocationReason && (
                        <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                          <span>Lý do thu hồi:</span>
                          <span>{result.certificate.revocationReason}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>XÁC THỰC THẤT BẠI</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
