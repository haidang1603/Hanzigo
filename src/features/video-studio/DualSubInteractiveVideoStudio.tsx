import React, { useEffect, useMemo, useState } from 'react';
import { Video, Film, Link2, Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import {
  createCustomYouTubeVideo,
  deleteCustomYouTubeVideo,
  fetchYouTubeOEmbedMeta,
  getBuiltInVideos,
  listImmersionVideos,
  parseYouTubeVideoId,
  saveCustomYouTubeVideo,
  updateCustomYouTubeVideoSubtitles,
  type ImmersionVideo,
} from '../../services/videoStudioService.ts';
import { DualSubVideoPlayer } from './DualSubVideoPlayer.tsx';
import { VideoTranscriptSidebar } from './VideoTranscriptSidebar.tsx';
import { useUnifiedTools } from '../../core/ecosystem/UnifiedToolsContext.tsx';

interface DualSubInteractiveVideoStudioProps {
  user?: { id?: string | null } | null;
}

export const DualSubInteractiveVideoStudio: React.FC<DualSubInteractiveVideoStudioProps> = ({
  user,
}) => {
  const { openQuickDictionary, openQuickPronunciationModal } = useUnifiedTools();

  const [videos, setVideos] = useState<ImmersionVideo[]>(() => getBuiltInVideos());
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    () => getBuiltInVideos()[0]?.id || ''
  );
  const [activeCueIndex, setActiveCueIndex] = useState(0);

  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [rawSubtitlesInput, setRawSubtitlesInput] = useState('');
  const [showSubtitleInput, setShowSubtitleInput] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listImmersionVideos().then((loaded) => {
      if (!active) return;
      setVideos(loaded);
      if (loaded.length > 0) {
        setSelectedVideoId((prev) => prev || loaded[0].id);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const currentVideo = useMemo(() => {
    if (videos.length === 0) return null;
    return videos.find((v) => v.id === selectedVideoId) || videos[0];
  }, [videos, selectedVideoId]);

  const handleAddYouTubeVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const videoId = parseYouTubeVideoId(youtubeUrlInput);
    if (!videoId) {
      setUrlError(
        'Link YouTube không hợp lệ. Hãy dán link dạng youtube.com/watch?v=..., youtu.be/..., hoặc youtube.com/shorts/...'
      );
      return;
    }

    setIsAdding(true);
    try {
      const meta = await fetchYouTubeOEmbedMeta(videoId);
      const newVideo = createCustomYouTubeVideo({
        videoId,
        title: customTitleInput.trim() || meta?.title,
        channelName: meta?.author_name || 'YouTube',
        thumbnailUrl: meta?.thumbnail_url,
        rawSubtitles: rawSubtitlesInput,
      });

      saveCustomYouTubeVideo(newVideo);
      const refreshed = await listImmersionVideos();
      setVideos(refreshed);
      setSelectedVideoId(newVideo.id);
      setActiveCueIndex(0);
      setYoutubeUrlInput('');
      setCustomTitleInput('');
      setRawSubtitlesInput('');
      setShowSubtitleInput(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    deleteCustomYouTubeVideo(videoId);
    const refreshed = await listImmersionVideos();
    setVideos(refreshed);
    if (selectedVideoId === videoId) {
      setSelectedVideoId(refreshed[0]?.id || '');
      setActiveCueIndex(0);
    }
  };

  const handleUpdateCurrentSubtitles = async (rawSubs: string) => {
    if (!currentVideo) return;
    updateCustomYouTubeVideoSubtitles(currentVideo.id, rawSubs);
    const refreshed = await listImmersionVideos();
    setVideos(refreshed);
    setActiveCueIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Studio Header & YouTube Link Input */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Dual-Sub Interactive Video Studio
              </h1>
              <p className="text-xs text-slate-500">
                Dán link video YouTube để học tiếng Trung với phụ đề tương tác, tra từ nhanh &amp; lưu Flashcard SRS
              </p>
            </div>
          </div>

          {currentVideo && (
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              {currentVideo.channel_name}
            </span>
          )}
        </div>

        {/* Paste YouTube Link Form */}
        <form onSubmit={handleAddYouTubeVideo} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={youtubeUrlInput}
                onChange={(e) => {
                  setYoutubeUrlInput(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                placeholder="Dán link video YouTube (VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowSubtitleInput((v) => !v)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-semibold transition ${
                showSubtitleInput
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {showSubtitleInput ? 'Ẩn ô phụ đề' : 'Kèm phụ đề (tuỳ chọn)'}
            </button>

            <button
              type="submit"
              disabled={isAdding || !youtubeUrlInput.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-2.5 text-xs font-semibold text-white transition"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Đang tải...' : 'Mở video'}
            </button>
          </div>

          {showSubtitleInput && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <input
                type="text"
                value={customTitleInput}
                onChange={(e) => setCustomTitleInput(e.target.value)}
                placeholder="Tiêu đề video (tự động lấy từ YouTube nếu để trống)"
                className="sm:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <textarea
                value={rawSubtitlesInput}
                onChange={(e) => setRawSubtitlesInput(e.target.value)}
                rows={4}
                placeholder="Dán phụ đề .srt / .vtt hoặc từng dòng tiếng Trung (VD: 你好 | Xin chào)..."
                className="sm:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {urlError && (
            <p className="text-xs font-medium text-rose-600">{urlError}</p>
          )}
        </form>

        {/* Saved YouTube Videos Pills */}
        {videos.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {videos.map((vid) => {
              const active = currentVideo?.id === vid.id;
              return (
                <div
                  key={vid.id}
                  className={`group inline-flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${
                    active
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVideoId(vid.id);
                      setActiveCueIndex(0);
                    }}
                    className="text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-rose-600">
                        YouTube
                      </span>
                      <span className="text-xs font-bold max-w-[220px] truncate">{vid.title_zh}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {vid.channel_name} · {vid.subtitles.length} câu phụ đề
                    </div>
                  </button>

                  {vid.id.startsWith('yt-') && (
                    <button
                      type="button"
                      onClick={() => void handleDeleteVideo(vid.id)}
                      title="Xóa video này"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Studio Area or Empty State */}
      {currentVideo ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <DualSubVideoPlayer
              video={currentVideo}
              user={user}
              onOpenDictionary={(hanzi) => openQuickDictionary(hanzi)}
              onOpenPronunciation={(hanzi, pinyin) => openQuickPronunciationModal(hanzi, pinyin)}
              onCueChange={(idx) => setActiveCueIndex(idx)}
            />
          </div>

          <div className="lg:col-span-4">
            <VideoTranscriptSidebar
              subtitles={currentVideo.subtitles}
              activeCueIndex={activeCueIndex}
              onSelectCue={(idx) => setActiveCueIndex(idx)}
              onOpenPronunciation={(hanzi, pinyin) => openQuickPronunciationModal(hanzi, pinyin)}
              onUpdateSubtitles={
                currentVideo.id.startsWith('yt-')
                  ? (rawSubs) => void handleUpdateCurrentSubtitles(rawSubs)
                  : undefined
              }
              videoId={currentVideo.id}
              videoTitle={currentVideo.title_vi || currentVideo.title_zh}
              thumbnailUrl={currentVideo.thumbnail_url}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Chưa có video nào được thêm</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hãy dán link video YouTube tiếng Trung bất kỳ vào ô phía trên để phát video ngay, kèm phụ đề tương tác nếu muốn.
          </p>
        </div>
      )}
    </div>
  );
};
