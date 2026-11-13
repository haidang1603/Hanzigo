import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { SyllableDiagnostic } from '../../services/pronunciationLabService.ts';

interface SyllableDiagnosticCardProps {
  breakdown: SyllableDiagnostic[];
  overallScore: number;
  toneScore: number;
  initialFinalScore: number;
  fluencyScore: number;
}

function getScoreBadgeClass(score: number): string {
  if (score >= 85) return 'bg-emerald-50 border-emerald-300 text-emerald-900';
  if (score >= 60) return 'bg-amber-50 border-amber-300 text-amber-900';
  return 'bg-rose-50 border-rose-300 text-rose-900';
}

export const SyllableDiagnosticCard: React.FC<SyllableDiagnosticCardProps> = ({
  breakdown,
  overallScore,
  toneScore,
  initialFinalScore,
  fluencyScore,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    const firstRed = breakdown.findIndex((b) => b.score < 60);
    return firstRed >= 0 ? firstRed : 0;
  });

  const selected = breakdown[selectedIndex] || breakdown[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Aggregate Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-xl bg-slate-900 text-white p-3">
          <div className="text-[11px] opacity-75">Tổng điểm</div>
          <div className="text-xl font-bold">{overallScore}/100</div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-[11px] text-slate-500">Thanh điệu</div>
          <div className="text-xl font-bold text-slate-900">{toneScore}%</div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-[11px] text-slate-500">Thanh mẫu / Vận mẫu</div>
          <div className="text-xl font-bold text-slate-900">{initialFinalScore}%</div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-[11px] text-slate-500">Độ trôi chảy</div>
          <div className="text-xl font-bold text-slate-900">{fluencyScore}%</div>
        </div>
      </div>

      {/* Clickable Syllable Pills */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-500">
          Bấm vào từng chữ để xem chẩn đoán khẩu hình (Xanh ≥85đ · Vàng 60–84đ · Đỏ &lt;60đ):
        </div>
        <div className="flex flex-wrap gap-2">
          {breakdown.map((syl, idx) => {
            const active = idx === selectedIndex;
            return (
              <button
                key={`${syl.char}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`rounded-xl border px-3.5 py-2 text-center transition ${getScoreBadgeClass(
                  syl.score
                )} ${active ? 'ring-2 ring-slate-900' : ''}`}
              >
                <div className="text-xl font-bold">{syl.char}</div>
                <div className="text-xs font-medium">{syl.pinyin_surface}</div>
                <div className="text-[11px] font-bold mt-0.5">{syl.score}đ</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articulation Diagnostic Box */}
      {selected && (
        <div
          className={`rounded-xl border p-3.5 flex items-start gap-2.5 ${
            selected.score >= 85
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : selected.score >= 60
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}
        >
          {selected.score >= 85 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : selected.score >= 60 ? (
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1 text-xs">
            <div className="font-bold">
              Chẩn đoán khẩu hình: {selected.char} ({selected.pinyin_surface}) — Thanh kỳ vọng:{' '}
              {selected.expected_tone} · Nhận diện: {selected.detected_tone}
            </div>
            <p className="leading-relaxed">{selected.diagnostic_vi}</p>
          </div>
        </div>
      )}
    </div>
  );
};

