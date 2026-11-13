import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  PenTool,
  Check,
  BookmarkPlus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { speakChinese } from '../../utils/audio.js';
import {
  generateSampleSvgDataUrl,
  COMMON_FALLBACK_PINYIN,
  type OcrScanDocument,
  type OcrBlock,
  type OcrToken,
} from '../../services/ocrScannerService.ts';

interface InteractiveBoundingBoxCanvasProps {
  document: OcrScanDocument;
  selectedBlockId: string | null;
  onSelectBlock: (block: OcrBlock | null) => void;
  onOpenWriting?: (hanzi: string) => void;
  onOpenDictionary?: (term: string) => void;
}

export const InteractiveBoundingBoxCanvas: React.FC<InteractiveBoundingBoxCanvasProps> = ({
  document: doc,
  selectedBlockId,
  onSelectBlock,
  onOpenWriting,
  onOpenDictionary,
}) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedToken, setSelectedToken] = useState<OcrToken | null>(null);
  const [savedTokens, setSavedTokens] = useState<Set<string>>(() => new Set());

  const activeBlock = doc.ocr_blocks.find((b) => b.block_id === selectedBlockId) || null;

  const handleSaveToken = (tokenText: string) => {
    setSavedTokens((prev) => new Set(prev).add(tokenText));
  };

  return (
    <div className="space-y-4">
      {/* Canvas Controls Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            {doc.ocr_blocks.length} vùng chữ được phát hiện
          </span>
          <span className="text-slate-300">|</span>
          <span>Bấm trực tiếp vào khung chữ trên ảnh để tra từ</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBoxes((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
          >
            {showBoxes ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            {showBoxes ? 'Ẩn khung BBox' : 'Hiện khung BBox'}
          </button>
        </div>
      </div>

      {/* Interactive Image & Bounding Box Overlay */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl select-none group min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
        <img
          src={doc.image_url}
          alt={doc.title}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = generateSampleSvgDataUrl(doc.id);
          }}
          className="w-full h-auto object-contain max-h-[580px] mx-auto block pointer-events-none"
        />

        {showBoxes && (
          <div className="absolute inset-0">
            {doc.ocr_blocks.map((block, idx) => {
              const isSelected = block.block_id === selectedBlockId;
              const { x, y, width, height } = block.bbox;

              return (
                <button
                  key={block.block_id}
                  type="button"
                  onClick={() => {
                    onSelectBlock(block);
                    setSelectedToken(null);
                  }}
                  style={{
                    left: `${Math.max(0, x * 100)}%`,
                    top: `${Math.max(0, y * 100)}%`,
                    width: `${Math.min(100, width * 100)}%`,
                    height: `${Math.min(100, height * 100)}%`,
                  }}
                  className={`absolute rounded-lg border-2 transition-all cursor-pointer flex items-start justify-start p-1 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/25 ring-2 ring-amber-400 shadow-lg shadow-amber-500/20 z-20'
                      : 'border-emerald-400/80 bg-emerald-400/10 hover:border-emerald-300 hover:bg-emerald-400/25 z-10'
                  }`}
                  title={block.text_zh}
                >
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-emerald-600/90 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Bounding Box Inspector Card */}
      {activeBlock ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-900">
                Vùng đang chọn
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Độ tin cậy: {Math.round(activeBlock.confidence * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakChinese(activeBlock.text_zh, 0.85)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                Nghe cả câu
              </button>

              <button
                type="button"
                onClick={() => onSelectBlock(null)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Bỏ chọn
              </button>
            </div>
          </div>

          {/* Large Hanzi & Pinyin */}
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide">
              {activeBlock.text_zh}
            </h3>
            <p className="text-sm font-semibold text-emerald-700">
              {activeBlock.pinyin}
            </p>
            <p className="text-sm text-slate-600 italic">
              {activeBlock.translation_vi}
            </p>
          </div>

          {/* Token Breakdown Pills */}
          <div className="space-y-2 pt-2 border-t border-amber-200/60">
            <span className="text-xs font-bold text-slate-700 block">
              Từ vựng thành phần trong dòng chữ:
            </span>

            <div className="flex flex-wrap gap-2">
              {activeBlock.tokens
                .filter((t) => !t.is_punctuation)
                .map((tok, idx) => {
                  const isTokSelected = selectedToken?.text === tok.text;
                  const displayPinyin = (tok.pinyin || COMMON_FALLBACK_PINYIN[tok.text]?.pinyin || '').trim();
                  return (
                    <button
                      key={`${tok.text}-${idx}`}
                      type="button"
                      onClick={() =>
                        setSelectedToken({
                          ...tok,
                          pinyin: displayPinyin || tok.pinyin,
                          meaning_vi: tok.meaning_vi || COMMON_FALLBACK_PINYIN[tok.text]?.meaning || '',
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        isTokSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 hover:border-emerald-500'
                      }`}
                    >
                      <span>{tok.text}</span>
                      {displayPinyin ? (
                        <span className="text-[10px] opacity-75 font-normal">
                          ({displayPinyin})
                        </span>
                      ) : null}
                      {tok.hsk_level && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                            isTokSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          H{tok.hsk_level}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Sub-token Action Mini-Bar */}
          {selectedToken && (
            <div className="rounded-2xl bg-white border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">{selectedToken.text}</span>
                {(() => {
                  const pinyin = (selectedToken.pinyin || COMMON_FALLBACK_PINYIN[selectedToken.text]?.pinyin || '').trim();
                  return pinyin ? (
                    <span className="text-xs text-emerald-700 font-semibold">[{pinyin}]</span>
                  ) : null;
                })()}
                <span className="text-xs text-slate-500">
                  {selectedToken.meaning_vi || COMMON_FALLBACK_PINYIN[selectedToken.text]?.meaning || ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakChinese(selectedToken.text, 0.85)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                </button>

                {onOpenDictionary && (
                  <button
                    type="button"
                    onClick={() => onOpenDictionary(selectedToken.text)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Từ điển
                  </button>
                )}

                {onOpenWriting && (
                  <button
                    type="button"
                    onClick={() => onOpenWriting(selectedToken.text[0])}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <PenTool className="w-3.5 h-3.5 text-purple-600" />
                    Tập viết
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveToken(selectedToken.text)}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 text-white px-2.5 py-1 text-xs font-semibold hover:bg-slate-800"
                >
                  {savedTokens.has(selectedToken.text) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Đã lưu
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Lưu từ
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
          Chưa chọn vùng văn bản nào. Nhấn vào bất kỳ khung viền xanh nào trên ảnh để tra cứu chi tiết.
        </div>
      )}
    </div>
  );
};
