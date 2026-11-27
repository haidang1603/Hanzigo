import React from 'react';
import {
  Users,
  Edit3,
  Plus,
  EyeOff,
  Eye,
  Search,
  X,
  Filter,
  RefreshCw,
  Trash2,
  Target,
  Clock,
  Copy,
  ExternalLink,
  QrCode,
  Download,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { PARTNER_LEVEL_OPTIONS, PARTNER_CONTACT_METHODS } from './communityConstants.js';
import { compressImageFile } from './communityHelpers.js';

export function StudyPartnerList({
  user,
  studyPartners,
  filteredPartners,
  myPartnerProfile,
  isLoadingPartners,
  partnerSearchTerm,
  setPartnerSearchTerm,
  showPartnerFilters,
  setShowPartnerFilters,
  activePartnerFilterCount,
  partnerFilterLevel,
  setPartnerFilterLevel,
  partnerFilterMethod,
  setPartnerFilterMethod,
  partnerFilterStatus,
  setPartnerFilterStatus,
  handleOpenCreatePartnerModal,
  handleOpenEditPartnerModal,
  handleTogglePartnerStatus,
  handleDeletePartner,
  handleCopyContact,
  handleOpenContactLink,
  setZoomImageModal,
  setActiveContactModal,
  renderMobileFilterToggle,
}) {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-4">
          <div>
            <h2 className="text-xl font-black text-[#243447] dark:text-white flex items-center gap-2">
              <Users size={20} className="text-[#45B97C]" />
              <span>Trung Tâm Ghép Đôi Luyện Nói (Call 1-1)</span>
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">
              Tìm bạn bè cùng cấp độ HSK 1–6 để cùng luyện đàm thoại 20–30 phút mỗi ngày qua Zalo, Google Meet hoặc WeChat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {myPartnerProfile ? (
              <button
                onClick={() => handleOpenEditPartnerModal(myPartnerProfile)}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#45B97C] hover:bg-emerald-100 font-bold text-xs border border-emerald-200 dark:border-emerald-800 shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Hồ sơ của tôi</span>
              </button>
            ) : null}

            <button
              onClick={handleOpenCreatePartnerModal}
              className="px-5 py-2.5 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={15} />
              <span>{myPartnerProfile ? 'Đăng tin mới' : 'Đăng tin tìm bạn ngay (+15 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Banner hiển thị hồ sơ cá nhân của học viên nếu đã đăng ký */}
        {myPartnerProfile && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EBF8F2] dark:bg-[#162B21] border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${myPartnerProfile.isActive ? 'bg-[#45B97C] animate-pulse' : 'bg-slate-400'}`} />
              <div className="min-w-0">
                <span className="font-bold text-[#243447] dark:text-white">
                  Hồ sơ của bạn ({myPartnerProfile.name} - {myPartnerProfile.level}):
                </span>{' '}
                <span className={`font-semibold ${myPartnerProfile.isActive ? 'text-[#45B97C]' : 'text-slate-500'}`}>
                  {myPartnerProfile.isActive ? 'Đang tìm bạn' : 'Đã tạm ngưng hiển thị'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTogglePartnerStatus(myPartnerProfile)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#131B24] border border-emerald-300 dark:border-emerald-700 font-bold text-[#243447] dark:text-white hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                title={myPartnerProfile.isActive ? 'Tạm ngưng để không nhận kết nối mới' : 'Kích hoạt lại hồ sơ'}
              >
                {myPartnerProfile.isActive ? <EyeOff size={13} className="text-amber-500" /> : <Eye size={13} className="text-[#45B97C]" />}
                <span>{myPartnerProfile.isActive ? 'Tạm ngưng' : 'Mở lại'}</span>
              </button>
              <button
                onClick={() => handleOpenEditPartnerModal(myPartnerProfile)}
                className="px-3 py-1.5 rounded-xl bg-[#45B97C] text-white font-bold hover:bg-[#3AA56E] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Sửa hồ sơ</span>
              </button>
            </div>
          </div>
        )}

        {/* Partner Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Ô tìm kiếm từ khóa + nút toggle bộ lọc mobile */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
              <input
                type="text"
                placeholder="Tìm bạn theo tên, mục tiêu, kỹ năng luyện tập..."
                value={partnerSearchTerm}
                onChange={(e) => setPartnerSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
              />
              {partnerSearchTerm && (
                <button
                  onClick={() => setPartnerSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#748092] hover:text-[#243447] dark:hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {renderMobileFilterToggle ? (
              renderMobileFilterToggle({
                showPartnerFilters,
                togglePartnerFilters: () => setShowPartnerFilters((prev) => !prev),
                activePartnerFilterCount,
              })
            ) : (
              <button
                type="button"
                onClick={() => setShowPartnerFilters((prev) => !prev)}
                className={`sm:hidden min-h-11 px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  showPartnerFilters || activePartnerFilterCount > 0
                    ? 'bg-[#45B97C]/15 border-[#45B97C]/40 text-[#45B97C]'
                    : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white'
                }`}
              >
                <Filter size={14} />
                <span>Bộ lọc</span>
                {activePartnerFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#45B97C] text-white text-[10px] font-black">
                    {activePartnerFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Bộ lọc dropdown */}
          <div className={`${showPartnerFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092]">Cấp độ:</span>
                <select
                  value={partnerFilterLevel}
                  onChange={(e) => setPartnerFilterLevel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-semibold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Mọi cấp độ</option>
                  {PARTNER_LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092]">Kênh:</span>
                <select
                  value={partnerFilterMethod}
                  onChange={(e) => setPartnerFilterMethod(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-semibold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Mọi kênh liên hệ</option>
                  {PARTNER_CONTACT_METHODS.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092]">Trạng thái:</span>
                <select
                  value={partnerFilterStatus}
                  onChange={(e) => setPartnerFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm font-semibold text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang tìm bạn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Grid */}
        {isLoadingPartners ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <RefreshCw size={28} className="mx-auto text-[#45B97C] animate-spin mb-2" />
            <p className="text-xs text-[#748092]">Đang tải danh sách bạn học từ Supabase...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
            <Users size={40} className="mx-auto text-[#748092]/50" />
            <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có ai đăng ký phù hợp với bộ lọc</p>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8] max-w-md mx-auto">
              Bạn muốn tìm bạn cùng luyện phản xạ khẩu ngữ HSK? Hãy nhấn đăng tin để ghép đôi ngay nhé!
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {(partnerSearchTerm || partnerFilterLevel !== 'all' || partnerFilterMethod !== 'all' || partnerFilterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setPartnerSearchTerm('');
                    setPartnerFilterLevel('all');
                    setPartnerFilterMethod('all');
                    setPartnerFilterStatus('all');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
              <button
                onClick={handleOpenCreatePartnerModal}
                className="px-4 py-2 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] transition-colors cursor-pointer"
              >
                Đăng ký tìm bạn học
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map((partner) => {
              const isOwner = Boolean(
                (user?.id && partner.userId && String(user.id) === String(partner.userId)) ||
                  partner.isMyPartnerPost
              );
              const isAdmin = user?.role === 'admin';

              return (
                <div
                  key={partner.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#131B24] border shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between ${
                    partner.isActive === false
                      ? 'border-dashed border-slate-300 dark:border-slate-700 opacity-80'
                      : isOwner
                        ? 'border-emerald-300 dark:border-emerald-700'
                        : 'border-[#F1E5D8] dark:border-[#2B3A4F]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706] font-black text-sm flex items-center justify-center border border-[#F4B942]/40 shrink-0">
                          {partner.initial || 'H'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-[#243447] dark:text-white truncate">{partner.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] shrink-0">
                              {partner.level}
                            </span>
                            {partner.isActive === false ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shrink-0">
                                Tạm ngưng
                              </span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Đang tìm bạn" />
                            )}
                          </div>
                          <p className="text-xs text-[#748092] mt-0.5 truncate">{partner.goal}</p>
                        </div>
                      </div>

                      {/* Toolbar hành động: Chủ sở hữu hoặc Admin */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isOwner && (
                          <>
                            <button
                              onClick={() => handleTogglePartnerStatus(partner)}
                              className="text-[#748092] hover:text-[#45B97C] p-1 cursor-pointer transition-colors"
                              title={partner.isActive ? 'Tạm ngưng tìm bạn' : 'Mở lại tìm bạn'}
                            >
                              {partner.isActive ? <EyeOff size={13} className="text-amber-500" /> : <Eye size={13} className="text-emerald-500" />}
                            </button>
                            <button
                              onClick={() => handleOpenEditPartnerModal(partner)}
                              className="text-[#748092] hover:text-[#45B97C] p-1 cursor-pointer transition-colors"
                              title="Chỉnh sửa hồ sơ"
                            >
                              <Edit3 size={13} />
                            </button>
                          </>
                        )}

                        {(isOwner || isAdmin) && (
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                            className="text-[#748092] hover:text-red-500 p-1 cursor-pointer transition-colors"
                            title={isAdmin && !isOwner ? 'Quản trị viên xóa tin vi phạm' : 'Hủy tin tìm bạn'}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Thông tin kỹ năng & thời gian */}
                    {(partner.skills || partner.dailyTime) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#748092] dark:text-[#94A3B8]">
                        {partner.skills && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                            <Target size={11} className="text-[#E85D3F]" />
                            <span>{partner.skills}</span>
                          </span>
                        )}
                        {partner.dailyTime && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                            <Clock size={11} className="text-[#45B97C]" />
                            <span>{partner.dailyTime}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Contact Preview Strip */}
                    <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#E85D3F] uppercase block">
                          {partner.contactMethod || 'Liên hệ'}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#243447] dark:text-white truncate block">
                          {partner.isContactPublic === false && !isOwner
                            ? 'Thông tin bảo mật'
                            : (partner.contactInfo || 'Chưa cung cấp')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {partner.contactInfo && (partner.isContactPublic !== false || isOwner) && (
                          <>
                            <button
                              onClick={() => handleCopyContact(partner.contactInfo)}
                              className="p-1.5 rounded-lg bg-white dark:bg-[#131B24] text-[#748092] hover:text-[#E85D3F] transition-colors cursor-pointer"
                              title="Sao chép"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenContactLink(partner.contactMethod, partner.contactInfo)}
                              className="p-1.5 rounded-lg bg-white dark:bg-[#131B24] text-[#748092] hover:text-[#45B97C] transition-colors cursor-pointer"
                              title="Mở liên hệ trực tiếp"
                            >
                              <ExternalLink size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
                    {partner.qrImage ? (
                      <button
                        onClick={() => {
                          playClickSound();
                          setZoomImageModal({ url: partner.qrImage, title: `Mã QR kết bạn - ${partner.name}` });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#45B97C] text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode size={13} />
                        <span>Mã QR</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#748092]">Sẵn sàng kết nối</span>
                    )}

                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveContactModal(partner);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function StudyPartnerModals({
  user,
  isPartnerModalOpen,
  setIsPartnerModalOpen,
  editingPartnerId,
  partnerForm,
  setPartnerForm,
  handleSavePartner,
  activeContactModal,
  setActiveContactModal,
  handleCopyContact,
  handleOpenContactLink,
  zoomImageModal,
  setZoomImageModal,
  partnerModalPanelClassName = 'bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto',
}) {
  return (
    <>
      {/* Modal: Đăng tin / Chỉnh sửa hồ sơ bạn học */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={partnerModalPanelClassName}>
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <h3 className="text-base font-bold text-[#243447] dark:text-white flex items-center gap-2">
                {editingPartnerId ? <Edit3 size={18} className="text-[#45B97C]" /> : <Users size={18} className="text-[#45B97C]" />}
                <span>{editingPartnerId ? 'Chỉnh sửa hồ sơ tìm bạn cùng tiến' : 'Đăng tin tìm bạn luyện nói 1-1'}</span>
              </h3>
              <button
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Họ tên hoặc biệt danh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Nam"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Cấp độ mục tiêu
                  </label>
                  <select
                    value={partnerForm.level}
                    onChange={(e) => setPartnerForm({ ...partnerForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {PARTNER_LEVEL_OPTIONS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Kênh liên hệ
                  </label>
                  <select
                    value={partnerForm.contactMethod}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {PARTNER_CONTACT_METHODS.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Thông tin liên hệ (SĐT / Link / ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0912.xxx.xxx hoặc @nam_chinese"
                  value={partnerForm.contactInfo}
                  onChange={(e) => setPartnerForm({ ...partnerForm, contactInfo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Thời gian học phù hợp
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tối 20h - 21h"
                    value={partnerForm.dailyTime}
                    onChange={(e) => setPartnerForm({ ...partnerForm, dailyTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                    Kỹ năng rèn luyện
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Luyện khẩu ngữ HSK"
                    value={partnerForm.skills}
                    onChange={(e) => setPartnerForm({ ...partnerForm, skills: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243447] dark:text-white mb-1">
                  Mục tiêu luyện tập
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Luyện nói 30p mỗi tối, sửa thanh điệu cho nhau"
                  value={partnerForm.goal}
                  onChange={(e) => setPartnerForm({ ...partnerForm, goal: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#45B97C]"
                />
              </div>

              {/* Tùy chọn quyền riêng tư & hiển thị */}
              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#243447] dark:text-white">
                  <input
                    type="checkbox"
                    checked={partnerForm.isContactPublic}
                    onChange={(e) => setPartnerForm({ ...partnerForm, isContactPublic: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-[#45B97C] focus:ring-0 cursor-pointer"
                  />
                  <span>Công khai thông tin liên hệ trong danh sách</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#243447] dark:text-white">
                  <input
                    type="checkbox"
                    checked={partnerForm.isActive}
                    onChange={(e) => setPartnerForm({ ...partnerForm, isActive: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-[#45B97C] focus:ring-0 cursor-pointer"
                  />
                  <span>Hiển thị hồ sơ tìm bạn học (Bỏ chọn để tạm ngưng)</span>
                </label>
              </div>

              {/* Tải ảnh mã QR */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#45B97C]" />
                    <span>Mã QR kết bạn (Zalo / WeChat - Tùy chọn)</span>
                  </label>
                  {partnerForm.qrImage && (
                    <button
                      type="button"
                      onClick={() => setPartnerForm((prev) => ({ ...prev, qrImage: '' }))}
                      className="text-[10px] text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 size={11} />
                      <span>Xóa ảnh QR</span>
                    </button>
                  )}
                </div>

                {partnerForm.qrImage ? (
                  <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center gap-3">
                    <img
                      src={partnerForm.qrImage}
                      alt="Mã QR xem trước"
                      className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-[#F1E5D8] shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#243447] dark:text-white truncate">Đã đính kèm ảnh mã QR</p>
                      <p className="text-[10px] text-[#748092]">Bạn bè có thể quét trực tiếp để kết bạn nhanh</p>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#45B97C] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#748092] dark:text-[#94A3B8] group-hover:text-[#45B97C]">
                      <QrCode size={18} className="text-[#45B97C]" />
                      <span>Tải ảnh mã QR (Zalo, WeChat,...) từ máy</span>
                    </div>
                    <span className="text-[10px] text-[#748092] mt-0.5">Hỗ trợ PNG, JPG (Tối đa 10MB, tự động nén tối ưu)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                          alert('Kích thước ảnh tối đa 10MB');
                          return;
                        }
                        try {
                          const dataUrl = await compressImageFile(file, 600, 600);
                          setPartnerForm((prev) => ({ ...prev, qrImage: dataUrl }));
                          playClickSound();
                        } catch {
                          alert('Không thể xử lý ảnh này, vui lòng thử lại.');
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#45B97C] hover:bg-[#3AA56E] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  {editingPartnerId ? 'Lưu thay đổi' : 'Đăng tin ngay (+15 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem thông tin liên hệ của bạn học */}
      {activeContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EBF8F2] dark:bg-[#162B21] text-[#45B97C] font-black text-xl flex items-center justify-center mx-auto border-2 border-[#45B97C]">
              {activeContactModal.initial || 'H'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-base font-bold text-[#243447] dark:text-white">
                  {activeContactModal.name}
                </h3>
                {activeContactModal.isActive === false ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">
                    Tạm ngưng
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                    Đang tìm bạn
                  </span>
                )}
              </div>
              <p className="text-xs text-[#E85D3F] font-bold">Mục tiêu: {activeContactModal.level || 'HSK 1'}</p>
              <p className="text-xs text-[#748092] dark:text-[#94A3B8]">{activeContactModal.goal || 'Luyện phản xạ giao tiếp'}</p>
            </div>

            {(activeContactModal.skills || activeContactModal.dailyTime) && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#748092] dark:text-[#94A3B8]">
                {activeContactModal.skills && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <Target size={12} className="text-[#E85D3F]" />
                    <span>{activeContactModal.skills}</span>
                  </span>
                )}
                {activeContactModal.dailyTime && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
                    <Clock size={12} className="text-[#45B97C]" />
                    <span>{activeContactModal.dailyTime}</span>
                  </span>
                )}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between gap-2">
              <div className="text-left min-w-0">
                <span className="text-[10px] text-[#748092] block font-bold uppercase">
                  {activeContactModal.contactMethod || 'Kênh liên hệ'}
                </span>
                <span className="text-xs font-mono font-bold text-[#243447] dark:text-white truncate block">
                  {activeContactModal.isContactPublic === false && !activeContactModal.isMyPartnerPost && activeContactModal.userId !== user?.id
                    ? 'Thông tin liên hệ bảo mật'
                    : (activeContactModal.contactInfo || activeContactModal.contact || 'Chưa cung cấp')}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {(activeContactModal.isContactPublic !== false || activeContactModal.isMyPartnerPost || activeContactModal.userId === user?.id) && (
                  <>
                    <button
                      onClick={() => handleCopyContact(activeContactModal.contactInfo || activeContactModal.contact)}
                      className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#E85D3F] hover:bg-[#FDEEEB] transition-colors cursor-pointer"
                      title="Sao chép"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenContactLink(activeContactModal.contactMethod, activeContactModal.contactInfo || activeContactModal.contact)}
                      className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#45B97C] hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Mở liên kết kết bạn"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {activeContactModal.qrImage && (
              <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#243447] dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <QrCode size={14} className="text-[#45B97C]" />
                    <span>Mã QR kết bạn</span>
                  </span>
                  <button
                    onClick={() => setZoomImageModal({ url: activeContactModal.qrImage, title: `Mã QR kết bạn - ${activeContactModal.name}` })}
                    className="text-[10px] text-[#45B97C] hover:underline cursor-pointer"
                  >
                    Phóng to
                  </button>
                </div>
                <div
                  onClick={() => setZoomImageModal({ url: activeContactModal.qrImage, title: `Mã QR kết bạn - ${activeContactModal.name}` })}
                  className="p-2 bg-white rounded-xl border border-[#F1E5D8] cursor-pointer hover:shadow-md transition-shadow group flex items-center justify-center"
                  title="Bấm để phóng to hoặc quét mã QR"
                >
                  <img
                    src={activeContactModal.qrImage}
                    alt="Mã QR kết bạn"
                    className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-[10px] text-[#748092]">Mở camera hoặc app {activeContactModal.contactMethod || 'Zalo'} để quét kết bạn</p>
              </div>
            )}

            <button
              onClick={() => setActiveContactModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#243447] dark:bg-[#334155] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal phóng to ảnh / Mã QR */}
      {zoomImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomImageModal(null)}
        >
          <div
            className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F1E5D8] dark:border-[#2B3A4F] pb-3">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-[#45B97C]" />
                <h4 className="text-sm font-bold text-[#243447] dark:text-white truncate">
                  {typeof zoomImageModal === 'object' ? zoomImageModal.title : 'Xem ảnh / Mã QR'}
                </h4>
              </div>
              <button
                onClick={() => setZoomImageModal(null)}
                className="p-1 rounded-lg text-[#748092] hover:text-[#243447] dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-[#FFF9F2] dark:bg-[#131B24] rounded-2xl flex items-center justify-center">
              <img
                src={typeof zoomImageModal === 'object' ? zoomImageModal.url : zoomImageModal}
                alt="Ảnh phóng to"
                className="max-h-[70dvh] w-auto max-w-full object-contain rounded-xl bg-white p-2 shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-[#748092]">
                Có thể quét trực tiếp bằng camera hoặc app
              </p>
              <a
                href={typeof zoomImageModal === 'object' ? zoomImageModal.url : zoomImageModal}
                download="hanzigo-qr-image.png"
                className="px-3 py-1.5 rounded-xl bg-[#45B97C] text-white text-xs font-bold hover:bg-[#3AA56E] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Download size={13} />
                <span>Tải ảnh về máy</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
