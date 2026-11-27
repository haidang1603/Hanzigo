import React from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  BookOpen,
  Layers,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  Volume2,
  Loader2,
} from 'lucide-react';
import CommunityModerationDashboard from './CommunityModerationDashboard';
import {
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
} from '../../utils/materialsStorage';
import { speakChinese } from '../../utils/audio';
import { ADMIN_MATERIAL_QUICK_CATEGORIES } from './adminConstants';

export default function AdminModerationPanel({ user, contentHealth = null, materialsCount = 0 }) {
  const health = contentHealth || {};
  const hsk20Questions = Number(health.hsk20QuestionsCount || 0);
  const hsk30Questions = Number(health.hsk30QuestionsCount || 0);
  const imagePercent = Number(health.hsk15ImageCoveragePercent || 0);
  const totalMaterials = Number(health.materialsCount || materialsCount || 0);

  return (
    <div className="space-y-6">
      {/* Read-only Exam & Library Content Health Snapshot */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-black text-[#243447] dark:text-white">
            Sức khỏe Kho đề &amp; Học liệu (Read-only)
          </h3>
          <span className="text-[11px] font-semibold text-[#748092] dark:text-[#94A3B8]">
            Đối chiếu đồng bộ db:sync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[#748092] dark:text-[#94A3B8] block">Câu hỏi HSK 2.0</span>
            <strong className="text-lg font-black text-[#243447] dark:text-white">
              {hsk20Questions.toLocaleString()}
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[#748092] dark:text-[#94A3B8] block">Câu hỏi HSK 3.0</span>
            <strong className="text-lg font-black text-[#243447] dark:text-white">
              {hsk30Questions.toLocaleString()}
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[#748092] dark:text-[#94A3B8] block">Ảnh HSK 1–5</span>
            <strong className="text-lg font-black text-[#E85D3F]">
              {imagePercent}%
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <span className="text-[#748092] dark:text-[#94A3B8] block">Tài liệu Thư viện</span>
            <strong className="text-lg font-black text-[#243447] dark:text-white">
              {totalMaterials.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      <CommunityModerationDashboard user={user} />
    </div>
  );
}

export function AdminContentManagementPanels({
  adminTab,
  // Materials
  matSearch,
  setMatSearch,
  matCategoryFilter,
  setMatCategoryFilter,
  matLevelFilter,
  setMatLevelFilter,
  handleOpenCreateMat,
  renderRefreshMaterialsButton,
  renderMaterialsStatusView,
  isLoadingMaterials,
  materialsError,
  filteredMaterials,
  handleToggleMaterialFeatured,
  handleToggleMaterialHidden,
  handleOpenEditMat,
  handleDeleteMaterial,
  isMatFormOpen,
  setIsMatFormOpen,
  editingMatId,
  matForm,
  setMatForm,
  handleSaveMaterial,
  modalPanelClassName,
  // Vocab
  vocabSearch,
  setVocabSearch,
  vocabHskFilter,
  setVocabHskFilter,
  handleRefreshVocab,
  isLoadingVocab,
  handleOpenCreateVocab,
  vocabError,
  loadCustomVocabData,
  filteredVocab,
  handleOpenEditVocab,
  handleDeleteVocab,
  vocabFormOpen,
  setVocabFormOpen,
  editingVocabId,
  setEditingVocabId,
  vocabForm,
  setVocabForm,
  handleSaveVocab,
  isSavingVocab,
  // Lessons
  lessonSearch,
  setLessonSearch,
  lessonLevelFilter,
  setLessonLevelFilter,
  handleRefreshLessons,
  isLoadingLessons,
  handleOpenCreateLesson,
  lessonsError,
  loadCustomLessonsData,
  filteredLessons,
  handleOpenEditLesson,
  handleDeleteLesson,
  lessonFormOpen,
  setLessonFormOpen,
  editingLessonId,
  setEditingLessonId,
  lessonForm,
  setLessonForm,
  handleSaveLesson,
  isSavingLesson,
}) {
  return (
    <>
      {/* TAB 2: MATERIALS HUB */}
      {adminTab === 'materials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  placeholder="Tìm tài liệu theo tiêu đề, tác giả, thẻ tag..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateMat}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span>Thêm tài liệu mới</span>
                </button>

                {renderRefreshMaterialsButton()}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Danh mục:</span>
                {ADMIN_MATERIAL_QUICK_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setMatCategoryFilter(c)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      matCategoryFilter === c
                        ? 'bg-[#E85D3F] text-white'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Cấp độ:</span>
                <select
                  value={matLevelFilter}
                  onChange={(e) => setMatLevelFilter(e.target.value)}
                  className="px-3 py-1 rounded-xl font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                >
                  {MATERIAL_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoadingMaterials || materialsError || filteredMaterials.length === 0 ? (
            renderMaterialsStatusView()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {mat.isFeatured && (
                    <div className="absolute top-0 right-0 bg-[#E85D3F] text-white text-[10px] font-black px-3 py-0.5 rounded-bl-xl shadow-xs">
                      Nổi bật
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-[#E85D3F] dark:bg-orange-950/50 text-[10px] font-bold">
                        {mat.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#748092] dark:text-gray-300 text-[10px] font-bold">
                        {mat.level}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#243447] dark:text-white text-base line-clamp-2">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
                      Tác giả: {mat.author || 'HanziGo'} • {mat.format || 'PDF'}
                    </p>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-2 line-clamp-2">
                      {mat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleMaterialFeatured(mat)}
                        title={mat.isFeatured ? 'Bỏ nổi bật' : 'Ghim nổi bật'}
                        className={`p-1.5 rounded-lg cursor-pointer ${mat.isFeatured ? 'text-[#F4B942]' : 'text-gray-400 hover:text-[#F4B942]'}`}
                      >
                        <Star size={16} className={mat.isFeatured ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={() => handleToggleMaterialHidden(mat)}
                        title={mat.isHidden ? 'Hiển thị' : 'Ẩn'}
                        className={`p-1.5 rounded-lg cursor-pointer ${mat.isHidden ? 'text-rose-500' : 'text-gray-400 hover:text-emerald-500'}`}
                      >
                        {mat.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditMat(mat)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-[#E85D3F] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM VOCABULARY */}
      {adminTab === 'vocab' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Tìm chữ Hán, Pinyin, Hán-Việt, ý nghĩa..."
                className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-2xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={vocabHskFilter}
                onChange={(e) => setVocabHskFilter(e.target.value)}
                className="min-h-11 flex-1 sm:flex-none px-3 py-2.5 rounded-2xl text-base sm:text-sm font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              >
                <option value="all">Mọi cấp độ HSK</option>
                <option value="hsk1">HSK 1</option>
                <option value="hsk2">HSK 2</option>
                <option value="hsk3">HSK 3</option>
                <option value="hsk4">HSK 4</option>
                <option value="hsk5">HSK 5</option>
                <option value="hsk6">HSK 6</option>
                <option value="hsk7-9">HSK 7-9</option>
              </select>

              <button
                onClick={handleRefreshVocab}
                disabled={isLoadingVocab}
                className="min-h-11 min-w-11 p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-[#131B24] transition-all cursor-pointer shrink-0 flex items-center justify-center"
                title="Làm mới từ cơ sở dữ liệu"
              >
                <RefreshCw size={16} className={isLoadingVocab ? 'animate-spin text-[#E85D3F]' : ''} />
              </button>

              <button
                onClick={handleOpenCreateVocab}
                className="min-h-11 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Thêm từ vựng</span>
              </button>
            </div>
          </div>

          {isLoadingVocab && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#E85D3F]" size={32} />
              <p className="text-sm font-bold text-[#748092]">Đang tải từ vựng từ cơ sở dữ liệu Supabase...</p>
            </div>
          )}

          {!isLoadingVocab && vocabError && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{vocabError}</p>
              </div>
              <button
                onClick={loadCustomVocabData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoadingVocab && !vocabError && filteredVocab.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <Layers size={40} className="mx-auto text-gray-400" />
              <h4 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy từ vựng bổ sung nào</h4>
              <p className="text-xs text-[#748092]">
                {vocabSearch || vocabHskFilter !== 'all'
                  ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ HSK.'
                  : 'Hãy thêm từ vựng mới để đồng bộ vào cơ sở dữ liệu và sổ tay từ vựng của học viên.'}
              </p>
              <button
                onClick={handleOpenCreateVocab}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm từ vựng đầu tiên</span>
              </button>
            </div>
          )}

          {!isLoadingVocab && !vocabError && filteredVocab.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocab.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex items-center justify-between group hover:border-[#E85D3F] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] font-['Noto_Serif_SC'] text-2xl font-black flex items-center justify-center shrink-0">
                      {v.hanzi}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#243447] dark:text-white truncate">
                        {v.pinyin} <span className="text-xs font-semibold text-[#D97706]">({v.hanviet || 'Hán-Việt'})</span>
                      </p>
                      <p className="text-xs text-[#748092] dark:text-[#94A3B8] truncate">{v.meaning}</p>
                      <span className="text-[10px] font-bold text-[#E85D3F] uppercase">{v.hsk}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakChinese(v.hanzi)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenEditVocab(v)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                      title="Chỉnh sửa từ vựng"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVocab(v.id, v.hanzi)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 cursor-pointer"
                      title="Xóa từ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LESSONS MANAGEMENT */}
      {adminTab === 'lessons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder="Tìm tiêu đề, mô tả bài học bổ sung..."
                className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-2xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={lessonLevelFilter}
                onChange={(e) => setLessonLevelFilter(e.target.value)}
                className="min-h-11 flex-1 sm:flex-none px-3 py-2.5 rounded-2xl text-base sm:text-sm font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
              >
                <option value="all">Mọi cấp độ</option>
                <option value="Nhập môn">Nhập môn</option>
                <option value="HSK 1">HSK 1</option>
                <option value="HSK 2">HSK 2</option>
                <option value="HSK 3">HSK 3</option>
                <option value="HSK 4">HSK 4</option>
                <option value="HSK 5">HSK 5</option>
                <option value="HSK 6">HSK 6</option>
                <option value="HSK 7-9">HSK 7-9</option>
              </select>

              <button
                onClick={handleRefreshLessons}
                disabled={isLoadingLessons}
                className="min-h-11 min-w-11 p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] hover:text-[#E85D3F] hover:bg-orange-50 dark:hover:bg-[#131B24] transition-all cursor-pointer shrink-0 flex items-center justify-center"
                title="Làm mới từ cơ sở dữ liệu"
              >
                <RefreshCw size={16} className={isLoadingLessons ? 'animate-spin text-[#E85D3F]' : ''} />
              </button>

              <button
                onClick={handleOpenCreateLesson}
                className="min-h-11 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>Tạo bài học mới</span>
              </button>
            </div>
          </div>

          {isLoadingLessons && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#E85D3F]" size={32} />
              <p className="text-sm font-bold text-[#748092]">Đang tải bài học từ cơ sở dữ liệu Supabase...</p>
            </div>
          )}

          {!isLoadingLessons && lessonsError && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{lessonsError}</p>
              </div>
              <button
                onClick={loadCustomLessonsData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoadingLessons && !lessonsError && filteredLessons.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
              <BookOpen size={40} className="mx-auto text-gray-400" />
              <h4 className="text-base font-bold text-[#243447] dark:text-white">Không tìm thấy bài học bổ sung nào</h4>
              <p className="text-xs text-[#748092]">
                {lessonSearch || lessonLevelFilter !== 'all'
                  ? 'Thử thay đổi từ khóa hoặc bộ lọc cấp độ.'
                  : 'Hãy tạo bài học bổ sung đầu tiên để lưu vào cơ sở dữ liệu Supabase.'}
              </p>
              <button
                onClick={handleOpenCreateLesson}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>Tạo bài học đầu tiên</span>
              </button>
            </div>
          )}

          {!isLoadingLessons && !lessonsError && filteredLessons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((l) => (
                <div
                  key={l.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm flex flex-col justify-between space-y-3 group hover:border-[#E85D3F] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#E85D3F]">
                        {l.level}
                      </span>
                      <span className="text-xs text-[#748092]">+{l.xp} XP</span>
                    </div>
                    <h4 className="text-base font-bold text-[#243447] dark:text-white">{l.title}</h4>
                    <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1 line-clamp-2">{l.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between">
                    <span className="text-xs text-[#748092]">Thời lượng: {l.duration} phút</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditLesson(l)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#E85D3F] cursor-pointer"
                        title="Chỉnh sửa bài học"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(l.id, l.title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Xóa bài học"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 3: ADD / EDIT MATERIAL MODAL */}
      {isMatFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={modalPanelClassName}>
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-[#E85D3F]" />
                <span>{editingMatId ? 'Cập Nhật Tài Liệu' : 'Thêm Tài Liệu Mới'}</span>
              </h3>
              <button onClick={() => setIsMatFormOpen(false)} className="cursor-pointer">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Tiêu đề tài liệu *</label>
                <input
                  type="text"
                  required
                  value={matForm.title}
                  onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
                  placeholder="Ví dụ: Giáo trình Chuẩn HSK 1"
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Danh mục</label>
                  <select
                    value={matForm.category}
                    onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    {MATERIAL_CATEGORIES.filter((c) => c !== 'Tất cả').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ</label>
                  <select
                    value={matForm.level}
                    onChange={(e) => setMatForm({ ...matForm, level: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    {MATERIAL_LEVELS.filter((l) => l !== 'Tất cả').map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={matForm.description}
                  onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
                  placeholder="Nội dung, phương pháp và đối tượng học..."
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Link tải (URL)</label>
                  <input
                    type="url"
                    value={matForm.downloadUrl || ''}
                    onChange={(e) => setMatForm({ ...matForm, downloadUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Dung lượng / Định dạng</label>
                  <input
                    type="text"
                    value={matForm.fileSize || '10 MB'}
                    onChange={(e) => setMatForm({ ...matForm, fileSize: e.target.value })}
                    placeholder="10 MB"
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input
                    type="checkbox"
                    checked={matForm.isFeatured}
                    onChange={(e) => setMatForm({ ...matForm, isFeatured: e.target.checked })}
                    className="rounded text-[#E85D3F]"
                  />
                  <span>Ghim nổi bật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#243447] dark:text-white">
                  <input
                    type="checkbox"
                    checked={matForm.isHidden}
                    onChange={(e) => setMatForm({ ...matForm, isHidden: e.target.checked })}
                    className="rounded text-[#E85D3F]"
                  />
                  <span>Tạm ẩn</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsMatFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingMatId ? 'Lưu cập nhật' : 'Thêm tài liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT CUSTOM VOCAB */}
      {vocabFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <Layers size={20} className="text-[#E85D3F]" />
                <span>{editingVocabId ? 'Chỉnh Sửa Từ Vựng Bổ Sung' : 'Thêm Từ Vựng Mới'}</span>
              </h3>
              <button
                onClick={() => {
                  setVocabFormOpen(false);
                  setEditingVocabId(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Chữ Hán *</label>
                  <input
                    type="text"
                    required
                    value={vocabForm.hanzi}
                    onChange={(e) => setVocabForm({ ...vocabForm, hanzi: e.target.value })}
                    placeholder="你好"
                    className="w-full px-4 py-2 rounded-xl text-lg font-black border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#E85D3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Pinyin</label>
                  <input
                    type="text"
                    value={vocabForm.pinyin}
                    onChange={(e) => setVocabForm({ ...vocabForm, pinyin: e.target.value })}
                    placeholder="nǐ hǎo"
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Hán-Việt</label>
                  <input
                    type="text"
                    value={vocabForm.hanviet}
                    onChange={(e) => setVocabForm({ ...vocabForm, hanviet: e.target.value })}
                    placeholder="Nhĩ Hảo"
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ HSK</label>
                  <select
                    value={vocabForm.hsk}
                    onChange={(e) => setVocabForm({ ...vocabForm, hsk: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    <option value="hsk1">HSK 1</option>
                    <option value="hsk2">HSK 2</option>
                    <option value="hsk3">HSK 3</option>
                    <option value="hsk4">HSK 4</option>
                    <option value="hsk5">HSK 5</option>
                    <option value="hsk6">HSK 6</option>
                    <option value="hsk7-9">HSK 7-9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Ý nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  required
                  value={vocabForm.meaning}
                  onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                  placeholder="Xin chào"
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Câu ví dụ (tùy chọn)</label>
                <input
                  type="text"
                  value={vocabForm.example}
                  onChange={(e) => setVocabForm({ ...vocabForm, example: e.target.value })}
                  placeholder="你好！很高兴认识你。"
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => {
                    setVocabFormOpen(false);
                    setEditingVocabId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingVocab}
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingVocab && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSavingVocab ? 'Đang lưu...' : editingVocabId ? 'Cập nhật từ vựng' : 'Lưu từ vựng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD / EDIT CUSTOM LESSON */}
      {lessonFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-[#E85D3F]" />
                <span>{editingLessonId ? 'Chỉnh Sửa Bài Học Bổ Sung' : 'Thêm Bài Học Mới'}</span>
              </h3>
              <button
                onClick={() => {
                  setLessonFormOpen(false);
                  setEditingLessonId(null);
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Tên bài học *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Bài 5: Đi lại & Đặt vé tàu cao tốc"
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Cấp độ HSK</label>
                  <select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  >
                    <option value="Nhập môn">Nhập môn</option>
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5">HSK 5</option>
                    <option value="HSK 6">HSK 6</option>
                    <option value="HSK 7-9">HSK 7-9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#748092] mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Mô tả nội dung bài học..."
                  className="w-full px-4 py-2 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => {
                    setLessonFormOpen(false);
                    setEditingLessonId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#748092] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingLesson}
                  className="px-6 py-2 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingLesson && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSavingLesson ? 'Đang lưu...' : editingLessonId ? 'Cập nhật bài học' : 'Lưu bài học'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
