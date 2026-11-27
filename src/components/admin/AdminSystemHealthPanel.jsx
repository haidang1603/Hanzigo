import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import AiMonitoringDashboard from './AiMonitoringDashboard';
import {
  formatVietnamDateTime,
  groupClientErrorLogs,
  redactPiiText,
} from './adminHelpers';

const DEFAULT_SAFE_SERVICES = [
  {
    id: 'ai_tutor',
    label: 'Dịch vụ AI Gia sư & Coach',
    status: 'active',
    detail: 'Đang hoạt động qua cổng kiểm soát tập trung trên máy chủ',
  },
  {
    id: 'audio_cdn',
    label: 'Audio CDN Azure Neural TTS',
    status: 'ready',
    detail: 'Sẵn sàng · Phát âm CDN kết hợp Web Speech dự phòng',
  },
  {
    id: 'database',
    label: 'Cơ sở dữ liệu & Realtime',
    status: 'online',
    detail: 'Kết nối Supabase PostgreSQL & phân quyền RLS',
  },
  {
    id: 'rate_limiter',
    label: 'Giới hạn tốc độ & Chống lạm dụng',
    status: 'active',
    detail: 'Bảo vệ ngưỡng gọi API theo vai trò và tuyến chức năng',
  },
];

export default function AdminSystemHealthPanel({
  adminTab,
  serviceHealth = [],
  clientErrorLogs = [],
  isLoadingErrorLogs = false,
  loadClientErrorLogs,
  handleExportData,
  handlePurgeAllMockData,
}) {
  const [logViewMode, setLogViewMode] = useState('grouped');
  const [logFilter, setLogFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const servicesList =
    Array.isArray(serviceHealth) && serviceHealth.length > 0
      ? serviceHealth
      : DEFAULT_SAFE_SERVICES;

  const groupedLogs = useMemo(
    () => groupClientErrorLogs(clientErrorLogs),
    [clientErrorLogs]
  );

  const filterTerm = logFilter.toLowerCase().trim();

  const filteredGrouped = useMemo(() => {
    if (!filterTerm) return groupedLogs;
    return groupedLogs.filter(
      (g) =>
        g.route.toLowerCase().includes(filterTerm) ||
        g.fingerprint.toLowerCase().includes(filterTerm) ||
        g.errorName.toLowerCase().includes(filterTerm) ||
        g.message.toLowerCase().includes(filterTerm)
    );
  }, [groupedLogs, filterTerm]);

  const filteredRawLogs = useMemo(() => {
    if (!filterTerm) return clientErrorLogs;
    return clientErrorLogs.filter(
      (log) =>
        String(log.route || '').toLowerCase().includes(filterTerm) ||
        String(log.fingerprint || '').toLowerCase().includes(filterTerm) ||
        String(log.error_name || '').toLowerCase().includes(filterTerm) ||
        String(log.error_message || '').toLowerCase().includes(filterTerm)
    );
  }, [clientErrorLogs, filterTerm]);

  const handleCopyErrorSummary = (key, text) => {
    try {
      navigator.clipboard?.writeText(redactPiiText(text));
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <>
      {/* TAB: AI, AUDIO CDN, SERVICE HEALTH & CLIENT ERROR LOGS */}
      {adminTab === 'ai_metrics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Zero-Env-Leak Service Status Grid */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="text-base font-black text-[#243447] dark:text-white">
                  Trạng thái dịch vụ hệ thống (An toàn cấu hình)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
                Không lộ khóa bí mật
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {servicesList.map((svc) => {
                const isHealthy = ['active', 'ready', 'online'].includes(svc.status);
                return (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#243447] dark:text-white break-words">
                        {svc.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isHealthy
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {svc.status === 'maintenance'
                          ? 'Bảo trì'
                          : isHealthy
                            ? 'Sẵn sàng'
                            : 'Dự phòng'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#748092] dark:text-[#94A3B8] break-words">
                      {svc.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <AiMonitoringDashboard />

          {/* Client Error Logs Observability Viewer */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[#E85D3F]" />
                <h3 className="text-base font-black text-[#243447] dark:text-white">
                  Nhật ký lỗi Production (client_error_logs)
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogViewMode('grouped')}
                  className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    logViewMode === 'grouped'
                      ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  Gom theo Fingerprint ({filteredGrouped.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLogViewMode('raw')}
                  className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    logViewMode === 'raw'
                      ? 'bg-[#243447] text-white dark:bg-white dark:text-[#131B24]'
                      : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] border border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  Danh sách gần nhất ({filteredRawLogs.length})
                </button>
                <button
                  type="button"
                  onClick={loadClientErrorLogs}
                  disabled={isLoadingErrorLogs}
                  className="min-h-11 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131B24] dark:hover:bg-gray-800 text-[#748092] dark:text-[#94A3B8] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isLoadingErrorLogs ? 'animate-spin' : ''} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input
                type="text"
                aria-label="Lọc log lỗi theo route hoặc fingerprint"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder="Lọc theo tuyến route (#hsk, #materials) hoặc fingerprint..."
                className="w-full min-h-11 pl-10 pr-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            {clientErrorLogs.length === 0 || (logViewMode === 'grouped' ? filteredGrouped.length === 0 : filteredRawLogs.length === 0) ? (
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] py-4">
                Chưa ghi nhận lỗi runtime nào khớp với bộ lọc hiện tại (0 sự cố).
              </p>
            ) : logViewMode === 'grouped' ? (
              <div className="space-y-2.5">
                {filteredGrouped.map((grp) => {
                  const summaryStr = `[${grp.errorName}] (${grp.count}x) @ ${grp.route}\nFP: ${grp.fingerprint}\nMsg: ${grp.message}\nStack: ${grp.stackShort}`;
                  return (
                    <div
                      key={grp.fingerprint}
                      className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-black text-[10px]">
                            {grp.count} lần
                          </span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            {grp.errorName}
                          </span>
                          <code className="font-mono text-[#243447] dark:text-white">
                            {grp.route}
                          </code>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
                            {formatVietnamDateTime(grp.lastSeenAt)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyErrorSummary(grp.fingerprint, summaryStr)}
                            className="min-h-11 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === grp.fingerprint ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            <span>{copiedId === grp.fingerprint ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-[#243447] dark:text-[#E2E8F0] break-words">
                        {grp.message}
                      </p>
                      {grp.stackShort && (
                        <p className="text-[11px] font-mono text-[#748092] dark:text-[#94A3B8] break-words">
                          {grp.stackShort}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] font-bold">
                      <th className="p-3">Thời gian (VN)</th>
                      <th className="p-3">Tuyến trang</th>
                      <th className="p-3">Loại lỗi</th>
                      <th className="p-3">Thông điệp (đã lọc PII)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
                    {filteredRawLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FFFDF9] dark:hover:bg-white/5">
                        <td className="p-3 whitespace-nowrap text-[#748092] dark:text-[#94A3B8]">
                          {formatVietnamDateTime(log.created_at)}
                        </td>
                        <td className="p-3 font-mono text-[#243447] dark:text-white">{log.route}</td>
                        <td className="p-3 font-bold text-rose-500">{log.error_name}</td>
                        <td className="p-3 text-[#243447] dark:text-[#CBD5E1] break-words">
                          {redactPiiText(log.error_message)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BACKUP & SYSTEM PURGE */}
      {adminTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Download size={24} />
              </div>
              <h3 className="text-lg font-black text-[#243447] dark:text-white">
                Xuất Toàn Bộ Dữ Liệu Hệ Thống
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Tải về toàn bộ danh sách người dùng, kho tài liệu, từ vựng và bài học dưới dạng file JSON chuẩn hóa để lưu trữ hoặc di chuyển máy chủ.
              </p>
              <button
                type="button"
                onClick={handleExportData}
                className="min-h-11 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>Tải file backup JSON</span>
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-950/60 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black text-[#243447] dark:text-white">
                Dọn Dẹp Dữ Liệu Thử Nghiệm (Purge)
              </h3>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8] leading-relaxed">
                Xóa sạch các số liệu rác, lịch sử thi thử HSK và tin nhắn chat test trên trình duyệt để đưa hệ thống về trạng thái sạch sẽ.
              </p>
              <button
                type="button"
                onClick={handlePurgeAllMockData}
                className="min-h-11 px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Xóa dữ liệu rác trên thiết bị</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
