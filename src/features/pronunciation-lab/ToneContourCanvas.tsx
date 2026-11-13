import React, { useEffect, useRef } from 'react';

interface ToneContourCanvasProps {
  referenceContour: number[];
  userContour: number[];
  overallScore?: number | null;
}

const CHAO_LEVELS = [5, 4, 3, 2, 1];

export const ToneContourCanvas: React.FC<ToneContourCanvasProps> = ({
  referenceContour,
  userContour,
  overallScore = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padLeft = 36;
    const padRight = 16;
    const padTop = 18;
    const padBottom = 18;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw 5 Chao pitch horizontal grid lines (1..5)
    ctx.font = '11px ui-monospace, monospace';
    ctx.textBaseline = 'middle';

    CHAO_LEVELS.forEach((lvl) => {
      const norm = ((lvl - 1) / 4) * 100;
      const y = padTop + ((100 - norm) / 100) * plotH;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillText(String(lvl), 14, y);
    });

    const drawCurve = (
      points: number[],
      color: string,
      dashed: boolean,
      lineWidth: number
    ) => {
      if (points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.setLineDash(dashed ? [6, 5] : []);
      ctx.beginPath();

      points.forEach((val, idx) => {
        const clamped = Math.max(0, Math.min(100, val));
        const x = padLeft + (idx / Math.max(1, points.length - 1)) * plotW;
        const y = padTop + ((100 - clamped) / 100) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    };

    // Dashed blue reference contour
    drawCurve(referenceContour, '#2563eb', true, 2.5);

    // Solid green/red user contour
    if (userContour.length >= 2) {
      const userColor = overallScore !== null && overallScore < 70 ? '#dc2626' : '#16a34a';
      drawCurve(userContour, userColor, false, 3);
    }
  }, [referenceContour, userContour, overallScore]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-800">
          Biểu đồ đường nét cao độ (Thang 5 bậc Chao Yuen Ren)
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium">
            <span className="w-5 border-t-2 border-dashed border-blue-600 inline-block" />
            Chuẩn bản xứ
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-5 border-t-2 border-emerald-600 inline-block" />
            Giọng của bạn
          </span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={680}
        height={200}
        className="w-full h-[200px] rounded-xl border border-slate-100"
      />
    </div>
  );
};

