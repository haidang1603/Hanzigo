import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  RotateCw,
  Sliders,
  Sparkles,
  Clipboard,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import {
  preprocessImageForOCR,
  getSampleOcrDocuments,
  type BoundingBox,
  type OcrScanDocument,
} from '../../services/ocrScannerService.ts';

interface ImageDropzoneAndCropperProps {
  onImageProcessed: (params: {
    processedDataUrl: string;
    width: number;
    height: number;
    title: string;
  }) => void;
  onSelectSampleDocument: (doc: OcrScanDocument) => void;
  isProcessing?: boolean;
}

export const ImageDropzoneAndCropper: React.FC<ImageDropzoneAndCropperProps> = ({
  onImageProcessed,
  onSelectSampleDocument,
  isProcessing = false,
}) => {
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState('Trang sách giáo trình mới');
  const [rotationDeg, setRotationDeg] = useState(0);
  const [contrast, setContrast] = useState(1.15);
  const [brightness, setBrightness] = useState(1.02);
  const [cropBox] = useState<BoundingBox>({ x: 0, y: 0, width: 1, height: 1 });
  const [dragOver, setDragOver] = useState(false);
  const [clipboardPasted, setClipboardPasted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sampleDocs = getSampleOcrDocuments();

  // Listen for global Ctrl/Cmd + V (Paste image from clipboard)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const result = evt.target?.result as string;
              if (result) {
                setRawImageUrl(result);
                setDocTitle(`Ảnh chụp màn hình ${new Date().toLocaleTimeString('vi-VN')}`);
                setClipboardPasted(true);
                setTimeout(() => setClipboardPasted(false), 3000);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileChange = (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setRawImageUrl(result);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setDocTitle(nameWithoutExt || 'Trang tài liệu chụp');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleTriggerOcr = async () => {
    if (!rawImageUrl) return;
    try {
      const { processedDataUrl, width, height } = await preprocessImageForOCR(rawImageUrl, {
        rotationDeg,
        contrast,
        brightness,
        crop: cropBox,
      });

      onImageProcessed({
        processedDataUrl,
        width,
        height,
        title: docTitle.trim() || 'Tài liệu Scan',
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Quick Selector */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Thử nhanh với mẫu tài liệu có sẵn:</span>
          </div>
          <span className="text-xs text-slate-400">Không cần tải ảnh vẫn trải nghiệm được ngay</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleDocs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelectSampleDocument(doc)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                  {doc.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {doc.extracted_full_text.slice(0, 40)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dropzone / Editor */}
      {!rawImageUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-10 text-center transition cursor-pointer ${
            dragOver
              ? 'border-emerald-500 bg-emerald-50/60'
              : 'border-slate-300 hover:border-emerald-400 bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800">
            Kéo thả ảnh tài liệu vào đây hoặc nhấn để chọn
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Hỗ trợ ảnh sách giáo trình HSK, đề thi in giấy, biển hiệu đường phố, thực đơn nhà hàng.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              Chụp camera
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold border border-emerald-200">
              <Clipboard className="w-3.5 h-3.5" />
              Dán từ Clipboard (Ctrl + V)
            </span>
          </div>

          {clipboardPasted && (
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-bounce">
              <Check className="w-3.5 h-3.5" />
              Đã nhận ảnh từ Clipboard!
            </div>
          )}
        </div>
      ) : (
        /* Image Preview & Preprocessing Deck */
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                Tiêu đề tài liệu scan:
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotationDeg((deg) => (deg + 90) % 360)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                title="Xoay ảnh 90 độ"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                Xoay 90° ({rotationDeg}°)
              </button>

              <button
                type="button"
                onClick={() => setRawImageUrl(null)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Chọn ảnh khác
              </button>
            </div>
          </div>

          {/* Canvas Enhancement Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  Độ tương phản (Contrast nét chữ)
                </span>
                <span>{contrast.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Độ sáng (Brightness)</span>
                <span>{brightness.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.02"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Preview Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 max-h-[460px] flex items-center justify-center">
            <img
              src={rawImageUrl}
              alt="Scan Preview"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
                filter: `contrast(${contrast}) brightness(${brightness})`,
                transition: 'all 0.2s ease',
              }}
              className="max-h-[440px] w-auto object-contain"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleTriggerOcr}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'Đang trích xuất Bounding Boxes...' : 'Nhận diện chữ Hán & Tách từ (OCR)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

