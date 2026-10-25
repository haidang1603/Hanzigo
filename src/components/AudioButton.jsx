import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakChinese, playClickSound } from '../utils/audio';

export default function AudioButton({ 
  text, 
  rate = 0.85, 
  size = 'md', 
  className = '', 
  label = null,
  variant = 'primary'
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [hasError, setHasError] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    playClickSound();
    setHasError(false);
    setIsPlaying(true);

    const safetyTimer = setTimeout(() => {
      setIsPlaying(false);
    }, 4000);

    const result = speakChinese(text, {
      rate,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        clearTimeout(safetyTimer);
        setIsPlaying(false);
      },
      onError: (err) => {
        clearTimeout(safetyTimer);
        setIsPlaying(false);
        setHasError(true);
        console.warn('[AudioButton] Lỗi phát âm:', err);
      }
    });

    if (result && !result.success) {
      clearTimeout(safetyTimer);
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const variantStyles = {
    primary: 'bg-[#E85D3F] text-white hover:bg-[#CB4529] shadow-sm',
    secondary: 'bg-[#F4B942] text-[#243447] hover:bg-[#E5AA33] shadow-sm',
    ghost: 'bg-[#FFF9F2] text-[#E85D3F] hover:bg-[#FDEEEB] border border-[#F1E5D8]',
    dark: 'bg-[#243447] text-white hover:bg-[#1A2634]'
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={hasError ? `Chưa phát được âm thanh cho '${text}' (Vui lòng kiểm tra âm lượng hoặc gói giọng đọc tiếng Trung zh-CN)` : `Nghe phát âm: ${text}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-200 active:scale-95 ${
        label ? 'px-3 py-1.5' : sizeClasses[size]
      } ${hasError ? 'bg-rose-100 text-rose-600 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300' : variantStyles[variant]} ${isPlaying ? 'ring-2 ring-[#E85D3F] ring-offset-2 animate-pulse' : ''} ${className}`}
    >
      <Volume2 size={iconSizes[size]} className={isPlaying ? 'animate-bounce' : ''} />
      {label && <span>{label}</span>}
    </button>
  );
}
