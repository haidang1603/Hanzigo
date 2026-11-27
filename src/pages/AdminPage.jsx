import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Edit3,
  X,
  Download,
  BookOpen,
  Layers,
  CheckCircle2,
  RefreshCw,
  Upload,
  ShieldCheck,
  Users,
  Crown,
  Activity,
  Check,
  Cpu,
  BarChart3,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import {
  migrateLocalStorageCustomVocab,
} from '../services/customVocabularyService';
import {
  migrateLocalStorageCustomLessons,
} from '../services/customLessonService';
import { adminCreateUser } from '../supabase/services';
import {
  getMaterialsFromDb,
  addMaterialToDb,
  updateMaterialInDb,
  deleteMaterialFromDb,
} from '../services/materialsService';
import { playClickSound } from '../utils/audio';
import { useAdminDashboard } from '../components/admin/hooks/useAdminDashboard';
import AdminOverviewPanel from '../components/admin/AdminOverviewPanel';
import AdminUsersPanel from '../components/admin/AdminUsersPanel';
import AdminModerationPanel, {
  AdminContentManagementPanels,
} from '../components/admin/AdminModerationPanel';
import AdminSystemHealthPanel from '../components/admin/AdminSystemHealthPanel';
import {
  DEFAULT_MAT_FORM,
} from '../components/admin/adminConstants';
import {
  filterAndSortAdminMaterials,
  exportAdminBackupJson,
} from '../components/admin/adminHelpers';

const ADMIN_MODAL_PANEL_CLASS =
  'bg-white dark:bg-[#1E293B] rounded-3xl max-w-xl w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto';

export default function AdminPage({ user, onUpdateUser }) {
  const pageSize = 10;

  const dash = useAdminDashboard({
    user,
    onUpdateUser,
    onCreateUser: adminCreateUser,
  });

  const {
    usersList,
    isLoadingUsers,
    fetchUsersError,
    filteredUsers,
    currentPage,
    loadCustomVocabData,
    loadCustomLessonsData,
    showToast,
  } = dash;

  // Materials State (Authoritative source: Supabase)
  const [materials, setMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState(null);
  const [matSearch, setMatSearch] = useState('');
  const [matCategoryFilter, setMatCategoryFilter] = useState('Tất cả');
  const [matLevelFilter, setMatLevelFilter] = useState('Tất cả');
  const [isMatFormOpen, setIsMatFormOpen] = useState(false);
  const [editingMatId, setEditingMatId] = useState(null);
  const [matForm, setMatForm] = useState(DEFAULT_MAT_FORM);

  // Paginated Users Calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  // Fetch materials directly from Supabase DB (authoritative)
  const loadMaterialsData = async () => {
    setIsLoadingMaterials(true);
    setMaterialsError(null);
    try {
      const dbItems = await getMaterialsFromDb();
      if (Array.isArray(dbItems)) {
        setMaterials(dbItems);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Failed to load materials from DB:', err);
      setMaterialsError('Không thể nạp danh sách tài liệu từ cơ sở dữ liệu.');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    if (!dash.isAdmin) return undefined;
    loadMaterialsData();
    const handleRemoteMaterialsSync = () => {
      loadMaterialsData();
    };
    window.addEventListener('hanzigo:materials_updated', handleRemoteMaterialsSync);
    return () => window.removeEventListener('hanzigo:materials_updated', handleRemoteMaterialsSync);
  }, [dash.isAdmin]);

  useEffect(() => {
    if (!dash.isAdmin) return undefined;
    const initializeCustomContent = async () => {
      try {
        await migrateLocalStorageCustomVocab(user);
      } catch (err) {
        console.warn('Custom vocab migration notice:', err);
      }
      try {
        await migrateLocalStorageCustomLessons(user);
      } catch (err) {
        console.warn('Custom lessons migration notice:', err);
      }
      await Promise.all([loadCustomVocabData(), loadCustomLessonsData()]);
    };

    initializeCustomContent();

    const handleRemoteVocabSync = () => loadCustomVocabData();
    const handleRemoteLessonsSync = () => loadCustomLessonsData();

    window.addEventListener('hanzigo:custom_vocab_updated', handleRemoteVocabSync);
    window.addEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsSync);

    return () => {
      window.removeEventListener('hanzigo:custom_vocab_updated', handleRemoteVocabSync);
      window.removeEventListener('hanzigo:custom_lessons_updated', handleRemoteLessonsSync);
    };
  }, [dash.isAdmin, user, loadCustomVocabData, loadCustomLessonsData]);

  // Materials Actions
  const handleOpenCreateMat = () => {
    playClickSound();
    setEditingMatId(null);
    setMatForm(DEFAULT_MAT_FORM);
    setIsMatFormOpen(true);
  };

  const handleOpenEditMat = (mat) => {
    playClickSound();
    setEditingMatId(mat.id);
    setMatForm({
      ...mat,
      tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : mat.tags || '',
    });
    setIsMatFormOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!matForm.title.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu!');
      return;
    }
    playClickSound();
    const tagsArray =
      typeof matForm.tags === 'string'
        ? matForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(matForm.tags)
          ? matForm.tags
          : [];

    const payload = { ...matForm, tags: tagsArray };

    try {
      if (editingMatId) {
        await updateMaterialInDb(editingMatId, payload);
        showToast(`Đã cập nhật tài liệu: ${payload.title}!`);
      } else {
        await addMaterialToDb(payload);
        showToast(`Đã thêm tài liệu mới: ${payload.title}!`);
      }
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
    } catch (err) {
      console.error('Error saving material:', err);
      showToast('Có lỗi xảy ra khi lưu tài liệu lên cơ sở dữ liệu.');
    }
    setIsMatFormOpen(false);
  };

  const handleDeleteMaterial = async (id, title) => {
    if (window.confirm(`Xác nhận xóa tài liệu "${title}" khỏi hệ thống?`)) {
      playClickSound();
      try {
        await deleteMaterialFromDb(id);
        window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
        await loadMaterialsData();
        showToast(`Đã xóa tài liệu: ${title}!`);
      } catch (err) {
        console.error('Error deleting material:', err);
        showToast('Có lỗi xảy ra khi xóa tài liệu.');
      }
    }
  };

  const handleToggleMaterialFeatured = async (mat) => {
    playClickSound();
    try {
      await updateMaterialInDb(mat.id, { isFeatured: !mat.isFeatured });
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
      showToast(`Đã ${!mat.isFeatured ? 'ghim nổi bật' : 'bỏ ghim'} tài liệu: ${mat.title}`);
    } catch (err) {
      console.error('Error toggling featured material:', err);
    }
  };

  const handleToggleMaterialHidden = async (mat) => {
    playClickSound();
    try {
      await updateMaterialInDb(mat.id, { isHidden: !mat.isHidden });
      window.dispatchEvent(new CustomEvent('hanzigo:materials_updated'));
      await loadMaterialsData();
      showToast(`Đã ${!mat.isHidden ? 'ẩn' : 'hiển thị'} tài liệu: ${mat.title}`);
    } catch (err) {
      console.error('Error toggling hidden material:', err);
    }
  };

  const handleRefreshMaterials = async () => {
    playClickSound();
    await loadMaterialsData();
    showToast('Đã làm mới danh sách tài liệu từ cơ sở dữ liệu!');
  };

  const handleExportData = () => {
    playClickSound();
    exportAdminBackupJson({
      materials,
      usersList,
      customVocab: dash.customVocab,
      customLessons: dash.customLessons,
    });
    showToast('Đã xuất file sao lưu dữ liệu toàn hệ thống!');
  };

  const filteredMaterials = useMemo(
    () =>
      filterAndSortAdminMaterials(materials, {
        matSearch,
        matCategoryFilter,
        matLevelFilter,
      }),
    [materials, matSearch, matCategoryFilter, matLevelFilter]
  );

  const openReportsCount = Number(dash.dashboardSummary?.kpis?.openReportsCount || 0);
  const clientErrors24hCount = Number(dash.dashboardSummary?.kpis?.clientErrors24h || 0);

  const adminTabsList = [
    { id: 'overview', label: 'Tổng quan & KPI', icon: BarChart3, badge: 0 },
    { id: 'users', label: `Người dùng (${usersList.length})`, icon: Users, badge: 0 },
    { id: 'moderation', label: 'Kiểm duyệt & Kho đề', icon: ShieldAlert, badge: openReportsCount },
    { id: 'materials', label: `Kho Tài liệu (${materials.length})`, icon: FileText, badge: 0 },
    { id: 'vocab', label: `Từ vựng (${dash.customVocab.length})`, icon: Layers, badge: 0 },
    { id: 'lessons', label: `Bài học (${dash.customLessons.length})`, icon: BookOpen, badge: 0 },
    { id: 'ai_metrics', label: 'Hệ thống, AI & Log lỗi', icon: Cpu, badge: clientErrors24hCount },
    { id: 'backup', label: 'Sao lưu & Dọn dẹp', icon: Upload, badge: 0 },
  ];

  const renderRefreshUsersButton = () => (
    <button
      type="button"
      onClick={() => {
        playClickSound();
        dash.loadCloudProfiles();
      }}
      disabled={isLoadingUsers}
      title="Tải lại danh sách từ cơ sở dữ liệu"
      className="p-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] hover:bg-black/5 dark:hover:bg-white/5 text-[#748092] dark:text-[#94A3B8] transition-all cursor-pointer disabled:opacity-50"
    >
      <RefreshCw size={16} className={isLoadingUsers ? 'animate-spin text-[#E85D3F]' : ''} />
    </button>
  );

  const renderUsersTableWrapper = (tableContent) => (
    <>
      <p className="sm:hidden text-xs text-slate-500 px-4 pt-3 pb-1">Vuốt ngang để xem đầy đủ cột →</p>
      <div className="overflow-x-auto max-w-full">{tableContent}</div>
    </>
  );

  /* MODAL 1: ADD USER MODAL */
  const renderAddUserRoleSelect = () => (
    <select
      value={dash.newUserForm.role}
      onChange={(e) => dash.setNewUserForm({ ...dash.newUserForm, role: e.target.value })}
      disabled={dash.isCreatingUser}
      className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
    >
      <option value="student">Học viên (Student)</option>
      <option value="teacher">Giáo viên (Teacher)</option>
    </select>
  );
  /* MODAL 2: EDIT USER MODAL */

  const renderRefreshMaterialsButton = () => (
    <button
      onClick={handleRefreshMaterials}
      disabled={isLoadingMaterials}
      className="px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-[#131B24] dark:hover:bg-gray-800 text-[#748092] dark:text-[#94A3B8] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
      title="Tải lại tài liệu từ cơ sở dữ liệu"
    >
      <RefreshCw size={15} className={isLoadingMaterials ? 'animate-spin' : ''} />
    </button>
  );

  const renderMaterialsStatusView = () => {
    if (isLoadingMaterials) {
      return (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 size={36} className="text-[#E85D3F] animate-spin" />
          <p className="text-sm font-bold text-[#748092] dark:text-[#94A3B8]">
            Đang tải danh sách tài liệu từ cơ sở dữ liệu...
          </p>
        </div>
      );
    }
    if (materialsError) {
      return (
        <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-center space-y-3">
          <AlertTriangle size={32} className="text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{materialsError}</p>
          <button
            onClick={loadMaterialsData}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
        <BookOpen size={40} className="text-gray-300 dark:text-gray-600" />
        <h4 className="text-base font-black text-[#243447] dark:text-white">
          Không tìm thấy tài liệu phù hợp
        </h4>
        <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-sm">
          Chưa có tài liệu nào trong cơ sở dữ liệu hoặc không khớp với tiêu chí tìm kiếm/lọc hiện tại.
        </p>
      </div>
    );
  };

  if (!dash.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
          <ShieldAlert size={36} className="mx-auto text-[#E85D3F]" />
          <h2 className="text-lg font-black text-[#243447] dark:text-white">
            Quyền truy cập bị từ chối
          </h2>
          <p className="text-xs sm:text-sm text-[#748092] dark:text-[#94A3B8]">
            Khu vực này chỉ dành cho tài khoản Quản trị viên (ADMIN) đã xác thực.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {dash.toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl border border-white/10 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 size={18} className="text-[#45B97C]" />
          <span>{dash.toastMsg.message}</span>
        </div>
      )}

      {/* 1. Compact Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-3.5 sm:p-6 border border-white/10 shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-2 max-w-2xl">
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase bg-[#E85D3F]/20 text-[#E85D3F] border border-[#E85D3F]/30">
                <ShieldCheck size={12} />
                Bảng Điều Khiển Quản Trị Hệ Thống
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Crown size={12} />
                <span>Toàn quyền quản trị viên</span>
              </span>
            </div>

            <h1 className="text-base sm:text-2xl lg:text-3xl font-black tracking-tight">
              Trung Tâm Quản Trị HanziGo
            </h1>
            <p className="hidden sm:block text-sm text-[#94A3B8] leading-relaxed">
              Theo dõi toàn diện học viên, quản lý kho tài liệu, chỉnh sửa ngân hàng từ vựng, điều chỉnh bài học và giám sát tải AI theo thời gian thực.
            </p>
          </div>

          {/* Authenticated Admin Identity Badge & Actions */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
            {dash.isEditingAdminName ? (
              <form
                onSubmit={dash.handleSaveAdminName}
                className="p-2 px-3 rounded-2xl bg-white/15 backdrop-blur-md border border-emerald-400/40 flex items-center gap-2 shadow-xl animate-in fade-in duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Crown size={16} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dash.adminNameInput}
                    onChange={(e) => dash.setAdminNameInput(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    autoFocus
                    maxLength={40}
                    className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-400 w-36 sm:w-44"
                  />
                  <button
                    type="submit"
                    disabled={dash.isSavingAdminName}
                    title="Lưu tên"
                    className="min-h-11 p-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center font-bold text-xs gap-1"
                  >
                    <Check size={14} />
                    <span>Lưu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dash.setAdminNameInput(user?.name || 'Quản trị viên');
                      dash.setIsEditingAdminName(false);
                    }}
                    title="Hủy"
                    className="min-h-11 p-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all cursor-pointer flex items-center justify-center text-xs"
                  >
                    <X size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2 px-3 sm:px-4 rounded-2xl bg-white/10 hover:bg-white/[0.14] backdrop-blur-md border border-white/15 transition-all flex items-center gap-2.5 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30 shadow-inner">
                  <Crown size={16} />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-black text-white truncate max-w-[140px] sm:max-w-[160px]">
                      {user?.name || 'Quản trị viên HanziGo'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        dash.setAdminNameInput(user?.name || 'Quản trị viên');
                        dash.setIsEditingAdminName(true);
                      }}
                      title="Chỉnh sửa họ tên"
                      className="p-1 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-gray-300 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <p className="hidden sm:block text-[10px] font-medium text-gray-400 truncate max-w-[180px]">
                    {user?.email || 'admin@hanzigo.com'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={dash.handleRefreshAll}
              disabled={dash.isLoadingDashboard || isLoadingUsers}
              className="min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw size={14} className={dash.isLoadingDashboard ? 'animate-spin' : ''} />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={() => dash.setShowMobileKpis((prev) => !prev)}
              className="sm:hidden min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 size={14} />
              <span>{dash.showMobileKpis ? 'Ẩn KPI' : 'KPI'}</span>
            </button>

            <button
              onClick={handleExportData}
              className="min-h-11 px-3.5 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Xuất sao lưu</span>
              <span className="sm:hidden">Sao lưu</span>
            </button>
          </div>
        </div>

        {/* System Overview KPI Cards */}
        <div
          className={`${dash.showMobileKpis ? 'grid' : 'hidden sm:grid'} grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-6 pt-3 sm:pt-5 border-t border-white/10`}
        >
          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Users size={13} className="text-[#E85D3F]" />
              <span>Tổng học viên</span>
            </p>
            <p className="text-lg sm:text-2xl font-black text-white mt-0.5 sm:mt-1">{dash.userStats.total}</p>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Crown size={13} className="text-emerald-400" />
              <span>Quản trị &amp; GV</span>
            </p>
            <p className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5 sm:mt-1">
              {dash.userStats.admins + dash.userStats.teachers}
            </p>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <FileText size={13} className="text-[#F4B942]" />
              <span>Tài liệu &amp; Bài học</span>
            </p>
            <p className="text-lg sm:text-2xl font-black text-[#F4B942] mt-0.5 sm:mt-1">
              {materials.length + dash.customLessons.length}
            </p>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5">
              <Activity size={13} className="text-sky-400" />
              <span>Tổng XP tích lũy</span>
            </p>
            <p className="text-lg sm:text-2xl font-black text-sky-400 mt-0.5 sm:mt-1">
              {dash.userStats.totalXp.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-2 overflow-x-auto">
        {adminTabsList.map((t) => {
          const Icon = t.icon;
          const isActive = dash.adminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                playClickSound();
                dash.setAdminTab(t.id);
              }}
              className={`min-h-11 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${isActive
                ? 'bg-[#E85D3F] text-white shadow-md shadow-[#E85D3F]/25'
                : 'text-[#748092] dark:text-[#94A3B8] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-[#243447]">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 0: OVERVIEW & SYSTEM ANALYTICS */}
      {dash.adminTab === 'overview' && (
        <AdminOverviewPanel
          userStats={dash.userStats}
          materials={materials}
          dashboardSummary={dash.dashboardSummary}
          isLoadingDashboard={dash.isLoadingDashboard}
          dashboardError={dash.dashboardError}
          setAdminTab={dash.setAdminTab}
          setIsAddUserModalOpen={dash.setIsAddUserModalOpen}
          handleOpenCreateMat={handleOpenCreateMat}
          handleOpenCreateVocab={dash.handleOpenCreateVocab}
        />
      )}

      {/* TAB 1: USER MANAGEMENT + ADD/EDIT MODALS */}
      <AdminUsersPanel
        user={user}
        adminTab={dash.adminTab}
        usersList={usersList}
        filteredUsers={filteredUsers}
        paginatedUsers={paginatedUsers}
        safeCurrentPage={safeCurrentPage}
        totalPages={totalPages}
        setCurrentPage={dash.setCurrentPage}
        isLoadingUsers={isLoadingUsers}
        fetchUsersError={fetchUsersError}
        loadCloudProfiles={dash.loadCloudProfiles}
        userSearch={dash.userSearch}
        setUserSearch={dash.setUserSearch}
        userRoleFilter={dash.userRoleFilter}
        setUserRoleFilter={dash.setUserRoleFilter}
        userStatusFilter={dash.userStatusFilter}
        setUserStatusFilter={dash.setUserStatusFilter}
        userSortBy={dash.userSortBy}
        setUserSortBy={dash.setUserSortBy}
        renderRefreshUsersButton={renderRefreshUsersButton}
        renderUsersTableWrapper={renderUsersTableWrapper}
        handleChangeUserRole={dash.handleChangeUserRole}
        handleToggleUserStatus={dash.handleToggleUserStatus}
        handleDeleteUser={dash.handleDeleteUser}
        setEditingUser={dash.setEditingUser}
        setIsEditUserModalOpen={dash.setIsEditUserModalOpen}
        isAddUserModalOpen={dash.isAddUserModalOpen}
        setIsAddUserModalOpen={dash.setIsAddUserModalOpen}
        newUserForm={dash.newUserForm}
        setNewUserForm={dash.setNewUserForm}
        isCreatingUser={dash.isCreatingUser}
        createUserError={dash.createUserError}
        setCreateUserError={dash.setCreateUserError}
        showNewUserPassword={dash.showNewUserPassword}
        setShowNewUserPassword={dash.setShowNewUserPassword}
        handleGenerateRandomPassword={dash.handleGenerateRandomPassword}
        handleCreateUser={dash.handleCreateUser}
        renderAddUserRoleSelect={renderAddUserRoleSelect}
        isEditUserModalOpen={dash.isEditUserModalOpen}
        editingUser={dash.editingUser}
        handleSaveEditUser={dash.handleSaveEditUser}
      />

      {/* TAB: COMMUNITY MODERATION & CONTENT HEALTH */}
      {dash.adminTab === 'moderation' && (
        <AdminModerationPanel
          user={user}
          contentHealth={dash.dashboardSummary?.contentHealth}
          materialsCount={materials.length}
        />
      )}

      {/* TABS 2, 3, 4: MATERIALS, VOCAB & LESSONS + MODALS */}
      <AdminContentManagementPanels
        adminTab={dash.adminTab}
        matSearch={matSearch}
        setMatSearch={setMatSearch}
        matCategoryFilter={matCategoryFilter}
        setMatCategoryFilter={setMatCategoryFilter}
        matLevelFilter={matLevelFilter}
        setMatLevelFilter={setMatLevelFilter}
        handleOpenCreateMat={handleOpenCreateMat}
        renderRefreshMaterialsButton={renderRefreshMaterialsButton}
        renderMaterialsStatusView={renderMaterialsStatusView}
        isLoadingMaterials={isLoadingMaterials}
        materialsError={materialsError}
        filteredMaterials={filteredMaterials}
        handleToggleMaterialFeatured={handleToggleMaterialFeatured}
        handleToggleMaterialHidden={handleToggleMaterialHidden}
        handleOpenEditMat={handleOpenEditMat}
        handleDeleteMaterial={handleDeleteMaterial}
        isMatFormOpen={isMatFormOpen}
        setIsMatFormOpen={setIsMatFormOpen}
        editingMatId={editingMatId}
        matForm={matForm}
        setMatForm={setMatForm}
        handleSaveMaterial={handleSaveMaterial}
        modalPanelClassName={ADMIN_MODAL_PANEL_CLASS}
        vocabSearch={dash.vocabSearch}
        setVocabSearch={dash.setVocabSearch}
        vocabHskFilter={dash.vocabHskFilter}
        setVocabHskFilter={dash.setVocabHskFilter}
        handleRefreshVocab={dash.handleRefreshVocab}
        isLoadingVocab={dash.isLoadingVocab}
        handleOpenCreateVocab={dash.handleOpenCreateVocab}
        vocabError={dash.vocabError}
        loadCustomVocabData={loadCustomVocabData}
        filteredVocab={dash.filteredVocab}
        handleOpenEditVocab={dash.handleOpenEditVocab}
        handleDeleteVocab={dash.handleDeleteVocab}
        vocabFormOpen={dash.vocabFormOpen}
        setVocabFormOpen={dash.setVocabFormOpen}
        editingVocabId={dash.editingVocabId}
        setEditingVocabId={dash.setEditingVocabId}
        vocabForm={dash.vocabForm}
        setVocabForm={dash.setVocabForm}
        handleSaveVocab={dash.handleSaveVocab}
        isSavingVocab={dash.isSavingVocab}
        lessonSearch={dash.lessonSearch}
        setLessonSearch={dash.setLessonSearch}
        lessonLevelFilter={dash.lessonLevelFilter}
        setLessonLevelFilter={dash.setLessonLevelFilter}
        handleRefreshLessons={dash.handleRefreshLessons}
        isLoadingLessons={dash.isLoadingLessons}
        handleOpenCreateLesson={dash.handleOpenCreateLesson}
        lessonsError={dash.lessonsError}
        loadCustomLessonsData={loadCustomLessonsData}
        filteredLessons={dash.filteredLessons}
        handleOpenEditLesson={dash.handleOpenEditLesson}
        handleDeleteLesson={dash.handleDeleteLesson}
        lessonFormOpen={dash.lessonFormOpen}
        setLessonFormOpen={dash.setLessonFormOpen}
        editingLessonId={dash.editingLessonId}
        setEditingLessonId={dash.setEditingLessonId}
        lessonForm={dash.lessonForm}
        setLessonForm={dash.setLessonForm}
        handleSaveLesson={dash.handleSaveLesson}
        isSavingLesson={dash.isSavingLesson}
      />

      {/* TABS 5 & 6: AI MONITORING, PRODUCTION ERROR LOGS & BACKUP / PURGE */}
      <AdminSystemHealthPanel
        adminTab={dash.adminTab}
        serviceHealth={dash.dashboardSummary?.serviceHealth}
        clientErrorLogs={dash.clientErrorLogs}
        isLoadingErrorLogs={dash.isLoadingErrorLogs}
        loadClientErrorLogs={dash.loadClientErrorLogs}
        handleExportData={handleExportData}
        handlePurgeAllMockData={dash.handlePurgeAllMockData}
      />
    </div>
  );
}
