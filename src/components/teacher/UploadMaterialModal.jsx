import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, Link2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  validateMaterialFile, 
  uploadMaterialToStorage, 
  buildClassroomStoragePath, 
  formatBytes,
  ALLOWED_EXTENSIONS
} from '../../services/storageService.js';

export default function UploadMaterialModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  classroomId = null,
  teacherId = null
}) {
  const [sourceMode, setSourceMode] = useState('storage'); // 'storage' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedStoragePath, setUploadedStoragePath] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    setUploadError(null);
    setUploadSuccess(false);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const val = validateMaterialFile(file);
    if (!val.valid) {
      setUploadError(val.error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    // Tự động gợi ý tên tài liệu và loại tệp nếu form chưa có
    if (!formData.title || formData.title.trim() === '') {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFormData(prev => ({
        ...prev,
        title: baseName,
        fileType: val.detectedType || prev.fileType || 'pdf'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fileType: val.detectedType || prev.fileType || 'pdf'
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    // 1. Chế độ nhập URL truyền thống
    if (sourceMode === 'url') {
      if (!formData.title?.trim() || !formData.fileUrl?.trim()) {
        setUploadError('Vui lòng nhập đầy đủ tên tài liệu và đường dẫn URL.');
        return;
      }
      onSubmit(e, {
        ...formData,
        storagePath: null,
        fileName: null,
        mimeType: null,
        fileSizeBytes: null
      });
      return;
    }

    // 2. Chế độ tải file trực tiếp lên Supabase Storage
    if (!selectedFile && !uploadedStoragePath) {
      setUploadError('Vui lòng chọn một tệp từ thiết bị để tải lên.');
      return;
    }

    if (!formData.title?.trim()) {
      setUploadError('Vui lòng nhập tên hiển thị cho tài liệu.');
      return;
    }

    // Nếu đã tải lên trước đó (ví dụ retry form submit)
    if (uploadedStoragePath) {
      onSubmit(e, {
        ...formData,
        fileUrl: `storage://materials/${uploadedStoragePath}`,
        storagePath: uploadedStoragePath,
        fileName: selectedFile?.name || formData.title,
        mimeType: selectedFile?.type || 'application/octet-stream',
        fileSizeBytes: selectedFile?.size || 0
      });
      return;
    }

    // Tiến hành upload file lên Supabase Storage
    setIsUploading(true);
    setUploadProgress(10);

    const generatedPath = buildClassroomStoragePath(
      classroomId || 'general',
      `mat_${Date.now()}`,
      selectedFile.name
    );

    const uploadRes = await uploadMaterialToStorage({
      file: selectedFile,
      path: generatedPath,
      upsert: true,
      onProgress: (p) => setUploadProgress(p)
    });

    setIsUploading(false);

    if (!uploadRes.success) {
      setUploadError(uploadRes.error || 'Tải tệp lên thất bại. Vui lòng thử lại.');
      return;
    }

    setUploadSuccess(true);
    setUploadedStoragePath(uploadRes.path);

    // Chuyển kết quả sang handleSubmit của TeacherDashboardPage
    onSubmit(e, {
      ...formData,
      fileUrl: `storage://materials/${uploadRes.path}`,
      storagePath: uploadRes.path,
      fileName: selectedFile.name,
      mimeType: selectedFile.type || 'application/octet-stream',
      fileSizeBytes: selectedFile.size || 0
    });
  };

  const handleResetModal = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadedStoragePath(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="max-w-lg w-full bg-white dark:bg-[#1A2433] rounded-3xl p-6 border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center">
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#243447] dark:text-white">Thêm Tài liệu cho Lớp</h3>
              <p className="text-[11px] text-[#748092]">Hỗ trợ lưu trữ trực tiếp Supabase Storage và liên kết URL</p>
            </div>
          </div>
          <button 
            onClick={handleResetModal}
            className="text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chuyển đổi phương thức nguồn tài liệu */}
        <div className="flex items-center p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setSourceMode('storage'); setUploadError(null); }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sourceMode === 'storage' 
                ? 'bg-[#E85D3F] text-white shadow-xs' 
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <UploadCloud size={14} />
            <span>Tải tệp lên Storage</span>
          </button>
          <button
            type="button"
            onClick={() => { setSourceMode('url'); setUploadError(null); }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sourceMode === 'url' 
                ? 'bg-[#E85D3F] text-white shadow-xs' 
                : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
            }`}
          >
            <Link2 size={14} />
            <span>Đường dẫn URL ngoài</span>
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {uploadError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <p className="font-semibold">{uploadError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
          {/* Khu vực chọn / kéo thả tệp khi ở chế độ Storage */}
          {sourceMode === 'storage' && (
            <div>
              <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1.5">
                Tệp tài liệu (PDF, Word, PPT, Audio, Ảnh - Tối đa 50MB) *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-[#E85D3F] bg-orange-50 dark:bg-orange-950/20'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFFDF9] dark:bg-[#131B24] hover:border-[#E85D3F]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                {selectedFile ? (
                  <div className="flex items-center gap-3 text-left w-full max-w-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <File size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#243447] dark:text-white truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-[#748092]">{formatBytes(selectedFile.size)} • Sẵn sàng tải lên</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setUploadedStoragePath(null);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Chọn tệp khác"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#E85D3F] flex items-center justify-center">
                      <UploadCloud size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#243447] dark:text-white">
                        Nhấp để duyệt tệp hoặc kéo thả vào đây
                      </p>
                      <p className="text-[11px] text-[#748092] mt-0.5">
                        PDF, DOCX, PPTX, XLSX, MP3, PNG, JPG (Dung lượng ≤ 50MB)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Thanh tiến trình upload */}
              {isUploading && (
                <div className="mt-2.5 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-[#748092]">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw size={12} className="animate-spin text-[#E85D3F]" />
                      Đang tải lên Supabase Storage...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1E5D8] dark:bg-[#2B3A4F] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E85D3F] to-[#CB4529] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1">Tên tài liệu *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Giáo trình HSK 2 Đàm thoại kèm Audio"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-xs focus:border-[#E85D3F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1">Loại tệp</label>
              <select
                value={formData.fileType}
                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white font-bold text-xs"
              >
                <option value="pdf">Tài liệu PDF</option>
                <option value="doc">Văn bản (Word/TXT)</option>
                <option value="ppt">Trình chiếu (PPT/PPTX)</option>
                <option value="xls">Bảng tính (Excel)</option>
                <option value="audio">Âm thanh (Audio/MP3)</option>
                <option value="image">Hình ảnh (Image)</option>
                <option value="video">Video bài giảng</option>
              </select>
            </div>

            {sourceMode === 'url' ? (
              <div>
                <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1">Đường dẫn tệp (URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.fileUrl}
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs focus:border-[#E85D3F] focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1">Trạng thái lưu trữ</label>
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-[#E85D3F] font-bold text-[11px] flex items-center gap-1.5 truncate">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Supabase Private Storage</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#748092] dark:text-[#94A3B8] mb-1">Ghi chú thêm</label>
            <textarea
              placeholder="Mô tả nội dung, hướng dẫn ôn tập cho học viên..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FFF9F2] dark:bg-[#243447] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs focus:border-[#E85D3F] focus:outline-none"
              rows={2}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleResetModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUploading || (sourceMode === 'storage' && !selectedFile && !uploadedStoragePath)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-md shadow-[#E85D3F]/30 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Đang tải tệp...</span>
                </>
              ) : (
                <span>Lưu tài liệu</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
