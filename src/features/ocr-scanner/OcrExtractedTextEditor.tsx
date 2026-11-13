import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  convertOcrToInteractiveArticle,
  exportOcrTokensToDeck,
  type OcrScanDocument,
  type OcrBlock,
} from '../../services/ocrScannerService.ts';

interface OcrExtractedTextEditorProps {
  document: OcrScanDocument;
  user: any;
  selectedBlockId: string | null;
  onSelectBlock: (block: OcrBlock | null) => void;
  onOpenReadingStudio?: (articleId: string) => void;
  onDeckCreated?: (deckName: string, count: number) => void;
}

export const OcrExtractedTextEditor: React.FC<OcrExtractedTextEditorProps> = ({
  document: doc,
  user,
  selectedBlockId,
  onSelectBlock,
  onOpenReadingStudio,
  onDeckCreated,
}) => {
  const [isEditingFullText, setIsEditingFullText] = useState(false);
  const [editedText, setEditedText] = useState(doc.extracted_full_text);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isExportingDeck, setIsExportingDeck] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleConvertToReading = async () => {
    setIsConverting(true);
    try {
      const article = await convertOcrToInteractiveArticle(
        {
          ...doc,
          extracted_full_text: editedText,
        },
        user
      );
      if (onOpenReadingStudio) {
        onOpenReadingStudio(article.id);
      }
    } finally {
      setIsConverting(false);
    }
  };

  const handleExportDeck = async () => {
    setIsExportingDeck(true);
    try {
      const result = await exportOcrTokensToDeck(doc, `OCR: ${doc.title.slice(0, 24)}`, user);
      setExportSuccessMsg(`Đã tạo bộ từ "${result.deck.name}" với ${result.tokenCount} từ mới!`);
      if (onDeckCreated) {
        onDeckCreated(result.deck.name, result.tokenCount);
      }
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } finally {
      setIsExportingDeck(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-5 flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Văn bản trích xuất ({doc.ocr_blocks.length} dòng)
          </h3>
          <p className="text-xs text-slate-500">
            Có thể chỉnh sửa nếu ảnh bị mờ hoặc xuất trực tiếp sang hệ sinh thái học
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingFullText((v) => !v)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            {isEditingFullText ? 'Xem từng dòng' : 'Sửa toàn văn'}
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[480px] space-y-2.5 pr-1">
        {isEditingFullText ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={12}
              className="w-full text-sm leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
              placeholder="Nhập hoặc chỉnh sửa văn bản tiếng Trung tại đây..."
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{editedText.length} ký tự</span>
              <button
                type="button"
                onClick={() => setEditedText(doc.extracted_full_text)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                Khôi phục bản gốc OCR
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {doc.ocr_blocks.map((block, idx) => {
              const isSelected = block.block_id === selectedBlockId;
              return (
                <div
                  key={block.block_id}
                  onClick={() => onSelectBlock(block)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/80 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      Dòng #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakChinese(block.text_zh, 0.85);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {block.text_zh}
                  </p>

                  <p className="text-xs text-emerald-700 font-medium">
                    {block.pinyin}
                  </p>

                  <p className="text-xs text-slate-500 italic">
                    {block.translation_vi}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {exportSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* Action Deck: 1-Click to Reading Studio & Flashcard Deck */}
      <div className="border-t border-slate-100 pt-4 space-y-2">
        <button
          type="button"
          disabled={isConverting}
          onClick={handleConvertToReading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs sm:text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {isConverting
              ? 'Đang chuyển đổi cấu trúc phân đoạn...'
              : 'Chuyển thành bài đọc Reading Studio'}
          </span>
        </button>

        <button
          type="button"
          disabled={isExportingDeck}
          onClick={handleExportDeck}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 text-xs sm:text-sm disabled:opacity-50 transition cursor-pointer"
        >
          <Layers className="w-4 h-4 text-amber-500" />
          <span>
            {isExportingDeck
              ? 'Đang tạo bộ từ vựng...'
              : 'Xuất từ vựng vào Flashcard Deck'}
          </span>
        </button>
      </div>
    </div>
  );
};
