import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Mic,
  PenTool,
  Repeat,
  Layers,
  Trophy,
  GraduationCap
} from 'lucide-react';
import AiContextBadge from './AiContextBadge.jsx';

export default function PersonalizedRecommendationCard({
  item,
  onNavigate,
  onComplete,
  onDismiss,
  className = ''
}) {
  const [showReason, setShowReason] = useState(false);

  if (!item) return null;

  const {
    id,
    type = 'lesson',
    title = 'Nhiệm vụ học tập',
    subtitle = '',
    durationMinutes = 5,
    route = 'roadmap',
    targetRef = null,
    reason = '',
    completed = false,
    sourceType = 'ai_suggestion'
  } = item;

  const getIcon = () => {
    switch (type) {
      case 'srs':
        return <Repeat className="w-5 h-5 text-amber-500" />;
      case 'pronunciation':
      case 'speaking':
        return <Mic className="w-5 h-5 text-rose-500" />;
      case 'writing':
        return <PenTool className="w-5 h-5 text-emerald-500" />;
      case 'grammar':
        return <Layers className="w-5 h-5 text-indigo-500" />;
      case 'hsk':
        return <Trophy className="w-5 h-5 text-blue-500" />;
      case 'materials':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      default:
        return <GraduationCap className="w-5 h-5 text-[#E85D3F]" />;
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-white dark:bg-[#1A232E] border border-orange-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${completed ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : ''} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        {/* Icon & Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-orange-100 dark:border-gray-700">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className={`font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate ${completed ? 'line-through text-gray-500' : ''}`}>
                {title}
              </h4>
              <AiContextBadge type={sourceType} size="xs" />
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Duration Chip */}
        {durationMinutes > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs shrink-0 font-medium">
            <Clock className="w-3 h-3" />
            <span>{durationMinutes}p</span>
          </div>
        )}
      </div>

      {/* Rationale toggle */}
      {reason && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
          <button
            onClick={() => setShowReason(!showReason)}
            className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tại sao có gợi ý này?</span>
            {showReason ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showReason && (
            <p className="mt-1.5 p-2 rounded-lg bg-orange-50/70 dark:bg-gray-800/60 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border border-orange-100 dark:border-gray-700">
              {reason}
            </p>
          )}
        </div>
      )}

      {/* Action Row */}
      <div className="mt-3.5 flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1">
          {onComplete && !completed && (
            <button
              onClick={() => onComplete(id)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 transition-colors"
              title="Đánh dấu đã hoàn thành"
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xong</span>
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1 transition-colors"
              title="Không phù hợp lúc này"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bỏ qua</span>
            </button>
          )}
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate(route, targetRef)}
            className="px-3 py-1.5 rounded-xl bg-[#E85D3F] hover:bg-[#D44D31] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          >
            <span>Bắt đầu ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
