import React from 'react';
import {
  Volume2,
  Send,
  Sparkles,
  Trophy,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { playClickSound, speakChinese } from '../../utils/audio';
import {
  DAILY_DISCUSSION_TOPIC,
  QUICK_POST_PROMPTS,
  HSK_LEVEL_OPTIONS,
} from './communityConstants.js';
import { POST_LIMITS, compressImageFile } from './communityHelpers.js';

export default function PostComposer({
  user,
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
  handleShareAchievement,
  handleApplyPrompt,
  handleCreatePost,
}) {
  return (
    <>
      {/* 1. DAILY TOPIC STICKY CARD */}
      <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FEF7E9] via-white to-[#FFF9F2] dark:from-[#1E293B] dark:via-[#1B2636] dark:to-[#131B24] border-2 border-[#F4B942]/60 shadow-md space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#D97706] bg-[#FEF7E9] dark:bg-[#2D2619] px-2.5 py-0.5 rounded-full border border-[#F4B942]/40 flex items-center gap-1">
            <span>🏮</span>
            <span>Chủ Đề Đàm Thoại Hôm Nay</span>
          </span>
          <button
            onClick={() => speakChinese(DAILY_DISCUSSION_TOPIC.chinese)}
            className="text-xs text-[#E85D3F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Volume2 size={14} />
            <span>Nghe câu hỏi</span>
          </button>
        </div>

        <div>
          <h3 className="font-['Noto_Serif_SC'] text-lg sm:text-xl font-black text-[#243447] dark:text-white">
            {DAILY_DISCUSSION_TOPIC.chinese}
          </h3>
          <p className="text-xs font-semibold text-[#D97706] mt-0.5">{DAILY_DISCUSSION_TOPIC.pinyin}</p>
          <p className="text-xs text-[#748092] dark:text-[#94A3B8] mt-1">{DAILY_DISCUSSION_TOPIC.meaning}</p>
        </div>

        {/* Vocab Hints */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-[#748092]">Gợi ý từ:</span>
          {DAILY_DISCUSSION_TOPIC.vocabHints.map((vh, vIdx) => (
            <span
              key={vIdx}
              onClick={() => speakChinese(vh.zh)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#243447] dark:text-white hover:border-[#E85D3F] cursor-pointer"
              title={`Nhấp để nghe đọc: ${vh.py} (${vh.vi})`}
            >
              {vh.zh} ({vh.vi})
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-[#F1E5D8]/70 dark:border-[#2B3A4F]/70 flex items-center justify-between">
          <span className="text-[11px] text-[#748092]">Đăng bài trả lời để nhận +20 XP và cùng luyện phản xạ</span>
          <button
            onClick={() => {
              playClickSound();
              setNewPostTag('#ChuDeHomNay');
              setNewPostContent(`Trả lời chủ đề hôm nay (${DAILY_DISCUSSION_TOPIC.chinese}): `);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Send size={12} />
            <span>Tham gia trả lời</span>
          </button>
        </div>
      </div>

      {/* 2. Post Creation Box */}
      <div id="community-composer" className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#243447] dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#E85D3F]" />
            <span>Chia sẻ câu hỏi, bài viết HSK hoặc kinh nghiệm học tập</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareAchievement}
              className="min-h-11 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trophy size={13} />
              <span>Chia sẻ thành tích</span>
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              +20 XP khi đăng bài
            </span>
          </div>
        </div>

        {!user && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
            <span>Bạn đang xem ở chế độ Khách (chỉ đọc). Hãy đăng nhập để đăng bài, bình luận hoặc thích bài viết.</span>
          </div>
        )}

        {/* Quick Starter Prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#748092] uppercase tracking-wider block">
            ⚡ Gợi ý chủ đề nhanh (Nhấp để điền):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_POST_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPrompt(item)}
                className="min-h-11 px-2.5 py-1.5 rounded-xl text-xs bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] hover:border-[#E85D3F] hover:text-[#E85D3F] transition-all font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              maxLength={POST_LIMITS.TITLE_MAX}
              placeholder="Tiêu đề ngắn gọn (tùy chọn, tối đa 120 ký tự)..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
            />
            <select
              aria-label="Cấp độ HSK của bài viết"
              value={newPostHskLevel}
              onChange={(e) => setNewPostHskLevel(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F] cursor-pointer"
            >
              {HSK_LEVEL_OPTIONS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              rows={3}
              maxLength={POST_LIMITS.CONTENT_MAX}
              placeholder="Bạn đang vướng mắc điểm ngữ pháp nào, cần sửa câu tiếng Trung hay chia sẻ mẹo học? Hãy viết tại đây..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-4 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F] resize-none"
            />
            <div className="flex items-center justify-between text-[11px] text-[#748092] mt-1">
              <button
                type="button"
                onClick={() => setShowSnippetInputs((prev) => !prev)}
                className="font-bold text-[#E85D3F] hover:underline cursor-pointer"
              >
                {showSnippetInputs ? '− Ẩn khung Câu tiếng Trung cần hỏi / sửa' : '+ Thêm Câu tiếng Trung cần hỏi / sửa (Hanzi & Pinyin)'}
              </button>
              <span>{newPostContent.length}/{POST_LIMITS.CONTENT_MAX}</span>
            </div>
          </div>

          {showSnippetInputs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F]">
              <input
                type="text"
                maxLength={POST_LIMITS.SNIPPET_MAX}
                placeholder="Câu chữ Hán (ví dụ: 我昨天去了图书馆。)"
                value={newPostChinese}
                onChange={(e) => setNewPostChinese(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
              <input
                type="text"
                maxLength={POST_LIMITS.SNIPPET_MAX}
                placeholder="Pinyin kèm theo (tùy chọn)..."
                value={newPostPinyin}
                onChange={(e) => setNewPostPinyin(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-base sm:text-sm text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
              />
            </div>
          )}

          {/* Contact info strip */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-[#F1E5D8]/80 dark:border-[#2B3A4F]/80">
            <span className="text-[11px] font-bold text-[#748092] dark:text-[#94A3B8] shrink-0">
              Thông tin liên hệ (tùy chọn):
            </span>
            <div className="flex items-center gap-2 flex-1">
              <select
                value={postContactMethod}
                onChange={(e) => setPostContactMethod(e.target.value)}
                className="text-base sm:text-sm px-2.5 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F] shrink-0 cursor-pointer"
              >
                <option value="Zalo">Zalo</option>
                <option value="SĐT">SĐT</option>
                <option value="WeChat">WeChat</option>
                <option value="Telegram">Telegram</option>
                <option value="Facebook">Facebook</option>
              </select>
              <input
                type="text"
                placeholder="SĐT / Zalo / ID để bạn bè liên hệ trực tiếp..."
                value={postContactInfo}
                onChange={(e) => setPostContactInfo(e.target.value)}
                className="w-full text-base sm:text-sm px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white placeholder-[#748092] focus:outline-none focus:border-[#E85D3F]"
              />
            </div>
          </div>

          {/* Attached image preview */}
          {postImage && (
            <div className="relative inline-block mt-1">
              <div className="p-1 rounded-xl bg-white dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
                <img
                  src={postImage}
                  alt="Ảnh đính kèm"
                  className="h-20 w-auto rounded-lg object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setPostImage('')}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors cursor-pointer"
                title="Xóa ảnh"
              >
                <X size={11} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#748092] dark:text-[#94A3B8]">Chủ đề:</span>
                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                  className="text-base sm:text-sm px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#243447] dark:text-white font-medium focus:outline-none focus:border-[#E85D3F] cursor-pointer"
                >
                  <option value="#ThiHSK">Hỏi đáp HSK</option>
                  <option value="#SuaCauLuyenViet">Sửa câu / Luyện viết</option>
                  <option value="#MeoHocTuVung">Mẹo học từ vựng</option>
                  <option value="#KinhNghiemHoc">Chia sẻ kinh nghiệm</option>
                  <option value="#TimBanLuyenNoi">Tìm bạn học</option>
                  <option value="#HoiDapNguPhap">Ngữ pháp &amp; Mẫu câu</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2] dark:bg-[#131B24] text-[#748092] hover:text-[#E85D3F] hover:border-[#E85D3F] cursor-pointer font-medium transition-colors shrink-0">
                <ImageIcon size={14} className="text-[#E85D3F]" />
                <span>{postImage ? 'Đổi ảnh/QR' : 'Ảnh / Mã QR'}</span>
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
                      const dataUrl = await compressImageFile(file, 800, 800);
                      setPostImage(dataUrl);
                      playClickSound();
                    } catch {
                      alert('Không thể tải ảnh, vui lòng thử lại.');
                    }
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44C2E] disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Đăng bài (+20 XP)</span>
              <Send size={13} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
