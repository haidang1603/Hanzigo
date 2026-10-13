import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';
import AiContextBadge from './AiContextBadge';
import { getPersonalizedResourceRecommendations } from '../../services/aiGateway';

/**
 * PersonalizedMaterialsSection
 * Khối đề xuất tài liệu học tập cá nhân hóa:
 * - Dựa trên mục tiêu, trình độ HSK và điểm yếu hiện tại của học viên.
 * - Trích dẫn nguồn gốc và bản quyền minh bạch (CTI, BLCU, AllSet Grammar, OER).
 * - Tuyệt đối không bịa đặt liên kết hay nội dung giả mạo.
 */
export default function PersonalizedMaterialsSection({
  user = null,
  materials = [],
  onSelectResource = null
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const fetchRecommendations = async () => {
    if (!materials || materials.length === 0) return;
    setLoading(true);
    try {
      const res = await getPersonalizedResourceRecommendations(user, materials);
      if (Array.isArray(res)) {
        setRecommendations(res.slice(0, 3));
      } else if (res && Array.isArray(res.recommendedMaterials)) {
        setRecommendations(res.recommendedMaterials.slice(0, 3));
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.warn('Lỗi tải đề xuất tài liệu cá nhân hóa:', err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user?.id, materials.length]);

  if (!isOpen) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Xem {recommendations.length} tài liệu học tập được AI đề xuất cho trình độ của bạn
          </span>
          <ChevronRight className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    );
  }

  if (!loading && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900/40 dark:to-slate-900/20 border border-amber-500/25 dark:border-amber-500/30 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/15 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Đề Xuất Học Liệu Cá Nhân Hóa
              </h3>
              <AiContextBadge type="ai_suggestion" label="AI Khuyến nghị" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tuyển chọn tài nguyên phù hợp nhất với mục tiêu học tập và kỹ năng cần củng cố của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Làm mới gợi ý"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span className="text-[11px] hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Recommended items grid */}
      {loading ? (
        <div className="py-8 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Đang phân tích hồ sơ và lọc tài nguyên phù hợp...</p>
        </div>
      ) : (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item, idx) => {
            const mat = item.material || item;
            return (
              <div 
                key={mat.id || idx}
                className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {mat.level || 'HSK 1-6'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {mat.format || 'Tài liệu số'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5 leading-snug">
                    {mat.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Recommendation reasoning */}
                  {item.reason && (
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 mb-3 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>{item.reason}</span>
                    </div>
                  )}

                  {/* Source Attribution */}
                  <div className="text-[10px] text-slate-400 mb-3">
                    <span>Nguồn: <strong>{mat.publisher || mat.author || 'HanziGo'}</strong></span>
                    {mat.license && <span> • {mat.license}</span>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {onSelectResource ? (
                    <button
                      onClick={() => onSelectResource(mat)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Xem chi tiết học liệu</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : mat.downloadUrl ? (
                    <a
                      href={mat.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Mở tài liệu</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
