import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Save, 
  X, 
  ExternalLink, 
  Download, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Upload, 
  ShieldCheck, 
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { 
  getStoredMaterials, 
  saveMaterial, 
  updateMaterial, 
  deleteMaterial, 
  resetMaterials,
  getStoredCustomVocab,
  saveCustomVocab,
  deleteCustomVocab,
  getStoredCustomLessons,
  saveCustomLesson,
  deleteCustomLesson,
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
  MATERIAL_FORMATS
} from '../utils/materialsStorage';
import { playClickSound, playSuccessSound } from '../utils/audio';

export default function AdminPage({ setActiveTab }) {
  const [adminTab, setAdminTab] = useState('materials'); // 'materials' | 'vocab' | 'lessons' | 'backup'
  
  // Materials state
  const [materials, setMaterials] = useState(() => getStoredMaterials());
  const [matSearch, setMatSearch] = useState('');
  const [matCategoryFilter, setMatCategoryFilter] = useState('Tất cả');
  const [matLevelFilter, setMatLevelFilter] = useState('Tất cả');
  
  // Material Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatId, setEditingMatId] = useState(null);
  const [matForm, setMatForm] = useState({
    title: '',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    format: 'PDF',
    fileSize: '',
    author: '',
    description: '',
    downloadUrl: '',
    tags: ''
  });

  // Custom Vocab state
  const [customVocab, setCustomVocab] = useState(() => getStoredCustomVocab());
  const [vocabFormOpen, setVocabFormOpen] = useState(false);
  const [vocabForm, setVocabForm] = useState({
    hanzi: '',
    pinyin: '',
    hanviet: '',
    meaning: '',
    hsk: 'hsk1',
    topic: 'Giao tiếp hàng ngày',
    example: '',
    examplePinyin: '',
    exampleMeaning: '',
    memoryTip: ''
  });

  // Custom Lesson state
  const [customLessons, setCustomLessons] = useState(() => getStoredCustomLessons());
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    level: 'HSK 1',
    duration: '20',
    xp: '50',
    description: '',
    grammarPoints: ''
  });

  // Feedback notifications
  const [toastMsg, setToastMsg] = useState(null);

  const loadAllData = () => {
    setMaterials(getStoredMaterials());
    setCustomVocab(getStoredCustomVocab());
    setCustomLessons(getStoredCustomLessons());
  };

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    playSuccessSound();
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- MATERIAL ACTIONS ---
  const handleOpenCreateMat = () => {
    playClickSound();
    setEditingMatId(null);
    setMatForm({
      title: '',
      category: 'Giáo trình chuẩn',
      level: 'HSK 1',
      format: 'PDF',
      fileSize: '',
      author: '',
      description: '',
      downloadUrl: '',
      tags: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEditMat = (mat) => {
    playClickSound();
    setEditingMatId(mat.id);
    setMatForm({
      title: mat.title,
      category: mat.category,
      level: mat.level,
      format: mat.format,
      fileSize: mat.fileSize || '',
      author: mat.author || '',
      description: mat.description,
      downloadUrl: mat.downloadUrl,
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : (mat.tags || '')
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSaveMaterial = (e) => {
    e.preventDefault();
    if (!matForm.title.trim() || !matForm.downloadUrl.trim()) {
      alert('Vui lòng điền tiêu đề tài liệu và link tải / xem tài liệu!');
      return;
    }

    const tagsArray = matForm.tags
      ? matForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [matForm.level, matForm.format];

    if (editingMatId) {
      const updated = updateMaterial(editingMatId, {
        ...matForm,
        tags: tagsArray
      });
      setMaterials(updated);
      showToast('Cập nhật tài liệu thành công!');
    } else {
      const updated = saveMaterial({
        ...matForm,
        tags: tagsArray
      });
      setMaterials(updated);
      showToast('Thêm tài liệu mới vào hệ thống thành công!');
    }

    setIsFormOpen(false);
    setEditingMatId(null);
  };

  const handleDeleteMaterial = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài liệu: "${title}"?`)) {
      playClickSound();
      const updated = deleteMaterial(id);
      setMaterials(updated);
      showToast('Đã xóa tài liệu khỏi hệ thống!');
    }
  };

  const handleResetMaterials = () => {
    if (window.confirm('Khôi phục danh sách tài liệu mẫu mặc định của HanziGo? Toàn bộ tài liệu tự thêm sẽ được đưa về kho chuẩn.')) {
      playClickSound();
      const def = resetMaterials();
      setMaterials(def);
      showToast('Đã khôi phục danh mục tài liệu chuẩn!');
    }
  };

  // --- VOCAB ACTIONS ---
  const handleSaveVocab = (e) => {
    e.preventDefault();
    if (!vocabForm.hanzi.trim() || !vocabForm.meaning.trim()) {
      alert('Vui lòng điền chữ Hán và ý nghĩa tiếng Việt!');
      return;
    }

    const updated = saveCustomVocab(vocabForm);
    setCustomVocab(updated);
    showToast(`Đã thêm từ vựng mới: ${vocabForm.hanzi} (${vocabForm.meaning})!`);
    setVocabFormOpen(false);
    setVocabForm({
      hanzi: '',
      pinyin: '',
      hanviet: '',
      meaning: '',
      hsk: 'hsk1',
      topic: 'Giao tiếp hàng ngày',
      example: '',
      examplePinyin: '',
      exampleMeaning: '',
      memoryTip: ''
    });
  };

  const handleDeleteVocab = (id, hanzi) => {
    if (window.confirm(`Bạn muốn xóa từ vựng: ${hanzi}?`)) {
      playClickSound();
      const updated = deleteCustomVocab(id);
      setCustomVocab(updated);
      showToast('Đã xóa từ vựng tùy chỉnh!');
    }
  };

  // --- LESSON ACTIONS ---
  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }

    const updated = saveCustomLesson(lessonForm);
    setCustomLessons(updated);
    showToast(`Đã thêm bài học mới: ${lessonForm.title}!`);
    setLessonFormOpen(false);
    setLessonForm({
      title: '',
      level: 'HSK 1',
      duration: '20',
      xp: '50',
      description: '',
      grammarPoints: ''
    });
  };

  const handleDeleteLesson = (id, title) => {
    if (window.confirm(`Bạn muốn xóa bài học: ${title}?`)) {
      playClickSound();
      const updated = deleteCustomLesson(id);
      setCustomLessons(updated);
      showToast('Đã xóa bài học tùy chỉnh!');
    }
  };

  // --- EXPORT & IMPORT ---
  const handleExportData = () => {
    playClickSound();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      materials: materials,
      customVocab: customVocab,
      customLessons: customLessons
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hanzigo-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất bản sao lưu dữ liệu JSON thành công!');
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.materials && Array.isArray(parsed.materials)) {
            localStorage.setItem('hanzigo_materials', JSON.stringify(parsed.materials));
          }
          if (parsed.customVocab && Array.isArray(parsed.customVocab)) {
            localStorage.setItem('hanzigo_custom_vocab', JSON.stringify(parsed.customVocab));
          }
          if (parsed.customLessons && Array.isArray(parsed.customLessons)) {
            localStorage.setItem('hanzigo_custom_lessons', JSON.stringify(parsed.customLessons));
          }
          loadAllData();
          showToast('Nhập dữ liệu sao lưu thành công!');
        } catch (err) {
          alert('Tệp sao lưu không đúng định dạng JSON: ' + err.message);
        }
      };
    }
  };

  // Filtered materials
  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch = 
      mat.title.toLowerCase().includes(matSearch.toLowerCase()) ||
      (mat.description && mat.description.toLowerCase().includes(matSearch.toLowerCase())) ||
      (mat.author && mat.author.toLowerCase().includes(matSearch.toLowerCase()));
    const matchesCategory = matCategoryFilter === 'Tất cả' || mat.category === matCategoryFilter;
    const matchesLevel = matLevelFilter === 'Tất cả' || mat.level === matLevelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-200">
          <CheckCircle2 size={20} className="shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{toastMsg.message}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#243447] via-[#1B2636] to-[#0F172A] text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Hệ thống Quản trị & Biên soạn Nội dung HanziGo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-['Noto_Serif_SC']">
              Trung tâm Thêm & Quản lý Tài liệu
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
              Thêm mới giáo trình, tài liệu luyện thi HSK, sổ tay ngữ pháp, file nghe audio, cũng như bổ sung từ vựng và bài học vào cơ sở dữ liệu học tập.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('materials');
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20"
            >
              <BookOpen size={16} />
              <span>Xem Thư viện học viên</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2"
            >
              <Download size={16} />
              <span>Sao lưu (Export JSON)</span>
            </button>
          </div>
        </div>

        {/* Quick Stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold">Tài liệu học tập</p>
            <p className="text-2xl font-black text-white mt-1">{materials.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold">Từ vựng tùy chỉnh</p>
            <p className="text-2xl font-black text-[#F4B942] mt-1">{customVocab.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold">Bài học mới tạo</p>
            <p className="text-2xl font-black text-[#45B97C] mt-1">{customLessons.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-[#94A3B8] font-semibold">Trạng thái lưu trữ</p>
            <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sẵn sàng & Tự động lưu
            </p>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-2 overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setAdminTab('materials');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'materials'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          <span>Tài liệu & Giáo trình ({materials.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('vocab');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'vocab'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          <span>Bổ sung Từ vựng ({customVocab.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('lessons');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'lessons'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <BookOpen size={16} />
          <span>Bài học tùy chỉnh ({customLessons.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setAdminTab('backup');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'backup'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Upload size={16} />
          <span>Nhập / Xuất dữ liệu</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MATERIALS MANAGER */}
      {/* ============================================================== */}
      {adminTab === 'materials' && (
        <div className="space-y-6">
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenCreateMat}
                className="px-5 py-3 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 transition-all"
              >
                <Plus size={18} />
                <span>Thêm tài liệu mới</span>
              </button>
              
              <button
                onClick={handleResetMaterials}
                title="Khôi phục danh sách mẫu ban đầu"
                className="px-3.5 py-3 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#748092] hover:text-[#243447] dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} />
                <span className="hidden md:inline">Khôi phục mặc định</span>
              </button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-wrap items-center gap-2 flex-1 sm:justify-end">
              <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  placeholder="Tìm tài liệu, tác giả..."
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-medium text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <select
                value={matCategoryFilter}
                onChange={(e) => setMatCategoryFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
              >
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={matLevelFilter}
                onChange={(e) => setMatLevelFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
              >
                {MATERIAL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Modal / Drawer (Thêm / Chỉnh sửa tài liệu) */}
          {isFormOpen && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border-2 border-[#E85D3F]/40 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] flex items-center justify-center font-bold">
                    {editingMatId ? <Edit3 size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#243447] dark:text-white">
                      {editingMatId ? 'Chỉnh sửa thông tin tài liệu' : 'Thêm tài liệu học tập mới'}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                      Điền các thông tin giáo trình, liên kết tải file hoặc xem online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-xl text-[#748092] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMaterial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Tên tài liệu / Tiêu đề sách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Giáo trình Chuẩn HSK 3 - Standard Course (Full Audio)"
                      value={matForm.title}
                      onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs sm:text-sm font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Phân loại danh mục
                    </label>
                    <select
                      value={matForm.category}
                      onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                    >
                      {MATERIAL_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Cấp độ HSK áp dụng
                    </label>
                    <select
                      value={matForm.level}
                      onChange={(e) => setMatForm({ ...matForm, level: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                    >
                      {MATERIAL_LEVELS.filter((l) => l !== 'Tất cả').map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Định dạng file
                    </label>
                    <select
                      value={matForm.format}
                      onChange={(e) => setMatForm({ ...matForm, format: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                    >
                      {MATERIAL_FORMATS.map((fmt) => (
                        <option key={fmt} value={fmt}>{fmt}</option>
                      ))}
                    </select>
                  </div>

                  {/* File Size */}
                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Dung lượng / Số trang
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 45 MB hoặc 180 trang"
                      value={matForm.fileSize}
                      onChange={(e) => setMatForm({ ...matForm, fileSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  {/* Author / Source */}
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Tác giả / Đơn vị biên soạn
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: ĐH Ngôn ngữ Bắc Kinh, HanziGo Team"
                      value={matForm.author}
                      onChange={(e) => setMatForm({ ...matForm, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  {/* Download / View URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Link tải hoặc xem tài liệu (URL Google Drive / OneDrive / Cloud) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      value={matForm.downloadUrl}
                      onChange={(e) => setMatForm({ ...matForm, downloadUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Thẻ gắn (Tags, cách nhau bởi dấu phẩy)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: HSK 1, Giáo trình, Có Audio, Tập viết"
                      value={matForm.tags}
                      onChange={(e) => setMatForm({ ...matForm, tags: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Mô tả nội dung & Lời khuyên học tập
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả tóm tắt nội dung cuốn sách, các chủ đề ngữ pháp trọng tâm hoặc hướng dẫn cách học hiệu quả..."
                      value={matForm.description}
                      onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 transition-all"
                  >
                    <Save size={16} />
                    <span>{editingMatId ? 'Lưu cập nhật' : 'Thêm vào Thư viện'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F]">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                      {item.level}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#243447] dark:text-white line-clamp-2 leading-snug group-hover:text-[#E85D3F] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#748092] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-[#748092] dark:text-[#94A3B8] space-y-1 pt-1">
                    {item.author && (
                      <p><span className="font-semibold">Tác giả:</span> {item.author}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px]">
                      <span>Định dạng: <strong className="text-[#243447] dark:text-white">{item.format}</strong></span>
                      {item.fileSize && <span>{item.fileSize}</span>}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#E85D3F] hover:underline flex items-center gap-1"
                  >
                    <span>Xem file</span>
                    <ExternalLink size={12} />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditMat(item)}
                      title="Chỉnh sửa tài liệu"
                      className="p-2 rounded-xl text-[#748092] hover:text-[#243447] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(item.id, item.title)}
                      title="Xóa tài liệu"
                      className="p-2 rounded-xl text-[#748092] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <FolderOpen size={40} className="mx-auto text-[#748092]" />
              <p className="text-sm font-bold text-[#243447] dark:text-white">Không tìm thấy tài liệu phù hợp</p>
              <p className="text-xs text-[#748092]">Hãy thử thay đổi từ khóa hoặc chọn cấp độ khác.</p>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: VOCABULARY MANAGER */}
      {/* ============================================================== */}
      {adminTab === 'vocab' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#243447] dark:text-white">
                Kho Từ vựng tự biên soạn ({customVocab.length})
              </h2>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Các từ vựng bạn thêm tại đây sẽ tự động hiển thị trong mục "Từ vựng" và Flashcard của học viên
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setVocabFormOpen(!vocabFormOpen);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 transition-all"
            >
              <Plus size={16} />
              <span>Thêm từ vựng mới</span>
            </button>
          </div>

          {/* Form Create Vocab */}
          {vocabFormOpen && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border-2 border-[#E85D3F]/40 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
                  <Layers size={16} className="text-[#E85D3F]" />
                  <span>Điền thông tin Từ vựng Chữ Hán</span>
                </h3>
                <button
                  onClick={() => setVocabFormOpen(false)}
                  className="p-1 rounded-lg text-[#748092]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveVocab} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Chữ Hán (Hanzi) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 老师"
                      value={vocabForm.hanzi}
                      onChange={(e) => setVocabForm({ ...vocabForm, hanzi: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base font-bold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Phiên âm (Pinyin)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: lǎoshī"
                      value={vocabForm.pinyin}
                      onChange={(e) => setVocabForm({ ...vocabForm, pinyin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Âm Hán Việt
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Lão sư"
                      value={vocabForm.hanviet}
                      onChange={(e) => setVocabForm({ ...vocabForm, hanviet: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Ý nghĩa tiếng Việt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Giáo viên, thầy cô giáo"
                      value={vocabForm.meaning}
                      onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Cấp độ HSK
                    </label>
                    <select
                      value={vocabForm.hsk}
                      onChange={(e) => setVocabForm({ ...vocabForm, hsk: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                    >
                      <option value="hsk1">HSK 1</option>
                      <option value="hsk2">HSK 2</option>
                      <option value="hsk3">HSK 3</option>
                      <option value="hsk4">HSK 4</option>
                      <option value="hsk5">HSK 5</option>
                      <option value="hsk6">HSK 6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Chủ đề từ vựng
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Trường học, Nghề nghiệp"
                      value={vocabForm.topic}
                      onChange={(e) => setVocabForm({ ...vocabForm, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Câu ví dụ tiếng Trung
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 他是我的中文老师。"
                      value={vocabForm.example}
                      onChange={(e) => setVocabForm({ ...vocabForm, example: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Dịch nghĩa câu ví dụ
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Thầy ấy là giáo viên tiếng Trung của tôi."
                      value={vocabForm.exampleMeaning}
                      onChange={(e) => setVocabForm({ ...vocabForm, exampleMeaning: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Mẹo ghi nhớ / Bộ thủ
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Chữ 师 gồm bộ Cân 巾 ở dưới mang ý nghĩa thầy giáo cầm thước vải"
                      value={vocabForm.memoryTip}
                      onChange={(e) => setVocabForm({ ...vocabForm, memoryTip: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <button
                    type="button"
                    onClick={() => setVocabFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092]"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md"
                  >
                    Lưu từ vựng
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Custom Vocab List */}
          {customVocab.length > 0 ? (
            <div className="overflow-x-auto rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[11px] font-bold text-[#748092]">
                    <th className="p-4">Chữ Hán</th>
                    <th className="p-4">Pinyin</th>
                    <th className="p-4">Hán Việt</th>
                    <th className="p-4">Ý nghĩa</th>
                    <th className="p-4">Cấp độ</th>
                    <th className="p-4">Chủ đề</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F] text-xs font-medium text-[#243447] dark:text-white">
                  {customVocab.map((voc) => (
                    <tr key={voc.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-['Noto_Serif_SC'] text-xl font-bold text-[#E85D3F]">{voc.hanzi}</td>
                      <td className="p-4">{voc.pinyin}</td>
                      <td className="p-4 text-[#748092]">{voc.hanviet || '—'}</td>
                      <td className="p-4 font-semibold">{voc.meaning}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                          {voc.hsk}
                        </span>
                      </td>
                      <td className="p-4 text-[#748092]">{voc.topic}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteVocab(voc.id, voc.hanzi)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
              <Layers size={36} className="mx-auto text-[#748092]" />
              <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có từ vựng tự tạo nào</p>
              <p className="text-xs text-[#748092]">Nhấn nút "Thêm từ vựng mới" ở trên để bổ sung vào từ điển bài học của bạn.</p>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LESSONS MANAGER */}
      {/* ============================================================== */}
      {adminTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#243447] dark:text-white">
                Quản lý Bài học tùy chỉnh ({customLessons.length})
              </h2>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                Tạo bài học mới với lộ trình và điểm ngữ pháp riêng biệt
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setLessonFormOpen(!lessonFormOpen);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white font-bold text-xs shadow-md shadow-[#E85D3F]/25 flex items-center gap-2 transition-all"
            >
              <Plus size={16} />
              <span>Tạo bài học mới</span>
            </button>
          </div>

          {/* Form Create Lesson */}
          {lessonFormOpen && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border-2 border-[#E85D3F]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1E5D8] dark:border-[#2B3A4F]">
                <h3 className="text-sm font-bold text-[#243447] dark:text-white">Thêm bài học mới</h3>
                <button onClick={() => setLessonFormOpen(false)} className="text-[#748092]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Tiêu đề bài học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Bài 16: Đi taxi và hỏi đường tại Thượng Hải"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Cấp độ
                    </label>
                    <select
                      value={lessonForm.level}
                      onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-bold text-[#243447] dark:text-white focus:outline-none"
                    >
                      <option value="Nhập môn">Nhập môn</option>
                      <option value="HSK 1">HSK 1</option>
                      <option value="HSK 2">HSK 2</option>
                      <option value="HSK 3">HSK 3</option>
                      <option value="HSK 4">HSK 4</option>
                      <option value="HSK 5-6">HSK 5-6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Thời lượng ước tính (phút)
                    </label>
                    <input
                      type="number"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Điểm XP nhận được
                    </label>
                    <input
                      type="number"
                      value={lessonForm.xp}
                      onChange={(e) => setLessonForm({ ...lessonForm, xp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Điểm ngữ pháp chính
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Cấu trúc 从...到..."
                      value={lessonForm.grammarPoints}
                      onChange={(e) => setLessonForm({ ...lessonForm, grammarPoints: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1.5">
                      Mô tả bài học & Mục tiêu đạt được
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Nêu ngắn gọn nội dung bài học..."
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-xs font-semibold text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                  <button
                    type="button"
                    onClick={() => setLessonFormOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092]"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E85D3F] text-white text-xs font-bold shadow-md"
                  >
                    Lưu bài học
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lessons list */}
          {customLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customLessons.map((les) => (
                <div key={les.id} className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]">
                      {les.level}
                    </span>
                    <button
                      onClick={() => handleDeleteLesson(les.id, les.title)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-[#243447] dark:text-white">{les.title}</h4>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{les.description}</p>
                  <div className="text-[11px] text-[#748092] flex items-center gap-4 pt-1">
                    <span>Thời lượng: {les.duration} phút</span>
                    <span>Thưởng: +{les.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
              <BookOpen size={36} className="mx-auto text-[#748092]" />
              <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có bài học tự biên soạn</p>
              <p className="text-xs text-[#748092]">Bạn có thể nhấn nút "Tạo bài học mới" ở trên để bổ sung.</p>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: BACKUP & IMPORT */}
      {/* ============================================================== */}
      {adminTab === 'backup' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
              <Upload size={18} className="text-[#E85D3F]" />
              <span>Sao lưu & Khôi phục dữ liệu hệ thống</span>
            </h3>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Xuất toàn bộ tài liệu, từ vựng và bài giảng ra file JSON để lưu giữ hoặc nạp lại khi đổi thiết bị.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
            <h4 className="text-xs font-bold text-[#243447] dark:text-white">1. Xuất dữ liệu sao lưu (Export JSON)</h4>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Tải về máy tính một file JSON chứa toàn bộ dữ liệu tài liệu hiện thời.
            </p>
            <button
              onClick={handleExportData}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <Download size={16} />
              <span>Tải file backup JSON</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
            <h4 className="text-xs font-bold text-[#243447] dark:text-white">2. Nhập dữ liệu từ file (Import JSON)</h4>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Chọn tệp .json sao lưu từ máy tính để khôi phục hoặc ghi đè dữ liệu.
            </p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white text-xs font-bold cursor-pointer hover:border-[#E85D3F] transition-colors shadow-sm">
              <Upload size={16} className="text-[#E85D3F]" />
              <span>Chọn file .json từ máy tính</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

    </div>
  );
}
