import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpRight, 
  HelpCircle, 
  X, 
  RefreshCw, 
  User, 
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  School,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUp,
  Minus,
  ArrowDown
} from 'lucide-react';
import { 
  getXpLeaderboard, 
  XP_HONORIFIC_TITLES,
  isUserLeaderboardOptedOut,
  setLeaderboardPrivacyOptOut
} from '../../services/leaderboardService';
import { playClickSound, playLevelUpSound } from '../../utils/audio';
import StreakModal from './StreakModal';

// 5-Tier League System (Hệ thống 5 Giải Đấu Danh Giá)
export const LEAGUES = [
  {
    id: 'diamond',
    name: 'Kim Cương',
    hanzi: '钻石',
    icon: '👑',
    minXp: 1200,
    color: '#8B5CF6',
    border: 'border-purple-400 dark:border-purple-500',
    badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
    headerBg: 'from-purple-950 via-slate-900 to-indigo-950',
    desc: 'Giải đấu thượng đỉnh của các bậc kỳ tài HSK.'
  },
  {
    id: 'platinum',
    name: 'Bạch Kim',
    hanzi: '白金',
    icon: '💎',
    minXp: 700,
    color: '#06B6D4',
    border: 'border-cyan-400 dark:border-cyan-500',
    badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
    headerBg: 'from-cyan-950 via-slate-900 to-sky-950',
    desc: 'Hạng đấu cao cấp dành cho những người học kiên định.'
  },
  {
    id: 'gold',
    name: 'Hoàng Kim',
    hanzi: '黄金',
    icon: '🥇',
    minXp: 350,
    color: '#F59E0B',
    border: 'border-amber-400 dark:border-amber-500',
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
    headerBg: 'from-amber-950/90 via-slate-900 to-orange-950',
    desc: 'Bứt phá mạnh mẽ, phản xạ tiếng Trung nhạy bén.'
  },
  {
    id: 'silver',
    name: 'Ngân Bạch',
    hanzi: '白银',
    icon: '🥈',
    minXp: 150,
    color: '#94A3B8',
    border: 'border-slate-300 dark:border-slate-600',
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/30',
    headerBg: 'from-slate-900 via-zinc-900 to-slate-950',
    desc: 'Đang tăng tốc trên hành trình làm chủ ngôn ngữ.'
  },
  {
    id: 'bronze',
    name: 'Đồng Hắc',
    hanzi: '青铜',
    icon: '🥉',
    minXp: 0,
    color: '#D97706',
    border: 'border-amber-700 dark:border-amber-800',
    badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    headerBg: 'from-orange-950/80 via-slate-900 to-zinc-950',
    desc: 'Khởi đầu vững chắc, tích lũy kiến thức mỗi ngày.'
  }
];

export function getLeagueByXp(xp = 0) {
  for (const league of LEAGUES) {
    if (xp >= league.minXp) return league;
  }
  return LEAGUES[LEAGUES.length - 1];
}

export function getNextLeague(currentLeagueId) {
  const idx = LEAGUES.findIndex(l => l.id === currentLeagueId);
  if (idx > 0) return LEAGUES[idx - 1];
  return null;
}

// Calculate countdown to Sunday 23:59:59
function getSeasonTimeRemaining() {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const daysUntilSunday = (7 - day) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
}

export default function LeaderboardView({ user, onNavigateTab }) {
  const [data, setData] = useState({
    leaderboard: [],
    totalLearners: 0,
    currentUserRank: -1,
    currentUserEntry: null,
    gapToNext: 0,
    nextRankUser: null
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedLeague, setSelectedLeague] = useState('all'); // 'all' | 'diamond' | 'platinum' | ...
  const [timeframe, setTimeframe] = useState('all'); // 'all' | 'weekly' | 'monthly'
  const [scope, setScope] = useState('global'); // 'global' | 'class'
  const [isOptedOut, setIsOptedOut] = useState(() => isUserLeaderboardOptedOut(user));
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Live season countdown state
  const [seasonCountdown, setSeasonCountdown] = useState(getSeasonTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeasonCountdown(getSeasonTimeRemaining());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load leaderboard data
  const loadData = async (showSpin = false, tf = timeframe, sc = scope) => {
    if (showSpin) setIsRefreshing(true);
    else setLoading(true);

    try {
      const result = await getXpLeaderboard(user, { timeframe: tf, scope: sc });
      setData(result);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false, timeframe, scope);

    // Cross-tab and window focus sync so all accounts see instant updates
    let bc = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('hanzigo_leaderboard_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'LEADERBOARD_UPDATED' || event.data?.type === 'STREAK_UPDATED') {
            loadData(false, timeframe, scope);
          }
        };
      }
    } catch {}

    const handleFocus = () => {
      loadData(false, timeframe, scope);
    };
    window.addEventListener('focus', handleFocus);

    const handleGamificationUpdated = () => {
      loadData(false, timeframe, scope);
    };
    window.addEventListener('hanzigo_gamification_updated', handleGamificationUpdated);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('hanzigo_gamification_updated', handleGamificationUpdated);
    };
  }, [user, timeframe, scope]);

  const handleToggleOptOut = () => {
    playClickSound();
    const nextVal = !isOptedOut;
    setIsOptedOut(nextVal);
    setLeaderboardPrivacyOptOut(user, nextVal);
    loadData(true, timeframe, scope);
  };

  // User league calculation
  const userXp = data.currentUserEntry?.xp || 0;
  const userLeague = useMemo(() => getLeagueByXp(userXp), [userXp]);
  const nextLeague = useMemo(() => getNextLeague(userLeague.id), [userLeague.id]);
  const xpNeededForNextLeague = nextLeague ? Math.max(0, nextLeague.minXp - userXp) : 0;
  const leagueProgressPercent = nextLeague 
    ? Math.min(100, Math.round(((userXp - userLeague.minXp) / (nextLeague.minXp - userLeague.minXp)) * 100))
    : 100;

  // Filtered leaderboard
  const filteredList = useMemo(() => {
    return data.leaderboard.filter(item => {
      const matchesSearch = !searchQuery.trim() || 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.email || '').toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesLevel = levelFilter === 'all' || 
        (item.level || '').toLowerCase().includes(levelFilter.toLowerCase());

      const itemLeague = getLeagueByXp(item.xp);
      const matchesLeague = selectedLeague === 'all' || itemLeague.id === selectedLeague;

      return matchesSearch && matchesLevel && matchesLeague;
    });
  }, [data.leaderboard, searchQuery, levelFilter, selectedLeague]);

  // Top 3 Podium
  const top1 = data.leaderboard[0] || null;
  const top2 = data.leaderboard[1] || null;
  const top3 = data.leaderboard[2] || null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* 1. Header Banner & Season Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E85D3F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Trophy size={14} className="text-amber-400" />
                <span>BẢNG VÀNG HỌC VIÊN HANZIGO</span>
              </div>

              {/* Season Countdown Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-pulse">
                <Clock size={13} />
                <span>Mùa giải kết thúc sau: {seasonCountdown.days}N {seasonCountdown.hours}G {seasonCountdown.minutes}P</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bảng Vàng Danh Dự & Đấu Trường XP
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Thi đua xếp hạng, thăng hạng 5 giải đấu danh giá và nhận vinh danh tuần. Tích lũy XP qua từng bài học, phát âm và tập viết chữ Hán!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                playClickSound();
                setShowStreakModal(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Xem chuỗi ngày học liên tục"
            >
              <Flame size={14} className="text-orange-400 fill-orange-400" />
              <span>Chuỗi học</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                loadData(true);
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setShowRulesModal(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <HelpCircle size={14} />
              <span>Quy tắc xếp hạng</span>
            </button>
          </div>
        </div>

        {/* User live status card inside banner */}
        {data.currentUserEntry && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white text-lg font-black shadow-md border-2 border-white/20">
                {data.currentUserEntry.avatar ? (
                  <img src={data.currentUserEntry.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  (data.currentUserEntry.name || 'B').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {data.currentUserEntry.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85D3F] text-white">
                    Vị trí của bạn: #{data.currentUserRank}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${userLeague.badge}`}>
                    {userLeague.icon} {userLeague.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5">
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Zap size={12} className="fill-amber-300 text-amber-300" />
                    {(data.currentUserEntry.xp ?? 0).toLocaleString()} XP
                  </span>
                  <span>•</span>
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowStreakModal(true);
                    }}
                    className="flex items-center gap-1 text-orange-300 hover:text-orange-200 font-bold transition-colors cursor-pointer"
                  >
                    <Flame size={12} className="fill-orange-400 text-orange-400" />
                    <span>{data.currentUserEntry.streak} ngày streak</span>
                  </button>
                  <span>•</span>
                  <span className="text-emerald-300 font-semibold">
                    {data.currentUserEntry.honorific}
                  </span>
                </div>
              </div>
            </div>

            {/* League Progress or Gap to Next */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              {nextLeague ? (
                <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-right min-w-[220px]">
                  <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                    <span>Thăng hạng {nextLeague.icon} {nextLeague.name}</span>
                    <span className="font-mono font-bold text-amber-300">+{xpNeededForNextLeague} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-[#E85D3F] rounded-full transition-all duration-500"
                      style={{ width: `${leagueProgressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2">
                  <Crown size={16} className="text-purple-400" />
                  <span>Bạn đang ở Đẳng cấp Kim Cương tối thượng!</span>
                </div>
              )}

              {data.currentUserRank > 1 && data.gapToNext > 0 && onNavigateTab && (
                <button
                  onClick={() => {
                    playClickSound();
                    onNavigateTab('roadmap');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] text-white text-xs font-bold hover:opacity-95 transition-opacity shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Cày điểm ngay</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. League Selector & Tier Showcase */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <h2 className="text-xs sm:text-sm font-bold text-[#243447] dark:text-white">
              Hệ Thống 5 Giải Đấu Danh Giá (Leagues)
            </h2>
          </div>
          <span className="text-[11px] text-[#748092] dark:text-[#94A3B8]">
            Chọn giải để lọc bảng vàng
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {LEAGUES.map((l) => {
            const isUserInThisLeague = userLeague.id === l.id;
            const isSelected = selectedLeague === l.id;

            return (
              <button
                key={l.id}
                onClick={() => {
                  playClickSound();
                  setSelectedLeague(selectedLeague === l.id ? 'all' : l.id);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[#E85D3F] bg-gradient-to-br from-[#FFF5F2] to-[#FEF7E9] dark:from-[#2C1D1A] dark:to-[#2D2619] shadow-md scale-[1.02]'
                    : 'border-[#F1E5D8] dark:border-[#2B3A4F] bg-[#FFF9F2]/50 dark:bg-[#131B24]/50 hover:border-[#E85D3F]/40'
                }`}
              >
                {isUserInThisLeague && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-[#E85D3F] text-white text-[8px] font-black uppercase">
                    Của bạn
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xl">{l.icon}</span>
                  <div>
                    <div className="text-xs font-black text-[#243447] dark:text-white flex items-center gap-1">
                      <span>{l.name}</span>
                      <span className="text-[10px] text-[#748092] font-mono">{l.hanzi}</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      ≥ {l.minXp} XP
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedLeague !== 'all' && (
          <div className="flex items-center justify-between pt-1 px-1 text-xs">
            <span className="text-[#748092] dark:text-[#94A3B8]">
              Đang lọc theo giải đấu: <strong className="text-[#243447] dark:text-white">{LEAGUES.find(l => l.id === selectedLeague)?.name}</strong>
            </span>
            <button
              onClick={() => setSelectedLeague('all')}
              className="text-[#E85D3F] font-bold hover:underline"
            >
              Xem tất cả giải đấu
            </button>
          </div>
        )}
      </div>

      {/* 3. Top 3 Podium (Bục Vinh Quang 3D với Aura) */}
      {!loading && data.leaderboard.length > 0 && selectedLeague === 'all' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-[#243447] dark:text-white flex items-center justify-center gap-2">
              <Crown size={20} className="text-amber-500 animate-bounce" />
              <span>Bục Vinh Quang Top 3 Quán Quân</span>
            </h2>
            <p className="text-xs text-[#748092] dark:text-[#94A3B8]">
              Vinh danh những học viên có tổng tích lũy điểm kinh nghiệm và phong độ kiên trì cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-3xl mx-auto pt-6 pb-2">
            
            {/* Top 2: Silver Stand (Left) */}
            <div className="order-2 sm:order-1 flex flex-col items-center">
              {top2 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative group cursor-pointer" onClick={playClickSound}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-slate-300 dark:border-slate-500 group-hover:scale-105 transition-transform">
                      {top2.avatar ? (
                        <img src={top2.avatar} alt="Top 2" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        (top2.name || '2').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-400 text-slate-800 dark:text-slate-100 text-[10px] font-black shadow-xs">
                      🥈 #2
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-[#243447] dark:text-white truncate max-w-[130px]">
                        {top2.name}
                      </span>
                      {top2.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-black text-slate-600 dark:text-slate-300">
                      {(top2.xp ?? 0).toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top2.streak} ngày</span>
                    </div>
                  </div>

                  {/* 3D Podium Stand */}
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shadow-inner">
                    <span className="font-black text-slate-500 dark:text-slate-400 text-2xl">2</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Á Quân 1</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                  Chờ bạn chinh phục #2
                </div>
              )}
            </div>

            {/* Top 1: Gold Stand (Center, Highest) */}
            <div className="order-1 sm:order-2 flex flex-col items-center">
              {top1 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative group cursor-pointer" onClick={playLevelUpSound}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                      <Crown size={30} />
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-amber-500/30 border-4 border-amber-200 dark:border-amber-400 group-hover:scale-105 transition-transform">
                      {top1.avatar ? (
                        <img src={top1.avatar} alt="Top 1" className="w-full h-full rounded-3xl object-cover" />
                      ) : (
                        (top1.name || '1').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black shadow-md border border-amber-200">
                      🥇 #1
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-bold text-[#243447] dark:text-white truncate max-w-[150px]">
                        {top1.name}
                      </span>
                      {top1.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                      {(top1.xp ?? 0).toLocaleString()} XP
                    </div>
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      {top1.honorific}
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top1.streak} ngày streak</span>
                    </div>
                  </div>

                  {/* 3D Podium Stand */}
                  <div className="w-full h-34 rounded-2xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 dark:from-amber-950 dark:via-amber-900 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-600 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="font-black text-amber-800 dark:text-amber-300 text-3xl">1</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">Quán Quân Mùa Giải</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Top 3: Bronze Stand (Right) */}
            <div className="order-3 flex flex-col items-center">
              {top3 ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative group cursor-pointer" onClick={playClickSound}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-amber-600 group-hover:scale-105 transition-transform">
                      {top3.avatar ? (
                        <img src={top3.avatar} alt="Top 3" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        (top3.name || '3').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-700 text-amber-100 text-[10px] font-black shadow-xs">
                      🥉 #3
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-[#243447] dark:text-white truncate max-w-[130px]">
                        {top3.name}
                      </span>
                      {top3.isCurrentUser && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">Tôi</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-black text-amber-700 dark:text-amber-300">
                      {(top3.xp ?? 0).toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-[#748092] flex items-center justify-center gap-1">
                      <Flame size={10} className="text-orange-500 fill-orange-500" />
                      <span>{top3.streak} ngày</span>
                    </div>
                  </div>

                  {/* 3D Podium Stand */}
                  <div className="w-full h-20 rounded-2xl bg-gradient-to-b from-orange-200 to-orange-300 dark:from-orange-950/60 dark:to-slate-900 border-2 border-orange-400 dark:border-orange-800 flex flex-col items-center justify-center shadow-inner">
                    <span className="font-black text-orange-800 dark:text-orange-300 text-2xl">3</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-900 dark:text-orange-300">Á Quân 2</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-28 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                  Chờ bạn chinh phục #3
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. Scope, Timeframe & Privacy Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-xs">
        {/* Timeframe tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
          {[
            { id: 'all', label: 'Toàn thời gian', icon: Trophy },
            { id: 'weekly', label: 'Tuần này', icon: Zap },
            { id: 'monthly', label: 'Tháng này', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setTimeframe(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === tab.id
                    ? 'bg-[#E85D3F] text-white shadow-xs'
                    : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scope tabs & Privacy opt-out */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#FFF9F2] dark:bg-[#131B24] rounded-xl border border-[#F1E5D8] dark:border-[#2B3A4F]">
            <button
              onClick={() => {
                playClickSound();
                setScope('global');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scope === 'global'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <Globe size={13} />
              <span>Toàn quốc</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setScope('class');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scope === 'class'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-[#748092] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              <School size={13} />
              <span>Lớp học</span>
            </button>
          </div>

          {/* Privacy Opt-out Toggle */}
          <button
            onClick={handleToggleOptOut}
            title={isOptedOut ? 'Nhấn để chuyển sang chế độ công khai' : 'Nhấn để ẩn danh trên bảng xếp hạng'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isOptedOut
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {isOptedOut ? <EyeOff size={14} className="text-slate-500" /> : <Eye size={14} className="text-emerald-600" />}
            <span>{isOptedOut ? 'Chế độ Ẩn danh: BẬT' : 'Hiển thị công khai'}</span>
          </button>
        </div>
      </div>

      {/* 5. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#748092]" />
          <input
            type="text"
            placeholder="Tìm tên học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#F1E5D8] dark:border-[#2B3A4F] bg-white dark:bg-[#1E293B] text-xs text-[#243447] dark:text-white focus:outline-none focus:border-[#E85D3F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#748092] hover:text-[#243447]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#748092] shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} />
            <span>Cấp độ:</span>
          </span>
          {['all', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                playClickSound();
                setLevelFilter(lvl);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                levelFilter === lvl
                  ? 'bg-[#E85D3F] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] text-[#748092] dark:text-[#94A3B8] hover:text-[#243447] dark:hover:text-white'
              }`}
            >
              {lvl === 'all' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Leaderboard Table with Promotion / Safe / Relegation Zones */}
      <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#E85D3F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#748092] font-semibold">Đang tải bảng vàng học viên...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Trophy size={36} className="text-[#748092] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#243447] dark:text-white">Không tìm thấy học viên phù hợp</h3>
            <p className="text-xs text-[#748092]">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại giải đấu.</p>
          </div>
        ) : (
          <div>
            {/* Zone Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50/70 dark:bg-gray-800/40 border-b border-[#F1E5D8] dark:border-[#2B3A4F] text-[10px] text-[#748092] dark:text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUp size={12} />
                  <span>Top 1 - 5: Khu vực thăng hạng</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-500">
                  <Minus size={12} />
                  <span>Khu vực trụ hạng</span>
                </span>
                {filteredList.length > 8 && (
                  <span className="flex items-center gap-1 font-bold text-rose-500">
                    <ArrowDown size={12} />
                    <span>Khu vực nguy cơ rớt hạng</span>
                  </span>
                )}
              </div>
              <span className="font-mono">{filteredList.length} học viên tham gia</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold text-[#748092] uppercase tracking-wider bg-[#FFF9F2]/60 dark:bg-[#131B24]/60">
              <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
              <div className="col-span-6 sm:col-span-5">Học viên</div>
              <div className="hidden sm:block sm:col-span-3 text-center">Giải đấu & Danh hiệu</div>
              <div className="col-span-4 sm:col-span-3 text-right">Điểm kinh nghiệm</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#F1E5D8] dark:divide-[#2B3A4F]">
              {filteredList.map((item) => {
                const isTop1 = item.rank === 1;
                const isTop2 = item.rank === 2;
                const isTop3 = item.rank === 3;
                const itemLeague = getLeagueByXp(item.xp);

                // Promotion / Relegation Zone tagging
                const isPromotionZone = item.rank <= 5;
                const isRelegationZone = filteredList.length > 8 && item.rank > (filteredList.length - 3);

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 px-5 py-3.5 items-center transition-colors relative ${
                      item.isCurrentUser
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-l-[#E85D3F]'
                        : isPromotionZone
                        ? 'hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 border-l-2 border-l-emerald-500/40'
                        : isRelegationZone
                        ? 'hover:bg-rose-50/30 dark:hover:bg-rose-950/20 border-l-2 border-l-rose-500/40'
                        : 'hover:bg-[#FFF9F2]/40 dark:hover:bg-[#131B24]/40 border-l-2 border-l-transparent'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center font-black">
                      {isTop1 ? (
                        <span className="text-xl" title="Quán Quân">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-xl" title="Á Quân 1">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-xl" title="Á Quân 2">🥉</span>
                      ) : (
                        <span className="w-7 h-7 rounded-xl bg-[#F1E5D8]/60 dark:bg-[#2B3A4F]/60 text-[#243447] dark:text-white text-xs flex items-center justify-center font-mono">
                          #{item.rank}
                        </span>
                      )}

                      {/* Zone mini indicator under rank */}
                      {isPromotionZone && (
                        <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 sm:hidden">
                          ▲ Thăng
                        </span>
                      )}
                      {isRelegationZone && (
                        <span className="text-[8px] font-bold text-rose-500 mt-0.5 sm:hidden">
                          ▼ Nguy cơ
                        </span>
                      )}
                    </div>

                    {/* Learner Info */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FEF7E9] to-[#FDE8BF] dark:from-[#2D2619] dark:to-[#382E19] flex items-center justify-center text-[#D97706] font-bold text-sm border border-[#F4B942]/30">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.name} className="w-full h-full rounded-2xl object-cover" />
                          ) : (
                            (item.name || 'H').charAt(0).toUpperCase()
                          )}
                        </div>
                        {item.streak >= 3 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playClickSound();
                              setShowStreakModal(true);
                            }}
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] shadow-xs cursor-pointer hover:scale-110 transition-transform"
                            title={`${item.streak} ngày streak (Bấm để xem chuỗi)`}
                          >
                            🔥
                          </button>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold truncate ${item.isCurrentUser ? 'text-[#E85D3F]' : 'text-[#243447] dark:text-white'}`}>
                            {item.name}
                          </span>
                          {item.isCurrentUser && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E85D3F] text-white">
                              Tôi
                            </span>
                          )}
                          {isPromotionZone && (
                            <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              ▲ Thăng hạng
                            </span>
                          )}
                          {isRelegationZone && (
                            <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              ▼ Cần tăng tốc
                            </span>
                          )}
                          {item.role === 'admin' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                              Admin
                            </span>
                          )}
                          {item.isOptedOut && item.isCurrentUser && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              Ẩn danh
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#748092] dark:text-[#94A3B8] mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 font-semibold">
                            {item.level}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <span>{itemLeague.icon}</span>
                            <span className="font-semibold">{itemLeague.name}</span>
                          </span>
                          <span>•</span>
                          <span>🔥 {item.streak} ngày</span>
                        </div>
                      </div>
                    </div>

                    {/* Honorific & League Badge */}
                    <div className="hidden sm:flex sm:col-span-3 items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${itemLeague.badge}`}>
                        {itemLeague.icon} {itemLeague.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${item.honorificStyle}`}>
                        {item.honorific}
                      </span>
                    </div>

                    {/* Total XP */}
                    <div className="col-span-4 sm:col-span-3 text-right">
                      <div className="font-mono font-black text-sm text-[#E85D3F] flex items-center justify-end gap-1">
                        <Zap size={13} className="fill-[#E85D3F]" />
                        <span>{(item.xp ?? 0).toLocaleString()}</span>
                        <span className="text-[10px] font-sans font-bold text-[#748092]">XP</span>
                      </div>
                      <div className="text-[10px] text-[#748092] dark:text-[#94A3B8] sm:hidden truncate">
                        {itemLeague.name} • {item.honorific}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. Sticky User Rank Bar (Thanh Ghim Vị Trí Của Bạn) */}
      {data.currentUserEntry && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-4xl p-3 sm:p-4 rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white border-2 border-amber-400/40 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E85D3F] to-[#CB4529] flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20 shrink-0">
              {data.currentUserEntry.avatar ? (
                <img src={data.currentUserEntry.avatar} alt="Me" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                'Tôi'
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold truncate">
                  {data.currentUserEntry.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E85D3F] text-white shrink-0">
                  Hạng #{data.currentUserRank}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${userLeague.badge} shrink-0`}>
                  {userLeague.icon} {userLeague.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/70 mt-0.5">
                <span className="font-mono font-bold text-amber-300">
                  {(data.currentUserEntry.xp ?? 0).toLocaleString()} XP
                </span>
                <span>•</span>
                <span className="text-orange-300">
                  🔥 {data.currentUserEntry.streak} ngày streak
                </span>
                {data.currentUserRank > 1 && data.gapToNext > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-white/80">
                      Cần <strong className="text-amber-300 font-mono">+{data.gapToNext} XP</strong> để lên #{data.currentUserRank - 1}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowStreakModal(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              title="Mở bảng chuỗi học"
            >
              <Flame size={14} className="text-orange-400 fill-orange-400" />
              <span className="hidden sm:inline">Chuỗi</span>
            </button>

            {onNavigateTab && (
              <button
                onClick={() => {
                  playClickSound();
                  onNavigateTab('roadmap');
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#E85D3F] hover:from-amber-600 hover:to-[#D44B2E] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>Cày điểm ngay</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8. Modal: Quy tắc xếp hạng & kiếm XP */}
      {showRulesModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              playClickSound();
              setShowRulesModal(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1E293B] border border-[#F1E5D8] dark:border-[#2B3A4F] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#243447] dark:text-white">
                    Quy Tắc Đấu Trường XP & Xếp Hạng
                  </h3>
                  <p className="text-xs text-[#748092]">
                    Cách tích lũy điểm và thăng hạng trên HanziGo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 rounded-xl text-[#748092] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 5 Giải đấu */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                <Crown size={14} className="text-amber-500" />
                <span>5 Hạng đấu danh giá (Leagues):</span>
              </div>
              <div className="space-y-1.5">
                {LEAGUES.map((l) => (
                  <div key={l.id} className="p-2.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#131B24] border border-[#F1E5D8] dark:border-[#2B3A4F] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{l.icon}</span>
                      <div>
                        <div className="font-bold text-[#243447] dark:text-white">{l.name} ({l.hanzi})</div>
                        <div className="text-[10px] text-[#748092]">{l.desc}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">≥ {l.minXp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cách kiếm XP */}
            <div className="space-y-2 pt-2 border-t border-[#F1E5D8] dark:border-[#2B3A4F]">
              <div className="text-xs font-bold text-[#243447] dark:text-white flex items-center gap-1.5">
                <Zap size={14} className="text-[#E85D3F]" />
                <span>Cách tích lũy XP:</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <span className="text-[#243447] dark:text-white font-medium">Hoàn thành bài học lộ trình HSK</span>
                  <span className="font-mono font-bold text-[#E85D3F]">+50 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <span className="text-[#243447] dark:text-white font-medium">Vượt ải Boss cuối chặng</span>
                  <span className="font-mono font-bold text-amber-500">+200 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <span className="text-[#243447] dark:text-white font-medium">Luyện phát âm chuẩn xác với AI</span>
                  <span className="font-mono font-bold text-emerald-600">+15 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <span className="text-[#243447] dark:text-white font-medium">Tập viết chữ Hán thuận nét</span>
                  <span className="font-mono font-bold text-orange-500">+15 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <span className="text-[#243447] dark:text-white font-medium">Duy trì Streak học mỗi ngày</span>
                  <span className="font-mono font-bold text-purple-600">+20 - 30 XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#E85D3F] hover:bg-[#CB4529] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Đã hiểu, quay lại bảng xếp hạng
            </button>
          </div>
        </div>
      )}

      {/* 9. Streak Details Modal */}
      <StreakModal 
        isOpen={showStreakModal} 
        onClose={() => setShowStreakModal(false)} 
        user={user} 
        onNavigateTab={onNavigateTab}
      />

    </div>
  );
}
