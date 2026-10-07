import React, { useEffect } from 'react';

/**
 * LessonPage has been deprecated and unified into RoadmapPage
 * All lessons are powered by the 9-step InteractiveLessonPlayer in the HSK 3.0 Roadmap
 */
export default function LessonPage({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('roadmap');
    } else {
      window.location.hash = '#roadmap';
    }
  }, [setActiveTab]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#E85D3F]/10 text-[#E85D3F] flex items-center justify-center text-xl font-bold animate-spin">
        ⏳
      </div>
      <p className="text-sm font-bold text-[#243447] dark:text-white">
        Đang chuyển hướng sang Lộ trình học HSK 3.0 chuẩn...
      </p>
    </div>
  );
}
