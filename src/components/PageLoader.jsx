import React from 'react';

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E85D3F] to-[#F1B24A] animate-spin flex items-center justify-center p-1 shadow-lg shadow-[#E85D3F]/20">
          <div className="w-full h-full bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl flex items-center justify-center">
            <span className="font-['Noto_Serif_SC'] text-lg font-black text-[#E85D3F]">汉</span>
          </div>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#748092] dark:text-[#94A3B8] animate-pulse">
        Đang tải nội dung HanziGo...
      </p>
    </div>
  );
}
