import React from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  RefreshCw,
  Users,
  UserCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Key,
  Loader2,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { ADMIN_USER_LEVEL_OPTIONS } from './adminConstants';

export default function AdminUserManagement({
  user,
  adminTab,
  usersList,
  filteredUsers,
  paginatedUsers,
  safeCurrentPage,
  totalPages,
  setCurrentPage,
  isLoadingUsers,
  fetchUsersError,
  loadCloudProfiles,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  userSortBy,
  setUserSortBy,
  renderRefreshUsersButton,
  renderUsersTableWrapper,
  handleChangeUserRole,
  handleToggleUserStatus,
  handleDeleteUser,
  setEditingUser,
  setIsEditUserModalOpen,
  isAddUserModalOpen,
  setIsAddUserModalOpen,
  newUserForm,
  setNewUserForm,
  isCreatingUser,
  createUserError,
  setCreateUserError,
  showNewUserPassword,
  setShowNewUserPassword,
  handleGenerateRandomPassword,
  handleCreateUser,
  renderAddUserRoleSelect,
  isEditUserModalOpen,
  editingUser,
  handleSaveEditUser,
}) {
  const tableRowsContent = (
    <table className="w-full text-left border-collapse text-xs sm:text-sm">
      <thead>
        <tr className="bg-[#FFF9F2] dark:bg-[#131B24] border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] font-bold">
          <th className="p-3 sm:p-4 pl-4 sm:pl-6">Người dùng</th>
          <th className="p-3 sm:p-4">Phân quyền</th>
          <th className="hidden md:table-cell p-4">Cấp độ học</th>
          <th className="hidden sm:table-cell p-4 text-center">Chuỗi ngày</th>
          <th className="hidden lg:table-cell p-4 text-right">Điểm XP</th>
          <th className="hidden sm:table-cell p-4 text-center">Trạng thái</th>
          <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
        {isLoadingUsers ? (
          <tr>
            <td colSpan="7" className="p-12 text-center text-[#748092] dark:text-[#94A3B8]">
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 size={28} className="animate-spin text-[#E85D3F]" />
                <p className="font-semibold text-sm">Đang tải danh sách người dùng từ máy chủ...</p>
              </div>
            </td>
          </tr>
        ) : fetchUsersError ? (
          <tr>
            <td colSpan="7" className="p-8 text-center text-rose-500 dark:text-rose-400">
              <div className="flex flex-col items-center justify-center gap-3">
                <AlertTriangle size={28} />
                <p className="font-bold text-sm">{fetchUsersError}</p>
                <button
                  type="button"
                  onClick={loadCloudProfiles}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RefreshCw size={14} />
                  <span>Thử lại</span>
                </button>
              </div>
            </td>
          </tr>
        ) : paginatedUsers.length === 0 ? (
          <tr>
            <td colSpan="7" className="p-12 text-center text-[#748092] dark:text-[#94A3B8]">
              <div className="flex flex-col items-center justify-center gap-2">
                <Users size={32} className="opacity-40" />
                <p className="font-bold text-sm">
                  {usersList.length === 0
                    ? 'Chưa có người dùng nào trong cơ sở dữ liệu.'
                    : 'Không tìm thấy người dùng nào phù hợp với bộ lọc tìm kiếm.'}
                </p>
              </div>
            </td>
          </tr>
        ) : (
          paginatedUsers.map((u) => {
            const isSelf =
              user &&
              (user.id === u.id || user.email === u.email || user.uid === u.id);
            return (
              <tr key={u.id} className="hover:bg-[#FFFDF9] dark:hover:bg-white/5 transition-colors">
                <td className="p-3 sm:p-4 pl-4 sm:pl-6">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] font-black flex items-center justify-center shrink-0 border border-[#E85D3F]/20">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                      ) : u.name ? (
                        u.name.charAt(0).toUpperCase()
                      ) : (
                        'U'
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#243447] dark:text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{u.name || 'Người dùng'}</span>
                        {isSelf && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold shrink-0">
                            Bạn
                          </span>
                        )}
                      </p>
                      <p className="hidden sm:block text-[11px] text-[#748092] dark:text-[#94A3B8] truncate">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3 sm:p-4">
                  <select
                    value={u.role || 'student'}
                    disabled={isSelf}
                    onChange={(e) => handleChangeUserRole(u, e.target.value)}
                    className="px-2 sm:px-2.5 py-1 rounded-xl text-base sm:text-sm font-bold border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#131B24] text-[#243447] dark:text-white cursor-pointer disabled:opacity-60"
                  >
                    <option value="student">Học viên</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </td>

                <td className="hidden md:table-cell p-4 font-semibold text-[#243447] dark:text-[#CBD5E1]">
                  {u.level || 'HSK 1 - Sơ cấp'}
                </td>

                <td className="hidden sm:table-cell p-4 text-center font-bold text-[#D97706]">
                  🔥 {u.streak || 0}
                </td>

                <td className="hidden lg:table-cell p-4 text-right font-black text-[#E85D3F]">
                  {(u.xp || 0).toLocaleString()} XP
                </td>

                <td className="hidden sm:table-cell p-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.status === 'blocked'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {u.status === 'blocked' ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </td>

                <td className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setEditingUser(u);
                        setIsEditUserModalOpen(true);
                      }}
                      title="Sửa thông tin"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#E85D3F] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <Edit3 size={15} />
                    </button>

                    {!isSelf && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u)}
                          title={u.status === 'blocked' ? 'Mở khóa' : 'Khóa tài khoản'}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                        >
                          {u.status === 'blocked' ? <Unlock size={15} /> : <Lock size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          title="Xóa tài khoản"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  return (
    <>
      {adminTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls: Search, Filters & Add User */}
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tìm học viên theo tên, email, trình độ HSK..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-base sm:text-sm bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
                />
              </div>

              {/* Action Buttons: Refresh & Add User */}
              <div className="flex items-center gap-2 shrink-0">
                {renderRefreshUsersButton()}

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCreateUserError(null);
                    setIsAddUserModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E85D3F]/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tạo tài khoản người dùng</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Vai trò:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'admin', label: 'Quản trị viên' },
                  { id: 'teacher', label: 'Giáo viên' },
                  { id: 'student', label: 'Học viên' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setUserRoleFilter(r.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      userRoleFilter === r.id
                        ? 'bg-[#E85D3F] text-white'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#748092] dark:text-[#94A3B8]">Trạng thái:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'active', label: 'Hoạt động' },
                  { id: 'blocked', label: 'Bị khóa' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setUserStatusFilter(s.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      userStatusFilter === s.id
                        ? 'bg-[#243447] dark:bg-white text-white dark:text-[#243447]'
                        : 'bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] dark:text-[#94A3B8] hover:bg-black/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}

                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="ml-2 px-3 py-1 rounded-xl font-bold bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white"
                >
                  <option value="xp">Sắp xếp: Điểm XP</option>
                  <option value="streak">Sắp xếp: Chuỗi ngày</option>
                  <option value="name">Sắp xếp: Tên A-Z</option>
                  <option value="date">Sắp xếp: Mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
            {renderUsersTableWrapper(tableRowsContent)}

            {/* Pagination Controls */}
            {!isLoadingUsers && !fetchUsersError && filteredUsers.length > 0 && (
              <div className="p-4 px-6 border-t border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-[#748092] dark:text-[#94A3B8] font-medium">
                  Trang <span className="font-bold text-[#243447] dark:text-white">{safeCurrentPage}</span> /{' '}
                  <span className="font-bold text-[#243447] dark:text-white">{totalPages}</span> (Tổng cộng{' '}
                  <span className="font-bold text-[#243447] dark:text-white">{filteredUsers.length}</span> người dùng)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-[#E85D3F] text-white shadow-sm'
                          : 'border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-[#243447] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <span>Sau</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
              <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                <UserCheck size={20} className="text-[#E85D3F]" />
                <span>Tạo Tài Khoản Người Dùng Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (!isCreatingUser) setIsAddUserModalOpen(false);
                }}
                disabled={isCreatingUser}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {createUserError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                <span className="flex-1">{createUserError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Họ và tên người dùng *
                </label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Đức Anh"
                  disabled={isCreatingUser}
                  className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                  Địa chỉ Email đăng nhập *
                </label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="ducanh@gmail.com"
                  disabled={isCreatingUser}
                  className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8]">
                    Mật khẩu khởi tạo * (tối thiểu 8 ký tự)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    disabled={isCreatingUser}
                    className="text-[11px] font-bold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Key size={12} />
                    <span>Tạo ngẫu nhiên</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newUserForm.password || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Nhập ít nhất 8 ký tự..."
                    disabled={isCreatingUser}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-60 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Phân quyền vai trò
                  </label>
                  {renderAddUserRoleSelect()}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                    Cấp độ HSK khởi đầu
                  </label>
                  <select
                    value={newUserForm.level}
                    onChange={(e) => setNewUserForm({ ...newUserForm, level: e.target.value })}
                    disabled={isCreatingUser}
                    className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
                  >
                    {ADMIN_USER_LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  disabled={isCreatingUser}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer disabled:opacity-40"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <span>Tạo tài khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditUserModalOpen &&
        editingUser &&
        (() => {
          const isEditingSelf =
            user &&
            (user.id === editingUser.id ||
              user.email === editingUser.email ||
              user.uid === editingUser.id);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
                  <h3 className="text-lg font-black text-[#243447] dark:text-white flex items-center gap-2">
                    <Edit3 size={20} className="text-[#E85D3F]" />
                    <span>Chỉnh Sửa Người Dùng</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveEditUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                        Cấp độ HSK
                      </label>
                      <select
                        value={editingUser.level}
                        onChange={(e) => setEditingUser({ ...editingUser, level: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                      >
                        {ADMIN_USER_LEVEL_OPTIONS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                        Trạng thái{' '}
                        {isEditingSelf && (
                          <span className="text-[10px] text-gray-400">(Không thể tự khóa)</span>
                        )}
                      </label>
                      <select
                        value={editingUser.status}
                        disabled={isEditingSelf}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold disabled:opacity-60"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="blocked">Khóa</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                        Điểm XP
                      </label>
                      <input
                        type="number"
                        value={editingUser.xp || 0}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, xp: Number(e.target.value) })
                        }
                        className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#748092] dark:text-[#94A3B8] mb-1">
                        Chuỗi ngày streak
                      </label>
                      <input
                        type="number"
                        value={editingUser.streak || 0}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, streak: Number(e.target.value) })
                        }
                        className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <button
                      type="button"
                      onClick={() => setIsEditUserModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#748092] hover:bg-black/5 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}
    </>
  );
}
