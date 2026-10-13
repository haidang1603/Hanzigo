import React from 'react';
import { Sparkles, CheckCircle2, BookOpen, ShieldCheck, WifiOff, FileText } from 'lucide-react';

/**
 * AiContextBadge:
 * Huy hiệu trực quan phân biệt nội dung do AI tạo ra với dữ liệu từ điển/đề thi chính thức.
 */
export default function AiContextBadge({ 
  type = 'ai_suggestion', // 'ai_suggestion' | 'ai_pedagogy' | 'official_dict' | 'official_exam' | 'oer_open' | 'offline_rule'
  size = 'sm', // 'xs' | 'sm' | 'md'
  className = '' 
}) {
  const configs = {
    ai_suggestion: {
      label: 'AI Gợi ý',
      tooltip: 'Nội dung bổ trợ do mô hình AI gợi ý dựa trên ngữ cảnh học viên',
      icon: Sparkles,
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    ai_pedagogy: {
      label: 'AI Sư phạm',
      tooltip: 'Chẩn đoán sư phạm cá nhân hóa từ Lão Sư HanziGo',
      icon: Sparkles,
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    official_dict: {
      label: 'Từ điển chuẩn',
      tooltip: 'Dữ liệu từ điển HSK 3.0 đã được đối soát chính thức',
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    official_exam: {
      label: 'Cấu trúc HSK Chuẩn',
      tooltip: 'Khung cấu trúc đề thi theo quy định của Hanban / CTI',
      icon: ShieldCheck,
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    oer_open: {
      label: 'Tài liệu OER',
      tooltip: 'Tài nguyên giáo dục mở có bản quyền công cộng (CC BY-NC-SA)',
      icon: BookOpen,
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    offline_rule: {
      label: 'Quy tắc Chuẩn',
      tooltip: 'Xử lý bởi bộ máy thuật toán sư phạm nội bộ (không qua mô hình ngoài)',
      icon: WifiOff,
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    }
  };

  const current = configs[type] || configs.ai_suggestion;
  const Icon = current.icon;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2'
  }[size] || 'text-xs px-2 py-0.5 gap-1.5';

  return (
    <span 
      title={current.tooltip}
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${current.bg} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
}
