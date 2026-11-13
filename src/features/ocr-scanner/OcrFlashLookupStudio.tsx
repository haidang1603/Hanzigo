import React, { useState, useEffect } from 'react';
import {
  Camera,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import {
  listOcrDocuments,
  processImageWithOCR,
  type OcrScanDocument,
  type OcrBlock,
} from '../../services/ocrScannerService.ts';
import { ImageDropzoneAndCropper } from './ImageDropzoneAndCropper.tsx';
import { InteractiveBoundingBoxCanvas } from './InteractiveBoundingBoxCanvas.tsx';
import { OcrExtractedTextEditor } from './OcrExtractedTextEditor.tsx';

interface OcrFlashLookupStudioProps {
  user?: any;
  onOpenReadingStudio?: (articleId: string) => void;
  onOpenWriting?: (hanzi: string) => void;
  onOpenDictionary?: (term: string) => void;
}

export const OcrFlashLookupStudio: React.FC<OcrFlashLookupStudioProps> = ({
  user,
  onOpenReadingStudio,
  onOpenWriting,
  onOpenDictionary,
}) => {
  const [documents, setDocuments] = useState<OcrScanDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<OcrScanDocument | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Load existing OCR documents (remote + samples)
  useEffect(() => {
    let isMounted = true;
    listOcrDocuments(user).then((docs) => {
      if (isMounted) {
        setDocuments(docs);
        if (docs.length > 0) {
          setActiveDoc((current) => {
            if (current) return current;
            if (docs[0].ocr_blocks.length > 0) {
              setSelectedBlockId(docs[0].ocr_blocks[0].block_id);
            }
            return docs[0];
          });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleImageProcessed = async (params: {
    processedDataUrl: string;
    width: number;
    height: number;
    title: string;
  }) => {
    setIsProcessing(true);
    try {
      const newDoc = await processImageWithOCR({
        imageUrl: params.processedDataUrl,
        imageWidth: params.width,
        imageHeight: params.height,
        title: params.title,
        user,
      });

      setDocuments((prev) => [newDoc, ...prev]);
      setActiveDoc(newDoc);
      if (newDoc.ocr_blocks.length > 0) {
        setSelectedBlockId(newDoc.ocr_blocks[0].block_id);
      }
      setShowUploadModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample: OcrScanDocument) => {
    setActiveDoc(sample);
    if (sample.ocr_blocks.length > 0) {
      setSelectedBlockId(sample.ocr_blocks[0].block_id);
    }
    setShowUploadModal(false);
  };

  const handleSelectBlock = (block: OcrBlock | null) => {
    setSelectedBlockId(block ? block.block_id : null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Studio Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider backdrop-blur-xs">
              Computer Vision & Flash OCR
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              OCR Flash Lookup & Textbook Scanner
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Chụp hoặc tải ảnh giáo trình, đề thi, thực đơn, biển hiệu. Nhận diện chữ Hán theo vùng toạ độ Bounding Boxes, tra từ tức thì trên bề mặt ảnh và chuyển thành bài đọc tương tác.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-emerald-900 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Chụp / Tải ảnh mới</span>
            </button>
          </div>
        </div>

        {/* Document Switcher Pill Bar */}
        {documents.length > 0 && (
          <div className="pt-2 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-semibold text-emerald-200 shrink-0 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Tài liệu:
            </span>
            {documents.slice(0, 6).map((doc) => {
              const isActive = activeDoc?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setActiveDoc(doc);
                    if (doc.ocr_blocks.length > 0) {
                      setSelectedBlockId(doc.ocr_blocks[0].block_id);
                    }
                    setShowUploadModal(false);
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-900 font-bold shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {doc.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload & Crop Modal Overlay or Standalone Panel */}
      {showUploadModal || !activeDoc ? (
        <div className="space-y-4">
          {activeDoc && (
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại tài liệu đang xem: {activeDoc.title}
            </button>
          )}

          <ImageDropzoneAndCropper
            onImageProcessed={handleImageProcessed}
            onSelectSampleDocument={handleSelectSample}
            isProcessing={isProcessing}
          />
        </div>
      ) : (
        /* Split-View Workspace: Canvas on the Left, Extracted Editor on the Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <InteractiveBoundingBoxCanvas
              document={activeDoc}
              selectedBlockId={selectedBlockId}
              onSelectBlock={handleSelectBlock}
              onOpenWriting={onOpenWriting}
              onOpenDictionary={onOpenDictionary}
            />
          </div>

          <div className="lg:col-span-5">
            <OcrExtractedTextEditor
              document={activeDoc}
              user={user}
              selectedBlockId={selectedBlockId}
              onSelectBlock={handleSelectBlock}
              onOpenReadingStudio={onOpenReadingStudio}
            />
          </div>
        </div>
      )}
    </div>
  );
};
