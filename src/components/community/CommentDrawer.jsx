import React from 'react';
import { RefreshCw, Edit3, Trash2, Flag, Send } from 'lucide-react';
import { POST_LIMITS } from './communityHelpers.js';

export default function CommentDrawer({
  postId,
  comments,
  isLoading,
  commentInput,
  onChangeCommentInput,
  isSubmitting,
  editingCommentId,
  setEditingCommentId,
  editCommentDraft,
  setEditCommentDraft,
  onAddComment,
  onSaveEditComment,
  onDeleteComment,
  onOpenReportModal,
  isImeEnterSubmit = (e) => e.key === 'Enter' && !e.nativeEvent?.isComposing && !e.isComposing,
}) {
  return (
    <div className="pt-3 border-t border-[#F1E5D8] dark:border-[#2B3A4F] space-y-3">
      {isLoading ? (
        <div className="py-4 text-center text-xs text-[#748092] flex items-center justify-center gap-2">
          <RefreshCw size={14} className="animate-spin text-[#E85D3F]" />
          <span>Đang tải bình luận...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] space-y-1"
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-[#243447] dark:text-white truncate">{c.author}</span>
                  {c.level && (
                    <span className="text-[10px] text-[#D97706] bg-[#FEF7E9] dark:bg-[#2D2619] px-1.5 py-0.5 rounded font-semibold shrink-0">{c.level}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[#748092]">{c.time}</span>
                  {c.isMyComment ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(c.id);
                          setEditCommentDraft(c.content || '');
                        }}
                        className="min-h-11 px-1.5 text-[#748092] hover:text-[#E85D3F] transition-colors cursor-pointer flex items-center"
                        title="Chỉnh sửa bình luận"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(postId, c.id)}
                        className="min-h-11 px-1.5 text-[#748092] hover:text-red-500 transition-colors cursor-pointer flex items-center"
                        title="Xóa bình luận"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenReportModal('comment', c.id, c)}
                      className="min-h-11 px-1.5 text-[#748092] hover:text-[#E85D3F] transition-colors cursor-pointer flex items-center"
                      title="Báo cáo bình luận vi phạm"
                    >
                      <Flag size={12} />
                    </button>
                  )}
                </div>
              </div>
              {editingCommentId === c.id ? (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={editCommentDraft}
                    maxLength={POST_LIMITS.COMMENT_MAX}
                    onChange={(e) => setEditCommentDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (isImeEnterSubmit(e)) {
                        onSaveEditComment(postId, c.id);
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-base sm:text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
                  />
                  <button
                    type="button"
                    onClick={() => onSaveEditComment(postId, c.id)}
                    className="min-h-11 px-3 rounded-xl bg-[#E85D3F] text-white font-bold text-xs cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditCommentDraft('');
                    }}
                    className="min-h-11 px-3 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] text-xs text-[#748092] cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#243447] dark:text-[#CBD5E1] leading-relaxed break-words">
                  {c.content}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#748092] italic">Chưa có bình luận nào. Hãy để lại ý kiến đầu tiên!</p>
      )}

      {/* Comment Input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Viết bình luận của bạn..."
          maxLength={POST_LIMITS.COMMENT_MAX}
          value={commentInput}
          onChange={(e) => onChangeCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (isImeEnterSubmit(e)) {
              onAddComment(postId);
            }
          }}
          disabled={isSubmitting}
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] disabled:opacity-50"
        />
        <button
          onClick={() => onAddComment(postId)}
          disabled={!commentInput?.trim() || isSubmitting}
          className="min-h-11 px-3.5 py-2 rounded-xl bg-[#E85D3F] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#D44C2E] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{isSubmitting ? 'Đang gửi...' : 'Gửi'}</span>
          <Send size={11} />
        </button>
      </div>
    </div>
  );
}
