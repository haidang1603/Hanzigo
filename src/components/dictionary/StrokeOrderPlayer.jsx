import React, { useEffect, useRef, useState, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Eye, 
  EyeOff, 
  Grid, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Gauge
} from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export default function StrokeOrderPlayer({
  character,
  strokesCount = 6,
  onStrokeChange,
  onLoadSuccess,
  showGuideInitial = true
}) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(strokesCount);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showOutline, setShowOutline] = useState(showGuideInitial);
  const [gridStyle, setGridStyle] = useState('mizige'); // 'mizige', 'tianzige', 'none'
  const [strokeMedians, setStrokeMedians] = useState([]);

  // Initialize HanziWriter for the target character
  const initWriter = useCallback(() => {
    if (!containerRef.current || !character) return;

    containerRef.current.innerHTML = '';
    setIsLoading(true);
    setLoadError(false);
    setIsPlaying(false);
    setCurrentStroke(0);

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: 280,
        height: 280,
        padding: 20,
        showOutline: showOutline,
        strokeAnimationSpeed: playbackSpeed,
        delayBetweenStrokes: 220,
        strokeColor: '#E85D3F',
        outlineColor: '#CBD5E1',
        showCharacter: false,
        onLoadCharDataSuccess: (data) => {
          setIsLoading(false);
          setLoadError(false);
          if (data && data.strokes) {
            setTotalStrokes(data.strokes.length);
            setStrokeMedians(data.strokes);
            if (onLoadSuccess) onLoadSuccess(data);
          }
        },
        onLoadCharDataError: (err) => {
          console.warn(`[HanziWriter] Missing stroke data for '${character}':`, err);
          setIsLoading(false);
          setLoadError(true);
        }
      });

      writerRef.current = writer;
    } catch (err) {
      console.warn('[HanziWriter] Creation error:', err);
      setIsLoading(false);
      setLoadError(true);
    }
  }, [character, playbackSpeed, showOutline]);

  useEffect(() => {
    initWriter();
    return () => {
      if (writerRef.current) {
        try {
          writerRef.current.pauseAnimation();
        } catch {}
        writerRef.current = null;
      }
    };
  }, [initWriter]);

  // Handle outline toggle
  useEffect(() => {
    if (writerRef.current && !isLoading && !loadError) {
      try {
        if (showOutline) {
          writerRef.current.showOutline();
        } else {
          writerRef.current.hideOutline();
        }
      } catch {}
    }
  }, [showOutline, isLoading, loadError]);

  // Handle Play Animation
  const handlePlay = () => {
    playClickSound();
    if (!writerRef.current || loadError) return;

    setIsPlaying(true);
    try {
      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsPlaying(false);
          setCurrentStroke(totalStrokes);
          setTimeout(() => {
            if (writerRef.current) {
              writerRef.current.hideCharacter();
              if (showOutline) writerRef.current.showOutline();
              setCurrentStroke(0);
            }
          }, 1200);
        }
      });
    } catch (err) {
      console.warn('Playback error:', err);
      setIsPlaying(false);
    }
  };

  // Handle Pause Animation
  const handlePause = () => {
    playClickSound();
    if (!writerRef.current) return;
    try {
      writerRef.current.pauseAnimation();
      setIsPlaying(false);
    } catch {}
  };

  // Handle Replay from Start
  const handleReplay = () => {
    playClickSound();
    if (!writerRef.current) return;
    try {
      writerRef.current.hideCharacter();
      if (showOutline) writerRef.current.showOutline();
      setCurrentStroke(0);
      handlePlay();
    } catch {}
  };

  // Animate specific single stroke (Step by step)
  const handleStepStroke = (index) => {
    playClickSound();
    if (!writerRef.current || loadError) return;

    const targetIdx = Math.max(0, Math.min(totalStrokes - 1, index));
    setCurrentStroke(targetIdx + 1);
    setIsPlaying(false);

    try {
      writerRef.current.pauseAnimation();
      writerRef.current.animateStroke(targetIdx);
      if (onStrokeChange) onStrokeChange(targetIdx + 1, totalStrokes);
    } catch (err) {
      console.warn('Stroke step error:', err);
    }
  };

  const handleNextStroke = () => {
    if (currentStroke < totalStrokes) {
      handleStepStroke(currentStroke);
    } else {
      handleStepStroke(0);
    }
  };

  const handlePrevStroke = () => {
    if (currentStroke > 1) {
      handleStepStroke(currentStroke - 2);
    } else {
      handleStepStroke(0);
    }
  };

  // Change Speed
  const handleSpeedChange = (speed) => {
    playClickSound();
    setPlaybackSpeed(speed);
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-[#F1E5D8] dark:border-[#334155] shadow-sm">
      {/* Header Controls */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1E5D8] dark:border-[#334155]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E85D3F] animate-pulse" />
          <h3 className="font-bold text-[#243447] dark:text-[#F3F4F6] text-base">
            Hoạt ảnh Thứ tự Nét
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E85D3F]/10 text-[#E85D3F] font-semibold">
            Bút thuận chuẩn
          </span>
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFF9F2] dark:bg-[#0F172A] border border-[#F1E5D8] dark:border-[#334155] text-[#243447] dark:text-[#E2E8F0]">
          Nét: <span className="text-[#E85D3F] font-bold">{currentStroke}</span> / {totalStrokes}
        </div>
      </div>

      {/* Main Animation Box */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Tianzige / Mizige Grid container */}
        <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden border-2 border-[#E85D3F]/40 shadow-inner bg-[#FFFCF8] dark:bg-[#0F172A]">
          {/* Grid lines */}
          {gridStyle === 'mizige' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E85D3F]/25 stroke-dasharray-[4,4] stroke-1" viewBox="0 0 280 280">
              <line x1="140" y1="0" x2="140" y2="280" />
              <line x1="0" y1="140" x2="280" y2="140" />
              <line x1="0" y1="0" x2="280" y2="280" />
              <line x1="280" y1="0" x2="0" y2="280" />
            </svg>
          )}

          {gridStyle === 'tianzige' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#E85D3F]/25 stroke-dasharray-[4,4] stroke-1" viewBox="0 0 280 280">
              <line x1="140" y1="0" x2="140" y2="280" />
              <line x1="0" y1="140" x2="280" y2="140" />
            </svg>
          )}

          {/* HanziWriter Canvas mount point */}
          <div ref={containerRef} className="w-full h-full flex items-center justify-center" />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-[#FFFCF8]/80 dark:bg-[#0F172A]/80 backdrop-blur-xs flex flex-col items-center justify-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              <div className="w-7 h-7 border-2 border-[#E85D3F] border-t-transparent rounded-full animate-spin mb-2" />
              Đang tải dữ liệu nét...
            </div>
          )}

          {/* Missing Data Fallback */}
          {loadError && (
            <div className="absolute inset-0 bg-[#FFFCF8] dark:bg-[#0F172A] p-4 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold text-[#243447] dark:text-[#F3F4F6] mb-1">
                Chưa có dữ liệu nét vector
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                Ký tự "{character}" chưa có file vector nét chuẩn trên kho Make Me a Hanzi.
              </p>
              <div className="text-5xl font-['Noto_Serif_SC'] text-[#E85D3F] font-bold p-2 bg-[#FFF9F2] dark:bg-[#1E293B] rounded-lg border border-[#F1E5D8] dark:border-[#334155]">
                {character}
              </div>
            </div>
          )}
        </div>

        {/* Display Controls Toolbar */}
        <div className="flex items-center justify-center gap-1.5 mt-4 w-full">
          {/* Outline toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowOutline(!showOutline);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              showOutline 
                ? 'bg-[#E85D3F]/10 border-[#E85D3F]/30 text-[#E85D3F]' 
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
            }`}
            title="Bật/Tắt nét chữ mẫu mờ"
          >
            {showOutline ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Mẫu mờ</span>
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setGridStyle(prev => prev === 'mizige' ? 'tianzige' : prev === 'tianzige' ? 'none' : 'mizige');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Đổi kiểu ô kẻ Mễ tự cách / Điền tự cách"
          >
            <Grid className="w-3.5 h-3.5 text-[#E85D3F]" />
            <span>
              {gridStyle === 'mizige' ? 'Ô Mễ (米)' : gridStyle === 'tianzige' ? 'Ô Điền (田)' : 'Không ô'}
            </span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
            {[0.75, 1.0, 1.5].map(spd => (
              <button
                key={spd}
                type="button"
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  playbackSpeed === spd 
                    ? 'bg-white dark:bg-[#1E293B] text-[#E85D3F] shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-center gap-2 mt-3 w-full">
          <button
            type="button"
            onClick={handlePrevStroke}
            disabled={loadError || isLoading}
            className="p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#334155] text-gray-700 dark:text-gray-200 hover:bg-[#FCEEE2] active:scale-95 transition-all disabled:opacity-40"
            title="Nét trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              disabled={loadError || isLoading}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-[#E85D3F] to-[#CB4529] text-white font-bold text-sm shadow-sm shadow-[#E85D3F]/25 flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Phát bút thuận</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex-1 py-2 px-4 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-amber-600 active:scale-98 transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Tạm dừng</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNextStroke}
            disabled={loadError || isLoading}
            className="p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#334155] text-gray-700 dark:text-gray-200 hover:bg-[#FCEEE2] active:scale-95 transition-all disabled:opacity-40"
            title="Nét tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleReplay}
            disabled={loadError || isLoading}
            className="p-2 rounded-xl bg-[#FFF9F2] dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#334155] text-gray-700 dark:text-gray-200 hover:bg-[#FCEEE2] active:scale-95 transition-all disabled:opacity-40"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Step-by-Step Stroke Gallery */}
        {totalStrokes > 0 && !loadError && (
          <div className="w-full mt-4 pt-3 border-t border-[#F1E5D8] dark:border-[#334155]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                Xem chi tiết từng nét ({totalStrokes} nét):
              </span>
              <span className="text-[11px] text-[#E85D3F]">
                Bấm vào số để xem nét tương ứng
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {Array.from({ length: totalStrokes }).map((_, idx) => {
                const isSelected = currentStroke === idx + 1;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStepStroke(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#E85D3F] text-white shadow-xs scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Nét {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
