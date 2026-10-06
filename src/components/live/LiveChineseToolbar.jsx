import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Mic, 
  CheckSquare, 
  Headphones, 
  Layers, 
  PenTool,
  Lock
} from 'lucide-react';

export const TEACHING_TOOLS = [
  { id: 'hanzi', label: 'Hanzi', subLabel: 'Hán tự', icon: Sparkles, color: 'text-amber-400', badge: '🀄' },
  { id: 'pinyin', label: 'Pinyin', subLabel: '拼音', icon: Volume2, color: 'text-sky-400', badge: '拼' },
  { id: 'vocabulary', label: 'Vocab', subLabel: 'Từ vựng', icon: BookOpen, color: 'text-emerald-400', badge: '📚' },
  { id: 'pronunciation', label: 'Speaking', subLabel: 'Phát âm', icon: Mic, color: 'text-rose-400', badge: '🎤' },
  { id: 'quiz', label: 'Quiz', subLabel: 'Trắc nghiệm', icon: CheckSquare, color: 'text-violet-400', badge: '📝' },
  { id: 'listening', label: 'Listening', subLabel: 'Nghe hiểu', icon: Headphones, color: 'text-blue-400', badge: '🎧' },
  { id: 'grammar', label: 'Grammar', subLabel: 'Ngữ pháp', icon: Layers, color: 'text-orange-400', badge: '📐' },
  { id: 'whiteboard', label: 'Whiteboard', subLabel: 'Bảng vẽ', icon: PenTool, color: 'text-teal-400', badge: '✏' }
];

export default function LiveChineseToolbar({
  activeTool = 'hanzi',
  onSelectTool,
  isTeacher = false,
  className = ''
}) {
  return (
    <div className={`w-full bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/10 px-2 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none ${className}`}>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-gradient-to-r from-[#E85D3F]/20 to-[#F4B942]/20 text-[#F4B942] border border-[#E85D3F]/30 hidden md:inline-flex items-center gap-1">
          <span>🇨🇳 CHINESE SUITE</span>
        </span>

        {TEACHING_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              onClick={() => {
                if (isTeacher && onSelectTool) {
                  onSelectTool(tool.id);
                }
              }}
              disabled={!isTeacher}
              title={isTeacher ? `Chuyển màn hình cả lớp sang ${tool.label}` : `Giáo viên đang trình chiếu: ${tool.label}`}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#E85D3F] to-[#E85D3F]/90 text-white shadow-lg shadow-[#E85D3F]/30 scale-102 border border-white/20'
                  : isTeacher
                  ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 cursor-pointer'
                  : 'bg-white/5 text-white/40 border border-transparent cursor-default'
              }`}
            >
              <span className="text-sm">{tool.badge}</span>
              <span className="font-bold">{tool.label}</span>
              <span className="text-[10px] opacity-70 hidden sm:inline">{tool.subLabel}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-white/60 px-2">
        {isTeacher ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden lg:inline">Chế độ giảng viên • Đồng bộ realtime</span>
            <span className="lg:hidden">GV</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold flex items-center gap-1">
            <Lock size={10} />
            <span className="hidden lg:inline">Theo dõi bục giảng của giáo viên</span>
            <span className="lg:hidden">Học viên</span>
          </span>
        )}
      </div>
    </div>
  );
}
