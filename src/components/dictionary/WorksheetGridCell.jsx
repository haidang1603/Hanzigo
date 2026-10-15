import React from 'react';

/**
 * Ô tập viết Điền tự / Mễ tự chuẩn tỉ lệ vector SVG
 * Đảm bảo độ sắc nét tuyệt đối khi in ra máy in độ phân giải cao hoặc xuất PDF
 */
export default function WorksheetGridCell({
  char = '',
  mode = 'blank', // 'model' (mực đen), 'trace' (nét mờ đồ theo), 'blank' (ô trống)
  opacity = 0,
  pinyin = '',
  gridStyle = 'tianzige', // 'tianzige', 'mizige', 'jiugongge', 'blank'
  colorConfig = {
    hex: '#DC2626',
    borderHex: '#EF4444',
    lineHex: '#FCA5A5'
  },
  showPinyinGrid = true
}) {
  const isModel = mode === 'model';
  const isTrace = mode === 'trace';
  const hasChar = (isModel || isTrace) && Boolean(char);

  return (
    <div className="flex flex-col items-center select-none">
      {/* 1. Thanh 4 đường kẻ Pinyin (四线三格) */}
      {showPinyinGrid && (
        <div className="w-full aspect-[100/26] relative">
          <svg
            viewBox="0 0 100 26"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            {/* 4 đường kẻ Pinyin mỏng */}
            <line x1="0" y1="2" x2="100" y2="2" stroke={colorConfig.lineHex} strokeWidth="0.6" />
            <line x1="0" y1="9" x2="100" y2="9" stroke={colorConfig.lineHex} strokeWidth="0.6" strokeDasharray="2 2" />
            <line x1="0" y1="17" x2="100" y2="17" stroke={colorConfig.lineHex} strokeWidth="0.6" strokeDasharray="2 2" />
            <line x1="0" y1="24" x2="100" y2="24" stroke={colorConfig.lineHex} strokeWidth="0.6" />

            {/* Chữ Pinyin phiên âm */}
            {pinyin && (
              <text
                x="50"
                y="15"
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={isModel ? '#1E293B' : '#475569'}
                fillOpacity={isModel ? 1 : isTrace ? 0.75 : 0}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {pinyin}
              </text>
            )}
          </svg>
        </div>
      )}

      {/* 2. Ô vuông chính (Điền tự / Mễ tự / Cửu cung) */}
      <div className="w-full aspect-square relative bg-white">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Viền ngoài ô vuông */}
          <rect
            x="0.75"
            y="0.75"
            width="98.5"
            height="98.5"
            fill="none"
            stroke={colorConfig.borderHex}
            strokeWidth="1.5"
          />

          {/* Đường gióng nội bộ theo phong cách lưới */}
          {gridStyle === 'tianzige' && (
            // Ô Điền tự: Dấu chữ thập (+)
            <>
              <line x1="0" y1="50" x2="100" y2="50" stroke={colorConfig.lineHex} strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.8" strokeDasharray="3 3" />
            </>
          )}

          {gridStyle === 'mizige' && (
            // Ô Mễ tự: Dấu chữ thập (+) và 2 đường chéo (x)
            <>
              {/* 2 đường chéo */}
              <line x1="0" y1="0" x2="100" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.6" strokeDasharray="2.5 2.5" />
              <line x1="100" y1="0" x2="0" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.6" strokeDasharray="2.5 2.5" />
              {/* Dấu chữ thập */}
              <line x1="0" y1="50" x2="100" y2="50" stroke={colorConfig.lineHex} strokeWidth="0.9" strokeDasharray="3 3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.9" strokeDasharray="3 3" />
            </>
          )}

          {gridStyle === 'jiugongge' && (
            // Ô Cửu cung: Lưới 3x3
            <>
              <line x1="0" y1="33.33" x2="100" y2="33.33" stroke={colorConfig.lineHex} strokeWidth="0.7" strokeDasharray="2.5 2.5" />
              <line x1="0" y1="66.66" x2="100" y2="66.66" stroke={colorConfig.lineHex} strokeWidth="0.7" strokeDasharray="2.5 2.5" />
              <line x1="33.33" y1="0" x2="33.33" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.7" strokeDasharray="2.5 2.5" />
              <line x1="66.66" y1="0" x2="66.66" y2="100" stroke={colorConfig.lineHex} strokeWidth="0.7" strokeDasharray="2.5 2.5" />
            </>
          )}

          {/* Chữ Hán mẫu hoặc nét mờ đồ theo */}
          {hasChar && (
            <text
              x="50"
              y="54"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="68"
              fontWeight={isModel ? '800' : '500'}
              fill={isModel ? '#0F172A' : '#334155'}
              fillOpacity={opacity}
              fontFamily="'Noto Serif SC', 'Kaiti', 'STKaiti', 'SimSun', serif"
            >
              {char}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
