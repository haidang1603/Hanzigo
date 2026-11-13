import React, { useEffect, useMemo, useState } from 'react';
import { Video, Film } from 'lucide-react';
import {
  getBuiltInVideos,
  listImmersionVideos,
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

  useEffect(() => {
    let active = true;
    listImmersionVideos().then((loaded) => {
      if (!active || loaded.length === 0) return;
      setVideos(loaded);
      setSelectedVideoId((prev) => prev || loaded[0].id);
    });
    return () => {
      active = false;
    };
  }, []);

  const currentVideo = useMemo(() => {
    return videos.find((v) => v.id === selectedVideoId) || videos[0];
  }, [videos, selectedVideoId]);

  if (!currentVideo) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Studio Header & Video Selector */}
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
                Học tiếng Trung qua video thực tế với phụ đề tương tác, auto-pause khi tra từ &amp; lưu Flashcard SRS kèm ngữ cảnh
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-emerald-600" />
            {currentVideo.channel_name} · {currentVideo.speech_speed}
          </span>
        </div>

        {/* Video Pills */}
        <div className="flex flex-wrap gap-2">
          {videos.map((vid) => {
            const active = vid.id === currentVideo.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => {
                  setSelectedVideoId(vid.id);
                  setActiveCueIndex(0);
                }}
                className={`rounded-2xl border px-3.5 py-2 text-left transition ${
                  active
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                    HSK {vid.hsk_level}
                  </span>
                  <span className="text-xs font-bold">{vid.title_zh}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{vid.title_vi}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Area: Video Player + Interactive Transcript */}
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
          />
        </div>
      </div>
    </div>
  );
};

