import React, { useState } from 'react';
import { CheckCircle2, Database, Sparkles, Volume2 } from 'lucide-react';
import {
  bulkImportHskPapers,
  generateBulkSampleHsk1To6Papers,
  type BulkImportSummary,
} from './hskBulkImporterService.ts';
import type { HskPaperImportPayload } from '../../../services/hskExamImportService.ts';

export const HskBulkImporterPanel: React.FC = () => {
  const [bulkJson, setBulkJson] = useState<string>(() =>
    JSON.stringify(generateBulkSampleHsk1To6Papers(), null, 2)
  );
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<BulkImportSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBulkImport = async () => {
    setErrorMsg(null);
    setSummary(null);
    try {
      const parsed = JSON.parse(bulkJson);
      const list: HskPaperImportPayload[] = Array.isArray(parsed) ? parsed : [parsed];
      setImporting(true);
      const res = await bulkImportHskPapers(list);
      setSummary(res);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi phân tích JSON hàng loạt.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            Nạp hàng loạt Đề thi HSK & Sinh Audio TTS đa giọng Bắc Kinh
          </h4>
          <p className="text-xs text-slate-500">
            Hỗ trợ mảng JSON nhiều đề thi; câu Nghe chưa có MP3 sẽ tự động gắn cấu hình TTS Nam/Nữ chuẩn Bắc Kinh.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setBulkJson(JSON.stringify(generateBulkSampleHsk1To6Papers(), null, 2));
            setSummary(null);
            setErrorMsg(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Sinh bộ 6 đề mẫu (HSK 1–6)
        </button>
      </div>

      <textarea
        value={bulkJson}
        onChange={(e) => setBulkJson(e.target.value)}
        rows={10}
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 font-mono text-xs text-slate-800 dark:text-slate-100"
        placeholder="Dán mảng JSON [HskPaperImportPayload, ...]..."
      />

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <Volume2 className="w-4 h-4 text-sky-600" />
          Tự động gán giọng zh-CN-XiaoxiaoNeural / zh-CN-YunxiNeural khi thiếu MP3
        </span>

        <button
          type="button"
          disabled={importing || !bulkJson.trim()}
          onClick={() => void handleBulkImport()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
        >
          <Database className="w-4 h-4" />
          {importing ? 'Đang nạp hàng loạt...' : 'Chạy Bulk Import + Enrich TTS'}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
          {errorMsg}
        </div>
      )}

      {summary && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-extrabold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Hoàn tất Bulk Import: {summary.succeeded}/{summary.totalPapers} đề thành công (Lỗi: {summary.failed})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.results.map((r) => (
              <div
                key={r.paper_code}
                className={`rounded-xl border p-2.5 ${
                  r.success
                    ? 'border-emerald-200 bg-white text-slate-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <div className="font-bold">
                  {r.paper_code} · {r.success ? 'Thành công' : 'Thất bại'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {r.success
                    ? `${r.insertedGroupsCount} nhóm câu hỏi · ${r.ttsEnrichedCount} câu được gắn TTS Bắc Kinh`
                    : r.error}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

