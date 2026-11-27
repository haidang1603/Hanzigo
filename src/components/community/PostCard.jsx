import React from 'react';
import {
  CheckCircle,
  Pin,
  EyeOff,
  Edit3,
  Trash2,
  Flag,
  Volume2,
  QrCode,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';
import { POST_LIMITS, parseStructuredPostContent } from './communityHelpers.js';
import CommentDrawer from './CommentDrawer.jsx';

export default function PostCard({
  post,
  user,
  isExpanded,
  comments,
  isLoadingComments,
  isSubmittingComment,
  commentInput,
  onChangeCommentInput,
  isSolved,
  editingPostId,
  setEditingPostId,
  editPostDraft,
  setEditPostDraft,
  editingCommentId,
  setEditingCommentId,
  editCommentDraft,
  setEditCommentDraft,
  onModeratePost,
  onDeletePost,
  onSaveEditPost,
  onOpenReportModal,
  onSpeakChinesePost,
  onZoomImage,
  onToggleLike,
  onToggleComments,
  onToggleSolved,
  onToggleSave,
  onShareLink,
  onAddComment,
  onSaveEditComment,
  onDeleteComment,
  isImeEnterSubmit,
}) {
  const commentsCount = post.commentsCount ?? comments.length;
  const parsedPost = parseStructuredPostContent(post.content);
  const hasChinese = /[\u4e00-\u9fa5]/.test(post.content);
  const canModerate = user?.role === 'admin' || user?.role === 'teacher';

  const isBqt =
    (post.author || '').includes('Ban Quản Trị') ||
    post.level === 'Quản trị viên' ||
    post.level === 'BQT' ||
    post.avatar === '/hanzigo-logo.svg' ||
    (post.avatar && post.avatar.includes('photo-1534528741775-53994a69daeb'));

  return (
    <div
      className={`p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border shadow-sm space-y-4 transition-all ${
        post.isPinned
          ? 'border-[#E85D3F]/50 bg-gradient-to-br from-white to-[#FEF7E9]/40 dark:from-[#1E293B] dark:to-[#2D2619]/30'
          : 'border-[#F1E5D8] dark:border-[#2B3A4F]'
      }`}
    >
      {/* Author & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {isBqt ? (
            <div
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-bold shadow-md shadow-[#E85D3F]/25 shrink-0 border border-[#E85D3F] select-none"
              title="Ban Quản Trị HanziGo"
            >
              <span className="font-['Noto_Serif_SC'] text-xl font-black">汉</span>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#F4B942] rounded-full border-2 border-white dark:border-[#1E293B]" />
            </div>
          ) : post.avatar ? (
            post.avatar.length <= 4 ? (
              <div className="w-10 h-10 rounded-full bg-[#FFF5F2] dark:bg-[#2C1D1A] border border-[#E85D3F] flex items-center justify-center text-lg shadow-sm">
                {post.avatar}
              </div>
            ) : (
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-[#E85D3F]" />
            )
          ) : (
            <div
              className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border ${
                post.isPinned
                  ? 'bg-[#E85D3F] text-white border-[#E85D3F]'
                  : 'bg-[#FDEEEB] dark:bg-[#2D1E1B] text-[#E85D3F] border-[#E85D3F]/40'
              }`}
            >
              {post.initial || (post.author ? post.author.charAt(0).toUpperCase() : 'H')}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-[#243447] dark:text-white truncate">
                {post.author}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  post.isPinned
                    ? 'bg-[#E85D3F] text-white'
                    : 'bg-[#FEF7E9] dark:bg-[#2D2619] text-[#D97706]'
                }`}
              >
                {parsedPost.hskLevel || post.level}
              </span>
            </div>
            <p className="text-[11px] text-[#748092] flex items-center gap-1">
              {post.isPinned && <Pin size={10} className="text-[#E85D3F]" />}
              <span>{post.time}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {isSolved && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Đã giải đáp</span>
            </span>
          )}

          <span className="text-xs font-bold text-[#E85D3F] bg-[#FDEEEB] dark:bg-[#2D1E1B] px-2.5 py-1 rounded-lg">
            {post.tag}
          </span>
          {canModerate && (
            <>
              <button
                type="button"
                onClick={() => onModeratePost(post.id, post.isPinned ? 'unpin' : 'pin')}
                className="min-h-11 px-2 rounded-lg text-xs font-bold text-[#748092] hover:text-[#E85D3F] cursor-pointer"
                title={post.isPinned ? 'Bỏ ghim bài viết' : 'Ghim bài viết'}
              >
                <Pin size={14} />
              </button>
              <button
                type="button"
                onClick={() => onModeratePost(post.id, 'hide')}
                className="min-h-11 px-2 rounded-lg text-xs font-bold text-[#748092] hover:text-rose-500 cursor-pointer"
                title="Ẩn bài viết vi phạm"
              >
                <EyeOff size={14} />
              </button>
            </>
          )}
          {post.isMyPost ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditingPostId(post.id);
                  setEditPostDraft(post.content);
                }}
                className="min-h-11 p-2 rounded-lg text-[#748092] hover:text-[#E85D3F] cursor-pointer"
                title="Chỉnh sửa bài viết"
              >
                <Edit3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDeletePost(post.id)}
                className="min-h-11 p-2 rounded-lg text-[#748092] hover:text-red-500 cursor-pointer"
                title="Xóa bài viết của bạn"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onOpenReportModal('post', post.id, post)}
              className="min-h-11 p-2 rounded-lg text-[#748092] hover:text-[#E85D3F] cursor-pointer"
              title="Báo cáo bài viết vi phạm"
            >
              <Flag size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content (Pure React text rendering — Zero raw HTML injection) */}
      {editingPostId === post.id ? (
        <div className="space-y-2">
          <textarea
            rows={4}
            maxLength={POST_LIMITS.CONTENT_MAX}
            value={editPostDraft}
            onChange={(e) => setEditPostDraft(e.target.value)}
            className="w-full p-3 rounded-2xl border border-[#E85D3F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingPostId(null)}
              className="min-h-11 px-3 py-1.5 rounded-xl border border-[#F1E5D8] text-xs font-bold text-[#748092] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => onSaveEditPost(post.id)}
              className="min-h-11 px-4 py-1.5 rounded-xl bg-[#E85D3F] text-white text-xs font-bold cursor-pointer"
            >
              Lưu chỉnh sửa
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {parsedPost.title && (
            <h4 className="text-sm sm:text-base font-black text-[#243447] dark:text-white break-words">
              {parsedPost.title}
            </h4>
          )}
          {(parsedPost.chineseSnippet || parsedPost.pinyinSnippet) && (
            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-orange-200 dark:border-orange-900/40 space-y-1">
              {parsedPost.chineseSnippet && (
                <p className="text-base font-bold text-[#243447] dark:text-white break-words">
                  {parsedPost.chineseSnippet}
                </p>
              )}
              {parsedPost.pinyinSnippet && (
                <p className="text-xs font-semibold text-[#D97706] break-words">
                  {parsedPost.pinyinSnippet}
                </p>
              )}
            </div>
          )}
          <p className="text-xs sm:text-sm text-[#243447] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line break-words">
            {parsedPost.body}
          </p>

          {/* Audio reader button if post contains Chinese characters */}
          {hasChinese && (
            <button
              type="button"
              onClick={() => onSpeakChinesePost(post.content)}
              className="min-h-11 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#E85D3F] text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
              title="Nghe phát âm các từ chữ Hán trong bài viết"
            >
              <Volume2 size={13} />
              <span>Nghe phát âm chữ Hán</span>
            </button>
          )}
        </div>
      )}

      {/* Image / QR preview */}
      {post.image && (
        <div className="pt-1">
          <div className="relative inline-block group">
            <img
              src={post.image}
              alt="Ảnh đính kèm"
              onClick={() => onZoomImage(post.image)}
              className="max-h-64 sm:max-h-80 w-auto max-w-full rounded-2xl object-contain border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#0F172A] p-1.5 cursor-zoom-in group-hover:opacity-95 shadow-xs transition-all"
            />
            <button
              type="button"
              onClick={() => onZoomImage(post.image)}
              className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer shadow-md"
            >
              <QrCode size={12} />
              <span>Xem ảnh lớn / QR</span>
            </button>
          </div>
        </div>
      )}

      {/* Actions: Like, Comment, Save, Solved */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`min-h-11 px-2 flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
              post.liked ? 'text-[#E85D3F] font-bold' : 'hover:text-[#E85D3F]'
            }`}
          >
            <Heart size={16} className={post.liked ? 'fill-[#E85D3F]' : ''} />
            <span>{post.likes || 0}</span>
          </button>

          <button
            onClick={() => onToggleComments(post.id)}
            className="min-h-11 px-2 flex items-center gap-1.5 rounded-lg hover:text-[#243447] dark:hover:text-white transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>{commentsCount} bình luận</span>
          </button>

          {/* Solved toggle button for Q&A */}
          {post.tag === '#HoiDapNguPhap' && (
            <button
              onClick={() => onToggleSolved(post.id)}
              className={`min-h-11 px-2 text-[11px] font-semibold flex items-center gap-1 rounded-lg hover:text-emerald-600 transition-colors cursor-pointer ${
                isSolved ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              <CheckCircle size={14} />
              <span>{isSolved ? 'Đã giải đáp' : 'Chưa giải đáp'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(post.id)}
            className={`min-h-11 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              post.saved ? 'text-[#F4B942]' : 'hover:text-[#243447] dark:hover:text-white'
            }`}
            title="Lưu bài viết"
          >
            <Bookmark size={16} className={post.saved ? 'fill-[#F4B942]' : ''} />
          </button>
          <button
            onClick={() => {
              playClickSound();
              onShareLink(post.id);
            }}
            className="min-h-11 px-2.5 rounded-lg hover:text-[#243447] dark:hover:text-white cursor-pointer flex items-center justify-center"
            title="Chia sẻ"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {isExpanded && (
        <CommentDrawer
          postId={post.id}
          comments={comments}
          isLoading={isLoadingComments}
          commentInput={commentInput}
          onChangeCommentInput={onChangeCommentInput}
          isSubmitting={isSubmittingComment}
          editingCommentId={editingCommentId}
          setEditingCommentId={setEditingCommentId}
          editCommentDraft={editCommentDraft}
          setEditCommentDraft={setEditCommentDraft}
          onAddComment={onAddComment}
          onSaveEditComment={onSaveEditComment}
          onDeleteComment={onDeleteComment}
          onOpenReportModal={onOpenReportModal}
          isImeEnterSubmit={isImeEnterSubmit}
        />
      )}
    </div>
  );
}
