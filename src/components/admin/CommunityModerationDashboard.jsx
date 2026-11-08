import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Flag, 
  Filter, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Trash2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MessageSquare, 
  FileText, 
  AlertTriangle,
  History,
  Check,
  Shield,
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  getCommunityReports, 
  getCommunityReportDetails, 
  moderateCommunityContent,
  REPORT_REASONS,
  REPORT_STATUSES
} from '../../services/communityService';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';

export default function CommunityModerationDashboard({ user }) {
  // Filters & Pagination State
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Data State
  const [reports, setReports] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Selected Report for Details & Action Modal
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Action State
  const [actionReason, setActionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { action, label, description }

  // Load Reports
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getCommunityReports({
        status: statusFilter,
        targetType: targetTypeFilter,
        reason: reasonFilter,
        search: searchQuery,
        page: currentPage,
        pageSize
      });
      setReports(res.reports);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch community reports:', err);
      setErrorMsg(err.message || 'Không thể tải danh sách báo cáo.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, targetTypeFilter, reasonFilter, searchQuery, currentPage, pageSize]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Load details when a report is selected
  useEffect(() => {
    if (!selectedReportId) {
      setReportDetails(null);
      return;
    }

    let isMounted = true;
    setIsLoadingDetails(true);
    setActionError(null);
    setActionSuccess(null);
    setActionReason('');

    getCommunityReportDetails(selectedReportId)
      .then(res => {
        if (isMounted) {
          setReportDetails(res);
          setIsLoadingDetails(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setActionError(err.message || 'Không thể tải chi tiết báo cáo.');
          setIsLoadingDetails(false);
        }
      });

    return () => { isMounted = false; };
  }, [selectedReportId]);

  // Handle Moderation Action
  const handleExecuteAction = async (action) => {
    if (!reportDetails?.report) return;
    setIsProcessingAction(true);
    setActionError(null);
    setActionSuccess(null);
    playClickSound();

    const report = reportDetails.report;
    const targetType = report.target_type;
    const targetId = report.target_id;

    try {
      const res = await moderateCommunityContent({
        action,
        targetType,
        targetId,
        reason: actionReason,
        reportId: report.id
      });

      if (res.success) {
        playSuccessSound();
        setActionSuccess(res.message || 'Thao tác thành công.');
        setConfirmDialog(null);
        // Refresh details
        const updated = await getCommunityReportDetails(report.id);
        setReportDetails(updated);
        // Refresh list
        fetchReports();
      }
    } catch (err) {
      playErrorSound();
      setActionError(err.message || 'Lỗi khi thực hiện thao tác kiểm duyệt.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const getReasonLabel = (reasonId) => {
    const found = REPORT_REASONS.find(r => r.id === reasonId);
    return found ? found.label : reasonId;
  };

  const getStatusBadge = (status) => {
    const config = REPORT_STATUSES.find(s => s.id === status);
    const colorClass = config?.color || 'bg-gray-100 text-gray-700';
    const label = config?.label || status;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Header & Filter Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#243447] dark:text-white flex items-center gap-2">
                Kiểm duyệt Cộng đồng & Báo cáo vi phạm
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
                  {totalCount} báo cáo
                </span>
              </h2>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Xử lý khiếu nại, ẩn nội dung độc hại và ghi nhận lịch sử kiểm duyệt bất biến
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { playClickSound(); fetchReports(); }}
            disabled={isLoading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white hover:border-[#E85D3F] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#E85D3F]' : ''} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý (Pending)</option>
              <option value="reviewing">Đang xem xét (Reviewing)</option>
              <option value="resolved">Đã giải quyết (Resolved)</option>
              <option value="dismissed">Đã bác bỏ (Dismissed)</option>
            </select>
          </div>

          {/* Target Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
              Loại đối tượng
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) => { setTargetTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            >
              <option value="all">Tất cả đối tượng</option>
              <option value="post">Bài viết (Posts)</option>
              <option value="comment">Bình luận (Comments)</option>
            </select>
          </div>

          {/* Reason Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
              Lý do vi phạm
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => { setReasonFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            >
              <option value="all">Tất cả lý do</option>
              <option value="spam">Spam / Quảng cáo</option>
              <option value="harassment">Xúc phạm / Quấy rối</option>
              <option value="misinformation">Sai lệch kiến thức</option>
              <option value="inappropriate">Nội dung không phù hợp</option>
              <option value="other">Lý do khác</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm nội dung mô tả..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#748092]" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
        {errorMsg && (
          <div className="p-4 m-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#1A2432] text-[#748092] dark:text-[#94A3B8] font-bold">
                <th className="py-3.5 px-4">Đối tượng</th>
                <th className="py-3.5 px-4">Người báo cáo</th>
                <th className="py-3.5 px-4">Lý do</th>
                <th className="py-3.5 px-4">Mô tả</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F] text-[#243447] dark:text-[#CBD5E1]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#748092]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#E85D3F]" />
                      <span>Đang tải danh sách báo cáo vi phạm...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#748092]">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 size={32} className="text-emerald-500 opacity-60" />
                      <p className="font-semibold text-sm">Không có báo cáo vi phạm nào phù hợp điều kiện lọc.</p>
                      <p className="text-xs">Cộng đồng đang hoạt động tích cực và tuân thủ chuẩn mực.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((rep) => {
                  const isPost = rep.target_type === 'post';
                  const reporterName = rep.reporter?.name || 'Học viên ẩn danh';
                  return (
                    <tr 
                      key={rep.id}
                      className="hover:bg-[#FFF9F2]/50 dark:hover:bg-[#1A2432]/50 transition-colors"
                    >
                      {/* Target Type */}
                      <td className="py-3.5 px-4 font-semibold">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                          isPost 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300' 
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300'
                        }`}>
                          {isPost ? <FileText size={12} /> : <MessageSquare size={12} />}
                          <span>{isPost ? 'Bài viết' : 'Bình luận'}</span>
                        </span>
                        <div className="text-[10px] text-[#748092] mt-0.5 truncate max-w-[120px]">
                          ID: {rep.target_id}
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#243447] dark:text-white">
                          {reporterName}
                        </div>
                        {rep.reporter?.email && (
                          <div className="text-[10px] text-[#748092] truncate max-w-[140px]">
                            {rep.reporter.email}
                          </div>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#E85D3F]">
                          {getReasonLabel(rep.reason)}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 italic text-[#748092] dark:text-[#94A3B8]">
                          {rep.details ? `"${rep.details}"` : '(Không có mô tả chi tiết)'}
                        </p>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-[#748092] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{new Date(rep.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(rep.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => { playClickSound(); setSelectedReportId(rep.id); }}
                          className="px-3 py-1.5 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#E85D3F] hover:text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#1A2432] flex items-center justify-between text-xs text-[#748092]">
            <span>Trang {currentPage} / {totalPages} (Tổng số {totalCount} báo cáo)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-[#F1E5D8] dark:border-[#2B3A4F] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* REPORT DETAILS & MODERATION ACTION MODAL */}
      {/* ============================================================== */}
      {selectedReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#1A2432] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#243447] dark:text-white flex items-center gap-2">
                    Chi tiết Báo cáo Vi phạm
                    {reportDetails?.report && getStatusBadge(reportDetails.report.status)}
                  </h3>
                  <p className="text-[11px] text-[#748092]">
                    Mã báo cáo: <code className="font-mono text-xs">{selectedReportId}</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportId(null)}
                className="p-1.5 rounded-xl text-[#748092] hover:text-[#243447] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {isLoadingDetails ? (
                <div className="py-16 text-center text-[#748092] flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin text-[#E85D3F]" />
                  <span>Đang tải thông tin chi tiết nội dung và lịch sử kiểm duyệt...</span>
                </div>
              ) : !reportDetails?.report ? (
                <div className="py-12 text-center text-[#748092]">
                  <p>Không tìm thấy báo cáo hoặc bạn không có quyền xem thông tin này.</p>
                </div>
              ) : (
                <>
                  {/* Alert Notifications */}
                  {actionSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{actionSuccess}</span>
                    </div>
                  )}

                  {actionError && (
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  {/* 1. Report Metadata Card */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2.5">
                    <h4 className="text-xs font-bold text-[#E85D3F] uppercase tracking-wider flex items-center gap-1.5">
                      <Flag size={14} />
                      <span>Thông tin Báo cáo từ Học viên</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#748092]">Người báo cáo:</span>{' '}
                        <strong className="text-[#243447] dark:text-white">
                          {reportDetails.report.reporter?.name || 'Học viên ẩn danh'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#748092]">Thời điểm gửi:</span>{' '}
                        <span className="font-medium text-[#243447] dark:text-white">
                          {new Date(reportDetails.report.created_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#748092]">Lý do vi phạm:</span>{' '}
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {getReasonLabel(reportDetails.report.reason)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#748092]">Đối tượng:</span>{' '}
                        <span className="font-bold text-[#243447] dark:text-white capitalize">
                          {reportDetails.report.target_type === 'post' ? 'Bài viết' : 'Bình luận'} (ID: {reportDetails.report.target_id})
                        </span>
                      </div>
                    </div>
                    {reportDetails.report.details && (
                      <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                        <span className="text-[11px] font-semibold text-[#748092]">Mô tả bổ sung:</span>
                        <p className="text-xs text-[#243447] dark:text-white italic mt-0.5">
                          "{reportDetails.report.details}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Target Content Snapshot Card */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#1A2432] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={14} className="text-[#E85D3F]" />
                        <span>Nội dung thực tế trên Hệ thống</span>
                      </h4>
                      {reportDetails.targetItem && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          reportDetails.targetItem.status === 'hidden'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        }`}>
                          Trạng thái: {reportDetails.targetItem.status || 'published'}
                        </span>
                      )}
                    </div>

                    {reportDetails.isTargetDeleted ? (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <Info size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Nội dung đã bị xóa hoặc không còn tồn tại.</p>
                          <p className="text-[11px] mt-0.5 opacity-90">
                            Dữ liệu snapshot mã định danh <code>{reportDetails.report.target_id}</code> vẫn được bảo toàn cho mục đích kiểm toán.
                          </p>
                        </div>
                      </div>
                    ) : reportDetails.targetItem ? (
                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-[#748092] pb-1 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                          <span>
                            Tác giả:{' '}
                            <strong className="text-[#243447] dark:text-white">
                              {reportDetails.targetItem.author_name || reportDetails.targetItem.profiles?.name || 'Học viên'}
                            </strong>
                          </span>
                          <span>{new Date(reportDetails.targetItem.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] whitespace-pre-line leading-relaxed bg-[#F8F9FA] dark:bg-[#131B24] p-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
                          {reportDetails.targetItem.content}
                        </p>
                        {reportDetails.targetItem.image_url && (
                          <div className="pt-1">
                            <img 
                              src={reportDetails.targetItem.image_url} 
                              alt="Ảnh đính kèm" 
                              className="max-h-48 rounded-xl object-contain border border-[#F1E5D8] dark:border-[#2B3A4F]"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#748092] italic">Không thể truy xuất nội dung đối tượng.</p>
                    )}
                  </div>

                  {/* 3. Moderation Actions Toolbar */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
                    <h4 className="text-xs font-bold text-[#243447] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Shield size={14} className="text-[#E85D3F]" />
                      <span>Quyết định Kiểm duyệt của Ban Quản Trị</span>
                    </h4>

                    {/* Action Note */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#748092] mb-1">
                        Ghi chú lý do kiểm duyệt (Sẽ lưu vào Audit Log bất biến):
                      </label>
                      <input
                        type="text"
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        disabled={isProcessingAction}
                        placeholder="Ví dụ: Vi phạm quy định về phát ngôn văn hóa / Quảng cáo thương mại..."
                        className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                      />
                    </div>

                    {/* Confirm Dialog Notice */}
                    {confirmDialog && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300">
                          <AlertTriangle size={15} />
                          <span>Xác nhận thực hiện: {confirmDialog.label}</span>
                        </div>
                        <p className="text-[#4A5568] dark:text-[#CBD5E1]">
                          {confirmDialog.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleExecuteAction(confirmDialog.action)}
                            disabled={isProcessingAction}
                            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isProcessingAction && <Loader2 size={12} className="animate-spin" />}
                            <span>Tôi xác nhận</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDialog(null)}
                            disabled={isProcessingAction}
                            className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#243447] font-bold text-xs cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Grid */}
                    {!confirmDialog && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                        {/* 1. Mark as Reviewing */}
                        <button
                          type="button"
                          onClick={() => handleExecuteAction('review_report')}
                          disabled={isProcessingAction || reportDetails.report.status === 'reviewing'}
                          className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Clock size={13} />
                          <span>Đang xem xét</span>
                        </button>

                        {/* 2. Hide Content */}
                        <button
                          type="button"
                          onClick={() => setConfirmDialog({
                            action: 'hide',
                            label: 'Ẩn nội dung vi phạm',
                            description: 'Nội dung này sẽ ngay lập tức bị ẩn khỏi toàn bộ Feed học viên và báo cáo sẽ chuyển sang trạng thái Đã giải quyết.'
                          })}
                          disabled={isProcessingAction || reportDetails.targetItem?.status === 'hidden'}
                          className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <EyeOff size={13} />
                          <span>Ẩn nội dung</span>
                        </button>

                        {/* 3. Restore Content */}
                        <button
                          type="button"
                          onClick={() => setConfirmDialog({
                            action: 'restore',
                            label: 'Khôi phục nội dung',
                            description: 'Nội dung này sẽ được khôi phục trạng thái Hiển thị (published) trên Feed cộng đồng.'
                          })}
                          disabled={isProcessingAction || reportDetails.targetItem?.status === 'published'}
                          className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Khôi phục</span>
                        </button>

                        {/* 4. Dismiss Report */}
                        <button
                          type="button"
                          onClick={() => handleExecuteAction('dismiss_report')}
                          disabled={isProcessingAction || reportDetails.report.status === 'dismissed'}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <XCircle size={13} />
                          <span>Bác bỏ khiếu nại</span>
                        </button>

                        {/* 5. Resolve Report */}
                        <button
                          type="button"
                          onClick={() => handleExecuteAction('resolve_report')}
                          disabled={isProcessingAction || reportDetails.report.status === 'resolved'}
                          className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Đã giải quyết</span>
                        </button>

                        {/* 6. Soft Delete */}
                        <button
                          type="button"
                          onClick={() => setConfirmDialog({
                            action: 'delete',
                            label: 'Xóa vĩnh viễn / Xóa mềm nội dung',
                            description: 'Nội dung sẽ bị đánh dấu xóa (deleted_at) và ẩn hoàn toàn. Báo cáo sẽ được chuyển sang Đã giải quyết.'
                          })}
                          disabled={isProcessingAction || reportDetails.isTargetDeleted}
                          className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Xóa nội dung</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 4. Audit Moderation Logs History */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-[#748092] uppercase tracking-wider flex items-center gap-1.5">
                      <History size={14} />
                      <span>Nhật ký Kiểm duyệt liên quan ({reportDetails.moderationLogs.length})</span>
                    </h4>

                    {reportDetails.moderationLogs.length === 0 ? (
                      <p className="text-xs text-[#748092] italic p-3 rounded-xl bg-black/5 dark:bg-white/5">
                        Chưa có thao tác kiểm duyệt nào được ghi nhận cho đối tượng này.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {reportDetails.moderationLogs.map((log) => (
                          <div 
                            key={log.id}
                            className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs flex items-start justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#243447] dark:text-white uppercase text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                                  {log.action}
                                </span>
                                <span className="font-semibold text-[#4A5568] dark:text-[#CBD5E1]">
                                  {log.admin?.name || 'Admin'}
                                </span>
                              </div>
                              {log.reason && (
                                <p className="text-[11px] text-[#748092] italic">
                                  Lý do: "{log.reason}"
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] text-[#748092] shrink-0">
                              {new Date(log.created_at).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#1A2432] flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReportId(null)}
                className="px-4 py-2 rounded-xl bg-[#243447] text-white text-xs font-bold hover:bg-[#1A2432] transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

