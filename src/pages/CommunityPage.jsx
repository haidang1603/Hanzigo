import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Users,
  Trophy,
  Flame,
  Plus,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import ReportModal from '../components/community/ReportModal';
import LeaderboardView from '../components/learning/LeaderboardView';
import { playClickSound } from '../utils/audio';
import {
  getCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  moderateCommunityPost,
  getPostComments,
  createCommunityComment,
  updateCommunityComment,
  deleteCommunityComment,
  togglePostReaction,
  getStudyPartnersFromDb,
  addStudyPartnerToDb,
  updateStudyPartnerInDb,
  toggleStudyPartnerStatusInDb,
  deleteStudyPartnerFromDb,
  subscribeToCommunityRealtime,
} from '../services/communityService';
import { getLocalDateString } from '../utils/gamification';
import { useCommunityFeed } from '../components/community/hooks/useCommunityFeed.js';
import CommunityFilterBar from '../components/community/CommunityFilterBar.jsx';
import PostComposer from '../components/community/PostComposer.jsx';
import PostCard from '../components/community/PostCard.jsx';
import {
  StudyPartnerList,
  StudyPartnerModals,
} from '../components/community/StudyPartnerList.jsx';
import {
  CommunityChallengeView,
  CommunityRightSidebar,
} from '../components/community/CommunitySidebarAndChallenge.jsx';

export { sanitizePublicDisplayName } from '../components/community/communityHelpers.js';

const PARTNER_MODAL_PANEL_CLASS =
  'bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl space-y-4 max-h-[90dvh] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-y-auto';

const isImeEnterSubmit = (e) =>
  e.key === 'Enter' && !e.nativeEvent?.isComposing && !e.isComposing;

// Deprecated LocalStorage persistence for feed posts (Supabase is Single Source of Truth)
export default function CommunityPage({ user, setActiveTab, initialView = 'feed' }) {
  const [communityView, setCommunityView] = useState(() => {
    if (['feed', 'leaderboard', 'partners', 'challenge'].includes(initialView)) {
      return initialView;
    }
    try {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('leaderboard')) return 'leaderboard';
      if (hash.includes('partners')) return 'partners';
      if (hash.includes('challenge')) return 'challenge';
    } catch {}
    return 'feed';
  });

  useEffect(() => {
    if (['feed', 'leaderboard', 'partners', 'challenge'].includes(initialView)) {
      setCommunityView(initialView);
    }
  }, [initialView]);

  const feed = useCommunityFeed({
    user,
    getTodayDateKey: () => getLocalDateString(),
    api: {
      getCommunityPosts,
      getCommunityPostById,
      createCommunityPost,
      updateCommunityPost,
      deleteCommunityPost,
      moderateCommunityPost,
      loadPostComments: (idStr) => getPostComments(idStr),
      createComment: (idStr, text) => createCommunityComment(idStr, text),
      updateCommunityComment,
      deleteComment: (commentId) => deleteCommunityComment(commentId),
      toggleLikeReaction: async (idStr) => {
        const res = await togglePostReaction(idStr, 'like');
        if (res?.success && res.data) {
          return {
            success: true,
            data: {
              action: res.data.action,
              likes_count: res.data.likes_count,
            },
          };
        }
        return res;
      },
      getStudyPartnersFromDb,
      addStudyPartnerToDb,
      updateStudyPartnerInDb,
      toggleStudyPartnerStatusInDb,
      deleteStudyPartnerFromDb,
      subscribeToCommunityRealtime,
    },
    realtimeDispatcher: (event, handlers) => {
      if (event.type === 'POST_CHANGE') {
        handlers.handlePostRealtime(event.payload);
      } else if (event.type === 'COMMENT_CHANGE') {
        handlers.handleCommentRealtime(event.payload);
      } else if (event.type === 'REACTION_CHANGE') {
        handlers.handleReactionRealtime(event.payload);
      } else if (event.type === 'PARTNER_CHANGE') {
        handlers.handlePartnerRealtime(event.payload);
      }
    },
  });

  const {
    posts,
    hasMorePosts,
    nextPostCursor,
    isLoadingPosts,
    isLoadingMorePosts,
    postCommentsMap,
    loadingCommentsMap,
    submittingCommentMap,
    reportModalState,
    setReportModalState,
    solvedPostIds,
    studyPartners,
    challengeData,
    completedLessonsCount,
    isCloudSynced,
    isRefreshing,
    selectedTag,
    setSelectedTag,
    selectedHskGroup,
    setSelectedHskGroup,
    postSort,
    setPostSort,
    newPostTitle,
    setNewPostTitle,
    newPostContent,
    setNewPostContent,
    newPostTag,
    setNewPostTag,
    newPostHskLevel,
    setNewPostHskLevel,
    newPostChinese,
    setNewPostChinese,
    newPostPinyin,
    setNewPostPinyin,
    showSnippetInputs,
    setShowSnippetInputs,
    postContactMethod,
    setPostContactMethod,
    postContactInfo,
    setPostContactInfo,
    postImage,
    setPostImage,
    searchTerm,
    setSearchTerm,
    editingPostId,
    setEditingPostId,
    editPostDraft,
    setEditPostDraft,
    editingCommentId,
    setEditingCommentId,
    editCommentDraft,
    setEditCommentDraft,
    partnerFilterLevel,
    setPartnerFilterLevel,
    partnerFilterMethod,
    setPartnerFilterMethod,
    partnerFilterStatus,
    setPartnerFilterStatus,
    partnerSearchTerm,
    setPartnerSearchTerm,
    showPartnerFilters,
    setShowPartnerFilters,
    isLoadingPartners,
    expandedComments,
    commentInputs,
    setCommentInputs,
    isPartnerModalOpen,
    setIsPartnerModalOpen,
    editingPartnerId,
    partnerForm,
    setPartnerForm,
    activeContactModal,
    setActiveContactModal,
    zoomImageModal,
    setZoomImageModal,
    toastMessage,
    totalUserXp,
    currentStreak,
    rankTier,
    isCheckedInToday,
    filteredPosts,
    myPartnerProfile,
    filteredPartners,
    activePartnerFilterCount,
    showToast,
    handleOpenReportModal,
    handleRefreshCloud,
    handleLoadMorePosts,
    handleShareAchievement,
    handleCreatePost,
    handleSaveEditPost,
    handleModeratePost,
    handleApplyPrompt,
    handleToggleLike,
    handleToggleSave,
    handleToggleSolved,
    handleSpeakChinesePost,
    handleDeletePost,
    handleToggleComments,
    handleAddComment,
    handleSaveEditComment,
    handleDeleteComment,
    handleJoinChallenge,
    handleCheckIn,
    handleOpenCreatePartnerModal,
    handleOpenEditPartnerModal,
    handleTogglePartnerStatus,
    handleSavePartner,
    handleDeletePartner,
    handleOpenContactLink,
    handleCopyContact,
  } = feed;

  return (
    <div
      data-cursor={nextPostCursor || ''}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10 animate-in fade-in duration-300"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#243447] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <CheckCircle2 size={16} className="text-[#45B97C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO HEADER BANNER (ASIAN-MODERN PALETTE) */}
      <div className="relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#E85D3F] via-[#CB4529] to-[#991B1B] text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-md border border-white/20">
              <Users size={13} className="text-amber-300" />
              <span>Không gian Học tập &amp; Giao lưu HanziGo</span>
            </div>

            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight font-['Noto_Serif_SC'] leading-tight">
              Cộng Đồng Người Học HanziGo
            </h1>

            <p className="text-xs text-white/90 leading-relaxed font-medium line-clamp-1 sm:line-clamp-2">
              Hỏi đáp ngữ pháp, thảo luận kinh nghiệm thi HSK, ghép đôi luyện nói 1-1 và vinh danh bảng vàng cao thủ chữ Hán.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1">
                💬 <strong>{posts.length}</strong> bài thảo luận
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1">
                🤝 <strong>{studyPartners.length}</strong> học viên tìm bạn
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/25 font-bold backdrop-blur-md border border-white/10 flex items-center gap-1 text-amber-300">
                🔥 <strong>{totalUserXp} XP</strong> tích lũy
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center lg:justify-end gap-2 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setIsPartnerModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Users size={15} />
              <span>Tìm bạn luyện nói</span>
            </button>

            <button
              onClick={handleRefreshCloud}
              disabled={isRefreshing}
              title="Đồng bộ dữ liệu cộng đồng mới nhất từ Supabase"
              className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Đang tải...' : isCloudSynced ? 'Đã đồng bộ' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Chinese watermark */}
        <div className="absolute right-4 -bottom-4 font-['Noto_Serif_SC'] text-6xl sm:text-7xl font-black text-white/10 select-none pointer-events-none">
          志同道合
        </div>
      </div>

      {/* 2. COMMUNITY NAVIGATION SWITCHER (4 VIEWS) */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs max-w-2xl mx-auto overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setCommunityView('feed');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'feed'
              ? 'bg-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <MessageCircle size={15} />
          <span>Diễn đàn thảo luận</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('leaderboard');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Trophy size={15} className={communityView === 'leaderboard' ? 'text-white' : 'text-amber-500'} />
          <span>Bảng Vàng XP</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('partners');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'partners'
              ? 'bg-[#45B97C] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>Ghép đôi 1-1 ({studyPartners.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setCommunityView('challenge');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            communityView === 'challenge'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
          }`}
        >
          <Flame size={15} />
          <span>Thử thách 21 ngày</span>
        </button>
      </div>

      {/* VIEW: LEADERBOARD */}
      {communityView === 'leaderboard' && (
        <LeaderboardView user={user} onNavigateTab={setActiveTab} />
      )}

      {/* VIEW: STUDY PARTNERS MATCHING */}
      {communityView === 'partners' && (
        <StudyPartnerList
          user={user}
          studyPartners={studyPartners}
          filteredPartners={filteredPartners}
          myPartnerProfile={myPartnerProfile}
          isLoadingPartners={isLoadingPartners}
          partnerSearchTerm={partnerSearchTerm}
          setPartnerSearchTerm={setPartnerSearchTerm}
          showPartnerFilters={showPartnerFilters}
          setShowPartnerFilters={setShowPartnerFilters}
          activePartnerFilterCount={activePartnerFilterCount}
          partnerFilterLevel={partnerFilterLevel}
          setPartnerFilterLevel={setPartnerFilterLevel}
          partnerFilterMethod={partnerFilterMethod}
          setPartnerFilterMethod={setPartnerFilterMethod}
          partnerFilterStatus={partnerFilterStatus}
          setPartnerFilterStatus={setPartnerFilterStatus}
          handleOpenCreatePartnerModal={handleOpenCreatePartnerModal}
          handleOpenEditPartnerModal={handleOpenEditPartnerModal}
          handleTogglePartnerStatus={handleTogglePartnerStatus}
          handleDeletePartner={handleDeletePartner}
          handleCopyContact={handleCopyContact}
          handleOpenContactLink={handleOpenContactLink}
          setZoomImageModal={setZoomImageModal}
          setActiveContactModal={setActiveContactModal}
          renderMobileFilterToggle={({
            showPartnerFilters: open,
            togglePartnerFilters,
            activePartnerFilterCount: count,
          }) => (
            <button
              type="button"
              onClick={togglePartnerFilters}
              className={`sm:hidden min-h-11 px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                open || count > 0
                  ? 'bg-[#45B97C]/15 border-[#45B97C]/40 text-[#45B97C]'
                  : 'bg-[#FFF9F2] dark:bg-[#131B24] border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white'
              }`}
            >
              <Filter size={14} />
              <span>Bộ lọc</span>
              {count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#45B97C] text-white text-[10px] font-black">
                  {count}
                </span>
              )}
            </button>
          )}
        />
      )}

      {/* VIEW: 21-DAY CHALLENGE & ENGINE */}
      {communityView === 'challenge' && (
        <CommunityChallengeView
          user={user}
          challengeData={challengeData}
          isCheckedInToday={isCheckedInToday}
          handleJoinChallenge={handleJoinChallenge}
          handleCheckIn={handleCheckIn}
        />
      )}

      {/* VIEW: MAIN FORUM FEED */}
      {communityView === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <PostComposer
              user={user}
              newPostTitle={newPostTitle}
              setNewPostTitle={setNewPostTitle}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              newPostTag={newPostTag}
              setNewPostTag={setNewPostTag}
              newPostHskLevel={newPostHskLevel}
              setNewPostHskLevel={setNewPostHskLevel}
              newPostChinese={newPostChinese}
              setNewPostChinese={setNewPostChinese}
              newPostPinyin={newPostPinyin}
              setNewPostPinyin={setNewPostPinyin}
              showSnippetInputs={showSnippetInputs}
              setShowSnippetInputs={setShowSnippetInputs}
              postContactMethod={postContactMethod}
              setPostContactMethod={setPostContactMethod}
              postContactInfo={postContactInfo}
              setPostContactInfo={setPostContactInfo}
              postImage={postImage}
              setPostImage={setPostImage}
              handleShareAchievement={handleShareAchievement}
              handleApplyPrompt={handleApplyPrompt}
              handleCreatePost={handleCreatePost}
            />

            <CommunityFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              selectedHskGroup={selectedHskGroup}
              setSelectedHskGroup={setSelectedHskGroup}
              postSort={postSort}
              setPostSort={setPostSort}
            />

            {/* 4. Posts Feed List */}
            <div className="space-y-4">
              {isLoadingPosts ? (
                <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3 shadow-sm">
                  <RefreshCw size={28} className="mx-auto text-[#E85D3F] animate-spin" />
                  <p className="text-sm font-bold text-[#243447] dark:text-white">Đang tải bảng tin cộng đồng...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-center space-y-3 shadow-sm">
                  <MessageCircle size={40} className="mx-auto text-[#748092]/50" />
                  <p className="text-sm font-bold text-[#243447] dark:text-white">Chưa có bài viết nào trong chuyên mục này</p>
                  <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
                    Hãy trở thành người đầu tiên chia sẻ câu hỏi, mẫu câu HSK hoặc kinh nghiệm học tập với cộng đồng!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      document.getElementById('community-composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="min-h-11 px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] text-white font-bold text-xs shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Tạo bài thảo luận đầu tiên</span>
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    user={user}
                    isExpanded={Boolean(expandedComments[post.id])}
                    comments={postCommentsMap[post.id] || post.comments || []}
                    isLoadingComments={Boolean(loadingCommentsMap[post.id])}
                    isSubmittingComment={Boolean(submittingCommentMap[post.id])}
                    commentInput={commentInputs[post.id] || ''}
                    onChangeCommentInput={(value) =>
                      setCommentInputs({ ...commentInputs, [post.id]: value })
                    }
                    isSolved={Boolean(post.isSolved || solvedPostIds.includes(post.id))}
                    editingPostId={editingPostId}
                    setEditingPostId={setEditingPostId}
                    editPostDraft={editPostDraft}
                    setEditPostDraft={setEditPostDraft}
                    editingCommentId={editingCommentId}
                    setEditingCommentId={setEditingCommentId}
                    editCommentDraft={editCommentDraft}
                    setEditCommentDraft={setEditCommentDraft}
                    onModeratePost={handleModeratePost}
                    onDeletePost={handleDeletePost}
                    onSaveEditPost={handleSaveEditPost}
                    onOpenReportModal={handleOpenReportModal}
                    onSpeakChinesePost={handleSpeakChinesePost}
                    onZoomImage={setZoomImageModal}
                    onToggleLike={handleToggleLike}
                    onToggleComments={handleToggleComments}
                    onToggleSolved={handleToggleSolved}
                    onToggleSave={handleToggleSave}
                    onShareLink={(id) => {
                      navigator.clipboard.writeText(`${window.location.origin}/#${id}`);
                      showToast('Đã sao chép liên kết bài viết!');
                    }}
                    onAddComment={handleAddComment}
                    onSaveEditComment={handleSaveEditComment}
                    onDeleteComment={handleDeleteComment}
                    isImeEnterSubmit={isImeEnterSubmit}
                  />
                ))
              )}

              {/* Cursor-based Load More Button */}
              {hasMorePosts && (
                <div className="pt-2 text-center">
                  <button
                    onClick={handleLoadMorePosts}
                    disabled={isLoadingMorePosts}
                    className="px-6 py-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs font-bold text-[#E85D3F] hover:bg-[#FFF5F2] dark:hover:bg-[#2C1D1A] transition-all shadow-xs flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
                  >
                    {isLoadingMorePosts ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Đang tải thêm bài viết...</span>
                      </>
                    ) : (
                      <>
                        <span>Xem thêm bài viết cũ hơn</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <CommunityRightSidebar
            user={user}
            rankTier={rankTier}
            currentStreak={currentStreak}
            totalUserXp={totalUserXp}
            completedLessonsCount={completedLessonsCount}
            studyPartnersCount={studyPartners.length}
            setCommunityView={setCommunityView}
            onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
          />
        </div>
      )}

      <StudyPartnerModals
        user={user}
        isPartnerModalOpen={isPartnerModalOpen}
        setIsPartnerModalOpen={setIsPartnerModalOpen}
        editingPartnerId={editingPartnerId}
        partnerForm={partnerForm}
        setPartnerForm={setPartnerForm}
        handleSavePartner={handleSavePartner}
        activeContactModal={activeContactModal}
        setActiveContactModal={setActiveContactModal}
        handleCopyContact={handleCopyContact}
        handleOpenContactLink={handleOpenContactLink}
        zoomImageModal={zoomImageModal}
        setZoomImageModal={setZoomImageModal}
        partnerModalPanelClassName={PARTNER_MODAL_PANEL_CLASS}
      />

      {/* Student Report Modal */}
      <ReportModal
        isOpen={reportModalState.isOpen}
        onClose={() => setReportModalState((prev) => ({ ...prev, isOpen: false }))}
        targetType={reportModalState.targetType}
        targetId={reportModalState.targetId}
        targetContent={reportModalState.targetContent}
        targetAuthor={reportModalState.targetAuthor}
        user={user}
      />
    </div>
  );
}
