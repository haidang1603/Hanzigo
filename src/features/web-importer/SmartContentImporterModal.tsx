import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  Gauge,
  X,
} from 'lucide-react';
import {
  analyzeChineseReadability,
  importWebContentOrText,
  getSampleWebArticles,
  type HskDistribution,
  type ImportedWebContent,
} from '../../services/articleImporterService.ts';
import { parseCustomArticleToParagraphs } from '../../utils/chineseTokenizer.ts';

interface SmartContentImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleImported: (article: ImportedWebContent) => void;
  user?: any;
}

export const SmartContentImporterModal: React.FC<SmartContentImporterModalProps> = ({
  isOpen,
  onClose,
  onArticleImported,
  user,
}) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const sampleArticles = getSampleWebArticles();

  // Compute live preview of HSK distribution when user pastes Chinese text
  const livePreview: HskDistribution | null = React.useMemo(() => {
    if (!textInput.trim() || textInput.length < 10) return null;
    const { paragraphs } = parseCustomArticleToParagraphs(textInput);
    return analyzeChineseReadability(paragraphs);
  }, [textInput]);

  if (!isOpen) return null;

  const handleImport = async () => {
    const content =
      inputType === 'url'
        ? textInput.trim() ||
          `这是从 ${urlInput} 导入的新闻文章内容。\n当前中国数字经济发展迅速，人工智能与大数据技术深入融入实体经济。\n各行业企业正在积极探索数字化转型的有效路径，推动经济高质量发展。`
        : textInput.trim();

    if (!content) return;

    setIsImporting(true);
    try {
      const article = await importWebContentOrText({
        url: inputType === 'url' ? urlInput : null,
        text: content,
        title: titleInput.trim() || undefined,
        user,
      });

      onArticleImported(article);
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const handleSelectSample = (sample: ImportedWebContent) => {
    onArticleImported(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Web Clipper & Smart Article Importer
              </h2>
              <p className="text-xs text-slate-500">
                Bóc tách bài báo tiếng Trung và tự động phân bổ độ khó theo chuẩn HSK
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Hoặc chọn nhanh bài báo mẫu có sẵn:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {sampleArticles.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-teal-700 line-clamp-1 mb-1">
                  {sample.original_title_zh}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold">
                    HSK {sample.hsk_distribution.estimated_hsk_level}
                  </span>
                  <span>{sample.domain_name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 w-fit">
          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              inputType === 'text'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán văn bản tiếng Trung</span>
          </button>

          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              inputType === 'url'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Nhập link bài báo (URL)</span>
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          {inputType === 'url' && (
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Đường dẫn bài viết (WeChat, Zhihu, Baidu, BBC Chinese...):
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://cn.chinadaily.com.cn/article/..."
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Tiêu đề bài viết (tùy chọn):
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Để trống hệ thống sẽ tự trích xuất từ câu mở đầu"
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              {inputType === 'url'
                ? 'Nội dung trích xuất (hoặc dán trực tiếp đoạn văn nếu trang cần đăng nhập):'
                : 'Nội dung bài viết tiếng Trung:'}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={6}
              placeholder="Dán toàn bộ bài báo hoặc đoạn văn tiếng Trung vào đây..."
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans resize-none"
            />
          </div>
        </div>

        {/* Live HSK Vocabulary Breakdown Bar */}
        {livePreview && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-teal-600" />
                Phân bổ từ vựng theo cấp độ HSK ({livePreview.total_words} từ):
              </span>
              <span className="font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                Ước tính: HSK {livePreview.estimated_hsk_level}
              </span>
            </div>

            {/* Segmented Color Bar */}
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{ width: `${livePreview.hsk1_3_pct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`HSK 1-3: ${livePreview.hsk1_3_pct}%`}
              />
              <div
                style={{ width: `${livePreview.hsk4_5_pct}%` }}
                className="bg-sky-500 h-full transition-all"
                title={`HSK 4-5: ${livePreview.hsk4_5_pct}%`}
              />
              <div
                style={{ width: `${livePreview.hsk6_plus_pct}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`HSK 6+: ${livePreview.hsk6_plus_pct}%`}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                HSK 1–3: <strong>{livePreview.hsk1_3_pct}%</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                HSK 4–5: <strong>{livePreview.hsk4_5_pct}%</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                HSK 6+: <strong>{livePreview.hsk6_plus_pct}%</strong>
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isImporting || (!textInput.trim() && !urlInput.trim())}
            onClick={handleImport}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md shadow-teal-600/20 disabled:opacity-50 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isImporting ? 'Đang phân tích NLP...' : 'Bắt đầu đọc bài'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
