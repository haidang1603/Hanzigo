import React from 'react';
import {
  AlertTriangle,
  Download,
  Home,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { clearStorageByCategory } from '../../core/sync/OfflineSyncManager.js';
import { reportClientError, sanitizeSensitiveText } from '../../core/telemetry/errorReporter.js';

const EXAM_DRAFT_PREFIX = 'hsk_exam_draft_';
const SYNC_QUEUE_KEY = 'hanzigo_sync_queue_v1';

/**
 * Inspect localStorage for any in-progress HSK CBT exam drafts or offline sync queue items.
 * Safe against storage access errors.
 */
export function collectExamRescueSnapshot(customStorage) {
  let storage = customStorage;
  if (!storage) {
    try {
      storage = typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      storage = null;
    }
  }

  if (!storage) {
    return { hasRescueData: false, drafts: [], syncQueue: [], totalItems: 0 };
  }

  const drafts = [];
  let syncQueue = [];

  try {
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (!key) continue;

      if (key.startsWith(EXAM_DRAFT_PREFIX)) {
        const raw = storage.getItem(key);
        if (raw) {
          let parsed = raw;
          try {
            parsed = JSON.parse(raw);
          } catch {
            // Keep raw string if not JSON
          }
          drafts.push({ key, data: parsed });
        }
      } else if (key === SYNC_QUEUE_KEY) {
        const rawQueue = storage.getItem(key);
        if (rawQueue) {
          try {
            const parsedQueue = JSON.parse(rawQueue);
            if (Array.isArray(parsedQueue)) {
              syncQueue = parsedQueue;
            }
          } catch {
            syncQueue = [];
          }
        }
      }
    }
  } catch {
    return { hasRescueData: false, drafts: [], syncQueue: [], totalItems: 0 };
  }

  const totalItems = drafts.length + syncQueue.length;
  return {
    hasRescueData: totalItems > 0,
    drafts,
    syncQueue,
    totalItems,
  };
}

export function buildRescueDownloadPayload(snapshot) {
  return {
    app: 'HanziGo',
    exported_at: new Date().toISOString(),
    notice: 'Ban sao cuu ho bai lam HSK & hang doi dong bo tu vung cuc bo',
    drafts_count: snapshot.drafts.length,
    sync_queue_count: snapshot.syncQueue.length,
    drafts: snapshot.drafts,
    sync_queue: snapshot.syncQueue,
  };
}

export function triggerRescueJsonDownload(snapshot) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const payload = buildRescueDownloadPayload(snapshot);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.href = url;
  link.download = `hanzigo-exam-rescue-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      rescueSnapshot: { hasRescueData: false, drafts: [], syncQueue: [], totalItems: 0 },
      downloadFeedback: '',
      cacheFeedback: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      rescueSnapshot: collectExamRescueSnapshot(),
    };
  }

  componentDidCatch(error, errorInfo) {
    const rescueSnapshot = collectExamRescueSnapshot();
    this.setState({ errorInfo, rescueSnapshot });

    void reportClientError(error, {
      context: {
        componentStack: errorInfo?.componentStack || '',
        boundaryScope: this.props.scope || 'route',
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        downloadFeedback: '',
        cacheFeedback: '',
      });
    }
  }

  handleRetryArea = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      downloadFeedback: '',
      cacheFeedback: '',
    });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  handleClearFunctionalCacheAndReload = () => {
    const result = clearStorageByCategory('functional');
    this.setState({
      cacheFeedback: `Đã dọn ${result?.removedCount || 0} khóa bộ nhớ đệm giao diện (giữ nguyên phiên đăng nhập & dữ liệu học tập). Đang tải lại...`,
    });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      downloadFeedback: '',
      cacheFeedback: '',
    });
    if (typeof this.props.onGoHome === 'function') {
      this.props.onGoHome();
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  handleDownloadRescue = () => {
    const latestSnapshot = collectExamRescueSnapshot();
    this.setState({ rescueSnapshot: latestSnapshot });
    const ok = triggerRescueJsonDownload(latestSnapshot);
    if (ok) {
      this.setState({
        downloadFeedback: 'Đã tải xuống bản sao bài làm (.JSON) thành công.',
      });
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { scope = 'route' } = this.props;
    const { error, rescueSnapshot, downloadFeedback, cacheFeedback } = this.state;
    const sanitizedMessage = sanitizeSensitiveText(
      error?.message || 'Đã xảy ra sự cố không mong muốn trong khu vực hiển thị.'
    );
    const containerMinHeight = scope === 'app' ? 'min-h-screen' : 'min-h-[75vh]';

    return (
      <div
        role="alert"
        className={`${containerMinHeight} w-full bg-[#0a0a1f] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden`}
      >
        {/* Subtle Dark Cyber Grid & Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.14), transparent 45%)',
          }}
        />

        <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#00D4FF]/30 bg-[#0f1029]/95 shadow-[0_0_50px_rgba(0,212,255,0.12)] p-6 sm:p-8 backdrop-blur-xl">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30">
              <Sparkles className="w-3.5 h-3.5" />
              HanziGo SRE Recovery Shield
            </span>
            <span className="text-xs font-mono text-slate-400">
              Phạm vi: {scope === 'app' ? 'Toàn ứng dụng' : 'Khu vực nội dung'}
            </span>
          </div>

          {/* Main Error Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/15 border border-[#00D4FF]/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#00D4FF]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Khu vực này vừa gặp sự cố kỹ thuật
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                Hệ thống tự động cách ly lỗi để bảo vệ phiên học và dữ liệu của bạn. Bạn có thể
                thử tải lại khu vực này hoặc chuyển sang trang khác ở thanh điều hướng.
              </p>
            </div>
          </div>

          {/* Sanitized Error Summary */}
          <div className="mb-6 rounded-xl bg-[#070716] border border-slate-800 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Thông tin chẩn đoán (đã lọc dữ liệu nhạy cảm)
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#00D4FF] break-words">
              {sanitizedMessage}
            </p>
          </div>

          {/* Exam Draft Rescue Banner */}
          {rescueSnapshot.hasRescueData && (
            <div className="mb-6 rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-emerald-300">
                    Chế độ Cứu hộ Bài thi HSK (Exam Draft Rescue)
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Tiến độ bài làm và từ vựng của bạn đã được lưu an toàn trên thiết bị (
                    {rescueSnapshot.drafts.length} bản nháp bài thi, {rescueSnapshot.syncQueue.length}{' '}
                    mục chờ đồng bộ).
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={this.handleDownloadRescue}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-400 text-[#071510] hover:bg-emerald-300 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống bản sao bài làm (.JSON)
                    </button>
                    {downloadFeedback && (
                      <span className="text-xs text-emerald-300 font-medium">
                        {downloadFeedback}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3 Primary Recovery Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={this.handleRetryArea}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#00D4FF] text-[#050814] hover:bg-[#38e0ff] transition-colors cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.28)]"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Thử tải lại khu vực này</span>
            </button>

            <button
              type="button"
              onClick={this.handleClearFunctionalCacheAndReload}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800/90 text-slate-100 border border-[#00D4FF]/30 hover:border-[#00D4FF] hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 shrink-0 text-[#00D4FF]" />
              <span>Xóa bộ nhớ đệm giao diện &amp; Tải lại</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-transparent text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Về Trang chủ</span>
            </button>
          </div>

          {cacheFeedback && (
            <p className="mt-3 text-xs text-[#00D4FF] font-medium">{cacheFeedback}</p>
          )}
        </div>
      </div>
    );
  }
}

export default GlobalErrorBoundary;

